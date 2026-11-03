import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { marka } from '@/lib/panel';

// Dzięki temu plikowi stronę można dodać do ekranu głównego telefonu – otwiera się wtedy jak aplikacja (bez paska przeglądarki).
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  // ?v=… – po zmianie ikony w panelu telefony pobiorą nową, zamiast pokazywać starą z pamięci
  const v = marka().ikonaWersja ? `?v=${marka().ikonaWersja}` : '';
  return {
    id: '/',
    name: `${site.name} – auta, trasa, OC`,
    short_name: site.name,
    description: 'Atlas aut w Polsce, koszt przejazdu, mapa ładowarek i fotoradarów, mandaty i przypomnienia o OC.',
    lang: 'pl',
    start_url: '/?zrodlo=aplikacja',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#26517a',
    orientation: 'portrait',
    categories: ['travel', 'navigation', 'utilities'],
    prefer_related_applications: false,
    icons: [
      { src: `/ikony/ikona-192.png${v}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `/ikony/ikona-512.png${v}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `/ikony/ikona-maskable-512.png${v}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: 'Koszt przejazdu', url: '/koszt-trasy/' },
      { name: 'Mapa ładowarek', url: '/ladowarki/' },
      { name: 'Fotoradary', url: '/fotoradary/' },
      { name: 'Mandaty i punkty', url: '/mandaty/' },
      { name: 'Kolizja – co zrobić', url: '/poradniki/kolizja-bez-policji/' }
    ]
  };
}
