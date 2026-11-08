import { OcObce, metadaneNarzedzia } from '@/components/obce/NarzedziaObce';

export const metadata = metadaneNarzedzia('uk', 'oc');

export default function Page() {
  return <OcObce j="uk" />;
}
