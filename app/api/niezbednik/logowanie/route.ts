// Kalkulator: sprawdzenie kodu i zalogowanie urządzenia (ciasteczko na rok).
import { ciasteczko, kalkulatorAktywny, zaloguj } from '@/lib/sklep/kalkulator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!kalkulatorAktywny()) return Response.json({ blad: 'Kalkulator jest jeszcze wyłączony.' }, { status: 503 });
  const { email, kod } = (await req.json().catch(() => ({}))) as { email?: string; kod?: string };
  if (!email || !kod) return Response.json({ blad: 'Wpisz e-mail i kod.' }, { status: 400 });
  const w = await zaloguj(email, kod.replace(/\s/g, ''));
  if (w === 'limit') return Response.json({ blad: 'Za dużo prób. Poproś o nowy kod za kwadrans.' }, { status: 429 });
  if (w === 'zly') return Response.json({ blad: 'Kod jest nieprawidłowy albo wygasł.' }, { status: 401 });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': ciasteczko(w), 'Cache-Control': 'no-store' } });
}
