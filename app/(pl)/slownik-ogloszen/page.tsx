import type { Metadata } from 'next';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import DetektorOgloszen from '@/components/narzedzia/DetektorOgloszen';
import { CtaVin, CtaNiezbednik, SiatkaCta } from '@/components/narzedzia/Cta';
import { RYZYKO_OPIS, STAN_SLOWNIKA, ZWROTY } from '@/lib/narzedzia/slownik';
import { site } from '@/config/site';

const TYTUL = 'Słownik ogłoszeń motoryzacyjnych i detektor';
const OPIS = 'Co naprawdę znaczy „sprowadzony, opłacony”, „klima do nabicia” czy „bezwypadkowy”? Wklej ogłoszenie – podświetlimy zwroty do sprawdzenia i podpowiemy pytania.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/slownik-ogloszen/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/slownik-ogloszen/` }
};

const SEKCJE: Sekcja[] = [
  {
    h2: 'Jak czytać ogłoszenia samochodowe',
    akapity: [
      'Ogłoszenie to reklama, a nie protokół z oględzin. Większość zwrotów jest prawdziwa albo przynajmniej szczera, ale część ma ukryte drugie dno: „klima do nabicia” zwykle oznacza niedziałającą klimatyzację, a „sprowadzony, opłacony” – auto sprzedawane przez handlarza na cudzą umowę.',
      'Detektor powyżej szuka w tekście zwrotów z naszego słownika i układa je od najbardziej ryzykownych. Każdy zwrot ma osobną stronę z wyjaśnieniem, listą rzeczy do sprawdzenia i pytaniami, które warto zadać sprzedającemu przed wyjazdem na oględziny.'
    ]
  },
  {
    h2: 'Trzy pytania, które warto zadać zawsze',
    lista: ['Jaki jest numer VIN? (uczciwy sprzedający poda go od razu)', 'Na kogo będzie umowa i czy auto jest zarejestrowane na Pana?', 'Co w aucie wymaga naprawy albo wymiany w najbliższym czasie?']
  }
];

const PYTANIA: Pytanie[] = [
  { q: 'Co znaczy „sprowadzony, opłacony”?', a: 'Auto ma zapłaconą akcyzę, ale nie jest zarejestrowane w Polsce. Często sprzedaje je handlarz na umowę z poprzednim zagranicznym właścicielem, co utrudnia reklamację wad.' },
  { q: 'Co znaczy „klima do nabicia”?', a: 'Najczęściej klimatyzacja nie działa, a przyczyną jest nieszczelność albo uszkodzona sprężarka – a nie sam brak czynnika.' },
  { q: 'Czy „bezwypadkowy” to gwarancja?', a: 'Nie. To deklaracja sprzedającego. Sprawdź lakier miernikiem, historię szkód po VIN i poproś o wpisanie tej informacji do umowy.' },
  { q: 'Czy detektor wysyła gdzieś treść ogłoszenia?', a: 'Nie. Tekst jest sprawdzany w Twojej przeglądarce.' }
];

export default function SlownikPage() {
  return (
    <StronaNarzedzia
      id="slownik"
      adres="/slownik-ogloszen/"
      okruszki={[{ nazwa: 'Słownik i detektor ogłoszeń', adres: '/slownik-ogloszen/' }]}
      zdjecie="kupujesz"
      nadtytul="Detektor ogłoszeń"
      tytul="Co naprawdę znaczy to ogłoszenie?"
      opis="Wklej treść ogłoszenia. Podświetlimy zwroty, za którymi często kryje się coś więcej, i podpowiemy, o co zapytać sprzedającego."
      nazwaAplikacji="Detektor zwrotów w ogłoszeniach samochodowych"
      narzedzie={<DetektorOgloszen />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-slownik" tytul="Sprawdź auto z ogłoszenia po VIN" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={SEKCJE}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Słownik zwrotów z ogłoszeń</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 max-w-5xl">
            {ZWROTY.map((z) => (
              <div key={z.slug}>
                <dt>
                  <a href={`/slownik-ogloszen/${z.slug}/`} className="font-extrabold text-rust-700 dark:text-rust-300 hover:underline">
                    „{z.fraza}”
                  </a>{' '}
                  <span className="text-xs text-slate-500">– {RYZYKO_OPIS[z.ryzyko]}</span>
                </dt>
                <dd className="text-sm leading-6 text-slate-600 dark:text-slate-300 mt-1">{z.znaczenie.split('. ')[0]}.</dd>
              </div>
            ))}
          </dl>
        </section>
      }
      pytania={PYTANIA}
      zrodla={[
        { n: 'historiapojazdu.gov.pl', url: 'https://historiapojazdu.gov.pl/' },
        { n: 'UOKiK – prawa konsumenta', url: 'https://prawakonsumenta.uokik.gov.pl/' }
      ]}
      stan={STAN_SLOWNIKA}
      uwaga="Opisy zwrotów to omówienie redakcji – nie przesądzają o uczciwości konkretnego sprzedającego."
    />
  );
}
