#!/usr/bin/env node
// =====================================================================
// Aktualności → szkice wpisów (data/aktualnosci/<slug>.json)
//
// Źródła (config/zrodla-aktualnosci.json):
//  1. Akcje serwisowe – oficjalny tygodniowy eksport XML systemu Safety Gate (Komisja Europejska).
//     Jeden szkic na tydzień: wszystkie wezwania aut osobowych z danego tygodnia, przetłumaczone na polski.
//  2. Komunikaty – strony urzędów na gov.pl (treści na licencji CC BY-SA 4.0). Tylko tematy ważne dla kierowców.
//  3. Premiery – kanały RSS biur prasowych producentów. Tylko nowe modele, wersje, ceny i wejścia na rynek.
//
// Teksty pisze model językowy (Claude, klucz ANTHROPIC_API_KEY) – WŁASNYMI słowami, wyłącznie na podstawie faktów ze źródła,
// ze źródłem podanym pod wpisem. Bez klucza powstają tylko surowe szkice akcji serwisowych (do uzupełnienia w panelu).
// Szkice NIE są widoczne na stronie – zatwierdzasz je w panelu admina (zakładka „Aktualności”).
//
// Automat szanuje plik robots.txt każdej strony i robi przerwę między zapytaniami.
// Wynik każdego uruchomienia zapisuje w data/aktualnosci/_raport.json (widać go w panelu).
//
// Opcje: --tylko akcje|komunikaty|premiery   --suchy (nic nie zapisuje, tylko wypisuje)
// =====================================================================
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const KATALOG = process.env.KATALOG_AKTUALNOSCI || path.join(ROOT, 'data', 'aktualnosci');
const MODELE = path.join(ROOT, 'data', 'models');
const KONFIG = JSON.parse(fs.readFileSync(process.env.KONFIG_AKTUALNOSCI || path.join(ROOT, 'config', 'zrodla-aktualnosci.json'), 'utf8'));
const PRZETWORZONE = path.join(KATALOG, '_przetworzone.json');
const RAPORT = path.join(KATALOG, '_raport.json');
const AI = process.env.ANTHROPIC_API || 'https://api.anthropic.com';
const MODEL = process.env.MODEL || 'claude-sonnet-5-5';
const UA = 'MotoRaportBot/1.0 (+https://moto-raport.pl/aktualnosci/)';
const SUCHY = process.argv.includes('--suchy');
const TYLKO = (() => {
  const i = process.argv.indexOf('--tylko');
  return i > 0 ? process.argv[i + 1] : '';
})();
const dzis = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (t) =>
  (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');
const slugify = (t) => norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/, '');
const raport = { data: new Date().toISOString(), ai: !!process.env.ANTHROPIC_API_KEY, zrodla: [] };
const log = (...a) => console.log(...a);

// ───────────── pobieranie z poszanowaniem robots.txt ─────────────
const robotsCache = new Map();
async function dozwolone(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.host)) {
    let reguly = [];
    try {
      const r = await fetch(`${u.protocol}//${u.host}/robots.txt`, { headers: { 'user-agent': UA } });
      if (r.ok) {
        let dlaNas = false;
        for (const linia of (await r.text()).split('\n')) {
          const [k, ...v] = linia.split(':');
          const klucz = (k || '').trim().toLowerCase();
          const wartosc = v.join(':').trim();
          if (klucz === 'user-agent') dlaNas = wartosc === '*' || /motoraport/i.test(wartosc);
          else if (dlaNas && klucz === 'disallow' && wartosc) reguly.push(wartosc);
        }
      }
    } catch {
      reguly = [];
    }
    robotsCache.set(u.host, reguly);
  }
  const sciezka = u.pathname + u.search;
  return !robotsCache.get(u.host).some((r) => sciezka.startsWith(r.replace(/\*.*$/, '')));
}
async function pobierz(url) {
  if (!(await dozwolone(url))) throw new Error(`robots.txt nie pozwala pobrać ${url}`);
  await czekaj(800);
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xml,application/rss+xml,*/*' }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// ───────────── proste narzędzia do HTML/XML ─────────────
const ENCJE = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', oacute: 'ó', ndash: '–', mdash: '—', bdquo: '„', rdquo: '”', ldquo: '“', hellip: '…' };
const dekoduj = (t) =>
  (t || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
const bezTagow = (h) =>
  dekoduj(
    (h || '')
      .replace(/<(script|style|noscript|svg|nav|header|footer|form|aside)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
const tag = (xml, nazwa) => {
  const m = xml.match(new RegExp(`<${nazwa}(?:\\s[^>]*)?>([\\s\\S]*?)</${nazwa}>`, 'i'));
  return m ? dekoduj(m[1]).trim() : '';
};
const meta = (html, nazwa) => {
  const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${nazwa}["'][^>]*content=["']([^"']*)["']`, 'i')) || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${nazwa}["']`, 'i'));
  return m ? dekoduj(m[1]).trim() : '';
};
function trescStrony(html) {
  const art = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  return bezTagow(art).slice(0, 14000);
}
const dataZTekstu = (t) => {
  const m = (t || '').match(/\b(\d{2})\.(\d{2})\.(20\d{2})\b/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

// ───────────── stan ─────────────
const stan = fs.existsSync(PRZETWORZONE) ? JSON.parse(fs.readFileSync(PRZETWORZONE, 'utf8')) : { klucze: [] };
const juz = new Set(stan.klucze);
const oznacz = (k) => {
  juz.add(k);
  stan.klucze.push(k);
};
const istniejaceSlugi = new Set(fs.existsSync(KATALOG) ? fs.readdirSync(KATALOG).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : []);
const ZAREZERWOWANE = new Set(['akcje-serwisowe', 'komunikaty', 'premiery', 'wkrotce']);
function wolnySlug(baza) {
  let s = slugify(baza) || `wpis-${Date.now()}`;
  if (ZAREZERWOWANE.has(s)) s += '-1';
  let n = 2;
  const b = s;
  while (istniejaceSlugi.has(s)) s = `${b}-${n++}`;
  istniejaceSlugi.add(s);
  return s;
}
function zapisz(wpis) {
  log(`  ✓ szkic: ${wpis.slug} – ${wpis.tytul}`);
  if (SUCHY) return;
  fs.mkdirSync(KATALOG, { recursive: true });
  fs.writeFileSync(path.join(KATALOG, `${wpis.slug}.json`), JSON.stringify(wpis, null, 2) + '\n');
}

// ───────────── karty modeli (do linków i liczb z CEPiK) ─────────────
const KARTY = fs
  .readdirSync(MODELE)
  .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
  .map((f) => {
    const m = JSON.parse(fs.readFileSync(path.join(MODELE, f), 'utf8'));
    return { slug: m.slug, marka: m.marka, model: m.model, generacja: m.generacja || '', rodzina: !!m.wszystkieGeneracje, liczba: m.cepik?.liczbaWPolsce || 0 };
  });
const proste = (t) => ` ${norm(t).replace(/[^a-z0-9]+/g, ' ').trim()} `;
/** Karta modelu dla pary marka + nazwa modelu (preferuje kartę zbiorczą wszystkich generacji) */
function kartaDla(marka, nazwa) {
  const nm = proste(nazwa);
  const pas = KARTY.filter((k) => proste(k.marka) === proste(marka) && proste(k.model).trim() && nm.includes(proste(k.model)));
  if (!pas.length) return undefined;
  pas.sort((a, b) => Number(b.rodzina) - Number(a.rodzina) || proste(b.model).length - proste(a.model).length || b.liczba - a.liczba);
  return pas[0].slug;
}
/** Kandydaci kart wspomnianych w tekście (dla modelu językowego) */
function kandydaci(tekst) {
  const t = proste(tekst);
  return KARTY.filter((k) => k.rodzina && t.includes(proste(k.model)) && (t.includes(proste(k.marka)) || norm(k.model).length >= 4))
    .sort((a, b) => b.liczba - a.liczba)
    .slice(0, 30);
}

// ───────────── model językowy ─────────────
const ZASADY = `Piszesz dla serwisu MotoRaport (moto-raport.pl) – atlas aut w Polsce i poradniki dla kierowców. Czytelnik to zwykły kierowca, nie ekspert.
Twarde zasady (prawo autorskie i wytyczne Google):
- Pisz WŁASNYMI słowami. Nie kopiuj zdań ze źródła i nie tłumacz go zdanie po zdaniu. Najwyżej jeden krótki cytat w cudzysłowie, jeśli jest naprawdę ważny.
- Opieraj się WYŁĄCZNIE na faktach ze źródła. Nie dopisuj cen, dat, liczb, parametrów ani opinii, których tam nie ma. Jeśli czegoś nie wiadomo – nie zgaduj.
- Dodaj wartość: wyjaśnij prostym językiem, co to oznacza dla kierowcy w Polsce i co ma zrobić.
- Język polski, krótkie zdania, bez marketingowego zachwytu i bez wykrzykników.
- Markdown: sekcje z nagłówkami ## , listy „- ”, **pogrubienia**. Bez nagłówka # i bez tytułu na początku.
Odpowiedz WYŁĄCZNIE poprawnym JSON-em, bez \`\`\`.`;

async function ai(system, tresc, maxTokens = 4000) {
  const r = await fetch(`${AI}/v1/messages`, {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: tresc }] })
  });
  if (!r.ok) throw new Error(`Model językowy: ${r.status} ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  const tekst = (j.content || []).map((c) => c.text || '').join('');
  return JSON.parse(tekst.slice(tekst.indexOf('{'), tekst.lastIndexOf('}') + 1));
}
const przytnij = (t, n) => (t || '').trim().slice(0, n);

// ───────────── 1. Safety Gate: akcje serwisowe ─────────────
const KRAJE = { Austria: 'Austria', Belgium: 'Belgia', Bulgaria: 'Bułgaria', Croatia: 'Chorwacja', Cyprus: 'Cypr', Czechia: 'Czechy', 'Czech Republic': 'Czechy', Denmark: 'Dania', Estonia: 'Estonia', Finland: 'Finlandia', France: 'Francja', Germany: 'Niemcy', Greece: 'Grecja', Hungary: 'Węgry', Iceland: 'Islandia', Ireland: 'Irlandia', Italy: 'Włochy', Latvia: 'Łotwa', Liechtenstein: 'Liechtenstein', Lithuania: 'Litwa', Luxembourg: 'Luksemburg', Malta: 'Malta', Netherlands: 'Holandia', Norway: 'Norwegia', Poland: 'Polska', Portugal: 'Portugalia', Romania: 'Rumunia', Slovakia: 'Słowacja', Slovenia: 'Słowenia', Spain: 'Hiszpania', Sweden: 'Szwecja' };
const WYKLUCZ_PRODUKT = /truck|lorry|bus|coach|trailer|tractor|heavy|bicycle|e-bike|scooter|quad|caravan/i;
async function akcjeSerwisowe() {
  const sg = KONFIG.safetyGate;
  const wpisRaportu = { nazwa: 'Safety Gate', ok: true, nowe: 0, szkice: 0 };
  raport.zrodla.push(wpisRaportu);
  if (!sg?.wlaczony) return (wpisRaportu.blad = 'wyłączone w konfiguracji');
  try {
    const lista = await pobierz(sg.lista);
    const tygodnie = [...lista.matchAll(/<weeklyReport>([\s\S]*?)<\/weeklyReport>/g)]
      .map((m) => ({ ref: tag(m[1], 'reference'), data: tag(m[1], 'publicationDate'), rok: tag(m[1], 'year'), tydzien: tag(m[1], 'week'), url: tag(m[1], 'URL') }))
      .filter((t) => t.ref && t.url)
      .map((t) => ({ ...t, iso: t.data.split('/').reverse().join('-') }))
      .sort((a, b) => b.iso.localeCompare(a.iso))
      .slice(0, KONFIG.limity.akcjeTygodni);
    for (const t of tygodnie) {
      const klucz = `sg:${t.ref}`;
      if (juz.has(klucz)) continue;
      wpisRaportu.nowe++;
      const xml = await pobierz(t.url);
      const pozycje = [...xml.matchAll(/<notifications[^>]*>([\s\S]*?)<\/notifications>/g)]
        .map((m) => m[1])
        .filter((n) => /motor vehicles/i.test(tag(n, 'category')) && !WYKLUCZ_PRODUKT.test(tag(n, 'product')))
        .map((n) => ({
          marka: tag(n, 'brand'),
          model: tag(n, 'name'),
          produkt: tag(n, 'product'),
          problem: tag(n, 'danger'),
          zalecenie: tag(n, 'measures'),
          produkcja: tag(n, 'productionDates'),
          kodAkcji: tag(n, 'companyRecallCode'),
          poziom: tag(n, 'level'),
          kraj: tag(n, 'notifyingCountry'),
          link: tag(n, 'reference')
        }))
        .filter((p) => p.marka && p.model);
      if (!pozycje.length) {
        log(`  ${t.ref}: brak wezwań aut osobowych`);
        oznacz(klucz);
        continue;
      }
      let wynik = null;
      if (process.env.ANTHROPIC_API_KEY) {
        const system = `${ZASADY}
Zadanie: z listy wezwań do serwisu (dane Safety Gate, po angielsku) przygotuj polski wpis.
Format: {"tytul": "do 70 znaków, z tygodniem i 2–4 najważniejszymi markami", "lead": "1–2 zdania, do 200 znaków", "tresc": "markdown 120–250 słów: krótko co to za zestawienie, jakie usterki się powtarzają, jak sprawdzić, czy auto jest objęte akcją (VIN, autoryzowany serwis, naprawa bezpłatna). Bez listy aut – lista jest pokazywana osobno.", "pozycje": [{"i": numer, "problem": "1–2 zdania po polsku, prosto", "zalecenie": "1 zdanie po polsku"}]}
Tłumacz wiernie sens, ale prostym językiem. Nie dopisuj niczego, czego nie ma w danych.`;
        const dane = pozycje.map((p, i) => `#${i} ${p.marka} ${p.model} (${p.produkt}); produkcja: ${p.produkcja || '?'}; zagrożenie: ${p.problem}; działania: ${p.zalecenie}`).join('\n');
        wynik = await ai(system, `TYDZIEŃ: ${t.tydzien}/${t.rok} (raport ${t.ref}, opublikowany ${t.data})\n\n${dane}`, 6000);
      }
      const tlum = new Map((wynik?.pozycje || []).map((p) => [Number(p.i), p]));
      const marki = [...new Set(pozycje.map((p) => p.marka))];
      const wpis = {
        slug: wolnySlug(`akcje-serwisowe-${t.rok}-tydzien-${t.tydzien}`),
        typ: 'akcje-serwisowe',
        tytul: przytnij(wynik?.tytul, 90) || `Akcje serwisowe aut w UE – tydzień ${t.tydzien}/${t.rok}: ${marki.slice(0, 4).join(', ')}`,
        lead: przytnij(wynik?.lead, 260) || `Wezwania samochodów do serwisu zgłoszone w unijnym systemie Safety Gate w ${t.tydzien}. tygodniu ${t.rok} r. – ${pozycje.length} pozycji.`,
        data: t.iso || dzis(),
        tresc: wynik?.tresc || '## Do uzupełnienia\n\nSzkic bez tekstu – brak klucza modelu językowego. Opisy usterek poniżej są po angielsku: przetłumacz je w panelu przed publikacją.',
        zrodla: [
          { nazwa: `Safety Gate – raport tygodniowy ${t.ref} (Komisja Europejska)`, url: 'https://ec.europa.eu/safety-gate-alerts/screen/webReport' },
          ...pozycje.slice(0, 1).map((p) => ({ nazwa: 'Przykładowe zgłoszenie w Safety Gate', url: p.link }))
        ],
        marki,
        modele: [...new Set(pozycje.map((p) => kartaDla(p.marka, p.model)).filter(Boolean))],
        pozycje: pozycje.map((p, i) => ({
          marka: p.marka,
          model: p.model,
          problem: tlum.get(i)?.problem || p.problem,
          zalecenie: tlum.get(i)?.zalecenie || p.zalecenie,
          ...(p.produkcja ? { produkcja: p.produkcja } : {}),
          ...(p.kodAkcji ? { kodAkcji: p.kodAkcji } : {}),
          ...(p.poziom ? { poziom: p.poziom === 'Serious risk' ? 'poważne ryzyko' : p.poziom } : {}),
          ...(p.kraj ? { kraj: KRAJE[p.kraj] || p.kraj } : {}),
          link: p.link,
          ...(kartaDla(p.marka, p.model) ? { karta: kartaDla(p.marka, p.model) } : {})
        })),
        status: 'szkic',
        wygenerowano: new Date().toISOString(),
        ...(wynik ? {} : { bezAI: true })
      };
      zapisz(wpis);
      wpisRaportu.szkice++;
      oznacz(klucz);
    }
  } catch (e) {
    wpisRaportu.ok = false;
    wpisRaportu.blad = String(e.message || e).slice(0, 300);
    log(`  ✗ Safety Gate: ${wpisRaportu.blad}`);
  }
}

// ───────────── wspólne: artykuł z jednego źródła ─────────────
async function napiszZeZrodla({ typ, zrodlo, tytulZrodla, url, tekst, data }) {
  const kand = kandydaci(`${tytulZrodla} ${tekst.slice(0, 4000)}`);
  const system =
    typ === 'komunikaty'
      ? `${ZASADY}
Zadanie: oceń komunikat urzędu i – jeśli jest ważny dla kierowców samochodów osobowych w Polsce – napisz omówienie.
Ważne: przepisy dla kierowców, mandaty, punkty, prawo jazdy, rejestracja i dokumenty auta, mObywatel/CEPiK, przeglądy, OC, opłaty drogowe i winiety, otwarcie nowych dróg i ważne utrudnienia, kampanie bezpieczeństwa z konkretnymi radami.
NIEważne: kolej, lotnictwo, żegluga, gospodarka wodna, nominacje, spotkania i konferencje bez konkretów dla kierowców, podpisanie umów na budowę bez terminów otwarcia, uroczystości.
Format: {"istotne": true|false, "powod": "krótko", "tytul": "do 70 znaków, konkretny", "lead": "1–2 zdania, do 200 znaków", "tresc": "markdown 200–450 słów: co się zmienia, od kiedy, kogo dotyczy, co zrobić", "modele": []}`
      : `${ZASADY}
Zadanie: oceń informację prasową producenta i – jeśli dotyczy nowego modelu, nowej wersji lub silnika, cennika, wejścia modelu na rynek (najlepiej polski) albo istotnej zmiany wyposażenia – napisz krótki artykuł.
NIEistotne: wyniki finansowe, nominacje, sport i rajdy, sponsoring, wydarzenia, lifestyle, historia marki, akcje wizerunkowe.
Podawaj tylko dane ze źródła (ceny, moc, zasięg, daty). Jeśli źródło jest po angielsku – napisz po polsku i zaznacz, jeśli informacja dotyczy innego rynku niż Polska.
Format: {"istotne": true|false, "powod": "krótko", "tytul": "do 70 znaków, z marką i modelem", "lead": "1–2 zdania, do 200 znaków", "tresc": "markdown 200–400 słów: co to za auto lub zmiana, najważniejsze fakty, dla kogo, co wiadomo o Polsce", "modele": ["slugi WYŁĄCZNIE z listy kandydatów, tylko auta, których dotyczy tekst"]}`;
  const wynik = await ai(
    system,
    `ŹRÓDŁO: ${zrodlo.nazwa}\nADRES: ${url}\nDATA: ${data || 'nieznana'}\nTYTUŁ: ${tytulZrodla}\nKANDYDACI KART MODELI (slug: nazwa): ${kand.map((k) => `${k.slug}: ${k.marka} ${k.model}`).join('; ') || 'brak'}\n\nTEKST ŹRÓDŁA:\n${tekst}`
  );
  if (!wynik?.istotne) {
    log(`  – pomijam (${przytnij(wynik?.powod, 80) || 'nieistotne'}): ${tytulZrodla}`);
    return false;
  }
  const dozwoloneKarty = new Set(kand.map((k) => k.slug));
  zapisz({
    slug: wolnySlug(wynik.tytul || tytulZrodla),
    typ,
    tytul: przytnij(wynik.tytul, 90) || tytulZrodla,
    lead: przytnij(wynik.lead, 260),
    data: data || dzis(),
    tresc: wynik.tresc || '',
    zrodla: [{ nazwa: `${zrodlo.nazwa}: ${przytnij(tytulZrodla, 120)}`, url }],
    ...(zrodlo.licencja ? { licencja: zrodlo.licencja } : {}),
    modele: (wynik.modele || []).filter((s) => dozwoloneKarty.has(s)),
    status: 'szkic',
    wygenerowano: new Date().toISOString()
  });
  return true;
}

// ───────────── 2. Komunikaty z gov.pl ─────────────
const NIE_ARTYKUL = /\/(aktualnosci|wiadomosci|wydarzenia|komunikaty|kontakt|ministerstwo|o-nas|mapa-strony|dostepnosc|deklaracja-dostepnosci|bip|rss)\/?$/;
async function komunikaty() {
  if (!process.env.ANTHROPIC_API_KEY) {
    raport.zrodla.push({ nazwa: 'Komunikaty (gov.pl)', ok: false, nowe: 0, szkice: 0, blad: 'brak klucza ANTHROPIC_API_KEY – pomijam' });
    return;
  }
  const slowa = (KONFIG.slowaKomunikaty || []).map(norm);
  let szkiceRazem = 0;
  for (const z of KONFIG.komunikaty || []) {
    const r = { nazwa: z.nazwa, ok: true, nowe: 0, szkice: 0 };
    raport.zrodla.push(r);
    try {
      const html = await pobierz(z.lista);
      const linki = [
        ...new Set(
          [...html.matchAll(/href=["']([^"'#?]+)["']/g)]
            .map((m) => new URL(m[1], z.lista).toString().replace(/\/$/, ''))
            .filter((u) => u.startsWith(z.prefiks) && !u.slice(z.prefiks.length).includes('/') && u.length > z.prefiks.length + 8 && !NIE_ARTYKUL.test(u + '/'))
        )
      ].slice(0, 12);
      for (const url of linki) {
        if (szkiceRazem >= KONFIG.limity.komunikaty) break;
        const klucz = `url:${url}`;
        if (juz.has(klucz)) continue;
        r.nowe++;
        const strona = await pobierz(url);
        const tytul = meta(strona, 'og:title') || bezTagow(strona.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || '') || url;
        const tekst = trescStrony(strona);
        const data = dataZTekstu(tekst);
        oznacz(klucz);
        const maxWiek = new Date(Date.now() - KONFIG.limity.maksWiekDni * 864e5).toISOString().slice(0, 10);
        if (data && data < maxWiek) continue;
        if (!slowa.some((s) => norm(`${tytul} ${tekst.slice(0, 3000)}`).includes(s))) {
          log(`  – pomijam (brak słów o kierowcach): ${tytul}`);
          continue;
        }
        if (await napiszZeZrodla({ typ: 'komunikaty', zrodlo: z, tytulZrodla: tytul, url, tekst, data })) {
          r.szkice++;
          szkiceRazem++;
        }
      }
    } catch (e) {
      r.ok = false;
      r.blad = String(e.message || e).slice(0, 300);
      log(`  ✗ ${z.nazwa}: ${r.blad}`);
    }
  }
}

// ───────────── 3. Premiery z RSS biur prasowych ─────────────
function elementyRss(xml) {
  const rss = [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/g)].map((m) => ({ tytul: tag(m[1], 'title'), link: tag(m[1], 'link') || tag(m[1], 'guid'), data: tag(m[1], 'pubDate') || tag(m[1], 'dc:date'), opis: tag(m[1], 'description') }));
  const atom = [...xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/g)].map((m) => ({
    tytul: tag(m[1], 'title'),
    link: m[1].match(/<link[^>]*href=["']([^"']+)["']/)?.[1] || '',
    data: tag(m[1], 'updated') || tag(m[1], 'published'),
    opis: tag(m[1], 'summary')
  }));
  return [...rss, ...atom]
    .filter((e) => e.tytul && e.link)
    .map((e) => {
      const d = new Date(e.data);
      return { ...e, iso: Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10) };
    });
}
async function premiery() {
  if (!process.env.ANTHROPIC_API_KEY) {
    raport.zrodla.push({ nazwa: 'Premiery (biura prasowe)', ok: false, nowe: 0, szkice: 0, blad: 'brak klucza ANTHROPIC_API_KEY – pomijam' });
    return;
  }
  const maxWiek = new Date(Date.now() - KONFIG.limity.maksWiekDni * 864e5).toISOString().slice(0, 10);
  // najpierw zbierz nowe pozycje ze wszystkich kanałów, potem pisz od najnowszych
  const kolejka = [];
  for (const z of KONFIG.prasa || []) {
    const r = { nazwa: z.nazwa, ok: true, nowe: 0, szkice: 0 };
    raport.zrodla.push(r);
    try {
      const nowe = elementyRss(await pobierz(z.rss)).filter((e) => !juz.has(`url:${e.link}`) && (!e.iso || e.iso >= maxWiek));
      r.nowe = nowe.length;
      kolejka.push(...nowe.map((e) => ({ ...e, z, r })));
    } catch (e) {
      r.ok = false;
      r.blad = String(e.message || e).slice(0, 300);
      log(`  ✗ ${z.nazwa}: ${r.blad}`);
    }
  }
  kolejka.sort((a, b) => (b.iso || '').localeCompare(a.iso || ''));
  let szkice = 0;
  for (const e of kolejka) {
    if (szkice >= KONFIG.limity.premiery) break;
    oznacz(`url:${e.link}`);
    let tekst = bezTagow(e.opis);
    try {
      const strona = await pobierz(e.link);
      const t = trescStrony(strona);
      if (t.length > tekst.length) tekst = t;
    } catch (err) {
      log(`  (nie pobrano pełnej treści: ${err.message})`);
    }
    if (tekst.length < 300) continue;
    try {
      if (await napiszZeZrodla({ typ: 'premiery', zrodlo: e.z, tytulZrodla: e.tytul, url: e.link, tekst, data: e.iso })) {
        szkice++;
        e.r.szkice++;
      }
    } catch (err) {
      e.r.ok = false;
      e.r.blad = String(err.message || err).slice(0, 300);
    }
  }
}

async function main() {
  log(`Aktualności – ${dzis()}${SUCHY ? ' (próba, bez zapisu)' : ''}${process.env.ANTHROPIC_API_KEY ? '' : ' – BEZ klucza modelu językowego'}`);
  if (!TYLKO || TYLKO === 'akcje') {
    log('1. Akcje serwisowe (Safety Gate)');
    await akcjeSerwisowe();
  }
  if (!TYLKO || TYLKO === 'komunikaty') {
    log('2. Komunikaty (gov.pl)');
    await komunikaty();
  }
  if (!TYLKO || TYLKO === 'premiery') {
    log('3. Premiery (biura prasowe)');
    await premiery();
  }
  if (!SUCHY) {
    fs.mkdirSync(KATALOG, { recursive: true });
    stan.klucze = stan.klucze.slice(-3000);
    fs.writeFileSync(PRZETWORZONE, JSON.stringify(stan, null, 2) + '\n');
    fs.writeFileSync(RAPORT, JSON.stringify(raport, null, 2) + '\n');
  }
  log('Gotowe.', JSON.stringify(raport.zrodla.map((z) => `${z.nazwa}: ${z.ok ? 'ok' : 'błąd'} nowe=${z.nowe} szkice=${z.szkice}`)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
