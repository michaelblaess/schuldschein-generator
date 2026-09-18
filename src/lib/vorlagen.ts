import type { Sprache } from './i18n';
import type { Fassung } from './vertrag';

export interface Vorlage {
  fassung: Fassung;
  datei: string;
  titel: string;
  text: string;
}

/** Die vier Vorlagen je Sprache. Dateinamen ohne Endung, PDF und DOCX entstehen beim Bauen. */
export const VORLAGEN: Record<Sprache, Vorlage[]> = {
  de: [
    { fassung: 'kompakt', datei: 'schuldschein-kompakt', titel: 'Kompakt', text: 'Das Nötigste auf einer Seite. Reicht für die meisten Fälle in Familie und Freundeskreis.' },
    { fassung: 'ausfuehrlich', datei: 'schuldschein-ausfuehrlich', titel: 'Ausführlich', text: 'Mit Zinsen, Auszahlung, Rückzahlung, Verzug, Quittung und Schriftform. Für größere Beträge.' },
    { fassung: 'raten', datei: 'schuldschein-ratenzahlung', titel: 'Ratenzahlung', text: 'Mit Ratenplan. Jede Rate wird in der Tabelle quittiert, so gibt es später keinen Streit.' },
    { fassung: 'quittung', datei: 'quittung-rueckzahlung', titel: 'Quittung', text: 'Bestätigt, dass Geld zurückgezahlt wurde. Auch für einzelne Raten.' },
  ],
  en: [
    { fassung: 'kompakt', datei: 'promissory-note-short', titel: 'Short', text: 'The essentials on one page. Enough for most loans between family and friends.' },
    { fassung: 'ausfuehrlich', datei: 'promissory-note-detailed', titel: 'Detailed', text: 'With interest, payout, repayment, late payment, receipt and written form. For larger amounts.' },
    { fassung: 'raten', datei: 'promissory-note-instalments', titel: 'Instalments', text: 'With a repayment schedule. Every instalment is signed off in the table, which avoids disputes later.' },
    { fassung: 'quittung', datei: 'repayment-receipt', titel: 'Receipt', text: 'Confirms that money was paid back. Also for single instalments.' },
  ],
};
