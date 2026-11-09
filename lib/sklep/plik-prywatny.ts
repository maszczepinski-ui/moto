// Czytanie plików sklepu (ZIP pakietu, dane kalkulatora) z Vercel Blob.
// Magazyn „Private”: plik da się odczytać tylko z serwera strony (Vercel sam daje dostęp po podłączeniu magazynu do projektu),
// więc adres pliku nigdy nie trafia do klienta. Adres zwykły (publiczny, np. do testów) czytamy zwykłym fetch.
import { get } from '@vercel/blob';

const prywatny = (adres: string) => /\.private\.blob\.vercel-storage\.com\//.test(adres);

/** Zwraca treść pliku jako strumień albo null, gdy pliku nie ma */
export async function plikSklepu(adres: string): Promise<{ stream: ReadableStream<Uint8Array>; typ: string; rozmiar?: number } | null> {
  if (prywatny(adres)) {
    const w = await get(adres, { access: 'private' });
    if (!w || w.statusCode !== 200 || !w.stream) return null;
    return { stream: w.stream, typ: w.blob.contentType || 'application/octet-stream', rozmiar: w.blob.size ?? undefined };
  }
  const r = await fetch(adres, { cache: 'no-store' });
  if (!r.ok || !r.body) return null;
  return { stream: r.body, typ: r.headers.get('content-type') || 'application/octet-stream', rozmiar: Number(r.headers.get('content-length')) || undefined };
}
