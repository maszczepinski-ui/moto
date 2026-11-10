// Logo strony: ikona licznika + napis „moto–raport” zrobiony tekstem (nie obrazkiem),
// dzięki temu jest ostry na każdym ekranie i sam zmienia kolory w ciemnym motywie.
// Pokazuje się, gdy w panelu (zakładka „Logo i ikona”) nie wgrano własnego obrazka logo.
export default function LogoMarka() {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
      {/* Ikona – ta sama co ikona strony (app/icon.svg) */}
      <svg viewBox="0 0 64 64" className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 transition-transform group-hover:scale-105" aria-hidden="true">
        <rect width="64" height="64" rx="16" className="fill-[#1c3d5c] dark:fill-[#25507a]" />
        <path d="M15.4 45A18 18 0 1 1 48.6 45" fill="none" stroke="#97badb" strokeWidth="6" strokeLinecap="round" />
        <path d="M41 21.5A18 18 0 0 1 48.6 45" fill="none" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
        <line x1="32" y1="37" x2="42" y2="26" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      {/* Napis: „moto” grubsze, „raport” cieńsze, między nimi cienki pomarańczowy myślnik */}
      <span className="flex items-center text-[19px] sm:text-xl leading-none tracking-[-0.02em] whitespace-nowrap">
        <span className="font-bold text-slate-900 dark:text-white">moto</span>
        <span className="mx-[3px] h-[2px] w-[7px] rounded-full bg-rust-500/70 dark:bg-rust-400/80 translate-y-[1px]" aria-hidden="true" />
        <span className="font-normal text-slate-600 dark:text-slate-400">raport</span>
      </span>
    </span>
  );
}
