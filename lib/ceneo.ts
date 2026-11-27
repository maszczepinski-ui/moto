// Linki partnerskie Ceneo (program partnerski Ceneo.pl – płatność za przejście z Ceneo do sklepu).
// Link partnerski = zwykły adres strony Ceneo + „#crid=…&pid=…” (numery z panelu partnera).
// Zmiana numerów: tylko tutaj.
export const CENEO = { pid: '22477', crid: '822132' };

/** Link partnerski do wyników wyszukiwania na Ceneo, np. linkCeneo('skrobaczka do szyb') */
export function linkCeneo(szukaj: string): string {
  const fraza = szukaj.trim().toLowerCase().split(/\s+/).map(encodeURIComponent).join('+');
  return `https://www.ceneo.pl/;szukaj-${fraza}#crid=${CENEO.crid}&pid=${CENEO.pid}`;
}

/** Link partnerski do konkretnej strony Ceneo (kategoria albo produkt) – gdy wolimy ją od wyszukiwania */
export function linkCeneoStrona(adres: string): string {
  const czysty = adres.split('#')[0];
  return /^https:\/\/www\.ceneo\.pl\//.test(czysty) ? `${czysty}#crid=${CENEO.crid}&pid=${CENEO.pid}` : '';
}
