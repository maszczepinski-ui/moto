import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trophy, Sparkles, CalendarClock, MapPin } from 'lucide-react';
import MiniMapa from '@/components/MiniMapa';
import ListaModeli, { szt } from '@/components/ListaModeli';
import BarList from '@/components/BarList';
import { listaWojewodztw, wojewodztwoPoSlugu, tlo } from '@/lib/dane';
import { WOJEWODZTWA } from '@/lib/wojewodztwa';
import { fmt, formatDate } from '@/lib/format';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return listaWojewodztw.map((w) => ({ slug: w.slug }));
}

const miejscownik = (teryt: string) => WOJEWODZTWA.find((w) => w.teryt === teryt)?.miejscownik ?? '';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = wojewodztwoPoSlugu(slug);
  if (!w) return {};
  const lider = w.top[0]?.nazwa;
  return {
    title: `Jakie auta jeżdżą ${miejscownik(w.teryt)}? Najpopularniejsze modele – ${w.nazwa}`,
    description: `Najpopularniejsze samochody osobowe ${miejscownik(w.teryt)}${lider ? ` (nr 1: ${lider})` : ''}, modele charakterystyczne dla regionu i wiek aut. Dane CEPiK.`,
    alternates: { canonical: `/wojewodztwa/${w.slug}/` }
  };
}

export default async function WojewodztwoPage({ params }: Props) {
  const { slug } = await params;
  const w = wojewodztwoPoSlugu(slug);
  if (!w) notFound();

  const maxTop = w.top[0]?.liczba || 1;
  const maxInd = w.charakterystyczne[0]?.indeks || 1;
  const udzialWPolsce = ((w.auta / tlo.razem) * 100).toFixed(1).replace('.', ',');
  const gdzie = miejscownik(w.teryt);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Województwa', item: `${site.url}/wojewodztwa/` },
      { '@type': 'ListItem', position: 3, name: w.nazwa, item: `${site.url}/wojewodztwa/${w.slug}/` }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <nav className="text-sm text-slate-500" aria-label="Okruszki">
        <Link href="/wojewodztwa/" className="hover:underline">
          Województwa
        </Link>{' '}
        / <span className="text-slate-700 dark:text-slate-300">{w.nazwa}</span>
      </nav>

      <header className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white break-words hyphens-auto" lang="pl">Jakie auta jeżdżą {gdzie}?</h1>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-steel-700 text-white rounded-xl p-4">
              <dt className="text-xs text-steel-100">Zarejestrowanych osobówek</dt>
              <dd className="text-2xl font-black tabular-nums">{fmt(w.auta)}</dd>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <dt className="text-xs text-slate-500">Udział w Polsce</dt>
              <dd className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">{udzialWPolsce}%</dd>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <dt className="text-xs text-slate-500">Średni rocznik</dt>
              <dd className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">{w.sredniRocznik ? Math.round(w.sredniRocznik) : '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="max-w-[260px] w-full mx-auto">
          <MiniMapa wyroznione={w.teryt} opis={`Położenie województwa ${w.nazwa.toLowerCase()} na mapie Polski`} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Trophy className="w-5 h-5 text-steel-600" aria-hidden="true" /> Najpopularniejsze modele
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-3">Liczba zarejestrowanych aut (wszystkie generacje razem)</p>
          <ListaModeli pozycje={w.top.map((p) => ({ slug: p.slug, adres: p.adres, nazwa: p.nazwa, wartosc: szt(p.liczba), pasek: p.liczba / maxTop }))} />
        </section>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-rust-600" aria-hidden="true" /> Charakterystyczne dla regionu
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Modele, które są tu częstsze niż średnio w Polsce. „2×” oznacza dwa razy większy udział wśród osobówek niż w całym kraju.
            </p>
            <ListaModeli
              kolor="rust"
              pozycje={w.charakterystyczne.map((p) => ({
                slug: p.slug,
                adres: p.adres,
                nazwa: p.nazwa,
                wartosc: `${(p.indeks ?? 0).toFixed(1).replace('.', ',')}×`,
                podpis: szt(p.liczba),
                pasek: (p.indeks ?? 0) / maxInd
              }))}
            />
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-3">
              <CalendarClock className="w-5 h-5 text-steel-600" aria-hidden="true" /> Z jakich lat są auta
            </h2>
            <BarList tytul="Rok produkcji" opis="Zarejestrowane osobówki według dekady produkcji" dane={w.dekady} />
          </section>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <MapPin className="w-5 h-5 text-steel-600" aria-hidden="true" /> Inne województwa
        </h2>
        <div className="flex flex-wrap gap-2">
          {listaWojewodztw
            .filter((x) => x.teryt !== w.teryt)
            .map((x) => (
              <Link
                key={x.teryt}
                href={`/wojewodztwa/${x.slug}/`}
                className="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400"
              >
                {x.nazwa}
              </Link>
            ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. Województwo to miejsce rejestracji auta. Liczone są zarejestrowane samochody osobowe, także te, które latami stoją
        nieużywane. Pokazujemy modele, które mają w Polsce co najmniej 2000 egzemplarzy.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka={`/wojewodztwa/${w.slug}/`} />
    </div>
  );
}
