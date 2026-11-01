import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wszystkiePary, paraPoId } from '@/lib/porownania';
import { nazwaKarty, zaglebie, najwiecej } from '@/lib/opis';
import { opisZatwierdzony, Markdown } from '@/lib/opisy';
import { CarModel, Udzial } from '@/types/car-model';
import { fmt, formatDate, NADWOZIE_NAZWY } from '@/lib/format';
import { nazwaWojewodztwa } from '@/lib/wojewodztwa';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

interface Props {
  params: Promise<{ para: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return wszystkiePary().map((p) => ({ para: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { para } = await params;
  const p = paraPoId(para);
  if (!p) return {};
  const a = nazwaKarty(p.a), b = nazwaKarty(p.b);
  return {
    title: `${a} czy ${b}? Porównanie – rejestracje w Polsce, silniki, wymiary`,
    description: `${a} czy ${b}: w Polsce jest ${fmt(p.a.cepik.liczbaWPolsce)} vs ${fmt(p.b.cepik.liczbaWPolsce)} zarejestrowanych aut. Porównanie roczników, paliw, pochodzenia, wymiarów i silników na podstawie danych CEPiK.`,
    alternates: { canonical: `/porownaj/${p.id}/` }
  };
}

const udzial = (l: Udzial[], ...n: string[]) => {
  const znane = l.filter((u) => u.nazwa !== 'Inne / brak danych');
  const s = znane.reduce((x, u) => x + u.liczba, 0) || 1;
  return znane.filter((u) => n.some((k) => u.nazwa.startsWith(k))).reduce((x, u) => x + u.liczba, 0) / s;
};
const proc = (x: number) => `${Math.round(x * 100)}%`;

function wiersze(m: CarModel) {
  const c = m.cepik;
  const z = zaglebie(m);
  const top = najwiecej(m);
  return {
    'Zarejestrowanych w Polsce': fmt(c.liczbaWPolsce),
    'Nowe w rejestrze od XI 2019': fmt(c.noweOdPaczki ?? 0),
    'Lata produkcji': m.lataProdukcji,
    'Średni rocznik': c.sredniRocznik ? String(Math.round(c.sredniRocznik)) : '—',
    Nadwozia: m.nadwozia.map((n) => NADWOZIE_NAZWY[n]).join(', '),
    'Najczęstsza pojemność': c.pojemnosci.find((p) => p.nazwa !== 'Inne / brak danych')?.nazwa ?? '—',
    'Diesle': proc(udzial(c.paliwa, 'Diesel', 'Hybryda (diesel')),
    'Z instalacją LPG': proc(udzial(c.paliwa, 'Benzyna + LPG', 'Diesel + LPG')),
    'Hybrydy i elektryki': fmt((c.hybrydy ?? 0) + (c.elektryczne ?? 0)),
    'Sprowadzone (używane)': proc(udzial(c.pochodzenie, 'Sprowadzony z zagranicy (używany)')),
    'Z polskiego salonu': proc(udzial(c.pochodzenie, 'Nowy z polskiego salonu')),
    'Najwięcej aut w województwie': top ? nazwaWojewodztwa(top.teryt) : '—',
    'Najpopularniejszy względem średniej': z ? `${nazwaWojewodztwa(z.najczesciej.teryt)} (${z.najczesciej.indeks.toFixed(1).replace('.', ',')}×)` : '—',
    'Długość / szerokość / wysokość': m.wymiary ? `${fmt(m.wymiary.dlugoscMm)} / ${fmt(m.wymiary.szerokoscMm)} / ${fmt(m.wymiary.wysokoscMm)} mm` : '—',
    'Rozstaw osi': m.wymiary ? `${fmt(m.wymiary.rozstawOsiMm)} mm` : '—',
    'Wersje silnikowe w atlasie': m.silniki?.length ? String(m.silniki.length) : '—'
  } as Record<string, string>;
}

function werdykt(a: CarModel, b: CarModel): string[] {
  const A = nazwaKarty(a), B = nazwaKarty(b);
  const ca = a.cepik, cb = b.cepik;
  const zd: string[] = [];
  const r = ca.liczbaWPolsce / Math.max(1, cb.liczbaWPolsce);
  zd.push(r >= 1.3 ? `W Polsce zarejestrowanych jest ${r.toFixed(1).replace('.', ',')}× więcej aut ${A} niż ${B}, więc łatwiej o wybór egzemplarzy i części.` : `Oba modele są w Polsce podobnie popularne (${fmt(ca.liczbaWPolsce)} wobec ${fmt(cb.liczbaWPolsce)} aut).`);
  if (ca.sredniRocznik && cb.sredniRocznik && Math.abs(ca.sredniRocznik - cb.sredniRocznik) >= 2) {
    const [mlodszy, d] = ca.sredniRocznik > cb.sredniRocznik ? [A, ca.sredniRocznik - cb.sredniRocznik] : [B, cb.sredniRocznik - ca.sredniRocznik];
    zd.push(`Zarejestrowane egzemplarze ${mlodszy} są średnio o ${Math.round(d)} lat młodsze.`);
  }
  const da = udzial(ca.paliwa, 'Diesel'), db = udzial(cb.paliwa, 'Diesel');
  if (Math.abs(da - db) >= 0.15) zd.push(`Diesli jest więcej w ${da > db ? A : B} (${proc(Math.max(da, db))} wobec ${proc(Math.min(da, db))}).`);
  const sa = udzial(ca.pochodzenie, 'Nowy z polskiego salonu'), sb = udzial(cb.pochodzenie, 'Nowy z polskiego salonu');
  if (Math.abs(sa - sb) >= 0.1) zd.push(`Auto z polskiego salonu łatwiej znaleźć w przypadku ${sa > sb ? A : B} (${proc(Math.max(sa, sb))} egzemplarzy).`);
  if (a.wymiary && b.wymiary && Math.abs(a.wymiary.dlugoscMm - b.wymiary.dlugoscMm) >= 80)
    zd.push(`${a.wymiary.dlugoscMm > b.wymiary.dlugoscMm ? A : B} jest dłuższy o ${fmt(Math.abs(a.wymiary.dlugoscMm - b.wymiary.dlugoscMm))} mm.`);
  return zd;
}

export default async function PorownaniePage({ params }: Props) {
  const { para } = await params;
  const p = paraPoId(para);
  if (!p) notFound();
  const { a, b } = p;
  const A = nazwaKarty(a), B = nazwaKarty(b);
  const wa = wiersze(a), wb = wiersze(b);
  const opisA = opisZatwierdzony(a.slug), opisB = opisZatwierdzony(b.slug);
  const zdania = werdykt(a, b);
  const adres = `/porownaj/${p.id}/`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${A} czy ${B} – porównanie`,
      itemListElement: [a, b].map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Car', name: nazwaKarty(m), brand: { '@type': 'Brand', name: m.marka }, model: `${m.model} ${m.generacja}`.trim(), url: `${site.url}${m.adres}` }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `${A} czy ${B} – który jest popularniejszy w Polsce?`, acceptedAnswer: { '@type': 'Answer', text: zdania[0] } },
        ...(zdania.length > 1 ? [{ '@type': 'Question', name: `Czym różnią się ${A} i ${B}?`, acceptedAnswer: { '@type': 'Answer', text: zdania.slice(1).join(' ') } }] : [])
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Porównania', adres: '/porownaj/' }, { nazwa: `${A} vs ${B}`, adres }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {A} czy {B}?
        </h1>
        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{zdania.join(' ')}</p>
      </header>

      <section className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Porównanie {A} i {B}
          </caption>
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th scope="col" className="text-left px-3 py-3 text-xs text-slate-500 font-semibold w-1/3">
                &nbsp;
              </th>
              {[a, b].map((m) => (
                <th key={m.slug} scope="col" className="text-left px-3 py-3">
                  <a href={m.adres} className="font-bold text-steel-700 dark:text-steel-300 hover:underline">
                    {nazwaKarty(m)}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(wa).map((k) => (
              <tr key={k} className="border-t border-slate-100 dark:border-slate-800">
                <th scope="row" className="text-left font-normal text-slate-500 px-3 py-2">
                  {k}
                </th>
                <td className="px-3 py-2 tabular-nums">{wa[k]}</td>
                <td className="px-3 py-2 tabular-nums">{wb[k]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {(opisA || opisB) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            [a, opisA],
            [b, opisB]
          ].map(([m, o]) =>
            o ? (
              <div key={(m as CarModel).slug} className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Typowe bolączki: {nazwaKarty(m as CarModel)}</h2>
                <Markdown tekst={(o as { eksploatacja: string }).eksploatacja} />
              </div>
            ) : null
          )}
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[a, b].map((m) => (
          <a key={m.slug} href={m.adres} className="block bg-steel-700 hover:bg-steel-800 text-white rounded-xl p-4 font-semibold">
            Pełna karta: {nazwaKarty(m)} →
          </a>
        ))}
      </section>
      <p className="text-xs text-slate-500">Dane: CEPiK, stan na {formatDate(a.cepik.stanNa)}. Liczby generacji są minimalne (pomijamy roczniki, w których generacje się mieszały).</p>
      <KodStrony sciezka={adres} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
