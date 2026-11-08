// Strona główna i lista poradników w wersjach /uk/ i /en/.
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ScanLine, ShieldCheck } from 'lucide-react';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import Okruszki from '@/components/Okruszki';
import { AKCENT } from '@/lib/poradniki-wyglad';
import { czasCzytania } from '@/lib/poradniki';
import { META, PORADNIKI_ADRES, SLOWNIK, type JezykObcy } from '@/lib/jezyki';
import { adresPoradnika, hreflang, poradnikiObce, type PoradnikObcy } from '@/lib/tlumaczenia';
import { typoObce } from '@/lib/typografia';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

export function metadaneGlownej(j: JezykObcy): Metadata {
  const t = SLOWNIK[j].glowna;
  const adres = `/${j}/`;
  return {
    title: { absolute: `${t.seoTytul} | ${site.name}` },
    description: t.seoOpis,
    alternates: { canonical: adres, languages: hreflang(adres) },
    openGraph: { url: adres, title: t.seoTytul, description: t.seoOpis, locale: META[j].locale, siteName: site.name, type: 'website' }
  };
}

export function metadaneListy(j: JezykObcy): Metadata {
  const t = SLOWNIK[j].lista;
  const adres = PORADNIKI_ADRES[j];
  return {
    title: t.seoTytul,
    description: t.seoOpis,
    alternates: { canonical: adres, languages: hreflang(adres) },
    openGraph: { url: adres, title: t.seoTytul, description: t.seoOpis, locale: META[j].locale, siteName: site.name, type: 'website' }
  };
}

function Kafelek({ j, p }: { j: JezykObcy; p: PoradnikObcy }) {
  const t = SLOWNIK[j];
  const typo = typoObce(j);
  const a = AKCENT[p.oryginal.kategoria];
  return (
    <Link
      href={adresPoradnika(j, p.slug)}
      className="group h-full flex flex-col rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)] hover:ring-slate-400 transition"
    >
      <span className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${a.ikona}`}>
        <IkonaPoradnika ikona={p.oryginal.ikona} />
      </span>
      <span className="mt-4 block text-lg font-extrabold leading-snug text-slate-900 dark:text-white [text-wrap:balance]">{typo(p.tytul)}</span>
      <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400 flex-1">{typo(p.opis)}</span>
      <span className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{t.poradnik.minut(czasCzytania({ ...p.oryginal, opis: p.opis, sekcje: p.sekcje }))}</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function GlownaObca({ j }: { j: JezykObcy }) {
  const t = SLOWNIK[j];
  const g = t.glowna;
  const typo = typoObce(j);
  const lista = poradnikiObce(j);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${site.url}/${j}/`,
    inLanguage: META[j].data,
    publisher: { '@type': 'Organization', name: site.name, url: site.url }
  };
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-steel-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.02] max-w-3xl [text-wrap:balance]">
            {g.naglowek} <span className="bg-gradient-to-r from-rust-300 to-white bg-clip-text text-transparent">{g.naglowekAkcent}</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed">{typo(g.wstep)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={PORADNIKI_ADRES[j]} className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-extrabold">
              {g.wszystkie} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/" hrefLang="pl" className="inline-flex items-center gap-2 rounded-xl ring-1 ring-white/30 px-5 py-3 font-bold text-white/90 hover:bg-white/10">
              {t.menu.polski}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-14 pt-12">
        <section aria-labelledby="poradniki" className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 id="poradniki" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {g.poradnikiTytul}
            </h2>
            <Link href={PORADNIKI_ADRES[j]} className="text-sm font-bold text-steel-700 dark:text-steel-300 hover:underline whitespace-nowrap">
              {g.wszystkie} →
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lista.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Kafelek j={j} p={p} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="narzedzia" className="space-y-5">
          <div>
            <h2 id="narzedzia" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {g.narzedziaTytul}
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{g.narzedziaOpis}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/sprawdz-vin/" hrefLang="pl" className="group flex items-start gap-4 rounded-3xl bg-slate-950 text-white p-6 hover:bg-slate-900">
              <ScanLine className="w-8 h-8 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block text-lg font-extrabold">{g.vinTytul}</span>
                <span className="block text-sm text-white/70">{g.vinOpis}</span>
                <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-white/50">{g.poPolskuNarzedzie}</span>
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link href="/ubezpieczenie-oc/" hrefLang="pl" className="group flex items-start gap-4 rounded-3xl bg-sky-700 text-white p-6 hover:bg-sky-800">
              <ShieldCheck className="w-8 h-8 text-sky-100 flex-shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block text-lg font-extrabold">{g.ocTytul}</span>
                <span className="block text-sm text-white/75">{g.ocOpis}</span>
                <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-white/60">{g.poPolskuNarzedzie}</span>
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}

export function ListaObca({ j }: { j: JezykObcy }) {
  const t = SLOWNIK[j];
  const typo = typoObce(j);
  const lista = poradnikiObce(j);
  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
      <Okruszki start={{ nazwa: t.stronaGlowna, adres: `/${j}/` }} etykieta={t.stronaGlowna} sciezka={[{ nazwa: t.menu.poradniki, adres: PORADNIKI_ADRES[j] }]} />
      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">{typo(t.lista.tytul)}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{typo(t.lista.opis)}</p>
      </header>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((p) => (
          <li key={p.slug}>
            <Kafelek j={j} p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
