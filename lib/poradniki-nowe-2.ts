// Nowe poradniki – część 2: kierowca na co dzień (punkty, fotoradar, SCT) i eksploatacja (kontrolki, akumulator, opony).
import type { Poradnik } from '@/lib/poradniki';
import type { DodatekSeo } from '@/lib/poradniki-nowe';

const Z = {
  punktyOtomoto: { n: 'Otomoto – jak skasować punkty karne w 2026 r. (kurs, limity, zmiany od 3 czerwca)', url: 'https://www.otomoto.pl/news/jak-skasowac-punkty-karne-w-2026-r' },
  punktyAutoSwiat: { n: 'Auto Świat – po jakim czasie kasują się punkty karne (2026)', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/punkty-karne-w-2026-r-po-jakim-czasie-sie-kasuja-kierowcy-wprowadzaja-w-blad/sr0pdnx' },
  prd: { n: 'Prawo o ruchu drogowym (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970980602' },
  fotoradarUniqa: { n: 'UNIQA – mandat z fotoradaru: po jakim czasie przychodzi i jak go zapłacić', url: 'https://www.uniqa.pl/porady-komunikacja/mandat-z-fotoradaru-po-jakim-czasie-przychodzi-jak-go-zaplacic/' },
  fotoradarProjekt: { n: 'Autocentrum – projekt obniżki mandatu z fotoradaru o 25% (sierpień 2026)', url: 'https://www.autocentrum.pl/newsy/mandat-z-fotoradaru-bedzie-o-25-proc-nizszy-kierowca-musi-spelnic-jeden-warunek/' },
  canard: { n: 'GITD – Centrum Automatycznego Nadzoru nad Ruchem Drogowym (CANARD)', url: 'https://www.canard.gitd.gov.pl/' },
  kw: { n: 'Kodeks wykroczeń (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19710120114' },
  kable: { n: 'CUK – jak uruchomić samochód za pomocą kabli rozruchowych', url: 'https://cuk.pl/porady/samochod-kable-rozruchowe' },
  warunkiTechniczne: { n: 'Rozporządzenie w sprawie warunków technicznych pojazdów (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20160002022' },
  oponyZimowe: { n: 'Auto Świat – czy opony zimowe są w Polsce obowiązkowe', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/opony-zimowe-obowiazkowe-w-polsce-juz-za-rok-co-z-calorocznymi/1bfnmn6' },
  oponyWarta: { n: 'Warta – aktualne przepisy dotyczące opon zimowych', url: 'https://www.warta.pl/porada/aktualne-przepisy-dotyczace-opon-zimowych-jakie-sa-wymogi-i-kiedy-nalezy-je-stosowac/' },
  sctWarszawa: { n: 'Warszawa 19115 – Strefa Czystego Transportu: zasady, etapy, zwolnienia', url: 'https://warszawa19115.pl/pl/-/strefa-czystego-transportu-sct' },
  sctKrakowRadio: { n: 'Radio Kraków – Strefa Czystego Transportu w Krakowie: wszystko, co musisz wiedzieć', url: 'https://www.radiokrakow.pl/aktualnosci/krakow/strefa-czystego-transportu-krakow-wszystko-co-musisz-wiedziec' },
  sctKrakowAutoSwiat: { n: 'Auto Świat – SCT w Warszawie i w Krakowie (luty 2026)', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/strefa-czystego-transportu-w-warszawie-i-sct-w-krakowie-co-tak-zezlilo-kierowcow-z/23vr00d' },
  sctPolska: { n: 'Trans.info – strefy czystego transportu w Polsce w 2026 r.', url: 'https://trans.info/pl/strefy-czystego-transportu-w-polsce-2026-447422' }
};

export const NOWE_2: Poradnik[] = [
  // ───────────── Punkty karne ─────────────
  {
    slug: 'punkty-karne-jak-sprawdzic',
    kategoria: 'codzienne',
    ikona: 'punkty',
    tytul: 'Punkty karne – jak sprawdzić, kiedy znikają i jak działa kurs',
    krotko: 'Punkty karne',
    opis: 'Punkty karne kasują się po roku od zapłaty mandatu, a limit to 24 punkty (20 w pierwszym roku z prawem jazdy). Zobacz, jak sprawdzić swoje punkty w mObywatelu i co zmieniło się w kursach redukujących od 3 czerwca 2026 r.',
    liczby: [
      { w: '24 pkt', o: 'limit dla kierowcy z prawem jazdy dłużej niż rok' },
      { w: '20 pkt', o: 'limit w pierwszym roku z prawem jazdy' },
      { w: '1 rok', o: 'od zapłaty mandatu punkty znikają' }
    ],
    sekcje: [
      {
        id: 'jak-sprawdzic',
        t: 'Jak sprawdzić punkty karne',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'W aplikacji mObywatel', o: 'W usłudze „Pojazdy i punkty karne” (lub w sekcji prawa jazdy) zobaczysz aktualną liczbę punktów, punkty tymczasowe i listę wykroczeń.' },
              { t: 'Na stronie gov.pl', o: 'Usługa „Sprawdź swoje punkty karne” działa po zalogowaniu profilem zaufanym, e-dowodem albo bankowością elektroniczną.' },
              { t: 'Sprawdź ponownie po kilku dniach', o: 'Dane w systemie aktualizują się z opóźnieniem. Po nowym mandacie zajrzyj tam jeszcze raz za kilka dni.' }
            ]
          },
          {
            typ: 'link',
            t: 'Taryfikator mandatów i punktów 2026',
            o: 'Policz mandat i punkty za prędkość i inne wykroczenia.',
            href: '/mandaty/'
          }
        ]
      },
      {
        id: 'kiedy-znikaja',
        t: 'Kiedy punkty karne znikają',
        bloki: [
          {
            typ: 'p',
            t: 'Punkty kasują się po roku – ale nie od dnia wykroczenia, tylko od dnia zapłaty mandatu. W 2022 r. ten okres wydłużono do dwóch lat, a we wrześniu 2023 r. wrócił roczny termin. Dlatego wielu kierowców wciąż powtarza nieaktualne informacje.'
          },
          {
            typ: 'lista',
            elementy: [
              'płacisz mandat w ratach – rok liczy się od zapłaty ostatniej raty,',
              'odmówiłeś przyjęcia mandatu – punkty są tymczasowe, dopóki sąd nie wyda prawomocnego wyroku,',
              'nie zapłaciłeś mandatu – punkty nie znikną, dopóki tego nie zrobisz.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Płać mandaty od razu. Zwlekanie z zapłatą przesuwa w czasie moment, w którym punkty znikną – a w tym czasie możesz zebrać kolejne.'
          }
        ]
      },
      {
        id: 'limity',
        t: 'Limit punktów i co się dzieje po jego przekroczeniu',
        bloki: [
          {
            typ: 'p',
            t: 'Kierowca, który ma prawo jazdy dłużej niż rok, może mieć najwyżej 24 punkty. W pierwszym roku od zdania egzaminu limit wynosi 20 punktów. Przekroczenie limitu oznacza utratę prawa jazdy.'
          },
          {
            typ: 'lista',
            elementy: [
              'młody kierowca po przekroczeniu 20 punktów traci prawo jazdy i musi przejść całą procedurę od nowa – z kursem i egzaminem,',
              'doświadczony kierowca po przekroczeniu 24 punktów dostaje skierowanie na egzamin kontrolny, a często także na badanie psychologiczne,',
              'niezależnie od punktów prawo jazdy traci się na 3 miesiące za przekroczenie prędkości o ponad 50 km/h w terenie zabudowanym, a od 3 marca 2026 r. także na drodze jednojezdniowej dwukierunkowej poza terenem zabudowanym.'
            ]
          }
        ]
      },
      {
        id: 'kurs',
        t: 'Kurs redukujący punkty – zasady od 3 czerwca 2026',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '6 pkt', o: 'najstarszych punktów kasuje kurs' },
              { w: 'co 6 mies.', o: 'można z niego skorzystać' },
              { w: 'ok. 1000 zł', o: 'kosztuje kurs w WORD' }
            ]
          },
          {
            typ: 'p',
            t: 'Kurs w wojewódzkim ośrodku ruchu drogowego trwa jeden dzień i ma część teoretyczną oraz praktyczną. Mogą z niego skorzystać kierowcy z prawem jazdy dłużej niż rok, którzy nie przekroczyli limitu punktów.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Od 3 czerwca 2026 r. kurs obejmuje tylko punkty za wykroczenia z zamkniętej listy. Za przekroczenie prędkości o więcej niż 30 km/h punktów nie zredukujesz – zostaną na koncie do czasu, aż same znikną.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Po jakim czasie kasują się punkty karne w 2026 roku?', a: 'Po roku od dnia zapłaty mandatu. Nie liczy się data wykroczenia ani data wystawienia mandatu, tylko data zapłaty.' },
      { q: 'Gdzie sprawdzę swoje punkty karne?', a: 'W aplikacji mObywatel albo w usłudze „Sprawdź swoje punkty karne” na gov.pl po zalogowaniu profilem zaufanym lub bankowością.' },
      { q: 'Ile punktów karnych może mieć kierowca?', a: 'Najwyżej 24 punkty. W pierwszym roku od uzyskania prawa jazdy limit wynosi 20 punktów.' },
      { q: 'Czy kurs w WORD skasuje punkty za każde wykroczenie?', a: 'Nie. Od 3 czerwca 2026 r. kurs dotyczy tylko wykroczeń z zamkniętej listy. Punktów za przekroczenie prędkości o ponad 30 km/h nie da się nim zredukować.' }
    ],
    powiazane: ['mandat-z-fotoradaru-co-zrobic', 'kontrola-drogowa-prawa-kierowcy', 'zgubiony-dowod-rejestracyjny-prawo-jazdy'],
    zrodla: [Z.punktyOtomoto, Z.punktyAutoSwiat, Z.prd]
  },

  // ───────────── Mandat z fotoradaru ─────────────
  {
    slug: 'mandat-z-fotoradaru-co-zrobic',
    kategoria: 'codzienne',
    ikona: 'fotoradar',
    tytul: 'Mandat z fotoradaru – co zrobić z listem i wezwaniem',
    krotko: 'Mandat z fotoradaru',
    opis: 'List z fotoradaru to zwykle najpierw wezwanie do wskazania kierowcy, a nie mandat. Zobacz, ile masz czasu na odpowiedź, jakie masz trzy możliwości i co grozi za zignorowanie pisma.',
    liczby: [
      { w: '2–6 tyg.', o: 'zwykle tyle idzie list po zdjęciu' },
      { w: '7 dni', o: 'na odesłanie oświadczenia' },
      { w: '180 dni', o: 'na wszczęcie sprawy przez GITD' }
    ],
    sekcje: [
      {
        id: 'kto-wysyla',
        t: 'Kto wysyła listy z fotoradaru',
        bloki: [
          {
            typ: 'p',
            t: 'Większość zdjęć z fotoradarów stacjonarnych i odcinkowych pomiarów prędkości obsługuje CANARD, czyli Centrum Automatycznego Nadzoru nad Ruchem Drogowym przy Głównym Inspektoracie Transportu Drogowego. Mandaty z mobilnych urządzeń wystawia też policja. Straż miejska i gminna od 2016 r. nie może już mierzyć prędkości fotoradarami.'
          },
          {
            typ: 'p',
            t: 'List przychodzi najczęściej po 2–6 tygodniach. Brak listu po kilku tygodniach nie oznacza, że sprawa przepadła – GITD ma 180 dni od wykroczenia na rozpoczęcie postępowania. Jeśli auto jest w leasingu albo z wypożyczalni, pismo najpierw trafia do firmy, więc trwa to dłużej.'
          }
        ]
      },
      {
        id: 'trzy-mozliwosci',
        t: 'Dostałeś wezwanie – masz trzy możliwości',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Przyznajesz, że to Ty prowadziłeś', o: 'Wypełniasz oświadczenie i przyjmujesz mandat. Dostaniesz go pocztą (albo elektronicznie) z numerem konta do zapłaty. Punkty trafiają na Twoje konto po uprawomocnieniu mandatu.' },
              { t: 'Wskazujesz innego kierowcę', o: 'Podajesz dane osoby, która prowadziła auto. Wezwanie trafi do niej. Właściciel ma obowiązek wskazać, komu powierzył auto – wynika to z Prawa o ruchu drogowym.' },
              { t: 'Odmawiasz wskazania kierowcy', o: 'To osobne wykroczenie. Sprawa trafia do sądu, a grzywna może być wyższa niż sam mandat za prędkość. Punktów karnych za to nie ma, ale kosztów jest zwykle więcej.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Odeślij oświadczenie w ciągu 7 dni. Zignorowanie pisma nie zamyka sprawy – zwykle kończy się wnioskiem do sądu.'
          }
        ]
      },
      {
        id: 'ile-zaplacisz',
        t: 'Ile zapłacisz za przekroczenie prędkości',
        bloki: [
          {
            typ: 'p',
            t: 'Kwoty są takie same jak przy mandacie od policji: od 50 zł i 1 punktu za przekroczenie do 10 km/h, przez 400 zł i 7 punktów za 26–30 km/h, do 2500 zł i 15 punktów za ponad 70 km/h. Przy przekroczeniu o ponad 30 km/h powtórzonym w ciągu dwóch lat kwota jest podwójna.'
          },
          {
            typ: 'link',
            t: 'Kalkulator mandatu za prędkość',
            o: 'Wpisz, o ile przekroczyłeś prędkość – pokażemy kwotę i punkty.',
            href: '/mandaty/'
          },
          {
            typ: 'p',
            t: 'Mandat płacisz wyłącznie na konto podane w piśmie – przelewem, w banku albo na poczcie. W sierpniu 2026 r. trwały prace nad przepisami, które obniżyłyby mandat z fotoradaru o 25% przy szybkiej zapłacie, ale na razie to tylko projekt.'
          }
        ]
      },
      {
        id: 'przedawnienie',
        t: 'Przedawnienie i jak sprawdzić, gdzie stoją fotoradary',
        bloki: [
          {
            typ: 'p',
            t: 'Karalność wykroczenia ustaje po roku od jego popełnienia. Jeśli w tym czasie wszczęto postępowanie, termin wydłuża się do dwóch lat. Nie licz jednak na przedawnienie – GITD zwykle zdąża z pismem.'
          },
          {
            typ: 'link',
            t: 'Mapa fotoradarów i odcinkowych pomiarów prędkości',
            o: 'Sprawdź, gdzie na Twojej trasie stoją urządzenia.',
            href: '/fotoradary/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile czasu mam na odpowiedź na list z fotoradaru?', a: 'Oświadczenie o tym, kto prowadził auto, odeślij w ciągu 7 dni od otrzymania wezwania.' },
      { q: 'Co grozi za niewskazanie kierowcy?', a: 'To osobne wykroczenie. Sprawa trafia do sądu, a grzywna może być wyższa niż mandat za samą prędkość.' },
      { q: 'Czy straż miejska może wysłać mandat z fotoradaru?', a: 'Nie. Od 2016 r. straż miejska i gminna nie mierzy prędkości fotoradarami. Mandaty z fotoradarów wystawia GITD (CANARD) lub policja.' },
      { q: 'Kiedy mandat z fotoradaru się przedawnia?', a: 'Po roku od wykroczenia, a jeśli wszczęto postępowanie – po dwóch latach.' }
    ],
    powiazane: ['punkty-karne-jak-sprawdzic', 'kontrola-drogowa-prawa-kierowcy', 'wyjazd-autem-za-granice'],
    zrodla: [Z.fotoradarUniqa, Z.canard, Z.prd, Z.kw, Z.fotoradarProjekt]
  },

  // ───────────── Kontrolki ─────────────
  {
    slug: 'kontrolki-w-samochodzie',
    kategoria: 'eksploatacja',
    ikona: 'kontrolka',
    tytul: 'Kontrolki w samochodzie – co oznaczają kolory i kiedy natychmiast się zatrzymać',
    krotko: 'Kontrolki na desce',
    opis: 'Czerwona kontrolka to sygnał „zatrzymaj się”, żółta – „sprawdź wkrótce”, zielona i niebieska – informacja. Zobacz, które kontrolki są groźne, co oznacza migający check engine i jak nie dopuścić do kosztownej awarii.',
    liczby: [
      { w: 'czerwona', o: 'zatrzymaj się bezpiecznie i wyłącz silnik' },
      { w: 'żółta', o: 'jedź spokojnie i umów warsztat' },
      { w: 'zielona', o: 'informacja, że coś jest włączone' }
    ],
    sekcje: [
      {
        id: 'kolory',
        t: 'Kolory kontrolek – prosta zasada',
        bloki: [
          {
            typ: 'p',
            t: 'Producenci aut stosują ten sam kod kolorów co na sygnalizatorze. Czerwony oznacza poważny problem, który może uszkodzić silnik albo zagrażać bezpieczeństwu. Żółty lub pomarańczowy – usterkę, którą trzeba sprawdzić, ale zwykle można dojechać do warsztatu. Zielony i niebieski tylko informują, że coś działa, np. światła mijania albo drogowe.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Po przekręceniu kluczyka większość kontrolek zapala się na chwilę – to test żarówek i czujników. Niepokój powinna budzić kontrolka, która nie gaśnie po uruchomieniu silnika albo zapala się w czasie jazdy.'
          }
        ]
      },
      {
        id: 'czerwone',
        t: 'Czerwone kontrolki – zatrzymaj się',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Ciśnienie oleju (olejarka)', o: 'Silnik może się zatrzeć w ciągu kilku minut. Zatrzymaj się, wyłącz silnik i sprawdź poziom oleju. Nie jedź dalej, jeśli kontrolka nie gaśnie.' },
              { t: 'Temperatura płynu chłodzącego', o: 'Silnik się przegrzewa. Zatrzymaj się i wyłącz silnik. Nie odkręcaj zbiorniczka na gorąco – płyn jest pod ciśnieniem i może poparzyć.' },
              { t: 'Akumulator (ładowanie)', o: 'Alternator nie ładuje akumulatora. Auto pojedzie jeszcze chwilę na zapasie prądu. Wyłącz zbędne odbiorniki i jedź prosto do warsztatu, jeśli to blisko.' },
              { t: 'Hamulce (wykrzyknik w kółku)', o: 'Może oznaczać zaciągnięty hamulec ręczny, ale też za niski poziom płynu hamulcowego. Jeśli hamulec ręczny jest zwolniony – nie jedź dalej.' },
              { t: 'Poduszka powietrzna', o: 'System może nie zadziałać przy wypadku. Auto jest jezdne, ale usterkę trzeba usunąć jak najszybciej.' }
            ]
          }
        ]
      },
      {
        id: 'zolte',
        t: 'Żółte kontrolki – sprawdź w warsztacie',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'check engine (silnik) świeci stale – usterka układu silnika lub emisji spalin; jedź spokojnie i podłącz auto do komputera diagnostycznego,',
              'check engine miga – zwykle wypadanie zapłonów; zwolnij i nie przyspieszaj gwałtownie, bo niespalone paliwo może zniszczyć katalizator,',
              'ABS – hamulce działają, ale bez systemu zapobiegającego blokowaniu kół; zachowaj większy odstęp,',
              'ESP / kontrola trakcji – miganie w czasie jazdy oznacza, że system właśnie działa (np. na śliskiej drodze); stałe świecenie – usterkę,',
              'ciśnienie w oponach (TPMS) – sprawdź ciśnienie przy najbliższej okazji; spadek może oznaczać przebitą oponę,',
              'świece żarowe (spiralka w dieslu) – miganie w czasie jazdy oznacza usterkę silnika, a nie świec,',
              'filtr cząstek stałych (DPF) – filtr jest zapchany; zwykle pomaga dłuższa jazda trasą ze stałą prędkością.'
            ]
          },
          {
            typ: 'link',
            t: 'Sprawdź kod błędu z komputera',
            o: 'Wpisz kod (np. P0300) i zobacz, co oznacza i czy można jechać dalej.',
            href: '/kody-bledow/'
          }
        ]
      },
      {
        id: 'co-robic',
        t: 'Co zrobić, gdy kontrolka zapali się w czasie jazdy',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Sprawdź kolor', o: 'Czerwona – szukaj bezpiecznego miejsca, żeby się zatrzymać. Żółta – możesz jechać dalej, ale spokojnie.' },
              { t: 'Zatrzymaj się bezpiecznie', o: 'Na autostradzie zjedź na pas awaryjny tylko wtedy, gdy musisz. Włącz światła awaryjne i postaw trójkąt.' },
              { t: 'Zajrzyj do instrukcji', o: 'Symbol może różnić się między markami. Instrukcja (często też w wersji elektronicznej w aucie) mówi dokładnie, co robić.' },
              { t: 'Zapisz kod błędu', o: 'Warsztat odczyta go komputerem. Tanie czytniki OBD pozwalają sprawdzić kod samemu.' }
            ]
          },
          {
            typ: 'link',
            t: 'Awaria na autostradzie – jak się zachować',
            o: 'Pas awaryjny, trójkąt, kamizelka i bezpieczne miejsce za barierą.',
            href: '/poradniki/awaria-na-autostradzie/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy mogę jechać z zapaloną kontrolką check engine?', a: 'Jeśli świeci stale, a auto jedzie normalnie – zwykle tak, spokojnie do warsztatu. Jeśli miga albo auto traci moc, zwolnij i jak najszybciej zatrzymaj się, bo może dojść do uszkodzenia katalizatora.' },
      { q: 'Co oznacza czerwona kontrolka oleju?', a: 'Za niskie ciśnienie oleju. Silnik może się szybko zatrzeć, dlatego od razu zatrzymaj się i wyłącz silnik.' },
      { q: 'Dlaczego miga kontrolka ESP?', a: 'Miganie w czasie jazdy oznacza, że system właśnie stabilizuje auto, np. na śliskiej nawierzchni. Stałe świecenie oznacza usterkę albo wyłączony system.' },
      { q: 'Co oznacza kontrolka z wykrzyknikiem w oponie?', a: 'System kontroli ciśnienia (TPMS) wykrył spadek ciśnienia w co najmniej jednym kole. Sprawdź ciśnienie i oglądnij opony.' }
    ],
    powiazane: ['akumulator-zima-odpalanie-z-kabli', 'awaria-na-autostradzie', 'przeglad-techniczny-terminy-koszt'],
    zrodla: [Z.prd, Z.warunkiTechniczne]
  },

  // ───────────── Akumulator zimą ─────────────
  {
    slug: 'akumulator-zima-odpalanie-z-kabli',
    kategoria: 'eksploatacja',
    ikona: 'akumulator',
    tytul: 'Akumulator zimą – jak sprawdzić i jak bezpiecznie odpalić auto z kabli',
    krotko: 'Akumulator i kable',
    opis: 'Mróz to największy wróg akumulatora. Zobacz, jak sprawdzić jego stan zwykłym miernikiem, w jakiej kolejności podłączyć kable rozruchowe i czego nie robić, żeby nie uszkodzić elektroniki.',
    liczby: [
      { w: '12,6 V', o: 'naładowany akumulator w spoczynku' },
      { w: '12,2 V', o: 'mniej więcej połowa pojemności' },
      { w: '4 kroki', o: 'podłączenia kabli w dobrej kolejności' }
    ],
    sekcje: [
      {
        id: 'dlaczego-zima',
        t: 'Dlaczego akumulator pada właśnie zimą',
        bloki: [
          {
            typ: 'p',
            t: 'W niskiej temperaturze reakcje chemiczne w akumulatorze zachodzą wolniej, więc może on oddać mniej prądu. Jednocześnie zimny silnik z gęstym olejem potrzebuje więcej energii do rozruchu, a my włączamy ogrzewanie szyb, foteli i światła. Akumulator, który latem jeszcze dawał radę, w pierwszy mroźny poranek może odmówić posłuszeństwa.'
          },
          {
            typ: 'p',
            t: 'Najbardziej narażone są auta jeżdżące na krótkich odcinkach. Alternator nie zdąży wtedy uzupełnić energii zużytej na rozruch. Przy jeździe głównie po mieście warto raz na jakiś czas pojechać dłuższą trasą albo doładować akumulator prostownikiem.'
          }
        ]
      },
      {
        id: 'jak-sprawdzic',
        t: 'Jak sprawdzić akumulator miernikiem',
        bloki: [
          {
            typ: 'p',
            t: 'Wystarczy tani multimetr. Pomiar zrób przy wyłączonym silniku, najlepiej kilka godzin po jeździe. Czerwony przewód miernika przyłóż do bieguna plus, czarny do minusa.'
          },
          {
            typ: 'liczby',
            elementy: [
              { w: '12,6–12,7 V', o: 'akumulator naładowany' },
              { w: 'ok. 12,4 V', o: 'warto doładować' },
              { w: 'poniżej 12,2 V', o: 'mocno rozładowany – naładuj i sprawdź' }
            ]
          },
          {
            typ: 'p',
            t: 'Napięcie pokazuje stopień naładowania, ale nie mówi wszystkiego o kondycji. Stary akumulator może pokazywać dobre napięcie, a mimo to nie mieć siły na rozruch. Warsztat lub sklep z akumulatorami sprawdzi go testerem obciążeniowym, często za darmo.'
          }
        ]
      },
      {
        id: 'kable',
        t: 'Jak odpalić auto z kabli – kolejność',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Plus do rozładowanego akumulatora', o: 'Czerwony kabel podłącz najpierw do bieguna plus (+) w aucie z rozładowanym akumulatorem.' },
              { t: 'Plus do sprawnego akumulatora', o: 'Drugi koniec czerwonego kabla podłącz do plusa w aucie, które daje prąd.' },
              { t: 'Minus do sprawnego akumulatora', o: 'Czarny kabel podłącz do bieguna minus (–) w aucie dawcy.' },
              { t: 'Minus do masy w aucie z rozładowanym akumulatorem', o: 'Drugi koniec czarnego kabla podłącz do niemalowanego metalu silnika lub nadwozia z dala od akumulatora (albo do punktu masy wskazanego w instrukcji).' }
            ]
          },
          {
            typ: 'p',
            t: 'Uruchom silnik w aucie dawcy i odczekaj kilka minut. Potem spróbuj odpalić auto z rozładowanym akumulatorem. Gdy zapali, odłącz kable w odwrotnej kolejności: najpierw czarny z masy, na końcu czerwony z akumulatora, który był rozładowany.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Nie dopuść do zetknięcia końcówek kabli. Nie podłączaj minusa bezpośrednio do rozładowanego akumulatora – może wydzielać łatwopalny gaz. Nigdy nie próbuj ładować ani odpalać zamarzniętego akumulatora (wybrzuszona obudowa, lód w środku).'
          }
        ]
      },
      {
        id: 'po-odpaleniu',
        t: 'Po odpaleniu – co dalej',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'jedź co najmniej 20–30 minut, najlepiej trasą – krótki odcinek nie naładuje akumulatora,',
              'jeśli problem się powtarza, naładuj akumulator prostownikiem i sprawdź go testerem,',
              'sprawdź, czy coś nie pobiera prądu po wyłączeniu auta (oświetlenie bagażnika, ładowarka, dodatkowe urządzenia),',
              'akumulator zwykle wytrzymuje kilka lat – przy wymianie dobierz pojemność i prąd rozruchu z instrukcji auta, a w autach ze start-stop typ AGM lub EFB.'
            ]
          },
          {
            typ: 'link',
            t: 'Zima w samochodzie – co trzeba wiedzieć',
            o: 'Odśnieżanie, mandaty, płyn do spryskiwaczy i co wozić w bagażniku.',
            href: '/poradniki/zima-w-samochodzie/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jakie napięcie powinien mieć sprawny akumulator?', a: 'Naładowany akumulator w spoczynku ma ok. 12,6–12,7 V. Przy ok. 12,4 V warto go doładować, a poniżej 12,2 V jest mocno rozładowany.' },
      { q: 'W jakiej kolejności podłączyć kable rozruchowe?', a: 'Czerwony do plusa rozładowanego akumulatora, potem do plusa sprawnego. Czarny do minusa sprawnego akumulatora, a drugi koniec do masy (metalu silnika) w aucie z rozładowanym akumulatorem. Odłączasz w odwrotnej kolejności.' },
      { q: 'Ile trzeba jeździć po odpaleniu z kabli?', a: 'Co najmniej 20–30 minut, najlepiej w trasie. Krótka jazda po mieście nie naładuje akumulatora.' },
      { q: 'Czy mogę odpalać z kabli auto hybrydowe lub elektryczne?', a: 'Tylko według instrukcji producenta. W wielu hybrydach jest specjalny punkt do podłączenia kabli, a niektóre auta nie mogą służyć jako dawca prądu.' }
    ],
    powiazane: ['zima-w-samochodzie', 'kontrolki-w-samochodzie', 'awaria-na-autostradzie'],
    zrodla: [Z.kable]
  },

  // ───────────── Opony – bieżnik ─────────────
  {
    slug: 'kiedy-wymienic-opony-bieznik',
    kategoria: 'eksploatacja',
    ikona: 'opona',
    tytul: 'Kiedy wymienić opony – minimalny bieżnik, wiek opony i data DOT',
    krotko: 'Kiedy wymienić opony',
    opis: 'Prawo pozwala jeździć na oponach z bieżnikiem 1,6 mm, ale na mokrej lub zaśnieżonej drodze to za mało. Zobacz, jak zmierzyć bieżnik, jak odczytać wiek opony z kodu DOT i kiedy wymiana jest naprawdę potrzebna.',
    liczby: [
      { w: '1,6 mm', o: 'minimalny bieżnik według przepisów' },
      { w: '4 mm', o: 'zalecane minimum dla opon zimowych' },
      { w: '3 mm', o: 'zalecane minimum dla opon letnich' }
    ],
    sekcje: [
      {
        id: 'bieznik',
        t: 'Minimalny bieżnik – przepisy i rozsądek',
        bloki: [
          {
            typ: 'p',
            t: 'Zgodnie z przepisami o warunkach technicznych pojazdów opona w samochodzie osobowym musi mieć bieżnik głębszy niż 1,6 mm. Na każdej oponie są wskaźniki zużycia (oznaczenie TWI na boku i małe wypustki w rowkach) – gdy bieżnik zrówna się z nimi, opona nadaje się do wymiany.'
          },
          {
            typ: 'p',
            t: 'Bieżnik odprowadza wodę i błoto pośniegowe. Im jest płytszy, tym łatwiej o poślizg i tym dłuższa droga hamowania na mokrym. Dlatego producenci opon i kluby motoryzacyjne zalecają wymianę opon letnich przy ok. 3 mm, a zimowych – przy ok. 4 mm.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Za łyse lub uszkodzone opony policja może dać mandat i zatrzymać dowód rejestracyjny, a diagnosta nie przepuści auta na przeglądzie. Przy wypadku zły stan opon może też utrudnić rozliczenie z AC.'
          }
        ]
      },
      {
        id: 'jak-zmierzyc',
        t: 'Jak zmierzyć bieżnik w 2 minuty',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Głębokościomierz', o: 'Kosztuje kilka złotych. Wsuń go w główny rowek bieżnika w kilku miejscach opony – po środku i przy krawędziach.' },
              { t: 'Wskaźniki TWI', o: 'Znajdź oznaczenie TWI lub trójkąt na boku opony i obejrzyj rowek naprzeciw. Jeśli wypustka jest na równi z bieżnikiem – czas na wymianę.' },
              { t: 'Sprawdź zużycie po bokach', o: 'Opona starta z jednej strony to znak złej geometrii kół albo złego ciśnienia. Nowe opony też szybko się zużyją, jeśli nie usuniesz przyczyny.' }
            ]
          }
        ]
      },
      {
        id: 'dot',
        t: 'Wiek opony – jak odczytać kod DOT',
        bloki: [
          {
            typ: 'p',
            t: 'Na boku opony znajdziesz napis DOT i ciąg znaków. Ostatnie cztery cyfry to data produkcji: dwie pierwsze to tydzień, dwie ostatnie – rok. Na przykład 3224 oznacza 32. tydzień 2024 r.'
          },
          {
            typ: 'p',
            t: 'Guma z czasem twardnieje, nawet gdy opona leży w garażu. Starsza opona z dobrym bieżnikiem może trzymać drogę gorzej niż nowa. Wiele firm oponiarskich radzi uważnie sprawdzać opony po 5–6 latach i nie używać ich dłużej niż ok. 10 lat od daty produkcji. Pęknięcia na boku albo między klockami bieżnika to sygnał do wymiany niezależnie od wieku.'
          },
          {
            typ: 'link',
            t: 'Jak czytać oznaczenia na oponie i ciśnienie z naklejki',
            o: 'Rozmiar, indeks nośności i prędkości, symbol zimowy – z grafikami.',
            href: '/opony/'
          }
        ]
      },
      {
        id: 'zimowe',
        t: 'Czy opony zimowe są w Polsce obowiązkowe?',
        bloki: [
          {
            typ: 'p',
            t: 'Nie. W listopadzie 2026 r. w Polsce nadal nie ma przepisu, który nakazuje jazdę na oponach zimowych w określonych miesiącach. Branża oponiarska od lat apeluje o taki obowiązek, ale nie został on wprowadzony. Obowiązek opon zimowych istnieje za to w części krajów, do których często jeździmy, m.in. w Niemczech i w Czechach – tam zimowe opony są wymagane, gdy na drodze panują zimowe warunki.'
          },
          {
            typ: 'p',
            t: 'Mimo braku obowiązku przy temperaturze poniżej ok. 7°C opony letnie twardnieją i gorzej trzymają drogę. Dlatego wymianę na zimowe warto zaplanować, gdy poranki zaczynają być chłodne.'
          },
          {
            typ: 'link',
            t: 'Wyjazd autem za granicę – przepisy w Europie',
            o: 'Opony zimowe, winiety, wyposażenie obowiązkowe w popularnych krajach.',
            href: '/poradniki/wyjazd-autem-za-granice/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jaki jest minimalny bieżnik opony w Polsce?', a: '1,6 mm. To minimum prawne. Dla bezpieczeństwa opony letnie warto wymienić przy ok. 3 mm, a zimowe przy ok. 4 mm.' },
      { q: 'Jak sprawdzić rok produkcji opony?', a: 'Znajdź na boku opony napis DOT. Ostatnie cztery cyfry to tydzień i rok produkcji, np. 3224 to 32. tydzień 2024 r.' },
      { q: 'Ile lat można jeździć na tych samych oponach?', a: 'Nie ma przepisu, który to określa. Producenci radzą uważnie sprawdzać opony po 5–6 latach i zwykle nie używać ich dłużej niż ok. 10 lat od produkcji.' },
      { q: 'Czy w Polsce jest obowiązek opon zimowych?', a: 'Nie. W listopadzie 2026 r. nie ma takiego przepisu. Zimowe opony są jednak wymagane w niektórych krajach Europy, np. w Niemczech i w Czechach przy zimowych warunkach na drodze.' }
    ],
    powiazane: ['zima-w-samochodzie', 'wyjazd-autem-za-granice', 'przeglad-techniczny-terminy-koszt'],
    zrodla: [Z.warunkiTechniczne, Z.oponyZimowe, Z.oponyWarta]
  },

  // ───────────── Strefy czystego transportu ─────────────
  {
    slug: 'strefa-czystego-transportu',
    kategoria: 'codzienne',
    ikona: 'strefa',
    tytul: 'Strefa czystego transportu – które miasta i jakie auta mogą wjechać',
    krotko: 'Strefy czystego transportu',
    opis: 'Strefy czystego transportu działają w Warszawie i w Krakowie. Sprawdź, jakie wymagania musi spełnić Twoje auto, kto jest zwolniony, ile kosztuje wjazd starym autem i jaka grozi kara.',
    liczby: [
      { w: '2', o: 'miasta ze strefą (Warszawa, Kraków)' },
      { w: '500 zł', o: 'maksymalna kara za wjazd bez uprawnień' },
      { w: '2028', o: 'kolejne zaostrzenie zasad w obu miastach' }
    ],
    sekcje: [
      {
        id: 'co-to',
        t: 'Czym jest strefa czystego transportu',
        bloki: [
          {
            typ: 'p',
            t: 'Strefa czystego transportu (SCT) to obszar miasta, do którego mogą wjeżdżać tylko auta spełniające określone normy emisji spalin – albo auta zwolnione z zasad. Kontrolę prowadzą straż miejska i policja na podstawie danych z centralnej ewidencji pojazdów (CEPiK). Auta spełniające wymagania nie potrzebują żadnej naklejki ani zgłoszenia.'
          },
          {
            typ: 'p',
            t: 'Wymagania zapisuje się normą Euro albo rokiem produkcji auta. Jeśli nie wiesz, jaką normę ma Twój silnik, wystarczy sprawdzić rok pierwszej rejestracji w dowodzie i porównać go z progiem dla danego miasta.'
          }
        ]
      },
      {
        id: 'warszawa',
        t: 'Warszawa – zasady w 2026 i 2027 r.',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'auta benzynowe i z LPG: co najmniej Euro 3 albo produkcja od 2000 r.,',
              'diesle: co najmniej Euro 5 albo produkcja od 2009 r.,',
              'mieszkańcy płacący podatki w Warszawie są zwolnieni do końca 2027 r., jeśli auto było ostatnio rejestrowane przed 1 stycznia 2024 r.,',
              'osoby, które do końca 2023 r. skończyły 70 lat, są zwolnione bezterminowo dla jednego auta, jeśli były jego właścicielem do 31 grudnia 2023 r.,',
              'kara za wjazd bez uprawnień: do 500 zł.'
            ]
          },
          {
            typ: 'p',
            t: 'Od 2028 r. wymagania rosną: benzyna co najmniej Euro 4 (od 2005 r.), diesel Euro 6 (od 2014 r.). Kolejne zaostrzenia zaplanowano na lata 2030 i 2032.'
          }
        ]
      },
      {
        id: 'krakow',
        t: 'Kraków – zasady od 1 stycznia 2026 r.',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'strefa obejmuje obszar wewnątrz IV obwodnicy – ok. 60% miasta,',
              'auta benzynowe: co najmniej Euro 4 (zwykle rocznik 2005 i nowsze),',
              'diesle: co najmniej Euro 6,',
              'mieszkańcy z meldunkiem w Krakowie są zwolnieni bezterminowo dla aut kupionych przed 26 czerwca 2025 r. – trzeba je zgłosić w systemie SCT,',
              'auta zarejestrowane za granicą trzeba zgłosić przed pierwszym wjazdem.'
            ]
          },
          {
            typ: 'liczby',
            elementy: [
              { w: '2,50 zł', o: 'za godzinę wjazdu starszym autem (2026)' },
              { w: '100 zł', o: 'abonament miesięczny w 2026 r.' },
              { w: '500 zł', o: 'abonament miesięczny w 2028 r.' }
            ]
          },
          {
            typ: 'p',
            t: 'Osoby spoza Krakowa mogą wjeżdżać autem niespełniającym norm za opłatą do końca 2028 r. W 2026 r. dzienna opłata to 5 zł, a w 2027 r. – 15 zł. Od 2029 r. płatny wjazd ma zniknąć. Miasto zapowiadało korekty tych zasad, więc przed wyjazdem sprawdź aktualne stawki na stronie strefy.'
          }
        ]
      },
      {
        id: 'inne-miasta',
        t: 'Inne miasta i jak się przygotować',
        bloki: [
          {
            typ: 'p',
            t: 'W innych miastach strefy na razie nie działają. Katowice w grudniu 2025 r. dostały obowiązek utworzenia strefy w związku z przekroczeniami norm jakości powietrza, ale prace są na etapie analiz. Kilka miast rozważa strefy w przyszłości.'
          },
          {
            typ: 'lista',
            elementy: [
              'kupujesz używane auto i często jeździsz do Warszawy lub Krakowa – sprawdź normę Euro przed zakupem, zwłaszcza w dieslu,',
              'w Krakowie niezwłocznie zgłoś auto do zwolnienia, jeśli Ci przysługuje,',
              'progi z lat 2028–2032 wpływają na cenę używanych aut – starszy diesel może trudniej się sprzedawać.'
            ]
          },
          {
            typ: 'link',
            t: 'Ile wart jest Twój samochód',
            o: 'Jak sprawdzić uczciwą cenę używanego auta przed zakupem lub sprzedażą.',
            href: '/poradniki/ile-jest-warte-uzywane-auto/'
          }
        ]
      }
    ],
    faq: [
      { q: 'W których miastach działa strefa czystego transportu?', a: 'W listopadzie 2026 r. strefy działają w Warszawie (od 2024 r., drugi etap od 2026 r.) i w Krakowie (od 1 stycznia 2026 r.).' },
      { q: 'Czy moje auto może wjechać do SCT w Warszawie?', a: 'W 2026 r. tak, jeśli auto benzynowe spełnia normę Euro 3 (lub jest z 2000 r. albo nowsze), a diesel – Euro 5 (lub jest z 2009 r. albo nowszy). Mieszkańcy płacący podatki w Warszawie mają zwolnienie do końca 2027 r.' },
      { q: 'Ile wynosi kara za wjazd do strefy czystego transportu?', a: 'Do 500 zł.' },
      { q: 'Czy w Krakowie mieszkańcy muszą zgłaszać auto?', a: 'Tak. Żeby skorzystać ze zwolnienia dla aut kupionych przed 26 czerwca 2025 r., trzeba zgłosić auto w systemie SCT.' }
    ],
    powiazane: ['benzyna-diesel-lpg-czy-hybryda', 'auto-elektryczne-ladowanie-koszty', 'ile-jest-warte-uzywane-auto'],
    zrodla: [Z.sctWarszawa, Z.sctKrakowRadio, Z.sctKrakowAutoSwiat, Z.sctPolska]
  }
];

export const DODATKI_2: Record<string, DodatekSeo> = {
  'punkty-karne-jak-sprawdzic': {
    seoTytul: 'Punkty karne 2026 – jak sprawdzić i kasować',
    seoOpis: 'Punkty karne znikają po roku od zapłaty mandatu. Jak sprawdzić punkty w mObywatelu, jakie są limity 24 i 20 pkt i co zmieniło się w kursie redukującym od czerwca 2026.',
    skrot: [
      'Punkty kasują się po roku od zapłaty mandatu, a nie od dnia wykroczenia.',
      'Limit to 24 punkty, a w pierwszym roku z prawem jazdy – 20.',
      'Od 3 czerwca 2026 r. kurs w WORD nie kasuje punktów za przekroczenie prędkości o ponad 30 km/h.'
    ]
  },
  'mandat-z-fotoradaru-co-zrobic': {
    seoTytul: 'Mandat z fotoradaru – co zrobić z wezwaniem',
    seoOpis: 'Dostałeś list z fotoradaru? Masz 7 dni na wskazanie kierowcy. Trzy możliwe odpowiedzi, kwoty mandatów, punkty, przedawnienie i co grozi za zignorowanie pisma.',
    skrot: [
      'Pierwszy list to zwykle wezwanie do wskazania kierowcy, a nie mandat.',
      'Odpowiedz w 7 dni: przyjmij mandat, wskaż kierowcę albo odmów – odmowa kończy się w sądzie.',
      'GITD ma 180 dni na wszczęcie sprawy, więc brak listu po kilku tygodniach nic nie oznacza.'
    ]
  },
  'kontrolki-w-samochodzie': {
    seoTytul: 'Kontrolki w samochodzie – co oznaczają',
    seoOpis: 'Czerwona, żółta czy zielona kontrolka? Co oznaczają najważniejsze kontrolki na desce rozdzielczej, kiedy natychmiast się zatrzymać i co zrobić, gdy miga check engine.',
    skrot: [
      'Czerwona kontrolka oznacza: zatrzymaj się bezpiecznie i wyłącz silnik.',
      'Żółta oznacza usterkę do sprawdzenia – zwykle można spokojnie dojechać do warsztatu.',
      'Migający check engine to sygnał, żeby zwolnić – może dojść do uszkodzenia katalizatora.'
    ]
  },
  'akumulator-zima-odpalanie-z-kabli': {
    seoTytul: 'Jak odpalić auto z kabli? Akumulator zimą',
    seoOpis: 'Jak sprawdzić akumulator miernikiem, w jakiej kolejności podłączyć kable rozruchowe i czego nie robić, żeby nie uszkodzić elektroniki. Prosty poradnik na zimę.',
    skrot: [
      'Naładowany akumulator w spoczynku ma ok. 12,6 V – poniżej 12,2 V jest mocno rozładowany.',
      'Kable: czerwony plus–plus, czarny minus dawcy, a drugi koniec do masy w aucie z rozładowanym akumulatorem.',
      'Po odpaleniu jedź co najmniej 20–30 minut, najlepiej trasą.'
    ]
  },
  'kiedy-wymienic-opony-bieznik': {
    seoTytul: 'Kiedy wymienić opony? Bieżnik i data DOT',
    seoOpis: 'Minimalny bieżnik to 1,6 mm, ale bezpieczniej wymienić opony letnie przy 3 mm, a zimowe przy 4 mm. Jak zmierzyć bieżnik, odczytać datę DOT i czy zimówki są obowiązkowe.',
    skrot: [
      'Prawo wymaga bieżnika powyżej 1,6 mm, ale na mokrej drodze to za mało.',
      'Ostatnie cztery cyfry kodu DOT to tydzień i rok produkcji opony.',
      'W Polsce nie ma obowiązku opon zimowych, ale poniżej ok. 7°C letnie trzymają gorzej.'
    ]
  },
  'strefa-czystego-transportu': {
    seoTytul: 'Strefa czystego transportu – zasady 2026',
    seoOpis: 'Strefy czystego transportu w Warszawie i Krakowie: jakie auta mogą wjechać w 2026 r., kto jest zwolniony, ile kosztuje wjazd starszym autem i jaka grozi kara.',
    skrot: [
      'SCT działają w Warszawie i w Krakowie – w innych miastach na razie ich nie ma.',
      'W Warszawie w 2026 r. wystarczy benzyna z normą Euro 3 lub diesel z Euro 5, a mieszkańcy mają zwolnienie do końca 2027 r.',
      'W Krakowie mieszkańcy muszą zgłosić auto, żeby skorzystać ze zwolnienia. Kara za wjazd bez uprawnień to do 500 zł.'
    ]
  }
};
