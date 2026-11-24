'use client';
import { useState } from 'react';
import { LIMITY, PODATKI, policzFirme, type NapedFirma, type Podatek, type Uzytek } from '@/lib/narzedzia/firma';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Przelacznik, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export default function KalkulatorFirmy({ cenaStart = 150000 }: { cenaStart?: number }) {
  const [cena, setCena] = useState(cenaStart);
  const [naped, setNaped] = useState<NapedFirma>('spalinowy');
  const [uzytek, setUzytek] = useState<Uzytek>('mieszany');
  const [podatek, setPodatek] = useState<Podatek>('liniowy');
  const [vatowiec, setVatowiec] = useState<'tak' | 'nie'>('tak');
  const [eks, setEks] = useState(12000);
  const [lata, setLata] = useState(5);
  const d = { cenaNetto: cena, naped, uzytek, podatek, vatowiec: vatowiec === 'tak', eksploatacjaRok: eks, lata };
  const w = policzFirme(d);
  const porownanie = (Object.keys(LIMITY) as NapedFirma[]).map((n) => ({ n, w: policzFirme({ ...d, naped: n }) }));
  const maks = Math.max(...porownanie.map((p) => p.w.realnyKosztAuta), 1);
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator auta w firmie">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PoleLiczby id="fi-cena" etykieta="Cena auta netto" wartosc={cena} ustaw={setCena} krok={1000} jednostka="zł" />
        <PoleWyboru id="fi-naped" etykieta="Napęd / emisja CO₂" wartosc={naped} ustaw={setNaped} opcje={(Object.keys(LIMITY) as NapedFirma[]).map((id) => ({ id, nazwa: LIMITY[id].nazwa }))} podpowiedz="Emisję CO₂ znajdziesz w dowodzie rejestracyjnym (pole V.7)" />
        <PoleWyboru id="fi-pit" etykieta="Forma opodatkowania" wartosc={podatek} ustaw={setPodatek} opcje={PODATKI.map((p) => ({ id: p.id, nazwa: p.nazwa }))} />
        <PoleLiczby id="fi-eks" etykieta="Paliwo i serwis rocznie (netto)" wartosc={eks} ustaw={setEks} krok={500} jednostka="zł" />
        <PoleLiczby id="fi-lata" etykieta="Ile lat w firmie" wartosc={lata} ustaw={(n) => setLata(Math.max(1, Math.min(10, n)))} min={1} max={10} jednostka="lat" />
        <div className="space-y-4">
          <Przelacznik etykieta="Użytek" wartosc={uzytek} ustaw={setUzytek} opcje={[{ id: 'mieszany', nazwa: 'Firmowy i prywatny' }, { id: 'firmowy', nazwa: 'Tylko firmowy' }]} />
          <Przelacznik etykieta="Czynny podatnik VAT" wartosc={vatowiec} ustaw={setVatowiec} opcje={[{ id: 'tak', nazwa: 'Tak' }, { id: 'nie', nazwa: 'Nie' }]} />
        </div>
      </div>
      {cena > 0 && (
        <div className="space-y-5">
          {w.ponadLimit > 0 ? (
            <Werdykt ton={w.strataLimit > 0 ? 'zolty' : 'szary'} tytul={`${zl(w.ponadLimit)} wartości auta jest ponad limitem ${zl(w.limit)}`}>
              {w.strataLimit > 0 ? `Przez limit nie odliczysz tej kwoty od dochodu – zapłacisz o ${zl(w.strataLimit)} więcej podatku przez cały okres.` : 'Na ryczałcie nie odliczasz kosztów, więc limit nie zmienia Twojego podatku dochodowego.'}
            </Werdykt>
          ) : (
            <Werdykt ton="zielony" tytul={`Auto mieści się w limicie ${zl(w.limit)}`}>
              Całą wartość auta (z nieodliczonym VAT) możesz rozliczyć w kosztach.
            </Werdykt>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Liczba etykieta="Odzyskany VAT z auta" wartosc={zl(w.vatOdliczony)} opis={uzytek === 'mieszany' ? '50% VAT' : '100% VAT (wymaga VAT-26 i kilometrówki)'} />
            <Liczba etykieta="Mniej podatku dochodowego" wartosc={zl(w.pitAuto)} opis="z kosztów auta (amortyzacja lub raty)" />
            <Liczba etykieta="Realny koszt auta" wartosc={zl(w.realnyKosztAuta)} opis={`z ${zl(cena * 1.23)} brutto`} mocna />
            <Liczba etykieta={`Auto + eksploatacja (${lata} l.)`} wartosc={zl(w.realnyKosztRazem)} opis="po odliczeniach" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">To samo auto z innym napędem – realny koszt po odliczeniach</p>
            {porownanie.map((p) => (
              <div key={p.n} className="flex items-center gap-3 text-sm">
                <span className="w-44 sm:w-64 flex-shrink-0 text-slate-600 dark:text-slate-300">
                  {LIMITY[p.n].nazwa.split(' (')[0]} <span className="text-slate-400">(limit {zl(p.w.limit)})</span>
                </span>
                <span className="flex-1 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <span className={`block h-full rounded-lg ${p.n === naped ? 'bg-rust-500' : 'bg-slate-400 dark:bg-slate-600'}`} style={{ width: `${(p.w.realnyKosztAuta / maks) * 100}%` }} />
                </span>
                <span className="w-24 text-right font-bold text-slate-900 dark:text-white">{zl(p.w.realnyKosztAuta)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Uproszczenie: suma za cały okres, bez odsetek i prowizji leasingu lub kredytu oraz bez wpływu na składkę zdrowotną. Limit działa tak samo przy leasingu (proporcjonalnie do rat), kredycie i zakupie za gotówkę (amortyzacja). Przed decyzją potwierdź wyliczenie z księgową.
          </p>
        </div>
      )}
    </section>
  );
}
