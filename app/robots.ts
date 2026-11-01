import { MetadataRoute } from 'next';
import { site } from '@/config/site';

export const dynamic = 'force-static';

// Roboty: blokujemy panel admina, adresy z parametrami (filtry, sortowanie, śledzenie kampanii) i pliki techniczne Next.js,
// żeby Google nie marnował czasu na kopie tych samych stron.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/*?*', '/_next/data/'] },
    sitemap: `${site.url}/sitemap.xml`
  };
}
