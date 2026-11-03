// Codzienna wysyłka przypomnień – uruchamia ją Vercel Cron (plik vercel.json). Bez poprawnego CRON_SECRET nic nie robi.
import { przypomnieniaWlaczone, wyslijZalegle } from '@/lib/przypomnienia';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: Request) {
  const sekret = process.env.CRON_SECRET;
  if (!sekret || req.headers.get('authorization') !== `Bearer ${sekret}`) return new Response('Brak dostępu', { status: 401 });
  if (!przypomnieniaWlaczone()) return Response.json({ pominieto: 'przypomnienia wyłączone' });
  return Response.json(await wyslijZalegle());
}
