import type { Metadata } from 'next';
import NaglowekOpon from '@/components/opony/NaglowekOpon';
import WyborRozmiaru from '@/components/opony/WyborRozmiaru';
import { BoksyInformacyjne, KartaWyboru, PytaniaOpony } from '@/components/opony/Wspolne';
import { H2, KARTA } from '@/components/narzedzia/StronaNarzedzia';
import { dataPl, indeksOpon, liczbaOfert, nazwaRozmiaru, popularneRozmiary, wszystkieRozmiary, zl } from '@/lib/opony-dobor';
import { site } from '@/config/site';

const TYTUL = 'Dobór opon do auta – rozmiary i ceny';
const OPIS = 'Wpisz rozmiar z boku opony i porównaj ceny opon zimowych, letnich i całorocznych. Tysiące opon od kilkudziesięciu marek, ceny aktualizowane codziennie.';

export const metadata: Metadata = {
  title: TYTUL,
  description: OPIS,
  alternates: { canonical: '/dobor-opon/' },
  openGraph: { title: TYTUL, description: OPIS, url: `${site.url}/dobor-opon/` }
};

export default function DoborOponPage() {
  const ix = indeksOpon();
  const rozmiary = wszystkieRozmiary().map((x) => x.info.r);
  const popularne = popularneRozmiary(16);
  const tysiace = Math.floor(ix.liczba / 1000) * 1000;
  const pytania = [
    { q: 'Jak sprawdzić, jaki rozmiar opon pasuje do mojego auta?', a: 'Najprościej odczytać rozmiar z boku obecnej opony, np. 205/55 R16 91H. Dopuszczone rozmiary podaje też instrukcja obsługi, naklejka na słupku drzwi kierowcy lub klapce wlewu paliwa. Pamiętaj, że indeks nośności i prędkości nie może być niższy niż zalecany przez producenta.' },
    { q: 'Czym różnią się opony premium od ekonomicznych?', a: 'Opony znanych marek zwykle lepiej hamują na mokrym i śniegu oraz wolniej się zużywają, ale są droższe. Opony ekonomiczne kosztują mniej i sprawdzają się przy spokojnej jeździe po mieście. Podział na klasy na naszej stronie to ocena pozycji marek na rynku, nie wynik testu konkretnej opony.' },
    { q: 'Kiedy kupić opony zimowe?', a: 'Najlepiej przed pierwszymi przymrozkami – gdy średnia temperatura spada poniżej ok. 7°C, opona zimowa trzyma się drogi lepiej niż letnia. Kupując wcześniej, łatwiej o popularne rozmiary i krótszy termin dostawy.' },
    { q: 'Skąd pochodzą ceny opon?', a: 'Ceny i dostępność pobieramy codziennie z porównywarki tanie-opony.pl. Ostateczną cenę zawsze pokazuje sklep. Za przejście do sklepu możemy otrzymać prowizję – nie zmienia to ceny dla kupującego.' }
  ];
  return (
    <div className="pb-12">
      <NaglowekOpon
        okruszki={[{ nazwa: 'Opony', adres: '/opony/' }, { nazwa: 'Dobór opon', adres: '/dobor-opon/' }]}
        tytul="Dobór opon do Twojego auta"
        opis="Wpisz rozmiar z boku opony. Pokażemy pasujące opony i porównamy ceny – bez szukania po dziesięciu sklepach."
        fakty={[`${tysiace.toLocaleString('pl-PL')}+ opon`, `${ix.marki} marek`, 'Ceny odświeżane codziennie']}
        plakietka={{ gora: 'Najpopularniejszy rozmiar', dol: '205/55 R16' }}
      />
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <KartaWyboru>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Wybierz rozmiar opony</h2>
          <WyborRozmiaru rozmiary={rozmiary} />
        </KartaWyboru>

        <section className="space-y-4">
          <h2 className={H2}>Najpopularniejsze rozmiary</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularne.map(({ slug, info }) => (
              <li key={slug}>
                <a href={`/dobor-opon/${slug}/`} className={`${KARTA} block p-4 hover:ring-rust-400 transition`}>
                  <span className="block text-lg font-extrabold text-slate-900 dark:text-white">{nazwaRozmiaru(info.r)}</span>
                  <span className="block text-[13px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {liczbaOfert(info)} ofert · od {zl(info.od)} zł
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Ceny z {dataPl(ix.aktualizacja)}.</p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className={H2}>Jak dobrać opony – w skrócie</h2>
          <p className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">
            Zacznij od rozmiaru: odczytasz go z boku obecnej opony albo z naklejki na słupku drzwi kierowcy. Potem wybierz sezon. Opony zimowe mają miękką mieszankę i gęste nacięcia,
            które trzymają się śniegu i zimnego asfaltu, letnie lepiej hamują w cieple, a całoroczne to kompromis dla aut jeżdżących głównie po mieście.
          </p>
          <p className="text-[1.05rem] leading-7 text-slate-700 dark:text-slate-300">
            Na koniec sprawdź indeks nośności i prędkości (np. 91H) – nie może być niższy niż w dokumentach auta. Przy oponach zimowych szukaj symbolu góry z płatkiem śniegu (3PMSF): to
            znak, że opona przeszła test w warunkach zimowych. Kiedy wymienić opony i jak zmierzyć bieżnik, przeczytasz w{' '}
            <a href="/opony/" className="font-semibold text-rust-700 dark:text-rust-400 hover:underline">poradniku o oponach</a>.
          </p>
        </section>

        <BoksyInformacyjne />
        <PytaniaOpony pytania={pytania} />
      </div>
    </div>
  );
}
