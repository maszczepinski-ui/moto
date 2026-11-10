import Link from 'next/link';
import { site } from '@/config/site';
import { menuGlowne } from '@/lib/menu';
import MenuGlowne from '@/components/MenuGlowne';
import { marka } from '@/lib/panel';
import LogoMarka from '@/components/LogoMarka';
import PrzelacznikJezyka from '@/components/obce/PrzelacznikJezyka';
import { wszystkieOdpowiedniki } from '@/lib/tlumaczenia';

export default function Navbar() {
  const m = marka();
  const ciemne = m.logoCiemne || m.logo;
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group min-w-0 flex-shrink-0" aria-label={`${site.name} – strona główna`}>
          {m.logo ? (
            <>
              {/* Logo z panelu admina (zakładka „Logo i ikona”) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.logo} width={200} height={32} alt={m.logoTryb === 'zamiast' ? site.name : ''} className={`h-8 w-auto max-w-[210px] object-contain flex-shrink-0 ${ciemne !== m.logo ? 'dark:hidden' : ''}`} />
              {ciemne !== m.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ciemne} width={200} height={32} alt={m.logoTryb === 'zamiast' ? site.name : ''} className="hidden dark:block h-8 w-auto max-w-[210px] object-contain flex-shrink-0" />
              )}
            </>
          ) : (
            // Domyślne logo: ikona + napis „moto–raport” (components/LogoMarka.tsx)
            <LogoMarka />
          )}
          {m.logo && (
            <div className={`flex flex-col min-w-0 ${m.logoTryb === 'zamiast' ? 'sr-only' : 'max-sm:sr-only'}`}>
              <span className="font-bold text-slate-900 dark:text-white leading-tight">{site.name}</span>
              <span className="hidden md:block xl:hidden text-[11px] font-semibold text-rust-600 dark:text-rust-500 tracking-wide truncate">{site.tagline}</span>
            </div>
          )}
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <PrzelacznikJezyka jezyk="pl" zestawy={wszystkieOdpowiedniki()} />
          </div>
          <MenuGlowne grupy={menuGlowne()} youtube={site.youtubeChannelUrl} youtubeNazwa={site.youtubeChannelName} />
        </div>
      </div>
    </header>
  );
}
