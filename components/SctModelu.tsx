// Sekcja „Strefy czystego transportu” na karcie modelu + mała plakietka do nagłówka.
// Dane liczone automatycznie w lib/sct-modelu.ts.
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';
import type { Kolor, SctModelu as Dane } from '@/lib/sct-modelu';
import { STAN_SCT } from '@/lib/sct';

const KOLOR: Record<Kolor, { pasek: string; tekst: string; tlo: string }> = {
  zielony: { pasek: 'bg-emerald-500', tekst: 'text-emerald-800 dark:text-emerald-300', tlo: 'bg-emerald-50 dark:bg-emerald-950/40 ring-emerald-200 dark:ring-emerald-900' },
  zolty: { pasek: 'bg-amber-400', tekst: 'text-amber-800 dark:text-amber-300', tlo: 'bg-amber-50 dark:bg-amber-950/40 ring-amber-200 dark:ring-amber-900' },
  pomaranczowy: { pasek: 'bg-orange-500', tekst: 'text-orange-800 dark:text-orange-300', tlo: 'bg-orange-50 dark:bg-orange-950/40 ring-orange-200 dark:ring-orange-900' },
  czerwony: { pasek: 'bg-rose-500', tekst: 'text-rose-800 dark:text-rose-300', tlo: 'bg-rose-50 dark:bg-rose-950/40 ring-rose-200 dark:ring-rose-900' }
};

/** Plakietka do nagłówka karty – link do sekcji niżej */
export function PlakietkaSct({ d }: { d: Dane }) {
  const k = KOLOR[d.plakietka.kolor];
  return (
    <a href="#sct" className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-3 py-1 text-xs font-semibold hover:underline ${k.tlo} ${k.tekst}`}>
      <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
      {d.plakietka.tekst}
    </a>
  );
}

export default function SctModelu({ d, nazwa }: { d: Dane; nazwa: string }) {
  return (
    <section id="sct" className="scroll-mt-20 space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
        <Leaf className="w-6 h-6 text-emerald-600" aria-hidden="true" />
        Czy {nazwa} wjedzie do strefy czystego transportu?
      </h2>
      {d.elektryczny ? (
        <p className="rounded-xl ring-1 p-4 bg-emerald-50 dark:bg-emerald-950/40 ring-emerald-200 dark:ring-emerald-900 text-emerald-900 dark:text-emerald-100">
          Tak – auta elektryczne wjeżdżają do każdej strefy czystego transportu bez ograniczeń (ustawa o elektromobilności).
        </p>
      ) : (
        <>
          <p className="text-slate-600 dark:text-slate-300">
            Roczniki {d.od}–{d.do} według zasad stref w Warszawie i Krakowie. Liczymy po roku produkcji – auto z wyższą normą Euro, niż wynika z rocznika, może wjechać wcześniej.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {d.grupy.map((g) => (
              <div key={g.paliwo} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {g.nazwa} <span className="text-xs font-normal text-slate-500">({Math.round(g.udzial * 100)}% aut tego modelu w Polsce)</span>
                </h3>
                {g.miasta.map((mi) => (
                  <div key={mi.id}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{mi.nazwa}</h4>
                    <ul className="space-y-1">
                      {mi.odcinki.map((o) => (
                        <li key={o.od} className="flex items-center gap-3 text-sm">
                          <span className={`w-1.5 self-stretch rounded-full ${KOLOR[o.kolor].pasek}`} aria-hidden="true" />
                          <span className="w-24 flex-shrink-0 tabular-nums text-slate-700 dark:text-slate-300">{o.od === o.do ? o.od : `${o.od}–${o.do}`}</span>
                          <span className={`font-semibold ${KOLOR[o.kolor].tekst}`}>{o.tekst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            „Bez ograniczeń” – według wszystkich zapowiedzianych etapów (Warszawa do 2032 r.). Mieszkańcy obu miast, seniorzy, posiadacze karty parkingowej i auta zabytkowe mogą mieć
            zwolnienia. Stan przepisów: {STAN_SCT}.
          </p>
        </>
      )}
      <Link href="/strefy-czystego-transportu/" className="flex items-center justify-between gap-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-4 font-semibold">
        <span>Sprawdź swoje auto w kalkulatorze SCT – z normą Euro i zwolnieniami</span>
        <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      </Link>
    </section>
  );
}
