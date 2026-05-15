# 🧾 Schuldschein-Generator

<p align="center">
  <img src="docs/flags/gb.svg" height="13" alt=""> <a href="README.md">English</a> ·
  <img src="docs/flags/de.svg" height="13" alt=""> <b>Deutsch</b>
</p>

---

[![Stars](https://img.shields.io/github/stars/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=fbbf24)](https://github.com/michaelblaess/schuldschein-generator/stargazers)
[![Forks](https://img.shields.io/github/forks/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=34d399)](https://github.com/michaelblaess/schuldschein-generator/network/members)
[![Issues](https://img.shields.io/github/issues/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=f87171)](https://github.com/michaelblaess/schuldschein-generator/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=a78bfa)](https://github.com/michaelblaess/schuldschein-generator/pulls)

[![Last Commit](https://img.shields.io/github/last-commit/michaelblaess/schuldschein-generator?logo=git&logoColor=white&color=3b82f6)](https://github.com/michaelblaess/schuldschein-generator/commits/main)
[![License](https://img.shields.io/badge/license-Apache_2.0-3b82f6)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-4.x-3b82f6?logo=astro&logoColor=white)](https://astro.build/)

Privater Schuldschein in **2 Minuten** als PDF – **Free & Open Source** loan agreement generator under German law.

> **DE:** Erstelle einen privaten Schuldschein als PDF – kostenlos, anonym, ohne Server.  
> **EN:** Create a private promissory note as PDF – free, anonymous, no server.

---

## 🚀 Funktionen

- Formular → **Live-Vorschau** → **PDF-Download** (100 % client-seitig)
- **Keine Speicherung**, keine Cookies, kein Tracking
- **Dark/Light Mode** mit Toggle (lokal gemerkt)
- **Deutsch/Englisch** umschaltbar
- Automatische **Fälligkeit** (Vertragsdatum + Laufzeit)
- **IBAN-Plausibilitätscheck**, Betrag-Formatierung, Betrag in Worten
- Optional: **Zeuge/Zeugin**, **anpassbarer Dokumenttitel**, **Wasserzeichen** im PDF
- PDF-Engine: **jsPDF** (austauschbar)

---

## 📁 Projektstruktur (aktuell)

```
.
├── index.html
├── css/
│   └── styles.css                # Styles inkl. Dark/Light
├── js/
│   ├── main.js                   # App-Logik & UI (Haupteinstieg)
│   ├── jsPdfController.js        # PDF-Generierung (jsPDF)
│   └── ValidationController.js   # Validierungen (z. B. IBAN)
└── translations/
    ├── de-de.js                  # DE-Uebersetzungen (JS, empfohlen)
    ├── en-us.js                  # EN-Uebersetzungen (JS, empfohlen)
    ├── i18n.js                   # kleiner i18n-Loader
    ├── de.json (optional Backup) # JSON nur als Referenz/Backup
    └── en.json (optional Backup)
```

> **Hinweis zu Übersetzungen:**  
> Lokale `file://`-Aufrufe blockieren `fetch()` auf JSON. Deshalb werden Übersetzungen **als JS-Dateien** geladen (`de-de.js`, `en-us.js`). JSON-Dateien sind optional als **Backup**/Referenz vorhanden.

---

## 🌍 Internationalisierung (i18n)

- `translations/de-de.js`, `translations/en-us.js` registrieren Dictionaries unter `window.TRANSLATIONS[locale]`.
- `translations/i18n.js` stellt `i18n.t('key')` und `i18n.setLocale('de-DE'|'en-US')` bereit.
- Sprache wird in `localStorage` gemerkt; Fallback anhand `navigator.language`.

---

## UI & Styling

Dieses Projekt nutzt **Astro**, **Tailwind CSS** und **DaisyUI** für alle Seiten. Theming via `data-theme`.  
Bitte **kein** eigenes Dark-Mode-CSS hinzufügen.

---

## 🧪 Verwendung

1. **Lokal öffnen:** `index.html` im Browser (kein Server nötig)  
   _(Für CORS-freies Testen ist der lokale Aufruf ausreichend, da Übersetzungen per JS eingebunden sind.)_
2. **Formular ausfüllen:** Pflichtfelder beachten
3. **Vorschau prüfen:** Rechte Spalte aktualisiert sich live
4. **PDF generieren:** Button „PDF herunterladen“

---

## 🔧 Anpassungen

- **Styles:** `css/styles.css` (Farben, Abstände, Dark/Light)
- **PDF-Engine:** `js/jsPdfController.js` (jsPDF austauschbar)
- **Translations:** `translations/de-de.js` / `en-us.js` (Keys erweitern/übersetzen)

Neue Sprache hinzufügen:

```js
// translations/fr-fr.js
window.TRANSLATIONS = window.TRANSLATIONS || {};
window.TRANSLATIONS["fr-FR"] = {
  /* ... keys wie de-DE/en-US ... */
};
```

Dann in `index.html` einbinden und im Language-Toggle anbieten.

---

## 🐛 Bekannte Einschränkungen

- PDF-Layout ist „vertraglich“ optimiert, aber kein Satzsystem (jsPDF)
- Keine Server-Validierung (alles client-seitig)
- Moderne Browser empfohlen (2020+)

Siehe ggf. `offene_punkte.md` für To-dos/Ideen.

---

## 🔒 Datenschutz

- **Keine Server-Verbindung**
- **Keine Speicherung**, **keine Cookies**
- Alle Eingaben bleiben im **Browser** (Client-side only)

---

## ⚖️ Rechtlicher Hinweis

„Schuldschein Generator“ ist **kein eingetragenes Warenzeichen**.  
Diese Website steht in **keinem Zusammenhang** mit Finanzdienstleistern, Banken oder Rechtsberatern.  
**Disclaimer:** Keine Rechtsberatung. Nutzung auf eigenes Risiko.

---

## 🪪 Lizenz

Apache-2.0 © 2025 Michael Blaess  
Siehe `LICENSE` (unverändert) und `NOTICE` (Attribution & Hinweise).

---

## 📫 Kontakt

**info@schuldschein-generator.de**

Repo: https://github.com/michaelblaess/schuldschein-generator  
Website: https://schuldschein-generator.de
