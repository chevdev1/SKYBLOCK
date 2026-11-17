#!/usr/bin/env node
/* Posts the next approved item from queue.json to a Telegram channel.
   Zero dependencies (Node 18+). Config comes from environment variables:
     TG_BOT_TOKEN  bot token (secret, never commit it)
     TG_CHAT       channel, e.g. @HopToOlympus
     DRY_RUN=1     print what would be posted, change nothing
   Rules: only items with "approved": true and an existing image are posted, in order,
   and each item is posted once (postedAt is written back into queue.json). */
const fs = require('fs'), path = require('path');
try { for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !l.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) { }
const QUEUE = path.join(__dirname, 'queue.json');
const dry = process.env.DRY_RUN === '1' || process.argv.includes('--dry');
const token = process.env.TG_BOT_TOKEN, chat = process.env.TG_CHAT || '@HopToOlympus';

(async () => {
  const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const next = q.find(i => i.approved && !i.postedAt && (i.files || [i.file]).every(f => fs.existsSync(path.join(__dirname, 'img', f))));
  const left = q.filter(i => i.approved && !i.postedAt).length;
  if (!next) { console.log('Nothing to post: no approved, unposted items with an image.'); return; }
  console.log(`Next: #${next.id} ${next.file} (${left} approved left)`);
  if (next.text.replace(/<[^>]+>/g, '').length > 1024) throw new Error('Caption longer than 1024 characters');
  if (dry) { console.log('--- DRY RUN ---\n' + next.text); return; }
  if (!token) throw new Error('TG_BOT_TOKEN is not set');
  const rd = f => new Blob([fs.readFileSync(path.join(__dirname, 'img', f))], { type: 'image/png' });
  const fd = new FormData(); fd.append('chat_id', chat);
  let method = 'sendPhoto';
  if (next.files && next.files.length > 1) {
    method = 'sendMediaGroup';
    fd.append('media', JSON.stringify(next.files.map((f, k) => ({ type: 'photo', media: 'attach://p' + k, ...(k === 0 ? { caption: next.text, parse_mode: 'HTML' } : {}) }))));
    next.files.forEach((f, k) => fd.append('p' + k, rd(f), f));
  } else { fd.append('caption', next.text); fd.append('parse_mode', 'HTML'); fd.append('photo', rd(next.file), next.file); }
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', body: fd });
  const j = await res.json();
  if (!j.ok) throw new Error('Telegram error: ' + (j.description || res.status));
  next.postedAt = new Date().toISOString(); next.messageId = (Array.isArray(j.result) ? j.result[0] : j.result).message_id;
  fs.writeFileSync(QUEUE, JSON.stringify(q, null, 2) + '\n');
  console.log('Posted, message_id', (Array.isArray(j.result) ? j.result[0] : j.result).message_id);
})().catch(e => { console.error(e.message); process.exit(1); });
