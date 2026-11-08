import { OcObce, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('en', 'oc');

export default function Page() {
  return <OcObce j="en" />;
}
