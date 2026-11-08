import { VinObcy, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('en', 'vin');

export default function Page() {
  return <VinObcy j="en" />;
}
