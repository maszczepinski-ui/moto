// Zapis na przypomnienia o OC / przeglądzie. Wysyła e-mail z linkiem potwierdzającym (podwójna zgoda).
import { createHash } from 'crypto';
import { redis } from '@/lib/magazyn';
import { przypomnieniaWlaczone, poprawnyEmail, poprawnaData, zapiszNowy, czytaj, wyslijPotwierdzenie } from '@/lib/przypomnienia';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function POST(req: Request) {
  if (!przypomnieniaWlaczone()) return json({ blad: 'Przypomnienia nie są jeszcze włączone' }, 503);
  if (Number(req.headers.get('content-length') || 0) > 1000) return json({ blad: 'Za dużo danych' }, 413);
  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return json({ blad: 'Nieprawidłowe dane' }, 400);
  }
  if (d.strona || Number(d.czas) < 2500) return json({ ok: true }); // pułapka na boty
  const email = String(d.email || '').trim().toLowerCase();
  const oc = String(d.oc || '');
  const przeglad = String(d.przeglad || '');
  if (!poprawnyEmail(email)) return json({ blad: 'Sprawdź adres e-mail' }, 400);
  if (!poprawnaData(oc) || !poprawnaData(przeglad)) return json({ blad: 'Nieprawidłowa data' }, 400);
  if (!oc && !przeglad) return json({ blad: 'Podaj datę końca OC albo przeglądu' }, 400);
  if (d.zgoda !== true) return json({ blad: 'Zaznacz zgodę na wysyłanie przypomnień' }, 400);

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'nieznany';
  const skrot = createHash('sha256').update(`${ip}|${process.env.SPALANIE_SOL || 'moto-format'}`).digest('hex').slice(0, 32);
  try {
    const [licznik] = await redis([['INCR', `limit-przyp:${skrot}`], ['EXPIRE', `limit-przyp:${skrot}`, 3600]]);
    if (Number(licznik) > 5) return json({ blad: 'Za dużo prób – spróbuj za godzinę' }, 429);
    const t = await zapiszNowy(email, oc, przeglad);
    await wyslijPotwierdzenie(t, (await czytaj(t))!);
    return json({ ok: true });
  } catch {
    return json({ blad: 'Chwilowy problem – spróbuj za kilka minut' }, 502);
  }
}
