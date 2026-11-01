import { fmt, sztuk } from '@/lib/format';

interface Props {
  dane: { rok: number; liczba: number }[];
}

// Wykres kolumnowy roczników – zwykły HTML, bez dodatkowych bibliotek
export default function YearChart({ dane }: Props) {
  const max = Math.max(1, ...dane.map((d) => d.liczba));
  // przy wielu rocznikach chowamy liczby nad słupkami i podpisujemy co 5. rok, żeby wykres się mieścił
  const gesto = dane.length > 14;
  const coPiaty = dane.length > 22;
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Roczniki</h3>
      <p className="text-xs text-slate-500 mt-0.5">Liczba zarejestrowanych aut według roku produkcji</p>
      <div className={`mt-4 flex items-end h-48 ${gesto ? 'gap-px sm:gap-0.5' : 'gap-1 sm:gap-1.5'}`} role="list">
        {dane.map((d) => (
          <div key={d.rok} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full group" role="listitem">
            {!gesto && <span className="text-[10px] tabular-nums text-slate-500 mb-1 hidden sm:block">{fmt(d.liczba)}</span>}
            <div
              className="w-full rounded-t bg-rust-500 group-hover:bg-rust-600 transition-colors"
              style={{ height: `${Math.max(2, (d.liczba / max) * 100)}%` }}
              title={`${d.rok}: ${fmt(d.liczba)} ${sztuk(d.liczba)}`}
            />
            <span className={`text-[10px] text-slate-500 mt-1 tabular-nums whitespace-nowrap ${coPiaty && d.rok % 5 !== 0 ? 'invisible' : ''}`} aria-hidden="true">
              {"'"}
              {String(d.rok).slice(2)}
            </span>
            <span className="sr-only">
              {d.rok}: {fmt(d.liczba)} {sztuk(d.liczba)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
