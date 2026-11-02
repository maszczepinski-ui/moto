#!/usr/bin/env node
// =====================================================================
// Nowe filmy z kanału YouTube → szkice artykułów (data/wpisy/<slug>.json)
//
// 1. Sprawdza ostatnie filmy kanału (YouTube Data API, klucz YT_API_KEY, kanał YT_CHANNEL_ID).
// 2. Szuka transkrypcji w data/transkrypcje/<numer-filmu>.txt / .srt / .vtt (wgrywasz ją w panelu admina
//    albo pobierasz z YouTube Studio → Napisy → Pobierz).
// 3. Z transkrypcji model językowy (Claude, klucz ANTHROPIC_API_KEY) pisze szkic artykułu: nagłówki, rozdziały,
//    FAQ, dobiera karty modeli z bazy, produkty i rodzaj bloku z linkami partnerskimi.
// 4. Zapisuje szkic ze statusem „szkic” – na stronie pojawi się dopiero po Twoim zatwierdzeniu w panelu.
//
// Bez transkrypcji powstaje „pusty” szkic (tytuł, opis, rozdziały z opisu filmu) z informacją, że czeka na transkrypcję.
// Uruchamia go automat .github/workflows/nowe-filmy.yml (codziennie i przyciskiem w panelu).
//
// Opcje: --film <numer>   tylko ten film (np. po wgraniu transkrypcji; szkic zostanie napisany od nowa)
//        --max 10         ile ostatnich filmów kanału sprawdzić
// =====================================================================
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const WPISY = path.join(ROOT, 'data', 'wpisy');
const TRANS = path.join(ROOT, 'data', 'transkrypcje');
const MODELE = path.join(ROOT, 'data', 'models');
const PRODUKTY = path.join(ROOT, 'data', 'produkty.json');
const YT = process.env.YT_API || 'https://www.googleapis.com/youtube/v3';
const AI = process.env.ANTHROPIC_API || 'https://api.anthropic.com';
const MODEL = process.env.MODEL || 'claude-sonnet-5-5';
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : d;
};

const norm = (t) =>
  (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l');
const slugify = (t) => norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '');

async function yt(sciezka, params) {
  const u = new URL(`${YT}/${sciezka}`);
  for (const [k, v] of Object.entries({ ...params, key: process.env.YT_API_KEY })) u.searchParams.set(k, v);
  const r = await fetch(u);
  if (!r.ok) throw new Error(`YouTube API ${sciezka}: ${r.status} ${await r.text()}`);
  return r.json();
}

/** PT1H2M3S → sekundy */
const czasTrwania = (d) => {
  const m = (d || '').match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
};
const mmss = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(x).padStart(2, '0')}`;
};

/** Rozdziały z opisu filmu: linie zaczynające się od 0:00, 1:23, 1:02:03 */
function rozdzialyZOpisu(opis) {
  return (opis || '')
    .split('\n')
    .map((l) => l.trim().match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)$/))
    .filter(Boolean)
    .map((m) => ({ czas: m[1], tytul: m[2].trim() }));
}

/** Transkrypcja jako tekst z co ~30 s znacznikami czasu [m:ss] (model użyje ich do rozdziałów) */
function wczytajTranskrypcje(id) {
  for (const ext of ['txt', 'srt', 'vtt']) {
    const plik = path.join(TRANS, `${id}.${ext}`);
    if (!fs.existsSync(plik)) continue;
    const t = fs.readFileSync(plik, 'utf8').replace(/\r/g, '');
    if (ext === 'txt' && !/-->/.test(t)) return t.trim();
    // SRT / VTT
    const wynik = [];
    let ostatni = -999;
    for (const blok of t.split(/\n\s*\n/)) {
      const m = blok.match(/(\d{1,2}):(\d{2}):(\d{2})[.,]\d+\s*-->/);
      if (!m) continue;
      const sek = +m[1] * 3600 + +m[2] * 60 + +m[3];
      const tekst = blok
        .split('\n')
        .filter((l) => l && !/-->/.test(l) && !/^\d+$/.test(l.trim()) && !/^WEBVTT/.test(l))
        .join(' ')
        .replace(/<[^>]+>/g, '')
        .trim();
      if (!tekst) continue;
      if (sek - ostatni >= 30) {
        wynik.push(`\n[${mmss(sek)}] ${tekst}`);
        ostatni = sek;
      } else wynik.push(tekst);
    }
    return wynik.join(' ').trim();
  }
  return '';
}

function karty() {
  return fs
    .readdirSync(MODELE)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .map((f) => {
      const m = JSON.parse(fs.readFileSync(path.join(MODELE, f), 'utf8'));
      return { slug: m.slug, nazwa: `${m.marka} ${m.model} ${m.generacja || ''}`.trim(), marka: m.marka, model: m.model, generacja: m.generacja || '', lata: m.lataProdukcji, liczba: m.cepik?.liczbaWPolsce || 0 };
    });
}

/** Karty, których marka lub model padają w tekście – lista kandydatów dla modelu językowego */
function kandydaci(tekst, wszystkie) {
  const t = ` ${norm(tekst).replace(/[^a-z0-9]+/g, ' ')} `;
  const zawiera = (f) => f && t.includes(` ${norm(f).replace(/[^a-z0-9]+/g, ' ').trim()} `);
  return wszystkie
    .filter((k) => zawiera(k.model) && (zawiera(k.marka) || norm(k.model).length >= 4))
    .sort((a, b) => Number(zawiera(b.generacja)) - Number(zawiera(a.generacja)) || b.liczba - a.liczba)
    .slice(0, 40);
}

const SYSTEM = `Jesteś redaktorem serwisu MotoFormat (atlas aut w Polsce + kanał YouTube). Na podstawie transkrypcji filmu piszesz artykuł po polsku, który ma wartość także dla kogoś, kto filmu nie obejrzy.
Zasady:
- Opieraj się WYŁĄCZNIE na tym, co pada w filmie. Nie dopisuj faktów, cen, liczb ani opinii, których nie ma w transkrypcji. Liczby z CEPiK (ile aut jest w Polsce) strona wstawia sama – nie pisz ich.
- To nie jest przepisana transkrypcja: uporządkuj treść, usuń powtórzenia i wtrącenia, zachowaj konkrety, porady i wnioski autora. Pisz w pierwszej osobie liczby mnogiej („sprawdziliśmy”), prosto i konkretnie.
- Struktura: 3–7 sekcji z nagłówkami ## (opcjonalnie ### w środku), listy tam, gdzie są kroki lub wyliczenia, **pogrubienia** dla kluczowych wniosków. Bez nagłówka # i bez tytułu na początku. 500–1200 słów zależnie od ilości treści.
- Nazwy modeli pisz pełne (np. „Volkswagen Passat B6”), żeby czytelnik i wyszukiwarka wiedzieli, o czym mowa.
- Rozdziały: 4–12 pozycji, czasy z oznaczeń [m:ss] w transkrypcji, pierwszy rozdział od 0:00.
- FAQ: 3–5 pytań, które naprawdę może zadać widz, z odpowiedziami wynikającymi z filmu (1–3 zdania).
Odpowiedz WYŁĄCZNIE poprawnym JSON-em (bez \`\`\`), w formacie:
{"tytul": "tytuł artykułu do 70 znaków, z nazwą auta lub tematem", "lead": "1–2 zdania zachęty i streszczenia, do 200 znaków", "kategoria": "test|porada|zakup|detailing|inne", "konwersja": "zakup|ubezpieczenie|detailing|diagnostyka|brak", "modele": ["slugi WYŁĄCZNIE z listy kandydatów, tylko auta faktycznie omawiane"], "produkty": ["id WYŁĄCZNIE z listy produktów, tylko pokazane w filmie"], "rozdzialy": [{"czas": "0:00", "tytul": "…"}], "tresc": "markdown", "faq": [{"pytanie": "…", "odpowiedz": "…"}]}
Konwersja: „zakup” – film o kupowaniu / sprawdzaniu używanego auta lub test auta, które ludzie kupują z drugiej ręki; „ubezpieczenie” – o OC/AC; „detailing” – o pielęgnacji i kosmetykach; „diagnostyka” – o usterkach, błędach, naprawach; „brak” – gdy żaden nie pasuje.`;

async function napiszArtykul({ film, transkrypcja, kand, produkty }) {
  const tresc = [
    `TYTUŁ FILMU: ${film.tytul}`,
    `OPIS FILMU: ${film.opis.slice(0, 2000)}`,
    `KANDYDACI (karty modeli w bazie – slug: nazwa, lata): ${kand.map((k) => `${k.slug}: ${k.nazwa} (${k.lata})`).join('; ') || 'brak'}`,
    `PRODUKTY (id: nazwa – kategoria): ${produkty.map((p) => `${p.id}: ${p.nazwa} – ${p.kategoria}`).join('; ') || 'brak'}`,
    `TRANSKRYPCJA:\n${transkrypcja.slice(0, 120000)}`
  ].join('\n\n');
  const r = await fetch(`${AI}/v1/messages`, {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, system: SYSTEM, messages: [{ role: 'user', content: tresc }] })
  });
  if (!r.ok) throw new Error(`Model językowy: ${r.status} ${await r.text()}`);
  const j = await r.json();
  const tekst = (j.content || []).map((c) => c.text || '').join('');
  const json = tekst.slice(tekst.indexOf('{'), tekst.lastIndexOf('}') + 1);
  return JSON.parse(json);
}

const KATEGORIE = ['test', 'porada', 'zakup', 'detailing', 'inne'];
const KONWERSJE = ['zakup', 'ubezpieczenie', 'detailing', 'diagnostyka', 'brak'];

async function main() {
  if (!process.env.YT_API_KEY) throw new Error('Brak klucza YT_API_KEY (instrukcja w README → „Artykuły z filmów”).');
  fs.mkdirSync(WPISY, { recursive: true });
  const istniejace = fs
    .readdirSync(WPISY)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(WPISY, f), 'utf8')));
  const poFilmie = new Map(istniejace.map((w) => [w.youtubeId, w]));

  let ids;
  const jeden = arg('film');
  if (jeden) ids = [jeden];
  else {
    if (!process.env.YT_CHANNEL_ID) throw new Error('Brak YT_CHANNEL_ID – numeru kanału (zaczyna się od UC…).');
    const ch = await yt('channels', { part: 'contentDetails', id: process.env.YT_CHANNEL_ID });
    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) throw new Error('Nie znaleziono kanału – sprawdź YT_CHANNEL_ID.');
    const pl = await yt('playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: String(Number(arg('max', 10))) });
    ids = (pl.items || []).map((x) => x.contentDetails.videoId);
  }
  if (!ids.length) return console.log('Brak filmów.');
  const v = await yt('videos', { part: 'snippet,contentDetails', id: ids.join(',') });

  const wszystkieKarty = karty();
  const produkty = fs.existsSync(PRODUKTY) ? JSON.parse(fs.readFileSync(PRODUKTY, 'utf8')).produkty.filter((p) => p.aktywny) : [];
  let zmiany = 0;

  for (const it of v.items || []) {
    const film = {
      id: it.id,
      tytul: it.snippet.title,
      opis: it.snippet.description || '',
      data: (it.snippet.publishedAt || '').slice(0, 10),
      sek: czasTrwania(it.contentDetails?.duration)
    };
    const stary = poFilmie.get(film.id);
    if (stary && stary.status === 'opublikowany') continue; // opublikowanych nie ruszamy
    if (!jeden && film.sek && film.sek < 120) continue; // Shorts pomijamy
    const transkrypcja = wczytajTranskrypcje(film.id);
    if (stary && !jeden && (!transkrypcja || !stary.brakTranskrypcji)) continue; // nic nowego

    const zajete = new Set(istniejace.filter((w) => w.youtubeId !== film.id).map((w) => w.slug));
    let slug = stary?.slug || slugify(film.tytul) || film.id;
    while (zajete.has(slug)) slug += '-2';
    const kand = kandydaci(`${film.tytul}\n${film.opis}\n${transkrypcja.slice(0, 20000)}`, wszystkieKarty);

    let wpis = {
      slug,
      youtubeId: film.id,
      tytul: stary?.tytul || film.tytul,
      lead: stary?.lead || film.opis.split('\n').find((l) => l.trim().length > 30)?.trim().slice(0, 200) || film.tytul,
      opublikowano: film.data,
      kategoria: stary?.kategoria || 'inne',
      modele: stary?.modele?.length ? stary.modele : kand.slice(0, 2).map((k) => k.slug),
      produkty: stary?.produkty || [],
      konwersja: stary?.konwersja || 'brak',
      rozdzialy: stary?.rozdzialy?.length ? stary.rozdzialy : rozdzialyZOpisu(film.opis),
      tresc: stary?.tresc || '',
      faq: stary?.faq || [],
      status: 'szkic',
      brakTranskrypcji: !transkrypcja,
      wygenerowano: new Date().toISOString().slice(0, 10)
    };

    if (transkrypcja && process.env.ANTHROPIC_API_KEY) {
      try {
        const a = await napiszArtykul({ film, transkrypcja, kand, produkty });
        const dozwoloneKarty = new Set(kand.map((k) => k.slug));
        const dozwoloneProdukty = new Set(produkty.map((p) => p.id));
        wpis = {
          ...wpis,
          tytul: String(a.tytul || wpis.tytul).slice(0, 110),
          lead: String(a.lead || wpis.lead).slice(0, 300),
          kategoria: KATEGORIE.includes(a.kategoria) ? a.kategoria : wpis.kategoria,
          konwersja: KONWERSJE.includes(a.konwersja) ? a.konwersja : wpis.konwersja,
          modele: (a.modele || []).filter((s) => dozwoloneKarty.has(s)).slice(0, 6),
          produkty: (a.produkty || []).filter((s) => dozwoloneProdukty.has(s)),
          rozdzialy: wpis.rozdzialy.length ? wpis.rozdzialy : (a.rozdzialy || []).filter((r) => /^\d{1,2}:\d{2}(:\d{2})?$/.test(r.czas) && r.tytul),
          tresc: String(a.tresc || '').replace(/^# .*\n/, '').trim(),
          faq: (a.faq || []).filter((f) => f.pytanie && f.odpowiedz).slice(0, 6),
          brakTranskrypcji: false
        };
        console.log(`✓ Szkic artykułu: ${wpis.tytul}`);
      } catch (e) {
        console.log(`! Nie udało się napisać artykułu do „${film.tytul}”: ${e.message}`);
      }
    } else if (transkrypcja) console.log(`! Jest transkrypcja „${film.tytul}”, ale brak klucza ANTHROPIC_API_KEY – zapisuję szkic bez treści.`);
    else console.log(`• Nowy film bez transkrypcji: ${film.tytul} – szkic czeka na transkrypcję.`);

    if (stary && stary.slug !== wpis.slug) fs.rmSync(path.join(WPISY, `${stary.slug}.json`), { force: true });
    fs.writeFileSync(path.join(WPISY, `${wpis.slug}.json`), JSON.stringify(wpis, null, 2) + '\n');
    istniejace.push(wpis);
    zmiany++;
  }
  console.log(zmiany ? `Zapisano szkiców: ${zmiany}.` : 'Brak nowych filmów do opracowania.');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
