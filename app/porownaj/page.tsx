import type { Metadata } from 'next';
import { wszystkiePary } from '@/lib/porownania';
import { nazwaKarty } from '@/lib/opis';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Porównania aut – który model wybrać?',
  description: 'Porównania popularnych aut „A czy B” na podstawie danych CEPiK: liczba aut w Polsce, roczniki, paliwa, pochodzenie, wymiary i silniki.',
  alternates: { canonical: '/porownaj/' }
};

export default function PorownaniaPage() {
  const pary = [...wszystkiePary()].sort((x, y) => y.a.cepik.liczbaWPolsce + y.b.cepik.liczbaWPolsce - (x.a.cepik.liczbaWPolsce + x.b.cepik.liczbaWPolsce));
  const marki = [...new Set(pary.map((p) => p.a.marka))].sort((x, y) => x.localeCompare(y, 'pl'));
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Porównania', adres: '/porownaj/' }]} />
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Porównania aut</h1>
        <p className="text-slate-600 dark:text-slate-300">{pary.length} porównań popularnych modeli i ich konkurentów – na podstawie danych o zarejestrowanych autach w Polsce.</p>
      </header>
      {marki.map((mk) => (
        <section key={mk}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{mk}</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {pary
              .filter((p) => p.a.marka === mk)
              .map((p) => (
                <li key={p.id}>
                  <a href={`/porownaj/${p.id}/`} className="inline-block px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400">
                    {nazwaKarty(p.a)} vs {nazwaKarty(p.b)}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <KodStrony sciezka="/porownaj/" />
    </div>
  );
}
