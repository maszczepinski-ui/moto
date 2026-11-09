// Krok 2: powiadomienie z Przelewy24 o wpłacie.
// 1) sprawdzamy podpis, 2) potwierdzamy płatność w P24 (verify), 3) odpowiadamy 200,
// 4) dopiero potem, w tle: mail z linkiem do pobrania i faktura „zw” w inFakt.
import { after } from 'next/server';
import { PRODUKT, sklepAktywny, zlotowki, ADRES_SKLEPU } from '@/lib/sklep/konfiguracja';
import { poprawnePowiadomienie, weryfikuj, znajdz, type Powiadomienie } from '@/lib/sklep/p24';
import { odczytajNumer } from '@/lib/sklep/zamowienie';
import { linkPobrania } from '@/lib/sklep/link';
import { mailZakupu, wyslijMail } from '@/lib/sklep/mail';
import { wystawFakture } from '@/lib/sklep/infakt';
import { pierwszaObsluga, zapiszKupujacego, kalkulatorAktywny } from '@/lib/sklep/kalkulator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** te same powiadomienia mogą przyjść drugi raz – pamiętamy obsłużone (w obrębie jednej instancji funkcji) */
const obsluzone = new Set<string>();

async function poOplaceniu(sessionId: string) {
  const numer = odczytajNumer(sessionId)!;
  const t = await znajdz(sessionId);
  // gdy jest baza: zapamiętujemy obsłużone płatności – P24 może wysłać powiadomienie drugi raz (bez tego: podwójna faktura)
  if (!(await pierwszaObsluga(sessionId))) return;
  await zapiszKupujacego(t.clientEmail, sessionId).catch((e) => console.error('[sklep] zapis kupującego', e));
  const { url, wazneDo } = linkPobrania(sessionId);
  // najpierw mail z plikami – kupujący nie czeka na fakturę
  const m = mailZakupu({
    produkt: PRODUKT.nazwa,
    kwota: zlotowki(t.amount),
    numer: sessionId,
    link: url,
    wazneDo,
    czasZgod: numer.czasZgod,
    wersjaZgod: numer.wersjaZgod,
    regulamin: `${ADRES_SKLEPU}regulamin/`,
    kalkulator: kalkulatorAktywny() ? `${ADRES_SKLEPU}kalkulator/` : undefined
  });
  await wyslijMail(t.clientEmail, 'Twój Niezbędnik – link do pobrania', m.html, m.tekst);
  try {
    const f = await wystawFakture({
      numerZamowienia: sessionId,
      nazwaPozycji: PRODUKT.pozycja,
      kwotaGr: t.amount,
      email: t.clientEmail,
      klient: t.clientName,
      nip: numer.nip,
      adres: t.clientAddress || undefined,
      kod: t.clientPostcode || undefined,
      miasto: t.clientCity || undefined,
      dataSprzedazy: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date())
    });
    console.log('[sklep] faktura', f.numer, sessionId);
  } catch (e) {
    // pliki już poszły – faktura do ręcznego wystawienia; dajemy znać właścicielowi
    console.error('[sklep] faktura', sessionId, e);
    if (process.env.MAIL_KOPIA)
      await wyslijMail(process.env.MAIL_KOPIA, `Sklep: wystaw fakturę ręcznie (${sessionId})`, `<p>Nie udało się wystawić faktury w inFakt.</p><pre>${String(e)}</pre>`, `Nie udało się wystawić faktury w inFakt.\n${String(e)}`).catch(() => {});
  }
}

export async function POST(req: Request) {
  if (!sklepAktywny()) return new Response('sklep wyłączony', { status: 503 });
  let p: Powiadomienie;
  try {
    p = await req.json();
  } catch {
    return new Response('zły format', { status: 400 });
  }
  if (!poprawnePowiadomienie(p)) {
    console.warn('[sklep] powiadomienie z błędnym podpisem', p?.sessionId, req.headers.get('x-forwarded-for'));
    return new Response('zły podpis', { status: 400 });
  }
  if (!odczytajNumer(p.sessionId) || p.currency !== 'PLN' || p.amount !== PRODUKT.cenaGr) {
    console.error('[sklep] nieznane zamówienie albo kwota', p.sessionId, p.amount);
    return new Response('nieznane zamówienie', { status: 400 });
  }
  if (obsluzone.has(p.sessionId)) return new Response('OK');
  try {
    await weryfikuj({ sessionId: p.sessionId, orderId: p.orderId, amount: p.amount });
  } catch (e) {
    console.error('[sklep] weryfikacja P24', p.sessionId, e);
    return new Response('weryfikacja nieudana', { status: 502 }); // P24 ponowi powiadomienie
  }
  obsluzone.add(p.sessionId);
  after(() =>
    poOplaceniu(p.sessionId).catch((e) => {
      console.error('[sklep] po opłaceniu', p.sessionId, e);
    })
  );
  return new Response('OK');
}
