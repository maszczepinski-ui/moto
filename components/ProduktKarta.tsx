import { ExternalLink, Star, ThumbsUp, ThumbsDown, PlayCircle } from 'lucide-react';
import LinkPartnerski from '@/components/LinkPartnerski';
import { Produkt } from '@/lib/produkty';
import { bezpiecznyUrl } from '@/lib/bezpieczenstwo';

// Karta polecanego produktu: miejsce w rankingu, ocena, plusy/minusy i przycisk do porównania cen.
export default function ProduktKarta({ p: surowy, miejsce, zrodlo }: { p: Produkt; miejsce?: number; zrodlo: string }) {
  // adresy z panelu: tylko https (ochrona przed złośliwym linkiem wklejonym przez pomyłkę)
  const p = { ...surowy, link: bezpiecznyUrl(surowy.link, true), zdjecie: bezpiecznyUrl(surowy.zdjecie, true) };
  const film = p.film ? (/^[\w-]{11}$/.test(p.film) ? `https://www.youtube.com/watch?v=${p.film}` : `/filmy/${p.film}/`) : '';
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
      {(miejsce !== undefined || p.zdjecie) && (
      <div className="flex sm:flex-col items-center gap-3 sm:w-28 flex-shrink-0">
        {miejsce !== undefined && (
          <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${miejsce === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
            {miejsce}
          </span>
        )}
        {p.zdjecie && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.zdjecie} alt={p.nazwa} loading="lazy" className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-white" />
        )}
      </div>
      )}
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">{p.kategoria}</p>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{p.nazwa}</h3>
        {p.ocena ? (
          <p className="flex items-center gap-0.5" aria-label={`Ocena ${p.ocena} na 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= p.ocena! ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden="true" />
            ))}
            <span className="ml-1 text-xs text-slate-500">ocena MotoFormat</span>
          </p>
        ) : null}
        <p className="text-sm text-slate-700 dark:text-slate-300">{p.opis}</p>
        {((p.plusy && p.plusy.length > 0) || (p.minusy && p.minusy.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {p.plusy && p.plusy.length > 0 && (
              <ul className="space-y-1">
                {p.plusy.map((x) => (
                  <li key={x} className="flex gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" /> {x}
                  </li>
                ))}
              </ul>
            )}
            {p.minusy && p.minusy.length > 0 && (
              <ul className="space-y-1">
                {p.minusy.map((x) => (
                  <li key={x} className="flex gap-1.5">
                    <ThumbsDown className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" /> {x}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {p.link && (
            <LinkPartnerski
              href={p.link}
              modul="produkt"
              partner={(p.sklep || 'ceneo').toLowerCase()}
              karta={`${zrodlo}:${p.id}`}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Porównaj ceny{p.sklep ? ` na ${p.sklep}` : ''} <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </LinkPartnerski>
          )}
          {film && (
            <a href={film} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline">
              <PlayCircle className="w-4 h-4" aria-hidden="true" /> Test na filmie
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
