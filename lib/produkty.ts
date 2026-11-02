// Polecane produkty (kosmetyki, chemia, akcesoria) i sezonowe rankingi. Plik: data/produkty.json – edycja w panelu admina.
import dane from '@/data/produkty.json';

export type Sezon = 'zima' | 'wiosna' | 'lato' | 'jesien' | 'caly-rok';

export interface Produkt {
  id: string;
  nazwa: string;
  kategoria: string;
  /** link do produktu (najlepiej link partnerski z generatora Ceneo) */
  link: string;
  /** nazwa sklepu / porównywarki na przycisku, np. „Ceneo” */
  sklep?: string;
  /** adres zdjęcia (opcjonalnie) */
  zdjecie?: string;
  /** Twoja ocena 1–5 */
  ocena?: number;
  opis: string;
  plusy?: string[];
  minusy?: string[];
  /** numer filmu YouTube albo slug artykułu, w którym produkt był testowany */
  film?: string;
  aktywny: boolean;
}

export interface Ranking {
  id: string;
  tytul: string;
  opis: string;
  sezon: Sezon;
  /** okno widoczności co roku, MM-DD (może przechodzić przez Nowy Rok, np. 10-15 → 03-15) */
  od: string;
  do: string;
  /** produkty w kolejności miejsc */
  produkty: string[];
}

const D = dane as { produkty: Produkt[]; rankingi: Ranking[] };

export const NAZWY_SEZONOW: Record<Sezon, string> = { zima: 'Zima', wiosna: 'Wiosna', lato: 'Lato', jesien: 'Jesień', 'caly-rok': 'Cały rok' };

export function produkt(id: string): Produkt | undefined {
  return D.produkty.find((p) => p.id === id && p.aktywny);
}

/** Produkty rankingu w kolejności (tylko aktywne) */
export function produktyRankingu(r: Ranking): Produkt[] {
  return r.produkty.map(produkt).filter((p): p is Produkt => !!p);
}

/** Rankingi, które mają co najmniej jeden aktywny produkt */
export function rankingiZProduktami(): Ranking[] {
  return D.rankingi.filter((r) => produktyRankingu(r).length > 0);
}

/** Czy dzień (MM-DD) mieści się w oknie od–do (także przez Nowy Rok) */
export function wOknie(r: Pick<Ranking, 'od' | 'do'>, dzien: string): boolean {
  return r.od <= r.do ? dzien >= r.od && dzien <= r.do : dzien >= r.od || dzien <= r.do;
}

export function dzisMMDD(d = new Date()): string {
  // czas polski – strona budowana jest w nocy, liczymy datę w Warszawie
  const s = d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
  return s.slice(5);
}

/** Rankingi na teraz (sezonowe) i pozostałe */
export function rankingiNaTeraz(d = new Date()) {
  const dzis = dzisMMDD(d);
  const wszystkie = rankingiZProduktami();
  return { teraz: wszystkie.filter((r) => wOknie(r, dzis)), pozostale: wszystkie.filter((r) => !wOknie(r, dzis)) };
}

export function rankingPoId(id: string) {
  return D.rankingi.find((r) => r.id === id);
}

/** Produkty przypisane do filmu (numer YouTube albo slug artykułu) */
export function produktyFilmu(klucze: string[]): Produkt[] {
  return D.produkty.filter((p) => p.aktywny && p.film && klucze.includes(p.film));
}
