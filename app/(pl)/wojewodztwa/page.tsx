import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import MiniMapa from '@/components/MiniMapa';
import { listaWojewodztw, tlo } from '@/lib/dane';
import { fmt, formatDate } from '@/lib/format';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Auta w województwach – co jeździ w Twoim regionie',
  description: 'Najpopularniejsze modele aut w każdym województwie, modele charakterystyczne dla regionu i wiek zarejestrowanych samochodów. Dane CEPiK.',
  alternates: { canonical: '/wojewodztwa/' }
};

// kolory mapy według średniego rocznika (starsze auta = ciemniej)
function klasaRocznika(r: number | null, min: number, max: number) {
  if (r === null) return 'fill-slate-200 dark:fill-slate-800';
  const x = (r - min) / Math.max(0.1, max - min);
  if (x < 0.2) return 'fill-rust-600 dark:fill-rust-500 hover:opacity-80';
  if (x < 0.4) return 'fill-rust-400 dark:fill-rust-700 hover:opacity-80';
  if (x < 0.6) return 'fill-rust-200 dark:fill-rust-900 hover:opacity-80';
  if (x < 0.8) return 'fill-steel-200 dark:fill-steel-800 hover:opacity-80';
  return 'fill-steel-400 dark:fill-steel-600 hover:opacity-80';
}

export default function WojewodztwaPage() {
  const roczniki = listaWojewodztw.map((w) => w.sredniRocznik ?? 0).filter(Boolean);
  const min = Math.min(...roczniki);
  const max = Math.max(...roczniki);
  const klasy = Object.fromEntries(listaWojewodztw.map((w) => [w.teryt, klasaRocznika(w.sredniRocznik, min, max)]));
  const etykiety = Object.fromEntries(listaWojewodztw.map((w) => [w.teryt, w.sredniRocznik ? w.sredniRocznik.toFixed(1).replace('.', ',') : '']));
  const najstarsze = [...listaWojewodztw].sort((a, b) => (a.sredniRocznik ?? 0) - (b.sredniRocznik ?? 0))[0];
  const najmlodsze = [...listaWojewodztw].sort((a, b) => (b.sredniRocznik ?? 0) - (a.sredniRocznik ?? 0))[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="flex items-center gap-2 text-4xl font-extrabold text-slate-900 dark:text-white">
          <MapPin className="w-8 h-8 text-steel-600" aria-hidden="true" /> Auta w województwach
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Co jeździ w Twoim regionie? Wybierz województwo, żeby zobaczyć najpopularniejsze modele i te, które są tam wyjątkowo częste.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <figure className="lg:col-span-3 space-y-3">
          <MiniMapa klasy={klasy} etykiety={etykiety} opis="Mapa Polski: średni rocznik zarejestrowanych samochodów osobowych w województwach" />
          <figcaption className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Średni rocznik zarejestrowanych osobówek</strong> (pomarańczowy = starsze auta, niebieski = młodsze). Najstarsze auta: {najstarsze.nazwa.toLowerCase()} (średnio{' '}
            {(najstarsze.sredniRocznik ?? 0).toFixed(1).replace('.', ',')}), najmłodsze: {najmlodsze.nazwa.toLowerCase()} ({(najmlodsze.sredniRocznik ?? 0).toFixed(1).replace('.', ',')}). Różnice są
            niewielkie, bo w całym kraju jeździ dużo aut z lat 90. Kliknij województwo, żeby zobaczyć szczegóły.
          </figcaption>
        </figure>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Województwa</caption>
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500">
              <tr>
                <th scope="col" className="text-left font-semibold px-3 py-2">Województwo</th>
                <th scope="col" className="text-right font-semibold px-3 py-2">Osobówek</th>
                <th scope="col" className="text-right font-semibold px-3 py-2 whitespace-nowrap">Śr. rocznik</th>
              </tr>
            </thead>
            <tbody>
              {listaWojewodztw.map((w) => (
                <tr key={w.teryt} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-1.5">
                    <Link href={`/wojewodztwa/${w.slug}/`} className="font-semibold text-steel-700 dark:text-steel-300 hover:underline">
                      {w.nazwa}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt(w.auta)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{w.sredniRocznik ? w.sredniRocznik.toFixed(1).replace('.', ',') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Dane: CEPiK, stan na {formatDate(tlo.stanNa)}. Liczone są zarejestrowane samochody osobowe (także te, które latami stoją nieużywane). Więcej w zakładce{' '}
        <Link href="/metodologia/" className="underline">
          Skąd dane
        </Link>
        .
      </p>
      <KodStrony sciezka={'/wojewodztwa/'} />
    </div>
  );
}
