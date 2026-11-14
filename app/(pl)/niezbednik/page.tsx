// Strona produktu: Niezbędnik Bezpiecznego Zakupu Auta Używanego (płatny pakiet plików).
// Dopóki w Vercelu brakuje kluczy (lib/sklep/konfiguracja.ts), formularz jest wyłączony, a strona ukryta przed Google.
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2, ClipboardCheck, FileSignature, FileText, Phone, Paintbrush, CalendarClock, ShieldCheck, Users, Zap, Smartphone, Receipt,
  ShoppingCart, Download, Car, XCircle, ArrowDown, AlertTriangle, Calculator
} from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import ZdjecieTla from '@/components/ZdjecieTla';
import FormularzZamowienia from '@/components/sklep/FormularzZamowienia';
import MakietaPakietu from '@/components/sklep/MakietaPakietu';
import { PRODUKT, sklepAktywny, zlotowki } from '@/lib/sklep/konfiguracja';
import { udzialSprowadzonych } from '@/lib/infografiki';
import { kalkulatorAktywny } from '@/lib/sklep/kalkulator';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: 'Niezbędnik Bezpiecznego Zakupu Auta Używanego',
    description: 'Komplet na oględziny używanego auta: check-lista na telefon, umowa kupna-sprzedaży z klauzulami dla kupującego, protokół odbioru, zgoda małżonka i 15 pytań przez telefon. Pobierasz od razu po płatności.',
    alternates: { canonical: '/niezbednik/' },
    robots: sklepAktywny() ? undefined : { index: false, follow: true }
  };
}

const ZAWARTOSC = [
  { ikona: ClipboardCheck, tytul: 'Check-lista oględzin PRO', opis: '10 etapów: od ogłoszenia, przez silnik na zimno i jazdę próbną, po dokumenty. Czerwone flagi i punkty STOP.' },
  { ikona: FileSignature, tytul: 'Umowa kupna-sprzedaży PRO', opis: 'Oświadczenia sprzedającego o przebiegu, szkodach i obciążeniach, lista znanych wad i rękojmia bez wyłączeń.' },
  { ikona: Phone, tytul: '15 pytań przez telefon', opis: 'Co zapytać, zanim wyjedziesz z domu, i jakie odpowiedzi oznaczają handlarza albo problem.' },
  { ikona: FileText, tytul: 'Protokół zdawczo-odbiorczy', opis: 'Przebieg, klucze, opony, wyposażenie i uszkodzenia – podpisany przez obie strony.' },
  { ikona: Paintbrush, tytul: 'Ściąga: lakier i karoseria', opis: 'Jak mierzyć lakier i czytać różnice między elementami.' },
  { ikona: CalendarClock, tytul: 'Formalności po zakupie', opis: 'Wszystkie terminy w jednym miejscu, z miejscem na daty.' },
  { ikona: Users, tytul: 'Zgoda małżonka lub oświadczenie o własności', opis: 'Załącznik do umowy na wypadek, gdy auto należy do majątku wspólnego – albo sprzedający twierdzi, że jest tylko jego.' }
];

/** Porównanie: co jest za darmo na stronie, a co dodaje pakiet */
const POROWNANIE: [string, boolean, boolean][] = [
  ['Lista kontrolna na oględziny', true, true],
  ['Punkty STOP – kiedy na pewno nie kupować', false, true],
  ['Umowa kupna-sprzedaży', true, true],
  ['Oświadczenia sprzedającego o przebiegu, szkodach i wadach', false, true],
  ['Klauzula z karą umowną za zatajony wypadek lub cofnięty licznik', false, true],
  ['Protokół zdawczo-odbiorczy', false, true],
  ['15 pytań przez telefon z „dobrymi” i „złymi” odpowiedziami', false, true],
  ['Ściąga: pomiar lakieru i terminy formalności', false, true],
  ['Zgoda małżonka / oświadczenie o wyłącznej własności auta', false, true]
];

const STOPY = [
  { t: 'VIN w trzech miejscach', o: 'Dowód, tabliczka i numer wybity w karoserii muszą być identyczne. Ślady spawania lub przeklejona tabliczka = STOP.' },
  { t: 'Właściciel przy podpisaniu', o: 'Dowód osobisty sprzedającego musi zgadzać się z właścicielem w dowodzie rejestracyjnym. Brak właściciela = STOP.' },
  { t: 'Wilgoć pod wykładziną', o: 'Muł, wilgoć albo zapach stęchlizny pod wykładziną bagażnika mogą oznaczać auto po zalaniu.' },
  { t: 'Rdza elementów nośnych', o: 'Przerdzewiałe podłużnice i mocowania zawieszenia to koszt, którego nie odrobisz negocjacją.' }
];

const PYTANIA = [
  { p: 'Czy to zastępuje mechanika albo rzeczoznawcę?', o: 'Nie. Niezbędnik pomaga Ci samodzielnie odsiać złe oferty i dobrze przygotować umowę. Przy poważnych wątpliwościach check-lista sama podpowiada, kiedy umówić auto na przegląd w warsztacie lub stacji diagnostycznej.' },
  { p: 'W jakiej formie dostanę pliki?', o: 'PDF do druku i wygodnego czytania na telefonie oraz DOCX (Word) – umowę i protokół możesz uzupełnić na komputerze przed spotkaniem.' },
  { p: 'Kiedy dostanę pakiet?', o: 'Od razu po płatności: link do pobrania pojawia się na stronie i przychodzi na Twój e-mail. Link działa przez 7 dni.' },
  { p: 'Czy dostanę fakturę?', o: 'Tak, fakturę wysyłamy e-mailem – także na firmę (z NIP). Sprzedawca jest zwolniony z VAT, więc faktura jest bez VAT.' },
  { p: 'Czy mogę zwrócić pakiet?', o: 'To treść cyfrowa dostarczana od razu po zakupie. Zamawiając, prosisz o natychmiastowy dostęp, dlatego po rozpoczęciu pobierania prawo odstąpienia od umowy wygasa (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta). Szczegóły w regulaminie.' },
  { p: 'Czym to się różni od darmowej listy na stronie?', o: 'Darmowa lista to dobry start. Pakiet dodaje punkty STOP, umowę z oświadczeniami sprzedającego i klauzulą kary umownej, protokół odbioru oraz pytania do zadania przez telefon – czyli wszystko, co chroni Cię przy podpisaniu umowy.' }
];

/** Dodatki pokazywane dopiero, gdy kalkulator jest uruchomiony (Upstash + dane w Vercelu) */
const KALKULATOR = { ikona: Calculator, tytul: 'Bonus: kalkulator kosztów i negocjacji', opis: 'Na telefonie: ile wydasz po zakupie (podatek, rejestracja, serwis) i o ile zbić cenę za znalezione usterki – z gotową wiadomością do sprzedającego.' };
const PYTANIE_KALK = { p: 'Jak działa kalkulator?', o: 'Po zakupie logujesz się na stronie kodem wysłanym na Twój e-mail. Kalkulator liczy koszty startowe (PCC, rejestracja, przegląd, serwis) i sugerowaną obniżkę ceny za usterki z oględzin. Działa na 3 urządzeniach i pamięta ostatnie dane, gdy stracisz zasięg.' };

export default function NiezbednikPage() {
  const kalk = kalkulatorAktywny();
  const zawartosc = kalk ? [...ZAWARTOSC, KALKULATOR] : ZAWARTOSC;
  const pytania = kalk ? [...PYTANIA, PYTANIE_KALK] : PYTANIA;
  const porownanie: [string, boolean, boolean][] = kalk ? [...POROWNANIE, ['Kalkulator kosztów startowych i argumentów do negocjacji', false, true]] : POROWNANIE;
  const cena = zlotowki(PRODUKT.cenaGr);
  const aktywny = sklepAktywny();
  const sprowadzone = Math.round(udzialSprowadzonych() * 100);
  const przycisk = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold px-6 py-3.5';
  return (
    <div className="pb-20 lg:pb-0">
      {/* ===== Nagłówek ===== */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <ZdjecieTla klucz="kupujesz" priorytet className="opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="[&_*]:!text-slate-300 [&_a:hover]:!text-white mb-6">
            <Okruszki sciezka={[{ nazwa: 'Niezbędnik', adres: '/niezbednik/' }]} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Kupujesz używane auto?
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                Nie kupuj kota w worku.
                <span className="block text-amber-300">Weź na oględziny komplet.</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                {PRODUKT.nazwa}: check-lista na telefon z punktami STOP, umowa chroniąca kupującego, protokół odbioru i pytania, które zadasz, zanim wyjedziesz z domu.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#zamow" className={`${przycisk} bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-400/20`}>
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  {aktywny ? `Kupuję za ${cena}` : `Zobacz pakiet · ${cena}`}
                </a>
                <a href="#co-w-srodku" className="inline-flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white">
                  Co jest w środku? <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                {[
                  [Zap, 'Pobierasz od razu'],
                  [Smartphone, 'PDF na telefon + Word'],
                  [Receipt, 'Faktura mailem'],
                  [ShieldCheck, 'Płatność BLIK przez PayU']
                ].map(([I, t]) => {
                  const Ikona = I as typeof Zap;
                  return (
                    <li key={t as string} className="inline-flex items-center gap-1.5">
                      <Ikona className="w-4 h-4 text-amber-300" aria-hidden="true" /> {t as string}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="py-6">
              <MakietaPakietu />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pas faktów ===== */}
      <section className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            [`${sprowadzone}%`, 'aut w Polsce to auta sprowadzone jako używane (CEPiK)'],
            ['10 etapów', 'oględzin – od ogłoszenia po podpis umowy'],
            ['15 pytań', 'przez telefon, zanim stracisz dzień na dojazd'],
            ['7 plików', 'PDF i Word – drukujesz albo wypełniasz na telefonie']
          ].map(([l, o]) => (
            <div key={l}>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{l}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{o}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-14">
          {/* ===== Zawartość ===== */}
          <section id="co-w-srodku" className="space-y-5 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Co dostajesz w pakiecie</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {zawartosc.map((z, i) => (
                <li key={z.tytul} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-steel-300 transition">
                  <span className="absolute top-4 right-4 text-xs font-black text-slate-300 dark:text-slate-700">0{i + 1}</span>
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-steel-50 dark:bg-slate-800 text-steel-700 dark:text-steel-300">
                    <z.ikona className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-bold text-slate-900 dark:text-white">{z.tytul}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{z.opis}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* ===== Zajrzyj do środka ===== */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Zajrzyj do środka</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Fragmenty check-listy. Punkt STOP oznacza: nie kupuj, nawet za niższą cenę.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STOPY.map((s) => (
                <div key={s.t} className="rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-5">
                  <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span className="rounded bg-rose-600 text-white px-1.5 py-0.5 text-[11px] font-black">STOP</span> {s.t}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{s.o}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6">
              <p className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-300" aria-hidden="true" /> Z instrukcji do umowy: czerwone flagi przy podpisaniu
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {[
                  'Sprzedający nie chce podpisać oświadczeń o przebiegu, szkodach i wadach albo skreśla je w całości.',
                  'Sprzedający żąda dopisania „Kupujący zapoznał się ze stanem technicznym i nie wnosi zastrzeżeń” lub wyłączenia rękojmi.',
                  'Prośba o wpisanie w umowie niższej ceny niż faktycznie płacisz.'
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" aria-hidden="true" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ===== Darmowe vs pakiet ===== */}
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Za darmo na stronie czy Niezbędnik?</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-600 dark:text-slate-300">&nbsp;</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-300 w-24 sm:w-32">Za darmo</th>
                    <th className="p-3 font-bold text-slate-900 dark:text-white w-24 sm:w-32 bg-amber-100/70 dark:bg-amber-900/30">Niezbędnik</th>
                  </tr>
                </thead>
                <tbody>
                  {porownanie.map(([t, d, p]) => (
                    <tr key={t} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="p-3 text-slate-800 dark:text-slate-200">{t}</td>
                      <td className="p-3 text-center">
                        {d ? <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" aria-label="tak" /> : <span className="text-slate-300" aria-label="nie">—</span>}
                      </td>
                      <td className="p-3 text-center bg-amber-50/70 dark:bg-amber-900/20">
                        {p ? <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" aria-label="tak" /> : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500">
              Darmowa lista i wzory umów zostają dostępne w <Link href="/asystent-zakupu/" className="underline">asystencie zakupu</Link>. Niezbędnik to wersja na poważne spotkanie ze sprzedającym.
            </p>
          </section>

          {/* ===== Jak to działa ===== */}
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Jak to działa</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                [ShoppingCart, 'Zamawiasz', `Wpisujesz e-mail i płacisz ${cena} BLIK-iem, przelewem lub kartą przez PayU.`],
                [Download, 'Pobierasz', 'Link do pobrania pojawia się od razu na stronie i przychodzi mailem razem z fakturą.'],
                [Car, 'Jedziesz na oględziny', 'Check-lista na telefonie, wydrukowana umowa i protokół w teczce. Odhaczasz punkt po punkcie.']
              ].map(([I, t, o], i) => {
                const Ikona = I as typeof Zap;
                return (
                  <li key={t as string} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center justify-center">{i + 1}</span>
                      <Ikona className="w-5 h-5 text-steel-600 dark:text-steel-400" aria-hidden="true" />
                    </span>
                    <p className="mt-3 font-bold text-slate-900 dark:text-white">{t as string}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{o as string}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ===== Pytania ===== */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {pytania.map((q) => (
                <details key={q.p} className="group p-4">
                  <summary className="flex justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold text-slate-900 dark:text-white">
                    {q.p}
                    <span className="transition-transform group-open:rotate-180 text-slate-400" aria-hidden="true">▾</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{q.o}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* ===== Zamówienie ===== */}
        <aside id="zamow" className="lg:sticky lg:top-20 space-y-4 scroll-mt-24">
          <FormularzZamowienia aktywny={aktywny} cena={cena} regulamin="/niezbednik/regulamin/" />
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 px-1">
            {['Pliki PDF i DOCX – drukujesz albo wypełniasz na telefonie', 'Link do pobrania od razu na stronie i w mailu', 'Faktura bez VAT (zwolnienie podmiotowe) mailem', 'Jednorazowa płatność, bez abonamentu'].map((x) => (
              <li key={x} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <p className="max-w-6xl mx-auto px-4 pb-10 text-xs text-slate-500">
        Pakiet to materiały pomocnicze – nie zastępuje porady prawnej ani przeglądu w warsztacie. Darmowa lista na oględziny i wzory umów są nadal dostępne w asystencie zakupu każdego modelu.
      </p>

      {/* pasek z przyciskiem na telefonie */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 print:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate">Niezbędnik · 7 plików</p>
          <p className="font-black text-slate-900 dark:text-white">{cena}</p>
        </div>
        <a href="#zamow" className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-3 text-sm">
          {aktywny ? 'Kupuję' : 'Zamówienie'}
        </a>
      </div>
    </div>
  );
}
