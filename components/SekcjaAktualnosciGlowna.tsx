import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { najnowszeAktualnosci } from '@/lib/aktualnosci';
import { KartaAktualnosci } from '@/components/aktualnosci/ListaAktualnosci';

// Strona główna: 3 najnowsze aktualności (akcje serwisowe, komunikaty, premiery). Bez opublikowanych wpisów sekcja się nie pokazuje.
export default function SekcjaAktualnosciGlowna() {
  const lista = najnowszeAktualnosci(3);
  if (!lista.length) return null;
  return (
    <section aria-labelledby="aktualnosci-glowna" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="aktualnosci-glowna" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Aktualności
          </h2>
          <p className="text-sm text-slate-500">Akcje serwisowe, komunikaty dla kierowców i premiery – z oficjalnych źródeł.</p>
        </div>
        <Link href="/aktualnosci/" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700 dark:text-sky-300 hover:underline">
          Wszystkie aktualności <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lista.map((a) => (
          <li key={a.slug}>
            <KartaAktualnosci a={a} />
          </li>
        ))}
      </ul>
    </section>
  );
}
