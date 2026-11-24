import type { Metadata } from 'next';
import { Ruler } from 'lucide-react';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorZamiennikow from '@/components/narzedzia/KalkulatorZamiennikow';
import { CtaOpony, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { POPULARNE, STAN_FELG, nazwaOpony, slugOpony, srednicaKola } from '@/lib/narzedzia/felgi';
import { ZRODLA_FELGI } from '@/lib/narzedzia/felgi-tresc';
import { site } from '@/config/site';

const TYTUL = 'Zamiennik opon – kalkulator rozmiarów';
const OPIS = 'Wpisz rozmiar opony, a pokażemy zamienniki o prawie tej samej średnicy koła (±2% lub ±3%), różnicę w milimetrach i odczyt prędkościomierza. Ponad 70 rozmiarów.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/zamiennik-opon/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/zamiennik-opon/` }
};

const SEKCJE: Sekcja[] = [
  {
    h2: 'Jak działa zamiennik rozmiaru opony',
    akapity: [
      'Zamiennik to opona o innym oznaczeniu, ale bardzo podobnej średnicy całego koła. Dzięki temu prędkościomierz pokazuje prawie to samo, a koło mieści się w nadkolu podobnie jak fabryczne. Najczęściej zamienia się szerokość i profil przy tej samej felgi (np. 205/55 R16 i 215/50 R16) albo przechodzi na felgę większą o cal z niższym profilem (np. 205/55 R16 → 225/45 R17).',
      'Średnicę koła liczymy ze wzoru: średnica felgi w calach × 25,4 mm plus dwie wysokości boku opony (szerokość × profil). Kalkulator pokazuje rozmiary w wybranej tolerancji, od najbardziej zbliżonych.'
    ]
  },
  {
    h2: 'Na co uważać przy zmianie rozmiaru',
    lista: [
      'Szersza opona może ocierać o nadkole lub zawieszenie – sprawdź to w kalkulatorze felg i ET.',
      'Nowy rozmiar wymaga felgi o odpowiedniej szerokości (J).',
      'Indeks nośności i prędkości nie może być niższy niż wymagany dla auta.',
      'Niższy profil to twardsza jazda i większe ryzyko uszkodzenia felgi na dziurach.',
      'Na jednej osi muszą być opony tego samego rozmiaru i typu.'
    ]
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Jaka różnica średnicy opony jest dopuszczalna?', a: 'W praktyce przyjmuje się do ok. 2–3% względem rozmiaru fabrycznego. Mniejsza różnica to dokładniejszy prędkościomierz i mniejsze ryzyko ocierania.' },
  { q: 'Czy mogę założyć opony w innym rozmiarze niż fabryczne?', a: 'Tak, jeśli koło mieści się w nadkolu, nie ociera, a opona ma odpowiedni indeks nośności i prędkości. Najbezpieczniej wybierać rozmiary z listy producenta auta.' },
  { q: 'Jak sprawdzić, jakie opony pasują do mojego auta?', a: 'W instrukcji, na naklejce na słupku drzwi kierowcy lub na klapce wlewu paliwa. Rozmiar opon jest też w świadectwie zgodności (CoC).' }
];

export default function ZamiennikiPage() {
  const grupy = [...new Set(POPULARNE.map((o) => o.felga))];
  return (
    <StronaNarzedzia
      id="zamienniki"
      adres="/zamiennik-opon/"
      okruszki={[{ nazwa: 'Zamienniki rozmiaru opon', adres: '/zamiennik-opon/' }]}
      zdjecie="opony"
      nadtytul="Zamiennik opon"
      tytul="Jaki rozmiar opony zamiast fabrycznego?"
      opis="Wpisz rozmiar opony. Pokażemy zamienniki o prawie tej samej średnicy koła, różnicę w milimetrach i to, co pokaże prędkościomierz."
      nazwaAplikacji="Kalkulator zamienników opon"
      narzedzie={<KalkulatorZamiennikow />}
      przedTrescia={
        <SiatkaCta>
          <CtaOpony karta="narzedzie-zamienniki" />
          <Odnosnik href="/kalkulator-felg/" ikona={Ruler} tytul="Kalkulator felg i ET" tekst="Sprawdź na rysunku, czy szersza opona zmieści się w nadkolu." />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      poTresci={
        <section className="space-y-6">
          <h2 className={H2}>Popularne rozmiary opon</h2>
          {grupy.map((f) => (
            <div key={f} className="space-y-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Felga {f} cali</h3>
              <ul className="flex flex-wrap gap-2">
                {POPULARNE.filter((o) => o.felga === f).map((o) => (
                  <li key={slugOpony(o)}>
                    <a href={`/zamiennik-opon/${slugOpony(o)}/`} className="inline-block rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-rust-50 hover:text-rust-700" title={`Średnica koła ${Math.round(srednicaKola(o))} mm`}>
                      {nazwaOpony(o)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      }
      pytania={PYTANIA}
      zrodla={ZRODLA_FELGI}
      stan={STAN_FELG}
    />
  );
}
