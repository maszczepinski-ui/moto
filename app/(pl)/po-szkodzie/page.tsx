// Strona produktu: Niezbędnik po szkodzie (odszkodowanie z OC sprawcy) + darmowy szybki test kosztorysu.
// Test działa zawsze (darmowe narzędzie). Formularz zamówienia włącza się sam, gdy pakiet jest w sprzedaży
// (klucze w Vercelu + przełącznik w data/sklep/produkty.json – lib/sklep/konfiguracja.ts).
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle, ArrowDown, CalendarClock, CheckCircle2, ClipboardCheck, FileSignature, FileText, Gavel, Lock, Mail, Scale, ShieldCheck, Smartphone, Table2, Zap
} from 'lucide-react';
import TelefonSprawdzacza from '@/components/szkoda/TelefonSprawdzacza';
import Okruszki from '@/components/Okruszki';
import ZdjecieTla from '@/components/ZdjecieTla';
import FormularzZamowienia from '@/components/sklep/FormularzZamowienia';
import SzybkiTest from '@/components/szkoda/SzybkiTest';
import LinkPartnerski from '@/components/LinkPartnerski';
import { produktAktywny, zlotowki } from '@/lib/sklep/konfiguracja';
import { PRODUKTY } from '@/lib/sklep/produkty';
import { partnerKancelaria } from '@/lib/panel';
import { site } from '@/config/site';

export const dynamic = 'force-dynamic';

const OPIS = 'Darmowy test kosztorysu z OC sprawcy: zamienniki, potrącenia, rabaty, VAT i szkoda całkowita. Sprawdzacz policzy kwotę do odzyskania i przygotuje reklamację do ubezpieczyciela.';

export function generateMetadata(): Metadata {
  return {
    title: 'Zaniżone odszkodowanie z OC? Sprawdź kosztorys',
    description: OPIS,
    alternates: { canonical: '/po-szkodzie/' },
    openGraph: { title: 'Zaniżone odszkodowanie z OC? Sprawdź kosztorys', description: OPIS, url: `${site.url}/po-szkodzie/` }
  };
}

const ZAWARTOSC = [
  { ikona: Scale, tytul: 'Sprawdzacz kosztorysu', opis: 'Przepisujesz kilka liczb z kosztorysu. Dostajesz czerwone flagi z wyjaśnieniem, kwotę do odzyskania i kalendarz terminów.' },
  { ikona: FileSignature, tytul: 'Reklamacja wypełniona Twoimi danymi', opis: 'Tylko argumenty, które pasują do Twojej sprawy, z podstawą prawną. Pobierasz jako Word albo drukujesz.' },
  { ikona: Gavel, tytul: 'Plan B na odmowę', opis: 'Odpowiedź na typowe argumenty ubezpieczyciela, wezwanie do zapłaty, gdy nie odpowie w 30 dni, i treść wniosku do Rzecznika Finansowego.' },
  { ikona: ClipboardCheck, tytul: 'Pierwsze 72 godziny po szkodzie', opis: 'Co zrobić od razu: zdjęcia, zgłoszenie, oględziny, auto zastępcze i czego nie podpisywać.' },
  { ikona: FileText, tytul: 'Jak czytać kosztorys', opis: 'Stawka, części Q i P, potrącenia, rabaty, VAT – na przykładzie, z zaznaczonymi miejscami, gdzie najczęściej jest zaniżenie.' },
  { ikona: Table2, tytul: 'Dziennik szkody', opis: 'Arkusz do zapisywania rozmów, pism i dat – sam liczy 30 i 90 dni.' }
];

/** Przykłady czerwonych flag (tak opisuje je Sprawdzacz) */
const FLAGI = [
  { t: 'Zamienniki zamiast oryginałów', o: 'Części z literą Q albo P są tańsze od oryginałów. To ubezpieczyciel powinien wykazać, że przywrócą auto do stanu sprzed szkody.', p: 'art. 361 i 363 k.c., uchwała SN III CZP 80/11' },
  { t: 'Potrącenia za wiek auta', o: 'Odjęcie części ceny nowych części jest dopuszczalne tylko, gdy ubezpieczyciel udowodni, że naprawa podniosła wartość auta.', p: 'uchwała 7 sędziów SN III CZP 80/11' },
  { t: 'Rabaty nie dla Ciebie', o: 'Rabaty warsztatów partnerskich ubezpieczyciela nie powinny obniżać wypłaty, gdy naruszają Twój uzasadniony interes.', p: 'uchwały SN III CZP 32/24 i III CZP 119/22' },
  { t: 'Wypłata bez VAT', o: 'Jeśli nie odliczasz VAT i nie naprawiłeś auta bez faktury z VAT, podatek jest częścią kosztu naprawy.', p: 'uchwała SN III CZP 32/24' }
];

/** Co daje darmowy test, a co pakiet */
const POROWNANIE: [string, boolean, boolean][] = [
  ['Sygnały możliwego zaniżenia', true, true],
  ['Kwota do odzyskania wyliczona z Twojego kosztorysu', false, true],
  ['Reklamacja z Twoimi danymi i argumentami (Word, druk)', false, true],
  ['Kalendarz terminów: 30 dni, 90 dni, art. 8', false, true],
  ['Odpowiedź na odmowę i wezwanie do zapłaty', false, true],
  ['Tekst wniosku do Rzecznika Finansowego', false, true],
  ['Poradniki PDF, wzory pism i dziennik szkody', false, true]
];

const PYTANIA = [
  { p: 'Czy to jest porada prawna?', o: 'Nie. To narzędzie i wzory pism, które sam wysyłasz. Nie reprezentujemy Cię przed ubezpieczycielem. Przy szkodzie na osobie, bardzo dużej kwocie albo sprawie w sądzie skorzystaj z pomocy prawnika.' },
  { p: 'Dla jakich szkód jest pakiet?', o: 'Dla szkód w aucie likwidowanych z OC sprawcy (ktoś uderzył w Twoje auto). Nie dotyczy autocasco (tam decydują warunki Twojej umowy) ani zadośćuczynienia za obrażenia.' },
  { p: 'Czy muszę dzwonić do warsztatów po stawki?', o: 'Nie. Reklamacja działa bez tego – żąda, żeby ubezpieczyciel wskazał warsztat, który naprawi auto po jego stawce. Wycena z warsztatu przyda się w drugim piśmie, jeśli ubezpieczyciel odmówi; Sprawdzacz daje gotową wiadomość do wysłania.' },
  { p: 'Co, jeśli ubezpieczyciel odmówi?', o: 'Masz gotowy drugi krok: odpowiedź na jego argumenty i treść wniosku do Rzecznika Finansowego (interwencja jest bezpłatna). A jeśli ubezpieczyciel nie odpowie na reklamację w 30 dni, reklamację uważa się za uwzględnioną – Sprawdzacz przygotuje wtedy wezwanie do zapłaty.' },
  { p: 'Czy moje dane trafiają do Was?', o: 'Nie. Liczby z kosztorysu i dane do pism zostają w Twojej przeglądarce. Na serwer trafia tylko e-mail z zamówienia, potrzebny do zalogowania.' },
  { p: 'Ile mam czasu?', o: 'Roszczenie o szkodę w aucie przedawnia się co do zasady po 3 latach od dnia, w którym dowiedziałeś się o szkodzie i sprawcy. Zgłoszenie szkody i reklamacja przerywają ten termin. Nie czekaj jednak – im wcześniej, tym łatwiej o dowody.' },
  { p: 'Czy mogę zwrócić pakiet?', o: 'To treść cyfrowa dostępna od razu po zakupie, więc prawo odstąpienia od umowy wygasa po jej dostarczeniu (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta). Dlatego najpierw zrób darmowy test – jeśli nie widzi podstaw do odwołania, nie kupuj.' }
];

export default function PoSzkodziePage() {
  const p = PRODUKTY.szkoda;
  const cena = zlotowki(p.cenaGr);
  const aktywny = produktAktywny('szkoda');
  const kancelaria = partnerKancelaria();
  const przycisk = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold px-6 py-3.5';
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PYTANIA.map((q) => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.o } }))
  };

  return (
    <div className="pb-20 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      {/* ===== Nagłówek ===== */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <ZdjecieTla klucz="mandaty" priorytet className="opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="[&_*]:!text-slate-300 [&_a:hover]:!text-white mb-6">
            <Okruszki sciezka={[{ nazwa: 'Po szkodzie', adres: '/po-szkodzie/' }]} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Szkoda z OC sprawcy
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Wycena szkody za niska?
              <span className="block text-amber-300">Sprawdź to w 10 minut.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">Zrób darmowy test kosztorysu. Jeśli widać zaniżenie, Sprawdzacz policzy kwotę i przygotuje reklamację – bez oddawania części odszkodowania kancelarii.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#test" className={`${przycisk} bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-400/20`}>
                Zrób darmowy test <ArrowDown className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#co-w-srodku" className="inline-flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white">
                Co jest w pakiecie?
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
              {[
                [Lock, 'Dane zostają na Twoim telefonie'],
                [Zap, 'Pismo gotowe od razu'],
                [Smartphone, 'Word, druk albo tekst do skopiowania']
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
            <TelefonSprawdzacza />
          </div>
          </div>
        </div>
      </section>

      {/* ===== Pas faktów ===== */}
      <section className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            ['30 dni', 'ma ubezpieczyciel na wypłatę od zgłoszenia szkody'],
            ['30 dni', 'na odpowiedź na reklamację – bez odpowiedzi jest uznana'],
            ['3 lata', 'na dochodzenie odszkodowania za szkodę w aucie'],
            ['0 zł', 'interwencja Rzecznika Finansowego']
          ].map(([l, o]) => (
            <div key={o}>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{l}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{o}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-14">
          <section id="test" className="scroll-mt-24">
            <SzybkiTest sprzedaz={aktywny} cena={cena} />
          </section>

          {/* ===== Zawartość ===== */}
          <section id="co-w-srodku" className="space-y-5 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Co dostajesz w pakiecie</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ZAWARTOSC.map((z, i) => (
                <li key={z.tytul} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
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
              <p className="text-slate-600 dark:text-slate-300 mt-1">Tak Sprawdzacz opisuje znalezione problemy – prostym językiem i z podstawą prawną w piśmie.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FLAGI.map((f) => (
                <div key={f.t} className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-5">
                  <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span className="rounded bg-amber-400 text-slate-900 px-1.5 py-0.5 text-[11px] font-black uppercase">Flaga</span> {f.t}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{f.o}</p>
                  <p className="text-xs text-slate-500 mt-2">Podstawa: {f.p}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6">
              <p className="flex items-center gap-2 font-bold">
                <FileSignature className="w-5 h-5 text-amber-300" aria-hidden="true" /> Fragment reklamacji: niska stawka za roboczogodzinę
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed border-l-2 border-amber-400/60 pl-4">
                „…Wnoszę o przeliczenie kalkulacji według stawki rynkowej w mojej okolicy albo o wskazanie z nazwy i adresu warsztatu w mojej okolicy, który wykona naprawę zgodnie z technologią producenta po stawce przyjętej w kalkulacji.”
              </p>
              <p className="mt-3 text-xs text-slate-400">Nie musisz udowadniać „średniej rynkowej” – to ubezpieczyciel ma wskazać warsztat, który naprawi auto po jego stawce.</p>
            </div>
          </section>

          {/* ===== Darmowy test vs pakiet ===== */}
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Darmowy test czy pakiet?</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-600 dark:text-slate-300">&nbsp;</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-300 w-24 sm:w-32">Test</th>
                    <th className="p-3 font-bold text-slate-900 dark:text-white w-24 sm:w-32 bg-amber-100/70 dark:bg-amber-900/30">Pakiet</th>
                  </tr>
                </thead>
                <tbody>
                  {POROWNANIE.map(([t, d, pk]) => (
                    <tr key={t} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="p-3 text-slate-800 dark:text-slate-200">{t}</td>
                      <td className="p-3 text-center">
                        {d ? <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" aria-label="tak" /> : <span className="text-slate-300" aria-label="nie">—</span>}
                      </td>
                      <td className="p-3 text-center bg-amber-50/70 dark:bg-amber-900/20">
                        {pk ? <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" aria-label="tak" /> : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ===== Jak to działa ===== */}
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Jak to działa</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                [Scale, 'Sprawdzasz kosztorys', 'Przepisujesz kilka liczb. Sprawdzacz pokazuje, co jest zaniżone i o ile.'],
                [Mail, 'Wysyłasz reklamację', 'Pismo z konkretną kwotą. Ubezpieczyciel ma 30 dni na odpowiedź – Sprawdzacz pilnuje terminów.'],
                [CalendarClock, 'Odmowa? Masz plan B', 'Odpowiedź na jego argumenty, wezwanie do zapłaty albo wniosek do Rzecznika Finansowego.']
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

          {/* ===== Dwie drogi ===== */}
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Sam czy z kancelarią?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-emerald-500/60 bg-white dark:bg-slate-900 p-5 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Zrób to sam</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Zatrzymujesz całą dopłatę. Poświęcasz jeden wieczór na pismo i pilnujesz terminów. Najlepsze przy dopłatach rzędu kilkuset do kilku tysięcy złotych.</p>
                <p className="font-black text-slate-900 dark:text-white">{cena} jednorazowo</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Kancelaria odszkodowawcza</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Nic nie robisz, ale oddajesz część odszkodowania – kancelarie same podają średnio ok. 25% odzyskanej kwoty. Rozsądne przy szkodzie na osobie albo bardzo dużej różnicy.
                </p>
                {kancelaria && (
                  <>
                    <LinkPartnerski href={kancelaria.url} modul="kancelaria" partner={kancelaria.partner} karta="po-szkodzie-strona" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:border-slate-500">
                      Bezpłatna analiza: {kancelaria.partner}
                    </LinkPartnerski>
                    <p className="text-xs text-slate-500">Współpraca partnerska – otrzymujemy wynagrodzenie za polecenie. Dane podajesz bezpośrednio partnerowi.</p>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Więcej o terminach, aucie zastępczym i reklamacji przeczytasz w poradniku{' '}
              <Link href="/poradniki/odszkodowanie-z-oc-sprawcy/" className="underline">
                odszkodowanie z OC sprawcy
              </Link>
              .
            </p>
          </section>

          {/* ===== Pytania ===== */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Najczęstsze pytania</h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {PYTANIA.map((q) => (
                <details key={q.p} className="group p-4">
                  <summary className="flex justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold text-slate-900 dark:text-white">
                    {q.p}
                    <span className="transition-transform group-open:rotate-180 text-slate-400" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{q.o}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* ===== Zamówienie ===== */}
        <aside id="zamow" className="lg:sticky lg:top-20 space-y-4 scroll-mt-24">
          <FormularzZamowienia aktywny={aktywny} cena={cena} regulamin="/niezbednik/regulamin/" produkt="szkoda" dopisek="Płatność obsługuje PayU. Dostęp do Sprawdzacza i pliki dostaniesz od razu po zapłacie, a fakturę mailem." />
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 px-1">
            {['Sprawdzacz kosztorysu na rok, na 3 urządzeniach', 'Pisma etapu 1 i 2 – Word, druk albo tekst', 'Poradniki PDF i dziennik szkody', 'Jednorazowa płatność, bez prowizji od odszkodowania'].map((x) => (
              <li key={x} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <p className="max-w-6xl mx-auto px-4 pb-10 text-xs text-slate-500">
        Pakiet to narzędzie i wzory pism – nie jest poradą prawną ani reprezentacją przed ubezpieczycielem i nie gwarantuje dopłaty. Dotyczy szkód w pojeździe z OC sprawcy.
      </p>

      {/* pasek z przyciskiem na telefonie */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 print:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate">Niezbędnik po szkodzie</p>
          <p className="font-black text-slate-900 dark:text-white">{aktywny ? cena : 'Test za darmo'}</p>
        </div>
        <a href={aktywny ? '#zamow' : '#test'} className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-3 text-sm">
          {aktywny ? 'Kupuję' : 'Zrób test'}
        </a>
      </div>
    </div>
  );
}
