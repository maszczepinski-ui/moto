// Wersje językowe strony. Polski jest podstawowy (adresy bez przedrostka),
// ukraiński i angielski mają osobne adresy: /uk/… i /en/…
// Tłumaczymy tylko wybrane strony – te, które przydają się obcokrajowcom w Polsce.

export type JezykObcy = 'uk' | 'en';
export type Jezyk = 'pl' | JezykObcy;

export const JEZYKI_OBCE: JezykObcy[] = ['uk', 'en'];

export const META: Record<Jezyk, { nazwa: string; krotko: string; locale: string; hreflang: string; data: string }> = {
  pl: { nazwa: 'Polski', krotko: 'PL', locale: 'pl_PL', hreflang: 'pl', data: 'pl-PL' },
  uk: { nazwa: 'Українська', krotko: 'UA', locale: 'uk_UA', hreflang: 'uk', data: 'uk-UA' },
  en: { nazwa: 'English', krotko: 'EN', locale: 'en_GB', hreflang: 'en', data: 'en-GB' }
};

/** Adres listy poradników w danym języku */
export const PORADNIKI_ADRES: Record<Jezyk, string> = { pl: '/poradniki/', uk: '/uk/poradnyky/', en: '/en/guides/' };

export type Slownik = {
  skok: string;
  stronaGlowna: string;
  menu: { poradniki: string; vin: string; oc: string; polski: string };
  hasloStrony: string;
  stopka: { onas: string; zrodla: string; prywatnosc: string; cookies: string; partnerzy: string; wydawca: string };
  zgoda: { tekst: string; szczegoly: string; nie: string; tak: string };
  poradnik: {
    wSkrocie: string;
    aktualizacja: string;
    minut: (n: number) => string;
    spis: string;
    uwaga: string;
    dobrzeWiedziec: string;
    pytania: string;
    zrodla: string;
    zrodlaPoPolsku: string;
    jakPowstal: string;
    jakPowstalTekst: string;
    zastrzezenie: string;
    czytajDalej: string;
    czytaj: string;
    poPolsku: string;
    wersjaPolska: string;
    wzorTytul: string;
    wzorTekst: string;
    wzorPrzycisk: string;
  };
  lista: { tytul: string; opis: string; seoTytul: string; seoOpis: string };
  glowna: {
    seoTytul: string;
    seoOpis: string;
    naglowek: string;
    naglowekAkcent: string;
    wstep: string;
    poradnikiTytul: string;
    wszystkie: string;
    narzedziaTytul: string;
    narzedziaOpis: string;
    vinTytul: string;
    vinOpis: string;
    ocTytul: string;
    ocOpis: string;
    poPolskuNarzedzie: string;
  };
  podpowiedz: { tekst: string; przejdz: string; zamknij: string };
  blad404: { tytul: string; tekst: string; wroc: string };
};

export const SLOWNIK: Record<JezykObcy, Slownik> = {
  uk: {
    skok: 'Перейти до змісту',
    stronaGlowna: 'Головна',
    menu: { poradniki: 'Поради', vin: 'Перевірка VIN', oc: 'Страхування OC', polski: 'Польська версія' },
    hasloStrony: 'Авто в Польщі – просто і зрозуміло',
    stopka: {
      onas: 'Сайт про автомобілі в Польщі: офіційні дані, поради та інструменти. Повна версія сайту – польською мовою.',
      zrodla: 'Звідки дані (PL)',
      prywatnosc: 'Конфіденційність (PL)',
      cookies: 'Налаштування cookies',
      partnerzy:
        'Деякі посилання на сайті є партнерськими – якщо ви ними скористаєтеся, ми можемо отримати комісію. Ви не платите більше.',
      wydawca: 'Видавець'
    },
    zgoda: {
      tekst: 'Чи погоджуєтеся ви на файли cookies Google Analytics? Вони допомагають нам зрозуміти, які частини сайту корисні. Без згоди сайт працює так само.',
      szczegoly: 'Деталі (PL)',
      nie: 'Відхиляю',
      tak: 'Приймаю'
    },
    poradnik: {
      wSkrocie: 'Коротко',
      aktualizacja: 'Оновлено',
      minut: (n) => `${n} хв читання`,
      spis: 'Зміст',
      uwaga: 'Увага',
      dobrzeWiedziec: 'Корисно знати',
      pytania: 'Часті запитання',
      zrodla: 'Джерела',
      zrodlaPoPolsku: 'Офіційні джерела – польською мовою.',
      jakPowstal: 'Як підготовлено цю пораду',
      jakPowstalTekst:
        'Порада – це переклад і адаптація польської версії, яку підготував автор сайту на основі законів і офіційних джерел. Написано простими словами – для водіїв, а не юристів.',
      zastrzezenie: 'Це інформація, а не юридична консультація. У нетиповій ситуації запитайте в установі, у страховика або в юриста.',
      czytajDalej: 'Читати далі',
      czytaj: 'Читати',
      poPolsku: 'польською',
      wersjaPolska: 'Польська версія цієї сторінки',
      wzorTytul: 'Зразок для друку – польською мовою',
      wzorTekst:
        'Документ, який ви подаєте в Польщі (наприклад, в управлінні транспорту чи страховику), має бути польською мовою – інакше знадобиться присяжний переклад. Тому зразок для заповнення та друку доступний на польській сторінці.',
      wzorPrzycisk: 'Відкрити зразок (польською)'
    },
    lista: {
      tytul: 'Поради для водіїв у Польщі',
      opis: 'Купівля авто, реєстрація, страхування OC, ДТП і перевірка поліцією – польські правила, пояснені українською.',
      seoTytul: 'Авто в Польщі – поради українською',
      seoOpis: 'Як купити і зареєструвати авто в Польщі, скільки коштує OC, що робити після ДТП і під час перевірки поліцією. Польські правила простою мовою.'
    },
    glowna: {
      seoTytul: 'Авто в Польщі – поради українською',
      seoOpis:
        'Купівля і реєстрація авто в Польщі, страхування OC, ДТП, техогляд і перевірка поліцією. Польські правила простою українською мовою.',
      naglowek: 'Авто в Польщі –',
      naglowekAkcent: 'без зайвого стресу.',
      wstep:
        'Купуєте, реєструєте чи страхуєте авто в Польщі? Тут – польські правила, терміни та штрафи, пояснені простою українською мовою.',
      poradnikiTytul: 'Найважливіші поради',
      wszystkie: 'Усі поради',
      narzedziaTytul: 'Корисні інструменти',
      narzedziaOpis: 'Інструменти поки що працюють польською мовою – ми поступово їх перекладаємо.',
      vinTytul: 'Перевірка авто за VIN',
      vinOpis: 'Пробіг, пошкодження та історія авто – перед купівлею.',
      ocTytul: 'Порівняння цін OC',
      ocOpis: 'Обов’язкове страхування авто в Польщі – пропозиції багатьох страховиків.',
      poPolskuNarzedzie: 'польською'
    },
    podpowiedz: { tekst: 'Ця сторінка є українською мовою.', przejdz: 'Перейти', zamknij: 'Закрити' },
    blad404: { tytul: 'Сторінку не знайдено', tekst: 'Можливо, адреса змінилася або сторінки ще немає українською.', wroc: 'На головну' }
  },
  en: {
    skok: 'Skip to content',
    stronaGlowna: 'Home',
    menu: { poradniki: 'Guides', vin: 'VIN check', oc: 'Car insurance (OC)', polski: 'Polish version' },
    hasloStrony: 'Driving in Poland, made simple',
    stopka: {
      onas: 'A website about cars in Poland: official data, guides and tools. The full website is in Polish.',
      zrodla: 'Where our data comes from (PL)',
      prywatnosc: 'Privacy policy (PL)',
      cookies: 'Cookie settings',
      partnerzy: 'Some links on this site are affiliate links – if you use them, we may earn a commission. You don’t pay more.',
      wydawca: 'Publisher'
    },
    zgoda: {
      tekst: 'Do you agree to Google Analytics cookies? They help us see which parts of the site are useful. Without consent the site works the same.',
      szczegoly: 'Details (PL)',
      nie: 'Decline',
      tak: 'Accept'
    },
    poradnik: {
      wSkrocie: 'In short',
      aktualizacja: 'Updated',
      minut: (n) => `${n} min read`,
      spis: 'Contents',
      uwaga: 'Important',
      dobrzeWiedziec: 'Good to know',
      pytania: 'Frequently asked questions',
      zrodla: 'Sources',
      zrodlaPoPolsku: 'Official sources are in Polish.',
      jakPowstal: 'How this guide was made',
      jakPowstalTekst:
        'This guide is a translation and adaptation of the Polish version, written by the site’s author from Polish law and official sources. Plain language – for drivers, not lawyers.',
      zastrzezenie: 'This is information, not legal advice. In an unusual case, ask the office, your insurer or a lawyer.',
      czytajDalej: 'Read next',
      czytaj: 'Read',
      poPolsku: 'in Polish',
      wersjaPolska: 'Polish version of this page',
      wzorTytul: 'Printable template – in Polish',
      wzorTekst:
        'Documents you submit in Poland (e.g. at the vehicle registration office or to an insurer) should be in Polish – otherwise you need a sworn translation. That’s why the fill-in and print template is on the Polish page.',
      wzorPrzycisk: 'Open the template (Polish)'
    },
    lista: {
      tytul: 'Guides for drivers in Poland',
      opis: 'Buying and registering a car, OC insurance, accidents and police checks – Polish rules explained in plain English.',
      seoTytul: 'Car in Poland – guides in English',
      seoOpis: 'How to buy and register a car in Poland, what OC insurance costs, what to do after a collision and during a police check. Polish rules in plain English.'
    },
    glowna: {
      seoTytul: 'Car in Poland – guides in English',
      seoOpis: 'Buying and registering a car in Poland, OC insurance, collisions, roadworthiness tests and police checks. Polish rules explained in plain English.',
      naglowek: 'Your car in Poland –',
      naglowekAkcent: 'without the stress.',
      wstep: 'Buying, registering or insuring a car in Poland? Here are the Polish rules, deadlines and fines, explained in plain English.',
      poradnikiTytul: 'Most important guides',
      wszystkie: 'All guides',
      narzedziaTytul: 'Useful tools',
      narzedziaOpis: 'Our tools are in Polish for now – we are translating them step by step.',
      vinTytul: 'Check a car by VIN',
      vinOpis: 'Mileage, damage and history – before you buy.',
      ocTytul: 'Compare OC prices',
      ocOpis: 'Mandatory car insurance in Poland – offers from many insurers.',
      poPolskuNarzedzie: 'in Polish'
    },
    podpowiedz: { tekst: 'This page is available in English.', przejdz: 'Go', zamknij: 'Close' },
    blad404: { tytul: 'Page not found', tekst: 'The address may have changed, or the page isn’t available in English yet.', wroc: 'Go to home page' }
  }
};
