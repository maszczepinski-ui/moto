import type { Metadata } from 'next';
import { Scale } from 'lucide-react';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorWady from '@/components/narzedzia/KalkulatorWady';
import { CtaKancelaria, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_WADY, STRONY_WADY } from '@/lib/narzedzia/wada';
import { SEKCJE_WADA, PYTANIA_WADA, ZRODLA_WADA } from '@/lib/narzedzia/wada-tresc';
import { site } from '@/config/site';

const TYTUL = 'Wada ukryta auta – kalkulator terminów';
const OPIS = 'Kupiłeś auto z wadą? Sprawdź, czy możesz jeszcze reklamować: od osoby prywatnej czy od firmy, wyłączona rękojmia, 2 lata i rok na żądania. Kroki i terminy.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/wada-ukryta-auta/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/wada-ukryta-auta/` }
};

export default function WadaPage() {
  return (
    <StronaNarzedzia
      id="wada"
      adres="/wada-ukryta-auta/"
      okruszki={[{ nazwa: 'Wada ukryta – terminy', adres: '/wada-ukryta-auta/' }]}
      zdjecie="kupujesz"
      nadtytul="Reklamacja używanego auta"
      tytul="Kupione auto ma wadę – czy możesz je jeszcze reklamować?"
      opis="Odpowiedz na kilka pytań. Pokażemy, jakie przepisy Cię chronią, do kiedy masz czas i co zrobić najpierw."
      nazwaAplikacji="Kalkulator terminów reklamacji auta"
      narzedzie={<KalkulatorWady />}
      przedTrescia={
        <SiatkaCta>
          <CtaKancelaria karta="narzedzie-wada" />
          <CtaNiezbednik miejsce="umowa" />
        </SiatkaCta>
      }
      sekcje={SEKCJE_WADA}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Twoja sytuacja</h2>
          <SiatkaCta>
            {STRONY_WADY.map((s) => (
              <Odnosnik key={s.slug} href={`/wada-ukryta-auta/${s.slug}/`} ikona={Scale} tytul={s.tytul} tekst={s.wstep} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA_WADA}
      zrodla={ZRODLA_WADA}
      stan={STAN_WADY}
      uwaga="To informacja ogólna, nie porada prawna."
    />
  );
}
