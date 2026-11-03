'use client';
// Zakładka „Logo i ikona” panelu admina.
// Wgrywasz obrazek → przeglądarka sama przygotowuje wszystkie potrzebne rozmiary (favicona, ikona iPhone'a, ikony aplikacji)
// → jednym zapisem trafiają do repozytorium na GitHubie → Vercel publikuje stronę z nowym logo i ikoną.
// Pliki SVG są zamieniane na PNG – to bezpieczniejsze (plik SVG może zawierać skrypt).
import { useEffect, useState } from 'react';
import { ImageUp, Save, RotateCcw, Trash2, Smartphone, Globe, Moon, Sun, Info } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiPelne = (sciezka: string, metoda?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: object) => Promise<any>;
export type Marka = { logo: string; logoCiemne: string; logoTryb: 'obok' | 'zamiast'; ikonaWersja: string };

const karta = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4';
const etykieta = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';
const PLIK_PANEL = 'data/panel.json';
const MAKS_MB = 3;

// Pliki ikon na stronie (te same nazwy co domyślne – dzięki temu nic więcej nie trzeba zmieniać)
const IKONY = {
  favicon: 'app/icon.svg',
  apple: 'app/apple-icon.png',
  i192: 'public/ikony/ikona-192.png',
  i512: 'public/ikony/ikona-512.png',
  maskable: 'public/ikony/ikona-maskable-512.png'
};
// Kopie domyślnych ikon – do przycisku „Przywróć domyślną ikonę”
const DOMYSLNE: Record<keyof typeof IKONY, string> = {
  favicon: '/marka/domyslne/icon.svg',
  apple: '/marka/domyslne/apple-icon.png',
  i192: '/marka/domyslne/ikona-192.png',
  i512: '/marka/domyslne/ikona-512.png',
  maskable: '/marka/domyslne/ikona-maskable-512.png'
};

function b64Tekst(t: string) {
  const b = new TextEncoder().encode(t);
  let s = '';
  b.forEach((x) => (s += String.fromCharCode(x)));
  return btoa(s);
}
const z64 = (b: string) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\n/g, '')), (c) => c.charCodeAt(0)));
const dataUrlNaB64 = (u: string) => u.slice(u.indexOf(',') + 1);

function wczytajObraz(plik: File): Promise<HTMLImageElement> {
  return new Promise((ok, blad) => {
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(plik.type)) return blad(new Error('Wybierz plik PNG, JPG, WebP albo SVG.'));
    if (plik.size > MAKS_MB * 1024 * 1024) return blad(new Error(`Plik jest za duży (maks. ${MAKS_MB} MB).`));
    const r = new FileReader();
    r.onerror = () => blad(new Error('Nie udało się odczytać pliku.'));
    r.onload = () => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => blad(new Error('Ten plik nie jest poprawnym obrazkiem.'));
      img.src = String(r.result);
    };
    r.readAsDataURL(plik);
  });
}

/** Rysuje obrazek wyśrodkowany w kwadracie. skala – jaką część kwadratu ma zająć (maskable: ok. 0,7) */
function kwadrat(img: HTMLImageElement, bok: number, tlo: string | null, skala = 1, zaokraglenie = 0): string {
  const c = document.createElement('canvas');
  c.width = c.height = bok;
  const x = c.getContext('2d')!;
  if (tlo) {
    x.fillStyle = tlo;
    if (zaokraglenie) {
      x.beginPath();
      x.roundRect(0, 0, bok, bok, zaokraglenie);
      x.fill();
    } else x.fillRect(0, 0, bok, bok);
  }
  const w = img.naturalWidth || img.width || bok;
  const h = img.naturalHeight || img.height || bok;
  const m = (bok * skala) / Math.max(w, h);
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, (bok - w * m) / 2, (bok - h * m) / 2, w * m, h * m);
  return c.toDataURL('image/png');
}

/** Logo: PNG o wysokości 120 px (ostre na ekranach o dużej gęstości), szerokość proporcjonalna, maks. 720 px */
function logoPng(img: HTMLImageElement): string {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  let wys = 120;
  let szer = Math.round((w / h) * wys);
  if (szer > 720) {
    szer = 720;
    wys = Math.round((h / w) * szer);
  }
  const c = document.createElement('canvas');
  c.width = szer;
  c.height = wys;
  const x = c.getContext('2d')!;
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, szer, wys);
  return c.toDataURL('image/png');
}

/** Favicona jako SVG z osadzonym PNG – plik app/icon.svg zostaje w tym samym miejscu */
function faviconSvg(png: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image width="256" height="256" href="${png}"/></svg>\n`;
}

async function pobierzB64(url: string): Promise<string> {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Brak pliku ${url} na stronie.`);
  const buf = new Uint8Array(await r.arrayBuffer());
  let s = '';
  buf.forEach((x) => (s += String.fromCharCode(x)));
  return btoa(s);
}

export default function LogoIkona({ api, branch, marka, zmiany, onZapisano }: { api: ApiPelne; branch: string; marka: Marka; zmiany: boolean; onZapisano: () => void }) {
  const [logo, setLogo] = useState<string>(''); // data URL nowego logo
  const [logoCiemne, setLogoCiemne] = useState<string>('');
  const [tryb, setTryb] = useState<Marka['logoTryb']>(marka.logoTryb);
  const [zrodloIkony, setZrodloIkony] = useState<HTMLImageElement | null>(null);
  const [tlo, setTlo] = useState('#ffffff');
  const [przezroczysta, setPrzezroczysta] = useState(true);
  const [podglad, setPodglad] = useState<{ fav: string; apple: string; mask: string } | null>(null);
  const [status, setStatus] = useState<{ typ: 'ok' | 'blad' | 'info'; tekst: string } | null>(null);
  const [praca, setPraca] = useState(false);

  useEffect(() => setTryb(marka.logoTryb), [marka.logoTryb]);

  useEffect(() => {
    if (!zrodloIkony) return setPodglad(null);
    setPodglad({
      fav: kwadrat(zrodloIkony, 256, przezroczysta ? null : tlo, 1, przezroczysta ? 0 : 48),
      apple: kwadrat(zrodloIkony, 180, tlo, 0.82),
      mask: kwadrat(zrodloIkony, 512, tlo, 0.7)
    });
  }, [zrodloIkony, tlo, przezroczysta]);

  async function wybierz(e: React.ChangeEvent<HTMLInputElement>, cel: 'logo' | 'ciemne' | 'ikona') {
    const plik = e.target.files?.[0];
    e.target.value = '';
    if (!plik) return;
    try {
      const img = await wczytajObraz(plik);
      if (cel === 'ikona') {
        if (Math.min(img.naturalWidth || 512, img.naturalHeight || 512) < 192) setStatus({ typ: 'info', tekst: 'Obrazek jest mały – ikona może być nieostra. Najlepiej wgraj kwadrat co najmniej 512 × 512 px.' });
        else setStatus(null);
        setZrodloIkony(img);
      } else {
        const png = logoPng(img);
        if (cel === 'logo') setLogo(png);
        else setLogoCiemne(png);
        setStatus(null);
      }
    } catch (er) {
      setStatus({ typ: 'blad', tekst: (er as Error).message });
    }
  }

  /** Jeden commit: pliki + zmiana w data/panel.json */
  async function zatwierdz(pliki: { sciezka: string; b64: string }[], zmienMarke: (m: Marka) => Marka, opis: string) {
    if (zmiany) {
      setStatus({ typ: 'blad', tekst: 'Masz niezapisane zmiany w innych zakładkach. Najpierw je zapisz (zielony przycisk), potem wróć tutaj.' });
      return;
    }
    setPraca(true);
    setStatus({ typ: 'info', tekst: 'Zapisuję na GitHubie…' });
    try {
      const ref = await api(`/git/ref/heads/${branch}`);
      const rodzic = ref.object.sha as string;
      const commit = await api(`/git/commits/${rodzic}`);
      const panelPlik = await api(`/contents/${PLIK_PANEL}?ref=${branch}`);
      const panel = JSON.parse(z64(panelPlik.content));
      panel.marka = zmienMarke({ logo: '', logoCiemne: '', logoTryb: 'obok', ikonaWersja: '', ...panel.marka });
      const wszystkie = [...pliki, { sciezka: PLIK_PANEL, b64: b64Tekst(JSON.stringify(panel, null, 2) + '\n') }];
      const drzewo = [];
      for (const p of wszystkie) {
        const blob = await api('/git/blobs', 'POST', { content: p.b64, encoding: 'base64' });
        drzewo.push({ path: p.sciezka, mode: '100644', type: 'blob', sha: blob.sha });
      }
      const nowe = await api('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: drzewo });
      const nowy = await api('/git/commits', 'POST', { message: `Panel admina: ${opis}`, tree: nowe.sha, parents: [rodzic] });
      await api(`/git/refs/heads/${branch}`, 'PATCH', { sha: nowy.sha });
      setStatus({ typ: 'ok', tekst: 'Zapisano! Strona z nowym wyglądem pojawi się za kilka minut (Vercel buduje ją od nowa).' });
      setLogo('');
      setLogoCiemne('');
      setZrodloIkony(null);
      onZapisano();
    } catch (er) {
      setStatus({ typ: 'blad', tekst: (er as Error).message });
    } finally {
      setPraca(false);
    }
  }

  const wersja = () => String(Date.now());

  async function zapiszLogo() {
    const w = wersja();
    const pliki: { sciezka: string; b64: string }[] = [];
    if (logo) pliki.push({ sciezka: 'public/marka/logo.png', b64: dataUrlNaB64(logo) });
    if (logoCiemne) pliki.push({ sciezka: 'public/marka/logo-ciemne.png', b64: dataUrlNaB64(logoCiemne) });
    await zatwierdz(
      pliki,
      (m) => ({
        ...m,
        logoTryb: tryb,
        logo: logo ? `/marka/logo.png?v=${w}` : m.logo,
        logoCiemne: logoCiemne ? `/marka/logo-ciemne.png?v=${w}` : m.logoCiemne
      }),
      'nowe logo'
    );
  }

  async function usunLogo() {
    if (!confirm('Usunąć logo? W nagłówku znów pojawi się sama nazwa strony z ikoną pinezki.')) return;
    await zatwierdz([], (m) => ({ ...m, logo: '', logoCiemne: '' }), 'usunięcie logo');
  }

  async function zapiszIkone() {
    if (!zrodloIkony || !podglad) return;
    const png256 = kwadrat(zrodloIkony, 256, przezroczysta ? null : tlo, 1, przezroczysta ? 0 : 48);
    const i192 = kwadrat(zrodloIkony, 192, przezroczysta ? null : tlo, przezroczysta ? 1 : 0.86);
    const i512 = kwadrat(zrodloIkony, 512, przezroczysta ? null : tlo, przezroczysta ? 1 : 0.86);
    await zatwierdz(
      [
        { sciezka: IKONY.favicon, b64: b64Tekst(faviconSvg(png256)) },
        { sciezka: IKONY.apple, b64: dataUrlNaB64(podglad.apple) },
        { sciezka: IKONY.i192, b64: dataUrlNaB64(i192) },
        { sciezka: IKONY.i512, b64: dataUrlNaB64(i512) },
        { sciezka: IKONY.maskable, b64: dataUrlNaB64(podglad.mask) }
      ],
      (m) => ({ ...m, ikonaWersja: wersja() }),
      'nowa ikona strony'
    );
  }

  async function przywrocIkone() {
    if (!confirm('Przywrócić domyślną ikonę strony?')) return;
    try {
      const pliki = await Promise.all((Object.keys(IKONY) as (keyof typeof IKONY)[]).map(async (k) => ({ sciezka: IKONY[k], b64: await pobierzB64(DOMYSLNE[k]) })));
      await zatwierdz(pliki, (m) => ({ ...m, ikonaWersja: wersja() }), 'domyślna ikona strony');
    } catch (er) {
      setStatus({ typ: 'blad', tekst: (er as Error).message });
    }
  }

  const obecneLogo = logo || marka.logo;
  const obecneCiemne = logoCiemne || marka.logoCiemne || obecneLogo;

  return (
    <div className="space-y-6">
      {status && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            status.typ === 'ok' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : status.typ === 'blad' ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200' : 'bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200'
          }`}
        >
          {status.tekst}
        </p>
      )}

      {/* ───────── LOGO ───────── */}
      <section className={karta}>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Logo w nagłówku strony</h2>
          <p className="text-sm text-slate-500">Najlepiej poziome logo na przezroczystym tle (PNG lub SVG). Zostanie dopasowane do wysokości nagłówka.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-steel-500 p-4 cursor-pointer text-center">
            <ImageUp className="w-6 h-6 mx-auto text-steel-600" aria-hidden="true" />
            <span className="block mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">Wybierz logo</span>
            <span className="block text-xs text-slate-500">na jasne tło · PNG, SVG, JPG, WebP</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => wybierz(e, 'logo')} />
          </label>
          <label className="block rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-steel-500 p-4 cursor-pointer text-center">
            <Moon className="w-6 h-6 mx-auto text-steel-600" aria-hidden="true" />
            <span className="block mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">Logo na ciemne tło</span>
            <span className="block text-xs text-slate-500">opcjonalnie – np. białe, dla trybu ciemnego</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => wybierz(e, 'ciemne')} />
          </label>
        </div>

        <fieldset>
          <legend className={etykieta}>Jak pokazać logo</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['obok', 'Logo + nazwa strony obok'],
                ['zamiast', 'Samo logo (bez nazwy)']
              ] as const
            ).map(([v, n]) => (
              <label key={v} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${tryb === v ? 'border-steel-600 bg-steel-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" name="tryb-logo" checked={tryb === v} onChange={() => setTryb(v)} /> {n}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Podgląd nagłówka */}
        <div className="space-y-2">
          <div className={etykieta}>Podgląd nagłówka</div>
          {[
            { tlo: 'bg-white', tekst: 'text-slate-900', src: obecneLogo, ikona: Sun },
            { tlo: 'bg-slate-900', tekst: 'text-white', src: obecneCiemne, ikona: Moon }
          ].map(({ tlo: t, tekst, src, ikona: I }, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl ${t} ring-1 ring-slate-200 dark:ring-slate-700 h-16 px-4`}>
              <I className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="h-9 w-auto max-w-[200px] object-contain" />
              ) : (
                <span className="text-xs text-slate-400">(brak logo – jest pinezka)</span>
              )}
              {(!src || tryb === 'obok') && <span className={`font-bold ${tekst}`}>MotoFormat</span>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={zapiszLogo} disabled={praca || (!logo && !logoCiemne && tryb === marka.logoTryb)} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl">
            <Save className="w-4 h-4" aria-hidden="true" /> Zapisz logo
          </button>
          {marka.logo && (
            <button type="button" onClick={usunLogo} disabled={praca} className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl">
              <Trash2 className="w-4 h-4" aria-hidden="true" /> Usuń logo
            </button>
          )}
        </div>
      </section>

      {/* ───────── IKONA ───────── */}
      <section className={karta}>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ikona strony (favicon) i ikona aplikacji</h2>
          <p className="text-sm text-slate-500">
            Jeden obrazek – kwadratowy, najlepiej 512 × 512 px lub większy. Panel sam przygotuje: ikonę w karcie przeglądarki i w Google, ikonę na iPhone&apos;a i ikony aplikacji na Androida.
          </p>
        </div>

        <label className="block rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-steel-500 p-5 cursor-pointer text-center">
          <ImageUp className="w-7 h-7 mx-auto text-steel-600" aria-hidden="true" />
          <span className="block mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">Wybierz obrazek ikony</span>
          <span className="block text-xs text-slate-500">PNG, SVG, JPG, WebP · kwadrat · do {MAKS_MB} MB</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => wybierz(e, 'ikona')} />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tlo-ikony" className={etykieta}>
              Kolor tła ikony (iPhone i Android)
            </label>
            <div className="flex items-center gap-2">
              <input id="tlo-ikony" type="color" value={tlo} onChange={(e) => setTlo(e.target.value)} className="h-10 w-14 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
              <span className="font-mono text-sm text-slate-600 dark:text-slate-300">{tlo}</span>
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 pt-5">
            <input type="checkbox" checked={przezroczysta} onChange={(e) => setPrzezroczysta(e.target.checked)} className="mt-1" />
            Przezroczyste tło favicony (gdy obrazek ma własny kształt, np. okrągły)
          </label>
        </div>

        {podglad && (
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
            <div className="space-y-2">
              <div className="mx-auto flex items-center gap-2 rounded-t-lg bg-slate-200 dark:bg-slate-700 px-3 py-2 w-full max-w-[11rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={podglad.fav} alt="" className="w-4 h-4" />
                <span className="truncate text-[11px] text-slate-700 dark:text-slate-200">MotoFormat</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" /> Karta przeglądarki
              </div>
            </div>
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={podglad.apple} alt="" className="mx-auto w-16 h-16 rounded-[1.1rem] shadow" />
              <div className="inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> iPhone
              </div>
            </div>
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={podglad.mask} alt="" className="mx-auto w-16 h-16 rounded-full shadow" />
              <div className="inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> Android
              </div>
            </div>
          </div>
        )}

        <p className="flex gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" /> Google odświeża ikonę w wynikach wyszukiwania sam – czasem trwa to kilka dni lub tygodni. Przeglądarki też pamiętają starą ikonę; po zmianie odśwież stronę (Ctrl+F5).
        </p>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={zapiszIkone} disabled={praca || !podglad} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl">
            <Save className="w-4 h-4" aria-hidden="true" /> Zapisz ikonę
          </button>
          <button type="button" onClick={przywrocIkone} disabled={praca} className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Przywróć domyślną ikonę
          </button>
        </div>
      </section>
    </div>
  );
}
