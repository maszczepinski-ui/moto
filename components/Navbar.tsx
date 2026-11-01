import Link from 'next/link';
import { MapPinned } from 'lucide-react';
import YouTubeIcon from '@/components/YouTubeIcon';
import { site } from '@/config/site';

const link = 'text-slate-700 dark:text-slate-300 hover:text-steel-600 dark:hover:text-steel-300 transition-colors';

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
        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
          <Link href="/marki/" className={link}>
            Marki
          </Link>
          <Link href="/wojewodztwa/" className={`${link} hidden sm:inline`}>
            Województwa
          </Link>
          <Link href="/rankingi/" className={link}>
            Rankingi
          </Link>
          <a
            href={site.youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold transition-colors"
            aria-label={`Kanał ${site.youtubeChannelName} na YouTube`}
          >
            <YouTubeIcon className="w-5 h-5" />
            <span className="hidden lg:inline">YouTube</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
