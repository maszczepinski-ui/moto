import type { Sekcja } from '@/lib/poradniki';

/** Przetłumaczony poradnik. Kategoria, ikona, źródła i powiązania biorą się z polskiego oryginału (pole `pl`). */
export interface Tlumaczenie {
  /** slug polskiego oryginału */
  pl: string;
  /** adres w danym języku (bez przedrostka /uk/poradnyky/ itp.) */
  slug: string;
  tytul: string;
  krotko: string;
  opis: string;
  seoTytul: string;
  seoOpis: string;
  skrot: string[];
  liczby?: { w: string; o: string }[];
  sekcje: Sekcja[];
  faq?: { q: string; a: string }[];
  /** data ostatniego sprawdzenia tłumaczenia (RRRR-MM-DD) */
  aktualizacja: string;
}
