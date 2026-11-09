// Pełna lista modeli do wyszukiwarki na stronie głównej. Plik budowany raz przy wdrożeniu (statyczny),
// pobierany dopiero, gdy ktoś zacznie szukać – dzięki temu strona główna jest lekka.
import { getModelSummaries } from '@/lib/models';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(getModelSummaries(), { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
}
