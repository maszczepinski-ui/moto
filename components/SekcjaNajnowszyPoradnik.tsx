import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import { najnowszePoradniki, dataPublikacji, czasCzytania, KATEGORIE, seoPoradnika, typo } from '@/lib/poradniki';

// Strona główna: mała sekcja z najnowszym poradnikiem (zmienia się sama, gdy co tydzień publikujemy nowy).
const dataPl = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

export default function SekcjaNajnowszyPoradnik() {
  const [p, ...wczesniej] = najnowszePoradniki(3);
  if (!p) return null;
  const skrot = seoPoradnika(p).skrot[0] || p.opis;
  return (
    <section aria-labelledby="najnowszy-poradnik" className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
      <Link
        href={`/poradniki/${p.slug}/`}
        className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400 dark:hover:ring-slate-600 p-6 sm:p-7 flex flex-col sm:flex-row gap-5 transition shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]"
      >
        <span className="hidden sm:flex w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 items-center justify-center flex-shrink-0">
          <IkonaPoradnika ikona={p.ikona} className="w-7 h-7" />
        </span>
        <span className="flex-1 min-w-0 space-y-2">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 px-2.5 py-0.5 font-black uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> Najnowszy poradnik
            </span>
            <span className="text-slate-500">
              <time dateTime={dataPublikacji(p)}>{dataPl(dataPublikacji(p))}</time> · {KATEGORIE[p.kategoria].nazwa}
            </span>
          </span>
          <h2 id="najnowszy-poradnik" className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
            {typo(p.tytul)}
          </h2>
          <span className="block text-slate-600 dark:text-slate-400">{typo(skrot)}</span>
          <span className="flex items-center gap-4 pt-1 text-sm">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="w-4 h-4" aria-hidden="true" /> {czasCzytania(p)} min czytania
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-sky-700 dark:text-sky-300">
              Czytaj <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </span>
        </span>
      </Link>

      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-5 flex flex-col gap-3">
        <div className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-500">Nowy poradnik co tydzień</div>
        <ul className="space-y-2 flex-1">
          {wczesniej.map((x) => (
            <li key={x.slug}>
              <Link href={`/poradniki/${x.slug}/`} className="group flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400 p-3">
                <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0">
                  <IkonaPoradnika ikona={x.ikona} />
                </span>
                <span className="flex-1 min-w-0 text-sm font-bold text-slate-900 dark:text-white leading-snug">{x.krotko}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/poradniki/" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300 hover:underline">
          Wszystkie poradniki <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
