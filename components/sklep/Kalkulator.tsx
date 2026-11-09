'use client';
// Kalkulator Niezbędnika: 1) koszty startowe po zakupie, 2) argumenty do negocjacji ceny.
// Dane przychodzą z serwera tylko po zalogowaniu; ostatnia wersja jest zapamiętywana na telefonie (działa bez zasięgu).
import { useEffect, useMemo, useState } from 'react';
import { Calculator, Check, Copy, HandCoins, Loader2, LogOut, Mail, Wallet } from 'lucide-react';
import type { DaneKalkulatora, Warunek } from '@/lib/sklep/kalkulator-typy';

const PAMIEC_DANYCH = 'nb-kalk-dane';
const PAMIEC_STANU = 'nb-kalk-stan';
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
    /* brak pamięci przeglądarki – kalkulator działa dalej */
  }
};
const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;
const widelki = (od: number, do_: number) => (Math.round(od) === Math.round(do_) ? zl(od) : `${Math.round(od).toLocaleString('pl-PL')}–${zl(do_)}`);

type Paliwo = 'benzyna' | 'diesel' | 'lpg' | 'hybryda' | 'elektryk';
interface Stan {
  cena: number;
  klasa: string;
  paliwo: Paliwo;
  skrzynia: 'manual' | 'automat';
  sprzedawca: 'prywatny' | 'firma';
  tablice: 'zostaje' | 'nowe';
  przeglad: 'wazny' | 'brak';
  startowe: Record<string, boolean>;
  usterki: Record<string, boolean>;
}
const POCZATEK: Stan = { cena: 30000, klasa: 'kompakt', paliwo: 'benzyna', skrzynia: 'manual', sprzedawca: 'prywatny', tablice: 'zostaje', przeglad: 'wazny', startowe: {}, usterki: {} };

/** Czy pozycja pasuje do auta (np. „olej w automacie” tylko przy automacie) */
function pasuje(w: Warunek | undefined, s: Stan) {
  if (!w) return true;
  if (w === 'automat' || w === 'manual') return s.skrzynia === w;
  if (w === 'benzyna') return s.paliwo === 'benzyna' || s.paliwo === 'lpg' || s.paliwo === 'hybryda';
  return s.paliwo === w;
}

function Logowanie({ poZalogowaniu }: { poZalogowaniu: () => void }) {
  const [email, setEmail] = useState('');
  const [kod, setKod] = useState('');
  const [krok, setKrok] = useState<'email' | 'kod'>('email');
  const [praca, setPraca] = useState(false);
  const [info, setInfo] = useState('');
  const pole = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-3 text-base';

  async function wyslij(e: React.FormEvent) {
    e.preventDefault();
    setPraca(true);
    setInfo('');
    const r = await fetch('/api/niezbednik/kod/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setPraca(false);
    if (!r?.ok) return setInfo(j?.blad || 'Brak połączenia. Spróbuj ponownie.');
    setKrok('kod');
    setInfo('Jeśli to adres z zamówienia, w ciągu minuty dostaniesz mail z kodem. Sprawdź też folder spam.');
  }
  async function zaloguj(e: React.FormEvent) {
    e.preventDefault();
    setPraca(true);
    setInfo('');
    const r = await fetch('/api/niezbednik/logowanie/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, kod }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setPraca(false);
    if (!r?.ok) return setInfo(j?.blad || 'Brak połączenia. Spróbuj ponownie.');
    poZalogowaniu();
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          <Calculator className="w-6 h-6 text-emerald-600" aria-hidden="true" /> Kalkulator Niezbędnika
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Koszty startowe po zakupie i gotowe argumenty do negocjacji ceny. Dostęp dla osób, które kupiły Niezbędnik.</p>
      </div>
      {krok === 'email' ? (
        <form onSubmit={wyslij} className="space-y-3">
          <label className="block text-sm font-semibold">
            E-mail podany przy zakupie
            <input type="email" required autoComplete="email" className={`${pole} mt-1`} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button disabled={praca} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3">
            {praca ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Mail className="w-5 h-5" aria-hidden="true" />} Wyślij kod
          </button>
        </form>
      ) : (
        <form onSubmit={zaloguj} className="space-y-3">
          <label className="block text-sm font-semibold">
            Kod z maila (6 cyfr)
            <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} required className={`${pole} mt-1 tracking-[0.4em] text-center text-2xl font-bold`} value={kod} onChange={(e) => setKod(e.target.value.replace(/\D/g, ''))} />
          </label>
          <button disabled={praca || kod.length !== 6} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3">
            {praca ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Check className="w-5 h-5" aria-hidden="true" />} Zaloguj
          </button>
          <button type="button" onClick={() => setKrok('email')} className="text-sm text-slate-500 underline">
            Zmień e-mail albo wyślij kod ponownie
          </button>
        </form>
      )}
      {info && <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">{info}</p>}
      <p className="text-xs text-slate-500">Po zalogowaniu telefon pamięta dostęp przez rok. Na jedno zamówienie możesz używać kalkulatora na 3 urządzeniach.</p>
    </div>
  );
}

function Wybor<T extends string>({ etykieta, wartosc, opcje, zmien }: { etykieta: string; wartosc: T; opcje: [T, string][]; zmien: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-slate-500 mb-1">{etykieta}</legend>
      <div className="flex flex-wrap gap-1.5">
        {opcje.map(([v, n]) => (
          <button key={v} type="button" onClick={() => zmien(v)} aria-pressed={wartosc === v} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ring-1 ${wartosc === v ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-700'}`}>
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Pozycja({ zaznaczone, zmien, tytul, opis, kwota }: { zaznaczone: boolean; zmien: () => void; tytul: string; opis: string; kwota: string }) {
  return (
    <label className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${zaznaczone ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
      <input type="checkbox" checked={zaznaczone} onChange={zmien} className="mt-1 w-5 h-5 flex-shrink-0 accent-emerald-600" />
      <span className="flex-1 min-w-0">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="font-semibold text-slate-900 dark:text-white">{tytul}</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums whitespace-nowrap">{kwota}</span>
        </span>
        <span className="block text-xs text-slate-500 mt-0.5">{opis}</span>
      </span>
    </label>
  );
}

export default function Kalkulator() {
  const [dane, setDane] = useState<DaneKalkulatora | null>(null);
  const [email, setEmail] = useState('');
  const [stanDostepu, setStanDostepu] = useState<'laduje' | 'zaloguj' | 'ok' | 'blad'>('laduje');
  const [offline, setOffline] = useState(false);
  const [s, setS] = useState<Stan>(POCZATEK);
  const [zakladka, setZakladka] = useState<'start' | 'negocjacje'>('start');
  const [skopiowane, setSkopiowane] = useState(false);

  async function pobierz() {
    setStanDostepu('laduje');
    try {
      const r = await fetch('/api/niezbednik/dane/', { cache: 'no-store' });
      if (r.status === 401) {
        try {
          localStorage.removeItem(PAMIEC_DANYCH);
        } catch {}
        return setStanDostepu('zaloguj');
      }
      if (!r.ok) throw new Error();
      const j = (await r.json()) as { email: string; dane: DaneKalkulatora };
      setDane(j.dane);
      setEmail(j.email);
      zapisz(PAMIEC_DANYCH, j);
      setOffline(false);
      setStanDostepu('ok');
    } catch {
      // bez zasięgu – używamy zapamiętanej wersji
      const z = czytaj<{ email: string; dane: DaneKalkulatora }>(PAMIEC_DANYCH);
      if (z) {
        setDane(z.dane);
        setEmail(z.email);
        setOffline(true);
        setStanDostepu('ok');
      } else setStanDostepu('blad');
    }
  }

  useEffect(() => {
    const z = czytaj<Stan>(PAMIEC_STANU);
    if (z) setS({ ...POCZATEK, ...z });
    pobierz();
  }, []);
  useEffect(() => {
    if (stanDostepu === 'ok') zapisz(PAMIEC_STANU, s);
  }, [s, stanDostepu]);

  const ust = <K extends keyof Stan>(k: K, v: Stan[K]) => setS((x) => ({ ...x, [k]: v }));
  const mnoznik = dane?.klasy.find((k) => k.id === s.klasa)?.mnoznik || 1;

  const wynik = useMemo(() => {
    if (!dane) return null;
    const o = dane.oplaty;
    const pcc = s.sprzedawca === 'firma' || s.cena <= o.pccProg ? 0 : Math.round(s.cena * o.pccStawka);
    const rejestracja = s.tablice === 'nowe' ? o.rejestracjaNoweTablice : o.rejestracjaZachowaneTablice;
    const przeglad = s.przeglad === 'brak' ? o.przeglad + (s.paliwo === 'lpg' ? o.przegladLpgDodatek : 0) : 0;
    const oplaty = pcc + rejestracja + przeglad;
    const startowe = dane.startowe.filter((p) => pasuje(p.warunek, s));
    const wybraneStart = startowe.filter((p) => s.startowe[p.id] ?? p.domyslnie);
    const sOd = wybraneStart.reduce((a, p) => a + p.od * mnoznik, 0);
    const sDo = wybraneStart.reduce((a, p) => a + p.do * mnoznik, 0);
    const usterki = dane.usterki.filter((u) => pasuje(u.warunek, s));
    const wybraneU = usterki.filter((u) => s.usterki[u.id]);
    const uOd = wybraneU.reduce((a, u) => a + u.od * mnoznik, 0);
    const uDo = wybraneU.reduce((a, u) => a + u.do * mnoznik, 0);
    const n = dane.negocjacje;
    const obnizka = Math.floor((((uOd + uDo) / 2) * (1 + n.zapasRyzyka)) / n.zaokraglenie) * n.zaokraglenie;
    const proponowana = Math.max(0, Math.floor((s.cena - obnizka) / n.zaokraglenie) * n.zaokraglenie);
    const wiadomosc = wybraneU.length
      ? [
          n.wstep,
          ...wybraneU.map((u) => `– ${u.argument.replace('{od}', Math.round(u.od * mnoznik).toLocaleString('pl-PL')).replace('{do}', Math.round(u.do * mnoznik).toLocaleString('pl-PL'))}`),
          n.zakonczenie.replace('{suma}', widelki(uOd, uDo).replace(' zł', '')).replace('{cena}', proponowana.toLocaleString('pl-PL'))
        ].join('\n')
      : '';
    return { pcc, rejestracja, przeglad, oplaty, startowe, sOd, sDo, usterki, uOd, uDo, obnizka, proponowana, wiadomosc, wybraneU };
  }, [dane, s, mnoznik]);

  if (stanDostepu === 'laduje') return <p className="flex items-center gap-2 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Wczytuję kalkulator…</p>;
  if (stanDostepu === 'zaloguj') return <Logowanie poZalogowaniu={pobierz} />;
  if (stanDostepu === 'blad' || !dane || !wynik)
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
        <p className="text-slate-700 dark:text-slate-300">Nie udało się wczytać kalkulatora. Sprawdź połączenie z internetem.</p>
        <button onClick={pobierz} className="rounded-xl bg-slate-900 text-white font-bold px-4 py-2">Spróbuj ponownie</button>
      </div>
    );

  const grupy = [...new Set(wynik.usterki.map((u) => u.grupa))];

  return (
    <div className="relative space-y-5">
      {/* znak wodny z e-mailem kupującego */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden opacity-[0.045] dark:opacity-[0.07]" aria-hidden="true">
        <div className="absolute -inset-1/2 rotate-[-24deg] flex flex-wrap content-start gap-x-16 gap-y-20 text-sm font-bold text-slate-900 dark:text-white">
          {Array.from({ length: 160 }, (_, i) => (
            <span key={i}>{email}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              <Calculator className="w-6 h-6 text-emerald-600" aria-hidden="true" /> Kalkulator Niezbędnika
            </h1>
            <p className="text-xs text-slate-500">
              Licencja dla: <b>{email}</b>
              {offline ? ' · tryb bez internetu (zapamiętane dane)' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/niezbednik/wyloguj/', { method: 'POST' }).catch(() => null);
              try {
                localStorage.removeItem(PAMIEC_DANYCH);
              } catch {}
              setStanDostepu('zaloguj');
            }}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" /> Wyloguj
          </button>
        </header>

        {/* auto i zakup */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Cena auta z ogłoszenia</span>
            <span className="mt-1 flex items-center gap-2">
              <input type="number" inputMode="numeric" min={0} step={500} value={s.cena || ''} onChange={(e) => ust('cena', Number(e.target.value) || 0)} className="w-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-lg font-bold" />
              <span className="font-semibold text-slate-500">zł</span>
            </span>
          </label>
          <Wybor etykieta="Klasa auta (ceny części i robocizny)" wartosc={s.klasa} opcje={dane.klasy.map((k) => [k.id, k.nazwa] as [string, string])} zmien={(v) => ust('klasa', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Wybor etykieta="Paliwo" wartosc={s.paliwo} opcje={[['benzyna', 'Benzyna'], ['diesel', 'Diesel'], ['lpg', 'LPG'], ['hybryda', 'Hybryda'], ['elektryk', 'Elektryk']]} zmien={(v) => ust('paliwo', v)} />
            <Wybor etykieta="Skrzynia biegów" wartosc={s.skrzynia} opcje={[['manual', 'Manualna'], ['automat', 'Automat / DSG']]} zmien={(v) => ust('skrzynia', v)} />
          </div>
        </section>

        <div className="flex gap-2 sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur py-2">
          {(
            [
              ['start', Wallet, 'Koszty startowe'],
              ['negocjacje', HandCoins, 'Negocjacje']
            ] as const
          ).map(([id, I, n]) => (
            <button key={id} type="button" onClick={() => setZakladka(id)} aria-pressed={zakladka === id} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold ${zakladka === id ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700'}`}>
              <I className="w-5 h-5" aria-hidden="true" /> {n}
            </button>
          ))}
        </div>

        {zakladka === 'start' ? (
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Opłaty i formalności</h2>
              <Wybor etykieta="Kupujesz od" wartosc={s.sprzedawca} opcje={[['prywatny', 'Osoby prywatnej'], ['firma', 'Firmy (z fakturą)']]} zmien={(v) => ust('sprzedawca', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Wybor etykieta="Tablice rejestracyjne" wartosc={s.tablice} opcje={[['zostaje', 'Zostawiam obecne'], ['nowe', 'Nowe tablice']]} zmien={(v) => ust('tablice', v)} />
                <Wybor etykieta="Przegląd techniczny" wartosc={s.przeglad} opcje={[['wazny', 'Ważny'], ['brak', 'Brak / kończy się']]} zmien={(v) => ust('przeglad', v)} />
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <div className="flex justify-between gap-3 py-2">
                  <dt>
                    Podatek PCC-3 <span className="text-slate-500">{wynik.pcc === 0 ? (s.sprzedawca === 'firma' ? '(zakup na fakturę – nie płacisz)' : '(wartość do 1000 zł – nie płacisz)') : '(2% wartości, w 14 dni)'}</span>
                  </dt>
                  <dd className="font-bold tabular-nums">{zl(wynik.pcc)}</dd>
                </div>
                <div className="flex justify-between gap-3 py-2">
                  <dt>Rejestracja {s.tablice === 'nowe' ? 'z nowymi tablicami' : 'z zachowaniem tablic'}</dt>
                  <dd className="font-bold tabular-nums">ok. {zl(wynik.rejestracja)}</dd>
                </div>
                {wynik.przeglad > 0 && (
                  <div className="flex justify-between gap-3 py-2">
                    <dt>Badanie techniczne{s.paliwo === 'lpg' ? ' (z LPG)' : ''}</dt>
                    <dd className="font-bold tabular-nums">{zl(wynik.przeglad)}</dd>
                  </div>
                )}
              </dl>
              <p className="text-xs text-slate-500">{dane.oplaty.uwagaRejestracja}</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white">Pakiet startowy – serwis po zakupie</h2>
              <p className="text-xs text-slate-500">Zaznaczone są pozycje, które warto zrobić zawsze, gdy sprzedający nie ma faktur. Odznacz to, na co masz dowód wymiany.</p>
              {wynik.startowe.map((p) => (
                <Pozycja key={p.id} zaznaczone={s.startowe[p.id] ?? p.domyslnie} zmien={() => ust('startowe', { ...s.startowe, [p.id]: !(s.startowe[p.id] ?? p.domyslnie) })} tytul={p.nazwa} opis={p.opis} kwota={widelki(p.od * mnoznik, p.do * mnoznik)} />
              ))}
            </section>

            <section className="rounded-2xl bg-slate-900 text-white p-5 space-y-2">
              <p className="text-sm text-slate-300">Budżet na start (opłaty + serwis)</p>
              <p className="text-3xl font-black tabular-nums">{widelki(wynik.oplaty + wynik.sOd, wynik.oplaty + wynik.sDo)}</p>
              <p className="text-sm text-slate-300">
                Razem z ceną auta: <b className="text-white">{widelki(s.cena + wynik.oplaty + wynik.sOd, s.cena + wynik.oplaty + wynik.sDo)}</b>
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">Zaznacz usterki znalezione na oględzinach. Kalkulator policzy koszt naprawy, sugerowaną obniżkę i ułoży wiadomość do sprzedającego.</p>
            {grupy.map((g) => (
              <section key={g} className="space-y-2">
                <h2 className="font-bold text-slate-900 dark:text-white">{g}</h2>
                {wynik.usterki
                  .filter((u) => u.grupa === g)
                  .map((u) => (
                    <Pozycja key={u.id} zaznaczone={!!s.usterki[u.id]} zmien={() => ust('usterki', { ...s.usterki, [u.id]: !s.usterki[u.id] })} tytul={u.nazwa} opis={u.jakSprawdzic} kwota={widelki(u.od * mnoznik, u.do * mnoznik)} />
                  ))}
              </section>
            ))}

            <section className="rounded-2xl bg-slate-900 text-white p-5 space-y-3 sticky bottom-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-300">Koszt napraw</p>
                  <p className="text-lg font-black tabular-nums">{wynik.wybraneU.length ? widelki(wynik.uOd, wynik.uDo) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Sugerowana obniżka</p>
                  <p className="text-lg font-black tabular-nums text-emerald-300">{wynik.obnizka ? zl(wynik.obnizka) : '—'}</p>
                </div>
              </div>
              {wynik.obnizka > 0 && (
                <p className="text-sm text-slate-300">
                  Twoja propozycja ceny: <b className="text-white text-base">{zl(wynik.proponowana)}</b>
                </p>
              )}
            </section>

            {wynik.wiadomosc && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <h2 className="font-bold text-slate-900 dark:text-white">Gotowa wiadomość do sprzedającego</h2>
                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans">{wynik.wiadomosc}</pre>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(wynik.wiadomosc);
                      setSkopiowane(true);
                      setTimeout(() => setSkopiowane(false), 2000);
                    } catch {}
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5"
                >
                  {skopiowane ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  {skopiowane ? 'Skopiowano' : 'Kopiuj wiadomość'}
                </button>
                <p className="text-xs text-slate-500">Rozmawiaj spokojnie i konkretnie: pokaż usterkę, podaj koszt naprawy, zaproponuj cenę. Sugerowana obniżka to połowa widełek naprawy plus 15% zapasu na ryzyko.</p>
              </section>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">{dane.uwaga} Dane z {new Date(dane.aktualizacja).toLocaleDateString('pl-PL')}.</p>
      </div>
    </div>
  );
}
