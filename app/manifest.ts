import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

// Dzięki temu plikowi stronę można dodać do ekranu głównego telefonu – otwiera się wtedy jak aplikacja (bez paska przeglądarki).
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – auta, trasa, OC`,
    short_name: site.name,
    description: 'Atlas aut w Polsce, koszt przejazdu, mapa ładowarek i fotoradarów, mandaty i przypomnienia o OC.',
    lang: 'pl',
    start_url: '/?zrodlo=aplikacja',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#26517a',
    icons: [
      { src: '/ikony/ikona-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/ikony/ikona-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/ikony/ikona-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: 'Koszt przejazdu', url: '/koszt-trasy/' },
      { name: 'Mapa ładowarek', url: '/ladowarki/' },
      { name: 'Fotoradary', url: '/fotoradary/' },
      { name: 'Mandaty i punkty', url: '/mandaty/' }
    ]
  };
}
