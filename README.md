# MotoFormat – Atlas Aut (moto-format.pl) – instrukcja

Strona kanału MotoFormat z kartami modeli aut: ile egzemplarzy jest zarejestrowanych w Polsce, mapa województw, roczniki, paliwa, pojemności, nadwozia. Dane pochodzą z państwowej bazy CEPiK.

## Co jest gdzie

| Co chcesz zmienić | Gdzie |
|---|---|
| Nazwa strony, adres (moto-format.pl), link do kanału, dane wydawcy, e-mail kontaktowy, NIP, adres firmy | `config/site.ts` (puste pole = nie pokazuje się na stronie) |
| Linki partnerskie (VIN, OC, AC, NNW) i filmy na kartach | **panel admina: moto-format.pl/admin** (zapisuje do `data/panel.json`) |
| Opis generacji (np. BMW E36): reguły liczenia, wymiary, silniki | `data/definicje/` (jeden plik na generację) |
| Polityka prywatności (dane bierze z `config/site.ts`) | `app/prywatnosc/page.tsx` |
| Gotowe karty modeli (tworzą się same – nie edytuj ręcznie) | `data/models/` |
| Policzone dane z CEPiK | `data/cepik/zestawienie.tsv` |
| Strony województw i rankingi (tworzą się same) | `data/wojewodztwa.json`, `data/rankingi.json`, `data/cepik/tlo.json` |
| Strona „wszystkie linki” do opisu kanału i social mediów | `moto-format.pl/linki` |
| Nagłówki obrazków PNG do udostępniania | `vercel.json` |

## Adresy podstron

- `/marki/` – wszystkie marki, `/marki/volkswagen/` – marka z rankingiem modeli,
- `/marki/volkswagen/golf/` – model (wszystkie generacje), `/marki/volkswagen/golf/iv/` – generacja,
- `/porownaj/` i `/porownaj/<auto-a>-vs-<auto-b>/` – porównania „A czy B” (pary konkurentów i kolejnych generacji),
- `/kody-bledow/` i `/kody-bledow/p0420/` – kody błędów OBD-II (lista w `lib/kody-bledow.ts`),
- `/wojewodztwa/…`, `/rankingi/…`, `/rynek/` (rynek nowych aut z raportów Samar/PZPM – plik `data/rynek-nowych.json`).
- Mapa strony dla Google: `/sitemap.xml` (indeks) → `/sitemaps/strony.xml`, `marki.xml`, `generacje.xml`, `modele-1.xml`…

## Uruchomienie na komputerze

1. Zainstaluj **Node.js** (wersja LTS) ze strony nodejs.org.
2. Rozpakuj folder i otwórz go w **Visual Studio Code**.
3. W terminalu (Terminal → New Terminal) wpisz raz: `npm install`
4. Podgląd strony: `npm run dev`, a potem otwórz **http://localhost:3000**.

## Panel admina (linki partnerskie i filmy)

Panel jest pod adresem **/admin** (`https://moto-format.pl/admin`). Zmiany zapisuje w Twoim repozytorium na GitHubie, a strona sama się przebudowuje (na Vercel ok. 2–3 minuty, na cyber_Folks ok. 15–30 minut). Nie ma bazy danych ani dodatkowych opłat.

**Jednorazowe przygotowanie (5 minut):**
1. W pliku `config/site.ts` wpisz w `githubRepo` swoje repozytorium, np. `'motoformat/atlas-aut'`, i wyślij zmianę na GitHub.
2. Utwórz klucz dostępu: GitHub → kliknij swoje zdjęcie → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - Expiration: np. 1 rok,
   - Repository access: **Only select repositories** → wybierz repozytorium strony,
   - Permissions → Repository permissions → **Contents: Read and write** oraz **Actions: Read and write** (to drugie jest potrzebne do przycisku „Aktualizuj dane”).
3. Skopiuj token (zaczyna się od `github_pat_`), wejdź na `/admin`, wklej go i kliknij **Połącz**. Token zapamięta się w tej przeglądarce. Nie udostępniaj go nikomu.

**Zakładki panelu:**
- *Linki i moduły* – włączniki boksów (VIN, ubezpieczenia, części Allegro/Ceneo), linki partnerskie ze znacznikami `{marka}`, `{model}`, `{slug}`, `{fraza}`, kolejność boksów i wykluczenia (np. „ukryj VIN, gdy średni rocznik ≥ 2024”).
- *Filmy* – filmy na kartach modeli.
- *Kody* – kod dla całej strony (head / koniec strony) i dla wybranej podstrony (np. Meta Pixel, widżet, weryfikacja).
- *SEO i reklamy* – kod Google Search Console, identyfikator GA4, AdSense (domyślnie wyłączony) i treść pliku `/ads.txt`.
- *Opisy* – szkice opisów modeli do przeczytania i zatwierdzenia (pojawiają się na stronie dopiero po zatwierdzeniu).

**Codzienne użycie:**
- *Linki partnerskie:* wklej linki do raportu VIN oraz porównywarek OC, AC i NNW. Puste pole = przycisk się nie pokaże.
- *Filmy:* wybierz model (np. wpisz „E36”), wklej link do filmu, przepisz tytuł i datę publikacji, kliknij **Dodaj film do karty**. Do jednego modelu możesz dodać kilka filmów – pierwszy będzie osadzony, kolejne jako linki.
- Na końcu kliknij **Zapisz zmiany**.

Każdy film na karcie ma też opis dla Google (tzw. dane strukturalne filmu), dzięki czemu wyszukiwarka łatwiej pokaże go przy wynikach dla danego modelu.

## Jak dodać nową kartę generacji (np. Golf VI)

Gotowe są 24 generacje (m.in. Golf III–V, Passat B5/B6, Astra F/G, A4 B5/B6, BMW E36/E46/E39).

1. Skopiuj np. `data/definicje/volkswagen-golf-v.json` i nazwij np. `volkswagen-golf-vi.json`.
2. Zmień w nim: `slug` (taki sam jak nazwa pliku), markę, model, generację, opis, wymiary i silniki.
3. W części `cepik` wpisz:
   - `marka` i `rodzina` dokładnie tak, jak w bazie (np. `"VOLKSWAGEN"` i `"GOLF"`),
   - `reguly`: które roczniki (i ewentualnie nadwozia) na pewno należą do tej generacji,
   - `wykluczNazwy` (opcjonalnie): nazwy do pominięcia, np. `"PLUS"` albo `"C.?MAX"`,
   - `jakLiczone`: zdanie dla czytelnika, jak liczyliśmy.
   - Pomijaj roczniki, w których dwie generacje produkowano równocześnie – wtedy liczba jest uczciwie „minimalna”.
4. Zainstaluj **Python 3** (python.org) i uruchom: `python3 scripts/zbuduj-modele.py`
5. Program przebuduje wszystkie karty. Sprawdź wynik w `npm run dev`.

Wymiary i silniki sprawdzaj w co najmniej jednym źródle i wpisuj je do pola `zrodla`.

## Aktualizacja danych jednym kliknięciem

Panel admina → zakładka **„Aktualizacje danych”**:
- **„Aktualizuj dane teraz”** uruchamia automat na GitHubie (plik `.github/workflows/aktualizuj-dane.yml`). Automat dociąga z API CEPiK auta zarejestrowane od ostatniej aktualizacji (bez ostatnich 7 dni, które CEPiK jeszcze uzupełnia), przelicza karty i zapisuje zmiany – Vercel sam publikuje stronę. Ten sam automat uruchamia się sam **3. dnia każdego miesiąca**. Poniżej przycisku widać, czy ostatnie aktualizacje się udały, i pasek postępu – jaki okres rejestracji jest już pobrany.
- **Uzupełnianie starszych lat:** jeśli w danych brakuje jeszcze części okresu od listopada 2019 r. (pasek postępu poniżej 100%), automat uzupełnia go sam. Pracuje na 4 serwerach GitHuba naraz, ok. 5 godzin na raz, zapisuje wynik i **sam uruchamia się ponownie**, aż pobierze wszystko. Twój komputer nie musi być włączony. Dopóki dane nie są pełne, na kartach i w „Skąd dane” jest krótka informacja, że liczby jeszcze rosną.
- **Limit darmowych minut GitHuba:** repozytorium publiczne – bez limitu. Repozytorium prywatne – 2000 minut miesięcznie na darmowym koncie; pierwsze pełne uzupełnienie danych może je zużyć. Wtedy automat po prostu stanie i dokończy w kolejnym miesiącu (albo kliknij „Aktualizuj dane teraz” po odnowieniu limitu).
- **Rynek nowych aut** – formularz do dopisania nowego okresu ze statystyk Samar/PZPM (te publikowane są w raportach PDF, więc liczby przepisuje się ręcznie, zawsze z linkiem do źródła).

Jeśli automat na GitHubie zgłosi błąd połączenia z CEPiK (serwis bywa przeciążony), wystarczy uruchomić go ponownie później. W ostateczności można uruchomić to samo na komputerze: `node scripts/aktualizuj-cepik.mjs`, a potem `python3 scripts/zbuduj-modele.py` i wysłać zmiany na GitHub.

## Skąd są liczby i jak je odświeżyć

- Liczby pochodzą z pełnych paczek CEPiK (api.cepik.gov.pl → „pliki”). Ministerstwo opublikowało je 17.04.2022, ale zawierają rejestracje mniej więcej **do listopada 2019**.
- Paczki zostały przeliczone programem `scripts/cepik-liczenie-w-przegladarce.js`. Działa w przeglądarce otwartej na stronie api.cepik.gov.pl (pobiera ok. 2,4 GB, liczy ok. 25 minut).
- Auta zarejestrowane po raz pierwszy w Polsce **po listopadzie 2019** pobieramy z API CEPiK skryptem `scripts/cepik-api-nowe-rejestracje.js` (uruchamiany w przeglądarce na stronie api.cepik.gov.pl, trwa kilkanaście godzin; wynik to `data/cepik/nowe.tsv`). Raz na kilka miesięcy można go uruchomić ponownie, żeby odświeżyć liczby – najprościej poprosić o to Claude'a.
- **Jeśli ministerstwo opublikuje nowsze paczki**, trzeba je przeliczyć tym samym programem, podmienić `data/cepik/zestawienie.tsv` i uruchomić `python3 scripts/zbuduj-modele.py`. Najprościej poprosić o to Claude'a.
- Warto napisać do Ministerstwa Cyfryzacji (biurocepik2.0@cyfra.gov.pl) z pytaniem, czy planują aktualizację paczek.

## Ważne ograniczenia (opisane też na stronie „Skąd dane”)

- Suma samochodów osobowych w paczkach (ok. 17 mln) jest niższa niż w statystykach GUS. Liczby najlepiej sprawdzają się do porównań między modelami, rocznikami i województwami.
- „Zarejestrowane” nie znaczy „jeżdżące”: w bazie są np. setki tysięcy Polonezów i Maluchów, których nikt nie wyrejestrował.
- Nazwy modeli w CEPiK są wpisywane ręcznie i bywają niespójne. Karty zbiorcze (wszystkie generacje) grupują je automatycznie. Część nietypowych zapisów może trafić gdzie indziej.

## Opisy modeli (eksploatacja, koszty, podsumowanie)

- Szkice leżą w `data/opisy/<slug>.json`. Gotowe są szkice dla 100 najpopularniejszych kart – przeczytaj je w panelu (zakładka „Opisy”) i zatwierdź te, które się zgadzają.
- Kolejne opisy wygenerujesz skryptem (potrzebny klucz API Anthropic, płatny wg zużycia):
  `ANTHROPIC_API_KEY=sk-ant-... node scripts/generuj-opisy.mjs --limit 200`
  Skrypt pomija gotowe pliki, czeka przy limitach API i po przerwaniu zaczyna od miejsca, w którym skończył.

## Reklamy AdSense (gdy konto zostanie zaakceptowane)

1. W AdSense: „Prywatność i wiadomości” → „Europejskie przepisy” → utwórz i opublikuj wiadomość o zgodzie (certyfikowany baner Google, wymagany w UE).
2. W panelu: zakładka „SEO i reklamy” → wpisz `ca-pub-…`, numery bloków reklamowych i treść `ads.txt`, włącz przełącznik, zapisz.
3. Polityka prywatności sama dopisze informację o reklamach i zgodach.

## Raporty realnego spalania (od kierowców)

Formularz i statystyki pokazują się na kartach modeli dopiero po podłączeniu darmowej bazy danych:
1. W Vercel: projekt → zakładka **Storage** → **Create Database** → **Upstash for Redis** (plan darmowy) → połącz z projektem.
   Vercel sam doda zmienne `KV_REST_API_URL` i `KV_REST_API_TOKEN` (albo wpisz ręcznie `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` z konta na upstash.com).
2. Kliknij **Redeploy**. Gotowe – formularz pojawi się sam.

Ochrona przed spamem: ukryte pole-pułapka, minimalny czas wypełnienia, max 5 zgłoszeń na godzinę z jednego adresu, jeden raport dziennie dla danego modelu; wyniki mocno odstające są pomijane w średniej.
Strona nie jest już eksportowana jako same pliki (`output: 'export'` wyłączone), bo raporty potrzebują małego serwera API – Vercel obsługuje to automatycznie, nadal za darmo.

## Statystyki odwiedzin

Strona ma wbudowane **Vercel Web Analytics** (bez ciasteczek, bez banera zgody). Po pierwszej publikacji wejdź na Vercel → projekt → zakładka **Analytics** → **Enable**. Zobaczysz, które modele i województwa są najczęściej oglądane – to dobra podpowiedź, o czym nagrać kolejny film.

## Publikacja za darmo (Vercel)

1. Załóż konta na **github.com** i **vercel.com** (do Vercel zaloguj się przez GitHub).
2. Wyślij folder na GitHub (najprościej programem **GitHub Desktop**: File → Add local repository → Publish repository).
3. Na Vercel kliknij **Add New → Project**, wybierz repozytorium i kliknij **Deploy**.
4. Każda zmiana wysłana na GitHub sama zaktualizuje stronę.
5. Kup domenę **moto-format.pl** (np. w OVH, home.pl, nazwa.pl – ok. 10–50 zł za pierwszy rok), a potem na Vercel: projekt → **Settings → Domains** → wpisz `moto-format.pl` i ustaw u sprzedawcy domeny rekordy DNS, które pokaże Vercel.

## Publikacja na cyber_Folks (albo innym zwykłym hostingu)

Na zwykłym hostingu strona działa jako same pliki HTML. Wszystko działa tak samo jak na Vercel, z dwoma wyjątkami: nie ma **raportów spalania od kierowców** (moduł sam się ukrywa) i nie ma **statystyk Vercel** (zamiast nich możesz w panelu admina włączyć Google Analytics). Pliki na serwer wysyła automat na GitHubie – po każdej zmianie sam, bez Twojego udziału.

**Raz, na początku (ok. 20 minut):**

1. **GitHub** – załóż konto i wyślij folder strony do nowego repozytorium (np. programem **GitHub Desktop**: File → Add local repository → Publish repository). Najlepiej odznacz „Keep this code private” – wtedy automaty działają bez limitu minut.
2. **cyber_Folks – domena i SSL.** Zaloguj się do panelu hostingu (DirectAdmin). Jeśli domeny `moto-format.pl` nie ma jeszcze na liście, dodaj ją (**Zarządzanie domenami → Dodaj domenę**). Potem włącz darmowy certyfikat: **Certyfikaty SSL → Let's Encrypt** dla `moto-format.pl` i `www.moto-format.pl`.
3. **cyber_Folks – folder strony.** Otwórz **Menedżer plików** i sprawdź, gdzie jest folder `public_html` Twojej domeny – zwykle `domains/moto-format.pl/public_html`. Jeśli jest w nim przykładowy plik (np. `index.html` z napisem o nowej stronie), możesz go usunąć.
4. **cyber_Folks – dane FTP.** Adres serwera, login i hasło FTP znajdziesz w mailu powitalnym od cyber_Folks albo w panelu (**Konta FTP**). Możesz tam też założyć osobne konto FTP tylko dla automatu.
5. **GitHub – wpisz dane FTP.** W repozytorium: **Settings → Secrets and variables → Actions → New repository secret**. Dodaj 4 sekrety (nazwy wpisz dokładnie tak):
   - `FTP_SERWER` – adres serwera FTP, np. `s123.cyber-folks.pl`
   - `FTP_LOGIN` – login FTP
   - `FTP_HASLO` – hasło FTP
   - `FTP_FOLDER` – folder strony z punktu 3 z ukośnikiem na końcu, np. `domains/moto-format.pl/public_html/`
     (jeśli założyłeś osobne konto FTP, które od razu „widzi” tylko public_html, wpisz `./`)

   Sekrety są zaszyfrowane – nikt (także Ty) nie zobaczy ich później w GitHubie, można je tylko podmienić.
6. **Pierwsza publikacja.** W repozytorium: **Actions → Publikacja na serwer (FTP) → Run workflow**. Pierwsze wysłanie trwa dłużej (ok. 30–60 minut, strona ma kilkanaście tysięcy plików). Kolejne wysyłają tylko zmiany.
7. **Uzupełnienie danych z CEPiK.** Wejdź na `https://moto-format.pl/admin`, połącz panel z GitHubem (instrukcja wyżej, „Panel admina”) i w zakładce **Aktualizacje** kliknij **„Aktualizuj dane teraz”**. Automat sam dociągnie brakujące lata i sam opublikuje stronę po każdym kawałku.

**Na co dzień:** nic. Zmiana w panelu admina → po ok. 15–30 minutach jest na stronie. Raz w miesiącu automat sam pobiera nowe dane z CEPiK i publikuje stronę.

**Gdy coś nie działa:**
- W GitHubie **Actions** czerwony krzyżyk przy „Publikacja na serwer (FTP)” z błędem o połączeniu lub certyfikacie (TLS) → dodaj w **Settings → Secrets and variables → Actions → zakładka Variables** zmienną `FTP_PROTOKOL` o wartości `ftp` i uruchom publikację ponownie.
- Błąd logowania → sprawdź login i hasło FTP (sekrety `FTP_LOGIN`, `FTP_HASLO`).
- Strona pokazuje stary wygląd → odśwież przeglądarkę z wyczyszczeniem pamięci (Ctrl+F5 / Cmd+Shift+R).
- Ręcznie, bez automatu: na komputerze `npm run build:statyczna`, a zawartość folderu `out` wyślij programem FileZilla do `public_html` (razem z ukrytym plikiem `.htaccess`).
