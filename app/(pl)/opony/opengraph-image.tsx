import { ImageResponse } from 'next/og';
import { site } from '@/config/site';

// Obrazek do udostępniania strony o oponach
export const dynamic = 'force-static';
export const alt = 'Opony pod kontrolą – MotoRaport';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Obrazek() {
  const kafle = [
    ['7°C', 'kiedy zmienić na zimowe'],
    ['1,6 mm', 'minimum bieżnika'],
    ['DOT', 'wiek opony'],
    ['bar', 'ciśnienie z tabliczki']
  ];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: 'linear-gradient(135deg, #0c4a6e 0%, #020617 65%)', color: 'white' }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, color: '#7dd3fc' }}>PORADNIK · OPONY</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1 }}>Opony pod kontrolą.</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 44 }}>
            {kafle.map(([w, o]) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 40, fontWeight: 800 }}>{w}</div>
                <div style={{ fontSize: 20, color: '#cbd5e1' }}>{o}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#94a3b8' }}>
          <div style={{ fontWeight: 700, color: 'white' }}>{site.name}</div>
          <div>{`${site.url.replace('https://', '')}/opony/`}</div>
        </div>
      </div>
    ),
    size
  );
}
