// Prywatny kalkulator dla kupujących Niezbędnik (logowanie kodem z maila). Ukryty przed Google.
import type { Metadata } from 'next';
import Link from 'next/link';
import Kalkulator from '@/components/sklep/Kalkulator';
import { kalkulatorAktywny } from '@/lib/sklep/kalkulator';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Kalkulator Niezbędnika – koszty startowe i negocjacje',
  robots: { index: false, follow: false },
  alternates: { canonical: '/niezbednik/kalkulator/' }
};

export default function KalkulatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {kalkulatorAktywny() ? (
        <Kalkulator />
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kalkulator Niezbędnika</h1>
          <p className="text-slate-600 dark:text-slate-300">Kalkulator jest częścią pakietu i ruszy razem ze sprzedażą.</p>
          <Link href="/niezbednik/" className="font-semibold text-steel-700 dark:text-steel-300 underline">
            Zobacz Niezbędnik
          </Link>
        </div>
      )}
    </div>
  );
}
