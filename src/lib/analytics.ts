/**
 * Kennung fuer die Reichweitenmessung.
 *
 * Gemessen wird nur im Produktions-Build und nur, wenn PUBLIC_GA_ID gesetzt ist.
 * Fehlt sie, wird weder der Einwilligungsbanner noch Analytics eingebunden, und die
 * Datenschutzerklaerung beschreibt beides nicht. Lieber keine Statistik als ein
 * Zaehlpixel ohne funktionierende Einwilligung.
 */
export const analyticsId: string = import.meta.env.PUBLIC_GA_ID ?? '';
export const zaehlungAktiv: boolean = import.meta.env.PROD && '' !== analyticsId;

let gewarnt = false;
if (import.meta.env.PROD && !zaehlungAktiv && !gewarnt) {
  gewarnt = true;
  console.warn('[build] PUBLIC_GA_ID fehlt. Die Seite wird ohne Einwilligungsbanner und ohne Analytics gebaut.');
}
