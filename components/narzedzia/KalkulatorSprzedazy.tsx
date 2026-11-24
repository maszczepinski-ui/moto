'use client';
import { useState } from 'react';
import { policzSprzedaz, type Stan } from '@/lib/narzedzia/sprzedaz';
import { KARTA_NARZEDZIA, PoleLiczby, Przelacznik, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export default function KalkulatorSprzedazy() {
  const [wartosc, setWartosc] = useState(35000);
  const [stan, setStan] = useState<Stan>('dobry');
  const [oc, setOc] = useState(700);
  const wyniki = policzSprzedaz(wartosc, stan, oc);
  const najwiecej = [...wyniki].sort((a, b) => b.naReke - a.naReke)[0];
  const najszybciej = [...wyniki].sort((a, b) => a.dni - b.dni)[0];
  const maks = Math.max(...wyniki.map((w) => w.naRekeDo), 1);
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator: gdzie sprzedać auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PoleLiczby id="gs-w" etykieta="Cena rynkowa auta" wartosc={wartosc} ustaw={setWartosc} krok={500} jednostka="zł" podpowiedz="średnia z ogłoszeń podobnych aut" />
        <PoleLiczby id="gs-oc" etykieta="OC rocznie" wartosc={oc} ustaw={setOc} krok={50} jednostka="zł" podpowiedz="koszt utrzymania podczas sprzedaży" />
        <Przelacznik etykieta="Stan techniczny" wartosc={stan} ustaw={setStan} opcje={[{ id: 'dobry', nazwa: 'Dobry' }, { id: 'sredni', nazwa: 'Średni' }, { id: 'slaby', nazwa: 'Słaby / usterki' }]} />
      </div>
      {wartosc > 0 && (
        <>
          <div className="space-y-3">
            {wyniki.map((w) => (
              <div key={w.droga.id} className="space-y-1">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">{w.droga.nazwa}</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">{zl(w.naRekeOd)}–{zl(w.naRekeDo)}</strong> · ok. {w.dni} {w.dni === 1 ? 'dzień' : 'dni'}
                  </span>
                </div>
                <div className="h-5 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <div className={`absolute inset-y-0 left-0 rounded-lg ${w.droga.id === najwiecej.droga.id ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`} style={{ width: `${(w.naRekeOd / maks) * 100}%` }} />
                  <div className={`absolute inset-y-0 rounded-r-lg opacity-50 ${w.droga.id === najwiecej.droga.id ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`} style={{ left: `${(w.naRekeOd / maks) * 100}%`, width: `${((w.naRekeDo - w.naRekeOd) / maks) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Werdykt ton="zielony" tytul={`Najwięcej zostanie: ${najwiecej.droga.nazwa.toLowerCase()}`}>
              Ok. {zl(najwiecej.naReke)} na rękę, ale sprzedaż trwa zwykle {najwiecej.dni} dni. W cenie uwzględniliśmy utratę wartości i OC w czasie czekania ({zl(najwiecej.kosztCzekania)}).
            </Werdykt>
            <Werdykt ton="szary" tytul={`Najszybciej: ${najszybciej.droga.nazwa.toLowerCase()}`}>
              Pieniądze w {najszybciej.dni === 1 ? 'dzień' : `ok. ${najszybciej.dni} dni`}, ale o ok. {zl(najwiecej.naReke - najszybciej.naReke)} mniej niż przy najlepszej opcji.
            </Werdykt>
          </div>
          <p className="text-xs text-slate-500">Procenty to założenia redakcji oparte na relacjach z rynku – konkretna oferta skupu czy komisu może się różnić. Zawsze poproś o wycenę na piśmie.</p>
        </>
      )}
    </section>
  );
}
