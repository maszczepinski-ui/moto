#!/usr/bin/env node
// =====================================================================
// Generator opisów modeli (szkice do przejrzenia w panelu admina).
//
// Dla każdej karty z data/models/ wysyła do modelu językowego (API Anthropic) dane techniczne
// i liczby z CEPiK, a odpowiedź zapisuje jako data/opisy/<slug>.json z trzema sekcjami:
//   • eksploatacja  – „Eksploatacja i newralgiczne punkty”
//   • koszty        – „Zestawienie kosztów serwisu”
//   • podsumowanie  – „Podsumowanie rynkowe”
// Opis pojawia się na stronie dopiero po zatwierdzeniu w panelu (zakładka „Opisy”).
//
// Użycie:
//   ANTHROPIC_API_KEY=sk-ant-... node scripts/generuj-opisy.mjs --limit 100
//   opcje: --limit N (ile kart, wg popularności), --od <slug> (zacznij od tej karty),
//          --tylko <slug,slug> (wybrane karty), --nadpisz (wygeneruj ponownie istniejące),
//          --model <nazwa> (domyślnie claude-sonnet-5-5), --przerwa <ms> (między zapytaniami, domyślnie 1500)
// Przerwanie (Ctrl+C) jest bezpieczne – po ponownym uruchomieniu skrypt pomija gotowe pliki
// i zaczyna od ostatniej niezapisanej karty (postęp w data/opisy/.postep.json).
// =====================================================================
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const MODELE = path.join(ROOT, 'data', 'models');
const OPISY = path.join(ROOT, 'data', 'opisy');
const POSTEP = path.join(OPISY, '.postep.json');

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] ?? true : d;
};
const LIMIT = Number(arg('limit', 100));
const OD = arg('od', '');
const TYLKO = String(arg('tylko', '') || '').split(',').filter(Boolean);
const NADPISZ = process.argv.includes('--nadpisz');
const MODEL = arg('model', 'claude-sonnet-5-5');
const PRZERWA = Number(arg('przerwa', 1500));
const KLUCZ = process.env.ANTHROPIC_API_KEY;

const ZAKAZANE = [
  'ponadczasowy design', 'ponadczasowy', 'idealny wybór', 'cieszy się uznaniem', 'niezawodny towarzysz', 'nie bez powodu',
  'prawdziwa legenda', 'kultowy', 'jak żaden inny', 'doskonały wybór', 'świetny wybór', 'zachwyca', 'bezkonkurencyjny', 'perełka'
];

const SYSTEM = `Jesteś redaktorem technicznym polskiego serwisu motoryzacyjnego MotoFormat. Piszesz dla osób, które kupują używane auto
albo już nim jeżdżą i chcą konkretów. Piszesz po polsku, prostym językiem, bez żargonu bez wyjaśnienia.

ZASADY:
- Tylko fakty techniczne, które są powszechnie znane i sprawdzalne dla tego modelu/generacji (np. znane usterki konkretnych silników,
  skrzyń, zawieszenia, korozja w konkretnych miejscach). Jeśli czegoś nie jesteś pewien – pomiń to. Nie zgaduj kodów silników ani liczb.
- Zakaz marketingowych ogólników. NIE używaj słów i zwrotów: ${ZAKAZANE.map((z) => `„${z}”`).join(', ')}, ani podobnych.
- Krótkie akapity (max 3 zdania) i listy punktowane z myślnikiem „- ”. Pogrubienie **tak** tylko dla nazw silników/podzespołów.
- Koszty podawaj jako orientacyjne widełki w złotych dla polskiego rynku części zamiennikowych i niezależnego warsztatu,
  z dopiskiem, że zależą od wersji i regionu. Nie podawaj cen OC.
- Liczby z CEPiK (podane w danych) możesz cytować dosłownie. Nie wymyślaj innych statystyk.
- Odpowiadasz WYŁĄCZNIE poprawnym obiektem JSON: {"eksploatacja": "...", "koszty": "...", "podsumowanie": "..."}
  Każde pole to tekst w Markdown (akapity oddzielone pustą linią, listy z „- ”). Bez nagłówków #.
- eksploatacja: 150–250 słów, newralgiczne punkty i na co patrzeć przy zakupie.
- koszty: 80–150 słów, lista typowych czynności serwisowych z orientacyjnym kosztem.
- podsumowanie: 50–90 słów, jak model wypada na polskim rynku wtórnym na tle danych z CEPiK.`;

function daneKarty(m) {
  const c = m.cepik;
  const lista = (l) => (l || []).slice(0, 5).map((x) => `${x.nazwa}: ${x.liczba}`).join('; ');
  return [
    `Model: ${m.marka} ${m.model} ${m.generacja || '(wszystkie generacje)'}`,
    `Lata produkcji: ${m.lataProdukcji}`,
    `Nadwozia: ${m.nadwozia.join(', ')}`,
    m.opisModelu ? `Opis: ${m.opisModelu}` : '',
    m.silniki?.length ? `Silniki: ${m.silniki.map((s) => `${s.nazwa} ${s.pojemnoscCm3} cm3 ${s.mocKm} KM ${s.paliwo} (${s.lata})`).join('; ')}` : '',
    m.wymiary ? `Wymiary: ${m.wymiary.dlugoscMm}×${m.wymiary.szerokoscMm}×${m.wymiary.wysokoscMm} mm, rozstaw osi ${m.wymiary.rozstawOsiMm} mm` : '',
    `CEPiK: zarejestrowanych w Polsce ${c.liczbaWPolsce} (stan na ${c.stanNa}); z niedawną rejestracją ${c.aktywne ?? '?'}; nowych w rejestrze od XI 2019: ${c.noweOdPaczki ?? 0}`,
    `Paliwa: ${lista(c.paliwa)}`,
    `Pojemności: ${lista(c.pojemnosci)}`,
    `Pochodzenie: ${lista(c.pochodzenie)}`,
    c.sredniRocznik ? `Średni rocznik: ${c.sredniRocznik}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function zapytaj(tresc, proba = 0) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KLUCZ, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, system: SYSTEM, messages: [{ role: 'user', content: tresc }] })
  });
  // limit zapytań / przeciążenie: czekamy (nagłówek retry-after albo wykładniczo) i ponawiamy
  if (r.status === 429 || r.status === 529 || r.status >= 500) {
    if (proba >= 8) throw new Error(`API ${r.status} – za dużo prób`);
    const czekaj = Number(r.headers.get('retry-after')) * 1000 || Math.min(60000, 2000 * 2 ** proba);
    console.log(`  API ${r.status}, czekam ${Math.round(czekaj / 1000)} s…`);
    await sleep(czekaj);
    return zapytaj(tresc, proba + 1);
  }
  if (!r.ok) throw new Error(`API ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return j.content.map((b) => b.text || '').join('');
}

function przetworz(tekst) {
  const json = JSON.parse(tekst.slice(tekst.indexOf('{'), tekst.lastIndexOf('}') + 1));
  for (const k of ['eksploatacja', 'koszty', 'podsumowanie']) if (typeof json[k] !== 'string' || json[k].length < 40) throw new Error(`brak sekcji ${k}`);
  const caly = JSON.stringify(json).toLowerCase();
  const zly = ZAKAZANE.find((z) => caly.includes(z));
  if (zly) throw new Error(`zakazany zwrot: ${zly}`);
  return json;
}

async function main() {
  if (!KLUCZ) {
    console.error('Brak klucza API. Uruchom: ANTHROPIC_API_KEY=sk-ant-... node scripts/generuj-opisy.mjs');
    process.exit(1);
  }
  fs.mkdirSync(OPISY, { recursive: true });
  let karty = fs
    .readdirSync(MODELE)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(MODELE, f), 'utf8')))
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce);
  if (TYLKO.length) karty = karty.filter((m) => TYLKO.includes(m.slug));
  else karty = karty.slice(0, LIMIT);
  const postep = fs.existsSync(POSTEP) ? JSON.parse(fs.readFileSync(POSTEP, 'utf8')) : {};
  const start = OD || (!NADPISZ && postep.ostatni) || '';
  if (start) {
    const i = karty.findIndex((m) => m.slug === start);
    if (i > 0) karty = karty.slice(i);
  }
  let zrobione = 0;
  for (const m of karty) {
    const plik = path.join(OPISY, `${m.slug}.json`);
    if (fs.existsSync(plik) && !NADPISZ) continue;
    console.log(`→ ${m.marka} ${m.model} ${m.generacja}`.trim());
    let wynik = null;
    for (let proba = 0; proba < 3 && !wynik; proba++) {
      try {
        wynik = przetworz(await zapytaj(`Napisz opis dla tego auta na podstawie danych:\n\n${daneKarty(m)}`));
      } catch (e) {
        console.log(`  błąd: ${e.message}${proba < 2 ? ' – ponawiam' : ' – pomijam'}`);
      }
    }
    if (wynik) {
      fs.writeFileSync(plik, JSON.stringify({ slug: m.slug, wygenerowano: new Date().toISOString().slice(0, 10), model: MODEL, ...wynik }, null, 2) + '\n');
      zrobione++;
    }
    fs.writeFileSync(POSTEP, JSON.stringify({ ostatni: m.slug, data: new Date().toISOString() }) + '\n');
    await sleep(PRZERWA);
  }
  console.log(`Gotowe: ${zrobione} nowych opisów. Zatwierdź je w panelu admina (zakładka „Opisy”).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
