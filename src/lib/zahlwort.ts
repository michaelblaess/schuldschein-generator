import type { Sprache } from './i18n';

const EINER = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
  'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const ZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const GRENZE = 1_000_000_000;

function unter100De(n: number): string {
  if (n < 20) {
    return EINER[n];
  }
  const e = n % 10;
  const z = ZEHNER[Math.floor(n / 10)];
  return e ? `${EINER[e]}und${z}` : z;
}

function unter1000De(n: number): string {
  const h = Math.floor(n / 100);
  return `${h ? `${EINER[h]}hundert` : ''}${unter100De(n % 100)}`;
}

/**
 * Schreibt eine ganze Zahl von 1 bis 999.999.999 in deutschen Worten, wie auf einem Scheck:
 * Tausender zusammen, Millionen getrennt ("zwei Millionen dreihunderttausend").
 */
export function zahlDe(n: number): string {
  if (n === 0) {
    return 'null';
  }
  const mio = Math.floor(n / 1_000_000);
  const tsd = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const teile: string[] = [];
  if (mio) {
    teile.push(mio === 1 ? 'eine Million' : `${unter1000De(mio)} Millionen`);
  }
  const klein = `${tsd ? `${unter1000De(tsd)}tausend` : ''}${unter1000De(rest)}`;
  if (klein) {
    teile.push(klein);
  }
  return teile.join(' ');
}

function unter100En(n: number): string {
  if (n < 20) {
    return ONES[n];
  }
  const e = n % 10;
  const z = TENS[Math.floor(n / 10)];
  return e ? `${z}-${ONES[e]}` : z;
}

function unter1000En(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const teile: string[] = [];
  if (h) {
    teile.push(`${ONES[h]} hundred`);
  }
  if (r) {
    teile.push(unter100En(r));
  }
  return teile.join(' and ');
}

/**
 * Schreibt eine ganze Zahl von 1 bis 999.999.999 in britischem Englisch ("two thousand five hundred").
 */
export function zahlEn(n: number): string {
  if (n === 0) {
    return 'zero';
  }
  const teile: string[] = [];
  const mio = Math.floor(n / 1_000_000);
  const tsd = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (mio) {
    teile.push(`${unter1000En(mio)} million`);
  }
  if (tsd) {
    teile.push(`${unter1000En(tsd)} thousand`);
  }
  if (rest) {
    teile.push(unter1000En(rest));
  }
  return teile.join(' ');
}

/**
 * Schreibt einen Betrag in Cent als Euro und Cent in Worten.
 * Gibt einen leeren Text zurück, wenn der Betrag ausserhalb des darstellbaren Bereichs liegt.
 */
export function betragInWorten(cent: number, sprache: Sprache): string {
  if (!Number.isSafeInteger(cent) || cent <= 0 || cent >= GRENZE * 100) {
    return '';
  }
  const euro = Math.floor(cent / 100);
  const c = cent % 100;
  if (sprache === 'de') {
    const teile: string[] = [];
    if (euro) {
      teile.push(`${zahlDe(euro)} Euro`);
    }
    if (c) {
      teile.push(`${unter100De(c)} Cent`);
    }
    return teile.join(' und ');
  }
  const teile: string[] = [];
  if (euro) {
    teile.push(`${zahlEn(euro)} ${euro === 1 ? 'euro' : 'euros'}`);
  }
  if (c) {
    teile.push(`${unter100En(c)} ${c === 1 ? 'cent' : 'cents'}`);
  }
  return teile.join(' and ');
}
