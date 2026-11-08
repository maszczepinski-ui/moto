import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KalkulatorTrasy from '@/components/KalkulatorTrasy';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { cenyPaliw } from '@/lib/panel';
import { trasa, wszystkieTrasy } from '@/lib/miasta';
import { domyslneSpalanie, spalanieWTrasie } from '@/lib/paliwa';
import { SlupkiPoziome } from '@/components/Infografiki';
import { ODCINKI, sugestieOdcinkow } from '@/lib/autostrady';

export const dynamicParams = false;

export function generateStaticParams() {
  return wszystkieTrasy().map((t) => ({ trasa: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ trasa: string }> }): Promise<Metadata> {
  const t = trasa((await params).trasa);
  if (!t) return {};
  return {
    title: `Koszt przejazdu ${t.a.nazwa} – ${t.b.nazwa}: ile za paliwo? (ok. ${t.km} km)`,
    description: `Ile kosztuje paliwo na trasie ${t.a.nazwa} – ${t.b.nazwa}? Ok. ${t.km} km – policz koszt dla benzyny, diesla, LPG i auta elektrycznego, także na osobę.`,
    alternates: { canonical: `/koszt-trasy/${t.id}/` }
  };
}

const zl = (n: number) => Math.round(n).toLocaleString('pl-PL') + ' zł';

export default async function TrasaPage({ params }: { params: Promise<{ trasa: string }> }) {
  const t = trasa((await params).trasa);
  if (!t) notFound();
  const ceny = cenyPaliw();
  const oplaty = ODCINKI.filter((o) => sugestieOdcinkow(t.a.slug, t.b.slug).includes(o.id));
  // przykłady dla typowych aut
  const przyklady = [
    { n: 'Benzyna 1.4, kompakt', z: spalanieWTrasie('benzyna', domyslneSpalanie('benzyna', 1.4)), c: ceny.pb95, j: 'l' },
    { n: 'Diesel 2.0', z: spalanieWTrasie('diesel', domyslneSpalanie('diesel', 2.0)), c: ceny.on, j: 'l' },
    { n: 'Benzyna + LPG 1.6', z: spalanieWTrasie('lpg', domyslneSpalanie('lpg', 1.6)), c: ceny.lpg, j: 'l' },
    { n: 'Hybryda 1.8', z: spalanieWTrasie('hybryda', domyslneSpalanie('hybryda', 1.8)), c: ceny.pb95, j: 'l' },
    { n: 'Elektryczny', z: spalanieWTrasie('elektryczny', domyslneSpalanie('elektryczny', 0)), c: ceny.prad, j: 'kWh' }
  ];
  const inne = wszystkieTrasy()
    .filter((x) => x.id !== t.id && (x.a.slug === t.a.slug || x.b.slug === t.a.slug || x.a.slug === t.b.slug || x.b.slug === t.b.slug))
    .slice(0, 12);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Okruszki
        sciezka={[
          { nazwa: 'Koszt trasy', adres: '/koszt-trasy/' },
          { nazwa: `${t.a.nazwa} – ${t.b.nazwa}`, adres: `/koszt-trasy/${t.id}/` }
        ]}
      />
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Koszt przejazdu {t.a.nazwa} – {t.b.nazwa}
        </h1>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Trasa {t.a.nazwa} – {t.b.nazwa} to ok. <strong>{t.km} km</strong> drogą (szacunek – dokładny dystans zależy od wybranej trasy). Poniżej koszt paliwa dla typowych
          aut i kalkulator, w którym wpiszesz spalanie swojego samochodu.
        </p>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="font-bold text-slate-900 dark:text-white">
          Ile kosztuje paliwo na trasie {t.a.nazwa} – {t.b.nazwa}? (w jedną stronę)
        </h2>
        <SlupkiPoziome
          opis={`Koszt paliwa na trasie ${t.a.nazwa} – ${t.b.nazwa} dla różnych napędów`}
          dane={[...przyklady]
            .map((p) => ({ nazwa: p.n, wartosc: (t.km / 100) * p.z * p.c, etykieta: zl((t.km / 100) * p.z * p.c) }))
            .sort((x, y) => x.wartosc - y.wartosc)}
        />
      </section>

      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <thead className="bg-slate-50 dark:bg-slate-800 text-left">
            <tr>
              <th className="px-4 py-2">Auto</th>
              <th className="px-4 py-2 text-right">Zużycie w trasie</th>
              <th className="px-4 py-2 text-right">W jedną stronę</th>
              <th className="px-4 py-2 text-right">Tam i z powrotem</th>
            </tr>
          </thead>
          <tbody>
            {przyklady.map((p) => {
              const k = (t.km / 100) * p.z * p.c;
              return (
                <tr key={p.n} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-2 font-semibold text-slate-900 dark:text-white">{p.n}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {p.z.toLocaleString('pl-PL')} {p.j}/100 km
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-bold">{zl(k)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{zl(k * 2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-2">Ceny paliw i prądu – średnie z {new Date(ceny.data).toLocaleDateString('pl-PL')}. Kwoty w tabeli bez opłat za autostrady.</p>
        {oplaty.length > 0 && (
          <p className="mt-3 text-sm bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl p-3">
            Na tej trasie najpewniej pojedziesz płatną autostradą: {oplaty.map((o) => `${o.nazwa} (${o.cena.toLocaleString('pl-PL')} zł)`).join(', ')}. Kalkulator poniżej
            doliczy opłaty.
          </p>
        )}
      </div>

      <KalkulatorTrasy ceny={ceny} skad={t.a.nazwa} dokad={t.b.nazwa} />

      {inne.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inne trasy</h2>
          <div className="flex flex-wrap gap-2">
            {inne.map((x) => (
              <Link key={x.id} href={`/koszt-trasy/${x.id}/`} className="px-2.5 py-1 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-steel-400">
                {x.a.nazwa} – {x.b.nazwa}
              </Link>
            ))}
          </div>
        </section>
      )}
      <KodStrony sciezka={`/koszt-trasy/${t.id}/`} />
    </div>
  );
}
