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

  /* ---------- boot ---------- */
  function renderAll() { roadRender(); aboutRender() }
  (async function boot() {
    const [r, p, w, b] = await Promise.all([get('landing/data/roadmap.json'), get('landing/data/patches.json'), get('landing/data/worlds-all.json'), get('landing/data/bosses.json')]);
    ROAD = Array.isArray(r) ? r : []; PATCH = Array.isArray(p) ? p : [];
    WORLDS = Array.isArray(w) ? w : (w && w.worlds) || []; BOSSES = (b && b.bosses) || [];
    renderAll();
    new MutationObserver(() => renderAll()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  })();
})();
