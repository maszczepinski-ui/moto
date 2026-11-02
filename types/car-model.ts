// =====================================================================
// Opis danych jednego modelu auta (jeden plik JSON w data/models/)
// =====================================================================

export type Nadwozie = 'sedan' | 'kombi' | 'hatchback' | 'coupe' | 'kabriolet' | 'suv' | 'van';

export interface Silnik {
  /** np. "320i" */
  nazwa: string;
  /** np. "M50B20" – opcjonalnie */
  kod?: string;
  pojemnoscCm3: number;
  mocKm: number;
  paliwo: string;
  lata: string;
}

export interface Wymiary {
  dlugoscMm: number;
  szerokoscMm: number;
  wysokoscMm: number;
  rozstawOsiMm: number;
  /** np. "435 l" */
  bagaznik?: string;
}

/** Liczba aut w jednym województwie (kod TERYT, np. "06" = lubelskie) */
export interface WojewodztwoStat {
  teryt: string;
  liczba: number;
}

export interface Udzial {
  nazwa: string;
  liczba: number;
}

export interface Usterka {
  tytul: string;
  opis: string;
  powaga: 'drobna' | 'średnia' | 'kosztowna';
}

/** Odnośnik do innej karty */
export interface RefKarty {
  slug: string;
  nazwa: string;
  adres: string;
  lata?: string;
}

export interface CarModel {
  slug: string;
  /** adres podstrony, np. /marki/volkswagen/golf/ albo /marki/volkswagen/golf/iv/ */
  adres: string;
  markaSlug: string;
  modelSlug: string;
  generacjaSlug?: string;
  /** slug karty zbiorczej modelu (dla kart generacji) */
  rodzic?: string;
  generacjeLista?: RefKarty[];
  poprzednik?: RefKarty;
  nastepca?: RefKarty;
  /** podobne auta innych marek (rocznik, pojemność, nadwozie) */
  konkurenci?: RefKarty[];
  marka: string;
  model: string;
  generacja: string;
  lataProdukcji: string;
  /** Pierwszy typ nadwozia decyduje o rysunku */
  nadwozia: Nadwozie[];
  opisModelu?: string;
  /** true = strona zbiorcza dla wszystkich generacji (np. „Volkswagen Golf”) */
  wszystkieGeneracje?: boolean;

  wymiary?: Wymiary;
  silniki?: Silnik[];

  /**
   * true = wersja robocza: liczby albo opisy nie są jeszcze sprawdzone.
   * Na stronie pojawia się wtedy ostrzeżenie.
   */
  daneTestowe: boolean;

  /** Statystyki z CEPiK */
  cepik: {
    /** Data stanu danych, np. "2022-04-17" */
    stanNa: string;
    /** Jak liczyliśmy, np. "osobowe BMW, model SERIA 3 / 3xx, rok produkcji 1990–2000" */
    jakLiczone: string;
    liczbaWPolsce: number;
    /** Ile z nich zmieniło właściciela lub zostało zarejestrowanych w Polsce od kwietnia 2017 do daty danych */
    aktywne?: number;
    /** Ile aut zarejestrowano w Polsce po raz pierwszy po dacie paczek CEPiK (listopad 2019) – z API CEPiK */
    noweOdPaczki?: number;
    /** Auta z napędem hybrydowym (także plug-in) */
    hybrydy?: number;
    /** Auta w pełni elektryczne */
    elektryczne?: number;
    /** Pierwsze rejestracje w Polsce według roku (od listopada 2019) */
    pierwszeRejestracje?: { rok: number; liczba: number }[];
    /** Pierwsze rejestracje w Polsce w pełnych miesiącach, np. { miesiac: '2026-03', liczba: 412 } */
    rejestracjeMiesiecznie?: { miesiac: string; liczba: number }[];
    /** miejsce w rankingu popularności (karty zbiorcze) */
    miejsce?: number;
    miejsceWMarce?: number;
    modeliWMarce?: number;
    sredniRocznik?: number | null;
    /** Auta bez przypisanego województwa */
    bezWojewodztwa?: number;
    wojewodztwa: WojewodztwoStat[];
    roczniki: { rok: number; liczba: number }[];
    paliwa: Udzial[];
    pojemnosci: Udzial[];
    pochodzenie: Udzial[];
    nadwozia?: Udzial[];
    /** Opcjonalnie: powiaty z największą liczbą aut */
    topPowiaty?: Udzial[];
  };

  usterki?: Usterka[];
  listaKontrolna?: string[];

  /** Numer filmu z YouTube (końcówka adresu po "v="). Puste = film wkrótce. */
  youtubeId: string;
  zrodla: string[];
  dataAktualizacji: string;
}
