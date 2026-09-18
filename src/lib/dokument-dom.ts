import type { Baustein } from './vertrag';

/**
 * Baut das Blatt im Browser. Nur textContent und createElement, nie innerHTML:
 * Namen und Anschriften kommen aus Eingaben und duerfen nicht als HTML gelesen werden.
 */
export function zeichneDokument(ziel: HTMLElement, bausteine: Baustein[]): void {
  const neu = document.createDocumentFragment();
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, klasse?: string): HTMLElementTagNameMap[K] => {
    const e = document.createElement(tag);
    if (text !== undefined) {
      e.textContent = text;
    }
    if (klasse) {
      e.className = klasse;
    }
    return e;
  };
  for (const b of bausteine) {
    if (b.art === 'titel') {
      neu.append(el('h3', b.text));
    } else if (b.art === 'unter') {
      neu.append(el('p', b.text, 'unter'));
    } else if (b.art === 'ueberschrift') {
      neu.append(el('h4', b.text));
    } else if (b.art === 'fuss') {
      neu.append(el('p', b.text, 'fuss'));
    } else if (b.art === 'unterschriften') {
      const box = el('div', undefined, 'unterschriften');
      b.felder.forEach((f) => box.append(el('div', f)));
      neu.append(box);
    } else if (b.art === 'tabelle') {
      const tabelle = el('table');
      const kopf = el('tr');
      b.kopf.forEach((k) => {
        const th = el('th', k);
        th.scope = 'col';
        kopf.append(th);
      });
      const thead = el('thead');
      thead.append(kopf);
      const tbody = el('tbody');
      b.zeilen.forEach((z) => {
        const tr = el('tr');
        z.forEach((zelle) => tr.append(el('td', zelle)));
        tbody.append(tr);
      });
      tabelle.append(thead, tbody);
      neu.append(tabelle);
    } else {
      const p = el('p');
      for (const teil of b.teile) {
        if (typeof teil === 'string') {
          p.append(teil);
        } else if (teil.wert) {
          p.append(el('span', teil.wert, 'v'));
        } else {
          p.append(el('span', teil.hinweis, 'v leer'));
        }
      }
      neu.append(p);
    }
  }
  ziel.replaceChildren(neu);
}
