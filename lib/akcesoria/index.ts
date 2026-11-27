import type { Dzial } from './typy';
import { ZIMOWE } from './zimowe';

// Spis działów akcesoriów. Nowy dział = nowy plik z danymi + jedna linijka tutaj.
export const DZIALY: Dzial[] = [ZIMOWE];

/** Działy zapowiedziane (bez własnej strony – tylko informacja na stronie /akcesoria/) */
export const WKROTCE = ['Kosmetyki samochodowe', 'Elektronika i wideorejestratory', 'Diagnostyka i narzędzia', 'Oleje i płyny', 'Wyposażenie obowiązkowe i podróż'];

export const dzial = (slug: string) => DZIALY.find((d) => d.slug === slug) || null;
export type { Dzial, Produkt } from './typy';
