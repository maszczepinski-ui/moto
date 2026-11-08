// Krok 1: formularz z /niezbednik/ → rejestracja płatności w Przelewy24 → adres bramki płatności.
import { site } from '@/config/site';
import { PRODUKT, sklepAktywny } from '@/lib/sklep/konfiguracja';
import { zarejestruj } from '@/lib/sklep/p24';
import { nowyNumer, poprawnyNip } from '@/lib/sklep/zamowienie';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (d: unknown, status = 200) => Response.json(d, { status, headers: { 'Cache-Control': 'no-store' } });
const tekst = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  if (!sklepAktywny()) return json({ blad: 'Sprzedaż jeszcze nie ruszyła.' }, 503);
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ blad: 'Niepoprawne dane formularza.' }, 400);
  }
  // obie zgody są obowiązkowe (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta)
  if (b.zgodaRegulamin !== true || b.zgodaTresci !== true) return json({ blad: 'Zaznacz obie zgody, żeby przejść do płatności.' }, 400);
  const email = tekst(b.email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ blad: 'Wpisz poprawny adres e-mail – na niego wyślemy pakiet.' }, 400);
  const naFirme = b.naFirme === true;
  const klient = tekst(naFirme ? b.firma : b.imieNazwisko, 120);
  if (klient.length < 3) return json({ blad: naFirme ? 'Wpisz nazwę firmy.' : 'Wpisz imię i nazwisko – potrzebne do faktury.' }, 400);
  let nip: string | null = null;
  let adres = '',
    kod = '',
    miasto = '';
  if (naFirme) {
    nip = tekst(b.nip, 20).replace(/[^\d]/g, '');
    if (!poprawnyNip(nip)) return json({ blad: 'Sprawdź NIP – powinien mieć 10 cyfr.' }, 400);
    adres = tekst(b.adres, 120);
    kod = tekst(b.kod, 10);
    miasto = tekst(b.miasto, 60);
    if (!adres || !/^\d{2}-\d{3}$/.test(kod) || !miasto) return json({ blad: 'Uzupełnij adres firmy (ulica, kod w formacie 00-000, miasto).' }, 400);
  }
  const sessionId = nowyNumer(nip);
  try {
    const url = await zarejestruj({
      sessionId,
      kwotaGr: PRODUKT.cenaGr,
      opis: PRODUKT.nazwa,
      email,
      klient,
      adres,
      kod,
      miasto,
      urlPowrotu: `${site.url}/niezbednik/dziekujemy/?s=${encodeURIComponent(sessionId)}`,
      urlStatusu: `${site.url}/api/sklep/p24/`
    });
    return json({ url });
  } catch (e) {
    console.error('[sklep] rejestracja P24', e);
    return json({ blad: 'Nie udało się połączyć z Przelewy24. Spróbuj za chwilę.' }, 502);
  }
}
