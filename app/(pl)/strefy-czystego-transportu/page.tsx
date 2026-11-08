import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import KalkulatorSct from '@/components/KalkulatorSct';
import { MIASTA_SCT, STAN_SCT } from '@/lib/sct';
import { poradnik } from '@/lib/poradniki';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

export const metadata: Metadata = {
  title: 'Czy wjadę do SCT? Kalkulator Warszawa i Kraków',
  description:
    'Sprawdź, czy Twoje auto wjedzie do strefy czystego transportu w Warszawie i Krakowie – i do którego roku. Rocznik albo norma Euro, zwolnienia i oś czasu do 2034 r.',
  alternates: { canonical: '/strefy-czystego-transportu/' }
};

const FAQ = [
  {
    q: 'Jakie auta mogą wjechać do strefy czystego transportu w Warszawie w 2026 r.?',
    a: 'Benzynowe i z LPG – spełniające normę Euro 3 albo wyprodukowane w 2000 r. lub później. Diesle – Euro 5 albo od 2009 r. Od 2028 r.: benzyna Euro 4 lub od 2005 r., diesel Euro 6 lub od 2014 r.'
  },
  {
    q: 'Jakie auta wjadą do SCT w Krakowie?',
    a: 'Benzynowe i z LPG – Euro 4 albo rocznik 2005 i nowsze. Diesle do 3,5 t – Euro 6 albo od 2014 r. Do końca 2028 r. auto niespełniające norm wjedzie za opłatą, a mieszkańcy z autem kupionym przed 26 czerwca 2025 r. mają zwolnienie.'
  },
  {
    q: 'Czy hybryda może wjechać do strefy czystego transportu?',
    a: 'Hybrydy nie mają ustawowego zwolnienia – liczy się norma Euro lub rocznik ich silnika spalinowego. Bez ograniczeń wjeżdżają tylko auta elektryczne, wodorowe i napędzane gazem ziemnym (CNG).'
  },
  {
    q: 'Wystarczy rocznik, czy trzeba znać normę Euro?',
    a: 'Wystarczy jedno z dwóch. Auto spełnia wymagania, jeśli ma odpowiednią normę Euro albo jest wyprodukowane w wymaganym roku lub później.'
  },
  { q: 'Ile wynosi kara za wjazd do SCT?', a: 'Do 500 zł.' }
];

export default function StrefyPage() {
  const p = poradnik('strefa-czystego-transportu');
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Kalkulator wjazdu do strefy czystego transportu',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      inLanguage: 'pl-PL',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' }
    }
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Strefy czystego transportu', adres: '/strefy-czystego-transportu/' }]} />
      <NaglowekDzialu
        zdjecie="trasa"
        nadtytul="Kalkulator SCT"
        tytul="Czy Twoje auto wjedzie do strefy czystego transportu?"
        opis={`Wybierz napęd i rocznik albo normę Euro – zobaczysz, czy wjedziesz do strefy ${MIASTA_SCT.map((m) => m.wMiescie).join(' i ')} i do którego roku.`}
      />

      <KalkulatorSct />

      {p && (
        <Link href={`/poradniki/${p.slug}/`} className="flex items-center justify-between gap-3 bg-rust-600 hover:bg-rust-700 text-white rounded-2xl p-5 font-bold">
          <span>Poradnik: wszystko o strefach czystego transportu</span>
          <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        </Link>
      )}

      <section className="max-w-3xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Najczęstsze pytania o SCT</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 sm:px-6">
              <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{f.q}</span>
                <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Stan przepisów: {STAN_SCT}. Źródła:{' '}
        {MIASTA_SCT.map((m, i) => (
          <span key={m.id}>
            {i > 0 && ', '}
            <a href={m.zrodlo.url} target="_blank" rel="noopener noreferrer" className="underline">
              {m.zrodlo.n}
            </a>
          </span>
        ))}
        ,{' '}
        <a href="https://standardyprawa.pl/akt/556/art/64042" target="_blank" rel="noopener noreferrer" className="underline">
          ustawa o elektromobilności, art. 39
        </a>
        .
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka="/strefy-czystego-transportu/" />
    </div>
  );
}
