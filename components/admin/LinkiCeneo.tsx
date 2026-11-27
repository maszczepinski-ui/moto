'use client';
// Zakładka „Linki Ceneo”: wklejanie linków partnerskich Ceneo do produktów z działu akcesoriów
// (plik data/akcesoria/linki-ceneo.json). Regulamin Ceneo pozwala tylko na linki wygenerowane w panelu partnera
// albo wtyczką – dlatego link wklejasz gotowy, a strona go nie zmienia.
import { useEffect, useState } from 'react';
import { Save, ExternalLink, CheckCircle2, CircleAlert } from 'lucide-react';
import { ApiPelne, input, karta, przyciskG, czytajJson, zapiszPlik } from '@/components/admin/wspolne';
import { DZIALY, STRONY_PRODUKTOW } from '@/lib/akcesoria';
import { linkCeneoZPanelu } from '@/lib/ceneo';

const PLIK = 'data/akcesoria/linki-ceneo.json';
type Pozycja = { id: string; nazwa: string; szukaj: string };

// Wszystkie miejsca, w które można wkleić link – grupami, tak jak na stronie
const GRUPY: { tytul: string; adres: string; pozycje: Pozycja[] }[] = [
  ...DZIALY.map((d) => ({
    tytul: `${d.nazwa} – przyciski przy rodzajach produktów`,
    adres: `/akcesoria/${d.slug}/`,
    pozycje: d.produkty.map((p) => ({ id: `${d.slug}-${p.id}`, nazwa: p.nazwa, szukaj: p.szukaj }))
  })),
  ...STRONY_PRODUKTOW.map((s) => ({
    tytul: `${s.nazwa} – konkretne modele`,
    adres: `/akcesoria/${s.dzial}/${s.slug}/`,
    pozycje: s.modele.map((m) => ({ id: m.id, nazwa: `${m.marka} ${m.model}`, szukaj: m.szukaj }))
  }))
];

export default function LinkiCeneo({ api, branch }: { api: ApiPelne; branch: string }) {
  const [linki, setLinki] = useState<Record<string, string> | null>(null);
  const [sha, setSha] = useState('');
  const [zmiany, setZmiany] = useState(false);
  const [praca, setPraca] = useState(false);
  const [kom, setKom] = useState<{ ok: boolean; tekst: string } | null>(null);

  useEffect(() => {
    czytajJson<Record<string, string>>(api, PLIK, branch)
      .then(({ dane, sha }) => {
        setLinki(dane);
        setSha(sha);
      })
      .catch((e) => setKom({ ok: false, tekst: `Nie mogę wczytać linków: ${(e as Error).message}` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ustaw = (id: string, v: string) => {
    if (!linki) return;
    setLinki({ ...linki, [id]: v.trim() });
    setZmiany(true);
  };

  const zapisz = async () => {
    if (!linki) return;
    const zle = Object.entries(linki).filter(([, v]) => v && !linkCeneoZPanelu(v));
    if (zle.length) {
      setKom({ ok: false, tekst: `Popraw ${zle.length} link(i) zaznaczone na czerwono – link musi zaczynać się od https://www.ceneo.pl/ i zawierać Twój numer partnera (pid=…).` });
      return;
    }
    setPraca(true);
    try {
      const nowy = await zapiszPlik(api, PLIK, JSON.stringify(linki, null, 2) + '\n', 'Panel: linki Ceneo w akcesoriach', branch, sha);
      setSha(nowy);
      setZmiany(false);
      setKom({ ok: true, tekst: 'Zapisano. Strona przebuduje się sama – przyciski pojawią się za ok. 3–5 minut.' });
    } catch (e) {
      setKom({ ok: false, tekst: `Nie udało się zapisać: ${(e as Error).message}` });
    } finally {
      setPraca(false);
    }
  };

  const ile = linki ? Object.values(linki).filter((v) => linkCeneoZPanelu(v)).length : 0;
  const wszystkie = GRUPY.reduce((a, g) => a + g.pozycje.length, 0);

  return (
    <div className="space-y-5">
      <div className={karta}>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Linki Ceneo w dziale akcesoriów</h2>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <li>Kliknij „Szukaj na Ceneo” przy produkcie – otworzy się wyszukiwarka Ceneo.</li>
          <li>Wejdź na stronę właściwego produktu (dla rodzajów produktów, np. „Skrobaczka”, możesz zostać na stronie wyników albo kategorii).</li>
          <li>Wygeneruj link: wtyczką „Program Partnerski Ceneo” (prawy przycisk myszy na białym tle strony → „Kopiuj link do Ceneo”) albo w panelu partnera Ceneo.</li>
          <li>Wklej link tutaj bez żadnych zmian i kliknij „Zapisz”.</li>
        </ol>
        <p className="text-xs text-slate-500">
          Regulamin Ceneo pozwala używać tylko linków wygenerowanych przez Ceneo. Produkt bez linku nadal jest na stronie, tylko bez przycisku. Nie klikaj własnych linków – Ceneo nie liczy kliknięć
          partnera.
        </p>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Uzupełnione: {ile} z {wszystkie}
        </p>
      </div>

      {kom && (
        <div className={`flex gap-2 rounded-xl px-4 py-3 text-sm ${kom.ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200'}`}>
          {kom.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-none" /> : <CircleAlert className="w-4 h-4 mt-0.5 flex-none" />}
          {kom.tekst}
        </div>
      )}

      {linki &&
        GRUPY.map((g) => (
          <div key={g.tytul} className={karta}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{g.tytul}</h3>
              <a href={g.adres} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-steel-600 hover:underline inline-flex items-center gap-1">
                Zobacz stronę <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ul className="space-y-3">
              {g.pozycje.map((p) => {
                const v = linki[p.id] || '';
                const zly = v !== '' && !linkCeneoZPanelu(v);
                return (
                  <li key={p.id} className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {p.nazwa} {v && !zly && <CheckCircle2 className="inline w-4 h-4 text-emerald-600 ml-1" aria-label="uzupełniony" />}
                      </span>
                      <a
                        href={`https://www.ceneo.pl/;szukaj-${p.szukaj.toLowerCase().split(/\s+/).map(encodeURIComponent).join('+')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-steel-600 hover:underline inline-flex items-center gap-1"
                      >
                        Szukaj na Ceneo: „{p.szukaj}” <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <input
                      className={`${input} ${zly ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="https://www.ceneo.pl/…#crid=…&pid=…"
                      value={v}
                      onChange={(e) => ustaw(p.id, e.target.value)}
                      aria-label={`Link Ceneo: ${p.nazwa}`}
                      aria-invalid={zly}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      <div className="sticky bottom-4 flex justify-end">
        <button type="button" onClick={zapisz} disabled={!zmiany || praca} className={przyciskG}>
          <Save className="w-4 h-4" /> {praca ? 'Zapisuję…' : 'Zapisz linki'}
        </button>
      </div>
    </div>
  );
}
