// Kalkulator „Czy LPG się opłaca?” – zwrot instalacji gazowej. Stan na listopad 2026.
// Koszty montażu: cenauslug.pl (2026): 4 cylindry, wtrysk pośredni 3800–5500 zł; 6 cylindrów 4500–6500 zł;
// wtrysk bezpośredni 5500–8000 zł+; kb.pl (2026): wtrysk bezpośredni średnio 6622 zł.
// Spalanie LPG wyższe niż benzyny o ok. 15–25% (przyjmujemy 20%). Przy wtrysku bezpośrednim część benzyny
// spalana jest nadal (przyjmujemy 15%). Serwis instalacji (filtry, regulacja) – założenie 250 zł rocznie.
// Ceny paliw biorą się z panelu admina (cenyPaliw).
import type { CarModel } from '@/types/car-model';
import { silnikiKarty } from '@/lib/silniki';

export const STAN_LPG = 'listopad 2026';

export type TypInstalacji = 'mpi4' | 'mpi6' | 'di';

export const INSTALACJE: Record<TypInstalacji, { nazwa: string; od: number; do: number; domyslnie: number; benzynaUdzial: number }> = {
  mpi4: { nazwa: 'Wtrysk pośredni, 4 cylindry', od: 3800, do: 5500, domyslnie: 4500, benzynaUdzial: 0.03 },
  mpi6: { nazwa: 'Wtrysk pośredni, 6 cylindrów', od: 4500, do: 6500, domyslnie: 5500, benzynaUdzial: 0.03 },
  di: { nazwa: 'Wtrysk bezpośredni (FSI, TSI, GDI…)', od: 5500, do: 8000, domyslnie: 6600, benzynaUdzial: 0.15 }
};

export const NADWYZKA_LPG = 1.2;
export const SERWIS_ROCZNIE = 250;

export interface DaneLpg {
  spalanie: number;
  kmRocznie: number;
  cenaPb: number;
  cenaLpg: number;
  koszt: number;
  typ: TypInstalacji;
}

export interface WynikLpg {
  kosztBenzyna100: number;
  kosztLpg100: number;
  oszczednosc100: number;
  oszczednoscRok: number;
  /** po ilu km zwraca się instalacja (z serwisem) */
  zwrotKm: number | null;
  zwrotMies: number | null;
  zysk3Lata: number;
}

export function policzLpg(d: DaneLpg): WynikLpg {
  const b = INSTALACJE[d.typ].benzynaUdzial;
  const kosztBenzyna100 = d.spalanie * d.cenaPb;
  const kosztLpg100 = d.spalanie * (1 - b) * NADWYZKA_LPG * d.cenaLpg + d.spalanie * b * d.cenaPb;
  const oszczednosc100 = kosztBenzyna100 - kosztLpg100;
  const oszczednoscRok = (oszczednosc100 * d.kmRocznie) / 100 - SERWIS_ROCZNIE;
  const zaKm = oszczednosc100 / 100 - SERWIS_ROCZNIE / Math.max(1, d.kmRocznie);
  const zwrotKm = zaKm > 0 ? Math.round(d.koszt / zaKm / 1000) * 1000 : null;
  const zwrotMies = zwrotKm !== null && d.kmRocznie > 0 ? Math.round((zwrotKm / d.kmRocznie) * 12) : null;
  return { kosztBenzyna100, kosztLpg100, oszczednosc100, oszczednoscRok, zwrotKm, zwrotMies, zysk3Lata: oszczednoscRok * 3 - d.koszt };
}

/** Typowe spalanie benzyny w mieście i trasie dla pojemności (l/100 km) – punkt wyjścia do edycji */
export function spalanieDlaPojemnosci(litry: number): number {
  if (litry <= 1.2) return 6.5;
  if (litry <= 1.4) return 7;
  if (litry <= 1.6) return 7.8;
  if (litry <= 2.0) return 9;
  if (litry <= 2.5) return 10.5;
  return 12;
}

const suma = (l: { liczba: number }[] = []) => l.reduce((s, x) => s + x.liczba, 0);

export function lpgModelu(m: CarModel) {
  const c = m.cepik;
  const wszystkie = Math.max(1, suma(c.paliwa));
  const lpg = suma(c.paliwa.filter((p) => p.nazwa.includes('LPG')));
  const benzyna = suma(c.paliwa.filter((p) => p.nazwa === 'Benzyna'));
  const pojemnosci = [...(c.pojemnosci || [])].filter((p) => /\d/.test(p.nazwa)).sort((a, b) => b.liczba - a.liczba).slice(0, 4);
  const glowna = pojemnosci[0] ? Number(pojemnosci[0].nazwa.replace(',', '.').replace(/[^\d.]/g, '')) || 1.6 : 1.6;
  const silniki = silnikiKarty(m).filter((s) => s.tech && s.tech.lpg !== 'nie-dotyczy');
  return { lpg, udzialLpg: lpg / wszystkie, benzyna, udzialBenzyny: benzyna / wszystkie, pojemnosci, glowna, silniki };
}

export function modelMaStroneLpg(m: CarModel): boolean {
  return !!m.wszystkieGeneracje && !m.daneTestowe && lpgModelu(m).lpg >= 5000;
}
