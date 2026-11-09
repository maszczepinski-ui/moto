// Boks w poradnikach o kolizji i odszkodowaniu: zaprasza do DARMOWEGO testu kosztorysu, więc pokazuje się zawsze
// (także zanim ruszy sprzedaż pakietu). Spokojny boks bez pop-upów.
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';

/** Poradniki, pod którymi pokazujemy boks */
export const PORADNIKI_SZKODY = ['odszkodowanie-z-oc-sprawcy', 'kolizja-bez-policji', 'szkoda-calkowita-co-dalej'];

export default function BoksPoSzkodzie() {
  return (
    <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 p-5 flex flex-col sm:flex-row sm:items-center gap-4 print:hidden">
      <Scale className="w-10 h-10 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 dark:text-white">Masz już kosztorys od ubezpieczyciela?</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">7 pytań, 1 minuta: sprawdź, czy wypłata nie jest zaniżona przez zamienniki, potrącenia, rabaty albo brak VAT.</p>
      </div>
      <Link href="/po-szkodzie/#test" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-3 text-sm whitespace-nowrap">
        Darmowy test kosztorysu
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
