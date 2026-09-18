import { describe, expect, it } from 'vitest';
import { formatiereBetrag, leseBetrag } from '../src/lib/betrag';
import { formatiereTag, heute, leseIso, plusMonate } from '../src/lib/datum';
import { formatiereIban, istGueltigeIban } from '../src/lib/iban';
import { ratenplan } from '../src/lib/raten';
import { alsText, erzeugeVertrag, leereAngaben, type Angaben } from '../src/lib/vertrag';
import { betragInWorten } from '../src/lib/zahlwort';

describe('leseBetrag', () => {
  it.each([
    ['2500', 250000],
    ['2.500', 250000],
    ['2.500,50', 250050],
    ['2500,5', 250050],
    ['2500.50', 250050],
    ['1.234.567,89', 123456789],
    ['2.500 €', 250000],
    ['0,50', 50],
  ])('%s ergibt %i Cent', (eingabe, cent) => {
    expect(leseBetrag(eingabe)).toBe(cent);
  });

  it.each(['', 'abc', '2,5,0', '2.50.0', '1,234'])('%s ist kein Betrag', (eingabe) => {
    expect(leseBetrag(eingabe)).toBeNull();
  });

  it('formatiert je Sprache', () => {
    expect(formatiereBetrag(250050, 'de')).toBe('2.500,50');
    expect(formatiereBetrag(250050, 'en')).toBe('2,500.50');
  });
});

describe('betragInWorten', () => {
  // Die alte Fassung liess die Cent weg und schrieb "ein Million Euro"
  it.each([
    [100, 'ein Euro'],
    [250000, 'zweitausendfünfhundert Euro'],
    [123456, 'eintausendzweihundertvierunddreißig Euro und sechsundfünfzig Cent'],
    [100000000, 'eine Million Euro'],
    [230000000, 'zwei Millionen dreihunderttausend Euro'],
    [50, 'fünfzig Cent'],
    [2100, 'einundzwanzig Euro'],
    [1700000, 'siebzehntausend Euro'],
  ])('%i Cent auf Deutsch', (cent, text) => {
    expect(betragInWorten(cent, 'de')).toBe(text);
  });

  it.each([
    [100, 'one euro'],
    [250050, 'two thousand five hundred euros and fifty cents'],
    [10500, 'one hundred and five euros'],
    [101, 'one euro and one cent'],
  ])('%i Cent auf Englisch', (cent, text) => {
    expect(betragInWorten(cent, 'en')).toBe(text);
  });

  it('gibt ausserhalb des Bereichs nichts aus', () => {
    expect(betragInWorten(0, 'de')).toBe('');
    expect(betragInWorten(100_000_000_000, 'de')).toBe('');
  });
});

describe('plusMonate nach § 188 BGB', () => {
  // Die alte Fassung machte aus dem 31.01. plus ein Monat den 03.03.
  it('31.01. plus ein Monat ist der 28.02.', () => {
    expect(plusMonate({ jahr: 2026, monat: 1, tag: 31 }, 1)).toEqual({ jahr: 2026, monat: 2, tag: 28 });
  });
  it('im Schaltjahr der 29.02.', () => {
    expect(plusMonate({ jahr: 2028, monat: 1, tag: 31 }, 1)).toEqual({ jahr: 2028, monat: 2, tag: 29 });
  });
  it('über den Jahreswechsel', () => {
    expect(plusMonate({ jahr: 2026, monat: 11, tag: 15 }, 3)).toEqual({ jahr: 2027, monat: 2, tag: 15 });
  });
});

describe('Datum', () => {
  it('liest nur existierende Tage', () => {
    expect(leseIso('2027-12-31')).toEqual({ jahr: 2027, monat: 12, tag: 31 });
    expect(leseIso('2027-02-30')).toBeNull();
    expect(leseIso('')).toBeNull();
  });
  it('heute folgt der Geräteuhr, nicht UTC', () => {
    // 01:30 Uhr am 1. Januar lokal, in UTC waere das je nach Zone noch der 31.12.
    expect(heute(new Date(2027, 0, 1, 1, 30))).toEqual({ jahr: 2027, monat: 1, tag: 1 });
  });
  it('formatiert je Sprache', () => {
    expect(formatiereTag({ jahr: 2027, monat: 3, tag: 5 }, 'de')).toBe('05.03.2027');
    expect(formatiereTag({ jahr: 2027, monat: 3, tag: 5 }, 'en')).toBe('5 March 2027');
  });
});

describe('IBAN', () => {
  it('erkennt eine gültige IBAN auch klein und mit Leerzeichen', () => {
    expect(istGueltigeIban('DE89 3704 0044 0532 0130 00')).toBe(true);
    expect(istGueltigeIban('de89370400440532013000')).toBe(true);
  });
  it('lehnt falsche Prüfziffer und Länge ab', () => {
    expect(istGueltigeIban('DE88370400440532013000')).toBe(false);
    expect(istGueltigeIban('DE8937040044053201300')).toBe(false);
  });
  it('schreibt Vierergruppen', () => {
    expect(formatiereIban('de89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
  });
});

describe('ratenplan', () => {
  it('verteilt den Rest auf die letzte Rate', () => {
    const plan = ratenplan(100000, 'monatlich', { jahr: 2026, monat: 10, tag: 1 }, { jahr: 2026, monat: 12, tag: 1 });
    expect(plan.map((r) => r.cent)).toEqual([33333, 33333, 33334]);
    expect(plan.reduce((s, r) => s + r.cent, 0)).toBe(100000);
  });
  it('bleibt beim 31. und rutscht nicht dauerhaft auf den 28.', () => {
    const plan = ratenplan(40000, 'monatlich', { jahr: 2027, monat: 1, tag: 31 }, { jahr: 2027, monat: 4, tag: 30 });
    expect(plan.map((r) => r.faellig.tag)).toEqual([31, 28, 31, 30]);
  });
  it('vierteljährlich', () => {
    const plan = ratenplan(120000, 'vierteljaehrlich', { jahr: 2027, monat: 1, tag: 15 }, { jahr: 2027, monat: 12, tag: 31 });
    expect(plan.map((r) => r.faellig.monat)).toEqual([1, 4, 7, 10]);
  });
  it('liefert nichts, wenn der Beginn nach dem Ende liegt', () => {
    expect(ratenplan(1000, 'monatlich', { jahr: 2028, monat: 1, tag: 1 }, { jahr: 2027, monat: 1, tag: 1 })).toEqual([]);
  });
});

function beispiel(): Angaben {
  const a = leereAngaben();
  a.geber.name = 'Anna Berger';
  a.geber.adresse = 'Lindenweg 12, 04109 Leipzig';
  a.nehmer.name = 'Jonas Keller';
  a.nehmer.adresse = 'Am Markt 3, 04109 Leipzig';
  a.cent = 250000;
  a.zurueck = { jahr: 2027, monat: 12, tag: 31 };
  return a;
}

describe('erzeugeVertrag', () => {
  it('bestätigt den Empfang und nennt Betrag in Worten', () => {
    const text = alsText(erzeugeVertrag(beispiel(), 'kompakt', 'de'));
    expect(text).toContain('Jonas Keller, wohnhaft Am Markt 3, 04109 Leipzig (Darlehensnehmer/in), bestätigt, von Anna Berger');
    expect(text).toContain('ein Darlehen über 2.500,00 EUR (in Worten: zweitausendfünfhundert Euro) in bar erhalten zu haben.');
    expect(text).toContain('Das Darlehen ist bis zum 31.12.2027 in einer Summe zurückzuzahlen.');
    expect(text).toContain('Das Darlehen ist zinslos.');
  });

  it('enthält keine Gerichtsstandsklausel', () => {
    for (const fassung of ['kompakt', 'ausfuehrlich'] as const) {
      expect(alsText(erzeugeVertrag(beispiel(), fassung, 'de'))).not.toMatch(/Gerichtsstand/);
    }
  });

  it('nummeriert die Paragrafen der ausführlichen Fassung ohne Lücke und Doppel', () => {
    const nummern = erzeugeVertrag(beispiel(), 'ausfuehrlich', 'de')
      .filter((b) => b.art === 'ueberschrift')
      .map((b) => Number((b as { text: string }).text.match(/§ (\d+)/)?.[1]));
    expect(nummern).toEqual(nummern.map((_, i) => i + 1));
  });

  it('schreibt Zinsen mit Verb und Komma', () => {
    const a = beispiel();
    a.zinssatz = 3.5;
    expect(alsText(erzeugeVertrag(a, 'kompakt', 'de'))).toContain('Das Darlehen wird mit 3,5 % pro Jahr verzinst.');
    expect(alsText(erzeugeVertrag(a, 'kompakt', 'en'))).toContain('The loan bears interest at 3.5 % per year.');
  });

  it('unbefristet nennt die Kündigungsfrist', () => {
    const a = beispiel();
    a.unbefristet = true;
    a.zurueck = null;
    expect(alsText(erzeugeVertrag(a, 'kompakt', 'de'))).toContain('mit einer Frist von drei Monaten kündigt');
  });

  it('Raten erzeugen Satz und Plan', () => {
    const a = beispiel();
    a.rhythmus = 'monatlich';
    a.ersteRate = { jahr: 2027, monat: 1, tag: 1 };
    const b = erzeugeVertrag(a, 'kompakt', 'de');
    expect(alsText(b)).toContain('Das Darlehen wird in 12 monatlichen Raten zurückgezahlt, erstmals am 01.01.2027, zuletzt am 01.12.2027.');
    const tabelle = b.find((x) => x.art === 'tabelle');
    expect(tabelle && tabelle.art === 'tabelle' ? tabelle.zeilen.length : 0).toBe(12);
  });

  it('die leere Vorlage hat Schreiblinien und Alternativen', () => {
    const b = erzeugeVertrag(leereAngaben(), 'kompakt', 'de', true);
    const text = alsText(b);
    expect(text).toContain('in bar / per Überweisung');
    expect(text).toContain('zinslos / wird mit ____ % pro Jahr verzinst');
    expect(text).not.toMatch(/undefined|null|NaN/);
  });

  it('Quittung und Raten-Vorlage erzeugen sauberen Text', () => {
    for (const s of ['de', 'en'] as const) {
      for (const f of ['raten', 'quittung', 'ausfuehrlich'] as const) {
        // Tabellenzeilen haben absichtlich leere Zellen, geprueft wird der Fliesstext
        const text = alsText(erzeugeVertrag(leereAngaben(), f, s, true))
          .split('\n')
          .filter((z) => !z.includes('|'))
          .join('\n');
        expect(text).not.toMatch(/undefined|null|NaN| {2,}/);
      }
    }
  });
});
