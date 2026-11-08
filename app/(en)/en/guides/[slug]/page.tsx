import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PoradnikObcyStrona, { metadanePoradnikaObcego } from '@/components/obce/PoradnikObcyStrona';
import { poradnikiObce, poradnikObcy } from '@/lib/tlumaczenia';

export const dynamicParams = false;

export function generateStaticParams() {
  return poradnikiObce('en').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = poradnikObcy('en', slug);
  return p ? metadanePoradnikaObcego('en', p) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = poradnikObcy('en', slug);
  if (!p) notFound();
  return <PoradnikObcyStrona j="en" p={p} />;
}
