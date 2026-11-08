import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Route } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import MapaObiektow from '@/components/MapaObiektow';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Mapa ładowarek samochodów elektrycznych – wpisz miejscowość',
  description:
    'Gdzie naładować auto elektryczne? Wpisz miejscowość albo użyj swojej lokalizacji – zobaczysz ładowarki na mapie: złącza (CCS, Typ 2, CHAdeMO), moc, operator i nawigacja.',
  alternates: { canonical: '/ladowarki/' }
};

export default function LadowarkiPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Ładowarki', adres: '/ladowarki/' }]} />
      <NaglowekDzialu
        zdjecie="elektryki"
        nadtytul="Auta elektryczne"
        tytul="Mapa ładowarek"
        opis="Wpisz miejscowość albo trasę (skąd – dokąd). Pokażemy ładowarki w okolicy lub po drodze: złącza, moc, operatora i nawigację do każdej z nich."
      />

      <MapaObiektow tryb="ladowarki" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white">Skąd są dane?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Ładowarki pochodzą z otwartej mapy OpenStreetMap i aktualizują się same – nowe stacje pojawiają się, gdy ktoś je doda na mapie. Mapa nie pokazuje, czy ładowarka jest
            w tej chwili wolna. Aktualny status (wolna / zajęta / awaria) i ceny sprawdzisz w państwowej ewidencji EIPA albo w aplikacji operatora.
          </p>
          <a href="https://eipa.udt.gov.pl/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-steel-700 dark:text-steel-300 underline">
            Ewidencja EIPA (UDT) <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white">Złącza w skrócie</h2>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400">
            <li>
              <strong>CCS</strong> – szybkie ładowanie prądem stałym, większość nowych aut w Europie.
            </li>
            <li>
              <strong>Typ 2</strong> – ładowanie prądem przemiennym (wolniejsze), potrzebny własny kabel, jeśli stacja go nie ma.
            </li>
            <li>
              <strong>CHAdeMO</strong> – szybkie ładowanie m.in. w starszych Nissanach Leaf i Mitsubishi.
            </li>
          </ul>
          <Link href="/koszt-trasy/" className="inline-flex items-center gap-1 font-semibold text-steel-700 dark:text-steel-300 underline">
            <Route className="w-4 h-4" aria-hidden="true" /> Policz koszt trasy autem elektrycznym
          </Link>
        </div>
      </section>
      <KodStrony sciezka={'/ladowarki/'} />
    </div>
  );
}
