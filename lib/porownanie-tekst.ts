// Tekst porównania „A czy B” układany z danych CEPiK obu kart.
// Każde zdanie opiera się na liczbach konkretnej pary, więc tekst jest inny dla każdego porównania.
import type { CarModel, Udzial } from '@/types/car-model';
import { nazwaKarty, zaglebie, najwiecej } from '@/lib/opis';
import { fmt } from '@/lib/format';
import { wWoj } from '@/lib/wojewodztwa';
import { ocenyKarty } from '@/lib/plusy-minusy';

export interface SekcjaPorownania {
  h2: string;
  akapity: string[];
}
export interface TekstPorownania {
  sekcje: SekcjaPorownania[];
  dlaKogo: { auto: string; adres: string; punkty: string[] }[];
  faq: { q: string; a: string }[];
}

export const udzial = (l: Udzial[], ...n: string[]) => {
  const znane = l.filter((u) => u.nazwa !== 'Inne / brak danych');
  const s = znane.reduce((x, u) => x + u.liczba, 0) || 1;
  return znane.filter((u) => n.some((k) => u.nazwa.startsWith(k))).reduce((x, u) => x + u.liczba, 0) / s;
};
export const proc = (x: number) => `${Math.round(x * 100)}%`;
const przec = (x: number, d = 1) => x.toFixed(d).replace('.', ',');
const malaLitera = (t: string) => (t.length > 1 && t[1] === t[1].toLowerCase() ? t[0].toLowerCase() + t.slice(1) : t);

/** Suma pierwszych rejestracji w ostatnich 12 pełnych miesiącach i w 12 miesiącach wcześniej */
function rejestracje12(m: CarModel) {
  const r = m.cepik.rejestracjeMiesiecznie || [];
  if (r.length < 24) return null;
  const ost = r.slice(-12).reduce((s, x) => s + x.liczba, 0);
  const wcz = r.slice(-24, -12).reduce((s, x) => s + x.liczba, 0);
  return { ost, wcz, zmiana: wcz ? ost / wcz - 1 : 0 };
}

function wiek(m: CarModel) {
  const rok = Number(m.cepik.stanNa.slice(0, 4));
  const r = m.cepik.roczniki;
  const s = r.reduce((x, y) => x + y.liczba, 0) || 1;
  const mlode = r.filter((x) => x.rok >= rok - 5).reduce((a, b) => a + b.liczba, 0) / s;
  const stare = r.filter((x) => x.rok <= rok - 15).reduce((a, b) => a + b.liczba, 0) / s;
  return { mlode, stare };
}

function paliwa(m: CarModel) {
  const p = m.cepik.paliwa;
  return {
    benzyna: udzial(p, 'Benzyna'),
    diesel: udzial(p, 'Diesel', 'Hybryda (diesel'),
    lpg: udzial(p, 'Benzyna + LPG', 'Diesel + LPG'),
    hybryda: udzial(p, 'Hybryda'),
    elektryk: udzial(p, 'Elektryczny')
  };
}

function opisPaliw(n: string, x: ReturnType<typeof paliwa>) {
  const cz = [
    [x.benzyna - x.lpg, 'benzyna'],
    [x.diesel, 'diesel'],
    [x.lpg, 'benzyna z LPG'],
    [x.hybryda, 'hybrydy'],
    [x.elektryk, 'elektryki']
  ]
    .filter(([v]) => (v as number) >= 0.03)
    .sort((a, b) => (b[0] as number) - (a[0] as number))
    .map(([v, t]) => `${t} ${proc(v as number)}`);
  return `${n}: ${cz.join(', ')}`;
}

function pojemnosci(m: CarModel) {
  const z = m.cepik.pojemnosci.filter((x) => /\d/.test(x.nazwa));
  const s = z.reduce((a, b) => a + b.liczba, 0) || 1;
  return z.slice(0, 2).map((x) => `${x.nazwa} (${proc(x.liczba / s)})`);
}

export function tekstPorownania(a: CarModel, b: CarModel): TekstPorownania {
  const A = nazwaKarty(a), B = nazwaKarty(b);
  const ca = a.cepik, cb = b.cepik;
  const tenSamModel = a.markaSlug === b.markaSlug && a.modelSlug === b.modelSlug;
  const sekcje: SekcjaPorownania[] = [];

  // 1. Popularność i trend
  const ra = rejestracje12(a), rb = rejestracje12(b);
  const pop: string[] = [];
  const r = ca.liczbaWPolsce / Math.max(1, cb.liczbaWPolsce);
  pop.push(
    r >= 1.3
      ? `W polskiej bazie CEPiK zarejestrowanych jest ${fmt(ca.liczbaWPolsce)} aut ${A} i ${fmt(cb.liczbaWPolsce)} aut ${B} – pierwszego modelu jest ${przec(r)}× więcej. W praktyce oznacza to większy wybór ogłoszeń, łatwiej dostępne części i więcej mechaników, którzy znają ten samochód.`
      : `Oba auta są w Polsce podobnie popularne: w CEPiK jest ${fmt(ca.liczbaWPolsce)} aut ${A} i ${fmt(cb.liczbaWPolsce)} aut ${B}. Przy takiej skali ani wybór egzemplarzy, ani dostęp do części nie powinny przesądzać o decyzji.`
  );
  if (ra && rb && (ra.ost >= 50 || rb.ost >= 50)) {
    const opisZm = (z: number) => (Math.abs(z) < 0.1 ? 'mniej więcej tyle samo co' : z > 0 ? `o ${proc(z)} więcej niż` : `o ${proc(-z)} mniej niż`);
    pop.push(
      `W ostatnich 12 miesiącach po raz pierwszy zarejestrowano w Polsce ${fmt(ra.ost)} aut ${A} (${opisZm(ra.zmiana)} rok wcześniej) i ${fmt(rb.ost)} aut ${B} (${opisZm(rb.zmiana)} rok wcześniej). Liczą się tu zarówno auta nowe z salonów, jak i używane sprowadzone z zagranicy.`
    );
    const [szybszy, wolniejszy] = ra.zmiana >= rb.zmiana ? [A, B] : [B, A];
    if (Math.abs(ra.zmiana - rb.zmiana) >= 0.2) pop.push(`To ${szybszy} zyskuje dziś na popularności szybciej niż ${wolniejszy}.`);
  }
  sekcje.push({ h2: `Który jest popularniejszy: ${A} czy ${B}?`, akapity: pop });

  // 2. Rynek wtórny – wiek i pochodzenie
  const wa = wiek(a), wb = wiek(b);
  const sa = udzial(ca.pochodzenie, 'Nowy z polskiego salonu'), sb = udzial(cb.pochodzenie, 'Nowy z polskiego salonu');
  const ia = udzial(ca.pochodzenie, 'Sprowadzony z zagranicy'), ib = udzial(cb.pochodzenie, 'Sprowadzony z zagranicy');
  const ryn: string[] = [];
  if (ca.sredniRocznik && cb.sredniRocznik)
    ryn.push(
      `Średni rocznik zarejestrowanych egzemplarzy to ${Math.round(ca.sredniRocznik)} dla ${A} i ${Math.round(cb.sredniRocznik)} dla ${B}. Auta nie starsze niż 5 lat to ${proc(wa.mlode)} wszystkich ${A} i ${proc(wb.mlode)} wszystkich ${B}${
        wa.stare >= 0.05 || wb.stare >= 0.05 ? `, a takich, które mają 15 lat i więcej – odpowiednio ${proc(wa.stare)} i ${proc(wb.stare)}` : ''
      }.`
    );
  ryn.push(
    `Z polskiego salonu pochodzi ${proc(sa)} aut ${A} i ${proc(sb)} aut ${B}, a sprowadzonych używanych z zagranicy jest odpowiednio ${proc(ia)} i ${proc(ib)}. ${
      Math.abs(sa - sb) >= 0.1
        ? `Jeśli zależy Ci na aucie z udokumentowaną historią serwisową w Polsce, łatwiej je znaleźć wśród ${sa > sb ? A : B}.`
        : Math.abs(ia - ib) >= 0.1
          ? `Wyraźnie częściej sprowadzany z zagranicy jest ${ia > ib ? A : B} – przy takich autach szczególnie ważne jest sprawdzenie przebiegu i historii uszkodzeń.`
          : 'Pod tym względem oba modele wypadają podobnie.'
    } Niezależnie od wyboru warto sprawdzić historię konkretnego egzemplarza po numerze VIN.`
  );
  sekcje.push({ h2: 'Rynek używanych: wiek i pochodzenie aut', akapity: ryn });

  // 3. Silniki i paliwa
  const pa = paliwa(a), pb = paliwa(b);
  const sil: string[] = [];
  sil.push(`Udział rodzajów paliwa wśród zarejestrowanych aut – ${opisPaliw(A, pa)}; ${opisPaliw(B, pb)}.`);
  const pjA = pojemnosci(a), pjB = pojemnosci(b);
  if (pjA.length && pjB.length) sil.push(`Najczęstsze pojemności silnika to ${pjA.join(' i ')} w przypadku ${A} oraz ${pjB.join(' i ')} w przypadku ${B}.`);
  if (Math.abs(pa.diesel - pb.diesel) >= 0.15)
    sil.push(
      `Szukając diesla, łatwiej trafisz na ${pa.diesel > pb.diesel ? A : B}. Diesel opłaca się głównie przy dużych przebiegach i jeździe w trasie – przy krótkich miejskich odcinkach filtr cząstek stałych (DPF) nie ma kiedy się wypalić.`
    );
  if (pa.lpg >= 0.08 || pb.lpg >= 0.08)
    sil.push(
      `Instalację LPG ma ${proc(pa.lpg)} aut ${A} i ${proc(pb.lpg)} aut ${B}. ${pa.lpg > pb.lpg ? A : B} jest więc częściej wybierany przez kierowców, którzy liczą każdą złotówkę na paliwie.`
    );
  if (pa.hybryda + pa.elektryk >= 0.05 || pb.hybryda + pb.elektryk >= 0.05)
    sil.push(
      `Hybrydy i elektryki to ${proc(pa.hybryda + pa.elektryk)} aut ${A} i ${proc(pb.hybryda + pb.elektryk)} aut ${B}. Napęd hybrydowy najwięcej daje w mieście, gdzie auto często hamuje i odzyskuje energię.`
    );
  sekcje.push({ h2: 'Silniki i paliwa', akapity: sil });

  // 4. Wymiary (gdy są w atlasie)
  if (a.wymiary && b.wymiary) {
    const dl = a.wymiary.dlugoscMm - b.wymiary.dlugoscMm, ro = a.wymiary.rozstawOsiMm - b.wymiary.rozstawOsiMm;
    sekcje.push({
      h2: 'Wymiary i miejsce w środku',
      akapity: [
        `${A} ma ${fmt(a.wymiary.dlugoscMm)} mm długości i ${fmt(a.wymiary.rozstawOsiMm)} mm rozstawu osi, a ${B} – ${fmt(b.wymiary.dlugoscMm)} mm i ${fmt(b.wymiary.rozstawOsiMm)} mm.${
          a.wymiary.bagaznik && b.wymiary.bagaznik ? ` Bagażnik: ${a.wymiary.bagaznik} wobec ${b.wymiary.bagaznik}.` : ''
        } ${
          Math.abs(ro) >= 40
            ? `Większy rozstaw osi ${ro > 0 ? A : B} zwykle przekłada się na więcej miejsca na nogi z tyłu.`
            : Math.abs(dl) >= 80
              ? `${dl > 0 ? B : A} jest krótszy, więc łatwiej nim zaparkować w mieście.`
              : 'Różnice w wymiarach są niewielkie.'
        }`
      ]
    });
  }

  // 5. Gdzie jeżdżą
  const za = zaglebie(a), zb = zaglebie(b), na = najwiecej(a), nb = najwiecej(b);
  if (za && zb && na && nb)
    sekcje.push({
      h2: 'Gdzie w Polsce jeździ ich najwięcej',
      akapity: [
        `${na.teryt === nb.teryt ? `Najwięcej aut obu modeli jest zarejestrowanych ${wWoj(na.teryt)}.` : `Najwięcej aut ${A} jest zarejestrowanych ${wWoj(na.teryt)}, a ${B} – ${wWoj(nb.teryt)}.`} Biorąc pod uwagę liczbę wszystkich aut w regionie, ${
          za.najczesciej.teryt === zb.najczesciej.teryt
            ? `oba są najpopularniejsze ${wWoj(za.najczesciej.teryt)} (${A} ${przec(za.najczesciej.indeks)}×, ${B} ${przec(zb.najczesciej.indeks)}× częściej niż średnio w kraju).`
            : `${A} jest najpopularniejszy ${wWoj(za.najczesciej.teryt)} (${przec(za.najczesciej.indeks)}× częściej niż średnio), a ${B} ${wWoj(zb.najczesciej.teryt)} (${przec(zb.najczesciej.indeks)}×).`
        } Tam też najłatwiej o wybór ogłoszeń.`
      ]
    });

  // Dla kogo
  const dlaKogo = [
    { m: a, n: A, inny: b, p: pa, pi: pb, s: sa, si: sb, w: wa, wi: wb, rr: ra, ri: rb },
    { m: b, n: B, inny: a, p: pb, pi: pa, s: sb, si: sa, w: wb, wi: wa, rr: rb, ri: ra }
  ].map((x) => {
    const pkt: string[] = [];
    if (x.m.cepik.liczbaWPolsce >= x.inny.cepik.liczbaWPolsce * 1.3) pkt.push('chcesz mieć duży wybór ogłoszeń i łatwy dostęp do części');
    if (x.p.diesel >= x.pi.diesel + 0.15) pkt.push('dużo jeździsz w trasie i szukasz diesla');
    if (x.p.lpg >= x.pi.lpg + 0.05 && x.p.lpg >= 0.08) pkt.push('planujesz jeździć na LPG');
    if (x.p.hybryda + x.p.elektryk >= x.pi.hybryda + x.pi.elektryk + 0.1) pkt.push('jeździsz głównie po mieście i chcesz hybrydę albo elektryka');
    if (x.s >= x.si + 0.1) pkt.push('wolisz auto z polskiego salonu ze znaną historią');
    if (x.w.mlode >= x.wi.mlode + 0.1) pkt.push('szukasz możliwie młodego egzemplarza – wśród ogłoszeń będzie więcej aut z ostatnich lat');
    if (x.w.stare >= x.wi.stare + 0.1) pkt.push('masz mniejszy budżet – na rynku jest dużo starszych, tańszych egzemplarzy');
    if (x.m.wymiary && x.inny.wymiary && x.m.wymiary.rozstawOsiMm >= x.inny.wymiary.rozstawOsiMm + 40) pkt.push('wozisz rodzinę i liczy się miejsce z tyłu');
    if (tenSamModel && x.m.cepik.sredniRocznik && x.inny.cepik.sredniRocznik && x.m.cepik.sredniRocznik > x.inny.cepik.sredniRocznik) pkt.push('chcesz nowszą konstrukcję i nowocześniejsze wyposażenie');
    if (x.rr && x.ri && x.rr.zmiana >= x.ri.zmiana + 0.2) pkt.push('chcesz auto, które dziś zyskuje na popularności');
    if (!pkt.length) pkt.push('bardziej odpowiada Ci jego wygląd, wyposażenie i to, jak się prowadzi – w danych CEPiK oba auta wypadają bardzo podobnie');
    return { auto: x.n, adres: x.m.adres, punkty: pkt };
  });

  // Plusy i minusy (gdy zatwierdzone w panelu) – tylko tytuły, rozwinięcia są na kartach
  const oa = ocenyKarty(a)[0], ob = ocenyKarty(b)[0];
  if (oa || ob) {
    const ak: string[] = [];
    for (const [o, n] of [
      [oa, A],
      [ob, B]
    ] as const)
      if (o) ak.push(`${n} (${o.lata}) – zalety: ${o.zalety.slice(0, 3).map((z) => malaLitera(z.tytul)).join(', ')}; wady: ${o.wady.slice(0, 3).map((z) => malaLitera(z.tytul)).join(', ')}.`);
    sekcje.push({ h2: 'Zalety i wady w skrócie', akapity: ak });
  }

  const faq = [
    { q: `${A} czy ${B} – który jest popularniejszy w Polsce?`, a: pop[0] },
    { q: `Który jest częściej sprowadzany z zagranicy: ${A} czy ${B}?`, a: `Sprowadzone używane auta to ${proc(ia)} wszystkich ${A} i ${proc(ib)} wszystkich ${B}. Z polskiego salonu pochodzi odpowiednio ${proc(sa)} i ${proc(sb)} aut.` },
    { q: `Który ma więcej diesli: ${A} czy ${B}?`, a: `Diesle to ${proc(pa.diesel)} zarejestrowanych aut ${A} i ${proc(pb.diesel)} aut ${B}. Benzyna (także z LPG) to odpowiednio ${proc(pa.benzyna)} i ${proc(pb.benzyna)}.` },
    {
      q: `Który wybrać: ${A} czy ${B}?`,
      a: dlaKogo.map((d) => `Wybierz ${d.auto}, jeśli ${d.punkty.join(', ')}.`).join(' ')
    }
  ];
  if (ca.sredniRocznik && cb.sredniRocznik)
    faq.splice(2, 0, {
      q: `Które auta są młodsze: ${A} czy ${B}?`,
      a: `Średni rocznik to ${Math.round(ca.sredniRocznik)} dla ${A} i ${Math.round(cb.sredniRocznik)} dla ${B}. Auta do 5 lat to ${proc(wa.mlode)} i ${proc(wb.mlode)} wszystkich zarejestrowanych egzemplarzy.`
    });

  return { sekcje, dlaKogo, faq };
}
