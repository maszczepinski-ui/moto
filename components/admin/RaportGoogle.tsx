'use client';
// Panel → SEO → „Raport z Google (Search Console)”: ruch z wyszukiwarki i stan indeksowania najważniejszych kart.
// Dane pobiera serwer strony (konto techniczne Google) – nic nie trafia do firm trzecich.
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Search, TrendingDown, TrendingUp, ScanSearch } from 'lucide-react';
import { karta, przyciskD } from './wspolne';
import { Problem } from './MapaStrony';
import type { RaportWyszukiwania, StanIndeksu, WierszGsc } from '@/lib/search-console';

const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');
const proc = (n: number) => `${(n * 100).toLocaleString('pl-PL', { maximumFractionDigits: 1 })}%`;
const poz = (n: number) => n.toLocaleString('pl-PL', { maximumFractionDigits: 1 });
const data = (d: string) => new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

function Zmiana({ teraz, wczesniej, odwrotnie }: { teraz: number; wczesniej: number; odwrotnie?: boolean }) {
  if (!wczesniej) return null;
  const z = (teraz - wczesniej) / wczesniej;
  if (Math.abs(z) < 0.005) return <span className="text-xs text-slate-500">bez zmian</span>;
  const dobrze = odwrotnie ? z < 0 : z > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${dobrze ? 'text-emerald-600' : 'text-rose-600'}`}>
      {z > 0 ? <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />}
      {z > 0 ? '+' : ''}
      {Math.round(z * 100)}%
    </span>
  );
}

function Tabela({ tytul, opis, wiersze, nazwa }: { tytul: string; opis?: string; wiersze: WierszGsc[]; nazwa: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tytul}</h3>
      {opis && <p className="text-xs text-slate-500">{opis}</p>}
      {wiersze.length === 0 ? (
        <p className="text-xs text-slate-500">Brak danych w tym okresie.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-1.5 pr-2 font-semibold">{nazwa}</th>
                <th className="py-1.5 px-2 font-semibold text-right">Kliknięcia</th>
                <th className="py-1.5 px-2 font-semibold text-right">Wyświetlenia</th>
                <th className="py-1.5 pl-2 font-semibold text-right">Pozycja</th>
              </tr>
            </thead>
            <tbody>
              {wiersze.map((w) => (
                <tr key={w.klucz} className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="py-1.5 pr-2 text-slate-800 dark:text-slate-200 break-all">{w.klucz}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums font-semibold">{fmt(w.klikniecia)}</td>
                  <td className="py-1.5 px-2 text-right tabular-nums">{fmt(w.wyswietlenia)}</td>
                  <td className="py-1.5 pl-2 text-right tabular-nums">{poz(w.pozycja)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const WERDYKT: Record<string, { tekst: string; kolor: string }> = {
  PASS: { tekst: 'W indeksie', kolor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  PARTIAL: { tekst: 'W indeksie, z uwagami', kolor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  NEUTRAL: { tekst: 'Poza indeksem', kolor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  FAIL: { tekst: 'Błąd', kolor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
  BLAD: { tekst: 'Nie udało się sprawdzić', kolor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
};

export default function RaportGoogle({ token }: { token: string }) {
  const [dni, setDni] = useState(28);
  const [raport, setRaport] = useState<RaportWyszukiwania | null>(null);
  const [indeks, setIndeks] = useState<StanIndeksu[] | null>(null);
  const [blad, setBlad] = useState('');
  const [laduje, setLaduje] = useState(false);
  const [sprawdza, setSprawdza] = useState(false);

  const pobierz = useCallback(
    async (okres: number) => {
      setLaduje(true);
      setBlad('');
      try {
        const r = await fetch(`/api/search-console/?raport=ruch&dni=${okres}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const j = await r.json();
        if (j.blad) setBlad(j.blad);
        else setRaport(j);
      } catch {
        setBlad('Brak połączenia z serwerem strony.');
      } finally {
        setLaduje(false);
      }
    },
    [token]
  );

  useEffect(() => {
    pobierz(dni);
  }, [dni, pobierz]);

  async function sprawdzIndeks() {
    setSprawdza(true);
    try {
      const r = await fetch('/api/search-console/?raport=indeks', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const j = await r.json();
      if (j.blad) setBlad(j.blad);
      else setIndeks(j.strony);
    } catch {
      setBlad('Brak połączenia z serwerem strony.');
    } finally {
      setSprawdza(false);
    }
  }

  const maks = Math.max(1, ...(raport?.dni || []).map((d) => d.klikniecia));
  const wIndeksie = indeks?.filter((s) => s.werdykt === 'PASS' || s.werdykt === 'PARTIAL').length || 0;

  return (
    <section className={karta}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="flex-1 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Search className="w-5 h-5 text-steel-600" aria-hidden="true" /> Raport z Google (Search Console)
        </h2>
        <div className="flex gap-1">
          {[7, 28, 90].map((d) => (
            <button key={d} type="button" onClick={() => setDni(d)} aria-pressed={dni === d} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${dni === d ? 'bg-steel-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
              {d} dni
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Ile razy strona pojawiła się w wynikach Google i ile osób w nią kliknęło. Google podaje dane z ok. 3-dniowym opóźnieniem. Strzałki porównują z poprzednim okresem tej samej długości.
      </p>

      {blad && <Problem kod={blad} />}
      {laduje && !raport && <p className="text-sm text-slate-500">Pobieram dane z Google…</p>}

      {raport && (
        <>
          <p className="text-xs text-slate-500">
            Okres: {data(raport.od)} – {data(raport.do)}
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ['Kliknięcia', fmt(raport.suma.klikniecia), raport.suma.klikniecia, raport.poprzednio.klikniecia, false],
                ['Wyświetlenia', fmt(raport.suma.wyswietlenia), raport.suma.wyswietlenia, raport.poprzednio.wyswietlenia, false],
                ['Współczynnik kliknięć', proc(raport.suma.ctr), raport.suma.ctr, raport.poprzednio.ctr, false],
                ['Średnia pozycja', poz(raport.suma.pozycja), raport.suma.pozycja, raport.poprzednio.pozycja, true]
              ] as const
            ).map(([n, w, a, b, odw]) => (
              <div key={n} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                <dt className="text-xs text-slate-500">{n}</dt>
                <dd className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{w}</dd>
                <dd>
                  <Zmiana teraz={a} wczesniej={b} odwrotnie={odw} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-slate-500">Średnia pozycja: im mniejsza liczba, tym wyżej w Google (1–10 to pierwsza strona wyników).</p>

          {raport.dni.length > 1 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Kliknięcia dzień po dniu</h3>
              <div className="flex items-end gap-px h-24" role="img" aria-label="Wykres kliknięć dziennie">
                {raport.dni.map((d) => (
                  <div key={d.klucz} className="flex-1 bg-steel-500 dark:bg-steel-400 rounded-t-sm min-h-[2px]" style={{ height: `${(d.klikniecia / maks) * 100}%` }} title={`${data(d.klucz)}: ${fmt(d.klikniecia)} kliknięć, ${fmt(d.wyswietlenia)} wyświetleń`} />
                ))}
              </div>
            </div>
          )}

          <Tabela tytul="Frazy, na które pojawia się strona" wiersze={raport.frazy} nazwa="Fraza" />
          <Tabela tytul="Najczęściej klikane strony" wiersze={raport.strony} nazwa="Adres" />
          <Tabela
            tytul="Szanse: frazy tuż poza czołówką"
            opis="Frazy z wieloma wyświetleniami, na których strona jest na pozycjach 5–20. Poprawa tych stron (lepszy tytuł, więcej konkretów) najszybciej daje dodatkowe kliknięcia."
            wiersze={raport.szanse}
            nazwa="Fraza"
          />
        </>
      )}

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="flex-1 text-sm font-bold text-slate-900 dark:text-white">Czy najważniejsze karty są w Google?</h3>
          <button type="button" className={przyciskD} disabled={sprawdza} onClick={sprawdzIndeks}>
            {sprawdza ? <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ScanSearch className="w-4 h-4" aria-hidden="true" />}
            {sprawdza ? 'Sprawdzam… (ok. minuty)' : 'Sprawdź teraz'}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Sprawdza stronę główną i karty z „Plusami i minusami” tym samym narzędziem co „Sprawdź adres URL” w Search Console. Strony „poza indeksem” warto zgłosić przyciskiem „Poproś o zindeksowanie”.
        </p>
        {indeks && (
          <>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              W indeksie: {wIndeksie} z {indeks.length}
            </p>
            <ul className="space-y-1.5">
              {indeks.map((s) => {
                const w = WERDYKT[s.werdykt] || WERDYKT.BLAD;
                return (
                  <li key={s.adres} className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${w.kolor}`}>{w.tekst}</span>
                    <a href={s.adres} target="_blank" rel="noopener" className="text-steel-700 dark:text-steel-300 underline break-all">
                      {s.adres.replace(/^https:\/\/[^/]+/, '') || '/'}
                    </a>
                    <span className="text-slate-500">
                      {s.stan}
                      {s.ostatnieSkanowanie ? ` · ostatnio odwiedzona przez Google ${new Date(s.ostatnieSkanowanie).toLocaleDateString('pl-PL')}` : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
