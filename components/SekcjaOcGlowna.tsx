import Link from 'next/link';
import { ArrowRight, BellRing, ShieldCheck, ExternalLink, CheckCircle2, Car, TrendingDown, TriangleAlert } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import { pokazModul, linkUbezpieczenia, panelDane } from '@/lib/panel';

// Strona główna: porównanie cen OC/AC (partner z panelu admina) + przypomnienie o końcu polisy.
// Ilustracja ofert jest wyraźnie opisana jako przykład – to nie są prawdziwe ceny żadnego ubezpieczyciela.

const OFERTY = [
  { n: 'Ubezpieczyciel A', cena: 1240 },
  { n: 'Ubezpieczyciel B', cena: 1105 },
  { n: 'Ubezpieczyciel C', cena: 960 },
  { n: 'Ubezpieczyciel D', cena: 890 }
];

const KROKI = [
  { t: 'Wpisz dane auta', o: 'z dowodu rejestracyjnego' },
  { t: 'Porównaj oferty', o: 'wielu ubezpieczycieli naraz' },
  { t: 'Wybierz i kup', o: 'online, bez wizyty u agenta' }
];

export function IlustracjaOfertOc() {
  const max = Math.max(...OFERTY.map((o) => o.cena));
  const min = Math.min(...OFERTY.map((o) => o.cena));
  return (
    <div className="relative" role="img" aria-label="Ilustracja porównania ofert OC – przykładowe ceny">
      <div className="absolute -inset-6 bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-emerald-300/20 blur-2xl rounded-[3rem]" aria-hidden="true" />
      <div className="relative rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)] p-5 sm:p-6 lg:-rotate-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Car className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Porównanie ofert OC</div>
              <div className="text-[11px] text-slate-500">Twoje auto · polisa na 12 miesięcy</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full px-2 py-1">przykład</span>
        </div>
        <ul className="mt-5 space-y-2.5">
          {OFERTY.map((o) => {
            const naj = o.cena === min;
            return (
              <li key={o.n} className={`rounded-2xl px-4 py-3 ring-1 ${naj ? 'bg-emerald-50 ring-emerald-300 dark:bg-emerald-950/40 dark:ring-emerald-800' : 'bg-slate-50 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700'}`}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{o.n}</span>
                  <span className="flex items-center gap-2">
                    {naj && <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white rounded-full px-2 py-0.5">najtaniej</span>}
                    <span className={`font-black tabular-nums whitespace-nowrap ${naj ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>{o.cena.toLocaleString('pl-PL')} zł</span>
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-700 overflow-hidden" aria-hidden="true">
                  <div className={`h-full rounded-full ${naj ? 'bg-emerald-500' : 'bg-sky-500/70'}`} style={{ width: `${(o.cena / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-sky-50 dark:bg-sky-950/40 px-4 py-3 text-sm text-sky-900 dark:text-sky-100">
          <TrendingDown className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>
            Różnica w przykładzie: <strong>{(max - min).toLocaleString('pl-PL')} zł</strong> za tę samą polisę
          </span>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">Ilustracja MotoFormat – przykładowe ceny, nie są ofertą żadnego ubezpieczyciela.</p>
      </div>
      <div className="relative mt-4 ml-auto w-fit flex items-center gap-2 rounded-2xl bg-slate-950 dark:bg-slate-800 text-white px-4 py-3 shadow-xl ring-1 ring-white/10">
        <TriangleAlert className="w-5 h-5 text-amber-300" aria-hidden="true" />
        <span className="text-xs leading-tight">
          Brak OC ponad 14 dni
          <br />
          <strong className="text-sm">9610 zł kary (UFG, 2026)</strong>
        </span>
      </div>
    </div>
  );
}

const K = { slug: 'strona-glowna', marka: '', model: '' };

export default function SekcjaOcGlowna() {
  const oc = pokazModul('ubezpieczenia', K) ? linkUbezpieczenia('oc', K) : '';
  const partner = panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia';
  const przypomnienie = (
    <Link
      href="/przypomnienia/"
      className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-slate-950/[0.04] dark:bg-white/5 ring-1 ring-slate-200 dark:ring-slate-800 px-5 py-4 hover:ring-slate-400"
    >
      <span className="w-10 h-10 rounded-xl bg-steel-700 text-white flex items-center justify-center flex-shrink-0">
        <BellRing className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block font-extrabold text-slate-900 dark:text-white">Nie przegap końca polisy</span>
        <span className="block text-sm text-slate-500">Przypomnimy Ci e-mailem 3 tygodnie przed końcem OC – wtedy jest najlepszy moment na porównanie. Za darmo.</span>
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-bold text-steel-700 dark:text-steel-300">
        Ustaw przypomnienie <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  );

  if (!oc) return <section>{przypomnienie}</section>;

  return (
    <section aria-labelledby="oc-naglowek" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/60 ring-1 ring-sky-100 dark:ring-slate-800">
      <div className="absolute -top-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-sky-300/30 dark:bg-sky-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center p-7 sm:p-10 lg:p-12">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 ring-1 ring-sky-200 dark:ring-slate-700 px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Kalkulator OC/AC{partner === 'rankomat' ? ' · Rankomat.pl' : ''}
          </span>
          <h2 id="oc-naglowek" className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02] text-slate-900 dark:text-white">
            Ta sama polisa.
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 dark:from-sky-300 dark:via-indigo-300 dark:to-emerald-300 bg-clip-text text-transparent">Różne ceny.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            OC przedłuża się samo – często drożej niż rok wcześniej. Porównaj oferty wielu ubezpieczycieli w kilka minut, zanim zapłacisz za kolejny rok.
          </p>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {KROKI.map((k, i) => (
              <li key={k.t} className="flex items-start gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 ring-1 ring-slate-200 dark:ring-slate-800 p-3.5">
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span>
                  <span className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{k.t}</span>
                  <span className="block text-xs text-slate-500">{k.o}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-4">
            <LinkPartnerski
              href={oc}
              modul="ubezpieczenia"
              partner={partner}
              karta="strona-glowna"
              className="group inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-lg font-extrabold px-7 py-4 rounded-2xl shadow-[0_16px_32px_-14px_rgba(2,132,199,0.8)] transition"
            >
              <ShieldCheck className="w-5 h-5" aria-hidden="true" /> Porównaj ceny OC
              <ExternalLink className="w-4 h-4 opacity-80" aria-hidden="true" />
            </LinkPartnerski>
            <Link href="/ubezpieczenie-oc/" className="inline-flex items-center gap-1 font-bold text-sky-800 dark:text-sky-300 hover:underline">
              Jak wybrać OC <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Przygotuj:</span>
            {['dowód rejestracyjny', 'PESEL właściciela', 'datę prawa jazdy'].map((x) => (
              <span key={x} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" /> {x}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">Link partnerski{partner === 'rankomat' ? ' – kalkulator Rankomat.pl' : ''}. Porównanie jest darmowe, nie płacisz więcej.</p>
        </div>

        <IlustracjaOfertOc />
      </div>
      <div className="relative px-7 sm:px-10 lg:px-12 pb-7 sm:pb-10">{przypomnienie}</div>
    </section>
  );
}
