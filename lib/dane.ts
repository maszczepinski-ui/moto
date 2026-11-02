// Dane zbiorcze tworzone przez scripts/zbuduj-modele.py
import wojewodztwaJson from '@/data/wojewodztwa.json';
import rankingiJson from '@/data/rankingi.json';
import tloJson from '@/data/cepik/tlo.json';
import markiJson from '@/data/marki.json';

export interface PozycjaModelu {
  slug: string;
  adres: string;
  nazwa: string;
  liczba: number;
  indeks?: number;
}

export interface DaneWojewodztwa {
  teryt: string;
  nazwa: string;
  slug: string;
  auta: number;
  naTysiacAutWPolsce: number;
  sredniRocznik: number | null;
  dekady: { nazwa: string; liczba: number }[];
  top: PozycjaModelu[];
  charakterystyczne: PozycjaModelu[];
}

export interface Ranking {
  id: string;
  tytul: string;
  opis: string;
  pozycje: { slug: string; adres: string; nazwa: string; wartosc: string; liczba: number }[];
}

export interface Marka {
  slug: string;
  nazwa: string;
  /** nazwa w CEPiK */
  kod: string;
  auta: number;
  nowe: number;
  hybrydy: number;
  elektryczne: number;
  chinska: boolean;
  wojewodztwa: { teryt: string; liczba: number }[];
  modele: {
    slug: string;
    nazwa: string;
    adres: string;
    liczba: number;
    nowe: number;
    lata: string;
    generacje: { slug: string; nazwa: string; adres: string }[];
  }[];
}

export const wojewodztwa = wojewodztwaJson as Record<string, DaneWojewodztwa>;
export const listaWojewodztw = Object.values(wojewodztwa).sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
export const rankingi = (rankingiJson as { stanNa: string; rankingi: Ranking[] }).rankingi;
export const tlo = tloJson as { stanNa: string; razem: number; wojewodztwa: Record<string, number>; noweZakres?: { od: string; do: string; kompletne: boolean } | null; miesiace?: { miesiac: string; liczba: number }[] };

/** Uwaga do pokazania, gdy dane z API CEPiK (rejestracje od XI 2019) są jeszcze uzupełniane przez automat. */
export function uwagaUzupelnianie(): string | null {
  const z = tlo.noweZakres;
  if (!z || z.kompletne) return null;
  const d = (x: string) => x.split('-').reverse().join('.');
  return `Dane o rejestracjach od listopada 2019 r. są w trakcie uzupełniania – na razie obejmują okres ${d(z.od)} – ${d(z.do)}, więc liczby będą jeszcze rosły.`;
}

export const wojewodztwoPoSlugu = (slug: string) => listaWojewodztw.find((w) => w.slug === slug);

export const marki = (markiJson as { stanNa: string; marki: Marka[] }).marki;
export const markaPoSlugu = (slug: string) => marki.find((m) => m.slug === slug);
