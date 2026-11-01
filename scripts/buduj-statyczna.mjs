#!/usr/bin/env node
// Buduje stronę jako same pliki HTML (folder „out”) – do wgrania na zwykły hosting, np. cyber_Folks.
// Uruchom:  npm run build:statyczna
// Na zwykłym hostingu nie ma serwera Node.js, więc pomijamy małe API raportów spalania (moduł sam się wtedy ukrywa).
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const API = path.join(ROOT, 'app', 'api');
const SCHOWEK = path.join(ROOT, '.api-schowek');

if (fs.existsSync(SCHOWEK) && !fs.existsSync(API)) fs.renameSync(SCHOWEK, API); // po przerwanym poprzednim budowaniu
if (fs.existsSync(API)) fs.renameSync(API, SCHOWEK);
// stare, wygenerowane typy wciąż wskazują na API – usuwamy je, Next.js utworzy nowe
for (const d of ['.next/types', '.next/dev/types']) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
let kod = 1;
try {
  const r = spawnSync('npx', ['next', 'build'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, STATYCZNA: '1', NEXT_PUBLIC_STATYCZNA: '1' } });
  kod = r.status ?? 1;
} finally {
  if (fs.existsSync(SCHOWEK)) fs.renameSync(SCHOWEK, API);
}
if (kod === 0) {
  fs.copyFileSync(path.join(ROOT, 'hosting', '.htaccess'), path.join(ROOT, 'out', '.htaccess'));
  console.log('\nGotowe. Zawartość folderu „out” wgraj do folderu public_html na serwerze.');
}
process.exit(kod);
