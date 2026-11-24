import type { Metadata } from 'next';
import { Globe2, Calculator } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorSprowadzenia from '@/components/narzedzia/KalkulatorSprowadzenia';
import { CtaVin, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KRAJE, STAN_SPROWADZENIA } from '@/lib/narzedzia/sprowadzenie';
import { SEKCJE_SPROWADZENIE, PYTANIA_SPROWADZENIE, ZRODLA_SPROWADZENIE } from '@/lib/narzedzia/sprowadzenie-tresc';
import { site } from '@/config/site';

const TYTUL = 'Koszt sprowadzenia auta 2026 – kalkulator';
const OPIS = 'Ile kosztuje sprowadzenie auta z Niemiec, Belgii, Holandii czy USA: transport, akcyza, tłumaczenia i rejestracja. Porównaj z ceną podobnego auta w Polsce.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/koszt-sprowadzenia-auta/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/koszt-sprowadzenia-auta/` }
};

export default function SprowadzeniePage() {
  return (
    <StronaNarzedzia
      id="sprowadzenie"
      adres="/koszt-sprowadzenia-auta/"
      okruszki={[{ nazwa: 'Koszt sprowadzenia auta', adres: '/koszt-sprowadzenia-auta/' }]}
      zdjecie="trasa"
      nadtytul="Kalkulator sprowadzenia"
      tytul="Ile kosztuje sprowadzenie auta – i czy się opłaca?"
      opis="Wybierz kraj, wpisz cenę i pojemność. Policzymy wszystkie koszty pod dom i porównamy je z ceną podobnego auta w Polsce."
      nazwaAplikacji="Kalkulator kosztu sprowadzenia auta"
      narzedzie={<KalkulatorSprowadzenia />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-sprowadzenie" tytul="Auto z zagranicy? Sprawdź historię z baz kilku krajów" />
          <Odnosnik href="/kalkulator-akcyzy/" ikona={Calculator} tytul="Szczegółowy kalkulator akcyzy" tekst="Wszystkie stawki, hybrydy, plug-iny i import spoza UE krok po kroku." />
        </SiatkaCta>
      }
      sekcje={SEKCJE_SPROWADZENIE}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Sprowadzenie auta z konkretnego kraju</h2>
          <SiatkaCta>
            {KRAJE.map((k) => (
              <Odnosnik key={k.id} href={`/koszt-sprowadzenia-auta/${k.slug}/`} ikona={Globe2} tytul={`Sprowadzenie auta ${k.zKraju}`} tekst={k.uwagi[0]} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_SPROWADZENIE}
      zrodla={ZRODLA_SPROWADZENIE}
      stan={STAN_SPROWADZENIA}
    />
  );
}
