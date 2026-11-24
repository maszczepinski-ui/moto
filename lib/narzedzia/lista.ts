// Lista kalkulatorów i narzędzi z działu /kalkulatory/.
// Jedno miejsce dla: strony zbiorczej, „Zobacz też” pod każdym narzędziem, menu i mapy strony.
// NOWE NARZĘDZIE: dopisz je tutaj (adres musi zgadzać się z folderem w app/(pl)/).

export type KategoriaNarzedzia = 'zakup' | 'koszty' | 'szkoda' | 'sprzedaz' | 'opony';

export interface Narzedzie {
  id: string;
  adres: string;
  nazwa: string;
  /** jedno zdanie do kafelka */
  krotko: string;
  kategoria: KategoriaNarzedzia;
}

export const KATEGORIE_NARZEDZI: Record<KategoriaNarzedzia, string> = {
  zakup: 'Kupujesz auto',
  koszty: 'Koszty utrzymania',
  szkoda: 'Szkoda i reklamacja',
  sprzedaz: 'Sprzedajesz auto',
  opony: 'Koła i opony'
};

export const NARZEDZIA: Narzedzie[] = [
  { id: 'przebieg', adres: '/sprawdz-przebieg/', nazwa: 'Czy przebieg jest prawdziwy?', krotko: 'Porównaj przebieg z ogłoszenia z typowym dla wieku auta.', kategoria: 'zakup' },
  { id: 'slownik', adres: '/slownik-ogloszen/', nazwa: 'Słownik i detektor ogłoszeń', krotko: 'Wklej ogłoszenie – podświetlimy zwroty, które warto sprawdzić.', kategoria: 'zakup' },
  { id: 'negocjacje', adres: '/ile-zbic-cene-auta/', nazwa: 'Ile zbić z ceny auta?', krotko: 'Zaznacz usterki z oględzin – policzymy koszt i propozycję obniżki.', kategoria: 'zakup' },
  { id: 'formalnosci', adres: '/formalnosci-po-zakupie-auta/', nazwa: 'Terminarz po zakupie auta', krotko: 'PCC-3, rejestracja, OC – daty i kary w jednym planie.', kategoria: 'zakup' },
  { id: 'sprowadzenie', adres: '/koszt-sprowadzenia-auta/', nazwa: 'Koszt sprowadzenia auta', krotko: 'Transport, akcyza, tłumaczenia i rejestracja – suma pod dom.', kategoria: 'zakup' },
  { id: 'firma', adres: '/auto-w-firmie/', nazwa: 'Auto w firmie: limit 100 tys. zł', krotko: 'Ile VAT i podatku odzyskasz i ile przepada przez limit.', kategoria: 'koszty' },
  { id: 'kalendarz', adres: '/kalendarz-napraw/', nazwa: 'Kalendarz drogich napraw', krotko: 'Co zwykle czeka auto przy kolejnych przebiegach i ile to kosztuje.', kategoria: 'koszty' },
  { id: 'lpg', adres: '/oplacalnosc-lpg/', nazwa: 'Czy LPG się opłaca?', krotko: 'Po ilu kilometrach zwróci się instalacja gazowa.', kategoria: 'koszty' },
  { id: 'ev', adres: '/koszt-ladowania-elektryka/', nazwa: 'Koszt ładowania elektryka', krotko: 'Ile kosztuje 100 km w domu i na stacjach w porównaniu z benzyną.', kategoria: 'koszty' },
  { id: 'oc-mlody', adres: '/oc-dla-mlodego-kierowcy/', nazwa: 'OC dla młodego kierowcy', krotko: 'Co podnosi cenę OC i jak legalnie ją obniżyć.', kategoria: 'koszty' },
  { id: 'szkoda', adres: '/szkoda-calkowita-kalkulator/', nazwa: 'Szkoda całkowita i auto zastępcze', krotko: 'Ile powinieneś dostać i ile dni auta zastępczego się należy.', kategoria: 'szkoda' },
  { id: 'wada', adres: '/wada-ukryta-auta/', nazwa: 'Wada ukryta – terminy', krotko: 'Czy możesz jeszcze reklamować auto i co zrobić najpierw.', kategoria: 'szkoda' },
  { id: 'gdzie-sprzedac', adres: '/gdzie-sprzedac-auto/', nazwa: 'Gdzie sprzedać auto?', krotko: 'Sam, komis czy skup – ile zostanie Ci na rękę i jak szybko.', kategoria: 'sprzedaz' },
  { id: 'kiedy-sprzedac', adres: '/kiedy-sprzedac-auto/', nazwa: 'Kiedy sprzedać auto?', krotko: 'Sygnały: zbliżające się naprawy, strefy czystego transportu, przebieg.', kategoria: 'sprzedaz' },
  { id: 'felgi', adres: '/kalkulator-felg/', nazwa: 'Kalkulator felg i ET', krotko: 'Czy nowe felgi i opony zmieszczą się w nadkolu – z rysunkiem.', kategoria: 'opony' },
  { id: 'zamienniki', adres: '/zamiennik-opon/', nazwa: 'Zamienniki rozmiaru opon', krotko: 'Jakie inne rozmiary mają prawie tę samą średnicę koła.', kategoria: 'opony' }
];

export function narzedzie(id: string): Narzedzie {
  const n = NARZEDZIA.find((x) => x.id === id);
  if (!n) throw new Error(`Brak narzędzia ${id}`);
  return n;
}

/** Złote w polskim formacie, bez groszy: 12 345 zł */
export const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;
/** Liczba w polskim formacie */
export const liczba = (n: number, miejsc = 0) => n.toLocaleString('pl-PL', { minimumFractionDigits: miejsc, maximumFractionDigits: miejsc });
