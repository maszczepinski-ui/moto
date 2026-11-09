// Prywatne dane narzędzia – tylko dla zalogowanego kupującego (niezbednik).
import { obsluzDane } from '@/lib/sklep/trasy-narzedzia';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = (req: Request) => obsluzDane(req, 'niezbednik');
