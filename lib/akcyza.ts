// Kalkulator akcyzy i pełnych kosztów sprowadzenia auta – stawki i opłaty (stan na listopad 2026).
// ŻEBY ZMIENIĆ STAWKĘ LUB OPŁATĘ: popraw liczbę w STAWKI_AKCYZY albo OPLATY – kalkulator przeliczy się sam.
// Źródła: ustawa o podatku akcyzowym art. 104–105 (podstawa i stawki), rankomat.pl (VII 2026, stawki hybryd i PHEV),
// otomoto.pl (X 2026, kolejność cło → akcyza → VAT przy imporcie, 0% cła dla aut z USA od 1.07.2026),
// motokracja.pl (X 2026, opłaty rejestracyjne – podwyżka do 92,50 zł za tablice wciąż w projekcie), serwmot.pl (badanie 149 zł, LPG 245 zł).

export const STAN_AKCYZY = 'listopad 2026';

export type Naped = 'spalinowy' | 'hev' | 'mhev' | 'phev' | 'bev' | 'fcev';

export const NAPEDY: { id: Naped; nazwa: string }[] = [
  { id: 'spalinowy', nazwa: 'Benzyna, diesel lub LPG' },
  { id: 'hev', nazwa: 'Hybryda klasyczna (HEV)' },
  { id: 'mhev', nazwa: 'Miękka hybryda (MHEV, „mild hybrid”)' },
  { id: 'phev', nazwa: 'Hybryda plug-in (PHEV)' },
  { id: 'bev', nazwa: 'Elektryczny (BEV)' },
  { id: 'fcev', nazwa: 'Wodorowy (FCEV)' }
];

/** Stawki akcyzy w % (art. 105). Progi pojemności: do 2000 cm³, 2001–3500 cm³, powyżej 3500 cm³. */
export const STAWKI_AKCYZY = {
  spalinowy: { do2000: 3.1, do3500: 18.6, powyzej: 18.6 },
  hybryda: { do2000: 1.55, do3500: 9.3, powyzej: 18.6 },
  /** PHEV do 2000 cm³ – zwolnienie do 31.12.2029 */
  phev: { do2000: 0, do3500: 9.3, powyzej: 18.6 },
  zeroemisyjny: { do2000: 0, do3500: 0, powyzej: 0 }
};
export const ZWOLNIENIE_PHEV_DO = '31.12.2029';

export const OPLATY = {
  /** badanie techniczne przed pierwszą rejestracją w Polsce (auto osobowe) */
  badanie: 149,
  /** dopłata za badanie instalacji LPG */
  badanieLpg: 96,
  dowodRejestracyjny: 54,
  tabliceZwykle: 80,
  tabliceIndywidualne: 1000,
  znakiLegalizacyjne: 12.5,
  pozwolenieCzasowe: 13.5,
  /** opłata skarbowa za zaświadczenie VAT-25 (auto z UE) */
  vat25: 160,
  /** cło na samochody osobowe spoza UE */
  clo: 10,
  /** cło na auta wyprodukowane w USA (od 1.07.2026, porozumienie UE–USA) */
  cloUsa: 0,
  vatImport: 23
};

export type Waluta = 'PLN' | 'EUR' | 'USD' | 'GBP' | 'CHF';
export const WALUTY: Waluta[] = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];

export interface DaneImportu {
  cena: number;
  waluta: Waluta;
  /** kurs waluty → zł (dla PLN = 1) */
  kurs: number;
  pojemnosc: number;
  naped: Naped;
  lpg: boolean;
  skad: 'ue' | 'spoza-ue';
  /** auto wyprodukowane w USA (0% cła) */
  produkcjaUsa: boolean;
  /** koszt transportu i ubezpieczenia do granicy UE (w walucie zakupu) – wchodzi do wartości celnej */
  transportDoUe: number;
  /** transport do Polski / do domu (zł) – tylko do sumy, nie do podatków (przy aucie z UE) */
  transportZl: number;
  tlumaczenia: number;
  tabliceIndywidualne: boolean;
}

export interface Pozycja {
  nazwa: string;
  kwota: number;
  opis?: string;
}

export interface WynikImportu {
  cenaZl: number;
  stawka: number;
  stawkaOpis: string;
  podstawaAkcyzy: number;
  akcyza: number;
  clo: number;
  vat: number;
  podatki: Pozycja[];
  urzedowe: Pozycja[];
  inne: Pozycja[];
  sumaKosztow: number;
  razemZAutem: number;
  uwagi: string[];
}

const zaokr = (n: number) => Math.round(n * 100) / 100;
/** akcyzę i podatki zaokrągla się do pełnych złotych */
const pelne = (n: number) => Math.round(n);

export function stawkaAkcyzy(naped: Naped, pojemnosc: number): { stawka: number; opis: string } {
  const prog = pojemnosc <= 2000 ? 'do2000' : pojemnosc <= 3500 ? 'do3500' : 'powyzej';
  const zakres = prog === 'do2000' ? 'do 2000 cm³' : prog === 'do3500' ? '2001–3500 cm³' : 'powyżej 3500 cm³';
  if (naped === 'bev' || naped === 'fcev') return { stawka: 0, opis: 'auto zeroemisyjne – zwolnione z akcyzy' };
  if (naped === 'phev')
    return { stawka: STAWKI_AKCYZY.phev[prog], opis: prog === 'do2000' ? `hybryda plug-in ${zakres} – zwolnienie do ${ZWOLNIENIE_PHEV_DO}` : `hybryda plug-in ${zakres}` };
  if (naped === 'hev') return { stawka: STAWKI_AKCYZY.hybryda[prog], opis: `hybryda ${zakres}` };
  // MHEV – liczymy ostrożnie jak spalinowy (patrz uwagi)
  return { stawka: STAWKI_AKCYZY.spalinowy[prog], opis: `silnik spalinowy ${zakres}` };
}

export function policzImport(d: DaneImportu): WynikImportu {
  const kurs = d.waluta === 'PLN' ? 1 : d.kurs;
  const cenaZl = zaokr(d.cena * kurs);
  const { stawka, opis } = stawkaAkcyzy(d.naped, d.pojemnosc);
  const uwagi: string[] = [];

  let clo = 0;
  let vat = 0;
  let podstawa = cenaZl;
  if (d.skad === 'spoza-ue') {
    // wartość celna = cena + transport i ubezpieczenie do granicy UE; akcyza od wartości celnej + cło (art. 104 ust. 1 pkt 3)
    const wartoscCelna = zaokr(cenaZl + d.transportDoUe * kurs);
    const stawkaCla = d.produkcjaUsa ? OPLATY.cloUsa : OPLATY.clo;
    clo = pelne((wartoscCelna * stawkaCla) / 100);
    podstawa = wartoscCelna + clo;
  }
  const akcyza = pelne((podstawa * stawka) / 100);
  if (d.skad === 'spoza-ue') vat = pelne(((podstawa + akcyza) * OPLATY.vatImport) / 100);

  const podatki: Pozycja[] = [{ nazwa: 'Akcyza', kwota: akcyza, opis: `${String(stawka).replace('.', ',')}% – ${opis}` }];
  if (d.skad === 'spoza-ue') {
    podatki.push({ nazwa: 'Cło', kwota: clo, opis: d.produkcjaUsa ? '0% – auto wyprodukowane w USA' : `${OPLATY.clo}% wartości celnej` });
    podatki.push({ nazwa: 'VAT z importu', kwota: vat, opis: `${OPLATY.vatImport}% od wartości celnej + cła + akcyzy` });
  }

  const urzedowe: Pozycja[] = [
    { nazwa: 'Badanie techniczne przed rejestracją', kwota: OPLATY.badanie + (d.lpg ? OPLATY.badanieLpg : 0), opis: d.lpg ? 'z instalacją LPG' : undefined },
    { nazwa: 'Dowód rejestracyjny', kwota: OPLATY.dowodRejestracyjny },
    d.tabliceIndywidualne ? { nazwa: 'Tablice indywidualne', kwota: OPLATY.tabliceIndywidualne } : { nazwa: 'Tablice rejestracyjne', kwota: OPLATY.tabliceZwykle },
    { nazwa: 'Znaki legalizacyjne', kwota: OPLATY.znakiLegalizacyjne },
    { nazwa: 'Pozwolenie czasowe', kwota: OPLATY.pozwolenieCzasowe }
  ];
  if (d.skad === 'ue') urzedowe.push({ nazwa: 'Zaświadczenie VAT-25', kwota: OPLATY.vat25, opis: 'opłata skarbowa w urzędzie skarbowym' });

  const inne: Pozycja[] = [];
  if (d.tlumaczenia > 0) inne.push({ nazwa: 'Tłumaczenia przysięgłe', kwota: d.tlumaczenia });
  if (d.skad === 'spoza-ue' && d.transportDoUe > 0) inne.push({ nazwa: 'Transport i ubezpieczenie do UE', kwota: zaokr(d.transportDoUe * kurs), opis: 'wliczone też do wartości celnej' });
  if (d.transportZl > 0) inne.push({ nazwa: 'Transport do domu', kwota: d.transportZl });

  const suma = (l: Pozycja[]) => l.reduce((s, p) => s + p.kwota, 0);
  const sumaKosztow = zaokr(suma(podatki) + suma(urzedowe) + suma(inne));

  if (d.naped === 'mhev')
    uwagi.push('Miękkie hybrydy (MHEV) urzędy skarbowe kwalifikują różnie. Policzyliśmy ostrożnie stawkę jak dla auta spalinowego – jeśli urząd uzna auto za hybrydę, akcyza będzie o połowę niższa.');
  if (d.skad === 'ue')
    uwagi.push('Akcyzę liczy się od ceny z umowy lub faktury, ale urząd może przyjąć wyższą, rynkową wartość, jeśli cena jest zaniżona. Używane auto od osoby prywatnej z UE nie wymaga dopłaty VAT w Polsce (inaczej przy aucie „nowym” – do 6 miesięcy lub 6000 km).');
  if (d.skad === 'spoza-ue')
    uwagi.push('Cło 0% dotyczy tylko aut wyprodukowanych w USA (miejsce produkcji widać w numerze VIN). Auto kupione w USA, ale zrobione np. w Meksyku czy Kanadzie, płaci zwykłe cło.');
  if (d.waluta !== 'PLN') uwagi.push('W deklaracji akcyzowej przelicz cenę po kursie średnim NBP z daty wskazanej w instrukcji do formularza – kalkulator używa wpisanego kursu.');

  return { cenaZl, stawka, stawkaOpis: opis, podstawaAkcyzy: pelne(podstawa), akcyza, clo, vat, podatki, urzedowe, inne, sumaKosztow, razemZAutem: zaokr(cenaZl + sumaKosztow), uwagi };
}
