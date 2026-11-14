// Produkty sklepu. Każdy produkt ma własną cenę, plik ZIP i (opcjonalnie) narzędzie dla kupujących.
// Wspólne dla wszystkich: płatności (PayU), faktury (inFakt), maile (Resend), regulamin.
// Klucze i adresy plików są TYLKO w zmiennych Vercela (repozytorium jest publiczne).
import ustawienia from '@/data/sklep/produkty.json';

export type IdProduktu = 'niezbednik' | 'szkoda';

export interface Produkt {
  id: IdProduktu;
  /** początek numeru zamówienia (extOrderId w PayU) – po nim rozpoznajemy produkt */
  prefiks: 'NB' | 'NS';
  nazwa: string;
  /** krótka nazwa do maili i przycisków */
  krotko: string;
  /** nazwa pozycji na fakturze */
  pozycja: string;
  cenaGr: number;
  /** adres strony produktu */
  sciezka: string;
  /** zmienna Vercela z adresem pliku ZIP */
  plikEnv: 'PAKIET_URL' | 'PAKIET_SZKODA_URL';
  nazwaPliku: string;
  /** zmienna Vercela z adresem prywatnych danych narzędzia (kalkulator / Sprawdzacz) */
  daneEnv: 'NIEZBEDNIK_DANE_URL' | 'SZKODA_DANE_URL';
  narzedzie: { nazwa: string; sciezka: string; api: string; ciastko: string };
  tematMaila: string;
}

export const PRODUKTY: Record<IdProduktu, Produkt> = {
  niezbednik: {
    id: 'niezbednik',
    prefiks: 'NB',
    nazwa: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego',
    krotko: 'Niezbędnik',
    pozycja: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego – pakiet plików do pobrania',
    // cenę można zmienić zmienną SKLEP_CENA_GR bez wdrażania kodu
    cenaGr: Number(process.env.SKLEP_CENA_GR) || 3900,
    sciezka: '/niezbednik/',
    plikEnv: 'PAKIET_URL',
    nazwaPliku: 'niezbednik-bezpiecznego-zakupu-auta.zip',
    daneEnv: 'NIEZBEDNIK_DANE_URL',
    narzedzie: { nazwa: 'Kalkulator Niezbędnika', sciezka: '/niezbednik/kalkulator/', api: '/api/niezbednik/', ciastko: 'nb_sesja' },
    tematMaila: 'Twój Niezbędnik – link do pobrania'
  },
  szkoda: {
    id: 'szkoda',
    prefiks: 'NS',
    nazwa: 'Niezbędnik po szkodzie – odszkodowanie z OC sprawcy',
    krotko: 'Niezbędnik po szkodzie',
    pozycja: 'Niezbędnik po szkodzie – pakiet plików do pobrania i dostęp do Sprawdzacza kosztorysu',
    cenaGr: Number(process.env.SZKODA_CENA_GR) || 5900,
    sciezka: '/po-szkodzie/',
    plikEnv: 'PAKIET_SZKODA_URL',
    nazwaPliku: 'niezbednik-po-szkodzie.zip',
    daneEnv: 'SZKODA_DANE_URL',
    narzedzie: { nazwa: 'Sprawdzacz kosztorysu', sciezka: '/po-szkodzie/sprawdzacz/', api: '/api/po-szkodzie/', ciastko: 'ns_sesja' },
    tematMaila: 'Niezbędnik po szkodzie – link do pobrania i Sprawdzacz'
  }
};

/** Przełączniki ustawiane ręcznie w data/sklep/produkty.json (np. sprzedaż po akceptacji prawnika) */
export const sprzedazWlaczona = (id: IdProduktu) => (ustawienia as Record<string, { sprzedaz?: boolean }>)[id]?.sprzedaz !== false;

export const produktZNumeru = (sessionId: string): Produkt | null => Object.values(PRODUKTY).find((p) => sessionId.startsWith(p.prefiks)) || null;
