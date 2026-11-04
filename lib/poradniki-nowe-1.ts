// Nowe poradniki – część 1: ubezpieczenie auta (OC, zniżki, AC, szkoda całkowita).
// Daty publikacji są w data/harmonogram-poradnikow.json. Teksty własne, liczby sprawdzone w źródłach podanych przy każdym poradniku (stan: listopad 2026).
import type { Poradnik } from '@/lib/poradniki';
import type { DodatekSeo } from '@/lib/poradniki-nowe';

export const ZR = {
  cukRaport: { n: 'CUK Ubezpieczenia – raport cen OC i AC (II i III kwartał 2026)', url: 'https://cuk.pl/aktualnosci/raport-cen-oc-ac' },
  ustawaOC: { n: 'Ustawa o ubezpieczeniach obowiązkowych, UFG i PBUK (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20031241152' },
  wypowiedzenie: { n: 'CUK – kiedy można wypowiedzieć OC (art. 28, 28a, 31)', url: 'https://cuk.pl/porady/kiedy-mozna-wypowiedziec-oc' },
  ufg: { n: 'Ubezpieczeniowy Fundusz Gwarancyjny – sprawdzenie polisy i historii ubezpieczenia', url: 'https://www.ufg.pl/' },
  zaswiadczenie: { n: 'LINK4 – zaświadczenie o przebiegu ubezpieczenia: kiedy i jak je zdobyć', url: 'https://www.link4.pl/blog/zaswiadczenie-o-przebiegu-ubezpieczenia-kiedy-i-jak-je-zdobyc-wyjasniamy' },
  wspolwlasnosc: { n: 'LINK4 – współwłasność pojazdu a zniżki OC', url: 'https://www.link4.pl/blog/wspolwlasnosc-pojazdu-znizki-oc-czy-wspolwlasciciel-nabywa-znizki' },
  szkodaCalkowita: { n: 'Mubi – szkoda całkowita z OC i AC: wyliczenie, wrak, odwołanie', url: 'https://mubi.pl/poradniki/szkoda-calkowita-samochodu-z-oc-ac/' },
  rf: { n: 'Rzecznik Finansowy – pomoc w sporach z ubezpieczycielem', url: 'https://rf.gov.pl/' },
  kc: { n: 'Kodeks cywilny – art. 363, 815, 816 (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093' }
};

export const NOWE_1: Poradnik[] = [
  // ───────────── 1. Ile kosztuje OC ─────────────
  {
    slug: 'ile-kosztuje-oc',
    kategoria: 'ubezpieczenie',
    ikona: 'cenaOc',
    tytul: 'Ile kosztuje OC samochodu i od czego zależy cena',
    krotko: 'Ile kosztuje OC',
    opis: 'Średnia cena OC w Polsce to ok. 660 zł rocznie, ale ta sama polisa potrafi kosztować kilka razy więcej albo mniej. Sprawdź, co podnosi składkę, co ją obniża i kiedy najlepiej porównać oferty.',
    liczby: [
      { w: '657 zł', o: 'średnie OC w III kw. 2026 (CUK)' },
      { w: '1504 zł', o: 'średnio płacą kierowcy 18–24 lata' },
      { w: '551 zł', o: 'średnio płacą kierowcy 55–64 lata' }
    ],
    sekcje: [
      {
        id: 'srednia-cena',
        t: 'Średnia cena OC w 2026 roku',
        bloki: [
          {
            typ: 'p',
            t: 'Według raportu CUK Ubezpieczenia średnia składka za samo OC wyniosła 667 zł w II kwartale 2026 r. i 657 zł w III kwartale. To wartość dla całego kraju – Twoja cena może być dużo niższa albo kilka razy wyższa, bo ubezpieczyciel liczy ryzyko osobno dla każdego kierowcy i każdego auta.'
          },
          {
            typ: 'p',
            t: 'Najlepiej widać to po wieku. W tym samym raporcie kierowcy w wieku 18–24 lata płacili za OC średnio 1504 zł, a kierowcy 55–64 lata – 551 zł. Różnica jest prawie trzykrotna, chociaż obie grupy kupują dokładnie ten sam, ustawowy zakres ochrony.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Zakres OC jest taki sam u każdego ubezpieczyciela – określa go ustawa. Różnią się cena, obsługa szkód i dodatki (np. assistance). Dlatego przy samym OC cena jest najważniejszym kryterium wyboru.'
          }
        ]
      },
      {
        id: 'od-czego-zalezy',
        t: 'Od czego zależy cena OC',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wiek i staż kierowcy', o: 'Młodzi kierowcy i osoby ze świeżym prawem jazdy statystycznie częściej powodują szkody, więc płacą najwięcej. Składka zwykle spada wyraźnie po 25–26 roku życia.' },
              { t: 'Historia szkód i zniżki', o: 'Każdy rok bez szkody z Twojej winy to wyższa zniżka. Jedna szkoda potrafi cofnąć Cię o kilka poziomów i podnieść cenę na kolejne lata.' },
              { t: 'Miejsce zamieszkania', o: 'W dużych miastach i regionach z dużym ruchem jest więcej kolizji, więc składki są wyższe. W raporcie CUK różnice między miastami sięgały kilkuset złotych.' },
              { t: 'Auto: pojemność, moc, marka', o: 'Mocniejsze i droższe w naprawie auta oznaczają wyższe OC. Liczy się też wiek auta i to, jak często dany model bierze udział w szkodach.' },
              { t: 'Sposób użytkowania', o: 'Przebieg roczny, jazda za granicą, użytkowanie auta przez młodego kierowcę, garaż czy parking na ulicy – wszystko to trafia do kalkulacji.' }
            ]
          }
        ]
      },
      {
        id: 'jak-placic-mniej',
        t: 'Jak płacić mniej za OC – sprawdzone sposoby',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'porównuj oferty co roku, 2–3 tygodnie przed końcem polisy – automatyczne przedłużenie często jest droższe niż oferta dla nowego klienta,',
              'płać jednorazowo, jeśli możesz – raty zwykle podnoszą łączny koszt,',
              'podawaj prawdziwe dane o kierowcach i przebiegu – zaniżenie ryzyka może skończyć się dopłatą składki,',
              'sprawdź swoją historię w UFG i zniżki u nowego ubezpieczyciela – czasem system ich nie „widzi” i trzeba dosłać zaświadczenie,',
              'rozważ pakiet OC + AC tylko wtedy, gdy AC jest Ci naprawdę potrzebne – sam pakiet nie zawsze jest tańszy,',
              'przy kupnie auta sprawdź cenę OC dla danego modelu, zanim podpiszesz umowę – dwa podobne auta potrafią różnić się składką o kilkaset złotych.'
            ]
          },
          {
            typ: 'link',
            t: 'Porównaj ceny OC i AC w kalkulatorze',
            o: 'Oferty wielu ubezpieczycieli w kilka minut – przygotuj dowód rejestracyjny i PESEL.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      },
      {
        id: 'automatyczne-przedluzenie',
        t: 'OC przedłuża się samo – kiedy to się opłaca, a kiedy nie',
        bloki: [
          {
            typ: 'p',
            t: 'Jeśli nie wypowiesz polisy najpóźniej dzień przed końcem okresu ubezpieczenia, OC odnowi się automatycznie na kolejne 12 miesięcy. To wygodne, ale ubezpieczyciel może przy tym zmienić cenę. Wielu kierowców płaci więcej tylko dlatego, że nie sprawdziło ofert konkurencji.'
          },
          {
            typ: 'p',
            t: 'Bezpieczna kolejność jest taka: porównaj ceny, kup nowe OC od dnia po wygaśnięciu starego, a potem wyślij wypowiedzenie dotychczasowej polisy. Jeśli zapomnisz o wypowiedzeniu i będziesz mieć dwie polisy, możesz wypowiedzieć tę, która przedłużyła się automatycznie.'
          },
          {
            typ: 'link',
            t: 'Wypowiedzenie OC – wzór do wydruku',
            o: 'Wypełnij pola w przeglądarce, wydrukuj i wyślij do ubezpieczyciela.',
            href: '/poradniki/wypowiedzenie-oc/'
          }
        ]
      },
      {
        id: 'kara-za-brak',
        t: 'Brak OC kosztuje wielokrotnie więcej niż polisa',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '1920 zł', o: 'za 1–3 dni bez OC (auto osobowe, 2026)' },
              { w: '4810 zł', o: 'za 4–14 dni przerwy' },
              { w: '9610 zł', o: 'za ponad 14 dni bez OC' }
            ]
          },
          {
            typ: 'p',
            t: 'Kary nalicza Ubezpieczeniowy Fundusz Gwarancyjny i zależą od wysokości płacy minimalnej, więc rosną co roku. Jeśli bez OC spowodujesz wypadek, UFG wypłaci odszkodowanie poszkodowanym, ale potem zażąda zwrotu całej kwoty od Ciebie.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile średnio kosztuje OC w 2026 roku?', a: 'Według raportu CUK Ubezpieczenia średnia składka OC wyniosła 667 zł w II kwartale i 657 zł w III kwartale 2026 r. Młodzi kierowcy (18–24 lata) płacili średnio ok. 1500 zł.' },
      { q: 'Dlaczego moje OC podrożało, chociaż nie miałem szkody?', a: 'Ubezpieczyciele co roku zmieniają taryfy – liczą m.in. rosnące koszty napraw i odszkodowań. Przy automatycznym przedłużeniu dostajesz nową cenę bez porównania z konkurencją, dlatego warto sprawdzić oferty przed końcem polisy.' },
      { q: 'Czy OC jest tańsze w ratach?', a: 'Zwykle nie. Płatność w ratach najczęściej podnosi łączny koszt polisy. Jeśli możesz, zapłać całą składkę od razu.' },
      { q: 'Czy zakres OC różni się między ubezpieczycielami?', a: 'Nie. Zakres i minimalne sumy gwarancyjne OC określa ustawa, więc ochrona jest taka sama. Różnią się cena, obsługa szkód i dodatkowe usługi.' }
    ],
    powiazane: ['znizki-oc-jak-zachowac', 'oc-dla-mlodego-kierowcy', 'wypowiedzenie-oc'],
    zrodla: [ZR.cukRaport, ZR.ustawaOC, ZR.wypowiedzenie, ZR.ufg]
  },

  // ───────────── 2. OC dla młodego kierowcy ─────────────
  {
    slug: 'oc-dla-mlodego-kierowcy',
    kategoria: 'ubezpieczenie',
    ikona: 'mlody',
    tytul: 'OC dla młodego kierowcy – jak legalnie płacić mniej',
    krotko: 'OC dla młodego kierowcy',
    opis: 'Kierowcy w wieku 18–24 lata płacą za OC średnio ok. 1500 zł – prawie trzy razy więcej niż starsi. Zobacz, co naprawdę obniża składkę, jak działa współwłasność z rodzicem i czego nie robić, żeby nie stracić na szkodzie.',
    liczby: [
      { w: '1504 zł', o: 'średnie OC kierowców 18–24 lata (III kw. 2026)' },
      { w: '×2,7', o: 'tyle razy więcej niż płacą kierowcy 55–64 lata' },
      { w: '0 zł', o: 'kosztuje sprawdzenie własnej historii w UFG' }
    ],
    sekcje: [
      {
        id: 'dlaczego-drozej',
        t: 'Dlaczego młody kierowca płaci tak dużo',
        bloki: [
          {
            typ: 'p',
            t: 'Ubezpieczyciel nie zna Cię jako kierowcy, więc ocenia ryzyko na podstawie statystyki. A ta jest bezlitosna: osoby tuż po kursie częściej powodują kolizje, a do tego nie mają jeszcze żadnej historii ubezpieczenia, czyli zniżek. W raporcie CUK Ubezpieczenia za III kwartał 2026 r. kierowcy 18–24 lata płacili za OC średnio 1504 zł, a kierowcy 55–64 lata – 551 zł.'
          },
          {
            typ: 'p',
            t: 'Dobra wiadomość: składka spada z każdym rokiem jazdy bez szkody. Najważniejsze jest więc to, żeby jak najszybciej zacząć budować własną historię – i żeby nie stracić jej przez pierwszą stłuczkę.'
          }
        ]
      },
      {
        id: 'sposoby',
        t: 'Sposoby na tańsze OC dla młodego kierowcy',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wybierz rozsądne auto', o: 'Mały silnik, umiarkowana moc i popularny model to zwykle niższa składka. Zanim kupisz auto, sprawdź jego OC w kalkulatorze – różnice między podobnymi autami bywają duże.' },
              { t: 'Porównaj wiele ofert', o: 'Każdy ubezpieczyciel inaczej wycenia młodych kierowców. Dla jednego jesteś „wysokim ryzykiem”, dla innego już nie tak bardzo. Kalkulator pokaże różnice w kilka minut.' },
              { t: 'Rozważ współwłasność z rodzicem', o: 'Współwłaściciel jest dla ubezpieczyciela takim samym właścicielem jak główny właściciel – też buduje własną historię ubezpieczenia. Szczegóły i ryzyka opisujemy niżej.' },
              { t: 'Zapytaj o zniżki za bezpieczną jazdę', o: 'Niektóre firmy oferują polisy z aplikacją lub urządzeniem mierzącym styl jazdy. Spokojna jazda może obniżyć składkę w kolejnym roku.' },
              { t: 'Nie miej szkód z własnej winy', o: 'Brzmi oczywiście, ale pierwsza szkoda na starcie kosztuje najdrożej, bo zabiera zniżki, których jeszcze prawie nie masz. Przy drobnej stłuczce zapytaj, ile wyniesie podwyżka – czasem taniej jest zapłacić z własnej kieszeni.' }
            ]
          },
          {
            typ: 'link',
            t: 'Sprawdź ceny OC dla swojego auta',
            o: 'Porównanie ofert wielu ubezpieczycieli – bez dzwonienia do agentów.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      },
      {
        id: 'wspolwlasnosc',
        t: 'Współwłasność auta z rodzicem – jak to działa',
        bloki: [
          {
            typ: 'p',
            t: 'Najczęściej rodzic przekazuje dziecku część auta w darowiźnie albo oboje kupują auto razem i wpisują się do dowodu rejestracyjnego. Udział nie ma znaczenia – współwłaściciel z 10% udziałów buduje historię ubezpieczenia tak samo jak właściciel ze 100%. Po kilku latach młody kierowca może kupić własne auto i mieć już zniżki.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Ryzyko jest wspólne. Jeśli młody kierowca spowoduje szkodę, zniżki tracą wszyscy współwłaściciele – także rodzic. Nie ukrywaj też, kto naprawdę jeździ autem. Ubezpieczyciel pyta o to w kalkulacji, a podanie nieprawdy może skończyć się żądaniem dopłaty składki.'
          },
          {
            typ: 'p',
            t: 'Darowizna części auta w najbliższej rodzinie jest zwolniona z podatku, jeśli zgłosisz ją w urzędzie skarbowym w terminie. Po zmianie właściciela trzeba też zaktualizować dane w wydziale komunikacji.'
          },
          {
            typ: 'link',
            t: 'Darowizna samochodu – wzór umowy',
            o: 'Wypełnij w przeglądarce i wydrukuj. Opisujemy też zwolnienie z podatku.',
            href: '/poradniki/darowizna-samochodu/'
          }
        ]
      },
      {
        id: 'czego-unikac',
        t: 'Czego nie robić',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'nie zawieraj polisy wyłącznie na rodzica, jeśli to Ty będziesz codziennie jeździć – wiele firm pyta o najmłodszego kierowcę i jego staż,',
              'nie kupuj OC „na szybko” od sprzedawcy auta bez porównania – polisa przejęta przy zakupie kończy się bez automatycznego odnowienia, więc i tak trzeba będzie kupić nową,',
              'nie zostawiaj auta bez OC nawet na kilka dni – kara UFG za 1–3 dni to 1920 zł,',
              'nie zakładaj, że najtańsza oferta jest najgorsza – zakres OC jest wszędzie taki sam.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Od jakiego wieku OC jest wyraźnie tańsze?', a: 'Zwykle po 25–26 roku życia i po kilku latach jazdy bez szkody. Najwięcej daje jednak sama historia bezszkodowej jazdy, a nie tylko wiek.' },
      { q: 'Czy współwłaściciel auta ma swoje zniżki?', a: 'Tak. Współwłaściciel buduje historię ubezpieczenia tak samo jak główny właściciel, niezależnie od wielkości udziału. Jeśli jednak ktokolwiek spowoduje szkodę, zniżki tracą wszyscy współwłaściciele.' },
      { q: 'Czy mogę ubezpieczyć auto na rodzica, a jeździć sam?', a: 'Możesz jeździć autem rodzica, ale przy zawieraniu polisy trzeba zgodnie z prawdą podać, kto będzie z niego korzystał. Zatajenie młodego kierowcy może skończyć się dopłatą składki.' },
      { q: 'Jak sprawdzić swoją historię ubezpieczenia?', a: 'Bezpłatnie na stronie Ubezpieczeniowego Funduszu Gwarancyjnego (UFG) – po założeniu konta wygenerujesz raport z przebiegu ubezpieczenia OC i AC.' }
    ],
    powiazane: ['ile-kosztuje-oc', 'znizki-oc-jak-zachowac', 'pierwsze-auto-jak-wybrac'],
    zrodla: [ZR.cukRaport, ZR.wspolwlasnosc, ZR.ufg, ZR.kc]
  },

  // ───────────── 3. Zniżki OC ─────────────
  {
    slug: 'znizki-oc-jak-zachowac',
    kategoria: 'ubezpieczenie',
    ikona: 'znizka',
    tytul: 'Zniżki w OC – jak je zachować przy zmianie auta i ubezpieczyciela',
    krotko: 'Zniżki w OC',
    opis: 'Zniżki za bezszkodową jazdę należą do Ciebie, a nie do auta. Zobacz, jak przenieść je do nowego ubezpieczyciela, skąd wziąć zaświadczenie o przebiegu ubezpieczenia i ile kosztuje jedna szkoda.',
    liczby: [
      { w: 'od 2004', o: 'tyle wstecz sięga historia OC w bazie UFG' },
      { w: '0 zł', o: 'raport historii ubezpieczenia w UFG' },
      { w: '1 szkoda', o: 'potrafi zabrać kilka lat zniżek' }
    ],
    sekcje: [
      {
        id: 'jak-dzialaja',
        t: 'Jak działają zniżki w OC',
        bloki: [
          {
            typ: 'p',
            t: 'Każdy rok ubezpieczenia bez szkody z Twojej winy przesuwa Cię w górę tabeli zniżek. Każdy ubezpieczyciel ma własną tabelę – w jednej firmie maksymalny poziom osiągniesz szybciej, w innej wolniej. Wspólne jest jedno: zniżka jest przypisana do właściciela (i współwłaściciela) auta, a nie do samochodu.'
          },
          {
            typ: 'p',
            t: 'Historia Twoich polis i szkód trafia do bazy Ubezpieczeniowego Funduszu Gwarancyjnego. Gdy kupujesz OC w nowej firmie, ubezpieczyciel zwykle sprawdza ją automatycznie. Jeśli coś się nie zgadza, możesz pokazać zaświadczenie o przebiegu ubezpieczenia.'
          }
        ]
      },
      {
        id: 'zmiana-auta',
        t: 'Zmiana auta – zniżki idą z Tobą',
        bloki: [
          {
            typ: 'p',
            t: 'Sprzedajesz stare auto i kupujesz nowe? Zniżki nie przepadają. Przy zakupie OC na nowe auto podajesz swój PESEL, a ubezpieczyciel uwzględnia Twoją historię. Polisa sprzedającego przechodzi na Ciebie razem z autem, ale liczona jest na jego zniżkach – możesz ją wypowiedzieć i kupić własną, często tańszą.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'Masz dwa auta? Historia buduje się osobno dla każdej polisy. Najwyższą zniżkę możesz zwykle wykorzystać przy jednym aucie – przy drugim warto zapytać, czy ubezpieczyciel uwzględni historię z pierwszego.'
          },
          {
            typ: 'link',
            t: 'Kupiłeś auto? OC po zakupie krok po kroku',
            o: 'Polisa sprzedającego, terminy i kiedy kupić własne OC.',
            href: '/poradniki/kupilem-auto-co-dalej/'
          }
        ]
      },
      {
        id: 'zaswiadczenie',
        t: 'Zaświadczenie o przebiegu ubezpieczenia – skąd je wziąć',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Online w UFG', o: 'Na stronie ufg.pl załóż konto i wygeneruj raport „Przebieg ubezpieczenia OC i AC”. Możesz wybrać ostatnie 5 lat albo całą historię – baza sięga 2004 r. dla OC i 2006 r. dla AC.' },
              { t: 'U dotychczasowego ubezpieczyciela', o: 'Złóż wniosek przez formularz na stronie, e-mailem albo w oddziale. Zaświadczenie dostaniesz za okres, w którym ta firma Cię ubezpieczała.' },
              { t: 'Przekaż nowemu ubezpieczycielowi', o: 'Dołącz zaświadczenie przy zakupie polisy albo prześlij je po zakupie z prośbą o przeliczenie składki.' }
            ]
          },
          {
            typ: 'p',
            t: 'O zaświadczenie mogą poprosić właściciel i współwłaściciele auta. Kierowca wpisany jedynie jako użytkownik zwykle nie buduje własnej historii.'
          }
        ]
      },
      {
        id: 'szkoda',
        t: 'Ile kosztuje szkoda i kiedy lepiej zapłacić samemu',
        bloki: [
          {
            typ: 'p',
            t: 'Po szkodzie z Twojej winy ubezpieczyciel cofa Cię o kilka poziomów w tabeli zniżek. Skutek odczujesz nie tylko w najbliższym roku – odbudowa zniżki trwa kilka lat. Przy drobnej stłuczce warto policzyć, co się bardziej opłaca.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zapytaj o kosztorys naprawy', o: 'Ile kosztuje naprawa auta poszkodowanego (albo Twojego, jeśli chodzi o AC)?' },
              { t: 'Zapytaj o nową składkę', o: 'Poproś ubezpieczyciela lub agenta o wyliczenie, ile zapłacisz za OC w kolejnych latach po szkodzie.' },
              { t: 'Porównaj sumy', o: 'Jeśli dodatkowe składki przez kilka lat będą wyższe niż koszt naprawy, czasem lepiej dogadać się z poszkodowanym i zapłacić samemu. Zrób to na piśmie.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Prywatne rozliczenie ma sens tylko przy małej, jasnej szkodzie, bez rannych. Spisz oświadczenie, a poszkodowany powinien potwierdzić na piśmie, że otrzymał pieniądze i nie ma dalszych roszczeń.'
          }
        ]
      },
      {
        id: 'porownaj',
        t: 'Zniżki masz – teraz porównaj ceny',
        bloki: [
          {
            typ: 'p',
            t: 'Ta sama zniżka u różnych ubezpieczycieli oznacza różne ceny, bo każdy liczy składkę od innej stawki bazowej. Kierowca z wieloletnią historią bez szkód często ma największe pole do oszczędności, bo firmy walczą właśnie o takich klientów.'
          },
          {
            typ: 'link',
            t: 'Porównaj ceny OC i AC',
            o: 'Kalkulator uwzględni Twoje zniżki po podaniu PESEL.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy zniżki przechodzą na nowe auto?', a: 'Tak. Zniżki są przypisane do właściciela, a nie do samochodu. Przy zakupie OC na nowe auto ubezpieczyciel uwzględnia Twoją historię z bazy UFG.' },
      { q: 'Czy tracę zniżki po zmianie ubezpieczyciela?', a: 'Nie. Nowa firma widzi Twoją historię w bazie UFG. Jeśli nie uwzględni zniżek, prześlij zaświadczenie o przebiegu ubezpieczenia i poproś o przeliczenie składki.' },
      { q: 'Jak sprawdzić swoje zniżki?', a: 'Najprościej wygenerować bezpłatny raport przebiegu ubezpieczenia na stronie UFG. Zobaczysz w nim swoje polisy i szkody.' },
      { q: 'Czy szkoda z AC obniża zniżki w OC?', a: 'Zwykle nie – zniżki w OC i w AC są liczone osobno. Szkoda z AC obniża zniżkę w AC, a szkoda z Twojej winy wypłacona z OC – zniżkę w OC.' }
    ],
    powiazane: ['ile-kosztuje-oc', 'czy-warto-miec-ac', 'kupilem-auto-co-dalej'],
    zrodla: [ZR.zaswiadczenie, ZR.ufg, ZR.wspolwlasnosc, ZR.ustawaOC]
  },

  // ───────────── 4. Czy warto mieć AC ─────────────
  {
    slug: 'czy-warto-miec-ac',
    kategoria: 'ubezpieczenie',
    ikona: 'ac',
    tytul: 'Czy warto mieć AC? Udział własny, amortyzacja i wariant naprawy',
    krotko: 'Czy warto mieć AC',
    opis: 'AC kosztuje średnio ok. 1060 zł rocznie i chroni Twoje auto, a nie cudze. Sprawdź, dla jakich aut się opłaca, co oznaczają udział własny, amortyzacja i wariant warsztatowy oraz na co patrzeć w warunkach polisy.',
    liczby: [
      { w: '1063 zł', o: 'średnia składka AC w III kw. 2026 (CUK)' },
      { w: '70%', o: 'typowy próg szkody całkowitej w AC' },
      { w: '0 zł', o: 'z OC dostaniesz za szkodę z własnej winy' }
    ],
    sekcje: [
      {
        id: 'czym-jest',
        t: 'Czym AC różni się od OC',
        bloki: [
          {
            typ: 'p',
            t: 'OC jest obowiązkowe i płaci za szkody, które wyrządzisz innym. Za Twoje auto po stłuczce z Twojej winy OC nie zapłaci ani złotówki. Od tego jest autocasco (AC) – dobrowolne ubezpieczenie Twojego samochodu od uszkodzenia, zniszczenia i zwykle także kradzieży.'
          },
          {
            typ: 'p',
            t: 'AC przydaje się też wtedy, gdy sprawca jest nieznany (np. ktoś porysował auto na parkingu), gdy uszkodzi je drzewo, grad albo zwierzę, a także gdy nie chcesz czekać na wypłatę z OC sprawcy.'
          }
        ]
      },
      {
        id: 'kiedy-warto',
        t: 'Kiedy AC się opłaca, a kiedy nie',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'auto nowe lub kilkuletnie – naprawy i części są drogie, a strata przy kradzieży duża,',
              'auto na kredyt lub w leasingu – bank lub leasingodawca zwykle wymaga AC,',
              'parkujesz na ulicy w dużym mieście – rośnie ryzyko kradzieży i szkód parkingowych,',
              'nie masz oszczędności na naprawę – AC chroni domowy budżet przed nagłym wydatkiem.'
            ]
          },
          {
            typ: 'p',
            t: 'W starszym aucie o niewielkiej wartości AC bywa nieopłacalne. Jeśli składka to kilkanaście procent wartości samochodu, a udział własny zjada większość ewentualnej wypłaty, lepiej odkładać pieniądze na naprawy samemu. Prosta zasada: porównaj roczną składkę z kwotą, jaką realnie dostałbyś przy szkodzie całkowitej.'
          }
        ]
      },
      {
        id: 'warunki',
        t: 'Na co patrzeć w warunkach AC',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Udział własny', o: 'Część szkody, którą pokrywasz sam (kwota albo procent). Wyższy udział własny to niższa składka, ale mniejsza wypłata przy każdej szkodzie.' },
              { t: 'Amortyzacja części', o: 'Przy starszym aucie ubezpieczyciel może potrącić zużycie części. Wykupienie ochrony bez amortyzacji podnosi składkę, ale wypłata jest pełna.' },
              { t: 'Wariant warsztatowy lub kosztorysowy', o: 'Warsztatowy: naprawa w serwisie, rachunek płaci ubezpieczyciel. Kosztorysowy: dostajesz pieniądze według wyceny, zwykle niższej niż rachunek w warsztacie. Kosztorysowy jest tańszy w zakupie.' },
              { t: 'Zakres ryzyk', o: '„All risk” obejmuje wszystko, czego warunki wprost nie wyłączają. Polisa „od ryzyk nazwanych” chroni tylko przed tym, co jest wymienione. Sprawdź, czy obejmuje kradzież.' },
              { t: 'Suma ubezpieczenia', o: 'Powinna odpowiadać wartości rynkowej auta. Zaniżona suma oznacza niższą wypłatę przy szkodzie całkowitej.' },
              { t: 'Wyłączenia', o: 'Typowe: jazda po alkoholu, brak ważnego przeglądu, kluczyki zostawione w aucie, jazda bez uprawnień. Przeczytaj je przed podpisaniem.' }
            ]
          }
        ]
      },
      {
        id: 'cena',
        t: 'Jak obniżyć cenę AC',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'wybierz wariant kosztorysowy, jeśli i tak naprawiasz auto w zaufanym warsztacie po rozsądnych stawkach,',
              'zwiększ udział własny – drobne szkody i tak często lepiej pokryć samemu, żeby nie tracić zniżek,',
              'porównaj pakiet OC + AC w kilku firmach – rabaty za pakiet są różne,',
              'zapytaj, czy zabezpieczenia (alarm, lokalizator, garaż) obniżają składkę.'
            ]
          },
          {
            typ: 'link',
            t: 'Porównaj ceny OC i AC',
            o: 'Sprawdź, ile kosztuje AC dla Twojego auta u wielu ubezpieczycieli.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy AC jest obowiązkowe?', a: 'Nie. Obowiązkowe jest tylko OC. AC wymagają zwykle banki i firmy leasingowe, jeśli auto jest na kredyt lub w leasingu.' },
      { q: 'Do jakiego wieku auta warto kupować AC?', a: 'Nie ma sztywnej granicy. AC ma sens, dopóki składka jest niewielka w porównaniu z wartością auta i kosztami napraw. Przy tanim, starym aucie często lepiej odkładać pieniądze samemu.' },
      { q: 'Co to jest udział własny w AC?', a: 'To część szkody, którą pokrywasz sam – kwotowo albo procentowo. Wyższy udział własny obniża składkę, ale zmniejsza wypłatę.' },
      { q: 'Czy AC obejmuje kradzież?', a: 'Zwykle tak, ale nie zawsze. W polisach od ryzyk nazwanych kradzież może być osobną opcją. Sprawdź to w warunkach przed zakupem.' }
    ],
    powiazane: ['szkoda-calkowita-co-dalej', 'ile-kosztuje-oc', 'odszkodowanie-z-oc-sprawcy'],
    zrodla: [ZR.cukRaport, ZR.szkodaCalkowita, ZR.kc]
  },

  // ───────────── 5. Szkoda całkowita ─────────────
  {
    slug: 'szkoda-calkowita-co-dalej',
    kategoria: 'ubezpieczenie',
    ikona: 'calkowita',
    tytul: 'Szkoda całkowita – co dalej z autem i ile dostaniesz pieniędzy',
    krotko: 'Szkoda całkowita',
    opis: 'Ubezpieczyciel uznał szkodę całkowitą? To nie musi oznaczać złomowania auta. Zobacz, jak liczy się wypłatę, co zrobić z wrakiem i jak się odwołać, gdy wycena jest zaniżona.',
    liczby: [
      { w: '100%', o: 'próg w OC: naprawa droższa niż wartość auta' },
      { w: '70%', o: 'typowy próg w AC (zależy od warunków)' },
      { w: 'wrak', o: 'zostaje Twoją własnością' }
    ],
    sekcje: [
      {
        id: 'co-to',
        t: 'Kiedy ubezpieczyciel uznaje szkodę całkowitą',
        bloki: [
          {
            typ: 'p',
            t: 'Przy szkodzie z OC sprawcy szkoda całkowita oznacza, że naprawa kosztowałaby więcej niż wynosiła wartość Twojego auta tuż przed wypadkiem. Przy AC próg zależy od warunków polisy – najczęściej to 70% wartości samochodu.'
          },
          {
            typ: 'p',
            t: 'W takiej sytuacji ubezpieczyciel nie płaci za naprawę, tylko wypłaca różnicę między wartością auta sprzed szkody a wartością wraku. Przykład: auto warte 25 000 zł, wrak wyceniony na 5000 zł – wypłata wynosi 20 000 zł.'
          }
        ]
      },
      {
        id: 'opcje',
        t: 'Co możesz zrobić z wrakiem',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Sprzedać w całości', o: 'Wrak jest Twój. Możesz sprzedać go firmie skupującej uszkodzone auta albo na aukcji. Ubezpieczyciel czasem wskazuje kupca lub wystawia auto na swojej platformie, ale nie ma obowiązku go odkupić.' },
              { t: 'Naprawić we własnym zakresie', o: 'Jeśli znasz tańszy warsztat albo części z demontażu, naprawa może się opłacić. Pamiętaj, że informacja o szkodzie zostaje w historii auta.' },
              { t: 'Oddać do stacji demontażu', o: 'Gdy auto nie nadaje się do niczego, oddaj je do autoryzowanej stacji demontażu. Dostaniesz zaświadczenie potrzebne do wyrejestrowania pojazdu.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Dopóki auto jest zarejestrowane, musi mieć OC – także wrak stojący na podwórku. Po sprzedaży wraku zgłoś zbycie w wydziale komunikacji i u ubezpieczyciela w ciągu 30 dni.'
          }
        ]
      },
      {
        id: 'odwolanie',
        t: 'Wycena zaniżona? Jak się odwołać',
        bloki: [
          {
            typ: 'p',
            t: 'Najczęstszy problem to zbyt niska wartość auta sprzed szkody albo zbyt wysoka wartość wraku. Obie rzeczy obniżają wypłatę. Masz prawo do pełnej dokumentacji wyceny i do odwołania.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Poproś o dokumenty', o: 'Wyliczenie wartości auta, kosztorys naprawy i wycenę wraku. Sprawdź, czy uwzględniono wyposażenie, przebieg i stan auta.' },
              { t: 'Zbierz dowody', o: 'Ogłoszenia podobnych aut (ten sam model, rocznik, silnik, przebieg) i aukcje podobnych wraków. Zapisz zrzuty ekranu z datą.' },
              { t: 'Złóż reklamację na piśmie', o: 'Opisz, z czym się nie zgadzasz, i dołącz dowody. Ubezpieczyciel ma obowiązek odpowiedzieć.' },
              { t: 'Gdy to nie pomoże', o: 'Złóż wniosek do Rzecznika Finansowego (bezpłatnie) albo rozważ pozew. Rzecznik publikuje też przykłady wygranych spraw.' }
            ]
          }
        ]
      },
      {
        id: 'auto-zastepcze',
        t: 'Auto zastępcze przy szkodzie całkowitej',
        bloki: [
          {
            typ: 'p',
            t: 'Jeśli szkodę spowodował inny kierowca, z jego OC możesz dostać auto zastępcze. Sąd Najwyższy w uchwale z 22 listopada 2013 r. uznał, że ubezpieczyciel pokrywa celowe i ekonomicznie uzasadnione koszty najmu. Przy szkodzie całkowitej to zwykle czas potrzebny na kupno innego auta.'
          },
          {
            typ: 'link',
            t: 'Odszkodowanie z OC sprawcy – krok po kroku',
            o: 'Terminy wypłaty, auto zastępcze i co zrobić, gdy ubezpieczyciel zwleka.',
            href: '/poradniki/odszkodowanie-z-oc-sprawcy/'
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy przy szkodzie całkowitej muszę zezłomować auto?', a: 'Nie. Wrak zostaje Twoją własnością – możesz go sprzedać, naprawić albo oddać do stacji demontażu.' },
      { q: 'Jak ubezpieczyciel liczy wypłatę przy szkodzie całkowitej?', a: 'Wypłata to wartość auta sprzed szkody minus wartość wraku. Przy AC mogą być jeszcze potrącenia wynikające z warunków polisy, np. udział własny.' },
      { q: 'Czy muszę płacić OC za wrak?', a: 'Tak, dopóki auto jest zarejestrowane. Obowiązek kończy się po sprzedaży (z przejściem polisy na kupującego) albo po wyrejestrowaniu auta.' },
      { q: 'Co zrobić, gdy wycena wraku jest zawyżona?', a: 'Poproś o dokumentację, zbierz oferty podobnych wraków i złóż pisemną reklamację. Jeśli to nie pomoże, możesz zwrócić się do Rzecznika Finansowego.' }
    ],
    powiazane: ['odszkodowanie-z-oc-sprawcy', 'czy-warto-miec-ac', 'sprzedalem-auto-co-dalej'],
    zrodla: [ZR.szkodaCalkowita, ZR.kc, ZR.rf, ZR.ustawaOC]
  }
];

export const DODATKI_1: Record<string, DodatekSeo> = {
  'ile-kosztuje-oc': {
    seoTytul: 'Ile kosztuje OC w 2026? Średnie ceny i porady',
    seoOpis: 'Średnia cena OC w 2026 r. to ok. 660 zł, a młodzi kierowcy płacą ok. 1500 zł. Od czego zależy składka, jak płacić mniej i kiedy porównać oferty.',
    skrot: [
      'Średnie OC w III kwartale 2026 r. kosztowało 657 zł, ale Twoja cena zależy od wieku, zniżek, miejsca i auta.',
      'Zakres OC jest wszędzie taki sam, więc przy samym OC cena jest najważniejsza.',
      'Polisa odnawia się sama – porównaj oferty 2–3 tygodnie przed jej końcem.'
    ]
  },
  'oc-dla-mlodego-kierowcy': {
    seoTytul: 'OC dla młodego kierowcy – jak płacić mniej',
    seoOpis: 'Młody kierowca płaci za OC średnio ok. 1500 zł. Jak legalnie obniżyć składkę, jak działa współwłasność z rodzicem i czego unikać, by nie stracić zniżek.',
    skrot: [
      'Kierowcy 18–24 lata płacą średnio prawie trzy razy więcej za OC niż kierowcy po pięćdziesiątce.',
      'Współwłaściciel auta buduje własną historię ubezpieczenia, ale szkoda zabiera zniżki wszystkim właścicielom.',
      'Najwięcej dają: rozsądny wybór auta, porównanie wielu ofert i jazda bez szkód.'
    ]
  },
  'znizki-oc-jak-zachowac': {
    seoTytul: 'Zniżki OC – jak je przenieść i zachować',
    seoOpis: 'Zniżki w OC należą do Ciebie, nie do auta. Jak przenieść je do nowego ubezpieczyciela, gdzie pobrać zaświadczenie o przebiegu ubezpieczenia i ile kosztuje szkoda.',
    skrot: [
      'Zniżki są przypisane do właściciela i współwłaściciela, więc przechodzą na kolejne auto.',
      'Historię ubezpieczenia sprawdzisz bezpłatnie w UFG – OC od 2004 r., AC od 2006 r.',
      'Szkoda z Twojej winy cofa zniżkę o kilka poziomów, dlatego przy drobnej stłuczce policz, co się opłaca.'
    ]
  },
  'czy-warto-miec-ac': {
    seoTytul: 'Czy warto mieć AC? Udział własny i warianty',
    seoOpis: 'AC kosztuje średnio ok. 1060 zł rocznie. Kiedy się opłaca, co oznaczają udział własny, amortyzacja i wariant warsztatowy lub kosztorysowy – i jak obniżyć cenę.',
    skrot: [
      'OC nie zapłaci za Twoje auto po szkodzie z Twojej winy – od tego jest dobrowolne AC.',
      'AC opłaca się zwłaszcza przy nowszych, droższych autach i autach na kredyt lub w leasingu.',
      'Przed zakupem sprawdź udział własny, amortyzację, wariant naprawy i wyłączenia.'
    ]
  },
  'szkoda-calkowita-co-dalej': {
    seoTytul: 'Szkoda całkowita – co dalej i ile dostaniesz',
    seoOpis: 'Szkoda całkowita z OC lub AC: jak liczy się wypłatę, co zrobić z wrakiem, czy płacić OC za wrak i jak odwołać się od zaniżonej wyceny ubezpieczyciela.',
    skrot: [
      'Wypłata to wartość auta sprzed szkody minus wartość wraku – a wrak zostaje Twój.',
      'W OC szkoda całkowita to naprawa droższa niż auto, w AC próg to zwykle 70% wartości.',
      'Zaniżoną wycenę możesz zaskarżyć: dokumenty, ogłoszenia podobnych aut, reklamacja, Rzecznik Finansowy.'
    ]
  }
};
