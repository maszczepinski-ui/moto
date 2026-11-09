// Sprawdzenie kodu i zalogowanie urządzenia (niezbednik).
import { obsluzLogowanie } from '@/lib/sklep/trasy-narzedzia';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = (req: Request) => obsluzLogowanie(req, 'niezbednik');
