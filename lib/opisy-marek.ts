import { OPISY_CHINSKIE } from '@/lib/opisy-marek-chinskie';
import { OPISY_DUZE } from '@/lib/opisy-marek-duze';
import { OPISY_DUZE_2 } from '@/lib/opisy-marek-duze-2';
// Ręcznie pisane opisy marek (SEO) pokazywane na /marki/[marka]/.
// Liczby z CEPiK strona dolicza sama – tutaj tylko treść, ceny z cenników i źródła.

export interface ModelWOfercie {
  nazwa: string;
  /** adres karty modelu w atlasie, jeśli istnieje */
  adres?: string;
  typ: string;
  naped: string;
  cena?: string;
}

export interface OpisMarki {
  seoTytul: string;
  seoOpis: string;
  h1: string;
  /** krótki lead pod nagłówkiem */
  lead: string;
  zdjecie?: { src: string; alt: string; podpis: string; szer: number; wys: number };
  /** sekcje: nagłówek H2 + akapity (prosty tekst) */
  sekcje: { h2: string; akapity: string[]; lista?: string[] }[];
  oferta?: {
    h2: string;
    wstep: string;
    modele: ModelWOfercie[];
    uwaga: string;
    /** nagłówki kolumn tabeli (domyślnie: Model, Rodzaj auta, Silnik i skrzynia, Cena) */
    kolumny?: [string, string, string, string];
  };
  /** silniki polecane / z zastrzeżeniami / do omijania (dla marek z dużym rynkiem używanych) */
  silniki?: { wstep: string; lista: { nazwa: string; ocena: 'polecany' | 'warunkowo' | 'omijaj'; opis: string }[] };
  plusy?: string[];
  minusy?: string[];
  faq: { q: string; a: string }[];
  zrodla: { nazwa: string; url: string }[];
  /** data sprawdzenia cen i faktów (RRRR-MM-DD) */
  sprawdzono: string;
}

const OPISY: Record<string, OpisMarki> = {
  jac: {
    seoTytul: 'JAC w Polsce – modele, ceny, gwarancja, dealerzy',
    seoOpis:
      'JAC w Polsce: SUV-y JS6 i JS8, liftback J7 oraz pickupy T8 Pro i T9. Ceny od 89 900 zł, 5 lat gwarancji, dealerzy i liczba aut zarejestrowanych w CEPiK.',
    h1: 'JAC w Polsce – modele, ceny, gwarancja i opinie',
    lead:
      'JAC to jedna z najstarszych chińskich marek motoryzacyjnych, a w Polsce – jedna z najmłodszych. Auta osobowe JAC są oficjalnie sprzedawane u nas dopiero od 2025 roku, a w CEPiK jest ich już ponad tysiąc. Sprawdziliśmy, co jest w ofercie, ile kosztuje, jak wygląda gwarancja i na co uważać przed zakupem.',
    zdjecie: {
      src: '/marki-zdjecia/jac-hunter.webp',
      alt: 'Pickup JAC nowej generacji (Hunter) w kolorze srebrnym, widok z przodu',
      podpis: 'Pickup JAC nowej generacji (Hunter) na targach w Chinach. W Polsce w ofercie jest pickup JAC T9 – wersje na rynek europejski mogą się różnić.',
      szer: 1056,
      wys: 662
    },
    sekcje: [
      {
        h2: 'Skąd pochodzi JAC – historia marki',
        akapity: [
          'JAC (Jianghuai Automobile) to chiński producent z miasta Hefei we wschodnich Chinach. Firma działa od 1964 roku, a pierwszą ciężarówkę zbudowała w 1968 roku. Przez dziesięciolecia kojarzono ją głównie z samochodami dostawczymi i ciężarowymi – osobówki doszły znacznie później.',
          'Dziś JAC ma kilkanaście fabryk (ok. 19), własne centrum projektowe we Włoszech i sprzedaje auta na ponad 100 rynkach. W 2024 roku marka sprzedała ok. 400 tys. samochodów. To nie jest więc „nowa” firma – nowa jest tylko jej obecność w polskich salonach.'
        ]
      },
      {
        h2: 'JAC w Polsce – kto sprzedaje i od kiedy',
        akapity: [
          'Samochody osobowe JAC zadebiutowały w Polsce w kwietniu 2025 roku na Poznań Motor Show. Oficjalnym importerem jest firma GB Distribution z Poznania. Na stronie jacpolska.pl znajduje się lista ok. 25 punktów dealerskich w całym kraju.',
          'Według danych CEPiK w atlasie MotoRaport najwięcej zarejestrowanych aut JAC to SUV JS8, następnie liftback J7 i mniejszy SUV JS6. Prawie wszystkie to auta nowe, z roczników 2025–2026 – rynek używanych JAC dopiero się tworzy.'
        ]
      },
      {
        h2: 'Gwarancja JAC',
        akapity: [
          'Na nowe osobowe JAC importer daje 5 lat gwarancji lub 150 000 km (co nastąpi pierwsze). Do tego dochodzi 3 lata gwarancji na lakier (100 tys. km), 10 lat na perforację nadwozia i 3 lata assistance.',
          'To więcej niż standard wielu marek europejskich (zwykle 2 lata). Warunek jest typowy: przeglądy w autoryzowanym serwisie według planu producenta. Przy zakupie warto zapytać dealera o to, gdzie jest najbliższy serwis – sieć jest jeszcze mniejsza niż u marek obecnych w Polsce od lat.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele JAC w Polsce i ceny',
      wstep:
        'Oferta JAC w Polsce to dwa SUV-y, rodzinny liftback i auta użytkowe. Poniżej ceny „od” z oficjalnego cennika importera – najczęściej promocyjne, niższe od katalogowych.',
      modele: [
        { nazwa: 'JAC J7 Plus', adres: '/marki/jac/j7/', typ: 'Liftback (4,78 m, bagażnik 540 l)', naped: '1.5 turbo 150 KM, automat CVT', cena: 'od 89 900 zł brutto (katalog 94 900 zł)' },
        { nazwa: 'JAC JS6', adres: '/marki/jac/js6/', typ: 'SUV kompaktowy', naped: '1.5 turbo 174 KM, automat dwusprzęgłowy', cena: 'od 99 900 zł brutto (katalog 119 900 zł)' },
        { nazwa: 'JAC JS8 Pro', adres: '/marki/jac/js8/', typ: 'Duży SUV, 6 lub 7 miejsc (4,83 m)', naped: '1.5 turbo 175 KM', cena: 'od 119 900 zł brutto (katalog od 137 900 zł)' },
        { nazwa: 'JAC T8 Pro', typ: 'Pickup', naped: '2.0 turbodiesel, 4x4, manual', cena: 'od 99 900 zł netto' },
        { nazwa: 'JAC T9', typ: 'Pickup', naped: '2.0 turbodiesel 163 KM, automat 8-biegowy', cena: 'od 129 900 zł netto' },
        { nazwa: 'JAC X200', typ: 'Podwozie pod zabudowę (ładowność ok. 1,7 t)', naped: '2.0 diesel 129 KM, manual 6-biegowy', cena: 'od 79 900 zł netto' }
      ],
      uwaga:
        'Ceny zmieniają się często (promocje, rocznik). Przed wizytą w salonie sprawdź aktualny cennik na jacpolska.pl. Auta użytkowe są podawane w cenach netto – do ceny dolicz 23% VAT, jeśli kupujesz prywatnie.'
    },
    plusy: [
      'Niska cena jak na wielkość auta – 7-osobowy SUV JS8 kosztuje tyle, co mniejsze kompakty innych marek.',
      '5 lat gwarancji (150 tys. km) w standardzie.',
      'Benzynowe silniki turbo z automatem już w podstawowych wersjach.',
      'Producent z ponad 60-letnim doświadczeniem, a nie start-up.'
    ],
    minusy: [
      'Marka jest w Polsce od 2025 roku – nie ma jeszcze danych o trwałości po latach ani o awaryjności w naszych warunkach.',
      'Trudno przewidzieć, ile auto straci na wartości przy odsprzedaży.',
      'Mniejsza sieć dealerów i serwisów (ok. 25 punktów) niż u marek obecnych od lat.',
      'Dostępność części i czas naprawy po stłuczce – warto zapytać o to dealera przed zakupem.'
    ],
    faq: [
      {
        q: 'Czy JAC to chińska marka?',
        a: 'Tak. JAC (Jianghuai Automobile) to chiński producent z siedzibą w Hefei. Działa od 1964 roku i sprzedaje auta na ponad 100 rynkach.'
      },
      {
        q: 'Ile kosztuje JAC w Polsce?',
        a: 'Najtańsze osobowe JAC to liftback J7 Plus od 89 900 zł brutto. SUV JS6 kosztuje od 99 900 zł, a 7-osobowy JS8 Pro od 119 900 zł (ceny promocyjne z cennika importera). Pickupy T8 Pro i T9 kosztują od 99 900 i 129 900 zł netto.'
      },
      {
        q: 'Jaką gwarancję ma JAC?',
        a: '5 lat lub 150 000 km na auto, 3 lata na lakier, 10 lat na perforację nadwozia i 3 lata assistance. Warunkiem są przeglądy w autoryzowanym serwisie.'
      },
      {
        q: 'Kto jest importerem JAC w Polsce i gdzie kupić to auto?',
        a: 'Importerem jest GB Distribution z Poznania. Auta sprzedaje ok. 25 dealerów w całej Polsce – aktualna lista jest na stronie jacpolska.pl.'
      },
      {
        q: 'Ile aut JAC jeździ w Polsce?',
        a: 'Aktualną liczbę zarejestrowanych aut JAC według CEPiK pokazujemy na górze tej strony. Najwięcej jest SUV-ów JS8, potem J7 i JS6.'
      },
      {
        q: 'Czy warto kupić JAC?',
        a: 'Jeśli liczysz na dużo auta za rozsądne pieniądze i długą gwarancję – JAC jest wart jazdy próbnej. Ryzyko to krótka historia marki w Polsce: nie wiadomo jeszcze, jak auta zniosą lata eksploatacji i ile stracą na wartości. Przed zakupem porównaj koszt OC i sprawdź, gdzie jest najbliższy serwis.'
      }
    ],
    zrodla: [
      { nazwa: 'JAC Polska – oficjalna strona importera (ceny, modele, dealerzy)', url: 'https://jacpolska.pl/' },
      { nazwa: 'JAC Polska – cennik pickupa T9 (PDF)', url: 'https://asmb.jacpolska.pl/wp-content/uploads/sites/21/2025/04/T9_cennik.pdf' },
      { nazwa: 'Auto Świat – marka JAC debiutuje w Polsce', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/marka-jac-debiutuje-w-polsce-nowe-samochody-mozna-kupic-za-94-900-zl/kzetcfe' },
      { nazwa: 'Chip.pl – JAC Motors: modele, ceny, specyfikacja', url: 'https://www.chip.pl/2025/04/jac-motors-modele-ceny-specyfikacja-poznan-motor-show' },
      { nazwa: 'Interia – JAC debiutuje w Polsce', url: 'https://motoryzacja.interia.pl/wiadomosci/premiery/news-jac-debiutuje-w-polsce-trzy-modele-spalinowe-i-ceny-ponizej,nId,21397537' },
      { nazwa: 'Otomoto News – JAC T8 Pro wchodzi do Polski', url: 'https://www.otomoto.pl/news/jac-t8-pro-wchodzi-do-polski-oml' },
      { nazwa: 'AutoCentrum – gwarancja na chińskie samochody i sieć serwisowa', url: 'https://www.autocentrum.pl/publikacje/zakup-i-sprzedaz/gwarancja-na-chinskie-samochody-i-siec-serwisowa-jak-jest-naprawde/' }
    ],
    sprawdzono: '2026-11-15'
  }
};

export function opisMarki(slug: string): OpisMarki | null {
  return OPISY[slug] ?? OPISY_CHINSKIE[slug] ?? OPISY_DUZE[slug] ?? OPISY_DUZE_2[slug] ?? null;
}
