import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Globe2, FileText } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorSprowadzenia from '@/components/narzedzia/KalkulatorSprowadzenia';
import { CtaVin, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KRAJE, STAN_SPROWADZENIA, krajPoSlugu } from '@/lib/narzedzia/sprowadzenie';
import { SEKCJE_SPROWADZENIE, PYTANIA_SPROWADZENIE, ZRODLA_SPROWADZENIE } from '@/lib/narzedzia/sprowadzenie-tresc';
import { policzImport } from '@/lib/akcyza';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return KRAJE.map((k) => ({ kraj: k.slug }));
}

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export async function generateMetadata({ params }: { params: Promise<{ kraj: string }> }): Promise<Metadata> {
  const { kraj } = await params;
  const k = krajPoSlugu(kraj);
  if (!k) return {};
  const tytul = `Sprowadzenie auta ${k.zKraju} – koszty 2026`;
  const opis = `Ile kosztuje sprowadzenie auta ${k.zKraju} w 2026 r.: transport ${zl(k.transportOd)}–${zl(k.transportDo)}, ${k.skad === 'ue' ? 'akcyza' : 'cło, akcyza i VAT'}, tłumaczenia, rejestracja. Kalkulator i porównanie z Polską.`;
  const adres = `/koszt-sprowadzenia-auta/${k.slug}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function KrajPage({ params }: { params: Promise<{ kraj: string }> }) {
  const { kraj } = await params;
  const k = krajPoSlugu(kraj);
  if (!k) notFound();
  const adres = `/koszt-sprowadzenia-auta/${k.slug}/`;
  const kurs = k.waluta === 'USD' ? 3.7 : 4.25;
  const transport = (k.transportOd + k.transportDo) / 2;
  const przyklady = [
    { cena: 5000, poj: 1400 },
    { cena: 10000, poj: 1600 },
    { cena: 15000, poj: 2000 },
    { cena: 15000, poj: 2200 }
  ].map((p) => ({
    ...p,
    w: policzImport({ cena: p.cena, waluta: k.waluta, kurs, pojemnosc: p.poj, naped: 'spalinowy', lpg: false, skad: k.skad, produkcjaUsa: false, transportDoUe: k.skad === 'spoza-ue' ? transport / kurs : 0, transportZl: k.skad === 'ue' ? transport : 0, tlumaczenia: k.tlumaczenia, tabliceIndywidualne: false })
  }));
  const sekcje: Sekcja[] = [
    {
      h2: `Sprowadzenie auta ${k.zKraju} – na co uważać`,
      akapity: [`Transport lawetą ${k.zKraju} do centralnej Polski kosztuje zwykle ${zl(k.transportOd)}–${zl(k.transportDo)}. ${k.skad === 'ue' ? 'Przy aucie z UE płacisz w Polsce akcyzę – VAT-u nie dopłacasz, jeśli auto jest używane (ponad 6 miesięcy lub 6000 km).' : 'Auto spoza UE przechodzi odprawę celną: cło, akcyza i VAT są liczone od wartości celnej (cena plus transport do granicy UE).'}`],
      lista: k.uwagi
    },
    {
      h2: 'Przykładowe wyliczenia',
      akapity: [`Przyjęliśmy kurs ${kurs.toLocaleString('pl-PL')} zł za 1 ${k.waluta}, transport ${zl(transport)} i tłumaczenia ${zl(k.tlumaczenia)}. Zwróć uwagę na skok akcyzy powyżej 2000 cm³.${k.skad === 'spoza-ue' ? ' Przykłady liczą zwykłe cło 10% – auta wyprodukowane w USA mają 0%.' : ''}`],
      tabela: [['Cena auta', 'Pojemność', 'Podatki', 'Razem pod domem'], ...przyklady.map((p) => [`${p.cena.toLocaleString('pl-PL')} ${k.waluta}`, `${p.poj} cm³`, zl(p.w.podatki.reduce((s, x) => s + x.kwota, 0)), zl(p.w.razemZAutem)])]
    },
    ...SEKCJE_SPROWADZENIE
  ];
  const pytania: Pytanie[] = [
    { q: `Ile kosztuje transport auta ${k.zKraju}?`, a: `Lawetą zwykle ${zl(k.transportOd)}–${zl(k.transportDo)} do centralnej Polski. Cena zależy od odległości, wielkości auta i tego, czy auto jeździ.` },
    { q: `Jakie podatki płaci się za auto ${k.zKraju}?`, a: k.skad === 'ue' ? 'Akcyzę: 3,1% dla silników do 2000 cm³, 18,6% powyżej (hybrydy – połowa tych stawek, elektryki – 0%). VAT-u nie płacisz przy aucie używanym.' : 'Cło 10% (auta wyprodukowane w USA – 0% od 1.07.2026), akcyzę od wartości celnej powiększonej o cło i VAT 23% od całości.' },
    ...PYTANIA_SPROWADZENIE.slice(1)
  ];
  return (
    <StronaNarzedzia
      id="sprowadzenie"
      adres={adres}
      okruszki={[
        { nazwa: 'Koszt sprowadzenia auta', adres: '/koszt-sprowadzenia-auta/' },
        { nazwa: k.nazwa, adres }
      ]}
      zdjecie="trasa"
      nadtytul="Kalkulator sprowadzenia"
      tytul={`Ile kosztuje sprowadzenie auta ${k.zKraju}?`}
      opis={`Transport, ${k.skad === 'ue' ? 'akcyza' : 'cło, akcyza i VAT'}, tłumaczenia i rejestracja – policz pełny koszt auta ${k.zKraju} i porównaj z ceną w Polsce.`}
      nazwaAplikacji={`Kalkulator sprowadzenia auta ${k.zKraju}`}
      narzedzie={<KalkulatorSprowadzenia krajStart={k.id} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-sprowadzenie" tytul={`Auto ${k.zKraju}? Sprawdź historię po VIN`} />
          <Odnosnik href={k.skad === 'ue' ? '/formalnosci-po-zakupie-auta/auto-z-niemiec/' : '/formalnosci-po-zakupie-auta/auto-z-usa/'} ikona={FileText} tytul="Terminarz formalności po przywozie" tekst="Akcyza w 14 dni, rejestracja w 30 dni – daty w Twoim kalendarzu." />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Inne kraje</h2>
          <div className="max-w-3xl">
            <Tabela wiersze={[['Kraj', 'Transport lawetą', 'Podatki'], ...KRAJE.filter((x) => x.id !== k.id).map((x) => [x.nazwa, `${zl(x.transportOd)}–${zl(x.transportDo)}`, x.skad === 'ue' ? 'akcyza' : 'cło, akcyza, VAT'])]} />
          </div>
          <SiatkaCta>
            {KRAJE.filter((x) => x.id !== k.id)
              .slice(0, 6)
              .map((x) => (
                <Odnosnik key={x.id} href={`/koszt-sprowadzenia-auta/${x.slug}/`} ikona={Globe2} tytul={`Sprowadzenie auta ${x.zKraju}`} tekst={x.uwagi[0]} />
              ))}
          </SiatkaCta>
        </section>
      }
      pytania={pytania}
      zrodla={ZRODLA_SPROWADZENIE}
      stan={STAN_SPROWADZENIA}
      uwaga="Koszty transportu są orientacyjne."
    />
  );
}
