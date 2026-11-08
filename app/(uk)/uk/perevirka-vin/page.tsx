import { VinObcy, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('uk', 'vin');

export default function Page() {
  return <VinObcy j="uk" />;
}
