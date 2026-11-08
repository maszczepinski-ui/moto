// Numer zamówienia (sessionId w Przelewy24) niesie wszystko, czego potrzebujemy później, bez bazy danych:
// NB<wersja zgód>-<czas zgody, base36>-<losowe>-<NIP albo 0>. Maks. 100 znaków (limit P24).
import crypto from 'crypto';
import { PRODUKT } from './konfiguracja';

export function nowyNumer(nip: string | null, teraz = Date.now()) {
  return `NB${PRODUKT.wersjaZgod}-${teraz.toString(36)}-${crypto.randomBytes(5).toString('hex')}-${nip || '0'}`;
}

export function odczytajNumer(s: string): { wersjaZgod: string; czasZgod: Date; nip: string | null } | null {
  const m = s.match(/^NB(\d+)-([0-9a-z]+)-[0-9a-f]{10}-(\d{10}|0)$/);
  if (!m) return null;
  return { wersjaZgod: m[1], czasZgod: new Date(parseInt(m[2], 36)), nip: m[3] === '0' ? null : m[3] };
}

/** Polski NIP: 10 cyfr i suma kontrolna */
export function poprawnyNip(nip: string): boolean {
  if (!/^\d{10}$/.test(nip)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const suma = w.reduce((s, x, i) => s + x * Number(nip[i]), 0);
  return suma % 11 === Number(nip[9]);
}
