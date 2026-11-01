'use client';
import { useEffect, useRef, useState } from 'react';
import { Fuel, Send } from 'lucide-react';
import type { Statystyki } from '@/lib/spalanie';
import { sledz } from '@/lib/sledz';

// Realne spalanie zgłaszane przez kierowców. Moduł sam się ukrywa, dopóki baza danych nie jest podłączona.

const f1 = (x: number | null) => (x === null ? '—' : x.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

export default function RaportySpalania({ karta, nazwa, wersje, elektryczny, szacunek }: { karta: string; nazwa: string; wersje: string[]; elektryczny: boolean; szacunek?: number }) {
  const [stan, setStan] = useState<'ladowanie' | 'brak' | 'ok'>('ladowanie');
  const [dane, setDane] = useState<Statystyki | null>(null);
  const [form, setForm] = useState({ wersja: '', styl: 'mieszany', lpg: false, wynik: '', strona: '' });
  const [wysylanie, setWysylanie] = useState(false);
  const [komunikat, setKomunikat] = useState<{ ok: boolean; tekst: string } | null>(null);
  const start = useRef(Date.now());
  const jedn = elektryczny ? 'kWh/100 km' : 'l/100 km';

  async function wczytaj() {
    try {
      const r = await fetch(`/api/spalanie/?karta=${encodeURIComponent(karta)}`);
      if (r.status === 503 || r.status === 404) return setStan('brak');
      if (!r.ok) return setStan('brak');
      setDane(await r.json());
      setStan('ok');
    } catch {
      setStan('brak');
    }
  }
  useEffect(() => {
    wczytaj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karta]);

  async function wyslij(e: React.FormEvent) {
    e.preventDefault();
    setWysylanie(true);
    setKomunikat(null);
    try {
      const r = await fetch('/api/spalanie/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, karta, elektryczny, czas: Date.now() - start.current })
      });
      const j = await r.json();
      if (r.ok) {
        setKomunikat({ ok: true, tekst: 'Dziękujemy! Twój raport pojawi się w statystykach w ciągu kilku minut.' });
        setForm((x) => ({ ...x, wynik: '' }));
        sledz('raport_spalania', { karta });
        setTimeout(wczytaj, 1500);
      } else setKomunikat({ ok: false, tekst: j.blad || 'Nie udało się wysłać raportu.' });
    } catch {
      setKomunikat({ ok: false, tekst: 'Brak połączenia – spróbuj ponownie.' });
    } finally {
      setWysylanie(false);
    }
  }

  if (stan !== 'ok' || !dane) return null;
  const max = Math.max(1, ...dane.rozklad.map((r) => r.liczba));
  const pole = 'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm';

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5" aria-labelledby="spalanie-tytul">
      <h2 id="spalanie-tytul" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
        <Fuel className="w-6 h-6 text-rust-600" aria-hidden="true" /> Realne {elektryczny ? 'zużycie energii' : 'spalanie'} – raporty kierowców
      </h2>
      {dane.liczba === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">Nie ma jeszcze raportów dla {nazwa}. Jeździsz tym autem? Dodaj pierwszy wynik – pomożesz innym.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <dl className="grid grid-cols-2 gap-2">
              <div className="bg-steel-700 text-white rounded-xl p-3">
                <dt className="text-xs text-steel-100">Średnio ({dane.liczba} raportów)</dt>
                <dd className="text-2xl font-black tabular-nums">
                  {f1(dane.srednia)} <span className="text-sm font-normal">{jedn}</span>
                </dd>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3">
                <dt className="text-xs text-slate-500">{szacunek ? 'Nasz szacunek (kalkulator)' : 'Mediana'}</dt>
                <dd className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
                  {f1(szacunek ?? dane.mediana)} <span className="text-sm font-normal">{jedn}</span>
                </dd>
              </div>
            </dl>
            <ul className="text-sm space-y-1">
              {(['miasto', 'trasa', 'mieszany'] as const).map((s) => (
                <li key={s} className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 first-letter:uppercase">{s}</span>
                  <span className="tabular-nums">
                    {f1(dane.wgStylu[s].srednia)} {jedn} <span className="text-slate-400">({dane.wgStylu[s].liczba})</span>
                  </span>
                </li>
              ))}
              {dane.lpg.liczba > 0 && (
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Na LPG</span>
                  <span className="tabular-nums">
                    {f1(dane.lpg.srednia)} l/100 km <span className="text-slate-400">({dane.lpg.liczba})</span>
                  </span>
                </li>
              )}
            </ul>
            {dane.wersje.length > 0 && (
              <ul className="text-xs text-slate-500 space-y-0.5">
                {dane.wersje.map((v) => (
                  <li key={v.nazwa}>
                    {v.nazwa}: {f1(v.srednia)} {jedn} ({v.liczba})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-2">Rozkład wyników ({jedn})</div>
            <div className="flex items-end gap-1 h-32" role="img" aria-label="Rozkład zgłoszonych wyników spalania">
              {dane.rozklad.map((r) => (
                <div key={r.od} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-rust-500 rounded-t" style={{ height: `${(r.liczba / max) * 100}%` }} title={`${r.od}–${r.od + 1}: ${r.liczba}`} />
                  <span className="text-[10px] text-slate-500 mt-1 tabular-nums">{r.od}</span>
                </div>
              ))}
            </div>
            {dane.odrzucone > 0 && <p className="text-[11px] text-slate-500 mt-2">Wyniki mocno odstające od reszty nie są liczone do średniej (pominięte: {dane.odrzucone}).</p>}
          </div>
        </div>
      )}

      <form onSubmit={wyslij} className="relative grid grid-cols-1 sm:grid-cols-4 gap-3 items-end border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="sm:col-span-4 text-sm font-semibold text-slate-900 dark:text-white">Dodaj swój wynik</div>
        <div>
          <label htmlFor="sp-wersja" className="block text-xs text-slate-500 mb-1">
            Wersja silnika
          </label>
          <input id="sp-wersja" list="sp-wersje" maxLength={40} value={form.wersja} onChange={(e) => setForm({ ...form, wersja: e.target.value })} className={pole} placeholder="np. 1.9 TDI 101 KM" />
          <datalist id="sp-wersje">
            {wersje.map((w) => (
              <option key={w} value={w} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="sp-styl" className="block text-xs text-slate-500 mb-1">
            Gdzie jeździsz
          </label>
          <select id="sp-styl" value={form.styl} onChange={(e) => setForm({ ...form, styl: e.target.value })} className={pole}>
            <option value="miasto">głównie miasto</option>
            <option value="trasa">głównie trasa</option>
            <option value="mieszany">mieszanie</option>
          </select>
        </div>
        <div>
          <label htmlFor="sp-wynik" className="block text-xs text-slate-500 mb-1">
            Średnie zużycie ({jedn})
          </label>
          <input id="sp-wynik" required inputMode="decimal" value={form.wynik} onChange={(e) => setForm({ ...form, wynik: e.target.value })} className={pole} placeholder={elektryczny ? 'np. 17,5' : 'np. 6,4'} />
        </div>
        <div className="flex flex-col gap-2">
          {!elektryczny && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.lpg} onChange={(e) => setForm({ ...form, lpg: e.target.checked })} /> jeżdżę na LPG
            </label>
          )}
          <button type="submit" disabled={wysylanie} className="inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg">
            <Send className="w-4 h-4" aria-hidden="true" /> Wyślij
          </button>
        </div>
        {/* pole-pułapka na boty – niewidoczne dla ludzi */}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor="sp-strona">Strona www</label>
          <input id="sp-strona" tabIndex={-1} autoComplete="off" value={form.strona} onChange={(e) => setForm({ ...form, strona: e.target.value })} />
        </div>
        {komunikat && (
          <p role="status" className={`sm:col-span-4 text-sm ${komunikat.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {komunikat.tekst}
          </p>
        )}
        <p className="sm:col-span-4 text-[11px] text-slate-500">Raporty są anonimowe. Podaj średnią z komputera pokładowego albo z kilku tankowań do pełna.</p>
      </form>
    </section>
  );
}
