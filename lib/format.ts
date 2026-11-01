export const fmt = (n: number) => n.toLocaleString('pl-PL');

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Polska odmiana: 1 sztuka, 2 sztuki, 5 sztuk */
export function sztuk(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return 'sztuka';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'sztuki';
  return 'sztuk';
}

export const NADWOZIE_NAZWY: Record<string, string> = {
  sedan: 'Sedan',
  kombi: 'Kombi',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  kabriolet: 'Kabriolet',
  suv: 'SUV',
  van: 'Van / minivan'
};
