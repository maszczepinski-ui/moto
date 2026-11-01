import type { Metadata } from 'next';
import { KODY } from '@/lib/kody-bledow';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Kody błędów OBD-II – co oznaczają, objawy i przyczyny',
  description: 'Najczęstsze kody błędów silnika OBD-II (P0420, P0171, P0300, P0401, P0299 i inne): co oznaczają, jakie dają objawy, co sprawdzić i w jakich autach występują najczęściej.',
  alternates: { canonical: '/kody-bledow/' }
};

const GRUPY: [string, RegExp][] = [
  ['Zapłon i wypadanie zapłonów', /^P030[0-9]$/],
  ['Mieszanka, paliwo, świece żarowe i czujniki', /^P0(1[0-9]{2}|08[0-9]|38[0-9])$/],
  ['Rozrząd i czujniki położenia wałów', /^P00[0-9]{2}$|^P03[34]/],
  ['Recyrkulacja spalin, katalizator, DPF, opary paliwa', /^P0[4][0-9]{2}$|^P2/],
  ['Doładowanie', /^P02/],
  ['Elektryka, sterowniki i skrzynia', /^P0[5-7]/]
];

export default function KodyPage() {
  const uzyte = new Set<string>();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Kody błędów', adres: '/kody-bledow/' }]} />
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Kody błędów OBD-II</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Kody zaczynające się od P0 i P2 to kody uniwersalne – znaczą to samo w każdym aucie z gniazdem OBD-II (benzyny od 2001 r., diesle od 2004 r. w UE). Odczytasz je tanim skanerem
          podłączonym do gniazda pod kierownicą.
        </p>
      </header>
      {GRUPY.map(([nazwa, wzor]) => {
        const lista = KODY.filter((k) => !uzyte.has(k.kod) && wzor.test(k.kod));
        lista.forEach((k) => uzyte.add(k.kod));
        if (!lista.length) return null;
        return (
          <section key={nazwa}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{nazwa}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lista.map((k) => (
                <li key={k.kod}>
                  <a href={`/kody-bledow/${k.kod.toLowerCase()}/`} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 hover:border-steel-400">
                    <strong className="font-mono text-rust-600">{k.kod}</strong> <span className="text-sm text-slate-700 dark:text-slate-300">{k.nazwa}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <KodStrony sciezka="/kody-bledow/" />
    </div>
  );
}
