import { ciasteczko } from '@/lib/sklep/kalkulator';
export const dynamic = 'force-dynamic';
export function POST() {
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': ciasteczko('', true) } });
}
