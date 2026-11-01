import { Udzial } from '@/types/car-model';
import { fmt } from '@/lib/format';

interface Props {
  tytul: string;
  opis?: string;
  dane: Udzial[];
  kolor?: 'steel' | 'rust';
}

// Prosty wykres słupkowy (poziomy) – bez dodatkowych bibliotek, działa też bez JavaScriptu
export default function BarList({ tytul, opis, dane, kolor = 'steel' }: Props) {
  const suma = dane.reduce((s, d) => s + d.liczba, 0) || 1;
  const max = Math.max(1, ...dane.map((d) => d.liczba));
  const pasek = kolor === 'rust' ? 'bg-rust-500' : 'bg-steel-500 dark:bg-steel-400';

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{tytul}</h3>
      {opis && <p className="text-xs text-slate-500 mt-0.5 mb-4">{opis}</p>}
      <ul className="space-y-2.5 mt-3">
        {dane.map((d) => (
          <li key={d.nazwa}>
            <div className="flex justify-between gap-3 text-sm mb-1">
              <span className="text-slate-700 dark:text-slate-300">{d.nazwa}</span>
              <span className="tabular-nums text-slate-500 whitespace-nowrap">
                <strong className="text-slate-900 dark:text-white">{fmt(d.liczba)}</strong> ·{' '}
                {((d.liczba / suma) * 100).toFixed(1).replace('.', ',')}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full ${pasek}`} style={{ width: `${(d.liczba / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
