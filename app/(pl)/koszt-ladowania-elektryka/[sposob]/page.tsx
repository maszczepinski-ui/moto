import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Zap } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorEv from '@/components/narzedzia/KalkulatorEv';
import { Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { CENY_KWH, KLASY_EV, SCENARIUSZE_EV, STAN_EV, koszt100, type KlasaEv } from '@/lib/narzedzia/ev';
import { SEKCJE_EV, PYTANIA_EV, ZRODLA_EV } from '@/lib/narzedzia/ev-tresc';
import { cenyPaliw } from '@/lib/panel';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return SCENARIUSZE_EV.map((s) => ({ sposob: s.slug }));
}

const zl = (n: number) => `${n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;

export async function generateMetadata({ params }: { params: Promise<{ sposob: string }> }): Promise<Metadata> {
  const { sposob } = await params;
  const s = SCENARIUSZE_EV.find((x) => x.slug === sposob);
  if (!s) return {};
  const tytul = `${s.tytul} – koszt 100 km`;
  const opis = `${CENY_KWH[s.zrodlo].nazwa}: ok. ${CENY_KWH[s.zrodlo].cena.toLocaleString('pl-PL')} zł/kWh. Ile kosztuje 100 km miejskim autem, kompaktem i SUV-em – i jak to wypada przy benzynie.`;
  const adres = `/koszt-ladowania-elektryka/${s.slug}/`;
  return { title: tytul.slice(0, 60), description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function SposobPage({ params }: { params: Promise<{ sposob: string }> }) {
  const { sposob } = await params;
  const s = SCENARIUSZE_EV.find((x) => x.slug === sposob);
  if (!s) notFound();
  const c = cenyPaliw();
  const adres = `/koszt-ladowania-elektryka/${s.slug}/`;
  const cena = CENY_KWH[s.zrodlo];
  const klasy = Object.keys(KLASY_EV) as KlasaEv[];
  const benzyna100 = 7 * c.pb95;
  const sekcje: Sekcja[] = [
    {
      h2: `${cena.nazwa}: ${cena.cena.toLocaleString('pl-PL')} zł za 1 kWh`,
      akapity: [
        s.wstep,
        `Kompakt zużywający 17 kWh na 100 km kosztuje przy tej cenie ok. ${zl(koszt100(17, s.zrodlo))} na 100 km. Dla porównania auto benzynowe spalające 7 l to ok. ${zl(benzyna100)} (Pb95 po ${c.pb95.toLocaleString('pl-PL')} zł).`
      ]
    },
    ...SEKCJE_EV.slice(1)
  ];
  const pytania: Pytanie[] = [
    { q: `Ile kosztuje 100 km elektrykiem (${cena.nazwa.toLowerCase()})?`, a: `Miejskie auto (15 kWh) ok. ${zl(koszt100(15, s.zrodlo))}, kompakt (17 kWh) ok. ${zl(koszt100(17, s.zrodlo))}, SUV (19 kWh) ok. ${zl(koszt100(19, s.zrodlo))}.` },
    ...PYTANIA_EV
  ];
  return (
    <StronaNarzedzia
      id="ev"
      adres={adres}
      okruszki={[
        { nazwa: 'Koszt ładowania elektryka', adres: '/koszt-ladowania-elektryka/' },
        { nazwa: s.tytul, adres }
      ]}
      zdjecie="elektryki"
      nadtytul="Kalkulator ładowania"
      tytul={s.tytul}
      opis={s.wstep}
      nazwaAplikacji="Kalkulator kosztu ładowania samochodu elektrycznego"
      narzedzie={<KalkulatorEv cenaPb={c.pb95} cenaLpg={c.lpg} domStart={s.zrodlo} />}
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          <div className="max-w-3xl">
            <Tabela podpis={`Koszt 100 km – ${cena.nazwa.toLowerCase()}`} wiersze={[['Klasa auta', 'Zużycie', 'Koszt 100 km', 'Koszt 15 000 km'], ...klasy.map((k) => [`${KLASY_EV[k].nazwa} (np. ${KLASY_EV[k].przyklady.split(',')[0]})`, `${KLASY_EV[k].kwh} kWh`, zl(koszt100(KLASY_EV[k].kwh, s.zrodlo)), `${Math.round(koszt100(KLASY_EV[k].kwh, s.zrodlo) * 150).toLocaleString('pl-PL')} zł`])]} />
          </div>
          <section className="space-y-4">
            <h2 className={H2}>Inne sposoby ładowania</h2>
            <SiatkaCta>
              {SCENARIUSZE_EV.filter((x) => x.slug !== s.slug).map((x) => (
                <Odnosnik key={x.slug} href={`/koszt-ladowania-elektryka/${x.slug}/`} ikona={Zap} tytul={x.tytul} tekst={x.wstep} />
              ))}
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={ZRODLA_EV}
      stan={`${STAN_EV}, ceny paliw z ${c.data}`}
    />
  );
}
