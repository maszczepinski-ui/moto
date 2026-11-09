'use client';
// Panel → SEO → „Mapa strony i Google”: ile adresów jest w mapie, kiedy Google ją zgłoszono/pobrał, przycisk „Zgłoś teraz”.
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Map as MapaIkona, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { karta, przyciskD, przyciskG } from './wspolne';
import type { StanMapyGoogle } from '@/lib/search-console';

type Dane = {
  mapa: { plikow: number; adresow: number; adres: string; zbudowano: string | null; pliki: { plik: string; adresow: number }[] };
  google: StanMapyGoogle | null;
  blad?: string;
};

const data = (d?: string | null) => (d ? new Date(d).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

/** Wyjaśnienia błędów prostym językiem – co trzeba kliknąć */
function Problem({ kod }: { kod: string }) {
  const tresc: Record<string, React.ReactNode> = {
    'brak-klucza': (
      <>
        Brakuje klucza konta technicznego Google (<code>GA4_KLUCZ_JSON</code> w Vercel). To ten sam klucz, którego używa zakładka „Statystyki” – gdy go dodasz, zadziała też tutaj.
      </>
    ),
    'brak-uprawnien': (
      <>
        Konto techniczne nie ma dostępu do Twojej strony w Search Console. Wejdź w Search Console → <strong>Ustawienia → Użytkownicy i uprawnienia → Dodaj użytkownika</strong>, wklej adres
        e-mail konta technicznego (pole <code>client_email</code> w pliku klucza, kończy się na <code>.iam.gserviceaccount.com</code>) i wybierz uprawnienie <strong>„Pełne”</strong>.
      </>
    ),
    'brak-uslugi': (
      <>
        Konto techniczne nie widzi Twojej strony w Search Console. Dodaj je jako użytkownika (Ustawienia → Użytkownicy i uprawnienia → Dodaj użytkownika, uprawnienie „Pełne”). Jeśli usługa ma
        inny adres niż moto-raport.pl, wpisz go w Vercel jako <code>GSC_WLASCIWOSC</code>.
      </>
    ),
    'api-wylaczone': (
      <>
        W Google Cloud (ten sam projekt co klucz) trzeba włączyć usługę <strong>„Google Search Console API”</strong>: console.cloud.google.com → Interfejsy API i usługi → Włącz interfejsy API →
        wyszukaj „Search Console” → Włącz. Po kilku minutach kliknij „Odśwież”.
      </>
    )
  };
  return (
    <p className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3">
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{tresc[kod] || kod}</span>
    </p>
  );
}

export default function MapaStrony({ token }: { token: string }) {
  const [dane, setDane] = useState<Dane | null>(null);
  const [laduje, setLaduje] = useState(false);
  const [komunikat, setKomunikat] = useState('');

  const pobierz = useCallback(
    async (zglos = false) => {
      setLaduje(true);
      setKomunikat('');
      try {
        const r = await fetch('/api/mapa-strony/', { method: zglos ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const j = (await r.json()) as Dane & { blad?: string };
        if (!r.ok) setKomunikat(j.blad || 'Nie udało się pobrać danych.');
        else {
          setDane(j);
          if (zglos && j.google) setKomunikat('Zgłoszone! Google pobierze mapę przy najbliższej okazji (zwykle w ciągu kilku dni).');
        }
      } catch {
        setKomunikat('Brak połączenia z serwerem strony.');
      } finally {
        setLaduje(false);
      }
    },
    [token]
  );

  useEffect(() => {
    pobierz();
  }, [pobierz]);

  const g = dane?.google;
  const nowsza = !!(g && dane?.mapa.zbudowano && (!g.ostatnieZgloszenie || Date.parse(dane.mapa.zbudowano) > Date.parse(g.ostatnieZgloszenie)));

  return (
    <section className={karta}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <MapaIkona className="w-5 h-5 text-steel-600" aria-hidden="true" /> Mapa strony i Google
      </h2>
      <p className="text-xs text-slate-500">
        Mapa strony (spis wszystkich adresów dla Google) <strong>aktualizuje się sama</strong> przy każdej zmianie na stronie – nowe karty, poradniki i aktualności trafiają do niej
        automatycznie. Codziennie rano automat sprawdza, czy strona zmieniła się od ostatniego zgłoszenia, i jeśli tak – sam zgłasza mapę w Google Search Console. Przycisk niżej robi to od
        razu.
      </p>

      {dane && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Adresów w mapie</dt>
            <dd className="font-bold text-slate-900 dark:text-white tabular-nums">{dane.mapa.adresow.toLocaleString('pl-PL')}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Mapa z dnia</dt>
            <dd className="font-bold text-slate-900 dark:text-white">{data(dane.mapa.zbudowano)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Ostatnio zgłoszona w Google</dt>
            <dd className="font-bold text-slate-900 dark:text-white">{g ? (g.zgloszona ? data(g.ostatnieZgloszenie) : 'jeszcze nie') : '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Ostatnio pobrana przez Google</dt>
            <dd className="font-bold text-slate-900 dark:text-white">{g?.zgloszona ? (g.oczekuje ? 'czeka w kolejce' : data(g.ostatniePobranie)) : '—'}</dd>
          </div>
        </dl>
      )}

      {g?.zgloszona && (g.bledy || g.ostrzezenia) ? (
        <p className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Google zgłasza w mapie: błędów {g.bledy || 0}, ostrzeżeń {g.ostrzezenia || 0} – szczegóły w Search Console → Mapy witryn.
        </p>
      ) : g?.zgloszona && !nowsza ? (
        <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Google ma najnowszą wersję mapy.
        </p>
      ) : null}
      {nowsza && <p className="text-xs font-semibold text-steel-700 dark:text-steel-300">Strona zmieniła się od ostatniego zgłoszenia – automat zgłosi ją jutro rano albo kliknij „Zgłoś teraz”.</p>}
      {dane?.blad && <Problem kod={dane.blad} />}
      {komunikat && <p className="text-xs font-semibold text-slate-700 dark:text-slate-300" aria-live="polite">{komunikat}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={przyciskG} disabled={laduje || !g} onClick={() => pobierz(true)}>
          <Send className="w-4 h-4" aria-hidden="true" /> Zgłoś teraz w Google
        </button>
        <button type="button" className={przyciskD} disabled={laduje} onClick={() => pobierz(false)}>
          <RefreshCw className={`w-4 h-4 ${laduje ? 'animate-spin' : ''}`} aria-hidden="true" /> Odśwież
        </button>
        {dane && (
          <a href={dane.mapa.adres} target="_blank" rel="noopener" className={przyciskD}>
            <ExternalLink className="w-4 h-4" aria-hidden="true" /> Otwórz mapę strony
          </a>
        )}
      </div>

      {dane && (
        <details className="text-xs text-slate-500">
          <summary className="cursor-pointer font-semibold">Z czego składa się mapa ({dane.mapa.plikow} plików)</summary>
          <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            {dane.mapa.pliki.map((p) => (
              <li key={p.plik} className="flex justify-between gap-2">
                <span>{p.plik}</span>
                <span className="tabular-nums">{p.adresow.toLocaleString('pl-PL')}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
