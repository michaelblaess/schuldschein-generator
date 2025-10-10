// ===================================
// Translation Controller
// Zentrale Verwaltung für Internationalisierung
// ===================================

class TranslationController {
    /**
     * Erstellt einen neuen TranslationController
     * @param {Object} options - Konfigurationsoptionen
     * @param {string} options.storageKey - localStorage Key für Sprache
     * @param {string} options.defaultLocale - Standard-Locale
     * @param {Object} options.translations - Übersetzungen (window.TRANSLATIONS)
     * @param {string} options.attrSelector - Selector für Attribut-Übersetzungen
     * @param {string} options.textSelector - Selector für Text-Übersetzungen
     */
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'language';
        this.defaultLocale = options.defaultLocale || 'de-DE';
        this.translations = options.translations || window.TRANSLATIONS;
        this.attrSelector = options.attrSelector || '[data-i18n-attr]';
        this.textSelector = options.textSelector || '[data-i18n]';
        this.locale = null;
    }

    /**
     * Initialisiert den Controller
     * - Lädt Sprache aus localStorage oder navigator.language
     * - Normalisiert das Locale
     * - Validiert gegen verfügbare Übersetzungen
     * - Setzt document.documentElement.lang
     * - Wendet Übersetzungen an
     * @returns {string} Das initialisierte Locale
     */
    init() {
        // Locale aus localStorage oder navigator.language ermitteln
        let savedLocale = localStorage.getItem(this.storageKey);

        if (savedLocale) {
            // Gespeichertes Locale verwenden
            this.locale = this.normalizeLocale(savedLocale);
        } else {
            // Browser-Locale als Fallback
            let browserLocale = navigator.language || navigator.userLanguage || this.defaultLocale;
            this.locale = this.normalizeLocale(browserLocale);
        }

        // Fallback auf defaultLocale wenn Locale nicht verfügbar
        if (!this.translations[this.locale]) {
            console.warn(`Locale ${this.locale} not available, falling back to ${this.defaultLocale}`);
            this.locale = this.defaultLocale;
        }

        // document.lang setzen
        document.documentElement.lang = this.locale;

        // Übersetzungen anwenden
        this.apply();

        return this.locale;
    }

    /**
     * Gibt das aktuelle Locale zurück
     * @returns {string} Das aktuelle Locale
     */
    getLocale() {
        if (!this.locale) {
            this.init();
        }
        return this.locale;
    }

    /**
     * Setzt ein neues Locale
     * - Normalisiert und validiert das Locale
     * - Speichert in localStorage
     * - Aktualisiert document.lang
     * - Dispatcht Custom Events (translation:change, i18n:change)
     * - Wendet Übersetzungen an
     * @param {string} newLocale - Das neue Locale
     * @returns {boolean} true bei Erfolg, false bei Fehler
     */
    setLocale(newLocale) {
        newLocale = this.normalizeLocale(newLocale);

        if (!this.translations[newLocale]) {
            console.error('Locale not available:', newLocale);
            return false;
        }

        this.locale = newLocale;

        // In localStorage speichern
        localStorage.setItem(this.storageKey, newLocale);

        // document.lang aktualisieren
        document.documentElement.lang = newLocale;

        // Custom Events dispatchen
        // Neues Event
        window.dispatchEvent(new CustomEvent('translation:change', {
            detail: { locale: newLocale }
        }));

        // Kompatibilität: altes Event für bestehenden Code
        window.dispatchEvent(new CustomEvent('i18n:change', {
            detail: { locale: newLocale }
        }));

        // Übersetzungen anwenden
        this.apply();

        return true;
    }

    /**
     * Gibt die Übersetzung für einen Key zurück
     * @param {string} key - Der Übersetzungs-Key
     * @returns {string} Die Übersetzung oder [key] als Fallback
     */
    t(key) {
        if (!this.locale) {
            this.init();
        }

        const trans = this.translations[this.locale];

        if (!trans) {
            console.warn('Translations not found for locale:', this.locale);
            return `[${key}]`;
        }

        const value = trans[key];

        if (value === undefined) {
            console.warn('Translation not found for key:', key, 'in locale:', this.locale);
            return `[${key}]`;
        }

        return value;
    }

    /**
     * Wendet alle Übersetzungen an (Text + Attribute)
     * @param {HTMLElement} container - Container-Element (default: document)
     */
    apply(container = document) {
        this.applyText(container);
        this.applyAttrs(container);
    }

    /**
     * Wendet Text-Übersetzungen an (für Elemente mit data-i18n)
     * @param {HTMLElement} container - Container-Element
     */
    applyText(container = document) {
        const trans = this.translations[this.locale];
        if (!trans) return;

        const elements = container.querySelectorAll(this.textSelector);
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && trans[key] !== undefined) {
                el.textContent = trans[key];
            }
        });
    }

    /**
     * Wendet Attribut-Übersetzungen an (für Elemente mit data-i18n-attr)
     * Format: data-i18n-attr="placeholder:placeholder-purpose;title:tooltip-help"
     * @param {HTMLElement} container - Container-Element
     */
    applyAttrs(container = document) {
        const trans = this.translations[this.locale];
        if (!trans) return;

        const elements = container.querySelectorAll(this.attrSelector);
        elements.forEach(el => {
            const attrConfig = el.getAttribute('data-i18n-attr');
            if (!attrConfig) return;

            // Parse Format: "placeholder:key1;title:key2;aria-label:key3"
            const pairs = attrConfig.split(';').map(p => p.trim()).filter(p => p);

            pairs.forEach(pair => {
                const [attrName, translationKey] = pair.split(':').map(s => s.trim());

                if (attrName && translationKey && trans[translationKey] !== undefined) {
                    el.setAttribute(attrName, trans[translationKey]);
                }
            });
        });
    }

    /**
     * Normalisiert ein Locale
     * - de -> de-DE
     * - en -> en-US
     * - de-de -> de-DE
     * - en-us -> en-US
     * @param {string} locale - Das zu normalisierende Locale
     * @returns {string} Das normalisierte Locale
     */
    normalizeLocale(locale) {
        if (!locale) return this.defaultLocale;

        // Bereits normalisiert (enthält -)
        if (locale.includes('-')) {
            // Zu korrektem Format konvertieren (de-de -> de-DE)
            const parts = locale.split('-');
            return parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
        }

        // Nur Sprache angegeben, Region hinzufügen
        const lang = locale.toLowerCase();
        if (lang === 'de') return 'de-DE';
        if (lang === 'en') return 'en-US';

        // Fallback
        return this.defaultLocale;
    }

    /**
     * Gibt alle verfügbaren Locales zurück
     * @returns {string[]} Array mit verfügbaren Locales
     */
    getAvailableLocales() {
        return Object.keys(this.translations || {});
    }
}

// Globale Verfügbarkeit sicherstellen
window.TranslationController = TranslationController;
