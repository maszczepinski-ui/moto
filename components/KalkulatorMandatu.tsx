'use client';
import { useState } from 'react';
import { Gauge, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';
import { przedzialDla, zatrzymaniePrawaJazdy, TERENY, Teren, WYKROCZENIA, LIMIT_PUNKTOW, PREDKOSC } from '@/lib/mandaty';
import { TEKSTY_MANDATOW } from '@/lib/mandaty-teksty';
import type { Jezyk } from '@/lib/jezyki';
import { sledz } from '@/lib/sledz';

const pole =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const LIMITY = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 140];

/** Kalkulator mandatu za prędkość: ograniczenie + prędkość → kwota, punkty, ewentualne zatrzymanie prawa jazdy */
export function KalkulatorPredkosci({ start = 0, j = 'pl' }: { start?: number; j?: Jezyk }) {
  const t = TEKSTY_MANDATOW[j];
  const [limit, setLimit] = useState(50);
  const [predkosc, setPredkosc] = useState(start ? String(50 + start) : '');
  const [teren, setTeren] = useState<Teren>('zabudowany');
  const [recydywa, setRecydywa] = useState(false);
  const v = Number(predkosc) || 0;
  const przekroczenie = v ? v - limit : 0;
  const p = przedzialDla(przekroczenie);
  const kwota = p ? (recydywa && p.recydywa ? p.recydywa : p.kwota) : 0;
  const pj = zatrzymaniePrawaJazdy(przekroczenie, teren);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Gauge className="w-5 h-5 text-rust-600" aria-hidden="true" /> {t.predkosc.tytul}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="km-limit" className={etykieta}>
            {t.predkosc.ograniczenie}
          </label>
          <select id="km-limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className={pole}>
            {LIMITY.map((l) => (
              <option key={l} value={l}>
                {l} {j === 'uk' ? 'км/год' : 'km/h'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="km-v" className={etykieta}>
            {t.predkosc.twoja}
          </label>
          <input id="km-v" inputMode="numeric" value={predkosc} onChange={(e) => setPredkosc(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder={t.predkosc.przyklad} className={`${pole} tabular-nums`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="km-teren" className={etykieta}>
            {t.predkosc.gdzie}
          </label>
          <select id="km-teren" value={teren} onChange={(e) => setTeren(e.target.value as Teren)} className={pole}>
            {(Object.keys(TERENY) as Teren[]).map((x) => (
              <option key={x} value={x}>
                {t.tereny[x]}
              </option>
            ))}
          </select>
        </div>
        <label className="sm:col-span-2 inline-flex items-start gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={recydywa} onChange={(e) => setRecydywa(e.target.checked)} className="w-4 h-4 mt-0.5 accent-rust-600" />
          <span>{t.predkosc.recydywaPole}</span>
        </label>
      </div>

      <div className="rounded-2xl bg-slate-900 text-white p-5" aria-live="polite">
        {!v ? (
          <p className="text-slate-300">{t.predkosc.wpisz}</p>
        ) : !p ? (
          <p className="font-semibold text-emerald-300">{t.predkosc.brak}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300 font-semibold">{t.predkosc.przekroczenieO(przekroczenie, t.przedzial(p))}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400">{t.predkosc.mandat}</div>
                <div className="text-3xl font-extrabold tabular-nums">{t.zl(kwota)}</div>
                {recydywa && !p.recydywa && <div className="text-[11px] text-slate-400">{t.predkosc.recydywaUwaga}</div>}
              </div>
              <div>
                <div className="text-xs text-slate-400">{t.predkosc.punkty}</div>
                <div className="text-3xl font-extrabold tabular-nums">{p.punkty}</div>
              </div>
            </div>
            {pj && (
              <p className="flex items-start gap-2 bg-red-600/90 rounded-xl p-3 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                {t.predkosc.zatrzymanie}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Kalkulator punktów: dodaj wykroczenia i zobacz, ile zostało do limitu */
export function KalkulatorPunktow({ j = 'pl' }: { j?: Jezyk }) {
  const t = TEKSTY_MANDATOW[j];
  const [mlody, setMlody] = useState(false);
  const [mam, setMam] = useState('0');
  const [lista, setLista] = useState<Record<string, number>>({});
  const opcje = [
    ...PREDKOSC.map((p) => ({ id: `v-${p.slug}`, nazwa: t.punkty.predkoscNazwa(t.przedzial(p)), punkty: p.punkty })),
    ...WYKROCZENIA.map((w) => ({ id: w.id, nazwa: t.wykroczenia[w.id] || w.nazwa, punkty: w.punkty }))
  ];
  const nowe = opcje.reduce((s, o) => s + (lista[o.id] || 0) * o.punkty, 0);
  const suma = (Number(mam) || 0) + nowe;
  const limit = mlody ? LIMIT_PUNKTOW.mlody : LIMIT_PUNKTOW.doswiadczony;
  const zostalo = limit - suma;
  const zmien = (id: string, d: number) => {
    setLista((l) => ({ ...l, [id]: Math.max(0, (l[id] || 0) + d) }));
    sledz('punkty_kalkulator', { wykroczenie: id });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.punkty.tytul}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pk-mam" className={etykieta}>
            {t.punkty.masz}
          </label>
          <input id="pk-mam" inputMode="numeric" value={mam} onChange={(e) => setMam(e.target.value.replace(/\D/g, '').slice(0, 2))} className={`${pole} tabular-nums`} />
          <p className="text-[11px] text-slate-500 mt-1">
            {t.punkty.sprawdzPrzed}{' '}
            <a href="https://www.gov.pl/web/gov/sprawdz-swoje-punkty-karne" target="_blank" rel="noopener" className="underline">
              gov.pl
            </a>
            {t.punkty.sprawdzPo}
          </p>
        </div>
        <fieldset>
          <legend className={etykieta}>{t.punkty.prawoJazdy}</legend>
          <div className="flex gap-2">
            {[
              [false, t.punkty.dluzej],
              [true, t.punkty.krocej]
            ].map(([w, n]) => (
              <button
                key={String(w)}
                type="button"
                onClick={() => setMlody(w as boolean)}
                aria-pressed={mlody === w}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold border ${mlody === w ? 'bg-steel-600 text-white border-steel-600' : 'border-slate-300 dark:border-slate-700'}`}
              >
                {n as string}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
        {opcje.map((o) => (
          <li key={o.id} className="flex items-center gap-3 px-3 py-2 text-sm">
            <span className="flex-1 text-slate-700 dark:text-slate-300">{o.nazwa}</span>
            <span className="text-xs text-slate-500 w-12 text-right tabular-nums">{o.punkty} {t.punkty.pkt}</span>
            <span className="inline-flex items-center gap-1">
              <button type="button" onClick={() => zmien(o.id, -1)} className="p-1 rounded-lg border border-slate-300 dark:border-slate-700" aria-label={`${t.punkty.usun}: ${o.nazwa}`}>
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className="w-5 text-center font-bold tabular-nums">{lista[o.id] || 0}</span>
              <button type="button" onClick={() => zmien(o.id, 1)} className="p-1 rounded-lg border border-slate-300 dark:border-slate-700" aria-label={`${t.punkty.dodaj}: ${o.nazwa}`}>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className={`rounded-2xl p-5 text-white ${zostalo <= 0 ? 'bg-red-700' : zostalo <= 6 ? 'bg-amber-600' : 'bg-steel-700'}`} aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs opacity-80">{t.punkty.razem}</div>
            <div className="text-3xl font-extrabold tabular-nums">
              {suma} / {limit}
            </div>
          </div>
          <button type="button" onClick={() => { setLista({}); setMam('0'); }} className="inline-flex items-center gap-1 text-xs underline opacity-90">
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> {t.punkty.wyczysc}
          </button>
        </div>
        <div className="mt-3 flex gap-[2px]" role="img" aria-label={t.punkty.zLimitu(suma, limit)}>
          {Array.from({ length: limit }, (_, i) => (
            <span key={i} className={`flex-1 h-3 rounded-[2px] ${i < suma ? 'bg-white' : 'bg-white/25'}`} />
          ))}
        </div>
        <p className="text-sm mt-2">
          {zostalo > 0
            ? t.punkty.zostalo(zostalo)
            : mlody
              ? t.punkty.limitMlody
              : t.punkty.limitDoswiadczony}
        </p>
      </div>
      <p className="text-xs text-slate-500">{t.punkty.znikaja}</p>
    </div>
  );
}
