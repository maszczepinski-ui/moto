import type { Metadata } from 'next';
import Link from 'next/link';
import KalkulatorTrasy from '@/components/KalkulatorTrasy';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import { cenyPaliw } from '@/lib/panel';
import { wszystkieTrasy, MIASTA_TRAS, miasto } from '@/lib/miasta';

export const metadata: Metadata = {
  title: 'Kalkulator kosztu przejazdu – ile zapłacisz za paliwo na trasie',
  description:
    'Policz koszt paliwa lub prądu na trasie między miastami: spalanie Twojego auta, aktualne ceny paliw, podział kosztów na pasażerów i jazda w obie strony.',
  alternates: { canonical: '/koszt-trasy/' }
};

export default function KosztTrasyPage() {
  const ceny = cenyPaliw();
  const trasy = wszystkieTrasy();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Okruszki sciezka={[{ nazwa: 'Koszt trasy', adres: '/koszt-trasy/' }]} />
      <NaglowekDzialu
        zdjecie="trasa"
        nadtytul="W trasie"
        tytul="Ile kosztuje przejazd?"
        opis="Wpisz skąd i dokąd jedziesz, wybierz napęd i spalanie – policzymy koszt paliwa, także na osobę. Na kartach modeli kalkulator startuje ze spalaniem konkretnego auta."
      />

      <KalkulatorTrasy ceny={ceny} naglowek={false} />

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['Benzyna Pb95', ceny.pb95, 'zł/l'],
          ['Diesel', ceny.on, 'zł/l'],
          ['LPG', ceny.lpg, 'zł/l'],
          ['Prąd (średnio)', ceny.prad, 'zł/kWh']
        ].map(([n, c, j]) => (
          <div key={n as string} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-500">{n}</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {(c as number).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-sm font-semibold text-slate-500">{j}</span>
            </div>
          </div>
        ))}
        <p className="col-span-2 sm:col-span-4 text-xs text-slate-500">
          Średnie ceny w Polsce z {new Date(ceny.data).toLocaleDateString('pl-PL')}. Na Twojej stacji mogą się różnić – w kalkulatorze wpiszesz własną cenę. Prąd: średnia z
          ładowania w domu i na publicznych ładowarkach.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popularne trasy</h2>
        <div className="space-y-4">
          {MIASTA_TRAS.slice(0, 10).map((s) => {
            const m = miasto(s)!;
            const z = trasy.filter((t) => t.a.slug === s || t.b.slug === s).slice(0, 8);
            return (
              <div key={s}>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Z miasta {m.nazwa}</h3>
                <div className="flex flex-wrap gap-2">
                  {z.map((t) => {
                    const cel = t.a.slug === s ? t.b : t.a;
                    return (
                      <Link
                        key={t.id}
                        href={`/koszt-trasy/${t.id}/`}
                        className="px-2.5 py-1 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-steel-400"
                      >
                        {m.nazwa} – {cel.nazwa} <span className="text-slate-400">({t.km} km)</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="prose-sm max-w-none text-slate-700 dark:text-slate-300 space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Jak liczymy koszt przejazdu</h2>
        <p>
          Koszt = odległość ÷ 100 × spalanie × cena paliwa. Odległość między miastami szacujemy na podstawie położenia miast (drogi są średnio o ok. 25% dłuższe niż linia
          prosta). Jeśli znasz dokładny dystans z nawigacji, wpisz go w pole „Odległość”.
        </p>
        <p>
          Spalanie w trasie jest zwykle niższe niż w mieście – dlatego kalkulator startuje od wartości „w trasie”. Auta elektryczne zużywają więcej energii przy prędkościach
          autostradowych, co też uwzględniamy. Opłat za autostrady nie liczymy.
        </p>
      </section>
      <KodStrony sciezka={'/koszt-trasy/'} />
    </div>
  );
}
