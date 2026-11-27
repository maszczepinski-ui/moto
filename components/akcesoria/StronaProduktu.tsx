import { ArrowRight, Check } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import LinkPartnerski from '@/components/LinkPartnerski';
import { H2, KARTA } from '@/components/narzedzia/StronaNarzedzia';
import { PytaniaOpony } from '@/components/opony/Wspolne';
import { typo } from '@/lib/poradniki';
import { dzial as znajdzDzial, type ModelProduktu, type StronaProduktu as Strona } from '@/lib/akcesoria';
import { linkProduktuCeneo } from '@/lib/akcesoria/linki';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

// Osobna strona typu produktu: wstęp, tabela porównawcza konkretnych modeli (dane producentów)
// z przyciskiem do strony produktu na Ceneo, poradnik „jak wybrać”, pytania i źródła.

const dataPl = (d: string) => d.split('-').reverse().join('.');

function Przycisk({ m, strona, maly = false }: { m: ModelProduktu; strona: string; maly?: boolean }) {
  const href = linkProduktuCeneo(m.id);
  if (!href) return <span className="text-xs text-slate-400">Oferty wkrótce</span>;
  return (
    <LinkPartnerski
      href={href}
      modul="ceneo"
      partner="ceneo"
      karta={`akcesoria-${strona}-${m.id}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold whitespace-nowrap ${maly ? 'min-h-[44px] w-full text-[15px]' : 'min-h-[44px] px-4 text-sm'}`}
    >
      Zobacz oferty na Ceneo <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </LinkPartnerski>
  );
}

export default function StronaProduktu({ s }: { s: Strona }) {
  const d = znajdzDzial(s.dzial);
  const adres = `/akcesoria/${s.dzial}/${s.slug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.tytul,
    description: s.seoOpis,
    dateModified: s.aktualizacja,
    inLanguage: 'pl',
    author: { '@type': 'Person', name: site.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}${adres}`
  };
  return (
    <div className="pb-12">
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-14 sm:pt-10 sm:pb-16 space-y-4">
          <div className="[&_nav]:text-slate-400 [&_span]:text-slate-300 [&_a:hover]:text-white">
            <Okruszki
              sciezka={[
                { nazwa: 'Akcesoria', adres: '/akcesoria/' },
                ...(d ? [{ nazwa: d.nazwa, adres: `/akcesoria/${d.slug}/` }] : []),
                { nazwa: s.nazwa, adres }
              ]}
            />
          </div>
          <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08]">{s.tytul}</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{typo(s.opis)}</p>
          <p className="text-xs text-slate-400">
            {s.modele.length} modeli · dane techniczne wg producentów · aktualizacja: {dataPl(s.aktualizacja)}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pt-10 space-y-14">
        <div className="max-w-3xl space-y-4">
          {s.wstep.map((a) => (
            <p key={a} className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">{typo(a)}</p>
          ))}
        </div>

        <section className="space-y-4">
          <h2 className={H2}>Porównanie modeli</h2>
          {/* komputer: tabela */}
          <div className={`hidden md:block overflow-x-auto ${KARTA}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th scope="col" className="text-left font-bold text-slate-700 dark:text-slate-200 px-4 py-3">Model</th>
                  {s.kolumny.map((k) => (
                    <th key={k.klucz} scope="col" className="text-left font-bold text-slate-700 dark:text-slate-200 px-4 py-3">{k.nazwa}</th>
                  ))}
                  <th scope="col" className="text-left font-bold text-slate-700 dark:text-slate-200 px-4 py-3">Dla kogo</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Oferty</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {s.modele.map((m) => (
                  <tr key={m.id} className="align-top">
                    <th scope="row" className="text-left px-4 py-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.marka}</span>
                      <span className="block font-extrabold text-slate-900 dark:text-white">{m.model}</span>
                    </th>
                    {s.kolumny.map((k) => (
                      <td key={k.klucz} className="px-4 py-4 text-slate-700 dark:text-slate-300">{m.dane[k.klucz] || '—'}</td>
                    ))}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 max-w-[16rem]">{typo(m.dlaKogo)}</td>
                    <td className="px-4 py-4 text-right">
                      <Przycisk m={m} strona={s.slug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* telefon: karty */}
          <ul className="md:hidden space-y-3">
            {s.modele.map((m) => (
              <li key={m.id} className={`${KARTA} p-4 space-y-3`}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{m.marka}</div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">{m.model}</div>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  {s.kolumny.map((k) => (
                    <div key={k.klucz} className={k.klucz === 'dodatki' || k.klucz === 'typy' || k.klucz === 'pojemnosc' ? 'col-span-2' : ''}>
                      <dt className="text-xs text-slate-500">{k.nazwa}</dt>
                      <dd className="font-semibold text-slate-800 dark:text-slate-200">{m.dane[k.klucz] || '—'}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-sm text-slate-600 dark:text-slate-400">{typo(m.dlaKogo)}</p>
                <Przycisk m={m} strona={s.slug} maly />
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-slate-500">
            Dane techniczne pochodzą od producentów i sklepów (źródła na dole strony). Producenci podają prąd na różne sposoby (szczytowy albo rozruchowy), dlatego porównuj przede wszystkim
            deklarowane zastosowanie. Przyciski prowadzą do Ceneo – to linki partnerskie.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={H2}>Jak wybrać</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {s.jakWybrac.map((j) => (
              <li key={j.t} className={`${KARTA} p-5 flex gap-3`}>
                <Check className="w-5 h-5 mt-0.5 flex-none text-emerald-600" aria-hidden="true" />
                <span>
                  <span className="block font-bold text-slate-900 dark:text-white">{j.t}</span>
                  <span className="block mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{typo(j.o)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {d && (
          <a href={`/akcesoria/${d.slug}/`} className={`${KARTA} p-5 flex items-center justify-between gap-4 hover:ring-rust-400 transition max-w-3xl`}>
            <span>
              <span className="block font-bold text-slate-900 dark:text-white">{d.nazwa} – pełna lista</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400 mt-0.5">Co jeszcze warto mieć w aucie i jakie przepisy obowiązują.</span>
            </span>
            <ArrowRight className="w-5 h-5 text-rust-600 flex-none" aria-hidden="true" />
          </a>
        )}

        <PytaniaOpony pytania={s.pytania} />

        <section className="max-w-3xl space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Źródła</h2>
          <ul className="space-y-1.5 text-sm">
            {s.zrodla.map((z) => (
              <li key={z.url}>
                <a href={z.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-rust-700 hover:underline">{z.nazwa}</a>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-slate-500">
            Nie testowaliśmy tych urządzeń – zestawienie opiera się na danych producentów. Za przejście do sklepu przez Ceneo możemy dostać prowizję, nie zmienia to ceny dla Ciebie.
          </p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
