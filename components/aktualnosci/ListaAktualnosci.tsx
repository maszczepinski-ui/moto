import Link from 'next/link';
import { ArrowRight, Wrench, Landmark, Sparkles, CarFront } from 'lucide-react';
import { TYPY, bezLamania, type Aktualnosc, type TypAktualnosci } from '@/lib/aktualnosci';
import { formatDate } from '@/lib/format';

export const STYL_TYPU: Record<TypAktualnosci, { ikona: typeof Wrench; chip: string; pasek: string }> = {
  'akcje-serwisowe': { ikona: Wrench, chip: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300', pasek: 'bg-amber-500' },
  komunikaty: { ikona: Landmark, chip: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300', pasek: 'bg-sky-500' },
  premiery: { ikona: Sparkles, chip: 'bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300', pasek: 'bg-violet-500' },
  'jakie-auto': { ikona: CarFront, chip: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300', pasek: 'bg-emerald-500' }
};

export function ChipTypu({ typ }: { typ: TypAktualnosci }) {
  const S = STYL_TYPU[typ];
  const I = S.ikona;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${S.chip}`}>
      <I className="w-3 h-3" aria-hidden="true" /> {TYPY[typ].krotko}
    </span>
  );
}

export function KartaAktualnosci({ a }: { a: Aktualnosc }) {
  return (
    <Link
      href={`/aktualnosci/${a.slug}/`}
      className="group h-full flex flex-col gap-3 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400 dark:hover:ring-slate-600 p-5 transition shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]"
    >
      {a.zdjecie && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.zdjecie.male} alt={a.zdjecie.alt} width={800} height={Math.round((800 * a.zdjecie.wysokosc) / a.zdjecie.szerokosc)} loading="lazy" className="-mx-5 -mt-5 mb-1 w-[calc(100%+2.5rem)] max-w-none aspect-[16/9] object-cover" />
      )}
      <span className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <ChipTypu typ={a.typ} />
        <time dateTime={a.data}>{formatDate(a.data)}</time>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">{bezLamania(a.tytul)}</span>
      <span className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-3">{a.lead}</span>
      <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300">
        Czytaj <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function SiatkaAktualnosci({ lista }: { lista: Aktualnosc[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lista.map((a) => (
        <li key={a.slug}>
          <KartaAktualnosci a={a} />
        </li>
      ))}
    </ul>
  );
}

export function ZakladkiTypow({ aktywny }: { aktywny?: TypAktualnosci }) {
  const kl = (on: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${
      on ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 ring-slate-200 dark:ring-slate-800 hover:ring-slate-400'
    }`;
  return (
    <nav aria-label="Rodzaje aktualności" className="flex flex-wrap gap-2">
      <Link href="/aktualnosci/" className={kl(!aktywny)}>
        Wszystkie
      </Link>
      {(Object.keys(TYPY) as TypAktualnosci[]).map((t) => (
        <Link key={t} href={`/aktualnosci/${t}/`} className={kl(aktywny === t)}>
          {TYPY[t].nazwa}
        </Link>
      ))}
    </nav>
  );
}

export function PustaLista() {
  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-8 text-center text-slate-600 dark:text-slate-400">
      Pierwsze wpisy pojawią się tu wkrótce. Do tego czasu zajrzyj do{' '}
      <Link href="/poradniki/" className="font-bold underline">
        poradników
      </Link>
      .
    </div>
  );
}
