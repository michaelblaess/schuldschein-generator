import { BASISZINS } from './basiszins';
import type { Sprache } from './i18n';

/*
 * Inhalt der Seite "Rechtslage". Grundlage ist docs/recherche-rechtslage.md: jede
 * Aussage dort belegt, jedes Urteil am 18.09.2026 im Volltext geoeffnet. Die zwei dort
 * als "nicht verifiziert" markierten Entscheidungen stehen hier bewusst nicht.
 * Absaetze duerfen einfaches HTML enthalten (eigene Links), sie kommen nie aus Eingaben.
 */

export const STAND = '18.09.2026';

type Zwei = Record<Sprache, string>;

const g = (paragraf: string, pfad: string) =>
  `<a class="norm" href="https://www.gesetze-im-internet.de/${pfad}.html">${paragraf}</a>`;

export const KURZ: Record<Sprache, string[]> = {
  de: [
    'Ein Notar ist nicht nötig. Für ein Darlehen unter Privatleuten schreibt das Gesetz keine Form vor.',
    'Ausdrucken und eigenhändig unterschreiben. Nur dann beweist der Schuldschein vor Gericht voll.',
    'Ohne Rückzahlungstermin gilt eine Kündigungsfrist von drei Monaten.',
    'Die Forderung verjährt nach drei Jahren, gerechnet ab Ende des Jahres, in dem sie fällig wurde.',
    'Wer Geld zurückfordert, muss im Streit beweisen, dass es kein Geschenk war. Dafür ist der Schuldschein da.',
    'Nach der Rückzahlung gibt es eine Quittung und den Schuldschein zurück.',
  ],
  en: [
    'No notary is needed. German law prescribes no particular form for a loan between private individuals.',
    'Print it and sign it by hand. Only then does the note serve as full evidence in court.',
    "Without a repayment date, a notice period of three months applies.",
    'The claim becomes time-barred after three years, counted from the end of the year in which it fell due.',
    'In a dispute, whoever wants the money back must prove it was not a gift. That is what the note is for.',
    'After repayment the borrower receives a receipt and gets the note back.',
  ],
};

export interface Thema {
  id: string;
  titel: Zwei;
  marke: Zwei;
  absaetze: Record<Sprache, string[]>;
  basiszinsTabelle?: boolean;
}

const verzugDe = BASISZINS.verzug.toLocaleString('de-DE');
const verzugEn = BASISZINS.verzug.toLocaleString('en-GB');

export const THEMEN: Thema[] = [
  {
    id: 'form',
    titel: { de: 'Form und Unterschrift', en: 'Form and signature' },
    marke: { de: '§ 126, 781 BGB', en: '§ 126, 781 BGB' },
    absaetze: {
      de: [
        `Für den Darlehensvertrag unter Privatleuten gibt es keine Formvorschrift. Die Schriftform verlangt das Gesetz nur beim Verbraucherdarlehen, also wenn ein Unternehmer Geld verleiht. ${g('§ 492 BGB', 'bgb/__492')}`,
        `Ein Schuldanerkenntnis dagegen muss schriftlich sein, die elektronische Form ist ausgeschlossen. Ein PDF per E-Mail oder eine eingescannte Unterschrift reicht dafür nicht. ${g('§ 781 BGB', 'bgb/__781')} ${g('§ 126 BGB', 'bgb/__126')}`,
        `Eine unterschriebene Privaturkunde beweist voll, dass die Erklärung von dem stammt, der unterschrieben hat. ${g('§ 416 ZPO', 'zpo/__416')}`,
      ],
      en: [
        `German law prescribes no form for a loan agreement between private individuals. Written form is only required for consumer loans, that is when a business lends the money. ${g('§ 492 BGB', 'bgb/__492')}`,
        `An acknowledgement of debt, however, must be in writing, and electronic form is expressly excluded. A PDF sent by email or a scanned signature is not enough for that. ${g('§ 781 BGB', 'bgb/__781')} ${g('§ 126 BGB', 'bgb/__126')}`,
        `A signed private document is full proof that the statement in it comes from the person who signed. ${g('§ 416 ZPO', 'zpo/__416')}`,
      ],
    },
  },
  {
    id: 'rueckzahlung',
    titel: { de: 'Rückzahlung und Kündigung', en: 'Repayment and notice' },
    marke: { de: '§ 488 BGB', en: '§ 488 BGB' },
    absaetze: {
      de: [
        `Ist kein Rückzahlungstermin bestimmt, wird das Darlehen erst durch Kündigung fällig. Die Frist beträgt drei Monate. Ist das Darlehen zinslos, darf auch ohne Kündigung zurückgezahlt werden. ${g('§ 488 Abs. 3 BGB', 'bgb/__488')}`,
        `Nach der Rückzahlung kann der Schuldner eine Quittung und die Rückgabe des Schuldscheins verlangen. ${g('§ 368 BGB', 'bgb/__368')} ${g('§ 371 BGB', 'bgb/__371')}`,
      ],
      en: [
        `If no repayment date is set, the loan only falls due once it is terminated. The notice period is three months. An interest-free loan may be repaid without notice. ${g('§ 488(3) BGB', 'bgb/__488')}`,
        `After repayment the debtor can demand a receipt and the return of the promissory note. ${g('§ 368 BGB', 'bgb/__368')} ${g('§ 371 BGB', 'bgb/__371')}`,
      ],
    },
  },
  {
    id: 'verjaehrung',
    titel: { de: 'Verjährung', en: 'Limitation period' },
    marke: { de: '3 Jahre', en: '3 years' },
    absaetze: {
      de: [
        `Die regelmäßige Frist beträgt drei Jahre. Sie beginnt am Ende des Jahres, in dem der Anspruch entstanden ist, spätestens gilt eine Grenze von zehn Jahren. ${g('§ 195 BGB', 'bgb/__195')} ${g('§ 199 BGB', 'bgb/__199')}`,
        'Beim Darlehen entsteht der Anspruch erst mit der Fälligkeit, ohne festen Termin also erst nach der Kündigung (BGH, IX ZR 129/17).',
        `Jede Raten- oder Zinszahlung lässt die Verjährung neu beginnen. ${g('§ 212 BGB', 'bgb/__212')}`,
      ],
      en: [
        `The standard period is three years. It starts at the end of the year in which the claim arose, with an absolute limit of ten years. ${g('§ 195 BGB', 'bgb/__195')} ${g('§ 199 BGB', 'bgb/__199')}`,
        'For a loan the claim only arises when it falls due, so without a fixed date only after notice has been given (Federal Court of Justice, IX ZR 129/17).',
        `Every instalment or interest payment restarts the limitation period. ${g('§ 212 BGB', 'bgb/__212')}`,
      ],
    },
  },
  {
    id: 'zinsen',
    titel: { de: 'Zinsen und Verzug', en: 'Interest and late payment' },
    marke: { de: `derzeit ${verzugDe} %`, en: `currently ${verzugEn} %` },
    basiszinsTabelle: true,
    absaetze: {
      de: [
        `Zinsen gibt es nur, wenn sie vereinbart sind. Eine feste Obergrenze kennt das Gesetz nicht, sittenwidrig hohe Zinsen machen den Vertrag aber nichtig. ${g('§ 488 BGB', 'bgb/__488')} ${g('§ 138 BGB', 'bgb/__138')}`,
        `Wer nicht rechtzeitig zahlt, gerät in Verzug. Steht der Termin im Kalender, braucht es keine Mahnung. Der Verzugszins liegt fünf Prozentpunkte über dem Basiszinssatz, unter Privatleuten derzeit also ${verzugDe} % pro Jahr. ${g('§ 286 BGB', 'bgb/__286')} ${g('§ 288 BGB', 'bgb/__288')}`,
      ],
      en: [
        `Interest is only owed if it has been agreed. The law sets no fixed cap, but an extortionate rate makes the agreement void. ${g('§ 488 BGB', 'bgb/__488')} ${g('§ 138 BGB', 'bgb/__138')}`,
        `Whoever does not pay on time is in default. If the date is fixed in the calendar, no reminder is needed. Default interest is five percentage points above the German base rate, so currently ${verzugEn} % per year between private individuals. ${g('§ 286 BGB', 'bgb/__286')} ${g('§ 288 BGB', 'bgb/__288')}`,
      ],
    },
  },
  {
    id: 'schenkung',
    titel: { de: 'Darlehen oder Geschenk?', en: 'Loan or gift?' },
    marke: { de: '§ 518 BGB', en: '§ 518 BGB' },
    absaetze: {
      de: [
        `Ein Schenkungsversprechen bräuchte zwar einen Notar, der Mangel heilt aber, sobald das Geld geflossen ist. ${g('§ 518 BGB', 'bgb/__518')}`,
        'Im Streit muss deshalb derjenige, der das Geld zurückwill, beweisen, dass es kein Geschenk war (BGH, X ZR 150/11). Ein unterschriebener Schuldschein ist dieser Beweis.',
      ],
      en: [
        `A promise to make a gift would need a notary, but that defect is cured as soon as the money has been handed over. ${g('§ 518 BGB', 'bgb/__518')}`,
        'In a dispute, whoever wants the money back therefore has to prove that it was not a gift (Federal Court of Justice, X ZR 150/11). A signed promissory note is that proof.',
      ],
    },
  },
  {
    id: 'steuern',
    titel: { de: 'Steuern', en: 'Tax' },
    marke: { de: 'Zinsen, Schenkung', en: 'interest, gifts' },
    absaetze: {
      de: [
        `Zinsen aus einem privaten Darlehen sind Einkünfte aus Kapitalvermögen und grundsätzlich zu versteuern. ${g('§ 20 EStG', 'estg/__20')}`,
        `Ein zinsloses oder sehr günstiges Darlehen kann als Schenkung des Zinsvorteils gelten. Bewertet wird mit dem marktüblichen Zins, wenn der feststeht, sonst mit 5,5 % (BFH, II R 20/22). ${g('§ 15 BewG', 'bewg/__15')}`,
        `Freibeträge innerhalb von zehn Jahren, unter anderem: Ehe- oder Lebenspartner 500.000 Euro, Kinder 400.000 Euro, Enkel 200.000 Euro. ${g('§ 16 ErbStG', 'erbstg_1974/__16')}`,
      ],
      en: [
        `Interest from a private loan counts as investment income and is generally taxable in Germany. ${g('§ 20 EStG', 'estg/__20')}`,
        `An interest-free or very cheap loan can count as a gift of the interest saved. It is valued at the market rate where one can be established, otherwise at 5.5 % (Federal Fiscal Court, II R 20/22). ${g('§ 15 BewG', 'bewg/__15')}`,
        `Tax-free allowances over ten years include: spouse or civil partner EUR 500,000, children EUR 400,000, grandchildren EUR 200,000. ${g('§ 16 ErbStG', 'erbstg_1974/__16')}`,
      ],
    },
  },
  {
    id: 'gericht',
    titel: { de: 'Gerichtsstand', en: 'Place of jurisdiction' },
    marke: { de: '§ 38 ZPO', en: '§ 38 ZPO' },
    absaetze: {
      de: [
        `Privatleute können einen Gerichtsstand nur in Ausnahmen vereinbaren, etwa nachdem der Streit schon entstanden ist. Eine pauschale Klausel im Schuldschein wirkt deshalb in aller Regel nicht. Unser Generator lässt sie weg. ${g('§ 38 ZPO', 'zpo/__38')}`,
      ],
      en: [
        `Private individuals can only agree on a place of jurisdiction in exceptional cases, for example once a dispute has already arisen. A general clause in a promissory note is therefore usually ineffective. Our generator leaves it out. ${g('§ 38 ZPO', 'zpo/__38')}`,
      ],
    },
  },
  {
    id: 'neu',
    titel: { de: 'Neu ab 20.11.2026', en: 'New from 20 November 2026' },
    marke: { de: '§ 491 BGB', en: '§ 491 BGB' },
    absaetze: {
      de: [
        'Das neue Verbraucherkreditrecht erfasst künftig auch zinslose Kredite von Unternehmern. Für Darlehen zwischen zwei Privatleuten ändert sich nichts, weil weiterhin ein Unternehmer als Darlehensgeber vorausgesetzt ist. <a href="https://www.recht.bund.de/bgbl/1/2026/139/regelungstext.pdf?__blob=publicationFile&amp;v=1">BGBl. 2026 I Nr. 139</a>',
      ],
      en: [
        'The new consumer credit rules will also cover interest-free credit from businesses. Nothing changes for loans between two private individuals, because a business as lender is still required. <a href="https://www.recht.bund.de/bgbl/1/2026/139/regelungstext.pdf?__blob=publicationFile&amp;v=1">Federal Law Gazette 2026 I No. 139</a>',
      ],
    },
  },
];

export interface Urteil {
  gericht: Zwei;
  datum: string;
  az: string;
  titel: Zwei;
  text: Zwei;
  url: string;
  link: Zwei;
}

const RIS = 'https://testphase.rechtsinformationen.bund.de/v1/case-law/';

export const URTEILE: Urteil[] = [
  {
    gericht: { de: 'BFH', en: 'Federal Fiscal Court' }, datum: '2024-07-31', az: 'II R 20/22',
    titel: { de: 'Zinsgünstiges Darlehen in der Familie: marktüblicher Zins statt pauschal 5,5 %', en: 'Cheap family loan: market rate instead of a flat 5.5 %' },
    text: { de: 'Der Zinsvorteil unterliegt der Schenkungsteuer, wird aber mit dem marktüblichen Zins bemessen, wenn der feststeht.', en: 'The interest saved is subject to gift tax, but it is valued at the market rate where one can be established.' },
    url: 'https://www.bundesfinanzhof.de/en/entscheidungen/entscheidungen-online/decision-detail/STRE202410203/',
    link: { de: 'Volltext beim BFH', en: 'Full text at the court' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2019-06-18', az: 'X ZR 107/16',
    titel: { de: 'Immobilie an Kind und Partner verschenkt, Beziehung hält nicht', en: 'Property given to a child and partner, the relationship ends' },
    text: { de: 'Dauerte die gemeinsame Nutzung nur kurz, kann der Schenker in der Regel zurücktreten.', en: 'If the joint use lasted only a short time, the giver can usually withdraw from the gift.' },
    url: `${RIS}KORE305082019.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2018-06-21', az: 'IX ZR 129/17',
    titel: { de: 'Verjährung beginnt beim Darlehen ohne Laufzeit erst mit der Kündigung', en: 'For a loan without a term, limitation only starts with notice' },
    text: { de: 'Der Rückzahlungsanspruch entsteht mit der Fälligkeit, und die hängt ohne festen Termin von der Kündigung ab.', en: 'The repayment claim arises when it falls due, and without a fixed date that depends on notice being given.' },
    url: `${RIS}KORE301262018.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'OLG Köln', en: 'Higher Regional Court Cologne' }, datum: '2017-06-29', az: '16 U 106/16',
    titel: { de: 'Überweisung ohne Verwendungszweck "Darlehen" genügt als Nachweis', en: 'A transfer without the reference "loan" is enough as proof' },
    text: { de: 'Die Überweisung kam unmittelbar nach dem schriftlichen Vertrag, danach wurden Raten gezahlt. Das reichte als Beweis der Auszahlung.', en: 'The transfer came right after the written agreement and instalments were paid afterwards. That was enough to prove the payout.' },
    url: 'https://nrwe.justiz.nrw.de/olgs/koeln/j2017/16_U_106_16_Beschluss_20170629.html', link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2017-05-11', az: 'I ZB 63/16',
    titel: { de: 'Was im unterschriebenen Text steht, gilt als vollständig und richtig', en: 'What the signed text says is presumed complete and correct' },
    text: { de: 'Wer sich auf Absprachen außerhalb der Urkunde beruft, muss sie beweisen. Unklares begründet keine Vermutung.', en: 'Anyone relying on arrangements outside the document has to prove them. Anything unclear creates no presumption.' },
    url: `${RIS}KORE622122017.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'OLG Hamm', en: 'Higher Regional Court Hamm' }, datum: '2017-03-14', az: '10 U 62/16',
    titel: { de: 'Schuldanerkenntnis über ein Elterndarlehen', en: 'Acknowledgement of a loan from parents' },
    text: { de: 'Wer ein Darlehen schriftlich anerkannt hat, kann später keine Einwände mehr erheben, die er damals schon kannte.', en: 'Someone who acknowledged a loan in writing cannot later raise objections they already knew about at the time.' },
    url: 'https://nrwe.justiz.nrw.de/olgs/hamm/j2017/10_U_62_16_Urteil_20170314.html', link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2014-05-06', az: 'X ZR 135/11',
    titel: { de: 'Absicherung der Lebensgefährtin, Rückforderung nach der Trennung', en: 'Provision for a partner, reclaimed after separation' },
    text: { de: 'Eine solche Zuwendung ist meist keine Schenkung und kann zurückzugeben sein, wenn die Beziehung danach scheitert.', en: 'Such a contribution is usually not a gift and may have to be returned if the relationship later fails.' },
    url: `${RIS}KORE311132014.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2014-03-11', az: 'X ZR 150/11',
    titel: { de: 'Mutter fordert Geld von der Tochter zurück', en: 'A mother claims money back from her daughter' },
    text: { de: 'Eine Darlehensabrede konnte die Mutter nicht belegen. Dass es kein Geschenk war, muss beweisen, wer das Geld zurückwill.', en: 'The mother could not prove a loan agreement. Whoever wants the money back has to prove it was not a gift.' },
    url: `${RIS}KORE310902014.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BFH', en: 'Federal Fiscal Court' }, datum: '2013-10-22', az: 'X R 26/11',
    titel: { de: 'Darlehen unter Angehörigen im Steuerrecht', en: 'Loans between relatives in tax law' },
    text: { de: 'Wie streng das Finanzamt den Vertrag mit einem Fremdvergleich prüft, hängt vom Anlass ab. Wichtig ist, dass er tatsächlich so gelebt wird.', en: 'How strictly the tax office compares the agreement with one between strangers depends on the occasion. What matters is that it is actually carried out as written.' },
    url: `${RIS}STRE201310314.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2013-05-08', az: 'XII ZR 132/12',
    titel: { de: 'Trennung: gezahlte Raten für das Haus des Partners', en: 'Separation: instalments paid for the partner\'s house' },
    text: { de: 'Ohne ausdrückliche Darlehensabrede gibt es meist keinen Ausgleich, solange die Zahlungen nicht deutlich über einer Miete lagen.', en: 'Without an express loan agreement there is usually no compensation, as long as the payments were not well above a rent.' },
    url: `${RIS}KORE303422013.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'BGH', en: 'Federal Court of Justice' }, datum: '2010-02-03', az: 'XII ZR 189/06',
    titel: { de: 'Zuwendungen der Schwiegereltern nach dem Scheitern der Ehe', en: 'Contributions from parents-in-law after a divorce' },
    text: { de: 'Sie gelten als Schenkung, können aber nach dem Scheitern der Ehe zurückgefordert werden.', en: 'They count as gifts but can be reclaimed once the marriage has failed.' },
    url: `${RIS}KORE303332010.html`, link: { de: 'Volltext', en: 'Full text' },
  },
  {
    gericht: { de: 'OLG Oldenburg', en: 'Higher Regional Court Oldenburg' }, datum: '2002-12-23', az: '15 U 72/02',
    titel: { de: 'Ein echter Schuldschein trägt die Klage', en: 'A genuine promissory note carries the claim' },
    text: { de: 'Ist die Unterschrift bewiesen, muss der Gläubiger die näheren Umstände nicht darlegen. Der Schuldschein wirkt zugleich als Quittung.', en: 'Once the signature is proven, the creditor does not have to explain the circumstances. The note also works as a receipt.' },
    url: 'https://lorenz.userweb.mwn.de/urteile/oldenburg.htm', link: { de: 'Volltext (Urteilssammlung LMU)', en: 'Full text (LMU case collection)' },
  },
];
