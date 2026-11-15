// Ręczne opisy marek – druga partia: Audi, Renault, BMW, Fiat, Mercedes-Benz.
// Oceny silników na podstawie poradników Auto Świata i Otomoto (źródła przy każdej marce).
import type { OpisMarki } from '@/lib/opisy-marek';

const KOLUMNY: [string, string, string, string] = ['Model', 'Rodzaj auta', 'Na co uważać', 'Dla kogo'];
const WSTEP_SILNIKI =
  'Ocena dotyczy aut używanych i opiera się na doświadczeniach mechaników i poradnikach motoryzacyjnych. To uogólnienie: zadbany egzemplarz „gorszego” silnika może być lepszy niż zaniedbany „dobrego”. Przed zakupem zawsze sprawdź historię serwisową i stan konkretnego auta.';
const UWAGA_MODELE = 'W tabeli najpopularniejsze modele marki w Polsce według liczby zarejestrowanych aut. Kliknij nazwę, żeby zobaczyć kartę modelu z liczbami, generacjami i usterkami.';

export const OPISY_DUZE_2: Record<string, OpisMarki> = {
  audi: {
    seoTytul: 'Audi w Polsce – modele, silniki, opinie',
    seoOpis: 'Audi w Polsce: A4, A3, A6, Q5 – historia marki, które silniki Audi warto kupić (1.9 TDI, 2.0 TDI CR, 3.0 TDI), a których unikać (wczesne TFSI, 2.0 TDI PD), plusy i minusy.',
    h1: 'Audi w Polsce – modele, silniki i opinie',
    lead: 'Audi to najpopularniejsza marka premium w Polsce – w CEPiK jest ponad 1,3 mln aut z czterema pierścieniami. A4 to jedno z najczęściej sprowadzanych aut z Niemiec. Podpowiadamy, które modele i silniki warto kupić, a których unikać.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Audi',
        akapity: [
          'Markę Audi założył w 1909 roku August Horch – „audi” to łacińskie tłumaczenie jego nazwiska („słuchaj”). Cztery pierścienie w logo symbolizują cztery firmy, które w 1932 roku połączyły się w Auto Union: Audi, DKW, Horch i Wanderer. W latach 60. firmę przejął Volkswagen, a siedzibą Audi jest bawarski Ingolstadt.',
          'Audi słynie z napędu na cztery koła quattro, wprowadzonego w 1980 roku, oraz z dopracowanych wnętrz. Jako część koncernu Volkswagena korzysta z tych samych silników co Volkswagen, Skoda i Seat – tylko w lepiej wyposażonych autach.'
        ]
      },
      {
        h2: 'Audi w Polsce',
        akapity: [
          'W Polsce Audi to przede wszystkim rynek używanych: większość aut została sprowadzona, głównie z Niemiec. Najczęściej spotkasz A4, A3 i A6, a wciąż jeżdżą też dziesiątki tysięcy starszych Audi 80. Z SUV-ów najpopularniejsze jest Q5.',
          'Przy Audi szczególnie ważne jest sprawdzenie historii auta: wśród ogłoszeń sporo jest egzemplarzy po wypadkach i z cofniętym licznikiem. Naprawy są droższe niż w Volkswagenie, zwłaszcza w autach z napędem quattro i automatem.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Audi w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Audi i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Audi A4', adres: '/marki/audi/a4/', typ: 'Klasa średnia (sedan, kombi Avant)', naped: '2.0 TDI PD, wczesne 1.8/2.0 TFSI (zużycie oleju), skrzynia multitronic', cena: 'Trasa, rodzina, komfort' },
        { nazwa: 'Audi A3', adres: '/marki/audi/a3/', typ: 'Kompakt premium', naped: 'Pierwsze 1.4 TFSI (rozrząd), 2.0 TDI PD', cena: 'Para lub singiel, dobrze wyposażony kompakt' },
        { nazwa: 'Audi A6', adres: '/marki/audi/a6/', typ: 'Klasa wyższa średnia', naped: 'Drogi rozrząd i osprzęt 3.0 TDI, 2.5 TDI, zawieszenie', cena: 'Dużo kilometrów w trasie, prestiż' },
        { nazwa: 'Audi 80', adres: '/marki/audi/80/', typ: 'Klasyk (sedan, kombi)', naped: 'Wiek auta – rdza rzadka (ocynk), ale zużycie ogromne', cena: 'Youngtimer, tani i trwały sedan' },
        { nazwa: 'Audi Q5', adres: '/marki/audi/q5/', typ: 'SUV średni', naped: 'Wczesne 2.0 TFSI, koszt napraw quattro i S tronic', cena: 'Rodzina, napęd 4x4' },
        { nazwa: 'Audi Q3', adres: '/marki/audi/q3/', typ: 'SUV kompaktowy', naped: 'Pierwsze 1.4 TFSI, skrzynia S tronic 7', cena: 'Miasto i trasa, mniejszy SUV premium' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.8 Turbo (1.8 T)', ocena: 'polecany', opis: 'Solidny benzyniak turbo, dobry kompromis osiągów i spalania, z łatwo dostępnymi częściami.' },
        { nazwa: '1.9 TDI (90 KM, z pompą rozdzielaczową)', ocena: 'polecany', opis: 'Prosty, trwały i oszczędny diesel. Nie polecamy natomiast wersji BXE z lat 2006–2008.' },
        { nazwa: '2.0 TDI common rail', ocena: 'polecany', opis: 'Po modernizacji znacznie lepszy od wersji z pompowtryskiwaczami. Wiele egzemplarzy ma jednak bardzo duże przebiegi.' },
        { nazwa: '3.0 TDI', ocena: 'warunkowo', opis: 'Dobre osiągi i trwały blok silnika, ale wymiana rozrządu i naprawy osprzętu są kosztowne.' },
        { nazwa: '1.4 TFSI (pierwsza generacja)', ocena: 'omijaj', opis: 'Problemy m.in. z łańcuchem rozrządu. Nowsza wersja z paskiem rozrządu jest bezpieczniejsza.' },
        { nazwa: '1.8 i 2.0 TFSI (EA888, wczesne)', ocena: 'omijaj', opis: 'Nadmierne zużycie oleju, problemy z turbosprężarką i elektroniką.' },
        { nazwa: '2.0 TDI PD i 2.5 TDI', ocena: 'omijaj', opis: 'W 2.0 TDI z pompowtryskiwaczami ryzykowne wtryskiwacze i głowice, w 2.5 TDI liczne wady konstrukcyjne.' },
        { nazwa: '2.4 V6 FSI (od 2004 r.)', ocena: 'omijaj', opis: 'Łańcuchy rozrządu, napinacze i sitko w układzie smarowania – awarie są bardzo kosztowne. Starszy 2.4 V6 (do 2005 r.) jest oceniany dobrze.' }
      ]
    },
    plusy: [
      'Dopracowane, dobrze wyciszone wnętrza.',
      'Napęd quattro w wielu wersjach.',
      'Części mechaniczne wspólne z Volkswagenem – łatwo dostępne.',
      'Duży wybór aut na rynku wtórnym.'
    ],
    minusy: [
      'Wysokie koszty napraw, zwłaszcza quattro, automatów i dużych diesli.',
      'Dużo aut sprowadzonych po wypadkach i z cofniętym licznikiem.',
      'Te same wadliwe silniki co w Volkswagenie (wczesne TFSI, 2.0 TDI PD).',
      'Bezstopniowa skrzynia multitronic w starszych A4 i A6 bywa awaryjna.'
    ],
    faq: [
      { q: 'Który silnik Audi jest najlepszy?', a: 'Za najtrwalsze uchodzą 1.8 Turbo, 1.9 TDI w wersji 90 KM i 2.0 TDI common rail. Odradza się pierwsze 1.4 TFSI, wczesne 1.8/2.0 TFSI, 2.0 TDI z pompowtryskiwaczami i 2.5 TDI.' },
      { q: 'Czy Audi to Volkswagen?', a: 'Audi należy do koncernu Volkswagena od lat 60. i korzysta z tych samych silników i wielu podzespołów. Różni się wykończeniem, wyposażeniem i napędem quattro – a także wyższą ceną.' },
      { q: 'Czy warto kupić używane Audi A4?', a: 'Tak, jeśli wybierzesz dobry silnik (np. 1.8 T, 1.9 TDI, 2.0 TDI common rail) i sprawdzisz historię auta po VIN. Uważaj na skrzynię multitronic w starszych generacjach.' },
      { q: 'Co znaczą cztery pierścienie Audi?', a: 'Symbolizują cztery firmy, które w 1932 roku połączyły się w Auto Union: Audi, DKW, Horch i Wanderer.' },
      { q: 'Czy Audi jest drogie w utrzymaniu?', a: 'Droższe niż Volkswagen czy Skoda z tym samym silnikiem – głównie przez droższe części wyposażenia, quattro i automaty. Podstawowe części silnika są jednak wspólne z autami koncernu VW i łatwo dostępne.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki w Audi: łatwo o solidną konstrukcję (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/sprawdzamy-silniki-w-audi-w-tym-przypadku-latwo-o-solidna-konstrukcje/nge05ge' },
      { nazwa: 'Auto Świat – najlepsze i najgorsze silniki TDI', url: 'https://www.auto-swiat.pl/uzywane/co-warto-kupic/najlepsze-i-najgorsze-silniki-tdi-czyli-diesle-volkswagena/j430zfw' },
      { nazwa: 'Audi Polska – oficjalna strona', url: 'https://www.audi.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  renault: {
    seoTytul: 'Renault w Polsce – modele, silniki, opinie',
    seoOpis: 'Renault w Polsce: Clio, Megane, Scenic, Laguna, Captur – historia marki, które silniki Renault warto kupić (1.2, 1.6 16V, nowszy 1.5 dCi), a których unikać (1.9 dCi, 2.2 dCi).',
    h1: 'Renault w Polsce – modele, silniki i opinie',
    lead: 'Renault to jedna z najpopularniejszych marek w Polsce – Clio, Megane i Scenic jeżdżą w setkach tysięcy egzemplarzy. Używane Renault są tanie, wygodne i dobrze wyposażone, ale wybór silnika ma ogromne znaczenie. Podpowiadamy, które warto kupić.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Renault',
        akapity: [
          'Renault założyli w 1899 roku bracia Louis, Marcel i Fernand Renault w Boulogne-Billancourt pod Paryżem. Dziś to jeden z największych europejskich producentów, w sojuszu z japońskimi Nissanem i Mitsubishi. Do Renault należy też rumuńska Dacia – dlatego wiele Dacii ma silniki Renault.',
          'Renault słynie z wygodnych foteli i zawieszenia oraz z pomysłowych aut rodzinnych – to Renault spopularyzowało w Europie minivany (Espace, Scenic).'
        ]
      },
      {
        h2: 'Renault w Polsce',
        akapity: [
          'W Polsce najwięcej jest Clio, Megane i Scenic, a z nowszych modeli – SUV-a Captur. Duża część to auta sprowadzone, a ich ceny na rynku wtórnym są niższe niż porównywalnych aut niemieckich.',
          'Renault ma opinię aut, w których częściej niż u konkurencji psuje się elektryka i elektronika (np. czujniki, karty-klucze, sterowniki). Mechanicznie wiele zależy od silnika: proste benzyniaki są trwałe, a niektóre diesle – bardzo ryzykowne.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Renault w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Renault i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Renault Clio', adres: '/marki/renault/clio/', typ: 'Auto miejskie', naped: 'Wczesne 1.5 dCi, elektryka', cena: 'Miasto, pierwsze auto – najlepiej z 1.2' },
        { nazwa: 'Renault Megane', adres: '/marki/renault/megane/', typ: 'Kompakt', naped: '1.9 dCi, wczesne 1.5 dCi, karty-klucze i elektryka', cena: 'Uniwersalny, niedrogi kompakt' },
        { nazwa: 'Renault Scenic', adres: '/marki/renault/scenic/', typ: 'Kompaktowy minivan', naped: '1.9 dCi, elektryka, zużyte wnętrza', cena: 'Rodzina z dziećmi' },
        { nazwa: 'Renault Laguna', adres: '/marki/renault/laguna/', typ: 'Klasa średnia', naped: '1.9 dCi, 2.2 dCi, 3.0 dCi, 2.0 IDE, elektryka w Lagunie II', cena: 'Tanie, wygodne auto na trasę' },
        { nazwa: 'Renault Captur', adres: '/marki/renault/captur/', typ: 'Mały SUV', naped: 'Mały silnik turbo – regularna wymiana oleju', cena: 'Miasto, wyższa pozycja za kierownicą' },
        { nazwa: 'Renault Trafic', adres: '/marki/renault/trafic/', typ: 'Bus / van', naped: 'Duże przebiegi, diesle 1.9 dCi i 2.5 dCi', cena: 'Przewóz osób, praca, kamper' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.2 (seria D, bez turbo)', ocena: 'polecany', opis: 'Prosty i trwały benzyniak z tanią obsługą. Zdarzają się drobne usterki, np. cewki zapłonowej.' },
        { nazwa: '1.6 (seria K)', ocena: 'polecany', opis: 'Solidny, z łatwo dostępnymi częściami i dobrze współpracujący z LPG. W wersjach 8-zaworowych zdarzały się przepalone uszczelki pod głowicą.' },
        { nazwa: '2.0 (seria F)', ocena: 'polecany', opis: 'Mocny i trwały benzyniak. W wersjach turbo sporo pali.' },
        { nazwa: '1.5 dCi (po 2010 r.)', ocena: 'warunkowo', opis: 'Nowsze wersje są wyraźnie trwalsze. Wymagają regularnej wymiany oleju i dobrego paliwa.' },
        { nazwa: '2.0 dCi', ocena: 'polecany', opis: 'Diesel konstrukcji Nissana, oceniany na plus.' },
        { nazwa: '1.5 dCi (wczesne, do ok. 2010 r.)', ocena: 'omijaj', opis: 'Problemy z układem wtryskowym Delphi, słabe panewki i turbosprężarka.' },
        { nazwa: '1.9 dCi', ocena: 'omijaj', opis: 'Ryzykowny niemal w każdej wersji – wyjątkiem są 130-konne odmiany z końca produkcji.' },
        { nazwa: '2.2 dCi, 3.0 dCi i 2.0 IDE', ocena: 'omijaj', opis: 'W 2.2 dCi usterkowa głowica i wycieki oleju, 3.0 dCi ma skłonność do przegrzewania, a benzynowy 2.0 IDE – awaryjny osprzęt.' }
      ]
    },
    plusy: [
      'Niskie ceny na rynku wtórnym i bogate wyposażenie.',
      'Wygodne fotele i komfortowe zawieszenie.',
      'Trwałe, proste benzyniaki (1.2, 1.6), dobre do LPG.',
      'Tanie części, wspólne z Dacią i częściowo z Nissanem.'
    ],
    minusy: [
      'Opinia aut z kapryśną elektryką i elektroniką.',
      'Kilka bardzo ryzykownych diesli (1.9 dCi, 2.2 dCi, wczesny 1.5 dCi).',
      'Szybsza utrata wartości niż w autach niemieckich i japońskich.',
      'Starsze modele (np. Laguna II) mają złą opinię o trwałości.'
    ],
    faq: [
      { q: 'Który silnik Renault jest najlepszy?', a: 'Za najtrwalsze uchodzą benzynowe 1.2 (seria D), 1.6 16V (seria K) i 2.0 (seria F), a z diesli – 2.0 dCi i nowsze wersje 1.5 dCi (po 2010 roku). Odradza się 1.9 dCi, 2.2 dCi, 3.0 dCi i wczesne 1.5 dCi.' },
      { q: 'Czy silnik 1.5 dCi jest dobry?', a: 'Zależy od rocznika. Wczesne wersje (do ok. 2010 roku) miały problemy z wtryskiem Delphi, panewkami i turbo. Nowsze są wyraźnie trwalsze, pod warunkiem regularnej wymiany oleju.' },
      { q: 'Czy Renault jest awaryjne?', a: 'Mechanicznie wiele zależy od silnika – proste benzyniaki są trwałe. Renault ma jednak opinię aut, w których częściej psuje się elektryka i elektronika. Przy zakupie sprawdź działanie wszystkich systemów i komunikaty na desce rozdzielczej.' },
      { q: 'Czy Dacia to Renault?', a: 'Dacia należy do Renault od 1999 roku i korzysta z jego silników i podzespołów. Dzięki temu części do Dacii i Renault są często wspólne.' },
      { q: 'Clio czy Fiesta?', a: 'Clio jest wygodniejsze i zwykle lepiej wyposażone, Fiesta lepiej się prowadzi. W obu najbezpieczniejszy wybór to prosty benzyniak bez turbo.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki Renault: lepsze benzyniaki czy diesle (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/sprawdzamy-silniki-renault-lepsze-benzyniaki-czy-diesle/tlq77h7' },
      { nazwa: 'AutoCentrum – silnik 1.5 dCi: poradnik', url: 'https://autocentrum.pl/publikacje/porady/silnik-1-5-dci-od-renault-oszczedny-diesel-ale-trzeba-zachowac-czujnosc-poradnik/' },
      { nazwa: 'Renault Polska – oficjalna strona', url: 'https://www.renault.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  bmw: {
    seoTytul: 'BMW w Polsce – modele, silniki, opinie',
    seoOpis: 'BMW w Polsce: Seria 3, Seria 5, Seria 1, X3 – historia marki, które silniki BMW warto kupić (M54, M57), a których unikać (N47, N45, M47), plusy i minusy.',
    h1: 'BMW w Polsce – modele, silniki i opinie',
    lead: 'BMW to marka, którą Polacy kochają za napęd na tylne koła i radość z jazdy – w CEPiK jest ponad 900 tys. aut BMW. Seria 3 i Seria 5 to jedne z najczęściej sprowadzanych aut z Niemiec. Podpowiadamy, które modele i silniki warto kupić, a których unikać.',
    sekcje: [
      {
        h2: 'Skąd pochodzi BMW',
        akapity: [
          'BMW (Bayerische Motoren Werke, czyli Bawarskie Zakłady Silnikowe) powstało w 1916 roku w Monachium jako producent silników lotniczych. Samochody buduje od końca lat 20. XX wieku. Do koncernu należą też marki Mini i Rolls-Royce.',
          'BMW słynie z napędu na tylne koła, rzędowych sześciocylindrowych silników i sportowego prowadzenia. Niebiesko-białe logo nawiązuje do barw Bawarii.'
        ]
      },
      {
        h2: 'BMW w Polsce',
        akapity: [
          'W Polsce BMW to w dużej mierze auta sprowadzone, często kilkunastoletnie. Najczęściej spotkasz Serię 3 i Serię 5, a z SUV-ów – X3, X5 i X1. Sporo starszych BMW ma instalację LPG.',
          'Używane BMW kuszą ceną, ale koszty napraw bywają wysokie, a stan aut bardzo różny. Wiele egzemplarzy było intensywnie eksploatowanych – dlatego przy BMW wybór silnika i sprawdzenie historii są szczególnie ważne.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele BMW w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele BMW i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'BMW Seria 3', adres: '/marki/bmw/seria-3/', typ: 'Klasa średnia (sedan, kombi Touring)', naped: 'Diesle N47 (rozrząd), benzynowy N45, zawieszenie', cena: 'Dla tych, którzy lubią prowadzić' },
        { nazwa: 'BMW Seria 5', adres: '/marki/bmw/seria-5/', typ: 'Klasa wyższa średnia', naped: 'Duże przebiegi, N47 i wczesny N57, koszty napraw', cena: 'Trasa, komfort, dużo miejsca' },
        { nazwa: 'BMW Seria 1', adres: '/marki/bmw/seria-1/', typ: 'Kompakt z tylnym napędem', naped: 'N47 i N45, ciasny tył', cena: 'Singiel lub para, frajda z jazdy' },
        { nazwa: 'BMW X3', adres: '/marki/bmw/x3/', typ: 'SUV średni', naped: 'Diesle N47 i M47, napęd xDrive (skrzynia rozdzielcza)', cena: 'Rodzina, napęd 4x4' },
        { nazwa: 'BMW X5', adres: '/marki/bmw/x5/', typ: 'Duży SUV', naped: 'Bardzo drogie naprawy, zawieszenie pneumatyczne', cena: 'Duża rodzina, holowanie przyczepy' },
        { nazwa: 'BMW X1', adres: '/marki/bmw/x1/', typ: 'SUV kompaktowy', naped: 'Diesel N47 w pierwszej generacji', cena: 'Mniejszy SUV premium' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: 'M54 (benzyna 2.2, 2.5, 3.0)', ocena: 'polecany', opis: 'Trwała rzędowa szóstka z rozsądnymi kosztami napraw. Główna wada: zużycie oleju.' },
        { nazwa: 'M52 (benzyna 2.0–2.8)', ocena: 'polecany', opis: 'Udany i trwały, o ile był regularnie serwisowany. Uwaga na głowicę i zużycie oleju.' },
        { nazwa: 'M57 (diesel 3.0)', ocena: 'polecany', opis: 'Solidny, trwały turbodiesel. Pali więcej niż nowsze konstrukcje.' },
        { nazwa: 'N46 (benzyna 2.0)', ocena: 'warunkowo', opis: 'Całkiem udany, ale tylko w zadbanych autach. Częste awarie napinacza rozrządu, olej trzeba wymieniać co ok. 12,5 tys. km.' },
        { nazwa: 'N47 (diesel 2.0)', ocena: 'omijaj', opis: 'Dużo poważnych awarii, zwłaszcza w autach z lat 2007–2009 – głównie rozrząd umieszczony z tyłu silnika, którego naprawa jest bardzo droga.' },
        { nazwa: 'N45 (benzyna 1.6 i 2.0/173 KM)', ocena: 'omijaj', opis: 'Liczne poważne problemy – wersja 173-konna uchodzi za wyjątkowo nieudaną.' },
        { nazwa: 'M47 (diesel 2.0)', ocena: 'omijaj', opis: 'Pękające wały, problemy z osprzętem i elektroniką, choć niektóre wersje są przyzwoite.' },
        { nazwa: 'N52 2.5 (2006–2009) i wczesny N57 3.0d', ocena: 'warunkowo', opis: 'W tych latach zdarzały się kosztowne awarie. Wersja N52 3.0 jest oceniana lepiej, a N57 pali mniej niż M57.' }
      ]
    },
    plusy: [
      'Świetne prowadzenie i napęd na tylne koła.',
      'Trwałe starsze rzędowe szóstki (M52, M54, M57).',
      'Duży wybór aut na rynku wtórnym, także z LPG.',
      'Dobre wyposażenie i jakość wnętrza.'
    ],
    minusy: [
      'Wysokie koszty napraw, zwłaszcza w nowszych modelach.',
      'Popularny diesel N47 ma poważne wady rozrządu.',
      'Wiele aut po intensywnej eksploatacji i z nieznaną historią.',
      'Tylny napęd w starszych autach bez kontroli trakcji wymaga wprawy zimą.'
    ],
    faq: [
      { q: 'Który silnik BMW jest najlepszy?', a: 'Za najtrwalsze uchodzą starsze rzędowe szóstki: benzynowe M52 i M54 oraz diesel M57. Odradza się diesle N47 i M47 oraz benzynowy N45.' },
      { q: 'Czy silnik N47 jest awaryjny?', a: 'Tak, to jeden z najczęściej krytykowanych diesli BMW. Najwięcej problemów sprawia łańcuch rozrządu umieszczony z tyłu silnika – jego wymiana jest bardzo droga. Najgorsze opinie mają auta z lat 2007–2009.' },
      { q: 'Czy warto kupić BMW z LPG?', a: 'Starsze benzynowe BMW z silnikami M52 i M54 dobrze znoszą LPG i są popularne w tej wersji. Sprawdź jakość instalacji, jej przeglądy i stan głowicy silnika.' },
      { q: 'Seria 3 czy Seria 5?', a: 'Seria 3 jest mniejsza, tańsza w utrzymaniu i zwinniejsza. Seria 5 daje dużo więcej miejsca i komfortu w trasie, ale naprawy są droższe, a używane egzemplarze często mają bardzo duże przebiegi.' },
      { q: 'Co znaczy skrót BMW?', a: 'Bayerische Motoren Werke, czyli Bawarskie Zakłady Silnikowe. Firma powstała w 1916 roku w Monachium jako producent silników lotniczych.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki BMW: lepsze starsze niż nowsze (2022)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/sprawdzamy-silniki-bmw-lepsze-starsze-niz-nowsze/5h4kbkh' },
      { nazwa: 'Autobaza – z czego wynikają problemy z silnikiem N47', url: 'https://www.autobaza.pl/page/auto-ekspert/z-czego-wynikaja-problemy-z-dwulitrowym-silnikiem-n47-od-bmw/' },
      { nazwa: 'BMW Polska – oficjalna strona', url: 'https://www.bmw.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  fiat: {
    seoTytul: 'Fiat w Polsce – modele, silniki, opinie',
    seoOpis: 'Fiat w Polsce: Punto, Seicento, Panda, 500, Tipo – historia marki i fabryki w Tychach, które silniki Fiata warto kupić (1.4 8V, 1.4 T-Jet), a których unikać (0.9 TwinAir).',
    h1: 'Fiat w Polsce – modele, silniki i opinie',
    lead: 'Fiat ma w Polsce wyjątkową historię – od Polskiego Fiata 126p po Pandy i Fiaty 500 z fabryki w Tychach. Dziś to przede wszystkim tanie, proste auta miejskie na rynku używanych. Podpowiadamy, które modele i silniki warto kupić.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Fiat',
        akapity: [
          'Fiat (Fabbrica Italiana Automobili Torino) powstał w 1899 roku w Turynie. Przez dziesięciolecia był największym producentem aut we Włoszech, specjalistą od małych, tanich samochodów. Od 2021 roku należy do grupy Stellantis – razem z m.in. Peugeotem, Citroënem, Oplem i Jeepem.',
          'Na tej stronie opisujemy auta marki Fiat. Licencyjne Polskie Fiaty 125p i 126p mają w atlasie osobną stronę – zobacz markę Polski Fiat.'
        ]
      },
      {
        h2: 'Fiat w Polsce i fabryka w Tychach',
        akapity: [
          'Fabryka w Tychach przez lata produkowała Fiaty dla całej Europy: 126p, Cinquecento, Seicento, Pandę i Fiata 500. Dziś zakład należy do Stellantisa i produkuje nowsze modele grupy, m.in. Fiata 600.',
          'W Polsce najwięcej jest Punto, Seicento, Pand i Cinquecento – to głównie auta kilkunastoletnie, chętnie kupowane jako pierwsze auto albo auto do miasta. Fiaty są tanie w zakupie i naprawach, a części do nich łatwo dostępne.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Fiata w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Fiata i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Fiat Punto', adres: '/marki/fiat/punto/', typ: 'Auto miejskie', naped: 'Rdza w starszych, 1.4 16V (zużycie oleju), 1.3 Multijet (łańcuch)', cena: 'Pierwsze auto, miasto, LPG' },
        { nazwa: 'Fiat Seicento', adres: '/marki/fiat/seicento/', typ: 'Mikrosamochód', naped: 'Rdza, wiek auta, słabe bezpieczeństwo', cena: 'Najtańsze auto do miasta' },
        { nazwa: 'Fiat Panda', adres: '/marki/fiat/panda/', typ: 'Auto miejskie', naped: 'Skrzynia Dualogic, 0.9 TwinAir w nowszych', cena: 'Miasto, także wersja 4x4 na wieś i w góry' },
        { nazwa: 'Fiat Cinquecento', adres: '/marki/fiat/cinquecento/', typ: 'Mikrosamochód', naped: 'Rdza i wiek auta – dziś raczej youngtimer', cena: 'Kolekcjonerzy, tanie dojazdy' },
        { nazwa: 'Fiat Tipo', adres: '/marki/fiat/tipo/', typ: 'Kompakt (sedan, hatchback, kombi)', naped: '1.6 Multijet (uszczelka smoka olejowego)', cena: 'Rodzina z małym budżetem' },
        { nazwa: 'Fiat 500', adres: '/marki/fiat/500/', typ: 'Auto miejskie retro', naped: '0.9 TwinAir, Dualogic, mało miejsca', cena: 'Miasto, styl' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.4 8V (77 KM)', ocena: 'polecany', opis: '„Złoty środek”: prosta konstrukcja, niskie koszty serwisu i dobra współpraca z LPG. Słabsze punkty to wariator rozrządu i cewki zapłonowe.' },
        { nazwa: '1.2 8V', ocena: 'polecany', opis: 'Tani i prosty, ale bardzo słaby. Jeśli możesz, szukaj raczej 1.4 8V.' },
        { nazwa: '1.4 T-Jet', ocena: 'polecany', opis: 'Udany silnik turbo z dobrymi osiągami. Trzeba liczyć się z wymianą koła dwumasowego, zwykle po 150–200 tys. km.' },
        { nazwa: '1.3 Multijet', ocena: 'warunkowo', opis: 'Oszczędny i prosty w słabszych wersjach, ale wymaga kontroli łańcucha rozrządu i poziomu oleju.' },
        { nazwa: '1.4 Turbo MultiAir', ocena: 'warunkowo', opis: 'Ma więcej sensu niż wolnossący MultiAir. Szukaj auta z udokumentowaną wymianą modułu MultiAir.' },
        { nazwa: '0.9 TwinAir (dwucylindrowy)', ocena: 'omijaj', opis: 'Terkocze, pali więcej, niż sugeruje pojemność, a wielu mechaników go nie zna.' },
        { nazwa: '1.4 16V (95 KM)', ocena: 'omijaj', opis: 'Często zużywa olej, a układ smarowania ma małą pojemność – trzeba regularnie sprawdzać poziom oleju.' },
        { nazwa: '1.6 Multijet', ocena: 'omijaj', opis: 'Bardziej skomplikowany, z filtrem DPF. Groźna jest nieszczelna uszczelka smoka olejowego, która może doprowadzić do zatarcia silnika.' }
      ]
    },
    plusy: [
      'Bardzo tanie w zakupie i naprawach.',
      'Łatwo dostępne części, wielu mechaników zna te auta.',
      'Proste benzyniaki dobrze znoszą LPG.',
      'Dużo aut z polskich salonów i z polskiej fabryki.'
    ],
    minusy: [
      'Starsze Fiaty są podatne na rdzę.',
      'Najmniejsze modele (Seicento, Cinquecento) słabo chronią w razie wypadku.',
      'Zautomatyzowana skrzynia Dualogic bywa kłopotliwa.',
      'Szybka utrata wartości.'
    ],
    faq: [
      { q: 'Który silnik Fiata jest najlepszy?', a: 'Za najlepszy wybór uchodzi benzynowy 1.4 8V (77 KM) – prosty, tani w serwisie i dobry do LPG. Dobrą opinię ma też 1.4 T-Jet. Odradza się dwucylindrowy 0.9 TwinAir, 1.4 16V (zużycie oleju) i 1.6 Multijet.' },
      { q: 'Czy Fiat Punto to dobre pierwsze auto?', a: 'Tak, to jeden z popularniejszych wyborów na pierwsze auto: tani w zakupie i naprawach. Najlepiej szukać wersji z silnikiem 1.2 8V lub 1.4 8V i dokładnie sprawdzić rdzę.' },
      { q: 'Gdzie produkowano Fiaty w Polsce?', a: 'Głównie w fabryce w Tychach – powstawały tam m.in. 126p, Cinquecento, Seicento, Panda i Fiat 500. Dziś zakład należy do Stellantisa i produkuje nowsze modele grupy.' },
      { q: 'Czym różni się Fiat od Polskiego Fiata?', a: 'Polski Fiat to marka aut produkowanych w Polsce na włoskiej licencji (głównie 125p i 126p). Fiat to włoska marka, której auta później produkowano także w Tychach. W atlasie mają osobne strony.' },
      { q: 'Czy Fiat 500 z silnikiem TwinAir jest dobry?', a: 'Dwucylindrowy 0.9 TwinAir ma przeciętne opinie: głośno pracuje i pali więcej, niż obiecuje producent. W Fiacie 500 lepszym wyborem jest prosty benzynowy 1.2 8V.' }
    ],
    zrodla: [
      { nazwa: 'Otomoto News – używany Fiat Punto / Grande Punto / Evo: jaki silnik wybrać (2026)', url: 'https://www.otomoto.pl/news/uzywany-fiat-punto-grande-punto-evo-jaki-silnik-wybrac' },
      { nazwa: 'Auto Świat – wszystko o silniku 1.4 T-Jet', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/wszystko-o-silniku-14-t-jet-jak-fiat-poradzil-sobie-z-downsizingiem/60r961h' },
      { nazwa: 'Fiat Polska – oficjalna strona', url: 'https://www.fiat.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  'mercedes-benz': {
    seoTytul: 'Mercedes-Benz w Polsce – modele, silniki, opinie',
    seoOpis: 'Mercedes-Benz w Polsce: Klasa C, E, A, legendarne W123 i W124 – historia marki, które silniki Mercedesa warto kupić (OM646, M111, M113), a których unikać (OM651, M272).',
    h1: 'Mercedes-Benz w Polsce – modele, silniki i opinie',
    lead: 'Mercedes-Benz to marka, od której wszystko się zaczęło – to Karl Benz zbudował pierwszy samochód. W Polsce jeździ ponad 860 tys. Mercedesów, od klasyków W123 i W124 po nowe SUV-y. Podpowiadamy, które modele i silniki warto kupić.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Mercedes-Benz',
        akapity: [
          'W 1886 roku Karl Benz opatentował pierwszy samochód z silnikiem spalinowym. W 1926 roku jego firma połączyła się z firmą Gottlieba Daimlera, tworząc Daimler-Benz. Nazwa Mercedes pochodzi od imienia córki Emila Jellinka, jednego z pierwszych klientów Daimlera. Siedzibą marki jest Stuttgart.',
          'Mercedes słynie z komfortu, bezpieczeństwa i nowych technologii – wiele rozwiązań, jak strefy zgniotu czy ABS w seryjnych autach, pojawiło się najpierw w Mercedesach.'
        ]
      },
      {
        h2: 'Mercedes w Polsce',
        akapity: [
          'W Polsce Mercedes to zarówno legendy z lat 70. i 80. – W123 i W124, przez lata symbol taksówki – jak i nowoczesne auta: Klasa C, E i A oraz SUV-y GLC. Większość używanych Mercedesów została sprowadzona z Niemiec.',
          'Starsze Mercedesy uchodzą za niezniszczalne, nowsze są bardziej skomplikowane i droższe w naprawach. Przy zakupie liczy się przede wszystkim silnik, stan rdzy (zwłaszcza w autach z lat 90. i początku 2000.) i historia serwisowa.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Mercedesa w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Mercedesa i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Mercedes Klasa C', adres: '/marki/mercedes-benz/klasa-c/', typ: 'Klasa średnia (sedan, kombi)', naped: 'Rdza w starszych (W203), diesel OM651, M271 (łańcuch)', cena: 'Komfort i prestiż w rozsądnym rozmiarze' },
        { nazwa: 'Mercedes Klasa E', adres: '/marki/mercedes-benz/klasa-e/', typ: 'Klasa wyższa średnia', naped: 'Duże przebiegi, OM651, benzynowe V6 M272', cena: 'Trasa, duży komfort' },
        { nazwa: 'Mercedes Klasa A', adres: '/marki/mercedes-benz/klasa-a/', typ: 'Kompakt', naped: 'Starsze generacje – skrzynie CVT, koszty napraw', cena: 'Miasto, mniejsze auto premium' },
        { nazwa: 'Mercedes W123 i W124', adres: '/marki/mercedes-benz/w124/', typ: 'Klasyki (sedan, kombi)', naped: 'Rdza, wiek – dziś youngtimery i klasyki', cena: 'Kolekcjonerzy i fani niezniszczalnych aut' },
        { nazwa: 'Mercedes GLC', adres: '/marki/mercedes-benz/klasa-glc/', typ: 'SUV średni', naped: 'Nowsze auto – koszty serwisu i elektroniki', cena: 'Rodzina, napęd 4x4' },
        { nazwa: 'Mercedes Klasa B', adres: '/marki/mercedes-benz/klasa-b/', typ: 'Kompaktowy minivan', naped: 'Skrzynie CVT w starszych, koszty napraw', cena: 'Seniorzy i rodziny – łatwe wsiadanie' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: 'OM646 (diesel 2.1 CDI, ok. 2003–2009)', ocena: 'polecany', opis: 'Najlepsza generacja 2.1 CDI: akceptowalna trwałość i dobra dostępność części.' },
        { nazwa: 'M111 (benzyna 1.8–2.3, lata 90.)', ocena: 'polecany', opis: 'Mocne, niezawodne silniki z trwałym rozrządem.' },
        { nazwa: 'M113 (benzyna V8 4.3–5.4)', ocena: 'polecany', opis: 'Bardzo trwałe, z wysoką kulturą pracy – mechanicy nazywają je jednymi z najlepszych silników Mercedesa. Zdarza się zużycie oleju, spalanie jest wysokie.' },
        { nazwa: 'M271 (benzyna 1.6/1.8 z doładowaniem)', ocena: 'warunkowo', opis: 'Dynamiczne i w miarę trwałe, ale słabszym punktem jest łańcuch rozrządu i koła zębate wałków.' },
        { nazwa: 'OM642 (diesel 3.0 CDI V6)', ocena: 'warunkowo', opis: 'Solidny i kulturalny, ale zdarzają się poważne awarie – przy zakupie potrzebna ostrożność.' },
        { nazwa: 'OM651 (diesel 2.1 CDI od 2008 r.)', ocena: 'omijaj', opis: 'Wadliwe wtryskiwacze Delphi w części aut, skomplikowana konstrukcja i droga wymiana rozrządu.' },
        { nazwa: 'M272 i M273 (benzyna V6 i V8)', ocena: 'omijaj', opis: 'Problemy z napędem rozrządu, pękające kolektory ssące i wysokie koszty napraw.' },
        { nazwa: 'OM612 (diesel 2.7 CDI)', ocena: 'omijaj', opis: 'Pękające głowice – naprawa potrafi kosztować kilka tysięcy złotych.' }
      ]
    },
    plusy: [
      'Wysoki komfort jazdy i dobre wyciszenie.',
      'Bardzo trwałe starsze silniki i legendarne modele W123 i W124.',
      'Dużo aut na rynku wtórnym w każdej klasie.',
      'Dobre bezpieczeństwo bierne.'
    ],
    minusy: [
      'Wysokie koszty napraw w nowszych modelach, zwłaszcza elektroniki i zawieszenia.',
      'Rdza w autach z lat 90. i początku 2000. (np. Klasa C W203, Klasa E W210).',
      'Kilka ryzykownych silników (OM651, M272, OM612).',
      'Dużo sprowadzonych aut z nieznaną historią.'
    ],
    faq: [
      { q: 'Który silnik Mercedesa jest najlepszy?', a: 'Za najtrwalsze uchodzą diesel OM646 (2.1 CDI z lat ok. 2003–2009) oraz benzynowe M111 i V8 M113. Odradza się diesle OM651 i OM612 oraz benzynowe V6 i V8 z serii M272/M273.' },
      { q: 'Czy Mercedes W124 to dobre auto?', a: 'To jeden z najtrwalszych samochodów w historii, przez lata używany jako taksówka. Dziś to youngtimer – najważniejszy jest stan blacharki (rdza) i oryginalność. Ceny zadbanych egzemplarzy rosną.' },
      { q: 'Czy Mercedes jest drogi w utrzymaniu?', a: 'Starsze modele z prostymi silnikami są stosunkowo tanie w naprawach. Nowsze Mercedesy są skomplikowane, a części i naprawy elektroniki czy zawieszenia pneumatycznego bywają bardzo drogie.' },
      { q: 'Skąd nazwa Mercedes?', a: 'Od imienia Mercédès Jellinek, córki Emila Jellinka – austriackiego przedsiębiorcy i jednego z pierwszych klientów firmy Daimler.' },
      { q: 'Klasa C czy Klasa E?', a: 'Klasa C jest mniejsza, tańsza w utrzymaniu i lepsza do miasta. Klasa E daje więcej miejsca i komfortu na długich trasach. W obu najważniejszy jest dobry silnik i brak rdzy.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – hity spod maski z gwiazdą: oceniamy silniki Mercedesa', url: 'https://www.auto-swiat.pl/uzywane/hity-spod-maski-z-gwiazda-oceniamy-silniki-mercedesa/r14k1k0' },
      { nazwa: 'Auto Świat – wszystko o silniku 2.1 CDI', url: 'https://www.auto-swiat.pl/porady/eksploatacja/wszystko-o-silniku-21-cdi-czy-mercedesowi-udal-sie-diesel/tnj93ex' },
      { nazwa: 'Mercedes-Benz Polska – oficjalna strona', url: 'https://www.mercedes-benz.pl/' }
    ],
    sprawdzono: '2026-11-15'
  }
};
