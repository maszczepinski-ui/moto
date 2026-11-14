// Prosty czytnik kanałów RSS i Atom (bez dodatkowych bibliotek).
// Wyciąga z kanału tylko to, czego potrzebuje panel: tytuł, link, datę i krótki opis.

export interface WpisRss {
  tytul: string;
  link: string;
  /** data w formacie ISO, gdy kanał ją podaje */
  data?: string;
  /** krótki opis bez HTML (do ok. 260 znaków) */
  opis?: string;
  zrodlo: string;
  jezyk: string;
}

const ENCJE: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', bdquo: '„', rdquo: '”', ldquo: '“', oacute: 'ó' };

/** Zamienia &amp;, &#8211; itd. na zwykłe znaki */
function encje(t: string) {
  return t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
}

/** Usuwa CDATA, znaczniki HTML i nadmiarowe spacje */
function czysty(t = '') {
  const bezCdata = t.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  return encje(encje(bezCdata).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function pole(blok: string, ...nazwy: string[]) {
  for (const n of nazwy) {
    const m = blok.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'));
    if (m) return m[1];
  }
  return '';
}

function skroc(t: string, ile = 260) {
  if (t.length <= ile) return t;
  return t.slice(0, ile).replace(/\s+\S*$/, '') + '…';
}

function dataIso(t: string) {
  const d = new Date(czysty(t));
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function czytajKanal(xml: string, zrodlo: string, jezyk: string): WpisRss[] {
  const wynik: WpisRss[] = [];
  // RSS 2.0: <item>…</item>, Atom: <entry>…</entry>
  const bloki = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of bloki) {
    const tytul = czysty(pole(b, 'title'));
    let link = czysty(pole(b, 'link'));
    if (!link) link = b.match(/<link[^>]*href="([^"]+)"/i)?.[1] || '';
    if (!link) link = czysty(pole(b, 'guid'));
    link = encje(link);
    if (!tytul || !/^https?:\/\//.test(link)) continue;
    const opis = czysty(pole(b, 'description', 'summary', 'content'));
    wynik.push({ tytul, link, data: dataIso(pole(b, 'pubDate', 'published', 'updated', 'dc:date')), opis: opis ? skroc(opis) : undefined, zrodlo, jezyk });
  }
  return wynik;
}
