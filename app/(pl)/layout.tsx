import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { site } from '@/config/site';
import AnalitykaVercel from '@/components/AnalitykaVercel';
import { SkryptyHead, SkryptyBody, wlasnyBanerZgod } from '@/components/SkryptyGlobalne';
import BanerZgod from '@/components/BanerZgod';
import Aplikacja from '@/components/Aplikacja';
import PasekSezonowy from '@/components/PasekSezonowy';
import PodpowiedzJezyka from '@/components/obce/PodpowiedzJezyka';
import { wszystkieOdpowiedniki } from '@/lib/tlumaczenia';
import { panelDane } from '@/lib/panel';

// Kod weryfikacyjny Google Search Console: zmienna środowiskowa w Vercel albo pole w panelu admina (zakładka SEO)
const gsc = (process.env.NEXT_PUBLIC_GSC_VERIFICATION || panelDane.seo?.gsc || '').trim().replace(/^.*content="([^"]+)".*$/, '$1');

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ile aut danego modelu jeździ w Polsce i gdzie`,
    template: `%s | ${site.name}`
  },
  description:
    'Karty popularnych modeli aut: liczba zarejestrowanych egzemplarzy w Polsce według CEPiK, mapa województw, roczniki, silniki i wymiary.',
  ...(gsc ? { verification: { google: gsc } } : {}),
  // Strona dodana do ekranu głównego iPhone'a otwiera się jak aplikacja (bez paska Safari)
  applicationName: site.name,
  appleWebApp: { capable: true, title: site.name, statusBarStyle: 'default' },
  openGraph: {
    siteName: site.name,
    title: `${site.name} – ile ich jeździ w Polsce i gdzie`,
    description: 'Mapa województw, roczniki, silniki i wymiary popularnych modeli aut.',
    locale: 'pl_PL',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <SkryptyHead />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-steel-500 selection:text-white">
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Przejdź do treści
        </a>
        <Navbar />
        <PodpowiedzJezyka zestawy={wszystkieOdpowiedniki()} />
        <PasekSezonowy />
        <main id="tresc" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Statystyki odwiedzin Vercel – bez plików cookies; działają po włączeniu „Analytics” w panelu Vercel */}
        {process.env.NEXT_PUBLIC_STATYCZNA !== '1' && <AnalitykaVercel />}
        <SkryptyBody />
        {wlasnyBanerZgod && <BanerZgod />}
        <Aplikacja />
      </body>
    </html>
  );
}
