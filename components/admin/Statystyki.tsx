'use client';
// Zakładka „Statystyki”: liczby z Google Analytics 4 bez Twoich własnych wizyt.
import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Monitor, RefreshCw } from 'lucide-react';
import { karta, przyciskD } from './wspolne';
import { toUrzadzenieAdmina, ustawUrzadzenieAdmina } from '@/lib/admin-urzadzenie';
import type { Statystyki as Dane, Wiersz } from '@/lib/ga4';

const ZRODLA: Record<string, string> = {
  'Organic Search': 'Google i inne wyszukiwarki',
  Direct: 'Wejścia bezpośrednie',
  Referral: 'Linki z innych stron',
  'Organic Social': 'Media społecznościowe',
  'Organic Video': 'YouTube i wideo',
  Unassigned: 'Nieznane',
  'Paid Search': 'Reklamy w wyszukiwarce',
  Email: 'E-mail',
  'Organic Shopping': 'Porównywarki zakupowe'
};
const JEZYKI: Record<string, string> = { Polish: 'polski', English: 'angielski', Ukrainian: 'ukraiński', German: 'niemiecki', Russian: 'rosyjski', Czech: 'czeski', Lithuanian: 'litewski' };
const KRAJE: Record<string, string> = { Poland: 'Polska', Ukraine: 'Ukraina', Germany: 'Niemcy', 'United Kingdom': 'Wielka Brytania', 'United States': 'USA', Netherlands: 'Holandia', Ireland: 'Irlandia', Norway: 'Norwegia', Czechia: 'Czechy', Lithuania: 'Litwa' };

const fmt = (n: number) => n.toLocaleString('pl-PL');

function Lista({ tytul, wiersze, nazwy }: { tytul: string; wiersze: Wiersz[]; nazwy?: Record<string, string> }) {
  const max = Math.max(1, ...wiersze.map((w) => w.wartosc));
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{tytul}</h3>
      {wiersze.length === 0 && <p className="text-xs text-slate-500">Brak danych w tym okresie.</p>}
      <ul className="space-y-1.5">
        {wiersze.map((w) => (
          <li key={w.nazwa} className="relative text-xs">
            <span className="absolute inset-y-0 left-0 rounded bg-sky-100 dark:bg-sky-950" style={{ width: `${(w.wartosc / max) * 100}%` }} aria-hidden="true" />
            <span className="relative flex justify-between gap-3 px-2 py-1">
              <span className="truncate text-slate-800 dark:text-slate-200">{nazwy?.[w.nazwa] || w.nazwa}</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fmt(w.wartosc)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Statystyki({ token }: { token: string }) {
  const [dni, setDni] = useState(28);
  const [dane, setDane] = useState<Dane | null>(null);
  const [blad, setBlad] = useState('');
  const [praca, setPraca] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => setAdmin(toUrzadzenieAdmina()), []);

  const wczytaj = useCallback(async () => {
    setPraca(true);
    setBlad('');
    try {
      const r = await fetch(`/api/statystyki/?dni=${dni}`, { headers: { Authorization: `Bearer ${token.trim()}` }, cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) {
        setDane(null);
        setBlad(j.blad || `Błąd ${r.status}`);
      } else setDane(j);
    } catch {
      setBlad('Brak połączenia ze stroną.');
    } finally {
      setPraca(false);
    }
  }, [dni, token]);

  useEffect(() => {
    if (token.trim()) wczytaj();
  }, [wczytaj, token]);

  const przelacz = () => {
    ustawUrzadzenieAdmina(!admin);
    setAdmin(!admin);
  };

  const maxDzien = Math.max(1, ...(dane?.dzien.map((d) => d.uzytkownicy) || []));

  return (
    <div className="space-y-6">
      <section className={karta}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Monitor className="w-5 h-5 text-steel-600" aria-hidden="true" /> Twoje wizyty
        </h2>
        <p className={`rounded-xl px-4 py-3 text-sm ${admin ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'}`}>
          {admin
            ? 'To urządzenie NIE jest liczone w statystykach (Google Analytics i Vercel). Możesz spokojnie klikać po stronie.'
            : 'To urządzenie JEST liczone w statystykach. Włącz pomijanie, jeśli to Twój komputer albo telefon.'}
        </p>
        <p className="text-xs text-slate-500">
          Otwórz <strong>/admin/</strong> raz na każdym swoim urządzeniu (komputer, telefon, tablet) – od tej chwili jest pomijane automatycznie. Uwaga: wyczyszczenie danych przeglądarki albo tryb prywatny
          kasuje ten znacznik.
        </p>
        <button type="button" onClick={przelacz} className={przyciskD}>
          {admin ? 'Licz znowu wizyty z tego urządzenia' : 'Pomijaj wizyty z tego urządzenia'}
        </button>
      </section>

      <section className={karta}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <BarChart3 className="w-5 h-5 text-steel-600" aria-hidden="true" /> Ruch na stronie (Google Analytics)
          </h2>
          <div className="flex gap-1" role="group" aria-label="Okres">
            {[7, 28, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDni(d)}
                aria-pressed={dni === d}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${dni === d ? 'bg-steel-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
              >
                {d} dni
              </button>
            ))}
            <button type="button" onClick={wczytaj} disabled={praca} className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40" aria-label="Odśwież">
              <RefreshCw className={`w-4 h-4 ${praca ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {!token.trim() && <p className="text-sm text-slate-500">Najpierw zaloguj się tokenem w sekcji „Dostęp” wyżej.</p>}

        {blad === 'brak-konfiguracji' && (
          <div className="rounded-xl bg-steel-50 dark:bg-slate-800 p-4 text-sm text-slate-800 dark:text-slate-200 space-y-2">
            <p className="font-bold">Statystyki nie są jeszcze podłączone. Jednorazowo (ok. 15 minut):</p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>
                Wejdź na <strong>console.cloud.google.com</strong>, załóż projekt (np. „MotoRaport”) i włącz w nim <strong>Google Analytics Data API</strong>.
              </li>
              <li>
                W menu <strong>IAM i administracja → Konta usługi</strong> utwórz konto (np. „statystyki”). Potem w zakładce <strong>Klucze</strong> dodaj klucz typu <strong>JSON</strong> – pobierze się
                plik.
              </li>
              <li>
                W <strong>Google Analytics → Administracja → Zarządzanie dostępem do usługi</strong> dodaj adres konta usługi (kończy się na „iam.gserviceaccount.com”) z rolą{' '}
                <strong>Wyświetlający</strong>.
              </li>
              <li>
                Tam też, w <strong>Szczegóły usługi</strong>, skopiuj <strong>identyfikator usługi</strong> (same cyfry, np. 412345678 – to nie jest kod G-…).
              </li>
              <li>
                W <strong>Vercel → projekt → Settings → Environment Variables</strong> dodaj: <code>GA4_PROPERTY_ID</code> = te cyfry oraz <code>GA4_KLUCZ_JSON</code> = cała zawartość pobranego pliku
                JSON. Potem zrób „Redeploy”.
              </li>
            </ol>
            <p className="text-xs text-slate-500">Pliku z kluczem nie wysyłaj nikomu i nie wrzucaj do repozytorium. Po wklejeniu do Vercel możesz go usunąć z komputera.</p>
          </div>
        )}
        {blad && blad !== 'brak-konfiguracji' && <p className="rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200 px-4 py-3 text-sm">{blad}</p>}

        {dane && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Użytkownicy', dane.suma.uzytkownicy],
                ['Nowi', dane.suma.nowi],
                ['Wizyty', dane.suma.sesje],
                ['Odsłony stron', dane.suma.odslony]
              ].map(([n, v]) => (
                <div key={n as string} className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{n}</p>
                  <p className="text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{fmt(v as number)}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Użytkownicy dzień po dniu</h3>
              <div className="flex items-end gap-px h-32" role="img" aria-label="Wykres użytkowników w kolejnych dniach">
                {dane.dzien.map((d) => (
                  <div key={d.data} className="flex-1 bg-sky-500 dark:bg-sky-400 rounded-t-sm min-h-[2px]" style={{ height: `${(d.uzytkownicy / maxDzien) * 100}%` }} title={`${d.data}: ${fmt(d.uzytkownicy)} użytkowników, ${fmt(d.odslony)} odsłon`} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{dane.dzien[0]?.data}</span>
                <span>{dane.dzien[dane.dzien.length - 1]?.data}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Lista tytul="Najczęściej czytane strony" wiersze={dane.strony} />
              <Lista tytul="Skąd przychodzą (wizyty)" wiersze={dane.zrodla} nazwy={ZRODLA} />
              <Lista tytul="Język przeglądarki" wiersze={dane.jezyki} nazwy={JEZYKI} />
              <Lista tytul="Kraj" wiersze={dane.kraje} nazwy={KRAJE} />
            </div>
            <p className="text-xs text-slate-500">
              Liczby obejmują tylko osoby, które zgodziły się na pliki cookies, bez Twoich urządzeń. Dane z ostatnich godzin mogą się jeszcze uzupełniać. Odświeżenie co 10 minut.
            </p>
          </>
        )}
        {!dane && !blad && token.trim() && <p className="text-sm text-slate-500">{praca ? 'Wczytuję…' : ''}</p>}
      </section>
    </div>
  );
}
