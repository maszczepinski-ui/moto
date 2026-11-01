'use client';
import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

// Kalkulator kosztów utrzymania (TCO). Wszystkie wartości startowe to szacunki dla typowego egzemplarza
// – każdą można zmienić. Liczymy: paliwo, OC, wymiany eksploatacyjne, hamulce, opony i przegląd.

export type RodzajNapedu = 'benzyna' | 'diesel' | 'lpg' | 'hybryda' | 'elektryczny';

interface Props {
  nazwa: string;
  naped: RodzajNapedu;
  /** typowa pojemność w litrach, np. 1.9 */
  pojemnosc: number;
  premium: boolean;
}

const zl = (n: number, m = 0) => n.toLocaleString('pl-PL', { minimumFractionDigits: m, maximumFractionDigits: m }) + ' zł';

function domyslneSpalanie(naped: RodzajNapedu, poj: number) {
  const p = poj || 1.6;
  if (naped === 'elektryczny') return 17;
  if (naped === 'hybryda') return Math.round((3.6 + p * 1.0) * 10) / 10;
  if (naped === 'diesel') return Math.round((3.4 + p * 1.6) * 10) / 10;
  const benz = 5 + p * 2.1;
  return Math.round((naped === 'lpg' ? benz * 1.2 : benz) * 10) / 10;
}

const CENY: Record<RodzajNapedu, number> = { benzyna: 6.2, diesel: 6.3, lpg: 3.1, hybryda: 6.2, elektryczny: 1.0 };

function Suwak(p: { id: string; label: string; min: number; max: number; krok: number; wartosc: number; onChange: (v: number) => void; jednostka: string; miejsca?: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <label htmlFor={p.id} className="text-slate-700 dark:text-slate-300">
          {p.label}
        </label>
        <strong className="tabular-nums text-slate-900 dark:text-white">
          {p.wartosc.toLocaleString('pl-PL', { minimumFractionDigits: p.miejsca ?? 0, maximumFractionDigits: p.miejsca ?? 0 })} {p.jednostka}
        </strong>
      </div>
      <input id={p.id} type="range" min={p.min} max={p.max} step={p.krok} value={p.wartosc} onChange={(e) => p.onChange(Number(e.target.value))} className="w-full accent-rust-600" />
    </div>
  );
}

function Liczba(p: { id: string; label: string; wartosc: number; onChange: (v: number) => void; jednostka: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <label htmlFor={p.id} className="text-slate-700 dark:text-slate-300">
        {p.label}
      </label>
      <span className="flex items-center gap-1">
        <input
          id={p.id}
          type="number"
          min={0}
          inputMode="decimal"
          value={p.wartosc}
          onChange={(e) => p.onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 text-right bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 tabular-nums"
        />
        <span className="text-slate-500 w-10">{p.jednostka}</span>
      </span>
    </div>
  );
}

export default function KalkulatorTCO({ nazwa, naped, pojemnosc, premium }: Props) {
  const ev = naped === 'elektryczny';
  const [przebieg, setPrzebieg] = useState(15000);
  const [cena, setCena] = useState(CENY[naped]);
  const [spalanie, setSpalanie] = useState(domyslneSpalanie(naped, pojemnosc));
  const [oc, setOc] = useState(pojemnosc > 2 ? 1200 : pojemnosc > 1.4 ? 900 : 700);
  const [serwis, setSerwis] = useState(ev ? 300 : premium ? 550 : 380);
  const [opony, setOpony] = useState(premium || pojemnosc > 2 ? 2400 : 1600);

  const w = useMemo(() => {
    const paliwo = (przebieg / 100) * spalanie * cena;
    const olej = ev ? serwis : Math.max(1, przebieg / 15000) * serwis; // EV: przegląd raz w roku
    const hamulce = (przebieg / (ev || naped === 'hybryda' ? 70000 : 40000)) * (premium ? 900 : 600);
    const opon = (przebieg / 45000) * opony + 2 * 100; // zużycie kompletu + dwie sezonowe zmiany
    const przeglad = naped === 'lpg' ? 162 : 99;
    const pozycje = [
      { nazwa: ev ? 'Prąd' : 'Paliwo', kwota: paliwo },
      { nazwa: 'OC', kwota: oc },
      { nazwa: ev ? 'Przegląd serwisowy' : 'Wymiana oleju i filtrów', kwota: olej },
      { nazwa: 'Klocki i tarcze', kwota: hamulce },
      { nazwa: 'Opony i ich wymiana', kwota: opon },
      { nazwa: 'Przegląd techniczny', kwota: przeglad }
    ];
    const rok = pozycje.reduce((s, p) => s + p.kwota, 0);
    return { pozycje, rok, miesiac: rok / 12, km: przebieg ? rok / przebieg : 0 };
  }, [przebieg, spalanie, cena, oc, serwis, opony, ev, naped, premium]);

  const max = Math.max(...w.pozycje.map((p) => p.kwota), 1);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5" aria-labelledby="tco-tytul">
      <h2 id="tco-tytul" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
        <Calculator className="w-6 h-6 text-rust-600" aria-hidden="true" /> Ile kosztuje utrzymanie {nazwa}?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Suwak id="tco-km" label="Roczny przebieg" min={2000} max={60000} krok={1000} wartosc={przebieg} onChange={setPrzebieg} jednostka="km" />
          <Suwak
            id="tco-cena"
            label={ev ? 'Cena prądu' : naped === 'lpg' ? 'Cena LPG' : naped === 'diesel' ? 'Cena oleju napędowego' : 'Cena benzyny'}
            min={ev ? 0.3 : 2}
            max={ev ? 3 : 9}
            krok={0.05}
            wartosc={cena}
            onChange={setCena}
            jednostka={ev ? 'zł/kWh' : 'zł/l'}
            miejsca={2}
          />
          <Suwak id="tco-spal" label="Średnie zużycie" min={ev ? 10 : 3} max={ev ? 30 : 20} krok={0.1} wartosc={spalanie} onChange={setSpalanie} jednostka={ev ? 'kWh/100 km' : 'l/100 km'} miejsca={1} />
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Liczba id="tco-oc" label="OC rocznie" wartosc={oc} onChange={setOc} jednostka="zł" />
            <Liczba id="tco-serwis" label={ev ? 'Przegląd serwisowy' : 'Serwis olejowy (co 15 tys. km)'} wartosc={serwis} onChange={setSerwis} jednostka="zł" />
            <Liczba id="tco-opony" label="Komplet opon" wartosc={opony} onChange={setOpony} jednostka="zł" />
          </div>
        </div>
        <div className="space-y-4">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['1 km', zl(w.km, 2)],
              ['Miesiąc', zl(w.miesiac)],
              ['Rok', zl(w.rok)]
            ].map(([k, v]) => (
              <div key={k} className="bg-steel-700 text-white rounded-xl p-3">
                <dt className="text-xs text-steel-100">{k}</dt>
                <dd className="text-lg sm:text-xl font-black tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="space-y-2" aria-label="Rozbicie kosztów rocznych">
            {w.pozycje.map((p) => (
              <li key={p.nazwa}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{p.nazwa}</span>
                  <span className="tabular-nums text-slate-900 dark:text-white font-semibold">{zl(p.kwota)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-rust-500" style={{ width: `${(p.kwota / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Wartości startowe to szacunki dla typowego egzemplarza (najczęstsza pojemność i paliwo tego modelu) – ustaw własne. Nie liczymy utraty wartości, napraw awaryjnych, AC ani parkowania.
        Cena OC zależy głównie od kierowcy – sprawdź ją w porównywarce.
      </p>
    </section>
  );
}
