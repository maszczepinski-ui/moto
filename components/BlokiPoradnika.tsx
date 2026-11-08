// Bloki treści poradnika (akapit, lista, kroki, ramka, liczby, link) – wspólne dla wersji polskiej i tłumaczeń.
import Link from 'next/link';
import { ArrowRight, Info, TriangleAlert } from 'lucide-react';
import type { Blok, KategoriaPoradnika } from '@/lib/poradniki';
import { AKCENT } from '@/lib/poradniki-wyglad';

type Props = {
  bloki: Blok[];
  kat: KategoriaPoradnika;
  /** poprawki typograficzne dla danego języka (np. sieroty na końcu linii) */
  typo: (t: string) => string;
  etykiety: { uwaga: string; dobrzeWiedziec: string };
  /** dokąd prowadzi link wewnętrzny; null = nie pokazuj; dopisek = np. „(po polsku)” */
  link: (href: string) => { href: string; dopisek?: string } | null;
};

export default function BlokiPoradnika({ bloki, kat, typo, etykiety, link }: Props) {
  return (
    <>
      {bloki.map((b, i) => {
        if (b.typ === 'p') return <p key={i}>{typo(b.t)}</p>;
        if (b.typ === 'link') {
          const cel = link(b.href);
          if (!cel) return null;
          return (
            <Link key={i} href={cel.href} className="not-prose group flex items-center gap-4 rounded-2xl bg-slate-950 dark:bg-slate-900 text-white ring-1 ring-slate-800 px-5 py-4 hover:bg-slate-900 dark:hover:bg-slate-800 transition">
              <span className={`w-2 self-stretch rounded-full flex-shrink-0 ${AKCENT[kat].pasek}`} aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-extrabold leading-snug">
                  {typo(b.t)}
                  {cel.dopisek && <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wider text-white/60">{cel.dopisek}</span>}
                </span>
                <span className="block text-sm text-white/70">{typo(b.o)}</span>
              </span>
              <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          );
        }
        if (b.typ === 'lista')
          return (
            <ul key={i} className="space-y-2.5">
              {b.elementy.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className={`mt-[0.7rem] w-2 h-2 rounded-full flex-shrink-0 ${AKCENT[kat].pasek}`} aria-hidden="true" />
                  <span>{typo(e.charAt(0).toUpperCase() + e.slice(1).replace(/,$/, '.'))}</span>
                </li>
              ))}
            </ul>
          );
        if (b.typ === 'kroki')
          return (
            <ol key={i} className="relative space-y-4 before:absolute before:left-[1.1rem] before:top-4 before:bottom-4 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
              {b.elementy.map((e, n) => (
                <li key={e.t} className="relative flex gap-4">
                  <span className="relative z-10 w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm flex items-center justify-center flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-950">
                    {n + 1}
                  </span>
                  <div className="flex-1 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 px-5 py-4">
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">{typo(e.t)}</h3>
                    <p className="mt-1 text-[1rem] leading-7 text-slate-600 dark:text-slate-300">{typo(e.o)}</p>
                  </div>
                </li>
              ))}
            </ol>
          );
        if (b.typ === 'uwaga') {
          const ostrz = b.ton === 'ostrzezenie';
          const I = ostrz ? TriangleAlert : Info;
          return (
            <aside
              key={i}
              className={`flex gap-4 rounded-2xl p-5 text-[1rem] leading-7 border-l-4 ${
                ostrz ? 'bg-amber-50 text-amber-950 border-amber-500 dark:bg-amber-950/30 dark:text-amber-100' : 'bg-sky-50 text-sky-950 border-sky-500 dark:bg-sky-950/30 dark:text-sky-100'
              }`}
            >
              <I className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="font-extrabold">{ostrz ? etykiety.uwaga : etykiety.dobrzeWiedziec}</div>
                <p>{typo(b.t)}</p>
              </div>
            </aside>
          );
        }
        if (b.typ === 'liczby')
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {b.elementy.map((e, n) => (
                <div key={e.w + e.o} className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4">
                  <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{e.w}</div>
                  <div className="text-xs text-slate-500">{e.o}</div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full bg-[var(--viz-1)]" style={{ width: `${((n + 1) / b.elementy.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          );
        return null;
      })}
    </>
  );
}
