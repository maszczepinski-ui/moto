'use client';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

// Wybór rozmiaru opony: szerokość → profil → średnica (podpowiada tylko rozmiary, które są w sklepie)
export default function WyborRozmiaru({ rozmiary, start }: { rozmiary: [number, number, number][]; start?: [number, number, number] }) {
  const [szer, setSzer] = useState(start?.[0] ?? 205);
  const [profil, setProfil] = useState(start?.[1] ?? 55);
  const [felga, setFelga] = useState(start?.[2] ?? 16);

  const unikalne = (l: number[]) => [...new Set(l)].sort((a, b) => a - b);
  const szerokosci = useMemo(() => unikalne(rozmiary.map((r) => r[0])), [rozmiary]);
  const profile = useMemo(() => unikalne(rozmiary.filter((r) => r[0] === szer).map((r) => r[1])), [rozmiary, szer]);
  const felgi = useMemo(() => unikalne(rozmiary.filter((r) => r[0] === szer && r[1] === profil).map((r) => r[2])), [rozmiary, szer, profil]);

  // po zmianie szerokości lub profilu wybieramy pierwszą pasującą wartość, żeby nie zostać z rozmiarem, którego nie ma
  const p = profile.includes(profil) ? profil : profile[0];
  const f = felgi.includes(felga) ? felga : unikalne(rozmiary.filter((r) => r[0] === szer && r[1] === p).map((r) => r[2]))[0];
  const adres = p && f ? `/dobor-opon/${szer}-${p}-r${f}/` : '/dobor-opon/';

  const pole = 'h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 text-lg font-bold text-slate-900 dark:text-white text-center';
  const etykieta = 'flex flex-col gap-1.5 text-[13px] font-semibold text-slate-600 dark:text-slate-400';
  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-5">
      <div className="flex items-end gap-2 sm:gap-3">
        <label className={`${etykieta} w-24 sm:w-28`}>
          Szerokość
          <select className={pole} value={szer} onChange={(e) => setSzer(Number(e.target.value))}>
            {szerokosci.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        <span className="pb-3 text-2xl text-slate-400" aria-hidden="true">/</span>
        <label className={`${etykieta} w-20 sm:w-24`}>
          Profil
          <select className={pole} value={p} onChange={(e) => setProfil(Number(e.target.value))}>
            {profile.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
        <span className="pb-3 text-2xl text-slate-400" aria-hidden="true">R</span>
        <label className={`${etykieta} w-20 sm:w-24`}>
          Średnica
          <select className={pole} value={f} onChange={(e) => setFelga(Number(e.target.value))}>
            {unikalne(rozmiary.filter((r) => r[0] === szer && r[1] === p).map((r) => r[2])).map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <a href={adres} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold">
        <Search className="w-4 h-4" aria-hidden="true" /> Pokaż opony {szer}/{p} R{f}
      </a>
      <p className="lg:flex-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3">
        Rozmiar znajdziesz na boku opony, np. <b className="text-slate-900 dark:text-white">205/55 R16 91H</b>. Trzy pierwsze liczby to szerokość, profil i średnica felgi.
      </p>
    </div>
  );
}
