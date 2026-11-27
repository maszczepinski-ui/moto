import type { Dzial } from './typy';
import { ZIMOWE } from './zimowe';
import { BOOSTER } from './strony/booster';
import { PROSTOWNIK } from './strony/prostownik';
import type { StronaProduktu } from './typy';

// Spis działów akcesoriów. Nowy dział = nowy plik z danymi + jedna linijka tutaj.
export const DZIALY: Dzial[] = [ZIMOWE];

/** Działy zapowiedziane (bez własnej strony – tylko informacja na stronie /akcesoria/) */
export const WKROTCE = ['Kosmetyki samochodowe', 'Elektronika i wideorejestratory', 'Diagnostyka i narzędzia', 'Oleje i płyny', 'Wyposażenie obowiązkowe i podróż'];

export const dzial = (slug: string) => DZIALY.find((d) => d.slug === slug) || null;

/** Osobne strony typów produktów z tabelą modeli (adres /akcesoria/<dział>/<slug>/) */
export const STRONY_PRODUKTOW: StronaProduktu[] = [BOOSTER, PROSTOWNIK];
export const stronaProduktu = (dz: string, slug: string) => STRONY_PRODUKTOW.find((s) => s.dzial === dz && s.slug === slug) || null;
/** Podstrona dla produktu z listy działu (np. booster → /akcesoria/zimowe/booster/) */
export const podstronaDla = (dz: string, idWDziale: string) => STRONY_PRODUKTOW.find((s) => s.dzial === dz && s.idWDziale === idWDziale) || null;
export type { Dzial, Produkt, StronaProduktu, ModelProduktu } from './typy';
