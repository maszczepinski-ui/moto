'use client';
// Lektor do rolki: tekst czytany Twoim głosem z ElevenLabs.
// Wynik: plik MP3 i plik napisów .srt – oba wczytujesz do programu do montażu razem z filmem.
// Nagrania nie są zapisywane w repozytorium (jest publiczne) – pobierasz je prosto stąd.
import { useState } from 'react';
import { Mic, Download, CircleCheck, CircleAlert, PlugZap } from 'lucide-react';
import { input, etykieta, przyciskG, przyciskD } from '@/components/admin/wspolne';

/** Przybliżony czas czytania: ok. 2,4 słowa na sekundę w spokojnym tempie lektora */
const szacujSekundy = (t: string) => Math.round((t.trim().split(/\s+/).filter(Boolean).length / 2.4) * 10) / 10;

type Stan = { glos?: string; zostalo?: number; limit?: number; uwagi: string[] };

export default function Lektor({ token, tekst, onTekst, nazwa }: { token: string; tekst: string; onTekst: (t: string) => void; nazwa: string }) {
  const [sekundy, setSekundy] = useState<number | ''>('');
  const [praca, setPraca] = useState('');
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [brakKonfiguracji, setBrakKonfiguracji] = useState(false);
  const [nagranie, setNagranie] = useState<{ mp3: string; srt: string; czas: number } | null>(null);

  const szac = szacujSekundy(tekst);
  const zaDlugo = sekundy !== '' && szac > sekundy + 1;

  async function zapytaj(metoda: 'GET' | 'POST', body?: object) {
    if (!token.trim()) throw new Error('Najpierw zaloguj się tokenem w sekcji „Dostęp” wyżej.');
    const r = await fetch('/api/lektor/', {
      method: metoda,
      headers: { Authorization: `Bearer ${token.trim()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({ blad: `Błąd serwera (${r.status}).` }));
    if (j.blad === 'brak-konfiguracji') {
      setBrakKonfiguracji(true);
      throw new Error('Lektor nie jest jeszcze podłączony – instrukcja poniżej.');
    }
    if (!r.ok) throw new Error(j.blad || `Błąd ${r.status}`);
    setBrakKonfiguracji(false);
    return j;
  }

  async function sprawdz() {
    setPraca('sprawdzam');
    setKom(null);
    try {
      const s: Stan = await zapytaj('GET');
      const czesci = ['Połączenie z ElevenLabs działa.'];
      if (s.glos) czesci.push(`Głos: „${s.glos}”.`);
      if (s.zostalo !== undefined) czesci.push(`Zostało ok. ${s.zostalo.toLocaleString('pl-PL')} znaków w tym miesiącu (≈ ${Math.round(s.zostalo / 900)} min mowy).`);
      setKom({ ok: true, tekst: [...czesci, ...s.uwagi].join(' ') });
    } catch (e) {
      setKom({ ok: false, tekst: (e as Error).message });
    }
    setPraca('');
  }

  async function generuj() {
    setPraca('generuje');
    setKom(null);
    setNagranie(null);
    try {
      const n: { mp3Base64: string; srt: string; czas: number } = await zapytaj('POST', { tekst });
      setNagranie({ mp3: `data:audio/mpeg;base64,${n.mp3Base64}`, srt: n.srt, czas: n.czas });
      setKom({ ok: true, tekst: `Gotowe – nagranie ma ${n.czas.toFixed(1).replace('.', ',')} s. Odsłuchaj i pobierz oba pliki.` });
    } catch (e) {
      setKom({ ok: false, tekst: (e as Error).message });
    }
    setPraca('');
  }

  function pobierz(href: string, plik: string) {
    const a = document.createElement('a');
    a.href = href;
    a.download = plik;
    a.click();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className={etykieta}>Lektor – Twój głos (ElevenLabs)</span>
        <button className={`${przyciskD} !py-1 text-xs`} onClick={sprawdz} disabled={!!praca}>
          <PlugZap className="w-3.5 h-3.5" /> {praca === 'sprawdzam' ? 'Sprawdzam…' : 'Sprawdź połączenie'}
        </button>
      </div>
      <textarea
        className={input}
        rows={5}
        value={tekst}
        onChange={(e) => onTekst(e.target.value)}
        placeholder="Tekst, który przeczyta lektor. Claude dopisuje go do ciekawostek – możesz go tu poprawić albo napisać własny."
      />
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className={zaDlugo ? 'text-rose-600' : 'text-slate-500'}>
          ok. {String(szac).replace('.', ',')} s czytania · {tekst.trim().length} znaków
          {zaDlugo && ' – tekst nie zmieści się w filmie, skróć go'}
        </span>
        <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          Długość filmu:
          <input type="number" min={3} max={180} className={`${input} !w-20 !py-1`} value={sekundy} onChange={(e) => setSekundy(e.target.value ? +e.target.value : '')} placeholder="s" />
          s
        </label>
      </div>
      <button className={przyciskG} onClick={generuj} disabled={!!praca || !tekst.trim()}>
        <Mic className="w-4 h-4" /> {praca === 'generuje' ? 'Nagrywam… (kilka sekund)' : nagranie ? 'Wygeneruj ponownie' : 'Generuj głos'}
      </button>

      {nagranie && (
        <div className="space-y-2">
          <audio controls src={nagranie.mp3} className="w-full" />
          <div className="grid grid-cols-2 gap-2">
            <button className={przyciskD} onClick={() => pobierz(nagranie.mp3, `${nazwa}-lektor.mp3`)}>
              <Download className="w-4 h-4" /> Głos (.mp3)
            </button>
            <button className={przyciskD} onClick={() => pobierz(`data:application/x-subrip;charset=utf-8,${encodeURIComponent(nagranie.srt)}`, `${nazwa}-napisy.srt`)}>
              <Download className="w-4 h-4" /> Napisy (.srt)
            </button>
          </div>
          <p className="text-xs text-slate-500">
            W programie do montażu: MP3 połóż na ścieżce audio pod filmem, a plik .srt wczytaj jako napisy (np. w DaVinci Resolve: Plik → Importuj → Napisy; w Premiere: przeciągnij plik na oś czasu). Napisy są już zgrane z głosem.
          </p>
        </div>
      )}

      {kom && (
        <p className={`text-xs flex items-start gap-1.5 ${kom.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
          {kom.ok ? <CircleCheck className="w-4 h-4 shrink-0" /> : <CircleAlert className="w-4 h-4 shrink-0" />} {kom.tekst}
        </p>
      )}

      {brakKonfiguracji && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-900 p-4 text-sm text-slate-700 dark:text-slate-200 space-y-2">
          <p className="font-semibold">Jak podłączyć lektora (raz, ok. 5 minut):</p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              Zaloguj się do ElevenLabs i otwórz <b>elevenlabs.io/app/settings/api-keys</b> → <b>Create Key</b>.
            </li>
            <li>
              Nazwij go np. „moto-raport” i włącz <b>Restrict Key</b>. Ustaw: <b>Text to Speech → Access</b>, <b>Voices → Read</b>, <b>User → Read</b> (dwa ostatnie są do przycisku „Sprawdź połączenie”). Resztę zostaw wyłączoną.
            </li>
            <li>Skopiuj klucz (zaczyna się od „sk_”). Pokazuje się tylko raz.</li>
            <li>
              W ElevenLabs otwórz <b>Voices</b> → <b>My Voices</b> → przy swoim głosie kliknij trzy kropki → <b>Copy voice ID</b>.
            </li>
            <li>
              Wejdź na <b>vercel.com</b> → projekt strony → <b>Settings</b> → <b>Environment Variables</b> i dodaj dwie zmienne:
              <br />
              <code className="text-xs">ELEVENLABS_API_KEY</code> = skopiowany klucz,
              <br />
              <code className="text-xs">ELEVENLABS_VOICE_ID</code> = ID głosu.
            </li>
            <li>
              W Vercel: <b>Deployments</b> → trzy kropki przy najnowszym → <b>Redeploy</b>. Po ok. 3 minutach kliknij tu „Sprawdź połączenie”.
            </li>
          </ol>
          <p className="text-xs text-slate-500">Klucza nie wysyłaj nikomu, także w czacie. Gdyby wyciekł, usuń go w ElevenLabs i utwórz nowy.</p>
        </div>
      )}
    </div>
  );
}
