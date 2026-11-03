import { Metadata } from 'next';
import { CarModel, RefKarty } from '@/types/car-model';
import { getAllModels, getModelBySlug } from '@/lib/models';
import { filmyDlaModelu, youtubeId, KontekstKarty, pokazModul, cenyPaliw } from '@/lib/panel';
import { opisZatwierdzony, Markdown } from '@/lib/opisy';
import { zajawkaRynkowa, profilKierowcy, faq, nazwaKarty, najwiecej } from '@/lib/opis';
import { site } from '@/config/site';
import { fmt, sztuk, formatDate, NADWOZIE_NAZWY } from '@/lib/format';
import { slugWojewodztwa, nazwaWojewodztwa } from '@/lib/wojewodztwa';
import PolandMap from '@/components/PolandMap';
import CarBlueprint from '@/components/CarBlueprint';
import BarList from '@/components/BarList';
import YearChart from '@/components/YearChart';
import EngineTable from '@/components/EngineTable';
import YouTubeLazyEmbed from '@/components/YouTubeLazyEmbed';
import InspectionChecklist from '@/components/InspectionChecklist';
import Okruszki from '@/components/Okruszki';
import Monetyzacja, { ustawieniaReklamy, SkrotNarzedzi, DolnyPasek, pasekKarty } from '@/components/Monetyzacja';
import AdSlot from '@/components/AdSlot';
import KodStrony from '@/components/KodStrony';
import { paryDlaKarty } from '@/lib/porownania';
import { wpisyDlaKarty } from '@/lib/wpisy';
import { uwagaUzupelnianie } from '@/lib/dane';
import { kodyDlaKarty } from '@/lib/kody-bledow';
import KalkulatorTCO, { RodzajNapedu } from '@/components/KalkulatorTCO';
import RaportySpalania from '@/components/RaportySpalania';
import KalkulatorTrasy from '@/components/KalkulatorTrasy';
import { Calendar, Film, FlaskConical, MapPin, Gauge, Ruler, Info, Wrench, Users, HelpCircle, ArrowLeft, ArrowRight, Swords, Cog, Layers } from 'lucide-react';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

const PALIWO_SCHEMA: Record<string, string> = {
  Benzyna: 'Gasoline',
  Diesel: 'Diesel',
  'Benzyna + LPG': 'LPG',
  Elektryczny: 'Electricity',
  'Hybryda (benzyna + elektryczny)': 'Hybrid',
  'Hybryda (diesel + elektryczny)': 'Hybrid'
};

/** Tytuł i opis pod wyszukiwania typu „ile jest X w Polsce”, „X dane techniczne” */
export function metadaneKarty(m: CarModel): Metadata {
  const name = nazwaKarty(m);
  const c = m.cepik;
  const silniki = m.silniki?.length ? `, silniki ${[...new Set(m.silniki.map((s) => s.nazwa))].slice(0, 4).join(', ')}` : '';
  const pal = c.paliwa.find((p) => p.nazwa !== 'Inne / brak danych');
  return {
    title: `${name} – dane techniczne, rejestracje w Polsce, opinie`,
    description: `${name}${m.lataProdukcji ? ` (${m.lataProdukcji})` : ''}: ${fmt(c.liczbaWPolsce)} ${sztuk(c.liczbaWPolsce)} zarejestrowanych w Polsce wg CEPiK${
      pal ? `, najczęściej ${pal.nazwa.toLowerCase()}` : ''
    }${silniki}. Mapa województw, roczniki, wymiary.`,
    alternates: { canonical: m.adres },
    openGraph: {
      title: `${name} – ile ich jeździ w Polsce i gdzie`,
      description: `${fmt(c.liczbaWPolsce)} ${sztuk(c.liczbaWPolsce)} w Polsce. Mapa województw, roczniki, silniki i dane techniczne.`,
      type: 'article',
      url: m.adres
    }
  };
}

function Naglowek({ ikona, children }: { ikona: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
      {ikona}
      {children}
    </h2>
  );
}

function ListaLinkow({ tytul, ikona, linki }: { tytul: string; ikona: React.ReactNode; linki: (RefKarty & { opis?: string })[] }) {
  if (!linki.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
        {ikona}
        {tytul}
      </h3>
      <ul className="space-y-1.5 text-sm">
        {linki.map((l) => (
          <li key={l.slug}>
            <a href={l.adres} className="font-semibold text-steel-700 dark:text-steel-300 hover:underline">
              {l.nazwa}
            </a>
            {(l.lata || l.opis) && <span className="text-slate-500"> – {l.opis || l.lata}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

const badge = {
  drobna: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  średnia: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  kosztowna: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
} as const;

/** Inne generacje (z innych modeli), w których był ten sam silnik: pojemność + moc + paliwo */
function tenSamSilnik(m: CarModel): (RefKarty & { opis: string })[] {
  if (!m.silniki?.length) return [];
  const klucze = new Map(m.silniki.map((s) => [`${s.pojemnoscCm3}|${s.mocKm}|${s.paliwo}`, s.nazwa]));
  const wynik: (RefKarty & { opis: string })[] = [];
  for (const x of getAllModels()) {
    if (x.slug === m.slug || !x.silniki?.length || (x.markaSlug === m.markaSlug && x.modelSlug === m.modelSlug)) continue;
    const wspolne = [...new Set(x.silniki.filter((s) => klucze.has(`${s.pojemnoscCm3}|${s.mocKm}|${s.paliwo}`)).map((s) => `${s.nazwa} ${s.mocKm} KM`))];
    if (wspolne.length) wynik.push({ slug: x.slug, nazwa: nazwaKarty(x), adres: x.adres, opis: wspolne.slice(0, 3).join(', ') });
  }
  return wynik.slice(0, 8);
}

export const PREMIUM = new Set(['Audi', 'BMW', 'Mercedes-Benz', 'Lexus', 'Volvo', 'Porsche', 'Jaguar', 'Land Rover', 'Infiniti', 'Tesla', 'Maserati', 'Alfa Romeo']);

/** Najczęstszy napęd i pojemność – punkt startowy kalkulatora kosztów */
export function profilNapedu(m: CarModel): { naped: RodzajNapedu; pojemnosc: number } {
  const p = m.cepik.paliwa.find((x) => x.nazwa !== 'Inne / brak danych')?.nazwa || 'Benzyna';
  const naped: RodzajNapedu = p.startsWith('Elektr') ? 'elektryczny' : p.startsWith('Hybryda') ? 'hybryda' : p.includes('LPG') ? 'lpg' : p.startsWith('Diesel') ? 'diesel' : 'benzyna';
  const poj = Number((m.cepik.pojemnosci.find((x) => /\d/.test(x.nazwa))?.nazwa || '1,6').replace(',', '.').replace(/[^\d.]/g, '')) || 1.6;
  return { naped, pojemnosc: poj };
}

export default function KartaModelu({ m }: { m: CarModel }) {
  const name = nazwaKarty(m);
  const c = m.cepik;
  const rodzic = m.rodzic ? getModelBySlug(m.rodzic) : undefined;
  const k: KontekstKarty = { slug: m.slug, marka: m.marka, model: m.model, generacja: m.generacja, sredniRocznik: c.sredniRocznik, liczba: c.liczbaWPolsce };
  const top = najwiecej(m);
  const opisAI = opisZatwierdzony(m.slug);
  const zajawka = zajawkaRynkowa(m);
  const profil = profilKierowcy(m);
  const pytania = faq(m, pokazModul('ubezpieczenia', k));
  const silnikiWspolne = tenSamSilnik(m);
  const kody = [m.slug, ...(m.generacjeLista || []).map((g) => g.slug)]
    .flatMap((s) => kodyDlaKarty(s, m.rodzic))
    .filter((x, i, arr) => arr.findIndex((y) => y.kod.kod === x.kod.kod) === i);
  const porownania = paryDlaKarty(m.slug).map((p) => {
    const inny = p.a.slug === m.slug ? p.b : p.a;
    return { slug: p.id, nazwa: `${name} czy ${nazwaKarty(inny)}?`, adres: `/porownaj/${p.id}/` };
  });
  const inneWMarce = getAllModels()
    .filter((x) => x.wszystkieGeneracje && x.markaSlug === m.markaSlug && x.modelSlug !== m.modelSlug)
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce)
    .slice(0, 8)
    .map((x) => ({ slug: x.slug, nazwa: nazwaKarty(x), adres: x.adres, opis: `${fmt(x.cepik.liczbaWPolsce)} szt.` }));
  const generacje = m.wszystkieGeneracje ? m.generacjeLista || [] : rodzic ? [{ slug: rodzic.slug, nazwa: `${rodzic.model} – wszystkie generacje`, adres: rodzic.adres }, ...(rodzic.generacjeLista || []).filter((g) => g.slug !== m.slug)] : [];

  const filmy: (ReturnType<typeof filmyDlaModelu>[number] & { artykul?: string })[] = filmyDlaModelu(m.slug);
  if (filmy.length === 0 && youtubeId(m.youtubeId)) {
    filmy.push({ slug: m.slug, youtube: m.youtubeId, id: youtubeId(m.youtubeId), tytul: `${name} – film na kanale ${site.youtubeChannelName}`, data: m.dataAktualizacji });
  }
  // artykuły do filmów, w których pojawia się ten model (albo jego generacje / karta zbiorcza)
  for (const w of wpisyDlaKarty([m.slug, ...(m.rodzic ? [m.rodzic] : []), ...(m.generacjeLista || []).map((g) => g.slug)])) {
    const f = filmy.find((x) => x.id === w.youtubeId);
    if (f) f.artykul = `/filmy/${w.slug}/`;
    else filmy.push({ slug: m.slug, youtube: w.youtubeId, id: w.youtubeId, tytul: w.tytul, data: w.opublikowano, opis: w.lead, artykul: `/filmy/${w.slug}/` });
  }
  const reklamaGora = ustawieniaReklamy('slotGora', k);
  const reklamaSpec = ustawieniaReklamy('slotSpec', k);
  const reklamaDol = ustawieniaReklamy('slotDol', k);

  const pageUrl = `${site.url}${m.adres}`;
  const okruszki = [
    { nazwa: 'Marki', adres: '/marki/' },
    { nazwa: m.marka, adres: `/marki/${m.markaSlug}/` },
    ...(m.wszystkieGeneracje ? [{ nazwa: m.model, adres: m.adres }] : [
      ...(rodzic ? [{ nazwa: m.model, adres: rodzic.adres }] : []),
      { nazwa: m.generacja, adres: m.adres }
    ])
  ];
  const pal = c.paliwa.find((p) => p.nazwa !== 'Inne / brak danych');
  const lata = (m.lataProdukcji.match(/\d{4}/g) || []) as string[];
  const silnikGlowny = m.silniki?.[0];
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Car',
      name,
      url: pageUrl,
      manufacturer: { '@type': 'Organization', name: m.marka },
      brand: { '@type': 'Brand', name: m.marka },
      model: `${m.model} ${m.generacja}`.trim(),
      ...(lata[0] ? { productionDate: lata[0] } : {}),
      ...(m.nadwozia[0] ? { bodyType: NADWOZIE_NAZWY[m.nadwozia[0]] } : {}),
      ...(pal && PALIWO_SCHEMA[pal.nazwa] ? { fuelType: PALIWO_SCHEMA[pal.nazwa] } : {}),
      ...(silnikGlowny
        ? { vehicleEngine: { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: silnikGlowny.pojemnoscCm3, unitCode: 'CMQ' } } }
        : {}),
      vehicleConfiguration: m.nadwozia.map((n) => NADWOZIE_NAZWY[n]).join(', '),
      ...(m.wymiary
        ? {
            height: { '@type': 'QuantitativeValue', value: m.wymiary.wysokoscMm, unitCode: 'MMT' },
            width: { '@type': 'QuantitativeValue', value: m.wymiary.szerokoscMm, unitCode: 'MMT' },
            depth: { '@type': 'QuantitativeValue', value: m.wymiary.dlugoscMm, unitCode: 'MMT' },
            wheelbase: { '@type': 'QuantitativeValue', value: m.wymiary.rozstawOsiMm, unitCode: 'MMT' }
          }
        : {}),
      description: m.opisModelu || zajawka.join(' ')
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pytania.map((p) => ({ '@type': 'Question', name: p.pytanie, acceptedAnswer: { '@type': 'Answer', text: p.odpowiedz } }))
    },
    ...filmy.map((f) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: f.tytul,
      description: f.opis || `${f.tytul}. Film na kanale ${site.youtubeChannelName}.`,
      thumbnailUrl: [`https://i.ytimg.com/vi/${f.id}/hqdefault.jpg`],
      uploadDate: f.data,
      contentUrl: `https://www.youtube.com/watch?v=${f.id}`,
      embedUrl: `https://www.youtube.com/embed/${f.id}`
    }))
  ];

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 space-y-14">
      <div className="space-y-6">
        <Okruszki sciezka={okruszki} />

        {m.daneTestowe && (
          <div role="note" className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
            <FlaskConical className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Wersja robocza.</strong> Liczby na tej stronie są przykładowe, a dane techniczne czekają na weryfikację.
            </div>
          </div>
        )}

        {/* Nagłówek */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-3">
            <a href={`/marki/${m.markaSlug}/`} className="text-sm font-bold text-steel-600 dark:text-steel-400 uppercase tracking-widest hover:underline">
              {m.marka}
            </a>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {m.model} <span className="font-normal text-slate-500">{m.generacja}</span>
            </h1>
            <p className="text-sm text-slate-500">
              {m.wszystkieGeneracje ? `Wszystkie generacje • roczniki ${m.lataProdukcji}` : m.lataProdukcji} • {m.nadwozia.map((n) => NADWOZIE_NAZWY[n]).join(', ')}
            </p>
            {m.opisModelu && <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{m.opisModelu}</p>}
            {/* Zajawka rynkowa – zdania składane z danych CEPiK */}
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{zajawka.join(' ')}</p>
            {generacje.length > 0 && (
              <p className="text-sm">
                {m.wszystkieGeneracje ? 'Osobne karty generacji: ' : 'Zobacz też: '}
                {generacje.map((g, i) => (
                  <span key={g.slug}>
                    {i > 0 && ', '}
                    <a href={g.adres} className="font-semibold text-steel-600 dark:text-steel-400 hover:underline">
                      {g.nazwa.replace(`${m.marka} `, '')}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="bg-steel-700 text-white rounded-2xl p-5 shadow-md">
            <div className="text-xs uppercase tracking-wider text-steel-100">Zarejestrowanych w Polsce</div>
            <div className="text-4xl font-black tabular-nums mt-1">{fmt(c.liczbaWPolsce)}</div>
            <div className="text-xs text-steel-100 mt-1">stan na {formatDate(c.stanNa)} • CEPiK</div>
            {c.aktywne !== undefined && (
              <div className="text-xs text-steel-50 mt-3 border-t border-white/20 pt-3">
                <strong className="text-base">{fmt(c.aktywne)}</strong> z nich to auta z niedawną rejestracją – od 2017 r. zmieniły właściciela, zostały sprowadzone albo kupione w salonie, więc na pewno były w użyciu
              </div>
            )}
            {!!c.noweOdPaczki && (
              <div className="text-xs text-steel-50 mt-3 border-t border-white/20 pt-3">
                <strong className="text-base">{fmt(c.noweOdPaczki)}</strong> zarejestrowano w Polsce po raz pierwszy od listopada 2019 r.
                {uwagaUzupelnianie() && <span className="block mt-1 text-steel-100">{uwagaUzupelnianie()}</span>}
              </div>
            )}
            {(c.hybrydy ?? 0) + (c.elektryczne ?? 0) >= Math.max(1, c.liczbaWPolsce * 0.01) && (
              <div className="text-xs text-steel-50 mt-3 border-t border-white/20 pt-3">
                {!!c.hybrydy && (
                  <>
                    <strong className="text-base">{fmt(c.hybrydy)}</strong> hybryd
                  </>
                )}
                {!!c.hybrydy && !!c.elektryczne && ' • '}
                {!!c.elektryczne && (
                  <>
                    <strong className="text-base">{fmt(c.elektryczne)}</strong> elektrycznych
                  </>
                )}
              </div>
            )}
            {top && (
              <div className="text-xs text-steel-50 mt-3 border-t border-white/20 pt-3">
                Najwięcej aut:{' '}
                <a href={`/wojewodztwa/${slugWojewodztwa(top.teryt)}/`} className="font-bold underline decoration-white/40">
                  {nazwaWojewodztwa(top.teryt).toLowerCase()}
                </a>{' '}
                ({fmt(top.liczba)})
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Szybkie narzędzia: asystent zakupu, VIN, OC/AC, części */}
      <SkrotNarzedzi k={k} adresZakupu={`${m.adres}zakup/`} />

      {reklamaGora && <AdSlot {...reklamaGora} className="hidden md:block" wysokosc={250} />}

      {/* Dane techniczne */}
      {(m.wymiary || (m.silniki && m.silniki.length > 0)) && (
        <section className="space-y-6">
          {m.wymiary && (
            <div className="space-y-4">
              <Naglowek ikona={<Ruler className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Wymiary</Naglowek>
              <CarBlueprint nadwozie={m.nadwozia[0]} wymiary={m.wymiary} podpis={name} />
              <dl className={`grid grid-cols-2 gap-3 text-sm ${m.wymiary.bagaznik ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}>
                {[
                  ['Długość', `${fmt(m.wymiary.dlugoscMm)} mm`],
                  ['Szerokość', `${fmt(m.wymiary.szerokoscMm)} mm`],
                  ['Wysokość', `${fmt(m.wymiary.wysokoscMm)} mm`],
                  ['Rozstaw osi', `${fmt(m.wymiary.rozstawOsiMm)} mm`],
                  ['Bagażnik', m.wymiary.bagaznik ?? '']
                ]
                  .filter(([, v]) => v)
                  .map(([kl, v]) => (
                    <div key={kl} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                      <dt className="text-xs text-slate-500">{kl}</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
          {reklamaSpec && <AdSlot {...reklamaSpec} wysokosc={250} />}
          {m.silniki && m.silniki.length > 0 && (
            <div className="space-y-4">
              <Naglowek ikona={<Gauge className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Silniki</Naglowek>
              <EngineTable silniki={m.silniki} />
            </div>
          )}
        </section>
      )}

      {/* Eksploatacja i usterki */}
      {(opisAI || (m.usterki && m.usterki.length > 0)) && (
        <section className="space-y-4">
          <Naglowek ikona={<Wrench className="w-6 h-6 text-rust-600" aria-hidden="true" />}>Eksploatacja i typowe usterki</Naglowek>
          {opisAI && <Markdown tekst={opisAI.eksploatacja} />}
          {m.usterki && m.usterki.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {m.usterki.map((u, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">{u.tytul}</h3>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge[u.powaga]}`}>{u.powaga}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{u.opis}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {kody.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Najczęstsze kody błędów – objawy i przyczyny</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {kody.map(({ kod, uwaga }) => (
              <li key={kod.kod}>
                <a href={`/kody-bledow/${kod.kod.toLowerCase()}/`} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 hover:border-steel-400">
                  <strong className="font-mono text-rust-600">{kod.kod}</strong> <span className="text-sm text-slate-800 dark:text-slate-200">{kod.nazwa}</span>
                  <span className="block text-xs text-slate-500">{uwaga}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.listaKontrolna && m.listaKontrolna.length > 0 && (
        <section>
          <InspectionChecklist modelSlug={m.slug} items={m.listaKontrolna} />
        </section>
      )}

      {/* Narzędzia partnerskie: VIN, OC/AC, części (kolejność i widoczność z panelu admina) */}
      <Monetyzacja k={k} silniki={[...new Set((m.silniki || []).map((x) => x.nazwa))]} />

      {/* Profil kierowcy i koszty */}
      {(profil.length > 0 || opisAI) && (
        <section className="space-y-4">
          <Naglowek ikona={<Users className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Dla kogo i ile kosztuje utrzymanie</Naglowek>
          {profil.length > 0 && (
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
              {profil.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          )}
          {opisAI && <Markdown tekst={opisAI.koszty} />}
          {opisAI && (
            <div className="bg-steel-50 dark:bg-slate-900 border border-steel-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Podsumowanie</h3>
              <Markdown tekst={opisAI.podsumowanie} />
            </div>
          )}
        </section>
      )}

      {/* Kalkulator kosztów utrzymania */}
      <KalkulatorTCO nazwa={name} {...profilNapedu(m)} premium={PREMIUM.has(m.marka)} />

      {/* Koszt przejazdu tym autem (spalanie z raportów kierowców, gdy są) */}
      <KalkulatorTrasy ceny={cenyPaliw()} auto={{ slug: m.slug, nazwa: name, ...profilNapedu(m) }} />

      {/* Realne spalanie od kierowców (pokazuje się po podłączeniu bazy danych) */}
      <RaportySpalania
        karta={m.slug}
        nazwa={name}
        elektryczny={profilNapedu(m).naped === 'elektryczny'}
        wersje={[...new Set((m.silniki || []).map((s) => `${s.nazwa} ${s.mocKm} KM`))]}
      />

      {/* Mapa */}
      <section className="space-y-4">
        <Naglowek ikona={<MapPin className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Gdzie jeżdżą w Polsce</Naglowek>
        <p className="text-sm text-slate-500 -mt-2">
          Województwo to miejsce rejestracji auta. Przełącz mapę, żeby zobaczyć samą liczbę aut albo to, gdzie model jest popularniejszy niż średnio.
        </p>
        <PolandMap dane={c.wojewodztwa} nazwaModelu={name} />
      </section>

      {/* Statystyki */}
      <section className="space-y-4">
        <Naglowek ikona={<Info className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Co jeździ po polskich drogach</Naglowek>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <YearChart dane={c.roczniki} />
          </div>
          <BarList tytul="Pojemność silnika" opis="Zarejestrowane auta według pojemności" dane={c.pojemnosci} />
          <BarList tytul="Paliwo" opis="Rodzaj paliwa wpisany w dowodzie rejestracyjnym" dane={c.paliwa} kolor="rust" />
          <BarList tytul="Skąd przyszło auto" opis="Pochodzenie wpisane przy rejestracji: auto kupione w Polsce czy sprowadzone z zagranicy" dane={c.pochodzenie} />
          {c.nadwozia && c.nadwozia.length > 0 && <BarList tytul="Nadwozie" opis="Typ nadwozia wpisany w dowodzie rejestracyjnym" dane={c.nadwozia} kolor="rust" />}
          {c.pierwszeRejestracje && c.pierwszeRejestracje.reduce((s, x) => s + x.liczba, 0) >= 20 && (
            <BarList
              tytul="Nowe w polskiej rejestracji"
              opis="Ile aut tego modelu zarejestrowano w Polsce po raz pierwszy w danym roku (nowe z salonu i sprowadzone)"
              dane={c.pierwszeRejestracje.map((x) => ({
                nazwa: x.rok === 2019 ? '2019 (od 9 listopada)' : String(x.rok) === c.stanNa.slice(0, 4) ? `${x.rok} (do ${formatDate(c.stanNa)})` : String(x.rok),
                liczba: x.liczba
              }))}
            />
          )}
          {c.topPowiaty && c.topPowiaty.length > 0 && <BarList tytul="Powiaty z największą liczbą aut" opis="Top 10 powiatów" dane={c.topPowiaty} kolor="rust" />}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Jak liczyliśmy:</strong> {c.jakLiczone}
          {c.bezWojewodztwa ? ` Na mapie pominięto ${fmt(c.bezWojewodztwa)} ${sztuk(c.bezWojewodztwa)} bez przypisanego województwa.` : ''}
        </p>
      </section>

      {/* Film */}
      <section className="space-y-4">
        <Naglowek ikona={<Film className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>
          {filmy.length > 1 ? 'Filmy o tym modelu' : 'Film o tym modelu'}
        </Naglowek>
        {filmy.length === 0 && <YouTubeLazyEmbed videoId="" title={name} />}
        {filmy.map((f, i) => (
          <div key={`${f.id}-${i}`} className="space-y-2">
            {i === 0 ? <YouTubeLazyEmbed videoId={f.id} title={f.tytul} /> : null}
            <p className="text-sm">
              <a href={`https://www.youtube.com/watch?v=${f.id}`} target="_blank" rel="noopener" className="font-semibold text-red-600 hover:underline">
                {i === 0 ? `Obejrzyj na YouTube: ${f.tytul}` : `▶ ${f.tytul}`}
              </a>
              <span className="text-slate-500">
                {' '}
                • {site.youtubeChannelName} • {formatDate(f.data)}
              </span>
              {f.artykul && (
                <a href={f.artykul} className="ml-2 font-semibold text-steel-700 dark:text-steel-300 hover:underline">
                  Przeczytaj artykuł →
                </a>
              )}
            </p>
          </div>
        ))}
      </section>


      {/* FAQ */}
      <section className="space-y-4">
        <Naglowek ikona={<HelpCircle className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Najczęstsze pytania</Naglowek>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          {pytania.map((p) => (
            <details key={p.pytanie} className="group p-4">
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white list-none flex justify-between gap-3">
                {p.pytanie}
                <span className="text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.odpowiedz}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Linkowanie wewnętrzne */}
      <section className="space-y-4">
        <Naglowek ikona={<Layers className="w-6 h-6 text-steel-600 dark:text-steel-400" aria-hidden="true" />}>Zobacz też</Naglowek>
        {(m.poprzednik || m.nastepca) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {m.poprzednik && (
              <a href={m.poprzednik.adres} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-steel-400">
                <ArrowLeft className="w-5 h-5 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="block text-xs text-slate-500">Poprzednia generacja</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{m.poprzednik.nazwa}</span>
                </span>
              </a>
            )}
            {m.nastepca && (
              <a href={m.nastepca.adres} className="flex items-center justify-end gap-3 text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-steel-400 sm:col-start-2">
                <span>
                  <span className="block text-xs text-slate-500">Następna generacja</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{m.nastepca.nazwa}</span>
                </span>
                <ArrowRight className="w-5 h-5 text-slate-400" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListaLinkow tytul="Konkurenci w klasie" ikona={<Swords className="w-4 h-4 text-rust-600" aria-hidden="true" />} linki={m.konkurenci || []} />
          <ListaLinkow tytul="Ten sam silnik w innych autach" ikona={<Cog className="w-4 h-4 text-steel-600" aria-hidden="true" />} linki={silnikiWspolne} />
          <ListaLinkow tytul="Porównaj" ikona={<Swords className="w-4 h-4 text-steel-600" aria-hidden="true" />} linki={porownania.slice(0, 8)} />
          <ListaLinkow tytul={`Inne modele ${m.marka}`} ikona={<Layers className="w-4 h-4 text-steel-600" aria-hidden="true" />} linki={inneWMarce} />
        </div>
      </section>

      {reklamaDol && <AdSlot {...reklamaDol} />}

      {/* Źródła */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>
            Strona zaktualizowana: <strong>{formatDate(m.dataAktualizacji)}</strong> • dane CEPiK: stan na {formatDate(c.stanNa)} ({fmt(c.liczbaWPolsce)} {sztuk(c.liczbaWPolsce)})
          </span>
        </div>
        <div>
          <span className="font-semibold block mb-1">Źródła:</span>
          <ul className="list-disc list-inside space-y-0.5">
            {m.zrodla.map((z, i) => (
              <li key={i}>{z}</li>
            ))}
            {opisAI && <li>Opis eksploatacji: redakcja {site.name} na podstawie danych technicznych i CEPiK ({formatDate(opisAI.wygenerowano)})</li>}
          </ul>
        </div>
      </footer>
      <KodStrony sciezka={m.adres} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
      <DolnyPasek elementy={pasekKarty(k, `${m.adres}zakup/`)} />
    </article>
  );
}
