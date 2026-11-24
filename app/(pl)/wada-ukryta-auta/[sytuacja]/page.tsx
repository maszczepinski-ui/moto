import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Scale } from 'lucide-react';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorWady from '@/components/narzedzia/KalkulatorWady';
import { CtaKancelaria, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_WADY, STRONY_WADY, ocenWade } from '@/lib/narzedzia/wada';
import { SEKCJE_WADA, PYTANIA_WADA, ZRODLA_WADA } from '@/lib/narzedzia/wada-tresc';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return STRONY_WADY.map((s) => ({ sytuacja: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sytuacja: string }> }): Promise<Metadata> {
  const { sytuacja } = await params;
  const s = STRONY_WADY.find((x) => x.slug === sytuacja);
  if (!s) return {};
  const adres = `/wada-ukryta-auta/${s.slug}/`;
  const opis = s.wstep.slice(0, 158);
  return { title: s.tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: s.tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function SytuacjaPage({ params }: { params: Promise<{ sytuacja: string }> }) {
  const { sytuacja } = await params;
  const s = STRONY_WADY.find((x) => x.slug === sytuacja);
  if (!s) notFound();
  const adres = `/wada-ukryta-auta/${s.slug}/`;
  // przykładowa ocena: auto wydane 3 miesiące temu, wada stwierdzona dziś
  const dzis = new Date().toISOString().slice(0, 10);
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  const przyklad = ocenWade({ sprzedawca: s.sprzedawca, kupujacy: s.kupujacy, wylaczenie: s.wylaczenie, dataUmowy: d.toISOString().slice(0, 10), dataWydania: d.toISOString().slice(0, 10), dataWady: dzis, wiedzial: false, dzis });
  const sekcje: Sekcja[] = [
    { h2: 'W skrócie', akapity: [s.wstep, `W skrócie: ${przyklad.tytul.toLowerCase()}${przyklad.podstawa ? ` (${przyklad.podstawa})` : ''}.`] },
    { h2: 'Co zrobić krok po kroku', lista: przyklad.kroki },
    ...SEKCJE_WADA
  ];
  const pytania: Pytanie[] = PYTANIA_WADA;
  return (
    <StronaNarzedzia
      id="wada"
      adres={adres}
      okruszki={[
        { nazwa: 'Wada ukryta – terminy', adres: '/wada-ukryta-auta/' },
        { nazwa: s.tytul, adres }
      ]}
      zdjecie="kupujesz"
      nadtytul="Reklamacja używanego auta"
      tytul={s.tytul}
      opis={s.wstep}
      nazwaAplikacji="Kalkulator terminów reklamacji auta"
      narzedzie={<KalkulatorWady sprzedawca={s.sprzedawca} kupujacy={s.kupujacy} wylaczenie={s.wylaczenie} />}
      przedTrescia={
        <SiatkaCta>
          <CtaKancelaria karta="narzedzie-wada" />
          <CtaNiezbednik miejsce="umowa" />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Inne sytuacje</h2>
          <SiatkaCta>
            {STRONY_WADY.filter((x) => x.slug !== s.slug).map((x) => (
              <Odnosnik key={x.slug} href={`/wada-ukryta-auta/${x.slug}/`} ikona={Scale} tytul={x.tytul} tekst={x.wstep} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={pytania}
      zrodla={ZRODLA_WADA}
      stan={STAN_WADY}
      uwaga="To informacja ogólna, nie porada prawna."
    />
  );
}
