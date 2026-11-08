import { Metadata } from 'next';
import { CarModel } from '@/types/car-model';
import { getModelBySlug } from '@/lib/models';
import { nazwaKarty } from '@/lib/opis';
import { opisZatwierdzony, Markdown } from '@/lib/opisy';
import { kodyDlaKarty } from '@/lib/kody-bledow';
import { fmt, sztuk } from '@/lib/format';
import { slugWojewodztwa } from '@/lib/wojewodztwa';
import { KontekstKarty, pokazModul, linkOgledziny, linkFinansowanie, linkUbezpieczenia, panelDane } from '@/lib/panel';
import { faktyZakupu, radaHistoria, listaWarstwowa, vinModelu, FORMALNOSCI, ZRODLA_FORMALNOSCI, PROCENT, adresZakupu } from '@/lib/zakup';
import Okruszki from '@/components/Okruszki';
import InspectionChecklist from '@/components/InspectionChecklist';
import KalkulatorTCO from '@/components/KalkulatorTCO';
import LinkPartnerski from '@/components/LinkPartnerski';
import KodStrony from '@/components/KodStrony';
import { BoksCzesci, BoksVin, BoksUbezpieczenia, DolnyPasek } from '@/components/Monetyzacja';
import { profilNapedu, PREMIUM } from '@/components/KartaModelu';
import { site } from '@/config/site';
import { FileSearch, Wrench, ClipboardCheck, Wallet, FileText, ExternalLink, ArrowLeft, ShieldCheck } from 'lucide-react';

export function metadaneZakupu(m: CarModel): Metadata {
  const name = nazwaKarty(m);
  return {
    title: `${name} – na co uważać przy zakupie? Lista kontrolna i formalności`,
    description: `Kupujesz ${name}? Typowe usterki, co sprawdzić na oględzinach, historia VIN, koszty utrzymania i formalności po zakupie. ${fmt(m.cepik.liczbaWPolsce)} ${sztuk(
      m.cepik.liczbaWPolsce
    )} w Polsce wg CEPiK.`,
    alternates: { canonical: adresZakupu(m) },
    openGraph: { title: `Kupujesz ${name}? Sprawdź, zanim zapłacisz`, type: 'article', url: adresZakupu(m) }
  };
}

function Krok({ nr, id, ikona, tytul, children }: { nr: number; id: string; ikona: React.ReactNode; tytul: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-rust-600 text-white text-base font-black flex items-center justify-center">{nr}</span>
        <span className="hidden sm:inline-flex" aria-hidden="true">
          {ikona}
        </span>
        <span>{tytul}</span>
      </h2>
      {children}
    </section>
  );
}

const badge = {
  drobna: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  średnia: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  kosztowna: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
} as const;

const przycisk = 'inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors';

export default function AsystentZakupu({ m }: { m: CarModel }) {
  const name = nazwaKarty(m);
  const c = m.cepik;
  const k: KontekstKarty = { slug: m.slug, marka: m.marka, model: m.model, generacja: m.generacja, sredniRocznik: c.sredniRocznik, liczba: c.liczbaWPolsce };
  const f = faktyZakupu(m);
  const rodzic = m.rodzic ? getModelBySlug(m.rodzic) : undefined;
  const opisAI = opisZatwierdzony(m.slug);
  const usterki = m.usterki || [];
  const kody = [m.slug, ...(m.generacjeLista || []).map((g) => g.slug)]
    .flatMap((s) => kodyDlaKarty(s, m.rodzic))
    .filter((x, i, arr) => arr.findIndex((y) => y.kod.kod === x.kod.kod) === i)
    .slice(0, 8);
  const grupy = listaWarstwowa(m);
  const vinTu = vinModelu(m);
  const vin = pokazModul('vin', k);
  const ogl = pokazModul('ogledziny', k);
  const fin = pokazModul('finansowanie', k);
  const oc = pokazModul('ubezpieczenia', k) ? linkUbezpieczenia('oc', k) : '';
  const czesci = pokazModul('czesci', k);
  const generacje = (m.wszystkieGeneracje ? m.generacjeLista || [] : []).slice(0, 8);
  const konkurenci = (m.konkurenci || []).slice(0, 6);

  const okruszki = [
    { nazwa: 'Marki', adres: '/marki/' },
    { nazwa: m.marka, adres: `/marki/${m.markaSlug}/` },
    ...(rodzic ? [{ nazwa: m.model, adres: rodzic.adres }] : []),
    { nazwa: m.wszystkieGeneracje ? m.model : m.generacja, adres: m.adres },
    { nazwa: 'Zakup', adres: adresZakupu(m) }
  ];
  const kroki = [
    ['historia', 'Historia auta'],
    ['usterki', 'Na co uważać'],
    ['ogledziny', 'Oględziny'],
    ['koszty', 'Koszty'],
    ['formalnosci', 'Po zakupie']
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <div className="space-y-5">
        <Okruszki sciezka={okruszki} />
        <header className="space-y-3">
          <p className="text-sm font-bold text-rust-600 uppercase tracking-widest">Asystent zakupu</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Kupujesz {name}? Sprawdź, zanim zapłacisz</h1>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Pięć kroków od ogłoszenia do własnego auta: historia egzemplarza, typowe usterki tego modelu, lista rzeczy do sprawdzenia na oględzinach, koszty utrzymania i
            formalności po zakupie. Dane o autach w Polsce pochodzą z CEPiK.
          </p>
        </header>

        {/* Fakty z danych */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-steel-700 text-white rounded-xl p-4">
            <dt className="text-xs text-steel-100">W Polsce</dt>
            <dd className="text-2xl font-black tabular-nums">{fmt(c.liczbaWPolsce)}</dd>
            <dd className="text-xs text-steel-50">{f.rzadkosc.poziom.toLowerCase()}</dd>
          </div>
          {f.import !== null && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <dt className="text-xs text-slate-500">Sprowadzone jako używane</dt>
              <dd className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">{PROCENT(f.import)}</dd>
            </div>
          )}
          {f.salon !== null && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <dt className="text-xs text-slate-500">Z polskiego salonu</dt>
              <dd className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">{PROCENT(f.salon)}</dd>
            </div>
          )}
          {f.gdzie && f.gdzieTeryt && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <dt className="text-xs text-slate-500">Najwięcej aut w województwie</dt>
              <dd className="text-base font-bold text-slate-900 dark:text-white">
                <a href={`/wojewodztwa/${slugWojewodztwa(f.gdzieTeryt)}/`} className="hover:underline">
                  {f.gdzie}
                </a>
              </dd>
            </div>
          )}
        </dl>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>{f.rzadkosc.poziom}:</strong> {f.rzadkosc.opis}
        </p>

        <nav aria-label="Kroki" className="flex flex-wrap gap-2 text-sm">
          {kroki.map(([id, t], i) => (
            <a key={id} href={`#${id}`} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200">
              {i + 1}. {t}
            </a>
          ))}
        </nav>
      </div>

      {/* 1. Historia */}
      <Krok nr={1} id="historia" ikona={<FileSearch className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />} tytul="Sprawdź historię egzemplarza">
        <p className="text-slate-700 dark:text-slate-300">{radaHistoria(m)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {vin && <BoksVin k={k} />}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Za darmo: Historia Pojazdu (gov.pl)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Dla aut zarejestrowanych w Polsce: przebiegi z badań technicznych, ważność OC i przeglądu. Potrzebujesz numeru VIN, numeru rejestracyjnego i daty pierwszej
              rejestracji – poproś o nie sprzedającego.
            </p>
            <a href="https://historiapojazdu.gov.pl/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-steel-700 dark:text-steel-300 underline">
              Otwórz historiapojazdu.gov.pl <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div id="gdzie-vin" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 scroll-mt-20">
          <h3 className="font-bold text-slate-900 dark:text-white">Gdzie znaleźć numer VIN w {name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            VIN ma 17 znaków. Musi być identyczny we wszystkich miejscach – każda różnica, ślady spawania albo przeklejona tabliczka to powód, żeby zrezygnować z zakupu.
          </p>
          {vinTu && (
            <ul className="text-sm text-slate-800 dark:text-slate-200 list-disc pl-5 space-y-1">
              {vinTu.miejsca.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
          <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 space-y-1">
            <li>Dowód rejestracyjny – pole E (i karta pojazdu, jeśli była wydana).</li>
            <li>Tabliczka znamionowa producenta – zwykle w komorze silnika albo na słupku drzwi.</li>
            <li>Numer wybity na nadwoziu{vinTu ? '' : ' – miejsce zależy od modelu, najczęściej ściana grodziowa w komorze silnika albo podłoga przy przednim fotelu'}.</li>
            <li>W nowszych autach także tabliczka pod przednią szybą, widoczna z zewnątrz.</li>
          </ul>
          {vinTu && (
            <p className="text-xs text-slate-500">
              Źródło:{' '}
              {vinTu.zrodla.map((z) => (
                <a key={z.url} href={z.url} target="_blank" rel="noopener nofollow" className="underline mr-2">
                  {z.tytul}
                </a>
              ))}
            </p>
          )}
        </div>
      </Krok>

      {/* 2. Usterki */}
      <Krok nr={2} id="usterki" ikona={<Wrench className="w-6 h-6 text-rust-600" aria-hidden="true" />} tytul={`Na co uważać w ${m.model} ${m.generacja}`.trim()}>
        {opisAI && <Markdown tekst={opisAI.eksploatacja} />}
        {usterki.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {usterki.map((u, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">{u.tytul}</h3>
                  <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge[u.powaga]}`}>{u.powaga}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{u.opis}</p>
              </div>
            ))}
          </div>
        )}
        {!opisAI && usterki.length === 0 && (
          <p className="text-slate-700 dark:text-slate-300">
            Dla tego modelu nie mamy jeszcze opisu typowych usterek – poniżej znajdziesz listę rzeczy, które warto sprawdzić w każdym aucie z takim napędem. Jeśli masz to auto,
            napisz na kanale {site.youtubeChannelName}, co się w nim psuło – uzupełnimy opis.
          </p>
        )}
        {kody.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Kody błędów, które warto znać przy podłączeniu diagnostyki</h3>
            <ul className="flex flex-wrap gap-2">
              {kody.map(({ kod }) => (
                <li key={kod.kod}>
                  <a href={`/kody-bledow/${kod.kod.toLowerCase()}/`} className="inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm hover:border-steel-400">
                    <strong className="font-mono text-rust-600">{kod.kod}</strong> <span className="text-slate-700 dark:text-slate-300">{kod.nazwa}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Krok>

      {/* 3. Oględziny */}
      <Krok nr={3} id="ogledziny" ikona={<ClipboardCheck className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />} tytul="Oględziny i jazda próbna">
        <p className="text-slate-700 dark:text-slate-300">Zaznaczaj punkty w trakcie oglądania auta – lista zapamięta się w tym telefonie. Możesz ją też wydrukować albo zapisać jako PDF (w oknie drukowania wybierz „Zapisz jako PDF”).</p>
        <InspectionChecklist modelSlug={`zakup-${m.slug}`} grupy={grupy} tytulDruku={name} />
        {ogl && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Nie znasz się na mechanice?</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Zamów sprawdzenie auta przez mechanika przed zakupem{panelDane.moduly?.ogledziny?.partner ? ` – ${panelDane.moduly.ogledziny.partner}` : ''}. To zwykle ułamek ceny
                jednej poważnej naprawy.
              </p>
            </div>
            <LinkPartnerski href={linkOgledziny(k)} modul="ogledziny" partner={panelDane.moduly?.ogledziny?.partner || 'ogledziny'} karta={m.slug} className={przycisk}>
              Zamów oględziny <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          </div>
        )}
      </Krok>

      {/* 4. Koszty */}
      <Krok nr={4} id="koszty" ikona={<Wallet className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />} tytul="Ile będzie kosztować utrzymanie">
        <p className="text-slate-700 dark:text-slate-300">
          Wpisz swój roczny przebieg i ceny – kalkulator policzy miesięczny koszt paliwa, serwisu i ubezpieczenia. Realne spalanie zgłaszane przez kierowców znajdziesz na{' '}
          <a href={`${m.adres}#spalanie-tytul`} className="font-semibold text-steel-700 dark:text-steel-300 underline">
            karcie modelu
          </a>
          .
        </p>
        <KalkulatorTCO nazwa={name} {...profilNapedu(m)} premium={PREMIUM.has(m.marka)} />
        {fin && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Kupujesz na raty albo w leasingu?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Porównaj oferty kredytu i leasingu na auto, zanim podpiszesz umowę u sprzedawcy.</p>
            </div>
            <LinkPartnerski href={linkFinansowanie(k)} modul="finansowanie" partner={panelDane.moduly?.finansowanie?.partner || 'finansowanie'} karta={m.slug} className={przycisk}>
              Porównaj finansowanie <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          </div>
        )}
      </Krok>

      {/* 5. Formalności */}
      <Krok nr={5} id="formalnosci" ikona={<FileText className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />} tytul="Kupione – formalności krok po kroku">
        <p className="text-slate-700 dark:text-slate-300">Dotyczy auta zarejestrowanego w Polsce, kupionego od osoby prywatnej.</p>
        <ol className="space-y-3">
          {FORMALNOSCI.map((x, i) => (
            <li key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4">
              <span className="flex-shrink-0 w-24 text-xs font-bold uppercase tracking-wide text-rust-600 pt-0.5">{x.kiedy}</span>
              <div className="space-y-2 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white">{x.co}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{x.opis}</p>
                {x.link === 'oc' && oc && (
                  <LinkPartnerski href={oc} modul="ubezpieczenia-oc" partner={panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia'} karta={`zakup-${m.slug}`} className={przycisk.replace('whitespace-nowrap ', '')}>
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Porównaj OC dla {`${m.model} ${m.generacja}`.trim()} <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </LinkPartnerski>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-slate-500">
          Stan przepisów na listopad 2026 r. Terminy i opłaty mogą się zmienić – w razie wątpliwości zapytaj w wydziale komunikacji lub urzędzie skarbowym. Źródła:{' '}
          {ZRODLA_FORMALNOSCI.map((z, i) => (
            <span key={z.url}>
              {i > 0 && ', '}
              <a href={z.url} target="_blank" rel="noopener" className="underline">
                {z.nazwa}
              </a>
            </span>
          ))}
          .
        </p>
        {(oc || czesci) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oc && <BoksUbezpieczenia k={k} />}
            {czesci && <BoksCzesci k={k} silniki={[...new Set((m.silniki || []).map((x) => x.nazwa))]} />}
          </div>
        )}
      </Krok>

      {/* Dalej */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href={m.adres} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Wróć do karty {name}: dane techniczne, mapa, roczniki
        </a>
        {(generacje.length > 0 || konkurenci.length > 0) && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm space-y-2">
            {generacje.length > 0 && (
              <p>
                <strong>Konkretna generacja: </strong>
                {generacje.map((g, i) => (
                  <span key={g.slug}>
                    {i > 0 && ', '}
                    <a href={`${g.adres}zakup/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                      {g.nazwa.replace(`${m.marka} `, '')}
                    </a>
                  </span>
                ))}
              </p>
            )}
            {konkurenci.length > 0 && (
              <p>
                <strong>Rozważasz też: </strong>
                {konkurenci.map((g, i) => (
                  <span key={g.slug}>
                    {i > 0 && ', '}
                    <a href={`${g.adres}zakup/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                      {g.nazwa}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </section>
      <KodStrony sciezka={adresZakupu(m)} />
      <DolnyPasek
        elementy={[
          ...(vin ? [{ etykieta: 'Sprawdź VIN', href: '#narzedzie-vin', ikona: 'vin' as const, kolor: 'bg-steel-700' }] : []),
          { etykieta: 'Lista oględzin', href: '#ogledziny', ikona: 'zakup' as const, kolor: 'bg-rust-600' },
          ...(oc ? [{ etykieta: 'OC/AC', href: '#narzedzie-oc', ikona: 'oc' as const, kolor: 'bg-sky-600' }] : []),
          ...(czesci ? [{ etykieta: 'Części', href: '#narzedzie-czesci', ikona: 'czesci' as const, kolor: 'bg-emerald-600' }] : [])
        ]}
      />
    </article>
  );
}
