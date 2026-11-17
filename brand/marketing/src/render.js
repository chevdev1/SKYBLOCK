/* Renders a creative template to PNG.
   node render.js <template.html> <out.png> <width> <height> [lang=en|ru] [scale=1]
   Needs: playwright-core (set PW to its path if it is not installed locally) and Chrome (set CHROME if elsewhere). */
const path = require('path'), fs = require('fs');
const pw = require(process.env.PW || 'playwright-core');
const [tpl, out, w, h, lang = 'en', scale = '1'] = process.argv.slice(2);
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
  await p.goto('file:///' + path.resolve(tpl).replace(/\\/g, '/').replace(/ /g, '%20') + '?lang=' + lang, { waitUntil: 'networkidle' });
  await p.waitForFunction('window.__ready', null, { timeout: 30000 }); await p.waitForTimeout(400);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await (await p.$('#c')).screenshot({ path: out }); await b.close(); console.log('saved', out);
})();
