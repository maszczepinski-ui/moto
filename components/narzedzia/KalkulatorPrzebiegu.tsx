'use client';
import { useState } from 'react';
import { PALIWA_PRZEBIEGU, ocenPrzebieg, type PaliwoPrzebiegu } from '@/lib/narzedzia/przebieg';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Werdykt, Liczba } from '@/components/narzedzia/Pola';

const km = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} km`;

/** Skala od 0 do 2× typowego przebiegu ze strefami i znacznikiem przebiegu z ogłoszenia */
function Skala({ podany, typowy }: { podany: number; typowy: number }) {
  const maks = Math.max(typowy * 2, podany * 1.05, 1);
  const proc = (x: number) => `${Math.min(100, (x / maks) * 100)}%`;
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="relative h-5 text-[11px] text-slate-500">
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: proc(typowy) }}>
          typowo ▼
        </span>
      </div>
      <div className="relative">
        <div className="h-5 rounded-full overflow-hidden flex">
          <div className="bg-rose-400" style={{ width: proc(typowy * 0.5) }} />
          <div className="bg-amber-300" style={{ width: proc(typowy * 0.25) }} />
          <div className="bg-emerald-400" style={{ width: proc(typowy * 0.85) }} />
          <div className="bg-slate-300 dark:bg-slate-600 flex-1" />
        </div>
        <div className="absolute -top-1 h-7 w-1.5 rounded bg-slate-900 dark:bg-white -translate-x-1/2 ring-2 ring-white dark:ring-slate-900" style={{ left: proc(podany) }} />
      </div>
      <div className="relative h-5">
        <span className="absolute -translate-x-1/2 text-xs font-bold whitespace-nowrap text-slate-900 dark:text-white" style={{ left: `clamp(4.5rem, ${proc(podany)}, calc(100% - 4.5rem))` }}>
          ▲ ogłoszenie: {km(podany)}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>0 km</span>
        <span>{km(maks)}</span>
      </div>
    </div>
  );
}

export default function KalkulatorPrzebiegu({ rokTeraz, rok = 2014, paliwo = 'diesel', nazwaAuta }: { rokTeraz: number; rok?: number; paliwo?: PaliwoPrzebiegu; nazwaAuta?: string }) {
  const [rokProd, setRok] = useState(rok);
  const [pal, setPal] = useState<PaliwoPrzebiegu>(paliwo);
  const [przebieg, setPrzebieg] = useState(150000);
  const poprawne = rokProd >= 1950 && rokProd <= rokTeraz && przebieg > 0;
  const w = poprawne ? ocenPrzebieg(przebieg, rokProd, pal, rokTeraz) : null;
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator przebiegu">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PoleLiczby id="pb-rok" etykieta="Rok produkcji" wartosc={rokProd} ustaw={setRok} min={1950} max={rokTeraz} />
        <PoleWyboru id="pb-paliwo" etykieta="Paliwo" wartosc={pal} ustaw={setPal} opcje={PALIWA_PRZEBIEGU} />
        <PoleLiczby id="pb-km" etykieta="Przebieg z ogłoszenia" wartosc={przebieg} ustaw={setPrzebieg} krok={1000} jednostka="km" />
      </div>
      {w ? (
        <div className="space-y-6">
          <Werdykt ton={w.ton} tytul={w.tytul}>
            {w.opis}
          </Werdykt>
          <Skala podany={przebieg} typowy={w.typowy} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Liczba etykieta="Typowy przebieg" wartosc={km(w.typowy)} opis={`auto ${pal === 'lpg' ? 'z LPG' : PALIWA_PRZEBIEGU.find((p) => p.id === pal)?.nazwa.toLowerCase()} w wieku ok. ${Math.round(w.wiek)} lat`} mocna />
            <Liczba etykieta="Ogłoszenie vs typowy" wartosc={`${Math.round(w.stosunek * 100)}%`} opis="100% = dokładnie typowo" />
            <Liczba etykieta="Wychodzi rocznie" wartosc={km(w.kmRocznie)} opis="średnio od produkcji" />
            <Liczba etykieta="Wychodzi dziennie" wartosc={km(w.kmDziennie)} opis="średnio każdego dnia" />
          </div>
          <p className="text-xs text-slate-500">
            Wynik to statystyka, a nie diagnoza{nazwaAuta ? ` konkretnego egzemplarza ${nazwaAuta}` : ''}. Pewność daje dopiero historia przebiegu z badań technicznych, serwisów i baz zagranicznych.
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Wpisz rok produkcji (do {rokTeraz}) i przebieg większy od zera.</p>
      )}
    </section>
  );
}
