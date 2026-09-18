// Erzeugt Favicons und das Teilerbild aus dem Logo. Aufruf: node tools/erzeuge-bilder.mjs
// Ergebnis liegt in public/, wird eingecheckt und nur bei Logo-Aenderungen neu erzeugt.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const wurzel = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const cache = path.join(os.homedir(), 'AppData/Local/ms-playwright');
const shell = fs.readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().pop();
const exe = path.join(cache, shell, 'chrome-headless-shell-win64/chrome-headless-shell.exe');

const favicon = fs.readFileSync(path.join(wurzel, 'public/favicon.svg'), 'utf8').replace(/@media[^{]*\{[^}]*\{[^}]*\}[^}]*\{[^}]*\}\s*\}/, '');
const marke = fs.readFileSync(path.join(wurzel, 'docs/design-vorschlaege/bilder/logo-marke.svg'), 'utf8').replace(/@media[^{]*\{[^}]*\{[^}]*\}[^}]*\{[^}]*\}[^}]*\{[^}]*\}\s*\}/, '');
const schrift = (datei) => fs.readFileSync(path.join(wurzel, 'node_modules/@fontsource', datei)).toString('base64');
const barlow = schrift('barlow-semi-condensed/files/barlow-semi-condensed-latin-700-normal.woff2');
const barlow5 = schrift('barlow-semi-condensed/files/barlow-semi-condensed-latin-500-normal.woff2');

const browser = await chromium.launch({ executablePath: exe });

async function bild(html, breite, hoehe, ziel) {
  const seite = await browser.newPage({ viewport: { width: breite, height: hoehe } });
  await seite.setContent(html, { waitUntil: 'load' });
  await seite.evaluate(() => document.fonts.ready);
  await seite.screenshot({ path: path.join(wurzel, 'public', ziel), omitBackground: false });
  await seite.close();
  console.log(ziel, `${breite}x${hoehe}`);
}

const icon = (px, rand) => `<body style="margin:0;background:#fff;display:grid;place-items:center;width:${px}px;height:${px}px">
  <div style="width:${px - rand * 2}px;height:${px - rand * 2}px">${favicon.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`;
await bild(icon(32, 0), 32, 32, 'favicon-32.png');
await bild(icon(180, 18), 180, 180, 'apple-touch-icon.png');

await bild(`<html><head><style>
  @font-face { font-family: B; font-weight: 700; src: url(data:font/woff2;base64,${barlow}) format('woff2'); }
  @font-face { font-family: B; font-weight: 500; src: url(data:font/woff2;base64,${barlow5}) format('woff2'); }
  body { margin: 0; width: 1200px; height: 630px; background: #F1F1EE; font-family: B; color: #111418; position: relative; overflow: hidden; }
  .band { position: absolute; left: 0; right: 0; top: 0; height: 18px; background: #C8102E; }
  .beleg { position: absolute; right: 70px; top: 120px; width: 470px; height: 390px; background: #FCEEF0; border: 4px solid #C8102E; padding: 26px; box-sizing: border-box; }
  .zeile { height: 46px; background: #fff; border: 2px solid #C8102E; margin-bottom: 22px; }
  .kaestchen { display: flex; height: 58px; border: 2px solid #C8102E; background: #fff; width: 330px; }
  .kaestchen span { flex: 1; border-right: 2px solid #EFB7C0; display: grid; place-items: center; font-size: 34px; font-weight: 700; }
  .kaestchen span:last-child { border-right: 0; }
  .text { position: absolute; left: 70px; top: 64px; width: 560px; }
  h1 { font-size: 78px; line-height: .95; margin: 18px 0 18px; letter-spacing: -1px; }
  p { font-size: 32px; font-weight: 500; margin: 0; color: #3B3F46; line-height: 1.25; }
  .url { position: absolute; left: 70px; bottom: 44px; font-size: 30px; font-weight: 700; }
  .url i { font-style: normal; color: #C8102E; }
</style></head><body>
  <div class="band"></div>
  <div class="text">
    <div style="width:120px;height:120px">${marke.replace('<svg ', '<svg width="120" height="120" ')}</div>
    <h1>Geld verleihen - aber richtig</h1>
    <p>Kostenlos ausfüllen, als PDF speichern oder drucken.</p>
  </div>
  <div class="beleg"><div class="zeile"></div><div class="zeile"></div><div class="zeile"></div>
    <div class="kaestchen"><span>2</span><span>5</span><span>0</span><span>0</span><span>,</span><span>0</span><span>0</span></div></div>
  <div class="url">schuldschein<i>-generator</i>.de</div>
</body></html>`, 1200, 630, 'og.png');

await browser.close();
