import { AlertTriangle, CheckCircle2, Gauge, ImageIcon, ShieldAlert, FileSearch } from 'lucide-react';
import VinHero from '@/components/VinHero';
import { panelDane, linkVin, linkVinOgolny } from '@/lib/panel';

// Wyróżniona sekcja „Sprawdź VIN” na stronie głównej: ciemne tło z poświatą, duża typografia,
// pole VIN i ilustracja raportu (wyraźnie opisana jako przykład – to nie są prawdziwe dane żadnego auta).

const ZAWIERA = ['Historia przebiegu i cofnięte liczniki', 'Szkody i koszty napraw', 'Zdjęcia auta z przeszłości', 'Cena rynkowa', 'Specyfikacja i wyposażenie', 'Oceny bezpieczeństwa'];

const PRZEBIEG = [
  { rok: '2016', km: 38 },
  { rok: '2018', km: 92 },
  { rok: '2020', km: 151 },
  { rok: '2022', km: 118 },
  { rok: '2024', km: 135 }
];

function PrzykladRaportu() {
  const max = Math.max(...PRZEBIEG.map((p) => p.km));
  return (
    <div className="relative" aria-label="Ilustracja przykładowego raportu" role="img">
      <div className="absolute -inset-6 bg-gradient-to-tr from-rust-500/30 via-steel-400/20 to-transparent blur-2xl rounded-[3rem]" aria-hidden="true" />
      <div className="relative rounded-3xl bg-white/[0.07] ring-1 ring-white/15 backdrop-blur-xl p-5 sm:p-6 shadow-2xl rotate-[1.5deg] lg:rotate-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <FileSearch className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-bold">Raport historii pojazdu</div>
              <div className="font-mono text-[11px] tracking-widest text-white/50">WVWZZZ•••••••0000</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 rounded-full px-2 py-1 text-white/70">przykład</span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" aria-hidden="true" /> Przebieg (tys. km)
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> cofnięty licznik
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {PRZEBIEG.map((p, i) => {
              const spadek = i > 0 && p.km < PRZEBIEG[i - 1].km;
              return (
                <div key={p.rok} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className={`text-[10px] font-bold tabular-nums ${spadek ? 'text-amber-300' : 'text-white/70'}`}>{p.km}</span>
                  <span className={`w-full rounded-t-[4px] ${spadek ? 'bg-amber-400' : 'bg-white/40'}`} style={{ height: `${(p.km / max) * 78}%` }} />
                  <span className="text-[10px] text-white/50">{p.rok}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <ShieldAlert className="w-4 h-4 text-rose-300 mb-1" aria-hidden="true" />
            <div className="font-bold">2 szkody</div>
            <div className="text-white/50">tył, prawy bok</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <ImageIcon className="w-4 h-4 text-sky-300 mb-1" aria-hidden="true" />
            <div className="font-bold">14 zdjęć</div>
            <div className="text-white/50">z dawnych ogłoszeń</div>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-white/40">Ilustracja MotoFormat z przykładowymi danymi – to nie jest zrzut raportu carVertical i nie dotyczy żadnego auta.</p>
      </div>
    </div>
  );
}

export default function SekcjaVinGlowna({ sprowadzone }: { sprowadzone: number }) {
  const v = panelDane.moduly?.vin;
  const cv = v?.partner === 'carvertical';
  const k = { slug: 'strona-glowna', marka: '', model: '' };
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-t border-white/10" aria-labelledby="vin-naglowek">
      {/* tło: siatka + poświaty */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        aria-hidden="true"
      />
      <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-rust-600/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-48 right-0 w-[40rem] h-[40rem] rounded-full bg-steel-500/25 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            {cv ? 'Raport historii pojazdu · carVertical' : 'Raport historii pojazdu'}
          </span>
          <h2 id="vin-naglowek" className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02]">
            Nie kupuj
            <br />
            <span className="bg-gradient-to-r from-rust-400 via-amber-300 to-rust-400 bg-clip-text text-transparent">kota w worku.</span>
          </h2>
          <p className="text-lg text-white/75 max-w-xl leading-relaxed">
            Według CEPiK <strong className="text-white">{sprowadzone}% aut w Polsce</strong> sprowadzono z zagranicy jako używane. Ich historia jest w bazach innych krajów –
            sprawdź ją po numerze VIN, zanim pojedziesz oglądać auto.
          </p>
          <VinHero szablon={linkVin(k)} ogolny={linkVinOgolny(k)} partner={v?.partner || 'vin'} kod={v?.kod || ''} rabat={v?.rabat || ''} />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 text-sm text-white/80">
            {ZAWIERA.map((z) => (
              <li key={z} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" /> {z}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/50">
            Numer VIN znajdziesz w dowodzie rejestracyjnym (pole <strong className="text-white/70">E</strong>) i pod przednią szybą. Poproś sprzedającego o zdjęcie.
          </p>
        </div>
        <PrzykladRaportu />
      </div>
    </section>
  );
}
