'use client';
import { sledz } from '@/lib/sledz';

// Link partnerski z pomiarem kliknięć (zdarzenie „klik_partner” w GA4)
export default function LinkPartnerski({
  href,
  modul,
  partner,
  karta,
  className,
  children
}: {
  href: string;
  modul: string;
  partner: string;
  karta: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      onClick={() => sledz('klik_partner', { modul, partner, karta })}
    >
      {children}
    </a>
  );
}
