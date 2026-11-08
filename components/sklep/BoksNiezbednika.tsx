// Boks promujący płatny Niezbędnik. Pokazuje się TYLKO, gdy sklep jest włączony (wszystkie klucze w Vercelu),
// więc do tego czasu nie ma go nigdzie na stronie. Strony są generowane przy budowie – po dodaniu kluczy wystarczy Redeploy.
// Spokojny boks bez pop-upów, w miejscach, gdzie ktoś już korzysta z darmowej wersji tego samego narzędzia.
import Link from 'next/link';
import { ArrowRight, PackageCheck } from 'lucide-react';
import { PRODUKT, sklepAktywny, zlotowki } from '@/lib/sklep/konfiguracja';

export type MiejsceBoksu = 'zakup' | 'umowa' | 'karta';

const TEKSTY: Record<MiejsceBoksu, (model?: string) => { tytul: string; tekst: string; przycisk: string }> = {
  zakup: () => ({
    tytul: 'Ta lista to podstawa. Wersja PRO idzie dalej.',
    tekst: '10 etapów oględzin z punktami STOP, umowa z klauzulami chroniącymi kupującego, protokół odbioru i 15 pytań przez telefon.',
    przycisk: 'Zobacz, co jest w Niezbędniku'
  }),
  umowa: () => ({
    tytul: 'To wzór podstawowy. Wersja PRO chroni kupującego.',
    tekst: 'Oświadczenia sprzedającego o przebiegu, szkodach i obciążeniach, lista znanych wad, rękojmia bez wyłączeń i protokół zdawczo-odbiorczy.',
    przycisk: 'Zobacz umowę PRO i resztę pakietu'
  }),
  karta: (model) => ({
    tytul: `Kupujesz ${model || 'to auto'}? Zabierz na oględziny komplet.`,
    tekst: 'Check-lista na telefon, umowa z klauzulami dla kupującego i protokół odbioru. Pobierasz od razu po płatności BLIK.',
    przycisk: 'Zobacz Niezbędnik'
  })
};

export default function BoksNiezbednika({ miejsce, model }: { miejsce: MiejsceBoksu; model?: string }) {
  if (!sklepAktywny()) return null;
  const t = TEKSTY[miejsce](model);
  return (
    <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-5 flex flex-col sm:flex-row sm:items-center gap-4 print:hidden">
      <PackageCheck className="w-10 h-10 text-steel-600 dark:text-steel-400 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 dark:text-white">{t.tytul}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{t.tekst}</p>
      </div>
      <Link
        href={`/niezbednik/?z=${miejsce}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-3 text-sm whitespace-nowrap"
      >
        {t.przycisk} · {zlotowki(PRODUKT.cenaGr)}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
