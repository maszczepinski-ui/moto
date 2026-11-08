'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toUrzadzenieAdmina } from '@/lib/admin-urzadzenie';

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

type Teksty = { tekst: string; szczegoly: string; nie: string; tak: string };
const PL: Teksty = {
  tekst: 'Czy zgadzasz się na pliki cookies Google Analytics? Pomagają nam sprawdzić, które części strony są przydatne. Bez zgody strona działa tak samo.',
  szczegoly: 'Szczegóły',
  nie: 'Odrzucam',
  tak: 'Akceptuję'
};

/** `t` – teksty w innym języku (wersje /uk/ i /en/); domyślnie po polsku */
export default function BanerZgod({ t = PL }: { t?: Teksty }) {
  const [widoczny, setWidoczny] = useState(false);
  useEffect(() => {
    let zapisana = '';
    try {
      zapisana = localStorage.getItem(KLUCZ_ZGODY) || '';
    } catch {
      /* brak dostępu do pamięci – pokażemy baner */
    }
    // na urządzeniu admina Analytics się nie wczytuje, więc baner też jest zbędny
    if (!zapisana && !toUrzadzenieAdmina()) setWidoczny(true);
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
    <div role="dialog" aria-live="polite" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
          {t.tekst}{' '}
          <Link href="/prywatnosc/" className="underline">
            {t.szczegoly}
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button type="button" onClick={() => decyzja(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm text-slate-800 dark:text-slate-100">
            {t.nie}
          </button>
          <button type="button" onClick={() => decyzja(true)} className="flex-1 px-4 py-2.5 rounded-xl bg-steel-700 hover:bg-steel-800 text-white font-bold text-sm">
            {t.tak}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link w stopce – ponownie otwiera baner */
export function UstawieniaCookies({ etykieta = 'Ustawienia cookies' }: { etykieta?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(ZDARZENIE_ZGODY))} className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
      {etykieta}
    </button>
  );
}
