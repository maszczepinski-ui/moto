import type { Metadata } from 'next';
import StatusPlatnosci from '@/components/sklep/StatusPlatnosci';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dziękujemy za zakup', robots: { index: false, follow: false } };

export default async function DziekujemyPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dziękujemy za zakup!</h1>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <StatusPlatnosci sessionId={s || ''} />
      </div>
      <p className="text-sm text-slate-500">Nie ma maila? Sprawdź folder „Oferty” i „Spam”. Numer zamówienia: {s || '—'}</p>
    </div>
  );
}
