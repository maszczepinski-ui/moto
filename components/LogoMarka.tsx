// Logo strony: ikona licznika + napis „moto-raport.pl” zrobiony tekstem (nie obrazkiem),
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
      {/* Napis w jednym ciągu: „moto” i „raport” tą samą grubą czcionką,
          pomarańczowy myślnik dotyka obu słów, „.pl” w kolorze akcentu */}
      <span className="text-[19px] sm:text-[21px] leading-none font-extrabold tracking-[-0.035em] whitespace-nowrap text-slate-900 dark:text-white">
        moto
        <span
          className="inline-block align-[0.22em] h-[0.13em] w-[0.36em] mx-[0.01em] rounded-[1px] bg-rust-500 dark:bg-rust-400"
          aria-hidden="true"
        />
        raport
        <span className="text-rust-500 dark:text-rust-400">.pl</span>
      </span>
    </span>
  );
}
