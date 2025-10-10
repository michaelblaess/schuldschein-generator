// ===================================
// i18n Helper
// Internationalisierung und Locale-Management
// ===================================

(function() {
    'use strict';
    
    // i18n-Objekt im globalen Scope bereitstellen
    window.i18n = {
        // Aktuelles Locale
        locale: null,
        
        // Initialisierung
        init: function() {
            // Locale aus localStorage oder navigator.language ermitteln
            let savedLocale = localStorage.getItem('language');
            
            if (savedLocale) {
                // Gespeichertes Locale verwenden
                this.locale = this._normalizeLocale(savedLocale);
            } else {
                // Browser-Locale als Fallback
                let browserLocale = navigator.language || navigator.userLanguage || 'de-DE';
                this.locale = this._normalizeLocale(browserLocale);
            }
            
            // Fallback auf de-DE wenn Locale nicht verfügbar
            if (!window.TRANSLATIONS[this.locale]) {
                this.locale = 'de-DE';
            }
            
            // document.lang setzen
            document.documentElement.lang = this.locale;
            
            return this.locale;
        },
        
        // Locale normalisieren (z.B. 'de' -> 'de-DE', 'en' -> 'en-US')
        _normalizeLocale: function(locale) {
            if (!locale) return 'de-DE';
            
            // Bereits normalisiert
            if (locale.includes('-')) {
                // Zu Uppercase konvertieren (de-de -> de-DE)
                let parts = locale.split('-');
                return parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
            }
            
            // Nur Sprache angegeben, Region hinzufügen
            if (locale.toLowerCase() === 'de') return 'de-DE';
            if (locale.toLowerCase() === 'en') return 'en-US';
            
            return 'de-DE'; // Fallback
        },
        
        // Translation abrufen
        t: function(path) {
            if (!this.locale) {
                this.init();
            }
            
            const translations = window.TRANSLATIONS[this.locale];
            
            if (!translations) {
                console.warn('Translations not found for locale:', this.locale);
                return '[' + path + ']';
            }
            
            const value = translations[path];
            
            if (value === undefined) {
                console.warn('Translation not found for path:', path, 'in locale:', this.locale);
                return '[' + path + ']';
            }
            
            return value;
        },
        
        // Aktuelles Locale abrufen
        getLocale: function() {
            if (!this.locale) {
                this.init();
            }
            return this.locale;
        },

        // Locale ändern
        setLocale: function(newLocale) {
            newLocale = this._normalizeLocale(newLocale);

            if (!window.TRANSLATIONS[newLocale]) {
                console.error('Locale not available:', newLocale);
                return false;
            }

            this.locale = newLocale;

            // In localStorage speichern
            localStorage.setItem('language', newLocale);

            // document.lang aktualisieren
            document.documentElement.lang = newLocale;

            // Custom Event für Locale-Änderung
            const event = new CustomEvent('i18n:change', {
                detail: { locale: newLocale }
            });
            window.dispatchEvent(event);

            return true;
        },

        // Verfügbare Locales abrufen
        getAvailableLocales: function() {
            return Object.keys(window.TRANSLATIONS || {});
        }
    };
    
    // Auto-Initialisierung
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.i18n.init();
        });
    } else {
        window.i18n.init();
    }
})();
