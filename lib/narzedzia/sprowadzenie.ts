// „Koszt sprowadzenia auta” – kraje, typowe koszty transportu i porównanie z ceną w Polsce. Stan na listopad 2026.
// Transport lawetą: rankomat.pl (2026) – Niemcy średnio 1826 zł (ok. 2,1 zł/km), Belgia 2277 zł (1,8–2,0 zł/km);
// mubi.pl – 1,60–2,70 zł/km; otomoto.pl – z Niemiec orientacyjnie 1500–3000 zł, tablice wywozowe z OC 150–250 €.
// Dla pozostałych krajów: typowa odległość do centralnej Polski × 1,6–2,7 zł/km (szacunek redakcji).
// Podatki i opłaty urzędowe liczy lib/akcyza.ts (ten sam silnik co kalkulator akcyzy).

export const STAN_SPROWADZENIA = 'listopad 2026';

export interface Kraj {
  id: string;
  slug: string;
  nazwa: string;
  /** „z Niemiec” */
  zKraju: string;
  skad: 'ue' | 'spoza-ue';
  /** transport lawetą do centralnej Polski (zł) */
  transportOd: number;
  transportDo: number;
  waluta: 'EUR' | 'USD';
  tlumaczenia: number;
  uwagi: string[];
}

export const KRAJE: Kraj[] = [
  { id: 'de', slug: 'z-niemiec', nazwa: 'Niemcy', zKraju: 'z Niemiec', skad: 'ue', transportOd: 1500, transportDo: 3000, waluta: 'EUR', tlumaczenia: 150, uwagi: ['Najpopularniejszy kierunek – duży wybór aut i dokumenty TÜV/DEKRA z historią przeglądów.', 'Ważne niemieckie badanie techniczne często jest uznawane w Polsce przy rejestracji.', 'Powrót na kołach wymaga tablic wywozowych (Ausfuhrkennzeichen) z ubezpieczeniem – ok. 150–250 €.'] },
  { id: 'be', slug: 'z-belgii', nazwa: 'Belgia', zKraju: 'z Belgii', skad: 'ue', transportOd: 1900, transportDo: 2900, waluta: 'EUR', tlumaczenia: 200, uwagi: ['Belgijski raport Car-Pass pokazuje historię przebiegu – poproś o niego sprzedającego.', 'Auta w Belgii często mają duże przebiegi flotowe.'] },
  { id: 'nl', slug: 'z-holandii', nazwa: 'Holandia', zKraju: 'z Holandii', skad: 'ue', transportOd: 1800, transportDo: 2800, waluta: 'EUR', tlumaczenia: 200, uwagi: ['Holandia ma najwyższy średni roczny przebieg w Europie (ok. 30 tys. km według mubi.pl) – sprawdzaj przebieg szczególnie dokładnie.', 'Historię przebiegu (NAP) można sprawdzić w holenderskich bazach.'] },
  { id: 'fr', slug: 'z-francji', nazwa: 'Francja', zKraju: 'z Francji', skad: 'ue', transportOd: 2400, transportDo: 4000, waluta: 'EUR', tlumaczenia: 200, uwagi: ['Długa trasa – transport kosztuje więcej, a dokumenty wymagają tłumaczenia z francuskiego.', 'Francuski dowód rejestracyjny (carte grise) i certyfikat niezastawienia warto sprawdzić przed zakupem.'] },
  { id: 'dk', slug: 'z-danii', nazwa: 'Dania', zKraju: 'z Danii', skad: 'ue', transportOd: 1700, transportDo: 2800, waluta: 'EUR', tlumaczenia: 250, uwagi: ['Auta w Danii są drogie z powodu wysokich podatków przy rejestracji – okazje zdarzają się rzadziej.', 'Tłumaczenie z duńskiego jest droższe niż z niemieckiego.'] },
  { id: 'se', slug: 'ze-szwecji', nazwa: 'Szwecja', zKraju: 'ze Szwecji', skad: 'ue', transportOd: 2200, transportDo: 3600, waluta: 'EUR', tlumaczenia: 250, uwagi: ['Do kosztu transportu dolicz prom.', 'Auta ze Szwecji mają zwykle dobrze udokumentowaną historię w publicznym rejestrze.', 'Ceny w koronach – przelicz je na euro albo złote po aktualnym kursie.'] },
  { id: 'it', slug: 'z-wloch', nazwa: 'Włochy', zKraju: 'z Włoch', skad: 'ue', transportOd: 2400, transportDo: 4000, waluta: 'EUR', tlumaczenia: 200, uwagi: ['Mniej korozji dzięki klimatowi, ale częściej porysowane zderzaki z miejskiego parkowania.', 'Długa trasa – transport lawetą kosztuje więcej.'] },
  { id: 'at', slug: 'z-austrii', nazwa: 'Austria', zKraju: 'z Austrii', skad: 'ue', transportOd: 1400, transportDo: 2500, waluta: 'EUR', tlumaczenia: 150, uwagi: ['Bliski kierunek z południowej Polski.', 'Dokumenty po niemiecku – tłumaczenie tańsze niż z rzadszych języków.'] },
  { id: 'us', slug: 'z-usa', nazwa: 'USA', zKraju: 'z USA', skad: 'spoza-ue', transportOd: 4000, transportDo: 9000, waluta: 'USD', tlumaczenia: 250, uwagi: ['Do ceny dolicz transport do portu, kontener, ubezpieczenie i odprawę – część tych kosztów wchodzi do wartości celnej.', 'Od 1.07.2026 auta wyprodukowane w USA mają 0% cła (miejsce produkcji widać w VIN). Akcyza i VAT 23% zostają.', 'Auta z amerykańskich aukcji często są po szkodach – zaplanuj budżet na naprawę i przeróbki świateł.'] }
];

export function krajPoSlugu(slug: string) {
  return KRAJE.find((k) => k.slug === slug);
}
