/**
 * Entfernt Leerzeichen und macht Buchstaben gross, damit "de89 3704 ..." durchgeht.
 */
export function normalisiereIban(eingabe: string): string {
  return eingabe.replace(/\s+/g, '').toUpperCase();
}

/**
 * Prüft Aufbau und Prüfsumme einer IBAN nach ISO 13616 (Modulo 97).
 * Für Deutschland gilt zusätzlich die feste Länge von 22 Zeichen.
 */
export function istGueltigeIban(eingabe: string): boolean {
  const iban = normalisiereIban(eingabe);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
    return false;
  }
  if (iban.startsWith('DE') && iban.length !== 22) {
    return false;
  }
  const umgestellt = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let rest = 0;
  for (const zeichen of umgestellt) {
    const ziffern = /\d/.test(zeichen) ? zeichen : String(zeichen.charCodeAt(0) - 55);
    for (const ziffer of ziffern) {
      rest = (rest * 10 + Number(ziffer)) % 97;
    }
  }
  return rest === 1;
}

/**
 * Schreibt eine IBAN in Vierergruppen, wie sie auf Kontoauszügen steht.
 */
export function formatiereIban(eingabe: string): string {
  return normalisiereIban(eingabe).replace(/(.{4})/g, '$1 ').trim();
}
