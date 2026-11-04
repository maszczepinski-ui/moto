'use client';
import { useState } from 'react';
import { ArrowRight, BadgePercent, ScanLine } from 'lucide-react';
import { sledz } from '@/lib/sledz';
import { zKanalem } from '@/lib/kanal';

// Duże pole VIN do sekcji na stronie głównej. Ta sama logika co VinWidget:
// link z {vin} → numer trafia prosto do raportu; bez {vin} → kopiujemy VIN do schowka i otwieramy stronę partnera.
const WZOR = /^[A-HJ-NPR-Z0-9]{17}$/;

async function doSchowka(t: string) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
}

export default function VinHero({ szablon, ogolny = '', partner, kod = '', rabat = '' }: { szablon: string; ogolny?: string; partner: string; kod?: string; rabat?: string }) {
  szablon = zKanalem(szablon, 'strona-glowna');
  ogolny = zKanalem(ogolny, 'strona-glowna');
  const [vin, setVin] = useState('');
  const [info, setInfo] = useState('');
  const czysty = vin.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
  const poprawny = WZOR.test(czysty);
  const zleZnaki = /[IOQ]/.test(czysty);
  const maVin = szablon.includes('{vin}');
  const link = maVin ? (poprawny ? szablon.replaceAll('{vin}', encodeURIComponent(czysty)) : ogolny || szablon.replaceAll('{vin}', '')) : szablon;
  const nazwa = partner === 'carvertical' ? 'carVertical' : 'partnera';

  return (
    <div className="space-y-4">
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          if (czysty && !poprawny) return;
          const kopia = !maVin && poprawny ? doSchowka(czysty) : Promise.resolve(false);
          window.open(link, '_blank', 'noopener');
          sledz('klik_partner', { modul: 'vin', partner, karta: 'strona-glowna', zVinem: poprawny ? 1 : 0 });
          setInfo((await kopia) ? `Skopiowaliśmy VIN – wklej go na stronie ${nazwa} (Ctrl+V albo przytrzymaj palec i „Wklej”).` : '');
        }}
      >
        <label htmlFor="vin-hero" className="sr-only">
          Numer VIN
        </label>
        <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur focus-within:ring-2 focus-within:ring-rust-400 transition">
          <div className="relative flex-1">
            <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <input
              id="vin-hero"
              value={czysty}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Wpisz numer VIN"
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              aria-invalid={!!czysty && !poprawny}
              aria-describedby="vin-hero-licznik"
              className="w-full h-14 pl-12 pr-16 rounded-xl bg-white text-slate-900 font-mono text-lg sm:text-xl tracking-[0.18em] uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-slate-400 focus:outline-none"
            />
            <span
              id="vin-hero-licznik"
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums ${poprawny ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              {czysty.length}/17
            </span>
          </div>
          <button
            type="submit"
            className="h-14 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-rust-600 hover:bg-rust-500 text-white font-extrabold text-base shadow-lg shadow-rust-900/40 transition-colors"
          >
            Sprawdź historię <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {czysty && !poprawny && (
          <p className="mt-2 text-xs text-amber-200">{zleZnaki ? 'VIN nie zawiera liter I, O ani Q – sprawdź, czy to nie cyfry 1 lub 0.' : 'Numer VIN ma dokładnie 17 znaków.'}</p>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-3">
        {rabat && (
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-amber-300/40 bg-amber-300/10 pl-1.5 pr-3.5 py-1.5 select-none">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-300 text-slate-900 px-2 py-1 text-sm font-black tabular-nums">
              <BadgePercent className="w-4 h-4" aria-hidden="true" />
              {rabat}
            </span>
            <span className="text-sm leading-tight text-white">
              <span className="font-bold">Rabat już w linku</span>
              <span className="block text-xs text-white/70">nalicza się sam, bez kodu</span>
            </span>
          </div>
        )}
        <span className="text-xs text-white/60">Link partnerski {nazwa} – nie płacisz więcej.</span>
      </div>
      {info && (
        <p role="status" className="text-sm bg-white/10 rounded-xl px-3 py-2">
          {info}
        </p>
      )}
    </div>
  );
}
