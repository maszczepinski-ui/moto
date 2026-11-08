// Strefy czystego transportu na karcie modelu: które roczniki tego modelu wjadą do SCT i do kiedy.
// Liczone automatycznie z lat produkcji i paliw (CEPiK) oraz zasad stref z lib/sct.ts – bez ręcznych danych.
// Uwaga: liczymy po roczniku. Auto ze starszego rocznika, ale z wyższą normą Euro, może wjechać – to mówi kalkulator SCT.
import type { CarModel } from '@/types/car-model';
import { MIASTA_SCT, ocen, type Paliwo } from '@/lib/sct';

export type Kolor = 'zielony' | 'zolty' | 'pomaranczowy' | 'czerwony';
export interface Odcinek {
  od: number;
  do: number;
  tekst: string;
  kolor: Kolor;
}
export interface GrupaSct {
  paliwo: 'benzyna' | 'diesel';
  nazwa: string;
  udzial: number;
  miasta: { id: string; nazwa: string; odcinki: Odcinek[] }[];
}
export interface SctModelu {
  od: number;
  do: number;
  grupy: GrupaSct[];
  /** model głównie elektryczny – wjeżdża zawsze */
  elektryczny: boolean;
  plakietka: { tekst: string; kolor: Kolor };
  faq: { pytanie: string; odpowiedz: string };
}

/**
 * Zakres roczników: początek z lat produkcji („1991–2026 (kombi do 2027)” → 1991),
 * koniec – późniejszy z dwóch: lata produkcji albo ostatni rocznik, którego w CEPiK jest sporo
 * (część kart ma za wcześnie wpisany koniec produkcji, np. Golf „do 2018”).
 */
function lata(m: CarModel): [number, number] | null {
  const r = m.lataProdukcji.match(/(\d{4})\s*[–-]\s*(\d{4})/);
  const prog = Math.max(50, 0.003 * (m.cepik.liczbaWPolsce || 0));
  const liczne = (m.cepik.roczniki || []).filter((x) => x.liczba >= prog).map((x) => x.rok);
  if (r) return [Number(r[1]), Math.max(Number(r[2]), ...liczne)];
  return liczne.length ? [Math.min(...liczne), Math.max(...liczne)] : null;
}

function udzialy(m: CarModel) {
  const p = m.cepik.paliwa || [];
  const suma = p.reduce((s, x) => s + x.liczba, 0) || 1;
  let benzyna = 0;
  let diesel = 0;
  let elektryczny = 0;
  for (const x of p) {
    const n = x.nazwa.toLowerCase();
    if (n.startsWith('diesel')) diesel += x.liczba;
    else if (n.startsWith('elektryczny')) elektryczny += x.liczba;
    else if (n.startsWith('benzyna') || n.startsWith('hybryda')) benzyna += x.liczba;
  }
  return { benzyna: benzyna / suma, diesel: diesel / suma, elektryczny: elektryczny / suma };
}

export function sctModelu(m: CarModel, rokTeraz = new Date().getFullYear()): SctModelu | null {
  const zakres = lata(m);
  if (!zakres) return null;
  const [od, doR] = [Math.max(zakres[0], 1980), Math.min(zakres[1], rokTeraz + 1)];
  const u = udzialy(m);
  const nazwa = `${m.marka} ${m.model}${m.generacja ? ` ${m.generacja}` : ''}`;

  if (u.elektryczny >= 0.9) {
    return {
      od,
      do: doR,
      grupy: [],
      elektryczny: true,
      plakietka: { tekst: 'SCT: auta elektryczne wjeżdżają bez ograniczeń', kolor: 'zielony' },
      faq: { pytanie: `Czy ${nazwa} wjedzie do strefy czystego transportu?`, odpowiedz: 'Tak. Auta elektryczne mogą wjeżdżać do każdej strefy czystego transportu z mocy ustawy o elektromobilności.' }
    };
  }

  const grupy: GrupaSct[] = [];
  for (const [paliwo, udzial, nazwaPal] of [
    ['benzyna', u.benzyna, 'Benzyna, LPG i hybryda'],
    ['diesel', u.diesel, 'Diesel']
  ] as const) {
    if (udzial < 0.05) continue;
    const miasta = MIASTA_SCT.map((miasto) => {
      const odcinki: Odcinek[] = [];
      for (let rok = od; rok <= doR; rok++) {
        const w = ocen({ paliwo: paliwo as Paliwo, rocznik: rok, zwolnienia: [] }, miasto, rokTeraz).werdykt;
        const [tekst, kolor]: [string, Kolor] =
          w.typ === 'bez-ograniczen'
            ? ['wjedzie bez ograniczeń', 'zielony']
            : w.typ === 'do-roku'
              ? [`wjedzie do końca ${w.rok} r.`, 'zolty']
              : w.typ === 'oplata'
                ? [`tylko za opłatą (do ${w.doRoku} r.)`, 'pomaranczowy']
                : w.typ === 'zakaz'
                  ? ['zakaz wjazdu', 'czerwony']
                  : ['brak danych', 'zolty'];
        const ost = odcinki[odcinki.length - 1];
        if (ost && ost.tekst === tekst) ost.do = rok;
        else odcinki.push({ od: rok, do: rok, tekst, kolor });
      }
      return { id: miasto.id, nazwa: miasto.nazwa, odcinki };
    });
    grupy.push({ paliwo, nazwa: nazwaPal, udzial, miasta });
  }
  if (!grupy.length) return null;

  const kolory = grupy.flatMap((g) => g.miasta.flatMap((mi) => mi.odcinki.map((o) => o.kolor)));
  const plakietka: { tekst: string; kolor: Kolor } = kolory.every((k) => k === 'zielony')
    ? { tekst: 'SCT Warszawa i Kraków: wszystkie roczniki wjadą bez ograniczeń', kolor: 'zielony' }
    : kolory.every((k) => k === 'czerwony')
      ? { tekst: 'SCT Warszawa i Kraków: zakaz wjazdu – sprawdź zwolnienia', kolor: 'czerwony' }
      : { tekst: 'SCT Warszawa i Kraków: część roczników z ograniczeniami', kolor: 'zolty' };

  // Odpowiedź do FAQ: od którego rocznika auto wjedzie dziś bez ograniczeń w czasie / dziś w ogóle (Warszawa)
  const zdania = grupy.map((g) => {
    const waw = g.miasta.find((x) => x.id === 'warszawa');
    const dzis = waw?.odcinki.find((o) => o.kolor !== 'czerwony');
    const zawsze = waw?.odcinki.find((o) => o.kolor === 'zielony');
    const nazwaG = g.paliwo === 'benzyna' ? 'wersje benzynowe (także z LPG i hybrydy)' : 'diesle';
    if (!dzis) return `${nazwaG} – żaden rocznik nie spełnia dziś wymagań`;
    return `${nazwaG} wjadą dziś od rocznika ${dzis.od}${zawsze ? `, a bez ograniczeń czasowych od rocznika ${zawsze.od}` : ''}`;
  });
  const krk = MIASTA_SCT.find((x) => x.id === 'krakow');
  const faq = {
    pytanie: `Czy ${nazwa} wjedzie do strefy czystego transportu?`,
    odpowiedz: `W Warszawie ${zdania.join('; ')}.${
      krk ? ` W Krakowie benzyna wymaga rocznika ${krk.etapy[0].benzyna.rocznikOd}, a diesel ${krk.etapy[0].diesel.rocznikOd}${krk.platnyWjazdDo ? ` (do końca ${krk.platnyWjazdDo} r. starsze auta wjadą za opłatą)` : ''}.` : ''
    } Liczymy po roczniku – auto z wyższą normą Euro może wjechać wcześniej.`
  };
  return { od, do: doR, grupy, elektryczny: false, plakietka, faq };
}
