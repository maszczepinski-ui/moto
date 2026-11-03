import { Metadata } from 'next';
import { site } from '@/config/site';
import KodStrony from '@/components/KodStrony';
import { panelDane } from '@/lib/panel';
import { przypomnieniaWlaczone } from '@/lib/przypomnienia';

// Tekst zmienia się sam, gdy w panelu admina włączysz reklamy AdSense albo Google Analytics
const adsense = !!(panelDane.moduly?.adsense?.wlaczony && panelDane.moduly.adsense.klient);
const ga4 = !!panelDane.seo?.ga4;
// wersja na zwykły hosting (np. cyber_Folks): bez statystyk Vercel i bez raportów spalania
const statyczna = process.env.NEXT_PUBLIC_STATYCZNA === '1';
const przypomnienia = !statyczna && przypomnieniaWlaczone();

export const metadata: Metadata = {
  title: 'Polityka prywatności i linki partnerskie',
  description: 'Jak serwis traktuje Twoje dane i jak działają linki partnerskie.',
  alternates: { canonical: '/prywatnosc/' }
};

const AKTUALIZACJA = '2 listopada 2026';

// Dane wydawcy (NIP, adres, e-mail) uzupełnia się w pliku config/site.ts.
export default function PrywatnoscPage() {
  const kontakt = site.contactEmail ? (
    <a href={`mailto:${site.contactEmail}`} className="underline">
      {site.contactEmail}
    </a>
  ) : (
    <>
      przez kanał{' '}
      <a href={site.youtubeChannelUrl} className="underline" target="_blank" rel="noopener noreferrer">
        {site.youtubeChannelName}
      </a>{' '}
      (zakładka „Informacje”)
    </>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Polityka prywatności i linki partnerskie</h1>
        <p className="text-slate-500 text-sm">Ostatnia aktualizacja: {AKTUALIZACJA}</p>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Kto prowadzi serwis</h2>
          <p>
            Serwis {site.url.replace('https://', '')} prowadzi <strong>{site.publisher}</strong>
            {site.publisherAddress ? `, ${site.publisherAddress}` : `, ${site.publisherCity}`}
            {site.publisherNip ? `, NIP ${site.publisherNip}` : ''}. Kontakt: {kontakt}.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Jakie dane zbieramy</h2>
          <p>
            {przypomnienia
              ? 'Serwis nie ma kont użytkowników. Jedyne dane osobowe, o które prosimy, to e-mail – i tylko jeśli sam zapiszesz się na przypomnienia o OC i przeglądzie (opis niżej).'
              : 'Serwis nie ma kont użytkowników ani newslettera i nie prosi Cię o żadne dane osobowe.'}{' '}
            {adsense || ga4
              ? 'Pliki cookies Google (reklamowe i analityczne) zapisujemy wyłącznie po wyrażeniu przez Ciebie zgody w okienku, które pojawia się przy pierwszej wizycie.'
              : 'Strona nie ustawia plików cookies.'}
          </p>
          <p>
            {statyczna ? 'Strona działa na serwerach firmy cyber_Folks S.A.' : 'Strona działa na serwerach firmy Vercel Inc.'} Jak każdy serwer, zapisują one techniczne informacje o połączeniu (np. adres IP), żeby strona działała i była bezpieczna.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Statystyki odwiedzin</h2>
          {statyczna && !ga4 && <p>Nie korzystamy z narzędzi do statystyk odwiedzin.</p>}
          {!statyczna && <p>
            Korzystamy z Vercel Web Analytics, żeby wiedzieć, które strony są czytane. To narzędzie nie używa plików cookies i nie rozpoznaje konkretnych osób – zbiera tylko ogólne dane, np. liczbę odwiedzin danej strony, kraj i rodzaj urządzenia.
          </p>}
          {ga4 && (
            <p>
              Korzystamy też z Google Analytics 4 (Google Ireland Ltd.). Działa w trybie zgody Google (Consent Mode v2): dopóki nie wyrazisz zgody, nie zapisuje plików cookies, a
              do Google trafiają tylko anonimowe sygnały bez identyfikatorów. Mierzymy m.in. kliknięcia w linki partnerskie. Zgodę możesz w każdej chwili zmienić w okienku ustawień prywatności.
            </p>
          )}
          {adsense && (
            <p>
              Na stronie wyświetlamy reklamy Google AdSense (Google Ireland Ltd.). Reklamy spersonalizowane i związane z nimi pliki cookies pojawiają się tylko po wyrażeniu zgody w
              okienku zgód Google. Bez zgody Google może pokazywać reklamy niespersonalizowane. Więcej: policies.google.com/technologies/ads.
            </p>
          )}
        </section>

        {!statyczna && <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Raporty spalania</h2>
          <p>
            Jeśli dodasz raport spalania, zapisujemy tylko to, co wpiszesz (model, wersję silnika, styl jazdy, wynik) i datę – bez imienia czy e-maila. Żeby ograniczyć spam, przez
            maksymalnie 24 godziny przechowujemy skrót (nie sam adres) Twojego adresu IP. Dane trzyma usługa Upstash (baza danych w chmurze).
          </p>
        </section>}

        {przypomnienia && (
          <section id="przypomnienia" className="space-y-2 scroll-mt-20">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Przypomnienia o OC i przeglądzie</h2>
            <p>
              Jeśli zapiszesz się na przypomnienia, przechowujemy Twój adres e-mail i podane daty (koniec OC, termin przeglądu). Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a
              RODO). Celem jest wyłącznie wysłanie przypomnień – 3 tygodnie i 3 dni przed terminem, co roku. W przypomnieniu o OC jest link partnerski do porównywarki ubezpieczeń.
            </p>
            <p>
              Zapis działa dopiero po kliknięciu linku potwierdzającego. Niepotwierdzone zapisy usuwamy automatycznie po 7 dniach. Każdy e-mail ma link „wypisz się” – jedno
              kliknięcie cofa zgodę i od razu usuwa wszystkie Twoje dane. Dane przechowuje Upstash (baza danych w chmurze, serwery w UE), a e-maile wysyła Resend Inc. (USA) – na podstawie umowy powierzenia danych ze standardowymi klauzulami umownymi UE. Nie
              przekazujemy adresów nikomu innemu, także partnerom.
            </p>
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mapy: ładowarki i fotoradary</h2>
          <p>
            Mapy korzystają z OpenStreetMap. Gdy otwierasz mapę lub wyszukujesz miejscowość, Twoja przeglądarka łączy się z serwerami OpenStreetMap (podkład mapy i
            wyszukiwarka) oraz Overpass API (lista ładowarek i fotoradarów) – tak jak przy każdej mapie w internecie, widzą one Twój adres IP. Swoją lokalizację udostępniasz tylko
            po kliknięciu „Moja lokalizacja” i potwierdzeniu w przeglądarce. Nie zapisujemy jej.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Lista kontrolna (pamięć przeglądarki)</h2>
          <p>
            Jeśli na stronie modelu jest lista kontrolna, Twoje zaznaczenia zapisują się wyłącznie w pamięci Twojej przeglądarki. Nie trafiają na żaden serwer. Możesz je usunąć przyciskiem „Wyczyść” albo czyszcząc dane przeglądarki.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Filmy z YouTube</h2>
          <p>
            Filmy ładują się dopiero po kliknięciu przycisku odtwarzania. Do tego momentu strona nie łączy się z YouTube. Po kliknięciu film jest odtwarzany w trybie rozszerzonej prywatności (youtube-nocookie.com), a dalej obowiązują zasady Google.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Linki partnerskie</h2>
          <p>
            Na stronie są linki do partnerów, np. dostawców raportów historii pojazdu i porównywarek ubezpieczeń. Są oznaczone napisem „link partnerski”. Jeśli przejdziesz przez taki link i skorzystasz z usługi, wydawca serwisu może dostać prowizję. Nie zmienia to ceny, którą płacisz. Serwis nie doradza w wyborze ubezpieczenia – kieruje tylko do porównywarki.
          </p>
          <p>Po przejściu na stronę partnera obowiązuje jego polityka prywatności. Partner może zapisać plik cookie, żeby przypisać polecenie do tego serwisu.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Twoje prawa</h2>
          <p>
            {przypomnienia
              ? 'Masz prawo dostępu do swoich danych, ich poprawienia, usunięcia, ograniczenia przetwarzania i przeniesienia, a także cofnięcia zgody w każdej chwili (link „wypisz się” w każdym e-mailu). Możesz też złożyć skargę do Prezesa UODO.'
              : 'Ponieważ nie zbieramy danych, po których da się Cię rozpoznać, zwykle nie mamy czego udostępnić ani usunąć.'}{' '}
            Jeśli masz pytania, napisz: {kontakt}.
          </p>
        </section>
      </div>
      <KodStrony sciezka={'/prywatnosc/'} />
    </div>
  );
}
