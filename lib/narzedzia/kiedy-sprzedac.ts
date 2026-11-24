// „Kiedy sprzedać auto?” – sygnały, po których auto traci na wartości: strefy czystego transportu (lib/sct.ts),
// zbliżające się drogie naprawy (lib/narzedzia/naprawy.ts) i progi przebiegu, na które patrzą kupujący.
// Progi przebiegu (100, 150, 200 tys. km) to obserwacja redakcji z filtrów portali ogłoszeniowych – kupujący często
// ustawiają „do 150 tys. km” albo „do 200 tys. km”, więc auto tuż nad progiem wypada z wielu wyszukiwań.
import { MIASTA_SCT, ocen, type Paliwo } from '@/lib/sct';
import { naprawyWZakresie, type Dotyczy } from '@/lib/narzedzia/naprawy';

export const STAN_KIEDY = 'listopad 2026';
export const PROGI_PRZEBIEGU = [100000, 150000, 200000, 250000, 300000];

export interface DaneKiedy {
  paliwo: 'benzyna' | 'diesel' | 'hybryda' | 'elektryczny';
  rocznik: number;
  przebieg: number;
  kmRocznie: number;
  skrzynia: 'manual' | 'automat';
  rozrzad: 'pasek' | 'lancuch';
  rokTeraz: number;
}

export interface Sygnal {
  rok: number;
  km?: number;
  typ: 'sct' | 'naprawa' | 'prog';
  tytul: string;
  opis: string;
  waga: 'duza' | 'srednia';
}

export function sygnaly(d: DaneKiedy): Sygnal[] {
  const out: Sygnal[] = [];
  const paliwoSct: Paliwo = d.paliwo === 'diesel' ? 'diesel' : d.paliwo === 'hybryda' ? 'hybryda-benzyna' : d.paliwo === 'elektryczny' ? 'elektryczny' : 'benzyna';
  for (const m of MIASTA_SCT) {
    const w = ocen({ paliwo: paliwoSct, rocznik: d.rocznik, zwolnienia: [] }, m, d.rokTeraz).werdykt;
    if (w.typ === 'do-roku' && w.rok >= d.rokTeraz)
      out.push({ rok: w.rok + 1, typ: 'sct', waga: 'duza', tytul: `Od ${w.rok + 1} r. auto nie wjedzie do strefy czystego transportu ${m.wMiescie}`, opis: `${m.wMiescie.replace(/^w /, 'W ')} popyt na takie auta spadnie – warto sprzedać przed końcem ${w.rok} r., gdy kupujący z miasta jeszcze go szukają.` });
    if (w.typ === 'zakaz' || w.typ === 'oplata')
      out.push({ rok: d.rokTeraz, typ: 'sct', waga: 'srednia', tytul: `Auto już teraz nie spełnia wymagań SCT ${m.wMiescie}`, opis: w.typ === 'oplata' ? `Wjazd tylko za opłatą do ${w.doRoku} r. – kupujących z miasta będzie coraz mniej.` : 'Szukaj kupców spoza miasta – dla mieszkańców to auto ma mniejszą wartość.' });
  }
  const pasuje = (x: Dotyczy) => x === 'wszystkie' || (x === 'diesel' && d.paliwo === 'diesel') || (x === 'turbo' && d.paliwo === 'diesel') || x === d.skrzynia || x === d.rozrzad;
  const horyzont = d.przebieg + d.kmRocznie * 5;
  for (const { n, km } of naprawyWZakresie(d.przebieg, horyzont).filter((x) => pasuje(x.n.dotyczy) && x.n.kosztDo >= 2000)) {
    const rok = d.rokTeraz + Math.floor((km - d.przebieg) / Math.max(1, d.kmRocznie));
    out.push({ rok, km, typ: 'naprawa', waga: n.kosztDo >= 4000 ? 'duza' : 'srednia', tytul: `${n.krotko} – ok. ${Math.round(km / 1000)} tys. km`, opis: `Typowy koszt ${n.kosztOd.toLocaleString('pl-PL')}–${n.kosztDo.toLocaleString('pl-PL')} zł. Sprzedaż tuż przed tą naprawą oznacza, że kupujący odliczy ją od ceny – sprzedaż tuż po niej (z fakturą) pozwala odzyskać część kosztu.` });
  }
  for (const prog of PROGI_PRZEBIEGU) {
    if (prog <= d.przebieg || prog > horyzont) continue;
    const rok = d.rokTeraz + Math.floor((prog - d.przebieg) / Math.max(1, d.kmRocznie));
    out.push({ rok, km: prog, typ: 'prog', waga: prog === 200000 || prog === 150000 ? 'duza' : 'srednia', tytul: `Przekroczenie ${prog / 1000} tys. km`, opis: `Wielu kupujących ustawia w wyszukiwarce limit „do ${prog / 1000} tys. km”. Auto tuż ponad progiem wypada z części wyników i trudniej je sprzedać.` });
  }
  return out.sort((a, b) => a.rok - b.rok || (a.km ?? 0) - (b.km ?? 0));
}
