// Wspólne szacunki zużycia paliwa i ceny dla kalkulatorów (koszt trasy, koszty utrzymania).
import { cenyPaliw, CenyPaliw } from '@/lib/panel';

export type RodzajNapedu = 'benzyna' | 'diesel' | 'lpg' | 'hybryda' | 'elektryczny';

export const NAZWY_NAPEDU: Record<RodzajNapedu, string> = {
  benzyna: 'Benzyna',
  diesel: 'Diesel',
  lpg: 'LPG',
  hybryda: 'Hybryda',
  elektryczny: 'Elektryczny'
};

/** Średnie zużycie w cyklu mieszanym (l/100 km, dla elektryków kWh/100 km) – szacunek dla typowego egzemplarza */
export function domyslneSpalanie(naped: RodzajNapedu, poj: number): number {
  const p = poj || 1.6;
  if (naped === 'elektryczny') return 17;
  if (naped === 'hybryda') return Math.round((3.6 + p * 1.0) * 10) / 10;
  if (naped === 'diesel') return Math.round((3.4 + p * 1.6) * 10) / 10;
  const benz = 5 + p * 2.1;
  return Math.round((naped === 'lpg' ? benz * 1.2 : benz) * 10) / 10;
}

/** Na trasie (drogi krajowe / ekspresówki) auto spala zwykle mniej niż w cyklu mieszanym; elektryk przy autostradowej prędkości – więcej */
export function spalanieWTrasie(naped: RodzajNapedu, mieszane: number): number {
  const wsp = naped === 'elektryczny' ? 1.1 : naped === 'hybryda' ? 0.95 : 0.85;
  return Math.round(mieszane * wsp * 10) / 10;
}

export function cenaDla(naped: RodzajNapedu, c: CenyPaliw = cenyPaliw()): number {
  if (naped === 'diesel') return c.on;
  if (naped === 'lpg') return c.lpg;
  if (naped === 'elektryczny') return c.prad;
  return c.pb95;
}

export function jednostka(naped: RodzajNapedu) {
  return naped === 'elektryczny' ? { zuzycie: 'kWh/100 km', cena: 'zł/kWh', ilosc: 'kWh' } : { zuzycie: 'l/100 km', cena: 'zł/l', ilosc: 'l' };
}
