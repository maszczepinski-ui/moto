// Opony: sezon wymiany, rozkodowanie oznaczeń z boku opony i najważniejsze zasady (stan: listopad 2026).
// W Polsce nie ma obowiązku jazdy na oponach zimowych. Wymagana minimalna głębokość bieżnika: 1,6 mm.

export type Sezon = 'zimowe' | 'letnie';

/** Okna „czas wymienić opony”: zimowe 1.10–15.12, letnie 15.03–15.05 */
export function sezonWymiany(d = new Date()): Sezon | null {
  const md = (d.getMonth() + 1) * 100 + d.getDate();
  if (md >= 1001 && md <= 1215) return 'zimowe';
  if (md >= 315 && md <= 515) return 'letnie';
  return null;
}

export interface Rozmiar {
  szerokosc: number;
  profil: number;
  konstrukcja: string;
  srednica: number;
  indeksNosnosci?: number;
  nosnoscKg?: number;
  indeksPredkosci?: string;
  predkoscKmh?: number;
  wysokoscBokuMm: number;
  srednicaKolaMm: number;
}

// indeks nośności → maksymalne obciążenie na jedno koło (kg) – tabela ETRTO dla popularnych wartości
const NOSNOSC: Record<number, number> = {
  75: 387, 76: 400, 77: 412, 78: 425, 79: 437, 80: 450, 81: 462, 82: 475, 83: 487, 84: 500, 85: 515, 86: 530, 87: 545, 88: 560, 89: 580,
  90: 600, 91: 615, 92: 630, 93: 650, 94: 670, 95: 690, 96: 710, 97: 730, 98: 750, 99: 775, 100: 800, 101: 825, 102: 850, 103: 875,
  104: 900, 105: 925, 106: 950, 107: 975, 108: 1000, 109: 1030, 110: 1060, 111: 1090, 112: 1120
};
const PREDKOSC: Record<string, number> = { L: 120, M: 130, N: 140, P: 150, Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300 };

/** Rozkodowuje np. „205/55 R16 91V” */
export function rozkoduj(tekst: string): Rozmiar | null {
  const t = tekst.toUpperCase().replace(/\s+/g, ' ').trim();
  const m = t.match(/(\d{3})\s*\/\s*(\d{2})\s*(Z?R|D|B)?\s*(\d{2})(?:\s*(\d{2,3})\s*([A-Z]))?/);
  if (!m) return null;
  const szerokosc = Number(m[1]), profil = Number(m[2]), srednica = Number(m[4]);
  if (szerokosc < 125 || szerokosc > 355 || profil < 25 || profil > 85 || srednica < 12 || srednica > 23) return null;
  const wysokoscBokuMm = Math.round((szerokosc * profil) / 100);
  const ln = m[5] ? Number(m[5]) : undefined;
  const sp = m[6] || undefined;
  return {
    szerokosc,
    profil,
    konstrukcja: (m[3] || 'R').includes('R') ? 'radialna' : 'diagonalna',
    srednica,
    indeksNosnosci: ln,
    nosnoscKg: ln !== undefined ? NOSNOSC[ln] : undefined,
    indeksPredkosci: sp,
    predkoscKmh: sp ? PREDKOSC[sp] : undefined,
    wysokoscBokuMm,
    srednicaKolaMm: Math.round(srednica * 25.4 + 2 * wysokoscBokuMm)
  };
}

/** Wiek opony z kodu DOT – ostatnie 4 cyfry: tydzień i rok produkcji, np. 2321 = 23. tydzień 2021 */
export function wiekZDot(kod: string, teraz = new Date()): { tydzien: number; rok: number; lata: number } | null {
  const m = kod.replace(/\D/g, '').match(/^(\d{2})(\d{2})$/);
  if (!m) return null;
  const tydzien = Number(m[1]), rok = 2000 + Number(m[2]);
  if (tydzien < 1 || tydzien > 53 || rok > teraz.getFullYear()) return null;
  const data = new Date(rok, 0, 1 + (tydzien - 1) * 7);
  return { tydzien, rok, lata: Math.max(0, (teraz.getTime() - data.getTime()) / (365.25 * 86400000)) };
}

export const ZRODLA_OPONY = [
  { nazwa: 'Auto Świat – opony zimowe a przepisy (31.12.2025)', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/czy-za-jazde-na-letnich-oponach-zima-w-polsce-mozna-dostac-mandat-beda-problemy/54g3msw' },
  { nazwa: 'Continental – ciśnienie w oponach', url: 'https://www.continental-tires.com/pl/pl/tire-knowledge/tire-pressure/' },
  { nazwa: 'Auto Świat – naklejka na klapce wlewu lub na słupku', url: 'https://www.auto-swiat.pl/porady/eksploatacja/wazna-nalepka-na-klapce-wlewu-paliwa-lub-na-slupku-auta-co-tam-znajdziemy/vx6y62y' }
];
