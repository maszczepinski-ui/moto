import Link from 'next/link';
import { site } from '@/config/site';
import { opublikowane } from '@/lib/wpisy';
import { rankingiZProduktami } from '@/lib/produkty';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-20 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <strong className="text-slate-700 dark:text-slate-300">Informacja o linkach:</strong> Niektóre linki na stronie są partnerskie – jeśli z nich skorzystasz, mogę otrzymać prowizję, Ty nie płacisz więcej. Dzięki temu serwis może pozostać bezpłatny.
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}. Wydawca: <strong className="text-slate-800 dark:text-slate-200">{site.publisher}</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href={site.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              YouTube: {site.youtubeChannelName}
            </a>
            <Link href="/linki/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Linki
            </Link>
            <Link href="/wojewodztwa/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Województwa
            </Link>
            <Link href="/rankingi/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Rankingi
            </Link>
            <Link href="/asystent-zakupu/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Asystent zakupu
            </Link>
            <Link href="/sprawdz-vin/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Sprawdź VIN
            </Link>
            {opublikowane().length > 0 && (
              <Link href="/filmy/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
                Filmy
              </Link>
            )}
            {rankingiZProduktami().length > 0 && (
              <Link href="/polecane/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
                Polecane produkty
              </Link>
            )}
            <Link href="/rynek/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Rynek nowych aut
            </Link>
            <Link href="/porownaj/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Porównania
            </Link>
            <Link href="/kody-bledow/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Kody błędów
            </Link>
            <Link href="/metodologia/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Skąd dane
            </Link>
            <Link href="/prywatnosc/" className="hover:text-steel-600 dark:hover:text-steel-300 transition-colors">
              Prywatność i linki partnerskie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
