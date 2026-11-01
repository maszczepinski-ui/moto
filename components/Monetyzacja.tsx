import { ExternalLink, ShieldCheck, FileSearch, Wrench } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import VinWidget from '@/components/VinWidget';
import {
  KontekstKarty,
  ModulId,
  kolejnoscModulow,
  linkVin,
  linkUbezpieczenia,
  linkiCzesci,
  panelDane,
  pokazModul
} from '@/lib/panel';

// Boksy z linkami partnerskimi na karcie modelu. Które się pokazują i w jakiej kolejności – ustawiasz w panelu admina.

function Vin({ k }: { k: KontekstKarty }) {
  const nazwa = `${k.model} ${k.generacja || ''}`.trim();
  return (
    <div className="bg-steel-700 text-white rounded-2xl p-6 flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <FileSearch className="w-5 h-5" aria-hidden="true" /> Sprawdź historię tego modelu przed zakupem
      </h2>
      <p className="text-sm text-steel-50">
        Zanim pojedziesz oglądać {k.marka} {nazwa}, sprawdź po numerze VIN przebieg, szkody i historię z innych krajów.
      </p>
      <VinWidget szablon={linkVin(k)} partner={panelDane.moduly?.vin?.partner || 'vin'} karta={k.slug} />
      <span className="text-[11px] text-steel-100">link partnerski</span>
    </div>
  );
}

function Ubezpieczenia({ k }: { k: KontekstKarty }) {
  const nazwa = `${k.marka} ${k.model} ${k.generacja || ''}`.trim();
  const przyciski = (
    [
      ['oc', 'Porównaj OC'],
      ['ac', 'Porównaj AC'],
      ['nnw', 'Porównaj NNW']
    ] as const
  )
    .map(([r, e]) => [r, e, linkUbezpieczenia(r, k)] as const)
    .filter(([, , l]) => l);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <ShieldCheck className="w-5 h-5" aria-hidden="true" /> Oblicz koszt OC/AC dla {nazwa}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Cena polisy dla tego samego auta potrafi się różnić o kilkaset złotych między ubezpieczycielami. Porównaj oferty w kilka minut.
      </p>
      <div className="mt-auto flex flex-wrap gap-2">
        {przyciski.map(([r, etykieta, l]) => (
          <LinkPartnerski
            key={r}
            href={l}
            modul={`ubezpieczenia-${r}`}
            partner={panelDane.moduly?.ubezpieczenia?.siec || 'ubezpieczenia'}
            karta={k.slug}
            className="inline-flex items-center gap-2 bg-steel-600 hover:bg-steel-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            {etykieta} <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </LinkPartnerski>
        ))}
      </div>
      <span className="text-[11px] text-slate-500">linki partnerskie</span>
    </div>
  );
}

function Czesci({ k }: { k: KontekstKarty }) {
  const nazwa = `${k.marka} ${k.model} ${k.generacja || ''}`.trim();
  const linki = linkiCzesci(k);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-3 md:col-span-2">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Wrench className="w-5 h-5" aria-hidden="true" /> Popularne części eksploatacyjne do {nazwa}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {linki.map((l) => (
          <li key={l.fraza} className="flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm">
            <span className="text-slate-700 dark:text-slate-300 first-letter:uppercase">{l.fraza}</span>
            <span className="flex gap-2 flex-shrink-0">
              {l.allegro && (
                <LinkPartnerski href={l.allegro} modul="czesci" partner="allegro" karta={k.slug} className="font-semibold text-rust-600 hover:underline">
                  Allegro
                </LinkPartnerski>
              )}
              {l.ceneo && (
                <LinkPartnerski href={l.ceneo} modul="czesci" partner="ceneo" karta={k.slug} className="font-semibold text-steel-600 dark:text-steel-400 hover:underline">
                  Ceneo
                </LinkPartnerski>
              )}
            </span>
          </li>
        ))}
      </ul>
      <span className="text-[11px] text-slate-500">linki partnerskie – przed zakupem sprawdź, czy część pasuje do Twojej wersji silnika</span>
    </div>
  );
}

const BOKSY: Record<Exclude<ModulId, 'adsense'>, (p: { k: KontekstKarty }) => React.ReactNode> = { vin: Vin, ubezpieczenia: Ubezpieczenia, czesci: Czesci };

export default function Monetyzacja({ k }: { k: KontekstKarty }) {
  const moduly = kolejnoscModulow().filter((m): m is Exclude<ModulId, 'adsense'> => m !== 'adsense' && pokazModul(m, k));
  if (!moduly.length) return null;
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {moduly.map((m) => {
        const Boks = BOKSY[m];
        return <Boks key={m} k={k} />;
      })}
    </section>
  );
}

/** Reklama AdSense w danym miejscu – tylko gdy włączona w panelu i ma wpisany numer bloku */
export function ustawieniaReklamy(miejsce: 'slotGora' | 'slotSpec' | 'slotDol', k: KontekstKarty) {
  const a = panelDane.moduly?.adsense;
  if (!a || !pokazModul('adsense', k) || !a[miejsce]) return null;
  return { klient: a.klient, slot: a[miejsce] };
}
