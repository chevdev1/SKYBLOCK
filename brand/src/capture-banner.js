/* Captures the landing's real first-screen render (island, sky, bloom) as a social banner.
   Usage:  node capture-banner.js <out-dir> [playwright-core path]
   Needs: playwright-core, Chrome, and the site served at http://localhost:8080 (node server/server.js). */
const path = require('path');
const pw = require(process.argv[3] || 'playwright-core');
const out = process.argv[2] || '.';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function shot(browser, name, opts) {
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 844 }, deviceScaleFactor: opts.dpr });
  const p = await ctx.newPage();
  /* expose the scene objects of the landing without touching the site's files */
  await p.route('**/landing/app.js', async r => {
    const res = await r.fetch(); let t = await res.text();
    t = t.replace('const W = {};', 'const W = {}; window.__W = W; window.__cam = cam;');
    await r.fulfill({ response: res, body: t });
  });
  await p.goto('http://localhost:8080/', { waitUntil: 'load' }); await p.waitForTimeout(6500);
  await p.addStyleTag({ content: 'main,.nav,.foot,#pre,.dress-btn,dialog{display:none!important}' });
  await p.evaluate(h => { const W = window.__W; if (!h.hero) W.hero.G.visible = false; if (!h.kumo) W.kHero.G.visible = false }, opts);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: path.join(out, name), clip: { x: 0, y: opts.y, width: 1500, height: 500 } });
  await ctx.close();
}
(async () => {
  const b = await pw.chromium.launch({ executablePath: CHROME, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const Y = +(process.env.BANNER_Y || 235);
  await shot(b, 'island-banner-1500x500.png', { dpr: 1, y: Y, hero: false, kumo: false });
  await shot(b, 'island-banner-3000x1000.png', { dpr: 2, y: Y, hero: false, kumo: false });
  await shot(b, 'island-hero-banner-1500x500.png', { dpr: 1, y: Y - 30, hero: true, kumo: true });
  await shot(b, 'island-hero-banner-3000x1000.png', { dpr: 2, y: Y - 30, hero: true, kumo: true });
  await b.close(); console.log('done');
})();
