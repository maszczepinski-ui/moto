// Lektor do rolek (zakładka „Social” w panelu): tekst → MP3 Twoim głosem z ElevenLabs + napisy .srt.
// Dostęp tylko dla osoby z prawem zapisu do repozytorium strony (token GitHub z panelu).
// GET  – sprawdzenie połączenia (nazwa głosu, pozostałe kredyty)
// POST – { tekst } → { mp3Base64, srt, czas }
import { toAdmin, tokenZZapytania } from '@/lib/admin-dostep';
import { generujLektora, lektorSkonfigurowany, sprawdzLektora, MAKS_ZNAKOW } from '@/lib/lektor';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function GET(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  if (!lektorSkonfigurowany()) return json({ blad: 'brak-konfiguracji' }, 503);
  try {
    return json(await sprawdzLektora());
  } catch (e) {
    return json({ blad: (e as Error).message }, 502);
  }
}

export async function POST(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  if (!lektorSkonfigurowany()) return json({ blad: 'brak-konfiguracji' }, 503);
  let tekst = '';
  try {
    tekst = String(((await req.json()) as { tekst?: unknown }).tekst || '').trim();
  } catch {
    /* zła treść zapytania */
  }
  if (!tekst) return json({ blad: 'Wpisz tekst lektora.' }, 400);
  if (tekst.length > MAKS_ZNAKOW) return json({ blad: `Tekst jest za długi (najwyżej ${MAKS_ZNAKOW} znaków).` }, 400);
  try {
    return json(await generujLektora(tekst));
  } catch (e) {
    return json({ blad: (e as Error).message }, 502);
  }
}
