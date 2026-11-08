import type { Metadata } from 'next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { rankingiNaTeraz, produktyRankingu, NAZWY_SEZONOW, Ranking, rankingiZProduktami } from '@/lib/produkty';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Polecane kosmetyki i akcesoria samochodowe na sezon',
  description: 'Sezonowe rankingi chemii, kosmetyków i akcesoriów samochodowych sprawdzonych w filmach MotoFormat – zima, wiosna, lato i jesień.',
  alternates: { canonical: '/polecane/' },
  ...(rankingiZProduktami().length ? {} : { robots: { index: false, follow: true } })
};

function Kafel({ r, wyroznij }: { r: Ranking; wyroznij?: boolean }) {
  const p = produktyRankingu(r);
  return (
    <a
      href={`/polecane/${r.id}/`}
      className={`group block rounded-2xl p-5 border transition-colors h-full ${
        wyroznij ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
      }`}
    >
      <span className={`text-[11px] font-bold uppercase tracking-wider ${wyroznij ? 'text-emerald-100' : 'text-emerald-700 dark:text-emerald-400'}`}>
        {NAZWY_SEZONOW[r.sezon]} • {p.length} {p.length === 1 ? 'produkt' : p.length < 5 ? 'produkty' : 'produktów'}
      </span>
      <span className={`block text-lg font-extrabold mt-1 ${wyroznij ? '' : 'text-slate-900 dark:text-white'}`}>{r.tytul}</span>
      <span className={`block text-sm mt-1 ${wyroznij ? 'text-emerald-50' : 'text-slate-600 dark:text-slate-400'}`}>{r.opis}</span>
      <span className="inline-flex items-center gap-1 font-bold text-sm mt-3">
        Zobacz ranking <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </span>
    </a>
  );
}

export default function PolecanePage() {
  const { teraz, pozostale } = rankingiNaTeraz();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-3">
        <Okruszki sciezka={[{ nazwa: 'Polecane', adres: '/polecane/' }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Polecane kosmetyki i akcesoria na sezon</h1>
        <p className="text-slate-700 dark:text-slate-300">
          Chemia, kosmetyki i akcesoria, które sprawdziliśmy w praktyce – w filmach na kanale albo we własnych autach. Rankingi zmieniają się razem z porą roku.
        </p>
      </div>
      {teraz.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-6 h-6 text-emerald-600" aria-hidden="true" /> Teraz na sezon
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teraz.map((r) => (
              <li key={r.id}>
                <Kafel r={r} wyroznij />
              </li>
            ))}
          </ul>
        </section>
      )}
      {pozostale.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pozostałe rankingi</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pozostale.map((r) => (
              <li key={r.id}>
                <Kafel r={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {!teraz.length && !pozostale.length && (
        <p className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-700 dark:text-slate-300">
          Pierwsze rankingi pojawią się wkrótce.
        </p>
      )}
      <p className="text-xs text-slate-500">Linki do sklepów i porównywarek są partnerskie – jeśli z nich skorzystasz, możemy otrzymać prowizję, a Ty nie płacisz więcej.</p>
      <KodStrony sciezka="/polecane/" />
    </div>
  );
}
