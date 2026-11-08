import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KODY, kodPoSlugu } from '@/lib/kody-bledow';
import { getModelBySlug } from '@/lib/models';
import { nazwaKarty } from '@/lib/opis';
import { panelDane, wypelnij } from '@/lib/panel';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import LinkPartnerski from '@/components/LinkPartnerski';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

interface Props {
  params: Promise<{ kod: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return KODY.map((k) => ({ kod: k.kod.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kod } = await params;
  const k = kodPoSlugu(kod);
  if (!k) return {};
  return {
    title: `${k.kod} – co oznacza? ${k.nazwa}: objawy i przyczyny`,
    description: `Kod błędu ${k.kod} (${k.nazwa.toLowerCase()}): ${k.objawy.slice(0, 2).join(', ').toLowerCase()}. Najczęstsze przyczyny: ${k.przyczyny.slice(0, 3).join(', ').toLowerCase()}.`,
    alternates: { canonical: `/kody-bledow/${k.kod.toLowerCase()}/` }
  };
}

const PILNOSC = {
  niska: ['Można jeździć, ale napraw przy najbliższej okazji', 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'],
  średnia: ['Napraw w ciągu kilku dni – usterka może się pogłębić', 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'],
  wysoka: ['Ogranicz jazdę i jak najszybciej jedź do mechanika', 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200']
} as const;

function Lista({ tytul, el }: { tytul: string; el: string[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tytul}</h2>
      <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
        {el.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function KodPage({ params }: Props) {
  const { kod } = await params;
  const k = kodPoSlugu(kod);
  if (!k) notFound();
  const adres = `/kody-bledow/${k.kod.toLowerCase()}/`;
  const auta = (k.powiazania || []).map((p) => ({ ...p, m: getModelBySlug(p.slug) })).filter((p) => p.m);
  const czesci = panelDane.moduly?.czesci;
  const sklep = czesci?.wlaczony ? czesci.allegro || czesci.ceneo : '';
  const ctx = { slug: k.kod.toLowerCase(), marka: '', model: '' };
  const podobne = KODY.filter((x) => x.kod !== k.kod && x.kod.slice(0, 3) === k.kod.slice(0, 3)).slice(0, 8);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Co oznacza kod błędu ${k.kod}?`, acceptedAnswer: { '@type': 'Answer', text: `${k.nazwa}. ${k.opis}` } },
      { '@type': 'Question', name: `Jakie są objawy błędu ${k.kod}?`, acceptedAnswer: { '@type': 'Answer', text: k.objawy.join('. ') + '.' } },
      { '@type': 'Question', name: `Co powoduje błąd ${k.kod}?`, acceptedAnswer: { '@type': 'Answer', text: k.przyczyny.join('. ') + '.' } }
    ]
  };
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Kody błędów', adres: '/kody-bledow/' }, { nazwa: k.kod, adres }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          <span className="font-mono text-rust-600">{k.kod}</span> – {k.nazwa}
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300">{k.opis}</p>
        <p className={`inline-block rounded-lg px-3 py-1.5 text-sm font-semibold ${PILNOSC[k.pilnosc][1]}`}>Pilność: {k.pilnosc} – {PILNOSC[k.pilnosc][0]}</p>
      </header>
      <Lista tytul="Objawy" el={k.objawy} />
      <Lista tytul="Najczęstsze przyczyny" el={k.przyczyny} />
      <Lista tytul="Co sprawdzić" el={k.coSprawdzic} />

      {auta.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">W jakich autach to częsta usterka</h2>
          <ul className="space-y-1.5 text-sm">
            {auta.map((p) => (
              <li key={p.slug}>
                <a href={p.m!.adres} className="font-semibold text-steel-700 dark:text-steel-300 hover:underline">
                  {nazwaKarty(p.m!)}
                </a>{' '}
                <span className="text-slate-500">– {p.uwaga}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Ten sam kod może pojawić się w każdym aucie – to lista modeli, w których ta przyczyna jest szczególnie dobrze znana.</p>
        </section>
      )}

      {sklep && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Części i narzędzia</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {[...k.czesci, 'skaner OBD2'].map((c) => (
              <li key={c}>
                <LinkPartnerski href={wypelnij(sklep, ctx, c)} modul="kody-bledow" partner={czesci?.allegro ? 'allegro' : 'ceneo'} karta={k.kod} className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:underline first-letter:uppercase">
                  {c}
                </LinkPartnerski>
              </li>
            ))}
          </ul>
          <span className="text-[11px] text-slate-500">linki partnerskie</span>
        </section>
      )}

      {podobne.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Podobne kody</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {podobne.map((x) => (
              <li key={x.kod}>
                <a href={`/kody-bledow/${x.kod.toLowerCase()}/`} className="inline-block px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400">
                  <span className="font-mono">{x.kod}</span> {x.nazwa}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-slate-500">Opis ma charakter poradnikowy. Ostateczną przyczynę ustali diagnosta – ten sam kod mogą wywołać różne usterki.</p>
      <KodStrony sciezka={adres} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </article>
  );
}
