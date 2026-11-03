import Link from 'next/link';
import { ArrowRight, Phone, Printer } from 'lucide-react';
import IkonaPoradnika from '@/components/IkonaPoradnika';
import { PORADNIKI } from '@/lib/poradniki';

// Strona główna: „Miałeś kolizję?” + wzory dokumentów do wydruku.
export default function SekcjaPoradnikowGlowna() {
  const wzory = PORADNIKI.filter((p) => p.generator);
  const kroki = ['Zabezpiecz miejsce i sprawdź, czy nikt nie jest ranny', 'Zrób zdjęcia, zanim przestawicie auta', 'Usuń auta z jezdni', 'Spiszcie oświadczenie sprawcy'];
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rust-900 text-white p-7 sm:p-8 space-y-6">
        <div className="absolute -right-8 -top-8 opacity-[0.08]" aria-hidden="true">
          <IkonaPoradnika ikona="kolizja" className="w-64 h-64" />
        </div>
        <div className="relative space-y-2">
          <span className="text-[11px] font-black tracking-[0.25em] uppercase text-rust-300">Poradnik</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.05]">Miałeś kolizję?</h2>
          <p className="text-white/75 max-w-lg">Jeśli nikt nie jest ranny, a sprawca przyznaje się do winy, nie musisz wzywać policji. Zrób to w tej kolejności:</p>
        </div>
        <ol className="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
          {kroki.map((k, i) => (
            <li key={k} className="flex items-center gap-3 rounded-2xl bg-white/10 ring-1 ring-white/10 px-4 py-3 text-sm font-semibold">
              <span className="w-7 h-7 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {k}
            </li>
          ))}
        </ol>
        <div className="relative flex flex-wrap gap-2">
          <Link href="/poradniki/kolizja-bez-policji/" className="inline-flex items-center gap-2 bg-white text-slate-900 font-extrabold px-5 py-3 rounded-xl hover:bg-rust-50">
            Co zrobić po kolizji <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a href="tel:112" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 ring-1 ring-white/30 font-bold px-5 py-3 rounded-xl">
            <Phone className="w-4 h-4" aria-hidden="true" /> Ranni? Dzwoń 112
          </a>
        </div>
      </div>

      <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 sm:p-7 flex flex-col gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.2em] uppercase text-slate-500">
            <Printer className="w-3.5 h-3.5" aria-hidden="true" /> Wzory do wydruku
          </span>
          <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">Wypełnij w przeglądarce, wydrukuj albo zapisz jako PDF</h3>
        </div>
        <ul className="space-y-2 flex-1">
          {wzory.map((p) => (
            <li key={p.slug}>
              <Link href={`/poradniki/${p.slug}/#generator`} className="group flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 p-3">
                <span className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center flex-shrink-0">
                  <IkonaPoradnika ikona={p.ikona} />
                </span>
                <span className="flex-1 font-bold text-slate-900 dark:text-white text-sm">{p.krotko}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/poradniki/" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300 hover:underline">
          Wszystkie poradniki <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
