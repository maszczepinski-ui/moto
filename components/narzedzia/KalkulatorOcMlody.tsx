'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { DANE_OC, PRZYKLADY_MODELI, SPOSOBY } from '@/lib/narzedzia/oc-mlody';
import { KARTA_NARZEDZIA, Przelacznik, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;
const WPLYW = { duzy: 'duży wpływ', sredni: 'średni wpływ', maly: 'mały wpływ' };

export default function KalkulatorOcMlody() {
  const [wiek, setWiek] = useState<'18' | '19-25'>('18');
  const [model, setModel] = useState(PRZYKLADY_MODELI[0].model);
  const [zrobione, setZrobione] = useState<string[]>([]);
  const p = PRZYKLADY_MODELI.find((x) => x.model === model) ?? PRZYKLADY_MODELI[0];
  const srednia = wiek === '18' ? DANE_OC.osiemnastolatekH1 : DANE_OC.mlodzi1825Rankomat;
  const niezrobione = SPOSOBY.filter((s) => !zrobione.includes(s.id));
  const duze = niezrobione.filter((s) => s.wplyw === 'duzy').length;
  const przelacz = (id: string) => setZrobione((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Symulator OC dla młodego kierowcy">
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Przelacznik etykieta="Twój wiek" wartosc={wiek} ustaw={setWiek} opcje={[{ id: '18', nazwa: '18 lat' }, { id: '19-25', nazwa: '19–25 lat' }]} />
        <Przelacznik etykieta="Przykładowe auto" wartosc={model} ustaw={setModel} opcje={PRZYKLADY_MODELI.map((x) => ({ id: x.model, nazwa: x.model }))} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta={wiek === '18' ? 'Średnio płaci 18-latek' : 'Średnio płaci 18–25 lat'} wartosc={zl(srednia)} opis={wiek === '18' ? 'I połowa 2026, rankomat.pl' : 'lipiec 2026, rankomat.pl'} mocna />
        <Liczba etykieta="Średnia dla wszystkich" wartosc={zl(DANE_OC.sredniaWszyscyRankomat)} opis="lipiec 2026, rankomat.pl" />
        <Liczba etykieta={`${p.model}: 18-latek`} wartosc={zl(p.osiemnascie)} opis="średnia, lipiec 2026" />
        <Liczba etykieta={`${p.model}: 45-latek`} wartosc={zl(p.czterdziesci5)} opis={`${Math.round(p.osiemnascie / p.czterdziesci5)}× mniej`} />
      </div>
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-800 dark:text-slate-200">Co już robisz, żeby płacić mniej? Zaznacz</legend>
        <div className="space-y-2">
          {SPOSOBY.map((s) => {
            const on = zrobione.includes(s.id);
            return (
              <button key={s.id} type="button" aria-pressed={on} onClick={() => przelacz(s.id)} className={`w-full text-left rounded-xl px-4 py-3 ring-1 transition flex items-start gap-3 ${on ? 'bg-emerald-50 dark:bg-emerald-950/40 ring-emerald-300' : 'bg-slate-50 dark:bg-slate-800 ring-slate-200 dark:ring-slate-700 hover:ring-rust-300'}`}>
                <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${on ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 ring-1 ring-slate-300 dark:ring-slate-600'}`}>{on && <Check className="w-3.5 h-3.5" aria-hidden="true" />}</span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{s.nazwa}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{WPLYW[s.wplyw]}</span>
                  </span>
                  <span className="block text-sm text-slate-600 dark:text-slate-300 mt-0.5">{s.opis}</span>
                  {s.uwaga && <span className="block text-xs text-amber-700 dark:text-amber-300 mt-1">Uwaga: {s.uwaga}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <Werdykt ton={duze === 0 ? 'zielony' : duze === 1 ? 'zolty' : 'czerwony'} tytul={duze === 0 ? 'Korzystasz z najważniejszych sposobów – teraz porównaj ceny' : `Zostało ${duze} ${duze === 1 ? 'sposób' : 'sposoby'} o dużym wpływie na cenę`}>
        {niezrobione.length ? `Najpierw: ${niezrobione.slice(0, 2).map((s) => s.nazwa.toLowerCase()).join(' i ')}.` : 'Świetnie – zostaje porównanie ofert przed każdym odnowieniem polisy.'}
      </Werdykt>
      <p className="text-xs text-slate-500">To średnie z porównywarek, nie wycena dla Ciebie. Twoją składkę poznasz dopiero po podaniu danych w kalkulatorze ubezpieczeń.</p>
    </section>
  );
}
