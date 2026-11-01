import fs from 'fs';
import path from 'path';
import { CarModel } from '@/types/car-model';

const modelsDirectory = path.join(process.cwd(), 'data/models');

let cache: CarModel[] | null = null;

export function getAllModels(): CarModel[] {
  if (cache) return cache;
  const fileNames = fs.readdirSync(modelsDirectory);
  const models = fileNames
    .filter((fileName) => fileName.endsWith('.json') && !fileName.startsWith('.'))
    .map((fileName) => {
      const fullPath = path.join(modelsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as CarModel;
    });

  cache = models;
  return models;
}

export function getModelBySlug(slug: string): CarModel | undefined {
  const models = getAllModels();
  return models.find((m) => m.slug === slug);
}

export function getModelByPath(marka: string, model: string, generacja?: string): CarModel | undefined {
  return getAllModels().find(
    (m) => m.markaSlug === marka && m.modelSlug === model && (generacja ? m.generacjaSlug === generacja : m.wszystkieGeneracje)
  );
}

/** Adres podstrony karty po jej slugu (do linków w rankingach, filmach itd.) */
export function adresKarty(slug: string): string {
  return getModelBySlug(slug)?.adres ?? '/';
}

/** Lekka wersja danych do listy na stronie głównej (bez map i wykresów) */
export type ModelSummary = Pick<CarModel, 'slug' | 'adres' | 'marka' | 'model' | 'generacja' | 'lataProdukcji' | 'nadwozia' | 'daneTestowe' | 'wszystkieGeneracje'> & {
  cepik: { liczbaWPolsce: number };
};

export function getModelSummaries(): ModelSummary[] {
  return getAllModels().map((m) => ({
    slug: m.slug,
    adres: m.adres,
    marka: m.marka,
    model: m.model,
    generacja: m.generacja,
    lataProdukcji: m.lataProdukcji,
    nadwozia: m.nadwozia,
    daneTestowe: m.daneTestowe,
    wszystkieGeneracje: m.wszystkieGeneracje ?? false,
    cepik: { liczbaWPolsce: m.cepik.liczbaWPolsce }
  }));
}
