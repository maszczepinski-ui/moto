import type { Metadata } from 'next';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { KalkulatorPredkosci, KalkulatorPunktow } from '@/components/KalkulatorMandatu';
import { TabelaPredkosci, TabelaWykroczen, ZrodlaMandatow } from '@/components/TabelaMandatow';
import { STAN_PRZEPISOW } from '@/lib/mandaty';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

export const metadata: Metadata = {
  title: `Taryfikator mandatów ${STAN_PRZEPISOW.split(' ')[1]} – kalkulator mandatu i punktów karnych`,
  description:
    'Ile zapłacisz za przekroczenie prędkości i ile dostaniesz punktów karnych? Kalkulator mandatu, kalkulator punktów, recydywa i zatrzymanie prawa jazdy – aktualne przepisy.',
  alternates: { canonical: '/mandaty/' }
};

const FAQ = [
  {
    q: 'Kiedy znikają punkty karne?',
    a: 'Po roku od zapłacenia mandatu. Jeśli sprawa trafiła do sądu – po roku od uprawomocnienia się wyroku. Kurs w WORD może zmniejszyć liczbę punktów maksymalnie o 6.'
  },
  {
    q: 'Za co zatrzymują prawo jazdy?',
    a: 'Za przekroczenie prędkości o ponad 50 km/h w obszarze zabudowanym oraz – od 3 marca 2026 r. – poza obszarem zabudowanym na drodze jednojezdniowej dwukierunkowej. Prawo jazdy zatrzymuje się na 3 miesiące.'
  },
  {
    q: 'Co to jest recydywa?',
    a: 'Gdy w ciągu 2 lat popełnisz ponownie to samo poważne wykroczenie (np. przekroczenie prędkości o ponad 30 km/h albo nieustąpienie pierwszeństwa pieszemu), mandat jest dwa razy wyższy. Liczba punktów się nie zmienia.'
  },
  {
    q: 'Jaki jest limit punktów karnych?',
    a: '24 punkty dla kierowców, którzy mają prawo jazdy dłużej niż rok, i 20 punktów w pierwszym roku od zdobycia prawa jazdy.'
  }
];

export default function MandatyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Mandaty i punkty', adres: '/mandaty/' }]} />
      <NaglowekDzialu
        zdjecie="mandaty"
        nadtytul="Przepisy"
        tytul="Mandaty i punkty karne"
        opis="Sprawdź, ile kosztuje przekroczenie prędkości, ile punktów Ci zostało do limitu i kiedy policja zatrzymuje prawo jazdy."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <KalkulatorPredkosci />
        <KalkulatorPunktow />
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Taryfikator: przekroczenie prędkości</h2>
        <TabelaPredkosci />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inne częste wykroczenia</h2>
        <TabelaWykroczen />
      </section>

      <Link href="/fotoradary/" className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-5">
        <Camera className="w-8 h-8 text-rust-400 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-bold text-lg">Fotoradary i odcinkowe pomiary na mapie</span>
          <span className="block text-sm text-slate-300">Wpisz miejscowość i zobacz, gdzie stoją urządzenia.</span>
        </span>
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
        <div className="space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer">{f.q}</summary>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <ZrodlaMandatow />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka={'/mandaty/'} />
    </div>
  );
}
