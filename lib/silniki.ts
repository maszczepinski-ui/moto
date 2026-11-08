// Biblioteka silników (data/techniczne/silniki.json) + przypisania do kart (data/techniczne/przypisania.json).
// Jeden silnik opisany raz – wiele kart z niego korzysta. Na stronie tylko silniki zatwierdzone w panelu.
import biblioteka from '@/data/techniczne/silniki.json';
import przypisania from '@/data/techniczne/przypisania.json';
import type { CarModel, Silnik } from '@/types/car-model';

export type OcenaLpg = 'dobrze' | 'warunkowo' | 'trudno' | 'nie-dotyczy';
export interface SilnikTech {
  nazwa: string;
  kody: string[];
  /** które kody pasują do danej mocy (KM) */
  kodyWgMocy?: Record<string, string[]>;
  pojemnoscCm3: number;
  paliwo: string;
  wtrysk: string;
  rozrzad: string;
  lpg: OcenaLpg;
  lpgUwagi?: string;
  uwagi?: string;
  zrodla: { tytul: string; url: string }[];
  doSprawdzenia: string[];
  zatwierdzony: boolean;
}

const SILNIKI = (biblioteka as unknown as { silniki: Record<string, SilnikTech> }).silniki;
const PRZYPISANIA = (przypisania as unknown as { modele: Record<string, Record<string, string>> }).modele;

export const LPG: Record<OcenaLpg, { tekst: string; krotko: string; kolor: 'zielony' | 'zolty' | 'pomaranczowy' | 'szary' }> = {
  dobrze: { tekst: 'Dobrze znosi LPG', krotko: 'Dobrze', kolor: 'zielony' },
  warunkowo: { tekst: 'LPG z zastrzeżeniami', krotko: 'Z zastrzeż.', kolor: 'zolty' },
  trudno: { tekst: 'LPG drogie i mało opłacalne', krotko: 'Drogo', kolor: 'pomaranczowy' },
  'nie-dotyczy': { tekst: 'Diesel – LPG nie dotyczy', krotko: 'Diesel', kolor: 'szary' }
};

export type WierszSilnika = Silnik & { tech?: SilnikTech & { id: string } };

/** Wiersze tabeli silników karty – z danymi technicznymi tam, gdzie silnik jest zatwierdzony */
export function silnikiKarty(m: CarModel): WierszSilnika[] {
  const mapa = PRZYPISANIA[m.slug] || {};
  return (m.silniki || []).map((s) => {
    const id = mapa[`${s.nazwa}|${s.mocKm}`];
    const t = id ? SILNIKI[id] : undefined;
    return t?.zatwierdzony ? { ...s, tech: { ...t, id } } : s;
  });
}

/** Źródła wszystkich zatwierdzonych silników z tabeli (bez powtórzeń) */
export function zrodlaSilnikow(w: WierszSilnika[]) {
  const m = new Map<string, string>();
  for (const x of w) for (const z of x.tech?.zrodla || []) m.set(z.url, z.tytul);
  return [...m].map(([url, tytul]) => ({ url, tytul }));
}

/** Pytanie do FAQ o LPG – tylko gdy są zatwierdzone silniki benzynowe */
export function faqLpg(w: WierszSilnika[], nazwa: string): { pytanie: string; odpowiedz: string } | null {
  const benz = w.filter((x) => x.tech && x.tech.lpg !== 'nie-dotyczy');
  if (!benz.length) return null;
  const opis = (o: OcenaLpg) => [...new Set(benz.filter((x) => x.tech!.lpg === o).map((x) => `${x.nazwa} ${x.mocKm} KM`))];
  const czesci = [
    opis('dobrze').length ? `dobrze znoszą je wersje ${opis('dobrze').join(', ')}` : '',
    opis('warunkowo').length ? `z zastrzeżeniami ${opis('warunkowo').join(', ')}` : '',
    opis('trudno').length ? `drogie i mało opłacalne jest w ${opis('trudno').join(', ')} (wtrysk bezpośredni)` : ''
  ].filter(Boolean);
  return {
    pytanie: `Który silnik w ${nazwa} nadaje się pod LPG?`,
    odpowiedz: `Instalację gazową ${czesci.join('; ')}. Ocena wynika z typu wtrysku paliwa – przed montażem warto sprawdzić stan konkretnego silnika.`
  };
}

/** Do panelu: wszystkie silniki i karty, które z nich korzystają */
export function uzyciaSilnikow(): Record<string, string[]> {
  const u: Record<string, string[]> = {};
  for (const [slug, mapa] of Object.entries(PRZYPISANIA)) for (const id of Object.values(mapa)) (u[id] ||= []).includes(slug) || u[id].push(slug);
  return u;
}

export type Pokrycie = Record<string, { wersji: number; opisane: number; zatwierdzone: number }>;
/** Do panelu: na każdej karcie z tabelą silników – ile wersji jest, ile ma opis w bibliotece, ile już zatwierdzonych */
export function pokrycieSilnikow(modele: CarModel[]): Pokrycie {
  const wynik: Pokrycie = {};
  for (const m of modele) {
    const mapa = PRZYPISANIA[m.slug] || {};
    const w = m.silniki || [];
    const ids = w.map((s) => mapa[`${s.nazwa}|${s.mocKm}`]).filter(Boolean);
    wynik[m.slug] = { wersji: w.length, opisane: ids.length, zatwierdzone: ids.filter((id) => SILNIKI[id]?.zatwierdzony).length };
  }
  return wynik;
}
