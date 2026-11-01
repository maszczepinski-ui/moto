#!/usr/bin/env node
// =====================================================================
// Pobieranie danych z API CEPiK – samochody osobowe zarejestrowane w Polsce po raz pierwszy od 9.11.2019.
//
// Skrypt sam pilnuje, co już jest w pliku data/cepik/nowe.tsv (stan w data/cepik/nowe-stan.json):
//   • dociąga NOWE dni (od ostatniej aktualizacji do 7 dni temu – ostatni tydzień CEPiK jeszcze uzupełnia),
//   • uzupełnia brakujące STARSZE dni (wstecz aż do 9.11.2019), jeśli pierwsze pobranie nie było pełne.
// Ten sam dzień nigdy nie jest liczony dwa razy.
//
// Uruchamia go automat na GitHubie (.github/workflows/aktualizuj-dane.yml) – przyciskiem w panelu admina
// albo sam raz w miesiącu. Automat dzieli pracę na kilka serwerów naraz (--czesc) i na końcu scala wyniki (--scal).
// Można też na komputerze:  node scripts/aktualizuj-cepik.mjs   a potem   python3 scripts/zbuduj-modele.py
//
// Opcje: --od / --do RRRR-MM-DD  (zakres nowych dni; dni już pobrane są i tak pomijane)
//        --bez-wstecz             (nie uzupełniaj starszych dni)
//        --rownolegle 8           (ile zapytań naraz; CEPiK przy większej liczbie częściej odmawia)
//        --limit-minut 330        (po tym czasie zapisuje postęp i kończy – kolejne uruchomienie dokończy resztę)
//        --czesc 0/4 --wynik plik (tryb automatu: pobierz co 4. dzień do osobnego pliku, bez zmiany nowe.tsv)
//        --scal plik1 plik2 …     (tryb automatu: dołóż pobrane części do nowe.tsv)
// =====================================================================
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const NOWE = path.join(ROOT, 'data', 'cepik', 'nowe.tsv');
const STAN = path.join(ROOT, 'data', 'cepik', 'nowe-stan.json');
const API = process.env.CEPIK_API || 'https://api.cepik.gov.pl';
const POCZATEK = '2019-11-09'; // pierwszy dzień po danych z paczek CEPiK
const WOJ = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32'];

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const flaga = (n) => process.argv.includes(`--${n}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dzien = (d) => d.toISOString().slice(0, 10);
const plus = (d, n) => dzien(new Date(new Date(d + 'T12:00:00Z').getTime() + n * 864e5));

// ---------------------------------------------------------------- te same reguły co przy pierwszym pobraniu
const STOP = new Set(['KAT','KAT.','TDI','TD','TDS','D','CDI','HDI','DCI','CRDI','TSI','TFSI','FSI','GTI','GTD','16V','8V','12V','24V','V6','V8','I','SDI','TURBO','DIESEL','BENZYNA','LPG','AUTOMAT','AUT','KOMBI','SEDAN','HATCHBACK','CABRIO','COUPE','VAN','AT','MT','JTD','MULTIJET','VTEC','VVT-I','D4D','D-4D','CRD','CDTI','DTI','TDCI','TDDI','EVO','SPORT','LIMOUSINE','LIMUZYNA','TOURING','VARIANT','AVANT','ESTATE','WAGON','SW','BREAK','HYBRID','HYBRYDA','PHEV','HEV','PLUG-IN','E-HYBRID','4X4','AWD','4WD','EV','ELECTRIC']);
function baseModel(m) {
  m = (m || '').toUpperCase().replace(/["']/g, '').replace(/\s+/g, ' ').trim();
  if (!m || m === '---') return '?';
  const t = m.split(' '), out = [];
  for (const w of t) {
    if (/^\d+[.,]\d+/.test(w) || STOP.has(w) || (/^\d{3,4}(CM3|CCM)?$/.test(w) && out.length)) break;
    out.push(w);
    if (out.length >= 3) break;
  }
  return out.join(' ') || t[0];
}
function paliwo(a) {
  const p = a['rodzaj-paliwa'] || '', alt = (a['rodzaj-pierwszego-paliwa-alternatywnego'] || '') + ' ' + (a['rodzaj-drugiego-paliwa-alternatywnego'] || '');
  let s = p === 'BENZYNA' ? 'B' : p === 'OLEJ NAPĘDOWY' ? 'ON' : p.includes('ELEKTR') ? 'EL' : p.includes('GAZ') ? 'GAZ' : p.includes('HYBRYD') ? 'HYB' : p.includes('WODÓR') ? 'H2' : p ? 'INNE' : '?';
  if (/GAZ|LPG|PROPAN/.test(alt)) s += '+LPG';
  else if (/ELEKTR/.test(alt) || (s !== 'EL' && a['moc-netto-silnika-hybrydowego'] > 0)) s += '+EL';
  return s;
}
const POCH = { 'NOWY ZAKUPIONY W KRAJU': 'NK', 'UŻYW. ZAKUPIONY W KRAJU': 'UK', 'UŻYW. IMPORT INDYW': 'UI', 'NOWY IMPORT INDYW': 'NI' };
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const klucz = (s) => String(s).replace(/[=,\t]/g, ' ');


// ---------------------------------------------------------------- odczyt / zapis plików
const parseMap = (s) => Object.fromEntries((s.split(':').slice(1).join(':') || '').split(',').filter(Boolean).map((kv) => { const i = kv.lastIndexOf('='); return [kv.slice(0, i), Number(kv.slice(i + 1))]; }));
const serMap = (o) => Object.entries(o).map(([a, b]) => `${klucz(a)}=${b}`).join(',');

function wczytaj(plik = NOWE) {
  const G = new Map(), R = new Map();
  let M = {}, Z = [];
  if (fs.existsSync(plik)) {
    for (const l of fs.readFileSync(plik, 'utf8').split('\n')) {
      const p = l.split('\t');
      if (p[0] === 'G') G.set(`${p[1]}\t${p[2]}\t${p[3]}`, { n: Number(p[4]), w: parseMap(p[6]), d: parseMap(p[7]), p: parseMap(p[8]), j: parseMap(p[9]), o: parseMap(p[10]), y: parseMap(p[11] || 'Y:') });
      else if (p[0] === 'R') R.set(`${p[1]}\t${p[2]}\t${p[3]}`, Number(p[4]));
      else if (p[0] === 'M') M = JSON.parse(p[1]);
      else if (p[0] === 'Z') Z = JSON.parse(p[1]);
    }
  }
  return { G, R, M, Z };
}

function zapisz(G, R, M, plik = NOWE, Z = null, progR = 3) {
  const linie = [];
  for (const [k, o] of G) linie.push(['G', k, o.n, 0, 'W:' + serMap(o.w), 'D:' + serMap(o.d), 'P:' + serMap(o.p), 'J:' + serMap(o.j), 'O:' + serMap(o.o), 'Y:' + serMap(o.y)].join('\t'));
  for (const [k, n] of R) if (n >= progR) linie.push(`R\t${k}\t${n}`);
  linie.push('M\t' + JSON.stringify(M));
  if (Z) linie.push('Z\t' + JSON.stringify(Z));
  fs.writeFileSync(plik + '.tmp', linie.join('\n') + '\n');
  fs.renameSync(plik + '.tmp', plik);
}

/** dokłada liczniki z L do G (i z LR do R) */
function dodaj(G, R, L, LR) {
  for (const [k, x] of L) {
    const o = G.get(k);
    if (!o) { G.set(k, x); continue; }
    o.n += x.n;
    for (const f of ['w', 'd', 'p', 'j', 'o', 'y']) for (const [a, v] of Object.entries(x[f])) inc(o[f], a, v);
  }
  for (const [k, v] of LR) R.set(k, (R.get(k) || 0) + v);
}

function wczytajStan(M) {
  const s = fs.existsSync(STAN) ? JSON.parse(fs.readFileSync(STAN, 'utf8')) : {};
  const ostatni = s.ostatniDzien || M.ostatniDzien || M.do || plus(POCZATEK, -1);
  // pierwszy dzień ciągłego, pełnego zakresu; starsze pliki stanu nie miały tego pola = zakres pełny od początku
  const pierwszy = s.pierwszyDzien || M.od || POCZATEK;
  return { ostatniDzien: ostatni, pierwszyDzien: pierwszy, zrobione: new Set(s.zrobione || []) };
}

/** wylicza ciągły zakres pełnych dni, zapisuje stan i metadane */
function zapiszStan(stan, M, G, R) {
  const pelny = (d) => WOJ.every((w) => stan.zrobione.has(`${w}:${d}`));
  let ost = stan.ostatniDzien;
  while (pelny(plus(ost, 1))) ost = plus(ost, 1);
  let pier = stan.pierwszyDzien;
  while (pier > POCZATEK && pelny(plus(pier, -1))) pier = plus(pier, -1);
  stan.ostatniDzien = ost;
  stan.pierwszyDzien = pier;
  for (const z of [...stan.zrobione]) {
    const d = z.split(':')[1];
    if (d <= ost && d >= pier) stan.zrobione.delete(z);
  }
  Object.assign(M, { od: pier, do: ost, ostatniDzien: ost, kompletne: pier <= POCZATEK, aktualizacja: dzien(new Date()) });
  zapisz(G, R, M);
  fs.writeFileSync(STAN, JSON.stringify({ ostatniDzien: ost, pierwszyDzien: pier, zrobione: [...stan.zrobione].sort() }, null, 1) + '\n');
}

/** lista dni do pobrania: najpierw nowe (rosnąco), potem brakujące starsze (od najnowszych wstecz) */
function dniDoPobrania(stan) {
  const od = arg('od', plus(stan.ostatniDzien, 1));
  const doDnia = arg('do', dzien(new Date(Date.now() - 7 * 864e5)));
  const dni = [];
  for (let d = od; d <= doDnia; d = plus(d, 1)) dni.push(d);
  if (!flaga('bez-wstecz')) for (let d = plus(stan.pierwszyDzien, -1); d >= POCZATEK; d = plus(d, -1)) dni.push(d);
  // bezpiecznik: nigdy nie pobieraj dni, które już są w danych
  return dni.filter((d) => d < stan.pierwszyDzien || d > stan.ostatniDzien);
}

// ---------------------------------------------------------------- pobieranie
let bledy = 0;
let koniecCzasu = Infinity;
async function getJ(url) {
  for (let i = 0; i < 400; i++) {
    if (Date.now() > koniecCzasu + 15 * 60000) throw new Error('koniec czasu');
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 120000);
    try {
      const r = await fetch(url, { signal: ac.signal, headers: { Accept: 'application/json' } });
      clearTimeout(t);
      if (r.status === 200) return await r.json();
      if (r.status !== 429) bledy++;
    } catch {
      clearTimeout(t);
      bledy++;
    }
    await sleep(1500 + Math.random() * 3000 + Math.min(30000, i * 500));
  }
  throw new Error('serwis CEPiK nie odpowiada');
}

async function pobierzDzien(woj, d) {
  const L = new Map(), LR = new Map();
  let n = 0;
  const ds = d.replace(/-/g, '');
  for (let page = 1; page < 400; page++) {
    const j = await getJ(`${API}/pojazdy?wojewodztwo=${woj}&data-od=${ds}&data-do=${ds}&typ-daty=1&tylko-zarejestrowane=true&pokaz-wszystkie-pola=true&limit=500&page=${page}&filter[rodzaj-pojazdu]=${encodeURIComponent('SAMOCHÓD OSOBOWY')}`);
    for (const x of j.data || []) {
      const a = x.attributes;
      if (a['rodzaj-pojazdu'] !== 'SAMOCHÓD OSOBOWY' || a['data-wyrejestrowania-pojazdu']) continue;
      const marka = (a.marka || '?').toUpperCase().trim();
      const raw = (a.model || '').toUpperCase().replace(/\s+/g, ' ').trim();
      const b = baseModel(raw);
      const k = `${klucz(marka)}\t${klucz(b)}\t${a['rok-produkcji'] || '?'}`;
      let o = L.get(k);
      if (!o) L.set(k, (o = { n: 0, w: {}, d: {}, p: {}, j: {}, o: {}, y: {} }));
      o.n++; n++;
      inc(o.w, woj); inc(o.d, a['podrodzaj-pojazdu'] || '?'); inc(o.p, paliwo(a));
      inc(o.j, Math.round((parseFloat(a['pojemnosc-skokowa-silnika']) || 0) / 100) * 100);
      inc(o.o, POCH[a['pochodzenie-pojazdu']] || 'X'); inc(o.y, d.slice(0, 4));
      const rk = `${klucz(marka)}\t${klucz(b)}\t${klucz(raw)}`;
      LR.set(rk, (LR.get(rk) || 0) + 1);
    }
    if (!j.data || j.data.length < 500) break;
  }
  return { L, LR, n };
}

/** pobiera zadania „woj:dzień” kilkoma równoległymi wątkami; przerywa po limicie czasu albo gdy CEPiK nie odpowiada */
async function pobierz(zadania, poZadaniu) {
  const rownolegle = Number(arg('rownolegle', 8));
  const kolejka = [...zadania];
  let gotowe = 0, przerwano = false;
  const pracownik = async () => {
    while (kolejka.length && !przerwano) {
      if (Date.now() > koniecCzasu) { przerwano = true; return; }
      const z = kolejka.shift();
      const [w, d] = z.split(':');
      let wynik;
      try {
        wynik = await pobierzDzien(w, d);
      } catch (e) {
        console.log(`Przerywam: ${e.message}`);
        przerwano = true;
        return;
      }
      await poZadaniu(z, wynik); // scalanie dopiero po pobraniu całego dnia – nic się nie dubluje
      if (++gotowe % 100 === 0) console.log(`  ${gotowe}/${zadania.length} (${Math.round((gotowe / zadania.length) * 100)}%), błędy połączeń: ${bledy}`);
    }
  };
  await Promise.all(Array.from({ length: rownolegle }, pracownik));
  return { gotowe, przerwano: przerwano || kolejka.length > 0 };
}

function wyjscieGitHub(klucz_, wartosc) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${klucz_}=${wartosc}\n`);
}

// ---------------------------------------------------------------- tryby pracy
async function main() {
  koniecCzasu = Date.now() + Number(arg('limit-minut', 330)) * 60000;

  // tryb „scal”: dołóż pliki z części (pobrane równolegle przez automat) do nowe.tsv
  const iScal = process.argv.indexOf('--scal');
  if (iScal > 0) {
    const { G, R, M } = wczytaj();
    const stan = wczytajStan(M);
    let ile = 0, rek = 0;
    for (const plik of process.argv.slice(iScal + 1).filter((p) => !p.startsWith('--'))) {
      if (!fs.existsSync(plik)) continue;
      const c = wczytaj(plik);
      const nowe = c.Z.filter((z) => !stan.zrobione.has(z) && (z.split(':')[1] < stan.pierwszyDzien || z.split(':')[1] > stan.ostatniDzien));
      if (nowe.length !== c.Z.length) { console.log(`Pomijam ${plik} – zawiera dni, które już są w danych.`); continue; }
      dodaj(G, R, c.G, c.R);
      for (const z of c.Z) stan.zrobione.add(z);
      ile += c.Z.length; rek += c.M.rekordy || 0;
    }
    M.rekordy = (M.rekordy || 0) + rek;
    zapiszStan(stan, M, G, R);
    const zostalo = dniDoPobrania(stan).length;
    console.log(`Scalono ${ile} zapytań (${rek} aut). Dane: ${stan.pierwszyDzien} … ${stan.ostatniDzien}. Do pobrania zostało dni: ${zostalo}.`);
    wyjscieGitHub('dalej', ile > 0 && zostalo > 0 && !flaga('bez-wstecz') ? 'tak' : 'nie');
    return;
  }

  const { G, R, M } = wczytaj();
  const stan = wczytajStan(M);
  let dni = dniDoPobrania(stan);
  if (!dni.length) {
    console.log(`Dane są aktualne i kompletne (${stan.pierwszyDzien} … ${stan.ostatniDzien}). Nic do pobrania.`);
    wyjscieGitHub('dalej', 'nie');
    if (arg('wynik')) zapisz(new Map(), new Map(), { rekordy: 0 }, arg('wynik'), [], 1);
    return;
  }

  // tryb „część”: ten serwer bierze co n-ty dzień i zapisuje wynik do osobnego pliku
  const czesc = arg('czesc');
  if (czesc) {
    const [i, n] = czesc.split('/').map(Number);
    dni = dni.filter((_, k) => k % n === i);
    const zadania = dni.flatMap((d) => WOJ.map((w) => `${w}:${d}`)).filter((z) => !stan.zrobione.has(z));
    console.log(`Część ${i + 1}/${n}: ${dni.length} dni, ${zadania.length} zapytań.`);
    const CG = new Map(), CR = new Map(), Z = [];
    let rekordy = 0;
    const plik = arg('wynik', 'czesc.tsv');
    const zapiszCzesc = () => zapisz(CG, CR, { rekordy }, plik, Z, 1);
    const { gotowe } = await pobierz(zadania, (z, { L, LR, n: ile }) => {
      dodaj(CG, CR, L, LR);
      Z.push(z);
      rekordy += ile;
      if (Z.length % 50 === 0) zapiszCzesc();
    });
    zapiszCzesc();
    console.log(`Część ${i + 1}/${n}: pobrano ${gotowe} zapytań, ${rekordy} aut, błędy połączeń: ${bledy}.`);
    return;
  }

  // tryb zwykły (na komputerze): pobiera i od razu dokłada do nowe.tsv
  const zadania = dni.flatMap((d) => WOJ.map((w) => `${w}:${d}`)).filter((z) => !stan.zrobione.has(z));
  console.log(`Pobieram ${dni.length} dni, ${zadania.length} zapytań dzień×województwo.`);
  let rekordy = 0, odZapisu = 0;
  const { przerwano } = await pobierz(zadania, (z, { L, LR, n }) => {
    dodaj(G, R, L, LR);
    stan.zrobione.add(z);
    rekordy += n;
    if (++odZapisu >= 100) { odZapisu = 0; M.rekordy = (M.rekordy || 0) + rekordy; rekordy = 0; zapiszStan(stan, M, G, R); }
  });
  M.rekordy = (M.rekordy || 0) + rekordy;
  zapiszStan(stan, M, G, R);
  console.log(przerwano ? `Przerwano – uruchom ponownie, żeby dokończyć. Dane: ${stan.pierwszyDzien} … ${stan.ostatniDzien}.` : `Gotowe. Dane: ${stan.pierwszyDzien} … ${stan.ostatniDzien}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
