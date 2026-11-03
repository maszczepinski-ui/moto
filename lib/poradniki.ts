// Poradniki: kupno i sprzedaż auta, kolizja i wypadek.
// Każdy poradnik ma źródła i datę „stan na”. Przy zmianie przepisów popraw treść i datę STAN_PORADNIKOW.
// To nie jest porada prawna – w nietypowej sytuacji kierowca powinien zapytać urząd, ubezpieczyciela lub prawnika.

export const STAN_PORADNIKOW = 'listopad 2026';

export type KategoriaPoradnika = 'kupno' | 'kolizja' | 'bezpieczenstwo';
export type Generator = 'umowa' | 'oswiadczenie' | 'wypowiedzenie';
export type IkonaPoradnika = 'umowa' | 'kluczyk' | 'sprzedaz' | 'oc' | 'kolizja' | 'ranni' | 'ucieczka' | 'zwierze' | 'korytarz' | 'odstep' | 'fotelik' | 'awaria' | 'mgla';

export type Blok =
  | { typ: 'p'; t: string }
  | { typ: 'lista'; elementy: string[] }
  | { typ: 'kroki'; elementy: { t: string; o: string }[] }
  | { typ: 'uwaga'; t: string; ton?: 'info' | 'ostrzezenie' }
  | { typ: 'liczby'; elementy: { w: string; o: string }[] };

export interface Sekcja {
  id: string;
  t: string;
  bloki: Blok[];
}

export interface Poradnik {
  slug: string;
  kategoria: KategoriaPoradnika;
  ikona: IkonaPoradnika;
  tytul: string;
  /** Krótki tytuł do menu i kafelków */
  krotko: string;
  opis: string;
  /** Najważniejsze liczby na górze strony */
  liczby?: { w: string; o: string }[];
  sekcje: Sekcja[];
  faq?: { q: string; a: string }[];
  generator?: Generator;
  powiazane?: string[];
  zrodla: { n: string; url: string }[];
}

export const KATEGORIE: Record<KategoriaPoradnika, { nazwa: string; opis: string }> = {
  kupno: { nazwa: 'Kupno i sprzedaż auta', opis: 'Umowa, podatek, rejestracja, OC – terminy i kary w jednym miejscu.' },
  kolizja: { nazwa: 'Kolizja i wypadek', opis: 'Co zrobić na miejscu, kiedy wezwać policję i jak dostać odszkodowanie.' },
  bezpieczenstwo: { nazwa: 'Bezpieczeństwo na drodze', opis: 'Jak się zachować w trudnych sytuacjach – przepisy i proste zasady, które ratują życie.' }
};

const Z = {
  starostwo: { n: 'Starostwo Powiatowe w Gorlicach (samorzad.gov.pl) – terminy nabycia i zbycia pojazdu, kary', url: 'https://samorzad.gov.pl/web/powiat-gorlicki/przypominamy-o-terminach-na-zgloszenie-nabycia-lub-zbycia-pojazdu' },
  pcc: { n: 'Otomoto – podatek PCC-3 przy kupnie auta (2026)', url: 'https://www.otomoto.pl/news/podatek-od-kupna-samochodu-pcc-3' },
  ocSprzedaz: { n: 'Rankomat – termin zgłoszenia sprzedaży auta ubezpieczycielowi', url: 'https://rankomat.pl/pomoc/samochod/pytanie-w-jakim-terminie-musze-zglosic-do-towarzystwa-ubezpieczeniowego-sprzedaz-samochodu' },
  wypowiedzenie: { n: 'CUK – kiedy można wypowiedzieć OC (art. 28, 28a, 31)', url: 'https://cuk.pl/porady/kiedy-mozna-wypowiedziec-oc' },
  ustawaOC: { n: 'Ustawa o ubezpieczeniach obowiązkowych, UFG i PBUK (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20031241152' },
  prd: { n: 'Prawo o ruchu drogowym (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970980602' },
  kc: { n: 'Kodeks cywilny – rękojmia, art. 556–558 (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093' },
  ufg: { n: 'Mubi – odszkodowanie z UFG, gdy sprawca jest nieznany', url: 'https://mubi.pl/poradniki/nieznany-sprawca-a-odszkodowanie-z-oc-ac/' },
  ufgStrona: { n: 'Ubezpieczeniowy Fundusz Gwarancyjny – sprawdzenie polisy OC i zgłoszenie szkody', url: 'https://www.ufg.pl/' },
  pbuk: { n: 'Polskie Biuro Ubezpieczycieli Komunikacyjnych – szkoda z autem z zagranicy', url: 'https://www.pbuk.pl/' },
  zwierzeInteria: { n: 'Interia Motoryzacja – kto płaci za auto po zderzeniu ze zwierzęciem, znak A-18b', url: 'https://motoryzacja.interia.pl/porady/przepisy-drogowe/news-kto-zaplaci-za-rozbite-auto-brutalna-prawda-o-znaku-a-18b,nId,23536641' },
  zwierzeRankomat: { n: 'Rankomat – wypadek z dzikim zwierzęciem: co robić i kto płaci', url: 'https://rankomat.pl/samochod/wypadek-kolizja-dzikie-zwierze' },
  kk: { n: 'Kodeks karny – art. 162 (nieudzielenie pomocy) (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970880553' },
  historia: { n: 'Historia Pojazdu – bezpłatne sprawdzenie auta w CEPiK (gov.pl)', url: 'https://historiapojazdu.gov.pl/' },
  korytarz: { n: 'Ministerstwo Infrastruktury (gov.pl) – obowiązkowe korytarze życia i jazda na suwak', url: 'https://www.gov.pl/web/infrastruktura/od-jutra-obowiazkowe-korytarze-zycia-i-jazda-na-suwak' },
  odstep: { n: 'Auto Świat – zasada „pół licznika”, minimalny odstęp na autostradzie', url: 'https://www.auto-swiat.pl/porady/czy-wiesz-co-oznacza-zasada-pol-licznika-jaki-jest-minimalny-odstep-na-autostradzie/1spfkfm' },
  foteliki: { n: 'CUK – przewóz dzieci w samochodzie, aktualne przepisy', url: 'https://cuk.pl/porady/przewoz-dzieci-w-samochodzie-do-kiedy-musi-byc-w-foteliku-aktualne-przepisy' },
  awaria: { n: 'Mubi – awaria na autostradzie lub drodze ekspresowej', url: 'https://mubi.pl/poradniki/awaria-samochodu-na-autostradzie/' },
  mgla: { n: 'Interia Motoryzacja – kiedy włączać światła przeciwmgłowe z przodu i z tyłu', url: 'https://motoryzacja.interia.pl/porady/news-kiedy-wlaczac-swiatla-przeciwmgielne-z-przodu-a-kiedy-z-tylu,nId,7154932' }
};

export const PORADNIKI: Poradnik[] = [
  // ───────────── KUPNO I SPRZEDAŻ ─────────────
  {
    slug: 'umowa-kupna-sprzedazy-samochodu',
    kategoria: 'kupno',
    ikona: 'umowa',
    tytul: 'Umowa kupna-sprzedaży samochodu – wzór do wypełnienia',
    krotko: 'Umowa kupna-sprzedaży',
    opis: 'Wypełnij pola, sprawdź podgląd i wydrukuj umowę w dwóch egzemplarzach. Dane nie są nigdzie wysyłane – wszystko dzieje się w Twojej przeglądarce.',
    generator: 'umowa',
    liczby: [
      { w: '2 egz.', o: 'po jednym dla każdej strony' },
      { w: '14 dni', o: 'na PCC-3 dla kupującego' },
      { w: '30 dni', o: 'na rejestrację i zgłoszenie zbycia' }
    ],
    sekcje: [
      {
        id: 'co-musi-zawierac',
        t: 'Co musi być w umowie',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'datę i miejsce zawarcia – od daty liczą się terminy na podatek, rejestrację i zgłoszenie zbycia,',
              'dane sprzedającego i kupującego (imię, nazwisko, adres, numer dowodu osobistego lub PESEL),',
              'dane auta: marka, model, rok produkcji, numer VIN, numer rejestracyjny i przebieg w chwili sprzedaży,',
              'cenę i sposób zapłaty,',
              'oświadczenie sprzedającego, że auto jest jego własnością i nie ma wad prawnych (np. zastawu, zajęcia komorniczego),',
              'listę przekazanych dokumentów i kluczy,',
              'podpisy obu stron.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Nie zaniżaj ceny w umowie. Podatek PCC liczy się od wartości rynkowej auta, a urząd skarbowy może zakwestionować zbyt niską kwotę. Zaniżona cena utrudnia też dochodzenie pieniędzy, gdy auto okaże się wadliwe.'
          }
        ]
      },
      {
        id: 'rekojmia',
        t: 'Rękojmia – czy sprzedający odpowiada za wady',
        bloki: [
          {
            typ: 'p',
            t: 'Sprzedający odpowiada wobec kupującego za wady fizyczne auta (rękojmia z Kodeksu cywilnego). Przy sprzedaży między osobami prywatnymi strony mogą w umowie tę odpowiedzialność ograniczyć lub wyłączyć (art. 558 KC). Wyłączenie nie działa, jeśli sprzedający podstępnie zataił wadę.'
          },
          {
            typ: 'p',
            t: 'Gdy kupujesz od firmy (komis, dealer) jako konsument, rękojmi nie da się wyłączyć ani ograniczyć – wtedy obowiązują przepisy o prawach konsumenta.'
          }
        ]
      },
      {
        id: 'przy-podpisaniu',
        t: 'Przy podpisaniu – sprawdź',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'VIN w dokumentach i na aucie', o: 'Numer w dowodzie rejestracyjnym musi się zgadzać z numerem na nadwoziu i pod szybą.' },
              { t: 'Czy sprzedający jest właścicielem', o: 'Porównaj dane z dowodu osobistego z dowodem rejestracyjnym. Jeśli właścicieli jest kilku – podpisać muszą wszyscy.' },
              { t: 'Historię auta', o: 'Bezpłatnie: historiapojazdu.gov.pl (przebiegi z przeglądów, ważność OC). Szerzej: raport z historią szkód po numerze VIN.' },
              { t: 'Dokumenty do przekazania', o: 'Dowód rejestracyjny, karta pojazdu (jeśli była wydana), polisa OC, klucze, tablice rejestracyjne.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy umowę kupna-sprzedaży auta trzeba spisać u notariusza?', a: 'Nie. Wystarczy zwykła umowa na piśmie podpisana przez obie strony, w dwóch egzemplarzach.' },
      { q: 'Kto płaci podatek PCC przy kupnie auta?', a: 'Kupujący – 2% wartości rynkowej auta, w ciągu 14 dni od podpisania umowy, jeśli wartość przekracza 1000 zł. Nie płacisz PCC, gdy kupujesz od firmy na fakturę z VAT (także VAT-marża).' },
      { q: 'Czy można wyłączyć rękojmię w umowie między osobami prywatnymi?', a: 'Tak, art. 558 Kodeksu cywilnego na to pozwala. Wyłączenie nie chroni jednak sprzedającego, który podstępnie zataił wadę auta.' }
    ],
    powiazane: ['kupilem-auto-co-dalej', 'sprzedalem-auto-co-dalej', 'wypowiedzenie-oc'],
    zrodla: [Z.kc, Z.pcc, Z.starostwo, Z.historia]
  },
  {
    slug: 'kupilem-auto-co-dalej',
    kategoria: 'kupno',
    ikona: 'kluczyk',
    tytul: 'Kupiłem auto – co dalej? Podatek, rejestracja, OC',
    krotko: 'Kupiłem auto – co dalej',
    opis: 'Trzy obowiązki po zakupie używanego auta od osoby prywatnej, ich terminy i kary za spóźnienie.',
    liczby: [
      { w: '14 dni', o: 'na PCC-3 (2% wartości rynkowej)' },
      { w: '30 dni', o: 'na wniosek o rejestrację' },
      { w: '500 zł', o: 'kara za spóźnienie z rejestracją' }
    ],
    sekcje: [
      {
        id: 'kolejno',
        t: 'Po kolei, od dnia podpisania umowy',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              {
                t: 'Do 14 dni: podatek PCC-3',
                o: 'Złóż deklarację PCC-3 i zapłać 2% wartości rynkowej auta. Najprościej przez e-Urząd Skarbowy (logowanie profilem zaufanym, bankowością albo mObywatelem). Zachowaj potwierdzenie (UPO). Nie płacisz, gdy auto jest warte do 1000 zł albo gdy kupiłeś je od firmy na fakturę z VAT lub VAT-marżą.'
              },
              {
                t: 'Od razu: sprawdź OC',
                o: 'Polisa OC sprzedającego przechodzi na Ciebie razem z autem i chroni do końca okresu, na który ją zawarto. Ta polisa nie przedłuża się sama – przed jej końcem musisz kupić nową. Możesz ją też wypowiedzieć wcześniej i od razu kupić własną (art. 31).'
              },
              {
                t: 'Do 30 dni: wniosek o rejestrację',
                o: 'Złóż wniosek w wydziale komunikacji właściwym dla Twojego miejsca zamieszkania (wiele urzędów przyjmuje go też przez internet). Potrzebujesz: umowy lub faktury, dowodu rejestracyjnego, karty pojazdu (jeśli była wydana), tablic rejestracyjnych i dowodu osobistego. Tablice zwykle zostają przy aucie – także wtedy, gdy mieszkasz w innym powiecie niż poprzedni właściciel.'
              }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Kara za brak wniosku o rejestrację w ciągu 30 dni to 500 zł, a po 180 dniach – 1000 zł. Termin na PCC biegnie niezależnie od rejestracji.'
          }
        ]
      },
      {
        id: 'zwolnienia',
        t: 'Kiedy nie płacisz PCC',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'kupujesz od firmy, a sprzedaż jest objęta VAT (również VAT-marża),',
              'wartość rynkowa auta nie przekracza 1000 zł,',
              'kupujesz jako osoba z niepełnosprawnością samochód osobowy na własne potrzeby – na warunkach z ustawy o PCC.'
            ]
          },
          {
            typ: 'p',
            t: 'Uwaga na komisy: jeśli komis działa tylko jako pośrednik, a sprzedawcą w umowie jest osoba prywatna, PCC zwykle trzeba zapłacić. Darowizna (np. od rodzica) to osobna sprawa – zgłasza się ją na formularzu SD-Z2, a nie PCC-3.'
          }
        ]
      },
      {
        id: 'spoznienie',
        t: 'Spóźniłeś się z PCC?',
        bloki: [
          {
            typ: 'p',
            t: 'Złóż zaległą deklarację i zapłać podatek z odsetkami jak najszybciej. Razem z deklaracją możesz złożyć czynny żal – działa, dopóki urząd sam nie zaczął sprawy.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile mam czasu na przerejestrowanie auta po zakupie?', a: '30 dni od dnia zakupu. Za spóźnienie grozi kara administracyjna 500 zł, a po 180 dniach – 1000 zł.' },
      { q: 'Ile mam czasu na zapłacenie PCC po kupnie auta?', a: '14 dni od podpisania umowy. Podatek to 2% wartości rynkowej auta, jeśli przekracza ona 1000 zł.' },
      { q: 'Czy OC poprzedniego właściciela jest ważne?', a: 'Tak, przechodzi na kupującego i jest ważne do końca okresu ubezpieczenia. Nie odnawia się automatycznie – po jego końcu musisz mieć własną polisę.' }
    ],
    powiazane: ['umowa-kupna-sprzedazy-samochodu', 'wypowiedzenie-oc', 'sprzedalem-auto-co-dalej'],
    zrodla: [Z.pcc, Z.starostwo, Z.wypowiedzenie, Z.prd]
  },
  {
    slug: 'sprzedalem-auto-co-dalej',
    kategoria: 'kupno',
    ikona: 'sprzedaz',
    tytul: 'Sprzedałem auto – co muszę zgłosić i komu',
    krotko: 'Sprzedałem auto – co dalej',
    opis: 'Dwa zgłoszenia, które chronią Cię przed mandatami i składkami za auto, którego już nie masz.',
    liczby: [
      { w: '30 dni', o: 'na zgłoszenie zbycia w urzędzie' },
      { w: '250 zł', o: 'kara za brak zgłoszenia' },
      { w: '14 dni', o: 'na powiadomienie ubezpieczyciela OC' }
    ],
    sekcje: [
      {
        id: 'zgloszenia',
        t: 'Co zgłosić po sprzedaży',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              {
                t: 'Do 30 dni: zawiadom urząd o zbyciu',
                o: 'Zawiadom wydział komunikacji (starostę) o sprzedaży auta – osobiście albo przez internet na gov.pl. Dołącz kopię umowy. Przy współwłasności wystarczy zgłoszenie jednego współwłaściciela. Kara za brak zgłoszenia: 250 zł.'
              },
              {
                t: 'Do 14 dni: powiadom ubezpieczyciela OC',
                o: 'Podaj swoje dane, dane kupującego, markę, model, numer rejestracyjny i VIN. Zwykle wystarczy formularz na stronie ubezpieczyciela. Dopóki tego nie zrobisz, odpowiadasz razem z kupującym za niezapłacone raty składki.'
              },
              {
                t: 'AC i assistance',
                o: 'Polisa AC nie przechodzi na kupującego. Jeśli była opłacona z góry, możesz wnioskować o zwrot składki za niewykorzystany okres.'
              }
            ]
          },
          {
            typ: 'uwaga',
            t: 'Jeśli kupujący wypowie przejętą polisę OC, niewykorzystaną część składki ubezpieczyciel zwraca Tobie – sprzedającemu.'
          }
        ]
      },
      {
        id: 'przekaz',
        t: 'Co przekazać kupującemu',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'umowę kupna-sprzedaży (jeden z dwóch egzemplarzy),',
              'dowód rejestracyjny i kartę pojazdu (jeśli była wydana),',
              'tablice rejestracyjne – zostają przy aucie,',
              'potwierdzenie polisy OC,',
              'wszystkie klucze, książkę serwisową, instrukcję, kartę radia.'
            ]
          }
        ]
      },
      {
        id: 'podatek',
        t: 'Czy sprzedający płaci podatek?',
        bloki: [
          {
            typ: 'p',
            t: 'PCC płaci kupujący. Sprzedający płaci podatek dochodowy tylko wtedy, gdy sprzedaje auto przed upływem pół roku, licząc od końca miesiąca, w którym je kupił (dotyczy aut prywatnych, nie firmowych).'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile mam czasu na zgłoszenie sprzedaży auta?', a: '30 dni na zawiadomienie urzędu (kara za brak: 250 zł) i 14 dni na powiadomienie ubezpieczyciela OC.' },
      { q: 'Czy tablice rejestracyjne zostają przy sprzedanym aucie?', a: 'Tak. Tablice przekazujesz kupującemu razem z autem i dowodem rejestracyjnym.' }
    ],
    powiazane: ['umowa-kupna-sprzedazy-samochodu', 'kupilem-auto-co-dalej'],
    zrodla: [Z.starostwo, Z.ocSprzedaz, Z.wypowiedzenie, Z.pcc]
  },
  {
    slug: 'wypowiedzenie-oc',
    kategoria: 'kupno',
    ikona: 'oc',
    tytul: 'Wypowiedzenie OC – wzór i kiedy możesz wypowiedzieć polisę',
    krotko: 'Wypowiedzenie OC',
    opis: 'Trzy sytuacje, w których możesz wypowiedzieć OC, i gotowe pismo do wydrukowania.',
    generator: 'wypowiedzenie',
    sekcje: [
      {
        id: 'podstawy',
        t: 'Kiedy możesz wypowiedzieć OC',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              {
                t: 'Art. 28 – nie chcesz przedłużenia na kolejny rok',
                o: 'Polisa OC sama przedłuża się o 12 miesięcy, jeśli jej nie wypowiesz. Pismo złóż najpóźniej dzień przed końcem okresu ubezpieczenia.'
              },
              {
                t: 'Art. 28a – masz dwa OC na to samo auto',
                o: 'Gdy kupiłeś nową polisę, a stara przedłużyła się automatycznie. Wypowiedz ją jak najszybciej – ubezpieczyciel zatrzyma składkę za czas, w którym faktycznie chronił auto, resztę zwróci.'
              },
              {
                t: 'Art. 31 – kupiłeś auto z OC poprzedniego właściciela',
                o: 'Możesz wypowiedzieć przejętą polisę w dowolnym momencie. Od 10 września 2025 r. możesz wskazać dzień rozwiązania umowy, nie wcześniejszy niż dzień złożenia wypowiedzenia. Niewykorzystana składka wraca do sprzedającego.'
              }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Zanim wypowiesz OC, kup nową polisę. Za jazdę i za samo posiadanie zarejestrowanego auta bez OC UFG nalicza wysoką opłatę karną.'
          }
        ]
      },
      {
        id: 'jak-zlozyc',
        t: 'Jak złożyć wypowiedzenie',
        bloki: [
          {
            typ: 'p',
            t: 'Wypowiedzenie musi mieć formę pisemną i Twój podpis. Możesz je złożyć osobiście u ubezpieczyciela lub agenta, wysłać pocztą albo – jeśli ubezpieczyciel na to pozwala – wysłać e-mailem skan podpisanego pisma lub użyć formularza online. Sam tekst w mailu bez podpisanego dokumentu nie wystarcza. Zachowaj potwierdzenie nadania lub złożenia.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Do kiedy trzeba wypowiedzieć OC, żeby się nie przedłużyło?', a: 'Najpóźniej dzień przed końcem okresu ubezpieczenia (art. 28 ustawy o ubezpieczeniach obowiązkowych).' },
      { q: 'Czy można wypowiedzieć OC mailem?', a: 'Tylko jeśli ubezpieczyciel to dopuszcza – jako skan podpisanego pisma albo przez jego formularz online. Sam tekst wiadomości nie wystarcza.' },
      { q: 'Komu przysługuje zwrot składki po wypowiedzeniu OC przez kupującego?', a: 'Sprzedającemu, czyli osobie, która tę polisę opłaciła. Ubezpieczyciel zwraca ją w ciągu 14 dni.' }
    ],
    powiazane: ['kupilem-auto-co-dalej', 'sprzedalem-auto-co-dalej'],
    zrodla: [Z.wypowiedzenie, Z.ustawaOC]
  },

  // ───────────── KOLIZJA I WYPADEK ─────────────
  {
    slug: 'kolizja-bez-policji',
    kategoria: 'kolizja',
    ikona: 'kolizja',
    tytul: 'Kolizja bez policji – co zrobić i jak spisać oświadczenie sprawcy',
    krotko: 'Kolizja – oświadczenie sprawcy',
    opis: 'Kiedy możesz załatwić stłuczkę bez policji, kiedy musisz ją wezwać i co wpisać do oświadczenia, żeby ubezpieczyciel wypłacił odszkodowanie.',
    generator: 'oswiadczenie',
    liczby: [
      { w: '112', o: 'numer alarmowy' },
      { w: '0 zł', o: 'mandatu, gdy spiszecie oświadczenie' },
      { w: '2 egz.', o: 'oświadczenia – po jednym dla każdego' }
    ],
    sekcje: [
      {
        id: 'na-miejscu',
        t: 'Na miejscu, krok po kroku',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zatrzymaj się i zabezpiecz miejsce', o: 'Włącz światła awaryjne, załóż kamizelkę, jeśli wysiadasz poza miastem, i ustaw trójkąt ostrzegawczy.' },
              { t: 'Sprawdź, czy nikt nie jest ranny', o: 'Jeśli ktoś jest ranny – to już wypadek. Dzwoń na 112 i nie przestawiaj aut.' },
              { t: 'Zrób zdjęcia, zanim przestawicie auta', o: 'Ustawienie aut, uszkodzenia, tablice rejestracyjne, znaki i ślady na jezdni. Zdjęcia robione z kilku stron.' },
              { t: 'Usuń auta z jezdni', o: 'Gdy nikt nie jest ranny, kierowcy muszą jak najszybciej usunąć auta z miejsca kolizji, żeby nie blokowały ruchu (art. 44 Prawa o ruchu drogowym).' },
              { t: 'Spiszcie oświadczenie sprawcy', o: 'Dwa egzemplarze, podpisane przez obu kierowców. Sprawdź dokumenty sprawcy: dowód osobisty, prawo jazdy, dowód rejestracyjny.' },
              { t: 'Sprawdź polisę OC sprawcy', o: 'Na ufg.pl po numerze rejestracyjnym i dacie zdarzenia. Szkodę zgłaszasz do ubezpieczyciela sprawcy.' }
            ]
          }
        ]
      },
      {
        id: 'kiedy-policja',
        t: 'Kiedy musisz wezwać policję',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'ktoś jest ranny lub zginął – to wypadek, nie kolizja,',
              'sprawca uciekł albo nie chce podać danych,',
              'sprawca nie ma ważnego OC,',
              'któryś kierowca wygląda na nietrzeźwego lub pod wpływem środków odurzających,',
              'sprawca nie ma prawa jazdy, dowodu rejestracyjnego albo dokumentu tożsamości,',
              'nie zgadzacie się, kto jest winny,',
              'uszkodzone jest mienie publiczne (znak, bariera, sygnalizator) – wtedy też warto mieć notatkę policji.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'Jeśli przyjedzie policja, sprawca zwykle dostanie mandat i punkty karne. Spisanie oświadczenia nie jest przestępstwem ani „ukrywaniem” kolizji – to legalny sposób załatwienia stłuczki bez rannych.'
          }
        ]
      },
      {
        id: 'zagraniczne',
        t: 'Sprawca ma auto z zagranicy',
        bloki: [
          {
            typ: 'p',
            t: 'Spisz numer Zielonej Karty lub polisy i nazwę zagranicznego ubezpieczyciela. W Polsce szkodą zajmuje się korespondent tego ubezpieczyciela albo Polskie Biuro Ubezpieczycieli Komunikacyjnych (PBUK, tel. 22 551 51 00).'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy po stłuczce trzeba wzywać policję?', a: 'Nie, jeśli nikt nie jest ranny, sprawca przyznaje się do winy, jest trzeźwy, ma dokumenty i ważne OC. Wystarczy pisemne oświadczenie sprawcy podpisane przez obu kierowców.' },
      { q: 'Co musi zawierać oświadczenie sprawcy kolizji?', a: 'Datę, godzinę i miejsce, dane obu kierowców i aut, numer polisy OC sprawcy i nazwę ubezpieczyciela, opis zdarzenia, uszkodzenia, przyznanie się do winy i podpisy obu stron.' },
      { q: 'Gdzie zgłosić szkodę po kolizji?', a: 'Do ubezpieczyciela OC sprawcy – telefonicznie, online albo w oddziale. Dołącz oświadczenie i zdjęcia.' }
    ],
    powiazane: ['wypadek-z-rannymi', 'sprawca-uciekl-brak-oc', 'zderzenie-ze-zwierzeciem'],
    zrodla: [Z.prd, Z.ufgStrona, Z.pbuk, Z.ustawaOC]
  },
  {
    slug: 'wypadek-z-rannymi',
    kategoria: 'kolizja',
    ikona: 'ranni',
    tytul: 'Wypadek z rannymi – co musisz zrobić jako kierowca',
    krotko: 'Wypadek z rannymi',
    opis: 'Obowiązki uczestnika i świadka wypadku: zabezpieczenie miejsca, wezwanie pomocy, pierwsza pomoc. Krótko, żeby dało się przeczytać na poboczu.',
    liczby: [
      { w: '112', o: 'policja i pogotowie' },
      { w: '100 m', o: 'trójkąt na autostradzie i drodze ekspresowej' },
      { w: '30–50 m', o: 'trójkąt na innych drogach poza miastem' }
    ],
    sekcje: [
      {
        id: 'kroki',
        t: 'Co robić – kolejno',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zatrzymaj się i zabezpiecz miejsce', o: 'Światła awaryjne, kamizelka, trójkąt: na autostradzie i ekspresówce 100 m za autem, na innych drogach poza obszarem zabudowanym 30–50 m, w mieście tuż za autem lub na nim.' },
              { t: 'Dzwoń na 112', o: 'Powiedz: gdzie jesteś (droga, kilometr, kierunek), ile osób jest rannych, czy ktoś jest uwięziony w aucie, czy coś się pali lub wycieka paliwo. Nie rozłączaj się pierwszy.' },
              { t: 'Udziel pierwszej pomocy', o: 'Sprawdź przytomność i oddech. Jeśli ktoś nie oddycha – zacznij resuscytację (30 uciśnięć, 2 oddechy) do przyjazdu pogotowia. Ranną osobę wyciągaj z auta tylko przy bezpośrednim zagrożeniu (ogień, ryzyko potrącenia).' },
              { t: 'Nie przestawiaj aut', o: 'Przy wypadku z rannymi nie ruszaj pojazdów i śladów, dopóki nie pozwoli na to policja – chyba że trzeba ratować ludzi.' },
              { t: 'Zostań na miejscu', o: 'Uczestnik wypadku musi zostać na miejscu do przyjazdu policji. Odjazd z miejsca wypadku zaostrza odpowiedzialność karną.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Nieudzielenie pomocy osobie w bezpośrednim zagrożeniu życia lub zdrowia, gdy możesz to zrobić bez narażania siebie, jest przestępstwem (art. 162 Kodeksu karnego, do 3 lat więzienia). Wystarczy wezwać pomoc i zrobić to, co potrafisz.'
          }
        ]
      },
      {
        id: 'apteczka',
        t: 'Co warto mieć w aucie',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'trójkąt ostrzegawczy i gaśnica – obowiązkowe w aucie osobowym zarejestrowanym w Polsce,',
              'apteczka z rękawiczkami i maseczką do resuscytacji,',
              'kamizelki odblaskowe dla wszystkich pasażerów,',
              'latarka i nóż do pasów / młotek do szyb w zasięgu ręki.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Czym różni się kolizja od wypadku?', a: 'W wypadku ktoś został ranny lub zginął. W kolizji są tylko szkody w autach lub mieniu. Przy wypadku policję trzeba wezwać zawsze.' },
      { q: 'Gdzie ustawić trójkąt ostrzegawczy?', a: 'Na autostradzie i drodze ekspresowej 100 m za autem, na innych drogach poza obszarem zabudowanym 30–50 m, w obszarze zabudowanym tuż za autem lub na nim.' }
    ],
    powiazane: ['kolizja-bez-policji', 'sprawca-uciekl-brak-oc'],
    zrodla: [Z.prd, Z.kk]
  },
  {
    slug: 'sprawca-uciekl-brak-oc',
    kategoria: 'kolizja',
    ikona: 'ucieczka',
    tytul: 'Sprawca uciekł albo nie ma OC – kto zapłaci (UFG)',
    krotko: 'Sprawca uciekł lub bez OC',
    opis: 'Gdy sprawca jest nieznany albo nieubezpieczony, odszkodowanie wypłaca Ubezpieczeniowy Fundusz Gwarancyjny. Sprawdź, na jakich warunkach.',
    liczby: [
      { w: '14 dni', o: 'leczenia – próg dla szkód w aucie od nieznanego sprawcy' },
      { w: '300 €', o: 'potrącane od szkody częściowej w aucie' },
      { w: '30 dni', o: 'na decyzję po otrzymaniu dokumentów' }
    ],
    sekcje: [
      {
        id: 'na-miejscu',
        t: 'Na miejscu',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wezwij policję', o: 'Notatka policji jest bardzo ważna, gdy sprawca uciekł albo nie ma OC – zwłaszcza gdy nie ma świadków ani nagrań.' },
              { t: 'Zapisz wszystko, co pamiętasz', o: 'Nawet fragment numeru rejestracyjnego, kolor i model auta, kierunek ucieczki. Poszukaj świadków i kamer (sklepy, stacje, wideorejestratory innych kierowców).' },
              { t: 'Zrób zdjęcia', o: 'Miejsce zdarzenia, uszkodzenia, ślady, odłamki.' },
              { t: 'Zgłoś szkodę', o: 'Do dowolnego ubezpieczyciela, który sprzedaje OC komunikacyjne – nie może odmówić przyjęcia zgłoszenia, nawet jeśli nie masz u niego polisy. Ubezpieczyciel przekaże sprawę do UFG.' }
            ]
          }
        ]
      },
      {
        id: 'nieznany',
        t: 'Sprawca nieznany (uciekł)',
        bloki: [
          {
            typ: 'p',
            t: 'UFG płaci przede wszystkim za szkody na osobie (leczenie, zadośćuczynienie). Za szkody w aucie zapłaci tylko wtedy, gdy ktoś z uczestników zginął albo jego leczenie (rozstrój zdrowia) trwało dłużej niż 14 dni, co potwierdza lekarz. Od odszkodowania za szkodę częściową w aucie UFG odejmuje równowartość 300 euro.'
          },
          {
            typ: 'uwaga',
            t: 'Jeśli masz AC – zgłoś szkodę najpierw z AC. UFG może wtedy wyrównać to, czego AC nie pokryło (np. utracone zniżki).'
          }
        ]
      },
      {
        id: 'bez-oc',
        t: 'Sprawca znany, ale bez OC',
        bloki: [
          {
            typ: 'p',
            t: 'Gdy sprawca jest znany, ale nie ma OC, UFG wypłaca odszkodowanie za szkody na osobie i w mieniu tak jak ubezpieczyciel OC, a potem odzyskuje te pieniądze od sprawcy. Niezbędne są dane sprawcy i notatka policji.'
          },
          {
            typ: 'p',
            t: 'Właściciel auta bez ważnego OC płaci też do UFG opłatę karną – niezależnie od tego, czy spowodował szkodę.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Kto płaci, gdy sprawca kolizji uciekł?', a: 'Ubezpieczeniowy Fundusz Gwarancyjny. Za szkody w aucie tylko wtedy, gdy ktoś zginął lub leczył się ponad 14 dni; od szkody częściowej w aucie odejmuje równowartość 300 euro.' },
      { q: 'Gdzie zgłosić szkodę do UFG?', a: 'U dowolnego ubezpieczyciela sprzedającego OC komunikacyjne – musi przyjąć zgłoszenie i przekazać je do UFG.' }
    ],
    powiazane: ['kolizja-bez-policji', 'wypadek-z-rannymi'],
    zrodla: [Z.ufg, Z.ufgStrona, Z.ustawaOC]
  },
  {
    slug: 'zderzenie-ze-zwierzeciem',
    kategoria: 'kolizja',
    ikona: 'zwierze',
    tytul: 'Zderzenie z dzikim zwierzęciem – co zrobić i kto zapłaci',
    krotko: 'Zderzenie ze zwierzęciem',
    opis: 'Sarna, dzik czy łoś na drodze: jak się zachować po zderzeniu i od kogo możesz dostać odszkodowanie. OC sprawcy tu nie pomoże.',
    sekcje: [
      {
        id: 'na-miejscu',
        t: 'Na miejscu',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Nie odjeżdżaj', o: 'Zatrzymaj się w bezpiecznym miejscu, włącz światła awaryjne, załóż kamizelkę i ustaw trójkąt.' },
              { t: 'Wezwij policję', o: 'Dzwoń na 112. Notatka policji jest podstawą do starania się o odszkodowanie z AC lub od zarządcy drogi.' },
              { t: 'Nie podchodź do rannego zwierzęcia', o: 'Ranne zwierzę może zaatakować. Służby powiadomią myśliwych lub weterynarza.' },
              { t: 'Nie zabieraj zwierzęcia', o: 'Dzikie zwierzęta łowne należą do Skarbu Państwa – nie wolno ich zabierać.' },
              { t: 'Zrób zdjęcia', o: 'Uszkodzenia auta, sierść i krew na karoserii, zwierzę, miejsce zdarzenia i znaki w okolicy (albo ich brak).' }
            ]
          }
        ]
      },
      {
        id: 'kto-placi',
        t: 'Kto płaci za naprawę auta',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Twoje AC', o: 'Najpewniejsza droga – nie musisz udowadniać niczyjej winy. Sprawdź w warunkach, czy polisa (zwłaszcza tańsze „mini AC”) obejmuje zderzenie ze zwierzęciem.' },
              { t: 'Zarządca drogi', o: 'Możliwe, gdy w miejscu częstych przejść zwierząt zabrakło ostrzeżenia. Jeśli stał znak A-18b „uwaga zwierzęta dzikie”, odszkodowanie od zarządcy jest praktycznie wykluczone – kierowca był ostrzeżony.' },
              { t: 'Koło łowieckie', o: 'Gdy zwierzę wybiegło spłoszone polowaniem w okolicy. Trzeba to udowodnić.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Twoje OC nie pokrywa szkód we własnym aucie. Bez AC i bez dowodu winy zarządcy drogi lub koła łowieckiego za naprawę płacisz sam.'
          },
          {
            typ: 'p',
            t: 'Znak A-18b obowiązuje zwykle na odcinku 500 m, chyba że tabliczka pod nim podaje inną długość. W takich miejscach zwolnij, szczególnie o świcie i o zmroku.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy po zderzeniu z sarną trzeba wzywać policję?', a: 'Tak, warto zawsze – notatka policji jest podstawą do odszkodowania z AC lub od zarządcy drogi.' },
      { q: 'Kto płaci za szkodę po zderzeniu z dzikiem?', a: 'Najczęściej Twoje AC. Zarządca drogi tylko wtedy, gdy zabrakło wymaganego ostrzeżenia; koło łowieckie, gdy zwierzę spłoszyło polowanie.' }
    ],
    powiazane: ['kolizja-bez-policji', 'wypadek-z-rannymi'],
    zrodla: [Z.zwierzeInteria, Z.zwierzeRankomat]
  },
  // ───────────── BEZPIECZEŃSTWO ─────────────
  {
    slug: 'korytarz-zycia-jazda-na-suwak',
    kategoria: 'bezpieczenstwo',
    ikona: 'korytarz',
    tytul: 'Korytarz życia i jazda na suwak – jak to robić poprawnie',
    krotko: 'Korytarz życia i jazda na suwak',
    opis: 'Dwie zasady, które od grudnia 2019 r. są obowiązkowe. Dzięki nim karetka szybciej dojeżdża do wypadku, a korki przy zwężeniach są krótsze.',
    liczby: [
      { w: '6.12.2019', o: 'od tego dnia obie zasady są obowiązkowe' },
      { w: '←  |  →', o: 'lewy pas w lewo, pozostałe w prawo' },
      { w: '1 na 1', o: 'na suwak: naprzemiennie przy zwężeniu' }
    ],
    sekcje: [
      {
        id: 'korytarz',
        t: 'Korytarz życia',
        bloki: [
          {
            typ: 'p',
            t: 'Na autostradzie, drodze ekspresowej i każdej drodze z co najmniej dwoma pasami w jednym kierunku robisz korytarz, gdy auta zwalniają i tworzy się zator. Nie czekaj na syrenę – karetka czy straż mogą być już w drodze, a w zatorze nie ma potem miejsca na manewry.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Jedziesz lewym pasem – zjedź w lewo', o: 'Jak najbliżej lewej krawędzi jezdni lub bariery.' },
              { t: 'Jedziesz każdym innym pasem – zjedź w prawo', o: 'Także środkowym pasem przy trzech pasach. Wolno przy tym wjechać na pas awaryjny.' },
              { t: 'Zostaw miejsce z przodu', o: 'Stań tak, żeby mieć jeszcze miejsce na dokończenie manewru – nie przyklejaj się do auta przed sobą.' },
              { t: 'Nie jedź za karetką', o: 'Korytarz jest tylko dla służb. Wracasz na pas dopiero, gdy ruch znów rusza.' }
            ]
          }
        ]
      },
      {
        id: 'suwak',
        t: 'Jazda na suwak',
        bloki: [
          {
            typ: 'p',
            t: 'Gdy pas się kończy (roboty drogowe, zwężenie) i tworzy się zator, kierowcy z kończącego się pasa jadą nim do samego zwężenia i dopiero tam włączają się do ruchu. Kierowcy na pasie, który biegnie dalej, wpuszczają ich naprzemiennie – jedno auto z jednego pasa, jedno z drugiego.'
          },
          {
            typ: 'uwaga',
            t: 'Zjeżdżanie na wolny pas kilkaset metrów przed zwężeniem wydłuża korek. Jazda kończącym się pasem do samego zwężenia nie jest „cwaniactwem” – tak mówią przepisy.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Kiedy trzeba tworzyć korytarz życia?', a: 'Gdy na drodze z co najmniej dwoma pasami w jednym kierunku auta zwalniają i tworzy się zator – od razu, nie dopiero po usłyszeniu syreny.' },
      { q: 'Jak tworzyć korytarz życia na trzech pasach?', a: 'Lewy pas zjeżdża w lewo, a środkowy i prawy – w prawo. Korytarz powstaje między lewym a środkowym pasem.' },
      { q: 'Czy jazda na suwak jest obowiązkowa?', a: 'Tak, od 6 grudnia 2019 r. Przy zwężeniu i zatorze kierowcy włączają się naprzemiennie w miejscu, w którym kończy się pas.' }
    ],
    powiazane: ['awaria-na-autostradzie', 'odstep-na-autostradzie', 'wypadek-z-rannymi'],
    zrodla: [Z.korytarz, Z.prd]
  },
  {
    slug: 'odstep-na-autostradzie',
    kategoria: 'bezpieczenstwo',
    ikona: 'odstep',
    tytul: 'Minimalny odstęp na autostradzie – zasada „pół licznika”',
    krotko: 'Odstęp na autostradzie',
    opis: 'Na autostradzie i drodze ekspresowej odstęp od auta przed Tobą musi wynosić w metrach co najmniej połowę Twojej prędkości. Zobacz, ile to w praktyce.',
    liczby: [
      { w: 'v ÷ 2', o: 'minimalny odstęp w metrach' },
      { w: '300–500 zł', o: 'mandat za jazdę „na zderzaku”' },
      { w: '5 pkt', o: 'punkty karne' }
    ],
    sekcje: [
      {
        id: 'ile',
        t: 'Ile metrów przy jakiej prędkości',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '40 m', o: 'przy 80 km/h' },
              { w: '50 m', o: 'przy 100 km/h' },
              { w: '60 m', o: 'przy 120 km/h' },
              { w: '70 m', o: 'przy 140 km/h' }
            ]
          },
          {
            typ: 'p',
            t: 'Przepis dotyczy autostrad i dróg ekspresowych. Nie stosuje się go w czasie wyprzedzania. Za zbyt mały odstęp grozi mandat 300–500 zł i 5 punktów karnych – policja mierzy go m.in. z wiaduktów.'
          }
        ]
      },
      {
        id: 'jak-ocenic',
        t: 'Jak ocenić odstęp w praktyce',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Policz sekundy', o: 'Gdy auto przed Tobą mija słupek lub znak, policz „jeden, dwa”. Jeśli mijasz ten punkt wcześniej niż po 2 sekundach – jesteś za blisko. Dwie sekundy to zawsze więcej niż połowa licznika w metrach.' },
              { t: 'Zwiększ odstęp w złych warunkach', o: 'W deszczu, we mgle i na śliskiej drodze droga hamowania jest dłuższa – zostaw co najmniej dwa razy więcej miejsca.' },
              { t: 'Nie daj się „pchać”', o: 'Gdy ktoś jedzie Ci na zderzaku, nie hamuj gwałtownie. Zjedź na prawy pas, kiedy to bezpieczne, i przepuść go.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Jaki jest minimalny odstęp na autostradzie?', a: 'W metrach co najmniej połowa prędkości w km/h – np. 60 m przy 120 km/h. Dotyczy też dróg ekspresowych, nie dotyczy wyprzedzania.' },
      { q: 'Jaki jest mandat za brak odstępu na autostradzie?', a: '300–500 zł i 5 punktów karnych.' }
    ],
    powiazane: ['korytarz-zycia-jazda-na-suwak', 'jazda-we-mgle'],
    zrodla: [Z.odstep, Z.prd]
  },
  {
    slug: 'fotelik-dla-dziecka-przepisy',
    kategoria: 'bezpieczenstwo',
    ikona: 'fotelik',
    tytul: 'Fotelik dla dziecka – przepisy: do jakiego wzrostu i jakie kary',
    krotko: 'Foteliki dla dzieci',
    opis: 'O tym, czy dziecko musi jechać w foteliku, decyduje wzrost, a nie wiek. Najważniejsze zasady, wyjątki i kary.',
    liczby: [
      { w: '150 cm', o: 'do tego wzrostu fotelik lub podstawka' },
      { w: '300 zł', o: 'mandat za każde dziecko' },
      { w: '5 pkt', o: 'punkty za każde dziecko' }
    ],
    sekcje: [
      {
        id: 'zasady',
        t: 'Najważniejsze zasady',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'dziecko poniżej 150 cm wzrostu jedzie w foteliku lub na podstawce dopasowanej do wzrostu i wagi – bez względu na wiek,',
              'fotelika tyłem do kierunku jazdy nie wolno montować na przednim siedzeniu z włączoną poduszką powietrzną pasażera,',
              'niemowlę jedzie tyłem do kierunku jazdy – zaleca się co najmniej do 15. miesiąca życia, a najlepiej jak najdłużej,',
              'fotelik musi mieć homologację (ECE R44/04 albo nowszą R129 „i-Size”) i być zamontowany zgodnie z instrukcją – pasami albo ISOFIX.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Za przewożenie dziecka bez fotelika albo w źle zamontowanym foteliku: 300 zł i 5 punktów karnych – za każde dziecko. Przy trojgu dzieci to 15 punktów.'
          }
        ]
      },
      {
        id: 'wyjatki',
        t: 'Wyjątki',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'dziecko ma co najmniej 135 cm, a waga lub budowa nie pozwala mu wygodnie siedzieć w foteliku – może jechać na tylnym siedzeniu zapięte pasami,',
              'na tylnej kanapie mieszczą się tylko dwa foteliki – trzecie dziecko (co najmniej 3-letnie) może jechać z tyłu zapięte pasami,',
              'dziecko ma zaświadczenie lekarskie o przeciwwskazaniach do jazdy w foteliku,',
              'taksówka – dziecko może jechać z tyłu zapięte pasami, choć fotelik jest zalecany.'
            ]
          }
        ]
      },
      {
        id: 'porady',
        t: 'Jak sprawdzić, czy fotelik jest dobrze zamontowany',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Fotelik się nie przesuwa', o: 'Złap go przy pasie lub mocowaniu ISOFIX i spróbuj poruszyć – nie powinien się wyraźnie przesuwać ani przechylać.' },
              { t: 'Szelki przylegają', o: 'Szelki mają ściśle przylegać do ciała dziecka – nie mogą być luźne ani skręcone. Zimą zdejmij dziecku grubą kurtkę.' },
              { t: 'Fotelik po wypadku – do wymiany', o: 'Nawet jeśli nie widać uszkodzeń. Nie kupuj używanego fotelika o nieznanej historii.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Do jakiego wzrostu dziecko musi jeździć w foteliku?', a: 'Do 150 cm. Wyjątek: dziecko od 135 cm, któremu waga lub budowa nie pozwala wygodnie siedzieć w foteliku – wtedy jedzie z tyłu zapięte pasami.' },
      { q: 'Jaka jest kara za brak fotelika?', a: '300 zł i 5 punktów karnych za każde dziecko przewożone niezgodnie z przepisami.' },
      { q: 'Czy dziecko może jechać z przodu w foteliku?', a: 'Tak, ale fotelik tyłem do kierunku jazdy tylko przy wyłączonej poduszce powietrznej pasażera.' }
    ],
    powiazane: ['wypadek-z-rannymi', 'awaria-na-autostradzie'],
    zrodla: [Z.foteliki, Z.prd]
  },
  {
    slug: 'awaria-na-autostradzie',
    kategoria: 'bezpieczenstwo',
    ikona: 'awaria',
    tytul: 'Awaria na autostradzie lub ekspresówce – co zrobić krok po kroku',
    krotko: 'Awaria na autostradzie',
    opis: 'Najbardziej niebezpieczne jest stanie przy aucie na pasie awaryjnym, obok aut jadących ponad 100 km/h. Zrób to w tej kolejności.',
    liczby: [
      { w: '19 111', o: 'infolinia GDDKiA (drogi krajowe)' },
      { w: '100 m', o: 'trójkąt za autem' },
      { w: 'co 2 km', o: 'kolumny alarmowe SOS' }
    ],
    sekcje: [
      {
        id: 'kroki',
        t: 'Krok po kroku',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zjedź na pas awaryjny', o: 'Jak najbliżej bariery, koła skręć w prawo. Włącz światła awaryjne, a po zmroku i przy złej widoczności także pozycyjne.' },
              { t: 'Wysiądź prawą stroną', o: 'Wszyscy pasażerowie – po stronie bariery. Załóż kamizelkę odblaskową (nie jest obowiązkowym wyposażeniem, ale bardzo pomaga po zmroku).' },
              { t: 'Przejdź za barierę', o: 'Czekaj za barierą energochłonną, z dala od auta. Nie stój na pasie awaryjnym i nie wracaj do auta.' },
              { t: 'Ustaw trójkąt 100 m za autem', o: 'Idź za barierą. Słupki przy autostradzie stoją co 100 m, więc łatwo odmierzyć odległość. Brak trójkąta to mandat 300 zł i 1 punkt.' },
              { t: 'Wezwij pomoc', o: 'Zadzwoń do zarządcy drogi (drogi GDDKiA: 19 111) lub na 112. Z kolumny SOS operator od razu wie, gdzie jesteś. Przyda się też numer assistance z polisy.' },
              { t: 'Nie naprawiaj na własną rękę', o: 'Koło możesz wymienić dopiero, gdy służby zabezpieczą miejsce. Przy poważniejszej awarii wezwij lawetę.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Na autostradzie nie wolno holować auta na lince – wyjątkiem są pojazdy pomocy drogowej, które zabierają auto do najbliższego zjazdu lub MOP-u. Pas awaryjny nie służy do odpoczynku ani rozmowy przez telefon.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Gdzie ustawić trójkąt na autostradzie?', a: '100 m za autem. Do miejsca ustawienia idź po drugiej stronie bariery.' },
      { q: 'Czy można holować auto na autostradzie?', a: 'Nie, poza pojazdami pomocy drogowej, które przewożą auto do najbliższego zjazdu lub MOP-u.' },
      { q: 'Jaki numer przy awarii na autostradzie?', a: 'Na drogach zarządzanych przez GDDKiA – 19 111, w nagłej sytuacji – 112. Można też skorzystać z kolumny SOS, które stoją co ok. 2 km.' }
    ],
    powiazane: ['korytarz-zycia-jazda-na-suwak', 'wypadek-z-rannymi', 'odstep-na-autostradzie'],
    zrodla: [Z.awaria, Z.prd]
  },
  {
    slug: 'jazda-we-mgle',
    kategoria: 'bezpieczenstwo',
    ikona: 'mgla',
    tytul: 'Jazda we mgle – jakie światła włączyć i kiedy tylne przeciwmgłowe',
    krotko: 'Jazda we mgle',
    opis: 'Jakie światła są obowiązkowe, kiedy wolno włączyć tylne przeciwmgłowe i jak jechać bezpiecznie.',
    liczby: [
      { w: '< 50 m', o: 'widoczność – dopiero wtedy tylne przeciwmgłowe' },
      { w: '100 zł', o: 'przednie przeciwmgłowe przy dobrej widoczności' },
      { w: '2 pkt', o: 'punkty karne za to samo' }
    ],
    sekcje: [
      {
        id: 'swiatla',
        t: 'Jakie światła',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Światła mijania lub przednie przeciwmgłowe', o: 'Przy zmniejszonej przejrzystości powietrza (mgła, gęsty opad) musisz mieć włączone światła mijania albo przednie przeciwmgłowe – albo oba naraz (art. 30 ust. 1 Prawa o ruchu drogowym). Same światła do jazdy dziennej nie wystarczą – zwykle nie świecą z tyłu.' },
              { t: 'Tylne przeciwmgłowe – tylko poniżej 50 m', o: 'Wolno je włączyć, gdy widoczność spada poniżej 50 m. Gdy mgła się przerzedzi – od razu je wyłącz, bo oślepiają kierowcę za Tobą (art. 30 ust. 3).' },
              { t: 'Przednich przeciwmgłowych nie używaj przy dobrej widoczności', o: 'Także w zwykłym deszczu. Grozi za to 100 zł i 2 punkty karne.' }
            ]
          }
        ]
      },
      {
        id: 'jak-jechac',
        t: 'Jak jechać we mgle',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'zwolnij tak, żeby zatrzymać się na odcinku, który widzisz,',
              'zwiększ odstęp od auta przed sobą – nie „trzymaj się” jego tylnych świateł,',
              'nie wyprzedzaj, jeśli nie widzisz, co jedzie z naprzeciwka,',
              'nie włączaj świateł drogowych – odbijają się od mgły i oślepiają Ciebie,',
              'gdy musisz się zatrzymać – zjedź jak najdalej od jezdni i włącz światła awaryjne.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Kiedy można włączyć tylne światło przeciwmgłowe?', a: 'Gdy mgła lub inny powód ogranicza widoczność do mniej niż 50 m. Po poprawie widoczności trzeba je od razu wyłączyć.' },
      { q: 'Jaki jest mandat za światła przeciwmgłowe?', a: 'Za przednie przeciwmgłowe przy dobrej widoczności: 100 zł i 2 punkty karne.' }
    ],
    powiazane: ['odstep-na-autostradzie', 'awaria-na-autostradzie'],
    zrodla: [Z.mgla, Z.prd]
  }
];
export function poradnik(slug: string): Poradnik | undefined {
  return PORADNIKI.find((p) => p.slug === slug);
}

export function poradnikiKategorii(k: KategoriaPoradnika): Poradnik[] {
  return PORADNIKI.filter((p) => p.kategoria === k);
}

// ───────────── SEO i podsumowania ─────────────
// seoTytul: krótszy tytuł do Google (z dopiskiem „| MotoFormat” mieści się w ok. 60 znakach).
// seoOpis: opis w wynikach wyszukiwania (ok. 140–160 znaków). skrot: 3 zdania „W skrócie” na górze strony.
export const AKTUALIZACJA = '2026-11-03';
export const OPUBLIKOWANO = '2026-11-03';

const DODATKI: Record<string, { seoTytul: string; seoOpis: string; skrot: string[] }> = {
  'umowa-kupna-sprzedazy-samochodu': {
    seoTytul: 'Umowa kupna-sprzedaży auta – wzór PDF do druku',
    seoOpis: 'Darmowy wzór umowy kupna-sprzedaży samochodu: wypełnij w przeglądarce, wydrukuj albo zapisz PDF. Co musi zawierać umowa, rękojmia i podatek PCC.',
    skrot: [
      'Umowę spisujecie sami – notariusz nie jest potrzebny, wystarczą dwa podpisane egzemplarze.',
      'Data na umowie uruchamia terminy: 14 dni na PCC-3 oraz 30 dni na rejestrację i zgłoszenie sprzedaży.',
      'Między osobami prywatnymi rękojmię można wyłączyć, ale nie chroni to sprzedawcy, który zataił wadę.'
    ]
  },
  'kupilem-auto-co-dalej': {
    seoTytul: 'Kupiłem auto – PCC, rejestracja i OC: terminy',
    seoOpis: 'Co zrobić po kupnie używanego auta: PCC-3 w 14 dni (2%), rejestracja w 30 dni pod karą 500 zł i co dalej z OC poprzedniego właściciela.',
    skrot: [
      'W 14 dni: deklaracja PCC-3 i 2% od wartości rynkowej – nie płacisz przy zakupie na fakturę z VAT.',
      'W 30 dni: wniosek o rejestrację. Spóźnienie kosztuje 500 zł, a po 180 dniach 1000 zł.',
      'OC sprzedającego chroni Cię do końca okresu, ale samo się nie odnowi – zapisz sobie datę.'
    ]
  },
  'sprzedalem-auto-co-dalej': {
    seoTytul: 'Sprzedałem auto – co zgłosić i do kiedy',
    seoOpis: 'Po sprzedaży auta masz 30 dni na zgłoszenie w urzędzie (kara 250 zł) i 14 dni na powiadomienie ubezpieczyciela OC. Lista rzeczy do przekazania kupującemu.',
    skrot: [
      'Urząd: zawiadomienie o sprzedaży w ciągu 30 dni, inaczej 250 zł kary.',
      'Ubezpieczyciel OC: powiadomienie w 14 dni – do tego czasu odpowiadasz za składki razem z kupującym.',
      'Tablice, dowód rejestracyjny i polisa zostają z autem – oddajesz je kupującemu.'
    ]
  },
  'wypowiedzenie-oc': {
    seoTytul: 'Wypowiedzenie OC – wzór pisma i terminy',
    seoOpis: 'Kiedy możesz wypowiedzieć OC: koniec okresu (art. 28), podwójne OC (art. 28a) albo po kupnie auta (art. 31). Wypełnij wzór i wydrukuj lub zapisz PDF.',
    skrot: [
      'Nie chcesz przedłużenia? Pismo musi trafić do ubezpieczyciela najpóźniej dzień przed końcem polisy.',
      'Masz dwa OC na jedno auto? Wypowiedz to, które odnowiło się samo – dostaniesz zwrot za resztę okresu.',
      'Kupiłeś auto z polisą sprzedawcy? Możesz ją wypowiedzieć w każdej chwili – ale najpierw kup nową.'
    ]
  },
  'kolizja-bez-policji': {
    seoTytul: 'Kolizja bez policji – wzór oświadczenia sprawcy',
    seoOpis: 'Stłuczka bez rannych? Sprawdź, kiedy nie musisz wzywać policji, co zrobić na miejscu, i wypełnij oświadczenie sprawcy kolizji do druku lub PDF.',
    skrot: [
      'Nikt nie jest ranny, sprawca jest trzeźwy, przyznaje się i ma OC? Policja nie jest potrzebna.',
      'Zdjęcia zrób, zanim przestawicie auta – potem zjedźcie z jezdni, tego wymagają przepisy.',
      'Oświadczenie w 2 egzemplarzach, podpisane przez obu kierowców, wystarczy do wypłaty z OC sprawcy.'
    ]
  },
  'wypadek-z-rannymi': {
    seoTytul: 'Wypadek z rannymi – obowiązki kierowcy',
    seoOpis: 'Co zrobić, gdy w wypadku są ranni: zabezpieczenie miejsca, gdzie postawić trójkąt, co powiedzieć dyspozytorowi 112, pierwsza pomoc i czego nie robić.',
    skrot: [
      'Najpierw Twoje bezpieczeństwo: światła awaryjne, kamizelka, trójkąt – dopiero potem telefon na 112.',
      'Pomóż tak, jak potrafisz. Wezwanie służb i bycie przy rannym to już udzielenie pomocy.',
      'Nie przestawiaj aut i zostań na miejscu, dopóki nie przyjedzie policja.'
    ]
  },
  'sprawca-uciekl-brak-oc': {
    seoTytul: 'Sprawca uciekł lub bez OC – odszkodowanie z UFG',
    seoOpis: 'Gdy sprawca uciekł albo jeździł bez OC, odszkodowanie wypłaca UFG. Sprawdź warunki (14 dni leczenia, 300 euro), co zrobić na miejscu i gdzie zgłosić szkodę.',
    skrot: [
      'Wezwij policję i zapisz każdy szczegół – nawet fragment tablicy rejestracyjnej się przyda.',
      'Nieznany sprawca: za auto UFG płaci tylko wtedy, gdy ktoś leczył się ponad 14 dni, i odlicza 300 euro.',
      'Szkodę zgłaszasz u dowolnego ubezpieczyciela OC – musi ją przyjąć i przekazać do UFG.'
    ]
  },
  'zderzenie-ze-zwierzeciem': {
    seoTytul: 'Zderzenie z sarną lub dzikiem – kto zapłaci',
    seoOpis: 'Potrąciłeś dzikie zwierzę? Co zrobić na miejscu, po co wzywać policję i kiedy zapłaci AC, zarządca drogi albo koło łowieckie. Znaczenie znaku A-18b.',
    skrot: [
      'Zatrzymaj się, zabezpiecz miejsce i wezwij policję – notatka to podstawa do odszkodowania.',
      'Własne OC nie pomoże. Najpewniejsze jest AC, o ile obejmuje zderzenie ze zwierzęciem.',
      'Stał znak A-18b? Odszkodowanie od zarządcy drogi jest wtedy praktycznie wykluczone.'
    ]
  },
  'korytarz-zycia-jazda-na-suwak': {
    seoTytul: 'Korytarz życia i jazda na suwak – zasady',
    seoOpis: 'Jak poprawnie tworzyć korytarz życia na 2 i 3 pasach i jak jeździć na suwak przy zwężeniu. Obowiązkowe od 2019 r. – prosto wyjaśnione krok po kroku.',
    skrot: [
      'Korytarz robisz, gdy ruch zwalnia i tworzy się zator – nie czekaj na syrenę.',
      'Lewy pas zjeżdża w lewo, wszystkie pozostałe w prawo – także pas środkowy.',
      'Na suwak: jedziesz kończącym się pasem do samego zwężenia i tam włączasz się naprzemiennie.'
    ]
  },
  'odstep-na-autostradzie': {
    seoTytul: 'Odstęp na autostradzie – zasada pół licznika',
    seoOpis: 'Minimalny odstęp na autostradzie i ekspresówce to połowa prędkości w metrach. Tabela odległości, mandat 300–500 zł i 5 pkt oraz prosty sposób na pomiar.',
    skrot: [
      'Odstęp w metrach to co najmniej połowa prędkości w km/h – przy 120 km/h to 60 m.',
      'Zasada obowiązuje na autostradach i drogach ekspresowych, ale nie w trakcie wyprzedzania.',
      'Za jazdę na zderzaku grozi 300–500 zł i 5 punktów karnych.'
    ]
  },
  'fotelik-dla-dziecka-przepisy': {
    seoTytul: 'Fotelik dla dziecka – przepisy, wzrost i kary',
    seoOpis: 'Do jakiego wzrostu dziecko musi jeździć w foteliku, kiedy wystarczą pasy (135 cm), fotelik z przodu a poduszka powietrzna i kary: 300 zł i 5 pkt za dziecko.',
    skrot: [
      'Liczy się wzrost, nie wiek: do 150 cm dziecko jedzie w foteliku albo na podstawce.',
      'Fotelik tyłem do kierunku jazdy z przodu – tylko przy wyłączonej poduszce powietrznej.',
      'Kara jest liczona za każde dziecko osobno: 300 zł i 5 punktów.'
    ]
  },
  'awaria-na-autostradzie': {
    seoTytul: 'Awaria na autostradzie – co zrobić po kolei',
    seoOpis: 'Auto stanęło na autostradzie lub ekspresówce? Gdzie czekać na pomoc, jak daleko postawić trójkąt, pod jaki numer dzwonić (19 111, 112) i czego nie robić.',
    skrot: [
      'Wysiądź od strony bariery i czekaj za nią – nie przy aucie i nie na pasie awaryjnym.',
      'Trójkąt stawiasz 100 m za autem. Słupki przy drodze pomogą odmierzyć odległość.',
      'Pomoc: 19 111 na drogach GDDKiA, w nagłej sytuacji 112. Holowanie na lince jest zakazane.'
    ]
  },
  'jazda-we-mgle': {
    seoTytul: 'Jazda we mgle – jakie światła włączyć',
    seoOpis: 'Kiedy włączyć tylne światło przeciwmgłowe (widoczność poniżej 50 m), czy wystarczą światła dzienne i za co grozi mandat 100 zł. Jak jechać bezpiecznie we mgle.',
    skrot: [
      'We mgle musisz mieć włączone światła mijania lub przednie przeciwmgłowe – same dzienne nie wystarczą.',
      'Tylne przeciwmgłowe włączasz dopiero, gdy widać mniej niż 50 m, i wyłączasz, gdy mgła rzednie.',
      'Przednie przeciwmgłowe przy dobrej widoczności to 100 zł i 2 punkty karne.'
    ]
  }
};

export function seoPoradnika(p: Poradnik) {
  const d = DODATKI[p.slug];
  return { tytul: d?.seoTytul || p.tytul, opis: d?.seoOpis || p.opis, skrot: d?.skrot || [] };
}

/** Szacowany czas czytania (ok. 200 słów na minutę – tekst poradnikowy czyta się wolniej) */
export function czasCzytania(p: Poradnik): number {
  const teksty: string[] = [p.opis];
  for (const s of p.sekcje)
    for (const b of s.bloki) {
      if (b.typ === 'p' || b.typ === 'uwaga') teksty.push(b.t);
      if (b.typ === 'lista') teksty.push(...b.elementy);
      if (b.typ === 'kroki') teksty.push(...b.elementy.map((e) => `${e.t} ${e.o}`));
      if (b.typ === 'liczby') teksty.push(...b.elementy.map((e) => `${e.w} ${e.o}`));
    }
  for (const f of p.faq || []) teksty.push(f.q, f.a);
  const slowa = teksty.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(slowa / 200));
}

/** Następny poradnik w tej samej kategorii (po ostatnim – pierwszy z kolejnej kategorii) */
export function nastepnyPoradnik(p: Poradnik): Poradnik {
  const i = PORADNIKI.findIndex((x) => x.slug === p.slug);
  return PORADNIKI[(i + 1) % PORADNIKI.length];
}

/** Polska typografia: pojedyncze litery (i, w, z…) nie zostają na końcu linii, a myślnik nie zaczyna nowej */
export function typo(t: string): string {
  return t.replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ').replace(/ – /g, ' – ');
}
