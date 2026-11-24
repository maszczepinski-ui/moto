// Treść stron „Auto w firmie” (wspólna dla strony głównej i stron z kwotami)
import { LIMITY } from '@/lib/narzedzia/firma';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export const SEKCJE_FIRMA: Sekcja[] = [
  {
    h2: 'Limity od 2026 r.: 100, 150 i 225 tys. zł',
    akapity: [
      'Od 1 stycznia 2026 r. to, ile wartości auta osobowego rozliczysz w kosztach, zależy od emisji CO₂ zapisanej w dowodzie rejestracyjnym. Dla zdecydowanej większości aut spalinowych i zwykłych hybryd limit spadł ze 150 do 100 tys. zł. Ministerstwo Finansów potwierdziło, że nowy limit dotyczy także umów leasingu zawartych przed 2026 r. – liczy się data zapłaty raty.',
      'Limit dotyczy wartości auta (amortyzacji albo części kapitałowej rat leasingu) i składek AC. Nie dotyczy paliwa i serwisu – te przy użytku mieszanym rozliczasz w 75%.'
    ],
    tabela: [['Rodzaj auta', 'Limit w kosztach', 'Przykłady'], ...Object.values(LIMITY).map((l) => [l.nazwa, zl(l.limit), l.opis])]
  },
  {
    h2: 'Jak działa limit w praktyce',
    akapity: [
      'Jeśli auto (cena netto plus nieodliczona połowa VAT) kosztuje więcej niż limit, w kosztach ujmujesz tylko proporcjonalną część. Przykład: auto spalinowe za 150 000 zł netto przy użytku mieszanym. VAT to 34 500 zł, odliczasz połowę (17 250 zł), a druga połowa powiększa wartość auta do 167 250 zł. Limit to 100 000 zł, więc 67 250 zł wartości nigdy nie obniży Twojego podatku. Na podatku liniowym to ok. 12 800 zł więcej podatku przez cały okres.',
      'Ten sam mechanizm działa przy leasingu operacyjnym (część kapitałowa każdej raty liczona proporcjonalnie), leasingu finansowym i kredycie (amortyzacja do limitu) oraz zakupie za gotówkę. Różnią się tempem rozliczenia i kosztem finansowania, a nie kwotą limitu.'
    ]
  },
  {
    h2: 'VAT: 50% czy 100%?',
    akapity: [
      'Przy użytku mieszanym (auto także do celów prywatnych) odliczasz 50% VAT od zakupu lub rat i od wydatków eksploatacyjnych, a do kosztów wrzucasz 75% wydatków na paliwo i serwis. 100% VAT i kosztów przysługuje tylko przy aucie używanym wyłącznie w firmie – trzeba złożyć VAT-26, prowadzić ewidencję przebiegu i mieć regulamin korzystania z auta. Jedna prywatna trasa może podważyć całe rozliczenie.'
    ]
  },
  {
    h2: 'Leasing, kredyt czy gotówka?',
    lista: [
      'Leasing operacyjny – raty są kosztem od razu, bez zamrażania gotówki; po okresie umowy wykup. Limit rozliczasz proporcjonalnie w każdej racie.',
      'Kredyt lub leasing finansowy – auto jest Twoim środkiem trwałym, amortyzujesz je (zwykle 20% rocznie), a w kosztach są też odsetki.',
      'Gotówka – brak kosztów finansowania, ale największe jednorazowe obciążenie firmy. Amortyzacja jak przy kredycie.',
      'Na ryczałcie nie odliczasz kosztów, więc limit nie zmienia podatku dochodowego – liczy się tylko VAT (jeśli jesteś podatnikiem VAT).'
    ]
  }
];

export const PYTANIA_FIRMA: Pytanie[] = [
  { q: 'Jaki jest limit dla auta w firmie w 2026 r.?', a: '100 000 zł dla aut z emisją CO₂ od 50 g/km (większość spalinowych i hybryd), 150 000 zł dla aut poniżej 50 g/km i 225 000 zł dla elektrycznych i wodorowych.' },
  { q: 'Czy nowy limit dotyczy leasingu podpisanego w 2025 r.?', a: 'Tak. Według Ministerstwa Finansów limit 100 000 zł stosuje się do rat płaconych od 2026 r., także z umów zawartych wcześniej.' },
  { q: 'Gdzie sprawdzić emisję CO₂ auta?', a: 'W dowodzie rejestracyjnym (pole V.7) albo w świadectwie zgodności (CoC) nowego auta.' },
  { q: 'Ile VAT odliczę od auta osobowego?', a: '50% przy użytku mieszanym. 100% tylko wtedy, gdy auto służy wyłącznie firmie, złożysz VAT-26 i prowadzisz ewidencję przebiegu.' },
  { q: 'Czy limit dotyczy paliwa?', a: 'Nie. Paliwo, serwis i opony przy użytku mieszanym rozliczasz w 75% kosztów (i 50% VAT), niezależnie od wartości auta.' }
];

export const ZRODLA_FIRMA: Zrodlo[] = [
  { n: 'autocentrum.pl – nowe limity od 2026', url: 'https://www.autocentrum.pl/newsy/nowy-limit-dla-aut-firmowych-emisja-co2-moze-obnizyc-go-do-100-tys-zl/' },
  { n: 'forsal.pl – limit a umowy sprzed 2026', url: 'https://forsal.pl/kraj/aktualnosci/artykuly/10621805,zawarles-leasing-przed-2026-r-i-tak-zaplacisz-wiecej.html' },
  { n: 'infor.pl – stanowisko MF', url: 'https://ksiegowosc.infor.pl/wiadomosci/7484610,nowe-limity-podatkowe-dla-samochodow-firmowych-od-2026-r-mf-dotycza-tez-umow-leasingu-i-najmu-zawartych-wczesniej-jezeli-auto-nie-zostalo-ujete-w-ewidencji-srodkow-trwalych-przed-1-stycznia.html' },
  { n: 'pit.pl – 50% VAT i 75% kosztów', url: 'https://www.pit.pl/?p=53533' }
];
