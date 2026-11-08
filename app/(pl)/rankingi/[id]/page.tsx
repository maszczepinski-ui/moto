import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ListaModeli, { szt } from '@/components/ListaModeli';
import { rankingi, tlo } from '@/lib/dane';
import { formatDate } from '@/lib/format';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return rankingi.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const r = rankingi.find((x) => x.id === id);
  if (!r) return {};
  return {
    title: `${r.tytul} – ranking ${new Date(tlo.stanNa).getFullYear()}`,
    description: `${r.opis} Ranking ${r.pozycje.length} modeli na podstawie danych CEPiK.`,
    alternates: { canonical: `/rankingi/${r.id}/` }
  };
}

export default async function RankingPage({ params }: Props) {
  const { id } = await params;
  const r = rankingi.find((x) => x.id === id);
  if (!r) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: r.tytul,
    itemListElement: r.pozycje.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.nazwa, url: `${site.url}${p.adres}` }))
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <nav className="text-sm text-slate-500" aria-label="Okruszki">
        <Link href="/rankingi/" className="hover:underline">
          Rankingi
        </Link>{' '}
        / <span className="text-slate-700 dark:text-slate-300">{r.tytul}</span>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{r.tytul}</h1>
        <p className="text-slate-600 dark:text-slate-300">{r.opis}</p>
      </header>

      {r.id === 'chinskie' && (
        <Link href="/chinskie-samochody/" className="flex items-center justify-between gap-3 bg-rust-600 hover:bg-rust-700 text-white rounded-2xl p-5 font-bold">
          <span>Ranking {new Date(tlo.stanNa).getFullYear()}: które chińskie modele Polacy rejestrują teraz najczęściej (z cenami i trendami)</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <ListaModeli
          pozycje={r.pozycje.map((p) => ({
            slug: p.slug,
            adres: p.adres,
            nazwa: p.nazwa,
            wartosc: p.wartosc,
            podpis: r.id === 'najpopularniejsze' ? undefined : `${szt(p.liczba)} w Polsce`
          }))}
        />
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Inne rankingi</h2>
        <div className="flex flex-wrap gap-2">
          {rankingi
            .filter((x) => x.id !== r.id)
            .map((x) => (
              <Link
                key={x.id}
                href={`/rankingi/${x.id}/`}
                className="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400"
              >
                {x.tytul}
              </Link>
            ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. Liczymy wszystkie generacje danego modelu razem. Więcej w zakładce{' '}
        <Link href="/metodologia/" className="underline">
          Skąd dane
        </Link>
        .
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka={`/rankingi/${r.id}/`} />
    </div>
  );
}
