import {
  AlignmentType, BorderStyle, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx';
import type { Baustein, Luecke } from './vertrag';

/*
 * Word-Fassung der Vorlagen aus denselben Bausteinen wie PDF und Vorschau.
 * Leere Stellen werden zu Unterstrichen, damit man am Rechner einfach hineinschreiben kann.
 */

const SCHRIFT = 'Arial';
const LINIE: Record<Luecke['breite'], string> = { kurz: '________', mittel: '________________', lang: '__________________________' };
const RAND = { style: BorderStyle.SINGLE, size: 4, color: '111418' };
const KEIN_RAND = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

function lauf(text: string, extra: { bold?: boolean; size?: number; color?: string } = {}): TextRun {
  return new TextRun({ text, font: SCHRIFT, size: extra.size ?? 21, bold: extra.bold, color: extra.color });
}

function tabelle(kopf: string[], zeilen: string[][]): Table {
  const breiten = [8, 24, 22, 46];
  const zeile = (zellen: string[], fett: boolean) =>
    new TableRow({
      children: zellen.map((z, i) => new TableCell({
        width: { size: breiten[i], type: WidthType.PERCENTAGE },
        borders: { top: RAND, bottom: RAND, left: RAND, right: RAND },
        children: [new Paragraph({ children: [lauf(z || ' ', { bold: fett, size: 19 })], spacing: { before: 60, after: 60 } })],
      })),
    });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [zeile(kopf, true), ...zeilen.map((z) => zeile(z, false))],
  });
}

function unterschriften(felder: string[]): Table {
  const zeilen: TableRow[] = [];
  for (let i = 0; i < felder.length; i += 2) {
    zeilen.push(new TableRow({
      children: [felder[i], felder[i + 1] ?? ''].map((f) => new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: { top: KEIN_RAND, bottom: KEIN_RAND, left: KEIN_RAND, right: KEIN_RAND },
        margins: { right: 300 },
        children: [
          new Paragraph({ children: [], spacing: { before: 900 } }),
          new Paragraph({
            border: f ? { top: RAND } : undefined,
            children: [lauf(f, { size: 16, color: '585D66' })],
          }),
        ],
      })),
    }));
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: KEIN_RAND, bottom: KEIN_RAND, left: KEIN_RAND, right: KEIN_RAND, insideHorizontal: KEIN_RAND, insideVertical: KEIN_RAND },
    rows: zeilen,
  });
}

/**
 * Setzt die Bausteine als Word-Dokument (DOCX) und gibt die Bytes zurück.
 */
export async function erzeugeDocx(bausteine: Baustein[], titel: string): Promise<Uint8Array> {
  const kinder: (Paragraph | Table)[] = [];
  for (const b of bausteine) {
    if (b.art === 'titel') {
      kinder.push(new Paragraph({ children: [lauf(b.text, { bold: true, size: 40 })], spacing: { after: 40 } }));
    } else if (b.art === 'unter') {
      kinder.push(new Paragraph({ children: [lauf(b.text, { color: '585D66' })], spacing: { after: 280 } }));
    } else if (b.art === 'ueberschrift') {
      kinder.push(new Paragraph({ children: [lauf(b.text, { bold: true, size: 23 })], spacing: { before: 200, after: 40 } }));
    } else if (b.art === 'absatz') {
      kinder.push(new Paragraph({
        spacing: { after: 140, line: 330 },
        alignment: AlignmentType.LEFT,
        children: b.teile.map((t) => {
          if (typeof t === 'string') {
            return lauf(t);
          }
          return t.wert ? lauf(t.wert, { bold: true }) : lauf(LINIE[t.breite]);
        }),
      }));
    } else if (b.art === 'tabelle') {
      kinder.push(tabelle(b.kopf, b.zeilen), new Paragraph({ children: [] }));
    } else if (b.art === 'unterschriften') {
      kinder.push(unterschriften(b.felder));
    } else {
      kinder.push(new Paragraph({ children: [lauf(b.text, { size: 16, color: '585D66' })], spacing: { before: 400 } }));
    }
  }
  const dokument = new Document({
    title: titel,
    creator: 'schuldschein-generator.de',
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      children: kinder,
    }],
  });
  const puffer = await Packer.toBuffer(dokument);
  return new Uint8Array(puffer);
}
