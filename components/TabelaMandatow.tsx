import Link from 'next/link';
import { PREDKOSC, WYKROCZENIA, ZRODLA, STAN_PRZEPISOW } from '@/lib/mandaty';
import { TEKSTY_MANDATOW, stanPrzepisowW } from '@/lib/mandaty-teksty';
import type { Jezyk } from '@/lib/jezyki';

const MAX = 2500;
const th = 'px-3 py-2 text-left font-semibold';
const td = 'px-3 py-2 border-t border-slate-100 dark:border-slate-800';

/** `j` – język tabeli; w wersjach obcych przedziały nie są linkami (podstrony prędkości są tylko po polsku) */
export function TabelaPredkosci({ zaznacz, j = 'pl' }: { zaznacz?: string; j?: Jezyk }) {
  const t = TEKSTY_MANDATOW[j];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <caption className="sr-only">{t.tabela.predkoscOpis}</caption>
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className={th}>{t.tabela.przekroczenie}</th>
            <th className={`${th} text-right`}>{t.tabela.mandat}</th>
            <th className={`${th} text-right`}>{t.tabela.recydywa}</th>
            <th className={`${th} text-right`}>{t.tabela.punkty}</th>
          </tr>
        </thead>
        <tbody>
          {PREDKOSC.map((p) => (
            <tr key={p.slug} className={zaznacz === p.slug ? 'bg-rust-50 dark:bg-rust-900/30 font-semibold' : ''}>
              <td className={td}>
                {j === 'pl' ? (
                  <Link href={`/mandaty/predkosc/${p.slug}/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                    {t.przedzial(p)}
                  </Link>
                ) : (
                  t.przedzial(p)
                )}
              </td>
              <td className={`${td} text-right tabular-nums font-bold`}>
                <span className="inline-flex items-center justify-end gap-2 w-full">
                  <span className="hidden sm:block h-2 rounded-r-[4px]" style={{ width: `${(p.kwota / MAX) * 7}rem`, background: 'var(--viz-2)' }} aria-hidden="true" />
                  {t.zl(p.kwota)}
                </span>
              </td>
              <td className={`${td} text-right tabular-nums`}>{p.recydywa ? t.zl(p.recydywa) : '—'}</td>
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

export function TabelaWykroczen({ j = 'pl' }: { j?: Jezyk }) {
  const t = TEKSTY_MANDATOW[j];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <caption className="sr-only">{t.tabela.wykroczeniaOpis}</caption>
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className={th}>{t.tabela.wykroczenie}</th>
            <th className={`${th} text-right`}>{t.tabela.mandat}</th>
            <th className={`${th} text-right`}>{t.tabela.punkty}</th>
          </tr>
        </thead>
        <tbody>
          {WYKROCZENIA.map((w) => (
            <tr key={w.id}>
              <td className={td}>{t.wykroczenia[w.id] || w.nazwa}</td>
              <td className={`${td} text-right tabular-nums font-bold whitespace-nowrap`}>
                {w.kwota}
                {w.recydywa && <span className="block text-[11px] font-normal text-slate-500">{t.recydywaKwota(w.recydywa)}</span>}
              </td>
              <td className={`${td} text-right tabular-nums`}>{w.punkty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ZrodlaMandatow({ j = 'pl' }: { j?: Jezyk }) {
  const t = TEKSTY_MANDATOW[j];
  return (
    <div className="text-xs text-slate-500 space-y-1">
      <p>
        {t.zrodla.stan}: {stanPrzepisowW(j, STAN_PRZEPISOW)}. {t.zrodla.pogladowe} {t.zrodla.zrodla}:{' '}
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
