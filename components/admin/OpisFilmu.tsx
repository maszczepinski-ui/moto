'use client';
import { useMemo, useState } from 'react';
import { Copy, Check, Clapperboard } from 'lucide-react';
import { site } from '@/config/site';

// Gotowy fragment opisu pod film na YouTube: linki do karty modelu i narzędzi strony.
// Linki mają dopisek ?utm_source=youtube – w statystykach zobaczysz, ile osób przyszło z filmów.

type Model = { slug: string; nazwa: string; adres: string };

const input =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none';

export default function OpisFilmu({ modele }: { modele: Model[] }) {
  const [tekst, setTekst] = useState('');
  const [trasa, setTrasa] = useState(false);
  const [sponsor, setSponsor] = useState('');
  const [skopiowano, setSkopiowano] = useState(false);
  const m = modele.find((x) => x.nazwa === tekst) || modele.find((x) => x.nazwa.toLowerCase() === tekst.trim().toLowerCase());

  const opis = useMemo(() => {
    const u = (sciezka: string, kotwica = '') => `${site.url}${sciezka}?utm_source=youtube&utm_medium=opis${m ? `&utm_campaign=${m.slug}` : ''}${kotwica}`;
    const linie: string[] = [];
    if (sponsor.trim()) linie.push(`📢 Materiał reklamowy – płatna współpraca z ${sponsor.trim()}.`, '');
    if (m) {
      linie.push(`🚗 ${m.nazwa} – ile jeździ w Polsce, usterki, silniki i koszty: ${u(m.adres)}`);
      linie.push(`🔍 Kupujesz ${m.nazwa}? Lista do oględzin i typowe usterki: ${u(m.adres + 'zakup/')}`);
      linie.push(`⛽ Ile kosztuje trasa tym autem: ${u(m.adres, '#koszt-trasy')}`);
    }
    if (trasa) {
      linie.push(`🛣️ Kalkulator kosztu przejazdu (paliwo + autostrady): ${u('/koszt-trasy/')}`);
      linie.push(`🔌 Ładowarki i fotoradary na trasie: ${u('/ladowarki/')}`);
    }
    linie.push(`🛡️ Przypomnienie o końcu OC i przeglądzie (za darmo): ${u('/przypomnienia/')}`);
    linie.push(`🔎 Sprawdź auto po numerze VIN: ${u('/sprawdz-vin/')}`);
    linie.push('', `Więcej na ${site.url.replace('https://', '')} – atlas aut w Polsce na danych CEPiK.`);
    return linie.join('\n');
  }, [m, trasa, sponsor]);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <Clapperboard className="w-5 h-5 text-red-600" aria-hidden="true" /> Opis pod film na YouTube
      </h2>
      <p className="text-xs text-slate-500">Wybierz model z filmu – dostaniesz gotowe linki do wklejenia w opis filmu. Wklej je na początku opisu, żeby były widoczne bez rozwijania.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="of-model" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Model w filmie (opcjonalnie)
          </label>
          <input id="of-model" list="lista-modeli-opis" value={tekst} onChange={(e) => setTekst(e.target.value)} className={input} placeholder="np. Volkswagen Golf IV" />
          <datalist id="lista-modeli-opis">
            {modele.map((x) => (
              <option key={x.slug} value={x.nazwa} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="of-sponsor" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Film sponsorowany? Nazwa firmy (zostaw puste, jeśli nie)
          </label>
          <input id="of-sponsor" value={sponsor} onChange={(e) => setSponsor(e.target.value)} className={input} placeholder="np. carVertical" />
        </div>
        <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trasa} onChange={(e) => setTrasa(e.target.checked)} className="w-4 h-4" /> Film o podróży / trasie – dodaj linki do kalkulatora trasy i map
        </label>
      </div>
      <textarea readOnly value={opis} className={`${input} font-mono text-xs min-h-[200px]`} aria-label="Gotowy opis" />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(opis);
              setSkopiowano(true);
              setTimeout(() => setSkopiowano(false), 2000);
            } catch {
              /* zaznacz tekst ręcznie */
            }
          }}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm"
        >
          {skopiowano ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          {skopiowano ? 'Skopiowano' : 'Kopiuj opis'}
        </button>
        {sponsor.trim() && <span className="text-xs text-amber-700 dark:text-amber-300">Pamiętaj też zaznaczyć w YouTube Studio „Zawiera płatną promocję” i powiedzieć o współpracy na początku filmu.</span>}
      </div>
    </section>
  );
}
