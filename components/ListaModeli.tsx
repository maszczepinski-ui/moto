import { fmt } from '@/lib/format';

interface Pozycja {
  slug: string;
  adres: string;
  nazwa: string;
  /** wartość pokazywana po prawej (np. „1 234 szt.” albo „2,1×”) */
  wartosc: string;
  /** długość paska 0–1 */
  pasek?: number;
  podpis?: string;
}

// Numerowana lista modeli z linkami do kart i paskami
export default function ListaModeli({ pozycje, kolor = 'steel' }: { pozycje: Pozycja[]; kolor?: 'steel' | 'rust' }) {
  const pasekKolor = kolor === 'rust' ? 'bg-rust-500' : 'bg-steel-500 dark:bg-steel-400';
  return (
    <ol className="divide-y divide-slate-100 dark:divide-slate-800">
      {pozycje.map((p, i) => (
        <li key={p.slug} className="py-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <a href={p.adres} className="flex items-baseline gap-2 min-w-0 hover:underline">
              <span className="text-xs text-slate-400 tabular-nums w-6 flex-shrink-0">{i + 1}.</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">{p.nazwa}</span>
            </a>
            <span className="text-sm tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">{p.wartosc}</span>
          </div>
          {p.podpis && <div className="text-xs text-slate-500 ml-8">{p.podpis}</div>}
          {p.pasek !== undefined && (
            <div className="ml-8 mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full ${pasekKolor}`} style={{ width: `${Math.max(1, p.pasek * 100)}%` }} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export const szt = (n: number) => `${fmt(n)} szt.`;
