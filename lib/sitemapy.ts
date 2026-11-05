import { PORADNIKI, dataAktualizacji } from '@/lib/poradniki';
import { opublikowaneAktualnosci, aktualnosciTypu, TYPY, type TypAktualnosci } from '@/lib/aktualnosci';
// Mapy strony dla Google: indeks (/sitemap.xml) + mapy tematyczne (/sitemaps/*.xml), max 5000 adresów w pliku
import { getAllModels } from '@/lib/models';
import { listaWojewodztw, rankingi, marki } from '@/lib/dane';
import { site } from '@/config/site';
import { wszystkiePary } from '@/lib/porownania';
import { KODY } from '@/lib/kody-bledow';
import { opublikowane } from '@/lib/wpisy';
import { rankingiZProduktami } from '@/lib/produkty';
import { wszystkieTrasy } from '@/lib/miasta';
import { PREDKOSC } from '@/lib/mandaty';

const LIMIT = 5000;
interface Adres {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function grupy(): Record<string, Adres[]> {
  const modele = getAllModels().sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce);
  const karty = (lista: typeof modele, priorytet: number) =>
    lista.map((m) => ({ loc: m.adres, lastmod: m.dataAktualizacji, changefreq: 'monthly', priority: priorytet }));
  const out: Record<string, Adres[]> = {
    strony: [
      { loc: '/', changefreq: 'weekly', priority: 1 },
      { loc: '/marki/', changefreq: 'monthly', priority: 0.9 },
      { loc: '/wojewodztwa/', changefreq: 'monthly', priority: 0.7 },
      { loc: '/rankingi/', changefreq: 'monthly', priority: 0.7 },
      { loc: '/rynek/', changefreq: 'monthly', priority: 0.7 },
      { loc: '/porownaj/', changefreq: 'monthly', priority: 0.6 },
      { loc: '/metodologia/', changefreq: 'monthly', priority: 0.4 },
      { loc: '/linki/', changefreq: 'weekly', priority: 0.4 },
      { loc: '/prywatnosc/', changefreq: 'yearly', priority: 0.2 },
      ...listaWojewodztw.map((w) => ({ loc: `/wojewodztwa/${w.slug}/`, changefreq: 'monthly', priority: 0.6 })),
      ...rankingi.map((r) => ({ loc: `/rankingi/${r.id}/`, changefreq: 'monthly', priority: 0.6 }))
    ],
    marki: marki.map((m) => ({ loc: `/marki/${m.slug}/`, changefreq: 'monthly', priority: 0.8 })),
    generacje: karty(modele.filter((m) => !m.wszystkieGeneracje), 0.8),
    tresci: [
      ...(opublikowane().length ? [{ loc: '/filmy/', changefreq: 'weekly', priority: 0.8 }] : []),
      ...opublikowane().map((w) => ({ loc: `/filmy/${w.slug}/`, lastmod: w.opublikowano, changefreq: 'monthly', priority: 0.7 })),
      ...(rankingiZProduktami().length ? [{ loc: '/polecane/', changefreq: 'weekly', priority: 0.7 }] : []),
      ...rankingiZProduktami().map((r) => ({ loc: `/polecane/${r.id}/`, changefreq: 'weekly', priority: 0.6 }))
    ],
    zakup: [
      { loc: '/asystent-zakupu/', changefreq: 'monthly', priority: 0.8 },
      { loc: '/sprawdz-vin/', changefreq: 'monthly', priority: 0.7 },
      { loc: '/ubezpieczenie-oc/', changefreq: 'monthly', priority: 0.8 },
      ...modele.map((m) => ({ loc: `${m.adres}zakup/`, lastmod: m.dataAktualizacji, changefreq: 'monthly', priority: 0.6 }))
    ],
    kierowca: [
      { loc: '/koszt-trasy/', changefreq: 'weekly', priority: 0.8 },
      { loc: '/ladowarki/', changefreq: 'monthly', priority: 0.8 },
      { loc: '/fotoradary/', changefreq: 'monthly', priority: 0.8 },
      { loc: '/mandaty/', changefreq: 'monthly', priority: 0.8 },
      { loc: '/przypomnienia/', changefreq: 'monthly', priority: 0.6 },
      { loc: '/opony/', changefreq: 'monthly', priority: 0.8 },
      { loc: '/regulamin/', changefreq: 'yearly', priority: 0.2 },
      { loc: '/poradniki/', changefreq: 'monthly', priority: 0.8 },
      ...PORADNIKI.map((p) => ({ loc: `/poradniki/${p.slug}/`, lastmod: dataAktualizacji(p), changefreq: 'monthly', priority: 0.7 })),
      ...PREDKOSC.map((p) => ({ loc: `/mandaty/predkosc/${p.slug}/`, changefreq: 'yearly', priority: 0.6 })),
      ...wszystkieTrasy().map((t) => ({ loc: `/koszt-trasy/${t.id}/`, changefreq: 'monthly', priority: 0.5 }))
    ],
    aktualnosci: opublikowaneAktualnosci().length
      ? [
          { loc: '/aktualnosci/', lastmod: opublikowaneAktualnosci()[0].data, changefreq: 'daily', priority: 0.8 },
          ...(Object.keys(TYPY) as TypAktualnosci[])
            .filter((t) => aktualnosciTypu(t).length)
            .map((t) => ({ loc: `/aktualnosci/${t}/`, lastmod: aktualnosciTypu(t)[0].data, changefreq: 'daily', priority: 0.7 })),
          ...opublikowaneAktualnosci().map((a) => ({ loc: `/aktualnosci/${a.slug}/`, lastmod: a.data, changefreq: 'monthly', priority: 0.6 }))
        ]
      : [],
    'kody-bledow': [{ loc: '/kody-bledow/', changefreq: 'monthly', priority: 0.6 }, ...KODY.map((k) => ({ loc: `/kody-bledow/${k.kod.toLowerCase()}/`, changefreq: 'yearly', priority: 0.5 }))]
  };
  const pary = wszystkiePary().map((p) => ({ loc: `/porownaj/${p.id}/`, changefreq: 'monthly', priority: 0.5 }));
  for (let i = 0; i * LIMIT < pary.length; i++) out[`porownania-${i + 1}`] = pary.slice(i * LIMIT, (i + 1) * LIMIT);
  const rodzinne = karty(modele.filter((m) => m.wszystkieGeneracje), 0.7);
  for (let i = 0; i * LIMIT < rodzinne.length || i === 0; i++) out[`modele-${i + 1}`] = rodzinne.slice(i * LIMIT, (i + 1) * LIMIT);
  return out;
}

export function plikiMap(): string[] {
  return Object.entries(grupy())
    .filter(([, v]) => v.length > 0)
    .map(([k]) => `${k}.xml`);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function mapaXml(plik: string): string | null {
  const lista = grupy()[plik.replace(/\.xml$/, '')];
  if (!lista) return null;
  const wpisy = lista
    .map(
      (a) =>
        `<url><loc>${esc(site.url + a.loc)}</loc>${a.lastmod ? `<lastmod>${a.lastmod}</lastmod>` : ''}${a.changefreq ? `<changefreq>${a.changefreq}</changefreq>` : ''}${
          a.priority !== undefined ? `<priority>${a.priority.toFixed(1)}</priority>` : ''
        }</url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${wpisy}\n</urlset>\n`;
}

export function indeksXml(): string {
  const dzis = new Date().toISOString().slice(0, 10);
  const wpisy = plikiMap()
    .map((p) => `<sitemap><loc>${site.url}/sitemaps/${p}</loc><lastmod>${dzis}</lastmod></sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${wpisy}\n</sitemapindex>\n`;
}
