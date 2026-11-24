'use client';
import { useState } from 'react';
import { INSTALACJE, policzLpg, type TypInstalacji } from '@/lib/narzedzia/lpg';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number, m = 0) => `${n.toLocaleString('pl-PL', { minimumFractionDigits: m, maximumFractionDigits: m })} zł`;

export default function KalkulatorLpg({ cenaPb, cenaLpg, dataCen, spalanieStart = 8, typStart = 'mpi4' }: { cenaPb: number; cenaLpg: number; dataCen: string; spalanieStart?: number; typStart?: TypInstalacji }) {
  const [spalanie, setSpalanie] = useState(spalanieStart);
  const [km, setKm] = useState(15000);
  const [pb, setPb] = useState(cenaPb);
  const [gaz, setGaz] = useState(cenaLpg);
  const [typ, setTyp] = useState<TypInstalacji>(typStart);
  const [koszt, setKoszt] = useState(INSTALACJE[typStart].domyslnie);
  const w = policzLpg({ spalanie, kmRocznie: km, cenaPb: pb, cenaLpg: gaz, koszt, typ });
  const zmienTyp = (t: TypInstalacji) => {
    setTyp(t);
    setKoszt(INSTALACJE[t].domyslnie);
  };
  // wykres: skumulowany zysk przez 5 lat
  const lata = [0, 1, 2, 3, 4, 5].map((l) => ({ l, v: w.oszczednoscRok * l - koszt }));
  const maks = Math.max(...lata.map((x) => Math.abs(x.v)), 1);
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator opłacalności LPG">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PoleLiczby id="lp-sp" etykieta="Spalanie benzyny" wartosc={spalanie} ustaw={setSpalanie} krok={0.1} jednostka="l/100 km" />
        <PoleLiczby id="lp-km" etykieta="Ile jeździsz rocznie" wartosc={km} ustaw={setKm} krok={1000} jednostka="km" />
        <PoleWyboru id="lp-typ" etykieta="Silnik" wartosc={typ} ustaw={zmienTyp} opcje={(Object.keys(INSTALACJE) as TypInstalacji[]).map((id) => ({ id, nazwa: INSTALACJE[id].nazwa }))} />
        <PoleLiczby id="lp-kosz" etykieta="Koszt instalacji" wartosc={koszt} ustaw={setKoszt} krok={100} jednostka="zł" podpowiedz={`Typowo ${zl(INSTALACJE[typ].od)}–${zl(INSTALACJE[typ].do)}`} />
        <PoleLiczby id="lp-pb" etykieta="Cena benzyny Pb95" wartosc={pb} ustaw={setPb} krok={0.01} jednostka="zł/l" podpowiedz={`Średnia z ${dataCen}`} />
        <PoleLiczby id="lp-gaz" etykieta="Cena LPG" wartosc={gaz} ustaw={setGaz} krok={0.01} jednostka="zł/l" />
      </div>
      {w.zwrotKm !== null ? (
        <Werdykt ton={w.zwrotMies !== null && w.zwrotMies <= 30 ? 'zielony' : w.zwrotMies !== null && w.zwrotMies <= 48 ? 'zolty' : 'czerwony'} tytul={`Instalacja zwróci się po ok. ${w.zwrotKm.toLocaleString('pl-PL')} km${w.zwrotMies !== null ? ` (ok. ${w.zwrotMies} mies.)` : ''}`}>
          {w.zwrotMies !== null && w.zwrotMies > 48 ? 'Przy tak małym przebiegu albo drogiej instalacji LPG zwraca się bardzo długo – może się nie opłacić, jeśli sprzedasz auto wcześniej.' : 'Każdy kolejny kilometr to już czysty zysk. Pamiętaj o przeglądach instalacji i regulacji zaworów w silnikach, które tego wymagają.'}
        </Werdykt>
      ) : (
        <Werdykt ton="czerwony" tytul="Przy tych cenach LPG się nie zwróci">
          Różnica w cenie paliw jest za mała w stosunku do kosztów serwisu instalacji.
        </Werdykt>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta="100 km na benzynie" wartosc={zl(w.kosztBenzyna100, 2)} />
        <Liczba etykieta="100 km na LPG" wartosc={zl(w.kosztLpg100, 2)} opis={`spalanie LPG ok. ${(spalanie * 1.2).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} l`} />
        <Liczba etykieta="Oszczędność rocznie" wartosc={zl(w.oszczednoscRok)} opis="po odjęciu serwisu instalacji" mocna />
        <Liczba etykieta="Bilans po 3 latach" wartosc={zl(w.zysk3Lata)} opis="oszczędność minus koszt instalacji" />
      </div>
      <div aria-hidden="true" className="space-y-1">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Bilans w kolejnych latach</p>
        <div className="flex items-center gap-2 h-40">
          {lata.map((x) => (
            <div key={x.l} className="flex-1 h-full flex flex-col justify-center">
              <div className="h-1/2 flex items-end">{x.v > 0 && <div className="w-full rounded-t-lg bg-emerald-400" style={{ height: `${(x.v / maks) * 100}%` }} />}</div>
              <div className="h-1/2 flex items-start border-t border-slate-300 dark:border-slate-600">{x.v < 0 && <div className="w-full rounded-b-lg bg-rose-300" style={{ height: `${(-x.v / maks) * 100}%` }} />}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 text-[11px] text-slate-500">
          {lata.map((x) => (
            <span key={x.l} className="flex-1 text-center">
              {x.l === 0 ? 'montaż' : `${x.l} r.`}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
