'use client';
// Kalkulator akcyzy i pełnych kosztów sprowadzenia auta – stawki i opłaty w lib/akcyza.ts
import { useEffect, useState } from 'react';
import { Calculator, Info, RefreshCw } from 'lucide-react';
import { NAPEDY, WALUTY, policzImport, type Naped, type Pozycja, type Waluta } from '@/lib/akcyza';
import { sledz } from '@/lib/sledz';

const pole =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const chip = (aktywny: boolean) =>
  `flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold border ${aktywny ? 'bg-steel-700 text-white border-steel-700' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`;
const zl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' zł';
const liczba = (t: string) => Number(t.replace(/\s/g, '').replace(',', '.')) || 0;

function Grupa({ tytul, pozycje }: { tytul: string; pozycje: Pozycja[] }) {
  if (!pozycje.length) return null;
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 mb-2">{tytul}</h3>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {pozycje.map((p) => (
          <li key={p.nazwa} className="flex items-start justify-between gap-4 py-2 text-sm">
            <span>
              <span className="text-slate-800 dark:text-slate-200">{p.nazwa}</span>
              {p.opis && <span className="block text-[11px] text-slate-500">{p.opis}</span>}
            </span>
            <span className="font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-white">{zl(p.kwota)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KalkulatorAkcyzy() {
  const [cena, setCena] = useState('');
  const [waluta, setWaluta] = useState<Waluta>('EUR');
  const [kurs, setKurs] = useState('4,25');
  const [kursInfo, setKursInfo] = useState('kurs przykładowy – wpisz własny albo pobierz z NBP');
  const [pojemnosc, setPojemnosc] = useState('1998');
  const [naped, setNaped] = useState<Naped>('spalinowy');
  const [lpg, setLpg] = useState(false);
  const [skad, setSkad] = useState<'ue' | 'spoza-ue'>('ue');
  const [usa, setUsa] = useState(false);
  const [transportDoUe, setTransportDoUe] = useState('');
  const [transportZl, setTransportZl] = useState('');
  const [tlumaczenia, setTlumaczenia] = useState('300');
  const [indywidualne, setIndywidualne] = useState(false);
  const [pobieram, setPobieram] = useState(false);

  async function pobierzKurs(w: Waluta) {
    if (w === 'PLN') return;
    setPobieram(true);
    try {
      const r = await fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${w.toLowerCase()}/?format=json`);
      const j = (await r.json()) as { rates: { mid: number; effectiveDate: string }[] };
      const k = j.rates[0];
      setKurs(String(k.mid).replace('.', ','));
      setKursInfo(`kurs średni NBP z ${k.effectiveDate.split('-').reverse().join('.')}`);
      sledz('akcyza_kurs_nbp', { waluta: w });
    } catch {
      setKursInfo('nie udało się pobrać kursu – wpisz go ręcznie');
    } finally {
      setPobieram(false);
    }
  }

  // aktualny kurs euro z NBP od razu po otwarciu strony
  useEffect(() => {
    pobierzKurs('EUR');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const c = liczba(cena);
  const wynik = c > 0
    ? policzImport({
        cena: c,
        waluta,
        kurs: liczba(kurs),
        pojemnosc: liczba(pojemnosc),
        naped,
        lpg,
        skad,
        produkcjaUsa: skad === 'spoza-ue' && usa,
        transportDoUe: skad === 'spoza-ue' ? liczba(transportDoUe) : 0,
        transportZl: liczba(transportZl),
        tlumaczenia: liczba(tlumaczenia),
        tabliceIndywidualne: indywidualne
      })
    : null;
  const elektryk = naped === 'bev' || naped === 'fcev';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] gap-6 items-start">
      <form className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className={etykieta}>Skąd sprowadzasz auto?</legend>
          <div className="flex gap-2">
            <button type="button" aria-pressed={skad === 'ue'} onClick={() => setSkad('ue')} className={chip(skad === 'ue')}>
              Z Unii Europejskiej
            </button>
            <button type="button" aria-pressed={skad === 'spoza-ue'} onClick={() => setSkad('spoza-ue')} className={chip(skad === 'spoza-ue')}>
              Spoza UE (np. USA)
            </button>
          </div>
        </fieldset>

        <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-2">
          <div>
            <label htmlFor="ak-cena" className={etykieta}>
              Cena z umowy lub faktury
            </label>
            <input id="ak-cena" inputMode="decimal" placeholder="np. 12 500" value={cena} onChange={(e) => setCena(e.target.value.replace(/[^\d\s,.]/g, ''))} className={`${pole} tabular-nums`} />
          </div>
          <div>
            <label htmlFor="ak-waluta" className={etykieta}>
              Waluta
            </label>
            <select
              id="ak-waluta"
              value={waluta}
              onChange={(e) => {
                const w = e.target.value as Waluta;
                setWaluta(w);
                pobierzKurs(w);
              }}
              className={pole}
            >
              {WALUTY.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {waluta !== 'PLN' && (
          <div>
            <label htmlFor="ak-kurs" className={etykieta}>
              Kurs {waluta}/PLN
            </label>
            <div className="flex gap-2">
              <input id="ak-kurs" inputMode="decimal" value={kurs} onChange={(e) => setKurs(e.target.value.replace(/[^\d,.]/g, ''))} className={`${pole} tabular-nums`} />
              <button type="button" onClick={() => pobierzKurs(waluta)} disabled={pobieram} className="inline-flex items-center gap-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold whitespace-nowrap disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${pobieram ? 'animate-spin' : ''}`} aria-hidden="true" /> NBP
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{kursInfo}</p>
          </div>
        )}

        <div>
          <label htmlFor="ak-naped" className={etykieta}>
            Napęd
          </label>
          <select id="ak-naped" value={naped} onChange={(e) => setNaped(e.target.value as Naped)} className={pole}>
            {NAPEDY.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nazwa}
              </option>
            ))}
          </select>
        </div>

        {!elektryk && (
          <div>
            <label htmlFor="ak-poj" className={etykieta}>
              Pojemność silnika (cm³)
            </label>
            <input id="ak-poj" inputMode="numeric" value={pojemnosc} onChange={(e) => setPojemnosc(e.target.value.replace(/\D/g, '').slice(0, 5))} className={`${pole} tabular-nums`} />
            <p className="text-[11px] text-slate-500 mt-1">Z dowodu rejestracyjnego (pole P.1). Progi: 2000 i 3500 cm³.</p>
          </div>
        )}

        {skad === 'spoza-ue' && (
          <>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={usa} onChange={(e) => setUsa(e.target.checked)} className="w-4 h-4 mt-0.5 accent-steel-600" />
              <span>
                Auto wyprodukowane w USA
                <span className="block text-[11px] text-slate-500">Od 1 lipca 2026 r. cło 0%. Kraj produkcji to pierwszy znak VIN (1, 4 lub 5 = USA).</span>
              </span>
            </label>
            <div>
              <label htmlFor="ak-tr-ue" className={etykieta}>
                Transport i ubezpieczenie do portu w UE ({waluta})
              </label>
              <input id="ak-tr-ue" inputMode="decimal" placeholder="np. 1500" value={transportDoUe} onChange={(e) => setTransportDoUe(e.target.value.replace(/[^\d\s,.]/g, ''))} className={`${pole} tabular-nums`} />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ak-tr" className={etykieta}>
              Transport do domu (zł)
            </label>
            <input id="ak-tr" inputMode="decimal" placeholder="opcjonalnie" value={transportZl} onChange={(e) => setTransportZl(e.target.value.replace(/[^\d\s,.]/g, ''))} className={`${pole} tabular-nums`} />
          </div>
          <div>
            <label htmlFor="ak-tl" className={etykieta}>
              Tłumaczenia (zł)
            </label>
            <input id="ak-tl" inputMode="decimal" value={tlumaczenia} onChange={(e) => setTlumaczenia(e.target.value.replace(/[^\d\s,.]/g, ''))} className={`${pole} tabular-nums`} />
          </div>
        </div>

        <div className="space-y-2">
          {!elektryk && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={lpg} onChange={(e) => setLpg(e.target.checked)} className="w-4 h-4 accent-steel-600" /> Auto ma instalację LPG
            </label>
          )}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={indywidualne} onChange={(e) => setIndywidualne(e.target.checked)} className="w-4 h-4 accent-steel-600" /> Chcę tablice indywidualne
          </label>
        </div>
      </form>

      <div className="space-y-5" aria-live="polite">
        {!wynik ? (
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex items-center gap-4">
            <Calculator className="w-10 h-10 text-rust-300 flex-shrink-0" aria-hidden="true" />
            <p className="text-lg">Wpisz cenę auta, a policzymy akcyzę i wszystkie opłaty do rejestracji.</p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8">
              <p className="text-sm text-slate-300">Koszty sprowadzenia i rejestracji (bez ceny auta)</p>
              <p className="mt-1 text-4xl sm:text-5xl font-black tabular-nums">{zl(wynik.sumaKosztow)}</p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Cena auta</p>
                  <p className="font-bold tabular-nums">{zl(wynik.cenaZl)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Akcyza</p>
                  <p className="font-bold tabular-nums">{zl(wynik.akcyza)}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-slate-400">Razem z autem</p>
                  <p className="font-bold tabular-nums text-emerald-300">{zl(wynik.razemZAutem)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-5">
              <Grupa tytul="Podatki" pozycje={wynik.podatki} />
              <Grupa tytul="Opłaty urzędowe" pozycje={wynik.urzedowe} />
              <Grupa tytul="Inne koszty" pozycje={wynik.inne} />
              <p className="text-xs text-slate-500">
                Podstawa akcyzy: {zl(wynik.podstawaAkcyzy)}
                {skad === 'spoza-ue' ? ' (wartość celna + cło)' : ' (cena z umowy przeliczona na złote)'}.
              </p>
            </div>

            {wynik.uwagi.length > 0 && (
              <ul className="space-y-2">
                {wynik.uwagi.map((u) => (
                  <li key={u} className="flex gap-2 rounded-2xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-200 dark:ring-sky-900 p-4 text-sm text-sky-950 dark:text-sky-100">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" /> {u}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
