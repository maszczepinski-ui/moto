// Opisy modeli (eksploatacja, koszty, podsumowanie) – szkice w data/opisy/<slug>.json.
// Na stronie pokazujemy tylko opisy zatwierdzone w panelu admina (lista „opisyZatwierdzone”).
import fs from 'fs';
import path from 'path';
import React from 'react';
import { panelDane } from '@/lib/panel';

export interface OpisModelu {
  slug: string;
  wygenerowano: string;
  model?: string;
  eksploatacja: string;
  koszty: string;
  podsumowanie: string;
}

const KATALOG = path.join(process.cwd(), 'data/opisy');

export function wszystkieSzkice(): OpisModelu[] {
  if (!fs.existsSync(KATALOG)) return [];
  return fs
    .readdirSync(KATALOG)
            .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(KATALOG, f), 'utf8')) as OpisModelu);
}

export function opisZatwierdzony(slug: string): OpisModelu | null {
  if (!(panelDane.opisyZatwierdzone || []).includes(slug)) return null;
  const plik = path.join(KATALOG, `${slug}.json`);
  return fs.existsSync(plik) ? (JSON.parse(fs.readFileSync(plik, 'utf8')) as OpisModelu) : null;
}

// Bardzo prosty Markdown: akapity, listy „- ”, pogrubienie **tekst**
function wiersz(t: string, k: string) {
  const czesci = t.split(/(\*\*[^*]+\*\*)/g);
  return czesci.map((c, i) => (c.startsWith('**') ? <strong key={`${k}-${i}`}>{c.slice(2, -2)}</strong> : <React.Fragment key={`${k}-${i}`}>{c}</React.Fragment>));
}

export function Markdown({ tekst }: { tekst: string }) {
  const bloki = tekst.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
      {bloki.map((b, i) => {
        const linie = b.split('\n').map((l) => l.trim()).filter(Boolean);
        if (linie.every((l) => /^[-*•] /.test(l)))
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5">
              {linie.map((l, j) => (
                <li key={j}>{wiersz(l.replace(/^[-*•] /, ''), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        if (/^#{1,4} /.test(linie[0]))
          return (
            <h3 key={i} className="font-bold text-slate-900 dark:text-white">
              {linie[0].replace(/^#+ /, '')}
            </h3>
          );
        return <p key={i}>{wiersz(linie.join(' '), String(i))}</p>;
      })}
    </div>
  );
}
