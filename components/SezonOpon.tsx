'use client';
import { useEffect, useState } from 'react';
import { Snowflake, Sun, CheckCircle2 } from 'lucide-react';
import { sezonWymiany, Sezon } from '@/lib/opony';

// Plakietka „teraz jest sezon na…” – liczona w przeglądarce, więc zawsze aktualna.
export default function SezonOpon({ jasny = false }: { jasny?: boolean }) {
  const [s, setS] = useState<Sezon | null | undefined>(undefined);
  useEffect(() => setS(sezonWymiany()), []);
  if (s === undefined) return <span className="inline-block h-7" aria-hidden="true" />;
  const I = s === 'zimowe' ? Snowflake : s === 'letnie' ? Sun : CheckCircle2;
  const tekst = s === 'zimowe' ? 'Teraz: czas na opony zimowe' : s === 'letnie' ? 'Teraz: czas na opony letnie' : 'Teraz: sezon bez zmian – sprawdź bieżnik i ciśnienie';
  const kolor = s === 'zimowe' ? 'bg-sky-500/15 text-sky-200 ring-sky-400/40' : s === 'letnie' ? 'bg-amber-500/15 text-amber-200 ring-amber-400/40' : 'bg-white/10 text-white/80 ring-white/20';
  const kolorJasny = s === 'zimowe' ? 'bg-sky-100 text-sky-900 ring-sky-300' : s === 'letnie' ? 'bg-amber-100 text-amber-900 ring-amber-300' : 'bg-slate-100 text-slate-700 ring-slate-300';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full ring-1 px-3 py-1 text-xs font-bold ${jasny ? kolorJasny : kolor}`}>
      <I className="w-3.5 h-3.5" aria-hidden="true" /> {tekst}
    </span>
  );
}
