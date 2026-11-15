// Ręczne opisy największych marek w Polsce (SEO). Nacisk na rynek używanych: modele, silniki, na co uważać.
// Oceny silników na podstawie poradników Auto Świata, Otomoto i AutoCentrum (źródła przy każdej marce).
import type { OpisMarki } from '@/lib/opisy-marek';

const KOLUMNY: [string, string, string, string] = ['Model', 'Rodzaj auta', 'Na co uważać', 'Dla kogo'];
const WSTEP_SILNIKI =
  'Ocena dotyczy aut używanych i opiera się na doświadczeniach mechaników i poradnikach motoryzacyjnych. To uogólnienie: zadbany egzemplarz „gorszego” silnika może być lepszy niż zaniedbany „dobrego”. Przed zakupem zawsze sprawdź historię serwisową i stan konkretnego auta.';
const UWAGA_MODELE = 'W tabeli najpopularniejsze modele marki w Polsce według liczby zarejestrowanych aut. Kliknij nazwę, żeby zobaczyć kartę modelu z liczbami, generacjami i usterkami.';

export const OPISY_DUZE: Record<string, OpisMarki> = {
  volkswagen: {
    seoTytul: 'Volkswagen w Polsce – modele, silniki, opinie',
    seoOpis: 'Volkswagen w Polsce: najpopularniejsze modele (Golf, Passat, Polo, Tiguan), które silniki TSI i TDI warto kupić, a których unikać, plusy i minusy marki, liczby z CEPiK.',
    h1: 'Volkswagen w Polsce – modele, silniki i opinie',
    lead: 'Volkswagen to najczęściej spotykana marka samochodów w Polsce – w CEPiK jest ponad 2,5 mln aut z tym znaczkiem. Golf i Passat od lat królują na rynku używanych. Podpowiadamy, które modele i silniki warto kupić, a na co uważać.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Volkswagen',
        akapity: [
          'Volkswagen („samochód ludowy”) powstał w 1937 roku w Niemczech, a jego siedzibą jest Wolfsburg. Pierwszym wielkim przebojem był Garbus, a od 1974 roku – Golf, który stał się jednym z najlepiej sprzedających się aut w historii.',
          'Dziś Volkswagen stoi na czele dużego koncernu, do którego należą też m.in. Audi, Skoda, Seat, Cupra i Porsche. Dlatego te same silniki i skrzynie biegów znajdziesz w autach różnych marek – Golf, Octavia, Leon i A3 mają pod maską w dużej mierze to samo. Volkswagen ma też w Polsce fabryki: w Poznaniu powstaje Caddy, a we Wrześni – duży dostawczy Crafter.'
        ]
      },
      {
        h2: 'Volkswagen na polskim rynku',
        akapity: [
          'W Polsce Volkswagen to przede wszystkim rynek aut używanych: większość jeżdżących egzemplarzy to auta kilkunastoletnie, a duża część została sprowadzona z Niemiec i innych krajów Europy. Najczęściej spotkasz Golfa, Passata i Polo, a z nowszych modeli – SUV-y Tiguan i T-Roc.',
          'Duża popularność ma swoje plusy: części (oryginalne i zamienniki) są łatwo dostępne i niedrogie, a prawie każdy mechanik zna te auta. Minusem jest to, że wśród ogłoszeń sporo jest aut z nieznaną historią i cofniętym licznikiem – dlatego przy Volkswagenie sprawdzenie VIN jest szczególnie ważne.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Volkswagena w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Volkswagena i to, na co zwrócić uwagę przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Volkswagen Golf', adres: '/marki/volkswagen/golf/', typ: 'Kompakt (hatchback, kombi)', naped: 'Silniki 1.4 TSI do 2012 r. (łańcuch rozrządu), 2.0 TDI PD', cena: 'Uniwersalny wybór dla każdego – ogromny wybór aut i części' },
        { nazwa: 'Volkswagen Passat', adres: '/marki/volkswagen/passat/', typ: 'Klasa średnia (sedan, kombi)', naped: 'Duże przebiegi, 2.0 TDI z pompowtryskiwaczami, skrzynia DSG', cena: 'Rodzina i dużo kilometrów w trasie' },
        { nazwa: 'Volkswagen Polo', adres: '/marki/volkswagen/polo/', typ: 'Auto miejskie', naped: 'Silnik 1.2 HTP (trzycylindrowy), 1.2 TSI pierwszej generacji', cena: 'Miasto, pierwsze auto' },
        { nazwa: 'Volkswagen Tiguan', adres: '/marki/volkswagen/tiguan/', typ: 'SUV kompaktowy', naped: 'Pierwsza generacja z 1.4 TSI i 2.0 TSI (zużycie oleju)', cena: 'Rodzina, wyższa pozycja za kierownicą, napęd 4x4' },
        { nazwa: 'Volkswagen Touran', adres: '/marki/volkswagen/touran/', typ: 'Minivan (5–7 miejsc)', naped: 'Starsze 1.4 TSI i 2.0 TDI PD, zużyte wnętrza', cena: 'Rodzina z dziećmi, dużo bagażu' },
        { nazwa: 'Volkswagen T-Roc', adres: '/marki/volkswagen/t-roc/', typ: 'Mały SUV', naped: 'Nowsze auto – sprawdź historię serwisową i akcje serwisowe', cena: 'Miasto i trasa, młody egzemplarz z polskiego salonu' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.2 i 1.4 TSI (EA211, od ok. 2012 r.)', ocena: 'polecany', opis: 'Nowsza generacja małych benzyniaków turbo z paskiem rozrządu. Mało pali, niewiele zużywa oleju i jest uznawana za trwałą.' },
        { nazwa: '1.6 MPI (8V)', ocena: 'polecany', opis: 'Prosty, trwały benzyniak bez turbo z tanimi częściami. Dobrze znosi LPG, ale sporo pali, a wiele egzemplarzy jest mocno zużytych.' },
        { nazwa: '1.9 TDI', ocena: 'polecany', opis: 'Legendarny, trwały diesel z tanimi częściami. Najlepsze są starsze wersje z pompą rozdzielaczową. Uwaga na wersję BXE (105 KM, 2006–2009) – ryzyko obrócenia panewek.' },
        { nazwa: '1.6 i 2.0 TDI common rail (od ok. 2009 r.)', ocena: 'warunkowo', opis: 'Udane i oszczędne, ale wrażliwe na jakość paliwa (wtryskiwacze) i na jazdę tylko po mieście (filtr DPF). Olej lepiej wymieniać częściej niż co 30 tys. km.' },
        { nazwa: '1.2 i 1.4 TSI (EA111, do ok. 2012 r.)', ocena: 'omijaj', opis: 'Rozciągający się łańcuch rozrządu (nawet po 40–50 tys. km), w 1.4 TSI 122/125 KM pękające tłoki, zużycie oleju i nagar na zaworach.' },
        { nazwa: '1.8 i 2.0 TSI (EA888, wczesne roczniki)', ocena: 'omijaj', opis: 'Nadmierne zużycie oleju przez wadliwe pierścienie tłokowe. Nowsze wersje są poprawione – sprawdź rocznik i historię napraw.' },
        { nazwa: '2.0 TDI z pompowtryskiwaczami (PD)', ocena: 'omijaj', opis: 'Zawodne wtryskiwacze, pękające głowice i awaryjny napęd pompy oleju, który mógł doprowadzić do zatarcia silnika.' },
        { nazwa: '1.4 TDI (trzycylindrowy)', ocena: 'omijaj', opis: 'Nadmierny luz osiowy wału korbowego, często po 150–200 tys. km. Do tego głośna praca i drgania.' }
      ]
    },
    plusy: [
      'Ogromny wybór aut na rynku wtórnym – łatwo znaleźć wersję i rocznik, jakie chcesz.',
      'Tanie i łatwo dostępne części, także zamienniki.',
      'Każdy mechanik zna te auta.',
      'Dobre wyciszenie i wygodne wnętrza, auta dobrze trzymają wartość.'
    ],
    minusy: [
      'Dużo aut sprowadzonych z nieznaną historią i cofniętym licznikiem.',
      'Kilka popularnych silników (pierwsze 1.4 TSI, 2.0 TDI PD) ma poważne wady.',
      'Skrzynie DSG (zwłaszcza 7-biegowa „sucha” DQ200) potrafią być drogie w naprawie.',
      'Za znaczek trzeba zapłacić więcej niż za podobną Skodę czy Seata.'
    ],
    faq: [
      { q: 'Który silnik Volkswagena jest najlepszy?', a: 'Wśród używanych za najtrwalsze uchodzą 1.9 TDI (zwłaszcza starsze wersje), prosty benzynowy 1.6 MPI oraz nowsze benzyniaki turbo 1.2 i 1.4 TSI z rodziny EA211 (od ok. 2012 r.). Odradza się pierwsze 1.4 TSI (EA111) i 2.0 TDI z pompowtryskiwaczami.' },
      { q: 'Czy Volkswagen jest awaryjny?', a: 'Nie ogólnie – wiele zależy od silnika i skrzyni. Auta z udanymi silnikami (1.9 TDI, 1.6 MPI, nowsze TSI) są trwałe i tanie w naprawach. Problemy sprawiają konkretne wersje, np. 1.4 TSI do 2012 roku czy 2.0 TDI PD.' },
      { q: 'Czy warto kupić Volkswagena z DSG?', a: 'Tak, ale ostrożnie. Skrzynie DSG z mokrym sprzęgłem (6-biegowa DQ250) są trwalsze niż 7-biegowa „sucha” DQ200, montowana z małymi silnikami. Przed zakupem warto sprawdzić historię serwisu skrzyni i zrobić jazdę próbną.' },
      { q: 'Golf czy Passat?', a: 'Golf jest mniejszy, tańszy w utrzymaniu i lepszy do miasta. Passat daje dużo więcej miejsca i lepiej sprawdza się w trasie, ale używane egzemplarze często mają bardzo duże przebiegi.' },
      { q: 'Czy Volkswagen i Skoda to te same auta?', a: 'Należą do jednego koncernu i korzystają z tych samych silników, skrzyń i płyt podłogowych. Skoda jest zwykle tańsza i bardziej praktyczna, a Volkswagen lepiej wykończony i lepiej trzyma wartość.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki Volkswagena: które warto kupić, a które omijać (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/sprawdzamy-silniki-volkswagena-ktore-warto-kupic-a-ktore-omijac-szerokim-lukiem/y56x14w' },
      { nazwa: 'Auto Świat – najlepsze i najgorsze silniki TDI', url: 'https://www.auto-swiat.pl/uzywane/co-warto-kupic/najlepsze-i-najgorsze-silniki-tdi-czyli-diesle-volkswagena/j430zfw' },
      { nazwa: 'Volkswagen Polska – oficjalna strona', url: 'https://www.volkswagen.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  opel: {
    seoTytul: 'Opel w Polsce – modele, silniki, opinie',
    seoOpis: 'Opel w Polsce: Astra, Corsa, Vectra, Zafira, Insignia – historia marki, które silniki Opla warto kupić, a których unikać, plusy i minusy, liczby z CEPiK.',
    h1: 'Opel w Polsce – modele, silniki i opinie',
    lead: 'Opel to jedna z najpopularniejszych marek w Polsce – w CEPiK jest ponad 2 mln aut z błyskawicą na masce. Astra przez lata była produkowana w Gliwicach i do dziś jest jednym z najczęstszych aut na naszych drogach. Podpowiadamy, które Ople i silniki warto kupić.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Opel',
        akapity: [
          'Opel powstał w 1862 roku w niemieckim Rüsselsheim jako producent maszyn do szycia, a samochody buduje od 1899 roku. Przez większość XX wieku (1929–2017) należał do amerykańskiego General Motors, potem do francuskiego koncernu PSA, a od 2021 roku jest częścią grupy Stellantis – razem z m.in. Peugeotem, Citroënem i Fiatem.',
          'Dlatego nowsze Ople (np. Corsa F, Astra L, Mokka B) to technicznie bliscy krewni Peugeotów i Citroënów – mają te same silniki i skrzynie. Starsze Ople mają własne silniki Opla albo jednostki od partnerów (np. diesle Fiata i Isuzu).'
        ]
      },
      {
        h2: 'Opel w Polsce',
        akapity: [
          'Opel ma silne polskie korzenie: od 1998 roku w Gliwicach produkowano Astrę, a później także inne modele. Dziś zakład w Gliwicach należy do Stellantisa i produkuje duże auta dostawcze.',
          'Na rynku używanych najczęściej spotkasz Astrę, Corsę i Vectrę, a także minivany Zafira i Meriva. Ople są tańsze od porównywalnych Volkswagenów, a części do nich łatwo dostępne. Wiele aut pochodzi z polskich salonów, co ułatwia sprawdzenie historii.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Opla w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Opla i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Opel Astra', adres: '/marki/opel/astra/', typ: 'Kompakt (hatchback, kombi, sedan)', naped: 'Diesel 1.7 CDTI (Isuzu) w Astrze J, skrzynie M32 i Easytronic', cena: 'Uniwersalny, niedrogi kompakt dla każdego' },
        { nazwa: 'Opel Corsa', adres: '/marki/opel/corsa/', typ: 'Auto miejskie', naped: 'Trzycylindrowy 1.0 (łańcuch rozrządu), Easytronic', cena: 'Miasto, pierwsze auto' },
        { nazwa: 'Opel Vectra', adres: '/marki/opel/vectra/', typ: 'Klasa średnia', naped: 'Wiek aut, diesle 2.2 DTI i 3.0 V6 CDTI', cena: 'Tanie, duże auto na trasę' },
        { nazwa: 'Opel Zafira', adres: '/marki/opel/zafira/', typ: 'Minivan (7 miejsc)', naped: 'Diesle 1.9 CDTI 16V (kolektor), skrzynia M32', cena: 'Rodzina, która potrzebuje 7 miejsc' },
        { nazwa: 'Opel Meriva', adres: '/marki/opel/meriva/', typ: 'Mały minivan', naped: 'Easytronic, 1.7 CDTI', cena: 'Seniorzy i rodziny – wysoka pozycja, łatwe wsiadanie' },
        { nazwa: 'Opel Insignia', adres: '/marki/opel/insignia/', typ: 'Klasa średnia', naped: 'Diesel 2.0 CDTI (koło dwumasowe, DPF), skrzynie M32', cena: 'Dużo kilometrów w trasie, komfort' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.4 i 1.6 (benzyna bez turbo)', ocena: 'polecany', opis: 'Proste, trwałe i tanie w naprawach. Dobrze znoszą instalację LPG.' },
        { nazwa: '1.8 Ecotec', ocena: 'polecany', opis: 'Prosty i trwały benzyniak z niedrogimi naprawami. Jak na pojemność ma przeciętne osiągi.' },
        { nazwa: '1.4 Turbo (od 2009 r.)', ocena: 'polecany', opis: 'Udany silnik turbo bez poważnych awarii, dobrze współpracuje z LPG. Zdarzają się drobne wycieki (pokrywa zaworów, chłodnica oleju).' },
        { nazwa: '1.9 CDTI', ocena: 'warunkowo', opis: 'Łatwy w naprawie diesel (konstrukcja Fiata) z dobrymi osiągami w wersjach 120 i 150 KM. Wersja 16V ma awaryjne klapki w kolektorze dolotowym.' },
        { nazwa: '1.3 CDTI', ocena: 'warunkowo', opis: 'Oszczędny i trwały, ale tylko w zadbanych egzemplarzach. Nie lubi zaniedbań serwisowych i dynamicznej jazdy.' },
        { nazwa: '1.0 (trzycylindrowy)', ocena: 'omijaj', opis: 'Słaba kultura pracy, problemy z łańcuchem rozrządu i cewkami zapłonowymi.' },
        { nazwa: '1.7 CDTI (Isuzu)', ocena: 'omijaj', opis: 'Diesel od Isuzu: wycieki oleju, szybkie zużycie osprzętu i trudny serwis. W Astrze J dodatkowo charakterystyczny „gulgot” silnika.' },
        { nazwa: '2.2 benzyna z wtryskiem bezpośrednim i 3.0 V6 CDTI', ocena: 'omijaj', opis: 'W 2.2 Direct zrywający się łańcuch rozrządu i awarie układu paliwowego, w 3.0 V6 CDTI ryzyko zatarcia silnika.' }
      ]
    },
    plusy: [
      'Niższe ceny niż w porównywalnych Volkswagenach.',
      'Łatwo dostępne i tanie części, wielu mechaników zna te auta.',
      'Udane, proste benzyniaki, które dobrze znoszą LPG.',
      'Dużo aut z polskich salonów.'
    ],
    minusy: [
      'Słabe punkty skrzyń biegów: zautomatyzowana Easytronic i manualne M32 oraz M20.',
      'Kilka ryzykownych diesli (1.7 CDTI, 2.2 DTI, 3.0 V6 CDTI).',
      'Starsze Ople bywają podatne na rdzę.',
      'Auta szybciej tracą na wartości niż Volkswageny czy Toyoty.'
    ],
    faq: [
      { q: 'Który silnik Opla jest najlepszy?', a: 'Za najtrwalsze uchodzą proste benzyniaki 1.4 i 1.6 bez turbo, 1.8 Ecotec oraz 1.4 Turbo. Wśród diesli najlepszą opinię ma 1.9 CDTI w wersjach 8-zaworowych. Odradza się trzycylindrowy 1.0, 1.7 CDTI i 3.0 V6 CDTI.' },
      { q: 'Czy Opel to niemiecka marka?', a: 'Opel ma siedzibę w niemieckim Rüsselsheim, ale od 2017 roku nie należy już do Niemców ani do Amerykanów (GM). Najpierw kupił go francuski PSA, a od 2021 roku Opel jest częścią międzynarodowej grupy Stellantis.' },
      { q: 'Czy Opel Astra była produkowana w Polsce?', a: 'Tak. Od 1998 roku Astrę (kilku generacji) produkowano w fabryce Opla w Gliwicach. Dziś zakład należy do Stellantisa i produkuje auta dostawcze.' },
      { q: 'Na jakie skrzynie biegów uważać w Oplu?', a: 'Na zautomatyzowaną skrzynię Easytronic oraz manualne M32 (łożyska) i M20. Przy zakupie warto posłuchać, czy skrzynia nie wyje, i sprawdzić, czy biegi wchodzą płynnie.' },
      { q: 'Czy warto kupić używanego Opla?', a: 'Tak, jeśli wybierzesz udany silnik i sprawdzisz skrzynię biegów. Ople są tańsze od konkurencji, a części do nich tanie i łatwo dostępne.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – polecane silniki Opla i ryzykowne motory (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/polecane-silniki-opla-latwo-o-dobra-jednostke-ale-sa-i-ryzykowne-motory-ktorych/28t71gn' },
      { nazwa: 'Auto Świat – 1.4 T: udany silnik Opla, dobry do LPG', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/14-t-udany-silnik-opla-dobry-rowniez-do-lpg/ctyek0m' },
      { nazwa: 'AutoCentrum – Opel Astra J: poradnik kupującego', url: 'https://www.autocentrum.pl/publikacje/porady/opel-astra-j-2009-2019-poradnik-kupujacego/' }
    ],
    sprawdzono: '2026-11-15'
  },

  ford: {
    seoTytul: 'Ford w Polsce – modele, silniki, opinie',
    seoOpis: 'Ford w Polsce: Focus, Fiesta, Mondeo, Kuga – historia marki, które silniki Forda warto kupić (Duratec, TDCi), a których unikać (1.0 EcoBoost), plusy i minusy.',
    h1: 'Ford w Polsce – modele, silniki i opinie',
    lead: 'Ford to jedna z najpopularniejszych marek w Polsce – Focus, Fiesta i Mondeo jeżdżą w setkach tysięcy egzemplarzy. Fordy słyną z dobrego prowadzenia i tanich części. Podpowiadamy, które modele i silniki warto kupić, a których lepiej unikać.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Ford',
        akapity: [
          'Ford Motor Company założył w 1903 roku Henry Ford w Detroit w USA. Jego Model T z 1908 roku był pierwszym autem produkowanym masowo na taśmie montażowej. Europejskie Fordy, które jeżdżą po Polsce, były jednak projektowane i produkowane głównie w Niemczech, Wielkiej Brytanii i Hiszpanii.',
          'W ostatnich latach Ford mocno zmienił ofertę w Europie: zakończył produkcję Mondeo, Fiesty i Focusa, a postawił na SUV-y (Puma, Kuga), auta elektryczne, pickupa Ranger i dostawcze Transity.'
        ]
      },
      {
        h2: 'Ford na polskim rynku',
        akapity: [
          'W Polsce najczęściej spotkasz Focusa, Fiestę i Mondeo – to głównie auta używane, w dużej części sprowadzone. Fordy chwalone są za bardzo dobre prowadzenie i tanie części, krytykowane – za podatność starszych egzemplarzy na rdzę.',
          'Z nowszych modeli najpopularniejsza jest Kuga. Ford to też jedna z najważniejszych marek aut dostawczych w Polsce dzięki Transitom.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Forda w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Forda i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Ford Focus', adres: '/marki/ford/focus/', typ: 'Kompakt (hatchback, kombi, sedan)', naped: '1.6 TDCi 16V, 1.0 EcoBoost, skrzynia PowerShift', cena: 'Dla każdego, kto lubi dobre prowadzenie' },
        { nazwa: 'Ford Fiesta', adres: '/marki/ford/fiesta/', typ: 'Auto miejskie', naped: '1.0 EcoBoost (pasek w oleju), rdza w starszych', cena: 'Miasto, pierwsze auto' },
        { nazwa: 'Ford Mondeo', adres: '/marki/ford/mondeo/', typ: 'Klasa średnia', naped: '1.8 TDCi i stare 2.0 TDDi, duże przebiegi', cena: 'Tanie, duże auto na trasę' },
        { nazwa: 'Ford Kuga', adres: '/marki/ford/kuga/', typ: 'SUV kompaktowy', naped: '1.6 EcoBoost (przegrzewanie – sprawdź akcje serwisowe)', cena: 'Rodzina, napęd 4x4' },
        { nazwa: 'Ford S-Max / Galaxy', adres: '/marki/ford/s-max/', typ: 'Duży minivan (7 miejsc)', naped: 'Diesle 2.0 TDCi (DPF, EGR), PowerShift', cena: 'Duża rodzina' },
        { nazwa: 'Ford C-Max', adres: '/marki/ford/c-max/', typ: 'Kompaktowy minivan', naped: 'Jak w Focusie: 1.6 TDCi 16V, 1.0 EcoBoost', cena: 'Rodzina w mieście' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.6 Duratec / Zetec-SE (Sigma)', ocena: 'polecany', opis: 'Prosty, trwały i tani w naprawach benzyniak. Pasek rozrządu warto wymieniać co ok. 120 tys. km. Najstarsze egzemplarze (Focus I) mogą zużywać olej.' },
        { nazwa: '2.0 Duratec (konstrukcja Mazdy)', ocena: 'polecany', opis: 'Trwała mechanika i łańcuch rozrządu. Minusy: zużycie oleju i słaba współpraca z LPG.' },
        { nazwa: '2.0 TDCi (konstrukcja PSA)', ocena: 'polecany', opis: 'Solidny diesel, zwłaszcza po modernizacji z 2011 roku. W starszych autach trzeba liczyć się z kłopotami z DPF i zaworem EGR.' },
        { nazwa: '1.6 TDCi 8-zaworowy', ocena: 'polecany', opis: 'Chwalony przez mechaników, w przeciwieństwie do wcześniejszej wersji 16-zaworowej.' },
        { nazwa: '1.6 EcoBoost', ocena: 'warunkowo', opis: 'Tylko egzemplarze po akcjach serwisowych producenta – nienaprawione auta grożą przegrzaniem silnika.' },
        { nazwa: '1.0 EcoBoost', ocena: 'omijaj', opis: 'Mały silnik turbo z paskiem rozrządu pracującym w oleju. Problemy zaczynają się zwykle po 120–150 tys. km, a pęknięcie głowicy oznacza bardzo drogą naprawę.' },
        { nazwa: '1.6 TDCi 16-zaworowy (zwłaszcza 109 KM)', ocena: 'omijaj', opis: 'Poważne problemy z turbosprężarką i smarowaniem. Przy zakupie potrzebna duża ostrożność.' },
        { nazwa: '1.8 TDCi i 2.0 TDDi (stary diesel Forda)', ocena: 'omijaj', opis: 'Kosztowne naprawy układu paliwowego, zwykle bardzo duże przebiegi. Stary 2.0 TDDi z Mondeo (2000–2007) ma wyjątkowo złą opinię.' }
      ]
    },
    plusy: [
      'Bardzo dobre prowadzenie – Fordy należą do najprzyjemniej jeżdżących aut w swoich klasach.',
      'Tanie i łatwo dostępne części.',
      'Udane, proste benzyniaki Duratec.',
      'Duży wybór aut na rynku wtórnym.'
    ],
    minusy: [
      'Starsze Fordy są podatne na rdzę (progi, nadkola, podwozie).',
      'Problemy małych silników EcoBoost i 16-zaworowego 1.6 TDCi.',
      'Zautomatyzowana skrzynia PowerShift w niektórych modelach sprawia kłopoty.',
      'Nowe Fordy osobowe w Europie znikają z oferty – mniej nowych modeli.'
    ],
    faq: [
      { q: 'Który silnik Forda jest najlepszy?', a: 'Za najtrwalsze uchodzą benzynowe 1.6 Duratec i 2.0 Duratec oraz diesel 2.0 TDCi (konstrukcja PSA) i 8-zaworowy 1.6 TDCi. Odradza się 1.0 EcoBoost, 16-zaworowy 1.6 TDCi i starsze diesle 1.8 TDCi oraz 2.0 TDDi.' },
      { q: 'Czy silnik 1.0 EcoBoost jest awaryjny?', a: 'Ma złą opinię wśród mechaników. Pasek rozrządu pracuje w oleju i z czasem się rozpada, a poważną awarią jest pęknięcie głowicy – zwykle po 120–150 tys. km. Jeśli kupujesz auto z tym silnikiem, sprawdź historię wymiany paska i oleju.' },
      { q: 'Czy Ford rdzewieje?', a: 'Starsze Fordy (m.in. Focus I i II, Mondeo, Fiesta) są znane z rdzy na progach, nadkolach i podwoziu. Przed zakupem warto obejrzeć auto od spodu, najlepiej na podnośniku.' },
      { q: 'Focus czy Golf?', a: 'Focus lepiej się prowadzi i zwykle jest tańszy przy tym samym roczniku. Golf ma lepiej wykończone wnętrze i lepiej trzyma wartość. W obu przypadkach ważniejszy od marki jest wybór dobrego silnika.' },
      { q: 'Czy Ford wciąż produkuje Focusa i Fiestę?', a: 'Nie. Ford zakończył w Europie produkcję Fiesty, Mondeo i Focusa. Na rynku zostały auta używane, a nowa oferta Forda to głównie SUV-y, elektryki i auta dostawcze.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki Forda: niedrogie i dość trwałe (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/sprawdzamy-silniki-forda-to-konstrukcje-niedrogie-i-dosc-trwale/3gbq36k' },
      { nazwa: 'Otomoto News – silnik 1.0 EcoBoost: opinie, awarie', url: 'https://www.otomoto.pl/news/1-0-ecoboost-awarie-opinie-wady-i-zalety' },
      { nazwa: 'Auto Świat – EcoBoost z mokrym paskiem: jak uniknąć katastrofy', url: 'https://www.auto-swiat.pl/porady/silniki-ford-ecoboost-z-mokrym-paskiem-jak-je-rozpoznac-i-uniknac-katastrofy/9lmq0t0' }
    ],
    sprawdzono: '2026-11-15'
  },

  toyota: {
    seoTytul: 'Toyota w Polsce – modele, silniki, opinie',
    seoOpis: 'Toyota w Polsce: Corolla, Yaris, RAV4, C-HR – hybrydy, które silniki Toyoty warto kupić (1.0, ZR, hybrydy), a których unikać (1.33, 2.0 i 2.2 D-4D), plusy i minusy.',
    h1: 'Toyota w Polsce – modele, silniki i opinie',
    lead: 'Toyota od lat jest liderem sprzedaży nowych aut w Polsce i ma opinię jednej z najmniej awaryjnych marek. To też pionier hybryd – w Polsce jeżdżą ich setki tysięcy. Podpowiadamy, które Toyoty i silniki warto kupić, a które mają słabe punkty.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Toyota',
        akapity: [
          'Toyota Motor Corporation powstała w 1937 roku w Japonii, a założył ją Kiichiro Toyoda. Dziś to jeden z największych producentów samochodów na świecie. Do koncernu należy też marka premium Lexus.',
          'W 1997 roku Toyota pokazała Priusa – pierwsze masowo produkowane auto hybrydowe. Od tego czasu hybryda (silnik benzynowy plus elektryczny, bez ładowania z gniazdka) stała się znakiem rozpoznawczym marki.'
        ]
      },
      {
        h2: 'Toyota w Polsce',
        akapity: [
          'Toyota ma w Polsce fabryki w Wałbrzychu i Jelczu-Laskowicach, gdzie powstają silniki i elementy napędów hybrydowych dla aut produkowanych w całej Europie. Od lat Toyota jest najczęściej kupowaną marką nowych samochodów w Polsce.',
          'Najwięcej jest Corolli i Yarisów, a z SUV-ów – RAV4 i C-HR. Dużo Toyot pochodzi z polskich salonów, co ułatwia sprawdzenie historii. Toyoty dobrze trzymają wartość, więc używane egzemplarze są zwykle droższe niż konkurencja w tym samym wieku.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Toyoty w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Toyoty i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Toyota Corolla', adres: '/marki/toyota/corolla/', typ: 'Kompakt (sedan, hatchback, kombi)', naped: 'Starsze 1.6 i 1.8 ZZ (zużycie oleju), diesle 2.0 i 2.2 D-4D', cena: 'Dla każdego, kto szuka bezproblemowego auta' },
        { nazwa: 'Toyota Yaris', adres: '/marki/toyota/yaris/', typ: 'Auto miejskie', naped: '1.33 Dual VVT-i, zautomatyzowana skrzynia MMT', cena: 'Miasto, pierwsze auto' },
        { nazwa: 'Toyota RAV4', adres: '/marki/toyota/rav4/', typ: 'SUV', naped: 'Diesle 2.0 i 2.2 D-4D (uszczelka pod głowicą)', cena: 'Rodzina, napęd 4x4 – najlepiej hybryda' },
        { nazwa: 'Toyota Avensis', adres: '/marki/toyota/avensis/', typ: 'Klasa średnia', naped: 'Diesle 2.0 i 2.2 D-4D, starsze 1.8 ZZ', cena: 'Trasa, rodzina' },
        { nazwa: 'Toyota Auris', adres: '/marki/toyota/auris/', typ: 'Kompakt', naped: '1.33 Dual VVT-i, MMT, diesle D-4D', cena: 'Uniwersalny – najlepiej z hybrydą lub 1.6 ZR' },
        { nazwa: 'Toyota C-HR', adres: '/marki/toyota/c-hr/', typ: 'Crossover', naped: 'Mały bagażnik i ciasne tylne siedzenia, słaba widoczność do tyłu', cena: 'Miasto, para lub singiel – hybryda' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: 'Hybrydy 1.5, 1.8 i 2.5 (benzyna + elektryk)', ocena: 'polecany', opis: 'Bardzo trwałe napędy bez sprzęgła, rozrusznika i paska wielorowkowego. W mieście palą niewiele. Bateria zwykle wytrzymuje wiele lat.' },
        { nazwa: '1.0 (trzycylindrowy, Aygo, Yaris)', ocena: 'polecany', opis: 'Prosta budowa, wysoka trwałość i niskie koszty napraw. Słabe osiągi i głośna praca.' },
        { nazwa: '1.6–2.0 benzyna (seria ZR)', ocena: 'polecany', opis: 'Bardzo mało usterek, prawie bez zmian przez ponad 10 lat. Uwaga tylko na zaniedbane egzemplarze.' },
        { nazwa: '1.4 D-4D', ocena: 'warunkowo', opis: 'Najlepszy z diesli Toyoty, ale drogie wtryskiwacze, kłopotliwy filtr DPF i często bardzo duże przebiegi.' },
        { nazwa: '1.33 Dual VVT-i', ocena: 'omijaj', opis: 'Usterkowa sonda lambda i nagar na tłokach. Naprawa wymaga zdjęcia głowicy, co podnosi koszty.' },
        { nazwa: '1.6 i 1.8 VVT-i (seria ZZ, do ok. 2004 r.)', ocena: 'omijaj', opis: 'Podwyższone zużycie oleju. Problem poprawiono około 2004 roku.' },
        { nazwa: '2.0 i 2.2 D-4D (seria AD)', ocena: 'omijaj', opis: 'Problemy z uszczelką pod głowicą i erozją aluminiowego bloku silnika. Kolejne naprawy są kosztowne.' },
        { nazwa: '3.0 D-4D (Land Cruiser, Hilux)', ocena: 'omijaj', opis: 'Problemy z wtryskiwaczami, które mogą uszkodzić gładzie cylindrów.' }
      ]
    },
    plusy: [
      'Opinia jednej z najmniej awaryjnych marek – zwłaszcza z hybrydą lub prostym benzyniakiem.',
      'Bardzo trwałe i oszczędne w mieście hybrydy.',
      'Dużo aut z polskich salonów z udokumentowaną historią.',
      'Dobrze trzymają wartość przy odsprzedaży.'
    ],
    minusy: [
      'Używane Toyoty są droższe od konkurencji w tym samym wieku.',
      'Diesle 2.0 i 2.2 D-4D mają poważne wady.',
      'Wnętrza wykończone mniej starannie niż w autach niemieckich.',
      'Hybrydy są popularne wśród złodziei – warto zadbać o zabezpieczenie i sprawdzić koszt AC.'
    ],
    faq: [
      { q: 'Czy Toyota jest niezawodna?', a: 'Toyota ma opinię jednej z najmniej awaryjnych marek, zwłaszcza w wersjach z hybrydą i prostymi benzyniakami (1.0, seria ZR). Słabsze punkty to diesle 2.0 i 2.2 D-4D oraz benzynowy 1.33 Dual VVT-i.' },
      { q: 'Czy warto kupić używaną hybrydę Toyoty?', a: 'Tak, to jeden z najbezpieczniejszych wyborów na rynku używanych. Napęd hybrydowy Toyoty nie ma sprzęgła, rozrusznika ani dwumasu, a bateria zwykle wytrzymuje wiele lat. Warto sprawdzić historię serwisową i stan baterii w ASO.' },
      { q: 'Który diesel Toyoty jest najlepszy?', a: 'Najlepszą opinię ma mały 1.4 D-4D. Większe 2.0 i 2.2 D-4D z serii AD mają problemy z uszczelką pod głowicą i lepiej ich unikać.' },
      { q: 'Gdzie Toyota produkuje w Polsce?', a: 'Toyota ma fabryki w Wałbrzychu i Jelczu-Laskowicach. Powstają tam silniki i elementy napędów hybrydowych dla europejskich fabryk Toyoty.' },
      { q: 'Corolla czy Auris?', a: 'To bliscy krewni – Auris przez kilka lat zastępował w Europie Corollę w wersji hatchback, a od 2019 roku wróciła nazwa Corolla. W obu najlepszy wybór to hybryda albo benzynowy 1.6 z serii ZR.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – silniki w Toyotach: które awaryjne, a które godne zaufania (2023)', url: 'https://www.auto-swiat.pl/uzywane/co-warto-kupic/silniki-w-toyotach-ktore-sa-awaryjne-a-ktore-godne-zaufania/pt8qrbk' },
      { nazwa: 'Otomoto News – używana Toyota Auris II: jaki silnik wybrać', url: 'https://www.otomoto.pl/news/uzywana-toyota-auris-ii-mechanik-duzo-tu-nie-zarobi-opinie-typowe-usterki-jaki-silnik-wybrac' },
      { nazwa: 'Toyota Polska – oficjalna strona', url: 'https://www.toyota.pl/' }
    ],
    sprawdzono: '2026-11-15'
  },

  skoda: {
    seoTytul: 'Skoda w Polsce – modele, silniki, opinie',
    seoOpis: 'Skoda w Polsce: Octavia, Fabia, Superb, Kodiaq – historia marki, które silniki Skody warto kupić (1.0 MPI, 1.6 TDI, 1.9 TDI), a których unikać (1.2 HTP, 1.4 TSI), plusy i minusy.',
    h1: 'Skoda w Polsce – modele, silniki i opinie',
    lead: 'Skoda to jedna z najczęściej kupowanych marek w Polsce, a Octavia od lat jest symbolem praktycznego auta rodzinnego i flotowego. Technicznie Skody to bliscy krewni Volkswagenów. Podpowiadamy, które modele i silniki warto kupić.',
    sekcje: [
      {
        h2: 'Skąd pochodzi Skoda',
        akapity: [
          'Skoda wywodzi się z firmy Laurin & Klement, założonej w 1895 roku w czeskim Mladá Boleslav – najpierw produkowała rowery, potem motocykle i samochody. Od 1991 roku Skoda należy do koncernu Volkswagena.',
          'Dzięki temu nowoczesne Skody korzystają z tych samych silników, skrzyń i płyt podłogowych co Volkswagen, Audi i Seat. Skoda wyróżnia się przy tym praktycznością: dużymi bagażnikami i pomysłowymi drobiazgami, jak skrobaczka w klapce wlewu paliwa czy parasol w drzwiach.'
        ]
      },
      {
        h2: 'Skoda w Polsce',
        akapity: [
          'Skoda od lat należy do najczęściej kupowanych marek nowych aut w Polsce, a Octavia to jedno z najpopularniejszych aut flotowych i taksówkowych. Duża część Skód pochodzi z polskich salonów.',
          'W CEPiK najwięcej jest Octavii i Fabii, a dalej Superbów oraz SUV-ów Kodiaq, Kamiq i Karoq. Wciąż jeżdżą też tysiące starych Skód 105/120, Favoritów i Felicii.'
        ]
      }
    ],
    oferta: {
      h2: 'Najpopularniejsze modele Skody w Polsce',
      wstep: 'Najczęściej spotykane w Polsce modele Skody i na co uważać przy zakupie używanego egzemplarza.',
      kolumny: KOLUMNY,
      modele: [
        { nazwa: 'Skoda Octavia', adres: '/marki/skoda/octavia/', typ: 'Kompakt (liftback, kombi)', naped: 'Duże przebiegi po flotach i taksówkach, 1.4 TSI do 2012 r., DSG7', cena: 'Rodzina, flota, dużo kilometrów' },
        { nazwa: 'Skoda Fabia', adres: '/marki/skoda/fabia/', typ: 'Auto miejskie', naped: 'Silnik 1.2 HTP (trzycylindrowy), 1.2 TSI pierwszej generacji', cena: 'Miasto, pierwsze auto' },
        { nazwa: 'Skoda Superb', adres: '/marki/skoda/superb/', typ: 'Klasa średnia (liftback, kombi)', naped: '2.0 TDI z pompowtryskiwaczami, 1.8 TSI (zużycie oleju)', cena: 'Rodzina, dużo miejsca z tyłu, trasa' },
        { nazwa: 'Skoda Kodiaq', adres: '/marki/skoda/kodiaq/', typ: 'Duży SUV (5–7 miejsc)', naped: 'Nowsze auto – sprawdź historię serwisową skrzyni DSG', cena: 'Duża rodzina' },
        { nazwa: 'Skoda Kamiq', adres: '/marki/skoda/kamiq/', typ: 'Mały SUV', naped: 'Mały silnik 1.0 TSI – regularna wymiana oleju', cena: 'Miasto, wyższa pozycja za kierownicą' },
        { nazwa: 'Skoda Karoq', adres: '/marki/skoda/karoq/', typ: 'SUV kompaktowy', naped: 'Skrzynia DSG7 w wersjach z małymi silnikami', cena: 'Rodzina, praktyczny SUV' }
      ],
      uwaga: UWAGA_MODELE
    },
    silniki: {
      wstep: WSTEP_SILNIKI,
      lista: [
        { nazwa: '1.0 MPI (trzycylindrowy, bez turbo)', ocena: 'polecany', opis: 'Solidny, oszczędny i tani w częściach. W najstarszych autach zdarza się piszcząca pompa wody.' },
        { nazwa: '1.4 16V (80 i 86 KM)', ocena: 'polecany', opis: 'Bardzo trwałe wersje z tanimi częściami. Odradza się słabszą wersję 75 KM, która zużywa olej.' },
        { nazwa: '1.9 TDI', ocena: 'polecany', opis: 'Jeden z najtrwalszych i najtańszych w naprawach diesli, choć wiele egzemplarzy jest mocno wyeksploatowanych. Unikaj wersji BXE (2006–2009).' },
        { nazwa: '1.6 TDI', ocena: 'polecany', opis: 'Bardzo trwały jak na nowoczesny diesel, z niskim spalaniem. Uważaj na filtr DPF i wymieniaj olej częściej niż w trybie long life.' },
        { nazwa: '1.2 HTP (trzycylindrowy)', ocena: 'omijaj', opis: 'Awarie cewek, łańcucha rozrządu i gniazd zaworowych. Producent nie przewidział remontu silnika.' },
        { nazwa: '1.2 TSI (pierwsza generacja)', ocena: 'omijaj', opis: 'Problemy z łańcuchem rozrządu, turbosprężarką i elektroniką sterującą.' },
        { nazwa: '1.4 TSI (do ok. 2012 r.)', ocena: 'omijaj', opis: 'Ryzyko pękania tłoków (wersje 122 i 125 KM), rozciągający się łańcuch rozrządu i nagar na zaworach.' },
        { nazwa: '1.8 i 2.0 TSI (EA888, wczesne) oraz 2.0 TDI PD', ocena: 'omijaj', opis: 'W benzynowych TSI nadmierne zużycie oleju, w 2.0 TDI z pompowtryskiwaczami pękające głowice i awaryjny napęd pompy oleju.' }
      ]
    },
    plusy: [
      'Bardzo praktyczne auta – duże bagażniki i dużo miejsca w środku.',
      'Ta sama technika co w Volkswagenie, ale niższa cena.',
      'Dużo aut z polskich salonów, łatwo dostępne części.',
      'Udane diesle 1.9 TDI i 1.6 TDI.'
    ],
    minusy: [
      'Wiele używanych Octavii i Superbów ma za sobą flotę lub taksówkę i bardzo duże przebiegi.',
      'Te same wadliwe silniki co w Volkswagenie (pierwsze 1.2 i 1.4 TSI, 1.2 HTP).',
      'Skrzynia DSG7 „sucha” bywa droga w naprawie.',
      'Wykończenie skromniejsze niż w Volkswagenie.'
    ],
    faq: [
      { q: 'Który silnik Skody jest najlepszy?', a: 'Za najtrwalsze uchodzą 1.9 TDI i 1.6 TDI, benzynowy 1.4 16V w wersjach 80 i 86 KM oraz trzycylindrowy 1.0 MPI bez turbo. Odradza się 1.2 HTP, pierwsze 1.2 i 1.4 TSI oraz 2.0 TDI z pompowtryskiwaczami.' },
      { q: 'Czy Skoda to Volkswagen?', a: 'Skoda należy do koncernu Volkswagena od 1991 roku i korzysta z tych samych silników, skrzyń i płyt podłogowych. Wyróżnia się praktycznością i niższą ceną.' },
      { q: 'Czy warto kupić Octavię po taksówce?', a: 'Można, ale ostrożnie. Taka Octavia ma zwykle bardzo duży przebieg, zużyte zawieszenie i wnętrze. Plusem bywa regularny serwis. Sprawdź historię po VIN i obejrzyj auto u niezależnego mechanika.' },
      { q: 'Octavia czy Golf?', a: 'Technicznie są bardzo podobne. Octavia ma dużo większy bagażnik i więcej miejsca z tyłu, a zwykle jest tańsza. Golf jest krótszy i lepiej wykończony.' },
      { q: 'Czy Skoda Fabia z silnikiem 1.2 jest awaryjna?', a: 'Trzycylindrowy 1.2 HTP (Fabia I i II) ma złą opinię: awarie łańcucha rozrządu, cewek i zaworów. Lepszym wyborem w Fabii jest 1.4 16V albo nowszy 1.0 MPI.' }
    ],
    zrodla: [
      { nazwa: 'Auto Świat – popularne i trwałe silniki w używanych Skodach (2023)', url: 'https://www.auto-swiat.pl/porady/wszystko-o-silniku/popularne-i-trwale-silniki-w-uzywanych-skodach/yn413mb' },
      { nazwa: 'Interia – używana Skoda Octavia III: najlepsze wersje i silniki', url: 'https://motoryzacja.interia.pl/porady/news-uzywana-skoda-octavia-iii-najlepsze-wersje-i-silniki-typowe,nId,7039134' },
      { nazwa: 'Skoda Polska – oficjalna strona', url: 'https://www.skoda-auto.pl/' }
    ],
    sprawdzono: '2026-11-15'
  }
};
