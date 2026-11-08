'use client';
// Zakładka „Chińskie auta” panelu admina: zdjęcia, ceny „od” i ukrywanie modeli w rankingu /chinskie-samochody/.
// Zdjęcie przeglądarka sama przycina do 800 × 500 px i zapisuje jako WebP w public/chinskie/{slug}.webp.
// Wszystko (zdjęcia + data/chinskie-auta.json) trafia do repozytorium jednym zapisem → Vercel przebudowuje stronę.
// Pozycji w rankingu i liczby rejestracji nie edytujemy – liczą się same z danych CEPiK.
import { useEffect, useMemo, useState } from 'react';
import { ImageUp, RotateCcw, Save, Search, Trash2 } from 'lucide-react';
import type { ApiPelne } from './LogoIkona';
import { b64, input, karta, przyciskD, przyciskG, z64 } from './wspolne';

const PLIK = 'data/chinskie-auta.json';
const MAKS_MB = 8;
type Wpis = { cenaOd: number | null; zdjecie: string; publikuj: boolean };
type Dane = { _instrukcja?: string[]; marki: string[]; modele: Record<string, Wpis> };

/** Przycina zdjęcie do 16:10 (środek kadru) i zmniejsza do 800 × 500 px, format WebP */
function przygotujZdjecie(plik: File): Promise<string> {
  return new Promise((ok, blad) => {
    if (!/^image\/(png|jpeg|webp)$/.test(plik.type)) return blad(new Error('Wybierz zdjęcie JPG, PNG albo WebP.'));
    if (plik.size > MAKS_MB * 1024 * 1024) return blad(new Error(`Zdjęcie jest za duże (maks. ${MAKS_MB} MB).`));
    const r = new FileReader();
    r.onerror = () => blad(new Error('Nie udało się odczytać pliku.'));
    r.onload = () => {
      const img = new Image();
      img.onerror = () => blad(new Error('To nie jest poprawne zdjęcie.'));
      img.onload = () => {
        const W = 800;
        const H = 500;
        const c = document.createElement('canvas');
        c.width = W;
        c.height = H;
        const x = c.getContext('2d')!;
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        x.imageSmoothingQuality = 'high';
        x.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        ok(c.toDataURL('image/webp', 0.82));
      };
      img.src = String(r.result);
    };
    r.readAsDataURL(plik);
  });
}

export default function ChinskieAuta({ api, branch, nazwy }: { api: ApiPelne; branch: string; nazwy: Map<string, string> }) {
  const [dane, setDane] = useState<Dane | null>(null);
  const [oryginal, setOryginal] = useState('');
  const [nowe, setNowe] = useState<Record<string, string>>({}); // slug → zdjęcie (data:) czekające na zapis
  const [szukaj, setSzukaj] = useState('');
  const [praca, setPraca] = useState(false);
  const [status, setStatus] = useState<{ typ: 'ok' | 'blad' | 'info'; tekst: string } | null>(null);

  async function wczytaj() {
    setStatus({ typ: 'info', tekst: 'Wczytuję…' });
    try {
      const j = await api(`/contents/${PLIK}?ref=${branch}`);
      const t = z64(j.content);
      setDane(JSON.parse(t));
      setOryginal(t);
      setNowe({});
      setStatus(null);
    } catch (e) {
      setStatus({ typ: 'blad', tekst: (e as Error).message });
    }
  }
  useEffect(() => {
    wczytaj();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nazwa = (slug: string) => nazwy.get(slug) || slug;
  const lista = useMemo(
    () =>
      dane
        ? Object.keys(dane.modele)
            .filter((s) => !szukaj || nazwa(s).toLowerCase().includes(szukaj.toLowerCase()))
            .sort((a, b) => nazwa(a).localeCompare(nazwa(b), 'pl'))
        : [],
    [dane, szukaj] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const zmieniono = !!dane && (JSON.stringify(dane, null, 2) + '\n' !== oryginal || Object.keys(nowe).length > 0);

  const ustaw = (slug: string, z: Partial<Wpis>) => setDane((d) => (d ? { ...d, modele: { ...d.modele, [slug]: { ...d.modele[slug], ...z } } } : d));

  async function wybierzZdjecie(slug: string, plik?: File) {
    if (!plik) return;
    try {
      const url = await przygotujZdjecie(plik);
      setNowe((n) => ({ ...n, [slug]: url }));
      setStatus(null);
    } catch (e) {
      setStatus({ typ: 'blad', tekst: (e as Error).message });
    }
  }

  async function zapisz() {
    if (!dane) return;
    setPraca(true);
    setStatus({ typ: 'info', tekst: 'Zapisuję na GitHubie…' });
    try {
      const wersja = Date.now().toString(36);
      const kopia: Dane = JSON.parse(JSON.stringify(dane));
      const pliki: { sciezka: string; b64: string }[] = [];
      for (const [slug, url] of Object.entries(nowe)) {
        pliki.push({ sciezka: `public/chinskie/${slug}.webp`, b64: url.slice(url.indexOf(',') + 1) });
        // ?v= – żeby przeglądarki nie pokazywały starego zdjęcia z pamięci
        kopia.modele[slug].zdjecie = `/chinskie/${slug}.webp?v=${wersja}`;
      }
      pliki.push({ sciezka: PLIK, b64: b64(JSON.stringify(kopia, null, 2) + '\n') });

      const ref = await api(`/git/ref/heads/${branch}`);
      const rodzic = ref.object.sha as string;
      const commit = await api(`/git/commits/${rodzic}`);
      const drzewo = [];
      for (const p of pliki) {
        const blob = await api('/git/blobs', 'POST', { content: p.b64, encoding: 'base64' });
        drzewo.push({ path: p.sciezka, mode: '100644', type: 'blob', sha: blob.sha });
      }
      const noweDrzewo = await api('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: drzewo });
      const nowy = await api('/git/commits', 'POST', { message: 'Panel admina: ranking chińskich aut (zdjęcia i ceny)', tree: noweDrzewo.sha, parents: [rodzic] });
      await api(`/git/refs/heads/${branch}`, 'PATCH', { sha: nowy.sha });
      setStatus({ typ: 'ok', tekst: 'Zapisano! Ranking ze zmianami pojawi się na stronie za kilka minut.' });
      await wczytaj();
      setStatus({ typ: 'ok', tekst: 'Zapisano! Ranking ze zmianami pojawi się na stronie za kilka minut.' });
    } catch (e) {
      setStatus({ typ: 'blad', tekst: `${(e as Error).message} – jeśli ktoś zapisał coś w międzyczasie, kliknij „Wczytaj ponownie” i spróbuj jeszcze raz.` });
    } finally {
      setPraca(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className={karta}>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ranking chińskich aut – zdjęcia i ceny</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Kolejność i liczby rejestracji liczą się same z danych CEPiK. Tu dodajesz tylko zdjęcie, cenę „od” (zł brutto, z cennika producenta) i możesz ukryć model. Nowe modele pojawiają się
          na liście same.
        </p>
        <p className="text-xs text-slate-500">
          Zdjęcie zostanie samo przycięte do proporcji 16:10 (środek kadru) i zmniejszone. Używaj tylko własnych zdjęć albo prasowych, jeśli regulamin marki na to pozwala.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[12rem]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={szukaj} onChange={(e) => setSzukaj(e.target.value)} placeholder="Szukaj modelu…" aria-label="Szukaj modelu" className={`${input} pl-9`} />
          </div>
          <button type="button" onClick={wczytaj} disabled={praca} className={przyciskD}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Wczytaj ponownie
          </button>
          <button type="button" onClick={zapisz} disabled={!zmieniono || praca} className={przyciskG}>
            <Save className="w-4 h-4" aria-hidden="true" /> Zapisz zmiany
          </button>
        </div>
        {status && (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              status.typ === 'ok' ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : status.typ === 'blad' ? 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800'
            }`}
            role="status"
          >
            {status.tekst}
          </p>
        )}
      </section>

      {dane && (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {lista.map((slug) => {
            const w = dane.modele[slug];
            const podglad = nowe[slug] || (w.zdjecie ? w.zdjecie : '');
            return (
              <li key={slug} className={`${karta} !space-y-3 ${w.publikuj === false ? 'opacity-60' : ''}`}>
                <div className="flex gap-3">
                  <div className="w-32 flex-shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
                    {podglad ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={podglad} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center px-1">brak zdjęcia (placeholder)</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white leading-snug">
                      {nazwa(slug)}
                      {nowe[slug] && <span className="ml-2 text-[10px] font-bold uppercase text-amber-600">nowe zdjęcie – zapisz</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <label className={`${przyciskD} !px-3 !py-1.5 text-xs cursor-pointer`}>
                        <ImageUp className="w-3.5 h-3.5" aria-hidden="true" /> {podglad ? 'Zmień zdjęcie' : 'Wgraj zdjęcie'}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => wybierzZdjecie(slug, e.target.files?.[0])} />
                      </label>
                      {podglad && (
                        <button
                          type="button"
                          onClick={() => {
                            setNowe((n) => {
                              const k = { ...n };
                              delete k[slug];
                              return k;
                            });
                            ustaw(slug, { zdjecie: '' });
                          }}
                          className={`${przyciskD} !px-3 !py-1.5 text-xs`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Usuń
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-40">
                    <label htmlFor={`cena-${slug}`} className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Cena od (zł brutto)
                    </label>
                    <input
                      id={`cena-${slug}`}
                      inputMode="numeric"
                      value={w.cenaOd ?? ''}
                      placeholder="np. 89900"
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '');
                        ustaw(slug, { cenaOd: v ? Number(v) : null });
                      }}
                      className={`${input} tabular-nums`}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm pb-2 cursor-pointer">
                    <input type="checkbox" checked={w.publikuj !== false} onChange={(e) => ustaw(slug, { publikuj: e.target.checked })} className="w-4 h-4 accent-steel-600" />
                    Pokazuj w rankingu
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
