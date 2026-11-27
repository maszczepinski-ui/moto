// Proste ilustracje do kafelków poradników na stronie głównej, rysowane w kodzie (SVG).
export type Grafika = 'umowa' | 'licznik' | 'kolizja' | 'kluczyk' | 'vin' | 'oc' | 'przeglad' | 'import' | 'kontrolki';

export function Ilustracja({ rodzaj, className = '' }: { rodzaj: Grafika; className?: string }) {
  if (rodzaj === 'umowa') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <rect x="52" y="14" width="78" height="96" rx="8" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.25" transform="rotate(8 91 62)" />
        <rect x="38" y="10" width="78" height="98" rx="8" fill="white" fillOpacity="0.95" />
        <rect x="50" y="24" width="40" height="5" rx="2.5" fill="#0f172a" fillOpacity="0.8" />
        {[38, 47, 56, 65].map((y) => (
          <rect key={y} x="50" y={y} width={y === 65 ? 34 : 54} height="3" rx="1.5" fill="#0f172a" fillOpacity="0.18" />
        ))}
        <path d="M52 92c6-8 9 4 14-2s7-9 10 0 6 3 10-2" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="98" x2="104" y2="98" stroke="#0f172a" strokeOpacity="0.2" strokeWidth="1.5" />
        <g transform="rotate(-38 118 82)">
          <rect x="112" y="46" width="10" height="56" rx="3" fill="#38bdf8" />
          <rect x="112" y="46" width="10" height="10" rx="3" fill="#0c4a6e" />
          <path d="M112 102l5 10 5-10z" fill="#e0f2fe" />
        </g>
      </svg>
    );
  }
  if (rodzaj === 'licznik') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <circle cx="80" cy="70" r="46" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M42 88a42 42 0 1 1 76 0" stroke="white" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
        <path d="M96 33a42 42 0 0 1 22 55" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => {
          const kat = (Math.PI * (200 - i * 27.5)) / 180;
          return <line key={i} x1={80 + Math.cos(kat) * 32} y1={70 - Math.sin(kat) * 32} x2={80 + Math.cos(kat) * 26} y2={70 - Math.sin(kat) * 26} stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />;
        })}
        <line x1="80" y1="70" x2="108" y2="48" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="80" cy="70" r="6" fill="#fbbf24" />
        <rect x="52" y="86" width="56" height="16" rx="4" fill="#0f172a" fillOpacity="0.85" />
        {['1', '8', '7', '4', '3'].map((c, i) => (
          <text key={i} x={58 + i * 10.5} y="98" fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace" fill={i === 1 ? '#fbbf24' : 'white'}>
            {c}
          </text>
        ))}
        <path d="M120 22l6 11h-12z" fill="#fbbf24" />
        <rect x="119.2" y="25.5" width="1.6" height="4" fill="#0f172a" />
      </svg>
    );
  }
  if (rodzaj === 'kluczyk') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <rect x="30" y="30" width="62" height="62" rx="16" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.2" />
        <rect x="44" y="40" width="34" height="46" rx="12" fill="white" fillOpacity="0.95" />
        <circle cx="61" cy="54" r="5" fill="#0ea5e9" />
        <rect x="55" y="66" width="12" height="4" rx="2" fill="#0f172a" fillOpacity="0.25" />
        <rect x="55" y="74" width="12" height="4" rx="2" fill="#0f172a" fillOpacity="0.25" />
        <path d="M78 63h46l6 6-6 6h-8l-4-4-4 4h-6l-4-4-4 4H78z" fill="#7dd3fc" />
        <circle cx="61" cy="30" r="9" stroke="white" strokeOpacity="0.6" strokeWidth="3" />
        <path d="M112 22l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#fde68a" />
      </svg>
    );
  }
  if (rodzaj === 'vin') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <rect x="18" y="40" width="124" height="40" rx="8" fill="white" fillOpacity="0.95" />
        <rect x="18" y="40" width="16" height="40" rx="8" fill="#1d4ed8" />
        <rect x="26" y="40" width="8" height="40" fill="#1d4ed8" />
        <text x="40" y="66" fontSize="15" fontWeight="800" fontFamily="ui-monospace, monospace" fill="#0f172a" letterSpacing="1">WVW ZZZ 1J</text>
        <rect x="66" y="28" width="36" height="64" rx="4" fill="#fbbf24" fillOpacity="0.18" stroke="#fbbf24" strokeWidth="2" />
        <line x1="62" y1="60" x2="106" y2="60" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="120" cy="24" r="10" stroke="white" strokeOpacity="0.6" strokeWidth="3" />
        <line x1="127" y1="31" x2="136" y2="40" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (rodzaj === 'oc') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <path d="M70 12l38 13v28c0 26-17 44-38 52-21-8-38-26-38-52V25z" fill="white" fillOpacity="0.95" />
        <path d="M70 24l26 9v20c0 18-11 31-26 37z" fill="#6366f1" fillOpacity="0.25" />
        <path d="M56 58l10 10 20-22" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="122" cy="80" r="18" fill="#a5b4fc" />
        <text x="122" y="86" fontSize="17" fontWeight="900" textAnchor="middle" fill="#1e1b4b">%</text>
        <circle cx="130" cy="30" r="4" fill="white" fillOpacity="0.5" />
      </svg>
    );
  }
  if (rodzaj === 'przeglad') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <rect x="40" y="16" width="70" height="92" rx="8" fill="white" fillOpacity="0.95" />
        <rect x="60" y="10" width="30" height="12" rx="4" fill="#a78bfa" />
        {[36, 56, 76].map((y, i) => (
          <g key={y}>
            <rect x="50" y={y} width="14" height="14" rx="3" fill={i < 2 ? '#7c3aed' : 'none'} stroke="#7c3aed" strokeWidth="2" />
            {i < 2 && <path d={`M53 ${y + 7}l3 3 5-6`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            <rect x="70" y={y + 5} width="30" height="4" rx="2" fill="#0f172a" fillOpacity="0.2" />
          </g>
        ))}
        <circle cx="120" cy="84" r="16" fill="#c4b5fd" />
        <path d="M120 74v10l7 5" stroke="#2e1065" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (rodzaj === 'import') {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true" fill="none">
        <path d="M24 98c12 6 24 6 36 0s24-6 36 0 24 6 36 0" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 70h100l-12 22H44z" fill="white" fillOpacity="0.95" />
        <rect x="44" y="50" width="30" height="20" rx="3" fill="#38bdf8" />
        <rect x="78" y="50" width="30" height="20" rx="3" fill="#fb7c4c" />
        <rect x="61" y="32" width="30" height="18" rx="3" fill="#fbbf24" />
        <path d="M118 18v26" stroke="white" strokeOpacity="0.7" strokeWidth="2.5" />
        <rect x="118" y="18" width="20" height="5" fill="white" />
        <rect x="118" y="23" width="20" height="5" fill="#ef4444" />
      </svg>
    );
  }
  if (rodzaj === 'kontrolki') {
    return (
      <svg viewBox="14 22 132 76" className={className} aria-hidden="true" fill="none">
        <rect x="20" y="30" width="120" height="60" rx="30" fill="#0f172a" fillOpacity="0.7" stroke="white" strokeOpacity="0.2" />
        <path d="M44 72h22v-6l4-2v-8h-6l-3-4H49v4h-5z" stroke="#fbbf24" strokeWidth="3" strokeLinejoin="round" />
        <rect x="80" y="50" width="22" height="18" rx="3" stroke="#f87171" strokeWidth="3" />
        <line x1="86" y1="46" x2="86" y2="50" stroke="#f87171" strokeWidth="3" />
        <line x1="96" y1="46" x2="96" y2="50" stroke="#f87171" strokeWidth="3" />
        <circle cx="122" cy="60" r="9" stroke="#2dd4bf" strokeWidth="3" />
        <line x1="122" y1="55" x2="122" y2="61" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
        <circle cx="122" cy="65" r="1.5" fill="#2dd4bf" />
      </svg>
    );
  }
  return (
    <svg viewBox="16 10 132 96" className={className} aria-hidden="true" fill="none">
      {/* dwa auta z góry, które się stuknęły */}
      <g transform="rotate(-14 56 66)">
        <rect x="26" y="48" width="60" height="32" rx="10" fill="white" fillOpacity="0.92" />
        <rect x="40" y="53" width="18" height="22" rx="4" fill="#0f172a" fillOpacity="0.25" />
        <rect x="64" y="53" width="12" height="22" rx="4" fill="#0f172a" fillOpacity="0.15" />
      </g>
      <g transform="rotate(22 112 70)">
        <rect x="88" y="54" width="54" height="30" rx="10" fill="#fb7c4c" />
        <rect x="100" y="59" width="16" height="20" rx="4" fill="#0f172a" fillOpacity="0.25" />
        <rect x="122" y="59" width="11" height="20" rx="4" fill="#0f172a" fillOpacity="0.15" />
      </g>
      <path d="M90 40l4 10 9-5-4 10 10 2-9 5 6 8-10-2-1 10-6-8-7 7 1-10-10-1 8-6-6-8 10 1z" fill="#fde68a" fillOpacity="0.9" />
      <path d="M118 16l12 21h-24z" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="117" y="24" width="2" height="7" rx="1" fill="white" fillOpacity="0.8" />
      <circle cx="118" cy="33.5" r="1.2" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

