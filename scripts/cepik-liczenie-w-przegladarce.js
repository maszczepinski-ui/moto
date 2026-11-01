// Liczenie paczek CEPiK w przeglądarce (uruchamiane na stronie api.cepik.gov.pl).
// Strumieniowo rozpakowuje ZIP-y i zlicza zarejestrowane samochody osobowe.
(() => {
  window.getC = async function (u) {
    for (let i = 0; i < 20; i++) {
      const t = await fetch(u).then((r) => r.text());
      if (!t.includes('API-ERR-100011')) return t;
      await new Promise((r) => setTimeout(r, 3000));
    }
    return 'BUSY';
  };
  window.zipInfo = async function (u) {
    const r = await fetch(u, { headers: { Range: 'bytes=-70000' } });
    const buf = new Uint8Array(await r.arrayBuffer());
    const dv = new DataView(buf.buffer);
    const total = +r.headers.get('content-range').split('/')[1];
    let eocd = -1;
    for (let i = buf.length - 22; i >= 0; i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    const c = dv.getUint32(eocd + 16, true) - (total - buf.length);
    const comp = dv.getUint32(c + 20, true), lho = dv.getUint32(c + 42, true);
    const lh = new DataView(await (await fetch(u, { headers: { Range: `bytes=${lho}-${lho + 29}` } })).arrayBuffer());
    return { comp, dataStart: lho + 30 + lh.getUint16(26, true) + lh.getUint16(28, true) };
  };
  window.lineStream = async function* (u, info) {
    const resp = await fetch(u, { headers: { Range: `bytes=${info.dataStart}-${info.dataStart + info.comp - 1}` } });
    const rd = resp.body.pipeThrough(new DecompressionStream('deflate-raw')).pipeThrough(new TextDecoderStream('utf-8')).getReader();
    let rest = '';
    while (true) {
      const { value, done } = await rd.read();
      if (done) break;
      const parts = (rest + value).split('\n');
      rest = parts.pop();
      for (const p of parts) yield p;
    }
    if (rest) yield rest;
  };
  const STOP = new Set(['KAT','KAT.','TDI','TD','TDS','D','CDI','HDI','DCI','CRDI','TSI','TFSI','FSI','GTI','GTD','16V','8V','12V','24V','V6','V8','I','SDI','TURBO','DIESEL','BENZYNA','LPG','AUTOMAT','AUT','KOMBI','SEDAN','HATCHBACK','CABRIO','COUPE','VAN','AT','MT','JTD','MULTIJET','VTEC','VVT-I','D4D','D-4D','CRD','CDTI','DTI','TDCI','TDDI','EVO','SPORT','LIMOUSINE','LIMUZYNA','TOURING','VARIANT','AVANT','ESTATE','WAGON','SW','BREAK']);
  window.baseModel = function (m) {
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
  window.parseCSV = function (line) {
    if (line.indexOf('"') < 0) return line.split(',');
    const r = []; let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { r.push(cur); cur = ''; } else cur += ch;
    }
    r.push(cur); return r;
  };
  window.paliwo = function (p, a) {
    p = p || ''; a = a || '';
    let s = p === 'BENZYNA' ? 'B' : p === 'OLEJ NAPĘDOWY' ? 'ON' : p.includes('ELEKTR') ? 'EL' : p.includes('GAZ') ? 'GAZ' : p.includes('HYBRYD') ? 'HYB' : p ? 'INNE' : '?';
    if (/GAZ|LPG|PROPAN/.test(a)) s += '+LPG'; else if (/ELEKTR/.test(a)) s += '+EL';
    return s;
  };
  const POCH = { 'NOWY ZAKUPIONY W KRAJU': 'NK', 'UŻYW. ZAKUPIONY W KRAJU': 'UK', 'UŻYW. IMPORT INDYW': 'UI', 'NOWY IMPORT INDYW': 'NI' };
  const AKTYWNY_OD = '2017-04-17'; // 5 lat przed datą paczki: auto zarejestrowane/przerejestrowane od tej daty uznajemy za „aktywne”

  window.G = new Map(); window.RAW = new Map(); window.TOT = {}; window.JOB = { status: 'idle', files: {}, log: [] };
  const inc = (o, k, n) => { o[k] = (o[k] || 0) + n; };

  window.processFile = async function (id, url) {
    const info = await zipInfo(url), woj = id.split('_')[1];
    const L = new Map(), LR = new Map(); // najpierw liczymy lokalnie – przy błędzie i ponowieniu nic się nie zdubluje
    let rows = 0, osobReg = 0, aktywne = 0, H = null, idx;
    const st = (JOB.files[id] = { id, rows: 0, osobReg: 0, done: false });
    for await (const line of lineStream(url, info)) {
      if (!H) { H = line.split(','); idx = Object.fromEntries(H.map((h, i) => [h, i])); continue; }
      rows++;
      if ((rows & 0xffff) === 0) { st.rows = rows; st.osobReg = osobReg; }
      const f = parseCSV(line);
      if (f.length < 60 || f[idx.rodzaj] !== 'SAMOCHÓD OSOBOWY' || f[idx.data_wyrejestrowania]) continue;
      osobReg++;
      const marka = (f[idx.marka] || '?').toUpperCase().trim();
      const raw = (f[idx.model] || '').toUpperCase().replace(/\s+/g, ' ').trim();
      const b = baseModel(raw);
      const k = marka + '\t' + b + '\t' + (f[idx.rok_produkcji] || '?');
      let o = L.get(k);
      if (!o) { o = { n: 0, a: 0, w: {}, d: {}, p: {}, j: {}, o: {} }; L.set(k, o); }
      const akt = (f[idx.data_rejestracji_ost] || '') >= AKTYWNY_OD || (f[idx.data_pierwszej_rej_w_kraju] || '') >= AKTYWNY_OD;
      o.n++; if (akt) { o.a++; aktywne++; }
      inc(o.w, woj, 1); inc(o.d, f[idx.podrodzaj] || '?', 1); inc(o.p, paliwo(f[idx.rodzaj_paliwa], f[idx.rodzaj_paliwa_alternatywnego]), 1);
      inc(o.j, Math.round((parseFloat(f[idx.pojemnosc_silnika]) || 0) / 100) * 100, 1); inc(o.o, POCH[f[idx.pochodzenie]] || 'X', 1);
      const rk = marka + '\t' + b + '\t' + raw; LR.set(rk, (LR.get(rk) || 0) + 1);
    }
    for (const [k, x] of L) {
      let o = G.get(k);
      if (!o) { G.set(k, x); continue; }
      o.n += x.n; o.a += x.a;
      for (const f of ['w', 'd', 'p', 'j', 'o']) for (const [a, v] of Object.entries(x[f])) inc(o[f], a, v);
    }
    for (const [k, n] of LR) RAW.set(k, (RAW.get(k) || 0) + n);
    Object.assign(st, { rows, osobReg, aktywne, done: true });
    TOT[woj] = { rows, osobReg, aktywne };
  };
  window.runAll = async function () {
    JOB.status = 'running';
    const list = JSON.parse(await getC('/pliki?limit=100')).data.map((d) => [d.id, d.attributes['url-do-pliku'].replace('https://api.cepik.gov.pl', '')]);
    for (const [id, u] of list) {
      for (let tr = 0; tr < 4; tr++) {
        try { await processFile(id, u); break; }
        catch (e) { JOB.log.push(id + ': ' + e); await new Promise((r) => setTimeout(r, 5000)); }
      }
    }
    JOB.status = 'done';
  };
  window.buildExport = function (minMB = 20, minRaw = 5) {
    const mbTot = new Map();
    for (const [k, o] of G) { const mb = k.split('\t').slice(0, 2).join('\t'); mbTot.set(mb, (mbTot.get(mb) || 0) + o.n); }
    const ser = (o) => Object.entries(o).map(([a, b]) => String(a).replace(/[=,\t]/g, ' ') + '=' + b).join(',');
    const lines = [];
    for (const [k, o] of G) {
      const mb = k.split('\t').slice(0, 2).join('\t');
      if (mbTot.get(mb) < minMB) continue;
      lines.push(['G', k, o.n, o.a, 'W:' + ser(o.w), 'D:' + ser(o.d), 'P:' + ser(o.p), 'J:' + ser(o.j), 'O:' + ser(o.o)].join('\t'));
    }
    for (const [k, n] of RAW) { const mb = k.split('\t').slice(0, 2).join('\t'); if (n >= minRaw && mbTot.get(mb) >= minMB) lines.push('R\t' + k + '\t' + n); }
    lines.push('T\t' + JSON.stringify(TOT));
    window.EXPORT = lines;
    return { lines: lines.length, kept: [...mbTot.values()].filter((n) => n >= minMB).length, dropped: [...mbTot.values()].filter((n) => n < minMB).length };
  };
  window.chunk = function (i, size = 50000) {
    return '@@CHUNK ' + i + '\n' + EXPORT.slice(i * size, (i + 1) * size).join('\n') + '\n@@END';
  };
})();
