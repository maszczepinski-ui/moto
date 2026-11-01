import { Nadwozie, Wymiary } from '@/types/car-model';
import { fmt, NADWOZIE_NAZWY } from '@/lib/format';

// =====================================================================
// Rysunek techniczny (rzut boczny) rysowany z prawdziwych wymiarów auta.
// Kształt nadwozia to sylwetka poglądowa dla danego typu nadwozia,
// ale proporcje (długość, wysokość, rozstaw osi) pochodzą z danych modelu.
// =====================================================================

type P = [number, number]; // [u, v]: u = 0..1 od przodu do tyłu, v = 0..1 od ziemi do dachu

interface Profil {
  obrys: P[]; // górny obrys od przedniego dołu zderzaka do tylnego dołu zderzaka
  szyby: P[]; // obrys szyb bocznych
  slupekB?: number; // pozycja słupka B (u)
  drzwi: number[]; // linie podziału drzwi (u)
  prog: number; // wysokość progu (v)
  dachMiekki?: boolean;
}

const PROFILE: Record<Nadwozie, Profil> = {
  sedan: {
    obrys: [[0.006, 0.22], [0, 0.33], [0.012, 0.45], [0.06, 0.5], [0.29, 0.57], [0.42, 0.94], [0.48, 1], [0.66, 1], [0.79, 0.69], [0.95, 0.67], [0.996, 0.6], [1, 0.42], [0.99, 0.24], [0.965, 0.2]],
    szyby: [[0.32, 0.62], [0.43, 0.92], [0.49, 0.95], [0.65, 0.95], [0.76, 0.66]],
    slupekB: 0.555,
    drzwi: [0.34, 0.555, 0.72],
    prog: 0.17
  },
  kombi: {
    obrys: [[0.006, 0.22], [0, 0.33], [0.012, 0.45], [0.06, 0.5], [0.29, 0.57], [0.42, 0.94], [0.48, 1], [0.9, 0.99], [0.975, 0.93], [0.996, 0.6], [1, 0.42], [0.99, 0.24], [0.965, 0.2]],
    szyby: [[0.32, 0.62], [0.43, 0.92], [0.49, 0.95], [0.89, 0.94], [0.95, 0.88], [0.955, 0.66]],
    slupekB: 0.555,
    drzwi: [0.34, 0.555, 0.74],
    prog: 0.17
  },
  hatchback: {
    obrys: [[0.008, 0.22], [0, 0.34], [0.015, 0.47], [0.07, 0.52], [0.3, 0.58], [0.45, 0.95], [0.52, 1], [0.78, 0.98], [0.95, 0.74], [0.995, 0.6], [1, 0.42], [0.99, 0.24], [0.96, 0.2]],
    szyby: [[0.33, 0.63], [0.46, 0.92], [0.52, 0.95], [0.77, 0.93], [0.9, 0.72]],
    slupekB: 0.58,
    drzwi: [0.35, 0.58, 0.78],
    prog: 0.17
  },
  coupe: {
    obrys: [[0.006, 0.22], [0, 0.33], [0.012, 0.45], [0.06, 0.5], [0.31, 0.57], [0.46, 0.93], [0.53, 0.97], [0.63, 0.97], [0.82, 0.7], [0.95, 0.67], [0.996, 0.6], [1, 0.42], [0.99, 0.24], [0.965, 0.2]],
    szyby: [[0.34, 0.62], [0.47, 0.91], [0.53, 0.93], [0.62, 0.93], [0.76, 0.66]],
    drzwi: [0.35, 0.64],
    prog: 0.16
  },
  kabriolet: {
    obrys: [[0.006, 0.22], [0, 0.33], [0.012, 0.45], [0.06, 0.5], [0.31, 0.57], [0.46, 0.93], [0.53, 0.97], [0.63, 0.97], [0.82, 0.7], [0.95, 0.67], [0.996, 0.6], [1, 0.42], [0.99, 0.24], [0.965, 0.2]],
    szyby: [[0.34, 0.62], [0.47, 0.91], [0.53, 0.93], [0.62, 0.93], [0.76, 0.66]],
    drzwi: [0.35, 0.64],
    prog: 0.16,
    dachMiekki: true
  },
  suv: {
    obrys: [[0.008, 0.28], [0, 0.4], [0.012, 0.55], [0.07, 0.6], [0.28, 0.65], [0.4, 0.95], [0.46, 1], [0.9, 0.99], [0.97, 0.93], [0.995, 0.62], [1, 0.45], [0.99, 0.3], [0.965, 0.26]],
    szyby: [[0.31, 0.69], [0.41, 0.93], [0.47, 0.95], [0.89, 0.94], [0.945, 0.88], [0.95, 0.7]],
    slupekB: 0.55,
    drzwi: [0.33, 0.55, 0.74],
    prog: 0.24
  },
  van: {
    obrys: [[0.008, 0.22], [0, 0.32], [0.01, 0.45], [0.05, 0.5], [0.16, 0.58], [0.3, 0.94], [0.36, 1], [0.95, 0.99], [0.99, 0.94], [1, 0.42], [0.99, 0.24], [0.965, 0.2]],
    szyby: [[0.2, 0.62], [0.3, 0.91], [0.36, 0.95], [0.94, 0.94], [0.97, 0.9], [0.97, 0.64]],
    slupekB: 0.43,
    drzwi: [0.21, 0.43, 0.72],
    prog: 0.17
  }
};

const R_KOLA_MM = 315; // promień koła (przeciętne koło osobówki)

interface Props {
  nadwozie: Nadwozie;
  wymiary: Wymiary;
  podpis: string;
}

export default function CarBlueprint({ nadwozie, wymiary, podpis }: Props) {
  const p = PROFILE[nadwozie] ?? PROFILE.sedan;
  const { dlugoscMm: L, wysokoscMm: H, rozstawOsiMm: WB } = wymiary;

  const W = 820;
  const x0 = 60;
  const ziemia = 250;
  const s = 660 / L; // skala: mm → piksele
  const X = (u: number) => x0 + u * L * s;
  const Y = (v: number) => ziemia - v * H * s;

  const zwisPrzod = (L - WB) * 0.44;
  const osP = x0 + zwisPrzod * s;
  const osT = osP + WB * s;
  const r = R_KOLA_MM * s;
  const kolY = ziemia - r;
  const nadkole = r * 1.13;
  const progY = Y(p.prog);

  // Dolna linia nadwozia z wycięciami nadkoli
  const dol = (() => {
    const tyl = p.obrys[p.obrys.length - 1];
    const przod = p.obrys[0];
    const dy = Math.sqrt(Math.max(0, nadkole * nadkole - (kolY - progY) ** 2));
    // próg poniżej środka koła → nadkole to „duży” łuk przechodzący nad kołem
    const duzy = progY > kolY ? 1 : 0;
    return [
      `L ${X(tyl[0])} ${progY}`,
      `L ${osT + dy} ${progY}`,
      `A ${nadkole} ${nadkole} 0 ${duzy} 0 ${osT - dy} ${progY}`,
      `L ${osP + dy} ${progY}`,
      `A ${nadkole} ${nadkole} 0 ${duzy} 0 ${osP - dy} ${progY}`,
      `L ${X(przod[0])} ${progY}`,
      'Z'
    ].join(' ');
  })();

  const obrys = 'M ' + p.obrys.map(([u, v]) => `${X(u).toFixed(1)} ${Y(v).toFixed(1)}`).join(' L ') + ' ' + dol;
  const szyby = 'M ' + p.szyby.map(([u, v]) => `${X(u).toFixed(1)} ${Y(v).toFixed(1)}`).join(' L ') + ' Z';
  const linia = Y(0.6);
  const prawy = X(1);

  const dim = 'stroke-slate-400 dark:stroke-slate-500';
  const txt = 'fill-slate-600 dark:fill-slate-300 font-mono text-[12px]';

  return (
    <figure className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
      <svg viewBox={`0 0 ${W} 330`} className="w-full h-auto" role="img" aria-label={`Rysunek techniczny: ${podpis}`}>
        <defs>
          <pattern id="siatka" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.6" />
          </pattern>
          <marker id="strz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
        </defs>
        <rect width={W} height="330" fill="url(#siatka)" />

        {/* ziemia */}
        <line x1="20" y1={ziemia} x2={W - 20} y2={ziemia} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1" />

        {/* nadwozie */}
        <g fill="none" className="stroke-steel-700 dark:stroke-steel-300" strokeWidth="1.4" strokeLinejoin="round">
          <path d={obrys} />
          <path d={szyby} strokeWidth="1" strokeDasharray={p.dachMiekki ? '5 3' : undefined} />
          {p.slupekB && <line x1={X(p.slupekB)} y1={Y(0.63)} x2={X(p.slupekB) + 4} y2={Y(0.94)} strokeWidth="1" />}
          {p.drzwi.map((u) => (
            <line key={u} x1={X(u)} y1={linia + 8} x2={X(u)} y2={progY - 4} strokeWidth="0.8" />
          ))}
          <line x1={X(0.03)} y1={linia} x2={X(0.97)} y2={linia} strokeWidth="0.6" strokeDasharray="6 4" />
          {/* lampy */}
          <path d={`M ${X(0.004)} ${Y(0.38)} L ${X(0.05)} ${Y(0.42)}`} strokeWidth="1" />
          <path d={`M ${X(0.996)} ${Y(0.5)} L ${X(0.955)} ${Y(0.52)}`} strokeWidth="1" />
          {/* koła */}
          {[osP, osT].map((x) => (
            <g key={x}>
              <circle cx={x} cy={kolY} r={r} />
              <circle cx={x} cy={kolY} r={r * 0.62} strokeWidth="0.9" />
              <circle cx={x} cy={kolY} r={r * 0.12} strokeWidth="0.9" />
              <line x1={x} y1={kolY - r - 6} x2={x} y2={ziemia + 30} className={dim} strokeWidth="0.6" strokeDasharray="4 3" />
            </g>
          ))}
        </g>

        {/* wymiar: rozstaw osi */}
        <line x1={osP} y1={ziemia + 26} x2={osT} y2={ziemia + 26} className={dim} strokeWidth="0.8" markerStart="url(#strz)" markerEnd="url(#strz)" />
        <text x={(osP + osT) / 2} y={ziemia + 21} textAnchor="middle" className={txt}>
          rozstaw osi {fmt(WB)} mm
        </text>

        {/* wymiar: długość */}
        <line x1={x0} y1={ziemia} x2={x0} y2={ziemia + 62} className={dim} strokeWidth="0.6" />
        <line x1={prawy} y1={ziemia} x2={prawy} y2={ziemia + 62} className={dim} strokeWidth="0.6" />
        <line x1={x0} y1={ziemia + 56} x2={prawy} y2={ziemia + 56} className={dim} strokeWidth="0.8" markerStart="url(#strz)" markerEnd="url(#strz)" />
        <text x={(x0 + prawy) / 2} y={ziemia + 51} textAnchor="middle" className={txt}>
          długość {fmt(L)} mm
        </text>

        {/* wymiar: wysokość */}
        <line x1={prawy + 10} y1={Y(1)} x2={prawy + 48} y2={Y(1)} className={dim} strokeWidth="0.6" />
        <line x1={prawy + 40} y1={ziemia} x2={prawy + 40} y2={Y(1)} className={dim} strokeWidth="0.8" markerStart="url(#strz)" markerEnd="url(#strz)" />
        <text
          x={prawy + 56}
          y={(ziemia + Y(1)) / 2}
          textAnchor="middle"
          className={txt}
          transform={`rotate(-90 ${prawy + 56} ${(ziemia + Y(1)) / 2})`}
        >
          {fmt(H)} mm
        </text>
      </svg>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
        <span>
          Rzut boczny • nadwozie: {NADWOZIE_NAZWY[nadwozie].toLowerCase()} • szerokość {fmt(wymiary.szerokoscMm)} mm
        </span>
        <span>Sylwetka poglądowa, proporcje według wymiarów modelu</span>
      </figcaption>
    </figure>
  );
}
