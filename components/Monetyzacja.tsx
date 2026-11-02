import { ExternalLink, ShieldCheck, FileSearch, Wrench, CheckCircle2, ClipboardList, ArrowDown } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import VinWidget from '@/components/VinWidget';
import CzesciWidget, { ZNACZNIK_FRAZY } from '@/components/CzesciWidget';
import { KontekstKarty, ModulId, kolejnoscModulow, linkVin, linkUbezpieczenia, panelDane, pokazModul, wypelnij } from '@/lib/panel';

// Narzędzia z linkami partnerskimi: VIN, OC/AC, części. Które się pokazują i w jakiej kolejności – ustawiasz w panelu admina.
// Na karcie modelu są: skrót na górze (kafelki), pełne narzędzia w środku strony i pasek na dole ekranu w telefonie.

const nazwaAuta = (k: KontekstKarty) => `${k.marka} ${k.model} ${k.generacja || ''}`.replace(/\s+/g, ' ').trim();

/** Co zawiera raport carVertical – według opisu na carvertical.com/pl (listopad 2026) */
const RAPORT_CARVERTICAL = ['historia przebiegu i cofnięte liczniki', 'historia uszkodzeń i koszty napraw', 'zdjęcia auta z przeszłości', 'cena rynkowa', 'specyfikacja i wyposażenie', 'oceny bezpieczeństwa'];

function Vin({ k }: { k: KontekstKarty }) {
  const v = panelDane.moduly?.vin;
  const cv = v?.partner === 'carvertical';
  const auto = k.marka ? nazwaAuta(k) : '';
  return (
    <div id="narzedzie-vin" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-br from-steel-700 to-steel-900 text-white rounded-2xl p-6 flex flex-col gap-3 shadow-lg">
      <FileSearch className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5" aria-hidden="true" />
      <span className="self-start text-[11px] font-bold uppercase tracking-wider bg-white/15 rounded-full px-2.5 py-1">{cv ? 'Kompleksowe sprawdzenie auta' : 'Przed zakupem'}</span>
      <h2 className="flex items-start gap-2 text-xl sm:text-2xl font-extrabold">
        <FileSearch className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" /> {cv ? `Raport carVertical${auto ? ` dla ${auto}` : ''}` : 'Sprawdź historię auta po VIN'}
      </h2>
      {cv ? (
        <>
          <p className="text-sm text-steel-50">Jeden raport z baz z wielu krajów – szczególnie ważny przy aucie sprowadzonym. Zawiera m.in.:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {RAPORT_CARVERTICAL.map((x) => (
              <li key={x} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-300" aria-hidden="true" /> {x}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-steel-50">Przebieg, szkody i zdjęcia z innych krajów{auto ? ` dla ${auto}` : ''}.</p>
      )}
      <p className="text-xs text-steel-100">
        Numer VIN znajdziesz w dowodzie rejestracyjnym (pole <strong>E</strong>) i pod przednią szybą – poproś sprzedającego o zdjęcie.
      </p>
      <VinWidget
        szablon={linkVin(k)}
        partner={v?.partner || 'vin'}
        karta={k.slug}
        przycisk={cv ? 'Sprawdź auto w carVertical' : 'Sprawdź historię VIN'}
        kod={v?.kod || ''}
        rabat={v?.rabat || ''}
      />
      <span className="text-[11px] text-steel-100">link partnerski{cv ? ' – carVertical' : ''}</span>
    </div>
  );
}

function Ubezpieczenia({ k }: { k: KontekstKarty }) {
  const przyciski = (
    [
      ['oc', 'Oblicz OC'],
      ['ac', 'OC + AC'],
      ['nnw', 'NNW']
    ] as const
  )
    .map(([r, e]) => [r, e, linkUbezpieczenia(r, k)] as const)
    .filter(([, , l]) => l);
  return (
    <div id="narzedzie-oc" className="scroll-mt-20 bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-900 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
      <span className="self-start text-[11px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 rounded-full px-2.5 py-1">
        Ubezpieczenie
      </span>
      <h2 className="flex items-start gap-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
        <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5 text-sky-600" aria-hidden="true" /> Oblicz OC/AC dla {`${k.model} ${k.generacja || ''}`.trim()}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">Ta sama polisa dla tego samego auta potrafi różnić się ceną o kilkaset złotych. Porównaj oferty wielu ubezpieczycieli naraz.</p>
      <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
        {['dowód rejestracyjny auta', 'PESEL właściciela', 'data uzyskania prawa jazdy'].map((x) => (
          <li key={x} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" aria-hidden="true" /> {x}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2">
        {przyciski.map(([r, etykieta, l], i) => (
          <LinkPartnerski
            key={r}
            href={l}
            modul={`ubezpieczenia-${r}`}
            partner={panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia'}
            karta={k.slug}
            className={`inline-flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl transition-colors ${
              i === 0 ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-200 hover:bg-sky-100'
            }`}
          >
            {etykieta} <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </LinkPartnerski>
        ))}
      </div>
      <span className="text-[11px] text-slate-500">linki partnerskie</span>
    </div>
  );
}

function Czesci({ k, silniki = [] }: { k: KontekstKarty; silniki?: string[] }) {
  const c = panelDane.moduly?.czesci;
  if (!c) return null;
  const kategorie = (c.frazy || 'filtr oleju, klocki hamulcowe, olej silnikowy, wycieraczki, akumulator')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 10);
  // wypełniamy dane auta, a w miejscu frazy zostawiamy znacznik – frazę wstawia przeglądarka po wyborze części
  const szablon = (s: string) => (s ? wypelnij(s, k, ZNACZNIK_FRAZY) : '');
  return (
    <div id="narzedzie-czesci" className="scroll-mt-20 bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 flex flex-col gap-4 md:col-span-2 shadow-sm">
      <span className="self-start text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full px-2.5 py-1">
        Porównywarka części
      </span>
      <h2 className="flex items-start gap-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
        <Wrench className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-600" aria-hidden="true" /> Części do {nazwaAuta(k)} – porównaj ceny
      </h2>
      <CzesciWidget kategorie={kategorie} silniki={silniki} nazwaAuta={nazwaAuta(k)} allegro={szablon(c.allegro)} ceneo={szablon(c.ceneo)} karta={k.slug} />
      <span className="text-[11px] text-slate-500">linki partnerskie – przed zakupem sprawdź, czy część pasuje do Twojej wersji silnika</span>
    </div>
  );
}

type BoksId = Exclude<ModulId, 'adsense' | 'ogledziny' | 'finansowanie'>;
const KOLEJNOSC_BOKSOW: BoksId[] = ['vin', 'ubezpieczenia', 'czesci'];

/** Które narzędzia są włączone dla tej karty (w kolejności z panelu) */
export function narzedziaKarty(k: KontekstKarty): BoksId[] {
  return kolejnoscModulow().filter((m): m is BoksId => (KOLEJNOSC_BOKSOW as string[]).includes(m) && pokazModul(m, k));
}

export { Vin as BoksVin, Ubezpieczenia as BoksUbezpieczenia, Czesci as BoksCzesci };

/** Pełne narzędzia – sekcja w środku karty modelu */
export default function Monetyzacja({ k, silniki = [] }: { k: KontekstKarty; silniki?: string[] }) {
  const moduly = narzedziaKarty(k);
  if (!moduly.length) return null;
  return (
    <section id="narzedzia" className="scroll-mt-20 space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Narzędzia dla kierowcy {nazwaAuta(k)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduly.map((m) =>
          m === 'vin' ? <Vin key={m} k={k} /> : m === 'ubezpieczenia' ? <Ubezpieczenia key={m} k={k} /> : <Czesci key={m} k={k} silniki={silniki} />
        )}
      </div>
    </section>
  );
}

const KAFELKI: Record<BoksId | 'zakup', { tytul: string; opis: string; kolor: string; ikona: typeof FileSearch; kotwica: string }> = {
  zakup: { tytul: 'Kupujesz to auto?', opis: 'Asystent zakupu: usterki, oględziny, formalności', kolor: 'bg-rust-600 hover:bg-rust-700 text-white', ikona: ClipboardList, kotwica: '' },
  vin: { tytul: 'Sprawdź VIN', opis: 'Przebieg, szkody, historia z zagranicy', kolor: 'bg-steel-700 hover:bg-steel-800 text-white', ikona: FileSearch, kotwica: '#narzedzie-vin' },
  ubezpieczenia: { tytul: 'Oblicz OC/AC', opis: 'Porównaj ceny polis w kilka minut', kolor: 'bg-sky-600 hover:bg-sky-700 text-white', ikona: ShieldCheck, kotwica: '#narzedzie-oc' },
  czesci: { tytul: 'Części – porównaj ceny', opis: 'Filtry, klocki, olej do tego modelu', kolor: 'bg-emerald-600 hover:bg-emerald-700 text-white', ikona: Wrench, kotwica: '#narzedzie-czesci' }
};

/** Kafelki pod nagłówkiem karty modelu: szybkie wejście do narzędzi */
export function SkrotNarzedzi({ k, adresZakupu }: { k: KontekstKarty; adresZakupu: string }) {
  const lista: (BoksId | 'zakup')[] = ['zakup', ...narzedziaKarty(k)];
  return (
    <nav aria-label="Narzędzia" className={`grid grid-cols-2 ${lista.length >= 4 ? 'lg:grid-cols-4' : lista.length === 3 ? 'lg:grid-cols-3' : ''} gap-3`}>
      {lista.map((id) => {
        const t = id === 'vin' && panelDane.moduly?.vin?.partner === 'carvertical' ? { ...KAFELKI.vin, tytul: 'Sprawdź auto', opis: 'Kompleksowy raport carVertical po VIN' } : KAFELKI[id];
        const Ikona = t.ikona;
        return (
          <a key={id} href={id === 'zakup' ? adresZakupu : t.kotwica} className={`group rounded-2xl p-4 flex flex-col gap-1 shadow-sm transition-colors ${t.kolor}`}>
            <span className="flex items-center justify-between">
              <Ikona className="w-6 h-6" aria-hidden="true" />
              {id !== 'zakup' && <ArrowDown className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />}
            </span>
            <span className="font-extrabold leading-tight mt-1">{t.tytul}</span>
            <span className="text-xs opacity-90 leading-snug">{t.opis}</span>
          </a>
        );
      })}
    </nav>
  );
}

/** Pasek przyklejony do dołu ekranu w telefonie: szybki dostęp do narzędzi */
export function DolnyPasek({ elementy }: { elementy: { etykieta: string; href: string; ikona: 'vin' | 'oc' | 'czesci' | 'zakup'; kolor: string }[] }) {
  if (!elementy.length) return null;
  const IKONY = { vin: FileSearch, oc: ShieldCheck, czesci: Wrench, zakup: ClipboardList };
  return (
    <>
      <div className="h-20 md:hidden" aria-hidden="true" />
      <nav aria-label="Szybkie narzędzia" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <ul className="grid gap-2" style={{ gridTemplateColumns: `repeat(${elementy.length}, minmax(0, 1fr))` }}>
          {elementy.map((e) => {
            const Ikona = IKONY[e.ikona];
            return (
              <li key={e.href}>
                <a href={e.href} className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-bold text-white ${e.kolor}`}>
                  <Ikona className="w-5 h-5" aria-hidden="true" />
                  {e.etykieta}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

/** Elementy dolnego paska dla karty modelu */
export function pasekKarty(k: KontekstKarty, adresZakupu: string) {
  const n = narzedziaKarty(k);
  return [
    ...(n.includes('vin') ? [{ etykieta: 'Sprawdź VIN', href: '#narzedzie-vin', ikona: 'vin' as const, kolor: 'bg-steel-700' }] : []),
    ...(n.includes('ubezpieczenia') ? [{ etykieta: 'OC/AC', href: '#narzedzie-oc', ikona: 'oc' as const, kolor: 'bg-sky-600' }] : []),
    ...(n.includes('czesci') ? [{ etykieta: 'Części', href: '#narzedzie-czesci', ikona: 'czesci' as const, kolor: 'bg-emerald-600' }] : []),
    { etykieta: 'Kupujesz?', href: adresZakupu, ikona: 'zakup' as const, kolor: 'bg-rust-600' }
  ];
}

/** Reklama AdSense w danym miejscu – tylko gdy włączona w panelu i ma wpisany numer bloku */
export function ustawieniaReklamy(miejsce: 'slotGora' | 'slotSpec' | 'slotDol', k: KontekstKarty) {
  const a = panelDane.moduly?.adsense;
  if (!a || !pokazModul('adsense', k) || !a[miejsce]) return null;
  return { klient: a.klient, slot: a[miejsce] };
}
