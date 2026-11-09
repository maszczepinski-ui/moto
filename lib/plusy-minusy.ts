// Plusy i minusy generacji aut po 2020 r. (data/opinie/plusy-minusy.json) – sekcja na karcie modelu.
// Na stronie tylko wpisy zatwierdzone w panelu (zakładka Dane techniczne → Plusy i minusy).
import dane from '@/data/opinie/plusy-minusy.json';
import type { CarModel } from '@/types/car-model';

export type Punkt = { tytul: string; opis: string };
export interface OcenaGeneracji {
  id: string;
  generacja: string;
  lata: string;
  rokOd: number;
  /** ostatni rocznik generacji (gdy jest już następczyni) – do liczenia aut w CEPiK */
  rokDo?: number;
  aktualizacja: string;
  opis: { naglowek: string; tekst: string }[];
  zalety: Punkt[];
  wady: Punkt[];
  werdykt: string;
  zrodla: { tytul: string; url: string }[];
  doSprawdzenia: string[];
  zatwierdzony: boolean;
}

export const PLIK_PLUSOW = 'data/opinie/plusy-minusy.json';
const WSZYSTKIE = (dane as unknown as { modele: Record<string, OcenaGeneracji[]> }).modele;

/** Zatwierdzone oceny generacji dla karty (najnowsza generacja pierwsza) */
export function ocenyKarty(m: CarModel): OcenaGeneracji[] {
  return (WSZYSTKIE[m.slug] || []).filter((o) => o.zatwierdzony).sort((a, b) => b.rokOd - a.rokOd);
}

/** Ile aut z roczników od `rokOd` jeździ w Polsce wg CEPiK (dla generacji po 2020 r.) */
export function liczbaOdRocznika(m: CarModel, rokOd: number, rokDo?: number): number {
  return (m.cepik.roczniki || []).filter((r) => r.rok >= rokOd && (!rokDo || r.rok <= rokDo)).reduce((s, r) => s + r.liczba, 0);
}

/** Pytanie do FAQ „Czy warto kupić …?” z werdyktu */
export function faqOceny(o: OcenaGeneracji) {
  return { pytanie: `Czy warto kupić ${o.generacja}?`, odpowiedz: o.werdykt };
}
