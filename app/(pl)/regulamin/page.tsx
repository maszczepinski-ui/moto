import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';

// Regulamin serwisu (wymóg art. 8 ustawy o świadczeniu usług drogą elektroniczną).
// Dane wydawcy uzupełniasz w pliku config/site.ts – wstawiają się tu same.

export const metadata: Metadata = {
  title: 'Regulamin serwisu',
  description: 'Zasady korzystania z serwisu: usługi, wymagania techniczne, raporty spalania, przypomnienia e-mail, reklamacje i kontakt.',
  alternates: { canonical: '/regulamin/' }
};

const OBOWIAZUJE_OD = '2 listopada 2026';

export default function RegulaminPage() {
  const domena = site.url.replace('https://', '');
  const kontakt = site.contactEmail ? (
    <a href={`mailto:${site.contactEmail}`} className="underline">
      {site.contactEmail}
    </a>
  ) : (
    'adres e-mail podany w stopce strony'
  );
  const R = ({ n, t, children }: { n: number; t: string; children: React.ReactNode }) => (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        §{n}. {t}
      </h2>
      {children}
    </section>
  );
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Regulamin serwisu {domena}</h1>
        <p className="text-slate-500 text-sm">Obowiązuje od {OBOWIAZUJE_OD}</p>
      </header>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <R n={1} t="Kto prowadzi serwis">
          <p>
            Serwis {domena} (dalej: Serwis) prowadzi <strong>{site.publisher}</strong>
            {site.publisherAddress ? `, ${site.publisherAddress}` : `, ${site.publisherCity}`}
            {site.publisherNip ? `, NIP ${site.publisherNip}` : ''} (dalej: Usługodawca). Kontakt: {kontakt}. Ten adres jest też punktem kontaktowym dla użytkowników i organów w
            rozumieniu Aktu o usługach cyfrowych (DSA); piszemy po polsku i angielsku.
          </p>
        </R>
        <R n={2} t="Jakie usługi oferuje Serwis">
          <ul className="list-disc pl-5 space-y-1">
            <li>przeglądanie informacji o modelach aut (m.in. dane z Centralnej Ewidencji Pojazdów udostępniane przez Ministerstwo Cyfryzacji), artykułów i filmów,</li>
            <li>kalkulatory: koszt przejazdu, koszty utrzymania, mandaty i punkty karne, orientacyjne koszty po zakupie auta,</li>
            <li>mapy ładowarek oraz fotoradarów i odcinkowych pomiarów prędkości (dane OpenStreetMap),</li>
            <li>dodawanie raportów realnego spalania,</li>
            <li>przypomnienia e-mail o końcu ubezpieczenia OC, terminie przeglądu i sezonowej zmianie opon,</li>
            <li>informacje o oponach i narzędzia do sprawdzenia rozmiaru, wieku i bieżnika opony,</li>
            <li>poradniki i wzory dokumentów (umowa kupna-sprzedaży, oświadczenie sprawcy kolizji, wypowiedzenie OC) wypełniane w przeglądarce – wpisane dane nie są wysyłane do Serwisu.</li>
          </ul>
          <p>Wszystkie usługi są bezpłatne. Korzystanie z Serwisu nie wymaga zakładania konta.</p>
        </R>
        <R n={3} t="Wymagania techniczne">
          <p>
            Wystarczy urządzenie z dostępem do internetu i aktualna przeglądarka (np. Chrome, Firefox, Safari, Edge) z włączoną obsługą JavaScript. Do przypomnień potrzebny jest
            adres e-mail. Lokalizacja na mapach jest używana tylko po Twojej zgodzie w przeglądarce.
          </p>
        </R>
        <R n={4} t="Charakter informacji">
          <p>
            Wyniki kalkulatorów, opisy usterek, oceny i dane o mandatach mają charakter informacyjny i orientacyjny – nie są poradą prawną, ubezpieczeniową, techniczną ani ofertą
            handlową. Dane o urządzeniach do pomiaru prędkości i ładowarkach mogą być niepełne lub nieaktualne. Przed decyzją (np. zakupem auta lub polisy) sprawdź informacje u
            źródła. Zawsze jedź zgodnie z przepisami i znakami.
          </p>
        </R>
        <R n={5} t="Treści dodawane przez użytkowników">
          <p>
            Raport spalania zawiera tylko liczby i wybór z listy. Zabronione jest dodawanie danych nieprawdziwych lub zautomatyzowane wysyłanie raportów. Usługodawca może usunąć
            raporty, które wyglądają na nieprawdziwe, spam lub naruszają prawo.
          </p>
          <p>
            Treść, którą uważasz za bezprawną, możesz zgłosić na adres {kontakt} – podaj, gdzie się znajduje i dlaczego jest bezprawna. Rozpatrzymy zgłoszenie bez zbędnej zwłoki i
            poinformujemy Cię o decyzji.
          </p>
        </R>
        <R n={6} t="Przypomnienia e-mail">
          <p>
            Zapis wymaga podania adresu e-mail, co najmniej jednej daty albo wyboru przypomnienia o oponach oraz potwierdzenia zapisu linkiem z wiadomości. Przypomnienia o OC i przeglądzie wysyłamy 3 tygodnie i 3 dni przed terminem, co roku; o zmianie opon – na początku października i w drugiej połowie marca.
            Umowa o tę usługę trwa do wypisania się – każda wiadomość zawiera link „wypisz się”, który kończy umowę i usuwa dane od razu. Szczegóły w{' '}
            <Link href="/prywatnosc/" className="underline">
              polityce prywatności
            </Link>
            .
          </p>
        </R>
        <R n={7} t="Linki partnerskie i reklamy">
          <p>
            Serwis zawiera linki partnerskie (oznaczone) i może wyświetlać reklamy. Usługodawca może otrzymać prowizję, gdy skorzystasz z oferty partnera – nie zmienia to ceny. Umowę
            z partnerem (np. zakup raportu historii pojazdu, polisy, produktu) zawierasz bezpośrednio z nim, na jego zasadach. Serwis nie jest pośrednikiem ubezpieczeniowym i nie
            doradza w wyborze ubezpieczenia.
          </p>
        </R>
        <R n={8} t="Reklamacje">
          <p>
            Uwagi i reklamacje dotyczące działania Serwisu wyślij na {kontakt}. Opisz problem i podaj adres strony, której dotyczy. Odpowiemy w ciągu 14 dni. Możesz też skorzystać
            z pozasądowych sposobów rozwiązywania sporów, np. pomocy rzecznika konsumentów.
          </p>
        </R>
        <R n={9} t="Prawa autorskie">
          <p>
            Teksty, zestawienia, grafiki i układ Serwisu są chronione prawem autorskim. Możesz cytować fragmenty z podaniem źródła i linkiem do Serwisu. Nazwy marek i modeli należą do
            ich właścicieli i są używane wyłącznie w celu opisu pojazdów. Mapy: © autorzy OpenStreetMap (licencja ODbL).
          </p>
        </R>
        <R n={10} t="Postanowienia końcowe">
          <p>
            Usługodawca może zmienić regulamin z ważnych przyczyn (np. zmiana przepisów, nowe usługi). Zmiany ogłaszamy na tej stronie; osoby zapisane na przypomnienia
            powiadomimy e-mailem co najmniej 14 dni wcześniej. W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności ustawę o świadczeniu usług drogą elektroniczną
            i Kodeks cywilny.
          </p>
        </R>
      </div>
      <KodStrony sciezka={'/regulamin/'} />
    </div>
  );
}
