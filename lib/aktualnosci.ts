// Aktualności: akcje serwisowe (Safety Gate), komunikaty urzędowe (gov.pl) i premiery (biura prasowe producentów).
// Jeden plik na wpis: data/aktualnosci/<slug>.json. Szkice tworzy automat (scripts/aktualnosci.mjs),
// na stronie są tylko wpisy ze statusem „opublikowany” – zatwierdzasz je w panelu admina (zakładka „Aktualności”).
import fs from 'fs';
import path from 'path';

export type TypAktualnosci = 'akcje-serwisowe' | 'komunikaty' | 'premiery' | 'jakie-auto';

/** Jedno auto polecane w poradniku zakupowym („Sportowe auto do 20 000 zł” itd.) */
export interface AutoZakupowe {
  /** slug karty modelu w atlasie – z niej bierzemy link i liczbę aut w Polsce */
  karta?: string;
  /** np. „Mazda MX-5” */
  nazwa: string;
  /** np. „II (NB) i III (NC)” */
  generacja: string;
  /** roczniki, które realnie mieszczą się w budżecie, np. „1998–2008” */
  roczniki: string;
  /** widełki z ogłoszeń, np. „12 500–20 000 zł” */
  cena: string;
  /** typowy przebieg w ogłoszeniach, np. „125–230 tys. km” */
  przebieg?: string;
  /** ile ofert w budżecie było przy sprawdzaniu (Otomoto) */
  ofert?: number;
  /** mało ofert w całej Polsce – trudno znaleźć */
  rzadki?: boolean;
  /** 1–2 zdania: dla kogo to auto */
  dlaKogo: string;
  /** np. „8,5–9,0 l/100 km” – realne spalanie od kierowców */
  spalanie: string;
  spalanieZrodlo?: { nazwa: string; url: string };
  silniki: { nazwa: string; ocena: 'polecany' | 'warunkowo' | 'omijaj'; opis: string }[];
  plusy: string[];
  minusy: string[];
  /** link do wyszukiwania ogłoszeń (model + cena do budżetu) */
  ogloszenia?: string;
}

/** Dodatkowe dane wpisu typu „jakie-auto” (poradnik zakupowy) */
export interface PoradnikZakupowy {
  /** główna fraza, pod którą piszemy wpis, np. „sportowe auto do 20 000 zł” */
  fraza: string;
  budzet: number;
  /** kiedy sprawdzaliśmy ceny w ogłoszeniach (RRRR-MM-DD) */
  cenySprawdzone: string;
  /** 2–3 zdania – odpowiedź na start */
  odpowiedz: string;
  auta: AutoZakupowe[];
  /** typowe pułapki w tym budżecie */
  pulapki: string[];
  faq: { pytanie: string; odpowiedz: string }[];
  /** sąsiednie poradniki (inna kwota, inne nadwozie) */
  powiazane?: { tytul: string; adres: string }[];
}

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

export interface ZdjecieAktualnosci {
  /** ok. 1600 px szerokości, np. /aktualnosci/nowy-peugeot-208.jpg */
  duze: string;
  /** ok. 800 px – do kafelków */
  male: string;
  szerokosc: number;
  wysokosc: number;
  /** opis dla niewidomych i Google */
  alt: string;
  /** podpis pod zdjęciem, np. „Fot. Škoda Auto – materiały prasowe” */
  podpis: string;
  /** adres oryginalnego zdjęcia prasowego */
  zrodlo?: string;
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
  /** własne zdjęcie (wgrane w panelu) – pliki w public/aktualnosci/ */
  zdjecie?: ZdjecieAktualnosci;
  status: 'szkic' | 'opublikowany';
  /** krótszy tytuł do Google (ok. 48 znaków) – gdy pełny tytuł jest dłuższy */
  seoTytul?: string;
  /** tylko poradniki zakupowe */
  zakupowy?: PoradnikZakupowy;
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
  },
  'jakie-auto': {
    nazwa: 'Poradniki zakupowe',
    krotko: 'Poradnik zakupowy',
    opis: 'Jakie używane auto kupić za konkretną kwotę – modele sprawdzone w polskich ogłoszeniach, spalanie, polecane silniki, plusy i minusy.',
    seoTytul: 'Jakie auto kupić? Poradniki zakupowe',
    seoOpis: 'Jakie używane auto kupić za 10, 20 czy 30 tysięcy zł? Modele z realnymi cenami z polskich ogłoszeń, spalanie, polecane silniki oraz plusy i minusy.'
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

/** Liczby i jednostki nie łamią się na końcu linii (79 900 zł, 150 km) */
export const bezLamania = (t: string) => t.replace(/(\d) (?=\d{3}\b)/g, '$1\u00a0').replace(/(\d) (zł|km|KM|kWh|l|r\.)/g, '$1\u00a0$2');
