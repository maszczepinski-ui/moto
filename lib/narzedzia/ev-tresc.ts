// Treść stron „Koszt ładowania elektryka”
import { CENY_KWH, KLASY_EV, koszt100, type KlasaEv, type ZrodloPradu } from '@/lib/narzedzia/ev';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

const zl = (n: number) => `${n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
const ZRODLA_PRADU = Object.keys(CENY_KWH) as ZrodloPradu[];

export const TABELA_EV: string[][] = [
  ['Gdzie ładujesz', 'Cena 1 kWh', ...(Object.keys(KLASY_EV) as KlasaEv[]).map((k) => `${KLASY_EV[k].nazwa} (${KLASY_EV[k].kwh} kWh)`)],
  ...ZRODLA_PRADU.map((z) => [CENY_KWH[z].nazwa, `${CENY_KWH[z].cena.toLocaleString('pl-PL')} zł`, ...(Object.keys(KLASY_EV) as KlasaEv[]).map((k) => zl(koszt100(KLASY_EV[k].kwh, z)))])
];

export const SEKCJE_EV: Sekcja[] = [
  {
    h2: 'Ile kosztuje 100 km elektrykiem w 2026 r.',
    akapity: [
      'O koszcie jazdy elektrykiem decyduje głównie miejsce ładowania. Ten sam samochód może kosztować kilka złotych na 100 km przy nocnym ładowaniu w domu i ponad 50 zł przy ładowaniu wyłącznie na ultraszybkich stacjach. Dlatego kalkulator pozwala ustawić własny miks: ile procent energii pobierasz w domu, na publicznych ładowarkach AC i na szybkich DC.',
      'Tabela poniżej pokazuje koszt 100 km dla czterech klas aut i każdego sposobu ładowania. Do ładowania w domu i na AC doliczyliśmy 10% strat energii (część prądu zamienia się w ciepło podczas ładowania).'
    ],
    tabela: TABELA_EV
  },
  {
    h2: 'Jak obniżyć koszt ładowania',
    lista: [
      'Ładuj w domu w nocy – w taryfie G12 albo dynamicznej koszt 1 kWh spada nawet o połowę względem G11.',
      'Ustaw harmonogram ładowania w aucie albo w wallboksie, żeby korzystać z tanich godzin automatycznie.',
      'Fotowoltaika w ciągu dnia to najtańszy prąd, jeśli auto stoi wtedy w domu.',
      'Na trasie sprawdzaj abonamenty operatorów – przy częstym ładowaniu DC potrafią obniżyć cenę 1 kWh.',
      'Nie ładuj na szybkich ładowarkach do 100% – powyżej ok. 80% moc spada, a płacisz za czas i energię.'
    ]
  }
];

export const PYTANIA_EV: Pytanie[] = [
  { q: 'Ile kosztuje naładowanie elektryka w domu?', a: `W taryfie G11 (ok. 1,04 zł/kWh) 100 km kompaktem zużywającym 17 kWh to ok. ${zl(koszt100(17, 'g11'))}. W taryfie G12 w nocy – ok. ${zl(koszt100(17, 'g12'))}.` },
  { q: 'Ile kosztuje ładowanie na szybkiej ładowarce?', a: `Mediana ceny na ładowarkach DC 50–149 kW to ok. 2,50 zł/kWh, a od 150 kW ok. 2,99 zł/kWh (XI 2026). 100 km kompaktem to ok. ${zl(koszt100(17, 'dc'))}–${zl(koszt100(17, 'hpc'))}.` },
  { q: 'Czy elektryk jest tańszy w eksploatacji niż benzyna?', a: 'Przy ładowaniu głównie w domu – zdecydowanie tak, nawet kilka razy. Przy ładowaniu wyłącznie na szybkich stacjach koszt 100 km zbliża się do auta spalinowego.' },
  { q: 'Która taryfa jest najlepsza do ładowania elektryka?', a: 'Taryfa dynamiczna albo G12, jeśli ładujesz w nocy. G11 jest prostsza, ale droższa przy dużym zużyciu.' }
];

export const ZRODLA_EV: Zrodlo[] = [
  { n: 'finwire.pl – ceny ładowania (XI 2026)', url: 'https://finwire.pl/ceny-ladowania' },
  { n: 'elektromobilni.pl – ranking cen ładowania (XI 2026)', url: 'https://elektromobilni.pl/?p=137480' },
  { n: 'autocentrum.pl – taryfy dynamiczne i koszt 100 km', url: 'https://www.autocentrum.pl/publikacje/eksploatacja-auta/koszt-100-km-elektrykiem-w-2026-roku-jak-taryfy-dynamiczne-zmienia-portfel-kierowcy/' }
];
