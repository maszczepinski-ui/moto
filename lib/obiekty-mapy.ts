// Zamiana surowych danych OpenStreetMap na proste obiekty do mapy i listy: ładowarki, fotoradary, odcinkowe pomiary.
import type { ElementOsm } from '@/lib/osm';

export type Tryb = 'ladowarki' | 'fotoradary';

export interface Obiekt {
  id: string;
  lat: number;
  lon: number;
  tytul: string;
  /** krótkie linijki opisu pod tytułem */
  opis: string[];
  /** etykiety do filtrów / plakietek */
  znaczniki: string[];
  kolor: string;
  /** dla odcinkowych pomiarów: linia od początku do końca odcinka */
  linia?: [number, number][];
  /** największa moc ładowarki w kW (0 = nie wiadomo) */
  moc?: number;
}

export function zapytanie(tryb: Tryb, lat: number, lon: number, promienKm: number): string {
  const r = Math.round(promienKm * 1000);
  const wokol = `(around:${r},${lat},${lon})`;
  if (tryb === 'ladowarki')
    return `[out:json][timeout:25];(node["amenity"="charging_station"]${wokol};way["amenity"="charging_station"]${wokol};);out center tags;`;
  return `[out:json][timeout:25];(node["highway"="speed_camera"]${wokol};relation["type"="enforcement"]["enforcement"="average_speed"]${wokol};);out geom;`;
}

/** Zapytanie wzdłuż odcinka A → B (pas o podanej szerokości z każdej strony linii prostej między miastami) */
export function zapytanieTrasy(tryb: Tryb, a: { lat: number; lon: number }, b: { lat: number; lon: number }, szerokoscKm: number): string {
  // punkty co ok. 20 km, żeby pas dobrze trzymał się linii
  const n = Math.max(1, Math.ceil(Math.hypot(a.lat - b.lat, (a.lon - b.lon) * 0.65) * 111 / 20));
  const pkt: string[] = [];
  for (let i = 0; i <= n; i++) pkt.push(`${(a.lat + ((b.lat - a.lat) * i) / n).toFixed(5)},${(a.lon + ((b.lon - a.lon) * i) / n).toFixed(5)}`);
  const wokol = `(around:${Math.round(szerokoscKm * 1000)},${pkt.join(',')})`;
  if (tryb === 'ladowarki')
    return `[out:json][timeout:60];(node["amenity"="charging_station"]${wokol};way["amenity"="charging_station"]${wokol};);out center tags;`;
  return `[out:json][timeout:60];(node["highway"="speed_camera"]${wokol};relation["type"="enforcement"]["enforcement"="average_speed"]${wokol};);out geom;`;
}

// --- ładowarki ---

/** kolory znaczników – te same w legendzie mapy */
export const KOLORY = { szybka: '#059669', zwykla: '#336699', nieznana: '#64748b', fotoradar: '#dc2626', odcinkowy: '#9333ea' };

const ZLACZA: [RegExp, string][] = [
  [/^socket:type2_combo$/, 'CCS'],
  [/^socket:chademo$/, 'CHAdeMO'],
  [/^socket:type2$/, 'Typ 2'],
  [/^socket:type2_cable$/, 'Typ 2 (kabel)'],
  [/^socket:tesla_supercharger(_ccs)?$/, 'Tesla'],
  [/^socket:nacs$/, 'Tesla'],
  [/^socket:schuko$/, 'Gniazdko'],
  [/^socket:type1$/, 'Typ 1']
];

function moc(t: Record<string, string>): number {
  let max = 0;
  for (const [k, v] of Object.entries(t)) {
    if (!/output$/.test(k) && k !== 'charging_station:output') continue;
    for (const kawalek of v.split(/[;,]/)) {
      const m = kawalek.trim().match(/^([\d.]+)\s*(kW|W)?/i);
      if (!m) continue;
      const w = Number(m[1]) / (m[2] && m[2].toUpperCase() === 'W' ? 1000 : 1);
      if (w > max && w < 1000) max = w;
    }
  }
  return Math.round(max);
}

export function ladowarka(e: ElementOsm): Obiekt | null {
  const t = e.tags || {};
  if (t.access === 'private' || t.access === 'no') return null;
  const lat = e.lat ?? e.center?.lat;
  const lon = e.lon ?? e.center?.lon;
  if (lat === undefined || lon === undefined) return null;
  const zlacza = [...new Set(ZLACZA.filter(([re]) => Object.keys(t).some((k) => re.test(k) && t[k] !== 'no' && t[k] !== '0')).map(([, n]) => n))];
  const kw = moc(t);
  const adres = [t['addr:street'] || t['addr:place'], t['addr:housenumber']].filter(Boolean).join(' ');
  const opis = [
    t.operator || t.network || t.brand ? `Operator: ${t.operator || t.network || t.brand}` : '',
    adres ? `${adres}${t['addr:city'] ? ', ' + t['addr:city'] : ''}` : '',
    zlacza.length ? `Złącza: ${zlacza.join(', ')}` : '',
    kw ? `Moc do ${kw} kW` : '',
    t.capacity ? `Stanowisk: ${t.capacity}` : '',
    t.opening_hours ? `Godziny: ${t.opening_hours === '24/7' ? 'całą dobę' : t.opening_hours}` : '',
    t.fee === 'no' ? 'Bezpłatna' : t['charge'] ? `Cena: ${t['charge']}` : '',
    t.access === 'customers' ? 'Dla klientów (np. sklepu, hotelu)' : ''
  ].filter(Boolean);
  return {
    id: `${e.type}/${e.id}`,
    lat,
    lon,
    tytul: t.name || t.operator || t.brand || t.network || 'Stacja ładowania',
    opis,
    znaczniki: [...zlacza, ...(kw >= 50 ? ['szybka'] : [])],
    kolor: kw >= 50 ? KOLORY.szybka : kw ? KOLORY.zwykla : KOLORY.nieznana,
    moc: kw
  };
}

// --- fotoradary i odcinkowe pomiary ---

export function fotoradar(e: ElementOsm): Obiekt | null {
  const t = e.tags || {};
  if (e.type === 'node' && e.lat !== undefined && e.lon !== undefined) {
    return {
      id: `node/${e.id}`,
      lat: e.lat,
      lon: e.lon,
      tytul: 'Fotoradar',
      opis: [t.maxspeed ? `Ograniczenie: ${t.maxspeed} km/h` : '', t.ref ? `Numer: ${t.ref}` : '', t.operator ? `Właściciel: ${t.operator}` : ''].filter(Boolean),
      znaczniki: ['fotoradar'],
      kolor: KOLORY.fotoradar
    };
  }
  if (e.type === 'relation' && e.members?.length) {
    const pkt = (rola: string) => e.members!.find((m) => m.role === rola && m.lat !== undefined);
    const od = pkt('from') || pkt('device');
    const doo = pkt('to');
    const wszystkie = e.members.flatMap((m) => (m.lat !== undefined ? [[m.lat, m.lon!] as [number, number]] : (m.geometry || []).map((g) => [g.lat, g.lon] as [number, number])));
    const start = od ? ([od.lat!, od.lon!] as [number, number]) : wszystkie[0];
    if (!start) return null;
    return {
      id: `relation/${e.id}`,
      lat: start[0],
      lon: start[1],
      tytul: t.name ? `Odcinkowy pomiar: ${t.name}` : 'Odcinkowy pomiar prędkości',
      opis: [t.maxspeed ? `Ograniczenie: ${t.maxspeed} km/h` : '', doo ? 'Linia pokazuje początek i koniec odcinka' : ''].filter(Boolean),
      znaczniki: ['odcinkowy'],
      kolor: KOLORY.odcinkowy,
      linia: od && doo ? [[od.lat!, od.lon!], [doo.lat!, doo.lon!]] : undefined
    };
  }
  return null;
}

export function przetworz(tryb: Tryb, el: ElementOsm[]): Obiekt[] {
  const f = tryb === 'ladowarki' ? ladowarka : fotoradar;
  const out: Obiekt[] = [];
  const byly = new Set<string>();
  for (const e of el) {
    const o = f(e);
    if (o && !byly.has(o.id)) {
      byly.add(o.id);
      out.push(o);
    }
  }
  return out;
}
