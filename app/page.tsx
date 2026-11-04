import { getModelSummaries } from '@/lib/models';
import ModelFilters from '@/components/ModelFilters';
import YouTubeIcon from '@/components/YouTubeIcon';
import { Database, MapPin, ArrowRight, Trophy, Search } from 'lucide-react';
import ZdjecieTla from '@/components/ZdjecieTla';
import IkonaMenu from '@/components/IkonaMenu';
import { menuGlowne } from '@/lib/menu';
import { udzialPaliw, najpopularniejsze, rocznikiDekadami, przykladZawyzenia, udzialSprowadzonych } from '@/lib/infografiki';
import { PasekUdzialow, SlupkiPoziome, SlupkiPionowe } from '@/components/Infografiki';
import type { KluczZdjecia } from '@/config/zdjecia';
import { rankingi, listaWojewodztw } from '@/lib/dane';
import Link from 'next/link';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';
import { opublikowane } from '@/lib/wpisy';
import { rankingiNaTeraz, NAZWY_SEZONOW } from '@/lib/produkty';
import { formatDate } from '@/lib/format';
import { pokazModul } from '@/lib/panel';
import SekcjaVinGlowna from '@/components/SekcjaVinGlowna';
import SekcjaOponGlowna from '@/components/SekcjaOponGlowna';
import SekcjaPoradnikowGlowna from '@/components/SekcjaPoradnikowGlowna';
import SekcjaOcGlowna from '@/components/SekcjaOcGlowna';
import SekcjaNajnowszyPoradnik from '@/components/SekcjaNajnowszyPoradnik';
import { NAZWY_KATEGORII } from '@/lib/wpisy';
import { PlayCircle } from 'lucide-react';

const KAFLE: { zdjecie: KluczZdjecia; nadtytul: string; tytul: string; opis: string; adres: string; gradient: string; linki: { nazwa: string; adres: string }[] }[] = [
  {
    zdjecie: 'kupujesz',
    nadtytul: 'Zakup auta',
    tytul: 'Kupujesz używane auto?',
    opis: 'Typowe usterki modelu, lista do odhaczenia na oględzinach, historia VIN i formalności po zakupie.',
    adres: '/asystent-zakupu/',
    gradient: 'from-rust-900/95 via-rust-900/50 to-transparent',
    linki: [
      { nazwa: 'Asystent zakupu', adres: '/asystent-zakupu/' },
      { nazwa: 'Sprawdź VIN', adres: '/sprawdz-vin/' },
      { nazwa: 'Kody błędów', adres: '/kody-bledow/' }
    ]
  },
  {
    zdjecie: 'trasa',
    nadtytul: 'W trasie',
    tytul: 'Ruszasz w drogę?',
    opis: 'Policz koszt paliwa na trasie dla swojego auta i podziel go na pasażerów.',
    adres: '/koszt-trasy/',
    gradient: 'from-steel-900/95 via-steel-900/50 to-transparent',
    linki: [
      { nazwa: 'Koszt przejazdu', adres: '/koszt-trasy/' },
      { nazwa: 'Warszawa – Kraków', adres: '/koszt-trasy/warszawa-krakow/' },
      { nazwa: 'Fotoradary', adres: '/fotoradary/' }
    ]
  },
  {
    zdjecie: 'elektryki',
    nadtytul: 'Auta elektryczne',
    tytul: 'Gdzie naładować elektryka?',
    opis: 'Wpisz miejscowość i zobacz ładowarki na mapie: złącza, moc i drogę do każdej z nich.',
    adres: '/ladowarki/',
    gradient: 'from-emerald-950/95 via-emerald-900/50 to-transparent',
    linki: [
      { nazwa: 'Mapa ładowarek', adres: '/ladowarki/' },
      { nazwa: 'Koszt trasy elektrykiem', adres: '/koszt-trasy/' }
    ]
  },
  {
    zdjecie: 'mandaty',
    nadtytul: 'Przepisy',
    tytul: 'Mandaty i punkty karne',
    opis: 'Ile za przekroczenie prędkości, ile punktów zostało do limitu i kiedy zatrzymują prawo jazdy.',
    adres: '/mandaty/',
    gradient: 'from-slate-950/95 via-slate-900/50 to-transparent',
    linki: [
      { nazwa: 'Kalkulator mandatu', adres: '/mandaty/' },
      { nazwa: 'Mapa fotoradarów', adres: '/fotoradary/' }
    ]
  }
];

const K_GLOWNA = { slug: 'strona-glowna', marka: '', model: '' };

export default function HomePage() {
  const models = getModelSummaries();
  const filmy = opublikowane().slice(0, 6);
  const vin = pokazModul('vin', K_GLOWNA);
  const sprowadzone = Math.round(udzialSprowadzonych() * 100);
  const sezon = rankingiNaTeraz().teraz.slice(0, 2);

  const grupy = menuGlowne();
  const paliwa = udzialPaliw();
  const top = najpopularniejsze(6);
  const zawyzenie = przykladZawyzenia();
  const dekady = rocznikiDekadami();
  const sumaDekad = dekady.reduce((a, d) => a + d.liczba, 0) || 1;
  const narzedzia = grupy.flatMap((g) => g.pozycje).filter((p) => !['/marki/', '/rankingi/', '/wojewodztwa/', '/metodologia/'].includes(p.adres) && !p.adres.startsWith('/poradniki/'));
  // karty „wszystkie generacje” obejmują cały model – sumujemy tylko je, żeby nie liczyć aut dwa razy
  const lacznie = models.reduce((s, m) => s + (m.wszystkieGeneracje ? m.cepik.liczbaWPolsce : 0), 0);

  return (
    <div className="space-y-16 pb-4">
      {/* Nagłówek ze zdjęciem */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <ZdjecieTla klucz="glowne" priorytet className="opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/55 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold">
              <Database className="w-4 h-4" aria-hidden="true" />
              Dane z państwowej bazy CEPiK
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Wszystko o autach w Polsce <span className="text-rust-400">w jednym miejscu</span>
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed">
              Ile jeździ danego modelu i gdzie, na co uważać przy zakupie, ile kosztuje trasa, gdzie są ładowarki i fotoradary – bez szukania po dziesięciu stronach.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#modele" className="inline-flex items-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-3 rounded-xl">
                <Search className="w-4 h-4" aria-hidden="true" /> Znajdź swój model
              </a>
              <Link href="/asystent-zakupu/" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 font-bold px-5 py-3 rounded-xl">
                Kupujesz auto? <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 pt-3 text-sm text-slate-300">
              <div>
                <dt className="sr-only">Modele w atlasie</dt>
                <dd>
                  <strong className="text-white text-xl tabular-nums">{models.length.toLocaleString('pl-PL')}</strong> kart modeli
                </dd>
              </div>
              {lacznie > 0 && (
                <div>
                  <dt className="sr-only">Zarejestrowane auta</dt>
                  <dd>
                    <strong className="text-white text-xl tabular-nums">{(lacznie / 1e6).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln</strong> rejestracji w bazie CEPiK
                  </dd>
                </div>
              )}
              <div>
                <dt className="sr-only">Województwa</dt>
                <dd>
                  <strong className="text-white text-xl">16</strong> województw na mapie
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Raport VIN (carVertical) – widoczny, gdy w panelu jest link partnerski */}
      {vin && (
        <div className="!-mt-16">
          <SekcjaVinGlowna sprowadzone={sprowadzone} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Co chcesz zrobić? – duże kafelki ze zdjęciami */}
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Co chcesz dziś zrobić?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KAFLE.map((k) => (
              <div key={k.tytul} className="group relative overflow-hidden rounded-3xl bg-slate-800 text-white min-h-[15rem] flex">
                <ZdjecieTla klucz={k.zdjecie} className="opacity-70 group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${k.gradient}`} aria-hidden="true" />
                <div className="relative mt-auto p-6 w-full space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">{k.nadtytul}</span>
                  <h3 className="text-2xl font-extrabold leading-tight">
                    <Link href={k.adres} className="after:absolute after:inset-0">
                      {k.tytul}
                    </Link>
                  </h3>
                  <p className="text-sm text-white/90 max-w-md">{k.opis}</p>
                  <ul className="relative z-10 flex flex-wrap gap-2">
                    {k.linki.map((l) => (
                      <li key={l.adres}>
                        <Link href={l.adres} className="inline-block text-xs font-bold bg-white/15 hover:bg-white/30 backdrop-blur rounded-full px-3 py-1.5">
                          {l.nazwa}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opony */}
        <SekcjaOponGlowna />

        {/* Najnowsze artykuły z filmów */}
        {filmy.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Najnowsze z kanału {site.youtubeChannelName}</h2>
                <p className="text-sm text-slate-500">Film i artykuł z najważniejszymi informacjami, danymi z CEPiK i poradami.</p>
              </div>
              <Link href="/filmy/" className="text-sm font-semibold text-steel-700 dark:text-steel-300 hover:underline flex-shrink-0">
                Wszystkie artykuły →
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filmy.map((w, i) => (
                <li key={w.slug} className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                  <Link
                    href={`/filmy/${w.slug}/`}
                    className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-rust-400 hover:shadow-md transition"
                  >
                    <span className="relative block aspect-video bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${w.youtubeId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition" aria-hidden="true">
                        <PlayCircle className="w-12 h-12 text-white drop-shadow" />
                      </span>
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-900 rounded px-1.5 py-0.5">
                        {NAZWY_KATEGORII[w.kategoria] || 'Artykuł'}
                      </span>
                    </span>
                    <span className="flex-1 p-4 space-y-1">
                      <span className="block text-xs text-slate-500">{formatDate(w.opublikowano)}</span>
                      <span className="block font-bold text-slate-900 dark:text-white leading-snug">{w.tytul}</span>
                      <span className="block text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{w.lead}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Wszystkie narzędzia */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Narzędzia dla kierowcy</h2>
            <span className="text-xs text-slate-500">za darmo, bez rejestracji</span>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {narzedzia.map((p) => (
              <li key={p.adres}>
                <Link href={p.adres} className="flex items-start gap-3 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-steel-400 hover:shadow-md rounded-2xl p-4 transition">
                  <span className="w-10 h-10 flex-shrink-0 rounded-xl bg-steel-50 dark:bg-slate-800 text-steel-600 dark:text-steel-300 flex items-center justify-center">
                    <IkonaMenu ikona={p.ikona} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-sm text-slate-900 dark:text-white">{p.nazwa}</span>
                    <span className="block text-xs text-slate-500">{p.opis}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Porównanie OC/AC + przypomnienie o OC */}
        <SekcjaOcGlowna />

        {/* Najnowszy poradnik (nowy co tydzień) */}
        <SekcjaNajnowszyPoradnik />

        {/* Poradniki: kolizja i wzory dokumentów */}
        <SekcjaPoradnikowGlowna />

        {/* Infografiki: polska motoryzacja w liczbach */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Polskie auta w liczbach</h2>
            <p className="text-sm text-slate-500">
              Na podstawie bazy CEPiK – wszystkie auta z kart modeli w atlasie.{' '}
              <Link href="/metodologia/" className="underline">
                Jak liczymy
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Czym jeżdżą Polacy? Udział paliw</h3>
              <PasekUdzialow dane={paliwa} opis="Udział rodzajów paliwa wśród zarejestrowanych aut" />
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Najpopularniejsze modele w użyciu</h3>
              <SlupkiPoziome
                opis="Modele z największą liczbą aut w użyciu w Polsce"
                dane={top.map((t) => ({ nazwa: t.nazwa, wartosc: t.liczba, etykieta: t.liczba.toLocaleString('pl-PL'), adres: t.adres }))}
              />
              <p className="text-xs text-slate-500">
                Auta, które od 2017 r. zmieniły właściciela, zostały sprowadzone albo kupione w salonie – czyli na pewno jeżdżą.
                {zawyzenie &&
                  ` Samych rejestracji jest więcej, bo w bazie zostają też auta dawno niejeżdżące: ${zawyzenie.nazwa} ma ${zawyzenie.wszystkie.toLocaleString('pl-PL')} rejestracji, a w użyciu ${zawyzenie.aktywne.toLocaleString('pl-PL')}.`}
              </p>
              <Link href="/rankingi/" className="inline-flex items-center gap-1 text-sm font-semibold text-steel-700 dark:text-steel-300 hover:underline">
                Wszystkie rankingi <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Z których lat są auta?</h3>
              <SlupkiPionowe
                opis="Liczba aut według dekady produkcji"
                dane={dekady.map((d) => ({ nazwa: d.nazwa.replace(/^(\d{2})(\d{2})–\d{2}(\d{2})$/, "'$2"), wartosc: d.liczba, etykieta: `${Math.round((d.liczba / sumaDekad) * 100)}%` }))}
              />
              <p className="text-xs text-slate-500">Rok produkcji według dekad (’80 = lata 1980–1989), ze wszystkich rejestracji – starsze roczniki są zawyżone przez auta, których nikt nie wyrejestrował.</p>
            </div>
          </div>
        </section>

      <section id="modele" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Modele w atlasie</h2>
            <p className="text-sm text-slate-500">Kliknij model, aby zobaczyć mapę, statystyki i dane techniczne</p>
          </div>
          <Link href="/metodologia/" className="inline-flex items-center gap-1 text-xs font-semibold text-steel-600 dark:text-steel-400 hover:underline">
            Skąd są dane? <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
        <ModelFilters initialModels={models} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Trophy className="w-5 h-5 text-rust-600" aria-hidden="true" /> Rankingi
          </h2>
          <ul className="space-y-1.5 text-sm">
            {rankingi.map((r) => (
              <li key={r.id}>
                <Link href={`/rankingi/${r.id}/`} className="text-steel-700 dark:text-steel-300 hover:underline">
                  {r.tytul}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <MapPin className="w-5 h-5 text-steel-600" aria-hidden="true" /> Co jeździ w Twoim województwie?
          </h2>
          <div className="flex flex-wrap gap-2">
            {listaWojewodztw.map((w) => (
              <Link
                key={w.teryt}
                href={`/wojewodztwa/${w.slug}/`}
                className="px-2.5 py-1 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-steel-400"
              >
                {w.nazwa}
              </Link>
            ))}
          </div>
        </div>
      </section>


      {sezon.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Polecane na sezon</h2>
            <Link href="/polecane/" className="text-sm font-semibold text-steel-700 dark:text-steel-300 hover:underline flex-shrink-0">
              Wszystkie rankingi →
            </Link>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sezon.map((r) => (
              <li key={r.id}>
                <Link href={`/polecane/${r.id}/`} className="block bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 h-full">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">{NAZWY_SEZONOW[r.sezon]}</span>
                  <span className="block text-lg font-extrabold mt-1">{r.tytul}</span>
                  <span className="block text-sm text-emerald-50 mt-1">{r.opis}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
        <ZdjecieTla klucz="filmy" className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-slate-950/70 to-slate-900/30" aria-hidden="true" />
        <div className="relative p-8 sm:p-12 max-w-xl space-y-4">
          <YouTubeIcon className="w-12 h-12 text-red-500" />
          <h2 className="text-3xl font-extrabold">Zobacz to na filmach</h2>
          <p className="text-slate-200">Na kanale {site.youtubeChannelName} pokazuję auta z tego atlasu z bliska – zalety, usterki i to, na co patrzeć przy zakupie.</p>
          <a
            href={site.youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
          >
            <YouTubeIcon className="w-5 h-5" />
            Przejdź na kanał {site.youtubeChannelName}
          </a>
        </div>
      </section>
        <KodStrony sciezka={'/'} />
      </div>
    </div>
  );
}
