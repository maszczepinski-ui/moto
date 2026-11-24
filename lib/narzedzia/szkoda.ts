// Szkoda całkowita z OC sprawcy i auto zastępcze – dane i wyliczenia. Stan na listopad 2026.
// Szkoda całkowita z OC: koszt naprawy przekracza wartość auta sprzed szkody; odszkodowanie = wartość przed szkodą – wartość wraku
// (rankomat.pl, mubi.pl, cuk.pl 2026). Przy AC decyduje umowa (często próg ok. 70%).
// Stawki najmu aut zastępczych akceptowane przez ERGO Hestię i Wartę (brutto za dobę, stan 28.08.2026 wg rankomat.pl).

export const STAN_SZKODY = 'listopad 2026';

export interface KlasaZastepcza {
  id: string;
  slug: string;
  nazwa: string;
  przyklady: string;
  hestia: number;
  warta: number;
}

export const KLASY: KlasaZastepcza[] = [
  { id: 'A', slug: 'klasa-a', nazwa: 'Klasa A (auta miejskie mini)', przyklady: 'Toyota Aygo, Kia Picanto, Fiat Panda', hestia: 90, warta: 78 },
  { id: 'B', slug: 'klasa-b', nazwa: 'Klasa B (auta małe)', przyklady: 'Toyota Yaris, Skoda Fabia, Opel Corsa', hestia: 98, warta: 80 },
  { id: 'C', slug: 'klasa-c', nazwa: 'Klasa C (kompakty)', przyklady: 'Volkswagen Golf, Skoda Octavia, Toyota Corolla', hestia: 109, warta: 91 },
  { id: 'D', slug: 'klasa-d', nazwa: 'Klasa D (auta rodzinne)', przyklady: 'Skoda Superb, Volkswagen Passat, Toyota Camry', hestia: 153, warta: 135 },
  { id: 'Dp', slug: 'klasa-d-premium', nazwa: 'Klasa D premium', przyklady: 'BMW serii 3, Audi A4, Mercedes klasy C', hestia: 212, warta: 199 },
  { id: 'E', slug: 'klasa-e', nazwa: 'Klasa E (wyższa)', przyklady: 'BMW serii 5, Audi A6, Mercedes klasy E', hestia: 301, warta: 264 },
  { id: 'X', slug: 'crossover', nazwa: 'Crossover', przyklady: 'Toyota C-HR, Skoda Kamiq, Kia Stonic', hestia: 130, warta: 112 },
  { id: 'SUV', slug: 'suv', nazwa: 'SUV', przyklady: 'Skoda Kodiaq, Toyota RAV4, Kia Sportage', hestia: 152, warta: 137 },
  { id: 'SUVp', slug: 'suv-premium', nazwa: 'SUV premium', przyklady: 'BMW X3, Audi Q5, Volvo XC60', hestia: 458, warta: 257 },
  { id: 'K', slug: 'van', nazwa: 'Van / minivan (7 miejsc)', przyklady: 'Volkswagen Touran, Ford Galaxy, Opel Zafira', hestia: 156, warta: 152 }
];

export function klasaPoSlugu(slug: string) {
  return KLASY.find((k) => k.slug === slug);
}

export interface WynikSzkody {
  calkowita: boolean;
  /** koszt naprawy jako % wartości auta */
  procentNaprawy: number;
  nalezne: number;
  /** różnica między należnym a propozycją ubezpieczyciela (dodatnia = zaniżenie) */
  roznica: number;
  /** ile zostanie po sprzedaży wraku za realną cenę */
  razemZWrakiem: number;
  zawyzonyWrak: boolean;
}

export function policzSzkode(wartosc: number, wrak: number, naprawa: number, oferta: number, wrakRealny: number): WynikSzkody {
  const calkowita = naprawa > wartosc;
  const nalezne = calkowita ? Math.max(0, wartosc - wrak) : naprawa;
  return {
    calkowita,
    procentNaprawy: wartosc > 0 ? naprawa / wartosc : 0,
    nalezne,
    roznica: oferta > 0 ? nalezne - oferta : 0,
    razemZWrakiem: calkowita ? nalezne + wrakRealny : nalezne,
    zawyzonyWrak: calkowita && wrakRealny > 0 && wrakRealny < wrak
  };
}

export function kosztZastepczego(k: KlasaZastepcza, dni: number) {
  return { od: Math.min(k.hestia, k.warta) * dni, do: Math.max(k.hestia, k.warta) * dni };
}
