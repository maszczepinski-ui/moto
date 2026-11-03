'use client';
import { useEffect, useState } from 'react';
import { List, Link2, Check, Share2 } from 'lucide-react';

// Elementy, które pomagają czytać dłuższe strony: pasek postępu, spis treści z podświetleniem i udostępnianie.

/** Cienki pasek u góry ekranu pokazujący, ile artykułu już przeczytano */
export function PostepCzytania({ cel = 'artykul' }: { cel?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.getElementById(cel);
    if (!el) return;
    let ramka = 0;
    const licz = () => {
      cancelAnimationFrame(ramka);
      ramka = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const calosc = r.height - window.innerHeight * 0.6;
        setP(Math.min(1, Math.max(0, -r.top / Math.max(1, calosc))));
      });
    };
    licz();
    window.addEventListener('scroll', licz, { passive: true });
    window.addEventListener('resize', licz);
    return () => {
      window.removeEventListener('scroll', licz);
      window.removeEventListener('resize', licz);
    };
  }, [cel]);
  return (
    <div className="fixed left-0 right-0 top-0 h-1 z-[70] pointer-events-none no-print" aria-hidden="true">
      <div className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 origin-left transition-transform duration-150" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

export interface PozycjaSpisu {
  id: string;
  t: string;
}

function useAktywna(ids: string[]) {
  const [aktywna, setAktywna] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length || !('IntersectionObserver' in window)) return;
    const widoczne = new Map<string, boolean>();
    const obs = new IntersectionObserver(
      (wpisy) => {
        for (const w of wpisy) widoczne.set(w.target.id, w.isIntersecting);
        const pierwsza = ids.find((id) => widoczne.get(id));
        if (pierwsza) setAktywna(pierwsza);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [ids]);
  return aktywna;
}

/** Spis treści: na komputerze przyklejony z boku, z podświetleniem czytanej sekcji */
export function SpisTresci({ pozycje, tytul = 'W tym poradniku' }: { pozycje: PozycjaSpisu[]; tytul?: string }) {
  const aktywna = useAktywna(pozycje.map((p) => p.id));
  return (
    <nav aria-label="Spis treści" className="text-sm">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">{tytul}</div>
      <ol className="relative border-l border-slate-200 dark:border-slate-800">
        {pozycje.map((p, i) => {
          const a = p.id === aktywna;
          return (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                aria-current={a ? 'location' : undefined}
                className={`-ml-px flex gap-2 border-l-2 py-1.5 pl-4 pr-2 leading-snug transition-colors ${
                  a ? 'border-sky-500 text-slate-900 dark:text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="tabular-nums text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                {p.t}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Spis treści na telefonie – zwinięty na górze artykułu */
export function SpisTresciMobilny({ pozycje }: { pozycje: PozycjaSpisu[] }) {
  return (
    <details className="lg:hidden group rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
      <summary className="flex items-center gap-2 cursor-pointer list-none p-4 font-bold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
        <List className="w-4 h-4 text-sky-600" aria-hidden="true" /> Spis treści
        <span className="ml-auto text-xs font-semibold text-slate-500 group-open:hidden">{pozycje.length} części</span>
      </summary>
      <ol className="px-4 pb-4 space-y-2 text-sm">
        {pozycje.map((p, i) => (
          <li key={p.id}>
            <a href={`#${p.id}`} className="flex gap-2 text-slate-700 dark:text-slate-300 hover:underline">
              <span className="tabular-nums text-slate-400">{String(i + 1).padStart(2, '0')}</span>
              {p.t}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Przycisk „Udostępnij” – na telefonie systemowe okno udostępniania, na komputerze kopiuje link */
export function Udostepnij({ tytul }: { tytul: string }) {
  const [skopiowano, setSkopiowano] = useState(false);
  const [natywne, setNatywne] = useState(false);
  useEffect(() => setNatywne(typeof navigator !== 'undefined' && 'share' in navigator), []);
  const klik = async () => {
    const url = window.location.href.split('#')[0];
    try {
      if (natywne) {
        await navigator.share({ title: tytul, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setSkopiowano(true);
      setTimeout(() => setSkopiowano(false), 2000);
    } catch {
      /* użytkownik zamknął okno – nic nie robimy */
    }
  };
  const I = skopiowano ? Check : natywne ? Share2 : Link2;
  return (
    <button type="button" onClick={klik} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/20 px-3 py-1.5 text-xs font-bold text-white transition">
      <I className="w-3.5 h-3.5" aria-hidden="true" /> {skopiowano ? 'Skopiowano link' : natywne ? 'Udostępnij' : 'Kopiuj link'}
    </button>
  );
}
