import { potwierdz, poprawnyToken } from '@/lib/przypomnienia';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get('t') || '';
  let status = 'blad';
  if (poprawnyToken(t)) {
    try {
      status = (await potwierdz(t)) ? 'potwierdzone' : 'wygaslo';
    } catch {
      status = 'blad';
    }
  }
  return Response.redirect(new URL(`/przypomnienia/?status=${status}`, req.url), 303);
}
