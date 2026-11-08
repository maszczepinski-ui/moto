import { getAllModels, getModelByPath } from '@/lib/models';
import { obrazKarty, rozmiarObrazka } from '@/lib/obraz-karty';

export const dynamic = 'force-static';
export const size = rozmiarObrazka;
export const contentType = 'image/png';
export const alt = 'Mapa Polski z liczbą zarejestrowanych aut';

export function generateStaticParams() {
  return getAllModels()
    .filter((m) => m.wszystkieGeneracje)
    .map((m) => ({ marka: m.markaSlug, model: m.modelSlug }));
}

export default async function Image({ params }: { params: Promise<{ marka: string; model: string }> }) {
  const { marka, model } = await params;
  return obrazKarty(getModelByPath(marka, model)!);
}
