// Codzienny automat (Vercel Cron, plik vercel.json): jeśli strona zmieniła się od ostatniego zgłoszenia mapy strony
// w Google Search Console – zgłasza ją ponownie. Gdy nic się nie zmieniło, nic nie wysyła. Bez poprawnego CRON_SECRET nic nie robi.
import { gscSkonfigurowane, stanMapyGoogle, zglosMapeGoogle, zmianyPoZgloszeniu } from '@/lib/search-console';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const sekret = process.env.CRON_SECRET;
  if (!sekret || req.headers.get('authorization') !== `Bearer ${sekret}`) return new Response('Brak dostępu', { status: 401 });
  if (!gscSkonfigurowane()) return Response.json({ pominieto: 'brak klucza Google' });
  try {
    const stan = await stanMapyGoogle();
    if (!zmianyPoZgloszeniu(stan)) return Response.json({ pominieto: 'bez zmian od ostatniego zgłoszenia', stan });
    return Response.json({ zgloszono: true, stan: await zglosMapeGoogle() });
  } catch (e) {
    return Response.json({ blad: (e as Error).message }, { status: 502 });
  }
}
