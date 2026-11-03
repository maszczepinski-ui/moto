import type { ReactNode } from 'react';
import ZdjecieTla from '@/components/ZdjecieTla';
import type { KluczZdjecia } from '@/config/zdjecia';

// Nagłówek działu ze zdjęciem w tle (koszt trasy, ładowarki, mandaty…)
export default function NaglowekDzialu({ zdjecie, nadtytul, tytul, opis, children }: { zdjecie: KluczZdjecia; nadtytul: string; tytul: string; opis: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-steel-800 to-slate-900 text-white">
      <ZdjecieTla klucz={zdjecie} priorytet className="opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" aria-hidden="true" />
      <div className="relative px-6 py-10 sm:px-10 sm:py-14 max-w-2xl space-y-3">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-rust-300">{nadtytul}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{tytul}</h1>
        <p className="text-slate-200 leading-relaxed">{opis}</p>
        {children}
      </div>
    </section>
  );
}
