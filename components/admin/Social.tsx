'use client';
// Zakładka „Social”: kolejka postów MotoFormat (Instagram, TikTok, Facebook).
// Dodajesz zdjęcie albo gotowy film, wybierasz nakładkę, a Claude planuje gotowe posty w Metricool.
import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, RefreshCw, Save, Trash2, X, Plus, Download, Upload, ImagePlus, Film, Zap, CircleCheck, CircleAlert, Newspaper, Lightbulb, Shuffle, Copy } from 'lucide-react';
import Lektor from '@/components/admin/Lektor';
import { ApiPelne, input, etykieta, karta, przyciskG, przyciskD, czytajJson, zapiszPlik } from '@/components/admin/wspolne';
import {
  GALAZ_SOCIAL, PLIK_KOLEJKI, FOLDER_MEDIOW, NAZWY_UKLADOW, UKLADY_TYPU, ROZMIAR, KADR_DOMYSLNY,
  rysujPost, doPliku, base64ZPliku, nastepnyUklad, liczbaZTekstu, zaladujZasoby,
  type Kolejka, type PostSocial, type TypPostu, type Uklad, type Format, type StatusPostu, type Siec, type Kadr
} from '@/lib/social';

const NAZWY_TYPOW: Record<TypPostu, string> = { ciekawostka: 'Ciekawostka', news: 'News z rynku', pilne: 'Pilne – na już' };
const STATUSY: Record<StatusPostu, { nazwa: string; kolor: string }> = {
  szkic: { nazwa: 'Czeka na zdjęcie', kolor: 'bg-slate-100 text-slate-700' },
  gotowy: { nazwa: 'Gotowy do zaplanowania', kolor: 'bg-emerald-100 text-emerald-900' },
  zaplanowany: { nazwa: 'Zaplanowany', kolor: 'bg-sky-100 text-sky-900' },
  opublikowany: { nazwa: 'Opublikowany', kolor: 'bg-violet-100 text-violet-900' }
};
const SIECI: { k: Siec; nazwa: string }[] = [
  { k: 'instagram', nazwa: 'Instagram' },
  { k: 'tiktok', nazwa: 'TikTok' },
  { k: 'facebook', nazwa: 'Facebook' },
  { k: 'youtube', nazwa: 'YouTube Shorts (tylko film)' }
];
const BAZA_TAGOW = '#motoformat #motoryzacja #samochody #auta';
const MAKS_FILM_MB = 95;

type WpisAkt = { slug: string; typ: string; tytul: string; lead: string; data: string; status: string };

const nowyId = () => `p${Date.now().toString(36)}`;
const ileTagow = (h: string) => (h.match(/#[\p{L}\d_]+/gu) || []).length;

/** Czego brakuje, żeby post był gotowy do publikacji */
function braki(p: PostSocial): string[] {
  const b: string[] = [];
  if (!p.tytul.trim()) b.push('tytuł na grafice');
  if (p.opis.trim().length < 120) b.push('rozwinięty opis posta (min. 2–3 zdania)');
  if (ileTagow(p.hashtagi) < 6) b.push('hashtagi nawiązujące do tematu (min. 6)');
  if (!p.wskazowka?.trim()) b.push('opis proponowanego zdjęcia');
  if (!p.sieci.length) b.push('przynajmniej jedna sieć');
  return b;
}

export default function Social({ api, repo, token = '' }: { api: ApiPelne; repo: string; token?: string }) {
  const [kolejka, setKolejka] = useState<Kolejka | null>(null);
  const [sha, setSha] = useState('');
  const [blad, setBlad] = useState('');
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [praca, setPraca] = useState('');
  const [filtr, setFiltr] = useState<'wszystkie' | StatusPostu>('wszystkie');
  const [szukaj, setSzukaj] = useState('');
  const [otwarty, setOtwarty] = useState<PostSocial | null>(null);
  const [wybierzNews, setWybierzNews] = useState<WpisAkt[] | null>(null);

  async function wczytaj() {
    setBlad('');
    try {
      const { dane, sha } = await czytajJson<Kolejka>(api, PLIK_KOLEJKI, GALAZ_SOCIAL);
      setKolejka(dane);
      setSha(sha);
    } catch (e) {
      setBlad(`Nie mogę wczytać kolejki postów (gałąź „${GALAZ_SOCIAL}”): ${(e as Error).message}`);
    }
  }
  useEffect(() => {
    wczytaj();
    zaladujZasoby().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!kom) return;
    const t = setTimeout(() => setKom(null), 6000);
    return () => clearTimeout(t);
  }, [kom]);

  async function zapiszKolejke(nowa: Kolejka, opis: string) {
    // zawsze świeży sha – ktoś (np. Claude przy planowaniu) mógł w międzyczasie zmienić plik
    let aktualnySha = sha;
    try {
      aktualnySha = (await czytajJson<Kolejka>(api, PLIK_KOLEJKI, GALAZ_SOCIAL)).sha;
    } catch {}
    const s = await zapiszPlik(api, PLIK_KOLEJKI, JSON.stringify(nowa, null, 1), opis, GALAZ_SOCIAL, aktualnySha);
    setSha(s);
    setKolejka(nowa);
  }

  async function zapiszPost(p: PostSocial, opis = 'Social: zapis posta') {
    if (!kolejka) return;
    const jest = kolejka.posty.some((x) => x.id === p.id);
    const posty = jest ? kolejka.posty.map((x) => (x.id === p.id ? p : x)) : [p, ...kolejka.posty];
    await zapiszKolejke({ ...kolejka, posty }, `${opis}: ${p.tytul.slice(0, 60)}`);
  }

  async function usun(p: PostSocial) {
    if (!kolejka || !confirm(`Usunąć post „${p.tytul}”?`)) return;
    setPraca('usuwanie');
    try {
      await zapiszKolejke({ ...kolejka, posty: kolejka.posty.filter((x) => x.id !== p.id) }, `Social: usunięto ${p.tytul.slice(0, 60)}`);
      setOtwarty(null);
      setKom({ ok: true, tekst: 'Post usunięty.' });
    } catch (e) {
      setKom({ ok: false, tekst: (e as Error).message });
    }
    setPraca('');
  }

  function poprzedniUklad(typ: TypPostu) {
    return kolejka?.posty.find((x) => x.typ === typ)?.uklad;
  }

  function nowy(typ: TypPostu, z?: Partial<PostSocial>) {
    const p: PostSocial = {
      id: nowyId(),
      typ,
      uklad: typ === 'pilne' ? 'pilne' : nastepnyUklad(typ, poprzedniUklad(typ)),
      format: 'post',
      kat: typ === 'ciekawostka' ? 'Ciekawostka' : typ === 'news' ? 'Z rynku' : 'Na już',
      tytul: '',
      tekst: '',
      opis: '',
      hashtagi: BAZA_TAGOW,
      wskazowka: '',
      sieci: ['instagram'],
      status: 'szkic',
      pilne: typ === 'pilne',
      utworzono: new Date().toISOString(),
      ...z
    };
    if (typ === 'ciekawostka' && kolejka) p.nr = Math.max(0, ...kolejka.posty.map((x) => x.nr || 0)) + 1;
    setOtwarty(p);
  }

  async function pokazNewsy() {
    setPraca('newsy');
    try {
      const lista: { name: string; path: string; type: string }[] = await api(`/contents/data/aktualnosci?ref=main`);
      const pliki = lista.filter((x) => x.type === 'file' && x.name.endsWith('.json') && !x.name.startsWith('_')).slice(-40);
      const wpisy = await Promise.all(pliki.map(async (x) => (await czytajJson<WpisAkt>(api, x.path, 'main')).dane));
      setWybierzNews(wpisy.filter((w) => w.status === 'opublikowany').sort((a, b) => b.data.localeCompare(a.data)));
    } catch (e) {
      setKom({ ok: false, tekst: `Nie mogę wczytać aktualności: ${(e as Error).message}` });
    }
    setPraca('');
  }

  const widoczne = useMemo(() => {
    const q = szukaj.trim().toLowerCase();
    return (kolejka?.posty || []).filter((p) => (filtr === 'wszystkie' || p.status === filtr) && (!q || `${p.tytul} ${p.kat} ${p.nr || ''}`.toLowerCase().includes(q)));
  }, [kolejka, filtr, szukaj]);
  const liczniki = useMemo(() => {
    const l: Record<string, number> = { wszystkie: 0, szkic: 0, gotowy: 0, zaplanowany: 0, opublikowany: 0 };
    (kolejka?.posty || []).forEach((p) => {
      l.wszystkie++;
      l[p.status]++;
    });
    return l;
  }, [kolejka]);

  if (otwarty)
    return (
      <Edytor
        post={otwarty}
        api={api}
        repo={repo}
        token={token}
        onZamknij={() => setOtwarty(null)}
        onZapisz={async (p, opis) => {
          await zapiszPost(p, opis);
          setOtwarty(p);
        }}
        onUsun={kolejka?.posty.some((x) => x.id === otwarty.id) ? () => usun(otwarty) : undefined}
      />
    );

  return (
    <div className="space-y-5">
      {kom && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
          {kom.ok ? <CircleCheck className="w-4 h-4 mt-0.5" /> : <CircleAlert className="w-4 h-4 mt-0.5" />} {kom.tekst}
        </div>
      )}

      <div className={karta}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Posty MotoFormat</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Dodaj zdjęcie albo gotowy film do posta, wybierz nakładkę i zapisz – post staje się <b>gotowy</b>. Claude codziennie bierze gotowe posty i planuje je w Metricool z wyprzedzeniem. Pilny news? Zaznacz „Na już” i napisz do Claude „wrzuć pilny”.
            </p>
          </div>
          <button className={przyciskD} onClick={wczytaj}>
            <RefreshCw className="w-4 h-4" /> Odśwież
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={przyciskG} onClick={() => nowy('ciekawostka')}>
            <Lightbulb className="w-4 h-4" /> Nowa ciekawostka
          </button>
          <button className={przyciskD} onClick={pokazNewsy} disabled={praca === 'newsy'}>
            <Newspaper className="w-4 h-4" /> {praca === 'newsy' ? 'Wczytuję…' : 'Post z aktualności'}
          </button>
          <button className={przyciskD} onClick={() => nowy('news')}>
            <Plus className="w-4 h-4" /> Własny news
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-black" onClick={() => nowy('pilne')}>
            <Zap className="w-4 h-4" /> Pilne – na już
          </button>
        </div>
        {wybierzNews && (
          <div className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 p-3 space-y-1 max-h-80 overflow-auto">
            <div className="flex justify-between items-center mb-1">
              <span className={etykieta}>Wybierz opublikowany wpis</span>
              <button onClick={() => setWybierzNews(null)} aria-label="Zamknij">
                <X className="w-4 h-4" />
              </button>
            </div>
            {!wybierzNews.length && <p className="text-sm text-slate-500">Brak opublikowanych aktualności.</p>}
            {wybierzNews.map((w) => (
              <button
                key={w.slug}
                className="block w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => {
                  setWybierzNews(null);
                  nowy('news', {
                    tytul: w.tytul,
                    tekst: w.lead,
                    opis: `${w.lead}\n\nWięcej szczegółów na moto-raport.pl – link w bio.`,
                    link: `https://moto-raport.pl/aktualnosci/${w.slug}/`,
                    hashtagi: `${BAZA_TAGOW} #news #motonews`,
                    wskazowka: 'Zdjęcie auta lub marki, której dotyczy news (z materiałów prasowych producenta albo własne).'
                  });
                }}
              >
                <span className="text-slate-400 mr-2">{w.data}</span>
                {w.tytul}
              </button>
            ))}
          </div>
        )}
      </div>

      {kolejka && <Kalendarz kolejka={kolejka} onOtworz={setOtwarty} onUstaw={async (z) => {
        try {
          await zapiszKolejke({ ...kolejka, ...z }, 'Social: ustawienia planowania');
          setKom({ ok: true, tekst: 'Zapisano ustawienia planowania.' });
        } catch (e) {
          setKom({ ok: false, tekst: (e as Error).message });
        }
      }} />}

      {blad && <div className="rounded-xl bg-rose-50 text-rose-900 px-4 py-3 text-sm">{blad}</div>}
      {!kolejka && !blad && <p className="text-sm text-slate-500">Wczytuję kolejkę…</p>}

      {kolejka && (
        <div className={karta}>
          <div className="flex flex-wrap gap-2 items-center">
            {(['wszystkie', 'szkic', 'gotowy', 'zaplanowany', 'opublikowany'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltr(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filtr === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
              >
                {f === 'wszystkie' ? 'Wszystkie' : STATUSY[f].nazwa} ({liczniki[f]})
              </button>
            ))}
            <input className={`${input} max-w-xs ml-auto`} placeholder="Szukaj…" value={szukaj} onChange={(e) => setSzukaj(e.target.value)} />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {widoczne.map((p) => (
              <button key={p.id} onClick={() => setOtwarty(p)} className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2">
                <div className="w-12 h-[60px] rounded-md bg-slate-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {p.media?.typ === 'obraz' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.media.url} alt="" className="w-full h-full object-cover" />
                  ) : p.media?.typ === 'film' ? (
                    <Film className="w-5 h-5 text-white" />
                  ) : (
                    <ImagePlus className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {p.nr ? <span className="text-slate-400 mr-1.5">#{String(p.nr).padStart(3, '0')}</span> : null}
                    {p.pilne && <Zap className="inline w-3.5 h-3.5 mr-1 text-amber-500" />}
                    {p.tytul || '(bez tytułu)'}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {NAZWY_TYPOW[p.typ]} · {NAZWY_UKLADOW[p.uklad]}
                    {p.wskazowka ? ` · zdjęcie: ${p.wskazowka}` : ''}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUSY[p.status].kolor}`}>{STATUSY[p.status].nazwa}</span>
                  {p.plan && <div className="text-[11px] text-slate-500 mt-1">{new Date(p.plan).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</div>}
                </div>
              </button>
            ))}
            {!widoczne.length && <p className="text-sm text-slate-500 py-4">Brak postów w tym widoku.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ——— edytor jednego posta ———
function Edytor({
  post, api, repo, token, onZamknij, onZapisz, onUsun
}: {
  post: PostSocial;
  api: ApiPelne;
  repo: string;
  token: string;
  onZamknij: () => void;
  onZapisz: (p: PostSocial, opis: string) => Promise<void>;
  onUsun?: () => void;
}) {
  const [p, setP] = useState<PostSocial>(post);
  const [zdjecie, setZdjecie] = useState<HTMLImageElement | null>(null);
  const [kadr, setKadr] = useState<Kadr>(KADR_DOMYSLNY);
  const [zdjecie2, setZdjecie2] = useState<HTMLImageElement | null>(null);
  const [kadr2, setKadr2] = useState<Kadr>(KADR_DOMYSLNY);
  const [film, setFilm] = useState<File | null>(null);
  const [praca, setPraca] = useState('');
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [zmiany, setZmiany] = useState(false);
  const plotno = useRef<HTMLCanvasElement>(null);

  const ust = (z: Partial<PostSocial>) => {
    setP((s) => ({ ...s, ...z }));
    setZmiany(true);
  };

  useEffect(() => {
    if (plotno.current) rysujPost(plotno.current, p, { zdjecie: zdjecie || undefined, kadr, zdjecie2: (zdjecie && zdjecie2) || undefined, kadr2, tloPodgladu: !zdjecie }).catch((e) => setKom({ ok: false, tekst: e.message }));
  }, [p, zdjecie, kadr, zdjecie2, kadr2]);

  const brakuje = braki(p);

  function wczytajZdjecie(f?: File, drugie = false) {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const i = new Image();
    i.onload = () => {
      if (drugie) {
        setZdjecie2(i);
        setKadr2(KADR_DOMYSLNY);
        if (!['srodek'].includes(p.uklad)) ust({ uklad: 'srodek' });
      } else {
        setZdjecie(i);
        setKadr(KADR_DOMYSLNY);
      }
    };
    i.src = url;
  }

  /** Wysyła plik binarny na gałąź social (Git Data API – działa też dla filmów do ~100 MB) */
  async function wyslij(sciezka: string, base64: string, opis: string) {
    const ref = await api(`/git/ref/heads/${GALAZ_SOCIAL}`);
    const commit = await api(`/git/commits/${ref.object.sha}`);
    const blob = await api('/git/blobs', 'POST', { content: base64, encoding: 'base64' });
    const drzewo = await api('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: [{ path: sciezka, mode: '100644', type: 'blob', sha: blob.sha }] });
    const nowy = await api('/git/commits', 'POST', { message: opis, tree: drzewo.sha, parents: [ref.object.sha] });
    await api(`/git/refs/heads/${GALAZ_SOCIAL}`, 'PATCH', { sha: nowy.sha });
    return `https://raw.githubusercontent.com/${repo.trim()}/${GALAZ_SOCIAL}/${sciezka}`;
  }

  async function pobierz(przezroczyste: boolean, format?: Format) {
    const c = document.createElement('canvas');
    const q = { ...p, format: format || p.format };
    await rysujPost(c, q, przezroczyste ? {} : { zdjecie: zdjecie || undefined, kadr, zdjecie2: (zdjecie && zdjecie2) || undefined, kadr2, tloPodgladu: !zdjecie });
    const b = await doPliku(c, przezroczyste ? 'image/png' : 'image/jpeg');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `motoformat-${p.nr ? String(p.nr).padStart(3, '0') : p.id}-${przezroczyste ? `nakladka-${q.format}` : 'post'}.${przezroczyste ? 'png' : 'jpg'}`;
    a.click();
  }

  async function zapisz(gotowy: boolean) {
    if (gotowy && brakuje.length) {
      setKom({ ok: false, tekst: `Uzupełnij: ${brakuje.join(', ')}.` });
      return;
    }
    setPraca('zapis');
    setKom(null);
    try {
      let q = { ...p };
      const znacznik = Date.now().toString(36);
      if (film) {
        if (film.size > MAKS_FILM_MB * 1024 * 1024) throw new Error(`Film jest za duży (${Math.round(film.size / 1048576)} MB). Wyeksportuj go poniżej ${MAKS_FILM_MB} MB.`);
        setPraca('film');
        const roz = (film.name.split('.').pop() || 'mp4').toLowerCase();
        const sc = `${FOLDER_MEDIOW}/${p.id}-${znacznik}.${roz}`;
        const url = await wyslij(sc, await base64ZPliku(film), `Social: film do ${p.tytul.slice(0, 50)}`);
        q.media = { typ: 'film', url, sciezka: sc };
        setFilm(null);
      } else if (zdjecie) {
        setPraca('grafika');
        const c = document.createElement('canvas');
        await rysujPost(c, q, { zdjecie, kadr, zdjecie2: zdjecie2 || undefined, kadr2 });
        const b = await doPliku(c, 'image/jpeg', 0.9);
        const sc = `${FOLDER_MEDIOW}/${p.id}-${znacznik}.jpg`;
        const url = await wyslij(sc, await base64ZPliku(b), `Social: grafika do ${p.tytul.slice(0, 50)}`);
        q.media = { typ: 'obraz', url, sciezka: sc };
      }
      if (gotowy) {
        if (!q.media) throw new Error('Dodaj zdjęcie albo gotowy film, zanim oznaczysz post jako gotowy.');
        if (q.status === 'szkic') q.status = 'gotowy';
      }
      setPraca('zapis');
      await onZapisz(q, gotowy ? 'Social: post gotowy' : 'Social: zapis posta');
      setP(q);
      setZmiany(false);
      setKom({ ok: true, tekst: gotowy ? (q.pilne ? 'Gotowe. Napisz do Claude „wrzuć pilny”, a post pójdzie od razu.' : 'Gotowe – Claude zaplanuje ten post w Metricool.') : 'Zapisano.' });
    } catch (e) {
      setKom({ ok: false, tekst: (e as Error).message });
    }
    setPraca('');
  }

  const pole = (k: 'tytul' | 'tekst' | 'kat' | 'duze', nazwa: string, wiersze = 1, podp?: string) => (
    <label className="block">
      <span className={etykieta}>{nazwa}</span>
      {wiersze > 1 ? (
        <textarea className={input} rows={wiersze} value={p[k] || ''} onChange={(e) => ust({ [k]: e.target.value })} />
      ) : (
        <input className={input} value={p[k] || ''} placeholder={podp} onChange={(e) => ust({ [k]: e.target.value })} />
      )}
    </label>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button className={przyciskD} onClick={() => (!zmiany || confirm('Masz niezapisane zmiany. Zamknąć?')) && onZamknij()}>
          <X className="w-4 h-4" /> Wróć do listy
        </button>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUSY[p.status].kolor}`}>{STATUSY[p.status].nazwa}</span>
        {p.plan && <span className="text-xs text-slate-500">zaplanowany na {new Date(p.plan).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
        <div className="ml-auto flex gap-2">
          {onUsun && (
            <button className={przyciskD} onClick={onUsun}>
              <Trash2 className="w-4 h-4" /> Usuń
            </button>
          )}
          <button className={przyciskD} onClick={() => zapisz(false)} disabled={!!praca}>
            <Save className="w-4 h-4" /> Zapisz szkic
          </button>
          <button className={przyciskG} onClick={() => zapisz(true)} disabled={!!praca}>
            <CircleCheck className="w-4 h-4" />{' '}
            {praca === 'film' ? 'Wysyłam film…' : praca === 'grafika' ? 'Zapisuję grafikę…' : praca ? 'Zapisuję…' : p.status === 'szkic' ? 'Zapisz jako gotowy' : 'Zapisz zmiany'}
          </button>
        </div>
      </div>
      {kom && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
          {kom.ok ? <CircleCheck className="w-4 h-4 mt-0.5" /> : <CircleAlert className="w-4 h-4 mt-0.5" />} {kom.tekst}
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-5 items-start">
        {/* podgląd */}
        <div className={`${karta} lg:sticky lg:top-4`}>
          <canvas ref={plotno} className="w-full h-auto rounded-lg bg-slate-800" />
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-900 p-3">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">Proponowane zdjęcie</div>
            <textarea
              className="mt-1 w-full bg-transparent text-sm text-amber-950 dark:text-amber-100 resize-none focus:outline-none"
              rows={2}
              placeholder="Opisz, jakie zdjęcie pasuje do posta, np. „Fabryka VW w Wolfsburgu albo logo VW na tle zakładu”."
              value={p.wskazowka || ''}
              onChange={(e) => ust({ wskazowka: e.target.value })}
            />
          </div>
          <label className={`${przyciskG} cursor-pointer w-full justify-center`}>
            <ImagePlus className="w-4 h-4" /> {zdjecie ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => wczytajZdjecie(e.target.files?.[0])} />
          </label>
          {zdjecie && (
            <label className={`${przyciskD} cursor-pointer w-full justify-center`} title="Post podzielony: pierwsze zdjęcie na górze, drugie na dole">
              <ImagePlus className="w-4 h-4" /> {zdjecie2 ? 'Zmień drugie zdjęcie (dół)' : 'Dodaj drugie zdjęcie (dół)'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => wczytajZdjecie(e.target.files?.[0], true)} />
            </label>
          )}
          {zdjecie2 && (
            <div className="space-y-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                Drugie zdjęcie (dół)
                <button className="underline font-normal" onClick={() => setZdjecie2(null)}>usuń</button>
              </div>
              {(['x', 'y'] as const).map((k) => (
                <label key={k} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-28">{k === 'x' ? 'Przesuń w bok' : 'Przesuń w pionie'}</span>
                  <input type="range" min={0} max={100} value={kadr2[k]} onChange={(e) => setKadr2({ ...kadr2, [k]: +e.target.value })} className="flex-1" />
                </label>
              ))}
              <label className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-28">Powiększ</span>
                <input type="range" min={100} max={300} value={kadr2.zoom * 100} onChange={(e) => setKadr2({ ...kadr2, zoom: +e.target.value / 100 })} className="flex-1" />
              </label>
            </div>
          )}
          {(p.uklad === 'srodek' || zdjecie2) && (
            <label className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span className="w-28">{zdjecie2 ? 'Granica zdjęć i pasek' : 'Wysokość paska'}</span>
              <input type="range" min={25} max={75} value={p.pozycja ?? 50} onChange={(e) => ust({ pozycja: +e.target.value })} className="flex-1" />
            </label>
          )}
          {zdjecie && (
            <div className="space-y-2">
              {zdjecie2 && <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Pierwsze zdjęcie (góra)</div>}
              {(['x', 'y'] as const).map((k) => (
                <label key={k} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-28">{k === 'x' ? 'Przesuń w bok' : 'Przesuń w pionie'}</span>
                  <input type="range" min={0} max={100} value={kadr[k]} onChange={(e) => setKadr({ ...kadr, [k]: +e.target.value })} className="flex-1" />
                </label>
              ))}
              <label className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-28">Powiększ</span>
                <input type="range" min={100} max={300} value={kadr.zoom * 100} onChange={(e) => setKadr({ ...kadr, zoom: +e.target.value / 100 })} className="flex-1" />
              </label>
            </div>
          )}
          {!zdjecie && p.media?.typ === 'obraz' && (
            <p className="text-xs text-slate-500">
              Zapisana grafika:{' '}
              <a className="underline" href={p.media.url} target="_blank" rel="noreferrer">
                otwórz
              </a>
              . Żeby ją zmienić, dodaj zdjęcie jeszcze raz.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button className={przyciskD} onClick={() => pobierz(false)}>
              <Download className="w-4 h-4" /> Pobierz post
            </button>
            <button className={przyciskD} onClick={() => pobierz(true, 'pion')} title="Przezroczysty PNG 1080×1920 do położenia na film w programie do montażu">
              <Film className="w-4 h-4" /> Nakładka 9:16
            </button>
            <button className={przyciskD} onClick={() => pobierz(true, 'post')} title="Przezroczysty PNG 1080×1350 – do filmu w formacie posta 4:5">
              <Film className="w-4 h-4" /> Nakładka 4:5
            </button>
            <button
              className={przyciskD}
              title="Plik tekstowy z opisem posta i hashtagami – do wklejenia przy publikacji filmu"
              onClick={() => {
                const t = `${p.tytul}\n\n${p.opis}\n\n${p.hashtagi}\n`;
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain;charset=utf-8' }));
                a.download = `motoformat-${p.nr ? String(p.nr).padStart(3, '0') : p.id}-opis.txt`;
                a.click();
              }}
            >
              <Download className="w-4 h-4" /> Opis (.txt)
            </button>
          </div>
          <p className="text-xs text-slate-500">Nakładki mają przezroczyste tło – połóż je na najwyższej ścieżce nad filmem w programie do montażu. Tekst na nakładce zmienisz w polach „Tytuł” i „Krótki tekst” obok.</p>
        </div>

        {/* pola */}
        <div className="space-y-5">
          <div className={karta}>
            <div className="grid xl:grid-cols-3 gap-3">
              <label className="block">
                <span className={etykieta}>Rodzaj</span>
                <select
                  className={input}
                  value={p.typ}
                  onChange={(e) => {
                    const typ = e.target.value as TypPostu;
                    ust({ typ, uklad: UKLADY_TYPU[typ].includes(p.uklad) ? p.uklad : UKLADY_TYPU[typ][0], pilne: typ === 'pilne' || p.pilne });
                  }}
                >
                  {(Object.keys(NAZWY_TYPOW) as TypPostu[]).map((t) => (
                    <option key={t} value={t}>
                      {NAZWY_TYPOW[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={etykieta}>Układ napisów</span>
                <div className="flex gap-1">
                  <select className={input} value={p.uklad} onChange={(e) => ust({ uklad: e.target.value as Uklad })}>
                    {(Object.keys(NAZWY_UKLADOW) as Uklad[]).map((u) => (
                      <option key={u} value={u}>
                        {NAZWY_UKLADOW[u]}
                      </option>
                    ))}
                  </select>
                  <button className={przyciskD} title="Następny układ" onClick={() => ust({ uklad: nastepnyUklad(p.typ, p.uklad) })}>
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </label>
              <label className="block">
                <span className={etykieta}>Format</span>
                <select className={input} value={p.format} onChange={(e) => ust({ format: e.target.value as Format })}>
                  {(Object.keys(ROZMIAR) as Format[]).map((f) => (
                    <option key={f} value={f}>
                      {ROZMIAR[f].nazwa}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid sm:grid-cols-[1fr_160px] gap-3">
              {pole('kat', 'Mały napis nad tytułem')}
              {p.uklad === 'liczba' && pole('duze', 'Wielka liczba', 1, liczbaZTekstu(p.tytul, p.tekst) || 'np. 1963')}
            </div>
            {pole('tytul', 'Tytuł na grafice', 2)}
            {pole('tekst', 'Krótki tekst na grafice (1–2 zdania)', 2)}
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={!!p.pilne} onChange={(e) => ust({ pilne: e.target.checked })} />
              <Zap className="w-4 h-4 text-amber-500" /> Na już – opublikuj jak najszybciej (napisz potem do Claude „wrzuć pilny”)
            </label>
          </div>

          <div className={karta}>
            <label className="block">
              <span className={etykieta}>Opis posta (pod zdjęciem)</span>
              <textarea className={input} rows={6} value={p.opis} onChange={(e) => ust({ opis: e.target.value })} placeholder="Rozwinięcie ciekawostki: 3–5 zdań, na końcu pytanie do widzów." />
              <span className={`text-xs ${p.opis.trim().length < 120 ? 'text-rose-600' : 'text-slate-500'}`}>{p.opis.trim().length} znaków {p.opis.trim().length < 120 && '– rozwiń opis do min. 2–3 zdań'}</span>
            </label>
            <label className="block">
              <span className={etykieta}>Hashtagi</span>
              <textarea className={input} rows={2} value={p.hashtagi} onChange={(e) => ust({ hashtagi: e.target.value })} />
              <span className={`text-xs ${ileTagow(p.hashtagi) < 6 ? 'text-rose-600' : 'text-slate-500'}`}>
                {ileTagow(p.hashtagi)} hashtagów {ileTagow(p.hashtagi) < 6 && '– dodaj tagi nawiązujące do tematu (marka, model, zjawisko)'}
              </span>
            </label>
            <button
              className={przyciskD}
              onClick={() => {
                navigator.clipboard.writeText(`${p.opis}\n\n${p.hashtagi}`);
                setKom({ ok: true, tekst: 'Opis z hashtagami skopiowany.' });
              }}
            >
              <Copy className="w-4 h-4" /> Kopiuj opis z hashtagami
            </button>
            {p.zrodlo && (
              <p className="text-xs text-slate-500">
                Źródło faktu:{' '}
                {p.zrodlo.startsWith('http') ? (
                  <a className="underline" href={p.zrodlo} target="_blank" rel="noreferrer">
                    {p.zrodlo}
                  </a>
                ) : (
                  p.zrodlo
                )}
              </p>
            )}
          </div>

          <div className={karta}>
            <div>
              <span className={etykieta}>Gdzie opublikować</span>
              <div className="flex flex-wrap gap-4 mt-1">
                {SIECI.map((s) => (
                  <label key={s.k} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={p.sieci.includes(s.k)}
                      onChange={(e) => ust({ sieci: e.target.checked ? [...p.sieci, s.k] : p.sieci.filter((x) => x !== s.k) })}
                    />
                    {s.nazwa}
                  </label>
                ))}
              </div>
            </div>
            <Lektor token={token} tekst={p.lektor || ''} onTekst={(t) => ust({ lektor: t })} nazwa={`motoformat-${p.nr ? String(p.nr).padStart(3, '0') : p.id}`} />
            <div>
              <span className={etykieta}>Rolka – gotowy film</span>
              <p className="text-xs text-slate-500 mb-2">
                Pobierz „Nakładka 9:16”, połóż ją na film w swoim programie do montażu i wyeksportuj MP4 (pion 1080×1920, do {MAKS_FILM_MB} MB). Potem wgraj go tutaj – post pójdzie jako rolka.
              </p>
              <label className={`${przyciskD} cursor-pointer`}>
                <Upload className="w-4 h-4" /> {film ? film.name : p.media?.typ === 'film' ? 'Zmień film' : 'Wgraj gotowy film'}
                <input type="file" accept="video/mp4,video/quicktime" className="hidden" onChange={(e) => { setFilm(e.target.files?.[0] || null); setZmiany(true); }} />
              </label>
              {p.media?.typ === 'film' && !film && (
                <p className="text-xs text-slate-500 mt-2">
                  Zapisany film:{' '}
                  <a className="underline" href={p.media.url} target="_blank" rel="noreferrer">
                    otwórz
                  </a>
                </p>
              )}
            </div>
            {brakuje.length > 0 && <p className="text-xs text-rose-600">Do uzupełnienia przed „gotowy”: {brakuje.join(', ')}.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— kalendarz: na które dni są już zaplanowane posty na Instagramie ———
const DNI = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
const dzienKlucz = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });

function Kalendarz({ kolejka, onOtworz, onUstaw }: { kolejka: Kolejka; onOtworz: (p: PostSocial) => void; onUstaw: (z: Partial<Kolejka>) => Promise<void> }) {
  const u = kolejka.ustawienia || {};
  const [dziennie, setDziennie] = useState(u.dziennie || 1);
  const [szybko, setSzybko] = useState(u.szybciej?.dziennie || 2);
  const [szybkoDo, setSzybkoDo] = useState(u.szybciej?.do || '');
  const [auto, setAuto] = useState(!!kolejka.autoPublikacja);
  const [otwarte, setOtwarte] = useState(false);

  const wgDnia = useMemo(() => {
    const m = new Map<string, PostSocial[]>();
    kolejka.posty
      .filter((p) => p.plan && (p.status === 'zaplanowany' || p.status === 'opublikowany') && p.sieci.includes('instagram'))
      .forEach((p) => {
        const k = dzienKlucz(new Date(p.plan!));
        m.set(k, [...(m.get(k) || []), p]);
      });
    m.forEach((l) => l.sort((a, b) => (a.plan || '').localeCompare(b.plan || '')));
    return m;
  }, [kolejka]);

  const celNaDzien = (k: string) => (u.szybciej && k <= u.szybciej.do ? u.szybciej.dziennie : u.dziennie || 1);
  const dni = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const gotowe = kolejka.posty.filter((p) => p.status === 'gotowy' && !p.pilne).length;
  const zaplanowane = kolejka.posty.filter((p) => p.status === 'zaplanowany').length;
  const ostatni = [...wgDnia.keys()].filter((k) => k >= dzienKlucz(new Date())).sort().pop();

  return (
    <div className={karta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Zaplanowane na Instagramie
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {zaplanowane ? <>Posty zaplanowane do <b>{ostatni ? new Date(ostatni).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }) : '—'}</b>. </> : 'Nic jeszcze nie jest zaplanowane. '}
            Gotowych do zaplanowania: <b>{gotowe}</b>
            {gotowe < 3 && ' – dodaj zdjęcia do kolejnych postów'}. {kolejka.autoPublikacja ? 'Posty idą od razu do publikacji.' : 'Posty czekają w Metricool na Twoje zatwierdzenie.'}
          </p>
        </div>
        <button className={przyciskD} onClick={() => setOtwarte(!otwarte)}>
          Tempo publikacji
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {dni.map((d) => {
          const k = dzienKlucz(d);
          const posty = wgDnia.get(k) || [];
          const cel = celNaDzien(k);
          const dzis = k === dzienKlucz(new Date());
          const kolor = posty.length >= cel ? 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900' : posty.length ? 'bg-amber-50 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900' : 'bg-slate-50 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700';
          return (
            <div key={k} className={`rounded-xl ring-1 p-2 min-h-[86px] ${kolor} ${dzis ? 'outline outline-2 outline-slate-900 dark:outline-white' : ''}`}>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>{DNI[d.getDay()]}</span>
                <span>{d.getDate()}.{String(d.getMonth() + 1).padStart(2, '0')}</span>
              </div>
              {posty.map((p) => (
                <button key={p.id} onClick={() => onOtworz(p)} title={p.tytul} className="block w-full text-left text-[11px] leading-tight mt-1 text-slate-800 dark:text-slate-100 hover:underline">
                  <b>{new Date(p.plan!).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' })}</b> {p.tytul.slice(0, 34)}
                  {p.tytul.length > 34 ? '…' : ''}
                </button>
              ))}
              {posty.length < cel && <div className="text-[11px] mt-1 text-slate-400">{posty.length ? `brak ${cel - posty.length}` : 'wolne'}</div>}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Zielony – dzień obsadzony, żółty – brakuje posta, szary – wolne. Kalendarz odświeża się po każdym planowaniu (codziennie o 12:41 i 20:41).</p>
      {otwarte && (
        <div className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 p-4 space-y-3">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-48">Postów dziennie (zwykle)</span>
            <input type="number" min={1} max={3} className={`${input} w-20`} value={dziennie} onChange={(e) => setDziennie(Math.max(1, Math.min(3, +e.target.value || 1)))} />
          </label>
          <label className="flex flex-wrap items-center gap-3 text-sm">
            <span className="w-48">Czasowo szybciej</span>
            <input type="number" min={1} max={3} className={`${input} w-20`} value={szybko} onChange={(e) => setSzybko(Math.max(1, Math.min(3, +e.target.value || 2)))} />
            <span>postów dziennie do dnia</span>
            <input type="date" className={`${input} w-44`} value={szybkoDo} onChange={(e) => setSzybkoDo(e.target.value)} />
            {szybkoDo && (
              <button className="text-xs underline" onClick={() => setSzybkoDo('')}>
                wyłącz
              </button>
            )}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Publikuj bez zatwierdzania (pełny automat)
          </label>
          <button
            className={przyciskG}
            onClick={() => onUstaw({ autoPublikacja: auto, ustawienia: { dziennie, szybciej: szybkoDo ? { dziennie: szybko, do: szybkoDo } : null } })}
          >
            <Save className="w-4 h-4" /> Zapisz tempo
          </button>
        </div>
      )}
    </div>
  );
}
