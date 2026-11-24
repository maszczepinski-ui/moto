'use client';
import { useState } from 'react';
import { CENY_KWH, KLASY_EV, kosztMiksu, koszt100, type KlasaEv, type ZrodloPradu } from '@/lib/narzedzia/ev';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Liczba } from '@/components/narzedzia/Pola';

const zl = (n: number, m = 0) => `${n.toLocaleString('pl-PL', { minimumFractionDigits: m, maximumFractionDigits: m })} zł`;

export default function KalkulatorEv({ cenaPb, cenaLpg, domStart = 'g11' }: { cenaPb: number; cenaLpg: number; domStart?: ZrodloPradu }) {
  const [klasa, setKlasa] = useState<KlasaEv>('kompakt');
  const [kwh, setKwh] = useState(KLASY_EV.kompakt.kwh);
  const [dom, setDom] = useState<ZrodloPradu>(domStart === 'dc' ? 'g11' : domStart);
  const [procDom, setProcDom] = useState(domStart === 'dc' ? 20 : 80);
  const [procAc, setProcAc] = useState(domStart === 'dc' ? 10 : 10);
  const [procDc, setProcDc] = useState(domStart === 'dc' ? 70 : 10);
  const [km, setKm] = useState(15000);
  const [spalanie, setSpalanie] = useState(7);
  const ev = kosztMiksu(kwh, { dom, procDom, procAc, procDc });
  const benzyna = spalanie * cenaPb;
  const lpg = spalanie * 1.2 * cenaLpg;
  const rok = (x: number) => (x * km) / 100;
  const slupki = [
    { n: 'Elektryk (Twój miks)', v: ev, k: 'bg-emerald-500' },
    { n: 'Elektryk – tylko dom', v: koszt100(kwh, dom), k: 'bg-emerald-300' },
    { n: 'Elektryk – tylko DC', v: koszt100(kwh, 'dc'), k: 'bg-amber-400' },
    { n: 'Benzyna', v: benzyna, k: 'bg-slate-500' },
    { n: 'LPG', v: lpg, k: 'bg-slate-400' }
  ];
  const maks = Math.max(...slupki.map((s) => s.v), 1);
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator kosztu ładowania elektryka">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PoleWyboru
          id="ev-kl"
          etykieta="Klasa auta"
          wartosc={klasa}
          ustaw={(k) => {
            setKlasa(k);
            setKwh(KLASY_EV[k].kwh);
          }}
          opcje={(Object.keys(KLASY_EV) as KlasaEv[]).map((id) => ({ id, nazwa: KLASY_EV[id].nazwa }))}
        />
        <PoleLiczby id="ev-kwh" etykieta="Zużycie energii" wartosc={kwh} ustaw={setKwh} krok={0.5} jednostka="kWh/100" podpowiedz={KLASY_EV[klasa].przyklady} />
        <PoleWyboru id="ev-dom" etykieta="Prąd w domu" wartosc={dom} ustaw={setDom} opcje={(['g11', 'g12', 'dynamiczna'] as ZrodloPradu[]).map((id) => ({ id, nazwa: `${CENY_KWH[id].nazwa.replace('Dom – ', '')} – ${CENY_KWH[id].cena.toLocaleString('pl-PL')} zł/kWh` }))} />
        <PoleLiczby id="ev-km" etykieta="Rocznie" wartosc={km} ustaw={setKm} krok={1000} jednostka="km" />
        <PoleLiczby id="ev-d" etykieta="Ładowanie w domu" wartosc={procDom} ustaw={setProcDom} jednostka="%" />
        <PoleLiczby id="ev-ac" etykieta="Publiczne AC" wartosc={procAc} ustaw={setProcAc} jednostka="%" />
        <PoleLiczby id="ev-dc" etykieta="Szybkie DC" wartosc={procDc} ustaw={setProcDc} jednostka="%" />
        <PoleLiczby id="ev-sp" etykieta="Spalanie auta spalinowego do porównania" wartosc={spalanie} ustaw={setSpalanie} krok={0.1} jednostka="l/100" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta="100 km elektrykiem" wartosc={zl(ev, 2)} opis="Twój miks ładowania" mocna />
        <Liczba etykieta="100 km na benzynie" wartosc={zl(benzyna, 2)} opis={`Pb95 po ${cenaPb.toLocaleString('pl-PL')} zł`} />
        <Liczba etykieta="Elektryk rocznie" wartosc={zl(rok(ev))} />
        <Liczba etykieta="Oszczędność rocznie" wartosc={zl(rok(benzyna - ev))} opis="vs benzyna" />
      </div>
      <div className="space-y-2" aria-hidden="true">
        {slupki.map((s) => (
          <div key={s.n} className="flex items-center gap-3 text-sm">
            <span className="w-40 sm:w-48 flex-shrink-0 text-slate-600 dark:text-slate-300">{s.n}</span>
            <span className="flex-1 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <span className={`block h-full rounded-lg ${s.k}`} style={{ width: `${(s.v / maks) * 100}%` }} />
            </span>
            <span className="w-20 text-right font-bold text-slate-900 dark:text-white">{zl(s.v, 2)}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Do ładowania w domu i na AC doliczamy 10% strat energii. Ceny na stacjach to mediany z listopada 2026 – konkretny operator, abonament czy promocja mogą je zmienić.</p>
    </section>
  );
}
