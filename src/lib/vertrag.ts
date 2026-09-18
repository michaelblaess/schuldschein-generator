import { formatiereBetrag } from './betrag';
import { formatiereTag, type Tag } from './datum';
import { formatiereIban } from './iban';
import type { Sprache } from './i18n';
import { ratenplan, type Rhythmus } from './raten';
import { betragInWorten } from './zahlwort';

/*
 * Die einzige Quelle fuer den Vertragstext. Vorschau, Druck, PDF, Word und die leeren
 * Vorlagen werden alle aus diesen Bausteinen gebaut, damit sie nie auseinanderlaufen.
 */

export interface Person {
  name: string;
  adresse: string;
  geburt: Tag | null;
  ausweis: string;
  iban: string;
}

export type Auszahlung = 'bar' | 'ueberweisung' | 'anders';

export interface Angaben {
  geber: Person;
  nehmer: Person;
  cent: number | null;
  /** Rueckzahlung bis zu diesem Tag, bei Raten der letzte Termin. */
  zurueck: Tag | null;
  unbefristet: boolean;
  auszahlung: Auszahlung;
  /** Prozent pro Jahr, null oder 0 heisst zinslos. */
  zinssatz: number | null;
  rhythmus: Rhythmus;
  ersteRate: Tag | null;
  zweck: string;
  zeuge: { name: string; adresse: string; geburt: Tag | null; ausweis: string };
}

export type Fassung = 'kompakt' | 'ausfuehrlich' | 'raten' | 'quittung';

/** Eine Stelle im Text, die aus den Angaben kommt. Leer wird sie zur Schreiblinie. */
export interface Luecke {
  wert: string;
  hinweis: string;
  breite: 'kurz' | 'mittel' | 'lang';
}

export type Teil = string | Luecke;

export type Baustein =
  | { art: 'titel'; text: string }
  | { art: 'unter'; text: string }
  | { art: 'ueberschrift'; text: string }
  | { art: 'absatz'; teile: Teil[] }
  | { art: 'tabelle'; kopf: string[]; zeilen: string[][] }
  | { art: 'unterschriften'; felder: string[] }
  | { art: 'fuss'; text: string };

export function leerePerson(): Person {
  return { name: '', adresse: '', geburt: null, ausweis: '', iban: '' };
}

export function leereAngaben(): Angaben {
  return {
    geber: leerePerson(),
    nehmer: leerePerson(),
    cent: null,
    zurueck: null,
    unbefristet: false,
    auszahlung: 'bar',
    zinssatz: null,
    rhythmus: 'einmal',
    ersteRate: null,
    zweck: '',
    zeuge: { name: '', adresse: '', geburt: null, ausweis: '' },
  };
}

/** Wortlaut je Sprache. Platzhalter in geschweiften Klammern gibt es nicht, Saetze werden aus Teilen gebaut. */
const W = {
  de: {
    titel: 'Schuldschein',
    titelQuittung: 'Quittung',
    unter: 'Darlehen unter Privatleuten',
    unterRaten: 'Darlehen unter Privatleuten, mit Ratenplan',
    unterQuittung: 'über die Rückzahlung eines Darlehens',
    name: 'Name',
    anschrift: 'Anschrift',
    betrag: 'Betrag',
    worte: 'Betrag in Worten',
    datum: 'Datum',
    anzahl: 'Anzahl',
    geburt: 'Geburtsdatum',
    ausweisHinweis: 'Ausweisnummer',
    wohnhaft: ', wohnhaft ',
    geboren: ', geboren am ',
    ausweis: ', Ausweisnummer ',
    rolleNehmer: ' (Darlehensnehmer/in)',
    rolleGeber: ' (Darlehensgeber/in)',
    bestaetigt: ', bestätigt, von ',
    darlehenUeber: ', ein Darlehen über ',
    eurWorte: ' EUR (in Worten: ',
    erhalten: ' erhalten zu haben.',
    bar: 'in bar',
    ueberweisung: 'per Überweisung',
    aufKonto: 'per Überweisung auf das Konto ',
    barOderUeberweisung: 'in bar / per Überweisung',
    zweck: 'Das Darlehen dient folgendem Zweck: ',
    zinslos: 'Das Darlehen ist zinslos.',
    zinsVor: 'Das Darlehen wird mit ',
    zinsNach: ' % pro Jahr verzinst. Die Zinsen sind jeweils nach Ablauf eines Jahres und bei der Rückzahlung fällig.',
    zinsVorlage: 'Das Darlehen ist zinslos / wird mit ',
    zinsVorlageNach: ' % pro Jahr verzinst.',
    bisZum: 'Das Darlehen ist bis zum ',
    inEinerSumme: ' in einer Summe zurückzuzahlen.',
    unbefristet: 'Ein Rückzahlungstermin ist nicht vereinbart. Das Darlehen wird fällig, wenn eine Seite es mit einer Frist von drei Monaten kündigt.',
    ratenVor: 'Das Darlehen wird in ',
    ratenMonatlich: ' monatlichen Raten',
    ratenQuartal: ' vierteljährlichen Raten',
    ratenAb: ' zurückgezahlt, erstmals am ',
    ratenBis: ', zuletzt am ',
    ratenPlan: '. Die einzelnen Raten stehen im Ratenplan.',
    ratenVorlage: [' Raten zu je ', ' EUR zurückgezahlt, erstmals am '],
    rueckKonto: 'Die Rückzahlung erfolgt auf das Konto ',
    frueher: 'Eine frühere Rückzahlung, ganz oder in Teilen, ist jederzeit möglich.',
    rueckgabe: 'Nach vollständiger Rückzahlung wird dieser Schuldschein zurückgegeben.',
    p1: '§ 1 Vertragsparteien',
    p2: '§ 2 Darlehen und Auszahlung',
    p3: '§ 3 Zinsen',
    p4: '§ 4 Rückzahlung',
    p5: '§ 5 Verzug',
    p6: '§ 6 Quittung und Rückgabe',
    p7: '§ 7 Schlussbestimmungen',
    geberDoppel: 'Darlehensgeber/in: ',
    nehmerDoppel: 'Darlehensnehmer/in: ',
    gewaehrt: 'Darlehensgeber/in gewährt Darlehensnehmer/in ein Darlehen über ',
    empfang: '). Darlehensnehmer/in bestätigt mit der Unterschrift, den Betrag',
    verzugKurz: 'Bei verspäteter Zahlung gelten die gesetzlichen Verzugszinsen (§ 288 BGB).',
    verzug: 'Wird eine Zahlung nicht rechtzeitig geleistet, gelten die gesetzlichen Verzugszinsen (§ 288 BGB). Ist für die Zahlung ein Kalendertag bestimmt, bedarf es keiner Mahnung (§ 286 BGB).',
    quittung: 'Für jede Zahlung stellt Darlehensgeber/in auf Verlangen eine Quittung aus. Nach vollständiger Rückzahlung wird dieser Schuldschein zurückgegeben (§§ 368, 371 BGB).',
    schluss: 'Änderungen und Ergänzungen dieses Vertrags müssen schriftlich festgehalten werden. Jede Seite erhält eine unterschriebene Ausfertigung.',
    zeuge: 'Zeuge/Zeugin: ',
    tabelle: ['Nr.', 'Fällig am', 'Betrag (EUR)', 'Erhalten am, Unterschrift'],
    uNehmer: 'Ort, Datum, Unterschrift Darlehensnehmer/in',
    uGeber: 'Ort, Datum, Unterschrift Darlehensgeber/in',
    uZeuge: 'Ort, Datum, Unterschrift Zeuge/Zeugin',
    fuss: 'Erstellt mit schuldschein-generator.de. Keine Rechtsberatung. Zweimal ausdrucken, beide Exemplare eigenhändig unterschreiben.',
    fussVorlage: 'Vorlage von schuldschein-generator.de. Keine Rechtsberatung. Zweimal ausdrucken, beide Exemplare eigenhändig unterschreiben.',
    copyright: 'Vorlage',
    qIch: 'Ich, ',
    qVon: ', bestätige, von ',
    qAm: ' am ',
    qBetrag: ' den Betrag von ',
    qAls: ') als Rückzahlung des Darlehens vom ',
    qGetilgt: 'Das Darlehen ist damit vollständig getilgt / es bleiben ',
    qOffen: ' EUR offen.',
    qSchein: 'Der Schuldschein wurde zurückgegeben / wird bei vollständiger Tilgung zurückgegeben.',
  },
  en: {
    titel: 'Promissory note',
    titelQuittung: 'Receipt',
    unter: 'Loan between private individuals',
    unterRaten: 'Loan between private individuals, with repayment schedule',
    unterQuittung: 'for the repayment of a loan',
    name: 'Name',
    anschrift: 'Address',
    betrag: 'Amount',
    worte: 'Amount in words',
    datum: 'Date',
    anzahl: 'Number',
    geburt: 'Date of birth',
    ausweisHinweis: 'ID number',
    wohnhaft: ', residing at ',
    geboren: ', born on ',
    ausweis: ', ID card number ',
    rolleNehmer: ' (borrower)',
    rolleGeber: ' (lender)',
    bestaetigt: ', confirms having received from ',
    darlehenUeber: ', a loan of ',
    eurWorte: ' EUR (in words: ',
    erhalten: '.',
    bar: 'in cash',
    ueberweisung: 'by bank transfer',
    aufKonto: 'by bank transfer to the account ',
    barOderUeberweisung: 'in cash / by bank transfer',
    zweck: 'The loan is for the following purpose: ',
    zinslos: 'The loan is interest-free.',
    zinsVor: 'The loan bears interest at ',
    zinsNach: ' % per year. Interest is due at the end of each year and upon repayment.',
    zinsVorlage: 'The loan is interest-free / bears interest at ',
    zinsVorlageNach: ' % per year.',
    bisZum: 'The loan is to be repaid in full by ',
    inEinerSumme: '.',
    unbefristet: 'No repayment date has been agreed. The loan becomes due when either party terminates it with three months\' notice.',
    ratenVor: 'The loan is repaid in ',
    ratenMonatlich: ' monthly instalments',
    ratenQuartal: ' quarterly instalments',
    ratenAb: ', the first on ',
    ratenBis: ', the last on ',
    ratenPlan: '. The individual instalments are listed in the repayment schedule.',
    ratenVorlage: [' instalments of ', ' EUR each, the first on '],
    rueckKonto: 'Repayment is made to the account ',
    frueher: 'Earlier repayment, in full or in part, is possible at any time.',
    rueckgabe: 'Once the loan has been repaid in full, this promissory note will be returned.',
    p1: '§ 1 Parties',
    p2: '§ 2 Loan and payout',
    p3: '§ 3 Interest',
    p4: '§ 4 Repayment',
    p5: '§ 5 Late payment',
    p6: '§ 6 Receipt and return',
    p7: '§ 7 Final provisions',
    geberDoppel: 'Lender: ',
    nehmerDoppel: 'Borrower: ',
    gewaehrt: 'The lender grants the borrower a loan of ',
    empfang: '). By signing, the borrower confirms having received the amount',
    verzugKurz: 'If a payment is late, statutory default interest applies (§ 288 German Civil Code).',
    verzug: 'If a payment is not made on time, statutory default interest applies (§ 288 German Civil Code). Where a calendar date is set for the payment, no reminder is required (§ 286 German Civil Code).',
    quittung: 'For every payment the lender issues a receipt on request. Once the loan has been repaid in full, this promissory note is returned (§§ 368, 371 German Civil Code).',
    schluss: 'Changes and additions to this agreement must be made in writing. Each party receives a signed copy.',
    zeuge: 'Witness: ',
    tabelle: ['No.', 'Due on', 'Amount (EUR)', 'Received on, signature'],
    uNehmer: 'Place, date, signature of the borrower',
    uGeber: 'Place, date, signature of the lender',
    uZeuge: 'Place, date, signature of the witness',
    fuss: 'Created with schuldschein-generator.de. Not legal advice. Print twice and sign both copies by hand.',
    fussVorlage: 'Template from schuldschein-generator.de. Not legal advice. Print twice and sign both copies by hand.',
    copyright: 'Template',
    qIch: 'I, ',
    qVon: ', confirm having received from ',
    qAm: ' on ',
    qBetrag: ' the amount of ',
    qAls: ') as repayment of the loan dated ',
    qGetilgt: 'The loan is thereby repaid in full / an amount of ',
    qOffen: ' EUR remains outstanding.',
    qSchein: 'The promissory note has been returned / will be returned once the loan is repaid in full.',
  },
} as const;

function l(wert: string, hinweis: string, breite: Luecke['breite'] = 'mittel'): Luecke {
  return { wert, hinweis, breite };
}

function mitLeer(text: string): string {
  return text ? ` ${text}` : '';
}

function ohnePunkt(text: string): string {
  return text.trim().replace(/[.!]+$/, '');
}

function prozent(wert: number, sprache: Sprache): string {
  return wert.toLocaleString(sprache === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 3 });
}

/**
 * Name, Anschrift, Geburtsdatum und Ausweisnummer einer Person als Teile eines Satzes.
 * Mit luecken = true stehen Geburtsdatum und Ausweis auch leer im Text (Pflicht beim Schuldner,
 * Schreiblinie in der Vorlage), sonst nur, wenn sie angegeben sind.
 */
function person(p: Person, s: Sprache, luecken: boolean): Teil[] {
  const w = W[s];
  const teile: Teil[] = [l(p.name, w.name), w.wohnhaft, l(p.adresse, w.anschrift, 'lang')];
  if (p.geburt || luecken) {
    teile.push(w.geboren, l(p.geburt ? formatiereTag(p.geburt, s) : '', w.geburt, 'kurz'));
  }
  if (p.ausweis.trim() || luecken) {
    teile.push(w.ausweis, l(p.ausweis.trim(), w.ausweisHinweis, 'mittel'));
  }
  return teile;
}

function auszahlung(a: Angaben, s: Sprache, vorlage: boolean): string {
  const w = W[s];
  if (vorlage) {
    return w.barOderUeberweisung;
  }
  if (a.auszahlung === 'bar') {
    return w.bar;
  }
  if (a.auszahlung === 'ueberweisung') {
    return a.nehmer.iban.trim() ? `${w.aufKonto}${formatiereIban(a.nehmer.iban)}` : w.ueberweisung;
  }
  return '';
}

function betragTeile(a: Angaben, s: Sprache): Teil[] {
  const w = W[s];
  const betrag = a.cent ? formatiereBetrag(a.cent, s) : '';
  const worte = a.cent ? betragInWorten(a.cent, s) : '';
  return [l(betrag, w.betrag, 'kurz'), w.eurWorte, l(worte, w.worte, 'lang')];
}

function zinsSatz(a: Angaben, s: Sprache, vorlage: boolean): Teil[] {
  const w = W[s];
  if (vorlage) {
    return [w.zinsVorlage, l('', '', 'kurz'), w.zinsVorlageNach];
  }
  if (!a.zinssatz) {
    return [w.zinslos];
  }
  return [w.zinsVor, prozent(a.zinssatz, s), w.zinsNach];
}

function rueckzahlung(a: Angaben, s: Sprache, vorlage: boolean, fassung: Fassung): Teil[][] {
  const w = W[s];
  const saetze: Teil[][] = [];
  const bis = a.zurueck ? formatiereTag(a.zurueck, s) : '';
  if (fassung === 'raten' && vorlage) {
    saetze.push([w.ratenVor, l('', w.anzahl, 'kurz'), w.ratenVorlage[0], l('', w.betrag, 'kurz'), w.ratenVorlage[1], l('', w.datum), '.']);
  } else if (a.rhythmus !== 'einmal' && !vorlage) {
    const plan = a.cent && a.ersteRate && a.zurueck ? ratenplan(a.cent, a.rhythmus, a.ersteRate, a.zurueck) : [];
    const art = a.rhythmus === 'monatlich' ? w.ratenMonatlich : w.ratenQuartal;
    if (plan.length) {
      saetze.push([
        w.ratenVor, `${plan.length}${art}`, w.ratenAb, formatiereTag(plan[0].faellig, s),
        w.ratenBis, formatiereTag(plan[plan.length - 1].faellig, s), w.ratenPlan,
      ]);
    } else {
      saetze.push([w.ratenVor, l('', w.anzahl, 'kurz'), art, w.ratenAb, l('', w.datum), w.ratenBis, l(bis, w.datum), '.']);
    }
  } else if (a.unbefristet && !vorlage) {
    saetze.push([w.unbefristet]);
  } else {
    saetze.push([w.bisZum, l(bis, w.datum), w.inEinerSumme]);
  }
  if (a.geber.iban.trim() && !vorlage) {
    saetze.push([w.rueckKonto, formatiereIban(a.geber.iban), '.']);
  }
  saetze.push([w.frueher]);
  return saetze;
}

function ratenTabelle(a: Angaben, s: Sprache, vorlage: boolean): Baustein | null {
  const w = W[s];
  if (vorlage) {
    return { art: 'tabelle', kopf: [...w.tabelle], zeilen: Array.from({ length: 10 }, (_, i) => [String(i + 1), '', '', '']) };
  }
  if (a.rhythmus === 'einmal' || !a.cent || !a.ersteRate || !a.zurueck) {
    return null;
  }
  const plan = ratenplan(a.cent, a.rhythmus, a.ersteRate, a.zurueck);
  if (!plan.length) {
    return null;
  }
  return {
    art: 'tabelle',
    kopf: [...w.tabelle],
    zeilen: plan.map((r) => [String(r.nummer), formatiereTag(r.faellig, s), formatiereBetrag(r.cent, s), '']),
  };
}

function unterschriften(a: Angaben, s: Sprache): Baustein[] {
  const w = W[s];
  const felder: string[] = [w.uNehmer, w.uGeber];
  const bausteine: Baustein[] = [];
  if (a.zeuge.name.trim()) {
    const zeuge: Teil[] = [w.zeuge, a.zeuge.name.trim()];
    if (a.zeuge.adresse.trim()) {
      zeuge.push(`${w.wohnhaft}${a.zeuge.adresse.trim()}`);
    }
    if (a.zeuge.geburt) {
      zeuge.push(`${w.geboren}${formatiereTag(a.zeuge.geburt, s)}`);
    }
    if (a.zeuge.ausweis.trim()) {
      zeuge.push(`${w.ausweis}${a.zeuge.ausweis.trim()}`);
    }
    bausteine.push({ art: 'absatz', teile: zeuge });
    felder.push(w.uZeuge);
  }
  bausteine.push({ art: 'unterschriften', felder });
  return bausteine;
}

/**
 * Baut den Vertragstext aus den Angaben.
 * Mit vorlage = true entsteht die leere Fassung zum Ausfüllen von Hand, mit Alternativen zum Streichen.
 */
export function erzeugeVertrag(a: Angaben, fassung: Fassung, s: Sprache, vorlage = false): Baustein[] {
  const w = W[s];
  if (fassung === 'quittung') {
    return quittung(a, s);
  }
  const zeigeRaten = fassung === 'raten' || (!vorlage && a.rhythmus !== 'einmal');
  const b: Baustein[] = [
    { art: 'titel', text: w.titel },
    { art: 'unter', text: zeigeRaten ? w.unterRaten : w.unter },
  ];
  const zweck = a.zweck.trim() && !vorlage ? [{ art: 'absatz', teile: [w.zweck, ohnePunkt(a.zweck), '.'] } as Baustein] : [];

  if (fassung === 'ausfuehrlich') {
    b.push(
      { art: 'ueberschrift', text: w.p1 },
      { art: 'absatz', teile: [w.geberDoppel, ...person(a.geber, s, vorlage)] },
      { art: 'absatz', teile: [w.nehmerDoppel, ...person(a.nehmer, s, true)] },
      { art: 'ueberschrift', text: w.p2 },
      { art: 'absatz', teile: [w.gewaehrt, ...betragTeile(a, s), w.empfang, mitLeer(auszahlung(a, s, vorlage)), w.erhalten] },
      ...zweck,
      { art: 'ueberschrift', text: w.p3 },
      { art: 'absatz', teile: zinsSatz(a, s, vorlage) },
      { art: 'ueberschrift', text: w.p4 },
      ...rueckzahlung(a, s, vorlage, fassung).map((teile): Baustein => ({ art: 'absatz', teile })),
      { art: 'ueberschrift', text: w.p5 },
      { art: 'absatz', teile: [w.verzug] },
      { art: 'ueberschrift', text: w.p6 },
      { art: 'absatz', teile: [w.quittung] },
      { art: 'ueberschrift', text: w.p7 },
      { art: 'absatz', teile: [w.schluss] },
    );
  } else {
    const aus = auszahlung(a, s, vorlage);
    b.push(
      {
        art: 'absatz',
        teile: [
          ...person(a.nehmer, s, true), w.rolleNehmer, w.bestaetigt, ...person(a.geber, s, vorlage), w.rolleGeber,
          w.darlehenUeber, ...betragTeile(a, s), ')', mitLeer(aus), w.erhalten,
        ],
      },
      ...zweck,
      { art: 'absatz', teile: zinsSatz(a, s, vorlage) },
      ...rueckzahlung(a, s, vorlage, fassung).map((teile): Baustein => ({ art: 'absatz', teile })),
      { art: 'absatz', teile: [w.verzugKurz] },
      { art: 'absatz', teile: [w.rueckgabe] },
    );
  }
  const tabelle = zeigeRaten ? ratenTabelle(a, s, vorlage) : null;
  if (tabelle) {
    b.push(tabelle);
  }
  b.push(...unterschriften(a, s), { art: 'fuss', text: fussText(s, vorlage) });
  return b;
}

/** Fusszeile des Dokuments mit Michaels Copyright an der Vorlage, das Jahr laeuft mit. */
function fussText(s: Sprache, vorlage: boolean): string {
  const w = W[s];
  return `${vorlage ? w.fussVorlage : w.fuss} ${w.copyright} © ${new Date().getFullYear()} Michael Blaess.`;
}

function quittung(a: Angaben, s: Sprache): Baustein[] {
  const w = W[s];
  return [
    { art: 'titel', text: w.titelQuittung },
    { art: 'unter', text: w.unterQuittung },
    {
      art: 'absatz',
      teile: [
        w.qIch, l(a.geber.name, w.name), w.qVon, l(a.nehmer.name, w.name), w.qAm, l('', w.datum),
        w.qBetrag, l('', w.betrag, 'kurz'), w.eurWorte, l('', w.worte, 'lang'), w.qAls, l('', w.datum), w.erhalten,
      ],
    },
    { art: 'absatz', teile: [w.qGetilgt, l('', w.betrag, 'kurz'), w.qOffen] },
    { art: 'absatz', teile: [w.qSchein] },
    { art: 'unterschriften', felder: [w.uGeber] },
    { art: 'fuss', text: fussText(s, true) },
  ];
}

/** Der ganze Text ohne Formatierung, etwa zum Pruefen in Tests. */
export function alsText(bausteine: Baustein[]): string {
  return bausteine
    .map((b) => {
      if (b.art === 'absatz') {
        return b.teile.map((t) => (typeof t === 'string' ? t : t.wert || '____')).join('');
      }
      if (b.art === 'tabelle') {
        return [b.kopf, ...b.zeilen].map((z) => z.join(' | ')).join('\n');
      }
      if (b.art === 'unterschriften') {
        return b.felder.join(' | ');
      }
      return b.text;
    })
    .join('\n');
}
