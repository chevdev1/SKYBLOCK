/* Captures clean in-game frames (no HUD) from play/ for creatives.
   node capture-game.js <out-dir>   Needs the site served on http://localhost:8080 and playwright-core (PW env var for its path). */
const pw = require(process.env.PW || 'playwright-core'), path = require('path');
const out = process.argv[2] || '.';
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://localhost:8080/play/', { waitUntil: 'load' }); await p.waitForTimeout(6000);
  await p.keyboard.press('Space'); await p.waitForTimeout(6000);            /* start the run as the default hero */
  await p.addStyleTag({ content: '#app > *:not(canvas), body > *:not(#app):not(script){display:none!important}' });
  await p.waitForTimeout(800); await p.screenshot({ path: path.join(out, 'frame-start.png') });
  await p.keyboard.down('KeyW'); await p.waitForTimeout(700);
  await p.keyboard.press('Space'); await p.waitForTimeout(350); await p.screenshot({ path: path.join(out, 'frame-jump.png') });
  await p.keyboard.up('KeyW'); await p.waitForTimeout(900); await p.screenshot({ path: path.join(out, 'frame-idle.png') });
  await b.close(); console.log('done');
})();
