// Krok 2: powiadomienie z PayU o zmianie stanu zamówienia.
// 1) sprawdzamy podpis (OpenPayu-Signature), 2) pobieramy zamówienie z PayU i sprawdzamy status COMPLETED,
// 3) odpowiadamy 200, 4) dopiero potem, w tle: mail z linkiem do pobrania i faktura „zw” w inFakt.
// Odpowiedź inna niż 200 = PayU ponowi powiadomienie później.
import { after } from 'next/server';
import { produktAktywny, zlotowki } from '@/lib/sklep/konfiguracja';
import { site } from '@/config/site';
import { odbierz, pobierz, poprawnyPodpis, type Zamowienie } from '@/lib/sklep/payu';
import { odczytajDaneKlienta, odczytajNumer } from '@/lib/sklep/zamowienie';
import { linkPobrania } from '@/lib/sklep/link';
import { mailZakupu, wyslijMail } from '@/lib/sklep/mail';
import { wystawFakture } from '@/lib/sklep/infakt';
import { pierwszaObsluga, zapiszKupujacego, narzedzieAktywne } from '@/lib/sklep/kalkulator';

/** Opis narzędzia w mailu po zakupie */
const OPIS_NARZEDZIA = { niezbednik: 'koszty po zakupie i argumenty do negocjacji', szkoda: 'sprawdzenie kosztorysu i gotowe pisma do ubezpieczyciela' } as const;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** te same powiadomienia mogą przyjść drugi raz – pamiętamy obsłużone (w obrębie jednej instancji funkcji) */
const obsluzone = new Set<string>();

async function poOplaceniu(z: Zamowienie) {
  const sessionId = z.extOrderId;
  const numer = odczytajNumer(sessionId)!;
  const produkt = numer.produkt;
  // gdy jest baza: zapamiętujemy obsłużone płatności – PayU może wysłać powiadomienie drugi raz (bez tego: podwójna faktura)
  if (!(await pierwszaObsluga(sessionId))) return;
  await zapiszKupujacego(z.email, sessionId, produkt.id).catch((e) => console.error('[sklep] zapis kupującego', e));
  const { url, wazneDo } = linkPobrania(sessionId);
  // najpierw mail z plikami – kupujący nie czeka na fakturę
  const m = mailZakupu({
    produkt: produkt.nazwa,
    kwota: zlotowki(z.kwotaGr),
    numer: sessionId,
    link: url,
    wazneDo,
    czasZgod: numer.czasZgod,
    wersjaZgod: numer.wersjaZgod,
    regulamin: `${site.url}/niezbednik/regulamin/`,
    narzedzie: narzedzieAktywne(produkt.id) ? { nazwa: produkt.narzedzie.nazwa, opis: OPIS_NARZEDZIA[produkt.id], url: `${site.url}${produkt.narzedzie.sciezka}` } : undefined
  });
  await wyslijMail(z.email, produkt.tematMaila, m.html, m.tekst);
  try {
    // dane do faktury: najpierw z naszej bazy (jeśli jest), potem z PayU
    const d = (await odczytajDaneKlienta(sessionId)) || { klient: z.klient, adres: z.adres, kod: z.kod, miasto: z.miasto };
    if (!d.klient) throw new Error('Brak imienia i nazwiska / nazwy firmy w danych zamówienia');
    if (numer.nip && (!d.adres || !d.kod || !d.miasto)) throw new Error(`Brak adresu firmy (NIP ${numer.nip}) w danych zamówienia`);
    const f = await wystawFakture({
      numerZamowienia: sessionId,
      nazwaPozycji: produkt.pozycja,
      kwotaGr: z.kwotaGr,
      email: z.email,
      klient: d.klient,
      nip: numer.nip,
      adres: d.adres || undefined,
      kod: d.kod || undefined,
      miasto: d.miasto || undefined,
      dataSprzedazy: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date())
    });
    console.log('[sklep] faktura', f.numer, sessionId);
  } catch (e) {
    // pliki już poszły – faktura do ręcznego wystawienia; dajemy znać właścicielowi
    console.error('[sklep] faktura', sessionId, e);
    if (process.env.MAIL_KOPIA)
      await wyslijMail(process.env.MAIL_KOPIA, `Sklep: wystaw fakturę ręcznie (${sessionId})`, `<p>Nie udało się wystawić faktury w inFakt (PayU: ${z.orderId}).</p><pre>${String(e)}</pre>`, `Nie udało się wystawić faktury w inFakt (PayU: ${z.orderId}).\n${String(e)}`).catch(() => {});
  }
}

export async function POST(req: Request) {
  const tresc = await req.text();
  let p: { order?: { orderId?: string; extOrderId?: string; status?: string } };
  try {
    p = JSON.parse(tresc);
  } catch {
    return new Response('zły format', { status: 400 });
  }
  // PayU wysyła też inne powiadomienia (np. o zwrotach) – bez „order” nie mamy nic do zrobienia
  if (!p?.order?.orderId) return new Response('OK');
  // produkt rozpoznajemy po początku numeru zamówienia (NB… / NS…)
  const numer = odczytajNumer(typeof p.order.extOrderId === 'string' ? p.order.extOrderId : '');
  if (numer && !produktAktywny(numer.produkt.id)) return new Response('sklep wyłączony', { status: 503 });
  const naglowek = req.headers.get('openpayu-signature') || req.headers.get('x-openpayu-signature');
  if (!numer || !poprawnyPodpis(tresc, naglowek)) {
    console.warn('[sklep] powiadomienie z błędnym podpisem albo numerem', p.order.extOrderId, req.headers.get('x-forwarded-for'));
    return new Response('zły podpis', { status: 400 });
  }
  const orderId = p.order.orderId;
  if (obsluzone.has(orderId)) return new Response('OK');
  let z: Zamowienie;
  try {
    z = await pobierz(orderId);
    // autoodbiór wyłączony w panelu PayU → potwierdzamy sami i czekamy na kolejne powiadomienie (COMPLETED)
    if (z.status === 'WAITING_FOR_CONFIRMATION') {
      if (z.extOrderId === p.order.extOrderId && z.waluta === 'PLN' && z.kwotaGr === numer.produkt.cenaGr) await odbierz(orderId);
      return new Response('OK');
    }
  } catch (e) {
    console.error('[sklep] pobranie zamówienia PayU', orderId, e);
    return new Response('błąd PayU', { status: 502 }); // PayU ponowi powiadomienie
  }
  // NEW / PENDING / CANCELED – nic nie robimy
  if (z.status !== 'COMPLETED') return new Response('OK');
  if (z.extOrderId !== p.order.extOrderId || z.waluta !== 'PLN' || z.kwotaGr !== numer.produkt.cenaGr) {
    console.error('[sklep] nieznane zamówienie albo kwota', z.extOrderId, z.kwotaGr);
    return new Response('nieznane zamówienie', { status: 400 });
  }
  obsluzone.add(orderId);
  after(() =>
    poOplaceniu(z).catch((e) => {
      console.error('[sklep] po opłaceniu', z.extOrderId, e);
    })
  );
  return new Response('OK');
}
