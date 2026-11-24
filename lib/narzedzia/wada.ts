// „Wada ukryta – terminy”: czy kupujący auto może jeszcze reklamować i jaką drogą. Stan na listopad 2026.
// Podstawy: przedsiębiorca → konsument: art. 43a–43g ustawy o prawach konsumenta (2 lata od dostarczenia, art. 43c,
// bez możliwości skrócenia; odpowiedź w 14 dni – art. 7a); osoba prywatna → osoba prywatna: rękojmia z k.c.
// (2 lata od wydania – art. 568 § 1, rok na dochodzenie od stwierdzenia wady – art. 568 § 2, wyłączenie rękojmi
// dopuszczalne – art. 558 § 1, bezskuteczne przy podstępnym zatajeniu – art. 558 § 2; wada znana kupującemu – art. 557 § 1).
// Zakup na firmę (JDG), spółki i umowy konsumenckie sprzed 1.01.2023 – narzędzie kieruje do prawnika.

export const STAN_WADY = 'listopad 2026';

export type Sprzedawca = 'przedsiebiorca' | 'prywatny' | 'nie-wiem';
export type Kupujacy = 'prywatnie' | 'firma';
export type Wylaczenie = 'nie' | 'tak' | 'nie-wiem';

export interface DaneWady {
  sprzedawca: Sprzedawca;
  kupujacy: Kupujacy;
  dataUmowy: string;
  dataWydania: string;
  dataWady: string;
  wylaczenie: Wylaczenie;
  wiedzial: boolean;
  dzis: string;
}

export type Poziom = 'zielony' | 'zolty' | 'czerwony';

export interface WynikWady {
  poziom: Poziom;
  tytul: string;
  podstawa: string;
  /** do kiedy wada musi się ujawnić (RRRR-MM-DD) */
  terminUjawnienia: string | null;
  dniDoTerminu: number | null;
  /** do kiedy dochodzić roszczeń (osoba prywatna: rok od stwierdzenia wady) */
  terminDochodzenia: string | null;
  kroki: string[];
  prawnik: boolean;
}

const dodaj = (iso: string, lat: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setFullYear(d.getFullYear() + lat);
  return d.toISOString().slice(0, 10);
};
const dni = (od: string, doD: string) => Math.round((new Date(`${doD}T12:00:00`).getTime() - new Date(`${od}T12:00:00`).getTime()) / 86400000);
const poprawna = (iso: string) => !!iso && !Number.isNaN(new Date(`${iso}T12:00:00`).getTime());

const DOKUMENTY = 'Przygotuj: umowę, zrzut ogłoszenia, korespondencję ze sprzedającym, dowód zapłaty i diagnozę warsztatu (najlepiej na piśmie).';

export function ocenWade(d: DaneWady): WynikWady {
  const pusty = { terminUjawnienia: null, dniDoTerminu: null, terminDochodzenia: null };
  if (d.wiedzial)
    return { ...pusty, poziom: 'czerwony', tytul: 'Za wadę znaną przy zakupie sprzedający nie odpowiada', podstawa: 'art. 557 § 1 k.c.', kroki: ['Sprawdź, czy wada, o której wiedziałeś, to na pewno ta sama usterka – inna wada, nawet w tym samym podzespole, może podlegać reklamacji.', DOKUMENTY], prawnik: false };
  if (d.kupujacy === 'firma' || d.sprzedawca === 'nie-wiem')
    return {
      ...pusty,
      poziom: 'czerwony',
      tytul: 'Potrzebna analiza umowy',
      podstawa: d.kupujacy === 'firma' ? 'zakup na firmę – szczególne przepisy (m.in. art. 7aa u.p.k., art. 556⁴–556⁵ k.c.)' : 'nie wiadomo, kto jest sprzedawcą (komis jako sprzedawca czy pośrednik, handlarz udający osobę prywatną)',
      kroki: ['Ustal, kto jest sprzedawcą w dokumencie zakupu (faktura komisu = przedsiębiorca; umowa z osobą prywatną = rękojmia z k.c.).', DOKUMENTY, 'Przy zakupie na firmę albo sporze o to, kim był sprzedawca, warto skonsultować sprawę z prawnikiem.'],
      prawnik: true
    };
  if (!poprawna(d.dataWydania) || !poprawna(d.dataWady)) return { ...pusty, poziom: 'zolty', tytul: 'Uzupełnij daty', podstawa: '', kroki: [], prawnik: false };

  const terminUjawnienia = dodaj(d.dataWydania, 2);
  const dniDoTerminu = dni(d.dzis, terminUjawnienia);
  const ujawnionaWTerminie = d.dataWady <= terminUjawnienia;

  if (d.sprzedawca === 'przedsiebiorca') {
    if (poprawna(d.dataUmowy) && d.dataUmowy < '2023-01-01')
      return { ...pusty, terminUjawnienia, dniDoTerminu, poziom: 'czerwony', tytul: 'Umowa sprzed 2023 r. – stare przepisy', podstawa: 'umowy konsumenckie zawarte przed 1.01.2023 podlegają dawnym przepisom o rękojmi', kroki: [DOKUMENTY, 'Skonsultuj sprawę z prawnikiem albo miejskim rzecznikiem konsumentów.'], prawnik: true };
    if (!ujawnionaWTerminie)
      return { ...pusty, terminUjawnienia, dniDoTerminu, poziom: 'czerwony', tytul: 'Wada ujawniła się po 2 latach od wydania auta', podstawa: 'art. 43c u.p.k.', kroki: ['Wyjątek: jeśli sprzedawca podstępnie zataił wadę, nie może powołać się na upływ terminu (art. 43c ust. 2). To wymaga dowodów – najlepiej z pomocą prawnika.'], prawnik: true };
    return {
      terminUjawnienia,
      dniDoTerminu,
      terminDochodzenia: null,
      poziom: 'zielony',
      tytul: 'Możesz złożyć reklamację u sprzedawcy',
      podstawa: 'niezgodność towaru z umową – art. 43a–43g ustawy o prawach konsumenta',
      kroki: [
        'Złóż reklamację na piśmie (mailem z potwierdzeniem albo listem poleconym): opisz wadę, datę jej stwierdzenia i zażądaj naprawy albo wymiany.',
        'Sprzedawca ma 14 dni na odpowiedź – brak odpowiedzi oznacza uznanie reklamacji (art. 7a u.p.k.).',
        'Przez 2 lata od wydania auta przyjmuje się, że wada istniała już przy zakupie – to sprzedawca musiałby udowodnić, że było inaczej.',
        'Gdy naprawa się nie uda albo sprzedawca odmówi, możesz obniżyć cenę albo – przy istotnej wadzie – odstąpić od umowy.',
        'Pomoc za darmo: miejski lub powiatowy rzecznik konsumentów.'
      ],
      prawnik: false
    };
  }

  // osoba prywatna → osoba prywatna (rękojmia z k.c.)
  if (d.wylaczenie === 'tak')
    return {
      ...pusty,
      terminUjawnienia,
      dniDoTerminu,
      poziom: 'czerwony',
      tytul: 'Umowa wyłącza rękojmię – zostaje tylko droga przy podstępie',
      podstawa: 'art. 558 § 1 i § 2 k.c.',
      kroki: ['Wyłączenie rękojmi między osobami prywatnymi jest dozwolone, ale bezskuteczne, jeśli sprzedający podstępnie zataił wadę.', 'Potrzebujesz dowodów, że sprzedający wiedział o wadzie i ją ukrył (np. faktura za wcześniejszą naprawę, wiadomość, usunięte błędy przed oględzinami).', DOKUMENTY],
      prawnik: true
    };
  if (!ujawnionaWTerminie)
    return { ...pusty, terminUjawnienia, dniDoTerminu, poziom: 'czerwony', tytul: 'Wada stwierdzona po 2 latach od wydania auta', podstawa: 'art. 568 § 1 k.c.', kroki: ['Termin na stwierdzenie wady minął. Wyjątek dotyczy podstępnego zatajenia wady (art. 568 § 6 k.c.) – wymaga dowodów i porady prawnika.'], prawnik: true };
  const terminDochodzenia = dodaj(d.dataWady, 1);
  return {
    terminUjawnienia,
    dniDoTerminu,
    terminDochodzenia,
    poziom: d.wylaczenie === 'nie-wiem' ? 'zolty' : 'zielony',
    tytul: d.wylaczenie === 'nie-wiem' ? 'Sprawdź umowę – od zapisu o rękojmi zależy wszystko' : 'Możesz zawiadomić sprzedającego o wadzie',
    podstawa: 'rękojmia za wady – art. 556 i nast. k.c.',
    kroki: [
      ...(d.wylaczenie === 'nie-wiem' ? ['Poszukaj w umowie słów „wyłącza się rękojmię” albo „kupujący nie będzie dochodził roszczeń”. Taki zapis zmienia sytuację.'] : []),
      'Wyślij sprzedającemu zawiadomienie o wadzie: opis wady, datę stwierdzenia i żądanie (naprawa, obniżenie ceny albo – przy istotnej wadzie – odstąpienie od umowy).',
      'Przy zakupie od osoby prywatnej to Ty musisz wykazać, że wada istniała już przy wydaniu auta – zbierz diagnozę warsztatu, a przy sporze opinię rzeczoznawcy.',
      'Sam wyznacz termin odpowiedzi (np. 14 dni) – milczenie osoby prywatnej nie oznacza z mocy prawa uznania żądania.',
      `Na dochodzenie żądań masz co do zasady rok od stwierdzenia wady – do ${terminDochodzenia.split('-').reverse().join('.')}.`
    ],
    prawnik: false
  };
}

export interface StronaWady {
  slug: string;
  tytul: string;
  wstep: string;
  sprzedawca: Sprzedawca;
  kupujacy: Kupujacy;
  wylaczenie: Wylaczenie;
}

export const STRONY_WADY: StronaWady[] = [
  { slug: 'od-osoby-prywatnej', tytul: 'Wada ukryta auta od osoby prywatnej', wstep: 'Przy zakupie od osoby prywatnej obowiązuje rękojmia z Kodeksu cywilnego: 2 lata na stwierdzenie wady i rok na dochodzenie żądań – o ile umowa jej nie wyłączyła.', sprzedawca: 'prywatny', kupujacy: 'prywatnie', wylaczenie: 'nie' },
  { slug: 'od-komisu-lub-dealera', tytul: 'Reklamacja auta z komisu lub od dealera', wstep: 'Gdy sprzedawcą jest firma, a Ty kupujesz prywatnie, chronią Cię przepisy konsumenckie: 2 lata od wydania auta, bez możliwości skrócenia, i 14 dni na odpowiedź sprzedawcy.', sprzedawca: 'przedsiebiorca', kupujacy: 'prywatnie', wylaczenie: 'nie' },
  { slug: 'wylaczona-rekojmia', tytul: 'Wyłączona rękojmia w umowie – co możesz zrobić?', wstep: 'Zapis „kupujący zrzeka się rękojmi” między osobami prywatnymi jest ważny – chyba że sprzedający podstępnie zataił wadę. Wtedy wyłączenie nie działa.', sprzedawca: 'prywatny', kupujacy: 'prywatnie', wylaczenie: 'tak' },
  { slug: 'zakup-na-firme', tytul: 'Wada auta kupionego na firmę', wstep: 'Przy zakupie na działalność ochrona zależy od tego, czy zakup ma dla Ciebie charakter zawodowy. To sytuacja, w której warto od razu skonsultować umowę z prawnikiem.', sprzedawca: 'przedsiebiorca', kupujacy: 'firma', wylaczenie: 'nie' }
];
