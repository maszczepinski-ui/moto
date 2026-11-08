import { Metadata } from 'next';
import { Database, ShieldAlert, Ruler, MapPin } from 'lucide-react';
import KodStrony from '@/components/KodStrony';
import { uwagaUzupelnianie } from '@/lib/dane';

export const metadata: Metadata = {
  title: 'Skąd są dane',
  description: 'Jak liczymy auta w Polsce: dane z państwowej bazy CEPiK, ich ograniczenia i źródła danych technicznych.',
  alternates: { canonical: '/metodologia/' }
};

export default function MetodologiaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Skąd są dane</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Co pokazują liczby w atlasie i czego z nich nie da się wyczytać.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="flex items-center gap-2 text-base text-steel-600 dark:text-steel-400 font-bold">
          <Database className="w-5 h-5" aria-hidden="true" />
          Liczby: Centralna Ewidencja Pojazdów (CEPiK)
        </h2>
        <p>
          Liczba aut, mapa województw, roczniki, pojemności, paliwa i pochodzenie pochodzą z otwartych danych CEPiK udostępnianych przez Ministerstwo Cyfryzacji (api.cepik.gov.pl). Dane nie zawierają informacji o właścicielach.
        </p>
        <p>
          CEPiK nie zna pojęcia „generacji” modelu. Żeby policzyć np. BMW E36, wybieramy auta danej marki i modelu z odpowiednich lat produkcji. Dokładny sposób liczenia jest opisany na stronie każdego modelu.
        </p>
        <p>
          Dane pochodzą z pełnych paczek CEPiK opublikowanych przez ministerstwo 17 kwietnia 2022 r. – to najnowsza pełna wersja bazy udostępniona publicznie. Mimo daty publikacji paczki zawierają rejestracje mniej więcej do listopada 2019 r. Dlatego dokładamy do nich auta, które zarejestrowano w Polsce po raz pierwszy później – nowe z salonów i sprowadzone – pobrane z bieżącego API CEPiK. Liczba na karcie to suma obu źródeł. Nie wiemy jednak, ile starszych aut wyrejestrowano po 2019 r., więc dla starych modeli liczby są raczej zawyżone. Suma zarejestrowanych samochodów osobowych w paczkach (ok. 17 mln) jest niższa niż w statystykach GUS, więc liczby traktuj jako porównawcze: dobrze pokazują proporcje między modelami, rocznikami i województwami, ale nie są pełnym spisem. Datę, której dotyczą liczby („stan na…”), zawsze podajemy przy statystykach.{uwagaUzupelnianie() && <strong> {uwagaUzupelnianie()}</strong>}
        </p>
        <p>
          Są dwa rodzaje kart. <strong>Karty zbiorcze</strong> (np. „Volkswagen Golf”) liczą wszystkie generacje razem i powstają automatycznie dla każdego modelu, który ma w Polsce co najmniej 2000 zarejestrowanych egzemplarzy. <strong>Karty generacji</strong> (np. „BMW Seria 3 E36”) opisujemy ręcznie: ustalamy, które roczniki i nadwozia na pewno należą do danej generacji, i dodajemy dane techniczne.
        </p>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="flex items-center gap-2 text-base text-rust-600 font-bold">
          <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          Czego te liczby NIE mówią
        </h2>
        <p>
          „Zarejestrowane” nie znaczy „jeżdżące”. W bazie zostają też auta stojące latami w garażach lub na złomie, których nikt formalnie nie wyrejestrował. Przy starszych modelach liczba aut faktycznie jeżdżących jest zwykle wyraźnie niższa.
        </p>
        <p>
          Dlatego przy każdym modelu pokazujemy też drugą liczbę: ile aut <strong>zmieniło właściciela albo zostało zarejestrowanych w Polsce między kwietniem 2017 a listopadem 2019</strong>. To nie jest liczba aut jeżdżących (wiele aut latami ma jednego właściciela), ale dobrze pokazuje, jak żywy jest rynek danego modelu.
        </p>
        <p>Województwo to miejsce rejestracji auta, a nie miejsce, w którym jeździ na co dzień.</p>
        <p>
          Nazwy modeli w CEPiK są wpisywane ręcznie i bywają niespójne (np. „316I”, „316 1.6 KAT”, „ASTRA-G-CC”). Grupujemy je automatycznie według reguł. Gdy w bazie brakuje marki, a nazwa modelu jednoznacznie na nią wskazuje (np. „Escort” → Ford), dopisujemy ją – tak odzyskaliśmy ok. 1,5 mln aut. Ok. 0,4 mln wpisów jest tak nieczytelnych, że je pomijamy, a pojedyncze nietypowe zapisy mogą trafić do złej karty.
        </p>
        <p>
          Przy kartach generacji liczymy tylko te roczniki i nadwozia, które na pewno należą do danej generacji. Lata, w których dwie generacje produkowano równolegle, pomijamy, więc liczby generacji są <strong>minimalne</strong>.
        </p>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="flex items-center gap-2 text-base text-steel-600 dark:text-steel-400 font-bold">
          <MapPin className="w-5 h-5" aria-hidden="true" />
          Mapy, „zagłębia” i rankingi
        </h2>
        <p>
          Mapa „Zagłębie” porównuje udział modelu w województwie ze średnią krajową. Przykład: jeśli w Polsce co 100. osobówka to dany model, a w województwie co 50., to model jest tam <strong>2× częstszy niż średnio</strong>. Dzięki temu duże województwa (np. mazowieckie) nie wygrywają tylko dlatego, że jest w nich najwięcej aut. Mapa „Liczba aut” pokazuje zwykłe liczby sztuk.
        </p>
        <p>
          Strony województw pokazują najpopularniejsze modele w regionie oraz modele „charakterystyczne”, czyli wyraźnie częstsze niż w reszcie kraju (liczymy tylko modele z co najmniej 300 autami w województwie i 5000 w Polsce). Rankingi obejmują modele z co najmniej 10 000 zarejestrowanych aut i liczą wszystkie generacje razem.
        </p>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="flex items-center gap-2 text-base text-emerald-600 font-bold">
          <Ruler className="w-5 h-5" aria-hidden="true" />
          Dane techniczne i rysunki
        </h2>
        <p>
          Wymiary i wersje silnikowe pochodzą z katalogów danych technicznych (źródło podajemy na stronie modelu). Rysunek to sylwetka poglądowa dla danego typu nadwozia, narysowana w proporcjach wynikających z prawdziwych wymiarów modelu. Nie jest to rysunek fabryczny.
        </p>
      </section>
      <KodStrony sciezka={'/metodologia/'} />
    </div>
  );
}
