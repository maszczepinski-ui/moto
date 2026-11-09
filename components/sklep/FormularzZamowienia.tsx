'use client';
// Formularz zamówienia Niezbędnika: e-mail, dane do faktury, dwie obowiązkowe zgody → przekierowanie do Przelewy24.
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';

const pole = 'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm';

export default function FormularzZamowienia({ aktywny, cena, regulamin }: { aktywny: boolean; cena: string; regulamin: string }) {
  const [email, setEmail] = useState('');
  const [imieNazwisko, setImieNazwisko] = useState('');
  const [naFirme, setNaFirme] = useState(false);
  const [firma, setFirma] = useState({ firma: '', nip: '', adres: '', kod: '', miasto: '' });
  const [zgodaRegulamin, setZgodaRegulamin] = useState(false);
  const [zgodaTresci, setZgodaTresci] = useState(false);
  const [praca, setPraca] = useState(false);
  const [blad, setBlad] = useState('');

  async function zamow(e: React.FormEvent) {
    e.preventDefault();
    setBlad('');
    setPraca(true);
    try {
      const r = await fetch('/api/sklep/zamow/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, imieNazwisko, naFirme, ...firma, zgodaRegulamin, zgodaTresci })
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.blad || 'Coś poszło nie tak. Spróbuj ponownie.');
      window.location.href = j.url;
    } catch (err) {
      setBlad((err as Error).message);
      setPraca(false);
    }
  }

  const gotowe = aktywny && zgodaRegulamin && zgodaTresci && !praca;
  return (
    <form onSubmit={zamow} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Zamówienie</h2>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{cena}</p>
      </div>
      {!aktywny && <p className="rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-sm px-3 py-2">Sprzedaż ruszy wkrótce.</p>}
      <label className="block text-sm">
        <span className="block font-semibold mb-1">E-mail – na niego wyślemy pakiet</span>
        <input type="email" required autoComplete="email" className={pole} value={email} onChange={(e) => setEmail(e.target.value)} disabled={!aktywny} />
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={naFirme} onChange={(e) => setNaFirme(e.target.checked)} disabled={!aktywny} className="w-4 h-4 accent-emerald-600" />
        Chcę fakturę na firmę (z NIP)
      </label>
      {!naFirme ? (
        <label className="block text-sm">
          <span className="block font-semibold mb-1">Imię i nazwisko (do faktury)</span>
          <input required autoComplete="name" className={pole} value={imieNazwisko} onChange={(e) => setImieNazwisko(e.target.value)} disabled={!aktywny} />
        </label>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <label className="sm:col-span-2 block">
            <span className="block font-semibold mb-1">Nazwa firmy</span>
            <input required autoComplete="organization" className={pole} value={firma.firma} onChange={(e) => setFirma({ ...firma, firma: e.target.value })} />
          </label>
          <label className="block">
            <span className="block font-semibold mb-1">NIP</span>
            <input required inputMode="numeric" className={pole} value={firma.nip} onChange={(e) => setFirma({ ...firma, nip: e.target.value })} />
          </label>
          <label className="block">
            <span className="block font-semibold mb-1">Ulica i numer</span>
            <input required autoComplete="street-address" className={pole} value={firma.adres} onChange={(e) => setFirma({ ...firma, adres: e.target.value })} />
          </label>
          <label className="block">
            <span className="block font-semibold mb-1">Kod pocztowy</span>
            <input required placeholder="00-000" autoComplete="postal-code" className={pole} value={firma.kod} onChange={(e) => setFirma({ ...firma, kod: e.target.value })} />
          </label>
          <label className="block">
            <span className="block font-semibold mb-1">Miasto</span>
            <input required autoComplete="address-level2" className={pole} value={firma.miasto} onChange={(e) => setFirma({ ...firma, miasto: e.target.value })} />
          </label>
        </div>
      )}
      <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={zgodaRegulamin} onChange={(e) => setZgodaRegulamin(e.target.checked)} disabled={!aktywny} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-emerald-600" />
          <span>
            Akceptuję{' '}
            <a href={regulamin} target="_blank" className="underline font-semibold">
              regulamin sklepu
            </a>{' '}
            i politykę prywatności. <span className="text-rose-600">*</span>
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={zgodaTresci} onChange={(e) => setZgodaTresci(e.target.checked)} disabled={!aktywny} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-emerald-600" />
          <span>
            Żądam dostarczenia plików przed upływem 14 dni na odstąpienie od umowy i przyjmuję do wiadomości, że po ich dostarczeniu tracę prawo odstąpienia od umowy.{' '}
            <span className="text-rose-600">*</span>
          </span>
        </label>
      </div>
      {blad && (
        <p role="alert" className="text-sm font-semibold text-rose-600">
          {blad}
        </p>
      )}
      <button
        type="submit"
        disabled={!gotowe}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/25 disabled:bg-emerald-600/45 disabled:shadow-none disabled:cursor-not-allowed text-white px-4 py-3 transition-colors"
      >
        {praca ? <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" aria-hidden="true" /> : <Lock className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
        <span className="flex flex-col items-start leading-tight text-left">
          <span className="text-base font-extrabold whitespace-nowrap">{praca ? 'Przechodzę do płatności…' : `Zapłać ${cena}`}</span>
          {!praca && <span className="text-xs font-medium text-emerald-50/90">BLIK · przelew · karta</span>}
        </span>
      </button>
      {aktywny && !gotowe && !praca && <p className="text-xs text-slate-500 text-center -mt-2">Uzupełnij dane i zaznacz obie zgody, aby przejść do płatności.</p>}
      <p className="text-xs text-slate-500 text-center">Płatność obsługuje Przelewy24. Pakiet dostaniesz od razu po zapłacie, a fakturę mailem.</p>
    </form>
  );
}
