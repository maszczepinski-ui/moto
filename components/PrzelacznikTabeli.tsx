'use client';
// Owija tabelę i chowa na start część danych: kolumny techniczne (.kol-tech) i wiersze ponad limit (.wiersz-dalszy).
// Przyciski ustawiają atrybuty data-* na wrapperze, a komórki pokazują się przez klasy group-data-[…] z Tailwinda.
import { useState, type ReactNode } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function PrzelacznikTabeli({ children, techniczne, ukryteWiersze }: { children: ReactNode; techniczne: boolean; ukryteWiersze: number }) {
  const [pelne, setPelne] = useState(false);
  const [wszystkie, setWszystkie] = useState(false);
  const przycisk =
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-steel-700 dark:text-steel-300 bg-steel-50 dark:bg-slate-800 hover:bg-steel-100 dark:hover:bg-slate-700 transition-colors';
  return (
    <div className="group space-y-3" data-pelne={pelne} data-wszystkie={wszystkie}>
      {children}
      {(techniczne || ukryteWiersze > 0) && (
        <div className="flex flex-wrap gap-2">
          {ukryteWiersze > 0 && (
            <button type="button" className={przycisk} aria-expanded={wszystkie} onClick={() => setWszystkie(!wszystkie)}>
              <ChevronDown className={`w-4 h-4 transition-transform ${wszystkie ? 'rotate-180' : ''}`} aria-hidden="true" />
              {wszystkie ? 'Pokaż mniej wersji' : `Pokaż wszystkie wersje (+${ukryteWiersze})`}
            </button>
          )}
          {techniczne && (
            <button type="button" className={przycisk} aria-expanded={pelne} onClick={() => setPelne(!pelne)}>
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              {pelne ? 'Ukryj szczegóły techniczne' : <span>Szczegóły techniczne<span className="hidden sm:inline">: kod silnika, wtrysk, rozrząd</span></span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
