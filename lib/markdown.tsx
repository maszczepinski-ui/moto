// Markdown artykułów: ## / ### nagłówki, listy (- i 1.), **pogrubienie**, *kursywa*, [link](adres).
// Opcjonalnie podlinkowuje pierwsze wystąpienie nazw modeli do ich kart (linkowanie wewnętrzne).
import React from 'react';
import { bezpiecznyUrl } from '@/lib/bezpieczenstwo';

export type AutoLink = { fraza: string; adres: string };

function inline(t: string, k: string, linki: AutoLink[], uzyte: Set<string>): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;
  let ost = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  const tekst = (s: string) => {
    // auto-linki tylko w zwykłym tekście
    let reszta = s;
    while (reszta) {
      let najlepszy: { i: number; l: AutoLink } | null = null;
      for (const l of linki) {
        if (uzyte.has(l.adres)) continue;
        const i = reszta.toLowerCase().indexOf(l.fraza.toLowerCase());
        if (i >= 0 && (!najlepszy || i < najlepszy.i)) najlepszy = { i, l };
      }
      if (!najlepszy) {
        out.push(<React.Fragment key={`${k}-${n++}`}>{reszta}</React.Fragment>);
        break;
      }
      const { i, l } = najlepszy;
      if (i > 0) out.push(<React.Fragment key={`${k}-${n++}`}>{reszta.slice(0, i)}</React.Fragment>);
      out.push(
        <a key={`${k}-${n++}`} href={l.adres} className="font-semibold text-steel-700 dark:text-steel-300 underline decoration-steel-300">
          {reszta.slice(i, i + l.fraza.length)}
        </a>
      );
      uzyte.add(l.adres);
      reszta = reszta.slice(i + l.fraza.length);
    }
  };
  while ((m = re.exec(t))) {
    if (m.index > ost) tekst(t.slice(ost, m.index));
    const c = m[0];
    if (c.startsWith('**')) out.push(<strong key={`${k}-${n++}`}>{c.slice(2, -2)}</strong>);
    else if (c.startsWith('[')) {
      const [, txt, surowy] = c.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) || [];
      const url = bezpiecznyUrl(surowy);
      if (!url) {
        out.push(<React.Fragment key={`${k}-${n++}`}>{txt}</React.Fragment>);
        ost = m.index + c.length;
        continue;
      }
      const zewn = /^https?:\/\//.test(url);
      out.push(
        <a key={`${k}-${n++}`} href={url} {...(zewn ? { target: '_blank', rel: 'noopener' } : {})} className="font-semibold text-steel-700 dark:text-steel-300 underline">
          {txt}
        </a>
      );
    } else out.push(<em key={`${k}-${n++}`}>{c.slice(1, -1)}</em>);
    ost = m.index + c.length;
  }
  if (ost < t.length) tekst(t.slice(ost));
  return out;
}

export function ArtykulMarkdown({ tekst, linki = [] }: { tekst: string; linki?: AutoLink[] }) {
  const uzyte = new Set<string>();
  const bloki = tekst.replace(/\r/g, '').trim().split(/\n\s*\n/);
  return (
    <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-[17px]">
      {bloki.map((b, i) => {
        const linie = b.split('\n').map((l) => l.trim()).filter(Boolean);
        if (!linie.length) return null;
        const k = String(i);
        if (/^### /.test(linie[0]) && linie.length === 1)
          return (
            <h3 key={k} className="text-xl font-bold text-slate-900 dark:text-white pt-2">
              {linie[0].slice(4)}
            </h3>
          );
        if (/^#{1,2} /.test(linie[0]) && linie.length === 1)
          return (
            <h2 key={k} className="text-2xl font-bold text-slate-900 dark:text-white pt-4">
              {linie[0].replace(/^#+ /, '')}
            </h2>
          );
        if (/^#{1,3} /.test(linie[0])) {
          // nagłówek i tekst bez pustej linii między nimi
          const H = linie[0].startsWith('### ') ? 'h3' : 'h2';
          return (
            <React.Fragment key={k}>
              {React.createElement(H, { className: H === 'h2' ? 'text-2xl font-bold text-slate-900 dark:text-white pt-4' : 'text-xl font-bold text-slate-900 dark:text-white pt-2' }, linie[0].replace(/^#+ /, ''))}
              <p>{inline(linie.slice(1).join(' '), k, linki, uzyte)}</p>
            </React.Fragment>
          );
        }
        if (linie.every((l) => /^[-*•] /.test(l)))
          return (
            <ul key={k} className="list-disc pl-6 space-y-1.5">
              {linie.map((l, j) => (
                <li key={j}>{inline(l.replace(/^[-*•] /, ''), `${k}-${j}`, linki, uzyte)}</li>
              ))}
            </ul>
          );
        if (linie.every((l) => /^\d+[.)] /.test(l)))
          return (
            <ol key={k} className="list-decimal pl-6 space-y-1.5">
              {linie.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+[.)] /, ''), `${k}-${j}`, linki, uzyte)}</li>
              ))}
            </ol>
          );
        return <p key={k}>{inline(linie.join(' '), k, linki, uzyte)}</p>;
      })}
    </div>
  );
}
