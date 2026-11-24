import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarClock, Wrench } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorNegocjacji from '@/components/narzedzia/KalkulatorNegocjacji';
import { CtaVin, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { NAPRAWY, STAN_NAPRAW, DOTYCZY_OPIS, naprawaPoSlugu, policzNegocjacje } from '@/lib/narzedzia/naprawy';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return NAPRAWY.map((n) => ({ usterka: n.slug }));
}

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export async function generateMetadata({ params }: { params: Promise<{ usterka: string }> }): Promise<Metadata> {
  const { usterka } = await params;
  const n = naprawaPoSlugu(usterka);
  if (!n) return {};
  const tytul = `${n.krotko}: koszt i ile zbić z ceny`;
  const opis = `${n.nazwa} kosztuje w 2026 r. ok. ${zl(n.kosztOd)}–${zl(n.kosztDo)}. Objawy, jak to sprawdzić na oględzinach i o ile obniżyć cenę używanego auta.`;
  const adres = `/ile-zbic-cene-auta/${n.slug}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function UsterkaPage({ params }: { params: Promise<{ usterka: string }> }) {
  const { usterka } = await params;
  const n = naprawaPoSlugu(usterka);
  if (!n) notFound();
  const adres = `/ile-zbic-cene-auta/${n.slug}/`;
  const przyklady = [15000, 30000, 50000].map((cena) => ({ cena, w: policzNegocjacje(cena, [n.id]) }));
  const okres = n.odKm ? `Zwykle pojawia się między ${zl(n.odKm).replace(' zł', '')} a ${zl(n.doKm ?? n.odKm).replace(' zł', '')} km przebiegu${n.coKm ? `, a potem powtarza co ok. ${(n.coKm / 1000).toLocaleString('pl-PL')} tys. km` : ''}${n.coLat ? ` lub co ${n.coLat} lat` : ''}.` : '';
  const sekcje: Sekcja[] = [
    {
      h2: `Ile kosztuje: ${n.nazwa.toLowerCase()}`,
      akapity: [
        `Orientacyjny koszt w 2026 r. to ${zl(n.kosztOd)}–${zl(n.kosztDo)} razem z robocizną, w warsztacie średniej półki i dla popularnego auta. Dotyczy: ${DOTYCZY_OPIS[n.dotyczy]}. ${okres}`,
        'Różnice wynikają z ceny części (oryginał, dobry zamiennik, tani zamiennik), czasu pracy w konkretnym aucie i stawki warsztatu. W dużych miastach i w ASO zapłacisz więcej.'
      ]
    },
    { h2: 'Objawy, które powinny zwrócić uwagę', lista: n.objawy },
    { h2: 'Jak to sprawdzić na oględzinach', lista: n.sprawdz },
    {
      h2: 'O ile zbić cenę – przykłady',
      akapity: ['Proponowana obniżka to środek widełek kosztu plus 10% zapasu na niespodzianki przy naprawie. W kalkulatorze powyżej możesz dodać inne usterki i wpisać cenę z ogłoszenia.'],
      tabela: [['Cena auta', 'Proponowana obniżka', 'Cena do zaproponowania'], ...przyklady.map((p) => [zl(p.cena), zl(p.w.propozycja), zl(p.w.cenaPo)])]
    }
  ];
  const pytania: Pytanie[] = [
    { q: `Ile kosztuje ${n.krotko.toLowerCase()} w 2026 r.?`, a: `Zwykle ${zl(n.kosztOd)}–${zl(n.kosztDo)} z robocizną (popularne auto, warsztat średniej półki).` },
    { q: `Jakie są objawy (${n.krotko.toLowerCase()})?`, a: `Najczęściej: ${n.objawy.slice(0, 3).join('; ')}.` },
    { q: 'Ile zbić z ceny auta z tą usterką?', a: `Przy aucie za 30 000 zł rozsądna propozycja to ok. ${zl(przyklady[1].w.propozycja)} obniżki. Pokaż sprzedającemu wynik diagnostyki albo zdjęcie – argument z konkretnego auta działa najlepiej.` },
    { q: 'Czy kupić auto z tą usterką?', a: 'Tak, jeśli cena uwzględnia naprawę, a reszta auta jest w dobrym stanie. Jeśli usterek jest więcej i ich koszt przekracza jedną trzecią ceny, lepiej szukać dalej.' }
  ];
  return (
    <StronaNarzedzia
      id="negocjacje"
      adres={adres}
      okruszki={[
        { nazwa: 'Ile zbić z ceny auta?', adres: '/ile-zbic-cene-auta/' },
        { nazwa: n.krotko, adres }
      ]}
      zdjecie="kupujesz"
      nadtytul="Usterka przy zakupie"
      tytul={`${n.krotko}: koszt naprawy i ile zbić z ceny`}
      opis={`${n.nazwa} to ${zl(n.kosztOd)}–${zl(n.kosztDo)}. Zobacz objawy, sprawdź auto na oględzinach i policz rozsądną obniżkę.`}
      nazwaAplikacji={`Kalkulator obniżki: ${n.krotko.toLowerCase()}`}
      narzedzie={<KalkulatorNegocjacji startowe={[n.id]} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-negocjacje" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Sprawdź też</h2>
          <SiatkaCta>
            <Odnosnik href="/kalendarz-napraw/" ikona={CalendarClock} tytul="Kalendarz drogich napraw" tekst="Co czeka auto przy kolejnych przebiegach i ile to kosztuje." />
            <Odnosnik href="/kody-bledow/" ikona={Wrench} tytul="Kody błędów OBD" tekst="Co znaczy kod z diagnostyki i jakie są przyczyny." />
          </SiatkaCta>
          <div className="max-w-3xl pt-2">
            <Tabela wiersze={[['Inne usterki', 'Koszt 2026'], ...NAPRAWY.filter((x) => x.id !== n.id).slice(0, 8).map((x) => [x.krotko, `${zl(x.kosztOd)}–${zl(x.kosztDo)}`])]} />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm pt-3">
              {NAPRAWY.filter((x) => x.id !== n.id).map((x) => (
                <li key={x.id}>
                  <a href={`/ile-zbic-cene-auta/${x.slug}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                    {x.krotko} – koszt i objawy
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      }
      pytania={pytania}
      zrodla={[
        { n: 'kb.pl – cenniki usług motoryzacyjnych (I 2026)', url: 'https://kb.pl/cenniki/uslugi/cennik-wymiany-rozrzadu-_mot/' },
        { n: 'cenauslug.pl – koszty napraw 2026', url: 'https://cenauslug.pl/przewodnik/naprawa-silnikow-i-ukladow-napedowych' }
      ]}
      stan={STAN_NAPRAW}
      uwaga="Koszty są orientacyjne."
    />
  );
}
