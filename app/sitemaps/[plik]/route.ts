import { mapaXml, plikiMap } from '@/lib/sitemapy';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return plikiMap().map((plik) => ({ plik }));
}

export async function GET(_: Request, { params }: { params: Promise<{ plik: string }> }) {
  const { plik } = await params;
  const xml = mapaXml(plik);
  if (!xml) return new Response('Nie znaleziono', { status: 404 });
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
