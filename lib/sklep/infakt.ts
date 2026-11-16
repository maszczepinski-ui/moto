// inFakt API v3 – faktura bez VAT („zw”) po opłaconym zamówieniu.
// Adresy, nagłówek X-inFakt-ApiKey i przebieg (zlecenie → sprawdzanie statusu → oznaczenie jako zapłacona → wysyłka)
// jak w dokumentacji docs.infakt.pl i w gotowych integracjach inFakt.
// PODSTAWA ZWOLNIENIA (art. 113 ust. 1) – ustaw ją w inFakt: Ustawienia → podstawa zwolnienia z VAT; wtedy trafia na każdą fakturę „zw”.
import { env, testowyInfakt } from './konfiguracja';

// INFAKT_URL – tylko do testów
const baza = () => process.env.INFAKT_URL || (testowyInfakt() ? 'https://api.sandbox-infakt.pl/api/v3' : 'https://api.infakt.pl/api/v3');

async function zapytanie(metoda: 'GET' | 'POST', sciezka: string, body?: object) {
  const r = await fetch(`${baza()}${sciezka}`, {
    method: metoda,
    headers: { Accept: 'application/json', 'X-inFakt-ApiKey': env('INFAKT_API_KEY'), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });
  const tekst = await r.text();
  if (!r.ok) throw new Error(`inFakt ${sciezka}: HTTP ${r.status} ${tekst.slice(0, 400)}`);
  return tekst ? JSON.parse(tekst) : {};
}

export interface DaneFaktury {
  numerZamowienia: string;
  nazwaPozycji: string;
  kwotaGr: number;
  email: string;
  /** imię i nazwisko (osoba prywatna) albo nazwa firmy */
  klient: string;
  nip: string | null;
  adres?: string;
  kod?: string;
  miasto?: string;
  dataSprzedazy: string;
}

const dzisWarszawa = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date());

export function trescFaktury(d: DaneFaktury) {
  const firma = !!d.nip;
  const [imie, ...reszta] = d.klient.trim().split(/\s+/);
  return {
    invoice_date: dzisWarszawa(),
    sale_date: d.dataSprzedazy,
    payment_method: 'transfer',
    notes: `Zamówienie ${d.numerZamowienia}, opłacone przez Przelewy24.`,
    ...(firma
      ? { client_business_activity_kind: 'other_business', client_company_name: d.klient, client_tax_code: d.nip }
      : { client_business_activity_kind: 'private_person', client_first_name: imie, client_last_name: reszta.join(' ') || imie }),
    ...(d.adres ? { client_street: d.adres } : {}),
    ...(d.kod ? { client_post_code: d.kod } : {}),
    ...(d.miasto ? { client_city: d.miasto } : {}),
    client_country: 'PL',
    client_email: d.email,
    services: [{ name: d.nazwaPozycji, tax_symbol: 'zw', gross_price: d.kwotaGr, quantity: 1, unit: 'szt.' }]
  };
}

const czekaj = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Wystawia fakturę „zw”, oznacza jako zapłaconą i wysyła kupującemu. Zwraca numer faktury. */
export async function wystawFakture(d: DaneFaktury): Promise<{ numer: string; uuid: string }> {
  const zlecenie = await zapytanie('POST', '/async/invoices.json', { invoice: trescFaktury(d) });
  const ref = zlecenie.invoice_task_reference_number;
  if (!ref) throw new Error(`inFakt nie przyjął zlecenia: ${JSON.stringify(zlecenie).slice(0, 300)}`);
  // inFakt tworzy fakturę w tle – sprawdzamy status co 2 s, najdłużej ok. minuty
  for (let i = 0; i < 30; i++) {
    await czekaj(2000);
    const s = await zapytanie('GET', `/async/invoices/status/${encodeURIComponent(ref)}.json`);
    const kod = Number(s.processing_code);
    if (kod === 201 && s.invoice_uuid) {
      const uuid = String(s.invoice_uuid);
      await zapytanie('POST', `/async/invoices/${encodeURIComponent(uuid)}/paid.json`, { paid_date: d.dataSprzedazy });
      await zapytanie('POST', `/invoices/${encodeURIComponent(uuid)}/deliver.json`, { print_type: 'original', recipient: d.email });
      return { numer: String(s.invoice_number || uuid), uuid };
    }
    if (kod >= 400) throw new Error(`inFakt odrzucił fakturę: ${s.processing_description} ${JSON.stringify(s.invoice_errors || {})}`);
  }
  throw new Error(`inFakt nie skończył tworzenia faktury w ciągu minuty (zlecenie ${ref}) – sprawdź w panelu inFakt`);
}
