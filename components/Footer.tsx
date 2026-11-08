import Link from 'next/link';
import { site } from '@/config/site';
import { menuGlowne } from '@/lib/menu';
import { UstawieniaCookies } from '@/components/BanerZgod';
import { wlasnyBanerZgod } from '@/components/SkryptyGlobalne';
import ZainstalujAplikacje from '@/components/ZainstalujAplikacje';
import PrzelacznikJezyka from '@/components/obce/PrzelacznikJezyka';
import { wszystkieOdpowiedniki } from '@/lib/tlumaczenia';

const link = 'hover:text-steel-600 dark:hover:text-steel-300 transition-colors';

export default function Footer() {
  const grupy = menuGlowne();
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-20 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {grupy.map((g) => (
            <nav key={g.id} aria-label={g.nazwa}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">{g.nazwa}</h2>
              <ul className="space-y-1.5">
                {g.pozycje.map((p) => (
                  <li key={p.adres}>
                    <Link href={p.adres} className={link}>
                      {p.nazwa}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Serwis">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Serwis</h2>
            <ul className="space-y-1.5">
              <li>
                <a href={site.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  YouTube: {site.youtubeChannelName}
                </a>
              </li>
              <li>
                <Link href="/linki/" className={link}>
                  Linki
                </Link>
              </li>
              <li>
                <Link href="/metodologia/" className={link}>
                  Skąd są dane
                </Link>
              </li>
              <li>
                <Link href="/prywatnosc/" className={link}>
                  Prywatność i linki partnerskie
                </Link>
              </li>
              <li>
                <Link href="/regulamin/" className={link}>
                  Regulamin
                </Link>
              </li>
              {wlasnyBanerZgod && (
                <li>
                  <UstawieniaCookies />
                </li>
              )}
            </ul>
          </nav>
        </div>
        <ZainstalujAplikacje />
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <strong className="text-slate-700 dark:text-slate-300">Informacja o linkach:</strong> Niektóre linki na stronie są partnerskie – jeśli z nich skorzystasz, mogę otrzymać prowizję, Ty nie płacisz więcej. Dzięki temu serwis może pozostać bezpłatny.
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-1 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}. Wydawca: <strong className="text-slate-800 dark:text-slate-200">{site.publisher}</strong>
            {site.publisherAddress ? `, ${site.publisherAddress}` : `, ${site.publisherCity}`}
            {site.publisherNip ? `, NIP ${site.publisherNip}` : ''}.
            {site.contactEmail && (
              <>
                {' '}
                Kontakt:{' '}
                <a href={`mailto:${site.contactEmail}`} className={link}>
                  {site.contactEmail}
                </a>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs">Zdjęcia w nagłówkach: Unsplash. Mapy: © autorzy OpenStreetMap.</p>
            {/* Wersje językowe – na telefonie przełącznika nie ma w nagłówku */}
            <PrzelacznikJezyka jezyk="pl" zestawy={wszystkieOdpowiedniki()} />
          </div>
        </div>
      </div>
    </footer>
  );
}
