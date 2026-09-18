# Design-Vorschläge schuldschein-generator.de

Stand 18.09.2026. Fünf Richtungen als statische Entwürfe in diesem Ordner, jeweils eine
HTML-Datei ohne Build. Beispieldaten sind erfunden (Anna Berger leiht Jonas Keller 2.500 Euro).

## Worum es geht

- **Gegenstand:** ein privates Darlehen zwischen Menschen, die sich kennen - Familie, Freunde,
  Paare. Kein Bankprodukt.
- **Publikum:** Privatleute ohne juristische Vorbildung, oft etwas unbehaglich, weil Geld unter
  Nahestehenden heikel ist.
- **Hauptaufgabe der Seite:** in wenigen Minuten ein sauberes, unterschriftsreifes Dokument
  erzeugen, ohne dass Daten den Browser verlassen. Daneben: Vorlagen zum Herunterladen,
  Rechtslage zum Nachlesen, ein unübersehbarer Haftungshinweis.

## Die fünf Richtungen

| Nr. | Name | Idee | Farben | Schrift |
| --- | --- | --- | --- | --- |
| A | Vordruck | Die Seite ist ein Formularblock aus dem Schreibwarenladen. Man füllt direkt im Dokument aus, statt links Formular, rechts Vorschau. | Formulargrün `#2F5D46`, Liniengrün `#A9C4B1`, Papier `#FBFCF8`, Tinte `#1B2430`, Blaustift `#2346A0` | Archivo Narrow (Feldbeschriftung), Courier Prime (Eintragungen) |
| B | Gesetzbuch | Typografie wie eine Gesetzessammlung. Jede Klausel hat am Rand die Norm, auf der sie beruht, mit Link. | Buchrot `#9E1B32`, Papier `#FFFFFF`, Satzschwarz `#1A1A1A`, Randgrau `#6B6B6B`, Markierung `#FFF3B0` | Literata (Text), Literata Italic (Randnoten) |
| C | Satzbaukasten | Der Vertrag beginnt als ein einziger Satz mit Lücken: "Anna leiht Jonas 2.500 Euro bis 31.12.2027." Erst danach die Details. | Nachtblau `#16243F`, Himmel `#DCEBFA`, Sonnenblume `#F2B705`, Weiß, Graublau `#56657F` | Bricolage Grotesque (alles) |
| D | Überweisungsträger | Anleihen beim SEPA-Beleg: rote Kästchenraster, Kästchen je Zeichen für Betrag und IBAN, maschinenlesbare Anmutung. | Belegrot `#C8102E`, Belegrosa `#FCEEF0`, Weiß, Schwarz `#111418`, Grau `#8A8F98` | Barlow Semi Condensed (UI), IBM Plex Mono (Kästchen) |
| E | Durchschlag | Zwei Ausfertigungen, eine für jede Seite. Das Dokument erscheint als Original und darunter als gelber Durchschlag in Blaupausenblau. | Blaupause `#2B3A8C`, Durchschlaggelb `#FFF4C2`, Original `#FFFFFF`, Tisch `#E7E9EF`, Stift `#12163A` | Spectral (Dokument), Public Sans (UI) |

## Gemeinsame Regeln für alle Entwürfe

- **Haftungshinweis sichtbar im ersten Bildschirm**, nicht im Fuß. Jede Richtung setzt ihn in
  ihrer eigenen Sprache um (Formularvermerk, Randnote, Hinweisband, Belegfeld, Stempel).
- Keine Werbeaussage "rechtssicher" - die heutige Seite verspricht das im Untertitel. Das ist
  eine Zusage, die ein Generator nicht einhalten kann.
- Drei Navigationsziele neben dem Generator: **Vorlagen**, **Rechtslage**, **Häufige Fragen**.
- Hell und dunkel, mobil ab 360 px, sichtbarer Tastaturfokus.

## Geprüft gegen die üblichen Standardlösungen

- Die naheliegende Lösung wäre "DaisyUI-Karten links, Vorschau rechts" - das ist die heutige
  Seite. A, C und E brechen diese Zweiteilung bewusst auf.
- B streift das Muster "Serifenschrift mit feinen Linien", ist aber durch den Stoff gedeckt: das
  Gesetzbuch ist das Material, aus dem ein Schuldschein besteht. Der Unterschied liegt in den
  Randnoten mit Normverweis, die echte Information tragen.
- Nummerierung (§ 1, § 2 ...) kommt nur dort vor, wo der Inhalt wirklich eine Folge ist.

## Neue Inhalte (Michaels Wunsch vom 18.09.2026)

- **Vorlagen zum Herunterladen**, als PDF und zusätzlich als DOCX zum Bearbeiten:
  Kompakt (1 Seite), Ausführlich (Zinsen, Verzug, Kündigung, Sondertilgung), Ratenzahlung (mit
  Tilgungsplan zum Eintragen), Quittung über die Rückzahlung. Erzeugt aus denselben Textbausteinen
  wie der Generator, damit Vorlage und Generator nie auseinanderlaufen.
- **Haftungshinweis** im ersten Bildschirm, auf jeder Vorlage als Fußzeile, im PDF.
- **Rechtslage und Urteile** als eigene Seite: Grundlage ist `docs/recherche-rechtslage.md`.
  Jede Entscheidung mit Gericht, Datum, Aktenzeichen und frei zugänglicher Fundstelle, dazu das
  Abrufdatum. Die Seite braucht ein festes Prüfdatum ("Stand"), weil Basiszins und
  Rechtsprechung sich ändern.

## Weitere Vorschläge

- **Quittung und Rückgabe als eigener Ablauf.** Der Schuldschein endet mit der Rückzahlung
  (§ 371 BGB). Eine Seite "Nach der Rückzahlung" erzeugt die Quittung, bei Raten auch
  Teilquittungen.
- **Tilgungsplan-Rechner** für Raten und Zinsen, mit Ausgabe als Anlage zum Vertrag.
- **Aktueller Basiszinssatz** automatisch im Text, wenn Verzugszinsen gewählt sind. Der Wert wird
  zum Build eingetragen (Bundesbank), nicht zur Laufzeit abgerufen.
- **Plausibilitätsprüfung statt reiner Pflichtfelder:** ein auffällig hoher Zinssatz bekommt einen Hinweis
  auf § 138 BGB, zinslose Darlehen unter Angehörigen einen Hinweis zur Schenkungsteuer (Wert aus
  der Recherche).
- **Häufige Fragen** mit strukturierten Daten (FAQPage), das hilft bei Antwortboxen in der Suche.
- **Teilen ohne Server:** Formularinhalt als Link mit Daten im `#`-Fragment. Das Fragment geht
  nicht an den Server, aber der Link enthält persönliche Daten, das muss dranstehen.
- **Drucken ohne PDF-Bibliothek:** eine saubere `@media print`-Fassung. Der heutige Export schreibt Text per jsPDF,
  dabei fehlen die Unterschriftslinien. Die Druckfassung braucht keine Bibliothek.
- **Du statt Sie** (Michael, 18.09.2026).

## Google Analytics

Möglich, mit drei Bedingungen:

1. Einwilligungsbanner aus `templates/consent/` (vanilla-cookieconsent), GA lädt erst nach
   Zustimmung und nur unter `import.meta.env.PROD`. Nachweis per `pruefe-einwilligung.mjs`.
2. Der Hinweis "Alle Eingaben bleiben in Ihrem Browser" muss präzisiert werden: Formularinhalte
   bleiben lokal, Nutzungsdaten gehen nach Einwilligung an Google. Datenschutzerklärung
   entsprechend (Spoke `web-recht`).
3. Kein Ereignis darf Feldinhalte tragen. Erlaubt sind Zählereignisse wie
   `pdf_erzeugt` mit Vorlagentyp, nie Namen, Beträge oder IBAN.

## Rückmeldung Michael, 18.09.2026

- D (Überweisungsträger) gefällt, B auch, aber die Schrift wirkt altmodisch. A: Farben nicht
  schön. C: verwirrend.
- **Maximale Einfachheit:** eine Seite, kein Assistent mit mehreren Schritten. Was komplexer
  ist, klappt auf. Mobil muss es sehr einfach bedienbar sein.
- Daraus entstand **F (`f-beleg-einseitig.html`)**: der Beleg aus D nur mit den Pflichtangaben
  (Namen, Anschriften, Betrag in Kästchen, zurück bis, Auszahlungsart), darunter aufklappbare
  Streifen im selben Stil (Zinsen, Raten, Geburtsdaten und Ausweis, Bankverbindungen, Zweck,
  Zeuge), deren Zusammenfassung auch zugeklappt den Stand zeigt. Vorschau darunter, Vorlagen
  danach, Aktionsleiste mit PDF und Drucken fest am unteren Rand.
- Entfallen: Gerichtsstand (§ 38 ZPO). Laufzeit und Fälligkeitsdatum sind zu "Zurück bis"
  zusammengelegt.

## Logo (18.09.2026)

- Vorlage: Gemini-Bild nach dem Prompt "Beleg mit Kästchenreihe und Unterschrift, nur Rot
  `#C8102E` und `#111418`, keine Schrift". Von Hand als SVG nachgebaut, das Gemini-Raster wird
  nicht verwendet (damit auch kein Wasserzeichen).
- `bilder/logo-marke.svg`: Bildmarke ab 32 px, fünf Kästchen und Unterschrift.
- `bilder/logo-favicon.svg`: eigene Kleinfassung für 16 und 32 px, drei Kästchen, dickerer
  Rahmen, keine Unterschrift - die fünf Kästchen verschwimmen bei 16 px zu einer Linie.
- Beide schalten per `prefers-color-scheme` auf Hellrot und Hellgrau um.
- Der Name steht nie im Bild, sondern als Text daneben.
- Offen: PNG-Favicons, apple-touch-icon und das Teilerbild 1200x630 (Skill `icon-generator`).

## Vorlagen als eigene Seite (18.09.2026)

- Michael: Vorlagen nicht unten auf dem Generator, sondern als eigene Seite, direkt über
  "Vorlagen" im Kopf erreichbar, mit Vorschau und Download.
- Umgesetzt als **G (`g-vorlagen.html`)**: vier Karten (Kompakt, Ausführlich, Ratenzahlung,
  Quittung), je eine verkleinerte erste Seite als echter Text, Knöpfe PDF und Word. Klick auf die
  Vorschau öffnet sie groß in einem `<dialog>` (Esc schließt, Fokus auf "Schließen"). Unten ein
  Verweis zurück zum Generator.
- Aus F ist der Vorlagen-Abschnitt entfernt, "Vorlagen" im Kopf zeigt auf G.
- Die Vorschau in der Karte ist `aria-hidden`, bedient wird sie über einen echten Knopf
  "Vergrößern", dessen Klickfläche die Vorschau abdeckt und auf die eigene Karte begrenzt ist.

## Rechtslage, Fragen, Hell/Dunkel (18.09.2026)

- **H (`h-rechtslage.html`):** "Das Wichtigste in Kürze" im Belegstil, darunter links das Gesetz
  nach Themen zum Aufklappen (mit Links auf gesetze-im-internet.de), rechts die 12 verifizierten
  Urteile nach Datum, jeweils mit Aktenzeichen und Volltext-Link. Die zwei unverifizierten
  Entscheidungen aus der Recherche fehlen bewusst. Stand-Datum oben, weil Basiszins und
  Rechtsprechung sich ändern.
- **I (`i-fragen.html`):** 18 Fragen in vier Gruppen, Antworten kurz, darunter die Grundlage.
  In der echten Seite zusätzlich als FAQPage-Daten auszeichnen.
- **Hell/Dunkel-Schalter** in allen vier Seiten (`thema.js`, `thema.css`): folgt dem System, bis
  jemand klickt, die Wahl bleibt gespeichert (localStorage mit try/catch). Das Logo im Kopf ist
  dafür inline eingebettet, weil ein SVG als `<img>` nur dem System folgt.
- **Falle beim Umbau:** Wer Dunkel-Regeln mit `:root:not([data-theme="light"])` präfixt, erhöht
  deren Spezifität. Eine Regel wie `.knopf` schlug dann `.knopf.zwei`. Abhilfe: Farben über
  Variablen, nicht über eigene Dunkel-Regeln pro Bauteil.
- **Handy-Navigation:** eigene zweite Zeile mit allen Menüpunkten statt ausgeblendeter Links.
  Vorher war von I aus die Vorlagenseite auf dem Handy nicht erreichbar.
