// „Koszt ładowania elektryka” – ile kosztuje 100 km w domu i na stacjach. Stan na listopad 2026.
// Ceny 1 kWh (brutto): finwire.pl (6.11.2026, taryfy URE 2026 i mediany cen na stacjach): dom G11 1,04 zł,
// dom G12 w nocy 0,61 zł, AC do 22 kW 1,96 zł, DC 50–149 kW 2,50 zł, od 150 kW 2,99 zł;
// taryfa dynamiczna w tanich godzinach 0,40–0,50 zł (autocentrum.pl 2026 – przyjmujemy 0,50 zł).
// Zużycie energii to typowe wartości dla klas aut (założenie redakcji); przy ładowaniu AC doliczamy 10% strat.

export const STAN_EV = 'listopad 2026';

export type ZrodloPradu = 'g11' | 'g12' | 'dynamiczna' | 'ac' | 'dc' | 'hpc';

export const CENY_KWH: Record<ZrodloPradu, { nazwa: string; cena: number; straty: number }> = {
  g11: { nazwa: 'Dom – taryfa G11 (cała doba)', cena: 1.04, straty: 0.1 },
  g12: { nazwa: 'Dom – taryfa G12 w nocy', cena: 0.61, straty: 0.1 },
  dynamiczna: { nazwa: 'Dom – taryfa dynamiczna (tanie godziny)', cena: 0.5, straty: 0.1 },
  ac: { nazwa: 'Publiczna ładowarka AC', cena: 1.96, straty: 0.1 },
  dc: { nazwa: 'Szybka ładowarka DC 50–149 kW', cena: 2.5, straty: 0.03 },
  hpc: { nazwa: 'Ultraszybka ładowarka od 150 kW', cena: 2.99, straty: 0.03 }
};

export type KlasaEv = 'miejskie' | 'kompakt' | 'suv' | 'duze';
export const KLASY_EV: Record<KlasaEv, { nazwa: string; kwh: number; przyklady: string }> = {
  miejskie: { nazwa: 'Miejskie', kwh: 15, przyklady: 'Dacia Spring, Fiat 500e, Renault 5' },
  kompakt: { nazwa: 'Kompaktowe', kwh: 17, przyklady: 'VW ID.3, MG4, Kia Niro EV' },
  suv: { nazwa: 'SUV średni', kwh: 19, przyklady: 'Tesla Model Y, Skoda Enyaq, BYD Atto 3' },
  duze: { nazwa: 'Duży SUV / premium', kwh: 23, przyklady: 'Audi Q8 e-tron, BMW iX, Mercedes EQE SUV' }
};

export const koszt100 = (kwh: number, z: ZrodloPradu) => kwh * (1 + CENY_KWH[z].straty) * CENY_KWH[z].cena;

export interface Miks {
  dom: ZrodloPradu;
  procDom: number;
  procAc: number;
  procDc: number;
}

export function kosztMiksu(kwh: number, m: Miks): number {
  const suma = Math.max(1, m.procDom + m.procAc + m.procDc);
  return (koszt100(kwh, m.dom) * m.procDom + koszt100(kwh, 'ac') * m.procAc + koszt100(kwh, 'dc') * m.procDc) / suma;
}

export interface ScenariuszEv {
  slug: string;
  zrodlo: ZrodloPradu;
  tytul: string;
  wstep: string;
}

export const SCENARIUSZE_EV: ScenariuszEv[] = [
  { slug: 'taryfa-g11', zrodlo: 'g11', tytul: 'Ładowanie elektryka w taryfie G11', wstep: 'G11 to najpopularniejsza taryfa w domach: ta sama cena przez całą dobę. Wygodna, ale nie najtańsza do ładowania auta.' },
  { slug: 'taryfa-g12', zrodlo: 'g12', tytul: 'Ładowanie elektryka w taryfie G12 nocą', wstep: 'W taryfie G12 prąd jest tańszy w nocy i w części dnia. Jeśli auto ładuje się w nocy, koszt 100 km spada prawie o połowę względem G11.' },
  { slug: 'taryfa-dynamiczna', zrodlo: 'dynamiczna', tytul: 'Ładowanie elektryka w taryfie dynamicznej', wstep: 'W taryfie dynamicznej cena zmienia się co godzinę zgodnie z giełdą. Przy ładowaniu w najtańszych godzinach (zwykle noc, słoneczne południe) to najtańszy sposób na prąd do auta.' },
  { slug: 'szybkie-ladowarki', zrodlo: 'dc', tytul: 'Ile kosztuje ładowanie na szybkich ładowarkach DC?', wstep: 'Szybkie ładowarki przy trasach są wygodne, ale najdroższe. Przy jeździe głównie na DC elektryk może kosztować na 100 km tyle co auto na LPG albo więcej.' }
];
