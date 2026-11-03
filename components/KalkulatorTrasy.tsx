'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Route, ArrowLeftRight, Users, MapPinned, PlugZap, Camera, ExternalLink } from 'lucide-react';
import { MIASTA, znajdzMiasto, odlegloscDrogowa } from '@/lib/miasta';
import { domyslneSpalanie, spalanieWTrasie, cenaDla, jednostka, NAZWY_NAPEDU, RodzajNapedu } from '@/lib/paliwa';
import type { CenyPaliw } from '@/lib/panel';
import { sledz } from '@/lib/sledz';
import { ODCINKI, sugestieOdcinkow, ZRODLO_OPLAT } from '@/lib/autostrady';

// Kalkulator kosztu przejazdu: skąd–dokąd (albo liczba km), zużycie paliwa, cena, liczba osób.
// Na karcie modelu startuje z danymi tego auta, a jeśli kierowcy dodali raporty spalania „w trasie” – z ich średnią.

interface Auto {
  slug: string;
  nazwa: string;
  naped: RodzajNapedu;
  pojemnosc: number;
}

const pole =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const zl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
const num = (v: string) => Math.max(0, Number(String(v).replace(',', '.')) || 0);

export default function KalkulatorTrasy({
  ceny,
  auto,
  skad: skadStart = '',
  dokad: dokadStart = '',
  naglowek = true
}: {
  ceny: CenyPaliw;
  auto?: Auto;
  skad?: string;
  dokad?: string;
  naglowek?: boolean;
}) {
  const [skad, setSkad] = useState(skadStart);
  const [dokad, setDokad] = useState(dokadStart);
  const a = znajdzMiasto(skad);
  const b = znajdzMiasto(dokad);
  const szacunek = a && b && a.slug !== b.slug ? odlegloscDrogowa(a, b) : 0;
  const [kmRecznie, setKmRecznie] = useState('');
  const km = kmRecznie ? num(kmRecznie) : szacunek;

  const [naped, setNaped] = useState<RodzajNapedu>(auto?.naped || 'benzyna');
  const startowe = (n: RodzajNapedu) => spalanieWTrasie(n, domyslneSpalanie(n, auto?.pojemnosc || 1.6));
  const [zuzycie, setZuzycie] = useState(String(startowe(naped)).replace('.', ','));
  const [cena, setCena] = useState(String(cenaDla(naped, ceny)).replace('.', ','));
  const [powrot, setPowrot] = useState(false);
  const [osoby, setOsoby] = useState(1);
  const [zRaportow, setZRaportow] = useState(0);
  const sugestie = a && b ? sugestieOdcinkow(a.slug, b.slug) : [];
  const [odcinki, setOdcinki] = useState<string[]>(() => {
    const sa = znajdzMiasto(skadStart), sb = znajdzMiasto(dokadStart);
    return sa && sb ? sugestieOdcinkow(sa.slug, sb.slug) : [];
  });
  const przelaczOdcinek = (id: string) => setOdcinki((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  // średnie spalanie „w trasie” z raportów kierowców (jeśli są co najmniej 3)
  useEffect(() => {
    if (!auto?.slug) return;
    let anuluj = false;
    fetch(`/api/spalanie/?karta=${encodeURIComponent(auto.slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        const t = s?.wgStylu?.trasa;
        if (!anuluj && t?.liczba >= 3 && t.srednia) {
          setZuzycie(String(t.srednia).replace('.', ','));
          setZRaportow(t.liczba);
        }
      })
      .catch(() => {});
    return () => {
      anuluj = true;
    };
  }, [auto?.slug]);

  const zmienNaped = (n: RodzajNapedu) => {
    setNaped(n);
    setZuzycie(String(startowe(n)).replace('.', ','));
    setCena(String(cenaDla(n, ceny)).replace('.', ','));
    setZRaportow(0);
  };

  const wynik = useMemo(() => {
    const dystans = km * (powrot ? 2 : 1);
    const ilosc = (dystans / 100) * num(zuzycie);
    const paliwo = ilosc * num(cena);
    const oplaty = ODCINKI.filter((o) => odcinki.includes(o.id)).reduce((s, o) => s + o.cena, 0) * (powrot ? 2 : 1);
    const koszt = paliwo + oplaty;
    return { dystans, ilosc, paliwo, oplaty, koszt, naOsobe: koszt / Math.max(1, osoby), zaKm: dystans ? koszt / dystans : 0 };
  }, [km, powrot, zuzycie, cena, osoby, odcinki]);

  const j = jednostka(naped);
  const mapyGoogle =
    a && b ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a.nazwa + ', Polska')}&destination=${encodeURIComponent(b.nazwa + ', Polska')}&travelmode=driving` : '';

  return (
    <div id="koszt-trasy" className="scroll-mt-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      {naglowek && (
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Route className="w-5 h-5 text-rust-600" aria-hidden="true" />
            {auto ? `Ile kosztuje trasa ${auto.nazwa}?` : 'Ile kosztuje przejazd?'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Wpisz miasta albo samą liczbę kilometrów. Wszystkie wartości możesz zmienić.</p>
        </div>
      )}

      <datalist id="lista-miast">
        {MIASTA.map((m) => (
          <option key={m.slug} value={m.nazwa} />
        ))}
      </datalist>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label htmlFor="kt-skad" className={etykieta}>
            Skąd
          </label>
          <input id="kt-skad" list="lista-miast" value={skad} onChange={(e) => { setSkad(e.target.value); setKmRecznie(''); }} placeholder="np. Lublin" className={pole} autoComplete="off" />
        </div>
        <button
          type="button"
          onClick={() => {
            setSkad(dokad);
            setDokad(skad);
          }}
          className="justify-self-center p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-steel-600"
          aria-label="Zamień miejscami"
        >
          <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
        </button>
        <div>
          <label htmlFor="kt-dokad" className={etykieta}>
            Dokąd
          </label>
          <input id="kt-dokad" list="lista-miast" value={dokad} onChange={(e) => { setDokad(e.target.value); setKmRecznie(''); }} placeholder="np. Kraków" className={pole} autoComplete="off" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="kt-km" className={etykieta}>
            Odległość (km)
          </label>
          <input
            id="kt-km"
            inputMode="decimal"
            value={kmRecznie || (szacunek ? String(szacunek) : '')}
            onChange={(e) => setKmRecznie(e.target.value)}
            placeholder="np. 320"
            className={`${pole} tabular-nums`}
          />
          {szacunek > 0 && !kmRecznie && <p className="text-[11px] text-slate-500 mt-1">ok. {szacunek} km – szacunek, popraw jeśli znasz dokładną trasę</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="kt-naped" className={etykieta}>
            Napęd
          </label>
          <select id="kt-naped" value={naped} onChange={(e) => zmienNaped(e.target.value as RodzajNapedu)} className={pole}>
            {(Object.keys(NAZWY_NAPEDU) as RodzajNapedu[]).map((n) => (
              <option key={n} value={n}>
                {NAZWY_NAPEDU[n]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="kt-zuz" className={etykieta}>
            Zużycie ({j.zuzycie})
          </label>
          <input id="kt-zuz" inputMode="decimal" value={zuzycie} onChange={(e) => { setZuzycie(e.target.value); setZRaportow(0); }} className={`${pole} tabular-nums`} />
        </div>
        <div>
          <label htmlFor="kt-cena" className={etykieta}>
            Cena ({j.cena})
          </label>
          <input id="kt-cena" inputMode="decimal" value={cena} onChange={(e) => setCena(e.target.value)} className={`${pole} tabular-nums`} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={powrot} onChange={(e) => setPowrot(e.target.checked)} className="w-4 h-4 accent-rust-600" />
          Tam i z powrotem
        </label>
        <div className="inline-flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span id="kt-osoby-l">Osób w aucie:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden" role="group" aria-labelledby="kt-osoby-l">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setOsoby(n)}
                aria-pressed={osoby === n}
                className={`w-8 py-1 text-sm font-semibold ${osoby === n ? 'bg-steel-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={etykieta}>Płatne autostrady na trasie (osobówki)</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ODCINKI.map((o) => (
            <label
              key={o.id}
              className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                odcinki.includes(o.id) ? 'border-steel-500 bg-steel-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <input type="checkbox" checked={odcinki.includes(o.id)} onChange={() => przelaczOdcinek(o.id)} className="w-4 h-4 mt-0.5 accent-steel-600" />
              <span className="flex-1">
                <span className="font-semibold text-slate-900 dark:text-white">{o.nazwa}</span>
                {sugestie.includes(o.id) && <span className="ml-1.5 text-[10px] font-bold uppercase bg-amber-200 text-amber-900 rounded px-1">pewnie po drodze</span>}
                <span className="block text-xs text-slate-500">{o.opis}</span>
              </span>
              <span className="font-bold tabular-nums whitespace-nowrap">{o.cena.toLocaleString('pl-PL', { minimumFractionDigits: o.cena % 1 ? 2 : 0 })} zł</span>
            </label>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          Pozostałe autostrady i ekspresówki są dla osobówek bezpłatne. Ceny za cały odcinek w jedną stronę (
          <a href={ZRODLO_OPLAT.url} target="_blank" rel="noopener" className="underline">
            źródło
          </a>
          ).
        </p>
      </fieldset>

      <div className="rounded-2xl bg-steel-700 text-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4" aria-live="polite">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-xs text-steel-200">{wynik.oplaty ? 'Razem z autostradami' : `Koszt ${naped === 'elektryczny' ? 'prądu' : 'paliwa'}`}</div>
          <div className="text-3xl font-extrabold tabular-nums">{km ? zl(wynik.koszt) : '—'}</div>
          {km > 0 && wynik.oplaty > 0 && (
            <div className="text-[11px] text-steel-200 tabular-nums">
              {naped === 'elektryczny' ? 'prąd' : 'paliwo'} {zl(wynik.paliwo)} + autostrady {zl(wynik.oplaty)}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs text-steel-200">Na osobę</div>
          <div className="text-xl font-bold tabular-nums">{km ? zl(wynik.naOsobe) : '—'}</div>
        </div>
        <div>
          <div className="text-xs text-steel-200">{naped === 'elektryczny' ? 'Energia' : 'Paliwo'}</div>
          <div className="text-xl font-bold tabular-nums">
            {km ? `${wynik.ilosc.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} ${j.ilosc}` : '—'}
          </div>
        </div>
        <div>
          <div className="text-xs text-steel-200">Dystans</div>
          <div className="text-xl font-bold tabular-nums">{km ? `${Math.round(wynik.dystans)} km` : '—'}</div>
        </div>
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        {zRaportow > 0 ? (
          <p>Zużycie to średnia z {zRaportow} raportów kierowców tego modelu z jazdy w trasie.</p>
        ) : (
          <p>Zużycie to szacunek dla jazdy w trasie typowego egzemplarza{auto ? ` (${auto.nazwa})` : ''} – wpisz swoje, jeśli je znasz.</p>
        )}
        <p>
          Ceny średnie z {new Date(ceny.data).toLocaleDateString('pl-PL')}. Parkingów nie liczymy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {mapyGoogle && (
          <a
            href={mapyGoogle}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sledz('trasa_mapy', { skad: a!.slug, dokad: b!.slug })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-steel-500 font-semibold text-slate-700 dark:text-slate-200"
          >
            <MapPinned className="w-4 h-4" aria-hidden="true" /> Dokładna trasa w Mapach Google <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )}
        {naped === 'elektryczny' && (
          <Link href={a && b ? `/ladowarki/?skad=${a.slug}&dokad=${b.slug}` : '/ladowarki/'} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <PlugZap className="w-4 h-4" aria-hidden="true" /> Ładowarki na trasie
          </Link>
        )}
        <Link href={a && b ? `/fotoradary/?skad=${a.slug}&dokad=${b.slug}` : '/fotoradary/'} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-steel-500 font-semibold text-slate-700 dark:text-slate-200">
          <Camera className="w-4 h-4" aria-hidden="true" /> Fotoradary na trasie
        </Link>
      </div>
    </div>
  );
}
