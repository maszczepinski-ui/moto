import { getModelSummaries } from '@/lib/models';
import ModelFilters from '@/components/ModelFilters';
import YouTubeIcon from '@/components/YouTubeIcon';
import { Database, MapPin, Ruler, ArrowRight, Trophy } from 'lucide-react';
import { rankingi, listaWojewodztw } from '@/lib/dane';
import Link from 'next/link';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';

export default function HomePage() {
  const models = getModelSummaries();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-100 dark:bg-steel-900/60 text-steel-700 dark:text-steel-300 text-xs font-semibold">
          <Database className="w-4 h-4" aria-hidden="true" />
          Dane z państwowej bazy CEPiK
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Ile ich jeździ w Polsce <span className="text-rust-600 dark:text-rust-500">i gdzie?</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Karty popularnych modeli aut: liczba zarejestrowanych egzemplarzy, mapa województw, roczniki, silniki i wymiary – w jednym miejscu.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { ikona: <Database className="w-6 h-6" />, t: 'Liczby z CEPiK', o: 'Ile egzemplarzy danego modelu jest zarejestrowanych w Polsce, z podziałem na roczniki, silniki i paliwo.' },
          { ikona: <MapPin className="w-6 h-6" />, t: 'Mapa województw', o: 'Gdzie dany model jest najpopularniejszy, a gdzie to rzadkość.' },
          { ikona: <Ruler className="w-6 h-6" />, t: 'Dane techniczne', o: 'Wymiary, rysunek z proporcjami auta i pełna gama silników.' }
        ].map((k) => (
          <div key={k.t} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-steel-50 dark:bg-slate-800 text-steel-600 dark:text-steel-400 flex items-center justify-center" aria-hidden="true">
              {k.ikona}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{k.t}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{k.o}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="modele" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Modele w atlasie</h2>
            <p className="text-sm text-slate-500">Kliknij model, aby zobaczyć mapę, statystyki i dane techniczne</p>
          </div>
          <Link href="/metodologia/" className="inline-flex items-center gap-1 text-xs font-semibold text-steel-600 dark:text-steel-400 hover:underline">
            Skąd są dane? <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
        <ModelFilters initialModels={models} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Trophy className="w-5 h-5 text-rust-600" aria-hidden="true" /> Rankingi
          </h2>
          <ul className="space-y-1.5 text-sm">
            {rankingi.map((r) => (
              <li key={r.id}>
                <Link href={`/rankingi/${r.id}/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                  {r.tytul}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <MapPin className="w-5 h-5 text-steel-600" aria-hidden="true" /> Co jeździ w Twoim województwie?
          </h2>
          <div className="flex flex-wrap gap-2">
            {listaWojewodztw.map((w) => (
              <Link
                key={w.teryt}
                href={`/wojewodztwa/${w.slug}/`}
                className="px-2.5 py-1 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-steel-400"
              >
                {w.nazwa}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-4">
        <YouTubeIcon className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Zobacz to na filmach</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Na kanale {site.youtubeChannelName} pokazuję auta z tego atlasu z bliska.
        </p>
        <a
          href={site.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
        >
          <YouTubeIcon className="w-5 h-5" />
          Przejdź na kanał {site.youtubeChannelName}
        </a>
      </section>
      <KodStrony sciezka={'/'} />
    </div>
  );
}
