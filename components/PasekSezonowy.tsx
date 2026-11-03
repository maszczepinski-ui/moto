'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Snowflake, Sun, X } from 'lucide-react';
import { sezonWymiany, Sezon } from '@/lib/opony';

// Pasek pod menu w sezonie wymiany opon (zimowe: 1.10–15.12, letnie: 15.03–15.05).
// Datę sprawdza przeglądarka, więc pasek pojawia się i znika sam, bez przebudowy strony. Można go zamknąć.

const TEKST: Record<Sezon, { ikona: typeof Sun; tytul: string; opis: string; kolor: string }> = {
  zimowe: { ikona: Snowflake, tytul: 'Czas na opony zimowe', opis: 'Gdy rano jest poniżej 7°C, letnie opony gorzej trzymają drogę.', kolor: 'bg-sky-700' },
  letnie: { ikona: Sun, tytul: 'Czas na opony letnie', opis: 'Gdy przez kilka dni jest powyżej 7°C, zimówki szybciej się zużywają i wydłużają hamowanie.', kolor: 'bg-amber-600' }
};

export default function PasekSezonowy() {
  const [sezon, setSezon] = useState<Sezon | null>(null);
  const sciezka = usePathname();
  useEffect(() => {
    const s = sezonWymiany();
    if (!s) return;
    try {
      if (localStorage.getItem(`pasek-opony-${s}-${new Date().getFullYear()}`)) return;
    } catch {
      /* brak pamięci – pokazujemy */
    }
    setSezon(s);
  }, []);
  if (!sezon || sciezka?.startsWith('/opony') || sciezka?.startsWith('/admin')) return null;
  const t = TEKST[sezon];
  const I = t.ikona;
  return (
    <div className={`${t.kolor} text-white`}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <I className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <p className="flex-1 min-w-0">
          <strong>{t.tytul}.</strong> <span className="hidden sm:inline opacity-90">{t.opis}</span>{' '}
          <Link href="/opony/" className="font-bold underline underline-offset-2 whitespace-nowrap">
            Sprawdź opony →
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(`pasek-opony-${sezon}-${new Date().getFullYear()}`, '1');
            } catch {
              /* nic */
            }
            setSezon(null);
          }}
          className="p-1 rounded hover:bg-white/15"
          aria-label="Zamknij"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
