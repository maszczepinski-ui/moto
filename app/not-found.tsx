import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Nie ma takiej strony</h1>
      <p className="text-slate-600 dark:text-slate-400">Możliwe, że tego modelu nie ma jeszcze w atlasie.</p>
      <Link href="/#modele" className="inline-block font-semibold text-steel-600 dark:text-steel-400 hover:underline">
        Zobacz listę modeli →
      </Link>
    </div>
  );
}
