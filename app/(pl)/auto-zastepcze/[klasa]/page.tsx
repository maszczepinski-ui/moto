import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Car, FileSearch } from 'lucide-react';
import StronaNarzedzia, { H2, KARTA, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import { KalkulatorZastepczego } from '@/components/narzedzia/KalkulatorSzkody';
import { CtaKancelaria, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KLASY, STAN_SZKODY, klasaPoSlugu } from '@/lib/narzedzia/szkoda';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return KLASY.map((k) => ({ klasa: k.slug }));
}

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export async function generateMetadata({ params }: { params: Promise<{ klasa: string }> }): Promise<Metadata> {
  const { klasa } = await params;
  const k = klasaPoSlugu(klasa);
  if (!k) return {};
  const nazwa = k.nazwa.split(' (')[0];
  const tytul = `Auto zastępcze z OC – ${nazwa}: stawki 2026`;
  const opis = `Ile kosztuje doba auta zastępczego (${nazwa.toLowerCase()}: ${k.przyklady}) z OC sprawcy w 2026 r. – stawki Warty i ERGO Hestii i jak długo przysługuje najem.`;
  const adres = `/auto-zastepcze/${k.slug}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function KlasaPage({ params }: { params: Promise<{ klasa: string }> }) {
  const { klasa } = await params;
  const k = klasaPoSlugu(klasa);
  if (!k) notFound();
  const adres = `/auto-zastepcze/${k.slug}/`;
  const nazwa = k.nazwa.split(' (')[0];
  const okresy = [7, 14, 21, 30];
  const sekcje: Sekcja[] = [
    {
      h2: `Stawki najmu – ${k.nazwa.toLowerCase()}`,
      akapity: [
        `ERGO Hestia akceptuje ${zl(k.hestia)}, a Warta ${zl(k.warta)} brutto za dobę najmu auta tej klasy (stan z sierpnia 2026). To stawki, które ubezpieczyciele pokrywają bez dyskusji – droższy najem trzeba uzasadnić, np. brakiem tańszych aut w okolicy.`,
        `Do tej klasy należą m.in. ${k.przyklady}. Auto zastępcze powinno odpowiadać klasie Twojego samochodu – nie musisz godzić się na mniejsze, ale za auto wyższej klasy ubezpieczyciel może nie zapłacić różnicy.`
      ],
      tabela: [['Czas najmu', 'Warta', 'ERGO Hestia'], ...okresy.map((d) => [`${d} dni`, zl(k.warta * d), zl(k.hestia * d)])]
    },
    {
      h2: 'Jak długo przysługuje auto zastępcze',
      lista: [
        'Szkoda częściowa – przez cały czas, gdy nie możesz korzystać z auta: od szkody, przez oględziny i czekanie na części, do odbioru z warsztatu. Nie tylko przez „technologiczny” czas naprawy z kosztorysu.',
        'Szkoda całkowita – do zakupu nowego auta w rozsądnym terminie, co najmniej do dnia wypłaty odszkodowania.',
        'Opóźnienia ubezpieczyciela (oględziny, decyzja) albo czekanie na części nie są powodem do odmowy zwrotu kosztów najmu.'
      ]
    },
    {
      h2: 'Jak wynająć auto zastępcze bez dopłat',
      lista: [
        'Zgłoś szkodę z OC sprawcy i od razu poproś o auto zastępcze – najprościej w formie bezgotówkowej (ubezpieczyciel lub wypożyczalnia rozlicza się sama).',
        'Jeśli wynajmujesz sam, wybierz auto tej samej klasy i nie przekraczaj stawek ubezpieczyciela – zachowasz pełny zwrot.',
        'Zachowaj umowę najmu, fakturę i protokoły wydania oraz zwrotu auta.'
      ]
    }
  ];
  const pytania: Pytanie[] = [
    { q: `Ile kosztuje doba auta zastępczego (${nazwa.toLowerCase()})?`, a: `Stawki akceptowane w 2026 r.: Warta ${zl(k.warta)}, ERGO Hestia ${zl(k.hestia)} brutto za dobę.` },
    { q: 'Czy auto zastępcze należy się osobie prywatnej?', a: 'Tak. Z OC sprawcy przysługuje zarówno przedsiębiorcom, jak i osobom prywatnym, gdy utrata możliwości korzystania z auta uzasadnia najem.' },
    { q: 'Czy muszę brać auto z wypożyczalni ubezpieczyciela?', a: 'Nie. Możesz wynająć auto sam, ale warto trzymać się stawek ubezpieczyciela, żeby nie dopłacać różnicy.' },
    { q: 'Czy dostanę auto zastępcze, jeśli mam drugie auto w domu?', a: 'Ubezpieczyciel może to kwestionować. Liczy się, czy najem był celowy i uzasadniony – np. drugie auto jest używane przez innego domownika.' }
  ];
  return (
    <StronaNarzedzia
      id="szkoda"
      adres={adres}
      okruszki={[
        { nazwa: 'Szkoda całkowita i auto zastępcze', adres: '/szkoda-calkowita-kalkulator/' },
        { nazwa: `Auto zastępcze – ${nazwa}`, adres }
      ]}
      zdjecie="trasa"
      nadtytul="Auto zastępcze z OC sprawcy"
      tytul={`Auto zastępcze – ${k.nazwa.toLowerCase()}: ile i jak długo?`}
      opis={`Stawki ubezpieczycieli dla aut takich jak ${k.przyklady}. Policz, ile wart jest najem za cały czas bez auta.`}
      nazwaAplikacji={`Kalkulator auta zastępczego – ${nazwa}`}
      narzedzie={
        <section className={`${KARTA} p-5 sm:p-7`}>
          <KalkulatorZastepczego klasaStart={k.id} />
        </section>
      }
      przedTrescia={
        <SiatkaCta>
          <Odnosnik href="/po-szkodzie/" ikona={FileSearch} tytul="Sprawdź kosztorys naprawy" tekst="Darmowy test zaniżonego odszkodowania z OC sprawcy." />
          <CtaKancelaria karta="narzedzie-szkoda" />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Inne klasy aut</h2>
          <div className="max-w-3xl">
            <Tabela wiersze={[['Klasa', 'Warta', 'ERGO Hestia'], ...KLASY.filter((x) => x.id !== k.id).map((x) => [x.nazwa, zl(x.warta), zl(x.hestia)])]} />
          </div>
          <SiatkaCta>
            {KLASY.filter((x) => x.id !== k.id)
              .slice(0, 6)
              .map((x) => (
                <Odnosnik key={x.id} href={`/auto-zastepcze/${x.slug}/`} ikona={Car} tytul={`Auto zastępcze – ${x.nazwa.split(' (')[0].toLowerCase()}`} tekst={x.przyklady} />
              ))}
          </SiatkaCta>
        </section>
      }
      pytania={pytania}
      zrodla={[
        { n: 'rankomat.pl – stawki aut zastępczych (VIII 2026)', url: 'https://rankomat.pl/samochod/samochod-zastepczy-oc-jak-dlugo' },
        { n: 'otomoto.pl – auto zastępcze z OC sprawcy', url: 'https://www.otomoto.pl/news/auto-zastepcze-z-oc-sprawcy-na-co-zwrocic-uwage' }
      ]}
      stan={STAN_SZKODY}
      uwaga="Stawki mogą się zmienić – aktualne podaje ubezpieczyciel sprawcy."
    />
  );
}
