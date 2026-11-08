'use client';
// Zakładka „Aktualności”: szkice z automatu (akcje serwisowe, komunikaty, premiery) – czytasz, poprawiasz i publikujesz.
import { useEffect, useState } from 'react';
import { RefreshCw, Play, Save, Send, Trash2, X, ExternalLink, Newspaper, Undo2, CircleCheck, CircleAlert } from 'lucide-react';
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
type Zdjecie = { duze: string; male: string; szerokosc: number; wysokosc: number; alt: string; podpis: string; zrodlo?: string };
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
  /** Usuwa zdjęcie prasowe z wpisu (np. gdy nie pasuje do treści) */
  async function usunZdjecie() {
    if (!w?.zdjecie || !pliki || !window.confirm('Usunąć zdjęcie z tego wpisu? Zostanie automatyczna grafika.')) return;
    setPraca(true);
    try {
      const stare = w.zdjecie;
      const bez = { ...w };
      delete bez.zdjecie;
      const p = pliki.find((x) => x.wpis.slug === bez.slug);
      const sha = await zapiszPlik(api, `data/aktualnosci/${bez.slug}.json`, JSON.stringify(bez, null, 2) + '\n', `Panel: usunięto zdjęcie z „${bez.tytul}”`, branch, p?.sha);
      setPliki(pliki.map((x) => (x.wpis.slug === bez.slug ? { wpis: bez, sha } : x)));
      setW(bez);
      await usunPlik(sciezkaPliku(stare.duze), 'Panel: usunięto zdjęcie');
      await usunPlik(sciezkaPliku(stare.male), 'Panel: usunięto miniaturę');
      setKom({ ok: true, tekst: 'Zdjęcie usunięte.' });
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
      // Blokujemy tylko, gdy w treści został automatyczny napis „Do uzupełnienia”.
      // Jeśli treść jest już napisana ręcznie, szkic bez AI można normalnie opublikować.
      if (/Do uzupełnienia/.test(nowy.tresc)) return setKom({ ok: false, tekst: 'W treści został napis „Do uzupełnienia” – napisz własny tekst i sprawdź opisy usterek, potem opublikuj.' });
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
                      {/Do uzupełnienia/.test(p.wpis.tresc) ? ' • bez tekstu – do uzupełnienia' : ''}
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

          {w.zdjecie && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <span className={etykieta}>Zdjęcie prasowe producenta (pobrane automatycznie – sprawdź, czy pasuje do tekstu)</span>
              {/* zdjęcie jest w repozytorium, a na stronie pojawi się po publikacji – w panelu pokazujemy oryginał z biura prasowego */}
              {w.zdjecie.zrodlo && (
                <a href={w.zdjecie.zrodlo} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs underline">
                  zobacz zdjęcie w biurze prasowym <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
              <div>
                <label className={etykieta} htmlFor="z-alt">Opis zdjęcia (dla Google i osób niewidomych)</label>
                <input id="z-alt" className={input} value={w.zdjecie.alt} onChange={(e) => ustaw({ zdjecie: { ...w.zdjecie!, alt: e.target.value } })} />
              </div>
              <div>
                <label className={etykieta} htmlFor="z-pod">Podpis (zostaw informację, że to materiał prasowy)</label>
                <input id="z-pod" className={input} value={w.zdjecie.podpis} onChange={(e) => ustaw({ zdjecie: { ...w.zdjecie!, podpis: e.target.value } })} />
              </div>
              <button type="button" onClick={usunZdjecie} disabled={praca} className={`${przyciskD} text-rose-700`}>
                <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń zdjęcie
              </button>
            </div>
          )}

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
