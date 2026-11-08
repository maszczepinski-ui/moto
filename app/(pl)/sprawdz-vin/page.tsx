import type { Metadata } from 'next';
import { hreflang } from '@/lib/tlumaczenia';
import { ExternalLink, ScanLine, FileText, Car, ArrowRight } from 'lucide-react';
import { BoksVin } from '@/components/Monetyzacja';
import { pokazModul } from '@/lib/panel';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Sprawdź auto po numerze VIN – historia, przebieg, szkody',
  description:
    'Gdzie znaleźć numer VIN, jak darmowo sprawdzić auto zarejestrowane w Polsce i kiedy warto kupić pełny raport z zagranicznych baz (przebieg, szkody, zdjęcia).',
  alternates: { canonical: '/sprawdz-vin/', languages: hreflang('/sprawdz-vin/') }
};

const K = { slug: 'sprawdz-vin', marka: '', model: '' };

const GDZIE = [
  { ikona: FileText, t: 'Dowód rejestracyjny', o: 'Pole E – 17 znaków (litery i cyfry, bez I, O i Q).' },
  { ikona: ScanLine, t: 'Pod przednią szybą', o: 'Tabliczka widoczna z zewnątrz, zwykle po stronie kierowcy.' },
  { ikona: Car, t: 'Na nadwoziu', o: 'Tabliczka znamionowa i numer wybity na karoserii – zwykle w komorze silnika lub pod fotelem.' }
];

export default function SprawdzVinPage() {
  const vin = pokazModul('vin', K);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-4">
        <Okruszki sciezka={[{ nazwa: 'Sprawdź VIN', adres: '/sprawdz-vin/' }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Sprawdź auto po numerze VIN</h1>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Zanim pojedziesz oglądać auto, poproś sprzedającego o numer VIN. W kilka minut sprawdzisz, czy przebieg się zgadza, czy auto miało szkody i jak wyglądało wcześniej.
          Uczciwy sprzedający nie ma problemu z podaniem numeru.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {vin && <BoksVin k={K} />}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">Za darmo</span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Historia Pojazdu (gov.pl)</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dla aut zarejestrowanych w Polsce: przebiegi z badań technicznych, ważność OC i przeglądu. Potrzebujesz numeru VIN, numeru rejestracyjnego i daty pierwszej rejestracji.
            Nie pokaże historii sprzed sprowadzenia auta do Polski – do tego służy raport z zagranicznych baz.
          </p>
          <a href="https://historiapojazdu.gov.pl/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-steel-700 dark:text-steel-300 underline">
            Otwórz historiapojazdu.gov.pl <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gdzie znaleźć numer VIN</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GDZIE.map(({ ikona: Ikona, t, o }) => (
            <li key={t} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Ikona className="w-6 h-6 text-steel-600 mb-2" aria-hidden="true" />
              <h3 className="font-bold text-slate-900 dark:text-white">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{o}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400">Wszystkie trzy numery muszą być identyczne. Jeśli się różnią albo tabliczka wygląda na ruszaną – zrezygnuj z zakupu.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Na co patrzeć w raporcie</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
          <li>Czy kolejne odczyty przebiegu rosną – spadek albo duża dziura w historii to sygnał ostrzegawczy.</li>
          <li>Szkody i ich koszt – drobna stłuczka to co innego niż naprawa za kilkadziesiąt tysięcy.</li>
          <li>Zdjęcia z ogłoszeń i aukcji – czy auto nie było sprzedawane jako uszkodzone.</li>
          <li>Kraje, w których auto było zarejestrowane, i liczba właścicieli.</li>
          <li>Zgodność wersji, silnika i wyposażenia z tym, co jest w ogłoszeniu.</li>
        </ul>
      </section>

      <a href="/asystent-zakupu/" className="flex items-center justify-between gap-3 bg-rust-600 hover:bg-rust-700 text-white rounded-2xl p-5 font-bold">
        <span>Asystent zakupu: typowe usterki modelu, lista do oględzin i formalności po zakupie</span>
        <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      </a>
      <KodStrony sciezka="/sprawdz-vin/" />
    </div>
  );
}
