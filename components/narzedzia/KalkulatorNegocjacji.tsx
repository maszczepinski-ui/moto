'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { NAPRAWY, policzNegocjacje } from '@/lib/narzedzia/naprawy';
import { KARTA_NARZEDZIA, PoleLiczby, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export default function KalkulatorNegocjacji({ startowe = ['rozrzad-pasek'], cenaStart = 25000 }: { startowe?: string[]; cenaStart?: number }) {
  const [cena, setCena] = useState(cenaStart);
  const [wybrane, setWybrane] = useState<string[]>(startowe);
  const [skopiowano, setSkopiowano] = useState(false);
  const w = policzNegocjacje(cena, wybrane);
  const lista = NAPRAWY.filter((n) => wybrane.includes(n.id));
  const przelacz = (id: string) => setWybrane((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const tekst =
    lista.length === 0
      ? ''
      : `Dzień dobry, dziękuję za pokazanie auta. Na oględzinach wyszło kilka rzeczy do zrobienia: ${lista.map((n) => n.krotko.toLowerCase()).join(', ')}. Według cenników warsztatów to łącznie ok. ${zl(w.sumaOd)}–${zl(w.sumaDo)}. Jestem zdecydowany na zakup, jeśli dojdziemy do ceny ${zl(w.cenaPo)}. Mogę zapłacić od ręki i zabrać auto w uzgodnionym terminie.`;
  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(tekst);
      setSkopiowano(true);
      setTimeout(() => setSkopiowano(false), 2000);
    } catch {
      /* brak dostępu do schowka – tekst i tak jest widoczny */
    }
  };
  const proc = (x: number) => `${Math.min(100, Math.max(0, x * 100))}%`;
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator negocjacji ceny">
      <div className="max-w-xs">
        <PoleLiczby id="ng-cena" etykieta="Cena z ogłoszenia" wartosc={cena} ustaw={setCena} krok={500} jednostka="zł" />
      </div>
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-800 dark:text-slate-200">Co wyszło na oględzinach? Zaznacz wszystko, co dotyczy auta</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {NAPRAWY.map((n) => {
            const on = wybrane.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                aria-pressed={on}
                onClick={() => przelacz(n.id)}
                className={`text-left rounded-xl px-3 py-2.5 ring-1 transition flex items-start gap-2.5 ${on ? 'bg-rust-50 dark:bg-rust-950/40 ring-rust-400' : 'bg-slate-50 dark:bg-slate-800 ring-slate-200 dark:ring-slate-700 hover:ring-rust-300'}`}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${on ? 'bg-rust-600 text-white' : 'bg-white dark:bg-slate-700 ring-1 ring-slate-300 dark:ring-slate-600'}`}>{on && <Check className="w-3.5 h-3.5" aria-hidden="true" />}</span>
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{n.krotko}</span>
                  <span className="block text-xs text-slate-500">
                    {zl(n.kosztOd)}–{zl(n.kosztDo)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {lista.length > 0 && cena > 0 ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Liczba etykieta="Koszt napraw" wartosc={`${zl(w.sumaOd)}–${zl(w.sumaDo)}`} opis="orientacyjnie, warsztat średniej półki" />
            <Liczba etykieta="Proponowana obniżka" wartosc={zl(w.propozycja)} opis="środek widełek + 10% na ryzyko" mocna />
            <Liczba etykieta="Cena do zaproponowania" wartosc={zl(w.cenaPo)} />
            <Liczba etykieta="Naprawy vs cena auta" wartosc={`${Math.round(w.udzial * 100)}%`} />
          </div>
          <div aria-hidden="true" className="space-y-1">
            <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div className="bg-emerald-400" style={{ width: proc(w.cenaPo / cena) }} />
              <div className="bg-rust-500" style={{ width: proc(w.propozycja / cena) }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>cena po obniżce</span>
              <span>obniżka</span>
            </div>
          </div>
          {w.udzial > 0.35 && (
            <Werdykt ton="czerwony" tytul="Naprawy to ponad jedna trzecia wartości auta">
              Przy takiej liście często lepiej odpuścić i szukać innego egzemplarza – obok znanych usterek zwykle wychodzą kolejne.
            </Werdykt>
          )}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Gotowa wiadomość do sprzedającego</p>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{tekst}</p>
            <button type="button" onClick={kopiuj} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2.5">
              {skopiowano ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />} {skopiowano ? 'Skopiowano' : 'Kopiuj tekst'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Zaznacz co najmniej jedną usterkę i wpisz cenę auta.</p>
      )}
    </section>
  );
}
