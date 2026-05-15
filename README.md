# 🧾 Schuldschein-Generator

<p align="center">
  <img src="docs/flags/gb.svg" height="13" alt=""> <b>English</b> ·
  <img src="docs/flags/de.svg" height="13" alt=""> <a href="README.de.md">Deutsch</a>
</p>

---

[![Stars](https://img.shields.io/github/stars/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=fbbf24)](https://github.com/michaelblaess/schuldschein-generator/stargazers)
[![Forks](https://img.shields.io/github/forks/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=34d399)](https://github.com/michaelblaess/schuldschein-generator/network/members)
[![Issues](https://img.shields.io/github/issues/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=f87171)](https://github.com/michaelblaess/schuldschein-generator/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/michaelblaess/schuldschein-generator?logo=github&logoColor=white&color=a78bfa)](https://github.com/michaelblaess/schuldschein-generator/pulls)

[![Last Commit](https://img.shields.io/github/last-commit/michaelblaess/schuldschein-generator?logo=git&logoColor=white&color=3b82f6)](https://github.com/michaelblaess/schuldschein-generator/commits/main)
[![License](https://img.shields.io/badge/license-Apache_2.0-3b82f6)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-4.x-3b82f6?logo=astro&logoColor=white)](https://astro.build/)

Private promissory note in **2 minutes** as PDF – **Free & Open Source** loan agreement generator under German law.

> **DE:** Erstelle einen privaten Schuldschein als PDF – kostenlos, anonym, ohne Server.  
> **EN:** Create a private promissory note as PDF – free, anonymous, no server.

---

## 🚀 Features

- Form → **live preview** → **PDF download** (100 % client-side)
- **No storage**, no cookies, no tracking
- **Dark/Light mode** with toggle (remembered locally)
- **German/English** switchable
- Automatic **due date** (contract date + term)
- **IBAN plausibility check**, amount formatting, amount in words
- Optional: **witness**, **customizable document title**, **watermark** in the PDF
- PDF engine: **jsPDF** (swappable)

---

## 📁 Project structure (current)

```
.
├── index.html
├── css/
│   └── styles.css                # Styles incl. dark/light
├── js/
│   ├── main.js                   # App logic & UI (main entry point)
│   ├── jsPdfController.js        # PDF generation (jsPDF)
│   └── ValidationController.js   # Validations (e.g. IBAN)
└── translations/
    ├── de-de.js                  # DE translations (JS, recommended)
    ├── en-us.js                  # EN translations (JS, recommended)
    ├── i18n.js                   # small i18n loader
    ├── de.json (optional backup) # JSON only as reference/backup
    └── en.json (optional backup)
```

> **Note on translations:**  
> Local `file://` calls block `fetch()` on JSON. Therefore translations are loaded **as JS files** (`de-de.js`, `en-us.js`). JSON files are optionally available as **backup**/reference.

---

## 🌍 Internationalization (i18n)

- `translations/de-de.js`, `translations/en-us.js` register dictionaries under `window.TRANSLATIONS[locale]`.
- `translations/i18n.js` provides `i18n.t('key')` and `i18n.setLocale('de-DE'|'en-US')`.
- The language is remembered in `localStorage`; fallback based on `navigator.language`.

---

## UI & Styling

This project uses **Astro**, **Tailwind CSS** and **DaisyUI** for all pages. Theming via `data-theme`.  
Please do **not** add your own dark-mode CSS.

---

## 🧪 Usage

1. **Open locally:** `index.html` in the browser (no server needed)  
   _(For CORS-free testing the local call is sufficient, since translations are included via JS.)_
2. **Fill out the form:** mind the required fields
3. **Check the preview:** the right column updates live
4. **Generate PDF:** button "Download PDF"

---

## 🔧 Customizations

- **Styles:** `css/styles.css` (colors, spacing, dark/light)
- **PDF engine:** `js/jsPdfController.js` (jsPDF swappable)
- **Translations:** `translations/de-de.js` / `en-us.js` (extend/translate keys)

Add a new language:

```js
// translations/fr-fr.js
window.TRANSLATIONS = window.TRANSLATIONS || {};
window.TRANSLATIONS["fr-FR"] = {
  /* ... keys like de-DE/en-US ... */
};
```

Then include it in `index.html` and offer it in the language toggle.

---

## 🐛 Known limitations

- PDF layout is optimized for "contract" use, but it is not a typesetting system (jsPDF)
- No server-side validation (everything client-side)
- Modern browsers recommended (2020+)

See `offene_punkte.md` for to-dos/ideas if available.

---

## 🔒 Privacy

- **No server connection**
- **No storage**, **no cookies**
- All input stays in the **browser** (client-side only)

---

## ⚖️ Legal Notice

"Schuldschein Generator" is **not a registered trademark**.  
This site is **not affiliated** with financial service providers, banks, or legal advisors.  
**Disclaimer:** No legal advice. Use at your own risk.

---

## 🪪 License

Apache-2.0 © 2025 Michael Blaess  
See `LICENSE` (unchanged) and `NOTICE` (attribution & notices).

---

## 📫 Contact

**info@schuldschein-generator.de**

Repo: https://github.com/michaelblaess/schuldschein-generator  
Website: https://schuldschein-generator.de
