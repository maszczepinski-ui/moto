// Sekcja „Plusy i minusy” na karcie modelu: krótki opis, dwie karty (zalety / wady), werdykt.
// Pełny opis rynkowy jest zwinięty, żeby karta nie przytłaczała – Google i tak widzi cały tekst w kodzie strony.
import { CheckCircle2, XCircle, Scale, ExternalLink, Users } from 'lucide-react';
import type { CarModel } from '@/types/car-model';
import { liczbaOdRocznika, type OcenaGeneracji, type Punkt } from '@/lib/plusy-minusy';

/** **pogrubienie** w tekście z danych */
function Tekst({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\*\*[^*]+\*\*)/g).map((c, i) =>
        c.startsWith('**') ? (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {c.slice(2, -2)}
          </strong>
        ) : (
          c
        )
      )}
    </>
  );
}

function Lista({ punkty, rodzaj }: { punkty: Punkt[]; rodzaj: 'zalety' | 'wady' }) {
  const plus = rodzaj === 'zalety';
  return (
    <section
      aria-labelledby={`naglowek-${rodzaj}`}
      className={`rounded-2xl border-2 p-5 sm:p-6 ${plus ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'}`}
    >
      <h3 id={`naglowek-${rodzaj}`} className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
        {plus ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" /> : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />}
        {plus ? 'Najważniejsze zalety i mocne strony' : 'Wady, kompromisy i typowe usterki'}
      </h3>
      <ul className="space-y-3">
        {punkty.map((p) => (
          <li key={p.tytul} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${plus ? 'bg-emerald-500' : 'bg-rose-500'}`} aria-hidden="true" />
            <span>
              <strong className="font-semibold text-slate-900 dark:text-white">{p.tytul}:</strong> {p.opis}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PlusyMinusy({ oceny, m }: { oceny: OcenaGeneracji[]; m: CarModel }) {
  if (!oceny.length) return null;
  const fmt = (n: number) => n.toLocaleString('pl-PL');
  return (
    <div className="space-y-12">
      {oceny.map((o) => {
        const [pierwszy, ...reszta] = o.opis;
        const naDrogach = liczbaOdRocznika(m, o.rokOd);
        return (
          <section key={o.id} aria-labelledby={`ocena-${o.id}`} className="space-y-5">
            <div className="space-y-1">
              <h2 id={`ocena-${o.id}`} className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                <Scale className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />
                Plusy i minusy: {o.generacja} ({o.lata})
              </h2>
              <p className="text-xs text-slate-500">
                Ocena rzeczoznawcy moto-raport.pl na podstawie raportów ADAC, TÜV i akcji serwisowych · aktualizacja {new Date(o.aktualizacja).toLocaleDateString('pl-PL')}
              </p>
            </div>

            {pierwszy && (
              <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                <h3 className="font-bold text-slate-900 dark:text-white">{pierwszy.naglowek}</h3>
                <p>
                  <Tekst t={pierwszy.tekst} />
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Lista punkty={o.zalety} rodzaj="zalety" />
              <Lista punkty={o.wady} rodzaj="wady" />
            </div>

            <div className="rounded-2xl bg-steel-50 dark:bg-slate-800/60 p-5 sm:p-6 space-y-3">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Users className="w-5 h-5 text-steel-600 dark:text-steel-400" aria-hidden="true" /> Werdykt: dla kogo?
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{o.werdykt}</p>
              {naDrogach > 0 && (
                <p className="text-xs text-slate-500">
                  W Polsce jest zarejestrowanych {fmt(naDrogach)} aut tego modelu z roczników {o.rokOd} i nowszych (CEPiK, stan na {new Date(m.cepik.stanNa).toLocaleDateString('pl-PL')}).
                </p>
              )}
            </div>

            {reszta.length > 0 && (
              <details className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 font-semibold text-steel-700 dark:text-steel-300">
                  Pełna ocena: opinie, usterki, jaki silnik wybrać
                  <span className="transition-transform group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-5 space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {reszta.map((a) => (
                    <div key={a.naglowek} className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-white">{a.naglowek}</h3>
                      {a.tekst.split(/\n\n+/).map((p, i) => (
                        <p key={i}>
                          <Tekst t={p} />
                        </p>
                      ))}
                    </div>
                  ))}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Źródła</p>
                    <ul className="text-xs space-y-0.5">
                      {o.zrodla.map((z) => (
                        <li key={z.url}>
                          <a href={z.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-steel-700 dark:text-steel-300 underline">
                            {z.tytul} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
