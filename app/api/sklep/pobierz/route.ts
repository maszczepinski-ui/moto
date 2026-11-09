// Pobieranie pakietu: sprawdzamy podpis i termin linku, potem serwer sam przesyła plik (adres pliku nie trafia do klienta).
// Plik leży POZA repozytorium (repo jest publiczne) – jego adres zna tylko Vercel (PAKIET_URL, PAKIET_SZKODA_URL).
// Który plik wysłać, wynika z numeru zamówienia (NB… = Niezbędnik, NS… = pakiet po szkodzie).
import { produktAktywny, env } from '@/lib/sklep/konfiguracja';
import { site } from '@/config/site';
import { odczytajNumer } from '@/lib/sklep/zamowienie';
import { PRODUKTY, type Produkt } from '@/lib/sklep/produkty';
import { sprawdzLink } from '@/lib/sklep/link';
import { plikSklepu } from '@/lib/sklep/plik-prywatny';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const strona = (tytul: string, tresc: string, status: number, p: Produkt = PRODUKTY.niezbednik) =>
  new Response(
    `<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${tytul}</title><body style="font-family:system-ui,sans-serif;max-width:520px;margin:48px auto;padding:0 16px;color:#0f172a"><h1 style="font-size:22px">${tytul}</h1><p>${tresc}</p><p><a href="${site.url}${p.sciezka}">Wróć do strony pakietu</a></p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const p = odczytajNumer(q.get('s') || '')?.produkt;
  if (!p || !produktAktywny(p.id)) return strona('Pobieranie niedostępne', 'Sprzedaż jeszcze nie ruszyła albo link jest niepełny.', 503);
  const wynik = sprawdzLink(q.get('s'), q.get('w'), q.get('p'));
  if (wynik === 'wygasl') return strona('Link wygasł', 'Ten link do pobrania stracił ważność. Odpisz na maila z zamówieniem – wyślemy nowy.', 410, p);
  if (wynik !== 'ok') return strona('Niepoprawny link', 'Skopiuj link z maila w całości albo kliknij przycisk w mailu.', 400, p);
  const plik = await plikSklepu(env(p.plikEnv)).catch((e) => {
    console.error('[sklep] pobieranie pakietu', e);
    return null;
  });
  if (!plik) return strona('Chwilowy problem z plikiem', 'Nie udało się pobrać pakietu. Spróbuj za kilka minut albo odpisz na maila z zamówieniem.', 502, p);
  return new Response(plik.stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${p.nazwaPliku}"`,
      ...(plik.rozmiar ? { 'Content-Length': String(plik.rozmiar) } : {}),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
