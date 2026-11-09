// Wysyłka kodu logowania do narzędzia dla kupujących (niezbednik).
import { obsluzKod } from '@/lib/sklep/trasy-narzedzia';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = (req: Request) => obsluzKod(req, 'niezbednik');
