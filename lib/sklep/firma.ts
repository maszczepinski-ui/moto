import firma from '@/data/sklep/firma.json';

export const FIRMA = firma as { nazwa: string; adres: string; nip: string; email: string; regulaminZatwierdzony: boolean };
/** regulamin gotowy = dane uzupełnione i zaznaczone przez właściciela po sprawdzeniu przez prawnika */
export const regulaminGotowy = () => FIRMA.regulaminZatwierdzony && ![FIRMA.adres, FIRMA.nip, FIRMA.email].some((x) => x.includes('['));
