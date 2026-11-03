'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Baner zgody na pliki cookies Google Analytics (wymóg art. 399 Prawa komunikacji elektronicznej).
// Pokazuje się tylko, gdy w panelu jest wpisany identyfikator GA4, a reklamy AdSense są wyłączone
// (przy AdSense zgodę zbiera certyfikowany baner Google – tak wymaga Google w UE).
// „Odrzucam” jest tak samo widoczne jak „Akceptuję”. Decyzję można zmienić linkiem „Ustawienia cookies” w stopce.

export const KLUCZ_ZGODY = 'zgoda-analityka';
export const ZDARZENIE_ZGODY = 'pokaz-baner-zgod';

declare global {
  interface Window {
    gtag?: (...a: unknown[]) => void;
  }
}

export default function BanerZgod() {
  const [widoczny, setWidoczny] = useState(false);
  useEffect(() => {
    let zapisana = '';
    try {
      zapisana = localStorage.getItem(KLUCZ_ZGODY) || '';
    } catch {
      /* brak dostępu do pamięci – pokażemy baner */
    }
    if (!zapisana) setWidoczny(true);
    const pokaz = () => setWidoczny(true);
    window.addEventListener(ZDARZENIE_ZGODY, pokaz);
    return () => window.removeEventListener(ZDARZENIE_ZGODY, pokaz);
  }, []);

  const decyzja = (tak: boolean) => {
    try {
      localStorage.setItem(KLUCZ_ZGODY, tak ? 'tak' : 'nie');
    } catch {
      /* nic – decyzja obowiązuje do końca wizyty */
    }
    window.gtag?.('consent', 'update', { analytics_storage: tak ? 'granted' : 'denied' });
    setWidoczny(false);
  };

  if (!widoczny) return null;
  return (
    <div role="dialog" aria-live="polite" aria-label="Zgoda na pliki cookies" className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
          Czy zgadzasz się na pliki cookies Google Analytics? Pomagają nam sprawdzić, które części strony są przydatne. Bez zgody strona działa tak samo.{' '}
          <Link href="/prywatnosc/" className="underline">
            Szczegóły
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button type="button" onClick={() => decyzja(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm text-slate-800 dark:text-slate-100">
            Odrzucam
          </button>
          <button type="button" onClick={() => decyzja(true)} className="flex-1 px-4 py-2.5 rounded-xl bg-steel-700 hover:bg-steel-800 text-white font-bold text-sm">
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link w stopce – ponownie otwiera baner */
export function UstawieniaCookies() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(ZDARZENIE_ZGODY))} className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
      Ustawienia cookies
    </button>
  );
}
