// Typy prywatnych danych Sprawdzacza kosztorysu (plik SZKODA_DANE_URL w Vercel Blob – NIE w repozytorium).
// Sam układ danych jest publiczny; treść argumentów i pism dostaje tylko zalogowany kupujący.

/** Pola, które kupujący wpisuje w Sprawdzaczu i które trafiają do pism jako {nazwa} */
export type Pole =
  | 'imieNazwisko' | 'adres' | 'telefon' | 'email' | 'miejscowosc' | 'data'
  | 'ubezpieczyciel' | 'adresUbezpieczyciela' | 'numerSzkody' | 'dataZdarzenia' | 'dataZgloszenia'
  | 'markaModel' | 'nrRej' | 'rokProdukcji' | 'konto'
  | 'kwotaWyplacona' | 'kwotaZadana' | 'dataDecyzji' | 'dataReklamacji' | 'dataDoreczeniaReklamacji' | 'dataOdmowy'
  | 'stawkaKosztorys' | 'stawkaWarsztat' | 'nazwaWarsztatu' | 'rbg'
  | 'potracenia' | 'rabaty' | 'vat' | 'roznicaOryginaly' | 'pominiete'
  | 'wartoscTu' | 'wrakTu' | 'wartoscWlasna' | 'wrakWlasny'
  | 'kosztNajmu' | 'okresNajmu' | 'celNajmu' | 'kosztRzeczoznawcy';

/** Argument do pisma – wybierany automatycznie na podstawie liczb z kosztorysu */
export interface Argument {
  id: 'stawka' | 'zamienniki' | 'potracenia' | 'rabaty' | 'vat' | 'pominiete' | 'calkowita-wartosc' | 'calkowita-wrak' | 'zastepcze' | 'rzeczoznawca';
  /** krótka nazwa czerwonej flagi w wyniku (język dla kupującego) */
  tytul: string;
  /** nagłówek punktu w piśmie (język urzędowy) */
  naglowek: string;
  /** wyjaśnienie dla kupującego (prostym językiem) */
  wyjasnienie: string;
  /** akapity do pisma, z {polami}; akapit z „jesli” pojawia się tylko, gdy to pole jest wypełnione */
  akapity: (string | { jesli: Pole; tekst: string })[];
  /** dowody, które warto dołączyć */
  dowody: string[];
}

/** Typowy zarzut ubezpieczyciela w odmowie i odpowiedź na niego (etap 2) */
export interface Riposta {
  id: string;
  zarzut: string;
  akapity: (string | { jesli: Pole; tekst: string })[];
  dowody: string[];
}

/** Akapit pisma: zwykły tekst z {polami} albo wstawka listy argumentów / ripost / dowodów */
export type Akapit =
  | string
  | { jesli: Pole | 'argumenty' | 'riposty'; tekst: string }
  | { wstaw: 'argumenty' | 'riposty' | 'zalaczniki' };

export interface Pismo {
  id: 'reklamacja' | 'akta' | 'zastepcze' | 'ponaglenie' | 'wezwanie-art8' | 'odpowiedz' | 'rzecznik';
  etap: 1 | 2;
  tytul: string;
  /** kiedy wysłać – pokazywane nad przyciskiem */
  kiedy: string;
  /** tytuł w nagłówku pisma, np. „Reklamacja” */
  naglowek: string;
  akapity: Akapit[];
  /** stałe załączniki (dowody z argumentów dopisują się same) */
  zalaczniki: string[];
}

export interface DaneSzkody {
  wersja: number;
  aktualizacja: string;
  argumenty: Argument[];
  riposty: Riposta[];
  pisma: Pismo[];
  /** wiadomość do warsztatu z prośbą o stawkę i wycenę */
  wiadomoscWarsztat: string;
  /** zastrzeżenie pod każdym pismem w Sprawdzaczu (nie trafia do pisma) */
  zastrzezenie: string;
}
