// Najczęstsze uniwersalne kody błędów OBD-II (standard SAE J2012 – znaczenie jest takie samo w każdym aucie).
// „powiazania” wskazują karty aut, w których dana usterka jest powszechnie znana – dodawane ręcznie i ostrożnie.

export interface KodBledu {
  kod: string;
  nazwa: string;
  opis: string;
  objawy: string[];
  przyczyny: string[];
  coSprawdzic: string[];
  pilnosc: 'niska' | 'średnia' | 'wysoka';
  /** frazy części do wyszukania (Allegro/Ceneo) */
  czesci: string[];
  powiazania?: { slug: string; uwaga: string }[];
}

export const KODY: KodBledu[] = [
  {
    kod: 'P0420',
    nazwa: 'Niska sprawność katalizatora (rząd 1)',
    opis: 'Komputer porównuje sygnały sondy lambda przed i za katalizatorem. Gdy są zbyt podobne, uznaje, że katalizator słabo oczyszcza spaliny.',
    objawy: ['Kontrolka silnika', 'Zwykle brak wyraźnych objawów w jeździe', 'Czasem zapach siarki z wydechu', 'Możliwy negatywny wynik badania spalin'],
    przyczyny: ['Zużyty lub uszkodzony katalizator', 'Uszkodzona sonda lambda za katalizatorem', 'Nieszczelność wydechu przed sondą', 'Wypadanie zapłonów, które przegrzało katalizator'],
    coSprawdzic: ['Odczytaj wykres pracy obu sond lambda', 'Sprawdź szczelność układu wydechowego', 'Upewnij się, że nie ma błędów wypadania zapłonów'],
    pilnosc: 'średnia',
    czesci: ['katalizator', 'sonda lambda']
  },
  {
    kod: 'P0171',
    nazwa: 'Zbyt uboga mieszanka (rząd 1)',
    opis: 'Sterownik musi stale dodawać paliwa, bo do silnika trafia więcej powietrza niż wynika z pomiarów albo za mało paliwa.',
    objawy: ['Kontrolka silnika', 'Nierówna praca na wolnych obrotach', 'Szarpanie przy przyspieszaniu', 'Gaśnięcie silnika'],
    przyczyny: ['Nieszczelność układu dolotowego (pęknięte węże, uszczelki kolektora)', 'Uszkodzony przepływomierz', 'Niesprawny zawór odmy', 'Słaba pompa paliwa lub zapchany filtr', 'Źle wyregulowana instalacja LPG'],
    coSprawdzic: ['Szukaj nieszczelności podciśnienia (test dymny)', 'Sprawdź odczyty przepływomierza', 'Zmierz ciśnienie paliwa', 'Przy LPG – sprawdź korekty na benzynie i gazie osobno'],
    pilnosc: 'średnia',
    czesci: ['przepływomierz', 'zawór odmy', 'wąż podciśnienia'],
    powiazania: [
      { slug: 'volkswagen-golf-iv', uwaga: 'często pęknięte węże odmy i podciśnienia w 1.8T' },
      { slug: 'audi-a4-b6', uwaga: 'nieszczelności dolotu i odmy w 1.8T' },
      { slug: 'bmw-seria-3-e46', uwaga: 'zawór odmy i nieszczelności kolektora' }
    ]
  },
  {
    kod: 'P0174',
    nazwa: 'Zbyt uboga mieszanka (rząd 2)',
    opis: 'To samo co P0171, ale dla drugiego rzędu cylindrów w silnikach V6/V8.',
    objawy: ['Kontrolka silnika', 'Nierówna praca', 'Spadek mocy'],
    przyczyny: ['Nieszczelność dolotu', 'Przepływomierz', 'Ciśnienie paliwa', 'Instalacja LPG'],
    coSprawdzic: ['Jeśli P0171 i P0174 występują razem – szukaj wspólnej przyczyny (przepływomierz, paliwo, duża nieszczelność)'],
    pilnosc: 'średnia',
    czesci: ['przepływomierz', 'uszczelka kolektora ssącego']
  },
  {
    kod: 'P0300',
    nazwa: 'Losowe / wielokrotne wypadanie zapłonów',
    opis: 'Sterownik wykrył nierówną pracę – w różnych cylindrach mieszanka nie spala się prawidłowo.',
    objawy: ['Szarpanie i drgania', 'Migająca kontrolka silnika (uwaga – grozi uszkodzeniem katalizatora)', 'Spadek mocy', 'Większe spalanie'],
    przyczyny: ['Zużyte świece zapłonowe', 'Uszkodzone cewki lub przewody zapłonowe', 'Nieszczelności dolotu', 'Problemy z wtryskami', 'Źle działająca instalacja LPG', 'Niska kompresja'],
    coSprawdzic: ['Sprawdź świece i cewki', 'Zamień cewki miejscami i zobacz, czy błąd „wędruje”', 'Zmierz kompresję'],
    pilnosc: 'wysoka',
    czesci: ['świece zapłonowe', 'cewka zapłonowa', 'przewody zapłonowe'],
    powiazania: [
      { slug: 'volkswagen-golf-iv', uwaga: 'cewki zapłonowe w 1.8T' },
      { slug: 'volkswagen-passat-b5', uwaga: 'cewki zapłonowe w 1.8T' },
      { slug: 'opel-corsa-c', uwaga: 'moduł zapłonowy w silnikach 1.0/1.2' }
    ]
  },
  { kod: 'P0301', nazwa: 'Wypadanie zapłonów – cylinder 1', opis: 'Sterownik wykrył brak prawidłowego spalania w cylindrze nr 1.', objawy: ['Szarpanie', 'Drgania na wolnych obrotach', 'Kontrolka silnika'], przyczyny: ['Świeca lub cewka cylindra 1', 'Wtryskiwacz cylindra 1', 'Nieszczelność przy tym cylindrze', 'Niska kompresja'], coSprawdzic: ['Zamień cewkę i świecę z innym cylindrem', 'Zmierz kompresję cylindra 1'], pilnosc: 'wysoka', czesci: ['cewka zapłonowa', 'świece zapłonowe'] },
  { kod: 'P0302', nazwa: 'Wypadanie zapłonów – cylinder 2', opis: 'Sterownik wykrył brak prawidłowego spalania w cylindrze nr 2.', objawy: ['Szarpanie', 'Drgania', 'Kontrolka silnika'], przyczyny: ['Świeca lub cewka cylindra 2', 'Wtryskiwacz', 'Niska kompresja'], coSprawdzic: ['Zamień cewkę i świecę z innym cylindrem', 'Zmierz kompresję'], pilnosc: 'wysoka', czesci: ['cewka zapłonowa', 'świece zapłonowe'] },
  { kod: 'P0303', nazwa: 'Wypadanie zapłonów – cylinder 3', opis: 'Sterownik wykrył brak prawidłowego spalania w cylindrze nr 3.', objawy: ['Szarpanie', 'Drgania', 'Kontrolka silnika'], przyczyny: ['Świeca lub cewka cylindra 3', 'Wtryskiwacz', 'Niska kompresja'], coSprawdzic: ['Zamień cewkę i świecę z innym cylindrem', 'Zmierz kompresję'], pilnosc: 'wysoka', czesci: ['cewka zapłonowa', 'świece zapłonowe'] },
  { kod: 'P0304', nazwa: 'Wypadanie zapłonów – cylinder 4', opis: 'Sterownik wykrył brak prawidłowego spalania w cylindrze nr 4.', objawy: ['Szarpanie', 'Drgania', 'Kontrolka silnika'], przyczyny: ['Świeca lub cewka cylindra 4', 'Wtryskiwacz', 'Niska kompresja'], coSprawdzic: ['Zamień cewkę i świecę z innym cylindrem', 'Zmierz kompresję'], pilnosc: 'wysoka', czesci: ['cewka zapłonowa', 'świece zapłonowe'] },
  {
    kod: 'P0401',
    nazwa: 'Niewystarczający przepływ recyrkulacji spalin (EGR)',
    opis: 'Sterownik nie widzi spodziewanego efektu otwarcia zaworu EGR – przez układ płynie za mało spalin.',
    objawy: ['Kontrolka silnika', 'Często brak objawów', 'Czasem tryb awaryjny w dieslach'],
    przyczyny: ['Zawór EGR zapchany nagarem', 'Zapchane kanały lub chłodnica EGR', 'Uszkodzony zawór sterujący podciśnieniem', 'Nieszczelny przewód podciśnienia'],
    coSprawdzic: ['Sprawdź działanie zaworu EGR (diagnostyka elementów wykonawczych)', 'Oczyść zawór i kolektor z nagaru', 'Sprawdź przewody podciśnienia'],
    pilnosc: 'niska',
    czesci: ['zawór EGR', 'uszczelka zaworu EGR'],
    powiazania: [
      { slug: 'volkswagen-golf-iv', uwaga: 'zapchany zawór EGR w 1.9 TDI' },
      { slug: 'volkswagen-passat-b5', uwaga: 'zapchany zawór EGR w 1.9 TDI' },
      { slug: 'opel-vectra-c', uwaga: 'zawór EGR w 1.9 CDTI' }
    ]
  },
  { kod: 'P0400', nazwa: 'Usterka układu recyrkulacji spalin (EGR)', opis: 'Ogólny błąd przepływu w układzie EGR.', objawy: ['Kontrolka silnika', 'Nierówna praca', 'Spadek mocy'], przyczyny: ['Zawór EGR', 'Czujnik położenia zaworu', 'Przewody i elektrozawory'], coSprawdzic: ['Diagnostyka zaworu EGR', 'Oględziny przewodów'], pilnosc: 'niska', czesci: ['zawór EGR'] },
  { kod: 'P0402', nazwa: 'Zbyt duży przepływ recyrkulacji spalin (EGR)', opis: 'Zawór EGR jest otwarty, gdy nie powinien – do cylindrów trafia za dużo spalin.', objawy: ['Nierówna praca na wolnych obrotach', 'Gaśnięcie', 'Dym'], przyczyny: ['Zawór EGR zablokowany w pozycji otwartej', 'Uszkodzone sterowanie zaworem'], coSprawdzic: ['Sprawdź, czy zawór domyka się po zgaszeniu silnika'], pilnosc: 'średnia', czesci: ['zawór EGR'] },
  {
    kod: 'P0101',
    nazwa: 'Nieprawidłowy sygnał przepływomierza powietrza',
    opis: 'Odczyt przepływomierza nie pasuje do obrotów i obciążenia silnika.',
    objawy: ['Spadek mocy', 'Tryb awaryjny', 'Dymienie (diesle)', 'Większe spalanie'],
    przyczyny: ['Zużyty lub zabrudzony przepływomierz', 'Nieszczelność dolotu za przepływomierzem', 'Zapchany filtr powietrza'],
    coSprawdzic: ['Porównaj odczyt przepływomierza z wartością zadaną', 'Wymień filtr powietrza', 'Sprawdź węże dolotu i intercoolera'],
    pilnosc: 'średnia',
    czesci: ['przepływomierz', 'filtr powietrza'],
    powiazania: [
      { slug: 'volkswagen-golf-iv', uwaga: 'zużyty przepływomierz w 1.9 TDI' },
      { slug: 'volkswagen-passat-b5', uwaga: 'zużyty przepływomierz w 1.9 TDI' },
      { slug: 'audi-a4-b5', uwaga: 'zużyty przepływomierz w 1.9 TDI' },
      { slug: 'skoda-octavia-i', uwaga: 'zużyty przepływomierz w 1.9 TDI' }
    ]
  },
  { kod: 'P0100', nazwa: 'Usterka obwodu przepływomierza powietrza', opis: 'Brak sygnału albo sygnał poza zakresem w obwodzie przepływomierza.', objawy: ['Tryb awaryjny', 'Spadek mocy'], przyczyny: ['Uszkodzony przepływomierz', 'Przewody lub złącze'], coSprawdzic: ['Sprawdź zasilanie i masę czujnika', 'Oczyść złącze'], pilnosc: 'średnia', czesci: ['przepływomierz'] },
  {
    kod: 'P0299',
    nazwa: 'Zbyt niskie ciśnienie doładowania',
    opis: 'Turbosprężarka daje mniejsze ciśnienie, niż żąda sterownik.',
    objawy: ['Wyraźny spadek mocy', 'Tryb awaryjny', 'Świst lub syczenie spod maski'],
    przyczyny: ['Nieszczelny wąż intercoolera', 'Zacięte łopatki zmiennej geometrii turbiny', 'Uszkodzony zawór sterujący N75 lub przewody podciśnienia', 'Zużyta turbosprężarka'],
    coSprawdzic: ['Sprawdź szczelność węży doładowania', 'Porównaj ciśnienie zadane i rzeczywiste', 'Sprawdź ruch kierownicy łopatek'],
    pilnosc: 'średnia',
    czesci: ['wąż intercoolera', 'zawór N75', 'turbosprężarka'],
    powiazania: [
      { slug: 'volkswagen-passat-b5', uwaga: 'zawór N75 i zmienna geometria w 1.9 TDI' },
      { slug: 'ford-focus-ii', uwaga: 'turbosprężarka w 1.6 TDCi' }
    ]
  },
  { kod: 'P0234', nazwa: 'Zbyt wysokie ciśnienie doładowania', opis: 'Ciśnienie doładowania przekroczyło dopuszczalny poziom – sterownik ogranicza moc, żeby chronić silnik.', objawy: ['Szarpnięcie i nagły spadek mocy', 'Tryb awaryjny'], przyczyny: ['Zacięta zmienna geometria turbiny', 'Uszkodzony zawór sterujący', 'Uszkodzony czujnik ciśnienia doładowania'], coSprawdzic: ['Sprawdź czujnik MAP', 'Sprawdź ruch kierownicy łopatek'], pilnosc: 'średnia', czesci: ['czujnik ciśnienia doładowania', 'zawór N75'] },
  {
    kod: 'P2015',
    nazwa: 'Czujnik położenia klapek kolektora ssącego',
    opis: 'Sterownik nie potwierdza prawidłowego położenia klapek zawirowujących w kolektorze ssącym.',
    objawy: ['Kontrolka silnika', 'Spadek mocy', 'Tryb awaryjny'],
    przyczyny: ['Zapieczone klapki zawirowujące', 'Uszkodzony siłownik lub czujnik', 'Nagar w kolektorze'],
    coSprawdzic: ['Sprawdź ruch klapek', 'Oczyść kolektor', 'Sprawdź siłownik'],
    pilnosc: 'średnia',
    czesci: ['kolektor ssący', 'siłownik klapek kolektora'],
    powiazania: [{ slug: 'opel-vectra-c', uwaga: 'klapki kolektora w 1.9 CDTI' }]
  },
  {
    kod: 'P2002',
    nazwa: 'Niska sprawność filtra cząstek stałych (DPF)',
    opis: 'Różnica ciśnień przed i za filtrem DPF wskazuje, że filtr nie zatrzymuje sadzy albo jest uszkodzony.',
    objawy: ['Kontrolka silnika lub DPF', 'Dym z wydechu', 'Czasem brak objawów'],
    przyczyny: ['Pęknięty lub wycięty wkład DPF', 'Uszkodzony czujnik różnicy ciśnień', 'Nieszczelne przewody czujnika'],
    coSprawdzic: ['Sprawdź czujnik różnicy ciśnień i jego przewody', 'Oględziny wkładu DPF'],
    pilnosc: 'średnia',
    czesci: ['czujnik różnicy ciśnień DPF', 'filtr DPF']
  },
  {
    kod: 'P2463',
    nazwa: 'Nadmiar sadzy w filtrze cząstek stałych (DPF)',
    opis: 'Filtr DPF jest zapchany sadzą i nie zdążył się wypalić.',
    objawy: ['Kontrolka DPF', 'Spadek mocy', 'Tryb awaryjny', 'Częste włączanie wentylatora po zgaszeniu silnika'],
    przyczyny: ['Jazda głównie na krótkich odcinkach', 'Niesprawne wtryski lub EGR', 'Brak płynu FAP (niektóre auta PSA i Forda)', 'Uszkodzony czujnik'],
    coSprawdzic: ['Wypalanie serwisowe', 'Sprawdź wtryski i EGR', 'Sprawdź poziom dodatku do paliwa (jeśli jest)'],
    pilnosc: 'wysoka',
    czesci: ['filtr DPF', 'płyn do DPF']
  },
  {
    kod: 'P0087',
    nazwa: 'Zbyt niskie ciśnienie w listwie paliwowej',
    opis: 'Ciśnienie paliwa w listwie (common rail lub wtrysk bezpośredni) jest niższe niż wymagane.',
    objawy: ['Trudny rozruch', 'Spadek mocy', 'Gaśnięcie', 'Tryb awaryjny'],
    przyczyny: ['Zapchany filtr paliwa', 'Słaba pompa wstępna w zbiorniku', 'Zużyta pompa wysokiego ciśnienia', 'Nieszczelne wtryski (duże przelewy)', 'Zapowietrzony układ'],
    coSprawdzic: ['Wymień filtr paliwa', 'Zrób test przelewów wtryskiwaczy', 'Sprawdź ciśnienie na pompie wstępnej'],
    pilnosc: 'wysoka',
    czesci: ['filtr paliwa', 'pompa paliwa'],
    powiazania: [{ slug: 'ford-mondeo-mk3', uwaga: 'układ Delphi w 2.0 TDCi' }]
  },
  { kod: 'P0380', nazwa: 'Usterka obwodu świec żarowych', opis: 'Sterownik wykrył usterkę w obwodzie podgrzewania świec żarowych w dieslu.', objawy: ['Trudny rozruch na zimno', 'Dym po uruchomieniu', 'Migająca kontrolka świec'], przyczyny: ['Spalona świeca żarowa', 'Uszkodzony przekaźnik / sterownik świec', 'Przewody'], coSprawdzic: ['Zmierz rezystancję świec', 'Sprawdź przekaźnik świec'], pilnosc: 'średnia', czesci: ['świece żarowe', 'przekaźnik świec żarowych'] },
  {
    kod: 'P0016',
    nazwa: 'Korelacja położenia wału korbowego i wałka rozrządu',
    opis: 'Położenie wałka rozrządu nie zgadza się z położeniem wału korbowego – rozrząd jest „przesunięty”.',
    objawy: ['Kontrolka silnika', 'Grzechotanie po zimnym starcie', 'Nierówna praca', 'Trudny rozruch'],
    przyczyny: ['Rozciągnięty łańcuch rozrządu', 'Przeskoczony pasek', 'Uszkodzony napinacz', 'Usterka koła zmiennych faz rozrządu', 'Uszkodzony czujnik wałka'],
    coSprawdzic: ['Odczytaj odchyłkę faz rozrządu', 'Sprawdź stan łańcucha i napinacza', 'Nie jeździj długo – grozi uszkodzeniem silnika'],
    pilnosc: 'wysoka',
    czesci: ['zestaw łańcucha rozrządu', 'napinacz łańcucha'],
    powiazania: [
      { slug: 'opel-corsa-c', uwaga: 'rozciągnięty łańcuch w 1.0/1.2' },
      { slug: 'volkswagen-polo-iv', uwaga: 'rozciągnięty łańcuch w 1.2' },
      { slug: 'skoda-fabia-i', uwaga: 'łańcuch rozrządu w 1.2 HTP' }
    ]
  },
  {
    kod: 'P0011',
    nazwa: 'Wałek rozrządu (dolot) – położenie wyprzedzone za bardzo',
    opis: 'Układ zmiennych faz rozrządu nie ustawia wałka dolotowego tak, jak żąda sterownik.',
    objawy: ['Kontrolka silnika', 'Nierówna praca', 'Spadek mocy'],
    przyczyny: ['Za niski poziom lub zły olej', 'Uszkodzony elektrozawór zmiennych faz', 'Zużyte koło faz', 'Rozciągnięty łańcuch'],
    coSprawdzic: ['Sprawdź poziom i lepkość oleju', 'Sprawdź elektrozawór i jego sitko'],
    pilnosc: 'średnia',
    czesci: ['elektrozawór zmiennych faz rozrządu', 'olej silnikowy'],
    powiazania: [{ slug: 'ford-focus-ii', uwaga: 'zmienne fazy w 1.6 Ti-VCT' }]
  },
  {
    kod: 'P0335',
    nazwa: 'Usterka czujnika położenia wału korbowego',
    opis: 'Sterownik nie dostaje sygnału albo dostaje zły sygnał z czujnika wału korbowego.',
    objawy: ['Silnik gaśnie lub nie zapala', 'Brak obrotomierza', 'Problemy na ciepłym silniku'],
    przyczyny: ['Uszkodzony czujnik', 'Przewody lub złącze', 'Uszkodzone koło impulsowe'],
    coSprawdzic: ['Sprawdź sygnał czujnika oscyloskopem', 'Sprawdź przewody i złącze'],
    pilnosc: 'wysoka',
    czesci: ['czujnik położenia wału korbowego'],
    powiazania: [{ slug: 'nissan-micra', uwaga: 'czujniki położenia wałów w Micrze K12' }]
  },
  { kod: 'P0340', nazwa: 'Usterka czujnika położenia wałka rozrządu', opis: 'Brak lub zły sygnał z czujnika wałka rozrządu.', objawy: ['Trudny rozruch', 'Gaśnięcie', 'Tryb awaryjny'], przyczyny: ['Uszkodzony czujnik', 'Przewody', 'Problemy z rozrządem'], coSprawdzic: ['Sprawdź czujnik i przewody', 'Sprawdź ustawienie rozrządu'], pilnosc: 'wysoka', czesci: ['czujnik położenia wałka rozrządu'] },
  {
    kod: 'P0128',
    nazwa: 'Silnik nie osiąga temperatury roboczej',
    opis: 'Płyn chłodzący nagrzewa się za wolno – zwykle termostat jest stale otwarty.',
    objawy: ['Wskaźnik temperatury nisko', 'Słabe ogrzewanie zimą', 'Większe spalanie'],
    przyczyny: ['Uszkodzony termostat', 'Uszkodzony czujnik temperatury płynu'],
    coSprawdzic: ['Sprawdź temperaturę płynu w trakcie jazdy', 'Wymień termostat'],
    pilnosc: 'niska',
    czesci: ['termostat', 'czujnik temperatury płynu chłodniczego'],
    powiazania: [
      { slug: 'opel-astra-g', uwaga: 'termostat w silnikach 16V' },
      { slug: 'opel-vectra-b', uwaga: 'termostat w silnikach 16V' }
    ]
  },
  { kod: 'P0117', nazwa: 'Niski sygnał czujnika temperatury płynu chłodzącego', opis: 'Czujnik pokazuje nierealnie wysoką temperaturę (zwarcie w obwodzie).', objawy: ['Wentylator pracuje stale', 'Trudny rozruch'], przyczyny: ['Uszkodzony czujnik', 'Zwarcie w przewodach'], coSprawdzic: ['Zmierz rezystancję czujnika'], pilnosc: 'średnia', czesci: ['czujnik temperatury płynu chłodniczego'] },
  { kod: 'P0118', nazwa: 'Wysoki sygnał czujnika temperatury płynu chłodzącego', opis: 'Czujnik pokazuje nierealnie niską temperaturę (przerwa w obwodzie).', objawy: ['Wentylator pracuje stale', 'Większe spalanie', 'Trudny rozruch na ciepłym'], przyczyny: ['Uszkodzony czujnik', 'Przerwany przewód lub złącze'], coSprawdzic: ['Sprawdź złącze czujnika'], pilnosc: 'średnia', czesci: ['czujnik temperatury płynu chłodniczego'] },
  { kod: 'P0130', nazwa: 'Usterka obwodu sondy lambda (rząd 1, czujnik 1)', opis: 'Sonda lambda przed katalizatorem daje niewłaściwy sygnał.', objawy: ['Kontrolka silnika', 'Większe spalanie', 'Nierówna praca'], przyczyny: ['Zużyta sonda', 'Przewody', 'Nieszczelny wydech'], coSprawdzic: ['Sprawdź wykres sondy', 'Sprawdź przewody'], pilnosc: 'średnia', czesci: ['sonda lambda'] },
  { kod: 'P0135', nazwa: 'Usterka podgrzewania sondy lambda (rząd 1, czujnik 1)', opis: 'Grzałka sondy lambda nie działa – sonda za długo się nagrzewa.', objawy: ['Kontrolka silnika', 'Większe spalanie po rozruchu'], przyczyny: ['Spalona grzałka sondy', 'Bezpiecznik lub przekaźnik', 'Przewody'], coSprawdzic: ['Zmierz rezystancję grzałki', 'Sprawdź bezpiecznik'], pilnosc: 'niska', czesci: ['sonda lambda'] },
  { kod: 'P0141', nazwa: 'Usterka podgrzewania sondy lambda (rząd 1, czujnik 2)', opis: 'Grzałka sondy lambda za katalizatorem nie działa.', objawy: ['Kontrolka silnika'], przyczyny: ['Spalona grzałka sondy', 'Przewody'], coSprawdzic: ['Zmierz rezystancję grzałki'], pilnosc: 'niska', czesci: ['sonda lambda'] },
  { kod: 'P0442', nazwa: 'Mała nieszczelność układu odparowania paliwa (EVAP)', opis: 'Wykryto niewielki wyciek oparów paliwa z układu zbiornika i pochłaniacza.', objawy: ['Kontrolka silnika', 'Czasem zapach benzyny'], przyczyny: ['Nieszczelny korek wlewu', 'Pęknięty wąż oparów', 'Uszkodzony zawór pochłaniacza'], coSprawdzic: ['Sprawdź uszczelkę korka wlewu', 'Test dymny układu EVAP'], pilnosc: 'niska', czesci: ['korek wlewu paliwa', 'zawór pochłaniacza par paliwa'] },
  { kod: 'P0455', nazwa: 'Duża nieszczelność układu odparowania paliwa (EVAP)', opis: 'Wykryto duży wyciek oparów paliwa – najczęściej brak lub luźny korek wlewu.', objawy: ['Kontrolka silnika', 'Zapach benzyny'], przyczyny: ['Niedokręcony lub brak korka wlewu', 'Odłączony wąż', 'Zawór pochłaniacza'], coSprawdzic: ['Dokręć korek i skasuj błąd', 'Sprawdź węże'], pilnosc: 'niska', czesci: ['korek wlewu paliwa'] },
  { kod: 'P0480', nazwa: 'Usterka obwodu wentylatora chłodnicy', opis: 'Sterownik wykrył usterkę w sterowaniu wentylatorem chłodnicy.', objawy: ['Przegrzewanie w korku', 'Wentylator nie działa lub działa stale'], przyczyny: ['Uszkodzony wentylator', 'Rezystor lub moduł wentylatora', 'Przekaźnik, bezpiecznik'], coSprawdzic: ['Sprawdź zasilanie wentylatora', 'Sprawdź przekaźnik i rezystor'], pilnosc: 'wysoka', czesci: ['wentylator chłodnicy', 'rezystor wentylatora'] },
  { kod: 'P0500', nazwa: 'Usterka czujnika prędkości pojazdu', opis: 'Brak sygnału prędkości pojazdu.', objawy: ['Nie działa prędkościomierz', 'Problemy ze zmianą biegów w automacie', 'Kontrolka ABS'], przyczyny: ['Uszkodzony czujnik prędkości lub ABS', 'Przewody'], coSprawdzic: ['Sprawdź czujnik i przewody'], pilnosc: 'średnia', czesci: ['czujnik prędkości'] },
  { kod: 'P0560', nazwa: 'Usterka napięcia instalacji', opis: 'Napięcie w instalacji elektrycznej jest poza normą.', objawy: ['Problemy z rozruchem', 'Migające kontrolki', 'Losowe błędy innych systemów'], przyczyny: ['Słaby akumulator', 'Uszkodzony alternator lub regulator', 'Złe połączenia masy'], coSprawdzic: ['Zmierz napięcie ładowania (ok. 13,8–14,5 V)', 'Sprawdź akumulator i klemy'], pilnosc: 'średnia', czesci: ['akumulator', 'alternator'] },
  { kod: 'P0606', nazwa: 'Usterka procesora sterownika silnika', opis: 'Sterownik silnika wykrył błąd wewnętrzny.', objawy: ['Różne – od braku objawów po gaśnięcie silnika'], przyczyny: ['Uszkodzony sterownik', 'Problemy z zasilaniem lub masą', 'Nieudana modyfikacja oprogramowania'], coSprawdzic: ['Najpierw sprawdź zasilanie i masy', 'Aktualizacja / naprawa sterownika w specjalistycznym serwisie'], pilnosc: 'wysoka', czesci: ['sterownik silnika'] },
  { kod: 'P0700', nazwa: 'Usterka układu sterowania skrzynią biegów', opis: 'Sterownik automatycznej skrzyni zgłosił błąd – szczegółowy kod jest zapisany w sterowniku skrzyni.', objawy: ['Kontrolka silnika', 'Tryb awaryjny skrzyni (jeden bieg)', 'Szarpanie przy zmianie biegów'], przyczyny: ['Zależą od kodu w sterowniku skrzyni', 'Niski poziom lub zużyty olej', 'Mechatronika, czujniki'], coSprawdzic: ['Odczytaj błędy ze sterownika skrzyni', 'Sprawdź poziom i stan oleju'], pilnosc: 'wysoka', czesci: ['olej do skrzyni automatycznej'] }
];

export const kodPoSlugu = (s: string) => KODY.find((k) => k.kod.toLowerCase() === s.toLowerCase());

/** Kody powiązane z kartą (lub z kartą zbiorczą tego modelu) */
export function kodyDlaKarty(slug: string, rodzic?: string) {
  return KODY.flatMap((k) =>
    (k.powiazania || []).filter((p) => p.slug === slug || (rodzic && p.slug === rodzic)).map((p) => ({ kod: k, uwaga: p.uwaga }))
  );
}
