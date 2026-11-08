// Link do pobrania bez bazy danych: zamówienie + termin ważności podpisane tajnym kluczem SKLEP_SEKRET (HMAC-SHA256).
// Nikt bez klucza nie wygeneruje poprawnego linku, a po terminie link przestaje działać.
import crypto from 'crypto';
import { site } from '@/config/site';
import { env, WAZNOSC_LINKU_S } from './konfiguracja';

const podpisz = (s: string, w: number) => crypto.createHmac('sha256', env('SKLEP_SEKRET')).update(`pobierz:${s}:${w}`).digest('base64url');

export function linkPobrania(sessionId: string, teraz = Math.floor(Date.now() / 1000)): { url: string; wazneDo: Date } {
  const w = teraz + WAZNOSC_LINKU_S;
  const q = new URLSearchParams({ s: sessionId, w: String(w), p: podpisz(sessionId, w) });
  return { url: `${site.url}/api/sklep/pobierz/?${q}`, wazneDo: new Date(w * 1000) };
}

export function sprawdzLink(s: string | null, w: string | null, p: string | null, teraz = Math.floor(Date.now() / 1000)): 'ok' | 'zly' | 'wygasl' {
  if (!s || !w || !p || !/^\d+$/.test(w)) return 'zly';
  const a = Buffer.from(podpisz(s, Number(w)));
  const b = Buffer.from(p);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'zly';
  return Number(w) < teraz ? 'wygasl' : 'ok';
}
