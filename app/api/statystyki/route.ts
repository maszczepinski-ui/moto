// Statystyki GA4 dla zakładki „Statystyki” w panelu admina.
// Dostęp tylko dla osoby z prawem zapisu do repozytorium strony (ten sam token GitHub, którym logujesz się do panelu).
import { toAdmin } from '@/lib/admin-dostep';
import { ga4Skonfigurowane, pobierzOdslonyKart, pobierzStatystyki } from '@/lib/ga4';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function GET(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!(await toAdmin(token))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  if (!ga4Skonfigurowane()) return json({ blad: 'brak-konfiguracji' }, 503);
  const adres = new URL(req.url);
  const dni = Number(adres.searchParams.get('dni'));
  const okres = [7, 28, 90].includes(dni) ? dni : 28;
  try {
    if (adres.searchParams.get('raport') === 'karty') return json({ strony: await pobierzOdslonyKart(okres) });
    return json(await pobierzStatystyki(okres));
  } catch (e) {
    return json({ blad: (e as Error).message }, 502);
  }
}
