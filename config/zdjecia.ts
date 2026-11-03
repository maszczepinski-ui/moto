// Zdjęcia na stronie głównej i w nagłówkach działów.
// Domyślnie to darmowe zdjęcia z Unsplash (licencja Unsplash pozwala na użycie komercyjne bez opłat).
// Najlepiej podmień je na własne kadry z filmów MotoFormat: wrzuć plik JPG (ok. 1600 px szerokości) do folderu
// public/zdjecia/ i wpisz tu adres, np. '/zdjecia/hero.jpg'. Zdjęcia niech nie pokazują logotypów ani tablic rejestracyjnych.

export interface Zdjecie {
  src: string;
  alt: string;
  autor: string;
}

const unsplash = (id: string, szer = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${szer}&q=70`;

export const ZDJECIA = {
  glowne: { src: unsplash('photo-1551952237-954a0e68786c', 2000), alt: 'Samochód na pustej drodze', autor: 'Raivis Razgals / Unsplash' },
  kupujesz: { src: unsplash('photo-1574023240744-64c47c8c0676'), alt: 'Rząd zaparkowanych samochodów', autor: 'Erik Mclean / Unsplash' },
  trasa: { src: unsplash('photo-1516319915504-015b432d407c'), alt: 'Autostrada nocą – smugi świateł samochodów', autor: 'Florian Steciuk / Unsplash' },
  elektryki: { src: unsplash('photo-1593941707882-a5bba14938c7'), alt: 'Ładowanie samochodu elektrycznego', autor: 'CHUTTERSNAP / Unsplash' },
  mandaty: { src: unsplash('photo-1603638725730-233a04d9dca4'), alt: 'Samochody na drodze nocą', autor: 'Brecht Denil / Unsplash' },
  atlas: { src: unsplash('photo-1521706887145-1c0edacadb25'), alt: 'Samochody na ruchliwej drodze', autor: 'CHUTTERSNAP / Unsplash' },
  filmy: { src: unsplash('photo-1568605117036-5fe5e7bab0b7'), alt: 'Srebrne coupe na asfaltowej drodze', autor: 'Erik Mclean / Unsplash' },
  opony: { src: unsplash('photo-1578844251758-2f71da64c96f'), alt: 'Stosy opon samochodowych', autor: 'Robert Laursoo / Unsplash' }
} satisfies Record<string, Zdjecie>;

export type KluczZdjecia = keyof typeof ZDJECIA;
