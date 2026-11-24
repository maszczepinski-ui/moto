'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Copy, Minus, Plus, RotateCcw } from 'lucide-react';
import { ZAKRES_SREDNICY, dopasowanie, etEfektywne, nazwaOpony, srednicaKola, szerokoscBieznika, szerokoscNaFeldze, wysokoscBoku, type Kolo } from '@/lib/narzedzia/felgi';

// Kalkulator felg, opon i ET: dwa koła (seryjne i nowe), suwaki z przyciskami +/−,
// dwa schematy SVG (przekrój od czoła auta i widok z boku) oraz karty wyników.
// Wszystko liczone na bieżąco; rysunek „dojeżdża” do nowych wartości płynną animacją (requestAnimationFrame).

type Pelne = Required<Kolo>;

const SERYJNE: Pelne = { szer: 205, profil: 55, felga: 16, j: 6.5, et: 46, dystans: 0 };
const NOWE: Pelne = { szer: 225, profil: 45, felga: 17, j: 7.5, et: 40, dystans: 0 };

const POMARANCZ = '#f97316';
const SZARY = '#64748b';

const pl = (n: number, m = 1) => n.toLocaleString('pl-PL', { minimumFractionDigits: m, maximumFractionDigits: m });
const zeZnakiem = (n: number, m = 1) => `${n > 0.05 ? '+' : n < -0.05 ? '−' : ''}${pl(Math.abs(n), m)}`;

/* ───────────── animacja ───────────── */

/** Płynnie podąża za wartościami docelowymi (ok. 250 ms, wygaszanie) */
function usePlynnie(cel: number[]): number[] {
  const [stan, setStan] = useState(cel);
  const biezace = useRef(cel);
  const klucz = cel.join('|');
  useEffect(() => {
    const start = [...biezace.current];
    const t0 = performance.now();
    let id = 0;
    const krok = (t: number) => {
      const p = Math.min(1, (t - t0) / 250);
      const e = 1 - Math.pow(1 - p, 3);
      const nowe = cel.map((c, i) => (start[i] ?? c) + (c - (start[i] ?? c)) * e);
      biezace.current = nowe;
      setStan(nowe);
      if (p < 1) id = requestAnimationFrame(krok);
    };
    id = requestAnimationFrame(krok);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klucz]);
  return stan;
}

const doTablicy = (k: Pelne) => [k.szer, k.profil, k.felga, k.j, k.et, k.dystans];
const zTablicy = (t: number[]): Pelne => ({ szer: t[0], profil: t[1], felga: t[2], j: t[3], et: t[4], dystans: t[5] });

/* ───────────── geometria ───────────── */

/** Wymiary jednego koła w mm. Oś x od powierzchni piasty (+ na zewnątrz auta), r = promień od osi koła. */
function geometria(k: Pelne) {
  const etE = etEfektywne(k);
  const xc = -etE; // środek felgi
  const felgaMm = k.j * 25.4;
  const przekroj = szerokoscNaFeldze(k.szer, k.j);
  const bieznik = szerokoscBieznika(k.szer);
  const rFelgi = (k.felga * 25.4) / 2;
  const R = srednicaKola(k) / 2;
  return { etE, xc, felgaMm, przekroj, bieznik, rFelgi, R, bok: wysokoscBoku(k), wew: xc - przekroj / 2, zew: xc + przekroj / 2 };
}

function porownaj(s: Pelne, n: Pelne) {
  const a = geometria(s);
  const b = geometria(n);
  return {
    a,
    b,
    /** + = nowa opona bliżej amortyzatora */
    doSrodka: a.wew - b.wew,
    /** + = nowa opona dalej na zewnątrz */
    naZewnatrz: b.zew - a.zew,
    srednicaMm: (b.R - a.R) * 2,
    srednicaProc: ((b.R - a.R) / a.R) * 100,
    przeswit: b.R - a.R,
    stosunek: b.R / a.R
  };
}

/* ───────────── sterowanie ───────────── */

function Suwak({ id, etykieta, wartosc, min, max, krok, jedn, miejsca = 0, ustaw }: { id: string; etykieta: string; wartosc: number; min: number; max: number; krok: number; jedn: string; miejsca?: number; ustaw: (v: number) => void }) {
  const zmien = (v: number) => ustaw(Math.min(max, Math.max(min, Math.round(v / krok) * krok)));
  const przycisk = 'w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition';
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-400">
          {etykieta}
        </label>
        <span className="text-sm font-bold tabular-nums text-white">
          {pl(wartosc, miejsca)} <span className="text-slate-500 font-normal">{jedn}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={przycisk} onClick={() => zmien(wartosc - krok)} disabled={wartosc <= min} aria-label={`${etykieta}: mniej`}>
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
        <input id={id} type="range" min={min} max={max} step={krok} value={wartosc} onChange={(e) => zmien(Number(e.target.value))} className="flex-1 h-2 accent-orange-500 cursor-pointer" />
        <button type="button" className={przycisk} onClick={() => zmien(wartosc + krok)} disabled={wartosc >= max} aria-label={`${etykieta}: więcej`}>
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Panel({ id, tytul, nowe, k, ustaw, akcja }: { id: string; tytul: string; nowe: boolean; k: Pelne; ustaw: (k: Pelne) => void; akcja?: React.ReactNode }) {
  const u = (klucz: keyof Pelne) => (v: number) => ustaw({ ...k, [klucz]: v });
  return (
    <fieldset className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-4 sm:p-5 space-y-4">
      <legend className="sr-only">{tytul}</legend>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg width="26" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="26" y2="3" stroke={nowe ? POMARANCZ : SZARY} strokeWidth="2" strokeDasharray={nowe ? undefined : '5 4'} />
          </svg>
          <h3 className="text-sm font-extrabold text-white">{tytul}</h3>
        </div>
        {akcja}
      </div>
      <p className="text-xs text-slate-400 tabular-nums">
        {nazwaOpony(k)} · {pl(k.j, 1)}J ET{k.et}
        {k.dystans ? ` + dystans ${k.dystans} mm` : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <Suwak id={`${id}-j`} etykieta="Szerokość felgi" wartosc={k.j} min={5.5} max={12} krok={0.5} jedn="″" miejsca={1} ustaw={u('j')} />
        <Suwak id={`${id}-f`} etykieta="Średnica felgi" wartosc={k.felga} min={14} max={22} krok={1} jedn="″" ustaw={u('felga')} />
        <Suwak id={`${id}-et`} etykieta="Osadzenie ET" wartosc={k.et} min={-20} max={65} krok={1} jedn="mm" ustaw={u('et')} />
        <Suwak id={`${id}-d`} etykieta="Dystans" wartosc={k.dystans} min={0} max={50} krok={1} jedn="mm" ustaw={u('dystans')} />
        <Suwak id={`${id}-s`} etykieta="Szerokość opony" wartosc={k.szer} min={155} max={335} krok={10} jedn="mm" ustaw={u('szer')} />
        <Suwak id={`${id}-p`} etykieta="Profil opony" wartosc={k.profil} min={25} max={80} krok={5} jedn="%" ustaw={u('profil')} />
      </div>
    </fieldset>
  );
}

/* ───────────── schemat 1: przekrój od czoła auta ───────────── */

function Przekroj({ s, n }: { s: Pelne; n: Pelne }) {
  const c = porownaj(s, n);
  const { a, b } = c;
  const W = 540;
  const H = 540;
  // stałe elementy auta – umownie względem koła seryjnego: 18 mm do amortyzatora, rant błotnika 12 mm za oponą
  const strutX = a.wew - 18;
  const blotX = a.zew + 12;
  const blotGora = a.R + 30;
  // zakres widoku (mm): poziomo od amortyzatora do strzałki wysokości, pionowo całe koło
  const minX = Math.min(strutX - 30, b.wew) - 6;
  const maxX = Math.max(blotX + 4, b.zew) + 60;
  const rMax = Math.max(blotGora, b.R) + 10;
  const k = Math.min((W - 40) / (maxX - minX), (H - 90) / (2 * rMax));
  const szerRys = (maxX - minX) * k;
  const X = (x: number) => (W - szerRys) / 2 + (x - minX) * k;
  const cy = 52 + rMax * k;
  const Y = (r: number) => cy - r * k;

  /** przekrój opony nad felgą; znak = 1 górna część, −1 dolna */
  const opona = (g: ReturnType<typeof geometria>, znak: 1 | -1) => {
    const flansz = 15;
    const xl = g.xc - g.felgaMm / 2;
    const xr = g.xc + g.felgaMm / 2;
    const yb = g.rFelgi + flansz * 0.6;
    const bok = g.R - yb;
    const pol = Math.max(g.przekroj / 2, g.felgaMm / 2);
    const t = g.bieznik / 2;
    const z = Math.min(10, bok * 0.25);
    const y = (r: number) => Y(znak * r);
    return [
      `M ${X(xl)} ${y(yb)}`,
      `C ${X(g.xc - pol)} ${y(yb + bok * 0.35)} ${X(g.xc - pol)} ${y(yb + bok * 0.78)} ${X(g.xc - t)} ${y(g.R - z)}`,
      `Q ${X(g.xc - t)} ${y(g.R)} ${X(g.xc - t + z)} ${y(g.R)}`,
      `L ${X(g.xc + t - z)} ${y(g.R)}`,
      `Q ${X(g.xc + t)} ${y(g.R)} ${X(g.xc + t)} ${y(g.R - z)}`,
      `C ${X(g.xc + pol)} ${y(yb + bok * 0.78)} ${X(g.xc + pol)} ${y(yb + bok * 0.35)} ${X(xr)} ${y(yb)}`
    ].join(' ');
  };

  /** sylwetka felgi (widok z przodu, jak na rysunkach technicznych): ranty, półki, wklęsły „rowek” i rowki po stronie zewnętrznej */
  const fx = (g: ReturnType<typeof geometria>, u: number) => X(g.xc - g.felgaMm / 2 + u * g.felgaMm);
  const obrysFelgi = (g: ReturnType<typeof geometria>) => {
    const r = g.rFelgi;
    // [udział szerokości, promień] – górna połowa od strony auta do strony zewnętrznej
    const gora: [number, number][] = [
      [0, r + 12], [0.012, r + 15], [0.04, r + 15], [0.048, r + 3], [0.14, r + 3], [0.165, r],
      [0.23, r - 22], [0.5, r - 22], [0.6, r], [0.952, r + 3], [0.96, r + 15], [0.988, r + 15], [1, r + 12]
    ];
    const pkt = (u: number, rr: number) => `${fx(g, u)} ${Y(rr)}`;
    const top = gora.map(([u, rr], i) => `${i === 0 ? 'M' : 'L'} ${pkt(u, rr)}`).join(' ');
    const dol = [...gora].reverse().map(([u, rr]) => `L ${pkt(u, -rr)}`).join(' ');
    return `${top} ${dol} Z`;
  };
  /** pionowe kreski na krawędziach półek i rowkach (cieniowanie jak na rysunku) */
  const kreskiFelgi = (g: ReturnType<typeof geometria>) => {
    const r = g.rFelgi;
    const linie: [number, number][] = [[0.048, r + 3], [0.14, r + 3], [0.23, r - 22], [0.5, r - 22], [0.6, r], [0.68, r + 0.6], [0.76, r + 1.3], [0.84, r + 2], [0.9, r + 2.6]];
    return linie.map(([u, rr]) => `M ${fx(g, u)} ${Y(rr)} L ${fx(g, u)} ${Y(-rr)}`).join(' ');
  };

  const kolorZmiany = (mm: number, prog: number) => (mm > prog ? '#f43f5e' : mm > 2 ? '#fbbf24' : '#34d399');
  const yWew = Y(Math.min(a.rFelgi, b.rFelgi) + Math.min(a.bok, b.bok) * 0.5);
  const yZew = Y(Math.max(a.R, b.R) - Math.min(a.bok, b.bok) * 0.28);
  const xWys = maxX - 26;
  const wymiar = (x1: number, y1: number, x2: number, y2: number, kolor: string) =>
    Math.hypot(x2 - x1, y2 - y1) < 1.5 ? (
      <circle cx={x1} cy={y1} r={2.5} fill={kolor} />
    ) : (
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={kolor} strokeWidth={1.6} markerStart="url(#grot)" markerEnd="url(#grot)" style={{ color: kolor }} />
    );
  const yEt = Y(-b.rFelgi * 0.55);
  const etE = etEfektywne(n);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Przekrój koła od czoła auta. Nowa felga ET ${pl(etE, 0)}. Od strony zawieszenia ${zeZnakiem(-c.doSrodka)} mm, na zewnątrz ${zeZnakiem(c.naZewnatrz)} mm, wysokość ${zeZnakiem(c.przeswit)} mm`}>
      <defs>
        <marker id="grot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" />
        </marker>
        {/* felga jak na rysunku technicznym: jasny metal, ciemniejsze ranty */}
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#94a3b8" />
          <stop offset="0.08" stopColor="#cbd5e1" />
          <stop offset="0.3" stopColor="#f1f5f9" />
          <stop offset="0.5" stopColor="#e2e8f0" />
          <stop offset="0.75" stopColor="#cbd5e1" />
          <stop offset="0.95" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="guma" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="0.5" stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <text x={20} y={24} className="fill-slate-400" style={{ fontSize: 13, fontWeight: 600 }}>
        PRZEKRÓJ – WIDOK OD CZOŁA AUTA
      </text>

      {/* amortyzator i nadkole z rantem błotnika (górna część) */}
      <rect x={X(strutX) - 14 * k} y={Y(blotGora - 10)} width={14 * k} height={Y(-a.rFelgi * 0.2) - Y(blotGora - 10)} rx={4} fill="none" stroke="#475569" strokeWidth={1.4} />
      <text x={X(strutX - 7)} y={Y(a.rFelgi * 0.2)} textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90 ${X(strutX - 7)} ${Y(a.rFelgi * 0.2)})`} className="fill-slate-500" style={{ fontSize: 11 }}>
        amortyzator
      </text>
      <path d={`M ${X(strutX - 7)} ${Y(blotGora - 10)} Q ${X(strutX - 7)} ${Y(blotGora)} ${X(strutX + 20)} ${Y(blotGora)} L ${X(blotX - 20)} ${Y(blotGora)} Q ${X(blotX)} ${Y(blotGora)} ${X(blotX)} ${Y(blotGora - 20)} L ${X(blotX)} ${Y(a.R - a.bok * 0.4)}`} fill="none" stroke="#475569" strokeWidth={1.4} />
      <text x={X(blotX) + 6} y={Y(blotGora - 6)} className="fill-slate-500" style={{ fontSize: 12 }}>
        błotnik
      </text>


      {/* nowe koło: guma i metalowa felga */}
      <path d={`${opona(b, 1)} Z`} fill="url(#guma)" stroke={POMARANCZ} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`${opona(b, -1)} Z`} fill="url(#guma)" stroke={POMARANCZ} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={obrysFelgi(b)} fill="url(#metal)" stroke={POMARANCZ} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={kreskiFelgi(b)} fill="none" stroke="#64748b" strokeWidth={0.8} strokeOpacity={0.7} />

      {/* obecne koło – sam przerywany obrys */}
      <path d={opona(a, 1)} fill="none" stroke={SZARY} strokeWidth={1.4} strokeDasharray="5 4" strokeLinejoin="round" />
      <path d={opona(a, -1)} fill="none" stroke={SZARY} strokeWidth={1.4} strokeDasharray="5 4" strokeLinejoin="round" />
      <path d={obrysFelgi(a)} fill="none" stroke={SZARY} strokeWidth={1.2} strokeDasharray="5 4" strokeLinejoin="round" />

      {/* linia środkowa felgi (czerwona) i przylga do piasty (niebieska) */}
      <line x1={X(b.xc)} y1={Y(b.R + 8)} x2={X(b.xc)} y2={Y(-b.R - 8)} stroke="#ef4444" strokeWidth={1.4} strokeDasharray="6 4" />
      <line x1={X(n.dystans)} y1={Y(b.R + 8)} x2={X(n.dystans)} y2={Y(-b.R - 8)} stroke="#3b82f6" strokeWidth={1.4} strokeDasharray="6 4" />
      {/* ET: odległość między linią środkową a przylgą */}
      {Math.abs(etE) > 1 && (
        <line x1={X(b.xc)} y1={yEt} x2={X(n.dystans)} y2={yEt} stroke="#60a5fa" strokeWidth={1.6} markerStart="url(#grot)" markerEnd="url(#grot)" style={{ color: '#60a5fa' }} />
      )}
      <text x={X(n.dystans) + (b.xc <= n.dystans ? 8 : -8)} textAnchor={b.xc <= n.dystans ? 'start' : 'end'} y={Y(-b.R - 8) + 22} fill="#60a5fa" style={{ fontSize: 15, fontWeight: 700 }}>
        ET {pl(etE, 0)}
        {n.dystans > 0 ? ` (z dystansem ${n.dystans} mm)` : ''}
      </text>
      <text x={X(b.xc) + (b.xc <= n.dystans ? -8 : 8)} y={Y(-b.R - 8) + 22} textAnchor={b.xc <= n.dystans ? 'end' : 'start'} fill="#f87171" style={{ fontSize: 13, fontWeight: 600 }}>
        linia środkowa
      </text>

      {/* trzy strzałki wymiarowe */}
      {wymiar(X(a.wew), yWew, X(b.wew), yWew, kolorZmiany(c.doSrodka, 5))}
      <text x={X(Math.min(a.wew, b.wew)) - 6} y={yWew - 10} textAnchor="end" fill={kolorZmiany(c.doSrodka, 5)} style={{ fontSize: 15, fontWeight: 700 }}>
        {zeZnakiem(-c.doSrodka)} mm
      </text>
      {wymiar(X(a.zew), yZew, X(b.zew), yZew, kolorZmiany(c.naZewnatrz, 10))}
      <text x={X(Math.max(a.zew, b.zew)) + 8} y={yZew + 18} fill={kolorZmiany(c.naZewnatrz, 10)} style={{ fontSize: 15, fontWeight: 700 }}>
        {zeZnakiem(c.naZewnatrz)} mm
      </text>
      {wymiar(X(xWys), Y(a.R), X(xWys), Y(b.R), '#38bdf8')}
      <line x1={X(a.zew)} y1={Y(a.R)} x2={X(xWys + 6)} y2={Y(a.R)} stroke={SZARY} strokeWidth={0.8} strokeDasharray="2 3" />
      <line x1={X(b.zew)} y1={Y(b.R)} x2={X(xWys + 6)} y2={Y(b.R)} stroke={POMARANCZ} strokeWidth={0.8} strokeDasharray="2 3" />
      <text x={X(xWys) + 8} y={(Y(a.R) + Y(b.R)) / 2 + 5} fill="#38bdf8" style={{ fontSize: 15, fontWeight: 700 }}>
        {zeZnakiem(c.przeswit)} mm
      </text>

      <text x={W - 20} y={24} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12 }}>
        ← środek auta · na zewnątrz →
      </text>
    </svg>
  );
}

/* ───────────── schemat 2: widok z boku ───────────── */

function WidokZBoku({ s, n }: { s: Pelne; n: Pelne }) {
  const c = porownaj(s, n);
  const W = 340;
  const H = 400;
  const cx = W / 2;
  const cy = 190;
  const k = 140 / Math.max(c.a.R, c.b.R);
  const okrag = (r: number, kolor: string, kreska?: string, grubosc = 1.4) => <circle cx={cx} cy={cy} r={r * k} fill="none" stroke={kolor} strokeWidth={grubosc} strokeDasharray={kreska} />;
  const szprychy = Array.from({ length: 5 }, (_, i) => {
    const kat = (i * 72 - 90) * (Math.PI / 180);
    const r1 = 22;
    const r2 = c.b.rFelgi * k - 6;
    return <line key={i} x1={cx + Math.cos(kat) * r1} y1={cy + Math.sin(kat) * r1} x2={cx + Math.cos(kat) * r2} y2={cy + Math.sin(kat) * r2} stroke={POMARANCZ} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" />;
  });
  const rb = c.b.R * k;
  const rf = c.b.rFelgi * k;
  const zA = cy + c.a.R * k;
  const zB = cy + rb;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Widok z boku: średnica koła ${zeZnakiem(c.srednicaMm)} mm (${zeZnakiem(c.srednicaProc, 2)}%), prześwit ${zeZnakiem(c.przeswit)} mm`}>
      <text x={16} y={22} className="fill-slate-400" style={{ fontSize: 12, fontWeight: 600 }}>
        WIDOK Z BOKU
      </text>
      {/* guma nowego koła – pierścień między obrysem opony a felgą */}
      <path d={`M ${cx - rb} ${cy} a ${rb} ${rb} 0 1 0 ${2 * rb} 0 a ${rb} ${rb} 0 1 0 ${-2 * rb} 0 M ${cx - rf} ${cy} a ${rf} ${rf} 0 1 1 ${2 * rf} 0 a ${rf} ${rf} 0 1 1 ${-2 * rf} 0`} fill={POMARANCZ} fillOpacity={0.12} fillRule="evenodd" />
      {szprychy}
      <circle cx={cx} cy={cy} r={14} fill="#1e293b" stroke={POMARANCZ} strokeWidth={1.2} />
      {okrag(c.a.R, SZARY, '5 4')}
      {okrag(c.a.rFelgi, SZARY, '5 4')}
      {okrag(c.b.R, POMARANCZ, undefined, 1.8)}
      {okrag(c.b.rFelgi, POMARANCZ, undefined, 1.6)}
      {/* jezdnia dla obu kół – widać zmianę prześwitu */}
      <line x1={24} y1={zA} x2={W - 24} y2={zA} stroke={SZARY} strokeWidth={1} strokeDasharray="5 4" />
      <line x1={24} y1={zB} x2={W - 24} y2={zB} stroke={POMARANCZ} strokeWidth={1.2} />
      <text x={W - 24} y={Math.max(zA, zB) + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10.5 }}>
        jezdnia
      </text>
      <text x={cx} y={H - 38} textAnchor="middle" className="fill-white" style={{ fontSize: 14, fontWeight: 700 }}>
        Średnica: {zeZnakiem(c.srednicaMm)} mm ({zeZnakiem(c.srednicaProc, 2)}%)
      </text>
      <text x={cx} y={H - 16} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12 }}>
        Prześwit: {zeZnakiem(c.przeswit)} mm · bok opony {Math.round(c.a.bok)} → {Math.round(c.b.bok)} mm
      </text>
    </svg>
  );
}

/* ───────────── wyniki ───────────── */

type Ton = 'zielony' | 'zolty' | 'czerwony';
const TONY: Record<Ton, string> = {
  zielony: 'ring-emerald-500/30 bg-emerald-500/5',
  zolty: 'ring-amber-500/40 bg-amber-500/5',
  czerwony: 'ring-rose-500/50 bg-rose-500/10'
};
const KROPKA: Record<Ton, string> = { zielony: 'bg-emerald-400', zolty: 'bg-amber-400', czerwony: 'bg-rose-500' };

function Karta({ ton, etykieta, wartosc, opis, children }: { ton: Ton; etykieta: string; wartosc: string; opis: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl ring-1 p-4 ${TONY[ton]}`}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span className={`w-2 h-2 rounded-full ${KROPKA[ton]}`} aria-hidden="true" /> {etykieta}
      </div>
      <div className="text-xl sm:text-2xl font-black text-white mt-1.5 tabular-nums">{wartosc}</div>
      <div className="text-sm text-slate-300 mt-1">{opis}</div>
      {children}
    </div>
  );
}

function Wyniki({ s, n }: { s: Pelne; n: Pelne }) {
  const c = porownaj(s, n);
  const luz = -c.doSrodka;
  const tWew: Ton = c.doSrodka > 5 ? 'czerwony' : c.doSrodka > 2 ? 'zolty' : 'zielony';
  const tZew: Ton = c.naZewnatrz > 10 ? 'czerwony' : c.naZewnatrz > 3 ? 'zolty' : 'zielony';
  const pozaZakresem = c.srednicaProc < ZAKRES_SREDNICY.od || c.srednicaProc > ZAKRES_SREDNICY.do;
  const tSr: Ton = pozaZakresem ? (Math.abs(c.srednicaProc) > 3 ? 'czerwony' : 'zolty') : 'zielony';
  const d = dopasowanie(n.szer, n.j);
  const dS = dopasowanie(s.szer, s.j);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3" aria-live="polite">
      <Karta ton={tWew} etykieta="Od wewnątrz (zawieszenie)" wartosc={`${zeZnakiem(luz)} mm`} opis={Math.abs(luz) < 0.05 ? 'bez zmian względem seryjnego koła' : luz < 0 ? `${pl(Math.abs(luz))} mm bliżej amortyzatora` : `${pl(luz)} mm więcej miejsca przy zawieszeniu`} />
      <Karta ton={tZew} etykieta="Od zewnątrz (błotnik)" wartosc={`${zeZnakiem(c.naZewnatrz)} mm`} opis={Math.abs(c.naZewnatrz) < 0.05 ? 'bez zmian względem seryjnego koła' : c.naZewnatrz > 0 ? `${pl(c.naZewnatrz)} mm bardziej wysunięte na zewnątrz` : `${pl(-c.naZewnatrz)} mm głębiej schowane w nadkolu`} />
      <Karta ton={tSr} etykieta="Średnica całkowita koła" wartosc={`${zeZnakiem(c.srednicaMm)} mm (${zeZnakiem(c.srednicaProc, 2)}%)`} opis={pozaZakresem ? `Uwaga: poza bezpiecznym zakresem zamienników (od ${pl(ZAKRES_SREDNICY.od, 0)}% do +${pl(ZAKRES_SREDNICY.do)}%).` : `W bezpiecznym zakresie zamienników (od ${pl(ZAKRES_SREDNICY.od, 0)}% do +${pl(ZAKRES_SREDNICY.do)}%).`}>
        <div className="text-xs text-slate-400 mt-1 tabular-nums">
          {Math.round(srednicaKola(s))} → {Math.round(srednicaKola(n))} mm · prześwit {zeZnakiem(c.przeswit)} mm
        </div>
      </Karta>
      <Karta ton={Math.abs(c.srednicaProc) > 3 ? 'czerwony' : Math.abs(c.srednicaProc) > 1.5 ? 'zolty' : 'zielony'} etykieta="Przekłamanie licznika" wartosc={`${zeZnakiem(c.srednicaProc, 1)}%`} opis={c.stosunek > 1.0005 ? 'Jedziesz szybciej, niż pokazuje licznik.' : c.stosunek < 0.9995 ? 'Jedziesz wolniej, niż pokazuje licznik.' : 'Licznik pokazuje tak samo jak na seryjnych kołach.'}>
        <table className="w-full mt-2 text-sm tabular-nums">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="text-left font-semibold py-1">Licznik</th>
              <th className="text-right font-semibold py-1">Realnie (GPS)</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {[50, 100, 140].map((v) => (
              <tr key={v} className="border-t border-slate-800">
                <td className="py-1">{v} km/h</td>
                <td className="py-1 text-right font-bold">{pl(v * c.stosunek)} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Karta>
      <Karta ton={d.ocena} etykieta="Opona do felgi (nowe koło)" wartosc={d.nazwa} opis={d.opis}>
        <div className="text-xs text-slate-400 mt-1 tabular-nums">
          {n.szer} mm na {pl(n.j, 1)}J ({Math.round(n.j * 25.4)} mm) · seryjnie: {dS.nazwa.toLowerCase()}
        </div>
      </Karta>
      <Karta ton={n.dystans > 25 ? 'zolty' : 'zielony'} etykieta="ET z dystansem" wartosc={`ET ${pl(etEfektywne(s), 0)} → ET ${pl(etEfektywne(n), 0)}`} opis="Dystans działa jak mniejsze ET – każdy milimetr dystansu wysuwa koło o milimetr.">
        <div className="text-xs text-slate-400 mt-1">Środek felgi przesuwa się o {zeZnakiem(c.b.xc - c.a.xc)} mm. Przy grubych dystansach potrzebne są dłuższe śruby lub dystanse z własnymi szpilkami.</div>
      </Karta>
    </div>
  );
}

/* ───────────── całość ───────────── */

export default function KalkulatorFelg({ start }: { start?: Kolo }) {
  const seryjne: Pelne = start ? { dystans: 0, ...start } : SERYJNE;
  const [s, setS] = useState<Pelne>(seryjne);
  const [n, setN] = useState<Pelne>(start ? { ...seryjne, szer: Math.min(335, seryjne.szer + 20), j: Math.min(12, seryjne.j + 0.5), et: seryjne.et - 5 } : NOWE);
  const animacja = usePlynnie([...doTablicy(s), ...doTablicy(n)]);
  const sA = zTablicy(animacja.slice(0, 6));
  const nA = zTablicy(animacja.slice(6, 12));
  const maly = 'inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 transition';
  return (
    <section className="rounded-3xl bg-slate-950 ring-1 ring-slate-800 p-3 sm:p-6 space-y-5 text-slate-200" aria-label="Kalkulator felg, opon i ET">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel
          id="ks"
          tytul="Koło obecne (seryjne)"
          nowe={false}
          k={s}
          ustaw={setS}
          akcja={
            <button type="button" className={maly} onClick={() => setS(seryjne)}>
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Domyślne
            </button>
          }
        />
        <Panel
          id="kn"
          tytul="Koło nowe"
          nowe
          k={n}
          ustaw={setN}
          akcja={
            <span className="flex gap-1.5">
              <button type="button" className={maly} onClick={() => setN(s)}>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" /> Jak seryjne
              </button>
              <button type="button" className={maly} onClick={() => { setS(n); setN(s); }} aria-label="Zamień koła miejscami">
                <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3">
        <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-2 sm:p-3">
          <Przekroj s={sA} n={nA} />
        </div>
        <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-2 sm:p-3">
          <WidokZBoku s={sA} n={nA} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 px-1">
        <span className="flex items-center gap-2">
          <svg width="26" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="26" y2="3" stroke={SZARY} strokeWidth="2" strokeDasharray="5 4" />
          </svg>
          koło obecne
        </span>
        <span className="flex items-center gap-2">
          <svg width="26" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="26" y2="3" stroke={POMARANCZ} strokeWidth="2" />
          </svg>
          koło nowe
        </span>
        <span>Amortyzator i błotnik narysowane umownie względem koła seryjnego.</span>
      </div>

      <Wyniki s={s} n={n} />

      <p className="text-xs text-slate-500 px-1">
        Wyniki są orientacyjne. Rzeczywista szerokość opony zależy od jej modelu (±5 mm), a luz w nadkolu – od konkretnego auta, skrętu kół i ugięcia zawieszenia. Przed zakupem kompletu przymierz koło i sprawdź rozstaw śrub (PCD), otwór centralny oraz indeksy nośności i prędkości.
      </p>
    </section>
  );
}
