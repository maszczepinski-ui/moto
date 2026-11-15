// Tekst strony „Koszt przejazdu A – B” układany z danych trasy: kilometry, płatne odcinki, ceny paliw, strefy czystego transportu.
// Bez zgadywania nazw dróg – tylko to, co strona liczy sama.
import type { Trasa } from '@/lib/miasta';
import { wLiniiProstej } from '@/lib/miasta';
import type { Odcinek } from '@/lib/autostrady';
import { MIASTA_SCT } from '@/lib/sct';

export interface PrzykladAuta {
  n: string;
  /** zużycie w trasie na 100 km */
  z: number;
  /** cena za litr / kWh */
  c: number;
  j: string;
}

export interface TekstTrasy {
  sekcje: { h2: string; akapity: string[]; linki?: { tekst: string; adres: string }[] }[];
  faq: { q: string; a: string }[];
}

const zl = (n: number) => Math.round(n).toLocaleString('pl-PL') + ' zł';
const czas = (min: number) => {
  const h = Math.floor(min / 60), m = Math.round((min % 60) / 5) * 5;
  return h ? `${h} godz.${m ? ` ${m} min` : ''}` : `${m} min`;
};

export function tekstTrasy(t: Trasa, oplaty: Odcinek[], przyklady: PrzykladAuta[]): TekstTrasy {
  const A = t.a.nazwa, B = t.b.nazwa;
  const prosta = Math.round(wLiniiProstej(t.a, t.b));
  const sumaOplat = oplaty.reduce((s, o) => s + o.cena, 0);
  // średnia prędkość: z autostradą wyżej, bez – niżej (szacunek bez postojów i korków)
  const v = oplaty.length ? 90 : t.km > 250 ? 80 : 70;
  const minuty = (t.km / v) * 60;
  const przerwy = Math.max(0, Math.floor(minuty / 120 - 0.01));
  const koszty = przyklady.map((p) => ({ ...p, k: (t.km / 100) * p.z * p.c })).sort((x, y) => x.k - y.k);
  const najtanszy = koszty[0], najdrozszy = koszty[koszty.length - 1];
  const benz = koszty.find((x) => x.n.startsWith('Benzyna 1.4')) || koszty[0];
  const ev = koszty.find((x) => x.n.startsWith('Elektryczny'));
  const ladowania = Math.max(0, Math.ceil(t.km / 250) - 1);
  const sct = MIASTA_SCT.filter((m) => m.id === t.a.slug || m.id === t.b.slug);

  const sekcje: TekstTrasy['sekcje'] = [];

  sekcje.push({
    h2: `${A} – ${B}: ile kilometrów?`,
    akapity: [
      `Odległość drogowa na trasie ${A} – ${B} to ok. ${t.km} km, a w linii prostej – ok. ${prosta} km. Tam i z powrotem przejedziesz więc ok. ${t.km * 2} km. Dokładny dystans zależy od tego, skąd dokładnie wyjeżdżasz i którą drogę wybierzesz – nawigacja może pokazać wynik różniący się o kilka procent.`
    ]
  });

  sekcje.push({
    h2: `Ile trwa jazda ${A} – ${B}?`,
    akapity: [
      `Przy średniej prędkości ok. ${v} km/h ${oplaty.length ? '(trasa w dużej części autostradą)' : ''} przejazd zajmie ok. ${czas(minuty)} bez postojów. W praktyce doliczaj czas na korki przy wyjeździe z miast i na postoje.`.replace('  ', ' '),
      przerwy > 0
        ? `Na tak długiej trasie zaplanuj ${przerwy === 1 ? 'co najmniej jedną przerwę' : `ok. ${przerwy} przerwy`}. Zmęczenie za kierownicą narasta już po ok. 2 godzinach jazdy – krótki postój co 2 godziny wyraźnie poprawia koncentrację.`
        : 'To krótka trasa, którą większość kierowców pokonuje bez postoju. Jeśli jednak czujesz senność, zatrzymaj się – krótka przerwa jest bezpieczniejsza niż walka ze zmęczeniem.'
    ]
  });

  const koszt: string[] = [
    `Paliwo na trasie ${A} – ${B} w jedną stronę kosztuje od ok. ${zl(najtanszy.k)} (${najtanszy.n.toLowerCase()}) do ok. ${zl(najdrozszy.k)} (${najdrozszy.n.toLowerCase()}). Typowy kompakt z benzynowym silnikiem 1.4 wyda ok. ${zl(benz.k)}, czyli ok. ${zl(benz.k * 2)} tam i z powrotem.`,
    `Jadąc we dwie osoby, każda zapłaci za paliwo ok. ${zl(benz.k / 2)}, we trzy – ok. ${zl(benz.k / 3)}, a w cztery osoby – ok. ${zl(benz.k / 4)} w jedną stronę (dla tego samego kompaktu). To dobry sposób, żeby sprawdzić, czy wspólny przejazd autem wychodzi taniej niż bilety.`
  ];
  if (oplaty.length)
    koszt.push(
      `Do paliwa doliczysz opłaty za płatne odcinki autostrad: ${oplaty.map((o) => `${o.nazwa} – ${o.cena.toLocaleString('pl-PL')} zł`).join(', ')}. Razem to ok. ${zl(sumaOplat)} w jedną stronę. Całkowity koszt przejazdu benzynowym kompaktem wyniesie więc ok. ${zl(benz.k + sumaOplat)} w jedną stronę i ok. ${zl((benz.k + sumaOplat) * 2)} tam i z powrotem.`
    );
  else koszt.push(`Na tej trasie zwykle nie trzeba płacić za autostradę osobówką – płatne odcinki A1, A2 i A4 leżą poza najkrótszą drogą albo są bezpłatne (odcinki państwowe). Jeśli nawigacja poprowadzi Cię płatną autostradą, kalkulator powyżej pozwala doliczyć opłaty.`);
  sekcje.push({ h2: `Ile kosztuje przejazd ${A} – ${B}?`, akapity: koszt });

  if (ev)
    sekcje.push({
      h2: `Autem elektrycznym na trasie ${A} – ${B}`,
      akapity: [
        `Prąd na tę trasę kosztuje ok. ${zl(ev.k)} przy ładowaniu w cenie podanej w tabeli. ${
          ladowania === 0
            ? 'Przy takim dystansie większość aut elektrycznych dojedzie bez ładowania po drodze.'
            : `Przy szybkiej jeździe zasięg spada, więc na trasie ${t.km} km zaplanuj ${ladowania === 1 ? 'jedno ładowanie' : `ok. ${ladowania} ładowania`} po drodze (zależnie od auta i pogody – zimą zasięg jest mniejszy).`
        } Ładowanie na szybkich ładowarkach przy trasach jest zwykle wyraźnie droższe niż w domu.`
      ],
      linki: [{ tekst: 'Mapa ładowarek dla aut elektrycznych', adres: '/ladowarki/' }]
    });

  if (sct.length)
    sekcje.push({
      h2: 'Strefa czystego transportu – czy wjedziesz do centrum?',
      akapity: [
        `${sct.map((m) => `${m.wMiescie.charAt(0).toUpperCase() + m.wMiescie.slice(1)} działa strefa czystego transportu (od ${m.start.split('-').reverse().join('.')})`).join('. ')}. Do centrum mogą tam wjechać tylko auta spełniające określone normy spalin – starsze diesle i benzyniaki nie mają tam wstępu, a za wjazd bez uprawnień grozi kara. Przed wyjazdem sprawdź, czy Twoje auto spełnia wymagania.`
      ],
      linki: [{ tekst: 'Sprawdź, czy wjedziesz do strefy czystego transportu', adres: '/strefy-czystego-transportu/' }]
    });

  sekcje.push({
    h2: 'Przed wyjazdem warto sprawdzić',
    akapity: [
      'Na trasach między dużymi miastami działa wiele fotoradarów i odcinkowych pomiarów prędkości. Warto też pamiętać o aktualnych stawkach mandatów i punktów karnych oraz o ważnym ubezpieczeniu OC.'
    ],
    linki: [
      { tekst: 'Mapa fotoradarów i odcinkowych pomiarów prędkości', adres: '/fotoradary/' },
      { tekst: 'Taryfikator mandatów i punkty karne', adres: '/mandaty/' },
      { tekst: 'Porównaj ceny OC', adres: '/ubezpieczenie-oc/' }
    ]
  });

  const faq = [
    { q: `Ile km ma trasa ${A} – ${B}?`, a: `Ok. ${t.km} km drogą (w linii prostej ok. ${prosta} km). Tam i z powrotem to ok. ${t.km * 2} km.` },
    { q: `Ile kosztuje paliwo na trasie ${A} – ${B}?`, a: `Benzynowy kompakt spali paliwo za ok. ${zl(benz.k)} w jedną stronę. Najtaniej wychodzi ${najtanszy.n.toLowerCase()} (ok. ${zl(najtanszy.k)}), a najdrożej ${najdrozszy.n.toLowerCase()} (ok. ${zl(najdrozszy.k)}).` },
    { q: `Czy na trasie ${A} – ${B} jest płatna autostrada?`, a: oplaty.length ? `Najpewniej tak: ${oplaty.map((o) => `${o.nazwa} (${o.cena.toLocaleString('pl-PL')} zł)`).join(', ')}. Razem ok. ${zl(sumaOplat)} w jedną stronę za osobówkę.` : 'Najkrótsza droga zwykle omija płatne odcinki autostrad dla osobówek. Opłata pojawi się tylko wtedy, gdy wybierzesz trasę przez płatny odcinek A1, A2 lub A4.' },
    { q: `Ile trwa jazda na trasie ${A} – ${B}?`, a: `Ok. ${czas(minuty)} bez postojów, przy średniej prędkości ok. ${v} km/h. Z korkami i przerwami podróż potrwa dłużej.` },
    { q: `Ile kosztuje przejazd ${A} – ${B} na osobę?`, a: `Przy czterech osobach w benzynowym kompakcie każda zapłaci za paliwo ok. ${zl(benz.k / 4)}${oplaty.length ? ` plus ok. ${zl(sumaOplat / 4)} za autostradę` : ''} w jedną stronę.` }
  ];

  return { sekcje, faq };
}
