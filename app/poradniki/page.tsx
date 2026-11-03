import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone, Printer, Clock } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import ZdjecieTla from '@/components/ZdjecieTla';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import { KATEGORIE, poradnikiKategorii, STAN_PORADNIKOW, PORADNIKI, czasCzytania, type KategoriaPoradnika } from '@/lib/poradniki';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Poradniki kierowcy: kupno auta, kolizja, OC',
  description:
    'Darmowe wzory do druku (umowa kupna-sprzedaży, oświadczenie sprawcy, wypowiedzenie OC) i poradniki: formalności po zakupie auta, kolizja, awaria, foteliki.',
  alternates: { canonical: '/poradniki/' },
  openGraph: { type: 'website', url: '/poradniki/', title: 'Poradniki kierowcy – formalności i bezpieczeństwo', description: 'Wzory do druku i proste poradniki: kupno i sprzedaż auta, kolizja, bezpieczna jazda.' }
};

const KOLORY: Record<KategoriaPoradnika, { akcent: string; tlo: string }> = {
  kupno: { akcent: 'text-sky-600 dark:text-sky-400', tlo: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' },
  kolizja: { akcent: 'text-rust-600 dark:text-rust-400', tlo: 'bg-rust-50 dark:bg-rust-900/40 text-rust-700 dark:text-rust-300' },
  bezpieczenstwo: { akcent: 'text-emerald-700 dark:text-emerald-400', tlo: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' }
};

export default function PoradnikiPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      <Okruszki sciezka={[{ nazwa: 'Poradniki', adres: '/poradniki/' }]} />

      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white">
        <ZdjecieTla klucz="kupujesz" priorytet className="opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-rust-900/50" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-5 gap-8 px-6 py-10 sm:px-10 sm:py-14">
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-rust-300">Poradniki kierowcy</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02]">
              Formalności
              <br />
              <span className="bg-gradient-to-r from-rust-300 to-white bg-clip-text text-transparent">bez zgadywania.</span>
            </h1>
            <p className="text-white/75 max-w-xl">Terminy, kary i dokumenty przy kupnie, sprzedaży i kolizji oraz zasady bezpiecznej jazdy – sprawdzone w przepisach i źródłach podanych pod każdym poradnikiem. Stan na {STAN_PORADNIKOW}.</p>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-3 justify-end">
            <Link href="/poradniki/kolizja-bez-policji/" className="group flex items-center gap-4 rounded-2xl bg-white text-slate-900 p-4 hover:bg-rust-50">
              <span className="w-11 h-11 rounded-xl bg-rust-600 text-white flex items-center justify-center flex-shrink-0">
                <IkonaPoradnika ikona="kolizja" />
              </span>
              <span className="flex-1">
                <span className="block font-extrabold">Miałeś stłuczkę?</span>
                <span className="block text-sm text-slate-600">Co zrobić i oświadczenie do wydruku</span>
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <a href="tel:112" className="flex items-center gap-4 rounded-2xl bg-white/10 ring-1 ring-white/20 p-4 hover:bg-white/15">
              <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-extrabold">Ktoś jest ranny? Dzwoń 112</span>
                <span className="block text-sm text-white/70">Policja, pogotowie, straż – jeden numer</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <nav aria-label="Działy poradników" className="flex flex-wrap gap-2 -mt-4">
        {(Object.keys(KATEGORIE) as KategoriaPoradnika[]).map((k) => (
          <a key={k} href={`#${k}`} className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400 px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            {KATEGORIE[k].nazwa}
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 text-xs text-slate-500">{poradnikiKategorii(k).length}</span>
          </a>
        ))}
      </nav>

      {(Object.keys(KATEGORIE) as KategoriaPoradnika[]).map((k) => (
        <section key={k} id={k} className="space-y-4 scroll-mt-24">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{KATEGORIE[k].nazwa}</h2>
            <p className="text-slate-500">{KATEGORIE[k].opis}</p>
          </div>
          <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${poradnikiKategorii(k).length === 5 ? 'lg:grid-cols-3 xl:grid-cols-5' : 'lg:grid-cols-4'}`}>
            {poradnikiKategorii(k).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/poradniki/${p.slug}/`}
                  className="group h-full flex flex-col gap-4 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400 dark:hover:ring-slate-600 p-5 transition shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${KOLORY[k].tlo}`}>
                      <IkonaPoradnika ikona={p.ikona} />
                    </span>
                    {p.generator && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-1">
                        <Printer className="w-3 h-3" aria-hidden="true" /> wzór
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">{p.krotko}</h3>
                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {czasCzytania(p)} min czytania
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{p.opis}</p>
                  </div>
                  {p.liczby && (
                    <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                      {p.liczby.slice(0, 2).map((l) => (
                        <div key={l.w} className="min-w-0">
                          <div className={`text-lg font-black ${KOLORY[k].akcent}`}>{l.w}</div>
                          <div className="text-[11px] leading-tight text-slate-500">{l.o}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-slate-500 max-w-3xl">
        Poradniki mają charakter informacyjny i nie są poradą prawną. Opisują typowe sytuacje według przepisów obowiązujących w dniu aktualizacji ({STAN_PORADNIKOW}). W nietypowej sprawie zapytaj w urzędzie, u ubezpieczyciela albo u prawnika.
      </p>
      <KodStrony sciezka="/poradniki/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: bezpiecznyJson({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Poradniki kierowcy',
            url: `${site.url}/poradniki/`,
            inLanguage: 'pl-PL',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: PORADNIKI.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/poradniki/${p.slug}/`, name: p.tytul }))
            }
          })
        }}
      />
    </div>
  );
}
