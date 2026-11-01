import mapa from '@/data/mapa-wojewodztw-etykiety.json';
import { slugWojewodztwa } from '@/lib/wojewodztwa';

interface Props {
  /** województwo do podświetlenia (kod TERYT) */
  wyroznione?: string;
  /** opcjonalne etykiety i kolory dla województw */
  etykiety?: Record<string, string>;
  klasy?: Record<string, string>;
  linki?: boolean;
  opis: string;
}

// Mała mapa Polski, której województwa są klikalnymi linkami do swoich stron
export default function MiniMapa({ wyroznione, etykiety, klasy, linki = true, opis }: Props) {
  return (
    <svg viewBox={mapa.viewBox} className="w-full h-auto" role="img" aria-label={opis}>
      {mapa.regions.map((r) => {
        const klasa =
          klasy?.[r.teryt] ??
          (r.teryt === wyroznione ? 'fill-rust-500 dark:fill-rust-500' : 'fill-slate-200 dark:fill-slate-800 hover:fill-steel-200 dark:hover:fill-steel-800');
        const ksztalt = (
          <g className={`${klasa} stroke-white dark:stroke-slate-950 transition-colors`}>
            <title>{r.nazwa}</title>
            <use href={`/mapa-wojewodztw.svg#w${r.teryt}`} width="100%" height="100%" strokeWidth={1.2} strokeLinejoin="round" />
          </g>
        );
        return linki ? (
          <a key={r.teryt} href={`/wojewodztwa/${slugWojewodztwa(r.teryt)}/`} aria-label={r.nazwa}>
            {ksztalt}
          </a>
        ) : (
          <g key={r.teryt}>{ksztalt}</g>
        );
      })}
      {etykiety &&
        mapa.regions.map((r) => (
          <text
            key={`t-${r.teryt}`}
            x={r.cx}
            y={r.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[15px] font-bold pointer-events-none fill-slate-800 dark:fill-slate-100"
          >
            {etykiety[r.teryt]}
          </text>
        ))}
    </svg>
  );
}
