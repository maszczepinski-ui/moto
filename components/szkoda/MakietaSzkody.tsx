// Makieta pakietu po szkodzie: kosztorys z zaznaczonymi zaniżeniami na wierzchu i gotowa reklamacja pod spodem.
// Rysowana w CSS (bez zdjęć), w tym samym stylu co makieta Niezbędnika. Liczby są przykładowe – to ilustracja.

function Linie({ ile, szer = ['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/4'] }: { ile: number; szer?: string[] }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: ile }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full bg-slate-200 ${szer[i % szer.length]}`} />
      ))}
    </div>
  );
}

const POZYCJE: [string, string, string | null][] = [
  ['Zderzak przedni (Q)', '412,00', 'zamiennik'],
  ['Potrącenie części 25%', '−286,00', 'potrącenie'],
  ['Rabat lakier 15%', '−121,50', 'rabat'],
  ['Robocizna 14 h × 120 zł', '1 680,00', 'stawka'],
  ['Podatek VAT', '0,00', 'bez VAT']
];

export default function MakietaSzkody({ mala = false }: { mala?: boolean }) {
  const kartka = 'absolute rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 p-4 text-slate-900';
  return (
    <div className={`relative mx-auto ${mala ? 'w-56 h-60' : 'w-72 sm:w-80 h-80 sm:h-[22rem]'}`} aria-hidden="true">
      {/* odpowiedź na odmowę – najniżej */}
      <div className={`${kartka} inset-x-6 top-0 bottom-16 rotate-[7deg] origin-bottom-right`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Etap 2</p>
        <p className="text-xs font-extrabold mb-3">Odpowiedź na odmowę</p>
        <Linie ile={6} />
      </div>
      {/* reklamacja – w środku */}
      <div className={`${kartka} inset-x-3 top-6 bottom-10 -rotate-[6deg] origin-bottom-left`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Etap 1</p>
        <p className="text-xs font-extrabold">Reklamacja</p>
        <p className="text-[10px] font-bold text-steel-700 mb-3">z żądaniem dopłaty · Word</p>
        <Linie ile={5} />
        <div className="mt-3 flex justify-end">
          <div className="w-24 border-t border-slate-300 pt-1 text-[8px] text-slate-400 text-center">podpis</div>
        </div>
      </div>
      {/* kosztorys – na wierzchu */}
      <div className={`${kartka} inset-x-0 ${mala ? 'top-[4.5rem]' : 'top-24'} bottom-0`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Sprawdzacz</p>
        <p className="text-xs font-extrabold mb-2.5">Kalkulacja naprawy</p>
        <ul className="space-y-1.5">
          {POZYCJE.slice(0, mala ? 4 : 5).map(([t, kw, flaga]) => (
            <li key={t} className="flex items-center gap-2 text-[10px] font-semibold">
              <span className="flex-1 truncate">{t}</span>
              <span className="tabular-nums text-slate-500">{kw}</span>
              {flaga && <span className="w-[4.5rem] text-center rounded bg-amber-400 text-slate-900 px-1 text-[8px] font-black uppercase">{flaga}</span>}
            </li>
          ))}
        </ul>
        {!mala && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-2.5 py-1.5">
            <span className="text-[10px] font-bold text-emerald-800">Pismo gotowe</span>
            <span className="text-[10px] font-black text-emerald-700">✓ Word · druk</span>
          </div>
        )}
      </div>
      {/* znaczek: darmowy test */}
      <div className={`absolute -right-3 -bottom-3 rounded-full bg-amber-400 text-slate-900 font-black shadow-lg flex flex-col items-center justify-center leading-none text-center ${mala ? 'w-16 h-16 text-[10px]' : 'w-20 h-20 text-xs'}`}>
        <span className={mala ? 'text-sm' : 'text-base'}>Test</span>
        za darmo
      </div>
    </div>
  );
}
