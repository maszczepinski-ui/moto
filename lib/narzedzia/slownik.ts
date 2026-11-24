// Słownik zwrotów z ogłoszeń motoryzacyjnych + detektor (podświetla zwroty w wklejonym ogłoszeniu).
// To opis redakcji – co zwykle oznacza dany zwrot i co sprawdzić. Nie przesądza o uczciwości sprzedającego.
// NOWY ZWROT: dopisz obiekt (wzorce to fragmenty tekstu małymi literami, bez polskich znaków też zadziałają).

export const STAN_SLOWNIKA = 'listopad 2026';

export type Ryzyko = 'niskie' | 'srednie' | 'wysokie';

export interface Zwrot {
  slug: string;
  fraza: string;
  /** fragmenty do wyszukania w ogłoszeniu (małe litery) */
  wzorce: string[];
  ryzyko: Ryzyko;
  znaczenie: string;
  sprawdz: string[];
  zapytaj: string[];
}

export const RYZYKO_OPIS: Record<Ryzyko, string> = { niskie: 'zwykle w porządku', srednie: 'sprawdź dokładnie', wysokie: 'zachowaj szczególną ostrożność' };

export const ZWROTY: Zwrot[] = [
  { slug: 'bezwypadkowy', fraza: 'Bezwypadkowy', wzorce: ['bezwypadk'], ryzyko: 'srednie', znaczenie: 'Sprzedający deklaruje, że auto nie miało wypadku. Każdy rozumie to inaczej – dla jednych to brak szkód w ogóle, dla innych brak „dużego dzwona”. Deklaracja nic nie kosztuje i nie jest dowodem.', sprawdz: ['zmierz grubość lakieru na wszystkich elementach', 'obejrzyj szczeliny między elementami i śruby mocujące błotniki i maskę', 'sprawdź historię szkód po VIN'], zapytaj: ['Czy auto miało jakiekolwiek szkody, także parkingowe?', 'Czy któryś element był lakierowany i dlaczego?', 'Czy wpisze Pan „bezwypadkowy” do umowy?'] },
  { slug: 'pierwszy-wlasciciel-w-kraju', fraza: 'Pierwszy właściciel w kraju', wzorce: ['pierwszy właściciel w kraju', 'pierwszy wlasciciel w kraju', '1 właściciel w kraju', '1. właściciel w kraju'], ryzyko: 'srednie', znaczenie: 'Auto jest sprowadzone, a sprzedający jest pierwszym właścicielem w Polsce. O tym, ilu właścicieli miało za granicą i jak było używane, ten zwrot nic nie mówi.', sprawdz: ['datę pierwszej rejestracji w Polsce w dowodzie', 'historię z baz zagranicznych po VIN'], zapytaj: ['Z jakiego kraju jest auto i kiedy zostało sprowadzone?', 'Czy ma Pan dokumenty z zakupu za granicą?'] },
  { slug: 'sprowadzony-oplacony', fraza: 'Sprowadzony, opłacony', wzorce: ['opłacon', 'oplacon'], ryzyko: 'wysokie', znaczenie: 'Auto jest po akcyzie, ale nie jest zarejestrowane w Polsce. Często sprzedaje je handlarz na umowę z poprzednim zagranicznym właścicielem – wtedy w razie wady nie ma od kogo dochodzić roszczeń.', sprawdz: ['kto jest sprzedawcą w umowie – osoba, z którą rozmawiasz, czy ktoś z zagranicy', 'dowód zapłaty akcyzy i kompletność dokumentów', 'historię auta za granicą po VIN'], zapytaj: ['Na kogo będzie umowa?', 'Czy może Pan pokazać dokument zakupu auta za granicą?'] },
  { slug: 'do-oplat', fraza: 'Do opłat / do rejestracji', wzorce: ['do opłat', 'do oplat', 'do rejestracji', 'niezarejestrowany'], ryzyko: 'srednie', znaczenie: 'Auto nie ma opłaconej akcyzy albo nie jest zarejestrowane w Polsce. Koszty akcyzy, tłumaczeń, badania i rejestracji spadną na Ciebie.', sprawdz: ['policz akcyzę i opłaty w kalkulatorze', 'czy auto ma ważne zagraniczne badanie techniczne'], zapytaj: ['Jakie dokumenty dostanę?', 'Czy umowa będzie z Panem?'] },
  { slug: 'umowa-z-niemcem', fraza: 'Umowa niemiecka / na Niemca', wzorce: ['umowa niemiecka', 'umowa z niemcem', 'na niemca', 'umowa in blanco', 'in blanco'], ryzyko: 'wysokie', znaczenie: 'Sprzedający oferuje umowę, w której sprzedawcą jest poprzedni zagraniczny właściciel, a nie on sam. To sposób na uniknięcie podatku i odpowiedzialności za wady. Umowa „in blanco” to dokument podpisany wcześniej, bez danych kupującego.', sprawdz: ['czy dane sprzedawcy w umowie zgadzają się z osobą, która sprzedaje', 'czy podpisy i daty są prawdziwe'], zapytaj: ['Czy mogę zawrzeć umowę bezpośrednio z Panem?'] },
  { slug: 'serwisowany-w-aso', fraza: 'Serwisowany w ASO', wzorce: ['serwisowany w aso', 'serwis aso', 'serwisowany aso', 'w aso'], ryzyko: 'niskie', znaczenie: 'Auto miało serwis w autoryzowanej stacji. To dobra informacja, jeśli są na to dowody – faktury albo wpisy w systemie serwisowym producenta.', sprawdz: ['faktury lub wydruk historii z ASO', 'daty i przebiegi przy wymianach oleju'], zapytaj: ['Czy ma Pan faktury albo wydruk z ASO?'] },
  { slug: 'garazowany', fraza: 'Garażowany', wzorce: ['garażowan', 'garazowan'], ryzyko: 'niskie', znaczenie: 'Auto stało w garażu. Trudno to sprawdzić, ale stan lakieru, gumowych uszczelek i korozji powie więcej niż deklaracja.', sprawdz: ['stan uszczelek, plastików i lakieru na dachu i masce'], zapytaj: ['Gdzie auto stało na co dzień?'] },
  { slug: 'stan-idealny', fraza: 'Stan idealny / igła', wzorce: ['stan idealny', 'igła', 'igla', 'perfekcyjny stan', 'stan perfekcyjny'], ryzyko: 'srednie', znaczenie: 'Zwrot marketingowy. Używane auto nie jest idealne – sprzedający, który tak pisze, może bagatelizować usterki.', sprawdz: ['pełna lista na oględziny', 'diagnostyka komputerowa'], zapytaj: ['Co w aucie wymaga naprawy albo wymiany w najbliższym czasie?'] },
  { slug: 'kupiony-w-polskim-salonie', fraza: 'Kupiony w polskim salonie', wzorce: ['polski salon', 'polskim salonie', 'salon polska', 'z polskiego salonu'], ryzyko: 'niskie', znaczenie: 'Auto od nowości jeździ w Polsce, więc ma pełną historię w polskich badaniach technicznych. To duży plus – łatwo to zweryfikować za darmo.', sprawdz: ['historiapojazdu.gov.pl – data pierwszej rejestracji i stany licznika'], zapytaj: ['Czy ma Pan książkę serwisową z salonu?'] },
  { slug: 'oryginalny-przebieg', fraza: 'Oryginalny przebieg', wzorce: ['oryginalny przebieg', 'przebieg oryginalny', 'przebieg udokumentowany', 'udokumentowany przebieg', 'gwarancja przebiegu'], ryzyko: 'srednie', znaczenie: 'Deklaracja, że licznik nie był cofany. Warto ją potwierdzić, bo cofanie liczników wciąż jest częste.', sprawdz: ['historię przebiegu w polskich i zagranicznych bazach', 'zużycie kierownicy, pedałów i fotela'], zapytaj: ['Czy wpisze Pan przebieg i oświadczenie o jego oryginalności do umowy?'] },
  { slug: 'nie-wymaga-wkladu', fraza: 'Nie wymaga wkładu finansowego', wzorce: ['nie wymaga wkładu', 'nie wymaga wkladu', 'bez wkładu', 'wsiadać i jeździć', 'wsiadac i jezdzic', 'wsiadać i jechać'], ryzyko: 'srednie', znaczenie: 'Sprzedający twierdzi, że auto nie potrzebuje napraw. Często pomija rzeczy eksploatacyjne: rozrząd, opony, hamulce.', sprawdz: ['faktury za rozrząd, sprzęgło i serwis', 'bieżnik i wiek opon'], zapytaj: ['Kiedy był wymieniany rozrząd i co było robione w ostatnim roku?'] },
  { slug: 'klima-do-nabicia', fraza: 'Klima do nabicia', wzorce: ['klima do nabicia', 'klimatyzacja do nabicia', 'klima do napełnienia', 'klima do naładowania'], ryzyko: 'wysokie', znaczenie: 'Najczęściej klimatyzacja nie działa i powód jest poważniejszy niż brak czynnika – nieszczelność albo uszkodzona sprężarka. Naprawa może kosztować kilka tysięcy złotych.', sprawdz: ['czy po włączeniu klimatyzacji załącza się sprężarka', 'koszt naprawy w kalkulatorze negocjacji'], zapytaj: ['Kiedy ostatnio klimatyzacja chłodziła?'] },
  { slug: 'kontrolka-do-skasowania', fraza: 'Kontrolka do skasowania / czujnik do wymiany', wzorce: ['do skasowania', 'czujnik do wymiany', 'kontrolka do', 'check engine', 'świeci kontrolka', 'świeci się kontrolka'], ryzyko: 'wysokie', znaczenie: 'Zapalona kontrolka rzadko oznacza tylko „czujnik”. Sprzedający, który wie, że to drobiazg, zwykle sam go wymienia przed sprzedażą.', sprawdz: ['odczytaj kody błędów komputerem', 'sprawdź kod w naszej bazie kodów błędów'], zapytaj: ['Jaki kod błędu pokazał komputer?'] },
  { slug: 'pali-i-jezdzi', fraza: 'Pali i jeździ', wzorce: ['pali i jeździ', 'pali i jezdzi', 'odpala i jeździ'], ryzyko: 'srednie', znaczenie: 'Minimum, które sprzedający gwarantuje. Zwykle oznacza auto z wieloma usterkami, sprzedawane tanio – tak to traktuj.', sprawdz: ['pełne oględziny i diagnostyka', 'ważność badania technicznego i OC'], zapytaj: ['Co trzeba naprawić, żeby auto przeszło przegląd?'] },
  { slug: 'wymieniony-rozrzad', fraza: 'Wymieniony rozrząd', wzorce: ['wymieniony rozrząd', 'wymieniony rozrzad', 'nowy rozrząd', 'nowy rozrzad', 'rozrząd zrobiony', 'rozrzad zrobiony'], ryzyko: 'niskie', znaczenie: 'Duży plus, jeśli jest faktura z datą i przebiegiem. Bez dokumentu traktuj rozrząd jako do wymiany.', sprawdz: ['fakturę z datą, przebiegiem i zakresem (pasek, rolki, pompa wody)'], zapytaj: ['Czy ma Pan fakturę za wymianę rozrządu?'] },
  { slug: 'ksiazka-serwisowa', fraza: 'Książka serwisowa', wzorce: ['książka serwisowa', 'ksiazka serwisowa', 'książką serwisową', 'historia serwisowa'], ryzyko: 'niskie', znaczenie: 'Auto ma dokumentację serwisową. Sprawdź, czy wpisy są regularne i czy pieczątki wyglądają wiarygodnie – książkę da się podrobić.', sprawdz: ['ciągłość wpisów i przebiegów', 'czy warsztaty z pieczątek istnieją'], zapytaj: ['Czy ma Pan też faktury do wpisów?'] },
  { slug: 'bez-targowania', fraza: 'Bez targowania / tylko poważne oferty', wzorce: ['bez targowania', 'cena ostateczna', 'tylko poważne', 'tylko powazne', 'handlarze dziękuję'], ryzyko: 'niskie', znaczenie: 'Sprzedający nie chce negocjować. Konkretne usterki z oględzin to wciąż uczciwy argument do rozmowy o cenie.', sprawdz: ['porównaj cenę z podobnymi ogłoszeniami'], zapytaj: ['Jeśli na oględzinach wyjdzie coś do naprawy, czy uwzględni to Pan w cenie?'] },
  { slug: 'poleasingowy', fraza: 'Poleasingowy / z firmy', wzorce: ['poleasing', 'po leasingu', 'auto firmowe', 'flotow'], ryzyko: 'srednie', znaczenie: 'Auto jeździło w firmie. Zwykle ma udokumentowany serwis, ale też duży roczny przebieg i intensywne użytkowanie.', sprawdz: ['przebieg i historię serwisową', 'zużycie wnętrza'], zapytaj: ['Kto był użytkownikiem auta i ile kilometrów robił rocznie?'] },
  { slug: 'dpf-usuniety', fraza: 'DPF usunięty / bez DPF', wzorce: ['bez dpf', 'dpf usunięty', 'dpf usuniety', 'dpf off', 'wycięty dpf', 'wyciety dpf', 'usunięty dpf'], ryzyko: 'wysokie', znaczenie: 'Usunięcie filtra cząstek stałych jest niezgodne z przepisami. Auto może nie przejść badania technicznego, a montaż nowego filtra kosztuje kilka tysięcy złotych.', sprawdz: ['czy filtr jest na miejscu (diagnosta)', 'koszt nowego DPF'], zapytaj: ['Kto usunął filtr i czy oryginał jest dostępny?'] },
  { slug: 'lpg-niewpisane', fraza: 'LPG niewpisane do dowodu', wzorce: ['gaz nie wpisany', 'lpg nie wpisan', 'niezalegalizowan', 'gaz niezalegalizowany', 'lpg bez homologacji'], ryzyko: 'wysokie', znaczenie: 'Instalacja gazowa nie jest wpisana do dowodu. Z takim autem są problemy na przeglądzie i przy szkodzie, a legalizacja kosztuje.', sprawdz: ['wpis w dowodzie rejestracyjnym', 'homologację i ważność butli'], zapytaj: ['Dlaczego instalacja nie jest wpisana?'] },
  { slug: 'anglik', fraza: 'Anglik / kierownica po prawej', wzorce: ['anglik', 'kierownica po prawej', 'kierownica z prawej'], ryzyko: 'srednie', znaczenie: 'Auto z ruchem lewostronnym. Jest tańsze, ale trudniej je sprzedać, a jazda i wyprzedzanie są mniej wygodne. Przekładka kierownicy rzadko się opłaca.', sprawdz: ['czy auto ma przerobione światła', 'czy jest zarejestrowane w Polsce'], zapytaj: ['Czy auto przeszło badanie techniczne w Polsce?'] },
  { slug: 'drobne-rysy', fraza: 'Drobne rysy / ślady użytkowania', wzorce: ['drobne rysy', 'ślady użytkowania', 'slady uzytkowania', 'drobne ślady', 'kosmetyka do zrobienia'], ryzyko: 'niskie', znaczenie: 'Uczciwa informacja o zużyciu. Warto zobaczyć, czy to faktycznie drobiazgi, czy elementy do lakierowania.', sprawdz: ['zdjęcia w świetle dziennym', 'miernik lakieru'], zapytaj: ['Które elementy mają rysy?'] },
  { slug: 'lekko-uszkodzony', fraza: 'Lekko uszkodzony', wzorce: ['lekko uszkodz', 'uszkodzony', 'po szkodzie', 'po stłuczce', 'po stluczce'], ryzyko: 'wysokie', znaczenie: 'Auto po szkodzie. „Lekko” to ocena sprzedającego – za zderzakiem mogą być uszkodzone wzmocnienia, chłodnice i czujniki.', sprawdz: ['zakres szkody na zdjęciach i w raporcie po VIN', 'czy szkoda była likwidowana z ubezpieczenia'], zapytaj: ['Jaki był kosztorys szkody?'] },
  { slug: 'zamiana', fraza: 'Możliwa zamiana', wzorce: ['zamiana', 'zamienię', 'zamienie'], ryzyko: 'niskie', znaczenie: 'Sprzedający przyjmie inne auto w rozliczeniu. Często to handlarz – sprawdź, kto jest sprzedawcą w umowie.', sprawdz: ['kto jest właścicielem w dowodzie'], zapytaj: ['Czy auto jest zarejestrowane na Pana?'] },
  { slug: 'cena-do-negocjacji', fraza: 'Cena do negocjacji', wzorce: ['do negocjacji', 'do uzgodnienia', 'cena do dogadania'], ryzyko: 'niskie', znaczenie: 'Sprzedający zostawił margines. Negocjuj po oględzinach, opierając się na konkretnych usterkach.', sprawdz: ['policz rozsądną obniżkę w kalkulatorze negocjacji'], zapytaj: ['Jaka jest cena przy płatności od ręki?'] }
];

const bezPl = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L');

export interface Trafienie {
  zwrot: Zwrot;
  /** fragment tekstu z ogłoszenia */
  fragment: string;
}

/** Znajduje zwroty ze słownika w tekście ogłoszenia (ignoruje wielkość liter i polskie znaki) */
export function wykryj(tekst: string): Trafienie[] {
  const maly = bezPl(tekst.toLowerCase());
  const out: Trafienie[] = [];
  for (const z of ZWROTY) {
    for (const w of z.wzorce) {
      const i = maly.indexOf(bezPl(w));
      if (i >= 0) {
        out.push({ zwrot: z, fragment: tekst.slice(Math.max(0, i - 25), Math.min(tekst.length, i + w.length + 25)).trim() });
        break;
      }
    }
  }
  const kolejnosc: Record<Ryzyko, number> = { wysokie: 0, srednie: 1, niskie: 2 };
  return out.sort((a, b) => kolejnosc[a.zwrot.ryzyko] - kolejnosc[b.zwrot.ryzyko]);
}

export function zwrotPoSlugu(slug: string) {
  return ZWROTY.find((z) => z.slug === slug);
}
