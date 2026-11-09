// Podkład mapy w kolorach strony: bierzemy darmowy styl „Positron” z OpenFreeMap (wolno używać także na stronach zarabiających)
// i przemalowujemy go w przeglądarce – jasny w odcieniach „steel”, ciemny w odcieniach „slate” (tryb ciemny systemu).
// Gdy styl albo WebGL nie zadziała, mapa wraca do zwykłych kafelków OpenStreetMap (patrz MapaObiektow).

export const STYL_OPENFREEMAP = 'https://tiles.openfreemap.org/styles/positron';
export const ATRYBUCJA_OFM =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · dane &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">autorzy OpenStreetMap</a>';

type Warstwa = { id: string; type: string; source?: string; paint?: Record<string, unknown>; layout?: Record<string, unknown> };
type Styl = { layers: Warstwa[]; [k: string]: unknown };

/** kolor wypełnienia / linii / tekstu dla warstw o nazwach pasujących do wzorca – pierwsze dopasowanie wygrywa */
const JASNY: [RegExp, string][] = [
  [/^background$/, '#f4f6f8'],
  [/^water$/, '#cfdeeb'],
  [/^waterway$/, '#b9cfe2'],
  [/^park$/, '#e4ece3'],
  [/^landcover_wood$/, '#dde7dc'],
  [/^landuse_residential$/, '#eceef1'],
  [/^building$/, '#e4e7eb'],
  [/^highway_motorway_(inner|bridge_inner)$/, '#fbe7d3'],
  [/^highway_motorway_(casing|bridge_casing)$/, '#e8c9a8'],
  [/^water_name/, '#26517a'],
  [/^boundary/, '#97badb']
];

const CIEMNY: [RegExp, string][] = [
  [/^background$/, '#0f172a'],
  [/^water$/, '#0f2438'],
  [/^waterway$/, '#16304a'],
  [/^park$/, '#12231d'],
  [/^landcover_wood$/, '#11211b'],
  [/^landcover_(ice_shelf|glacier)$/, '#1e293b'],
  [/^landuse_residential$/, '#151f33'],
  [/^building$/, '#1b2538'],
  [/^aeroway/, '#1e293b'],
  [/^road_(area_)?pier$/, '#0f172a'],
  [/^tunnel_motorway_inner$/, '#334155'],
  [/^highway_motorway_(inner|bridge_inner)$/, '#5b4636'],
  [/^highway_motorway_subtle$/, '#3b3027'],
  [/casing$/, '#1e293b'],
  [/^highway_major_inner$/, '#334155'],
  [/^highway_major_subtle$/, '#273449'],
  [/^highway_(minor|path)$/, '#243044'],
  [/^railway.*dashline$/, '#1e293b'],
  [/^railway/, '#334155'],
  [/^boundary/, '#475569'],
  [/^water_name/, '#97badb'],
  [/^highway-name|^waterway_line_label|^airport/, '#94a3b8'],
  [/^label_(other|state)$/, '#94a3b8'],
  [/^label_/, '#e2e8f0']
];

function kolor(w: Warstwa, paleta: [RegExp, string][]): string | undefined {
  return paleta.find(([re]) => re.test(w.id))?.[1];
}

function przemaluj(oryginal: Styl, ciemny: boolean): Styl {
  const styl: Styl = JSON.parse(JSON.stringify(oryginal));
  const paleta = ciemny ? CIEMNY : JASNY;
  // cieniowanie terenu z Natural Earth wygląda w naszych kolorach brudno – chowamy je
  styl.layers = styl.layers.filter((w) => !/ne2|shaded|hillshade/i.test(w.id) && !/ne2|shaded/i.test(w.source || ''));
  for (const w of styl.layers) {
    const k = kolor(w, paleta);
    w.paint ||= {};
    if (k) {
      if (w.type === 'background') w.paint['background-color'] = k;
      else if (w.type === 'fill') w.paint['fill-color'] = k;
      else if (w.type === 'line') w.paint['line-color'] = k;
      else if (w.type === 'symbol') w.paint['text-color'] = k;
    }
    if (w.type === 'symbol' && ciemny) {
      w.paint['text-halo-color'] = 'rgba(15,23,42,0.85)';
      // ikony (tarcze dróg, lotniska) są jasne – w trybie ciemnym przygaszamy je
      w.paint['icon-opacity'] = 0.7;
    }
  }
  return styl;
}

let pamiec: Promise<Styl> | null = null;

/** Gotowy styl podkładu (jasny albo ciemny). Rzuca błąd, gdy serwer stylu nie odpowiada. */
export async function stylMapy(ciemny: boolean): Promise<Styl> {
  pamiec ||= fetch(STYL_OPENFREEMAP).then((r) => {
    if (!r.ok) throw new Error('Brak stylu mapy');
    return r.json() as Promise<Styl>;
  });
  try {
    return przemaluj(await pamiec, ciemny);
  } catch (e) {
    pamiec = null;
    throw e;
  }
}

export function webglDziala(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
