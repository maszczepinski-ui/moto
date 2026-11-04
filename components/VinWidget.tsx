'use client';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { sledz } from '@/lib/sledz';
import { zKanalem, kanalDla } from '@/lib/kanal';

// Pole na numer VIN + przejście do raportu partnera (np. carVertical).
// • Jeśli link partnera zawiera {vin} – numer trafia prosto do raportu.
// • Jeśli nie – kopiujemy VIN do schowka, a klient wkleja go na stronie partnera (Ctrl+V / przytrzymaj i „Wklej”).
const WZOR_VIN = /^[A-HJ-NPR-Z0-9]{17}$/;

async function doSchowka(t: string) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
}

export default function VinWidget({
  szablon,
  ogolny = '',
  partner,
  karta,
  przycisk = 'Sprawdź historię VIN',
  kod = '',
  rabat = ''
}: {
  szablon: string;
  /** link partnera bez VIN – gdy numer nie został wpisany */
  ogolny?: string;
  partner: string;
  karta: string;
  przycisk?: string;
  /** kod rabatowy partnera – nie jest już pokazywany (rabat jest w linku partnerskim) */
  kod?: string;
  /** opis rabatu, np. „-10%” */
  rabat?: string;
}) {
  // kanał (sub2) – żeby w panelu carVertical było widać, skąd przyszło kliknięcie
  szablon = zKanalem(szablon, kanalDla(karta));
  ogolny = zKanalem(ogolny, kanalDla(karta));
  const [vin, setVin] = useState('');
  const [info, setInfo] = useState('');
  const czysty = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const poprawny = WZOR_VIN.test(czysty);
  const maVin = szablon.includes('{vin}');
  const link = maVin ? (poprawny ? szablon.replaceAll('{vin}', encodeURIComponent(czysty)) : ogolny || szablon.replaceAll('{vin}', '')) : szablon;
  const nazwaPartnera = partner === 'carvertical' ? 'carVertical' : partner === 'autodna' ? 'autoDNA' : 'partnera';

  return (
    <div className="mt-auto space-y-3">
      {rabat && (
        <p className="text-sm font-bold text-amber-300">Rabat {rabat} naliczy się automatycznie po kliknięciu.</p>
      )}
      <form
        className="flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (czysty && !poprawny) return;
          // kopiowanie VIN startujemy przed otwarciem nowej karty (póki strona ma „kliknięcie” użytkownika),
          // a nową kartę otwieramy od razu – bez czekania, żeby przeglądarka jej nie zablokowała
          const kopiowanie = !maVin && poprawny ? doSchowka(czysty) : Promise.resolve(false);
          window.open(link, '_blank', 'noopener');
          sledz('klik_partner', { modul: 'vin', partner, karta, zVinem: poprawny ? 1 : 0 });
          setInfo((await kopiowanie) ? `Skopiowaliśmy VIN – wklej go na stronie ${nazwaPartnera} (Ctrl+V albo przytrzymaj palec i „Wklej”).` : '');
        }}
      >
        <div className="flex-1 min-w-[14rem]">
          <label htmlFor={`vin-${karta}`} className="sr-only">
            Numer VIN
          </label>
          <input
            id={`vin-${karta}`}
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            maxLength={20}
            placeholder={maVin ? 'Wpisz VIN (17 znaków)' : 'Wpisz VIN (opcjonalnie)'}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl px-3 py-2.5 text-slate-900 font-mono uppercase placeholder:normal-case placeholder:font-sans"
            aria-invalid={!!czysty && !poprawny}
          />
          {czysty && !poprawny && <p className="text-[11px] text-amber-200 mt-1">VIN ma 17 znaków (bez liter I, O, Q).</p>}
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors self-start">
          {przycisk} <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
      {info && (
        <p role="status" className="text-xs bg-white/15 rounded-lg px-3 py-2">
          {info}
        </p>
      )}
    </div>
  );
}
