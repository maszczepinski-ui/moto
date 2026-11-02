'use client';
// Porównywarka części: wybierasz część (i ewentualnie silnik), a przyciski prowadzą do wyników Allegro / Ceneo dla dokładnie tego auta.
import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { sledz } from '@/lib/sledz';

export const ZNACZNIK_FRAZY = '__FRAZA__';

export default function CzesciWidget({
  kategorie,
  silniki,
  nazwaAuta,
  allegro,
  ceneo,
  karta
}: {
  kategorie: string[];
  silniki: string[];
  nazwaAuta: string;
  /** link z wypełnionymi danymi auta i znacznikiem __FRAZA__ w miejscu szukanej frazy */
  allegro: string;
  ceneo: string;
  karta: string;
}) {
  const [czesc, setCzesc] = useState(kategorie[0] || '');
  const [inna, setInna] = useState('');
  const [silnik, setSilnik] = useState('');
  const wybrana = inna.trim() || czesc;
  const fraza = `${wybrana} ${nazwaAuta} ${silnik}`.replace(/\s+/g, ' ').trim();
  const link = (szablon: string) => szablon.replace(ZNACZNIK_FRAZY, encodeURIComponent(fraza));
  const klik = (partner: string) => sledz('klik_partner', { modul: 'czesci', partner, karta, czesc: wybrana });

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">1. Wybierz część</div>
        <div className="flex flex-wrap gap-2">
          {kategorie.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => {
                setCzesc(x);
                setInna('');
              }}
              aria-pressed={!inna && czesc === x}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors first-letter:uppercase ${
                !inna && czesc === x
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
              }`}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <label htmlFor={`cz-inna-${karta}`} className="sr-only">
            Inna część
          </label>
          <input
            id={`cz-inna-${karta}`}
            value={inna}
            onChange={(e) => setInna(e.target.value)}
            maxLength={60}
            placeholder="albo wpisz inną część, np. sprzęgło, amortyzatory"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
      {silniki.length > 1 && (
        <div>
          <label htmlFor={`cz-s-${karta}`} className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            2. Silnik (dokładniejsze wyniki)
          </label>
          <select
            id={`cz-s-${karta}`}
            value={silnik}
            onChange={(e) => setSilnik(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="">dowolny silnik</option>
            {silniki.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 space-y-3">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          Szukasz: <strong className="text-slate-900 dark:text-white">{fraza}</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          {allegro && (
            <a
              href={link(allegro)}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => klik('allegro')}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Porównaj ceny na Allegro <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {ceneo && (
            <a
              href={link(ceneo)}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => klik('ceneo')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Porównaj ceny na Ceneo <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
