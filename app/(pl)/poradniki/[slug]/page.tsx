import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BellRing, ScanLine, ShieldCheck, ExternalLink, Clock, CalendarCheck, CircleCheck, Plus, BookOpenCheck, Printer } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import BlokiPoradnika from '@/components/BlokiPoradnika';
import { AKCENT } from '@/lib/poradniki-wyglad';
import { hreflang } from '@/lib/tlumaczenia';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import GeneratorDokumentu from '@/components/GeneratorDokumentu';
import BoksNiezbednika from '@/components/sklep/BoksNiezbednika';
import BoksPoSzkodzie, { PORADNIKI_SZKODY } from '@/components/szkoda/BoksPoSzkodzie';
import LinkPartnerski from '@/components/LinkPartnerski';
import { PostepCzytania, SpisTresci, SpisTresciMobilny, Udostepnij } from '@/components/Czytanie';
import {
  PORADNIKI,
  poradnik,
  KATEGORIE,
  STAN_PORADNIKOW,
  dataPublikacji,
  dataAktualizacji,
  seoPoradnika,
  czasCzytania,
  nastepnyPoradnik,
  typo
} from '@/lib/poradniki';
import { pokazModul, linkUbezpieczenia } from '@/lib/panel';
import { BoksVin } from '@/components/Monetyzacja';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return PORADNIKI.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = poradnik(slug);
  if (!p) return {};
  const seo = seoPoradnika(p);
  const adres = `/poradniki/${p.slug}/`;
  return {
    title: seo.tytul,
    description: seo.opis,
    alternates: { canonical: adres, languages: hreflang(adres) },
    openGraph: {
      type: 'article',
      url: adres,
      title: seo.tytul,
      description: seo.opis,
      siteName: site.name,
      locale: 'pl_PL',
      publishedTime: dataPublikacji(p),
      modifiedTime: dataAktualizacji(p),
      section: KATEGORIE[p.kategoria].nazwa
    },
    twitter: { card: 'summary_large_image', title: seo.tytul, description: seo.opis }
  };
}

function dataPl(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PoradnikPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = poradnik(slug);
  if (!p) notFound();
  const kat = KATEGORIE[p.kategoria];
  const a = AKCENT[p.kategoria];
  const seo = seoPoradnika(p);
  const minuty = czasCzytania(p);
  const nastepny = nastepnyPoradnik(p);
  const K = { slug: `poradnik-${p.slug}`, marka: '', model: '' };
  const oc = pokazModul('ubezpieczenia', K) ? linkUbezpieczenia('oc', K) : '';
  const pokazVin = (p.kategoria === 'kupno' || p.kategoria === 'sprawdzenie') && pokazModul('vin', K);
  const powiazane = (p.powiazane || [])
    .map(poradnik)
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .filter((x) => x.slug !== nastepny.slug);
  const spis = [...p.sekcje.map((s) => ({ id: s.id, t: s.t })), ...(p.generator ? [{ id: 'generator', t: 'Wzór do wydruku' }] : []), ...(p.faq?.length ? [{ id: 'pytania', t: 'Najczęstsze pytania' }] : [])];
  const adres = `${site.url}/poradniki/${p.slug}/`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: p.tytul,
      description: seo.opis,
      inLanguage: 'pl-PL',
      datePublished: dataPublikacji(p),
      dateModified: dataAktualizacji(p),
      articleSection: kat.nazwa,
      mainEntityOfPage: { '@type': 'WebPage', '@id': adres },
      image: `${adres}opengraph-image`,
      author: { '@type': 'Person', name: site.author, url: site.youtubeChannelUrl, description: site.authorBio },
      publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/apple-icon.png` } },
      citation: p.zrodla.map((z) => z.url)
    },
    ...(p.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
          }
        ]
      : [])
  ];

  return (
    <div className="pb-12">
      <PostepCzytania />

      {/* ───── Nagłówek ───── */}
      <header className={`relative overflow-hidden bg-gradient-to-br ${a.tlo} text-white`}>
        <div className="absolute -right-16 -bottom-20 opacity-[0.06]" aria-hidden="true">
          <IkonaPoradnika ikona={p.ikona} className="w-[26rem] h-[26rem]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-6 pb-10 sm:pb-14">
          <div className="[&_a]:text-white/60 [&_span]:text-white/60 [&_a:hover]:text-white">
            <Okruszki
              sciezka={[
                { nazwa: 'Poradniki', adres: '/poradniki/' },
                { nazwa: p.krotko, adres: `/poradniki/${p.slug}/` }
              ]}
            />
          </div>
          <div className="mt-8 max-w-3xl space-y-5">
            <Link href="/poradniki/" className={`inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] uppercase ${a.etykieta} hover:underline`}>
              <IkonaPoradnika ikona={p.ikona} className="w-4 h-4" /> {kat.nazwa}
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
                <CalendarCheck className="w-4 h-4" aria-hidden="true" /> Aktualizacja: <time dateTime={dataAktualizacji(p)}>{dataPl(dataAktualizacji(p))}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" /> {minuty} min czytania
              </span>
              <Udostepnij tytul={seo.tytul} />
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
          {/* ───── Treść ───── */}
          <article id="artykul" className="min-w-0 space-y-12">
            {seo.skrot.length > 0 && (
              <section aria-labelledby="w-skrocie" className={`rounded-3xl ring-1 p-6 sm:p-7 ${a.skrot}`}>
                <h2 id="w-skrocie" className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
                  <BookOpenCheck className={`w-5 h-5 ${a.ikona}`} aria-hidden="true" /> W skrócie
                </h2>
                <ul className="mt-4 space-y-3">
                  {seo.skrot.map((s) => (
                    <li key={s} className="flex gap-3 text-[1.05rem] leading-7 text-slate-800 dark:text-slate-100">
                      <CircleCheck className={`w-5 h-5 mt-1 flex-shrink-0 ${a.ikona}`} aria-hidden="true" />
                      <span>{typo(s)}</span>
                    </li>
                  ))}
                </ul>
                {p.generator && (
                  <a href="#generator" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-sm font-extrabold hover:opacity-90">
                    <Printer className="w-4 h-4" aria-hidden="true" /> Przejdź do wzoru do wydruku
                  </a>
                )}
              </section>
            )}

            <SpisTresciMobilny pozycje={spis} />

            {/* Pole VIN w poradnikach o kupnie i sprawdzaniu auta – czytelnik jest tu najbliżej decyzji */}
            {pokazVin && <BoksVin k={K} />}

            <div className="max-w-[68ch] space-y-14 text-[1.075rem] leading-8 text-slate-700 dark:text-slate-300">
              {p.sekcje.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 space-y-5">
                  <div>
                    <div className={`text-xs font-black tabular-nums tracking-[0.2em] ${a.ikona}`}>{String(i + 1).padStart(2, '0')}</div>
                    <h2 className="mt-1 text-2xl sm:text-[1.9rem] font-black tracking-tight leading-tight text-slate-900 dark:text-white [text-wrap:balance]">{typo(s.t)}</h2>
                  </div>
                  <BlokiPoradnika
                    bloki={s.bloki}
                    kat={p.kategoria}
                    typo={typo}
                    etykiety={{ uwaga: 'Uwaga', dobrzeWiedziec: 'Dobrze wiedzieć' }}
                    link={(href) => {
                      // link do poradnika, który jeszcze nie jest opublikowany – nie pokazujemy (uniknięcie błędu 404)
                      const m = href.match(/^\/poradniki\/([^/]+)\/?/);
                      return m && !poradnik(m[1]) ? null : { href };
                    }}
                  />
                </section>
              ))}
            </div>
          </article>

          {/* ───── Pasek boczny ───── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <SpisTresci pozycje={spis} />
              {(p.kategoria === 'kupno' || p.kategoria === 'sprawdzenie') && (
                <Link href="/sprawdz-vin/" className="group block rounded-2xl bg-slate-950 text-white p-4 hover:bg-slate-900">
                  <ScanLine className="w-6 h-6 text-emerald-400" aria-hidden="true" />
                  <div className="mt-2 font-extrabold">Sprawdź auto po VIN</div>
                  <div className="text-sm text-white/70">Przebieg, szkody i historia – zanim podpiszesz umowę.</div>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-300">
                    Sprawdź <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              )}
              <Link href="/przypomnienia/" className="group block rounded-2xl bg-steel-700 text-white p-4 hover:bg-steel-800">
                <BellRing className="w-6 h-6 text-rust-300" aria-hidden="true" />
                <div className="mt-2 font-extrabold">Przypomnienie o końcu OC</div>
                <div className="text-sm text-white/75">E-mail 3 tygodnie przed końcem polisy i przeglądu. Za darmo.</div>
              </Link>
              {oc && (
                <LinkPartnerski href={oc} modul="ubezpieczenia" partner="oc" karta={`poradnik-${p.slug}`} className="group block rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4 hover:ring-slate-400">
                  <ShieldCheck className="w-6 h-6 text-sky-600" aria-hidden="true" />
                  <div className="mt-2 font-extrabold text-slate-900 dark:text-white">Porównaj ceny OC</div>
                  <div className="text-sm text-slate-500">
                    Kalkulator partnera <ExternalLink className="inline w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">link partnerski</div>
                </LinkPartnerski>
              )}
            </div>
          </aside>
        </div>

        <div className="space-y-14 pt-14">
          {p.generator && <GeneratorDokumentu rodzaj={p.generator} />}
          {p.generator === 'umowa' && <BoksNiezbednika miejsce="umowa" />}
          {PORADNIKI_SZKODY.includes(p.slug) && <BoksPoSzkodzie />}

          {/* Na telefonie porównanie OC i przypomnienie pokazujemy pod treścią */}
          {oc && (
            <LinkPartnerski href={oc} modul="ubezpieczenia" partner="oc" karta={`poradnik-${p.slug}-mobile`} className="lg:hidden flex items-center gap-4 rounded-2xl bg-sky-700 text-white p-5">
              <ShieldCheck className="w-7 h-7 text-sky-100 flex-shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-extrabold">Porównaj ceny OC i AC</span>
                <span className="block text-sm text-white/75">Kalkulator partnera – link partnerski</span>
              </span>
              <ExternalLink className="w-5 h-5" aria-hidden="true" />
            </LinkPartnerski>
          )}
          <Link href="/przypomnienia/" className="lg:hidden flex items-center gap-4 rounded-2xl bg-steel-700 text-white p-5">
            <BellRing className="w-7 h-7 text-rust-300 flex-shrink-0" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-extrabold">Przypomnienie o końcu OC</span>
              <span className="block text-sm text-white/75">E-mail 3 tygodnie przed terminem. Za darmo.</span>
            </span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>

          {p.faq && p.faq.length > 0 && (
            <section id="pytania" className="scroll-mt-24 max-w-3xl space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Najczęstsze pytania</h2>
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

          {/* Następny poradnik – zachęta do dalszego czytania */}
          <section aria-label="Następny poradnik" className="space-y-4">
            <Link href={`/poradniki/${nastepny.slug}/`} className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${AKCENT[nastepny.kategoria].tlo} text-white p-7 sm:p-9`}>
              <div className="absolute -right-8 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                <IkonaPoradnika ikona={nastepny.ikona} className="w-56 h-56" />
              </div>
              <div className="relative max-w-2xl">
                <div className={`text-[11px] font-black tracking-[0.22em] uppercase ${AKCENT[nastepny.kategoria].etykieta}`}>Czytaj dalej · {czasCzytania(nastepny)} min</div>
                <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight leading-tight">{typo(nastepny.tytul)}</div>
                <p className="mt-2 text-white/70">{nastepny.opis}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-extrabold">
                  Czytaj <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </Link>
            {powiazane.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {powiazane.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/poradniki/${r.slug}/`} className="group h-full flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 hover:ring-slate-400">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 ${AKCENT[r.kategoria].ikona}`}>
                        <IkonaPoradnika ikona={r.ikona} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-slate-900 dark:text-white text-sm leading-snug">{r.krotko}</span>
                        <span className="block text-xs text-slate-500">{czasCzytania(r)} min czytania</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Źródła i sposób przygotowania – wiarygodność (ważne też dla Google) */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="md:col-span-3 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 space-y-3">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">Źródła</h2>
              <ol className="space-y-2 list-decimal pl-5 marker:text-slate-400">
                {p.zrodla.map((z) => (
                  <li key={z.url}>
                    <a href={z.url} target="_blank" rel="noopener noreferrer" className="text-sky-700 dark:text-sky-300 hover:underline">
                      {z.n}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-2 rounded-3xl bg-slate-100 dark:bg-slate-900/60 p-6 space-y-2 text-slate-600 dark:text-slate-400">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">Jak powstał ten poradnik</h2>
              <p>
                Opracował <strong className="text-slate-800 dark:text-slate-200">{site.author}</strong> – {site.authorBio.charAt(0).toLowerCase() + site.authorBio.slice(1)}
              </p>
              <p>
                Poradnik powstał na podstawie przepisów i źródeł obok – własnymi słowami, z myślą o kierowcach, a nie prawnikach. Stan prawny: {STAN_PORADNIKOW}.
              </p>
              <p className="text-xs">To informacja, nie porada prawna. W nietypowej sprawie zapytaj w urzędzie, u ubezpieczyciela albo u prawnika.</p>
            </div>
          </section>
        </div>

        <KodStrony sciezka={`/poradniki/${p.slug}/`} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
