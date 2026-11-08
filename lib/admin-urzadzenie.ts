// „To urządzenie należy do admina” – zapisywane w przeglądarce po wejściu na /admin/.
// Na takim urządzeniu Google Analytics się nie wczytuje, więc Twoje wizyty nie trafiają do statystyk.

export const KLUCZ_ADMIN = 'admin-bez-statystyk';

export function toUrzadzenieAdmina(): boolean {
  try {
    return localStorage.getItem(KLUCZ_ADMIN) === 'tak';
  } catch {
    return false;
  }
}

export function ustawUrzadzenieAdmina(tak: boolean) {
  try {
    // „nie” zapamiętujemy, żeby kolejne wejście do panelu nie włączyło pomijania z powrotem
    localStorage.setItem(KLUCZ_ADMIN, tak ? 'tak' : 'nie');
  } catch {
    /* przeglądarka nie pozwala zapisać – nic nie robimy */
  }
}

/** Przy pierwszym wejściu do panelu oznaczamy urządzenie jako admina (chyba że wcześniej to wyłączono) */
export function oznaczPrzyPierwszymWejsciu() {
  try {
    if (localStorage.getItem(KLUCZ_ADMIN) === null) localStorage.setItem(KLUCZ_ADMIN, 'tak');
  } catch {
    /* brak pamięci przeglądarki */
  }
}
