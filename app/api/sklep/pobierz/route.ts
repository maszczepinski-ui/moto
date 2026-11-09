// Pobieranie pakietu: sprawdzamy podpis i termin linku, potem serwer sam przesyła plik (adres pliku nie trafia do klienta).
// Plik leży POZA repozytorium (repo jest publiczne) – jego adres zna tylko Vercel (zmienna PAKIET_URL).
import { sklepAktywny, env, ADRES_SKLEPU } from '@/lib/sklep/konfiguracja';
import { sprawdzLink } from '@/lib/sklep/link';
import { plikSklepu } from '@/lib/sklep/plik-prywatny';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const strona = (tytul: string, tresc: string, status: number) =>
  new Response(
    `<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${tytul}</title><body style="font-family:system-ui,sans-serif;max-width:520px;margin:48px auto;padding:0 16px;color:#0f172a"><h1 style="font-size:22px">${tytul}</h1><p>${tresc}</p><p><a href="${ADRES_SKLEPU}">Wróć do strony Niezbędnika</a></p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );

export async function GET(req: Request) {
  if (!sklepAktywny()) return strona('Pobieranie niedostępne', 'Sprzedaż jeszcze nie ruszyła.', 503);
  const q = new URL(req.url).searchParams;
  const wynik = sprawdzLink(q.get('s'), q.get('w'), q.get('p'));
  if (wynik === 'wygasl') return strona('Link wygasł', 'Ten link do pobrania stracił ważność. Odpisz na maila z zamówieniem – wyślemy nowy.', 410);
  if (wynik !== 'ok') return strona('Niepoprawny link', 'Skopiuj link z maila w całości albo kliknij przycisk w mailu.', 400);
  const plik = await plikSklepu(env('PAKIET_URL')).catch((e) => {
    console.error('[sklep] pobieranie pakietu', e);
    return null;
  });
  if (!plik) return strona('Chwilowy problem z plikiem', 'Nie udało się pobrać pakietu. Spróbuj za kilka minut albo odpisz na maila z zamówieniem.', 502);
  return new Response(plik.stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="niezbednik-bezpiecznego-zakupu-auta.zip"',
      ...(plik.rozmiar ? { 'Content-Length': String(plik.rozmiar) } : {}),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
