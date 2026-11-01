import { indeksXml } from '@/lib/sitemapy';

export const dynamic = 'force-static';

// Indeks map strony – ten adres zgłaszasz w Google Search Console
export function GET() {
  return new Response(indeksXml(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
