'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, SlidersHorizontal, FlaskConical, Search } from 'lucide-react';
import type { ModelSummary } from '@/lib/models';
import { fmt, sztuk, NADWOZIE_NAZWY } from '@/lib/format';

interface Props {
  initialModels: ModelSummary[];
}

const selectClass =
  'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500';

export default function ModelFilters({ initialModels }: Props) {
  const [szukaj, setSzukaj] = useState('');
  const [marka, setMarka] = useState('all');
  const [nadwozie, setNadwozie] = useState('all');
  const [sortBy, setSortBy] = useState<'liczba' | 'nazwa' | 'rok'>('liczba');
  const [ile, setIle] = useState(24);

  const marki = useMemo(() => Array.from(new Set(initialModels.map((m) => m.marka))).sort(), [initialModels]);
  const nadwozia = useMemo(() => Array.from(new Set(initialModels.flatMap((m) => m.nadwozia))), [initialModels]);

  const lista = useMemo(() => {
    const q = szukaj.trim().toLowerCase();
    return initialModels
      .filter((m) => {
        if (q && !`${m.marka} ${m.model} ${m.generacja}`.toLowerCase().includes(q)) return false;
        if (marka !== 'all' && m.marka !== marka) return false;
        if (nadwozie !== 'all' && !m.nadwozia.includes(nadwozie as never)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nazwa') return `${a.marka} ${a.model}`.localeCompare(`${b.marka} ${b.model}`, 'pl');
        if (sortBy === 'rok') return parseInt(b.lataProdukcji) - parseInt(a.lataProdukcji);
        return b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce;
      });
  }, [initialModels, szukaj, marka, nadwozie, sortBy]);

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-steel-600 dark:text-steel-400" aria-hidden="true" />
          Znajdź model
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="f-q" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Szukaj</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="f-q"
                type="search"
                value={szukaj}
                onChange={(e) => { setSzukaj(e.target.value); setIle(24); }}
                placeholder="np. E36, Octavia"
                className={`${selectClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="f-marka" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Marka</label>
            <select id="f-marka" value={marka} onChange={(e) => setMarka(e.target.value)} className={selectClass}>
              <option value="all">Wszystkie marki</option>
              {marki.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-nadw" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nadwozie</label>
            <select id="f-nadw" value={nadwozie} onChange={(e) => setNadwozie(e.target.value)} className={selectClass}>
              <option value="all">Wszystkie nadwozia</option>
              {nadwozia.map((n) => (
                <option key={n} value={n}>{NADWOZIE_NAZWY[n]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-sort" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Sortuj</label>
            <select id="f-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'liczba' | 'nazwa' | 'rok')} className={selectClass}>
              <option value="liczba">Najwięcej w Polsce</option>
              <option value="nazwa">Alfabetycznie</option>
              <option value="rok">Najnowsze</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
        {lista.slice(0, ile).map((m) => (
          <Link
            key={m.slug}
            href={m.adres}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg hover:border-steel-300 dark:hover:border-steel-700 transition-all flex flex-col"
          >
            {m.daneTestowe && (
              <span className="mb-3 inline-flex self-start items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <FlaskConical className="w-3 h-3" aria-hidden="true" />
                Wersja robocza – dane przykładowe
              </span>
            )}
            <span className="text-xs font-bold text-steel-600 dark:text-steel-400 uppercase tracking-wider">{m.marka}</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {m.model} <span className="font-normal text-slate-500">{m.generacja}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {m.wszystkieGeneracje ? `wszystkie generacje • ${m.lataProdukcji}` : `generacja • ${m.lataProdukcji}`}
            </p>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                  {fmt(m.cepik.liczbaWPolsce)}
                  {m.daneTestowe && <span className="text-amber-600 dark:text-amber-400 text-lg">*</span>}
                </div>
                <div className="text-xs text-slate-500">{sztuk(m.cepik.liczbaWPolsce)} zarejestrowanych w Polsce</div>
              </div>
              <ArrowRight className="w-5 h-5 text-steel-600 dark:text-steel-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-500 mt-3">{m.nadwozia.map((n) => NADWOZIE_NAZWY[n]).join(' · ')}</p>
          </Link>
        ))}
      </div>

      {lista.length > ile && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setIle(ile + 48)}
            className="px-6 py-3 rounded-xl font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400 text-steel-700 dark:text-steel-300"
          >
            Pokaż więcej ({fmt(lista.length - ile)} pozostało)
          </button>
        </div>
      )}

      {lista.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400">Nie ma jeszcze takiego modelu w atlasie.</p>
        </div>
      )}

      {lista.some((m) => m.daneTestowe) && (
        <p className="mt-4 text-xs text-amber-700 dark:text-amber-400">* Liczby oznaczone gwiazdką są przykładowe.</p>
      )}
    </div>
  );
}
