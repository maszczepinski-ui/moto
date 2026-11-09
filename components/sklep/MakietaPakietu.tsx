// Makieta pakietu: trzy „kartki” ułożone w stos (check-lista, umowa, protokół) – rysowane w CSS, bez zdjęć.
// Używana na stronie Niezbędnika (duża) i na stronie głównej (mała).

function Linie({ ile, szer = ['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/4'] }: { ile: number; szer?: string[] }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: ile }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full bg-slate-200 ${szer[i % szer.length]}`} />
      ))}
    </div>
  );
}

export default function MakietaPakietu({ mala = false }: { mala?: boolean }) {
  const kartka = 'absolute rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 p-4 text-slate-900';
  return (
    <div className={`relative mx-auto ${mala ? 'w-56 h-60' : 'w-72 sm:w-80 h-80 sm:h-[22rem]'}`} aria-hidden="true">
      {/* protokół – najniżej */}
      <div className={`${kartka} inset-x-6 top-0 bottom-16 rotate-[7deg] origin-bottom-right`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Plik 4</p>
        <p className="text-xs font-extrabold mb-3">Protokół zdawczo-odbiorczy</p>
        <Linie ile={6} />
      </div>
      {/* umowa – w środku */}
      <div className={`${kartka} inset-x-3 top-6 bottom-10 -rotate-[6deg] origin-bottom-left`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Plik 2</p>
        <p className="text-xs font-extrabold">Umowa kupna-sprzedaży</p>
        <p className="text-[10px] font-bold text-steel-700 mb-3">PRO · klauzule dla kupującego</p>
        <Linie ile={5} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-400 text-center">Sprzedający</div>
          <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-400 text-center">Kupujący</div>
        </div>
      </div>
      {/* check-lista – na wierzchu */}
      <div className={`${kartka} inset-x-0 ${mala ? 'top-[4.5rem]' : 'top-24'} bottom-0`}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Plik 1</p>
        <p className="text-xs font-extrabold mb-3">Check-lista oględzin PRO</p>
        <ul className="space-y-2">
          {[
            ['VIN w trzech miejscach', true, true],
            ['Właściciel = osoba z dowodu', true, true],
            ['Zimny start i dym z wydechu', false, true],
            ['Wilgoć pod wykładziną', true, false],
            ['Jazda próbna min. 20 minut', false, false]
          ].slice(0, mala ? 4 : 5).map(([t, stop, zaznaczone]) => (
            <li key={t as string} className="flex items-center gap-2 text-[10px] font-semibold">
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${zaznaczone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                {zaznaczone ? '✓' : ''}
              </span>
              <span className="flex-1 truncate">{t as string}</span>
              {stop && <span className="rounded bg-rose-600 text-white px-1 text-[8px] font-black">STOP</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* znaczek z ceną/plikami */}
      <div className={`absolute -right-3 -bottom-3 rounded-full bg-amber-400 text-slate-900 font-black shadow-lg flex flex-col items-center justify-center leading-none ${mala ? 'w-16 h-16 text-xs' : 'w-20 h-20 text-sm'}`}>
        <span className={mala ? 'text-lg' : 'text-2xl'}>6</span>
        plików
      </div>
    </div>
  );
}
