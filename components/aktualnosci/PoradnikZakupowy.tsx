import type React from 'react';
import Link from 'next/link';
import { ExternalLink, Fuel, Gauge, ThumbsUp, ThumbsDown, Car, Search, AlertTriangle, CircleCheck, CircleAlert, CircleX, ArrowRight } from 'lucide-react';
import type { Aktualnosc, AutoZakupowe, PoradnikZakupowy } from '@/lib/aktualnosci';
import { bezLamania, aktualnoscPoSlugu } from '@/lib/aktualnosci';
import { getModelBySlug } from '@/lib/models';
import { fmt, formatDate } from '@/lib/format';
import { bezpiecznyUrl } from '@/lib/bezpieczenstwo';
import { pokazModul, type KontekstKarty } from '@/lib/panel';
import { Vin, Ubezpieczenia } from '@/components/Monetyzacja';

// Poradnik zakupowy („Sportowe auto do 20 000 zł” itd.) – zawsze ten sam układ:
// odpowiedź na start → tabela szybkiego wyboru → modele po kolei → OC → pułapki + VIN → pytania.
// Treść jest w pliku data/aktualnosci/<slug>.json (pole „zakupowy”).

/** id kotwicy dla modelu, np. „mazda-mx-5” */
const kotwica = (a: AutoZakupowe) =>
  `${a.nazwa} ${a.generacja.split(' ')[0]}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const OCENA = {
  polecany: { ikona: CircleCheck, napis: 'polecany', kolor: 'text-emerald-700 dark:text-emerald-300' },
  warunkowo: { ikona: CircleAlert, napis: 'warunkowo', kolor: 'text-amber-700 dark:text-amber-300' },
  omijaj: { ikona: CircleX, napis: 'omijaj', kolor: 'text-rose-700 dark:text-rose-300' }
} as const;

function TabelaWyboru({ z }: { z: PoradnikZakupowy }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm text-left">
        <caption className="sr-only">Porównanie polecanych modeli</caption>
        <thead className="text-xs uppercase tracking-wider text-slate-500">
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="py-2 pl-4 sm:pl-0 pr-3">Model</th>
            <th className="py-2 pr-3">Cena w ogłoszeniach</th>
            <th className="py-2 pr-3 hidden sm:table-cell">Polecany silnik</th>
            <th className="py-2 pr-4 sm:pr-0">Spalanie</th>
          </tr>
        </thead>
        <tbody>
          {z.auta.map((a) => {
            const polecany = a.silniki.find((s) => s.ocena === 'polecany') || a.silniki[0];
            return (
              <tr key={kotwica(a)} className="border-b border-slate-100 dark:border-slate-800/70 align-top">
                <td className="py-3 pl-4 sm:pl-0 pr-3">
                  <a href={`#${kotwica(a)}`} className="font-bold text-slate-900 dark:text-white underline decoration-slate-300 underline-offset-2">
                    {a.nazwa}
                  </a>
                  <span className="block text-xs text-slate-500">
                    {[a.generacja, a.roczniki].filter(Boolean).join(' · ')}
                  </span>
                </td>
                <td className="py-3 pr-3">{bezLamania(a.cena.replace(/\s*\(.*\)\s*$/, ''))}</td>
                <td className="py-3 pr-3 hidden sm:table-cell">{polecany?.nazwa}</td>
                <td className="py-3 pr-4 sm:pr-0">{bezLamania(a.spalanie)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BlokAuta({ a, nr, budzet }: { a: AutoZakupowe; nr: number; budzet: number }) {
  const m = a.karta ? getModelBySlug(a.karta) : undefined;
  const ogl = a.ogloszenia ? bezpiecznyUrl(a.ogloszenia) : '';
  const zr = a.spalanieZrodlo ? bezpiecznyUrl(a.spalanieZrodlo.url) : '';
  return (
    <section id={kotwica(a)} aria-labelledby={`${kotwica(a)}-h`} className="scroll-mt-20 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6 space-y-4 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]">
      <div className="space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          {nr}. {a.rzadki ? 'rzadki – trudno znaleźć' : `do ${fmt(budzet)} zł`}
        </span>
        <h3 id={`${kotwica(a)}-h`} className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {[a.nazwa, a.generacja].filter(Boolean).join(' ')} ({a.roczniki})
        </h3>
        <p className="text-slate-700 dark:text-slate-300">{a.dlaKogo}</p>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3">
          <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Search className="w-3.5 h-3.5" aria-hidden="true" /> Cena w ogłoszeniach
          </dt>
          <dd className="mt-1 font-extrabold text-slate-900 dark:text-white">{bezLamania(a.cena)}</dd>
          {a.ofert ? <dd className="text-xs text-slate-500">{a.ofert} ofert w budżecie</dd> : null}
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3">
          <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Gauge className="w-3.5 h-3.5" aria-hidden="true" /> Typowy przebieg
          </dt>
          <dd className="mt-1 font-extrabold text-slate-900 dark:text-white">{a.przebieg ? bezLamania(a.przebieg) : '–'}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3">
          <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Fuel className="w-3.5 h-3.5" aria-hidden="true" /> Spalanie
          </dt>
          <dd className="mt-1 font-extrabold text-slate-900 dark:text-white">{a.spalanie}</dd>
          {zr && (
            <dd className="text-xs text-slate-500">
              wg kierowców,{' '}
              <a href={zr} target="_blank" rel="noopener" className="underline">
                {a.spalanieZrodlo!.nazwa}
              </a>
            </dd>
          )}
        </div>
      </dl>

      <div className="space-y-2">
        <h4 className="font-extrabold text-slate-900 dark:text-white">Silniki</h4>
        <ul className="space-y-2">
          {a.silniki.map((s) => {
            const O = OCENA[s.ocena];
            const I = O.ikona;
            return (
              <li key={s.nazwa} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <I className={`w-5 h-5 flex-shrink-0 mt-0.5 ${O.kolor}`} aria-hidden="true" />
                <span>
                  <strong className="text-slate-900 dark:text-white">{s.nazwa}</strong> <span className={`text-xs font-bold uppercase ${O.kolor}`}>({O.napis})</span> – {s.opis}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 font-extrabold text-emerald-800 dark:text-emerald-300">
            <ThumbsUp className="w-4 h-4" aria-hidden="true" /> Plusy
          </h4>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
            {a.plusy.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 font-extrabold text-rose-800 dark:text-rose-300">
            <ThumbsDown className="w-4 h-4" aria-hidden="true" /> Minusy
          </h4>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
            {a.minusy.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {ogl && (
          <a href={ogl} target="_blank" rel="noopener nofollow" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-bold">
            Zobacz ogłoszenia do {fmt(budzet)} zł <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        )}
        {m && (
          <Link href={m.adres} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-sm font-bold">
            <Car className="w-4 h-4" aria-hidden="true" /> Pełna karta modelu
            {m.cepik?.liczbaWPolsce ? <span className="hidden sm:inline font-normal opacity-80">· w Polsce {fmt(m.cepik.liczbaWPolsce)} aut</span> : null}
          </Link>
        )}
      </div>
    </section>
  );
}

export default function TrescZakupowa({ a, wstep }: { a: Aktualnosc; wstep?: React.ReactNode }) {
  const z = a.zakupowy!;
  const k: KontekstKarty = { slug: `jakie-auto-${a.slug}`, marka: '', model: '' };
  const pokazOc = pokazModul('ubezpieczenia', k);
  const pokazVin = pokazModul('vin', k);
  // linki do sąsiednich poradników – tylko do już opublikowanych (szkic dałby błąd 404)
  const powiazane = (z.powiazane || []).filter((p) => {
    const m = p.adres.match(/^\/aktualnosci\/([^/]+)\/$/);
    return !m || !!aktualnoscPoSlugu(m[1]);
  });
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-200 dark:ring-emerald-900 p-5 space-y-2 text-emerald-950 dark:text-emerald-50">
        <p className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">W skrócie</p>
        <p className="text-lg leading-relaxed">{z.odpowiedz}</p>
        <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
          Ceny sprawdzone w ogłoszeniach (Otomoto): {formatDate(z.cenySprawdzone)}
        </p>
      </div>

      {wstep}

      <section aria-labelledby="szybki-wybor" className="space-y-3">
        <h2 id="szybki-wybor" className="text-2xl font-bold text-slate-900 dark:text-white">
          {bezLamania(`Jakie ${z.fraza} wybrać? Porównanie`)}
        </h2>
        <TabelaWyboru z={z} />
      </section>

      <section aria-labelledby="modele" className="space-y-4">
        <h2 id="modele" className="text-2xl font-bold text-slate-900 dark:text-white">
          {bezLamania(`Polecane modele – ${z.fraza}`)}
        </h2>
        {z.auta.map((x, i) => (
          <BlokAuta key={kotwica(x)} a={x} nr={i + 1} budzet={z.budzet} />
        ))}
      </section>

      {pokazOc && <Ubezpieczenia k={k} tytul="Ile zapłacisz za OC? Porównaj, zanim kupisz" />}

      <section aria-labelledby="pulapki" className="space-y-3">
        <h2 id="pulapki" className="text-2xl font-bold text-slate-900 dark:text-white">
          Zanim kupisz – pułapki w tym budżecie
        </h2>
        <ul className="space-y-2">
          {z.pulapki.map((p) => (
            <li key={p} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" aria-hidden="true" /> <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {pokazVin && <Vin k={k} tytul="Sprawdź historię auta po VIN, zanim pojedziesz na oględziny" />}

      {z.faq.length > 0 && (
        <section aria-labelledby="pytania" className="space-y-3">
          <h2 id="pytania" className="text-2xl font-bold text-slate-900 dark:text-white">
            Najczęstsze pytania
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
            {z.faq.map((f) => (
              <details key={f.pytanie} className="group p-5">
                <summary className="cursor-pointer font-bold text-slate-900 dark:text-white list-none flex justify-between gap-3">
                  <h3 className="text-base">{f.pytanie}</h3>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{f.odpowiedz}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {powiazane.length > 0 && (
        <section aria-labelledby="powiazane" className="space-y-3">
          <h2 id="powiazane" className="text-xl font-extrabold text-slate-900 dark:text-white">
            Inny budżet albo inne auto?
          </h2>
          <ul className="flex flex-wrap gap-2">
            {powiazane.map((p) => (
              <li key={p.adres}>
                <Link href={p.adres} className="inline-flex items-center gap-1 rounded-full ring-1 ring-slate-200 dark:ring-slate-800 px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:ring-slate-400">
                  {p.tytul} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Dane strukturalne dla Google: lista modeli (ItemList) i pytania (FAQPage) */
export function jsonLdZakupowy(a: Aktualnosc, adres: string, adresKarty: (slug: string) => string | undefined) {
  const z = a.zakupowy!;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: a.tytul,
      itemListElement: z.auta.map((x, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: [x.nazwa, x.generacja].filter(Boolean).join(' '),
        url: x.karta && adresKarty(x.karta) ? adresKarty(x.karta) : `${adres}#${kotwica(x)}`
      }))
    },
    ...(z.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: z.faq.map((f) => ({ '@type': 'Question', name: f.pytanie, acceptedAnswer: { '@type': 'Answer', text: f.odpowiedz } }))
          }
        ]
      : [])
  ];
}
