// Copied from js/pdf.js with i18n fix
function generatePDF() {
    const geberAusweis = document.getElementById('geber_ausweis').value.trim();
    const nehmerAusweis = document.getElementById('nehmer_ausweis').value.trim();
    if (!geberAusweis || !nehmerAusweis) {
        const locale = (window.translation && window.translation.getLocale && window.translation.getLocale()) || 'de-DE';
        const trans = window.TRANSLATIONS[locale] || window.TRANSLATIONS['de-DE'] || {};
        if (!confirm(trans['warning-id'])) {
            return;
        }
    }
    alert('PDF-Generierung wird in Kürze implementiert...');
}

