'use client';
// Strona „Dziękujemy”: co kilka sekund pyta, czy płatność przeszła; gdy tak – pokazuje przycisk pobierania.
import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';

export default function StatusPlatnosci({ sessionId }: { sessionId: string }) {
  const [stan, setStan] = useState<'czeka' | 'oplacone' | 'nieznane' | 'anulowane'>('czeka');
  const [link, setLink] = useState('');
  const [proby, setProby] = useState(0);

  useEffect(() => {
    if (!sessionId) return setStan('nieznane');
    if (stan !== 'czeka' || proby > 40) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/sklep/status/?s=${encodeURIComponent(sessionId)}`, { cache: 'no-store' });
        const j = await r.json();
        if (j.stan === 'oplacone') {
          setLink(j.link);
          setStan('oplacone');
        } else if (j.stan === 'nieznane' || j.stan === 'anulowane') setStan(j.stan);
      } catch {
        /* spróbujemy jeszcze raz */
      }
      setProby((p) => p + 1);
    }, proby === 0 ? 500 : 3000);
    return () => clearTimeout(t);
  }, [sessionId, stan, proby]);

  if (stan === 'oplacone')
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-lg">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" /> Płatność przyjęta
        </p>
        <a href={link} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3.5">
          <Download className="w-5 h-5" aria-hidden="true" /> Pobierz pakiet
        </a>
        <p className="text-sm text-slate-600 dark:text-slate-300">Ten sam link wysłaliśmy mailem. Fakturę dostaniesz osobnym mailem z systemu inFakt.</p>
      </div>
    );
  if (stan === 'anulowane') return <p className="text-slate-700 dark:text-slate-300">Płatność została anulowana albo minął czas na zapłatę. Pieniądze nie zostały pobrane – możesz wrócić i złożyć zamówienie jeszcze raz.</p>;
  if (stan === 'nieznane') return <p className="text-slate-700 dark:text-slate-300">Nie znaleźliśmy tego zamówienia. Jeśli płatność przeszła, link do pobrania jest w mailu.</p>;
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Czekamy na potwierdzenie płatności…
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {proby > 40 ? 'Potwierdzenie trwa dłużej niż zwykle. Link do pobrania przyjdzie mailem, gdy tylko płatność zostanie zaksięgowana.' : 'Zwykle trwa to kilka sekund. Nie zamykaj tej strony.'}
      </p>
    </div>
  );
}
