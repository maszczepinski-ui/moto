// Sprawdzacz kosztorysu – narzędzie dla kupujących pakiet po szkodzie (logowanie kodem z maila). Ukryty przed Google.
import type { Metadata } from 'next';
import Link from 'next/link';
import Sprawdzacz from '@/components/szkoda/Sprawdzacz';
import { narzedzieAktywne } from '@/lib/sklep/kalkulator';
import { partnerKancelaria } from '@/lib/panel';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sprawdzacz kosztorysu – Niezbędnik po szkodzie',
  robots: { index: false, follow: false },
  alternates: { canonical: '/po-szkodzie/sprawdzacz/' }
};

export default function SprawdzaczPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {narzedzieAktywne('szkoda') ? (
        <Sprawdzacz kancelaria={partnerKancelaria()} />
      ) : (
        <div className="rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sprawdzacz kosztorysu</h1>
          <p className="text-slate-600 dark:text-slate-300">Sprawdzacz jest częścią pakietu po szkodzie i ruszy razem z jego sprzedażą. Już teraz możesz zrobić darmowy szybki test.</p>
          <Link href="/po-szkodzie/#test" className="font-semibold text-steel-700 dark:text-steel-300 underline">
            Zrób darmowy test kosztorysu
          </Link>
        </div>
      )}
    </div>
  );
}
