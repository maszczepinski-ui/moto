import type { Metadata } from 'next';
import { Car, FileSearch } from 'lucide-react';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorSzkody from '@/components/narzedzia/KalkulatorSzkody';
import { CtaKancelaria, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KLASY, STAN_SZKODY } from '@/lib/narzedzia/szkoda';
import { site } from '@/config/site';

const TYTUL = 'Szkoda całkowita z OC – kalkulator wypłaty';
const OPIS = 'Policz, ile należy Ci się przy szkodzie całkowitej z OC sprawcy, czy wrak nie jest zawyżony i ile dni auta zastępczego pokryje ubezpieczyciel. Stawki 2026.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/szkoda-calkowita-kalkulator/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/szkoda-calkowita-kalkulator/` }
};

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

const SEKCJE: Sekcja[] = [
  {
    h2: 'Kiedy ubezpieczyciel może orzec szkodę całkowitą',
    akapity: [
      'Przy szkodzie z OC sprawcy szkodę całkowitą można orzec dopiero wtedy, gdy przewidywany koszt naprawy przekracza wartość rynkową auta sprzed zdarzenia. Jeśli naprawa kosztuje mniej – nawet 90% wartości – ubezpieczyciel sprawcy powinien za nią zapłacić. Próg ok. 70% wartości, o którym często się słyszy, dotyczy autocasco i wynika z umowy (OWU).',
      'Przy szkodzie całkowitej odszkodowanie liczy się metodą różnicową: wartość auta przed szkodą minus wartość wraku. Wrak zostaje Twoją własnością – możesz go sprzedać albo naprawić auto na własną rękę.'
    ]
  },
  {
    h2: 'Gdzie ubezpieczyciele najczęściej zaniżają wypłatę',
    lista: [
      'Zaniżona wartość auta przed szkodą – sprawdź, czy wycena uwzględnia wyposażenie, przebieg i stan. Porównaj z ogłoszeniami podobnych aut.',
      'Zawyżona wartość wraku – jeśli giełdy aut uszkodzonych dają mniej, różnica wychodzi z Twojej kieszeni. Poproś ubezpieczyciela o wskazanie kupca za kwotę z wyceny.',
      'Sztuczna szkoda całkowita – drogie części w kosztorysie i niska wycena auta potrafią „przepchnąć” szkodę częściową w całkowitą.',
      'Pominięte auto zastępcze, holowanie i parking – to też część szkody, którą pokrywa OC sprawcy.'
    ]
  },
  {
    h2: 'Auto zastępcze z OC sprawcy – stawki 2026',
    akapity: [
      'Auto zastępcze należy się przy szkodzie częściowej (na czas naprawy) i całkowitej (do czasu zakupu nowego auta, w rozsądnym terminie). Powinno być podobnej klasy jak Twoje. Ubezpieczyciele publikują stawki, które akceptują bez dyskusji – poniżej stawki ERGO Hestii i Warty.'
    ],
    tabela: [['Klasa', 'Przykłady', 'ERGO Hestia', 'Warta'], ...KLASY.map((k) => [k.nazwa, k.przyklady, zl(k.hestia), zl(k.warta)])]
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Kiedy jest szkoda całkowita z OC sprawcy?', a: 'Gdy koszt naprawy przekracza wartość rynkową auta sprzed szkody albo naprawa jest technicznie niemożliwa. Próg 70% dotyczy AC, nie OC sprawcy.' },
  { q: 'Jak liczy się odszkodowanie przy szkodzie całkowitej?', a: 'Wartość auta przed szkodą minus wartość wraku. Przykład: auto warte 40 000 zł, wrak 5 000 zł – odszkodowanie 35 000 zł, a wrak zostaje Twój.' },
  { q: 'Co zrobić, gdy wrak jest wyceniony za wysoko?', a: 'Zbierz oferty z giełd aut uszkodzonych i napisz reklamację. Poproś ubezpieczyciela o wskazanie kupca, który zapłaci tyle, ile wynika z wyceny, albo o dopłatę różnicy.' },
  { q: 'Jak długo należy się auto zastępcze przy szkodzie całkowitej?', a: 'Do czasu zakupu nowego auta, w rozsądnym terminie – co najmniej do dnia wypłaty odszkodowania. Sądy zwykle uznają kilka tygodni na znalezienie nowego auta.' },
  { q: 'Czy mogę naprawić auto po szkodzie całkowitej?', a: 'Tak. Wrak jest Twoją własnością. Możesz go naprawić, ale odszkodowanie nie wzrośnie – dostajesz różnicę między wartością auta a wartością wraku.' }
];

export default function SzkodaPage() {
  return (
    <StronaNarzedzia
      id="szkoda"
      adres="/szkoda-calkowita-kalkulator/"
      okruszki={[{ nazwa: 'Szkoda całkowita i auto zastępcze', adres: '/szkoda-calkowita-kalkulator/' }]}
      zdjecie="trasa"
      nadtytul="Po szkodzie z OC sprawcy"
      tytul="Szkoda całkowita: ile powinieneś dostać?"
      opis="Wpisz wartość auta, koszt naprawy i wycenę wraku. Sprawdzimy, czy to naprawdę szkoda całkowita, ile Ci się należy i ile dni auta zastępczego pokryje ubezpieczyciel."
      nazwaAplikacji="Kalkulator szkody całkowitej i auta zastępczego"
      narzedzie={<KalkulatorSzkody />}
      przedTrescia={
        <SiatkaCta>
          <Odnosnik href="/po-szkodzie/" ikona={FileSearch} tytul="Sprawdź kosztorys przy szkodzie częściowej" tekst="Darmowy test: zamienniki, potrącenia, rabaty, VAT – i ile możesz odzyskać." />
          <CtaKancelaria karta="narzedzie-szkoda" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Auto zastępcze – stawki dla Twojej klasy</h2>
          <SiatkaCta>
            {KLASY.map((k) => (
              <Odnosnik key={k.id} href={`/auto-zastepcze/${k.slug}/`} ikona={Car} tytul={`Auto zastępcze – ${k.nazwa.toLowerCase()}`} tekst={`${zl(Math.min(k.warta, k.hestia))}–${zl(Math.max(k.warta, k.hestia))} za dobę. ${k.przyklady}.`} />
            ))}
          </SiatkaCta>
        </section>
      }
      pytania={PYTANIA}
      zrodla={[
        { n: 'rankomat.pl – szkoda całkowita', url: 'https://rankomat.pl/samochod/odszkodowanie-szkoda-calkowita' },
        { n: 'mubi.pl – szkoda całkowita z OC i AC', url: 'https://mubi.pl/poradniki/szkoda-calkowita-samochodu-z-oc-ac/' },
        { n: 'rankomat.pl – stawki aut zastępczych (VIII 2026)', url: 'https://rankomat.pl/samochod/samochod-zastepczy-oc-jak-dlugo' }
      ]}
      stan={STAN_SZKODY}
      uwaga="To informacja ogólna, nie porada prawna."
    />
  );
}
