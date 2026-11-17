#!/usr/bin/env node
/* node approve.js all        approve every unposted item
   node approve.js 1 2 5      approve items by id
   node approve.js none       unapprove every unposted item
   node approve.js list       show the queue */
const fs = require('fs'), path = require('path'), f = path.join(__dirname, 'queue.json');
const q = JSON.parse(fs.readFileSync(f, 'utf8')), a = process.argv.slice(2);
if (!a.length || a[0] === 'list') { q.forEach(i => console.log(String(i.id).padStart(3), i.approved ? '[x]' : '[ ]', i.postedAt ? 'POSTED' : '      ', i.role)); process.exit(0) }
q.forEach(i => { if (i.postedAt) return; if (a[0] === 'all') i.approved = true; else if (a[0] === 'none') i.approved = false; else if (a.map(Number).includes(i.id)) i.approved = true });
fs.writeFileSync(f, JSON.stringify(q, null, 2) + '\n'); console.log('Approved unposted:', q.filter(i => i.approved && !i.postedAt).length);
