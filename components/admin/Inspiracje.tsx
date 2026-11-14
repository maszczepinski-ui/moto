'use client';
// „Inspiracje” w zakładce Aktualności: najnowsze nagłówki z serwisów motoryzacyjnych (kanały RSS).
// To tylko podpowiedzi tematów dla Ciebie – na stronie nic z tego się nie pokazuje.
// Klikasz „Napisz wpis” → powstaje szkic z linkiem do źródła i planem tekstu, który wypełniasz własnymi słowami.
import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, RefreshCw, PenLine, Copy, EyeOff, Eye, ExternalLink, Settings2, Plus, Trash2, Save, CircleAlert, Search } from 'lucide-react';
import { ApiPelne, input, etykieta, karta, przyciskG, przyciskD, czytajJson, zapiszPlik } from '@/components/admin/wspolne';

export type WpisRss = { tytul: string; link: string; data?: string; opis?: string; zrodlo: string; jezyk: string };
type Kanal = { nazwa: string; rss: string; jezyk: string; wlaczony: boolean };
type Konfig = { _opis?: string; kanaly: Kanal[] };
type Odpowiedz = { wpisy: WpisRss[]; kanaly: { nazwa: string; ok: boolean; ile: number; blad?: string }[]; pobrano: string; blad?: string };

const PLIK = 'config/zrodla-inspiracji.json';
const K_UZYTE = 'inspiracje-uzyte';

/** „5 min temu”, „3 godz. temu”, „wczoraj” */
function ileTemu(iso?: string) {
  if (!iso) return '';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'przed chwilą';
  if (min < 60) return `${min} min temu`;
  const godz = Math.round(min / 60);
  if (godz < 24) return `${godz} godz. temu`;
  const dni = Math.round(godz / 24);
  return dni === 1 ? 'wczoraj' : `${dni} dni temu`;
}

/** Gotowe polecenie do wklejenia w czacie z Claude – pomaga napisać WŁASNY tekst, a nie przepisać cudzy */
export function polecenieDlaClaude(w: WpisRss) {
  return `Piszę krótki wpis do działu „Aktualności” na mojej stronie moto-raport.pl (kanał YouTube MotoFormat).
Temat podpatrzyłem tutaj: ${w.tytul}
Źródło: ${w.link}

Pomóż mi napisać WŁASNY tekst (nie przepisuj artykułu ze źródła):
1. Sprawdź fakty w źródle i, jeśli się da, w drugim niezależnym miejscu (najlepiej u producenta albo w urzędzie). Podaj mi linki.
2. Zaproponuj własny tytuł (do 70 znaków) i wstęp na 1–2 zdania (opis do Google, 120–160 znaków).
3. Treść 250–450 słów, prostym językiem, z nagłówkami „##”:
   - Co się stało (fakty: kto, co, kiedy, ile),
   - Co to znaczy dla kierowcy w Polsce,
   - Nasze zdanie (krótki komentarz – mogę go poprawić po swojemu).
4. Jeśli temat dotyczy konkretnego modelu, podpowiedz, jakie dane z CEPiK warto dodać (np. ile takich aut jeździ w Polsce) – sprawdzę je na moto-raport.pl/marki/.
5. Zaznacz, czego nie jesteś pewien. Nie wymyślaj cen ani dat.`;
}

export default function Inspiracje({ api, branch, token, onNapisz }: { api: ApiPelne; branch: string; token: string; onNapisz: (w: WpisRss) => void }) {
  const [konfig, setKonfig] = useState<Konfig | null>(null);
  const [sha, setSha] = useState<string | undefined>();
  const [dane, setDane] = useState<Odpowiedz | null>(null);
  const [laduje, setLaduje] = useState(false);
  const [blad, setBlad] = useState('');
  const [filtr, setFiltr] = useState('');
  const [szukaj, setSzukaj] = useState('');
  const [pokazUzyte, setPokazUzyte] = useState(false);
  const [uzyte, setUzyte] = useState<string[]>([]);
  const [ile, setIle] = useState(20);
  const [skopiowano, setSkopiowano] = useState('');
  const [nowy, setNowy] = useState<Kanal>({ nazwa: '', rss: '', jezyk: 'pl', wlaczony: true });
  const [zapis, setZapis] = useState('');

  useEffect(() => {
    try {
      setUzyte(JSON.parse(localStorage.getItem(K_UZYTE) || '[]'));
    } catch {
      /* przeglądarka bez pamięci – trudno */
    }
    (async () => {
      let k: Konfig | null = null;
      try {
        const r = await czytajJson<Konfig>(api, PLIK, branch);
        k = r.dane;
        setSha(r.sha);
      } catch {
        k = { kanaly: [] };
      }
      setKonfig(k);
      pobierz(k, false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pobierz(k: Konfig | null = konfig, odswiez = true) {
    if (!k) return;
    setLaduje(true);
    setBlad('');
    try {
      const q = new URLSearchParams({ kanaly: JSON.stringify(k.kanaly) });
      if (odswiez) q.set('odswiez', '1');
      const r = await fetch(`/api/inspiracje/?${q}`, { headers: { Authorization: `Bearer ${token.trim()}` }, cache: 'no-store' });
      const j = (await r.json()) as Odpowiedz;
      if (!r.ok) throw new Error(j.blad || `błąd ${r.status}`);
      setDane(j);
    } catch (e) {
      setBlad((e as Error).message);
    } finally {
      setLaduje(false);
    }
  }

  function zapamietaj(lista: string[]) {
    const krotka = lista.slice(-400);
    setUzyte(krotka);
    try {
      localStorage.setItem(K_UZYTE, JSON.stringify(krotka));
    } catch {
      /* brak pamięci przeglądarki */
    }
  }
  const przelaczUzyte = (link: string) => zapamietaj(uzyte.includes(link) ? uzyte.filter((x) => x !== link) : [...uzyte, link]);

  async function kopiuj(w: WpisRss) {
    try {
      await navigator.clipboard.writeText(polecenieDlaClaude(w));
      setSkopiowano(w.link);
      setTimeout(() => setSkopiowano(''), 2500);
    } catch {
      window.prompt('Skopiuj polecenie (Ctrl+C):', polecenieDlaClaude(w));
    }
  }

  async function zapiszKanaly(k: Konfig) {
    setZapis('Zapisuję…');
    try {
      const nowySha = await zapiszPlik(api, PLIK, JSON.stringify(k, null, 2) + '\n', 'Panel: kanały RSS do inspiracji', branch, sha);
      setSha(nowySha);
      setKonfig(k);
      setZapis('Zapisano.');
      pobierz(k);
    } catch (e) {
      setZapis(`Nie udało się zapisać: ${(e as Error).message}`);
    }
  }

  const zrodlaLista = useMemo(() => [...new Set((dane?.wpisy || []).map((w) => w.zrodlo))], [dane]);
  const widoczne = useMemo(() => {
    const s = szukaj.trim().toLowerCase();
    return (dane?.wpisy || []).filter(
      (w) => (!filtr || w.zrodlo === filtr) && (pokazUzyte || !uzyte.includes(w.link)) && (!s || `${w.tytul} ${w.opis || ''}`.toLowerCase().includes(s))
    );
  }, [dane, filtr, szukaj, pokazUzyte, uzyte]);

  const chip = (aktywny: boolean) =>
    `rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${aktywny ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 ring-slate-200 dark:ring-slate-700 text-slate-700 dark:text-slate-200'}`;

  return (
    <section className={karta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" /> Inspiracje – co piszą inni
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Najnowsze nagłówki z serwisów motoryzacyjnych. Widzisz je tylko Ty. Wybierz temat i kliknij <strong>Napisz wpis</strong> – dostaniesz szkic z linkiem do źródła i planem
            tekstu. Pisz <strong>własnymi słowami</strong> i dodaj swój komentarz – przepisanych tekstów Google nie lubi.
          </p>
        </div>
        <button type="button" onClick={() => pobierz()} disabled={laduje} className={przyciskD}>
          <RefreshCw className={`w-4 h-4 ${laduje ? 'animate-spin' : ''}`} aria-hidden="true" /> Odśwież
        </button>
      </div>

      <details className="rounded-xl bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
        <summary className="cursor-pointer font-semibold">Jak zrobić z nagłówka dobry wpis? (5 zasad)</summary>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>
            <strong>Wybieraj tematy ważne dla kierowcy w Polsce</strong>: przepisy, mandaty, ceny aut i paliwa, akcje serwisowe, popularne modele. Plotki i „ciekawostki” zostaw innym.
          </li>
          <li>
            <strong>Sprawdź fakt u źródła</strong> – najlepiej u producenta, w urzędzie albo w ustawie. Link wpisz w „Źródła”.
          </li>
          <li>
            <strong>Dodaj coś od siebie</strong>: dane z CEPiK (ile takich aut jeździ w Polsce – karta modelu na stronie), link do własnego poradnika lub kalkulatora, swoje zdanie.
          </li>
          <li>
            <strong>Krótko i konkretnie</strong>: 250–450 słów, układ „Co się stało → Co to znaczy dla Ciebie → Nasze zdanie”.
          </li>
          <li>
            <strong>Nie kopiuj</strong> zdań ani zdjęć z cudzych artykułów. Przycisk „Polecenie dla Claude” kopiuje gotową prośbę do czatu – Claude pomoże napisać własny tekst.
          </li>
        </ol>
      </details>

      {blad && (
        <p className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950 px-4 py-3 text-sm text-rose-900 dark:text-rose-200">
          <CircleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" /> Nie udało się pobrać nagłówków: {blad}
        </p>
      )}

      {dane && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={chip(!filtr)} onClick={() => setFiltr('')}>
              Wszystkie
            </button>
            {zrodlaLista.map((z) => (
              <button key={z} type="button" className={chip(filtr === z)} onClick={() => setFiltr(filtr === z ? '' : z)}>
                {z}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex-1 min-w-[14rem]">
              <span className="sr-only">Szukaj w nagłówkach</span>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input className={`${input} pl-9`} placeholder="Szukaj, np. mandat, Toyota, elektryk…" value={szukaj} onChange={(e) => setSzukaj(e.target.value)} />
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={pokazUzyte} onChange={(e) => setPokazUzyte(e.target.checked)} /> pokaż ukryte i wykorzystane
            </label>
          </div>

          {dane.kanaly.some((k) => !k.ok) && (
            <p className="text-xs text-rose-700 dark:text-rose-300">
              Nie działa: {dane.kanaly.filter((k) => !k.ok).map((k) => `${k.nazwa} (${k.blad})`).join(', ')}
            </p>
          )}

          {widoczne.length === 0 && <p className="text-sm text-slate-500">Brak nagłówków dla tych filtrów.</p>}
          <ul className="space-y-3">
            {widoczne.slice(0, ile).map((w) => {
              const uzyty = uzyte.includes(w.link);
              return (
                <li key={w.link} className={`rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 ${uzyty ? 'opacity-50' : ''}`}>
                  <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{w.zrodlo}</span>
                    {w.data && <time dateTime={w.data}>{ileTemu(w.data)}</time>}
                    {w.jezyk !== 'pl' && <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 font-semibold uppercase">{w.jezyk}</span>}
                  </p>
                  <a href={w.link} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-1 font-bold text-slate-900 dark:text-white hover:underline">
                    {w.tytul} <ExternalLink className="w-3.5 h-3.5 mt-1 flex-shrink-0 opacity-50" aria-hidden="true" />
                  </a>
                  {w.opis && <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{w.opis}</p>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      className={przyciskG}
                      onClick={() => {
                        if (!uzyty) przelaczUzyte(w.link);
                        onNapisz(w);
                      }}
                    >
                      <PenLine className="w-4 h-4" aria-hidden="true" /> Napisz wpis
                    </button>
                    <button type="button" className={przyciskD} onClick={() => kopiuj(w)}>
                      <Copy className="w-4 h-4" aria-hidden="true" /> {skopiowano === w.link ? 'Skopiowano!' : 'Polecenie dla Claude'}
                    </button>
                    <button type="button" className={przyciskD} onClick={() => przelaczUzyte(w.link)}>
                      {uzyty ? <Eye className="w-4 h-4" aria-hidden="true" /> : <EyeOff className="w-4 h-4" aria-hidden="true" />} {uzyty ? 'Przywróć' : 'Ukryj'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {widoczne.length > ile && (
            <button type="button" className={przyciskD} onClick={() => setIle(ile + 20)}>
              Pokaż więcej ({widoczne.length - ile})
            </button>
          )}
          <p className="text-[11px] text-slate-500">Pobrano: {new Date(dane.pobrano).toLocaleString('pl-PL')}</p>
        </>
      )}
      {!dane && laduje && <p className="text-sm text-slate-500">Pobieram nagłówki…</p>}

      {konfig && (
        <details className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-sm">
          <summary className="cursor-pointer font-semibold inline-flex items-center gap-2">
            <Settings2 className="w-4 h-4" aria-hidden="true" /> Kanały RSS ({konfig.kanaly.filter((k) => k.wlaczony).length} włączonych)
          </summary>
          <ul className="mt-3 space-y-2">
            {konfig.kanaly.map((k, i) => (
              <li key={k.rss} className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={k.wlaczony}
                    onChange={(e) => setKonfig({ ...konfig, kanaly: konfig.kanaly.map((x, j) => (j === i ? { ...x, wlaczony: e.target.checked } : x)) })}
                  />
                  {k.nazwa}
                </label>
                <span className="text-xs text-slate-500 break-all">{k.rss}</span>
                <button
                  type="button"
                  aria-label={`Usuń kanał ${k.nazwa}`}
                  className="text-rose-700"
                  onClick={() => window.confirm(`Usunąć kanał „${k.nazwa}”?`) && setKonfig({ ...konfig, kanaly: konfig.kanaly.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_2fr_auto_auto] items-end">
            <div>
              <label className={etykieta} htmlFor="k-n">Nazwa</label>
              <input id="k-n" className={input} value={nowy.nazwa} onChange={(e) => setNowy({ ...nowy, nazwa: e.target.value })} placeholder="np. Moto serwis" />
            </div>
            <div>
              <label className={etykieta} htmlFor="k-r">Adres kanału RSS</label>
              <input id="k-r" className={input} value={nowy.rss} onChange={(e) => setNowy({ ...nowy, rss: e.target.value })} placeholder="https://…/feed" />
            </div>
            <div>
              <label className={etykieta} htmlFor="k-j">Język</label>
              <select id="k-j" className={input} value={nowy.jezyk} onChange={(e) => setNowy({ ...nowy, jezyk: e.target.value })}>
                <option value="pl">PL</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </div>
            <button
              type="button"
              className={przyciskD}
              disabled={!nowy.nazwa.trim() || !/^https:\/\//.test(nowy.rss.trim())}
              onClick={() => {
                setKonfig({ ...konfig, kanaly: [...konfig.kanaly, { ...nowy, nazwa: nowy.nazwa.trim(), rss: nowy.rss.trim() }] });
                setNowy({ nazwa: '', rss: '', jezyk: 'pl', wlaczony: true });
              }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Adres kanału znajdziesz zwykle pod ikonką RSS na stronie serwisu albo dopisując do adresu „/feed”. Musi zaczynać się od https://.</p>
          <div className="mt-3 flex items-center gap-3">
            <button type="button" className={przyciskG} onClick={() => zapiszKanaly(konfig)}>
              <Save className="w-4 h-4" aria-hidden="true" /> Zapisz kanały
            </button>
            {zapis && <span className="text-xs text-slate-600 dark:text-slate-300">{zapis}</span>}
          </div>
        </details>
      )}
    </section>
  );
}
