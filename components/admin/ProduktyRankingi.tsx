'use client';
// Zakładka „Produkty i rankingi”: polecane kosmetyki/akcesoria i sezonowe rankingi (plik data/produkty.json).
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Package } from 'lucide-react';
import { ApiPelne, input, etykieta, karta, przyciskG, przyciskD, czytajJson, zapiszPlik, slugify } from '@/components/admin/wspolne';

type Produkt = {
  id: string;
  nazwa: string;
  kategoria: string;
  link: string;
  sklep?: string;
  zdjecie?: string;
  ocena?: number;
  opis: string;
  plusy?: string[];
  minusy?: string[];
  film?: string;
  aktywny: boolean;
};
type Ranking = { id: string; tytul: string; opis: string; sezon: string; od: string; do: string; produkty: string[] };
type Dane = { produkty: Produkt[]; rankingi: Ranking[] };

const PLIK = 'data/produkty.json';
const SEZONY: [string, string][] = [
  ['zima', 'Zima'],
  ['wiosna', 'Wiosna'],
  ['lato', 'Lato'],
  ['jesien', 'Jesień'],
  ['caly-rok', 'Cały rok']
];
const MMDD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export default function ProduktyRankingi({ api, branch }: { api: ApiPelne; branch: string }) {
  const [dane, setDane] = useState<Dane | null>(null);
  const [sha, setSha] = useState('');
  const [zmiany, setZmiany] = useState(false);
  const [otwartyP, setOtwartyP] = useState('');
  const [otwartyR, setOtwartyR] = useState('');
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);

  useEffect(() => {
    czytajJson<Dane>(api, PLIK, branch)
      .then(({ dane, sha }) => {
        setDane(dane);
        setSha(sha);
      })
      .catch((e) => setKom({ ok: false, tekst: `Nie mogę wczytać produktów: ${(e as Error).message}` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zmien = (f: (d: Dane) => Dane) => {
    if (!dane) return;
    setDane(f(dane));
    setZmiany(true);
  };
  const ustawP = (id: string, zm: Partial<Produkt>) => zmien((d) => ({ ...d, produkty: d.produkty.map((p) => (p.id === id ? { ...p, ...zm } : p)) }));
  const ustawR = (id: string, zm: Partial<Ranking>) => zmien((d) => ({ ...d, rankingi: d.rankingi.map((r) => (r.id === id ? { ...r, ...zm } : r)) }));

  function bledy(d: Dane): string | null {
    for (const p of d.produkty) {
      if (!p.nazwa.trim()) return 'Każdy produkt musi mieć nazwę.';
      if (p.link && !/^https:\/\//.test(p.link.trim())) return `Link produktu „${p.nazwa}” musi zaczynać się od https://`;
      if (p.zdjecie && !/^https:\/\//.test(p.zdjecie.trim())) return `Adres zdjęcia „${p.nazwa}” musi zaczynać się od https://`;
    }
    for (const r of d.rankingi) {
      if (!r.tytul.trim()) return 'Każdy ranking musi mieć tytuł.';
      if (!MMDD.test(r.od) || !MMDD.test(r.do)) return `Daty rankingu „${r.tytul}” wpisz jako MM-DD, np. 10-15 (15 października).`;
    }
    return null;
  }

  async function zapisz() {
    if (!dane) return;
    const b = bledy(dane);
    if (b) return setKom({ ok: false, tekst: b });
    // nowe rankingi dostają adres z tytułu (np. /polecane/zima-odmrazacze/) – potem adres się już nie zmienia
    const zajete = new Set(dane.rankingi.map((r) => r.id));
    const doZapisu: Dane = {
      ...dane,
      rankingi: dane.rankingi.map((r) => {
        if (!r.id.startsWith('nowy-')) return r;
        let id = slugify(r.tytul) || r.id;
        while (zajete.has(id)) id += '-2';
        zajete.add(id);
        return { ...r, id };
      })
    };
    setPraca(true);
    try {
      const nowe = await zapiszPlik(api, PLIK, JSON.stringify(doZapisu, null, 2) + '\n', 'Panel: produkty i rankingi', branch, sha);
      setDane(doZapisu);
      setSha(nowe);
      setZmiany(false);
      setKom({ ok: true, tekst: 'Zapisano. Strona zaktualizuje się za kilka minut.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się zapisać: ${(e as Error).message} Jeśli ktoś zmieniał plik w międzyczasie – odśwież stronę.` });
    } finally {
      setPraca(false);
    }
  }

  if (!dane) return kom ? <div className="rounded-xl px-4 py-3 text-sm bg-rose-50 text-rose-900">{kom.tekst}</div> : <p className="text-sm text-slate-500">Wczytuję…</p>;

  const nazwaP = (id: string) => dane.produkty.find((p) => p.id === id)?.nazwa || id;

  return (
    <div className="space-y-4">
      {kom && <div role="status" className={`rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'}`}>{kom.tekst}</div>}

      {/* ---------- PRODUKTY ---------- */}
      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Package className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Produkty ({dane.produkty.length})
        </h2>
        <p className="text-xs text-slate-500">
          Link do produktu najlepiej wygeneruj w panelu Programu Partnerskiego Ceneo (generator linków) – wtedy dostajesz prowizję. Polecaj tylko rzeczy, które naprawdę
          sprawdziłeś: to Twoja wiarygodność.
        </p>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {dane.produkty.map((p) => (
            <li key={p.id} className="py-2">
              <button type="button" onClick={() => setOtwartyP(otwartyP === p.id ? '' : p.id)} className="w-full text-left flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-semibold truncate text-slate-900 dark:text-white">{p.nazwa || 'Nowy produkt'}</span>
                  <span className="block text-xs text-slate-500">{p.kategoria}</span>
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.aktywny ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{p.aktywny ? 'aktywny' : 'ukryty'}</span>
              </button>
              {otwartyP === p.id && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={etykieta}>Nazwa</label>
                      <input className={input} value={p.nazwa} onChange={(e) => ustawP(p.id, { nazwa: e.target.value })} />
                    </div>
                    <div>
                      <label className={etykieta}>Kategoria (np. Odmrażacz do szyb)</label>
                      <input className={input} value={p.kategoria} onChange={(e) => ustawP(p.id, { kategoria: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={etykieta}>Link partnerski (Ceneo lub sklep)</label>
                      <input className={input} value={p.link} onChange={(e) => ustawP(p.id, { link: e.target.value })} placeholder="https://…" />
                    </div>
                    <div>
                      <label className={etykieta}>Nazwa na przycisku („Porównaj ceny na …”)</label>
                      <input className={input} value={p.sklep || ''} onChange={(e) => ustawP(p.id, { sklep: e.target.value })} placeholder="Ceneo" />
                    </div>
                    <div>
                      <label className={etykieta}>Twoja ocena</label>
                      <select className={input} value={p.ocena || 0} onChange={(e) => ustawP(p.id, { ocena: Number(e.target.value) || undefined })}>
                        <option value={0}>bez oceny</option>
                        {[5, 4, 3, 2, 1].map((x) => (
                          <option key={x} value={x}>
                            {'★'.repeat(x)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={etykieta}>Zdjęcie – adres obrazka (opcjonalnie)</label>
                      <input className={input} value={p.zdjecie || ''} onChange={(e) => ustawP(p.id, { zdjecie: e.target.value })} placeholder="https://…" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={etykieta}>Krótki opis – dlaczego polecasz</label>
                      <textarea className={`${input} min-h-[70px]`} value={p.opis} onChange={(e) => ustawP(p.id, { opis: e.target.value })} />
                    </div>
                    <div>
                      <label className={etykieta}>Plusy (jeden w linii)</label>
                      <textarea className={`${input} min-h-[70px]`} value={(p.plusy || []).join('\n')} onChange={(e) => ustawP(p.id, { plusy: e.target.value.split('\n').filter((x) => x.trim()) })} />
                    </div>
                    <div>
                      <label className={etykieta}>Minusy (jeden w linii)</label>
                      <textarea className={`${input} min-h-[70px]`} value={(p.minusy || []).join('\n')} onChange={(e) => ustawP(p.id, { minusy: e.target.value.split('\n').filter((x) => x.trim()) })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={etykieta}>Film z testem – link YouTube albo adres artykułu (opcjonalnie)</label>
                      <input
                        className={input}
                        value={p.film || ''}
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          const yt = v.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/)?.[1];
                          const art = v.match(/\/filmy\/([^/?#]+)/)?.[1];
                          ustawP(p.id, { film: yt || art || v });
                        }}
                        placeholder="https://www.youtube.com/watch?v=…"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={p.aktywny} onChange={(e) => ustawP(p.id, { aktywny: e.target.checked })} /> pokazuj na stronie
                    </label>
                    <button
                      type="button"
                      className={`${przyciskD} text-rose-700 ml-auto`}
                      onClick={() => window.confirm(`Usunąć „${p.nazwa}”?`) && zmien((d) => ({ produkty: d.produkty.filter((x) => x.id !== p.id), rankingi: d.rankingi.map((r) => ({ ...r, produkty: r.produkty.filter((x) => x !== p.id) })) }))}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={przyciskD}
          onClick={() => {
            const id = `p-${Date.now().toString(36)}`;
            zmien((d) => ({ ...d, produkty: [...d.produkty, { id, nazwa: '', kategoria: '', link: '', sklep: 'Ceneo', opis: '', aktywny: true }] }));
            setOtwartyP(id);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj produkt
        </button>
      </section>

      {/* ---------- RANKINGI ---------- */}
      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Rankingi sezonowe ({dane.rankingi.length})
        </h2>
        <p className="text-xs text-slate-500">
          Ranking pokazuje się w „Teraz na sezon” między datami <strong>od</strong> i <strong>do</strong> (co roku, format MM-DD; może przechodzić przez Nowy Rok, np. 10-15 → 03-15).
          Ranking bez produktów nie pojawia się na stronie.
        </p>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {dane.rankingi.map((r) => (
            <li key={r.id} className="py-2">
              <button type="button" onClick={() => setOtwartyR(otwartyR === r.id ? '' : r.id)} className="w-full text-left flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-semibold truncate text-slate-900 dark:text-white">{r.tytul || 'Nowy ranking'}</span>
                  <span className="block text-xs text-slate-500">
                    {r.od} → {r.do} • {r.produkty.length} produktów
                  </span>
                </span>
              </button>
              {otwartyR === r.id && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className={etykieta}>Tytuł</label>
                    <input className={input} value={r.tytul} onChange={(e) => ustawR(r.id, { tytul: e.target.value })} />
                  </div>
                  <div>
                    <label className={etykieta}>Opis (1 zdanie)</label>
                    <input className={input} value={r.opis} onChange={(e) => ustawR(r.id, { opis: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={etykieta}>Sezon</label>
                      <select className={input} value={r.sezon} onChange={(e) => ustawR(r.id, { sezon: e.target.value })}>
                        {SEZONY.map(([v, n]) => (
                          <option key={v} value={v}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={etykieta}>Od (MM-DD)</label>
                      <input className={input} value={r.od} onChange={(e) => ustawR(r.id, { od: e.target.value })} placeholder="10-15" />
                    </div>
                    <div>
                      <label className={etykieta}>Do (MM-DD)</label>
                      <input className={input} value={r.do} onChange={(e) => ustawR(r.id, { do: e.target.value })} placeholder="03-15" />
                    </div>
                  </div>
                  <div>
                    <span className={etykieta}>Produkty w kolejności miejsc</span>
                    <ol className="space-y-1">
                      {r.produkty.map((id, i) => (
                        <li key={id} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-1.5">
                          <span className="font-bold w-5">{i + 1}.</span>
                          <span className="flex-1 truncate">{nazwaP(id)}</span>
                          <button type="button" aria-label="W górę" disabled={i === 0} onClick={() => ustawR(r.id, { produkty: r.produkty.map((x, j) => (j === i - 1 ? id : j === i ? r.produkty[i - 1] : x)) })}>
                            <ArrowUp className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button type="button" aria-label="W dół" disabled={i === r.produkty.length - 1} onClick={() => ustawR(r.id, { produkty: r.produkty.map((x, j) => (j === i + 1 ? id : j === i ? r.produkty[i + 1] : x)) })}>
                            <ArrowDown className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button type="button" aria-label="Usuń z rankingu" onClick={() => ustawR(r.id, { produkty: r.produkty.filter((x) => x !== id) })}>
                            <Trash2 className="w-4 h-4 text-rose-600" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ol>
                    <select
                      className={`${input} mt-2`}
                      value=""
                      onChange={(e) => e.target.value && ustawR(r.id, { produkty: [...r.produkty, e.target.value] })}
                    >
                      <option value="">+ dodaj produkt do rankingu…</option>
                      {dane.produkty
                        .filter((p) => !r.produkty.includes(p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nazwa || '(bez nazwy)'} – {p.kategoria}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button type="button" className={`${przyciskD} text-rose-700`} onClick={() => window.confirm(`Usunąć ranking „${r.tytul}”?`) && zmien((d) => ({ ...d, rankingi: d.rankingi.filter((x) => x.id !== r.id) }))}>
                    <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń ranking
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={przyciskD}
          onClick={() => {
            const id = `nowy-${Date.now().toString(36)}`;
            zmien((d) => ({ ...d, rankingi: [...d.rankingi, { id, tytul: '', opis: '', sezon: 'caly-rok', od: '01-01', do: '12-31', produkty: [] }] }));
            setOtwartyR(id);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Dodaj ranking
        </button>
      </section>

      <div className="sticky bottom-3 flex justify-end">
        <button type="button" onClick={zapisz} disabled={praca || !zmiany} className={`${przyciskG} shadow-lg`}>
          <Save className="w-4 h-4" aria-hidden="true" /> {zmiany ? 'Zapisz produkty i rankingi' : 'Zapisano'}
        </button>
      </div>
    </div>
  );
}
