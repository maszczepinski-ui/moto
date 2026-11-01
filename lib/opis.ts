// Teksty składane z danych CEPiK (data-to-text). Dzięki temu każda karta ma własny, konkretny opis
// zamiast powtarzalnego szablonu: zdania zależą od liczby aut, pochodzenia, paliwa, wieku i regionu.
import { CarModel, Udzial } from '@/types/car-model';
import { fmt, sztuk } from '@/lib/format';
import { nazwaWojewodztwa } from '@/lib/wojewodztwa';
import tlo from '@/data/cepik/tlo.json';

const tloWoj = tlo.wojewodztwa as Record<string, number>;

/** Stały „los” zależny od nazwy karty – ta sama karta zawsze dostaje te same sformułowania */
function wybor<T>(slug: string, sol: string, opcje: T[]): T {
  let h = 0;
  for (const ch of slug + sol) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return opcje[h % opcje.length];
}

const proc = (x: number) => `${Math.round(x * 100)}%`;
const przecinek = (x: number, m = 1) => x.toFixed(m).replace('.', ',');

function udzial(lista: Udzial[], ...nazwy: string[]) {
  const znane = lista.filter((u) => u.nazwa !== 'Inne / brak danych');
  const suma = znane.reduce((s, u) => s + u.liczba, 0);
  if (!suma) return 0;
  return znane.filter((u) => nazwy.some((n) => u.nazwa.startsWith(n))).reduce((s, u) => s + u.liczba, 0) / suma;
}

export function nazwaKarty(m: CarModel) {
  return `${m.marka} ${m.model} ${m.generacja}`.trim();
}

/** Województwo, w którym model jest najczęstszy względem średniej („zagłębie”) */
export function zaglebie(m: CarModel) {
  const suma = m.cepik.wojewodztwa.reduce((s, w) => s + w.liczba, 0);
  if (!suma) return null;
  const udzialPL = suma / tlo.razem;
  const lista = m.cepik.wojewodztwa
    .filter((w) => tloWoj[w.teryt])
    .map((w) => ({ teryt: w.teryt, liczba: w.liczba, indeks: w.liczba / tloWoj[w.teryt] / udzialPL }))
    .sort((a, b) => b.indeks - a.indeks);
  return lista.length ? { najczesciej: lista[0], najrzadziej: lista[lista.length - 1] } : null;
}

export function najwiecej(m: CarModel) {
  return [...m.cepik.wojewodztwa].sort((a, b) => b.liczba - a.liczba)[0];
}

/** Zajawka rynkowa: 3–6 zdań o tym, jak model wypada na polskim rynku */
export function zajawkaRynkowa(m: CarModel): string[] {
  const c = m.cepik;
  const n = c.liczbaWPolsce;
  const nazwa = nazwaKarty(m);
  const zd: string[] = [];

  // 1. skala
  if (n >= 300000)
    zd.push(wybor(m.slug, 'skala', [
      `${nazwa} to jeden z najczęściej spotykanych samochodów w Polsce – w CEPiK jest ${fmt(n)} zarejestrowanych egzemplarzy.`,
      `W polskiej bazie pojazdów zarejestrowanych jest ${fmt(n)} aut ${nazwa}, co stawia ten model w ścisłej czołówce kraju.`
    ]));
  else if (n >= 100000)
    zd.push(wybor(m.slug, 'skala', [
      `${nazwa} to bardzo popularny model: w Polsce zarejestrowano ${fmt(n)} egzemplarzy.`,
      `Z ${fmt(n)} zarejestrowanymi egzemplarzami ${nazwa} należy do aut, które mija się na drodze codziennie.`
    ]));
  else if (n >= 20000)
    zd.push(wybor(m.slug, 'skala', [
      `W Polsce zarejestrowanych jest ${fmt(n)} aut ${nazwa} – to model dobrze znany na rynku wtórnym.`,
      `${nazwa} ma w Polsce ${fmt(n)} zarejestrowanych egzemplarzy, więc wybór na rynku używanych aut jest spory.`
    ]));
  else if (n >= 3000)
    zd.push(wybor(m.slug, 'skala', [
      `${nazwa} jest w Polsce spotykany regularnie, choć nie masowo: w CEPiK widnieje ${fmt(n)} ${sztuk(n)}.`,
      `W bazie CEPiK jest ${fmt(n)} ${sztuk(n)} ${nazwa} – to model średnio popularny.`
    ]));
  else
    zd.push(`${nazwa} to w Polsce rzadkość – w całym kraju zarejestrowano tylko ${fmt(n)} ${sztuk(n)}.`);

  if (c.miejsce && c.miejsceWMarce && c.modeliWMarce && c.modeliWMarce > 1)
    zd.push(
      `W naszym zestawieniu zajmuje ${c.miejsce}. miejsce wśród wszystkich modeli i ${c.miejsceWMarce}. wśród ${c.modeliWMarce} modeli marki ${m.marka}.`
    );

  // 2. pochodzenie
  const imp = udzial(c.pochodzenie, 'Sprowadzony z zagranicy (używany)');
  const salon = udzial(c.pochodzenie, 'Nowy z polskiego salonu');
  if (imp >= 0.6) zd.push(`Większość egzemplarzy (${proc(imp)}) trafiła do Polski jako auta używane z zagranicy.`);
  else if (salon >= 0.5) zd.push(`Ponad połowa (${proc(salon)}) to auta kupione jako nowe w polskich salonach.`);
  else if (imp > 0 && salon > 0)
    zd.push(`Mniej więcej ${proc(imp)} aut sprowadzono z zagranicy jako używane, a ${proc(salon)} kupiono nowe w polskich salonach.`);

  // 3. paliwo
  const lpg = udzial(c.paliwa, 'Benzyna + LPG', 'Diesel + LPG');
  const diesel = udzial(c.paliwa, 'Diesel', 'Hybryda (diesel');
  const hyb = udzial(c.paliwa, 'Hybryda');
  const ev = udzial(c.paliwa, 'Elektryczny');
  if (ev >= 0.5) zd.push(`To przede wszystkim auto elektryczne – ${proc(ev)} egzemplarzy ma napęd wyłącznie na prąd.`);
  else if (hyb >= 0.3) zd.push(`Aż ${proc(hyb)} zarejestrowanych egzemplarzy to hybrydy.`);
  else if (lpg >= 0.25) zd.push(`Co ${Math.max(2, Math.round(1 / lpg))}. egzemplarz jeździ na gazie – instalację LPG ma ${proc(lpg)} aut.`);
  else if (diesel >= 0.6) zd.push(`Dominują diesle: ${proc(diesel)} egzemplarzy ma silnik wysokoprężny.`);
  else if (diesel > 0 && diesel <= 0.15) zd.push(`Prawie wszystkie egzemplarze to benzyniaki – diesli jest tylko ${proc(diesel)}.`);

  // 4. wiek
  const r = c.sredniRocznik;
  if (r) {
    const wiek = new Date(c.stanNa).getFullYear() - r;
    zd.push(
      wiek >= 20
        ? `Średni rocznik to ${Math.round(r)}, więc typowy egzemplarz ma ponad ${Math.floor(wiek)} lat.`
        : wiek <= 4
        ? `To auta młode – średni rocznik to ${Math.round(r)}.`
        : `Średni rocznik zarejestrowanych egzemplarzy to ${Math.round(r)}.`
    );
  }

  // 5. region
  const z = zaglebie(m);
  if (z && z.najczesciej.indeks >= 1.25)
    zd.push(
      `Model jest wyraźnie popularniejszy w województwie ${nazwaWojewodztwa(z.najczesciej.teryt).toLowerCase()} – tam występuje ${przecinek(z.najczesciej.indeks)}× częściej niż średnio w kraju.`
    );

  // 6. trend nowych rejestracji
  const pr = (c.pierwszeRejestracje || []).filter((x) => x.rok >= 2020 && String(x.rok) !== c.stanNa.slice(0, 4));
  if (pr.length >= 2) {
    const [a, b] = pr.slice(-2);
    if (a.liczba >= 100 && b.liczba > a.liczba * 1.3)
      zd.push(`Model zyskuje na popularności: w ${b.rok} r. po raz pierwszy zarejestrowano w Polsce ${fmt(b.liczba)} ${sztuk(b.liczba)}, wobec ${fmt(a.liczba)} rok wcześniej.`);
    else if (a.liczba >= 100 && b.liczba < a.liczba * 0.7)
      zd.push(`Nowych rejestracji ubywa: w ${b.rok} r. było ich ${fmt(b.liczba)}, rok wcześniej ${fmt(a.liczba)}.`);
  }
  return zd;
}

/** Profil kierowcy i koszty – wnioski z danych (bez zgadywania cen) */
export function profilKierowcy(m: CarModel): string[] {
  const c = m.cepik;
  const zd: string[] = [];
  const diesel = udzial(c.paliwa, 'Diesel');
  const lpg = udzial(c.paliwa, 'Benzyna + LPG', 'Diesel + LPG');
  const hyb = udzial(c.paliwa, 'Hybryda');
  const imp = udzial(c.pochodzenie, 'Sprowadzony z zagranicy (używany)');
  const salon = udzial(c.pochodzenie, 'Nowy z polskiego salonu');
  const top = c.pojemnosci.find((p) => p.nazwa !== 'Inne / brak danych');
  if (top) zd.push(`Najczęstsza pojemność silnika to ${top.nazwa} (${proc(top.liczba / Math.max(1, c.pojemnosci.reduce((s, p) => s + p.liczba, 0)))} aut).`);
  if (diesel >= 0.5) zd.push('Przewaga diesli sugeruje auto dla osób robiących duże przebiegi – przy zakupie warto sprawdzić stan wtrysków, turbosprężarki i koła dwumasowego.');
  if (lpg >= 0.2) zd.push('Wysoki udział instalacji LPG oznacza, że łatwo kupić egzemplarz z gazem. Przy oględzinach warto zajrzeć do dokumentów instalacji i sprawdzić datę legalizacji butli.');
  if (hyb >= 0.2) zd.push('Duża część egzemplarzy to hybrydy – w mieście zwykle palą mniej niż odpowiedniki z samym silnikiem spalinowym.');
  if (imp >= 0.5) zd.push('Rynek wtórny opiera się na autach sprowadzanych, dlatego przed zakupem szczególnie warto sprawdzić historię egzemplarza po numerze VIN.');
  else if (salon >= 0.5) zd.push('Sporo egzemplarzy pochodzi z polskich salonów, więc łatwiej znaleźć auto z udokumentowaną historią serwisową w Polsce.');
  return zd;
}

export interface Pytanie {
  pytanie: string;
  odpowiedz: string;
}

/** FAQ z danych – pokazywane na stronie i opisane dla Google (FAQPage) */
export function faq(m: CarModel, maUbezpieczenia: boolean): Pytanie[] {
  const c = m.cepik;
  const nazwa = nazwaKarty(m);
  const lista: Pytanie[] = [];
  lista.push({
    pytanie: `Ile jest ${nazwa} w Polsce?`,
    odpowiedz: `Według danych CEPiK (stan na ${new Date(c.stanNa).toLocaleDateString('pl-PL')}) w Polsce zarejestrowanych jest ${fmt(c.liczbaWPolsce)} ${sztuk(c.liczbaWPolsce)} ${nazwa}.${
      c.noweOdPaczki ? ` ${fmt(c.noweOdPaczki)} z nich zarejestrowano w Polsce po raz pierwszy od listopada 2019 r.` : ''
    }`
  });
  const top = najwiecej(m);
  const z = zaglebie(m);
  if (top)
    lista.push({
      pytanie: `W którym województwie jest najwięcej ${nazwa}?`,
      odpowiedz: `Najwięcej egzemplarzy jest zarejestrowanych w województwie ${nazwaWojewodztwa(top.teryt).toLowerCase()} (${fmt(top.liczba)}).${
        z && z.najczesciej.teryt !== top.teryt && z.najczesciej.indeks >= 1.2
          ? ` Względem liczby wszystkich aut najpopularniejszy jest jednak w województwie ${nazwaWojewodztwa(z.najczesciej.teryt).toLowerCase()}.`
          : ''
      }`
    });
  const poj = c.pojemnosci.find((p) => p.nazwa !== 'Inne / brak danych');
  const pal = c.paliwa.find((p) => p.nazwa !== 'Inne / brak danych');
  if (poj && pal)
    lista.push({
      pytanie: `Jaki silnik jest najpopularniejszy w ${nazwa}?`,
      odpowiedz: `Najczęściej zarejestrowane są egzemplarze z silnikiem o pojemności ${poj.nazwa}. Najpopularniejsze paliwo to: ${pal.nazwa.toLowerCase()}.`
    });
  const imp = udzial(c.pochodzenie, 'Sprowadzony z zagranicy (używany)');
  const salon = udzial(c.pochodzenie, 'Nowy z polskiego salonu');
  if (imp + salon > 0)
    lista.push({
      pytanie: `Czy ${nazwa} to częściej auto z polskiego salonu, czy sprowadzone?`,
      odpowiedz: `${proc(salon)} egzemplarzy kupiono jako nowe w polskich salonach, a ${proc(imp)} sprowadzono z zagranicy jako używane.`
    });
  if (c.hybrydy && c.hybrydy >= c.liczbaWPolsce * 0.02)
    lista.push({
      pytanie: `Ile jest hybrydowych ${nazwa}?`,
      odpowiedz: `W Polsce zarejestrowanych jest ${fmt(c.hybrydy)} ${nazwa} z napędem hybrydowym${c.elektryczne ? ` i ${fmt(c.elektryczne)} w wersji w pełni elektrycznej` : ''}.`
    });
  if (maUbezpieczenia)
    lista.push({
      pytanie: `Ile kosztuje OC dla ${nazwa}?`,
      odpowiedz:
        'Cena OC zależy przede wszystkim od wieku i historii szkód kierowcy, miejsca zamieszkania, pojemności silnika i wartości auta. Różnice między ubezpieczycielami dla tego samego kierowcy potrafią być duże, dlatego najlepiej porównać kilka ofert w porównywarce.'
    });
  return lista;
}
