'use client';
// Przełącznik języka PL / UA / EN. Prowadzi do tej samej strony w innym języku,
// a gdy jej tłumaczenia nie ma – do strony głównej danej wersji językowej.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import type { Jezyk } from '@/lib/jezyki';
import type { Odpowiedniki } from '@/lib/tlumaczenia';

const KOLEJNOSC: Jezyk[] = ['pl', 'uk', 'en'];
const KROTKO: Record<Jezyk, string> = { pl: 'PL', uk: 'UA', en: 'EN' };
const NAZWA: Record<Jezyk, string> = { pl: 'Polski', uk: 'Українська', en: 'English' };
const GLOWNA: Record<Jezyk, string> = { pl: '/', uk: '/uk/', en: '/en/' };

export default function PrzelacznikJezyka({ jezyk, zestawy, jasny = false }: { jezyk: Jezyk; zestawy: Odpowiedniki[]; jasny?: boolean }) {
  const sciezka = usePathname() || '/';
  const s = sciezka.endsWith('/') ? sciezka : `${sciezka}/`;
  const z = zestawy.find((x) => Object.values(x).includes(s));
  return (
    <nav aria-label="Language / Мова / Język" className="flex items-center gap-1">
      <Languages className={`w-4 h-4 mr-0.5 ${jasny ? 'text-white/60' : 'text-slate-400'}`} aria-hidden="true" />
      {KOLEJNOSC.map((j) => {
        const aktywny = j === jezyk;
        const cel = z?.[j] || GLOWNA[j];
        return aktywny ? (
          <span key={j} aria-current="true" className="px-1.5 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {KROTKO[j]}
          </span>
        ) : (
          <Link
            key={j}
            href={cel}
            hrefLang={j}
            lang={j}
            title={NAZWA[j]}
            // inny układ strony (inny język) – pełne przeładowanie jest tu i tak nieuniknione
            prefetch={false}
            className="px-1.5 py-0.5 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {KROTKO[j]}
          </Link>
        );
      })}
    </nav>
  );
}
