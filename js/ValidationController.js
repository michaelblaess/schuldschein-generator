// ===================================
// Schuldschein-Generator - ValidationController.js
// Zentrale Validierungen (UI-Feedback inklusive)
// ===================================

(function () {
  'use strict';

  class ValidationController {
    // IBAN: Basic syntax + length; sets HTML5 validity message (used by DaisyUI validator)
    validateIBAN(input) {
      if (!input) return false;
      const iban = (input.value || '').replace(/\s/g, '');
      if (iban.length === 0) { input.setCustomValidity(''); return false; }
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
      const isValid = ibanRegex.test(iban) && iban.length >= 15 && iban.length <= 34;
      // DaisyUI validator uses HTML5 validity; set message if invalid and field is required or non-empty
      if (!isValid && (input.required || iban.length > 0)) {
        input.setCustomValidity('IBAN ungültig');
      } else {
        input.setCustomValidity('');
      }
      return isValid;
    }
  }

  window.ValidationController = ValidationController;
  window.validation = window.validation || new ValidationController();
})();
