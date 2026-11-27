'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Ilustracja, type Grafika } from '@/components/HeroIlustracje';

export interface KafelHero {
  slug: string;
  grafika: Grafika;
  dopisek: string;
  tlo: string;
  akcent: string;
  tytul: string;
  opis: string;
}

const ILE = 3;

// Losuje kolejność (tasowanie Fishera-Yatesa)
function potasuj<T>(lista: T[]): T[] {
  const kopia = [...lista];
  for (let i = kopia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia;
}

// Kafelki poradników w nagłówku. Strona jest gotowym plikiem HTML (z pierwszymi 3 poradnikami z puli –
// to widzi Google), a w przeglądarce odwiedzającego od razu losujemy inny zestaw 3 poradników.
// Kafelki pokazują się płynnie dopiero po losowaniu, żeby nie było widać podmiany.
export default function HeroPoradnikiLosowe({ kafle }: { kafle: KafelHero[] }) {
  const [wybrane, setWybrane] = useState(() => kafle.slice(0, ILE));
  const [gotowe, setGotowe] = useState(false);

  useEffect(() => {
    setWybrane(potasuj(kafle).slice(0, ILE));
    setGotowe(true);
  }, [kafle]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-black uppercase tracking-[0.2em] text-white/60">Zacznij od tego</span>
        <Link href="/poradniki/" className="inline-flex items-center gap-1 font-bold text-white/80 hover:text-white">
          Wszystkie poradniki <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul data-kafle-hero className={`grid grid-cols-2 gap-3 transition-opacity duration-500 ${gotowe ? 'opacity-100' : 'opacity-0'}`}>
        {wybrane.map((k, i) => {
          const duzy = i === 0;
          return (
            <li key={k.slug} className={duzy ? 'col-span-2' : ''}>
              <Link
                href={`/poradniki/${k.slug}/`}
                className={`group relative flex h-full overflow-hidden rounded-3xl bg-gradient-to-br ${k.tlo} ring-1 ring-white/15 hover:ring-white/40 backdrop-blur-md transition ${
                  duzy ? 'min-h-[10.5rem] sm:min-h-[11.5rem]' : 'flex-col min-h-[13rem] sm:min-h-[14rem]'
                }`}
              >
                <Ilustracja
                  rodzaj={k.grafika}
                  className={`pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2 ${
                    duzy ? 'absolute right-0 top-1/2 -translate-y-1/2 w-40 sm:w-52' : 'w-full h-24 sm:h-28 mt-3'
                  }`}
                />
                <span className={`relative mt-auto flex flex-col gap-1 p-4 sm:p-5 ${duzy ? 'pr-36 sm:pr-48' : ''}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${k.akcent}`}>{k.dopisek}</span>
                  <span className={`font-extrabold leading-snug text-white ${duzy ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>{k.tytul}</span>
                  {duzy && (
                    <span className="hidden sm:block">
                      <span className="text-sm text-white/70 line-clamp-2">{k.opis}</span>
                    </span>
                  )}
                </span>
                <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-slate-900 flex items-center justify-center transition">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Gdy przeglądarka ma wyłączony JavaScript, kafelki i tak mają być widoczne */}
      <noscript>
        <style>{'[data-kafle-hero]{opacity:1!important}'}</style>
      </noscript>
    </div>
  );
}
