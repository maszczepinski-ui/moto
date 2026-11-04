// Poradniki: kupno i sprzedaż auta, kolizja i wypadek.
// Każdy poradnik ma źródła i datę „stan na”. Przy zmianie przepisów popraw treść i datę STAN_PORADNIKOW.
// To nie jest porada prawna – w nietypowej sytuacji kierowca powinien zapytać urząd, ubezpieczyciela lub prawnika.

import { NOWE, NOWE_DODATKI } from '@/lib/poradniki-nowe';
import HARMONOGRAM from '@/data/harmonogram-poradnikow.json';

export const STAN_PORADNIKOW = 'listopad 2026';

export type KategoriaPoradnika = 'kupno' | 'sprawdzenie' | 'ubezpieczenie' | 'kolizja' | 'bezpieczenstwo' | 'codzienne' | 'eksploatacja';
export type Generator = 'umowa' | 'oswiadczenie' | 'wypowiedzenie' | 'darowizna' | 'dziura';
export type IkonaPoradnika = 'umowa' | 'kluczyk' | 'sprzedaz' | 'oc' | 'kolizja' | 'ranni' | 'ucieczka' | 'zwierze' | 'korytarz' | 'odstep' | 'fotelik' | 'awaria' | 'mgla' | 'import' | 'darowizna' | 'szkoda' | 'dziura' | 'przeglad' | 'dokumenty' | 'kontrola' | 'granica' | 'zima' | 'kradziez' | 'vin' | 'licznik' | 'oszustwo' | 'cena' | 'cenaOc' | 'mlody' | 'znizka' | 'ac' | 'calkowita' | 'kontrolka' | 'lista' | 'powodz' | 'jazda' | 'punkty' | 'fotoradar' | 'opona' | 'akumulator' | 'pierwsze' | 'kredyt' | 'paliwo' | 'strefa' | 'elektryk';

export type Blok =
  | { typ: 'p'; t: string }
  | { typ: 'lista'; elementy: string[] }
  | { typ: 'kroki'; elementy: { t: string; o: string }[] }
  | { typ: 'uwaga'; t: string; ton?: 'info' | 'ostrzezenie' }
  | { typ: 'liczby'; elementy: { w: string; o: string }[] }
  /** Odnośnik do narzędzia lub strony w serwisie (tylko adresy wewnętrzne, np. /mandaty/) */
  | { typ: 'link'; t: string; o: string; href: string };

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
  /** Data publikacji (RRRR-MM-DD). Poradnik pojawi się na stronie dopiero tego dnia – patrz data/harmonogram-poradnikow.json */
  publikacja?: string;
}

export const KATEGORIE: Record<KategoriaPoradnika, { nazwa: string; opis: string }> = {
  kupno: { nazwa: 'Kupno i sprzedaż auta', opis: 'Umowa, podatek, rejestracja, OC – terminy i kary w jednym miejscu.' },
  sprawdzenie: { nazwa: 'Sprawdzanie auta przed zakupem', opis: 'VIN, przebieg, kradzież, oszustwa i uczciwa cena – zanim zapłacisz za używane auto.' },
  ubezpieczenie: { nazwa: 'Ubezpieczenie auta', opis: 'Cena OC, zniżki, AC i szkoda całkowita – jak płacić mniej i nie stracić przy szkodzie.' },
  kolizja: { nazwa: 'Kolizja, wypadek i szkody', opis: 'Co zrobić na miejscu, kiedy wezwać policję i jak dostać odszkodowanie.' },
  bezpieczenstwo: { nazwa: 'Bezpieczeństwo na drodze', opis: 'Jak się zachować w trudnych sytuacjach – przepisy i proste zasady, które ratują życie.' },
  codzienne: { nazwa: 'Kierowca na co dzień', opis: 'Przegląd, dokumenty, kontrola drogowa i wyjazd za granicę – sprawy, które prędzej czy później dotyczą każdego.' },
  eksploatacja: { nazwa: 'Eksploatacja i koszty', opis: 'Kontrolki, akumulator, opony, paliwo i auto elektryczne – jak dbać o auto i ile to naprawdę kosztuje.' }
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
  akcyza: { n: 'Rankomat – akcyza za samochód sprowadzony (stawki, terminy)', url: 'https://rankomat.pl/samochod/akcyza-za-samochod' },
  importCuk: { n: 'CUK – auta z Niemiec: sprowadzenie, rejestracja, ubezpieczenie', url: 'https://cuk.pl/porady/auta-z-niemiec-jak-sprowadzic-zarejestrowac-i-ubezpieczyc-w-polsce' },
  rejestracja2026: { n: 'Otomoto – ile kosztuje rejestracja samochodu w 2026 r.', url: 'https://www.otomoto.pl/news/rejestracja-samochodu-2' },
  darowizna: { n: 'Freenance – darowizna samochodu 2026: podatek, umowa, SD-Z2', url: 'https://freenance.io/podatki/darowizna-samochodu-2026-podatek-umowa-zgloszenie/' },
  darowiznaUlotka: { n: 'Ministerstwo Finansów (podatki.gov.pl) – zasady opodatkowania spadków i darowizn', url: 'https://www.podatki.gov.pl/media/5852/zasady_opodatk-_spadkow_i_darowizn_2019.pdf' },
  wyplataOc: { n: 'CUK – kiedy zostanie wypłacone odszkodowanie z OC sprawcy', url: 'https://cuk.pl/porady/kiedy-zostanie-wyplacone-odszkodowanie-z-oc-sprawcy' },
  autoZastepcze: { n: 'CUK – samochód zastępczy z OC sprawcy', url: 'https://cuk.pl/porady/samochod-zastepczy-z-oc-sprawcy-na-jakich-warunkach' },
  przedawnienie: { n: 'Mubi – przedawnienie roszczeń z OC', url: 'https://mubi.pl/poradniki/przedawnienie-roszczen-z-oc/' },
  rf: { n: 'Rzecznik Finansowy – pomoc w sporach z ubezpieczycielem', url: 'https://rf.gov.pl/' },
  dziuraRankomat: { n: 'Rankomat – dziura w drodze: kto zapłaci za uszkodzenia', url: 'https://rankomat.pl/samochod/dziura-droga-kto-zaplaci-za-uszkodzenia' },
  dziuraAutocentrum: { n: 'Autocentrum – uszkodzenie auta na dziurze: jak uzyskać odszkodowanie', url: 'https://www.autocentrum.pl/publikacje/porady/uszkodziles-samochod-na-dziurze-w-jezdni-oto-jak-uzyskac-odszkodowanie/' },
  przeglad2026: { n: 'Auto Świat – badania techniczne 2026: ceny i zapowiadane zmiany', url: 'https://www.auto-swiat.pl/porady/nowe-przeglady-techniczne-2026-cala-prawda-o-podwyzkach-i-rzekomych-karach/1j64h4m' },
  przegladPoTerminie: { n: 'Otomoto – przegląd po terminie: cena i kara', url: 'https://www.otomoto.pl/news/ile-kosztuje-przeglad-samochodu-po-terminie-cena-i-kara' },
  przegladRankomat: { n: 'Rankomat – przegląd samochodu: koszt i ponowne badanie', url: 'https://rankomat.pl/samochod/przeglad-samochodu' },
  wtornikDowodu: { n: 'Warszawa 19115 – wydanie wtórnika dowodu rejestracyjnego', url: 'https://warszawa19115.pl/en/-/wydanie-wtornika-dowodu-rejestracyjnego' },
  wtornikPj: { n: 'gov.pl – zgłoś utratę lub uszkodzenie prawa jazdy', url: 'https://www.gov.pl/web/gov/zglos-utrate-lub-uszkodzenie-prawa-jazdy' },
  dokumentyKierowcy: { n: 'CUK – jakie dokumenty musi mieć kierowca', url: 'https://cuk.pl/porady/czy-trzeba-miec-przy-sobie-prawo-jazdy-jakie-dokumenty-musi-miec-kierowca' },
  kontrolaInteria: { n: 'Interia Motoryzacja – kontrola drogowa: kto może zatrzymać i jak się zachować', url: 'https://motoryzacja.interia.pl/porady/przepisy-drogowe/news-kontrola-drogowa-kto-moze-nas-zatrzymac-i-jak-sie-zachowac,nId,7272801' },
  kontrolaCuk: { n: 'CUK – jak przebiega kontrola policyjna', url: 'https://cuk.pl/porady/kontrola-policyjna' },
  kpw: { n: 'Kodeks postępowania w sprawach o wykroczenia (ISAP)', url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20011061148' },
  zielonaKarta: { n: 'Rankomat – kiedy i gdzie kierowca potrzebuje Zielonej Karty', url: 'https://rankomat.pl/samochod/kiedy-gdzie-kierowca-potrzebuje-zielonej-karty-za-granica' },
  wakacjeAutem: { n: 'CarLease Polska – wakacje autem po Europie 2026: dokumenty, winiety', url: 'https://carleasepolska.pl/blog/556/wakacje-autem-po-europie-2026-jakie-dokumenty-winiety-i-ubezpieczenia-musisz-miec' },
  zimaInteria: { n: 'Interia Motoryzacja – mandat za nieodśnieżony samochód (art. 60 i 66)', url: 'https://motoryzacja.interia.pl/porady/przepisy-drogowe/news-zima-kierowcy-musza-szczegolnie-uwazac-na-art-60-i-66-inacze,nId,7253172' },
  kradzioneLink4: { n: 'Link4 – jak sprawdzić, czy auto nie jest kradzione', url: 'https://www.link4.pl/blog/jak-sprawdzic-czy-auto-nie-jest-kradzione' },
  vinWiki: { n: 'Wikipedia – Vehicle identification number (budowa VIN, kody WMI, rok modelowy)', url: 'https://en.wikipedia.org/wiki/Vehicle_identification_number' },
  vinRankomat: { n: 'Rankomat – tabela kodów VIN', url: 'https://rankomat.pl/samochod/tabela-kodow-vin' },
  licznikMubi: { n: 'Mubi – zaniżony przebieg samochodu: kary i co zrobić', url: 'https://mubi.pl/poradniki/zanizony-przebieg-samochodu/' },
  oszustwaAutoSwiat: { n: 'Auto Świat – triki handlarzy, jak się nie nabrać', url: 'https://www.auto-swiat.pl/porady/oszustwa-przy-handlu-samochodami-oto-12-trikow-handlarzy-jak-sie-nie-nabrac/ty3cmqv' },
  eurotax: { n: 'CUK – baza Eurotax i Info-Ekspert', url: 'https://cuk.pl/porady/baza-eurotax-baza-info-ekspert' },
  kable: { n: 'CUK – jak uruchomić samochód za pomocą kabli rozruchowych', url: 'https://cuk.pl/porady/samochod-kable-rozruchowe' },
  mgla: { n: 'Interia Motoryzacja – kiedy włączać światła przeciwmgłowe z przodu i z tyłu', url: 'https://motoryzacja.interia.pl/porady/news-kiedy-wlaczac-swiatla-przeciwmgielne-z-przodu-a-kiedy-z-tylu,nId,7154932' }
};

const STALE: Poradnik[] = [
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
  },
  // ───────────── KUPNO I SPRZEDAŻ (cd.) ─────────────
  {
    slug: 'sprowadzenie-auta-z-zagranicy',
    kategoria: 'kupno',
    ikona: 'import',
    tytul: 'Sprowadzenie auta z Niemiec i UE – akcyza, rejestracja, koszty krok po kroku',
    krotko: 'Sprowadzenie auta z zagranicy',
    opis: 'Od umowy za granicą do polskich tablic: jak przewieźć auto, ile wynosi akcyza, jakie dokumenty przetłumaczyć i w jakich terminach się zmieścić.',
    liczby: [
      { w: '14 dni', o: 'na deklarację akcyzową AKC-U/S' },
      { w: '3,1% / 18,6%', o: 'akcyza: silnik do 2,0 l / powyżej' },
      { w: '30 dni', o: 'na rejestrację od wjazdu do Polski' }
    ],
    sekcje: [
      {
        id: 'zanim-kupisz',
        t: 'Zanim kupisz',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'sprawdź historię auta po numerze VIN – przebieg i szkody z zagranicy to najczęstsza pułapka przy imporcie,',
              'umowa albo faktura musi zawierać VIN, dane obu stron i cenę – później posłuży do akcyzy i rejestracji,',
              'zabierz oryginały dokumentów pojazdu (w Niemczech to dwie części dowodu rejestracyjnego) i wszystkie kluczyki,',
              'policz akcyzę przed zakupem – przy silniku powyżej 2,0 l potrafi zmienić opłacalność całej transakcji.'
            ]
          }
        ]
      },
      {
        id: 'transport',
        t: 'Jak przywieźć auto do Polski',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Na kołach – z tablicami wywozowymi', o: 'Auto musi być sprawne, mieć tablice tymczasowe (wywozowe) i krótkoterminowe ubezpieczenie. Taka polisa zwykle obejmuje do 30 dni – do czasu rejestracji w Polsce.' },
              { t: 'Na lawecie lub przyczepie', o: 'Gdy auto nie ma tablic albo nie jest sprawne. Weź od przewoźnika dokumenty przewozu – mogą się przydać przy rejestracji.' }
            ]
          },
          {
            typ: 'uwaga',
            t: 'Najpóźniej w dniu rejestracji musisz mieć polskie OC. Zagraniczna polisa przestaje działać po rejestracji auta w Polsce.'
          }
        ]
      },
      {
        id: 'akcyza',
        t: 'Akcyza – ile i do kiedy',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '3,1%', o: 'silnik do 2000 cm³' },
              { w: '18,6%', o: 'silnik powyżej 2000 cm³' },
              { w: '1,55%', o: 'hybryda do 2000 cm³' },
              { w: '0%', o: 'elektryk, hybryda plug-in do 2000 cm³' }
            ]
          },
          {
            typ: 'p',
            t: 'Akcyzę liczy się od wartości rynkowej auta przeliczonej na złote po średnim kursie NBP z dnia zakupu. Hybrydy od 2001 do 3500 cm³ płacą 9,3%, a hybrydy plug-in do 2000 cm³ są zwolnione do końca 2029 r. Deklarację AKC-U/S składasz w ciągu 14 dni od zakupu – najprościej przez portal PUESC – i płacisz podatek do urzędu skarbowego. Potwierdzenie zapłaty (z numerem VIN) jest potrzebne do rejestracji.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Zwolnienie z akcyzy (np. dla elektryka) też trzeba potwierdzić w urzędzie skarbowym – bez tego dokumentu wydział komunikacji nie zarejestruje auta.'
          }
        ]
      },
      {
        id: 'rejestracja',
        t: 'Rejestracja w Polsce',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zaświadczenie o VAT', o: 'Przy aucie z Unii Europejskiej urząd skarbowy wydaje zaświadczenie VAT-25 (składasz wniosek VAT-24, opłata 160 zł). Urząd ma na to do 7 dni roboczych.' },
              { t: 'Tłumaczenia przysięgłe', o: 'Umowę lub fakturę i inne dokumenty w obcym języku przetłumacz u tłumacza przysięgłego. Jedna strona umowy to zwykle koszt rzędu 70–100 zł.' },
              { t: 'Badanie techniczne w Polsce', o: 'Przed pierwszą rejestracją auto musi przejść badanie w polskiej stacji kontroli pojazdów – nawet jeśli ma ważny przegląd z zagranicy.' },
              { t: 'Wniosek w wydziale komunikacji', o: 'Masz 30 dni od wprowadzenia auta do Polski. Zabierz: umowę z tłumaczeniem, dokumenty pojazdu (z tłumaczeniem), tablice albo oświadczenie o ich braku, potwierdzenie akcyzy, VAT-25, badanie techniczne, dowód osobisty i polisę OC.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Za brak wniosku o rejestrację w 30 dni grozi kara 500 zł, a po 180 dniach – 1000 zł. Przy kupnie od osoby prywatnej za granicą PCC zwykle nie płacisz.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile wynosi akcyza na auto z Niemiec?', a: '3,1% wartości rynkowej przy silniku do 2000 cm³ i 18,6% powyżej. Hybrydy mają niższe stawki (1,55% i 9,3%), a auta elektryczne i hybrydy plug-in do 2000 cm³ są zwolnione.' },
      { q: 'Ile mam czasu na zarejestrowanie auta sprowadzonego z zagranicy?', a: '30 dni od wprowadzenia auta do Polski. Spóźnienie kosztuje 500 zł, a po 180 dniach 1000 zł.' },
      { q: 'Czy trzeba tłumaczyć dokumenty auta z Niemiec?', a: 'Tak – dokumenty w obcym języku, w tym umowę lub fakturę, trzeba przetłumaczyć u tłumacza przysięgłego.' }
    ],
    powiazane: ['kupilem-auto-co-dalej', 'umowa-kupna-sprzedazy-samochodu', 'przeglad-techniczny-terminy-koszt'],
    zrodla: [Z.akcyza, Z.importCuk, Z.rejestracja2026, Z.pcc]
  },
  {
    slug: 'darowizna-samochodu',
    kategoria: 'kupno',
    ikona: 'darowizna',
    tytul: 'Darowizna samochodu w rodzinie – umowa, SD-Z2 i podatek',
    krotko: 'Darowizna auta w rodzinie',
    opis: 'Przekazujesz auto dziecku, rodzicom albo rodzeństwu? Zobacz, kiedy nie zapłacisz podatku, jak spisać umowę darowizny i o jakim terminie nie wolno zapomnieć.',
    generator: 'darowizna',
    liczby: [
      { w: '0 zł', o: 'podatku dla najbliższej rodziny' },
      { w: '6 mies.', o: 'na zgłoszenie SD-Z2' },
      { w: '30 dni', o: 'na przerejestrowanie auta' }
    ],
    sekcje: [
      {
        id: 'kto-bez-podatku',
        t: 'Kto nie płaci podatku',
        bloki: [
          {
            typ: 'p',
            t: 'Darowizna między najbliższymi – tak zwana „grupa zerowa” – jest zwolniona z podatku bez względu na wartość auta. Warunek: obdarowany zgłasza ją w urzędzie skarbowym na formularzu SD-Z2 w ciągu 6 miesięcy od podpisania umowy.'
          },
          {
            typ: 'lista',
            elementy: ['małżonek,', 'dzieci, wnuki i prawnuki,', 'rodzice i dziadkowie,', 'rodzeństwo,', 'pasierb, ojczym i macocha.']
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Spóźnione zgłoszenie oznacza utratę zwolnienia – wtedy podatek liczy się jak dla zwykłej darowizny w pierwszej grupie podatkowej.'
          },
          {
            typ: 'p',
            t: 'Darowizna od dalszej rodziny lub znajomych jest opodatkowana powyżej kwoty wolnej, sumowanej z 5 lat od jednego darczyńcy: 36 120 zł w I grupie, 27 090 zł w II i 5733 zł w III grupie podatkowej.'
          }
        ]
      },
      {
        id: 'umowa',
        t: 'Umowa darowizny – co w niej musi być',
        bloki: [
          {
            typ: 'p',
            t: 'Do darowizny auta nie potrzebujesz notariusza – wystarczy umowa na piśmie w dwóch egzemplarzach, podpisana przez obie strony. Wypełnisz ją niżej.'
          },
          {
            typ: 'lista',
            elementy: [
              'dane darczyńcy i obdarowanego oraz stopień pokrewieństwa,',
              'dokładny opis auta: marka, model, rok, numer VIN i numer rejestracyjny,',
              'wartość rynkowa auta – potrzebna do zgłoszenia w urzędzie skarbowym,',
              'datę, miejsce i podpisy.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'Darowizna to nie sprzedaż – nie płacisz od niej PCC. Nie wpisuj w umowie symbolicznej ceny „za 1 zł”, bo taka umowa staje się sprzedażą i urząd może naliczyć PCC od wartości rynkowej.'
          }
        ]
      },
      {
        id: 'po-darowiznie',
        t: 'Po podpisaniu umowy',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Obdarowany: SD-Z2 w 6 miesięcy', o: 'Najprościej przez e-Urząd Skarbowy. Zachowaj potwierdzenie złożenia.' },
              { t: 'Obdarowany: rejestracja w 30 dni', o: 'Tak samo jak po kupnie auta – za spóźnienie grozi 500 zł kary.' },
              { t: 'Darczyńca: zgłoszenie zbycia w 30 dni', o: 'Darowizna to też „zbycie” auta – zawiadom wydział komunikacji. Kara za brak zgłoszenia: 250 zł.' },
              { t: 'OC przechodzi na obdarowanego', o: 'Polisa chroni do końca okresu, ale nie odnowi się sama. Obdarowany może ją też wypowiedzieć i kupić własną.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy od darowizny samochodu od rodziców płaci się podatek?', a: 'Nie, jeśli obdarowany zgłosi darowiznę na formularzu SD-Z2 w ciągu 6 miesięcy od umowy. Spóźnienie oznacza utratę zwolnienia.' },
      { q: 'Czy umowa darowizny samochodu musi być u notariusza?', a: 'Nie. Wystarczy pisemna umowa w dwóch egzemplarzach, podpisana przez obie strony.' },
      { q: 'Czy od darowizny auta płaci się PCC?', a: 'Nie. PCC płaci się od sprzedaży. Darowizna podlega przepisom o podatku od spadków i darowizn.' }
    ],
    powiazane: ['sprzedalem-auto-co-dalej', 'kupilem-auto-co-dalej', 'wypowiedzenie-oc'],
    zrodla: [Z.darowizna, Z.darowiznaUlotka, Z.starostwo]
  },

  // ───────────── KOLIZJA I SZKODY (cd.) ─────────────
  {
    slug: 'odszkodowanie-z-oc-sprawcy',
    kategoria: 'kolizja',
    ikona: 'szkoda',
    tytul: 'Odszkodowanie z OC sprawcy – terminy, auto zastępcze, zaniżona wycena',
    krotko: 'Szkoda z OC sprawcy',
    opis: 'Ktoś uderzył w Twoje auto. Jak zgłosić szkodę, ile ubezpieczyciel ma czasu na wypłatę, kiedy należy się auto zastępcze i co zrobić, gdy wycena jest za niska.',
    liczby: [
      { w: '30 dni', o: 'na wypłatę od zgłoszenia szkody' },
      { w: '3 lata', o: 'na zgłoszenie szkody w aucie' },
      { w: '7%', o: 'rocznie – odsetki za spóźnioną wypłatę' }
    ],
    sekcje: [
      {
        id: 'zgloszenie',
        t: 'Jak zgłosić szkodę',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Do ubezpieczyciela sprawcy', o: 'Telefonicznie, przez formularz online albo w oddziale. Potrzebujesz numeru polisy sprawcy – jest w oświadczeniu albo w notatce policji (sprawdzisz ją też na ufg.pl po numerze rejestracyjnym).' },
              { t: 'Dołącz dokumenty', o: 'Oświadczenie sprawcy lub dane z notatki policji, zdjęcia z miejsca zdarzenia, dowód rejestracyjny, prawo jazdy i numer konta.' },
              { t: 'Oględziny auta', o: 'Rzeczoznawca ubezpieczyciela ogląda uszkodzenia i przygotowuje kosztorys. Nie naprawiaj auta przed oględzinami.' },
              { t: 'Wybierz sposób rozliczenia', o: 'Gotówka według kosztorysu albo naprawa w warsztacie, który rozlicza się bezpośrednio z ubezpieczycielem (bezgotówkowo).' }
            ]
          }
        ]
      },
      {
        id: 'terminy',
        t: 'Ile trwa wypłata',
        bloki: [
          {
            typ: 'p',
            t: 'Ubezpieczyciel ma 30 dni od zgłoszenia szkody. Jeśli w tym czasie nie da się ustalić odpowiedzialności lub wysokości szkody, musi Cię o tym poinformować na piśmie – wtedy płaci w ciągu 14 dni od wyjaśnienia sprawy, ale nie później niż 90 dni od zgłoszenia (dłużej tylko przy toczącym się postępowaniu karnym lub cywilnym). Bezsporną część odszkodowania wypłaca w terminie 30 dni.'
          },
          {
            typ: 'uwaga',
            t: 'Za spóźnioną wypłatę należą Ci odsetki ustawowe za opóźnienie (7% w skali roku). Upomnij się o nie pisemnie.'
          }
        ]
      },
      {
        id: 'auto-zastepcze',
        t: 'Auto zastępcze',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'należy się także osobie prywatnej, nie tylko firmie – gdy brak auta jest dla Ciebie realnym problemem,',
              'przy szkodzie częściowej – na czas naprawy, razem z czekaniem na części; przy szkodzie całkowitej – do wypłaty odszkodowania,',
              'powinno być tej samej lub niższej klasy co Twoje auto i wynajęte po rynkowej stawce,',
              'nie musisz brać auta z wypożyczalni wskazanej przez ubezpieczyciela – zachowaj wtedy umowę najmu, fakturę i dowód zapłaty.'
            ]
          }
        ]
      },
      {
        id: 'zanizona-wycena',
        t: 'Wycena jest za niska – co zrobić',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Poproś o kosztorys i uzasadnienie', o: 'Masz prawo zobaczyć, jakie ceny części i roboczogodzin przyjął ubezpieczyciel.' },
              { t: 'Złóż reklamację', o: 'Na piśmie, z własnym kosztorysem z warsztatu albo opinią rzeczoznawcy. Ubezpieczyciel odpowiada w 30 dni, w skomplikowanych sprawach do 60 dni.' },
              { t: 'Rzecznik Finansowy', o: 'Gdy reklamacja nie pomoże, możesz złożyć wniosek o interwencję lub postępowanie polubowne u Rzecznika Finansowego.' },
              { t: 'Sąd', o: 'Ostatni krok – pozew o dopłatę. Odszkodowanie ma pokryć koszt przywrócenia auta do stanu sprzed szkody.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Roszczenie o szkodę w aucie przedawnia się co do zasady po 3 latach od dnia, w którym dowiedziałeś się o szkodzie i o sprawcy. Zgłoszenie szkody ubezpieczycielowi przerywa ten termin.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile ubezpieczyciel ma czasu na wypłatę odszkodowania z OC?', a: '30 dni od zgłoszenia szkody. Gdy wyjaśnienie sprawy trwa dłużej – 14 dni od wyjaśnienia, ale nie później niż 90 dni od zgłoszenia.' },
      { q: 'Czy osobie prywatnej należy się auto zastępcze z OC sprawcy?', a: 'Tak, jeśli brak auta jest uzasadnioną niedogodnością. Przy naprawie – na czas naprawy, przy szkodzie całkowitej – do wypłaty odszkodowania.' },
      { q: 'Co zrobić, gdy odszkodowanie z OC jest za niskie?', a: 'Złożyć reklamację z własnym kosztorysem. Gdy to nie pomoże – zwrócić się do Rzecznika Finansowego albo do sądu.' }
    ],
    powiazane: ['kolizja-bez-policji', 'sprawca-uciekl-brak-oc', 'odszkodowanie-za-dziure-w-drodze'],
    zrodla: [Z.wyplataOc, Z.autoZastepcze, Z.przedawnienie, Z.rf]
  },
  {
    slug: 'odszkodowanie-za-dziure-w-drodze',
    kategoria: 'kolizja',
    ikona: 'dziura',
    tytul: 'Dziura w drodze uszkodziła auto – jak dostać odszkodowanie (wzór pisma)',
    krotko: 'Odszkodowanie za dziurę',
    opis: 'Felga, opona, zawieszenie – za szkody spowodowane dziurą może zapłacić zarządca drogi. Jak to udokumentować, do kogo napisać i jak wygląda wniosek.',
    generator: 'dziura',
    liczby: [
      { w: '30 dni', o: 'na decyzję ubezpieczyciela zarządcy' },
      { w: '3 lata', o: 'na zgłoszenie roszczenia' },
      { w: '4 rodzaje', o: 'zarządców: gmina, powiat, województwo, GDDKiA' }
    ],
    sekcje: [
      {
        id: 'na-miejscu',
        t: 'Na miejscu',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zatrzymaj się bezpiecznie', o: 'Włącz światła awaryjne. Gdy uszkodzone jest koło, nie jedź dalej – możesz dodatkowo zniszczyć felgę.' },
              { t: 'Sfotografuj dziurę z bliska i z daleka', o: 'Połóż obok coś, co pokaże skalę (np. butelkę albo miarkę). Zrób też zdjęcia otoczenia: znaków (lub ich braku), numeru drogi, pobliskich budynków.' },
              { t: 'Sfotografuj uszkodzenia auta', o: 'Oponę, felgę, zderzak – tak, żeby było widać, że to świeże uszkodzenia.' },
              { t: 'Wezwij policję lub straż miejską', o: 'Notatka służb to najmocniejszy dowód. Zapisz też dane świadków.' }
            ]
          }
        ]
      },
      {
        id: 'kto-zarzadza',
        t: 'Kto odpowiada za drogę',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: 'gmina', o: 'drogi gminne, ulice w mieście' },
              { w: 'powiat', o: 'drogi powiatowe' },
              { w: 'województwo', o: 'drogi wojewódzkie (DW)' },
              { w: 'GDDKiA', o: 'drogi krajowe (DK), ekspresowe (S), autostrady (A)' }
            ]
          },
          {
            typ: 'p',
            t: 'Na płatnych odcinkach autostrad zarządcą jest koncesjonariusz. Jeśli nie wiesz, czyja jest droga, zapytaj w urzędzie gminy – albo wpisz to do notatki policji.'
          }
        ]
      },
      {
        id: 'wniosek',
        t: 'Jak złożyć wniosek',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Napisz do zarządcy drogi', o: 'Opisz miejsce, datę i przebieg zdarzenia, uszkodzenia i żądaną kwotę. Dołącz zdjęcia, notatkę policji, kosztorys lub faktury za naprawę. Wzór wypełnisz niżej.' },
              { t: 'Zarządca przekaże sprawę ubezpieczycielowi', o: 'Większość zarządców ma OC. Możesz też zgłosić szkodę bezpośrednio do jego ubezpieczyciela – ma 30 dni na decyzję.' },
              { t: 'Zachowaj kopie', o: 'Wniosek wyślij listem poleconym albo złóż w kancelarii urzędu i weź potwierdzenie.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Musisz wykazać, że zarządca zaniedbał drogę. Jeśli jechałeś za szybko albo stał znak ostrzegający o ubytkach, odszkodowanie może zostać obniżone lub odrzucone.'
          }
        ]
      },
      {
        id: 'odmowa',
        t: 'Gdy zarządca odmawia',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'złóż odwołanie z dodatkowymi dowodami (np. zgłoszenia mieszkańców o tej samej dziurze),',
              'skorzystaj z AC, jeśli je masz – ubezpieczyciel sam dochodzi potem pieniędzy od zarządcy, ale możesz stracić zniżki,',
              'ostatnia droga to pozew – roszczenie przedawnia się co do zasady po 3 latach.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Kto płaci za uszkodzenie auta na dziurze?', a: 'Zarządca drogi (gmina, powiat, województwo lub GDDKiA) albo jego ubezpieczyciel – jeśli zaniedbał utrzymanie drogi.' },
      { q: 'Jak udokumentować szkodę na dziurze?', a: 'Zdjęcia dziury ze skalą i otoczenia, zdjęcia uszkodzeń, notatka policji lub straży miejskiej, dane świadków i kosztorys naprawy.' },
      { q: 'Ile czasu jest na zgłoszenie szkody z dziury?', a: 'Co do zasady 3 lata. Im szybciej jednak zgłosisz szkodę, tym łatwiej ją udowodnić.' }
    ],
    powiazane: ['odszkodowanie-z-oc-sprawcy', 'zderzenie-ze-zwierzeciem'],
    zrodla: [Z.dziuraRankomat, Z.dziuraAutocentrum, Z.kc]
  },

  // ───────────── NA CO DZIEŃ ─────────────
  {
    slug: 'przeglad-techniczny-terminy-koszt',
    kategoria: 'codzienne',
    ikona: 'przeglad',
    tytul: 'Przegląd techniczny auta – terminy, cena 2026 i co gdy auto nie przejdzie',
    krotko: 'Przegląd techniczny',
    opis: 'Kiedy robić badanie techniczne, ile kosztuje w 2026 roku, co się dzieje przy negatywnym wyniku i czym grozi jazda bez ważnego przeglądu.',
    liczby: [
      { w: '149 zł', o: 'badanie auta osobowego' },
      { w: '245 zł', o: 'auto z instalacją LPG' },
      { w: '3 → 2 → 1', o: 'lata między badaniami nowego auta' }
    ],
    sekcje: [
      {
        id: 'terminy',
        t: 'Kiedy robić przegląd',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Nowe auto: po 3 latach', o: 'Pierwsze badanie przed upływem 3 lat od pierwszej rejestracji.' },
              { t: 'Potem: po 2 latach', o: 'Drugie badanie przed upływem kolejnych 2 lat.' },
              { t: 'Dalej: co roku', o: 'Każde następne badanie – raz w roku.' },
              { t: 'Auto z LPG: zawsze co roku', o: 'Bez względu na wiek auta, bo badana jest też instalacja gazowa.' }
            ]
          },
          {
            typ: 'p',
            t: 'Termin kolejnego badania znajdziesz w aplikacji mObywatel, na historiapojazdu.gov.pl albo na zaświadczeniu ze stacji. Przegląd możesz zrobić w dowolnej stacji kontroli pojazdów w Polsce, nie tylko w swoim mieście.'
          },
          {
            typ: 'uwaga',
            t: 'Badanie zrobione wcześniej skraca ważność – kolejny termin liczy się od dnia badania, nie od starej daty.'
          }
        ]
      },
      {
        id: 'koszt',
        t: 'Ile kosztuje przegląd w 2026 roku',
        bloki: [
          {
            typ: 'p',
            t: 'Badanie auta osobowego kosztuje 149 zł, a z instalacją gazową 245 zł (149 zł plus 96 zł za sprawdzenie LPG). Płacisz przed badaniem i pieniądze nie wracają, jeśli auto nie przejdzie. Za spóźniony przegląd nie ma dodatkowej opłaty – głośne zapowiedzi „podwójnej ceny” to wciąż tylko projekty.'
          }
        ]
      },
      {
        id: 'negatywny-wynik',
        t: 'Auto nie przeszło przeglądu',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Diagnosta wpisuje usterki', o: 'Dostajesz informację, co trzeba naprawić. Przy usterce stwarzającej poważne zagrożenie diagnosta może zakazać dalszej jazdy.' },
              { t: 'Naprawiasz i wracasz', o: 'Przy ponownym badaniu płacisz tylko za sprawdzenie naprawionych elementów (np. hamulce, światła). Suma tych opłat nie przekroczy ceny całego badania.' }
            ]
          }
        ]
      },
      {
        id: 'bez-przegladu',
        t: 'Jazda bez ważnego przeglądu',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'grozi mandat, a policja może zatrzymać dowód rejestracyjny – dziś zwykle elektronicznie, wpisem w systemie,',
              'gdy auto zagraża bezpieczeństwu, może zostać odholowane na koszt właściciela,',
              'ubezpieczyciel z AC może obniżyć lub odmówić wypłaty, jeśli usterka przyczyniła się do szkody,',
              'z OC poszkodowany i tak dostanie pieniądze – ale przy ewidentnej usterce (np. hamulców) sprawa może się skomplikować.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile kosztuje przegląd samochodu w 2026 roku?', a: '149 zł za auto osobowe i 245 zł za auto z instalacją LPG.' },
      { q: 'Co ile lat robi się przegląd nowego samochodu?', a: 'Pierwszy przed upływem 3 lat od rejestracji, drugi po kolejnych 2 latach, a potem co roku. Auta z LPG – co roku.' },
      { q: 'Czy za przegląd po terminie płaci się więcej?', a: 'Nie, cena jest taka sama. Jazda bez ważnego badania grozi jednak mandatem i zatrzymaniem dowodu rejestracyjnego.' }
    ],
    powiazane: ['zgubiony-dowod-rejestracyjny-prawo-jazdy', 'kontrola-drogowa-prawa-kierowcy', 'zima-w-samochodzie'],
    zrodla: [Z.przeglad2026, Z.przegladPoTerminie, Z.przegladRankomat, Z.prd]
  },
  {
    slug: 'zgubiony-dowod-rejestracyjny-prawo-jazdy',
    kategoria: 'codzienne',
    ikona: 'dokumenty',
    tytul: 'Zgubiony dowód rejestracyjny lub prawo jazdy – co zrobić i ile to kosztuje',
    krotko: 'Zgubione dokumenty auta',
    opis: 'Zgubiłeś albo ktoś ukradł Ci dowód rejestracyjny lub prawo jazdy? Gdzie to zgłosić, jak dostać wtórnik i czy w międzyczasie możesz jeździć.',
    liczby: [
      { w: '30 dni', o: 'na wniosek o wtórnik dowodu rejestracyjnego' },
      { w: '100 zł', o: 'wtórnik prawa jazdy' },
      { w: 'do 9 dni', o: 'roboczych na nowe prawo jazdy' }
    ],
    sekcje: [
      {
        id: 'dowod',
        t: 'Dowód rejestracyjny',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Kradzież? Najpierw policja', o: 'Gdy dokument (albo tablice) ukradziono, zgłoś to na policji.' },
              { t: 'Wniosek o wtórnik w 30 dni', o: 'W wydziale komunikacji, w którym auto jest zarejestrowane. Zabierz dowód osobisty i podpisz oświadczenie o utracie dokumentu.' },
              { t: 'Pozwolenie czasowe', o: 'Na czas oczekiwania możesz dostać pozwolenie czasowe ważne 30 dni – oddajesz je przy odbiorze nowego dowodu.' },
              { t: 'Odbiór', o: 'Nowy dowód zwykle jest gotowy w ciągu 30 dni. Status sprawdzisz na info-car.pl.' }
            ]
          },
          {
            typ: 'p',
            t: 'Przykładowe opłaty (Warszawa): 54 zł za nowy dowód i 18,50 zł za pozwolenie czasowe. Stawki mogą się zmieniać – sprawdź je w swoim urzędzie przed wizytą.'
          },
          {
            typ: 'uwaga',
            t: 'W Polsce nie musisz wozić dowodu rejestracyjnego – policja sprawdza dane w systemie. Ale za granicę bez papierowego dokumentu (lub pozwolenia czasowego) nie wyjedziesz.'
          }
        ]
      },
      {
        id: 'prawo-jazdy',
        t: 'Prawo jazdy',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Złóż wniosek o wtórnik', o: 'Przez internet (usługa „Wydanie wtórnika prawa jazdy”, profil zaufany) albo w urzędzie – starostwie, urzędzie miasta lub dzielnicy.' },
              { t: 'Przygotuj zdjęcie i opłatę', o: 'Opłata wynosi 100 zł. Online potrzebne jest zdjęcie w formie pliku – wymagania są opisane na gov.pl.' },
              { t: 'Poczekaj na dokument', o: 'Zwykle do 9 dni roboczych. Gotowość sprawdzisz na info-car.pl.' }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Strona gov.pl przypomina, że nie możesz prowadzić pojazdu bez ważnego prawa jazdy. Do odbioru wtórnika lepiej zostawić auto.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile kosztuje wtórnik dowodu rejestracyjnego?', a: 'W Warszawie 54 zł za dowód i 18,50 zł za pozwolenie czasowe na czas oczekiwania. Stawki sprawdź w swoim urzędzie.' },
      { q: 'Ile kosztuje wtórnik prawa jazdy i jak długo się czeka?', a: '100 zł. Urząd wydaje dokument zwykle w ciągu 9 dni roboczych.' },
      { q: 'Czy muszę wozić dowód rejestracyjny?', a: 'W Polsce nie – wystarczy dokument tożsamości, a policja sprawdzi dane w systemie. Za granicą potrzebny jest papierowy dokument.' }
    ],
    powiazane: ['kontrola-drogowa-prawa-kierowcy', 'wyjazd-autem-za-granice', 'przeglad-techniczny-terminy-koszt'],
    zrodla: [Z.wtornikDowodu, Z.wtornikPj, Z.dokumentyKierowcy]
  },
  {
    slug: 'kontrola-drogowa-prawa-kierowcy',
    kategoria: 'codzienne',
    ikona: 'kontrola',
    tytul: 'Kontrola drogowa – prawa i obowiązki kierowcy, dokumenty, mandat',
    krotko: 'Kontrola drogowa',
    opis: 'Jak zachować się po zatrzymaniu przez policję, jakie dokumenty musisz mieć, kto w ogóle może Cię zatrzymać i co się dzieje, gdy nie przyjmiesz mandatu.',
    liczby: [
      { w: '1 dokument', o: 'wystarczy w Polsce – dowód tożsamości' },
      { w: 'po cywilnemu', o: 'policjant zatrzyma Cię tylko w terenie zabudowanym' },
      { w: 'sąd', o: 'rozstrzyga, gdy odmówisz mandatu' }
    ],
    sekcje: [
      {
        id: 'zatrzymanie',
        t: 'Jak się zachować',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zatrzymaj się w bezpiecznym miejscu', o: 'Zwolnij, zjedź na pobocze lub zatokę i włącz światła awaryjne.' },
              { t: 'Zostań w aucie', o: 'Wysiadasz tylko na polecenie. Uchyl szybę i trzymaj ręce na kierownicy, żeby policjant je widział.' },
              { t: 'Wysłuchaj powodu kontroli', o: 'Policjant przedstawia się, podaje stopień i powód zatrzymania. Masz prawo poprosić o legitymację służbową.' },
              { t: 'Okaż dokument tożsamości', o: 'Dowód osobisty, paszport albo dokument w mObywatelu. Spokojnie, bez sporów – zastrzeżenia zgłosisz później.' }
            ]
          }
        ]
      },
      {
        id: 'kto-moze',
        t: 'Kto może Cię zatrzymać',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'policjant w mundurze – wszędzie,',
              'policjant po cywilnemu – tylko w obszarze zabudowanym; musi od razu okazać legitymację, a w nocy używać tarczy lub latarki z czerwonym światłem,',
              'w nocy poza obszarem zabudowanym – tylko umundurowany policjant przy oznakowanym radiowozie,',
              'także inne służby, np. Inspekcja Transportu Drogowego czy Straż Graniczna – w swoim zakresie.'
            ]
          }
        ]
      },
      {
        id: 'dokumenty',
        t: 'Jakie dokumenty musisz mieć',
        bloki: [
          {
            typ: 'p',
            t: 'W Polsce wystarczy dokument tożsamości. Prawa jazdy, dowodu rejestracyjnego i potwierdzenia OC nie musisz wozić – policja sprawdza je w systemie CEPiK. Wyjątek: auta firmowe i sytuacje, w których dane trudno sprawdzić – wtedy papiery przyspieszą kontrolę. Za granicą zawsze potrzebujesz fizycznych dokumentów.'
          }
        ]
      },
      {
        id: 'mandat',
        t: 'Mandat – przyjąć czy nie',
        bloki: [
          {
            typ: 'p',
            t: 'Masz prawo odmówić przyjęcia mandatu. Wtedy policja kieruje wniosek o ukaranie do sądu, który rozpatrzy sprawę – i może wymierzyć karę niższą albo wyższą niż mandat, a do tego doliczyć koszty postępowania.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Przyjęty mandat jest od razu prawomocny. Sąd może go uchylić tylko wtedy, gdy czyn w ogóle nie był wykroczeniem – wniosek trzeba złożyć w ciągu 7 dni.'
          },
          {
            typ: 'p',
            t: 'Policjant może też poprzestać na pouczeniu. Gdy uważasz, że funkcjonariusz złamał przepisy, możesz złożyć skargę – pisemnie lub elektronicznie, najlepiej z opisem i dowodami.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jakie dokumenty trzeba mieć przy kontroli drogowej?', a: 'W Polsce wystarczy dokument tożsamości. Prawo jazdy, dowód rejestracyjny i OC policja sprawdzi w systemie.' },
      { q: 'Czy policjant po cywilnemu może zatrzymać kierowcę?', a: 'Tylko w obszarze zabudowanym i musi od razu okazać legitymację. W nocy poza obszarem zabudowanym zatrzymać może tylko umundurowany policjant.' },
      { q: 'Co się stanie, gdy nie przyjmę mandatu?', a: 'Sprawa trafi do sądu. Sąd może wymierzyć karę niższą lub wyższą niż mandat i obciążyć kosztami postępowania.' }
    ],
    powiazane: ['zgubiony-dowod-rejestracyjny-prawo-jazdy', 'odstep-na-autostradzie', 'jazda-we-mgle'],
    zrodla: [Z.kontrolaInteria, Z.kontrolaCuk, Z.dokumentyKierowcy, Z.kpw]
  },
  {
    slug: 'wyjazd-autem-za-granice',
    kategoria: 'codzienne',
    ikona: 'granica',
    tytul: 'Wyjazd autem za granicę – Zielona Karta, winiety, obowiązkowe wyposażenie',
    krotko: 'Autem za granicę',
    opis: 'Lista rzeczy do sprawdzenia przed wyjazdem samochodem za granicę: dokumenty, Zielona Karta, winiety i wyposażenie wymagane w popularnych krajach.',
    liczby: [
      { w: '8 krajów', o: 'wymaga Zielonej Karty (m.in. Turcja, Albania)' },
      { w: 'papierowe', o: 'prawo jazdy i dowód – mObywatel za granicą nie działa' },
      { w: 'e-winieta', o: 'Czechy, Słowacja, Austria' }
    ],
    sekcje: [
      {
        id: 'dokumenty',
        t: 'Dokumenty',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'fizyczne prawo jazdy – za granicą aplikacja mObywatel nie jest uznawana,',
              'dowód rejestracyjny i potwierdzenie ważnego OC,',
              'dowód osobisty lub paszport dla każdego pasażera,',
              'przy aucie firmowym lub leasingowym – dokument potwierdzający prawo do korzystania z auta.'
            ]
          }
        ]
      },
      {
        id: 'zielona-karta',
        t: 'Zielona Karta',
        bloki: [
          {
            typ: 'p',
            t: 'W krajach Unii Europejskiej, a także m.in. w Norwegii, Szwajcarii, Wielkiej Brytanii, Serbii, Czarnogórze oraz Bośni i Hercegowinie wystarczy polskie OC. Zieloną Kartę musisz mieć w: Albanii, Azerbejdżanie, Maroku, Mołdawii, Macedonii Północnej, Tunezji, Turcji i Ukrainie.'
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'Poproś swojego ubezpieczyciela OC', o: 'Zielonej Karty nie kupuje się osobno – wydaje ją towarzystwo, w którym masz OC. Wiele robi to za darmo, część pobiera kilkanaście–kilkadziesiąt złotych.' },
              { t: 'Sprawdź ważność', o: 'Zielona Karta nie może być ważna dłużej niż Twoja polisa OC.' },
              { t: 'Nie masz jej na granicy?', o: 'Trzeba będzie kupić tzw. OC graniczne. W niektórych krajach (np. Białoruś) to jedyna możliwość.' }
            ]
          }
        ]
      },
      {
        id: 'winiety',
        t: 'Winiety i opłaty za drogi',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'Czechy – elektroniczna winieta na płatne autostrady,',
              'Słowacja – elektroniczna winieta przypisana do numeru rejestracyjnego,',
              'Austria – winieta elektroniczna lub naklejana, a na wybranych odcinkach dodatkowe opłaty,',
              'Włochy i Chorwacja – bez winiet, płacisz na bramkach za przejechany odcinek.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'Winiety kupuj na oficjalnych stronach operatorów albo na stacjach. Pośrednicy w internecie często doliczają wysokie prowizje.'
          }
        ]
      },
      {
        id: 'wyposazenie',
        t: 'Obowiązkowe wyposażenie',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: 'Czechy', o: 'kamizelka, trójkąt, apteczka' },
              { w: 'Słowacja', o: 'kamizelka, trójkąt, apteczka' },
              { w: 'Austria', o: 'kamizelka, trójkąt; zimą zasady dla opon' },
              { w: 'Włochy', o: 'kamizelka, trójkąt; sezonowo łańcuchy' }
            ]
          },
          {
            typ: 'p',
            t: 'Najprościej mieć zawsze w aucie: kamizelki dla wszystkich pasażerów, trójkąt, apteczkę i gaśnicę. Przed wyjazdem sprawdź też przepisy zimowe w krajach na trasie i strefy ograniczonego ruchu w dużych miastach.'
          }
        ]
      }
    ],
    faq: [
      { q: 'W jakich krajach potrzebna jest Zielona Karta?', a: 'M.in. w Albanii, Azerbejdżanie, Maroku, Mołdawii, Macedonii Północnej, Tunezji, Turcji i Ukrainie. W krajach UE wystarczy polskie OC.' },
      { q: 'Czy za granicą wystarczy prawo jazdy w mObywatelu?', a: 'Nie. Za granicą potrzebujesz fizycznego prawa jazdy i dowodu rejestracyjnego.' },
      { q: 'Ile kosztuje Zielona Karta?', a: 'Zależy od ubezpieczyciela OC – wiele firm wydaje ją bezpłatnie, inne pobierają zwykle kilkanaście–kilkadziesiąt złotych.' }
    ],
    powiazane: ['zgubiony-dowod-rejestracyjny-prawo-jazdy', 'awaria-na-autostradzie', 'zima-w-samochodzie'],
    zrodla: [Z.zielonaKarta, Z.wakacjeAutem, Z.dokumentyKierowcy]
  },
  {
    slug: 'zima-w-samochodzie',
    kategoria: 'bezpieczenstwo',
    ikona: 'zima',
    tytul: 'Zima w samochodzie – odśnieżanie, akumulator, odpalanie z kabli',
    krotko: 'Zima w aucie',
    opis: 'Mandat za nieodśnieżone auto, rozładowany akumulator i zamarznięte zamki – jak przygotować auto do zimy i co zrobić, gdy rano nie chce odpalić.',
    liczby: [
      { w: '3000 zł', o: 'mandatu może kosztować nieodśnieżone auto' },
      { w: '1 min', o: 'maks. pracy silnika na postoju w mieście' },
      { w: '4 kroki', o: 'podłączenia kabli rozruchowych' }
    ],
    sekcje: [
      {
        id: 'odsniezanie',
        t: 'Odśnieżanie – co i dlaczego',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'wszystkie szyby i lusterka – kierowca musi mieć dostateczne pole widzenia,',
              'dach i maskę – zsuwający się śnieg i lód zasłoni Ci szybę albo uderzy w auto za Tobą,',
              'światła – zaklejone śniegiem lampy to osobne wykroczenie,',
              'tablice rejestracyjne – muszą być czytelne.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Za jazdę nieodśnieżonym autem mandat może sięgnąć 3000 zł, a do tego dochodzą punkty karne. Nie zostawiaj też pracującego silnika na postoju w terenie zabudowanym dłużej niż minutę – to również wykroczenie.'
          }
        ]
      },
      {
        id: 'kable',
        t: 'Rozładowany akumulator – odpalanie z kabli',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Wyłącz oba auta i odbiorniki', o: 'Ogrzewanie, radio, światła. Ustaw auta tak, żeby się nie stykały.' },
              { t: 'Czerwony kabel: plus – plus', o: 'Najpierw do plusa sprawnego akumulatora, potem do plusa rozładowanego.' },
              { t: 'Czarny kabel: minus – masa', o: 'Do minusa sprawnego akumulatora, a drugi koniec do metalowej, niemalowanej części silnika rozładowanego auta – z dala od akumulatora.' },
              { t: 'Odpal dawcę, potem swoje auto', o: 'Odczekaj kilka minut. Kręć rozrusznikiem kilkanaście sekund, z przerwami – najwyżej 4–5 prób. Odłącz kable w odwrotnej kolejności.' }
            ]
          },
          {
            typ: 'uwaga',
            t: 'Uważaj na iskry przy akumulatorze – może wydzielać łatwopalny wodór. Dawca powinien mieć silnik na to samo paliwo i podobny akumulator. W hybrydzie i elektryku sprawdź w instrukcji, czy wolno odpalać (lub pomagać) z kabli.'
          }
        ]
      },
      {
        id: 'zimowy-zestaw',
        t: 'Co wozić zimą',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'skrobaczkę i miotełkę do śniegu,',
              'zimowy płyn do spryskiwaczy (zapasowy),',
              'kable rozruchowe albo ładowany booster (powerbank rozruchowy),',
              'koc, rękawiczki, latarkę i naładowany powerbank do telefonu,',
              'odmrażacz do zamków – trzymaj go w domu lub w kieszeni, nie w zamarzniętym aucie.'
            ]
          },
          {
            typ: 'p',
            t: 'Zamarzniętych drzwi i szyb nie polewaj gorącą wodą – szyba może pęknąć od różnicy temperatur. Lepiej użyć odmrażacza albo poczekać, aż nawiew rozgrzeje szybę od środka.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jaki jest mandat za nieodśnieżony samochód?', a: 'Może sięgnąć nawet 3000 zł, a do tego dochodzą punkty karne – zależnie od tego, czy chodzi o widoczność, zsuwający się śnieg, światła czy tablice.' },
      { q: 'Jak podłączyć kable rozruchowe?', a: 'Czerwony: plus sprawnego – plus rozładowanego. Czarny: minus sprawnego – masa (metal silnika) w rozładowanym aucie. Odłączasz w odwrotnej kolejności.' },
      { q: 'Czy można odśnieżać auto z włączonym silnikiem?', a: 'W terenie zabudowanym silnik na postoju może pracować najwyżej minutę – dłuższe grzanie auta jest wykroczeniem.' }
    ],
    powiazane: ['jazda-we-mgle', 'awaria-na-autostradzie', 'przeglad-techniczny-terminy-koszt'],
    zrodla: [Z.zimaInteria, Z.kable, Z.prd]
  },
  // ───────────── SPRAWDZANIE AUTA PRZED ZAKUPEM ─────────────
  {
    slug: 'jak-sprawdzic-czy-auto-jest-kradzione',
    kategoria: 'sprawdzenie',
    ikona: 'kradziez',
    tytul: 'Jak sprawdzić, czy auto nie jest kradzione – 6 kroków przed zakupem',
    krotko: 'Czy auto nie jest kradzione',
    opis: 'Zanim zapłacisz za używane auto, sprawdź w kilku miejscach jego numer VIN i dokumenty. Pokazujemy, gdzie patrzeć, jakie sygnały powinny zapalić czerwoną lampkę i co zrobić, gdy coś się nie zgadza.',
    liczby: [
      { w: '17 znaków', o: 'numer VIN – musi być wszędzie taki sam' },
      { w: '0 zł', o: 'sprawdzenie w Historii Pojazdu (gov.pl)' },
      { w: '2 komplety', o: 'kluczyków – brak jednego to sygnał ostrzegawczy' }
    ],
    sekcje: [
      {
        id: 'kroki',
        t: 'Jak sprawdzić auto krok po kroku?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Porównaj VIN w kilku miejscach', o: 'Numer pod przednią szybą, na tabliczce znamionowej (często na słupku drzwi), na nadwoziu i w dowodzie rejestracyjnym (pole E) musi być identyczny. Każda różnica, ślady szlifowania czy przyklejona tabliczka to powód, żeby odpuścić.' },
              { t: 'Sprawdź auto w Historii Pojazdu', o: 'Na historiapojazdu.gov.pl wpisz numer rejestracyjny, VIN i datę pierwszej rejestracji. Porównaj markę, model, silnik i kolor z autem, które oglądasz.' },
              { t: 'Sprawdź OC w bazie UFG', o: 'Na ufg.pl sprawdzisz po numerze rejestracyjnym lub VIN, czy auto ma ważne OC. Brak polisy przy aucie „na co dzień jeżdżonym” jest dziwny.' },
              { t: 'Obejrzyj dokumenty', o: 'Szukaj skreśleń, przeróbek i poprawek w dowodzie rejestracyjnym. Gdy właścicieli jest dwóch, umowę muszą podpisać obaj – pełnomocnictwo łatwo podrobić.' },
              { t: 'Policz kluczyki', o: 'Brak drugiego oryginalnego kluczyka nie musi oznaczać kradzieży, ale zapytaj, co się z nim stało, i uwzględnij to w cenie.' },
              { t: 'Sprawdź historię auta za granicą', o: 'Auta sprowadzone mają historię w bazach innych krajów – płatny raport po VIN pokaże m.in. zgłoszenia kradzieży, szkody i przebiegi spoza Polski.' }
            ]
          },
          {
            typ: 'uwaga',
            t: 'Masz wątpliwości? Pojedź z autem i dokumentami na komisariat policji. Policjanci sprawdzą, czy pojazd nie jest poszukiwany w Polsce lub innym kraju UE, i mogą obejrzeć auto pod kątem śladów włamania.'
          }
        ]
      },
      {
        id: 'sygnaly',
        t: 'Jakie sygnały powinny Cię zaniepokoić?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'cena wyraźnie niższa niż za podobne auta – sprzedawcy zależy na szybkiej transakcji,',
              'sprzedawca nie chce pokazać dowodu osobistego albo dane w umowie nie zgadzają się z dowodem rejestracyjnym,',
              'spotkanie „na parkingu pod marketem”, a nie pod adresem sprzedawcy,',
              'nowe lub nieoryginalne stacyjka, zamki, szyby – ślady wymiany po włamaniu,',
              'brak karty pojazdu, gdy auto powinno ją mieć – wtórnik łatwo zdobyć.'
            ]
          }
        ]
      },
      {
        id: 'kupiles',
        t: 'Co zrobić, gdy okaże się, że kupiłeś kradzione auto?',
        bloki: [
          {
            typ: 'p',
            t: 'Zgłoś to od razu na policji. Auto wraca do prawowitego właściciela – albo do ubezpieczyciela, jeśli ten wypłacił już odszkodowanie z AC. Pieniądze możesz próbować odzyskać od sprzedawcy, ale musisz wykazać, że kupiłeś auto w dobrej wierze. Dlatego zachowaj umowę, potwierdzenie przelewu i korespondencję ze sprzedawcą.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jak za darmo sprawdzić, czy auto nie jest kradzione?', a: 'Porównaj VIN na aucie i w dokumentach, sprawdź auto na historiapojazdu.gov.pl i OC na ufg.pl. W razie wątpliwości policja na komisariacie sprawdzi, czy pojazd nie jest poszukiwany.' },
      { q: 'Gdzie znaleźć numer VIN w samochodzie?', a: 'Zwykle pod przednią szybą od strony kierowcy, na tabliczce znamionowej (najczęściej na słupku drzwi) i na nadwoziu w komorze silnika. W dowodzie rejestracyjnym to pole E.' },
      { q: 'Co się dzieje z kradzionym autem kupionym w dobrej wierze?', a: 'Wraca do właściciela lub ubezpieczyciela. Kupujący może dochodzić zwrotu pieniędzy od sprzedawcy – najlepiej z umową i potwierdzeniem przelewu.' }
    ],
    powiazane: ['numer-vin-co-oznacza', 'oszustwa-przy-zakupie-auta', 'umowa-kupna-sprzedazy-samochodu'],
    zrodla: [Z.kradzioneLink4, Z.historia, Z.ufgStrona]
  },
  {
    slug: 'numer-vin-co-oznacza',
    kategoria: 'sprawdzenie',
    ikona: 'vin',
    tytul: 'Numer VIN – co oznacza 17 znaków i jak go odczytać',
    krotko: 'Co kryje numer VIN',
    opis: 'VIN to „PESEL” auta: 17 znaków, z których odczytasz producenta, a często też model i rok. Wyjaśniamy budowę numeru, gdzie go szukać i dlaczego litery I, O i Q nigdy się w nim nie pojawiają.',
    liczby: [
      { w: '17', o: 'znaków – litery i cyfry' },
      { w: '3 części', o: 'WMI, VDS i VIS' },
      { w: 'bez I, O, Q', o: 'żeby nie mylić ich z 1 i 0' }
    ],
    sekcje: [
      {
        id: 'budowa',
        t: 'Z czego składa się numer VIN?',
        bloki: [
          {
            typ: 'p',
            t: 'VIN (Vehicle Identification Number) ma 17 znaków. W Europie jego budowę opisuje norma ISO 3779. Numer dzieli się na trzy części – przykład poniżej to numer zmyślony, służący tylko do pokazania budowy.'
          },
          {
            typ: 'liczby',
            elementy: [
              { w: 'WVW', o: 'znaki 1–3 (WMI): producent i kraj' },
              { w: 'ZZZ1J', o: 'znaki 4–8 (VDS): opis auta' },
              { w: 'Z', o: 'znak 9: u wielu marek z Europy wypełniacz' },
              { w: 'XW000001', o: 'znaki 10–17 (VIS): rocznik i numer seryjny' }
            ]
          },
          {
            typ: 'kroki',
            elementy: [
              { t: 'WMI – znaki 1–3', o: 'Kod producenta nadawany międzynarodowo. Pierwszy znak zwykle wskazuje region: W – Niemcy, V – Francja, Z – Włochy, T – m.in. Czechy, S – m.in. Wielka Brytania i Polska, Y – Szwecja.' },
              { t: 'VDS – znaki 4–9', o: 'Opis pojazdu według tabel producenta: model, nadwozie, silnik. Każda marka koduje to po swojemu – dlatego darmowe dekodery bywają niedokładne.' },
              { t: 'VIS – znaki 10–17', o: '10. znak to często rok modelowy, a dalej numer seryjny konkretnego egzemplarza. W autach z Europy 10. znak nie zawsze oznacza rok.' }
            ]
          }
        ]
      },
      {
        id: 'wmi',
        t: 'Jakie kody mają popularne marki?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'WVW – Volkswagen (osobowe),',
              'WBA – BMW (osobowe),',
              'WDB – Mercedes-Benz,',
              'TMB – Škoda,',
              'VF1 – Renault, VF3 – Peugeot,',
              'ZFA – Fiat (osobowe),',
              'YV1 – Volvo (osobowe),',
              'SAL – Land Rover,',
              'SUP – FSO (Polska).'
            ]
          },
          {
            typ: 'uwaga',
            t: 'Kod producenta zależy od kraju rejestracji marki, nie zawsze od miejsca produkcji. Przykład: Opel przez lata miał niemiecki kod W0L, także w autach produkowanych poza Niemcami.'
          }
        ]
      },
      {
        id: 'rok',
        t: 'Jak odczytać rok z numeru VIN?',
        bloki: [
          {
            typ: 'p',
            t: 'Jeśli producent koduje rok na 10. pozycji, obowiązuje cykl: od 2001 do 2009 cyfry 1–9, od 2010 litery – A (2010), B (2011), C (2012), D (2013), E (2014), F (2015), G (2016), H (2017), J (2018), K (2019), L (2020), M (2021), N (2022), P (2023), R (2024), S (2025), T (2026). Litery U, Z i cyfra 0 nie są używane na tej pozycji. Kod powtarza się co 30 lat – T oznacza 1996 albo 2026 – więc rok zawsze potwierdź w dokumentach.'
          }
        ]
      },
      {
        id: 'gdzie',
        t: 'Gdzie znaleźć VIN?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'pod przednią szybą, od strony kierowcy,',
              'na tabliczce znamionowej – najczęściej na słupku drzwi lub w komorze silnika,',
              'na nadwoziu (wybity w blasze),',
              'w dowodzie rejestracyjnym – pole E, oraz w karcie pojazdu i polisie OC.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'VIN we wszystkich tych miejscach musi być identyczny. Różnice albo ślady przerabiania numeru to sygnał, że z autem może być coś nie tak – zobacz poradnik o sprawdzaniu, czy auto nie jest kradzione.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Ile znaków ma numer VIN?', a: '17 – wielkie litery i cyfry. Litery I, O i Q nie są używane, żeby nie mylić ich z cyframi 1 i 0.' },
      { q: 'Jak sprawdzić rocznik auta po VIN?', a: 'U wielu producentów rok modelowy koduje 10. znak, np. L to 2020, R to 2024. Kod powtarza się co 30 lat, a część marek z Europy w ogóle go nie używa – rok potwierdź w dokumentach.' },
      { q: 'Czy dekoder VIN pokaże historię auta?', a: 'Nie. Dekoder odczytuje tylko dane z budowy numeru (producent, czasem model i rok). Historię – przebiegi, szkody, kradzieże – pokazuje Historia Pojazdu w gov.pl i płatne raporty.' }
    ],
    powiazane: ['jak-sprawdzic-czy-auto-jest-kradzione', 'cofniety-licznik-jak-sprawdzic-przebieg', 'sprowadzenie-auta-z-zagranicy'],
    zrodla: [Z.vinWiki, Z.vinRankomat, Z.historia]
  },
  {
    slug: 'cofniety-licznik-jak-sprawdzic-przebieg',
    kategoria: 'sprawdzenie',
    ikona: 'licznik',
    tytul: 'Cofnięty licznik – jak sprawdzić prawdziwy przebieg auta',
    krotko: 'Jak rozpoznać cofnięty licznik',
    opis: 'Cofanie licznika to w Polsce przestępstwo, ale nadal się zdarza. Gdzie sprawdzić historię przebiegu, po czym poznać, że coś się nie zgadza, i co zrobić, gdy wyjdzie to po zakupie.',
    liczby: [
      { w: 'do 5 lat', o: 'więzienia za cofnięcie licznika' },
      { w: '2 miejsca', o: 'gdzie spisuje się licznik: przegląd i kontrola drogowa' },
      { w: '1 rok', o: 'od wykrycia wady na reakcję wobec sprzedawcy' }
    ],
    sekcje: [
      {
        id: 'prawo',
        t: 'Czy cofanie licznika jest karalne?',
        bloki: [
          {
            typ: 'p',
            t: 'Tak. Zmiana wskazań licznika to przestępstwo z art. 306a Kodeksu karnego – grozi za nie od 3 miesięcy do 5 lat więzienia. Tak samo odpowiada osoba, która to zleca. Licznik wolno wymienić tylko wtedy, gdy się zepsuł, i trzeba to zgłosić na stacji kontroli pojazdów.'
          }
        ]
      },
      {
        id: 'gdzie-sprawdzic',
        t: 'Gdzie sprawdzić historię przebiegu?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Historia Pojazdu (gov.pl)', o: 'Stan licznika spisuje diagnosta przy każdym przeglądzie (i fotografuje licznik), a od 2020 r. także policja przy kontroli drogowej. Na historiapojazdu.gov.pl zobaczysz te odczyty – przebieg powinien tylko rosnąć.' },
              { t: 'Książka serwisowa i faktury', o: 'Porównaj przebiegi z wpisów. Zadzwoń do serwisu z pieczątki i zapytaj, czy auto faktycznie tam było – pieczątki łatwo podrobić.' },
              { t: 'Raport historii z zagranicy', o: 'Auto sprowadzone ma odczyty z innych krajów. Raport po VIN pokaże przebiegi zapisane np. w niemieckich bazach – tam najczęściej widać „zjazd” licznika przed sprzedażą do Polski.' },
              { t: 'Diagnostyka komputerowa', o: 'Przy droższych i nowszych autach mechanik może odczytać przebieg zapisany w kilku sterownikach – nie zawsze da się go wszędzie „skorygować”.' }
            ]
          }
        ]
      },
      {
        id: 'objawy',
        t: 'Po czym poznać, że przebieg się nie zgadza?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'wytarta kierownica, gałka zmiany biegów i nakładki pedałów przy „niskim” przebiegu,',
              'nowe elementy wnętrza w aucie, które ma rzekomo mało kilometrów – mogą zakrywać zużycie,',
              'zapadnięty fotel kierowcy i wytarte boczki,',
              'brak historii serwisowej albo książka „wypełniona jednym długopisem”,',
              'przebieg w ogłoszeniu wyraźnie niższy niż średnia dla tego rocznika – kilka–kilkanaście tysięcy km rocznie to norma.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'Żaden z tych objawów osobno niczego nie przesądza – ale kilka naraz to mocny sygnał, żeby sprawdzić auto dokładniej albo zrezygnować.'
          }
        ]
      },
      {
        id: 'po-zakupie',
        t: 'Kupiłeś auto z cofniętym licznikiem – co teraz?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zbierz dowody', o: 'Wydruk z Historii Pojazdu, raport po VIN, zdjęcia licznika, ogłoszenie z deklarowanym przebiegiem i umowę.' },
              { t: 'Złóż oświadczenie sprzedawcy', o: 'Na piśmie: odstąpienie od umowy albo obniżenie ceny. Masz na to rok od wykrycia oszustwa, nie od zakupu.' },
              { t: 'Zgłoś sprawę policji', o: 'Cofnięcie licznika to przestępstwo – zawiadomienie pomaga też w sporze cywilnym.' },
              { t: 'Sąd', o: 'Gdy sprzedawca nie zwróci pieniędzy ani nie obniży ceny, możesz dochodzić roszczeń w sądzie.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Jaka jest kara za cofnięcie licznika?', a: 'Od 3 miesięcy do 5 lat więzienia (art. 306a Kodeksu karnego). Tak samo odpowiada zlecający. W wypadku mniejszej wagi sąd może orzec grzywnę lub łagodniejszą karę.' },
      { q: 'Jak sprawdzić przebieg auta za darmo?', a: 'Na historiapojazdu.gov.pl – po numerze rejestracyjnym, VIN i dacie pierwszej rejestracji. Widać tam odczyty licznika z przeglądów i kontroli drogowych.' },
      { q: 'Co zrobić, gdy po zakupie wyjdzie cofnięty licznik?', a: 'W ciągu roku od wykrycia złożyć sprzedawcy oświadczenie o odstąpieniu od umowy albo obniżeniu ceny, zgłosić sprawę policji, a w razie odmowy – iść do sądu.' }
    ],
    powiazane: ['numer-vin-co-oznacza', 'oszustwa-przy-zakupie-auta', 'ile-jest-warte-uzywane-auto'],
    zrodla: [Z.licznikMubi, Z.kk, Z.historia]
  },
  {
    slug: 'oszustwa-przy-zakupie-auta',
    kategoria: 'sprawdzenie',
    ikona: 'oszustwo',
    tytul: 'Oszustwa przy zakupie używanego auta – 10 trików i jak się nie dać',
    krotko: 'Oszustwa przy zakupie auta',
    opis: 'Od fałszywych ogłoszeń z zaliczką, przez „kupno na Niemca”, po podmianę opon przed odbiorem. Najczęstsze triki sprzedawców i proste sposoby, żeby się przed nimi obronić.',
    liczby: [
      { w: '0 zł', o: 'zaliczki za auto, którego nie widziałeś' },
      { w: '1 telefon', o: 'do serwisu z pieczątki wystarczy, by sprawdzić książkę' },
      { w: 'umowa', o: 'zawsze z osobą, z którą naprawdę rozmawiasz' }
    ],
    sekcje: [
      {
        id: 'ogloszenia',
        t: 'Jakie oszustwa zdarzają się w ogłoszeniach?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Auto widmo z zaliczką', o: 'Bardzo atrakcyjna cena, kontakt tylko mailowy, sprzedawca „za granicą” i prośba o kaucję albo opłatę dla „firmy transportowej”. Auto nie istnieje. Nigdy nie wpłacaj pieniędzy za auto, którego nie widziałeś.' },
              { t: 'Handlarz udający osobę prywatną', o: 'Zdjęcia pod ładnym domem, opowieść o „aucie żony”. Zadzwoń i nie mów, o które auto chodzi – jeśli sprzedawca dopytuje, ma ich wiele. Wpisz numer telefonu w wyszukiwarkę.' },
              { t: 'Fałszywe linki do płatności', o: 'Oszuści podsyłają linki do „bezpiecznej płatności” czy „kuriera”, które wyglądają jak strona serwisu ogłoszeniowego. Płać dopiero po obejrzeniu auta i podpisaniu umowy – najlepiej przelewem na konto sprzedawcy, którego dane są w umowie.' }
            ]
          }
        ]
      },
      {
        id: 'przy-ogladaniu',
        t: 'Na co uważać przy oglądaniu i podpisywaniu umowy?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Cofnięty licznik i podrobiona książka', o: 'Porównaj przebieg z Historią Pojazdu i zadzwoń do serwisu z pieczątki.' },
              { t: '„Drobna usterka” za 200 zł', o: 'Kontrolka silnika, airbag, klimatyzacja „do nabicia”. Gdyby naprawa była tania, sprzedawca by ją zrobił. Zleć diagnozę przed zakupem.' },
              { t: '„Kupno na Niemca”', o: 'Umowa z danymi poprzedniego właściciela, którego nigdy nie widziałeś. W razie problemów nie masz kogo pozwać. Podpisuj umowę tylko z osobą, która faktycznie sprzedaje.' },
              { t: 'Zaniżona cena w umowie', o: '„Wpiszmy mniej, zapłacisz mniejszy podatek”. Ryzykujesz kłopoty w urzędzie skarbowym, a przy szkodzie i sporze ze sprzedawcą liczy się kwota z umowy.' },
              { t: 'Podmiana części przed odbiorem', o: 'Nowe opony czy akumulator przy oglądaniu, zużyte przy odbiorze. Zrób zdjęcia przy oględzinach i porównaj je w dniu zakupu.' },
              { t: 'Sztuczny tłok', o: '„Ktoś już dzwonił, jutro przyjeżdża”. Presja czasu ma wyłączyć ostrożność – nie decyduj w pośpiechu.' },
              { t: 'Nieopłacone OC', o: 'Polisa ważna, ale opłacona w jednej racie. Po zakupie zadzwoń do ubezpieczyciela i zapytaj o płatności.' }
            ]
          }
        ]
      },
      {
        id: 'slownik',
        t: 'Co naprawdę znaczą zwroty z ogłoszeń?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              '„bezwypadkowy” – nie widać śladów wypadku na pierwszy rzut oka, to nie gwarancja,',
              '„garażowany” – ozdobnik, nic nie mówi o stanie auta,',
              '„klima do nabicia” – klimatyzacja nie działa, a gaz zwykle ucieka przez nieszczelność,',
              '„serwisowany w ASO” – dopytaj, czy tylko w okresie gwarancji.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Czy wpłacać zaliczkę za używane auto?', a: 'Nie za auto, którego nie widziałeś. Fałszywe ogłoszenia z prośbą o zaliczkę lub opłatę za transport to jedno z najczęstszych oszustw.' },
      { q: 'Co to jest kupno „na Niemca”?', a: 'Umowa z danymi poprzedniego właściciela zamiast faktycznego sprzedawcy. Kupujący traci możliwość dochodzenia roszczeń wobec osoby, która naprawdę sprzedała auto.' },
      { q: 'Jak sprawdzić, czy sprzedawca to handlarz?', a: 'Zadzwoń i nie podawaj, o które auto chodzi – handlarz dopyta. Wpisz numer telefonu w wyszukiwarkę i sprawdź inne ogłoszenia z tym numerem.' }
    ],
    powiazane: ['jak-sprawdzic-czy-auto-jest-kradzione', 'cofniety-licznik-jak-sprawdzic-przebieg', 'umowa-kupna-sprzedazy-samochodu'],
    zrodla: [Z.oszustwaAutoSwiat, Z.historia]
  },
  {
    slug: 'ile-jest-warte-uzywane-auto',
    kategoria: 'sprawdzenie',
    ikona: 'cena',
    tytul: 'Ile jest warte używane auto? Jak sprawdzić, czy cena jest uczciwa',
    krotko: 'Uczciwa cena używanego auta',
    opis: 'Jak porównać ogłoszenia, kiedy warto zapłacić za wycenę z bazy Eurotax lub Info-Ekspert i które cechy auta najbardziej zmieniają jego wartość.',
    liczby: [
      { w: '20–30', o: 'podobnych ogłoszeń warto porównać' },
      { w: '2 bazy', o: 'wycen używane przez ubezpieczycieli' },
      { w: 'płatne', o: 'wyceny z Eurotax i Info-Ekspert dla osób prywatnych' }
    ],
    sekcje: [
      {
        id: 'porownanie',
        t: 'Jak samodzielnie oszacować cenę?',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Zawęź porównanie', o: 'Ten sam model, generacja, silnik, skrzynia i rocznik ±1 rok. Porównuj kilkanaście–kilkadziesiąt ogłoszeń, nie trzy.' },
              { t: 'Odrzuć skrajności', o: 'Najtańsze oferty bywają rozbite lub „z niespodzianką”, najdroższe – życzeniowe. Patrz na środek stawki.' },
              { t: 'Pamiętaj, że ogłoszenie to nie cena sprzedaży', o: 'Ceny w ogłoszeniach zwykle zostawiają miejsce na negocjacje.' },
              { t: 'Skoryguj o stan i historię', o: 'Wyższy przebieg, szkody, brak historii serwisowej i braki w wyposażeniu obniżają wartość. Udokumentowana historia i jeden właściciel w Polsce – podnoszą.' }
            ]
          }
        ]
      },
      {
        id: 'bazy',
        t: 'Eurotax i Info-Ekspert – czy warto?',
        bloki: [
          {
            typ: 'p',
            t: 'To bazy wartości aut, z których korzystają ubezpieczyciele i rzeczoznawcy – m.in. przy szkodzie całkowitej czy ustalaniu sumy ubezpieczenia AC. Osoba prywatna też może zamówić wycenę, ale jest płatna. Podajesz w niej m.in. VIN lub numer rejestracyjny, datę pierwszej rejestracji i przebieg. Przy droższym aucie albo sporze z ubezpieczycielem taka wycena bywa warta swojej ceny.'
          }
        ]
      },
      {
        id: 'co-wplywa',
        t: 'Co najbardziej wpływa na wartość auta?',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'rocznik i data pierwszej rejestracji,',
              'przebieg – zgodny z historią, nie tylko z licznikiem,',
              'wersja silnika i wyposażenia,',
              'stan techniczny i lakieru,',
              'historia szkód i napraw – sprawdzona w raporcie, nie tylko „na słowo”,',
              'popularność modelu – im więcej aut na rynku, tym łatwiej o części i kupca.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'W atlasie MotoRaport sprawdzisz, ile egzemplarzy danego modelu jeździ w Polsce według CEPiK – popularny model łatwiej później sprzedać.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Jak sprawdzić, czy cena używanego auta jest uczciwa?', a: 'Porównaj kilkanaście–kilkadziesiąt ogłoszeń tego samego modelu, silnika i rocznika, odrzuć skrajne oferty i skoryguj cenę o przebieg, historię szkód i wyposażenie.' },
      { q: 'Czy można za darmo wycenić auto w Eurotax?', a: 'Nie. Wycena z baz Eurotax i Info-Ekspert dla osób prywatnych jest płatna.' },
      { q: 'Co obniża wartość używanego auta?', a: 'Wysoki lub niepewny przebieg, historia szkód, brak dokumentacji serwisowej, braki w wyposażeniu i zły stan techniczny lub lakieru.' }
    ],
    powiazane: ['cofniety-licznik-jak-sprawdzic-przebieg', 'oszustwa-przy-zakupie-auta', 'kupilem-auto-co-dalej'],
    zrodla: [Z.eurotax, Z.oszustwaAutoSwiat]
  }
];

// ───────────── Publikacja co tydzień ─────────────
// Nowe poradniki mają datę publikacji z pliku data/harmonogram-poradnikow.json.
// Strona buduje się co najmniej raz w tygodniu (automat „Publikacja poradników” w GitHubie) i wtedy pokazuje te, których dzień już nadszedł.
export function dzisWarszawa(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
}
const NOWE_Z_DATA: Poradnik[] = NOWE.map((p) => ({ ...p, publikacja: (HARMONOGRAM as Record<string, string>)[p.slug] || '2099-01-01' }));

/** Wszystkie poradniki, także zaplanowane na przyszłość (tylko do podglądu i automatów) */
export const WSZYSTKIE_PORADNIKI: Poradnik[] = [...STALE, ...NOWE_Z_DATA];

/** Poradniki widoczne na stronie – opublikowane do dziś */
export const PORADNIKI: Poradnik[] = WSZYSTKIE_PORADNIKI.filter((p) => !p.publikacja || p.publikacja <= dzisWarszawa());

export function poradnik(slug: string): Poradnik | undefined {
  return PORADNIKI.find((p) => p.slug === slug);
}

export function poradnikiKategorii(k: KategoriaPoradnika): Poradnik[] {
  return PORADNIKI.filter((p) => p.kategoria === k);
}

// ───────────── SEO i podsumowania ─────────────
// seoTytul: krótszy tytuł do Google (z dopiskiem „| MotoRaport” mieści się w ok. 60 znakach).
// seoOpis: opis w wynikach wyszukiwania (ok. 140–160 znaków). skrot: 3 zdania „W skrócie” na górze strony.
export const AKTUALIZACJA = '2026-11-04';
export const OPUBLIKOWANO = '2026-11-03';

export function dataPublikacji(p: Poradnik): string {
  return p.publikacja || OPUBLIKOWANO;
}
export function dataAktualizacji(p: Poradnik): string {
  return p.publikacja && p.publikacja > AKTUALIZACJA ? p.publikacja : AKTUALIZACJA;
}
/** Najnowsze opublikowane poradniki (od najnowszego) */
export function najnowszePoradniki(ile = 3): Poradnik[] {
  return [...PORADNIKI].map((p, i) => ({ p, i })).sort((a, b) => dataPublikacji(b.p).localeCompare(dataPublikacji(a.p)) || b.i - a.i).slice(0, ile).map((x) => x.p);
}

const DODATKI: Record<string, { seoTytul: string; seoOpis: string; skrot: string[] }> = {
  ...NOWE_DODATKI,
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
  'sprowadzenie-auta-z-zagranicy': {
    seoTytul: 'Auto z Niemiec – akcyza, rejestracja, koszty',
    seoOpis: 'Jak sprowadzić auto z Niemiec i UE: akcyza 3,1% lub 18,6% (deklaracja w 14 dni), VAT-25, tłumaczenia, badanie i rejestracja w 30 dni. Koszty i terminy.',
    skrot: [
      'Akcyzę deklarujesz w 14 dni od zakupu: 3,1% przy silniku do 2,0 l, 18,6% powyżej, hybrydy mniej, elektryki 0%.',
      'Do rejestracji potrzebujesz tłumaczeń przysięgłych, VAT-25, potwierdzenia akcyzy i polskiego przeglądu.',
      'Na rejestrację masz 30 dni od wjazdu do Polski – spóźnienie kosztuje 500 zł.'
    ]
  },
  'darowizna-samochodu': {
    seoTytul: 'Darowizna samochodu w rodzinie – umowa i SD-Z2',
    seoOpis: 'Darowizna auta dla dziecka, rodziców czy rodzeństwa bez podatku: zgłoszenie SD-Z2 w 6 miesięcy, wzór umowy darowizny samochodu do druku i rejestracja.',
    skrot: [
      'Najbliższa rodzina nie płaci podatku – pod warunkiem zgłoszenia SD-Z2 w ciągu 6 miesięcy.',
      'Wystarczy pisemna umowa w dwóch egzemplarzach, bez notariusza i bez PCC.',
      'Obdarowany rejestruje auto w 30 dni, a darczyńca zgłasza zbycie – też w 30 dni.'
    ]
  },
  'odszkodowanie-z-oc-sprawcy': {
    seoTytul: 'Odszkodowanie z OC sprawcy – terminy i porady',
    seoOpis: 'Jak zgłosić szkodę z OC sprawcy, ile ubezpieczyciel ma czasu na wypłatę (30/90 dni), kiedy należy się auto zastępcze i co zrobić przy zaniżonej wycenie.',
    skrot: [
      'Ubezpieczyciel ma 30 dni na wypłatę – dłużej tylko z pisemnym wyjaśnieniem, maksymalnie do 90 dni.',
      'Auto zastępcze należy się także osobie prywatnej – na czas naprawy albo do wypłaty przy szkodzie całkowitej.',
      'Zaniżona wycena? Reklamacja z własnym kosztorysem, potem Rzecznik Finansowy lub sąd.'
    ]
  },
  'odszkodowanie-za-dziure-w-drodze': {
    seoTytul: 'Odszkodowanie za dziurę w drodze – wzór pisma',
    seoOpis: 'Dziura uszkodziła oponę lub felgę? Jak udokumentować szkodę, kto jest zarządcą drogi i jak napisać wniosek o odszkodowanie – gotowy wzór do druku.',
    skrot: [
      'Zrób zdjęcia dziury ze skalą, otoczenia i uszkodzeń, wezwij policję lub straż miejską.',
      'Ustal zarządcę: gmina, powiat, województwo albo GDDKiA – to do niego piszesz wniosek.',
      'Na zgłoszenie masz co do zasady 3 lata, ale szybkie zgłoszenie łatwiej udowodnić.'
    ]
  },
  'przeglad-techniczny-terminy-koszt': {
    seoTytul: 'Przegląd techniczny 2026 – cena, terminy, kary',
    seoOpis: 'Ile kosztuje przegląd samochodu w 2026 r. (149 zł, z LPG 245 zł), kiedy robić badanie nowego auta, co przy negatywnym wyniku i czym grozi jazda bez przeglądu.',
    skrot: [
      'Badanie auta osobowego kosztuje 149 zł, z instalacją LPG 245 zł – za spóźnienie nie ma dopłaty.',
      'Nowe auto: pierwszy przegląd po 3 latach, drugi po 2, potem co rok. Auta z LPG – zawsze co roku.',
      'Bez ważnego przeglądu grozi mandat i zatrzymanie dowodu, a AC może odmówić wypłaty.'
    ]
  },
  'zgubiony-dowod-rejestracyjny-prawo-jazdy': {
    seoTytul: 'Zgubiony dowód rejestracyjny lub prawo jazdy',
    seoOpis: 'Co zrobić po zgubieniu dowodu rejestracyjnego lub prawa jazdy: gdzie zgłosić, ile kosztuje wtórnik (100 zł za prawo jazdy), ile się czeka i czy można jeździć.',
    skrot: [
      'Wtórnik dowodu rejestracyjnego: wniosek w 30 dni, na czas oczekiwania pozwolenie czasowe.',
      'Wtórnik prawa jazdy: 100 zł, wniosek online lub w urzędzie, zwykle do 9 dni roboczych.',
      'Kradzież zgłaszasz najpierw na policji. Za granicę potrzebujesz papierowych dokumentów.'
    ]
  },
  'kontrola-drogowa-prawa-kierowcy': {
    seoTytul: 'Kontrola drogowa – prawa i obowiązki kierowcy',
    seoOpis: 'Jak zachować się podczas kontroli drogowej, jakie dokumenty trzeba mieć, kiedy może zatrzymać policjant po cywilnemu i co się dzieje po odmowie przyjęcia mandatu.',
    skrot: [
      'Zostań w aucie, uchyl szybę i trzymaj ręce na kierownicy. Wysiadasz tylko na polecenie.',
      'W Polsce wystarczy dokument tożsamości – resztę policja sprawdzi w systemie.',
      'Możesz odmówić mandatu – wtedy decyduje sąd. Przyjęty mandat jest od razu prawomocny.'
    ]
  },
  'wyjazd-autem-za-granice': {
    seoTytul: 'Autem za granicę – Zielona Karta i winiety',
    seoOpis: 'Gdzie potrzebna jest Zielona Karta, jakie dokumenty zabrać, które kraje mają winiety elektroniczne i jakie wyposażenie jest obowiązkowe w Czechach czy Austrii.',
    skrot: [
      'Za granicę zabierz papierowe prawo jazdy i dowód rejestracyjny – mObywatel tam nie działa.',
      'Zielona Karta jest potrzebna m.in. w Turcji, Albanii, Ukrainie i Maroku. W UE wystarczy polskie OC.',
      'Czechy, Słowacja i Austria mają winiety elektroniczne – kupuj je na oficjalnych stronach.'
    ]
  },
  'zima-w-samochodzie': {
    seoTytul: 'Zima w aucie – odśnieżanie, mandat, kable',
    seoOpis: 'Mandat za nieodśnieżone auto (nawet 3000 zł), jak bezpiecznie odpalić auto z kabli krok po kroku i co wozić zimą w samochodzie. Porady na mroźny poranek.',
    skrot: [
      'Odśnieżasz szyby, dach, światła i tablice – za nieodśnieżone auto grozi nawet 3000 zł.',
      'Kable: czerwony plus–plus, czarny minus–masa. Odłączasz w odwrotnej kolejności.',
      'W mieście silnik na postoju może pracować najwyżej minutę – auta nie grzejemy na postoju.'
    ]
  },
  'jak-sprawdzic-czy-auto-jest-kradzione': {
    seoTytul: 'Jak sprawdzić, czy auto nie jest kradzione',
    seoOpis: 'Sprawdź auto przed zakupem: VIN w kilku miejscach, Historia Pojazdu i UFG za darmo, dokumenty, kluczyki. Sygnały ostrzegawcze i co zrobić, gdy auto jest kradzione.',
    skrot: [
      'Numer VIN na szybie, tabliczce, nadwoziu i w dowodzie musi być identyczny – każda różnica to powód, żeby odpuścić.',
      'Za darmo sprawdzisz auto na historiapojazdu.gov.pl i OC na ufg.pl. W razie wątpliwości – komisariat policji.',
      'Zbyt niska cena, spotkanie „pod marketem” i brak drugiego kluczyka to sygnały ostrzegawcze.'
    ]
  },
  'numer-vin-co-oznacza': {
    seoTytul: 'Numer VIN – co oznacza i jak go odczytać',
    seoOpis: 'Budowa numeru VIN: 17 znaków, kod producenta (WMI), opis auta (VDS) i numer seryjny (VIS). Jak odczytać rok z 10. znaku, kody popularnych marek i gdzie szukać VIN.',
    skrot: [
      'VIN ma 17 znaków: kod producenta (1–3), opis auta (4–9) i numer egzemplarza (10–17).',
      '10. znak często oznacza rok modelowy (np. L – 2020, R – 2024), ale kod powtarza się co 30 lat.',
      'Litery I, O i Q nigdy nie występują w VIN – to częsty sposób, by wyłapać pomyłkę lub fałszerstwo.'
    ]
  },
  'cofniety-licznik-jak-sprawdzic-przebieg': {
    seoTytul: 'Cofnięty licznik – jak sprawdzić przebieg auta',
    seoOpis: 'Jak rozpoznać cofnięty licznik i sprawdzić prawdziwy przebieg: Historia Pojazdu, książka serwisowa, raport po VIN. Kara do 5 lat i co zrobić po zakupie takiego auta.',
    skrot: [
      'Cofanie licznika to przestępstwo – grozi do 5 lat więzienia, także zlecającemu.',
      'Odczyty licznika z przeglądów i kontroli drogowych sprawdzisz za darmo na historiapojazdu.gov.pl.',
      'Po zakupie masz rok od wykrycia oszustwa, by odstąpić od umowy albo żądać obniżenia ceny.'
    ]
  },
  'oszustwa-przy-zakupie-auta': {
    seoTytul: 'Oszustwa przy zakupie auta – jak się nie dać',
    seoOpis: 'Najczęstsze oszustwa przy zakupie używanego auta: fałszywe ogłoszenia z zaliczką, kupno „na Niemca”, cofnięty licznik, podmiana części. Jak się bronić krok po kroku.',
    skrot: [
      'Nie wpłacaj zaliczki za auto, którego nie widziałeś – „auta widmo” to częsta pułapka.',
      'Umowę podpisuj tylko z osobą, która faktycznie sprzedaje – nie „na Niemca”.',
      'Sfotografuj auto przy oględzinach i porównaj w dniu odbioru – opony i akumulator potrafią „zniknąć”.'
    ]
  },
  'ile-jest-warte-uzywane-auto': {
    seoTytul: 'Ile jest warte używane auto – uczciwa cena',
    seoOpis: 'Czy cena używanego auta jest uczciwa? Porównanie ogłoszeń krok po kroku, wycena Eurotax i Info-Ekspert oraz cechy, które najbardziej zmieniają wartość auta.',
    skrot: [
      'Porównaj kilkanaście–kilkadziesiąt ogłoszeń tego samego modelu, silnika i rocznika – i patrz na środek stawki.',
      'Cena z ogłoszenia to nie cena sprzedaży – zwykle jest w niej miejsce na negocjacje.',
      'Eurotax i Info-Ekspert to bazy ubezpieczycieli – wycena dla osoby prywatnej jest płatna.'
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
