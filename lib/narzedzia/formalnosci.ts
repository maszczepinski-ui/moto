// Terminarz formalności po zakupie (i sprzedaży) auta – terminy, kwoty i kary. Stan na listopad 2026.
// ŻEBY ZMIENIĆ KWOTĘ LUB TERMIN: popraw stałe poniżej – kalkulator i strony scenariuszy przeliczą się same.
// Źródła: art. 140mb Prawa o ruchu drogowym (kary za rejestrację i zbycie – rankomat.pl, BIP Kraków, Auto Świat 2026),
// ustawa o PCC (2%, 14 dni, zwolnienie do 1000 zł – otomoto.pl, rankomat.pl 2026), formularz AKC-U/S (podatki.gov.pl),
// rankomat.pl (darowizna: SD-Z2 w 6 miesięcy, zgłoszenie do ubezpieczyciela 14 dni; kara UFG 9610 zł w 2026).

export const STAN_FORMALNOSCI = 'listopad 2026';

export const KWOTY = {
  stawkaPcc: 2,
  progPcc: 1000,
  karaRejestracja: 500,
  karaRejestracja180: 1000,
  karaZbycie: 250,
  karaBrakOc: 9610,
  oplatyRejestracji: 160
};

export type Scenariusz = 'osoba-prywatna' | 'firma-faktura' | 'komis' | 'z-ue' | 'spoza-ue' | 'darowizna' | 'sprzedaz';

export interface Krok {
  /** dni od daty umowy (null = bez sztywnego terminu) */
  dni: number | null;
  /** zamiast dni: miesiące (darowizna) */
  miesiace?: number;
  tytul: string;
  opis: string;
  kwota?: string;
  kara?: string;
  pilne?: boolean;
}

export interface DaneScenariusza {
  id: Scenariusz;
  nazwa: string;
  /** do adresu i tytułu strony */
  slug: string;
  tytulStrony: string;
  wstep: string;
  pcc: boolean;
}

export const SCENARIUSZE: DaneScenariusza[] = [
  { id: 'osoba-prywatna', nazwa: 'Od osoby prywatnej (umowa)', slug: 'od-osoby-prywatnej', tytulStrony: 'Auto od osoby prywatnej – formalności i terminy', wstep: 'Najczęstszy przypadek: umowa kupna-sprzedaży z osobą prywatną. Płacisz podatek PCC i rejestrujesz auto w 30 dni.', pcc: true },
  { id: 'firma-faktura', nazwa: 'Od firmy lub dealera (faktura)', slug: 'od-firmy-na-fakture', tytulStrony: 'Auto od firmy na fakturę – formalności i terminy', wstep: 'Kupujesz od firmy na fakturę VAT albo VAT-marża. Nie płacisz PCC, ale terminy rejestracji i OC są takie same.', pcc: false },
  { id: 'komis', nazwa: 'Z komisu', slug: 'z-komisu', tytulStrony: 'Auto z komisu – PCC czy nie? Formalności', wstep: 'W komisie wszystko zależy od tego, kto jest sprzedawcą w dokumencie: komis (faktura) czy poprzedni właściciel (umowa).', pcc: false },
  { id: 'z-ue', nazwa: 'Sprowadzone z UE (np. z Niemiec)', slug: 'auto-z-niemiec', tytulStrony: 'Auto z Niemiec i UE – formalności i terminy', wstep: 'Po przywiezieniu auta z kraju UE masz 14 dni na deklarację akcyzową i 30 dni na rejestrację.', pcc: false },
  { id: 'spoza-ue', nazwa: 'Sprowadzone spoza UE (np. z USA)', slug: 'auto-z-usa', tytulStrony: 'Auto z USA i spoza UE – formalności i terminy', wstep: 'Auto spoza UE przechodzi odprawę celną: cło, akcyza i VAT są rozliczane w urzędzie celnym, a potem masz 30 dni na rejestrację.', pcc: false },
  { id: 'darowizna', nazwa: 'Darowizna od rodziny', slug: 'darowizna-auta', tytulStrony: 'Darowizna auta od rodziny – formalności i terminy', wstep: 'Najbliższa rodzina jest zwolniona z podatku od darowizny, ale tylko po zgłoszeniu jej do urzędu skarbowego w 6 miesięcy.', pcc: false },
  { id: 'sprzedaz', nazwa: 'Sprzedałem auto (sprzedający)', slug: 'po-sprzedazy-auta', tytulStrony: 'Sprzedałeś auto? Formalności sprzedającego', wstep: 'Sprzedający ma dwa obowiązki: zgłosić zbycie w wydziale komunikacji i powiadomić swojego ubezpieczyciela OC.', pcc: false }
];

const zl = (n: number) => `${Math.round(n).toLocaleString('pl-PL')} zł`;

const OC_KUPUJACY: Krok = {
  dni: 0,
  tytul: 'Sprawdź OC – auto nie może być bez polisy',
  opis: 'Z autem przejmujesz polisę OC poprzedniego właściciela. Możesz ją wypowiedzieć w dowolnym momencie i kupić własną albo zostawić do końca okresu – przejęta polisa nie odnowi się sama. Ubezpieczyciel może przeliczyć składkę według Twoich danych.',
  kara: `brak OC dłużej niż 14 dni: ${zl(KWOTY.karaBrakOc)} kary z UFG`,
  pilne: true
};

const REJESTRACJA: Krok = {
  dni: 30,
  tytul: 'Złóż wniosek o rejestrację',
  opis: 'W wydziale komunikacji właściwym dla miejsca zamieszkania albo przez internet (gov.pl). Od 2024 r. nie ma już samego „zgłoszenia nabycia” – trzeba zarejestrować auto.',
  kwota: `ok. ${zl(KWOTY.oplatyRejestracji)} (dowód, tablice, znaki, pozwolenie czasowe)`,
  kara: `${zl(KWOTY.karaRejestracja)}, a po 180 dniach ${zl(KWOTY.karaRejestracja180)}`
};

const PRZEGLAD: Krok = {
  dni: null,
  tytul: 'Sprawdź datę badania technicznego',
  opis: 'Jeśli badanie się kończy, zrób je przed upływem terminu – jazda bez ważnego badania grozi mandatem i problemami z odszkodowaniem.'
};

export function kroki(s: Scenariusz, wartosc: number): Krok[] {
  const pcc = Math.round((wartosc * KWOTY.stawkaPcc) / 100);
  const krokPcc: Krok = wartosc > KWOTY.progPcc
    ? { dni: 14, tytul: 'Złóż PCC-3 i zapłać podatek', opis: 'Deklarację składasz w urzędzie skarbowym albo online w e-Urzędzie Skarbowym. Podatek liczy się od wartości rynkowej auta, a nie od ceny z umowy – zaniżona cena może skończyć się dopłatą z odsetkami.', kwota: `${KWOTY.stawkaPcc}% wartości rynkowej ≈ ${zl(pcc)}`, kara: 'odsetki i kara z kodeksu karnego skarbowego', pilne: true }
    : { dni: null, tytul: 'PCC nie płacisz', opis: `Auto o wartości rynkowej do ${zl(KWOTY.progPcc)} jest zwolnione z podatku PCC.` };

  switch (s) {
    case 'osoba-prywatna':
      return [OC_KUPUJACY, krokPcc, REJESTRACJA, PRZEGLAD];
    case 'firma-faktura':
      return [
        OC_KUPUJACY,
        { dni: null, tytul: 'PCC nie płacisz', opis: 'Sprzedaż na fakturę VAT lub VAT-marża jest objęta VAT, więc nie składasz PCC-3. Zachowaj fakturę – jest potrzebna do rejestracji.' },
        REJESTRACJA,
        PRZEGLAD
      ];
    case 'komis':
      return [
        OC_KUPUJACY,
        { dni: 14, tytul: 'Sprawdź, kto jest sprzedawcą w dokumencie', opis: 'Jeśli komis wystawił fakturę (był właścicielem auta), nie płacisz PCC. Jeśli dostałeś umowę z poprzednim właścicielem, a komis tylko pośredniczył – PCC-3 płacisz jak przy zakupie od osoby prywatnej.', kwota: wartosc > KWOTY.progPcc ? `jeśli umowa: ≈ ${zl(pcc)} PCC` : undefined, pilne: true },
        REJESTRACJA,
        PRZEGLAD
      ];
    case 'z-ue':
      return [
        { dni: 0, tytul: 'Transport i ubezpieczenie na drogę', opis: 'Przywieź auto lawetą albo na tablicach wywozowych z ubezpieczeniem. Przy zakupie za granicą zwykle nie płacisz PCC, bo auto w chwili zakupu jest poza Polską.' },
        { dni: 14, tytul: 'Złóż deklarację akcyzową AKC-U/S i zapłać akcyzę', opis: 'Termin liczy się od powstania obowiązku podatkowego (przywozu auta), najpóźniej w dniu rejestracji. Bez potwierdzenia zapłaty akcyzy urząd nie zarejestruje auta. Stawka: 3,1% (do 2000 cm³) albo 18,6% (powyżej), hybrydy mają obniżone stawki.', kwota: 'policz w kalkulatorze akcyzy', pilne: true },
        { dni: 14, tytul: 'Tłumaczenia i badanie techniczne', opis: 'Umowę lub fakturę tłumaczy tłumacz przysięgły (ok. 100–250 zł). Badanie techniczne przed rejestracją kosztuje 149 zł (z LPG więcej).' },
        { dni: 0, tytul: 'Wykup OC najpóźniej w dniu rejestracji', opis: 'Auto sprowadzone nie ma polskiej polisy – kupujesz własną.', pilne: true },
        REJESTRACJA
      ];
    case 'spoza-ue':
      return [
        { dni: 0, tytul: 'Odprawa celna', opis: 'Cło (10%, dla aut wyprodukowanych w USA 0% od 1.07.2026), akcyza i VAT 23% są rozliczane w urzędzie celnym. Zachowaj dokumenty odprawy – są potrzebne do rejestracji.', kwota: 'policz w kalkulatorze akcyzy', pilne: true },
        { dni: null, tytul: 'Dostosuj auto do wymagań UE', opis: 'Auta z USA zwykle wymagają przeróbek świateł i kierunkowskazów, żeby przejść badanie techniczne.' },
        { dni: 0, tytul: 'Wykup OC najpóźniej w dniu rejestracji', opis: 'Auto bez polskiej polisy – kupujesz własną.', pilne: true },
        REJESTRACJA
      ];
    case 'darowizna':
      return [
        OC_KUPUJACY,
        { dni: 30, tytul: 'Zarejestruj auto na siebie', opis: 'Do wniosku dołączasz umowę darowizny. Darczyńca w tym samym czasie zgłasza zbycie auta w swoim wydziale komunikacji.', kwota: `ok. ${zl(KWOTY.oplatyRejestracji)}`, kara: `${zl(KWOTY.karaRejestracja)}` },
        { dni: null, miesiace: 6, tytul: 'Zgłoś darowiznę na SD-Z2', opis: 'Najbliższa rodzina (małżonek, dzieci, wnuki, rodzice, dziadkowie, rodzeństwo, pasierb, ojczym, macocha) jest zwolniona z podatku tylko po zgłoszeniu darowizny w 6 miesięcy. Dalsza rodzina zgłasza darowiznę na SD-3 w miesiąc i może zapłacić podatek.', pilne: true }
      ];
    case 'sprzedaz':
      return [
        { dni: 14, tytul: 'Powiadom ubezpieczyciela OC', opis: 'Prześlij kopię umowy. Za okres po sprzedaży możesz odzyskać część składki (jeśli kupujący wypowie polisę).', pilne: true },
        { dni: 30, tytul: 'Zgłoś zbycie auta w wydziale komunikacji', opis: 'Osobiście, pocztą albo online przez gov.pl (z profilem zaufanym lub mObywatelem). Zgłoszenie chroni Cię przed mandatami i opłatami nabywcy.', kara: zl(KWOTY.karaZbycie), pilne: true },
        { dni: null, tytul: 'Podatek od sprzedaży – zwykle brak', opis: 'Sprzedaż prywatnego auta po upływie 6 miesięcy, licząc od końca miesiąca zakupu, nie powoduje podatku dochodowego. Przy szybszej odsprzedaży z zyskiem może pojawić się PIT.' }
      ];
  }
}

export interface Termin extends Krok {
  data: string | null;
}

/** Kroki z datami (RRRR-MM-DD) liczonymi od dnia umowy */
export function terminy(s: Scenariusz, wartosc: number, dataUmowy: string): Termin[] {
  const start = new Date(`${dataUmowy}T12:00:00`);
  const poprawna = !Number.isNaN(start.getTime());
  return kroki(s, wartosc).map((k) => {
    if (!poprawna || (k.dni === null && !k.miesiace)) return { ...k, data: null };
    const d = new Date(start);
    if (k.miesiace) d.setMonth(d.getMonth() + k.miesiace);
    else d.setDate(d.getDate() + (k.dni ?? 0));
    return { ...k, data: d.toISOString().slice(0, 10) };
  });
}

export function scenariuszPoSlugu(slug: string) {
  return SCENARIUSZE.find((s) => s.slug === slug);
}
