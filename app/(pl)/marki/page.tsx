import type { Metadata } from 'next';
import { Car } from 'lucide-react';
import { marki, tlo } from '@/lib/dane';
import { fmt, formatDate } from '@/lib/format';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Marki samochodów w Polsce – ile aut każdej marki jest zarejestrowanych',
  description: `Wszystkie marki samochodów osobowych zarejestrowanych w Polsce według CEPiK – od Volkswagena i Opla po BYD, MG i Omodę. ${marki.length} marek, liczby aut i modele.`,
  alternates: { canonical: '/marki/' }
};

export default function MarkiPage() {
  const max = marki[0]?.auta || 1;
  const chinskie = marki.filter((m) => m.chinska);
  const alfabet = [...marki].sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
  const litery = [...new Set(alfabet.map((m) => m.nazwa[0].toUpperCase()))];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Marki', adres: '/marki/' }]} />
      <header className="max-w-3xl space-y-3">
        <h1 className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          <Car className="w-8 h-8 text-steel-600" aria-hidden="true" /> Marki samochodów w Polsce
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {marki.length} marek z co najmniej jednym modelem, którego w Polsce zarejestrowano 200 lub więcej egzemplarzy. Kliknij markę, żeby zobaczyć jej modele i generacje.
        </p>
      </header>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Najpopularniejsze marki</h2>
        <ol className="space-y-2">
          {marki.slice(0, 20).map((m, i) => (
            <li key={m.slug}>
              <div className="flex justify-between gap-3 text-sm mb-1">
                <a href={`/marki/${m.slug}/`} className="font-semibold text-slate-900 dark:text-white hover:underline">
                  <span className="text-slate-400 tabular-nums mr-2">{i + 1}.</span>
                  {m.nazwa}
                </a>
                <span className="tabular-nums text-slate-600 dark:text-slate-300">{fmt(m.auta)} szt.</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-steel-500" style={{ width: `${Math.max(1, (m.auta / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {chinskie.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Marki chińskie</h2>
          <ul className="flex flex-wrap gap-2">
            {chinskie.map((m) => (
              <li key={m.slug}>
                <a href={`/marki/${m.slug}/`} className="inline-block px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rust-400">
                  <strong>{m.nazwa}</strong> <span className="text-slate-500">{fmt(m.auta)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wszystkie marki od A do Z</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {litery.map((l) => (
            <div key={l}>
              <h3 className="text-sm font-bold text-rust-600 mb-1">{l}</h3>
              <ul className="space-y-0.5 text-sm">
                {alfabet
                  .filter((m) => m.nazwa[0].toUpperCase() === l)
                  .map((m) => (
                    <li key={m.slug} className="flex justify-between gap-2">
                      <a href={`/marki/${m.slug}/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                        {m.nazwa}
                      </a>
                      <span className="tabular-nums text-slate-500">{fmt(m.auta)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <p className="text-xs text-slate-500">Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. Liczba aut marki to suma jej modeli, które mają w atlasie własną kartę.</p>
      <KodStrony sciezka="/marki/" />
    </div>
  );
}
