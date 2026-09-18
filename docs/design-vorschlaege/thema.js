// Hell/Dunkel: folgt dem System, bis jemand umschaltet. Die Wahl wird gemerkt.
// Wird im <head> geladen, damit die Seite nicht erst hell aufblitzt.
(function () {
  var root = document.documentElement;
  try {
    var gespeichert = localStorage.getItem('thema');
    if (gespeichert === 'light' || gespeichert === 'dark') {
      root.setAttribute('data-theme', gespeichert);
    }
  } catch (e) {
    // Speicher gesperrt (privates Fenster): dann gilt einfach das System
  }

  function istDunkel() {
    var gesetzt = root.getAttribute('data-theme');
    if (gesetzt) {
      return gesetzt === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function zeige(knopf) {
    var dunkel = istDunkel();
    knopf.setAttribute('aria-pressed', dunkel ? 'true' : 'false');
    knopf.title = dunkel ? 'Helles Design' : 'Dunkles Design';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var knopf = document.querySelector('.thema');
    if (!knopf) {
      return;
    }
    zeige(knopf);
    knopf.addEventListener('click', function () {
      var neu = istDunkel() ? 'light' : 'dark';
      root.setAttribute('data-theme', neu);
      try {
        localStorage.setItem('thema', neu);
      } catch (e) {
        // ohne Speicher gilt die Wahl nur bis zum Neuladen
      }
      zeige(knopf);
    });
    // Aendert sich das System, solange nichts gewaehlt ist, zieht der Knopf mit
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      zeige(knopf);
    });
  });
})();
