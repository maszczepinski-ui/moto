import type { Metadata } from 'next';
import { getModelSummaries } from '@/lib/models';
import { listaWojewodztw, rankingi, marki, tlo } from '@/lib/dane';
import { formatDate } from '@/lib/format';
import { wszystkieSzkice } from '@/lib/opisy';
import { KODY } from '@/lib/kody-bledow';
import AdminPanel from '@/components/AdminPanel';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Panel admina',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  const modele = getModelSummaries()
    .map((m) => ({ slug: m.slug, adres: m.adres, nazwa: `${m.marka} ${m.model} ${m.generacja}`.trim(), liczba: m.cepik.liczbaWPolsce }))
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
  const poSlugu = new Map(modele.map((m) => [m.slug, m]));
  // wszystkie podstrony – do wklejania kodu na wybranej z nich
  const strony = [
    { sciezka: '/', nazwa: 'Strona główna' },
    { sciezka: '/marki/', nazwa: 'Marki – lista' },
    { sciezka: '/wojewodztwa/', nazwa: 'Województwa – lista' },
    { sciezka: '/rankingi/', nazwa: 'Rankingi – lista' },
    { sciezka: '/rynek/', nazwa: 'Rynek nowych aut' },
    { sciezka: '/linki/', nazwa: 'Linki' },
    { sciezka: '/metodologia/', nazwa: 'Skąd dane' },
    { sciezka: '/prywatnosc/', nazwa: 'Polityka prywatności' },
    { sciezka: '/porownaj/', nazwa: 'Porównania – lista' },
    { sciezka: '/kody-bledow/', nazwa: 'Kody błędów – lista' },
    ...KODY.map((k) => ({ sciezka: `/kody-bledow/${k.kod.toLowerCase()}/`, nazwa: `Kod błędu ${k.kod}` })),
    ...marki.map((m) => ({ sciezka: `/marki/${m.slug}/`, nazwa: `Marka ${m.nazwa}` })),
    ...listaWojewodztw.map((w) => ({ sciezka: `/wojewodztwa/${w.slug}/`, nazwa: `Województwo ${w.nazwa.toLowerCase()}` })),
    ...rankingi.map((r) => ({ sciezka: `/rankingi/${r.id}/`, nazwa: `Ranking: ${r.tytul}` })),
    ...modele.map((m) => ({ sciezka: m.adres, nazwa: m.nazwa }))
  ];
  const szkice = wszystkieSzkice()
    .filter((s) => poSlugu.has(s.slug))
    .map((s) => ({ ...s, nazwa: poSlugu.get(s.slug)!.nazwa, adres: poSlugu.get(s.slug)!.adres }))
    .sort((a, b) => (poSlugu.get(b.slug)!.liczba || 0) - (poSlugu.get(a.slug)!.liczba || 0));
  return <AdminPanel modele={modele} strony={strony} szkice={szkice} stanDanych={formatDate(tlo.stanNa)} repo={site.githubRepo} branch={site.githubBranch} />;
}
