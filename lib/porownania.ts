// Pary aut do porównań „A czy B”. Bierzemy konkurentów w klasie (z danych CEPiK) oraz sąsiednie generacje
// tego samego modelu. Tylko auta, których w Polsce jest dość dużo, żeby porównanie miało sens.
import { CarModel } from '@/types/car-model';
import { getAllModels, getModelBySlug } from '@/lib/models';

const MIN_AUT = 3000;

export interface Para {
  id: string;
  a: CarModel;
  b: CarModel;
}

let cache: Para[] | null = null;

export function wszystkiePary(): Para[] {
  if (cache) return cache;
  const mapa = new Map<string, Para>();
  const dodaj = (x?: CarModel, y?: CarModel) => {
    if (!x || !y || x.slug === y.slug) return;
    if (x.cepik.liczbaWPolsce < MIN_AUT || y.cepik.liczbaWPolsce < MIN_AUT) return;
    // popularniejszy pierwszy – jeden stały adres dla pary
    const [a, b] = x.cepik.liczbaWPolsce >= y.cepik.liczbaWPolsce ? [x, y] : [y, x];
    const id = `${a.slug}-vs-${b.slug}`;
    if (!mapa.has(id)) mapa.set(id, { id, a, b });
  };
  for (const m of getAllModels()) {
    for (const k of m.konkurenci || []) dodaj(m, getModelBySlug(k.slug));
    if (m.nastepca) dodaj(m, getModelBySlug(m.nastepca.slug));
  }
  cache = [...mapa.values()];
  return cache;
}

export function paraPoId(id: string) {
  return wszystkiePary().find((p) => p.id === id);
}

export function paryDlaKarty(slug: string) {
  return wszystkiePary().filter((p) => p.a.slug === slug || p.b.slug === slug);
}
