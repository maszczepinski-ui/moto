// Kalkulator Niezbędnika (koszty startowe + argumenty do negocjacji) – dostęp tylko dla kupujących.
// Logowanie bez hasła: e-mail z zamówienia → 6-cyfrowy kod mailem → ciasteczko na rok, maks. 3 urządzenia na zamówienie.
// Dane kalkulatora (ceny, argumenty) NIE leżą w repozytorium (jest publiczne) – serwer pobiera je z adresu NIEZBEDNIK_DANE_URL.
// Wymaga bazy Upstash Redis (te same zmienne co przypomnienia: KV_REST_API_URL/KV_REST_API_TOKEN albo UPSTASH_REDIS_REST_*).
import crypto from 'crypto';
import { redis } from '@/lib/magazyn';
import { env, sklepAktywny } from './konfiguracja';

export const CIASTKO = 'nb_sesja';
export const MAKS_URZADZEN = 3;
const ROK_S = 365 * 24 * 3600;

const bazaJest = () => !!((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));
export const kalkulatorAktywny = () => sklepAktywny() && bazaJest() && !!process.env.NIEZBEDNIK_DANE_URL;
/** Czy jest baza – wtedy zapamiętujemy kupujących i obsłużone płatności */
export const bazaSklepu = bazaJest;

export const normalizujEmail = (e: string) => e.trim().toLowerCase();
const klucz = (rodzaj: string, x: string) => `nb:${rodzaj}:${crypto.createHash('sha256').update(x).digest('hex').slice(0, 32)}`;

/** Po opłaceniu: zapamiętaj kupującego (e-mail → zamówienie) */
export async function zapiszKupujacego(email: string, sessionId: string) {
  if (!bazaJest()) return;
  await redis([['SET', klucz('kup', normalizujEmail(email)), sessionId]]);
}

/** Zabezpieczenie przed podwójną obsługą tej samej płatności (mail i faktura tylko raz). true = obsługujemy pierwszy raz. */
export async function pierwszaObsluga(sessionId: string): Promise<boolean> {
  if (!bazaJest()) return true;
  const [w] = await redis([['SET', `nb:obsl:${sessionId}`, '1', 'NX', 'EX', 90 * 24 * 3600]]);
  return w === 'OK';
}

/** Nowy kod logowania – zwraca kod albo null, gdy e-mail nie kupował lub przekroczono limit */
export async function nowyKod(email: string): Promise<string | null> {
  const e = normalizujEmail(email);
  const [zam, ile] = await redis([['GET', klucz('kup', e)], ['INCR', klucz('kodlim', e)]]);
  await redis([['EXPIRE', klucz('kodlim', e), 3600]]);
  if (!zam || Number(ile) > 5) return null;
  const kod = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await redis([['SET', klucz('kod', e), kod, 'EX', 900], ['DEL', klucz('prob', e)]]);
  return kod;
}

const podpis = (s: string) => crypto.createHmac('sha256', env('SKLEP_SEKRET')).update(`kalk:${s}`).digest('base64url');

/** Sprawdza kod; przy sukcesie dopisuje urządzenie (najstarsze ponad limit wypada) i zwraca wartość ciasteczka */
export async function zaloguj(email: string, kod: string): Promise<string | 'zly' | 'limit'> {
  const e = normalizujEmail(email);
  const [proby] = await redis([['INCR', klucz('prob', e)]]);
  await redis([['EXPIRE', klucz('prob', e), 900]]);
  if (Number(proby) > 8) return 'limit';
  const [zapisany, zam] = await redis([['GET', klucz('kod', e)], ['GET', klucz('kup', e)]]);
  if (!zapisany || !zam || !/^\d{6}$/.test(kod)) return 'zly';
  const a = Buffer.from(String(zapisany));
  const b = Buffer.from(kod);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'zly';
  const urzadzenie = crypto.randomBytes(9).toString('base64url');
  await redis([
    ['DEL', klucz('kod', e)],
    ['LPUSH', `nb:urz:${zam}`, urzadzenie],
    ['LTRIM', `nb:urz:${zam}`, 0, MAKS_URZADZEN - 1]
  ]);
  const tresc = Buffer.from(JSON.stringify({ s: zam, e, u: urzadzenie, t: Math.floor(Date.now() / 1000) })).toString('base64url');
  return `${tresc}.${podpis(tresc)}`;
}

export const ciasteczko = (wartosc: string, usun = false) =>
  `${CIASTKO}=${usun ? '' : wartosc}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${usun ? 0 : ROK_S}`;

/** Odczytuje sesję z ciasteczka i sprawdza, czy urządzenie nadal jest na liście (maks. 3 najnowsze) */
export async function sesja(req: Request): Promise<{ email: string; zamowienie: string } | null> {
  const c = (req.headers.get('cookie') || '').split(/;\s*/).find((x) => x.startsWith(`${CIASTKO}=`));
  const [tresc, p] = (c?.slice(CIASTKO.length + 1) || '').split('.');
  if (!tresc || !p) return null;
  const a = Buffer.from(podpis(tresc));
  const b = Buffer.from(p);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(tresc, 'base64url').toString()) as { s: string; e: string; u: string; t: number };
    if (d.t + ROK_S < Date.now() / 1000) return null;
    const [lista] = await redis([['LRANGE', `nb:urz:${d.s}`, 0, MAKS_URZADZEN - 1]]);
    if (!(lista as string[] | null)?.includes(d.u)) return null;
    return { email: d.e, zamowienie: d.s };
  } catch {
    return null;
  }
}

let pamiecDanych: { czas: number; dane: unknown } | null = null;
/** Dane kalkulatora z prywatnego pliku (NIEZBEDNIK_DANE_URL), w pamięci przez 10 minut */
export async function daneKalkulatora(): Promise<unknown> {
  if (pamiecDanych && Date.now() - pamiecDanych.czas < 600_000) return pamiecDanych.dane;
  const r = await fetch(process.env.NIEZBEDNIK_DANE_URL!, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Dane kalkulatora: HTTP ${r.status}`);
  pamiecDanych = { czas: Date.now(), dane: await r.json() };
  return pamiecDanych.dane;
}

export function mailKodu(kod: string) {
  const tekst = `Twój kod do kalkulatora Niezbędnika: ${kod}\n\nKod jest ważny 15 minut. Jeśli to nie Ty prosiłeś o kod, zignoruj tę wiadomość.`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;color:#0f172a"><p>Twój kod do kalkulatora Niezbędnika:</p><p style="font-size:32px;font-weight:800;letter-spacing:6px;margin:8px 0">${kod}</p><p style="font-size:13px;color:#475569">Kod jest ważny 15 minut. Jeśli to nie Ty prosiłeś o kod, zignoruj tę wiadomość.</p></div>`;
  return { tekst, html };
}
