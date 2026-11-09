// Wspólna obsługa logowania i danych narzędzi dla kupujących (kalkulator Niezbędnika, Sprawdzacz kosztorysu).
// Każdy produkt ma własne adresy API (app/api/niezbednik/*, app/api/po-szkodzie/*), które tylko wywołują te funkcje.
import { ciasteczko, daneNarzedzia, mailKodu, narzedzieAktywne, nowyKod, sesja, zaloguj } from './kalkulator';
import { wyslijMail } from './mail';
import type { IdProduktu } from './produkty';

const WYLACZONE = 'Narzędzie ruszy razem ze sprzedażą pakietu.';

/** Wysyłka 6-cyfrowego kodu. Zawsze ta sama odpowiedź – nie zdradzamy, kto kupował. */
export async function obsluzKod(req: Request, p: IdProduktu) {
  if (!narzedzieAktywne(p)) return Response.json({ blad: WYLACZONE }, { status: 503 });
  const { email: surowy } = (await req.json().catch(() => ({}))) as { email?: string };
  const email = typeof surowy === 'string' ? surowy.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return Response.json({ blad: 'Wpisz poprawny adres e-mail.' }, { status: 400 });
  try {
    const kod = await nowyKod(email, p);
    if (kod) {
      const m = mailKodu(kod, p);
      await wyslijMail(email, m.temat, m.html, m.tekst);
    }
  } catch (e) {
    console.error(`[${p}] kod`, e);
    return Response.json({ blad: 'Nie udało się wysłać kodu. Spróbuj za chwilę.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}

/** Sprawdzenie kodu i zalogowanie urządzenia (ciasteczko na rok) */
export async function obsluzLogowanie(req: Request, p: IdProduktu) {
  if (!narzedzieAktywne(p)) return Response.json({ blad: WYLACZONE }, { status: 503 });
  const { email, kod } = (await req.json().catch(() => ({}))) as { email?: string; kod?: string };
  if (!email || !kod) return Response.json({ blad: 'Wpisz e-mail i kod.' }, { status: 400 });
  const w = await zaloguj(email, kod.replace(/\s/g, ''), p);
  if (w === 'limit') return Response.json({ blad: 'Za dużo prób. Poproś o nowy kod za kwadrans.' }, { status: 429 });
  if (w === 'zly') return Response.json({ blad: 'Kod jest nieprawidłowy albo wygasł.' }, { status: 401 });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': ciasteczko(w, false, p), 'Cache-Control': 'no-store' } });
}

/** Dane narzędzia tylko dla zalogowanego kupującego */
export async function obsluzDane(req: Request, p: IdProduktu) {
  if (!narzedzieAktywne(p)) return Response.json({ blad: 'wylaczony' }, { status: 503 });
  const s = await sesja(req, p);
  if (!s) return Response.json({ blad: 'zaloguj' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    return Response.json({ email: s.email, dane: await daneNarzedzia(p) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (e) {
    console.error(`[${p}] dane`, e);
    return Response.json({ blad: 'dane' }, { status: 502 });
  }
}

export const obsluzWylogowanie = (p: IdProduktu) =>
  new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': ciasteczko('', true, p) } });
