// Które strony z szablonu pokazujemy Google.
// Nowa strona dostaje od Google ograniczoną „uwagę”. Gdy widzi tysiące bardzo podobnych podstron, odkłada je
// jako „wykryte – obecnie nieindeksowane”. Dlatego Google dostaje tylko te z unikalną treścią,
// a resztę oznaczamy „noindex, follow” (ludzie je widzą, Google przechodzi po linkach, ale ich nie indeksuje).
import ustawienia from '@/data/indeksowanie.json';
import { wszystkiePary } from '@/lib/porownania';
import type { CarModel } from '@/types/car-model';

let wybrane: Set<string> | null = null;

/** Czy porównanie „A czy B” ma być w Google: najpopularniejsze pary + ręczna lista z data/indeksowanie.json */
export function porownanieWGoogle(id: string): boolean {
  if (!wybrane) {
    const top = [...wszystkiePary()]
      .sort((x, y) => y.a.cepik.liczbaWPolsce + y.b.cepik.liczbaWPolsce - (x.a.cepik.liczbaWPolsce + x.b.cepik.liczbaWPolsce))
      .slice(0, ustawienia.porownaniaLimit)
      .map((p) => p.id);
    wybrane = new Set([...top, ...ustawienia.porownaniaZawsze]);
  }
  return wybrane.has(id);
}

/** Czy podstrona „/zakup/” modelu ma być w Google – tylko gdy ma treść dla tego modelu (opisane silniki lub usterki) */
export function zakupWGoogle(m: CarModel): boolean {
  return (m.silniki?.length ?? 0) > 0 || (m.usterki?.length ?? 0) > 0;
}

/** Oznaczenie dla stron, których nie pokazujemy Google */
export const BEZ_INDEKSU = { index: false, follow: true } as const;
