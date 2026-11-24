import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Car, Gauge } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorLpg from '@/components/narzedzia/KalkulatorLpg';
import { CtaOc, CtaVin, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_LPG, lpgModelu, modelMaStroneLpg, policzLpg, spalanieDlaPojemnosci, INSTALACJE } from '@/lib/narzedzia/lpg';
import { SEKCJE_LPG, PYTANIA_LPG, ZRODLA_LPG } from '@/lib/narzedzia/lpg-tresc';
import { LPG } from '@/lib/silniki';
import { cenyPaliw } from '@/lib/panel';
import { getAllModels, getModelBySlug } from '@/lib/models';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllModels()
    .filter(modelMaStroneLpg)
    .map((m) => ({ model: m.slug }));
}

const proc = (x: number) => `${Math.round(x * 100)}%`;
const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m) return {};
  const d = lpgModelu(m);
  const nazwa = `${m.marka} ${m.model}`;
  const tytul = `${nazwa} na LPG – czy się opłaca?`;
  const opis = `${d.lpg.toLocaleString('pl-PL')} aut ${nazwa} jeździ w Polsce na gazie (${proc(d.udzialLpg)}). Policz zwrot instalacji LPG, oszczędność na 100 km i sprawdź, które silniki ją znoszą.`;
  const adres = `/oplacalnosc-lpg/${m.slug}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function LpgModeluPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m || !modelMaStroneLpg(m)) notFound();
  const c = cenyPaliw();
  const d = lpgModelu(m);
  const nazwa = `${m.marka} ${m.model}`;
  const adres = `/oplacalnosc-lpg/${m.slug}/`;
  const spalanie = spalanieDlaPojemnosci(d.glowna);
  const typ = d.silniki.some((s) => s.tech?.lpg === 'trudno') && !d.silniki.some((s) => s.tech?.lpg === 'dobrze') ? 'di' : 'mpi4';
  const przyklad = policzLpg({ spalanie, kmRocznie: 15000, cenaPb: c.pb95, cenaLpg: c.lpg, koszt: INSTALACJE[typ].domyslnie, typ });
  const sekcje: Sekcja[] = [
    {
      h2: `${nazwa} na gazie – dane z CEPiK`,
      akapity: [
        `W Polsce jeździ ${d.lpg.toLocaleString('pl-PL')} aut ${nazwa} z instalacją LPG – to ${proc(d.udzialLpg)} wszystkich zarejestrowanych egzemplarzy tego modelu. Na samej benzynie jeździ ${proc(d.udzialBenzyny)} aut. ${d.udzialLpg >= 0.15 ? 'To jeden z modeli, w których gaz jest bardzo popularny – warsztaty dobrze znają te silniki, a części do instalacji są łatwo dostępne.' : 'Gaz nie jest tu dominujący, więc przed montażem warto znaleźć warsztat, który zna konkretny silnik.'}`,
        `Najczęstsza pojemność silnika to ${d.pojemnosci[0]?.nazwa ?? 'ok. 1,6 l'}. Dla takiego silnika przyjmujemy spalanie ok. ${spalanie.toLocaleString('pl-PL')} l benzyny na 100 km. Przy 15 tys. km rocznie i obecnych cenach paliw (${c.pb95.toLocaleString('pl-PL')} zł za Pb95, ${c.lpg.toLocaleString('pl-PL')} zł za LPG) oszczędność to ok. ${zl(przyklad.oszczednoscRok)} rocznie, a instalacja zwraca się po ok. ${przyklad.zwrotKm ? `${przyklad.zwrotKm.toLocaleString('pl-PL')} km` : '–'}.`
      ]
    }
  ];
  if (d.silniki.length)
    sekcje.push({
      h2: `Które silniki ${nazwa} nadają się pod LPG`,
      akapity: ['Ocena wynika z typu wtrysku paliwa w danym silniku (dane z naszej biblioteki silników, zatwierdzone przez redakcję).'],
      tabela: [['Silnik', 'Moc', 'Wtrysk', 'LPG'], ...d.silniki.map((s) => [s.nazwa, `${s.mocKm} KM`, s.tech?.wtrysk ?? '–', s.tech ? LPG[s.tech.lpg].tekst : '–'])]
    });
  const pytania: Pytanie[] = [
    { q: `Czy ${nazwa} dobrze znosi LPG?`, a: d.silniki.length ? `To zależy od silnika: ${d.silniki.slice(0, 4).map((s) => `${s.nazwa} ${s.mocKm} KM – ${s.tech ? LPG[s.tech.lpg].krotko.toLowerCase() : '?'}`).join('; ')}. Silniki z wtryskiem pośrednim są najlepsze pod gaz.` : `W Polsce jeździ ${d.lpg.toLocaleString('pl-PL')} aut ${nazwa} na LPG, więc instalacje w tym modelu są sprawdzone. Kluczowy jest typ wtrysku – wtrysk pośredni najlepiej znosi gaz.` },
    { q: `Ile kosztuje LPG do ${nazwa}?`, a: `Przy silniku z wtryskiem pośrednim zwykle ${zl(INSTALACJE.mpi4.od)}–${zl(INSTALACJE.mpi4.do)}, z wtryskiem bezpośrednim ${zl(INSTALACJE.di.od)}–${zl(INSTALACJE.di.do)}.` },
    { q: `Ile aut ${nazwa} jeździ na gazie?`, a: `Według CEPiK ${d.lpg.toLocaleString('pl-PL')}, czyli ${proc(d.udzialLpg)} zarejestrowanych aut tego modelu.` },
    ...PYTANIA_LPG.slice(1, 3)
  ];
  return (
    <StronaNarzedzia
      id="lpg"
      adres={adres}
      okruszki={[
        { nazwa: 'Czy LPG się opłaca?', adres: '/oplacalnosc-lpg/' },
        { nazwa: nazwa, adres }
      ]}
      zdjecie="trasa"
      nadtytul={`${nazwa} na LPG`}
      tytul={`Czy LPG w ${nazwa} się opłaca?`}
      opis={`${proc(d.udzialLpg)} aut ${nazwa} w Polsce jeździ na gazie. Policz zwrot instalacji dla swojego przebiegu i aktualnych cen paliw.`}
      nazwaAplikacji={`Kalkulator LPG – ${nazwa}`}
      narzedzie={<KalkulatorLpg cenaPb={c.pb95} cenaLpg={c.lpg} dataCen={c.data} spalanieStart={spalanie} typStart={typ} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-lpg" marka={m.marka} model={m.model} tytul={`Kupujesz ${nazwa} z LPG? Sprawdź historię`} />
          <CtaOc karta="narzedzie-lpg" />
        </SiatkaCta>
      }
      sekcje={[...sekcje, ...SEKCJE_LPG.slice(1)]}
      poTresci={
        <div className="space-y-8">
          {d.pojemnosci.length > 0 && (
            <div className="max-w-3xl">
              <Tabela podpis={`Najczęstsze pojemności silnika ${nazwa} w Polsce (CEPiK)`} wiersze={[['Pojemność', 'Aut w Polsce', 'Typowe spalanie benzyny', '100 km: benzyna / LPG'], ...d.pojemnosci.map((p) => {
                const l = Number(p.nazwa.replace(',', '.').replace(/[^\d.]/g, '')) || 1.6;
                const s = spalanieDlaPojemnosci(l);
                const w = policzLpg({ spalanie: s, kmRocznie: 15000, cenaPb: c.pb95, cenaLpg: c.lpg, koszt: 4500, typ: 'mpi4' });
                return [p.nazwa, p.liczba.toLocaleString('pl-PL'), `${s.toLocaleString('pl-PL')} l`, `${w.kosztBenzyna100.toFixed(0)} zł / ${w.kosztLpg100.toFixed(0)} zł`];
              })]} />
            </div>
          )}
          <section className="space-y-4">
            <h2 className={H2}>Więcej o {nazwa}</h2>
            <SiatkaCta>
              <Odnosnik href={m.adres} ikona={Car} tytul={`Karta modelu ${nazwa}`} tekst="Usterki, silniki, roczniki i statystyki z CEPiK." />
              <Odnosnik href="/koszt-trasy/" ikona={Gauge} tytul="Koszt trasy" tekst="Ile kosztuje przejazd na benzynie, LPG i dieslu." />
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={[{ n: 'CEPiK – dane o zarejestrowanych pojazdach', url: 'https://dane.gov.pl/pl/dataset/1006,centralna-ewidencja-pojazdow' }, ...ZRODLA_LPG]}
      stan={`${STAN_LPG}, ceny paliw z ${c.data}, dane CEPiK z ${m.cepik.stanNa}`}
    />
  );
}
