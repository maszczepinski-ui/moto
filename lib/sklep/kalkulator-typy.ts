// Typy danych kalkulatora (same dane są prywatne – poza repozytorium, patrz lib/sklep/kalkulator.ts)
export type Warunek = 'benzyna' | 'diesel' | 'lpg' | 'elektryk' | 'automat' | 'manual';
export interface PozycjaStartowa { id: string; nazwa: string; opis: string; od: number; do: number; domyslnie: boolean; warunek?: Warunek }
export interface Usterka { id: string; grupa: string; nazwa: string; jakSprawdzic: string; od: number; do: number; argument: string; warunek?: Warunek }
export interface DaneKalkulatora {
  wersja: number;
  aktualizacja: string;
  uwaga: string;
  klasy: { id: string; nazwa: string; przyklad: string; mnoznik: number }[];
  oplaty: { pccStawka: number; pccProg: number; rejestracjaNoweTablice: number; rejestracjaZachowaneTablice: number; przeglad: number; przegladLpgDodatek: number; uwagaRejestracja: string };
  startowe: PozycjaStartowa[];
  usterki: Usterka[];
  negocjacje: { zapasRyzyka: number; zaokraglenie: number; wstep: string; zakonczenie: string };
}
