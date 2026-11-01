// Zamienia kod wklejony w panelu (np. tag Google, Meta Pixel, weryfikacja domeny) na elementy strony.
// Do <head> trafiają tylko tagi, które mogą tam być: <meta>, <link>, <script>, <style>, <noscript>.
import React from 'react';

const ATRYBUTY: Record<string, string> = {
  class: 'className', charset: 'charSet', 'http-equiv': 'httpEquiv', crossorigin: 'crossOrigin', referrerpolicy: 'referrerPolicy',
  nomodule: 'noModule', fetchpriority: 'fetchPriority', hreflang: 'hrefLang', itemprop: 'itemProp'
};
const LOGICZNE = new Set(['async', 'defer', 'nomodule']);

function atrybuty(tekst: string): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tekst))) {
    const nazwa = m[1].toLowerCase();
    const wartosc = m[2] ?? m[3] ?? m[4];
    out[ATRYBUTY[nazwa] || nazwa] = LOGICZNE.has(nazwa) ? true : wartosc ?? '';
  }
  return out;
}

export function kodDoHead(html: string, klucz: string): React.ReactNode[] {
  if (!html || !html.trim()) return [];
  const el: React.ReactNode[] = [];
  const re = /<(script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<(meta|link|base)\b([^>]*?)\/?>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html))) {
    const k = `${klucz}-${i++}`;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const props = atrybuty(m[2]);
      const tresc = m[3];
      if (tag === 'script') el.push(<script key={k} {...props} {...(tresc.trim() ? { dangerouslySetInnerHTML: { __html: tresc } } : {})} />);
      else if (tag === 'style') el.push(<style key={k} {...props} dangerouslySetInnerHTML={{ __html: tresc }} />);
      else el.push(<noscript key={k} {...props} dangerouslySetInnerHTML={{ __html: tresc }} />);
    } else {
      const tag = m[4].toLowerCase();
      el.push(React.createElement(tag, { key: k, ...atrybuty(m[5]) }));
    }
  }
  return el;
}

/** Kod do treści strony (np. widżet, piksel w <noscript>) – wstawiany bez zmian */
export function KodWTresci({ html }: { html: string }) {
  if (!html || !html.trim()) return null;
  return <div className="kod-z-panelu" dangerouslySetInnerHTML={{ __html: html }} />;
}
