import Link from 'next/link';
import { PREDKOSC, WYKROCZENIA, opisPrzedzialu, ZRODLA, STAN_PRZEPISOW } from '@/lib/mandaty';

const MAX = 2500;
const zl = (n: number) => n.toLocaleString('pl-PL') + ' zł';
const th = 'px-3 py-2 text-left font-semibold';
const td = 'px-3 py-2 border-t border-slate-100 dark:border-slate-800';

export function TabelaPredkosci({ zaznacz }: { zaznacz?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <caption className="sr-only">Mandaty za przekroczenie prędkości</caption>
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className={th}>Przekroczenie</th>
            <th className={`${th} text-right`}>Mandat</th>
            <th className={`${th} text-right`}>Recydywa</th>
            <th className={`${th} text-right`}>Punkty</th>
          </tr>
        </thead>
        <tbody>
          {PREDKOSC.map((p) => (
            <tr key={p.slug} className={zaznacz === p.slug ? 'bg-rust-50 dark:bg-rust-900/30 font-semibold' : ''}>
              <td className={td}>
                <Link href={`/mandaty/predkosc/${p.slug}/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                  {opisPrzedzialu(p)}
                </Link>
              </td>
              <td className={`${td} text-right tabular-nums font-bold`}>
                <span className="inline-flex items-center justify-end gap-2 w-full">
                  <span className="hidden sm:block h-2 rounded-r-[4px]" style={{ width: `${(p.kwota / MAX) * 7}rem`, background: 'var(--viz-2)' }} aria-hidden="true" />
                  {zl(p.kwota)}
                </span>
              </td>
              <td className={`${td} text-right tabular-nums`}>{p.recydywa ? zl(p.recydywa) : '—'}</td>
              <td className={`${td} text-right tabular-nums`}>
                <span className="inline-flex items-center justify-end gap-1.5">
                  <span className="hidden sm:flex gap-[2px]" aria-hidden="true">
                    {Array.from({ length: p.punkty }, (_, i) => (
                      <span key={i} className="w-1.5 h-3 rounded-[1px]" style={{ background: 'var(--viz-1)' }} />
                    ))}
                  </span>
                  <span className="w-5">{p.punkty}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TabelaWykroczen() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <caption className="sr-only">Mandaty za inne wykroczenia</caption>
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className={th}>Wykroczenie</th>
            <th className={`${th} text-right`}>Mandat</th>
            <th className={`${th} text-right`}>Punkty</th>
          </tr>
        </thead>
        <tbody>
          {WYKROCZENIA.map((w) => (
            <tr key={w.id}>
              <td className={td}>{w.nazwa}</td>
              <td className={`${td} text-right tabular-nums font-bold whitespace-nowrap`}>
                {w.kwota}
                {w.recydywa && <span className="block text-[11px] font-normal text-slate-500">recydywa {w.recydywa}</span>}
              </td>
              <td className={`${td} text-right tabular-nums`}>{w.punkty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ZrodlaMandatow() {
  return (
    <div className="text-xs text-slate-500 space-y-1">
      <p>
        Stan przepisów: {STAN_PRZEPISOW}. Informacje mają charakter poglądowy – wiążąca jest decyzja policjanta lub sądu. Źródła:{' '}
        {ZRODLA.map((z, i) => (
          <span key={z.url}>
            {i > 0 && ', '}
            <a href={z.url} target="_blank" rel="noopener" className="underline">
              {z.nazwa}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  );
}
