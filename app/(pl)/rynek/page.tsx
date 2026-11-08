import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ExternalLink } from 'lucide-react';
import rynek from '@/data/rynek-nowych.json';
import { fmt } from '@/lib/format';
import KodStrony from '@/components/KodStrony';

// Statystyki rynku NOWYCH aut z raportów IBRM Samar (na podstawie CEPiK) – uzupełnienie atlasu o najświeższe miesiące.
// Dane wpisywane ręcznie w data/rynek-nowych.json (zawsze z podaniem źródła).
export const metadata: Metadata = {
  title: 'Rynek nowych aut w Polsce – marki, modele, chińskie auta',
  description: 'Najczęściej rejestrowane nowe samochody w Polsce: marki, modele i chińscy producenci (MG, Omoda, BYD, Jaecoo, Chery). Dane IBRM Samar na podstawie CEPiK.',
  alternates: { canonical: '/rynek/' }
};

function Lista({ tytul, pozycje }: { tytul: string; pozycje: (string | number)[][] }) {
  const max = Math.max(1, ...pozycje.map((p) => Number(p[1])));
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{tytul}</h2>
      <ol className="space-y-2.5">
        {pozycje.map(([nazwa, n], i) => (
          <li key={String(nazwa)}>
            <div className="flex justify-between gap-3 text-sm mb-1">
              <span className="text-slate-700 dark:text-slate-300">
                <span className="text-slate-400 tabular-nums mr-2">{i + 1}.</span>
                {nazwa}
              </span>
              <strong className="tabular-nums text-slate-900 dark:text-white">{fmt(Number(n))}</strong>
            </div>
            <div className="h-1.5 rounded bg-slate-100 dark:bg-slate-800">
              <div className="h-1.5 rounded bg-rust-500" style={{ width: `${(Number(n) / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function RynekPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          <TrendingUp className="w-8 h-8 text-rust-600" aria-hidden="true" /> Rynek nowych aut
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Jakie <strong>nowe</strong> auta kupują teraz Polacy. Atlas pokazuje wszystkie zarejestrowane auta, a tu znajdziesz najświeższe miesięczne statystyki rynku nowych samochodów –
          w tym rosnącą falę chińskich marek.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Najważniejsze liczby</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rynek.fakty.map((f) => (
            <li key={f.tekst} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>{f.tekst}</p>
              <a href={f.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs text-steel-600 dark:text-steel-400 hover:underline">
                Źródło: {f.zrodlo} <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {rynek.okresy.map((o) => (
        <section key={o.id} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Nowe osobówki: {o.tytul} – {fmt(o.razem)} szt. ({o.zmianaRdR > 0 ? '+' : ''}
            {String(o.zmianaRdR).replace('.', ',')}% rok do roku)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Lista tytul="Marki" pozycje={o.marki} />
            <Lista tytul="Modele" pozycje={o.modele} />
            <Lista tytul="Marki chińskie" pozycje={o.chinskie} />
          </div>
          <p className="text-xs text-slate-500">
            Udział chińskich marek: {o.udzialChinskich}. Źródło:{' '}
            <a href={o.url} target="_blank" rel="noopener" className="underline">
              {o.zrodlo}
            </a>
            .
          </p>
        </section>
      ))}

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Chcesz zobaczyć, ile danego modelu jeździ w Polsce i w których województwach? Sprawdź{' '}
<Link href="/chinskie-samochody/" className="underline font-semibold">
          ranking chińskich samochodów {new Date().getFullYear()}
        </Link>
        ,{' '}
        <Link href="/rankingi/chinskie/" className="underline font-semibold">
          ranking chińskich marek
        </Link>
        ,{' '}
        <Link href="/rankingi/hybrydy/" className="underline font-semibold">
          najpopularniejsze hybrydy
        </Link>{' '}
        albo{' '}
        <Link href="/#modele" className="underline font-semibold">
          wyszukaj model
        </Link>
        .
      </p>
      <KodStrony sciezka={'/rynek/'} />
    </div>
  );
}
