import { plusMonate, vergleiche, type Tag } from './datum';

export type Rhythmus = 'einmal' | 'monatlich' | 'vierteljaehrlich';

export interface Rate {
  nummer: number;
  faellig: Tag;
  cent: number;
}

const SCHRITT: Record<Exclude<Rhythmus, 'einmal'>, number> = { monatlich: 1, vierteljaehrlich: 3 };

/** Mehr Raten erzeugt der Generator nicht, das waere kein Schuldschein mehr, sondern eine Tabelle. */
export const HOECHSTZAHL_RATEN = 120;

/**
 * Verteilt einen Betrag auf Raten zwischen erster Rate und Enddatum.
 * Alle Raten sind gleich hoch, der Rundungsrest kommt auf die letzte Rate.
 * Gibt eine leere Liste zurück, wenn die Angaben keinen Plan ergeben.
 */
export function ratenplan(cent: number, rhythmus: Rhythmus, erste: Tag, ende: Tag): Rate[] {
  if (rhythmus === 'einmal' || cent <= 0 || vergleiche(erste, ende) > 0) {
    return [];
  }
  const termine: Tag[] = [];
  for (let i = 0; i < HOECHSTZAHL_RATEN; i++) {
    // Immer vom ersten Termin aus rechnen, sonst wandert der 31. ueber den Februar auf den 28.
    const termin = plusMonate(erste, i * SCHRITT[rhythmus]);
    if (vergleiche(termin, ende) > 0) {
      break;
    }
    termine.push(termin);
  }
  const grund = Math.floor(cent / termine.length);
  return termine.map((faellig, i) => ({
    nummer: i + 1,
    faellig,
    cent: i === termine.length - 1 ? cent - grund * (termine.length - 1) : grund,
  }));
}
