// Sklep i cennik – oferta płatnych produktów cyfrowych w jednym miejscu (wymóg Przelewy24: oferta z cenami,
// przejście do procesu zakupowego, regulamin sprzedaży, pełne dane sprzedawcy).
// Produkty i ceny: lib/sklep/produkty.ts, dane firmy: data/sklep/firma.json.
import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Download, FileText, Mail, Phone, Receipt, ShoppingCart, Undo2 } from 'lucide-react';
import Okruszki from '@/components/Okruszki';
import { PRODUKTY, sprzedazWlaczona, type Produkt } from '@/lib/sklep/produkty';
import { zlotowki } from '@/lib/sklep/konfiguracja';
import { FIRMA, telefonLink } from '@/lib/sklep/firma';

export const metadata: Metadata = {
  title: 'Sklep i cennik – Niezbędniki dla kierowców',
  description: 'Płatne pakiety plików MotoRaport: oferta, ceny brutto, jak wygląda zakup, płatność Przelewy24 (BLIK, przelew, karta), dostawa e-mailem, faktura i regulamin sklepu.',
  alternates: { canonical: '/sklep/' }
};

const OPISY: Record<string, { co: string; zawartosc: string[] }> = {
  niezbednik: {
    co: 'Komplet na oględziny i zakup używanego auta.',
    zawartosc: ['check-lista oględzin w 10 etapach z punktami STOP', 'umowa kupna-sprzedaży z oświadczeniami sprzedającego (PDF + Word)', 'protokół zdawczo-odbiorczy', '15 pytań do zadania przez telefon', 'ściąga: lakier i karoseria', 'formalności po zakupie z terminami', 'zgoda małżonka / oświadczenie o własności']
  },
  szkoda: {
    co: 'Pakiet dla poszkodowanych z OC sprawcy.',
    zawartosc: ['pierwsze 72 godziny po szkodzie', 'jak czytać kosztorys ubezpieczyciela', 'ścieżka odwołania', 'dziennik szkody (arkusz)', 'wzory pism (Word)', 'dostęp do Sprawdzacza kosztorysu']
  }
};

const KROKI = [
  { i: ShoppingCart, t: 'Wybierasz produkt', o: 'Klikasz „Kup” przy produkcie i przechodzisz do jego strony z formularzem zamówienia.' },
  { i: FileText, t: 'Wpisujesz dane', o: 'E-mail (na niego wyślemy pliki) i dane do faktury. Akceptujesz regulamin i prosisz o natychmiastowe dostarczenie plików.' },
  { i: CreditCard, t: 'Płacisz przez Przelewy24', o: 'Klikasz „Zapłać” i płacisz BLIK-iem, szybkim przelewem lub kartą w serwisie Przelewy24.' },
  { i: Download, t: 'Pobierasz od razu', o: 'Po płatności link do pobrania pojawia się na stronie i przychodzi e-mailem. Fakturę wysyłamy osobnym mailem.' }
];

export default function SklepPage() {
  const produkty = (Object.values(PRODUKTY) as Produkt[]).filter((p) => sprzedazWlaczona(p.id));
  const karta = 'rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]';
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      <header className="space-y-3">
        <Okruszki sciezka={[{ nazwa: 'Sklep i cennik', adres: '/sklep/' }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Sklep i cennik</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Większość serwisu MotoRaport jest bezpłatna. Tutaj znajdziesz płatne produkty cyfrowe – pakiety plików do pobrania. Ceny są cenami końcowymi brutto. Nie ma kosztów
          dostawy, bo wszystko dostajesz elektronicznie.
        </p>
      </header>

      <section aria-labelledby="cennik" className="space-y-4">
        <h2 id="cennik" className="text-2xl font-bold text-slate-900 dark:text-white">
          Cennik
        </h2>
        <div className={`${karta} overflow-x-auto`}>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Produkt</th>
                <th className="px-5 py-3">Forma</th>
                <th className="px-5 py-3 text-right">Cena brutto</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Zakup</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {produkty.map((p) => (
                <tr key={p.id} className="align-top">
                  <td className="px-5 py-4">
                    <Link href={p.sciezka} className="font-bold text-slate-900 dark:text-white hover:underline">
                      {p.nazwa}
                    </Link>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{OPISY[p.id]?.co}</p>
                    <ul className="list-disc pl-5 mt-2 text-slate-600 dark:text-slate-400 space-y-0.5">
                      {OPISY[p.id]?.zawartosc.map((z) => (
                        <li key={z}>{z}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">pliki PDF i DOCX do pobrania</td>
                  <td className="px-5 py-4 text-right text-lg font-black text-slate-900 dark:text-white whitespace-nowrap">{zlotowki(p.cenaGr)}</td>
                  <td className="px-5 py-4">
                    <Link href={`${p.sciezka}#zamow`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 whitespace-nowrap">
                      <ShoppingCart className="w-4 h-4" aria-hidden="true" /> Kup
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          Sprzedawca jest zwolniony z VAT (art. 113 ust. 1 ustawy o VAT) – podana cena jest ceną końcową. Koszt dostawy: 0 zł (dostawa elektroniczna).
        </p>
      </section>

      <section aria-labelledby="jak-kupic" className="space-y-4">
        <h2 id="jak-kupic" className="text-2xl font-bold text-slate-900 dark:text-white">
          Jak wygląda zakup
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KROKI.map(({ i: Ikona, t, o }, n) => (
            <li key={t} className={`${karta} p-5 space-y-2`}>
              <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm grid place-items-center">{n + 1}</span>
                <Ikona className="w-4 h-4 text-emerald-600" aria-hidden="true" /> {t}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{o}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
        <div className={`${karta} p-5 space-y-2`}>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <CreditCard className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Płatność
          </h2>
          <p>Płatności obsługuje PayPro S.A. (Przelewy24): BLIK, szybki przelew bankowy lub karta płatnicza. Na płatność masz 15 minut.</p>
        </div>
        <div className={`${karta} p-5 space-y-2`}>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Download className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Dostawa
          </h2>
          <p>Elektronicznie, od razu po zaksięgowaniu płatności: przycisk pobierania na stronie i link w e-mailu (ważny 7 dni). Bez wysyłki i bez kosztów dostawy.</p>
        </div>
        <div className={`${karta} p-5 space-y-2`}>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Receipt className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Faktura
          </h2>
          <p>Do każdego zamówienia wystawiamy fakturę (bez VAT) i wysyłamy ją e-mailem – także na firmę z NIP.</p>
        </div>
        <div className={`${karta} p-5 space-y-2`}>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Undo2 className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Odstąpienie i reklamacje
          </h2>
          <p>
            To treści cyfrowe dostarczane od razu, dlatego za Twoją zgodą prawo odstąpienia od umowy wygasa z chwilą dostarczenia plików (art. 38 ust. 1 pkt 13 ustawy o prawach
            konsumenta). Reklamację (np. plik się nie otwiera) wyślij na {FIRMA.email} – odpowiemy w ciągu 14 dni.
          </p>
        </div>
      </section>

      <section className={`${karta} p-6 space-y-3 text-sm text-slate-700 dark:text-slate-300`}>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sprzedawca i kontakt</h2>
        <p>
          <strong>{FIRMA.nazwa}</strong>, {FIRMA.adres}, NIP {FIRMA.nip}
          {FIRMA.regon ? `, REGON ${FIRMA.regon}` : ''}. Firma wpisana do Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG).
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          {FIRMA.telefon && (
            <a href={telefonLink(FIRMA.telefon)} className="inline-flex items-center gap-1.5 font-semibold hover:underline">
              <Phone className="w-4 h-4" aria-hidden="true" /> {FIRMA.telefon}
            </a>
          )}
          <a href={`mailto:${FIRMA.email}`} className="inline-flex items-center gap-1.5 font-semibold hover:underline">
            <Mail className="w-4 h-4" aria-hidden="true" /> {FIRMA.email}
          </a>
        </p>
        <p>
          Zasady sprzedaży:{' '}
          <Link href="/niezbednik/regulamin/" className="underline font-semibold">
            Regulamin sklepu
          </Link>
          . Dane osobowe:{' '}
          <Link href="/prywatnosc/" className="underline font-semibold">
            Polityka prywatności
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
