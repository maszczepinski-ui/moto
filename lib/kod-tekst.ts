// Dodatkowy tekst strony kodu błędu OBD-II: budowa kodu, czy można jechać, jak naprawić i skasować, FAQ.
// Budowa kodów wg standardu SAE J2012 (pierwsza litera, cyfra uniwersalna/producenta, podukład).
import type { KodBledu } from '@/lib/kody-bledow';

const PODUKLAD: Record<string, string> = {
  '0': 'układ paliwowo-powietrzny i dodatkowe sterowanie emisją spalin',
  '1': 'pomiar paliwa i powietrza (czujniki dolotu, mieszanki)',
  '2': 'pomiar paliwa i powietrza – obwody wtryskiwaczy',
  '3': 'układ zapłonowy i wypadanie zapłonów',
  '4': 'dodatkowe układy kontroli emisji spalin (EGR, katalizator, filtr cząstek, odparowanie paliwa)',
  '5': 'prędkość pojazdu, bieg jałowy i wejścia pomocnicze',
  '6': 'komputer sterujący silnika i jego obwody',
  '7': 'skrzynia biegów',
  '8': 'skrzynia biegów'
};

export interface TekstKodu {
  sekcje: { h2: string; akapity: string[]; kroki?: string[] }[];
  faq: { q: string; a: string }[];
}

export function tekstKodu(k: KodBledu): TekstKodu {
  const K = k.kod;
  const uniwersalny = K[1] === '0' || K[1] === '2';
  const pod = PODUKLAD[K[2]] || 'układ napędowy';
  const sekcje: TekstKodu['sekcje'] = [];

  sekcje.push({
    h2: `Jak czytać kod ${K}?`,
    akapity: [
      `Kody OBD-II mają pięć znaków i każdy coś znaczy. Litera „P” oznacza układ napędowy (silnik i skrzynię biegów). Cyfra „${K[1]}” mówi, że to kod ${uniwersalny ? 'uniwersalny – ma to samo znaczenie w każdym samochodzie, niezależnie od marki' : 'producenta – jego znaczenie zależy od marki'}. Trzecia cyfra („${K[2]}”) wskazuje podukład: ${pod}. Ostatnie dwie cyfry („${K.slice(3)}”) to numer konkretnej usterki w tej grupie.`,
      `Kod ${K} oznacza: ${k.nazwa.toLowerCase()}. Pamiętaj, że kod mówi, co wykrył komputer, a nie co dokładnie się zepsuło – ten sam błąd mogą wywołać różne przyczyny.`
    ]
  });

  const jazda =
    k.pilnosc === 'wysoka'
      ? `Z błędem ${K} lepiej nie jeździć dłużej, niż to konieczne. Usterka może szybko się pogłębić i uszkodzić droższe części${K.startsWith('P03') ? ' – przy wypadaniu zapłonów niespalone paliwo trafia do katalizatora i może go zniszczyć. Jeśli kontrolka silnika miga, zwolnij i jak najszybciej zjedź do warsztatu' : ''}. Dojedź spokojnie do mechanika, unikaj wysokich obrotów i dużego obciążenia.`
      : k.pilnosc === 'średnia'
        ? `Z błędem ${K} zwykle da się dojechać do warsztatu, ale nie odkładaj naprawy na długo. Auto może więcej palić, gorzej przyspieszać albo przejść w tryb awaryjny, a usterka z czasem może uszkodzić inne części.`
        : `Błąd ${K} zwykle nie zagraża silnikowi i możesz dalej jeździć. Napraw go jednak przy najbliższej okazji – świecąca kontrolka zasłoni ewentualny nowy, poważniejszy błąd.`;
  sekcje.push({ h2: `Czy można jeździć z błędem ${K}?`, akapity: [jazda] });

  sekcje.push({
    h2: `Jak naprawić i skasować błąd ${K}?`,
    akapity: ['Kasowanie błędu bez usunięcia przyczyny nic nie daje – kontrolka zapali się ponownie po kilku przejazdach. Najlepiej postępować w takiej kolejności:'],
    kroki: [
      'Odczytaj wszystkie zapisane błędy skanerem OBD2, nie tylko ten jeden – kilka kodów naraz często wskazuje wspólną przyczynę.',
      ...k.coSprawdzic,
      `Zacznij od najczęstszej i najtańszej przyczyny: ${k.przyczyny[0].toLowerCase()}.`,
      'Po naprawie skasuj błąd skanerem i zrób jazdę próbną. Jeśli kod wróci, sprawdź kolejne przyczyny z listy powyżej.'
    ]
  });

  const faq = [
    { q: `Co oznacza kod błędu ${K}?`, a: `${k.nazwa}. ${k.opis}` },
    { q: `Jakie są objawy błędu ${K}?`, a: k.objawy.join('. ') + '.' },
    { q: `Co powoduje błąd ${K}?`, a: k.przyczyny.join('. ') + '.' },
    { q: `Czy z błędem ${K} można jeździć?`, a: jazda },
    {
      q: `Czy błąd ${K} może zniknąć sam?`,
      a: 'Czasem tak – gdy przyczyna była chwilowa (np. luźny korek wlewu paliwa), kontrolka może zgasnąć po kilku przejazdach. Kod zostaje jednak zapisany w pamięci sterownika jako historyczny. Jeśli kontrolka wraca, usterka nadal istnieje.'
    },
    {
      q: `Jak samemu odczytać kod ${K}?`,
      a: 'Wystarczy tani skaner OBD2 (np. przystawka Bluetooth z aplikacją w telefonie). Gniazdo OBD znajduje się zwykle pod kierownicą. W Unii Europejskiej mają je wszystkie auta benzynowe od 2001 roku i diesle od 2004 roku.'
    }
  ];
  return { sekcje, faq };
}
