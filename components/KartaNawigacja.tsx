// Dwa elementy z początku karty modelu:
// – WSkrocie: 4–6 najważniejszych faktów, każdy prowadzi do swojej sekcji niżej,
// – SpisKarty: przypięty pasek skrótów do sekcji (na telefonie przewijany w bok).
import Link from 'next/link';

export type Fakt = { etykieta: string; wartosc: string; href?: string; kolor?: 'zielony' | 'zolty' | 'czerwony' };
export type PozycjaSpisu = { id: string; nazwa: string };

const KOLOR = {
  zielony: 'text-emerald-700 dark:text-emerald-300',
  zolty: 'text-amber-700 dark:text-amber-300',
  czerwony: 'text-rose-700 dark:text-rose-300'
};

export function WSkrocie({ fakty }: { fakty: Fakt[] }) {
  if (!fakty.length) return null;
  return (
    <section aria-labelledby="w-skrocie" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 id="w-skrocie" className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        W skrócie
      </h2>
      <dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {fakty.map((f) => {
          const tresc = (
            <>
              <dt className="text-xs text-slate-500">{f.etykieta}</dt>
              <dd className={`font-bold leading-snug ${f.kolor ? KOLOR[f.kolor] : 'text-slate-900 dark:text-white'}`}>{f.wartosc}</dd>
            </>
          );
          return f.href ? (
            <Link key={f.etykieta} href={f.href} className="block rounded-lg -m-1.5 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60">
              {tresc}
            </Link>
          ) : (
            <div key={f.etykieta}>{tresc}</div>
          );
        })}
      </dl>
    </section>
  );
}

export function SpisKarty({ pozycje }: { pozycje: PozycjaSpisu[] }) {
  if (pozycje.length < 3) return null;
  return (
    <nav aria-label="Spis treści karty" className="sticky top-16 z-30 -mx-4 px-4 py-2 !mt-6 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 print:hidden">
      <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pozycje.map((p) => (
          <li key={p.id} className="flex-shrink-0">
            <a
              href={`#${p.id}`}
              className="block rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-steel-400 hover:text-steel-700 dark:hover:text-steel-300 whitespace-nowrap"
            >
              {p.nazwa}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
