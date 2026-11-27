import type { StronaProduktu } from '../typy';

// Boostery (urządzenia rozruchowe) – dane techniczne wg producentów, sprawdzone 27.11.2026 (źródła na dole strony).
export const BOOSTER: StronaProduktu = {
  slug: 'booster',
  dzial: 'zimowe',
  idWDziale: 'booster',
  nazwa: 'Boostery do auta',
  seoTytul: 'Booster do auta – porównanie modeli',
  seoOpis: 'Porównanie boosterów (jump starterów) NOCO, Osram i Yato: prąd, do jakich silników benzynowych i diesli, dodatki. Jak wybrać booster do swojego auta.',
  tytul: 'Booster do auta – porównanie modeli',
  opis: 'Przenośne urządzenia rozruchowe, które odpalą auto bez drugiego samochodu. Porównaj, do jakich silników nadaje się każdy model.',
  aktualizacja: '2026-11-27',
  wstep: [
    'Booster (jump starter) to akumulator litowy z krótkimi kablami i zaciskami. Podłączasz go do akumulatora auta, włączasz i odpalasz silnik – bez szukania drugiego samochodu i kabli rozruchowych.',
    'Najważniejsze przy wyborze jest to, do jakiej pojemności silnika producent przeznacza dany model. Diesel potrzebuje więcej mocy niż benzyniak o tej samej pojemności, dlatego w tabeli podajemy obie wartości osobno.'
  ],
  kolumny: [
    { klucz: 'prad', nazwa: 'Prąd wg producenta' },
    { klucz: 'benzyna', nazwa: 'Benzyna do' },
    { klucz: 'diesel', nazwa: 'Diesel do' },
    { klucz: 'dodatki', nazwa: 'Dodatki' }
  ],
  modele: [
    {
      id: 'booster-noco-gb40',
      marka: 'NOCO',
      model: 'Boost Plus GB40',
      dane: { prad: '1000 A (szczytowy)', benzyna: '6,0 l', diesel: '3,0 l', dodatki: 'latarka LED, ładowanie telefonu przez USB, obudowa IP65' },
      dlaKogo: 'Auta osobowe z silnikiem benzynowym i mniejsze diesle.',
      szukaj: 'NOCO GB40'
    },
    {
      id: 'booster-noco-gbx55',
      marka: 'NOCO',
      model: 'Boost X GBX55',
      dane: { prad: '1750 A (szczytowy)', benzyna: '7,5 l', diesel: '5,0 l', dodatki: 'port USB-C 60 W (power bank), latarka 200 lm, IP65' },
      dlaKogo: 'Większe auta, SUV-y i diesle do 5 litrów.',
      szukaj: 'NOCO GBX55'
    },
    {
      id: 'booster-noco-gb70',
      marka: 'NOCO',
      model: 'Boost HD GB70',
      dane: { prad: '2000 A (szczytowy)', benzyna: '8,0 l', diesel: '6,0 l', dodatki: 'latarka, USB, wyjście 12 V do kompresora' },
      dlaKogo: 'Duże diesle, busy i kampery.',
      szukaj: 'NOCO GB70'
    },
    {
      id: 'booster-osram-batterystart-400',
      marka: 'Osram',
      model: 'BATTERYstart 400 (OBSL400)',
      dane: { prad: '400 A (rozruchowy)', benzyna: '8 l', diesel: '4 l', dodatki: 'power bank 2× USB, latarka, gniazdo 12 V' },
      dlaKogo: 'Auta osobowe, SUV-y i dostawcze z dieslem do 4 litrów.',
      szukaj: 'Osram BATTERYstart 400'
    },
    {
      id: 'booster-yato-yt-83082',
      marka: 'Yato',
      model: 'YT-83082',
      dane: { prad: '300 A (rozruchowy), 500 A (szczytowy)', benzyna: 'brak danych', diesel: 'brak danych', dodatki: 'power bank 12 000 mAh, latarka z trybem SOS' },
      dlaKogo: 'Prosty booster z power bankiem – producent nie podaje maksymalnej pojemności silnika, więc sprawdź ją przed zakupem.',
      szukaj: 'Yato YT-83082'
    }
  ],
  jakWybrac: [
    { t: 'Sprawdź pojemność silnika', o: 'Producent podaje, do jakich silników benzynowych i diesla przeznaczony jest booster. Wybierz model z zapasem – zimą akumulator i silnik potrzebują więcej prądu.' },
    { t: 'Nie porównuj samych amperów', o: 'Jedni producenci podają prąd szczytowy, inni rozruchowy – to różne wartości. Bardziej wiarygodna jest deklarowana pojemność silnika.' },
    { t: 'Zabezpieczenia', o: 'Booster powinien chronić przed odwrotnym podłączeniem zacisków i zwarciem. To ważne zwłaszcza, gdy odpalasz auto po ciemku i w pośpiechu.' },
    { t: 'Ładuj regularnie', o: 'Booster leżący miesiącami w bagażniku też się rozładowuje. Sprawdzaj go przed zimą i co kilka miesięcy.' }
  ],
  pytania: [
    { q: 'Booster czy kable rozruchowe?', a: 'Kable są tanie, ale potrzebujesz drugiego auta. Booster odpala samochód bez pomocy innych, za to jest droższy i trzeba pamiętać o jego ładowaniu.' },
    { q: 'Jaki booster do diesla?', a: 'Wybierz model, dla którego producent podaje pojemność diesla równą lub większą niż w Twoim aucie. W naszym zestawieniu najwięcej dla diesli deklaruje NOCO GB70 (do 6,0 l).' },
    { q: 'Czy booster naładuje akumulator?', a: 'Nie – booster daje krótki, mocny impuls do rozruchu. Po odpaleniu akumulator ładuje alternator w czasie jazdy, a mocno rozładowany warto doładować prostownikiem.' },
    { q: 'Skąd pochodzą ceny?', a: 'Przycisk „Zobacz oferty na Ceneo” otwiera stronę produktu w porównywarce Ceneo, gdzie widzisz aktualne ceny wielu sklepów. To link partnerski – możemy dostać prowizję, ale nie zmienia to ceny dla Ciebie.' }
  ],
  zrodla: [
    { nazwa: 'NOCO GB40 – dane techniczne (Media Expert)', url: 'https://www.mediaexpert.pl/dom-i-ogrod/akcesoria-do-pojazdow/urzadzenia-rozruchowe/urzadzenie-rozruchowe-noco-gb40' },
    { nazwa: 'NOCO GBX55 – dane techniczne (Alza)', url: 'https://www.alza.cz/EN/auto/noco-boost-x-gbx55-d6885480.htm' },
    { nazwa: 'NOCO GB70 – dane techniczne (Halfords)', url: 'https://www.halfords.com/motoring/battery-maintenance/jump-starters/gb70-2000a-noco-jump-starter-721906.html' },
    { nazwa: 'Osram BATTERYstart 400 – karta produktu (Osram)', url: 'https://osram.com/ecat/BATTERYstart%20400-Lithium%20Starters-Battery%20care-Automotive/in/en/GPS01_3388042/ZMP_4062123' },
    { nazwa: 'Yato YT-83082 – dane techniczne (Komputronik)', url: 'https://www.komputronik.pl/product/941401/yato-yt-83082.html' }
  ]
};
