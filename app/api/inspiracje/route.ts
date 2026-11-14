// Inspiracje do aktualności: najnowsze nagłówki z kanałów RSS (config/zrodla-inspiracji.json).
// Tylko dla panelu admina (token GitHub z prawem zapisu). Na stronie publicznej nic z tego się nie pokazuje.
import { toAdmin, tokenZZapytania } from '@/lib/admin-dostep';
import { czytajKanal, type WpisRss } from '@/lib/rss';
import zrodla from '@/config/zrodla-inspiracji.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Kanal = { nazwa: string; rss: string; jezyk: string; wlaczony: boolean };
type Wynik = { wpisy: WpisRss[]; kanaly: { nazwa: string; ok: boolean; ile: number; blad?: string }[]; pobrano: string };

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

// Pamięć podręczna na 10 minut – żeby nie odpytywać serwisów przy każdym kliknięciu
let pamiec: { klucz: string; czas: number; wynik: Wynik } | null = null;

async function pobierz(k: Kanal) {
  const r = await fetch(k.rss, {
    headers: { 'User-Agent': 'MotoRaportPanel/1.0 (+https://moto-raport.pl)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(8000),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(`serwer odpowiedział ${r.status}`);
  return czytajKanal(await r.text(), k.nazwa, k.jezyk);
}

export async function GET(req: Request) {
  if (!(await toAdmin(tokenZZapytania(req)))) return json({ blad: 'Brak dostępu – zaloguj się w panelu tokenem GitHub.' }, 401);
  const adres = new URL(req.url);
  // panel może podać własną listę kanałów (np. świeżo zmienioną, zanim strona się przebuduje)
  let kanaly = (zrodla.kanaly as Kanal[]).filter((k) => k.wlaczony);
  const wlasne = adres.searchParams.get('kanaly');
  if (wlasne) {
    try {
      const lista = (JSON.parse(wlasne) as Kanal[]).filter((k) => k.wlaczony && /^https:\/\//.test(k.rss)).slice(0, 15);
      kanaly = lista;
    } catch {
      /* zła lista – zostają kanały z pliku */
    }
  }
  const klucz = JSON.stringify(kanaly.map((k) => k.rss));
  if (!adres.searchParams.has('odswiez') && pamiec && pamiec.klucz === klucz && Date.now() - pamiec.czas < 10 * 60 * 1000) return json(pamiec.wynik);

  const wyniki = await Promise.allSettled(kanaly.map(pobierz));
  const wpisy: WpisRss[] = [];
  const raport = kanaly.map((k, i) => {
    const w = wyniki[i];
    if (w.status === 'fulfilled') {
      wpisy.push(...w.value.slice(0, 30));
      return { nazwa: k.nazwa, ok: true, ile: w.value.length };
    }
    return { nazwa: k.nazwa, ok: false, ile: 0, blad: (w.reason as Error)?.message || 'błąd pobierania' };
  });
  // najnowsze na górze, bez powtórek tego samego linku
  const widziane = new Set<string>();
  const lista = wpisy
    .filter((w) => (widziane.has(w.link) ? false : (widziane.add(w.link), true)))
    .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
    .slice(0, 120);
  const wynik: Wynik = { wpisy: lista, kanaly: raport, pobrano: new Date().toISOString() };
  pamiec = { klucz, czas: Date.now(), wynik };
  return json(wynik);
}
