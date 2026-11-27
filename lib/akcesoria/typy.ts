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
  /** fraza do wyszukiwania na Ceneo */
  szukaj: string;
  /** opcjonalnie: adres konkretnej kategorii Ceneo zamiast wyszukiwania */
  ceneoAdres?: string;
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
