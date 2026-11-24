// Treść stron „Czy LPG się opłaca?”
import { INSTALACJE, NADWYZKA_LPG, SERWIS_ROCZNIE } from '@/lib/narzedzia/lpg';
import type { Pytanie, Sekcja, Zrodlo } from '@/lib/narzedzia/typy';

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export const SEKCJE_LPG: Sekcja[] = [
  {
    h2: 'Jak liczymy zwrot instalacji',
    akapity: [
      `Auto na gazie spala zwykle o 15–25% więcej litrów LPG niż benzyny – przyjmujemy ${Math.round((NADWYZKA_LPG - 1) * 100)}%. Silniki z wtryskiem bezpośrednim (FSI, TSI, GDI) wciąż spalają trochę benzyny, nawet jadąc na gazie – liczymy 15%. Od oszczędności odejmujemy ${zl(SERWIS_ROCZNIE)} rocznie na przeglądy instalacji, filtry i regulację.`,
      'Zwrot pokazujemy w kilometrach i miesiącach. Jeśli instalacja zwraca się dłużej niż 4 lata, a planujesz sprzedać auto wcześniej, LPG może się nie opłacić – choć auto z dobrą instalacją łatwiej sprzedać.'
    ],
    tabela: [['Rodzaj silnika', 'Koszt instalacji 2026', 'Uwagi'], ...Object.values(INSTALACJE).map((i) => [i.nazwa, `${zl(i.od)}–${zl(i.do)}`, i.benzynaUdzial > 0.1 ? 'część benzyny nadal spalana, droższa instalacja' : 'najprostsza i najtańsza instalacja'])]
  },
  {
    h2: 'Które silniki dobrze znoszą LPG',
    lista: [
      'Wtrysk pośredni (MPI), wolnossące – najlepsi kandydaci: tania instalacja, mało problemów.',
      'Turbo z wtryskiem pośrednim – da się, ale wymaga dobrej instalacji i dokładnej regulacji.',
      'Wtrysk bezpośredni (FSI, TSI, TFSI, GDI) – instalacja droższa i bardziej wymagająca, a zwrot dłuższy.',
      'Silniki wrażliwe na wypalanie zaworów – sprawdź, czy wymagają regulacji luzów i dolewania dodatku do zaworów (tzw. flashlube).',
      'Diesle – LPG praktycznie nie montuje się w dieslach osobowych.'
    ]
  },
  {
    h2: 'O czym pamiętać po montażu',
    lista: [
      'Wpis instalacji do dowodu rejestracyjnego (badanie techniczne z instalacją LPG kosztuje więcej) i zgłoszenie zmiany ubezpieczycielowi.',
      'Butla ma ograniczoną ważność (zwykle 10 lat) – potem trzeba ją wymienić.',
      'Przeglądy instalacji co 10–15 tys. km: filtry fazy lotnej i ciekłej, sprawdzenie szczelności.',
      'Garaże podziemne – część z nich nie wpuszcza aut z LPG.'
    ]
  }
];

export const PYTANIA_LPG: Pytanie[] = [
  { q: 'Ile kosztuje montaż LPG w 2026 r.?', a: `W silniku 4-cylindrowym z wtryskiem pośrednim zwykle ${zl(3800)}–${zl(5500)}, w 6-cylindrowym ${zl(4500)}–${zl(6500)}, a z wtryskiem bezpośrednim ${zl(5500)}–${zl(8000)} i więcej.` },
  { q: 'Po ilu kilometrach zwraca się LPG?', a: 'Przy typowym aucie, spalaniu ok. 8 l/100 km i obecnych cenach paliw – zwykle po 25–40 tys. km. Dokładny wynik dla swojego auta policzysz w kalkulatorze.' },
  { q: 'O ile więcej pali auto na LPG?', a: 'Zwykle o 15–25% więcej litrów niż na benzynie. Mimo to koszt przejazdu jest dużo niższy, bo litr LPG kosztuje ponad dwa razy mniej.' },
  { q: 'Czy LPG opłaca się w silniku TSI?', a: 'Da się, ale instalacja jest droższa, a silnik nadal spala część benzyny. Przy małym przebiegu rocznym zwrot może trwać kilka lat.' }
];

export const ZRODLA_LPG: Zrodlo[] = [
  { n: 'cenauslug.pl – koszt instalacji LPG 2026', url: 'https://cenauslug.pl/poradniki/koszt-instalacji-lpg-czy-to-nadal-sie-oplaca' },
  { n: 'kb.pl – cennik LPG do wtrysku bezpośredniego', url: 'https://kb.pl/cenniki/instalacje-lpg-sekwencyjny-wtrysk-gazu/' },
  { n: 'Auto Świat – rodzaje instalacji LPG', url: 'https://www.auto-swiat.pl/porady/eksploatacja/rodzaje-instalacji-lpg-ich-wady-i-zalety-wtrysk-gazu-sekwencyjny-ciekly-i-bezposredni/1ezhl0n' }
];
