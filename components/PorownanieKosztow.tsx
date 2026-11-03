'use client';
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { domyslneSpalanie, cenaDla, jednostka, NAZWY_NAPEDU, RodzajNapedu } from '@/lib/paliwa';
import type { CenyPaliw } from '@/lib/panel';

// Porównanie rocznych kosztów paliwa dwóch modeli (na stronach „X czy Y?”). Każdą wartość można zmienić.

interface Auto {
  nazwa: string;
  naped: RodzajNapedu;
  pojemnosc: number;
}

const pole =
  'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-900 dark:text-white tabular-nums focus:ring-2 focus:ring-steel-500 focus:outline-none';
const zl = (n: number) => Math.round(n).toLocaleString('pl-PL') + ' zł';
const num = (v: string) => Math.max(0, Number(String(v).replace(',', '.')) || 0);
const KOLOR = ['var(--viz-1)', 'var(--viz-2)'];

export default function PorownanieKosztow({ a, b, ceny }: { a: Auto; b: Auto; ceny: CenyPaliw }) {
  const [przebieg, setPrzebieg] = useState(15000);
  const auta = [a, b];
  const [zuzycie, setZuzycie] = useState(auta.map((x) => String(domyslneSpalanie(x.naped, x.pojemnosc)).replace('.', ',')));
  const [cena, setCena] = useState(auta.map((x) => String(cenaDla(x.naped, ceny)).replace('.', ',')));
  const koszty = auta.map((_, i) => (przebieg / 100) * num(zuzycie[i]) * num(cena[i]));
  const max = Math.max(...koszty, 1);
  const tanszy = koszty[0] <= koszty[1] ? 0 : 1;
  const roznica = Math.abs(koszty[0] - koszty[1]);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Wallet className="w-5 h-5 text-rust-600" aria-hidden="true" /> Który tańszy w tankowaniu?
      </h2>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <label htmlFor="pk-przebieg" className="text-slate-700 dark:text-slate-300">
            Przejeżdżasz rocznie
          </label>
          <strong className="tabular-nums">{przebieg.toLocaleString('pl-PL')} km</strong>
        </div>
        <input id="pk-przebieg" type="range" min={3000} max={60000} step={1000} value={przebieg} onChange={(e) => setPrzebieg(Number(e.target.value))} className="w-full accent-rust-600" />
      </div>

      <div className="space-y-4">
        {auta.map((x, i) => {
          const j = jednostka(x.naped);
          return (
            <div key={x.nazwa} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-3 h-3 rounded-sm" style={{ background: KOLOR[i] }} aria-hidden="true" />
                  {x.nazwa} <span className="text-xs font-normal text-slate-500">({NAZWY_NAPEDU[x.naped].toLowerCase()})</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <label htmlFor={`pk-z-${i}`}>zużycie</label>
                  <input id={`pk-z-${i}`} inputMode="decimal" value={zuzycie[i]} onChange={(e) => setZuzycie((z) => z.map((v, k) => (k === i ? e.target.value : v)))} className={`${pole} w-16`} />
                  <span>{j.zuzycie}</span>
                  <label htmlFor={`pk-c-${i}`} className="ml-2">
                    cena
                  </label>
                  <input id={`pk-c-${i}`} inputMode="decimal" value={cena[i]} onChange={(e) => setCena((c) => c.map((v, k) => (k === i ? e.target.value : v)))} className={`${pole} w-16`} />
                  <span>{j.cena}</span>
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3" title={`${x.nazwa}: ${zl(koszty[i])} rocznie`}>
                <span className="h-4 rounded-r-[4px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <span className="block h-full rounded-r-[4px]" style={{ width: `${Math.max(2, (koszty[i] / max) * 100)}%`, background: KOLOR[i] }} />
                </span>
                <span className="tabular-nums font-extrabold text-slate-900 dark:text-white">
                  {zl(koszty[i])} <span className="text-xs font-normal text-slate-500">/ rok</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-sm" aria-live="polite">
        {roznica < 50 ? (
          <>Przy takim przebiegu oba auta kosztują w tankowaniu prawie tyle samo.</>
        ) : (
          <>
            <strong>{auta[tanszy].nazwa}</strong> jest tańszy w tankowaniu o <strong>{zl(roznica)} rocznie</strong> ({zl(roznica / 12)} miesięcznie).
          </>
        )}
      </p>
      <p className="text-xs text-slate-500">
        Zużycie to szacunek dla najczęstszej wersji silnikowej w Polsce – wpisz swoje. Ceny paliw z {new Date(ceny.data).toLocaleDateString('pl-PL')}. Pełne koszty (OC, serwis,
        opony) policzysz na karcie każdego modelu.
      </p>
    </section>
  );
}
