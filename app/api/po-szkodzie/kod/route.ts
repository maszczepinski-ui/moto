// Wysyłka kodu logowania do narzędzia dla kupujących (szkoda).
import { obsluzKod } from '@/lib/sklep/trasy-narzedzia';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = (req: Request) => obsluzKod(req, 'szkoda');
