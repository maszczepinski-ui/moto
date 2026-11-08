import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Gauge } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import MapaObiektow from '@/components/MapaObiektow';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Fotoradary i odcinkowe pomiary prędkości – mapa, wpisz miejscowość',
  description:
    'Gdzie stoją fotoradary i odcinkowe pomiary prędkości? Wpisz miejscowość albo użyj lokalizacji i zobacz urządzenia na mapie. Do tego taryfikator mandatów za prędkość.',
  alternates: { canonical: '/fotoradary/' }
};

export default function FotoradaryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Fotoradary i odcinkowe pomiary', adres: '/fotoradary/' }]} />
      <NaglowekDzialu
        zdjecie="mandaty"
        nadtytul="W trasie"
        tytul="Fotoradary i odcinkowe pomiary"
        opis="Wpisz miejscowość albo trasę, a pokażemy fotoradary (czerwone) i odcinkowe pomiary prędkości (fioletowe) w okolicy. Jedź zgodnie z ograniczeniami – to najtańsza opcja."
      />

      <MapaObiektow tryb="fotoradary" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white">Skąd są dane?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Lokalizacje pochodzą z otwartej mapy OpenStreetMap i aktualizują się same. Mogą nie obejmować najnowszych urządzeń – oficjalną mapę stacjonarnych fotoradarów i
            odcinkowych pomiarów prowadzi CANARD (Główny Inspektorat Transportu Drogowego).
          </p>
          <a href="https://canard.gitd.gov.pl/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-steel-700 dark:text-steel-300 underline">
            Oficjalna mapa CANARD <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white">Jak działa odcinkowy pomiar?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Kamery na początku i na końcu odcinka zapisują czas przejazdu, a system liczy z niego średnią prędkość. Zwolnienie tuż przed kamerą nic nie da – liczy się cały
            odcinek. Mandat i punkty są takie same jak za zwykłe przekroczenie prędkości.
          </p>
          <Link href="/mandaty/" className="inline-flex items-center gap-1 font-semibold text-steel-700 dark:text-steel-300 underline">
            <Gauge className="w-4 h-4" aria-hidden="true" /> Ile za przekroczenie? Kalkulator mandatu
          </Link>
        </div>
      </section>
      <KodStrony sciezka={'/fotoradary/'} />
    </div>
  );
}
