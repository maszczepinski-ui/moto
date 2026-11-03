// Dane edytowane w panelu admina (/admin). Plik: data/panel.json
// Wszystko, co tu jest, można zmienić w panelu bez dotykania kodu.
import panel from '@/data/panel.json';

export interface Film {
  /** slug karty modelu, np. "bmw-seria-3-e36" */
  slug: string;
  /** link do filmu na YouTube (dowolna postać) */
  youtube: string;
  tytul: string;
  /** data publikacji filmu, RRRR-MM-DD */
  data: string;
  opis?: string;
}

export type ModulId = 'vin' | 'ubezpieczenia' | 'czesci' | 'adsense' | 'ogledziny' | 'finansowanie';

export interface Regula {
  /** którego modułu dotyczy wykluczenie */
  modul: ModulId;
  /** slug – konkretne karty; marka – nazwy marek; rocznikOd – ukryj, gdy średni rocznik jest taki lub nowszy;
   *  minAut – ukryj na kartach z mniejszą liczbą aut (mały ruch) */
  typ: 'slug' | 'marka' | 'rocznikOd' | 'minAut';
  wartosc: string;
}

export interface KodStrony {
  /** adres podstrony, np. "/marki/volkswagen/golf/" */
  sciezka: string;
  head: string;
  body: string;
}

export interface PanelDane {
  /** stare pola (wersja 1 panelu) – nadal działają, jeśli nowe są puste */
  linki: { vin: string; oc: string; ac: string; nnw: string };
  filmy: Film[];
  moduly?: {
    /** kod / rabat – opcjonalnie, pokazywane przy polu VIN (np. kod rabatowy carVertical) */
    vin?: { wlaczony: boolean; partner: string; url: string; kod?: string; rabat?: string };
    ubezpieczenia?: { wlaczony: boolean; siec: string; oc: string; ac: string; nnw: string };
    czesci?: { wlaczony: boolean; allegro: string; ceneo: string; frazy: string };
    adsense?: { wlaczony: boolean; klient: string; slotGora: string; slotSpec: string; slotDol: string };
    /** asystent zakupu: oględziny auta przed zakupem */
    ogledziny?: { wlaczony: boolean; partner: string; url: string };
    /** asystent zakupu: kredyt / leasing */
    finansowanie?: { wlaczony: boolean; partner: string; url: string };
    /** sklep z oponami: link ogólny + opcjonalnie osobne do opon zimowych i letnich */
    opony?: { wlaczony: boolean; partner: string; url: string; zimowe?: string; letnie?: string };
  };
  /** kolejność boksów na karcie modelu */
  kolejnosc?: ModulId[];
  /** wykluczenia: gdzie danego modułu NIE pokazywać */
  reguly?: Regula[];
  kody?: { head: string; body: string; strony: KodStrony[] };
  seo?: { gsc: string; adsTxt: string; ga4: string };
  /** slugi kart, których opisy (szkice z data/opisy) zostały przejrzane i zatwierdzone */
  opisyZatwierdzone?: string[];
  /** ceny paliw i prądu do kalkulatorów (zł/l, prąd zł/kWh); data – kiedy je wpisano */
  ceny?: Partial<CenyPaliw>;
  /** logo w nagłówku i wersja ikon (zmieniane w panelu: zakładka „Logo i ikona”) */
  marka?: { logo?: string; logoCiemne?: string; logoTryb?: 'obok' | 'zamiast'; ikonaWersja?: string };
}

export interface CenyPaliw {
  pb95: number;
  on: number;
  lpg: number;
  prad: number;
  data: string;
}

const CENY_DOMYSLNE: CenyPaliw = { pb95: 6.45, on: 8.09, lpg: 3.69, prad: 1.2, data: '2026-11-02' };

export const panelDane = panel as unknown as PanelDane;

/** Ceny paliw do kalkulatorów – z panelu admina, a gdy pola są puste: wartości domyślne */
export function cenyPaliw(): CenyPaliw {
  const c = panelDane.ceny || {};
  const liczba = (x: unknown, d: number) => (typeof x === 'number' && x > 0 ? x : d);
  return {
    pb95: liczba(c.pb95, CENY_DOMYSLNE.pb95),
    on: liczba(c.on, CENY_DOMYSLNE.on),
    lpg: liczba(c.lpg, CENY_DOMYSLNE.lpg),
    prad: liczba(c.prad, CENY_DOMYSLNE.prad),
    data: c.data || CENY_DOMYSLNE.data
  };
}

/** Wyciąga numer filmu z linku YouTube (watch?v=, youtu.be/, shorts/, embed/, live/) */
export function youtubeId(link: string): string {
  const s = (link || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : '';
}

export function filmyDlaModelu(slug: string): (Film & { id: string })[] {
  return panelDane.filmy
    .filter((f) => f.slug === slug)
    .map((f) => ({ ...f, id: youtubeId(f.youtube) }))
    .filter((f) => f.id);
}

/** Dane karty potrzebne do linków i reguł */
export interface KontekstKarty {
  slug: string;
  marka: string;
  model: string;
  generacja?: string;
  sredniRocznik?: number | null;
  liczba?: number;
}

/**
 * Wstawia dane karty do szablonu linku partnerskiego:
 * {marka} → np. Volkswagen, {model} → np. Golf IV, {slug} → np. volkswagen-golf-iv, {fraza} → fraza wyszukiwania (części).
 * {vin} zostaje w linku – wstawia go pole VIN na stronie.
 */
export function wypelnij(szablon: string, k: KontekstKarty, fraza = ''): string {
  const s = (szablon || '').trim();
  if (!s) return '';
  const model = `${k.model} ${k.generacja || ''}`.trim();
  return s
    .replaceAll('{marka}', encodeURIComponent(k.marka))
    .replaceAll('{model}', encodeURIComponent(model))
    .replaceAll('{slug}', encodeURIComponent(k.slug))
    .replaceAll('{fraza}', encodeURIComponent(fraza));
}

const DOMYSLNA_KOLEJNOSC: ModulId[] = ['vin', 'ubezpieczenia', 'czesci'];

export function kolejnoscModulow(): ModulId[] {
  const k = (panelDane.kolejnosc || []).filter((x) => DOMYSLNA_KOLEJNOSC.includes(x));
  return [...k, ...DOMYSLNA_KOLEJNOSC.filter((x) => !k.includes(x))];
}

/** Czy moduł jest włączony i czy żadna reguła nie wyklucza go na tej karcie */
export function pokazModul(modul: ModulId, k: KontekstKarty): boolean {
  const m = panelDane.moduly || {};
  const wl = (x?: { wlaczony: boolean }) => (x ? x.wlaczony : true);
  if (modul === 'vin' && !(wl(m.vin) && linkVin(k))) return false;
  if (modul === 'ubezpieczenia' && !(wl(m.ubezpieczenia) && (['oc', 'ac', 'nnw'] as const).some((r) => linkUbezpieczenia(r, k)))) return false;
  if (modul === 'czesci' && !(m.czesci?.wlaczony && (m.czesci.allegro || m.czesci.ceneo))) return false;
  if (modul === 'adsense' && !(m.adsense?.wlaczony && m.adsense.klient)) return false;
  if (modul === 'ogledziny' && !(wl(m.ogledziny) && linkOgledziny(k))) return false;
  if (modul === 'finansowanie' && !(wl(m.finansowanie) && linkFinansowanie(k))) return false;
  for (const r of panelDane.reguly || []) {
    if (r.modul !== modul) continue;
    const lista = r.wartosc.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (r.typ === 'slug' && lista.includes(k.slug.toLowerCase())) return false;
    if (r.typ === 'marka' && lista.includes(k.marka.toLowerCase())) return false;
    if (r.typ === 'rocznikOd' && k.sredniRocznik && k.sredniRocznik >= Number(r.wartosc)) return false;
    if (r.typ === 'minAut' && k.liczba !== undefined && k.liczba < Number(r.wartosc)) return false;
  }
  return true;
}

export function linkOgledziny(k: KontekstKarty): string {
  return wypelnij(panelDane.moduly?.ogledziny?.url || '', k);
}

export function linkFinansowanie(k: KontekstKarty): string {
  return wypelnij(panelDane.moduly?.finansowanie?.url || '', k);
}

export function linkVin(k: KontekstKarty): string {
  return wypelnij(panelDane.moduly?.vin?.url || panelDane.linki.vin, k);
}

export function linkUbezpieczenia(rodzaj: 'oc' | 'ac' | 'nnw', k: KontekstKarty): string {
  return wypelnij(panelDane.moduly?.ubezpieczenia?.[rodzaj] || panelDane.linki[rodzaj], k);
}

/** Linki do wyszukiwania części: dla każdej frazy link do Allegro i/lub Ceneo */
export function linkiCzesci(k: KontekstKarty): { fraza: string; allegro: string; ceneo: string }[] {
  const c = panelDane.moduly?.czesci;
  if (!c) return [];
  const model = `${k.marka} ${k.model} ${k.generacja || ''}`.replace(/\s+/g, ' ').trim();
  const frazy = (c.frazy || 'filtr oleju, klocki hamulcowe, olej silnikowy, wycieraczki, akumulator')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 8);
  return frazy.map((f) => {
    const pelna = `${f} ${model}`;
    return { fraza: f, allegro: wypelnij(c.allegro, k, pelna), ceneo: wypelnij(c.ceneo, k, pelna) };
  });
}

/** Kod wklejony w panelu dla danej podstrony */
export function kodDlaStrony(sciezka: string): KodStrony | undefined {
  return panelDane.kody?.strony?.find((s) => s.sciezka === sciezka);
}

/** Sklep z oponami z panelu: link do opon na dany sezon (albo ogólny); null, gdy wyłączony lub pusty */
export function sklepOpon(sezon?: 'zimowe' | 'letnie'): { nazwa: string; url: string } | null {
  const o = panelDane.moduly?.opony;
  if (!o || o.wlaczony === false) return null;
  const url = ((sezon && o[sezon]) || o.url || '').trim();
  return /^https:\/\//.test(url) ? { nazwa: o.partner || 'sklep z oponami', url } : null;
}

/** Logo i ikona strony z panelu admina (puste = domyślna pinezka i nazwa) */
export function marka() {
  const m = panelDane.marka || {};
  const bezpieczny = (u?: string) => (u && /^\/marka\/[\w.-]+\.png(\?v=\d+)?$/.test(u) ? u : '');
  return { logo: bezpieczny(m.logo), logoCiemne: bezpieczny(m.logoCiemne), logoTryb: m.logoTryb === 'zamiast' ? 'zamiast' : 'obok', ikonaWersja: /^\d+$/.test(m.ikonaWersja || '') ? m.ikonaWersja! : '' } as const;
}
