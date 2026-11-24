import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StronaNarzedzia, { H2, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import DetektorOgloszen from '@/components/narzedzia/DetektorOgloszen';
import { CtaVin, CtaNiezbednik, SiatkaCta } from '@/components/narzedzia/Cta';
import { RYZYKO_OPIS, STAN_SLOWNIKA, ZWROTY, wykryj, zwrotPoSlugu } from '@/lib/narzedzia/slownik';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return ZWROTY.map((z) => ({ zwrot: z.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ zwrot: string }> }): Promise<Metadata> {
  const { zwrot } = await params;
  const z = zwrotPoSlugu(zwrot);
  if (!z) return {};
  const tytul = `„${z.fraza}” w ogłoszeniu – co to znaczy?`;
  const opis = `${z.znaczenie.split('. ')[0]}. Co sprawdzić i o co zapytać sprzedającego, gdy w ogłoszeniu jest „${z.fraza.toLowerCase()}”.`.slice(0, 160);
  const adres = `/slownik-ogloszen/${z.slug}/`;
  return { title: tytul, description: opis, alternates: { canonical: adres }, openGraph: { title: tytul, description: opis, url: `${site.url}${adres}` } };
}

export default async function ZwrotPage({ params }: { params: Promise<{ zwrot: string }> }) {
  const { zwrot } = await params;
  const z = zwrotPoSlugu(zwrot);
  if (!z) notFound();
  const adres = `/slownik-ogloszen/${z.slug}/`;
  // próbka do detektora: sama fraza, a jeśli detektor jej nie rozpozna – pierwszy wzorzec
  const probka = wykryj(z.fraza).some((t) => t.zwrot.slug === z.slug) ? z.fraza : z.wzorce[0];
  const podobne = ZWROTY.filter((x) => x.slug !== z.slug && x.ryzyko === z.ryzyko).slice(0, 6);
  const sekcje: Sekcja[] = [
    { h2: `Co oznacza „${z.fraza.toLowerCase()}”`, akapity: [z.znaczenie, `Nasza ocena: ${RYZYKO_OPIS[z.ryzyko]}.`] },
    { h2: 'Co sprawdzić na oględzinach', lista: z.sprawdz },
    { h2: 'O co zapytać sprzedającego', lista: z.zapytaj }
  ];
  const pytania: Pytanie[] = [
    { q: `Co znaczy „${z.fraza.toLowerCase()}” w ogłoszeniu?`, a: z.znaczenie },
    { q: 'Co sprawdzić przed zakupem?', a: `Najważniejsze: ${z.sprawdz.join('; ')}.` },
    { q: 'O co zapytać sprzedającego?', a: z.zapytaj.join(' ') }
  ];
  return (
    <StronaNarzedzia
      id="slownik"
      adres={adres}
      okruszki={[
        { nazwa: 'Słownik i detektor ogłoszeń', adres: '/slownik-ogloszen/' },
        { nazwa: z.fraza, adres }
      ]}
      zdjecie="kupujesz"
      nadtytul="Słownik ogłoszeń"
      tytul={`„${z.fraza}” – co to znaczy w ogłoszeniu?`}
      opis={`${z.znaczenie.split('. ')[0]}. Sprawdź, na co uważać i o co zapytać.`}
      nazwaAplikacji="Detektor zwrotów w ogłoszeniach samochodowych"
      narzedzie={<DetektorOgloszen start={`Przykład z ogłoszenia: „${probka}”. Wklej tu całe ogłoszenie, które oglądasz.`} />}
      przedTrescia={
        <SiatkaCta>
          <CtaVin karta="narzedzie-slownik" />
          <CtaNiezbednik miejsce="zakup" />
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <section className="space-y-4">
          <h2 className={H2}>Inne zwroty z ogłoszeń</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {[...podobne, ...ZWROTY.filter((x) => x.slug !== z.slug && !podobne.includes(x))].map((x) => (
              <li key={x.slug}>
                <a href={`/slownik-ogloszen/${x.slug}/`} className="text-rust-700 dark:text-rust-300 hover:underline">
                  „{x.fraza}”
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
      pytania={pytania}
      zrodla={[{ n: 'historiapojazdu.gov.pl', url: 'https://historiapojazdu.gov.pl/' }]}
      stan={STAN_SLOWNIKA}
      uwaga="Opis zwrotu to omówienie redakcji – nie przesądza o uczciwości konkretnego sprzedającego."
    />
  );
}
