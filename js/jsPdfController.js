// ===================================
// Schuldschein-Generator - jsPdfController.js
// PDF-Generierung mit jsPDF (UMD via window.jspdf)
// ===================================

(function () {
  'use strict';

  function sanitizeFilenamePart(s) {
    return (s || '').toString().trim().replace(/\s+/g, '_').replace(/[^\w.-]/g, '').slice(0, 80) || 'Dokument';
  }

  function collectData() {
    const byId = id => (document.getElementById(id) || { value: '' }).value;
    return {
      geber_name: byId('geber_name'),
      geber_ausweis: byId('geber_ausweis'),
      nehmer_name: byId('nehmer_name'),
      nehmer_ausweis: byId('nehmer_ausweis'),
      vertragsdatum: byId('vertragsdatum')
    };
  }

  window.generatePDF = function generatePDF() {
    const data = collectData();

    // Warnung bei fehlenden Personalausweisnummern
    if (!data.geber_ausweis || !data.nehmer_ausweis) {
      const locale = (window.translation && window.translation.getLocale && window.translation.getLocale()) || 'de-DE';
      const trans = (window.TRANSLATIONS && (window.TRANSLATIONS[locale] || window.TRANSLATIONS['de-DE'])) || {};
      const msg = trans['warning-id'] || 'Eine Personalausweisnummer fehlt. Fortfahren?';
      if (!window.confirm(msg)) return;
    }

    // jsPDF prüfen
    const jspdfNS = (window.jspdf || window.jsPDF || {});
    const jsPDF = jspdfNS.jsPDF || jspdfNS.JSPDF || window.jsPDF;
    if (!jsPDF) {
      alert('PDF-Bibliothek (jsPDF) nicht gefunden.');
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 56; // ~20mm
    const contentWidth = pageWidth - 2 * margin;
    let cursorY = margin;

    // Titel
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('SCHULDSCHEIN', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 32;

    // Vorschau-Text holen (Plaintext)
    const preview = document.getElementById('preview');
    const rawText = preview ? (preview.innerText || '').trim() : '';
    const lines = doc.splitTextToSize(rawText || 'Vorschau leer.', contentWidth);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const lineHeight = 18;
    lines.forEach(line => {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    // Dateiname
    const filename = `Schuldschein_${sanitizeFilenamePart(data.nehmer_name)}_${sanitizeFilenamePart(data.vertragsdatum)}.pdf`;
    doc.save(filename);
  };
})();

