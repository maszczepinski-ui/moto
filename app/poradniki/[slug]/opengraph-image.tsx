import { ImageResponse } from 'next/og';
import { site } from '@/config/site';
import { PORADNIKI, poradnik, KATEGORIE, czasCzytania } from '@/lib/poradniki';

// Obrazek do udostępniania poradnika (Facebook, Messenger, X, wyniki Google Discover)
export const alt = 'Poradnik MotoRaport';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return PORADNIKI.map((p) => ({ slug: p.slug }));
}

const KOLOR = { kupno: '#38bdf8', kolizja: '#fb923c', bezpieczenstwo: '#34d399', codzienne: '#a78bfa', sprawdzenie: '#fbbf24' } as const;

export default async function Obrazek({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = poradnik(slug)!;
  const kolor = KOLOR[p.kategoria];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: 'linear-gradient(135deg, #0f172a 0%, #020617 60%, #1e293b 100%)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: kolor }} />
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, color: kolor }}>{KATEGORIE[p.kategoria].nazwa.toUpperCase()}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: p.tytul.length > 55 ? 62 : 72, fontWeight: 800, lineHeight: 1.08, maxWidth: 1040 }}>{p.tytul}</div>
          {p.liczby && (
            <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
              {p.liczby.slice(0, 3).map((l) => (
                <div key={l.w} style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontSize: 38, fontWeight: 800 }}>{l.w}</div>
                  <div style={{ fontSize: 20, color: '#cbd5e1', maxWidth: 300 }}>{l.o}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#94a3b8' }}>
          <div style={{ fontWeight: 700, color: 'white' }}>{site.name}</div>
          <div>{`${czasCzytania(p)} min czytania · ${site.url.replace('https://', '')}`}</div>
        </div>
      </div>
    ),
    size
  );
}
