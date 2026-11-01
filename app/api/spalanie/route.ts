// API raportów spalania: GET ?karta=slug – statystyki, POST – nowy raport.
// Ochrona przed spamem: ukryte pole-pułapka, minimalny czas wypełniania, limit zgłoszeń z jednego adresu IP,
// jeden raport dziennie dla danej karty z jednego adresu. Adres IP nie jest zapisywany – tylko jego skrót, na krótko.
import { createHash } from 'crypto';
import marki from '@/data/marki.json';
import { redis, magazynDostepny } from '@/lib/magazyn';
import { statystyki, Raport, Styl } from '@/lib/spalanie';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const KARTY = new Set(
  (marki as { marki: { modele: { slug: string; generacje: { slug: string }[] }[] }[] }).marki.flatMap((m) => m.modele.flatMap((x) => [x.slug, ...x.generacje.map((g) => g.slug)]))
);
const STYLE: Styl[] = ['miasto', 'trasa', 'mieszany'];
const LIMIT_GODZINA = 5;
const MAKS_RAPORTOW = 5000;

const json = (dane: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(dane), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache } });

function skrotIp(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'nieznany';
  return createHash('sha256').update(`${ip}|${process.env.SPALANIE_SOL || 'moto-format'}`).digest('hex').slice(0, 32);
}

export async function GET(req: Request) {
  if (!magazynDostepny()) return json({ blad: 'Raporty spalania nie są jeszcze włączone' }, 503);
  const karta = new URL(req.url).searchParams.get('karta') || '';
  if (!KARTY.has(karta)) return json({ blad: 'Nieznana karta' }, 404);
  try {
    const [lista] = await redis([['LRANGE', `spalanie:${karta}`, 0, -1]]);
    const raporty = ((lista as string[]) || []).map((x) => JSON.parse(x) as Raport);
    return json(statystyki(raporty), 200, 'public, s-maxage=300, stale-while-revalidate=600');
  } catch {
    return json({ blad: 'Chwilowy problem z bazą danych' }, 502);
  }
}

export async function POST(req: Request) {
  if (!magazynDostepny()) return json({ blad: 'Raporty spalania nie są jeszcze włączone' }, 503);
  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return json({ blad: 'Nieprawidłowe dane' }, 400);
  }
  // pułapka na boty: pole niewidoczne dla ludzi i za szybkie wysłanie formularza
  if (d.strona || Number(d.czas) < 3000) return json({ ok: true });
  const karta = String(d.karta || '');
  const wynik = Math.round(Number(String(d.wynik).replace(',', '.')) * 10) / 10;
  const styl = String(d.styl) as Styl;
  const elektryczny = !!d.elektryczny;
  if (!KARTY.has(karta)) return json({ blad: 'Nieznany model' }, 400);
  if (!STYLE.includes(styl)) return json({ blad: 'Wybierz styl jazdy' }, 400);
  if (!(wynik >= (elektryczny ? 8 : 2) && wynik <= (elektryczny ? 40 : 30))) return json({ blad: elektryczny ? 'Podaj zużycie od 8 do 40 kWh/100 km' : 'Podaj spalanie od 2 do 30 l/100 km' }, 400);
  const wersja = String(d.wersja || '').replace(/[<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const ip = skrotIp(req);
  try {
    const [licznik, , pierwszy] = await redis([
      ['INCR', `limit:${ip}`],
      ['EXPIRE', `limit:${ip}`, 3600],
      ['SET', `jeden:${ip}:${karta}`, 1, 'NX', 'EX', 86400]
    ]);
    if (Number(licznik) > LIMIT_GODZINA) return json({ blad: 'Za dużo zgłoszeń – spróbuj za godzinę' }, 429);
    if (pierwszy === null) return json({ blad: 'Dla tego modelu przyjęliśmy już dziś Twój raport – dziękujemy!' }, 429);
    const raport: Raport = { w: wynik, s: styl, l: d.lpg ? 1 : 0, v: wersja, d: new Date().toISOString().slice(0, 10) };
    await redis([
      ['LPUSH', `spalanie:${karta}`, JSON.stringify(raport)],
      ['LTRIM', `spalanie:${karta}`, 0, MAKS_RAPORTOW - 1]
    ]);
    return json({ ok: true });
  } catch {
    return json({ blad: 'Chwilowy problem z bazą danych – spróbuj później' }, 502);
  }
}
