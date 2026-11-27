import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Ruler, Tag } from 'lucide-react';
import { infoRozmiaru } from '@/lib/opony-dobor';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorZamiennikow from '@/components/narzedzia/KalkulatorZamiennikow';
import KalkulatorFelg from '@/components/narzedzia/KalkulatorFelg';
import { CtaOpony, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { POPULARNE, STAN_FELG, nazwaOpony, obwod, oponaZeSlugu, slugOpony, srednicaKola, typowaFelga, wysokoscBoku, zamienniki } from '@/lib/narzedzia/felgi';
import { SEKCJE_FELGI, ZRODLA_FELGI } from '@/lib/narzedzia/felgi-tresc';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return POPULARNE.map((o) => ({ rozmiar: slugOpony(o) }));
}

const pl = (n: number, m = 1) => n.toLocaleString('pl-PL', { maximumFractionDigits: m });

function znajdz(slug: string) {
  const o = oponaZeSlugu(slug);
  return o && POPULARNE.some((p) => slugOpony(p) === slugOpony(o)) ? o : null;
}

export async function generateMetadata({ params }: { params: Promise<{ rozmiar: string }> }): Promise<Metadata> {
  const { rozmiar } = await params;
  const o = znajdz(rozmiar);
  if (!o) return {};
  const z = zamienniki(o, 2, 5);
  const tytul = `Zamiennik opon ${nazwaOpony(o)} – rozmiary`;
  const opis = `Zamienniki ${nazwaOpony(o)}: ${z.slice(0, 3).map((x) => nazwaOpony(x.opona)).join(', ')} i inne. Średnica koła ${Math.round(srednicaKola(o))} mm, różnica w % i odczyt prędkościomierza.`;
  const adres = `/zamiennik-opon/${slugOpony(o)}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function RozmiarPage({ params }: { params: Promise<{ rozmiar: string }> }) {
  const { rozmiar } = await params;
  const o = znajdz(rozmiar);
  if (!o) notFound();
  const nazwa = nazwaOpony(o);
  const adres = `/zamiennik-opon/${slugOpony(o)}/`;
  const z2 = zamienniki(o, 2, 40);
  const z3 = zamienniki(o, 3, 60).filter((x) => Math.abs(x.roznicaProc) > 2);
  const tenSam = z2.filter((x) => x.opona.felga === o.felga);
  const wiekszaFelga = z2.filter((x) => x.opona.felga === o.felga + 1);
  const mniejszaFelga = z2.filter((x) => x.opona.felga === o.felga - 1);
  const j = typowaFelga(o.szer);
  const sekcje: Sekcja[] = [
    {
      h2: `Opona ${nazwa} – wymiary`,
      akapity: [
        `Opona ${nazwa} ma szerokość ${o.szer} mm, a wysokość jej boku to ${o.profil}% szerokości, czyli ${pl(wysokoscBoku(o))} mm. Montuje się ją na felgach ${o.felga}-calowych – typowa szerokość felgi to ok. ${pl(j)}J. Średnica całego koła wynosi ${pl(srednicaKola(o), 0)} mm, a obwód ${pl(obwod(o), 0)} mm – na każdy kilometr koło obraca się ok. ${pl(1000000 / obwod(o), 0)} razy.`,
        tenSam.length
          ? `Najbliższe zamienniki na tej samej feldze to ${tenSam.slice(0, 3).map((x) => `${nazwaOpony(x.opona)} (${x.roznicaProc > 0 ? '+' : ''}${pl(x.roznicaProc, 2)}%)`).join(', ')}.${wiekszaFelga.length ? ` Przy przejściu na felgę ${o.felga + 1}-calową sprawdź ${wiekszaFelga.slice(0, 2).map((x) => nazwaOpony(x.opona)).join(' lub ')}.` : ''}`
          : `Na tej samej feldze nie ma popularnych zamienników w tolerancji ±2%.${wiekszaFelga.length ? ` Przy feldze ${o.felga + 1}-calowej: ${wiekszaFelga.slice(0, 2).map((x) => nazwaOpony(x.opona)).join(', ')}.` : ''}`
      ],
      tabela: [
        ['Parametr', nazwa],
        ['Szerokość opony', `${o.szer} mm`],
        ['Wysokość boku', `${pl(wysokoscBoku(o))} mm`],
        ['Średnica felgi', `${o.felga}″ (${pl(o.felga * 25.4)} mm)`],
        ['Średnica koła', `${pl(srednicaKola(o), 0)} mm`],
        ['Obwód', `${pl(obwod(o), 0)} mm`],
        ['Typowa szerokość felgi', `${pl(j)}J`]
      ]
    },
    ...SEKCJE_FELGI.slice(1, 3)
  ];
  const pytania: Pytanie[] = [
    { q: `Jaki zamiennik dla opon ${nazwa}?`, a: z2.length ? `Najbliższe rozmiary (różnica średnicy do 2%): ${z2.slice(0, 5).map((x) => `${nazwaOpony(x.opona)} (${x.roznicaProc > 0 ? '+' : ''}${pl(x.roznicaProc, 2)}%)`).join(', ')}.` : 'W tolerancji ±2% nie ma popularnych zamienników – sprawdź tolerancję ±3% w kalkulatorze.' },
    { q: `Jaka jest średnica koła z oponą ${nazwa}?`, a: `${pl(srednicaKola(o), 0)} mm (felga ${pl(o.felga * 25.4)} mm plus dwa boki po ${pl(wysokoscBoku(o))} mm).` },
    { q: `Na jaką felgę opona ${nazwa}?`, a: `Na felgę ${o.felga}-calową, zwykle o szerokości ok. ${pl(j)}J (dopuszczalny zakres zależy od producenta opony).` },
    ...(mniejszaFelga.length ? [{ q: `Czy zamiast ${nazwa} można dać mniejszą felgę?`, a: `Tak, np. ${mniejszaFelga.slice(0, 2).map((x) => nazwaOpony(x.opona)).join(' lub ')} na feldze ${o.felga - 1}-calowej – wyższy profil daje więcej komfortu, ale sprawdź, czy felga zmieści się na zaciskach hamulcowych.` }] : [])
  ];
  return (
    <StronaNarzedzia
      id="zamienniki"
      adres={adres}
      okruszki={[
        { nazwa: 'Zamienniki rozmiaru opon', adres: '/zamiennik-opon/' },
        { nazwa, adres }
      ]}
      zdjecie="opony"
      nadtytul="Zamiennik opon"
      tytul={`Zamiennik opon ${nazwa}`}
      opis={`Rozmiary o prawie tej samej średnicy koła co ${nazwa} (${pl(srednicaKola(o), 0)} mm), różnica w milimetrach i odczyt prędkościomierza.`}
      nazwaAplikacji={`Kalkulator zamienników opon ${nazwa}`}
      narzedzie={<KalkulatorZamiennikow start={o} />}
      przedTrescia={
        <SiatkaCta>
          {infoRozmiaru(slugOpony(o)) && (
            <Odnosnik href={`/dobor-opon/${slugOpony(o)}/`} ikona={Tag} tytul={`Ceny opon ${nazwa}`} tekst="Porównaj opony zimowe, letnie i całoroczne w tym rozmiarze." />
          )}
          <CtaOpony karta="narzedzie-zamienniki" rozmiar={nazwa} />
          <Odnosnik href="/kalkulator-felg/" ikona={Ruler} tytul="Kalkulator felg i ET" tekst="Szersza opona? Sprawdź na rysunku, czy zmieści się w nadkolu." />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          {z3.length > 0 && (
            <div className="max-w-3xl space-y-3">
              <h2 className={H2}>Rozmiary z większą różnicą (2–3%)</h2>
              <Tabela wiersze={[['Rozmiar', 'Różnica średnicy', 'Licznik 100 km/h ='], ...z3.slice(0, 12).map((x) => [nazwaOpony(x.opona), `${x.roznicaProc > 0 ? '+' : ''}${pl(x.roznicaProc, 2)}%`, `${pl(x.przy100)} km/h`])]} />
            </div>
          )}
          <section className="space-y-4">
            <h2 className={H2}>Szersza opona lub inna felga? Sprawdź w nadkolu</h2>
            <KalkulatorFelg start={{ ...o, j, et: 45 }} />
          </section>
          <section className="space-y-3">
            <h2 className={H2}>Inne rozmiary na feldze {o.felga}″</h2>
            <ul className="flex flex-wrap gap-2">
              {POPULARNE.filter((p) => p.felga === o.felga && slugOpony(p) !== slugOpony(o)).map((p) => (
                <li key={slugOpony(p)}>
                  <a href={`/zamiennik-opon/${slugOpony(p)}/`} className="inline-block rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-rust-50 hover:text-rust-700">
                    {nazwaOpony(p)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      }
      pytania={pytania}
      zrodla={ZRODLA_FELGI}
      stan={STAN_FELG}
      uwaga="Zamienniki wyliczamy z geometrii – przed zakupem sprawdź listę rozmiarów dopuszczonych dla auta."
    />
  );
}
