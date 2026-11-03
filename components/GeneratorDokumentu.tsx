'use client';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Printer, Eraser, Lock } from 'lucide-react';
import type { Generator } from '@/lib/poradniki';

// Generator dokumentów (umowa, oświadczenie sprawcy, wypowiedzenie OC).
// Wszystko dzieje się w przeglądarce: dane nie są nigdzie wysyłane ani zapisywane.
// Drukowanie: przycisk dodaje klasę do <html>, a CSS w globals.css drukuje tylko arkusz dokumentu.

type Pole = { k: string; l: string; typ?: 'text' | 'date' | 'time' | 'number' | 'textarea' | 'select'; opcje?: [string, string][]; pod?: string; szer?: 'pol' };
type Grupa = { t: string; pola: Pole[] };

const dzis = () => new Date().toISOString().slice(0, 10);

const FORMULARZE: Record<Generator, Grupa[]> = {
  umowa: [
    { t: 'Umowa', pola: [{ k: 'miejsce', l: 'Miejscowość', szer: 'pol' }, { k: 'data', l: 'Data', typ: 'date', szer: 'pol' }] },
    { t: 'Sprzedający', pola: [{ k: 's_imie', l: 'Imię i nazwisko' }, { k: 's_adres', l: 'Adres' }, { k: 's_dok', l: 'Nr dowodu osobistego lub PESEL' }] },
    { t: 'Kupujący', pola: [{ k: 'k_imie', l: 'Imię i nazwisko' }, { k: 'k_adres', l: 'Adres' }, { k: 'k_dok', l: 'Nr dowodu osobistego lub PESEL' }] },
    {
      t: 'Samochód',
      pola: [
        { k: 'marka', l: 'Marka', szer: 'pol' },
        { k: 'model', l: 'Model', szer: 'pol' },
        { k: 'rok', l: 'Rok produkcji', typ: 'number', szer: 'pol' },
        { k: 'rej', l: 'Nr rejestracyjny', szer: 'pol' },
        { k: 'vin', l: 'Numer VIN (17 znaków)' },
        { k: 'przebieg', l: 'Przebieg (km)', typ: 'number', szer: 'pol' },
        { k: 'klucze', l: 'Liczba kluczyków', typ: 'number', szer: 'pol' }
      ]
    },
    {
      t: 'Cena i warunki',
      pola: [
        { k: 'cena', l: 'Cena (zł)', typ: 'number', szer: 'pol' },
        { k: 'zaplata', l: 'Zapłata', typ: 'select', szer: 'pol', opcje: [['gotowka', 'gotówką przy podpisaniu'], ['przelew', 'przelewem przed wydaniem auta']] },
        {
          k: 'rekojmia',
          l: 'Rękojmia',
          typ: 'select',
          opcje: [
            ['zostaje', 'na zasadach z Kodeksu cywilnego'],
            ['wylaczona', 'wyłączona (tylko między osobami prywatnymi)']
          ]
        },
        { k: 'uwagi', l: 'Znane wady i uwagi (opcjonalnie)', typ: 'textarea' }
      ]
    }
  ],
  oswiadczenie: [
    { t: 'Zdarzenie', pola: [{ k: 'data', l: 'Data', typ: 'date', szer: 'pol' }, { k: 'godz', l: 'Godzina', typ: 'time', szer: 'pol' }, { k: 'miejsce', l: 'Miejsce (miejscowość, ulica, skrzyżowanie)' }] },
    {
      t: 'Sprawca',
      pola: [
        { k: 's_imie', l: 'Imię i nazwisko' },
        { k: 's_adres', l: 'Adres' },
        { k: 's_pesel', l: 'PESEL (opcjonalnie)', szer: 'pol' },
        { k: 's_pj', l: 'Nr prawa jazdy', szer: 'pol' },
        { k: 's_auto', l: 'Marka i model auta', szer: 'pol' },
        { k: 's_rej', l: 'Nr rejestracyjny', szer: 'pol' },
        { k: 's_wlasciciel', l: 'Właściciel auta, jeśli to inna osoba (opcjonalnie)' },
        { k: 's_ubezp', l: 'Ubezpieczyciel OC', szer: 'pol' },
        { k: 's_polisa', l: 'Nr polisy OC', szer: 'pol' },
        { k: 's_wazna', l: 'Polisa ważna do', typ: 'date', szer: 'pol' }
      ]
    },
    {
      t: 'Poszkodowany',
      pola: [
        { k: 'p_imie', l: 'Imię i nazwisko' },
        { k: 'p_adres', l: 'Adres' },
        { k: 'p_auto', l: 'Marka i model auta', szer: 'pol' },
        { k: 'p_rej', l: 'Nr rejestracyjny', szer: 'pol' }
      ]
    },
    {
      t: 'Przebieg i szkody',
      pola: [
        { k: 'opis', l: 'Jak doszło do kolizji', typ: 'textarea', pod: 'Np. „Wyjeżdżając z drogi podporządkowanej nie ustąpiłem pierwszeństwa i uderzyłem w lewy bok auta poszkodowanego.”' },
        { k: 'szkody', l: 'Uszkodzenia auta poszkodowanego', typ: 'textarea' },
        { k: 'swiadkowie', l: 'Świadkowie – imię, nazwisko, telefon (opcjonalnie)', typ: 'textarea' }
      ]
    }
  ],
  wypowiedzenie: [
    {
      t: 'Podstawa',
      pola: [
        {
          k: 'podstawa',
          l: 'Dlaczego wypowiadasz OC',
          typ: 'select',
          opcje: [
            ['28', 'art. 28 – nie chcę przedłużenia na kolejny rok'],
            ['28a', 'art. 28a – mam dwie polisy OC na to samo auto'],
            ['31', 'art. 31 – kupiłem auto z OC poprzedniego właściciela']
          ]
        },
        { k: 'z_dniem', l: 'Rozwiązanie umowy z dniem (art. 31, opcjonalnie)', typ: 'date' }
      ]
    },
    { t: 'Ubezpieczyciel', pola: [{ k: 'ubezp', l: 'Nazwa ubezpieczyciela' }, { k: 'polisa', l: 'Nr polisy OC', szer: 'pol' }, { k: 'nowa', l: 'Nr nowej polisy (art. 28a, opcjonalnie)', szer: 'pol' }] },
    { t: 'Twoje dane', pola: [{ k: 'imie', l: 'Imię i nazwisko' }, { k: 'adres', l: 'Adres' }, { k: 'pesel', l: 'PESEL (opcjonalnie)' }] },
    { t: 'Samochód', pola: [{ k: 'auto', l: 'Marka i model', szer: 'pol' }, { k: 'rej', l: 'Nr rejestracyjny', szer: 'pol' }, { k: 'miejsce', l: 'Miejscowość', szer: 'pol' }, { k: 'data', l: 'Data', typ: 'date', szer: 'pol' }] }
  ],
  darowizna: [
    { t: 'Umowa', pola: [{ k: 'miejsce', l: 'Miejscowość', szer: 'pol' }, { k: 'data', l: 'Data', typ: 'date', szer: 'pol' }] },
    { t: 'Darczyńca (oddaje auto)', pola: [{ k: 'd_imie', l: 'Imię i nazwisko' }, { k: 'd_adres', l: 'Adres' }, { k: 'd_dok', l: 'Nr dowodu osobistego lub PESEL' }] },
    { t: 'Obdarowany (dostaje auto)', pola: [{ k: 'o_imie', l: 'Imię i nazwisko' }, { k: 'o_adres', l: 'Adres' }, { k: 'o_dok', l: 'Nr dowodu osobistego lub PESEL' }, { k: 'pokrewienstwo', l: 'Kim jest dla darczyńcy', pod: 'Np. „synem darczyńcy”, „córką”, „bratem”, „małżonkiem”.' }] },
    {
      t: 'Samochód',
      pola: [
        { k: 'marka', l: 'Marka', szer: 'pol' },
        { k: 'model', l: 'Model', szer: 'pol' },
        { k: 'rok', l: 'Rok produkcji', typ: 'number', szer: 'pol' },
        { k: 'rej', l: 'Nr rejestracyjny', szer: 'pol' },
        { k: 'vin', l: 'Numer VIN (17 znaków)' },
        { k: 'przebieg', l: 'Przebieg (km)', typ: 'number', szer: 'pol' },
        { k: 'wartosc', l: 'Wartość rynkowa (zł)', typ: 'number', szer: 'pol', pod: 'Potrzebna do zgłoszenia SD-Z2.' }
      ]
    }
  ],
  dziura: [
    { t: 'Pismo', pola: [{ k: 'miejsce', l: 'Miejscowość', szer: 'pol' }, { k: 'data', l: 'Data pisma', typ: 'date', szer: 'pol' }] },
    { t: 'Twoje dane', pola: [{ k: 'imie', l: 'Imię i nazwisko' }, { k: 'adres', l: 'Adres' }, { k: 'tel', l: 'Telefon lub e-mail', szer: 'pol' }, { k: 'konto', l: 'Nr konta do wypłaty', szer: 'pol' }] },
    { t: 'Zarządca drogi', pola: [{ k: 'zarzadca', l: 'Nazwa i adres zarządcy', pod: 'Np. „Zarząd Dróg Powiatowych w …, ul. …” albo „GDDKiA Oddział w …”.' }] },
    {
      t: 'Zdarzenie',
      pola: [
        { k: 'z_data', l: 'Data zdarzenia', typ: 'date', szer: 'pol' },
        { k: 'z_godz', l: 'Godzina', typ: 'time', szer: 'pol' },
        { k: 'z_miejsce', l: 'Dokładne miejsce', pod: 'Miejscowość, ulica lub numer drogi, kilometr, kierunek jazdy.' },
        { k: 'auto', l: 'Marka i model auta', szer: 'pol' },
        { k: 'rej', l: 'Nr rejestracyjny', szer: 'pol' },
        { k: 'opis', l: 'Przebieg zdarzenia', typ: 'textarea', pod: 'Np. „Jadąc z prędkością ok. 40 km/h wjechałem prawym przednim kołem w nieoznakowaną dziurę o głębokości ok. 10 cm…”' },
        { k: 'szkody', l: 'Uszkodzenia auta', typ: 'textarea' },
        { k: 'kwota', l: 'Żądana kwota (zł)', typ: 'number', szer: 'pol' },
        {
          k: 'znak',
          l: 'Czy dziura była oznakowana?',
          typ: 'select',
          szer: 'pol',
          opcje: [
            ['nie', 'nie – brak znaku i zabezpieczenia'],
            ['tak', 'tak – był znak ostrzegawczy']
          ]
        },
        {
          k: 'policja',
          l: 'Notatka służb',
          typ: 'select',
          szer: 'pol',
          opcje: [
            ['tak', 'zdarzenie zgłoszono policji / straży miejskiej'],
            ['nie', 'nie wzywano służb']
          ]
        }
      ]
    }
  ]
};

const DOMYSLNE: Record<Generator, Record<string, string>> = {
  umowa: { data: '', zaplata: 'gotowka', rekojmia: 'zostaje', klucze: '2' },
  oswiadczenie: { data: '' },
  wypowiedzenie: { podstawa: '28', data: '' },
  darowizna: { data: '' },
  dziura: { data: '', policja: 'tak', znak: 'nie' }
};

const TYTULY: Record<Generator, string> = {
  umowa: 'Umowa kupna-sprzedaży',
  oswiadczenie: 'Oświadczenie sprawcy kolizji',
  wypowiedzenie: 'Wypowiedzenie OC',
  darowizna: 'Umowa darowizny samochodu',
  dziura: 'Wniosek o odszkodowanie do zarządcy drogi'
};

const KOPIE: Record<Generator, number> = { umowa: 2, oswiadczenie: 2, wypowiedzenie: 1, darowizna: 2, dziura: 1 };

function dataPl(iso?: string) {
  if (!iso) return '';
  const [r, m, d] = iso.split('-');
  return r && m && d ? `${d}.${m}.${r}` : iso;
}

const kwota = (v?: string) => (v ? `${Number(v).toLocaleString('pl-PL')} zł` : '');

// Luka do ręcznego wpisania, gdy pole jest puste
function W({ v, min = 'w-40' }: { v?: string; min?: string }) {
  return v ? <strong className="font-semibold">{v}</strong> : <span className={`inline-block ${min} border-b border-dotted border-slate-500 align-bottom`}>&nbsp;</span>;
}

function Podpisy({ lewy, prawy }: { lewy: string; prawy: string }) {
  return (
    <div className="grid grid-cols-2 gap-10 pt-12 text-center text-[11px]">
      <div className="border-t border-slate-500 pt-1">{lewy}</div>
      <div className="border-t border-slate-500 pt-1">{prawy}</div>
    </div>
  );
}

function Umowa({ d }: { d: Record<string, string> }) {
  return (
    <>
      <h3 className="text-center text-base font-bold uppercase tracking-wide">Umowa kupna-sprzedaży samochodu</h3>
      <p className="text-center">
        zawarta w <W v={d.miejsce} /> dnia <W v={dataPl(d.data)} min="w-24" />
      </p>
      <p>
        <strong>Sprzedający:</strong> <W v={d.s_imie} min="w-56" />, zam. <W v={d.s_adres} min="w-64" />, legitymujący się <W v={d.s_dok} />
      </p>
      <p>
        <strong>Kupujący:</strong> <W v={d.k_imie} min="w-56" />, zam. <W v={d.k_adres} min="w-64" />, legitymujący się <W v={d.k_dok} />
      </p>
      <p>
        <strong>§ 1.</strong> Sprzedający sprzedaje, a Kupujący kupuje samochód marki <W v={d.marka} min="w-24" /> model <W v={d.model} min="w-24" />, rok produkcji{' '}
        <W v={d.rok} min="w-14" />, nr VIN <W v={d.vin} min="w-56" />, nr rejestracyjny <W v={d.rej} min="w-24" />, o przebiegu <W v={d.przebieg ? `${Number(d.przebieg).toLocaleString('pl-PL')} km` : ''} min="w-24" /> (stan licznika w dniu sprzedaży).
      </p>
      <p>
        <strong>§ 2.</strong> Sprzedający oświadcza, że samochód jest jego własnością, nie jest obciążony prawami osób trzecich (w tym zastawem), nie toczy się wobec niego żadne postępowanie i nie jest przedmiotem zabezpieczenia.
      </p>
      <p>
        <strong>§ 3.</strong> Strony ustalają cenę na <W v={kwota(d.cena)} min="w-28" />. Kupujący płaci cenę {d.zaplata === 'przelew' ? 'przelewem na rachunek Sprzedającego przed wydaniem samochodu' : 'gotówką przy podpisaniu umowy, co Sprzedający potwierdza podpisem pod umową'}.
      </p>
      <p>
        <strong>§ 4.</strong> Kupujący oświadcza, że zapoznał się ze stanem technicznym samochodu.{' '}
        {d.rekojmia === 'wylaczona'
          ? 'Strony wyłączają odpowiedzialność Sprzedającego z tytułu rękojmi za wady fizyczne samochodu (art. 558 § 1 Kodeksu cywilnego). Wyłączenie nie dotyczy wad, które Sprzedający podstępnie zataił.'
          : 'Odpowiedzialność Sprzedającego z tytułu rękojmi określają przepisy Kodeksu cywilnego.'}
        {d.uwagi ? ` Kupujący został poinformowany o następujących wadach i uwagach: ${d.uwagi}.` : ''}
      </p>
      <p>
        <strong>§ 5.</strong> Sprzedający wydaje Kupującemu samochód wraz z: dowodem rejestracyjnym, kartą pojazdu (jeśli była wydana), tablicami rejestracyjnymi, dokumentem ubezpieczenia OC oraz <W v={d.klucze} min="w-8" /> kluczykami.
      </p>
      <p>
        <strong>§ 6.</strong> Koszty umowy, w tym podatek od czynności cywilnoprawnych, ponosi Kupujący. W sprawach nieuregulowanych stosuje się przepisy Kodeksu cywilnego. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.
      </p>
      <Podpisy lewy="podpis Sprzedającego" prawy="podpis Kupującego" />
    </>
  );
}

function Oswiadczenie({ d }: { d: Record<string, string> }) {
  return (
    <>
      <h3 className="text-center text-base font-bold uppercase tracking-wide">Oświadczenie sprawcy kolizji drogowej</h3>
      <p>
        Ja, niżej podpisany(-a) <W v={d.s_imie} min="w-56" />, zam. <W v={d.s_adres} min="w-64" />
        {d.s_pesel ? `, PESEL ${d.s_pesel}` : ''}, legitymujący(-a) się prawem jazdy nr <W v={d.s_pj} />, oświadczam, że w dniu <W v={dataPl(d.data)} min="w-24" /> o godz. <W v={d.godz} min="w-14" /> w miejscowości / na drodze <W v={d.miejsce} min="w-64" />, kierując samochodem <W v={d.s_auto} /> o nr rejestracyjnym <W v={d.s_rej} min="w-24" />
        {d.s_wlasciciel ? ` (właściciel: ${d.s_wlasciciel})` : ''}, <strong>spowodowałem(-am) kolizję drogową</strong> z samochodem <W v={d.p_auto} /> o nr rejestracyjnym <W v={d.p_rej} min="w-24" />, którym kierował(-a) <W v={d.p_imie} min="w-56" />, zam. <W v={d.p_adres} min="w-64" />.
      </p>
      <p>
        <strong>Przebieg zdarzenia:</strong> <W v={d.opis} min="w-full" />
      </p>
      <p>
        <strong>Uszkodzenia samochodu poszkodowanego:</strong> <W v={d.szkody} min="w-full" />
      </p>
      <p>
        <strong>Ubezpieczenie OC sprawcy:</strong> <W v={d.s_ubezp} />, polisa nr <W v={d.s_polisa} />, ważna do <W v={dataPl(d.s_wazna)} min="w-24" />.
      </p>
      {d.swiadkowie && (
        <p>
          <strong>Świadkowie:</strong> {d.swiadkowie}
        </p>
      )}
      <p>Oświadczam, że w chwili zdarzenia byłem(-am) trzeźwy(-a) i nie byłem(-am) pod wpływem środków odurzających. Przyznaję się do winy i zobowiązuję się do niezwłocznego zgłoszenia szkody w moim zakładzie ubezpieczeń. Oświadczenie sporządzono w dwóch egzemplarzach.</p>
      <Podpisy lewy="podpis sprawcy" prawy="podpis poszkodowanego" />
    </>
  );
}

function Wypowiedzenie({ d }: { d: Record<string, string> }) {
  const tresc =
    d.podstawa === '28a' ? (
      <>
        Na podstawie <strong>art. 28a ust. 1</strong> ustawy z dnia 22 maja 2003 r. o ubezpieczeniach obowiązkowych, Ubezpieczeniowym Funduszu Gwarancyjnym i Polskim Biurze Ubezpieczycieli Komunikacyjnych wypowiadam umowę obowiązkowego ubezpieczenia OC posiadaczy pojazdów mechanicznych nr <W v={d.polisa} />, która została zawarta na kolejny okres w związku z brakiem jej wypowiedzenia. Pojazd jest ubezpieczony w innym zakładzie ubezpieczeń
        {d.nowa ? ` (polisa nr ${d.nowa})` : ''}. Proszę o zwrot składki za niewykorzystany okres ochrony.
      </>
    ) : d.podstawa === '31' ? (
      <>
        Na podstawie <strong>art. 31 ust. 1</strong> ustawy z dnia 22 maja 2003 r. o ubezpieczeniach obowiązkowych, Ubezpieczeniowym Funduszu Gwarancyjnym i Polskim Biurze Ubezpieczycieli Komunikacyjnych, jako nabywca pojazdu wypowiadam umowę obowiązkowego ubezpieczenia OC posiadaczy pojazdów mechanicznych nr <W v={d.polisa} /> zawartą przez zbywcę pojazdu
        {d.z_dniem ? `, ze skutkiem na dzień ${dataPl(d.z_dniem)}` : ''}.
      </>
    ) : (
      <>
        Na podstawie <strong>art. 28 ust. 1</strong> ustawy z dnia 22 maja 2003 r. o ubezpieczeniach obowiązkowych, Ubezpieczeniowym Funduszu Gwarancyjnym i Polskim Biurze Ubezpieczycieli Komunikacyjnych wypowiadam umowę obowiązkowego ubezpieczenia OC posiadaczy pojazdów mechanicznych nr <W v={d.polisa} /> z upływem okresu, na jaki została zawarta.
      </>
    );
  return (
    <>
      <p className="text-right">
        <W v={d.miejsce} />, dnia <W v={dataPl(d.data)} min="w-24" />
      </p>
      <p className="whitespace-pre-line">
        <W v={d.imie} min="w-56" />
        <br />
        <W v={d.adres} min="w-64" />
        {d.pesel ? (
          <>
            <br />
            PESEL {d.pesel}
          </>
        ) : null}
      </p>
      <p className="text-right font-semibold">
        <W v={d.ubezp} min="w-56" />
      </p>
      <h3 className="text-center text-base font-bold uppercase tracking-wide pt-2">Wypowiedzenie umowy ubezpieczenia OC</h3>
      <p>{tresc}</p>
      <p>
        Dotyczy pojazdu: <W v={d.auto} />, nr rejestracyjny <W v={d.rej} min="w-24" />.
      </p>
      <div className="flex justify-end pt-12">
        <div className="w-56 border-t border-slate-500 pt-1 text-center text-[11px]">podpis</div>
      </div>
    </>
  );
}

function Darowizna({ d }: { d: Record<string, string> }) {
  return (
    <>
      <h3 className="text-center text-base font-bold uppercase tracking-wide">Umowa darowizny samochodu</h3>
      <p className="text-center">
        zawarta w <W v={d.miejsce} /> dnia <W v={dataPl(d.data)} min="w-24" />
      </p>
      <p>
        <strong>Darczyńca:</strong> <W v={d.d_imie} min="w-56" />, zam. <W v={d.d_adres} min="w-64" />, legitymujący się <W v={d.d_dok} />
      </p>
      <p>
        <strong>Obdarowany:</strong> <W v={d.o_imie} min="w-56" />, zam. <W v={d.o_adres} min="w-64" />, legitymujący się <W v={d.o_dok} />, będący <W v={d.pokrewienstwo} />.
      </p>
      <p>
        <strong>§ 1.</strong> Darczyńca oświadcza, że jest właścicielem samochodu marki <W v={d.marka} min="w-24" /> model <W v={d.model} min="w-24" />, rok produkcji <W v={d.rok} min="w-14" />, nr VIN{' '}
        <W v={d.vin} min="w-56" />, nr rejestracyjny <W v={d.rej} min="w-24" />, o przebiegu <W v={d.przebieg ? `${Number(d.przebieg).toLocaleString('pl-PL')} km` : ''} min="w-24" />, oraz że samochód nie jest obciążony prawami osób trzecich.
      </p>
      <p>
        <strong>§ 2.</strong> Darczyńca przekazuje opisany samochód Obdarowanemu w darowiźnie, a Obdarowany darowiznę przyjmuje. Strony określają wartość rynkową samochodu na <W v={kwota(d.wartosc)} min="w-28" />.
      </p>
      <p>
        <strong>§ 3.</strong> Wydanie samochodu wraz z dowodem rejestracyjnym, kluczykami i dokumentem ubezpieczenia OC nastąpiło w dniu podpisania umowy.
      </p>
      <p>
        <strong>§ 4.</strong> Obdarowany zapoznał się ze stanem technicznym samochodu. W sprawach nieuregulowanych stosuje się przepisy Kodeksu cywilnego. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.
      </p>
      <Podpisy lewy="podpis Darczyńcy" prawy="podpis Obdarowanego" />
    </>
  );
}

function Dziura({ d }: { d: Record<string, string> }) {
  return (
    <>
      <p className="text-right">
        <W v={d.miejsce} />, dnia <W v={dataPl(d.data)} min="w-24" />
      </p>
      <p>
        <W v={d.imie} min="w-56" />
        <br />
        <W v={d.adres} min="w-64" />
        {d.tel ? (
          <>
            <br />
            kontakt: {d.tel}
          </>
        ) : null}
      </p>
      <p className="ml-auto max-w-[60%] text-right font-semibold whitespace-pre-line">
        <W v={d.zarzadca} min="w-64" />
      </p>
      <h3 className="text-center text-base font-bold uppercase tracking-wide pt-2">Wniosek o wypłatę odszkodowania</h3>
      <p>
        Na podstawie art. 415 Kodeksu cywilnego wnoszę o wypłatę odszkodowania w kwocie <W v={kwota(d.kwota)} min="w-28" /> za szkodę w samochodzie <W v={d.auto} /> o nr rejestracyjnym <W v={d.rej} min="w-24" />, powstałą w dniu{' '}
        <W v={dataPl(d.z_data)} min="w-24" />
        {d.z_godz ? ` około godz. ${d.z_godz}` : ''} w miejscu: <W v={d.z_miejsce} min="w-64" />, w wyniku najechania na ubytek w nawierzchni drogi, której jesteście Państwo zarządcą.
      </p>
      <p>
        <strong>Przebieg zdarzenia:</strong> <W v={d.opis} min="w-full" />
      </p>
      <p>
        <strong>Uszkodzenia:</strong> <W v={d.szkody} min="w-full" />
      </p>
      <p>
        {d.znak === 'tak' ? 'Mimo ustawionego oznakowania stan drogi nie pozwalał na bezpieczny przejazd z dozwoloną prędkością.' : 'Ubytek nie był oznakowany ani zabezpieczony, co stanowi naruszenie obowiązku utrzymania drogi w należytym stanie.'}{' '}
        {d.policja === 'tak' ? 'Zdarzenie zostało zgłoszone służbom, które sporządziły notatkę.' : ''} Jeżeli zarządca posiada ubezpieczenie OC, proszę o przekazanie wniosku ubezpieczycielowi i wskazanie numeru szkody.
      </p>
      <p>
        Odszkodowanie proszę przelać na rachunek: <W v={d.konto} min="w-64" />.
      </p>
      <p>
        <strong>Załączniki:</strong> zdjęcia miejsca zdarzenia i uszkodzeń{d.policja === 'tak' ? ', notatka służb (lub jej sygnatura)' : ''}, kosztorys lub faktury za naprawę, kopia dowodu rejestracyjnego.
      </p>
      <div className="flex justify-end pt-12">
        <div className="w-56 border-t border-slate-500 pt-1 text-center text-[11px]">podpis</div>
      </div>
    </>
  );
}

function Arkusz({ rodzaj, d }: { rodzaj: Generator; d: Record<string, string> }) {
  const tresc: Record<Generator, ReactNode> = { umowa: <Umowa d={d} />, oswiadczenie: <Oswiadczenie d={d} />, wypowiedzenie: <Wypowiedzenie d={d} />, darowizna: <Darowizna d={d} />, dziura: <Dziura d={d} /> };
  return <div className="arkusz bg-white text-slate-900 font-serif text-[13px] leading-relaxed space-y-3 p-8 sm:p-10">{tresc[rodzaj]}</div>;
}

export default function GeneratorDokumentu({ rodzaj }: { rodzaj: Generator }) {
  const [d, setD] = useState<Record<string, string>>(DOMYSLNE[rodzaj]);
  useEffect(() => setD((x) => ({ ...x, data: x.data || dzis() })), []);
  const ustaw = (k: string, v: string) => setD((x) => ({ ...x, [k]: v }));
  const grupy = useMemo(() => FORMULARZE[rodzaj], [rodzaj]);
  const drukuj = () => {
    const html = document.documentElement;
    const zrodlo = document.getElementById('druk-dokumentu');
    if (!zrodlo) return;
    const kopia = document.createElement('div');
    kopia.id = 'druk-kopia';
    kopia.innerHTML = zrodlo.innerHTML;
    document.body.appendChild(kopia);
    html.classList.add('drukuj-dokument');
    const koniec = () => {
      html.classList.remove('drukuj-dokument');
      kopia.remove();
      window.removeEventListener('afterprint', koniec);
    };
    window.addEventListener('afterprint', koniec);
    window.print();
  };
  const wej = 'w-full rounded-xl bg-white dark:bg-slate-950 ring-1 ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-sky-500 outline-none px-3 py-2 text-sm text-slate-900 dark:text-white';

  return (
    <section id="generator" className="scroll-mt-24 rounded-3xl bg-slate-100 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-rust-600">Wzór do wypełnienia</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{TYTULY[rodzaj]}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Dane zostają w Twojej przeglądarce – nie wysyłamy ich ani nie zapisujemy.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setD({ ...DOMYSLNE[rodzaj], data: dzis() })} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-white dark:hover:bg-slate-800">
            <Eraser className="w-4 h-4" aria-hidden="true" /> Wyczyść
          </button>
          <button type="button" onClick={drukuj} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90">
            <Printer className="w-4 h-4" aria-hidden="true" /> Drukuj / zapisz PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {grupy.map((g) => (
            <fieldset key={g.t} className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-4">
              <legend className="px-1 text-xs font-black uppercase tracking-widest text-slate-500">{g.t}</legend>
              <div className="grid grid-cols-2 gap-3">
                {g.pola.map((p) => (
                  <label key={p.k} className={`block space-y-1 ${p.szer === 'pol' ? 'col-span-2 sm:col-span-1' : 'col-span-2'}`}>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{p.l}</span>
                    {p.typ === 'textarea' ? (
                      <textarea rows={3} className={wej} value={d[p.k] || ''} onChange={(e) => ustaw(p.k, e.target.value)} />
                    ) : p.typ === 'select' ? (
                      <select className={wej} value={d[p.k] || ''} onChange={(e) => ustaw(p.k, e.target.value)}>
                        {p.opcje!.map(([v, n]) => (
                          <option key={v} value={v}>
                            {n}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={p.typ || 'text'}
                        inputMode={p.typ === 'number' ? 'numeric' : undefined}
                        autoComplete="off"
                        className={wej}
                        value={d[p.k] || ''}
                        onChange={(e) => ustaw(p.k, p.k === 'vin' ? e.target.value.toUpperCase().slice(0, 17) : e.target.value)}
                      />
                    )}
                    {p.pod && <span className="block text-[11px] text-slate-500">{p.pod}</span>}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="text-xs text-slate-500">Puste pola zostaną na wydruku jako miejsce do wpisania ręcznie. Wzór ma charakter pomocniczy i nie zastępuje porady prawnej.</p>
        </form>

        <div className="lg:sticky lg:top-24 space-y-2">
          <div className="text-xs font-bold text-slate-500">Podgląd{KOPIE[rodzaj] > 1 ? ` – wydrukujemy ${KOPIE[rodzaj]} egzemplarze` : ''}</div>
          <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.5)] max-h-[44rem] overflow-y-auto">
            <Arkusz rodzaj={rodzaj} d={d} />
          </div>
        </div>
      </div>

      {/* Wersja do druku – widoczna tylko podczas drukowania */}
      <div id="druk-dokumentu" aria-hidden="true">
        {Array.from({ length: KOPIE[rodzaj] }, (_, i) => (
          <div key={i} className="druk-strona">
            <Arkusz rodzaj={rodzaj} d={d} />
          </div>
        ))}
      </div>
    </section>
  );
}
