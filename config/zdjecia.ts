// Zdjęcia na stronie głównej i w nagłówkach działów.
// Domyślnie to darmowe zdjęcia z Unsplash (licencja Unsplash pozwala na użycie komercyjne bez opłat).
// Najlepiej podmień je na własne kadry z filmów MotoFormat: wrzuć plik JPG (ok. 1600 px szerokości) do folderu
// public/zdjecia/ i wpisz tu adres, np. '/zdjecia/hero.jpg'. Zdjęcia niech nie pokazują logotypów ani tablic rejestracyjnych.

export interface Zdjecie {
  src: string;
  /** mniejsza wersja (800 px) dla telefonów */
  srcMaly?: string;
  alt: string;
  autor: string;
}

// Pliki leżą na naszym serwerze (public/zdjecia/) – szybciej niż z cudzego serwera i lepiej dla PageSpeed Insights.
// Pobrał je automat .github/workflows/pobierz-zdjecia.yml (zdjęcia z Unsplash), potem zostały przycięte i skompresowane do WebP.
const lokalne = (klucz: string) => ({ src: `/zdjecia/${klucz}.webp`, srcMaly: `/zdjecia/${klucz}-800.webp` });

export const ZDJECIA = {
  glowne: { ...lokalne('glowne'), alt: 'Samochód na pustej drodze', autor: 'Raivis Razgals / Unsplash' },
  kupujesz: { ...lokalne('kupujesz'), alt: 'Rząd zaparkowanych samochodów', autor: 'Erik Mclean / Unsplash' },
  trasa: { ...lokalne('trasa'), alt: 'Autostrada nocą – smugi świateł samochodów', autor: 'Florian Steciuk / Unsplash' },
  elektryki: { ...lokalne('elektryki'), alt: 'Ładowanie samochodu elektrycznego', autor: 'CHUTTERSNAP / Unsplash' },
  mandaty: { ...lokalne('mandaty'), alt: 'Samochody na drodze nocą', autor: 'Brecht Denil / Unsplash' },
  atlas: { ...lokalne('atlas'), alt: 'Samochody na ruchliwej drodze', autor: 'CHUTTERSNAP / Unsplash' },
  filmy: { ...lokalne('filmy'), alt: 'Srebrne coupe na asfaltowej drodze', autor: 'Erik Mclean / Unsplash' },
  opony: { ...lokalne('opony'), alt: 'Stosy opon samochodowych', autor: 'Robert Laursoo / Unsplash' }
} satisfies Record<string, Zdjecie>;

export type KluczZdjecia = keyof typeof ZDJECIA;
