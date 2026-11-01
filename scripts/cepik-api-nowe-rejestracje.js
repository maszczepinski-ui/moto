// Pobieranie z API CEPiK samochodów osobowych zarejestrowanych po raz pierwszy w Polsce
// po dacie ostatniej paczki (od 2019-11-09). Uruchamiane w przeglądarce na stronie api.cepik.gov.pl.
// Zlicza dane w tym samym formacie co paczki (marka, model, rocznik → województwa, nadwozia, paliwa…)
// i zapisuje postęp w IndexedDB, więc po odświeżeniu strony można wznowić: NR.start().
(() => {
  const OD = '2019-11-09';
  const DO = window.NR_DO || '2026-10-31';
  const WOJ = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32'];
  const OSOB = encodeURIComponent('SAMOCHÓD OSOBOWY');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const STOP = new Set(['KAT','KAT.','TDI','TD','TDS','D','CDI','HDI','DCI','CRDI','TSI','TFSI','FSI','GTI','GTD','16V','8V','12V','24V','V6','V8','I','SDI','TURBO','DIESEL','BENZYNA','LPG','AUTOMAT','AUT','KOMBI','SEDAN','HATCHBACK','CABRIO','COUPE','VAN','AT','MT','JTD','MULTIJET','VTEC','VVT-I','D4D','D-4D','CRD','CDTI','DTI','TDCI','TDDI','EVO','SPORT','LIMOUSINE','LIMUZYNA','TOURING','VARIANT','AVANT','ESTATE','WAGON','SW','BREAK','HYBRID','HYBRYDA','PHEV','HEV','PLUG-IN','E-HYBRID','4X4','AWD','4WD','EV','ELECTRIC']);
  const baseModel = (m) => {
    m = (m || '').toUpperCase().replace(/["']/g, '').replace(/\s+/g, ' ').trim();
    if (!m || m === '---') return '?';
    const t = m.split(' '), out = [];
    for (const w of t) {
      if (/^\d+[.,]\d+/.test(w) || STOP.has(w) || (/^\d{3,4}(CM3|CCM)?$/.test(w) && out.length)) break;
      out.push(w);
      if (out.length >= 3) break;
    }
    return out.join(' ') || t[0];
  };
  const paliwo = (a) => {
    const p = a['rodzaj-paliwa'] || '', alt = (a['rodzaj-pierwszego-paliwa-alternatywnego'] || '') + ' ' + (a['rodzaj-drugiego-paliwa-alternatywnego'] || '');
    let s = p === 'BENZYNA' ? 'B' : p === 'OLEJ NAPĘDOWY' ? 'ON' : p.includes('ELEKTR') ? 'EL' : p.includes('GAZ') ? 'GAZ' : p.includes('HYBRYD') ? 'HYB' : p.includes('WODÓR') ? 'H2' : p ? 'INNE' : '?';
    if (/GAZ|LPG|PROPAN/.test(alt)) s += '+LPG';
    else if (/ELEKTR/.test(alt) || (s !== 'EL' && a['moc-netto-silnika-hybrydowego'] > 0)) s += '+EL';
    return s;
  };
  const POCH = { 'NOWY ZAKUPIONY W KRAJU': 'NK', 'UŻYW. ZAKUPIONY W KRAJU': 'UK', 'UŻYW. IMPORT INDYW': 'UI', 'NOWY IMPORT INDYW': 'NI' };
  const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };

  const days = [];
  for (let d = new Date(DO + 'T12:00:00Z'); d >= new Date(OD + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 1)) days.push(d.toISOString().slice(0, 10).replace(/-/g, ''));
  const tasks = [];
  for (const d of days) for (const w of WOJ) tasks.push(w + ':' + d); // od najnowszych dni

  const NR = (window.NR = { G: new Map(), RAW: new Map(), done: new Set(), C: 6, running: false, pages: 0, recs: 0, err: 0, t0: 0, log: [], tasks });

  // ---------- IndexedDB (postęp przetrwa odświeżenie strony)
  const db = () => new Promise((res, rej) => { const r = indexedDB.open('nr', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = rej; });
  NR.save = async () => {
    const d = await db();
    await new Promise((res, rej) => { const tx = d.transaction('kv', 'readwrite'); tx.objectStore('kv').put({ G: [...NR.G], RAW: [...NR.RAW], done: [...NR.done], pages: NR.pages, recs: NR.recs }, 'stan'); tx.oncomplete = res; tx.onerror = rej; });
    NR.saved = new Date().toISOString();
  };
  NR.load = async () => {
    const d = await db();
    const s = await new Promise((res) => { const r = d.transaction('kv').objectStore('kv').get('stan'); r.onsuccess = () => res(r.result); r.onerror = () => res(null); });
    if (s) { NR.G = new Map(s.G); NR.RAW = new Map(s.RAW); NR.done = new Set(s.done); NR.pages = s.pages; NR.recs = s.recs; }
    return NR.done.size;
  };

  const getJ = async (u) => {
    for (let i = 0; i < 1000; i++) {
      if (!NR.running) throw new Error('stop');
      const ac = new AbortController(), to = setTimeout(() => ac.abort(), 120000);
      try {
        const r = await fetch(u, { signal: ac.signal });
        clearTimeout(to);
        if (r.status === 200) return await r.json();
        if (r.status !== 429) NR.err++;
      } catch (e) { clearTimeout(to); NR.err++; }
      await sleep(1500 + Math.random() * 3000);
    }
    throw new Error('za dużo prób');
  };

  const runTask = async (t) => {
    const [w, d] = t.split(':');
    const L = new Map(), LR = new Map();
    let n = 0;
    for (let page = 1; page < 400; page++) {
      const j = await getJ(`/pojazdy?wojewodztwo=${w}&data-od=${d}&data-do=${d}&typ-daty=1&tylko-zarejestrowane=true&pokaz-wszystkie-pola=true&limit=500&page=${page}&filter[rodzaj-pojazdu]=${OSOB}`);
      NR.pages++;
      for (const x of j.data || []) {
        const a = x.attributes;
        if (a['rodzaj-pojazdu'] !== 'SAMOCHÓD OSOBOWY' || a['data-wyrejestrowania-pojazdu']) continue;
        const marka = (a.marka || '?').toUpperCase().trim();
        const raw = (a.model || '').toUpperCase().replace(/\s+/g, ' ').trim();
        const b = baseModel(raw);
        const k = marka + '\t' + b + '\t' + (a['rok-produkcji'] || '?');
        let o = L.get(k);
        if (!o) { o = { n: 0, w: {}, d: {}, p: {}, j: {}, o: {}, y: {} }; L.set(k, o); }
        o.n++; n++;
        inc(o.w, w); inc(o.d, a['podrodzaj-pojazdu'] || '?'); inc(o.p, paliwo(a));
        inc(o.j, Math.round((parseFloat(a['pojemnosc-skokowa-silnika']) || 0) / 100) * 100);
        inc(o.o, POCH[a['pochodzenie-pojazdu']] || 'X'); inc(o.y, d.slice(0, 4));
        const rk = marka + '\t' + b + '\t' + raw; LR.set(rk, (LR.get(rk) || 0) + 1);
      }
      if (!j.data || j.data.length < 500) break;
    }
    // scalanie dopiero po pobraniu całego dnia – przy błędzie nic się nie dubluje
    for (const [k, x] of L) {
      const o = NR.G.get(k);
      if (!o) { NR.G.set(k, x); continue; }
      o.n += x.n;
      for (const f of ['w', 'd', 'p', 'j', 'o', 'y']) for (const [a, v] of Object.entries(x[f])) inc(o[f], a, v);
    }
    for (const [k, v] of LR) NR.RAW.set(k, (NR.RAW.get(k) || 0) + v);
    NR.recs += n;
    NR.done.add(t);
  };

  NR.start = async () => {
    if (NR.running) return 'już działa';
    await NR.load();
    NR.running = true; NR.t0 = Date.now(); NR.pages0 = NR.pages; NR.done0 = NR.done.size;
    const queue = tasks.filter((t) => !NR.done.has(t));
    let active = 0, sinceSave = 0;
    const worker = async () => {
      while (NR.running && queue.length) {
        if (active >= NR.C) { await sleep(500); continue; }
        const t = queue.shift(); active++;
        try { await runTask(t); sinceSave++; }
        catch (e) { if (NR.running) { NR.log.push(t + ' ' + e); queue.push(t); } }
        active--;
        if (sinceSave >= 40) { sinceSave = 0; await NR.save(); }
      }
    };
    NR.workers = Promise.all(Array.from({ length: 24 }, worker)).then(async () => { await NR.save(); NR.running = false; NR.finished = !queue.length; });
    return 'start: ' + queue.length + ' zadań do zrobienia';
  };
  NR.stop = () => { NR.running = false; };
  NR.status = () => {
    const h = (Date.now() - NR.t0) / 3600000, p = NR.pages - (NR.pages0 || 0);
    const left = tasks.length - NR.done.size;
    const ostatni = [...NR.done].map((t) => t.split(':')[1]).sort()[0];
    return { zrobione: NR.done.size, wszystkie: tasks.length, dniWstecz: ostatni, rekordy: NR.recs, strony: NR.pages, stronNaGodz: Math.round(p / Math.max(h, 0.01)),
      zadanNaGodz: Math.round((NR.done.size - (NR.done0 ?? NR.done.size)) / Math.max(h, 0.01)), bledy: NR.err, C: NR.C, zapisano: NR.saved, dziala: NR.running, koniec: NR.finished, log: NR.log.slice(-3) };
  };
  NR.export = (minMB = 5, minRaw = 3) => {
    const mbTot = new Map();
    for (const [k, o] of NR.G) { const mb = k.split('\t').slice(0, 2).join('\t'); mbTot.set(mb, (mbTot.get(mb) || 0) + o.n); }
    const ser = (o) => Object.entries(o).map(([a, b]) => String(a).replace(/[=,\t]/g, ' ') + '=' + b).join(',');
    const lines = [];
    for (const [k, o] of NR.G) {
      if (mbTot.get(k.split('\t').slice(0, 2).join('\t')) < minMB) continue;
      lines.push(['G', k, o.n, 0, 'W:' + ser(o.w), 'D:' + ser(o.d), 'P:' + ser(o.p), 'J:' + ser(o.j), 'O:' + ser(o.o), 'Y:' + ser(o.y)].join('\t'));
    }
    for (const [k, n] of NR.RAW) { const mb = k.split('\t').slice(0, 2).join('\t'); if (n >= minRaw && mbTot.get(mb) >= minMB) lines.push('R\t' + k + '\t' + n); }
    lines.push('M\t' + JSON.stringify({ od: OD, do: DO, rekordy: NR.recs, zadania: NR.done.size, wszystkie: tasks.length }));
    NR.EXPORT = lines;
    return lines.length;
  };
})();
