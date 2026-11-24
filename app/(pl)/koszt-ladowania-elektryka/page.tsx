import type { Metadata } from 'next';
import { Zap, Trophy } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorEv from '@/components/narzedzia/KalkulatorEv';
import { CtaFinansowanie, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { SCENARIUSZE_EV, STAN_EV } from '@/lib/narzedzia/ev';
import { SEKCJE_EV, PYTANIA_EV, ZRODLA_EV } from '@/lib/narzedzia/ev-tresc';
import { cenyPaliw } from '@/lib/panel';
import { site } from '@/config/site';

const TYTUL = 'Koszt ładowania elektryka – kalkulator 2026';
const OPIS = 'Ile kosztuje 100 km elektrykiem w domu (G11, G12, taryfa dynamiczna) i na ładowarkach AC i DC. Porównanie z benzyną i LPG dla Twojego miksu ładowania.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/koszt-ladowania-elektryka/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/koszt-ladowania-elektryka/` }
};

export default function EvPage() {
  const c = cenyPaliw();
  return (
    <StronaNarzedzia
      id="ev"
      adres="/koszt-ladowania-elektryka/"
      okruszki={[{ nazwa: 'Koszt ładowania elektryka', adres: '/koszt-ladowania-elektryka/' }]}
      zdjecie="elektryki"
      nadtytul="Kalkulator ładowania"
      tytul="Ile naprawdę kosztuje 100 km elektrykiem?"
      opis="Ustaw, gdzie ładujesz auto – w domu, na publicznych ładowarkach czy na szybkich stacjach. Porównamy koszt z benzyną i LPG."
      nazwaAplikacji="Kalkulator kosztu ładowania samochodu elektrycznego"
      narzedzie={<KalkulatorEv cenaPb={c.pb95} cenaLpg={c.lpg} />}
      przedTrescia={
        <SiatkaCta>
          <Odnosnik href="/ladowarki/" ikona={Zap} tytul="Mapa ładowarek" tekst="Publiczne punkty ładowania w Polsce." />
          <Odnosnik href="/chinskie-samochody/" ikona={Trophy} tytul="Ranking chińskich aut" tekst="MG, BYD i inne – co najczęściej kupują Polacy." />
          <CtaFinansowanie karta="narzedzie-ev" tytul="Elektryk w leasingu lub na kredyt" tekst="Elektryki mają w firmie najwyższy limit kosztów (225 tys. zł). Porównaj oferty finansowania – szczegóły kosztów pokaże partner." />
        </SiatkaCta>
      }
      sekcje={SEKCJE_EV}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Koszt ładowania w różnych taryfach</h2>
          <SiatkaCta>
            {SCENARIUSZE_EV.map((s) => (
              <Odnosnik key={s.slug} href={`/koszt-ladowania-elektryka/${s.slug}/`} ikona={Zap} tytul={s.tytul} tekst={s.wstep} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_EV}
      zrodla={ZRODLA_EV}
      stan={`${STAN_EV}, ceny paliw z ${c.data}`}
    />
  );
}
