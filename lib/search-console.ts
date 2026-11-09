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

async function zapytaj(sciezka: string, metoda = 'GET') {
  const r = await fetch(`${API}${sciezka}`, { method: metoda, headers: { Authorization: `Bearer ${await tokenGoogle(ZAKRES)}` }, cache: 'no-store' });
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
async function wlasciwosc(): Promise<string> {
  if (process.env.GSC_WLASCIWOSC) return process.env.GSC_WLASCIWOSC;
  const host = new URL(site.url).hostname.replace(/^www\./, '');
  const j = (await zapytaj('/sites')) as { siteEntry?: { siteUrl: string; permissionLevel: string }[] } | null;
  const lista = (j?.siteEntry || []).filter((s) => s.permissionLevel !== 'siteUnverifiedUser');
  const pasuje = [`sc-domain:${host}`, `${site.url}/`, `https://www.${host}/`];
  const znaleziona = pasuje.map((p) => lista.find((s) => s.siteUrl === p)).find(Boolean);
  if (!znaleziona) throw new Error('brak-uslugi');
  if (znaleziona.permissionLevel === 'siteRestrictedUser') throw new Error('brak-uprawnien');
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
