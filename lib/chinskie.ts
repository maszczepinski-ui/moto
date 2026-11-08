// Ranking chińskich samochodów w Polsce.
// AUTOMATYCZNE: liczba rejestracji, pozycje, trendy i nowe modele – liczone przy każdej przebudowie strony
//               z kart modeli (data/models/*.json), które co miesiąc odświeża automat CEPiK.
// RĘCZNE: cena „od”, zdjęcie i ukrycie modelu – w data/chinskie-auta.json (automat CEPiK tego pliku nie dotyka).
import fs from 'fs';
import path from 'path';
import reczne from '@/data/chinskie-auta.json';
import { getAllModels } from '@/lib/models';
import { tlo } from '@/lib/dane';
import { linkUbezpieczenia, panelDane, pokazModul, wypelnij } from '@/lib/panel';

type Reczne = { cenaOd: number | null; zdjecie: string; publikuj: boolean };
const RECZNE = reczne as unknown as { marki: string[]; modele: Record<string, Reczne> };

/** Minimalna liczba rejestracji w roku, żeby model trafił do rankingu */
const MIN_W_ROKU = 10;
export const ZRODLO_RANKINGU = 'ranking-chinskie';

export type Naped = 'benzyna' | 'hybryda' | 'elektryczny';
export const NAZWY_NAPEDOW: Record<Naped, string> = { benzyna: 'Benzyna', hybryda: 'Hybryda', elektryczny: 'Elektryczny' };

export type Trend = { typ: 'awans' | 'spadek' | 'bez-zmian' | 'nowosc'; o: number };

export interface PozycjaRankingu {
  slug: string;
  marka: string;
  markaSlug: string;
  model: string;
  nazwa: string;
  adres: string;
  pozycja: number;
  /** od początku roku */
  ytd: number;
  /** w ostatnim pełnym miesiącu (gdy dane miesięczne są kompletne) */
  miesiac: number | null;
  /** cały poprzedni rok */
  poprzedniRok: number;
  wPolsce: number;
  napedy: { typ: Naped; udzial: number }[];
  trend: Trend;
  cenaOd: number | null;
  zdjecie: string | null;
  linkFinansowanie: string;
  linkOc: string;
}

export interface RankingChinskich {
  stanNa: string;
  rok: number;
  /** np. „październik 2026” – gdy dane miesięczne są kompletne */
  miesiacNazwa: string | null;
  /** trend liczony względem poprzedniego miesiąca (true) albo poprzedniego roku (false) */
  trendMiesieczny: boolean;
  pozycje: PozycjaRankingu[];
  marki: { marka: string; ytd: number; modeli: number }[];
  sumaYtd: number;
}

const istniejePlik = (adres: string) => !!adres && fs.existsSync(path.join(process.cwd(), 'public', adres.replace(/^\//, '')));

function napedy(paliwa: { nazwa: string; liczba: number }[]): { typ: Naped; udzial: number }[] {
  const suma = paliwa.reduce((s, p) => s + p.liczba, 0) || 1;
  const licz = { benzyna: 0, hybryda: 0, elektryczny: 0 };
  for (const p of paliwa) {
    const n = p.nazwa.toLowerCase();
    if (n.startsWith('elektryczny')) licz.elektryczny += p.liczba;
    else if (n.startsWith('hybryda')) licz.hybryda += p.liczba;
    else if (n.startsWith('benzyna') || n.startsWith('diesel')) licz.benzyna += p.liczba;
  }
  return (Object.keys(licz) as Naped[])
    .map((typ) => ({ typ, udzial: licz[typ] / suma }))
    .filter((x) => x.udzial >= 0.1)
    .sort((a, b) => b.udzial - a.udzial);
}

/** Link partnerski z SubID: w szablonie z panelu wpisz {subid} (np. mg-hs) i/lub {zrodlo} (ranking-chinskie) tam, gdzie każe partner */
function zSubId(szablon: string, subid: string) {
  return szablon.replaceAll('{subid}', encodeURIComponent(subid)).replaceAll('{zrodlo}', ZRODLO_RANKINGU);
}

/** Czy dane miesięczne CEPiK za ostatni pełny miesiąc są kompletne (przy uzupełnianiu bywa w nich luka) */
function miesiacKompletny(miesiac: string): boolean {
  const m = tlo.miesiace || [];
  const ten = m.find((x) => x.miesiac === miesiac)?.liczba || 0;
  const wczesniej = m.filter((x) => x.miesiac < miesiac).slice(-12).map((x) => x.liczba);
  const srednia = wczesniej.reduce((s, x) => s + x, 0) / (wczesniej.length || 1);
  return ten > 0.5 * srednia;
}

const nazwaMiesiaca = (m: string) => new Date(m + '-15T12:00:00').toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }).replace(/^(\S+)/, (x) => x);

export function rankingChinskich(): RankingChinskich {
  const stanNa = tlo.stanNa;
  // ostatni pełny miesiąc w danych (stan na koniec miesiąca → ten miesiąc; w trakcie miesiąca → poprzedni)
  const d = new Date(stanNa + 'T12:00:00');
  const koniecMiesiaca = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() === d.getDate();
  const ost = koniecMiesiaca ? new Date(d.getFullYear(), d.getMonth(), 15) : new Date(d.getFullYear(), d.getMonth() - 1, 15);
  const miesiac = `${ost.getFullYear()}-${String(ost.getMonth() + 1).padStart(2, '0')}`;
  const rok = ost.getFullYear();
  const poprzedniMies = (() => {
    const p = new Date(ost.getFullYear(), ost.getMonth() - 1, 15);
    return `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, '0')}`;
  })();
  const miesieczne = miesiacKompletny(miesiac) && miesiacKompletny(poprzedniMies);

  const finansowanie = pokazModul('finansowanie', { slug: ZRODLO_RANKINGU, marka: '', model: '' }) ? panelDane.moduly?.finansowanie?.url || '' : '';

  const surowe = getAllModels()
    .filter((m) => RECZNE.marki.includes(m.markaSlug) && m.wszystkieGeneracje && RECZNE.modele[m.slug]?.publikuj !== false)
    .map((m) => {
      const lata = new Map((m.cepik.pierwszeRejestracje || []).map((x) => [x.rok, x.liczba]));
      const mies = new Map((m.cepik.rejestracjeMiesiecznie || []).map((x) => [x.miesiac, x.liczba]));
      const ytdDoPoprzedniego = [...mies].filter(([k]) => k.startsWith(String(rok)) && k <= poprzedniMies).reduce((s, [, v]) => s + v, 0);
      const r = RECZNE.modele[m.slug];
      const k = { slug: `${ZRODLO_RANKINGU}-${m.slug}`, marka: m.marka, model: m.model };
      return {
        m,
        ytd: lata.get(rok) || 0,
        poprzedniRok: lata.get(rok - 1) || 0,
        miesiac: miesieczne ? mies.get(miesiac) || 0 : null,
        ytdDoPoprzedniego,
        r,
        linkFinansowanie: finansowanie ? zSubId(wypelnij(finansowanie, k), m.slug) : '',
        linkOc: pokazModul('ubezpieczenia', k) ? linkUbezpieczenia('oc', k) : ''
      };
    })
    .filter((x) => x.ytd >= MIN_W_ROKU)
    .sort((a, b) => b.ytd - a.ytd);

  // pozycja do porównania: koniec poprzedniego miesiąca (gdy są dane miesięczne) albo cały poprzedni rok
  const wartoscPorownania = (x: (typeof surowe)[number]) => (miesieczne ? x.ytdDoPoprzedniego : x.poprzedniRok);
  const poprzednie = [...surowe].filter((x) => wartoscPorownania(x) > 0).sort((a, b) => wartoscPorownania(b) - wartoscPorownania(a));
  const pozPoprzednia = new Map(poprzednie.map((x, i) => [x.m.slug, i + 1]));

  const pozycje: PozycjaRankingu[] = surowe.map((x, i) => {
    const pop = pozPoprzednia.get(x.m.slug);
    const trend: Trend = !pop ? { typ: 'nowosc', o: 0 } : pop > i + 1 ? { typ: 'awans', o: pop - (i + 1) } : pop < i + 1 ? { typ: 'spadek', o: i + 1 - pop } : { typ: 'bez-zmian', o: 0 };
    return {
      slug: x.m.slug,
      marka: x.m.marka,
      markaSlug: x.m.markaSlug,
      model: x.m.model,
      nazwa: `${x.m.marka} ${x.m.model}`,
      adres: x.m.adres,
      pozycja: i + 1,
      ytd: x.ytd,
      miesiac: x.miesiac,
      poprzedniRok: x.poprzedniRok,
      wPolsce: x.m.cepik.liczbaWPolsce,
      napedy: napedy(x.m.cepik.paliwa || []),
      trend,
      cenaOd: x.r?.cenaOd ?? null,
      zdjecie: x.r?.zdjecie && istniejePlik(x.r.zdjecie) ? x.r.zdjecie : null,
      linkFinansowanie: x.linkFinansowanie,
      linkOc: x.linkOc
    };
  });

  const markiMapa = new Map<string, { marka: string; ytd: number; modeli: number }>();
  for (const p of pozycje) {
    const z = markiMapa.get(p.markaSlug) || { marka: p.marka, ytd: 0, modeli: 0 };
    z.ytd += p.ytd;
    z.modeli += 1;
    markiMapa.set(p.markaSlug, z);
  }

  return {
    stanNa,
    rok,
    miesiacNazwa: miesieczne ? nazwaMiesiaca(miesiac) : null,
    trendMiesieczny: miesieczne,
    pozycje,
    marki: [...markiMapa.values()].sort((a, b) => b.ytd - a.ytd),
    sumaYtd: pozycje.reduce((s, p) => s + p.ytd, 0)
  };
}
