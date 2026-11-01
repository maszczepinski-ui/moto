'use client';

import { useState, useEffect } from 'react';
import { Printer, RotateCcw } from 'lucide-react';

interface Props {
  modelSlug: string;
  items: string[];
}

export default function InspectionChecklist({ modelSlug, items }: Props) {
  const storageKey = `checklist_${modelSlug}`;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Odczyt zapisanych zaznaczeń (tylko w przeglądarce użytkownika)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch {
      // brak dostępu do pamięci przeglądarki – lista działa dalej, tylko bez zapamiętywania
    }
  }, [storageKey]);

  const save = (updated: Record<number, boolean>) => {
    setCheckedItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // j.w.
    }
  };

  const toggleItem = (index: number) => save({ ...checkedItems, [index]: !checkedItems[index] });
  const doneCount = items.filter((_, i) => checkedItems[i]).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lista kontrolna na oględziny</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Odhaczaj punkty na telefonie podczas oględzin. Zaznaczenia zapamiętują się na tym urządzeniu.
          </p>
          <p className="text-xs font-semibold text-steel-600 dark:text-steel-400 mt-1" aria-live="polite">
            Sprawdzone: {doneCount} z {items.length}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <button
            type="button"
            onClick={() => save({})}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Wyczyść
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            Drukuj listę
          </button>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => {
          const isChecked = !!checkedItems[index];
          const id = `check-${modelSlug}-${index}`;
          return (
            <li key={index}>
              <label
                htmlFor={id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(index)}
                  className="mt-0.5 w-5 h-5 flex-shrink-0 rounded accent-emerald-600 cursor-pointer"
                />
                <span className={`text-sm ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
