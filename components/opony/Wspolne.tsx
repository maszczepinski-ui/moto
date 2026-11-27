import { Faq, KARTA, type Pytanie } from '@/components/narzedzia/StronaNarzedzia';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

// Wspólne kawałki stron doboru opon

/** Biała karta wyboru rozmiaru, nachodząca na ciemny nagłówek */
export function KartaWyboru({ children }: { children: React.ReactNode }) {
  return <div className={`${KARTA} -mt-20 relative p-5 sm:p-7`}>{children}</div>;
}

/** Dwa boksy na dole: jak czytać rozmiar i skąd są ceny (uczciwa informacja o prowizji) */
export function BoksyInformacyjne() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`${KARTA} p-6`}>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Jak czytać rozmiar opony?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <b className="text-slate-900 dark:text-white">205</b> – szerokość w mm, <b className="text-slate-900 dark:text-white">55</b> – wysokość boku w % szerokości,{' '}
          <b className="text-slate-900 dark:text-white">R16</b> – średnica felgi w calach, <b className="text-slate-900 dark:text-white">91H</b> – indeks nośności i prędkości. Indeksy
          nie mogą być niższe niż w dowodzie rejestracyjnym lub instrukcji auta.{' '}
          <a href="/opony/#rozmiar" className="font-semibold text-rust-700 dark:text-rust-400 hover:underline">Więcej o oznaczeniach</a>
        </p>
      </div>
      <div className={`${KARTA} p-6`}>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Skąd są ceny?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Ceny pochodzą z porównywarki tanie-opony.pl i odświeżamy je codziennie. Aktualną cenę i dostępność zawsze pokazuje sklep. Za przejście do sklepu możemy dostać prowizję –
          nie zmienia to ceny dla Ciebie.
        </p>
      </div>
    </div>
  );
}

/** Pytania i odpowiedzi + dane strukturalne FAQPage */
export function PytaniaOpony({ pytania }: { pytania: Pytanie[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pytania.map((p) => ({ '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: p.a } }))
  };
  return (
    <>
      <Faq pytania={pytania} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </>
  );
}
