import type { Metadata } from 'next';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorNegocjacji from '@/components/narzedzia/KalkulatorNegocjacji';
import { CtaVin, CtaNiezbednik, SiatkaCta } from '@/components/narzedzia/Cta';
import { NAPRAWY, STAN_NAPRAW, DOTYCZY_OPIS } from '@/lib/narzedzia/naprawy';
import { site } from '@/config/site';

const TYTUL = 'Ile zbić z ceny auta? Kalkulator negocjacji';
const OPIS = 'Zaznacz usterki z oględzin: rozrząd, dwumasa, DPF, rdza, opony. Policzymy koszt napraw w 2026 r., rozsądną obniżkę i przygotujemy wiadomość do sprzedającego.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/ile-zbic-cene-auta/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/ile-zbic-cene-auta/` }
};

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

const SEKCJE: Sekcja[] = [
  {
    h2: 'Jak liczymy proponowaną obniżkę',
    akapity: [
      'Dla każdej usterki mamy widełki kosztu naprawy w 2026 r. – części razem z robocizną w warsztacie średniej półki, dla popularnego auta. Kalkulator sumuje dolne i górne granice, bierze środek i dodaje 10% na ryzyko, bo przy rozbieraniu auta prawie zawsze wychodzi coś jeszcze (pęknięta śruba, zapieczony element, płyny do wymiany).',
      'Propozycja nigdy nie przekracza połowy ceny auta. Jeśli lista napraw zjada więcej niż jedną trzecią wartości, kalkulator ostrzega – w takim przypadku zwykle lepiej szukać innego egzemplarza.'
    ]
  },
  {
    h2: 'Jak negocjować, żeby sprzedający się zgodził',
    lista: [
      'Negocjuj po oględzinach i jeździe próbnej, nie przez telefon – argumenty z konkretnego auta działają lepiej niż „ile ostatecznie?”.',
      'Opieraj się na faktach: wydruk z diagnostyki, zdjęcie zużytej opony, brak faktury za rozrząd. Kalkulator podaje widełki z cenników, które możesz pokazać.',
      'Podaj jedną konkretną kwotę i warunek, np. „biorę dziś za X zł, gotówką lub przelewem natychmiastowym”.',
      'Nie wymieniaj usterek, których nie jesteś pewien – jedna przesadzona rzecz podważa całą listę.',
      'Zostaw sobie margines: zacznij nieco poniżej kwoty, którą akceptujesz.',
      'Wpisz znane usterki do umowy – chroni to obie strony, a Tobie zostawia rękojmię za wady, o których nie wiedziałeś.'
    ]
  },
  {
    h2: 'Koszty typowych napraw w 2026 r.',
    akapity: ['Kliknij usterkę w tabeli poniżej, żeby zobaczyć objawy, sposób sprawdzenia na oględzinach i przykładowe obniżki.']
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'O ile można zbić cenę używanego auta?', a: 'Zależy od stanu auta i rynku. Rozsądna obniżka to koszt napraw, które naprawdę trzeba zrobić, plus niewielki zapas na ryzyko. Sama „chęć zejścia z ceny” bez argumentów zwykle daje kilka procent.' },
  { q: 'Czy brak faktury za rozrząd to powód do obniżki?', a: `Tak. Jeśli nie ma dowodu wymiany, przyjmij, że trzeba ją zrobić od razu. Wymiana paska z pompą wody kosztuje zwykle ${zl(900)}–${zl(2500)}.` },
  { q: 'Czy negocjować przed czy po oględzinach?', a: 'Po. Przed oględzinami nie masz argumentów, a sprzedający nie ma powodu schodzić z ceny. Po jeździe próbnej i diagnostyce rozmawiasz o konkretnych kosztach.' },
  { q: 'Czy wpisywać znane usterki do umowy?', a: 'Tak. Sprzedający nie odpowiada za wady, o których wiedziałeś przy zakupie, ale wpis porządkuje sprawę i odróżnia znane usterki od ukrytych.' }
];

export default function NegocjacjePage() {
  return (
    <StronaNarzedzia
      id="negocjacje"
      adres="/ile-zbic-cene-auta/"
      okruszki={[{ nazwa: 'Ile zbić z ceny auta?', adres: '/ile-zbic-cene-auta/' }]}
      zdjecie="kupujesz"
      nadtytul="Kalkulator negocjacji"
      tytul="Ile zbić z ceny auta?"
      opis="Zaznacz, co wyszło na oględzinach. Policzymy koszt napraw, rozsądną obniżkę i przygotujemy wiadomość do sprzedającego."
      nazwaAplikacji="Kalkulator negocjacji ceny auta"
      narzedzie={<KalkulatorNegocjacji />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-negocjacje" tytul="Zanim dasz zaliczkę – sprawdź historię po VIN" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      poTresci={
        <div className="max-w-3xl space-y-3">
          <h2 className={`${H2} sr-only`}>Tabela kosztów napraw</h2>
          <Tabela
            wiersze={[
              ['Naprawa', 'Koszt 2026', 'Dotyczy'],
              ...NAPRAWY.map((n) => [n.krotko, `${zl(n.kosztOd)}–${zl(n.kosztDo)}`, DOTYCZY_OPIS[n.dotyczy]])
            ]}
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm pt-2">
            {NAPRAWY.map((n) => (
              <li key={n.id}>
                <a href={`/ile-zbic-cene-auta/${n.slug}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                  {n.nazwa} – objawy i ile zbić
                </a>
              </li>
            ))}
          </ul>
        </div>
      }
      pytania={PYTANIA}
      zrodla={[
        { n: 'kb.pl – cennik wymiany rozrządu', url: 'https://kb.pl/cenniki/uslugi/cennik-wymiany-rozrzadu-_mot/' },
        { n: 'kb.pl – cennik wymiany sprzęgła', url: 'https://kb.pl/cenniki/uslugi/wymiana-sprzegla-_mot/' },
        { n: 'kb.pl – cennik czyszczenia DPF', url: 'https://kb.pl/cenniki/uslugi/cennik-czyszczenia-filtra-dpf-i-wymiany-filtrow-dpf-_mot/' },
        { n: 'cenauslug.pl – koszty napraw 2026', url: 'https://cenauslug.pl/przewodnik/naprawa-silnikow-i-ukladow-napedowych' }
      ]}
      stan={STAN_NAPRAW}
      uwaga="Koszty są orientacyjne – w autach premium i przy rzadkich silnikach bywają wyższe."
    />
  );
}
