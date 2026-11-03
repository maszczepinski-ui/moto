// Taryfikator mandatów i punktów karnych (stan na listopad 2026).
// Stawki za prędkość obowiązują od 17.09.2022; od 3.03.2026 zatrzymanie prawa jazdy za >50 km/h także poza obszarem
// zabudowanym na drogach jednojezdniowych dwukierunkowych. Przy zmianie przepisów popraw liczby tutaj – reszta strony przeliczy się sama.

export const STAN_PRZEPISOW = 'listopad 2026';

export interface Przedzial {
  od: number;
  do: number | null;
  kwota: number;
  recydywa: number | null;
  punkty: number;
  slug: string;
}

export const PREDKOSC: Przedzial[] = [
  { od: 1, do: 10, kwota: 50, recydywa: null, punkty: 1, slug: 'do-10-km-h' },
  { od: 11, do: 15, kwota: 100, recydywa: null, punkty: 2, slug: 'o-11-15-km-h' },
  { od: 16, do: 20, kwota: 200, recydywa: null, punkty: 3, slug: 'o-16-20-km-h' },
  { od: 21, do: 25, kwota: 300, recydywa: null, punkty: 5, slug: 'o-21-25-km-h' },
  { od: 26, do: 30, kwota: 400, recydywa: null, punkty: 7, slug: 'o-26-30-km-h' },
  { od: 31, do: 40, kwota: 800, recydywa: 1600, punkty: 9, slug: 'o-31-40-km-h' },
  { od: 41, do: 50, kwota: 1000, recydywa: 2000, punkty: 11, slug: 'o-41-50-km-h' },
  { od: 51, do: 60, kwota: 1500, recydywa: 3000, punkty: 13, slug: 'o-51-60-km-h' },
  { od: 61, do: 70, kwota: 2000, recydywa: 4000, punkty: 14, slug: 'o-61-70-km-h' },
  { od: 71, do: null, kwota: 2500, recydywa: 5000, punkty: 15, slug: 'powyzej-70-km-h' }
];

export function przedzialDla(przekroczenie: number): Przedzial | undefined {
  if (przekroczenie <= 0) return undefined;
  return PREDKOSC.find((p) => przekroczenie >= p.od && (p.do === null || przekroczenie <= p.do)) || PREDKOSC[PREDKOSC.length - 1];
}

export const opisPrzedzialu = (p: Przedzial) => (p.do === null ? `o więcej niż ${p.od - 1} km/h` : p.od === 1 ? `do ${p.do} km/h` : `o ${p.od}–${p.do} km/h`);

export type Teren = 'zabudowany' | 'jednojezdniowa' | 'inna';

export const TERENY: Record<Teren, string> = {
  zabudowany: 'Obszar zabudowany',
  jednojezdniowa: 'Poza obszarem zabudowanym – droga jednojezdniowa dwukierunkowa',
  inna: 'Poza obszarem zabudowanym – droga dwujezdniowa (ekspresówka, autostrada)'
};

/** Czy przy takim przekroczeniu policja obowiązkowo zatrzymuje prawo jazdy na 3 miesiące */
export function zatrzymaniePrawaJazdy(przekroczenie: number, teren: Teren): boolean {
  return przekroczenie > 50 && (teren === 'zabudowany' || teren === 'jednojezdniowa');
}

export interface Wykroczenie {
  id: string;
  nazwa: string;
  kwota: string;
  recydywa?: string;
  punkty: number;
}

/** Najczęstsze wykroczenia poza prędkością (kwoty i punkty potwierdzone w co najmniej dwóch źródłach) */
export const WYKROCZENIA: Wykroczenie[] = [
  { id: 'telefon', nazwa: 'Telefon w ręku podczas jazdy (także na światłach)', kwota: '500 zł', punkty: 12 },
  { id: 'pasy', nazwa: 'Brak zapiętych pasów', kwota: '100 zł', punkty: 5 },
  { id: 'fotelik', nazwa: 'Przewożenie dziecka bez fotelika', kwota: '300 zł', punkty: 5 },
  { id: 'czerwone', nazwa: 'Przejazd na czerwonym świetle', kwota: '500 zł', punkty: 15 },
  { id: 'pieszy', nazwa: 'Nieustąpienie pierwszeństwa pieszemu na przejściu', kwota: '1500 zł', recydywa: '3000 zł', punkty: 15 },
  { id: 'wyprzedzanie-przejscie', nazwa: 'Wyprzedzanie na przejściu dla pieszych lub tuż przed nim', kwota: '1500 zł', recydywa: '3000 zł', punkty: 15 },
  { id: 'przejazd-kolejowy', nazwa: 'Wjazd na przejazd kolejowy przy czerwonym świetle', kwota: '2000 zł', recydywa: '4000 zł', punkty: 15 }
];

export const LIMIT_PUNKTOW = { doswiadczony: 24, mlody: 20 };

export const ZRODLA = [
  { nazwa: 'CUK – Taryfikator mandatów 2026', url: 'https://cuk.pl/porady/taryfikator-mandatow' },
  { nazwa: 'Autogaleria – Mandaty 2026, punkty karne i recydywa', url: 'https://autogaleria.pl/mandaty-2026-taryfikator-punkty-karne-predkosc' },
  { nazwa: 'Factolex – Taryfikator mandatów 2026', url: 'https://www.factolex.pl/taryfikator-mandatow-2026/' }
];
