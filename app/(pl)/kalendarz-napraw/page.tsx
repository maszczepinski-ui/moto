import type { Metadata } from 'next';
import { CalendarClock } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorKalendarza from '@/components/narzedzia/KalkulatorKalendarza';
import { CtaVin, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { PRZEBIEGI_KALENDARZA, STAN_NAPRAW, slugPrzebiegu } from '@/lib/narzedzia/naprawy';
import { SEKCJE_KALENDARZ, PYTANIA_KALENDARZ, ZRODLA_KALENDARZ } from '@/lib/narzedzia/kalendarz-tresc';
import { site } from '@/config/site';

const TYTUL = 'Kalendarz napraw: co czeka auto przy przebiegu';
const OPIS = 'Rozrząd, dwumasa, DPF, turbo – sprawdź, które drogie naprawy zbliżają się w Twoim aucie w ciągu kilku lat i ile przygotować pieniędzy. Ceny 2026.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/kalendarz-napraw/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/kalendarz-napraw/` }
};

export default function KalendarzPage() {
  return (
    <StronaNarzedzia
      id="kalendarz"
      adres="/kalendarz-napraw/"
      okruszki={[{ nazwa: 'Kalendarz drogich napraw', adres: '/kalendarz-napraw/' }]}
      zdjecie="atlas"
      nadtytul="Kalendarz napraw"
      tytul="Co czeka Twoje auto w najbliższych latach?"
      opis="Wpisz przebieg, ile jeździsz i kilka informacji o silniku. Pokażemy, które drogie naprawy wypadają w tym okresie i ile kosztują."
      nazwaAplikacji="Kalendarz drogich napraw auta"
      narzedzie={<KalkulatorKalendarza />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-kalendarz" tytul="Kupujesz auto? Sprawdź historię serwisów i szkód" />
        </SiatkaCta>
      }
      sekcje={SEKCJE_KALENDARZ}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Co wymienić przy danym przebiegu</h2>
          <SiatkaCta>
            {PRZEBIEGI_KALENDARZA.map((km) => (
              <Odnosnik key={km} href={`/kalendarz-napraw/${slugPrzebiegu(km)}/`} ikona={CalendarClock} tytul={`Co wymienić przy ${(km / 1000).toLocaleString('pl-PL')} tys. km?`} tekst="Lista typowych napraw z kosztami 2026." />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_KALENDARZ}
      zrodla={ZRODLA_KALENDARZ}
      stan={STAN_NAPRAW}
      uwaga="Przebiegi i koszty są orientacyjne."
    />
  );
}
