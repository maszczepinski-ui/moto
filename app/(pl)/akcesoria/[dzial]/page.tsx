import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StronaDzialu from '@/components/akcesoria/StronaDzialu';
import { DZIALY, dzial } from '@/lib/akcesoria';
import { site } from '@/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return DZIALY.map((d) => ({ dzial: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ dzial: string }> }): Promise<Metadata> {
  const d = dzial((await params).dzial);
  if (!d) return {};
  const adres = `/akcesoria/${d.slug}/`;
  return { title: d.seoTytul, description: d.seoOpis, alternates: { canonical: adres }, openGraph: { title: d.seoTytul, description: d.seoOpis, url: `${site.url}${adres}`, type: 'article' } };
}

export default async function DzialPage({ params }: { params: Promise<{ dzial: string }> }) {
  const d = dzial((await params).dzial);
  if (!d) notFound();
  return <StronaDzialu d={d} />;
}
