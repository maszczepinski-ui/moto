// Struktura menu strony – jedno miejsce dla nawigacji u góry, menu na telefonie, stopki i kafelków na stronie głównej.
import { opublikowane } from '@/lib/wpisy';
import { rankingiZProduktami } from '@/lib/produkty';

export type Ikona =
  | 'car'
  | 'trophy'
  | 'map'
  | 'trending'
  | 'swords'
  | 'alert'
  | 'clipboard'
  | 'scan'
  | 'shopping'
  | 'route'
  | 'camera'
  | 'gauge'
  | 'plug'
  | 'film'
  | 'info'
  | 'bell'
  | 'opony'
  | 'dokument'
  | 'kolizja'
  | 'ranni'
  | 'ucieczka'
  | 'zwierze'
  | 'kluczyk'
  | 'sprzedaz'
  | 'tarcza'
  | 'korytarz'
  | 'odstep'
  | 'fotelik'
  | 'awaria'
  | 'mgla';

export interface PozycjaMenu {
  nazwa: string;
  opis: string;
  adres: string;
  ikona: Ikona;
  nowe?: boolean;
}

export interface GrupaMenu {
  id: string;
  nazwa: string;
  pozycje: PozycjaMenu[];
}

export function menuGlowne(): GrupaMenu[] {
  const filmy = opublikowane().length > 0;
  const polecane = rankingiZProduktami().length > 0;
  return [
    {
      id: 'atlas',
      nazwa: 'Atlas aut',
      pozycje: [
        { nazwa: 'Marki i modele', opis: 'Ile jeździ w Polsce, roczniki, silniki', adres: '/marki/', ikona: 'car' },
        { nazwa: 'Rankingi', opis: 'Najpopularniejsze auta w Polsce', adres: '/rankingi/', ikona: 'trophy' },
        { nazwa: 'Województwa', opis: 'Co jeździ w Twojej okolicy', adres: '/wojewodztwa/', ikona: 'map' },
        { nazwa: 'Rynek nowych aut', opis: 'Co Polacy kupują w salonach', adres: '/rynek/', ikona: 'trending' },
        { nazwa: 'Porównaj modele', opis: 'Dwa auta obok siebie', adres: '/porownaj/', ikona: 'swords' },
        { nazwa: 'Kody błędów OBD', opis: 'Co znaczy kontrolka i kod P0…', adres: '/kody-bledow/', ikona: 'alert' }
      ]
    },
    {
      id: 'kupujesz',
      nazwa: 'Kupno i utrzymanie',
      pozycje: [
        { nazwa: 'Asystent zakupu', opis: 'Usterki, oględziny, formalności', adres: '/asystent-zakupu/', ikona: 'clipboard' },
        { nazwa: 'Sprawdź VIN', opis: 'Przebieg, szkody, historia auta', adres: '/sprawdz-vin/', ikona: 'scan' },
        { nazwa: 'Opony', opis: 'Kiedy wymienić, bieżnik, wiek opony', adres: '/opony/', ikona: 'opony', nowe: true },
        { nazwa: 'Przypomnienie o OC i oponach', opis: 'E-mail przed końcem polisy, przeglądu i sezonem', adres: '/przypomnienia/', ikona: 'bell', nowe: true },
        ...(polecane ? [{ nazwa: 'Polecane produkty', opis: 'Sprawdzone akcesoria i chemia', adres: '/polecane/', ikona: 'shopping' as const }] : [])
      ]
    },
    {
      id: 'trasa',
      nazwa: 'W trasie',
      pozycje: [
        { nazwa: 'Koszt przejazdu', opis: 'Ile za paliwo na trasie', adres: '/koszt-trasy/', ikona: 'route', nowe: true },
        { nazwa: 'Mapa ładowarek', opis: 'Ładowarki do aut elektrycznych', adres: '/ladowarki/', ikona: 'plug', nowe: true },
        { nazwa: 'Fotoradary i odcinkowe pomiary', opis: 'Mapa urządzeń w okolicy', adres: '/fotoradary/', ikona: 'camera', nowe: true },
        { nazwa: 'Mandaty i punkty karne', opis: 'Kalkulator mandatu i punktów', adres: '/mandaty/', ikona: 'gauge', nowe: true }
      ]
    },
    {
      id: 'poradniki',
      nazwa: 'Poradniki',
      pozycje: [
        { nazwa: 'Umowa kupna-sprzedaży', opis: 'Wzór do wypełnienia i wydruku', adres: '/poradniki/umowa-kupna-sprzedazy-samochodu/', ikona: 'dokument', nowe: true },
        { nazwa: 'Kolizja – co zrobić', opis: 'Bez policji? Oświadczenie sprawcy', adres: '/poradniki/kolizja-bez-policji/', ikona: 'kolizja', nowe: true },
        { nazwa: 'Kupiłem auto', opis: 'PCC, rejestracja, OC – terminy i kary', adres: '/poradniki/kupilem-auto-co-dalej/', ikona: 'kluczyk' },
        { nazwa: 'Wypadek z rannymi', opis: 'Obowiązki kierowcy, 112, pierwsza pomoc', adres: '/poradniki/wypadek-z-rannymi/', ikona: 'ranni' },
        { nazwa: 'Sprzedałem auto', opis: 'Zgłoszenie zbycia i powiadomienie OC', adres: '/poradniki/sprzedalem-auto-co-dalej/', ikona: 'sprzedaz' },
        { nazwa: 'Sprawca uciekł lub bez OC', opis: 'Odszkodowanie z UFG', adres: '/poradniki/sprawca-uciekl-brak-oc/', ikona: 'ucieczka' },
        { nazwa: 'Wypowiedzenie OC', opis: 'Kiedy można i wzór pisma', adres: '/poradniki/wypowiedzenie-oc/', ikona: 'tarcza' },
        { nazwa: 'Zderzenie ze zwierzęciem', opis: 'Co zrobić i kto zapłaci', adres: '/poradniki/zderzenie-ze-zwierzeciem/', ikona: 'zwierze' }
      ]
    },
    {
      id: 'bezpieczenstwo',
      nazwa: 'Bezpieczeństwo',
      pozycje: [
        { nazwa: 'Awaria na autostradzie', opis: 'Gdzie stanąć, trójkąt, numer 19 111', adres: '/poradniki/awaria-na-autostradzie/', ikona: 'awaria', nowe: true },
        { nazwa: 'Korytarz życia i suwak', opis: 'Który pas w lewo, który w prawo', adres: '/poradniki/korytarz-zycia-jazda-na-suwak/', ikona: 'korytarz' },
        { nazwa: 'Jazda we mgle', opis: 'Jakie światła i kiedy tylne przeciwmgłowe', adres: '/poradniki/jazda-we-mgle/', ikona: 'mgla' },
        { nazwa: 'Odstęp na autostradzie', opis: 'Zasada „pół licznika”', adres: '/poradniki/odstep-na-autostradzie/', ikona: 'odstep' },
        { nazwa: 'Foteliki dla dzieci', opis: 'Do jakiego wzrostu, wyjątki, kary', adres: '/poradniki/fotelik-dla-dziecka-przepisy/', ikona: 'fotelik' }
      ]
    },
    ...(filmy
      ? [
          {
            id: 'motoformat',
            nazwa: 'Filmy',
            pozycje: [
              { nazwa: 'Filmy z artykułami', opis: 'Testy i porady z kanału', adres: '/filmy/', ikona: 'film' as const },
              { nazwa: 'Skąd są dane?', opis: 'Jak liczymy i skąd bierzemy dane', adres: '/metodologia/', ikona: 'info' as const }
            ]
          }
        ]
      : [])
  ];
}
