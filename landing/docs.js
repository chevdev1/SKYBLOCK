/* Hop to Olympus: documentation page. Bilingual (RU/EN), data-driven, with search, scroll-spy and lightbox. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s), qa = (s, r) => [...(r || document).querySelectorAll(s)];
  const get = async u => { try { const r = await fetch(u); return r.ok ? await r.json() : null } catch (e) { return null } };
  let LANG = 'ru'; try { LANG = (localStorage.getItem('hto-lang') || (navigator.language || 'ru').slice(0, 2)) === 'en' ? 'en' : 'ru' } catch (e) { }
  const T = (ru, en) => (LANG === 'en' ? en : ru);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[\[([^\]]+)\]\]/g, '<kbd class="k">$1</kbd>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="x" href="$2">$1</a>');
  const P = t => '<p>' + md(t) + '</p>', UL = a => '<ul>' + a.map(x => '<li>' + md(x) + '</li>').join('') + '</ul>';
  const OL = a => '<ol class="steps">' + a.map(x => '<li>' + md(x) + '</li>').join('') + '</ol>';
  let hid = 0; const H3 = t => { const id = 'h' + (++hid); return '<h3 id="' + id + '">' + md(t) + '<a class="anc" href="#' + id + '" aria-label="link">#</a></h3>' };
  const CO = (k, t) => '<div class="co ' + k + '"><b>' + (k === 'warn' ? '!' : k === 'alpha' ? 'α' : 'i') + '</b><div>' + md(t) + '</div></div>';
  const TB = (head, rows) => '<div class="tw"><table><thead><tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + md(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const CB = (title, code) => '<div class="cb"><header><span>' + esc(title) + '</span><button type="button" data-copy>' + T('Копировать', 'Copy') + '</button></header><pre>' + esc(code) + '</pre></div>';
  const BIG = a => '<div class="big">' + a.map(([n, l, c]) => '<div style="--bc:' + c + '"><b>' + n + '</b><span>' + esc(l) + '</span></div>').join('') + '</div>';

  const UI = {
    ru: { doc: 'Документация', ph: 'Поиск по документации', back: 'На сайт', play: 'Играть', menu: 'Меню', none: 'Ничего не найдено. Попробуй другое слово.', title: 'Документация — Hop to Olympus', all: 'Все', foot: 'Документация живая: она растёт вместе с игрой. Версия альфы', toTop: 'Наверх' },
    en: { doc: 'Documentation', ph: 'Search the documentation', back: 'Back to site', play: 'Play', menu: 'Menu', none: 'Nothing found. Try another word.', title: 'Documentation — Hop to Olympus', all: 'All', foot: 'The documentation is alive: it grows with the game. Alpha version', toTop: 'Back to top' },
  };
  const GROUPS = { start: ['Начало', 'Getting started'], play: ['Геймплей', 'Gameplay'], world: ['Мир', 'The world'], sys: ['Системы', 'Systems'], news: ['Проект', 'Project'], dev: ['Разработчикам', 'Developers'], help: ['Помощь', 'Help'] };
  const D = {}; // loaded data

  /* ---------------- sections ---------------- */
  const SECS = [
    { id: 'overview', g: 'start', t: ['Обзор', 'Overview'], lead: ['Что такое Hop to Olympus и с чего начать чтение.', 'What Hop to Olympus is and where to start reading.'],
      html: () => P(T('**Hop to Olympus** (рус. «Прыг на Олимп») — воксельная экшн-RPG и платформер. Игра открывается в браузере по ссылке и работает на компьютере, планшете и телефоне. Ты поднимаешься по небесным островам к Олимпу, в Разлом Хаоса, под Звёздный купол, в Бездну Эреба и в неоновый Хорай, сражаешься с богами и титанами, куёшь снаряжение, строишь свой остров и растишь питомцев Кумо.', '**Hop to Olympus** is a voxel action RPG and platformer. It opens in the browser from a link and runs on desktop, tablet and phone. You climb floating isles to Olympus, the Chaos Rift, the Star Dome, the Abyss of Erebus and neon Horai, fight gods and titans, forge gear, build your own island and raise Kumo pets.')) +
        BIG([['33', T('босса', 'bosses'), '#ff5d8a'], ['12', T('видов оружия', 'weapon types'), '#ffc23c'], ['6', T('миров', 'worlds'), '#8ee04a'], ['32', T('игрока в комнате', 'players per room'), '#5cc8ff']]) +
        CO('alpha', T('**Открытый альфа-тест.** Мы ценим мнение комьюнити и строим игру вместе с вами: делитесь идеями и багами в чате комьюнити. Возможны баги и изменения баланса, а документация обновляется вместе с игрой.', '**Open alpha test.** We value community feedback and build the game together with you: share ideas and bugs in the community chat. Expect bugs and balance changes; this documentation is updated with the game.')) +
        H3(T('Как читать документацию', 'How to read this documentation')) + UL([T('Слева содержание, вверху поиск: нажми [[/]] и начни печатать.', 'The contents are on the left, search is at the top: press [[/]] and start typing.'), T('Разделы «Механики», «Техники», «Режимы», «Миры», «Боссы» и «Арсенал» собираются из тех же данных, что и сайт, поэтому всегда совпадают с ним.', 'The Mechanics, Techniques, Modes, Worlds, Bosses and Arsenal sections are built from the same data as the site, so they always match it.'), T('Раздел «Разработчикам» для тех, кто запускает сервер, выкладывает игру или пишет клиент.', 'The Developers section is for those who run the server, deploy the game or write a client.')]) +
        H3(T('Экраны игры', 'Game screens')) + '<div class="gal" id="gal"></div>',
      after: () => { const g = $('#gal'); (D.ui || []).forEach(u => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<img loading="lazy" alt=""><span></span>'; b.querySelector('img').src = u.img; b.querySelector('span').textContent = u.title[LANG]; b.addEventListener('click', () => lightbox(u.img, u.title[LANG] + '. ' + u.text[LANG])); g.appendChild(b) }) } },

    { id: 'quickstart', g: 'start', t: ['Быстрый старт', 'Quick start'], lead: ['От нажатия «Играть» до первого босса.', 'From pressing Play to your first boss.'],
      html: () => OL([T('Открой [игру](play/) в браузере. Ничего устанавливать не нужно.', 'Open the [game](play/) in your browser. Nothing to install.'), T('Двигайся клавишами [[W]] [[A]] [[S]] [[D]], прыгай на [[Пробел]], бей левой кнопкой мыши. На телефоне используй плавающий джойстик и экранные кнопки.', 'Move with [[W]] [[A]] [[S]] [[D]], jump with [[Space]], attack with the left mouse button. On a phone use the floating joystick and on-screen buttons.'), T('Прыгай по островам вверх. Чем точнее ритм прыжков, тем выше ты летишь: пятый прыжок серии даёт мега-прыжок.', 'Jump up the isles. The better your jump rhythm, the higher you fly: the fifth jump in a streak is a mega jump.'), T('Бей мобов, собирай добычу и открывай крафт на [[C]]: меч, коса, броня, сапоги, крылья.', 'Fight mobs, collect loot and open crafting with [[C]]: sword, scythe, armour, boots, wings.'), T('Находи флажки-чекпоинты: они сохраняют прогресс и дают телепорт между ярусами. Карта мира открывается на [[N]].', 'Find checkpoint flags: they save your progress and give teleports between tiers. The world map opens with [[N]].'), T('Готов к боссу? Проверь здоровье, оружие и крылья. У каждого босса свои фазы, подсказки есть в разделе [Боссы](#bosses).', 'Ready for a boss? Check your health, weapon and wings. Every boss has phases; hints are in the [Bosses](#bosses) section.')]) +
        CO('', T('Хочешь играть вдвоём? Зайдите на один сервер, и вы в одном мире. Подробнее в разделе [Кооп и PvP](#coop).', 'Want to play together? Join the same server and you are in the same world. More in [Co-op and PvP](#coop).')) },

    { id: 'controls', g: 'start', t: ['Управление', 'Controls'], lead: ['Клавиатура, мышь, геймпад и сенсорный экран.', 'Keyboard, mouse, gamepad and touch.'],
      html: () => TB([T('Клавиша', 'Key'), T('Действие', 'Action')], [
        ['[[W]][[A]][[S]][[D]]', T('бег (работает на любой раскладке)', 'run (works on any keyboard layout)')],
        ['[[Space]]', T('прыжок, в воздухе полёт на крыльях', 'jump; hold in the air to fly with wings')],
        ['[[Shift]]', T('рывок: короткая неуязвимость', 'dash: brief invulnerability')],
        [T('ЛКМ / ПКМ', 'LMB / RMB'), T('удар и копание / поставить блок', 'attack and dig / place a block')],
        ['[[1]]–[[9]], [[Q]], [[I]]', T('быстрые ячейки, выбросить, сумка (36 ячеек)', 'hotbar, drop, bag (36 slots)')],
        ['[[E]]', T('крюк-кошка', 'grappling hook')], ['[[Z]]', T('сменить оружие', 'switch weapon')],
        ['[[F]]', T('поговорить с NPC; способность Кумо рядом', 'talk to an NPC; a nearby Kumo ability')],
        ['[[P]]', T('PvP вкл/выкл', 'PvP on/off')], ['[[C]]', T('крафт', 'crafting')],
        ['[[G]] [[H]] [[J]] [[K]] [[L]]', T('эмоции', 'emotes')], ['[[Enter]]', T('чат', 'chat')],
        ['[[B]]', T('редактор карты', 'map editor')], ['[[N]]', T('карта мира', 'world map')],
        ['[[T]]', T('достижения и рекорды', 'achievements and records')], ['[[O]]', T('настройки', 'settings')], [T('Стрелки', 'Arrows'), T('управлять виспом (питомцем)', 'steer your wisp (pet)')],
      ]) + H3(T('Геймпад', 'Gamepad')) + P(T('С версии 5.4 поддерживаются геймпады со стандартной раскладкой: Xbox, PlayStation, Switch Pro и большинство USB- и Bluetooth-моделей. При подключении появляется подсказка с раскладкой. Пока открыто окно или диалог, стики не двигают героя.', 'Since version 5.4 gamepads with the standard layout are supported: Xbox, PlayStation, Switch Pro and most USB and Bluetooth models. A layout hint appears when you connect one. While a window or dialog is open, the sticks do not move the hero.')) +
        H3(T('Телефон и планшет', 'Phone and tablet')) + P(T('Включается сенсорное управление: плавающий джойстик, кнопки прыжка, удара, рывка и крюка, щипок для приближения камеры.', 'Touch controls switch on automatically: a floating joystick, buttons for jump, attack, dash and hook, and pinch to zoom the camera.')) },

    { id: 'mechanics', g: 'play', t: ['Механики', 'Mechanics'], lead: ['Шесть главных механик игры.', 'The six core mechanics of the game.'], html: () => '<div id="mech"></div>',
      after: () => { const r = $('#mech'); (D.mech || []).forEach(m => { const d = document.createElement('div'); d.innerHTML = H3(m.title[LANG]) + P(m.text[LANG]) + (m.stats ? '<div class="cd" style="box-shadow:none;border-style:dashed"><div class="st">' + m.stats.map(s => '<b>' + esc(s.n) + '<small>' + esc(s[LANG] || (s.l && s.l[LANG]) || '') + '</small></b>').join('') + '</div></div>' : '') + UL((m.list || []).map(x => x[LANG])); r.append(...d.childNodes) }) } },

    { id: 'techniques', g: 'play', t: ['Техники', 'Techniques'], lead: ['Движение здесь тоже оружие: ритм, рывки, стены, крюк и крылья.', 'Movement is a weapon too: rhythm, dashes, walls, hook and wings.'], html: () => '<div class="cards" id="tech"></div>',
      after: () => { const r = $('#tech'); const cc = ['#ffc23c', '#5cc8ff', '#8ee04a', '#ff5d8a', '#c48aff', '#ffc23c', '#ff5d8a', '#5cc8ff']; (D.tech || []).forEach((x, i) => { const c = document.createElement('div'); c.className = 'cd'; c.style.setProperty('--cc', cc[i % cc.length]); c.innerHTML = '<h4></h4><p></p>'; c.querySelector('h4').textContent = x.title[LANG]; c.querySelector('p').textContent = x.text[LANG]; r.appendChild(c) }) } },

    { id: 'modes', g: 'play', t: ['Режимы', 'Modes'], lead: ['Во что поиграть сегодня.', 'What to play today.'], html: () => '<div class="cards" id="modes"></div>',
      after: () => { const r = $('#modes'); const cc = ['#ff5d8a', '#5cc8ff', '#ffc23c', '#8ee04a', '#c48aff']; (D.modes || []).forEach((x, i) => { const c = document.createElement('div'); c.className = 'cd'; c.style.setProperty('--cc', x.color || cc[i % cc.length]); c.innerHTML = '<span class="kk"></span><h4></h4><p></p>'; c.querySelector('.kk').textContent = x.tag[LANG]; c.querySelector('h4').textContent = x.title[LANG]; c.querySelector('p').textContent = x.text[LANG]; r.appendChild(c) }) } },

    { id: 'worlds', g: 'world', t: ['Миры', 'Worlds'], lead: ['Шесть миров, одна вертикаль.', 'Six worlds, one vertical.'], html: () => '<div id="worlds"></div>',
      after: () => { const r = $('#worlds'); (D.worlds || []).forEach(w => { const d = document.createElement('div'); d.innerHTML = H3(w.name[LANG]) + '<p><strong>' + esc(w.biome[LANG]) + '.</strong> ' + esc(w.desc[LANG]) + '</p>' + UL(w.features ? w.features[LANG] : []); const h = d.querySelector('h3'); h.style.borderLeft = '10px solid ' + (w.color || '#ffc23c'); h.style.paddingLeft = '12px'; r.append(...d.childNodes) }) } },

    { id: 'bosses', g: 'world', t: ['Боссы', 'Bosses'], lead: ['33 босса с фазами, аренами и легендарной добычей.', '33 bosses with phases, arenas and legendary loot.'], html: () => '<div class="chips" id="bsActs"></div><div class="bs" id="bs"></div>',
      after: () => { const B = D.bosses; if (!B) return; const acts = $('#bsActs'), grid = $('#bs'); let act = 0;
        const draw = () => { grid.innerHTML = ''; qa('.chip', acts).forEach(c => c.setAttribute('aria-pressed', +c.dataset.a === act)); B.bosses.filter(b => !act || b.act === act).forEach(b => { const a = B.acts.find(x => x.id === b.act) || {}; const c = document.createElement('div'); c.className = 'cd'; c.style.setProperty('--cc', a.c || '#ffc23c'); c.innerHTML = '<div class="pic"><b></b></div><div class="bd"><span class="ar"></span><h4></h4><p></p></div>'; c.querySelector('.pic b').textContent = b[LANG][0]; if (b.img) { const im = document.createElement('img'); im.loading = 'lazy'; im.alt = ''; im.src = 'landing/img/bosses/' + b.img + '.jpg'; im.onerror = () => im.remove(); c.querySelector('.pic').appendChild(im) } c.querySelector('.ar').textContent = b.ar ? b.ar[LANG] : ''; c.querySelector('h4').textContent = b[LANG]; c.querySelector('p').textContent = b.d[LANG]; grid.appendChild(c) }); indexBuild() };
        const mk = (id, label, col) => { const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.dataset.a = id; c.style.setProperty('--cc', col || '#fff'); c.innerHTML = '<i></i><span></span>'; c.querySelector('span').textContent = label; c.addEventListener('click', () => { act = id; draw() }); acts.appendChild(c) };
        mk(0, UI[LANG].all + ' · ' + B.bosses.length, '#fff'); B.acts.forEach(a => mk(a.id, a[LANG], a.c)); draw() } },

    { id: 'arsenal', g: 'world', t: ['Арсенал', 'Arsenal'], lead: ['Оружие, броня, крылья и реликвии: как получить и что умеют.', 'Weapons, armour, wings and relics: how to get them and what they do.'], html: () => '<div class="chips" id="arCats"></div><div class="cards" id="ar"></div>',
      after: () => { const A = D.ars; if (!A) return; const cats = $('#arCats'), grid = $('#ar'); let cat = '';
        const draw = () => { grid.innerHTML = ''; qa('.chip', cats).forEach(c => c.setAttribute('aria-pressed', c.dataset.c === cat)); A.items.filter(i => !cat || i.cat === cat).forEach(i => { const c = document.createElement('div'); c.className = 'cd'; c.style.setProperty('--cc', i.c || '#ffc23c'); c.innerHTML = '<h4></h4><p></p><p class="how"></p><div class="tg"></div>'; c.querySelector('h4').textContent = i[LANG]; c.querySelector('p').textContent = i.d[LANG]; const hw = c.querySelector('.how'); hw.style.marginTop = '8px'; hw.style.fontWeight = '900'; hw.textContent = (i.how ? (T('Где взять: ', 'Where: ') + i.how[LANG]) : ''); if (!i.how) hw.remove(); const tg = c.querySelector('.tg'); ((i.tags && i.tags[LANG]) || []).forEach(t => { const s = document.createElement('span'); s.textContent = t; tg.appendChild(s) }); if (!tg.children.length) tg.remove(); grid.appendChild(c) }); indexBuild() };
        const mk = (id, label, col) => { const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.dataset.c = id; c.style.setProperty('--cc', col || '#fff'); c.innerHTML = '<i></i><span></span>'; c.querySelector('span').textContent = label; c.addEventListener('click', () => { cat = id; draw() }); cats.appendChild(c) };
        mk('', UI[LANG].all + ' · ' + A.items.length, '#fff'); A.cats.forEach((c, k) => mk(c.id, c[LANG], ['#9fd8ff', '#8ee04a', '#ffc23c', '#ff5d8a', '#c48aff'][k % 5])); draw() } },

    { id: 'kumo', g: 'sys', t: ['Кумо', 'Kumo'], lead: ['Облачные питомцы: яйца, забота, семья и походы.', 'Cloud pets: eggs, care, families and adventures.'],
      html: () => P(T('Кумо вылупляются из яиц в Облачном саду, эволюционируют, растут и ходят с игроком в походы. Открой карточку Кумо: слева живой 3D-портрет на облачном подиуме, справа вкладки «Обзор», «Кормить» и «Семья», внизу большие кнопки заботы.', 'Kumo hatch from eggs in the Cloud Garden, evolve, grow and join the player on adventures. Open a Kumo card: a live 3D portrait on a cloud podium on the left, the Overview, Feed and Family tabs on the right, and big care buttons at the bottom.')) +
        H3(T('Редкость', 'Rarity')) + UL([T('Сверхредкий Кумо выпадает с шансом **1%** при каждом вылуплении, в том числе после кокона перерождения.', 'An ultra-rare Kumo hatches with a **1%** chance every time, including after a rebirth cocoon.'), T('У каждого сверхредкого уникальный номер, он не повторяется.', 'Every ultra-rare has a unique number that is never repeated.'), T('Внешний вид: кислотный неоновый градиент снизу вверх (у каждой формы свой) и радужное свечение.', 'Look: an acid neon gradient from bottom to top (each form has its own) and a rainbow glow.')]) +
        H3(T('Забота', 'Care')) + TB([T('Параметр', 'Parameter'), T('Значение', 'Value')], [[T('Сытость', 'Fullness'), T('падает на 4% в час', 'drops 4% per hour')], [T('Настроение', 'Mood'), T('падает на 5% в час', 'drops 5% per hour')], [T('Искорка', 'Spark'), T('+25% сытости', '+25% fullness')], [T('Фрукт', 'Fruit'), T('+15% сытости', '+15% fullness')], [T('Погладить', 'Pet'), T('+20% настроения', '+20% mood')], [T('Подбросить', 'Toss'), T('+15% настроения', '+15% mood')]]) +
        CO('', T('Кумо **не умирают**. Голодный или скучающий Кумо просто грустит.', 'Kumo **never die**. A hungry or bored Kumo just gets sad.')) +
        H3(T('Семья', 'Family')) + P(T('Два взрослых Кумо с настроением от 50% и сытостью от 40% приносят яйцо раз в сутки. Малыш получает фирменные детали родителей.', 'Two adult Kumo with mood from 50% and fullness from 40% bring an egg once a day. The baby inherits signature details from its parents.')) +
        H3(T('Поход', 'Adventure')) + P(T('Любого вылупившегося Кумо можно взять с собой кнопкой «В поход». Он ходит рядом во всех мирах, а [[F]] рядом с ним открывает способность:', 'Any hatched Kumo can join you with the “Adventure” button. It walks beside you in every world, and [[F]] next to it triggers an ability:')) +
        UL([T('листопад: урон по области', 'leaf fall: area damage'), T('цепная молния: перескакивает на соседних мобов', 'chain lightning: jumps to nearby mobs'), T('теневой шар', 'shadow orb'), T('лисьи огоньки: два самонаводящихся', 'fox lights: two homing'), T('звездопад: три звезды с неба', 'starfall: three stars from the sky'), T('радужный луч: пробивает насквозь', 'rainbow beam: pierces through')]) +
        CO('', T('По врагам Хорая урон Кумо в **5 раз выше**.', 'Against Horai enemies Kumo damage is **5× higher**.')) +
        CO('warn', T('**Маркетплейс Кумо** (обмен между игроками) пока в планах, сроки уточняются. Смотри [Роадмап](#roadmap).', 'The **Kumo marketplace** (trading between players) is still planned and timing is being confirmed. See the [Roadmap](#roadmap).')) },

    { id: 'coop', g: 'sys', t: ['Кооп и PvP', 'Co-op and PvP'], lead: ['Онлайн-комнаты до 32 игроков, общие бои и дуэли.', 'Online rooms of up to 32 players, shared fights and duels.'],
      html: () => P(T('Игроки заходят на один сервер и оказываются в одном мире. Чат, видимость других игроков и PvP работают через комнату по WebSocket.', 'Players join the same server and share one world. Chat, seeing other players and PvP run through a WebSocket room.')) +
        H3(T('Честный кооп', 'Honest co-op')) + UL([T('Монстры и боссы **общие**: один игрок ведёт бой, остальные видят то же самое.', 'Mobs and bosses are **shared**: one player leads the fight and everyone sees the same thing.'), T('К бою можно присоединиться в любой момент, смерть не откатывает бой, удары не теряются.', 'You can join a fight at any moment, death does not roll the fight back, hits are never dropped.'), T('Здоровье босса общее, подписи, звуки, туман и клоны зеркалятся у всех.', 'Boss health is shared; captions, sounds, mist and clones are mirrored for everyone.'), T('Добыча и опыт достаются всем участникам.', 'Loot and XP go to every participant.')]) +
        H3('PvP') + P(T('Включается клавишей [[P]] в любом мире, ведётся таблица побед. На Ярмарке есть Пух-бокс: в надувных перчатках, лучший из трёх раундов, побеждает тот, кто вытолкнет соперника с ринга.', 'Toggle it with [[P]] in any world; a win board is kept. The Fair has Puffy Boxing: inflatable gloves, best of three rounds, and you win by pushing your rival out of the ring.')) +
        H3(T('Для двоих', 'For two')) + P(T('Восемь режимов: объятия, «дай пять», прогулки за руку, Пух-бокс, «Пол — это лава», «Погоня за курицей» и другие.', 'Eight modes: hugs, high-fives, hand-in-hand walks, Puffy Boxing, The Floor Is Lava, Hen Chase and more.')) +
        CO('warn', T('**Общий дом** (друг видит твой остров, ферму и Кумо) в работе. Смотри [Роадмап](#roadmap).', 'The **shared home** (a friend sees your island, farm and Kumo) is in progress. See the [Roadmap](#roadmap).')) +
        CO('', T('Без сервера игра работает в одиночном режиме. Как запустить свой сервер: [Запуск и деплой](#deploy).', 'Without a server the game runs in single-player. How to run your own server: [Run and deploy](#deploy).')) },

    { id: 'workshop', g: 'sys', t: ['Мастерская', 'Workshop'], lead: ['Строй свои карты, публикуй, собирай лайки и звёзды.', 'Build your own maps, publish them, collect likes and stars.'],
      html: () => P(T('Карты игроков строятся в отдельной области неба. Основной мир сохраняется и возвращается после выхода из Мастерской.', 'Player maps are built in a separate area of the sky. Your main world is saved and restored when you leave the Workshop.')) +
        OL([T('Открой редактор клавишей [[B]] и построй карту: старт, финиш, чекпоинты, заливка.', 'Open the editor with [[B]] and build a map: start, finish, checkpoints, fill.'), T('Пройди свою карту сам: без теста публикация не доступна.', 'Beat your own map first: publishing is locked until it passes the test.'), T('Опубликуй карту. Она появится в каталоге, где её можно найти и пройти.', 'Publish the map. It appears in the catalogue where others can find and play it.'), T('Собирай лайки и звёзды создателя.', 'Collect likes and creator stars.')]) +
        H3(T('Звёзды создателя', 'Creator stars')) + TB([T('Событие', 'Event'), T('Звёзды', 'Stars')], [[T('новый игрок открыл карту', 'a new player opened the map'), '+1'], [T('игрок дошёл до финиша', 'a player reached the finish'), '+2'], [T('лайк', 'a like'), '+5']]) +
        P(T('Свои прохождения не считаются.', 'Your own plays do not count.')) +
        H3(T('Обмен картами', 'Sharing maps')) + P(T('Даже без сервера карту можно передать другу кодом вида `OBL1:…` (кнопка «Код»). Без сервера опубликованные карты видны только на этом устройстве.', 'Even without a server you can pass a map to a friend with a code like `OBL1:…` (the “Code” button). Without a server, published maps are visible on this device only.')) +
        P(T('Каждая карта имеет свою таблицу рекордов. Подробная инструкция лежит в `docs/WORKSHOP.md` репозитория.', 'Every map has its own leaderboard. The detailed guide is in `docs/WORKSHOP.md` in the repository.')) },

    { id: 'roadmap', g: 'news', t: ['Роадмап', 'Roadmap'], lead: ['Что сделано, что в работе и что впереди.', 'What is done, in progress and ahead.'], html: () => '<div class="rm" id="rm"></div>' + P(T('Полная интерактивная версия с подробностями лежит на [главной странице](./#roadmap).', 'The full interactive version with details is on the [home page](./#roadmap).')),
      after: () => { const r = $('#rm'); const cols = [['done', T('Готово', 'Done'), '#8ee04a'], ['progress', T('В работе', 'In progress'), '#ffc23c'], ['next', T('Дальше', 'Next'), '#5cc8ff'], ['later', T('Позже', 'Later'), '#c48aff']]; cols.forEach(([s, name, col]) => { const items = (D.road || []).filter(x => x.status === s); const d = document.createElement('div'); d.style.borderColor = col; d.innerHTML = '<h4></h4><ul></ul>'; d.querySelector('h4').textContent = name + ' · ' + items.length; items.forEach(x => { const li = document.createElement('li'); li.textContent = x.title[LANG]; d.querySelector('ul').appendChild(li) }); r.appendChild(d) }) } },

    { id: 'changelog', g: 'news', t: ['Патч-ноты', 'Patch notes'], lead: ['История обновлений альфы.', 'The history of alpha updates.'], html: () => (LANG === 'en' ? CO('', 'Patch notes are written in Russian.') : '') + '<div id="pn"></div>',
      after: () => { const r = $('#pn'); (D.patch || []).forEach((p, i) => { const d = document.createElement('details'); d.className = 'ac'; if (i === 0) d.open = true; d.innerHTML = '<summary><em></em><span></span></summary><div><ul></ul></div>'; d.querySelector('em').textContent = 'v' + p.v; d.querySelector('span').textContent = p.t; (p.b || []).forEach(x => { const li = document.createElement('li'); li.textContent = x; d.querySelector('ul').appendChild(li) }); r.appendChild(d) }) } },

    { id: 'architecture', g: 'dev', t: ['Архитектура', 'Architecture'], lead: ['Из чего собрана игра и сайт.', 'What the game and the site are built from.'],
      html: () => TB([T('Слой', 'Layer'), T('Как устроен', 'How it works')], [
        [T('Клиент', 'Client'), T('Three.js r128 и свой воксельный движок. Мир разбит на чанки 64×64, видеокарта рисует только ближние. На слабых устройствах графика снижается сама.', 'Three.js r128 and a custom voxel engine. The world is split into 64×64 chunks and the GPU draws only nearby ones. On weak devices graphics drop automatically.')],
        [T('Сеть', 'Network'), T('Комната по WebSocket до 32 игроков: позиции, чат, удары, PvP, состояние боссов.', 'A WebSocket room for up to 32 players: positions, chat, hits, PvP, boss state.')],
        [T('Сервер', 'Server'), T('Свой Node.js без сторонних зависимостей, нужен Node 18+.', 'Its own Node.js server with no third-party dependencies, Node 18+ required.')],
        [T('Данные', 'Data'), T('REST API для таблиц рекордов и карт Мастерской. Всё хранится в одном файле и пишется атомарно.', 'A REST API for leaderboards and Workshop maps. Everything is stored in one file and written atomically.')],
        [T('Лендинг', 'Landing'), T('Статическая страница на Three.js, GSAP и Lenis. Весь контент лежит в JSON и грузится через `fetch`.', 'A static page on Three.js, GSAP and Lenis. All content lives in JSON and is loaded with `fetch`.')],
      ]) + H3(T('Структура репозитория', 'Repository layout')) + CB('tree', 'oblaka/\n├─ index.html        landing (main)\n├─ action.html       landing (action edition)\n├─ docs.html         this documentation\n├─ play/index.html   the game (one file, Three.js r128)\n├─ landing/\n│  ├─ app.js         scene, camera, i18n, data render\n│  ├─ studio.js      roadmap, studio and "under the hood"\n│  ├─ docs.js        documentation page\n│  └─ data/*.json    all content (worlds, bosses, arsenal...)\n├─ server/server.js  zero-dependency server\n├─ vercel.json       redirects and cache headers\n└─ docs/             long-form docs, lore, screenshots') +
        P(T('Сборки нет: файлы выкладываются как есть. Скрипты Three.js, GSAP и Lenis подключаются с CDN.', 'There is no build step: files are deployed as they are. Three.js, GSAP and Lenis scripts load from a CDN.')) },

    { id: 'deploy', g: 'dev', t: ['Запуск и деплой', 'Run and deploy'], lead: ['Локальный запуск, git и Vercel.', 'Local run, git and Vercel.'],
      html: () => H3(T('Локально', 'Locally')) + CB('bash', 'node server/server.js\n# landing: http://localhost:8080/\n# docs:    http://localhost:8080/docs.html\n# game:    http://localhost:8080/play/') +
        CO('warn', T('Открывай страницы через сервер, а не двойным кликом по файлу: данные грузятся через `fetch`.', 'Open the pages through the server, not by double-clicking a file: data is loaded with `fetch`.')) +
        H3('Git') + CB('bash', 'git add -A\ngit commit -m "What changed"\ngit push origin alpha-5.1-home-island') +
        H3('Vercel') + CB('bash', 'npx vercel deploy --prod --yes') +
        P(T('`vercel.json` содержит редирект `/play` → `/play/`, адрес `/docs` для этой страницы и кэш для `/landing/*`. `.vercelignore` исключает `server/`, `docs/` и логи: сервер на Vercel не работает, он нужен локально или на отдельном хостинге.', '`vercel.json` holds the `/play` → `/play/` redirect, the `/docs` address for this page and cache headers for `/landing/*`. `.vercelignore` excludes `server/`, `docs/` and logs: the server does not run on Vercel, it is for local use or a separate host.')) +
        H3(T('Игра на статическом хостинге, сервер отдельно', 'Static game hosting with a separate server')) + P(T('Укажи адрес сервера в `<head>` файла `play/index.html`:', 'Put the server address in the `<head>` of `play/index.html`:')) + CB('html', '<meta name="oblaka-api" content="https://your-server.example.com">') },

    { id: 'api', g: 'dev', t: ['API сервера', 'Server API'], lead: ['REST-эндпоинты лидербордов и каталога карт.', 'REST endpoints for leaderboards and the map catalogue.'],
      html: () => TB(['Method', 'Path', T('Что делает', 'What it does')], [
        ['GET', '`/api/health`', T('проверка, что сервер жив', 'checks that the server is alive')],
        ['GET', '`/api/scores?board=…&me=uid`', T('таблица: `ach`, `kills`, `pvp`, `creators`, `race-0…4`, `map-<id>`', 'a board: `ach`, `kills`, `pvp`, `creators`, `race-0…4`, `map-<id>`')],
        ['POST', '`/api/scores`', T('отправить результат `{uid,nick,board,v}`', 'submit a result `{uid,nick,board,v}`')],
        ['GET', '`/api/maps?sort=popular|new&me=uid`', T('каталог карт', 'map catalogue')],
        ['GET', '`/api/maps/<id>`', T('карта целиком', 'a whole map')],
        ['POST', '`/api/maps`', T('опубликовать или обновить свою карту `{uid,nick,id?,name,desc,th,data}`', 'publish or update your own map `{uid,nick,id?,name,desc,th,data}`')],
        ['POST', '`/api/maps/<id>/play|like|finish`', T('игрок открыл, лайкнул, прошёл (с `t` — время)', 'a player opened, liked or finished it (with `t` for time)')],
        ['GET', '`/api/creators/<uid>`', T('статистика и звёзды создателя', 'creator stats and stars')],
      ]) + CO('', T('`uid` — случайный ключ игрока из `localStorage` (`oblaka-uid`). Сервер никому не отдаёт чужие `uid`, только флаги `me` и `own`.', '`uid` is a random player key from `localStorage` (`oblaka-uid`). The server never returns other players’ `uid`, only the `me` and `own` flags.')) },

    { id: 'protocol', g: 'dev', t: ['Протокол комнаты', 'Room protocol'], lead: ['Сообщения WebSocket-комнаты.', 'Messages of the WebSocket room.'],
      html: () => TB([T('Сообщение', 'Message'), T('Содержимое', 'Payload')], [
        ['`presence`', T('позиция, скин, оружие, PvP-флаг, здоровье, цвет виспа, `bf` — с каким боссом бьётся игрок', 'position, skin, weapon, PvP flag, health, wisp colour, `bf` — which boss the player is fighting')],
        ['`chat`', '`{n, t}`'], ['`sw`', T('`{t}` — взмах оружием', '`{t}` — a weapon swing')],
        ['`hit`', T('`{to, d, x, z, n}` — попадание в PvP', '`{to, d, x, z, n}` — a PvP hit')], ['`ko`', T('`{k, v}` — кто кого выбил', '`{k, v}` — who knocked out whom')],
        ['`bst`', T('`{b, p, r, m, hp, …}` — состояние босса от ведущего боя (10 раз в секунду)', '`{b, p, r, m, hp, …}` — boss state from the fight leader (10 times per second)')],
        ['`bfx`', T('`{b, l}` — атаки босса у ведущего, остальные их повторяют', '`{b, l}` — boss attacks on the leader, the others replay them')],
        ['`bhit`', T('`{b, d, to}` — удар по боссу, отправленный ведущему', '`{b, d, to}` — a hit on the boss sent to the leader')],
        ['`bdead`', T('`{b}` — босс побеждён, каждый участник получает добычу', '`{b}` — the boss is defeated, every participant gets loot')],
        ['`shit`', T('общий удар по серафиму', 'a shared hit on the seraph')],
      ]) + CO('', T('**Ведущим** становится игрок с наименьшим `id` среди тех, кто сейчас бьётся с этим боссом.', 'The **leader** is the player with the lowest `id` among those currently fighting that boss.')) },

    { id: 'faq', g: 'help', t: ['Частые вопросы', 'FAQ'], lead: ['Короткие ответы.', 'Short answers.'],
      html: () => [[T('Нужно ли что-то устанавливать?', 'Do I need to install anything?'), T('Нет. Игра открывается в браузере по ссылке и работает на компьютере, планшете и телефоне.', 'No. The game opens in the browser from a link and runs on desktop, tablet and phone.')],
        [T('Можно ли играть с друзьями?', 'Can I play with friends?'), T('Да. Зайдите на один сервер: вы в одном мире с общими боссами, добычей и опытом. До 32 игроков в комнате.', 'Yes. Join the same server and you share a world with shared bosses, loot and XP. Up to 32 players per room.')],
        [T('Какие шансы на сверхредкого Кумо?', 'What are the odds of an ultra-rare Kumo?'), T('1% при каждом вылуплении. Шансы публичны, а номер сверхредкого уникален.', '1% on every hatch. The odds are public and an ultra-rare number is unique.')],
        [T('Кумо могут умереть?', 'Can Kumo die?'), T('Нет. Если их не кормить, они просто грустят.', 'No. If not fed they just get sad.')],
        [T('Можно ли играть на геймпаде или телефоне?', 'Can I play on a gamepad or a phone?'), T('Да. Поддерживаются стандартные геймпады, а на телефоне включается сенсорное управление.', 'Yes. Standard gamepads are supported, and touch controls switch on on a phone.')],
        [T('Игра готова?', 'Is the game finished?'), T('Это альфа: возможны баги и изменения баланса. Контента становится больше с каждым обновлением.', 'This is an alpha: expect bugs and balance changes. There is more content with every update.')],
        [T('Игра обещает доход?', 'Does the game promise profit?'), T('Нет. Мы не обещаем доходность, шансы открыты, а условия токена и фонда пока уточняются.', 'No. We promise no profit, odds are public, and token and fund terms are still being confirmed.')],
      ].map(([q, a]) => '<details class="ac"><summary>' + esc(q) + '</summary><div>' + P(a) + '</div></details>').join('') },
  ];

  /* ---------------- render ---------------- */
  let spy = null;
  function render() {
    hid = 0; const U = UI[LANG]; document.documentElement.lang = LANG; document.title = U.title;
    $('#docWord').textContent = U.doc; $('#q').placeholder = U.ph; $('#q').setAttribute('aria-label', U.ph); $('#backLink').textContent = U.back; $('#playWord').textContent = U.play; $('#lang').textContent = LANG === 'ru' ? 'EN' : 'RU'; $('#menuBtn').setAttribute('aria-label', U.menu);
    const toc = $('#toc'), doc = $('#doc'); toc.innerHTML = ''; doc.innerHTML = ''; let lastG = '', n = 0;
    SECS.forEach(s => {
      n++; const num = String(n).padStart(2, '0');
      if (s.g !== lastG) { lastG = s.g; const g = document.createElement('div'); g.className = 'dx-g'; g.textContent = GROUPS[s.g][LANG === 'en' ? 1 : 0]; toc.appendChild(g) }
      const a = document.createElement('a'); a.className = 'dx-l'; a.href = '#' + s.id; a.dataset.id = s.id; a.innerHTML = '<em>' + num + '</em><span></span>'; a.querySelector('span').textContent = s.t[LANG === 'en' ? 1 : 0]; a.addEventListener('click', () => document.body.classList.remove('menu')); toc.appendChild(a);
      const sec = document.createElement('section'); sec.className = 'dx-sec'; sec.id = s.id; sec.dataset.t = s.t[LANG === 'en' ? 1 : 0];
      sec.innerHTML = '<header><p class="dx-eb"><b>' + num + '</b><span></span></p><h2></h2><p class="lead"></p></header><div class="dx-body"></div>';
      sec.querySelector('.dx-eb span').textContent = GROUPS[s.g][LANG === 'en' ? 1 : 0]; sec.querySelector('h2').textContent = s.t[LANG === 'en' ? 1 : 0]; sec.querySelector('.lead').textContent = s.lead[LANG === 'en' ? 1 : 0];
      sec.querySelector('.dx-body').innerHTML = s.html(); doc.appendChild(sec);
    });
    const ver = (D.patch && D.patch[0]) ? D.patch[0].v : '';
    const f = document.createElement('p'); f.className = 'dx-foot'; f.innerHTML = esc(U.foot) + ' <strong>α ' + esc(ver) + '</strong> · <a href="#overview">' + esc(U.toTop) + '</a>'; doc.appendChild(f);
    SECS.forEach(s => { if (s.after) { try { s.after() } catch (e) { console.error(s.id, e) } } });
    wire(); indexBuild(); startSpy();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView(), 50) }
  }
  function wire() {
    qa('[data-copy]').forEach(b => b.addEventListener('click', () => { const code = b.closest('.cb').querySelector('pre').textContent; const done = () => { const t = b.textContent; b.textContent = '✓'; setTimeout(() => { b.textContent = T('Копировать', 'Copy') }, 1200) }; if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done() }));
    qa('.anc').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const id = a.getAttribute('href').slice(1); history.replaceState(null, '', '#' + id); document.getElementById(id).scrollIntoView(); if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => { }) }));
  }
  function startSpy() {
    if (spy) spy.disconnect(); const links = qa('.dx-l'); const vis = new Map();
    spy = new IntersectionObserver(es => { es.forEach(e => vis.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null)); let best = null, bt = 1e9; vis.forEach((top, id) => { if (top !== null && Math.abs(top) < bt) { bt = Math.abs(top); best = id } }); if (best) links.forEach(l => { const on = l.dataset.id === best; l.classList.toggle('on', on); if (on) { const sd = $('#side'); const r = l.getBoundingClientRect(), sr = sd.getBoundingClientRect(); if (r.top < sr.top + 40 || r.bottom > sr.bottom - 20) l.scrollIntoView({ block: 'center' }) } }) }, { rootMargin: '-80px 0px -55% 0px', threshold: [0, 1] });
    qa('.dx-sec').forEach(s => spy.observe(s));
  }
  function progress() { const h = document.documentElement; const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight); $('.dx-progress i').style.width = (p * 100).toFixed(1) + '%' }

  /* ---------------- search ---------------- */
  let IDX = [];
  function nodeText(el) { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const a = []; let n; while ((n = w.nextNode())) { const t = n.nodeValue.replace(/\s+/g, ' ').trim(); if (t) a.push(t) } return a.join(' ') }
  function indexBuild() {
    IDX = []; const seen = new Set();
    qa('.dx-sec').forEach(sec => {
      const st = sec.dataset.t;
      qa('h3, p:not(.dx-eb), li, tr, .cd, .ac', sec).forEach(el => {
        if (el.closest('thead') || el.classList.contains('dx-eb')) return; const text = nodeText(el); if (text.length < 3 || seen.has(text)) return; seen.add(text);
        const head = el.querySelector && (el.querySelector('h4,summary,strong,td') || null); let title = el.tagName === 'H3' ? text.replace(/\s*#$/, '') : (head ? head.textContent.trim() : '');
        if (!title) { let h = el.previousElementSibling; while (h && h.tagName !== 'H3') h = h.previousElementSibling; title = h ? nodeText(h).replace(/\s*#$/, '') : st }
        IDX.push({ el, sec: st, title, text: text.replace(/\s*#$/, ''), low: text.toLowerCase() });
      });
    });
  }
  function hl(s, terms) { let out = esc(s); terms.forEach(t => { if (t.length < 2) return; out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') }); return out }
  let selRes = -1;
  function search(q) {
    const box = $('#results'); const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || q.length < 2) { box.hidden = true; box.innerHTML = ''; return }
    const hits = []; IDX.forEach(it => { if (terms.every(t => it.low.includes(t))) { let sc = 0; terms.forEach(t => { if (it.title.toLowerCase().includes(t)) sc += 5; sc += 1 }); hits.push([sc - Math.min(it.text.length, 400) / 400, it]) } });
    hits.sort((a, b) => b[0] - a[0]); const top = []; hits.forEach(([, it]) => { if (top.length < 12 && !top.some(x => x.el.contains(it.el) || it.el.contains(x.el))) top.push(it) });
    box.innerHTML = ''; selRes = -1;
    if (!top.length) { box.innerHTML = '<div class="dx-none">' + esc(UI[LANG].none) + '</div>' } else top.forEach(it => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'dx-res'; b.setAttribute('role', 'option'); const i = it.low.indexOf(terms[0]); const from = Math.max(0, i - 40); const snip = (from ? '…' : '') + it.text.slice(from, from + 130) + (it.text.length > from + 130 ? '…' : '');
      b.innerHTML = '<small></small><b></b><span></span>'; b.querySelector('small').textContent = it.sec; b.querySelector('b').innerHTML = hl(it.title.slice(0, 80), terms); b.querySelector('span').innerHTML = hl(snip, terms);
      b.addEventListener('click', () => go(it)); box.appendChild(b);
    });
    box.hidden = false;
  }
  function go(it) {
    $('#results').hidden = true; let p = it.el.closest('details'); if (p) p.open = true;
    it.el.scrollIntoView({ behavior: 'smooth', block: 'center' }); const t = it.el.closest('.dx-sec'); const target = it.el.matches('h3') ? it.el : it.el;
    target.classList.add('hit'); setTimeout(() => target.classList.remove('hit'), 1800); document.body.classList.remove('menu');
  }

  /* ---------------- lightbox ---------------- */
  function lightbox(src, cap) { $('#lbi').src = src; $('#lbc').textContent = cap; $('#lb').showModal() }

  /* ---------------- boot ---------------- */
  (async function boot() {
    const [ui, mech, tech, modes, worlds, bosses, ars, road, patch] = await Promise.all(['ui', 'mechanics', 'techniques', 'modes', 'worlds-all', 'bosses', 'arsenal', 'roadmap', 'patches'].map(n => get('landing/data/' + n + '.json')));
    Object.assign(D, { ui, mech, tech, modes, worlds, bosses, ars, road, patch });
    render();
    $('#lang').addEventListener('click', () => { LANG = LANG === 'ru' ? 'en' : 'ru'; try { localStorage.setItem('hto-lang', LANG) } catch (e) { } render(); $('#q').value = ''; $('#results').hidden = true });
    const q = $('#q'); q.addEventListener('input', () => search(q.value.trim()));
    q.addEventListener('keydown', e => { const items = qa('.dx-res'); if (e.key === 'Escape') { q.value = ''; $('#results').hidden = true; q.blur() } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { if (!items.length) return; e.preventDefault(); selRes = (selRes + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach((b, i) => b.setAttribute('aria-selected', i === selRes)); items[selRes].scrollIntoView({ block: 'nearest' }) } else if (e.key === 'Enter') { const t = items[selRes < 0 ? 0 : selRes]; if (t) t.click() } });
    document.addEventListener('keydown', e => { if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); q.select() } });
    document.addEventListener('click', e => { if (!e.target.closest('.dx-search')) $('#results').hidden = true });
    $('#menuBtn').addEventListener('click', () => { const on = document.body.classList.toggle('menu'); $('#menuBtn').setAttribute('aria-expanded', on) }); $('#scrim').addEventListener('click', () => document.body.classList.remove('menu'));
    $('#lbx').addEventListener('click', () => $('#lb').close()); $('#lb').addEventListener('click', e => { if (e.target === $('#lb')) $('#lb').close() });
    addEventListener('scroll', progress, { passive: true }); progress();
  })();
})();
