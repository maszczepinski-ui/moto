import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { rankingiZProduktami, rankingPoId, produktyRankingu, NAZWY_SEZONOW, rankingiNaTeraz } from '@/lib/produkty';
import { site } from '@/config/site';
import Okruszki from '@/components/Okruszki';
import ProduktKarta from '@/components/ProduktKarta';
import KodStrony from '@/components/KodStrony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ ranking: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const r = rankingiZProduktami();
  return r.length ? r.map((x) => ({ ranking: x.id })) : [{ ranking: 'wkrotce' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = rankingPoId((await params).ranking);
  if (!r || !produktyRankingu(r).length) return { robots: { index: false } };
  return { title: r.tytul, description: r.opis, alternates: { canonical: `/polecane/${r.id}/` } };
}

export default async function RankingPage({ params }: Props) {
  const r = rankingPoId((await params).ranking);
  if (!r) notFound();
  const produkty = produktyRankingu(r);
  if (!produkty.length) notFound();
  const inne = [...rankingiNaTeraz().teraz, ...rankingiNaTeraz().pozostale].filter((x) => x.id !== r.id).slice(0, 4);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: r.tytul,
    itemListElement: produkty.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.nazwa, url: `${site.url}/polecane/${r.id}/#${p.id}` }))
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <div className="space-y-3">
        <Okruszki sciezka={[{ nazwa: 'Polecane', adres: '/polecane/' }, { nazwa: r.tytul, adres: `/polecane/${r.id}/` }]} />
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{NAZWY_SEZONOW[r.sezon]}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{r.tytul}</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300">{r.opis}</p>
      </div>
      <ol className="space-y-4">
        {produkty.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <ProduktKarta p={p} miejsce={i + 1} zrodlo={`ranking-${r.id}`} />
          </li>
        ))}
      </ol>
      <p className="text-xs text-slate-500">
        Kolejność to nasza ocena na podstawie testów i własnego użytkowania. Ceny sprawdzisz na bieżąco po kliknięciu – zmieniają się codziennie. Linki są partnerskie: jeśli
        z nich skorzystasz, możemy otrzymać prowizję, a Ty nie płacisz więcej.
      </p>
      {inne.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inne rankingi</h2>
          <ul className="space-y-1">
            {inne.map((x) => (
              <li key={x.id}>
                <a href={`/polecane/${x.id}/`} className="font-semibold text-steel-700 dark:text-steel-300 hover:underline">
                  {x.tytul}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <KodStrony sciezka={`/polecane/${r.id}/`} />
    </div>
  );
}
