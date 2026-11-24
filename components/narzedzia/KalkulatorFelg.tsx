'use client';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { nazwaOpony, ocenSrednice, porownajKola, srednicaKola, typowaFelga, wysokoscBoku, type Kolo, type Ocena } from '@/lib/narzedzia/felgi';
import { KARTA_NARZEDZIA, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const mm = (n: number, znak = false) => `${znak && n > 0 ? '+' : ''}${n.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mm`;
const POLE = 'w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-rust-500 focus:outline-none tabular-nums';

/** Luzy zmierzone przy obecnych kołach (mm) */
interface Luzy {
  /** od wewnętrznego boku opony do amortyzatora / sprężyny */
  zawieszenie: number;
  /** o ile zewnętrzny bok opony jest schowany pod krawędzią błotnika (+) */
  blotnik: number;
  /** od bieżnika do nadkola (w górę) */
  gora: number;
}

function PoleMm({ id, etykieta, wartosc, ustaw, krok = 1, jedn = 'mm' }: { id: string; etykieta: string; wartosc: number; ustaw: (n: number) => void; krok?: number; jedn?: string }) {
  return (
    <label className="block space-y-1" htmlFor={id}>
      <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">{etykieta}</span>
      <span className="relative block">
        <input id={id} type="number" inputMode="decimal" step={krok} value={wartosc} onChange={(e) => ustaw(Number(e.target.value) || 0)} className={`${POLE} pr-9`} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">{jedn}</span>
      </span>
    </label>
  );
}

function PolaKola({ tytul, k, ustaw, id }: { tytul: string; k: Kolo; ustaw: (k: Kolo) => void; id: string }) {
  const p = (klucz: keyof Kolo, etykieta: string, krok: number, jedn: string) => <PoleMm id={`${id}-${klucz}`} etykieta={etykieta} wartosc={k[klucz]} ustaw={(v) => ustaw({ ...k, [klucz]: v })} krok={krok} jedn={jedn} />;
  return (
    <fieldset className="rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-800 p-4 space-y-3">
      <legend className="px-1 text-sm font-extrabold text-slate-900 dark:text-white">{tytul}</legend>
      <div className="grid grid-cols-3 gap-2">
        {p('szer', 'Szerokość opony', 10, 'mm')}
        {p('profil', 'Profil', 5, '%')}
        {p('felga', 'Średnica', 1, '″')}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {p('j', 'Szerokość felgi', 0.5, 'J')}
        {p('et', 'ET (odsadzenie)', 1, 'mm')}
      </div>
      <p className="text-xs text-slate-500">
        {nazwaOpony(k)} na {k.j}J ET{k.et} · koło {Math.round(srednicaKola(k))} mm · typowa felga {typowaFelga(k.szer)}J
      </p>
    </fieldset>
  );
}

export interface WynikLuzow {
  zawieszenie: number;
  blotnik: number;
  gora: number;
}

export function noweLuzy(s: Kolo, n: Kolo, l: Luzy): WynikLuzow {
  const p = porownajKola(s, n);
  return { zawieszenie: l.zawieszenie - p.wewnatrz, blotnik: l.blotnik - p.zewnatrz, gora: l.gora - p.przeswit };
}

const ocenLuz = (mmLuzu: number, ostrzegaj: number): Ocena => (mmLuzu < 0 ? 'czerwony' : mmLuzu < ostrzegaj ? 'zolty' : 'zielony');
const KOLOR: Record<Ocena, string> = { zielony: '#059669', zolty: '#d97706', czerwony: '#e11d48' };

/**
 * Widok od przodu auta na GÓRNĄ część koła w nadkolu (prawe przednie koło).
 * Wszystko w jednej skali. Po lewej amortyzator (środek auta), po prawej krawędź błotnika, u góry nadkole.
 */
function Przekroj({ s, n, l }: { s: Kolo; n: Kolo; l: Luzy }) {
  const p = porownajKola(s, n);
  const w = noweLuzy(s, n, l);
  const W = 800;
  const H = 470;

  // położenia w mm: oś x od powierzchni piasty (+ na zewnątrz auta), oś y od góry starego bieżnika (+ w dół)
  const wewS = -(s.et + p.szerStara / 2);
  const zewS = -s.et + p.szerStara / 2;
  const wewN = -(n.et + p.szerNowa / 2);
  const zewN = -n.et + p.szerNowa / 2;
  const strut = wewS - l.zawieszenie;
  const blot = zewS + l.blotnik;
  const minX = Math.min(strut - 30, wewN) - 10;
  const maxX = Math.max(blot + 10, zewN) + 10;
  const k = Math.min(2.2, 470 / (maxX - minX)); // px na mm
  const ox = 165 - minX * k; // tak, żeby rysunek zaczynał się ok. 165 px od lewej
  const X = (x: number) => ox + x * k;
  const topY = 125; // góra starego bieżnika w px
  const Y = (y: number) => topY + y * k;
  const bokS = wysokoscBoku(s);
  const bokN = wysokoscBoku(n);
  const dyN = -p.przeswit; // nowy bieżnik wyżej o połowę różnicy średnic
  const dol = Math.max(bokS, bokN + dyN) + 55; // ile mm koła pokazujemy w dół

  const kolo = (wew: number, zew: number, bok: number, dy: number, felgaMm: number, et: number, nowe: boolean) => {
    const xc = -et;
    const x1 = X(wew);
    const x2 = X(zew);
    const y1 = Y(dy);
    const yFelgi = Y(dy + bok);
    const r = Math.min(14, (x2 - x1) / 4);
    const fx1 = X(xc - felgaMm / 2);
    const fx2 = X(xc + felgaMm / 2);
    const yDol = Y(dol);
    return (
      <g>
        {/* opona */}
        <path
          d={`M ${x1} ${yDol} L ${x1} ${y1 + r} Q ${x1} ${y1} ${x1 + r} ${y1} L ${x2 - r} ${y1} Q ${x2} ${y1} ${x2} ${y1 + r} L ${x2} ${yDol}`}
          fill={nowe ? 'rgba(30,41,59,0.85)' : 'none'}
          stroke={nowe ? '#0f172a' : '#ea580c'}
          strokeWidth={nowe ? 2 : 3}
          strokeDasharray={nowe ? undefined : '8 6'}
        />
        {/* felga: rant po obu stronach + bęben */}
        {nowe ? (
          <path d={`M ${fx1} ${yDol} L ${fx1} ${yFelgi - 10} L ${fx1 + 6} ${yFelgi - 10} L ${fx1 + 6} ${yFelgi} L ${fx2 - 6} ${yFelgi} L ${fx2 - 6} ${yFelgi - 10} L ${fx2} ${yFelgi - 10} L ${fx2} ${yDol} Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth={1.5} />
        ) : (
          <path d={`M ${fx1} ${yDol} L ${fx1} ${yFelgi - 10} M ${fx2} ${yFelgi - 10} L ${fx2} ${yDol} M ${fx1} ${yFelgi} L ${fx2} ${yFelgi}`} fill="none" stroke="#ea580c" strokeWidth={2} strokeDasharray="6 5" />
        )}
      </g>
    );
  };

  const yStrzZaw = Y(Math.max(bokS, bokN + dyN) * 0.45);
  const yStrzBlot = Y(Math.max(bokS, bokN + dyN) * 0.2);
  const kZaw = KOLOR[ocenLuz(w.zawieszenie, 8)];
  const kBlot = KOLOR[ocenLuz(w.blotnik, 3)];
  const kGora = KOLOR[ocenLuz(w.gora, 15)];
  const etykieta = (x: number, y: number, tekst: string[], kolor: string, anchor: 'start' | 'end' | 'middle') => (
    <text x={x} y={y} textAnchor={anchor} fill={kolor} className="font-bold" style={{ fontSize: 17 }}>
      {tekst.map((t, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 21} style={i > 0 ? { fontSize: 14, fontWeight: 600 } : undefined}>
          {t}
        </tspan>
      ))}
    </text>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img" aria-label={`Luz do zawieszenia ${mm(w.zawieszenie)}, pod błotnikiem ${mm(w.blotnik)}, do nadkola ${mm(w.gora)}`}>
      <rect x={0} y={0} width={W} height={H} rx={18} className="fill-white dark:fill-slate-900" />
      {/* nadkole */}
      <path d={`M ${X(strut) - 20} ${Y(-l.gora)} L ${X(blot)} ${Y(-l.gora)} L ${X(blot)} ${Y(Math.min(bokS, 40))}`} fill="none" stroke="#94a3b8" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      {/* amortyzator */}
      <rect x={X(strut) - 34} y={Y(-l.gora) + 12} width={34} height={Y(dol) - Y(-l.gora) - 12} rx={8} fill="#94a3b8" />
      {/* koła: najpierw nowe (pełne), na wierzchu obrys starego */}
      {kolo(wewN, zewN, bokN, dyN, n.j * 25.4, n.et, true)}
      {kolo(wewS, zewS, bokS, 0, s.j * 25.4, s.et, false)}
      {/* luz do zawieszenia */}
      <line x1={X(strut)} y1={yStrzZaw} x2={X(wewN)} y2={yStrzZaw} stroke={kZaw} strokeWidth={5} strokeLinecap="round" />
      {/* luz pod błotnikiem */}
      <line x1={X(blot)} y1={yStrzBlot} x2={X(zewN)} y2={yStrzBlot} stroke={kBlot} strokeWidth={5} strokeLinecap="round" />
      {/* luz do nadkola */}
      <line x1={X((wewN + zewN) / 2)} y1={Y(-l.gora) + 5} x2={X((wewN + zewN) / 2)} y2={Y(dyN)} stroke={kGora} strokeWidth={5} strokeLinecap="round" />

      {/* opisy na marginesach */}
      {etykieta(X(strut) - 46, yStrzZaw + 6, [`${mm(w.zawieszenie)}`, 'do zawieszenia'], kZaw, 'end')}
      {etykieta(X(blot) + 18, yStrzBlot + 6, [`${mm(w.blotnik)}`, w.blotnik < 0 ? 'wystaje poza błotnik' : 'pod błotnikiem'], kBlot, 'start')}
      {etykieta(X(blot) + 18, Y(-l.gora) + 6, [`${mm(w.gora)}`, 'do nadkola'], kGora, 'start')}
      <text x={X(strut) - 17} y={Y(dol) + 22} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13 }}>
        amortyzator
      </text>
      {/* legenda i kierunki */}
      <g style={{ fontSize: 14 }}>
        <line x1={24} y1={30} x2={56} y2={30} stroke="#ea580c" strokeWidth={3} strokeDasharray="8 6" />
        <text x={64} y={35} className="fill-slate-700 dark:fill-slate-200">obecne koło</text>
        <rect x={180} y={21} width={30} height={18} rx={4} fill="rgba(30,41,59,0.85)" />
        <text x={218} y={35} className="fill-slate-700 dark:fill-slate-200">nowe koło</text>
        <text x={24} y={H - 18} className="fill-slate-400">← środek auta</text>
        <text x={W - 24} y={H - 18} textAnchor="end" className="fill-slate-400">na zewnątrz →</text>
        <text x={W - 24} y={35} textAnchor="end" className="fill-slate-400">widok od przodu, górna część koła</text>
      </g>
    </svg>
  );
}

const OPIS_FELGI = { ok: 'pasuje do opony', 'za-waska': 'za wąska dla tej opony', 'za-szeroka': 'za szeroka dla tej opony' };

export default function KalkulatorFelg({ start }: { start?: Kolo }) {
  const domyslne: Kolo = start ?? { szer: 205, profil: 55, felga: 16, j: 6.5, et: 46 };
  const [s, setS] = useState<Kolo>(domyslne);
  const [n, setN] = useState<Kolo>(start ? { ...domyslne, szer: domyslne.szer + 20, et: domyslne.et - 5, j: domyslne.j + 0.5 } : { szer: 215, profil: 45, felga: 17, j: 7, et: 43 });
  const [l, setL] = useState<Luzy>({ zawieszenie: 15, blotnik: 10, gora: 30 });
  const p = porownajKola(s, n);
  const w = noweLuzy(s, n, l);
  const oZaw = ocenLuz(w.zawieszenie, 8);
  const oBlot = ocenLuz(w.blotnik, 3);
  const oGora = ocenLuz(w.gora, 15);
  const oS = ocenSrednice(p.roznicaProc);
  const oceny: Ocena[] = [oZaw, oBlot, oGora, oS, p.felgaNowa === 'ok' ? 'zielony' : 'zolty'];
  const najgorsza: Ocena = oceny.includes('czerwony') ? 'czerwony' : oceny.includes('zolty') ? 'zolty' : 'zielony';
  const tytul = najgorsza === 'zielony' ? 'Nowe koła powinny się zmieścić' : najgorsza === 'zolty' ? 'Na granicy – przymierz koło przed zakupem kompletu' : 'Nowe koła prawdopodobnie nie zmieszczą się bez przeróbek';
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator felg, opon i ET">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <PolaKola id="st" tytul="Obecne koła" k={s} ustaw={setS} />
        <button type="button" onClick={() => { setS(n); setN(s); }} className="mx-auto w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200" aria-label="Zamień obecne i nowe koła">
          <ArrowLeftRight className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
        <PolaKola id="nw" tytul="Nowe koła" k={n} ustaw={setN} />
      </div>
      <fieldset className="rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-800 p-4 space-y-3">
        <legend className="px-1 text-sm font-extrabold text-slate-900 dark:text-white">Luzy przy obecnych kołach</legend>
        <p className="text-xs text-slate-500">Zmierz linijką przy kole skręconym na wprost. Jeśli nie mierzysz, zostaw wartości przykładowe – wynik pokaże wtedy tylko kierunek zmian.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <PoleMm id="lz-z" etykieta="Opona ↔ amortyzator" wartosc={l.zawieszenie} ustaw={(v) => setL({ ...l, zawieszenie: v })} />
          <PoleMm id="lz-b" etykieta="Opona schowana pod błotnikiem" wartosc={l.blotnik} ustaw={(v) => setL({ ...l, blotnik: v })} />
          <PoleMm id="lz-g" etykieta="Bieżnik ↔ nadkole (w górę)" wartosc={l.gora} ustaw={(v) => setL({ ...l, gora: v })} />
        </div>
      </fieldset>

      <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <Przekroj s={s} n={n} l={l} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { o: oZaw, t: 'Do zawieszenia', z: l.zawieszenie, na: w.zawieszenie, opis: 'od wewnętrznego boku opony' },
          { o: oBlot, t: 'Pod błotnikiem', z: l.blotnik, na: w.blotnik, opis: w.blotnik < 0 ? 'opona wystaje poza błotnik' : 'ile opona jest schowana' },
          { o: oGora, t: 'Do nadkola', z: l.gora, na: w.gora, opis: 'nad bieżnikiem, bez ugięcia' }
        ].map((x) => (
          <div key={x.t} className={`rounded-2xl p-4 ring-1 ${x.o === 'zielony' ? 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900' : x.o === 'zolty' ? 'bg-amber-50 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900' : 'bg-rose-50 ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900'}`}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{x.t}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {mm(x.z)} → {mm(x.na)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">{x.opis}</div>
          </div>
        ))}
      </div>

      <Werdykt ton={najgorsza} tytul={tytul}>
        {oBlot === 'czerwony' && <p>Opona wyjdzie {mm(-w.blotnik)} poza krawędź błotnika – to problem na badaniu technicznym i ryzyko ocierania.</p>}
        {oZaw !== 'zielony' && <p>Do amortyzatora zostanie tylko {mm(w.zawieszenie)}{oZaw === 'czerwony' ? ' – opona będzie ocierać' : ' – przy skręcie i ugięciu może ocierać'}.</p>}
        {oGora !== 'zielony' && <p>Nad bieżnikiem zostanie {mm(w.gora)} – przy dobiciu zawieszenia opona może trzeć o nadkole.</p>}
        {oS !== 'zielony' && <p>Średnica koła zmienia się o {p.roznicaProc.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}% – licznik i systemy (ABS, ESP) będą liczyć prędkość inaczej.</p>}
        {p.felgaNowa !== 'ok' && <p>Felga {n.j}J jest {OPIS_FELGI[p.felgaNowa]} {n.szer} mm.</p>}
        {najgorsza === 'zielony' && <p>Sprawdź jeszcze rozstaw śrub (PCD), otwór centralny i indeksy nośności oraz prędkości opony.</p>}
      </Werdykt>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta="Średnica koła" wartosc={`${p.roznicaProc > 0 ? '+' : ''}${p.roznicaProc.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}%`} opis={`${Math.round(p.srednicaStara)} → ${Math.round(p.srednicaNowa)} mm`} mocna />
        <Liczba etykieta="Licznik pokazuje 100 km/h" wartosc={`${p.przy100.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km/h`} opis="tyle naprawdę jedziesz" />
        <Liczba etykieta="Opona na zewnątrz" wartosc={mm(p.zewnatrz, true)} opis="przesunięcie zewnętrznego boku" />
        <Liczba etykieta="Opona do środka" wartosc={mm(p.wewnatrz, true)} opis="przesunięcie wewnętrznego boku" />
      </div>
      <p className="text-xs text-slate-500">Rysunek jest w jednej skali i pokazuje górną część koła tak, jak widać ją z przodu auta. Rzeczywista szerokość opony zależy od jej modelu i szerokości felgi (±5 mm), a luzy zmieniają się przy skręcie i ugięciu zawieszenia.</p>
    </section>
  );
}
