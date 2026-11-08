import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import KalkulatorAkcyzy from '@/components/KalkulatorAkcyzy';
import { OPLATY, STAN_AKCYZY, STAWKI_AKCYZY, ZWOLNIENIE_PHEV_DO } from '@/lib/akcyza';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

export const metadata: Metadata = {
  title: 'Kalkulator akcyzy 2026 – auto z zagranicy',
  description:
    'Policz akcyzę i pełny koszt sprowadzenia auta z Niemiec, UE lub USA: stawki 3,1% i 18,6%, hybrydy, PHEV, cło i VAT, badanie techniczne i opłaty rejestracyjne.',
  alternates: { canonical: '/kalkulator-akcyzy/' }
};

const p = (n: number) => `${String(n).replace('.', ',')}%`;
const zl = (n: number) => `${n.toLocaleString('pl-PL', { minimumFractionDigits: n % 1 ? 2 : 0 })} zł`;
const rejestracja = OPLATY.dowodRejestracyjny + OPLATY.tabliceZwykle + OPLATY.znakiLegalizacyjne + OPLATY.pozwolenieCzasowe;

const FAQ = [
  {
    q: 'Ile wynosi akcyza na samochód w 2026 r.?',
    a: `${p(STAWKI_AKCYZY.spalinowy.do2000)} przy silniku do 2000 cm³ i ${p(STAWKI_AKCYZY.spalinowy.do3500)} powyżej. Hybrydy: ${p(STAWKI_AKCYZY.hybryda.do2000)} do 2000 cm³ i ${p(STAWKI_AKCYZY.hybryda.do3500)} od 2001 do 3500 cm³. Hybrydy plug-in do 2000 cm³ są zwolnione do ${ZWOLNIENIE_PHEV_DO}, a auta elektryczne i wodorowe – całkowicie.`
  },
  {
    q: 'Od jakiej kwoty liczy się akcyzę?',
    a: 'Przy aucie z UE – od ceny z umowy lub faktury przeliczonej na złote (urząd może przyjąć wartość rynkową, jeśli cena jest zaniżona). Przy imporcie spoza UE – od wartości celnej powiększonej o cło.'
  },
  {
    q: 'Ile kosztuje rejestracja auta sprowadzonego z zagranicy?',
    a: `Opłaty w wydziale komunikacji to ${zl(rejestracja)} (dowód, tablice, znaki legalizacyjne i pozwolenie czasowe). Do tego badanie techniczne ${zl(OPLATY.badanie)} (z LPG ${zl(OPLATY.badanie + OPLATY.badanieLpg)}) i – przy aucie z UE – zaświadczenie VAT-25 za ${zl(OPLATY.vat25)}.`
  },
  {
    q: 'Czy za auto z USA płaci się cło?',
    a: 'Od 1 lipca 2026 r. auta wyprodukowane w USA mają cło 0%. Auto kupione w USA, ale wyprodukowane gdzie indziej (np. w Meksyku czy Kanadzie), płaci zwykłe cło 10%. Do tego dochodzą akcyza i VAT 23%.'
  }
];

export default function AkcyzaPage() {
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Kalkulator akcyzy i kosztów sprowadzenia auta',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      inLanguage: 'pl-PL',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' }
    }
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Kalkulator akcyzy', adres: '/kalkulator-akcyzy/' }]} />
      <NaglowekDzialu
        zdjecie="kupujesz"
        nadtytul="Auto z zagranicy"
        tytul="Kalkulator akcyzy i kosztów sprowadzenia auta"
        opis="Akcyza, cło, VAT, badanie techniczne i opłaty rejestracyjne – policz, ile naprawdę kosztuje auto z Niemiec, UE albo USA, zanim je kupisz."
      />

      <KalkulatorAkcyzy />

      <Link href="/poradniki/sprowadzenie-auta-z-zagranicy/" className="flex items-center justify-between gap-3 bg-rust-600 hover:bg-rust-700 text-white rounded-2xl p-5 font-bold">
        <span>Poradnik: sprowadzenie auta krok po kroku – terminy, dokumenty, rejestracja</span>
        <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      </Link>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Najczęstsze pytania o akcyzę</h2>
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
        Stan przepisów: {STAN_AKCYZY}. Wynik jest orientacyjny – wiążąca jest decyzja urzędu skarbowego i celnego. Źródła:{' '}
        <a href="https://arslege.pl/ustawa-o-podatku-akcyzowym/k77/a18651/" target="_blank" rel="noopener noreferrer" className="underline">
          ustawa o podatku akcyzowym, art. 104
        </a>
        ,{' '}
        <a href="https://rankomat.pl/samochod/akcyza-za-samochod" target="_blank" rel="noopener noreferrer" className="underline">
          Rankomat – stawki akcyzy 2026
        </a>
        ,{' '}
        <a href="https://www.otomoto.pl/news/sprowadzenie-auta-z-usa" target="_blank" rel="noopener noreferrer" className="underline">
          Otomoto – cło, akcyza i VAT przy imporcie z USA
        </a>
        ,{' '}
        <a href="https://motokracja.pl/kalkulatory/kalkulator-oplat-rejestracyjnych" target="_blank" rel="noopener noreferrer" className="underline">
          Motokracja – opłaty rejestracyjne
        </a>
        ,{' '}
        <a href="https://www.serwmot.pl/cennik-badan-technicznych/" target="_blank" rel="noopener noreferrer" className="underline">
          cennik badań technicznych
        </a>
        .
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka="/kalkulator-akcyzy/" />
    </div>
  );
}
