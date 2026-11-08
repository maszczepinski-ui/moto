import { MandatyObce, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('uk', 'mandaty');

export default function Page() {
  return <MandatyObce j="uk" />;
}
