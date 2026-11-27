import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NaglowekOpon from '@/components/opony/NaglowekOpon';
import WyborRozmiaru from '@/components/opony/WyborRozmiaru';
import ListaOpon from '@/components/opony/ListaOpon';
import { BoksyInformacyjne, KartaWyboru, PytaniaOpony } from '@/components/opony/Wspolne';
import { H2 } from '@/components/narzedzia/StronaNarzedzia';
import {
  MIN_OFERT_GOOGLE, dataPl, indeksOpon, infoRozmiaru, liczbaOfert, nazwaRozmiaru, ofertyRozmiaru, rozmiaryNaFeldze, sezonNaStart, wszystkieRozmiary, zl,
  type Oferta, type Sezon
} from '@/lib/opony-dobor';
import { POPULARNE, slugOpony } from '@/lib/narzedzia/felgi';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return wszystkieRozmiary().map((x) => ({ rozmiar: x.slug }));
}

const SEZON_PRZYM: Record<Sezon, string> = { z: 'zimowe', l: 'letnie', c: 'całoroczne' };

export async function generateMetadata({ params }: { params: Promise<{ rozmiar: string }> }): Promise<Metadata> {
  const { rozmiar } = await params;
  const info = infoRozmiaru(rozmiar);
  if (!info) return {};
  const n = nazwaRozmiaru(info.r);
  const tytul = `Opony ${n} – ceny od ${zl(info.od)} zł`;
  const sezony = (['z', 'l', 'c'] as Sezon[]).filter((s) => info[s]).map((s) => `${SEZON_PRZYM[s]} (${info[s]})`).join(', ');
  const opis = `Porównaj ${liczbaOfert(info)} opon ${n}: ${sezony}. Ceny od ${zl(info.od)} zł za sztukę, aktualizowane codziennie. Premium, średnia półka i ekonomiczne.`;
  const adres = `/dobor-opon/${rozmiar}/`;
  return {
    title: tytul,
    description: opis,
    alternates: { canonical: adres },
    openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` },
    // mało ofert = mało treści – taka strona działa, ale nie zgłaszamy jej do Google
    ...(liczbaOfert(info) < MIN_OFERT_GOOGLE ? { robots: { index: false, follow: true } } : {})
  };
}

/** Kilka zdań z prawdziwych danych o tym rozmiarze – unikalna treść dla każdej strony */
function opisRozmiaru(n: string, oferty: Oferta[]) {
  const marki = new Set(oferty.map((o) => o.marka)).size;
  const zdania: string[] = [`W rozmiarze ${n} porównujemy teraz ${oferty.length} opon od ${marki} ${marki === 1 ? 'marki' : 'marek'}.`];
  for (const s of ['z', 'l', 'c'] as Sezon[]) {
    const l = oferty.filter((o) => o.sezon === s).sort((a, b) => a.cena - b.cena);
    if (!l.length) continue;
    const prem = l.filter((o) => o.klasa === 'premium');
    const tekst = `Najtańsza opona ${SEZON_PRZYM[s].replace(/e$/, 'a')} to ${l[0].marka} ${l[0].model} za ${zl(l[0].cena)} zł`;
    zdania.push(prem.length ? `${tekst}, a najtańsza marki premium – ${prem[0].marka} ${prem[0].model} za ${zl(prem[0].cena)} zł.` : `${tekst}.`);
  }
  return zdania.join(' ');
}

export default async function RozmiarOponPage({ params }: { params: Promise<{ rozmiar: string }> }) {
  const { rozmiar } = await params;
  const info = infoRozmiaru(rozmiar);
  if (!info) notFound();
  const oferty = ofertyRozmiaru(rozmiar);
  const n = nazwaRozmiaru(info.r);
  const ix = indeksOpon();
  const zamiennik = POPULARNE.some((p) => slugOpony(p) === rozmiar);
  const inne = rozmiaryNaFeldze(info.r[2], rozmiar);
  const pytania = [
    { q: `Ile kosztują opony ${n}?`, a: `Najtańsza opona ${n} kosztuje teraz ${zl(info.od)} zł za sztukę, czyli komplet od ok. ${zl(info.od * 4)} zł (bez montażu). Ceny zależą od marki, sezonu i indeksów – w zestawieniu porównujesz ${liczbaOfert(info)} ofert.` },
    { q: `Na jaką felgę pasuje opona ${n}?`, a: `Na felgę ${info.r[2]}-calową. Szerokość opony to ${info.r[0]} mm, a wysokość boku ${info.r[1]}% szerokości, czyli ok. ${Math.round((info.r[0] * info.r[1]) / 100)} mm.` },
    { q: 'Jaki indeks nośności i prędkości wybrać?', a: 'Nie niższy niż w dowodzie rejestracyjnym (pole z oponami) lub instrukcji auta. Wyższy indeks jest dozwolony. Indeksy znajdziesz na boku opony zaraz po rozmiarze, np. 91H.' }
  ];
  return (
    <div className="pb-12">
      <NaglowekOpon
        okruszki={[{ nazwa: 'Opony', adres: '/opony/' }, { nazwa: 'Dobór opon', adres: '/dobor-opon/' }, { nazwa: n, adres: `/dobor-opon/${rozmiar}/` }]}
        tytul={`Opony ${n} – ceny i porównanie`}
        opis={`Opony zimowe, letnie i całoroczne w rozmiarze ${n}: porównaj marki i ceny, filtruj według klasy i przejdź do oferty.`}
        fakty={[`${liczbaOfert(info)} ofert`, `od ${zl(info.od)} zł / szt.`, `ceny z ${dataPl(ix.aktualizacja)}`]}
        plakietka={{ gora: 'Twój rozmiar', dol: n }}
      />
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <KartaWyboru>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Inny rozmiar?</h2>
          <WyborRozmiaru rozmiary={wszystkieRozmiary().map((x) => x.info.r)} start={info.r} />
        </KartaWyboru>

        <ListaOpon oferty={oferty} rozmiar={n} slug={rozmiar} sezonStart={sezonNaStart(info)} aktualizacja={dataPl(ix.aktualizacja)} />

        <section className="max-w-3xl space-y-4">
          <h2 className={H2}>Opony {n} – co warto wiedzieć</h2>
          <p className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">{opisRozmiaru(n, oferty)}</p>
          <p className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">
            Przed zakupem porównaj indeks nośności i prędkości z dokumentami auta.
            {zamiennik && (
              <>
                {' '}Jeśli zastanawiasz się nad innym rozmiarem, sprawdź{' '}
                <a href={`/zamiennik-opon/${rozmiar}/`} className="font-semibold text-rust-700 dark:text-rust-400 hover:underline">zamienniki opon {n}</a> – pokażemy rozmiary o prawie tej
                samej średnicy koła.
              </>
            )}
          </p>
        </section>

        {inne.length > 0 && (
          <section className="space-y-3">
            <h2 className={H2}>Inne rozmiary na feldze {info.r[2]}″</h2>
            <ul className="flex flex-wrap gap-2">
              {inne.map((x) => (
                <li key={x.slug}>
                  <a href={`/dobor-opon/${x.slug}/`} className="inline-block rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-rust-50 hover:text-rust-700">
                    {nazwaRozmiaru(x.info.r)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <BoksyInformacyjne />
        <PytaniaOpony pytania={pytania} />
      </div>
    </div>
  );
}
