// PROJEKT regulaminu sklepu – do sprawdzenia przez prawnika. Dane firmy: data/sklep/firma.json.
import type { Metadata } from 'next';
import { FIRMA, regulaminGotowy } from '@/lib/sklep/firma';
import { PRODUKT, zlotowki } from '@/lib/sklep/konfiguracja';
import { PRODUKTY, sprzedazWlaczona } from '@/lib/sklep/produkty';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Regulamin sklepu – Niezbędniki MotoRaport', robots: { index: false, follow: true }, alternates: { canonical: '/niezbednik/regulamin/' } };

export default function RegulaminPage() {
  // Postanowienia o pakiecie po szkodzie wchodzą do regulaminu dopiero razem z jego sprzedażą (po akceptacji prawnika).
  // Do tego czasu kupujący Niezbędnik widzą dotychczasową treść (wersja 1).
  const szkoda = sprzedazWlaczona('szkoda');
  const sekcje: [string, string[]][] = [
    ['Sprzedawca', [`Sprzedawcą jest ${FIRMA.nazwa}, ${FIRMA.adres}, NIP ${FIRMA.nip}${FIRMA.regon ? `, REGON ${FIRMA.regon}` : ''}, e-mail: ${FIRMA.email}.`, szkoda ? `Sklep działa pod adresami ${site.url}/niezbednik/ i ${site.url}/po-szkodzie/.` : `Sklep działa pod adresem ${site.url}/niezbednik/.`]],
    szkoda ? [
      'Produkty i ceny',
      [
        `„${PRODUKT.nazwa}” – pakiet treści cyfrowych (pliki PDF i DOCX) oraz, gdy jest dostępny, kalkulator kosztów i negocjacji na stronie. Cena: ${zlotowki(PRODUKT.cenaGr)} brutto.`,
        `„${PRODUKTY.szkoda.nazwa}” – pakiet treści cyfrowych (pliki PDF, DOCX i arkusz) oraz dostęp do Sprawdzacza kosztorysu na stronie, który na podstawie danych wpisanych przez kupującego przygotowuje wzory pism do ubezpieczyciela. Cena: ${zlotowki(PRODUKTY.szkoda.cenaGr)} brutto.`,
        'Produkty są dostarczane wyłącznie przez internet, bez nośnika materialnego. Sprzedawca korzysta ze zwolnienia z VAT (art. 113 ust. 1 ustawy o VAT).',
        'Produkty mają charakter informacyjny i nie stanowią porady prawnej, oceny stanu technicznego konkretnego pojazdu ani reprezentacji kupującego przed ubezpieczycielem. Sprzedawca nie gwarantuje uzyskania odszkodowania ani dopłaty w określonej wysokości.'
      ]
    ] : [
      'Produkt i cena',
      [
        `Przedmiotem sprzedaży jest pakiet treści cyfrowych „${PRODUKT.nazwa}” (pliki PDF i DOCX), dostarczany wyłącznie przez internet, bez nośnika materialnego.`,
        `Cena wynosi ${zlotowki(PRODUKT.cenaGr)} brutto. Sprzedawca korzysta ze zwolnienia z VAT (art. 113 ust. 1 ustawy o VAT).`,
        'Pakiet ma charakter informacyjny i nie stanowi porady prawnej ani oceny stanu technicznego konkretnego pojazdu.'
      ]
    ],
    ...(szkoda ? [[
      'Narzędzia na stronie',
      [
        'Dostęp do kalkulatora i Sprawdzacza kupujący otrzymuje po zalogowaniu kodem wysłanym na e-mail podany w zamówieniu, na maksymalnie 3 urządzeniach, przez co najmniej 12 miesięcy od zakupu.',
        'Dane wpisywane do Sprawdzacza (kwoty z kosztorysu, dane do pism) są przetwarzane wyłącznie w przeglądarce kupującego i nie są przesyłane do sprzedawcy.'
      ]
    ] as [string, string[]]] : []),
    [
      'Zamówienie, płatność i dostarczenie',
      [
        'Umowa zostaje zawarta z chwilą opłacenia zamówienia. Płatności obsługuje PayPro S.A. (Przelewy24): BLIK, szybki przelew lub karta.',
        `Po zaksięgowaniu płatności kupujący otrzymuje link do pobrania plików na stronie i mailem. Link jest ważny 7 dni.${szkoda ? ' Dostęp do narzędzia na stronie działa od razu po płatności.' : ''}`,
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
      <p className="text-sm text-slate-500">Wersja {PRODUKT.wersjaZgod}</p>
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
