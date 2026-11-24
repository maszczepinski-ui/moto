// Treść stron „Kalendarz drogich napraw”
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

export const SEKCJE_KALENDARZ: Sekcja[] = [
  {
    h2: 'Po co planować naprawy z wyprzedzeniem',
    akapity: [
      'Najdroższe niespodzianki w używanym aucie rzadko są przypadkowe. Pasek rozrządu, sprzęgło z kołem dwumasowym, filtr DPF czy turbosprężarka zużywają się w dość przewidywalnych przedziałach przebiegu. Jeśli wiesz, co zbliża się w Twoim aucie, możesz odłożyć pieniądze, wybrać warsztat bez pośpiechu i uniknąć awarii w trasie.',
      'Ta sama wiedza przydaje się przy zakupie. Auto z przebiegiem 190 tys. km bez udokumentowanej wymiany rozrządu i sprzęgła to w praktyce kilka tysięcy złotych do wydania w pierwszym roku – i dobry argument w negocjacjach ceny.'
    ]
  },
  {
    h2: 'Jak czytać kalendarz',
    lista: [
      'Przebiegi to typowe zakresy dla popularnych aut – konkretny silnik może mieć krótszy albo dłuższy interwał. Sprawdź instrukcję albo książkę serwisową.',
      'Pasek rozrządu wymienia się także po latach (zwykle 5–7), nawet przy małym przebiegu – guma się starzeje.',
      'Diesle mają więcej pozycji: DPF, EGR, wtryski i turbo. Przy jeździe głównie po mieście te elementy zużywają się szybciej.',
      'Koszty to widełki dla warsztatu średniej półki. ASO i auta premium są zwykle droższe, a tanie zamienniki – tańsze, ale nie zawsze opłacalne.'
    ]
  }
];

export const PYTANIA_KALENDARZ: Pytanie[] = [
  { q: 'Co trzeba wymienić przy 150 tys. km?', a: 'Najczęściej: pasek rozrządu z pompą wody (jeśli auto go ma i nie był wymieniany), sprzęgło z kołem dwumasowym, elementy zawieszenia, a w dieslach także filtr DPF i zawór EGR. Dokładną listę dla Twojego auta pokaże kalkulator.' },
  { q: 'Co ile wymienia się pasek rozrządu?', a: 'Zwykle co 90–150 tys. km albo co 5–7 lat – co nastąpi pierwsze. Interwał dla konkretnego silnika podaje producent.' },
  { q: 'Ile kosztuje wymiana sprzęgła z dwumasą w 2026 r.?', a: 'Orientacyjnie 2500–5500 zł z robocizną w popularnym aucie.' },
  { q: 'Czy łańcuch rozrządu trzeba wymieniać?', a: 'Nie ma stałego interwału, ale w wielu silnikach łańcuch się wyciąga – zwykle między 150 a 250 tys. km. Objaw to grzechotanie po zimnym starcie.' }
];

export const ZRODLA_KALENDARZ: Zrodlo[] = [
  { n: 'cenauslug.pl – wymiana rozrządu 2026', url: 'https://cenauslug.pl/poradniki/ile-kosztuje-wymiana-rozrzadu' },
  { n: 'kb.pl – cenniki usług motoryzacyjnych', url: 'https://kb.pl/cenniki/uslugi/cennik-wymiany-rozrzadu-_mot/' },
  { n: 'Interia – wiek i przebieg a koszty napraw', url: 'https://motoryzacja.interia.pl/wiadomosci/news-podali-konkretny-wiek-i-przebieg-wtedy-auto-staje-sie-skarbo,nId,23476222' }
];
