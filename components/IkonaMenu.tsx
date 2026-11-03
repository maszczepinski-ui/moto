import { Car, Trophy, Map, TrendingUp, Swords, TriangleAlert, ClipboardList, ScanLine, ShoppingBag, Route, Camera, Gauge, PlugZap, Film, Info, BellRing } from 'lucide-react';
import type { Ikona } from '@/lib/menu';

const IKONY = {
  car: Car,
  trophy: Trophy,
  map: Map,
  trending: TrendingUp,
  swords: Swords,
  alert: TriangleAlert,
  clipboard: ClipboardList,
  scan: ScanLine,
  shopping: ShoppingBag,
  route: Route,
  camera: Camera,
  gauge: Gauge,
  plug: PlugZap,
  film: Film,
  info: Info,
  bell: BellRing
} satisfies Record<Ikona, typeof Car>;

export default function IkonaMenu({ ikona, className = 'w-5 h-5' }: { ikona: Ikona; className?: string }) {
  const I = IKONY[ikona];
  return <I className={className} aria-hidden="true" />;
}
