'use client';
import { useEffect, useState } from 'react';

// Komunikat po kliknięciu linku z e-maila (?status=potwierdzone / wypisano / wygaslo / blad)
const TEKSTY: Record<string, [string, string]> = {
  potwierdzone: ['bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100', 'Gotowe! Przypomnienia są włączone. Napiszemy 3 tygodnie i 3 dni przed terminem.'],
  wypisano: ['bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100', 'Wypisaliśmy Cię i usunęliśmy Twoje dane. Nie dostaniesz więcej wiadomości.'],
  wygaslo: ['bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100', 'Link wygasł (minęło ponad 7 dni). Zapisz się jeszcze raz poniżej.'],
  blad: ['bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100', 'Coś poszło nie tak. Spróbuj ponownie za kilka minut.']
};

export default function StatusPrzypomnien() {
  const [s, setS] = useState('');
  useEffect(() => {
    setS(new URLSearchParams(window.location.search).get('status') || '');
  }, []);
  const t = TEKSTY[s];
  if (!t) return null;
  return (
    <p role="status" className={`rounded-xl p-4 font-semibold ${t[0]}`}>
      {t[1]}
    </p>
  );
}
