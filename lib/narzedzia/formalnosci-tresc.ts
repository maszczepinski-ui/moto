// Treść stron terminarza formalności (wspólna dla strony głównej narzędzia i stron scenariuszy)
import { KWOTY } from '@/lib/narzedzia/formalnosci';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export const SEKCJE_FORMALNOSCI: Sekcja[] = [
  {
    h2: 'Trzy terminy, o których musisz pamiętać',
    akapity: [
      'Po zakupie używanego auta w Polsce najważniejsze są trzy rzeczy: ubezpieczenie OC (od pierwszego dnia), podatek PCC (14 dni, jeśli kupujesz od osoby prywatnej) i wniosek o rejestrację (30 dni). Wszystkie terminy liczy się od dnia podpisania umowy, a nie od odbioru dowodu rejestracyjnego.',
      'Kary za rejestrację nakłada starosta w trybie administracyjnym, czyli w praktyce automatycznie po upływie terminu. Dlatego warto od razu zapisać daty w kalendarzu – kalkulator powyżej przygotuje gotowy plik z przypomnieniami.'
    ],
    tabela: [
      ['Obowiązek', 'Termin', 'Kara lub skutek'],
      ['OC (przejęte albo własne)', 'od pierwszego dnia', `brak OC ponad 14 dni: ${zl(KWOTY.karaBrakOc)} (UFG, 2026)`],
      ['PCC-3 i podatek 2%', '14 dni od umowy', 'odsetki, odpowiedzialność karna skarbowa'],
      ['Wniosek o rejestrację', '30 dni od umowy', `${zl(KWOTY.karaRejestracja)}, po 180 dniach ${zl(KWOTY.karaRejestracja180)}`],
      ['Zgłoszenie zbycia (sprzedający)', '30 dni od umowy', zl(KWOTY.karaZbycie)],
      ['Powiadomienie ubezpieczyciela (sprzedający)', '14 dni od umowy', 'problemy z rozliczeniem składki']
    ]
  },
  {
    h2: 'Podatek PCC: kiedy płacisz, a kiedy nie',
    akapity: [
      `PCC płaci kupujący, gdy nabywa auto od osoby prywatnej w Polsce, a wartość rynkowa przekracza ${zl(KWOTY.progPcc)}. Stawka to ${KWOTY.stawkaPcc}% wartości rynkowej – nie zawsze ceny z umowy. Jeśli urząd uzna, że cena była zaniżona, może wyliczyć podatek od wyższej kwoty i doliczyć odsetki.`,
      'Nie płacisz PCC przy zakupie na fakturę VAT lub VAT-marża (dealer, komis jako sprzedawca), przy zakupie auta za granicą i przy darowiźnie (tam obowiązują przepisy o podatku od spadków i darowizn).'
    ]
  },
  {
    h2: 'OC po zakupie: przejąć czy wypowiedzieć?',
    akapity: [
      'Z autem przechodzi na Ciebie polisa OC poprzedniego właściciela. Masz wybór: zostawić ją do końca okresu (nie odnowi się sama) albo wypowiedzieć w dowolnym momencie i kupić własną. Wypowiedzenie ma sens, gdy masz lepsze zniżki niż poprzedni właściciel albo znajdziesz tańszą ofertę – ubezpieczyciel i tak może przeliczyć składkę według Twoich danych.',
      'Najważniejsze, żeby nie zostawić auta bez ochrony. Kara za brak OC dłużej niż 14 dni dla samochodu osobowego wynosi w 2026 r. dwukrotność płacy minimalnej.'
    ]
  },
  {
    h2: 'Jakie dokumenty zabrać do rejestracji',
    lista: [
      'wniosek o rejestrację (dostępny w urzędzie albo online),',
      'umowę kupna-sprzedaży, fakturę lub umowę darowizny (przy aucie z zagranicy – z tłumaczeniem przysięgłym),',
      'dowód rejestracyjny i tablice (przy aucie z Polski),',
      'kartę pojazdu, jeśli była wydana,',
      'potwierdzenie zapłaty akcyzy (auto z UE) albo dokumenty odprawy celnej (spoza UE),',
      'ważne badanie techniczne i dowód osobisty.'
    ]
  }
];

export const PYTANIA_FORMALNOSCI: Pytanie[] = [
  { q: 'Ile mam czasu na przerejestrowanie auta w 2026 r.?', a: `30 dni od dnia zakupu. Po tym terminie starosta nakłada karę ${zl(KWOTY.karaRejestracja)}, a po 180 dniach ${zl(KWOTY.karaRejestracja180)}. Przedsiębiorcy handlujący autami mają 90 dni.` },
  { q: 'Ile wynosi podatek od kupna auta?', a: `2% wartości rynkowej auta (PCC). Przykład: auto warte 30 000 zł to 600 zł podatku. Deklarację PCC-3 i podatek trzeba złożyć w 14 dni od umowy. Do ${zl(KWOTY.progPcc)} wartości podatku nie ma.` },
  { q: 'Czy muszę płacić PCC przy zakupie z komisu?', a: 'Jeśli komis wystawia fakturę jako sprzedawca – nie. Jeśli dostajesz umowę z poprzednim właścicielem, a komis tylko pośredniczy – tak, jak przy zakupie od osoby prywatnej.' },
  { q: 'Czy muszę zgłaszać nabycie auta?', a: 'Od 1 stycznia 2024 r. nie ma osobnego zgłoszenia nabycia. Zamiast tego trzeba w 30 dni złożyć wniosek o rejestrację. Sprzedający nadal zgłasza zbycie auta.' },
  { q: 'Co z OC po zakupie auta?', a: 'Przejmujesz polisę poprzedniego właściciela. Możesz ją wypowiedzieć w każdej chwili albo zostawić do końca okresu – nie odnowi się automatycznie.' }
];

export const ZRODLA_FORMALNOSCI: Zrodlo[] = [
  { n: 'rankomat.pl – kara za nieprzerejestrowanie (2026)', url: 'https://rankomat.pl/samochod/kara-za-nieprzerejestrowanie-samochodu' },
  { n: 'BIP Kraków – zawiadomienie o zbyciu', url: 'https://bip.krakow.pl/?dok_id=77714' },
  { n: 'otomoto.pl – PCC-3 w 2026 r.', url: 'https://www.otomoto.pl/news/podatek-od-kupna-samochodu-pcc-3' },
  { n: 'rankomat.pl – darowizna samochodu', url: 'https://rankomat.pl/samochod/darowizna-samochodu' },
  { n: 'podatki.gov.pl – formularz AKC-U/S', url: 'https://www.podatki.gov.pl/media/3366/akc-us-2.pdf' }
];
