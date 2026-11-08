'use client';

import { useState, useEffect, useRef } from 'react';
import { Printer, RotateCcw } from 'lucide-react';

export interface GrupaPunktow {
  id: string;
  tytul: string;
  punkty: string[];
}

interface Props {
  modelSlug: string;
  /** prosta lista (karta modelu) */
  items?: string[];
  /** lista w warstwach (asystent zakupu) */
  grupy?: GrupaPunktow[];
  /** nagłówek na wydruku / w PDF, np. „Volkswagen Golf IV” */
  tytulDruku?: string;
}

/** Drukuje tylko listę (kopia w #druk-kopia, reszta strony ukryta) – w oknie druku można wybrać „Zapisz jako PDF” */
function drukujListe(zrodlo: HTMLElement | null) {
  if (!zrodlo) return;
  const html = document.documentElement;
  const kopia = document.createElement('div');
  kopia.id = 'druk-kopia';
  const klon = zrodlo.cloneNode(true) as HTMLElement;
  // zaznaczenia są właściwością pola, a nie atrybutem – przenosimy je do kopii ręcznie
  const pola = zrodlo.querySelectorAll('input[type=checkbox]');
  klon.querySelectorAll('input[type=checkbox]').forEach((x, i) => (x as HTMLInputElement).toggleAttribute('checked', (pola[i] as HTMLInputElement).checked));
  kopia.appendChild(klon);
  document.body.appendChild(kopia);
  html.classList.add('drukuj-dokument');
  const koniec = () => {
    html.classList.remove('drukuj-dokument');
    kopia.remove();
    window.removeEventListener('afterprint', koniec);
  };
  window.addEventListener('afterprint', koniec);
  window.print();
}

export default function InspectionChecklist({ modelSlug, items, grupy, tytulDruku }: Props) {
  const lista: GrupaPunktow[] = grupy?.length ? grupy : [{ id: 'lista', tytul: '', punkty: items || [] }];
  const storageKey = grupy?.length ? `checklista_${modelSlug}` : `checklist_${modelSlug}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [data, setData] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Odczyt zapisanych zaznaczeń (tylko w przeglądarce użytkownika)
  useEffect(() => {
    setData(new Date().toLocaleDateString('pl-PL'));
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch {
      // brak dostępu do pamięci przeglądarki – lista działa dalej, tylko bez zapamiętywania
    }
  }, [storageKey]);

  const save = (updated: Record<string, boolean>) => {
    setChecked(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // j.w.
    }
  };

  // klucz zgodny ze starą, płaską listą (sam numer), żeby nie zgubić zapisanych zaznaczeń na kartach
  const klucz = (g: GrupaPunktow, i: number) => (grupy?.length ? `${g.id}-${i}` : String(i));
  const wszystkie = lista.reduce((s, g) => s + g.punkty.length, 0);
  const zrobione = lista.reduce((s, g) => s + g.punkty.filter((_, i) => checked[klucz(g, i)]).length, 0);

  return (
    <div ref={ref} className="lista-druk bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {tytulDruku && (
        <div className="hidden print:block mb-4">
          <p className="text-xs">moto-raport.pl · lista kontrolna na oględziny{data ? ` · ${data}` : ''}</p>
          <p className="text-xl font-bold">{tytulDruku}</p>
          <p className="text-xs mt-2">VIN: ______________________________ Przebieg: ____________ Cena: ____________</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lista kontrolna na oględziny</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Odhaczaj punkty na telefonie podczas oględzin. Zaznaczenia zapamiętują się na tym urządzeniu.</p>
          <p className="text-xs font-semibold text-steel-600 dark:text-steel-400 mt-1" aria-live="polite">
            Sprawdzone: {zrobione} z {wszystkie}
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
            onClick={grupy?.length ? () => drukujListe(ref.current) : () => window.print()}
            title="W oknie drukowania wybierz „Zapisz jako PDF”, żeby mieć listę w pliku"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            Drukuj / PDF
          </button>
        </div>
      </div>

      {lista.map((g) => (
        <div key={g.id} className="mt-4">
          {g.tytul && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-black mb-2 break-after-avoid">
              {g.tytul} <span className="font-normal normal-case print:hidden">({g.punkty.filter((_, i) => checked[klucz(g, i)]).length}/{g.punkty.length})</span>
            </h3>
          )}
          <ul className="space-y-2 print:space-y-0">
            {g.punkty.map((item, index) => {
              const k = klucz(g, index);
              const isChecked = !!checked[k];
              const id = `check-${modelSlug}-${k}`;
              return (
                <li key={k} className="break-inside-avoid">
                  <label
                    htmlFor={id}
                    className="flex items-start gap-3 p-3 print:p-1 rounded-lg border border-slate-100 dark:border-slate-800/60 print:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => save({ ...checked, [k]: !isChecked })}
                      className="mt-0.5 w-5 h-5 print:w-4 print:h-4 flex-shrink-0 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className={`text-sm ${isChecked ? 'line-through text-slate-400 dark:text-slate-500 print:text-black' : 'text-slate-800 dark:text-slate-200 print:text-black'}`}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
