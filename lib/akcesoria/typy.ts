// Dział akcesoriów: każdy dział (zimowe, kosmetyki…) to plik z danymi w lib/akcesoria/.
// Strona działu składa się sama z tych danych (components/akcesoria/StronaDzialu.tsx).

export interface Produkt {
  id: string;
  nazwa: string;
  /** do czego służy – jedno, dwa zdania */
  poCo: string;
  /** na co patrzeć przy zakupie */
  jakWybrac: string[];
  /** najczęstszy błąd przy zakupie lub używaniu */
  unikaj: string;
  /** co wyszukać na Ceneo, żeby wygenerować link w panelu partnera (podpowiedź dla redakcji) */
  szukaj: string;
  /** „Musisz mieć” / „Warto mieć” / „Na wyjazd w góry” */
  grupa: 'podstawa' | 'warto' | 'gory';
  /** link do naszego poradnika lub narzędzia przy produkcie */
  powiazany?: { nazwa: string; adres: string };
}

export interface Dzial {
  slug: string;
  nazwa: string;
  seoTytul: string;
  seoOpis: string;
  tytul: string;
  opis: string;
  fakty: string[];
  aktualizacja: string;
  wstep: string[];
  produkty: Produkt[];
  /** ramka z przepisami (każdy punkt ze źródłem na dole strony) */
  przepisy?: { tytul: string; punkty: string[] };
  /** poradniki do podlinkowania (sprawdzane, czy są opublikowane) */
  poradniki: string[];
  /** inne nasze strony do podlinkowania */
  narzedzia: { nazwa: string; opis: string; adres: string }[];
  pytania: { q: string; a: string }[];
  zrodla: { nazwa: string; url: string }[];
}

/** Osobna strona typu produktu (np. boostery) z tabelą konkretnych modeli */
export interface ModelProduktu {
  /** stały identyfikator – pod nim w panelu wklejasz link z Ceneo */
  id: string;
  marka: string;
  model: string;
  /** wartości kolumn tabeli (klucz = StronaProduktu.kolumny[].klucz) */
  dane: Record<string, string>;
  /** dla kogo – jedno krótkie zdanie, wynika z danych producenta */
  dlaKogo: string;
  /** co wpisać w wyszukiwarkę Ceneo, żeby znaleźć ten model i wygenerować link */
  szukaj: string;
}

export interface StronaProduktu {
  slug: string;
  dzial: string;
  /** id produktu na stronie działu, który linkuje do tej podstrony */
  idWDziale: string;
  nazwa: string;
  seoTytul: string;
  seoOpis: string;
  tytul: string;
  opis: string;
  aktualizacja: string;
  wstep: string[];
  kolumny: { klucz: string; nazwa: string }[];
  modele: ModelProduktu[];
  jakWybrac: { t: string; o: string }[];
  pytania: { q: string; a: string }[];
  zrodla: { nazwa: string; url: string }[];
}
