'use client';
// Zakładka „Aktualizacje” panelu admina:
// 1) przycisk uruchamiający automat na GitHubie, który dociąga nowe dane z CEPiK i przelicza stronę,
// 2) formularz dopisania nowych statystyk rynku nowych aut (Samar / PZPM) do data/rynek-nowych.json.
import { useEffect, useState } from 'react';
import { RefreshCw, Play, Plus, Trash2, ExternalLink, Database, TrendingUp } from 'lucide-react';

export type Api = (sciezka: string, metoda?: 'GET' | 'POST' | 'PUT', body?: object) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const WORKFLOW = 'aktualizuj-dane.yml';
const PLIK_RYNEK = 'data/rynek-nowych.json';
const input =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const karta = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4';

type Przebieg = { id: number; status: string; conclusion: string | null; created_at: string; html_url: string; event: string };
type Okres = { id: string; tytul: string; razem: number; zmianaRdR: number; marki: [string, number][]; modele: [string, number][]; chinskie: [string, number][]; udzialChinskich: string; zrodlo: string; url: string };
type Rynek = { opis: string; okresy: Okres[]; fakty: unknown[] };

function b64(t: string) {
  const b = new TextEncoder().encode(t);
  let s = '';
  b.forEach((x) => (s += String.fromCharCode(x)));
  return btoa(s);
}
const z64 = (b: string) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\n/g, '')), (c) => c.charCodeAt(0)));

/** „Toyota; 37 111” (jedna pozycja na linię) → [["Toyota", 37111], …] */
function lista(t: string): [string, number][] {
  return t
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(.*?)[;\t,:]\s*([\d\s ]+)$/);
      return m ? ([m[1].trim(), Number(m[2].replace(/\D/g, ''))] as [string, number]) : null;
    })
    .filter((x): x is [string, number] => !!x && !!x[0] && x[1] > 0);
}

const OPIS_STATUSU: Record<string, string> = { queued: 'w kolejce', in_progress: 'trwa', completed: 'zakończona', waiting: 'czeka', requested: 'zlecona', pending: 'czeka' };

export default function Aktualizacje({ api, branch, stanDanych }: { api: Api; branch: string; stanDanych: string }) {
  const [przebiegi, setPrzebiegi] = useState<Przebieg[] | null>(null);
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);
  const [zakres, setZakres] = useState<{ ostatniDzien: string; pierwszyDzien?: string } | null>(null);
  const [rynek, setRynek] = useState<{ dane: Rynek; sha: string } | null>(null);
  const [nowy, setNowy] = useState({ tytul: '', razem: '', zmiana: '', marki: '', modele: '', chinskie: '', udzial: '', zrodlo: 'IBRM Samar', url: '' });

  async function odswiez() {
    try {
      const j = await api(`/actions/workflows/${WORKFLOW}/runs?per_page=5&branch=${branch}`);
      setPrzebiegi(j.workflow_runs || []);
    } catch (e) {
      setPrzebiegi([]);
      setKom({ ok: false, tekst: `Nie mogę odczytać aktualizacji: ${(e as Error).message} Sprawdź, czy token ma uprawnienie „Actions: Read and write” (instrukcja w README).` });
    }
  }
  async function wczytajZakres() {
    try {
      const j = await api(`/contents/data/cepik/nowe-stan.json?ref=${branch}`);
      setZakres(JSON.parse(z64(j.content)));
    } catch {
      setZakres(null);
    }
  }
  async function wczytajRynek() {
    try {
      const j = await api(`/contents/${PLIK_RYNEK}?ref=${branch}`);
      setRynek({ dane: JSON.parse(z64(j.content)), sha: j.sha });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie mogę wczytać statystyk rynku: ${(e as Error).message}` });
    }
  }
  useEffect(() => {
    odswiez();
    wczytajZakres();
    wczytajRynek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uruchom() {
    setPraca(true);
    setKom(null);
    try {
      await api(`/actions/workflows/${WORKFLOW}/dispatches`, 'POST', { ref: branch });
      setKom({ ok: true, tekst: 'Aktualizacja uruchomiona. Zwykle trwa od kilkunastu minut do ok. 5 godzin (zależy od tego, ile dni trzeba dociągnąć). Po zakończeniu strona sama się opublikuje.' });
      setTimeout(odswiez, 4000);
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się uruchomić: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function zapiszRynek(dane: Rynek, opis: string) {
    if (!rynek) return;
    setPraca(true);
    try {
      const j = await api(`/contents/${PLIK_RYNEK}`, 'PUT', { message: opis, content: b64(JSON.stringify(dane, null, 2) + '\n'), sha: rynek.sha, branch });
      setRynek({ dane, sha: j.content.sha });
      setKom({ ok: true, tekst: 'Zapisano statystyki rynku. Strona zaktualizuje się za kilka minut.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się zapisać: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  function dodajOkres() {
    if (!rynek) return;
    const okres: Okres = {
      id: `${Date.now()}`,
      tytul: nowy.tytul.trim(),
      razem: Number(nowy.razem.replace(/\D/g, '')),
      zmianaRdR: Number(nowy.zmiana.replace(',', '.').replace(/[^\d.-]/g, '')) || 0,
      marki: lista(nowy.marki),
      modele: lista(nowy.modele),
      chinskie: lista(nowy.chinskie),
      udzialChinskich: nowy.udzial.trim(),
      zrodlo: nowy.zrodlo.trim(),
      url: nowy.url.trim()
    };
    if (!okres.tytul || !okres.razem || !okres.marki.length || !/^https:\/\//.test(okres.url)) {
      setKom({ ok: false, tekst: 'Uzupełnij co najmniej: okres, liczbę aut, marki i link do źródła (https://…).' });
      return;
    }
    zapiszRynek({ ...rynek.dane, okresy: [okres, ...rynek.dane.okresy] }, `Panel admina: statystyki rynku – ${okres.tytul}`);
    setNowy({ ...nowy, tytul: '', razem: '', zmiana: '', marki: '', modele: '', chinskie: '', udzial: '', url: '' });
  }

  const trwa = przebiegi?.some((p) => p.status !== 'completed');

  return (
    <>
      {kom && <div role="status" className={`rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'}`}>{kom.tekst}</div>}

      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Database className="w-5 h-5 text-steel-600" aria-hidden="true" /> Dane z CEPiK
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Dane na stronie: stan na <strong>{stanDanych}</strong>. Aktualizacja dociąga z państwowego serwisu CEPiK auta zarejestrowane po tej dacie (bez ostatniego tygodnia, który CEPiK
          jeszcze uzupełnia), przelicza wszystkie karty i publikuje stronę. Dzieje się to też samo 3. dnia każdego miesiąca.
        </p>
        {zakres && (() => {
          const POCZ = '2019-11-09', pl = (d: string) => d.split('-').reverse().join('.');
          const pierwszy = zakres.pierwszyDzien || POCZ;
          const dni = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5) + 1;
          const wszystkie = dni(POCZ, zakres.ostatniDzien), mamy = dni(pierwszy, zakres.ostatniDzien);
          const proc = Math.min(100, Math.round((mamy / wszystkie) * 100));
          return (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Pobrane rejestracje: {pl(pierwszy)} – {pl(zakres.ostatniDzien)}</span>
                <strong>{proc}%</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${proc}%` }} />
              </div>
              {pierwszy > POCZ && (
                <p className="text-xs text-slate-500">
                  Brakuje jeszcze okresu {pl(POCZ)} – {pl(pierwszy)}. Automat uzupełnia go sam, kawałkami po ok. 5 godzin, i po każdym kawałku uruchamia się ponownie – nic nie musisz klikać.
                  Jeśli żadna aktualizacja nie jest „w toku”, kliknij „Aktualizuj dane teraz”, żeby wznowić.
                </p>
              )}
            </div>
          );
        })()}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={uruchom} disabled={praca || trwa} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg">
            <Play className="w-4 h-4" aria-hidden="true" /> {trwa ? 'Aktualizacja w toku…' : 'Aktualizuj dane teraz'}
          </button>
          <button type="button" onClick={() => { odswiez(); wczytajZakres(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800">
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Odśwież status
          </button>
        </div>
        {przebiegi && przebiegi.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {przebiegi.map((p) => (
              <li key={p.id} className="py-2 flex items-center justify-between gap-2">
                <span>
                  {new Date(p.created_at).toLocaleString('pl-PL')} • {p.event === 'schedule' ? 'automatyczna' : 'ręczna'} •{' '}
                  <strong className={p.conclusion === 'failure' ? 'text-rose-600' : p.conclusion === 'success' ? 'text-emerald-600' : ''}>
                    {p.conclusion === 'success' ? 'udana' : p.conclusion === 'failure' ? 'nieudana' : OPIS_STATUSU[p.status] || p.status}
                  </strong>
                </span>
                <a href={p.html_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs underline">
                  szczegóły <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {przebiegi && przebiegi.length === 0 && <p className="text-xs text-slate-500">Nie było jeszcze żadnej aktualizacji.</p>}
      </section>

      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <TrendingUp className="w-5 h-5 text-rust-600" aria-hidden="true" /> Rynek nowych aut (Samar / PZPM)
        </h2>
        <p className="text-xs text-slate-500">
          Samar i PZPM publikują statystyki w raportach PDF i komunikatach – przepisz z nich najważniejsze liczby. Wklejaj po jednej pozycji w linii, np. <code>Toyota; 37111</code>. Zawsze
          podaj link do źródła.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-3">
            <label className={etykieta} htmlFor="r-t">Okres (np. „Styczeń–październik 2026”)</label>
            <input id="r-t" className={input} value={nowy.tytul} onChange={(e) => setNowy({ ...nowy, tytul: e.target.value })} />
          </div>
          <div>
            <label className={etykieta} htmlFor="r-r">Nowych osobówek razem</label>
            <input id="r-r" className={input} inputMode="numeric" value={nowy.razem} onChange={(e) => setNowy({ ...nowy, razem: e.target.value })} />
          </div>
          <div>
            <label className={etykieta} htmlFor="r-z">Zmiana rok do roku (%)</label>
            <input id="r-z" className={input} inputMode="decimal" value={nowy.zmiana} onChange={(e) => setNowy({ ...nowy, zmiana: e.target.value })} placeholder="np. 7,4" />
          </div>
          <div>
            <label className={etykieta} htmlFor="r-u">Udział chińskich marek</label>
            <input id="r-u" className={input} value={nowy.udzial} onChange={(e) => setNowy({ ...nowy, udzial: e.target.value })} placeholder="np. 15,6% we wrześniu" />
          </div>
          {(
            [
              ['marki', 'Marki'],
              ['modele', 'Modele'],
              ['chinskie', 'Marki chińskie']
            ] as const
          ).map(([k, n]) => (
            <div key={k}>
              <label className={etykieta} htmlFor={`r-${k}`}>{n}</label>
              <textarea id={`r-${k}`} className={`${input} min-h-[140px] font-mono text-xs`} value={nowy[k]} onChange={(e) => setNowy({ ...nowy, [k]: e.target.value })} placeholder={'Toyota; 37111\nSkoda; 26502'} />
            </div>
          ))}
          <div>
            <label className={etykieta} htmlFor="r-zr">Źródło</label>
            <input id="r-zr" className={input} value={nowy.zrodlo} onChange={(e) => setNowy({ ...nowy, zrodlo: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={etykieta} htmlFor="r-url">Link do źródła</label>
            <input id="r-url" className={input} value={nowy.url} onChange={(e) => setNowy({ ...nowy, url: e.target.value })} placeholder="https://…" />
          </div>
        </div>
        <button type="button" onClick={dodajOkres} disabled={praca || !rynek} className="inline-flex items-center gap-2 bg-steel-600 hover:bg-steel-700 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj i zapisz
        </button>
        {rynek && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {rynek.dane.okresy.map((o) => (
              <li key={o.id} className="py-2 flex items-center justify-between gap-2">
                <span>
                  {o.tytul} – {o.razem.toLocaleString('pl-PL')} szt. <span className="text-slate-500">({o.zrodlo})</span>
                </span>
                <button
                  type="button"
                  onClick={() => zapiszRynek({ ...rynek.dane, okresy: rynek.dane.okresy.filter((x) => x.id !== o.id) }, `Panel admina: usunięto statystyki – ${o.tytul}`)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  aria-label={`Usuń okres ${o.tytul}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
