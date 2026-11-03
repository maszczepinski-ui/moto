'use client';
import { useState } from 'react';
import { ZDJECIA, KluczZdjecia } from '@/config/zdjecia';

// Zdjęcie w tle kafelka / nagłówka. Gdy się nie wczyta (np. brak internetu, zablokowany adres),
// zostaje sam kolorowy gradient – strona nadal wygląda porządnie.
export default function ZdjecieTla({ klucz, priorytet = false, className = '' }: { klucz: KluczZdjecia; priorytet?: boolean; className?: string }) {
  const z = ZDJECIA[klucz];
  const [blad, setBlad] = useState(false);
  if (blad) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={z.src}
      alt=""
      aria-hidden="true"
      loading={priorytet ? 'eager' : 'lazy'}
      fetchPriority={priorytet ? 'high' : 'auto'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setBlad(true)}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}
