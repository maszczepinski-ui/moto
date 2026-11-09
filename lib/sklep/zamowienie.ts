// Numer zamówienia (sessionId w Przelewy24) niesie wszystko, czego potrzebujemy później, bez bazy danych:
// <NB|NS><wersja zgód>-<czas zgody, base36>-<losowe>-<NIP albo 0>. Maks. 100 znaków (limit P24).
// NB = Niezbędnik Kupującego, NS = Niezbędnik po szkodzie (lib/sklep/produkty.ts).
import crypto from 'crypto';
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
