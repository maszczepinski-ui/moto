// Raporty realnego spalania: wspólne typy i statystyki (używane przez API i stronę)

export type Styl = 'miasto' | 'trasa' | 'mieszany';

export interface Raport {
  /** wynik: l/100 km (albo kWh/100 km dla aut elektrycznych) */
  w: number;
  s: Styl;
  /** 1 = jazda na LPG */
  l: 0 | 1;
  /** wersja silnikowa wpisana przez kierowcę */
  v: string;
  /** data zgłoszenia RRRR-MM-DD */
  d: string;
}

export interface Statystyki {
  liczba: number;
  srednia: number | null;
  mediana: number | null;
  wgStylu: Record<Styl, { liczba: number; srednia: number | null }>;
  lpg: { liczba: number; srednia: number | null };
  rozklad: { od: number; liczba: number }[];
  wersje: { nazwa: string; liczba: number; srednia: number }[];
  odrzucone: number;
}

const sr = (a: number[]) => (a.length ? Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 10) / 10 : null);

/** Liczy statystyki z odrzuceniem wartości odstających (reguła 1,5 × rozstęp międzykwartylowy) */
export function statystyki(raporty: Raport[]): Statystyki {
  const benz = raporty.filter((r) => !r.l);
  const kw = (a: number[], q: number) => {
    const s = [...a].sort((x, y) => x - y);
    const i = (s.length - 1) * q;
    return s[Math.floor(i)] + (s[Math.ceil(i)] - s[Math.floor(i)]) * (i - Math.floor(i));
  };
  let dobre = benz;
  if (benz.length >= 8) {
    const w = benz.map((r) => r.w);
    const q1 = kw(w, 0.25), q3 = kw(w, 0.75), iqr = q3 - q1;
    dobre = benz.filter((r) => r.w >= q1 - 1.5 * iqr && r.w <= q3 + 1.5 * iqr);
  }
  const wyniki = dobre.map((r) => r.w);
  const style: Styl[] = ['miasto', 'trasa', 'mieszany'];
  const rozklad = new Map<number, number>();
  for (const x of wyniki) rozklad.set(Math.floor(x), (rozklad.get(Math.floor(x)) || 0) + 1);
  const wersje = new Map<string, number[]>();
  for (const r of dobre) if (r.v) wersje.set(r.v, [...(wersje.get(r.v) || []), r.w]);
  const lpg = raporty.filter((r) => r.l).map((r) => r.w);
  return {
    liczba: dobre.length,
    srednia: sr(wyniki),
    mediana: wyniki.length ? Math.round(kw(wyniki, 0.5) * 10) / 10 : null,
    wgStylu: Object.fromEntries(style.map((s) => { const a = dobre.filter((r) => r.s === s).map((r) => r.w); return [s, { liczba: a.length, srednia: sr(a) }]; })) as Statystyki['wgStylu'],
    lpg: { liczba: lpg.length, srednia: sr(lpg) },
    rozklad: [...rozklad.entries()].sort((a, b) => a[0] - b[0]).map(([od, liczba]) => ({ od, liczba })),
    wersje: [...wersje.entries()].filter(([, a]) => a.length >= 2).map(([nazwa, a]) => ({ nazwa, liczba: a.length, srednia: sr(a)! })).sort((a, b) => b.liczba - a.liczba).slice(0, 8),
    odrzucone: benz.length - dobre.length
  };
}
