// Poradniki publikowane co tydzień. Treść: poradniki-nowe-1/2/3.ts, daty: data/harmonogram-poradnikow.json.
// Nowy poradnik: dopisz go w jednym z plików, a jego adres (slug) i datę publikacji – w harmonogramie.
import type { Poradnik } from '@/lib/poradniki';
import { NOWE_1, DODATKI_1 } from '@/lib/poradniki-nowe-1';
import { NOWE_2, DODATKI_2 } from '@/lib/poradniki-nowe-2';
import { NOWE_3, DODATKI_3 } from '@/lib/poradniki-nowe-3';
import { NOWE_4, DODATKI_4 } from '@/lib/poradniki-eksperckie';

export interface DodatekSeo {
  seoTytul: string;
  seoOpis: string;
  skrot: string[];
}

export const NOWE: Poradnik[] = [...NOWE_1, ...NOWE_2, ...NOWE_3, ...NOWE_4];
export const NOWE_DODATKI: Record<string, DodatekSeo> = { ...DODATKI_1, ...DODATKI_2, ...DODATKI_3, ...DODATKI_4 };
