import type { Dzial } from './typy';

// Akcesoria zimowe – poradnik zakupowy + linki do porównania cen na Ceneo.
// Fakty prawne sprawdzone 27.11.2026 (źródła na dole strony).
export const ZIMOWE: Dzial = {
  slug: 'zimowe',
  nazwa: 'Akcesoria zimowe',
  seoTytul: 'Akcesoria zimowe do auta – co kupić',
  seoOpis: 'Skrobaczka, odmrażacz, zimowy płyn, kable i booster – co naprawdę przyda się zimą w aucie, na co patrzeć przy zakupie i czego unikać. Porównaj ceny.',
  tytul: 'Akcesoria zimowe do auta',
  opis: 'Co warto wozić zimą w samochodzie, na co patrzeć przy zakupie i czego unikać. Bez przepłacania – ceny porównasz jednym kliknięciem.',
  fakty: ['11 rzeczy, które się przydają', 'Przepisy i mandaty', 'Porównanie cen na Ceneo'],
  aktualizacja: '2026-11-27',
  wstep: [
    'Zima najczęściej zaskakuje kierowców rano: zamarznięta szyba, zaspany akumulator i pusty zbiornik spryskiwaczy. Większość takich kłopotów rozwiązuje kilka niedrogich rzeczy, które mieszczą się w bagażniku albo w drzwiach.',
    'Poniżej znajdziesz listę podzieloną na trzy grupy: podstawę, którą powinien mieć każdy, rzeczy, które warto dokupić, oraz wyposażenie na wyjazd w góry. Przy każdej rzeczy piszemy, na co patrzeć przy zakupie i jakiego błędu nie popełnić.'
  ],
  produkty: [
    {
      id: 'skrobaczka',
      nazwa: 'Skrobaczka do szyb',
      grupa: 'podstawa',
      poCo: 'Podstawowe narzędzie do zdrapania lodu i szronu z szyb i lusterek. Bez niej zostaje karta płatnicza i zmarznięte palce.',
      jakWybrac: ['Szerokie, twarde ostrze z tworzywa – łatwiej zdrapuje gruby lód', 'Druga strona z „ząbkami” do kruszenia grubej warstwy', 'Wersja z rękawicą albo dłuższym trzonkiem, jeśli masz duże auto'],
      unikaj: 'Nie skrob lusterek ani szyb metalem i nie używaj skrobaczki z wyszczerbionym ostrzem – rysuje szkło.',
      szukaj: 'skrobaczka do szyb'
    },
    {
      id: 'szczotka',
      nazwa: 'Szczotka do śniegu',
      grupa: 'podstawa',
      poCo: 'Do zmiecenia śniegu z dachu, maski, świateł i tablic. Odśnieżenie całego auta to obowiązek, a nie tylko szyby przed kierowcą.',
      jakWybrac: ['Miękkie włosie, które nie rysuje lakieru', 'Gumowa ściągaczka do mokrego śniegu', 'Teleskopowy trzonek do SUV-a, busa albo auta z bagażnikiem dachowym'],
      unikaj: 'Nie zostawiaj śniegu na dachu – przy hamowaniu zsuwa się na szybę, a w czasie jazdy spada na auto za Tobą.',
      szukaj: 'szczotka do śniegu samochodowa'
    },
    {
      id: 'odmrazacz',
      nazwa: 'Odmrażacz do szyb',
      grupa: 'podstawa',
      poCo: 'Spray, który w kilka chwil rozpuszcza szron i cienki lód. Przydaje się zwłaszcza, gdy śpieszysz się rano.',
      jakWybrac: ['Spray z atomizerem – łatwiej dozować niż z pompką', 'Wersja ze skrobaczką w zakrętce', 'Kupuj produkty znanych producentów z pełnym opisem składu'],
      unikaj: 'Nigdy nie polewaj zamarzniętej szyby gorącą wodą – nagła zmiana temperatury może ją pęknąć.',
      szukaj: 'odmrażacz do szyb',
      powiazany: { nazwa: 'Zima w samochodzie – poradnik', adres: '/poradniki/zima-w-samochodzie/' }
    },
    {
      id: 'plyn',
      nazwa: 'Zimowy płyn do spryskiwaczy',
      grupa: 'podstawa',
      poCo: 'Letni płyn zamarza już przy lekkim mrozie i może uszkodzić zbiornik, pompkę lub przewody. Zimowy płyn wymień jesienią, zanim przyjdą przymrozki.',
      jakWybrac: ['Temperatura krzepnięcia co najmniej −20°C, w górach i na wschodzie kraju lepiej niższa', 'Gotowy płyn albo koncentrat do rozcieńczenia – sprawdź proporcje na etykiecie', 'Opakowanie 5 l wystarcza zwykle na kilka tankowań zbiornika'],
      unikaj: 'Unikaj płynów z nieznanego źródła – w kontrolach zdarzają się takie z niedozwoloną ilością trującego metanolu.',
      szukaj: 'zimowy płyn do spryskiwaczy'
    },
    {
      id: 'kable',
      nazwa: 'Kable rozruchowe',
      grupa: 'podstawa',
      poCo: 'Pozwalają odpalić auto z rozładowanym akumulatorem od innego samochodu. Tanie, a ratują poranek.',
      jakWybrac: ['Grubsze przewody lepiej przewodzą prąd – do dużych silników i diesli wybieraj grube kable', 'Długość co najmniej 3 m, żeby sięgnąć między autami', 'Mocne, dobrze izolowane zaciski'],
      unikaj: 'Nie podłączaj kabli w przypadkowej kolejności – zasady bezpiecznego odpalania opisaliśmy w poradniku o akumulatorze.',
      szukaj: 'kable rozruchowe',
      powiazany: { nazwa: 'Jak odpalić auto z kabli', adres: '/poradniki/akumulator-zima-odpalanie-z-kabli/' }
    },
    {
      id: 'booster',
      nazwa: 'Booster (jump starter)',
      grupa: 'warto',
      poCo: 'Przenośny akumulator, który odpala auto bez drugiego samochodu. Dobre rozwiązanie, gdy parkujesz sam albo często jeździsz na krótkich trasach.',
      jakWybrac: ['Dopasowany do pojemności i rodzaju silnika – producent podaje, do jakich aut się nadaje', 'Zabezpieczenie przed odwrotnym podłączeniem i zwarciem', 'Sprawdź, czy da się go ładować z USB i czy ma latarkę'],
      unikaj: 'Nie wierz ślepo najwyższym liczbom „prądu szczytowego” na pudełku – patrz, do jakich silników producent go poleca.',
      szukaj: 'jump starter booster samochodowy',
      powiazany: { nazwa: 'Akumulator zimą – poradnik', adres: '/poradniki/akumulator-zima-odpalanie-z-kabli/' }
    },
    {
      id: 'prostownik',
      nazwa: 'Prostownik automatyczny',
      grupa: 'warto',
      poCo: 'Doładowuje akumulator w garażu albo pod domem. Przydaje się, gdy auto długo stoi albo jeździsz głównie krótkie odcinki.',
      jakWybrac: ['Automatyczny – sam kończy ładowanie i podtrzymuje akumulator', 'Tryb do akumulatorów AGM/EFB, jeśli auto ma system start-stop', 'Prąd ładowania dobrany do pojemności akumulatora'],
      unikaj: 'Prosty prostownik bez automatyki łatwo przeładowuje akumulator – nie zostawiaj go podłączonego bez kontroli.',
      szukaj: 'prostownik automatyczny samochodowy'
    },
    {
      id: 'mata',
      nazwa: 'Mata na szybę przednią',
      grupa: 'warto',
      poCo: 'Zakładana wieczorem chroni szybę przed szronem i śniegiem. Rano zdejmujesz ją razem ze śniegiem i jedziesz.',
      jakWybrac: ['Mocowanie klapkami w drzwiach albo na magnesach', 'Zasłania też wycieraczki, żeby nie przymarzły', 'Rozmiar pasujący do szyby – osobne wersje do aut osobowych i SUV-ów'],
      unikaj: 'Nie zakładaj maty na mokrą szybę przy mrozie – może do niej przymarznąć.',
      szukaj: 'mata na szybę samochodową zimowa'
    },
    {
      id: 'uszczelki',
      nazwa: 'Silikon do uszczelek i odmrażacz do zamków',
      grupa: 'warto',
      poCo: 'Silikon chroni gumowe uszczelki przed przymarzaniem, więc drzwi nie „sklejają się” po mrozie. Odmrażacz do zamków przydaje się w starszych autach z kluczykiem.',
      jakWybrac: ['Silikon w sztyfcie albo sprayu – wystarczy przetrzeć uszczelki raz na kilka tygodni', 'Odmrażacz do zamków trzymaj w kieszeni lub w domu, nie w zamkniętym aucie'],
      unikaj: 'Nie szarp zamarzniętych drzwi na siłę – łatwo zerwać uszczelkę albo uszkodzić klamkę.',
      szukaj: 'silikon do uszczelek samochodowych'
    },
    {
      id: 'dywaniki',
      nazwa: 'Gumowe dywaniki z rantem',
      grupa: 'warto',
      poCo: 'Zatrzymują wodę ze stopionego śniegu i sól. Chronią wykładzinę przed wilgocią, przez którą szyby parują od środka.',
      jakWybrac: ['Wysoki rant, żeby woda nie wylewała się na wykładzinę', 'Dopasowane do modelu auta albo uniwersalne do przycięcia', 'Mocowanie dywanika kierowcy, żeby nie zsuwał się pod pedały'],
      unikaj: 'Nie kładź gumowego dywanika na fabrycznym – przesuwa się i może zablokować pedał.',
      szukaj: 'dywaniki gumowe samochodowe z rantem'
    },
    {
      id: 'lancuchy',
      nazwa: 'Łańcuchy śniegowe',
      grupa: 'gory',
      poCo: 'Na zaśnieżonych drogach w górach mogą być obowiązkowe (znak C-18). Poza takimi drogami przydają się przy głębokim śniegu.',
      jakWybrac: ['Rozmiar dobrany do rozmiaru opon – sprawdzisz go z boku opony', 'System szybkiego montażu, jeśli zakładasz je rzadko', 'Sprawdź w instrukcji auta, czy producent pozwala na łańcuchy przy Twoich kołach'],
      unikaj: 'Przećwicz zakładanie w domu – na poboczu przy mrozie i w ciemności to dużo trudniejsze.',
      szukaj: 'łańcuchy śniegowe na koła',
      powiazany: { nazwa: 'Sprawdź rozmiar i ceny opon', adres: '/dobor-opon/' }
    }
  ],
  przepisy: {
    tytul: 'Przepisy, o których warto pamiętać zimą',
    punkty: [
      'Auto ma być odśnieżone tak, żeby nie ograniczało widoczności i nie zagrażało innym – także dach, maska, światła i tablice (art. 66 Prawa o ruchu drogowym). Policja podaje, że za nieodśnieżone auto mandat może sięgnąć 3000 zł.',
      'Łańcuchy śniegowe wolno zakładać tylko na drogach pokrytych śniegiem. Na odcinkach ze znakiem C-18 są obowiązkowe na co najmniej dwóch kołach napędowych – za ich brak grozi mandat 200 zł.',
      'Od 9 maja 2019 r. w UE nie wolno sprzedawać konsumentom płynów do spryskiwaczy i odmrażaczy do szyb z metanolem w stężeniu 0,6% lub wyższym. Metanol to trucizna.'
    ]
  },
  poradniki: ['zima-w-samochodzie', 'akumulator-zima-odpalanie-z-kabli'],
  narzedzia: [
    { nazwa: 'Dobór opon i ceny', opis: 'Opony zimowe w Twoim rozmiarze – porównaj marki i ceny.', adres: '/dobor-opon/' },
    { nazwa: 'Opony – kiedy wymienić', opis: 'Zasada 7°C, bieżnik i wiek opony.', adres: '/opony/' },
    { nazwa: 'Przypomnienie o oponach', opis: 'E-mail przed sezonem wymiany opon.', adres: '/przypomnienia/' }
  ],
  pytania: [
    { q: 'Co trzeba mieć w samochodzie zimą?', a: 'Przepisy nie wymagają specjalnego zimowego wyposażenia, ale w praktyce przydają się: skrobaczka, szczotka do śniegu, zimowy płyn do spryskiwaczy i kable rozruchowe. Na wyjazd w góry warto dorzucić łańcuchy śniegowe – na drogach ze znakiem C-18 są obowiązkowe.' },
    { q: 'Czy można odśnieżać auto na włączonym silniku?', a: 'Nie. Przepisy zabraniają pozostawiania pracującego silnika na postoju dłużej niż jedną minutę w terenie zabudowanym, więc grzanie auta przy odśnieżaniu może skończyć się mandatem. Lepiej najpierw odśnieżyć, a potem uruchomić silnik i ruszyć.' },
    { q: 'Booster czy kable rozruchowe?', a: 'Kable są tanie, ale potrzebujesz drugiego auta. Booster odpala samochód bez pomocy innych, za to jest droższy i trzeba pamiętać o jego ładowaniu. Jeśli często parkujesz sam albo jeździsz na krótkich trasach, booster jest wygodniejszy.' },
    { q: 'Skąd pochodzą ceny?', a: 'Przyciski „Porównaj ceny” prowadzą do porównywarki Ceneo, gdzie widzisz aktualne oferty wielu sklepów. To linki partnerskie – za przejście do sklepu możemy dostać prowizję, ale nie zmienia to ceny dla Ciebie.' }
  ],
  zrodla: [
    { nazwa: 'Prawo o ruchu drogowym (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970980602' },
    { nazwa: 'Wrocław.pl – mandat za nieodśnieżony samochód do 3 tys. zł', url: 'https://www.wroclaw.pl/dla-mieszkanca/mandat-za-nieodsniezony-samochod-do-3-tys-zl' },
    { nazwa: 'Rozporządzenie w sprawie znaków i sygnałów drogowych, § 42 (znak C-18)', url: 'https://lexlege.pl/znaki-dr/paragraf-42/' },
    { nazwa: 'LINK4 – mandaty zimą, w tym za brak łańcuchów przy znaku C-18', url: 'https://www.link4.pl/blog/czy-mozna-dostac-mandat-za-brak-opon-zimowych-odpowiadamy' },
    { nazwa: 'Rozporządzenie Komisji (UE) 2018/589 – metanol w płynach do spryskiwaczy', url: 'https://eur-lex.europa.eu/eli/reg/2018/589/oj' },
    { nazwa: 'UOKiK – kontrola zimowych płynów do spryskiwaczy', url: 'https://uokik.gov.pl/Download/1749' }
  ]
};
