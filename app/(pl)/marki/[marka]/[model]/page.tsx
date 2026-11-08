import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllModels, getModelByPath } from '@/lib/models';
import KartaModelu, { metadaneKarty } from '@/components/KartaModelu';

interface Props {
  params: Promise<{ marka: string; model: string }>;
}

export const dynamicParams = false;

// Karta modelu – wszystkie generacje razem, np. /marki/volkswagen/golf/
export function generateStaticParams() {
  return getAllModels()
    .filter((m) => m.wszystkieGeneracje)
    .map((m) => ({ marka: m.markaSlug, model: m.modelSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marka, model } = await params;
  const m = getModelByPath(marka, model);
  return m ? metadaneKarty(m) : {};
}

export default async function ModelPage({ params }: Props) {
  const { marka, model } = await params;
  const m = getModelByPath(marka, model);
  if (!m) notFound();
  return <KartaModelu m={m} />;
}
