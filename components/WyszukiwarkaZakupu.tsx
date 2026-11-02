'use client';
// Wyszukiwarka asystenta zakupu: wpisz model albo wklej link do ogłoszenia (Otomoto, OLX…) → strona „Kupujesz …?”.
import { useMemo, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { sledz } from '@/lib/sledz';

export type KartaWyszukiwarki = { n: string; a: string; l: number; s: string; g: boolean; od: number; do: number };

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l');

function tokeny(t: string) {
  return norm(t)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

export default function WyszukiwarkaZakupu({ karty }: { karty: KartaWyszukiwarki[] }) {
  const [q, setQ] = useState('');
  const przygotowane = useMemo(() => karty.map((k) => ({ ...k, t: k.s.split('-') })), [karty]);

  const wyniki = useMemo(() => {
    const tekst = q.trim();
    if (tekst.length < 2) return [];
    const czyLink = /^https?:\/\/|otomoto|olx\.pl|autoplac|sprzedajemy/i.test(tekst);
    if (czyLink) {
      // z linku bierzemy tylko ścieżkę, np. /osobowe/oferta/volkswagen-passat-b6-2-0-tdi-…
      let sciezka = tekst;
      try {
        sciezka = new URL(tekst.startsWith('http') ? tekst : `https://${tekst}`).pathname;
      } catch {
        /* zostaje cały tekst */
      }
      const Q = new Set(tokeny(sciezka));
      const rok = [...Q].map(Number).find((x) => x >= 1950 && x <= 2030);
      return przygotowane
        .filter((k) => k.t.every((x) => Q.has(x)))
        .map((k) => ({ k, w: k.t.length * 10 + (rok && k.od <= rok && rok <= k.do ? 5 : 0) + (k.g ? 0 : 1) }))
        .sort((a, b) => b.w - a.w || b.k.l - a.k.l)
        .slice(0, 6)
        .map((x) => x.k);
    }
    const Q = tokeny(tekst);
    return przygotowane
      .filter((k) => Q.every((x) => k.t.some((y) => y.startsWith(x)) || norm(k.n).includes(x)))
      .sort((a, b) => Number(a.g) - Number(b.g) || b.l - a.l)
      .slice(0, 10);
  }, [q, przygotowane]);

  return (
    <div className="space-y-3">
      <label htmlFor="zakup-q" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Wpisz model albo wklej link do ogłoszenia
      </label>
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          id="zakup-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="np. Passat B6 albo https://www.otomoto.pl/osobowe/oferta/…"
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3 py-3 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-rust-500 focus:outline-none"
        />
      </div>
      {q.trim().length >= 2 && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {wyniki.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
              Nie rozpoznaliśmy modelu. Spróbuj wpisać markę i model, np. „Skoda Octavia”.
            </li>
          )}
          {wyniki.map((k) => (
            <li key={k.a}>
              <a
                href={`${k.a}zakup/`}
                onClick={() => sledz('asystent_wybor', { karta: k.s })}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white">{k.n}</span>
                  <span className="block text-xs text-slate-500">{k.l.toLocaleString('pl-PL')} aut w Polsce</span>
                </span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-rust-600" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
