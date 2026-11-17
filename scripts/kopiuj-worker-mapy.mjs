// Mapa (MapLibre od wersji 6) liczy kafelki w osobnym „pracowniku” (pliku maplibre-gl-worker.mjs).
// Bundler Next.js go nie kopiuje, więc robimy to sami po każdej instalacji pakietów: node_modules → public/maplibre/.
// Adres ustawia components/MapaObiektow.tsx (setWorkerUrl). Plik nie jest w repo (.gitignore) – powstaje przy budowie.
import { copyFileSync, mkdirSync, existsSync } from 'fs';

const zrodlo = 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs';
if (existsSync(zrodlo)) {
  mkdirSync('public/maplibre', { recursive: true });
  copyFileSync(zrodlo, 'public/maplibre/maplibre-gl-worker.mjs');
}
