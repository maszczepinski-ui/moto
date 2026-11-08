// PROJEKT regulaminu sklepu – do sprawdzenia przez prawnika. Dane firmy: data/sklep/firma.json.
import type { Metadata } from 'next';
import { FIRMA, regulaminGotowy } from '@/lib/sklep/firma';
import { PRODUKT, zlotowki } from '@/lib/sklep/konfiguracja';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Regulamin sklepu – Niezbędnik', robots: { index: false, follow: true }, alternates: { canonical: '/niezbednik/regulamin/' } };

export default function RegulaminPage() {
  const sekcje: [string, string[]][] = [
    ['Sprzedawca', [`Sprzedawcą jest ${FIRMA.nazwa}, ${FIRMA.adres}, NIP ${FIRMA.nip}, e-mail: ${FIRMA.email}.`, `Sklep działa pod adresem ${site.url}/niezbednik/.`]],
    [
      'Produkt i cena',
      [
        `Przedmiotem sprzedaży jest pakiet treści cyfrowych „${PRODUKT.nazwa}” (pliki PDF i DOCX), dostarczany wyłącznie przez internet, bez nośnika materialnego.`,
        `Cena wynosi ${zlotowki(PRODUKT.cenaGr)} brutto. Sprzedawca korzysta ze zwolnienia z VAT (art. 113 ust. 1 ustawy o VAT).`,
        'Pakiet ma charakter informacyjny i nie stanowi porady prawnej ani oceny stanu technicznego konkretnego pojazdu.'
      ]
    ],
    [
      'Zamówienie, płatność i dostarczenie',
      [
        'Umowa zostaje zawarta z chwilą opłacenia zamówienia. Płatności obsługuje PayPro S.A. (Przelewy24): BLIK, szybki przelew lub karta.',
        'Po zaksięgowaniu płatności kupujący otrzymuje link do pobrania plików na stronie i mailem. Link jest ważny 7 dni.',
        'Potwierdzenie zawarcia umowy, wraz z treścią złożonych oświadczeń, kupujący otrzymuje mailem.'
      ]
    ],
    [
      'Prawo odstąpienia od umowy',
      [
        'Konsument nie ma prawa odstąpienia od umowy o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym, jeżeli sprzedawca rozpoczął świadczenie za jego wyraźną i uprzednią zgodą, po poinformowaniu go o utracie prawa odstąpienia, które konsument przyjął do wiadomości, i po przekazaniu potwierdzenia (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta).',
        'Zgodę i oświadczenie kupujący składa, zaznaczając pole w formularzu zamówienia przed płatnością.'
      ]
    ],
    [
      'Reklamacje',
      [
        `Jeżeli pliki są niezgodne z umową (np. nie otwierają się albo są niekompletne), kupujący może złożyć reklamację na adres ${FIRMA.email}. Sprzedawca odpowiada w ciągu 14 dni.`,
        'Uprawnienia konsumenta z tytułu niezgodności treści cyfrowej z umową wynikają z rozdziału 5b ustawy o prawach konsumenta.'
      ]
    ],
    ['Licencja', ['Kupujący może korzystać z plików na własny użytek, w tym drukować je i wypełniać. Udostępnianie plików innym osobom i ich dalsza sprzedaż są zabronione.']],
    ['Dane osobowe', ['Administratorem danych jest sprzedawca. Dane (e-mail, imię i nazwisko lub dane firmy) przetwarzamy w celu realizacji zamówienia, wystawienia faktury (inFakt) i wysyłki maili (Resend). Szczegóły w polityce prywatności.']]
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {!regulaminGotowy() && (
        <p role="note" className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-3 text-sm">
          <strong>Projekt regulaminu.</strong> Treść czeka na uzupełnienie danych firmy i sprawdzenie przez prawnika.
        </p>
      )}
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Regulamin sklepu</h1>
      {sekcje.map(([t, akapity], i) => (
        <section key={t} className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            §{i + 1}. {t}
          </h2>
          {akapity.map((a) => (
            <p key={a} className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {a}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
