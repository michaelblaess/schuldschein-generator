// Copied from js/TranslationController.js to be served by Astro
// ===================================
// Translation Controller
// Zentrale Verwaltung für Internationalisierung
// ===================================

class TranslationController {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'language';
        this.defaultLocale = options.defaultLocale || 'de-DE';
        this.translations = options.translations || window.TRANSLATIONS;
        this.attrSelector = options.attrSelector || '[data-i18n-attr]';
        this.textSelector = options.textSelector || '[data-i18n]';
        this.locale = null;
    }

    init() {
        let savedLocale = localStorage.getItem(this.storageKey);
        if (savedLocale) {
            this.locale = this.normalizeLocale(savedLocale);
        } else {
            let browserLocale = navigator.language || navigator.userLanguage || this.defaultLocale;
            this.locale = this.normalizeLocale(browserLocale);
        }
        if (!this.translations[this.locale]) {
            console.warn(`Locale ${this.locale} not available, falling back to ${this.defaultLocale}`);
            this.locale = this.defaultLocale;
        }
        document.documentElement.lang = this.locale;
        this.apply();
        return this.locale;
    }

    getLocale() {
        if (!this.locale) {
            this.init();
        }
        return this.locale;
    }

    setLocale(newLocale) {
        newLocale = this.normalizeLocale(newLocale);
        if (!this.translations[newLocale]) {
            console.error('Locale not available:', newLocale);
            return false;
        }
        this.locale = newLocale;
        localStorage.setItem(this.storageKey, newLocale);
        document.documentElement.lang = newLocale;
        window.dispatchEvent(new CustomEvent('translation:change', { detail: { locale: newLocale } }));
        window.dispatchEvent(new CustomEvent('i18n:change', { detail: { locale: newLocale } }));
        this.apply();
        return true;
    }

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

    apply(container = document) {
        this.applyText(container);
        this.applyAttrs(container);
    }

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

    applyAttrs(container = document) {
        const trans = this.translations[this.locale];
        if (!trans) return;
        const elements = container.querySelectorAll(this.attrSelector);
        elements.forEach(el => {
            const attrConfig = el.getAttribute('data-i18n-attr');
            if (!attrConfig) return;
            const pairs = attrConfig.split(';').map(p => p.trim()).filter(p => p);
            pairs.forEach(pair => {
                const [attrName, translationKey] = pair.split(':').map(s => s.trim());
                if (attrName && translationKey && trans[translationKey] !== undefined) {
                    el.setAttribute(attrName, trans[translationKey]);
                }
            });
        });
    }

    normalizeLocale(locale) {
        if (!locale) return this.defaultLocale;
        if (locale.includes('-')) {
            const parts = locale.split('-');
            return parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
        }
        const lang = locale.toLowerCase();
        if (lang === 'de') return 'de-DE';
        if (lang === 'en') return 'en-US';
        return this.defaultLocale;
    }

    getAvailableLocales() {
        return Object.keys(this.translations || {});
    }
}

window.TranslationController = TranslationController;

