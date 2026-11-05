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
import ArtykulyFilmow from '@/components/admin/ArtykulyFilmow';
import AktualnosciAdmin from '@/components/admin/Aktualnosci';
import ProduktyRankingi from '@/components/admin/ProduktyRankingi';
import OpisFilmu from '@/components/admin/OpisFilmu';
import LogoIkona, { type Marka } from '@/components/admin/LogoIkona';
import { site } from '@/config/site';
import {
  KeyRound, Link2, Film, Save, Trash2, Plus, RefreshCw, CheckCircle2, AlertTriangle, LogOut, Code2, Megaphone, Search, FileText, ArrowUp, ArrowDown, Ban, Database, Package, Clapperboard, Newspaper,
  Fuel,
  Palette
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
type Szkic = { slug: string; nazwa: string; adres: string; eksploatacja: string; koszty: string; podsumowanie: string; wygenerowano: string };

const PLIK = 'data/panel.json';
const K_TOKEN = 'atlas-admin-token';
const K_REPO = 'atlas-admin-repo';

const input =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const kodInput = `${input} font-mono text-xs min-h-[120px]`;
const karta = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';

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
      opony: { wlaczony: true, partner: '', url: '', zimowe: '', letnie: '', ...m.opony }
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

type Zakladka = 'linki' | 'filmy' | 'artykuly' | 'aktualnosci' | 'produkty' | 'kody' | 'seo' | 'opisy' | 'aktualizacje' | 'wyglad';

export default function AdminPanel({
  modele,
  strony,
  szkice,
  stanDanych,
  repo: repoDomyslne,
  branch
}: {
  modele: ModelOpcja[];
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
  const stronyPoEtykiecie = useMemo(() => new Map(strony.map((s) => [`${s.nazwa} (${s.sciezka})`, s])), [strony]);
  const stronyPoSciezce = useMemo(() => new Map(strony.map((s) => [s.sciezka, s])), [strony]);
  const wybranyModel = poNazwie.get(modelTekst.trim());
  const wybranaStrona = stronyPoEtykiecie.get(stronaTekst.trim()) || stronyPoSciezce.get(stronaTekst.trim());
  const id = ytId(link);

  useEffect(() => {
    setToken(pamiec.get(K_TOKEN));
    setZapamietaj(pamiec.trwaly(K_TOKEN));
    setRepo(pamiec.get(K_REPO) || repoDomyslne);
  }, [repoDomyslne]);

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
      ['Opony letnie', d.moduly.opony.letnie]
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

  const zakladki: [Zakladka, string, React.ReactNode][] = [
    ['linki', 'Linki i moduły', <Link2 key="i" className="w-4 h-4" />],
    ['filmy', 'Filmy na kartach', <Film key="i" className="w-4 h-4" />],
    ['artykuly', 'Artykuły z filmów', <Clapperboard key="i" className="w-4 h-4" />],
    ['aktualnosci', 'Aktualności', <Newspaper key="i" className="w-4 h-4" />],
    ['produkty', 'Produkty i rankingi', <Package key="i" className="w-4 h-4" />],
    ['kody', 'Kody', <Code2 key="i" className="w-4 h-4" />],
    ['seo', 'SEO, reklamy i ceny', <Megaphone key="i" className="w-4 h-4" />],
    ['opisy', `Opisy (${szkice.length})`, <FileText key="i" className="w-4 h-4" />],
    ['aktualizacje', 'Aktualizacje danych', <Database key="i" className="w-4 h-4" />],
    ['wyglad', 'Logo i ikona', <Palette key="i" className="w-4 h-4" />]
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Panel admina</h1>
        <p className="text-sm text-slate-500 mt-1">Linki partnerskie, moduły, kody, filmy i opisy. Zmiany pojawiają się na stronie po kilku minutach.</p>
      </header>

      {status && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            status.typ === 'ok'
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
              : status.typ === 'blad'
              ? 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
              : 'bg-steel-50 text-steel-900 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          {status.typ === 'ok' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : status.typ === 'blad' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <RefreshCw className="w-5 h-5 flex-shrink-0" />}
          <span>{status.tekst}</span>
        </div>
      )}

      {/* Logowanie */}
      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <KeyRound className="w-5 h-5 text-steel-600" aria-hidden="true" /> Dostęp
        </h2>
        <div>
          <label htmlFor="a-token" className={etykieta}>
            Token GitHub (instrukcja w pliku README)
          </label>
          <input id="a-token" type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} className={input} placeholder="github_pat_…" />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={zapamietaj} onChange={(e) => setZapamietaj(e.target.checked)} className="mt-0.5" />
          <span>
            Zapamiętaj token na tym komputerze
            <span className="block text-xs text-slate-500">Zaznacz tylko na własnym komputerze. Bez zaznaczenia token zniknie po zamknięciu karty przeglądarki.</span>
          </span>
        </label>
        <Pole id="a-repo" label="Repozytorium (login/nazwa)" value={repo} onChange={setRepo} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={wczytaj}
            disabled={!token.trim() || praca}
            className="inline-flex items-center gap-2 bg-steel-600 hover:bg-steel-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> {dane ? 'Wczytaj ponownie' : 'Połącz'}
          </button>
          {token && (
            <button type="button" onClick={wyloguj} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800">
              <LogOut className="w-4 h-4" aria-hidden="true" /> Usuń token z tej przeglądarki
            </button>
          )}
        </div>
      </section>

      {dane && (
        <>
          <nav className="flex flex-wrap gap-2" aria-label="Zakładki panelu">
            {zakladki.map(([k, nazwa, ikona]) => (
              <button
                key={k}
                type="button"
                onClick={() => setZakladka(k)}
                aria-pressed={zakladka === k}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border ${
                  zakladka === k
                    ? 'bg-steel-700 text-white border-steel-700'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                {ikona} {nazwa}
              </button>
            ))}
          </nav>

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
          {zakladka === 'aktualizacje' && <Aktualizacje api={api} branch={branch} stanDanych={stanDanych} />}
          {zakladka === 'artykuly' && <ArtykulyFilmow api={api} branch={branch} modele={modele} />}
          {zakladka === 'aktualnosci' && <AktualnosciAdmin api={api} branch={branch} />}
          {zakladka === 'produkty' && <ProduktyRankingi api={api} branch={branch} />}
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
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* przycisk zapisu ustawień panelu – zakładki z własnymi plikami (artykuły, produkty, aktualizacje) mają własne przyciski */}
          <div className={`sticky bottom-4 flex justify-end ${['artykuly', 'aktualnosci', 'produkty', 'aktualizacje', 'wyglad'].includes(zakladka) ? 'hidden' : ''}`}>
            <button
              type="button"
              onClick={zapisz}
              disabled={!zmiany || praca}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
            >
              <Save className="w-5 h-5" aria-hidden="true" /> {zmiany ? 'Zapisz zmiany' : 'Brak zmian do zapisania'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
