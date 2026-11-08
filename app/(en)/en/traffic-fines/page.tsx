import { MandatyObce, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('en', 'mandaty');

export default function Page() {
  return <MandatyObce j="en" />;
}
