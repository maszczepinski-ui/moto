// Mapa tłumaczeń: która polska strona ma wersję ukraińską i angielską.
// Na tej podstawie powstają tagi hreflang (dla Google), przełącznik języka i podpowiedź dla odwiedzających.
import { poradnik as poradnikPl, type Poradnik } from '@/lib/poradniki';
import { site } from '@/config/site';
import { JEZYKI_OBCE, META, PORADNIKI_ADRES, type Jezyk, type JezykObcy } from '@/lib/jezyki';
import type { Tlumaczenie } from './typy';
import { PORADNIKI_UK } from './poradniki-uk';
import { ADRESY_NARZEDZI } from './narzedzia';
import { PORADNIKI_EN } from './poradniki-en';

export type { Tlumaczenie } from './typy';

const PORADNIKI_OBCE: Record<JezykObcy, Tlumaczenie[]> = { uk: PORADNIKI_UK, en: PORADNIKI_EN };

/** Przetłumaczony poradnik razem z polskim oryginałem. Tylko te, których oryginał jest już opublikowany. */
export type PoradnikObcy = Tlumaczenie & { oryginal: Poradnik };

export function poradnikiObce(j: JezykObcy): PoradnikObcy[] {
  return PORADNIKI_OBCE[j].flatMap((t) => {
    const oryginal = poradnikPl(t.pl);
    return oryginal ? [{ ...t, oryginal }] : [];
  });
}

export function poradnikObcy(j: JezykObcy, slug: string): PoradnikObcy | undefined {
  return poradnikiObce(j).find((p) => p.slug === slug);
}

export const adresPoradnika = (j: Jezyk, slug: string) => `${PORADNIKI_ADRES[j]}${slug}/`;

/** Zestawy stron, które są swoimi tłumaczeniami: { pl: '/…/', uk: '/uk/…/', en: '/en/…/' } */
export type Odpowiedniki = Partial<Record<Jezyk, string>> & { pl: string };

export function wszystkieOdpowiedniki(): Odpowiedniki[] {
  const zestawy: Odpowiedniki[] = [
    { pl: '/', uk: '/uk/', en: '/en/' },
    { pl: PORADNIKI_ADRES.pl, uk: PORADNIKI_ADRES.uk, en: PORADNIKI_ADRES.en },
    // przetłumaczone narzędzia: mandaty, VIN, OC
    ...Object.values(ADRESY_NARZEDZI)
  ];
  const poPl = new Map<string, Odpowiedniki>();
  for (const j of JEZYKI_OBCE) {
    for (const p of poradnikiObce(j)) {
      const plAdres = adresPoradnika('pl', p.pl);
      const z = poPl.get(plAdres) || { pl: plAdres };
      z[j] = adresPoradnika(j, p.slug);
      poPl.set(plAdres, z);
    }
  }
  return [...zestawy, ...poPl.values()];
}

/** Zestaw odpowiedników dla dowolnego adresu (polskiego albo obcego) */
export function odpowiednikiDla(sciezka: string): Odpowiedniki | undefined {
  const s = sciezka.endsWith('/') ? sciezka : `${sciezka}/`;
  return wszystkieOdpowiedniki().find((z) => Object.values(z).includes(s));
}

/**
 * Tagi hreflang do metadanych strony (alternates.languages).
 * Polska wersja jest domyślna (x-default). Zwraca undefined, gdy strona nie ma tłumaczeń.
 */
export function hreflang(sciezka: string): Record<string, string> | undefined {
  const z = odpowiednikiDla(sciezka);
  if (!z || Object.keys(z).length < 2) return undefined;
  const wynik: Record<string, string> = {};
  for (const j of Object.keys(z) as Jezyk[]) wynik[META[j].hreflang] = `${site.url}${z[j]}`;
  wynik['x-default'] = `${site.url}${z.pl}`;
  return wynik;
}

/**
 * Link wewnętrzny w treści tłumaczenia: jeśli strona docelowa ma wersję w tym języku – prowadzimy do niej,
 * w przeciwnym razie do polskiej (i zaznaczamy to czytelnikowi).
 */
export function lokalnyLink(href: string, j: JezykObcy): { href: string; poPolsku: boolean } {
  const z = odpowiednikiDla(href);
  return z?.[j] ? { href: z[j]!, poPolsku: false } : { href, poPolsku: true };
}
