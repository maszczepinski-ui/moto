import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import { H2, KARTA } from '@/components/narzedzia/StronaNarzedzia';
import { DZIALY, WKROTCE } from '@/lib/akcesoria';
import { site } from '@/config/site';

const OPIS = 'Akcesoria do auta bez przepłacania: co warto mieć, na co patrzeć przy zakupie i czego unikać. Poradniki zakupowe z porównaniem cen.';

// Spis działów akcesoriów. Dopóki jest jeden dział, strona nie trafia do Google (za mało treści).
export const metadata: Metadata = {
  title: 'Akcesoria samochodowe – poradniki zakupowe',
  description: OPIS,
  alternates: { canonical: '/akcesoria/' },
  openGraph: { title: 'Akcesoria samochodowe', description: OPIS, url: `${site.url}/akcesoria/` },
  ...(DZIALY.length < 2 ? { robots: { index: false, follow: true } } : {})
};

export default function AkcesoriaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Akcesoria', adres: '/akcesoria/' }]} />
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Akcesoria samochodowe</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{OPIS}</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DZIALY.map((d) => (
          <li key={d.slug}>
            <a href={`/akcesoria/${d.slug}/`} className={`${KARTA} h-full p-6 flex flex-col gap-2 hover:ring-rust-400 transition`}>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{d.nazwa}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{d.opis}</span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1 text-sm font-bold text-rust-700 dark:text-rust-400">
                Zobacz <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <section className="space-y-3">
        <h2 className={H2}>Wkrótce</h2>
        <ul className="flex flex-wrap gap-2">
          {WKROTCE.map((w) => (
            <li key={w} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{w}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
