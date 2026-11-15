// Wspólne drobiazgi zakładek panelu admina
export type ApiPelne = (sciezka: string, metoda?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: object) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function b64(t: string) {
  const b = new TextEncoder().encode(t);
  let s = '';
  b.forEach((x) => (s += String.fromCharCode(x)));
  return btoa(s);
}
export const z64 = (b: string) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\n/g, '')), (c) => c.charCodeAt(0)));

// Wygląd pól i kart – jedno miejsce dla całego panelu, żeby wszystkie zakładki wyglądały tak samo
export const input =
  'w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 transition focus:border-steel-500 focus:ring-4 focus:ring-steel-500/15 focus:outline-none';
export const etykieta = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5';
export const karta =
  'bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] p-5 sm:p-6 space-y-4';
export const przyciskG =
  'inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition';
export const przyciskD =
  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 disabled:opacity-40 transition';

export const slugify = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)
    .replace(/-$/, '');

/** Odczyt pliku JSON z repozytorium: treść + sha (potrzebne do zapisu) */
export async function czytajJson<T>(api: ApiPelne, sciezka: string, branch: string): Promise<{ dane: T; sha: string }> {
  const j = await api(`/contents/${sciezka}?ref=${branch}`);
  return { dane: JSON.parse(z64(j.content)) as T, sha: j.sha };
}

export async function zapiszPlik(api: ApiPelne, sciezka: string, tresc: string, opis: string, branch: string, sha?: string): Promise<string> {
  const j = await api(`/contents/${sciezka}`, 'PUT', { message: opis, content: b64(tresc), branch, ...(sha ? { sha } : {}) });
  return j.content.sha as string;
}
