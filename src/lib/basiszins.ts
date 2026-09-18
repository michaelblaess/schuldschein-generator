/**
 * Basiszinssatz nach § 247 BGB. Ändert sich zum 1. Januar und 1. Juli.
 * Quelle: Deutsche Bundesbank, Tabelle abgerufen am 18.09.2026.
 */
export const BASISZINS = {
  prozent: 1.52,
  gueltigAb: '01.07.2026',
  // Verzugszins unter Privatleuten: fuenf Prozentpunkte darueber (§ 288 Abs. 1 BGB)
  verzug: 6.52,
  quelle: 'https://www.bundesbank.de/de/bundesbank/organisation/agb-und-regelungen/basiszinssatz-607820',
  geprueft: '18.09.2026',
  verlauf: [
    { ab: '01.07.2026', prozent: 1.52 },
    { ab: '01.01.2026', prozent: 1.27 },
    { ab: '01.07.2025', prozent: 1.27 },
    { ab: '01.01.2025', prozent: 2.27 },
  ],
};
