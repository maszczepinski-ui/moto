'use client';
import { useState } from 'react';
import { RYZYKO_OPIS, wykryj, type Ryzyko } from '@/lib/narzedzia/slownik';
import { KARTA_NARZEDZIA, Werdykt } from '@/components/narzedzia/Pola';
import { sledz } from '@/lib/sledz';

const PRZYKLAD =
  'Sprzedam VW Passat B7 2.0 TDI, sprowadzony, opłacony, pierwszy właściciel w kraju. Bezwypadkowy, serwisowany w ASO, oryginalny przebieg 168 tys. km. Klima do nabicia, kontrolka do skasowania – czujnik do wymiany. Stan idealny, wsiadać i jeździć. Cena do negocjacji.';

const KOLOR: Record<Ryzyko, string> = {
  wysokie: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
  srednie: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  niskie: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
};

export default function DetektorOgloszen({ start = PRZYKLAD }: { start?: string }) {
  const [tekst, setTekst] = useState(start);
  const [wynik, setWynik] = useState(() => wykryj(start));
  const sprawdz = () => {
    const w = wykryj(tekst);
    setWynik(w);
    sledz('detektor_ogloszen', { trafien: w.length, wysokie: w.filter((x) => x.zwrot.ryzyko === 'wysokie').length });
  };
  const wysokie = wynik.filter((x) => x.zwrot.ryzyko === 'wysokie').length;
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-5`} aria-label="Detektor zwrotów w ogłoszeniu">
      <label htmlFor="det-tekst" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
        Wklej treść ogłoszenia
      </label>
      <textarea
        id="det-tekst"
        rows={6}
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-rust-500 focus:outline-none leading-6"
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={sprawdz} className="rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-3">
          Sprawdź ogłoszenie
        </button>
        <button type="button" onClick={() => setTekst('')} className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-5 py-3">
          Wyczyść
        </button>
      </div>
      <p className="text-xs text-slate-500">Tekst sprawdzamy w Twojej przeglądarce – nigdzie go nie wysyłamy.</p>
      {wynik.length === 0 ? (
        <Werdykt ton="szary" tytul="Nie znaleźliśmy zwrotów ze słownika">
          To nie znaczy, że ogłoszenie jest bez zarzutu. Zawsze sprawdź historię auta po VIN i zrób oględziny z diagnostyką.
        </Werdykt>
      ) : (
        <div className="space-y-4">
          <Werdykt ton={wysokie ? 'czerwony' : 'zolty'} tytul={`Znaleźliśmy ${wynik.length} ${wynik.length === 1 ? 'zwrot' : wynik.length < 5 ? 'zwroty' : 'zwrotów'} do sprawdzenia${wysokie ? `, w tym ${wysokie} wymagające szczególnej ostrożności` : ''}`} />
          <ul className="space-y-3">
            {wynik.map(({ zwrot: z, fragment }) => (
              <li key={z.slug} className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${KOLOR[z.ryzyko]}`}>{RYZYKO_OPIS[z.ryzyko]}</span>
                  <a href={`/slownik-ogloszen/${z.slug}/`} className="font-extrabold text-slate-900 dark:text-white hover:underline">
                    „{z.fraza}”
                  </a>
                </div>
                <p className="text-xs text-slate-500 italic">…{fragment}…</p>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{z.znaczenie}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Zapytaj:</strong> {z.zapytaj[0]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
