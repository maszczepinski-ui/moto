// Większe miasta w Polsce ze współrzędnymi (środek miasta, w przybliżeniu).
// Służą do: szacowania odległości w kalkulatorze trasy, szybkiego wyboru miejsca na mapach (bez pytania serwera o adres)
// i podstron „koszt przejazdu X – Y”.

export interface Miasto {
  slug: string;
  nazwa: string;
  lat: number;
  lon: number;
  woj: string;
}

const M = (slug: string, nazwa: string, lat: number, lon: number, woj: string): Miasto => ({ slug, nazwa, lat, lon, woj });

export const MIASTA: Miasto[] = [
  M('warszawa', 'Warszawa', 52.2297, 21.0122, 'mazowieckie'),
  M('krakow', 'Kraków', 50.0647, 19.945, 'małopolskie'),
  M('wroclaw', 'Wrocław', 51.1079, 17.0385, 'dolnośląskie'),
  M('lodz', 'Łódź', 51.7592, 19.456, 'łódzkie'),
  M('poznan', 'Poznań', 52.4064, 16.9252, 'wielkopolskie'),
  M('gdansk', 'Gdańsk', 54.352, 18.6466, 'pomorskie'),
  M('szczecin', 'Szczecin', 53.4285, 14.5528, 'zachodniopomorskie'),
  M('bydgoszcz', 'Bydgoszcz', 53.1235, 18.0084, 'kujawsko-pomorskie'),
  M('lublin', 'Lublin', 51.2465, 22.5684, 'lubelskie'),
  M('bialystok', 'Białystok', 53.1325, 23.1688, 'podlaskie'),
  M('katowice', 'Katowice', 50.2649, 19.0238, 'śląskie'),
  M('gdynia', 'Gdynia', 54.5189, 18.5305, 'pomorskie'),
  M('czestochowa', 'Częstochowa', 50.8118, 19.1203, 'śląskie'),
  M('radom', 'Radom', 51.4027, 21.1471, 'mazowieckie'),
  M('rzeszow', 'Rzeszów', 50.0412, 21.9991, 'podkarpackie'),
  M('torun', 'Toruń', 53.0138, 18.5984, 'kujawsko-pomorskie'),
  M('sosnowiec', 'Sosnowiec', 50.2863, 19.1041, 'śląskie'),
  M('kielce', 'Kielce', 50.8661, 20.6286, 'świętokrzyskie'),
  M('gliwice', 'Gliwice', 50.2945, 18.6714, 'śląskie'),
  M('olsztyn', 'Olsztyn', 53.7784, 20.4801, 'warmińsko-mazurskie'),
  M('zabrze', 'Zabrze', 50.3249, 18.7857, 'śląskie'),
  M('bielsko-biala', 'Bielsko-Biała', 49.8224, 19.0584, 'śląskie'),
  M('bytom', 'Bytom', 50.348, 18.9157, 'śląskie'),
  M('zielona-gora', 'Zielona Góra', 51.9356, 15.5062, 'lubuskie'),
  M('rybnik', 'Rybnik', 50.0971, 18.5417, 'śląskie'),
  M('ruda-slaska', 'Ruda Śląska', 50.2558, 18.8556, 'śląskie'),
  M('opole', 'Opole', 50.6751, 17.9213, 'opolskie'),
  M('tychy', 'Tychy', 50.1218, 18.9876, 'śląskie'),
  M('gorzow-wielkopolski', 'Gorzów Wielkopolski', 52.7325, 15.2369, 'lubuskie'),
  M('elblag', 'Elbląg', 54.1561, 19.4045, 'warmińsko-mazurskie'),
  M('plock', 'Płock', 52.5463, 19.7065, 'mazowieckie'),
  M('dabrowa-gornicza', 'Dąbrowa Górnicza', 50.3217, 19.1949, 'śląskie'),
  M('walbrzych', 'Wałbrzych', 50.7714, 16.2843, 'dolnośląskie'),
  M('wloclawek', 'Włocławek', 52.6483, 19.0677, 'kujawsko-pomorskie'),
  M('tarnow', 'Tarnów', 50.0121, 20.9858, 'małopolskie'),
  M('chorzow', 'Chorzów', 50.2975, 18.9545, 'śląskie'),
  M('koszalin', 'Koszalin', 54.1944, 16.1722, 'zachodniopomorskie'),
  M('kalisz', 'Kalisz', 51.7611, 18.091, 'wielkopolskie'),
  M('legnica', 'Legnica', 51.207, 16.1553, 'dolnośląskie'),
  M('grudziadz', 'Grudziądz', 53.4837, 18.7536, 'kujawsko-pomorskie'),
  M('jaworzno', 'Jaworzno', 50.2051, 19.2747, 'śląskie'),
  M('slupsk', 'Słupsk', 54.4641, 17.0287, 'pomorskie'),
  M('jastrzebie-zdroj', 'Jastrzębie-Zdrój', 49.9551, 18.5917, 'śląskie'),
  M('nowy-sacz', 'Nowy Sącz', 49.6218, 20.6972, 'małopolskie'),
  M('jelenia-gora', 'Jelenia Góra', 50.9044, 15.7194, 'dolnośląskie'),
  M('siedlce', 'Siedlce', 52.1677, 22.2901, 'mazowieckie'),
  M('myslowice', 'Mysłowice', 50.2077, 19.1659, 'śląskie'),
  M('konin', 'Konin', 52.2229, 18.2511, 'wielkopolskie'),
  M('pila', 'Piła', 53.1513, 16.7385, 'wielkopolskie'),
  M('piotrkow-trybunalski', 'Piotrków Trybunalski', 51.4052, 19.703, 'łódzkie'),
  M('inowroclaw', 'Inowrocław', 52.7934, 18.2611, 'kujawsko-pomorskie'),
  M('lubin', 'Lubin', 51.4, 16.2015, 'dolnośląskie'),
  M('ostrow-wielkopolski', 'Ostrów Wielkopolski', 51.6551, 17.8063, 'wielkopolskie'),
  M('suwalki', 'Suwałki', 54.1118, 22.9309, 'podlaskie'),
  M('gniezno', 'Gniezno', 52.535, 17.5826, 'wielkopolskie'),
  M('stargard', 'Stargard', 53.3367, 15.0499, 'zachodniopomorskie'),
  M('glogow', 'Głogów', 51.6638, 16.0846, 'dolnośląskie'),
  M('pabianice', 'Pabianice', 51.6645, 19.3546, 'łódzkie'),
  M('leszno', 'Leszno', 51.8406, 16.5749, 'wielkopolskie'),
  M('zamosc', 'Zamość', 50.7231, 23.2519, 'lubelskie'),
  M('lomza', 'Łomża', 53.1781, 22.059, 'podlaskie'),
  M('elk', 'Ełk', 53.8281, 22.3647, 'warmińsko-mazurskie'),
  M('przemysl', 'Przemyśl', 49.7838, 22.7678, 'podkarpackie'),
  M('stalowa-wola', 'Stalowa Wola', 50.5826, 22.0533, 'podkarpackie'),
  M('chelm', 'Chełm', 51.1431, 23.4712, 'lubelskie'),
  M('tomaszow-mazowiecki', 'Tomaszów Mazowiecki', 51.5313, 20.0085, 'łódzkie'),
  M('biala-podlaska', 'Biała Podlaska', 52.0325, 23.1149, 'lubelskie'),
  M('kedzierzyn-kozle', 'Kędzierzyn-Koźle', 50.3497, 18.2264, 'opolskie'),
  M('mielec', 'Mielec', 50.2874, 21.4239, 'podkarpackie'),
  M('ostroleka', 'Ostrołęka', 53.0846, 21.5743, 'mazowieckie'),
  M('pulawy', 'Puławy', 51.4164, 21.9694, 'lubelskie'),
  M('krosno', 'Krosno', 49.6888, 21.7706, 'podkarpackie'),
  M('tarnobrzeg', 'Tarnobrzeg', 50.5732, 21.6794, 'podkarpackie'),
  M('zakopane', 'Zakopane', 49.2992, 19.9496, 'małopolskie'),
  M('sopot', 'Sopot', 54.4418, 18.5601, 'pomorskie'),
  M('kolobrzeg', 'Kołobrzeg', 54.1758, 15.5834, 'zachodniopomorskie'),
  M('swinoujscie', 'Świnoujście', 53.9105, 14.2475, 'zachodniopomorskie'),
  M('wladyslawowo', 'Władysławowo', 54.7909, 18.4017, 'pomorskie'),
  M('augustow', 'Augustów', 53.8434, 22.9797, 'podlaskie'),
  M('gizycko', 'Giżycko', 54.0379, 21.7647, 'warmińsko-mazurskie'),
  M('sandomierz', 'Sandomierz', 50.6825, 21.7487, 'świętokrzyskie'),
  M('kazimierz-dolny', 'Kazimierz Dolny', 51.3214, 21.9465, 'lubelskie'),
  M('karpacz', 'Karpacz', 50.7764, 15.7564, 'dolnośląskie'),
  M('szklarska-poreba', 'Szklarska Poręba', 50.8269, 15.5232, 'dolnośląskie'),
  M('ustka', 'Ustka', 54.5805, 16.8619, 'pomorskie'),
  M('hel', 'Hel', 54.6085, 18.8015, 'pomorskie'),
  M('wisla', 'Wisła', 49.6553, 18.8597, 'śląskie'),
  M('ustrzyki-dolne', 'Ustrzyki Dolne', 49.4307, 22.5932, 'podkarpackie')
];

/** Miasta, dla których powstają podstrony „koszt przejazdu X – Y” (wszystkie pary) */
export const MIASTA_TRAS = ['warszawa', 'krakow', 'wroclaw', 'lodz', 'poznan', 'gdansk', 'szczecin', 'bydgoszcz', 'lublin', 'bialystok', 'katowice', 'rzeszow', 'kielce', 'olsztyn', 'opole', 'zakopane'];

export function miasto(slug: string): Miasto | undefined {
  return MIASTA.find((m) => m.slug === slug);
}

const bezOgonkow = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .trim();

/** Szuka miasta po nazwie wpisanej przez użytkownika (bez względu na wielkość liter i polskie znaki) */
export function znajdzMiasto(tekst: string): Miasto | undefined {
  const t = bezOgonkow(tekst);
  if (!t) return undefined;
  return MIASTA.find((m) => bezOgonkow(m.nazwa) === t) || MIASTA.find((m) => bezOgonkow(m.nazwa).startsWith(t));
}

/** Odległość w linii prostej (km) */
export function wLiniiProstej(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Szacunkowa odległość drogowa: drogi w Polsce są średnio o ok. 25% dłuższe niż linia prosta */
export function odlegloscDrogowa(a: Miasto, b: Miasto): number {
  return Math.round((wLiniiProstej(a, b) * 1.25) / 5) * 5;
}

export interface Trasa {
  id: string;
  a: Miasto;
  b: Miasto;
  km: number;
}

export function wszystkieTrasy(): Trasa[] {
  const lista = MIASTA_TRAS.map((s) => miasto(s)!).filter(Boolean);
  const out: Trasa[] = [];
  for (let i = 0; i < lista.length; i++)
    for (let j = i + 1; j < lista.length; j++) out.push({ id: `${lista[i].slug}-${lista[j].slug}`, a: lista[i], b: lista[j], km: odlegloscDrogowa(lista[i], lista[j]) });
  return out;
}

export function trasa(id: string): Trasa | undefined {
  return wszystkieTrasy().find((t) => t.id === id);
}
