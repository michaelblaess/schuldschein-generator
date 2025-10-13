# Schuldschein-Generator - Project Documentation

## Project Overview

**Schuldschein-Generator** is a web-based application for generating German "Schuldschein" (promissory note/IOU) documents. The application supports bilingual operation (German/English) with real-time preview and PDF export functionality.

### Key Features

- **Bilingual Support**: Full German (de-DE) and English (en-US) translations
- **Real-time Preview**: Live markdown rendering with field interpolation
- **Theme System**: 6 DaisyUI themes (light, dark, corporate, forest, cupcake, nord)
- **PDF Export**: Generate PDF documents using jsPDF and html2canvas
- **Form Validation**: Real-time validation with visual feedback
- **Responsive Design**: Mobile-first with hamburger menu navigation
- **Persistence**: Theme and language preferences saved to localStorage

## Architecture

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS + DaisyUI v4.12.10
- **PDF Generation**: jsPDF + html2canvas
- **Markdown Rendering**: Custom implementation
- **State Management**: Event-driven architecture with custom events

### Project Structure

```
schuldschein-generator/
├── index.html                 # Main HTML with DaisyUI components
├── css/
│   └── styles.css            # Minimal custom styles (glow effects, print)
├── js/
│   ├── main.js               # Main application logic
│   ├── TranslationController.js  # i18n management class
│   └── lib/                  # External libraries (jsPDF, html2canvas)
├── translations/
│   ├── de-DE.js              # German translations
│   └── en-US.js              # English translations
├── templates/
│   ├── schuldschein-de.md    # German document template
│   └── schuldschein-en.md    # English document template
└── md-docs/                  # Project documentation
```

## Key Components

### 1. TranslationController (`js/TranslationController.js`)

**Purpose**: Centralized translation management with event-driven architecture

**API**:
```javascript
// Initialize
window.translation = new TranslationController({
    storageKey: 'language',
    defaultLocale: 'de-DE',
    translations: window.TRANSLATIONS
});
window.translation.init();

// Get/Set locale
const locale = window.translation.getLocale();  // 'de-DE' or 'en-US'
window.translation.setLocale('en-US');  // Triggers 'translation:change' event

// Get translation
const text = window.translation.t('key');  // Returns translated string

// Apply translations to DOM
window.translation.apply();  // Translates all [data-i18n] and [data-i18n-attr] elements
```

**Features**:
- Automatic locale normalization (`de` → `de-DE`, `en` → `en-US`)
- localStorage persistence
- Custom events: `translation:change`, `i18n:change`
- Support for `data-i18n` (text content) and `data-i18n-attr` (attributes)
- Fallback to browser language or default locale

### 2. Main Application (`js/main.js`)

**Purpose**: Core application logic for form handling, preview, and PDF generation

**Key Functions**:
- `applyTranslations()`: Updates all translatable elements in the UI
- `updatePreview()`: Renders markdown preview with field interpolation
- `generatePDF()`: Creates PDF document from preview (see `js/jsPdfController.js`)
- Field validation with glow effects (yellow=change, green=valid, red=invalid)
- Auto-save to localStorage on field changes
- Real-time character counting for purpose field

**Data Binding**:
- `data-field`: Links input to template variable (e.g., `data-field="geber_name"`)
- `data-preview`: Marks preview spans for glow effects
- `data-i18n`: Marks element for text translation
- `data-i18n-attr`: Marks element for attribute translation

### 3. DaisyUI Theme System

**Implementation**:
```javascript
// Theme persistence
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
}

// Theme selection
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-theme-set]');
    if (!el) return;
    const theme = el.getAttribute('data-theme-set');
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});
```

**Available Themes**: light, dark, corporate, forest, cupcake, nord

### 4. Language Toggle

**Implementation**:
```javascript
const languageCheckbox = languageToggle.querySelector('input[type="checkbox"]');

// Initial state
languageCheckbox.checked = (window.translation.getLocale() === 'en-US');

// Toggle event
languageCheckbox.addEventListener('change', () => {
    const newLocale = languageCheckbox.checked ? 'en-US' : 'de-DE';
    window.translation.setLocale(newLocale);
    updatePreview();
});

// Listen for external changes
window.addEventListener('translation:change', () => {
    const locale = window.translation.getLocale();
    languageCheckbox.checked = (locale === 'en-US');
    applyTranslations();
    updatePreview();
});
```

## Recent Major Changes

### 1. i18n System Refactor (TranslationController)

**Before**:
- Global `currentLanguage` variable
- Manual translation updates via `applyTranslations()`
- Inconsistent state management

**After**:
- Class-based `TranslationController`
- Single source of truth: `window.translation`
- Event-driven updates (`translation:change`)
- Automatic DOM updates via `data-i18n` attributes
- localStorage persistence

### 2. DaisyUI Migration

**Before**:
- Custom CSS with 219 lines
- Custom dark mode toggle switch
- Custom form styling
- Manual theme management

**After**:
- Minimal CSS (60 lines - only glow effects + print styles)
- DaisyUI component system
- 6 built-in themes via `data-theme`
- DaisyUI navbar with hamburger menu
- All form controls using DaisyUI classes

**HTML Changes**:
```html
<!-- Before -->
<input id="geber_name" data-field="geber_name" type="text" required />

<!-- After -->
<label class="form-control">
  <div class="label py-1">
    <span id="text-name-lender" class="label-text">Name</span>
    <span class="label-text-alt text-error">*</span>
  </div>
  <input id="geber_name" data-field="geber_name" type="text"
         class="input input-bordered input-sm" required />
</label>
```

## Translation System

### Adding Translations

**1. Text Content** (`data-i18n`):
```html
<h2 data-i18n="heading-lender">Name des Darlehensgebers</h2>
```

**2. Attributes** (`data-i18n-attr`):
```html
<input data-i18n-attr="placeholder:placeholder-purpose;title:tooltip-help" />
```

**3. Translation Files**:
```javascript
// translations/de-DE.js
window.TRANSLATIONS = window.TRANSLATIONS || {};
window.TRANSLATIONS['de-DE'] = {
    'heading-lender': 'Name des Darlehensgebers',
    'placeholder-purpose': 'z.B. Unterstützung beim Studium',
    // ... more keys
};
```

### Translation Key Naming Convention

- `heading-*`: Section headings
- `label-*`: Form labels
- `placeholder-*`: Input placeholders
- `tooltip-*`: Tooltip text
- `btn-*`: Button labels
- `text-*`: General text content
- `error-*`: Error messages

## PDF Generation

**Process**:
1. User fills out form
2. Real-time preview updates via markdown rendering
3. Click "PDF erzeugen" / "Generate PDF"
4. `generatePDF()` captures preview div with html2canvas
5. jsPDF creates PDF with captured image
6. Downloads as `Schuldschein_[Date]_[Time].pdf`

**Configuration**:
```javascript
// pdf-config.js (if exists)
const PDF_OPTIONS = {
    format: 'a4',
    unit: 'mm',
    orientation: 'portrait',
    margin: 10
};
```

## Form Fields

| Field ID | Variable | Type | Required | Description |
|----------|----------|------|----------|-------------|
| `geber_name` | `{geber_name}` | text | Yes | Lender name |
| `geber_strasse` | `{geber_strasse}` | text | Yes | Lender street |
| `geber_plz` | `{geber_plz}` | text | Yes | Lender postal code |
| `geber_ort` | `{geber_ort}` | text | Yes | Lender city |
| `nehmer_name` | `{nehmer_name}` | text | Yes | Borrower name |
| `nehmer_strasse` | `{nehmer_strasse}` | text | Yes | Borrower street |
| `nehmer_plz` | `{nehmer_plz}` | text | Yes | Borrower postal code |
| `nehmer_ort` | `{nehmer_ort}` | text | Yes | Borrower city |
| `betrag` | `{betrag}` | number | Yes | Loan amount |
| `waehrung` | `{waehrung}` | select | Yes | Currency (EUR, USD, CHF, etc.) |
| `zweck` | `{zweck}` | textarea | Yes | Purpose (500 char max) |
| `rueckzahlung` | `{rueckzahlung}` | select | Yes | Repayment terms |
| `datum` | `{datum}` | date | Yes | Date |
| `zinssatz` | `{zinssatz}` | number | No | Interest rate |
| `zinsen` | `{zinsen}` | select | No | Interest type |

## Validation & Visual Feedback

**Glow Effects** (defined in `css/styles.css`):
```css
.text-glow-change   /* Yellow - value changed */
.text-glow-valid    /* Green - validation passed */
.text-glow-invalid  /* Red - validation failed */
```

**Application**:
- Applied to `[data-preview]` spans in preview
- Triggered on input change
- Animation duration: 1s ease-in-out

## Development Notes

### Script Loading Order

**Critical Order** (in `index.html`):
1. Tailwind CSS + DaisyUI CDN
2. Translation files (`de-DE.js`, `en-US.js`)
3. `TranslationController.js`
4. `common.js` (depends on TranslationController)
5. External libraries (jsPDF, html2canvas)

### Event Flow

```
User Input
    ↓
Field Change Event
    ↓
├─→ updatePreview()
│   └─→ Render markdown with field values
│       └─→ Apply glow effects
│
└─→ Save to localStorage

Language Toggle
    ↓
translation.setLocale(newLocale)
    ↓
├─→ Dispatch 'translation:change' event
│   └─→ applyTranslations()
│       └─→ Update all [data-i18n] elements
│       └─→ Update all [data-i18n-attr] elements
│   └─→ updatePreview()
│       └─→ Re-render with new template
│
└─→ Save to localStorage
```

### localStorage Keys

- `language`: Current locale (`de-DE` or `en-US`)
- `theme`: Current DaisyUI theme
- `formData`: Serialized form field values

## Testing Checklist

- [ ] Language toggle updates all UI text
- [ ] Language toggle updates preview template
- [ ] Theme selection persists across reload
- [ ] Language selection persists across reload
- [ ] Form validation shows correct glow effects
- [ ] PDF generation includes all form data
- [ ] PDF filename includes correct date/time
- [ ] All required fields validate correctly
- [ ] Character counter updates on purpose field
- [ ] Mobile hamburger menu works
- [ ] Print styles hide UI elements
- [ ] All 6 themes render correctly

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required Features**: ES6, localStorage, Custom Events, CSS Grid
- **PDF Generation**: Requires canvas support

## Known Issues

None currently documented.

## Future Enhancements

- [ ] Additional currency options
- [ ] Custom repayment schedule builder
- [ ] Email functionality
- [ ] Digital signature support
- [ ] Multi-page document support
- [ ] Export to other formats (DOCX, ODT)

## Credits

- **DaisyUI**: Component library by Pouya Saadeghi
- **Tailwind CSS**: Utility-first CSS framework
- **jsPDF**: PDF generation library
- **html2canvas**: HTML to canvas rendering

## License

[Add license information]

## Contact

[Add contact information]

---

**Last Updated**: 2025-10-11
**Version**: 2.0.0 (DaisyUI Migration)
**Maintained by**: [Your Name/Team]
