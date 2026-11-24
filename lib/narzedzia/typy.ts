// Typy treści stron kalkulatorów (sekcje artykułu, pytania FAQ, źródła)

export interface Pytanie {
  q: string;
  a: string;
}

export interface Sekcja {
  h2: string;
  akapity?: string[];
  lista?: string[];
  /** tabela: pierwszy wiersz to nagłówki */
  tabela?: string[][];
}

export interface Zrodlo {
  n: string;
  url: string;
}
