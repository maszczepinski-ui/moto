import { ListaObca, metadaneListy } from '@/components/obce/StronyObce';

export const metadata = metadaneListy('uk');

export default function Page() {
  return <ListaObca j="uk" />;
}
