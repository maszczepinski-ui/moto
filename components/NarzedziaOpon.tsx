'use client';
import { useState } from 'react';
import { Ruler, CalendarClock, Gauge } from 'lucide-react';
import { rozkoduj, wiekZDot } from '@/lib/opony';

// Trzy narzędzia do sprawdzenia opony – każde z wizualizacją:
// rozmiar (kolorowe części oznaczenia), wiek z kodu DOT (skala lat), bieżnik (miernik w mm ze strefami).

const karta =
  'relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_32px_-16px_rgba(15,23,42,0.25)] p-6 gap-4';
const pole =
  'w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-slate-900 dark:text-white font-mono text-lg tracking-[0.12em] uppercase ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-rust-500 focus:outline-none';
const nr = 'text-[11px] font-black tracking-[0.2em] text-rust-600';

function Naglowek({ n, ikona: I, tytul }: { n: string; ikona: typeof Ruler; tytul: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className={nr}>{n}</div>
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">{tytul}</h3>
      </div>
      <span className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center flex-shrink-0">
        <I className="w-5 h-5" aria-hidden="true" />
      </span>
    </div>
  );
}

const KOLORY = ['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

function Rozmiar() {
  const [t, setT] = useState('205/55 R16 91V');
  const r = rozkoduj(t);
  const czesci = r
    ? [
        { kod: String(r.szerokosc), nazwa: 'Szerokość', wartosc: `${r.szerokosc} mm` },
        { kod: String(r.profil), nazwa: 'Profil', wartosc: `${r.wysokoscBokuMm} mm boku` },
        { kod: `R${r.srednica}`, nazwa: 'Felga', wartosc: `${r.srednica} cali` },
        ...(r.nosnoscKg ? [{ kod: String(r.indeksNosnosci), nazwa: 'Nośność', wartosc: `${r.nosnoscKg} kg/koło` }] : []),
        ...(r.predkoscKmh ? [{ kod: r.indeksPredkosci!, nazwa: 'Prędkość', wartosc: `do ${r.predkoscKmh} km/h` }] : [])
      ]
    : [];
  return (
    <div id="rozmiar" className={`${karta} scroll-mt-24`}>
      <Naglowek n="01" ikona={Ruler} tytul="Co znaczy rozmiar?" />
      <label htmlFor="op-rozmiar" className="text-sm text-slate-500">
        Przepisz oznaczenie z boku opony
      </label>
      <input id="op-rozmiar" value={t} onChange={(e) => setT(e.target.value)} className={pole} autoComplete="off" spellCheck={false} />
      {r ? (
        <>
          <div className="flex flex-wrap items-end gap-x-2 gap-y-3 font-mono text-2xl font-black text-slate-900 dark:text-white" aria-hidden="true">
            {czesci.map((c, i) => (
              <span key={c.nazwa} className="flex flex-col items-center gap-1">
                {c.kod}
                <span className={`h-1.5 w-full rounded-full ${KOLORY[i]}`} />
              </span>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {czesci.map((c, i) => (
              <div key={c.nazwa} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${KOLORY[i]}`} aria-hidden="true" /> {c.nazwa}
                </dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{c.wartosc}</dd>
              </div>
            ))}
            <div className="col-span-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 flex justify-between text-sm">
              <span className="opacity-70">Średnica całego koła</span>
              <strong>ok. {r.srednicaKolaMm} mm</strong>
            </div>
          </dl>
        </>
      ) : (
        <p className="text-sm text-slate-500">Wpisz rozmiar w formacie np. 205/55 R16 91V.</p>
      )}
    </div>
  );
}

function Wiek() {
  const [dot, setDot] = useState('');
  const w = dot.length === 4 ? wiekZDot(dot) : null;
  const lata = w ? Math.min(12, w.lata) : 0;
  const stan = !w ? null : w.lata >= 10 ? 'czerwony' : w.lata >= 5 ? 'zolty' : 'zielony';
  return (
    <div id="wiek" className={`${karta} scroll-mt-24`}>
      <Naglowek n="02" ikona={CalendarClock} tytul="Ile lat ma opona?" />
      <label htmlFor="op-dot" className="text-sm text-slate-500">
        Ostatnie 4 cyfry kodu DOT – w owalnej ramce na boku opony
      </label>
      {/* ilustracja owalu z kodem DOT */}
      <div className="rounded-2xl bg-slate-900 p-4 flex items-center justify-center" aria-hidden="true">
        <span className="font-mono text-slate-400 text-sm tracking-widest">
          DOT 4B7X 9KT{' '}
          <span className="inline-block rounded-full ring-2 ring-rust-500 text-white px-2 py-0.5 ml-1">{dot.padEnd(4, '•') || '••••'}</span>
        </span>
      </div>
      <input id="op-dot" value={dot} onChange={(e) => setDot(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="np. 2321" className={pole} />
      {/* skala 0–12 lat */}
      <div className="space-y-1.5" aria-hidden="true">
        <div className="relative h-3 rounded-full overflow-hidden flex">
          <span className="h-full bg-emerald-500" style={{ width: `${(5 / 12) * 100}%` }} />
          <span className="h-full bg-amber-400" style={{ width: `${(5 / 12) * 100}%` }} />
          <span className="h-full bg-rose-500 flex-1" />
        </div>
        <div className="relative h-4">
          {w && <span className="absolute -top-1 w-0 h-0 border-x-[7px] border-x-transparent border-b-[9px] border-b-slate-900 dark:border-b-white -translate-x-1/2 transition-all" style={{ left: `${(lata / 12) * 100}%` }} />}
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>nowa</span>
          <span>5 lat</span>
          <span>10 lat</span>
        </div>
      </div>
      {w ? (
        <p
          className={`text-sm rounded-2xl p-3 ${
            stan === 'czerwony' ? 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100' : stan === 'zolty' ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100' : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
          }`}
          aria-live="polite"
        >
          <strong className="block text-base">
            {w.tydzien}. tydzień {w.rok} r. · ok. {w.lata.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} lat
          </strong>
          {stan === 'czerwony'
            ? 'Guma jest już twarda – producenci zalecają wymianę niezależnie od bieżnika.'
            : stan === 'zolty'
              ? 'Co roku niech sprawdzi ją wulkanizator (pęknięcia, twardość gumy).'
              : 'Wiek nie jest problemem.'}
        </p>
      ) : (
        dot.length === 4 && <p className="text-sm text-rose-600">Nieprawidłowy kod – 2 pierwsze cyfry to tydzień (01–53), 2 kolejne to rok.</p>
      )}
    </div>
  );
}

function Bieznik() {
  const [t, setT] = useState('');
  const mm = Math.min(9, Number(t.replace(',', '.')) || 0);
  const MAX = 9;
  const strefa = !t || !mm ? null : mm < 1.6 ? 'nielegalny' : mm < 3 ? 'wymiana' : mm < 4 ? 'zimowe' : 'ok';
  return (
    <div id="bieznik" className={`${karta} scroll-mt-24`}>
      <Naglowek n="03" ikona={Gauge} tytul="Czy bieżnik jest dobry?" />
      <label htmlFor="op-mm" className="text-sm text-slate-500">
        Głębokość bieżnika w mm (miarka lub głębokościomierz za kilkanaście zł)
      </label>
      <input id="op-mm" value={t} onChange={(e) => setT(e.target.value.replace(/[^\d.,]/g, '').slice(0, 4))} inputMode="decimal" placeholder="np. 4,5" className={pole} />
      {/* miernik: przekrój bieżnika */}
      <div className="flex gap-4 items-stretch" aria-hidden="true">
        <div className="relative w-16 h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <span className="absolute inset-x-0 bottom-0 bg-rose-500/25" style={{ height: `${(1.6 / MAX) * 100}%` }} />
          <span className="absolute inset-x-0 bg-amber-400/25" style={{ bottom: `${(1.6 / MAX) * 100}%`, height: `${((4 - 1.6) / MAX) * 100}%` }} />
          <span
            className={`absolute inset-x-2 bottom-0 rounded-t-lg transition-all duration-500 ${strefa === 'nielegalny' ? 'bg-rose-500' : strefa === 'ok' ? 'bg-emerald-500' : strefa ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`}
            style={{ height: `${((mm || 0) / MAX) * 100}%` }}
          />
          <span className="absolute inset-x-0 border-t-2 border-dashed border-rose-500" style={{ bottom: `${(1.6 / MAX) * 100}%` }} />
          <span className="absolute inset-x-0 border-t-2 border-dashed border-amber-500" style={{ bottom: `${(4 / MAX) * 100}%` }} />
        </div>
        <div className="relative flex-1 h-44 text-xs">
          <span className="absolute left-0 -translate-y-1/2 text-amber-600 font-bold" style={{ bottom: `${(4 / MAX) * 100}%` }}>
            4 mm – zalecane dla zimowych
          </span>
          <span className="absolute left-0 translate-y-1/2 text-rose-600 font-bold" style={{ bottom: `${(1.6 / MAX) * 100}%` }}>
            1,6 mm – minimum prawne
          </span>
          <span className="absolute left-0 top-0 text-slate-400">nowa opona: ok. 8 mm</span>
        </div>
      </div>
      {strefa && (
        <p
          className={`text-sm rounded-2xl p-3 ${
            strefa === 'nielegalny' ? 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100' : strefa === 'ok' ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100'
          }`}
          aria-live="polite"
        >
          <strong className="block text-base">{mm.toLocaleString('pl-PL')} mm</strong>
          {strefa === 'nielegalny'
            ? 'Niezgodna z przepisami – grozi mandat i zatrzymanie dowodu rejestracyjnego.'
            : strefa === 'wymiana'
              ? 'Legalna, ale na mokrym traci przyczepność – czas na nowe opony.'
              : strefa === 'zimowe'
                ? 'Letnia w porządku. Zimowa poniżej 4 mm gorzej radzi sobie na śniegu.'
                : 'Bieżnik w dobrym stanie.'}
        </p>
      )}
    </div>
  );
}

export default function NarzedziaOpon() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      <Rozmiar />
      <Wiek />
      <Bieznik />
    </div>
  );
}
