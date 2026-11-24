// Treść stron kalkulatora felg i zamienników opon
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

export const SEKCJE_FELGI: Sekcja[] = [
  {
    h2: 'Co oznaczają J, ET, PCD i otwór centralny',
    lista: [
      'J – szerokość felgi w calach, np. 7J to ok. 178 mm między rantami. Szersza felga trochę poszerza oponę i usztywnia jej bok.',
      'ET (odsadzenie) – odległość w milimetrach od środka felgi do miejsca, którym felga przylega do piasty. Im mniejsze ET, tym bardziej koło wysuwa się na zewnątrz. Zmiana ET o 10 mm przesuwa całe koło o 10 mm.',
      'PCD (rozstaw śrub) – liczba śrub i średnica okręgu, na którym leżą, np. 5×112. Musi się zgadzać co do milimetra.',
      'Otwór centralny – średnica otworu w środku felgi. Jeśli jest większy niż w piaście, stosuje się pierścienie centrujące.',
      'Indeks nośności i prędkości opony – nie mogą być niższe niż w dowodzie rejestracyjnym lub instrukcji auta.'
    ]
  },
  {
    h2: 'Jak zmiana felgi i opony przesuwa koło',
    akapity: [
      'Kalkulator liczy dwie rzeczy osobno. Zewnętrzna krawędź opony decyduje o tym, czy koło nie będzie wystawać poza błotnik i ocierać o rant nadkola. Wewnętrzna krawędź – czy opona nie zbliży się za bardzo do amortyzatora, sprężyny i wahacza. Szersza opona przy tym samym ET wysuwa się po połowie w obie strony; mniejsze ET przesuwa całe koło na zewnątrz.',
      'Do tego dochodzi średnica koła. Większe koło zmniejsza luz nad oponą (może ocierać przy ugięciu zawieszenia) i zmienia odczyt prędkościomierza. W praktyce warsztatowej przyjmuje się, że różnica średnicy nie powinna przekraczać ok. 2–3%.'
    ],
    tabela: [
      ['Zmiana', 'Zewnętrzna krawędź opony', 'Wewnętrzna krawędź opony'],
      ['ET mniejsze o 10 mm', '10 mm na zewnątrz', '10 mm dalej od zawieszenia'],
      ['ET większe o 10 mm', '10 mm do środka', '10 mm bliżej zawieszenia'],
      ['Opona szersza o 20 mm (to samo ET)', 'ok. 10 mm na zewnątrz', 'ok. 10 mm bliżej zawieszenia'],
      ['Felga szersza o 1 cal (to samo ET)', 'rant felgi 12,7 mm na zewnątrz', 'rant felgi 12,7 mm do środka']
    ]
  },
  {
    h2: 'Czy można założyć inne felgi i opony niż fabryczne?',
    akapity: [
      'Można, jeśli koła pasują do auta: zgadza się rozstaw śrub i otwór centralny, opona ma odpowiedni indeks nośności i prędkości, a koło nie ociera i nie wystaje poza nadwozie. Na badaniu technicznym diagnosta sprawdza stan i dopasowanie kół – opona wystająca poza błotnik albo ocierająca o nadkole to problem.',
      'Najbezpieczniej wybierać rozmiary z listy producenta auta (instrukcja, naklejka na słupku drzwi lub klapce wlewu paliwa). Przy rozmiarach spoza listy przymierz koło przed zakupem kompletu.'
    ]
  }
];

export const PYTANIA_FELGI: Pytanie[] = [
  { q: 'Co to jest ET felgi?', a: 'ET (odsadzenie) to odległość w milimetrach między środkiem felgi a powierzchnią, którą felga przylega do piasty. Mniejsze ET wysuwa koło na zewnątrz, większe chowa je głębiej w nadkole.' },
  { q: 'O ile można zmienić ET?', a: 'Nie ma jednej granicy – zależy od luzu w konkretnym aucie. Zmiana o kilka milimetrów zwykle nie robi różnicy, przy kilkunastu warto sprawdzić luz przy błotniku i zawieszeniu.' },
  { q: 'Jaka różnica średnicy koła jest dopuszczalna?', a: 'W praktyce przyjmuje się do ok. 2–3%. Większa zmienia odczyt prędkościomierza i może wpływać na działanie ABS i ESP.' },
  { q: 'Czy szersza felga zmienia szerokość opony?', a: 'Tak, nieznacznie. Ta sama opona na szerszej feldze jest kilka milimetrów szersza i ma bardziej wyprostowany bok.' }
];

export const ZRODLA_FELGI: Zrodlo[] = [
  { n: 'ETRTO – European Tyre and Rim Technical Organisation', url: 'https://www.etrto.org/' }
];
