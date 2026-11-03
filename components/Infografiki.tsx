import Link from 'next/link';

// Proste infografiki bez bibliotek: poziome słupki (jedna seria – jeden kolor) i pasek udziałów (kilka kategorii).
// Każda wartość jest podpisana tekstem obok, więc wykres czyta się także bez rozróżniania kolorów.

const KOLORY = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)'];

export interface Slupek {
  nazwa: string;
  wartosc: number;
  etykieta: string;
  adres?: string;
  /** wyróżniony słupek (np. „Twoje auto”) */
  wyroznij?: boolean;
}

export function SlupkiPoziome({ dane, kolor = 'var(--viz-1)', opis }: { dane: Slupek[]; kolor?: string; opis: string }) {
  const max = Math.max(...dane.map((d) => d.wartosc), 1);
  return (
    <figure className="space-y-2.5">
      <figcaption className="sr-only">{opis}</figcaption>
      {dane.map((d) => {
        const nazwa = d.adres ? (
          <Link href={d.adres} className="hover:underline">
            {d.nazwa}
          </Link>
        ) : (
          d.nazwa
        );
        return (
          <div key={d.nazwa} className="group grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-3 text-sm" title={`${d.nazwa}: ${d.etykieta}`}>
            <span className={`truncate ${d.wyroznij ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{nazwa}</span>
            <span className="h-3 rounded-r-[4px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <span
                className="block h-full rounded-r-[4px] transition-opacity group-hover:opacity-80"
                style={{ width: `${Math.max(1.5, (d.wartosc / max) * 100)}%`, background: d.wyroznij ? 'var(--viz-2)' : kolor }}
              />
            </span>
            <span className="tabular-nums font-semibold text-slate-900 dark:text-white whitespace-nowrap">{d.etykieta}</span>
          </div>
        );
      })}
    </figure>
  );
}

export function PasekUdzialow({ dane, opis }: { dane: { nazwa: string; procent: number }[]; opis: string }) {
  const pl = (x: number) => (x < 1 ? x.toLocaleString('pl-PL', { maximumFractionDigits: 1 }) : Math.round(x).toLocaleString('pl-PL'));
  return (
    <figure className="space-y-3">
      <figcaption className="sr-only">{opis}</figcaption>
      <div className="flex h-8 w-full gap-[2px] rounded-[6px] overflow-hidden" role="img" aria-label={dane.map((d) => `${d.nazwa} ${pl(d.procent)}%`).join(', ')}>
        {dane.map((d, i) => (
          <span key={d.nazwa} className="h-full first:rounded-l-[6px] last:rounded-r-[6px] hover:opacity-80" style={{ width: `${Math.max(0.6, d.procent)}%`, background: KOLORY[i % KOLORY.length] }} title={`${d.nazwa}: ${pl(d.procent)}%`} />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {dane.map((d, i) => (
          <li key={d.nazwa} className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: KOLORY[i % KOLORY.length] }} aria-hidden="true" />
            <span className="text-slate-700 dark:text-slate-300">{d.nazwa}</span>
            <strong className="tabular-nums text-slate-900 dark:text-white">{pl(d.procent)}%</strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Pionowe słupki (np. rozkład roczników) – jedna seria, podpis wartości nad słupkiem */
export function SlupkiPionowe({ dane, opis }: { dane: { nazwa: string; wartosc: number; etykieta: string }[]; opis: string }) {
  const max = Math.max(...dane.map((d) => d.wartosc), 1);
  return (
    <figure>
      <figcaption className="sr-only">{opis}</figcaption>
      <div className="flex items-end gap-2 h-44 border-b border-slate-200 dark:border-slate-700">
        {dane.map((d) => (
          <div key={d.nazwa} className="group flex-1 h-full flex flex-col justify-end items-center gap-1 min-w-0" title={`${d.nazwa}: ${d.etykieta}`}>
            <span className="text-[11px] font-semibold tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">{d.etykieta}</span>
            <span className="w-full max-w-[3rem] rounded-t-[4px] group-hover:opacity-80" style={{ height: `${Math.max(2, (d.wartosc / max) * 82)}%`, background: 'var(--viz-1)' }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1.5">
        {dane.map((d) => (
          <span key={d.nazwa} className="flex-1 text-center text-[11px] text-slate-500 min-w-0 truncate">
            {d.nazwa}
          </span>
        ))}
      </div>
    </figure>
  );
}
