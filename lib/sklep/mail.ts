// Maile przez Resend (https://resend.com): link do pobrania + potwierdzenie zakupu i zgód (wymóg „trwałego nośnika”).
import { env } from './konfiguracja';

export async function wyslijMail(do_: string, temat: string, html: string, tekst: string) {
  // RESEND_URL – tylko do testów
  const r = await fetch(process.env.RESEND_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('MAIL_OD'), to: [do_], subject: temat, html, text: tekst, ...(process.env.MAIL_KOPIA ? { bcc: [process.env.MAIL_KOPIA] } : {}) }),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(`Resend: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function mailZakupu(d: { produkt: string; kwota: string; numer: string; link: string; wazneDo: Date; czasZgod: Date; wersjaZgod: string; regulamin: string }) {
  const kiedy = (x: Date) => x.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw', dateStyle: 'long', timeStyle: 'short' });
  const zgody = [
    `Akceptacja regulaminu sklepu (wersja ${d.wersjaZgod}): ${d.regulamin}`,
    'Żądanie dostarczenia plików przed upływem 14 dni na odstąpienie od umowy i przyjęcie do wiadomości, że po ich dostarczeniu traci się prawo odstąpienia od umowy.'
  ];
  const tekst = [
    `Dziękujemy za zakup: ${d.produkt}`,
    `Zamówienie: ${d.numer}, kwota: ${d.kwota}.`,
    '',
    `Pobierz pakiet (link ważny do ${kiedy(d.wazneDo)}):`,
    d.link,
    '',
    'Potwierdzenie zawarcia umowy i złożonych oświadczeń',
    `Data i godzina: ${kiedy(d.czasZgod)}`,
    ...zgody.map((z) => `– ${z}`),
    '',
    'Fakturę wyślemy osobnym mailem z systemu inFakt.'
  ].join('\n');
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#0f172a">
<h2 style="margin:0 0 12px">Dziękujemy za zakup!</h2>
<p>${esc(d.produkt)}<br>Zamówienie <b>${esc(d.numer)}</b>, kwota <b>${esc(d.kwota)}</b>.</p>
<p><a href="${esc(d.link)}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600">Pobierz pakiet</a></p>
<p style="font-size:13px;color:#475569">Link jest ważny do ${esc(kiedy(d.wazneDo))}. Zapisz pliki na telefonie i komputerze.</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0">
<p style="font-size:13px"><b>Potwierdzenie zawarcia umowy i złożonych oświadczeń</b><br>Data i godzina: ${esc(kiedy(d.czasZgod))}</p>
<ul style="font-size:13px;padding-left:18px">${zgody.map((z) => `<li>${esc(z)}</li>`).join('')}</ul>
<p style="font-size:13px;color:#475569">Fakturę wyślemy osobnym mailem z systemu inFakt.</p></div>`;
  return { html, tekst };
}
