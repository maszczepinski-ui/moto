import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import RankingChinskich from '@/components/RankingChinskich';
import { rankingChinskich } from '@/lib/chinskie';
import { formatDate, fmt } from '@/lib/format';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

// Ranking liczy się przy każdej przebudowie z kart modeli (CEPiK) – po comiesięcznej aktualizacji danych sam się odświeża.
const r = rankingChinskich();

export const metadata: Metadata = {
  title: `Chińskie samochody w Polsce – ranking ${r.rok}`,
  description: `Najpopularniejsze chińskie auta w Polsce w ${r.rok} r.: MG, Omoda, BYD, Chery, Jaecoo i inne. Ranking rejestracji z CEPiK, napęd, ceny i porównanie z ${r.rok - 1} r.`,
  alternates: { canonical: '/chinskie-samochody/' }
};

export default function ChinskiePage() {
  const top = r.pozycje[0];
  const maxMarka = Math.max(1, ...r.marki.map((m) => m.ytd));
  const hybrydy = r.pozycje.filter((p) => p.napedy[0]?.typ === 'hybryda').length;
  const faq = [
    {
      q: `Jaki chiński samochód jest najpopularniejszy w Polsce w ${r.rok} r.?`,
      a: top ? `${top.nazwa} – od stycznia do ${formatDate(r.stanNa)} zarejestrowano w Polsce ${fmt(top.ytd)} sztuk (dane CEPiK).` : 'Brak danych.'
    },
    {
      q: 'Które chińskie marki sprzedają się w Polsce najlepiej?',
      a: r.marki
        .slice(0, 5)
        .map((m) => `${m.marka} (${fmt(m.ytd)})`)
        .join(', ') + ` – liczba pierwszych rejestracji w ${r.rok} r.`
    },
    {
      q: 'Czy MG to chińska marka?',
      a: 'Tak. MG to dawna brytyjska marka, która od 2007 r. należy do chińskiego koncernu SAIC. Obecne modele MG powstają głównie w Chinach.'
    },
    {
      q: 'Skąd pochodzą dane w rankingu?',
      a: 'Z państwowej Centralnej Ewidencji Pojazdów (CEPiK) – liczymy pierwsze rejestracje samochodów osobowych w Polsce. Dane aktualizujemy co miesiąc, a ranking przelicza się automatycznie.'
    }
  ];
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Najpopularniejsze chińskie samochody w Polsce – ${r.rok}`,
      itemListElement: r.pozycje.slice(0, 20).map((p) => ({ '@type': 'ListItem', position: p.pozycja, name: p.nazwa, url: `${site.url}${p.adres}` }))
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Rankingi', adres: '/rankingi/' }, { nazwa: 'Chińskie samochody', adres: '/chinskie-samochody/' }]} />
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Najpopularniejsze chińskie samochody w Polsce – ranking {r.rok}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Ile nowych aut chińskich marek trafia na polskie drogi, które modele prowadzą i jak zmieniła się kolejność względem {r.rok - 1} r. Ranking liczymy z państwowej ewidencji
          pojazdów CEPiK i aktualizujemy co miesiąc.
        </p>
      </header>

      <section aria-label="Najważniejsze liczby" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          [fmt(r.sumaYtd), `rejestracji chińskich modeli w ${r.rok} r.`],
          [top ? top.nazwa : '—', `lider rankingu (${top ? fmt(top.ytd) : 0} szt.)`],
          [r.marki[0]?.marka || '—', 'najpopularniejsza marka'],
          [`${hybrydy} z ${r.pozycje.length}`, 'modeli to głównie hybrydy']
        ].map(([w, o]) => (
          <div key={o} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{w}</div>
            <div className="text-xs text-slate-500 mt-1">{o}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ranking modeli</h2>
        <RankingChinskich pozycje={r.pozycje} rok={r.rok} miesiacNazwa={r.miesiacNazwa} trendMiesieczny={r.trendMiesieczny} />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Chcesz wiedzieć, ile aut danego modelu jeździ już po Polsce (łącznie z poprzednimi latami)? Zobacz{' '}
          <Link href="/rankingi/chinskie/" className="underline font-semibold">
            ranking chińskich modeli według liczby aut w Polsce
          </Link>
          .
        </p>
        <p className="text-xs text-slate-500">
          Strzałki pokazują zmianę miejsca {r.trendMiesieczny ? 'względem poprzedniego miesiąca' : `względem całego ${r.rok - 1} r.`}. „Nowość” – modelu nie było w rankingu wcześniej.
        </p>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Chińskie marki w {r.rok} r.</h2>
        <ol className="space-y-2.5">
          {r.marki.map((m, i) => (
            <li key={m.marka}>
              <div className="flex justify-between gap-3 text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400 tabular-nums mr-2">{i + 1}.</span>
                  {m.marka} <span className="text-xs text-slate-400">({m.modeli} {m.modeli === 1 ? 'model' : m.modeli < 5 ? 'modele' : 'modeli'})</span>
                </span>
                <strong className="tabular-nums text-slate-900 dark:text-white">{fmt(m.ytd)}</strong>
              </div>
              <div className="h-1.5 rounded bg-slate-100 dark:bg-slate-800">
                <div className="h-1.5 rounded bg-rust-500" style={{ width: `${(m.ytd / maxMarka) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
          {faq.map((f) => (
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

      <p className="text-xs text-slate-500">
        Dane: CEPiK – pierwsze rejestracje samochodów osobowych w Polsce, stan na {formatDate(r.stanNa)} (nieliczne auta sprowadzone jako używane też się wliczają). Liczymy wszystkie wersje
        modelu razem. Ranking obejmuje modele z co najmniej 200 autami w Polsce i 10 rejestracjami w {r.rok} r. Statystyki rynku nowych aut wg IBRM Samar znajdziesz w dziale{' '}
        <Link href="/rynek/" className="underline">
          Rynek nowych aut
        </Link>
        , a metodę liczenia w zakładce{' '}
        <Link href="/metodologia/" className="underline">
          Skąd dane
        </Link>
        . Ceny „od” pochodzą z cenników producentów i mogą się zmienić.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka="/chinskie-samochody/" />
    </div>
  );
}
