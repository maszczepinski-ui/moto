// Przetłumaczone narzędzia: mandaty (/uk/shtrafy/, /en/traffic-fines/), sprawdzanie VIN i porównanie OC.
// Linki partnerskie są te same co w wersji polskiej (zgodnie z umowami partnerów), zmienia się tylko kanał (sub2).
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Camera, CheckCircle2, ExternalLink, FileSearch, FileText, ScanLine, Car, ShieldCheck, TriangleAlert, CalendarClock, Globe, Plus } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import VinWidget from '@/components/VinWidget';
import LinkPartnerski from '@/components/LinkPartnerski';
import { KalkulatorPredkosci, KalkulatorPunktow } from '@/components/KalkulatorMandatu';
import { TabelaPredkosci, TabelaWykroczen, ZrodlaMandatow } from '@/components/TabelaMandatow';
import { linkUbezpieczenia, linkVin, linkVinOgolny, panelDane, pokazModul } from '@/lib/panel';
import { META, SLOWNIK, type JezykObcy } from '@/lib/jezyki';
import { adresPoradnika, hreflang, poradnikiObce } from '@/lib/tlumaczenia';
import { ADRESY_NARZEDZI, NARZEDZIA } from '@/lib/tlumaczenia/narzedzia';
import { typoObce } from '@/lib/typografia';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

type Narzedzie = keyof typeof ADRESY_NARZEDZI;

export function metadaneNarzedzia(j: JezykObcy, n: Narzedzie): Metadata {
  const t = NARZEDZIA[j][n];
  const adres = ADRESY_NARZEDZI[n][j];
  return {
    title: t.seoTytul,
    description: t.seoOpis,
    alternates: { canonical: adres, languages: hreflang(adres) },
    openGraph: { url: adres, title: t.seoTytul, description: t.seoOpis, locale: META[j].locale, siteName: site.name, type: 'website' }
  };
}

function FaqLista({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
      {faq.map((f) => (
        <details key={f.q} className="group px-5 sm:px-6">
          <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
            <span className="flex-1">{f.q}</span>
            <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

const faqLd = (j: JezykObcy, faq: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: META[j].data,
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
});

/** Link do przetłumaczonego poradnika (gdy istnieje) */
function LinkPoradnika({ j, pl, tekst }: { j: JezykObcy; pl: string; tekst: string }) {
  const p = poradnikiObce(j).find((x) => x.pl === pl);
  if (!p) return null;
  return (
    <Link href={adresPoradnika(j, p.slug)} className="flex items-center justify-between gap-3 bg-rust-600 hover:bg-rust-700 text-white rounded-2xl p-5 font-bold">
      <span>{tekst}</span>
      <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
    </Link>
  );
}

export function MandatyObce({ j }: { j: JezykObcy }) {
  const t = NARZEDZIA[j].mandaty;
  const s = SLOWNIK[j];
  const typo = typoObce(j);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki start={{ nazwa: s.stronaGlowna, adres: `/${j}/` }} etykieta={s.stronaGlowna} sciezka={[{ nazwa: t.nazwa, adres: ADRESY_NARZEDZI.mandaty[j] }]} />
      <NaglowekDzialu zdjecie="mandaty" nadtytul={t.nadtytul} tytul={t.tytul} opis={typo(t.opis)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <KalkulatorPredkosci j={j} />
        <KalkulatorPunktow j={j} />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Globe className="w-6 h-6 text-sky-600" aria-hidden="true" /> {t.obcokrajowcyTytul}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.obcokrajowcy.map((o) => (
            <div key={o.t} className="rounded-3xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-200 dark:ring-sky-900 p-6">
              <h3 className="font-extrabold text-slate-900 dark:text-white">{o.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{typo(o.o)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.tabelaPredkosc}</h2>
        <TabelaPredkosci j={j} />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.tabelaInne}</h2>
        <TabelaWykroczen j={j} />
      </section>

      <Link href="/fotoradary/" hrefLang="pl" className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-5">
        <Camera className="w-8 h-8 text-rust-400 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-bold text-lg">
            {t.fotoradary} <span className="text-[10px] font-bold text-white/50">PL</span>
          </span>
          <span className="block text-sm text-slate-300">{t.fotoradaryOpis}</span>
        </span>
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </Link>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.pytania}</h2>
        <FaqLista faq={t.faq} />
      </section>
      <ZrodlaMandatow j={j} />
      <p className="text-xs text-slate-500">
        <a href="https://dlajurysty.pl/prawo/art/98postepowanie-wykroczenia" target="_blank" rel="noopener noreferrer" className="underline" lang="pl">
          Art. 98 KPW
        </a>
        {' · '}
        <a href="https://motoryzacja.interia.pl/porady/przepisy-drogowe/news-czy-obcokrajowcy-w-polsce-moga-stracic-prawo-jazdy-za-punkty,nId,6313638" target="_blank" rel="noopener noreferrer" className="underline" lang="pl">
          Interia – KGP
        </a>
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(faqLd(j, t.faq)) }} />
    </div>
  );
}

export function VinObcy({ j }: { j: JezykObcy }) {
  const t = NARZEDZIA[j].vin;
  const s = SLOWNIK[j];
  const typo = typoObce(j);
  const K = { slug: `${j}-sprawdz-vin`, marka: '', model: '' };
  const v = panelDane.moduly?.vin;
  const pokaz = pokazModul('vin', K);
  const ikony = [FileText, ScanLine, Car];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-4">
        <Okruszki start={{ nazwa: s.stronaGlowna, adres: `/${j}/` }} etykieta={s.stronaGlowna} sciezka={[{ nazwa: t.nazwa, adres: ADRESY_NARZEDZI.vin[j] }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{t.tytul}</h1>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{typo(t.wstep)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {pokaz && (
          <div id="narzedzie-vin" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-br from-steel-700 to-steel-900 text-white rounded-2xl p-6 flex flex-col gap-3 shadow-lg">
            <FileSearch className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5" aria-hidden="true" />
            <span className="self-start text-[11px] font-bold uppercase tracking-wider bg-white/15 rounded-full px-2.5 py-1">{t.boksEtykieta}</span>
            <h2 className="flex items-start gap-2 text-xl sm:text-2xl font-extrabold">
              <FileSearch className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" /> {t.boksTytul}
            </h2>
            <p className="text-sm text-steel-50">{t.boksOpis}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {t.raport.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-300" aria-hidden="true" /> {x}
                </li>
              ))}
            </ul>
            <p className="text-xs text-steel-100">{t.gdzieKrotko}</p>
            <VinWidget szablon={linkVin(K)} ogolny={linkVinOgolny(K)} partner={v?.partner || 'vin'} karta={K.slug} przycisk={t.przycisk} kod={v?.kod || ''} rabat={v?.rabat || ''} t={t.widget} />
            <span className="text-[11px] text-steel-100">{t.linkPartnerski}</span>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">{t.darmoEtykieta}</span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t.darmoTytul}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{typo(t.darmoOpis)}</p>
          <a href="https://historiapojazdu.gov.pl/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-steel-700 dark:text-steel-300 underline">
            {t.darmoLink} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.gdzieTytul}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {t.gdzie.map(({ t: tytul, o }, i) => {
            const Ikona = ikony[i];
            return (
              <li key={tytul} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <Ikona className="w-6 h-6 text-steel-600 mb-2" aria-hidden="true" />
                <h3 className="font-bold text-slate-900 dark:text-white">{tytul}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{o}</p>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400">{typo(t.gdzieUwaga)}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.raportTytul}</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
          {t.raportLista.map((x) => (
            <li key={x}>{typo(x)}</li>
          ))}
        </ul>
      </section>

      <LinkPoradnika j={j} pl="kupilem-auto-co-dalej" tekst={t.poradnik} />
    </div>
  );
}

export function OcObce({ j }: { j: JezykObcy }) {
  const t = NARZEDZIA[j].oc;
  const s = SLOWNIK[j];
  const typo = typoObce(j);
  const K = { slug: `${j}-ubezpieczenie-oc`, marka: '', model: '' };
  const wl = pokazModul('ubezpieczenia', K);
  const oc = wl ? linkUbezpieczenia('oc', K) : '';
  const ac = wl ? linkUbezpieczenia('ac', K) : '';
  const partner = panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia';
  const ikony = [FileText, CalendarClock, CheckCircle2];
  return (
    <div className="pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <Okruszki start={{ nazwa: s.stronaGlowna, adres: `/${j}/` }} etykieta={s.stronaGlowna} sciezka={[{ nazwa: t.nazwa, adres: ADRESY_NARZEDZI.oc[j] }]} />
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-slate-900 text-white p-7 sm:p-10">
          <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" aria-hidden="true" />
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/15 rounded-full px-2.5 py-1">{t.etykieta}</span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl [text-wrap:balance]">{t.tytul}</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">{typo(t.wstep)}</p>
          {oc && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LinkPartnerski href={oc} modul="ubezpieczenia" partner={partner} karta={`${j}-ubezpieczenie-oc-gora`} className="inline-flex items-center gap-2 font-extrabold px-6 py-3.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50">
                {t.przyciskOc} <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </LinkPartnerski>
              {ac && (
                <LinkPartnerski href={ac} modul="ubezpieczenia" partner={partner} karta={`${j}-ubezpieczenie-ac-gora`} className="inline-flex items-center gap-2 font-bold px-5 py-3.5 rounded-xl ring-1 ring-white/40 hover:bg-white/10">
                  {t.przyciskAc} <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </LinkPartnerski>
              )}
              <span className="text-[11px] text-white/60 w-full">{t.partnerski}</span>
            </div>
          )}
        </section>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-14 pt-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.karty.map(({ t: tytul, o }, i) => {
            const I = ikony[i];
            return (
              <div key={tytul} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                <I className="w-7 h-7 text-sky-600" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">{tytul}</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{typo(o)}</p>
              </div>
            );
          })}
        </section>

        <p className="rounded-2xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-200 dark:ring-sky-900 p-5 text-slate-800 dark:text-slate-200">{typo(t.pesel)}</p>

        <section className="flex gap-4 rounded-3xl bg-amber-50 text-amber-950 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900 p-6">
          <TriangleAlert className="w-7 h-7 flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-extrabold text-lg">{t.brakTytul}</h2>
            <p className="mt-1">{typo(t.brakTekst)}</p>
          </div>
        </section>

        <LinkPoradnika j={j} pl="ile-kosztuje-oc" tekst={t.poradnik} />

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t.pytania}</h2>
          <FaqLista faq={t.faq} />
        </section>

        {oc && (
          <section className="rounded-3xl bg-slate-950 text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h2 className="text-2xl font-black">{t.dolTytul}</h2>
              <p className="text-white/70">{t.dolOpis}</p>
            </div>
            <LinkPartnerski href={oc} modul="ubezpieczenia" partner={partner} karta={`${j}-ubezpieczenie-oc-dol`} className="inline-flex items-center gap-2 font-extrabold px-6 py-3.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50">
              {t.przyciskOc} <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          </section>
        )}

        <p className="text-xs text-slate-500">{t.zastrzezenie}</p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(faqLd(j, t.faq)) }} />
    </div>
  );
}
