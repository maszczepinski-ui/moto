// Kalkulator felg, opon i ET + zamienniki rozmiaru opon. Czysta geometria – działa dla każdego auta.
// Średnica koła = średnica felgi × 25,4 mm + 2 × (szerokość opony × profil / 100).
// ET (odsadzenie) = odległość od środka felgi do powierzchni przylgowej piasty; większe ET chowa koło głębiej w nadkole.
// Rzeczywista szerokość opony zależy od szerokości felgi – przyjmujemy ok. 0,4 mm na każdy 1 mm różnicy
// względem felgi „idealnej” (ok. 80% szerokości opony); dopuszczalne felgi: ok. 68–93% szerokości opony (przybliżenie ETRTO).
// Progi ocen (różnica średnicy 2% / 3%, przesunięcie 5 / 15 mm) to praktyczne wskazówki warsztatowe, nie przepis prawa.

export const STAN_FELG = 'listopad 2026';

export interface Opona {
  szer: number;
  profil: number;
  felga: number;
}

export interface Kolo extends Opona {
  /** szerokość felgi w calach (J) */
  j: number;
  et: number;
}

export const srednicaKola = (o: Opona) => o.felga * 25.4 + (2 * o.szer * o.profil) / 100;
export const wysokoscBoku = (o: Opona) => (o.szer * o.profil) / 100;
export const obwod = (o: Opona) => Math.PI * srednicaKola(o);
export const nazwaOpony = (o: Opona) => `${o.szer}/${o.profil} R${o.felga}`;

/** Rzeczywista szerokość opony na danej felgi (mm) */
export function szerokoscNaFeldze(szer: number, j: number): number {
  const felgaMm = j * 25.4;
  return szer + 0.4 * (felgaMm - 0.8 * szer);
}

export function felgaPasuje(szer: number, j: number): 'ok' | 'za-waska' | 'za-szeroka' {
  const mm = j * 25.4;
  if (mm < szer * 0.68) return 'za-waska';
  if (mm > szer * 0.93) return 'za-szeroka';
  return 'ok';
}

export interface Porownanie {
  srednicaStara: number;
  srednicaNowa: number;
  roznicaProc: number;
  /** jak zmienia się prześwit (mm) – połowa różnicy średnic */
  przeswit: number;
  /** gdy licznik pokazuje 100 km/h, rzeczywista prędkość */
  przy100: number;
  /** przesunięcie zewnętrznej krawędzi opony na zewnątrz (+ = bliżej błotnika) */
  zewnatrz: number;
  /** przesunięcie wewnętrznej krawędzi opony do środka (+ = bliżej zawieszenia) */
  wewnatrz: number;
  /** przesunięcie lica felgi na zewnątrz */
  licoFelgi: number;
  felgaStara: 'ok' | 'za-waska' | 'za-szeroka';
  felgaNowa: 'ok' | 'za-waska' | 'za-szeroka';
  szerStara: number;
  szerNowa: number;
}

export function porownajKola(s: Kolo, n: Kolo): Porownanie {
  const ds = srednicaKola(s);
  const dn = srednicaKola(n);
  const ws = szerokoscNaFeldze(s.szer, s.j);
  const wn = szerokoscNaFeldze(n.szer, n.j);
  // oś x od powierzchni piasty, dodatnio na zewnątrz auta; środek koła w x = -ET
  const zewS = -s.et + ws / 2;
  const zewN = -n.et + wn / 2;
  const wewS = s.et + ws / 2;
  const wewN = n.et + wn / 2;
  return {
    srednicaStara: ds,
    srednicaNowa: dn,
    roznicaProc: ((dn - ds) / ds) * 100,
    przeswit: (dn - ds) / 2,
    przy100: (100 * dn) / ds,
    zewnatrz: zewN - zewS,
    wewnatrz: wewN - wewS,
    licoFelgi: (-n.et + (n.j * 25.4) / 2) - (-s.et + (s.j * 25.4) / 2),
    felgaStara: felgaPasuje(s.szer, s.j),
    felgaNowa: felgaPasuje(n.szer, n.j),
    szerStara: ws,
    szerNowa: wn
  };
}

export type Ocena = 'zielony' | 'zolty' | 'czerwony';

export function ocenSrednice(proc: number): Ocena {
  const a = Math.abs(proc);
  return a <= 2 ? 'zielony' : a <= 3 ? 'zolty' : 'czerwony';
}
export function ocenZewnatrz(mm: number): Ocena {
  return mm <= 5 ? 'zielony' : mm <= 15 ? 'zolty' : 'czerwony';
}
export function ocenWewnatrz(mm: number): Ocena {
  return mm <= 5 ? 'zielony' : mm <= 10 ? 'zolty' : 'czerwony';
}

/** Popularne rozmiary opon w Polsce – każdy ma własną stronę z zamiennikami */
export const POPULARNE: Opona[] = [
  [155, 70, 13], [165, 70, 13], [175, 70, 13],
  [165, 65, 14], [165, 70, 14], [175, 65, 14], [175, 70, 14], [185, 60, 14], [185, 65, 14], [185, 70, 14],
  [175, 65, 15], [185, 55, 15], [185, 60, 15], [185, 65, 15], [195, 50, 15], [195, 55, 15], [195, 60, 15], [195, 65, 15], [205, 60, 15], [205, 65, 15], [215, 65, 15],
  [195, 55, 16], [195, 60, 16], [205, 45, 16], [205, 50, 16], [205, 55, 16], [205, 60, 16], [215, 55, 16], [215, 60, 16], [215, 65, 16], [225, 50, 16], [225, 55, 16], [225, 60, 16],
  [205, 45, 17], [205, 50, 17], [205, 55, 17], [215, 45, 17], [215, 50, 17], [215, 55, 17], [215, 60, 17], [225, 45, 17], [225, 50, 17], [225, 55, 17], [225, 60, 17], [225, 65, 17], [235, 45, 17], [235, 55, 17], [235, 60, 17], [235, 65, 17],
  [215, 55, 18], [225, 40, 18], [225, 45, 18], [225, 55, 18], [225, 60, 18], [235, 40, 18], [235, 45, 18], [235, 50, 18], [235, 55, 18], [235, 60, 18], [245, 40, 18], [245, 45, 18], [255, 55, 18],
  [225, 40, 19], [235, 35, 19], [235, 55, 19], [245, 40, 19], [245, 45, 19], [255, 50, 19],
  [245, 40, 20], [255, 45, 20]
].map(([szer, profil, felga]) => ({ szer, profil, felga }));

export const slugOpony = (o: Opona) => `${o.szer}-${o.profil}-r${o.felga}`;
export function oponaZeSlugu(s: string): Opona | null {
  const m = s.match(/^(\d{3})-(\d{2})-r(\d{2})$/);
  return m ? { szer: Number(m[1]), profil: Number(m[2]), felga: Number(m[3]) } : null;
}

export interface Zamiennik {
  opona: Opona;
  roznicaProc: number;
  roznicaMm: number;
  przy100: number;
}

/** Rozmiary o średnicy koła różniącej się najwyżej o `tolerancja` % (felga ±1 cal, szerokość ±30 mm) */
export function zamienniki(o: Opona, tolerancja = 2.5, limit = 30): Zamiennik[] {
  const d = srednicaKola(o);
  const out: Zamiennik[] = [];
  for (let felga = o.felga - 1; felga <= o.felga + 2; felga++) {
    for (let szer = o.szer - 30; szer <= o.szer + 30; szer += 10) {
      for (let profil = 25; profil <= 80; profil += 5) {
        const z = { szer, profil, felga };
        if (szer === o.szer && profil === o.profil && felga === o.felga) continue;
        const dz = srednicaKola(z);
        const proc = ((dz - d) / d) * 100;
        if (Math.abs(proc) <= tolerancja) out.push({ opona: z, roznicaProc: proc, roznicaMm: dz - d, przy100: (100 * dz) / d });
      }
    }
  }
  return out.sort((a, b) => Math.abs(a.roznicaProc) - Math.abs(b.roznicaProc)).slice(0, limit);
}

/** Typowa szerokość felgi (J) dla opony – do podpowiedzi */
export function typowaFelga(szer: number): number {
  return Math.round(((szer * 0.8) / 25.4) * 2) / 2;
}
