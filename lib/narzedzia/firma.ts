// Kalkulator „Auto w firmie: limit 100 tys. zł” – ile VAT i PIT odzyska przedsiębiorca i ile przepada przez limit.
// Limity od 1.01.2026 (art. 23 ust. 1 pkt 4 i 47 ustawy o PIT po nowelizacji): 100 000 zł – emisja CO₂ od 50 g/km,
// 150 000 zł – poniżej 50 g/km, 225 000 zł – elektryczne i wodorowe. Dotyczą też umów leasingu zawartych wcześniej
// (stanowisko MF, prawo.pl / infor.pl 2026). VAT przy użytku mieszanym: 50% (art. 86a ustawy o VAT),
// wydatki eksploatacyjne w kosztach: 75% (użytek mieszany).
// UPROSZCZENIA: liczymy łącznie za cały okres, bez kosztów finansowania (odsetki, prowizje) i bez składki zdrowotnej.

export const STAN_FIRMY = 'listopad 2026';

export type NapedFirma = 'spalinowy' | 'niskoemisyjny' | 'elektryczny';
export type Uzytek = 'mieszany' | 'firmowy';
export type Podatek = 'skala12' | 'skala32' | 'liniowy' | 'ryczalt';

export const LIMITY: Record<NapedFirma, { limit: number; nazwa: string; opis: string }> = {
  spalinowy: { limit: 100000, nazwa: 'Spalinowy, hybryda (CO₂ od 50 g/km)', opis: 'benzyna, diesel, LPG, zwykłe hybrydy i większość plug-inów' },
  niskoemisyjny: { limit: 150000, nazwa: 'Niskoemisyjny (CO₂ poniżej 50 g/km)', opis: 'głównie hybrydy plug-in z dużą baterią' },
  elektryczny: { limit: 225000, nazwa: 'Elektryczny lub wodorowy', opis: 'bez emisji CO₂' }
};

export const PODATKI: { id: Podatek; nazwa: string; stawka: number }[] = [
  { id: 'skala12', nazwa: 'Skala podatkowa – 12%', stawka: 0.12 },
  { id: 'skala32', nazwa: 'Skala podatkowa – 32% (powyżej progu)', stawka: 0.32 },
  { id: 'liniowy', nazwa: 'Podatek liniowy – 19%', stawka: 0.19 },
  { id: 'ryczalt', nazwa: 'Ryczałt (bez kosztów)', stawka: 0 }
];

export const VAT = 0.23;

export interface DaneFirmy {
  cenaNetto: number;
  naped: NapedFirma;
  uzytek: Uzytek;
  podatek: Podatek;
  vatowiec: boolean;
  /** roczne wydatki eksploatacyjne netto (paliwo, serwis, opony) */
  eksploatacjaRok: number;
  lata: number;
}

export interface WynikFirmy {
  limit: number;
  vatAuta: number;
  vatOdliczony: number;
  /** wartość, od której liczy się limit: netto + nieodliczony VAT */
  wartoscDoLimitu: number;
  wKosztach: number;
  ponadLimit: number;
  /** podatek PIT zaoszczędzony dzięki kosztom auta */
  pitAuto: number;
  /** podatek, który „przepada” przez limit (ponadLimit × stawka) */
  strataLimit: number;
  vatEksploatacja: number;
  pitEksploatacja: number;
  /** cena brutto minus odzyskany VAT i PIT (samo auto) */
  realnyKosztAuta: number;
  /** wszystko: auto + eksploatacja za cały okres po odliczeniach */
  realnyKosztRazem: number;
}

export function policzFirme(d: DaneFirmy): WynikFirmy {
  const stawka = PODATKI.find((p) => p.id === d.podatek)?.stawka ?? 0;
  const limit = LIMITY[d.naped].limit;
  const vatAuta = d.cenaNetto * VAT;
  const odliczenie = d.vatowiec ? (d.uzytek === 'mieszany' ? 0.5 : 1) : 0;
  const vatOdliczony = vatAuta * odliczenie;
  const wartoscDoLimitu = d.cenaNetto + (vatAuta - vatOdliczony);
  const wKosztach = Math.min(wartoscDoLimitu, limit);
  const ponadLimit = Math.max(0, wartoscDoLimitu - limit);
  const pitAuto = wKosztach * stawka;
  const strataLimit = ponadLimit * stawka;

  const eksNetto = d.eksploatacjaRok * d.lata;
  const eksVat = eksNetto * VAT;
  const vatEksploatacja = eksVat * odliczenie;
  const eksKoszt = (eksNetto + eksVat - vatEksploatacja) * (d.uzytek === 'mieszany' ? 0.75 : 1);
  const pitEksploatacja = eksKoszt * stawka;

  const realnyKosztAuta = d.cenaNetto + vatAuta - vatOdliczony - pitAuto;
  const realnyKosztRazem = realnyKosztAuta + eksNetto + eksVat - vatEksploatacja - pitEksploatacja;
  return { limit, vatAuta, vatOdliczony, wartoscDoLimitu, wKosztach, ponadLimit, pitAuto, strataLimit, vatEksploatacja, pitEksploatacja, realnyKosztAuta, realnyKosztRazem };
}

/** Ceny aut (netto) z własnymi podstronami */
export const KWOTY_FIRMA = [80000, 100000, 120000, 150000, 180000, 200000, 250000, 300000];
export const slugKwoty = (k: number) => `${k}-zl`;
export const kwotaZeSlugu = (s: string) => {
  const m = s.match(/^(\d+)-zl$/);
  const k = m ? Number(m[1]) : NaN;
  return KWOTY_FIRMA.includes(k) ? k : null;
};
