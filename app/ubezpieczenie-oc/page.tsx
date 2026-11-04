import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, CheckCircle2, CalendarClock, BellRing, FileText, TriangleAlert, ArrowRight, Plus } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import LinkPartnerski from '@/components/LinkPartnerski';
import { pokazModul, linkUbezpieczenia, panelDane } from '@/lib/panel';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Porównaj ceny OC i AC – kalkulator ubezpieczenia auta',
  description:
    'Porównaj ceny OC i AC u wielu ubezpieczycieli. Co przygotować do kalkulatora, kiedy zmienić ubezpieczyciela, jak nie przegapić końca polisy i ile kosztuje brak OC.',
  alternates: { canonical: '/ubezpieczenie-oc/' }
};

const K = { slug: 'ubezpieczenie-oc', marka: '', model: '' };

const FAQ = [
  {
    q: 'Czy polisa OC przedłuża się automatycznie?',
    a: 'Tak. Jeśli jej nie wypowiesz najpóźniej dzień przed końcem okresu, OC odnowi się na kolejne 12 miesięcy – często po wyższej cenie. Wyjątkiem jest polisa przejęta po zakupie auta: ta sama się nie odnawia.'
  },
  {
    q: 'Co jest potrzebne do kalkulatora OC?',
    a: 'Dowód rejestracyjny auta (dane pojazdu), PESEL właściciela i data uzyskania prawa jazdy. Przydaje się też informacja o historii szkód z poprzednich polis.'
  },
  {
    q: 'Ile kosztuje brak OC?',
    a: 'Za samochód osobowy UFG nalicza w 2026 r.: 1920 zł za 1–3 dni przerwy, 4810 zł za 4–14 dni i 9610 zł za ponad 14 dni bez OC.'
  },
  {
    q: 'Czy mogę zmienić ubezpieczyciela przed końcem polisy?',
    a: 'Zwykle robi się to na koniec okresu: kupujesz nowe OC od dnia po wygaśnięciu starego i wypowiadasz dotychczasową polisę najpóźniej dzień przed jej końcem. Jeśli masz już dwie polisy, wypowiedz tę, która odnowiła się automatycznie (art. 28a).'
  }
];

export default function UbezpieczenieOcPage() {
  const oc = pokazModul('ubezpieczenia', K) ? linkUbezpieczenia('oc', K) : '';
  const ac = pokazModul('ubezpieczenia', K) ? linkUbezpieczenia('ac', K) : '';
  const partner = panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };
  const Przycisk = ({ href, tekst, karta, jasny = false }: { href: string; tekst: string; karta: string; jasny?: boolean }) => (
    <LinkPartnerski
      href={href}
      modul="ubezpieczenia"
      partner={partner}
      karta={karta}
      className={`inline-flex items-center gap-2 font-extrabold px-6 py-3.5 rounded-xl ${jasny ? 'bg-white text-sky-800 hover:bg-sky-50' : 'bg-sky-700 text-white hover:bg-sky-800'}`}
    >
      {tekst} <ExternalLink className="w-4 h-4" aria-hidden="true" />
    </LinkPartnerski>
  );

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-800 to-indigo-900 text-white">
        <ShieldCheck className="absolute -right-16 -bottom-16 w-[26rem] h-[26rem] text-white/[0.07]" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-12 sm:pb-16">
          <div className="[&_a]:text-white/70 [&_span]:text-white/70">
            <Okruszki sciezka={[{ nazwa: 'Porównaj OC i AC', adres: '/ubezpieczenie-oc/' }]} />
          </div>
          <div className="mt-8 max-w-2xl space-y-5">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-sky-200">Ubezpieczenie auta</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.03]">Porównaj ceny OC i AC</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Ta sama polisa u różnych ubezpieczycieli potrafi kosztować wyraźnie inaczej. Kalkulator pokaże oferty wielu firm naraz – w kilka minut, bez dzwonienia do agentów.
            </p>
            {oc ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-3">
                  <Przycisk href={oc} tekst="Oblicz OC" karta="ubezpieczenie-oc-gora" jasny />
                  {ac && ac !== oc && <Przycisk href={ac} tekst="Oblicz OC + AC" karta="ubezpieczenie-oc-gora-ac" jasny />}
                </div>
                <p className="text-xs text-white/60">Link partnerski{partner === 'rankomat' ? ' – kalkulator Rankomat.pl' : ''}. Nie płacisz więcej.</p>
              </div>
            ) : (
              <p className="text-sm text-white/70">Kalkulator uruchomimy wkrótce.</p>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-14 pt-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { ikona: FileText, t: 'Przygotuj dane', o: 'Dowód rejestracyjny, PESEL właściciela i datę uzyskania prawa jazdy. Z nimi kalkulator wypełnisz w kilka minut.' },
            { ikona: CalendarClock, t: 'Porównuj przed końcem polisy', o: 'Najlepiej 2–3 tygodnie przed terminem. Wypowiedzenie starej polisy musi trafić do ubezpieczyciela najpóźniej dzień przed jej końcem.' },
            { ikona: CheckCircle2, t: 'Patrz nie tylko na cenę', o: 'Porównaj sumy, assistance, auto zastępcze i udział własny w AC. Najtańsza oferta nie zawsze jest najlepsza.' }
          ].map(({ ikona: I, t, o }) => (
            <div key={t} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6">
              <I className="w-7 h-7 text-sky-600" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">{t}</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{o}</p>
            </div>
          ))}
        </section>

        <section className="flex gap-4 rounded-3xl bg-amber-50 text-amber-950 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900 p-6">
          <TriangleAlert className="w-7 h-7 flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-extrabold text-lg">Nie zostawaj bez OC ani na jeden dzień</h2>
            <p className="mt-1">
              Za samochód osobowy bez OC UFG nalicza w 2026 r.: <strong>1920 zł</strong> za 1–3 dni przerwy, <strong>4810 zł</strong> za 4–14 dni i <strong>9610 zł</strong> za ponad 14 dni.
              Nową polisę kup tak, żeby zaczynała się dzień po końcu starej.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/poradniki/wypowiedzenie-oc/', t: 'Wypowiedzenie OC – wzór pisma', ikona: FileText },
            { href: '/przypomnienia/', t: 'Przypomnienie o końcu OC e-mailem', ikona: BellRing },
            { href: '/poradniki/kupilem-auto-co-dalej/', t: 'Kupiłeś auto? OC po zakupie', ikona: ShieldCheck }
          ].map(({ href, t, ikona: I }) => (
            <Link key={href} href={href} className="group flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4 hover:ring-slate-400">
              <span className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 flex items-center justify-center flex-shrink-0">
                <I className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="flex-1 font-bold text-sm text-slate-900 dark:text-white">{t}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          ))}
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Najczęstsze pytania o OC</h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex items-center gap-4 cursor-pointer list-none py-5 font-bold text-lg text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{f.q}</span>
                  <Plus className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-5 -mt-1 text-[1.05rem] leading-7 text-slate-600 dark:text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {oc && (
          <section className="rounded-3xl bg-slate-950 text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h2 className="text-2xl font-black">Sprawdź, ile zapłacisz za OC w tym roku</h2>
              <p className="text-white/70">Porównanie jest darmowe i do niczego nie zobowiązuje.</p>
            </div>
            <Przycisk href={oc} tekst="Porównaj ceny OC" karta="ubezpieczenie-oc-dol" jasny />
          </section>
        )}

        <p className="text-xs text-slate-500">
          Informacje poglądowe. {site.name} nie jest pośrednikiem ubezpieczeniowym i nie doradza w wyborze polisy – ofertę zawierasz bezpośrednio z ubezpieczycielem. Kwoty opłat karnych:{' '}
          <a href="https://cuk.pl/porady/czy-trzeba-miec-przy-sobie-prawo-jazdy-jakie-dokumenty-musi-miec-kierowca" target="_blank" rel="noopener noreferrer" className="underline">
            CUK
          </a>
          ; wypowiedzenie polisy:{' '}
          <a href="https://cuk.pl/porady/kiedy-mozna-wypowiedziec-oc" target="_blank" rel="noopener noreferrer" className="underline">
            CUK
          </a>
          .
        </p>
        <KodStrony sciezka="/ubezpieczenie-oc/" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </div>
  );
}
