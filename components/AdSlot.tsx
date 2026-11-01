'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Miejsce na reklamę AdSense. Wysokość jest zarezerwowana z góry, żeby strona nie „skakała” (CLS).
export default function AdSlot({ klient, slot, wysokosc = 280, className = '' }: { klient: string; slot: string; wysokosc?: number; className?: string }) {
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    if (!ref.current || ref.current.dataset.zaladowany) return;
    ref.current.dataset.zaladowany = '1';
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* skrypt AdSense jeszcze się nie wczytał albo jest zablokowany */
    }
  }, []);
  return (
    <aside aria-label="Reklama" className={`w-full ${className}`} style={{ minHeight: wysokosc }}>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Reklama</div>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: wysokosc - 16 }}
        data-ad-client={klient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
