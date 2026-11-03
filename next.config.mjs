/** @type {import('next').NextConfig} */
// STATYCZNA=1 → strona jako same pliki HTML (folder „out”) do wgrania na zwykły hosting, np. cyber_Folks.
// Robi to polecenie:  npm run build:statyczna   (albo automat .github/workflows/publikuj-ftp.yml)
// Na zwykłym hostingu te same nagłówki bezpieczeństwa ustawia plik hosting/.htaccess.

const statyczna = process.env.STATYCZNA === '1';
const dev = process.env.NODE_ENV !== 'production';

// Nagłówki bezpieczeństwa dla całej strony. Nie blokujemy skryptów z zewnątrz (reklamy, statystyki, kody wklejane w panelu),
// ale zabraniamy osadzania strony w cudzych ramkach, wtyczek typu Flash, podmiany adresu bazowego i wysyłania formularzy na obce strony.
const NAGLOWKI = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" }
];

// Panel admina: tu jest token do GitHuba, więc obowiązują dużo ostrzejsze zasady – strona może łączyć się tylko z sobą i z GitHubem,
// a skrypty z zewnątrz (reklamy, statystyki, kody z panelu) nie mogą niczego wysłać na obce serwery.
const CSP_ADMIN = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' https://api.github.com${dev ? ' ws:' : ''}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

const nextConfig = {
  ...(statyczna ? { output: 'export' } : {}),
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  poweredByHeader: false,
  ...(statyczna
    ? {}
    : {
        async headers() {
          return [
            { source: '/:path*', headers: NAGLOWKI },
            {
              source: '/admin/:path*',
              headers: [
                { key: 'Content-Security-Policy', value: CSP_ADMIN },
                { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                { key: 'Cache-Control', value: 'no-store' }
              ]
            }
          ];
        }
      })
};

export default nextConfig;
