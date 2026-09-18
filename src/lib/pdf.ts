import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { Baustein, Luecke } from './vertrag';

/*
 * PDF aus den Vertragsbausteinen, mit echtem Text statt Bild: durchsuchbar, scharf,
 * klein. Die Standardschriften brauchen kein Einbetten, kennen aber nur den
 * westeuropaeischen Zeichensatz (WinAnsi). Alles andere wird vorher ersetzt.
 */

const A4 = { breite: 595.28, hoehe: 841.89 };
const RAND = { links: 57, rechts: 57, oben: 62, unten: 62 };
const SCHWARZ = rgb(0.07, 0.08, 0.09);
const GRAU = rgb(0.35, 0.36, 0.4);
const LINIE_BREITE: Record<Luecke['breite'], number> = { kurz: 60, mittel: 120, lang: 180 };

const CP1252_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';

/**
 * Ersetzt Zeichen, die die PDF-Standardschrift nicht kennt: Akzente werden abgelöst,
 * der Rest wird zum Fragezeichen. Ohne das bricht pdf-lib mit einem Fehler ab.
 */
export function winAnsi(text: string): string {
  let aus = '';
  for (const zeichen of text) {
    const code = zeichen.codePointAt(0) ?? 0;
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || CP1252_EXTRA.includes(zeichen)) {
      aus += zeichen;
      continue;
    }
    if (zeichen === '\n' || zeichen === '\t') {
      aus += ' ';
      continue;
    }
    const ohneAkzent = zeichen.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const ersatz: Record<string, string> = { 'ł': 'l', 'Ł': 'L', 'đ': 'd', 'Đ': 'D', 'ı': 'i', 'ø': 'o', 'Ø': 'O' };
    aus += /^[\x20-\x7e\xa0-\xff]$/.test(ohneAkzent) ? ohneAkzent : (ersatz[zeichen] ?? '?');
  }
  return aus;
}

interface Stift {
  pdf: PDFDocument;
  seite: PDFPage;
  y: number;
  normal: PDFFont;
  fett: PDFFont;
}

function neueSeite(s: Stift): void {
  s.seite = s.pdf.addPage([A4.breite, A4.hoehe]);
  s.y = A4.hoehe - RAND.oben;
}

function platz(s: Stift, hoehe: number): void {
  if (s.y - hoehe < RAND.unten) {
    neueSeite(s);
  }
}

type Stueck = { art: 'wort'; text: string; fett: boolean } | { art: 'linie'; breite: number };

/** Zerlegt einen Absatz in Woerter und Schreiblinien, die einzeln umbrochen werden koennen. */
function stuecke(teile: (string | Luecke)[]): Stueck[] {
  const aus: Stueck[] = [];
  for (const teil of teile) {
    if (typeof teil !== 'string' && !teil.wert) {
      aus.push({ art: 'linie', breite: LINIE_BREITE[teil.breite] });
      continue;
    }
    const text = winAnsi(typeof teil === 'string' ? teil : teil.wert);
    const fett = typeof teil !== 'string';
    for (const wort of text.split(/(?<= )/)) {
      if (wort) {
        aus.push({ art: 'wort', text: wort, fett });
      }
    }
  }
  return aus;
}

function absatz(s: Stift, teile: (string | Luecke)[], groesse: number, zeile: number): void {
  const maxX = A4.breite - RAND.rechts;
  let x = RAND.links;
  platz(s, zeile);
  let grundlinie = s.y - groesse;
  for (const st of stuecke(teile)) {
    const breite = st.art === 'linie' ? st.breite : (st.fett ? s.fett : s.normal).widthOfTextAtSize(st.text, groesse);
    const sichtbar = st.art === 'wort' ? (st.fett ? s.fett : s.normal).widthOfTextAtSize(st.text.trimEnd(), groesse) : breite;
    if (x + sichtbar > maxX && x > RAND.links) {
      s.y -= zeile;
      platz(s, zeile);
      grundlinie = s.y - groesse;
      x = RAND.links;
      if (st.art === 'wort' && st.text === ' ') {
        continue;
      }
    }
    if (st.art === 'linie') {
      s.seite.drawLine({ start: { x, y: grundlinie - 2 }, end: { x: x + breite, y: grundlinie - 2 }, thickness: 0.6, color: SCHWARZ });
    } else {
      s.seite.drawText(st.text, { x, y: grundlinie, size: groesse, font: st.fett ? s.fett : s.normal, color: SCHWARZ });
    }
    x += breite;
  }
  s.y -= zeile;
}

function einzeilig(s: Stift, text: string, groesse: number, fett: boolean, farbe = SCHWARZ, abstand = 6): void {
  const zeile = groesse * 1.35;
  platz(s, zeile);
  const font = fett ? s.fett : s.normal;
  // Lange Zeilen (Fusszeile) ebenfalls umbrechen
  const woerter = winAnsi(text).split(' ');
  let zeileText = '';
  const maxBreite = A4.breite - RAND.links - RAND.rechts;
  const schreibe = (t: string) => {
    platz(s, zeile);
    s.seite.drawText(t, { x: RAND.links, y: s.y - groesse, size: groesse, font, color: farbe });
    s.y -= zeile;
  };
  for (const w of woerter) {
    const probe = zeileText ? `${zeileText} ${w}` : w;
    if (font.widthOfTextAtSize(probe, groesse) > maxBreite && zeileText) {
      schreibe(zeileText);
      zeileText = w;
    } else {
      zeileText = probe;
    }
  }
  if (zeileText) {
    schreibe(zeileText);
  }
  s.y -= abstand;
}

function tabelle(s: Stift, kopf: string[], zeilen: string[][]): void {
  const gesamt = A4.breite - RAND.links - RAND.rechts;
  const spalten = [32, 100, 100, gesamt - 232];
  const hoehe = 20;
  const zeichneZeile = (zellen: string[], fett: boolean) => {
    platz(s, hoehe);
    let x = RAND.links;
    zellen.forEach((zelle, i) => {
      s.seite.drawRectangle({ x, y: s.y - hoehe, width: spalten[i], height: hoehe, borderColor: SCHWARZ, borderWidth: 0.6 });
      const text = winAnsi(zelle);
      const font = fett ? s.fett : s.normal;
      const tx = i === 2 && !fett ? x + spalten[i] - 5 - font.widthOfTextAtSize(text, 9.5) : x + 5;
      s.seite.drawText(text, { x: tx, y: s.y - 14, size: 9.5, font, color: SCHWARZ });
      x += spalten[i];
    });
    s.y -= hoehe;
  };
  zeichneZeile(kopf, true);
  zeilen.forEach((z) => zeichneZeile(z, false));
  s.y -= 8;
}

function unterschriften(s: Stift, felder: string[]): void {
  const gesamt = A4.breite - RAND.links - RAND.rechts;
  const luecke = 28;
  const breite = (gesamt - luecke) / 2;
  const blockHoehe = 70;
  // Unterschriften nie vom Rest trennen: lieber den ganzen Block auf die naechste Seite
  platz(s, Math.ceil(felder.length / 2) * blockHoehe);
  for (let i = 0; i < felder.length; i += 2) {
    s.y -= 44;
    [felder[i], felder[i + 1]].forEach((f, j) => {
      if (!f) {
        return;
      }
      const x = RAND.links + j * (breite + luecke);
      s.seite.drawLine({ start: { x, y: s.y }, end: { x: x + breite, y: s.y }, thickness: 0.6, color: SCHWARZ });
      s.seite.drawText(winAnsi(f), { x, y: s.y - 11, size: 8.5, font: s.normal, color: GRAU });
    });
    s.y -= 26;
  }
}

/**
 * Setzt die Bausteine als A4-PDF und gibt die Bytes zurück.
 */
export async function erzeugePdf(bausteine: Baustein[], titel: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(winAnsi(titel));
  pdf.setCreator('schuldschein-generator.de');
  pdf.setProducer('schuldschein-generator.de');
  const s: Stift = {
    pdf,
    seite: pdf.addPage([A4.breite, A4.hoehe]),
    y: A4.hoehe - RAND.oben,
    normal: await pdf.embedFont(StandardFonts.Helvetica),
    fett: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  for (const b of bausteine) {
    if (b.art === 'titel') {
      einzeilig(s, b.text, 20, true, SCHWARZ, 2);
    } else if (b.art === 'unter') {
      einzeilig(s, b.text, 10.5, false, GRAU, 14);
    } else if (b.art === 'ueberschrift') {
      s.y -= 4;
      einzeilig(s, b.text, 11.5, true, SCHWARZ, 1);
    } else if (b.art === 'absatz') {
      absatz(s, b.teile, 10.5, 16);
      s.y -= 5;
    } else if (b.art === 'tabelle') {
      tabelle(s, b.kopf, b.zeilen);
    } else if (b.art === 'unterschriften') {
      unterschriften(s, b.felder);
    } else {
      s.y -= 10;
      einzeilig(s, b.text, 8, false, GRAU, 0);
    }
  }
  return pdf.save();
}
