// Panel admina → SEO → „Mapa strony”: podgląd (GET) i ręczne zgłoszenie w Google Search Console (POST).
import { toAdmin, tokenZZapytania } from '@/lib/admin-dostep';
import { podsumowanieMap } from '@/lib/sitemapy';
import { ADRES_MAPY, gscSkonfigurowane, stanMapyGoogle, zglosMapeGoogle } from '@/lib/search-console';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function odpowiedz(zglos: boolean) {
  const mapa = { ...podsumowanieMap(), adres: ADRES_MAPY, zbudowano: process.env.CZAS_BUDOWY || null };
  if (!gscSkonfigurowane()) return json({ mapa, google: null, blad: 'brak-klucza' });
  try {
    return json({ mapa, google: zglos ? await zglosMapeGoogle() : await stanMapyGoogle() });
  } catch (e) {
    return json({ mapa, google: null, blad: (e as Error).message });
  }
}

export async function GET(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  return odpowiedz(false);
}

export async function POST(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  return odpowiedz(true);
}
