import type { Metadata } from 'next';
import { Leaf, Banknote } from 'lucide-react';
import StronaNarzedzia, { type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorKiedySprzedac from '@/components/narzedzia/KalkulatorKiedySprzedac';
import { CtaFinansowanie, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { STAN_KIEDY } from '@/lib/narzedzia/kiedy-sprzedac';
import { MIASTA_SCT } from '@/lib/sct';
import { site } from '@/config/site';

const TYTUL = 'Kiedy sprzedać auto, żeby stracić najmniej?';
const OPIS = 'Sprawdź, kiedy Twoje auto straci na wartości: zakaz wjazdu do strefy czystego transportu, zbliżający się rozrząd czy sprzęgło i próg 200 tys. km. Darmowy kalkulator.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/kiedy-sprzedac-auto/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/kiedy-sprzedac-auto/` }
};

const ROK = new Date().getFullYear();

const SEKCJE: Sekcja[] = [
  {
    h2: 'Trzy momenty, w których auto traci na wartości',
    lista: [
      `Zakaz wjazdu do strefy czystego transportu – ${MIASTA_SCT.map((m) => m.wMiescie).join(' i ')} kolejne etapy SCT eliminują starsze diesle i benzyniaki. Auto, które za rok nie wjedzie do miasta, mieszkańcy kupią taniej albo wcale.`,
      'Zbliżająca się droga naprawa – rozrząd, sprzęgło z dwumasą, DPF czy turbo. Rozsądny kupujący odliczy koszt od ceny. Jeśli naprawa jest tuż przed Tobą, sprzedaj wcześniej albo zrób ją i sprzedaj z fakturą.',
      'Próg przebiegu – kupujący często ustawiają w wyszukiwarce „do 150 tys. km” albo „do 200 tys. km”. Auto z przebiegiem 201 tys. km znika z wielu wyników.'
    ]
  },
  {
    h2: 'Naprawić przed sprzedażą czy sprzedać „jak jest”?',
    akapity: [
      'Drobne rzeczy (żarówki, wycieraczki, mycie, kosmetyka lakieru) prawie zawsze się opłacają – podnoszą pierwsze wrażenie. Duże naprawy rzadko zwracają się w całości, ale udokumentowana wymiana rozrządu czy sprzęgła przyspiesza sprzedaż i ułatwia obronę ceny.',
      'Jeśli auto ma poważną usterkę, uczciwie opisz ją w ogłoszeniu i wpisz do umowy. Kupujący nie będzie mógł później powołać się na wadę, o której wiedział.'
    ]
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Kiedy najlepiej sprzedać auto?', a: 'Zanim zbiegną się trzy rzeczy: zakaz wjazdu do strefy czystego transportu w Twoim mieście, droga naprawa (np. rozrząd, sprzęgło) i przekroczenie progu przebiegu, np. 200 tys. km.' },
  { q: 'Czy opłaca się wymienić rozrząd przed sprzedażą?', a: 'Jeśli termin wymiany właśnie mija – często tak. Faktura za świeży rozrząd to mocny argument i przyspiesza sprzedaż. Jeśli do wymiany jest jeszcze daleko, nie ma takiej potrzeby.' },
  { q: 'Czy auto traci na wartości przez strefy czystego transportu?', a: 'W miastach ze strefami – tak. Gdy zbliża się etap, który wyklucza dane auto, mieszkańcy przestają je kupować. Poza miastem popyt zwykle zostaje.' },
  { q: 'O ile spada cena auta po przekroczeniu 200 tys. km?', a: 'Nie ma jednej liczby, ale auto tuż powyżej progu wypada z części wyszukiwań, więc sprzedaje się wolniej. Dlatego warto sprzedać przed przekroczeniem okrągłego progu.' }
];

export default function KiedySprzedacPage() {
  return (
    <StronaNarzedzia
      id="kiedy-sprzedac"
      adres="/kiedy-sprzedac-auto/"
      okruszki={[{ nazwa: 'Kiedy sprzedać auto?', adres: '/kiedy-sprzedac-auto/' }]}
      zdjecie="trasa"
      nadtytul="Sprzedaż auta"
      tytul="Kiedy sprzedać auto, żeby stracić najmniej?"
      opis="Wpisz rocznik, przebieg i kilka informacji o aucie. Pokażemy oś czasu: zakazy wjazdu do stref, zbliżające się drogie naprawy i progi przebiegu."
      nazwaAplikacji="Kalkulator: kiedy sprzedać auto"
      narzedzie={<KalkulatorKiedySprzedac rokTeraz={ROK} />}
      przedTrescia={
        <SiatkaCta>
          <Odnosnik href="/gdzie-sprzedac-auto/" ikona={Banknote} tytul="Gdzie sprzedać auto?" tekst="Sam, komis, dealer czy skup – ile zostanie na rękę." />
          <Odnosnik href="/strefy-czystego-transportu/" ikona={Leaf} tytul="Czy wjadę do strefy czystego transportu?" tekst="Szczegóły SCT w Warszawie i Krakowie." />
          <CtaFinansowanie karta="narzedzie-kiedy-sprzedac" tytul="Myślisz o następnym aucie? Porównaj finansowanie" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      pytania={PYTANIA}
      zrodla={[
        ...MIASTA_SCT.map((m) => m.zrodlo),
        { n: 'kb.pl – cenniki napraw (I 2026)', url: 'https://kb.pl/cenniki/uslugi/cennik-wymiany-rozrzadu-_mot/' }
      ]}
      stan={STAN_KIEDY}
      uwaga="Progi przebiegu i przebiegi napraw są orientacyjne."
    />
  );
}
