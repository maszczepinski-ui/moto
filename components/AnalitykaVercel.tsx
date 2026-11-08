'use client';
import { Analytics } from '@vercel/analytics/next';
import { toUrzadzenieAdmina } from '@/lib/admin-urzadzenie';

// Statystyki Vercel bez wizyt admina (urządzenie oznaczone po wejściu na /admin/)
export default function AnalitykaVercel() {
  return <Analytics beforeSend={(z) => (toUrzadzenieAdmina() ? null : z)} />;
}
