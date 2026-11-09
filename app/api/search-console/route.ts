// Panel admina → SEO → „Raport z Google”: ruch z wyszukiwarki (?raport=ruch&dni=28) i stan indeksowania kart (?raport=indeks).
import { toAdmin, tokenZZapytania } from '@/lib/admin-dostep';
import { site } from '@/config/site';
import { getAllModels } from '@/lib/models';
import { ocenyKarty } from '@/lib/plusy-minusy';
import { gscSkonfigurowane, raportWyszukiwania, stanIndeksu } from '@/lib/search-console';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/** Strony do sprawdzania indeksu: strona główna + karty z zatwierdzonymi „Plusami i minusami” (od najpopularniejszych) */
function wazneAdresy(): string[] {
  const karty = getAllModels()
    .filter((m) => ocenyKarty(m).length)
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce)
    .map((m) => site.url + m.adres);
  return [`${site.url}/`, ...karty].slice(0, 50);
}

export async function GET(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  if (!gscSkonfigurowane()) return json({ blad: 'brak-klucza' });
  const u = new URL(req.url);
  try {
    if (u.searchParams.get('raport') === 'indeks') return json({ strony: await stanIndeksu(wazneAdresy()) });
    const dni = Number(u.searchParams.get('dni'));
    return json(await raportWyszukiwania([7, 28, 90].includes(dni) ? dni : 28));
  } catch (e) {
    return json({ blad: (e as Error).message });
  }
}
