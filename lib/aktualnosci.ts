// Aktualności: akcje serwisowe (Safety Gate), komunikaty urzędowe (gov.pl) i premiery (biura prasowe producentów).
// Jeden plik na wpis: data/aktualnosci/<slug>.json. Szkice tworzy automat (scripts/aktualnosci.mjs),
// na stronie są tylko wpisy ze statusem „opublikowany” – zatwierdzasz je w panelu admina (zakładka „Aktualności”).
import fs from 'fs';
import path from 'path';

export type TypAktualnosci = 'akcje-serwisowe' | 'komunikaty' | 'premiery';

export interface PozycjaAkcji {
  marka: string;
  model: string;
  /** opis problemu po polsku */
  problem: string;
  /** co robi producent / co ma zrobić właściciel */
  zalecenie: string;
  produkcja?: string;
  kodAkcji?: string;
  poziom?: string;
  kraj?: string;
  /** link do zgłoszenia w Safety Gate */
  link: string;
  /** slug karty modelu w atlasie, jeśli pasuje */
  karta?: string;
}

export interface Aktualnosc {
  slug: string;
  typ: TypAktualnosci;
  tytul: string;
  /** 1–2 zdania – też opis dla Google */
  lead: string;
  /** data wpisu RRRR-MM-DD */
  data: string;
  /** treść w Markdown (## nagłówki, listy, **pogrubienia**, [linki](adres)) */
  tresc: string;
  zrodla: { nazwa: string; url: string }[];
  /** np. „CC BY-SA 4.0” – dla treści z gov.pl */
  licencja?: string;
  /** slugi kart modeli, których dotyczy wpis */
  modele?: string[];
  marki?: string[];
  /** tylko akcje serwisowe: lista wezwań z tygodnia */
  pozycje?: PozycjaAkcji[];
  status: 'szkic' | 'opublikowany';
  wygenerowano?: string;
  /** szkic bez tekstu od modelu językowego (brak klucza) – wymaga uzupełnienia */
  bezAI?: boolean;
}

export const TYPY: Record<TypAktualnosci, { nazwa: string; krotko: string; opis: string; seoTytul: string; seoOpis: string }> = {
  'akcje-serwisowe': {
    nazwa: 'Akcje serwisowe',
    krotko: 'Akcje serwisowe',
    opis: 'Wezwania aut do serwisu zgłoszone w unijnym systemie Safety Gate – co jest nie tak, których roczników dotyczy i co zrobić.',
    seoTytul: 'Akcje serwisowe samochodów – aktualne wezwania',
    seoOpis: 'Aktualne akcje serwisowe samochodów zgłoszone w unijnym systemie Safety Gate: marka, model, lata produkcji, opis usterki i co powinien zrobić właściciel auta.'
  },
  komunikaty: {
    nazwa: 'Komunikaty dla kierowców',
    krotko: 'Komunikaty',
    opis: 'Nowe przepisy, zmiany w rejestracji, mObywatelu i na drogach – omówienie komunikatów ministerstw i urzędów.',
    seoTytul: 'Komunikaty dla kierowców – przepisy i zmiany',
    seoOpis: 'Najważniejsze komunikaty ministerstw i urzędów dla kierowców: nowe przepisy, rejestracja aut, mObywatel, drogi i opłaty – omówione prostym językiem.'
  },
  premiery: {
    nazwa: 'Premiery i nowości',
    krotko: 'Premiery',
    opis: 'Nowe modele, wersje i ceny w Polsce – na podstawie materiałów prasowych producentów.',
    seoTytul: 'Premiery samochodów – nowe modele i ceny',
    seoOpis: 'Premiery samochodów i nowości na polskim rynku: nowe modele, wersje, ceny i wyposażenie – na podstawie informacji prasowych producentów.'
  }
};

export const jestTypem = (s: string): s is TypAktualnosci => s in TYPY;

const KATALOG = path.join(process.cwd(), 'data/aktualnosci');
let cache: Aktualnosc[] | null = null;

export function wszystkieAktualnosci(): Aktualnosc[] {
  if (cache) return cache;
  cache = fs.existsSync(KATALOG)
    ? fs
        .readdirSync(KATALOG)
        .filter((f) => f.endsWith('.json') && !f.startsWith('.') && !f.startsWith('_'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(KATALOG, f), 'utf8')) as Aktualnosc)
        .sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug))
    : [];
  return cache;
}

export const opublikowaneAktualnosci = () => wszystkieAktualnosci().filter((a) => a.status === 'opublikowany');
export const aktualnoscPoSlugu = (s: string) => opublikowaneAktualnosci().find((a) => a.slug === s);
export const aktualnosciTypu = (t: TypAktualnosci) => opublikowaneAktualnosci().filter((a) => a.typ === t);
export const najnowszeAktualnosci = (ile = 3) => opublikowaneAktualnosci().slice(0, ile);
