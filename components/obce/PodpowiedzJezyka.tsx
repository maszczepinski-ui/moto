'use client';
// Dyskretny pasek na polskich stronach: „Ця сторінка є українською” / „This page is available in English”.
// Pokazuje się tylko, gdy przeglądarka jest ustawiona na ukraiński albo angielski
// i ta konkretna strona ma tłumaczenie. Bez automatycznego przekierowania (tak zaleca Google).
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import type { JezykObcy } from '@/lib/jezyki';
import type { Odpowiedniki } from '@/lib/tlumaczenia';

const KLUCZ = 'podpowiedz-jezyka-zamknieta';
const TEKSTY: Record<JezykObcy, { tekst: string; przejdz: string; zamknij: string }> = {
  uk: { tekst: 'Ця сторінка є українською мовою.', przejdz: 'Перейти', zamknij: 'Закрити' },
  en: { tekst: 'This page is available in English.', przejdz: 'Go', zamknij: 'Close' }
};

function jezykPrzegladarki(): JezykObcy | null {
  const lista = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of lista) {
    const k = (l || '').toLowerCase();
    if (k.startsWith('pl')) return null; // ktoś ma polski wyżej na liście – nie przeszkadzamy
    if (k.startsWith('uk')) return 'uk';
    if (k.startsWith('en')) return 'en';
  }
  return null;
}

export default function PodpowiedzJezyka({ zestawy }: { zestawy: Odpowiedniki[] }) {
  const sciezka = usePathname() || '/';
  const [cel, setCel] = useState<{ j: JezykObcy; href: string } | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KLUCZ)) return;
    } catch {
      /* brak pamięci – pokażemy */
    }
    const j = jezykPrzegladarki();
    if (!j) return;
    const s = sciezka.endsWith('/') ? sciezka : `${sciezka}/`;
    const href = zestawy.find((z) => z.pl === s)?.[j];
    setCel(href ? { j, href } : null);
  }, [sciezka, zestawy]);

  if (!cel) return null;
  const t = TEKSTY[cel.j];
  const zamknij = () => {
    try {
      localStorage.setItem(KLUCZ, '1');
    } catch {
      /* nic */
    }
    setCel(null);
  };
  return (
    <div lang={cel.j} className="bg-sky-50 dark:bg-sky-950/60 border-b border-sky-200 dark:border-sky-900 text-sky-950 dark:text-sky-100 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
        <span className="flex-1">{t.tekst}</span>
        <Link href={cel.href} hrefLang={cel.j} prefetch={false} className="font-bold underline">
          {t.przejdz} →
        </Link>
        <button type="button" onClick={zamknij} aria-label={t.zamknij} className="p-1 rounded hover:bg-sky-100 dark:hover:bg-sky-900">
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
