'use client';
// Sprawdzacz kosztorysu (dla kupujących pakiet po szkodzie).
// 1) Sprawa, 2) Kosztorys, 3) Wynik (czerwone flagi, kwota sporna, terminy), 4) Pisma (etap 1 i etap 2).
// Wszystkie wpisane dane zostają w przeglądarce (localStorage) – na serwer idzie tylko logowanie i pobranie treści pism.
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, CalendarClock, Car, Check, ClipboardCopy, Download, FileText, Loader2, LogOut, Printer, Scale, ShieldCheck, Trash2, Wrench
} from 'lucide-react';
import LogowanieKodem from '@/components/sklep/LogowanieKodem';
import LinkPartnerski from '@/components/LinkPartnerski';
import type { DaneSzkody, Pismo } from '@/lib/szkoda/typy';
import {
  POCZATEK, art8Gotowe, data, kwotaSporna, kwotaZadana, mediana, pasujaceArgumenty, pismoTekst, skladniki, terminy, wartosci, wypelnij, zl, zlozPismo,
  type GotowePismo, type StanSprawdzacza
} from '@/lib/szkoda/sprawdzacz';

const PAMIEC_DANYCH = 'ns-dane';
const PAMIEC_STANU = 'ns-stan';
const czytaj = <T,>(k: string): T | null => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
};
const zapisz = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* brak pamięci przeglądarki – narzędzie działa dalej */
  }
};

const KROKI = [
  { id: 'sprawa', t: 'Sprawa', ikona: Car },
  { id: 'kosztorys', t: 'Kosztorys', ikona: Wrench },
  { id: 'wynik', t: 'Wynik', ikona: Scale },
  { id: 'pisma', t: 'Pisma', ikona: FileText }
] as const;
type Krok = (typeof KROKI)[number]['id'];

const pole = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-base';

function Tekst({ l, v, z, typ = 'text', pod, wiersze }: { l: string; v: string; z: (v: string) => void; typ?: string; pod?: string; wiersze?: number }) {
  return (
    <label className="block text-sm">
      <span className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">{l}</span>
      {wiersze ? <textarea rows={wiersze} className={pole} value={v} onChange={(e) => z(e.target.value)} /> : <input type={typ} className={pole} value={v} onChange={(e) => z(e.target.value)} />}
      {pod && <span className="block text-xs text-slate-500 mt-1">{pod}</span>}
    </label>
  );
}

function Kwota({ l, v, z, pod, jednostka = 'zł' }: { l: string; v: number; z: (v: number) => void; pod?: string; jednostka?: string }) {
  const [tekst, setTekst] = useState(v ? String(v).replace('.', ',') : '');
  useEffect(() => {
    // gdy stan wyczyszczono z zewnątrz
    if (!v) setTekst((t) => (t && Number(t.replace(/\s/g, '').replace(',', '.')) ? '' : t));
  }, [v]);
  return (
    <label className="block text-sm">
      <span className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">{l}</span>
      <span className="relative block">
        <input
          inputMode="decimal"
          className={`${pole} pr-12 tabular-nums`}
          value={tekst}
          onChange={(e) => {
            const t = e.target.value.replace(/[^\d,.\s]/g, '');
            setTekst(t);
            const n = Number(t.replace(/\s/g, '').replace(',', '.'));
            z(Number.isFinite(n) ? n : 0);
          }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">{jednostka}</span>
      </span>
      {pod && <span className="block text-xs text-slate-500 mt-1">{pod}</span>}
    </label>
  );
}

function Pytanie({ l, v, z, pod }: { l: string; v: boolean; z: (v: boolean) => void; pod?: string }) {
  return (
    <div className="text-sm">
      <p className="font-semibold text-slate-800 dark:text-slate-200">{l}</p>
      {pod && <p className="text-xs text-slate-500 mt-0.5">{pod}</p>}
      <div className="flex gap-2 mt-2">
        {[true, false].map((x) => (
          <button
            key={String(x)}
            type="button"
            onClick={() => z(x)}
            aria-pressed={v === x}
            className={`min-w-[5rem] rounded-xl px-4 py-2 font-semibold border ${v === x ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900' : 'border-slate-300 dark:border-slate-700'}`}
          >
            {x ? 'Tak' : 'Nie'}
          </button>
        ))}
      </div>
    </div>
  );
}

const Karta = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 ${className}`}>{children}</section>
);
const Naglowek = ({ children, pod }: { children: React.ReactNode; pod?: string }) => (
  <div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{children}</h2>
    {pod && <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{pod}</p>}
  </div>
);

function KopiujPrzycisk({ tekst, etykieta = 'Kopiuj tekst' }: { tekst: string; etykieta?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(tekst);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        } catch {
          /* przeglądarka nie pozwala – tekst jest w podglądzie */
        }
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:border-slate-500"
    >
      {ok ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <ClipboardCopy className="w-4 h-4" aria-hidden="true" />} {ok ? 'Skopiowano' : etykieta}
    </button>
  );
}

function drukuj(g: GotowePismo) {
  const okno = window.open('', '_blank');
  if (!okno) return;
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!).replace(/(\[uzupełnij:[^\]]*\])/g, '<mark>$1</mark>');
  const tresc = g.elementy.map((e) => (e.typ === 'p' ? `<p>${esc(e.t)}</p>` : `<p><b>${e.nr}. ${esc(e.tytul)}</b></p>${e.akapity.map((a) => `<p class="w">${esc(a)}</p>`).join('')}`)).join('');
  okno.document.write(`<!doctype html><html lang="pl"><meta charset="utf-8"><title>${esc(g.naglowek)}</title><style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.45;max-width:170mm;margin:15mm auto;color:#000}p{margin:0 0 7pt;text-align:justify}.w{margin-left:6mm}.r{text-align:right}.a{margin-left:85mm}h1{font-size:13pt;text-align:center;margin:14pt 0}mark{background:#fde047}@page{margin:15mm}</style>
<p class="r">${esc(g.miejsceData)}</p><p>${g.nadawca.map(esc).join('<br>')}</p><p class="a"><b>${g.adresat.map(esc).join('<br>')}</b></p><p><b>${esc(g.dotyczy)}</b></p><h1>${esc(g.naglowek.toUpperCase())}</h1>${tresc}
${g.zalaczniki.length ? `<p><b>Załączniki:</b><br>${g.zalaczniki.map((z, i) => `${i + 1}) ${esc(z)}`).join('<br>')}</p>` : ''}<p class="r" style="margin-top:40pt">……………………………………<br>${esc(g.podpis)}</p></html>`);
  okno.document.close();
  okno.focus();
  okno.print();
}

function KartaPisma({ p, s, dane, nazwaPliku }: { p: Pismo; s: StanSprawdzacza; dane: DaneSzkody; nazwaPliku: string }) {
  const g = useMemo(() => zlozPismo(p, s, dane), [p, s, dane]);
  const [praca, setPraca] = useState(false);
  const bezFormalnosci = p.id === 'rzecznik';
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">{p.tytul}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{p.kiedy}</p>
      </div>
      {g.braki > 0 && (
        <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 rounded-xl px-3 py-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" /> Brakuje {g.braki} {g.braki === 1 ? 'informacji' : 'informacji'} – w piśmie są oznaczone na żółto. Uzupełnij je w kroku „Sprawa” albo w Wordzie.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {!bezFormalnosci && (
          <button
            type="button"
            disabled={praca}
            onClick={async () => {
              setPraca(true);
              const { pobierzDocx } = await import('@/lib/szkoda/docx-pisma');
              await pobierzDocx(g, nazwaPliku).catch(() => alert('Nie udało się utworzyć pliku. Skopiuj tekst albo wydrukuj pismo.'));
              setPraca(false);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2.5 text-sm font-bold"
          >
            {praca ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4" aria-hidden="true" />} Pobierz Word
          </button>
        )}
        <KopiujPrzycisk tekst={pismoTekst(g, !bezFormalnosci)} />
        {!bezFormalnosci && (
          <button type="button" onClick={() => drukuj(g)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:border-slate-500">
            <Printer className="w-4 h-4" aria-hidden="true" /> Drukuj / PDF
          </button>
        )}
      </div>
      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-steel-700 dark:text-steel-300">Podgląd treści</summary>
        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200 max-h-[28rem] overflow-y-auto">
          {pismoTekst(g, !bezFormalnosci)
            .split(/(\[uzupełnij:[^\]]*\])/)
            .map((cz, i) => (cz.startsWith('[uzupełnij:') ? <mark key={i} className="bg-amber-200 dark:bg-amber-700/60 dark:text-white rounded px-0.5">{cz}</mark> : cz))}
        </div>
      </details>
    </article>
  );
}

export default function Sprawdzacz({ kancelaria }: { kancelaria: { partner: string; url: string } | null }) {
  const [dostep, setDostep] = useState<'laduje' | 'zaloguj' | 'ok' | 'blad'>('laduje');
  const [dane, setDane] = useState<DaneSzkody | null>(null);
  const [email, setEmail] = useState('');
  const [s, setS] = useState<StanSprawdzacza>(POCZATEK);
  const [krok, setKrok] = useState<Krok>('sprawa');
  const [wczytano, setWczytano] = useState(false);

  async function pobierz() {
    setDostep('laduje');
    const r = await fetch('/api/po-szkodzie/dane/', { cache: 'no-store' }).catch(() => null);
    if (r?.status === 401) return setDostep('zaloguj');
    const j = r?.ok ? await r.json().catch(() => null) : null;
    if (j?.dane) {
      setDane(j.dane);
      setEmail(j.email);
      zapisz(PAMIEC_DANYCH, j.dane);
      return setDostep('ok');
    }
    // brak zasięgu – ostatnia zapisana wersja
    const kopia = czytaj<DaneSzkody>(PAMIEC_DANYCH);
    if (kopia) {
      setDane(kopia);
      return setDostep('ok');
    }
    setDostep(r?.status === 503 ? 'blad' : 'blad');
  }

  useEffect(() => {
    const zap = czytaj<Partial<StanSprawdzacza>>(PAMIEC_STANU);
    if (zap) setS({ ...POCZATEK, ...zap });
    setWczytano(true);
    pobierz();
  }, []);
  useEffect(() => {
    if (wczytano) zapisz(PAMIEC_STANU, s);
  }, [s, wczytano]);
  useEffect(() => {
    if (email && !s.email) setS((x) => ({ ...x, email }));
  }, [email, s.email]);

  const u = <K extends keyof StanSprawdzacza>(k: K) => (v: StanSprawdzacza[K]) => setS((x) => ({ ...x, [k]: v }));

  if (dostep === 'laduje')
    return (
      <p className="flex items-center justify-center gap-2 py-16 text-slate-600 dark:text-slate-300">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Wczytuję Sprawdzacz…
      </p>
    );
  if (dostep === 'zaloguj')
    return (
      <LogowanieKodem
        api="/api/po-szkodzie/"
        tytul="Sprawdzacz kosztorysu"
        opis="Sprawdzenie kosztorysu, kwota do odzyskania i gotowe pisma do ubezpieczyciela. Dostęp dla osób, które kupiły Niezbędnik po szkodzie."
        ikona={<Scale className="w-6 h-6 text-emerald-600" aria-hidden="true" />}
        poZalogowaniu={pobierz}
      />
    );
  if (dostep === 'blad' || !dane)
    return (
      <div className="rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-3">
        <p className="font-semibold text-slate-900 dark:text-white">Nie udało się wczytać Sprawdzacza.</p>
        <button onClick={pobierz} className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold">
          Spróbuj ponownie
        </button>
      </div>
    );

  return <Narzedzie dane={dane} s={s} u={u} setS={setS} krok={krok} setKrok={setKrok} kancelaria={kancelaria} />;
}

function Narzedzie({
  dane, s, u, setS, krok, setKrok, kancelaria
}: {
  dane: DaneSzkody;
  s: StanSprawdzacza;
  u: <K extends keyof StanSprawdzacza>(k: K) => (v: StanSprawdzacza[K]) => void;
  setS: React.Dispatch<React.SetStateAction<StanSprawdzacza>>;
  krok: Krok;
  setKrok: (k: Krok) => void;
  kancelaria: { partner: string; url: string } | null;
}) {
  const pasujace = pasujaceArgumenty(s, dane);
  const sklad = skladniki(s);
  const sporna = kwotaSporna(s);
  const zadana = kwotaZadana(s);
  const daty = terminy(s);
  const w = wartosci(s);
  const pisma1 = dane.pisma.filter((p) => p.etap === 1 && (p.id !== 'zastepcze' || s.kosztNajmu > 0) && (p.id !== 'ponaglenie' || !s.wyplacono));
  const pisma2 = dane.pisma.filter((p) => p.etap === 2 && (p.id === 'wezwanie-art8' ? s.odpowiedzWTerminie === 'nie' : s.odpowiedzWTerminie === 'tak'));
  const ogloszenia = s.ogloszenia.length < 5 ? [...s.ogloszenia, ...Array(5 - s.ogloszenia.length).fill(0)] : s.ogloszenia;
  const idz = (k: Krok) => {
    setKrok(k);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          <Scale className="w-7 h-7 text-emerald-600" aria-hidden="true" /> Sprawdzacz kosztorysu
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              if (confirm('Usunąć wszystkie wpisane dane z tego urządzenia?')) {
                setS(POCZATEK);
                idz('sprawa');
              }
            }}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-rose-600"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" /> Wyczyść dane
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/po-szkodzie/wyloguj/', { method: 'POST' }).catch(() => null);
              location.reload();
            }}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" /> Wyloguj
          </button>
        </div>
      </header>
      <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 -mt-2">
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" aria-hidden="true" /> Wszystko, co wpiszesz, zostaje na tym urządzeniu. Nie wysyłamy Twoich danych ani kosztorysu na serwer.
      </p>

      <nav aria-label="Kroki" className="grid grid-cols-4 gap-1.5 sticky top-16 z-10 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur py-2 -mx-1 px-1">
        {KROKI.map((k, i) => (
          <button
            key={k.id}
            type="button"
            onClick={() => idz(k.id)}
            aria-current={krok === k.id ? 'step' : undefined}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl px-2 py-2 text-xs sm:text-sm font-semibold ${
              krok === k.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <k.ikona className="w-4 h-4" aria-hidden="true" />
            <span>
              <span className="hidden sm:inline">{i + 1}. </span>
              {k.t}
            </span>
          </button>
        ))}
      </nav>

      {krok === 'sprawa' && (
        <>
          <Karta>
            <Naglowek pod="Przepisz z decyzji ubezpieczyciela.">Szkoda</Naglowek>
            <div className="grid sm:grid-cols-2 gap-4">
              <Tekst l="Ubezpieczyciel sprawcy" v={s.ubezpieczyciel} z={u('ubezpieczyciel')} pod="np. nazwa z decyzji" />
              <Tekst l="Numer szkody" v={s.numerSzkody} z={u('numerSzkody')} />
              <div className="sm:col-span-2">
                <Tekst l="Adres ubezpieczyciela do korespondencji" v={s.adresUbezpieczyciela} z={u('adresUbezpieczyciela')} pod="Z decyzji albo strony ubezpieczyciela (dział reklamacji). Oddziel linie przecinkiem." />
              </div>
              <Tekst l="Data zdarzenia" typ="date" v={s.dataZdarzenia} z={u('dataZdarzenia')} />
              <Tekst l="Data zgłoszenia szkody" typ="date" v={s.dataZgloszenia} z={u('dataZgloszenia')} />
              <Tekst l="Marka i model" v={s.markaModel} z={u('markaModel')} />
              <Tekst l="Numer rejestracyjny" v={s.nrRej} z={u('nrRej')} />
              <Tekst l="Rok produkcji" v={s.rokProdukcji} z={u('rokProdukcji')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Pytanie l="Czy ubezpieczyciel już coś wypłacił?" v={s.wyplacono} z={u('wyplacono')} />
              {s.wyplacono && (
                <div className="grid grid-cols-1 gap-4">
                  <Kwota l="Wypłacona kwota" v={s.kwotaWyplacona} z={u('kwotaWyplacona')} />
                  <Tekst l="Data decyzji" typ="date" v={s.dataDecyzji} z={u('dataDecyzji')} />
                </div>
              )}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Jaki rodzaj szkody uznał ubezpieczyciel?</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(
                  [
                    ['czesciowa', 'Naprawa (szkoda częściowa)'],
                    ['calkowita', 'Szkoda całkowita']
                  ] as const
                ).map(([v, t]) => (
                  <button key={v} type="button" onClick={() => u('rodzaj')(v)} aria-pressed={s.rodzaj === v} className={`rounded-xl px-4 py-2 font-semibold border ${s.rodzaj === v ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900' : 'border-slate-300 dark:border-slate-700'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Karta>
          <Karta>
            <Naglowek pod="Te dane trafią tylko do Twoich pism (nadawca i numer konta do wypłaty).">Twoje dane do pism</Naglowek>
            <div className="grid sm:grid-cols-2 gap-4">
              <Tekst l="Imię i nazwisko" v={s.imieNazwisko} z={u('imieNazwisko')} />
              <Tekst l="Miejscowość (do daty pisma)" v={s.miejscowosc} z={u('miejscowosc')} />
              <div className="sm:col-span-2">
                <Tekst l="Twój adres" v={s.adres} z={u('adres')} pod="ulica, numer, kod pocztowy i miejscowość" />
              </div>
              <Tekst l="Telefon (opcjonalnie)" typ="tel" v={s.telefon} z={u('telefon')} />
              <Tekst l="E-mail" typ="email" v={s.email} z={u('email')} />
              <div className="sm:col-span-2">
                <Tekst l="Numer konta do wypłaty (opcjonalnie)" v={s.konto} z={u('konto')} />
              </div>
            </div>
          </Karta>
          <button type="button" onClick={() => idz('kosztorys')} className="w-full sm:w-auto rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3">
            Dalej: kosztorys
          </button>
        </>
      )}

      {krok === 'kosztorys' && (
        <>
          {s.rodzaj === 'czesciowa' ? (
            <Karta>
              <Naglowek pod="Wpisz tylko to, co widzisz w kosztorysie. Czego nie ma – zostaw puste.">Liczby z kosztorysu</Naglowek>
              <div className="grid sm:grid-cols-2 gap-4">
                <Kwota l="Stawka za roboczogodzinę (netto)" v={s.stawkaKosztorys} z={u('stawkaKosztorys')} jednostka="zł/h" pod="Szukaj „stawka”, „rbg” albo „roboczogodzina” w części o robociźnie." />
                <Kwota l="Liczba roboczogodzin (razem)" v={s.rbg} z={u('rbg')} jednostka="h" pod="Suma godzin blacharskich i lakierniczych." />
                <Kwota l="Stawka podana przez warsztat (opcjonalnie)" v={s.stawkaWarsztat} z={u('stawkaWarsztat')} jednostka="zł/h" pod="Nie masz? Pomiń – pismo poprosi ubezpieczyciela o wskazanie warsztatu. Gotową wiadomość do warsztatu znajdziesz w wyniku." />
                {s.stawkaWarsztat > 0 && <Tekst l="Nazwa warsztatu" v={s.nazwaWarsztatu} z={u('nazwaWarsztatu')} />}
              </div>
              <Pytanie l="Czy przy częściach są zamienniki zamiast oryginałów?" pod="Litery Q, P, PJ przy numerze części albo słowo „zamiennik”." v={s.zamienniki} z={u('zamienniki')} />
              {s.zamienniki && <Kwota l="Ile droższe byłyby części oryginalne? (opcjonalnie)" v={s.roznicaOryginaly} z={u('roznicaOryginaly')} pod="Różnica z wyceny ASO albo katalogu. Bez tej kwoty argument i tak trafi do pisma." />}
              <div className="grid sm:grid-cols-2 gap-4">
                <Kwota l="Potrącenia od cen części" v={s.potracenia} z={u('potracenia')} pod="„Amortyzacja”, „urealnienie”, „obniżenie wartości” – suma kwot." />
                <Kwota l="Rabaty na części i lakier" v={s.rabaty} z={u('rabaty')} pod="„Rabat”, „upust” – suma kwot." />
              </div>
              <Pytanie l="Czy wypłacono kwotę netto (bez VAT)?" v={s.netto} z={u('netto')} />
              {s.netto && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Pytanie l="Czy odliczasz VAT od tego auta (firma, VAT)?" v={s.odliczamVat} z={u('odliczamVat')} />
                  <Pytanie l="Czy auto zostało już naprawione bez faktury z VAT?" pod="Wtedy VAT się nie należy (uchwała SN III CZP 32/24)." v={s.naprawionoBezVat} z={u('naprawionoBezVat')} />
                </div>
              )}
              <Tekst l="Uszkodzenia pominięte w kosztorysie (opcjonalnie)" v={s.pominiete} z={u('pominiete')} wiersze={2} pod="Np. „mocowanie zderzaka, czujnik parkowania lewy”. Zrób zdjęcia z datą." />
            </Karta>
          ) : (
            <Karta>
              <Naglowek pod="Przy szkodzie całkowitej liczą się dwie liczby: wartość auta przed szkodą i wartość wraku.">Szkoda całkowita</Naglowek>
              <div className="grid sm:grid-cols-2 gap-4">
                <Kwota l="Wartość auta przed szkodą (wg ubezpieczyciela)" v={s.wartoscTu} z={u('wartoscTu')} />
                <Kwota l="Wartość wraku (wg ubezpieczyciela)" v={s.wrakTu} z={u('wrakTu')} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Ceny 3–5 podobnych aut z ogłoszeń</p>
                <p className="text-xs text-slate-500">Ten sam model, rocznik, silnik i podobny przebieg. Zrób zrzuty ekranu z datą – dołączysz je do pisma.</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ogloszenia.map((x, i) => (
                    <Kwota
                      key={i}
                      l={`Ogłoszenie ${i + 1}`}
                      v={x}
                      z={(v) => {
                        const n = [...ogloszenia];
                        n[i] = v;
                        u('ogloszenia')(n.filter((y, j) => y > 0 || j < 3));
                      }}
                    />
                  ))}
                </div>
                {mediana(s.ogloszenia) > 0 && <p className="text-sm text-slate-700 dark:text-slate-300">Środkowa cena z ogłoszeń: <b>{zl(mediana(s.ogloszenia))}</b></p>}
              </div>
              <Kwota l="Oferta odkupu wraku, którą dostałeś (opcjonalnie)" v={s.wrakWlasny} z={u('wrakWlasny')} pod="Np. ze skupu wraków albo od warsztatu – na piśmie lub mailem." />
            </Karta>
          )}
          <Karta>
            <Naglowek pod="Opcjonalnie – jeśli te koszty dotyczą Twojej sprawy.">Dodatkowe koszty</Naglowek>
            <div className="grid sm:grid-cols-2 gap-4">
              <Kwota l="Koszt najmu auta zastępczego" v={s.kosztNajmu} z={u('kosztNajmu')} pod="Jeśli ubezpieczyciel jeszcze go nie zwrócił." />
              {s.kosztNajmu > 0 && <Tekst l="Okres najmu" v={s.okresNajmu} z={u('okresNajmu')} pod="np. 3–17.11.2026" />}
              {s.kosztNajmu > 0 && (
                <div className="sm:col-span-2">
                  <Tekst l="Po co było Ci auto?" v={s.celNajmu} z={u('celNajmu')} pod="Dokończ zdanie „Pojazd był mi niezbędny, ponieważ…”, np. „dojeżdżam do pracy 40 km dziennie i wożę dzieci do szkoły”." />
                </div>
              )}
              <Kwota l="Koszt prywatnego rzeczoznawcy" v={s.kosztRzeczoznawcy} z={u('kosztRzeczoznawcy')} />
            </div>
          </Karta>
          <button type="button" onClick={() => idz('wynik')} className="w-full sm:w-auto rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3">
            Zobacz wynik
          </button>
        </>
      )}

      {krok === 'wynik' && (
        <>
          <Karta>
            <Naglowek pod="Zaznaczone argumenty trafią do pism. Odznacz te, z którymi się nie zgadzasz.">Co znaleźliśmy</Naglowek>
            {pasujace.length === 0 ? (
              <p className="text-slate-700 dark:text-slate-300">
                Nie widzimy argumentów do odwołania na podstawie wpisanych danych. Sprawdź, czy wszystko przepisałeś z kosztorysu – a jeśli tak, kosztorys może być w porządku.
              </p>
            ) : (
              <ul className="space-y-3">
                {pasujace.map((a) => {
                  const wl = !s.wylaczone.includes(a.id);
                  const kw = sklad.find((x) => x.id === a.id);
                  return (
                    <li key={a.id} className={`rounded-2xl border p-4 ${wl ? 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20' : 'border-slate-200 dark:border-slate-800 opacity-70'}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={wl} onChange={(e) => u('wylaczone')(e.target.checked ? s.wylaczone.filter((x) => x !== a.id) : [...s.wylaczone, a.id])} className="mt-1 w-5 h-5 accent-emerald-600 flex-shrink-0" />
                        <span className="flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{a.tytul}</span>
                            {kw && <span className="font-bold tabular-nums text-amber-800 dark:text-amber-200">{zl(kw.kwota)}</span>}
                          </span>
                          <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">{a.wyjasnienie}</span>
                          {a.dowody.length > 0 && <span className="block text-xs text-slate-500 mt-1.5">Dołącz: {a.dowody.join('; ')}.</span>}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </Karta>
          <Karta>
            <Naglowek pod="Suma kwot, które da się policzyć z Twoich danych. Argumenty bez kwoty (np. stawka bez wyceny warsztatu) też są w piśmie, ale nie zwiększają tej sumy.">Kwota do odzyskania</Naglowek>
            <p className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">{zl(sporna)}</p>
            {sklad.filter((x) => !s.wylaczone.includes(x.id)).length > 0 && (
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {sklad
                  .filter((x) => !s.wylaczone.includes(x.id))
                  .map((x) => (
                    <li key={x.id} className="flex justify-between gap-3">
                      <span>{x.opis}</span>
                      <span className="tabular-nums">{zl(x.kwota)}</span>
                    </li>
                  ))}
              </ul>
            )}
            <Kwota l="Kwota żądana w pismach (opcjonalnie inna)" v={s.kwotaReczna} z={u('kwotaReczna')} pod={`Puste = ${zl(sporna)}. Wpisz inną kwotę, jeśli masz np. kosztorys z warsztatu albo opinię rzeczoznawcy.`} />
            <p className="text-xs text-slate-500">To wyliczenie z Twoich danych, a nie wycena rzeczoznawcy. Ubezpieczyciel może uznać tylko część kwoty.</p>
          </Karta>
          {daty.length > 0 && (
            <Karta>
              <Naglowek>Terminy w Twojej sprawie</Naglowek>
              <ul className="space-y-2">
                {daty.map((t) => (
                  <li key={t.data + t.co} className="flex items-start gap-3 text-sm">
                    <CalendarClock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.minal ? 'text-slate-400' : 'text-emerald-600'}`} aria-hidden="true" />
                    <span className={t.minal ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'}>
                      <b className="tabular-nums">{data(t.data)}</b> – {t.co}
                      {t.minal && ' (minęło)'}
                    </span>
                  </li>
                ))}
              </ul>
            </Karta>
          )}
          {s.rodzaj === 'czesciowa' && !s.stawkaWarsztat && (
            <Karta>
              <Naglowek pod="Opcjonalnie. Wycena z warsztatu to najmocniejszy dowód przy sporze o stawkę – przyda się zwłaszcza w drugim piśmie.">Zapytaj 1–2 warsztaty o stawkę</Naglowek>
              <p className="text-sm rounded-xl bg-slate-50 dark:bg-slate-950 p-4 text-slate-800 dark:text-slate-200">{wypelnij(dane.wiadomoscWarsztat, w)}</p>
              <KopiujPrzycisk tekst={wypelnij(dane.wiadomoscWarsztat, w)} etykieta="Kopiuj wiadomość" />
            </Karta>
          )}
          {kancelaria && s.rodzaj === 'calkowita' && <Partner kancelaria={kancelaria} miejsce="wynik-calkowita" />}
          <button type="button" onClick={() => idz('pisma')} className="w-full sm:w-auto rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3">
            Przygotuj pisma · {zl(zadana)}
          </button>
        </>
      )}

      {krok === 'pisma' && (
        <>
          <Karta>
            <Naglowek pod="Wyślij reklamację listem poleconym za potwierdzeniem odbioru albo przez formularz reklamacji ubezpieczyciela. Zapisz datę doręczenia – od niej liczy się 30 dni.">Etap 1 – wysyłasz teraz</Naglowek>
            <div className="space-y-3">
              {pisma1.map((p) => (
                <KartaPisma key={p.id} p={p} s={s} dane={dane} nazwaPliku={`${p.id}-${s.numerSzkody || 'szkoda'}.docx`.replace(/[^\w.-]+/g, '-')} />
              ))}
            </div>
          </Karta>
          <Karta>
            <Naglowek pod="Wróć tutaj po 30 dniach od doręczenia reklamacji albo gdy przyjdzie odpowiedź.">Etap 2 – po odpowiedzi (albo jej braku)</Naglowek>
            <div className="grid sm:grid-cols-2 gap-4">
              <Tekst l="Data reklamacji (na piśmie)" typ="date" v={s.dataReklamacji} z={u('dataReklamacji')} />
              <Tekst l="Data doręczenia reklamacji" typ="date" v={s.dataDoreczeniaReklamacji} z={u('dataDoreczeniaReklamacji')} pod="Z potwierdzenia odbioru albo potwierdzenia formularza." />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Czy ubezpieczyciel odpowiedział w ciągu 30 dni (albo poinformował o przedłużeniu do 60)?</p>
              <p className="text-xs text-slate-500 mt-0.5">Liczy się data wysłania odpowiedzi (stempel, data e-maila), a nie data, w której ją dostałeś.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(
                  [
                    ['tak', 'Tak, odpowiedział'],
                    ['nie', 'Nie odpowiedział w terminie']
                  ] as const
                ).map(([v, t]) => (
                  <button key={v} type="button" onClick={() => u('odpowiedzWTerminie')(v)} aria-pressed={s.odpowiedzWTerminie === v} className={`rounded-xl px-4 py-2 font-semibold border ${s.odpowiedzWTerminie === v ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900' : 'border-slate-300 dark:border-slate-700'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {s.odpowiedzWTerminie === 'nie' && !art8Gotowe(s) && (
              <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 rounded-xl px-3 py-2">
                {s.dataDoreczeniaReklamacji ? 'Od doręczenia reklamacji nie minęło jeszcze 30 dni – poczekaj z wezwaniem do terminu w kalendarzu.' : 'Wpisz datę doręczenia reklamacji, żeby sprawdzić, czy minęło 30 dni.'}
              </p>
            )}
            {s.odpowiedzWTerminie === 'tak' && (
              <>
                <Tekst l="Data odpowiedzi ubezpieczyciela" typ="date" v={s.dataOdmowy} z={u('dataOdmowy')} />
                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">Czym ubezpieczyciel uzasadnił odmowę? (zaznacz wszystko, co pasuje)</legend>
                  {dane.riposty.map((r) => (
                    <label key={r.id} className="flex items-start gap-3 text-sm cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2.5">
                      <input type="checkbox" checked={s.riposty.includes(r.id)} onChange={(e) => u('riposty')(e.target.checked ? [...s.riposty, r.id] : s.riposty.filter((x) => x !== r.id))} className="mt-0.5 w-4 h-4 accent-emerald-600 flex-shrink-0" />
                      {r.zarzut}
                    </label>
                  ))}
                </fieldset>
              </>
            )}
            {pisma2.length > 0 && (s.odpowiedzWTerminie !== 'nie' || art8Gotowe(s)) && (
              <div className="space-y-3">
                {pisma2.map((p) => (
                  <KartaPisma key={p.id} p={p} s={s} dane={dane} nazwaPliku={`${p.id}-${s.numerSzkody || 'szkoda'}.docx`.replace(/[^\w.-]+/g, '-')} />
                ))}
              </div>
            )}
            {s.odpowiedzWTerminie === 'tak' && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Rzecznik Finansowy przyjmuje wnioski na stronie{' '}
                <a href="https://rf.gov.pl/" target="_blank" rel="noopener" className="underline font-semibold">
                  rf.gov.pl
                </a>
                . Interwencja jest bezpłatna, postępowanie polubowne kosztuje 50 zł.
              </p>
            )}
            {kancelaria && s.odpowiedzWTerminie === 'tak' && <Partner kancelaria={kancelaria} miejsce="po-odmowie" />}
          </Karta>
          <p className="text-xs text-slate-500">{dane.zastrzezenie}</p>
        </>
      )}
    </div>
  );
}

function Partner({ kancelaria, miejsce }: { kancelaria: { partner: string; url: string }; miejsce: string }) {
  return (
    <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
      <p className="font-bold text-slate-900 dark:text-white">Nie chcesz prowadzić sprawy sam?</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Możesz przekazać ją kancelarii – razem z pismami, które już masz. Kancelaria zwykle bierze część odzyskanej kwoty, więc przy mniejszych kwotach zwykle bardziej opłaca się działać samodzielnie.
      </p>
      <LinkPartnerski href={kancelaria.url} modul="kancelaria" partner={kancelaria.partner} karta={`po-szkodzie-${miejsce}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:border-slate-500">
        Bezpłatna analiza: {kancelaria.partner}
      </LinkPartnerski>
      <p className="text-xs text-slate-500">Współpraca partnerska – otrzymujemy wynagrodzenie za polecenie. Twoje dane podajesz bezpośrednio partnerowi.</p>
    </aside>
  );
}
