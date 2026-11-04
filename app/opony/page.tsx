import type { Metadata } from 'next';
import Link from 'next/link';
import { Snowflake, Sun, ThermometerSnowflake, Scale, Globe2, CloudSun, ExternalLink, BellRing, Clock, CalendarCheck, BookOpenCheck, CircleCheck, Plus, CalendarClock, Thermometer, Gauge, Snowflake as Platek, CircleAlert } from 'lucide-react';
import ZdjecieTla from '@/components/ZdjecieTla';
import SezonOpon from '@/components/SezonOpon';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import NarzedziaOpon from '@/components/NarzedziaOpon';
import { BokOpony, GdzieCisnienie } from '@/components/GrafikiOpon';
import LinkPartnerski from '@/components/LinkPartnerski';
import { sklepOpon } from '@/lib/panel';
import { ZRODLA_OPONY } from '@/lib/opony';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { PostepCzytania, Udostepnij } from '@/components/Czytanie';
import { site } from '@/config/site';

const AKTUALIZACJA_OPON = '2026-11-03';

export const metadata: Metadata = {
  title: 'Opony zimowe – kiedy zmienić, bieżnik, ciśnienie',
  description:
    'Kiedy zmienić opony na zimowe (zasada 7°C), ile mm bieżnika, jak odczytać wiek i oznaczenia opony oraz jakie ciśnienie – gdzie w aucie szukać tabliczki.',
  alternates: { canonical: '/opony/' },
  openGraph: {
    type: 'article',
    url: '/opony/',
    title: 'Opony pod kontrolą – kiedy zmienić, bieżnik, ciśnienie',
    description: 'Zasada 7°C, bieżnik, wiek z kodu DOT, oznaczenia na boku opony i ciśnienie z tabliczki. Proste testy bez wizyty u wulkanizatora.',
    locale: 'pl_PL',
    modifiedTime: AKTUALIZACJA_OPON
  },
  twitter: { card: 'summary_large_image' }
};

const FAQ = [
  {
    q: 'Czy w Polsce trzeba mieć opony zimowe?',
    a: 'Nie. W Polsce nie ma obowiązku jazdy na oponach zimowych. Opony muszą jednak być w dobrym stanie technicznym (m.in. bieżnik co najmniej 1,6 mm), a kierowca ma obowiązek dostosować jazdę do warunków. Przy szkodzie na letnich oponach w zimie ubezpieczyciel z AC może próbować zmniejszyć odszkodowanie.'
  },
  {
    q: 'Kiedy zmienić opony na zimowe?',
    a: 'Najczęściej stosowana zasada: gdy średnia temperatura spada poniżej 7°C, zwykle w październiku lub listopadzie. Na wiosnę – gdy przez kilka dni z rzędu jest powyżej 7°C, zwykle w kwietniu.'
  },
  {
    q: 'Jaka jest minimalna głębokość bieżnika?',
    a: 'Przepisy wymagają co najmniej 1,6 mm. Eksperci zalecają wymianę wcześniej: przy ok. 3 mm w oponach letnich i ok. 4 mm w zimowych.'
  },
  {
    q: 'Jak sprawdzić wiek opony?',
    a: 'Na boku opony jest kod DOT. Ostatnie cztery cyfry to tydzień i rok produkcji, np. 2321 oznacza 23. tydzień 2021 r. Producenci zalecają coroczną kontrolę opon starszych niż 5 lat i wymianę najpóźniej po 10 latach.'
  },
  {
    q: 'Jakie ciśnienie w oponach?',
    a: 'Takie, jakie podaje producent auta na tabliczce – najczęściej na słupku przy drzwiach kierowcy albo na klapce wlewu paliwa – i w instrukcji obsługi. Często jest inne dla przodu i tyłu oraz dla pełnego obciążenia. Mierz na zimnych oponach, co 2–4 tygodnie.'
  },
  {
    q: 'Jak sprawdzić, czy opona jest zimowa?',
    a: 'Na boku opony szukaj symbolu góry z płatkiem śniegu (3PMSF) – oznacza oponę sprawdzoną w warunkach zimowych. Samo oznaczenie M+S to tylko deklaracja producenta bez testu.'
  },
  {
    q: 'Czy opony całoroczne to dobry pomysł?',
    a: 'Mogą być rozsądne przy niewielkim przebiegu i jeździe głównie po mieście. Przy częstej jeździe w trasie, w górach albo przy dużym przebiegu lepsze są dwa komplety: letni i zimowy.'
  }
];

export default function OponyPage() {
  const zimowe = sklepOpon('zimowe');
  const letnie = sklepOpon('letnie');
  const ogolny = sklepOpon();
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Opony pod kontrolą – kiedy zmienić, bieżnik, wiek, oznaczenia i ciśnienie',
      description: 'Zasada 7°C, minimalny bieżnik, wiek opony z kodu DOT, oznaczenia na boku opony i ciśnienie z tabliczki producenta.',
      inLanguage: 'pl-PL',
      datePublished: '2026-11-02',
      dateModified: AKTUALIZACJA_OPON,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/opony/` },
      image: `${site.url}/opony/opengraph-image`,
      author: { '@type': 'Person', name: site.author, url: site.youtubeChannelUrl, description: site.authorBio },
      publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/apple-icon.png` } },
      citation: ZRODLA_OPONY.map((z) => z.url)
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    }
  ];
  const naglowek = (nr: string, t: string, o?: string) => (
    <div>
      <div className="text-xs font-black tabular-nums tracking-[0.2em] text-sky-600 dark:text-sky-400">{nr}</div>
      <h2 className="mt-1 text-[1.9rem] sm:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white [text-wrap:balance]">{t}</h2>
      {o && <p className="mt-2 text-lg text-slate-500 dark:text-slate-400 max-w-2xl [text-wrap:pretty]">{o}</p>}
    </div>
  );
  return (
    <div className="pb-8" id="tresc-opony">
      <PostepCzytania cel="tresc-opony" />
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <ZdjecieTla klucz="opony" priorytet className="opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" aria-hidden="true" />
        <div className="absolute -top-40 right-0 w-[34rem] h-[34rem] rounded-full bg-sky-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-14 sm:pb-20">
          <div className="[&_a]:text-white/70 [&_span]:text-white/70">
            <Okruszki sciezka={[{ nazwa: 'Opony', adres: '/opony/' }]} />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div className="space-y-5">
              <SezonOpon />
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.02]">
                <span className="block mb-3 text-base sm:text-lg font-bold tracking-normal text-sky-200">Opony zimowe, letnie i całoroczne</span>
                Opony
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-white to-amber-200 bg-clip-text text-transparent">pod kontrolą.</span>
              </h1>
              <p className="text-lg text-white/75 max-w-xl leading-relaxed">Kiedy wymienić, co mówią przepisy i czy Twoje opony są jeszcze dobre – sprawdzisz w minutę, bez wizyty u wulkanizatora.</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" /> Aktualizacja: <time dateTime={AKTUALIZACJA_OPON}>3 listopada 2026</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" aria-hidden="true" /> 7 min czytania
                </span>
                <Udostepnij tytul="Opony pod kontrolą – MotoFormat" />
              </div>
              <nav aria-label="Na tej stronie" className="flex flex-wrap gap-2 text-sm font-bold">
                {[
                  ['#wiedza', 'Co warto wiedzieć'],
                  ['#oznaczenia', 'Oznaczenia'],
                  ['#rozmiar', 'Rozmiar'],
                  ['#wiek', 'Wiek opony'],
                  ['#bieznik', 'Bieżnik'],
                  ['#cisnienie', 'Ciśnienie']
                ].map(([h, n]) => (
                  <a key={h} href={h} className="rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/20 px-4 py-2 transition">
                    {n}
                  </a>
                ))}
              </nav>
            </div>
            {/* termometr 7°C */}
            <div className="hidden md:flex justify-center" aria-hidden="true">
              <div className="relative w-56 h-56 rounded-full ring-1 ring-white/15 bg-white/[0.04] backdrop-blur flex flex-col items-center justify-center">
                <div className="absolute inset-3 rounded-full border-[10px] border-transparent" style={{ borderTopColor: '#f59e0b', borderRightColor: '#f59e0b', borderBottomColor: '#38bdf8', borderLeftColor: '#38bdf8', transform: 'rotate(-45deg)' }} />
                <ThermometerSnowflake className="w-8 h-8 text-sky-300" />
                <div className="text-6xl font-black tabular-nums mt-1">7°C</div>
                <div className="text-xs text-white/60 text-center px-8 mt-1">granica między oponami letnimi a zimowymi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-16 mt-10">
      {ogolny && (
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/25 blur-3xl" aria-hidden="true" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300">Partner: {ogolny.nazwa}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Znajdź opony do swojego auta</h2>
              <p className="text-white/75">Wybierz rozmiar z boku obecnej opony albo model auta – sklep pokaże pasujące opony i porówna ceny producentów.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {zimowe && (
                <LinkPartnerski href={zimowe.url} partner={zimowe.nazwa.toLowerCase()} modul="opony" karta="opony-zimowe" className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-extrabold px-5 py-3 rounded-xl">
                  <Snowflake className="w-5 h-5" aria-hidden="true" /> Opony zimowe <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </LinkPartnerski>
              )}
              {letnie && (
                <LinkPartnerski href={letnie.url} partner={letnie.nazwa.toLowerCase()} modul="opony" karta="opony-letnie" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl">
                  <Sun className="w-5 h-5" aria-hidden="true" /> Opony letnie <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </LinkPartnerski>
              )}
            </div>
          </div>
          <p className="relative mt-4 text-[11px] text-white/50">Link partnerski – jeśli kupisz przez niego, możemy dostać prowizję. Cena się nie zmienia.</p>
        </section>
      )}

      <section aria-labelledby="w-skrocie" className="rounded-3xl bg-sky-50 ring-1 ring-sky-200 dark:bg-sky-950/40 dark:ring-sky-900 p-6 sm:p-7">
        <h2 id="w-skrocie" className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
          <BookOpenCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" aria-hidden="true" /> W skrócie
        </h2>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {[
            'Na zimowe zmieniasz, gdy średnia temperatura spada poniżej ok. 7°C – zwykle w październiku lub listopadzie.',
            'Prawo wymaga 1,6 mm bieżnika, ale zimą bezpieczniej mieć co najmniej 4 mm, a latem 3 mm.',
            'Wiek opony odczytasz z 4 ostatnich cyfr kodu DOT. Producenci zalecają wymianę najpóźniej po 10 latach.',
            'Ciśnienie bierzesz z tabliczki w aucie, nie z boku opony – i mierzysz je na zimnych oponach.'
          ].map((t) => (
            <li key={t} className="flex gap-3 text-[1.05rem] leading-7 text-slate-800 dark:text-slate-100">
              <CircleCheck className="w-5 h-5 mt-1 flex-shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="wiedza" className="space-y-5 scroll-mt-24">
        {naglowek('01', 'Co warto wiedzieć o oponach', 'Przepisy, zasada 7°C i różnica między oponami zimowymi, letnimi i całorocznymi.')}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white p-6 sm:p-8">
            <ThermometerSnowflake className="absolute -right-6 -bottom-6 w-44 h-44 text-white/10" aria-hidden="true" />
            <div className="text-[11px] font-black tracking-[0.2em] text-sky-100">ZASADA</div>
            <div className="text-5xl font-black mt-2">7°C</div>
            <p className="mt-3 max-w-md text-sky-50">
              Poniżej ok. 7°C mieszanka opon letnich twardnieje i traci przyczepność – wtedy pora na zimowe, zwykle w październiku lub listopadzie. Powyżej 7°C przez kilka dni z
              rzędu – na letnie, zwykle w kwietniu.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-slate-900 text-white p-6 flex flex-col justify-between">
            <div className="text-[11px] font-black tracking-[0.2em] text-rose-300">MINIMUM PRAWNE</div>
            <div>
              <div className="text-5xl font-black">1,6 mm</div>
              <p className="text-sm text-white/70 mt-2">bieżnika. Zalecane: 3 mm latem, 4 mm zimą.</p>
            </div>
          </div>
          {[
            { ikona: Scale, t: 'Przepisy w Polsce', o: 'Nie ma obowiązku jazdy na oponach zimowych. Za zużyte opony policja może dać mandat i zatrzymać dowód rejestracyjny.' },
            { ikona: Globe2, t: 'Wyjazd za granicę', o: 'Niemcy, Czechy, Austria, Słowacja i inne kraje wymagają zimówek w zimowych warunkach albo w określonych miesiącach. Sprawdź przed wyjazdem.' },
            { ikona: CloudSun, t: 'Opony całoroczne', o: 'Dobre przy małym przebiegu i jeździe po mieście. W trasie, w górach i przy dużym przebiegu lepsze są dwa komplety.' }
          ].map(({ ikona: I, t, o }) => (
            <div key={t} className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6">
              <I className="w-7 h-7 text-rust-600" aria-hidden="true" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-3">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{o}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="oznaczenia" className="space-y-5 scroll-mt-24">
        {naglowek('02', 'Jak czytać oznaczenia na oponie', 'Wszystko jest na boku opony – rozmiar, rodzaj, data produkcji. Pięć napisów, które warto znać.')}
        <BokOpony />
      </section>

      <section className="space-y-5">
        {naglowek('03', 'Sprawdź swoje opony', 'Trzy szybkie testy – potrzebujesz tylko opony przed sobą i telefonu w ręku.')}
        <NarzedziaOpon />
      </section>

      <section id="cisnienie" className="space-y-5 scroll-mt-24">
        {naglowek('04', 'Ciśnienie w oponach: ile barów?', 'Właściwe ciśnienie podaje producent auta na tabliczce (naklejce). Nie ma jednej wartości dla wszystkich aut.')}
        <GdzieCisnienie />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { ikona: CalendarClock, t: 'Jak często', o: 'Co 2–4 tygodnie, przed dłuższą trasą i zawsze, gdy wieziesz pełne auto ludzi lub bagażu.' },
            { ikona: Thermometer, t: 'Na zimnych oponach', o: 'Mierz przed jazdą albo po przejechaniu najwyżej kilku kilometrów. Ciepła opona pokazuje więcej, niż ma naprawdę.' },
            { ikona: Gauge, t: 'Według tabliczki, nie boku opony', o: 'Napis MAX PRESS na oponie to wartość graniczna. Pompuj do ciśnienia z tabliczki – osobno przód i tył, dla zwykłego lub pełnego obciążenia.' },
            { ikona: Platek, t: 'Zimą sprawdzaj częściej', o: 'Gdy robi się zimno, ciśnienie w oponach spada. Sprawdź je po pierwszych przymrozkach i po zmianie opon na zimowe.' },
            { ikona: CircleAlert, t: 'Za niskie ciśnienie', o: 'Dłuższa droga hamowania (spadek o 0,5 bara może ją wydłużyć nawet o ok. 4 m), gorsza przyczepność, szybsze zużycie opon i większe spalanie.' },
            { ikona: Gauge, t: 'Kontrolka ciśnienia (TPMS)', o: 'Gdy się zapali – zatrzymaj się, sprawdź opony i dopompuj. Potem, jeśli auto tego wymaga, zresetuj system zgodnie z instrukcją. Sprawdź też koło zapasowe.' }
          ].map(({ ikona: I, t, o }) => (
            <div key={t} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5">
              <I className="w-6 h-6 text-sky-600" aria-hidden="true" />
              <h3 className="font-extrabold text-slate-900 dark:text-white mt-2">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{o}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          Jednostki: <strong className="text-slate-700 dark:text-slate-300">1 bar = 100 kPa ≈ 14,5 psi</strong>. Kompresory na stacjach zwykle pokazują bary, a tabliczki często podają bary i kPa obok siebie.
        </p>
      </section>

      <Link href="/przypomnienia/" className="flex items-center gap-4 bg-steel-700 hover:bg-steel-800 text-white rounded-2xl p-5">
        <BellRing className="w-8 h-8 text-rust-300 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-bold text-lg">Przypomnimy Ci o zmianie opon</span>
          <span className="block text-sm text-steel-100">E-mail w marcu i w październiku – razem z przypomnieniem o OC i przeglądzie, jeśli chcesz.</span>
        </span>
      </Link>

  <section id="pytania" className="space-y-5 scroll-mt-24">
        {naglowek('05', 'Najczęstsze pytania')}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 sm:px-6">
              <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{f.q}</span>
                <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
        <div className="md:col-span-3 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 space-y-3">
          <h2 className="font-black text-lg text-slate-900 dark:text-white">Źródła</h2>
          <ol className="space-y-2 list-decimal pl-5 marker:text-slate-400">
            {ZRODLA_OPONY.map((z) => (
              <li key={z.url}>
                <a href={z.url} target="_blank" rel="noopener noreferrer" className="text-sky-700 dark:text-sky-300 hover:underline">
                  {z.nazwa}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-2 rounded-3xl bg-slate-100 dark:bg-slate-900/60 p-6 space-y-2 text-slate-600 dark:text-slate-400">
          <h2 className="font-black text-lg text-slate-900 dark:text-white">Jak powstała ta strona</h2>
          <p>Opracował <strong className="text-slate-800 dark:text-slate-200">{site.author}</strong>, twórca kanału {site.name} – własnymi słowami, na podstawie przepisów i źródeł obok. Stan przepisów: listopad 2026.</p>
          <p className="text-xs">To informacja poglądowa, nie porada prawna ani techniczna.</p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <KodStrony sciezka={'/opony/'} />
      </div>
    </div>
  );
}
