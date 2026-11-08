'use client';
import { useState } from 'react';
import { ExternalLink, BadgePercent } from 'lucide-react';
import { sledz } from '@/lib/sledz';
import { zKanalem, kanalDla } from '@/lib/kanal';

// Pole na numer VIN + przejście do raportu partnera (np. carVertical).
// • Jeśli link partnera zawiera {vin} – numer trafia prosto do raportu.
// • Jeśli nie – kopiujemy VIN do schowka, a klient wkleja go na stronie partnera (Ctrl+V / przytrzymaj i „Wklej”).
const WZOR_VIN = /^[A-HJ-NPR-Z0-9]{17}$/;

export type TekstyVin = {
  etykieta: string;
  zVinem: string;
  bezVinu: string;
  blad: string;
  /** {partner} zostanie zamienione na nazwę partnera */
  skopiowano: string;
  rabatTytul: string;
  rabatOpis: string;
  partnera: string;
};

const PL: TekstyVin = {
  etykieta: 'Numer VIN',
  zVinem: 'Wpisz VIN (17 znaków)',
  bezVinu: 'Wpisz VIN (opcjonalnie)',
  blad: 'VIN ma 17 znaków (bez liter I, O, Q).',
  skopiowano: 'Skopiowaliśmy VIN – wklej go na stronie {partner} (Ctrl+V albo przytrzymaj palec i „Wklej”).',
  rabatTytul: 'Rabat już w linku',
  rabatOpis: 'nalicza się sam, bez kodu',
  partnera: 'partnera'
};

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
  rabat = '',
  t = PL
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
  /** teksty w innym języku (wersje /uk/ i /en/) */
  t?: TekstyVin;
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
  const nazwaPartnera = partner === 'carvertical' ? 'carVertical' : partner === 'autodna' ? 'autoDNA' : t.partnera;

  return (
    <div className="mt-auto space-y-3">
      {rabat && (
        <div className="inline-flex items-center gap-2.5 rounded-xl border border-amber-300/40 bg-amber-300/10 pl-1.5 pr-3.5 py-1.5 select-none">
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-300 text-slate-900 px-2 py-1 text-sm font-black tabular-nums">
            <BadgePercent className="w-4 h-4" aria-hidden="true" />
            {rabat}
          </span>
          <span className="text-sm leading-tight text-white">
            <span className="font-bold">{t.rabatTytul}</span>
            <span className="block text-xs text-white/70">{t.rabatOpis}</span>
          </span>
        </div>
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
          setInfo((await kopiowanie) ? t.skopiowano.replace('{partner}', nazwaPartnera) : '');
        }}
      >
        <div className="flex-1 min-w-[14rem]">
          <label htmlFor={`vin-${karta}`} className="sr-only">
            {t.etykieta}
          </label>
          <input
            id={`vin-${karta}`}
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            maxLength={20}
            placeholder={maVin ? t.zVinem : t.bezVinu}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl px-3 py-2.5 text-slate-900 font-mono uppercase placeholder:normal-case placeholder:font-sans"
            aria-invalid={!!czysty && !poprawny}
          />
          {czysty && !poprawny && <p className="text-[11px] text-amber-200 mt-1">{t.blad}</p>}
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
