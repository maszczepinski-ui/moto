'use client';
// Zakładka „Artykuły z filmów”: lista szkiców i opublikowanych artykułów, edycja, transkrypcja, publikacja.
import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Play, Save, Send, Trash2, Plus, X, ExternalLink, FileText, Undo2 } from 'lucide-react';
import { ApiPelne, input, etykieta, karta, przyciskG, przyciskD, czytajJson, zapiszPlik, slugify } from '@/components/admin/wspolne';

type Wpis = {
  slug: string;
  youtubeId: string;
  tytul: string;
  lead: string;
  opublikowano: string;
  kategoria: string;
  modele: string[];
  produkty?: string[];
  konwersja: string;
  rozdzialy?: { czas: string; tytul: string }[];
  tresc: string;
  faq?: { pytanie: string; odpowiedz: string }[];
  status: 'szkic' | 'opublikowany';
  brakTranskrypcji?: boolean;
  wygenerowano?: string;
};
type Plik = { wpis: Wpis; sha: string };
type ModelOpcja = { slug: string; nazwa: string };

const KATEGORIE: [string, string][] = [
  ['test', 'Test auta'],
  ['porada', 'Porada'],
  ['zakup', 'Zakup auta'],
  ['detailing', 'Pielęgnacja / detailing'],
  ['inne', 'Inne']
];
const KONWERSJE: [string, string][] = [
  ['zakup', 'Zakup auta: raport VIN + asystent zakupu'],
  ['ubezpieczenie', 'Ubezpieczenie: porównanie OC/AC'],
  ['detailing', 'Pielęgnacja: sezonowe rankingi produktów'],
  ['diagnostyka', 'Diagnostyka: kody błędów + części'],
  ['brak', 'Bez bloku z linkami']
];
const WORKFLOW = 'nowe-filmy.yml';
const ytId = (t: string) => (t.trim().match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/) || (/^[\w-]{11}$/.test(t.trim()) ? [0, t.trim()] : []))[1] as string | undefined;

const rozdzialyNaTekst = (r: Wpis['rozdzialy'] = []) => r.map((x) => `${x.czas} ${x.tytul}`).join('\n');
const tekstNaRozdzialy = (t: string) =>
  t
    .split('\n')
    .map((l) => l.trim().match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ czas: m[1], tytul: m[2].trim() }));
const faqNaTekst = (f: Wpis['faq'] = []) => f.map((x) => `${x.pytanie}\n${x.odpowiedz}`).join('\n\n');
const tekstNaFaq = (t: string) =>
  t
    .split(/\n\s*\n/)
    .map((b) => b.trim().split('\n'))
    .filter((l) => l.length >= 2)
    .map((l) => ({ pytanie: l[0].trim(), odpowiedz: l.slice(1).join(' ').trim() }));

export default function ArtykulyFilmow({ api, branch, modele }: { api: ApiPelne; branch: string; modele: ModelOpcja[] }) {
  const [pliki, setPliki] = useState<Plik[] | null>(null);
  const [produkty, setProdukty] = useState<{ id: string; nazwa: string }[]>([]);
  const [otwarty, setOtwarty] = useState<string>('');
  const [edycja, setEdycja] = useState<{ w: Wpis; rozdzialy: string; faq: string } | null>(null);
  const [transkrypcja, setTranskrypcja] = useState('');
  const [nowyLink, setNowyLink] = useState('');
  const [nowyTytul, setNowyTytul] = useState('');
  const [modelTekst, setModelTekst] = useState('');
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);
  const poNazwie = useMemo(() => new Map(modele.map((m) => [m.nazwa, m.slug])), [modele]);
  const poSlugu = useMemo(() => new Map(modele.map((m) => [m.slug, m.nazwa])), [modele]);

  async function wczytaj() {
    try {
      const lista: { name: string; path: string; type: string }[] = await api(`/contents/data/wpisy?ref=${branch}`).catch(() => []);
      const jsony = lista.filter((x) => x.type === 'file' && x.name.endsWith('.json') && !x.name.startsWith('.'));
      const wynik = await Promise.all(
        jsony.map(async (x) => {
          const { dane, sha } = await czytajJson<Wpis>(api, x.path, branch);
          return { wpis: dane, sha };
        })
      );
      wynik.sort((a, b) => (b.wpis.opublikowano || '').localeCompare(a.wpis.opublikowano || ''));
      setPliki(wynik);
    } catch (e) {
      setPliki([]);
      setKom({ ok: false, tekst: `Nie mogę wczytać artykułów: ${(e as Error).message}` });
    }
    try {
      const { dane } = await czytajJson<{ produkty: { id: string; nazwa: string; aktywny: boolean }[] }>(api, 'data/produkty.json', branch);
      setProdukty(dane.produkty.filter((p) => p.aktywny));
    } catch {
      /* brak pliku produktów – pole produktów będzie puste */
    }
  }
  useEffect(() => {
    wczytaj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function otworz(p: Plik) {
    setOtwarty(p.wpis.slug);
    setEdycja({ w: JSON.parse(JSON.stringify(p.wpis)), rozdzialy: rozdzialyNaTekst(p.wpis.rozdzialy), faq: faqNaTekst(p.wpis.faq) });
    setTranskrypcja('');
    setKom(null);
  }

  async function zapisz(status?: Wpis['status']) {
    if (!edycja || !pliki) return;
    const p = pliki.find((x) => x.wpis.slug === otwarty);
    const w: Wpis = { ...edycja.w, rozdzialy: tekstNaRozdzialy(edycja.rozdzialy), faq: tekstNaFaq(edycja.faq), ...(status ? { status } : {}) };
    if (w.status === 'opublikowany' && (!w.tresc.trim() || !w.tytul.trim() || !w.lead.trim())) {
      setKom({ ok: false, tekst: 'Przed publikacją uzupełnij tytuł, wstęp i treść artykułu.' });
      return;
    }
    setPraca(true);
    try {
      const sha = await zapiszPlik(api, `data/wpisy/${w.slug}.json`, JSON.stringify(w, null, 2) + '\n', `Panel: artykuł „${w.tytul}”${status === 'opublikowany' ? ' – publikacja' : ''}`, branch, p?.sha);
      setPliki(pliki.map((x) => (x.wpis.slug === w.slug ? { wpis: w, sha } : x)));
      setEdycja({ ...edycja, w });
      setKom({
        ok: true,
        tekst: w.status === 'opublikowany' ? 'Opublikowano. Artykuł pojawi się na stronie po przebudowie (kilka minut).' : 'Zapisano szkic. Na stronie go nie widać, dopóki nie klikniesz „Opublikuj”.'
      });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się zapisać: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function usun() {
    if (!edycja || !pliki) return;
    const p = pliki.find((x) => x.wpis.slug === otwarty);
    if (!p || !window.confirm(`Usunąć „${p.wpis.tytul}”? Tego nie da się cofnąć z panelu.`)) return;
    setPraca(true);
    try {
      await api(`/contents/data/wpisy/${p.wpis.slug}.json`, 'DELETE', { message: `Panel: usunięto artykuł „${p.wpis.tytul}”`, sha: p.sha, branch });
      setPliki(pliki.filter((x) => x !== p));
      setOtwarty('');
      setEdycja(null);
      setKom({ ok: true, tekst: 'Usunięto.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się usunąć: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function wyslijTranskrypcje() {
    if (!edycja || transkrypcja.trim().length < 200) {
      setKom({ ok: false, tekst: 'Wklej całą transkrypcję (napisy) filmu – co najmniej kilka zdań.' });
      return;
    }
    setPraca(true);
    try {
      const sciezka = `data/transkrypcje/${edycja.w.youtubeId}.${/-->/.test(transkrypcja) ? (/^WEBVTT/.test(transkrypcja.trim()) ? 'vtt' : 'srt') : 'txt'}`;
      let sha: string | undefined;
      try {
        sha = (await api(`/contents/${sciezka}?ref=${branch}`)).sha;
      } catch {
        /* nowy plik */
      }
      await zapiszPlik(api, sciezka, transkrypcja, `Panel: transkrypcja filmu ${edycja.w.youtubeId}`, branch, sha);
      await api(`/actions/workflows/${WORKFLOW}/dispatches`, 'POST', { ref: branch, inputs: { film: edycja.w.youtubeId } });
      setKom({ ok: true, tekst: 'Transkrypcja zapisana. Automat pisze szkic artykułu – zwykle 1–3 minuty. Potem kliknij „Odśwież listę”.' });
      setTranskrypcja('');
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się: ${(e as Error).message} Sprawdź, czy token ma uprawnienie „Actions: Read and write”.` });
    } finally {
      setPraca(false);
    }
  }

  async function sprawdzNowe() {
    setPraca(true);
    try {
      await api(`/actions/workflows/${WORKFLOW}/dispatches`, 'POST', { ref: branch });
      setKom({ ok: true, tekst: 'Automat sprawdza nowe filmy na kanale. Za 1–3 minuty kliknij „Odśwież listę”.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się uruchomić: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  async function dodajRecznie() {
    const id = ytId(nowyLink);
    if (!id || !nowyTytul.trim() || !pliki) {
      setKom({ ok: false, tekst: 'Wklej link do filmu na YouTube i wpisz tytuł.' });
      return;
    }
    if (pliki.some((p) => p.wpis.youtubeId === id)) {
      setKom({ ok: false, tekst: 'Ten film już jest na liście.' });
      return;
    }
    let slug = slugify(nowyTytul) || id;
    while (pliki.some((p) => p.wpis.slug === slug)) slug += '-2';
    const w: Wpis = {
      slug,
      youtubeId: id,
      tytul: nowyTytul.trim(),
      lead: '',
      opublikowano: new Date().toISOString().slice(0, 10),
      kategoria: 'inne',
      modele: [],
      produkty: [],
      konwersja: 'brak',
      rozdzialy: [],
      tresc: '',
      faq: [],
      status: 'szkic',
      brakTranskrypcji: true
    };
    setPraca(true);
    try {
      const sha = await zapiszPlik(api, `data/wpisy/${slug}.json`, JSON.stringify(w, null, 2) + '\n', `Panel: nowy film „${w.tytul}”`, branch);
      const nowy = { wpis: w, sha };
      setPliki([nowy, ...pliki]);
      otworz(nowy);
      setNowyLink('');
      setNowyTytul('');
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się dodać: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  }

  const ustaw = (zm: Partial<Wpis>) => edycja && setEdycja({ ...edycja, w: { ...edycja.w, ...zm } });

  return (
    <div className="space-y-4">
      {kom && <div role="status" className={`rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'}`}>{kom.tekst}</div>}

      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <FileText className="w-5 h-5 text-steel-600" aria-hidden="true" /> Artykuły z filmów
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Automat codziennie sprawdza kanał i dla każdego nowego filmu tworzy <strong>szkic</strong>. Gdy szkic ma transkrypcję, model językowy pisze artykuł. Ty czytasz, poprawiasz
          i klikasz <strong>Opublikuj</strong> – dopiero wtedy artykuł pojawia się na stronie.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={sprawdzNowe} disabled={praca} className={przyciskG}>
            <Play className="w-4 h-4" aria-hidden="true" /> Sprawdź nowe filmy teraz
          </button>
          <button type="button" onClick={wczytaj} disabled={praca} className={przyciskD}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Odśwież listę
          </button>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">Dodaj film ręcznie</summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className={etykieta} htmlFor="nf-l">Link do filmu</label>
              <input id="nf-l" className={input} value={nowyLink} onChange={(e) => setNowyLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
            </div>
            <div>
              <label className={etykieta} htmlFor="nf-t">Tytuł</label>
              <input id="nf-t" className={input} value={nowyTytul} onChange={(e) => setNowyTytul(e.target.value)} />
            </div>
          </div>
          <button type="button" onClick={dodajRecznie} disabled={praca} className={`${przyciskD} mt-3`}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj szkic
          </button>
        </details>
        {pliki === null && <p className="text-sm text-slate-500">Wczytuję…</p>}
        {pliki && pliki.length === 0 && <p className="text-sm text-slate-500">Nie ma jeszcze żadnych artykułów.</p>}
        {pliki && pliki.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {pliki.map((p) => (
              <li key={p.wpis.slug}>
                <button type="button" onClick={() => otworz(p)} className={`w-full text-left py-2.5 flex items-center justify-between gap-3 ${otwarty === p.wpis.slug ? 'font-bold' : ''}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-slate-900 dark:text-white">{p.wpis.tytul}</span>
                    <span className="block text-xs text-slate-500">
                      {p.wpis.opublikowano}
                      {p.wpis.brakTranskrypcji ? ' • czeka na transkrypcję' : ''}
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

      {edycja && (
        <section className={karta}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{edycja.w.tytul || 'Nowy artykuł'}</h3>
            <a href={`https://www.youtube.com/watch?v=${edycja.w.youtubeId}`} target="_blank" rel="noopener" className="flex-shrink-0 inline-flex items-center gap-1 text-xs underline">
              film <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          {(edycja.w.brakTranskrypcji || !edycja.w.tresc) && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-4 space-y-2">
              <p className="text-sm text-amber-900 dark:text-amber-200">
                <strong>Brak transkrypcji.</strong> Pobierz napisy z YouTube Studio (Treści → film → Napisy → przy języku polskim „⋮” → Pobierz, format .srt) i wklej je
                poniżej. Automat napisze z nich szkic artykułu.
              </p>
              <textarea className={`${input} font-mono text-xs min-h-[140px]`} value={transkrypcja} onChange={(e) => setTranskrypcja(e.target.value)} placeholder="Wklej tu napisy (.srt) albo zwykły tekst transkrypcji" />
              <button type="button" onClick={wyslijTranskrypcje} disabled={praca} className={przyciskG}>
                <Send className="w-4 h-4" aria-hidden="true" /> Zapisz transkrypcję i napisz artykuł
              </button>
            </div>
          )}

          <div>
            <label className={etykieta} htmlFor="w-t">Tytuł (to, co zobaczy Google – do ok. 70 znaków)</label>
            <input id="w-t" className={input} value={edycja.w.tytul} onChange={(e) => ustaw({ tytul: e.target.value })} />
            <p className="text-[11px] text-slate-500 mt-1">{edycja.w.tytul.length} znaków</p>
          </div>
          <div>
            <label className={etykieta} htmlFor="w-l">Wstęp (1–2 zdania, opis w Google)</label>
            <textarea id="w-l" className={`${input} min-h-[60px]`} value={edycja.w.lead} onChange={(e) => ustaw({ lead: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={etykieta} htmlFor="w-k">Kategoria</label>
              <select id="w-k" className={input} value={edycja.w.kategoria} onChange={(e) => ustaw({ kategoria: e.target.value })}>
                {KATEGORIE.map(([v, n]) => (
                  <option key={v} value={v}>{n}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={etykieta} htmlFor="w-c">Blok z linkami pod artykułem</label>
              <select id="w-c" className={input} value={edycja.w.konwersja} onChange={(e) => ustaw({ konwersja: e.target.value })}>
                {KONWERSJE.map(([v, n]) => (
                  <option key={v} value={v}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={etykieta}>Auta z filmu (karty z bazy – pokażą się dane z CEPiK i linki do kart)</span>
            <div className="flex flex-wrap gap-2 mb-2">
              {edycja.w.modele.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-steel-100 dark:bg-slate-800 rounded-full px-3 py-1 text-sm">
                  {poSlugu.get(s) || s}
                  <button type="button" aria-label="Usuń" onClick={() => ustaw({ modele: edycja.w.modele.filter((x) => x !== s) })}>
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input list="w-modele" className={input} value={modelTekst} onChange={(e) => setModelTekst(e.target.value)} placeholder="wpisz np. Passat B6 i wybierz z listy" />
              <datalist id="w-modele">
                {modele.map((m) => (
                  <option key={m.slug} value={m.nazwa} />
                ))}
              </datalist>
              <button
                type="button"
                className={przyciskD}
                onClick={() => {
                  const s = poNazwie.get(modelTekst.trim());
                  if (s && !edycja.w.modele.includes(s)) ustaw({ modele: [...edycja.w.modele, s] });
                  setModelTekst('');
                }}
              >
                Dodaj
              </button>
            </div>
          </div>

          {produkty.length > 0 && (
            <div>
              <span className={etykieta}>Produkty pokazane w filmie</span>
              <div className="flex flex-wrap gap-2">
                {produkty.map((p) => {
                  const wl = (edycja.w.produkty || []).includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => ustaw({ produkty: wl ? (edycja.w.produkty || []).filter((x) => x !== p.id) : [...(edycja.w.produkty || []), p.id] })}
                      className={`px-3 py-1 rounded-full text-sm border ${wl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 dark:border-slate-700'}`}
                    >
                      {p.nazwa}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className={etykieta} htmlFor="w-r">Rozdziały filmu (jeden w linii: „1:20 Silniki”)</label>
            <textarea id="w-r" className={`${input} font-mono text-xs min-h-[100px]`} value={edycja.rozdzialy} onChange={(e) => setEdycja({ ...edycja, rozdzialy: e.target.value })} />
          </div>
          <div>
            <label className={etykieta} htmlFor="w-tr">
              Treść artykułu – „## Nagłówek”, „### Podnagłówek”, „- punkt”, **pogrubienie**. Nazwy aut z listy powyżej same staną się linkami do kart.
            </label>
            <textarea id="w-tr" className={`${input} min-h-[320px] leading-relaxed`} value={edycja.w.tresc} onChange={(e) => ustaw({ tresc: e.target.value })} />
            <p className="text-[11px] text-slate-500 mt-1">{edycja.w.tresc.split(/\s+/).filter(Boolean).length} słów</p>
          </div>
          <div>
            <label className={etykieta} htmlFor="w-f">Pytania i odpowiedzi (pytanie w pierwszej linii, odpowiedź pod nim, pusta linia między pytaniami)</label>
            <textarea id="w-f" className={`${input} min-h-[120px]`} value={edycja.faq} onChange={(e) => setEdycja({ ...edycja, faq: e.target.value })} />
          </div>

          <p className="text-xs text-slate-500">
            Zanim opublikujesz: przeczytaj tekst, popraw to, co model źle zrozumiał, i dopisz zdanie od siebie. Sprawdź nazwy aut i liczby – artykuł idzie pod Twoim nazwiskiem.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => zapisz()} disabled={praca} className={przyciskD}>
              <Save className="w-4 h-4" aria-hidden="true" /> Zapisz szkic
            </button>
            {edycja.w.status !== 'opublikowany' ? (
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
