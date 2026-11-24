'use client';
import { useState } from 'react';
import { KLASY, kosztZastepczego, policzSzkode } from '@/lib/narzedzia/szkoda';
import { KARTA_NARZEDZIA, PoleLiczby, PoleWyboru, Liczba, Werdykt } from '@/components/narzedzia/Pola';

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

export function KalkulatorZastepczego({ klasaStart = 'C' }: { klasaStart?: string }) {
  const [klasa, setKlasa] = useState(klasaStart);
  const [naprawa, setNaprawa] = useState(10);
  const [czekanie, setCzekanie] = useState(4);
  const k = KLASY.find((x) => x.id === klasa) ?? KLASY[2];
  const dni = Math.max(0, naprawa) + Math.max(0, czekanie);
  const koszt = kosztZastepczego(k, dni);
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Auto zastępcze z OC sprawcy</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PoleWyboru id="az-klasa" etykieta="Klasa Twojego auta" wartosc={klasa} ustaw={setKlasa} opcje={KLASY.map((x) => ({ id: x.id, nazwa: x.nazwa }))} />
        <PoleLiczby id="az-naprawa" etykieta="Dni naprawy lub do zakupu nowego auta" wartosc={naprawa} ustaw={setNaprawa} jednostka="dni" />
        <PoleLiczby id="az-czek" etykieta="Dni czekania (oględziny, części)" wartosc={czekanie} ustaw={setCzekanie} jednostka="dni" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Liczba etykieta="Dni najmu" wartosc={`${dni}`} opis="od szkody do odbioru auta" />
        <Liczba etykieta="Stawka za dobę" wartosc={`${zl(Math.min(k.warta, k.hestia))}–${zl(Math.max(k.warta, k.hestia))}`} opis="Warta i ERGO Hestia, brutto" />
        <Liczba etykieta="Wartość najmu do pokrycia" wartosc={`${zl(koszt.od)}–${zl(koszt.do)}`} mocna />
      </div>
      <p className="text-xs text-slate-500">Przykłady aut w klasie: {k.przyklady}. Ubezpieczyciel pokrywa najem auta podobnej klasy przez cały czas, gdy nie możesz korzystać z własnego – także czekanie na oględziny i części.</p>
    </div>
  );
}

export default function KalkulatorSzkody() {
  const [wartosc, setWartosc] = useState(40000);
  const [naprawa, setNaprawa] = useState(45000);
  const [wrak, setWrak] = useState(10000);
  const [oferta, setOferta] = useState(30000);
  const [wrakRealny, setWrakRealny] = useState(6000);
  const w = policzSzkode(wartosc, wrak, naprawa, oferta, wrakRealny);
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-8`} aria-label="Kalkulator szkody całkowitej">
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Szkoda całkowita z OC sprawcy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PoleLiczby id="sz-w" etykieta="Wartość auta przed szkodą" wartosc={wartosc} ustaw={setWartosc} krok={500} jednostka="zł" podpowiedz="z decyzji ubezpieczyciela albo Twoja wycena" />
          <PoleLiczby id="sz-n" etykieta="Koszt naprawy z kosztorysu" wartosc={naprawa} ustaw={setNaprawa} krok={500} jednostka="zł" />
          <PoleLiczby id="sz-wr" etykieta="Wartość wraku wg ubezpieczyciela" wartosc={wrak} ustaw={setWrak} krok={500} jednostka="zł" />
          <PoleLiczby id="sz-o" etykieta="Propozycja wypłaty" wartosc={oferta} ustaw={setOferta} krok={500} jednostka="zł" podpowiedz="0 = jeszcze nie ma decyzji" />
          <PoleLiczby id="sz-r" etykieta="Za ile realnie sprzedasz wrak" wartosc={wrakRealny} ustaw={setWrakRealny} krok={500} jednostka="zł" podpowiedz="np. najlepsza oferta z giełdy aut uszkodzonych" />
        </div>
        {wartosc > 0 && (
          <div className="space-y-4">
            <Werdykt ton={w.calkowita ? 'zolty' : 'zielony'} tytul={w.calkowita ? `To szkoda całkowita – naprawa to ${Math.round(w.procentNaprawy * 100)}% wartości auta` : `To szkoda częściowa – naprawa to ${Math.round(w.procentNaprawy * 100)}% wartości auta`}>
              {w.calkowita
                ? 'Przy OC sprawcy ubezpieczyciel może orzec szkodę całkowitą dopiero, gdy koszt naprawy przekracza wartość auta sprzed szkody. Należy Ci się różnica: wartość auta minus wartość wraku.'
                : 'Przy OC sprawcy ubezpieczyciel powinien pokryć koszt naprawy, nawet jeśli jest bliski wartości auta. Próg 70% dotyczy tylko AC (zależy od umowy).'}
            </Werdykt>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Liczba etykieta="Należy się" wartosc={zl(w.nalezne)} opis={w.calkowita ? 'wartość auta – wrak' : 'koszt naprawy'} mocna />
              <Liczba etykieta="Różnica vs propozycja" wartosc={oferta > 0 ? zl(w.roznica) : '–'} opis={w.roznica > 0 ? 'możliwe zaniżenie' : 'brak zaniżenia'} />
              <Liczba etykieta="Razem z wrakiem" wartosc={zl(w.razemZWrakiem)} opis="wypłata + sprzedaż wraku" />
              <Liczba etykieta="Wrak zawyżony o" wartosc={w.zawyzonyWrak ? zl(wrak - wrakRealny) : '–'} opis="tyle tracisz na wraku" />
            </div>
            {w.zawyzonyWrak && (
              <Werdykt ton="czerwony" tytul="Wartość wraku wygląda na zawyżoną">
                Nikt nie chce kupić wraku za kwotę z wyceny? Napisz do ubezpieczyciela, poproś o wskazanie kupca, który zapłaci tyle, ile wynika z wyceny, albo o dopłatę różnicy. Dołącz oferty, które dostałeś.
              </Werdykt>
            )}
          </div>
        )}
      </div>
      <hr className="border-slate-200 dark:border-slate-800" />
      <KalkulatorZastepczego />
    </section>
  );
}
