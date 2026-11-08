import type { Metadata } from 'next';
import { FileSearch, Wrench, ClipboardCheck, Wallet, FileText, ExternalLink } from 'lucide-react';
import { getAllModels } from '@/lib/models';
import { nazwaKarty } from '@/lib/opis';
import { fmt } from '@/lib/format';
import { FORMALNOSCI, ZRODLA_FORMALNOSCI } from '@/lib/zakup';
import WyszukiwarkaZakupu, { KartaWyszukiwarki } from '@/components/WyszukiwarkaZakupu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';

export const metadata: Metadata = {
  title: 'Asystent zakupu używanego auta – na co uważać, lista kontrolna, formalności',
  description:
    'Kupujesz używane auto? Wpisz model albo wklej link do ogłoszenia: typowe usterki, lista rzeczy do sprawdzenia na oględzinach, historia VIN, koszty utrzymania i formalności po zakupie.',
  alternates: { canonical: '/asystent-zakupu/' }
};

const KROKI = [
  { ikona: FileSearch, t: 'Historia egzemplarza', o: 'Darmowo w Historii Pojazdu (gov.pl), a przy aucie sprowadzonym – raport z zagranicznych baz po VIN.' },
  { ikona: Wrench, t: 'Typowe usterki modelu', o: 'Co psuje się w tym konkretnym modelu i silniku oraz które kody błędów warto znać.' },
  { ikona: ClipboardCheck, t: 'Oględziny i jazda próbna', o: 'Lista do odhaczania w telefonie – ogólna i dopasowana do napędu (diesel, LPG, hybryda, elektryk).' },
  { ikona: Wallet, t: 'Koszty utrzymania', o: 'Kalkulator paliwa, serwisu i ubezpieczenia dla Twojego przebiegu.' },
  { ikona: FileText, t: 'Formalności po zakupie', o: 'Umowa, OC, podatek PCC i rejestracja – z terminami.' }
];

export default function AsystentZakupuPage() {
  const modele = getAllModels();
  const lata = (t: string) => {
    const y = (t.match(/\d{4}/g) || []).map(Number);
    return { od: y[0] || 1900, do: /dziś|obecnie/i.test(t) || y.length < 2 ? 2030 : y[y.length - 1] };
  };
  const karty: KartaWyszukiwarki[] = modele.map((m) => ({ n: nazwaKarty(m), a: m.adres, l: m.cepik.liczbaWPolsce, s: m.slug, g: !m.wszystkieGeneracje, ...lata(m.lataProdukcji) }));
  const popularne = modele
    .filter((m) => m.wszystkieGeneracje)
    .sort((a, b) => (b.cepik.aktywne ?? 0) - (a.cepik.aktywne ?? 0))
    .slice(0, 24);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <div className="space-y-5">
        <Okruszki sciezka={[{ nazwa: 'Asystent zakupu', adres: '/asystent-zakupu/' }]} />
        <header className="space-y-3">
          <p className="text-sm font-bold text-rust-600 uppercase tracking-widest">Asystent zakupu</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Kupujesz używane auto? Sprawdź je, zanim zapłacisz</h1>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Wpisz model albo wklej link do ogłoszenia. Dostaniesz jedną stronę z tym, co trzeba wiedzieć o tym aucie: jak często było sprowadzane, co się w nim psuje, co
            sprawdzić na oględzinach, ile kosztuje utrzymanie i jakie formalności czekają po zakupie.
          </p>
        </header>
        <div className="bg-steel-50 dark:bg-slate-900 border border-steel-200 dark:border-slate-800 rounded-2xl p-5">
          <WyszukiwarkaZakupu karty={karty} />
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Co dostaniesz</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {KROKI.map(({ ikona: Ikona, t, o }, i) => (
            <li key={t} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rust-600 text-white text-sm font-black flex items-center justify-center">{i + 1}</span>
              <div>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Ikona className="w-4 h-4 text-steel-600" aria-hidden="true" /> {t}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{o}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Najczęściej kupowane używane modele</h2>
        <p className="text-sm text-slate-500 -mt-2">Modele, które w danych CEPiK najczęściej zmieniały właściciela albo były sprowadzane.</p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {popularne.map((m) => (
            <li key={m.slug}>
              <a href={`${m.adres}zakup/`} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 hover:border-rust-400">
                <span className="font-semibold text-slate-900 dark:text-white">{nazwaKarty(m)}</span>
                <span className="block text-xs text-slate-500">{fmt(m.cepik.liczbaWPolsce)} w Polsce</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kupiłem auto – co dalej? Formalności z terminami</h2>
        <ol className="space-y-3">
          {FORMALNOSCI.map((x, i) => (
            <li key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4">
              <span className="flex-shrink-0 w-24 text-xs font-bold uppercase tracking-wide text-rust-600 pt-0.5">{x.kiedy}</span>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white">{x.co}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{x.opis}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-slate-500">
          Dotyczy auta zarejestrowanego w Polsce, kupionego od osoby prywatnej. Stan przepisów na listopad 2026 r. Źródła:{' '}
          {ZRODLA_FORMALNOSCI.map((z, i) => (
            <span key={z.url}>
              {i > 0 && ', '}
              <a href={z.url} target="_blank" rel="noopener" className="underline inline-flex items-center gap-0.5">
                {z.nazwa} <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </span>
          ))}
          .
        </p>
      </section>
      <KodStrony sciezka="/asystent-zakupu/" />
    </div>
  );
}
