import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calculator } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorFirmy from '@/components/narzedzia/KalkulatorFirmy';
import { CtaFinansowanie, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KWOTY_FIRMA, LIMITY, PODATKI, STAN_FIRMY, kwotaZeSlugu, policzFirme, slugKwoty, type NapedFirma } from '@/lib/narzedzia/firma';
import { SEKCJE_FIRMA, PYTANIA_FIRMA, ZRODLA_FIRMA } from '@/lib/narzedzia/firma-tresc';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return KWOTY_FIRMA.map((k) => ({ kwota: slugKwoty(k) }));
}

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export async function generateMetadata({ params }: { params: Promise<{ kwota: string }> }): Promise<Metadata> {
  const { kwota } = await params;
  const k = kwotaZeSlugu(kwota);
  if (!k) return {};
  const w = policzFirme({ cenaNetto: k, naped: 'spalinowy', uzytek: 'mieszany', podatek: 'liniowy', vatowiec: true, eksploatacjaRok: 0, lata: 5 });
  const tytul = `Auto za ${k.toLocaleString('pl-PL')} zł w firmie – limit 2026`;
  const opis = `Auto spalinowe za ${zl(k)} netto: ${w.ponadLimit > 0 ? `${zl(w.ponadLimit)} ponad limitem 100 tys. zł` : 'mieści się w limicie'}. Ile VAT i PIT odzyskasz na skali, liniowym i ryczałcie.`;
  const adres = `/auto-w-firmie/${slugKwoty(k)}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function KwotaPage({ params }: { params: Promise<{ kwota: string }> }) {
  const { kwota } = await params;
  const k = kwotaZeSlugu(kwota);
  if (!k) notFound();
  const adres = `/auto-w-firmie/${slugKwoty(k)}/`;
  const baza = { cenaNetto: k, uzytek: 'mieszany' as const, vatowiec: true, eksploatacjaRok: 0, lata: 5 };
  const napedy = Object.keys(LIMITY) as NapedFirma[];
  const liniowy = napedy.map((n) => ({ n, w: policzFirme({ ...baza, naped: n, podatek: 'liniowy' }) }));
  const spal = liniowy[0].w;
  const sekcje: Sekcja[] = [
    {
      h2: `Auto za ${zl(k)} netto – wyliczenie`,
      akapity: [
        `Auto kosztuje ${zl(k)} netto, czyli ${zl(k * 1.23)} brutto. Przy użytku mieszanym czynny podatnik VAT odliczy połowę VAT (${zl(spal.vatOdliczony)}), a druga połowa powiększa wartość auta do ${zl(spal.wartoscDoLimitu)}.`,
        spal.ponadLimit > 0
          ? `Dla auta spalinowego (limit 100 000 zł) w kosztach rozliczysz tylko ${zl(spal.wKosztach)}, a ${zl(spal.ponadLimit)} przepada. Na podatku liniowym oznacza to ${zl(spal.strataLimit)} więcej podatku przez cały okres używania auta. Auto elektryczne w tej samej cenie ${liniowy[2].w.ponadLimit > 0 ? `przekracza limit 225 000 zł o ${zl(liniowy[2].w.ponadLimit)}` : 'mieści się w limicie 225 000 zł w całości'}.`
          : `Auto mieści się w limicie 100 000 zł, więc całą jego wartość rozliczysz w kosztach niezależnie od napędu.`
      ]
    },
    ...SEKCJE_FIRMA.slice(0, 2)
  ];
  const tabela = [
    ['Forma opodatkowania', ...napedy.map((n) => `${LIMITY[n].nazwa.split(' (')[0]} – realny koszt`)],
    ...PODATKI.map((p) => [p.nazwa, ...napedy.map((n) => zl(policzFirme({ ...baza, naped: n, podatek: p.id }).realnyKosztAuta))])
  ];
  const pytania: Pytanie[] = [
    { q: `Ile stracę przez limit przy aucie za ${zl(k)}?`, a: spal.ponadLimit > 0 ? `Przy aucie spalinowym i użytku mieszanym ponad limitem jest ${zl(spal.ponadLimit)}. Na podatku liniowym to ${zl(spal.strataLimit)}, na skali 32% – ${zl(policzFirme({ ...baza, naped: 'spalinowy', podatek: 'skala32' }).strataLimit)} więcej podatku.` : 'Nic – auto mieści się w limicie 100 000 zł.' },
    { q: `Ile VAT odliczę od auta za ${zl(k)} netto?`, a: `Przy użytku mieszanym 50%, czyli ${zl(spal.vatOdliczony)}. Przy użytku wyłącznie firmowym (VAT-26, ewidencja przebiegu) – całe ${zl(spal.vatAuta)}.` },
    ...PYTANIA_FIRMA.slice(0, 3)
  ];
  return (
    <StronaNarzedzia
      id="firma"
      adres={adres}
      okruszki={[
        { nazwa: 'Auto w firmie: limit 100 tys. zł', adres: '/auto-w-firmie/' },
        { nazwa: `Auto za ${k.toLocaleString('pl-PL')} zł`, adres }
      ]}
      zdjecie="glowne"
      nadtytul="Auto w firmie"
      tytul={`Auto za ${zl(k)} netto w firmie – ile odzyskasz w 2026 r.?`}
      opis="Gotowe wyliczenie dla trzech limitów (100, 150 i 225 tys. zł) i każdej formy opodatkowania. Zmień dane w kalkulatorze, żeby dopasować je do siebie."
      nazwaAplikacji="Kalkulator limitu kosztów auta firmowego"
      narzedzie={<KalkulatorFirmy cenaStart={k} />}
      przedTrescia={
        <SiatkaCta>
          <CtaFinansowanie karta="narzedzie-firma" tytul={`Finansowanie auta za ${zl(k)}`} />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          <div className="max-w-4xl">
            <Tabela podpis="Realny koszt auta po odliczeniu VAT i podatku dochodowego (użytek mieszany, czynny podatnik VAT, bez eksploatacji i kosztów finansowania)" wiersze={tabela} />
          </div>
          <section className="space-y-4">
            <h2 className={H2}>Inne kwoty</h2>
            <SiatkaCta>
              {KWOTY_FIRMA.filter((x) => x !== k).map((x) => (
                <Odnosnik key={x} href={`/auto-w-firmie/${slugKwoty(x)}/`} ikona={Calculator} tytul={`Auto za ${x.toLocaleString('pl-PL')} zł netto`} tekst="Wyliczenie limitu, VAT i PIT." />
              ))}
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={ZRODLA_FIRMA}
      stan={STAN_FIRMY}
      uwaga="To wyliczenie poglądowe, nie porada podatkowa."
    />
  );
}
