import { ImageResponse } from 'next/og';
import mapa from '@/data/mapa-wojewodztw.json';
import tlo from '@/data/cepik/tlo.json';
import { CarModel } from '@/types/car-model';
import { site } from '@/config/site';
import { NADWOZIE_NAZWY } from '@/lib/format';

// Obrazek pokazywany przy udostępnianiu karty modelu (Facebook, Messenger, X, WhatsApp) – 1200×630 px.
// Next.js sam dodaje do strony znacznik <meta property="og:image">.
export const rozmiarObrazka = { width: 1200, height: 630 };

const tloWoj = tlo.wojewodztwa as Record<string, number>;
const fmt = (n: number) => n.toLocaleString('pl-PL').replace(/\s/g, ' ');

function kolor(indeks: number) {
  if (indeks < 0.8) return '#97badb';
  if (indeks < 1.2) return '#e2e8f0';
  if (indeks < 1.5) return '#fed7aa';
  if (indeks < 2) return '#fb923c';
  return '#c2410c';
}

function Kafelek({ etykieta, wartosc }: { etykieta: string; wartosc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 18px', width: 300 }}>
      <div style={{ fontSize: 20, color: '#97badb' }}>{etykieta}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 2 }}>{wartosc}</div>
    </div>
  );
}

export function obrazKarty(m: CarModel) {
  const c = m.cepik;
  const suma = c.wojewodztwa.reduce((s, w) => s + w.liczba, 0) || 1;
  const udzial = suma / tlo.razem;
  const indeksy = new Map(c.wojewodztwa.map((w) => [w.teryt, tloWoj[w.teryt] ? w.liczba / tloWoj[w.teryt] / udzial : 0]));
  const lider = mapa.regions.reduce((a, r) => ((indeksy.get(r.teryt) ?? 0) > (indeksy.get(a.teryt) ?? 0) ? r : a), mapa.regions[0]);
  const lidInd = indeksy.get(lider.teryt) ?? 0;
  const nazwa = `${m.model}${m.generacja ? ` ${m.generacja}` : ''}`;
  const lata = (m.lataProdukcji.match(/\d{4}/g) || []).slice(0, 2).join('–') || '—';
  const hyb = (c.hybrydy ?? 0) + (c.elektryczne ?? 0);
  const czwarty =
    hyb >= c.liczbaWPolsce * 0.1
      ? { etykieta: 'Hybrydy i elektryki', wartosc: fmt(hyb) }
      : c.sredniRocznik
      ? { etykieta: 'Średni rocznik', wartosc: String(Math.round(c.sredniRocznik)) }
      : { etykieta: 'Nowe od XI 2019', wartosc: fmt(c.noweOdPaczki ?? 0) };

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #0f2438 0%, #1c3d5c 100%)', color: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 0 44px 60px', width: 690 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 28, color: '#fb923c', fontWeight: 700, letterSpacing: 2 }}>{m.marka.toUpperCase()}</div>
            <div style={{ fontSize: nazwa.length > 16 ? 56 : 72, fontWeight: 800, lineHeight: 1.05, marginTop: 4 }}>{nazwa}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, width: 620 }}>
            <Kafelek etykieta="Zarejestrowanych w Polsce" wartosc={fmt(c.liczbaWPolsce)} />
            <Kafelek etykieta="Lata produkcji" wartosc={lata} />
            <Kafelek etykieta="Nadwozie" wartosc={NADWOZIE_NAZWY[m.nadwozia[0]] || '—'} />
            <Kafelek etykieta={czwarty.etykieta} wartosc={czwarty.wartosc} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {lidInd >= 1.2 && (
              <div style={{ display: 'flex', fontSize: 24, color: '#fed7aa', marginBottom: 8 }}>
                {`Zagłębie: ${lider.nazwa.toLowerCase()} – ${lidInd.toFixed(1).replace('.', ',')}× częściej niż średnio`}
              </div>
            )}
            <div style={{ display: 'flex', fontSize: 22, color: '#97badb' }}>{`${site.url.replace('https://', '')} • dane CEPiK`}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 510 }}>
          <svg width="460" height="430" viewBox={mapa.viewBox}>
            {mapa.regions.map((r) => (
              <path key={r.teryt} d={r.d} fill={kolor(indeksy.get(r.teryt) ?? 0)} stroke="#0f2438" strokeWidth="2" />
            ))}
          </svg>
        </div>
      </div>
    ),
    rozmiarObrazka
  );
}
