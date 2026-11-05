import type { Metadata } from 'next';
import Okruszki from '@/components/Okruszki';
import { opublikowaneAktualnosci } from '@/lib/aktualnosci';
import { SiatkaAktualnosci, ZakladkiTypow, PustaLista } from '@/components/aktualnosci/ListaAktualnosci';

const lista = () => opublikowaneAktualnosci();

export function generateMetadata(): Metadata {
  return {
    title: 'Aktualności motoryzacyjne – akcje serwisowe, przepisy, premiery',
    description: 'Akcje serwisowe samochodów, komunikaty dla kierowców i premiery nowych aut – aktualności z legalnych źródeł, omówione prostym językiem.',
    alternates: { canonical: '/aktualnosci/' },
    // pusta lista nie powinna trafiać do Google
    ...(lista().length ? {} : { robots: { index: false, follow: true } })
  };
}

export default function AktualnosciPage() {
  const wpisy = lista();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Aktualności', adres: '/aktualnosci/' }]} />
      <header className="space-y-3 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Aktualności</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Akcje serwisowe aut, komunikaty urzędów dla kierowców i premiery nowych modeli. Każdy wpis ma podane źródło – korzystamy wyłącznie z oficjalnych danych i materiałów
          prasowych, a teksty piszemy sami.
        </p>
      </header>
      <ZakladkiTypow />
      {wpisy.length ? <SiatkaAktualnosci lista={wpisy} /> : <PustaLista />}
    </div>
  );
}
