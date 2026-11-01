'use client';

import { useState } from 'react';
import mapa from '@/data/mapa-wojewodztw-etykiety.json';
import tlo from '@/data/cepik/tlo.json';
import { WojewodztwoStat } from '@/types/car-model';
import { fmt, sztuk } from '@/lib/format';
import { slugWojewodztwa } from '@/lib/wojewodztwa';

interface Props {
  dane: WojewodztwoStat[];
  nazwaModelu: string;
}

type Tryb = 'zaglebie' | 'liczba';

// Tryb „liczba”: 5 odcieni niebieskiego (więcej aut = ciemniej)
const KOLORY_LICZBA = [
  'fill-steel-100 dark:fill-steel-900',
  'fill-steel-200 dark:fill-steel-800',
  'fill-steel-300 dark:fill-steel-700',
  'fill-steel-500 dark:fill-steel-500',
  'fill-steel-700 dark:fill-steel-300'
];
const PROBKI_LICZBA = [
  'bg-steel-100 dark:bg-steel-900',
  'bg-steel-200 dark:bg-steel-800',
  'bg-steel-300 dark:bg-steel-700',
  'bg-steel-500 dark:bg-steel-500',
  'bg-steel-700 dark:bg-steel-300'
];

// Tryb „zagłębie”: niebieski = rzadziej niż średnio, szary = przeciętnie, pomarańczowy = częściej niż średnio
const PROGI_ZAGLEBIE = [
  { do: 0.8, opis: 'rzadziej niż średnio', fill: 'fill-steel-300 dark:fill-steel-700', bg: 'bg-steel-300 dark:bg-steel-700', ciemny: false },
  { do: 1.2, opis: 'przeciętnie (±20%)', fill: 'fill-slate-200 dark:fill-slate-700', bg: 'bg-slate-200 dark:bg-slate-700', ciemny: false },
  { do: 1.5, opis: '1,2–1,5× częściej', fill: 'fill-rust-200 dark:fill-rust-900', bg: 'bg-rust-200 dark:bg-rust-900', ciemny: false },
  { do: 2, opis: '1,5–2× częściej', fill: 'fill-rust-400 dark:fill-rust-700', bg: 'bg-rust-400 dark:bg-rust-700', ciemny: true },
  { do: Infinity, opis: 'ponad 2× częściej', fill: 'fill-rust-600 dark:fill-rust-500', bg: 'bg-rust-600 dark:bg-rust-500', ciemny: true }
];

const tloWoj = tlo.wojewodztwa as Record<string, number>;
const przecinek = (x: number, miejsca = 1) => x.toFixed(miejsca).replace('.', ',');

export default function PolandMap({ dane, nazwaModelu }: Props) {
  const [tryb, setTryb] = useState<Tryb>('zaglebie');

  const liczby = new Map(dane.map((d) => [d.teryt, d.liczba]));
  const suma = dane.reduce((s, d) => s + d.liczba, 0) || 1;
  const max = Math.max(1, ...dane.map((d) => d.liczba));

  // Wskaźnik: jaki udział mają te auta wśród wszystkich osobówek w województwie, w porównaniu ze średnią w Polsce
  const udzialPolska = suma / tlo.razem;
  const wiersze = mapa.regions.map((r) => {
    const n = liczby.get(r.teryt) ?? 0;
    const wszystkie = tloWoj[r.teryt] ?? 0;
    const indeks = wszystkie ? n / wszystkie / udzialPolska : 0;
    const coKtore = n ? Math.round(wszystkie / n) : 0;
    return { ...r, n, indeks, coKtore };
  });

  const krok = max / KOLORY_LICZBA.length;
  const klasaLiczba = (n: number) => Math.min(KOLORY_LICZBA.length - 1, Math.floor(n / krok));
  const klasaIndeks = (x: number) => PROGI_ZAGLEBIE.findIndex((p) => x < p.do);

  const ranking = [...wiersze].sort((a, b) => (tryb === 'liczba' ? b.n - a.n : b.indeks - a.indeks));
  const lider = [...wiersze].sort((a, b) => b.indeks - a.indeks)[0];
  const ostatni = [...wiersze].sort((a, b) => a.indeks - b.indeks)[0];
  const sredniaCoKtore = Math.round(tlo.razem / suma);

  const przycisk = (t: Tryb, etykieta: string) => (
    <button
      type="button"
      onClick={() => setTryb(t)}
      aria-pressed={tryb === t}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        tryb === t ? 'bg-steel-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {etykieta}
    </button>
  );

  return (
    <div className="space-y-4">
      {lider && lider.n > 0 && (
        <p className="text-base text-slate-700 dark:text-slate-300 bg-rust-50 dark:bg-slate-900 border border-rust-200 dark:border-rust-900 rounded-xl px-4 py-3">
          <strong className="text-rust-700 dark:text-rust-400">Zagłębie: {lider.nazwa.toLowerCase()}.</strong> Tu {nazwaModelu} to co {fmt(lider.coKtore)}. zarejestrowane auto osobowe – {przecinek(lider.indeks)}× częściej niż średnio w Polsce (co {fmt(sredniaCoKtore)}.).
          {ostatni && ostatni.indeks > 0 && ostatni.teryt !== lider.teryt && (
            <> Najrzadziej: {ostatni.nazwa.toLowerCase()} (co {fmt(ostatni.coKtore)}.).</>
          )}
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Co pokazuje mapa">
        {przycisk('zaglebie', 'Popularność względem średniej')}
        {przycisk('liczba', 'Liczba aut')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <figure className="lg:col-span-3">
          <svg
            viewBox={mapa.viewBox}
            className="w-full h-auto"
            role="img"
            aria-label={
              tryb === 'liczba'
                ? `Mapa Polski: liczba zarejestrowanych aut ${nazwaModelu} w województwach`
                : `Mapa Polski: jak często ${nazwaModelu} występuje w województwach w porównaniu ze średnią krajową`
            }
          >
            {wiersze.map((r) => {
              const fill = tryb === 'liczba' ? KOLORY_LICZBA[klasaLiczba(r.n)] : PROGI_ZAGLEBIE[klasaIndeks(r.indeks)].fill;
              return (
                // kształty województw są w jednym wspólnym pliku /mapa-wojewodztw.svg (pobieranym raz)
                <g key={r.teryt} className={`${fill} stroke-white dark:stroke-slate-950 hover:opacity-80 transition-opacity`}>
                  <title>{`${r.nazwa}: ${fmt(r.n)} ${sztuk(r.n)}${r.coKtore ? `, co ${fmt(r.coKtore)}. auto (${przecinek(r.indeks)}× średniej)` : ''}`}</title>
                  <use href={`/mapa-wojewodztw.svg#w${r.teryt}`} width="100%" height="100%" strokeWidth={1.2} strokeLinejoin="round" />
                </g>
              );
            })}
            {wiersze.map((r) => {
              const ciemne = tryb === 'liczba' ? klasaLiczba(r.n) >= 3 : PROGI_ZAGLEBIE[klasaIndeks(r.indeks)].ciemny;
              return (
                <text
                  key={`t-${r.teryt}`}
                  x={r.cx}
                  y={r.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[15px] font-bold pointer-events-none ${ciemne ? 'fill-white dark:fill-slate-950' : 'fill-slate-800 dark:fill-slate-100'}`}
                >
                  {tryb === 'liczba' ? fmt(r.n) : `${przecinek(r.indeks)}×`}
                </text>
              );
            })}
          </svg>

          <figcaption className="mt-3">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {tryb === 'liczba' ? 'Liczba zarejestrowanych sztuk' : 'Jak często występuje w porównaniu ze średnią w Polsce'}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {tryb === 'liczba'
                ? KOLORY_LICZBA.map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span className={`inline-block w-4 h-4 rounded-sm ${PROBKI_LICZBA[i]}`} aria-hidden="true" />
                      {fmt(Math.round(i * krok))}–{fmt(Math.round((i + 1) * krok))}
                    </div>
                  ))
                : PROGI_ZAGLEBIE.map((p) => (
                    <div key={p.opis} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span className={`inline-block w-4 h-4 rounded-sm ${p.bg}`} aria-hidden="true" />
                      {p.opis}
                    </div>
                  ))}
            </div>
            {tryb === 'zaglebie' && (
              <p className="text-xs text-slate-500 mt-2">
                „2× częściej” oznacza, że wśród wszystkich osobówek zarejestrowanych w województwie ten model ma dwa razy większy udział niż w całej Polsce.
              </p>
            )}
            <div className="text-[11px] text-slate-400 mt-2">{mapa.zrodlo}</div>
          </figcaption>
        </figure>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{tryb === 'liczba' ? 'Liczba aut w województwach' : 'Popularność w województwach względem średniej'}</caption>
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500">
              <tr>
                <th scope="col" className="text-left font-semibold px-2 py-2">#</th>
                <th scope="col" className="text-left font-semibold px-2 py-2">Województwo</th>
                <th scope="col" className="text-right font-semibold px-2 py-2">Sztuk</th>
                <th scope="col" className={`text-right font-semibold px-2 py-2 whitespace-nowrap ${tryb === 'zaglebie' ? 'hidden sm:table-cell lg:hidden' : ''}`}>{tryb === 'liczba' ? 'Udział' : 'Co które'}</th>
                {tryb === 'zaglebie' && <th scope="col" className="text-right font-semibold px-2 py-2 whitespace-nowrap">Wzgl. średniej</th>}
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.teryt} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-2 py-1.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-2 py-1.5 text-slate-800 dark:text-slate-200">
                    <a href={`/wojewodztwa/${slugWojewodztwa(r.teryt)}/`} className="hover:underline">
                      {r.nazwa}
                    </a>
                  </td>
                  <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{fmt(r.n)}</td>
                  <td className={`px-2 py-1.5 text-right text-slate-500 tabular-nums whitespace-nowrap ${tryb === 'zaglebie' ? 'hidden sm:table-cell lg:hidden' : ''}`}>
                    {tryb === 'liczba' ? `${przecinek((r.n / suma) * 100)}%` : r.coKtore ? `co ${fmt(r.coKtore)}.` : '—'}
                  </td>
                  {tryb === 'zaglebie' && (
                    <td className={`px-2 py-1.5 text-right tabular-nums font-semibold ${r.indeks >= 1.2 ? 'text-rust-600 dark:text-rust-400' : r.indeks < 0.8 ? 'text-steel-600 dark:text-steel-400' : 'text-slate-500'}`}>
                      {przecinek(r.indeks)}×
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
