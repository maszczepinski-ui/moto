// Sklep: wspólne ustawienia (płatności, faktury, maile) + produkty z lib/sklep/produkty.ts.
// Wszystkie klucze są TYLKO w zmiennych środowiskowych Vercela (nigdy w kodzie ani w repozytorium – repo jest publiczne).
// Dopóki brakuje którejś zmiennej, sprzedaż danego produktu jest wyłączona: strona pokazuje „wkrótce”, a API odpowiada 503.
import { site } from '@/config/site';
import { PRODUKTY, sprzedazWlaczona, type IdProduktu } from './produkty';

/** Niezbędnik Kupującego – pierwszy produkt (stare importy `PRODUKT` dalej działają) */
export const PRODUKT = {
  ...PRODUKTY.niezbednik,
  /** wersja regulaminu i treści zgód – zmień przy każdej zmianie regulaminu (wspólna dla wszystkich produktów).
   *  Wersja 2 = regulamin z pakietem po szkodzie; obowiązuje od chwili włączenia jego sprzedaży. */
  wersjaZgod: sprzedazWlaczona('szkoda') ? '2' : '1'
};

export const ADRES_SKLEPU = `${site.url}/niezbednik/`;
/** link do pobrania jest ważny 7 dni */
export const WAZNOSC_LINKU_S = 7 * 24 * 3600;

/** Klucze wspólne dla całego sklepu (bez plików konkretnych produktów) */
const WSPOLNE = ['P24_MERCHANT_ID', 'P24_POS_ID', 'P24_API_KEY', 'P24_CRC', 'INFAKT_API_KEY', 'RESEND_API_KEY', 'MAIL_OD', 'SKLEP_SEKRET'] as const;
const WYMAGANE = [...WSPOLNE, 'PAKIET_URL'] as const;
type Klucz = (typeof WYMAGANE)[number] | 'PAKIET_SZKODA_URL' | 'SZKODA_DANE_URL' | 'NIEZBEDNIK_DANE_URL';

const bazaJest = () => !!((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));

/** Czego brakuje do sprzedaży danego produktu (do panelu i komunikatu „wkrótce”) */
export function brakujaceDla(id: IdProduktu): string[] {
  if (id === 'niezbednik') return WYMAGANE.filter((k) => !process.env[k]);
  // pakiet po szkodzie: Sprawdzacz jest jego częścią, więc potrzebuje też bazy (logowanie kodem) i prywatnych danych pism
  const braki: string[] = [...WSPOLNE, 'PAKIET_SZKODA_URL', 'SZKODA_DANE_URL'].filter((k) => !process.env[k]);
  if (!bazaJest()) braki.push('baza Upstash');
  if (!sprzedazWlaczona(id)) braki.push('przełącznik „sprzedaz” w data/sklep/produkty.json');
  return braki;
}

/** Których zmiennych brakuje do sprzedaży Niezbędnika */
export const brakujaceZmienne = () => brakujaceDla('niezbednik');
/** Niezbędnik Kupującego w sprzedaży */
export const sklepAktywny = () => brakujaceZmienne().length === 0;
export const produktAktywny = (id: IdProduktu) => brakujaceDla(id).length === 0;

export const env = (k: Klucz) => {
  const v = process.env[k];
  if (!v) throw new Error(`Brak zmiennej ${k}`);
  return v;
};

/** „tak” w P24_SANDBOX / INFAKT_SANDBOX = środowisko testowe (bez prawdziwych pieniędzy i faktur) */
export const testowyP24 = () => process.env.P24_SANDBOX === 'tak';
export const testowyInfakt = () => process.env.INFAKT_SANDBOX === 'tak';

export const zlotowki = (gr: number) => (gr / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
