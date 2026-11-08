// Teksty kalkulatorów i tabel mandatów w trzech językach (liczby są w lib/mandaty.ts – tylko tam je zmieniaj).
import type { Jezyk } from '@/lib/jezyki';
import type { Przedzial, Teren } from '@/lib/mandaty';

export type TekstyMandatow = {
  zl: (n: number) => string;
  przedzial: (p: Przedzial) => string;
  tereny: Record<Teren, string>;
  wykroczenia: Record<string, string>;
  /** recydywa przy kwocie, np. „recydywa 3000 zł” */
  recydywaKwota: (k: string) => string;
  tabela: { predkoscOpis: string; wykroczeniaOpis: string; przekroczenie: string; mandat: string; recydywa: string; punkty: string; wykroczenie: string };
  predkosc: {
    tytul: string;
    ograniczenie: string;
    twoja: string;
    przyklad: string;
    gdzie: string;
    recydywaPole: string;
    wpisz: string;
    brak: string;
    przekroczenieO: (n: number, opis: string) => string;
    mandat: string;
    punkty: string;
    recydywaUwaga: string;
    zatrzymanie: string;
  };
  punkty: {
    tytul: string;
    masz: string;
    sprawdzPrzed: string;
    sprawdzPo: string;
    prawoJazdy: string;
    dluzej: string;
    krocej: string;
    pkt: string;
    usun: string;
    dodaj: string;
    razem: string;
    wyczysc: string;
    zostalo: (n: number) => string;
    limitMlody: string;
    limitDoswiadczony: string;
    znikaja: string;
    predkoscNazwa: (opis: string) => string;
    zLimitu: (s: number, l: number) => string;
  };
  zrodla: { stan: string; pogladowe: string; zrodla: string };
};

const zlPl = (n: number) => n.toLocaleString('pl-PL') + ' zł';

export const TEKSTY_MANDATOW: Record<Jezyk, TekstyMandatow> = {
  pl: {
    zl: zlPl,
    przedzial: (p) => (p.do === null ? `o więcej niż ${p.od - 1} km/h` : p.od === 1 ? `do ${p.do} km/h` : `o ${p.od}–${p.do} km/h`),
    tereny: {
      zabudowany: 'Obszar zabudowany',
      jednojezdniowa: 'Poza obszarem zabudowanym – droga jednojezdniowa dwukierunkowa',
      inna: 'Poza obszarem zabudowanym – droga dwujezdniowa (ekspresówka, autostrada)'
    },
    wykroczenia: {
      telefon: 'Telefon w ręku podczas jazdy (także na światłach)',
      pasy: 'Brak zapiętych pasów',
      fotelik: 'Przewożenie dziecka bez fotelika',
      czerwone: 'Przejazd na czerwonym świetle',
      pieszy: 'Nieustąpienie pierwszeństwa pieszemu na przejściu',
      'wyprzedzanie-przejscie': 'Wyprzedzanie na przejściu dla pieszych lub tuż przed nim',
      'przejazd-kolejowy': 'Wjazd na przejazd kolejowy przy czerwonym świetle'
    },
    recydywaKwota: (k) => `recydywa ${k}`,
    tabela: {
      predkoscOpis: 'Mandaty za przekroczenie prędkości',
      wykroczeniaOpis: 'Mandaty za inne wykroczenia',
      przekroczenie: 'Przekroczenie',
      mandat: 'Mandat',
      recydywa: 'Recydywa',
      punkty: 'Punkty',
      wykroczenie: 'Wykroczenie'
    },
    predkosc: {
      tytul: 'Ile za przekroczenie prędkości?',
      ograniczenie: 'Ograniczenie (km/h)',
      twoja: 'Twoja prędkość (km/h)',
      przyklad: 'np. 74',
      gdzie: 'Gdzie?',
      recydywaPole: 'W ciągu ostatnich 2 lat dostałem już mandat za przekroczenie o ponad 30 km/h (recydywa)',
      wpisz: 'Wpisz prędkość, z jaką jechałeś.',
      brak: 'Nie przekroczyłeś ograniczenia – brak mandatu.',
      przekroczenieO: (n, opis) => `Przekroczenie o ${n} km/h (${opis})`,
      mandat: 'Mandat',
      punkty: 'Punkty karne',
      recydywaUwaga: 'recydywa dotyczy przekroczeń o ponad 30 km/h',
      zatrzymanie: 'Policja zatrzyma prawo jazdy na 3 miesiące (jazda mimo zatrzymania – przedłużenie do 6 miesięcy).'
    },
    punkty: {
      tytul: 'Ile punktów mi zostało?',
      masz: 'Punkty, które już masz',
      sprawdzPrzed: 'Sprawdzisz je za darmo w aplikacji mObywatel albo na',
      sprawdzPo: '.',
      prawoJazdy: 'Prawo jazdy mam',
      dluzej: 'dłużej niż rok',
      krocej: 'krócej niż rok',
      pkt: 'pkt',
      usun: 'Usuń',
      dodaj: 'Dodaj',
      razem: 'Razem punktów',
      wyczysc: 'wyczyść',
      zostalo: (n) => `Do limitu zostało ${n} pkt.`,
      limitMlody: 'Limit przekroczony – starosta cofa uprawnienia, a kurs i egzamin trzeba zdać od nowa.',
      limitDoswiadczony: 'Limit przekroczony – czeka Cię egzamin sprawdzający i badanie psychologiczne.',
      znikaja: 'Punkty znikają po roku od zapłacenia mandatu (przy sprawie w sądzie – od uprawomocnienia wyroku).',
      predkoscNazwa: (opis) => `Prędkość ${opis}`,
      zLimitu: (s, l) => `${s} z ${l} punktów`
    },
    zrodla: { stan: 'Stan przepisów', pogladowe: 'Informacje mają charakter poglądowy – wiążąca jest decyzja policjanta lub sądu.', zrodla: 'Źródła' }
  },
  uk: {
    zl: zlPl,
    przedzial: (p) => (p.do === null ? `більш ніж на ${p.od - 1} км/год` : p.od === 1 ? `до ${p.do} км/год` : `на ${p.od}–${p.do} км/год`),
    tereny: {
      zabudowany: 'Населений пункт',
      jednojezdniowa: 'Поза населеним пунктом – дорога з однією проїжджою частиною, двосторонній рух',
      inna: 'Поза населеним пунктом – дорога з двома проїжджими частинами (швидкісна, автомагістраль)'
    },
    wykroczenia: {
      telefon: 'Телефон у руці під час руху (також на світлофорі)',
      pasy: 'Не пристебнутий ремінь безпеки',
      fotelik: 'Перевезення дитини без автокрісла',
      czerwone: 'Проїзд на червоне світло',
      pieszy: 'Ненадання переваги пішоходу на переході',
      'wyprzedzanie-przejscie': 'Обгін на пішохідному переході або безпосередньо перед ним',
      'przejazd-kolejowy': 'В’їзд на залізничний переїзд на червоне світло'
    },
    recydywaKwota: (k) => `повторно ${k}`,
    tabela: {
      predkoscOpis: 'Штрафи за перевищення швидкості',
      wykroczeniaOpis: 'Штрафи за інші порушення',
      przekroczenie: 'Перевищення',
      mandat: 'Штраф',
      recydywa: 'Повторно',
      punkty: 'Бали',
      wykroczenie: 'Порушення'
    },
    predkosc: {
      tytul: 'Скільки за перевищення швидкості?',
      ograniczenie: 'Обмеження (км/год)',
      twoja: 'Ваша швидкість (км/год)',
      przyklad: 'напр. 74',
      gdzie: 'Де?',
      recydywaPole: 'Протягом останніх 2 років я вже отримав штраф за перевищення більш ніж на 30 км/год (повторне порушення)',
      wpisz: 'Введіть швидкість, з якою ви їхали.',
      brak: 'Ви не перевищили обмеження – штрафу немає.',
      przekroczenieO: (n, opis) => `Перевищення на ${n} км/год (${opis})`,
      mandat: 'Штраф',
      punkty: 'Штрафні бали',
      recydywaUwaga: 'подвійний штраф стосується перевищень більш ніж на 30 км/год',
      zatrzymanie: 'Поліція затримає посвідчення водія на 3 місяці (керування попри затримання – продовження до 6 місяців).'
    },
    punkty: {
      tytul: 'Скільки балів у мене залишилося?',
      masz: 'Бали, які у вас уже є',
      sprawdzPrzed: 'Власник польського посвідчення може безкоштовно перевірити їх у застосунку mObywatel або на',
      sprawdzPo: '.',
      prawoJazdy: 'Посвідчення водія маю',
      dluzej: 'понад рік',
      krocej: 'менше року',
      pkt: 'бал.',
      usun: 'Прибрати',
      dodaj: 'Додати',
      razem: 'Разом балів',
      wyczysc: 'очистити',
      zostalo: (n) => `До ліміту залишилося ${n} бал.`,
      limitMlody: 'Ліміт перевищено – польське посвідчення анулюють, курс і іспит доведеться складати знову.',
      limitDoswiadczony: 'Ліміт перевищено – на власника польського посвідчення чекає контрольний іспит і психологічне обстеження.',
      znikaja: 'Бали зникають через рік після сплати штрафу (якщо справа в суді – від набрання рішенням законної сили).',
      predkoscNazwa: (opis) => `Швидкість ${opis}`,
      zLimitu: (s, l) => `${s} з ${l} балів`
    },
    zrodla: { stan: 'Стан законодавства', pogladowe: 'Інформація довідкова – обов’язковим є рішення поліцейського або суду.', zrodla: 'Джерела (польською)' }
  },
  en: {
    zl: (n) => n.toLocaleString('en-GB') + ' zł',
    przedzial: (p) => (p.do === null ? `by more than ${p.od - 1} km/h` : p.od === 1 ? `up to ${p.do} km/h` : `by ${p.od}–${p.do} km/h`),
    tereny: {
      zabudowany: 'Built-up area',
      jednojezdniowa: 'Outside built-up area – single carriageway, two-way road',
      inna: 'Outside built-up area – dual carriageway (expressway, motorway)'
    },
    wykroczenia: {
      telefon: 'Holding a phone while driving (also at traffic lights)',
      pasy: 'Not wearing a seat belt',
      fotelik: 'Carrying a child without a child seat',
      czerwone: 'Running a red light',
      pieszy: 'Failing to give way to a pedestrian at a crossing',
      'wyprzedzanie-przejscie': 'Overtaking on or just before a pedestrian crossing',
      'przejazd-kolejowy': 'Entering a level crossing on a red light'
    },
    recydywaKwota: (k) => `repeat ${k}`,
    tabela: {
      predkoscOpis: 'Speeding fines',
      wykroczeniaOpis: 'Fines for other offences',
      przekroczenie: 'Over the limit',
      mandat: 'Fine',
      recydywa: 'Repeat offence',
      punkty: 'Points',
      wykroczenie: 'Offence'
    },
    predkosc: {
      tytul: 'How much is a speeding fine?',
      ograniczenie: 'Speed limit (km/h)',
      twoja: 'Your speed (km/h)',
      przyklad: 'e.g. 74',
      gdzie: 'Where?',
      recydywaPole: 'In the last 2 years I already got a fine for speeding by more than 30 km/h (repeat offence)',
      wpisz: 'Enter the speed you were driving at.',
      brak: 'You didn’t exceed the limit – no fine.',
      przekroczenieO: (n, opis) => `${n} km/h over the limit (${opis})`,
      mandat: 'Fine',
      punkty: 'Penalty points',
      recydywaUwaga: 'the double fine applies to speeding by more than 30 km/h',
      zatrzymanie: 'The police will retain your driving licence for 3 months (driving anyway extends it to 6 months).'
    },
    punkty: {
      tytul: 'How many points do I have left?',
      masz: 'Points you already have',
      sprawdzPrzed: 'Holders of a Polish licence can check them for free in the mObywatel app or on',
      sprawdzPo: '.',
      prawoJazdy: 'I have had my licence',
      dluzej: 'more than a year',
      krocej: 'less than a year',
      pkt: 'pts',
      usun: 'Remove',
      dodaj: 'Add',
      razem: 'Total points',
      wyczysc: 'clear',
      zostalo: (n) => `${n} points left before the limit.`,
      limitMlody: 'Limit exceeded – a Polish licence is revoked and the course and exam must be taken again.',
      limitDoswiadczony: 'Limit exceeded – a Polish licence holder must pass a check exam and a psychological assessment.',
      znikaja: 'Points expire one year after the fine is paid (if the case went to court – from the date the judgment became final).',
      predkoscNazwa: (opis) => `Speeding ${opis}`,
      zLimitu: (s, l) => `${s} of ${l} points`
    },
    zrodla: { stan: 'Law as of', pogladowe: 'For information only – the decision of the police officer or court is binding.', zrodla: 'Sources (in Polish)' }
  }
};

const MIESIACE: Record<string, [string, string]> = {
  styczeń: ['січень', 'January'],
  luty: ['лютий', 'February'],
  marzec: ['березень', 'March'],
  kwiecień: ['квітень', 'April'],
  maj: ['травень', 'May'],
  czerwiec: ['червень', 'June'],
  lipiec: ['липень', 'July'],
  sierpień: ['серпень', 'August'],
  wrzesień: ['вересень', 'September'],
  październik: ['жовтень', 'October'],
  listopad: ['листопад', 'November'],
  grudzień: ['грудень', 'December']
};

/** „listopad 2026” → „листопад 2026” / „November 2026” */
export function stanPrzepisowW(j: Jezyk, stan: string): string {
  if (j === 'pl') return stan;
  const [m, r] = stan.split(' ');
  const t = MIESIACE[m];
  return t ? `${t[j === 'uk' ? 0 : 1]} ${r}` : stan;
}
