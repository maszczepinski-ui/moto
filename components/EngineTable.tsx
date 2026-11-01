import { Silnik } from '@/types/car-model';
import { fmt } from '@/lib/format';

export default function EngineTable({ silniki }: { silniki: Silnik[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">Gama silników</caption>
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500">
          <tr>
            <th scope="col" className="text-left font-semibold px-4 py-2.5">Wersja</th>
            <th scope="col" className="hidden sm:table-cell text-left font-semibold px-4 py-2.5">Kod silnika</th>
            <th scope="col" className="text-right font-semibold px-4 py-2.5">Pojemność</th>
            <th scope="col" className="text-right font-semibold px-4 py-2.5">Moc</th>
            <th scope="col" className="text-left font-semibold px-4 py-2.5">Paliwo</th>
            <th scope="col" className="hidden sm:table-cell text-left font-semibold px-4 py-2.5">Lata</th>
          </tr>
        </thead>
        <tbody>
          {silniki.map((s) => (
            <tr key={s.nazwa + s.lata} className="border-t border-slate-100 dark:border-slate-800">
              <th scope="row" className="text-left px-4 py-2 font-semibold text-slate-900 dark:text-white">{s.nazwa}</th>
              <td className="hidden sm:table-cell px-4 py-2 font-mono text-xs text-slate-600 dark:text-slate-400">{s.kod ?? '—'}</td>
              <td className="px-3 sm:px-4 py-2 text-right tabular-nums whitespace-nowrap">{fmt(s.pojemnoscCm3)} cm³</td>
              <td className="px-3 sm:px-4 py-2 text-right tabular-nums whitespace-nowrap">{s.mocKm} KM</td>
              <td className="px-4 py-2">{s.paliwo}</td>
              <td className="hidden sm:table-cell px-4 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{s.lata}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
