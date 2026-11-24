'use client';
import { useEffect, useState } from 'react';
import { KRAJE } from '@/lib/narzedzia/sprowadzenie';
import { NAPEDY, policzImport, type Naped } from '@/lib/akcyza';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Przelacznik, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export default function KalkulatorSprowadzenia({ krajStart = 'de' }: { krajStart?: string }) {
  const [krajId, setKraj] = useState(krajStart);
  const kraj = KRAJE.find((k) => k.id === krajId) ?? KRAJE[0];
  const [cena, setCena] = useState(9000);
  const [kurs, setKurs] = useState(kraj.waluta === 'USD' ? 3.7 : 4.25);
  const [kursInfo, setKursInfo] = useState('kurs przykładowy – pobieram kurs NBP…');
  const [pojemnosc, setPojemnosc] = useState(1600);
  const [naped, setNaped] = useState<Naped>('spalinowy');
  const [transport, setTransport] = useState(Math.round((kraj.transportOd + kraj.transportDo) / 2 / 100) * 100);
  const [cenaPl, setCenaPl] = useState(45000);
  const [usa, setUsa] = useState<'tak' | 'nie'>('tak');

  useEffect(() => {
    let anuluj = false;
    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${kraj.waluta.toLowerCase()}/?format=json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { rates: { mid: number; effectiveDate: string }[] }) => {
        if (anuluj) return;
        setKurs(Math.round(j.rates[0].mid * 10000) / 10000);
        setKursInfo(`kurs średni NBP z ${j.rates[0].effectiveDate.split('-').reverse().join('.')}`);
      })
      .catch(() => !anuluj && setKursInfo('nie udało się pobrać kursu NBP – wpisz go ręcznie'));
    return () => {
      anuluj = true;
    };
  }, [kraj.waluta]);

  const zmienKraj = (id: string) => {
    const k = KRAJE.find((x) => x.id === id) ?? KRAJE[0];
    setKraj(id);
    setTransport(Math.round((k.transportOd + k.transportDo) / 2 / 100) * 100);
  };

  const spozaUe = kraj.skad === 'spoza-ue';
  const w = policzImport({
    cena,
    waluta: kraj.waluta,
    kurs,
    pojemnosc,
    naped,
    lpg: false,
    skad: kraj.skad,
    produkcjaUsa: spozaUe && usa === 'tak',
    transportDoUe: spozaUe ? transport / Math.max(0.01, kurs) : 0,
    transportZl: spozaUe ? 0 : transport,
    tlumaczenia: kraj.tlumaczenia,
    tabliceIndywidualne: false
  });
  const roznica = cenaPl - w.razemZAutem;
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Kalkulator kosztu sprowadzenia auta">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PoleWyboru id="sp-kraj" etykieta="Skąd sprowadzasz?" wartosc={krajId} ustaw={zmienKraj} opcje={KRAJE.map((k) => ({ id: k.id, nazwa: k.nazwa }))} />
        <PoleLiczby id="sp-cena" etykieta={`Cena auta (${kraj.waluta})`} wartosc={cena} ustaw={setCena} krok={100} jednostka={kraj.waluta} />
        <PoleLiczby id="sp-kurs" etykieta={`Kurs ${kraj.waluta}`} wartosc={kurs} ustaw={setKurs} krok={0.01} jednostka="zł" podpowiedz={kursInfo} />
        <PoleLiczby id="sp-poj" etykieta="Pojemność silnika" wartosc={pojemnosc} ustaw={setPojemnosc} krok={100} jednostka="cm³" />
        <PoleWyboru id="sp-naped" etykieta="Napęd" wartosc={naped} ustaw={setNaped} opcje={NAPEDY} />
        <PoleLiczby id="sp-tr" etykieta={spozaUe ? 'Transport i ubezpieczenie do UE' : 'Transport do Polski (laweta)'} wartosc={transport} ustaw={setTransport} krok={100} jednostka="zł" podpowiedz={`Typowo ${zl(kraj.transportOd)}–${zl(kraj.transportDo)}`} />
        <PoleLiczby id="sp-pl" etykieta="Cena podobnego auta w Polsce" wartosc={cenaPl} ustaw={setCenaPl} krok={500} jednostka="zł" podpowiedz="z ogłoszeń: ten sam model, rocznik i przebieg" />
        {spozaUe && <Przelacznik etykieta="Wyprodukowane w USA (0% cła)?" wartosc={usa} ustaw={setUsa} opcje={[{ id: 'tak', nazwa: 'Tak' }, { id: 'nie', nazwa: 'Nie' }]} />}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Liczba etykieta="Cena auta" wartosc={zl(w.cenaZl)} />
        <Liczba etykieta="Podatki" wartosc={zl(w.podatki.reduce((s, p) => s + p.kwota, 0))} opis={w.podatki.map((p) => p.nazwa.toLowerCase()).join(', ')} />
        <Liczba etykieta="Transport, urząd, tłumaczenia" wartosc={zl(w.urzedowe.reduce((s, p) => s + p.kwota, 0) + w.inne.reduce((s, p) => s + p.kwota, 0))} />
        <Liczba etykieta="Razem pod domem" wartosc={zl(w.razemZAutem)} mocna />
      </div>
      {cenaPl > 0 && (
        <Werdykt ton={roznica > 3000 ? 'zielony' : roznica > 0 ? 'zolty' : 'czerwony'} tytul={roznica > 0 ? `Oszczędzasz ok. ${zl(roznica)} względem auta z Polski` : `Auto z Polski wychodzi taniej o ${zl(-roznica)}`}>
          {roznica > 0 && roznica <= 3000 ? 'Różnica jest niewielka – doliczając czas, ryzyko i koszty dojazdu na oględziny, może się nie opłacać.' : roznica > 3000 ? 'Zanim kupisz, sprawdź historię auta w bazach zagranicznych – przy aucie sprowadzonym polska historia zaczyna się dopiero po rejestracji.' : 'Przy takiej różnicy lepiej szukać auta w Polsce – oszczędzisz czas i ryzyko.'}
        </Werdykt>
      )}
      <ul className="text-xs text-slate-500 space-y-1">
        {w.uwagi.map((u) => (
          <li key={u}>• {u}</li>
        ))}
      </ul>
    </section>
  );
}
