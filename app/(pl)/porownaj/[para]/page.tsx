import { porownanieWGoogle, BEZ_INDEKSU } from '@/lib/indeksowanie';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wszystkiePary, paraPoId } from '@/lib/porownania';
import { nazwaKarty, zaglebie, najwiecej } from '@/lib/opis';
import { opisZatwierdzony, Markdown } from '@/lib/opisy';
import { CarModel } from '@/types/car-model';
import { fmt, formatDate, NADWOZIE_NAZWY } from '@/lib/format';
import { nazwaWojewodztwa } from '@/lib/wojewodztwa';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import PorownanieKosztow from '@/components/PorownanieKosztow';
import { profilNapedu } from '@/components/KartaModelu';
import { cenyPaliw, pokazModul } from '@/lib/panel';
import { tekstPorownania, udzial, proc } from '@/lib/porownanie-tekst';
import { Vin } from '@/components/Monetyzacja';
import teksty from '@/data/porownania-teksty.json';

type TekstReczny = { wstep: string[]; werdykt?: string; zrodla?: { tytul: string; url: string }[] };
const RECZNE = (teksty as unknown as { pary: Record<string, TekstReczny> }).pary;

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
    title: `${a} czy ${b}? Porównanie – który wybrać`,
    description: `${a} czy ${b}? Porównanie na danych CEPiK: ${fmt(p.a.cepik.liczbaWPolsce)} vs ${fmt(p.b.cepik.liczbaWPolsce)} aut w Polsce, silniki, paliwa, wiek, koszty tankowania i dla kogo który.`,
    alternates: { canonical: `/porownaj/${p.id}/` },
    // mniej popularne porównania: dla ludzi tak, dla Google nie (patrz lib/indeksowanie.ts)
    ...(porownanieWGoogle(p.id) ? {} : { robots: BEZ_INDEKSU })
  };
}

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
  const tekst = tekstPorownania(a, b);
  const reczny = RECZNE[p.id];
  const K = { slug: `porownanie-${p.id}`, marka: a.marka, model: a.model };
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
      mainEntity: tekst.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Porównania', adres: '/porownaj/' }, { nazwa: `${A} vs ${B}`, adres }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {A} czy {B}?
        </h1>
        {reczny?.wstep.map((t, i) => (
          <p key={i} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            {t}
          </p>
        ))}
        <div className="rounded-2xl border border-steel-200 dark:border-steel-800 bg-steel-50/60 dark:bg-steel-900/30 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-steel-700 dark:text-steel-300 mb-1">W skrócie</p>
          <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">{reczny?.werdykt || zdania.join(' ')}</p>
        </div>
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
            {Object.keys(wa).filter((k) => wa[k] !== '—' || wb[k] !== '—').map((k) => (
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

      <article className="space-y-8">
        {tekst.sekcje.map((x) => (
          <section key={x.h2} className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{x.h2}</h2>
            {x.akapity.map((t, i) => (
              <p key={i} className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {t}
              </p>
            ))}
          </section>
        ))}
      </article>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {A} czy {B} – dla kogo który?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tekst.dlaKogo.map((d) => (
            <div key={d.auto} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Wybierz{' '}
                <a href={d.adres} className="text-steel-600 dark:text-steel-400 hover:underline">
                  {d.auto}
                </a>
                , jeśli:
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {d.punkty.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden="true" className="text-steel-500">✓</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PorownanieKosztow a={{ nazwa: A, ...profilNapedu(a) }} b={{ nazwa: B, ...profilNapedu(b) }} ceny={cenyPaliw()} />

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

      {pokazModul('vin', K) && <Vin k={K} tytul="Kupujesz używane auto? Sprawdź jego historię po VIN" />}

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {tekst.faq.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white list-none flex justify-between gap-4">
                {f.q}
                <span className="text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {reczny?.zrodla?.length ? (
        <section className="space-y-1 text-sm">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Źródła</h2>
          <ul className="space-y-1">
            {reczny.zrodla.map((z) => (
              <li key={z.url}>
                <a href={z.url} target="_blank" rel="noopener" className="text-steel-600 dark:text-steel-400 hover:underline">
                  {z.tytul}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[a, b].map((m) => (
          <a key={m.slug} href={m.adres} className="block bg-steel-700 hover:bg-steel-800 text-white rounded-xl p-4 font-semibold">
            Pełna karta: {nazwaKarty(m)} →
          </a>
        ))}
      </section>
      <p className="text-xs text-slate-500">Dane: CEPiK, stan na {formatDate(a.cepik.stanNa)}. Liczby generacji są minimalne (pomijamy roczniki, w których generacje się mieszały).</p>
      <KodStrony sciezka={adres} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
