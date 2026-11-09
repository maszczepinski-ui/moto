// Narzędzia dla kupujących (kalkulator Niezbędnika, Sprawdzacz kosztorysu) – dostęp tylko po zakupie.
// Logowanie bez hasła: e-mail z zamówienia → 6-cyfrowy kod mailem → ciasteczko na rok, maks. 3 urządzenia na zamówienie.
// Dane narzędzi (ceny, treść pism) NIE leżą w repozytorium (jest publiczne) – serwer pobiera je z prywatnego pliku w Vercel Blob.
// Wymaga bazy Upstash Redis (te same zmienne co przypomnienia: KV_REST_API_URL/KV_REST_API_TOKEN albo UPSTASH_REDIS_REST_*).
// Każdy produkt ma osobne klucze w bazie (nb:… i ns:…) i osobne ciasteczko – zakup jednego nie otwiera drugiego.
import { plikSklepu } from '@/lib/sklep/plik-prywatny';
import crypto from 'crypto';
import { redis } from '@/lib/magazyn';
import { env, produktAktywny } from './konfiguracja';
import { PRODUKTY, type IdProduktu } from './produkty';

export const MAKS_URZADZEN = 3;
const ROK_S = 365 * 24 * 3600;

const bazaJest = () => !!((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));
/** Narzędzie produktu działa: produkt w sprzedaży + baza + prywatne dane */
export const narzedzieAktywne = (p: IdProduktu) => produktAktywny(p) && bazaJest() && !!process.env[PRODUKTY[p].daneEnv];
export const kalkulatorAktywny = () => narzedzieAktywne('niezbednik');
/** Czy jest baza – wtedy zapamiętujemy kupujących i obsłużone płatności */
export const bazaSklepu = bazaJest;

export const normalizujEmail = (e: string) => e.trim().toLowerCase();
/** Klucze w bazie: Niezbędnik zostaje przy „nb:” (zgodność z już zapisanymi kupującymi), pakiet po szkodzie ma „ns:” */
const przedrostek = (p: IdProduktu) => (p === 'niezbednik' ? 'nb' : 'ns');
const klucz = (p: IdProduktu, rodzaj: string, x: string) => `${przedrostek(p)}:${rodzaj}:${crypto.createHash('sha256').update(x).digest('hex').slice(0, 32)}`;

/** Po opłaceniu: zapamiętaj kupującego (e-mail → zamówienie) */
export async function zapiszKupujacego(email: string, sessionId: string, p: IdProduktu = 'niezbednik') {
  if (!bazaJest()) return;
  await redis([['SET', klucz(p, 'kup', normalizujEmail(email)), sessionId]]);
}

/** Zabezpieczenie przed podwójną obsługą tej samej płatności (mail i faktura tylko raz). true = obsługujemy pierwszy raz. */
export async function pierwszaObsluga(sessionId: string): Promise<boolean> {
  if (!bazaJest()) return true;
  const [w] = await redis([['SET', `nb:obsl:${sessionId}`, '1', 'NX', 'EX', 90 * 24 * 3600]]);
  return w === 'OK';
}

/** Nowy kod logowania – zwraca kod albo null, gdy e-mail nie kupował lub przekroczono limit */
export async function nowyKod(email: string, p: IdProduktu = 'niezbednik'): Promise<string | null> {
  const e = normalizujEmail(email);
  const [zam, ile] = await redis([['GET', klucz(p, 'kup', e)], ['INCR', klucz(p, 'kodlim', e)]]);
  await redis([['EXPIRE', klucz(p, 'kodlim', e), 3600]]);
  if (!zam || Number(ile) > 5) return null;
  const kod = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await redis([['SET', klucz(p, 'kod', e), kod, 'EX', 900], ['DEL', klucz(p, 'prob', e)]]);
  return kod;
}

const podpis = (p: IdProduktu, s: string) => crypto.createHmac('sha256', env('SKLEP_SEKRET')).update(`${p === 'niezbednik' ? 'kalk' : 'szk'}:${s}`).digest('base64url');

/** Sprawdza kod; przy sukcesie dopisuje urządzenie (najstarsze ponad limit wypada) i zwraca wartość ciasteczka */
export async function zaloguj(email: string, kod: string, p: IdProduktu = 'niezbednik'): Promise<string | 'zly' | 'limit'> {
  const e = normalizujEmail(email);
  const [proby] = await redis([['INCR', klucz(p, 'prob', e)]]);
  await redis([['EXPIRE', klucz(p, 'prob', e), 900]]);
  if (Number(proby) > 8) return 'limit';
  const [zapisany, zam] = await redis([['GET', klucz(p, 'kod', e)], ['GET', klucz(p, 'kup', e)]]);
  if (!zapisany || !zam || !/^\d{6}$/.test(kod)) return 'zly';
  const a = Buffer.from(String(zapisany));
  const b = Buffer.from(kod);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'zly';
  const urzadzenie = crypto.randomBytes(9).toString('base64url');
  const lista = `${przedrostek(p)}:urz:${zam}`;
  await redis([['DEL', klucz(p, 'kod', e)], ['LPUSH', lista, urzadzenie], ['LTRIM', lista, 0, MAKS_URZADZEN - 1]]);
  const tresc = Buffer.from(JSON.stringify({ s: zam, e, u: urzadzenie, t: Math.floor(Date.now() / 1000) })).toString('base64url');
  return `${tresc}.${podpis(p, tresc)}`;
}

export const ciasteczko = (wartosc: string, usun = false, p: IdProduktu = 'niezbednik') =>
  `${PRODUKTY[p].narzedzie.ciastko}=${usun ? '' : wartosc}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${usun ? 0 : ROK_S}`;

/** Odczytuje sesję z ciasteczka i sprawdza, czy urządzenie nadal jest na liście (maks. 3 najnowsze) */
export async function sesja(req: Request, p: IdProduktu = 'niezbednik'): Promise<{ email: string; zamowienie: string } | null> {
  const nazwa = PRODUKTY[p].narzedzie.ciastko;
  const c = (req.headers.get('cookie') || '').split(/;\s*/).find((x) => x.startsWith(`${nazwa}=`));
  const [tresc, pd] = (c?.slice(nazwa.length + 1) || '').split('.');
  if (!tresc || !pd) return null;
  const a = Buffer.from(podpis(p, tresc));
  const b = Buffer.from(pd);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(tresc, 'base64url').toString()) as { s: string; e: string; u: string; t: number };
    if (d.t + ROK_S < Date.now() / 1000) return null;
    const [lista] = await redis([['LRANGE', `${przedrostek(p)}:urz:${d.s}`, 0, MAKS_URZADZEN - 1]]);
    if (!(lista as string[] | null)?.includes(d.u)) return null;
    return { email: d.e, zamowienie: d.s };
  } catch {
    return null;
  }
}

const pamiecDanych: Partial<Record<IdProduktu, { czas: number; dane: unknown }>> = {};
/** Dane narzędzia z prywatnego pliku (NIEZBEDNIK_DANE_URL / SZKODA_DANE_URL), w pamięci przez 10 minut */
export async function daneNarzedzia(p: IdProduktu): Promise<unknown> {
  const w = pamiecDanych[p];
  if (w && Date.now() - w.czas < 600_000) return w.dane;
  const plik = await plikSklepu(process.env[PRODUKTY[p].daneEnv]!);
  if (!plik) throw new Error(`Dane narzędzia ${p}: brak pliku`);
  const dane = await new Response(plik.stream).json();
  pamiecDanych[p] = { czas: Date.now(), dane };
  return dane;
}
export const daneKalkulatora = () => daneNarzedzia('niezbednik');

export function mailKodu(kod: string, p: IdProduktu = 'niezbednik') {
  const gdzie = p === 'niezbednik' ? 'do kalkulatora Niezbędnika' : 'do Sprawdzacza kosztorysu';
  const tekst = `Twój kod ${gdzie}: ${kod}\n\nKod jest ważny 15 minut. Jeśli to nie Ty prosiłeś o kod, zignoruj tę wiadomość.`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;color:#0f172a"><p>Twój kod ${gdzie}:</p><p style="font-size:32px;font-weight:800;letter-spacing:6px;margin:8px 0">${kod}</p><p style="font-size:13px;color:#475569">Kod jest ważny 15 minut. Jeśli to nie Ty prosiłeś o kod, zignoruj tę wiadomość.</p></div>`;
  return { tekst, html, temat: `Kod ${gdzie}: ${kod}` };
}
