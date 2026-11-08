// Strona przetłumaczonego poradnika (/uk/poradnyky/…/, /en/guides/…/).
// Wygląd jak w polskiej wersji; narzędzia i wzory do druku prowadzą do polskich stron (z oznaczeniem PL).
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CalendarCheck, CircleCheck, Clock, Languages, Plus, Printer, ScanLine } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import BlokiPoradnika from '@/components/BlokiPoradnika';
import { AKCENT } from '@/lib/poradniki-wyglad';
import { czasCzytania, dataPublikacji } from '@/lib/poradniki';
import { META, PORADNIKI_ADRES, SLOWNIK, type JezykObcy } from '@/lib/jezyki';
import { adresPoradnika, hreflang, lokalnyLink, poradnikiObce, type PoradnikObcy } from '@/lib/tlumaczenia';
import { typoObce } from '@/lib/typografia';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

const minuty = (p: PoradnikObcy) => czasCzytania({ ...p.oryginal, opis: p.opis, sekcje: p.sekcje });

export function metadanePoradnikaObcego(j: JezykObcy, p: PoradnikObcy): Metadata {
  const adres = adresPoradnika(j, p.slug);
  return {
    title: p.seoTytul,
    description: p.seoOpis,
    alternates: { canonical: adres, languages: hreflang(adres) },
    openGraph: {
      type: 'article',
      url: adres,
      title: p.seoTytul,
      description: p.seoOpis,
      siteName: site.name,
      locale: META[j].locale,
      publishedTime: dataPublikacji(p.oryginal),
      modifiedTime: p.aktualizacja
    },
    twitter: { card: 'summary_large_image', title: p.seoTytul, description: p.seoOpis }
  };
}

export default function PoradnikObcyStrona({ j, p }: { j: JezykObcy; p: PoradnikObcy }) {
  const t = SLOWNIK[j];
  const typo = typoObce(j);
  const a = AKCENT[p.oryginal.kategoria];
  const adres = adresPoradnika(j, p.slug);
  const adresPl = adresPoradnika('pl', p.pl);
  const wszystkie = poradnikiObce(j);
  const i = wszystkie.findIndex((x) => x.slug === p.slug);
  const nastepny = wszystkie[(i + 1) % wszystkie.length];
  // powiązane: najpierw te z polskiego oryginału, które mają tłumaczenie, potem pozostałe
  const powiazane = [
    ...(p.oryginal.powiazane || []).map((s) => wszystkie.find((x) => x.pl === s)).filter((x): x is PoradnikObcy => !!x),
    ...wszystkie
  ]
    .filter((x, n, lista) => x.slug !== p.slug && x.slug !== nastepny.slug && lista.findIndex((y) => y.slug === x.slug) === n)
    .slice(0, 3);
  const spis = [...p.sekcje.map((s) => ({ id: s.id, t: s.t })), ...(p.faq?.length ? [{ id: 'pytania', t: t.poradnik.pytania }] : [])];
  const data = new Date(p.aktualizacja + 'T12:00:00').toLocaleDateString(META[j].data, { day: 'numeric', month: 'long', year: 'numeric' });
  const pelny = `${site.url}${adres}`;
  const pokazVin = p.oryginal.kategoria === 'kupno' || p.oryginal.kategoria === 'sprawdzenie';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: p.tytul,
      description: p.seoOpis,
      inLanguage: META[j].data,
      datePublished: dataPublikacji(p.oryginal),
      dateModified: p.aktualizacja,
      mainEntityOfPage: { '@type': 'WebPage', '@id': pelny },
      author: { '@type': 'Person', name: site.author, url: site.youtubeChannelUrl },
      publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/apple-icon.png` } },
      translationOfWork: { '@type': 'Article', '@id': `${site.url}${adresPl}`, inLanguage: 'pl-PL' },
      citation: p.oryginal.zrodla.map((z) => z.url)
    },
    ...(p.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: META[j].data,
            mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
          }
        ]
      : [])
  ];

  return (
    <div className="pb-12">
      <header className={`relative overflow-hidden bg-gradient-to-br ${a.tlo} text-white`}>
        <div className="absolute -right-16 -bottom-20 opacity-[0.06]" aria-hidden="true">
          <IkonaPoradnika ikona={p.oryginal.ikona} className="w-[26rem] h-[26rem]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-6 pb-10 sm:pb-14">
          <div className="[&_a]:text-white/60 [&_span]:text-white/60 [&_a:hover]:text-white">
            <Okruszki
              start={{ nazwa: t.stronaGlowna, adres: `/${j}/` }}
              etykieta={t.stronaGlowna}
              sciezka={[
                { nazwa: t.menu.poradniki, adres: PORADNIKI_ADRES[j] },
                { nazwa: p.krotko, adres }
              ]}
            />
          </div>
          <div className="mt-8 max-w-3xl space-y-5">
            <Link href={PORADNIKI_ADRES[j]} className={`inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] uppercase ${a.etykieta} hover:underline`}>
              <IkonaPoradnika ikona={p.oryginal.ikona} className="w-4 h-4" /> {t.menu.poradniki}
            </Link>
            <h1 className="text-[2.1rem] sm:text-5xl font-black tracking-tight leading-[1.05] [text-wrap:balance]">{typo(p.tytul)}</h1>
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed [text-wrap:pretty]">{typo(p.opis)}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white text-slate-900 text-[10px] font-black flex items-center justify-center" aria-hidden="true">
                  MS
                </span>
                {site.author} · {site.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4" aria-hidden="true" /> {t.poradnik.aktualizacja}: <time dateTime={p.aktualizacja}>{data}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" /> {t.poradnik.minut(minuty(p))}
              </span>
              <Link href={adresPl} hrefLang="pl" className="inline-flex items-center gap-1.5 underline">
                <Languages className="w-4 h-4" aria-hidden="true" /> {t.poradnik.wersjaPolska}
              </Link>
            </div>
          </div>
          {p.liczby && (
            <dl className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
              {p.liczby.map((l) => (
                <div key={l.w + l.o} className="rounded-2xl bg-white/[0.07] ring-1 ring-white/15 backdrop-blur px-5 py-4 flex flex-col-reverse">
                  <dt className="text-sm text-white/70 leading-snug">{l.o}</dt>
                  <dd className="text-3xl font-black tracking-tight">{l.w}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_16rem] gap-12 pt-10">
          <article id="artykul" className="min-w-0 space-y-12">
            <section aria-labelledby="w-skrocie" className={`rounded-3xl ring-1 p-6 sm:p-7 ${a.skrot}`}>
              <h2 id="w-skrocie" className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
                <BookOpenCheck className={`w-5 h-5 ${a.ikona}`} aria-hidden="true" /> {t.poradnik.wSkrocie}
              </h2>
              <ul className="mt-4 space-y-3">
                {p.skrot.map((s) => (
                  <li key={s} className="flex gap-3 text-[1.05rem] leading-7 text-slate-800 dark:text-slate-100">
                    <CircleCheck className={`w-5 h-5 mt-1 flex-shrink-0 ${a.ikona}`} aria-hidden="true" />
                    <span>{typo(s)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <nav aria-label={t.poradnik.spis} className="lg:hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{t.poradnik.spis}</h2>
              <ol className="mt-3 space-y-1.5 text-[0.95rem]">
                {spis.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-slate-700 dark:text-slate-200 hover:underline">
                      {s.t}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[68ch] space-y-14 text-[1.075rem] leading-8 text-slate-700 dark:text-slate-300">
              {p.sekcje.map((s, n) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 space-y-5">
                  <div>
                    <div className={`text-xs font-black tabular-nums tracking-[0.2em] ${a.ikona}`}>{String(n + 1).padStart(2, '0')}</div>
                    <h2 className="mt-1 text-2xl sm:text-[1.9rem] font-black tracking-tight leading-tight text-slate-900 dark:text-white [text-wrap:balance]">{typo(s.t)}</h2>
                  </div>
                  <BlokiPoradnika
                    bloki={s.bloki}
                    kat={p.oryginal.kategoria}
                    typo={typo}
                    etykiety={{ uwaga: t.poradnik.uwaga, dobrzeWiedziec: t.poradnik.dobrzeWiedziec }}
                    link={(href) => {
                      const l = lokalnyLink(href, j);
                      return { href: l.href, dopisek: l.poPolsku ? t.poradnik.poPolsku : undefined };
                    }}
                  />
                </section>
              ))}
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <nav aria-label={t.poradnik.spis} className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{t.poradnik.spis}</h2>
                <ol className="mt-3 space-y-2 text-sm">
                  {spis.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-slate-700 dark:text-slate-300 hover:underline">
                        {s.t}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              {pokazVin && (
                <Link href="/sprawdz-vin/" hrefLang="pl" className="group block rounded-2xl bg-slate-950 text-white p-4 hover:bg-slate-900">
                  <ScanLine className="w-6 h-6 text-emerald-400" aria-hidden="true" />
                  <div className="mt-2 font-extrabold">{t.glowna.vinTytul}</div>
                  <div className="text-sm text-white/70">{t.glowna.vinOpis}</div>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-300">
                    {t.glowna.poPolskuNarzedzie} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              )}
            </div>
          </aside>
        </div>

        <div className="space-y-14 pt-14">
          {p.oryginal.generator && (
            <section id="wzor" className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 sm:p-8 max-w-3xl space-y-3">
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                <Printer className={`w-5 h-5 ${a.ikona}`} aria-hidden="true" /> {t.poradnik.wzorTytul}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">{typo(t.poradnik.wzorTekst)}</p>
              <Link href={`${adresPl}#generator`} hrefLang="pl" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-sm font-extrabold">
                {t.poradnik.wzorPrzycisk} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>
          )}

          {p.faq && p.faq.length > 0 && (
            <section id="pytania" className="scroll-mt-24 max-w-3xl space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t.poradnik.pytania}</h2>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                {p.faq.map((f) => (
                  <details key={f.q} className="group px-5 sm:px-6">
                    <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">{f.q}</span>
                      <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{typo(f.a)}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {nastepny.slug !== p.slug && (
            <section aria-label={t.poradnik.czytajDalej} className="space-y-4">
              <Link href={adresPoradnika(j, nastepny.slug)} className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${AKCENT[nastepny.oryginal.kategoria].tlo} text-white p-7 sm:p-9`}>
                <div className="absolute -right-8 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                  <IkonaPoradnika ikona={nastepny.oryginal.ikona} className="w-56 h-56" />
                </div>
                <div className="relative max-w-2xl">
                  <div className={`text-[11px] font-black tracking-[0.22em] uppercase ${AKCENT[nastepny.oryginal.kategoria].etykieta}`}>
                    {t.poradnik.czytajDalej} · {t.poradnik.minut(minuty(nastepny))}
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight leading-tight">{typo(nastepny.tytul)}</div>
                  <p className="mt-2 text-white/70">{nastepny.opis}</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-extrabold">
                    {t.poradnik.czytaj} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </Link>
              {powiazane.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {powiazane.map((r) => (
                    <li key={r.slug}>
                      <Link href={adresPoradnika(j, r.slug)} className="group h-full flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 hover:ring-slate-400">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 ${AKCENT[r.oryginal.kategoria].ikona}`}>
                          <IkonaPoradnika ikona={r.oryginal.ikona} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-bold text-slate-900 dark:text-white text-sm leading-snug">{r.krotko}</span>
                          <span className="block text-xs text-slate-500">{t.poradnik.minut(minuty(r))}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="md:col-span-3 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 space-y-3">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">{t.poradnik.zrodla}</h2>
              <p className="text-slate-500">{t.poradnik.zrodlaPoPolsku}</p>
              <ol className="space-y-2 list-decimal pl-5 marker:text-slate-400" lang="pl">
                {p.oryginal.zrodla.map((z) => (
                  <li key={z.url}>
                    <a href={z.url} target="_blank" rel="noopener noreferrer" className="text-sky-700 dark:text-sky-300 hover:underline">
                      {z.n}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-2 rounded-3xl bg-slate-100 dark:bg-slate-900/60 p-6 space-y-2 text-slate-600 dark:text-slate-400">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">{t.poradnik.jakPowstal}</h2>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">{site.author}</strong> · {site.name}
              </p>
              <p>{t.poradnik.jakPowstalTekst}</p>
              <p className="text-xs">{t.poradnik.zastrzezenie}</p>
            </div>
          </section>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
