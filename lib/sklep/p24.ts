// Przelewy24 – REST API v1. Zgodne z dokumentacją P24 i biblioteką mnastalski/przelewy24-php:
// – podpis = SHA-384 z JSON-a o ściśle określonej kolejności pól (bez ucieczek znaków – tak jak JSON.stringify),
// – logowanie: Basic, login = posId, hasło = klucz API (tzw. „klucz do raportów”),
// – płatność jest pewna DOPIERO po weryfikacji (PUT /transaction/verify), nie po samym powiadomieniu.
import crypto from 'crypto';
import { env, testowyP24 } from './konfiguracja';

// P24_URL – tylko do testów (podmiana adresu na lokalny serwer testowy)
const host = () => process.env.P24_URL || (testowyP24() ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl');
/** adresy IP, z których P24 wysyła powiadomienia (dodatkowe zabezpieczenie oprócz podpisu) */
export const IP_P24 = ['5.252.202.254', '5.252.202.255', '20.215.81.124'];

export const podpis = (pola: Record<string, string | number>) => crypto.createHash('sha384').update(JSON.stringify(pola)).digest('hex');

const ids = () => ({ merchantId: Number(env('P24_MERCHANT_ID')), posId: Number(env('P24_POS_ID')) });

async function zapytanie(metoda: 'POST' | 'PUT' | 'GET', sciezka: string, body?: object) {
  const r = await fetch(`${host()}/api/v1${sciezka}`, {
    method: metoda,
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${env('P24_POS_ID')}:${env('P24_API_KEY')}`).toString('base64'),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });
  const tekst = await r.text();
  if (!r.ok) throw new Error(`Przelewy24 ${sciezka}: HTTP ${r.status} ${tekst.slice(0, 300)}`);
  return JSON.parse(tekst);
}

export interface Rejestracja {
  sessionId: string;
  kwotaGr: number;
  opis: string;
  email: string;
  klient: string;
  adres?: string;
  kod?: string;
  miasto?: string;
  urlPowrotu: string;
  urlStatusu: string;
}

/** Rejestruje płatność i zwraca adres, pod który przekierowujemy kupującego */
export async function zarejestruj(d: Rejestracja): Promise<string> {
  const { merchantId, posId } = ids();
  const sign = podpis({ sessionId: d.sessionId, merchantId, amount: d.kwotaGr, currency: 'PLN', crc: env('P24_CRC') });
  const j = await zapytanie('POST', '/transaction/register', {
    merchantId,
    posId,
    sessionId: d.sessionId,
    amount: d.kwotaGr,
    currency: 'PLN',
    description: d.opis,
    email: d.email,
    client: d.klient,
    ...(d.adres ? { address: d.adres } : {}),
    ...(d.kod ? { zip: d.kod } : {}),
    ...(d.miasto ? { city: d.miasto } : {}),
    country: 'PL',
    language: 'pl',
    urlReturn: d.urlPowrotu,
    urlStatus: d.urlStatusu,
    timeLimit: 15,
    encoding: 'UTF-8',
    sign
  });
  const token = j?.data?.token;
  if (!token) throw new Error('Przelewy24 nie zwróciło tokenu płatności');
  return `${host()}/trnRequest/${token}`;
}

export interface Powiadomienie {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: number;
  currency: string;
  orderId: number;
  methodId: number;
  statement: string;
  sign: string;
}

/** Czy powiadomienie naprawdę przyszło z P24 (podpis z naszym kluczem CRC) */
export function poprawnePowiadomienie(p: Powiadomienie): boolean {
  const { merchantId, posId } = ids();
  if (p.merchantId !== merchantId || p.posId !== posId) return false;
  const oczekiwany = podpis({
    merchantId: p.merchantId,
    posId: p.posId,
    sessionId: p.sessionId,
    amount: p.amount,
    originAmount: p.originAmount,
    currency: p.currency,
    orderId: p.orderId,
    methodId: p.methodId,
    statement: p.statement,
    crc: env('P24_CRC')
  });
  const a = Buffer.from(oczekiwany);
  const b = Buffer.from(String(p.sign || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Potwierdza płatność w P24 – bez tego pieniądze nie trafią na konto */
export async function weryfikuj(p: { sessionId: string; orderId: number; amount: number }) {
  const { merchantId, posId } = ids();
  const sign = podpis({ sessionId: p.sessionId, orderId: p.orderId, amount: p.amount, currency: 'PLN', crc: env('P24_CRC') });
  const j = await zapytanie('PUT', '/transaction/verify', { merchantId, posId, sessionId: p.sessionId, amount: p.amount, currency: 'PLN', orderId: p.orderId, sign });
  if (j?.data?.status !== 'success') throw new Error('Przelewy24 nie potwierdziło weryfikacji płatności');
}

export interface Transakcja {
  status: number;
  amount: number;
  clientEmail: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientPostcode: string;
  description: string;
}

/** Dane transakcji po sessionId. Status 2 = płatność dokonana i zweryfikowana. */
export async function znajdz(sessionId: string): Promise<Transakcja> {
  const j = await zapytanie('GET', `/transaction/by/sessionId/${encodeURIComponent(sessionId)}`);
  return j.data as Transakcja;
}
