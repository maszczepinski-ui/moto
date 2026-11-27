import type { StronaProduktu } from '../typy';

// Prostowniki automatyczne – dane techniczne wg producentów, sprawdzone 27.11.2026 (źródła na dole strony).
export const PROSTOWNIK: StronaProduktu = {
  slug: 'prostownik',
  dzial: 'zimowe',
  idWDziale: 'prostownik',
  nazwa: 'Prostowniki automatyczne',
  seoTytul: 'Prostownik do akumulatora – porównanie',
  seoOpis: 'Porównanie prostowników automatycznych CTEK, NOCO i Bosch: prąd ładowania, do jakich akumulatorów (AGM, EFB, start-stop). Jak wybrać prostownik.',
  tytul: 'Prostownik do akumulatora – porównanie modeli',
  opis: 'Automatyczne prostowniki, które same kończą ładowanie i podtrzymują akumulator. Sprawdź, który pasuje do Twojego auta.',
  aktualizacja: '2026-11-27',
  wstep: [
    'Prostownik automatyczny doładowuje akumulator i pilnuje, żeby go nie przeładować. Przydaje się, gdy auto długo stoi, jeździsz głównie krótkie odcinki albo zimą akumulator ledwo kręci rozrusznikiem.',
    'Jeśli Twoje auto ma system start-stop, ma najpewniej akumulator AGM albo EFB. Wtedy wybierz prostownik, który ma do nich osobny tryb – w tabeli zaznaczamy to w kolumnie z typami akumulatorów.'
  ],
  kolumny: [
    { klucz: 'prad', nazwa: 'Prąd ładowania' },
    { klucz: 'napiecie', nazwa: 'Napięcie' },
    { klucz: 'pojemnosc', nazwa: 'Akumulatory (pojemność)' },
    { klucz: 'typy', nazwa: 'Typy akumulatorów' }
  ],
  modele: [
    {
      id: 'prostownik-ctek-mxs-5-0',
      marka: 'CTEK',
      model: 'MXS 5.0',
      dane: { prad: '0,8 A lub 5 A', napiecie: '12 V', pojemnosc: 'ładuje 1,2–110 Ah, podtrzymuje do 160 Ah', typy: 'kwasowe, AGM, EFB, żelowe; tryb regeneracji' },
      dlaKogo: 'Auta osobowe, także ze start-stop (AGM/EFB).',
      szukaj: 'CTEK MXS 5.0'
    },
    {
      id: 'prostownik-noco-genius5',
      marka: 'NOCO',
      model: 'GENIUS5',
      dane: { prad: '5 A', napiecie: '6 V i 12 V', pojemnosc: 'do 120 Ah', typy: 'kwasowe, AGM, EFB, żelowe, litowe (LiFePO4)' },
      dlaKogo: 'Auta, motocykle i akumulatory litowe; ładuje też mocno rozładowane.',
      szukaj: 'NOCO GENIUS5'
    },
    {
      id: 'prostownik-bosch-c3',
      marka: 'Bosch',
      model: 'C3',
      dane: { prad: '0,8 A lub 3,8 A', napiecie: '6 V i 12 V', pojemnosc: '12 V: 1,2–120 Ah', typy: 'kwasowe, AGM, żelowe; tryb zimowy' },
      dlaKogo: 'Auta osobowe i motocykle, ładowanie i podtrzymanie w garażu.',
      szukaj: 'Bosch C3 prostownik'
    }
  ],
  jakWybrac: [
    { t: 'Dopasuj prąd do akumulatora', o: 'Do typowego akumulatora samochodowego (40–80 Ah) wystarczy prostownik o prądzie ok. 4–5 A. Słabszy ładuje dłużej, ale też da radę.' },
    { t: 'AGM i EFB w autach ze start-stop', o: 'Takie akumulatory lubią właściwe napięcie ładowania. Wybierz prostownik z trybem AGM lub z wyraźną informacją, że obsługuje AGM/EFB.' },
    { t: 'Automatyka i podtrzymanie', o: 'Prostownik automatyczny sam kończy ładowanie i może zostać podłączony na dłużej – to wygodne, gdy auto stoi zimą w garażu.' },
    { t: 'Bezpieczeństwo', o: 'Zabezpieczenie przed odwrotnym podłączeniem i zwarciem to dziś standard – nie kupuj prostownika bez nich.' }
  ],
  pytania: [
    { q: 'Czy można ładować akumulator bez wyjmowania z auta?', a: 'Zwykle tak – nowoczesne prostowniki automatyczne są do tego przystosowane. Zawsze sprawdź jednak instrukcję auta i prostownika, zwłaszcza w autach ze start-stop.' },
    { q: 'Jak długo ładuje się akumulator?', a: 'To zależy od pojemności akumulatora, stopnia rozładowania i prądu prostownika – od kilku do kilkunastu godzin. Prostownik automatyczny sam pokaże, kiedy skończy.' },
    { q: 'Prostownik czy booster?', a: 'Prostownik doładowuje akumulator w domu lub garażu, booster służy do szybkiego odpalenia auta w trasie. Wiele osób ma oba – prostownik do dbania o akumulator, booster na wypadek awarii.' },
    { q: 'Skąd pochodzą ceny?', a: 'Przycisk „Zobacz oferty na Ceneo” otwiera stronę produktu w porównywarce Ceneo z aktualnymi cenami wielu sklepów. To link partnerski – możemy dostać prowizję, ale nie zmienia to ceny dla Ciebie.' }
  ],
  zrodla: [
    { nazwa: 'CTEK MXS 5.0 – specyfikacja (CTEK)', url: 'https://ctek.com/en-de/products/mxs-5-0-eu' },
    { nazwa: 'NOCO GENIUS5 – karta katalogowa (NOCO)', url: 'https://cdn.shopify.com/s/files/1/0645/4932/3005/files/noco-genius5-data-sheet.pdf' },
    { nazwa: 'NOCO GENIUS5 – opis (Halfords)', url: 'https://www.halfords.com/motoring/tools/garage-equipment/battery-chargers/noco-genius5-5-amp-battery-charger-230278.html' },
    { nazwa: 'Bosch C3 – instrukcja z danymi technicznymi (Conrad)', url: 'https://asset.conrad.com/media10/add/160267/c1/-/pl/000857452ML03/manual-857452-bosch-c3-0189999030-automatic-charger-6-v-12-v-08-a-38-a.pdf' },
    { nazwa: 'Bosch C3 – parametry (e-katalog)', url: 'https://e-katalog.pl/cmp/153240/c30-vs-c3/' }
  ]
};
