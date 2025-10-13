// Public copy of ValidationController (kept in sync with js/ValidationController.js)
(function () {
  'use strict';

  class ValidationController {
    // IBAN validity for DaisyUI validator (HTML5 constraint validation)
    validateIBAN(input) {
      if (!input) return false;
      const iban = (input.value || '').replace(/\s/g, '');
      if (iban.length === 0) { input.setCustomValidity(''); return false; }
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
      const isValid = ibanRegex.test(iban) && iban.length >= 15 && iban.length <= 34;
      if (!isValid && (input.required || iban.length > 0)) { input.setCustomValidity('Invalid IBAN'); } else { input.setCustomValidity(''); }
      return isValid;
    }
  }

  window.ValidationController = ValidationController;
  window.validation = window.validation || new ValidationController();
})();
