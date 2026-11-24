// Kalkulator „Czy przebieg jest prawdziwy?” – typowy przebieg auta w Polsce dla wieku i paliwa.
// Krzywa bazowa: mubi.pl (luty 2026) – średni przebieg aut w Polsce według wieku:
// do 5 lat 57 tys. km, 6–10 lat 141 tys., 11–15 lat 207 tys., 16–20 lat 248 tys. km.
// Środki przedziałów przyjmujemy jako punkty krzywej, a między nimi liczymy liniowo.
// Mnożniki paliwa to ZAŁOŻENIE REDAKCJI (diesle i auta z LPG jeżdżą zwykle więcej) – opisane na stronie.
import type { CarModel } from '@/types/car-model';

export const STAN_PRZEBIEGU = 'listopad 2026';

export type PaliwoPrzebiegu = 'benzyna' | 'diesel' | 'lpg' | 'hybryda' | 'elektryczny';

export const PALIWA_PRZEBIEGU: { id: PaliwoPrzebiegu; nazwa: string; mnoznik: number }[] = [
  { id: 'benzyna', nazwa: 'Benzyna', mnoznik: 0.9 },
  { id: 'diesel', nazwa: 'Diesel', mnoznik: 1.2 },
  { id: 'lpg', nazwa: 'Benzyna + LPG', mnoznik: 1.15 },
  { id: 'hybryda', nazwa: 'Hybryda', mnoznik: 1 },
  { id: 'elektryczny', nazwa: 'Elektryczny', mnoznik: 0.9 }
];

/** [wiek w latach, przebieg w km] */
const KRZYWA: [number, number][] = [
  [0, 0],
  [3, 57000],
  [8, 141000],
  [13, 207000],
  [18, 248000],
  [25, 290000],
  [40, 340000]
];

export function typowyPrzebieg(wiek: number, paliwo: PaliwoPrzebiegu): number {
  const w = Math.max(0, Math.min(40, wiek));
  let km = KRZYWA[KRZYWA.length - 1][1];
  for (let i = 1; i < KRZYWA.length; i++) {
    const [w0, k0] = KRZYWA[i - 1];
    const [w1, k1] = KRZYWA[i];
    if (w <= w1) {
      km = k0 + ((k1 - k0) * (w - w0)) / (w1 - w0);
      break;
    }
  }
  const m = PALIWA_PRZEBIEGU.find((p) => p.id === paliwo)?.mnoznik ?? 1;
  return Math.round((km * m) / 1000) * 1000;
}

export type TonPrzebiegu = 'czerwony' | 'zolty' | 'zielony' | 'szary';

export interface OcenaPrzebiegu {
  wiek: number;
  typowy: number;
  /** podany / typowy */
  stosunek: number;
  kmRocznie: number;
  kmDziennie: number;
  ton: TonPrzebiegu;
  tytul: string;
  opis: string;
}

export function ocenPrzebieg(podany: number, rokProdukcji: number, paliwo: PaliwoPrzebiegu, rokTeraz: number): OcenaPrzebiegu {
  // auto z rocznika X ma średnio pół roku w roku produkcji
  const wiek = Math.max(0.5, rokTeraz - rokProdukcji + 0.5);
  const typowy = typowyPrzebieg(wiek, paliwo);
  const stosunek = typowy > 0 ? podany / typowy : 0;
  const kmRocznie = Math.round(podany / wiek);
  const kmDziennie = Math.round(kmRocznie / 365);
  let ton: TonPrzebiegu = 'zielony';
  let tytul = 'Przebieg wygląda typowo';
  let opis = 'Mieści się w zakresie, który zwykle mają auta w tym wieku. To dobry znak, ale nie dowód – licznik mógł być cofnięty w umiarkowany sposób.';
  if (stosunek < 0.5) {
    ton = 'czerwony';
    tytul = 'Bardzo podejrzanie niski przebieg';
    opis = 'To mniej niż połowa przebiegu typowego dla auta w tym wieku. Zanim pojedziesz na oględziny, sprawdź historię przebiegu po numerze VIN.';
  } else if (stosunek < 0.75) {
    ton = 'zolty';
    tytul = 'Przebieg niższy niż zwykle – sprawdź historię';
    opis = 'Takie auta się zdarzają (np. drugie auto w rodzinie), ale to też typowy zakres po cofnięciu licznika. Poproś o dokumenty serwisowe i sprawdź VIN.';
  } else if (stosunek > 1.6) {
    ton = 'szary';
    tytul = 'Bardzo duży przebieg';
    opis = 'Licznik pewnie nie jest cofnięty, ale auto było intensywnie używane (flota, taxi, trasy). Dokładnie sprawdź stan silnika, skrzyni, zawieszenia i wnętrza.';
  }
  return { wiek, typowy, stosunek, kmRocznie, kmDziennie, ton, tytul, opis };
}

/** Typowe przebiegi dla roczników – do tabel na stronach modeli */
export function tabelaRocznikow(roczniki: number[], rokTeraz: number): { rok: number; benzyna: number; diesel: number }[] {
  return roczniki.map((rok) => {
    const wiek = Math.max(0.5, rokTeraz - rok + 0.5);
    return { rok, benzyna: typowyPrzebieg(wiek, 'benzyna'), diesel: typowyPrzebieg(wiek, 'diesel') };
  });
}

/** Model ma stronę „sprawdź przebieg”, gdy to karta zbiorcza z co najmniej 20 tys. aut w Polsce */
export function modelMaStronePrzebiegu(m: CarModel): boolean {
  return !!m.wszystkieGeneracje && !m.daneTestowe && m.cepik.liczbaWPolsce >= 20000;
}

const suma = (l: { liczba: number }[] = []) => l.reduce((s, x) => s + x.liczba, 0);

export interface DaneModeluPrzebieg {
  nazwa: string;
  liczba: number;
  sredniRocznik: number | null;
  /** najczęstsze roczniki (malejąco wg liczby aut) */
  topRoczniki: { rok: number; liczba: number }[];
  udzialSprowadzonych: number;
  udzialDiesla: number;
  udzialLpg: number;
  dominujacePaliwo: PaliwoPrzebiegu;
}

export function daneModeluPrzebieg(m: CarModel): DaneModeluPrzebieg {
  const c = m.cepik;
  const wszystkie = Math.max(1, suma(c.paliwa));
  const paliwo = (s: string) => suma(c.paliwa.filter((p) => p.nazwa.includes(s)));
  const diesel = paliwo('Diesel');
  const lpg = paliwo('LPG');
  const benzyna = suma(c.paliwa.filter((p) => p.nazwa === 'Benzyna'));
  const poch = Math.max(1, suma(c.pochodzenie.filter((p) => !p.nazwa.startsWith('Inne'))));
  const sprowadzone = suma(c.pochodzenie.filter((p) => p.nazwa.startsWith('Sprowadzony')));
  const top = [...c.roczniki].sort((a, b) => b.liczba - a.liczba).slice(0, 8);
  const dominujacePaliwo: PaliwoPrzebiegu = diesel >= benzyna && diesel >= lpg ? 'diesel' : lpg > benzyna ? 'lpg' : 'benzyna';
  return {
    nazwa: `${m.marka} ${m.model}`,
    liczba: c.liczbaWPolsce,
    sredniRocznik: c.sredniRocznik ?? null,
    topRoczniki: top,
    udzialSprowadzonych: sprowadzone / poch,
    udzialDiesla: diesel / wszystkie,
    udzialLpg: lpg / wszystkie,
    dominujacePaliwo
  };
}
