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
  | 'bell';

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
      nazwa: 'Kupno i OC',
      pozycje: [
        { nazwa: 'Asystent zakupu', opis: 'Usterki, oględziny, formalności', adres: '/asystent-zakupu/', ikona: 'clipboard' },
        { nazwa: 'Sprawdź VIN', opis: 'Przebieg, szkody, historia auta', adres: '/sprawdz-vin/', ikona: 'scan' },
        { nazwa: 'Przypomnienie o OC', opis: 'E-mail przed końcem polisy i przeglądu', adres: '/przypomnienia/', ikona: 'bell', nowe: true },
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
