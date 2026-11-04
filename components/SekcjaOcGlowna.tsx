import Link from 'next/link';
import { ArrowRight, BellRing, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import { pokazModul, linkUbezpieczenia, panelDane } from '@/lib/panel';

// Strona główna: porównanie cen OC/AC (partner z panelu admina) + przypomnienie o końcu polisy.
const K = { slug: 'strona-glowna', marka: '', model: '' };

export default function SekcjaOcGlowna() {
  const oc = pokazModul('ubezpieczenia', K) ? linkUbezpieczenia('oc', K) : '';
  const partner = panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia';
  return (
    <section className={`grid grid-cols-1 gap-4 ${oc ? 'lg:grid-cols-5' : ''}`}>
      {oc && (
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white p-7 sm:p-8 flex flex-col gap-5">
          <ShieldCheck className="absolute -right-8 -bottom-8 w-56 h-56 text-white/10" aria-hidden="true" />
          <div className="relative space-y-2">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-sky-100">Kalkulator OC/AC</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.05]">Porównaj ceny OC i AC</h2>
            <p className="text-sky-50/90 max-w-lg">Oferty wielu ubezpieczycieli w jednym miejscu. Zamiast przedłużać polisę „z automatu”, sprawdź, ile zapłacisz gdzie indziej.</p>
          </div>
          <ul className="relative flex flex-wrap gap-x-5 gap-y-1 text-sm text-sky-50">
            {['dowód rejestracyjny', 'PESEL właściciela', 'data prawa jazdy'].map((x) => (
              <li key={x} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" /> {x}
              </li>
            ))}
          </ul>
          <div className="relative flex flex-wrap items-center gap-3">
            <LinkPartnerski href={oc} modul="ubezpieczenia" partner={partner} karta="strona-glowna" className="inline-flex items-center gap-2 bg-white text-sky-800 font-extrabold px-6 py-3.5 rounded-xl hover:bg-sky-50">
              Porównaj ceny OC <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
            <Link href="/ubezpieczenie-oc/" className="inline-flex items-center gap-1 text-sm font-bold text-white/90 hover:underline">
              Jak wybrać OC <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="relative text-[11px] text-white/60">Link partnerski{partner === 'rankomat' ? ' – kalkulator Rankomat.pl' : ''}. Nie płacisz więcej.</p>
        </div>
      )}
      <div className={`${oc ? 'lg:col-span-2' : ''} flex flex-col justify-between gap-4 bg-steel-700 text-white rounded-3xl p-6 sm:p-8`}>
        <div className="space-y-2">
          <BellRing className="w-9 h-9 text-rust-300" aria-hidden="true" />
          <h2 className="text-2xl font-extrabold">Nie przepłacaj przy automatycznym przedłużeniu</h2>
          <p className="text-steel-100">Wpisz datę końca polisy i przeglądu – przypomnimy Ci e-mailem 3 tygodnie wcześniej. Za darmo.</p>
        </div>
        <Link href="/przypomnienia/" className="self-start inline-flex items-center justify-center gap-2 bg-white text-steel-800 font-bold px-5 py-3 rounded-xl hover:bg-steel-50">
          Ustaw przypomnienie <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
