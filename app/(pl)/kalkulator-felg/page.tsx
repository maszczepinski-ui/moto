import type { Metadata } from 'next';
import { CircleDot, Ruler } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorFelg from '@/components/narzedzia/KalkulatorFelg';
import { CtaOpony, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { POPULARNE, STAN_FELG, nazwaOpony, slugOpony } from '@/lib/narzedzia/felgi';
import { SEKCJE_FELGI, PYTANIA_FELGI, ZRODLA_FELGI } from '@/lib/narzedzia/felgi-tresc';
import { site } from '@/config/site';

const TYTUL = 'Kalkulator felg i ET – czy koła się zmieszczą?';
const OPIS = 'Porównaj obecne i nowe koła: szerokość opony, felgi (J) i ET. Zobacz na rysunku, o ile koło wysunie się w nadkolu, jak zmieni się prześwit i odczyt licznika.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/kalkulator-felg/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/kalkulator-felg/` }
};

export default function FelgiPage() {
  return (
    <StronaNarzedzia
      id="felgi"
      adres="/kalkulator-felg/"
      okruszki={[{ nazwa: 'Kalkulator felg i ET', adres: '/kalkulator-felg/' }]}
      zdjecie="opony"
      nadtytul="Kalkulator felg, opon i ET"
      tytul="Czy nowe felgi i opony zmieszczą się w nadkolu?"
      opis="Wpisz rozmiar obecnych i nowych kół. Pokażemy na rysunku, o ile opona przesunie się w stronę błotnika i zawieszenia, jak zmieni się średnica koła i odczyt prędkościomierza."
      nazwaAplikacji="Kalkulator felg, opon i ET"
      narzedzie={<KalkulatorFelg />}
      przedTrescia={
        <SiatkaCta>
          <CtaOpony karta="narzedzie-felgi" />
          <Odnosnik href="/zamiennik-opon/" ikona={Ruler} tytul="Zamienniki rozmiaru opon" tekst="Jakie rozmiary mają prawie tę samą średnicę koła." />
          <Odnosnik href="/opony/" ikona={CircleDot} tytul="Co znaczy rozmiar, DOT i bieżnik" tekst="Odczytaj oznaczenia z boku opony i sprawdź jej wiek." />
        </SiatkaCta>
      }
      sekcje={SEKCJE_FELGI}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Zamienniki popularnych rozmiarów opon</h2>
          <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2 text-sm">
            {POPULARNE.map((o) => (
              <li key={slugOpony(o)}>
                <a href={`/zamiennik-opon/${slugOpony(o)}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                  {nazwaOpony(o)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
      pytania={PYTANIA_FELGI}
      zrodla={ZRODLA_FELGI}
      stan={STAN_FELG}
      uwaga="Wyniki są orientacyjne – luz w nadkolu zależy od konkretnego auta."
    />
  );
}
