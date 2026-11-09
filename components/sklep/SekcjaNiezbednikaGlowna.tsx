// Strona główna: baner Niezbędnika. Pokazuje się TYLKO, gdy sklep działa (wszystkie klucze w Vercelu).
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import MakietaPakietu from './MakietaPakietu';
import { PRODUKT, sklepAktywny, zlotowki } from '@/lib/sklep/konfiguracja';

export default function SekcjaNiezbednikaGlowna() {
  if (!sklepAktywny()) return null;
  return (
    <section aria-labelledby="niezbednik-glowna" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-steel-900 text-white">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-center p-6 sm:p-10">
        <div className="md:col-span-3 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Niezbędnik
          </p>
          <h2 id="niezbednik-glowna" className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Jedziesz oglądać używane auto? <span className="text-amber-300">Zabierz komplet.</span>
          </h2>
          <ul className="space-y-2 text-slate-200">
            {['Check-lista na telefon z punktami STOP – wiesz, kiedy odpuścić', 'Umowa z oświadczeniami sprzedającego o przebiegu i szkodach', 'Protokół odbioru i 15 pytań przez telefon przed wyjazdem'].map((x) => (
              <li key={x} className="flex gap-2 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-300 flex-shrink-0" aria-hidden="true" /> {x}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link href="/niezbednik/?z=glowna" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-3">
              Zobacz Niezbędnik · {zlotowki(PRODUKT.cenaGr)} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <span className="text-sm text-slate-400">Pobierasz od razu po płatności BLIK</span>
          </div>
        </div>
        <div className="md:col-span-2 hidden sm:block">
          <MakietaPakietu mala />
        </div>
      </div>
    </section>
  );
}
