import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllModels, getModelByPath } from '@/lib/models';
import AsystentZakupu, { metadaneZakupu } from '@/components/AsystentZakupu';

interface Props {
  params: Promise<{ marka: string; model: string }>;
}

export const dynamicParams = false;

// Asystent zakupu dla modelu (wszystkie generacje), np. /marki/volkswagen/golf/zakup/
export function generateStaticParams() {
  return getAllModels()
    .filter((m) => m.wszystkieGeneracje)
    .map((m) => ({ marka: m.markaSlug, model: m.modelSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marka, model } = await params;
  const m = getModelByPath(marka, model);
  return m ? metadaneZakupu(m) : {};
}

export default async function ZakupModeluPage({ params }: Props) {
  const { marka, model } = await params;
  const m = getModelByPath(marka, model);
  if (!m) notFound();
  return <AsystentZakupu m={m} />;
}
