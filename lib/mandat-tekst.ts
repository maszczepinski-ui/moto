// Dodatkowy tekst strony mandatu za prędkość: przykłady prędkości na różnych drogach, punkty i limit, recydywa, FAQ.
import { type Przedzial, opisPrzedzialu, LIMIT_PUNKTOW } from '@/lib/mandaty';

export interface TekstMandatu {
  sekcje: { h2: string; akapity: string[]; tabela?: { naglowki: string[]; wiersze: string[][] } }[];
  faq: { q: string; a: string }[];
}

const zl = (n: number) => n.toLocaleString('pl-PL') + ' zł';
const DROGI: [string, number][] = [
  ['Obszar zabudowany', 50],
  ['Droga poza obszarem zabudowanym', 90],
  ['Droga ekspresowa (dwujezdniowa)', 120],
  ['Autostrada', 140]
];

export function tekstMandatu(p: Przedzial): TekstMandatu {
  const N = opisPrzedzialu(p);
  const ile = (limit: number) => (p.do === null ? `${limit + p.od} km/h i więcej` : `${limit + p.od}–${limit + p.do} km/h`);
  // ile takich wykroczeń oznacza przekroczenie limitu (utratę prawa jazdy)
  const utrataD = Math.floor(LIMIT_PUNKTOW.doswiadczony / p.punkty) + 1;
  const utrataM = Math.floor(LIMIT_PUNKTOW.mlody / p.punkty) + 1;
  const wykr = (n: number) => (n === 1 ? 'wykroczenie' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'wykroczenia' : 'wykroczeń');
  const zatrzymanie = p.do === null || p.od > 50;
  const sekcje: TekstMandatu['sekcje'] = [];

  sekcje.push({
    h2: `Przy jakiej prędkości dostaniesz ten mandat?`,
    akapity: [`Przekroczenie prędkości ${N} oznacza w praktyce jazdę z taką prędkością (przy typowych ograniczeniach):`],
    tabela: { naglowki: ['Rodzaj drogi', 'Ograniczenie', 'Twoja prędkość'], wiersze: DROGI.map(([n, l]) => [n, `${l} km/h`, ile(l)]) }
  });

  sekcje.push({
    h2: `Punkty karne: ${p.punkty} pkt – ile to dużo?`,
    akapity: [
      `Kierowca z prawem jazdy dłużej niż rok może mieć najwyżej ${LIMIT_PUNKTOW.doswiadczony} punkty karne. Po przekroczeniu tego limitu traci prawo jazdy i musi ponownie zdawać egzamin. Za jedno przekroczenie prędkości ${N} dostajesz ${p.punkty} pkt, więc już ${utrataD} ${wykr(utrataD) === 'wykroczeń' ? 'takich' : 'takie'} ${wykr(utrataD)} (${utrataD * p.punkty} pkt) to przekroczenie limitu.`,
      `Młody kierowca (w pierwszym roku od zdobycia prawa jazdy) ma limit ${LIMIT_PUNKTOW.mlody} punktów, więc margines jest jeszcze mniejszy – limit przekroczy już ${utrataM} ${wykr(utrataM)} tego rodzaju (${utrataM * p.punkty} pkt). Punkty karne kasują się po roku od zapłacenia mandatu.`
    ]
  });

  const rec = p.recydywa
    ? `Przy tym przekroczeniu obowiązuje recydywa: jeśli w ciągu 2 lat od poprzedniego ukarania za przekroczenie prędkości o ponad 30 km/h zrobisz to ponownie, mandat jest podwójny – ${zl(p.recydywa)} zamiast ${zl(p.kwota)}.`
    : `Przy przekroczeniu ${N} nie ma podwójnego mandatu za recydywę – dotyczy ona dopiero przekroczeń o ponad 30 km/h. Punkty karne jednak się sumują.`;
  sekcje.push({
    h2: zatrzymanie ? 'Recydywa i zatrzymanie prawa jazdy' : 'Czy grozi recydywa?',
    akapity: [
      rec,
      ...(zatrzymanie
        ? ['Przy przekroczeniu prędkości o ponad 50 km/h w obszarze zabudowanym oraz na drodze jednojezdniowej dwukierunkowej poza obszarem zabudowanym policja dodatkowo zatrzymuje prawo jazdy na 3 miesiące. Jazda mimo zatrzymania wydłuża ten okres i grozi poważniejszymi karami.']
        : [])
    ]
  });

  sekcje.push({
    h2: 'Co jeśli nie przyjmiesz mandatu?',
    akapity: [
      `Możesz odmówić przyjęcia mandatu – wtedy policja kieruje sprawę do sądu. Sąd może wymierzyć grzywnę niższą, ale też wyższą niż mandat (za wykroczenia drogowe nawet do 30 000 zł) i obciążyć Cię kosztami postępowania. Odmowa ma sens tylko wtedy, gdy masz mocne dowody, że pomiar był błędny.`
    ]
  });

  const faq = [
    { q: `Ile wynosi mandat za przekroczenie prędkości ${N}?`, a: `${zl(p.kwota)} i ${p.punkty} pkt karnych.${p.recydywa ? ` W recydywie ${zl(p.recydywa)}.` : ''}` },
    { q: `Ile punktów karnych za przekroczenie prędkości ${N}?`, a: `${p.punkty} pkt. Limit dla doświadczonego kierowcy to ${LIMIT_PUNKTOW.doswiadczony} pkt, a dla młodego kierowcy (pierwszy rok) – ${LIMIT_PUNKTOW.mlody} pkt.` },
    { q: `Czy za przekroczenie prędkości ${N} zabierają prawo jazdy?`, a: zatrzymanie ? 'Tak, jeśli zdarzy się to w obszarze zabudowanym albo na drodze jednojezdniowej dwukierunkowej poza nim – policja zatrzymuje prawo jazdy na 3 miesiące.' : 'Nie – zatrzymanie prawa jazdy na 3 miesiące grozi dopiero przy przekroczeniu o ponad 50 km/h (w obszarze zabudowanym lub na drodze jednojezdniowej poza nim). Pamiętaj jednak o limicie punktów karnych.' },
    { q: 'Kiedy kasują się punkty karne?', a: 'Po roku od dnia zapłacenia mandatu (albo uprawomocnienia się kary).' }
  ];
  return { sekcje, faq };
}
