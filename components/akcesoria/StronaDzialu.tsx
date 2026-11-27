import { ArrowRight, BookOpen, Check, Scale, Snowflake, TriangleAlert } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import LinkPartnerski from '@/components/LinkPartnerski';
import { H2, KARTA } from '@/components/narzedzia/StronaNarzedzia';
import { PytaniaOpony } from '@/components/opony/Wspolne';
import { PORADNIKI, typo } from '@/lib/poradniki';
import { linkCeneoZPanelu } from '@/lib/ceneo';
import type { Dzial, Produkt } from '@/lib/akcesoria';
import { site } from '@/config/site';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

// Strona działu akcesoriów: nagłówek, wstęp, produkty w grupach (z przyciskiem do porównania cen na Ceneo),
// przepisy, poradniki, pytania i źródła. Treść pochodzi z pliku działu w lib/akcesoria/.

const GRUPY: { id: Produkt['grupa']; nazwa: string; opis: string }[] = [
  { id: 'podstawa', nazwa: 'Podstawa – to warto mieć zawsze', opis: 'Niedrogie rzeczy, które rozwiązują większość zimowych kłopotów.' },
  { id: 'warto', nazwa: 'Warto dokupić', opis: 'Ułatwiają życie, zwłaszcza gdy auto stoi pod chmurką.' },
  { id: 'gory', nazwa: 'Na wyjazd w góry', opis: 'Gdy planujesz ferie albo jazdę po zaśnieżonych drogach.' }
];

const dataPl = (d: string) => d.split('-').reverse().join('.');

function KartaProduktu({ p, dzial }: { p: Produkt; dzial: string }) {
  const href = linkCeneoZPanelu(p.ceneoLink);
  return (
    <li id={p.id} className={`${KARTA} p-5 sm:p-6 flex flex-col gap-4 scroll-mt-24`}>
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{p.nazwa}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{typo(p.poCo)}</p>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Na co patrzeć</div>
        <ul className="space-y-1.5">
          {p.jakWybrac.map((x) => (
            <li key={x} className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 mt-0.5 flex-none text-emerald-600" aria-hidden="true" />
              <span>{typo(x)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="flex gap-2 text-sm leading-relaxed rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 px-3 py-2.5">
        <TriangleAlert className="w-4 h-4 mt-0.5 flex-none" aria-hidden="true" />
        <span>{typo(p.unikaj)}</span>
      </p>
      {(href || p.powiazany) && (
        <div className="mt-auto space-y-2">
          {href && (
            <LinkPartnerski href={href} modul="ceneo" partner="ceneo" karta={`akcesoria-${dzial}-${p.id}`} className="flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold text-[15px]">
              Porównaj ceny na Ceneo <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          )}
          <div className="flex flex-wrap justify-between gap-2 text-[11px] text-slate-500">
            {href && <span>Link partnerski · ceneo.pl</span>}
            {p.powiazany && (
              <a href={p.powiazany.adres} className="font-semibold text-rust-700 dark:text-rust-400 hover:underline">
                {p.powiazany.nazwa} →
              </a>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function StronaDzialu({ d }: { d: Dzial }) {
  const adres = `/akcesoria/${d.slug}/`;
  const poradniki = d.poradniki.map((s) => PORADNIKI.find((p) => p.slug === s)).filter((p): p is (typeof PORADNIKI)[number] => !!p);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.tytul,
    description: d.seoOpis,
    dateModified: d.aktualizacja,
    inLanguage: 'pl',
    author: { '@type': 'Person', name: site.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}${adres}`
  };
  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <Snowflake className="absolute -right-10 -top-10 w-64 h-64 sm:w-80 sm:h-80 text-sky-400/15" strokeWidth={1.2} aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16 sm:pt-10 sm:pb-20 space-y-4">
          <div className="[&_nav]:text-slate-400 [&_span]:text-slate-300 [&_a:hover]:text-white">
            <Okruszki sciezka={[{ nazwa: 'Akcesoria', adres: '/akcesoria/' }, { nazwa: d.nazwa, adres }]} />
          </div>
          <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08]">{d.tytul}</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">{typo(d.opis)}</p>
          <ul className="flex flex-wrap gap-2 pt-1">
            {d.fakty.map((f) => (
              <li key={f} className="text-[13px] font-semibold px-3 py-1.5 rounded-full bg-white/10 text-slate-200">{f}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-400">Aktualizacja: {dataPl(d.aktualizacja)}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pt-10 space-y-14">
        <div className="max-w-3xl space-y-4">
          {d.wstep.map((a) => (
            <p key={a} className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">{typo(a)}</p>
          ))}
          <nav aria-label="Na tej stronie" className="flex flex-wrap gap-2 pt-2">
            {d.produkty.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-rust-50 hover:text-rust-700">
                {p.nazwa}
              </a>
            ))}
          </nav>
        </div>

        {GRUPY.map((g) => {
          const lista = d.produkty.filter((p) => p.grupa === g.id);
          if (!lista.length) return null;
          return (
            <section key={g.id} className="space-y-5">
              <div>
                <h2 className={H2}>{g.nazwa}</h2>
                <p className="mt-1.5 text-slate-600 dark:text-slate-400">{typo(g.opis)}</p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {lista.map((p) => (
                  <KartaProduktu key={p.id} p={p} dzial={d.slug} />
                ))}
              </ul>
            </section>
          );
        })}

        {d.przepisy && (
          <section className={`${KARTA} p-6 sm:p-8 max-w-4xl`}>
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              <Scale className="w-6 h-6 text-rust-600" aria-hidden="true" /> {d.przepisy.tytul}
            </h2>
            <ul className="mt-4 space-y-3">
              {d.przepisy.punkty.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-rust-500 flex-none" aria-hidden="true" />
                  <span>{typo(x)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(poradniki.length > 0 || d.narzedzia.length > 0) && (
          <section className="space-y-4">
            <h2 className={H2}>Przeczytaj też</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {poradniki.map((p) => (
                <li key={p.slug}>
                  <a href={`/poradniki/${p.slug}/`} className={`${KARTA} h-full p-5 flex gap-3 hover:ring-rust-400 transition`}>
                    <BookOpen className="w-5 h-5 text-rust-600 flex-none mt-0.5" aria-hidden="true" />
                    <span>
                      <span className="block font-bold text-slate-900 dark:text-white">{p.tytul}</span>
                      <span className="block text-xs text-slate-500 mt-1">Poradnik</span>
                    </span>
                  </a>
                </li>
              ))}
              {d.narzedzia.map((n) => (
                <li key={n.adres}>
                  <a href={n.adres} className={`${KARTA} h-full p-5 flex gap-3 hover:ring-rust-400 transition`}>
                    <ArrowRight className="w-5 h-5 text-rust-600 flex-none mt-0.5" aria-hidden="true" />
                    <span>
                      <span className="block font-bold text-slate-900 dark:text-white">{n.nazwa}</span>
                      <span className="block text-sm text-slate-600 dark:text-slate-400 mt-1">{n.opis}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PytaniaOpony pytania={d.pytania} />

        <section className="max-w-3xl space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Źródła</h2>
          <ul className="space-y-1.5 text-sm">
            {d.zrodla.map((z) => (
              <li key={z.url}>
                <a href={z.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-rust-700 hover:underline">
                  {z.nazwa}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-slate-500">
            Przyciski „Porównaj ceny na Ceneo” to linki partnerskie. Za przejście do sklepu możemy dostać prowizję – nie zmienia to ceny dla Ciebie. Nie testowaliśmy konkretnych produktów: podajemy
            kryteria wyboru, a oferty porównasz sam.
          </p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
