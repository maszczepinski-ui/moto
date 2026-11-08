// Tabela silników na karcie modelu.
// Na start widać tylko najważniejsze: wersję (z pojemnością pod nazwą), moc, paliwo, ocenę LPG i lata – dla 6 pierwszych wersji.
// Kody silnika, wtrysk i rozrząd oraz pozostałe wersje pokazuje przycisk (PrzelacznikTabeli). Wszystko jest w HTML – także dla Google.
import { fmt } from '@/lib/format';
import { LPG, zrodlaSilnikow, type WierszSilnika } from '@/lib/silniki';
import PrzelacznikTabeli from '@/components/PrzelacznikTabeli';

const KOLOR_LPG = {
  zielony: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  zolty: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  pomaranczowy: 'bg-orange-50 text-orange-800 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900',
  szary: ''
};

/** ile wersji każdego paliwa widać na start (żeby diesle nie chowały się za benzyną) */
const NA_START = 4;
/** kolumny techniczne – ukryte, dopóki ktoś nie kliknie „Szczegóły techniczne” */
const TECH = 'hidden group-data-[pelne=true]:table-cell';

export default function EngineTable({ silniki }: { silniki: WierszSilnika[] }) {
  const tech = silniki.some((s) => s.tech);
  const szczegoly = tech || silniki.some((s) => s.kod);
  const zrodla = tech ? zrodlaSilnikow(silniki) : [];
  // na start po kilka wersji każdego paliwa; resztę pokazuje przycisk (tylko gdy chowamy więcej niż 2)
  const licznik: Record<string, number> = {};
  const schowany = silniki.map((s) => (licznik[s.paliwo] = (licznik[s.paliwo] || 0) + 1) > NA_START);
  const ileSchowanych = schowany.filter(Boolean).length;
  const ukryte = ileSchowanych > 2 ? ileSchowanych : 0;
  const th = 'font-semibold px-3 sm:px-4 py-2.5';
  const td = 'px-3 sm:px-4 py-2.5';
  return (
    <PrzelacznikTabeli techniczne={szczegoly} ukryteWiersze={ukryte}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Gama silników{tech ? ' z oceną pod LPG, kodem silnika, typem wtrysku i napędem rozrządu' : ''}</caption>
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500">
            <tr>
              <th scope="col" className={`text-left ${th}`}>Wersja</th>
              <th scope="col" className={`text-right ${th}`}>Moc</th>
              <th scope="col" className={`hidden sm:table-cell text-left ${th}`}>Paliwo</th>
              {tech && <th scope="col" className={`text-left ${th}`}>LPG</th>}
              {szczegoly && <th scope="col" className={`${TECH} text-left ${th}`}>Kod silnika</th>}
              {tech && <th scope="col" className={`${TECH} text-left ${th}`}>Wtrysk</th>}
              {tech && <th scope="col" className={`${TECH} text-left ${th}`}>Rozrząd</th>}
              <th scope="col" className={`hidden sm:table-cell text-left ${th}`}>Lata</th>
            </tr>
          </thead>
          <tbody>
            {silniki.map((s, i) => {
              const t = s.tech;
              const kody = t ? t.kodyWgMocy?.[String(s.mocKm)] || t.kody : [];
              const kod = s.kod ?? (kody.length ? kody.slice(0, 3).join(', ') + (kody.length > 3 ? '…' : '') : null);
              const lpg = t ? LPG[t.lpg] : null;
              const dalszy = ukryte && schowany[i] ? 'hidden group-data-[wszystkie=true]:table-row' : '';
              return (
                <tr key={s.nazwa + s.mocKm + s.lata} className={`border-t border-slate-100 dark:border-slate-800 ${dalszy}`}>
                  <th scope="row" className={`text-left ${td} font-normal`}>
                    <span className="block font-semibold text-slate-900 dark:text-white whitespace-nowrap">{s.nazwa}</span>
                    <span className="block text-xs text-slate-500 whitespace-nowrap">
                      {fmt(s.pojemnoscCm3)} cm³<span className="sm:hidden"> · {s.paliwo.toLowerCase()}</span>
                    </span>
                  </th>
                  <td className={`${td} text-right tabular-nums whitespace-nowrap font-semibold text-slate-900 dark:text-white`}>{s.mocKm} KM</td>
                  <td className={`hidden sm:table-cell ${td} text-slate-700 dark:text-slate-300`}>{s.paliwo}</td>
                  {tech && (
                    <td className={td}>
                      {!lpg ? (
                        <span className="text-slate-400">—</span>
                      ) : t?.lpg === 'nie-dotyczy' ? (
                        <span className="text-xs text-slate-400">nie dotyczy</span>
                      ) : (
                        <span title={t?.lpgUwagi} className={`inline-block rounded-full ring-1 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${KOLOR_LPG[lpg.kolor]}`}>
                          <span className="sm:hidden">{lpg.krotko}</span>
                          <span className="hidden sm:inline">{lpg.tekst}</span>
                        </span>
                      )}
                    </td>
                  )}
                  {szczegoly && <td className={`${TECH} ${td} font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap`}>{kod ?? '—'}</td>}
                  {tech && (
                    <td className={`${TECH} ${td} text-slate-600 dark:text-slate-400 whitespace-nowrap`} title={t?.wtrysk}>
                      {t ? t.wtrysk.replace(/\s*\(.*\)/, '').replace(/, wtrysk.*$/, '') : '—'}
                    </td>
                  )}
                  {tech && <td className={`${TECH} ${td} text-slate-600 dark:text-slate-400 whitespace-nowrap`}>{t?.rozrzad ?? '—'}</td>}
                  <td className={`hidden sm:table-cell ${td} text-slate-500 whitespace-nowrap`}>{s.lata}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tech && (
        <details className="text-xs text-slate-500 dark:text-slate-400">
          <summary className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">Skąd ocena LPG i źródła danych</summary>
          <p className="mt-2">
            Ocena wynika z typu wtrysku: wtrysk pośredni (MPI) dobrze współpracuje z instalacją sekwencyjną, a bezpośredni (FSI/TSI) wymaga droższej instalacji. Przy każdym silniku na gazie
            pilnuj luzów zaworowych i świec. „—” oznacza wersję, której dane jeszcze sprawdzamy.
          </p>
          <p className="mt-1">
            Źródła:{' '}
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
        </details>
      )}
    </PrzelacznikTabeli>
  );
}
