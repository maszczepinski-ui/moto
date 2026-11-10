// Grafika w nagłówku strony /po-szkodzie/: telefon z ekranem wyniku Sprawdzacza i „pływające” znaczniki wokół.
// Rysowana w CSS (bez zdjęć), kolory serwisu: granat, bursztyn, szmaragd. Liczby są przykładowe – to ilustracja.
import { AlertTriangle, CalendarClock, Check, Download, FileText } from 'lucide-react';

const FLAGI: [string, string][] = [
  ['Zamienniki zamiast oryginałów', '—'],
  ['Potrącenia od cen części', '480 zł'],
  ['Rabaty nie dla Ciebie', '350 zł'],
  ['Wypłata bez VAT', '1 617 zł']
];

export default function TelefonSprawdzacza() {
  return (
    <div className="relative mx-auto w-[19rem] sm:w-[22rem] h-[29rem] sm:h-[31rem]" aria-hidden="true">
      {/* poświata */}
      <div className="absolute inset-6 rounded-full bg-amber-400/25 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-amber-300/20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full border border-amber-300/10 hidden sm:block" />

      {/* telefon */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-56 sm:w-60 h-[28rem] sm:h-[30rem] rounded-[2.5rem] bg-slate-950 p-2 shadow-2xl shadow-black/60 ring-1 ring-white/15 rotate-[4deg]">
        <div className="relative h-full w-full rounded-[2rem] bg-slate-50 overflow-hidden text-slate-900">
          {/* wycięcie na kamerę */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-20 h-5 rounded-full bg-slate-950" />
          <div className="pt-10 px-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sprawdzacz kosztorysu</p>
            <div className="grid grid-cols-4 gap-1">
              {['Sprawa', 'Kosztorys', 'Wynik', 'Pisma'].map((k) => (
                <span key={k} className={`rounded-md py-1 text-center text-[8px] font-bold ${k === 'Wynik' ? 'bg-slate-900 text-white' : 'bg-white ring-1 ring-slate-200 text-slate-500'}`}>
                  {k}
                </span>
              ))}
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3">
              <p className="text-[9px] font-semibold text-slate-500">Kwota do odzyskania</p>
              <p className="text-[26px] leading-tight font-black tabular-nums">3 846,90 zł</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
              </div>
            </div>
            <ul className="space-y-1.5">
              {FLAGI.map(([t, kw]) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-2.5 py-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span className="flex-1 text-[9px] font-semibold truncate">{t}</span>
                  <span className="text-[9px] font-bold tabular-nums text-amber-800">{kw}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white py-2 text-[10px] font-bold">
              <Download className="w-3 h-3" /> Pobierz reklamację (Word)
            </div>
          </div>
        </div>
      </div>

      {/* pływające znaczniki */}
      <div className="absolute -left-2 sm:-left-8 top-16 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-slate-900/10 -rotate-[5deg]">
        <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-900">Flaga</span>
        <span className="text-[11px] font-bold text-slate-900">Zamiennik (Q)</span>
      </div>
      <div className="absolute -right-2 sm:-right-10 top-2 flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 shadow-xl ring-1 ring-white/15 rotate-[6deg]">
        <CalendarClock className="w-4 h-4 text-amber-300" />
        <span className="text-[11px] font-bold text-white">30 dni na odpowiedź</span>
      </div>
      <div className="absolute -left-1 sm:-left-6 bottom-16 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-slate-900/10 rotate-[3deg]">
        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
          <Check className="w-3 h-3" />
        </span>
        <span className="text-[11px] font-bold text-slate-900">Reklamacja gotowa</span>
      </div>
      <div className="absolute right-0 sm:-right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-2 shadow-xl shadow-amber-400/30 -rotate-[4deg]">
        <FileText className="w-4 h-4 text-slate-900" />
        <span className="text-[11px] font-black text-slate-900">Test za darmo</span>
      </div>
    </div>
  );
}
