import type { ReactNode } from 'react';
import { Plus, ArrowRight, Calculator } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki, { type Okruszek } from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import type { KluczZdjecia } from '@/config/zdjecia';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { NARZEDZIA } from '@/lib/narzedzia/lista';
import { site } from '@/config/site';

// Wspólny szablon strony kalkulatora: okruszki, nagłówek, narzędzie, treść dla czytelnika i Google, pytania (FAQ),
// źródła, „Zobacz też” i dane strukturalne (FAQPage + WebApplication). Każdy kalkulator podaje tylko swoje teksty.

export type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

export const H2 = 'text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white';
export const KARTA = 'rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]';

/** Treść artykułu pod narzędziem – sekcje z nagłówkiem, akapitami, listą i tabelą */
export function Tresc({ sekcje }: { sekcje: Sekcja[] }) {
  return (
    <div className="max-w-3xl space-y-10">
      {sekcje.map((s) => (
        <section key={s.h2} className="space-y-4">
          <h2 className={H2}>{s.h2}</h2>
          {s.akapity?.map((a, i) => (
            <p key={i} className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">
              {a}
            </p>
          ))}
          {s.lista && (
            <ul className="space-y-2 text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">
              {s.lista.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-rust-500 flex-shrink-0" aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          )}
          {s.tabela && <Tabela wiersze={s.tabela} />}
        </section>
      ))}
    </div>
  );
}

export function Tabela({ wiersze, podpis }: { wiersze: string[][]; podpis?: string }) {
  const [glowa, ...reszta] = wiersze;
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
      <table className="w-full text-sm">
        {podpis && <caption className="text-left text-xs text-slate-500 px-4 pt-3">{podpis}</caption>}
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {glowa.map((g) => (
              <th key={g} scope="col" className="text-left font-bold text-slate-700 dark:text-slate-200 px-4 py-3 whitespace-nowrap">
                {g}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {reszta.map((w, i) => (
            <tr key={i}>
              {w.map((k, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                  {k}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Faq({ pytania, tytul = 'Najczęstsze pytania' }: { pytania: Pytanie[]; tytul?: string }) {
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className={H2}>{tytul}</h2>
      <div className={`divide-y divide-slate-200 dark:divide-slate-800 ${KARTA}`}>
        {pytania.map((f) => (
          <details key={f.q} className="group px-5 sm:px-6">
            <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
              <span className="flex-1">{f.q}</span>
              <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** „Zobacz też” – inne kalkulatory (najpierw z tej samej kategorii) */
export function ZobaczTez({ id, ile = 6 }: { id: string; ile?: number }) {
  const ten = NARZEDZIA.find((n) => n.id === id);
  const inne = NARZEDZIA.filter((n) => n.id !== id).sort((a, b) => Number(b.kategoria === ten?.kategoria) - Number(a.kategoria === ten?.kategoria)).slice(0, ile);
  return (
    <section className="space-y-4">
      <h2 className={H2}>Inne kalkulatory</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {inne.map((n) => (
          <a key={n.id} href={n.adres} className={`${KARTA} p-5 flex items-start gap-3 hover:ring-rust-400 transition`}>
            <Calculator className="w-5 h-5 text-rust-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold text-slate-900 dark:text-white">{n.nazwa}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.krotko}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" aria-hidden="true" />
          </a>
        ))}
        <a href="/kalkulatory/" className={`${KARTA} p-5 flex items-center justify-between gap-3 font-bold text-rust-700 dark:text-rust-300 hover:ring-rust-400`}>
          Wszystkie kalkulatory <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function Zrodla({ zrodla, stan, uwaga }: { zrodla: Zrodlo[]; stan: string; uwaga?: string }) {
  return (
    <p className="text-xs text-slate-500 max-w-3xl leading-5">
      {uwaga && <>{uwaga} </>}Stan na: {stan}. Źródła:{' '}
      {zrodla.map((z, i) => (
        <span key={z.url}>
          {i > 0 && ', '}
          <a href={z.url} target="_blank" rel="noopener noreferrer" className="underline">
            {z.n}
          </a>
        </span>
      ))}
      .
    </p>
  );
}

export default function StronaNarzedzia({
  id,
  adres,
  okruszki,
  zdjecie,
  nadtytul,
  tytul,
  opis,
  nazwaAplikacji,
  narzedzie,
  przedTrescia,
  sekcje,
  pytania,
  zrodla,
  stan,
  uwaga,
  poTresci
}: {
  id: string;
  adres: string;
  okruszki: Okruszek[];
  zdjecie: KluczZdjecia;
  nadtytul: string;
  tytul: string;
  opis: string;
  /** nazwa dla danych strukturalnych WebApplication; brak = strona bez interaktywnego narzędzia */
  nazwaAplikacji?: string;
  narzedzie?: ReactNode;
  przedTrescia?: ReactNode;
  sekcje: Sekcja[];
  pytania: Pytanie[];
  zrodla: Zrodlo[];
  stan: string;
  uwaga?: string;
  poTresci?: ReactNode;
}) {
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pytania.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    }
  ];
  if (nazwaAplikacji)
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: nazwaAplikacji,
      url: `${site.url}${adres}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      inLanguage: 'pl-PL',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' }
    });
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Kalkulatory', adres: '/kalkulatory/' }, ...okruszki]} />
      <NaglowekDzialu zdjecie={zdjecie} nadtytul={nadtytul} tytul={tytul} opis={opis} />
      {narzedzie}
      {przedTrescia}
      <Tresc sekcje={sekcje} />
      {poTresci}
      <Faq pytania={pytania} />
      <Zrodla zrodla={zrodla} stan={stan} uwaga={uwaga} />
      <ZobaczTez id={id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka={adres} />
    </div>
  );
}
