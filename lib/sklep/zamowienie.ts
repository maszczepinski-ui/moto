// Numer zamówienia (extOrderId w PayU) niesie wszystko, czego potrzebujemy później, bez bazy danych:
// <NB|NS><wersja zgód>-<czas zgody, base36>-<losowe>-<NIP albo 0>. Ok. 40 znaków, unikalny.
// NB = Niezbędnik Kupującego, NS = Niezbędnik po szkodzie (lib/sklep/produkty.ts).
import crypto from 'crypto';
import { redis } from '@/lib/magazyn';
import { PRODUKT } from './konfiguracja';
import { PRODUKTY, type IdProduktu, type Produkt } from './produkty';

export function nowyNumer(nip: string | null, produkt: IdProduktu = 'niezbednik', teraz = Date.now()) {
  return `${PRODUKTY[produkt].prefiks}${PRODUKT.wersjaZgod}-${teraz.toString(36)}-${crypto.randomBytes(5).toString('hex')}-${nip || '0'}`;
}

export function odczytajNumer(s: string): { produkt: Produkt; wersjaZgod: string; czasZgod: Date; nip: string | null } | null {
  const m = s.match(/^(NB|NS)(\d+)-([0-9a-z]+)-[0-9a-f]{10}-(\d{10}|0)$/);
  if (!m) return null;
  const produkt = Object.values(PRODUKTY).find((p) => p.prefiks === m[1])!;
  return { produkt, wersjaZgod: m[2], czasZgod: new Date(parseInt(m[3], 36)), nip: m[4] === '0' ? null : m[4] };
}

/** Polski NIP: 10 cyfr i suma kontrolna */
export function poprawnyNip(nip: string): boolean {
  if (!/^\d{10}$/.test(nip)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const suma = w.reduce((s, x, i) => s + x * Number(nip[i]), 0);
  return suma % 11 === Number(nip[9]);
}

// Dane do faktury. PayU zwraca je w danych zamówienia (buyer.delivery), a gdy jest baza Upstash –
// zapisujemy je też u siebie na 30 dni, żeby faktura nie zależała od tego, co PayU odeśle.
export interface DaneKlienta {
  klient: string;
  adres: string;
  kod: string;
  miasto: string;
}
const bazaJest = () => !!((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));

export async function zapiszDaneKlienta(numer: string, d: DaneKlienta) {
  if (!bazaJest()) return;
  await redis([['SET', `sklep:klient:${numer}`, JSON.stringify(d), 'EX', 30 * 24 * 3600]]).catch((e) => console.error('[sklep] zapis danych klienta', e));
}

export async function odczytajDaneKlienta(numer: string): Promise<DaneKlienta | null> {
  if (!bazaJest()) return null;
  try {
    const [v] = await redis([['GET', `sklep:klient:${numer}`]]);
    return v ? (JSON.parse(String(v)) as DaneKlienta) : null;
  } catch {
    return null;
  }
}

/** Czy płatność tego zamówienia została już obsłużona (znacznik z lib/sklep/kalkulator.ts → pierwszaObsluga) */
export async function obsluzonaWBazie(numer: string): Promise<boolean> {
  if (!bazaJest()) return false;
  try {
    const [v] = await redis([['GET', `nb:obsl:${numer}`]]);
    return !!v;
  } catch {
    return false;
  }
}
