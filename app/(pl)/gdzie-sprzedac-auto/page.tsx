import type { Metadata } from 'next';
import { FileText, CalendarClock } from 'lucide-react';
import StronaNarzedzia, { type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorSprzedazy from '@/components/narzedzia/KalkulatorSprzedazy';
import { CtaVin, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { DROGI, STAN_SPRZEDAZY } from '@/lib/narzedzia/sprzedaz';
import { site } from '@/config/site';

const TYTUL = 'Gdzie sprzedać auto? Sam, komis czy skup';
const OPIS = 'Porównaj, ile zostanie Ci na rękę przy sprzedaży samodzielnej, w komisie, u dealera i w skupie aut – i jak szybko dostaniesz pieniądze. Kalkulator 2026.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/gdzie-sprzedac-auto/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/gdzie-sprzedac-auto/` }
};

const proc = (x: number) => `${Math.round(x * 100)}%`;

const SEKCJE: Sekcja[] = [
  {
    h2: 'Cztery drogi sprzedaży – porównanie',
    akapity: [
      'Im szybciej i wygodniej chcesz sprzedać auto, tym mniej pieniędzy zostanie Ci w kieszeni. Skup zapłaci od ręki, ale zwykle 15–20% poniżej ceny rynkowej. Samodzielna sprzedaż daje najwięcej, ale trwa tygodnie i wymaga czasu na telefony, oględziny i negocjacje.',
      'Kalkulator uwzględnia też koszt czekania: auto traci na wartości (przyjmujemy ok. 1% miesięcznie), a Ty płacisz za OC. Przy tańszych autach i długiej sprzedaży ta różnica potrafi zjeść przewagę ogłoszenia nad komisem.'
    ],
    tabela: [['Droga sprzedaży', 'Zostaje z ceny rynkowej', 'Czas', 'Największy plus'], ...DROGI.map((d) => [d.nazwa, `${proc(d.procentOd)}–${proc(d.procentDo)}`, `${d.dniOd}–${d.dniDo} dni`, d.plusy[0]])]
  },
  {
    h2: 'Jak sprzedać auto samodzielnie szybciej i drożej',
    lista: [
      'Ustal cenę na podstawie kilkunastu ogłoszeń tego samego modelu, rocznika i przebiegu – za drogie auto wisi tygodniami.',
      'Umyj auto i zrób zdjęcia w świetle dziennym, bez tablic rejestracyjnych.',
      'Przygotuj dokumenty: faktury za serwis, rozrząd, opony. Raport historii po VIN w ogłoszeniu buduje zaufanie.',
      'Napisz uczciwie o znanych usterkach i wpisz je do umowy – kupujący nie będzie mógł z nich zrobić wady ukrytej.',
      'Przyjmuj przelew natychmiastowy albo gotówkę w banku – nigdy nie wydawaj auta przed zaksięgowaniem pieniędzy.'
    ]
  },
  {
    h2: 'Po sprzedaży: dwa obowiązki',
    akapity: ['W 30 dni zgłoś zbycie auta w wydziale komunikacji (inaczej grozi kara 250 zł) i w 14 dni powiadom ubezpieczyciela OC. Jeśli kupujący wypowie polisę, możesz odzyskać część składki.']
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Ile płaci skup aut?', a: 'Zwykle ok. 15–20% poniżej ceny rynkowej. W zamian płaci od ręki i bierze auta z usterkami, bez przeglądu czy po szkodzie.' },
  { q: 'Jaką prowizję bierze komis?', a: 'Najczęściej kilka do kilkunastu procent ceny sprzedaży, czasem plus opłata za postój. Warunki zapisuje się w umowie komisowej.' },
  { q: 'Czy przy sprzedaży auta płaci się podatek?', a: 'Sprzedaż prywatnego auta po upływie pół roku od końca miesiąca zakupu nie powoduje podatku dochodowego. PCC płaci kupujący.' },
  { q: 'Co zrobić po sprzedaży auta?', a: 'Zgłosić zbycie w wydziale komunikacji w 30 dni i powiadomić ubezpieczyciela OC w 14 dni.' }
];

export default function GdzieSprzedacPage() {
  return (
    <StronaNarzedzia
      id="gdzie-sprzedac"
      adres="/gdzie-sprzedac-auto/"
      okruszki={[{ nazwa: 'Gdzie sprzedać auto?', adres: '/gdzie-sprzedac-auto/' }]}
      zdjecie="kupujesz"
      nadtytul="Sprzedaż auta"
      tytul="Gdzie sprzedać auto, żeby najwięcej zostało w kieszeni?"
      opis="Wpisz cenę rynkową i stan auta. Porównamy sprzedaż samodzielną, komis, rozliczenie u dealera i skup – kwotę na rękę i czas."
      nazwaAplikacji="Kalkulator: gdzie sprzedać auto"
      narzedzie={<KalkulatorSprzedazy />}
      przedTrescia={
        <SiatkaCta>
          <Odnosnik href="/formalnosci-po-zakupie-auta/po-sprzedazy-auta/" ikona={FileText} tytul="Formalności po sprzedaży" tekst="Zgłoszenie zbycia i powiadomienie ubezpieczyciela – terminy w kalendarzu." />
          <Odnosnik href="/kiedy-sprzedac-auto/" ikona={CalendarClock} tytul="Kiedy sprzedać auto?" tekst="Sprawdź, czy nie zbliżają się drogie naprawy albo zakaz wjazdu do strefy." />
          <CtaVin karta="narzedzie-gdzie-sprzedac" tytul="Raport historii auta przyspiesza sprzedaż" />
          <CtaNiezbednik miejsce="umowa" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      pytania={PYTANIA}
      zrodla={[
        { n: 'bezprawnik.pl – skup i wycena auta (2026)', url: 'https://bezprawnik.pl/firmy-handlujace-uzywanymi-samochodami/' },
        { n: 'rankomat.pl – zgłoszenie sprzedaży samochodu', url: 'https://rankomat.pl/samochod/zgloszenie-sprzedazy-samochodu' },
        { n: 'Auto Świat – czas sprzedaży aut używanych', url: 'https://www.auto-swiat.pl/uzywane/coraz-trudniej-sprzedac-uzywany-samochod-sredni-czas-sprzedazy-sie-wydluza/v31ggx6' }
      ]}
      stan={STAN_SPRZEDAZY}
      uwaga="Procenty i czasy to założenia redakcji – konkretne oferty mogą się różnić."
    />
  );
}
