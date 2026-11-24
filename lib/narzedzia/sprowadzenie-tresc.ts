// Treść stron „Koszt sprowadzenia auta”
import { OPLATY } from '@/lib/akcyza';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export const SEKCJE_SPROWADZENIE: Sekcja[] = [
  {
    h2: 'Z czego składa się koszt sprowadzenia auta',
    lista: [
      'cena auta przeliczona po kursie (w deklaracji akcyzowej – kurs średni NBP),',
      'transport: laweta albo powrót na kołach z tablicami wywozowymi i ubezpieczeniem,',
      'akcyza: 3,1% dla silników do 2000 cm³ i 18,6% powyżej (hybrydy mają stawki o połowę niższe, elektryki są zwolnione),',
      'spoza UE dodatkowo cło (10%, auta wyprodukowane w USA 0% od 1.07.2026) i VAT 23%,',
      `tłumaczenia przysięgłe (zwykle 100–250 zł) i badanie techniczne (${zl(OPLATY.badanie)}),`,
      `opłaty w wydziale komunikacji: dowód ${zl(OPLATY.dowodRejestracyjny)}, tablice ${zl(OPLATY.tabliceZwykle)}, znaki ${OPLATY.znakiLegalizacyjne.toLocaleString('pl-PL')} zł, pozwolenie czasowe ${OPLATY.pozwolenieCzasowe.toLocaleString('pl-PL')} zł.`
    ],
    akapity: ['Opłata recyklingowa 500 zł za sprowadzone auto została zniesiona w 2016 r. – jeśli ktoś każe Ci ją płacić, to nieaktualna informacja.']
  },
  {
    h2: 'Kiedy sprowadzenie się opłaca',
    akapity: [
      'Średnia cena używanego auta sprowadzonego do Polski w 2025 r. wyniosła ok. 50 tys. zł (dane AAA Auto przytaczane przez mubi.pl) – kierowcy nie kupują za granicą głównie dla oszczędności, ale dla wyboru i stanu aut. Przy tanich autach koszty stałe (transport, tłumaczenia, rejestracja, wyjazd na oględziny) zjadają większość różnicy w cenie.',
      'Duży silnik potrafi zmienić rachunek: auto 2,0 l płaci 3,1% akcyzy, a 2,2 l już 18,6%. Czasem droższe auto z mniejszym silnikiem wychodzi taniej niż tańsze z większym.'
    ]
  },
  {
    h2: 'Jak nie dać się oszukać przy aucie z zagranicy',
    lista: [
      'Sprawdź historię auta po VIN w bazach zagranicznych – polska historia zaczyna się dopiero po rejestracji w kraju.',
      'Porównaj przebieg z dokumentami serwisowymi i raportami z przeglądów (TÜV, DEKRA, Car-Pass).',
      'Uważaj na „handlarza z Niemiec” w Polsce, który sprzedaje auto na umowę z rzekomym Niemcem – w razie wady trudno dochodzić roszczeń.',
      'Zmierz grubość lakieru – auta po szkodach całkowitych z zagranicy często są sprowadzane do naprawy.'
    ]
  }
];

export const PYTANIA_SPROWADZENIE: Pytanie[] = [
  { q: 'Ile kosztuje sprowadzenie auta z Niemiec w 2026 r.?', a: 'Poza ceną auta: transport lawetą zwykle 1500–3000 zł, akcyza 3,1% lub 18,6% wartości, tłumaczenia 100–250 zł, badanie techniczne 149 zł i ok. 160 zł opłat w wydziale komunikacji.' },
  { q: 'Czy trzeba płacić opłatę recyklingową za sprowadzone auto?', a: 'Nie. Opłata recyklingowa 500 zł dla osób sprowadzających auta została zniesiona od 1 stycznia 2016 r.' },
  { q: 'Czy płaci się PCC za auto kupione za granicą?', a: 'Zwykle nie – auto w chwili zakupu znajduje się poza Polską. Płacisz akcyzę (z UE) albo cło, akcyzę i VAT (spoza UE).' },
  { q: 'Ile mam czasu na rejestrację sprowadzonego auta?', a: '30 dni od przywozu. Deklarację akcyzową AKC-U/S składa się w 14 dni (najpóźniej w dniu rejestracji).' }
];

export const ZRODLA_SPROWADZENIE: Zrodlo[] = [
  { n: 'otomoto.pl – sprowadzenie auta z Niemiec 2026', url: 'https://www.otomoto.pl/news/sprowadzenie-auta-z-niemiec' },
  { n: 'rankomat.pl – koszt sprowadzenia z zagranicy', url: 'https://rankomat.pl/samochod/ile-kosztuje-sprowadzenie-samochodu-z-zagranicy' },
  { n: 'mubi.pl – skąd najtaniej sprowadzić auto', url: 'https://mubi.pl/poradniki/najtansze-sprowadzenie-samochodu/' },
  { n: 'gov.pl – zniesienie opłaty recyklingowej', url: 'https://www.gov.pl/web/klimat/pojazdy-wycofane-z-eksploatacji' }
];
