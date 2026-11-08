// Strefy czystego transportu (SCT) – dane i logika kalkulatora „Czy wjadę do strefy?”.
// ŻEBY DODAĆ MIASTO: dopisz obiekt do MIASTA_SCT (etapy, zwolnienia, opłaty). Reszta strony przeliczy się sama.
// Stan na listopad 2026. Źródła: warszawa19115.pl (SCT Warszawa), krakowskiraport.pl (SCT Kraków, X 2026),
// ustawa o elektromobilności art. 39 ust. 1–2 (wjazd aut elektrycznych, wodorowych i na gaz ziemny).

export const STAN_SCT = 'listopad 2026';

/** Normy Euro w kolejności od najstarszej. „6dT” = Euro 6d-TEMP. */
export const NORMY_EURO = ['Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'Euro 6dT', 'Euro 6d', 'Euro 7'] as const;
export type NormaEuro = (typeof NORMY_EURO)[number];
const pozycja = (n: NormaEuro) => NORMY_EURO.indexOf(n);

export type Paliwo = 'benzyna' | 'diesel' | 'hybryda-benzyna' | 'hybryda-diesel' | 'elektryczny' | 'wodor' | 'cng';

export const PALIWA: { id: Paliwo; nazwa: string; opis?: string }[] = [
  { id: 'benzyna', nazwa: 'Benzyna / LPG' },
  { id: 'diesel', nazwa: 'Diesel' },
  { id: 'hybryda-benzyna', nazwa: 'Hybryda z silnikiem benzynowym (HEV, PHEV, MHEV)', opis: 'Hybrydy nie mają ustawowego zwolnienia – liczy się norma silnika spalinowego.' },
  { id: 'hybryda-diesel', nazwa: 'Hybryda z dieslem' },
  { id: 'elektryczny', nazwa: 'Elektryczny (BEV)' },
  { id: 'wodor', nazwa: 'Wodorowy (FCEV)' },
  { id: 'cng', nazwa: 'Gaz ziemny (CNG)' }
];

/** Elektryczne, wodorowe i na gaz ziemny mogą wjeżdżać do każdej SCT z mocy ustawy (art. 39 ust. 1 ustawy o elektromobilności) */
const ZAWSZE_WJADA: Paliwo[] = ['elektryczny', 'wodor', 'cng'];

/** Do której grupy wymagań należy auto (hybryda = jej silnik spalinowy, LPG = benzyna) */
const grupa = (p: Paliwo): 'benzyna' | 'diesel' => (p === 'diesel' || p === 'hybryda-diesel' ? 'diesel' : 'benzyna');

export type Wymaganie = { euro: NormaEuro; rocznikOd: number };

export interface Etap {
  /** pierwszy dzień obowiązywania (RRRR-MM-DD) */
  od: string;
  benzyna: Wymaganie;
  diesel: Wymaganie;
}

export type IdZwolnienia = 'zabytkowy' | 'niepelnosprawnosc' | 'mieszkaniec-waw' | 'senior-waw' | 'mieszkaniec-krk';

export interface Zwolnienie {
  id: IdZwolnienia;
  nazwa: string;
  warunek: string;
  /** do kiedy działa (rok włącznie); brak = bezterminowo */
  doRoku?: number;
}

export interface MiastoSct {
  id: string;
  nazwa: string;
  /** „w Warszawie”, „w Krakowie” */
  wMiescie: string;
  /** od kiedy działa strefa (RRRR-MM-DD) */
  start: string;
  obszar: string;
  etapy: Etap[];
  zwolnienia: Zwolnienie[];
  /** wjazd autem niespełniającym norm za opłatą (dla osób bez zwolnienia) – do tego roku włącznie */
  platnyWjazdDo?: number;
  platnyWjazdOpis?: string;
  /** czy miasto ogłosiło etapy po ostatnim z listy */
  uwagaKoniec?: string;
  kara: string;
  zrodlo: { n: string; url: string };
}

export const MIASTA_SCT: MiastoSct[] = [
  {
    id: 'warszawa',
    nazwa: 'Warszawa',
    wMiescie: 'w Warszawie',
    start: '2024-07-01',
    obszar: 'Śródmieście i części sąsiednich dzielnic (ok. 7% powierzchni miasta).',
    etapy: [
      { od: '2024-07-01', benzyna: { euro: 'Euro 2', rocznikOd: 1997 }, diesel: { euro: 'Euro 4', rocznikOd: 2005 } },
      { od: '2026-01-01', benzyna: { euro: 'Euro 3', rocznikOd: 2000 }, diesel: { euro: 'Euro 5', rocznikOd: 2009 } },
      { od: '2028-01-01', benzyna: { euro: 'Euro 4', rocznikOd: 2005 }, diesel: { euro: 'Euro 6', rocznikOd: 2014 } },
      { od: '2030-01-01', benzyna: { euro: 'Euro 5', rocznikOd: 2009 }, diesel: { euro: 'Euro 6dT', rocznikOd: 2017 } },
      { od: '2032-01-01', benzyna: { euro: 'Euro 6', rocznikOd: 2014 }, diesel: { euro: 'Euro 6d', rocznikOd: 2020 } }
    ],
    zwolnienia: [
      { id: 'zabytkowy', nazwa: 'Pojazd historyczny (żółte tablice)', warunek: 'Potrzebna nalepka uprawniająca do wjazdu.' },
      { id: 'niepelnosprawnosc', nazwa: 'Karta parkingowa osoby z niepełnosprawnością', warunek: 'Auto oznaczone kartą parkingową wjeżdża bez ograniczeń.' },
      {
        id: 'mieszkaniec-waw',
        nazwa: 'Mieszkam w Warszawie i tu płacę podatki',
        warunek: 'Auto ostatnio rejestrowane przed 1 stycznia 2024 r. Zwolnienie działa do końca 2027 r.',
        doRoku: 2027
      },
      {
        id: 'senior-waw',
        nazwa: 'Senior 70+ (Warszawa)',
        warunek: 'Ukończone 70 lat do końca 2023 r. i auto posiadane od 31 grudnia 2023 r. – jedno auto, bezterminowo.'
      }
    ],
    uwagaKoniec: 'Ostatni zapowiedziany etap zaczyna się w 2032 r.',
    kara: 'do 500 zł',
    zrodlo: { n: 'Warszawa 19115 – Strefa Czystego Transportu', url: 'https://warszawa19115.pl/pl/-/strefa-czystego-transportu-sct' }
  },
  {
    id: 'krakow',
    nazwa: 'Kraków',
    wMiescie: 'w Krakowie',
    start: '2026-01-01',
    obszar: 'Obszar wewnątrz IV obwodnicy (ok. 60% miasta).',
    etapy: [{ od: '2026-01-01', benzyna: { euro: 'Euro 4', rocznikOd: 2005 }, diesel: { euro: 'Euro 6', rocznikOd: 2014 } }],
    zwolnienia: [
      { id: 'zabytkowy', nazwa: 'Pojazd zabytkowy', warunek: 'Auto wpisane do rejestru przez wojewódzkiego konserwatora zabytków.' },
      { id: 'niepelnosprawnosc', nazwa: 'Karta parkingowa osoby z niepełnosprawnością', warunek: 'Jedno auto na podstawie karty parkingowej.' },
      {
        id: 'mieszkaniec-krk',
        nazwa: 'Mieszkam w Krakowie (meldunek i PIT w Krakowie)',
        warunek: 'Auto posiadane przed 26 czerwca 2025 r. – trzeba je zgłosić w systemie SCT i odnawiać uprawnienie co roku.'
      }
    ],
    platnyWjazdDo: 2028,
    platnyWjazdOpis: 'Auto niespełniające norm wjedzie za opłatą: w 2026 r. 2,50 zł/h, 5 zł/dzień lub 100 zł/miesiąc. Stawki na 2027–2028 mogą się zmienić.',
    uwagaKoniec: 'Miasto nie ogłosiło kolejnych zaostrzeń po 2028 r. Wiosną 2027 r. może się odbyć referendum w sprawie strefy.',
    kara: 'do 500 zł',
    zrodlo: { n: 'Krakowski Raport – SCT Kraków 2026 (X 2026)', url: 'https://krakowskiraport.pl/artykul/2095-strefa-czystego-transportu-w-krakowie-2026-kto-moze-wjechac-ile-kosztuje-wjazd-i' }
  }
];

export interface DaneAuta {
  paliwo: Paliwo;
  /** rok produkcji (opcjonalnie) */
  rocznik?: number;
  /** norma Euro (opcjonalnie) */
  euro?: NormaEuro;
  zwolnienia: IdZwolnienia[];
}

/** Czy auto spełnia jedno wymaganie (wystarczy norma Euro ALBO rok produkcji) */
export function spelnia(a: DaneAuta, w: Wymaganie): boolean {
  const poEuro = a.euro ? pozycja(a.euro) >= pozycja(w.euro) : false;
  const poRoczniku = a.rocznik ? a.rocznik >= w.rocznikOd : false;
  return poEuro || poRoczniku;
}

export type StanRoku = 'brak-strefy' | 'wjazd' | 'zwolnienie' | 'oplata' | 'zakaz';
export type Werdykt =
  | { typ: 'bez-ograniczen'; powod: string }
  | { typ: 'do-roku'; rok: number; powod: string }
  | { typ: 'oplata'; doRoku: number; powod: string }
  | { typ: 'zakaz'; powod: string }
  | { typ: 'brak-danych' };

export interface WynikMiasta {
  miasto: MiastoSct;
  werdykt: Werdykt;
  /** rok → stan (do osi czasu) */
  lata: { rok: number; stan: StanRoku }[];
}

/** Wymaganie obowiązujące w danym roku (etap aktywny przez większą część roku – od 1 stycznia lub od lipca) */
function etapWRoku(m: MiastoSct, rok: number): Etap | undefined {
  const aktywne = m.etapy.filter((e) => Number(e.od.slice(0, 4)) <= rok);
  return aktywne[aktywne.length - 1];
}

export const ROK_OD = 2024;
export const ROK_DO = 2034;

export function ocen(a: DaneAuta, m: MiastoSct, rokTeraz: number): WynikMiasta {
  const brakDanych = !ZAWSZE_WJADA.includes(a.paliwo) && !a.rocznik && !a.euro;
  const g = grupa(a.paliwo);
  const zw = m.zwolnienia.filter((z) => a.zwolnienia.includes(z.id));
  const zwBezterminowe = zw.find((z) => !z.doRoku);
  const zwDo = Math.max(0, ...zw.filter((z) => z.doRoku).map((z) => z.doRoku!));

  const stan = (rok: number): StanRoku => {
    if (rok < Number(m.start.slice(0, 4))) return 'brak-strefy';
    if (ZAWSZE_WJADA.includes(a.paliwo)) return 'wjazd';
    const e = etapWRoku(m, rok);
    if (!e || spelnia(a, e[g])) return 'wjazd';
    if (zwBezterminowe || rok <= zwDo) return 'zwolnienie';
    if (m.platnyWjazdDo && rok <= m.platnyWjazdDo) return 'oplata';
    return 'zakaz';
  };
  const lata = Array.from({ length: ROK_DO - ROK_OD + 1 }, (_, i) => ({ rok: ROK_OD + i, stan: stan(ROK_OD + i) }));
  if (brakDanych) return { miasto: m, werdykt: { typ: 'brak-danych' }, lata };

  const przyszle = lata.filter((l) => l.rok >= rokTeraz);
  const teraz = przyszle[0]?.stan || 'wjazd';
  const pierwszyZakaz = przyszle.find((l) => l.stan === 'zakaz' || l.stan === 'oplata');

  let werdykt: Werdykt;
  if (ZAWSZE_WJADA.includes(a.paliwo)) werdykt = { typ: 'bez-ograniczen', powod: 'Auta elektryczne, wodorowe i na gaz ziemny wjeżdżają do strefy z mocy ustawy.' };
  else if (teraz === 'zakaz') werdykt = { typ: 'zakaz', powod: 'Auto nie spełnia obecnych wymagań i nie ma zwolnienia.' };
  else if (teraz === 'oplata') {
    const doRoku = Math.max(...przyszle.filter((l) => l.stan === 'oplata').map((l) => l.rok));
    werdykt = { typ: 'oplata', doRoku, powod: m.platnyWjazdOpis || '' };
  } else if (!pierwszyZakaz) {
    werdykt = { typ: 'bez-ograniczen', powod: zwBezterminowe ? `Zwolnienie: ${zwBezterminowe.nazwa.toLowerCase()}.` : 'Auto spełnia wszystkie zapowiedziane etapy.' };
  } else if (pierwszyZakaz.stan === 'oplata') {
    werdykt = { typ: 'do-roku', rok: pierwszyZakaz.rok - 1, powod: `Potem tylko za opłatą (do ${m.platnyWjazdDo} r.).` };
  } else {
    const powod =
      teraz === 'zwolnienie' && zwDo ? `Działa zwolnienie do końca ${zwDo} r.` : `Od ${pierwszyZakaz.rok} r. wymagania zaostrzają się (${(etapWRoku(m, pierwszyZakaz.rok) || m.etapy[0])[g].euro}).`;
    werdykt = { typ: 'do-roku', rok: pierwszyZakaz.rok - 1, powod };
  }
  return { miasto: m, werdykt, lata };
}
