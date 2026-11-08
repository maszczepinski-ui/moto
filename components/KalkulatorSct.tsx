'use client';
// Kalkulator „Czy wjadę do strefy czystego transportu?” – dane i zasady w lib/sct.ts
import { useMemo, useState } from 'react';
import { CircleCheck, CircleX, Clock, Info, Ticket } from 'lucide-react';
import { MIASTA_SCT, NORMY_EURO, PALIWA, ROK_DO, ROK_OD, ocen, type DaneAuta, type IdZwolnienia, type NormaEuro, type Paliwo, type StanRoku, type WynikMiasta } from '@/lib/sct';
import { sledz } from '@/lib/sledz';

const pole =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const chip = (aktywny: boolean) =>
  `px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
    aktywny ? 'bg-steel-700 text-white border-steel-700' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400'
  }`;

const KOLOR: Record<StanRoku, string> = {
  'brak-strefy': 'bg-slate-200 dark:bg-slate-700',
  wjazd: 'bg-emerald-500',
  zwolnienie: 'bg-sky-500',
  oplata: 'bg-amber-400',
  zakaz: 'bg-rose-500'
};
const OPIS: Record<StanRoku, string> = {
  'brak-strefy': 'strefy jeszcze nie ma',
  wjazd: 'wjazd',
  zwolnienie: 'wjazd dzięki zwolnieniu',
  oplata: 'wjazd za opłatą',
  zakaz: 'zakaz wjazdu'
};

function Werdykt({ w }: { w: WynikMiasta }) {
  const v = w.werdykt;
  if (v.typ === 'brak-danych') return <p className="text-slate-500">Podaj rok produkcji albo normę Euro.</p>;
  const styl =
    v.typ === 'bez-ograniczen'
      ? { I: CircleCheck, kolor: 'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900', tekst: 'Wjedziesz bez ograniczeń' }
      : v.typ === 'do-roku'
        ? { I: Clock, kolor: 'bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900', tekst: `Wjedziesz do końca ${v.rok} r.` }
        : v.typ === 'oplata'
          ? { I: Ticket, kolor: 'bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900', tekst: `Wjazd tylko za opłatą – do końca ${v.doRoku} r.` }
          : { I: CircleX, kolor: 'bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900', tekst: 'Zakaz wjazdu' };
  return (
    <div className={`flex items-start gap-3 rounded-2xl ring-1 p-4 ${styl.kolor}`}>
      <styl.I className="w-7 h-7 flex-shrink-0" aria-hidden="true" />
      <div>
        <p className="text-xl font-black leading-tight">{styl.tekst}</p>
        <p className="mt-1 text-sm">{v.powod}</p>
      </div>
    </div>
  );
}

function OsCzasu({ w }: { w: WynikMiasta }) {
  return (
    <div>
      <ol className="grid grid-cols-11 gap-1" aria-label={`Oś czasu wjazdu do strefy – ${w.miasto.nazwa}`}>
        {w.lata.map((l) => (
          <li key={l.rok} className="flex flex-col items-center gap-1">
            <span className={`w-full h-7 rounded-md ${KOLOR[l.stan]}`} title={`${l.rok}: ${OPIS[l.stan]}`} aria-hidden="true" />
            <span className="text-[10px] sm:text-xs tabular-nums text-slate-500">
              <span className="sr-only">{`${l.rok}: ${OPIS[l.stan]}`}</span>
              <span aria-hidden="true">’{String(l.rok).slice(2)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function KalkulatorSct() {
  const [paliwo, setPaliwo] = useState<Paliwo>('benzyna');
  const [rocznik, setRocznik] = useState('');
  const [euro, setEuro] = useState<NormaEuro | ''>('');
  const [miasta, setMiasta] = useState<string[]>(MIASTA_SCT.map((m) => m.id));
  const [zwolnienia, setZwolnienia] = useState<IdZwolnienia[]>([]);
  const rokTeraz = new Date().getFullYear();

  const bezemisyjne = paliwo === 'elektryczny' || paliwo === 'wodor' || paliwo === 'cng';
  const r = Number(rocznik);
  const dane: DaneAuta = { paliwo, rocznik: r >= 1950 && r <= rokTeraz + 1 ? r : undefined, euro: euro || undefined, zwolnienia };
  const wybrane = MIASTA_SCT.filter((m) => miasta.includes(m.id));
  const wyniki = useMemo(() => wybrane.map((m) => ocen(dane, m, rokTeraz)), [JSON.stringify(dane), miasta.join(), rokTeraz]); // eslint-disable-line react-hooks/exhaustive-deps

  // zwolnienia z wybranych miast (bez powtórzeń po identyfikatorze)
  const dostepneZw = wybrane.flatMap((m) => m.zwolnienia.map((z) => ({ ...z, miasto: m.nazwa }))).filter((z, i, l) => l.findIndex((x) => x.id === z.id) === i);
  const przelaczZw = (id: IdZwolnienia) => setZwolnienia((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const przelaczMiasto = (id: string) => {
    setMiasta((l) => (l.includes(id) ? (l.length > 1 ? l.filter((x) => x !== id) : l) : [...l, id]));
    sledz('sct_miasto', { miasto: id });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-6 items-start">
      <form className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className={etykieta}>Rodzaj napędu</legend>
          <select value={paliwo} onChange={(e) => setPaliwo(e.target.value as Paliwo)} className={pole} aria-label="Rodzaj napędu">
            {PALIWA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nazwa}
              </option>
            ))}
          </select>
          {PALIWA.find((p) => p.id === paliwo)?.opis && <p className="text-[11px] text-slate-500 mt-1">{PALIWA.find((p) => p.id === paliwo)?.opis}</p>}
        </fieldset>

        {!bezemisyjne && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sct-rok" className={etykieta}>
                Rok produkcji
              </label>
              <input id="sct-rok" inputMode="numeric" placeholder="np. 2008" value={rocznik} onChange={(e) => setRocznik(e.target.value.replace(/\D/g, '').slice(0, 4))} className={`${pole} tabular-nums`} />
            </div>
            <div>
              <label htmlFor="sct-euro" className={etykieta}>
                Norma Euro
              </label>
              <select id="sct-euro" value={euro} onChange={(e) => setEuro(e.target.value as NormaEuro | '')} className={pole}>
                <option value="">nie wiem</option>
                {NORMY_EURO.map((n) => (
                  <option key={n} value={n}>
                    {n === 'Euro 6dT' ? 'Euro 6d-TEMP' : n}
                  </option>
                ))}
              </select>
            </div>
            <p className="col-span-2 text-[11px] text-slate-500">
              Wystarczy jedno z dwóch – rocznik albo norma. Normę Euro znajdziesz w dowodzie rejestracyjnym (pole V.9), w świadectwie zgodności (CoC) albo u dealera.
            </p>
          </div>
        )}

        <fieldset>
          <legend className={etykieta}>Miasto</legend>
          <div className="flex flex-wrap gap-2">
            {MIASTA_SCT.map((m) => (
              <button key={m.id} type="button" aria-pressed={miasta.includes(m.id)} onClick={() => przelaczMiasto(m.id)} className={chip(miasta.includes(m.id))}>
                {m.nazwa}
              </button>
            ))}
          </div>
        </fieldset>

        {!bezemisyjne && (
          <fieldset>
            <legend className={etykieta}>Zwolnienia (zaznacz, jeśli dotyczą Ciebie)</legend>
            <ul className="space-y-2">
              {dostepneZw.map((z) => (
                <li key={z.id}>
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={zwolnienia.includes(z.id)} onChange={() => przelaczZw(z.id)} className="w-4 h-4 mt-0.5 accent-steel-600" />
                    <span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{z.nazwa}</span>
                      <span className="block text-[11px] text-slate-500">{z.warunek}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}
      </form>

      <div className="space-y-5" aria-live="polite">
        {wyniki.map((w) => (
          <section key={w.miasto.id} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-4 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{w.miasto.nazwa}</h2>
              <span className="text-xs text-slate-500">strefa od {new Date(w.miasto.start + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })} r.</span>
            </div>
            <Werdykt w={w} />
            {w.werdykt.typ !== 'brak-danych' && <OsCzasu w={w} />}
            <details className="text-sm text-slate-600 dark:text-slate-400">
              <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-200">Wymagania w kolejnych latach</summary>
              <table className="mt-3 w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-1 pr-2 font-semibold">Od</th>
                    <th className="py-1 pr-2 font-semibold">Benzyna / LPG</th>
                    <th className="py-1 font-semibold">Diesel</th>
                  </tr>
                </thead>
                <tbody>
                  {w.miasto.etapy.map((e) => (
                    <tr key={e.od} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-1.5 pr-2 tabular-nums">{e.od.slice(0, 7).split('-').reverse().join('.')}</td>
                      <td className="py-1.5 pr-2">
                        {e.benzyna.euro} lub od {e.benzyna.rocznikOd} r.
                      </td>
                      <td className="py-1.5">
                        {e.diesel.euro === 'Euro 6dT' ? 'Euro 6d-TEMP' : e.diesel.euro} lub od {e.diesel.rocznikOd} r.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2">Obszar: {w.miasto.obszar}</p>
              {w.miasto.platnyWjazdOpis && <p className="mt-1">{w.miasto.platnyWjazdOpis}</p>}
              {w.miasto.uwagaKoniec && <p className="mt-1">{w.miasto.uwagaKoniec}</p>}
              <p className="mt-1">Kara za wjazd bez uprawnień: {w.miasto.kara}.</p>
              <a href={w.miasto.zrodlo.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block underline">
                Źródło: {w.miasto.zrodlo.n}
              </a>
            </details>
          </section>
        ))}

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400" aria-hidden="true">
          {(['wjazd', 'zwolnienie', 'oplata', 'zakaz', 'brak-strefy'] as StanRoku[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${KOLOR[s]}`} /> {OPIS[s]}
            </span>
          ))}
        </div>
        <p className="flex gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Wynik jest orientacyjny – oś czasu obejmuje lata {ROK_OD}–{ROK_DO}. Wiążące są uchwały miast i dane auta w CEPiK. Oficjalnie sprawdzisz auto w miejskich wyszukiwarkach SCT.
        </p>
      </div>
    </div>
  );
}
