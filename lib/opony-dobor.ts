// Dobór opon: dane z feedu tanie-opony.pl (Awin), przygotowane codziennie przez scripts/opony-feed.py.
// Pliki: data/opony/indeks.json (spis rozmiarów) + data/opony/rozmiary/<rozmiar>.json (oferty).
import fs from 'fs';
import path from 'path';

export type Sezon = 'z' | 'l' | 'c';
export type Klasa = 'premium' | 'srednia' | 'eko';

export interface InfoRozmiaru {
  r: [number, number, number];
  z: number;
  l: number;
  c: number;
  od: number;
}

interface Indeks {
  aktualizacja: string;
  awin: { a: string; m: string } | null;
  liczba: number;
  marki: number;
  rozmiary: Record<string, InfoRozmiaru>;
}

/** Jedna opona – tylko to, czego potrzebuje karta na stronie */
export interface Oferta {
  id: string;
  marka: string;
  model: string;
  indeks: string;
  sezon: Sezon;
  cena: number;
  zdjecie: string;
  dostawa: string;
  pmsf: boolean;
  klasa: Klasa;
  link: string;
}

const KATALOG = path.join(process.cwd(), 'data', 'opony');
/** Rozmiar z mniejszą liczbą ofert dostaje „noindex” – za mało treści dla Google */
export const MIN_OFERT_GOOGLE = 6;

let pamiec: Indeks | null = null;
export function indeksOpon(): Indeks {
  if (!pamiec) {
    const plik = path.join(KATALOG, 'indeks.json');
    pamiec = fs.existsSync(plik)
      ? (JSON.parse(fs.readFileSync(plik, 'utf8')) as Indeks)
      : { aktualizacja: '', awin: null, liczba: 0, marki: 0, rozmiary: {} };
  }
  return pamiec;
}

// Podział marek na klasy – nasza ocena wg pozycji marek na rynku (opisana na stronie), nie test opon.
const PREMIUM = ['Continental', 'Michelin', 'Bridgestone', 'Pirelli', 'Goodyear', 'Dunlop', 'Nokian'];
const SREDNIA = ['Hankook', 'Kumho', 'Yokohama', 'Toyo', 'Falken', 'BFGoodrich', 'Uniroyal', 'Kleber', 'Vredestein', 'Semperit', 'Firestone', 'Fulda', 'Cooper', 'Nexen', 'Maxxis', 'Gislaved', 'Avon', 'Giti'];
export function klasaMarki(m: string): Klasa {
  if (PREMIUM.includes(m)) return 'premium';
  if (SREDNIA.includes(m)) return 'srednia';
  return 'eko';
}

export const nazwaRozmiaru = (r: [number, number, number]) => `${r[0]}/${r[1]} R${r[2]}`;
export const slugRozmiaru = (r: [number, number, number]) => `${r[0]}-${r[1]}-r${r[2]}`;
export const liczbaOfert = (i: InfoRozmiaru) => i.z + i.l + i.c;

export function wszystkieRozmiary(): { slug: string; info: InfoRozmiaru }[] {
  return Object.entries(indeksOpon().rozmiary).map(([slug, info]) => ({ slug, info }));
}

export function infoRozmiaru(slug: string): InfoRozmiaru | null {
  return indeksOpon().rozmiary[slug] || null;
}

/** Najpopularniejsze rozmiary – najwięcej ofert w sklepie */
export function popularneRozmiary(ile = 16) {
  return wszystkieRozmiary()
    .sort((a, b) => liczbaOfert(b.info) - liczbaOfert(a.info))
    .slice(0, ile)
    .sort((a, b) => a.info.r[2] - b.info.r[2] || a.info.r[0] - b.info.r[0] || a.info.r[1] - b.info.r[1]);
}

/** Wszystkie oferty dla rozmiaru, od najtańszej */
export function ofertyRozmiaru(slug: string): Oferta[] {
  const plik = path.join(KATALOG, 'rozmiary', `${slug}.json`);
  if (!/^\d{3}-\d{2}-r\d{2}$/.test(slug) || !fs.existsSync(plik)) return [];
  const { awin } = indeksOpon();
  const surowe = JSON.parse(fs.readFileSync(plik, 'utf8')) as [string, string, string, string, Sezon, number, string, string, number][];
  return surowe.map(([id, marka, model, indeks, sezon, cena, zdjecie, dostawa, pmsf]) => ({
    id,
    marka,
    model,
    indeks,
    sezon,
    cena,
    zdjecie: zdjecie ? `https://static.tyres.net/s/content-synced/${zdjecie}_medium.jpg` : '',
    dostawa,
    pmsf: pmsf === 1,
    klasa: klasaMarki(marka),
    // link partnerski Awin do konkretnej opony
    link: awin ? `https://www.awin1.com/pclick.php?p=${id}&a=${awin.a}&m=${awin.m}` : ''
  }));
}

/** Sezon pokazywany na start: od października do marca zimowe, w pozostałe miesiące letnie */
export function sezonNaStart(info: InfoRozmiaru, data = new Date()): Sezon {
  const m = data.getMonth() + 1;
  const pref: Sezon = m >= 10 || m <= 3 ? 'z' : 'l';
  if (info[pref] > 0) return pref;
  return (['z', 'l', 'c'] as Sezon[]).find((s) => info[s] > 0) || pref;
}

/** Inne rozmiary na tej samej feldze (do linków na dole strony) */
export function rozmiaryNaFeldze(felga: number, bez: string) {
  return wszystkieRozmiary()
    .filter((x) => x.info.r[2] === felga && x.slug !== bez && liczbaOfert(x.info) >= MIN_OFERT_GOOGLE)
    .sort((a, b) => liczbaOfert(b.info) - liczbaOfert(a.info))
    .slice(0, 18)
    .sort((a, b) => a.info.r[0] - b.info.r[0] || a.info.r[1] - b.info.r[1]);
}

export const zl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** „2026-11-27” → „27.11.2026” */
export const dataPl = (d: string) => (d ? d.split('-').reverse().join('.') : '');
