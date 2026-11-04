import { FileText, KeyRound, HandCoins, ShieldX, CarFront, HeartPulse, UserX, PawPrint, Siren, MoveHorizontal, Baby, TriangleAlert, CloudFog, Ship, Gift, Wrench, Construction, ClipboardCheck, FileSearch, BadgeCheck, Earth, Snowflake, ShieldAlert, ScanLine, Gauge, OctagonAlert, Banknote } from 'lucide-react';
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
  cena: Banknote
} satisfies Record<Ikona, typeof FileText>;

export default function IkonaPoradnika({ ikona, className = 'w-5 h-5' }: { ikona: Ikona; className?: string }) {
  const I = IKONY[ikona];
  return <I className={className} aria-hidden="true" />;
}
