'use client';
import type { ReactNode } from 'react';

// Wspólne pola formularzy kalkulatorów – ten sam wygląd w każdym narzędziu.

export const KARTA_NARZEDZIA =
  'rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)] p-5 sm:p-7';
const POLE =
  'w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 text-slate-900 dark:text-white text-base ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-rust-500 focus:outline-none';

export function Etykieta({ htmlFor, children, podpowiedz }: { htmlFor: string; children: ReactNode; podpowiedz?: string }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">{children}</span>
      {podpowiedz && <span className="block text-xs text-slate-500 mt-0.5">{podpowiedz}</span>}
    </label>
  );
}

export function PoleLiczby({ id, etykieta, wartosc, ustaw, min = 0, max, krok = 1, jednostka, podpowiedz }: {
  id: string;
  etykieta: string;
  wartosc: number;
  ustaw: (n: number) => void;
  min?: number;
  max?: number;
  krok?: number;
  jednostka?: string;
  podpowiedz?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Etykieta htmlFor={id} podpowiedz={podpowiedz}>
        {etykieta}
      </Etykieta>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className={`${POLE} ${jednostka ? 'pr-16' : ''}`}
          value={Number.isFinite(wartosc) ? wartosc : ''}
          min={min}
          max={max}
          step={krok}
          onChange={(e) => ustaw(e.target.value === '' ? 0 : Number(e.target.value))}
        />
        {jednostka && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">{jednostka}</span>}
      </div>
    </div>
  );
}

export function PoleWyboru<T extends string>({ id, etykieta, wartosc, ustaw, opcje, podpowiedz }: {
  id: string;
  etykieta: string;
  wartosc: T;
  ustaw: (v: T) => void;
  opcje: { id: T; nazwa: string }[];
  podpowiedz?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Etykieta htmlFor={id} podpowiedz={podpowiedz}>
        {etykieta}
      </Etykieta>
      <select id={id} className={POLE} value={wartosc} onChange={(e) => ustaw(e.target.value as T)}>
        {opcje.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nazwa}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PoleDaty({ id, etykieta, wartosc, ustaw, podpowiedz }: { id: string; etykieta: string; wartosc: string; ustaw: (v: string) => void; podpowiedz?: string }) {
  return (
    <div className="space-y-1.5">
      <Etykieta htmlFor={id} podpowiedz={podpowiedz}>
        {etykieta}
      </Etykieta>
      <input id={id} type="date" className={POLE} value={wartosc} onChange={(e) => ustaw(e.target.value)} />
    </div>
  );
}

/** Przyciski „jeden z kilku” (zamiast listy rozwijanej, gdy opcji jest mało) */
export function Przelacznik<T extends string>({ etykieta, wartosc, ustaw, opcje }: { etykieta: string; wartosc: T; ustaw: (v: T) => void; opcje: { id: T; nazwa: string }[] }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-bold text-slate-800 dark:text-slate-200">{etykieta}</legend>
      <div className="flex flex-wrap gap-2">
        {opcje.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={wartosc === o.id}
            onClick={() => ustaw(o.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ring-1 transition ${
              wartosc === o.id ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-700 hover:ring-rust-400'
            }`}
          >
            {o.nazwa}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export type Ton = 'zielony' | 'zolty' | 'czerwony' | 'szary';
const TONY: Record<Ton, string> = {
  zielony: 'bg-emerald-50 dark:bg-emerald-950/40 ring-emerald-200 dark:ring-emerald-900 text-emerald-900 dark:text-emerald-100',
  zolty: 'bg-amber-50 dark:bg-amber-950/40 ring-amber-200 dark:ring-amber-900 text-amber-900 dark:text-amber-100',
  czerwony: 'bg-rose-50 dark:bg-rose-950/40 ring-rose-200 dark:ring-rose-900 text-rose-900 dark:text-rose-100',
  szary: 'bg-slate-50 dark:bg-slate-800/60 ring-slate-200 dark:ring-slate-700 text-slate-900 dark:text-slate-100'
};

/** Ramka z werdyktem (kolor = ocena) */
export function Werdykt({ ton, tytul, children }: { ton: Ton; tytul: string; children?: ReactNode }) {
  return (
    <div className={`rounded-2xl ring-1 p-5 ${TONY[ton]}`} role="status" aria-live="polite">
      <p className="text-lg font-extrabold">{tytul}</p>
      {children && <div className="mt-1.5 text-sm leading-6 opacity-90">{children}</div>}
    </div>
  );
}

/** Kafelek z liczbą wyniku */
export function Liczba({ etykieta, wartosc, opis, mocna }: { etykieta: string; wartosc: string; opis?: string; mocna?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${mocna ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800/60'}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${mocna ? 'opacity-70' : 'text-slate-500'}`}>{etykieta}</div>
      <div className={`text-2xl font-black mt-1 ${mocna ? '' : 'text-slate-900 dark:text-white'}`}>{wartosc}</div>
      {opis && <div className={`text-xs mt-1 ${mocna ? 'opacity-70' : 'text-slate-500'}`}>{opis}</div>}
    </div>
  );
}
