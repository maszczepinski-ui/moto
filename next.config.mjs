/** @type {import('next').NextConfig} */
// STATYCZNA=1 → strona jako same pliki HTML (folder „out”) do wgrania na zwykły hosting, np. cyber_Folks.
// Robi to polecenie:  npm run build:statyczna   (albo automat .github/workflows/publikuj-ftp.yml)
const nextConfig = {
  ...(process.env.STATYCZNA === '1' ? { output: 'export' } : {}),
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
