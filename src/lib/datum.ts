import type { Sprache } from './i18n';

/** Ein Kalendertag ohne Uhrzeit und ohne Zeitzone. */
export interface Tag {
  jahr: number;
  monat: number;
  tag: number;
}

const MONATE_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];

/**
 * Anzahl der Tage im Monat, Schaltjahre eingeschlossen.
 */
export function tageImMonat(jahr: number, monat: number): number {
  return new Date(Date.UTC(jahr, monat, 0)).getUTCDate();
}

/**
 * Addiert Monate wie § 188 Abs. 2 und 3 BGB: gleicher Tag im Zielmonat, fehlt er dort,
 * der letzte Tag des Monats. Aus dem 31.01. plus ein Monat wird der 28.02. (im Schaltjahr 29.02.).
 */
export function plusMonate(start: Tag, monate: number): Tag {
  const index = start.jahr * 12 + (start.monat - 1) + monate;
  const jahr = Math.floor(index / 12);
  const monat = (index % 12) + 1;
  return { jahr, monat, tag: Math.min(start.tag, tageImMonat(jahr, monat)) };
}

/**
 * Liest "JJJJ-MM-TT" aus einem Datumsfeld. Gibt null zurück, wenn der Tag nicht existiert.
 */
export function leseIso(wert: string): Tag | null {
  const treffer = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wert.trim());
  if (!treffer) {
    return null;
  }
  const [jahr, monat, tag] = treffer.slice(1).map(Number);
  if (monat < 1 || monat > 12 || tag < 1 || tag > tageImMonat(jahr, monat)) {
    return null;
  }
  return { jahr, monat, tag };
}

/**
 * Schreibt einen Tag als "JJJJ-MM-TT" für Datumsfelder.
 */
export function alsIso(t: Tag): string {
  return `${t.jahr}-${String(t.monat).padStart(2, '0')}-${String(t.tag).padStart(2, '0')}`;
}

/**
 * Heutiger Tag nach der Uhr des Geräts, nicht nach UTC. Sonst stünde zwischen
 * Mitternacht und zwei Uhr deutscher Zeit der Vortag im Vertrag.
 */
export function heute(jetzt: Date = new Date()): Tag {
  return { jahr: jetzt.getFullYear(), monat: jetzt.getMonth() + 1, tag: jetzt.getDate() };
}

/**
 * Vergleicht zwei Tage. Negativ, wenn a vor b liegt.
 */
export function vergleiche(a: Tag, b: Tag): number {
  return (a.jahr - b.jahr) * 10000 + (a.monat - b.monat) * 100 + (a.tag - b.tag);
}

/**
 * Formatiert einen Tag für den Vertrag: "31.12.2027" oder "31 December 2027".
 */
export function formatiereTag(t: Tag, sprache: Sprache): string {
  if (sprache === 'de') {
    return `${String(t.tag).padStart(2, '0')}.${String(t.monat).padStart(2, '0')}.${t.jahr}`;
  }
  return `${t.tag} ${MONATE_EN[t.monat - 1]} ${t.jahr}`;
}
