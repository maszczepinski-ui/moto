// Zgłaszanie mapy strony w Google Search Console (Search Console API).
// Używamy tego samego konta technicznego Google co statystyki (GA4_KLUCZ_JSON).
// Żeby działało, adres e-mail tego konta (client_email z pliku klucza) trzeba dodać w Search Console:
// Ustawienia → Użytkownicy i uprawnienia → Dodaj użytkownika → uprawnienie „Pełne”.
// W Google Cloud musi być włączone „Google Search Console API”.
import { site } from '@/config/site';
import { kluczGoogleJest, tokenGoogle } from '@/lib/ga4';

const API = 'https://www.googleapis.com/webmasters/v3';
const ZAKRES = 'https://www.googleapis.com/auth/webmasters';
export const ADRES_MAPY = `${site.url}/sitemap.xml`;

export const gscSkonfigurowane = kluczGoogleJest;

async function zapytaj(sciezka: string, metoda = 'GET', tresc?: unknown) {
  const adres = sciezka.startsWith('https://') ? sciezka : `${API}${sciezka}`;
  const r = await fetch(adres, {
    method: metoda,
    headers: { Authorization: `Bearer ${await tokenGoogle(ZAKRES)}`, ...(tresc ? { 'Content-Type': 'application/json' } : {}) },
    body: tresc ? JSON.stringify(tresc) : undefined,
    cache: 'no-store'
  });
  if (r.status === 403) throw new Error('brak-uprawnien');
  if (r.status === 404) return null;
  if (!r.ok) {
    const tekst = await r.text();
    if (/has not been used|is disabled/i.test(tekst)) throw new Error('api-wylaczone');
    throw new Error(`Google Search Console odpowiedział błędem ${r.status}`);
  }
  return r.status === 204 ? {} : r.json().catch(() => ({}));
}

/** Szukamy usługi strony w Search Console: najpierw zmienna GSC_WLASCIWOSC, potem domena, potem adres z https */
async function wlasciwosc(tylkoOdczyt = false): Promise<string> {
  if (process.env.GSC_WLASCIWOSC) return process.env.GSC_WLASCIWOSC;
  const host = new URL(site.url).hostname.replace(/^www\./, '');
  const j = (await zapytaj('/sites')) as { siteEntry?: { siteUrl: string; permissionLevel: string }[] } | null;
  const lista = (j?.siteEntry || []).filter((s) => s.permissionLevel !== 'siteUnverifiedUser');
  const pasuje = [`sc-domain:${host}`, `${site.url}/`, `https://www.${host}/`];
  const znaleziona = pasuje.map((p) => lista.find((s) => s.siteUrl === p)).find(Boolean);
  if (!znaleziona) throw new Error('brak-uslugi');
  if (!tylkoOdczyt && znaleziona.permissionLevel === 'siteRestrictedUser') throw new Error('brak-uprawnien');
  return znaleziona.siteUrl;
}

export interface StanMapyGoogle {
  usluga: string;
  zgloszona: boolean;
  ostatnieZgloszenie?: string;
  ostatniePobranie?: string;
  oczekuje?: boolean;
  bledy?: number;
  ostrzezenia?: number;
  adresowWMapie?: number;
}

export async function stanMapyGoogle(): Promise<StanMapyGoogle> {
  const usluga = await wlasciwosc();
  const j = (await zapytaj(`/sites/${encodeURIComponent(usluga)}/sitemaps/${encodeURIComponent(ADRES_MAPY)}`)) as {
    lastSubmitted?: string;
    lastDownloaded?: string;
    isPending?: boolean;
    errors?: string;
    warnings?: string;
    contents?: { submitted?: string }[];
  } | null;
  if (!j) return { usluga, zgloszona: false };
  return {
    usluga,
    zgloszona: true,
    ostatnieZgloszenie: j.lastSubmitted,
    ostatniePobranie: j.lastDownloaded,
    oczekuje: j.isPending,
    bledy: Number(j.errors || 0),
    ostrzezenia: Number(j.warnings || 0),
    adresowWMapie: (j.contents || []).reduce((s, c) => s + Number(c.submitted || 0), 0) || undefined
  };
}

/** Zgłasza (albo zgłasza ponownie) mapę strony – Google pobierze ją przy najbliższej okazji */
export async function zglosMapeGoogle(): Promise<StanMapyGoogle> {
  const usluga = await wlasciwosc();
  await zapytaj(`/sites/${encodeURIComponent(usluga)}/sitemaps/${encodeURIComponent(ADRES_MAPY)}`, 'PUT');
  return stanMapyGoogle();
}

/** Czy strona była zbudowana (czyli mogła się zmienić mapa) po ostatnim zgłoszeniu */
export function zmianyPoZgloszeniu(s: StanMapyGoogle): boolean {
  const budowa = process.env.CZAS_BUDOWY;
  if (!s.zgloszona || !s.ostatnieZgloszenie) return true;
  return !!budowa && Date.parse(budowa) > Date.parse(s.ostatnieZgloszenie);
}

// ——— Raport w panelu: ruch z wyszukiwarki Google i stan indeksowania kart ———

export type WierszGsc = { klucz: string; klikniecia: number; wyswietlenia: number; ctr: number; pozycja: number };
export interface RaportWyszukiwania {
  od: string;
  do: string;
  suma: Omit<WierszGsc, 'klucz'>;
  poprzednio: Omit<WierszGsc, 'klucz'>;
  dni: WierszGsc[];
  frazy: WierszGsc[];
  strony: WierszGsc[];
  /** frazy z wieloma wyświetleniami na pozycjach 5–20 – tu najłatwiej o więcej kliknięć */
  szanse: WierszGsc[];
}

const dzien = (d: Date) => d.toISOString().slice(0, 10);
const przesun = (d: Date, dni: number) => new Date(d.getTime() + dni * 86400000);

type Odp = { rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[] };
const wiersze = (j: Odp | null): WierszGsc[] =>
  (j?.rows || []).map((r) => ({ klucz: r.keys?.[0] || '', klikniecia: r.clicks, wyswietlenia: r.impressions, ctr: r.ctr, pozycja: r.position }));

async function analityka(usluga: string, od: string, do_: string, wymiar?: string, limit = 25) {
  return wiersze(
    (await zapytaj(`/sites/${encodeURIComponent(usluga)}/searchAnalytics/query`, 'POST', {
      startDate: od,
      endDate: do_,
      ...(wymiar ? { dimensions: [wymiar] } : {}),
      rowLimit: limit,
      dataState: 'final'
    })) as Odp | null
  );
}

const pusty = { klikniecia: 0, wyswietlenia: 0, ctr: 0, pozycja: 0 };

/** Dane Google pojawiają się z ok. 2–3-dniowym opóźnieniem, więc okres kończy się 3 dni temu */
export async function raportWyszukiwania(dni: number): Promise<RaportWyszukiwania> {
  const usluga = await wlasciwosc(true);
  const koniec = przesun(new Date(), -3);
  const poczatek = przesun(koniec, -(dni - 1));
  const [od, do_] = [dzien(poczatek), dzien(koniec)];
  const [pOd, pDo] = [dzien(przesun(poczatek, -dni)), dzien(przesun(poczatek, -1))];
  const [suma, poprzednio, dniowe, frazy, strony, szerokoFrazy] = await Promise.all([
    analityka(usluga, od, do_),
    analityka(usluga, pOd, pDo),
    analityka(usluga, od, do_, 'date', 100),
    analityka(usluga, od, do_, 'query', 25),
    analityka(usluga, od, do_, 'page', 25),
    analityka(usluga, od, do_, 'query', 500)
  ]);
  const bez = ({ klucz: _k, ...r }: WierszGsc) => r; // eslint-disable-line @typescript-eslint/no-unused-vars
  return {
    od,
    do: do_,
    suma: suma[0] ? bez(suma[0]) : pusty,
    poprzednio: poprzednio[0] ? bez(poprzednio[0]) : pusty,
    dni: dniowe.sort((a, b) => a.klucz.localeCompare(b.klucz)),
    frazy,
    strony: strony.map((s) => ({ ...s, klucz: s.klucz.replace(site.url, '') || '/' })),
    szanse: szerokoFrazy
      .filter((f) => f.pozycja >= 5 && f.pozycja <= 20 && f.wyswietlenia >= 20)
      .sort((a, b) => b.wyswietlenia - a.wyswietlenia)
      .slice(0, 15)
  };
}

export interface StanIndeksu {
  adres: string;
  werdykt: string;
  stan: string;
  ostatnieSkanowanie?: string;
  kanonicznyGoogle?: string;
}

/** Sprawdza w Google (narzędzie „Sprawdzanie adresu URL”), czy podane strony są w indeksie. Limit Google: 2000 sprawdzeń dziennie. */
export async function stanIndeksu(adresy: string[]): Promise<StanIndeksu[]> {
  const usluga = await wlasciwosc(true);
  const wynik: StanIndeksu[] = [];
  for (let i = 0; i < adresy.length; i += 5) {
    const partia = await Promise.all(
      adresy.slice(i, i + 5).map(async (adres) => {
        try {
          const j = (await zapytaj('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', 'POST', {
            inspectionUrl: adres,
            siteUrl: usluga,
            languageCode: 'pl'
          })) as { inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string; googleCanonical?: string } } } | null;
          const s = j?.inspectionResult?.indexStatusResult;
          return { adres, werdykt: s?.verdict || 'NIEZNANY', stan: s?.coverageState || '—', ostatnieSkanowanie: s?.lastCrawlTime, kanonicznyGoogle: s?.googleCanonical };
        } catch (e) {
          return { adres, werdykt: 'BLAD', stan: (e as Error).message };
        }
      })
    );
    wynik.push(...partia);
  }
  return wynik;
}
