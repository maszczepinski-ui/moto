// Treści asystenta zakupu używanego auta („Kupujesz …? Sprawdź, zanim zapłacisz”).
// Wszystko składane z danych karty (CEPiK, silniki, usterki) + ogólne zasady zakupu auta w Polsce.
import { CarModel } from '@/types/car-model';
import { najwiecej } from '@/lib/opis';
import { nazwaWojewodztwa } from '@/lib/wojewodztwa';
import { silnikiKarty } from '@/lib/silniki';
import vinDane from '@/data/techniczne/vin.json';

export type Naped = 'benzyna' | 'diesel' | 'lpg' | 'hybryda' | 'elektryczny';

/** Udział paliw na karcie → które napędy są istotne (≥ 10% aut albo najczęstszy) */
export function napedyKarty(m: CarModel): Naped[] {
  const p = m.cepik.paliwa.filter((x) => x.nazwa !== 'Inne / brak danych');
  const suma = p.reduce((s, x) => s + x.liczba, 0) || 1;
  const wynik = new Set<Naped>();
  p.forEach((x, i) => {
    if (i > 0 && x.liczba / suma < 0.1) return;
    const n = x.nazwa;
    wynik.add(n.startsWith('Elektr') ? 'elektryczny' : n.startsWith('Hybryda') ? 'hybryda' : n.includes('LPG') ? 'lpg' : n.startsWith('Diesel') ? 'diesel' : 'benzyna');
  });
  if (!wynik.size) wynik.add('benzyna');
  return [...wynik];
}

/** Ile aut sprowadzono z zagranicy jako używane – udział wśród aut ze znanym pochodzeniem */
export function udzialImportu(m: CarModel): number | null {
  const p = m.cepik.pochodzenie.filter((x) => x.nazwa !== 'Inne / brak danych');
  const suma = p.reduce((s, x) => s + x.liczba, 0);
  if (suma < 30) return null;
  const imp = p.filter((x) => x.nazwa.startsWith('Sprowadzony')).reduce((s, x) => s + x.liczba, 0);
  return imp / suma;
}

export function udzialSalonu(m: CarModel): number | null {
  const p = m.cepik.pochodzenie.filter((x) => x.nazwa !== 'Inne / brak danych');
  const suma = p.reduce((s, x) => s + x.liczba, 0);
  if (suma < 30) return null;
  return (p.find((x) => x.nazwa.startsWith('Nowy z polskiego'))?.liczba || 0) / suma;
}

/**
 * Jak łatwo trafić na egzemplarz. Liczymy z aut „w użyciu” (od 2017 r. zmieniły właściciela, sprowadzone albo nowe z salonu),
 * bo w CEPiK zostają też auta dawno niejeżdżące – np. Fiat 126p ma 1,8 mln rejestracji, ale w użyciu kilka tysięcy.
 */
export function rzadkoscModelu(m: { cepik: { liczbaWPolsce: number; aktywne?: number } }) {
  const a = m.cepik.aktywne;
  if (a === undefined) return rzadkosc(m.cepik.liczbaWPolsce);
  return rzadkosc(a >= 40000 ? 100000 : a >= 8000 ? 20000 : a >= 1500 ? 3000 : a >= 200 ? 500 : 0);
}

/** Progi liczone z liczby wszystkich rejestracji (używaj rzadkoscModelu, gdy masz dane karty) */
export function rzadkosc(n: number): { poziom: string; opis: string } {
  if (n >= 100000) return { poziom: 'Bardzo popularny', opis: 'W Polsce jest ich w użyciu bardzo dużo – zwykle łatwo o wybór egzemplarzy i pole do negocjacji. Części i mechanicy znający ten model są wszędzie.' };
  if (n >= 20000) return { poziom: 'Popularny', opis: 'Aut jest dużo, więc zwykle jest z czego wybierać, a części i warsztaty są łatwo dostępne.' };
  if (n >= 3000) return { poziom: 'Spotykany regularnie', opis: 'Aut jest umiarkowanie dużo – warto szukać w całej Polsce, nie tylko w swoim mieście.' };
  if (n >= 500) return { poziom: 'Rzadki', opis: 'Dobrych egzemplarzy jest niewiele – nastaw się na dłuższe szukanie i dalszy dojazd. Sprawdź wcześniej dostępność części.' };
  return { poziom: 'Unikat', opis: 'W Polsce jest bardzo mało takich aut. Każdy egzemplarz warto sprawdzić wyjątkowo dokładnie, a części mogą wymagać zamawiania z zagranicy.' };
}

export const PROCENT = (x: number) => `${Math.round(x * 100)}%`;

/** Krótkie fakty na górę strony */
export function faktyZakupu(m: CarModel) {
  const imp = udzialImportu(m);
  const salon = udzialSalonu(m);
  const top = najwiecej(m);
  return {
    rzadkosc: rzadkoscModelu(m),
    import: imp,
    salon,
    gdzie: top ? nazwaWojewodztwa(top.teryt).toLowerCase() : null,
    gdzieTeryt: top?.teryt || null
  };
}

/** Co sprawdzić w historii auta – zdanie dopasowane do pochodzenia egzemplarzy */
export function radaHistoria(m: CarModel): string {
  const imp = udzialImportu(m);
  if (imp !== null && imp >= 0.5)
    return `${PROCENT(imp)} aut tego modelu w Polsce sprowadzono z zagranicy jako używane. Historia takiego auta (szkody, przebiegi, kradzież) jest zapisana głównie w bazach innych krajów – sprawdź ją po numerze VIN, zanim pojedziesz oglądać auto.`;
  if (imp !== null && imp >= 0.25)
    return `${PROCENT(imp)} aut tego modelu w Polsce sprowadzono z zagranicy. Jeśli egzemplarz, który oglądasz, też był sprowadzony, jego wcześniejsza historia jest w zagranicznych bazach – sprawdź ją po numerze VIN.`;
  return 'Większość aut tego modelu jeździ w Polsce od nowości albo od dawna. Darmowo sprawdzisz ich historię w Polsce na stronie Historia Pojazdu (gov.pl), a raport z zagranicznych baz przyda się przy aucie sprowadzonym.';
}

/** Ogólna lista kontrolna oględzin + punkty dla napędów występujących w modelu */
export function listaOgledzin(m: CarModel): string[] {
  const lista = [
    'Porównaj numer VIN w dowodzie rejestracyjnym, na tabliczce znamionowej i wybity na nadwoziu (zwykle pod szybą i w komorze silnika).',
    'Upewnij się, że sprzedający jest właścicielem wpisanym w dowodzie albo ma umowę lub upoważnienie od właściciela.',
    'Zmierz grubość lakieru na każdym elemencie (miernik kosztuje kilkadziesiąt zł). Duże różnice zdradzają naprawy blacharskie.',
    'Obejrzyj szczeliny między drzwiami, maską i błotnikami oraz uszczelki – ślady lakieru na gumach to znak malowania.',
    'Sprawdź korozję: progi, nadkola, podłogę, mocowania zawieszenia i dolne krawędzie drzwi.',
    'Poproś, żeby silnik nie był wcześniej grzany – zimny rozruch najwięcej mówi o jego stanie.',
    'Po uruchomieniu wszystkie kontrolki muszą zgasnąć. Podłącz tani interfejs OBD i odczytaj zapisane błędy.',
    'Poszukaj wycieków pod autem i w komorze silnika (olej, płyn chłodniczy, płyn hamulcowy).',
    'Porównaj przebieg z historią serwisową i zużyciem kierownicy, gałki zmiany biegów, pedałów i fotela kierowcy.',
    'Jazda próbna: sprzęgło i skrzynia (szarpanie, zgrzyty), hamulce (ściąganie, bicie), zawieszenie (stuki na nierównościach), praca na postoju i w trasie.',
    'Sprawdź klimatyzację, elektryczne szyby, zamek centralny i wszystkie światła.',
    'Opony: rocznik (4 cyfry na boku, np. 2321 = 23. tydzień 2021) i równomierne zużycie – nierówne wskazuje na problemy z geometrią.'
  ];
  const n = napedyKarty(m);
  if (n.includes('diesel'))
    lista.push(
      'Diesel: zapytaj o filtr cząstek stałych (DPF) – czy jest i czy nie był wycięty (bez niego auto nie przejdzie badania technicznego).',
      'Diesel: dym przy mocnym wciśnięciu gazu, nierówna praca na zimno (wtryskiwacze), drgania i stuki przy gaszeniu silnika (koło dwumasowe), gwizd lub olej w dolocie (turbosprężarka).'
    );
  if (n.includes('benzyna'))
    lista.push('Benzyna: zapytaj o dolewki oleju między wymianami i obejrzyj spaliny – niebieski dym oznacza przepalanie oleju. Grzechotanie tuż po zimnym rozruchu może oznaczać zużyty łańcuch rozrządu.');
  if (n.includes('lpg'))
    lista.push('LPG: instalacja musi być wpisana w dowodzie rejestracyjnym, a butla mieć ważną legalizację (10 lat od produkcji). Sprawdź pracę silnika na gazie i benzynie oraz przełączanie.');
  if (n.includes('hybryda'))
    lista.push('Hybryda: poproś o diagnostykę baterii trakcyjnej (w ASO albo specjalistycznym warsztacie) i historię serwisową. Sprawdź, czy auto rusza i jedzie chwilę na samym prądzie.');
  if (n.includes('elektryczny'))
    lista.push('Elektryk: poproś o raport stanu baterii (SOH), porównaj realny zasięg z katalogowym, sprawdź gwarancję na baterię oraz ładowanie z gniazdka i szybkiej ładowarki.');
  const rocznik = m.cepik.sredniRocznik;
  if (rocznik && rocznik < 2008)
    lista.push('Starsze auto: obejrzyj dokładnie przewody hamulcowe i paliwowe pod podwoziem oraz gumowe elementy zawieszenia – po latach to częste i kosztowne naprawy.');
  return lista;
}

export interface GrupaListy {
  id: string;
  tytul: string;
  punkty: string[];
}

/** Punkty zależne od silników tego modelu – tylko z silników zatwierdzonych w bibliotece (panel → Silniki) */
export function punktySilnikow(m: CarModel): string[] {
  const w = silnikiKarty(m).filter((x) => x.tech);
  const wersje = (f: (r: string, wt: string) => boolean) => [...new Set(w.filter((x) => f(x.tech!.rozrzad, x.tech!.wtrysk)).map((x) => `${x.nazwa} ${x.mocKm} KM`))];
  const pasek = wersje((r) => r.startsWith('pasek'));
  const lancuch = wersje((r) => r.includes('łańcuch'));
  const bezp = wersje((_, wt) => /bezpośredni/.test(wt));
  const pd = wersje((_, wt) => /pompowtryskiwacze/.test(wt));
  const lista: string[] = [];
  if (pasek.length) lista.push(`Pasek rozrządu (${pasek.join(', ')}): poproś o fakturę za ostatnią wymianę z datą i przebiegiem. Bez dowodu wymiany wlicz ją w cenę auta.`);
  if (lancuch.length) lista.push(`Łańcuch rozrządu (${lancuch.join(', ')}): posłuchaj silnika tuż po zimnym rozruchu – grzechotanie to znak rozciągniętego łańcucha albo napinacza.`);
  if (bezp.length) lista.push(`Wtrysk bezpośredni (${bezp.join(', ')}): zapytaj o czyszczenie dolotu z nagaru i sprawdź, czy silnik równo pracuje na wolnych obrotach.`);
  if (pd.length) lista.push(`Pompowtryskiwacze (${pd.join(', ')}): nierówna praca na zimno i dymienie mogą oznaczać zużyte wtryskiwacze – to kosztowna naprawa.`);
  return lista;
}

/** Lista kontrolna w warstwach: dokumenty → nadwozie → silnik i napęd → jazda próbna → ten model */
export function listaWarstwowa(m: CarModel): GrupaListy[] {
  const ogolne = listaOgledzin(m);
  const [vin, wlasciciel, lakier, szczeliny, korozja, zimny, kontrolki, wycieki, przebieg, jazda, wyposazenie, opony, ...reszta] = ogolne;
  const model = [...(m.listaKontrolna || []), ...(m.usterki || []).map((u) => `Typowa usterka – ${u.tytul.replace(/\.$/, '')}: zapytaj, czy była naprawiana.`)];
  return [
    { id: 'dokumenty', tytul: 'Dokumenty i VIN', punkty: [vin, wlasciciel, przebieg] },
    { id: 'nadwozie', tytul: 'Nadwozie', punkty: [lakier, szczeliny, korozja, opony] },
    { id: 'silnik', tytul: 'Silnik i napęd', punkty: [zimny, kontrolki, wycieki, ...punktySilnikow(m), ...reszta] },
    { id: 'jazda', tytul: 'Jazda próbna i wyposażenie', punkty: [jazda, wyposazenie] },
    ...(model.length ? [{ id: 'model', tytul: `${m.marka} ${m.model}${m.generacja ? ` ${m.generacja}` : ''} – na co uważać`, punkty: model }] : [])
  ].filter((g) => g.punkty.length);
}

type WpisVin = { miejsca: string[]; zrodla: { tytul: string; url: string }[]; zatwierdzony: boolean };
/** Gdzie jest VIN w tym modelu – tylko wpis zatwierdzony w panelu */
export function vinModelu(m: CarModel): WpisVin | null {
  const w = (vinDane as unknown as { modele: Record<string, WpisVin> }).modele[m.slug];
  return w?.zatwierdzony ? w : null;
}

/** Formalności po zakupie auta zarejestrowanego w Polsce, kupionego od osoby prywatnej */
export const FORMALNOSCI: { kiedy: string; co: string; opis: string; link?: 'oc' }[] = [
  {
    kiedy: 'W dniu zakupu',
    co: 'Umowa i dokumenty',
    opis: 'Spisz umowę kupna-sprzedaży w dwóch egzemplarzach (dane stron, VIN, przebieg, cena, data i godzina). Odbierz dowód rejestracyjny, kartę pojazdu (jeśli była wydana), polisę OC, wszystkie kluczyki i tablice.'
  },
  {
    kiedy: 'W dniu zakupu',
    co: 'Ubezpieczenie OC',
    opis: 'Polisa OC sprzedającego przechodzi na Ciebie i działa do końca okresu, na jaki ją zawarto. Możesz ją wypowiedzieć i kupić własną, często tańszą. Jeśli auto nie ma ważnego OC – kup polisę, zanim odjedziesz.',
    link: 'oc'
  },
  {
    kiedy: 'Do 14 dni',
    co: 'Podatek PCC (2%)',
    opis: 'Przy zakupie od osoby prywatnej złóż deklarację PCC-3 i zapłać 2% wartości rynkowej auta – można przez internet (e-Urząd Skarbowy). Nie płacisz, gdy kupujesz na fakturę albo auto jest warte do 1000 zł.'
  },
  {
    kiedy: 'Do 30 dni',
    co: 'Rejestracja na siebie',
    opis: 'Zarejestruj auto w wydziale komunikacji swojego starostwa lub urzędu miasta. Możesz zachować dotychczasowe tablice. Za spóźnienie grozi kara od 200 do 1000 zł.'
  },
  {
    kiedy: 'Na start',
    co: 'Pierwszy serwis',
    opis: 'Jeśli nie ma udokumentowanej historii: wymień olej i filtry, płyny i – gdy nie wiadomo, kiedy był wymieniany – rozrząd. To najtańsze ubezpieczenie od dużej awarii.'
  }
];

export const ZRODLA_FORMALNOSCI = [
  { nazwa: 'Bezprawnik: formalności po zakupie samochodu', url: 'https://bezprawnik.pl/formalnosci-po-zakupie-samochodu/' },
  { nazwa: 'Warta: zawiadomienie o nabyciu pojazdu a przerejestrowanie', url: 'https://www.warta.pl/porada/zawiadomienie-o-nabyciu-pojazdu-a-jego-przerejestrowanie/' },
  { nazwa: 'Historia Pojazdu (gov.pl) – darmowe sprawdzenie auta zarejestrowanego w Polsce', url: 'https://historiapojazdu.gov.pl/' }
];

/** Adres strony asystenta dla karty */
export const adresZakupu = (m: Pick<CarModel, 'adres'>) => `${m.adres}zakup/`;
