// Typografia dla wersji językowych: krótkie słowa nie zostają same na końcu linii,
// a półpauza nie zaczyna nowej linii (twarda spacja przed „–”).
import type { JezykObcy } from '@/lib/jezyki';

const KROTKIE: Record<JezykObcy, RegExp> = {
  // ukraińskie jednoliterowe spójniki i przyimki: і, й, в, у, з, а, о, я
  uk: /(^|[\s(«„])([іїйвузаояІЇЙВУЗАОЯ]) /g,
  // angielski: „a” i „I”
  en: /(^|[\s(“])([aAI]) /g
};

export function typoObce(j: JezykObcy) {
  return (t: string) => t.replace(KROTKIE[j], '$1$2 ').replace(/ – /g, ' – ');
}
