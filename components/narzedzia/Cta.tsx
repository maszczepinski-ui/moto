import { ArrowRight, ExternalLink, Landmark, CircleDot, Scale, type LucideIcon } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import { BoksVin, BoksUbezpieczenia } from '@/components/Monetyzacja';
import BoksNiezbednika, { type MiejsceBoksu } from '@/components/sklep/BoksNiezbednika';
import { linkFinansowanie, panelDane, partnerKancelaria, pokazModul, type KontekstKarty } from '@/lib/panel';

// Boksy „co dalej” pod wynikiem kalkulatora. Każdy pokazuje się tylko wtedy, gdy moduł jest włączony
// i ma link w panelu admina – pusty moduł = niewidoczny boks (jak na kartach modeli).
// `karta` = nazwa miejsca do statystyk kliknięć, np. „narzedzie-przebieg” (w carVertical trafia do sub2).

export const kontekst = (karta: string, marka = '', model = ''): KontekstKarty => ({ slug: karta, marka, model });

export function CtaVin({ karta, tytul, marka, model }: { karta: string; tytul?: string; marka?: string; model?: string }) {
  const k = kontekst(karta, marka, model);
  if (!pokazModul('vin', k)) return null;
  return <BoksVin k={k} tytul={tytul} />;
}

export function CtaOc({ karta, tytul }: { karta: string; tytul?: string }) {
  const k = kontekst(karta);
  if (!pokazModul('ubezpieczenia', k)) return null;
  return <BoksUbezpieczenia k={k} tytul={tytul || 'Porównaj ceny OC i AC'} />;
}

function KartaPartnera({ ikona: I, kolor, etykieta, tytul, tekst, przycisk, href, modul, partner, karta }: {
  ikona: LucideIcon;
  kolor: string;
  etykieta: string;
  tytul: string;
  tekst: string;
  przycisk: string;
  href: string;
  modul: string;
  partner: string;
  karta: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
      <span className="self-start text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full px-2.5 py-1">{etykieta}</span>
      <h2 className="flex items-start gap-2 text-xl font-extrabold text-slate-900 dark:text-white">
        <I className={`w-6 h-6 flex-shrink-0 mt-0.5 ${kolor}`} aria-hidden="true" /> {tytul}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{tekst}</p>
      <LinkPartnerski href={href} modul={modul} partner={partner} karta={karta} className="mt-auto self-start inline-flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
        {przycisk} <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </LinkPartnerski>
      <span className="text-[11px] text-slate-500">link partnerski</span>
    </div>
  );
}

/** Kredyt / leasing – tylko hasło bez liczb (przykład reprezentatywny pokazuje partner) */
export function CtaFinansowanie({ karta, tytul, tekst }: { karta: string; tytul?: string; tekst?: string }) {
  const href = linkFinansowanie(kontekst(karta)).replaceAll('{zrodlo}', karta);
  if (!href || panelDane.moduly?.finansowanie?.wlaczony === false) return null;
  return (
    <KartaPartnera
      ikona={Landmark}
      kolor="text-emerald-600"
      etykieta="Finansowanie"
      tytul={tytul || 'Porównaj kredyt i leasing auta'}
      tekst={tekst || 'Zobacz oferty kilku instytucji w jednym miejscu. Szczegóły kosztów, w tym przykład reprezentatywny, pokaże partner.'}
      przycisk="Porównaj finansowanie"
      href={href}
      modul="finansowanie"
      partner={panelDane.moduly?.finansowanie?.partner || 'finansowanie'}
      karta={karta}
    />
  );
}

export function CtaOpony({ karta, rozmiar }: { karta: string; rozmiar?: string }) {
  const o = panelDane.moduly?.opony;
  if (!o?.wlaczony || !o.url) return null;
  return (
    <KartaPartnera
      ikona={CircleDot}
      kolor="text-rust-600"
      etykieta="Sklep z oponami"
      tytul={rozmiar ? `Opony w rozmiarze ${rozmiar}` : 'Sprawdź ceny opon'}
      tekst="Porównaj modele i ceny w sklepie partnera. Przed zakupem sprawdź indeks nośności i prędkości z dowodu rejestracyjnego lub instrukcji."
      przycisk="Zobacz opony"
      href={o.url.replaceAll('{rozmiar}', encodeURIComponent(rozmiar || ''))}
      modul="opony"
      partner={o.partner || 'opony'}
      karta={karta}
    />
  );
}

export function CtaKancelaria({ karta }: { karta: string }) {
  const p = partnerKancelaria();
  if (!p) return null;
  return (
    <KartaPartnera
      ikona={Scale}
      kolor="text-violet-600"
      etykieta="Pomoc prawna"
      tytul="Nie chcesz pisać pism sam?"
      tekst="Kancelaria partnerska oceni sprawę i poprowadzi ją za Ciebie. Wcześniej warto zebrać dokumenty: umowę, ogłoszenie, korespondencję i dowody."
      przycisk="Zapytaj kancelarię"
      href={p.url}
      modul="kancelaria"
      partner={p.partner}
      karta={karta}
    />
  );
}

export function CtaNiezbednik({ miejsce = 'zakup', model }: { miejsce?: MiejsceBoksu; model?: string }) {
  return <BoksNiezbednika miejsce={miejsce} model={model} />;
}

/** Link do innej strony serwisu w formie kafelka */
export function Odnosnik({ href, tytul, tekst, ikona: I }: { href: string; tytul: string; tekst: string; ikona: LucideIcon }) {
  return (
    <a href={href} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-rust-400">
      <span className="flex items-start gap-3">
        <I className="w-6 h-6 text-rust-600 flex-shrink-0" aria-hidden="true" />
        <span>
          <span className="block font-extrabold text-slate-900 dark:text-white">{tytul}</span>
          <span className="block text-sm text-slate-600 dark:text-slate-400">{tekst}</span>
        </span>
      </span>
      <ArrowRight className="w-5 h-5 text-rust-600 flex-shrink-0" aria-hidden="true" />
    </a>
  );
}

/** Siatka boksów (1 kolumna na telefonie, 2 na komputerze) – puste dzieci są pomijane */
export function SiatkaCta({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">{children}</div>;
}
