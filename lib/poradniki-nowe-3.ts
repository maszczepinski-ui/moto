// Nowe poradniki – część 3: sprawdzanie auta, kupno, finansowanie, paliwo i auto elektryczne.
// Ceny paliw i prądu w przykładach biorą się z panelu admina (zakładka „SEO, reklamy i ceny”), więc po aktualizacji cen w panelu teksty przeliczą się same.
import type { Poradnik } from '@/lib/poradniki';
import type { DodatekSeo } from '@/lib/poradniki-nowe';
import { cenyPaliw } from '@/lib/panel';

const C = cenyPaliw();
const zl = (n: number) => `${n.toFixed(2).replace('.', ',')} zł`;
const zl0 = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;
const dataCen = C.data.split('-').reverse().join('.');

// Przykład: auto kompaktowe, 100 km
const SPALANIE = { pb: 7, lpg: 8.4, on: 5.5, hybryda: 5, ev: 17 };
const KOSZT = {
  pb: SPALANIE.pb * C.pb95,
  lpg: SPALANIE.lpg * C.lpg,
  on: SPALANIE.on * C.on,
  hybryda: SPALANIE.hybryda * C.pb95,
  evDom: SPALANIE.ev * C.prad,
  evDc: SPALANIE.ev * 2.49
};
const OSZCZ_LPG = KOSZT.pb - KOSZT.lpg; // zł na 100 km
const ZWROT_LPG_KM = OSZCZ_LPG > 0 ? Math.round(4500 / OSZCZ_LPG) * 100 : 0;

const Z = {
  historia: { n: 'Historia Pojazdu – bezpłatne sprawdzenie auta w CEPiK (gov.pl)', url: 'https://historiapojazdu.gov.pl/' },
  oszustwa: { n: 'Auto Świat – triki handlarzy, jak się nie nabrać', url: 'https://www.auto-swiat.pl/porady/oszustwa-przy-handlu-samochodami-oto-12-trikow-handlarzy-jak-sie-nie-nabrac/ty3cmqv' },
  licznik: { n: 'Mubi – zaniżony przebieg samochodu: kary i co zrobić', url: 'https://mubi.pl/poradniki/zanizony-przebieg-samochodu/' },
  kc: { n: 'Kodeks cywilny – rękojmia, art. 556–558 (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093' },
  pcc: { n: 'Otomoto – podatek PCC-3 przy kupnie auta (2026)', url: 'https://www.otomoto.pl/news/podatek-od-kupna-samochodu-pcc-3' },
  rejestracja: { n: 'Otomoto – ile kosztuje rejestracja samochodu w 2026 r.', url: 'https://www.otomoto.pl/news/rejestracja-samochodu-2' },
  cukRaport: { n: 'CUK Ubezpieczenia – raport cen OC i AC (2026)', url: 'https://cuk.pl/aktualnosci/raport-cen-oc-ac' },
  kredytKonsumencki: { n: 'Ustawa o kredycie konsumenckim (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU201101260715' },
  uokik: { n: 'UOKiK – prawa konsumenta przy kredycie', url: 'https://prawakonsumenta.uokik.gov.pl/' },
  lpg: { n: 'Cenauslug.pl – koszt instalacji LPG w 2026 r. i opłacalność', url: 'https://cenauslug.pl/poradniki/koszt-instalacji-lpg-czy-to-nadal-sie-oplaca' },
  ladowanie: { n: 'Freenance – koszty ładowania auta elektrycznego w Polsce (2026)', url: 'https://freenance.io/inwestowanie/ladowanie-samochodu-elektrycznego-koszty-2026-pl-supercharger-ionity-domowe-publiczne/' },
  naszeauto: { n: 'Elektromobilni.pl – program NaszEauto: wykorzystanie budżetu (styczeń 2026)', url: 'https://elektromobilni.pl/naszeauto-dojezdza-do-mety/' },
  nfosigw: { n: 'NFOŚiGW – programy dopłat (aktualne nabory)', url: 'https://www.gov.pl/web/nfosigw' }
};

export const NOWE_3: Poradnik[] = [
  // ───────────── Oględziny ─────────────
  {
    slug: 'ogledziny-uzywanego-auta-lista',
    kategoria: 'sprawdzenie',
    ikona: 'lista',
    tytul: 'Jak sprawdzić używane auto przed zakupem – lista kontrolna oględzin',
    krotko: 'Oględziny auta – lista',
    opis: 'Praktyczna lista rzeczy do sprawdzenia przy oględzinach używanego auta: dokumenty, nadwozie, wnętrze, silnik i jazda próbna. Zabierz ją na telefonie i odhaczaj punkt po punkcie.',
    liczby: [
      { w: '5 etapów', o: 'dokumenty, nadwozie, wnętrze, silnik, jazda' },
      { w: '30–60 min', o: 'tyle zajmują rzetelne oględziny' },
      { w: '0 zł', o: 'sprawdzenie auta w bazie CEPiK' }
    ],
    sekcje: [
      {
        id: 'przed-wyjazdem',
        t: 'Zanim pojedziesz oglądać auto',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Poproś o VIN, numer rejestracyjny i datę pierwszej rejestracji', o: 'Z tymi danymi sprawdzisz auto za darmo w serwisie Historia Pojazdu (CEPiK): przebiegi z przeglądów, ważność OC, badania techniczne. Sprzedawca, który odmawia podania VIN, ma zwykle coś do ukrycia.' },
              { t: 'Sprawdź historię za granicą', o: 'Przy aucie sprowadzonym polska baza zna tylko okres od rejestracji w kraju. Raport historii pojazdu po VIN może pokazać szkody i przebiegi z innych krajów.' },
              { t: 'Umów się w dzień, przy suchej pogodzie', o: 'W deszczu i po zmroku nie zobaczysz różnic w lakierze ani wycieków. Poproś, żeby silnik był zimny – wtedy łatwiej usłyszeć problemy przy rozruchu.' }
            ]
          },
          {
            typ: 'link',
            t: 'Sprawdź auto po numerze VIN',
            o: 'Przebieg, szkody i historia – zanim pojedziesz na oględziny.',
            href: '/sprawdz-vin/'
          }
        ]
      },
      {
        id: 'dokumenty',
        t: 'Etap 1: dokumenty',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'dowód rejestracyjny – czy dane sprzedającego zgadzają się z dowodem osobistym (albo czy ma umowę kupna, jeśli nie zdążył przerejestrować),',
              'numer VIN w dowodzie, na tabliczce znamionowej, na szybie i na nadwoziu – wszystkie muszą być identyczne i nie mogą nosić śladów przeróbek,',
              'książka serwisowa i faktury za naprawy – daty i przebiegi powinny układać się logicznie,',
              'karta pojazdu (jeśli była wydana) i ważne badanie techniczne,',
              'liczba kluczyków – brak drugiego kluczyka to koszt dorobienia i sygnał, że warto dopytać.'
            ]
          }
        ]
      },
      {
        id: 'nadwozie',
        t: 'Etap 2: nadwozie i opony',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'obejdź auto z odległości kilku metrów – czy kolory elementów są identyczne, a szczeliny między drzwiami, maską i błotnikami równe,',
              'zmierz grubość lakieru miernikiem (kosztuje kilkadziesiąt złotych) – duże różnice między elementami to ślad po naprawie blacharskiej,',
              'zajrzyj pod uszczelki drzwi i klapy – ślady innego lakieru lub szpachli zdradzają naprawy,',
              'sprawdź progi, nadkola i dół drzwi pod kątem rdzy,',
              'obejrzyj szyby – oznaczenia z rokiem produkcji powinny być podobne; jedna nowsza szyba nie musi oznaczać wypadku, ale warto zapytać,',
              'opony: równy bieżnik na całej szerokości i ten sam model na jednej osi; nierówne zużycie może oznaczać złą geometrię po wypadku.'
            ]
          }
        ]
      },
      {
        id: 'wnetrze-silnik',
        t: 'Etap 3 i 4: wnętrze i silnik',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'zużycie kierownicy, gałki zmiany biegów i pedałów powinno pasować do przebiegu – mocno wytarta kierownica przy 90 000 km to sygnał ostrzegawczy,',
              'zapach stęchlizny, wilgoć pod dywanikami lub osad w zakamarkach mogą oznaczać zalanie,',
              'sprawdź wszystkie przyciski: klimatyzację, szyby, lusterka, ogrzewanie, radio, czujniki parkowania,',
              'po przekręceniu kluczyka wszystkie kontrolki powinny się zapalić, a po uruchomieniu – zgasnąć,',
              'pod maską: wycieki oleju i płynów, stan i poziom oleju, kolor płynu chłodzącego (bez oleju i piany),',
              'zimny rozruch: silnik powinien zapalić od razu i pracować równo; niebieski dym oznacza spalanie oleju, biały gęsty dym po rozgrzaniu – możliwy problem z uszczelką pod głowicą.'
            ]
          },
          {
            typ: 'link',
            t: 'Co oznaczają kontrolki na desce',
            o: 'Kolory, najważniejsze symbole i kiedy nie jechać dalej.',
            href: '/poradniki/kontrolki-w-samochodzie/'
          }
        ]
      },
      {
        id: 'jazda-i-decyzja',
        t: 'Etap 5: jazda próbna i decyzja',
        bloki: [
          {
            typ: 'p',
            t: 'Jazda próbna to najważniejsza część oględzin – na postoju nie usłyszysz stuków zawieszenia ani nie poczujesz szarpania skrzyni biegów. Opisujemy ją w osobnym poradniku. Jeśli auto Ci się podoba, a nie znasz się na mechanice, zapłać za sprawdzenie w niezależnym warsztacie albo stacji diagnostycznej. To koszt rzędu kilkuset złotych, który może uchronić przed wydatkiem kilku tysięcy.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Nie dawaj zaliczki „na rezerwację” przed oględzinami i nie płać za auto, którego nie widziałeś. To najczęstszy schemat oszustw przy ogłoszeniach.'
          },
          {
            typ: 'link',
            t: 'Umowa kupna-sprzedaży – wzór do druku',
            o: 'Gotowa umowa z przebiegiem, VIN i oświadczeniem sprzedającego.',
            href: '/poradniki/umowa-kupna-sprzedazy-samochodu/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Co sprawdzić przy oględzinach używanego auta?', a: 'Dokumenty i VIN, nadwozie (lakier, szczeliny, rdza), opony, wnętrze (zużycie a przebieg, wilgoć), silnik (wycieki, zimny rozruch, dym) i zachowanie auta w czasie jazdy próbnej.' },
      { q: 'Jak sprawdzić auto za darmo?', a: 'W serwisie Historia Pojazdu na gov.pl. Potrzebujesz numeru rejestracyjnego, VIN i daty pierwszej rejestracji. Zobaczysz przebiegi z badań technicznych, ważność OC i przeglądu.' },
      { q: 'Jaka grubość lakieru jest fabryczna?', a: 'To zależy od marki i modelu, dlatego ważniejsze od konkretnej liczby są różnice między elementami. Element wyraźnie grubszy od sąsiednich był najpewniej lakierowany.' },
      { q: 'Czy warto płacić za sprawdzenie auta w warsztacie?', a: 'Tak, jeśli nie znasz się na mechanice. Kilkaset złotych za diagnostykę to niewiele w porównaniu z kosztem ukrytej usterki silnika lub skrzyni.' }
    ],
    powiazane: ['jazda-probna-na-co-zwrocic-uwage', 'cofniety-licznik-jak-sprawdzic-przebieg', 'oszustwa-przy-zakupie-auta'],
    zrodla: [Z.historia, Z.oszustwa, Z.licznik, Z.kc]
  },

  // ───────────── Jazda próbna ─────────────
  {
    slug: 'jazda-probna-na-co-zwrocic-uwage',
    kategoria: 'sprawdzenie',
    ikona: 'jazda',
    tytul: 'Jazda próbna używanym autem – na co zwrócić uwagę w 20 minut',
    krotko: 'Jazda próbna',
    opis: 'Dobrze zaplanowana jazda próbna pokaże więcej niż godzina oglądania auta na parkingu. Zobacz, jaką trasę wybrać, czego słuchać i jakie objawy powinny skłonić Cię do rezygnacji.',
    liczby: [
      { w: '20 min', o: 'minimalny czas jazdy próbnej' },
      { w: '3 rodzaje dróg', o: 'miasto, nierówności i szybsza trasa' },
      { w: 'radio wył.', o: 'żeby słyszeć auto' }
    ],
    sekcje: [
      {
        id: 'przygotowanie',
        t: 'Zanim ruszysz',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'sprawdź, czy auto ma ważne OC i badanie techniczne – jazda autem bez OC grozi karą, a za szkodę w czasie jazdy próbnej odpowiada polisa auta,',
              'ustal ze sprzedającym trasę i to, kto prowadzi – najlepiej, żebyś prowadził Ty, a sprzedający siedział obok,',
              'ruszaj z zimnym silnikiem, jeśli to możliwe – sprzedawca, który „przed chwilą rozgrzał auto”, mógł coś ukrywać,',
              'wyłącz radio i dmuchawę, żeby słyszeć pracę silnika i zawieszenia.'
            ]
          }
        ]
      },
      {
        id: 'trasa',
        t: 'Trasa jazdy próbnej – co sprawdzić po kolei',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Parking: skręty kół do oporu', o: 'Kręć kierownicą w obie strony na postoju i przy powolnej jeździe. Stuki i trzaski mogą oznaczać zużyte przeguby lub elementy układu kierowniczego.' },
              { t: 'Miasto: ruszanie i zmiana biegów', o: 'Sprzęgło nie powinno łapać przy samej górze pedału. Biegi wchodzą gładko, bez zgrzytów. Automat zmienia biegi płynnie, bez szarpnięć i opóźnień.' },
              { t: 'Nierówna droga: zawieszenie', o: 'Przejedź przez kilka nierówności i próg zwalniający. Głuche stuki, skrzypienie czy bujanie po przejechaniu nierówności to koszt naprawy zawieszenia.' },
              { t: 'Szybsza droga: silnik i prowadzenie', o: 'Przyspiesz na kilku biegach. Auto powinno jechać prosto przy puszczonej na chwilę kierownicy (na pustej drodze). Wibracje przy 90–120 km/h mogą oznaczać niewyważone koła albo zużyte elementy.' },
              { t: 'Hamowanie', o: 'Zahamuj mocniej w bezpiecznym miejscu. Auto nie może ściągać na bok, a pedał nie powinien pulsować (poza zadziałaniem ABS).' },
              { t: 'Po jeździe: postój z pracującym silnikiem', o: 'Zostaw auto na kilka minut na wolnych obrotach. Obserwuj temperaturę, załączenie wentylatora, kontrolki i ewentualne wycieki pod autem.' }
            ]
          }
        ]
      },
      {
        id: 'sygnaly-ostrzegawcze',
        t: 'Sygnały, po których lepiej zrezygnować',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'świecące lub migające kontrolki silnika, ABS, poduszek albo skrzyni,',
              'dym z rury wydechowej po rozgrzaniu silnika (niebieski lub gęsty biały),',
              'szarpanie lub ślizganie się automatycznej skrzyni biegów,',
              'metaliczne stuki z silnika przy zmianie obrotów,',
              'sprzedający nie pozwala prowadzić, nie zgadza się na wizytę w warsztacie albo bardzo się spieszy.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Drobne usterki nie muszą przekreślać zakupu – mogą być argumentem w negocjacji ceny. Zapisz je i poproś mechanika o wycenę naprawy, zanim zaproponujesz kwotę.'
          },
          {
            typ: 'link',
            t: 'Ile jest warte używane auto',
            o: 'Jak policzyć uczciwą cenę i negocjować na podstawie usterek.',
            href: '/poradniki/ile-jest-warte-uzywane-auto/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile powinna trwać jazda próbna?', a: 'Co najmniej 20 minut, po różnych drogach: w mieście, na nierównościach i na szybszej trasie. Krótka przejażdżka wokół parkingu niczego nie pokaże.' },
      { q: 'Kto odpowiada za szkodę w czasie jazdy próbnej?', a: 'Szkody wyrządzone innym pokrywa OC auta. Za uszkodzenie samego auta odpowiadasz zwykle na zasadach ogólnych, dlatego przed jazdą ustal ze sprzedającym warunki i sprawdź, czy auto ma AC.' },
      { q: 'Czy mogę jeździć autem bez ważnego przeglądu?', a: 'Nie powinieneś. Auto bez ważnego badania technicznego nie może poruszać się po drogach publicznych, a ubezpieczyciel może mieć zastrzeżenia przy szkodzie.' },
      { q: 'Co zrobić, gdy sprzedawca nie pozwala na jazdę próbną?', a: 'Zrezygnuj albo poproś o wizytę w warsztacie, gdzie mechanik sprawdzi auto. Brak zgody na jazdę próbną to poważny sygnał ostrzegawczy.' }
    ],
    powiazane: ['ogledziny-uzywanego-auta-lista', 'oszustwa-przy-zakupie-auta', 'umowa-kupna-sprzedazy-samochodu'],
    zrodla: [Z.oszustwa, Z.historia]
  },

  // ───────────── Auto po powodzi ─────────────
  {
    slug: 'auto-po-powodzi-jak-rozpoznac',
    kategoria: 'sprawdzenie',
    ikona: 'powodz',
    tytul: 'Auto po powodzi – jak rozpoznać zalany samochód przed zakupem',
    krotko: 'Auto po powodzi',
    opis: 'Zalane auta po wysuszeniu i umyciu wracają do sprzedaży, często daleko od miejsca powodzi. Zobacz, jakie ślady zostawia woda, jak sprawdzić historię auta i dlaczego problemy z elektroniką mogą wyjść dopiero po miesiącach.',
    liczby: [
      { w: '7 miejsc', o: 'gdzie szukać śladów wody' },
      { w: 'miesiące', o: 'po tylu często wychodzą usterki elektryki' },
      { w: 'VIN', o: 'pozwala sprawdzić szkody i historię' }
    ],
    sekcje: [
      {
        id: 'dlaczego-grozne',
        t: 'Dlaczego zalane auto to ryzykowny zakup',
        bloki: [
          {
            typ: 'p',
            t: 'Woda – zwłaszcza brudna, z mułem – wnika w wiązki elektryczne, złącza, sterowniki, łożyska i tapicerkę. Auto po wysuszeniu może jeździć bez zarzutu, ale korozja styków postępuje powoli. Po kilku miesiącach zaczynają się kłopoty z elektroniką, czujnikami, poduszkami powietrznymi czy zamkiem centralnym, a naprawa bywa droższa niż wartość auta.'
          },
          {
            typ: 'p',
            t: 'Po dużych powodziach, także w Polsce i krajach sąsiednich, część zalanych aut trafia na rynek przez aukcje powypadkowe. Nie każde takie auto jest złe – ale sprzedawca powinien uczciwie o tym powiedzieć, a cena powinna to uwzględniać.'
          }
        ]
      },
      {
        id: 'slady',
        t: 'Gdzie szukać śladów wody',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zapach', o: 'Stęchlizna albo bardzo intensywny zapach odświeżacza we wnętrzu. Mocny zapach chemii może maskować wilgoć.' },
              { t: 'Pod dywanikami i wykładziną', o: 'Unieś wykładzinę przy progu i w bagażniku pod kołem zapasowym. Szukaj wilgoci, zacieków, piasku i mułu.' },
              { t: 'Pasy bezpieczeństwa', o: 'Wyciągnij pas do końca. Przebarwienia, zacieki albo muł na dolnej części pasa to bardzo typowy ślad zalania.' },
              { t: 'Szyny foteli i śruby', o: 'Rdza na szynach, śrubach i sprężynach pod fotelami w kilkuletnim aucie nie jest normalna.' },
              { t: 'Lampy i zegary', o: 'Kropelki wody albo linia osadu w reflektorach, lampach tylnych i za szybką zegarów.' },
              { t: 'Komora silnika', o: 'Muł i suche liście w zakamarkach, rdza na elementach, które zwykle nie rdzewieją, ślady wody w filtrze powietrza.' },
              { t: 'Elektronika', o: 'Sprawdź wszystkie funkcje, szyby, lusterka, radio, czujniki i oświetlenie. Pojedyncze, „losowe” usterki to sygnał ostrzegawczy.' }
            ]
          }
        ]
      },
      {
        id: 'historia',
        t: 'Sprawdź historię auta',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'w serwisie Historia Pojazdu (CEPiK) sprawdź, gdzie i kiedy auto było rejestrowane – rejestracja w rejonie niedawnej powodzi to powód, by dopytać,',
              'raport historii po VIN może pokazać szkody, zdjęcia z aukcji powypadkowych i wpisy z innych krajów,',
              'poproś o faktury z ostatnich napraw – wymiana wykładzin, foteli czy wielu sterowników naraz powinna budzić pytania,',
              'zapytaj wprost, czy auto było zalane, i poproś o wpisanie odpowiedzi do umowy.'
            ]
          },
          {
            typ: 'link',
            t: 'Sprawdź auto po VIN',
            o: 'Szkody, aukcje, przebiegi i historia – także za granicą.',
            href: '/sprawdz-vin/'
          }
        ]
      },
      {
        id: 'gdy-kupiles',
        t: 'Kupiłeś auto i okazało się zalane?',
        bloki: [
          {
            typ: 'p',
            t: 'Jeśli sprzedawca zataił zalanie, możesz skorzystać z rękojmi: żądać obniżenia ceny albo – przy istotnej wadzie – odstąpić od umowy. Między osobami prywatnymi rękojmię można wyłączyć w umowie, ale wyłączenie nie chroni sprzedawcy, który podstępnie zataił wadę. Zbieraj dowody: opinię mechanika, zdjęcia i korespondencję ze sprzedającym.'
          },
          {
            typ: 'link',
            t: 'Oszustwa przy zakupie auta – jak się bronić',
            o: 'Najczęstsze triki sprzedawców i co zrobić, gdy dałeś się oszukać.',
            href: '/poradniki/oszustwa-przy-zakupie-auta/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jak rozpoznać auto po powodzi?', a: 'Szukaj stęchłego zapachu, wilgoci i mułu pod wykładzinami, zacieków na pasach bezpieczeństwa, rdzy na szynach foteli, osadu w lampach oraz losowych usterek elektroniki.' },
      { q: 'Czy zalane auto można bezpiecznie kupić?', a: 'Czasem tak, jeśli naprawa była profesjonalna, sprzedawca mówi o niej otwarcie, a cena to uwzględnia. Bez pełnej wiedzy o zakresie zalania i naprawy to duże ryzyko.' },
      { q: 'Czy w historii auta widać zalanie?', a: 'Nie zawsze. Szkoda wypłacona z ubezpieczenia lub sprzedaż przez aukcję powypadkową może być widoczna w raporcie po VIN, ale zalanie naprawione bez ubezpieczyciela często nie zostawia śladu w bazach.' },
      { q: 'Co mogę zrobić, gdy sprzedawca zataił zalanie?', a: 'Skorzystać z rękojmi: żądać obniżenia ceny lub odstąpić od umowy przy istotnej wadzie. Zatajenie wady jest skuteczne nawet wtedy, gdy w umowie wyłączono rękojmię.' }
    ],
    powiazane: ['ogledziny-uzywanego-auta-lista', 'oszustwa-przy-zakupie-auta', 'numer-vin-co-oznacza'],
    zrodla: [Z.historia, Z.kc, Z.oszustwa]
  },

  // ───────────── Pierwsze auto ─────────────
  {
    slug: 'pierwsze-auto-jak-wybrac',
    kategoria: 'kupno',
    ikona: 'pierwsze',
    tytul: 'Pierwsze auto – jak wybrać i ile pieniędzy przygotować na start',
    krotko: 'Pierwsze auto',
    opis: 'Cena w ogłoszeniu to nie wszystko. Przy pierwszym aucie trzeba doliczyć OC, podatek, rejestrację i pierwszy serwis. Zobacz, jak policzyć budżet, jakie auto wybrać na początek i jak nie przepłacić.',
    liczby: [
      { w: '2%', o: 'podatek PCC od ceny auta' },
      { w: '14 dni', o: 'na zapłatę PCC-3' },
      { w: '30 dni', o: 'na rejestrację auta' }
    ],
    sekcje: [
      {
        id: 'budzet',
        t: 'Budżet: cena auta to dopiero początek',
        bloki: [
          {
            typ: 'p',
            t: 'Najczęstszy błąd przy pierwszym aucie to wydanie całych oszczędności na sam samochód. Tymczasem w pierwszym miesiącu dochodzą stałe koszty, a używane auto prawie zawsze wymaga jakiegoś serwisu. Bezpieczna zasada: zostaw na start ok. 15–20% ceny auta.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Podatek PCC', o: '2% wartości rynkowej auta, płatny w ciągu 14 dni od zakupu od osoby prywatnej (deklaracja PCC-3, najprościej online). Przy zakupie z fakturą od firmy PCC zwykle nie płacisz.' },
              { t: 'Rejestracja', o: 'Wniosek trzeba złożyć w ciągu 30 dni od zakupu. Opłaty to zwykle ok. 180 zł przy nowych tablicach (mniej, jeśli zostawiasz stare). Za spóźnienie grozi kara 500 zł.' },
              { t: 'OC', o: 'Młodzi kierowcy płacili w 2026 r. średnio ok. 1500 zł rocznie. Sprawdź cenę OC dla konkretnego modelu jeszcze przed zakupem.' },
              { t: 'Pierwszy serwis', o: 'Olej, filtry, często klocki, opony lub rozrząd – zależnie od historii auta. Zarezerwuj na to od kilkuset do kilku tysięcy złotych.' }
            ]
          },
          {
            typ: 'link',
            t: 'Kupiłeś auto? Lista formalności krok po kroku',
            o: 'Podatek, rejestracja, OC i terminy – wszystko w jednym miejscu.',
            href: '/poradniki/kupilem-auto-co-dalej/'
          }
        ]
      },
      {
        id: 'jakie-auto',
        t: 'Jakie auto na pierwsze – praktyczne kryteria',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'popularny model – tańsze i łatwiej dostępne części, więcej warsztatów, łatwiejsza późniejsza sprzedaż,',
              'prosty, sprawdzony silnik bez skomplikowanego doładowania i drogiego osprzętu,',
              'umiarkowana moc – łatwiej się uczyć i taniej ubezpieczyć,',
              'benzyna lub benzyna z LPG przy jeździe głównie po mieście; diesel ma sens przy dużych przebiegach w trasie,',
              'kompletna historia serwisowa i przebieg, który da się sprawdzić,',
              'jeśli często jeździsz do Warszawy lub Krakowa – sprawdź normę Euro, żeby auto mogło wjechać do strefy czystego transportu.'
            ]
          },
          {
            typ: 'link',
            t: 'Asystent zakupu auta',
            o: 'Odpowiedz na kilka pytań i zobacz modele dopasowane do Twoich potrzeb.',
            href: '/asystent-zakupu/'
          }
        ]
      },
      {
        id: 'zakup',
        t: 'Zakup krok po kroku',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wybierz 2–3 modele', o: 'Porównaj ceny ogłoszeń, typowe usterki i cenę OC. Popularność modelu w Polsce sprawdzisz w atlasie aut.' },
              { t: 'Sprawdź auto przed oględzinami', o: 'VIN, historia w CEPiK i raport historii pojazdu – to eliminuje większość „okazji”.' },
              { t: 'Obejrzyj auto i jedź na jazdę próbną', o: 'Weź ze sobą listę kontrolną albo kogoś, kto zna się na autach.' },
              { t: 'Negocjuj na podstawie faktów', o: 'Usterki wycenione przez mechanika to najlepszy argument do obniżenia ceny.' },
              { t: 'Spisz umowę i dopilnuj terminów', o: '14 dni na PCC-3 i 30 dni na rejestrację liczą się od daty na umowie.' }
            ]
          },
          {
            typ: 'link',
            t: 'Lista kontrolna oględzin',
            o: 'Dokumenty, nadwozie, wnętrze i silnik – punkt po punkcie.',
            href: '/poradniki/ogledziny-uzywanego-auta-lista/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile pieniędzy przygotować na pierwsze auto?', a: 'Oprócz ceny auta zostaw ok. 15–20% na podatek PCC (2%), rejestrację, OC i pierwszy serwis. Przy młodym kierowcy samo OC to często ok. 1500 zł rocznie.' },
      { q: 'Jakie auto jest najlepsze na początek?', a: 'Popularny, prosty model z umiarkowaną mocą i udokumentowaną historią. Takie auto jest tańsze w naprawach, ubezpieczeniu i łatwiej je potem sprzedać.' },
      { q: 'Czy przy pierwszym aucie trzeba płacić podatek?', a: 'Przy zakupie od osoby prywatnej płacisz 2% PCC od wartości rynkowej auta w ciągu 14 dni. Przy zakupie na fakturę od firmy zwykle nie.' },
      { q: 'Czy lepiej kupić pierwsze auto od osoby prywatnej czy z komisu?', a: 'Od osoby prywatnej często taniej i łatwiej poznać historię. Komis lub dealer daje więcej ochrony prawnej przy wadach, ale zwykle za wyższą cenę. W obu przypadkach sprawdź auto przed zakupem.' }
    ],
    powiazane: ['kupilem-auto-co-dalej', 'oc-dla-mlodego-kierowcy', 'ogledziny-uzywanego-auta-lista'],
    zrodla: [Z.pcc, Z.rejestracja, Z.cukRaport, Z.historia]
  },

  // ───────────── Kredyt, leasing, wynajem ─────────────
  {
    slug: 'kredyt-leasing-czy-wynajem-auta',
    kategoria: 'kupno',
    ikona: 'kredyt',
    tytul: 'Kredyt, leasing konsumencki czy wynajem długoterminowy – jak sfinansować auto',
    krotko: 'Kredyt, leasing czy wynajem',
    opis: 'Trzy popularne sposoby na auto bez płacenia całej kwoty od razu. Zobacz, czym się różnią, kto jest właścicielem auta, co wchodzi w ratę i na co uważać w umowie.',
    liczby: [
      { w: 'RRSO', o: 'najważniejsza liczba przy porównaniu kredytów' },
      { w: '14 dni', o: 'na odstąpienie od umowy kredytu konsumenckiego' },
      { w: '3 modele', o: 'kredyt, leasing konsumencki, wynajem' }
    ],
    sekcje: [
      {
        id: 'porownanie',
        t: 'Trzy sposoby w skrócie',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Kredyt samochodowy lub gotówkowy', o: 'Auto jest Twoje od początku (przy kredycie samochodowym bank często jest współwłaścicielem lub ma zastaw do spłaty). Sam płacisz OC, AC, serwis i opony. Po spłacie nie masz żadnych zobowiązań.' },
              { t: 'Leasing konsumencki', o: 'Właścicielem auta jest firma leasingowa, a Ty płacisz raty za korzystanie z niego. Na koniec możesz wykupić auto za ustaloną kwotę, oddać je albo zamienić na nowe. Zwykle niższa rata niż w kredycie, ale z wykupem na końcu.' },
              { t: 'Wynajem długoterminowy (abonament)', o: 'Płacisz stałą miesięczną opłatę, w której zwykle są OC, AC, serwis, a często też opony. Po 2–4 latach oddajesz auto. Obowiązuje limit kilometrów, a za przekroczenie i uszkodzenia płacisz dodatkowo.' }
            ]
          }
        ]
      },
      {
        id: 'co-wybrac',
        t: 'Co wybrać w Twojej sytuacji',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'chcesz mieć auto na lata i sam decydować o serwisie – zwykle kredyt,',
              'chcesz niższą ratę i nowsze auto co kilka lat – leasing konsumencki,',
              'chcesz znać dokładny miesięczny koszt i nie zajmować się ubezpieczeniem ani serwisem – wynajem długoterminowy,',
              'jeździsz bardzo dużo (np. ponad 30 000 km rocznie) – uważaj na limity kilometrów w leasingu i wynajmie,',
              'kupujesz tanie, kilkunastoletnie auto – oferty leasingu i wynajmu zwykle Cię nie obejmą; zostaje kredyt gotówkowy lub oszczędności.'
            ]
          }
        ]
      },
      {
        id: 'na-co-uwazac',
        t: 'Na co uważać w umowie',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Porównuj RRSO, nie samą ratę', o: 'Rzeczywista roczna stopa oprocentowania zawiera odsetki, prowizje i obowiązkowe ubezpieczenia. Niska rata przy długim okresie i dużym wykupie może oznaczać wysoki łączny koszt.' },
              { t: 'Policz całkowity koszt', o: 'Dodaj wpłatę własną, wszystkie raty, wykup (w leasingu) i koszty, które ponosisz sam: OC, AC, serwis, opony.' },
              { t: 'Sprawdź obowiązkowe AC', o: 'Przy kredycie samochodowym i leasingu AC jest zwykle wymagane – często w konkretnym zakresie. Zapytaj, czy możesz kupić je sam, czy musisz u wskazanego ubezpieczyciela.' },
              { t: 'Limity i zwrot auta', o: 'W leasingu i wynajmie przeczytaj zasady rozliczenia przy zwrocie: limit kilometrów, dopuszczalne zużycie, koszt przedterminowego zakończenia umowy.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Od umowy kredytu konsumenckiego możesz odstąpić w ciągu 14 dni bez podawania przyczyny. Przy leasingu i wynajmie zasady wynikają głównie z umowy, więc czytaj ją szczególnie uważnie przed podpisaniem.'
          },
          {
            typ: 'link',
            t: 'Porównaj ceny AC',
            o: 'Leasing lub kredyt wymagają AC? Sprawdź, ile kosztuje u różnych ubezpieczycieli.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Co jest tańsze: kredyt czy leasing konsumencki?', a: 'To zależy od oferty. Leasing ma zwykle niższą ratę, ale trzeba doliczyć wykup. Porównaj całkowity koszt: wpłatę, wszystkie raty, wykup i koszty, które ponosisz sam.' },
      { q: 'Kto jest właścicielem auta w leasingu konsumenckim?', a: 'Firma leasingowa – do momentu wykupu. Ty jesteś użytkownikiem auta.' },
      { q: 'Co zawiera rata wynajmu długoterminowego?', a: 'Zwykle korzystanie z auta, OC, AC, serwis, a często też opony i assistance. Szczegóły zależą od umowy – sprawdź też limit kilometrów.' },
      { q: 'Czy mogę zrezygnować z kredytu na auto?', a: 'Od umowy kredytu konsumenckiego możesz odstąpić w ciągu 14 dni od jej zawarcia, bez podawania przyczyny.' }
    ],
    powiazane: ['czy-warto-miec-ac', 'pierwsze-auto-jak-wybrac', 'umowa-kupna-sprzedazy-samochodu'],
    zrodla: [Z.kredytKonsumencki, Z.uokik]
  },

  // ───────────── Paliwo ─────────────
  {
    slug: 'benzyna-diesel-lpg-czy-hybryda',
    kategoria: 'eksploatacja',
    ikona: 'paliwo',
    tytul: 'Benzyna, diesel, LPG czy hybryda – co się opłaca przy Twoim przebiegu',
    krotko: 'Benzyna, diesel czy LPG',
    opis: `Porównanie kosztu przejechania 100 km benzyną, dieslem, LPG, hybrydą i elektrykiem przy aktualnych cenach paliw (${dataCen}). Zobacz, po ilu kilometrach zwraca się instalacja LPG i kiedy diesel nie ma sensu.`,
    liczby: [
      { w: zl(KOSZT.pb), o: 'benzyna – 100 km w przykładowym aucie' },
      { w: zl(KOSZT.lpg), o: 'LPG – te same 100 km' },
      { w: `${(ZWROT_LPG_KM / 1000).toFixed(0)} tys. km`, o: 'po tylu zwraca się instalacja LPG za 4500 zł' }
    ],
    sekcje: [
      {
        id: 'porownanie',
        t: 'Ile kosztuje 100 km – porównanie',
        bloki: [
          {
            typ: 'p',
            t: `Przykład dla kompaktowego auta przy cenach z ${dataCen}: benzyna ${zl(C.pb95)}/l, olej napędowy ${zl(C.on)}/l, LPG ${zl(C.lpg)}/l, prąd w domu ok. ${zl(C.prad)}/kWh. Średnie spalanie przyjęliśmy typowe dla jazdy mieszanej – Twoje auto może palić więcej lub mniej.`
          },
          {
            typ: 'liczby',
            elementy: [
              { w: zl(KOSZT.pb), o: `benzyna (${SPALANIE.pb} l/100 km)` },
              { w: zl(KOSZT.on), o: `diesel (${SPALANIE.on} l/100 km)` },
              { w: zl(KOSZT.lpg), o: `LPG (${SPALANIE.lpg} l/100 km)` },
              { w: zl(KOSZT.hybryda), o: `hybryda (${SPALANIE.hybryda} l/100 km)` },
              { w: zl(KOSZT.evDom), o: `elektryk, ładowanie w domu (${SPALANIE.ev} kWh)` }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'LPG pali się zwykle o ok. 15–20% więcej niż benzyny, dlatego w przykładzie przyjęliśmy 8,4 l zamiast 7 l. Mimo to koszt 100 km jest wyraźnie niższy.'
          },
          {
            typ: 'link',
            t: 'Policz koszt swojej trasy',
            o: 'Wpisz trasę i spalanie – pokażemy koszt paliwa i opłaty za autostrady.',
            href: '/koszt-trasy/'
          }
        ]
      },
      {
        id: 'lpg',
        t: 'LPG – kiedy instalacja się zwraca',
        bloki: [
          {
            typ: 'p',
            t: `Sekwencyjna instalacja LPG do silnika z wtryskiem pośrednim kosztuje w 2026 r. zwykle 3800–5500 zł, a do silnika z wtryskiem bezpośrednim – 5500–8000 zł i więcej. W naszym przykładzie oszczędzasz ok. ${zl(OSZCZ_LPG)} na każdych 100 km, więc instalacja za 4500 zł zwraca się po ok. ${zl0(ZWROT_LPG_KM).replace(' zł', '')} km.`
          },
          {
            typ: 'lista',
            elementy: [
              'doliczaj droższy przegląd – auto z LPG płaci za badanie techniczne ok. 162 zł zamiast 99 zł,',
              'instalacja wymaga przeglądu co 10–15 tys. km albo raz w roku (zwykle 150–250 zł),',
              'zbiornik LPG trzeba wymienić lub ponownie zatwierdzić po 10 latach,',
              'nie każdy silnik dobrze znosi gaz – zapytaj mechanika o doświadczenia z Twoim modelem.'
            ]
          }
        ]
      },
      {
        id: 'diesel-hybryda',
        t: 'Diesel, hybryda czy elektryk',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'diesel opłaca się głównie przy dużych przebiegach w trasie; przy krótkich miejskich odcinkach filtr cząstek stałych (DPF) nie ma warunków do wypalania i może się zapchać,',
              'pełna hybryda najwięcej oszczędza w mieście, gdzie często jedzie na prądzie z odzyskiwania energii hamowania; w trasie różnica w spalaniu jest mniejsza,',
              'elektryk jest najtańszy w jeździe przy ładowaniu w domu, ale na szybkich ładowarkach koszt 100 km może być zbliżony do benzyny,',
              'starsze diesle mogą mieć problem z wjazdem do stref czystego transportu w Warszawie i Krakowie – sprawdź normę Euro.'
            ]
          },
          {
            typ: 'link',
            t: 'Auto elektryczne – ile kosztuje ładowanie',
            o: 'Ceny w domu i na publicznych ładowarkach, przykład kosztu 100 km.',
            href: '/poradniki/auto-elektryczne-ladowanie-koszty/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Co jest tańsze w jeździe: LPG czy diesel?', a: `Przy cenach z ${dataCen} w naszym przykładzie 100 km na LPG kosztuje ok. ${zl(KOSZT.lpg)}, a dieslem ok. ${zl(KOSZT.on)}. LPG zwykle wychodzi taniej, ale trzeba doliczyć koszt instalacji i jej serwisu.` },
      { q: 'Po ilu kilometrach zwraca się instalacja LPG?', a: `Przy instalacji za 4500 zł i cenach z ${dataCen} – po ok. ${zl0(ZWROT_LPG_KM).replace(' zł', '')} km. Przy droższej instalacji do silnika z wtryskiem bezpośrednim odpowiednio później.` },
      { q: 'Czy diesel opłaca się do jazdy po mieście?', a: 'Zwykle nie. Na krótkich odcinkach filtr DPF nie ma warunków do wypalania sadzy, co może prowadzić do kosztownych napraw.' },
      { q: 'Czy hybryda jest oszczędna w trasie?', a: 'Mniej niż w mieście. Najwięcej oszczędza w ruchu miejskim, gdzie często jedzie na prądzie. Na autostradzie spalanie zbliża się do zwykłego auta benzynowego.' }
    ],
    powiazane: ['auto-elektryczne-ladowanie-koszty', 'strefa-czystego-transportu', 'pierwsze-auto-jak-wybrac'],
    zrodla: [Z.lpg, Z.ladowanie]
  },

  // ───────────── Auto elektryczne ─────────────
  {
    slug: 'auto-elektryczne-ladowanie-koszty',
    kategoria: 'eksploatacja',
    ikona: 'elektryk',
    tytul: 'Auto elektryczne – ile kosztuje ładowanie w domu i na stacji',
    krotko: 'Ładowanie elektryka',
    opis: 'Ładowanie w domu kosztuje kilka razy mniej niż na szybkiej ładowarce przy autostradzie. Zobacz aktualne ceny za kWh, przykładowy koszt przejechania 100 km i co sprawdzić przed zakupem elektryka.',
    liczby: [
      { w: zl(KOSZT.evDom), o: `100 km przy ładowaniu w domu (${SPALANIE.ev} kWh)` },
      { w: '1,49–2,49 zł', o: 'za kWh na publicznych ładowarkach AC' },
      { w: '1,89–3,39 zł', o: 'za kWh na szybkich ładowarkach DC' }
    ],
    sekcje: [
      {
        id: 'w-domu',
        t: 'Ładowanie w domu – najtańsza opcja',
        bloki: [
          {
            typ: 'p',
            t: `Przy zwykłej taryfie domowej (G11) prąd razem z opłatami dystrybucyjnymi kosztuje ok. 1–1,20 zł za kWh. Auto, które zużywa ok. ${SPALANIE.ev} kWh na 100 km, przejedzie je za ok. ${zl(KOSZT.evDom)}. W taryfie dwustrefowej (G12) w nocy może być wyraźnie taniej. Z własną fotowoltaiką – jeszcze taniej.`
          },
          {
            typ: 'lista',
            elementy: [
              'zwykłe gniazdko wystarczy do powolnego ładowania (ok. 10–20 km zasięgu na godzinę), ale instalacja musi być sprawna i dobrze zabezpieczona,',
              'wallbox ładuje kilka razy szybciej i jest bezpieczniejszy przy codziennym używaniu – koszt zakupu i montażu to zwykle kilka tysięcy złotych,',
              'w bloku zapytaj zarządcę lub wspólnotę o możliwość montażu ładowarki w garażu.'
            ]
          }
        ]
      },
      {
        id: 'publiczne',
        t: 'Publiczne ładowarki – ceny w 2026 r.',
        bloki: [
          {
            typ: 'p',
            t: 'Na publicznych stacjach cena zależy od operatora i mocy ładowarki. Wolniejsze ładowarki prądu przemiennego (AC) kosztowały w 2026 r. ok. 1,49–2,49 zł za kWh, a szybkie ładowarki prądu stałego (DC) – ok. 1,89–3,39 zł za kWh. Część operatorów ma abonamenty, które obniżają cenę przy częstym ładowaniu.'
          },
          {
            typ: 'liczby',
            elementy: [
              { w: zl(KOSZT.evDom), o: '100 km – ładowanie w domu' },
              { w: zl(SPALANIE.ev * 1.69), o: '100 km – ładowarka AC (1,69 zł/kWh)' },
              { w: zl(KOSZT.evDc), o: '100 km – szybka ładowarka DC (2,49 zł/kWh)' }
            ]
          },
          {
            typ: 'link',
            t: 'Mapa ładowarek w Polsce',
            o: 'Znajdź stacje ładowania na swojej trasie.',
            href: '/ladowarki/'
          }
        ]
      },
      {
        id: 'zima-zasieg',
        t: 'Zasięg zimą i w trasie',
        bloki: [
          {
            typ: 'p',
            t: 'Zimą zużycie energii rośnie, bo prąd idzie też na ogrzewanie wnętrza i baterii. Zasięg może spaść nawet o kilkadziesiąt procent. Na autostradzie zużycie też jest wyższe niż w mieście, bo przy dużej prędkości rośnie opór powietrza – odwrotnie niż w aucie spalinowym.'
          },
          {
            typ: 'lista',
            elementy: [
              'jeśli auto ma pompę ciepła, zimowy spadek zasięgu jest zwykle mniejszy,',
              'nagrzewaj auto, gdy jest jeszcze podłączone do ładowarki – energia pójdzie z sieci, a nie z baterii,',
              'na szybkiej ładowarce ładuj zwykle do ok. 80% – dalej ładowanie mocno zwalnia,',
              'planuj trasę z zapasem i sprawdź, czy ładowarki po drodze działają.'
            ]
          }
        ]
      },
      {
        id: 'doplaty',
        t: 'Dopłaty i co sprawdzić przed zakupem',
        bloki: [
          {
            typ: 'p',
            t: 'Rządowy program dopłat NaszEauto wyczerpał budżet na początku 2026 r., a nowe wnioski przyjmowano już tylko warunkowo. Przed zakupem sprawdź na stronie NFOŚiGW, czy działa jakiś nowy nabór – zasady dopłat zmieniają się często.'
          },
          {
            typ: 'lista',
            elementy: [
              'czy masz gdzie ładować w domu lub w pracy – bez tego elektryk szybko traci przewagę kosztową,',
              'stan baterii w używanym aucie (raport z serwisu lub test pojemności),',
              'maksymalna moc ładowania DC – ważna przy dłuższych trasach,',
              'cena OC i AC – elektryki bywają droższe w ubezpieczeniu.'
            ]
          },
          {
            typ: 'link',
            t: 'Benzyna, diesel, LPG czy hybryda?',
            o: 'Porównanie kosztu 100 km dla różnych napędów przy aktualnych cenach.',
            href: '/poradniki/benzyna-diesel-lpg-czy-hybryda/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile kosztuje naładowanie auta elektrycznego w domu?', a: `Przy cenie ok. ${zl(C.prad)} za kWh przejechanie 100 km autem zużywającym ${SPALANIE.ev} kWh kosztuje ok. ${zl(KOSZT.evDom)}. W nocnej taryfie G12 może być taniej.` },
      { q: 'Ile kosztuje kWh na szybkiej ładowarce?', a: 'W 2026 r. szybkie ładowarki DC kosztowały zwykle ok. 1,89–3,39 zł za kWh, zależnie od operatora i abonamentu.' },
      { q: 'Czy zimą elektryk ma mniejszy zasięg?', a: 'Tak. Ogrzewanie wnętrza i baterii zużywa energię, więc zasięg może spaść nawet o kilkadziesiąt procent. Pompa ciepła i nagrzewanie auta przy ładowarce zmniejszają ten spadek.' },
      { q: 'Czy są dopłaty do aut elektrycznych?', a: 'Program NaszEauto wyczerpał budżet na początku 2026 r. Sprawdź na stronie NFOŚiGW, czy ruszył nowy nabór.' }
    ],
    powiazane: ['benzyna-diesel-lpg-czy-hybryda', 'strefa-czystego-transportu', 'zima-w-samochodzie'],
    zrodla: [Z.ladowanie, Z.naszeauto, Z.nfosigw]
  }
];

export const DODATKI_3: Record<string, DodatekSeo> = {
  'ogledziny-uzywanego-auta-lista': {
    seoTytul: 'Jak sprawdzić używane auto? Lista oględzin',
    seoOpis: 'Lista kontrolna oględzin używanego auta: dokumenty i VIN, lakier i rdza, wnętrze, silnik i jazda próbna. Co sprawdzić przed zakupem, żeby nie kupić problemu.',
    skrot: [
      'Zanim pojedziesz, sprawdź auto po VIN – w bazie CEPiK za darmo i w raporcie historii.',
      'Na miejscu przejdź 5 etapów: dokumenty, nadwozie, wnętrze, silnik i jazda próbna.',
      'Nie znasz się na mechanice? Diagnostyka w niezależnym warsztacie kosztuje mniej niż ukryta usterka.'
    ]
  },
  'jazda-probna-na-co-zwrocic-uwage': {
    seoTytul: 'Jazda próbna – na co zwrócić uwagę',
    seoOpis: 'Jak przeprowadzić jazdę próbną używanym autem: trasa w 6 krokach, czego słuchać w silniku, skrzyni i zawieszeniu oraz po jakich objawach lepiej zrezygnować z zakupu.',
    skrot: [
      'Jazda próbna powinna trwać co najmniej 20 minut – w mieście, na nierównościach i na szybszej trasie.',
      'Prowadź sam, ruszaj z zimnym silnikiem i wyłącz radio, żeby słyszeć auto.',
      'Świecące kontrolki, dym po rozgrzaniu i szarpiąca skrzynia to powody do rezygnacji.'
    ]
  },
  'auto-po-powodzi-jak-rozpoznac': {
    seoTytul: 'Auto po powodzi – jak rozpoznać zalane',
    seoOpis: 'Jak rozpoznać zalany samochód przed zakupem: 7 miejsc, w których woda zostawia ślady, jak sprawdzić historię po VIN i co zrobić, gdy sprzedawca zataił zalanie.',
    skrot: [
      'Zalane auto po wysuszeniu może jeździć dobrze, a usterki elektroniki wychodzą po miesiącach.',
      'Szukaj wilgoci pod wykładziną, zacieków na pasach, rdzy na szynach foteli i osadu w lampach.',
      'Zatajenie zalania daje prawo do rękojmi nawet wtedy, gdy umowa ją wyłącza.'
    ]
  },
  'pierwsze-auto-jak-wybrac': {
    seoTytul: 'Pierwsze auto – jak wybrać i ile wydać',
    seoOpis: 'Jak kupić pierwsze auto: ile pieniędzy przygotować oprócz ceny (PCC 2%, rejestracja, OC, serwis), jakie auto wybrać na początek i jak przejść przez zakup krok po kroku.',
    skrot: [
      'Oprócz ceny auta zostaw ok. 15–20% na podatek, rejestrację, OC i pierwszy serwis.',
      'Na początek najlepszy jest popularny, prosty model z umiarkowaną mocą i znaną historią.',
      'Od daty umowy masz 14 dni na PCC-3 i 30 dni na rejestrację.'
    ]
  },
  'kredyt-leasing-czy-wynajem-auta': {
    seoTytul: 'Kredyt, leasing czy wynajem auta?',
    seoOpis: 'Kredyt samochodowy, leasing konsumencki czy wynajem długoterminowy: kto jest właścicielem auta, co zawiera rata, jak porównać RRSO i na co uważać w umowie.',
    skrot: [
      'Kredyt daje auto na własność, leasing – niższą ratę z wykupem, a wynajem – stały koszt bez zajmowania się serwisem.',
      'Porównuj RRSO i całkowity koszt, a nie samą wysokość raty.',
      'Od umowy kredytu konsumenckiego możesz odstąpić w ciągu 14 dni.'
    ]
  },
  'benzyna-diesel-lpg-czy-hybryda': {
    seoTytul: 'Benzyna, diesel, LPG czy hybryda? Koszty',
    seoOpis: 'Ile kosztuje 100 km benzyną, dieslem, LPG, hybrydą i elektrykiem przy aktualnych cenach paliw. Po ilu kilometrach zwraca się LPG i kiedy diesel się nie opłaca.',
    skrot: [
      `Przy cenach z ${dataCen} 100 km na LPG kosztuje ok. ${zl(KOSZT.lpg)}, a benzyną ok. ${zl(KOSZT.pb)}.`,
      `Instalacja LPG za 4500 zł zwraca się w przykładzie po ok. ${zl0(ZWROT_LPG_KM).replace(' zł', '')} km.`,
      'Diesel opłaca się przy dużych przebiegach w trasie, a hybryda – głównie w mieście.'
    ]
  },
  'auto-elektryczne-ladowanie-koszty': {
    seoTytul: 'Ile kosztuje ładowanie elektryka w 2026?',
    seoOpis: 'Ile kosztuje ładowanie auta elektrycznego w domu i na stacji: ceny za kWh na ładowarkach AC i DC, koszt 100 km, zasięg zimą i dopłaty. Aktualne dane na 2026 r.',
    skrot: [
      `W domu 100 km kosztuje ok. ${zl(KOSZT.evDom)}, na szybkiej ładowarce DC nawet ponad dwa razy więcej.`,
      'Publiczne ładowarki AC kosztowały w 2026 r. ok. 1,49–2,49 zł/kWh, a DC – 1,89–3,39 zł/kWh.',
      'Zimą zasięg spada, a program NaszEauto wyczerpał budżet na początku 2026 r.'
    ]
  }
};
