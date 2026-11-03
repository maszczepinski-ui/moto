import type { Metadata } from 'next';
import { WifiOff } from 'lucide-react';

// Strona pokazywana w aplikacji (ikonie na ekranie telefonu), gdy nie ma internetu.
export const metadata: Metadata = {
  title: 'Brak połączenia z internetem',
  robots: { index: false, follow: false }
};

export default function OfflinePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <WifiOff className="w-12 h-12 mx-auto text-slate-400" aria-hidden="true" />
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Brak internetu</h1>
      <p className="text-slate-600 dark:text-slate-300">Ta strona potrzebuje połączenia, żeby pokazać aktualne dane. Sprawdź zasięg albo Wi-Fi i spróbuj ponownie.</p>
      <p className="text-sm text-slate-500">
        Miałeś kolizję? Najważniejsze: zabezpiecz miejsce, sprawdź, czy nikt nie jest ranny, a w razie potrzeby dzwoń pod <a href="tel:112" className="font-bold underline">112</a>.
      </p>
      <a href="/" className="inline-block rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-5 py-3">
        Spróbuj ponownie
      </a>
    </div>
  );
}
