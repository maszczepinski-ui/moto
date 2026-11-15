// Tekst strony marki układany z danych CEPiK: sumujemy karty zbiorcze modeli marki.
// Każde zdanie stoi na liczbach tej marki, więc tekst jest inny na każdej stronie.
import type { Marka } from '@/lib/dane';
import type { Udzial } from '@/types/car-model';
import { getModelBySlug } from '@/lib/models';
import { fmt } from '@/lib/format';
import { udzial, proc } from '@/lib/porownanie-tekst';

export interface TekstMarki {
  sekcje: { h2: string; akapity: string[] }[];
  faq: { q: string; a: string }[];
}

const dodaj = (mapa: Map<string, number>, l: Udzial[]) => l.forEach((u) => mapa.set(u.nazwa, (mapa.get(u.nazwa) || 0) + u.liczba));
const naListe = (mapa: Map<string, number>): Udzial[] => [...mapa].map(([nazwa, liczba]) => ({ nazwa, liczba }));

export function tekstMarki(m: Marka): TekstMarki | null {
  const karty = m.modele.map((x) => getModelBySlug(x.slug)).filter((x): x is NonNullable<typeof x> => !!x);
  if (!karty.length) return null;
  const N = m.nazwa;
  const paliwa = new Map<string, number>(), poch = new Map<string, number>(), roczniki = new Map<number, number>(), mies = new Map<string, number>();
  let wKartach = 0;
  for (const k of karty) {
    const c = k.cepik;
    wKartach += c.liczbaWPolsce;
    dodaj(paliwa, c.paliwa);
    dodaj(poch, c.pochodzenie);
    c.roczniki.forEach((r) => roczniki.set(r.rok, (roczniki.get(r.rok) || 0) + r.liczba));
    (c.rejestracjeMiesiecznie || []).forEach((r) => mies.set(r.miesiac, (mies.get(r.miesiac) || 0) + r.liczba));
  }
  const P = naListe(paliwa), O = naListe(poch);
  const rok = Number(karty[0].cepik.stanNa.slice(0, 4));
  const sumaR = [...roczniki.values()].reduce((a, b) => a + b, 0) || 1;
  const sredni = [...roczniki].reduce((a, [r, l]) => a + r * l, 0) / sumaR;
  const mlode = [...roczniki].filter(([r]) => r >= rok - 5).reduce((a, [, l]) => a + l, 0) / sumaR;
  const stare = [...roczniki].filter(([r]) => r <= rok - 15).reduce((a, [, l]) => a + l, 0) / sumaR;
  const salon = udzial(O, 'Nowy z polskiego salonu'), import_ = udzial(O, 'Sprowadzony z zagranicy'), uzywPL = udzial(O, 'Kupiony w Polsce jako używany');
  const diesel = udzial(P, 'Diesel', 'Hybryda (diesel'), lpg = udzial(P, 'Benzyna + LPG', 'Diesel + LPG'), hyb = udzial(P, 'Hybryda'), ev = udzial(P, 'Elektryczny');
  const benz = udzial(P, 'Benzyna') - lpg;
  const pokrycie = wKartach / Math.max(1, m.auta);
  const sekcje: TekstMarki['sekcje'] = [];
  const faq: TekstMarki['faq'] = [];

  // 1. Modele
  const top = m.modele.slice(0, 3);
  const mod: string[] = [];
  if (top.length) {
    const u0 = top[0].liczba / m.auta;
    mod.push(
      `Najczęściej spotykanym modelem marki ${N} w Polsce jest ${N} ${top[0].nazwa} (${fmt(top[0].liczba)} zarejestrowanych aut, ${proc(u0)} wszystkich aut tej marki)${
        top.length > 1 ? `. Kolejne miejsca zajmują ${top.slice(1).map((x) => `${x.nazwa} (${fmt(x.liczba)})`).join(' i ')}` : ''
      }.${u0 >= 0.5 ? ` Marka jest więc w Polsce kojarzona przede wszystkim z jednym modelem.` : top.length > 2 && top.slice(0, 3).reduce((a, x) => a + x.liczba, 0) / m.auta < 0.5 ? ' Popularność rozkłada się na wiele modeli – żaden nie dominuje.' : ''}`
    );
    const najnowsze = [...m.modele].filter((x) => x.nowe > 0).sort((a, b) => b.nowe - a.nowe).slice(0, 3);
    if (m.nowe >= 500 && najnowsze.length)
      mod.push(`Wśród aut zarejestrowanych w Polsce po raz pierwszy od listopada 2019 r. (nowych i sprowadzonych) najwięcej to ${najnowsze.map((x) => `${N} ${x.nazwa} (${fmt(x.nowe)})`).join(', ')}.`);
    sekcje.push({ h2: `Najpopularniejsze modele ${N} w Polsce`, akapity: mod });
    faq.push({ q: `Jaki model ${N} jest najpopularniejszy w Polsce?`, a: mod[0] });
  }

  // 2. Sprzedaż dziś
  const kl = [...mies.keys()].sort();
  if (kl.length >= 24) {
    const ost = kl.slice(-12).reduce((a, k) => a + (mies.get(k) || 0), 0);
    const wcz = kl.slice(-24, -12).reduce((a, k) => a + (mies.get(k) || 0), 0);
    const zm = wcz ? ost / wcz - 1 : 0;
    const akap: string[] = [];
    if (mlode < 0.01 && ost >= 30)
      akap.push(`Nowych aut ${N} już się nie produkuje, a mimo to w ostatnich 12 miesiącach w Polsce zarejestrowano po raz pierwszy ${fmt(ost)} takich aut. To egzemplarze sprowadzone z zagranicy albo wracające na drogi po latach – często jako auta kolekcjonerskie.`);
    else if (ost < 30)
      akap.push(`W ostatnich 12 miesiącach w Polsce zarejestrowano po raz pierwszy zaledwie ${fmt(ost)} aut ${N}. Nowych aut tej marki praktycznie już się u nas nie kupuje – na drogach zostały egzemplarze sprzed lat, a ich liczba z roku na rok maleje.`);
    else
      akap.push(
        `W ostatnich 12 miesiącach w Polsce zarejestrowano po raz pierwszy ${fmt(ost)} aut ${N} – ${Math.abs(zm) < 0.1 ? 'mniej więcej tyle samo co' : zm > 0 ? `o ${proc(zm)} więcej niż` : `o ${proc(-zm)} mniej niż`} rok wcześniej. Liczą się tu zarówno auta nowe z salonów, jak i używane sprowadzone z zagranicy.`
      );
    sekcje.push({ h2: `Czy ${N} wciąż się sprzedaje?`, akapity: akap });
    faq.push({ q: `Ile aut ${N} rejestruje się w Polsce w ciągu roku?`, a: akap[0] });
  }

  // 3. Wiek i pochodzenie
  const wiek = [
    `Średni rocznik aut ${N} jeżdżących w Polsce to ${Math.round(sredni)}. Auta nie starsze niż 5 lat stanowią ${proc(mlode)} wszystkich egzemplarzy, a takie, które mają 15 lat i więcej – ${proc(stare)}. ${
      mlode >= 0.4 ? 'To marka z młodą flotą – na rynku wtórnym łatwo o niedawne roczniki.' : stare >= 0.95 ? 'To niemal wyłącznie auta starsze niż 15 lat – dziś w dużej części youngtimery i auta kolekcjonerskie, w których liczy się stan blacharki i oryginalność.' : stare >= 0.6 ? 'Większość aut tej marki to już samochody kilkunastoletnie – przy zakupie liczy się przede wszystkim stan konkretnego egzemplarza.' : ''
    }`.trim(),
    `${proc(salon)} aut ${N} kupiono jako nowe w polskim salonie, ${proc(import_)} to auta używane sprowadzone z zagranicy, a ${proc(uzywPL)} zmieniło właściciela w Polsce jako używane. ${
      import_ >= 0.4 ? `Duży udział aut sprowadzonych oznacza, że przed zakupem warto szczególnie dokładnie sprawdzić historię i przebieg po numerze VIN.` : salon >= 0.5 ? 'Przewaga aut z polskich salonów ułatwia znalezienie egzemplarza z udokumentowaną historią serwisową.' : ''
    }`.trim()
  ];
  sekcje.push({ h2: `Ile lat mają auta ${N} i skąd pochodzą`, akapity: wiek });
  faq.push({ q: `Czy auta ${N} w Polsce są częściej z salonu, czy sprowadzane?`, a: wiek[1] });

  // 4. Paliwa
  const czesci = (
    [
      [benz, 'benzyna'],
      [diesel, 'diesel'],
      [lpg, 'benzyna z LPG'],
      [hyb, 'hybrydy'],
      [ev, 'elektryki']
    ] as [number, string][]
  )
    .filter(([v]) => v >= 0.02)
    .sort((a, b) => b[0] - a[0])
    .map(([v, t]) => `${t} ${proc(v)}`);
  const pal = [`Rodzaje paliwa wśród zarejestrowanych aut ${N}: ${czesci.join(', ')}.`];
  if (lpg >= 0.1) pal.push(`Co ${Math.max(2, Math.round(1 / lpg))}. auto ${N} jeździ na gazie – silniki tej marki są w Polsce chętnie przerabiane na LPG.`);
  if (hyb + ev >= 0.1) pal.push(`Hybrydy i elektryki to już ${proc(hyb + ev)} aut ${N}.`);
  if (diesel >= 0.45) pal.push(`Prawie połowa lub więcej aut ${N} to diesle. Przy zakupie używanego diesla warto zwrócić uwagę na stan wtryskiwaczy, turbosprężarki i filtra cząstek stałych (DPF).`);
  sekcje.push({ h2: `Silniki i paliwa w autach ${N}`, akapity: pal });
  faq.push({ q: `Jakie paliwo mają najczęściej auta ${N}?`, a: pal[0] });

  return {
    sekcje,
    faq: [...faq, { q: `Ile aut ${N} jest w Polsce?`, a: `Według CEPiK w Polsce zarejestrowanych jest ${fmt(m.auta)} aut marki ${N}${pokrycie < 0.9 ? `. Szczegółowe statystyki (paliwa, wiek, pochodzenie) liczymy z ${m.modele.length} modeli, które mają w atlasie własną kartę – to ${proc(pokrycie)} aut marki` : ''}.` }],
  };
}

