import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarClock } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorKalendarza from '@/components/narzedzia/KalkulatorKalendarza';
import { CtaVin, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { DOTYCZY_OPIS, PRZEBIEGI_KALENDARZA, STAN_NAPRAW, naprawyWZakresie, przebiegZeSlugu, slugPrzebiegu } from '@/lib/narzedzia/naprawy';
import { SEKCJE_KALENDARZ, PYTANIA_KALENDARZ, ZRODLA_KALENDARZ } from '@/lib/narzedzia/kalendarz-tresc';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return PRZEBIEGI_KALENDARZA.map((km) => ({ przebieg: slugPrzebiegu(km) }));
}

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;
const tys = (km: number) => `${(km / 1000).toLocaleString('pl-PL')} tys. km`;

export async function generateMetadata({ params }: { params: Promise<{ przebieg: string }> }): Promise<Metadata> {
  const { przebieg } = await params;
  const km = przebiegZeSlugu(przebieg);
  if (!km || !PRZEBIEGI_KALENDARZA.includes(km)) return {};
  const tytul = `Co wymienić przy ${tys(km)}? Lista i koszty`;
  const lista = naprawyWZakresie(km - 25000, km + 25000);
  const opis = `Auto zbliża się do ${tys(km)}? ${lista.slice(0, 3).map((x) => x.n.krotko).join(', ')} i inne typowe naprawy – z cenami na 2026 r. i objawami.`.slice(0, 160);
  const adres = `/kalendarz-napraw/${slugPrzebiegu(km)}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function PrzebiegPage({ params }: { params: Promise<{ przebieg: string }> }) {
  const { przebieg } = await params;
  const km = przebiegZeSlugu(przebieg);
  if (!km || !PRZEBIEGI_KALENDARZA.includes(km)) notFound();
  const adres = `/kalendarz-napraw/${slugPrzebiegu(km)}/`;
  const lista = naprawyWZakresie(km - 25000, km + 25000);
  const sumaOd = lista.reduce((s, x) => s + x.n.kosztOd, 0);
  const sumaDo = lista.reduce((s, x) => s + x.n.kosztDo, 0);
  const sekcje: Sekcja[] = [
    {
      h2: `Typowe naprawy w okolicy ${tys(km)}`,
      akapity: [
        `Między ${tys(km - 25000)} a ${tys(km + 25000)} w popularnych autach najczęściej trzeba się liczyć z: ${lista.map((x) => x.n.krotko.toLowerCase()).join(', ')}. Nie wszystko dotyczy każdego auta – diesel ma inne pozycje niż benzyna, a automat inne niż skrzynia manualna. Tabela poniżej pokazuje, czego dotyczy każda pozycja.`,
        `Jeśli żadna z tych napraw nie była robiona, przygotuj ok. ${zl(sumaOd)}–${zl(sumaDo)} (suma dla wszystkich pozycji – w konkretnym aucie zwykle mniej). Kupując auto z takim przebiegiem, pytaj o faktury za każdą z nich.`
      ]
    },
    ...SEKCJE_KALENDARZ
  ];
  const pytania: Pytanie[] = [
    { q: `Co trzeba wymienić przy ${tys(km)}?`, a: `Najczęściej: ${lista.slice(0, 5).map((x) => x.n.krotko.toLowerCase()).join(', ')}. Sprawdź w książce serwisowej, co już było robione.` },
    { q: `Czy warto kupić auto z przebiegiem ${tys(km)}?`, a: 'Tak, jeśli ma udokumentowany serwis, a cena uwzględnia zbliżające się naprawy. Brak faktur za rozrząd czy sprzęgło to argument do negocjacji.' },
    ...PYTANIA_KALENDARZ.slice(1)
  ];
  return (
    <StronaNarzedzia
      id="kalendarz"
      adres={adres}
      okruszki={[
        { nazwa: 'Kalendarz drogich napraw', adres: '/kalendarz-napraw/' },
        { nazwa: tys(km), adres }
      ]}
      zdjecie="atlas"
      nadtytul="Kalendarz napraw"
      tytul={`Co wymienić przy ${tys(km)}?`}
      opis={`Typowe naprawy w okolicy ${tys(km)} z kosztami na 2026 r. Wpisz dane swojego auta w kalkulatorze, żeby zobaczyć tylko to, co go dotyczy.`}
      nazwaAplikacji="Kalendarz drogich napraw auta"
      narzedzie={<KalkulatorKalendarza przebiegStart={km - 20000} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-kalendarz" />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          <div className="max-w-3xl">
            <Tabela wiersze={[['Naprawa', 'Kiedy zwykle', 'Koszt 2026', 'Dotyczy'], ...lista.map((x) => [x.n.krotko, `ok. ${tys(x.km)}`, `${zl(x.n.kosztOd)}–${zl(x.n.kosztDo)}`, DOTYCZY_OPIS[x.n.dotyczy]])]} />
          </div>
          <section className="space-y-4">
            <h2 className={H2}>Inne przebiegi</h2>
            <SiatkaCta>
              {PRZEBIEGI_KALENDARZA.filter((x) => x !== km).map((x) => (
                <Odnosnik key={x} href={`/kalendarz-napraw/${slugPrzebiegu(x)}/`} ikona={CalendarClock} tytul={`Co wymienić przy ${tys(x)}?`} tekst="Typowe naprawy i koszty." />
              ))}
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={ZRODLA_KALENDARZ}
      stan={STAN_NAPRAW}
      uwaga="Przebiegi i koszty są orientacyjne."
    />
  );
}
