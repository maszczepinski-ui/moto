import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllModels, getModelByPath } from '@/lib/models';
import KartaModelu, { metadaneKarty } from '@/components/KartaModelu';

interface Props {
  params: Promise<{ marka: string; model: string; generacja: string }>;
}

export const dynamicParams = false;

// Karta generacji, np. /marki/volkswagen/golf/iv/
export function generateStaticParams() {
  return getAllModels()
    .filter((m) => !m.wszystkieGeneracje && m.generacjaSlug)
    .map((m) => ({ marka: m.markaSlug, model: m.modelSlug, generacja: m.generacjaSlug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marka, model, generacja } = await params;
  const m = getModelByPath(marka, model, generacja);
  return m ? metadaneKarty(m) : {};
}

export default async function GeneracjaPage({ params }: Props) {
  const { marka, model, generacja } = await params;
  const m = getModelByPath(marka, model, generacja);
  if (!m) notFound();
  return <KartaModelu m={m} />;
}
