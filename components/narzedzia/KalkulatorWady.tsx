'use client';
import { useState } from 'react';
import { ocenWade, type Kupujacy, type Sprzedawca, type Wylaczenie } from '@/lib/narzedzia/wada';
import { KARTA_NARZEDZIA, PoleDaty, PoleWyboru, Przelacznik, Werdykt, Liczba } from '@/components/narzedzia/Pola';

const dzis = () => new Date().toISOString().slice(0, 10);
const miesiacTemu = (m: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  return d.toISOString().slice(0, 10);
};
const dataPl = (iso: string) => iso.split('-').reverse().join('.');

export default function KalkulatorWady({ sprzedawca = 'prywatny', kupujacy = 'prywatnie', wylaczenie = 'nie' }: { sprzedawca?: Sprzedawca; kupujacy?: Kupujacy; wylaczenie?: Wylaczenie }) {
  const [s, setS] = useState<Sprzedawca>(sprzedawca);
  const [k, setK] = useState<Kupujacy>(kupujacy);
  const [wyl, setWyl] = useState<Wylaczenie>(wylaczenie);
  const [umowa, setUmowa] = useState(miesiacTemu(3));
  const [wydanie, setWydanie] = useState(miesiacTemu(3));
  const [wada, setWada] = useState(dzis());
  const [wiedzial, setWiedzial] = useState<'nie' | 'tak'>('nie');
  const w = ocenWade({ sprzedawca: s, kupujacy: k, dataUmowy: umowa, dataWydania: wydanie, dataWady: wada, wylaczenie: wyl, wiedzial: wiedzial === 'tak', dzis: dzis() });
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator terminów reklamacji auta">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PoleWyboru id="wd-s" etykieta="Kto sprzedał auto?" wartosc={s} ustaw={setS} opcje={[{ id: 'prywatny', nazwa: 'Osoba prywatna (umowa)' }, { id: 'przedsiebiorca', nazwa: 'Firma, dealer, komis (faktura)' }, { id: 'nie-wiem', nazwa: 'Nie wiem / handlarz jako „osoba prywatna”' }]} />
        <PoleWyboru id="wd-k" etykieta="Jak kupiłeś?" wartosc={k} ustaw={setK} opcje={[{ id: 'prywatnie', nazwa: 'Prywatnie' }, { id: 'firma', nazwa: 'Na firmę (JDG, spółka)' }]} />
        {s === 'prywatny' && <PoleWyboru id="wd-w" etykieta="Czy umowa wyłącza rękojmię?" wartosc={wyl} ustaw={setWyl} opcje={[{ id: 'nie', nazwa: 'Nie' }, { id: 'tak', nazwa: 'Tak' }, { id: 'nie-wiem', nazwa: 'Nie wiem' }]} />}
        <PoleDaty id="wd-u" etykieta="Data umowy" wartosc={umowa} ustaw={setUmowa} />
        <PoleDaty id="wd-wy" etykieta="Data wydania auta" wartosc={wydanie} ustaw={setWydanie} />
        <PoleDaty id="wd-st" etykieta="Kiedy stwierdziłeś wadę?" wartosc={wada} ustaw={setWada} />
        <Przelacznik etykieta="Wiedziałeś o tej wadzie przy zakupie?" wartosc={wiedzial} ustaw={setWiedzial} opcje={[{ id: 'nie', nazwa: 'Nie' }, { id: 'tak', nazwa: 'Tak' }]} />
      </div>
      <Werdykt ton={w.poziom} tytul={w.tytul}>
        {w.podstawa && <p>Podstawa: {w.podstawa}.</p>}
      </Werdykt>
      {(w.terminUjawnienia || w.terminDochodzenia) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {w.terminUjawnienia && <Liczba etykieta="Wada musi ujawnić się do" wartosc={dataPl(w.terminUjawnienia)} opis="2 lata od wydania auta" mocna />}
          {w.dniDoTerminu !== null && <Liczba etykieta="Zostało dni" wartosc={w.dniDoTerminu > 0 ? `${w.dniDoTerminu}` : 'termin minął'} />}
          {w.terminDochodzenia && <Liczba etykieta="Dochodź żądań do" wartosc={dataPl(w.terminDochodzenia)} opis="rok od stwierdzenia wady" />}
        </div>
      )}
      {w.kroki.length > 0 && (
        <ol className="space-y-3">
          {w.kroki.map((x, i) => (
            <li key={x} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span>{x}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs text-slate-500">Narzędzie porządkuje terminy i kolejne kroki. Nie jest poradą prawną – przy sporze o wartość auta albo dowody skonsultuj się z prawnikiem lub rzecznikiem konsumentów.</p>
    </section>
  );
}
