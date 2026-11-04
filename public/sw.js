// Service worker MotoRaport – dzięki niemu stronę można zainstalować jak aplikację,
// a bez internetu zamiast błędu przeglądarki pokazuje się nasza strona „Brak internetu”.
// Strony zawsze pobieramy z sieci (żeby dane były aktualne); z pamięci bierzemy tylko pliki stylów i skryptów.
const WERSJA = 'mf-v1';
const OFFLINE = '/offline/';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(WERSJA)
      .then((c) => c.addAll([OFFLINE, '/ikony/ikona-192.png']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((k) => Promise.all(k.filter((n) => n !== WERSJA).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return;

  // Strony: najpierw internet, bez internetu – strona offline
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(() => caches.match(OFFLINE)));
    return;
  }

  // Pliki Next.js z unikalną nazwą (nigdy się nie zmieniają) – z pamięci, a gdy ich nie ma, z sieci
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(
      caches.match(r).then(
        (z) =>
          z ||
          fetch(r).then((odp) => {
            if (odp.ok) {
              const kopia = odp.clone();
              caches.open(WERSJA).then((c) => c.put(r, kopia));
            }
            return odp;
          })
      )
    );
  }
});
