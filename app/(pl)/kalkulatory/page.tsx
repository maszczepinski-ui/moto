import type { Metadata } from 'next';
import { ArrowRight, Calculator } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { H2, KARTA } from '@/components/narzedzia/StronaNarzedzia';
import { KATEGORIE_NARZEDZI, NARZEDZIA, type KategoriaNarzedzia } from '@/lib/narzedzia/lista';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

const TYTUL = 'Kalkulatory motoryzacyjne – zakup, koszty, szkoda';
const OPIS = 'Darmowe kalkulatory dla kierowców: przebieg, negocjacje ceny, formalności po zakupie, auto w firmie, LPG, ładowanie elektryka, szkoda całkowita, felgi i opony.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/kalkulatory/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/kalkulatory/` }
};

/** Starsze narzędzia serwisu – też trafiają na listę */
const INNE = [
  { nazwa: 'Czy wjadę do strefy czystego transportu?', adres: '/strefy-czystego-transportu/', krotko: 'Warszawa i Kraków – do którego roku wjedziesz.' },
  { nazwa: 'Kalkulator akcyzy', adres: '/kalkulator-akcyzy/', krotko: 'Akcyza, cło i VAT za auto z zagranicy.' },
  { nazwa: 'Koszt trasy', adres: '/koszt-trasy/', krotko: 'Paliwo i autostrady na trasie.' },
  { nazwa: 'Kalkulator mandatów', adres: '/mandaty/', krotko: 'Ile kosztuje mandat i ile punktów karnych.' },
  { nazwa: 'Sprawdź VIN', adres: '/sprawdz-vin/', krotko: 'Historia auta po numerze nadwozia.' },
  { nazwa: 'Porównaj OC', adres: '/ubezpieczenie-oc/', krotko: 'Ceny OC i AC u wielu ubezpieczycieli.' },
  { nazwa: 'Opony: rozmiar, wiek i bieżnik', adres: '/opony/', krotko: 'Odczytaj oznaczenia z boku opony.' },
  { nazwa: 'Sprawdź kosztorys po szkodzie', adres: '/po-szkodzie/', krotko: 'Darmowy test zaniżonego odszkodowania z OC.' }
];

export default function KalkulatoryPage() {
  const kategorie = Object.keys(KATEGORIE_NARZEDZI) as KategoriaNarzedzia[];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kalkulatory motoryzacyjne MotoRaport',
    itemListElement: [...NARZEDZIA, ...INNE].map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.nazwa, url: `${site.url}${n.adres}` }))
  };
  const kafel = (n: { nazwa: string; adres: string; krotko: string }) => (
    <a key={n.adres} href={n.adres} className={`${KARTA} p-5 flex items-start gap-3 hover:ring-rust-400 transition`}>
      <Calculator className="w-5 h-5 text-rust-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span className="flex-1">
        <span className="block font-bold text-slate-900 dark:text-white">{n.nazwa}</span>
        <span className="block text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.krotko}</span>
      </span>
      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" aria-hidden="true" />
    </a>
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Kalkulatory', adres: '/kalkulatory/' }]} />
      <NaglowekDzialu zdjecie="glowne" nadtytul="Kalkulatory" tytul="Kalkulatory dla kierowców" opis="Policz, zanim zapłacisz: przy zakupie, sprzedaży, szkodzie i na co dzień. Wszystkie narzędzia są darmowe i działają bez logowania." />
      {kategorie.map((k) => (
        <section key={k} className="space-y-4">
          <h2 className={H2}>{KATEGORIE_NARZEDZI[k]}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{NARZEDZIA.filter((n) => n.kategoria === k).map(kafel)}</div>
        </section>
      ))}
      <section className="space-y-4">
        <h2 className={H2}>Inne narzędzia MotoRaport</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{INNE.map(kafel)}</div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka="/kalkulatory/" />
    </div>
  );
}
