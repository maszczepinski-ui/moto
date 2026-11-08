'use client';
// Zakładka „Silniki” panelu admina: przegląd biblioteki silników (data/techniczne/silniki.json) i zatwierdzanie.
// Silnik pokazuje się na kartach modeli dopiero po zatwierdzeniu. Pola „do sprawdzenia” nie są potwierdzone w podanym źródle.
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, RotateCcw, Save } from 'lucide-react';
import type { ApiPelne } from './wspolne';
import { input, karta, przyciskD, przyciskG, zapiszPlik, z64 } from './wspolne';
import type { OcenaLpg, Pokrycie, SilnikTech } from '@/lib/silniki';

const PLIK = 'data/techniczne/silniki.json';
type Dane = { _instrukcja?: string[]; silniki: Record<string, SilnikTech> };
const OCENY: { v: OcenaLpg; t: string }[] = [
  { v: 'dobrze', t: 'Dobrze znosi LPG' },
  { v: 'warunkowo', t: 'Z zastrzeżeniami' },
  { v: 'trudno', t: 'Drogie / mało opłacalne' },
  { v: 'nie-dotyczy', t: 'Diesel – nie dotyczy' }
];
const NAZWY_POL: Record<string, string> = { kody: 'kody silnika', wtrysk: 'wtrysk', rozrzad: 'rozrząd', lpg: 'ocena LPG' };

type ModelOpcja = { slug: string; nazwa: string; liczba: number; adres: string };

export default function Silniki({
  api,
  branch,
  uzycia,
  nazwy,
  token,
  modele,
  pokrycie
}: {
  api: ApiPelne;
  branch: string;
  uzycia: Record<string, string[]>;
  nazwy: Map<string, string>;
  token: string;
  modele: ModelOpcja[];
  pokrycie: Pokrycie;
}) {
  const [dane, setDane] = useState<Dane | null>(null);
  const [sha, setSha] = useState('');
  const [oryginal, setOryginal] = useState('');
  const [filtr, setFiltr] = useState<'wszystkie' | 'czekajace' | 'zatwierdzone'>('czekajace');
  const [praca, setPraca] = useState(false);
  const [status, setStatus] = useState<{ typ: 'ok' | 'blad' | 'info'; tekst: string } | null>(null);

  async function wczytaj() {
    setStatus({ typ: 'info', tekst: 'Wczytuję…' });
    try {
      const j = await api(`/contents/${PLIK}?ref=${branch}`);
      const t = z64(j.content);
      setDane(JSON.parse(t));
      setOryginal(JSON.stringify(JSON.parse(t)));
      setSha(j.sha);
      setStatus(null);
    } catch (e) {
      setStatus({ typ: 'blad', tekst: (e as Error).message });
    }
  }
  useEffect(() => {
    wczytaj();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const zmieniono = !!dane && JSON.stringify(dane) !== oryginal;
  const lista = useMemo(
    () =>
      Object.entries(dane?.silniki || {}).filter(([, s]) => (filtr === 'wszystkie' ? true : filtr === 'zatwierdzone' ? s.zatwierdzony : !s.zatwierdzony)),
    [dane, filtr]
  );
  const ile = Object.values(dane?.silniki || {});

  function zmien(id: string, pole: Partial<SilnikTech>) {
    setDane((d) => (d ? { ...d, silniki: { ...d.silniki, [id]: { ...d.silniki[id], ...pole } } } : d));
  }

  async function zapisz() {
    if (!dane) return;
    setPraca(true);
    setStatus({ typ: 'info', tekst: 'Zapisuję…' });
    try {
      const nowy = await zapiszPlik(api, PLIK, JSON.stringify(dane, null, 1) + '\n', 'Panel admina: biblioteka silników (zatwierdzenia)', branch, sha);
      setSha(nowy);
      setOryginal(JSON.stringify(dane));
      setStatus({ typ: 'ok', tekst: 'Zapisano. Strona przebuduje się za kilka minut.' });
    } catch (e) {
      setStatus({ typ: 'blad', tekst: `${(e as Error).message} – kliknij „Wczytaj ponownie” i spróbuj jeszcze raz.` });
    } finally {
      setPraca(false);
    }
  }

  return (
    <div className="space-y-4">
      <GdzieUzupelnic token={token} modele={modele} pokrycie={pokrycie} />
      <LokalizacjeVin api={api} branch={branch} nazwy={nazwy} />
      <div className={karta}>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Biblioteka silników</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Każdy silnik jest opisany raz i trafia do tabel „Silniki” na wszystkich kartach, które z niego korzystają. Na stronie pojawi się dopiero po zaznaczeniu <b>Zatwierdzam</b> i zapisaniu.
          Pola na żółto <b>nie są potwierdzone</b> w podanym źródle – sprawdź je albo popraw przed zatwierdzeniem.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {(['czekajace', 'zatwierdzone', 'wszystkie'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFiltr(f)} className={`px-3 py-1.5 rounded-lg font-semibold ${filtr === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {f === 'czekajace' ? `Czekają (${ile.filter((s) => !s.zatwierdzony).length})` : f === 'zatwierdzone' ? `Zatwierdzone (${ile.filter((s) => s.zatwierdzony).length})` : 'Wszystkie'}
            </button>
          ))}
          <span className="flex-1" />
          <button type="button" onClick={wczytaj} className={przyciskD}>
            <RotateCcw className="w-4 h-4" /> Wczytaj ponownie
          </button>
          <button type="button" onClick={zapisz} disabled={!zmieniono || praca} className={przyciskG}>
            <Save className="w-4 h-4" /> Zapisz
          </button>
        </div>
        {status && <p className={`text-sm font-semibold ${status.typ === 'blad' ? 'text-rose-600' : status.typ === 'ok' ? 'text-emerald-600' : 'text-slate-500'}`}>{status.tekst}</p>}
      </div>

      {lista.map(([id, s]) => {
        const spr = (p: string) => s.doSprawdzenia.includes(p);
        const tlo = (p: string) => (spr(p) ? 'ring-2 ring-amber-400 rounded-lg' : '');
        return (
          <div key={id} className={`${karta} ${s.zatwierdzony ? 'border-emerald-300 dark:border-emerald-800' : ''}`}>
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white">{s.nazwa}</h3>
                <p className="text-xs text-slate-500">
                  {s.pojemnoscCm3 ? `${s.pojemnoscCm3} cm³ · ` : 'kilka pojemności · '}{s.paliwo} · na kartach: {(uzycia[id] || []).map((x) => nazwy.get(x) || x).join(', ') || '—'}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input type="checkbox" checked={s.zatwierdzony} onChange={(e) => zmien(id, { zatwierdzony: e.target.checked })} className="w-5 h-5 accent-emerald-600" />
                {s.zatwierdzony ? <span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Zatwierdzony</span> : 'Zatwierdzam'}
              </label>
            </div>
            {s.uwagi && <p className="text-sm text-amber-700 dark:text-amber-300 flex gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{s.uwagi}</p>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <label className={tlo('kody')}>
                <span className="block text-xs font-semibold text-slate-500 mb-1">Kody silnika (po przecinku)</span>
                <input className={input} value={s.kody.join(', ')} onChange={(e) => zmien(id, { kody: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
              </label>
              <label className={tlo('wtrysk')}>
                <span className="block text-xs font-semibold text-slate-500 mb-1">Wtrysk</span>
                <input className={input} value={s.wtrysk} onChange={(e) => zmien(id, { wtrysk: e.target.value })} />
              </label>
              <label className={tlo('rozrzad')}>
                <span className="block text-xs font-semibold text-slate-500 mb-1">Rozrząd</span>
                <input className={input} value={s.rozrzad} onChange={(e) => zmien(id, { rozrzad: e.target.value })} />
              </label>
              <label className={tlo('lpg')}>
                <span className="block text-xs font-semibold text-slate-500 mb-1">LPG</span>
                <select className={input} value={s.lpg} onChange={(e) => zmien(id, { lpg: e.target.value as OcenaLpg })}>
                  {OCENY.map((o) => (
                    <option key={o.v} value={o.v}>{o.t}</option>
                  ))}
                </select>
              </label>
            </div>
            {s.doSprawdzenia.length > 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Do sprawdzenia: {s.doSprawdzenia.map((p) => NAZWY_POL[p] || p).join(', ')}.{' '}
                <button type="button" className="underline" onClick={() => zmien(id, { doSprawdzenia: [] })}>Sprawdziłem – usuń oznaczenie</button>
              </p>
            )}
            <p className="text-xs text-slate-500">
              Źródła:{' '}
              {s.zrodla.length
                ? s.zrodla.map((z) => (
                    <a key={z.url} href={z.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline mr-3">
                      {z.tytul} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))
                : 'brak – nie zatwierdzaj bez sprawdzenia'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ——— Gdzie jest VIN w modelu (data/techniczne/vin.json) – pokazywane w asystencie zakupu po zatwierdzeniu ———
const PLIK_VIN = 'data/techniczne/vin.json';
type WpisVin = { miejsca: string[]; zrodla: { tytul: string; url: string }[]; zatwierdzony: boolean };
type DaneVin = { _instrukcja?: string[]; modele: Record<string, WpisVin> };

function LokalizacjeVin({ api, branch, nazwy }: { api: ApiPelne; branch: string; nazwy: Map<string, string> }) {
  const [dane, setDane] = useState<DaneVin | null>(null);
  const [sha, setSha] = useState('');
  const [oryginal, setOryginal] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api(`/contents/${PLIK_VIN}?ref=${branch}`)
      .then((j) => {
        const d = JSON.parse(z64(j.content));
        setDane(d);
        setOryginal(JSON.stringify(d));
        setSha(j.sha);
      })
      .catch((e) => setStatus((e as Error).message));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function zapisz() {
    if (!dane) return;
    setStatus('Zapisuję…');
    try {
      setSha(await zapiszPlik(api, PLIK_VIN, JSON.stringify(dane, null, 1) + '\n', 'Panel admina: lokalizacje VIN (zatwierdzenia)', branch, sha));
      setOryginal(JSON.stringify(dane));
      setStatus('Zapisano. Strona przebuduje się za kilka minut.');
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  if (!dane) return status ? <p className="text-sm text-rose-600">{status}</p> : null;
  return (
    <div className={karta}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="flex-1 text-lg font-bold text-slate-900 dark:text-white">Gdzie jest VIN w modelu</h2>
        <button type="button" onClick={zapisz} disabled={JSON.stringify(dane) === oryginal} className={przyciskG}>
          <Save className="w-4 h-4" /> Zapisz
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">Pokazuje się w asystencie zakupu danego modelu (krok 1). Ogólne miejsca (dowód, tabliczka, szyba) są tam zawsze.</p>
      {status && <p className="text-sm font-semibold text-slate-500">{status}</p>}
      {Object.entries(dane.modele).map(([slug, w]) => (
        <div key={slug} className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <b className="flex-1 text-slate-900 dark:text-white">{nazwy.get(slug) || slug}</b>
            <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={w.zatwierdzony}
                onChange={(e) => setDane({ ...dane, modele: { ...dane.modele, [slug]: { ...w, zatwierdzony: e.target.checked } } })}
                className="w-5 h-5 accent-emerald-600"
              />
              {w.zatwierdzony ? 'Zatwierdzony' : 'Zatwierdzam'}
            </label>
          </div>
          <ul className="text-sm list-disc pl-5 text-slate-700 dark:text-slate-300">
            {w.miejsca.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">
            {w.zrodla.map((z) => (
              <a key={z.url} href={z.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline mr-3">
                {z.tytul} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

// ——— Raport „Gdzie uzupełnić dane”: najczęściej odwiedzane karty (GA4) i stan ich danych technicznych ———
function GdzieUzupelnic({ token, modele, pokrycie }: { token: string; modele: ModelOpcja[]; pokrycie: Pokrycie }) {
  const [wiersze, setWiersze] = useState<{ m: ModelOpcja; odslony: number | null }[] | null>(null);
  const [zrodlo, setZrodlo] = useState<'ga4' | 'cepik'>('ga4');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const poAdresie = new Map(modele.map((m) => [m.adres, m]));
    // gdy GA4 nie odpowie – zastępczo najpopularniejsze auta w Polsce (CEPiK)
    const zastepczo = () => {
      setZrodlo('cepik');
      setWiersze([...modele].sort((a, b) => b.liczba - a.liczba).slice(0, 30).map((m) => ({ m, odslony: null })));
    };
    fetch('/api/statystyki/?dni=28&raport=karty', { headers: { Authorization: `Bearer ${token.trim()}` }, cache: 'no-store' })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) {
          setInfo(j.blad === 'brak-konfiguracji' ? 'Statystyki GA4 nie są podłączone.' : j.blad || `Błąd ${r.status}`);
          return zastepczo();
        }
        // sumujemy kartę i jej asystenta zakupu (…/zakup/)
        const suma = new Map<string, number>();
        for (const w of j.strony as { nazwa: string; wartosc: number }[]) {
          const adres = w.nazwa.split('?')[0].replace(/zakup\/$/, '');
          if (poAdresie.has(adres)) suma.set(adres, (suma.get(adres) || 0) + w.wartosc);
        }
        if (!suma.size) {
          setInfo('GA4 nie ma jeszcze odsłon kart modeli.');
          return zastepczo();
        }
        setWiersze([...suma].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([adres, odslony]) => ({ m: poAdresie.get(adres)!, odslony })));
      })
      .catch(() => {
        setInfo('Brak połączenia ze statystykami.');
        zastepczo();
      });
  }, [token, modele]);

  const stan = (slug: string) => {
    const p = pokrycie[slug];
    if (!p || !p.wersji) return { tekst: 'brak tabeli silników', kolor: 'text-slate-500' };
    if (!p.opisane) return { tekst: `0 z ${p.wersji} wersji opisanych`, kolor: 'text-rose-600' };
    if (p.zatwierdzone < p.opisane) return { tekst: `${p.opisane} z ${p.wersji} opisanych · ${p.opisane - p.zatwierdzone} czeka na zatwierdzenie`, kolor: 'text-amber-600' };
    return { tekst: `${p.opisane} z ${p.wersji} opisanych i zatwierdzonych`, kolor: p.opisane === p.wersji ? 'text-emerald-600' : 'text-amber-600' };
  };

  return (
    <details className={karta} open>
      <summary className="cursor-pointer text-lg font-bold text-slate-900 dark:text-white">Gdzie uzupełnić dane – najczęściej odwiedzane karty</summary>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {zrodlo === 'ga4'
          ? 'Karty modeli z największą liczbą odsłon w ostatnich 28 dniach (z asystentem zakupu). Najpierw uzupełniaj i zatwierdzaj dane tam, gdzie jest najwięcej czytelników.'
          : `${info} Na razie pokazuję najpopularniejsze auta w Polsce według CEPiK.`}
      </p>
      {!wiersze ? (
        <p className="text-sm text-slate-500">Wczytuję…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 text-left">
              <tr>
                <th className="py-1.5 pr-3">Karta</th>
                <th className="py-1.5 pr-3 text-right">{zrodlo === 'ga4' ? 'Odsłony' : 'Aut w Polsce'}</th>
                <th className="py-1.5">Dane techniczne</th>
              </tr>
            </thead>
            <tbody>
              {wiersze.map(({ m, odslony }) => {
                const s = stan(m.slug);
                return (
                  <tr key={m.slug} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-1.5 pr-3">
                      <a href={m.adres} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                        {m.nazwa}
                      </a>
                    </td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{(odslony ?? m.liczba).toLocaleString('pl-PL')}</td>
                    <td className={`py-1.5 font-semibold ${s.kolor}`}>{s.tekst}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-slate-500">„Brak tabeli silników” – tę kartę trzeba najpierw uzupełnić o listę wersji. Napisz do mnie w czacie, które modele dodać.</p>
    </details>
  );
}
