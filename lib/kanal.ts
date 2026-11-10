// Kanały w linkach carVertical (parametr sub2) – w panelu carVertical widać potem,
// które miejsce na stronie przynosi kliknięcia i sprzedaż (strona główna, karta modelu, poradnik…).
// Działa tylko dla linków carvertical.deal; inne linki zostają bez zmian.

export function zKanalem(url: string, kanal: string): string {
  if (!url || !kanal || !/carvertical\.deal/i.test(url)) return url;
  try {
    const u = new URL(url.replaceAll('{vin}', '__VIN__'));
    u.searchParams.set('sub2', kanal);
    return u.toString().replaceAll('__VIN__', '{vin}');
  } catch {
    return url;
  }
}

/** Nazwa kanału dla miejsca na stronie (z „karty” kontekstu) */
export function kanalDla(karta: string): string {
  if (karta === 'strona-glowna') return 'strona-glowna';
  if (karta === 'sprawdz-vin') return 'sprawdz-vin';
  // wersje językowe: osobny kanał, żeby widzieć ruch z /uk/ i /en/ (np. „uk-sprawdz-vin”, „en-poradnik”)
  const obcy = karta.match(/^(uk|en)-(.+)$/);
  if (obcy) return `${obcy[1]}-${kanalDla(obcy[2])}`;
  if (karta.startsWith('jakie-auto')) return 'poradnik-zakupowy';
  if (karta.startsWith('poradnik')) return 'poradnik';
  if (karta === 'linki') return 'linki';
  return 'karta-modelu';
}
