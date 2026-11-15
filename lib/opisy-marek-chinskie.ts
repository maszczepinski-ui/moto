// Ręczne opisy chińskich marek (SEO) – MG, Omoda, Jaecoo, BYD, Chery.
// Ceny z artykułów i cenników z lat 2025–2026: często promocyjne i szybko się zmieniają, dlatego zawsze z datą.
import type { OpisMarki } from '@/lib/opisy-marek';

const UWAGA_CENY =
  'Ceny „od” pochodzą z oficjalnych cenników i artykułów prasowych z lat 2025–2026 – często są to ceny promocyjne lub z debiutu. Chińskie marki bardzo często zmieniają cenniki i rabaty, więc przed wizytą w salonie sprawdź aktualną ofertę.';

export const OPISY_CHINSKIE: Record<string, OpisMarki> = {
  mg: {
    seoTytul: 'MG w Polsce – modele, ceny, gwarancja i opinie',
    seoOpis: 'MG w Polsce: hybrydowe SUV-y HS i ZS, miejskie MG3, elektryki i 7-osobowy S9. Historia marki, ceny, 7 lat gwarancji i liczba aut MG w CEPiK.',
    h1: 'MG w Polsce – modele, ceny, gwarancja i opinie',
    lead: 'MG to marka z brytyjskim rodowodem i chińskim właścicielem. W Polsce sprzedaje nowe auta od końca 2023 roku i w krótkim czasie stała się najpopularniejszą chińską marką w naszym kraju. Wyjaśniamy, skąd pochodzi, jakie modele oferuje, ile kosztują i na co uważać przy zakupie.',
    sekcje: [
      {
        h2: 'Skąd pochodzi MG – brytyjska marka w chińskich rękach',
        akapity: [
          'Nazwa MG pochodzi od Morris Garages – warsztatu z angielskiego Oksfordu, który w latach 20. XX wieku zaczął budować sportowe auta. Przez dziesięciolecia MG słynęło z małych, dwuosobowych roadsterów. Po upadku koncernu MG Rover w 2005 roku markę przejęli Chińczycy, a od 2007 roku należy ona do koncernu SAIC Motor z Szanghaju – jednego z największych producentów aut w Chinach.',
          'W polskiej bazie CEPiK wciąż można znaleźć auta MG z czasów brytyjskich, np. MG ZR z początku XXI wieku. To jednak margines – zdecydowana większość zarejestrowanych dziś aut MG to nowe modele z salonów, kupione po 2023 roku.'
        ]
      },
      {
        h2: 'MG w Polsce – od kiedy i jak się sprzedaje',
        akapity: [
          'MG wróciło do Polski z nowymi autami pod koniec 2023 roku. Na start marka kusiła niskimi cenami – SUV MG ZS kosztował przy debiucie mniej niż Dacia Duster – oraz 7-letnią gwarancją. Później MG postawiło na hybrydy: w pierwszym kwartale 2026 roku hybrydy stanowiły ok. 78% sprzedaży marki w Polsce, a MG było jednym z najczęściej wybieranych dostawców aut hybrydowych.',
          'Dwa modele odpowiadają za zdecydowaną większość sprzedaży: większy SUV MG HS i mniejszy MG ZS. Pozostałe – miejskie MG3, elektryczne MG4 i MGS5 oraz 7-osobowe MGS9 – są wyraźnie rzadsze.'
        ]
      },
      {
        h2: 'Gwarancja MG',
        akapity: [
          'Nowe auta MG są sprzedawane w Polsce z 7-letnią gwarancją (zwykle do 150 000 km). Na baterie w autach elektrycznych i hybrydowych producent daje osobną gwarancję. Szczegóły – limity kilometrów, warunki przeglądów – sprawdź w książce gwarancyjnej konkretnego modelu, bo różnią się między wersjami.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele MG w Polsce i ceny',
      wstep: 'Najważniejsze modele MG dostępne w polskich salonach. W tabeli podajemy rodzaj auta, napęd i cenę „od” z dostępnych źródeł.',
      modele: [
        { nazwa: 'MG HS', adres: '/marki/mg/hs/', typ: 'SUV kompaktowy (najpopularniejsze MG w Polsce)', naped: 'Benzyna turbo, hybryda, hybryda plug-in', cena: 'od 103 800 zł (2026)' },
        { nazwa: 'MG ZS', adres: '/marki/mg/zs/', typ: 'SUV miejski', naped: 'Benzyna, hybryda', cena: 'od 79 800 zł (cena z debiutu)' },
        { nazwa: 'MG3', adres: '/marki/mg/3/', typ: 'Hatchback miejski', naped: 'Benzyna, hybryda' },
        { nazwa: 'MG4', adres: '/marki/mg/4/', typ: 'Kompakt elektryczny', naped: 'Elektryczny' },
        { nazwa: 'MGS5', adres: '/marki/mg/s5/', typ: 'SUV elektryczny', naped: 'Elektryczny' },
        { nazwa: 'MGS9', adres: '/marki/mg/s9/', typ: 'Duży SUV, 7 miejsc', naped: 'Hybryda plug-in 299 KM', cena: 'od 172 900 zł (oferta startowa)' }
      ],
      uwaga: UWAGA_CENY
    },
    plusy: [
      'Atrakcyjne ceny i bogate wyposażenie w standardzie.',
      '7 lat gwarancji.',
      'Duży wybór hybryd, które w mieście palą niewiele.',
      'Najpopularniejsza chińska marka w Polsce – najwięcej aut na rynku wtórnym i coraz gęstsza sieć serwisów.'
    ],
    minusy: [
      'Nowe MG jeżdżą w Polsce od 2023 roku – brak danych o trwałości po wielu latach.',
      'Częste zmiany cen i rabatów utrudniają przewidzenie wartości auta przy odsprzedaży.',
      'Obsługa multimediów i systemów asystujących bywa krytykowana w testach jako mniej dopracowana niż u marek europejskich.',
      'Starsze MG z czasów brytyjskich (np. ZR) to zupełnie inne auta – części do nich bywają trudno dostępne.'
    ],
    faq: [
      { q: 'Czy MG to chińska marka?', a: 'MG ma brytyjskie korzenie (Morris Garages z Oksfordu), ale od 2007 roku należy do chińskiego koncernu SAIC Motor. Nowe modele MG są projektowane i produkowane głównie w Chinach.' },
      { q: 'Od kiedy MG sprzedaje auta w Polsce?', a: 'Nowe auta MG są sprzedawane w Polsce od końca 2023 roku. Starsze MG z czasów brytyjskich trafiały do Polski głównie jako auta sprowadzane.' },
      { q: 'Jaką gwarancję ma MG?', a: 'Nowe MG w Polsce mają 7 lat gwarancji (zwykle do 150 000 km). Warunki baterii w autach elektrycznych i hybrydowych są opisane osobno w książce gwarancyjnej.' },
      { q: 'Który model MG jest najpopularniejszy?', a: 'W Polsce najwięcej jest SUV-ów MG HS, a za nimi MG ZS. Te dwa modele to zdecydowana większość wszystkich zarejestrowanych aut MG.' },
      { q: 'Czy warto kupić MG?', a: 'MG daje dużo auta i wyposażenia za rozsądne pieniądze, a hybrydy są oszczędne w mieście. Ryzykiem jest krótka historia nowych MG w Polsce – nie wiadomo jeszcze, jak zniosą wiele lat jazdy i ile stracą na wartości. Przed zakupem porównaj ceny OC i sprawdź, gdzie jest najbliższy serwis.' }
    ],
    zrodla: [
      { nazwa: 'Otomoto News – MG zmienia strategię (maj 2026)', url: 'https://www.otomoto.pl/news/mg-zmienia-strategie-oml' },
      { nazwa: 'Auto Świat – nowe MG HS debiutuje w Polsce', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/nowe-mg-hs-wlasnie-debiutuje-w-polsce-i-juz-jest-w-promocji-doradzamy-ktora-wersje/68q2p0y' },
      { nazwa: 'AutoCentrum – MG tnie ceny hybryd', url: 'https://www.autocentrum.pl/newsy/mg-mocno-tnie-ceny-hybryd-rabaty-siegaja-15-tys-zl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  omoda: {
    seoTytul: 'Omoda w Polsce – modele, ceny, gwarancja, opinie',
    seoOpis: 'Omoda w Polsce: SUV Omoda 5 (benzyna, hybryda, elektryk), Omoda 7 i Omoda 9 Super Hybrid. Kto stoi za marką, ceny, 7 lat gwarancji i liczba aut w CEPiK.',
    h1: 'Omoda w Polsce – modele, ceny, gwarancja i opinie',
    lead: 'Omoda to młoda marka chińskiego koncernu Chery, która w Polsce sprzedaje auta od września 2024 roku. Jej SUV Omoda 5 szybko stał się jednym z najczęściej rejestrowanych chińskich aut w kraju. Sprawdziliśmy, co jest w ofercie, ile kosztuje i jak wygląda gwarancja.',
    sekcje: [
      {
        h2: 'Kto stoi za marką Omoda',
        akapity: [
          'Omoda należy do Chery – jednego z największych chińskich producentów samochodów i od lat największego eksportera aut z Chin. Chery stworzyło dwie siostrzane marki na rynki zagraniczne: Omoda (miejskie i nowocześnie stylizowane SUV-y) oraz Jaecoo (SUV-y w bardziej terenowym stylu). W Polsce obie marki sprzedawane są w tych samych salonach, jako Omoda & Jaecoo.',
          'Auta Omody korzystają z tej samej techniki co modele Chery: benzynowego silnika 1.6 turbo, hybryd i hybryd plug-in nazywanych „Super Hybrid” oraz wersji w pełni elektrycznych.'
        ]
      },
      {
        h2: 'Omoda w Polsce – start i sprzedaż',
        akapity: [
          'Omoda weszła do Polski we wrześniu 2024 roku z jednym modelem – Omodą 5. W ciągu roku Omoda & Jaecoo otworzyły ok. 40 punktów sprzedaży, a we wrześniu 2025 roku przekazały klientom 10-tysięczne auto. Od stycznia do września 2025 roku Omoda sprzedała w Polsce ponad 5 tys. aut.',
          'Najwięcej zarejestrowanych aut tej marki to Omoda 5, a drugim modelem jest duży SUV Omoda 9 z napędem hybrydowym plug-in.'
        ]
      },
      {
        h2: 'Gwarancja Omoda',
        akapity: [
          'Na nowe auta Omoda w Polsce obowiązuje 7 lat gwarancji lub 150 000 km. Baterie i silniki elektryczne w hybrydach oraz autach elektrycznych mają osobną gwarancję – zwykle 8 lat lub 160 000 km. Warunkiem są przeglądy w autoryzowanym serwisie.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele Omoda w Polsce i ceny',
      wstep: 'Oferta Omody w Polsce to SUV-y w różnych rozmiarach, z napędem benzynowym, hybrydowym, plug-in i elektrycznym.',
      modele: [
        { nazwa: 'Omoda 5', adres: '/marki/omoda/5/', typ: 'SUV kompaktowy (najpopularniejsza Omoda)', naped: 'Benzyna 1.6 turbo, automat' },
        { nazwa: 'Omoda 5 Hybrid', adres: '/marki/omoda/5/', typ: 'SUV kompaktowy', naped: 'Hybryda 224 KM', cena: 'od 119 500 zł (2025)' },
        { nazwa: 'Omoda E5', typ: 'SUV kompaktowy', naped: 'Elektryczny' },
        { nazwa: 'Omoda 7', adres: '/marki/omoda/7/', typ: 'SUV kompaktowy', naped: 'Hybryda plug-in (Super Hybrid)' },
        { nazwa: 'Omoda 9', adres: '/marki/omoda/9/', typ: 'Duży SUV, napęd 4x4', naped: 'Hybryda plug-in (Super Hybrid)' }
      ],
      uwaga: UWAGA_CENY
    },
    plusy: [
      'Bogate wyposażenie już w podstawowych wersjach.',
      '7 lat gwarancji i 8 lat na baterię.',
      'Duży wybór napędów: benzyna, hybryda, plug-in, elektryk.',
      'Gęsta jak na młodą markę sieć salonów (wspólnych z Jaecoo).'
    ],
    minusy: [
      'Marka jest w Polsce od 2024 roku – nie wiadomo jeszcze, jak auta zniosą wiele lat eksploatacji.',
      'Benzynowy silnik 1.6 turbo bez wspomagania elektrycznego potrafi dużo palić w mieście.',
      'Trudno przewidzieć, ile auto straci na wartości przy odsprzedaży.',
      'Częste zmiany cenników – ta sama wersja potrafi kosztować inaczej w kolejnych miesiącach.'
    ],
    faq: [
      { q: 'Czyja jest marka Omoda?', a: 'Omoda należy do chińskiego koncernu Chery. Jej siostrzaną marką jest Jaecoo – w Polsce obie sprzedawane są w tych samych salonach.' },
      { q: 'Od kiedy Omoda jest w Polsce?', a: 'Omoda weszła do Polski we wrześniu 2024 roku. Pierwszym modelem był SUV Omoda 5.' },
      { q: 'Jaką gwarancję ma Omoda?', a: '7 lat lub 150 000 km na auto. Baterie i silniki elektryczne w hybrydach i elektrykach mają gwarancję zwykle na 8 lat lub 160 000 km.' },
      { q: 'Ile kosztuje Omoda 5 Hybrid?', a: 'Przy debiucie jesienią 2025 roku Omoda 5 Hybrid kosztowała od 119 500 zł – tylko ok. 4 tys. zł więcej niż wersja benzynowa. Aktualne ceny sprawdź w salonie, bo zmieniają się często.' },
      { q: 'Czy warto kupić Omodę?', a: 'Omoda oferuje dużo wyposażenia i długą gwarancję w rozsądnej cenie. Minusem jest krótka historia marki – brak danych o trwałości i wartości aut po kilku latach. Wybierając wersję, warto rozważyć hybrydę, która w mieście pali wyraźnie mniej niż benzyniak.' }
    ],
    zrodla: [
      { nazwa: 'Chip.pl – Omoda & Jaecoo: 10 000 sprzedanych aut w Polsce (wrzesień 2025)', url: 'https://www.chip.pl/2025/09/omoda-jaecoo-10000-sprzedanych-aut-w-polsce' },
      { nazwa: 'AutoCentrum – Jaecoo 5 i Omoda 5 Hybrid już w Polsce, ceny', url: 'https://www.autocentrum.pl/publikacje/relacje/jaecoo-5-i-omoda-5-hybrid-juz-w-polsce-znamy-ceny-i-specyfikacje/' },
      { nazwa: 'Autobaza – Omoda 7 Super Hybrid w Polsce', url: 'https://www.autobaza.pl/page/news/omoda-7-super-hybrid-rusza-przedsprzedaz-w-polsce-cena-i-zasieg-1250-km/' }
    ],
    sprawdzono: '2026-11-15'
  },

  jaecoo: {
    seoTytul: 'Jaecoo w Polsce – modele, ceny, gwarancja, opinie',
    seoOpis: 'Jaecoo w Polsce: SUV-y Jaecoo 7, Jaecoo 5 i Jaecoo 8 – benzyna, hybrydy plug-in i elektryk. Kto stoi za marką, ceny, 7 lat gwarancji, liczba aut w CEPiK.',
    h1: 'Jaecoo w Polsce – modele, ceny, gwarancja i opinie',
    lead: 'Jaecoo to siostrzana marka Omody, należąca do chińskiego koncernu Chery. Stawia na SUV-y o kanciastej, lekko terenowej sylwetce. W Polsce jej najpopularniejszym modelem jest Jaecoo 7. Wyjaśniamy, czym Jaecoo różni się od Omody, ile kosztuje i jaką ma gwarancję.',
    sekcje: [
      {
        h2: 'Jaecoo i Omoda – czym się różnią',
        akapity: [
          'Obie marki należą do Chery i są sprzedawane w Polsce w tych samych salonach. Różnią się stylem: Omoda to nowoczesne, miejskie SUV-y, a Jaecoo – auta o bardziej pudełkowatej, „terenowej” sylwetce, kojarzącej się z dużymi SUV-ami premium. Pod spodem korzystają z tej samej techniki: silnika 1.6 turbo, hybryd plug-in „Super Hybrid” i napędów elektrycznych.',
          'Nazwa Jaecoo powstała z połączenia niemieckiego słowa „Jäger” (myśliwy) i angielskiego „cool”.'
        ]
      },
      {
        h2: 'Jaecoo w Polsce – start i sprzedaż',
        akapity: [
          'Jaecoo pojawiło się w Polsce razem z Omodą, a jego pierwszym modelem był SUV Jaecoo 7. To właśnie Jaecoo 7 było 10-tysięcznym autem przekazanym klientowi przez Omoda & Jaecoo w Polsce we wrześniu 2025 roku. Od stycznia do września 2025 roku Jaecoo sprzedało w Polsce ponad 4 tys. aut.',
          'Jesienią 2025 roku do oferty dołączył mniejszy Jaecoo 5 (także w wersji elektrycznej E5), a później większy Jaecoo 8.'
        ]
      },
      {
        h2: 'Gwarancja Jaecoo',
        akapity: [
          'Nowe Jaecoo mają w Polsce 7 lat gwarancji lub 150 000 km. Baterie w hybrydach plug-in i autach elektrycznych mają osobną gwarancję – zwykle 8 lat lub 160 000 km. Warunkiem są przeglądy w autoryzowanym serwisie.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele Jaecoo w Polsce i ceny',
      wstep: 'Oferta Jaecoo w Polsce to trzy SUV-y w różnych rozmiarach.',
      modele: [
        { nazwa: 'Jaecoo 5', adres: '/marki/jaecoo/5/', typ: 'SUV miejski', naped: '1.6 turbo 147 KM, automat', cena: 'od 109 900 zł (promocja, 2025)' },
        { nazwa: 'Jaecoo E5', typ: 'SUV miejski', naped: 'Elektryczny 211 KM, zasięg do 402 km', cena: 'od 139 900 zł (promocja, 2025)' },
        { nazwa: 'Jaecoo 7', adres: '/marki/jaecoo/7/', typ: 'SUV kompaktowy (najpopularniejsze Jaecoo)', naped: 'Benzyna 1.6 turbo, hybryda, hybryda plug-in' },
        { nazwa: 'Jaecoo 8', adres: '/marki/jaecoo/8/', typ: 'Duży SUV', naped: 'Hybryda plug-in' }
      ],
      uwaga: UWAGA_CENY
    },
    plusy: [
      'Wyrazisty, „terenowy” wygląd, który wyróżnia się na tle innych SUV-ów.',
      '7 lat gwarancji i 8 lat na baterię.',
      'Hybrydy plug-in z dużym zasięgiem na prądzie.',
      'Wspólna sieć salonów i serwisów z Omodą.'
    ],
    minusy: [
      'Mimo wyglądu to nie są prawdziwe terenówki – większość wersji ma napęd na przednie koła.',
      'Marka jest w Polsce od 2024 roku – brak danych o trwałości.',
      'Wartość przy odsprzedaży trudna do przewidzenia.',
      'Benzynowy silnik 1.6 turbo bez wspomagania hybrydowego potrafi sporo palić w mieście.'
    ],
    faq: [
      { q: 'Czyja jest marka Jaecoo?', a: 'Jaecoo należy do chińskiego koncernu Chery, tak jak Omoda. W Polsce obie marki sprzedawane są w tych samych salonach.' },
      { q: 'Czym Jaecoo różni się od Omody?', a: 'Głównie stylem: Jaecoo ma kanciaste SUV-y o terenowym wyglądzie, a Omoda – nowocześnie stylizowane auta miejskie. Technika pod spodem jest w dużej mierze wspólna.' },
      { q: 'Jaką gwarancję ma Jaecoo?', a: '7 lat lub 150 000 km na auto oraz zwykle 8 lat lub 160 000 km na baterię w hybrydach plug-in i elektrykach.' },
      { q: 'Ile kosztuje Jaecoo 5?', a: 'Benzynowy Jaecoo 5 kosztował w ofercie promocyjnej od 109 900 zł, a elektryczny Jaecoo E5 od 139 900 zł (ceny z 2025 roku). Aktualne ceny sprawdź w salonie.' },
      { q: 'Czy warto kupić Jaecoo?', a: 'Jaecoo to dobry wybór dla osób, które chcą wyróżniającego się SUV-a z długą gwarancją w rozsądnej cenie. Trzeba jednak pamiętać, że to młoda marka – nie wiadomo jeszcze, jak auta zniosą wiele lat jazdy. Jeśli dużo jeździsz po mieście, rozważ hybrydę zamiast benzyniaka.' }
    ],
    zrodla: [
      { nazwa: 'Chip.pl – Omoda & Jaecoo: 10 000 sprzedanych aut w Polsce', url: 'https://www.chip.pl/2025/09/omoda-jaecoo-10000-sprzedanych-aut-w-polsce' },
      { nazwa: 'AutoCentrum – Jaecoo 5 i Omoda 5 Hybrid już w Polsce, ceny', url: 'https://www.autocentrum.pl/publikacje/relacje/jaecoo-5-i-omoda-5-hybrid-juz-w-polsce-znamy-ceny-i-specyfikacje/' },
      { nazwa: 'Otomoto News – Jaecoo 7: którą wersję wybrać', url: 'https://www.otomoto.pl/news/jaecoo-7-ktora-wersje-wybrac' }
    ],
    sprawdzono: '2026-11-15'
  },

  byd: {
    seoTytul: 'BYD w Polsce – modele, ceny, gwarancja, opinie',
    seoOpis: 'BYD w Polsce: hybrydy plug-in Seal U DM-i, Seal 5 i Seal 6 oraz elektryki Dolphin, Atto 2, Seal i Sealion 7. Ceny, 6 lat gwarancji, 8 lat na baterię, liczba aut w CEPiK.',
    h1: 'BYD w Polsce – modele, ceny, gwarancja i opinie',
    lead: 'BYD to największy na świecie producent aut elektrycznych i hybryd plug-in, który zaczynał od produkcji baterii. W Polsce sprzedaje samochody osobowe od jesieni 2024 roku. Sprawdziliśmy, jakie modele oferuje, ile kosztują i jak wygląda gwarancja na auto i baterię.',
    sekcje: [
      {
        h2: 'Skąd pochodzi BYD',
        akapity: [
          'BYD (Build Your Dreams) powstał w 1995 roku w chińskim Shenzhen jako producent akumulatorów do telefonów. Samochody zaczął produkować w 2003 roku, a dziś jest największym na świecie producentem aut z napędem elektrycznym i hybrydowym plug-in. Baterie do swoich aut produkuje sam – to jego największa przewaga.',
          'Znakiem rozpoznawczym BYD jest bateria „Blade”, zbudowana z ogniw litowo-żelazowo-fosforanowych (LFP). Takie baterie są uważane za trwałe i bezpieczne, choć przy tej samej wadze mieszczą nieco mniej energii niż popularne w Europie baterie NMC.'
        ]
      },
      {
        h2: 'BYD w Polsce – start i oferta',
        akapity: [
          'BYD oficjalnie wszedł do Polski z autami osobowymi w październiku 2024 roku, z trzema elektrykami (Dolphin, Seal U, Seal) i hybrydą plug-in Seal U DM-i. Najpopularniejszym modelem BYD w Polsce jest właśnie Seal U – w 2026 roku importer zostawił go już tylko w wersji plug-in (218 lub 324 KM).',
          'Oferta szybko się zmienia: doszły m.in. mały elektryk Dolphin Surf, SUV Atto 2, hybrydowe Seal 5 i Seal 6 DM-i (także kombi) oraz SUV Sealion 7, a niektóre starsze modele zniknęły z cennika.'
        ]
      },
      {
        h2: 'Gwarancja BYD',
        akapity: [
          'Na nowe auta BYD w Polsce obowiązuje 6 lat gwarancji (do 150 000 km). Bateria trakcyjna ma gwarancję na 8 lat lub 200 000 km, a silnik elektryczny i jego sterownik – na 8 lat lub 150 000 km. Warunki mogą się różnić między modelami, więc sprawdź je w umowie.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele BYD w Polsce i ceny',
      wstep: 'Najważniejsze modele BYD zarejestrowane w Polsce. Oferta zmienia się szybko – część modeli może być już dostępna tylko z wyprzedaży.',
      modele: [
        { nazwa: 'BYD Seal U DM-i', adres: '/marki/byd/seal-u/', typ: 'SUV kompaktowy (najpopularniejszy BYD w Polsce)', naped: 'Hybryda plug-in 218 lub 324 KM', cena: 'od 169 900 zł (cennik katalogowy, 2026)' },
        { nazwa: 'BYD Dolphin / Dolphin Surf', adres: '/marki/byd/dolphin/', typ: 'Elektryk miejski', naped: 'Elektryczny' },
        { nazwa: 'BYD Atto 2', adres: '/marki/byd/atto-2/', typ: 'SUV miejski', naped: 'Elektryczny' },
        { nazwa: 'BYD Seal 5 DM-i', adres: '/marki/byd/seal-5/', typ: 'Sedan', naped: 'Hybryda plug-in' },
        { nazwa: 'BYD Seal 6 DM-i', adres: '/marki/byd/seal-6/', typ: 'Sedan i kombi', naped: 'Hybryda plug-in' },
        { nazwa: 'BYD Sealion 7', adres: '/marki/byd/sealion-7/', typ: 'Duży SUV', naped: 'Elektryczny' }
      ],
      uwaga: UWAGA_CENY
    },
    plusy: [
      'Producent z ogromnym doświadczeniem w bateriach – sam je produkuje.',
      'Bardzo długa gwarancja na baterię (8 lat lub 200 000 km).',
      'Hybrydy plug-in z dużym zasięgiem, tanie w jeździe przy regularnym ładowaniu.',
      'Szeroki wybór elektryków w różnych rozmiarach.'
    ],
    minusy: [
      'Marka jest w Polsce od 2024 roku – mniejsza sieć serwisów niż u starych marek.',
      'Częste zmiany oferty: modele szybko wchodzą i znikają z cennika.',
      'Auta elektryczne i plug-in tracą na wartości trudniej przewidywalnie niż spalinowe.',
      'Hybryda plug-in ma sens tylko przy regularnym ładowaniu – bez tego pali jak zwykła hybryda.'
    ],
    faq: [
      { q: 'Co znaczy nazwa BYD?', a: 'BYD to skrót od „Build Your Dreams” (zbuduj swoje marzenia). Firma powstała w 1995 roku w Shenzhen jako producent akumulatorów.' },
      { q: 'Od kiedy BYD jest w Polsce?', a: 'BYD sprzedaje samochody osobowe w Polsce od października 2024 roku.' },
      { q: 'Jaką gwarancję ma BYD?', a: '6 lat lub 150 000 km na auto, 8 lat lub 200 000 km na baterię oraz 8 lat lub 150 000 km na silnik elektryczny i sterownik.' },
      { q: 'Który BYD jest najpopularniejszy w Polsce?', a: 'Najwięcej zarejestrowanych aut BYD to SUV Seal U, głównie w wersji hybrydowej plug-in DM-i.' },
      { q: 'Czy warto kupić BYD?', a: 'BYD to dobry wybór dla osób, które mogą regularnie ładować auto – wtedy hybryda plug-in lub elektryk są bardzo tanie w jeździe, a gwarancja na baterię jest długa. Przed zakupem sprawdź, gdzie jest najbliższy serwis, i porównaj koszt OC.' }
    ],
    zrodla: [
      { nazwa: 'Otomoto News – BYD oficjalnie wchodzi do Polski (październik 2024)', url: 'https://www.otomoto.pl/news/byd-w-polsce-3-elektryki-i-hybryda-plug-in' },
      { nazwa: 'Auto Katalog – zmiany w polskiej ofercie BYD (marzec 2026)', url: 'https://autokatalog.pl/blog/2026/byd-zmiany-w-polskiej-ofercie-modelowej' },
      { nazwa: 'BYD Polska – oficjalna strona', url: 'https://www.byd.com/pl' }
    ],
    sprawdzono: '2026-11-15'
  },

  chery: {
    seoTytul: 'Chery w Polsce – modele, ceny, gwarancja, opinie',
    seoOpis: 'Chery w Polsce: SUV-y Tiggo 4, Tiggo 7, Tiggo 8 i Tiggo 9 – benzyna, hybrydy i plug-in. Kim jest Chery, ceny od 95 900 zł, 7 lat gwarancji, liczba aut w CEPiK.',
    h1: 'Chery w Polsce – modele, ceny, gwarancja i opinie',
    lead: 'Chery to jeden z największych chińskich producentów aut i właściciel marek Omoda i Jaecoo. Pod własną nazwą sprzedaje w Polsce SUV-y z rodziny Tiggo od 2025 roku. Sprawdziliśmy, co jest w ofercie, ile kosztuje i jak wygląda gwarancja.',
    sekcje: [
      {
        h2: 'Kim jest Chery',
        akapity: [
          'Chery powstało w 1997 roku w chińskim mieście Wuhu. Od lat jest największym eksporterem samochodów z Chin – jego auta są sprzedawane w kilkudziesięciu krajach. Do koncernu należą też marki Omoda, Jaecoo i Jetour, które również są dostępne w Polsce.',
          'Modele Chery noszą nazwę Tiggo – im wyższa liczba, tym większy SUV: od miejskiego Tiggo 4 do dużego Tiggo 9.'
        ]
      },
      {
        h2: 'Chery w Polsce – start i oferta',
        akapity: [
          'Chery weszło do Polski latem 2025 roku z modelami Tiggo 7 i Tiggo 8, w wersjach benzynowych (1.6 turbo, 147 KM) i hybrydowych plug-in (279 KM, do ok. 90 km na prądzie). Sprzedaż ruszyła w 11 salonach, a do końca 2025 roku sieć miała liczyć ok. 30 punktów. Później dołączyły mniejszy Tiggo 4 z napędem hybrydowym i największy Tiggo 9 plug-in.',
          'W CEPiK najwięcej zarejestrowanych aut tej marki to Tiggo 7, a za nim Tiggo 8 i Tiggo 4.'
        ]
      },
      {
        h2: 'Gwarancja Chery',
        akapity: [
          'Nowe Chery mają w Polsce 7 lat gwarancji (do 150 000 km). Elementy napędu hybrydowego – bateria, silnik elektryczny i elektronika – mają gwarancję na 8 lat lub 160 000 km. Do tego 3 lata na lakier i 12 lat na perforację nadwozia.'
        ]
      }
    ],
    oferta: {
      h2: 'Modele Chery w Polsce i ceny',
      wstep: 'Oferta Chery w Polsce to cztery SUV-y z rodziny Tiggo.',
      modele: [
        { nazwa: 'Chery Tiggo 4', adres: '/marki/chery/tiggo-4/', typ: 'SUV miejski', naped: 'Hybryda', cena: 'od 95 900 zł (debiut)' },
        { nazwa: 'Chery Tiggo 7', adres: '/marki/chery/tiggo-7/', typ: 'SUV kompaktowy (4,55 m)', naped: '1.6 turbo 147 KM lub plug-in 279 KM', cena: 'od 124 900 zł (debiut, 2025)' },
        { nazwa: 'Chery Tiggo 8', adres: '/marki/chery/tiggo-8/', typ: 'Duży SUV, 7 miejsc (4,73 m)', naped: '1.6 turbo 147 KM lub plug-in 279 KM', cena: 'od 149 900 zł (debiut, 2025)' },
        { nazwa: 'Chery Tiggo 9', adres: '/marki/chery/tiggo-9/', typ: 'Największy SUV Chery', naped: 'Hybryda plug-in' }
      ],
      uwaga: UWAGA_CENY
    },
    plusy: [
      'Doświadczony producent – największy eksporter aut z Chin.',
      '7 lat gwarancji, 8 lat na napęd hybrydowy, 12 lat na perforację.',
      'Hybrydy plug-in z zasięgiem do ok. 90 km na prądzie.',
      '7-osobowy Tiggo 8 w cenie mniejszych SUV-ów innych marek.'
    ],
    minusy: [
      'Pod własną marką Chery jest w Polsce dopiero od 2025 roku – mała sieć serwisów.',
      'Brak danych o trwałości aut po wielu latach w polskich warunkach.',
      'Benzynowy 1.6 turbo bez hybrydy potrafi sporo palić w mieście.',
      'Trudno przewidzieć wartość przy odsprzedaży.'
    ],
    faq: [
      { q: 'Czy Omoda i Jaecoo to Chery?', a: 'Tak. Omoda i Jaecoo to marki należące do koncernu Chery, podobnie jak Jetour. Chery sprzedaje też auta pod własną nazwą – modele Tiggo.' },
      { q: 'Od kiedy Chery jest w Polsce?', a: 'Pod własną marką Chery sprzedaje auta w Polsce od lata 2025 roku. Pierwszymi modelami były Tiggo 7 i Tiggo 8.' },
      { q: 'Jaką gwarancję ma Chery?', a: '7 lat (do 150 000 km) na auto, 8 lat lub 160 000 km na elementy napędu hybrydowego, 3 lata na lakier i 12 lat na perforację nadwozia.' },
      { q: 'Ile kosztuje Chery Tiggo 7?', a: 'Przy debiucie w 2025 roku Tiggo 7 kosztował od 124 900 zł, a 7-osobowy Tiggo 8 od 149 900 zł. Najtańszy Tiggo 4 z napędem hybrydowym wyceniono od 95 900 zł. Aktualne ceny sprawdź w salonie.' },
      { q: 'Czy warto kupić Chery?', a: 'Chery daje dużo miejsca i wyposażenia za rozsądną cenę, a gwarancja jest długa. Ryzykiem jest krótka obecność marki w Polsce i mała sieć serwisów. Jeśli możesz ładować auto w domu, wersje plug-in są najtańsze w codziennej jeździe.' }
    ],
    zrodla: [
      { nazwa: 'Chip.pl – Chery wkracza do Polski: modele, salony, gwarancja (lipiec 2025)', url: 'https://www.chip.pl/2025/07/chery-wkracza-do-polski-4-modele-30-salonow-7-lat-gwarancji' },
      { nazwa: 'Otomoto News – ceny Chery Tiggo 4 HEV i Tiggo 9 PHEV', url: 'https://www.otomoto.pl/news/premiera-chery-tiggo-4-hev-i-tiggo-9-phev-oml' },
      { nazwa: 'Auto Świat – pełna gama SUV-ów Chery w Polsce', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/chery-tiggo-4-7-8-i-9-pelna-gama-suv-ow-juz-w-polsce-co-je-wyroznia/vwpy0ql' }
    ],
    sprawdzono: '2026-11-15'
  }
};
