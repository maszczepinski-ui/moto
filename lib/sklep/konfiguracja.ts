// Sklep: „Niezbędnik Bezpiecznego Zakupu Auta Używanego”.
// Wszystkie klucze są TYLKO w zmiennych środowiskowych Vercela (nigdy w kodzie ani w repozytorium – repo jest publiczne).
// Dopóki brakuje którejś zmiennej, sprzedaż jest wyłączona: strona produktu pokazuje „wkrótce”, a API odpowiada 503.
import { site } from '@/config/site';

export const PRODUKT = {
  id: 'niezbednik',
  nazwa: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego',
  /** nazwa pozycji na fakturze */
  pozycja: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego – pakiet plików do pobrania',
  /** cena brutto w groszach (39 zł); można zmienić zmienną SKLEP_CENA_GR bez wdrażania kodu */
  cenaGr: Number(process.env.SKLEP_CENA_GR) || 3900,
  /** wersja regulaminu i treści zgód – zmień przy każdej zmianie regulaminu */
  wersjaZgod: '1'
};

export const ADRES_SKLEPU = `${site.url}/niezbednik/`;
/** link do pobrania jest ważny 7 dni */
export const WAZNOSC_LINKU_S = 7 * 24 * 3600;

const WYMAGANE = ['P24_MERCHANT_ID', 'P24_POS_ID', 'P24_API_KEY', 'P24_CRC', 'INFAKT_API_KEY', 'RESEND_API_KEY', 'MAIL_OD', 'SKLEP_SEKRET', 'PAKIET_URL'] as const;

/** Których zmiennych brakuje (do panelu i do komunikatu „wkrótce”) */
export const brakujaceZmienne = () => WYMAGANE.filter((k) => !process.env[k]);
export const sklepAktywny = () => brakujaceZmienne().length === 0;

export const env = (k: (typeof WYMAGANE)[number]) => {
  const v = process.env[k];
  if (!v) throw new Error(`Brak zmiennej ${k}`);
  return v;
};

/** „tak” w P24_SANDBOX / INFAKT_SANDBOX = środowisko testowe (bez prawdziwych pieniędzy i faktur) */
export const testowyP24 = () => process.env.P24_SANDBOX === 'tak';
export const testowyInfakt = () => process.env.INFAKT_SANDBOX === 'tak';

export const zlotowki = (gr: number) => (gr / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
