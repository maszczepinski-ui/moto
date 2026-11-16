// Lektor do rolek MotoFormat: zamienia tekst na mowę Twoim sklonowanym głosem w ElevenLabs.
// Klucz i ID głosu leżą tylko w Vercel (Settings → Environment Variables):
//   ELEVENLABS_API_KEY  – klucz API z ElevenLabs (Developers → API Keys)
//   ELEVENLABS_VOICE_ID – ID Twojego głosu (Voices → Twój głos → Copy voice ID)
//   ELEVENLABS_MODEL    – opcjonalnie, domyślnie eleven_multilingual_v2 (dobrze mówi po polsku)
// Oprócz MP3 robimy plik napisów .srt – ElevenLabs podaje, w której chwili pada każda litera.

const ADRES = process.env.ELEVENLABS_URL || 'https://api.elevenlabs.io';
export const MAKS_ZNAKOW = 2500; // ok. 2,5 minuty mowy – rolki są dużo krótsze

export function lektorSkonfigurowany() {
  return !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
}

const naglowki = () => ({ 'xi-api-key': process.env.ELEVENLABS_API_KEY || '', 'Content-Type': 'application/json', Accept: 'application/json' });

/** Czytelny komunikat z odpowiedzi ElevenLabs */
async function bladElevenLabs(r: Response): Promise<string> {
  let szczegoly = '';
  try {
    const j = (await r.json()) as { detail?: { message?: string; status?: string } | string };
    szczegoly = typeof j.detail === 'string' ? j.detail : j.detail?.message || j.detail?.status || '';
  } catch {
    /* brak treści */
  }
  if (r.status === 401) return `ElevenLabs nie przyjął klucza albo klucz nie ma potrzebnego uprawnienia. ${szczegoly}`.trim();
  if (r.status === 404) return 'Nie ma głosu o takim ID – sprawdź ELEVENLABS_VOICE_ID w Vercel.';
  if (r.status === 429) return 'ElevenLabs: za dużo zapytań naraz albo skończyły się kredyty w tym miesiącu.';
  return `ElevenLabs zwrócił błąd ${r.status}. ${szczegoly}`.trim();
}

export interface StanLektora {
  glos?: string;
  /** ile znaków zostało w tym miesiącu (jeśli klucz ma prawo to sprawdzić) */
  zostalo?: number;
  limit?: number;
  uwagi: string[];
}

/** „Sprawdź połączenie”: nazwa głosu i pozostałe kredyty. Brak uprawnienia do odczytu = tylko uwaga, nie błąd. */
export async function sprawdzLektora(): Promise<StanLektora> {
  const uwagi: string[] = [];
  const stan: StanLektora = { uwagi };
  const g = await fetch(`${ADRES}/v1/voices/${encodeURIComponent(process.env.ELEVENLABS_VOICE_ID || '')}`, { headers: naglowki(), cache: 'no-store' });
  if (g.ok) stan.glos = ((await g.json()) as { name?: string }).name;
  else if (g.status === 404) throw new Error(await bladElevenLabs(g));
  else uwagi.push('Nie udało się odczytać nazwy głosu (klucz nie ma uprawnienia „Voices – odczyt”). Generowanie może mimo to działać – sprawdź przyciskiem „Generuj głos”.');
  const s = await fetch(`${ADRES}/v1/user/subscription`, { headers: naglowki(), cache: 'no-store' });
  if (s.ok) {
    const j = (await s.json()) as { character_count?: number; character_limit?: number };
    if (typeof j.character_limit === 'number') {
      stan.limit = j.character_limit;
      stan.zostalo = Math.max(0, j.character_limit - (j.character_count || 0));
    }
  }
  return stan;
}

interface Wyrownanie {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

export interface Nagranie {
  mp3Base64: string;
  srt: string;
  /** długość nagrania w sekundach */
  czas: number;
}

export async function generujLektora(tekst: string): Promise<Nagranie> {
  const glos = encodeURIComponent(process.env.ELEVENLABS_VOICE_ID || '');
  const r = await fetch(`${ADRES}/v1/text-to-speech/${glos}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: naglowki(),
    body: JSON.stringify({ text: tekst, model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2' }),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(await bladElevenLabs(r));
  const j = (await r.json()) as { audio_base64?: string; alignment?: Wyrownanie | null; normalized_alignment?: Wyrownanie | null };
  if (!j.audio_base64) throw new Error('ElevenLabs nie zwrócił nagrania.');
  const w = j.alignment || j.normalized_alignment;
  const slowa = w ? slowaZWyrownania(w) : [];
  const czas = w?.character_end_times_seconds.length ? Math.max(...w.character_end_times_seconds) : 0;
  return { mp3Base64: j.audio_base64, srt: zrobSrt(slowa), czas };
}

// ——— napisy ———
interface Slowo {
  t: string;
  od: number;
  do: number;
}

/** Skleja litery w słowa z czasem początku i końca */
export function slowaZWyrownania(w: Wyrownanie): Slowo[] {
  const slowa: Slowo[] = [];
  let biezace: Slowo | null = null;
  w.characters.forEach((z, i) => {
    if (/\s/.test(z)) {
      if (biezace) slowa.push(biezace);
      biezace = null;
      return;
    }
    if (!biezace) biezace = { t: z, od: w.character_start_times_seconds[i], do: w.character_end_times_seconds[i] };
    else {
      biezace.t += z;
      biezace.do = w.character_end_times_seconds[i];
    }
  });
  if (biezace) slowa.push(biezace);
  return slowa;
}

const MAKS_SLOW = 4; // krótkie napisy – na rolkach czyta się je jednym rzutem oka
const MAKS_ZN = 24;

/** Dzieli słowa na krótkie napisy i zwraca treść pliku .srt */
export function zrobSrt(slowa: Slowo[]): string {
  const napisy: Slowo[][] = [];
  let grupa: Slowo[] = [];
  slowa.forEach((s, i) => {
    grupa.push(s);
    const dlugosc = grupa.map((x) => x.t).join(' ').length;
    const nast = slowa[i + 1];
    const koniecZdania = /[.!?…:;,–—]$/.test(s.t);
    const przerwa = nast ? nast.od - s.do > 0.35 : true;
    const nastZaDlugie = nast ? dlugosc + 1 + nast.t.length > MAKS_ZN : true;
    if (grupa.length >= MAKS_SLOW || koniecZdania || przerwa || nastZaDlugie) {
      napisy.push(grupa);
      grupa = [];
    }
  });
  if (grupa.length) napisy.push(grupa);
  return napisy
    .map((g, i) => {
      const od = g[0].od;
      // napis zostaje na ekranie do początku następnego (najwyżej 0,5 s dłużej niż ostatnie słowo)
      const nastOd = napisy[i + 1]?.[0].od;
      const koniec = nastOd !== undefined ? Math.min(nastOd, g[g.length - 1].do + 0.5) : g[g.length - 1].do + 0.3;
      return `${i + 1}\n${czasSrt(od)} --> ${czasSrt(Math.max(koniec, od + 0.3))}\n${g.map((x) => x.t).join(' ')}\n`;
    })
    .join('\n');
}

function czasSrt(s: number) {
  const ms = Math.round(s * 1000);
  const p = (n: number, d = 2) => String(n).padStart(d, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
}
