'use client';
// Darmowy szybki test kosztorysu: 7 pytań tak/nie/nie wiem, wynik od razu, nic nie jest wysyłane.
// Uczciwie mówi też „nie widzimy podstaw” – wtedy nie namawiamy do zakupu.
import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { PYTANIA_TESTU, ocenTest, type Odpowiedz, type PytanieTestu } from '@/lib/szkoda/test';

/** „1 pytaniu”, „2 pytaniach” – polska odmiana po liczbie */
const pytaniach = (n: number) => (n === 1 ? '1 pytaniu' : `${n} pytaniach`);
const sygnaly = (n: number) => (n === 1 ? '1 sygnał' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? `${n} sygnały` : `${n} sygnałów`);

const OPCJE: [Odpowiedz, string][] = [
  ['tak', 'Tak'],
  ['nie', 'Nie'],
  ['niewiem', 'Nie wiem']
];

export default function SzybkiTest({ sprzedaz, cena }: { sprzedaz: boolean; cena: string }) {
  const [odp, setOdp] = useState<Partial<Record<PytanieTestu['id'], Odpowiedz>>>({});
  const gotowe = PYTANIA_TESTU.every((p) => odp[p.id]);
  const wynik = useMemo(() => ocenTest(odp), [odp]);
  const ile = Object.keys(odp).length;

  return (
    <div className="rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)] p-5 sm:p-7 space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Szybki test kosztorysu</h2>
        <span className="text-sm font-semibold text-slate-500 tabular-nums" aria-live="polite">
          {ile}/{PYTANIA_TESTU.length}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 -mt-3">Weź do ręki decyzję i kosztorys od ubezpieczyciela. Test działa w Twojej przeglądarce – nic nie wysyłamy.</p>

      <ol className="space-y-3">
        {PYTANIA_TESTU.map((p, i) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="font-semibold text-slate-900 dark:text-white">
              <span className="text-slate-400 tabular-nums mr-1.5">{i + 1}.</span>
              {p.pytanie}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{p.podpowiedz}</p>
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 mt-3" role="radiogroup" aria-label={p.pytanie}>
              {OPCJE.map(([v, t]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={odp[p.id] === v}
                  onClick={() => setOdp({ ...odp, [p.id]: v })}
                  className={`sm:min-w-[5.5rem] rounded-xl px-3 sm:px-4 py-2 text-sm font-semibold border transition-colors ${
                    odp[p.id] === v
                      ? v === 'tak'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {gotowe ? (
        <div className={`rounded-2xl p-5 space-y-3 ${wynik.ocena === 'brak' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`} aria-live="polite">
          {wynik.ocena === 'brak' ? (
            <>
              <p className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200 text-lg">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" aria-hidden="true" /> Nie widzimy typowych sygnałów zaniżenia
              </p>
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                Twój kosztorys nie ma najczęstszych powodów niższej wypłaty. Pakiet raczej Ci się nie przyda – chyba że ubezpieczyciel spóźnia się z wypłatą albo nie zgadzasz się z czymś, czego test nie obejmuje.
                {wynik.niepewne > 0 && ` Przy ${pytaniach(wynik.niepewne)} zaznaczyłeś „nie wiem” – warto to sprawdzić w kosztorysie.`}
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100 text-lg">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                {`Widzimy ${sygnaly(wynik.sygnaly.length)} możliwego zaniżenia`}
              </p>
              <ul className="space-y-2">
                {wynik.sygnaly.map((s) => (
                  <li key={s.id} className="text-sm text-amber-950 dark:text-amber-50 pl-4 border-l-2 border-amber-400">
                    {s.sygnal}
                  </li>
                ))}
              </ul>
              {wynik.niepewne > 0 && (
                <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" /> Przy {pytaniach(wynik.niepewne)} zaznaczyłeś „nie wiem” – Sprawdzacz pokaże, gdzie tego szukać w kosztorysie.
                </p>
              )}
              <a href="#zamow" className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold px-5 py-3">
                {sprzedaz ? `Policz kwotę i przygotuj pismo · ${cena}` : 'Zobacz, co będzie w pakiecie'}
              </a>
            </>
          )}
          <button type="button" onClick={() => setOdp({})} className="inline-flex items-center gap-1.5 text-sm text-slate-500 underline">
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Zacznij od nowa
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Odpowiedz na wszystkie pytania, żeby zobaczyć wynik.</p>
      )}
    </div>
  );
}
