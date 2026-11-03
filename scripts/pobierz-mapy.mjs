#!/usr/bin/env node
// Pobiera z OpenStreetMap wszystkie ładowarki, fotoradary i odcinkowe pomiary prędkości w Polsce
// i zapisuje je na stronie (public/mapy/…), podzielone na kratki 1° × 1°.
// Dzięki temu mapy na stronie nie zależą od przeciążonych publicznych serwerów – odwiedzający pobiera gotowy plik z Twojej strony.
// Uruchamia go automat .github/workflows/aktualizuj-mapy.yml raz w tygodniu (i przyciskiem „Run workflow”).
// Gdy serwery nie odpowiadają, skrypt kończy się błędem i NIE rusza poprzednich plików – strona dalej ma stare dane.
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const CEL = path.join(ROOT, 'public', 'mapy');
const SERWERY = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

const POLSKA = 'area["ISO3166-1"="PL"][admin_level=2]->.pl;';
const ZAPYTANIA = {
  ladowarki: `[out:json][timeout:300];${POLSKA}(node["amenity"="charging_station"](area.pl);way["amenity"="charging_station"](area.pl););out center tags;`,
  fotoradary: `[out:json][timeout:300];${POLSKA}(node["highway"="speed_camera"](area.pl);relation["type"="enforcement"]["enforcement"="average_speed"](area.pl););out geom;`
};

// zostawiamy tylko pola, których używa strona – pliki są dużo mniejsze
const POTRZEBNE = /^(name|operator|network|brand|access|capacity|opening_hours|fee|charge|maxspeed|ref|type|enforcement|amenity|highway|addr:(street|place|housenumber|city)|charging_station:output|socket:.*)$/;

const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(q) {
  let blad;
  for (let proba = 0; proba < 3; proba++) {
    for (const s of SERWERY) {
      try {
        const r = await fetch(s, {
          method: 'POST',
          body: 'data=' + encodeURIComponent(q),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'moto-raport.pl mapy (GitHub Actions)' },
          signal: AbortSignal.timeout(330000)
        });
        if (!r.ok) throw new Error(`${s}: ${r.status}`);
        const d = await r.json();
        if (!Array.isArray(d.elements)) throw new Error(`${s}: brak danych`);
        console.log(`  ✓ ${s}: ${d.elements.length} obiektów`);
        return d.elements;
      } catch (e) {
        blad = e;
        console.log(`  ✗ ${s}: ${e.message}`);
      }
    }
    await czekaj(60000);
  }
  throw blad;
}

function odchudz(e) {
  const tags = Object.fromEntries(Object.entries(e.tags || {}).filter(([k]) => POTRZEBNE.test(k)));
  const o = { type: e.type, id: e.id, tags };
  if (e.lat !== undefined) Object.assign(o, { lat: +e.lat.toFixed(5), lon: +e.lon.toFixed(5) });
  if (e.center) o.center = { lat: +e.center.lat.toFixed(5), lon: +e.center.lon.toFixed(5) };
  if (e.members)
    o.members = e.members
      .filter((m) => ['from', 'to', 'device'].includes(m.role) && m.lat !== undefined)
      .map((m) => ({ type: m.type, ref: m.ref, role: m.role, lat: +m.lat.toFixed(5), lon: +m.lon.toFixed(5) }));
  return o;
}

function punkt(o) {
  if (o.lat !== undefined) return [o.lat, o.lon];
  if (o.center) return [o.center.lat, o.center.lon];
  const m = o.members?.find((x) => x.role === 'from') || o.members?.[0];
  return m ? [m.lat, m.lon] : null;
}

async function main() {
  const tylko = process.argv[2];
  for (const [tryb, q] of Object.entries(ZAPYTANIA)) {
    if (tylko && tylko !== tryb) continue;
    console.log(`Pobieram: ${tryb}`);
    const el = (await overpass(q)).map(odchudz);
    if (el.length < (tryb === 'ladowarki' ? 500 : 100)) throw new Error(`Podejrzanie mało danych (${el.length}) – nie nadpisuję`);
    const kratki = {};
    for (const o of el) {
      const p = punkt(o);
      if (!p) continue;
      const k = `${Math.floor(p[0])}_${Math.floor(p[1])}`;
      (kratki[k] ||= []).push(o);
    }
    const folder = path.join(CEL, tryb);
    fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });
    for (const [k, lista] of Object.entries(kratki)) fs.writeFileSync(path.join(folder, `${k}.json`), JSON.stringify(lista));
    fs.writeFileSync(
      path.join(folder, 'index.json'),
      JSON.stringify({ zaktualizowano: new Date().toISOString().slice(0, 10), liczba: el.length, kratki: Object.keys(kratki).sort() })
    );
    console.log(`  zapisano ${el.length} obiektów w ${Object.keys(kratki).length} kratkach`);
  }
}

main().catch((e) => {
  console.error('Błąd:', e.message);
  process.exit(1);
});
