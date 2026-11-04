import { FileText, KeyRound, HandCoins, ShieldX, CarFront, HeartPulse, UserX, PawPrint, Siren, MoveHorizontal, Baby, TriangleAlert, CloudFog, Ship, Gift, Wrench, Construction, ClipboardCheck, FileSearch, BadgeCheck, Earth, Snowflake, ShieldAlert, ScanLine, Gauge, OctagonAlert, Banknote, Calculator, GraduationCap, BadgePercent, ShieldPlus, CircleSlash, Lightbulb, ClipboardList, Waves, Navigation, CircleMinus, Camera, CircleDot, BatteryLow, Sparkles, Landmark, Fuel, Leaf, PlugZap } from 'lucide-react';
import type { IkonaPoradnika as Ikona } from '@/lib/poradniki';

const IKONY = {
  umowa: FileText,
  kluczyk: KeyRound,
  sprzedaz: HandCoins,
  oc: ShieldX,
  kolizja: CarFront,
  ranni: HeartPulse,
  ucieczka: UserX,
  zwierze: PawPrint,
  korytarz: Siren,
  odstep: MoveHorizontal,
  fotelik: Baby,
  awaria: TriangleAlert,
  mgla: CloudFog,
  import: Ship,
  darowizna: Gift,
  szkoda: Wrench,
  dziura: Construction,
  przeglad: ClipboardCheck,
  dokumenty: FileSearch,
  kontrola: BadgeCheck,
  granica: Earth,
  zima: Snowflake,
  kradziez: ShieldAlert,
  vin: ScanLine,
  licznik: Gauge,
  oszustwo: OctagonAlert,
  cena: Banknote,
  cenaOc: Calculator,
  mlody: GraduationCap,
  znizka: BadgePercent,
  ac: ShieldPlus,
  calkowita: CircleSlash,
  kontrolka: Lightbulb,
  lista: ClipboardList,
  powodz: Waves,
  jazda: Navigation,
  punkty: CircleMinus,
  fotoradar: Camera,
  opona: CircleDot,
  akumulator: BatteryLow,
  pierwsze: Sparkles,
  kredyt: Landmark,
  paliwo: Fuel,
  strefa: Leaf,
  elektryk: PlugZap
} satisfies Record<Ikona, typeof FileText>;

export default function IkonaPoradnika({ ikona, className = 'w-5 h-5' }: { ikona: Ikona; className?: string }) {
  const I = IKONY[ikona];
  return <I className={className} aria-hidden="true" />;
}
