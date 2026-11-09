// Plik Word (DOCX) z gotowym pismem – tworzony w przeglądarce kupującego (biblioteka docx ładowana dopiero po kliknięciu).
// Brakujące dane („[uzupełnij: …]”) są zaznaczone na żółto, żeby łatwo je znaleźć w Wordzie.
import type { GotowePismo } from './sprawdzacz';

export async function pobierzDocx(g: GotowePismo, nazwaPliku: string) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');
  const FONT = 'Arial';
  const runy = (tekst: string, o: { bold?: boolean; size?: number } = {}) =>
    tekst.split(/(\[uzupełnij:[^\]]*\])/).filter(Boolean).map((t) => new TextRun({ text: t, font: FONT, size: o.size ?? 22, bold: o.bold, highlight: t.startsWith('[uzupełnij:') ? 'yellow' : undefined }));
  const p = (tekst: string, o: { bold?: boolean; po?: number; wyrownanie?: 'right' | 'center' | 'justify'; wciecie?: number; size?: number } = {}) =>
    new Paragraph({
      children: runy(tekst, o),
      spacing: { after: o.po ?? 120, line: 300 },
      alignment: o.wyrownanie === 'right' ? AlignmentType.RIGHT : o.wyrownanie === 'center' ? AlignmentType.CENTER : o.wyrownanie === 'justify' ? AlignmentType.JUSTIFIED : undefined,
      indent: o.wciecie ? { left: o.wciecie } : undefined
    });

  const tresc = [
    p(g.miejsceData, { wyrownanie: 'right', po: 240 }),
    ...g.nadawca.map((l, i) => p(l, { po: i === g.nadawca.length - 1 ? 240 : 0 })),
    ...g.adresat.map((l, i) => p(l, { bold: i === 0, wciecie: 4800, po: i === g.adresat.length - 1 ? 240 : 0 })),
    p(g.dotyczy, { bold: true, po: 240 }),
    p(g.naglowek.toUpperCase(), { bold: true, wyrownanie: 'center', po: 240, size: 26 }),
    ...g.elementy.flatMap((e) =>
      e.typ === 'p' ? [p(e.t, { wyrownanie: 'justify' })] : [p(`${e.nr}. ${e.tytul}`, { bold: true, po: 60 }), ...e.akapity.map((a) => p(a, { wyrownanie: 'justify', wciecie: 360 }))]
    ),
    ...(g.zalaczniki.length ? [p('Załączniki:', { bold: true, po: 60 }), ...g.zalaczniki.map((z, i) => p(`${i + 1}) ${z}`, { po: 0, wciecie: 360 }))] : []),
    new Paragraph({ children: [], spacing: { before: 600 } }),
    p('……………………………………', { wyrownanie: 'right', po: 0 }),
    p(g.podpis ? `${g.podpis} (podpis)` : '(podpis)', { wyrownanie: 'right', size: 18 })
  ];

  const doc = new Document({
    creator: 'moto-raport.pl',
    title: g.naglowek,
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 1134, bottom: 1134, left: 1247, right: 1247 } } }, children: tresc }]
  });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nazwaPliku;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
