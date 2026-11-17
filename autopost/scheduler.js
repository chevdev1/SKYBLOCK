#!/usr/bin/env node
/* Keeps running and posts the next approved item at fixed UTC times (default 2 a day).
   Start it once on the host:  node scheduler.js   (or: npm start)
   Env (or .env file): TG_BOT_TOKEN, TG_CHAT, POST_TIMES="09:00,17:00" (UTC, 24h, comma separated). */
const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
try { for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !l.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) { }
const times = (process.env.POST_TIMES || '09:00,17:00').split(',').map(s => s.trim()).filter(Boolean);
const STATE = path.join(__dirname, 'state.json');
let state = {}; try { state = JSON.parse(fs.readFileSync(STATE, 'utf8')) } catch (e) { }
console.log('Scheduler started. Post times (UTC):', times.join(', '), '| channel:', process.env.TG_CHAT || '@HopToOlympus');
function tick() {
  const d = new Date(), hhmm = d.toISOString().slice(11, 16), key = d.toISOString().slice(0, 10) + ' ' + hhmm;
  if (!times.includes(hhmm) || state.last === key) return;
  state.last = key; fs.writeFileSync(STATE, JSON.stringify(state));
  console.log(new Date().toISOString(), 'time to post');
  execFile(process.execPath, [path.join(__dirname, 'post-next.js')], { env: process.env }, (err, out, errout) => { console.log(out.trim()); if (err) console.error(errout.trim() || err.message); });
}
setInterval(tick, 20000); tick();
