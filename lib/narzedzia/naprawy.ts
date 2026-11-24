// Typowe drogie naprawy w używanych autach – koszty, objawy i przebiegi, przy których zwykle się pojawiają.
// Wspólne dane dla dwóch narzędzi: „Ile zbić z ceny auta?” i „Kalendarz drogich napraw”.
// KOSZTY to orientacyjne widełki 2026 r. (części + robocizna, warsztat średniej półki, popularne auto),
// na podstawie cenników kb.pl (I 2026), cenauslug.pl (2026) i Auto Świata. Auta premium i rzadkie silniki bywają droższe.
// PRZEBIEGI to typowe zakresy z zaleceń serwisowych i praktyki warsztatów – zawsze ważniejsza jest instrukcja konkretnego auta.

export const STAN_NAPRAW = 'listopad 2026';

export type Dotyczy = 'wszystkie' | 'diesel' | 'turbo' | 'automat' | 'pasek' | 'lancuch' | 'manual';

export interface Naprawa {
  id: string;
  /** do adresu podstrony */
  slug: string;
  nazwa: string;
  /** krótka nazwa do tabel */
  krotko: string;
  kosztOd: number;
  kosztDo: number;
  objawy: string[];
  /** jak to sprawdzić na oględzinach / jazdzie próbnej */
  sprawdz: string[];
  dotyczy: Dotyczy;
  /** przebieg, przy którym zwykle trzeba się z tym liczyć (pierwszy raz) */
  odKm?: number;
  doKm?: number;
  /** powtarza się co tyle km (np. pasek rozrządu) */
  coKm?: number;
  /** albo co tyle lat */
  coLat?: number;
  /** fraza do wyszukiwarki części */
  fraza?: string;
}

export const DOTYCZY_OPIS: Record<Dotyczy, string> = {
  wszystkie: 'każde auto',
  diesel: 'diesle',
  turbo: 'silniki z turbo',
  automat: 'automatyczne skrzynie dwusprzęgłowe',
  pasek: 'silniki z paskiem rozrządu',
  lancuch: 'silniki z łańcuchem rozrządu',
  manual: 'manualne skrzynie biegów'
};

export const NAPRAWY: Naprawa[] = [
  {
    id: 'rozrzad-pasek', slug: 'rozrzad-pasek', nazwa: 'Wymiana paska rozrządu z pompą wody', krotko: 'Pasek rozrządu', kosztOd: 900, kosztDo: 2500,
    objawy: ['brak faktury lub naklejki z datą i przebiegiem wymiany', 'pisk lub szum z przodu silnika', 'wyciek płynu chłodniczego przy pompie wody'],
    sprawdz: ['poproś o fakturę za ostatnią wymianę (data i przebieg)', 'poszukaj naklejki pod maską', 'jeśli dokumentów brak – licz, że wymiana jest do zrobienia od razu'],
    dotyczy: 'pasek', odKm: 90000, doKm: 150000, coKm: 120000, coLat: 6, fraza: 'zestaw rozrządu'
  },
  {
    id: 'rozrzad-lancuch', slug: 'rozrzad-lancuch', nazwa: 'Wymiana rozciągniętego łańcucha rozrządu', krotko: 'Łańcuch rozrządu', kosztOd: 2500, kosztDo: 6000,
    objawy: ['grzechotanie przez kilka sekund po zimnym starcie', 'kontrolka silnika i błędy faz rozrządu', 'nierówna praca na wolnych obrotach'],
    sprawdz: ['uruchom silnik na zimno (poproś, żeby sprzedający go nie rozgrzewał)', 'odczytaj błędy komputerem – kody faz rozrządu (np. P0016) to sygnał ostrzegawczy'],
    dotyczy: 'lancuch', odKm: 150000, doKm: 250000, fraza: 'łańcuch rozrządu'
  },
  {
    id: 'sprzeglo-dwumas', slug: 'sprzeglo-i-dwumasa', nazwa: 'Sprzęgło z kołem dwumasowym', krotko: 'Sprzęgło + dwumasa', kosztOd: 2500, kosztDo: 5500,
    objawy: ['drgania przy ruszaniu', 'stuki i metaliczne grzechotanie na wolnych obrotach', 'sprzęgło „łapie” wysoko', 'szarpanie przy przyspieszaniu na wysokim biegu z niskich obrotów'],
    sprawdz: ['ruszaj na płaskim i pod górkę', 'na 4. lub 5. biegu przy niskich obrotach dodaj gazu – sprzęgło nie może się ślizgać', 'posłuchaj silnika na luzie przy wciśniętym i puszczonym sprzęgle'],
    dotyczy: 'manual', odKm: 150000, doKm: 250000, fraza: 'koło dwumasowe sprzęgło'
  },
  {
    id: 'sprzeglo', slug: 'sprzeglo', nazwa: 'Wymiana sprzęgła (bez dwumasy)', krotko: 'Sprzęgło', kosztOd: 1000, kosztDo: 2000,
    objawy: ['sprzęgło łapie wysoko', 'obroty rosną, a auto nie przyspiesza', 'zapach spalenizny po ruszaniu pod górę'],
    sprawdz: ['próba na wysokim biegu z niskich obrotów', 'ruszanie pod górkę'],
    dotyczy: 'manual', odKm: 150000, doKm: 250000, fraza: 'zestaw sprzęgła'
  },
  {
    id: 'dpf', slug: 'filtr-dpf', nazwa: 'Czyszczenie lub wymiana filtra DPF', krotko: 'Filtr DPF', kosztOd: 600, kosztDo: 5000,
    objawy: ['kontrolka DPF albo tryb awaryjny', 'częste wypalanie (wentylator chodzi po wyłączeniu silnika)', 'spadek mocy', 'filtr wycięty – zakazane, auto nie powinno przejść badania'],
    sprawdz: ['odczytaj komputerem stopień zapchania filtra i liczbę wypaleń', 'zapytaj, czy auto jeździło w trasy, czy tylko po mieście', 'sprawdź, czy filtra nie usunięto (poproś diagnostę)'],
    dotyczy: 'diesel', odKm: 150000, doKm: 250000, fraza: 'filtr DPF'
  },
  {
    id: 'turbo', slug: 'turbosprezarka', nazwa: 'Regeneracja lub wymiana turbosprężarki', krotko: 'Turbosprężarka', kosztOd: 1500, kosztDo: 4000,
    objawy: ['gwizd lub wycie przy przyspieszaniu', 'niebieski dym', 'olej w przewodach dolotowych', 'brak mocy i tryb awaryjny'],
    sprawdz: ['na jeździe próbnej przyspiesz mocno na 3. biegu', 'zajrzyj do rury dolotowej po odpięciu (jeśli sprzedający pozwoli) – dużo oleju to zły znak'],
    dotyczy: 'turbo', odKm: 180000, doKm: 300000, fraza: 'turbosprężarka'
  },
  {
    id: 'wtryski', slug: 'wtryskiwacze-diesel', nazwa: 'Regeneracja wtryskiwaczy (diesel)', krotko: 'Wtryskiwacze', kosztOd: 1500, kosztDo: 4500,
    objawy: ['trudny rozruch, szczególnie na ciepłym silniku', 'czarny dym', 'nierówna praca i szarpanie', 'zapach paliwa w kabinie'],
    sprawdz: ['zapal silnik na zimno i na ciepło', 'poproś diagnostę o odczyt korekt wtryskiwaczy'],
    dotyczy: 'diesel', odKm: 200000, doKm: 300000, fraza: 'wtryskiwacz'
  },
  {
    id: 'egr', slug: 'zawor-egr', nazwa: 'Czyszczenie lub wymiana zaworu EGR', krotko: 'Zawór EGR', kosztOd: 800, kosztDo: 2200,
    objawy: ['szarpanie przy niskich obrotach', 'kontrolka silnika', 'czarny dym', 'gaśnięcie na postoju'],
    sprawdz: ['odczytaj błędy komputerem'],
    dotyczy: 'diesel', odKm: 150000, doKm: 250000, fraza: 'zawór EGR'
  },
  {
    id: 'uszczelka', slug: 'uszczelka-pod-glowica', nazwa: 'Wymiana uszczelki pod głowicą', krotko: 'Uszczelka pod głowicą', kosztOd: 1500, kosztDo: 3500,
    objawy: ['ubywa płynu chłodniczego bez widocznego wycieku', 'biały, słodkawy dym z rury wydechowej', 'masa przypominająca majonez pod korkiem oleju', 'przegrzewanie się silnika'],
    sprawdz: ['zajrzyj pod korek wlewu oleju i do zbiorniczka płynu', 'zobacz, czy wskazówka temperatury nie rośnie w korkach'],
    dotyczy: 'wszystkie', fraza: 'uszczelka pod głowicę'
  },
  {
    id: 'dsg', slug: 'skrzynia-dsg', nazwa: 'Naprawa skrzyni dwusprzęgłowej (sprzęgło lub mechatronika)', krotko: 'Skrzynia DSG', kosztOd: 2700, kosztDo: 7000,
    objawy: ['szarpanie przy ruszaniu i zmianie biegów 1–2', 'stuki przy zmianie biegów', 'migająca kontrolka skrzyni, tryb awaryjny'],
    sprawdz: ['ruszaj delikatnie wiele razy w korku i na parkingu', 'cofaj pod górkę', 'zapytaj o wymianę oleju w skrzyni (co ok. 60 tys. km w wielu skrzyniach z mokrym sprzęgłem)'],
    dotyczy: 'automat', odKm: 150000, doKm: 250000, fraza: 'sprzęgło DSG'
  },
  {
    id: 'zawieszenie', slug: 'zawieszenie', nazwa: 'Naprawa przedniego zawieszenia (wahacze, łączniki, amortyzatory)', krotko: 'Zawieszenie', kosztOd: 800, kosztDo: 2500,
    objawy: ['stuki na nierównościach', 'auto ściąga lub pływa', 'nierówno starte opony'],
    sprawdz: ['jedź po kostce lub progach zwalniających z otwartą szybą', 'obejrzyj wewnętrzne krawędzie opon'],
    dotyczy: 'wszystkie', odKm: 120000, doKm: 200000, fraza: 'wahacz'
  },
  {
    id: 'hamulce', slug: 'hamulce', nazwa: 'Tarcze i klocki hamulcowe (jedna oś)', krotko: 'Hamulce', kosztOd: 500, kosztDo: 1100,
    objawy: ['bicie kierownicy przy hamowaniu', 'pisk lub tarcie', 'wyraźny rant na krawędzi tarczy'],
    sprawdz: ['zahamuj mocno z ok. 60 km/h', 'obejrzyj tarcze przez szprychy felg'],
    dotyczy: 'wszystkie', odKm: 60000, doKm: 100000, coKm: 70000, fraza: 'tarcze klocki hamulcowe'
  },
  {
    id: 'klimatyzacja', slug: 'klimatyzacja', nazwa: 'Naprawa klimatyzacji (szczelność, sprężarka)', krotko: 'Klimatyzacja', kosztOd: 300, kosztDo: 3500,
    objawy: ['klimatyzacja nie chłodzi', 'hałas po włączeniu sprężarki', 'nieprzyjemny zapach z nawiewów'],
    sprawdz: ['włącz klimatyzację na najniższą temperaturę – po kilku minutach z nawiewów powinno wiać wyraźnie zimne powietrze'],
    dotyczy: 'wszystkie', fraza: 'sprężarka klimatyzacji'
  },
  {
    id: 'korozja', slug: 'korozja-progi', nazwa: 'Naprawa korozji (progi, nadkola) z lakierowaniem', krotko: 'Korozja', kosztOd: 800, kosztDo: 3000,
    objawy: ['pęcherze lakieru na progach i nadkolach', 'rdza na krawędziach drzwi i klapy', 'świeży baranek na progach'],
    sprawdz: ['obejrzyj progi od spodu i nadkola z latarką', 'zajrzyj pod wykładzinę bagażnika i do wnęki koła zapasowego'],
    dotyczy: 'wszystkie', fraza: 'próg'
  },
  {
    id: 'lakier', slug: 'lakierowanie-elementu', nazwa: 'Lakierowanie jednego elementu', krotko: 'Lakier (1 element)', kosztOd: 600, kosztDo: 1200,
    objawy: ['głębokie rysy i odpryski', 'wgniecenia', 'różnica odcienia między elementami'],
    sprawdz: ['zmierz grubość lakieru miernikiem', 'oglądaj auto w świetle dziennym, pod kątem'],
    dotyczy: 'wszystkie'
  },
  {
    id: 'opony', slug: 'opony', nazwa: 'Komplet nowych opon', krotko: 'Opony (4 szt.)', kosztOd: 1200, kosztDo: 2800,
    objawy: ['bieżnik poniżej 3–4 mm', 'opony starsze niż 6–8 lat (kod DOT)', 'pęknięcia na bokach', 'różne opony na jednej osi'],
    sprawdz: ['zmierz bieżnik (prawny minimum to 1,6 mm)', 'sprawdź kod DOT – ostatnie 4 cyfry to tydzień i rok produkcji'],
    dotyczy: 'wszystkie', odKm: 40000, doKm: 60000, coKm: 50000, fraza: 'opony'
  },
  {
    id: 'akumulator', slug: 'akumulator', nazwa: 'Nowy akumulator', krotko: 'Akumulator', kosztOd: 400, kosztDo: 900,
    objawy: ['silnik kręci powoli przy rozruchu', 'akumulator starszy niż 5–6 lat', 'auto z systemem start-stop wyłącza go na stałe'],
    sprawdz: ['zobacz datę na obudowie', 'poproś o pomiar akumulatora testerem'],
    dotyczy: 'wszystkie', coLat: 5, fraza: 'akumulator'
  },
  {
    id: 'szyba', slug: 'szyba-przednia', nazwa: 'Wymiana przedniej szyby', krotko: 'Przednia szyba', kosztOd: 900, kosztDo: 2500,
    objawy: ['pęknięcie lub odprysk w polu widzenia kierowcy', 'mocno piaskowana szyba (także sygnał dużego przebiegu)'],
    sprawdz: ['obejrzyj szybę pod światło', 'sprawdź, czy auto ma kamerę przy lusterku – kalibracja podnosi koszt'],
    dotyczy: 'wszystkie', fraza: 'szyba czołowa'
  },
  {
    id: 'serwis', slug: 'zalegly-serwis', nazwa: 'Zaległy serwis (olej, filtry, płyny)', krotko: 'Zaległy serwis', kosztOd: 500, kosztDo: 1200,
    objawy: ['brak książki serwisowej i faktur', 'ciemny, gęsty olej', 'stary płyn hamulcowy'],
    sprawdz: ['wyjmij bagnet i obejrzyj olej', 'zapytaj o datę ostatniej wymiany oleju, filtrów i płynu hamulcowego'],
    dotyczy: 'wszystkie', coKm: 15000, fraza: 'zestaw filtrów'
  },
  {
    id: 'wyciek', slug: 'wyciek-oleju', nazwa: 'Usunięcie wycieku oleju (uszczelki)', krotko: 'Wyciek oleju', kosztOd: 300, kosztDo: 1500,
    objawy: ['plama pod autem', 'zaolejony silnik od spodu', 'zapach spalonego oleju po jeździe'],
    sprawdz: ['zajrzyj pod auto po jeździe próbnej', 'obejrzyj okolice pokrywy zaworów i miski olejowej'],
    dotyczy: 'wszystkie', fraza: 'uszczelka pokrywy zaworów'
  }
];

export function naprawaPoSlugu(slug: string) {
  return NAPRAWY.find((n) => n.slug === slug);
}

export interface WynikNegocjacji {
  sumaOd: number;
  sumaDo: number;
  /** proponowana obniżka (środek widełek + 10% na ryzyko, maks. połowa ceny) */
  propozycja: number;
  /** cena po obniżce */
  cenaPo: number;
  /** jaką część ceny auta stanowią naprawy */
  udzial: number;
}

export function policzNegocjacje(cena: number, wybrane: string[]): WynikNegocjacji {
  const lista = NAPRAWY.filter((n) => wybrane.includes(n.id));
  const sumaOd = lista.reduce((s, n) => s + n.kosztOd, 0);
  const sumaDo = lista.reduce((s, n) => s + n.kosztDo, 0);
  const srodek = (sumaOd + sumaDo) / 2;
  const propozycja = Math.min(Math.round((srodek * 1.1) / 100) * 100, Math.round(cena * 0.5));
  return { sumaOd, sumaDo, propozycja, cenaPo: Math.max(0, cena - propozycja), udzial: cena > 0 ? srodek / cena : 0 };
}

/** Kalendarz: które naprawy wypadają między przebiegiem `od` a `do` (pierwszy termin albo kolejne powtórzenie) */
export function naprawyWZakresie(od: number, doKm: number): { n: Naprawa; km: number }[] {
  const out: { n: Naprawa; km: number }[] = [];
  for (const n of NAPRAWY) {
    if (n.coKm && n.coKm < 30000) continue; // rutynowy serwis pomijamy w kalendarzu drogich napraw
    if (n.odKm === undefined) continue;
    const pierwszy = Math.round((n.odKm + (n.doKm ?? n.odKm)) / 2);
    const terminy: number[] = [pierwszy];
    if (n.coKm) for (let km = pierwszy + n.coKm; km <= doKm + n.coKm; km += n.coKm) terminy.push(km);
    const trafiony = terminy.find((km) => km > od && km <= doKm);
    // naprawy bez powtórzeń: liczymy też, gdy cały zakres typowej awarii zachodzi na okres planu
    if (trafiony !== undefined) out.push({ n, km: trafiony });
    else if (!n.coKm && n.odKm <= doKm && (n.doKm ?? n.odKm) > od) out.push({ n, km: Math.max(od, n.odKm) });
  }
  return out.sort((a, b) => a.km - b.km);
}

export const PRZEBIEGI_KALENDARZA = [100000, 150000, 200000, 250000, 300000];
export const slugPrzebiegu = (km: number) => `${km / 1000}-tys-km`;
export const przebiegZeSlugu = (s: string) => {
  const m = s.match(/^(\d+)-tys-km$/);
  return m ? Number(m[1]) * 1000 : null;
};
