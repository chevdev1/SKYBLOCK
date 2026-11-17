/* Captures the in-game hero with a chosen loadout and a controlled camera (SERGIO via test access, Shadow Garb armour, Titan blades).
   node capture-hero.js '{"yawAdd":0,"pitch":0.2,"dist":5.8,"out":"frame.png"}'   Needs site on :8080, playwright-core (PW env var) and Chrome.
   yawAdd 0 = front of the hero; PI = from behind. World name labels are hidden by swapping nameSprite for an invisible sprite. */
const { chromium } = require(process.env.PW || 'playwright-core');
(async () => {
  const cfg = JSON.parse(process.argv[2] || '{"yawAdd":3.14159,"pitch":0.14,"dist":3.8,"out":"refs/sg-front.png"}');
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem('oblaka-progress-v1', JSON.stringify({ cp: 0, at: 0, seen: [], won: false, skin: null, wings: false, bossDown: false, unlock: {}, chests: {}, found: {}, gear: { aegis: true, twins: true }, weapon: 'twins', off: {} })) } catch (e) { } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(u => u.pathname === '/play/' || u.pathname.endsWith('/play/index.html'), async r => {
    const res = await r.fetch(); let t = await res.text();
    t = t.replace('function nameSprite(', 'function nameSprite(){return new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,opacity:0,depthWrite:false}))} function nameSprite0(');
    t = t.replace('let yaw=0.35,pitch=0.3,dist=7.5,shake=0;', 'let yaw=0.35,pitch=0.3,dist=7.5,shake=0; window.__cam={g:()=>({yaw,pitch,dist}),s:(a,b,c)=>{yaw=a;pitch=b;dist=c}};');
    await r.fulfill({ response: res, body: t });
  });
  await p.goto('http://localhost:8080/play/', { waitUntil: 'load' }); await p.waitForTimeout(6500);
  await p.getByText('SERGIO', { exact: true }).first().click(); await p.waitForTimeout(900);
  await p.locator('#buy button', { hasText: 'Тестовый доступ' }).click(); await p.waitForTimeout(1200);
  await p.keyboard.press('Space'); await p.waitForTimeout(6500);
  await p.addStyleTag({ content: 'body > *:not(#app):not(script){display:none!important} #app > *:not(canvas){display:none!important}' });
  const c0 = await p.evaluate(() => window.__cam && window.__cam.g());
  await p.evaluate(c => { const g = window.__cam.g(); window.__cam.s(g.yaw + c.yawAdd, c.pitch, c.dist) }, cfg);
  await p.waitForTimeout(1800);
  console.log('cam0', JSON.stringify(c0), 'after', JSON.stringify(await p.evaluate(() => window.__cam.g())));
  await p.screenshot({ path: cfg.out }); console.log(errs.slice(0, 3)); await b.close();
})();
