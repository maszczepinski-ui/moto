'use client';
// Zdarzenia kliknięć (linki partnerskie). Trafiają do Google Analytics 4 (jeśli w panelu wpisano identyfikator GA4)
// i do statystyk Vercel (zdarzenia własne działają w płatnym planie Vercel; w darmowym są pomijane).
import { track } from '@vercel/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function sledz(nazwa: string, dane: Record<string, string | number>) {
  try {
    window.gtag?.('event', nazwa, dane);
  } catch {
    /* brak GA4 */
  }
  try {
    track(nazwa, dane);
  } catch {
    /* brak statystyk Vercel */
  }
}
