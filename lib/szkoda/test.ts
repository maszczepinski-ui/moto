// Darmowy szybki test kosztorysu (strona /po-szkodzie/). Działa w przeglądarce, niczego nie wysyła.
// Daje ogólne sygnały – konkretne argumenty i pisma są w płatnym Sprawdzaczu.

export type Odpowiedz = 'tak' | 'nie' | 'niewiem';

export interface PytanieTestu {
  id: 'calkowita' | 'zamienniki' | 'potracenia' | 'rabaty' | 'vat' | 'pominiete' | 'termin';
  pytanie: string;
  podpowiedz: string;
  /** sygnał pokazywany przy odpowiedzi „tak” */
  sygnal: string;
}

export const PYTANIA_TESTU: PytanieTestu[] = [
  {
    id: 'calkowita',
    pytanie: 'Czy ubezpieczyciel uznał szkodę całkowitą?',
    podpowiedz: 'W decyzji jest mowa o „szkodzie całkowitej”, wartości pojazdu i wartości pozostałości (wraku).',
    sygnal: 'Przy szkodzie całkowitej najczęściej spór dotyczy zaniżonej wartości auta i zawyżonej wartości wraku – obie liczby da się podważyć ogłoszeniami i ofertą skupu.'
  },
  {
    id: 'zamienniki',
    pytanie: 'Czy przy częściach w kosztorysie są oznaczenia zamienników?',
    podpowiedz: 'Np. litery Q, P, PJ obok numeru części albo słowa „zamiennik”, „część alternatywna”.',
    sygnal: 'Zamienniki zamiast oryginałów to jeden z najczęstszych powodów niższej wypłaty. To ubezpieczyciel powinien wykazać, że tańsze części przywrócą auto do stanu sprzed szkody.'
  },
  {
    id: 'potracenia',
    pytanie: 'Czy od cen części coś odjęto?',
    podpowiedz: 'Szukaj słów „amortyzacja”, „urealnienie”, „obniżenie wartości” albo procentu przy częściach.',
    sygnal: 'Potrącenia za wiek auta są dopuszczalne tylko wtedy, gdy ubezpieczyciel wykaże, że naprawa zwiększyła wartość auta (uchwała 7 sędziów SN III CZP 80/11).'
  },
  {
    id: 'rabaty',
    pytanie: 'Czy kosztorys ma rabaty na części albo lakier?',
    podpowiedz: 'Pozycje „rabat”, „upust”, „obniżka” przy częściach lub materiale lakierniczym.',
    sygnal: 'Rabaty dostępne tylko dla ubezpieczyciela albo jego warsztatów nie powinny obniżać Twojej wypłaty, jeśli narusza to Twój uzasadniony interes (uchwała SN III CZP 32/24).'
  },
  {
    id: 'vat',
    pytanie: 'Czy wypłacono kwotę netto (bez VAT), choć nie odliczasz VAT?',
    podpowiedz: 'W decyzji jest „kwota netto” albo VAT 0 zł. Nie dotyczy, jeśli auto naprawiono już bez faktury z VAT.',
    sygnal: 'Jeśli nie odliczasz VAT, podatek jest częścią kosztu naprawy – a to zwykle 23% całej kwoty.'
  },
  {
    id: 'pominiete',
    pytanie: 'Czy widzisz na aucie uszkodzenia z tej kolizji, których nie ma w kosztorysie?',
    podpowiedz: 'Np. ukryte pod zderzakiem mocowania, czujniki parkowania, nadkole, lakierowanie elementu sąsiedniego.',
    sygnal: 'Pominięte uszkodzenia to prosta podstawa do żądania ponownych oględzin i uzupełnienia kosztorysu.'
  },
  {
    id: 'termin',
    pytanie: 'Czy od zgłoszenia szkody minęło ponad 30 dni bez wypłaty?',
    podpowiedz: 'Ubezpieczyciel ma 30 dni, a gdy sprawa jest trudna – musi napisać, dlaczego trwa to dłużej.',
    sygnal: 'Po 30 dniach możesz wezwać do wypłaty co najmniej części bezspornej i żądać odsetek za opóźnienie.'
  }
];

export interface WynikTestu {
  sygnaly: PytanieTestu[];
  niepewne: number;
  ocena: 'mocne' | 'sa' | 'brak';
}

export function ocenTest(odp: Partial<Record<PytanieTestu['id'], Odpowiedz>>): WynikTestu {
  const sygnaly = PYTANIA_TESTU.filter((p) => odp[p.id] === 'tak');
  const niepewne = PYTANIA_TESTU.filter((p) => odp[p.id] === 'niewiem').length;
  const ocena = sygnaly.length >= 2 ? 'mocne' : sygnaly.length === 1 ? 'sa' : 'brak';
  return { sygnaly, niepewne, ocena };
}
