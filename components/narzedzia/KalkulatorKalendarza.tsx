'use client';
import { useState } from 'react';
import { naprawyWZakresie, type Dotyczy } from '@/lib/narzedzia/naprawy';
import { KARTA_NARZEDZIA, PoleLiczby, Przelacznik, Liczba } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;
const km = (n: number) => `${Math.round(n / 1000).toLocaleString('pl-PL')} tys. km`;

export default function KalkulatorKalendarza({ przebiegStart = 140000 }: { przebiegStart?: number }) {
  const [przebieg, setPrzebieg] = useState(przebiegStart);
  const [rocznie, setRocznie] = useState(15000);
  const [lata, setLata] = useState(3);
  const [paliwo, setPaliwo] = useState<'benzyna' | 'diesel'>('diesel');
  const [turbo, setTurbo] = useState<'tak' | 'nie'>('tak');
  const [skrzynia, setSkrzynia] = useState<'manual' | 'automat'>('manual');
  const [rozrzad, setRozrzad] = useState<'pasek' | 'lancuch'>('pasek');
  const doKm = przebieg + rocznie * lata;
  const pasuje = (d: Dotyczy) =>
    d === 'wszystkie' || (d === 'diesel' && paliwo === 'diesel') || (d === 'turbo' && (turbo === 'tak' || paliwo === 'diesel')) || (d === 'automat' && skrzynia === 'automat') || (d === 'manual' && skrzynia === 'manual') || d === rozrzad;
  const lista = naprawyWZakresie(przebieg, doKm).filter((x) => pasuje(x.n.dotyczy));
  const sumaOd = lista.reduce((s, x) => s + x.n.kosztOd, 0);
  const sumaDo = lista.reduce((s, x) => s + x.n.kosztDo, 0);
  const rok = new Date().getFullYear();
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalendarz drogich napraw">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PoleLiczby id="kn-p" etykieta="Obecny przebieg" wartosc={przebieg} ustaw={setPrzebieg} krok={5000} jednostka="km" />
        <PoleLiczby id="kn-r" etykieta="Ile jeździsz rocznie" wartosc={rocznie} ustaw={setRocznie} krok={1000} jednostka="km" />
        <PoleLiczby id="kn-l" etykieta="Na ile lat planujesz" wartosc={lata} ustaw={(n) => setLata(Math.max(1, Math.min(8, n)))} min={1} max={8} jednostka="lat" />
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Przelacznik etykieta="Paliwo" wartosc={paliwo} ustaw={setPaliwo} opcje={[{ id: 'benzyna', nazwa: 'Benzyna / LPG' }, { id: 'diesel', nazwa: 'Diesel' }]} />
        {paliwo === 'benzyna' && <Przelacznik etykieta="Turbo" wartosc={turbo} ustaw={setTurbo} opcje={[{ id: 'tak', nazwa: 'Tak' }, { id: 'nie', nazwa: 'Nie' }]} />}
        <Przelacznik etykieta="Skrzynia" wartosc={skrzynia} ustaw={setSkrzynia} opcje={[{ id: 'manual', nazwa: 'Manualna' }, { id: 'automat', nazwa: 'Automat (DSG i podobne)' }]} />
        <Przelacznik etykieta="Rozrząd" wartosc={rozrzad} ustaw={setRozrzad} opcje={[{ id: 'pasek', nazwa: 'Pasek' }, { id: 'lancuch', nazwa: 'Łańcuch' }]} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Liczba etykieta="Okres planu" wartosc={`${km(przebieg)} → ${km(doKm)}`} opis={`${rok}–${rok + lata}`} />
        <Liczba etykieta="Pozycji do przygotowania" wartosc={`${lista.length}`} />
        <Liczba etykieta="Budżet na naprawy" wartosc={lista.length ? `${zl(sumaOd)}–${zl(sumaDo)}` : '0 zł'} opis="orientacyjnie, ceny 2026" mocna />
      </div>
      {lista.length > 0 ? (
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-5">
          {lista.map(({ n, km: k }) => {
            const za = Math.max(0, (k - przebieg) / Math.max(1, rocznie));
            return (
              <li key={n.id} className="ml-6">
                <span className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-rust-500 ring-4 ring-white dark:ring-slate-900" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-xs font-bold rounded-full px-2.5 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900">ok. {km(k)}</span>
                  <span className="text-xs text-slate-500">{za < 0.5 ? 'w tym roku' : `za ok. ${za.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} ${za < 1.5 ? 'rok' : za < 4.5 ? 'lata' : 'lat'}`}</span>
                </div>
                <h3 className="mt-1.5 font-extrabold text-slate-900 dark:text-white">
                  <a href={`/ile-zbic-cene-auta/${n.slug}/`} className="hover:underline">
                    {n.nazwa}
                  </a>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {zl(n.kosztOd)}–{zl(n.kosztDo)} · objawy: {n.objawy.slice(0, 2).join(', ')}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-slate-500">W tym zakresie przebiegu nie ma typowych drogich napraw – zostaje zwykły serwis.</p>
      )}
      <p className="text-xs text-slate-500">Kalendarz pokazuje typowe przebiegi dla popularnych aut. Jeśli dana naprawa była już zrobiona (masz fakturę), możesz ją pominąć. O interwałach konkretnego silnika decyduje instrukcja producenta.</p>
    </section>
  );
}
