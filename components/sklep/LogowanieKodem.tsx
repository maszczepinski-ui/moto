'use client';
// Logowanie do narzędzia dla kupujących: e-mail z zamówienia → 6-cyfrowy kod z maila.
import { useState } from 'react';
import { Check, Loader2, Mail } from 'lucide-react';

export default function LogowanieKodem({ api, tytul, opis, ikona, poZalogowaniu }: { api: string; tytul: string; opis: string; ikona: React.ReactNode; poZalogowaniu: () => void }) {
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
    const r = await fetch(`${api}kod/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).catch(() => null);
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
    const r = await fetch(`${api}logowanie/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, kod }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setPraca(false);
    if (!r?.ok) return setInfo(j?.blad || 'Brak połączenia. Spróbuj ponownie.');
    poZalogowaniu();
  }

  return (
    <div className="rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 max-w-xl mx-auto">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          {ikona} {tytul}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">{opis}</p>
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
      {info && (
        <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
          {info}
        </p>
      )}
      <p className="text-xs text-slate-500">Po zalogowaniu urządzenie pamięta dostęp przez rok. Na jedno zamówienie możesz korzystać z 3 urządzeń.</p>
    </div>
  );
}
