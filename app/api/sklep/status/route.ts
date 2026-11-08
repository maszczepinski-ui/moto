// Strona „Dziękujemy” pyta tutaj, czy płatność już przeszła. Gdy tak – od razu daje link do pobrania (mail idzie równolegle).
import { sklepAktywny } from '@/lib/sklep/konfiguracja';
import { znajdz } from '@/lib/sklep/p24';
import { odczytajNumer } from '@/lib/sklep/zamowienie';
import { linkPobrania } from '@/lib/sklep/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const s = new URL(req.url).searchParams.get('s') || '';
  if (!sklepAktywny() || !odczytajNumer(s)) return Response.json({ stan: 'nieznane' }, { status: 400 });
  try {
    const t = await znajdz(s);
    // 2 = płatność dokonana i zweryfikowana
    if (Number(t.status) === 2) return Response.json({ stan: 'oplacone', link: linkPobrania(s).url }, { headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ stan: 'czeka' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ stan: 'czeka' }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
