import Okruszki, { type Okruszek } from '@/components/Okruszki';
import RysunekOpony from '@/components/opony/RysunekOpony';

// Ciemny nagłówek stron doboru opon: okruszki, tytuł, opis, krótkie fakty i opona z felgą po prawej
export default function NaglowekOpon({ okruszki, tytul, opis, fakty, plakietka }: {
  okruszki: Okruszek[];
  tytul: string;
  opis: string;
  fakty: string[];
  plakietka?: { gora: string; dol: string };
}) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-28 sm:pt-10 sm:pb-32 flex items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="pr-24 sm:pr-0 [&_nav]:text-slate-400 [&_span]:text-slate-300 [&_a:hover]:text-white">
            <Okruszki sciezka={okruszki} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] pr-24 sm:pr-0">{tytul}</h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{opis}</p>
          <ul className="flex flex-wrap gap-2 pt-1">
            {fakty.map((f) => (
              <li key={f} className="text-[13px] font-semibold px-3 py-1.5 rounded-full bg-white/10 text-slate-200">
                {f}
              </li>
            ))}
          </ul>
        </div>
        {/* telefon: opona wystaje z prawego górnego rogu */}
        <RysunekOpony className="sm:hidden absolute -top-6 -right-16 w-48 h-48 opacity-90" akcent={false} />
        <div className="hidden sm:block relative flex-none w-[260px] lg:w-[300px] h-[220px]">
          <RysunekOpony className="absolute -top-12 -right-8 w-[300px] h-[300px] lg:w-[330px] lg:h-[330px]" etykieta="Opona z felgą" />
          {plakietka && (
            <div className="absolute left-0 bottom-0 bg-rust-600 text-white rounded-2xl px-4 py-2.5 shadow-xl">
              <div className="text-[11px] font-semibold opacity-85">{plakietka.gora}</div>
              <div className="text-lg font-extrabold">{plakietka.dol}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
