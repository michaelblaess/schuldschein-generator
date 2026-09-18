import type { Sprache } from './i18n';

/**
 * Liest einen Geldbetrag so, wie Menschen ihn eintippen, und gibt Cent zurück.
 * Rechnet in ganzen Cent, damit keine Gleitkommafehler in den Vertrag geraten.
 * Akzeptiert "2500", "2.500", "2.500,50", "2500,5" und "2500.50".
 * Gibt null zurück, wenn die Eingabe kein eindeutiger Betrag ist.
 */
export function leseBetrag(eingabe: string): number | null {
  const roh = eingabe.replace(/\s|€|eur/gi, '');
  if (!roh) {
    return null;
  }
  let euro: string;
  let cent = '';
  if (roh.includes(',')) {
    // Deutsch: Punkt trennt Tausender, Komma die Cent
    const [links, rechts, zuviel] = roh.split(',');
    if (zuviel !== undefined || !/^\d{1,3}(\.\d{3})*$|^\d+$/.test(links) || !/^\d{0,2}$/.test(rechts)) {
      return null;
    }
    euro = links.replace(/\./g, '');
    cent = rechts;
  } else if (/^\d{1,3}(\.\d{3})+$/.test(roh)) {
    euro = roh.replace(/\./g, '');
  } else if (/^\d+(\.\d{1,2})?$/.test(roh)) {
    [euro, cent = ''] = roh.split('.');
  } else {
    return null;
  }
  const wert = Number(euro) * 100 + Number(cent.padEnd(2, '0') || '0');
  return Number.isSafeInteger(wert) ? wert : null;
}

/**
 * Formatiert Cent als Betrag mit zwei Nachkommastellen in der Schreibweise der Sprache.
 */
export function formatiereBetrag(cent: number, sprache: Sprache): string {
  return (cent / 100).toLocaleString(sprache === 'de' ? 'de-DE' : 'en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
