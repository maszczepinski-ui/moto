import { ListaObca, metadaneListy } from '@/components/obce/StronyObce';

export const metadata = metadaneListy('en');

export default function Page() {
  return <ListaObca j="en" />;
}
