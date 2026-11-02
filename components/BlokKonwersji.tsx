import { ArrowRight, ClipboardList, Stethoscope, Sparkles } from 'lucide-react';
import { BoksVin, BoksUbezpieczenia, BoksCzesci } from '@/components/Monetyzacja';
import { KontekstKarty, pokazModul } from '@/lib/panel';
import { Konwersja } from '@/lib/wpisy';
import { rankingiNaTeraz } from '@/lib/produkty';

// Jeden blok „co dalej” pod artykułem – dopasowany do tematu filmu, a nie wszystkie linki naraz.
export default function BlokKonwersji({ typ, k, adresZakupu }: { typ: Konwersja; k: KontekstKarty; adresZakupu?: string }) {
  if (typ === 'brak') return null;
  const karta = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-rust-400';

  if (typ === 'zakup')
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {pokazModul('vin', k) && <BoksVin k={k} />}
        <a href={adresZakupu || '/asystent-zakupu/'} className={karta}>
          <span className="flex items-start gap-3">
            <ClipboardList className="w-6 h-6 text-rust-600 flex-shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-extrabold text-slate-900 dark:text-white">Asystent zakupu{k.model ? ` ${k.model}` : ''}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">Lista do oględzin, typowe usterki, koszty i formalności po zakupie.</span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-rust-600 flex-shrink-0" aria-hidden="true" />
        </a>
      </div>
    );

  if (typ === 'ubezpieczenie') return pokazModul('ubezpieczenia', k) ? <BoksUbezpieczenia k={k} /> : null;

  if (typ === 'diagnostyka')
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <a href="/kody-bledow/" className={karta}>
          <span className="flex items-start gap-3">
            <Stethoscope className="w-6 h-6 text-steel-600 flex-shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-extrabold text-slate-900 dark:text-white">Kody błędów OBD</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">Co oznacza kod z diagnostyki, objawy i najczęstsze przyczyny.</span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-steel-600 flex-shrink-0" aria-hidden="true" />
        </a>
        {pokazModul('czesci', k) && <BoksCzesci k={k} />}
      </div>
    );

  // detailing → aktualne rankingi sezonowe
  const { teraz } = rankingiNaTeraz();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {(teraz.length ? teraz : []).slice(0, 2).map((r) => (
        <a key={r.id} href={`/polecane/${r.id}/`} className={karta}>
          <span className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-extrabold text-slate-900 dark:text-white">{r.tytul}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{r.opis}</span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
        </a>
      ))}
      {!teraz.length && pokazModul('czesci', k) && <BoksCzesci k={k} />}
    </div>
  );
}
