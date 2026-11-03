// Płatne odcinki autostrad dla samochodów osobowych (stan: 2026).
// Odcinki państwowe (A2 Konin–Stryków, A4 Wrocław–Sośnica i inne) są dla osobówek bezpłatne.
// Przy zmianie cen popraw kwoty tutaj – kalkulator przeliczy się sam.

export const STAN_OPLAT = '2026 (A2 po podwyżce z marca 2026)';

export interface Odcinek {
  id: string;
  nazwa: string;
  opis: string;
  /** cena za przejazd całym odcinkiem w jedną stronę, zł */
  cena: number;
}

export const ODCINKI: Odcinek[] = [
  { id: 'a1', nazwa: 'A1 Gdańsk (Rusocin) – Toruń', opis: 'AmberOne, ok. 152 km', cena: 29.9 },
  { id: 'a2-zach', nazwa: 'A2 Świecko – Nowy Tomyśl', opis: 'od granicy z Niemcami', cena: 18 },
  { id: 'a2', nazwa: 'A2 Nowy Tomyśl – Poznań – Konin', opis: 'ok. 150 km; krótszy przejazd = mniej', cena: 120 },
  { id: 'a4', nazwa: 'A4 Katowice – Kraków', opis: 'bramki Mysłowice i Balice', cena: 36 }
];

export const ZRODLO_OPLAT = { nazwa: 'Otomoto – Płatne autostrady 2026', url: 'https://www.otomoto.pl/news/oplaty-za-autostrady-w-wakacje-2026' };

const SLASK_I_ZACHOD = ['katowice', 'gliwice', 'zabrze', 'bytom', 'chorzow', 'ruda-slaska', 'rybnik', 'tychy', 'jastrzebie-zdroj', 'opole', 'kedzierzyn-kozle', 'wroclaw', 'legnica', 'lubin', 'glogow', 'walbrzych', 'jelenia-gora', 'karpacz', 'szklarska-poreba', 'zielona-gora'];
const MALOPOLSKA_I_WSCHOD = ['krakow', 'tarnow', 'rzeszow', 'przemysl', 'krosno', 'nowy-sacz', 'zakopane', 'mielec', 'ustrzyki-dolne'];
const POMORZE = ['gdansk', 'gdynia', 'sopot', 'elblag', 'wladyslawowo', 'hel', 'slupsk', 'ustka'];
const POLUDNIE_A1 = ['torun', 'wloclawek', 'lodz', 'piotrkow-trybunalski', 'czestochowa', 'katowice', 'krakow', 'gliwice', 'tychy', 'bielsko-biala', 'zakopane', 'rybnik', 'jastrzebie-zdroj', 'sosnowiec', 'dabrowa-gornicza', 'pabianice', 'tomaszow-mazowiecki'];
const ZACHOD_A2 = ['poznan', 'gniezno', 'leszno', 'pila', 'zielona-gora', 'gorzow-wielkopolski', 'swinoujscie', 'szczecin'];
const WSCHOD_A2 = ['warszawa', 'lodz', 'konin', 'plock', 'siedlce', 'biala-podlaska', 'lublin', 'radom', 'bialystok', 'kalisz'];

const miedzy = (a: string, b: string, x: string[], y: string[]) => (x.includes(a) && y.includes(b)) || (x.includes(b) && y.includes(a));

/** Odcinki, przez które najpewniej prowadzi trasa między miastami (podpowiedź – użytkownik sam zaznacza) */
export function sugestieOdcinkow(a: string, b: string): string[] {
  const out: string[] = [];
  if (miedzy(a, b, POMORZE, POLUDNIE_A1)) out.push('a1');
  if (miedzy(a, b, ZACHOD_A2, WSCHOD_A2)) out.push('a2');
  if (miedzy(a, b, SLASK_I_ZACHOD, MALOPOLSKA_I_WSCHOD)) out.push('a4');
  return out;
}
