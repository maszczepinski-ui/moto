import { fmt } from '@/lib/format';
import { LPG, zrodlaSilnikow, type WierszSilnika } from '@/lib/silniki';

const KOLOR_LPG = {
  zielony: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  zolty: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  pomaranczowy: 'bg-orange-50 text-orange-800 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900',
  szary: 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700'
};

export default function EngineTable({ silniki }: { silniki: WierszSilnika[] }) {
  const tech = silniki.some((s) => s.tech);
  const zrodla = tech ? zrodlaSilnikow(silniki) : [];
  return (
    <div className="space-y-2">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Gama silników{tech ? ' z typem wtrysku, napędem rozrządu i oceną pod LPG' : ''}</caption>
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500">
            <tr>
              <th scope="col" className="text-left font-semibold px-4 py-2.5">Wersja</th>
              <th scope="col" className="hidden sm:table-cell text-left font-semibold px-4 py-2.5">Kod silnika</th>
              <th scope="col" className="text-right font-semibold px-4 py-2.5">Pojemność</th>
              <th scope="col" className="text-right font-semibold px-4 py-2.5">Moc</th>
              <th scope="col" className={`${tech ? 'hidden sm:table-cell ' : ''}text-left font-semibold px-4 py-2.5`}>Paliwo</th>
              {tech && <th scope="col" className="hidden md:table-cell text-left font-semibold px-4 py-2.5">Wtrysk</th>}
              {tech && <th scope="col" className="hidden md:table-cell text-left font-semibold px-4 py-2.5">Rozrząd</th>}
              {tech && <th scope="col" className="text-left font-semibold px-3 sm:px-4 py-2.5">LPG</th>}
              <th scope="col" className="hidden sm:table-cell text-left font-semibold px-4 py-2.5">Lata</th>
            </tr>
          </thead>
          <tbody>
            {silniki.map((s) => {
              const t = s.tech;
              const kody = t ? t.kodyWgMocy?.[String(s.mocKm)] || t.kody : [];
              const kod = s.kod ?? (kody.length ? kody.slice(0, 3).join(', ') + (kody.length > 3 ? '…' : '') : null);
              const lpg = t ? LPG[t.lpg] : null;
              return (
                <tr key={s.nazwa + s.mocKm + s.lata} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <th scope="row" className="text-left px-4 py-2 font-semibold text-slate-900 dark:text-white">{s.nazwa}</th>
                  <td className="hidden sm:table-cell px-4 py-2 font-mono text-xs text-slate-600 dark:text-slate-400">{kod ?? '—'}</td>
                  <td className="px-3 sm:px-4 py-2 text-right tabular-nums whitespace-nowrap">{fmt(s.pojemnoscCm3)} cm³</td>
                  <td className="px-3 sm:px-4 py-2 text-right tabular-nums whitespace-nowrap">{s.mocKm} KM</td>
                  <td className={`${tech ? 'hidden sm:table-cell ' : ''}px-4 py-2`}>{s.paliwo}</td>
                  {tech && <td className="hidden md:table-cell px-4 py-2 text-slate-600 dark:text-slate-400">{t?.wtrysk ?? '—'}</td>}
                  {tech && <td className="hidden md:table-cell px-4 py-2 text-slate-600 dark:text-slate-400">{t?.rozrzad ?? '—'}</td>}
                  {tech && (
                    <td className="px-3 sm:px-4 py-2">
                      {lpg ? (
                        <span title={t?.lpgUwagi} className={`inline-block rounded-full ring-1 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${KOLOR_LPG[lpg.kolor]}`}>
                          <span className="sm:hidden">{lpg.krotko}</span>
                          <span className="hidden sm:inline">{lpg.tekst}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  )}
                  <td className="hidden sm:table-cell px-4 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{s.lata}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tech && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ocena LPG wynika z typu wtrysku: wtrysk pośredni (MPI) dobrze współpracuje z instalacją sekwencyjną, a bezpośredni (FSI/TSI) wymaga droższej instalacji. Przy każdym silniku na gazie
          pilnuj luzów zaworowych i świec. „—” oznacza dane jeszcze niezweryfikowane. Źródła:{' '}
          {zrodla.map((z, i) => (
            <span key={z.url}>
              {i > 0 && ', '}
              <a href={z.url} target="_blank" rel="noopener nofollow" className="underline hover:text-slate-700 dark:hover:text-slate-200">
                {z.tytul.replace(/^Wikipedia: /, '')}
              </a>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}
