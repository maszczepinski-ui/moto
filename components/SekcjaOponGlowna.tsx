import Link from 'next/link';
import { ArrowRight, Ruler, CalendarClock, Gauge, ExternalLink } from 'lucide-react';
import SezonOpon from '@/components/SezonOpon';
import LinkPartnerski from '@/components/LinkPartnerski';
import ZdjecieTla from '@/components/ZdjecieTla';
import { sklepOpon } from '@/lib/panel';

// Sekcja o oponach na stronie głównej: sezon, trzy szybkie testy i (gdy jest w panelu) sklep partnera.
export default function SekcjaOponGlowna() {
  const sklep = sklepOpon();
  const testy = [
    {
      href: '/opony/#rozmiar',
      ikona: Ruler,
      t: 'Rozmiar opony',
      o: 'Co znaczy 205/55 R16 91V',
      wizual: (
        <div className="flex items-end gap-1.5 font-mono font-black text-xl text-slate-900 dark:text-white">
          {[
            ['205', 'bg-sky-500'],
            ['55', 'bg-violet-500'],
            ['R16', 'bg-emerald-500'],
            ['91V', 'bg-amber-500']
          ].map(([k, c]) => (
            <span key={k} className="flex flex-col items-center gap-1">
              {k}
              <span className={`h-1.5 w-full rounded-full ${c}`} />
            </span>
          ))}
        </div>
      )
    },
    {
      href: '/opony/#wiek',
      ikona: CalendarClock,
      t: 'Wiek z kodu DOT',
      o: 'Ile lat ma Twoja opona',
      wizual: (
        <div className="space-y-2">
          <span className="inline-block font-mono text-sm tracking-widest text-slate-400">
            DOT … <span className="rounded-full ring-2 ring-rust-500 text-slate-900 dark:text-white font-black px-2 py-0.5">2321</span>
          </span>
          <div className="flex h-2 rounded-full overflow-hidden">
            <span className="w-5/12 bg-emerald-500" />
            <span className="w-5/12 bg-amber-400" />
            <span className="flex-1 bg-rose-500" />
          </div>
        </div>
      )
    },
    {
      href: '/opony/#bieznik',
      ikona: Gauge,
      t: 'Bieżnik',
      o: 'Czy jeszcze legalny i bezpieczny',
      wizual: (
        <div className="flex items-end gap-1.5 h-12">
          {[8, 6.5, 5, 4, 3, 2, 1.4].map((mm) => (
            <span key={mm} className={`flex-1 rounded-t-[4px] ${mm < 1.6 ? 'bg-rose-500' : mm < 4 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ height: `${(mm / 8) * 100}%` }} />
          ))}
        </div>
      )
    }
  ];
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-950 text-white p-7 sm:p-8 flex flex-col justify-between gap-6 min-h-[18rem]">
        <ZdjecieTla klucz="opony" className="opacity-25 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/60 via-slate-950/70 to-slate-950" aria-hidden="true" />
        <div className="relative space-y-4">
          <SezonOpon />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.05]">
            Opony
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">pod kontrolą.</span>
          </h2>
          <p className="text-white/75">Zasada 7°C, przepisy i szybka kontrola bieżnika – zanim spadnie pierwszy śnieg.</p>
        </div>
        <div className="relative flex flex-wrap gap-2">
          <Link href="/opony/" className="inline-flex items-center gap-2 bg-white text-slate-900 font-extrabold px-5 py-3 rounded-xl hover:bg-sky-50">
            Sprawdź opony <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          {sklep && (
            <LinkPartnerski href={sklep.url} partner={sklep.nazwa.toLowerCase()} modul="opony" karta="strona-glowna" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 ring-1 ring-white/30 font-bold px-5 py-3 rounded-xl">
              Opony w {sklep.nazwa} <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          )}
        </div>
      </div>
      <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {testy.map(({ href, ikona: I, t, o, wizual }, i) => (
          <li key={href}>
            <Link
              href={href}
              className="group h-full flex flex-col justify-between gap-6 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-sky-400 p-6 transition shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-[0.2em] text-rust-600">0{i + 1}</span>
                <span className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <I className="w-5 h-5" aria-hidden="true" />
                </span>
              </div>
              <div aria-hidden="true">{wizual}</div>
              <div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">{t}</div>
                <div className="text-sm text-slate-500">{o}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300">
                  Sprawdź <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
