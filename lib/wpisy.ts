// Artykuły do filmów z kanału. Jeden plik na film: data/wpisy/<slug>.json.
// Szkice tworzy automat (scripts/nowe-filmy.mjs) albo panel admina; na stronie są tylko wpisy ze statusem „opublikowany”.
import fs from 'fs';
import path from 'path';

export type Konwersja = 'zakup' | 'ubezpieczenie' | 'detailing' | 'diagnostyka' | 'brak';
export type Kategoria = 'test' | 'porada' | 'zakup' | 'detailing' | 'inne';

export interface Wpis {
  slug: string;
  youtubeId: string;
  tytul: string;
  /** krótki wstęp (1–2 zdania) – też opis dla Google */
  lead: string;
  opublikowano: string;
  kategoria: Kategoria;
  /** slugi kart modeli omawianych w filmie */
  modele: string[];
  /** id produktów z data/produkty.json pokazanych w filmie */
  produkty?: string[];
  konwersja: Konwersja;
  rozdzialy?: { czas: string; tytul: string }[];
  /** treść artykułu w Markdown (## i ### nagłówki, listy, **pogrubienia**, [linki](adres)) */
  tresc: string;
  faq?: { pytanie: string; odpowiedz: string }[];
  status: 'szkic' | 'opublikowany';
  /** szkic z automatu czeka na transkrypcję */
  brakTranskrypcji?: boolean;
  wygenerowano?: string;
}

export const NAZWY_KATEGORII: Record<Kategoria, string> = { test: 'Testy aut', porada: 'Porady', zakup: 'Zakup auta', detailing: 'Pielęgnacja i detailing', inne: 'Inne' };

const KATALOG = path.join(process.cwd(), 'data/wpisy');
let cache: Wpis[] | null = null;

export function wszystkieWpisy(): Wpis[] {
  if (cache) return cache;
  cache = fs.existsSync(KATALOG)
    ? fs
        .readdirSync(KATALOG)
        .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(KATALOG, f), 'utf8')) as Wpis)
        .sort((a, b) => b.opublikowano.localeCompare(a.opublikowano))
    : [];
  return cache;
}

export const opublikowane = () => wszystkieWpisy().filter((w) => w.status === 'opublikowany');
export const wpisPoSlugu = (s: string) => opublikowane().find((w) => w.slug === s);

/** Opublikowane artykuły o danym modelu (karta lub jej generacje / karta zbiorcza) */
export function wpisyDlaKarty(slugi: string[]): Wpis[] {
  return opublikowane().filter((w) => w.modele.some((m) => slugi.includes(m)));
}

/** „03:12” / „1:03:12” → sekundy */
export function sekundy(czas: string): number {
  return czas
    .split(':')
    .map(Number)
    .reduce((s, x) => s * 60 + (Number.isFinite(x) ? x : 0), 0);
}
