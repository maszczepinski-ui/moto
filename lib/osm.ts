// Dane z OpenStreetMap: wyszukiwanie miejscowości (Nominatim) i obiektów wokół punktu (Overpass).
// Zapytania idą prosto z przeglądarki odwiedzającego – serwer strony nic nie pobiera i nic nie przechowuje,
// więc dane są zawsze świeże (aktualizują je na bieżąco wolontariusze OpenStreetMap).
// Zasady korzystania: Nominatim – najwyżej 1 zapytanie na sekundę, bez podpowiedzi przy każdym naciśnięciu klawisza
// (dlatego szukamy dopiero po kliknięciu „Szukaj”), Overpass – rozsądny ruch. Przy dużym ruchu warto przejść na płatny serwer.

import { znajdzMiasto } from '@/lib/miasta';

// (overpass.kumi.systems nie pozwala na zapytania z przeglądarki – używa go tylko automat na GitHubie)
export const SERWERY_OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
export const KAFELKI_MAPY = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const ATRYBUCJA = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">autorzy OpenStreetMap</a>';

export interface Punkt {
  lat: number;
  lon: number;
  nazwa: string;
}

export async function znajdzMiejsce(tekst: string): Promise<Punkt | null> {
  const lokalne = znajdzMiasto(tekst);
  if (lokalne) return { lat: lokalne.lat, lon: lokalne.lon, nazwa: lokalne.nazwa };
  const q = tekst.trim();
  if (!q) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=pl&limit=1&accept-language=pl&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('Wyszukiwarka miejscowości chwilowo nie odpowiada');
  const d = (await r.json()) as { lat: string; lon: string; display_name: string; name?: string }[];
  if (!d.length) return null;
  return { lat: Number(d[0].lat), lon: Number(d[0].lon), nazwa: d[0].name || d[0].display_name.split(',')[0] };
}

export interface ElementOsm {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
  members?: { type: string; ref: number; role: string; lat?: number; lon?: number; geometry?: { lat: number; lon: number }[] }[];
}

/** Sygnał przerwania: gdy użytkownik zacznie nowe wyszukiwanie albo minie limit czasu (działa też w starszych przeglądarkach) */
function zLimitem(sygnal: AbortSignal | undefined, ms: number): AbortSignal {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  sygnal?.addEventListener('abort', () => ac.abort(), { once: true });
  ac.signal.addEventListener('abort', () => clearTimeout(t), { once: true });
  return ac.signal;
}

export async function overpass(zapytanie: string, sygnal?: AbortSignal): Promise<ElementOsm[]> {
  let ostatni: unknown;
  for (const serwer of SERWERY_OVERPASS) {
    try {
      const r = await fetch(serwer, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(zapytanie),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: zLimitem(sygnal, 20000)
      });
      if (!r.ok) throw new Error(`Serwer map odpowiedział ${r.status}`);
      const d = (await r.json()) as { elements: ElementOsm[] };
      return d.elements || [];
    } catch (e) {
      if ((e as Error).name === 'AbortError' && sygnal?.aborted) throw e;
      ostatni = e;
    }
  }
  // błąd „przekroczony czas” zamieniamy na zwykły, żeby strona pokazała komunikat (a nie uznała go za anulowanie przez użytkownika)
  throw new Error(ostatni instanceof Error && ostatni.name !== 'AbortError' ? ostatni.message : 'Serwery map chwilowo nie odpowiadają');
}

/** Odległość w km (do sortowania listy) */
export function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const nawigacja = (lat: number, lon: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;

// --- dane zapisane na stronie (public/mapy) – pobiera je co tydzień automat „Aktualizuj mapy” ---

interface Indeks {
  zaktualizowano: string;
  liczba: number;
  kratki: string[];
}
const pamiecIndeksu: Record<string, Promise<Indeks | null>> = {};
const pamiecKratek: Record<string, Promise<ElementOsm[]>> = {};

function indeks(tryb: string) {
  return (pamiecIndeksu[tryb] ||= fetch(`/mapy/${tryb}/index.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Indeks>) : null))
    .catch(() => null));
}

/** Odległość punktu od odcinka A–B w km (przybliżenie płaskie – wystarczy na odległości w Polsce) */
export function odOdcinka(p: { lat: number; lon: number }, a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const kx = 111.32 * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  const ky = 110.57;
  const [ax, ay, bx, by, px, py] = [a.lon * kx, a.lat * ky, b.lon * kx, b.lat * ky, p.lon * kx, p.lat * ky];
  const dx = bx - ax, dy = by - ay;
  const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

const polozenie = (e: ElementOsm) =>
  e.lat !== undefined ? { lat: e.lat, lon: e.lon! } : e.center ? e.center : e.members?.find((m) => m.lat !== undefined) ? { lat: e.members.find((m) => m.lat !== undefined)!.lat!, lon: e.members.find((m) => m.lat !== undefined)!.lon! } : null;

/**
 * Obiekty z plików na stronie: w promieniu od punktu (b = undefined) albo wzdłuż odcinka A–B.
 * Zwraca null, gdy plików jeszcze nie ma (automat nie był uruchomiony) – wtedy pytamy serwery OpenStreetMap na żywo.
 */
export async function zPlikow(tryb: string, a: { lat: number; lon: number }, promienKm: number, b?: { lat: number; lon: number }): Promise<{ el: ElementOsm[]; data: string } | null> {
  const ix = await indeks(tryb);
  if (!ix) return null;
  const st = promienKm / 111;
  const minLat = Math.floor(Math.min(a.lat, b?.lat ?? a.lat) - st), maxLat = Math.floor(Math.max(a.lat, b?.lat ?? a.lat) + st);
  const stLon = st / Math.cos((a.lat * Math.PI) / 180);
  const minLon = Math.floor(Math.min(a.lon, b?.lon ?? a.lon) - stLon), maxLon = Math.floor(Math.max(a.lon, b?.lon ?? a.lon) + stLon);
  const potrzebne: string[] = [];
  for (let la = minLat; la <= maxLat; la++)
    for (let lo = minLon; lo <= maxLon; lo++) {
      const k = `${la}_${lo}`;
      if (!ix.kratki.includes(k)) continue;
      // przy trasie bierzemy tylko kratki, które leżą blisko linii
      if (b && odOdcinka({ lat: la + 0.5, lon: lo + 0.5 }, a, b) > promienKm + 80) continue;
      potrzebne.push(k);
    }
  const listy = await Promise.all(
    potrzebne.map((k) => (pamiecKratek[`${tryb}/${k}`] ||= fetch(`/mapy/${tryb}/${k}.json`).then((r) => (r.ok ? r.json() : [])).catch(() => [])))
  );
  const el = listy.flat().filter((e) => {
    const p = polozenie(e);
    if (!p) return false;
    return b ? odOdcinka(p, a, b) <= promienKm : km(a, p) <= promienKm;
  });
  return { el, data: ix.zaktualizowano };
}
