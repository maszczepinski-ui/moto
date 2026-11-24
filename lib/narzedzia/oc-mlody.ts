// „OC dla młodego kierowcy” – dane z raportów porównywarek (2026) i sposoby na niższą składkę.
// Liczby to średnie i mediany z publikacji rankomat.pl i mubi.pl – nie są wyceną dla konkretnej osoby.

export const STAN_OC = 'listopad 2026';

export const DANE_OC = {
  sredniaWszyscyRankomat: 621, // VII 2026
  sredniaWszyscyMubi: 825, // VI 2026
  mlodzi1825Rankomat: 1633, // VII 2026
  mlodzi1825Mubi: 1554, // VI 2026
  osiemnastolatekH1: 2826, // I połowa 2026, rankomat
  najtanszeDla18: 419, // I połowa 2026, rankomat
  pojemnosc11do20: 1792, // mediana 18–25 lat, I–V 2026
  pojemnoscPowyzej20: 1900,
  przebieg201do250: 1823,
  przebiegPowyzej250: 1957,
  wiek54do59: 541
};

export const PRZYKLADY_MODELI = [
  { model: 'Volkswagen Golf', osiemnascie: 2584, czterdziesci5: 628 },
  { model: 'Opel Astra', osiemnascie: 2711, czterdziesci5: 606 },
  { model: 'BMW serii 3', osiemnascie: 2979, czterdziesci5: 637 }
];

export interface Sposob {
  id: string;
  nazwa: string;
  wplyw: 'duzy' | 'sredni' | 'maly';
  opis: string;
  uwaga?: string;
}

export const SPOSOBY: Sposob[] = [
  { id: 'porownaj', nazwa: 'Porównaj oferty kilku ubezpieczycieli', wplyw: 'duzy', opis: 'Różnice dla młodego kierowcy bywają kilkukrotne: średnia dla 18-latków w I połowie 2026 r. to 2826 zł, a najtańsza znaleziona polisa – 419 zł.' },
  { id: 'wspolwlasciciel', nazwa: 'Współwłaściciel z dobrą historią (np. rodzic)', wplyw: 'duzy', opis: 'Wiele towarzystw liczy składkę według współwłaściciela z najlepszymi zniżkami. To najczęściej stosowany sposób na niższe OC.', uwaga: 'Szkoda spowodowana przez młodego kierowcę obniży zniżki także współwłaściciela. Część ubezpieczycieli dolicza zwyżkę za młodego współwłaściciela – sprawdź warunki.' },
  { id: 'pojemnosc', nazwa: 'Auto z mniejszym silnikiem', wplyw: 'sredni', opis: 'Mediana dla kierowców 18–25 lat: 1792 zł przy pojemności 1,1–2,0 l i 1900 zł powyżej 2,0 l. Sportowe i mocne auta są najdroższe.' },
  { id: 'miejsce', nazwa: 'Miejsce zamieszkania i parkowania', wplyw: 'duzy', opis: 'W dużych miastach OC jest wyraźnie droższe niż na wsi i w małych miejscowościach. Podawaj prawdziwy adres – zaniżenie może skończyć się regresem po szkodzie.' },
  { id: 'wczesniej', nazwa: 'Zbieraj zniżki wcześniej', wplyw: 'sredni', opis: 'Współwłaścicielem auta można zostać przed 18. urodzinami – historia ubezpieczeniowa zaczyna się wtedy wcześniej.' },
  { id: 'zwyzki', nazwa: 'Unikaj zwyżek', wplyw: 'sredni', opis: 'Szkoda z Twojej winy, mandaty i punkty karne mogą podnieść składkę w kolejnych latach. Drobną szkodę czasem opłaca się pokryć samemu.' },
  { id: 'przebieg', nazwa: 'Auto z mniejszym przebiegiem', wplyw: 'maly', opis: 'Mediana dla młodych kierowców: 1823 zł przy przebiegu 201–250 tys. km i 1957 zł powyżej 250 tys. km.' }
];
