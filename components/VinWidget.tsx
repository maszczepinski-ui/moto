'use client';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { sledz } from '@/lib/sledz';

// Pole na numer VIN. Jeśli link partnera zawiera {vin}, numer trafia prosto do raportu.
const WZOR_VIN = /^[A-HJ-NPR-Z0-9]{17}$/;

export default function VinWidget({ szablon, partner, karta }: { szablon: string; partner: string; karta: string }) {
  const [vin, setVin] = useState('');
  const czysty = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const poprawny = WZOR_VIN.test(czysty);
  const maVin = szablon.includes('{vin}');
  const link = maVin ? szablon.replaceAll('{vin}', poprawny ? encodeURIComponent(czysty) : '') : szablon;
  return (
    <form
      className="mt-auto flex flex-col sm:flex-row gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (maVin && czysty && !poprawny) return;
        sledz('klik_partner', { modul: 'vin', partner, karta, zVinem: poprawny ? 1 : 0 });
        window.open(link, '_blank', 'noopener');
      }}
    >
      {maVin && (
        <div className="flex-1">
          <label htmlFor={`vin-${karta}`} className="sr-only">
            Numer VIN
          </label>
          <input
            id={`vin-${karta}`}
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            maxLength={20}
            placeholder="Wpisz VIN (17 znaków)"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl px-3 py-2.5 text-slate-900 font-mono uppercase placeholder:normal-case placeholder:font-sans"
            aria-invalid={!!czysty && !poprawny}
          />
          {czysty && !poprawny && <p className="text-[11px] text-amber-200 mt-1">VIN ma 17 znaków (bez liter I, O, Q).</p>}
        </div>
      )}
      <button type="submit" className="inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors self-start">
        Sprawdź historię VIN <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
}
