// Poradniki eksperckie (seria z listopada 2026): akumulator, oleje, klimatyzacja, pielęgnacja lakieru.
// Data publikacji każdego poradnika – w data/harmonogram-poradnikow.json (jak w pozostałych nowych poradnikach).
import type { Poradnik } from '@/lib/poradniki';
import type { DodatekSeo } from '@/lib/poradniki-nowe';

const Z = {
  vartaEfbAgm: { n: 'VARTA – różnice między akumulatorami EFB i AGM, zasady wymiany w autach start-stop', url: 'https://www.varta-automotive.com/en/knowledge/articles/article-details/efb-agm-differences' },
  vartaFaq: { n: 'VARTA – najczęstsze pytania o akumulatory (dobór, ładowanie, przechowywanie)', url: 'https://www.varta-automotive.com/pl-pl/knowledge/faq' },
  asLadowanie: { n: 'Auto Świat – jak ładować akumulator i nie uszkodzić AGM (prąd 10% pojemności, 14,4 V)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/ladowanie-akumulatora-radzimy-jak-to-zrobic-i-nie-zepsuc-baterii/zen5pe0' },
  asEtykieta: { n: 'Auto Świat – jak odczytać parametry na etykiecie akumulatora (Ah, A, normy EN/DIN/SAE)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/jak-odczytac-parametry-na-etykiecie-akumulatora/47rfy3s' },
  asZima: { n: 'Auto Świat – jak ocenić stan akumulatora przed zimą (napięcia, pobór prądu, utrata pojemności)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/jak-ocenic-stan-akumulatora-przed-zima/xzzchlw' },
  interiaTest: { n: 'Interia Motoryzacja – test akumulatora przed mrozami (napięcia, żywotność)', url: 'https://motoryzacja.interia.pl/porady/eksploatacja/news-auto-ciezko-odpala-lepiej-zrob-test-akumulatora-przed-mrozam,nId,23548012' },
  depozyt: { n: 'AutoCentrum – opłata depozytowa 30 zł za akumulator (ustawa o bateriach i akumulatorach)', url: 'https://www.autocentrum.pl/publikacje/porady/doplacisz-30-zl-do-akumulatora-jesli-nie-oddasz-starego-to-nie-wyludzenie-a-prawo-poradnik/' },
  asStartStop: { n: 'Auto Świat – jak wymienić akumulator w aucie z układem start-stop (AGM, EFB, rejestracja)', url: 'https://www.auto-swiat.pl/porady/auto-z-ukladem-start-stop-jak-wymienic-akumulator/48rpets' }
};

export const NOWE_4: Poradnik[] = [
  {
    slug: 'akumulator-samochodowy-jak-dobrac-i-naladowac',
    kategoria: 'eksploatacja',
    ikona: 'akumulator',
    aktualizacja: '2026-11-10',
    tytul: 'Akumulator samochodowy – jak dobrać Ah i prąd rozruchowy, AGM czy EFB, jak sprawdzić i naładować',
    krotko: 'Akumulator: dobór i ładowanie',
    opis: 'Praktyczny poradnik: co oznaczają liczby na etykiecie, kiedy potrzebujesz AGM lub EFB, jak sprawdzić akumulator multimetrem, jak bezpiecznie naładować go prostownikiem i jak przygotować go na mróz.',
    liczby: [
      { w: '12,6 V', o: 'naładowany akumulator w spoczynku' },
      { w: '13,8–14,4 V', o: 'prawidłowe ładowanie przy pracującym silniku' },
      { w: '10% Ah', o: 'bezpieczny prąd ładowania prostownikiem' }
    ],
    sekcje: [
      {
        id: 'wstep',
        t: 'Dlaczego warto znać swój akumulator',
        bloki: [
          {
            typ: 'p',
            t: 'Rozładowany akumulator to najczęstsza przyczyna wezwań pomocy drogowej. Według danych ADAC, na które powołuje się VARTA, problemy z akumulatorem odpowiadają za ponad 40% wszystkich awarii aut. Najczęściej dzieje się to w pierwszy mroźny poranek, kiedy akumulator, który „jeszcze dawał radę”, nagle nie ma siły zakręcić rozrusznikiem.'
          },
          {
            typ: 'p',
            t: 'Kłopot w tym, że akumulator rzadko pada bez ostrzeżenia. Zwykle przez kilka tygodni rozrusznik kręci coraz wolniej, a napięcie spada. Kierowca tego nie zauważa, bo nie wie, na co patrzeć. Drugi częsty problem to zakup złego akumulatora: za słabego, zwykłego zamiast AGM w aucie ze start-stop albo z biegunami po złej stronie.'
          },
          {
            typ: 'p',
            t: 'W tym poradniku wyjaśniamy po kolei: jak odczytać etykietę i dobrać akumulator do auta, czym różnią się technologie, jak w 5 minut sprawdzić akumulator zwykłym multimetrem, jak go bezpiecznie naładować i jak dbać o niego zimą. Jeśli auto już nie odpala, zajrzyj od razu do poradnika o odpalaniu z kabli.'
          },
          {
            typ: 'link',
            t: 'Akumulator zimą – jak bezpiecznie odpalić auto z kabli',
            o: 'Kolejność podłączania kabli i czego nie robić, żeby nie uszkodzić elektroniki.',
            href: '/poradniki/akumulator-zima-odpalanie-z-kabli/'
          }
        ]
      },
      {
        id: 'etykieta',
        t: 'Jak czytać etykietę akumulatora',
        bloki: [
          {
            typ: 'tabela',
            naglowki: ['Oznaczenie', 'Co znaczy', 'Na co uważać'],
            wiersze: [
              ['12 V', 'napięcie znamionowe', 'W autach osobowych zawsze 12 V. Musi zgadzać się z instalacją auta.'],
              ['60 Ah', 'pojemność – ile energii akumulator magazynuje', 'Odpowiada za zasilanie odbiorników i zapas na postoju. Dobieraj według zaleceń producenta auta.'],
              ['540 A (EN)', 'prąd rozruchowy – ile prądu da przez krótki czas na mrozie', 'Ważny przy rozruchu zimą. Liczy się norma: ta sama liczba według EN, DIN i SAE oznacza co innego.'],
              ['AGM / EFB', 'technologia wykonania', 'Auto ze start-stop wymaga AGM lub EFB – zwykły akumulator szybko się w nim zużyje.'],
              ['P+ / L+ (lub 0 / 1)', 'po której stronie jest biegun plus', 'Przy złym układzie kable mogą nie sięgnąć do klem.'],
              ['wymiary i stopka', 'długość × szerokość × wysokość, sposób mocowania', 'Akumulator musi zmieścić się w gnieździe i dać się przykręcić listwą.']
            ],
            podpis: 'Najważniejsze parametry na etykiecie akumulatora samochodowego.'
          },
          {
            typ: 'p',
            t: 'Prąd rozruchowy podaje się według różnych norm. W Europie najczęściej spotkasz normę EN. Ta sama liczba według normy DIN oznacza słabszy akumulator, a według amerykańskiej normy SAE – mocniejszy. Porównując dwa akumulatory, sprawdź więc, czy obie wartości są podane w tej samej normie.'
          }
        ]
      },
      {
        id: 'dobor',
        t: 'Jak dobrać akumulator do auta',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Sprawdź zalecenia producenta', o: 'Najpewniejszym źródłem jest instrukcja obsługi auta albo etykieta fabrycznego akumulatora. Dobre sklepy mają też wyszukiwarki akumulatorów po marce, modelu i silniku.' },
              { t: 'Dobierz pojemność (Ah)', o: 'Wybierz taką samą pojemność jak fabryczna albo nieco większą – o kilka procent. Za mały akumulator nie podoła przy wielu włączonych odbiornikach. Dużo większy zwykle nie jest dobrym pomysłem: alternator może nie naładować go do pełna, co skraca jego życie.' },
              { t: 'Dobierz prąd rozruchowy (A)', o: 'Wartość powinna być co najmniej taka jak w fabrycznym akumulatorze. Diesel potrzebuje więcej prądu niż benzyna o tej samej pojemności. Wyraźnie wyższy prąd niż potrzebny nie daje praktycznych korzyści.' },
              { t: 'Wybierz właściwą technologię', o: 'Auto ze start-stop i odzyskiem energii z hamowania – AGM. Prosty start-stop – EFB lub AGM. Auto bez start-stop – zwykły akumulator, chyba że ma dużo elektroniki i jeździ krótkie trasy po mieście.' },
              { t: 'Sprawdź wymiary, bieguny i mocowanie', o: 'Zmierz gniazdo, sprawdź układ biegunów i rodzaj stopki. Akumulator, który nie jest dobrze przykręcony, szybciej się psuje od drgań.' }
            ]
          },
          {
            typ: 'tabela',
            naglowki: ['Auto', 'Typowa pojemność', 'Typowy prąd rozruchowy (EN)'],
            wiersze: [
              ['Małe auto miejskie, benzyna 1.0–1.2', '40–50 Ah', '360–450 A'],
              ['Kompakt, benzyna 1.4–1.6', '55–62 Ah', '480–600 A'],
              ['Kompakt lub kombi, diesel 1.6–2.0', '70–75 Ah', '640–720 A'],
              ['Duży SUV lub van, diesel 2.0–3.0', '80–95 Ah', '740–850 A']
            ],
            podpis: 'Wartości orientacyjne. Zawsze sprawdź zalecenia producenta dla konkretnego auta i silnika.'
          }
        ]
      },
      {
        id: 'technologie',
        t: 'Zwykły, EFB czy AGM – czym się różnią',
        bloki: [
          {
            typ: 'tabela',
            naglowki: ['Cecha', 'Zwykły (kwasowo-ołowiowy)', 'EFB', 'AGM'],
            wiersze: [
              ['Budowa', 'płyty w płynnym elektrolicie', 'ulepszony zwykły akumulator ze wzmocnionymi płytami', 'elektrolit uwięziony w macie z włókna szklanego'],
              ['Odporność na częste rozruchy', 'niska', 'ok. 2 razy więcej cykli niż zwykły', 'najwyższa'],
              ['Do jakiego auta', 'bez start-stop, prosta elektronika', 'prosty start-stop, dużo jazdy po mieście', 'start-stop z odzyskiem energii, auta z dużą ilością elektroniki'],
              ['Głębokie rozładowanie', 'szkodzi', 'szkodzi', 'bardzo szkodzi – jedno może zabrać ok. 30% pojemności'],
              ['Ładowanie prostownikiem', 'zwykły prostownik', 'prostownik z trybem do akumulatorów start-stop', 'tylko tryb AGM, napięcie do 14,4 V'],
              ['Cena', 'najniższa', 'średnia', 'najwyższa']
            ],
            podpis: 'Porównanie trzech najpopularniejszych technologii akumulatorów w autach osobowych.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Akumulator AGM wymieniaj tylko na AGM. EFB możesz wymienić na EFB albo – jeśli producent auta na to pozwala – na AGM. Zwykły akumulator w aucie ze start-stop i odzyskiem energii potrafi zużyć się w kilka miesięcy, a układ start-stop przestaje działać prawidłowo.'
          },
          {
            typ: 'p',
            t: 'W wielu nowszych autach (szczególnie ze start-stop) akumulator pilnuje czujnik i system zarządzania energią. Po wymianie trzeba go „zarejestrować” testerem diagnostycznym – wpisać do sterownika dane nowego akumulatora. Bez tego auto może źle go ładować, a nowy akumulator szybciej się zużyje. W takim aucie wymianę najlepiej zlecić warsztatowi z odpowiednim testerem.'
          }
        ]
      },
      {
        id: 'multimetr',
        t: 'Jak sprawdzić akumulator multimetrem – 3 pomiary',
        bloki: [
          {
            typ: 'p',
            t: 'Wystarczy prosty multimetr za kilkadziesiąt złotych. Ustaw go na pomiar napięcia stałego (symbol V z prostą kreską, zakres 20 V). Czerwony przewód przyłóż do bieguna plus (+), czarny do minusa (–).'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Napięcie spoczynkowe', o: 'Mierz przy wyłączonym silniku, najlepiej kilka godzin po jeździe (np. rano). Wynik mówi, w jakim stopniu akumulator jest naładowany – tabela niżej.' },
              { t: 'Napięcie przy rozruchu', o: 'Poproś kogoś o uruchomienie silnika, gdy trzymasz przewody na klemach. Chwilowy spadek poniżej 10 V oznacza słaby akumulator, a poniżej 9 V – zwykle zużyty.' },
              { t: 'Napięcie ładowania', o: 'Przy pracującym silniku napięcie powinno wynosić 13,8–14,4 V. Wyraźnie mniej lub więcej oznacza problem z alternatorem lub regulatorem napięcia, a nie z akumulatorem.' }
            ]
          },
          {
            typ: 'tabela',
            naglowki: ['Napięcie w spoczynku', 'Stan akumulatora', 'Co zrobić'],
            wiersze: [
              ['12,6–12,7 V', 'naładowany', 'nic – wszystko w porządku'],
              ['ok. 12,4 V', 'częściowo rozładowany', 'doładuj prostownikiem lub dłuższą trasą'],
              ['ok. 12,2 V', 'mniej więcej w połowie', 'naładuj prostownikiem jak najszybciej'],
              ['poniżej 12,0 V', 'głęboko rozładowany', 'naładuj i zleć test obciążeniowy'],
              ['ok. 10,5 V i mniej', 'skrajnie rozładowany', 'akumulator mógł zostać trwale uszkodzony']
            ],
            podpis: 'Napięcie mierzone przy wyłączonym silniku, kilka godzin po jeździe.'
          },
          {
            typ: 'p',
            t: 'Akumulator sam się rozładowuje? Sprawdź pobór prądu na postoju. Przełącz multimetr na pomiar prądu (A), odłącz klemę minus i włącz miernik między klemę a biegun. Odczekaj, aż auto „zaśnie” (zwykle kilkanaście–kilkadziesiąt minut po zamknięciu). Prawidłowy pobór to do ok. 50 mA, a w autach z rozbudowanym alarmem do ok. 70 mA. Więcej oznacza, że coś pobiera prąd, gdy nie powinno.'
          },
          {
            typ: 'uwaga',
            t: 'Napięcie pokazuje, ile energii jest w akumulatorze, ale nie mówi wszystkiego o jego kondycji. Zużyty akumulator może mieć dobre napięcie, a i tak nie dać rady przy rozruchu. Pewną odpowiedź da tester obciążeniowy – wiele warsztatów i sklepów sprawdza akumulator nim za darmo.'
          }
        ]
      },
      {
        id: 'prostownik',
        t: 'Jak bezpiecznie naładować akumulator prostownikiem',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wybierz właściwy prostownik', o: 'Najwygodniejszy jest prostownik automatyczny (mikroprocesorowy). Sam dobiera prąd i kończy ładowanie. Do AGM i EFB potrzebujesz prostownika z odpowiednim trybem – zwykły prostownik może przeładować AGM.' },
              { t: 'Ustaw prąd ładowania', o: 'Bezpieczny prąd to ok. 10% pojemności: przy akumulatorze 60 Ah – do 6 A. Do większości aut osobowych wystarcza prostownik 5 A, choć ładowanie trwa wtedy dłużej.' },
              { t: 'Podłącz w dobrej kolejności', o: 'Najpierw czerwony przewód do plusa, potem czarny do minusa (albo do masy, jeśli akumulator zostaje w aucie). Dopiero potem włącz prostownik do gniazdka. Po ładowaniu – najpierw wyłącz prostownik z gniazdka, potem zdejmij przewody.' },
              { t: 'Ładuj w przewiewnym miejscu', o: 'Podczas ładowania zwykły akumulator może wydzielać wodór, który jest łatwopalny. Nie ładuj w zamkniętym, małym pomieszczeniu i trzymaj z dala ogień oraz iskry.' },
              { t: 'Sprawdź efekt', o: 'Odczekaj co najmniej 30 minut po ładowaniu i zmierz napięcie. Dobrze naładowany akumulator pokaże ok. 12,7–12,9 V.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Nigdy nie ładuj zamarzniętego akumulatora (wybrzuszona obudowa, lód w środku) – może pęknąć lub wybuchnąć. Najpierw przenieś go do ciepłego pomieszczenia. Przy ładowaniu w aucie bez odłączania klem używaj prostownika automatycznego – w nowszych autach to bezpieczniejsze niż odłączanie akumulatora, po którym trzeba czasem wpisywać kod radia i ponownie ustawiać szyby.'
          }
        ]
      },
      {
        id: 'zima',
        t: 'Akumulator zimą – jak nie dać się zaskoczyć',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: 'ok. 30%', o: 'tyle pojemności traci akumulator przy –10°C' },
              { w: 'do 40%', o: 'utrata pojemności przy –25°C' },
              { w: '3–5 lat', o: 'typowa żywotność akumulatora' }
            ]
          },
          {
            typ: 'lista',
            elementy: [
              'sprawdź akumulator przed pierwszymi mrozami – multimetrem albo testerem w warsztacie,',
              'przy jeździe na krótkich odcinkach raz na 2–3 tygodnie doładuj akumulator prostownikiem albo przejedź dłuższą trasę,',
              'przy rozruchu wyłącz ogrzewanie szyb, foteli, dmuchawę i radio – zostaw tylko to, co konieczne,',
              'w aucie z manualną skrzynią wciśnij sprzęgło przy rozruchu – rozrusznik ma wtedy mniej do zakręcenia,',
              'jeśli silnik nie zapala, nie kręć rozrusznikiem dłużej niż ok. 10 sekund – odczekaj chwilę i spróbuj ponownie,',
              'auto, które stoi długo, zabezpiecz prostownikiem z funkcją podtrzymania – VARTA zaleca doładowanie co dwa miesiące przy rzadkim używaniu,',
              'akumulator starszy niż 5 lat, który zaczyna słabnąć, wymień przed zimą, a nie w pierwszy mroźny poranek.'
            ]
          }
        ]
      },
      {
        id: 'czego-unikac',
        t: 'Czego unikać – najczęstsze błędy',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'montaż zwykłego akumulatora w aucie ze start-stop, które fabrycznie miało AGM lub EFB,',
              'wybór akumulatora tylko po cenie albo tylko po pojemności, bez sprawdzenia prądu rozruchowego, biegunów i wymiarów,',
              'ładowanie AGM zwykłym prostownikiem bez trybu AGM – przeładowanie szybko go niszczy,',
              'dopuszczanie do głębokiego rozładowania, np. przez pozostawione włączone światła czy długi postój bez podtrzymania,',
              'kupowanie dużo większego akumulatora „na zapas” – w krótkich trasach i tak nie naładuje się do pełna,',
              'ocena akumulatora wyłącznie po napięciu – zużyty akumulator może mieć dobre napięcie i nie mieć siły,',
              'wyrzucanie zużytego akumulatora do śmieci – oddaj go przy zakupie nowego. Jeśli nie oddasz starego, sklep pobierze opłatę depozytową 30 zł – odzyskasz ją, gdy oddasz zużyty akumulator w ciągu 30 dni od zakupu.'
            ]
          }
        ]
      },
      {
        id: 'polecane',
        t: 'Polecane produkty i narzędzia',
        bloki: [
          {
            typ: 'produkty',
            elementy: [
              { nazwa: 'Prostownik automatyczny z trybem AGM i EFB', o: 'Sam dobiera prąd, kończy ładowanie i podtrzymuje akumulator na długim postoju. Wybierz model 5–10 A z trybem AGM i funkcją ładowania przy niskiej temperaturze.', szukaj: 'prostownik automatyczny AGM 12V' },
              { nazwa: 'Multimetr cyfrowy', o: 'Wystarczy do wszystkich pomiarów z tego poradnika: napięcia spoczynkowego, rozruchu, ładowania i poboru prądu na postoju. Przydaje się też przy żarówkach i bezpiecznikach.', szukaj: 'multimetr cyfrowy samochodowy' },
              { nazwa: 'Tester akumulatorów', o: 'Pokazuje rzeczywistą kondycję akumulatora (a nie tylko napięcie) i ocenia, czy da radę zimą. Przydaje się, gdy masz kilka aut albo często kupujesz używane.', szukaj: 'tester akumulatorów samochodowych' },
              { nazwa: 'Urządzenie rozruchowe (booster)', o: 'Odpala auto bez drugiego samochodu i kabli. Wybierz model z zabezpieczeniem przed odwrotnym podłączeniem i mocą dopasowaną do pojemności silnika.', szukaj: 'urządzenie rozruchowe booster 12V' },
              { nazwa: 'Kable rozruchowe z grubym przewodem', o: 'Tani zapas na zimę. Szukaj kabli o przekroju co najmniej 16 mm² (do diesli 25 mm²) i długości ok. 3 m.', szukaj: 'kable rozruchowe 25 mm2' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Jak dobrać akumulator do samochodu?', a: 'Sprawdź w instrukcji auta lub na etykiecie fabrycznego akumulatora pojemność (Ah), prąd rozruchowy (A) i technologię. Nowy akumulator powinien mieć taką samą pojemność lub nieco większą, co najmniej taki sam prąd rozruchowy, ten sam układ biegunów i pasować wymiarami. W aucie ze start-stop wybierz AGM lub EFB – tak jak było fabrycznie.' },
      { q: 'Czy można założyć akumulator o większej pojemności?', a: 'Nieco większy (o kilka procent) – tak. Dużo większy zwykle nie ma sensu: alternator przy krótkich trasach nie naładuje go do pełna, a stale niedoładowany akumulator szybciej się zużywa. Musi też zmieścić się w gnieździe.' },
      { q: 'Czym różni się akumulator AGM od EFB?', a: 'EFB to ulepszony zwykły akumulator, który wytrzymuje ok. dwa razy więcej cykli i nadaje się do prostych układów start-stop. AGM ma elektrolit uwięziony w macie z włókna szklanego, najlepiej znosi częste rozruchy i odzysk energii z hamowania, ale jest droższy i wrażliwy na przeładowanie oraz głębokie rozładowanie.' },
      { q: 'Jakie napięcie powinien mieć sprawny akumulator?', a: 'W spoczynku, kilka godzin po jeździe, naładowany akumulator ma ok. 12,6–12,7 V. Przy pracującym silniku napięcie powinno wynosić 13,8–14,4 V. Podczas rozruchu nie powinno spadać poniżej ok. 10 V.' },
      { q: 'Jakim prądem ładować akumulator prostownikiem?', a: 'Bezpieczny prąd to ok. 10% pojemności akumulatora, czyli przy 60 Ah do 6 A. Akumulatory AGM ładuj tylko prostownikiem z trybem AGM, który nie przekracza napięcia ok. 14,4 V.' }
    ],
    powiazane: ['akumulator-zima-odpalanie-z-kabli', 'zima-w-samochodzie', 'kontrolki-w-samochodzie'],
    zrodla: [Z.vartaEfbAgm, Z.vartaFaq, Z.asEtykieta, Z.asLadowanie, Z.asZima, Z.interiaTest, Z.asStartStop, Z.depozyt]
  }
];

export const DODATKI_4: Record<string, DodatekSeo> = {
  'akumulator-samochodowy-jak-dobrac-i-naladowac': {
    seoTytul: 'Akumulator – jak dobrać Ah i A, AGM czy EFB',
    seoOpis: 'Jak dobrać akumulator samochodowy (Ah, prąd rozruchowy, bieguny), AGM czy EFB, jak sprawdzić go multimetrem i naładować prostownikiem. Napięcia i błędy.',
    skrot: [
      'Dobieraj pojemność i prąd rozruchowy według producenta auta – nieco więcej jest OK, dużo więcej nie ma sensu.',
      'Auto ze start-stop wymaga AGM lub EFB. AGM wymieniasz tylko na AGM.',
      'Naładowany akumulator ma ok. 12,6 V w spoczynku, a przy pracującym silniku 13,8–14,4 V.'
    ]
  }
};
