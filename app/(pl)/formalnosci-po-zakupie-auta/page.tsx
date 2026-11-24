import type { Metadata } from 'next';
import { Calculator, ShieldCheck } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorFormalnosci from '@/components/narzedzia/KalkulatorFormalnosci';
import { CtaOc, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { SCENARIUSZE, STAN_FORMALNOSCI } from '@/lib/narzedzia/formalnosci';
import { SEKCJE_FORMALNOSCI, PYTANIA_FORMALNOSCI, ZRODLA_FORMALNOSCI } from '@/lib/narzedzia/formalnosci-tresc';
import { site } from '@/config/site';

const TYTUL = 'Kupiłem auto – co dalej? Terminarz';
const OPIS = 'PCC-3 w 14 dni, rejestracja w 30 dni, OC od razu. Wpisz datę zakupu, a policzymy terminy, podatek i kary – z plikiem do kalendarza. Stan prawny 2026.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/formalnosci-po-zakupie-auta/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/formalnosci-po-zakupie-auta/` }
};

export default function FormalnosciPage() {
  return (
    <StronaNarzedzia
      id="formalnosci"
      adres="/formalnosci-po-zakupie-auta/"
      okruszki={[{ nazwa: 'Terminarz po zakupie auta', adres: '/formalnosci-po-zakupie-auta/' }]}
      zdjecie="kupujesz"
      nadtytul="Terminarz formalności"
      tytul="Kupiłeś auto? Oto Twoje terminy"
      opis="Wybierz, jak kupiłeś auto, i wpisz datę umowy. Pokażemy, co i do kiedy załatwić, ile zapłacisz i jakie kary grożą za spóźnienie."
      nazwaAplikacji="Terminarz formalności po zakupie auta"
      narzedzie={<KalkulatorFormalnosci />}
      przedTrescia={
        <SiatkaCta>
          <CtaOc karta="narzedzie-formalnosci" tytul="Przejęte OC drogie? Porównaj ceny" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={SEKCJE_FORMALNOSCI}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Formalności w Twojej sytuacji</h2>
          <SiatkaCta>
            {SCENARIUSZE.map((s) => (
              <Odnosnik key={s.id} href={`/formalnosci-po-zakupie-auta/${s.slug}/`} ikona={s.id === 'z-ue' || s.id === 'spoza-ue' ? Calculator : ShieldCheck} tytul={s.tytulStrony} tekst={s.wstep} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_FORMALNOSCI}
      zrodla={ZRODLA_FORMALNOSCI}
      stan={STAN_FORMALNOSCI}
      uwaga="To informacja ogólna, nie porada prawna ani podatkowa."
    />
  );
}
