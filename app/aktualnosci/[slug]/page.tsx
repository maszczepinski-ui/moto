import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Car, ArrowRight, ShieldAlert, CalendarDays, Factory } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import { bezLamania, TYPY, jestTypem, aktualnoscPoSlugu, aktualnosciTypu, opublikowaneAktualnosci, type Aktualnosc, type TypAktualnosci } from '@/lib/aktualnosci';
import { SiatkaAktualnosci, ZakladkiTypow, PustaLista, ChipTypu, STYL_TYPU } from '@/components/aktualnosci/ListaAktualnosci';
import { getModelBySlug } from '@/lib/models';
import { nazwaKarty } from '@/lib/opis';
import { ArtykulMarkdown, type AutoLink } from '@/lib/markdown';
import { fmt, formatDate } from '@/lib/format';
import { site } from '@/config/site';
import { bezpiecznyJson, bezpiecznyUrl } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...(Object.keys(TYPY) as TypAktualnosci[]).map((t) => ({ slug: t })), ...opublikowaneAktualnosci().map((a) => ({ slug: a.slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (jestTypem(slug)) {
    const t = TYPY[slug];
    return {
      title: t.seoTytul,
      description: t.seoOpis,
      alternates: { canonical: `/aktualnosci/${slug}/` },
      ...(aktualnosciTypu(slug).length ? {} : { robots: { index: false, follow: true } })
    };
  }
  const a = aktualnoscPoSlugu(slug);
  if (!a) return { robots: { index: false } };
  return {
    title: a.tytul,
    description: a.lead,
    alternates: { canonical: `/aktualnosci/${a.slug}/` },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: { type: 'article', url: `/aktualnosci/${a.slug}/`, title: a.tytul, description: a.lead, publishedTime: a.data, siteName: site.name, locale: 'pl_PL' }
  };
}

function Kategoria({ typ }: { typ: TypAktualnosci }) {
  const t = TYPY[typ];
  const lista = aktualnosciTypu(typ);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Okruszki
        sciezka={[
          { nazwa: 'Aktualności', adres: '/aktualnosci/' },
          { nazwa: t.nazwa, adres: `/aktualnosci/${typ}/` }
        ]}
      />
      <header className="space-y-3 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{t.nazwa}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{t.opis}</p>
      </header>
      <ZakladkiTypow aktywny={typ} />
      {lista.length ? <SiatkaAktualnosci lista={lista} /> : <PustaLista />}
    </div>
  );
}

function Pozycje({ a }: { a: Aktualnosc }) {
  if (!a.pozycje?.length) return null;
  return (
    <section aria-labelledby="lista-akcji" className="space-y-4">
      <h2 id="lista-akcji" className="text-2xl font-bold text-slate-900 dark:text-white">
        Lista wezwań ({a.pozycje.length})
      </h2>
      <ul className="space-y-4">
        {a.pozycje.map((p, i) => {
          const m = p.karta ? getModelBySlug(p.karta) : undefined;
          const link = bezpiecznyUrl(p.link);
          return (
            <li key={`${p.marka}-${p.model}-${i}`} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {p.marka} {p.model}
                </h3>
                {p.poziom && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 px-2.5 py-0.5 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> {p.poziom}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                {p.produkcja && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" aria-hidden="true" /> produkcja: {p.produkcja}
                  </span>
                )}
                {p.kodAkcji && <span>kod akcji: {p.kodAkcji}</span>}
                {p.kraj && (
                  <span className="inline-flex items-center gap-1">
                    <Factory className="w-4 h-4" aria-hidden="true" /> zgłosił: {p.kraj}
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Problem:</strong> {p.problem}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Co robi producent:</strong> {p.zalecenie}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                {m && (
                  <Link href={m.adres} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-sm font-bold">
                    <Car className="w-4 h-4" aria-hidden="true" /> {nazwaKarty(m)} – w Polsce {fmt(m.cepik.liczbaWPolsce)} aut
                  </Link>
                )}
                {link && (
                  <a href={link} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300 underline">
                    Zgłoszenie w Safety Gate <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Wpis({ a }: { a: Aktualnosc }) {
  const modele = (a.modele || []).map(getModelBySlug).filter((m): m is NonNullable<typeof m> => !!m);
  const linki: AutoLink[] = modele.flatMap((m) => [
    { fraza: nazwaKarty(m), adres: m.adres },
    { fraza: `${m.marka} ${m.model}`, adres: m.adres }
  ]);
  const t = TYPY[a.typ];
  const inne = aktualnosciTypu(a.typ).filter((x) => x.slug !== a.slug).slice(0, 3);
  const adres = `${site.url}/aktualnosci/${a.slug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.tytul,
    description: a.lead,
    datePublished: a.data,
    dateModified: a.data,
    inLanguage: 'pl-PL',
    mainEntityOfPage: adres,
    author: { '@type': 'Person', name: site.author, url: site.youtubeChannelUrl },
    publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/apple-icon.png` } },
    isBasedOn: a.zrodla.map((z) => z.url),
    image: [a.zdjecie ? `${site.url}${a.zdjecie.duze}` : `${adres}opengraph-image`]
  };
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Okruszki
        sciezka={[
          { nazwa: 'Aktualności', adres: '/aktualnosci/' },
          { nazwa: t.nazwa, adres: `/aktualnosci/${a.typ}/` },
          { nazwa: a.tytul, adres: `/aktualnosci/${a.slug}/` }
        ]}
      />
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <ChipTypu typ={a.typ} />
          <time dateTime={a.data}>{formatDate(a.data)}</time>
          <span>· {site.author}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{bezLamania(a.tytul)}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{a.lead}</p>
        <div className={`h-1 w-16 rounded-full ${STYL_TYPU[a.typ].pasek}`} aria-hidden="true" />
      </header>

      {a.zdjecie && (
        <figure className="-mx-4 sm:mx-0 space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.zdjecie.duze}
            alt={a.zdjecie.alt}
            width={a.zdjecie.szerokosc}
            height={a.zdjecie.wysokosc}
            fetchPriority="high"
            className="w-full h-auto sm:rounded-3xl bg-slate-200 dark:bg-slate-800"
          />
          {a.zdjecie.podpis && <figcaption className="px-4 sm:px-0 text-xs text-slate-500">{a.zdjecie.podpis}</figcaption>}
        </figure>
      )}

      <ArtykulMarkdown tekst={a.tresc} linki={linki} />

      <Pozycje a={a} />

      {a.typ === 'akcje-serwisowe' && (
        <aside className="rounded-3xl bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-200 dark:ring-amber-900 p-5 text-amber-950 dark:text-amber-100 space-y-2">
          <p className="font-extrabold">Czy akcja dotyczy Twojego auta?</p>
          <p className="text-sm">
            Zgłoszenia w Safety Gate pochodzą z różnych krajów UE. O tym, czy wezwanie obejmuje konkretny egzemplarz, decyduje numer VIN – zadzwoń do autoryzowanego serwisu marki
            i podaj VIN z dowodu rejestracyjnego. Naprawa w ramach akcji serwisowej jest bezpłatna.
          </p>
        </aside>
      )}

      <section aria-labelledby="zrodla" className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-5 space-y-2 text-sm">
        <h2 id="zrodla" className="font-extrabold text-slate-900 dark:text-white">
          Źródła
        </h2>
        <ul className="space-y-1">
          {a.zrodla.map((z) => {
            const u = bezpiecznyUrl(z.url);
            return (
              <li key={z.url}>
                {u ? (
                  <a href={u} target="_blank" rel="noopener" className="underline">
                    {z.nazwa}
                  </a>
                ) : (
                  z.nazwa
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-slate-500">
          {a.typ === 'premiery'
            ? 'Tekst redakcyjny MotoRaport napisany na podstawie informacji prasowej producenta.'
            : a.typ === 'akcje-serwisowe'
              ? 'Dane: Komisja Europejska, system Safety Gate. Opracowanie i tłumaczenie: MotoRaport.'
              : 'Opracowanie MotoRaport na podstawie komunikatu urzędowego.'}
          {a.licencja ? ` Treść źródła udostępniona na licencji ${a.licencja}; to opracowanie udostępniamy na tej samej licencji.` : ''}
        </p>
      </section>

      {inne.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Więcej: {t.nazwa.toLowerCase()}</h2>
            <Link href={`/aktualnosci/${a.typ}/`} className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300">
              Wszystkie <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <SiatkaAktualnosci lista={inne} />
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </article>
  );
}

export default async function AktualnoscPage({ params }: Props) {
  const { slug } = await params;
  if (jestTypem(slug)) return <Kategoria typ={slug} />;
  const a = aktualnoscPoSlugu(slug);
  if (!a) notFound();
  return <Wpis a={a} />;
}
