import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, FileSearch, Trophy, MapPin, Search } from 'lucide-react';
import YouTubeIcon from '@/components/YouTubeIcon';
import { zKanalem } from '@/lib/kanal';
import { panelDane, youtubeId, linkVinOgolny, linkUbezpieczenia, KontekstKarty } from '@/lib/panel';
import { getModelSummaries } from '@/lib/models';
import { formatDate } from '@/lib/format';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';

// Strona „wszystkie linki w jednym miejscu” – do wklejenia w opis kanału, Instagram, TikTok.
// Treść zmienia się z panelu admina (linki partnerskie i filmy).
export const metadata: Metadata = {
  title: 'Linki',
  description: `Najważniejsze linki ${site.youtubeChannelName}: kanał YouTube, najnowsze filmy, sprawdzenie historii VIN i porównanie ubezpieczeń.`,
  alternates: { canonical: '/linki/' }
};

const przycisk =
  'flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl font-semibold text-left transition-transform hover:scale-[1.01]';

export default function LinkiPage() {
  const karty = getModelSummaries();
  const nazwy = new Map(karty.map((m) => [m.slug, `${m.marka} ${m.model} ${m.generacja}`.trim()]));
  const adresy = new Map(karty.map((m) => [m.slug, m.adres]));
  const filmy = [...panelDane.filmy]
    .map((f) => ({ ...f, id: youtubeId(f.youtube) }))
    .filter((f) => f.id)
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 6);

  const ogolny: KontekstKarty = { slug: 'linki', marka: '', model: '' };
  const partnerskie = (
    [
      ['vin', 'Sprawdź historię auta po VIN', FileSearch],
      ['oc', 'Porównaj ceny OC', ShieldCheck],
      ['ac', 'Porównaj ceny AC', ShieldCheck],
      ['nnw', 'Porównaj ceny NNW', ShieldCheck]
    ] as const
  )
    .map(([k, e, I]) => [k, e, I, k === 'vin' ? zKanalem(linkVinOgolny(ogolny), 'linki') : linkUbezpieczenia(k, ogolny)] as const)
    .filter(([, , , l]) => l);

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <header className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center">
          <YouTubeIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{site.youtubeChannelName}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Filmy o autach i atlas: ile ich jeździ w Polsce i gdzie</p>
      </header>

      <a href={site.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className={`${przycisk} bg-red-600 hover:bg-red-700 text-white`}>
        <span className="flex items-center gap-3">
          <YouTubeIcon className="w-5 h-5" /> Kanał na YouTube
        </span>
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </a>

      {partnerskie.length > 0 && (
        <section className="space-y-3">
          {partnerskie.map(([k, etykieta, Ikona, link]) => (
            <a
              key={k}
              href={link}
              target="_blank"
              rel="sponsored nofollow noopener"
              className={`${przycisk} bg-steel-700 hover:bg-steel-800 text-white`}
            >
              <span className="flex items-center gap-3">
                <Ikona className="w-5 h-5" aria-hidden="true" /> {etykieta}
              </span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          ))}
          <p className="text-[11px] text-center text-slate-500">Linki partnerskie – skorzystanie z nich nie zmienia ceny, a wspiera kanał.</p>
        </section>
      )}

      <section className="space-y-3">
        <Link href="/#modele" className={`${przycisk} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white`}>
          <span className="flex items-center gap-3">
            <Search className="w-5 h-5 text-steel-600" aria-hidden="true" /> Znajdź swój model w atlasie
          </span>
        </Link>
        <Link href="/rankingi/" className={`${przycisk} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white`}>
          <span className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-rust-600" aria-hidden="true" /> Rankingi aut w Polsce
          </span>
        </Link>
        <Link href="/wojewodztwa/" className={`${przycisk} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white`}>
          <span className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-steel-600" aria-hidden="true" /> Co jeździ w Twoim województwie
          </span>
        </Link>
      </section>

      {filmy.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 text-center">Najnowsze filmy</h2>
          {filmy.map((f) => (
            <div key={`${f.id}-${f.slug}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
              <a href={`https://www.youtube.com/watch?v=${f.id}`} target="_blank" rel="noopener" className="font-semibold text-slate-900 dark:text-white hover:underline block">
                ▶ {f.tytul}
              </a>
              <div className="text-xs text-slate-500">
                {formatDate(f.data)} •{' '}
                <Link href={adresy.get(f.slug) ?? '/'} className="text-steel-600 dark:text-steel-400 hover:underline">
                  karta modelu: {nazwy.get(f.slug) ?? f.slug}
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
      <KodStrony sciezka={'/linki/'} />
    </div>
  );
}
