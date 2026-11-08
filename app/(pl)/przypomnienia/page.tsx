import type { Metadata } from 'next';
import { ShieldCheck, CalendarClock, MailCheck } from 'lucide-react';
import NaglowekDzialu from '@/components/NaglowekDzialu';
import Okruszki from '@/components/Okruszki';
import KodStrony from '@/components/KodStrony';
import FormularzPrzypomnien from '@/components/FormularzPrzypomnien';
import StatusPrzypomnien from '@/components/StatusPrzypomnien';
import { przypomnieniaWlaczone } from '@/lib/przypomnienia';

export const metadata: Metadata = {
  title: 'Przypomnienie o końcu OC, przeglądzie i zmianie opon – darmowe przypomnienie e-mail',
  description:
    'Nie przegap końca polisy OC ani terminu przeglądu. Wpisz daty, a 3 tygodnie i 3 dni wcześniej dostaniesz e-mail – z linkiem do porównania cen OC. Za darmo, wypisanie jednym kliknięciem.',
  alternates: { canonical: '/przypomnienia/' }
};

const KROKI = [
  { ikona: CalendarClock, t: 'Wpisz daty', o: 'Koniec OC znajdziesz na polisie, termin przeglądu – w dowodzie rejestracyjnym albo w aplikacji mObywatel.' },
  { ikona: MailCheck, t: 'Potwierdź e-mail', o: 'Klikasz link w wiadomości od nas. Bez potwierdzenia nic nie wysyłamy, a dane znikają po 7 dniach.' },
  { ikona: ShieldCheck, t: 'Dostajesz przypomnienie', o: '3 tygodnie i 3 dni przed terminem. Co roku od nowa, aż się wypiszesz.' }
];

export default function PrzypomnieniaPage() {
  const wlaczone = process.env.NEXT_PUBLIC_STATYCZNA !== '1' && przypomnieniaWlaczone();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Okruszki sciezka={[{ nazwa: 'Przypomnienia o OC', adres: '/przypomnienia/' }]} />
      <NaglowekDzialu
        zdjecie="kupujesz"
        nadtytul="Za darmo"
        tytul="Przypomnienie o OC, przeglądzie i oponach"
        opis="Automatyczne przedłużenie OC bywa nawet o kilkaset złotych droższe niż nowa oferta. Przypomnimy Ci zawczasu – zdążysz porównać ceny."
      />
      <StatusPrzypomnien />
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <FormularzPrzypomnien wlaczone={wlaczone} />
      </section>
      <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {KROKI.map(({ ikona: Ikona, t, o }, i) => (
          <li key={t} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="w-8 h-8 rounded-lg bg-steel-600 text-white flex items-center justify-center">
                <Ikona className="w-4 h-4" aria-hidden="true" />
              </span>
              {i + 1}. {t}
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{o}</p>
          </li>
        ))}
      </ol>
      <KodStrony sciezka={'/przypomnienia/'} />
    </div>
  );
}
