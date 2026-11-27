// Linki partnerskie Ceneo (Program Partnerski Ceneo.pl).
// WAŻNE (regulamin, art. V ust. 1 lit. m): wolno używać tylko linków wygenerowanych w panelu partnera
// (albo wtyczką „Program Partnerski Ceneo” / przez API) i nie wolno zmieniać ich kodu.
// Dlatego NIE składamy linków sami – każdy link wkleja się gotowy z panelu do danych produktu.

/** Przepuszcza tylko gotowy link z panelu Ceneo (adres ceneo.pl z parametrem pid). Inaczej pusty = brak przycisku. */
export function linkCeneoZPanelu(link?: string): string {
  const l = (link || '').trim();
  return /^https:\/\/www\.ceneo\.pl\/.+[#?&;]pid=\d+/.test(l) ? l : '';
}
