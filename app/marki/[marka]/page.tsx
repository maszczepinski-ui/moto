import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marki, markaPoSlugu, tlo, uwagaUzupelnianie } from '@/lib/dane';
import { fmt, formatDate, sztuk } from '@/lib/format';
import { nazwaWojewodztwa, slugWojewodztwa } from '@/lib/wojewodztwa';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import MiniMapa from '@/components/MiniMapa';

interface Props {
  params: Promise<{ marka: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return marki.map((m) => ({ marka: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marka } = await params;
  const m = markaPoSlugu(marka);
  if (!m) return {};
  const top = m.modele.slice(0, 3).map((x) => x.nazwa).join(', ');
  return {
    title: `${m.nazwa} w Polsce – ${fmt(m.auta)} aut, modele i generacje`,
    description: `Ile aut ${m.nazwa} jest zarejestrowanych w Polsce: ${fmt(m.auta)} ${sztuk(m.auta)} według CEPiK. Najpopularniejsze modele: ${top}. Ranking modeli, generacje, województwa.`,
    alternates: { canonical: `/marki/${m.slug}/` }
  };
}

const tloWoj = tlo.wojewodztwa as Record<string, number>;

export default async function MarkaPage({ params }: Props) {
  const { marka } = await params;
  const m = markaPoSlugu(marka);
  if (!m) notFound();
  const miejsce = marki.findIndex((x) => x.slug === m.slug) + 1;
  const suma = m.wojewodztwa.reduce((s, w) => s + w.liczba, 0) || 1;
  const indeksy = m.wojewodztwa
    .filter((w) => tloWoj[w.teryt])
    .map((w) => ({ ...w, indeks: w.liczba / tloWoj[w.teryt] / (suma / tlo.razem) }))
    .sort((a, b) => b.indeks - a.indeks);
  const lider = indeksy[0];
  const klasy = Object.fromEntries(
    indeksy.map((w) => [
      w.teryt,
      w.indeks >= 1.5 ? 'fill-rust-500' : w.indeks >= 1.15 ? 'fill-rust-300 dark:fill-rust-700' : w.indeks < 0.85 ? 'fill-steel-300 dark:fill-steel-800' : 'fill-slate-200 dark:fill-slate-700'
    ])
  );
  const etykiety = Object.fromEntries(indeksy.map((w) => [w.teryt, `${w.indeks.toFixed(1).replace('.', ',')}×`]));
  const max = m.modele[0]?.liczba || 1;
  const zdania = [
    `W Polsce zarejestrowanych jest ${fmt(m.auta)} ${sztuk(m.auta)} marki ${m.nazwa} – to ${miejsce}. miejsce wśród ${marki.length} marek w atlasie.`,
    m.modele.length > 1
      ? `Najpopularniejszy model to ${m.modele[0].nazwa} (${fmt(m.modele[0].liczba)} szt.), a za nim ${m.modele[1].nazwa} (${fmt(m.modele[1].liczba)} szt.).`
      : '',
    m.nowe ? `Od listopada 2019 r. w Polsce zarejestrowano po raz pierwszy ${fmt(m.nowe)} aut tej marki – nowych z salonów i sprowadzonych.${uwagaUzupelnianie() ? ' ' + uwagaUzupelnianie() : ''}` : '',
    m.hybrydy >= m.auta * 0.05 ? `Hybrydy to ${Math.round((m.hybrydy / m.auta) * 100)}% zarejestrowanych egzemplarzy.` : '',
    lider && lider.indeks >= 1.2
      ? `Marka jest najpopularniejsza w województwie ${nazwaWojewodztwa(lider.teryt).toLowerCase()} – ${lider.indeks.toFixed(1).replace('.', ',')}× częściej niż średnio w kraju.`
      : ''
  ].filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Modele ${m.nazwa} zarejestrowane w Polsce`,
    itemListElement: m.modele.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `${m.nazwa} ${x.nazwa}`, url: `${site.url}${x.adres}` }))
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Marki', adres: '/marki/' }, { nazwa: m.nazwa, adres: `/marki/${m.slug}/` }]} />
      <header className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">{m.nazwa} w Polsce</h1>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{zdania.join(' ')}</p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['Zarejestrowanych', fmt(m.auta)],
              ['Modeli w atlasie', String(m.modele.length)],
              ['Nowe od XI 2019', fmt(m.nowe)],
              ['Hybrydy / elektryki', `${fmt(m.hybrydy)} / ${fmt(m.elektryczne)}`]
            ].map(([k, v]) => (
              <div key={k} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="space-y-2">
          <MiniMapa klasy={klasy} etykiety={etykiety} opis={`Mapa: gdzie marka ${m.nazwa} jest popularniejsza niż średnio`} />
          <figcaption className="text-xs text-slate-500">
            Ile razy częściej niż średnio w Polsce występują auta {m.nazwa} w danym województwie. Kliknij województwo, żeby zobaczyć, co tam jeździ.
          </figcaption>
        </figure>
      </header>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ranking modeli {m.nazwa}</h2>
        <ol className="divide-y divide-slate-100 dark:divide-slate-800">
          {m.modele.map((x, i) => (
            <li key={x.slug} className="py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <a href={x.adres} className="flex items-baseline gap-2 min-w-0 hover:underline">
                  <span className="text-xs text-slate-400 tabular-nums w-6 flex-shrink-0">{i + 1}.</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{x.nazwa}</span>
                  <span className="text-xs text-slate-500 hidden sm:inline">{x.lata}</span>
                </a>
                <span className="text-sm tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">{fmt(x.liczba)} szt.</span>
              </div>
              <div className="ml-8 mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-steel-500" style={{ width: `${Math.max(1, (x.liczba / max) * 100)}%` }} />
              </div>
              {x.generacje.length > 0 && (
                <div className="ml-8 mt-1 text-xs text-slate-500">
                  Generacje:{' '}
                  {x.generacje.map((g, j) => (
                    <span key={g.slug}>
                      {j > 0 && ', '}
                      <a href={g.adres} className="text-steel-600 dark:text-steel-400 hover:underline">
                        {g.nazwa}
                      </a>
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Województwa</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {[...m.wojewodztwa].sort((a, b) => b.liczba - a.liczba).map((w) => (
            <li key={w.teryt}>
              <a href={`/wojewodztwa/${slugWojewodztwa(w.teryt)}/`} className="inline-block px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400">
                {nazwaWojewodztwa(w.teryt)} <span className="text-slate-500 tabular-nums">{fmt(w.liczba)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-500">Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. Liczymy modele, które mają w atlasie własną kartę (co najmniej 200 aut).</p>
      <KodStrony sciezka={`/marki/${m.slug}/`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
