// Sprawdzenie kodu i zalogowanie urządzenia (szkoda).
import { obsluzLogowanie } from '@/lib/sklep/trasy-narzedzia';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = (req: Request) => obsluzLogowanie(req, 'szkoda');
