import { site } from '@/config/site';
import { bezpiecznyJson } from '@/lib/bezpieczenstwo';

export interface Okruszek {
  nazwa: string;
  adres: string;
}

// Ścieżka nawigacyjna (okruszki) + opis dla Google (BreadcrumbList)
export default function Okruszki({ sciezka }: { sciezka: Okruszek[] }) {
  const pelna = [{ nazwa: 'Strona główna', adres: '/' }, ...sciezka];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pelna.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.nazwa, item: `${site.url}${o.adres}` }))
  };
  return (
    <nav aria-label="Okruszki" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {pelna.map((o, i) => (
          <li key={o.adres} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < pelna.length - 1 ? (
              <a href={o.adres} className="hover:underline hover:text-slate-700 dark:hover:text-slate-300">
                {o.nazwa}
              </a>
            ) : (
              <span aria-current="page" className="text-slate-700 dark:text-slate-300">
                {o.nazwa}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bezpiecznyJson(jsonLd) }} />
    </nav>
  );
}
