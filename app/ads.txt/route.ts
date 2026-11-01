import { panelDane } from '@/lib/panel';

export const dynamic = 'force-static';

// Plik /ads.txt – treść wpisujesz w panelu admina (zakładka SEO). Wymagany przez AdSense i sieci reklamowe.
export function GET() {
  const tresc = (panelDane.seo?.adsTxt || '').trim();
  return new Response(tresc ? `${tresc}\n` : '# ads.txt – uzupełnij w panelu admina\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
