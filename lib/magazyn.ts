// Prosty magazyn danych dla raportów spalania: Upstash Redis (darmowy plan) przez REST – bez dodatkowych bibliotek.
// Zmienne środowiskowe w Vercel: UPSTASH_REDIS_REST_URL i UPSTASH_REDIS_REST_TOKEN
// (albo KV_REST_API_URL / KV_REST_API_TOKEN, jeśli baza została dodana z zakładki Storage w Vercel).
// Na komputerze (npm run dev) bez tych zmiennych dane trzymane są w pamięci – tylko do testów.

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

export const magazynDostepny = () => !!(URL_ && TOKEN) || process.env.NODE_ENV !== 'production';

type Polecenie = (string | number)[];

const pamiec = new Map<string, unknown>();
function lokalnie(p: Polecenie): unknown {
  const [cmd, key, ...a] = p.map(String);
  const lista = () => (pamiec.get(key) as string[]) || [];
  switch (cmd.toUpperCase()) {
    case 'LPUSH': pamiec.set(key, [...a.reverse(), ...lista()]); return lista().length;
    case 'LRANGE': { const l = lista(); const end = Number(a[1]); return l.slice(Number(a[0]), end < 0 ? l.length + end + 1 : end + 1); }
    case 'LTRIM': pamiec.set(key, lista().slice(Number(a[0]), Number(a[1]) + 1)); return 'OK';
    case 'INCR': { const v = Number(pamiec.get(key) || 0) + 1; pamiec.set(key, v); return v; }
    case 'EXPIRE': return 1;
    case 'SET': if (a.includes('NX') && pamiec.has(key)) return null; pamiec.set(key, a[0]); return 'OK';
    case 'GET': return pamiec.has(key) ? String(pamiec.get(key)) : null;
    case 'DEL': return pamiec.delete(key) ? 1 : 0;
    case 'PERSIST': return 1;
    case 'SADD': { const z = new Set((pamiec.get(key) as string[]) || []); a.forEach((x) => z.add(x)); pamiec.set(key, [...z]); return 1; }
    case 'SREM': { pamiec.set(key, lista().filter((x) => !a.includes(x))); return 1; }
    case 'SMEMBERS': return lista();
    default: return null;
  }
}

/** Wykonuje kilka poleceń Redis naraz; zwraca wyniki w tej samej kolejności */
export async function redis(polecenia: Polecenie[]): Promise<unknown[]> {
  if (!URL_ || !TOKEN) return polecenia.map(lokalnie);
  const r = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(polecenia),
    cache: 'no-store'
  });
  if (!r.ok) throw new Error(`Magazyn danych: błąd ${r.status}`);
  const j = (await r.json()) as { result?: unknown; error?: string }[];
  return j.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}
