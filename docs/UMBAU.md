# Umbau schuldschein-generator.de

Stand 18.09.2026, Branch `redesign`. Grundlage sind die Entwürfe F bis I in
`docs/design-vorschlaege/` und die Befunde aus `docs/CODE-REVIEW.md`.

## Entscheidungen

- **Stack:** Astro 7, Tailwind 4 über `@tailwindcss/vite`, keine DaisyUI mehr. Das eigene Design
  steht in `src/styles/global.css` mit Farbvariablen, Tailwind liefert Preflight und Hilfsklassen.
- **Schriften lokal** über `@fontsource` (Barlow Semi Condensed, IBM Plex Mono), kein Google-CDN.
- **Eine Quelle für den Vertragstext:** `src/lib/vertrag.ts` baut aus den Angaben eine Liste von
  Bausteinen. Daraus entstehen Vorschau, Druck, PDF (pdf-lib) und Word (docx). Die leeren Vorlagen
  sind derselbe Text ohne Angaben, damit Generator und Vorlagen nie auseinanderlaufen.
- **Reine Funktionen mit Tests** (vitest): Betrag lesen, Betrag in Worten (de/en), Monate addieren
  nach § 188 BGB, IBAN-Prüfsumme, Ratenplan.
- **Kein innerHTML mit Nutzereingaben.** Die Vorschau wird per DOM-API aufgebaut.
- **Speichern nur auf Wunsch:** Formulardaten nur mit Häkchen "Eingaben auf diesem Gerät merken",
  die Design-Wahl nur nach Klick auf den Schalter, die Sprache hängt an der Adresse.
- **Analytics fail-closed:** ohne `PUBLIC_GA_ID` weder Banner noch Google. Die
  Datenschutzerklärung hängt an derselben Bedingung.
- **Gerichtsstand entfällt** (§ 38 ZPO), Laufzeit und Fälligkeit werden zu "Zurück bis" oder
  "unbefristet, Kündigung mit drei Monaten Frist".
- **Empfangsbestätigung im Text:** "bestätigt, erhalten zu haben" statt "Die Auszahlung erfolgt".

## Seiten

| Deutsch | Englisch |
| --- | --- |
| `/` Generator | `/en/` |
| `/vorlagen/` | `/en/templates/` |
| `/rechtslage/` | `/en/law/` |
| `/fragen/` | `/en/faq/` |
| `/impressum/` | `/en/legal-notice/` |
| `/datenschutz/` | `/en/privacy/` |
| `/nutzungsbedingungen/` | `/en/terms/` |
| `/404.html` | |

Weiterleitungen (301) in `public/.htaccess`: `www` auf die Hauptadresse, `/about/` auf `/`,
`/en/about/`, `/en/impressum/`, `/en/datenschutz/`, `/en/nutzungsbedingungen/` auf die neuen
englischen Adressen.

## Schritte

1. Gerüst: Pakete, Layout, Kopf, Fuß, Schalter, Logo, Favicons, robots, sitemap mit lastmod, 404.
2. Bibliothek und Tests: `vertrag.ts`, `betrag.ts`, `zahlwort.ts`, `datum.ts`, `iban.ts`.
3. Generator (F), Vorlagen (G) mit PDF- und Word-Dateien aus dem Build, Rechtslage (H), Fragen (I).
4. Recht: Impressum nach § 5 DDG, Datenschutz an die Konfiguration gekoppelt, Nutzungsbedingungen.
5. Einwilligung und Analytics nach `claude-config/templates/consent/`.
6. Englische Fassung aller Seiten.
7. Prüfen: vitest, Build, Gate, axe, Einwilligung, Smoketest mit Browser, Druck.
8. Aufräumen: Altlasten (`js/`, `css/`, `translations/`, Root-`index.html`, zip), README, AGENTS.md.
9. Deploy-Workflow (zunächst nur `workflow_dispatch`), Livegang nach Freigabe.

## Offen, braucht Michael

- **FTP-Zugang für den Deploy:** Repository-Secrets `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` und
  der Zielordner auf dem Server. Die Zugangsdatei durfte ich nicht entschlüsseln.
- **GA4-Mess-Kennung** für die Domain, sonst bleibt Analytics aus (fail-closed).
- **Postfach** `info@schuldschein-generator.de`: existiert es, stimmen SPF, DKIM und DMARC?
