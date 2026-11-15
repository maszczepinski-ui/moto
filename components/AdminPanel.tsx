'use client';

// =====================================================================
// Panel admina. Działa w całości w przeglądarce:
// 1) pobiera plik data/panel.json z Twojego repozytorium na GitHubie,
// 2) pozwala zmienić linki partnerskie, moduły, kody, filmy i opisy,
// 3) zapisuje plik z powrotem na GitHubie – Vercel sam przebudowuje stronę.
// Klucz dostępu (token GitHub) zapisuje się tylko w tej przeglądarce.
// =====================================================================

import { useEffect, useMemo, useState } from 'react';
import Aktualizacje from '@/components/admin/Aktualizacje';
import MapaStrony from '@/components/admin/MapaStrony';
import RaportGoogle from '@/components/admin/RaportGoogle';
import Statystyki from '@/components/admin/Statystyki';
import ChinskieAuta from '@/components/admin/ChinskieAuta';
import Silniki from '@/components/admin/Silniki';
import { uzyciaSilnikow, type Pokrycie } from '@/lib/silniki';
import { oznaczPrzyPierwszymWejsciu } from '@/lib/admin-urzadzenie';
import ArtykulyFilmow from '@/components/admin/ArtykulyFilmow';
import AktualnosciAdmin from '@/components/admin/Aktualnosci';
import Social from '@/components/admin/Social';
import ProduktyRankingi from '@/components/admin/ProduktyRankingi';
import OpisFilmu from '@/components/admin/OpisFilmu';
import LogoIkona, { type Marka } from '@/components/admin/LogoIkona';
import { site } from '@/config/site';
import {
  KeyRound, Link2, Film, Save, Trash2, Plus, RefreshCw, CheckCircle2, AlertTriangle, LogOut, Code2, Megaphone, Search, FileText, ArrowUp, ArrowDown, Ban, Database, Package, Clapperboard, Newspaper, Share2,
  Fuel,
  Palette,
  BarChart3,
  Trophy,
  Cog,
  ExternalLink,
  LayoutDashboard,
  X
} from 'lucide-react';

type Linki = { vin: string; oc: string; ac: string; nnw: string };
type FilmT = { slug: string; youtube: string; tytul: string; data: string; opis?: string };
type ModulId = 'vin' | 'ubezpieczenia' | 'czesci' | 'adsense' | 'ogledziny' | 'finansowanie';
type Regula = { modul: ModulId; typ: 'slug' | 'marka' | 'rocznikOd' | 'minAut'; wartosc: string };
type KodStrony = { sciezka: string; head: string; body: string };
type Dane = {
  linki: Linki;
  filmy: FilmT[];
  moduly: {
    vin: { wlaczony: boolean; partner: string; url: string; urlOgolny: string; kod: string; rabat: string };
    ubezpieczenia: { wlaczony: boolean; siec: string; oc: string; ac: string; nnw: string };
    czesci: { wlaczony: boolean; allegro: string; ceneo: string; frazy: string };
    adsense: { wlaczony: boolean; klient: string; slotGora: string; slotSpec: string; slotDol: string };
    ogledziny: { wlaczony: boolean; partner: string; url: string };
    finansowanie: { wlaczony: boolean; partner: string; url: string };
    opony: { wlaczony: boolean; partner: string; url: string; zimowe: string; letnie: string };
    kancelaria: { wlaczony: boolean; partner: string; url: string };
  };
  kolejnosc: ModulId[];
  reguly: Regula[];
  kody: { head: string; body: string; strony: KodStrony[] };
  seo: { gsc: string; adsTxt: string; ga4: string };
  opisyZatwierdzone: string[];
  ceny: { pb95: number; on: number; lpg: number; prad: number; data: string };
  marka: Marka;
};
type ModelOpcja = { slug: string; nazwa: string; liczba: number; adres: string };
type StronaOpcja = { sciezka: string; nazwa: string };
type Szkic = { slug: string; nazwa: string; adres: string; eksploatacja: string; koszty: string; podsumowanie: string; wygenerowano: string; wstep?: string; zrodla?: { nazwa: string; url: string }[] };

const PLIK = 'data/panel.json';
const K_TOKEN = 'atlas-admin-token';
const K_REPO = 'atlas-admin-repo';
const K_ZAKLADKA = 'atlas-admin-zakladka';

import { input, karta, etykieta } from '@/components/admin/wspolne';
const kodInput = `${input} font-mono text-xs min-h-[120px]`;

const NAZWY_MODULOW: Record<ModulId, string> = { vin: 'Raport VIN', ubezpieczenia: 'Ubezpieczenia OC/AC/NNW', czesci: 'Części i eksploatacja', adsense: 'Reklamy AdSense', ogledziny: 'Oględziny przed zakupem', finansowanie: 'Kredyt / leasing' };
const NAZWY_REGUL: Record<Regula['typ'], string> = {
  slug: 'na tych kartach (slugi, po przecinku)',
  marka: 'dla tych marek (po przecinku)',
  rocznikOd: 'gdy średni rocznik modelu jest taki lub nowszy',
  minAut: 'gdy model ma mniej aut niż (mały ruch)'
};

function ytId(link: string) {
  const s = (link || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : '';
}

function doBase64(tekst: string) {
  const bajty = new TextEncoder().encode(tekst);
  let bin = '';
  bajty.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function zBase64(b64: string) {
  const bin = atob(b64.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

// Token domyślnie pamiętamy tylko do zamknięcia karty przeglądarki (sessionStorage).
// „Zapamiętaj na tym komputerze” zapisuje go na stałe (localStorage) – wygodniej, ale tylko na własnym komputerze.
const pamiec = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k) || sessionStorage.getItem(k) || '';
    } catch {
      return '';
    }
  },
  trwaly: (k: string) => {
    try {
      return !!localStorage.getItem(k);
    } catch {
      return false;
    }
  },
  set: (k: string, v: string, trwale = true) => {
    try {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
      if (v) (trwale ? localStorage : sessionStorage).setItem(k, v);
    } catch {
      /* brak pamięci przeglądarki – trzeba będzie wkleić token ponownie */
    }
  }
};

/** Uzupełnia brakujące pola (np. plik zapisany starszą wersją panelu) */
function uzupelnij(d: Partial<Dane>): Dane {
  const l: Partial<Linki> = d.linki || {};
  const m: Partial<Dane['moduly']> = d.moduly || {};
  return {
    linki: { vin: l.vin ?? '', oc: l.oc ?? '', ac: l.ac ?? '', nnw: l.nnw ?? '' },
    filmy: d.filmy || [],
    moduly: {
      vin: { wlaczony: true, partner: '', url: l.vin ?? '', urlOgolny: '', kod: '', rabat: '', ...m.vin },
      ubezpieczenia: { wlaczony: true, siec: '', oc: l.oc ?? '', ac: l.ac ?? '', nnw: l.nnw ?? '', ...m.ubezpieczenia },
      czesci: { wlaczony: false, allegro: '', ceneo: '', frazy: 'filtr oleju, klocki hamulcowe, olej silnikowy, wycieraczki, akumulator', ...m.czesci },
      adsense: { wlaczony: false, klient: '', slotGora: '', slotSpec: '', slotDol: '', ...m.adsense },
      ogledziny: { wlaczony: true, partner: '', url: '', ...m.ogledziny },
      finansowanie: { wlaczony: true, partner: '', url: '', ...m.finansowanie },
      opony: { wlaczony: true, partner: '', url: '', zimowe: '', letnie: '', ...m.opony },
      kancelaria: { wlaczony: true, partner: '', url: '', ...m.kancelaria }
    },
    kolejnosc: d.kolejnosc?.length ? d.kolejnosc : ['vin', 'ubezpieczenia', 'czesci'],
    reguly: d.reguly || [],
    kody: { head: '', body: '', strony: [], ...d.kody },
    seo: { gsc: '', adsTxt: '', ga4: '', ...d.seo },
    opisyZatwierdzone: d.opisyZatwierdzone || [],
    ceny: { pb95: 6.45, on: 8.09, lpg: 3.69, prad: 1.2, data: '2026-11-02', ...d.ceny },
    marka: { logo: '', logoCiemne: '', logoTryb: 'obok', ikonaWersja: '', ...d.marka }
  };
}

function Pole({ id, label, value, onChange, placeholder, typ = 'text' }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; typ?: string }) {
  return (
    <div>
      <label htmlFor={id} className={etykieta}>
        {label}
      </label>
      <input id={id} type={typ} value={value} onChange={(e) => onChange(e.target.value)} className={input} placeholder={placeholder} />
    </div>
  );
}

function Przelacznik({ wlaczony, onChange, label }: { wlaczony: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
      <span className="relative inline-flex items-center">
        <input type="checkbox" checked={wlaczony} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <span className="w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-emerald-600 transition-colors" />
        <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

type Zakladka = 'statystyki' | 'chinskie' | 'silniki' | 'linki' | 'filmy' | 'artykuly' | 'aktualnosci' | 'social' | 'produkty' | 'kody' | 'seo' | 'opisy' | 'aktualizacje' | 'wyglad';

export default function AdminPanel({
  modele,
  pokrycie,
  strony,
  szkice,
  stanDanych,
  repo: repoDomyslne,
  branch
}: {
  modele: ModelOpcja[];
  pokrycie: Pokrycie;
  strony: StronaOpcja[];
  szkice: Szkic[];
  stanDanych: string;
  repo: string;
  branch: string;
}) {
  const [token, setToken] = useState('');
  const [zapamietaj, setZapamietaj] = useState(false);
  const [repo, setRepo] = useState(repoDomyslne);
  const [dane, setDane] = useState<Dane | null>(null);
  const [sha, setSha] = useState('');
  const [zmiany, setZmiany] = useState(false);
  const [status, setStatus] = useState<{ typ: 'ok' | 'blad' | 'info'; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);
  const [zakladka, setZakladka] = useState<Zakladka>('linki');

  // formularz nowego filmu
  const [modelTekst, setModelTekst] = useState('');
  const [link, setLink] = useState('');
  const [tytul, setTytul] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  // kod dla podstrony
  const [stronaTekst, setStronaTekst] = useState('');
  // podgląd szkicu
  const [otwartySzkic, setOtwartySzkic] = useState('');

  const poNazwie = useMemo(() => new Map(modele.map((m) => [m.nazwa, m])), [modele]);
  const poSlugu = useMemo(() => new Map(modele.map((m) => [m.slug, m])), [modele]);
  const nazwyModeli = useMemo(() => new Map(modele.map((m) => [m.slug, m.nazwa])), [modele]);
  const stronyPoEtykiecie = useMemo(() => new Map(strony.map((s) => [`${s.nazwa} (${s.sciezka})`, s])), [strony]);
  const stronyPoSciezce = useMemo(() => new Map(strony.map((s) => [s.sciezka, s])), [strony]);
  const wybranyModel = poNazwie.get(modelTekst.trim());
  const wybranaStrona = stronyPoEtykiecie.get(stronaTekst.trim()) || stronyPoSciezce.get(stronaTekst.trim());
  const id = ytId(link);

  // wejście do panelu = to urządzenie admina → nie liczymy go w statystykach
  useEffect(() => oznaczPrzyPierwszymWejsciu(), []);

  useEffect(() => {
    setToken(pamiec.get(K_TOKEN));
    setZapamietaj(pamiec.trwaly(K_TOKEN));
    setRepo(pamiec.get(K_REPO) || repoDomyslne);
    try {
      const z = localStorage.getItem(K_ZAKLADKA) as Zakladka | null;
      if (z) setZakladka(z);
    } catch {
      /* brak pamięci przeglądarki */
    }
  }, [repoDomyslne]);

  // ostrzeżenie przed zamknięciem karty, gdy zmiany nie są zapisane
  useEffect(() => {
    if (!zmiany) return;
    const ostrzez = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', ostrzez);
    return () => window.removeEventListener('beforeunload', ostrzez);
  }, [zmiany]);

  // komunikaty o sukcesie same znikają po kilku sekundach
  useEffect(() => {
    if (status?.typ !== 'ok') return;
    const t = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(t);
  }, [status]);

  /** Dowolne zapytanie do API GitHuba dla tego repozytorium (np. uruchomienie aktualizacji danych) */
  async function api(sciezka: string, metoda: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET', body?: object) {
    let r: Response;
    try {
      r = await fetch(`https://api.github.com/repos/${repo.trim()}${sciezka}`, {
        method: metoda,
        headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github+json' },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store'
      });
    } catch {
      throw new Error('Brak połączenia z GitHubem.');
    }
    if (!r.ok) throw new Error(r.status === 401 ? 'Nieprawidłowy token.' : r.status === 403 ? 'Token nie ma potrzebnych uprawnień.' : r.status === 404 ? 'Nie znaleziono (sprawdź uprawnienia tokenu i czy plik automatu jest w repozytorium).' : `Błąd GitHuba ${r.status}.`);
    return r.status === 204 ? {} : r.json();
  }

  async function gh(metoda: 'GET' | 'PUT', body?: object) {
    let r: Response;
    try {
      r = await fetch(`https://api.github.com/repos/${repo.trim()}/contents/${PLIK}${metoda === 'GET' ? `?ref=${branch}` : ''}`, {
        method: metoda,
        headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github+json' },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store'
      });
    } catch {
      throw new Error('Brak połączenia z GitHubem. Sprawdź internet i spróbuj ponownie.');
    }
    if (!r.ok) {
      const opis =
        r.status === 401
          ? 'Nieprawidłowy albo wygasły token.'
          : r.status === 403
          ? 'Token nie ma uprawnień do zapisu w tym repozytorium.'
          : r.status === 404
          ? `Nie znaleziono repozytorium „${repo}” albo pliku ${PLIK}.`
          : r.status === 409
          ? 'Plik zmienił się w międzyczasie. Kliknij „Wczytaj ponownie” i powtórz zmianę.'
          : `GitHub zwrócił błąd ${r.status}.`;
      throw new Error(opis);
    }
    return r.json();
  }

  async function wczytaj() {
    setPraca(true);
    setStatus({ typ: 'info', tekst: 'Wczytuję dane z GitHuba…' });
    try {
      pamiec.set(K_TOKEN, token.trim(), zapamietaj);
      pamiec.set(K_REPO, repo.trim());
      const j = await gh('GET');
      setDane(uzupelnij(JSON.parse(zBase64(j.content)) as Partial<Dane>));
      setSha(j.sha);
      setZmiany(false);
      setStatus({ typ: 'ok', tekst: 'Połączono. Możesz edytować.' });
    } catch (e) {
      setStatus({ typ: 'blad', tekst: (e as Error).message });
    } finally {
      setPraca(false);
    }
  }

  function bledy(d: Dane): string | null {
    const linki: [string, string][] = [
      ['VIN', d.moduly.vin.url],
      ['VIN (bez numeru)', d.moduly.vin.urlOgolny],
      ['OC', d.moduly.ubezpieczenia.oc],
      ['AC', d.moduly.ubezpieczenia.ac],
      ['NNW', d.moduly.ubezpieczenia.nnw],
      ['Allegro', d.moduly.czesci.allegro],
      ['Ceneo', d.moduly.czesci.ceneo],
      ['Oględziny', d.moduly.ogledziny.url],
      ['Kredyt / leasing', d.moduly.finansowanie.url],
      ['Opony', d.moduly.opony.url],
      ['Opony zimowe', d.moduly.opony.zimowe],
      ['Opony letnie', d.moduly.opony.letnie],
      ['Kancelaria (po szkodzie)', d.moduly.kancelaria.url]
    ];
    const zly = linki.find(([, v]) => v && !/^https:\/\//.test(v.trim()));
    if (zly) return `Link „${zly[0]}” musi zaczynać się od https://`;
    if (d.moduly.adsense.wlaczony && !/^ca-pub-\d{10,}$/.test(d.moduly.adsense.klient.trim())) return 'Identyfikator AdSense powinien wyglądać tak: ca-pub-1234567890123456';
    if (d.seo.ga4 && !/^G-[A-Z0-9]+$/.test(d.seo.ga4.trim())) return 'Identyfikator GA4 powinien wyglądać tak: G-XXXXXXXXXX';
    return null;
  }

  async function zapisz() {
    if (!dane) return;
    const blad = bledy(dane);
    if (blad) {
      setStatus({ typ: 'blad', tekst: blad });
      return;
    }
    setPraca(true);
    setStatus({ typ: 'info', tekst: 'Zapisuję…' });
    try {
      // stare pola linków zostają zgodne z nowymi (na wypadek starszych wersji strony)
      const doZapisu: Dane = {
        ...dane,
        linki: { vin: dane.moduly.vin.url, oc: dane.moduly.ubezpieczenia.oc, ac: dane.moduly.ubezpieczenia.ac, nnw: dane.moduly.ubezpieczenia.nnw },
        kody: { ...dane.kody, strony: dane.kody.strony.filter((s) => s.head.trim() || s.body.trim()) }
      };
      const tekst = JSON.stringify(doZapisu, null, 2) + '\n';
      const j = await gh('PUT', { message: 'Panel admina: zmiany ustawień', content: doBase64(tekst), sha, branch });
      setSha(j.content.sha);
      setDane(doZapisu);
      setZmiany(false);
      setStatus({ typ: 'ok', tekst: 'Zapisano! Strona zaktualizuje się za kilka minut (Vercel buduje ją od nowa).' });
    } catch (e) {
      setStatus({ typ: 'blad', tekst: (e as Error).message });
    } finally {
      setPraca(false);
    }
  }

  function zmien(f: (d: Dane) => Dane) {
    if (!dane) return;
    setDane(f(dane));
    setZmiany(true);
  }
  const ustawModul = <K extends keyof Dane['moduly']>(k: K, pole: keyof Dane['moduly'][K], v: string | boolean) =>
    zmien((d) => ({ ...d, moduly: { ...d.moduly, [k]: { ...d.moduly[k], [pole]: v } } }));

  function dodajFilm() {
    if (!dane || !wybranyModel || !id) return;
    const nowy: FilmT = { slug: wybranyModel.slug, youtube: `https://www.youtube.com/watch?v=${id}`, tytul: tytul.trim() || `${wybranyModel.nazwa} – film MotoFormat`, data };
    zmien((d) => ({ ...d, filmy: [nowy, ...d.filmy] }));
    setLink('');
    setTytul('');
    setModelTekst('');
  }

  function przesun(i: number, o: number) {
    zmien((d) => {
      const k = [...d.kolejnosc];
      const j = i + o;
      if (j < 0 || j >= k.length) return d;
      [k[i], k[j]] = [k[j], k[i]];
      return { ...d, kolejnosc: k };
    });
  }

  function kodStrony(sciezka: string): KodStrony {
    return dane?.kody.strony.find((s) => s.sciezka === sciezka) || { sciezka, head: '', body: '' };
  }
  function ustawKodStrony(sciezka: string, pole: 'head' | 'body', v: string) {
    zmien((d) => {
      const inne = d.kody.strony.filter((s) => s.sciezka !== sciezka);
      const obecny = d.kody.strony.find((s) => s.sciezka === sciezka) || { sciezka, head: '', body: '' };
      return { ...d, kody: { ...d.kody, strony: [...inne, { ...obecny, [pole]: v }] } };
    });
  }

  function wyloguj() {
    pamiec.set(K_TOKEN, '');
    setToken('');
    setDane(null);
    setStatus({ typ: 'info', tekst: 'Token usunięty z tej przeglądarki.' });
  }

  // Menu panelu podzielone na grupy – łatwiej znaleźć to, czego szukasz
  const ik = 'w-4 h-4 flex-shrink-0';
  const grupy: { nazwa: string; pozycje: { k: Zakladka; nazwa: string; ikona: React.ReactNode; opis: string; licznik?: number }[] }[] = [
    {
      nazwa: 'Przegląd',
      pozycje: [{ k: 'statystyki', nazwa: 'Statystyki', ikona: <BarChart3 className={ik} />, opis: 'Ruch na stronie z Google Analytics i raport wyszukiwania Google.' }]
    },
    {
      nazwa: 'Treści',
      pozycje: [
        { k: 'aktualnosci', nazwa: 'Aktualności', ikona: <Newspaper className={ik} />, opis: 'Inspiracje z RSS, własne wpisy i szkice z automatu – napisz, popraw i opublikuj.' },
        { k: 'social', nazwa: 'Social – posty', ikona: <Share2 className={ik} />, opis: 'Posty MotoFormat na Instagram, TikTok i Facebook – nakładki, zdjęcia, rolki i planowanie w Metricool.' },
        { k: 'artykuly', nazwa: 'Artykuły z filmów', ikona: <Clapperboard className={ik} />, opis: 'Wpisy na stronie powstające z Twoich filmów na YouTube.' },
        { k: 'filmy', nazwa: 'Filmy na kartach', ikona: <Film className={ik} />, opis: 'Przypnij film z YouTube do karty modelu i przygotuj opis pod film.' },
        { k: 'opisy', nazwa: 'Opisy modeli', ikona: <FileText className={ik} />, opis: 'Szkice opisów kart modeli czekające na Twoje zatwierdzenie.', licznik: szkice.length }
      ]
    },
    {
      nazwa: 'Dane',
      pozycje: [
        { k: 'silniki', nazwa: 'Dane techniczne', ikona: <Cog className={ik} />, opis: 'Silniki, plusy i minusy, miejsca numeru VIN – do sprawdzenia i zatwierdzenia.' },
        { k: 'chinskie', nazwa: 'Chińskie auta', ikona: <Trophy className={ik} />, opis: 'Zdjęcia, ceny i widoczność aut w rankingu chińskich marek.' },
        { k: 'produkty', nazwa: 'Produkty i rankingi', ikona: <Package className={ik} />, opis: 'Polecane produkty i rankingi z linkami partnerskimi.' },
        { k: 'aktualizacje', nazwa: 'Aktualizacje danych', ikona: <Database className={ik} />, opis: `Odświeżanie danych CEPiK i statystyk rynku. Dane na stronie: ${stanDanych}.` }
      ]
    },
    {
      nazwa: 'Ustawienia',
      pozycje: [
        { k: 'linki', nazwa: 'Linki i moduły', ikona: <Link2 className={ik} />, opis: 'Linki partnerskie i moduły widoczne na kartach modeli.' },
        { k: 'seo', nazwa: 'SEO, reklamy i ceny', ikona: <Megaphone className={ik} />, opis: 'Google Search Console, Analytics, reklamy i ceny paliw.' },
        { k: 'kody', nazwa: 'Kody na stronie', ikona: <Code2 className={ik} />, opis: 'Własne kody (np. weryfikacyjne) wklejane na całej stronie albo jednej podstronie.' },
        { k: 'wyglad', nazwa: 'Logo i ikona', ikona: <Palette className={ik} />, opis: 'Logo w nagłówku i ikona strony w przeglądarce oraz w telefonie.' }
      ]
    }
  ];
  const wszystkie = grupy.flatMap((g) => g.pozycje.map((p) => ({ ...p, grupa: g.nazwa })));
  const aktywna = wszystkie.find((p) => p.k === zakladka) || wszystkie[0];
  const wybierz = (k: Zakladka) => {
    setZakladka(k);
    try {
      localStorage.setItem(K_ZAKLADKA, k);
    } catch {
      /* bez pamięci przeglądarki – po prostu nie zapamiętamy */
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // komunikat o stanie (sukces / błąd / informacja)
  const komunikat = status && (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1 ${
        status.typ === 'ok'
          ? 'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-900'
          : status.typ === 'blad'
          ? 'bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-900'
          : 'bg-steel-50 text-steel-900 ring-steel-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
      }`}
    >
      {status.typ === 'ok' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : status.typ === 'blad' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <RefreshCw className={`w-5 h-5 flex-shrink-0 ${praca ? 'animate-spin' : ''}`} />}
      <span className="flex-1">{status.tekst}</span>
      <button type="button" onClick={() => setStatus(null)} className="-m-1 p-1 rounded-md opacity-60 hover:opacity-100" aria-label="Zamknij komunikat">
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  // ===================== EKRAN LOGOWANIA =====================
  if (!dane) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-5">
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-steel-600 text-white shadow-lg shadow-steel-600/20">
              <LayoutDashboard className="w-6 h-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Panel {site.name}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Zaloguj się kluczem z GitHuba, żeby zarządzać stroną.</p>
          </div>
          {komunikat}
          <section className={karta}>
            <div>
              <label htmlFor="a-token" className={etykieta}>
                Token GitHub
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="a-token"
                  type="password"
                  autoComplete="off"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && token.trim() && !praca && wczytaj()}
                  className={`${input} pl-9`}
                  placeholder="github_pat_…"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Jak go zdobyć – instrukcja w pliku README repozytorium.</p>
            </div>
            <label className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={zapamietaj} onChange={(e) => setZapamietaj(e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-steel-600" />
              <span>
                Zapamiętaj na tym urządzeniu
                <span className="block text-xs text-slate-500">Tylko na własnym komputerze lub telefonie. Bez zaznaczenia token zniknie po zamknięciu karty.</span>
              </span>
            </label>
            <details className="group text-sm">
              <summary className="cursor-pointer select-none text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Ustawienia zaawansowane</summary>
              <div className="mt-3">
                <Pole id="a-repo" label="Repozytorium (login/nazwa)" value={repo} onChange={setRepo} />
              </div>
            </details>
            <button
              type="button"
              onClick={wczytaj}
              disabled={!token.trim() || praca}
              className="w-full inline-flex items-center justify-center gap-2 bg-steel-600 hover:bg-steel-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <RefreshCw className={`w-4 h-4 ${praca ? 'animate-spin' : ''}`} aria-hidden="true" /> {praca ? 'Łączę…' : 'Zaloguj'}
            </button>
            {token && (
              <button type="button" onClick={wyloguj} className="w-full text-xs font-semibold text-slate-500 hover:text-rose-600">
                Usuń zapisany token z tej przeglądarki
              </button>
            )}
          </section>
        </div>
      </div>
    );
  }

  // ===================== PANEL PO ZALOGOWANIU =====================
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-8">
        {/* ----- menu boczne (na telefonie: przewijany pasek u góry) ----- */}
        <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="hidden lg:flex items-center gap-3 px-2 pb-5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-steel-600 text-white">
              <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 dark:text-white leading-tight">Panel admina</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Połączono
              </p>
            </div>
          </div>

          <nav aria-label="Zakładki panelu" className="-mx-4 px-4 lg:mx-0 lg:px-0 flex lg:block gap-2 overflow-x-auto pb-3 lg:pb-0 lg:space-y-5 [scrollbar-width:none]">
            {grupy.map((g) => (
              <div key={g.nazwa} className="contents lg:block">
                <p className="hidden lg:block px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{g.nazwa}</p>
                <ul className="contents lg:block lg:space-y-0.5">
                  {g.pozycje.map((p) => {
                    const wl = zakladka === p.k;
                    return (
                      <li key={p.k} className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => wybierz(p.k)}
                          aria-current={wl ? 'page' : undefined}
                          className={`w-full flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            wl
                              ? 'bg-steel-600 text-white shadow-sm lg:bg-white lg:text-steel-700 lg:ring-1 lg:ring-slate-200 dark:lg:bg-slate-900 dark:lg:text-white dark:lg:ring-slate-800'
                              : 'bg-white ring-1 ring-slate-200 text-slate-600 lg:bg-transparent lg:ring-0 hover:text-slate-900 lg:hover:bg-white dark:bg-slate-900 dark:ring-slate-800 dark:text-slate-300 dark:lg:bg-transparent dark:hover:text-white dark:lg:hover:bg-slate-900'
                          }`}
                        >
                          <span className={wl ? 'lg:text-steel-600 dark:lg:text-steel-400' : 'text-slate-400'}>{p.ikona}</span>
                          <span className="flex-1 text-left">{p.nazwa}</span>
                          {!!p.licznik && (
                            <span className={`ml-1 min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${wl ? 'bg-white/20 lg:bg-amber-100 lg:text-amber-800' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'}`}>
                              {p.licznik}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="hidden lg:block mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <p className="px-3 pb-2 text-xs text-slate-500 truncate" title={repo}>
              {repo}
            </p>
            <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900">
              <ExternalLink className="w-4 h-4 text-slate-400" aria-hidden="true" /> Otwórz stronę
            </a>
            <button type="button" onClick={wczytaj} disabled={praca} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 text-slate-400 ${praca ? 'animate-spin' : ''}`} aria-hidden="true" /> Wczytaj ponownie
            </button>
            <button type="button" onClick={wyloguj} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300">
              <LogOut className="w-4 h-4" aria-hidden="true" /> Wyloguj
            </button>
          </div>
        </aside>

        {/* ----- treść zakładki ----- */}
        <main className="min-w-0 max-w-4xl space-y-6 pt-2 lg:pt-0">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-steel-600 dark:text-steel-400">{aktywna.grupa}</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{aktywna.nazwa}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{aktywna.opis}</p>
            </div>
            {/* na telefonie: szybkie akcje zamiast menu bocznego */}
            <div className="flex gap-2 lg:hidden">
              <button type="button" onClick={wczytaj} disabled={praca} className="p-2 rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 text-slate-600 dark:text-slate-300" aria-label="Wczytaj ponownie">
                <RefreshCw className={`w-4 h-4 ${praca ? 'animate-spin' : ''}`} />
              </button>
              <button type="button" onClick={wyloguj} className="p-2 rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 text-slate-600 dark:text-slate-300" aria-label="Wyloguj">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {komunikat}

          {/* ===================== LINKI I MODUŁY ===================== */}
          {zakladka === 'linki' && (
            <>
              <section className={karta}>
                <Przelacznik label="Raport VIN" wlaczony={dane.moduly.vin.wlaczony} onChange={(v) => ustawModul('vin', 'wlaczony', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="vin-p" className={etykieta}>
                      Partner
                    </label>
                    <select id="vin-p" value={dane.moduly.vin.partner} onChange={(e) => ustawModul('vin', 'partner', e.target.value)} className={input}>
                      <option value="">— wybierz —</option>
                      <option value="carvertical">carVertical</option>
                      <option value="autodna">autoDNA</option>
                      <option value="inny">inny</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Pole id="vin-u" label="Link partnerski z numerem VIN (z {vin})" value={dane.moduly.vin.url} onChange={(v) => ustawModul('vin', 'url', v)} placeholder="https://…&sub3={vin}" />
                  </div>
                  <div className="sm:col-span-3">
                    <Pole id="vin-o" label="Link partnerski bez VIN (gdy ktoś nie wpisze numeru)" value={dane.moduly.vin.urlOgolny} onChange={(v) => ustawModul('vin', 'urlOgolny', v)} placeholder="https://…" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="vin-k" label="Kod rabatowy (opcjonalnie)" value={dane.moduly.vin.kod} onChange={(v) => ustawModul('vin', 'kod', v.trim())} placeholder="np. motoraport" />
                  <Pole id="vin-r" label="Rabat (opcjonalnie)" value={dane.moduly.vin.rabat} onChange={(v) => ustawModul('vin', 'rabat', v)} placeholder="np. -15%" />
                </div>
                {dane.moduly.vin.partner === 'carvertical' && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-1">
                    <p>
                      <strong>carVertical:</strong> zapisz się w programie partnerskim (carvertical.com → Affiliate program), a potem skopiuj swój link z panelu partnera i wklej powyżej.
                      Na stronie pojawi się boks „Kompleksowe sprawdzenie auta” z listą tego, co zawiera raport.
                    </p>
                    <p>
                      W linku „z VIN” z maila carVertical zamień końcówkę <code>sub3=vin</code> na <code>{'sub3={vin}'}</code> – strona wstawi tam numer wpisany przez klienta. Link „bez VIN” wklej w drugie pole. Gdy pola z VIN nie wypełnisz – strona sama skopiuje
                      wpisany VIN do schowka, a klient wklei go u carVertical. Kod rabatowy (jeśli dostaniesz własny) wpisz w polu obok – kod ma pierwszeństwo przed kliknięciem przy
                      naliczaniu prowizji.
                    </p>
                  </div>
                )}
              </section>

              <section className={karta}>
                <Przelacznik label="Ubezpieczenia OC / AC / NNW" wlaczony={dane.moduly.ubezpieczenia.wlaczony} onChange={(v) => ustawModul('ubezpieczenia', 'wlaczony', v)} />
                <div>
                  <label htmlFor="ub-s" className={etykieta}>
                    Sieć / partner
                  </label>
                  <select id="ub-s" value={dane.moduly.ubezpieczenia.siec} onChange={(e) => ustawModul('ubezpieczenia', 'siec', e.target.value)} className={input}>
                    <option value="">— wybierz —</option>
                    <option value="mubi">Mubi</option>
                    <option value="rankomat">Rankomat</option>
                    <option value="convertiser">Convertiser</option>
                    <option value="leadstar">Leadstar</option>
                    <option value="inny">inny</option>
                  </select>
                </div>
                <Pole id="ub-oc" label="Link do porównania OC" value={dane.moduly.ubezpieczenia.oc} onChange={(v) => ustawModul('ubezpieczenia', 'oc', v)} placeholder="https://…" />
                <Pole id="ub-ac" label="Link do porównania AC" value={dane.moduly.ubezpieczenia.ac} onChange={(v) => ustawModul('ubezpieczenia', 'ac', v)} placeholder="https://…" />
                <Pole id="ub-nnw" label="Link do porównania NNW" value={dane.moduly.ubezpieczenia.nnw} onChange={(v) => ustawModul('ubezpieczenia', 'nnw', v)} placeholder="https://…" />
              </section>

              <section className={karta}>
                <Przelacznik label="Części i eksploatacja (Allegro, Ceneo)" wlaczony={dane.moduly.czesci.wlaczony} onChange={(v) => ustawModul('czesci', 'wlaczony', v)} />
                <p className="text-xs text-slate-500">
                  Wklej link partnerski do wyszukiwarki i wstaw w miejsce szukanej frazy <code>{'{fraza}'}</code>. Przykład:{' '}
                  <code className="break-all">https://allegro.pl/listing?string={'{fraza}'}&amp;twoj-parametr-partnera=…</code>
                </p>
                <Pole id="cz-a" label="Allegro – link z {fraza}" value={dane.moduly.czesci.allegro} onChange={(v) => ustawModul('czesci', 'allegro', v)} placeholder="https://…{fraza}…" />
                <Pole id="cz-c" label="Ceneo – link z {fraza}" value={dane.moduly.czesci.ceneo} onChange={(v) => ustawModul('czesci', 'ceneo', v)} placeholder="https://…{fraza}…" />
                <Pole id="cz-f" label="Frazy (po przecinku) – do każdej dopisze się marka i model" value={dane.moduly.czesci.frazy} onChange={(v) => ustawModul('czesci', 'frazy', v)} />
              </section>

              <section className={karta}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Asystent zakupu (strony „Kupujesz …? Sprawdź, zanim zapłacisz”)</h3>
                <p className="text-xs text-slate-500">
                  Te dwa linki pokazują się tylko w asystencie zakupu – przy krokach „oględziny” i „ile to będzie kosztować”. Raport VIN, OC i części biorą się z pól powyżej.
                </p>
                <Przelacznik label="Oględziny auta przed zakupem (mechanik / firma sprawdzająca auta)" wlaczony={dane.moduly.ogledziny.wlaczony} onChange={(v) => ustawModul('ogledziny', 'wlaczony', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="og-p" label="Nazwa partnera (widoczna na stronie)" value={dane.moduly.ogledziny.partner} onChange={(v) => ustawModul('ogledziny', 'partner', v)} placeholder="np. Sprawdzimy auto za Ciebie" />
                  <div className="sm:col-span-2">
                    <Pole id="og-u" label="Link (partnerski albo do Twojego formularza)" value={dane.moduly.ogledziny.url} onChange={(v) => ustawModul('ogledziny', 'url', v)} placeholder="https://…" />
                  </div>
                </div>
                <Przelacznik label="Kredyt / leasing na auto" wlaczony={dane.moduly.finansowanie.wlaczony} onChange={(v) => ustawModul('finansowanie', 'wlaczony', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="fi-p" label="Nazwa partnera" value={dane.moduly.finansowanie.partner} onChange={(v) => ustawModul('finansowanie', 'partner', v)} placeholder="np. porównywarka kredytów" />
                  <div className="sm:col-span-2">
                    <Pole id="fi-u" label="Link partnerski" value={dane.moduly.finansowanie.url} onChange={(v) => ustawModul('finansowanie', 'url', v)} placeholder="https://…" />
                  </div>
                </div>
                <Przelacznik label="Kancelaria odszkodowawcza (pakiet po szkodzie)" wlaczony={dane.moduly.kancelaria.wlaczony} onChange={(v) => ustawModul('kancelaria', 'wlaczony', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="ka-p" label="Nazwa partnera" value={dane.moduly.kancelaria.partner} onChange={(v) => ustawModul('kancelaria', 'partner', v)} placeholder="np. Kancelaria XYZ" />
                  <div className="sm:col-span-2">
                    <Pole id="ka-u" label="Link partnerski (formularz po stronie partnera)" value={dane.moduly.kancelaria.url} onChange={(v) => ustawModul('kancelaria', 'url', v)} placeholder="https://…" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Kancelaria pokazuje się na stronie /po-szkodzie/ (porównanie dróg), przy szkodzie całkowitej i po odmowie ubezpieczyciela w Sprawdzaczu. Wybieraj partnera bez opłat z góry, z jawną prowizją w umowie i wypłatą odszkodowania prosto na konto klienta. Pusty link = boks się nie pokazuje.
                </p>
                <p className="text-xs text-slate-500">
                  W linku możesz wstawić <code>{'{subid}'}</code> – w rankingu chińskich aut zamieni się na model (np. <code>mg-hs</code>) – oraz <code>{'{zrodlo}'}</code> (= <code>ranking-chinskie</code>). Wstaw je
                  w miejsce parametru SubID, które wskazuje panel partnera (np. ComperiaLead). Pusty link = przyciski „Oblicz ratę” się nie pokazują.
                </p>
              </section>

              <section className={karta}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Opony (strona /opony/, sezonowy pasek „Czas wymienić opony” i przypomnienia e-mail)</h3>
                <p className="text-xs text-slate-500">
                  Np. Tirendo albo Oponytanio (programy partnerskie w sieci Awin). Linki do opon zimowych i letnich są opcjonalne – w sezonie strona pokaże właściwy, a gdy są puste,
                  użyje linku ogólnego.
                </p>
                <Przelacznik label="Sklep z oponami" wlaczony={dane.moduly.opony.wlaczony} onChange={(v) => ustawModul('opony', 'wlaczony', v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="op-p" label="Nazwa sklepu (widoczna na stronie)" value={dane.moduly.opony.partner} onChange={(v) => ustawModul('opony', 'partner', v)} placeholder="np. Tirendo" />
                  <div className="sm:col-span-2">
                    <Pole id="op-u" label="Link partnerski – ogólny" value={dane.moduly.opony.url} onChange={(v) => ustawModul('opony', 'url', v)} placeholder="https://…" />
                  </div>
                  <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Pole id="op-z" label="Link do opon zimowych (opcjonalnie)" value={dane.moduly.opony.zimowe} onChange={(v) => ustawModul('opony', 'zimowe', v)} placeholder="https://…" />
                    <Pole id="op-l" label="Link do opon letnich (opcjonalnie)" value={dane.moduly.opony.letnie} onChange={(v) => ustawModul('opony', 'letnie', v)} placeholder="https://…" />
                  </div>
                </div>
              </section>

              <p className="text-xs text-slate-500 px-1">
                We wszystkich linkach możesz użyć znaczników: <code>{'{marka}'}</code> (np. Volkswagen), <code>{'{model}'}</code> (np. Golf IV), <code>{'{slug}'}</code> (np.
                volkswagen-golf-iv) – zostaną zamienione na dane karty, na której ktoś kliknął. W linku VIN wstaw <code>{'{vin}'}</code>, a na stronie pojawi się pole do wpisania numeru VIN. Puste pole = boks się nie pokaże.
              </p>

              <section className={karta}>
                <h2 className="font-bold text-slate-900 dark:text-white">Kolejność boksów na karcie modelu</h2>
                <ol className="space-y-2">
                  {dane.kolejnosc.map((m, i) => (
                    <li key={m} className="flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                      <span className="text-sm">
                        {i + 1}. {NAZWY_MODULOW[m]}
                      </span>
                      <span className="flex gap-1">
                        <button type="button" onClick={() => przesun(i, -1)} className="p-1.5 rounded bg-slate-100 dark:bg-slate-800" aria-label="Wyżej">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => przesun(i, 1)} className="p-1.5 rounded bg-slate-100 dark:bg-slate-800" aria-label="Niżej">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className={karta}>
                <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Ban className="w-5 h-5 text-rose-600" aria-hidden="true" /> Wykluczenia – gdzie NIE pokazywać
                </h2>
                {dane.reguly.length === 0 && <p className="text-sm text-slate-500">Brak wykluczeń – moduły pokazują się na wszystkich kartach.</p>}
                {dane.reguly.map((r, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_1fr_auto] gap-2 items-end">
                    <select
                      aria-label="Moduł"
                      value={r.modul}
                      onChange={(e) => zmien((d) => ({ ...d, reguly: d.reguly.map((x, j) => (j === i ? { ...x, modul: e.target.value as ModulId } : x)) }))}
                      className={input}
                    >
                      {(Object.keys(NAZWY_MODULOW) as ModulId[]).map((m) => (
                        <option key={m} value={m}>
                          Ukryj: {NAZWY_MODULOW[m]}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Warunek"
                      value={r.typ}
                      onChange={(e) => zmien((d) => ({ ...d, reguly: d.reguly.map((x, j) => (j === i ? { ...x, typ: e.target.value as Regula['typ'] } : x)) }))}
                      className={input}
                    >
                      {(Object.keys(NAZWY_REGUL) as Regula['typ'][]).map((t) => (
                        <option key={t} value={t}>
                          {NAZWY_REGUL[t]}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label="Wartość"
                      value={r.wartosc}
                      onChange={(e) => zmien((d) => ({ ...d, reguly: d.reguly.map((x, j) => (j === i ? { ...x, wartosc: e.target.value } : x)) }))}
                      className={input}
                      placeholder={r.typ === 'rocznikOd' ? '2024' : r.typ === 'minAut' ? '500' : ''}
                    />
                    <button type="button" onClick={() => zmien((d) => ({ ...d, reguly: d.reguly.filter((_, j) => j !== i) }))} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" aria-label="Usuń wykluczenie">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => zmien((d) => ({ ...d, reguly: [...d.reguly, { modul: 'vin', typ: 'rocznikOd', wartosc: '2024' }] }))}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj wykluczenie
                </button>
              </section>
            </>
          )}

          {/* ===================== FILMY ===================== */}
          {zakladka === 'filmy' && <OpisFilmu modele={modele} />}
          {zakladka === 'filmy' && (
            <section className={karta}>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Film className="w-5 h-5 text-red-600" aria-hidden="true" /> Filmy na kartach modeli
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="sm:col-span-2">
                  <label htmlFor="f-model" className={etykieta}>
                    Model (zacznij pisać, np. „E36” albo „Golf”)
                  </label>
                  <input id="f-model" list="lista-modeli" value={modelTekst} onChange={(e) => setModelTekst(e.target.value)} className={input} />
                  <datalist id="lista-modeli">
                    {modele.map((m) => (
                      <option key={m.slug} value={m.nazwa} />
                    ))}
                  </datalist>
                  {modelTekst && !wybranyModel && <p className="text-xs text-amber-600 mt-1">Wybierz model z listy podpowiedzi.</p>}
                </div>
                <div className="sm:col-span-2">
                  <Pole id="f-link" label="Link do filmu na YouTube" value={link} onChange={setLink} placeholder="https://www.youtube.com/watch?v=…" />
                  {link && !id && <p className="text-xs text-amber-600 mt-1">Nie rozpoznaję tego linku.</p>}
                </div>
                <Pole id="f-tytul" label="Tytuł filmu (jak na YouTube)" value={tytul} onChange={setTytul} />
                <Pole id="f-data" label="Data publikacji" value={data} onChange={setData} typ="date" />
                {id && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="Podgląd filmu" className="rounded-lg w-48 sm:col-span-2" />
                )}
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={dodajFilm}
                    disabled={!wybranyModel || !id}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj film do karty
                  </button>
                </div>
              </div>
              {dane.filmy.length === 0 ? (
                <p className="text-sm text-slate-500">Nie dodano jeszcze żadnego filmu.</p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dane.filmy.map((f, i) => (
                    <li key={i} className="py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{f.tytul}</div>
                        <div className="text-xs text-slate-500">
                          {poSlugu.get(f.slug)?.nazwa ?? f.slug} • {f.data} •{' '}
                          <a href={poSlugu.get(f.slug)?.adres ?? '/'} target="_blank" rel="noopener" className="underline">
                            karta
                          </a>
                        </div>
                      </div>
                      <button type="button" onClick={() => zmien((d) => ({ ...d, filmy: d.filmy.filter((_, j) => j !== i) }))} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" aria-label={`Usuń film ${f.tytul}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ===================== KODY ===================== */}
          {zakladka === 'kody' && (
            <>
              <section className={karta}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Code2 className="w-5 h-5 text-steel-600" aria-hidden="true" /> Kod na całej stronie
                </h2>
                <p className="text-xs text-slate-500">
                  Tu wklejasz kody, które dostajesz od narzędzi (np. Meta Pixel, Hotjar, tag Google, weryfikacja domeny). Wklejaj tylko kody z zaufanych źródeł – mają pełny dostęp do strony.
                </p>
                <div>
                  <label htmlFor="k-head" className={etykieta}>
                    W sekcji &lt;head&gt; (meta, skrypty, style)
                  </label>
                  <textarea id="k-head" value={dane.kody.head} onChange={(e) => zmien((d) => ({ ...d, kody: { ...d.kody, head: e.target.value } }))} className={kodInput} spellCheck={false} />
                </div>
                <div>
                  <label htmlFor="k-body" className={etykieta}>
                    Na końcu strony (przed &lt;/body&gt;)
                  </label>
                  <textarea id="k-body" value={dane.kody.body} onChange={(e) => zmien((d) => ({ ...d, kody: { ...d.kody, body: e.target.value } }))} className={kodInput} spellCheck={false} />
                </div>
              </section>

              <section className={karta}>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kod na wybranej podstronie</h2>
                <div>
                  <label htmlFor="k-strona" className={etykieta}>
                    Podstrona (zacznij pisać nazwę modelu, marki, województwa albo rankingu)
                  </label>
                  <input id="k-strona" list="lista-stron" value={stronaTekst} onChange={(e) => setStronaTekst(e.target.value)} className={input} />
                  <datalist id="lista-stron">
                    {strony.map((s) => (
                      <option key={s.sciezka} value={`${s.nazwa} (${s.sciezka})`} />
                    ))}
                  </datalist>
                </div>
                {wybranaStrona && (
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <div className="text-sm font-semibold">
                      {wybranaStrona.nazwa}{' '}
                      <a href={wybranaStrona.sciezka} target="_blank" rel="noopener" className="text-xs font-normal underline">
                        {wybranaStrona.sciezka}
                      </a>
                    </div>
                    <div>
                      <label htmlFor="ks-head" className={etykieta}>
                        Do &lt;head&gt; tej podstrony
                      </label>
                      <textarea id="ks-head" value={kodStrony(wybranaStrona.sciezka).head} onChange={(e) => ustawKodStrony(wybranaStrona.sciezka, 'head', e.target.value)} className={kodInput} spellCheck={false} />
                    </div>
                    <div>
                      <label htmlFor="ks-body" className={etykieta}>
                        Na końcu treści tej podstrony (np. widżet, baner, formularz)
                      </label>
                      <textarea id="ks-body" value={kodStrony(wybranaStrona.sciezka).body} onChange={(e) => ustawKodStrony(wybranaStrona.sciezka, 'body', e.target.value)} className={kodInput} spellCheck={false} />
                    </div>
                  </div>
                )}
                {dane.kody.strony.filter((s) => s.head.trim() || s.body.trim()).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Podstrony z własnym kodem</h3>
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {dane.kody.strony
                        .filter((s) => s.head.trim() || s.body.trim())
                        .map((s) => (
                          <li key={s.sciezka} className="py-2 flex items-center justify-between gap-2">
                            <button type="button" onClick={() => setStronaTekst(s.sciezka)} className="text-left underline truncate">
                              {stronyPoSciezce.get(s.sciezka)?.nazwa ?? s.sciezka}
                            </button>
                            <button
                              type="button"
                              onClick={() => zmien((d) => ({ ...d, kody: { ...d.kody, strony: d.kody.strony.filter((x) => x.sciezka !== s.sciezka) } }))}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                              aria-label="Usuń kod tej podstrony"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ===================== SEO I REKLAMY ===================== */}
          {zakladka === 'seo' && (
            <>
              <section className={karta}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Fuel className="w-5 h-5 text-rust-600" aria-hidden="true" /> Ceny paliw do kalkulatorów
                </h2>
                <p className="text-xs text-slate-500">
                  Używają ich kalkulator kosztu trasy i kosztów utrzymania. Wpisuj średnie ceny w Polsce (np. z e-petrol.pl) raz na 2–4 tygodnie. Odwiedzający i tak mogą wpisać własną cenę.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      ['pb95', 'Benzyna Pb95 (zł/l)'],
                      ['on', 'Diesel (zł/l)'],
                      ['lpg', 'LPG (zł/l)'],
                      ['prad', 'Prąd (zł/kWh)']
                    ] as const
                  ).map(([k, n]) => (
                    <div key={`${k}-${dane.ceny[k]}`}>
                      <label htmlFor={`cena-${k}`} className={etykieta}>
                        {n}
                      </label>
                      <input
                        id={`cena-${k}`}
                        inputMode="decimal"
                        defaultValue={String(dane.ceny[k]).replace('.', ',')}
                        onBlur={(e) => {
                          const x = Number(e.target.value.replace(',', '.'));
                          if (x > 0 && x !== dane.ceny[k]) zmien((d) => ({ ...d, ceny: { ...d.ceny, [k]: x, data: new Date().toISOString().slice(0, 10) } }));
                        }}
                        className={input}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">Ceny z dnia: {new Date(dane.ceny.data).toLocaleDateString('pl-PL')} (zmienia się sama, gdy wpiszesz nową cenę).</p>
                {Date.now() - Date.parse(dane.ceny.data) > 30 * 86400000 && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Ceny są starsze niż miesiąc – wpisz aktualne (np. z e-petrol.pl) i kliknij „Zapisz zmiany”.
                  </p>
                )}
              </section>

              <section className={karta}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <Search className="w-5 h-5 text-steel-600" aria-hidden="true" /> Google Search Console i Analytics
                </h2>
                <Pole
                  id="s-gsc"
                  label="Kod weryfikacyjny Google Search Console (sam kod albo cały tag <meta …>)"
                  value={dane.seo.gsc}
                  onChange={(v) => zmien((d) => ({ ...d, seo: { ...d.seo, gsc: v } }))}
                  placeholder='np. AbC123… albo <meta name="google-site-verification" content="…" />'
                />
                <Pole id="s-ga4" label="Identyfikator Google Analytics 4 (opcjonalnie)" value={dane.seo.ga4} onChange={(v) => zmien((d) => ({ ...d, seo: { ...d.seo, ga4: v } }))} placeholder="G-XXXXXXXXXX" />
                <p className="text-xs text-slate-500">
                  Po wpisaniu GA4 kliknięcia w linki partnerskie trafiają do Analytics jako zdarzenie <code>klik_partner</code>. GA4 działa w trybie zgód Google (Consent Mode v2) – bez zgody
                  użytkownika nie zapisuje ciasteczek. Mapa strony do zgłoszenia w Search Console: <code>{site.url}/sitemap.xml</code>
                </p>
              </section>

              <MapaStrony token={token} />
              <RaportGoogle token={token} />

              <section className={karta}>
                <Przelacznik label="Reklamy Google AdSense" wlaczony={dane.moduly.adsense.wlaczony} onChange={(v) => ustawModul('adsense', 'wlaczony', v)} />
                <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3 space-y-1">
                  <p>
                    <strong>Przed włączeniem:</strong> w AdSense wejdź w „Prywatność i wiadomości” → „Europejskie przepisy” i opublikuj wiadomość o zgodzie (to certyfikowany baner Google,
                    wymagany w UE). Zaktualizuj też politykę prywatności – strona przestanie być „bez ciasteczek”.
                  </p>
                </div>
                <Pole id="ad-k" label="Identyfikator wydawcy (data-ad-client)" value={dane.moduly.adsense.klient} onChange={(v) => ustawModul('adsense', 'klient', v)} placeholder="ca-pub-1234567890123456" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Pole id="ad-1" label="Blok: pod nagłówkiem (komputer)" value={dane.moduly.adsense.slotGora} onChange={(v) => ustawModul('adsense', 'slotGora', v)} placeholder="data-ad-slot" />
                  <Pole id="ad-2" label="Blok: w danych technicznych" value={dane.moduly.adsense.slotSpec} onChange={(v) => ustawModul('adsense', 'slotSpec', v)} placeholder="data-ad-slot" />
                  <Pole id="ad-3" label="Blok: na dole karty" value={dane.moduly.adsense.slotDol} onChange={(v) => ustawModul('adsense', 'slotDol', v)} placeholder="data-ad-slot" />
                </div>
                <div>
                  <label htmlFor="s-ads" className={etykieta}>
                    Treść pliku ads.txt ({site.url.replace("https://", "")}/ads.txt)
                  </label>
                  <textarea
                    id="s-ads"
                    value={dane.seo.adsTxt}
                    onChange={(e) => zmien((d) => ({ ...d, seo: { ...d.seo, adsTxt: e.target.value } }))}
                    className={kodInput}
                    spellCheck={false}
                    placeholder="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
                  />
                </div>
              </section>
            </>
          )}

          {/* ===================== AKTUALIZACJE ===================== */}
          {zakladka === 'statystyki' && <Statystyki token={token} />}
          {zakladka === 'aktualizacje' && <Aktualizacje api={api} branch={branch} stanDanych={stanDanych} />}
          {zakladka === 'artykuly' && <ArtykulyFilmow api={api} branch={branch} modele={modele} />}
          {zakladka === 'aktualnosci' && <AktualnosciAdmin api={api} branch={branch} token={token} />}
          {zakladka === 'social' && <Social api={api} repo={repo} />}
          {zakladka === 'produkty' && <ProduktyRankingi api={api} branch={branch} />}
          {zakladka === 'chinskie' && <ChinskieAuta api={api} branch={branch} nazwy={nazwyModeli} />}
          {zakladka === 'silniki' && <Silniki api={api} branch={branch} nazwy={nazwyModeli} uzycia={uzyciaSilnikow()} token={token} modele={modele} pokrycie={pokrycie} />}
          {zakladka === 'wyglad' && <LogoIkona api={api} branch={branch} marka={dane.marka} zmiany={zmiany} onZapisano={wczytaj} />}

          {/* ===================== OPISY ===================== */}
          {zakladka === 'opisy' && (
            <section className={karta}>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <FileText className="w-5 h-5 text-steel-600" aria-hidden="true" /> Opisy modeli do przejrzenia
              </h2>
              <p className="text-xs text-slate-500">
                Opisy przygotowane automatycznie pojawią się na stronie dopiero po zaznaczeniu „Zatwierdzony”. Przeczytaj każdy – jeśli coś się nie zgadza z Twoją wiedzą, nie zatwierdzaj i
                daj znać, poprawimy. Zatwierdzono: {dane.opisyZatwierdzone.length} z {szkice.length}.
              </p>
              {szkice.length === 0 && <p className="text-sm text-slate-500">Brak szkiców opisów.</p>}
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {szkice.map((s) => {
                  const ok = dane.opisyZatwierdzone.includes(s.slug);
                  return (
                    <li key={s.slug} className="py-3 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <button type="button" onClick={() => setOtwartySzkic(otwartySzkic === s.slug ? '' : s.slug)} className="text-left font-semibold text-sm underline">
                          {s.nazwa}
                        </button>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={ok}
                            onChange={(e) =>
                              zmien((d) => ({
                                ...d,
                                opisyZatwierdzone: e.target.checked ? [...d.opisyZatwierdzone, s.slug] : d.opisyZatwierdzone.filter((x) => x !== s.slug)
                              }))
                            }
                          />
                          Zatwierdzony
                        </label>
                      </div>
                      {otwartySzkic === s.slug && (
                        <div className="text-sm space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 whitespace-pre-line">
                          {s.wstep && (
                            <div>
                              <strong>O modelu (generacje, silniki)</strong>
                              <div>{s.wstep}</div>
                            </div>
                          )}
                          <div>
                            <strong>Eksploatacja i newralgiczne punkty</strong>
                            <div>{s.eksploatacja}</div>
                          </div>
                          <div>
                            <strong>Koszty serwisu</strong>
                            <div>{s.koszty}</div>
                          </div>
                          <div>
                            <strong>Podsumowanie rynkowe</strong>
                            <div>{s.podsumowanie}</div>
                          </div>
                          {s.zrodla && s.zrodla.length > 0 && (
                            <div>
                              <strong>Źródła</strong>
                              <ul className="list-disc pl-5">
                                {s.zrodla.map((z) => (
                                  <li key={z.url}>
                                    <a href={z.url} target="_blank" rel="noopener noreferrer" className="underline">
                                      {z.nazwa}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* pasek zapisu ustawień panelu – zakładki z własnymi plikami (artykuły, produkty, aktualizacje…) mają własne przyciski */}
          {zmiany && !['artykuly', 'aktualnosci', 'social', 'produkty', 'aktualizacje', 'wyglad', 'statystyki', 'chinskie', 'silniki'].includes(zakladka) && (
            <div className="sticky bottom-4 z-10">
              <div className="flex items-center justify-between gap-3 rounded-2xl pl-4 pr-2 py-2 bg-slate-900/95 text-white ring-1 ring-slate-900 shadow-xl backdrop-blur dark:bg-slate-800/95 dark:ring-slate-700">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" /> Niezapisane zmiany
                </span>
                <button
                  type="button"
                  onClick={zapisz}
                  disabled={praca}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
                >
                  <Save className="w-4 h-4" aria-hidden="true" /> Zapisz zmiany
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
