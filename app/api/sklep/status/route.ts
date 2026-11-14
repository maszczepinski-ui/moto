// Strona „Dziękujemy” pyta tutaj, czy płatność już przeszła. Gdy tak – od razu daje link do pobrania (mail idzie równolegle).
// Zamówienie w PayU znajdujemy po numerze z ciasteczka (ustawia je /api/sklep/zamow/). Bez ciasteczka (np. inne urządzenie)
// sprawdzamy znacznik w bazie, jeśli jest; w ostateczności kupujący i tak dostaje link mailem.
import { cookies } from 'next/headers';
import { produktAktywny } from '@/lib/sklep/konfiguracja';
import { CIASTKO_ZAMOWIENIA, pobierz } from '@/lib/sklep/payu';
import { obsluzonaWBazie, odczytajNumer } from '@/lib/sklep/zamowienie';
import { linkPobrania } from '@/lib/sklep/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bezCache = { headers: { 'Cache-Control': 'no-store' } };

export async function GET(req: Request) {
  const s = new URL(req.url).searchParams.get('s') || '';
  const numer = odczytajNumer(s);
  if (!numer || !produktAktywny(numer.produkt.id)) return Response.json({ stan: 'nieznane' }, { status: 400 });
  const oplacone = () => Response.json({ stan: 'oplacone', link: linkPobrania(s).url }, bezCache);
  try {
    const [zCiastka, orderId] = decodeURIComponent((await cookies()).get(CIASTKO_ZAMOWIENIA)?.value || '').split('~');
    if (zCiastka === s && orderId) {
      const z = await pobierz(orderId);
      if (z.status === 'COMPLETED' && z.extOrderId === s) return oplacone();
      if (z.status === 'CANCELED') return Response.json({ stan: 'anulowane' }, bezCache);
    }
    if (await obsluzonaWBazie(s)) return oplacone();
  } catch {
    // błąd PayU – strona spyta ponownie za chwilę
  }
  return Response.json({ stan: 'czeka' }, bezCache);
}
