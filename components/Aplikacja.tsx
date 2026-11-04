'use client';
import { useEffect, useState } from 'react';
import { Smartphone, X, Share, SquarePlus } from 'lucide-react';

// 1) Rejestracja service workera (potrzebny, żeby stronę dało się zainstalować jak aplikację na każdym telefonie).
// 2) Baner „Dodaj MotoRaport do ekranu głównego” na telefonie – raz na jakiś czas, łatwo go zamknąć.

type Zdarzenie = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KLUCZ = 'mf-baner-aplikacji';
const PRZERWA_DNI = 45;

const pamiec = {
  get(): number {
    try {
      return Number(localStorage.getItem(KLUCZ) || 0);
    } catch {
      return 0;
    }
  },
  set() {
    try {
      localStorage.setItem(KLUCZ, String(Date.now()));
    } catch {
      /* tryb prywatny – trudno */
    }
  }
};

export default function Aplikacja() {
  const [zd, setZd] = useState<Zdarzenie | null>(null);
  const [ios, setIos] = useState(false);
  const [widoczny, setWidoczny] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
    const zainstalowana = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const telefon = window.matchMedia('(pointer: coarse) and (max-width: 820px)').matches;
    const niedawno = Date.now() - pamiec.get() < PRZERWA_DNI * 864e5;
    if (zainstalowana || !telefon || niedawno || location.pathname.startsWith('/admin')) return;

    const h = (e: Event) => {
      e.preventDefault();
      setZd(e as Zdarzenie);
    };
    window.addEventListener('beforeinstallprompt', h);
    const jestIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
    setIos(jestIos);
    // pokazujemy po chwili czytania, a nie od razu po wejściu – i nie razem z banerem cookies
    const t = setTimeout(() => {
      if (!document.querySelector('[aria-label="Zgoda na pliki cookies"]')) setWidoczny(true);
    }, 25000);
    return () => {
      window.removeEventListener('beforeinstallprompt', h);
      clearTimeout(t);
    };
  }, []);

  const zamknij = () => {
    pamiec.set();
    setWidoczny(false);
  };

  if (!widoczny || (!zd && !ios)) return null;

  return (
    <div role="dialog" aria-label="Dodaj stronę do ekranu głównego" className="fixed inset-x-0 bottom-0 z-[65] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] no-print">
      <div className="mx-auto max-w-md rounded-2xl bg-slate-950 text-white shadow-2xl ring-1 ring-white/10 p-4">
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ikony/ikona-192.png" alt="" className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold">Miej MotoRaport pod ręką</div>
            <p className="text-sm text-white/70">Dodaj stronę do ekranu głównego – otworzy się jak aplikacja, bez paska przeglądarki.</p>
          </div>
          <button type="button" onClick={zamknij} aria-label="Zamknij" className="p-1 -m-1 text-white/60 hover:text-white">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {zd ? (
          <button
            type="button"
            onClick={async () => {
              await zd.prompt();
              await zd.userChoice.catch(() => undefined);
              zamknij();
            }}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 font-extrabold py-3"
          >
            <Smartphone className="w-5 h-5" aria-hidden="true" /> Dodaj do ekranu głównego
          </button>
        ) : (
          <ol className="mt-3 space-y-1.5 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-xs font-black flex items-center justify-center">1</span> Stuknij <Share className="w-4 h-4" aria-label="Udostępnij" /> na dole ekranu Safari
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-xs font-black flex items-center justify-center">2</span> Wybierz <SquarePlus className="w-4 h-4" aria-hidden="true" /> „Do ekranu początkowego”
            </li>
          </ol>
        )}
      </div>
    </div>
  );
}
