// PayU – REST API 2.1 (developers.payu.com). Zastępuje Przelewy24.
// Przebieg:
// 1) token OAuth (client_credentials) – ważny kilka-kilkanaście godzin, trzymamy go w pamięci,
// 2) POST /api/v2_1/orders – PayU odpowiada 302 z JSON-em: redirectUri (bramka płatności) i orderId,
// 3) PayU wysyła powiadomienie na notifyUrl z nagłówkiem OpenPayu-Signature = md5(treść + drugi klucz),
// 4) płatność uznajemy za pewną dopiero, gdy GET /api/v2_1/orders/{orderId} pokaże status COMPLETED.
// Numer zamówienia sklepu (NB…/NS…) wysyłamy jako extOrderId – PayU wymaga, żeby był unikalny w punkcie płatności.
import crypto from 'crypto';
import { env, testowyPayu } from './konfiguracja';

// PAYU_URL – tylko do testów (podmiana adresu na lokalny serwer testowy)
const host = () => process.env.PAYU_URL || (testowyPayu() ? 'https://secure.snd.payu.com' : 'https://secure.payu.com');

let token: { wartosc: string; wygasa: number } | null = null;

async function tokenOAuth(): Promise<string> {
  if (token && token.wygasa > Date.now() + 60_000) return token.wartosc;
  const r = await fetch(`${host()}/pl/standard/user/oauth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      // client_id to zwykle ten sam numer co id punktu płatności (POS)
      client_id: process.env.PAYU_CLIENT_ID || env('PAYU_POS_ID'),
      client_secret: env('PAYU_CLIENT_SECRET')
    }),
    cache: 'no-store'
  });
  const tekst = await r.text();
  if (!r.ok) throw new Error(`PayU OAuth: HTTP ${r.status} ${tekst.slice(0, 300)}`);
  const j = JSON.parse(tekst);
  if (!j.access_token) throw new Error('PayU nie zwróciło tokenu OAuth');
  token = { wartosc: j.access_token, wygasa: Date.now() + Number(j.expires_in || 3600) * 1000 };
  return token.wartosc;
}

async function zapytanie(metoda: 'POST' | 'GET' | 'PUT', sciezka: string, body?: object) {
  const r = await fetch(`${host()}${sciezka}`, {
    method: metoda,
    headers: { Authorization: `Bearer ${await tokenOAuth()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    // tworzenie zamówienia odpowiada kodem 302 – nie idziemy za przekierowaniem, tylko czytamy JSON
    redirect: 'manual',
    cache: 'no-store'
  });
  const tekst = await r.text();
  if (r.status >= 400) {
    if (r.status === 401) token = null;
    throw new Error(`PayU ${sciezka}: HTTP ${r.status} ${tekst.slice(0, 300)}`);
  }
  return tekst ? JSON.parse(tekst) : {};
}

export interface Rejestracja {
  numer: string;
  kwotaGr: number;
  opis: string;
  email: string;
  /** imię i nazwisko albo nazwa firmy */
  klient: string;
  naFirme: boolean;
  adres?: string;
  kod?: string;
  miasto?: string;
  ipKlienta: string;
  urlPowrotu: string;
  urlPowiadomien: string;
}

/** Tworzy zamówienie w PayU. Zwraca adres bramki płatności i numer zamówienia PayU. */
export async function zarejestruj(d: Rejestracja): Promise<{ url: string; orderId: string }> {
  const [imie, ...reszta] = d.klient.trim().split(/\s+/);
  const j = await zapytanie('POST', '/api/v2_1/orders', {
    notifyUrl: d.urlPowiadomien,
    continueUrl: d.urlPowrotu,
    customerIp: d.ipKlienta,
    merchantPosId: env('PAYU_POS_ID'),
    description: d.opis,
    currencyCode: 'PLN',
    totalAmount: String(d.kwotaGr),
    extOrderId: d.numer,
    // 15 minut na zapłatę (jak wcześniej w Przelewy24)
    validityTime: '900',
    buyer: {
      email: d.email,
      language: 'pl',
      ...(d.naFirme ? {} : { firstName: imie, lastName: reszta.join(' ') || imie }),
      // dane do faktury – PayU zwraca je potem w danych zamówienia
      delivery: {
        recipientName: d.klient,
        recipientEmail: d.email,
        ...(d.adres ? { street: d.adres } : {}),
        ...(d.kod ? { postalCode: d.kod } : {}),
        ...(d.miasto ? { city: d.miasto } : {}),
        countryCode: 'PL'
      }
    },
    products: [{ name: d.opis, unitPrice: String(d.kwotaGr), quantity: '1', virtual: true }]
  });
  const kod = j?.status?.statusCode;
  if (kod !== 'SUCCESS' && kod !== 'WARNING_CONTINUE_REDIRECT') throw new Error(`PayU odrzuciło zamówienie: ${kod} ${j?.status?.statusDesc || ''}`);
  if (!j.redirectUri || !j.orderId) throw new Error('PayU nie zwróciło adresu płatności');
  return { url: j.redirectUri, orderId: j.orderId };
}

/** Czy powiadomienie naprawdę przyszło z PayU: nagłówek OpenPayu-Signature = skrót(treść + drugi klucz) */
export function poprawnyPodpis(tresc: string, naglowek: string | null): boolean {
  if (!naglowek) return false;
  const pola = Object.fromEntries(
    naglowek.split(';').map((c) => {
      const [k, ...v] = c.split('=');
      return [k.trim().toLowerCase(), v.join('=').trim()];
    })
  );
  const algorytm = ({ MD5: 'md5', SHA: 'sha1', 'SHA-1': 'sha1', SHA1: 'sha1', 'SHA-256': 'sha256', SHA256: 'sha256' } as Record<string, string>)[(pola.algorithm || 'MD5').toUpperCase()];
  if (!algorytm || !pola.signature) return false;
  const oczekiwany = Buffer.from(crypto.createHash(algorytm).update(tresc + env('PAYU_DRUGI_KLUCZ')).digest('hex'));
  const otrzymany = Buffer.from(pola.signature.toLowerCase());
  return oczekiwany.length === otrzymany.length && crypto.timingSafeEqual(oczekiwany, otrzymany);
}

export interface Zamowienie {
  orderId: string;
  extOrderId: string;
  /** NEW, PENDING, WAITING_FOR_CONFIRMATION, COMPLETED, CANCELED */
  status: string;
  kwotaGr: number;
  waluta: string;
  email: string;
  klient: string;
  adres: string;
  kod: string;
  miasto: string;
}

/** Aktualne dane zamówienia prosto z PayU (pewniejsze niż samo powiadomienie) */
export async function pobierz(orderId: string): Promise<Zamowienie> {
  const j = await zapytanie('GET', `/api/v2_1/orders/${encodeURIComponent(orderId)}`);
  const o = j?.orders?.[0];
  if (!o) throw new Error(`PayU: brak zamówienia ${orderId}`);
  const b = o.buyer || {};
  const dost = b.delivery || {};
  return {
    orderId: o.orderId,
    extOrderId: o.extOrderId || '',
    status: o.status,
    kwotaGr: Number(o.totalAmount),
    waluta: o.currencyCode,
    email: b.email || '',
    klient: dost.recipientName || [b.firstName, b.lastName].filter(Boolean).join(' '),
    adres: dost.street || '',
    kod: dost.postalCode || '',
    miasto: dost.city || ''
  };
}

/** Gdy w panelu PayU wyłączony jest „autoodbiór”, opłacone zamówienie czeka na nasze potwierdzenie */
export async function odbierz(orderId: string) {
  await zapytanie('PUT', `/api/v2_1/orders/${encodeURIComponent(orderId)}/status`, { orderId, orderStatus: 'COMPLETED' });
}

/** Ciasteczko, po którym strona „Dziękujemy” znajduje zamówienie w PayU (PayU nie szuka po naszym numerze) */
export const CIASTKO_ZAMOWIENIA = 'sklep_zam';
