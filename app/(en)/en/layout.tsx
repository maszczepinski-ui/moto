// Układ wersji językowej /en/ – osobny element <html lang>, nagłówek i stopka w tym języku
import '@fontsource-variable/inter';
import '../../globals.css';
import UkladObcy, { metadaneUkladu, viewportUkladu } from '@/components/obce/UkladObcy';

export const metadata = metadaneUkladu('en');
export const viewport = viewportUkladu;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UkladObcy j="en">{children}</UkladObcy>;
}
