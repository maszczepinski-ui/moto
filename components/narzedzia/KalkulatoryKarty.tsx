import { Calculator, ArrowRight } from 'lucide-react';
import type { CarModel } from '@/types/car-model';
import { getModelBySlug } from '@/lib/models';
import { modelMaStronePrzebiegu } from '@/lib/narzedzia/przebieg';
import { modelMaStroneLpg } from '@/lib/narzedzia/lpg';

// Blok na karcie modelu: linki do kalkulatorów dopasowanych do modelu (przebieg, LPG) i najważniejszych ogólnych.
// Karty generacji linkują do stron modelu zbiorczego (np. Golf IV → strona „przebieg Volkswagen Golf”).
// Linki wewnętrzne z ok. 1300 kart pomagają Google szybko znaleźć i zaindeksować nowe podstrony kalkulatorów.

export default function KalkulatoryKarty({ m }: { m: CarModel }) {
  const rodzina = m.wszystkieGeneracje ? m : m.rodzic ? getModelBySlug(m.rodzic) : undefined;
  const nazwa = `${m.marka} ${m.model}`;
  const linki: { href: string; tytul: string; opis: string }[] = [];
  if (rodzina && modelMaStronePrzebiegu(rodzina)) linki.push({ href: `/sprawdz-przebieg/${rodzina.slug}/`, tytul: `Typowy przebieg ${nazwa}`, opis: 'Czy przebieg z ogłoszenia pasuje do rocznika?' });
  if (rodzina && modelMaStroneLpg(rodzina)) linki.push({ href: `/oplacalnosc-lpg/${rodzina.slug}/`, tytul: `${nazwa} na LPG`, opis: 'Po ilu km zwróci się instalacja gazowa?' });
  linki.push(
    { href: '/ile-zbic-cene-auta/', tytul: 'Ile zbić z ceny?', opis: 'Koszt usterek z oględzin i propozycja obniżki.' },
    { href: '/formalnosci-po-zakupie-auta/', tytul: 'Terminarz po zakupie', opis: 'PCC-3, rejestracja i OC – daty i kary.' },
    { href: '/kalendarz-napraw/', tytul: 'Kalendarz drogich napraw', opis: 'Rozrząd, sprzęgło, DPF – kiedy i za ile.' },
    { href: '/kalkulator-felg/', tytul: 'Kalkulator felg i ET', opis: 'Czy nowe koła zmieszczą się w nadkolu.' }
  );
  return (
    <section aria-labelledby="kalkulatory-karty" className="space-y-4 print:hidden">
      <h2 id="kalkulatory-karty" className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
        <Calculator className="w-6 h-6 text-rust-600" aria-hidden="true" /> Kalkulatory dla kupujących {nazwa}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {linki.slice(0, 6).map((l) => (
          <a key={l.href} href={l.href} className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 flex items-start justify-between gap-3 hover:ring-rust-400">
            <span>
              <span className="block font-bold text-slate-900 dark:text-white">{l.tytul}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{l.opis}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
