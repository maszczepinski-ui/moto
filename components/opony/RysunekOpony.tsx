// Rysunek opony z felgą (nagłówek doboru opon i zastępczy obrazek, gdy zdjęcie z feedu się nie wczyta)
export default function RysunekOpony({ className = '', akcent = true, etykieta }: { className?: string; akcent?: boolean; etykieta?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role={etykieta ? 'img' : undefined} aria-label={etykieta} aria-hidden={etykieta ? undefined : true}>
      <circle cx="100" cy="100" r="96" fill="#020617" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#1e293b" strokeWidth="12" strokeDasharray="7 5" />
      <circle cx="100" cy="100" r="80" fill="#111827" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#1f2937" strokeWidth="2" />
      <circle cx="100" cy="100" r="56" fill="#94a3b8" />
      <circle cx="100" cy="100" r="52" fill="#cbd5e1" />
      <g stroke="#64748b" strokeWidth="9" strokeLinecap="round">
        <path d="M100 92V52" />
        <path d="M107.6 97.5L145.5 85.2" />
        <path d="M104.7 106.5L128.2 138.9" />
        <path d="M95.3 106.5L71.8 138.9" />
        <path d="M92.4 97.5L54.5 85.2" />
      </g>
      <circle cx="100" cy="100" r="15" fill="#475569" />
      <circle cx="100" cy="100" r="6" fill={akcent ? '#fb923c' : '#94a3b8'} />
      {akcent && <path d="M30 70A76 76 0 0 1 70 30" fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" opacity="0.8" />}
    </svg>
  );
}
