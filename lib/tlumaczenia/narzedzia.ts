// Teksty przetłumaczonych narzędzi: mandaty, sprawdzanie VIN, porównanie OC (wersje /uk/ i /en/).
// Kwoty mandatów i punkty są w lib/mandaty.ts, kary za brak OC – tu w tekście (aktualizuj razem z polską stroną).
import type { JezykObcy } from '@/lib/jezyki';
import type { TekstyVin } from '@/components/VinWidget';

type Faq = { q: string; a: string }[];

export const ADRESY_NARZEDZI: Record<'mandaty' | 'vin' | 'oc', Record<'pl' | JezykObcy, string>> = {
  mandaty: { pl: '/mandaty/', uk: '/uk/shtrafy/', en: '/en/traffic-fines/' },
  vin: { pl: '/sprawdz-vin/', uk: '/uk/perevirka-vin/', en: '/en/vin-check/' },
  oc: { pl: '/ubezpieczenie-oc/', uk: '/uk/strakhuvannia-oc/', en: '/en/car-insurance/' }
};

export type TekstyNarzedzi = {
  mandaty: {
    seoTytul: string;
    seoOpis: string;
    nazwa: string;
    nadtytul: string;
    tytul: string;
    opis: string;
    tabelaPredkosc: string;
    tabelaInne: string;
    obcokrajowcyTytul: string;
    obcokrajowcy: { t: string; o: string }[];
    pytania: string;
    faq: Faq;
    fotoradary: string;
    fotoradaryOpis: string;
  };
  vin: {
    seoTytul: string;
    seoOpis: string;
    nazwa: string;
    tytul: string;
    wstep: string;
    boksEtykieta: string;
    boksTytul: string;
    boksOpis: string;
    raport: string[];
    gdzieKrotko: string;
    przycisk: string;
    linkPartnerski: string;
    widget: TekstyVin;
    darmoEtykieta: string;
    darmoTytul: string;
    darmoOpis: string;
    darmoLink: string;
    gdzieTytul: string;
    gdzie: { t: string; o: string }[];
    gdzieUwaga: string;
    raportTytul: string;
    raportLista: string[];
    poradnik: string;
  };
  oc: {
    seoTytul: string;
    seoOpis: string;
    nazwa: string;
    etykieta: string;
    tytul: string;
    wstep: string;
    przyciskOc: string;
    przyciskAc: string;
    partnerski: string;
    karty: { t: string; o: string }[];
    pesel: string;
    brakTytul: string;
    brakTekst: string;
    pytania: string;
    faq: Faq;
    dolTytul: string;
    dolOpis: string;
    zastrzezenie: string;
    poradnik: string;
  };
};

export const NARZEDZIA: Record<JezykObcy, TekstyNarzedzi> = {
  uk: {
    mandaty: {
      seoTytul: 'Штрафи ПДР у Польщі 2026 – калькулятор',
      seoOpis: 'Скільки коштує перевищення швидкості в Польщі і скільки штрафних балів ви отримаєте. Калькулятор штрафу і балів, таблиця штрафів та правила для іноземних водіїв.',
      nazwa: 'Штрафи і бали',
      nadtytul: 'Правила дорожнього руху',
      tytul: 'Штрафи і штрафні бали в Польщі',
      opis: 'Скільки коштує перевищення швидкості, скільки балів залишилося до ліміту і коли поліція затримує посвідчення водія.',
      tabelaPredkosc: 'Таблиця штрафів: перевищення швидкості',
      tabelaInne: 'Інші часті порушення',
      obcokrajowcyTytul: 'Якщо у вас іноземне посвідчення або немає адреси в Польщі',
      obcokrajowcy: [
        {
          t: 'Штраф платите одразу',
          o: 'Якщо ви тимчасово перебуваєте в Польщі або не маєте тут постійного місця проживання, поліцейський може накласти штраф, який сплачується одразу на місці – готівкою або карткою, якщо в нього є термінал (ст. 98 польського Кодексу у справах про правопорушення).'
        },
        {
          t: 'Бали зараховуються і з іноземним посвідченням',
          o: 'Штрафні бали водіїв з іноземним посвідченням фіксуються в Польщі, а перевищення ліміту має такі самі наслідки, як для поляків. За межами Польщі ці бали не діють.'
        },
        {
          t: 'Затримане іноземне посвідчення',
          o: 'Якщо поліція затримає посвідчення, видане в іншій країні, а ви не проживаєте в Польщі, документ передають старості, а той – органу країни, яка його видала.'
        }
      ],
      pytania: 'Часті запитання',
      faq: [
        { q: 'Коли зникають штрафні бали?', a: 'Через рік після сплати штрафу. Якщо справа потрапила до суду – через рік після набрання рішенням законної сили.' },
        {
          q: 'За що затримують посвідчення водія?',
          a: 'За перевищення швидкості більш ніж на 50 км/год у населеному пункті, а з 3 березня 2026 р. – також поза населеним пунктом на дорозі з однією проїжджою частиною і двостороннім рухом. Посвідчення затримують на 3 місяці.'
        },
        { q: 'Що таке повторне порушення (recydywa)?', a: 'Якщо протягом 2 років ви повторно вчините те саме серйозне порушення (наприклад, перевищення більш ніж на 30 км/год або ненадання переваги пішоходу), штраф подвоюється. Кількість балів не змінюється.' },
        { q: 'Який ліміт штрафних балів?', a: '24 бали для водіїв зі стажем понад рік і 20 балів у перший рік після отримання посвідчення.' }
      ],
      fotoradary: 'Фоторадари на мапі',
      fotoradaryOpis: 'Де стоять камери і ділянки середньої швидкості (сторінка польською).'
    },
    vin: {
      seoTytul: 'Перевірка авто за VIN у Польщі',
      seoOpis: 'Де знайти VIN, як безкоштовно перевірити авто, зареєстроване в Польщі, і коли варто купити повний звіт з іноземних баз: пробіг, пошкодження, фото.',
      nazwa: 'Перевірка VIN',
      tytul: 'Перевірка авто за номером VIN',
      wstep: 'Перш ніж їхати оглядати авто, попросіть у продавця номер VIN. За кілька хвилин дізнаєтеся, чи справжній пробіг, чи були пошкодження і як авто виглядало раніше. Чесний продавець без проблем дасть номер.',
      boksEtykieta: 'Повна перевірка авто',
      boksTytul: 'Звіт carVertical',
      boksOpis: 'Один звіт з баз багатьох країн – особливо важливо для авто, ввезеного з-за кордону. Містить, зокрема:',
      raport: ['історію пробігу і скручені лічильники', 'історію пошкоджень і вартість ремонтів', 'фото авто з минулого', 'ринкову ціну', 'специфікацію і комплектацію', 'оцінки безпеки'],
      gdzieKrotko: 'VIN є у свідоцтві про реєстрацію (поле E) і під лобовим склом – попросіть продавця надіслати фото.',
      przycisk: 'Перевірити авто в carVertical',
      linkPartnerski: 'партнерське посилання – carVertical',
      widget: {
        etykieta: 'Номер VIN',
        zVinem: 'Введіть VIN (17 символів)',
        bezVinu: 'Введіть VIN (необов’язково)',
        blad: 'VIN має 17 символів (без літер I, O, Q).',
        skopiowano: 'Ми скопіювали VIN – вставте його на сайті {partner} (Ctrl+V або утримайте палець і «Вставити»).',
        rabatTytul: 'Знижка вже в посиланні',
        rabatOpis: 'нараховується сама, без коду',
        partnera: 'партнера'
      },
      darmoEtykieta: 'Безкоштовно',
      darmoTytul: 'Historia Pojazdu (gov.pl)',
      darmoOpis:
        'Для авто, зареєстрованих у Польщі: пробіги з техоглядів, чинність OC і огляду. Потрібні VIN, реєстраційний номер і дата першої реєстрації. Сайт польською мовою і не покаже історії до ввезення авто в Польщу – для цього є звіт з іноземних баз.',
      darmoLink: 'Відкрити historiapojazdu.gov.pl',
      gdzieTytul: 'Де знайти номер VIN',
      gdzie: [
        { t: 'Свідоцтво про реєстрацію', o: 'Поле E – 17 символів (літери і цифри, без I, O і Q).' },
        { t: 'Під лобовим склом', o: 'Табличка, видна ззовні, зазвичай з боку водія.' },
        { t: 'На кузові', o: 'Заводська табличка і номер, вибитий на кузові – зазвичай у моторному відсіку або під сидінням.' }
      ],
      gdzieUwaga: 'Усі три номери мають бути однакові. Якщо вони відрізняються або табличка виглядає так, ніби її знімали, – відмовтеся від купівлі.',
      raportTytul: 'На що дивитися у звіті',
      raportLista: [
        'Чи наступні показники пробігу зростають – падіння або велика прогалина в історії є тривожним сигналом.',
        'Пошкодження і їхня вартість – дрібне зіткнення відрізняється від ремонту за десятки тисяч.',
        'Фото з оголошень і аукціонів – чи не продавали авто як пошкоджене.',
        'Країни, де авто було зареєстроване, і кількість власників.',
        'Відповідність версії, двигуна і комплектації тому, що в оголошенні.'
      ],
      poradnik: 'Купив авто в Польщі – що далі? Податок, реєстрація, OC'
    },
    oc: {
      seoTytul: 'Страхування OC у Польщі – порівняння цін',
      seoOpis: 'Порівняйте ціни обов’язкового страхування OC і AC у Польщі. Що підготувати до калькулятора, коли змінити страховика і скільки коштує відсутність OC.',
      nazwa: 'Страхування OC',
      etykieta: 'Страхування авто',
      tytul: 'Порівняйте ціни OC і AC у Польщі',
      wstep: 'OC – обов’язкове страхування цивільної відповідальності для кожного авто, зареєстрованого в Польщі. Той самий поліс для того самого авто може відрізнятися ціною на кілька сотень злотих – порівняйте пропозиції багатьох страховиків одночасно.',
      przyciskOc: 'Порівняти ціни OC',
      przyciskAc: 'OC + AC',
      partnerski: 'партнерське посилання · калькулятор польською мовою',
      karty: [
        { t: 'Підготуйте дані', o: 'Свідоцтво про реєстрацію, PESEL власника і дату отримання посвідчення водія. З ними калькулятор заповните за кілька хвилин.' },
        { t: 'Порівнюйте до кінця поліса', o: 'Найкраще за 2–3 тижні до терміну. Розірвання старого поліса має надійти страховику найпізніше за день до його закінчення.' },
        { t: 'Дивіться не лише на ціну', o: 'Порівняйте суми, assistance, підмінне авто і франшизу в AC. Найдешевша пропозиція не завжди найкраща.' }
      ],
      pesel: 'Онлайн-калькулятор зазвичай просить номер PESEL. Якщо у вас його немає, зверніться напряму до страховика або страхового агента – поліс OC можна оформити і без PESEL, але не завжди онлайн.',
      brakTytul: 'Не залишайтеся без OC жодного дня',
      brakTekst: 'За легкове авто без OC Страховий гарантійний фонд (UFG) нараховує у 2026 р.: 1920 zł за 1–3 дні перерви, 4810 zł за 4–14 днів і 9610 zł за понад 14 днів. Новий поліс купіть так, щоб він починався наступного дня після закінчення старого.',
      pytania: 'Часті запитання про OC',
      faq: [
        {
          q: 'Чи поліс OC продовжується автоматично?',
          a: 'Так. Якщо не розірвати його найпізніше за день до кінця строку, OC продовжиться на наступні 12 місяців – часто за вищою ціною. Виняток – поліс, отриманий разом з купленим авто: він сам не продовжується.'
        },
        { q: 'Що потрібно для калькулятора OC?', a: 'Свідоцтво про реєстрацію авто (дані авто), PESEL власника і дата отримання посвідчення водія. Корисна також інформація про історію збитків з попередніх полісів.' },
        { q: 'Скільки коштує відсутність OC?', a: 'За легкове авто UFG нараховує у 2026 р.: 1920 zł за 1–3 дні перерви, 4810 zł за 4–14 днів і 9610 zł за понад 14 днів без OC.' },
        { q: 'Чи діє в Польщі моє українське страхування?', a: 'Для авто з українськими номерами потрібна чинна Зелена карта. Після реєстрації авто в Польщі потрібен польський поліс OC – найпізніше в день реєстрації.' }
      ],
      dolTytul: 'Перевірте, скільки ви заплатите за OC цього року',
      dolOpis: 'Порівняння безкоштовне і ні до чого не зобов’язує.',
      zastrzezenie: 'Довідкова інформація. MotoRaport не є страховим посередником і не радить у виборі поліса – договір ви укладаєте напряму зі страховиком.',
      poradnik: 'Скільки коштує OC і від чого залежить ціна'
    }
  },
  en: {
    mandaty: {
      seoTytul: 'Traffic fines in Poland 2026 – calculator',
      seoOpis: 'How much speeding costs in Poland and how many penalty points you get. Fine and points calculator, table of fines and rules for foreign drivers.',
      nazwa: 'Fines and points',
      nadtytul: 'Traffic rules',
      tytul: 'Traffic fines and penalty points in Poland',
      opis: 'How much speeding costs, how many points you have left before the limit, and when the police retain your driving licence.',
      tabelaPredkosc: 'Table of fines: speeding',
      tabelaInne: 'Other common offences',
      obcokrajowcyTytul: 'If you have a foreign licence or no address in Poland',
      obcokrajowcy: [
        {
          t: 'You pay the fine on the spot',
          o: 'If you are staying in Poland temporarily or have no permanent residence here, the officer can issue a fine that you pay immediately – in cash, or by card if the officer has a terminal (Art. 98 of the Polish Code of Procedure for Petty Offences).'
        },
        {
          t: 'Points count with a foreign licence too',
          o: 'Penalty points of drivers with a foreign licence are recorded in Poland, and exceeding the limit has the same consequences as for Polish drivers. The points don’t apply outside Poland.'
        },
        {
          t: 'A retained foreign licence',
          o: 'If the police retain a licence issued in another country and you don’t live in Poland, the document goes to the county office (starosta), which sends it to the authority of the issuing country.'
        }
      ],
      pytania: 'Frequently asked questions',
      faq: [
        { q: 'When do penalty points expire?', a: 'One year after the fine is paid. If the case went to court – one year after the judgment became final.' },
        {
          q: 'When is a driving licence retained?',
          a: 'For speeding by more than 50 km/h in a built-up area, and since 3 March 2026 also outside built-up areas on single-carriageway two-way roads. The licence is retained for 3 months.'
        },
        { q: 'What is a repeat offence (recydywa)?', a: 'If within 2 years you commit the same serious offence again (e.g. speeding by more than 30 km/h or failing to give way to a pedestrian), the fine is doubled. The number of points stays the same.' },
        { q: 'What is the penalty points limit?', a: '24 points for drivers who have had their licence for more than a year, and 20 points in the first year after getting it.' }
      ],
      fotoradary: 'Speed cameras on a map',
      fotoradaryOpis: 'Where cameras and average-speed zones are (page in Polish).'
    },
    vin: {
      seoTytul: 'VIN check in Poland – car history report',
      seoOpis: 'Where to find the VIN, how to check a car registered in Poland for free, and when a full report from foreign databases is worth it: mileage, damage, photos.',
      nazwa: 'VIN check',
      tytul: 'Check a car by its VIN',
      wstep: 'Before you go to see a car, ask the seller for the VIN. In a few minutes you’ll know whether the mileage is real, whether the car was damaged and what it looked like before. An honest seller has no problem giving you the number.',
      boksEtykieta: 'Complete car check',
      boksTytul: 'carVertical report',
      boksOpis: 'One report from databases in many countries – especially important for an imported car. It includes, among other things:',
      raport: ['mileage history and rolled-back odometers', 'damage history and repair costs', 'photos of the car from the past', 'market price', 'specification and equipment', 'safety ratings'],
      gdzieKrotko: 'The VIN is in the registration certificate (field E) and under the windscreen – ask the seller for a photo.',
      przycisk: 'Check the car in carVertical',
      linkPartnerski: 'affiliate link – carVertical',
      widget: {
        etykieta: 'VIN number',
        zVinem: 'Enter VIN (17 characters)',
        bezVinu: 'Enter VIN (optional)',
        blad: 'A VIN has 17 characters (no letters I, O, Q).',
        skopiowano: 'We copied the VIN – paste it on the {partner} website (Ctrl+V or long-press and “Paste”).',
        rabatTytul: 'Discount already in the link',
        rabatOpis: 'applied automatically, no code needed',
        partnera: 'partner'
      },
      darmoEtykieta: 'Free',
      darmoTytul: 'Historia Pojazdu (gov.pl)',
      darmoOpis:
        'For cars registered in Poland: mileage from roadworthiness tests, OC and test validity. You need the VIN, the registration number and the date of first registration. The site is in Polish and doesn’t show the history from before the car came to Poland – that’s what a report from foreign databases is for.',
      darmoLink: 'Open historiapojazdu.gov.pl',
      gdzieTytul: 'Where to find the VIN',
      gdzie: [
        { t: 'Registration certificate', o: 'Field E – 17 characters (letters and digits, no I, O or Q).' },
        { t: 'Under the windscreen', o: 'A plate visible from outside, usually on the driver’s side.' },
        { t: 'On the body', o: 'The type plate and the number stamped on the body – usually in the engine bay or under a seat.' }
      ],
      gdzieUwaga: 'All three numbers must be identical. If they differ or the plate looks tampered with – walk away from the deal.',
      raportTytul: 'What to look for in the report',
      raportLista: [
        'Whether the mileage readings keep increasing – a drop or a big gap in the history is a warning sign.',
        'Damage and its cost – a minor bump is different from a repair costing tens of thousands.',
        'Photos from listings and auctions – whether the car was sold as damaged.',
        'Countries where the car was registered and the number of owners.',
        'Whether the version, engine and equipment match the listing.'
      ],
      poradnik: 'Bought a car in Poland – what next? Tax, registration, OC'
    },
    oc: {
      seoTytul: 'Car insurance in Poland – compare OC prices',
      seoOpis: 'Compare prices of compulsory OC and AC car insurance in Poland. What to prepare for the calculator, when to switch insurer and how much having no OC costs.',
      nazwa: 'Car insurance (OC)',
      etykieta: 'Car insurance',
      tytul: 'Compare OC and AC car insurance prices in Poland',
      wstep: 'OC is compulsory third-party liability insurance for every car registered in Poland. The same policy for the same car can differ in price by several hundred złoty – compare offers from many insurers at once.',
      przyciskOc: 'Compare OC prices',
      przyciskAc: 'OC + AC',
      partnerski: 'affiliate link · the calculator is in Polish',
      karty: [
        { t: 'Prepare your details', o: 'Registration certificate, the owner’s PESEL and the date you got your driving licence. With these, the calculator takes a few minutes.' },
        { t: 'Compare before your policy ends', o: 'Ideally 2–3 weeks before. The cancellation of the old policy must reach the insurer by the day before it ends.' },
        { t: 'Look beyond the price', o: 'Compare sums insured, assistance, a replacement car and the AC excess. The cheapest offer isn’t always the best.' }
      ],
      pesel: 'The online calculator usually asks for a PESEL number. If you don’t have one, contact an insurer or insurance agent directly – OC can be bought without a PESEL, but not always online.',
      brakTytul: 'Don’t go without OC for a single day',
      brakTekst: 'For a passenger car without OC, the Insurance Guarantee Fund (UFG) charges in 2026: 1,920 zł for a 1–3 day gap, 4,810 zł for 4–14 days and 9,610 zł for more than 14 days. Buy the new policy so it starts the day after the old one ends.',
      pytania: 'Frequently asked questions about OC',
      faq: [
        {
          q: 'Does an OC policy renew automatically?',
          a: 'Yes. If you don’t cancel it by the day before the end of the term, OC renews for another 12 months – often at a higher price. The exception is a policy taken over with a car you bought: that one doesn’t renew itself.'
        },
        { q: 'What do I need for the OC calculator?', a: 'The car’s registration certificate (vehicle data), the owner’s PESEL and the date you got your driving licence. Information about your claims history from previous policies also helps.' },
        { q: 'How much does having no OC cost?', a: 'For a passenger car, UFG charges in 2026: 1,920 zł for a 1–3 day gap, 4,810 zł for 4–14 days and 9,610 zł for more than 14 days without OC.' },
        { q: 'Is my foreign car insurance valid in Poland?', a: 'A car with foreign plates needs a valid Green Card or insurance recognised in the EU. Once the car is registered in Poland, you need a Polish OC policy – by the day of registration at the latest.' }
      ],
      dolTytul: 'Check how much you’ll pay for OC this year',
      dolOpis: 'Comparing is free and doesn’t commit you to anything.',
      zastrzezenie: 'For information only. MotoRaport is not an insurance intermediary and doesn’t advise on choosing a policy – you sign the contract directly with the insurer.',
      poradnik: 'How much does OC cost and what affects the price'
    }
  }
};
