'use client';
import { useState } from 'react';
import { Leaf, Wrench, Gauge } from 'lucide-react';
import { sygnaly, type DaneKiedy } from '@/lib/narzedzia/kiedy-sprzedac';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Przelacznik, Werdykt } from '@/components/narzedzia/Pola';

const IKONY = { sct: Leaf, naprawa: Wrench, prog: Gauge };

export default function KalkulatorKiedySprzedac({ rokTeraz }: { rokTeraz: number }) {
  const [paliwo, setPaliwo] = useState<DaneKiedy['paliwo']>('diesel');
  const [rocznik, setRocznik] = useState(2012);
  const [przebieg, setPrzebieg] = useState(170000);
  const [km, setKm] = useState(15000);
  const [skrzynia, setSkrzynia] = useState<DaneKiedy['skrzynia']>('manual');
  const [rozrzad, setRozrzad] = useState<DaneKiedy['rozrzad']>('pasek');
  const lista = sygnaly({ paliwo, rocznik, przebieg, kmRocznie: km, skrzynia, rozrzad, rokTeraz });
  const pierwszy = lista.find((s) => s.waga === 'duza');
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator: kiedy sprzedać auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PoleWyboru id="ks-p" etykieta="Paliwo" wartosc={paliwo} ustaw={setPaliwo} opcje={[{ id: 'benzyna', nazwa: 'Benzyna / LPG' }, { id: 'diesel', nazwa: 'Diesel' }, { id: 'hybryda', nazwa: 'Hybryda' }, { id: 'elektryczny', nazwa: 'Elektryczny' }]} />
        <PoleLiczby id="ks-r" etykieta="Rocznik" wartosc={rocznik} ustaw={setRocznik} min={1980} max={rokTeraz} />
        <PoleLiczby id="ks-km" etykieta="Obecny przebieg" wartosc={przebieg} ustaw={setPrzebieg} krok={5000} jednostka="km" />
        <PoleLiczby id="ks-rok" etykieta="Rocznie" wartosc={km} ustaw={setKm} krok={1000} jednostka="km" />
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Przelacznik etykieta="Skrzynia" wartosc={skrzynia} ustaw={setSkrzynia} opcje={[{ id: 'manual', nazwa: 'Manualna' }, { id: 'automat', nazwa: 'Automat' }]} />
        <Przelacznik etykieta="Rozrząd" wartosc={rozrzad} ustaw={setRozrzad} opcje={[{ id: 'pasek', nazwa: 'Pasek' }, { id: 'lancuch', nazwa: 'Łańcuch' }]} />
      </div>
      {pierwszy ? (
        <Werdykt ton={pierwszy.rok <= rokTeraz ? 'czerwony' : 'zolty'} tytul={pierwszy.rok <= rokTeraz ? 'Dobry moment na sprzedaż jest teraz' : `Najlepiej sprzedać przed ${pierwszy.rok} r.`}>
          Najbliższy ważny sygnał: {pierwszy.tytul.toLowerCase()}.
        </Werdykt>
      ) : (
        <Werdykt ton="zielony" tytul="W najbliższych 5 latach nie widać ważnych sygnałów">
          Auto nie zbliża się do progów przebiegu, zakazów wjazdu ani typowych drogich napraw – możesz spokojnie jeździć.
        </Werdykt>
      )}
      <ol className="space-y-3">
        {lista.map((s) => {
          const I = IKONY[s.typ];
          return (
            <li key={`${s.typ}-${s.tytul}`} className="flex gap-3 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.waga === 'duza' ? 'bg-rust-100 text-rust-700 dark:bg-rust-950 dark:text-rust-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                <I className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-500">{s.rok <= rokTeraz ? 'teraz' : `${s.rok} r.`}</p>
                <p className="font-extrabold text-slate-900 dark:text-white">{s.tytul}</p>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{s.opis}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
