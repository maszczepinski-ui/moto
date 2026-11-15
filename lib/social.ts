// Posty na Instagram / TikTok / Facebook dla kanału MotoFormat.
// Kolejka postów leży na osobnej gałęzi „social” (social/kolejka.json), żeby zapisy nie przebudowywały strony.
// Tu: typy danych i rysowanie nakładek na płótnie (canvas) – w przeglądarce, w panelu admina.

export const GALAZ_SOCIAL = 'social';
export const PLIK_KOLEJKI = 'social/kolejka.json';
export const FOLDER_MEDIOW = 'social/media';

export type TypPostu = 'ciekawostka' | 'news' | 'pilne';
export type Uklad = 'dol' | 'liczba' | 'karta' | 'news' | 'pilne';
export type Format = 'post' | 'pion';
export type StatusPostu = 'szkic' | 'gotowy' | 'zaplanowany' | 'opublikowany';
export type Siec = 'instagram' | 'tiktok' | 'facebook' | 'youtube';

export interface Media {
  typ: 'obraz' | 'film';
  /** publiczny adres pliku (raw.githubusercontent.com) – z niego korzysta Metricool */
  url: string;
  sciezka: string;
}

export interface PostSocial {
  id: string;
  /** numer ciekawostki (#001) – tylko dla ciekawostek */
  nr?: number;
  typ: TypPostu;
  uklad: Uklad;
  format: Format;
  /** mały napis nad tytułem, np. „Marki” */
  kat: string;
  tytul: string;
  tekst: string;
  /** wielka liczba w układzie „Liczba”, np. „1963” */
  duze?: string;
  /** opis pod postem */
  opis: string;
  hashtagi: string;
  /** podpowiedź, jakie zdjęcie dodać */
  wskazowka?: string;
  zrodlo?: string;
  /** link do wpisu na moto-raport.pl (dla newsów) */
  link?: string;
  sieci: Siec[];
  media?: Media;
  status: StatusPostu;
  /** opublikuj jak najszybciej (news „na już”) */
  pilne?: boolean;
  /** zaplanowana data publikacji (ISO) – wpisuje Claude po zaplanowaniu w Metricool */
  plan?: string;
  metricool?: string;
  utworzono: string;
}

export interface Kolejka {
  posty: PostSocial[];
}

export const NAZWY_UKLADOW: Record<Uklad, string> = {
  dol: 'Tekst na dole',
  liczba: 'Wielka liczba',
  karta: 'Czarna karta z ramką',
  news: 'Z rynku (news)',
  pilne: 'Na już (pilne)'
};
export const UKLADY_TYPU: Record<TypPostu, Uklad[]> = {
  ciekawostka: ['dol', 'liczba', 'karta'],
  news: ['news', 'karta', 'dol'],
  pilne: ['pilne', 'news']
};
export const ROZMIAR: Record<Format, { w: number; h: number; nazwa: string }> = {
  post: { w: 1080, h: 1350, nazwa: 'Post 4:5 (1080×1350)' },
  pion: { w: 1080, h: 1920, nazwa: 'Pion 9:16 – rolka, stories, TikTok (1080×1920)' }
};

/** Pierwszy rok albo liczba z tekstu – podpowiedź do układu „Wielka liczba” */
export function liczbaZTekstu(...teksty: string[]): string {
  for (const t of teksty) {
    const rok = t.match(/\b(18[5-9]\d|19\d\d|20[0-4]\d)\b/);
    if (rok) return rok[1];
  }
  for (const t of teksty) {
    const l = t.match(/\b\d[\d \u00a0]{0,9}\d\b|\b\d\b/);
    if (l) return l[0].replace(/\u00a0/g, ' ');
  }
  return '';
}

/** Polska typografia: bez sierotek i bez łamania liczb */
export function typo(t: string) {
  return t
    .replace(/(\d) (?=\d)/g, '$1 ')
    .replace(/(^|[\s(])([wzioauWZIOAU]|do|na|po|od|za|we|ze|to) /g, '$1$2 ')
    .replace(/(\d) (?=(km|tys|mln|r\.|zł|KM|cm|m |A\b))/g, '$1 ');
}

// ——— zasoby: font Jost i logo ———
const FONT = 'JostSocial';
let zasoby: Promise<{ logoBiale: HTMLImageElement; logoCzarne: HTMLImageElement }> | null = null;

function obraz(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, zle) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => zle(new Error(`Nie wczytano ${src}`));
    i.src = src;
  });
}

export function zaladujZasoby() {
  if (!zasoby) {
    zasoby = (async () => {
      const f = [
        new FontFace(FONT, 'url(/fonts/jost-latin-wght-normal.woff2)', { weight: '100 900', unicodeRange: 'U+0000-00FF,U+2000-206F' }),
        new FontFace(FONT, 'url(/fonts/jost-latin-ext-wght-normal.woff2)', { weight: '100 900', unicodeRange: 'U+0100-02BA' })
      ];
      for (const x of f) document.fonts.add(await x.load());
      await Promise.all(['200', '400', '500', '700'].map((w) => document.fonts.load(`${w} 40px ${FONT}`, 'AĄłż')));
      const [logoBiale, logoCzarne] = await Promise.all([obraz('/social/motoformat-logo-biale.svg'), obraz('/social/motoformat-logo-czarne.svg')]);
      return { logoBiale, logoCzarne };
    })();
  }
  return zasoby;
}

// ——— pomocnicze funkcje rysowania ———
type Ctx = CanvasRenderingContext2D;
const font = (c: Ctx, waga: number, px: number) => (c.font = `${waga} ${px}px ${FONT}`);

function zawijaj(c: Ctx, tekst: string, szer: number): string[] {
  const wiersze: string[] = [];
  for (const akapit of tekst.split('\n')) {
    let w = '';
    for (const slowo of akapit.split(' ')) {
      const proba = w ? `${w} ${slowo}` : slowo;
      if (c.measureText(proba).width > szer && w) {
        wiersze.push(w);
        w = slowo;
      } else w = proba;
    }
    wiersze.push(w);
  }
  return wiersze;
}

/** Tekst z rozstrzeleniem liter (np. „M A R K I”) */
function rozstrzel(c: Ctx, t: string, x: number, y: number, odstep: number, doPrawej = false) {
  const znaki = [...t];
  const szer = znaki.reduce((s, z) => s + c.measureText(z).width + odstep, -odstep);
  let px = doPrawej ? x - szer : x;
  for (const z of znaki) {
    c.fillText(z, px, y);
    px += c.measureText(z).width + odstep;
  }
  return szer;
}

/** Dobiera rozmiar tytułu tak, żeby zmieścił się w maks. liczbie wierszy */
function dopasujTytul(c: Ctx, t: string, szer: number, rozmiary: number[], maksWierszy: number, waga = 700) {
  for (const r of rozmiary) {
    font(c, waga, r);
    const w = zawijaj(c, t, szer);
    if (w.length <= maksWierszy) return { r, w };
  }
  const r = rozmiary[rozmiary.length - 1];
  font(c, waga, r);
  return { r, w: zawijaj(c, t, szer) };
}

function gradient(c: Ctx, y0: number, y1: number, stopy: [number, number][], W: number) {
  const g = c.createLinearGradient(0, y0, 0, y1);
  for (const [p, a] of stopy) g.addColorStop(p, `rgba(10,10,10,${a})`);
  c.fillStyle = g;
  c.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
}

function cien(c: Ctx, wlacz: boolean) {
  c.shadowColor = wlacz ? 'rgba(0,0,0,.45)' : 'transparent';
  c.shadowBlur = wlacz ? 10 : 0;
  c.shadowOffsetY = wlacz ? 2 : 0;
}

function logo(c: Ctx, img: HTMLImageElement, x: number, y: number, szer: number) {
  c.drawImage(img, x, y, szer, (szer * img.naturalHeight) / img.naturalWidth || szer * 0.095);
}

export interface Kadr {
  /** położenie zdjęcia 0–100 (w poziomie i w pionie) */
  x: number;
  y: number;
  /** powiększenie 1–3 */
  zoom: number;
}
export const KADR_DOMYSLNY: Kadr = { x: 50, y: 50, zoom: 1 };

export interface OpcjeRysowania {
  /** zdjęcie albo klatka filmu pod nakładką; brak = przezroczyste tło (nakładka do montażu) */
  zdjecie?: CanvasImageSource & { width: number; height: number };
  kadr?: Kadr;
  /** szare tło w paski zamiast zdjęcia (podgląd w panelu) */
  tloPodgladu?: boolean;
  /** data do układu „news” */
  data?: string;
}

/** Rysuje cały post na płótnie o rozmiarze wg formatu */
export async function rysujPost(canvas: HTMLCanvasElement, p: PostSocial, o: OpcjeRysowania = {}) {
  const { logoBiale, logoCzarne } = await zaladujZasoby();
  const { w: W, h: H } = ROZMIAR[p.format];
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext('2d')!;
  c.clearRect(0, 0, W, H);
  c.textBaseline = 'alphabetic';

  // tło: zdjęcie (wykadrowane) albo podgląd
  if (o.zdjecie) {
    const k = o.kadr || KADR_DOMYSLNY;
    const iw = (o.zdjecie as HTMLVideoElement).videoWidth || o.zdjecie.width;
    const ih = (o.zdjecie as HTMLVideoElement).videoHeight || o.zdjecie.height;
    const s = Math.max(W / iw, H / ih) * k.zoom;
    const dw = iw * s;
    const dh = ih * s;
    c.drawImage(o.zdjecie, ((W - dw) * k.x) / 100, ((H - dh) * k.y) / 100, dw, dh);
  } else if (o.tloPodgladu) {
    c.fillStyle = '#2a2a2a';
    c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(255,255,255,.04)';
    c.lineWidth = 2;
    for (let i = -H; i < W; i += 26) {
      c.beginPath();
      c.moveTo(i, H);
      c.lineTo(i + H, 0);
      c.stroke();
    }
    if (p.wskazowka) {
      c.fillStyle = '#777';
      font(c, 500, 22);
      c.textAlign = 'center';
      const t = p.wskazowka.toUpperCase();
      zawijaj(c, t, W - 200).forEach((l, i) => c.fillText(l, W / 2, H * 0.34 + i * 34));
      c.textAlign = 'left';
    }
  }

  const pion = p.format === 'pion';
  const M = 72;
  // w pionie (rolki, TikTok) dół i góra są zasłonięte przyciskami aplikacji – trzymamy tekst dalej od krawędzi
  const gora = pion ? 210 : 72;
  const dol = pion ? 360 : 92;
  const kat = (p.kat || '').toUpperCase();
  const tytul = typo(p.tytul || '').toUpperCase();
  const tekst = typo(p.tekst || '');
  const nr = p.nr ? `#${String(p.nr).padStart(3, '0')}` : '';
  const szer = W - 2 * M;

  const naglowek = (img = logoBiale, z = true) => {
    cien(c, z);
    logo(c, img, M, gora, 250);
    if (nr) {
      c.fillStyle = '#fff';
      font(c, 500, 24);
      rozstrzel(c, nr, W - M, gora + 28, 24 * 0.24, true);
    }
    cien(c, false);
  };

  if (p.uklad === 'dol') {
    gradient(c, H, H * 0.38, [[0, 0.94], [0.3 / 0.62, 0.82], [0.5 / 0.62, 0.35], [1, 0]], W);
    gradient(c, 0, 220 + gora - 72, [[0, 0.45], [1, 0]], W);
    naglowek();
    // od dołu do góry
    font(c, 400, 33);
    const wt = tekst ? zawijaj(c, tekst, szer) : [];
    const lhT = 33 * 1.38;
    let y = H - dol - (wt.length ? (wt.length - 1) * lhT : 0);
    c.fillStyle = '#DCDCD6';
    wt.forEach((l, i) => c.fillText(l, M, y + i * lhT));
    y -= wt.length ? 33 + 26 : 0;
    c.fillStyle = '#fff';
    c.fillRect(M, y - 2, 70, 2);
    y -= 26 + 2;
    const { r, w } = dopasujTytul(c, tytul, szer, [80, 72, 64, 58, 52], 4);
    const lh = r * 1.04;
    y -= (w.length - 1) * lh + r * 0.12;
    w.forEach((l, i) => c.fillText(l, M, y + i * lh));
    y -= r * 0.88 + 26;
    font(c, 500, 24);
    c.fillStyle = '#CFCFC9';
    if (kat) rozstrzel(c, kat, M, y, 24 * 0.32);
  }

  if (p.uklad === 'liczba') {
    gradient(c, 0, H * 0.62, [[0, 0.88], [0.55, 0.6], [1, 0]], W);
    gradient(c, H, H * 0.7, [[0, 0.85], [1, 0]], W);
    naglowek();
    const duze = (p.duze || liczbaZTekstu(p.tytul, p.tekst) || nr.replace('#', '')).trim();
    let y = gora + 120;
    c.fillStyle = '#fff';
    let rozm = 300;
    font(c, 200, rozm);
    while (c.measureText(duze).width > szer && rozm > 120) font(c, 200, (rozm -= 10));
    y += rozm * 0.78;
    c.fillText(duze, M - rozm * 0.04, y);
    y += 56;
    c.fillRect(M, y, 70, 2);
    y += 34;
    const { r, w } = dopasujTytul(c, tytul, szer, [64, 58, 52, 46], 4);
    const lh = r * 1.06;
    y += r * 0.82;
    w.forEach((l, i) => c.fillText(l, M, y + i * lh));
    // tekst na dole
    font(c, 400, 33);
    const wt = tekst ? zawijaj(c, tekst, szer) : [];
    const lhT = 33 * 1.38;
    let yd = H - dol - (wt.length - 1) * lhT;
    c.fillStyle = '#E4E4DE';
    wt.forEach((l, i) => c.fillText(l, M, yd + i * lhT));
    yd -= 33 + 24;
    font(c, 500, 24);
    c.fillStyle = '#CFCFC9';
    if (kat && wt.length) rozstrzel(c, kat, M, yd, 24 * 0.32);
  }

  if (p.uklad === 'karta') {
    gradient(c, 0, 240 + gora - 72, [[0, 0.5], [1, 0]], W);
    // cienka ramka
    c.strokeStyle = 'rgba(255,255,255,.85)';
    c.lineWidth = 2;
    c.strokeRect(36, 36, W - 72, H - 72);
    cien(c, true);
    logo(c, logoBiale, M, gora, 250);
    cien(c, false);
    // czarna karta od dołu
    const pad = 56;
    const kx = 36;
    const ks = W - 36 - 120;
    const ws = ks - 2 * pad;
    const { r, w } = dopasujTytul(c, tytul, ws, [62, 56, 50, 46], 4);
    font(c, 400, 31);
    const wt = tekst ? zawijaj(c, tekst, ws) : [];
    const lhT = 31 * 1.4;
    const lh = r * 1.06;
    const wys = pad + 24 + 30 + (w.length - 1) * lh + r * 0.9 + (wt.length ? 30 + 31 * 0.9 + (wt.length - 1) * lhT : 0) + pad;
    const ky = H - 36 - (pion ? dol - 92 : 0) - wys - 0;
    c.fillStyle = 'rgba(10,10,10,.92)';
    c.fillRect(kx, ky, ks, wys);
    let y = ky + pad + 18;
    font(c, 500, 24);
    c.fillStyle = '#CFCFC9';
    if (kat) rozstrzel(c, kat, kx + pad, y, 24 * 0.32);
    if (nr) rozstrzel(c, nr, kx + ks - pad, y, 24 * 0.24, true);
    y += 30 + r * 0.9;
    font(c, 700, r);
    c.fillStyle = '#fff';
    w.forEach((l, i) => c.fillText(l, kx + pad, y + i * lh));
    y += (w.length - 1) * lh + 30 + 31 * 0.9;
    font(c, 400, 31);
    c.fillStyle = '#DCDCD6';
    wt.forEach((l, i) => c.fillText(l, kx + pad, y + i * lhT));
  }

  if (p.uklad === 'news') {
    gradient(c, 0, H * 0.66, [[0, 0.92], [0.55, 0.7], [1, 0]], W);
    gradient(c, H, H - 260 - (dol - 92), [[0, 0.7], [1, 0]], W);
    cien(c, true);
    logo(c, logoBiale, M, gora, 250);
    cien(c, false);
    c.fillStyle = '#fff';
    font(c, 500, 24);
    const data = o.data || new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    rozstrzel(c, data, W - M, gora + 28, 24 * 0.16, true);
    // etykieta
    let y = gora + 110;
    const et = (kat || 'Z RYNKU').toUpperCase();
    font(c, 500, 24);
    const szEt = [...et].reduce((s, z) => s + c.measureText(z).width + 24 * 0.3, -24 * 0.3);
    c.fillStyle = '#fff';
    c.fillRect(M, y, szEt + 40, 48);
    c.fillStyle = '#0a0a0a';
    rozstrzel(c, et, M + 20, y + 33, 24 * 0.3);
    y += 48 + 50;
    c.fillStyle = '#fff';
    const { r, w } = dopasujTytul(c, tytul, szer, [76, 68, 60, 54, 48], 5);
    const lh = r * 1.04;
    y += r * 0.82;
    w.forEach((l, i) => c.fillText(l, M, y + i * lh));
    y += (w.length - 1) * lh + 40;
    c.fillRect(M, y, 70, 2);
    y += 30 + 33;
    font(c, 400, 33);
    c.fillStyle = '#DCDCD6';
    zawijaj(c, tekst, szer).slice(0, 5).forEach((l, i) => c.fillText(l, M, y + i * 33 * 1.38));
    c.fillStyle = '#fff';
    font(c, 500, 24);
    rozstrzel(c, 'MOTO-RAPORT.PL', M, H - dol, 24 * 0.24);
  }

  if (p.uklad === 'pilne') {
    gradient(c, 0, 240 + gora - 72, [[0, 0.5], [1, 0]], W);
    cien(c, true);
    logo(c, logoBiale, M, gora, 250);
    cien(c, false);
    const pad = M;
    const { r, w } = dopasujTytul(c, tytul, szer, [72, 64, 58, 52], 4);
    font(c, 400, 32);
    const wt = tekst ? zawijaj(c, tekst, szer) : [];
    const lhT = 32 * 1.4;
    const lh = r * 1.04;
    const zapas = pion ? dol - 92 : 0;
    const wys = 64 + 24 + 34 + r * 0.9 + (w.length - 1) * lh + (wt.length ? 34 + 32 * 0.9 + (wt.length - 1) * lhT : 0) + 72 + zapas;
    const ky = H - wys;
    c.fillStyle = '#fff';
    c.fillRect(0, ky, W, wys);
    let y = ky + 64 + 18;
    c.fillStyle = '#0a0a0a';
    c.beginPath();
    c.arc(pad + 8, y - 9, 8, 0, Math.PI * 2);
    c.fill();
    font(c, 500, 24);
    rozstrzel(c, (kat || 'NA JUŻ').toUpperCase(), pad + 30, y, 24 * 0.3);
    logo(c, logoCzarne, W - pad - 170, y - 18, 170);
    y += 34 + r * 0.9;
    font(c, 700, r);
    w.forEach((l, i) => c.fillText(l, pad, y + i * lh));
    y += (w.length - 1) * lh + 34 + 32 * 0.9;
    font(c, 400, 32);
    c.fillStyle = '#333';
    wt.forEach((l, i) => c.fillText(l, pad, y + i * lhT));
  }
}

/** Płótno → plik (PNG z przezroczystością albo JPG) */
export function doPliku(canvas: HTMLCanvasElement, typ: 'image/png' | 'image/jpeg', jakosc = 0.92): Promise<Blob> {
  return new Promise((ok, zle) => canvas.toBlob((b) => (b ? ok(b) : zle(new Error('Nie udało się zapisać grafiki.'))), typ, jakosc));
}

export function base64ZPliku(b: Blob): Promise<string> {
  return new Promise((ok, zle) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(',')[1] || '');
    r.onerror = () => zle(new Error('Nie udało się odczytać pliku.'));
    r.readAsDataURL(b);
  });
}

/** Następny układ – inny niż w poprzednim poście tego samego typu, żeby feed nie był jednakowy */
export function nastepnyUklad(typ: TypPostu, poprzedni?: Uklad): Uklad {
  const u = UKLADY_TYPU[typ];
  if (!poprzedni || !u.includes(poprzedni)) return u[0];
  return u[(u.indexOf(poprzedni) + 1) % u.length];
}
