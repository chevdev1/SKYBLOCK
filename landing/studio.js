/* Hop to Olympus landing: interactive roadmap ("Skyward Ascent") and the studio section ("Who we are").
   Standalone module: reads its own data, follows the page language through <html lang>. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s), qa = (s, r) => [...(r || document).querySelectorAll(s)];
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ru');
  const pix = n => (window.HTO_PIX ? window.HTO_PIX(n) : '');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const get = async u => { try { const r = await fetch(u); return r.ok ? await r.json() : [] } catch (e) { return [] } };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e };

  const T = {
    ru: {
      score: 'Альфа пройдена', of: 'из', shipped: 'готово', inprog: 'в работе', all: 'Все',
      st: { done: 'Готово', progress: 'В работе', next: 'Дальше', later: 'Позже' },
      ph: { alpha: 'Альфа', beta: 'Бета', release: 'Релиз' }, here: 'мы здесь',
      phd: { alpha: 'Играбельная сборка', beta: 'Шлифовка и экономика', release: 'Сообщество и рост' },
      open: 'Подробнее', want: 'Жду это', wanted: 'Жду!', close: 'Закрыть', prev: 'Назад', next: 'Дальше',
      area: 'Направление', mine: 'Ты ждёшь', things: 'вещей', hint: 'Нажми на карточку, чтобы раскрыть. Отметь, что ждёшь: это останется только в твоём браузере.',
      ab: {
        title: 'Маленькая студия, <mark>большой</mark> остров',
        tape: ['Сделано вручную', 'Без издателя', 'Шансы открыты', 'Слушаем игроков', 'Альфа растёт каждую неделю'],
        p1: 'Мы — локальная инди-студия. Без издателя и без конвейера: делаем игру, в которую сами хотим играть, и вкладываем в неё душу — от каждого кубика острова до характера каждого Кумо.',
        p2: 'Hop to Olympus сейчас в альфе. Это живая сборка: что-то ломается, что-то меняется, а контента становится больше с каждым обновлением. Играя сейчас, ты влияешь на то, какой игра станет.',
        stats: ['миров', 'боссов', 'обновлений альфы', 'издателей'],
        vals: [['Душа в деталях', 'Каждый остров, моб и Кумо сделан вручную.', 'Мы сами расставляем острова, рисуем мобов и придумываем характер каждому Кумо.'], ['Честно с игроками', 'Шансы открыты. Никаких обещаний доходности.', 'Шансы вылупления публичны, номер сверхредкого уникален. Мы не обещаем доход.'], ['Слушаем комьюнити', 'Идеи игроков попадают в обновления.', 'Предложения игроков попадают в патч-ноты. Есть идея — расскажи нам.']],
        flip: 'Нажми, чтобы перевернуть', team: 'Команда', you: 'Ты?', confirm: '[УТОЧНИТЬ: состав команды, роли и фото]',
        alpha: 'Это альфа-версия', alphaT: 'Игра в стадии тестирования: возможны баги и изменения баланса. Дальше игра будет только развиваться и наполняться контентом.',
        log: 'Свежие обновления', way: 'Путь к бете', play: 'Играть', notes: 'Патч-ноты',
      },
    },
    en: {
      score: 'Alpha completed', of: 'of', shipped: 'shipped', inprog: 'in progress', all: 'All',
      st: { done: 'Done', progress: 'In progress', next: 'Next', later: 'Later' },
      ph: { alpha: 'Alpha', beta: 'Beta', release: 'Release' }, here: 'we are here',
      phd: { alpha: 'A playable build', beta: 'Polish and economy', release: 'Community and growth' },
      open: 'Details', want: 'I want this', wanted: 'Waiting!', close: 'Close', prev: 'Previous', next: 'Next',
      area: 'Area', mine: 'You are waiting for', things: 'things', hint: 'Tap a card to open it. Mark what you are waiting for: it stays in your browser only.',
      ab: {
        title: 'A small studio, a <mark>big</mark> island',
        tape: ['Handmade', 'No publisher', 'Public odds', 'We listen to players', 'The alpha grows every week'],
        p1: 'We are a local indie studio. No publisher, no assembly line: we make the game we want to play ourselves and put our soul into it — from every block of an island to the character of every Kumo.',
        p2: 'Hop to Olympus is in alpha. It is a living build: things break, things change, and every update adds more content. Playing now, you shape what the game becomes.',
        stats: ['worlds', 'bosses', 'alpha updates', 'publishers'],
        vals: [['Soul in the details', 'Every isle, mob and Kumo is handmade.', 'We place the isles, draw the mobs and invent the personality of every Kumo ourselves.'], ['Honest with players', 'Public odds. No promises of profit.', 'Hatch odds are public and an ultra-rare number is unique. We promise no profit.'], ['We listen', 'Player ideas make it into updates.', 'Player suggestions land in the patch notes. Got an idea? Tell us.']],
        flip: 'Tap to flip', team: 'Team', you: 'You?', confirm: '[TO CONFIRM: team, roles and photos]',
        alpha: 'This is an alpha', alphaT: 'The game is in testing: expect bugs and balance changes. From here it only grows and fills with content.',
        log: 'Latest updates', way: 'Road to beta', play: 'Play', notes: 'Patch notes',
      },
    },
  };
  const t = () => T[lang()];
  const STC = { done: '#8ee04a', progress: '#ffc23c', next: '#5cc8ff', later: '#c48aff' };
  const phaseOf = s => (s === 'done' || s === 'progress' ? 'alpha' : s === 'next' ? 'beta' : 'release');
  const goto = id => { const n = document.getElementById(id); if (n) n.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }) };

  let ROAD = [], PATCH = [], WORLDS = [], BOSSES = [];
  const S = { f: 'all', sel: 0, votes: new Set() };
  try { JSON.parse(localStorage.getItem('hto_road_votes') || '[]').forEach(x => S.votes.add(x)) } catch (e) { }
  const saveVotes = () => { try { localStorage.setItem('hto_road_votes', JSON.stringify([...S.votes])) } catch (e) { } };

  /* ---------- helpers ---------- */
  const pctOf = r => (r.status === 'done' ? 100 : r.status === 'progress' ? (r.pct || 50) : 0);
  const alphaFrac = () => { const a = ROAD.filter(r => phaseOf(r.status) === 'alpha'); return a.length ? a.reduce((s, r) => s + pctOf(r), 0) / (a.length * 100) : 0 };
  const matches = r => S.f === 'all' || S.f === r.status || (S.f === 'alpha' && phaseOf(r.status) === 'alpha');
  function countUp(node, to, dur) {
    if (REDUCED || !to) { node.textContent = to; return }
    const t0 = performance.now(); (function step(now) { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step) })(t0);
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); e.target.dispatchEvent(new Event('seen')) } }), { threshold: 0.2 });
  const watch = n => { if (REDUCED) { n.classList.add('in'); n.dispatchEvent(new Event('seen')) } else io.observe(n) };

  /* ================= ROADMAP ================= */
  function roadRender() {
    const root = $('#roadApp'); if (!root || !ROAD.length) return; const L = t(), lg = lang();
    const total = ROAD.length, nDone = ROAD.filter(r => r.status === 'done').length, nProg = ROAD.filter(r => r.status === 'progress').length;
    const af = alphaFrac(), pct = Math.round(af * 100), cnt = s => ROAD.filter(r => phaseOf(r.status) === s).length;
    const kx = 16.667 + 33.333 * af;
    root.innerHTML = '';

    /* HUD */
    const hud = el('div', 'rd-hud');
    hud.innerHTML =
      '<div class="rd-score"><div class="rd-pct"><b>0</b><i>%</i></div><span></span><small></small></div>' +
      '<div class="rd-track"><div class="rd-line"><i class="rd-fill"></i><span class="rd-kumo">' + pix('egg') + '</span></div><div class="rd-sts"></div></div>';
    hud.querySelector('.rd-score span').textContent = L.score;
    hud.querySelector('.rd-score small').textContent = nDone + ' ' + L.of + ' ' + total + ' ' + L.shipped + ' · ' + nProg + ' ' + L.inprog;
    const fill = hud.querySelector('.rd-fill'), kumo = hud.querySelector('.rd-kumo');
    ['alpha', 'beta', 'release'].forEach((k, i) => {
      const b = el('button', 'rd-st ' + k); b.type = 'button'; b.dataset.f = k === 'alpha' ? 'alpha' : (k === 'beta' ? 'next' : 'later');
      b.innerHTML = '<span class="rd-dot"></span><b></b><small></small>' + (k === 'alpha' ? '<em></em>' : '');
      b.querySelector('b').textContent = L.ph[k]; b.querySelector('small').textContent = L.phd[k] + ' · ' + cnt(k);
      if (k === 'alpha') b.querySelector('em').textContent = L.here;
      b.setAttribute('aria-pressed', S.f === b.dataset.f);
      b.addEventListener('click', () => { S.f = S.f === b.dataset.f ? 'all' : b.dataset.f; roadRender(); tick() });
      hud.querySelector('.rd-sts').appendChild(b);
    });
    root.appendChild(hud);
    const apply = () => { fill.style.width = (kx - 16.667) + '%'; kumo.style.left = kx + '%' };
    fill.style.left = '16.667%'; hud.querySelector('.rd-line').style.setProperty('--kx', kx + '%');
    if (S.seen || REDUCED) { apply(); hud.querySelector('.rd-pct b').textContent = pct; hud.classList.add('in') }
    else { hud.addEventListener('seen', () => { S.seen = true; apply(); countUp(hud.querySelector('.rd-pct b'), pct, 1400) }); watch(hud) }

    /* filter chips */
    const bar = el('div', 'rd-bar'), chips = el('div', 'rd-chips'); chips.setAttribute('role', 'group');
    [['all', L.all, total], ...['done', 'progress', 'next', 'later'].map(s => [s, L.st[s], ROAD.filter(r => r.status === s).length])].forEach(([f, name, n]) => {
      const c = el('button', 'rd-chip', '<i></i><span></span><em></em>'); c.type = 'button'; c.dataset.f = f; c.style.setProperty('--sc', STC[f] || '#fff');
      c.querySelector('span').textContent = name; c.querySelector('em').textContent = n; c.setAttribute('aria-pressed', S.f === f);
      c.addEventListener('click', () => { S.f = f; roadRender(); tick() }); chips.appendChild(c);
    });
    const mine = el('div', 'rd-mine'); mine.innerHTML = '<span data-px-ic>' + pix('heart') + '</span><b></b>'; mine.querySelector('b').textContent = L.mine + ' ' + S.votes.size + ' ' + L.things;
    mine.hidden = !S.votes.size; bar.append(chips, mine); root.appendChild(bar);

    /* tiles */
    const grid = el('div', 'rd-grid'); let k = 0;
    ROAD.forEach((r, idx) => {
      if (!matches(r)) return;
      const b = el('button', 'rd-t st-' + r.status); b.type = 'button'; b.style.setProperty('--sc', STC[r.status]); b.style.setProperty('--i', k++);
      b.innerHTML = '<span class="rd-ic">' + pix(r.icon || 'star') + '</span><span class="rd-pill"></span><span class="rd-lk"></span><b></b><p></p><span class="rd-foot"></span><span class="rd-vote">' + pix('heart') + '</span>';
      b.querySelector('.rd-pill').textContent = L.st[r.status]; b.querySelector('b').textContent = r.title[lg]; b.querySelector('p').textContent = r.text[lg];
      const ft = b.querySelector('.rd-foot');
      if (r.status === 'progress') ft.innerHTML = '<span class="rd-meter"><i style="width:' + pctOf(r) + '%"></i></span><em>' + pctOf(r) + '%</em>';
      else ft.innerHTML = '<em>' + (r.status === 'done' ? '✓ ' : '') + L.open + ' →</em>';
      if (S.votes.has(r.id)) b.classList.add('voted');
      b.addEventListener('click', () => open(idx));
      b.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || REDUCED) return; const q = b.getBoundingClientRect(); b.style.setProperty('--rx', (((e.clientY - q.top) / q.height - .5) * -6).toFixed(2) + 'deg'); b.style.setProperty('--ry', (((e.clientX - q.left) / q.width - .5) * 8).toFixed(2) + 'deg') });
      b.addEventListener('pointerleave', () => { b.style.removeProperty('--rx'); b.style.removeProperty('--ry') });
      grid.appendChild(b);
    });
    root.appendChild(grid);
    const hint = el('p', 'rd-hint'); hint.textContent = L.hint; root.appendChild(hint);
  }

  /* detail dialog */
  let DLG = null;
  function ensureDlg() {
    if (DLG) return DLG;
    DLG = el('dialog', 'rd-dlg');
    DLG.innerHTML = '<div class="rd-d-top"><span class="rd-d-ic"></span><div><span class="rd-pill"></span><h3></h3><small class="rd-d-area"></small></div><button type="button" class="rd-x" aria-label="Close">×</button></div>' +
      '<div class="rd-d-body"><p class="rd-d-text"></p><p class="rd-d-detail"></p><div class="rd-d-prog"></div></div>' +
      '<div class="rd-d-foot"><button type="button" class="rd-nav prev">←</button><button type="button" class="rd-want"></button><button type="button" class="rd-nav next">→</button></div>';
    document.body.appendChild(DLG);
    DLG.querySelector('.rd-x').addEventListener('click', () => DLG.close());
    DLG.addEventListener('click', e => { if (e.target === DLG) DLG.close() });
    DLG.querySelector('.prev').addEventListener('click', () => step(-1)); DLG.querySelector('.next').addEventListener('click', () => step(1));
    DLG.querySelector('.rd-want').addEventListener('click', () => { const r = ROAD[S.sel]; S.votes.has(r.id) ? S.votes.delete(r.id) : S.votes.add(r.id); saveVotes(); fillDlg(); roadRender(); if (!REDUCED && S.votes.has(r.id)) burst() });
    DLG.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1) });
    return DLG;
  }
  function step(d) { const vis = ROAD.map((r, i) => i).filter(i => matches(ROAD[i])); const p = vis.indexOf(S.sel); S.sel = vis[(p + d + vis.length) % vis.length]; fillDlg() }
  function burst() { const b = DLG.querySelector('.rd-want'); for (let i = 0; i < 10; i++) { const s = el('i', 'rd-spark'); s.style.setProperty('--a', (i * 36) + 'deg'); s.style.setProperty('--d', (40 + Math.random() * 30) + 'px'); b.appendChild(s); setTimeout(() => s.remove(), 700) } }
  function fillDlg() {
    const r = ROAD[S.sel], L = t(), lg = lang(); DLG.style.setProperty('--sc', STC[r.status]); DLG.dataset.st = r.status;
    DLG.querySelector('.rd-d-ic').innerHTML = pix(r.icon || 'star'); DLG.querySelector('.rd-pill').textContent = L.st[r.status];
    DLG.querySelector('h3').textContent = r.title[lg]; DLG.querySelector('.rd-d-area').textContent = L.area + ': ' + (r.area ? r.area[lg] : '—');
    DLG.querySelector('.rd-d-text').textContent = r.text[lg]; DLG.querySelector('.rd-d-detail').textContent = r.detail ? r.detail[lg] : '';
    const pr = DLG.querySelector('.rd-d-prog');
    pr.innerHTML = r.status === 'done' ? '<span class="rd-meter full"><i style="width:100%"></i></span><em>✓ ' + L.st.done + '</em>' : r.status === 'progress' ? '<span class="rd-meter"><i style="width:' + pctOf(r) + '%"></i></span><em>' + pctOf(r) + '%</em>' : '<span class="rd-meter"><i style="width:0"></i></span><em>' + L.ph[phaseOf(r.status)] + '</em>';
    const w = DLG.querySelector('.rd-want'), on = S.votes.has(r.id); w.classList.toggle('on', on); w.innerHTML = '<span>' + pix('heart') + '</span><b></b>'; w.querySelector('b').textContent = on ? L.wanted : L.want; w.setAttribute('aria-pressed', on);
    DLG.querySelector('.rd-x').setAttribute('aria-label', L.close); DLG.querySelector('.prev').setAttribute('aria-label', L.prev); DLG.querySelector('.next').setAttribute('aria-label', L.next);
  }
  function open(i) { S.sel = i; ensureDlg(); fillDlg(); if (!DLG.open) DLG.showModal() }
  const tick = () => { };

  /* ================= STUDIO / WHO WE ARE ================= */
  function aboutRender() {
    const root = $('#aboutApp'); if (!root) return; const A = t().ab, L = t();
    const nW = WORLDS.length || 6, nB = BOSSES.length || 0, nP = PATCH.length || 0;
    root.innerHTML = '';
    const head = el('div', 'sec-head'); head.innerHTML = '<p class="eyebrow">' + (lang() === 'en' ? 'Who we are' : 'Кто мы') + '</p><h2>' + A.title + '</h2>'; root.appendChild(head);

    const tape = el('div', 'ab-tape'); const tr = el('div', 'ab-tape-t'); let tx = '';
    for (let k = 0; k < 4; k++) A.tape.forEach(s => { tx += '<span>' + s + '</span><i>' + pix('star') + '</i>' });
    tr.innerHTML = tx; tape.appendChild(tr); tape.setAttribute('aria-hidden', 'true'); root.appendChild(tape);

    const grid = el('div', 'ab-grid');
    /* main card */
    const main = el('article', 'card ab-main');
    main.innerHTML = '<p class="ab-p"></p><p class="ab-p"></p><div class="ab-stats"></div><div class="ab-vals"></div><div class="ab-team"></div>';
    const ps = main.querySelectorAll('.ab-p'); ps[0].textContent = A.p1; ps[1].textContent = A.p2;
    const st = main.querySelector('.ab-stats');
    [[nW, 0], [nB, 1], [nP, 2], [0, 3]].forEach(([n, i]) => {
      const d = el('div', 'ab-stat', '<b>0</b><span></span>'); d.style.setProperty('--sk', ['#8ee04a', '#ff5d8a', '#5cc8ff', '#ffc23c'][i]); d.querySelector('span').textContent = A.stats[i];
      d.addEventListener('seen', () => countUp(d.querySelector('b'), n, 1100)); st.appendChild(d); watch(d);
    });
    const vals = main.querySelector('.ab-vals');
    [['heart', '#ff5d8a'], ['eye', '#5cc8ff'], ['chat', '#ffc23c']].forEach(([ic, col], i) => {
      const c = el('button', 'ab-val'); c.type = 'button'; c.style.setProperty('--vc', col);
      c.innerHTML = '<span class="ab-vi"><span class="ab-front"><span class="ab-ico" style="--acc:' + col + '">' + pix(ic) + '</span><b></b><small></small><em class="ab-flip"></em></span><span class="ab-back"><b></b><small></small></span></span>';
      c.querySelectorAll('b')[0].textContent = A.vals[i][0]; c.querySelector('.ab-front small').textContent = A.vals[i][1]; c.querySelector('.ab-flip').textContent = '↻ ' + A.flip;
      c.querySelectorAll('b')[1].textContent = A.vals[i][0]; c.querySelector('.ab-back small').textContent = A.vals[i][2];
      c.addEventListener('click', () => c.classList.toggle('flip')); c.setAttribute('aria-pressed', 'false');
      c.addEventListener('click', () => c.setAttribute('aria-pressed', c.classList.contains('flip')));
      vals.appendChild(c);
    });
    const team = main.querySelector('.ab-team');
    team.innerHTML = '<span class="ab-tl"></span><div class="ab-av"><i></i><i></i><i></i><i></i><button type="button" class="ab-you"><b>+</b></button></div><small></small>';
    team.querySelector('.ab-tl').textContent = A.team; team.querySelector('.ab-you').title = A.you; team.querySelector('.ab-you').append(document.createTextNode(A.you));
    team.querySelector('.ab-you').addEventListener('click', () => goto('creators')); team.querySelector('small').textContent = A.confirm;
    grid.appendChild(main);

    /* alpha terminal */
    const term = el('aside', 'ab-term');
    term.innerHTML = '<div class="ab-tape2"></div><div class="ab-tbody"><div class="ab-tt"><span class="al-tag"></span><span class="ab-live"><i></i>LIVE</span></div><h3></h3><p></p><div class="ab-log"><small></small><ul></ul></div><div class="ab-way"><span></span><b></b></div><div class="al-meter"><i></i></div><div class="ab-cta"></div></div>';
    term.querySelector('.al-tag').textContent = 'α ' + (PATCH[0] ? PATCH[0].v : '5.4'); term.querySelector('h3').textContent = A.alpha; term.querySelector('p').textContent = A.alphaT;
    term.querySelector('.ab-log small').textContent = A.log;
    const ul = term.querySelector('.ab-log ul'); PATCH.slice(0, 3).forEach(p => { const li = el('li', '', '<em></em><span></span>'); li.querySelector('em').textContent = 'v' + p.v; li.querySelector('span').textContent = p.t; ul.appendChild(li) });
    const pct = Math.round(alphaFrac() * 100); term.querySelector('.ab-way span').textContent = A.way; term.querySelector('.ab-way b').textContent = pct + '%';
    const mi = term.querySelector('.al-meter i'); mi.style.width = '0%'; term.addEventListener('seen', () => { mi.style.width = pct + '%' }); if (REDUCED) mi.style.width = pct + '%';
    const cta = term.querySelector('.ab-cta');
    cta.innerHTML = '<a class="btn btn-play sm" href="play/"><span></span><i>▶</i></a><button type="button" class="ab-ghost"></button>';
    cta.querySelector('a span').textContent = A.play; const gb = cta.querySelector('.ab-ghost'); gb.textContent = A.notes; gb.addEventListener('click', () => goto('news'));
    grid.appendChild(term); watch(term);
    root.appendChild(grid);
  }


  /* ================= UNDER THE HOOD ================= */
  const HT = {
    ru: {
      stats: [[1.47, 'МБ', 'вся игра в одном файле', 'cam', 2], [9900, '+', 'строк игрового кода', 'book'], [140000, '+', 'блоков в мирах', 'wall'], [19, '', 'регионов в 6 мирах', 'map'], [33, '', 'боссов', 'crown'], [12, '', 'видов оружия', 'sword'], [32, '', 'игроков в одной комнате', 'duo'], [0, '', 'установок', 'portal']],
      nodes: [
        { k: 'client', ic: 'cam', n: 'Клиент', s: 'игра · Three.js', d: 'Three.js и свой воксельный движок. Мир разбит на чанки 64×64: видеокарта рисует только то, что рядом. Если устройство слабое, графика снижается сама, чтобы игра шла плавно.', tags: ['Three.js r128', 'чанки 64×64', 'авто-качество', 'один файл'], f: [['Рисуется', 'только ближние чанки'], ['Слабое устройство', 'графика падает сама'], ['Установка', 'не нужна']], v: 'Видимые чанки следуют за камерой' },
        { k: 'room', ic: 'duo', n: 'Комната', s: 'WebSocket · до 32', d: 'Комната по WebSocket до 32 игроков: позиции, чат, удары и PvP. Честный кооп: ведущий боя не меняется на лету, здоровье боссов общее, эффекты зеркалятся у всех.', tags: ['WebSocket', '32 игрока', 'общее здоровье босса', 'зеркальные эффекты'], f: [['Игроков', 'до 32'], ['Ведущий боя', 'не меняется на лету'], ['Здоровье босса', 'общее']], v: 'Игроки заходят в комнату, бой общий' },
        { k: 'server', ic: 'house', n: 'Сервер', s: 'Node.js · REST API', d: 'Свой сервер на Node.js без сторонних зависимостей. Нужен только Node 18+. Он держит комнаты, отдаёт таблицы и каталог карт.', tags: ['Node.js 18+', '0 зависимостей', 'REST', 'WebSocket'], f: [['Зависимости', 'ноль'], ['Запуск', 'node server/server.js'], ['Эндпоинты', '/api/health · scores · maps']], v: 'Живой журнал запросов' },
        { k: 'data', ic: 'trophy', n: 'Данные', s: 'лидерборды · карты', d: 'REST API для лидербордов (забеги, охотники, PvP, достижения, авторы) и карт Мастерской с лайками и звёздами. Сервер хранит всё в своём файле и пишет его атомарно.', tags: ['лидерборды', 'карты Мастерской', 'лайки и звёзды', 'атомарная запись'], f: [['Хранилище', 'один файл'], ['Запись', 'атомарная'], ['Таблицы', 'забеги · охотники · PvP · авторы']], v: 'Таблицы рекордов обновляются' },
        { k: 'content', ic: 'star', n: 'Контент', s: 'музыка · боссы · Кумо', d: 'Музыка собирается из аккордов прямо в игре, фото-режим с фильтрами, русский и английский. 33 босса с фазами, 12 видов оружия с комбо, Кумо с генетикой редкости.', tags: ['музыка из аккордов', 'фото-режим', 'RU + EN', 'генетика Кумо'], f: [['Боссов', '33 с фазами'], ['Оружия', '12 видов с комбо'], ['Музыка', 'из аккордов в игре']], v: 'Музыка собирается из аккордов' },
      ],
      cap: 'Иллюстрация: так работает слой. Нажми на узел схемы.',
    },
    en: {
      stats: [[1.47, 'MB', 'the whole game in one file', 'cam', 2], [9900, '+', 'lines of game code', 'book'], [140000, '+', 'blocks across the worlds', 'wall'], [19, '', 'regions in 6 worlds', 'map'], [33, '', 'bosses', 'crown'], [12, '', 'weapon types', 'sword'], [32, '', 'players in one room', 'duo'], [0, '', 'installs', 'portal']],
      nodes: [
        { k: 'client', ic: 'cam', n: 'Client', s: 'game · Three.js', d: 'Three.js and a custom voxel engine. The world is split into 64×64 chunks so the GPU only draws what is near. On weak devices the graphics drop automatically to keep it smooth.', tags: ['Three.js r128', '64×64 chunks', 'auto quality', 'one file'], f: [['Drawn', 'only nearby chunks'], ['Weak device', 'graphics drop by themselves'], ['Install', 'none']], v: 'Visible chunks follow the camera' },
        { k: 'room', ic: 'duo', n: 'Room', s: 'WebSocket · up to 32', d: 'A WebSocket room for up to 32 players: positions, chat, hits and PvP. Honest co-op: the fight leader stays put, boss health is shared, effects are mirrored for everyone.', tags: ['WebSocket', '32 players', 'shared boss health', 'mirrored effects'], f: [['Players', 'up to 32'], ['Fight leader', 'never switches mid-fight'], ['Boss health', 'shared']], v: 'Players join a room, the fight is shared' },
        { k: 'server', ic: 'house', n: 'Server', s: 'Node.js · REST API', d: 'Its own Node.js server with no third-party dependencies. Only Node 18+ is required. It hosts the rooms and serves the boards and the map catalogue.', tags: ['Node.js 18+', '0 dependencies', 'REST', 'WebSocket'], f: [['Dependencies', 'zero'], ['Start', 'node server/server.js'], ['Endpoints', '/api/health · scores · maps']], v: 'A live request log' },
        { k: 'data', ic: 'trophy', n: 'Data', s: 'boards · maps', d: 'A REST API for leaderboards (races, hunters, PvP, achievements, authors) and Workshop maps with likes and stars. The server keeps everything in its own file and writes it atomically.', tags: ['leaderboards', 'Workshop maps', 'likes and stars', 'atomic writes'], f: [['Storage', 'one file'], ['Writes', 'atomic'], ['Boards', 'races · hunters · PvP · authors']], v: 'Leaderboards update' },
        { k: 'content', ic: 'star', n: 'Content', s: 'music · bosses · Kumo', d: 'Music is generated from chords in the game, a photo mode with filters, Russian and English. 33 bosses with phases, 12 weapons with combos, Kumo with rarity genetics.', tags: ['music from chords', 'photo mode', 'RU + EN', 'Kumo genetics'], f: [['Bosses', '33 with phases'], ['Weapons', '12 types with combos'], ['Music', 'built from chords in game']], v: 'Music is built from chords' },
      ],
      cap: 'Illustration of how the layer works. Click a node of the diagram.',
    },
  };
  const HS = { i: 0, timer: null, auto: null, user: false, vis: false };
  const clearHV = () => { clearInterval(HS.timer); HS.timer = null };
  const fmtN = (n, dec) => dec ? n.toFixed(dec).replace('.', lang() === 'ru' ? ',' : '.') : Math.round(n).toLocaleString(lang() === 'ru' ? 'ru-RU' : 'en-US').replace(/ /g, ' ');

  function hoodVisual(k, box, label) {
    clearHV(); box.innerHTML = ''; const cap = el('small', 'hd-vl'); cap.textContent = label;
    const stage = el('div', 'hd-v hv-' + k); box.append(stage, cap);
    if (k === 'client') {
      const C = 12, R = 7, cells = []; stage.style.setProperty('--c', C);
      for (let i = 0; i < C * R; i++) { const c = el('i'); stage.appendChild(c); cells.push(c) }
      let px = 2, py = 3, dx = 1;
      const draw = () => { cells.forEach((c, i) => { const x = i % C, y = (i / C) | 0, d = Math.abs(x - px) + Math.abs(y - py); c.className = d <= 1 ? 'hot' : d <= 3 ? 'lit' : '' }) };
      draw(); if (!REDUCED) HS.timer = setInterval(() => { px += dx; if (px >= C - 3 || px <= 2) dx = -dx; py = 3 + Math.round(Math.sin(px) * 1.4); draw() }, 520);
    } else if (k === 'room') {
      const dots = []; const grid = el('div', 'hv-dots'); for (let i = 0; i < 32; i++) { const d = el('i'); grid.appendChild(d); dots.push(d) }
      const hp = el('div', 'hv-hp', '<span></span><em></em>'), cnt = el('b', 'hv-n');
      stage.append(grid, hp, cnt); let n = 2, hpv = 100;
      const draw = () => { dots.forEach((d, i) => { d.className = i < n ? 'on' + (i === 0 ? ' lead' : '') : '' }); hp.firstChild.style.width = hpv + '%'; hp.lastChild.textContent = (lang() === 'en' ? 'boss HP' : 'HP босса') + ' ' + hpv + '%'; cnt.textContent = n + ' / 32' };
      draw(); if (!REDUCED) HS.timer = setInterval(() => { n = n >= 32 ? 2 : n + 3; hpv = hpv <= 8 ? 100 : hpv - 9; draw() }, 600);
    } else if (k === 'server') {
      const lines = ['GET  /api/health          200', 'WS   room join            101', 'GET  /api/scores?board=race-0  200', 'POST /api/scores           200', 'GET  /api/maps?sort=popular    200', 'WS   boss hp sync          ok', 'FILE data.json  atomic write  ok'];
      const log = el('div', 'hv-log'); stage.appendChild(log); let i = 0;
      const add = () => { const l = el('div', 'hv-line'); l.textContent = '> ' + lines[i++ % lines.length]; log.appendChild(l); while (log.children.length > 7) log.firstChild.remove() };
      add(); add(); add(); if (!REDUCED) HS.timer = setInterval(add, 700);
    } else if (k === 'data') {
      const names = lang() === 'en' ? ['races', 'hunters', 'PvP', 'achievements', 'authors'] : ['забеги', 'охотники', 'PvP', 'достижения', 'авторы'];
      const rows = names.map(nm => { const row = el('div', 'hv-row', '<span></span><i><u></u></i>'); row.firstChild.textContent = nm; stage.appendChild(row); return row.querySelector('u') });
      let tt = 0; const draw = () => { rows.forEach((u, r) => { u.style.width = (35 + 60 * Math.abs(Math.sin(tt * .7 + r * 1.3))).toFixed(0) + '%' }) };
      draw(); if (!REDUCED) HS.timer = setInterval(() => { tt++; draw() }, 900);
    } else {
      const eq = el('div', 'hv-eq'); for (let i = 0; i < 18; i++) { const b = el('i'); b.style.setProperty('--d', (i * 83 % 700) + 'ms'); b.style.setProperty('--h', (30 + (i * 37 % 60)) + '%'); eq.appendChild(b) }
      const ch = el('div', 'hv-ch'); ['Am', 'F', 'C', 'G'].forEach(c => ch.appendChild(el('span', '', c))); stage.append(eq, ch); let q = 0; const draw = () => { [...ch.children].forEach((s, i) => s.classList.toggle('on', i === q)) };
      draw(); if (!REDUCED) HS.timer = setInterval(() => { q = (q + 1) % 4; draw() }, 900);
    }
  }

  function hoodRender() {
    const root = $('#hoodApp'); if (!root) return; const H = HT[lang()]; clearHV(); clearInterval(HS.auto); root.innerHTML = '';
    const stats = el('div', 'hd-stats');
    H.stats.forEach(([n, suf, lab, ic, dec], i) => {
      const d = el('div', 'hd-stat', '<span class="hd-si"></span><b><em>0</em><u></u></b><small></small>'); d.style.setProperty('--i', i);
      d.querySelector('.hd-si').innerHTML = pix(ic); d.querySelector('u').textContent = suf; d.querySelector('small').textContent = lab;
      const out = d.querySelector('em'); d.addEventListener('seen', () => { if (REDUCED || !n) { out.textContent = fmtN(n, dec); return } const t0 = performance.now(); (function f(now) { const k = Math.min(1, (now - t0) / 1300), e = 1 - Math.pow(1 - k, 3); out.textContent = fmtN(n * e, dec); if (k < 1) requestAnimationFrame(f) })(t0) });
      stats.appendChild(d); watch(d);
    });
    root.appendChild(stats);

    const rail = el('div', 'hd-rail'); rail.setAttribute('role', 'tablist');
    H.nodes.forEach((nd, i) => {
      if (i) rail.appendChild(el('i', 'hd-link', '<em></em>'));
      const b = el('button', 'hd-node'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', i === HS.i);
      b.innerHTML = '<span class="hd-ni"></span><b></b><small></small>'; b.querySelector('.hd-ni').innerHTML = pix(nd.ic); b.querySelector('b').textContent = nd.n; b.querySelector('small').textContent = nd.s;
      b.addEventListener('click', () => { HS.user = true; sel(i) }); rail.appendChild(b);
    });
    root.appendChild(rail);
    const panel = el('div', 'hd-panel'); panel.innerHTML = '<div class="hd-info"><span class="hd-pn"></span><h3></h3><p></p><div class="hd-tags"></div><dl class="hd-f"></dl></div><div class="hd-vbox"></div>';
    root.appendChild(panel);
    const note = el('p', 'hd-note'); note.textContent = H.cap; root.appendChild(note);

    function sel(i) {
      HS.i = i; const nd = H.nodes[i];
      qa('.hd-node', rail).forEach((b, k) => b.setAttribute('aria-selected', k === i));
      qa('.hd-link', rail).forEach((l, k) => l.classList.toggle('act', k < i));
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      panel.querySelector('.hd-pn').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(H.nodes.length).padStart(2, '0');
      panel.querySelector('h3').textContent = nd.n; panel.querySelector('p').textContent = nd.d;
      const tg = panel.querySelector('.hd-tags'); tg.innerHTML = ''; nd.tags.forEach(x => { const s = el('span'); s.textContent = x; tg.appendChild(s) });
      const dl = panel.querySelector('.hd-f'); dl.innerHTML = ''; nd.f.forEach(([a, b]) => { const r = el('div', '', '<dt></dt><dd></dd>'); r.querySelector('dt').textContent = a; r.querySelector('dd').textContent = b; dl.appendChild(r) });
      hoodVisual(nd.k, panel.querySelector('.hd-vbox'), nd.v);
    }
    sel(HS.i);
    if (!REDUCED) HS.auto = setInterval(() => { if (!HS.user && HS.vis) sel((HS.i + 1) % H.nodes.length) }, 7000);
    new IntersectionObserver(es => es.forEach(e => { HS.vis = e.isIntersecting }), { threshold: 0.3 }).observe(root);
  }

  /* ---------- boot ---------- */
  function renderAll() { roadRender(); aboutRender(); hoodRender(); [['docsBtn', 'Docs'], ['footDocs', 'Documentation']].forEach(([i, en]) => { const n = document.getElementById(i); if (!n) return; const ru = 'Документация'; n.querySelector('.db-t').textContent = lang() === 'en' ? en : ru; n.title = lang() === 'en' ? 'Documentation' : ru; n.setAttribute('aria-label', n.title); n.querySelector('.db-ic').innerHTML = pix('book') }) }
  (async function boot() {
    const [r, p, w, b] = await Promise.all([get('landing/data/roadmap.json'), get('landing/data/patches.json'), get('landing/data/worlds-all.json'), get('landing/data/bosses.json')]);
    ROAD = Array.isArray(r) ? r : []; PATCH = Array.isArray(p) ? p : [];
    WORLDS = Array.isArray(w) ? w : (w && w.worlds) || []; BOSSES = (b && b.bosses) || [];
    renderAll();
    new MutationObserver(() => renderAll()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  })();
})();
