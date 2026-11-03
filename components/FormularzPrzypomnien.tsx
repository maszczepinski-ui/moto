'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BellRing, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sledz } from '@/lib/sledz';

const pole =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';

/** Formularz zapisu na przypomnienia o OC i przeglądzie. `wlaczone=false` → pokazuje tylko zapowiedź. */
export default function FormularzPrzypomnien({ wlaczone, kompaktowy = false }: { wlaczone: boolean; kompaktowy?: boolean }) {
  const [email, setEmail] = useState('');
  const [oc, setOc] = useState('');
  const [przeglad, setPrzeglad] = useState('');
  const [zgoda, setZgoda] = useState(false);
  const [pulapka, setPulapka] = useState('');
  const [stan, setStan] = useState<'' | 'wysylanie' | 'ok'>('');
  const [blad, setBlad] = useState('');
  const start = useRef(0);
  useEffect(() => {
    start.current = Date.now();
  }, []);

  if (!wlaczone)
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-sm text-slate-600 dark:text-slate-400">
        Przypomnienia e-mail o końcu OC i przeglądzie uruchomimy wkrótce.
      </div>
    );

  if (stan === 'ok')
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 p-5 flex gap-3" role="status">
        <CheckCircle2 className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">Sprawdź skrzynkę e-mail</p>
          <p className="text-sm">Wysłaliśmy link potwierdzający. Kliknij go, żeby włączyć przypomnienia. Nie widzisz wiadomości? Zajrzyj do folderu „Oferty” lub „Spam”.</p>
        </div>
      </div>
    );

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBlad('');
        if (!oc && !przeglad) return setBlad('Podaj datę końca OC albo przeglądu (albo obie).');
        if (!zgoda) return setBlad('Zaznacz zgodę – bez niej nie możemy wysyłać przypomnień.');
        setStan('wysylanie');
        try {
          const r = await fetch('/api/przypomnienia/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, oc, przeglad, zgoda, strona: pulapka, czas: Date.now() - start.current })
          });
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(d.blad || 'Nie udało się zapisać');
          setStan('ok');
          sledz('przypomnienie_zapis', { oc: oc ? 1 : 0, przeglad: przeglad ? 1 : 0 });
        } catch (er) {
          setStan('');
          setBlad((er as Error).message);
        }
      }}
    >
      {!kompaktowy && (
        <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <BellRing className="w-5 h-5 text-rust-600" aria-hidden="true" /> Przypomnimy Ci 3 tygodnie i 3 dni przed terminem
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-3">
          <label htmlFor="pr-email" className={etykieta}>
            Twój e-mail
          </label>
          <input id="pr-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. jan@poczta.pl" className={pole} />
        </div>
        <div>
          <label htmlFor="pr-oc" className={etykieta}>
            OC kończy się
          </label>
          <input id="pr-oc" type="date" value={oc} onChange={(e) => setOc(e.target.value)} className={pole} />
        </div>
        <div>
          <label htmlFor="pr-prz" className={etykieta}>
            Przegląd ważny do
          </label>
          <input id="pr-prz" type="date" value={przeglad} onChange={(e) => setPrzeglad(e.target.value)} className={pole} />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={stan === 'wysylanie'} className="w-full inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl">
            {stan === 'wysylanie' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <BellRing className="w-4 h-4" aria-hidden="true" />}
            Przypominaj mi
          </button>
        </div>
      </div>
      {/* pole-pułapka na boty – niewidoczne dla ludzi */}
      <input type="text" tabIndex={-1} autoComplete="off" value={pulapka} onChange={(e) => setPulapka(e.target.value)} className="hidden" aria-hidden="true" name="strona" />
      <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
        <input type="checkbox" checked={zgoda} onChange={(e) => setZgoda(e.target.checked)} className="w-4 h-4 mt-0.5 accent-rust-600" />
        <span>
          Zgadzam się na wysyłanie na mój e-mail przypomnień o tych terminach (razem z linkiem do porównania ofert OC). Mogę się wypisać w każdej chwili jednym kliknięciem – dane
          usuwamy wtedy od razu.{' '}
          <Link href="/prywatnosc/#przypomnienia" className="underline">
            Jak przetwarzamy dane
          </Link>
        </span>
      </label>
      {blad && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4" aria-hidden="true" /> {blad}
        </p>
      )}
    </form>
  );
}
