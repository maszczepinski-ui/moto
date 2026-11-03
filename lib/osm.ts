// Dane z OpenStreetMap: wyszukiwanie miejscowości (Nominatim) i obiektów wokół punktu (Overpass).
// Zapytania idą prosto z przeglądarki odwiedzającego – serwer strony nic nie pobiera i nic nie przechowuje,
// więc dane są zawsze świeże (aktualizują je na bieżąco wolontariusze OpenStreetMap).
// Zasady korzystania: Nominatim – najwyżej 1 zapytanie na sekundę, bez podpowiedzi przy każdym naciśnięciu klawisza
// (dlatego szukamy dopiero po kliknięciu „Szukaj”), Overpass – rozsądny ruch. Przy dużym ruchu warto przejść na płatny serwer.

import { znajdzMiasto } from '@/lib/miasta';

export const SERWERY_OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
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

export async function overpass(zapytanie: string, sygnal?: AbortSignal): Promise<ElementOsm[]> {
  let ostatni: unknown;
  for (const serwer of SERWERY_OVERPASS) {
    try {
      const r = await fetch(serwer, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(zapytanie),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: sygnal
      });
      if (!r.ok) throw new Error(`Serwer map odpowiedział ${r.status}`);
      const d = (await r.json()) as { elements: ElementOsm[] };
      return d.elements || [];
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw e;
      ostatni = e;
    }
  }
  throw ostatni instanceof Error ? ostatni : new Error('Serwer map chwilowo nie odpowiada');
}

/** Odległość w km (do sortowania listy) */
export function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const nawigacja = (lat: number, lon: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
