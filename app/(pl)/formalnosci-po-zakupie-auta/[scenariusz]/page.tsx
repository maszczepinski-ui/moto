import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calculator, FileText } from 'lucide-react';
import StronaNarzedzia, { H2, Tabela, type Pytanie, type Sekcja } from '@/components/narzedzia/StronaNarzedzia';
import KalkulatorFormalnosci from '@/components/narzedzia/KalkulatorFormalnosci';
import { CtaOc, CtaNiezbednik, Odnosnik, SiatkaCta } from '@/components/narzedzia/Cta';
import { KWOTY, SCENARIUSZE, STAN_FORMALNOSCI, kroki, scenariuszPoSlugu } from '@/lib/narzedzia/formalnosci';
import { PYTANIA_FORMALNOSCI, ZRODLA_FORMALNOSCI } from '@/lib/narzedzia/formalnosci-tresc';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return SCENARIUSZE.map((s) => ({ scenariusz: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenariusz: string }> }): Promise<Metadata> {
  const { scenariusz } = await params;
  const s = scenariuszPoSlugu(scenariusz);
  if (!s) return {};
  const opis = `${s.wstep} Terminy, kwoty i kary w 2026 r. oraz darmowy terminarz z plikiem do kalendarza.`.slice(0, 160);
  const adres = `/formalnosci-po-zakupie-auta/${s.slug}/`;
  return { title: s.tytulStrony, description: opis, alternates: { canonical: adres }, openGraph: { title: s.tytulStrony, description: opis, url: `${site.url}${adres}` } };
}

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

/** Pytania dopasowane do scenariusza (pierwsze dwa) + ogólne */
function pytaniaScenariusza(id: string): Pytanie[] {
  const wlasne: Record<string, Pytanie[]> = {
    'osoba-prywatna': [{ q: 'Kto płaci PCC przy zakupie od osoby prywatnej?', a: `Kupujący. Stawka to ${KWOTY.stawkaPcc}% wartości rynkowej auta, termin – 14 dni od umowy.` }],
    'firma-faktura': [{ q: 'Czy przy zakupie auta na fakturę płaci się PCC?', a: 'Nie. Sprzedaż na fakturę VAT albo VAT-marża jest objęta VAT, więc PCC nie występuje.' }],
    komis: [{ q: 'Skąd wiem, czy komis jest sprzedawcą?', a: 'Sprawdź dokument zakupu. Faktura wystawiona przez komis oznacza, że to on sprzedaje. Umowa z danymi poprzedniego właściciela oznacza, że komis tylko pośredniczy – wtedy płacisz PCC.' }],
    'z-ue': [{ q: 'Ile mam czasu na akcyzę za auto z Niemiec?', a: '14 dni na deklarację AKC-U/S, najpóźniej w dniu rejestracji. Bez potwierdzenia zapłaty akcyzy wydział komunikacji nie zarejestruje auta.' }],
    'spoza-ue': [{ q: 'Jakie podatki płaci się za auto z USA?', a: 'Cło (10%, a dla aut wyprodukowanych w USA 0% od 1.07.2026), akcyzę od wartości celnej powiększonej o cło i VAT 23% od całości.' }],
    darowizna: [{ q: 'Czy od darowizny auta od rodziców płaci się podatek?', a: 'Nie, jeśli zgłosisz darowiznę na formularzu SD-Z2 w ciągu 6 miesięcy. Bez zgłoszenia zwolnienie przepada.' }],
    sprzedaz: [{ q: 'Ile mam czasu na zgłoszenie sprzedaży auta?', a: `30 dni w wydziale komunikacji (kara ${zl(KWOTY.karaZbycie)}) i 14 dni na powiadomienie ubezpieczyciela OC.` }]
  };
  return [...(wlasne[id] || []), ...PYTANIA_FORMALNOSCI.slice(0, 4)];
}

export default async function ScenariuszPage({ params }: { params: Promise<{ scenariusz: string }> }) {
  const { scenariusz } = await params;
  const s = scenariuszPoSlugu(scenariusz);
  if (!s) notFound();
  const lista = kroki(s.id, 30000);
  const adres = `/formalnosci-po-zakupie-auta/${s.slug}/`;
  const sekcje: Sekcja[] = [
    {
      h2: `${s.tytulStrony.split(' – ')[0]}: krok po kroku`,
      akapity: [s.wstep, 'Poniżej pełna lista obowiązków w kolejności. Terminy liczysz od dnia umowy – w kalkulatorze powyżej wpiszesz datę i zobaczysz konkretne dni.']
    }
  ];
  return (
    <StronaNarzedzia
      id="formalnosci"
      adres={adres}
      okruszki={[
        { nazwa: 'Terminarz po zakupie auta', adres: '/formalnosci-po-zakupie-auta/' },
        { nazwa: s.nazwa, adres }
      ]}
      zdjecie="kupujesz"
      nadtytul="Terminarz formalności"
      tytul={s.tytulStrony}
      opis={s.wstep}
      nazwaAplikacji={`Terminarz: ${s.nazwa.toLowerCase()}`}
      narzedzie={<KalkulatorFormalnosci scenariusz={s.id} />}
      przedTrescia={
        <SiatkaCta>
          {s.id === 'sprzedaz' ? <CtaNiezbednik miejsce="umowa" /> : <CtaOc karta="narzedzie-formalnosci" />}
          {(s.id === 'z-ue' || s.id === 'spoza-ue') && <Odnosnik href="/koszt-sprowadzenia-auta/" ikona={Calculator} tytul="Ile kosztuje sprowadzenie auta?" tekst="Transport, akcyza, tłumaczenia i rejestracja – pełna suma." />}
          {s.id === 'osoba-prywatna' && <CtaNiezbednik miejsce="umowa" />}
        </SiatkaCta>
      }
      sekcje={sekcje}
      poTresci={
        <div className="space-y-8">
          <ol className="max-w-3xl space-y-5">
            {lista.map((k, i) => (
              <li key={k.tytul} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {k.tytul}
                    {k.dni ? <span className="font-normal text-slate-500"> – {k.dni} dni</span> : k.miesiace ? <span className="font-normal text-slate-500"> – {k.miesiace} miesięcy</span> : null}
                  </h3>
                  <p className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">{k.opis}</p>
                  {k.kara && <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">Kara za spóźnienie: {k.kara}</p>}
                </div>
              </li>
            ))}
          </ol>
          <div className="max-w-3xl">
            <Tabela
              wiersze={[
                ['Opłata lub kara', 'Kwota (2026)'],
                ['Rejestracja (dowód, tablice, znaki, pozwolenie)', `ok. ${zl(KWOTY.oplatyRejestracji)}`],
                ['Kara za rejestrację po 30 dniach', zl(KWOTY.karaRejestracja)],
                ['Kara za rejestrację po 180 dniach', zl(KWOTY.karaRejestracja180)],
                ['Kara za niezgłoszenie zbycia', zl(KWOTY.karaZbycie)],
                ['Kara za brak OC powyżej 14 dni (auto osobowe)', zl(KWOTY.karaBrakOc)]
              ]}
            />
          </div>
          <section className="space-y-4">
            <h2 className={H2}>Inne sytuacje</h2>
            <SiatkaCta>
              {SCENARIUSZE.filter((x) => x.id !== s.id).map((x) => (
                <Odnosnik key={x.id} href={`/formalnosci-po-zakupie-auta/${x.slug}/`} ikona={FileText} tytul={x.tytulStrony} tekst={x.wstep} />
              ))}
            </SiatkaCta>
          </section>
        </div>
      }
      pytania={pytaniaScenariusza(s.id)}
      zrodla={ZRODLA_FORMALNOSCI}
      stan={STAN_FORMALNOSCI}
      uwaga="To informacja ogólna, nie porada prawna ani podatkowa."
    />
  );
}
