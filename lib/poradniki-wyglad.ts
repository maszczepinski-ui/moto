import type { KategoriaPoradnika } from '@/lib/poradniki';

// Kolory akcentu dla każdej kategorii
export const AKCENT: Record<KategoriaPoradnika, { tlo: string; etykieta: string; skrot: string; ikona: string; pasek: string }> = {
  ubezpieczenie: {
    tlo: 'from-slate-950 via-slate-900 to-indigo-900',
    etykieta: 'text-indigo-300',
    skrot: 'bg-indigo-50 ring-indigo-200 dark:bg-indigo-950/40 dark:ring-indigo-900',
    ikona: 'text-indigo-600 dark:text-indigo-400',
    pasek: 'bg-indigo-500'
  },
  eksploatacja: {
    tlo: 'from-slate-950 via-slate-900 to-teal-900',
    etykieta: 'text-teal-300',
    skrot: 'bg-teal-50 ring-teal-200 dark:bg-teal-950/40 dark:ring-teal-900',
    ikona: 'text-teal-600 dark:text-teal-400',
    pasek: 'bg-teal-500'
  },
  kupno: {
    tlo: 'from-slate-950 via-slate-900 to-sky-900',
    etykieta: 'text-sky-300',
    skrot: 'bg-sky-50 ring-sky-200 dark:bg-sky-950/40 dark:ring-sky-900',
    ikona: 'text-sky-600 dark:text-sky-400',
    pasek: 'bg-sky-500'
  },
  kolizja: {
    tlo: 'from-slate-950 via-slate-900 to-rust-900',
    etykieta: 'text-rust-300',
    skrot: 'bg-rust-50 ring-rust-200 dark:bg-rust-900/30 dark:ring-rust-900',
    ikona: 'text-rust-600 dark:text-rust-400',
    pasek: 'bg-rust-500'
  },
  sprawdzenie: {
    tlo: 'from-slate-950 via-slate-900 to-amber-900',
    etykieta: 'text-amber-300',
    skrot: 'bg-amber-50 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900',
    ikona: 'text-amber-600 dark:text-amber-400',
    pasek: 'bg-amber-500'
  },
  codzienne: {
    tlo: 'from-slate-950 via-slate-900 to-violet-900',
    etykieta: 'text-violet-300',
    skrot: 'bg-violet-50 ring-violet-200 dark:bg-violet-950/40 dark:ring-violet-900',
    ikona: 'text-violet-600 dark:text-violet-400',
    pasek: 'bg-violet-500'
  },
  bezpieczenstwo: {
    tlo: 'from-slate-950 via-slate-900 to-emerald-900',
    etykieta: 'text-emerald-300',
    skrot: 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900',
    ikona: 'text-emerald-600 dark:text-emerald-400',
    pasek: 'bg-emerald-500'
  }
};
