# Code-Review schuldschein-generator

Stand 18.09.2026. Nur gelesen, nichts geändert. `npm run build` läuft durch (10 Seiten, keine
Warnungen). Die Live-Seite schreibt beim Laden `Identifier 'TranslationController' has already
been declared` in die Konsole (Headless-Chromium gegen https://schuldschein-generator.de/).

**Vorbemerkung:** Ausgeliefert werden `public/js/*` und `public/translations/*`, nicht `js/` und
`translations/` im Root. Die beiden Stände sind auseinandergelaufen (`public/js/main.js` 391
Zeilen, `js/main.js` 712). Zeilenangaben zu `main.js` beziehen sich auf `public/js/main.js`.

## A. Fehler, die ein falsches Dokument erzeugen

1. **Doppelte §-Nummern** (`main.js:188` und `:191`): beide lauten `§ ${d.zweck ? '4' : '3'}`.
   Live sichtbar als zweimal "§ 3". In `js/main.js:352` ist es richtig.
2. **Betrag in Worten** (`main.js:86-107`): Cent fallen weg ("1.234,56" wird
   "eintausendzweihundertvierunddreißig Euro"), "1.000.000,00" wird "ein Million Euro", "0,50"
   wird "null" ohne "Euro". Auf den EN-Seiten immer deutsch.
3. **Zinssatz-Satz ohne Verb** (`main.js:198`, `de-de.js:85-87`): "Das Darlehen wird mit 3 %
   p.a.." - Verb fehlt, doppelter Punkt, Dezimalpunkt statt Komma.
4. **Verzugszins widersprüchlich:** Label "Verzugszins (% p.a.)", Hinweis "5% über
   Basiszinssatz", Dokument "X Prozentpunkte über dem Basiszinssatz". Wer 8 % meint, bekommt
   8 Prozentpunkte über dem Basiszins.
5. **Fälligkeitsdatum** (`main.js:74-78`, `setMonth`): 31.01.2026 plus ein Monat ergibt
   03.03.2026. Nach § 188 Abs. 3 BGB wäre es der 28.02.2026.
6. **Ratenzahlung unbestimmt** (`main.js:192`): keine Ratenhöhe, Anzahl, Beginn. Der Rhythmus
   steht als Rohwert im Text ("vierteljaehrlich"). Die Kündigungsregel nach § 488 Abs. 3 BGB
   fehlt im Dokument.
7. **Gerichtsstand als Pflichtfeld** (`de-de.js:92`, `Generator.astro:244`): Zwischen
   Privatleuten nach § 38 Abs. 1 ZPO grundsätzlich unwirksam. Derselbe Wert dient zugleich als
   Ausstellungsort (`main.js:213`).
8. **Keine Empfangsbestätigung:** "Die Auszahlung erfolgt in bar" steht in der Zukunft, dass das
   Geld erhalten wurde, bestätigt das Dokument nicht.
9. **"rechtssichere Darlehensverträge"** im Untertitel (`de-de.js:7`) widerspricht dem
   Haftungshinweis (`de-de.js:98`).
10. **PDF** (`public/js/jsPdfController.js`): Dateiname ignoriert `nehmer_name` (Z. 134-142,
    183), "SCHULDSCHEIN" fest eingebaut und auf EN doppelt (Z. 167), Unterschriftslinien fehlen
    im PDF (nur CSS-Rahmen).
11. **Vertragsdatum in UTC** (`main.js:263`, `:329`): zwischen 0 und 2 Uhr steht der Vortag.

## B. Robustheit und Sicherheit

- `preview.innerHTML` mit unescapten Formularwerten (`main.js:144`). Nur Self-XSS, aber ein `<`
  im Namen zerstört Vorschau und PDF.
- localStorage ohne try/catch (`Base.astro:146,154`, `TranslationController.js:18,48`,
  `main.js:290,297,331`).
- Doppelte Listener für Theme, Sprache und `translation:change` in `Base.astro` und `main.js`.
- jsPDF-CDN-Script ohne `is:inline` wird von Astro gebündelt, ob `jsPDF` global verfügbar ist,
  ist unbelegt.
- `<html lang="de">` auch auf `/en/`.
- IBAN ohne Prüfsumme (mod 97), Kleinbuchstaben werden abgelehnt (`ValidationController.js:212`).

## C. Nur durch die uncommitteten Änderungen

1. Die Fortschrittsleiste läuft nie: `updateProgressBar` steht nur in `js/main.js`, nicht in der
   ausgelieferten Kopie.
2. Neue Schlüssel (`progress-label`, `preview-title`, `btn-download-pdf`, `btn-print`) fehlen in
   `public/translations/`.
3. Die Leiste startet ohne Eingabe bei 36 %, weil vier Felder vorbelegt sind. Eine ungültige IBAN
   zählt als ausgefüllt.
4. `fieldset`/`legend` ersatzlos entfallen, Collapse-Checkboxen ohne Label, der Reset-Knopf
   steckt in der zugeklappten Zeugen-Sektion.
5. Jedes Auf- und Zuklappen löst `updatePreview` und `saveFormData` aus.

## D. Altlasten

- Root-`index.html` ist tot (lädt nicht existierende `js/pages.js`, `js/ViewController.js`).
- Doppelte Quellen `js/` und `public/js/`, der Sync-Befehl aus `AGENTS.md:18` würde
  Regressionen einspielen.
- Doppelt im Root und in `public/`: `favicon.ico`, `robots.txt`, `sitemap.xml`, `manifest.json`,
  `css/`. Eingecheckt: `schuldschein-generator.zip`, `.astro/settings.json`.
- `public/js/pdf.js` ungenutzt, `copyPreviewText` ohne Knopf.
- `CLAUDE.md` beschreibt `templates/` und `common.js`, die es nicht gibt.
- 35 En-Dashes in 12 Dateien.
