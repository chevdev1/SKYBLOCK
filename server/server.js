// Cloud Islands server: serves the game, leaderboards and Workshop maps.
// No dependencies: `node server/server.js`, then open http://localhost:8080
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = +process.env.PORT || 8080;
const ROOT = path.resolve(__dirname, '..');
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.json');
const MAX_BODY = 1.5 * 1024 * 1024;

/* ---------- storage ---------- */
let db = { scores: {}, maps: {} };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))); } catch (e) { /* first run */ }
let saveT = null;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    const tmp = DB_FILE + '.tmp';
    fs.writeFile(tmp, JSON.stringify(db), err => { if (!err) fs.rename(tmp, DB_FILE, () => {}); });
  }, 500);
}

/* ---------- helpers ---------- */
const send = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(JSON.stringify(obj));
};
const str = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, '').trim().slice(0, max);
const okUid = u => typeof u === 'string' && /^[\w-]{8,40}$/.test(u);
const asc = b => b.startsWith('race-') || b.startsWith('map-');
const BOARD_RE = /^(ach|kills|pvp|race-[0-4]|map-[\w-]{1,32})$/;
const LIMITS = { ach: 5000, kills: 1e6, pvp: 1e6 };

// Same formula as the game: +1 per player, +2 per finish, +5 per like (own plays never count).
const statsOf = m => ({ plays: m.plays.length, likes: m.likes.length, fin: m.fins.length });
const starsOf = s => s.plays + s.likes * 5 + s.fin * 2;
const metaOf = (m, me) => Object.assign({ id: m.id, name: m.name, desc: m.desc, author: m.nick, th: m.th, at: m.at, up: m.up, own: !!me && me === m.uid }, statsOf(m));

// Simple per-IP rate limit: 120 requests per minute.
const hits = new Map();
function limited(ip) {
  const now = Date.now(), h = hits.get(ip) || { t: now, n: 0 };
  if (now - h.t > 60000) { h.t = now; h.n = 0; }
  h.n++; hits.set(ip, h);
  return h.n > 120;
}
setInterval(() => { const now = Date.now(); for (const [k, h] of hits) if (now - h.t > 120000) hits.delete(k); }, 60000).unref();

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(new Error('too big')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

/* ---------- API ---------- */
function setScore(board, uid, nick, v) {
  const b = db.scores[board] = db.scores[board] || {};
  const o = b[uid];
  const better = !o || (asc(board) ? v < o.v : v > o.v);
  if (better || o.n !== nick) { b[uid] = { n: nick, v: better ? v : o.v, at: Date.now() }; save(); }
}

function creatorsBoard(me) {
  const by = new Map();
  for (const m of Object.values(db.maps)) {
    const c = by.get(m.uid) || { n: m.nick, v: 0 };
    c.v += starsOf(statsOf(m)); c.n = m.nick; by.set(m.uid, c);
  }
  return [...by.entries()].map(([uid, c]) => ({ n: c.n, v: c.v, me: uid === me })).filter(r => r.v > 0 || r.me).sort((a, b) => b.v - a.v).slice(0, 50);
}

async function api(req, res, url) {
  const p = url.pathname, me = url.searchParams.get('me') || '';
  if (p === '/api/health') return send(res, 200, { ok: true, maps: Object.keys(db.maps).length });

  if (p === '/api/scores' && req.method === 'GET') {
    const board = url.searchParams.get('board') || '';
    if (board === 'creators') return send(res, 200, creatorsBoard(me));
    if (!BOARD_RE.test(board)) return send(res, 400, { error: 'board' });
    const rows = Object.entries(db.scores[board] || {}).map(([uid, o]) => ({ n: o.n, v: o.v, me: uid === me }));
    rows.sort((a, b) => asc(board) ? a.v - b.v : b.v - a.v);
    const top = rows.slice(0, 50), mine = rows.findIndex(r => r.me);
    if (mine >= 50) top.push(Object.assign({ rank: mine + 1 }, rows[mine]));
    return send(res, 200, top);
  }

  if (p === '/api/maps' && req.method === 'GET') {
    const sort = url.searchParams.get('sort') === 'new' ? 'new' : 'popular';
    const now = Date.now();
    const list = Object.values(db.maps).map(m => metaOf(m, me));
    if (sort === 'new') list.sort((a, b) => b.at - a.at);
    else list.sort((a, b) => starsOf(b) / Math.sqrt((now - b.at) / 864e5 + 2) - starsOf(a) / Math.sqrt((now - a.at) / 864e5 + 2));
    return send(res, 200, list.slice(0, 60));
  }

  let mm = p.match(/^\/api\/maps\/([\w-]{1,32})$/);
  if (mm && req.method === 'GET') {
    const m = db.maps[mm[1]];
    if (!m) return send(res, 404, { error: 'not found' });
    return send(res, 200, Object.assign(metaOf(m, me), { data: m.data }));
  }

  mm = p.match(/^\/api\/creators\/([\w-]{8,40})$/);
  if (mm && req.method === 'GET') {
    const mine = Object.values(db.maps).filter(m => m.uid === mm[1]);
    const s = mine.reduce((a, m) => { const q = statsOf(m); a.plays += q.plays; a.likes += q.likes; a.fin += q.fin; return a; }, { plays: 0, likes: 0, fin: 0 });
    return send(res, 200, Object.assign(s, { maps: mine.length, stars: starsOf(s) }));
  }

  if (req.method !== 'POST') return send(res, 404, { error: 'not found' });
  const body = await readBody(req);
  const uid = body.uid, nick = str(body.nick, 16) || 'Игрок';
  if (!okUid(uid)) return send(res, 400, { error: 'uid' });

  if (p === '/api/scores') {
    const board = String(body.board || ''), v = Number(body.v);
    if (!BOARD_RE.test(board) || !isFinite(v) || v < 0) return send(res, 400, { error: 'score' });
    if (board.startsWith('race-') && (v < 3 || v > 3600)) return send(res, 400, { error: 'time' });
    if (board.startsWith('map-')) return send(res, 400, { error: 'use /finish' });
    if (LIMITS[board] && v > LIMITS[board]) return send(res, 400, { error: 'value' });
    setScore(board, uid, nick, Math.round(v * 100) / 100);
    return send(res, 200, { ok: true });
  }

  if (p === '/api/maps') {
    const d = body.data || {};
    const b = Array.isArray(d.b) ? d.b.slice(0, 15000 * 4).map(v => v | 0) : [];
    const p3 = q => Array.isArray(q) && q.length === 3 && q.every(Number.isFinite) ? q.map(v => v | 0) : null;
    const data = { v: 1, b, s: p3(d.s), f: p3(d.f), c: (Array.isArray(d.c) ? d.c : []).map(p3).filter(Boolean).slice(0, 10) };
    if (!b.length || !data.s || !data.f) return send(res, 400, { error: 'map needs blocks, start and finish' });
    const th = typeof body.th === 'string' && body.th.startsWith('data:image/png;base64,') && body.th.length < 80000 ? body.th : '';
    const name = str(body.name, 40) || 'Без названия', desc = str(body.desc, 140);
    let m = body.id && db.maps[body.id];
    if (m && m.uid !== uid) m = null;
    if (m) Object.assign(m, { name, desc, th, data, nick, up: Date.now() });
    else {
      const id = crypto.randomBytes(5).toString('base64url');
      m = db.maps[id] = { id, uid, nick, name, desc, th, data, at: Date.now(), up: Date.now(), plays: [], likes: [], fins: [] };
    }
    save();
    return send(res, 200, { ok: true, id: m.id });
  }

  mm = p.match(/^\/api\/maps\/([\w-]{1,32})\/(play|like|finish)$/);
  if (mm) {
    const m = db.maps[mm[1]];
    if (!m) return send(res, 404, { error: 'not found' });
    if (m.uid === uid) return send(res, 200, { ok: true, own: true });
    const list = { play: m.plays, like: m.likes, finish: m.fins }[mm[2]];
    if (!list.includes(uid)) { list.push(uid); save(); }
    if (mm[2] === 'finish') {
      const t = Number(body.t);
      if (isFinite(t) && t >= 1 && t < 3600) setScore('map-' + m.id, uid, nick, Math.round(t * 100) / 100);
    }
    return send(res, 200, Object.assign({ ok: true }, statsOf(m)));
  }
  return send(res, 404, { error: 'not found' });
}

/* ---------- static files (game only, never the server folder) ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.resolve(ROOT, '.' + rel);
  const ext = path.extname(file).toLowerCase();
  if (!file.startsWith(ROOT + path.sep) || file.startsWith(__dirname) || !TYPES[ext] || path.basename(file).startsWith('.')) {
    res.writeHead(404); return res.end('Not found');
  }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[ext], 'Cache-Control': 'no-cache' });
    res.end(buf);
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (!url.pathname.startsWith('/api/')) return serveStatic(req, res, url);
  const ip = req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress;
  if (limited(ip)) return send(res, 429, { error: 'slow down' });
  try { await api(req, res, url); } catch (e) { send(res, 400, { error: 'bad request' }); }
}).listen(PORT, () => console.log('Cloud Islands: http://localhost:' + PORT));
