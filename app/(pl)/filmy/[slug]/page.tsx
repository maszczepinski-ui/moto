import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, MapPin, Car, ArrowRight } from 'lucide-react';
import { opublikowane, wpisPoSlugu, sekundy, NAZWY_KATEGORII } from '@/lib/wpisy';
import { getModelBySlug } from '@/lib/models';
import { nazwaKarty, najwiecej } from '@/lib/opis';
import { fmt, formatDate } from '@/lib/format';
import { nazwaWojewodztwa } from '@/lib/wojewodztwa';
import { udzialImportu, PROCENT, rzadkoscModelu } from '@/lib/zakup';
import { produkt, produktyFilmu } from '@/lib/produkty';
import { ArtykulMarkdown, AutoLink } from '@/lib/markdown';
import { KontekstKarty } from '@/lib/panel';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import YouTubeLazyEmbed from '@/components/YouTubeLazyEmbed';
import BlokKonwersji from '@/components/BlokKonwersji';
import ProduktKarta from '@/components/ProduktKarta';
import KodStrony from '@/components/KodStrony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const w = opublikowane();
  // bez opublikowanych wpisów Next.js wymaga choć jednego adresu – strona „wkrotce” zwraca 404
  return w.length ? w.map((x) => ({ slug: x.slug })) : [{ slug: 'wkrotce' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = wpisPoSlugu((await params).slug);
  if (!w) return { robots: { index: false } };
  return {
    title: w.tytul,
    description: w.lead,
    alternates: { canonical: `/filmy/${w.slug}/` },
    openGraph: { title: w.tytul, description: w.lead, type: 'article', url: `/filmy/${w.slug}/`, images: [`https://i.ytimg.com/vi/${w.youtubeId}/hqdefault.jpg`] }
  };
}

export default async function WpisPage({ params }: Props) {
  const w = wpisPoSlugu((await params).slug);
  if (!w) notFound();
  const modele = w.modele.map((s) => getModelBySlug(s)).filter((m): m is NonNullable<typeof m> => !!m);
  const glowny = modele[0];
  const k: KontekstKarty = glowny
    ? { slug: glowny.slug, marka: glowny.marka, model: glowny.model, generacja: glowny.generacja, sredniRocznik: glowny.cepik.sredniRocznik, liczba: glowny.cepik.liczbaWPolsce }
    : { slug: `film-${w.slug}`, marka: '', model: '' };
  // pierwsze wystąpienie nazwy modelu w tekście staje się linkiem do jego karty
  const linki: AutoLink[] = modele.flatMap((m) => [
    { fraza: nazwaKarty(m), adres: m.adres },
    { fraza: `${m.model} ${m.generacja}`.trim(), adres: m.adres }
  ]);
  const produkty = [...(w.produkty || []).map(produkt).filter((p): p is NonNullable<typeof p> => !!p), ...produktyFilmu([w.youtubeId, w.slug])].filter(
    (p, i, a) => a.findIndex((x) => x.id === p.id) === i
  );
  const adres = `${site.url}/filmy/${w.slug}/`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: w.tytul,
      description: w.lead,
      thumbnailUrl: [`https://i.ytimg.com/vi/${w.youtubeId}/hqdefault.jpg`],
      uploadDate: w.opublikowano,
      contentUrl: `https://www.youtube.com/watch?v=${w.youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${w.youtubeId}`,
      ...(w.rozdzialy?.length
        ? {
            hasPart: w.rozdzialy.map((r, i) => ({
              '@type': 'Clip',
              name: r.tytul,
              startOffset: sekundy(r.czas),
              ...(w.rozdzialy![i + 1] ? { endOffset: sekundy(w.rozdzialy![i + 1].czas) } : {}),
              url: `https://www.youtube.com/watch?v=${w.youtubeId}&t=${sekundy(r.czas)}s`
            }))
          }
        : {})
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: w.tytul,
      description: w.lead,
      datePublished: w.opublikowano,
      author: { '@type': 'Person', name: site.author },
      publisher: { '@type': 'Organization', name: site.name },
      mainEntityOfPage: adres
    },
    ...(w.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: w.faq.map((f) => ({ '@type': 'Question', name: f.pytanie, acceptedAnswer: { '@type': 'Answer', text: f.odpowiedz } }))
          }
        ]
      : [])
  ];

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <div className="space-y-4">
        <Okruszki sciezka={[{ nazwa: 'Filmy', adres: '/filmy/' }, { nazwa: w.tytul, adres: `/filmy/${w.slug}/` }]} />
        <p className="text-sm font-bold text-rust-600 uppercase tracking-widest">{NAZWY_KATEGORII[w.kategoria]}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">{w.tytul}</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300">{w.lead}</p>
        <p className="text-sm text-slate-500">
          {site.author} • {formatDate(w.opublikowano)} • film na kanale {site.youtubeChannelName}
        </p>
      </div>

      <YouTubeLazyEmbed videoId={w.youtubeId} title={w.tytul} />

      {w.rozdzialy && w.rozdzialy.length > 0 && (
        <nav aria-label="Rozdziały filmu" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
            <Clock className="w-5 h-5 text-steel-600" aria-hidden="true" /> Rozdziały filmu
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {w.rozdzialy.map((r) => (
              <li key={r.czas} className="flex gap-3">
                <a href={`https://www.youtube.com/watch?v=${w.youtubeId}&t=${sekundy(r.czas)}s`} target="_blank" rel="noopener" className="font-mono font-bold text-red-600 hover:underline">
                  {r.czas}
                </a>
                <span className="text-slate-700 dark:text-slate-300">{r.tytul}</span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {modele.length > 0 && (
        <section aria-label="Modele z filmu w danych CEPiK" className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Auta z filmu w liczbach (CEPiK)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modele.map((m) => {
              const imp = udzialImportu(m);
              const top = najwiecej(m);
              return (
                <div key={m.slug} className="bg-steel-700 text-white rounded-2xl p-5 space-y-2">
                  <p className="flex items-center gap-2 font-extrabold text-lg">
                    <Car className="w-5 h-5" aria-hidden="true" /> {nazwaKarty(m)}
                  </p>
                  <p className="text-3xl font-black tabular-nums">
                    {fmt(m.cepik.liczbaWPolsce)} <span className="text-sm font-normal text-steel-100">aut w Polsce • {rzadkoscModelu(m).poziom.toLowerCase()}</span>
                  </p>
                  <ul className="text-sm text-steel-50 space-y-0.5">
                    {imp !== null && <li>{PROCENT(imp)} sprowadzonych jako używane</li>}
                    {top && (
                      <li className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> najwięcej: {nazwaWojewodztwa(top.teryt).toLowerCase()}
                      </li>
                    )}
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href={m.adres} className="inline-flex items-center gap-1 bg-white text-steel-800 font-bold text-sm px-3 py-1.5 rounded-lg">
                      Karta modelu <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <a href={`${m.adres}zakup/`} className="inline-flex items-center gap-1 bg-white/15 font-bold text-sm px-3 py-1.5 rounded-lg">
                      Kupujesz? Asystent
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <ArtykulMarkdown tekst={w.tresc} linki={linki} />

      {produkty.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Produkty z filmu</h2>
          {produkty.map((p) => (
            <ProduktKarta key={p.id} p={p} zrodlo={`film-${w.slug}`} />
          ))}
        </section>
      )}

      <section aria-label="Co dalej" className="space-y-3">
        <BlokKonwersji typ={w.konwersja} k={k} adresZakupu={glowny ? `${glowny.adres}zakup/` : undefined} />
      </section>

      {w.faq && w.faq.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
          <div className="space-y-2">
            {w.faq.map((f) => (
              <details key={f.pytanie} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer">{f.pytanie}</summary>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{f.odpowiedz}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
        Artykuł powstał na podstawie filmu z kanału {site.youtubeChannelName}. Niektóre linki na tej stronie są partnerskie – jeśli z nich skorzystasz, możemy otrzymać prowizję,
        a Ty nie płacisz więcej.
      </p>
      <KodStrony sciezka={`/filmy/${w.slug}/`} />
    </article>
  );
}
