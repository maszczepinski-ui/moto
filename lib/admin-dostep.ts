// Sprawdzanie, czy zapytanie do API przyszło z panelu admina.
// Panel wysyła token GitHub – wpuszczamy tylko osobę z prawem zapisu do repozytorium strony.
import { site } from '@/config/site';

export async function toAdmin(token: string): Promise<boolean> {
  if (!token || token.length > 300) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${site.githubRepo}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!r.ok) return false;
    const j = (await r.json()) as { permissions?: { push?: boolean } };
    return j.permissions?.push === true;
  } catch {
    return false;
  }
}

export const tokenZZapytania = (req: Request) => (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
