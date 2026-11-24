'use client';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { nazwaOpony, ocenSrednice, ocenWewnatrz, ocenZewnatrz, porownajKola, srednicaKola, typowaFelga, wysokoscBoku, type Kolo, type Ocena } from '@/lib/narzedzia/felgi';
import { KARTA_NARZEDZIA, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const mm = (n: number, znak = false) => `${znak && n > 0 ? '+' : ''}${n.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mm`;
const POLE = 'w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-rust-500 focus:outline-none tabular-nums';

function PolaKola({ tytul, k, ustaw, id }: { tytul: string; k: Kolo; ustaw: (k: Kolo) => void; id: string }) {
  const pole = (klucz: keyof Kolo, etykieta: string, krok: number, jedn: string) => (
    <label className="block space-y-1" htmlFor={`${id}-${klucz}`}>
      <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">{etykieta}</span>
      <span className="relative block">
        <input id={`${id}-${klucz}`} type="number" inputMode="decimal" step={krok} value={k[klucz]} onChange={(e) => ustaw({ ...k, [klucz]: Number(e.target.value) || 0 })} className={`${POLE} pr-9`} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">{jedn}</span>
      </span>
    </label>
  );
  return (
    <fieldset className="rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-800 p-4 space-y-3">
      <legend className="px-1 text-sm font-extrabold text-slate-900 dark:text-white">{tytul}</legend>
      <div className="grid grid-cols-3 gap-2">
        {pole('szer', 'Szerokość opony', 10, 'mm')}
        {pole('profil', 'Profil', 5, '%')}
        {pole('felga', 'Średnica', 1, '″')}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {pole('j', 'Szerokość felgi', 0.5, 'J')}
        {pole('et', 'ET (odsadzenie)', 1, 'mm')}
      </div>
      <p className="text-xs text-slate-500">
        {nazwaOpony(k)} na {k.j}J ET{k.et} · koło {Math.round(srednicaKola(k))} mm · bok {Math.round(wysokoscBoku(k))} mm · typowa felga {typowaFelga(k.szer)}J
      </p>
    </fieldset>
  );
}

/** Przekrój koła w nadkolu (widok od przodu auta). Szerokość powiększona ×2 względem wysokości dla czytelności. */
function Przekroj({ s, n }: { s: Kolo; n: Kolo }) {
  const p = porownajKola(s, n);
  const SX = 0.9;
  const SY = 0.34;
  const W = 640;
  const H = 360;
  const x0 = 360; // powierzchnia piasty
  const y0 = 190; // środek koła
  const kolo = (k: Kolo, szerOpony: number, klasa: string, felgaKlasa: string, dash?: boolean) => {
    const sr = srednicaKola(k);
    const cx = x0 - k.et * SX;
    const w = szerOpony * SX;
    const h = sr * SY;
    const fw = k.j * 25.4 * SX;
    const fh = k.felga * 25.4 * SY;
    return (
      <g>
        <rect x={cx - w / 2} y={y0 - h / 2} width={w} height={h} rx={Math.min(w, h) * 0.28} className={klasa} strokeDasharray={dash ? '6 5' : undefined} strokeWidth={2} />
        <rect x={cx - fw / 2} y={y0 - fh / 2} width={fw} height={fh} rx={6} className={felgaKlasa} strokeDasharray={dash ? '6 5' : undefined} strokeWidth={1.5} />
      </g>
    );
  };
  const zewS = x0 + (-s.et + p.szerStara / 2) * SX;
  const wewS = x0 - (s.et + p.szerStara / 2) * SX;
  const zewN = x0 + (-n.et + p.szerNowa / 2) * SX;
  const wewN = x0 - (n.et + p.szerNowa / 2) * SX;
  const goraS = y0 - (srednicaKola(s) * SY) / 2;
  const goraN = y0 - (srednicaKola(n) * SY) / 2;
  const kolor = (o: Ocena) => (o === 'zielony' ? '#10b981' : o === 'zolty' ? '#f59e0b' : '#e11d48');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Przekrój: nowe koło ${p.zewnatrz >= 0 ? 'wysunięte' : 'schowane'} o ${mm(Math.abs(p.zewnatrz))} na zewnątrz i ${mm(Math.abs(p.wewnatrz))} ${p.wewnatrz >= 0 ? 'bliżej' : 'dalej od'} zawieszenia`}>
      {/* nadkole i błotnik (położenie przykładowe: 15 mm nad i obok obecnego koła) */}
      <path d={`M ${wewS - 40} ${goraS - 26} Q ${(wewS + zewS) / 2} ${goraS - 46} ${zewS + 15 * SX} ${goraS - 26} L ${zewS + 15 * SX} ${goraS + 30}`} className="fill-none stroke-slate-400 dark:stroke-slate-500" strokeWidth={4} strokeLinecap="round" />
      <text x={zewS + 15 * SX + 8} y={goraS + 10} className="fill-slate-500 text-[11px]">błotnik</text>
      {/* amortyzator / zwrotnica (przykładowo 20 mm od obecnej opony) */}
      <rect x={wewS - 20 * SX - 26} y={y0 - 150} width={26} height={170} rx={8} className="fill-slate-300 dark:fill-slate-700" />
      <text x={wewS - 20 * SX - 30} y={y0 + 38} textAnchor="end" className="fill-slate-500 text-[11px]">zawieszenie</text>
      {/* stare koło (przerywane) i nowe (wypełnione) */}
      {kolo(n, p.szerNowa, 'fill-slate-800/85 dark:fill-slate-200/85 stroke-slate-900 dark:stroke-white', 'fill-slate-300 dark:fill-slate-500 stroke-slate-500')}
      {kolo(s, p.szerStara, 'fill-none stroke-rust-500', 'fill-none stroke-rust-400', true)}
      {/* piasta (od strony auta) i powierzchnia przylgowa */}
      <rect x={x0 - 40} y={y0 - 14} width={40} height={28} rx={4} className="fill-slate-500/80" />
      <line x1={x0} y1={y0 - 60} x2={x0} y2={y0 + 60} className="stroke-sky-500" strokeWidth={2} />
      {/* strzałki przesunięć */}
      <g>
        <line x1={zewS} y1={y0 + 130} x2={zewN} y2={y0 + 130} stroke={kolor(ocenZewnatrz(p.zewnatrz))} strokeWidth={4} strokeLinecap="round" />
        <text x={Math.max(zewS, zewN) + 8} y={y0 + 134} className="text-[12px] font-bold" fill={kolor(ocenZewnatrz(p.zewnatrz))}>
          {mm(p.zewnatrz, true)} na zewnątrz
        </text>
        <line x1={wewS} y1={y0 + 150} x2={wewN} y2={y0 + 150} stroke={kolor(ocenWewnatrz(p.wewnatrz))} strokeWidth={4} strokeLinecap="round" />
        <text x={Math.min(wewS, wewN) - 8} y={y0 + 154} textAnchor="end" className="text-[12px] font-bold" fill={kolor(ocenWewnatrz(p.wewnatrz))}>
          {mm(p.wewnatrz, true)} do środka
        </text>
        <line x1={zewS + 55} y1={goraS} x2={zewS + 55} y2={goraN} stroke={kolor(ocenSrednice(p.roznicaProc))} strokeWidth={4} strokeLinecap="round" />
        <text x={zewS + 63} y={Math.max(goraS, goraN) + 26} className="text-[12px] font-bold" fill={kolor(ocenSrednice(p.roznicaProc))}>
          prześwit {mm(p.przeswit, true)}
        </text>
      </g>
      {/* legenda */}
      <g className="text-[11px]">
        <line x1={20} y1={20} x2={44} y2={20} className="stroke-rust-500" strokeWidth={2} strokeDasharray="6 5" />
        <text x={50} y={24} className="fill-slate-600 dark:fill-slate-300">obecne koło</text>
        <rect x={140} y={13} width={24} height={14} rx={4} className="fill-slate-800 dark:fill-slate-200" />
        <text x={170} y={24} className="fill-slate-600 dark:fill-slate-300">nowe koło</text>
        <line x1={250} y1={13} x2={250} y2={27} className="stroke-sky-500" strokeWidth={2} />
        <text x={258} y={24} className="fill-slate-600 dark:fill-slate-300">piasta (od niej liczy się ET)</text>
        <text x={W - 20} y={44} textAnchor="end" className="fill-slate-400">widok od przodu · szerokość ×2 dla czytelności</text>
      </g>
    </svg>
  );
}

const OPIS_FELGI = { ok: 'pasuje do opony', 'za-waska': 'za wąska dla tej opony', 'za-szeroka': 'za szeroka dla tej opony' };

export default function KalkulatorFelg({ start }: { start?: Kolo }) {
  const domyslne: Kolo = start ?? { szer: 205, profil: 55, felga: 16, j: 6.5, et: 46 };
  const [s, setS] = useState<Kolo>(domyslne);
  const [n, setN] = useState<Kolo>(start ? { ...domyslne, szer: domyslne.szer + 20, et: domyslne.et - 5, j: domyslne.j + 0.5 } : { szer: 215, profil: 45, felga: 17, j: 7, et: 43 });
  const p = porownajKola(s, n);
  const oS = ocenSrednice(p.roznicaProc);
  const oZ = ocenZewnatrz(p.zewnatrz);
  const oW = ocenWewnatrz(p.wewnatrz);
  const najgorsza: Ocena = [oS, oZ, oW, p.felgaNowa === 'ok' ? 'zielony' : 'czerwony'].includes('czerwony') ? 'czerwony' : [oS, oZ, oW].includes('zolty') ? 'zolty' : 'zielony';
  const tytul = najgorsza === 'zielony' ? 'Nowe koła powinny się zmieścić bez problemu' : najgorsza === 'zolty' ? 'Na granicy – sprawdź luz w nadkolu przed zakupem' : 'Duże ryzyko: ocieranie, problemy na przeglądzie albo zły odczyt prędkości';
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator felg, opon i ET">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <PolaKola id="st" tytul="Obecne koła" k={s} ustaw={setS} />
        <button type="button" onClick={() => { setS(n); setN(s); }} className="mx-auto w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200" aria-label="Zamień obecne i nowe koła">
          <ArrowLeftRight className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
        <PolaKola id="nw" tytul="Nowe koła" k={n} ustaw={setN} />
      </div>
      <Werdykt ton={najgorsza} tytul={tytul}>
        {p.felgaNowa !== 'ok' && <p>Felga {n.j}J jest {OPIS_FELGI[p.felgaNowa]} {n.szer} mm – opona może źle siedzieć na feldze.</p>}
        {oZ !== 'zielony' && <p>Opona wysunie się o {mm(p.zewnatrz)} – sprawdź, czy nie wystaje poza błotnik i nie ociera przy skręcie i ugięciu zawieszenia.</p>}
        {oW !== 'zielony' && <p>Opona przesunie się o {mm(p.wewnatrz)} bliżej zawieszenia – zmierz luz między obecną oponą a amortyzatorem.</p>}
        {oS !== 'zielony' && <p>Średnica koła zmienia się o {p.roznicaProc.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}% – licznik i systemy (ABS, ESP) będą liczyć prędkość inaczej.</p>}
        {najgorsza === 'zielony' && <p>Zmiany średnicy i położenia opony są małe. Sprawdź jeszcze rozstaw śrub (PCD), otwór centralny i indeksy nośności oraz prędkości.</p>}
      </Werdykt>
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-2 sm:p-4">
        <Przekroj s={s} n={n} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta="Średnica koła" wartosc={`${p.roznicaProc > 0 ? '+' : ''}${p.roznicaProc.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}%`} opis={`${Math.round(p.srednicaStara)} → ${Math.round(p.srednicaNowa)} mm`} mocna />
        <Liczba etykieta="Licznik pokazuje 100 km/h" wartosc={`${p.przy100.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km/h`} opis="tyle naprawdę jedziesz" />
        <Liczba etykieta="Lico felgi" wartosc={mm(p.licoFelgi, true)} opis="+ = felga bardziej na zewnątrz" />
        <Liczba etykieta="Prześwit" wartosc={mm(p.przeswit, true)} opis="zmiana wysokości auta" />
      </div>
      <p className="text-xs text-slate-500">
        Położenie błotnika i zawieszenia na rysunku jest przykładowe – każde auto ma inny luz. Rzeczywista szerokość opony zależy od modelu opony i szerokości felgi (±5 mm). Przed zakupem przymierz koło albo zmierz luz w nadkolu.
      </p>
    </section>
  );
}
