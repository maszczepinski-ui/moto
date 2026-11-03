import Link from 'next/link';
import { MapPinned } from 'lucide-react';
import { site } from '@/config/site';
import { menuGlowne } from '@/lib/menu';
import MenuGlowne from '@/components/MenuGlowne';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group min-w-0" aria-label={`${site.name} – strona główna`}>
          <MapPinned className="w-7 h-7 flex-shrink-0 text-steel-600 dark:text-steel-400 group-hover:scale-105 transition-transform" aria-hidden="true" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 dark:text-white leading-tight">{site.name}</span>
            <span className="hidden md:block text-[11px] font-semibold text-rust-600 dark:text-rust-500 tracking-wide truncate">{site.tagline}</span>
          </div>
        </Link>
        <MenuGlowne grupy={menuGlowne()} youtube={site.youtubeChannelUrl} youtubeNazwa={site.youtubeChannelName} />
      </div>
    </header>
  );
}
