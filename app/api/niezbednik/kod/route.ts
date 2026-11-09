// Kalkulator: wysyłka 6-cyfrowego kodu na e-mail z zamówienia. Zawsze ta sama odpowiedź – nie zdradzamy, kto kupował.
import { kalkulatorAktywny, mailKodu, nowyKod } from '@/lib/sklep/kalkulator';
import { wyslijMail } from '@/lib/sklep/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!kalkulatorAktywny()) return Response.json({ blad: 'Kalkulator jest jeszcze wyłączony.' }, { status: 503 });
  const { email: surowy } = (await req.json().catch(() => ({}))) as { email?: string };
  const email = typeof surowy === 'string' ? surowy.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return Response.json({ blad: 'Wpisz poprawny adres e-mail.' }, { status: 400 });
  try {
    const kod = await nowyKod(email);
    if (kod) {
      const m = mailKodu(kod);
      await wyslijMail(email, `Kod do kalkulatora Niezbędnika: ${kod}`, m.html, m.tekst);
    }
  } catch (e) {
    console.error('[kalkulator] kod', e);
    return Response.json({ blad: 'Nie udało się wysłać kodu. Spróbuj za chwilę.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
