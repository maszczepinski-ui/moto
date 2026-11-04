import { Car, Trophy, Map, TrendingUp, Swords, TriangleAlert, ClipboardList, ScanLine, ShoppingBag, Route, Camera, Gauge, PlugZap, Film, Info, BellRing, Disc3, FileText, CarFront, HeartPulse, UserX, PawPrint, KeyRound, HandCoins, ShieldX, Siren, MoveHorizontal, Baby, TriangleAlert as Trojkat, CloudFog, Wrench, ClipboardCheck, Ship, BadgeCheck, Snowflake, LibraryBig, ShieldAlert, ShieldCheck } from 'lucide-react';
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
  bell: BellRing,
  opony: Disc3,
  dokument: FileText,
  kolizja: CarFront,
  ranni: HeartPulse,
  ucieczka: UserX,
  zwierze: PawPrint,
  kluczyk: KeyRound,
  sprzedaz: HandCoins,
  tarcza: ShieldX,
  korytarz: Siren,
  odstep: MoveHorizontal,
  fotelik: Baby,
  awaria: Trojkat,
  mgla: CloudFog,
  szkoda: Wrench,
  przeglad: ClipboardCheck,
  import: Ship,
  kontrola: BadgeCheck,
  zima: Snowflake,
  wszystkie: LibraryBig,
  licznik: Gauge,
  kradziez: ShieldAlert,
  ubezpieczenie: ShieldCheck
} satisfies Record<Ikona, typeof Car>;

export default function IkonaMenu({ ikona, className = 'w-5 h-5' }: { ikona: Ikona; className?: string }) {
  const I = IKONY[ikona];
  return <I className={className} aria-hidden="true" />;
}
