import fs from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import { site } from '@/config/site';
import { TYPY, jestTypem, aktualnoscPoSlugu, opublikowaneAktualnosci, type TypAktualnosci } from '@/lib/aktualnosci';
import { formatDate } from '@/lib/format';

// Obrazek do udostępniania aktualności (Facebook, Messenger, X, Google Discover).
// Gdy wpis ma własne zdjęcie – zdjęcie w tle z tytułem; bez zdjęcia – grafika w kolorze działu.
export const alt = 'Aktualności MotoRaport';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return [...(Object.keys(TYPY) as TypAktualnosci[]).map((t) => ({ slug: t })), ...opublikowaneAktualnosci().map((a) => ({ slug: a.slug }))];
}

const KOLOR: Record<TypAktualnosci, string> = { 'akcje-serwisowe': '#fbbf24', komunikaty: '#38bdf8', premiery: '#a78bfa', 'jakie-auto': '#34d399' };

function zdjecieBase64(adres: string): string {
  try {
    const plik = path.join(process.cwd(), 'public', adres.replace(/^\//, ''));
    return `data:image/jpeg;base64,${fs.readFileSync(plik).toString('base64')}`;
  } catch {
    return '';
  }
}

export default async function Obrazek({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = jestTypem(slug) ? undefined : aktualnoscPoSlugu(slug);
  const typ: TypAktualnosci = a ? a.typ : jestTypem(slug) ? slug : 'komunikaty';
  const kolor = KOLOR[typ];
  const tytul = a ? a.tytul : TYPY[typ].nazwa;
  const tlo = a?.zdjecie ? zdjecieBase64(a.zdjecie.duze) : '';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: 'linear-gradient(135deg, #0f172a 0%, #020617 60%, #1e293b 100%)', color: 'white' }}>
        {tlo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tlo} alt="" width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: tlo ? 'linear-gradient(180deg, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.55) 45%, rgba(2,6,23,0.92) 100%)' : 'transparent'
          }}
        />
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', padding: '8px 18px', borderRadius: 999, background: kolor, color: '#0f172a', fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>{TYPY[typ].krotko.toUpperCase()}</div>
            {a && <div style={{ fontSize: 24, color: '#e2e8f0' }}>{formatDate(a.data)}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: tytul.length > 60 ? 58 : 68, fontWeight: 800, lineHeight: 1.08, maxWidth: 1040 }}>{tytul}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, fontSize: 26, color: '#cbd5e1' }}>
              <div style={{ fontWeight: 700, color: 'white' }}>{site.name}</div>
              <div>{`${site.url.replace('https://', '')}/aktualnosci`}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
