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
  acOleje: { n: 'AutoCentrum – przewodnik po lepkościach i normach ACEA/API (lipiec 2026)', url: 'https://www.autocentrum.pl/publikacje/porady/jaki-olej-do-mojego-silnika-przewodnik-po-lepkosciach-i-normach-acea-api/' },
  acLepkosc: { n: 'AutoCentrum – 5W-30 czy 10W-40? Wybór lepkości a trwałość silnika (lipiec 2026)', url: 'https://www.autocentrum.pl/newsy/5w-30-czy-10w-40-ten-wybor-moze-zdecydowac-o-zywotnosci-silnika/' },
  asLongLife: { n: 'Auto Świat – co ile wymieniać olej, czy serwis long life szkodzi silnikowi', url: 'https://www.auto-swiat.pl/porady/eksploatacja/co-ile-wymieniac-olej-w-silniku-serwis-long-life-jest-zly-dla-silnika-pytamy/207ryd9' },
  asDpf: { n: 'Auto Świat – jaki olej do auta z filtrem DPF (oleje low SAPS, normy ACEA C)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/jaki-olej-do-auta-z-dpf-em/8hb7n46' },
  totalGesty: { n: 'TotalEnergies – silniki z dużym przebiegiem a gęstszy olej', url: 'https://baltics.totalenergies.com/en/engines-higher-mileage-and-thicker-oil' },
  otomotoOznaczenia: { n: 'Otomoto News – oznaczenia oleju silnikowego i klasyfikacje', url: 'https://www.otomoto.pl/news/oznaczenia-oleju-silnikowego-klasyfikacja-olejow' },
  saeJ300: { n: 'Wikipedia – SAE J300 (klasyfikacja lepkości olejów silnikowych)', url: 'https://en.wikipedia.org/wiki/SAE_J300' },
  acKlimaCena: { n: 'AutoCentrum – ile kosztuje nabicie klimatyzacji (R134a i R1234yf, czerwiec 2026)', url: 'https://www.autocentrum.pl/newsy/ile-kosztuje-nabicie-klimatyzacji-kierowcy-moga-sie-zdziwic/' },
  otomotoOdgrzybianie: { n: 'Otomoto News – odgrzybianie klimatyzacji: metody, ceny, częstotliwość (2026)', url: 'https://www.otomoto.pl/news/odgrzybianie-klimatyzacji-ile-kosztuje-jakie-sa-metody-czemu-ma-sluzyc' },
  asKlimaAwarie: { n: 'Auto Świat – klimatyzacja: jak działa, serwis, typowe awarie (ubytek ok. 10% czynnika rocznie)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/klimatyzacja-jak-dziala-serwis-typowe-awarie-klimatyzacji/8f8s0gg' },
  asFgazy: { n: 'Auto Świat – koniec z nabijaniem nieszczelnych klimatyzacji (ustawa o F-gazach)', url: 'https://www.auto-swiat.pl/porady/eksploatacja/koniec-z-nabijaniem-nieszczelnych-klimatyzacji-nowe-przepisy-dla-serwisow/7sjhv7j' },
  acFiltrKabinowy: { n: 'AutoCentrum – filtr kabinowy: rodzaje i jak często go wymieniać', url: 'https://www.autocentrum.pl/publikacje/porady/filtr-kabinowy-co-to-jest-do-czego-sluzy-jak-czesto-i-kiedy-warto-go-wymienic/' },
  asPrzedSezonem: { n: 'Auto Świat – co sprawdzić w klimatyzacji przed sezonem, objawy usterek', url: 'https://www.auto-swiat.pl/porady/eksploatacja/co-trzeba-sprawdzic-w-klimatyzacji-przed-sezonem-objawy-i-naprawa-usterek/ky57q7v' },
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
  },
  {
    slug: 'olej-silnikowy-jak-dobrac',
    kategoria: 'eksploatacja',
    ikona: 'olej',
    aktualizacja: '2026-11-15',
    tytul: 'Olej silnikowy – jak dobrać lepkość i normę, syntetyk czy półsyntetyk, co ile wymieniać',
    krotko: 'Olej silnikowy: dobór i wymiana',
    opis: 'Co oznacza 5W-30, czym są normy ACEA, API i normy producentów, który olej wybrać do auta z DPF, co ile naprawdę wymieniać olej i czy gęstszy olej pomaga starszemu silnikowi.',
    liczby: [
      { w: '15 tys. km', o: 'rozsądny interwał wymiany – albo raz w roku' },
      { w: 'ACEA C', o: 'oleje do aut z filtrem DPF lub GPF' },
      { w: 'MIN–MAX', o: 'poziom oleju sprawdzaj co kilka tankowań' }
    ],
    sekcje: [
      {
        id: 'wstep',
        t: 'Olej to najtańsze ubezpieczenie silnika',
        bloki: [
          {
            typ: 'p',
            t: 'Wymiana oleju z filtrem kosztuje kilkaset złotych. Remont silnika, w którym olej zamienił się w szlam, potrafi kosztować kilkanaście tysięcy. Między tymi dwiema kwotami stoi jedna decyzja: jaki olej wlać i kiedy go wymienić.'
          },
          {
            typ: 'p',
            t: 'Problem w tym, że półka w sklepie wygląda jak test z chemii. 5W-30, 0W-20, ACEA C3, API SP, VW 504.00, dexos2, „syntetyczny”, „long life”… Sprzedawca poleca jedno, mechanik drugie, a znajomy przysięga, że do starego silnika trzeba lać gęsty olej. Łatwo kupić olej, który ma dobrą lepkość, ale złą normę – i nawet o tym nie wiedzieć.'
          },
          {
            typ: 'p',
            t: 'Dobra wiadomość: wybór jest prosty, jeśli zrobisz go we właściwej kolejności. Najpierw norma producenta auta, potem lepkość, a dopiero na końcu marka i cena. W tym poradniku wyjaśniamy po kolei wszystkie oznaczenia, podpowiadamy, co ile naprawdę wymieniać olej, i rozprawiamy się z najpopularniejszymi mitami.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Najkrótsza wersja: sprawdź w książce serwisowej (albo w konfiguratorze oleju po numerze VIN) normę producenta, np. VW 507.00 czy MB 229.51. Kup olej, który ma tę normę wypisaną na etykiecie i jedną z dopuszczonych lepkości. Wymieniaj go co ok. 15 tys. km albo raz w roku.'
          }
        ]
      },
      {
        id: 'lepkosc',
        t: 'Lepkość: co oznacza 5W-30',
        bloki: [
          {
            typ: 'p',
            t: 'Lepkość opisuje, jak gęsty jest olej. Oznacza się ją według amerykańskiej normy SAE J300. Prawie wszystkie oleje do aut osobowych to oleje wielosezonowe, oznaczone dwiema liczbami rozdzielonymi literą W i kreską, np. 5W-30.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Liczba przed literą W (np. 5W)', o: 'W to „winter”, czyli zima. Liczba mówi, jak dobrze olej płynie na mrozie: im mniejsza, tym w niższej temperaturze silnik da się uruchomić, a olej szybciej dotrze do wszystkich miejsc. To najważniejsze przy zimnym starcie, kiedy silnik zużywa się najbardziej.' },
              { t: 'Liczba po kresce (np. 30)', o: 'Opisuje lepkość w temperaturze pracy silnika (mierzoną w 100°C). Im wyższa, tym grubszy film olejowy na gorąco. Niższa oznacza mniejsze opory i nieco mniejsze spalanie, wyższa – lepszą ochronę pod dużym obciążeniem, ale tylko wtedy, gdy silnik był do niej zaprojektowany.' }
            ]
          },
          {
            typ: 'tabela',
            naglowki: ['Klasa zimowa', 'Rozruch możliwy do ok.', 'Gdzie spotkasz'],
            wiersze: [
              ['0W', '−35°C', 'Nowoczesne silniki benzynowe, hybrydy, oleje 0W-20 i 0W-30'],
              ['5W', '−30°C', 'Najpopularniejsza klasa w Polsce: 5W-30, 5W-40'],
              ['10W', '−25°C', 'Starsze silniki: 10W-40'],
              ['15W', '−20°C', 'Bardzo stare konstrukcje, oleje mineralne 15W-40'],
              ['20W', '−15°C', 'Dziś praktycznie tylko w klasykach']
            ],
            podpis: 'Klasy zimowe lepkości według SAE J300 i przybliżona temperatura, w której olej pozwala jeszcze uruchomić silnik.'
          },
          {
            typ: 'p',
            t: 'Ważne: lepkość sama w sobie nie mówi nic o jakości oleju. Tani olej 5W-30 i drogi olej 5W-30 mają taką samą lepkość, ale mogą mieć zupełnie inne dodatki i spełniać zupełnie inne normy. Dlatego lepkość wybierasz dopiero w drugim kroku – spośród tych, które dopuszcza producent auta.'
          }
        ]
      },
      {
        id: 'normy',
        t: 'Normy ACEA, API i normy producentów – to one decydują',
        bloki: [
          {
            typ: 'p',
            t: 'Normy jakościowe opisują, co olej potrafi: jak chroni przed zużyciem, osadami i przegrzaniem, czy nadaje się do turbosprężarki i czy nie zatka filtra cząstek stałych. Na etykiecie znajdziesz trzy rodzaje norm.'
          },
          {
            typ: 'tabela',
            naglowki: ['Norma', 'Co oznacza', 'Przykłady'],
            wiersze: [
              ['ACEA A/B', 'Europejskie normy dla silników benzynowych (A) i diesli (B) bez filtra cząstek stałych. Oleje „pełnopopiołowe”.', 'A3/B4 – wysoka ochrona, starsze auta; A5/B5 – oleje oszczędzające paliwo; A7/B7 – nowsza norma, ochrona turbo i łańcucha rozrządu'],
              ['ACEA C', 'Oleje o obniżonej zawartości popiołu, siarki i fosforu (low/mid SAPS) – do aut z filtrem DPF lub GPF i nowoczesnymi katalizatorami.', 'C2, C3 (bardzo popularna w VW, BMW i Mercedesie), C4 (Renault), C5, C6 – niska lepkość'],
              ['API S… / C…', 'Amerykańskie normy: S dla silników benzynowych, C dla diesli. Im dalsza litera, tym nowsza norma.', 'API SP (od 2020 r., ochrona małych silników turbo przed przedwczesnym zapłonem), API SN, CK-4'],
              ['Norma producenta', 'Dopuszczenie konkretnego producenta aut – najważniejsza ze wszystkich.', 'VW 504.00/507.00, VW 508.00/509.00, MB 229.51/229.52, BMW Longlife-04, GM dexos2, Ford WSS-M2C913-D, Renault RN17']
            ],
            podpis: 'Najważniejsze normy jakościowe olejów silnikowych.'
          },
          {
            typ: 'p',
            t: 'Normy producentów aut są najbardziej szczegółowe: producent sprawdza, czy olej sprawdza się w jego silnikach, często przez wiele tysięcy godzin testów. Jeśli w książce serwisowej jest wpisana norma producenta, szukaj jej na etykiecie – sama klasa ACEA i lepkość to za mało.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Auto z filtrem cząstek stałych (DPF w dieslu, GPF w nowszym benzyniaku) wymaga oleju z normą ACEA C (lub normy producenta, która ją obejmuje). Zwykły olej pełnopopiołowy zostawia w filtrze popiół, którego nie usuwa wypalanie. Filtr szybciej się zapycha, a jego wymiana kosztuje kilka tysięcy złotych.'
          }
        ]
      },
      {
        id: 'rodzaje',
        t: 'Syntetyk, półsyntetyk czy mineralny?',
        bloki: [
          {
            typ: 'p',
            t: 'Olej składa się w ok. 70–80% z oleju bazowego i w pozostałej części z pakietu dodatków (detergenty, środki przeciwzużyciowe, modyfikatory lepkości). Rodzaj bazy decyduje o tym, jak olej znosi wysoką temperaturę i jak długo zachowuje swoje właściwości.'
          },
          {
            typ: 'tabela',
            naglowki: ['Rodzaj', 'Z czego powstaje', 'Do jakich aut'],
            wiersze: [
              ['Mineralny', 'Rafinowana ropa naftowa', 'Bardzo stare silniki i klasyki. Szybciej się starzeje, zwykle lepkość 15W-40 lub 20W-50.'],
              ['Półsyntetyczny', 'Mieszanka bazy mineralnej i syntetycznej', 'Starsze, prostsze silniki bez turbo i bez DPF, zwykle 10W-40. Tańszy, ale krócej zachowuje właściwości.'],
              ['Syntetyczny', 'Baza hydrokrakowana albo w pełni syntetyczna (PAO, estry)', 'Większość aut z ostatnich 20 lat: silniki turbo, diesle common rail, auta z DPF. Lepiej znosi wysoką temperaturę i długie przebiegi.']
            ],
            podpis: 'Podstawowe rodzaje olejów silnikowych.'
          },
          {
            typ: 'p',
            t: 'W praktyce o wyborze rodzaju oleju decyduje norma producenta: nowoczesne normy (np. VW 504/507, MB 229.51, dexos2) spełniają wyłącznie oleje syntetyczne o niskiej lepkości. Warto wiedzieć, że większość olejów sprzedawanych jako „syntetyczne” ma bazę hydrokrakowaną – to normalne i nie jest wadą, o ile olej ma właściwe normy.'
          }
        ]
      },
      {
        id: 'dobor',
        t: 'Jak dobrać olej do swojego auta – krok po kroku',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Znajdź normę producenta', o: 'Jest w książce serwisowej, instrukcji obsługi albo w konfiguratorach olejowych producentów olejów, gdzie wystarczy wpisać markę, model i silnik (albo numer VIN). To punkt wyjścia.' },
              { t: 'Wybierz lepkość z dopuszczonych', o: 'Producent zwykle podaje jedną lub dwie lepkości, np. 5W-30 lub 5W-40. Obie są dobre, jeśli olej ma właściwą normę. W chłodnym klimacie i przy krótkich trasach lepsza jest niższa liczba przed W.' },
              { t: 'Sprawdź, czy auto ma DPF lub GPF', o: 'Jeśli tak – olej musi spełniać normę ACEA C albo normę producenta przewidzianą dla aut z filtrem (np. VW 507.00 dla diesli z DPF).' },
              { t: 'Przy LPG i dużych przebiegach – bez eksperymentów', o: 'Instalacja gazowa nie wymaga specjalnego oleju, jeśli producent auta tego nie wskazuje. Ważniejszy jest krótszy interwał wymiany, bo olej w silniku na gazie szybciej się starzeje.' },
              { t: 'Kupuj w pewnym miejscu', o: 'Podróbki znanych marek olejów to realny problem. Kupuj u autoryzowanych dystrybutorów i w zaufanych sklepach, a nie najtańszy olej z niepewnego ogłoszenia.' }
            ]
          }
        ]
      },
      {
        id: 'interwal',
        t: 'Co ile wymieniać olej? Long life kontra rozsądek',
        bloki: [
          {
            typ: 'p',
            t: 'Wielu producentów pozwala dziś na tzw. serwis long life: wymianę oleju nawet co 30 tys. km lub co 2 lata, gdy komputer auta uzna, że czas na serwis. Taki interwał zakłada jednak idealne warunki: długie trasy, rozgrzany silnik i wysokiej jakości paliwo. Większość kierowców w Polsce jeździ inaczej – krótkie odcinki po mieście, korki, start-stop.'
          },
          {
            typ: 'tabela',
            naglowki: ['Jak jeździsz', 'Rozsądny interwał', 'Dlaczego'],
            wiersze: [
              ['Głównie długie trasy, silnik wolnossący', 'co 15 tys. km lub raz w roku', 'Olej pracuje w stabilnej temperaturze i wolniej się zużywa.'],
              ['Mieszana jazda, silnik turbo', 'co 10–15 tys. km lub raz w roku', 'Turbosprężarka jest bardzo wrażliwa na jakość oleju.'],
              ['Krótkie odcinki, miasto, start-stop', 'co ok. 10 tys. km lub raz w roku', 'Silnik rzadko się rozgrzewa, do oleju trafia paliwo i wilgoć.'],
              ['Instalacja LPG', 'co ok. 10 tys. km', 'Olej szybciej traci właściwości (spada jego odczyn pH).'],
              ['Mały przebieg roczny', 'raz w roku, nawet przy kilku tysiącach km', 'Olej starzeje się także wtedy, gdy auto stoi.']
            ],
            podpis: 'Interwały wymiany oleju zalecane przez mechaników – zwykle krótsze niż w serwisie long life.'
          },
          {
            typ: 'p',
            t: 'Mechanicy są tu zgodni: krótszy interwał to jeden z najtańszych sposobów na trwały silnik. Szczególnie dotyczy to małych silników turbo z niewielką miską olejową – olej nagrzewa się w nich mocniej i szybciej się zużywa. Przy każdej wymianie oleju wymieniaj też filtr oleju.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Jeśli auto jest na gwarancji, trzymaj się zaleceń producenta (to warunek gwarancji), ale możesz wymieniać olej częściej – dodatkowa wymiana gwarancji nie narusza, jeśli robisz ją z właściwym olejem i masz na to rachunek.'
          }
        ]
      },
      {
        id: 'mit',
        t: 'Mit: „do starszego silnika trzeba lać gęstszy olej”',
        bloki: [
          {
            typ: 'p',
            t: 'To jedna z najpopularniejszych rad w warsztatach i na forach: po przekroczeniu 200 tys. km „przejdź na 10W-40, bo silnik jest wyrobiony”. Ma w sobie ziarno prawdy, ale jako ogólna zasada jest szkodliwa.'
          },
          {
            typ: 'lista',
            elementy: [
              'Gęstszy olej wolniej płynie przy zimnym starcie, a to właśnie wtedy silnik zużywa się najbardziej. Olej później dociera do turbosprężarki, wałków rozrządu i napinaczy łańcucha.',
              'Gęstszy olej gorzej odprowadza ciepło – elementy takie jak pierścienie tłokowe i łożyska turbosprężarki mogą pracować w wyższej temperaturze.',
              'Olej spoza norm producenta może nie chronić przed przedwczesnym zapłonem w małych silnikach turbo, może sprzyjać osadom i szkodzić filtrowi DPF lub GPF.',
              'Hydrauliczne popychacze, zmienne fazy rozrządu i napinacze łańcucha są projektowane pod konkretną lepkość. Zbyt gęsty olej potrafi zaburzyć ich działanie.'
            ]
          },
          {
            typ: 'p',
            t: 'Kiedy zmiana lepkości ma sens? Tylko w granicach tego, co dopuszcza producent. Jeśli w instrukcji jest „5W-30 lub 5W-40” z tą samą normą, przy dużym przebiegu i jeździe w trasie możesz wybrać 5W-40. W bardzo starych, prostych silnikach, które producent dopuszczał do pracy na 10W-40, taki olej też jest w porządku. Natomiast wlewanie 10W-40 do nowoczesnego silnika przewidzianego na 0W-20 czy 5W-30 to proszenie się o kłopoty.'
          },
          {
            typ: 'p',
            t: 'Jeśli silnik zaczął brać olej, gęstszy olej czy „uszczelniacze” zwykle tylko maskują problem. Lepiej ustalić przyczynę (pierścienie, uszczelniacze zaworowe, turbosprężarka, odma) i skrócić interwał wymiany – zużyty silnik szybciej zanieczyszcza olej.'
          }
        ]
      },
      {
        id: 'poziom',
        t: 'Jak sprawdzić poziom oleju i ile można dolewać',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Ustaw auto na płaskim terenie', o: 'Na pochyłości bagnet pokaże fałszywy wynik.' },
              { t: 'Odczekaj kilka minut po zgaszeniu silnika', o: 'Olej musi spłynąć do miski. Najlepiej sprawdzać rozgrzany silnik po ok. 5–10 minutach postoju, zgodnie z instrukcją auta.' },
              { t: 'Wyciągnij bagnet, wytrzyj i włóż ponownie', o: 'Dopiero drugi odczyt jest wiarygodny. Poziom powinien być między znacznikami MIN i MAX.' },
              { t: 'Dolewaj po trochu', o: 'Różnica między MIN a MAX to zwykle ok. 1 litr. Dolej pół litra, odczekaj i sprawdź ponownie. Zbyt dużo oleju też szkodzi – może się pienić i trafiać do układu dolotowego.' }
            ]
          },
          {
            typ: 'p',
            t: 'Do dolewki najlepiej użyć tego samego oleju, który jest w silniku. Jeśli go nie masz, dolej olej o tej samej lepkości i normie, nawet innej marki – oleje spełniające te same normy można ze sobą mieszać. Unikaj mieszania oleju mineralnego z syntetycznym i dolewania „czegokolwiek” ze stacji. Wiele nowszych aut nie ma bagnetu – wtedy poziom oleju sprawdzisz w menu komputera pokładowego.'
          },
          {
            typ: 'link',
            t: 'Kontrolki w samochodzie – co oznaczają',
            o: 'Czerwona kontrolka ciśnienia oleju oznacza natychmiastowe zatrzymanie auta. Sprawdź, które kontrolki są groźne.',
            href: '/poradniki/kontrolki-w-samochodzie/'
          }
        ]
      },
      {
        id: 'czego-unikac',
        t: 'Czego unikać',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'Wybierania oleju tylko po lepkości. Liczy się przede wszystkim norma producenta auta.',
              'Pełnopopiołowego oleju (ACEA A/B) w aucie z filtrem DPF lub GPF.',
              'Bezkrytycznego trzymania się interwału long life 30 tys. km przy jeździe po mieście, z turbo albo na LPG.',
              'Wlewania gęstszego oleju „bo silnik ma przebieg” – zwłaszcza w nowoczesnych silnikach turbo.',
              'Dosypywania dodatków i „uszczelniaczy” zamiast szukania przyczyny ubytków oleju.',
              'Jazdy z zapaloną czerwoną kontrolką ciśnienia oleju – nawet kilka minut może zniszczyć silnik.',
              'Kupowania najtańszego oleju z niepewnego źródła – podróbki znanych marek się zdarzają.',
              'Zostawiania starego filtra oleju przy wymianie oleju.'
            ]
          }
        ]
      },
      {
        id: 'produkty',
        t: 'Polecane produkty i narzędzia',
        bloki: [
          {
            typ: 'produkty',
            elementy: [
              { nazwa: 'Olej silnikowy z normą Twojego producenta', o: 'Szukaj po normie (np. VW 507.00, MB 229.51, dexos2), a dopiero potem po lepkości i cenie. Do wymiany w warsztacie kup zwykle 4–5 litrów, do dolewek wystarczy 1 litr.', szukaj: 'olej silnikowy 5W-30 C3' },
              { nazwa: 'Filtr oleju', o: 'Wymieniaj go przy każdej wymianie oleju. Dobierz filtr do konkretnego silnika (po numerze katalogowym lub VIN).', szukaj: 'filtr oleju' },
              { nazwa: 'Lejek z giętką końcówką', o: 'Ułatwia dolewanie oleju bez rozlewania na gorący silnik i paski. Kosztuje kilka złotych, a oszczędza sporo sprzątania.', szukaj: 'lejek do oleju z giętką końcówką' },
              { nazwa: 'Klucz do filtra oleju', o: 'Przydaje się, jeśli wymieniasz olej samodzielnie. Wybierz klucz pasujący do średnicy filtra albo uniwersalny klucz taśmowy.', szukaj: 'klucz do filtra oleju' },
              { nazwa: 'Raport historii auta przed zakupem', o: 'Kupując używane auto, sprawdź historię serwisową i przebieg po numerze VIN – regularne wymiany oleju to jeden z najlepszych sygnałów, że auto było zadbane.', partner: 'vin' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Co oznacza oznaczenie oleju 5W-30?', a: 'To lepkość według normy SAE J300. „5W” mówi, jak olej zachowuje się na mrozie (pozwala uruchomić silnik do ok. −30°C), a „30” – jaką lepkość ma w temperaturze pracy silnika. Lepkość nie mówi nic o jakości – o tej decydują normy ACEA, API i normy producenta.' },
      { q: 'Czy mogę zmienić olej 5W-30 na 5W-40?', a: 'Tak, jeśli producent auta dopuszcza obie lepkości, a olej ma wymaganą normę producenta. Jeśli w instrukcji jest tylko 5W-30 (albo 0W-20), nie zmieniaj lepkości na własną rękę.' },
      { q: 'Co ile wymieniać olej w silniku?', a: 'Mechanicy zalecają zwykle co ok. 15 tys. km albo raz w roku – co nastąpi pierwsze. Przy jeździe po mieście, z turbo albo na LPG lepiej co ok. 10 tys. km. Serwis long life co 30 tys. km zakłada idealne warunki, rzadko spotykane w praktyce.' },
      { q: 'Jaki olej do auta z filtrem DPF?', a: 'Olej o obniżonej zawartości popiołu, siarki i fosforu – z normą ACEA C (np. C3) albo normą producenta przewidzianą dla aut z filtrem, np. VW 507.00 czy MB 229.51. Zwykły olej pełnopopiołowy przyspiesza zapychanie filtra.' },
      { q: 'Czy do starego silnika trzeba lać gęstszy olej?', a: 'Nie jako ogólna zasada. Gęstszy olej wolniej dociera do elementów silnika przy zimnym starcie i gorzej odprowadza ciepło. Zmieniaj lepkość tylko w granicach dopuszczonych przez producenta, a przy ubytkach oleju szukaj ich przyczyny.' }
    ],
    powiazane: ['kontrolki-w-samochodzie', 'benzyna-diesel-lpg-czy-hybryda', 'zima-w-samochodzie'],
    zrodla: [Z.acOleje, Z.acLepkosc, Z.asLongLife, Z.asDpf, Z.totalGesty, Z.otomotoOznaczenia, Z.saeJ300]
  },
  {
    slug: 'klimatyzacja-samochodowa-serwis-odgrzybianie',
    kategoria: 'eksploatacja',
    ikona: 'klima',
    aktualizacja: '2026-11-15',
    tytul: 'Klimatyzacja w samochodzie – jak działa, objawy nieszczelności, odgrzybianie (ozon czy ultradźwięki) i filtr kabinowy',
    krotko: 'Klimatyzacja: serwis i odgrzybianie',
    opis: 'Jak działa klimatyzacja w aucie, po czym poznać nieszczelność, ile kosztuje serwis z czynnikiem R134a i R1234yf, czym różni się ozonowanie od ultradźwięków, jak wyczyścić parownik i kiedy wymienić filtr kabinowy.',
    liczby: [
      { w: 'ok. 10%', o: 'tyle czynnika ucieka rocznie nawet ze sprawnego układu' },
      { w: 'raz w roku', o: 'serwis, odgrzybianie i wymiana filtra kabinowego' },
      { w: '500–700 zł', o: 'pełny serwis z czynnikiem R1234yf (auta od ok. 2017 r.)' }
    ],
    sekcje: [
      {
        id: 'wstep',
        t: 'Klimatyzacja to nie tylko chłód latem',
        bloki: [
          {
            typ: 'p',
            t: 'Pierwszy upalny dzień, wsiadasz do auta, włączasz klimatyzację – a z nawiewów leci ciepłe powietrze o zapachu piwnicy. To jeden z najczęstszych powodów wizyt w warsztatach na wiosnę. Kłopot w tym, że wielu kierowców myśli o klimatyzacji dopiero wtedy, gdy przestaje działać, a wtedy naprawa bywa już droga.'
          },
          {
            typ: 'p',
            t: 'Klimatyzacja ubywa po cichu: nawet szczelny układ traci co roku część czynnika chłodniczego, a razem z nim olej, który smaruje sprężarkę – najdroższy element całego układu. Wilgotny parownik schowany pod deską rozdzielczą jest z kolei idealnym miejscem dla grzybów i bakterii, którymi oddychasz w czasie jazdy.'
          },
          {
            typ: 'p',
            t: 'Dobra wiadomość: kilka prostych nawyków i jeden serwis w roku wystarczą, żeby klimatyzacja działała sprawnie i nie śmierdziała. W tym poradniku wyjaśniamy, jak działa układ, po czym poznać nieszczelność, ile kosztuje serwis, którą metodę odgrzybiania wybrać i kiedy wymienić filtr kabinowy.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Najkrótsza wersja: włączaj klimatyzację regularnie, także zimą. Raz w roku – najlepiej wiosną – zrób serwis z kontrolą szczelności, odgrzybianie i wymianę filtra kabinowego. Jeśli klimatyzacja słabo chłodzi, nie „dobijaj” czynnika bez szukania przyczyny.'
          }
        ]
      },
      {
        id: 'jak-dziala',
        t: 'Jak działa klimatyzacja w samochodzie',
        bloki: [
          {
            typ: 'p',
            t: 'Klimatyzacja nie „produkuje zimna”. Przenosi ciepło z wnętrza auta na zewnątrz – tak jak lodówka. Robi to czynnik chłodniczy, który krąży w zamkniętym obiegu i na zmianę paruje (zabiera ciepło) i skrapla się (oddaje ciepło).'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Sprężarka', o: 'Napędzana przez silnik (w hybrydach i elektrykach – elektrycznie). Spręża gazowy czynnik, który przy tym mocno się nagrzewa. To najdroższy element układu – smaruje ją olej krążący razem z czynnikiem.' },
              { t: 'Skraplacz', o: 'Chłodnica klimatyzacji z przodu auta, zwykle przed chłodnicą silnika. Tu gorący czynnik oddaje ciepło do otoczenia i zamienia się w ciecz.' },
              { t: 'Osuszacz (filtr osuszacz)', o: 'Wyłapuje wilgoć i zanieczyszczenia z czynnika. Wilgoć w układzie powoduje korozję i obniża wydajność, dlatego osuszacz wymienia się po rozszczelnieniu układu.' },
              { t: 'Zawór rozprężny', o: 'Gwałtownie obniża ciśnienie ciekłego czynnika. Czynnik się rozpręża i mocno ochładza.' },
              { t: 'Parownik', o: 'Mała chłodnica schowana pod deską rozdzielczą. Zimny czynnik paruje w niej i odbiera ciepło z powietrza, które dmuchawa wpycha do kabiny. Na zimnym parowniku skrapla się wilgoć – dlatego pod autem z włączoną klimatyzacją kapie woda, a parownik jest stale wilgotny.' }
            ]
          },
          {
            typ: 'p',
            t: 'Dzięki temu, że na parowniku skrapla się para wodna, klimatyzacja nie tylko chłodzi, ale też osusza powietrze. To bardzo przydatne jesienią i zimą: z włączoną klimatyzacją szyby odparowują znacznie szybciej.'
          }
        ]
      },
      {
        id: 'czynnik',
        t: 'R134a czy R1234yf – jaki czynnik masz w aucie i ile kosztuje serwis',
        bloki: [
          {
            typ: 'p',
            t: 'Starsze auta mają czynnik R134a. Nowsze – produkowane mniej więcej od 2017 roku – nowszy czynnik R1234yf, mniej szkodliwy dla klimatu, ale wyraźnie droższy. Jaki czynnik jest w Twoim aucie, sprawdzisz na naklejce pod maską (zwykle na pasie przednim) – podana jest tam też ilość czynnika w gramach.'
          },
          {
            typ: 'tabela',
            naglowki: ['', 'R134a', 'R1234yf'],
            wiersze: [
              ['W jakich autach', 'Starsze auta, zwykle sprzed 2017 r.', 'Nowsze auta, zwykle od 2017 r.'],
              ['Pierwsze 100 g czynnika', 'ok. 120–150 zł', 'ok. 250 zł'],
              ['Każde kolejne 100 g', 'ok. 40 zł', 'ok. 80 zł'],
              ['Pełny serwis', 'ok. 250–400 zł', 'ok. 500–700 zł'],
              ['Serwis z odgrzybianiem i filtrem', 'ok. 350–500 zł', 'ok. 600–800 zł']
            ],
            podpis: 'Orientacyjne ceny serwisu klimatyzacji w Polsce (2026). W dużych miastach zwykle o 10–15% drożej.'
          },
          {
            typ: 'p',
            t: 'Dobry serwis to nie samo „nabicie”. Warsztat powinien odessać stary czynnik, sprawdzić szczelność układu próbą próżni, wpompować właściwą ilość czynnika i oleju, a na koniec zmierzyć temperaturę powietrza z nawiewów. Zgodnie z przepisami o tzw. F-gazach serwis nie powinien uzupełniać czynnika w układzie, który ma wyraźny ubytek, bez wcześniejszego znalezienia i naprawienia nieszczelności.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Hybrydy i auta elektryczne mają sprężarkę elektryczną i wymagają specjalnego oleju, który nie przewodzi prądu. Serwis klimatyzacji w takim aucie zlecaj tylko warsztatowi, który ma do tego odpowiedni sprzęt – pomyłka może zniszczyć sprężarkę.'
          }
        ]
      },
      {
        id: 'nieszczelnosc',
        t: 'Objawy nieszczelności i usterek klimatyzacji',
        bloki: [
          {
            typ: 'p',
            t: 'Nawet całkiem sprawny układ traci rocznie ok. 10% czynnika przez uszczelki i węże. Po 2–3 latach bez serwisu klimatyzacja wyraźnie słabiej chłodzi, a sprężarka pracuje z niedoborem oleju. Gdy ubytek jest szybszy – czynnik ucieka w ciągu kilku tygodni – układ jest nieszczelny.'
          },
          {
            typ: 'tabela',
            naglowki: ['Objaw', 'Najczęstsza przyczyna', 'Co zrobić'],
            wiersze: [
              ['Słabe chłodzenie', 'Za mało czynnika, brudny skraplacz lub zapchany filtr kabinowy', 'Serwis z kontrolą ilości czynnika, wymiana filtra'],
              ['Chłodzi tylko chwilami', 'Wilgoć lub zanieczyszczenia w układzie, kłopot z zaworem', 'Diagnostyka w warsztacie, często wymiana osuszacza'],
              ['Wcale nie chłodzi', 'Brak czynnika, awaria sprężarki lub jej sprzęgła, zawory', 'Nie dobijaj czynnika na ślepo – najpierw test szczelności'],
              ['Szybko ubywa czynnika po serwisie', 'Nieszczelność: węże, uszczelki, skraplacz, parownik', 'Szukanie wycieku barwnikiem UV lub azotem, naprawa'],
              ['Hałas po włączeniu klimatyzacji', 'Ślizgający się pasek, zużyte sprzęgło lub łożysko sprężarki', 'Pilnie do warsztatu – zatarta sprężarka to koszt kilku tysięcy zł'],
              ['Nieprzyjemny zapach z nawiewów', 'Grzyby i bakterie na parowniku', 'Odgrzybianie i wymiana filtra kabinowego']
            ],
            podpis: 'Typowe objawy usterek klimatyzacji samochodowej.'
          },
          {
            typ: 'p',
            t: 'Nieszczelność warsztat szuka zwykle na trzy sposoby: próbą próżni (czy układ utrzymuje podciśnienie), barwnikiem UV dodanym do czynnika (wyciek świeci w świetle lampy UV) albo napełniając układ azotem pod ciśnieniem. Czasem nieszczelność widać gołym okiem – jako oleisty nalot na złączkach lub na skraplaczu.'
          }
        ]
      },
      {
        id: 'odgrzybianie',
        t: 'Odgrzybianie: ozon, ultradźwięki czy pianka?',
        bloki: [
          {
            typ: 'p',
            t: 'Parownik jest stale wilgotny i ciemny – idealne miejsce dla grzybów i bakterii. Objaw to stęchły zapach z nawiewów, zwłaszcza zaraz po włączeniu dmuchawy. Odgrzybianie warto robić raz w roku, najlepiej wiosną. Metody różnią się tym, czy działają tylko w kabinie, czy docierają do parownika.'
          },
          {
            typ: 'tabela',
            naglowki: ['Metoda', 'Jak działa', 'Plusy i minusy', 'Cena'],
            wiersze: [
              ['Ozonowanie', 'Ozonator w zamkniętym aucie wytwarza ozon, który przy pracującej dmuchawie krąży po kabinie i kanałach nawiewu.', 'Dobrze usuwa zapachy i drobnoustroje w kabinie. Słabiej czyści sam parownik. Po zabiegu auto trzeba dokładnie przewietrzyć.', 'ok. 100–300 zł'],
              ['Ultradźwięki', 'Urządzenie zamienia płyn dezynfekujący w bardzo drobną mgiełkę, którą dmuchawa wciąga do układu.', 'Mgiełka dociera do parownika i kanałów. Uważana za najskuteczniejszą z popularnych metod.', 'ok. 150–350 zł'],
              ['Pianka lub spray', 'Preparat wtryskiwany przez kratkę nawiewu, otwór odpływu skroplin albo bezpośrednio na parownik.', 'Tania i do zrobienia samemu. Skuteczność zależy od tego, czy preparat dotrze do parownika. Zapach może utrzymywać się kilka dni.', 'kilkadziesiąt zł'],
              ['Ciśnieniowe mycie parownika', 'Warsztat wprowadza sondę do parownika i myje go preparatem pod ciśnieniem.', 'Najlepiej czyści mocno zabrudzony parownik. Droższa i nie każdy warsztat ją oferuje.', 'zależnie od warsztatu']
            ],
            podpis: 'Popularne metody odgrzybiania klimatyzacji samochodowej (orientacyjne ceny 2026).'
          },
          {
            typ: 'p',
            t: 'W praktyce najlepiej sprawdza się połączenie: czyszczenie parownika (pianką, ultradźwiękami albo ciśnieniowo), wymiana filtra kabinowego i dopiero na koniec ozonowanie, które usuwa resztki zapachów z kabiny. Samo ozonowanie przy brudnym parowniku i starym filtrze daje efekt tylko na chwilę.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Ozon w dużym stężeniu jest szkodliwy dla ludzi i zwierząt. W czasie ozonowania nikt nie może przebywać w aucie, a po zabiegu trzeba je dokładnie przewietrzyć. Nie ozonuj też auta zbyt często i zbyt długo – ozon przyspiesza starzenie się gumy i niektórych tworzyw.'
          }
        ]
      },
      {
        id: 'filtr',
        t: 'Filtr kabinowy – mała część, duża różnica',
        bloki: [
          {
            typ: 'p',
            t: 'Filtr kabinowy oczyszcza powietrze, które wpada do wnętrza auta: z kurzu, pyłków i spalin. Zapchany filtr ogranicza przepływ powietrza, przez co klimatyzacja słabiej chłodzi, szyby dłużej parują, a z nawiewów może brzydko pachnieć. Wymieniaj go co najmniej raz w roku albo co ok. 15–20 tys. km – częściej, jeśli jeździsz po szutrowych drogach, w dużym mieście lub masz alergię.'
          },
          {
            typ: 'tabela',
            naglowki: ['Rodzaj filtra', 'Co zatrzymuje', 'Dla kogo'],
            wiersze: [
              ['Zwykły (przeciwpyłkowy)', 'Kurz, pyłki, zarodniki', 'Najtańszy, wystarczy przy jeździe poza dużymi miastami'],
              ['Z węglem aktywnym', 'Dodatkowo zapachy i część szkodliwych gazów ze spalin', 'Jazda w mieście i w korkach – najczęściej polecany'],
              ['Antysmogowy / antyalergiczny', 'Bardzo drobne cząstki pyłu (np. PM2,5), alergeny, często z warstwą antybakteryjną', 'Alergicy i osoby jeżdżące w smogu']
            ],
            podpis: 'Rodzaje filtrów kabinowych.'
          },
          {
            typ: 'p',
            t: 'W wielu autach filtr kabinowy wymienisz sam w kilka minut – zwykle jest za schowkiem pasażera albo pod podszybiem przed szybą. Zamiennik dobrej firmy kosztuje zwykle kilkadziesiąt do ok. 100 zł. Najlepiej wymieniać go wiosną, przed sezonem pylenia, a jeśli dwa razy w roku – to drugi raz jesienią.'
          }
        ]
      },
      {
        id: 'nawyki',
        t: 'Jak korzystać z klimatyzacji, żeby działała latami',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'Włączaj klimatyzację regularnie przez cały rok, także zimą – przynajmniej raz w tygodniu na kilkanaście minut. Długi postój szkodzi sprężarce i uszczelkom.',
              'Kilka minut przed końcem jazdy wyłącz klimatyzację, ale zostaw dmuchawę. Parownik przeschnie i grzyby będą miały gorsze warunki do rozwoju.',
              'W upał najpierw przewietrz nagrzane auto (otwórz okna na chwilę), a dopiero potem zamknij je i włącz klimatyzację.',
              'Nie ustawiaj bardzo niskiej temperatury. Duża różnica między wnętrzem a otoczeniem sprzyja przeziębieniom – rozsądnie jest chłodzić o kilka stopni, a nie do 16°C.',
              'Nie kieruj zimnego nawiewu prosto na twarz i szyję – lepiej na szybę i w stronę sufitu.',
              'Jesienią i zimą używaj klimatyzacji do osuszania powietrza – szyby szybciej odparują.'
            ]
          }
        ]
      },
      {
        id: 'czego-unikac',
        t: 'Czego unikać',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'Samego „dobijania” czynnika bez sprawdzenia szczelności – za kilka tygodni klimatyzacja znów przestanie chłodzić, a pieniądze ulecą razem z czynnikiem.',
              'Jazdy z hałasującą sprężarką – zatarcie może rozsypać opiłki po całym układzie, a naprawa kosztuje wtedy kilka tysięcy zł.',
              'Wyłączania klimatyzacji na całą zimę i jesień.',
              'Ozonowania jako jedynego sposobu na zapach – bez czyszczenia parownika i nowego filtra efekt będzie krótkotrwały.',
              'Przebywania w aucie w czasie ozonowania i jazdy bez przewietrzenia kabiny po zabiegu.',
              'Puszek z czynnikiem „do samodzielnego nabicia” – łatwo przeładować układ albo wprowadzić wilgoć, a w hybrydzie można uszkodzić sprężarkę.',
              'Zostawiania starego, zapchanego filtra kabinowego na kolejne lata.'
            ]
          }
        ]
      },
      {
        id: 'produkty',
        t: 'Polecane produkty i narzędzia',
        bloki: [
          {
            typ: 'produkty',
            elementy: [
              { nazwa: 'Filtr kabinowy z węglem aktywnym', o: 'Zatrzymuje pył, pyłki i zapachy spalin. Dobierz go do modelu auta (po numerze katalogowym lub VIN) i wymieniaj co najmniej raz w roku.', szukaj: 'filtr kabinowy węglowy' },
              { nazwa: 'Pianka do czyszczenia klimatyzacji z sondą', o: 'Preparat z długą rurką, którą wprowadzasz do parownika (przez odpływ skroplin lub otwór przy dmuchawie). Wystarczy raz w roku, razem z wymianą filtra.', szukaj: 'pianka do czyszczenia klimatyzacji z sondą' },
              { nazwa: 'Termometr do nawiewów', o: 'Mały termometr szpilkowy pozwala sprawdzić, jak zimne powietrze leci z nawiewów. Sprawna klimatyzacja daje zwykle kilka stopni Celsjusza na środkowym nawiewie przy pełnej mocy.', szukaj: 'termometr szpilkowy do klimatyzacji' },
              { nazwa: 'Raport historii auta przed zakupem', o: 'Kupując używane auto, sprawdź po numerze VIN jego historię – auta po powodzi i poważnych stłuczkach przodu często mają uszkodzony skraplacz i problemy z klimatyzacją.', partner: 'vin' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Jak często serwisować klimatyzację w samochodzie?', a: 'Raz w roku, najlepiej wiosną przed sezonem upałów. Nawet sprawny układ traci ok. 10% czynnika rocznie, a razem z nim olej smarujący sprężarkę.' },
      { q: 'Ile kosztuje nabicie klimatyzacji?', a: 'W 2026 roku pełny serwis z czynnikiem R134a (starsze auta) kosztuje ok. 250–400 zł, a z czynnikiem R1234yf (auta mniej więcej od 2017 roku) ok. 500–700 zł. Z odgrzybianiem i wymianą filtra – odpowiednio ok. 350–500 zł i 600–800 zł.' },
      { q: 'Co jest lepsze: ozonowanie czy ultradźwięki?', a: 'Ultradźwięki uchodzą za skuteczniejsze, bo mgiełka z płynem dezynfekującym dociera do parownika i kanałów nawiewu. Ozonowanie dobrze usuwa zapachy i drobnoustroje w kabinie, ale słabiej czyści sam parownik. Najlepszy efekt daje czyszczenie parownika, nowy filtr kabinowy i dopiero potem ozonowanie.' },
      { q: 'Dlaczego klimatyzacja śmierdzi?', a: 'Najczęściej z powodu grzybów i bakterii na wilgotnym parowniku pod deską rozdzielczą oraz starego filtra kabinowego. Pomaga odgrzybianie i wymiana filtra, a na co dzień – wyłączanie klimatyzacji kilka minut przed końcem jazdy przy włączonej dmuchawie.' },
      { q: 'Czy włączać klimatyzację zimą?', a: 'Tak. Regularna praca chroni sprężarkę i uszczelki przed skutkami długiego postoju, a klimatyzacja osusza powietrze, dzięki czemu szyby szybciej odparowują.' }
    ],
    powiazane: ['olej-silnikowy-jak-dobrac', 'zima-w-samochodzie', 'kontrolki-w-samochodzie'],
    zrodla: [Z.acKlimaCena, Z.otomotoOdgrzybianie, Z.asKlimaAwarie, Z.asFgazy, Z.acFiltrKabinowy, Z.asPrzedSezonem]
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
  },
  'olej-silnikowy-jak-dobrac': {
    seoTytul: 'Olej silnikowy – jak dobrać, co ile wymieniać',
    seoOpis: 'Co oznacza 5W-30, normy ACEA, API i producentów, olej do auta z DPF, syntetyk czy półsyntetyk, co ile wymieniać olej i czy gęstszy olej pomaga starszemu silnikowi.',
    skrot: [
      'Najpierw norma producenta auta (np. VW 507.00, MB 229.51), potem lepkość, na końcu marka i cena.',
      'Auto z filtrem DPF lub GPF wymaga oleju z normą ACEA C.',
      'Rozsądny interwał to ok. 15 tys. km lub raz w roku, przy mieście, turbo i LPG – ok. 10 tys. km.'
    ]
  },
  'klimatyzacja-samochodowa-serwis-odgrzybianie': {
    seoTytul: 'Klimatyzacja w aucie – serwis i odgrzybianie',
    seoOpis: 'Jak działa klimatyzacja w aucie, objawy nieszczelności, ceny serwisu R134a i R1234yf, ozonowanie czy ultradźwięki, czyszczenie parownika i wymiana filtra kabinowego.',
    skrot: [
      'Serwis, odgrzybianie i wymiana filtra kabinowego – raz w roku, najlepiej wiosną.',
      'Nie dobijaj czynnika bez testu szczelności – sprawny układ traci ok. 10% rocznie, szybszy ubytek to nieszczelność.',
      'Ultradźwięki docierają do parownika, ozon głównie odświeża kabinę – najlepiej łączyć je z czyszczeniem parownika.'
    ]
  }
};
