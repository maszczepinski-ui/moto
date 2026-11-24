import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Car, ClipboardList } from 'lucide-react';
import StronaNarzedzia, { Tabela, H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorPrzebiegu from '@/components/narzedzia/KalkulatorPrzebiegu';
import { CtaVin, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_PRZEBIEGU, daneModeluPrzebieg, modelMaStronePrzebiegu, tabelaRocznikow } from '@/lib/narzedzia/przebieg';
import { getAllModels, getModelBySlug } from '@/lib/models';
import { zakupWGoogle } from '@/lib/indeksowanie';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllModels()
    .filter(modelMaStronePrzebiegu)
    .map((m) => ({ model: m.slug }));
}

const ROK = new Date().getFullYear();
const proc = (x: number) => `${Math.round(x * 100)}%`;
const km = (n: number) => `${n.toLocaleString('pl-PL')} km`;

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m) return {};
  const nazwa = `${m.marka} ${m.model}`;
  const tytul = `Przebieg ${nazwa} – jaki jest typowy?`;
  const opis = `Typowy przebieg ${nazwa} dla najczęstszych roczników w Polsce, ile aut jest sprowadzonych i jak sprawdzić, czy licznik nie był cofany. Darmowy kalkulator.`;
  return { title: tytul, description: opis, alternates: { canonical: `/sprawdz-przebieg/${m.slug}/` }, openGraph: { title: tytul, description: opis, url: `${site.url}/sprawdz-przebieg/${m.slug}/` } };
}

export default async function PrzebiegModeluPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m || !modelMaStronePrzebiegu(m)) notFound();
  const d = daneModeluPrzebieg(m);
  const roczniki = [...d.topRoczniki].sort((a, b) => a.rok - b.rok);
  const tabela = tabelaRocznikow(
    roczniki.map((r) => r.rok),
    ROK
  );
  const najpopularniejszy = d.topRoczniki[0];
  const przyklad = tabela.find((t) => t.rok === najpopularniejszy?.rok);
  const domyslnyRok = najpopularniejszy?.rok && najpopularniejszy.rok <= ROK ? najpopularniejszy.rok : 2014;
  const sprowadzone = d.udzialSprowadzonych;

  const sekcje: Sekcja[] = [
    {
      h2: `${d.nazwa} w Polsce – co mówią dane CEPiK`,
      akapity: [
        `W Polsce jest zarejestrowanych ${d.liczba.toLocaleString('pl-PL')} aut ${d.nazwa} (wszystkie generacje, dane CEPiK).${d.sredniRocznik ? ` Średni rocznik to ${Math.round(d.sredniRocznik)}.` : ''} Najwięcej egzemplarzy pochodzi z rocznika ${najpopularniejszy?.rok} (${najpopularniejszy?.liczba.toLocaleString('pl-PL')} szt.).`,
        `${proc(sprowadzone)} aut tego modelu, dla których znamy pochodzenie, sprowadzono z zagranicy jako używane. ${sprowadzone >= 0.4 ? 'To dużo – przy takim aucie polska historia przebiegu zaczyna się dopiero od rejestracji w kraju, a wcześniejsze lata trzeba sprawdzić w bazach zagranicznych.' : 'Większość aut ma więc historię z polskich badań technicznych, którą sprawdzisz za darmo w serwisie historiapojazdu.gov.pl.'}`,
        `Diesel stanowi ${proc(d.udzialDiesla)} aut tego modelu, a auta z instalacją LPG – ${proc(d.udzialLpg)}. ${d.udzialDiesla > 0.4 ? 'Przy dieslach typowy przebieg jest wyższy, a cofanie licznika – częstsze, bo duży przebieg mocno obniża cenę.' : ''}`
      ]
    },
    {
      h2: `Typowy przebieg ${d.nazwa} według rocznika`,
      akapity: [
        `Tabela pokazuje najczęstsze roczniki ${d.nazwa} w Polsce i przebieg typowy dla auta w tym wieku w ${ROK} r.${przyklad ? ` Przykład: ${d.nazwa} z ${przyklad.rok} r. z dieslem ma zwykle ok. ${km(przyklad.diesel)}, a z benzyną ok. ${km(przyklad.benzyna)}. Ogłoszenie z przebiegiem o połowę niższym to sygnał do sprawdzenia historii.` : ''}`
      ]
    }
  ];

  const pytania: Pytanie[] = [
    {
      q: `Jaki przebieg ma typowy ${d.nazwa}${najpopularniejszy ? ` z ${najpopularniejszy.rok} r.` : ''}?`,
      a: przyklad ? `Ok. ${km(przyklad.benzyna)} z silnikiem benzynowym i ok. ${km(przyklad.diesel)} z dieslem (stan na ${ROK} r.). To punkt odniesienia oparty na średnich przebiegach aut w Polsce, a nie dane konkretnego egzemplarza.` : 'Sprawdź w kalkulatorze powyżej – wpisz rocznik, paliwo i przebieg.'
    },
    { q: `Ile aut ${d.nazwa} jest sprowadzonych?`, a: `Według danych CEPiK ${proc(sprowadzone)} aut ${d.nazwa} o znanym pochodzeniu sprowadzono z zagranicy jako używane.` },
    { q: `Jak sprawdzić przebieg ${d.nazwa} przed zakupem?`, a: 'Za darmo w historiapojazdu.gov.pl (stany licznika z polskich badań technicznych). Przy aucie sprowadzonym warto dodatkowo sprawdzić raport z baz zagranicznych po numerze VIN i porównać dokumenty serwisowe.' },
    { q: 'Czy niski przebieg zawsze oznacza cofnięty licznik?', a: 'Nie, ale to najczęstszy powód, żeby sprawdzić historię. Porównaj też zużycie kierownicy, pedałów i fotela z deklarowanym przebiegiem.' }
  ];

  return (
    <StronaNarzedzia
      id="przebieg"
      adres={`/sprawdz-przebieg/${m.slug}/`}
      okruszki={[
        { nazwa: 'Czy przebieg jest prawdziwy?', adres: '/sprawdz-przebieg/' },
        { nazwa: d.nazwa, adres: `/sprawdz-przebieg/${m.slug}/` }
      ]}
      zdjecie="kupujesz"
      nadtytul={`Przebieg ${d.nazwa}`}
      tytul={`Jaki przebieg ma typowy ${d.nazwa}?`}
      opis={`Sprawdź, czy przebieg ${d.nazwa} z ogłoszenia pasuje do rocznika. Typowe wartości dla najczęstszych roczników w Polsce i sygnały cofniętego licznika.`}
      nazwaAplikacji={`Kalkulator przebiegu ${d.nazwa}`}
      narzedzie={<KalkulatorPrzebiegu rokTeraz={ROK} rok={domyslnyRok} paliwo={d.dominujacePaliwo} nazwaAuta={d.nazwa} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-przebieg" marka={m.marka} model={m.model} tytul={`Sprawdź historię ${d.nazwa} po VIN`} />
          <CtaNiezbednik miejsce="karta" model={d.nazwa} />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          <div className="max-w-3xl">
            <Tabela
              podpis={`Typowy przebieg w ${ROK} r. – najczęstsze roczniki ${d.nazwa} w Polsce`}
              wiersze={[
                ['Rocznik', 'Aut w Polsce', 'Benzyna', 'Diesel'],
                ...tabela.map((t) => [String(t.rok), (roczniki.find((r) => r.rok === t.rok)?.liczba ?? 0).toLocaleString('pl-PL'), km(t.benzyna), km(t.diesel)])
              ]}
            />
          </div>
          <section className="space-y-4">
            <h2 className={H2}>Więcej o {d.nazwa}</h2>
            <SiatkaCta>
              <Odnosnik href={m.adres} ikona={Car} tytul={`Karta modelu ${d.nazwa}`} tekst="Usterki, silniki, roczniki i statystyki z CEPiK." />
              <Odnosnik href={zakupWGoogle(m) ? `${m.adres}zakup/` : '/asystent-zakupu/'} ikona={ClipboardList} tytul="Lista na oględziny" tekst="Co sprawdzić przed zakupem – do wydruku lub na telefon." />
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={[
        { n: 'CEPiK – dane o zarejestrowanych pojazdach', url: 'https://dane.gov.pl/pl/dataset/1006,centralna-ewidencja-pojazdow' },
        { n: 'mubi.pl – przebieg a wiek auta (II 2026)', url: 'https://mubi.pl/poradniki/przebieg-samochodu-a-jego-wiek/' },
        { n: 'historiapojazdu.gov.pl', url: 'https://historiapojazdu.gov.pl/' }
      ]}
      stan={`${STAN_PRZEBIEGU}, dane CEPiK z ${m.cepik.stanNa}`}
    />
  );
}
