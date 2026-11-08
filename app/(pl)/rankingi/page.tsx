import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import ListaModeli from '@/components/ListaModeli';
import { rankingi, tlo } from '@/lib/dane';
import { formatDate } from '@/lib/format';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Rankingi aut w Polsce – najpopularniejsze, najczęściej sprowadzane, z LPG',
  description: 'Rankingi modeli aut na podstawie danych CEPiK: najpopularniejsze, najczęściej sprowadzane, najczęściej z LPG, najstarsze i najbardziej regionalne.',
  alternates: { canonical: '/rankingi/' }
};

export default function RankingiPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="flex items-center gap-2 text-4xl font-extrabold text-slate-900 dark:text-white">
          <Trophy className="w-8 h-8 text-rust-600" aria-hidden="true" /> Rankingi
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Które auta sprowadzamy najczęściej, w które montujemy LPG i które modele są typowe tylko dla jednego regionu. Wszystko na podstawie danych o zarejestrowanych autach.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rankingi.map((r) => (
          <section key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              <Link href={`/rankingi/${r.id}/`} className="hover:underline">
                {r.tytul}
              </Link>
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-3">{r.opis}</p>
            <ListaModeli pozycje={r.pozycje.slice(0, 5).map((p) => ({ slug: p.slug, adres: p.adres, nazwa: p.nazwa, wartosc: p.wartosc }))} />
            <Link href={`/rankingi/${r.id}/`} className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-steel-600 dark:text-steel-400 hover:underline">
              Cały ranking <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. W rankingach (poza „najpopularniejszymi”) bierzemy pod uwagę modele z co najmniej 10 000 zarejestrowanych egzemplarzy. Liczymy
        wszystkie generacje danego modelu razem.
      </p>
      <KodStrony sciezka={'/rankingi/'} />
    </div>
  );
}
