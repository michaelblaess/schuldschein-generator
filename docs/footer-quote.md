<!--
  SPDX-License-Identifier: Apache-2.0
  Copyright (c) 2025 Michael Blaess
-->

# Footer-Quote

**Deutsch (gewählt):**  
„Dunkelheit kann Dunkelheit nicht vertreiben; nur Licht kann das. Hass kann Hass nicht vertreiben; nur Liebe kann das.“ — **Martin Luther King Jr.**

**English (original):**  
“Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.” — **Martin Luther King Jr.**

---

## HTML Snippet (Footer)

```html
<footer class="mt-12 text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
  <p>
    „Dunkelheit kann Dunkelheit nicht vertreiben; nur Licht kann das.
    Hass kann Hass nicht vertreiben; nur Liebe kann das.“
    — <span class="font-medium">Martin Luther King Jr.</span>
  </p>
</footer>
```

## (Optional) i18n Keys

**translations/de-de.js**
```js
window.TRANSLATIONS = window.TRANSLATIONS || {};
window.TRANSLATIONS['de-DE'] = {
  // ...
  "footer-quote": "„Dunkelheit kann Dunkelheit nicht vertreiben; nur Licht kann das. Hass kann Hass nicht vertreiben; nur Liebe kann das.“ — Martin Luther King Jr."
};
```

**translations/en-us.js**
```js
window.TRANSLATIONS = window.TRANSLATIONS || {};
window.TRANSLATIONS['en-US'] = {
  // ...
  "footer-quote": "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that. — Martin Luther King Jr."
};
```

**index.html (Footer)**
```html
<footer class="mt-12 text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
  <p data-i18n="footer-quote"></p>
</footer>
```
