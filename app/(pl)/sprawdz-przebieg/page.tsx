import type { Metadata } from 'next';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorPrzebiegu from '@/components/narzedzia/KalkulatorPrzebiegu';
import { CtaVin, SiatkaCta, CtaNiezbednik } from '@/components/narzedzia/Cta';
import { STAN_PRZEBIEGU, modelMaStronePrzebiegu, typowyPrzebieg } from '@/lib/narzedzia/przebieg';
import { getAllModels } from '@/lib/models';
import { site } from '@/config/site';

const TYTUL = 'Czy przebieg jest prawdziwy? Kalkulator';
const OPIS = 'Sprawdź, czy przebieg z ogłoszenia pasuje do wieku auta. Typowy przebieg w Polsce dla benzyny, diesla i LPG, sygnały cofniętego licznika i jak sprawdzić historię.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/sprawdz-przebieg/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/sprawdz-przebieg/` }
};

const ROK = new Date().getFullYear();

const tabelaWieku = [1, 2, 3, 5, 7, 10, 12, 15, 18, 20].map((w) => [
  `${w} ${w === 1 ? 'rok' : w < 5 ? 'lata' : 'lat'}`,
  `${typowyPrzebieg(w, 'benzyna').toLocaleString('pl-PL')} km`,
  `${typowyPrzebieg(w, 'diesel').toLocaleString('pl-PL')} km`,
  `${typowyPrzebieg(w, 'lpg').toLocaleString('pl-PL')} km`
]);

const SEKCJE: Sekcja[] = [
  {
    h2: 'Jak liczymy typowy przebieg',
    akapity: [
      'Punktem wyjścia są dane porównywarki mubi.pl z lutego 2026 r. o średnim przebiegu aut w Polsce w różnym wieku: auta do 5 lat mają średnio 57 tys. km, 6–10-letnie 141 tys. km, 11–15-letnie 207 tys. km, a 16–20-letnie 248 tys. km. Między tymi punktami liczymy przebieg proporcjonalnie do wieku.',
      'Do tego dokładamy poprawkę na paliwo. To nasze założenie, nie oficjalna statystyka: diesle i auta z LPG kupuje się zwykle do dużych przebiegów, więc dla diesla przyjmujemy o 20% więcej, dla LPG o 15% więcej, a dla benzyny o 10% mniej niż średnia. Kalkulator pokazuje więc punkt odniesienia, a nie wyrok dla konkretnego egzemplarza.',
      'Wynik dzielimy na strefy. Poniżej połowy typowego przebiegu zapala się czerwone światło, od połowy do trzech czwartych – żółte. Bardzo duży przebieg (ponad 160% typowego) nie wskazuje na oszustwo, ale na intensywne użytkowanie, np. we flocie lub jako taksówka.'
    ],
    tabela: [['Wiek auta', 'Benzyna', 'Diesel', 'Benzyna + LPG'], ...tabelaWieku]
  },
  {
    h2: 'Ile aut ma cofnięty licznik?',
    akapity: [
      'Według badania firmy Carly (dane z ok. 100 tys. sesji diagnostycznych w Polsce, styczeń 2025 – luty 2026) zmanipulowany licznik może mieć co ósme sprawdzone auto, a przebieg cofano średnio o prawie 70 tys. km. To mniej więcej pięć lat jazdy, które znikają z ceny i z planu serwisowego – rozrząd, sprzęgło czy wtryski trzeba wymienić wcześniej, niż wynika z licznika.',
      'Cofnięcie licznika jest w Polsce przestępstwem (art. 306a Kodeksu karnego). Zagrożone jest karą pozbawienia wolności od 3 miesięcy do 5 lat – dotyczy to także osoby, która takie „usługi” zleca.'
    ]
  },
  {
    h2: 'Jak sprawdzić prawdziwy przebieg za darmo i płatnie',
    lista: [
      'historiapojazdu.gov.pl – darmowy serwis rządowy. Wpisujesz numer rejestracyjny, VIN i datę pierwszej rejestracji, a dostajesz m.in. stany licznika zapisane na badaniach technicznych w Polsce.',
      'Auto sprowadzone – polska baza zaczyna się dopiero od rejestracji w kraju. Historię z zagranicy (Niemcy, Belgia, Holandia, Francja) pokazują raporty płatne, np. carVertical.',
      'Książka serwisowa i faktury – porównaj daty i przebiegi przy wymianach oleju. Brak wpisów przez kilka lat to sygnał ostrzegawczy.',
      'Elektronika auta – przebieg zapisują też inne sterowniki (np. skrzynia biegów, ABS, kluczyk). Dobry diagnosta odczyta je w kilka minut.',
      'Naklejki z warsztatów – często pod maską lub na drzwiach. Zdjęcie naklejki z przebiegiem wyższym niż na liczniku kończy dyskusję.'
    ]
  },
  {
    h2: 'Sygnały cofniętego licznika na oględzinach',
    akapity: ['Żaden pojedynczy objaw nie przesądza sprawy, ale kilka naraz powinno zapalić lampkę. Porównuj stan auta z deklarowanym przebiegiem:'],
    lista: [
      'wytarta kierownica, gałka zmiany biegów i przyciski przy „niskim” przebiegu,',
      'zużyte gumy pedałów albo nowe nakładki na pedałach w kilkuletnim aucie,',
      'zapadnięty boczek fotela kierowcy, przetarta tapicerka przy wsiadaniu,',
      'piaskowane przednie lampy i maska, odpryski na przedniej szybie,',
      'nowe tarcze i klocki „bo tak wyszło” – przy realnie małym przebiegu wymiana nie jest potrzebna,',
      'sprzedawca nie chce podać numeru VIN przed oględzinami.'
    ]
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Jaki jest średni roczny przebieg auta w Polsce?', a: 'Różne źródła podają od ok. 12 do 18 tys. km rocznie. Mubi.pl podaje 17,9 tys. km, a według danych z badań technicznych opisanych przez Interię to niespełna 17,3 tys. km rocznie. Kalkulator korzysta z krzywej przebiegu według wieku, bo nowe auta jeżdżą więcej niż stare.' },
  { q: 'Czy niski przebieg zawsze oznacza cofnięty licznik?', a: 'Nie. Zdarzają się auta seniorów, drugie auta w rodzinie czy samochody stojące latami. Niski przebieg to powód, żeby sprawdzić historię i dokumenty – nie dowód oszustwa.' },
  { q: 'Gdzie sprawdzić przebieg auta za darmo?', a: 'Na stronie historiapojazdu.gov.pl. Potrzebujesz numeru rejestracyjnego, VIN i daty pierwszej rejestracji. Serwis pokazuje stany licznika z badań technicznych w Polsce.' },
  { q: 'Jak sprawdzić przebieg auta sprowadzonego z Niemiec?', a: 'Polskie bazy zaczynają się od rejestracji w Polsce, więc wcześniejsze lata trzeba sprawdzić w raportach z baz zagranicznych (np. carVertical) albo w dokumentach serwisowych i niemieckich raportach z przeglądów TÜV lub DEKRA.' },
  { q: 'Jaka jest kara za cofnięcie licznika?', a: 'Zgodnie z art. 306a Kodeksu karnego kara pozbawienia wolności od 3 miesięcy do 5 lat. Odpowiada także ten, kto zleca cofnięcie licznika.' }
];

export default function PrzebiegPage() {
  const modele = getAllModels()
    .filter(modelMaStronePrzebiegu)
    .sort((a, b) => b.cepik.liczbaWPolsce - a.cepik.liczbaWPolsce)
    .slice(0, 60);
  return (
    <StronaNarzedzia
      id="przebieg"
      adres="/sprawdz-przebieg/"
      okruszki={[{ nazwa: 'Czy przebieg jest prawdziwy?', adres: '/sprawdz-przebieg/' }]}
      zdjecie="kupujesz"
      nadtytul="Kalkulator przebiegu"
      tytul="Czy przebieg z ogłoszenia jest prawdziwy?"
      opis="Wpisz rok produkcji, paliwo i przebieg. Porównamy go z typowym przebiegiem aut w tym wieku w Polsce i powiemy, czy warto sprawdzić historię."
      nazwaAplikacji="Kalkulator przebiegu auta"
      narzedzie={<KalkulatorPrzebiegu rokTeraz={ROK} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-przebieg" tytul="Sprawdź historię przebiegu po VIN" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Typowy przebieg popularnych modeli</h2>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">Strony modeli pokazują najczęstsze roczniki w Polsce (dane CEPiK) i typowy przebieg dla każdego z nich.</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            {modele.map((m) => (
              <li key={m.slug}>
                <a href={`/sprawdz-przebieg/${m.slug}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                  Przebieg {m.marka} {m.model}
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
      pytania={PYTANIA}
      zrodla={[
        { n: 'mubi.pl – przebieg a wiek auta (II 2026)', url: 'https://mubi.pl/poradniki/przebieg-samochodu-a-jego-wiek/' },
        { n: 'Auto Świat – badanie Carly o cofniętych licznikach', url: 'https://www.auto-swiat.pl/wiadomosci/aktualnosci/ile-samochodow-w-polsce-ma-cofniety-licznik-oto-najnowsze-dane/t4qypqr' },
        { n: 'Interia – przebieg z danych CEPiK', url: 'https://motoryzacja.interia.pl/wiadomosci/news-balagan-w-cepiku-ktos-jezdzil-1200-km-dziennie,nId,5116997' },
        { n: 'historiapojazdu.gov.pl', url: 'https://historiapojazdu.gov.pl/' }
      ]}
      stan={STAN_PRZEBIEGU}
    />
  );
}
