import linki from '@/data/akcesoria/linki-ceneo.json';
import { linkCeneoZPanelu } from '@/lib/ceneo';

// Linki partnerskie Ceneo do produktów działu akcesoriów.
// Plik data/akcesoria/linki-ceneo.json uzupełniasz w panelu admina (zakładka „Linki Ceneo”):
// każdy link generujesz w panelu partnera Ceneo albo wtyczką „Program Partnerski Ceneo” i wklejasz bez zmian.
const L = linki as Record<string, string>;

/** Link do produktu albo pusty (wtedy przycisk się nie pokazuje) */
export const linkProduktuCeneo = (id: string) => linkCeneoZPanelu(L[id]);
