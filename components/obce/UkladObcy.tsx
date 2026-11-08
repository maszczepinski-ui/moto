// Wspólny układ stron /uk/ i /en/: własny <html lang>, nagłówek, stopka i baner cookies w danym języku.
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { MapPinned, ExternalLink } from 'lucide-react';
import { site } from '@/config/site';
import { marka } from '@/lib/panel';
import { META, PORADNIKI_ADRES, SLOWNIK, type JezykObcy } from '@/lib/jezyki';
import { wszystkieOdpowiedniki } from '@/lib/tlumaczenia';
import { ADRESY_NARZEDZI } from '@/lib/tlumaczenia/narzedzia';
import { SkryptyHead, SkryptyBody, wlasnyBanerZgod } from '@/components/SkryptyGlobalne';
import BanerZgod, { UstawieniaCookies } from '@/components/BanerZgod';
import AnalitykaVercel from '@/components/AnalitykaVercel';
import PrzelacznikJezyka from './PrzelacznikJezyka';

export function metadaneUkladu(j: JezykObcy): Metadata {
  const t = SLOWNIK[j];
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} – ${t.hasloStrony}`, template: `%s | ${site.name}` },
    description: t.glowna.seoOpis,
    applicationName: site.name,
    openGraph: { siteName: site.name, locale: META[j].locale, type: 'website' }
  };
}

export const viewportUkladu: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' }
  ]
};

const link = 'hover:text-steel-600 dark:hover:text-steel-300 transition-colors';

export default function UkladObcy({ j, children }: { j: JezykObcy; children: React.ReactNode }) {
  const t = SLOWNIK[j];
  const m = marka();
  const zestawy = wszystkieOdpowiedniki();
  const glowna = `/${j}/`;
  return (
    <html lang={META[j].hreflang}>
      <head>
        <SkryptyHead />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-steel-500 selection:text-white">
        <a href="#tresc" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg">
          {t.skok}
        </a>
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
            <Link href={glowna} className="flex items-center gap-2 min-w-0" aria-label={`${site.name} – ${t.stronaGlowna}`}>
              {m.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.logo} alt="" className="h-8 sm:h-9 w-auto max-w-[150px] object-contain flex-shrink-0" />
              ) : (
                <MapPinned className="w-7 h-7 flex-shrink-0 text-steel-600 dark:text-steel-400" aria-hidden="true" />
              )}
              <span className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 dark:text-white leading-tight">{site.name}</span>
                <span className="hidden md:block text-[11px] font-semibold text-rust-600 dark:text-rust-500 tracking-wide truncate">{t.hasloStrony}</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <nav aria-label={t.stronaGlowna} className="hidden sm:flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Link href={PORADNIKI_ADRES[j]} className={link}>
                  {t.menu.poradniki}
                </Link>
                <Link href={ADRESY_NARZEDZI.vin[j]} className={link}>
                  {t.menu.vin}
                </Link>
                <Link href={ADRESY_NARZEDZI.oc[j]} className={link}>
                  {t.menu.oc}
                </Link>
                <Link href={ADRESY_NARZEDZI.mandaty[j]} className={`${link} hidden md:inline`}>
                  {t.menu.mandaty}
                </Link>
              </nav>
              <PrzelacznikJezyka jezyk={j} zestawy={zestawy} />
            </div>
          </div>
          <nav aria-label={t.menu.poradniki} className="sm:hidden border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 h-10 flex items-center gap-5 text-sm font-semibold text-slate-700 dark:text-slate-200 overflow-x-auto whitespace-nowrap">
              <Link href={PORADNIKI_ADRES[j]}>{t.menu.poradniki}</Link>
              <Link href={ADRESY_NARZEDZI.vin[j]}>{t.menu.vin}</Link>
              <Link href={ADRESY_NARZEDZI.oc[j]}>{t.menu.oc}</Link>
              <Link href={ADRESY_NARZEDZI.mandaty[j]}>{t.menu.mandaty}</Link>
            </div>
          </nav>
        </header>

        <main id="tresc" className="flex-1">
          {children}
        </main>

        <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-20 text-slate-600 dark:text-slate-400 text-sm">
          <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">{site.name}</p>
                <p className="max-w-xl">{t.stopka.onas}</p>
              </div>
              <ul className="space-y-1.5">
                <li>
                  <Link href={PORADNIKI_ADRES[j]} className={link}>
                    {t.menu.poradniki}
                  </Link>
                </li>
                <li>
                  <Link href={ADRESY_NARZEDZI.vin[j]} className={link}>
                    {t.menu.vin}
                  </Link>
                </li>
                <li>
                  <Link href={ADRESY_NARZEDZI.oc[j]} className={link}>
                    {t.menu.oc}
                  </Link>
                </li>
                <li>
                  <Link href={ADRESY_NARZEDZI.mandaty[j]} className={link}>
                    {t.menu.mandaty}
                  </Link>
                </li>
                <li>
                  <Link href="/" hrefLang="pl" className={link}>
                    {t.menu.polski}
                  </Link>
                </li>
                <li>
                  <Link href="/metodologia/" hrefLang="pl" className={link}>
                    {t.stopka.zrodla}
                  </Link>
                </li>
                <li>
                  <Link href="/prywatnosc/" hrefLang="pl" className={link}>
                    {t.stopka.prywatnosc}
                  </Link>
                </li>
                <li>
                  <a href={site.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className={link}>
                    YouTube: {site.youtubeChannelName} <ExternalLink className="inline w-3 h-3" aria-hidden="true" />
                  </a>
                </li>
                {wlasnyBanerZgod && (
                  <li>
                    <UstawieniaCookies etykieta={t.stopka.cookies} />
                  </li>
                )}
              </ul>
            </div>
            <p className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-xs">{t.stopka.partnerzy}</p>
            <p className="text-xs">
              © {new Date().getFullYear()} {site.name}. {t.stopka.wydawca}: <strong className="text-slate-800 dark:text-slate-200">{site.publisher}</strong>.
            </p>
          </div>
        </footer>

        {process.env.NEXT_PUBLIC_STATYCZNA !== '1' && <AnalitykaVercel />}
        <SkryptyBody />
        {wlasnyBanerZgod && <BanerZgod t={t.zgoda} />}
      </body>
    </html>
  );
}
