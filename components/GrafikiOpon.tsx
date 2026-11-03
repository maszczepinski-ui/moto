// Grafiki na stronę /opony/: jak czytać bok opony i gdzie w aucie szukać ciśnienia.
// Rysunki są w SVG (lekkie, ostre na każdym ekranie, bez zdjęć z zewnątrz).

const OZNACZENIA = [
  { n: 1, t: 'Rozmiar, indeks nośności i prędkości', o: '205/55 R16 91V – szerokość, profil, średnica felgi, nośność i maksymalna prędkość. Rozszyfrujesz to niżej w teście „Rozmiar”.', kolor: '#38bdf8' },
  { n: 2, t: 'Rodzaj opony: zimowa czy całoroczna', o: 'Symbol góry z płatkiem śniegu (3PMSF) to opona sprawdzona w warunkach zimowych. Samo „M+S” (błoto i śnieg) to tylko deklaracja producenta, bez testu.', kolor: '#a78bfa' },
  { n: 3, t: 'Data produkcji (DOT)', o: 'Ostatnie 4 cyfry kodu DOT: tydzień i rok. 2321 = 23. tydzień 2021 r.', kolor: '#34d399' },
  { n: 4, t: 'Wskaźnik zużycia TWI', o: 'Mały trójkąt lub napis TWI na boku pokazuje, gdzie w rowkach bieżnika są progi 1,6 mm. Gdy bieżnik zrówna się z progiem – opona do wymiany.', kolor: '#fbbf24' },
  { n: 5, t: 'MAX PRESS – to nie jest ciśnienie do pompowania', o: 'To największe ciśnienie, jakie opona wytrzyma. Pompuj według tabliczki w aucie (niżej), nie według tego napisu.', kolor: '#fb7185' }
];

// Pozycje napisów na łuku opony (kąt w stopniach: 0 = góra, ujemny = w lewo)
const NAPISY = [
  { n: 5, kat: -47, tekst: 'MAX PRESS 350 kPa (51 PSI)', rozmiar: 14 },
  { n: 1, kat: -18, tekst: '205/55 R16 91V', rozmiar: 30 },
  { n: 2, kat: 7, tekst: 'M+S', rozmiar: 22 },
  { n: 3, kat: 29, tekst: 'DOT 4B9X 7A2C 2321', rozmiar: 15 },
  { n: 4, kat: 50, tekst: '△ TWI', rozmiar: 16 }
];

const CX = 500;
const CY = 660;
const R_TEKST = 498;

function punkt(kat: number, r: number) {
  const a = ((kat - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function luk(kat: number, dl: number, r: number) {
  const a = punkt(kat - dl / 2, r);
  const b = punkt(kat + dl / 2, r);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function BokOpony() {
  return (
    <div className="rounded-3xl bg-slate-950 text-white overflow-hidden ring-1 ring-slate-800">
      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-3 relative flex items-end">
          <div className="hidden lg:block absolute left-7 top-7 max-w-sm space-y-2">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-sky-300">Gdzie patrzeć?</span>
            <p className="text-2xl font-black leading-tight">Na bok opony – napisy są wytłoczone w gumie.</p>
            <p className="text-sm text-white/60">Najłatwiej odczytać je przy dobrym świetle, z latarką w telefonie. Część napisów jest tylko po jednej stronie opony.</p>
          </div>
          <svg viewBox="0 0 1000 600" className="w-full h-auto" role="img" aria-labelledby="bok-opony-tytul">
            <title id="bok-opony-tytul">Bok opony z zaznaczonymi oznaczeniami: rozmiar, rodzaj opony, data produkcji DOT, wskaźnik TWI i maksymalne ciśnienie</title>
            <defs>
              <radialGradient id="guma" cx="50%" cy="100%" r="100%">
                <stop offset="0.55" stopColor="#334155" />
                <stop offset="0.8" stopColor="#1e293b" />
                <stop offset="1" stopColor="#0f172a" />
              </radialGradient>
              <radialGradient id="felga" cx="50%" cy="100%" r="80%">
                <stop offset="0" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="#94a3b8" />
              </radialGradient>
              {NAPISY.map((s) => (
                <path key={s.n} id={`luk-${s.n}`} d={luk(s.kat, s.n === 1 ? 34 : s.n === 5 ? 30 : s.n === 4 ? 16 : 26, R_TEKST)} fill="none" />
              ))}
            </defs>
            {/* bieżnik */}
            <circle cx={CX} cy={CY} r={590} fill="#0b1220" />
            {Array.from({ length: 70 }, (_, i) => {
              const k = -75 + i * 2.2;
              const a = punkt(k, 562);
              const b = punkt(k + 1.1, 590);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1e293b" strokeWidth="6" />;
            })}
            {/* bok opony */}
            <circle cx={CX} cy={CY} r={560} fill="url(#guma)" />
            <circle cx={CX} cy={CY} r={430} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="2 10" />
            {/* felga */}
            <circle cx={CX} cy={CY} r={405} fill="url(#felga)" />
            <circle cx={CX} cy={CY} r={380} fill="none" stroke="#64748b" strokeWidth="3" />
            {[-40, -15, 10, 35].map((k) => {
              const a = punkt(k, 120);
              const b = punkt(k, 370);
              return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#cbd5e1" strokeWidth="34" strokeLinecap="round" />;
            })}
            {/* napisy na boku */}
            {NAPISY.map((s) => (
              <text key={s.n} fill="#cbd5e1" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={800} fontSize={s.rozmiar} letterSpacing="1.5" style={{ textShadow: '0 1px 0 #0f172a' }}>
                <textPath href={`#luk-${s.n}`} startOffset="50%" textAnchor="middle">
                  {s.tekst}
                </textPath>
              </text>
            ))}
            {/* symbol 3PMSF obok M+S */}
            {(() => {
              const p = punkt(15.5, R_TEKST - 6);
              return (
                <g transform={`translate(${p.x} ${p.y}) rotate(15.5)`}>
                  <path d="M -16 10 L -4 -12 L 2 -2 L 7 -9 L 17 10 Z" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                  <g stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="0" y1="0" x2="0" y2="9" />
                    <line x1="-4" y1="2.5" x2="4" y2="6.5" />
                    <line x1="4" y1="2.5" x2="-4" y2="6.5" />
                  </g>
                </g>
              );
            })()}
            {/* znaczniki z numerami */}
            {NAPISY.map((s) => {
              const kolor = OZNACZENIA.find((o) => o.n === s.n)!.kolor;
              const p = punkt(s.kat, 600 + 28);
              const q = punkt(s.kat, 560);
              return (
                <g key={s.n}>
                  <line x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={kolor} strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="17" fill={kolor} />
                  <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="17" fontWeight={900} fill="#0f172a" fontFamily="ui-sans-serif, system-ui, sans-serif">
                    {s.n}
                  </text>
                  {(() => {
                    const w = s.n === 1 ? 17 : s.n === 5 ? 15 : s.n === 4 ? 8 : 13;
                    const a = punkt(s.kat - w, R_TEKST - 26);
                    const b = punkt(s.kat + w, R_TEKST - 26);
                    return <path d={`M ${a.x} ${a.y} A ${R_TEKST - 26} ${R_TEKST - 26} 0 0 1 ${b.x} ${b.y}`} fill="none" stroke={kolor} strokeWidth="3" strokeLinecap="round" />;
                  })()}
                </g>
              );
            })}
          </svg>
          <span className="absolute left-4 bottom-3 text-[10px] uppercase tracking-widest text-white/40">rysunek poglądowy</span>
        </div>
        <ol className="lg:col-span-2 p-6 sm:p-7 space-y-4 lg:border-l border-white/10">
          {OZNACZENIA.map((o) => (
            <li key={o.n} className="flex gap-3">
              <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black text-slate-900" style={{ background: o.kolor }}>
                {o.n}
              </span>
              <div>
                <div className="font-extrabold leading-snug">{o.t}</div>
                <p className="text-sm text-white/70">{o.o}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const MIEJSCA = [
  { n: 'A', t: 'Słupek przy drzwiach kierowcy', o: 'Najczęściej: naklejka na środkowym słupku (B), widoczna po otwarciu drzwi.', x: 318, y: 142 },
  { n: 'B', t: 'Klapka wlewu paliwa', o: 'Druga najczęstsza lokalizacja – naklejka od wewnątrz klapki.', x: 505, y: 128 },
  { n: 'C', t: 'Instrukcja obsługi', o: 'Zawsze tam jest – w tabeli z danymi technicznymi albo w rozdziale o kołach i oponach.', x: 228, y: 120 }
];

export function GdzieCisnienie() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 sm:p-6">
        <svg viewBox="0 0 600 250" className="w-full h-auto text-slate-800 dark:text-slate-200" role="img" aria-labelledby="auto-cisnienie-tytul">
          <title id="auto-cisnienie-tytul">Samochód z zaznaczonymi miejscami, gdzie zwykle jest tabliczka z ciśnieniem w oponach: słupek drzwi kierowcy, klapka wlewu paliwa, instrukcja obsługi</title>
          {/* nadwozie */}
          <path d="M40 190 L40 152 Q44 132 82 125 L170 113 Q214 72 268 64 L392 64 Q432 66 474 110 L540 121 Q566 127 566 152 L566 190 Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          {/* szyby */}
          <path d="M184 112 Q222 80 268 74 L300 74 L300 112 Z" fill="currentColor" opacity="0.14" />
          <path d="M310 74 L390 74 Q424 76 456 110 L310 112 Z" fill="currentColor" opacity="0.14" />
          {/* drzwi i słupek B */}
          <line x1="305" y1="70" x2="305" y2="186" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <line x1="178" y1="116" x2="178" y2="186" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <line x1="430" y1="112" x2="440" y2="186" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          {/* koła */}
          {[140, 466].map((x) => (
            <g key={x}>
              <circle cx={x} cy={190} r={40} fill="#0f172a" />
              <circle cx={x} cy={190} r={22} fill="#cbd5e1" />
              <circle cx={x} cy={190} r={6} fill="#64748b" />
            </g>
          ))}
          <line x1="20" y1="231" x2="580" y2="231" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          {/* naklejka na słupku */}
          <rect x="309" y="128" width="20" height="28" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          {/* klapka wlewu */}
          <rect x="494" y="118" width="22" height="20" rx="5" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          {/* znaczniki */}
          {MIEJSCA.map((m) => (
            <g key={m.n}>
              <line x1={m.x} y1={m.y} x2={m.x} y2={m.y - 62 + (m.n === 'C' ? 10 : 0)} stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx={m.x} cy={m.y - 76 + (m.n === 'C' ? 10 : 0)} r="15" fill="#0284c7" />
              <text x={m.x} y={m.y - 70 + (m.n === 'C' ? 10 : 0)} textAnchor="middle" fontSize="16" fontWeight={900} fill="white" fontFamily="ui-sans-serif, system-ui, sans-serif">
                {m.n}
              </text>
            </g>
          ))}
          {/* instrukcja przy desce rozdzielczej */}
          <g transform="translate(214 98)">
            <rect width="26" height="18" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
            <line x1="13" y1="2" x2="13" y2="16" stroke="#0284c7" strokeWidth="1.2" />
          </g>
        </svg>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MIEJSCA.map((m) => (
            <li key={m.n} className="flex gap-2.5">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{m.n}</span>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{m.t}</div>
                <p className="text-xs text-slate-500">{m.o}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Przykładowa tabliczka */}
      <figure className="lg:col-span-2 flex flex-col justify-center">
        <div className="rounded-3xl bg-amber-300 text-slate-900 p-1.5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.6)]">
          <div className="rounded-[1.25rem] bg-amber-50 ring-1 ring-amber-900/20 p-5 font-mono text-sm">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <span className="font-black tracking-wide">CIŚNIENIE / PRESSURE</span>
              <span className="text-[10px] font-bold">bar · kPa</span>
            </div>
            <table className="w-full mt-3 text-left">
              <thead>
                <tr className="text-[11px] text-amber-900/70">
                  <th className="font-bold pb-1">Opona</th>
                  <th className="font-bold pb-1">Obciążenie</th>
                  <th className="font-bold pb-1 text-right">Przód</th>
                  <th className="font-bold pb-1 text-right">Tył</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                <tr>
                  <td rowSpan={2} className="align-top pr-2">205/55 R16</td>
                  <td className="text-[11px] font-semibold">2 os. + mały bagaż</td>
                  <td className="text-right">2,3</td>
                  <td className="text-right">2,1</td>
                </tr>
                <tr>
                  <td className="text-[11px] font-semibold">pełne</td>
                  <td className="text-right">2,5</td>
                  <td className="text-right">2,8</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-900/80">
              <span className="inline-block w-5 h-5 rounded-full ring-2 ring-amber-900/40 text-center leading-5 font-black">❄</span>
              Na zimnych oponach
            </div>
          </div>
        </div>
        <figcaption className="mt-2 text-xs text-slate-500">Tak zwykle wygląda tabliczka. Wartości są przykładowe – Twoje auto ma własne, często inne dla przodu i tyłu oraz dla pełnego obciążenia.</figcaption>
      </figure>
    </div>
  );
}
