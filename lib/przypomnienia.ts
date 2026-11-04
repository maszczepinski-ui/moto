// Przypomnienia e-mail o końcu OC i terminie przeglądu.
//
// Jak to działa:
// 1. Ktoś wpisuje e-mail i daty → zapisujemy wpis NIEPOTWIERDZONY (znika sam po 7 dniach) i wysyłamy e-mail z linkiem potwierdzającym.
// 2. Kliknięcie linku potwierdza zapis (podwójna zgoda – tak każe dobra praktyka RODO i to chroni przed zapisywaniem cudzych adresów).
// 3. Raz dziennie automat (Vercel Cron) wysyła przypomnienia: 21 dni i 3 dni przed terminem. Po terminie data przesuwa się o rok.
// 4. Każdy e-mail ma link „wypisz się” – usuwa wszystkie dane od razu.
//
// Potrzebne zmienne w Vercel (Settings → Environment Variables):
//   RESEND_API_KEY            – klucz z resend.com (darmowo do 3000 e-maili miesięcznie)
//   PRZYPOMNIENIA_NADAWCA     – np. "MotoRaport <przypomnienia@moto-raport.pl>" (domena zweryfikowana w Resend)
//   CRON_SECRET               – dowolny długi ciąg znaków; Vercel sam dołącza go do wywołań automatu
//   + baza Upstash Redis (ta sama co dla raportów spalania)

import { createHash, randomBytes } from 'crypto';
import { redis } from '@/lib/magazyn';
import { site } from '@/config/site';
import { linkUbezpieczenia, sklepOpon } from '@/lib/panel';

export const przypomnieniaWlaczone = () =>
  !!(process.env.RESEND_API_KEY && process.env.PRZYPOMNIENIA_NADAWCA && (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL));

export type Rodzaj = 'oc' | 'przeglad';

export interface Wpis {
  email: string;
  oc: string;
  przeglad: string;
  /** przypomnienie o zmianie opon (październik i marzec) */
  opony?: boolean;
  potwierdzone: boolean;
  utworzono: string;
  /** które przypomnienia już wysłano, np. { "oc-21": "2027-03-01" } (klucz → data terminu, którego dotyczyło) */
  wyslane: Record<string, string>;
}

const K = (t: string) => `przyp:${t}`;
const K_LISTA = 'przyp:wszystkie';
const K_EMAIL = (e: string) => `przyp:email:${createHash('sha256').update(e).digest('hex').slice(0, 32)}`;

export const nowyToken = () => randomBytes(24).toString('base64url');
export const poprawnyToken = (t: string) => /^[A-Za-z0-9_-]{32}$/.test(t);
export const poprawnyEmail = (e: string) => e.length <= 120 && /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(e);
export const poprawnaData = (d: string) => !d || (/^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)));

export async function czytaj(t: string): Promise<Wpis | null> {
  const [w] = await redis([['GET', K(t)]]);
  return w ? (JSON.parse(String(w)) as Wpis) : null;
}

export async function zapiszNowy(email: string, oc: string, przeglad: string, opony = false): Promise<string> {
  // ten sam adres zapisany ponownie → stary wpis zastępujemy nowym (jeden adres = jeden wpis)
  const [stary] = await redis([['GET', K_EMAIL(email)]]);
  if (stary) await usun(String(stary));
  const t = nowyToken();
  const w: Wpis = { email, oc, przeglad, opony, potwierdzone: false, utworzono: new Date().toISOString().slice(0, 10), wyslane: {} };
  await redis([
    ['SET', K(t), JSON.stringify(w), 'EX', 7 * 86400],
    ['SET', K_EMAIL(email), t, 'EX', 7 * 86400]
  ]);
  return t;
}

export async function potwierdz(t: string): Promise<boolean> {
  const w = await czytaj(t);
  if (!w) return false;
  w.potwierdzone = true;
  await redis([['SET', K(t), JSON.stringify(w)], ['PERSIST', K_EMAIL(w.email)], ['SADD', K_LISTA, t]]);
  return true;
}

export async function usun(t: string): Promise<void> {
  const w = await czytaj(t);
  const pol: (string | number)[][] = [['DEL', K(t)], ['SREM', K_LISTA, t]];
  if (w) pol.push(['DEL', K_EMAIL(w.email)]);
  await redis(pol);
}

// --- e-maile ---

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataPl = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

function szablon(tytul: string, akapity: string[], przycisk: { tekst: string; url: string } | null, wypisz: string) {
  const html = `<!doctype html><html lang="pl"><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="background:#fff;border-radius:16px;padding:28px">
<p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#c2410c">${esc(site.name)}</p>
<h1 style="margin:0 0 16px;font-size:22px">${esc(tytul)}</h1>
${akapity.map((a) => `<p style="margin:0 0 14px;line-height:1.5">${esc(a)}</p>`).join('')}
${przycisk ? `<p style="margin:20px 0"><a href="${esc(przycisk.url)}" style="display:inline-block;background:#c2410c;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px">${esc(przycisk.tekst)}</a></p>` : ''}
</div>
<p style="font-size:12px;color:#64748b;line-height:1.5;margin:16px 4px">Dostajesz tę wiadomość, bo zapisałeś(-aś) się na przypomnienia na ${esc(site.url.replace('https://', ''))}.
<a href="${esc(wypisz)}" style="color:#64748b">Wypisz się i usuń moje dane</a>.<br>${esc(site.publisher)}</p>
</div></body></html>`;
  const text = [tytul, '', ...akapity, ...(przycisk ? ['', `${przycisk.tekst}: ${przycisk.url}`] : []), '', `Wypisz się i usuń dane: ${wypisz}`].join('\n');
  return { html, text };
}

async function wyslij(do_: string, temat: string, tresc: { html: string; text: string }, wypisz?: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.PRZYPOMNIENIA_NADAWCA,
      to: [do_],
      subject: temat,
      html: tresc.html,
      text: tresc.text,
      ...(wypisz ? { headers: { 'List-Unsubscribe': `<${wypisz}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } } : {})
    })
  });
  if (!r.ok) throw new Error(`Wysyłka e-maila nie powiodła się (${r.status})`);
}

const adresWypisz = (t: string) => `${site.url}/api/przypomnienia/wypisz/?t=${t}`;

export async function wyslijPotwierdzenie(t: string, w: Wpis) {
  const terminy = [w.oc ? `koniec OC: ${dataPl(w.oc)}` : '', w.przeglad ? `przegląd: ${dataPl(w.przeglad)}` : '', w.opony ? 'zmiana opon w październiku i marcu' : '']
    .filter(Boolean)
    .join(', ');
  await wyslij(
    w.email,
    'Potwierdź przypomnienia o OC i przeglądzie',
    szablon(
      'Potwierdź zapis na przypomnienia',
      [`Kliknij przycisk, a przypomnimy Ci o: ${terminy}. O OC i przeglądzie piszemy 3 tygodnie i 3 dni przed terminem.`, 'Jeśli to nie Ty – po prostu zignoruj tę wiadomość. Bez potwierdzenia dane usuniemy same po 7 dniach.'],
      { tekst: 'Potwierdzam', url: `${site.url}/api/przypomnienia/potwierdz/?t=${t}` },
      adresWypisz(t)
    )
  );
}

function trescPrzypomnienia(rodzaj: Rodzaj, termin: string, dni: number, t: string) {
  const kiedy = dni <= 0 ? 'dziś' : dni === 1 ? 'jutro' : `za ${dni} dni`;
  if (rodzaj === 'oc') {
    const partner = linkUbezpieczenia('oc', { slug: 'przypomnienie', marka: '', model: '' });
    return {
      temat: `Twoje OC kończy się ${kiedy} (${dataPl(termin)})`,
      tresc: szablon(
        `Koniec OC ${kiedy}`,
        [
          `Polisa OC Twojego auta kończy się ${dataPl(termin)}.`,
          'Jeśli nic nie zrobisz, ubezpieczyciel zwykle sam przedłuży polisę – często drożej. Porównanie ofert zajmuje kilka minut i potrafi obniżyć cenę o kilkaset złotych.',
          'Pamiętaj: jeśli zmieniasz ubezpieczyciela, starą polisę wypowiedz najpóźniej w ostatnim dniu jej ważności.'
        ],
        partner ? { tekst: 'Porównaj ceny OC', url: partner } : { tekst: 'Przejdź do MotoRaport', url: site.url },
        adresWypisz(t)
      )
    };
  }
  return {
    temat: `Przegląd auta ${kiedy} (${dataPl(termin)})`,
    tresc: szablon(
      `Przegląd techniczny ${kiedy}`,
      [
        `Termin badania technicznego Twojego auta mija ${dataPl(termin)}.`,
        'Jazda bez ważnego przeglądu to mandat i ryzyko kłopotów z ubezpieczycielem przy szkodzie. Umów stację diagnostyczną z wyprzedzeniem.'
      ],
      { tekst: 'Sprawdź kody błędów i usterki', url: `${site.url}/kody-bledow/` },
      adresWypisz(t)
    )
  };
}

function trescOpon(sezon: 'zimowe' | 'letnie', t: string) {
  const sklep = sklepOpon(sezon);
  const zima = sezon === 'zimowe';
  return {
    temat: zima ? 'Czas pomyśleć o oponach zimowych' : 'Czas na opony letnie',
    tresc: szablon(
      zima ? 'Zbliża się czas na opony zimowe' : 'Czas wrócić na opony letnie',
      zima
        ? [
            'Gdy rano temperatura spada poniżej 7°C, opony letnie twardnieją i gorzej trzymają drogę. W październiku i listopadzie warsztaty mają najdłuższe kolejki – umów wymianę wcześniej.',
            'Sprawdź bieżnik zimówek: minimum prawne to 1,6 mm, ale na śniegu opona poniżej 4 mm wyraźnie traci przyczepność.'
          ]
        : [
            'Gdy przez kilka dni z rzędu jest powyżej 7°C, opony zimowe szybciej się zużywają i wydłużają drogę hamowania.',
            'Przed zmianą sprawdź bieżnik i wiek letnich opon – narzędzia znajdziesz na naszej stronie.'
          ],
      sklep ? { tekst: zima ? 'Zobacz opony zimowe' : 'Zobacz opony letnie', url: sklep.url } : { tekst: 'Sprawdź swoje opony', url: `${site.url}/opony/` },
      adresWypisz(t)
    )
  };
}

const dzis = () => new Date().toISOString().slice(0, 10);
const dniDo = (d: string) => Math.round((Date.parse(d + 'T12:00:00Z') - Date.parse(dzis() + 'T12:00:00Z')) / 86400000);
const zaRok = (d: string) => {
  const x = new Date(d + 'T12:00:00Z');
  x.setUTCFullYear(x.getUTCFullYear() + 1);
  return x.toISOString().slice(0, 10);
};

/** Codzienna wysyłka – zwraca, ile e-maili poszło */
export async function wyslijZalegle(): Promise<{ wyslane: number; bledy: number; wpisy: number }> {
  const [lista] = await redis([['SMEMBERS', K_LISTA]]);
  const tokeny = ((lista as string[]) || []).filter(poprawnyToken);
  let wyslane = 0,
    bledy = 0;
  for (const t of tokeny) {
    const w = await czytaj(t);
    if (!w) {
      await redis([['SREM', K_LISTA, t]]);
      continue;
    }
    if (!w.potwierdzone) continue;
    let zmiana = false;
    for (const rodzaj of ['oc', 'przeglad'] as Rodzaj[]) {
      let termin = w[rodzaj];
      if (!termin) continue;
      // termin minął → następny za rok (OC i przegląd odnawia się co rok)
      while (dniDo(termin) < 0) {
        termin = zaRok(termin);
        w[rodzaj] = termin;
        zmiana = true;
      }
      const dni = dniDo(termin);
      for (const prog of [21, 3]) {
        const klucz = `${rodzaj}-${prog}`;
        if (dni <= prog && w.wyslane[klucz] !== termin && (prog === 3 || dni > 3)) {
          try {
            const { temat, tresc } = trescPrzypomnienia(rodzaj, termin, dni, t);
            await wyslij(w.email, temat, tresc, adresWypisz(t));
            w.wyslane[klucz] = termin;
            zmiana = true;
            wyslane++;
          } catch {
            bledy++;
          }
          break;
        }
      }
    }
    // opony: raz w sezonie – 1–14 października (zimowe) i 15–31 marca (letnie)
    if (w.opony) {
      const d = new Date();
      const md = (d.getMonth() + 1) * 100 + d.getDate();
      const sezon = md >= 1001 && md <= 1014 ? 'zimowe' : md >= 315 && md <= 331 ? 'letnie' : null;
      const klucz = `opony-${sezon}`;
      if (sezon && w.wyslane[klucz] !== String(d.getFullYear())) {
        try {
          const { temat, tresc } = trescOpon(sezon, t);
          await wyslij(w.email, temat, tresc, adresWypisz(t));
          w.wyslane[klucz] = String(d.getFullYear());
          zmiana = true;
          wyslane++;
        } catch {
          bledy++;
        }
      }
    }
    if (zmiana) await redis([['SET', K(t), JSON.stringify(w)]]);
  }
  return { wyslane, bledy, wpisy: tokeny.length };
}
