import type { Metadata } from 'next';
import StronaNarzedzia, { H2 } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorLpg from '@/components/narzedzia/KalkulatorLpg';
import { CtaOc, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_LPG, modelMaStroneLpg } from '@/lib/narzedzia/lpg';
import { SEKCJE_LPG, PYTANIA_LPG, ZRODLA_LPG } from '@/lib/narzedzia/lpg-tresc';
import { cenyPaliw } from '@/lib/panel';
import { getAllModels } from '@/lib/models';
import { site } from '@/config/site';

const TYTUL = 'Czy LPG się opłaca? Kalkulator zwrotu 2026';
const OPIS = 'Policz, po ilu kilometrach zwróci się instalacja gazowa w Twoim aucie: spalanie, przebieg, koszt montażu i aktualne ceny benzyny i LPG. Wtrysk pośredni i bezpośredni.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/oplacalnosc-lpg/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/oplacalnosc-lpg/` }
};

export default function LpgPage() {
  const c = cenyPaliw();
  const modele = getAllModels()
    .filter(modelMaStroneLpg)
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce)
    .slice(0, 60);
  return (
    <StronaNarzedzia
      id="lpg"
      adres="/oplacalnosc-lpg/"
      okruszki={[{ nazwa: 'Czy LPG się opłaca?', adres: '/oplacalnosc-lpg/' }]}
      zdjecie="trasa"
      nadtytul="Kalkulator LPG"
      tytul="Po ilu kilometrach zwróci się instalacja LPG?"
      opis="Wpisz spalanie, roczny przebieg i rodzaj silnika. Policzymy oszczędność na każdych 100 km, zwrot instalacji i bilans po kilku latach."
      nazwaAplikacji="Kalkulator opłacalności LPG"
      narzedzie={<KalkulatorLpg cenaPb={c.pb95} cenaLpg={c.lpg} dataCen={c.data} />}
      przedTrescia={
        <SiatkaCta>
          <CtaOc karta="narzedzie-lpg" tytul="Po montażu LPG – porównaj OC" />
        </SiatkaCta>
      }
      sekcje={SEKCJE_LPG}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>LPG w popularnych modelach</h2>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">Ile aut danego modelu jeździ w Polsce na gazie (CEPiK) i ile oszczędzisz na typowym silniku.</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            {modele.map((m) => (
              <li key={m.slug}>
                <a href={`/oplacalnosc-lpg/${m.slug}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                  {m.marka} {m.model} na LPG
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
      pytania={PYTANIA_LPG}
      zrodla={ZRODLA_LPG}
      stan={`${STAN_LPG}, ceny paliw z ${c.data}`}
    />
  );
}
