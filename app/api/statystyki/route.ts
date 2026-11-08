// Statystyki GA4 dla zakładki „Statystyki” w panelu admina.
// Dostęp tylko dla osoby z prawem zapisu do repozytorium strony (ten sam token GitHub, którym logujesz się do panelu).
import { site } from '@/config/site';
import { ga4Skonfigurowane, pobierzStatystyki } from '@/lib/ga4';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/** Czy token GitHub należy do kogoś, kto może zapisywać w repozytorium strony */
async function toAdmin(token: string): Promise<boolean> {
  if (!token || token.length > 300) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${site.githubRepo}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!r.ok) return false;
    const j = (await r.json()) as { permissions?: { push?: boolean } };
    return j.permissions?.push === true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!(await toAdmin(token))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  if (!ga4Skonfigurowane()) return json({ blad: 'brak-konfiguracji' }, 503);
  const dni = Number(new URL(req.url).searchParams.get('dni'));
  try {
    return json(await pobierzStatystyki([7, 28, 90].includes(dni) ? dni : 28));
  } catch (e) {
    return json({ blad: (e as Error).message }, 502);
  }
}
