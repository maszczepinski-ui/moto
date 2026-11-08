import { ImageResponse } from 'next/og';
import { site } from '@/config/site';

// Obrazek pokazywany przy udostępnianiu strony (Facebook, Messenger, X itp.)
export const dynamic = 'force-static';
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1c3d5c 0%, #0f2438 100%)',
          color: 'white'
        }}
      >
        <div style={{ fontSize: 34, color: '#f97316', fontWeight: 700, letterSpacing: 4 }}>{site.name.toUpperCase()}</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24, maxWidth: 950 }}>
          Ile ich jeździ w Polsce i gdzie?
        </div>
        <div style={{ fontSize: 32, color: '#e1ecf5', marginTop: 32 }}>
          Mapa województw • roczniki • silniki • wymiary
        </div>
      </div>
    ),
    size
  );
}
