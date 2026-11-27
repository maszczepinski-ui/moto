import type { Metadata } from 'next';
import StronaDzialu from '@/components/akcesoria/StronaDzialu';
import { ZIMOWE } from '@/lib/akcesoria/zimowe';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: ZIMOWE.seoTytul,
  description: ZIMOWE.seoOpis,
  alternates: { canonical: '/akcesoria/zimowe/' },
  openGraph: { title: ZIMOWE.seoTytul, description: ZIMOWE.seoOpis, url: `${site.url}/akcesoria/zimowe/`, type: 'article' }
};

export default function AkcesoriaZimowePage() {
  return <StronaDzialu d={ZIMOWE} />;
}
