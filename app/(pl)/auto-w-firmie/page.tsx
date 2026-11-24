import type { Metadata } from 'next';
import { Calculator } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorFirmy from '@/components/narzedzia/KalkulatorFirmy';
import { CtaFinansowanie, CtaOc, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KWOTY_FIRMA, STAN_FIRMY, slugKwoty } from '@/lib/narzedzia/firma';
import { SEKCJE_FIRMA, PYTANIA_FIRMA, ZRODLA_FIRMA } from '@/lib/narzedzia/firma-tresc';
import { site } from '@/config/site';

const TYTUL = 'Auto w firmie 2026: kalkulator limitu 100 tys.';
const OPIS = 'Ile VAT i podatku odzyskasz z auta firmowego w 2026 r. i ile przepada przez limit 100, 150 lub 225 tys. zł. Leasing, kredyt, użytek mieszany i ryczałt.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/auto-w-firmie/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/auto-w-firmie/` }
};

export default function FirmaPage() {
  return (
    <StronaNarzedzia
      id="firma"
      adres="/auto-w-firmie/"
      okruszki={[{ nazwa: 'Auto w firmie: limit 100 tys. zł', adres: '/auto-w-firmie/' }]}
      zdjecie="glowne"
      nadtytul="Auto w firmie"
      tytul="Ile realnie kosztuje auto w firmie po zmianach w 2026 r.?"
      opis="Wpisz cenę auta, napęd i formę opodatkowania. Policzymy odzyskany VAT, oszczędność na podatku i kwotę, która przepada przez nowy limit."
      nazwaAplikacji="Kalkulator limitu kosztów auta firmowego"
      narzedzie={<KalkulatorFirmy />}
      przedTrescia={
        <SiatkaCta>
          <CtaFinansowanie karta="narzedzie-firma" tytul="Porównaj leasing i kredyt na auto" />
          <CtaOc karta="narzedzie-firma" tytul="Ubezpieczenie auta firmowego" />
        </SiatkaCta>
      }
      sekcje={SEKCJE_FIRMA}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Gotowe wyliczenia dla popularnych kwot</h2>
          <SiatkaCta>
            {KWOTY_FIRMA.map((k) => (
              <Odnosnik key={k} href={`/auto-w-firmie/${slugKwoty(k)}/`} ikona={Calculator} tytul={`Auto za ${k.toLocaleString('pl-PL')} zł netto w firmie`} tekst="Ile odzyskasz i ile stracisz przez limit – dla każdego napędu i formy opodatkowania." />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_FIRMA}
      zrodla={ZRODLA_FIRMA}
      stan={STAN_FIRMY}
      uwaga="To wyliczenie poglądowe, nie porada podatkowa."
    />
  );
}
