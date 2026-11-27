'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Snowflake } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import RysunekOpony from '@/components/opony/RysunekOpony';
import type { Klasa, Oferta, Sezon } from '@/lib/opony-dobor';

const SEZONY: { id: Sezon; nazwa: string; przym: string; poj: string }[] = [
  { id: 'z', nazwa: 'Zimowe', przym: 'zimowe', poj: 'zimowa' },
  { id: 'l', nazwa: 'Letnie', przym: 'letnie', poj: 'letnia' },
  { id: 'c', nazwa: 'Całoroczne', przym: 'całoroczne', poj: 'całoroczna' }
];
const KLASY: { id: Klasa | 'wszystkie'; nazwa: string }[] = [
  { id: 'wszystkie', nazwa: 'Wszystkie' },
  { id: 'premium', nazwa: 'Premium' },
  { id: 'srednia', nazwa: 'Średnia półka' },
  { id: 'eko', nazwa: 'Ekonomiczne' }
];
const WYGLAD_KLASY: Record<Klasa, string> = {
  premium: 'bg-slate-800 text-white',
  srednia: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
  eko: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
};
const NA_START = 12;
const zl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Zdjecie({ src, alt }: { src: string; alt: string }) {
  const [blad, setBlad] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);
  // zdjęcie mogło się nie wczytać, zanim strona „ożyła” – wtedy onError już nie zadziała, więc sprawdzamy ręcznie
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBlad(true);
  }, []);
  if (blad) return <RysunekOpony className="w-24 h-24 sm:w-28 sm:h-28" akcent={false} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBlad(true)} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />;
}

export default function ListaOpon({ oferty, rozmiar, slug, sezonStart, aktualizacja }: {
  oferty: Oferta[];
  rozmiar: string;
  slug: string;
  sezonStart: Sezon;
  aktualizacja: string;
}) {
  const [sezon, setSezon] = useState<Sezon>(sezonStart);
  const [klasa, setKlasa] = useState<Klasa | 'wszystkie'>('wszystkie');
  const [sort, setSort] = useState<'tanio' | 'drogo'>('tanio');
  const [ile, setIle] = useState(NA_START);

  const wSezonie = useMemo(() => oferty.filter((o) => o.sezon === sezon), [oferty, sezon]);
  const lista = useMemo(() => {
    const l = wSezonie.filter((o) => klasa === 'wszystkie' || o.klasa === klasa);
    return l.slice().sort((a, b) => (sort === 'tanio' ? a.cena - b.cena : b.cena - a.cena));
  }, [wSezonie, klasa, sort]);
  const s = SEZONY.find((x) => x.id === sezon)!;
  const od = wSezonie.length ? Math.min(...wSezonie.map((o) => o.cena)) : 0;
  const zmien = (f: () => void) => {
    f();
    setIle(NA_START);
  };

  const przycisk = (aktywny: boolean) =>
    `rounded-xl px-4 py-2.5 text-sm font-semibold text-left flex justify-between gap-3 ring-1 ${aktywny ? 'ring-rust-600 bg-rust-50 text-rust-800 dark:bg-rust-900/40 dark:text-rust-200' : 'ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:ring-slate-300'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Opony {s.przym} {rozmiar}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            {wSezonie.length} ofert{od > 0 && <> · od <b className="text-slate-900 dark:text-white">{zl(od)} zł</b> za sztukę</>} · ceny z {aktualizacja}, aktualizowane codziennie
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-1" role="group" aria-label="Sezon">
          {SEZONY.map((x) => {
            const n = oferty.filter((o) => o.sezon === x.id).length;
            const akt = x.id === sezon;
            return (
              <button
                key={x.id}
                type="button"
                aria-pressed={akt}
                disabled={!n}
                onClick={() => zmien(() => setSezon(x.id))}
                className={`rounded-xl px-3 sm:px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 ${akt ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {x.nazwa}
                <span className="text-xs font-semibold opacity-70">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-60 flex-none space-y-5 lg:rounded-3xl lg:bg-white lg:dark:bg-slate-900 lg:ring-1 lg:ring-slate-200 lg:dark:ring-slate-800 lg:p-5">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Klasa opon</div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0">
              {KLASY.map((k) => {
                const n = k.id === 'wszystkie' ? wSezonie.length : wSezonie.filter((o) => o.klasa === k.id).length;
                return (
                  <button key={k.id} type="button" aria-pressed={klasa === k.id} onClick={() => zmien(() => setKlasa(k.id))} className={`${przycisk(klasa === k.id)} flex-none whitespace-nowrap`}>
                    {k.nazwa}
                    <span className="opacity-70">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Sortuj</div>
            <div className="flex lg:flex-col gap-2">
              <button type="button" aria-pressed={sort === 'tanio'} onClick={() => setSort('tanio')} className={przycisk(sort === 'tanio')}>Od najtańszych</button>
              <button type="button" aria-pressed={sort === 'drogo'} onClick={() => setSort('drogo')} className={przycisk(sort === 'drogo')}>Od najdroższych</button>
            </div>
          </div>
          <p className="hidden lg:block text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
            Podział na klasy to nasza ocena na podstawie pozycji marek na rynku – nie test opon.
          </p>
        </aside>

        <div className="flex-1 min-w-0 w-full space-y-5">
          {lista.length === 0 ? (
            <p className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-6 text-slate-600 dark:text-slate-400">
              W tej klasie nie ma teraz opon {s.przym} w rozmiarze {rozmiar}. Wybierz inną klasę albo sezon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {lista.slice(0, ile).map((o) => (
                <li key={o.id} className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.35)] p-4 flex sm:flex-col gap-4">
                  <div className="relative flex-none w-28 h-28 sm:w-full sm:h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-3">
                    <Zdjecie src={o.zdjecie} alt={`Opona ${o.marka} ${o.model}`} />
                    <span className={`hidden sm:inline absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${WYGLAD_KLASY[o.klasa]}`}>{KLASY.find((k) => k.id === o.klasa)!.nazwa}</span>
                    {o.pmsf && (
                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-white/90 text-sky-800 dark:bg-slate-900/90 dark:text-sky-200" title="Symbol góry z płatkiem śniegu – opona sprawdzona w warunkach zimowych">
                        <Snowflake className="w-3 h-3" aria-hidden="true" /> 3PMSF
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div>
                      <span className={`sm:hidden inline-block mb-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${WYGLAD_KLASY[o.klasa]}`}>{KLASY.find((k) => k.id === o.klasa)!.nazwa}</span>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{o.marka}</div>
                      <div className="text-base sm:text-[17px] font-extrabold leading-snug text-slate-900 dark:text-white">{o.model}</div>
                      <div className="text-[13px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {rozmiar} {o.indeks} · {s.poj}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{zl(o.cena)} zł</span>
                        <span className="text-[13px] text-slate-500">/ szt.</span>
                      </div>
                      <div className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                        <div>Komplet 4 szt.: <b className="text-slate-900 dark:text-white">{zl(o.cena * 4)} zł</b></div>
                        {o.dostawa && <div>Dostawa: {o.dostawa}</div>}
                      </div>
                    </div>
                    {o.link && (
                      <div className="mt-auto space-y-1.5">
                        <LinkPartnerski href={o.link} modul="opony" partner="tanie-opony" karta={`dobor-${slug}`} className="flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold text-[15px]">
                          Zobacz ofertę <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </LinkPartnerski>
                        <div className="text-[11px] text-center text-slate-500">Link partnerski · tanie-opony.pl</div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {lista.length > ile && (
            <button type="button" onClick={() => setIle(ile + 24)} className="w-full min-h-[50px] rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-300 dark:ring-slate-700 font-bold text-slate-900 dark:text-white hover:ring-slate-400">
              Pokaż więcej opon ({lista.length - ile})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
