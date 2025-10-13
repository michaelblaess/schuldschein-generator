// ===================================
// Schuldschein-Generator - Common.js
// ===================================

// Übersetzungen werden aus separaten JS-Dateien geladen (window.TRANSLATIONS)
// Sprache wird ausschließlich über window.translation (TranslationController) verwaltet
// Theme wird über DaisyUI data-theme verwaltet

// Übersetzungen anwenden
// Thin Wrapper um TranslationController.apply() mit ID-spezifischen Fallbacks
function applyTranslations() {
    // Hole Übersetzungen für aktuelles Locale
    const locale = window.translation.getLocale();
    const trans = window.TRANSLATIONS[locale];

    // Robuster Fallback bei fehlenden Übersetzungen
    if (!trans) {
        console.warn('Translations not found for locale:', locale);
        return;
    }

    // Controller apply() aufrufen (data-i18n, data-i18n-attr)
    window.translation.apply(document);

    // ID-spezifische Updates (Legacy-Support für Elemente ohne data-i18n)
    const updateElement = (id, key, isHTML = false) => {
        const el = document.getElementById(id);
        if (el && trans[key] !== undefined) {
            if (isHTML) {
                el.innerHTML = trans[key];
            } else {
                el.textContent = trans[key];
            }
        }
    };

    // Header und Footer
    updateElement('header-title', 'header-title');
    updateElement('header-subtitle', 'header-subtitle');
    // Use text-only key to avoid duplicating the label rendered in markup
    updateElement('privacy-notice', 'privacy-notice-text');
    updateElement('footer-copyright', 'footer-copyright');
    updateElement('footer-disclaimer', 'footer-disclaimer');

    // Labels
    updateElement('label-lender', 'label-lender');
    updateElement('label-borrower', 'label-borrower');
    updateElement('label-loan-details', 'label-loan-details');
    updateElement('label-witness', 'label-witness');

    // Alle Text-Spans mit IDs (Legacy-Support)
    const textIds = [
        'text-name-lender', 'text-address-lender', 'text-birthdate-lender', 'text-id-lender', 'text-iban-lender',
        'text-name-borrower', 'text-address-borrower', 'text-birthdate-borrower', 'text-id-borrower',
        'text-name-witness', 'text-address-witness', 'text-birthdate-witness', 'text-id-witness',
        'text-loan-amount', 'text-interest-rate', 'text-interest-default',
        'text-default-interest', 'text-default-interest-note',
        'text-duration', 'text-contract-date', 'text-due-date',
        'text-repayment-type', 'text-repayment-rhythm', 'text-payout-type',
        'text-borrower-iban', 'text-purpose', 'text-jurisdiction',
        'text-reset', 'text-download-pdf'
    ];

    textIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const baseKey = id.replace(/-lender|-borrower|-witness/g, '');
            const translationKey = trans[baseKey] || trans[id];
            if (translationKey !== undefined) {
                el.textContent = translationKey;
            }
        }
    });

    // Options
    updateElement('opt-lumpsum', 'opt-lumpsum');
    updateElement('opt-installments', 'opt-installments');
    updateElement('opt-monthly', 'opt-monthly');
    updateElement('opt-quarterly', 'opt-quarterly');
    updateElement('opt-cash', 'opt-cash');
    updateElement('opt-transfer', 'opt-transfer');
    updateElement('opt-paypal', 'opt-paypal');
    updateElement('opt-other', 'opt-other');

    // Placeholder
    const zweckInput = document.getElementById('zweck');
    if (zweckInput && trans['placeholder-purpose'] !== undefined) {
        zweckInput.placeholder = trans['placeholder-purpose'];
    }
}

// =============================
// Form Autosave (localStorage)
// =============================
function collectFormData() {
    const data = {};
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id) {
            data[el.id] = el.value;
        }
    });
    return data;
}

function saveFormData() {
    try {
        const data = collectFormData();
        localStorage.setItem('formData', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save form data:', e);
    }
}

function loadFormData() {
    try {
        const raw = localStorage.getItem('formData');
        if (!raw) return false;
        const data = JSON.parse(raw);
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
        // dynamische Container synchronisieren
        const rz = document.getElementById('rueckzahlungsart');
        if (rz) {
            document.getElementById('rhythmus_container').style.display =
                rz.value === 'raten' ? 'block' : 'none';
        }
        const az = document.getElementById('auszahlungsart');
        if (az) {
            document.getElementById('nehmer_iban_container').style.display =
                az.value === 'ueberweisung' ? 'block' : 'none';
        }
        updatePreview();
        return true;
    } catch (e) {
        console.warn('Could not load form data:', e);
        return false;
    }
}

// Betragsformatierung
function formatCurrencyInput(input) {
    let value = input.value.replace(/[^\d]/g, '');
    if (value === '') {
        input.value = '';
        return;
    }

    let num = parseInt(value);
    let formatted = (num / 100).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    input.value = formatted;
}

// IBAN Validierung (delegiert an ValidationController)
function validateIBAN(input) {
    if (window.validation && typeof window.validation.validateIBAN === 'function') {
        return window.validation.validateIBAN(input);
    }
}

// Glow-Effekt nur für spezifisches Feld
function addGlowToSpecificField(fieldName) {
    const elements = document.querySelectorAll(`[data-preview="${fieldName}"]`);
    elements.forEach(el => {
        el.classList.remove('text-glow-change');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('text-glow-change');

        setTimeout(() => {
            el.classList.remove('text-glow-change');
        }, 1000);
    });
}

// Berechnung des Fälligkeitsdatums
function berechneFaelligkeitsdatum(startDatum, monate) {
    const datum = new Date(startDatum);
    datum.setMonth(datum.getMonth() + parseInt(monate));
    return datum;
}

// Formatierung Datum deutsch
function formatiereDatum(datum) {
    if (!datum) return '';
    const d = typeof datum === 'string' ? new Date(datum) : datum;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Betrag in Worten
function betragInWorten(betrag) {
    const einer = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
    const zehn = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
    const zehner = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
    const hunderter = ['', 'einhundert', 'zweihundert', 'dreihundert', 'vierhundert', 'fünfhundert', 'sechshundert', 'siebenhundert', 'achthundert', 'neunhundert'];

    // Betrag von deutschem Format parsen
    const cleanBetrag = betrag.replace(/\./g, '').replace(',', '.');
    const num = Math.floor(parseFloat(cleanBetrag));

    if (num === 0 || isNaN(num)) return 'null';

    let result = '';

    // Millionen
    if (num >= 1000000) {
        const mio = Math.floor(num / 1000000);
        result += convertHundreds(mio) + ' Million' + (mio > 1 ? 'en' : '') + ' ';
    }

    // Tausender
    const rest = num % 1000000;
    if (rest >= 1000) {
        const tsd = Math.floor(rest / 1000);
        if (tsd === 1) {
            result += 'eintausend';
        } else {
            result += convertHundreds(tsd) + 'tausend';
        }
    }

    // Hunderter
    const h = num % 1000;
    if (h > 0) {
        result += convertHundreds(h);
    }

    return result.trim() + ' Euro';

    function convertHundreds(n) {
        let str = '';
        const h = Math.floor(n / 100);
        const rest = n % 100;

        if (h > 0) str += hunderter[h];

        if (rest >= 10 && rest < 20) {
            str += zehn[rest - 10];
        } else {
            const z = Math.floor(rest / 10);
            const e = rest % 10;
            if (e > 0) {
                str += einer[e];
                if (z > 0) str += 'und';
            }
            if (z > 0) str += zehner[z];
        }

        return str;
    }
}

// IBAN formatieren
function formatiereIBAN(iban) {
    if (!iban) return '[IBAN]';
    return iban.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || iban;
}

// Vorschau aktualisieren
function updatePreview() {
    const data = {
        geber_name: document.getElementById('geber_name').value,
        geber_adresse: document.getElementById('geber_adresse').value,
        geber_geburt: document.getElementById('geber_geburt').value,
        geber_ausweis: document.getElementById('geber_ausweis').value,
        geber_iban: document.getElementById('geber_iban').value,
        nehmer_name: document.getElementById('nehmer_name').value,
        nehmer_adresse: document.getElementById('nehmer_adresse').value,
        nehmer_geburt: document.getElementById('nehmer_geburt').value,
        nehmer_ausweis: document.getElementById('nehmer_ausweis').value,
        nehmer_iban: document.getElementById('nehmer_iban').value,
        summe: document.getElementById('summe').value,
        zinssatz: document.getElementById('zinssatz').value,
        verzugszins: document.getElementById('verzugszins').value,
        laufzeit: document.getElementById('laufzeit').value,
        vertragsdatum: document.getElementById('vertragsdatum').value,
        rueckzahlungsart: document.getElementById('rueckzahlungsart').value,
        rhythmus: document.getElementById('rhythmus').value,
        auszahlungsart: document.getElementById('auszahlungsart').value,
        zweck: document.getElementById('zweck').value,
        gerichtsstand: document.getElementById('gerichtsstand').value,
        zeuge_name: document.getElementById('zeuge_name').value,
        zeuge_adresse: document.getElementById('zeuge_adresse').value,
        zeuge_geburt: document.getElementById('zeuge_geburt').value,
        zeuge_ausweis: document.getElementById('zeuge_ausweis').value
    };

    // Fälligkeitsdatum berechnen
    if (data.vertragsdatum && data.laufzeit) {
        const faellig = berechneFaelligkeitsdatum(data.vertragsdatum, data.laufzeit);
        document.getElementById('faelligkeitsdatum').value = formatiereDatum(faellig);
        data.faelligkeitsdatum = formatiereDatum(faellig);
    }

    const preview = document.getElementById('preview');
    preview.innerHTML = generiereVertragstext(data);
}

// Vertragstext generieren
function generiereVertragstext(d) {
    const locale = window.translation.getLocale();
    const trans = window.TRANSLATIONS[locale];
    const summeWorten = betragInWorten(d.summe);
    const hatZeuge = d.zeuge_name && d.zeuge_name.trim() !== '';

    // Auszahlungstext je nach Art
    let auszahlungsText = '';
    if (d.auszahlungsart === 'bar') {
        auszahlungsText = trans['text-in-cash'];
    } else if (d.auszahlungsart === 'ueberweisung') {
        auszahlungsText = trans['text-by-transfer'] + (d.nehmer_iban ? ' ' + trans['text-to-account'] + ' <span data-preview="nehmer_iban">' + formatiereIBAN(d.nehmer_iban) + '</span>' : '');
    } else if (d.auszahlungsart === 'paypal') {
        auszahlungsText = trans['text-by-paypal'];
    } else if (d.auszahlungsart === 'sonstiges') {
        auszahlungsText = trans['text-by-other'];
    }

    return `
        <div class="space-y-4">
            <h1 class="text-2xl font-bold text-center mb-6">${trans['contract-title']}</h1>

            <div class="mb-4">
                <p><strong>${trans['contract-lender']}</strong></p>
                <p data-preview="geber_name">${d.geber_name || '[Name]'}</p>
                <p data-preview="geber_adresse" style="white-space: pre-line;">${d.geber_adresse || '[' + trans['text-address'] + ']'}</p>
                <p>${trans['contract-birthdate']} <span data-preview="geber_geburt">${formatiereDatum(d.geber_geburt) || '[Datum]'}</span></p>
                <p>${trans['contract-id']} <span data-preview="geber_ausweis">${d.geber_ausweis || '[Nummer]'}</span></p>
            </div>

            <div class="mb-4">
                <p><strong>${trans['contract-borrower']}</strong></p>
                <p data-preview="nehmer_name">${d.nehmer_name || '[Name]'}</p>
                <p data-preview="nehmer_adresse" style="white-space: pre-line;">${d.nehmer_adresse || '[' + trans['text-address'] + ']'}</p>
                <p>${trans['contract-birthdate']} <span data-preview="nehmer_geburt">${formatiereDatum(d.nehmer_geburt) || '[Datum]'}</span></p>
                <p>${trans['contract-id']} <span data-preview="nehmer_ausweis">${d.nehmer_ausweis || '[Nummer]'}</span></p>
            </div>

            <div class="my-6 border-t-2 border-gray-300"></div>

            <h2 class="font-bold mt-6 mb-2">§ 1 ${trans['section-loan-amount']}</h2>
            <p>${trans['text-loan-granted']} <strong data-preview="summe">${d.summe || '0,00'} EUR</strong> (${trans['text-in-words']} <em data-preview="summe">${summeWorten}</em>).</p>

            ${d.zweck ? `
            <h2 class="font-bold mt-4 mb-2">§ 2 ${trans['section-purpose']}</h2>
            <p>${trans['text-purpose-granted']} <span data-preview="zweck">${d.zweck}</span></p>
            ` : ''}

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '3' : '2'} ${trans['section-disbursement']}</h2>
            <p>${trans['text-disbursement-made']} ${auszahlungsText}.</p>

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '4' : '3'} ${trans['section-repayment']}</h2>
            <p>${trans['text-repayment-made']} ${d.rueckzahlungsart === 'einmal' ? trans['text-lump-sum'] + ' <strong data-preview="faelligkeitsdatum">' + (d.faelligkeitsdatum || '[Datum]') + '</strong>' : trans['text-in-installments'] + ' <span data-preview="rhythmus">' + d.rhythmus + '</span>'}.</p>
            <p>${trans['text-repayment-to']}</p>
            <p>IBAN: <strong data-preview="geber_iban">${formatiereIBAN(d.geber_iban)}</strong></p>
            <p>${trans['text-account-holder']} <span data-preview="geber_name">${d.geber_name || '[Name]'}</span></p>

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '5' : '4'} ${trans['section-interest']}</h2>
            <p>${trans['text-loan-interest']} ${parseFloat(d.zinssatz) > 0 ? trans['text-with-interest'] + ' <strong data-preview="zinssatz">' + d.zinssatz + ' % p.a.</strong>' : trans['text-interest-free']}.</p>
            <p>${trans['text-default-interest-text']} <strong data-preview="verzugszins">${d.verzugszins || '5'} ${trans['text-percentage-points']}</strong> ${trans['text-charged']}.</p>

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '6' : '5'} ${trans['section-written-form']}</h2>
            <p>${trans['text-written-form-text']}</p>

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '7' : '6'} ${trans['section-jurisdiction']}</h2>
            <p>${trans['text-jurisdiction-text']} <strong data-preview="gerichtsstand">${d.gerichtsstand || '[Ort]'}</strong>.</p>

            <h2 class="font-bold mt-4 mb-2">§ ${d.zweck ? '8' : '7'} ${trans['section-severability']}</h2>
            <p>${trans['text-severability-text']}</p>

            <div class="my-6 border-t-2 border-gray-300"></div>

            <div class="mt-8">
                <p><strong><span data-preview="gerichtsstand">${d.gerichtsstand || '[Ort]'}</span>, <span data-preview="vertragsdatum">${formatiereDatum(d.vertragsdatum) || '[Datum]'}</span></strong></p>
            </div>

            <div class="ssg-signatures">
                <div class="ssg-signature">
                    <p><span class="ssg-signature-line"></span></p>
                    <p class="text-sm" data-preview="geber_name">${d.geber_name || '[' + trans['contract-lender'].replace(':', '') + ']'}</p>
                    <p class="text-xs text-gray-600">(${trans['contract-lender'].replace(':', '')})</p>
                </div>
                <div class="ssg-signature">
                    <p><span class="ssg-signature-line"></span></p>
                    <p class="text-sm" data-preview="nehmer_name">${d.nehmer_name || '[' + trans['contract-borrower'].replace(':', '') + ']'}</p>
                    <p class="text-xs text-gray-600">(${trans['contract-borrower'].replace(':', '')})</p>
                </div>
            </div>

            ${hatZeuge ? `
            <div class="my-6 border-t-2 border-gray-300"></div>
            <h2 class="font-bold mt-6 mb-2">${trans['witness-confirmation']}</h2>
            <p>${trans['witness-text']}</p>
            <div class="mt-6">
                <p><strong>${trans['witness-label']}</strong></p>
                <p data-preview="zeuge_name">${d.zeuge_name}</p>
                <p data-preview="zeuge_adresse" style="white-space: pre-line;">${d.zeuge_adresse}</p>
                <p>${trans['contract-birthdate']} <span data-preview="zeuge_geburt">${formatiereDatum(d.zeuge_geburt)}</span></p>
                <p>${trans['contract-id']} <span data-preview="zeuge_ausweis">${d.zeuge_ausweis}</span></p>
            </div>
            <div class="mt-8">
                <p class="mb-12">_______________________________</p>
                <p class="text-sm" data-preview="zeuge_name">${d.zeuge_name}</p>
                <p class="text-xs text-gray-600">(${trans['witness-label'].replace(':', '')})</p>
            </div>
            ` : ''}

            <div class="my-6 border-t-2 border-gray-300"></div>

            <div class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-xs">
                <p class="font-bold mb-1">⚠️ ${trans['legal-notice-title']}</p>
                <p>${trans['legal-notice-text']}</p>
            </div>
        </div>
    `;
}

// Formular zurücksetzen
function resetForm() {
    const locale = window.translation.getLocale();
    const trans = window.TRANSLATIONS[locale];

    if (confirm(trans['confirm-reset'])) {
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'date' && el.id === 'vertragsdatum') {
                el.value = new Date().toISOString().split('T')[0];
            } else if (el.id === 'summe') {
                el.value = '1.000,00';
            } else if (el.id === 'zinssatz') {
                el.value = '0';
            } else if (el.id === 'verzugszins') {
                el.value = '5';
            } else if (el.id === 'laufzeit') {
                el.value = '6';
            } else if (el.id === 'rueckzahlungsart') {
                el.value = 'einmal';
            } else if (el.id === 'rhythmus') {
                el.value = 'monatlich';
            } else if (el.id === 'auszahlungsart') {
                el.value = 'bar';
            } else {
                el.value = '';
            }
        });
        updatePreview();
        try { localStorage.removeItem('formData'); } catch (e) {}
    }
}

// Kopiert den Vorschau-Text in die Zwischenablage (Plaintext)
function copyPreviewText() {
    try {
        const el = document.getElementById('preview');
        const text = (el && el.innerText) ? el.innerText.trim() : '';
        if (!text) { alert('Kein Text zum Kopieren gefunden.'); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                // optional: kleines Feedback
            }).catch(() => {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text; document.body.appendChild(ta); ta.select();
                document.execCommand('copy'); document.body.removeChild(ta);
            });
        } else {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
        }
    } catch (e) {
        console.warn('Copy failed:', e);
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // DaisyUI Theme Toggle (light/dracula)
    // ===================================
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    // Restore theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.checked = (savedTheme === 'dracula');

        // Toggle event
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dracula' : 'light';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===================================
    // Translation Controller initialisieren
    // ===================================
    window.translation = new TranslationController();
    window.translation.init();

    // ===================================
    // DaisyUI Language Toggle Setup
    // ===================================
    const languageToggle = document.getElementById('languageToggle');
    const languageCheckbox = languageToggle.querySelector('input[type="checkbox"]');
    const currentLocale = window.translation.getLocale();

    // Initial state
    languageCheckbox.checked = (currentLocale === 'en-US');

    // Change event
    languageCheckbox.addEventListener('change', () => {
        const newLocale = languageCheckbox.checked ? 'en-US' : 'de-DE';
        window.translation.setLocale(newLocale);

        // Vorschau aktualisieren
        updatePreview();

        // Glow-Effekt auf allen Feldern
        setTimeout(() => {
            document.querySelectorAll('[data-preview]').forEach(el => {
                el.classList.add('text-glow-change');
            });
            setTimeout(() => {
                document.querySelectorAll('[data-preview]').forEach(el => {
                    el.classList.remove('text-glow-change');
                });
            }, 1000);
        }, 100);
    });

    // ===================================
    // Event-Listener für Sprachwechsel (extern getriggert)
    // ===================================
    window.addEventListener('translation:change', () => {
        const locale = window.translation.getLocale();

        // Checkbox synchronisieren
        languageCheckbox.checked = (locale === 'en-US');

        // Formular-Übersetzungen anwenden (Labels, Placeholder, etc.)
        applyTranslations();

        // Vorschau aktualisieren (da sich Übersetzungen geändert haben)
        updatePreview();
    });

    // ===================================
    // Übersetzungen anwenden
    // ===================================
    applyTranslations();

    // ===================================
    // Heutiges Datum als Standard
    // ===================================
    const heute = new Date().toISOString().split('T')[0];
    document.getElementById('vertragsdatum').value = heute;

    // ===================================
    // Autosave: Wiederherstellen
    // ===================================
    loadFormData();

    // ===================================
    // Event Listener für Formularfelder
    // ===================================
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', function() {
            const field = this.getAttribute('data-field');

            if (field === 'summe') {
                formatCurrencyInput(this);
            }

            // Abhängige Felder behandeln
            if (field === 'laufzeit' || field === 'vertragsdatum') {
                updatePreview();
                setTimeout(() => {
                    if (field === 'laufzeit') {
                        addGlowToSpecificField('laufzeit');
                        addGlowToSpecificField('faelligkeitsdatum');
                    } else if (field === 'vertragsdatum') {
                        addGlowToSpecificField('vertragsdatum');
                        addGlowToSpecificField('faelligkeitsdatum');
                    }
                }, 50);
            } else if (field) {
                updatePreview();
                setTimeout(() => {
                    addGlowToSpecificField(field);
                }, 50);
            } else {
                updatePreview();
            }
            // Autosave
            saveFormData();
        });
    });

    // ===================================
    // IBAN Validierung
    // ===================================
    document.getElementById('geber_iban').addEventListener('input', function() {
        validateIBAN(this);
    });

    document.getElementById('nehmer_iban').addEventListener('input', function() {
        validateIBAN(this);
    });

    // ===================================
    // Dynamische Container Ein-/Ausblenden
    // ===================================
    document.getElementById('rueckzahlungsart').addEventListener('change', function() {
        document.getElementById('rhythmus_container').style.display =
            this.value === 'raten' ? 'block' : 'none';
    });

    document.getElementById('auszahlungsart').addEventListener('change', function() {
        const needIban = this.value === 'ueberweisung';
        const cont = document.getElementById('nehmer_iban_container');
        const inp = document.getElementById('nehmer_iban');
        cont.style.display = needIban ? 'block' : 'none';
        if (inp) {
            inp.required = !!needIban;
            if (!needIban) inp.setCustomValidity('');
            validateIBAN(inp);
        }
    });

    // ===================================
    // Initiale Vorschau
    // ===================================
    // Ensure required state for borrower IBAN on load
    (function(){
        const aa = document.getElementById('auszahlungsart');
        const needIban = aa && aa.value === 'ueberweisung';
        const inp = document.getElementById('nehmer_iban');
        if (inp) { inp.required = !!needIban; }
    })();
    updatePreview();

    // ===================================
    // Alle Felder beim ersten Laden aufleuchten lassen
    // ===================================
    setTimeout(() => {
        document.querySelectorAll('[data-preview]').forEach(el => {
            el.classList.add('text-glow-change');
        });
        setTimeout(() => {
            document.querySelectorAll('[data-preview]').forEach(el => {
                el.classList.remove('text-glow-change');
            });
        }, 1000);
    }, 500);
});
