// Smoketest mit echtem Browser gegen den Produktionsbuild.
// Aufruf: npx astro build && npx astro preview --port 4412 --background && node tools/smoketest.mjs http://localhost:4412
// Rueckgabewert 1, sobald eine Bedingung faellt.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const basis = (process.argv[2] ?? process.env.SMOKE_URL ?? 'http://localhost:4412').replace(/\/$/, '');
const cache = path.join(os.homedir(), 'AppData/Local/ms-playwright');
const shell = fs.readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().pop();
const exe = path.join(cache, shell, 'chrome-headless-shell-win64/chrome-headless-shell.exe');

let fehler = 0;
const pruefe = (ok, text) => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${text}`);
  if (!ok) {
    fehler += 1;
  }
};

const browser = await chromium.launch({ executablePath: exe });
const kontext = await browser.newContext({ locale: 'de-DE', acceptDownloads: true });
const seite = await kontext.newPage();
const konsole = [];
const fremd = [];
seite.on('pageerror', (e) => konsole.push(e.message));
seite.on('console', (m) => m.type() === 'error' && konsole.push(m.text()));
seite.on('request', (r) => {
  const url = new URL(r.url());
  // Eigener Host zaehlt nicht als fremd, sonst schlaegt die Pruefung gegen die Live-Seite falsch an
  if (url.hostname !== new URL(basis).hostname &&!url.protocol.startsWith('data') && !url.protocol.startsWith('blob')) {
    fremd.push(r.url());
  }
});

// Gegenprobe: laeuft ueberhaupt unsere Seite auf diesem Port?
await seite.goto(`${basis}/`, { waitUntil: 'networkidle' });
pruefe((await seite.title()).includes('Schuldschein-Generator'), `richtige Seite unter ${basis}`);

await seite.fill('#geber_name', 'Anna Berger');
await seite.fill('#geber_adresse', 'Lindenweg 12, 04109 Leipzig');
await seite.fill('#nehmer_name', 'Jonas <img src=x onerror="window.__xss=1">');
await seite.fill('#nehmer_adresse', 'Am Markt 3, 04109 Leipzig');
await seite.fill('#summe', '2.500,50');
await seite.fill('#zurueck', '2027-12-31');
pruefe((await seite.locator('#stand-titel').innerText()) !== 'Alles Nötige ist da', 'ohne Geburtsdatum und Ausweis des Schuldners nicht vollständig');
await seite.fill('#nehmer_geburt', '1986-11-02');
await seite.fill('#nehmer_ausweis', 'L01X00T47');
const text = await seite.locator('#dokument .blatt').innerText();
pruefe(text.includes('ein Darlehen über 2.500,50 EUR (in Worten: zweitausendfünfhundert Euro und fünfzig Cent) in bar erhalten zu haben.'), 'Betrag mit Cent in Worten im Vertrag');
pruefe(text.includes('Das Darlehen ist bis zum 31.12.2027 in einer Summe zurückzuzahlen.'), 'Rückzahlungsdatum im Vertrag');
pruefe(!text.includes('Gerichtsstand'), 'keine Gerichtsstandsklausel');
pruefe(text.includes('geboren am 02.11.1986, Ausweisnummer L01X00T47 (Darlehensnehmer/in)'), 'Geburtsdatum und Ausweis des Schuldners im Vertrag');
pruefe(/Vorlage © \d{4} Michael Blaess\./.test(text), 'Copyright im Dokumentfuß');
pruefe(text.includes('Jonas <img src=x onerror="window.__xss=1">'), 'Eingabe erscheint als Text');
pruefe(!(await seite.evaluate(() => window.__xss)), 'Eingabe wird nicht als HTML ausgeführt');
pruefe((await seite.locator('#stand-titel').innerText()) === 'Alles Nötige ist da', 'Pflichtzähler meldet vollständig');

// Die Datenschutzerklaerung behauptet: ohne Haekchen wird nichts gespeichert
const spuren = await seite.evaluate(() => ({ lokal: localStorage.length, sitzung: sessionStorage.length, cookies: document.cookie }));
pruefe(spuren.lokal === 0 && spuren.sitzung === 0 && spuren.cookies === '', `ohne Häkchen kein Speicher (${JSON.stringify(spuren)})`);

// Mit Haekchen gemerkt, nach dem Neuladen wieder da, ohne Haekchen wieder weg
await seite.check('#merken');
await seite.reload({ waitUntil: 'networkidle' });
pruefe((await seite.inputValue('#geber_name')) === 'Anna Berger', 'mit Häkchen nach dem Neuladen wieder da');
await seite.uncheck('#merken');
pruefe(await seite.evaluate(() => localStorage.getItem('schuldschein-eingaben') === null), 'Häkchen entfernen löscht den Speicher');

// Fehlerprüfung
await seite.fill('#summe', 'abc');
pruefe(await seite.locator('#summe-fehler').isVisible(), 'unsinniger Betrag zeigt einen Fehler');
await seite.fill('#summe', '2500');
await seite.locator('summary', { hasText: 'Bankverbindungen' }).click();
await seite.fill('#geber_iban', 'DE88370400440532013000');
pruefe(await seite.locator('#geber_iban-fehler').isVisible(), 'falsche IBAN zeigt einen Fehler');
await seite.fill('#geber_iban', 'DE89 3704 0044 0532 0130 00');
pruefe(!(await seite.locator('#geber_iban-fehler').isVisible()), 'richtige IBAN ohne Fehler');

// Raten und ausfuehrliche Fassung
await seite.locator('summary', { hasText: 'Rückzahlung in Raten' }).click();
await seite.selectOption('#rhythmus', 'monatlich');
await seite.fill('#erste', '2027-01-31');
await seite.locator('label', { hasText: 'Ausführlich' }).click();
const lang = await seite.locator('#dokument .blatt').innerText();
pruefe(lang.includes('12 monatlichen Raten') && lang.includes('28.02.2027'), 'Ratenplan mit § 188 BGB (31.01. -> 28.02.)');
pruefe(lang.includes('§ 7 Schlussbestimmungen'), 'ausführliche Fassung umgeschaltet');

// PDF
const [download] = await Promise.all([seite.waitForEvent('download'), seite.click('#pdf')]);
const pfad = await download.path();
const pdf = fs.readFileSync(pfad);
pruefe(pdf.subarray(0, 5).toString() === '%PDF-' && pdf.length > 2000, `PDF heruntergeladen (${download.suggestedFilename()}, ${pdf.length} Bytes)`);

// Englisch
await seite.goto(`${basis}/en/`, { waitUntil: 'networkidle' });
pruefe((await seite.getAttribute('html', 'lang')) === 'en', 'englische Seite mit lang="en"');
await seite.fill('#summe', '1000');
pruefe((await seite.locator('#dokument .blatt').innerText()).includes('in words: one thousand euros'), 'Betrag in Worten auf Englisch');

// Jede Seite laedt, der Weg ins Impressum ist ein Klick
for (const p of ['/vorlagen/', '/rechtslage/', '/fragen/', '/impressum/', '/datenschutz/', '/nutzungsbedingungen/',
  '/ueber/', '/en/templates/', '/en/law/', '/en/faq/', '/en/about/', '/en/legal-notice/', '/en/privacy/', '/en/terms/']) {
  const antwort = await seite.goto(`${basis}${p}`, { waitUntil: 'networkidle' });
  pruefe(antwort?.status() === 200, `${p} liefert 200`);
}
await seite.goto(`${basis}/fragen/`);
await seite.getByRole('link', { name: 'Impressum' }).click();
pruefe(seite.url().endsWith('/impressum/'), 'Impressum mit einem Klick erreichbar');

// Vorlagen: Download-Dateien existieren und sind echt
for (const datei of ['schuldschein-kompakt.pdf', 'schuldschein-kompakt.docx', 'quittung-rueckzahlung.pdf']) {
  const r = await seite.request.get(`${basis}/vorlagen/${datei}`);
  const kopf = (await r.body()).subarray(0, 4).toString('latin1');
  pruefe(r.status() === 200 && (kopf === '%PDF' || kopf.startsWith('PK')), `Vorlage ${datei}`);
}

// Dunkelmodus-Schalter
await seite.goto(`${basis}/`, { waitUntil: 'networkidle' });
const hell = await seite.evaluate(() => getComputedStyle(document.body).backgroundColor);
await seite.click('#theme-toggle');
const dunkel = await seite.evaluate(() => getComputedStyle(document.body).backgroundColor);
pruefe(hell !== dunkel, `Schalter wechselt das Design (${hell} -> ${dunkel})`);

// Auf dem Papier darf nichts eingefaerbt sein - "linie kurz" erbte einmal die Box ".kurz" der Rechtslage
await seite.goto(`${basis}/vorlagen/`, { waitUntil: 'networkidle' });
const bunt = await seite.evaluate(() => [...document.querySelectorAll('.mini .blatt .linie')]
  .filter((el) => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)').length);
pruefe(bunt === 0, `Schreiblinien der Vorlagen ohne Hintergrund (${bunt} eingefärbt)`);

pruefe(fremd.length === 0,`keine Anfrage an fremde Server${fremd.length ? `: ${fremd.slice(0, 3).join(', ')}` : ''}`);
pruefe(konsole.length === 0, `keine Fehler in der Konsole${konsole.length ? `: ${konsole.slice(0, 3).join(' | ')}` : ''}`);

await browser.close();
console.log(fehler ? `\n${fehler} Bedingung(en) verletzt` : '\nAlle Bedingungen erfüllt');
process.exit(fehler ? 1 : 0);
