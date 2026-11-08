// Pobieranie statystyk z Google Analytics 4 (Google Analytics Data API).
// Logujemy się „kontem technicznym” Google (service account). Jego klucz (plik JSON) wkleja się
// w Vercel → Settings → Environment Variables jako GA4_KLUCZ_JSON, a numer usługi GA4 jako GA4_PROPERTY_ID.
// Klucz nigdy nie trafia do przeglądarki ani do repozytorium.
import { createSign } from 'crypto';

type Klucz = { client_email: string; private_key: string };

export function ga4Skonfigurowane() {
  return !!(process.env.GA4_PROPERTY_ID && process.env.GA4_KLUCZ_JSON);
}

function czytajKlucz(): Klucz {
  const k = JSON.parse(process.env.GA4_KLUCZ_JSON || '{}') as Klucz;
  if (!k.client_email || !k.private_key) throw new Error('Nieprawidłowy klucz GA4_KLUCZ_JSON');
  return { client_email: k.client_email, private_key: k.private_key.replace(/\\n/g, '\n') };
}

const b64url = (t: string | Buffer) => Buffer.from(t).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

let tokenPamiec: { token: string; wygasa: number } | null = null;

/** Krótkotrwały klucz dostępu do Google (ważny godzinę, trzymany w pamięci serwera) */
async function tokenGoogle(): Promise<string> {
  if (tokenPamiec && tokenPamiec.wygasa > Date.now() + 60_000) return tokenPamiec.token;
  const k = czytajKlucz();
  const teraz = Math.floor(Date.now() / 1000);
  const naglowek = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const tresc = b64url(
    JSON.stringify({ iss: k.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: teraz, exp: teraz + 3600 })
  );
  const podpis = b64url(createSign('RSA-SHA256').update(`${naglowek}.${tresc}`).sign(k.private_key));
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${naglowek}.${tresc}.${podpis}` }),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(`Google odrzucił klucz (${r.status}) – sprawdź GA4_KLUCZ_JSON`);
  const j = (await r.json()) as { access_token: string; expires_in: number };
  tokenPamiec = { token: j.access_token, wygasa: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

export type Wiersz = { nazwa: string; wartosc: number };
export type Statystyki = {
  dni: number;
  suma: { uzytkownicy: number; sesje: number; odslony: number; nowi: number };
  dzien: { data: string; uzytkownicy: number; odslony: number }[];
  strony: Wiersz[];
  zrodla: Wiersz[];
  jezyki: Wiersz[];
  kraje: Wiersz[];
};

type Raport = { rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[] };

const liczba = (v?: string) => Number(v || 0);
const lista = (r: Raport): Wiersz[] => (r.rows || []).map((w) => ({ nazwa: w.dimensionValues?.[0]?.value || '(brak)', wartosc: liczba(w.metricValues[0]?.value) }));

const pamiecRaportow = new Map<number, { kiedy: number; dane: Statystyki }>();

/** Zestaw statystyk z ostatnich `dni` dni (wynik trzymany 10 minut, żeby nie zużywać limitów Google) */
export async function pobierzStatystyki(dni: number): Promise<Statystyki> {
  const zPamieci = pamiecRaportow.get(dni);
  if (zPamieci && Date.now() - zPamieci.kiedy < 10 * 60_000) return zPamieci.dane;

  const zakres = [{ startDate: `${dni}daysAgo`, endDate: 'today' }];
  const top = (wymiar: string, metryka: string, limit = 10) => ({
    dateRanges: zakres,
    dimensions: [{ name: wymiar }],
    metrics: [{ name: metryka }],
    orderBys: [{ metric: { metricName: metryka }, desc: true }],
    limit
  });
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:batchRunReports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await tokenGoogle()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        { dateRanges: zakres, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'newUsers' }] },
        { dateRanges: zakres, dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 400 },
        top('pagePath', 'screenPageViews', 15),
        top('sessionDefaultChannelGroup', 'sessions', 8),
        top('language', 'activeUsers', 8)
      ]
    }),
    cache: 'no-store'
  });
  if (!r.ok) {
    const tekst = await r.text();
    throw new Error(r.status === 403 ? 'Konto techniczne nie ma dostępu do usługi GA4 – dodaj je w GA4 jako „Przeglądający”.' : `Błąd Google ${r.status}: ${tekst.slice(0, 200)}`);
  }
  const { reports } = (await r.json()) as { reports: Raport[] };

  // kraje osobnym zapytaniem (batchRunReports przyjmuje najwyżej 5 raportów)
  const rk = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await tokenGoogle()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(top('country', 'activeUsers', 8)),
    cache: 'no-store'
  });
  const kraje = rk.ok ? lista((await rk.json()) as Raport) : [];

  const s = reports[0].rows?.[0]?.metricValues || [];
  const dane: Statystyki = {
    dni,
    suma: { uzytkownicy: liczba(s[0]?.value), sesje: liczba(s[1]?.value), odslony: liczba(s[2]?.value), nowi: liczba(s[3]?.value) },
    dzien: (reports[1].rows || []).map((w) => {
      const d = w.dimensionValues?.[0]?.value || '';
      return { data: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, uzytkownicy: liczba(w.metricValues[0]?.value), odslony: liczba(w.metricValues[1]?.value) };
    }),
    strony: lista(reports[2]),
    zrodla: lista(reports[3]),
    jezyki: lista(reports[4]),
    kraje
  };
  pamiecRaportow.set(dni, { kiedy: Date.now(), dane });
  return dane;
}
