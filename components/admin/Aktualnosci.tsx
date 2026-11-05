'use client';
// Zakładka „Aktualności”: szkice z automatu (akcje serwisowe, komunikaty, premiery) – czytasz, poprawiasz i publikujesz.
import { useEffect, useState } from 'react';
import { RefreshCw, Play, Save, Send, Trash2, X, ExternalLink, Newspaper, Undo2, CircleCheck, CircleAlert, ImagePlus } from 'lucide-react';
import { ApiPelne, input, etykieta, karta, przyciskG, przyciskD, czytajJson, zapiszPlik } from '@/components/admin/wspolne';

type Pozycja = { marka: string; model: string; problem: string; zalecenie: string; produkcja?: string; kodAkcji?: string; poziom?: string; kraj?: string; link: string; karta?: string };
type Wpis = {
  slug: string;
  typ: 'akcje-serwisowe' | 'komunikaty' | 'premiery';
  tytul: string;
  lead: string;
  data: string;
  tresc: string;
  zrodla: { nazwa: string; url: string }[];
  licencja?: string;
  modele?: string[];
  marki?: string[];
  pozycje?: Pozycja[];
  zdjecie?: Zdjecie;
  status: 'szkic' | 'opublikowany';
  wygenerowano?: string;
  bezAI?: boolean;
};
type Zdjecie = { duze: string; male: string; szerokosc: number; wysokosc: number; alt: string; podpis: string };
type Przygotowane = { duze: string; male: string; szerokosc: number; wysokosc: number; zrodloSzer: number; podglad: string };

const PODPIS_DOMYSLNY = 'Fot. Marcin Szczepiński / MotoRaport';

/** Plik → data URL (blob: jest zablokowany przez zabezpieczenia strony, data: jest dozwolone) */
const czytajPlik = (f: File) =>
  new Promise<string>((ok, zle) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = () => zle(new Error('Nie mogę odczytać pliku'));
    r.readAsDataURL(f);
  });
const wczytajObraz = (src: string) =>
  new Promise<HTMLImageElement>((ok, zle) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => zle(new Error('To nie jest obsługiwany obraz (użyj JPG, PNG lub WebP)'));
    i.src = src;
  });
/** Zmniejsza zdjęcie do podanej szerokości i zapisuje jako JPG (base64 bez nagłówka) */
function zmniejsz(img: HTMLImageElement, maxW: number): { b64: string; w: number; h: number; dataUrl: string } {
  const w = Math.min(maxW, img.naturalWidth);
  const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = c.toDataURL('image/jpeg', 0.82);
  return { b64: dataUrl.split(',')[1], w, h, dataUrl };
}
type Plik = { wpis: Wpis; sha: string };
type Raport = { data: string; ai: boolean; zrodla: { nazwa: string; ok: boolean; nowe: number; szkice: number; blad?: string }[] };

const WORKFLOW = 'aktualnosci.yml';
const NAZWY = { 'akcje-serwisowe': 'Akcja serwisowa', komunikaty: 'Komunikat', premiery: 'Premiera' } as const;
const KOLORY = { 'akcje-serwisowe': 'bg-amber-100 text-amber-900', komunikaty: 'bg-sky-100 text-sky-900', premiery: 'bg-violet-100 text-violet-900' } as const;

export default function Aktualnosci({ api, branch }: { api: ApiPelne; branch: string }) {
  const [pliki, setPliki] = useState<Plik[] | null>(null);
  const [raport, setRaport] = useState<Raport | null>(null);
  const [otwarty, setOtwarty] = useState('');
  const [w, setW] = useState<Wpis | null>(null);
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);
  const [foto, setFoto] = useState<Przygotowane | null>(null);
  const [fotoAlt, setFotoAlt] = useState('');
  const [fotoPodpis, setFotoPodpis] = useState(PODPIS_DOMYSLNY);
  const [fotoPrawa, setFotoPrawa] = useState(false);

  async function wczytaj() {
    try {
      const lista: { name: string; path: string; type: string }[] = await api(`/contents/data/aktualnosci?ref=${branch}`).catch(() => []);
      const jsony = lista.filter((x) => x.type === 'file' && x.name.endsWith('.json') && !x.name.startsWith('_') && !x.name.startsWith('.'));
      const wynik = await Promise.all(jsony.map(async (x) => {
        const { dane, sha } = await czytajJson<Wpis>(api, x.path, branch);
        return { wpis: dane, sha };
      }));
      // szkice na górze, potem najnowsze
      wynik.sort((a, b) => Number(a.wpis.status === 'opublikowany') - Number(b.wpis.status === 'opublikowany') || (b.wpis.data || '').localeCompare(a.wpis.data || ''));
      setPliki(wynik);
      if (lista.some((x) => x.name === '_raport.json')) setRaport((await czytajJson<Raport>(api, 'data/aktualnosci/_raport.json', branch)).dane);
    } catch (e) {
      setPliki([]);
      setKom({ ok: false, tekst: `Nie mogę wczytać aktualności: ${(e as Error).message}` });
    }
  }
  useEffect(() => {
    wczytaj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function otworz(p: Plik) {
    setOtwarty(p.wpis.slug);
    setW(JSON.parse(JSON.stringify(p.wpis)));
    setKom(null);
    setFoto(null);
    setFotoAlt(p.wpis.zdjecie?.alt || '');
    setFotoPodpis(p.wpis.zdjecie?.podpis || PODPIS_DOMYSLNY);
    setFotoPrawa(false);
  }

  async function wybierzZdjecie(f?: File) {
    if (!f) return;
    try {
      const img = await wczytajObraz(await czytajPlik(f));
      const duze = zmniejsz(img, 1600);
      const male = zmniejsz(img, 800);
      setFoto({ duze: duze.b64, male: male.b64, szerokosc: duze.w, wysokosc: duze.h, zrodloSzer: img.naturalWidth, podglad: male.dataUrl });
      setKom(null);
    } catch (e) {
      setKom({ ok: false, tekst: (e as Error).message });
    }
  }

  async function usunPlik(sciezka: string, opis: string) {
    try {
      const { sha } = await api(`/contents/${sciezka}?ref=${branch}`);
      await api(`/contents/${sciezka}`, 'DELETE', { message: opis, sha, branch });
    } catch {
      /* pliku już nie ma */
    }
  }
  const sciezkaPliku = (adres: string) => `public${adres.split('?')[0]}`;
  const b64Tekst = (t: string) => {
    const b = new TextEncoder().encode(t);
    let x = '';
    b.forEach((c) => (x += String.fromCharCode(c)));
    return btoa(x);
  };

  /** Jeden commit: zdjęcia + plik wpisu (+ usunięcie starych zdjęć) – strona przebudowuje się tylko raz */
  async function jedenCommit(zmiany: { sciezka: string; b64: string | null }[], opis: string) {
    const apiX = api as unknown as (s: string, m?: string, b?: object) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    const ref = await apiX(`/git/ref/heads/${branch}`);
    const rodzic = ref.object.sha as string;
    const commit = await apiX(`/git/commits/${rodzic}`);
    const drzewo = [];
    for (const z of zmiany) {
      if (z.b64 === null) drzewo.push({ path: z.sciezka, mode: '100644', type: 'blob', sha: null });
      else {
        const blob = await apiX('/git/blobs', 'POST', { content: z.b64, encoding: 'base64' });
        drzewo.push({ path: z.sciezka, mode: '100644', type: 'blob', sha: blob.sha });
      }
    }
    const nowe = await apiX('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: drzewo });
    const nowyC = await apiX('/git/commits', 'POST', { message: `Panel: ${opis}`, tree: nowe.sha, parents: [rodzic] });
    await apiX(`/git/refs/heads/${branch}`, 'PATCH', { sha: nowyC.sha });
  }
  /** Po commicie przez Git API – odśwież sha pliku wpisu, żeby kolejne zapisy działały */
  async function poZapisie(nowy: Wpis, komunikat: string) {
    const { sha } = await api(`/contents/data/aktualnosci/${nowy.slug}.json?ref=${branch}`);
    setPliki((pl) => (pl || []).map((x) => (x.wpis.slug === nowy.slug ? { wpis: nowy, sha } : x)));
    setW(nowy);
    setKom({ ok: true, tekst: `${komunikat}${nowy.status === 'opublikowany' ? ' Na stronie zmiana pojawi się po przebudowie (kilka minut).' : ''}` });
  }
  /** Czy plik istnieje w repozytorium (usuwanie nieistniejącego pliku w drzewie kończy się błędem) */
  async function istnieje(sciezka: string) {
    try {
      await api(`/contents/${sciezka}?ref=${branch}`);
      return true;
    } catch {
      return false;
    }
  }

  /** Wgrywa zdjęcie (2 rozmiary) i zapisuje wpis z nowym zdjęciem – jednym commitem */
  async function wgrajZdjecie() {
    if (!w || !foto) return;
    if (!fotoPrawa) return setKom({ ok: false, tekst: 'Potwierdź, że to Twoje zdjęcie albo masz prawo go użyć.' });
    if (fotoAlt.trim().length < 10) return setKom({ ok: false, tekst: 'Opisz, co jest na zdjęciu (np. „Nowy Peugeot 208 w kolorze czerwonym, widok z przodu”) – to ważne dla Google i osób niewidomych.' });
    setPraca(true);
    try {
      const znak = Date.now().toString(36);
      const duze = `/aktualnosci/${w.slug}-${znak}.jpg`;
      const male = `/aktualnosci/${w.slug}-${znak}-m.jpg`;
      const nowy: Wpis = { ...w, zdjecie: { duze, male, szerokosc: foto.szerokosc, wysokosc: foto.wysokosc, alt: fotoAlt.trim(), podpis: fotoPodpis.trim() } };
      const zmiany: { sciezka: string; b64: string | null }[] = [
        { sciezka: sciezkaPliku(duze), b64: foto.duze },
        { sciezka: sciezkaPliku(male), b64: foto.male },
        { sciezka: `data/aktualnosci/${w.slug}.json`, b64: b64Tekst(JSON.stringify(nowy, null, 2) + '\n') }
      ];
      for (const stary of w.zdjecie ? [w.zdjecie.duze, w.zdjecie.male] : []) if (await istnieje(sciezkaPliku(stary))) zmiany.push({ sciezka: sciezkaPliku(stary), b64: null });
      await jedenCommit(zmiany, `zdjęcie do „${w.tytul}”`);
      await poZapisie(nowy, 'Zdjęcie zapisane.');
      setFoto(null);
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się wgrać zdjęcia: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function usunZdjecie() {
    if (!w?.zdjecie || !window.confirm('Usunąć zdjęcie z tego wpisu?')) return;
    setPraca(true);
    try {
      const bez = { ...w };
      delete bez.zdjecie;
      const zmiany: { sciezka: string; b64: string | null }[] = [{ sciezka: `data/aktualnosci/${w.slug}.json`, b64: b64Tekst(JSON.stringify(bez, null, 2) + '\n') }];
      for (const stary of [w.zdjecie.duze, w.zdjecie.male]) if (await istnieje(sciezkaPliku(stary))) zmiany.push({ sciezka: sciezkaPliku(stary), b64: null });
      await jedenCommit(zmiany, `usunięto zdjęcie z „${w.tytul}”`);
      await poZapisie(bez, 'Zdjęcie usunięte.');
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  const ustaw = (zm: Partial<Wpis>) => w && setW({ ...w, ...zm });
  const ustawPozycje = (i: number, zm: Partial<Pozycja>) => w?.pozycje && setW({ ...w, pozycje: w.pozycje.map((p, j) => (j === i ? { ...p, ...zm } : p)) });

  async function zapisz(status?: Wpis['status']) {
    if (!w || !pliki) return;
    const p = pliki.find((x) => x.wpis.slug === otwarty);
    const nowy: Wpis = { ...w, ...(status ? { status } : {}) };
    if (nowy.status === 'opublikowany') {
      if (!nowy.tytul.trim() || !nowy.lead.trim() || !nowy.tresc.trim()) return setKom({ ok: false, tekst: 'Przed publikacją uzupełnij tytuł, wstęp i treść.' });
      if (nowy.bezAI || /Do uzupełnienia/.test(nowy.tresc)) return setKom({ ok: false, tekst: 'Ten szkic powstał bez modelu językowego – najpierw napisz treść i przetłumacz opisy usterek.' });
      delete nowy.bezAI;
    }
    setPraca(true);
    try {
      const sha = await zapiszPlik(api, `data/aktualnosci/${nowy.slug}.json`, JSON.stringify(nowy, null, 2) + '\n', `Panel: aktualność „${nowy.tytul}”${status === 'opublikowany' ? ' – publikacja' : ''}`, branch, p?.sha);
      setPliki(pliki.map((x) => (x.wpis.slug === nowy.slug ? { wpis: nowy, sha } : x)));
      setW(nowy);
      setKom({ ok: true, tekst: nowy.status === 'opublikowany' ? 'Opublikowano. Wpis pojawi się na stronie po przebudowie (kilka minut).' : 'Zapisano szkic – na stronie go nie widać.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się zapisać: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function usun() {
    if (!w || !pliki) return;
    const p = pliki.find((x) => x.wpis.slug === otwarty);
    if (!p || !window.confirm(`Usunąć „${p.wpis.tytul}”? Automat nie utworzy go ponownie.`)) return;
    setPraca(true);
    try {
      await api(`/contents/data/aktualnosci/${p.wpis.slug}.json`, 'DELETE', { message: `Panel: usunięto aktualność „${p.wpis.tytul}”`, sha: p.sha, branch });
      if (p.wpis.zdjecie) {
        await usunPlik(sciezkaPliku(p.wpis.zdjecie.duze), 'Panel: usunięto zdjęcie');
        await usunPlik(sciezkaPliku(p.wpis.zdjecie.male), 'Panel: usunięto miniaturę');
      }
      setPliki(pliki.filter((x) => x !== p));
      setOtwarty('');
      setW(null);
      setKom({ ok: true, tekst: 'Usunięto.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się usunąć: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function uruchom() {
    setPraca(true);
    try {
      await api(`/actions/workflows/${WORKFLOW}/dispatches`, 'POST', { ref: branch });
      setKom({ ok: true, tekst: 'Automat sprawdza źródła. Za 2–5 minut kliknij „Odśwież listę”.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się uruchomić: ${(e as Error).message} Sprawdź, czy token ma uprawnienie „Actions: Read and write”.` });
    } finally {
      setPraca(false);
    }
  }

  const szkice = pliki?.filter((p) => p.wpis.status === 'szkic').length || 0;

  return (
    <div className="space-y-4">
      {kom && <div role="status" className={`rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'}`}>{kom.tekst}</div>}

      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Newspaper className="w-5 h-5 text-steel-600" aria-hidden="true" /> Aktualności {szkice > 0 && <span className="text-xs font-bold bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">{szkice} do sprawdzenia</span>}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Automat codziennie rano sprawdza oficjalne źródła: akcje serwisowe z unijnego systemu Safety Gate, komunikaty urzędów z gov.pl i informacje prasowe producentów. Z ważnych
          rzeczy pisze <strong>szkic własnymi słowami</strong>. Ty czytasz, poprawiasz i klikasz <strong>Opublikuj</strong>. Najlepiej 2–5 wpisów tygodniowo – liczy się jakość.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={uruchom} disabled={praca} className={przyciskG}>
            <Play className="w-4 h-4" aria-hidden="true" /> Sprawdź źródła teraz
          </button>
          <button type="button" onClick={wczytaj} disabled={praca} className={przyciskD}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Odśwież listę
          </button>
        </div>

        {raport && (
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">
              Ostatnie sprawdzenie: {new Date(raport.data).toLocaleString('pl-PL')} {raport.ai ? '' : '– bez klucza modelu językowego'}
            </summary>
            <ul className="mt-2 space-y-1">
              {raport.zrodla.map((z) => (
                <li key={z.nazwa} className="flex items-start gap-2">
                  {z.ok ? <CircleCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" /> : <CircleAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />}
                  <span>
                    <strong>{z.nazwa}</strong>: nowych {z.nowe}, szkiców {z.szkice}
                    {z.blad ? <span className="block text-xs text-rose-700">{z.blad}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {pliki === null && <p className="text-sm text-slate-500">Wczytuję…</p>}
        {pliki && pliki.length === 0 && <p className="text-sm text-slate-500">Nie ma jeszcze szkiców. Kliknij „Sprawdź źródła teraz” albo poczekaj do jutra rana.</p>}
        {pliki && pliki.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {pliki.map((p) => (
              <li key={p.wpis.slug}>
                <button type="button" onClick={() => otworz(p)} className={`w-full text-left py-2.5 flex items-center justify-between gap-3 ${otwarty === p.wpis.slug ? 'font-bold' : ''}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-slate-900 dark:text-white">{p.wpis.tytul}</span>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${KOLORY[p.wpis.typ]}`}>{NAZWY[p.wpis.typ]}</span>
                      {p.wpis.data}
                      {p.wpis.bezAI ? ' • bez tekstu – do uzupełnienia' : ''}
                    </span>
                  </span>
                  <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${p.wpis.status === 'opublikowany' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {p.wpis.status === 'opublikowany' ? 'na stronie' : 'szkic'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {w && (
        <section className={karta}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${KOLORY[w.typ]}`}>{NAZWY[w.typ]}</span>
            {w.zrodla.map((z) => (
              <a key={z.url} href={z.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 underline">
                źródło: {z.nazwa.slice(0, 60)} <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            ))}
            {w.status === 'opublikowany' && (
              <a href={`/aktualnosci/${w.slug}/`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 underline font-semibold">
                zobacz na stronie <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </div>

          <div>
            <label className={etykieta} htmlFor="a-t">Tytuł (do ok. 70 znaków)</label>
            <input id="a-t" className={input} value={w.tytul} onChange={(e) => ustaw({ tytul: e.target.value })} />
            <p className="text-[11px] text-slate-500 mt-1">{w.tytul.length} znaków</p>
          </div>
          <div>
            <label className={etykieta} htmlFor="a-l">Wstęp (1–2 zdania, opis w Google)</label>
            <textarea id="a-l" className={`${input} min-h-[60px]`} value={w.lead} onChange={(e) => ustaw({ lead: e.target.value })} />
          </div>
          <div>
            <label className={etykieta} htmlFor="a-d">Data</label>
            <input id="a-d" type="date" className={`${input} max-w-[12rem]`} value={w.data} onChange={(e) => ustaw({ data: e.target.value })} />
          </div>
          <div>
            <label className={etykieta} htmlFor="a-tr">Treść – „## Nagłówek”, „- punkt”, **pogrubienie**</label>
            <textarea id="a-tr" className={`${input} min-h-[260px] leading-relaxed`} value={w.tresc} onChange={(e) => ustaw({ tresc: e.target.value })} />
            <p className="text-[11px] text-slate-500 mt-1">{w.tresc.split(/\s+/).filter(Boolean).length} słów</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <span className={etykieta}>Zdjęcie (opcjonalnie) – tylko Twoje własne, np. kadr z filmu albo zdjęcie z prezentacji auta</span>
            {w.zdjecie && !foto && (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.zdjecie.male} alt={w.zdjecie.alt} className="w-full max-w-sm rounded-lg" />
                <p className="text-xs text-slate-500">{w.zdjecie.podpis} · {w.zdjecie.szerokosc}×{w.zdjecie.wysokosc} px</p>
                <button type="button" onClick={usunZdjecie} disabled={praca} className={`${przyciskD} text-rose-700`}>
                  <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń zdjęcie
                </button>
              </div>
            )}
            <label className={`${przyciskD} cursor-pointer`}>
              <ImagePlus className="w-4 h-4" aria-hidden="true" /> {w.zdjecie ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => wybierzZdjecie(e.target.files?.[0])} />
            </label>
            {foto && (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.podglad} alt="Podgląd" className="w-full max-w-sm rounded-lg" />
                {foto.zrodloSzer < 1200 && (
                  <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                    Zdjęcie ma tylko {foto.zrodloSzer} px szerokości. Google Discover pokazuje zdjęcia od 1200 px – jeśli możesz, użyj większego.
                  </p>
                )}
                <div>
                  <label className={etykieta} htmlFor="z-alt">Co jest na zdjęciu? (opis dla Google i osób niewidomych)</label>
                  <input id="z-alt" className={input} value={fotoAlt} onChange={(e) => setFotoAlt(e.target.value)} placeholder="np. Nowy Peugeot 208 w kolorze czerwonym, widok z przodu" />
                </div>
                <div>
                  <label className={etykieta} htmlFor="z-pod">Podpis pod zdjęciem</label>
                  <input id="z-pod" className={input} value={fotoPodpis} onChange={(e) => setFotoPodpis(e.target.value)} />
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={fotoPrawa} onChange={(e) => setFotoPrawa(e.target.checked)} className="mt-1" />
                  <span>To moje zdjęcie albo mam pisemną zgodę na jego użycie. Nie wgrywam zdjęć z internetu ani z biur prasowych.</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={wgrajZdjecie} disabled={praca} className={przyciskG}>
                    <ImagePlus className="w-4 h-4" aria-hidden="true" /> Wgraj zdjęcie
                  </button>
                  <button type="button" onClick={() => setFoto(null)} disabled={praca} className={przyciskD}>
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>

          {w.pozycje && w.pozycje.length > 0 && (
            <div className="space-y-3">
              <span className={etykieta}>Wezwania do serwisu ({w.pozycje.length}) – popraw tłumaczenie albo usuń pozycję</span>
              {w.pozycje.map((p, i) => (
                <div key={`${p.marka}-${p.model}-${i}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm">
                      {p.marka} {p.model} {p.produkcja ? <span className="font-normal text-slate-500">({p.produkcja})</span> : null}
                    </strong>
                    <button type="button" aria-label="Usuń pozycję" onClick={() => setW({ ...w, pozycje: w.pozycje!.filter((_, j) => j !== i) })} className="text-rose-700">
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <textarea className={`${input} min-h-[50px]`} value={p.problem} onChange={(e) => ustawPozycje(i, { problem: e.target.value })} aria-label="Problem" />
                  <input className={input} value={p.zalecenie} onChange={(e) => ustawPozycje(i, { zalecenie: e.target.value })} aria-label="Co robi producent" />
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-500">
            Zanim opublikujesz: porównaj tekst ze źródłem (link wyżej), popraw błędy i usuń to, czego nie jesteś pewien. Wpis idzie pod Twoim nazwiskiem.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => zapisz()} disabled={praca} className={przyciskD}>
              <Save className="w-4 h-4" aria-hidden="true" /> Zapisz szkic
            </button>
            {w.status !== 'opublikowany' ? (
              <button type="button" onClick={() => zapisz('opublikowany')} disabled={praca} className={przyciskG}>
                <Send className="w-4 h-4" aria-hidden="true" /> Opublikuj
              </button>
            ) : (
              <>
                <button type="button" onClick={() => zapisz()} disabled={praca} className={przyciskG}>
                  <Save className="w-4 h-4" aria-hidden="true" /> Zapisz zmiany na stronie
                </button>
                <button type="button" onClick={() => zapisz('szkic')} disabled={praca} className={przyciskD}>
                  <Undo2 className="w-4 h-4" aria-hidden="true" /> Zdejmij ze strony
                </button>
              </>
            )}
            <button type="button" onClick={usun} disabled={praca} className={`${przyciskD} text-rose-700`}>
              <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
