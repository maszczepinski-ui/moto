// Adresy kalkulatorów i ich podstron – dla mapy strony (lib/sitemapy.ts, plik „kalkulatory”).
import { getAllModels } from '@/lib/models';
import { NARZEDZIA } from '@/lib/narzedzia/lista';
import { modelMaStronePrzebiegu } from '@/lib/narzedzia/przebieg';
import { modelMaStroneLpg } from '@/lib/narzedzia/lpg';
import { SCENARIUSZE } from '@/lib/narzedzia/formalnosci';
import { NAPRAWY, PRZEBIEGI_KALENDARZA, slugPrzebiegu } from '@/lib/narzedzia/naprawy';
import { KWOTY_FIRMA, slugKwoty } from '@/lib/narzedzia/firma';
import { KLASY } from '@/lib/narzedzia/szkoda';
import { STRONY_WADY } from '@/lib/narzedzia/wada';
import { KRAJE } from '@/lib/narzedzia/sprowadzenie';
import { ZWROTY } from '@/lib/narzedzia/slownik';
import { SCENARIUSZE_EV } from '@/lib/narzedzia/ev';
import { POPULARNE, slugOpony } from '@/lib/narzedzia/felgi';

export interface AdresNarzedzia {
  loc: string;
  priority: number;
}

export function adresyNarzedzi(): AdresNarzedzia[] {
  const modele = getAllModels();
  const glowne = (a: string) => ({ loc: a, priority: 0.8 });
  const pod = (a: string) => ({ loc: a, priority: 0.6 });
  return [
    { loc: '/kalkulatory/', priority: 0.8 },
    ...NARZEDZIA.map((n) => glowne(n.adres)),
    ...modele.filter(modelMaStronePrzebiegu).map((m) => pod(`/sprawdz-przebieg/${m.slug}/`)),
    ...modele.filter(modelMaStroneLpg).map((m) => pod(`/oplacalnosc-lpg/${m.slug}/`)),
    ...SCENARIUSZE.map((s) => pod(`/formalnosci-po-zakupie-auta/${s.slug}/`)),
    ...NAPRAWY.map((n) => pod(`/ile-zbic-cene-auta/${n.slug}/`)),
    ...PRZEBIEGI_KALENDARZA.map((k) => pod(`/kalendarz-napraw/${slugPrzebiegu(k)}/`)),
    ...KWOTY_FIRMA.map((k) => pod(`/auto-w-firmie/${slugKwoty(k)}/`)),
    ...KLASY.map((k) => pod(`/auto-zastepcze/${k.slug}/`)),
    ...STRONY_WADY.map((s) => pod(`/wada-ukryta-auta/${s.slug}/`)),
    ...KRAJE.map((k) => pod(`/koszt-sprowadzenia-auta/${k.slug}/`)),
    ...ZWROTY.map((z) => pod(`/slownik-ogloszen/${z.slug}/`)),
    ...SCENARIUSZE_EV.map((s) => pod(`/koszt-ladowania-elektryka/${s.slug}/`)),
    ...POPULARNE.map((o) => pod(`/zamiennik-opon/${slugOpony(o)}/`))
  ];
}
