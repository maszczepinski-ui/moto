'use client';
// Tabela rankingu chińskich aut: sortowanie, filtr napędu i marki, karty na telefonie, przyciski partnerskie.
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Calculator, Minus, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import type { Naped, PozycjaRankingu } from '@/lib/chinskie';

const NAZWY: Record<Naped, string> = { benzyna: 'Benzyna', hybryda: 'Hybryda', elektryczny: 'Elektryczny' };
const KOLOR_NAPEDU: Record<Naped, string> = {
  benzyna: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  hybryda: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  elektryczny: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
};
const fmt = (n: number) => n.toLocaleString('pl-PL');
const chip = (a: boolean) =>
  `px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${a ? 'bg-steel-700 text-white border-steel-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-steel-400'}`;

type Sort = 'pozycja' | 'miesiac' | 'cena' | 'poprzedni';

/** Zastępcze „zdjęcie”: sylwetka auta w kolorach strony + nazwa marki; przy nowym modelu etykieta „Nowość w rankingu” */
function Placeholder({ p }: { p: PozycjaRankingu }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
      <svg viewBox="0 0 120 50" className="w-3/4 h-auto text-slate-300 dark:text-slate-700" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14 34c0-3 2-5 5-6l10-3 14-11c2-2 5-3 8-3h22c3 0 6 1 8 3l12 11 12 2c3 1 5 3 5 6v6c0 2-1 3-3 3h-8a10 10 0 0 0-20 0H45a10 10 0 0 0-20 0h-8c-2 0-3-1-3-3z"
        />
        <circle cx="35" cy="43" r="6" fill="currentColor" />
        <circle cx="87" cy="43" r="6" fill="currentColor" />
      </svg>
      <span className="absolute bottom-1.5 left-2 text-[10px] font-black uppercase tracking-wider text-slate-500">{p.marka}</span>
      {p.trend.typ === 'nowosc' && (
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-rust-600 text-white px-2 py-0.5 text-[10px] font-bold">
          <Sparkles className="w-3 h-3" aria-hidden="true" /> Nowość w rankingu
        </span>
      )}
    </div>
  );
}

function Zdjecie({ p, className }: { p: PozycjaRankingu; className: string }) {
  return (
    <div className={`overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 aspect-[16/10] ${className}`}>
      {p.zdjecie ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.zdjecie} alt={p.nazwa} loading="lazy" decoding="async" width={800} height={500} className="w-full h-full object-cover" />
      ) : (
        <Placeholder p={p} />
      )}
    </div>
  );
}

function TrendZnak({ p, wzgledem }: { p: PozycjaRankingu; wzgledem: string }) {
  const t = p.trend;
  if (t.typ === 'nowosc')
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rust-600 dark:text-rust-400" title="Nowy model w rankingu">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> nowość
      </span>
    );
  if (t.typ === 'bez-zmian')
    return (
      <span className="inline-flex items-center text-slate-400" title={`Bez zmian ${wzgledem}`}>
        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">bez zmian</span>
      </span>
    );
  const awans = t.typ === 'awans';
  const I = awans ? ArrowUp : ArrowDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${awans ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} title={`${awans ? 'Awans' : 'Spadek'} o ${t.o} ${wzgledem}`}>
      <I className="w-3.5 h-3.5" aria-hidden="true" />
      {t.o}
    </span>
  );
}

function Napedy({ p }: { p: PozycjaRankingu }) {
  return (
    <span className="flex flex-wrap gap-1">
      {p.napedy.map((n) => (
        <span key={n.typ} className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${KOLOR_NAPEDU[n.typ]}`}>
          {NAZWY[n.typ]}
          {p.napedy.length > 1 && <span className="opacity-70"> {Math.round(n.udzial * 100)}%</span>}
        </span>
      ))}
    </span>
  );
}

function Przyciski({ p, maly = false }: { p: PozycjaRankingu; maly?: boolean }) {
  if (!p.linkFinansowanie && !p.linkOc) return null;
  const k = maly ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm';
  return (
    <span className="flex flex-wrap gap-1.5">
      {p.linkFinansowanie && (
        <LinkPartnerski href={p.linkFinansowanie} modul="finansowanie" partner="comperialead" karta={`ranking-chinskie-${p.slug}`} className={`inline-flex items-center gap-1.5 rounded-lg bg-rust-600 hover:bg-rust-700 text-white font-bold ${k}`}>
          <Calculator className="w-3.5 h-3.5" aria-hidden="true" /> Oblicz ratę
        </LinkPartnerski>
      )}
      {p.linkOc && (
        <LinkPartnerski href={p.linkOc} modul="ubezpieczenia" partner="rankomat" karta={`ranking-chinskie-${p.slug}`} className={`inline-flex items-center gap-1.5 rounded-lg ring-1 ring-sky-300 dark:ring-sky-800 text-sky-800 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 font-bold ${k}`}>
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> OC/AC
        </LinkPartnerski>
      )}
    </span>
  );
}

export default function RankingChinskich({ pozycje, rok, miesiacNazwa, trendMiesieczny }: { pozycje: PozycjaRankingu[]; rok: number; miesiacNazwa: string | null; trendMiesieczny: boolean }) {
  const [naped, setNaped] = useState<Naped | 'wszystkie'>('wszystkie');
  const [marka, setMarka] = useState('');
  const [sort, setSort] = useState<Sort>('pozycja');
  const marki = useMemo(() => [...new Set(pozycje.map((p) => p.marka))].sort((a, b) => a.localeCompare(b, 'pl')), [pozycje]);
  const wzgledem = trendMiesieczny ? 'względem poprzedniego miesiąca' : `względem ${rok - 1} r.`;
  const maCeny = pozycje.some((p) => p.cenaOd);

  const lista = useMemo(() => {
    const l = pozycje.filter((p) => (naped === 'wszystkie' || p.napedy.some((n) => n.typ === naped)) && (!marka || p.marka === marka));
    const s = [...l];
    if (sort === 'miesiac') s.sort((a, b) => (b.miesiac || 0) - (a.miesiac || 0));
    if (sort === 'poprzedni') s.sort((a, b) => b.poprzedniRok - a.poprzedniRok);
    if (sort === 'cena') s.sort((a, b) => (a.cenaOd ?? Infinity) - (b.cenaOd ?? Infinity));
    return s;
  }, [pozycje, naped, marka, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtry rankingu">
        {(['wszystkie', 'benzyna', 'hybryda', 'elektryczny'] as const).map((n) => (
          <button key={n} type="button" aria-pressed={naped === n} onClick={() => setNaped(n)} className={chip(naped === n)}>
            {n === 'wszystkie' ? 'Wszystkie' : NAZWY[n]}
          </button>
        ))}
        <select value={marka} onChange={(e) => setMarka(e.target.value)} aria-label="Marka" className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <option value="">Wszystkie marki</option>
          {marki.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sortowanie" className="sm:ml-auto px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <option value="pozycja">Sortuj: rejestracje {rok}</option>
          {miesiacNazwa && <option value="miesiac">Sortuj: {miesiacNazwa}</option>}
          <option value="poprzedni">Sortuj: rejestracje {rok - 1}</option>
          {maCeny && <option value="cena">Sortuj: cena od najniższej</option>}
        </select>
      </div>

      <p className="text-sm text-slate-500" aria-live="polite">
        {lista.length === pozycje.length ? `${lista.length} modeli` : `${lista.length} z ${pozycje.length} modeli`}
      </p>

      {/* Komputer: tabela */}
      <div className="hidden md:block overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <caption className="sr-only">Ranking chińskich samochodów w Polsce – rejestracje {rok}</caption>
          <thead className="bg-slate-50 dark:bg-slate-800 text-left">
            <tr>
              <th className="px-3 py-2.5 font-semibold w-14">#</th>
              <th className="px-3 py-2.5 font-semibold">Model</th>
              <th className="px-3 py-2.5 font-semibold">Napęd</th>
              {miesiacNazwa && <th className="px-3 py-2.5 font-semibold text-right">{miesiacNazwa}</th>}
              <th className="px-3 py-2.5 font-semibold text-right">{rok} (od stycznia)</th>
              <th className="px-3 py-2.5 font-semibold text-right">Cały {rok - 1}</th>
              {maCeny && <th className="px-3 py-2.5 font-semibold text-right">Cena od</th>}
              <th className="px-3 py-2.5 font-semibold">
                <span className="sr-only">Finansowanie i ubezpieczenie</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.slug} className="border-t border-slate-100 dark:border-slate-800 align-middle">
                <td className="px-3 py-2.5">
                  <span className="flex flex-col items-start gap-0.5">
                    <span className="font-black tabular-nums text-slate-900 dark:text-white">{p.pozycja}.</span>
                    <TrendZnak p={p} wzgledem={wzgledem} />
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <a href={p.adres} className="flex items-center gap-3 group">
                    <Zdjecie p={p} className="w-24 flex-shrink-0" />
                    <span>
                      <span className="block font-bold text-slate-900 dark:text-white group-hover:underline">{p.nazwa}</span>
                      <span className="block text-xs text-slate-500">{fmt(p.wPolsce)} w Polsce</span>
                    </span>
                  </a>
                </td>
                <td className="px-3 py-2.5">
                  <Napedy p={p} />
                </td>
                {miesiacNazwa && <td className="px-3 py-2.5 text-right tabular-nums">{fmt(p.miesiac || 0)}</td>}
                <td className="px-3 py-2.5 text-right tabular-nums font-bold text-slate-900 dark:text-white">{fmt(p.ytd)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">{fmt(p.poprzedniRok)}</td>
                {maCeny && <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">{p.cenaOd ? `${fmt(p.cenaOd)} zł` : '—'}</td>}
                <td className="px-3 py-2.5">
                  <Przyciski p={p} maly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Telefon: karty */}
      <ol className="md:hidden space-y-3">
        {lista.map((p) => (
          <li key={p.slug} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex gap-3">
              <a href={p.adres} className="w-28 flex-shrink-0">
                <Zdjecie p={p} className="w-full" />
              </a>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black tabular-nums text-slate-900 dark:text-white">{p.pozycja}.</span>
                  <TrendZnak p={p} wzgledem={wzgledem} />
                </div>
                <a href={p.adres} className="block font-bold leading-snug text-slate-900 dark:text-white hover:underline">
                  {p.nazwa}
                </a>
                <div className="mt-1">
                  <Napedy p={p} />
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {miesiacNazwa && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                  <dt className="text-[10px] text-slate-500 truncate">{miesiacNazwa}</dt>
                  <dd className="font-bold tabular-nums">{fmt(p.miesiac || 0)}</dd>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                <dt className="text-[10px] text-slate-500">{rok} r.</dt>
                <dd className="font-bold tabular-nums">{fmt(p.ytd)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                <dt className="text-[10px] text-slate-500">{rok - 1} r.</dt>
                <dd className="font-bold tabular-nums text-slate-600 dark:text-slate-300">{fmt(p.poprzedniRok)}</dd>
              </div>
              {p.cenaOd ? (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                  <dt className="text-[10px] text-slate-500">cena od</dt>
                  <dd className="font-bold tabular-nums">{fmt(p.cenaOd)} zł</dd>
                </div>
              ) : null}
            </dl>
            <Przyciski p={p} />
          </li>
        ))}
      </ol>
      {lista.length === 0 && <p className="text-slate-500">Brak modeli dla wybranych filtrów.</p>}
      {pozycje.some((p) => p.linkFinansowanie || p.linkOc) && (
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <ExternalLink className="w-3 h-3" aria-hidden="true" /> Przyciski „Oblicz ratę” i „OC/AC” to linki partnerskie.
        </p>
      )}
    </div>
  );
}
