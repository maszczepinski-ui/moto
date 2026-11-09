// Kalkulator: dane (ceny, argumenty) tylko dla zalogowanego kupującego.
import { daneKalkulatora, kalkulatorAktywny, sesja } from '@/lib/sklep/kalkulator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!kalkulatorAktywny()) return Response.json({ blad: 'wylaczony' }, { status: 503 });
  const s = await sesja(req);
  if (!s) return Response.json({ blad: 'zaloguj' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    return Response.json({ email: s.email, dane: await daneKalkulatora() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (e) {
    console.error('[kalkulator] dane', e);
    return Response.json({ blad: 'dane' }, { status: 502 });
  }
}
