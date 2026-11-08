// Strona produktu: Niezbędnik Bezpiecznego Zakupu Auta Używanego (płatny pakiet plików).
// Dopóki w Vercelu brakuje kluczy (lib/sklep/konfiguracja.ts), formularz jest wyłączony, a strona ukryta przed Google.
import type { Metadata } from 'next';
import { CheckCircle2, ClipboardCheck, FileSignature, FileText, Phone, Paintbrush, CalendarClock } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import FormularzZamowienia from '@/components/sklep/FormularzZamowienia';
import { PRODUKT, sklepAktywny, zlotowki } from '@/lib/sklep/konfiguracja';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego',
    description: 'Komplet na oględziny używanego auta: check-lista na telefon, umowa kupna-sprzedaży z klauzulami dla kupującego, protokół odbioru i 15 pytań przez telefon. Pobierasz od razu po płatności.',
    alternates: { canonical: '/niezbednik/' },
    robots: sklepAktywny() ? undefined : { index: false, follow: true }
  };
}

const ZAWARTOSC = [
  { ikona: ClipboardCheck, tytul: 'Check-lista oględzin PRO', opis: '10 etapów: od ogłoszenia, przez silnik na zimno i jazdę próbną, po dokumenty. Czerwone flagi i punkty STOP.' },
  { ikona: FileSignature, tytul: 'Umowa kupna-sprzedaży PRO', opis: 'Oświadczenia sprzedającego o przebiegu, szkodach i obciążeniach, lista znanych wad i rękojmia bez wyłączeń.' },
  { ikona: Phone, tytul: '15 pytań przez telefon', opis: 'Co zapytać, zanim wyjedziesz z domu, i jakie odpowiedzi oznaczają handlarza albo problem.' },
  { ikona: FileText, tytul: 'Protokół zdawczo-odbiorczy', opis: 'Przebieg, klucze, opony, wyposażenie i uszkodzenia – podpisany przez obie strony.' },
  { ikona: Paintbrush, tytul: 'Ściąga: lakier i karoseria', opis: 'Jak mierzyć lakier i czytać różnice między elementami.' },
  { ikona: CalendarClock, tytul: 'Formalności po zakupie', opis: 'Wszystkie terminy w jednym miejscu, z miejscem na daty.' }
];

export default function NiezbednikPage() {
  const cena = zlotowki(PRODUKT.cenaGr);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Niezbędnik', adres: '/niezbednik/' }]} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest text-steel-600 dark:text-steel-400">Kupujesz używane auto?</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{PRODUKT.nazwa}</h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Komplet, który zabierasz na oględziny: lista na telefon, umowa chroniąca kupującego i protokół odbioru. Pobierasz od razu po płatności BLIK.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZAWARTOSC.map((z) => (
              <li key={z.tytul} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <z.ikona className="w-5 h-5 text-steel-600 dark:text-steel-400" aria-hidden="true" />
                <p className="mt-2 font-bold text-slate-900 dark:text-white">{z.tytul}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{z.opis}</p>
              </li>
            ))}
          </ul>
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {['Pliki PDF i DOCX – drukujesz albo wypełniasz na telefonie', 'Link do pobrania od razu na stronie i w mailu', 'Faktura bez VAT (zwolnienie podmiotowe) mailem'].map((x) => (
              <li key={x} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2 lg:sticky lg:top-20">
          <FormularzZamowienia aktywny={sklepAktywny()} cena={cena} regulamin="/niezbednik/regulamin/" />
        </div>
      </div>
      <p className="text-xs text-slate-500 max-w-3xl">
        Pakiet to materiały pomocnicze – nie zastępuje porady prawnej ani przeglądu w warsztacie. Darmowa lista na oględziny i wzory umów są nadal dostępne w asystencie zakupu każdego modelu.
      </p>
    </div>
  );
}
