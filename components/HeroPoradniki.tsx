import { poradnik, typo } from '@/lib/poradniki';
import type { Grafika } from '@/components/HeroIlustracje';
import HeroPoradnikiLosowe, { type KafelHero } from '@/components/HeroPoradnikiLosowe';

// Pula poradników do kafelków w nagłówku strony głównej.
// Przy każdym wejściu na stronę losują się 3 z tej listy (pierwszy wylosowany dostaje duży kafelek).
// Żeby dodać poradnik: dopisz nowy wiersz – „slug” to adres poradnika bez /poradniki/,
// „grafika” to jeden z obrazków z pliku HeroIlustracje.tsx.
// Poradnik, który nie jest jeszcze opublikowany, sam się pomija.
const PULA: { slug: string; grafika: Grafika; dopisek: string; tlo: string; akcent: string }[] = [
  { slug: 'umowa-kupna-sprzedazy-samochodu', grafika: 'umowa', dopisek: 'Gotowy wzór do druku', tlo: 'from-sky-500/30 via-sky-900/40 to-slate-900/80', akcent: 'text-sky-300' },
  { slug: 'cofniety-licznik-jak-sprawdzic-przebieg', grafika: 'licznik', dopisek: 'Sprawdź przed zakupem', tlo: 'from-amber-500/30 via-amber-900/40 to-slate-900/80', akcent: 'text-amber-300' },
  { slug: 'kolizja-bez-policji', grafika: 'kolizja', dopisek: 'Oświadczenie sprawcy', tlo: 'from-rust-500/30 via-rust-900/40 to-slate-900/80', akcent: 'text-rust-300' },
  { slug: 'kupilem-auto-co-dalej', grafika: 'kluczyk', dopisek: 'Terminy i formalności', tlo: 'from-sky-500/30 via-sky-900/40 to-slate-900/80', akcent: 'text-sky-300' },
  { slug: 'numer-vin-co-oznacza', grafika: 'vin', dopisek: 'Odczytaj numer VIN', tlo: 'from-amber-500/30 via-amber-900/40 to-slate-900/80', akcent: 'text-amber-300' },
  { slug: 'ile-kosztuje-oc', grafika: 'oc', dopisek: 'Jak płacić mniej', tlo: 'from-indigo-500/30 via-indigo-900/40 to-slate-900/80', akcent: 'text-indigo-300' },
  { slug: 'przeglad-techniczny-terminy-koszt', grafika: 'przeglad', dopisek: 'Terminy i ceny', tlo: 'from-violet-500/30 via-violet-900/40 to-slate-900/80', akcent: 'text-violet-300' },
  { slug: 'sprowadzenie-auta-z-zagranicy', grafika: 'import', dopisek: 'Krok po kroku', tlo: 'from-sky-500/30 via-sky-900/40 to-slate-900/80', akcent: 'text-sky-300' },
  { slug: 'kontrolki-w-samochodzie', grafika: 'kontrolki', dopisek: 'Co oznacza lampka', tlo: 'from-teal-500/30 via-teal-900/40 to-slate-900/80', akcent: 'text-teal-300' }
];

export default function HeroPoradniki() {
  const kafle: KafelHero[] = PULA.flatMap((w) => {
    const p = poradnik(w.slug); // zwraca tylko opublikowane poradniki
    return p ? [{ ...w, tytul: typo(p.krotko), opis: typo(p.opis) }] : [];
  });
  if (kafle.length === 0) return null;
  return <HeroPoradnikiLosowe kafle={kafle} />;
}
