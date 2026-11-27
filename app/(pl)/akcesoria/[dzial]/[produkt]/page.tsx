import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StronaProduktu from '@/components/akcesoria/StronaProduktu';
import { STRONY_PRODUKTOW, stronaProduktu } from '@/lib/akcesoria';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return STRONY_PRODUKTOW.map((s) => ({ dzial: s.dzial, produkt: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ dzial: string; produkt: string }> }): Promise<Metadata> {
  const { dzial, produkt } = await params;
  const s = stronaProduktu(dzial, produkt);
  if (!s) return {};
  const adres = `/akcesoria/${s.dzial}/${s.slug}/`;
  return { title: s.seoTytul, description: s.seoOpis, alternates: { canonical: adres }, openGraph: { title: s.seoTytul, description: s.seoOpis, url: `${site.url}${adres}`, type: 'article' } };
}

export default async function ProduktPage({ params }: { params: Promise<{ dzial: string; produkt: string }> }) {
  const { dzial, produkt } = await params;
  const s = stronaProduktu(dzial, produkt);
  if (!s) notFound();
  return <StronaProduktu s={s} />;
}
