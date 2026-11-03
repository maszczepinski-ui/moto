'use client';
import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

// Przycisk „Dodaj do ekranu głównego” – pojawia się tylko w przeglądarkach, które to umożliwiają (Chrome, Edge, Samsung).
// Na iPhonie zamiast przycisku pokazujemy krótką instrukcję (Udostępnij → Do ekranu początkowego).
type Zdarzenie = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function ZainstalujAplikacje() {
  const [zd, setZd] = useState<Zdarzenie | null>(null);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setZd(e as Zdarzenie);
    };
    window.addEventListener('beforeinstallprompt', h);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  if (zd)
    return (
      <button
        type="button"
        onClick={async () => {
          await zd.prompt();
          setZd(null);
        }}
        className="inline-flex items-center gap-2 bg-steel-700 hover:bg-steel-800 text-white text-sm font-bold px-4 py-2 rounded-xl"
      >
        <Smartphone className="w-4 h-4" aria-hidden="true" /> Dodaj do ekranu głównego
      </button>
    );
  if (ios)
    return (
      <p className="inline-flex items-center gap-2 text-xs">
        <Smartphone className="w-4 h-4" aria-hidden="true" /> Na iPhonie: Udostępnij → „Do ekranu początkowego” – strona otworzy się jak aplikacja.
      </p>
    );
  return null;
}
