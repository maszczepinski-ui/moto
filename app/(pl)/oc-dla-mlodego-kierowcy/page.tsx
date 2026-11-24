import type { Metadata } from 'next';
import StronaNarzedzia, { type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorOcMlody from '@/components/narzedzia/KalkulatorOcMlody';
import { CtaOc, SiatkaCta } from '@/components/narzedzia/Cta';
import { DANE_OC, PRZYKLADY_MODELI, STAN_OC } from '@/lib/narzedzia/oc-mlody';
import { site } from '@/config/site';

const TYTUL = 'OC dla młodego kierowcy 2026 – ile i jak taniej';
const OPIS = 'Ile płaci za OC 18-latek i kierowca do 25 lat w 2026 r., od czego zależy cena i jak legalnie obniżyć składkę: współwłaściciel, pojemność, porównanie ofert.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/oc-dla-mlodego-kierowcy/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/oc-dla-mlodego-kierowcy/` }
};

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

const SEKCJE: Sekcja[] = [
  {
    h2: 'Ile płaci za OC młody kierowca w 2026 r.',
    akapity: [
      `Według rankomat.pl kierowcy w wieku 18–25 lat płacili w lipcu 2026 r. średnio ${zl(DANE_OC.mlodzi1825Rankomat)} – mniej więcej trzy razy więcej niż kierowcy w wieku 54–59 lat (${zl(DANE_OC.wiek54do59)}). Mubi.pl podaje dla tej grupy ${zl(DANE_OC.mlodzi1825Mubi)} (czerwiec 2026). Najdrożej mają 18-latkowie: średnio ${zl(DANE_OC.osiemnastolatekH1)} w I połowie 2026 r.`,
      `Jednocześnie najtańsza polisa dla 18-latka znaleziona w tym samym okresie kosztowała ${zl(DANE_OC.najtanszeDla18)}. Ta przepaść pokazuje, że przy młodym kierowcy porównanie ofert daje więcej niż przy jakimkolwiek innym kliencie.`
    ],
    tabela: [['Model', '18-latek', '45-latek'], ...PRZYKLADY_MODELI.map((p) => [p.model, zl(p.osiemnascie), zl(p.czterdziesci5)])]
  },
  {
    h2: 'Kim jest „młody kierowca” dla ubezpieczyciela',
    akapity: ['Nie ma jednej definicji. Część towarzystw patrzy na wiek, część na staż prawa jazdy, a część ocenia każdego indywidualnie. Przykłady z zestawienia rankomat.pl:'],
    lista: ['Link4 – do 23 lat', 'Wiener – do 24 lat lub prawo jazdy krócej niż 24 miesiące', 'Direct – do 25 lat lub prawo jazdy krócej niż 24 miesiące', 'Uniqa – do 25 lat lub prawo jazdy krócej niż 36 miesięcy', 'PZU, Generali, Proama – ocena indywidualna']
  },
  {
    h2: 'Dlaczego młodzi płacą więcej',
    akapity: [
      'Ubezpieczyciele liczą składkę według ryzyka. Statystycznie młodzi kierowcy częściej powodują kolizje i wypadki, a do tego nie mają historii ubezpieczeniowej ani zniżek za bezszkodową jazdę. Na cenę wpływa też auto (pojemność, moc, marka), miejsce zamieszkania i przebieg.',
      'Dobra wiadomość: każdy rok bez szkody obniża składkę. Po kilku latach jazdy różnica względem doświadczonych kierowców wyraźnie się zmniejsza.'
    ]
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Ile kosztuje OC dla 18-latka w 2026 r.?', a: `Średnio ${zl(DANE_OC.osiemnastolatekH1)} w I połowie 2026 r. (rankomat.pl), ale najtańsza znaleziona polisa kosztowała ${zl(DANE_OC.najtanszeDla18)}. Cena zależy od auta, miejsca zamieszkania i ubezpieczyciela.` },
  { q: 'Czy współwłaściciel obniża OC młodego kierowcy?', a: 'Często tak – wiele towarzystw liczy składkę według współwłaściciela z najlepszą historią. Szkoda spowodowana przez młodego kierowcę obniży jednak zniżki obu współwłaścicieli.' },
  { q: 'Jakie auto ma najtańsze OC dla młodego kierowcy?', a: 'Zwykle popularne auto z małym silnikiem i niewielką mocą. Mediana dla kierowców 18–25 lat: 1792 zł przy pojemności 1,1–2,0 l i 1900 zł powyżej 2,0 l.' },
  { q: 'Do jakiego wieku jest się młodym kierowcą?', a: 'Zależy od ubezpieczyciela – zwykle do 23–26 lat albo przez pierwsze 2–3 lata od zdobycia prawa jazdy.' }
];

export default function OcMlodyPage() {
  return (
    <StronaNarzedzia
      id="oc-mlody"
      adres="/oc-dla-mlodego-kierowcy/"
      okruszki={[{ nazwa: 'OC dla młodego kierowcy', adres: '/oc-dla-mlodego-kierowcy/' }]}
      zdjecie="mandaty"
      nadtytul="OC dla młodego kierowcy"
      tytul="Ile płaci za OC młody kierowca – i jak zapłacić mniej?"
      opis="Zobacz, ile średnio płacą młodzi kierowcy, zaznacz, co już robisz, a pokażemy, co jeszcze najbardziej obniży Twoją składkę."
      nazwaAplikacji="Symulator OC dla młodego kierowcy"
      narzedzie={<KalkulatorOcMlody />}
      przedTrescia={
        <SiatkaCta>
          <CtaOc karta="narzedzie-oc-mlody" tytul="Porównaj OC dla młodego kierowcy" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      pytania={PYTANIA}
      zrodla={[
        { n: 'rankomat.pl – najtańsze OC dla 18-latka (2026)', url: 'https://rankomat.pl/samochod/najtansza-polisa-oc-dla-18-latka' },
        { n: 'rankomat.pl – pierwszy samochód dla młodego kierowcy', url: 'https://rankomat.pl/samochod/pierwszy-samochod-dla-mlodego-kierowcy' },
        { n: 'rankomat.pl – definicje młodego kierowcy', url: 'https://rankomat.pl/samochod/najtansza-polisa-dla-mlodego-kierowcy-oc-za-443-zl' },
        { n: 'mubi.pl – OC dla młodych kierowców (VI 2026)', url: 'https://mubi.pl/poradniki/oc-dla-mlodych-kierowcow' }
      ]}
      stan={STAN_OC}
      uwaga="Kwoty to średnie i mediany z porównywarek, nie oferta."
    />
  );
}
