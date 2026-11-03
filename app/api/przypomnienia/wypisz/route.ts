// Wypisanie: usuwa wszystkie dane od razu. GET – link w e-mailu, POST – „wypisz jednym kliknięciem” w programach pocztowych.
import { usun, poprawnyToken } from '@/lib/przypomnienia';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function wypisz(req: Request) {
  const t = new URL(req.url).searchParams.get('t') || '';
  if (!poprawnyToken(t)) return false;
  try {
    await usun(t);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const ok = await wypisz(req);
  return Response.redirect(new URL(`/przypomnienia/?status=${ok ? 'wypisano' : 'blad'}`, req.url), 303);
}

export async function POST(req: Request) {
  const ok = await wypisz(req);
  return new Response(ok ? 'OK' : 'Błąd', { status: ok ? 200 : 400 });
}
