// Weist nach, dass die Einwilligung wirklich greift.
//
// Das ist die eine Sache am Consent-Banner, die man nicht sehen kann: ob vor
// dem Klick tatsaechlich nichts an Google geht. Geprueft wird deshalb der
// Netzwerkverkehr und der Cookie-Bestand, nicht das Aussehen des Banners.
//
// Gegen den PRODUKTIONS-Build, nicht gegen den Dev-Server: Analytics laeuft
// bewusst nur mit `import.meta.env.PROD`.
//
//   PUBLIC_GA_ID=G-... npm run build
//   npm run preview &
//   node pruefe-einwilligung.mjs
//
// Rueckgabewert 1, sobald eine der Bedingungen verletzt ist.
import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';

const BASIS = process.argv[2] ?? 'http://localhost:4321';
const CACHE = `${process.env.LOCALAPPDATA}/ms-playwright`;
const shell = readdirSync(CACHE).filter((n) => n.startsWith('chromium_headless_shell-')).sort().at(-1);
const EXE = `${CACHE}/${shell}/chrome-headless-shell-win64/chrome-headless-shell.exe`.split('\\').join('/');

const GOOGLE = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net/;

const browser = await chromium.launch({ executablePath: EXE });

// vanilla-cookieconsent versteckt den Banner vor Bots. Die Bedingung im Paket
// lautet /bot|crawl|spider|slurp|teoma/i.test(userAgent) || navigator.webdriver -
// und navigator.webdriver ist in jedem ferngesteuerten Browser true. Ohne die
// folgende Zeile erscheint der Banner im Test nie, ohne dass ein Fehler faellt.
// Am 16.08.2026 eine gute Stunde gesucht: die Bibliothek war nie das Problem.
const alsMensch = { get: () => false };
const neuerKontext = async () => {
  const k = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  await k.addInitScript((d) => Object.defineProperty(navigator, 'webdriver', d), alsMensch);
  return k;
};

const kontext = await neuerKontext();
const seite = await kontext.newPage();

const anGoogle = [];
seite.on('request', (r) => { if (GOOGLE.test(r.url())) anGoogle.push(r.url()); });

const gaCookies = async () =>
  (await kontext.cookies()).filter((c) => c.name.startsWith('_ga')).map((c) => c.name);

const fehler = [];
const pruefe = (bedingung, text) => {
  console.log(`${bedingung ? 'ok  ' : 'FEHL'}  ${text}`);
  if (!bedingung) fehler.push(text);
};

// --- vor jeder Entscheidung ---------------------------------------------
await seite.goto(BASIS, { waitUntil: 'networkidle' });
await seite.waitForTimeout(800);
pruefe(anGoogle.length === 0, `vor der Entscheidung kein Request an Google (${anGoogle.length})`);
pruefe((await gaCookies()).length === 0, 'vor der Entscheidung kein _ga-Cookie');
pruefe(await seite.locator('#cc-main .cm').isVisible(), 'Banner ist sichtbar');
pruefe(
  await seite.evaluate(() => window.dataLayer?.some(
    (e) => 'consent' === e[0] && 'default' === e[1] && 'denied' === e[2]?.analytics_storage)),
  'Consent Mode steht vor dem Laden auf denied');

// --- ablehnen ------------------------------------------------------------
await seite.getByRole('button', { name: /Nur das Nötigste|Essentials only/ }).click();
await seite.waitForTimeout(1200);
pruefe(anGoogle.length === 0, `nach Ablehnen weiterhin kein Request an Google (${anGoogle.length})`);
pruefe((await gaCookies()).length === 0, 'nach Ablehnen kein _ga-Cookie');

// Auch ein Seitenwechsel darf die Ablehnung nicht vergessen.
await seite.goto(`${BASIS}/faq/`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(800);
pruefe(anGoogle.length === 0, 'auch auf der naechsten Seite kein Request an Google');
pruefe(!(await seite.locator('#cc-main .cm').isVisible()), 'Banner bleibt nach der Entscheidung weg');

// --- zustimmen -----------------------------------------------------------
const frisch = await neuerKontext();
const seite2 = await frisch.newPage();
const anGoogle2 = [];
seite2.on('request', (r) => { if (GOOGLE.test(r.url())) anGoogle2.push(r.url()); });
await seite2.goto(BASIS, { waitUntil: 'networkidle' });
await seite2.getByRole('button', { name: /Einverstanden|I agree/ }).click();

// Auf das Cookie warten statt fest zu schlafen: wie lange Analytics braucht,
// haengt am Netz. Eine feste Pause von 2,5 Sekunden reichte an einem Abend und
// am naechsten nicht mehr.
const bis = Date.now() + 15000;
while (Date.now() < bis && !(await frisch.cookies()).some((c) => c.name.startsWith('_ga'))) {
  await seite2.waitForTimeout(250);
}
pruefe(anGoogle2.length > 0, `nach Zustimmung wird Analytics geladen (${anGoogle2.length} Requests)`);
pruefe(
  (await frisch.cookies()).some((c) => c.name.startsWith('_ga')),
  'nach Zustimmung ist das _ga-Cookie gesetzt');
pruefe(
  await seite2.evaluate(() => window.dataLayer?.some(
    (e) => 'consent' === e[0] && 'update' === e[1] && 'granted' === e[2]?.analytics_storage)),
  'Consent Mode wurde auf granted aktualisiert');

// --- Einstellungen-Dialog, aufgeklappt ------------------------------------
// Michael fand am 16.08.2026 im Browser, dass die Cookie-Tabelle an den runden
// Ecken abgeschnitten war: die Abschnittsbloecke nutzen dieselbe Radius-Variable
// wie die Knoepfe, und die steht auf Pillenform. Zugeklappt sieht man davon
// nichts, deshalb klappt die Pruefung hier alles auf.
const seite3 = await (await neuerKontext()).newPage();
await seite3.goto(BASIS, { waitUntil: 'networkidle' });
await seite3.getByRole('button', { name: /^(Einstellungen|Settings)$/ }).click();
await seite3.waitForTimeout(400);
for (const kopf of await seite3.locator('#cc-main .pm__section--expandable .pm__section-title').all()) {
  await kopf.click();
  await seite3.waitForTimeout(150);
}
const kapseln = await seite3.evaluate(() =>
  [...document.querySelectorAll('#cc-main .pm__section, #cc-main .pm__section-desc-wrapper')]
    .filter((e) => {
      const h = e.getBoundingClientRect().height;
      return h > 0 && parseFloat(getComputedStyle(e).borderTopLeftRadius) > h / 2;
    }).length);
pruefe(0 === kapseln, `kein Abschnittsblock ist zur Kapsel gerundet (${kapseln})`);
pruefe(
  (await seite3.locator('#cc-main .pm__section-table td').allTextContents()).some((x) => x.startsWith('_ga')),
  'die Cookie-Tabelle nennt die Analytics-Cookies');

console.log(fehler.length ? `\n${fehler.length} Bedingung(en) verletzt` : '\nAlle Bedingungen erfuellt.');
await browser.close();
process.exit(fehler.length ? 1 : 0);
