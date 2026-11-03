// Dane do infografik na stronie głównej – liczone z kart modeli (CEPiK) przy budowaniu strony.
import { getAllModels } from '@/lib/models';

export interface Udzial {
  nazwa: string;
  liczba: number;
  procent: number;
}

/** Karty „wszystkie generacje” obejmują cały model – liczymy tylko je, żeby nie liczyć aut dwa razy */
const rodziny = () => getAllModels().filter((m) => m.wszystkieGeneracje);

export function udzialPaliw(): Udzial[] {
  const grupy: [string, (n: string) => boolean][] = [
    ['Benzyna', (n) => n === 'Benzyna'],
    ['Diesel', (n) => n.startsWith('Diesel')],
    ['LPG', (n) => n.includes('LPG')],
    ['Hybryda', (n) => n.startsWith('Hybryda')],
    ['Elektryczny', (n) => n.startsWith('Elektr')]
  ];
  const suma = new Map<string, number>();
  for (const m of rodziny())
    for (const p of m.cepik.paliwa) {
      const g = grupy.find(([, f]) => f(p.nazwa));
      if (g) suma.set(g[0], (suma.get(g[0]) || 0) + p.liczba);
    }
  const razem = [...suma.values()].reduce((a, b) => a + b, 0) || 1;
  return grupy.map(([n]) => ({ nazwa: n, liczba: suma.get(n) || 0, procent: ((suma.get(n) || 0) / razem) * 100 }));
}

/**
 * Najpopularniejsze modele W UŻYCIU – auta, które od 2017 r. zmieniły właściciela, zostały sprowadzone albo kupione w salonie.
 * Sama liczba rejestracji wyróżniałaby stare modele (np. Fiat 126p), których większości nikt formalnie nie wyrejestrował.
 */
export function najpopularniejsze(ile = 6) {
  return rodziny()
    .sort((a, b) => (b.cepik.aktywne ?? 0) - (a.cepik.aktywne ?? 0))
    .slice(0, ile)
    .map((m) => ({ nazwa: `${m.marka} ${m.model}`, liczba: m.cepik.aktywne ?? 0, wszystkie: m.cepik.liczbaWPolsce, adres: m.adres }));
}

/** Przykład pokazujący różnicę między rejestracjami a autami w użyciu (do przypisu) */
export function przykladZawyzenia() {
  const m = rodziny()
    .filter((x) => x.cepik.aktywne !== undefined)
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce)[0];
  return m ? { nazwa: `${m.marka} ${m.model}`, wszystkie: m.cepik.liczbaWPolsce, aktywne: m.cepik.aktywne! } : null;
}

/** Rozkład roczników (dekady produkcji) wszystkich aut z kart modeli */
export function rocznikiDekadami() {
  const d = new Map<number, number>();
  for (const m of rodziny())
    for (const r of m.cepik.roczniki) {
      const rok = r.rok;
      if (!rok || rok < 1960) continue;
      const dek = Math.floor(rok / 10) * 10;
      d.set(dek, (d.get(dek) || 0) + r.liczba);
    }
  return [...d.entries()].sort((a, b) => a[0] - b[0]).map(([dek, liczba]) => ({ nazwa: dek >= 2020 ? '2020+' : `${dek}–${dek + 9}`, liczba }));
}

/** Udział aut sprowadzonych z zagranicy jako używane (wśród aut ze znanym pochodzeniem) */
export function udzialSprowadzonych(): number {
  let imp = 0,
    suma = 0;
  for (const m of rodziny())
    for (const p of m.cepik.pochodzenie) {
      if (p.nazwa === 'Inne / brak danych') continue;
      suma += p.liczba;
      if (p.nazwa.startsWith('Sprowadzony z zagranicy (używany)')) imp += p.liczba;
    }
  return suma ? imp / suma : 0;
}
