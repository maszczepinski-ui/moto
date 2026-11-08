import type { Metadata } from 'next';
import { PlayCircle } from 'lucide-react';
import { opublikowane, NAZWY_KATEGORII, Kategoria } from '@/lib/wpisy';
import { formatDate } from '@/lib/format';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import YouTubeIcon from '@/components/YouTubeIcon';

export const metadata: Metadata = {
  title: 'Filmy MotoFormat – testy, porady i zakup używanych aut',
  description: 'Filmy z kanału MotoFormat z artykułami: testy aut, porady, kupowanie używanych samochodów i pielęgnacja – z danymi o autach w Polsce z CEPiK.',
  alternates: { canonical: '/filmy/' },
  // pusta lista nie powinna trafiać do Google
  ...(opublikowane().length ? {} : { robots: { index: false, follow: true } })
};

export default function FilmyPage() {
  const wpisy = opublikowane();
  const kategorie = (Object.keys(NAZWY_KATEGORII) as Kategoria[]).filter((k) => wpisy.some((w) => w.kategoria === k));
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-3">
        <Okruszki sciezka={[{ nazwa: 'Filmy', adres: '/filmy/' }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Filmy i artykuły</h1>
        <p className="text-slate-700 dark:text-slate-300">
          Każdy film z kanału {site.youtubeChannelName} ma tu swój artykuł: najważniejsze informacje w punktach, rozdziały i dane z CEPiK o autach z filmu.
        </p>
        {kategorie.length > 1 && (
          <nav aria-label="Kategorie" className="flex flex-wrap gap-2 text-sm">
            {kategorie.map((k) => (
              <a key={k} href={`#${k}`} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200">
                {NAZWY_KATEGORII[k]}
              </a>
            ))}
          </nav>
        )}
      </div>

      {wpisy.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <YouTubeIcon className="w-10 h-10 text-red-600 mx-auto" />
          <p className="font-semibold text-slate-900 dark:text-white">Pierwsze artykuły do filmów pojawią się wkrótce.</p>
          <a href={site.youtubeChannelUrl} target="_blank" rel="noopener" className="text-sm font-semibold text-steel-700 underline">
            Zobacz kanał {site.youtubeChannelName}
          </a>
        </div>
      )}

      {kategorie.map((kat) => (
        <section key={kat} id={kat} className="scroll-mt-20 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{NAZWY_KATEGORII[kat]}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wpisy
              .filter((w) => w.kategoria === kat)
              .map((w) => (
                <li key={w.slug}>
                  <a href={`/filmy/${w.slug}/`} className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-rust-400 h-full">
                    <div className="aspect-video bg-gradient-to-br from-steel-700 to-steel-900 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs text-slate-500">{formatDate(w.opublikowano)}</p>
                      <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{w.tytul}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{w.lead}</p>
                    </div>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <KodStrony sciezka="/filmy/" />
    </div>
  );
}
