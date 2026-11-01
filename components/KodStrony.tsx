import { kodDlaStrony } from '@/lib/panel';
import { kodDoHead, KodWTresci } from '@/lib/kod';

// Kod wklejony w panelu admina dla jednej, konkretnej podstrony.
// Tagi <meta>, <link> i skrypty z atrybutem async React sam przenosi do <head>.
export default function KodStrony({ sciezka }: { sciezka: string }) {
  const k = kodDlaStrony(sciezka);
  if (!k) return null;
  return (
    <>
      {kodDoHead(k.head, `kod-${sciezka}`)}
      <KodWTresci html={k.body} />
    </>
  );
}
