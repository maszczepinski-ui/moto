// „Gdzie sprzedać auto?” – ile zostaje na rękę i jak szybko przy różnych drogach sprzedaży. Stan na listopad 2026.
// ZAŁOŻENIA REDAKCJI na podstawie relacji z rynku: skup płaci zwykle ok. 15–20% poniżej ceny rynkowej
// (bezprawnik.pl 2026: oferta o niemal 20% niższa; wheelstreet: skup −17%), komis pobiera prowizję – przyjmujemy 5–10%,
// przy sprzedaży samodzielnej kupujący negocjuje zwykle kilka procent. Utrata wartości w czasie sprzedaży – ok. 1% miesięcznie.

export const STAN_SPRZEDAZY = 'listopad 2026';

export type Stan = 'dobry' | 'sredni' | 'slaby';
export type Kanal = 'sam' | 'komis' | 'dealer' | 'skup';

export interface DrogaSprzedazy {
  id: Kanal;
  nazwa: string;
  /** jaki % ceny rynkowej zostaje (od–do) */
  procentOd: number;
  procentDo: number;
  /** ile dni trwa sprzedaż (od–do) */
  dniOd: number;
  dniDo: number;
  koszty: number;
  plusy: string[];
  minusy: string[];
}

export const DROGI: DrogaSprzedazy[] = [
  { id: 'sam', nazwa: 'Samodzielnie (ogłoszenie)', procentOd: 0.92, procentDo: 0.98, dniOd: 21, dniDo: 60, koszty: 300, plusy: ['najwięcej pieniędzy na rękę', 'sam decydujesz o cenie i kupującym'], minusy: ['telefony, oględziny i negocjacje', 'ryzyko oszustw przy płatności', 'odpowiadasz za wady (rękojmia), jeśli jej nie wyłączysz w umowie'] },
  { id: 'komis', nazwa: 'Komis (sprzedaż komisowa)', procentOd: 0.86, procentDo: 0.92, dniOd: 14, dniDo: 45, koszty: 0, plusy: ['komis zajmuje się ogłoszeniem i klientami', 'auto stoi na placu, nie musisz się nim zajmować'], minusy: ['prowizja i czasem opłata za postój', 'pieniądze dopiero po sprzedaży'] },
  { id: 'dealer', nazwa: 'W rozliczeniu u dealera', procentOd: 0.8, procentDo: 0.9, dniOd: 1, dniDo: 7, koszty: 0, plusy: ['jedna wizyta: oddajesz stare, odbierasz nowe', 'często możliwy bonus przy zakupie nowego'], minusy: ['wycena zwykle niższa niż na rynku', 'bonus bywa ukryty w cenie nowego auta'] },
  { id: 'skup', nazwa: 'Skup aut', procentOd: 0.78, procentDo: 0.85, dniOd: 1, dniDo: 3, koszty: 0, plusy: ['pieniądze nawet tego samego dnia', 'skup bierze auta z usterkami i bez przeglądu'], minusy: ['najniższa cena', 'wycena na miejscu często spada względem tej z telefonu'] }
];

/** Gorszy stan techniczny utrudnia sprzedaż samodzielną i w komisie bardziej niż w skupie */
const KARA_STANU: Record<Stan, Record<Kanal, number>> = {
  dobry: { sam: 0, komis: 0, dealer: 0, skup: 0 },
  sredni: { sam: 0.04, komis: 0.03, dealer: 0.03, skup: 0.02 },
  slaby: { sam: 0.1, komis: 0.08, dealer: 0.06, skup: 0.03 }
};

export interface WynikDrogi {
  droga: DrogaSprzedazy;
  naReke: number;
  naRekeOd: number;
  naRekeDo: number;
  dni: number;
  /** utrata wartości i koszty utrzymania podczas czekania */
  kosztCzekania: number;
}

export function policzSprzedaz(wartosc: number, stan: Stan, ocRocznie: number): WynikDrogi[] {
  return DROGI.map((d) => {
    const kara = KARA_STANU[stan][d.id];
    const dni = Math.round((d.dniOd + d.dniDo) / 2) * (stan === 'slaby' && (d.id === 'sam' || d.id === 'komis') ? 1.5 : 1);
    const kosztCzekania = Math.round(wartosc * 0.01 * (dni / 30) + (ocRocznie / 365) * dni);
    const naRekeOd = Math.round(wartosc * (d.procentOd - kara) - d.koszty - kosztCzekania);
    const naRekeDo = Math.round(wartosc * (d.procentDo - kara) - d.koszty - kosztCzekania);
    return { droga: d, naRekeOd, naRekeDo, naReke: Math.round((naRekeOd + naRekeDo) / 2), dni: Math.round(dni), kosztCzekania };
  });
}
