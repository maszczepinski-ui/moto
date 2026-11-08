// Strona 404 dla adresów, których nie ma w żadnej wersji językowej.
// Omija zwykły układ strony, dlatego sama wczytuje style i ma własny <html>.
import '@fontsource-variable/inter';
import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: `Nie ma takiej strony | ${site.name}`
};

export default function GlobalNotFound() {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Nie ma takiej strony</h1>
            <p className="text-slate-600 dark:text-slate-400">Możliwe, że adres się zmienił albo tej strony jeszcze nie ma.</p>
            <p className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold">
              <a href="/" className="text-steel-600 dark:text-steel-400 hover:underline">
                Strona główna →
              </a>
              <a href="/uk/" lang="uk" className="text-steel-600 dark:text-steel-400 hover:underline">
                Українська →
              </a>
              <a href="/en/" lang="en" className="text-steel-600 dark:text-steel-400 hover:underline">
                English →
              </a>
            </p>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
