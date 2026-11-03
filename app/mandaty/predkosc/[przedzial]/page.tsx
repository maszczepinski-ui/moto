import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { KalkulatorPredkosci } from '@/components/KalkulatorMandatu';
import { TabelaPredkosci, ZrodlaMandatow } from '@/components/TabelaMandatow';
import { PREDKOSC, opisPrzedzialu, STAN_PRZEPISOW } from '@/lib/mandaty';

export const dynamicParams = false;

export function generateStaticParams() {
  return PREDKOSC.map((p) => ({ przedzial: p.slug }));
}

const zl = (n: number) => n.toLocaleString('pl-PL') + ' zł';
const rok = STAN_PRZEPISOW.split(' ')[1];

export async function generateMetadata({ params }: { params: Promise<{ przedzial: string }> }): Promise<Metadata> {
  const { przedzial } = await params;
  const p = PREDKOSC.find((x) => x.slug === przedzial);
  if (!p) return {};
  return {
    title: `Mandat za przekroczenie prędkości ${opisPrzedzialu(p)} (${rok}): ${zl(p.kwota)} i ${p.punkty} pkt`,
    description: `Przekroczenie prędkości ${opisPrzedzialu(p)}: mandat ${zl(p.kwota)}${p.recydywa ? `, w recydywie ${zl(p.recydywa)}` : ''}, ${p.punkty} punktów karnych. Sprawdź, kiedy grozi zatrzymanie prawa jazdy.`,
    alternates: { canonical: `/mandaty/predkosc/${p.slug}/` }
  };
}

export default async function PrzedzialPage({ params }: { params: Promise<{ przedzial: string }> }) {
  const { przedzial } = await params;
  const p = PREDKOSC.find((x) => x.slug === przedzial);
  if (!p) notFound();
  const nazwa = opisPrzedzialu(p);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Okruszki
        sciezka={[
          { nazwa: 'Mandaty i punkty', adres: '/mandaty/' },
          { nazwa: `Prędkość ${nazwa}`, adres: `/mandaty/predkosc/${p.slug}/` }
        ]}
      />
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Mandat za przekroczenie prędkości {nazwa}</h1>
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Mandat', zl(p.kwota)],
            ['Recydywa', p.recydywa ? zl(p.recydywa) : 'nie dotyczy'],
            ['Punkty karne', String(p.punkty)]
          ].map(([n, w]) => (
            <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-500">{n}</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{w}</div>
            </div>
          ))}
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Za przekroczenie dozwolonej prędkości {nazwa} grozi mandat {zl(p.kwota)} i {p.punkty} pkt karnych.
          {p.recydywa
            ? ` Jeśli w ciągu 2 lat zostałeś już ukarany za przekroczenie o ponad 30 km/h, mandat wynosi ${zl(p.recydywa)} (recydywa).`
            : ' Przy takim przekroczeniu nie obowiązuje podwójny mandat za recydywę.'}
          {p.do === null || p.od > 50
            ? ' W obszarze zabudowanym oraz na drodze jednojezdniowej poza obszarem zabudowanym policja dodatkowo zatrzymuje prawo jazdy na 3 miesiące.'
            : ''}
        </p>
      </div>

      <KalkulatorPredkosci start={p.do ?? p.od} />

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cały taryfikator za prędkość</h2>
        <TabelaPredkosci zaznacz={p.slug} />
      </section>
      <p>
        <Link href="/mandaty/" className="font-semibold text-steel-700 dark:text-steel-300 hover:underline">
          ← Kalkulator punktów karnych i inne wykroczenia
        </Link>
      </p>
      <ZrodlaMandatow />
      <KodStrony sciezka={`/mandaty/predkosc/${p.slug}/`} />
    </div>
  );
}
