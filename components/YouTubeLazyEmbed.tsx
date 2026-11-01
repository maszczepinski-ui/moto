'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import YouTubeIcon from '@/components/YouTubeIcon';
import { site } from '@/config/site';

interface Props {
  videoId: string;
  title: string;
}

// Film ładuje się dopiero po kliknięciu. Do tego momentu strona nie łączy się
// z serwerami YouTube/Google (żadnej miniatury, żadnych ciasteczek) – szybciej i prywatniej.
export default function YouTubeLazyEmbed({ videoId, title }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Brak numeru filmu = film jeszcze nie powstał
  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-xl bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 text-center p-6">
        <YouTubeIcon className="w-10 h-10 text-red-600" />
        <p className="font-semibold text-slate-800 dark:text-slate-100">Film o tym modelu już wkrótce</p>
        <a
          href={site.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-steel-600 dark:text-steel-400 hover:underline"
        >
          Zobacz kanał {site.youtubeChannelName} →
        </a>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 relative shadow-md">
      {isLoaded ? (
        <iframe
          className="w-full h-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-br from-steel-700 to-slate-900 text-white group focus:outline-none focus-visible:ring-4 focus-visible:ring-steel-500"
          aria-label={`Odtwórz film: ${title}`}
        >
          <span className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" aria-hidden="true" />
          </span>
          <span className="font-semibold text-center max-w-md">{title}</span>
          <span className="text-xs text-steel-100">Kliknij, aby załadować film z YouTube</span>
        </button>
      )}
    </div>
  );
}
