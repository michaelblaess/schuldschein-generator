# Rechteprüfung schuldschein-generator.de

Diese Datei ist Teil des Livegang-Gates. `pruefe-gate.mjs` zählt die offenen Kästchen und
fällt durch, solange eines davon leer ist. Was hier steht, kann kein Skript prüfen - deshalb
steht es hier und nicht im Code.

Jeder Haken braucht ein Datum und einen Befund. Ein Haken ohne Befund ist wertlos.

## Bilder

- [x] **Jedes Foto einzeln geöffnet und angesehen.** Befund 18.09.2026: Die Seite enthält
      keine Fotos. Im Build liegen genau fünf Bilddateien (`find dist` nach png, jpg, svg,
      webp, gif, ico): `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` und `og.png`,
      alle aus dem eigenen Logo per `tools/erzeuge-bilder.mjs` erzeugt, sowie
      `bilder/logo-micha5.png`, Michaels eigenes Logo von michaelblaess.de. Alle angesehen.
- [x] **Beigaben und Verpackungen geprüft.** Befund 18.09.2026: entfällt, es gibt keine
      Produktfotos und keine abgebildeten Gegenstände.
- [x] **Handschriften, Namen, Unterschriften, Absender geprüft.** Befund 18.09.2026: Der
      Schwung im Logo ist eine gezeichnete Linie, keine echte Unterschrift. Beispielnamen
      stehen nur in den Entwürfen unter `docs/`, nicht auf der Seite. Die Vorschau zeigt im
      Ausgangszustand Platzhalter ("Name", "Anschrift").
- [x] **Entfernte Bilder sind auch aus dem Build verschwunden.** Befund 18.09.2026: Die Liste
      oben ist vollständig, aus der alten Fassung (DaisyUI, `public/js`, `public/css`) ist
      nichts übrig. Die Seite nutzt kein `import.meta.glob`.

## Marken und Namen

- [x] **Alle im Text genannten Marken stehen im Markenhinweis.** Befund 18.09.2026: genannt
      werden Microsoft Word (Knopf "Word"), GitHub (Impressum) und Google Analytics
      (Datenschutz, Fragen). Alle drei stehen im Abschnitt "Marken" des Impressums, deutsch und
      englisch. ALL-INKL steht nur als Hoster in der Datenschutzerklärung, als Pflichtangabe.
- [x] **Sonderfälle bedacht.** Befund 18.09.2026: keine olympischen Begriffe. Personennamen
      stehen nur als Aktenzeichen-Beschreibung ohne Namen der Beteiligten, die Gerichte werden
      mit Bezeichnung und Aktenzeichen genannt.
- [x] **Eigener Projekt- und Domainname über TMview geprüft.** Befund 18.09.2026, TMview-API
      mit Positivkontrolle (`adidas` 1754 Treffer): `schuldschein generator`,
      `schuldschein-generator` und `schuldscheingenerator` je 0 Treffer weltweit. `schuldschein`
      allein 6 Treffer, davon eingetragen und in Klasse 42 nur "SCHULDSCHEINBÖRSE DEUTSCHLAND
      BÖRSEN HAMBURG - HANNOVER" (BÖAG Börsen AG, DE, Klassen 36, 38, 42), die übrigen
      abgelaufen oder Klasse 36. "Schuldschein" ist zugleich ein Begriff aus dem Gesetz
      (§ 371 BGB). Firmensuche per Websuche: kein anderer Anbieter tritt unter dem Namen
      "Schuldschein-Generator" auf, Wettbewerber nennen ihre Angebote beschreibend (Vorlage,
      Muster). Das ist ein Befund, keine Freigabe.
- [x] **Fremde Marken nicht im Domainnamen.** Befund 18.09.2026: Die Domain besteht nur aus
      "schuldschein" und "generator".

## Texte und Zitate

- [x] **Keine übernommenen Textpassagen.** Befund 18.09.2026: Alle Texte sind neu geschrieben.
      Die Zusammenfassungen der Urteile sind eigene Kurzfassungen, die wörtlichen Zitate stehen
      nur in `docs/recherche-rechtslage.md` mit Fundstelle, nicht auf der Seite. Gesetze werden
      verlinkt, nicht abgeschrieben.
- [x] **Zitate stammen aus dem gepflegten Pool.** Befund 18.09.2026: Die neue Fassung hat kein
      Zitat mehr, auch nicht im Fuß.

## Rechtstexte

- [x] **Impressum nach § 5 DDG.** Befund 18.09.2026: Überschrift "Angaben gemäß § 5 DDG", kein
      TMG mehr (Gate-Bedingung grün). Offen bleibt nur, ob das Postfach
      info@schuldschein-generator.de Post annimmt: MX zeigt auf w0154f32.kasserver.com, das
      Postfach selbst ist ohne KAS-Zugang nicht prüfbar.
- [x] **Datenschutzerklärung nennt jeden eingebundenen Dienst.** Befund 18.09.2026: Hoster
      ALL-INKL mit Anschrift aus deren Impressum, Server-Logs, Local Storage mit beiden
      Schlüsseln (`thema`, `schuldschein-eingaben`), Einwilligung und Google Analytics nur bei
      gesetzter Mess-Kennung (`src/lib/recht.ts`, `nurMitZaehlung`). Der Smoketest misst, dass
      ohne Häkchen weder Local Storage noch Session Storage noch Cookies entstehen und keine
      Anfrage an fremde Server geht.
- [x] **Einwilligung im Browser nachgewiesen.** Befund 18.09.2026: `pruefe-einwilligung.mjs`
      gegen einen Produktionsbuild mit Test-Kennung `G-TEST000000`, 13 von 13 Bedingungen:
      vor der Entscheidung und nach Ablehnen 0 Requests an Google und kein `_ga`-Cookie, nach
      Zustimmung Analytics geladen und Consent Mode auf granted. Mit der echten Kennung ist
      der Lauf zu wiederholen.

## Abweichungen vom Gate

- Abweichung: `zaehlung` steht in `web-gate.json` auf `false`.
- Begründung: Es gibt noch keine GA4-Mess-Kennung für diese Domain. Ohne Kennung baut die
  Seite fail-closed ohne Banner und ohne Analytics, und das Gate darf dann keinen Banner
  verlangen. Sobald die Kennung da ist, auf `true` stellen und mit ihr bauen.
- Datum: 18.09.2026
