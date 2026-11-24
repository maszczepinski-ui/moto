// Treść stron „Wada ukryta auta” (strona główna narzędzia i strony sytuacji)
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

export const SEKCJE_WADA: Sekcja[] = [
  {
    h2: 'Dwie różne drogi: od firmy i od osoby prywatnej',
    akapity: [
      'O tym, jakie masz prawa, decyduje przede wszystkim to, kto jest sprzedawcą w dokumencie zakupu. Jeśli auto sprzedała firma (dealer, komis wystawiający fakturę), a Ty kupiłeś je prywatnie, działa ustawa o prawach konsumenta: 2 lata od wydania auta, bez możliwości skrócenia tego terminu w umowie, a sprzedawca ma 14 dni na odpowiedź na reklamację.',
      'Jeśli sprzedawcą była osoba prywatna, obowiązuje rękojmia z Kodeksu cywilnego. Wada musi zostać stwierdzona w ciągu 2 lat od wydania auta, a żądań dochodzi się co do zasady w ciągu roku od jej stwierdzenia. Umowa między osobami prywatnymi może rękojmię ograniczyć albo wyłączyć – wtedy zostaje tylko droga przy podstępnym zatajeniu wady.'
    ],
    tabela: [
      ['', 'Od firmy (Ty prywatnie)', 'Od osoby prywatnej'],
      ['Termin na ujawnienie wady', '2 lata od wydania, nie można skrócić', '2 lata od wydania, chyba że umowa ogranicza lub wyłącza'],
      ['Kto udowadnia, że wada była przy zakupie', 'przez 2 lata przyjmuje się, że była', 'kupujący'],
      ['Odpowiedź sprzedawcy', '14 dni, milczenie = uznanie', 'brak terminu ustawowego – wyznaczasz go sam'],
      ['Wyłączenie odpowiedzialności w umowie', 'nieważne', 'dozwolone, ale nie działa przy podstępie']
    ]
  },
  {
    h2: 'Co możesz żądać',
    lista: [
      'naprawy auta albo wymiany na wolne od wad (przy używanym aucie wymiana jest rzadko możliwa),',
      'obniżenia ceny – proporcjonalnie do wartości auta z wadą i bez wady,',
      'odstąpienia od umowy i zwrotu pieniędzy – tylko przy wadzie istotnej,',
      'przy podstępie – także uchylenia się od skutków umowy (rok od wykrycia błędu), to już sprawa dla prawnika.'
    ]
  },
  {
    h2: 'Zanim wyślesz pierwsze pismo',
    lista: [
      'zrób diagnozę w warsztacie i poproś o opis na piśmie (co, od kiedy, czy usterka mogła istnieć przy zakupie),',
      'zachowaj ogłoszenie – zapewnienia typu „bezwypadkowy” czy „bez wycieków” są ważnym dowodem,',
      'nie naprawiaj auta przed zawiadomieniem sprzedającego, jeśli to możliwe – może chcieć je obejrzeć,',
      'pisz konkretnie: data umowy, VIN, opis wady, data stwierdzenia i jedno wybrane żądanie.'
    ]
  }
];

export const PYTANIA_WADA: Pytanie[] = [
  { q: 'Ile mam czasu na reklamację używanego auta?', a: 'Wada musi ujawnić się w ciągu 2 lat od wydania auta. Przy zakupie od firmy terminu nie można skrócić. Przy zakupie od osoby prywatnej umowa może rękojmię ograniczyć lub wyłączyć, a żądań dochodzi się co do zasady w ciągu roku od stwierdzenia wady.' },
  { q: 'Czy zapis o wyłączeniu rękojmi jest ważny?', a: 'Między osobami prywatnymi – tak, z wyjątkiem sytuacji, gdy sprzedający podstępnie zataił wadę (art. 558 § 2 k.c.). W umowie firmy z konsumentem takie wyłączenie nie działa.' },
  { q: 'Czy handlarz może sprzedać auto jako osoba prywatna?', a: 'Formalnie bywa to stosowane, żeby uniknąć odpowiedzialności. Jeśli okoliczności wskazują na handel (wiele ogłoszeń, plac, faktury), można próbować powoływać się na przepisy konsumenckie – to wymaga dowodów i porady prawnika.' },
  { q: 'Kto płaci za diagnozę wady?', a: 'Na początku zwykle kupujący. Koszt diagnozy możesz dołączyć do żądań, jeśli wada się potwierdzi.' }
];

export const ZRODLA_WADA: Zrodlo[] = [
  { n: 'Kodeks cywilny – art. 556–568 (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093' },
  { n: 'Ustawa o prawach konsumenta – art. 7a, 43a–43g (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20140000827' },
  { n: 'UOKiK – prawa konsumenta', url: 'https://prawakonsumenta.uokik.gov.pl/' }
];
