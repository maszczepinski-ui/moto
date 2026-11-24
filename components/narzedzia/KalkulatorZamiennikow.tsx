'use client';
import { useState } from 'react';
import { POPULARNE, nazwaOpony, slugOpony, srednicaKola, wysokoscBoku, zamienniki, type Opona } from '@/lib/narzedzia/felgi';
import { KARTA_NARZEDZIA, PoleLiczby, Przelacznik, Liczba } from '@/components/narzedzia/Pola';

const maStrone = (o: Opona) => POPULARNE.some((p) => p.szer === o.szer && p.profil === o.profil && p.felga === o.felga);

export default function KalkulatorZamiennikow({ start = { szer: 205, profil: 55, felga: 16 } }: { start?: Opona }) {
  const [o, setO] = useState<Opona>(start);
  const [tol, setTol] = useState<'2' | '3'>('2');
  const lista = o.szer > 100 && o.profil >= 20 && o.felga >= 10 ? zamienniki(o, Number(tol), 40) : [];
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator zamienników opon">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <PoleLiczby id="zo-s" etykieta="Szerokość" wartosc={o.szer} ustaw={(v) => setO({ ...o, szer: v })} krok={10} jednostka="mm" />
        <PoleLiczby id="zo-p" etykieta="Profil" wartosc={o.profil} ustaw={(v) => setO({ ...o, profil: v })} krok={5} jednostka="%" />
        <PoleLiczby id="zo-f" etykieta="Średnica felgi" wartosc={o.felga} ustaw={(v) => setO({ ...o, felga: v })} jednostka="cali" />
        <Przelacznik etykieta="Tolerancja średnicy" wartosc={tol} ustaw={setTol} opcje={[{ id: '2', nazwa: '±2%' }, { id: '3', nazwa: '±3%' }]} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Liczba etykieta="Średnica koła" wartosc={`${Math.round(srednicaKola(o))} mm`} mocna />
        <Liczba etykieta="Wysokość boku" wartosc={`${Math.round(wysokoscBoku(o))} mm`} />
        <Liczba etykieta="Zamienników" wartosc={`${lista.length}`} opis={`w tolerancji ±${tol}%`} />
      </div>
      {lista.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['Rozmiar', 'Różnica średnicy', 'Licznik 100 km/h = ', 'Felga'].map((h) => (
                  <th key={h} scope="col" className="text-left font-bold text-slate-700 dark:text-slate-200 px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lista.map((z) => {
                const a = Math.abs(z.roznicaProc);
                return (
                  <tr key={nazwaOpony(z.opona)}>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {maStrone(z.opona) ? (
                        <a href={`/zamiennik-opon/${slugOpony(z.opona)}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                          {nazwaOpony(z.opona)}
                        </a>
                      ) : (
                        nazwaOpony(z.opona)
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${a <= 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : a <= 2 ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'}`}>
                        {z.roznicaProc > 0 ? '+' : ''}
                        {z.roznicaProc.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}% ({z.roznicaMm > 0 ? '+' : ''}
                        {Math.round(z.roznicaMm)} mm)
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{z.przy100.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km/h</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{z.opona.felga === o.felga ? 'ta sama' : `${z.opona.felga > o.felga ? '+' : ''}${z.opona.felga - o.felga}″`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Wpisz poprawny rozmiar opony, np. 205/55 R16.</p>
      )}
      <p className="text-xs text-slate-500">Zamiennik musi też pasować do nadkola i mieć indeks nośności oraz prędkości nie niższy niż w dowodzie rejestracyjnym lub instrukcji. Szerszą oponę sprawdź w kalkulatorze felg i ET.</p>
    </section>
  );
}
