/* Hop to Olympus landing: one persistent voxel world; the document scroll drives the camera down through the sky.
   Sections carry data-cam; the camera blends between their poses while the sky changes colour on the way down. */
(function () {
  const $ = id => document.getElementById(id), qa = s => [...document.querySelectorAll(s)];
  const CFG = window.HTO_CFG || {};
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches, MOBILE = innerWidth < 860 || matchMedia('(pointer:coarse)').matches;
  if (REDUCED) document.documentElement.classList.add('reduced');
  let LANG = (localStorage.getItem('hto-lang') || (navigator.language || 'ru').slice(0, 2)) === 'en' ? 'en' : 'ru';
  const pre = { n: 0, set(v) { this.n = Math.max(this.n, v); $('preN').textContent = Math.round(this.n) } };

  /* ---------- texts ---------- */
  const I18N = {
    ru: {
      'cta.sound': 'Включить звук', 'cta.soundOn': 'Звук включён', 'nav.modes': 'Режимы', 'nav.plat': 'Где играть', 'tech.eyebrow': 'Техники', 'tech.title': 'Движение — тоже оружие', 'tech.lead': 'Здесь мало просто бежать и бить. Ритм прыжков, рывки, стены, крюк и крылья решают, долетишь ли ты до следующего острова и переживёшь ли босса.', 'modes.eyebrow': 'Режимы', 'modes.title': 'Во что поиграть сегодня', 'modes.lead': 'Сюжет на десятки часов, кооп и PvP, свои карты, забеги на рекорд и мини-игры на Ярмарке.', 'ui.eyebrow': 'Интерфейс игры', 'ui.title': 'Загляни внутрь', 'ui.lead': 'Настоящие экраны из игры: карта, крафт, сумка и Кумо. Нажми на скриншот, чтобы открыть его целиком.', 'plat.eyebrow': 'Кроссплатформа', 'plat.title': 'Играй где угодно', 'plat.lead': 'Одна игра на компьютере, планшете и телефоне — прямо в браузере, без установки. Начал на ноутбуке, продолжил с телефона в дороге.', 'plat.1t': 'Компьютер и ноутбук', 'plat.1d': 'Клавиатура и мышь: WASD, прыжок пробелом, удар кликом.', 'plat.2t': 'Телефон и планшет', 'plat.2d': 'Сенсорный джойстик, кнопки прыжка, удара, рывка и крюка, щипок для камеры. Включается само.', 'plat.3t': 'Геймпад', 'plat.3d': 'Xbox, PlayStation, Switch Pro и большинство USB- и Bluetooth-геймпадов: стики, прыжок, удар, рывок, крюк, карта.', 'plat.4t': 'Сразу в игру', 'plat.4d': 'Открыл ссылку — играешь. Ничего не нужно скачивать и обновлять.', 'nav.worlds': 'Миры', 'nav.mech': 'Механики', 'nav.kumo': 'Кумо', 'nav.road': 'Роадмап', 'cta.play': 'Играть', 'cta.trailer': 'Смотреть бой', sound: 'Звук',
      'hero.eyebrow': 'Воксельная экшн-RPG прямо в браузере', 'hero.lead': 'Прыгай по облачным островам, сражайся с богами и вырасти своего Кумо — одному или вместе с другом.', 'hero.note': 'Бесплатно · без установки · ПК и телефон', 'hero.scroll': 'Спускайся вниз',
      'dive.line': 'Под облаками — целые миры.', 'worlds.eyebrow': 'Миры', 'worlds.title': 'Острова над небом', 'worlds.drag': 'Крути острова: перетаскивай или используй стрелки',
      'mech.eyebrow': 'Механики', 'mech.title': 'Что ты будешь делать',
      'kumo.eyebrow': 'Твой спутник', 'kumo.title': 'Вырасти своего Кумо', 'kumo.lead': 'Облачный малыш вылупляется из яйца и растёт от того, чем ты его кормишь. Искорки от черепашек, гарпий, призраков и кицунэ дают ему детали и превращают во взрослую форму своего мира.', 'kumo.rare': 'Сверхредкий · шанс 1%',
      'market.eyebrow': 'Скоро', 'market.title': 'Маркетплейс Кумо', 'market.lead': 'Меняйся Кумо с друзьями, собирай редкие формы и устраивай с ними игры. У каждого Кумо свой номер и своя история.', 'market.all': 'Все', 'market.rare': 'Сверхредкие', 'market.adult': 'Взрослые', 'market.baby': 'Малыши',
      'road.eyebrow': 'Роадмап', 'road.title': 'Мы только разгоняемся', 'final.title': 'Олимп ждёт', 'final.lead': 'Первый прыжок — через пару секунд. Без установки и регистрации.', 'foot.press': 'Пресс-кит', 'foot.todo': '[УТОЧНИТЬ: ссылки на сообщество]',
      stages: ['Яйцо', 'Малыш', 'Подросток', 'Взрослый'], forms: { lug: 'Луговой', grom: 'Громовой', sum: 'Сумрачный', fon: 'Фонарный', zv: 'Звёздный', rain: 'Радужный' },
      rareN: { lug: 'Ядовитый Луговой', grom: 'Неоновый Громовой', sum: 'Кислотный Сумрачный', fon: 'Розовый Фонарный', zv: 'Галактический Звёздный', rain: 'Призматический', kid: 'Сверхредкий малыш' },
      caps: ['Погрей яйцо трижды, и вылупится Кумо.', 'Каждая искорка сразу даёт деталь: панцирь, ушки, хвостик…', 'Детали копятся, Кумо подрастает.', 'Форму выбирает мир, чьих искорок было больше.'],
      status: { done: 'Готово', progress: 'В работе', next: 'Дальше' }, adult: 'взрослый', baby: 'малыш', soon: 'скоро'
    },
    en: {
      'cta.sound': 'Turn on sound', 'cta.soundOn': 'Sound is on', 'nav.modes': 'Modes', 'nav.plat': 'Platforms', 'tech.eyebrow': 'Techniques', 'tech.title': 'Movement is a weapon too', 'tech.lead': 'Running and hitting is not enough here. Jump rhythm, dashes, walls, the hook and wings decide whether you reach the next isle and survive the boss.', 'modes.eyebrow': 'Modes', 'modes.title': 'What to play today', 'modes.lead': 'A story for dozens of hours, co-op and PvP, your own maps, record runs and mini-games at the Fair.', 'ui.eyebrow': 'Game interface', 'ui.title': 'Take a look inside', 'ui.lead': 'Real screens from the game: the map, crafting, the bag and Kumo. Click a screenshot to open it full size.', 'plat.eyebrow': 'Cross-platform', 'plat.title': 'Play anywhere', 'plat.lead': 'One game on desktop, tablet and phone — right in the browser, no install. Start on your laptop, keep going on your phone.', 'plat.1t': 'Desktop and laptop', 'plat.1d': 'Keyboard and mouse: WASD, space to jump, click to strike.', 'plat.2t': 'Phone and tablet', 'plat.2d': 'A touch joystick, jump, strike, dash and hook buttons, pinch for the camera. Turns on by itself.', 'plat.3t': 'Gamepad', 'plat.3d': 'Xbox, PlayStation, Switch Pro and most USB and Bluetooth pads: sticks, jump, strike, dash, hook, map.', 'plat.4t': 'Straight into the game', 'plat.4d': 'Open the link and play. Nothing to download or update.', 'nav.worlds': 'Worlds', 'nav.mech': 'Gameplay', 'nav.kumo': 'Kumo', 'nav.road': 'Roadmap', 'cta.play': 'Play', 'cta.trailer': 'Watch a fight', sound: 'Sound',
      'hero.eyebrow': 'A voxel action RPG right in your browser', 'hero.lead': 'Hop across floating cloud isles, fight the gods and raise your own Kumo — solo or with a friend.', 'hero.note': 'Free · no install · desktop and mobile', 'hero.scroll': 'Scroll down',
      'dive.line': 'Whole worlds wait below the clouds.', 'worlds.eyebrow': 'Worlds', 'worlds.title': 'Isles above the sky', 'worlds.drag': 'Spin the isles: drag or use the arrow keys',
      'mech.eyebrow': 'Gameplay', 'mech.title': 'What you will do',
      'kumo.eyebrow': 'Your companion', 'kumo.title': 'Raise your own Kumo', 'kumo.lead': 'A cloud baby hatches from an egg and grows from whatever you feed it. Sparks from turtles, harpies, ghosts and kitsune give it new parts and turn it into its world\'s adult form.', 'kumo.rare': 'Ultra-rare · 1% chance',
      'market.eyebrow': 'Coming soon', 'market.title': 'Kumo marketplace', 'market.lead': 'Trade Kumo with friends, collect rare forms and play games with them. Every Kumo has its own number and story.', 'market.all': 'All', 'market.rare': 'Ultra-rare', 'market.adult': 'Adults', 'market.baby': 'Babies',
      'road.eyebrow': 'Roadmap', 'road.title': 'We are just getting started', 'final.title': 'Olympus awaits', 'final.lead': 'Your first jump is seconds away. No install, no sign-up.', 'foot.press': 'Press kit', 'foot.todo': '[TO CONFIRM: community links]',
      stages: ['Egg', 'Baby', 'Teen', 'Adult'], forms: { lug: 'Meadow', grom: 'Thunder', sum: 'Dusk', fon: 'Lantern', zv: 'Star', rain: 'Rainbow' },
      rareN: { lug: 'Toxic Meadow', grom: 'Neon Thunder', sum: 'Acid Dusk', fon: 'Pink Lantern', zv: 'Galactic Star', rain: 'Prismatic', kid: 'Ultra-rare baby' },
      caps: ['Warm the egg three times and a Kumo hatches.', 'Every spark adds a part at once: a shell, ears, a tail…', 'Parts add up and the Kumo grows.', 'The world whose sparks it ate most picks its form.'],
      status: { done: 'Done', progress: 'In progress', next: 'Next' }, adult: 'adult', baby: 'baby', soon: 'soon'
    }
  };
  /* v2 texts */ Object.assign(I18N.ru, {"dress.hint":"Нажми — сменить образ","alpha.badge":"АЛЬФА 5.4","alpha.text":"Игра в стадии тестирования — дальше только больше контента","tk.1":"6 актов сюжета","tk.2":"12 видов оружия","tk.3":"9 режимов","tk.4":"Кооп и PvP","tk.5":"ПК · планшет · телефон · геймпад","tk.6":"Сверхредкие Кумо — 1%","tk.7":"Без установки","tk.8":"Своя Мастерская карт","nav.creators":"Создателям","nav.about":"О нас","odds.eyebrow":"Честные шансы","odds.title":"Редкость без тумана","odds.lead":"Каждый Кумо вылупляется из яйца в Облачном саду. Шансы на сверхредкого известны заранее и одинаковы для всех, а номер сверхредкого уникален и никогда не повторяется.","odds.uniq":"У каждого сверхредкого свой номер — второго такого не будет","cr.p1":"Ранний доступ","cr.p2":"Свой промокод","cr.p3":"Значок создателя","cr.p4":"Бонус за друзей","odds.r0":"Обычное яйцо","odds.r1":"Один родитель сверхредкий","odds.r2":"Оба родителя сверхредкие","odds.simT":"Высиди 100 яиц","odds.simD":"Проверь сам, насколько редок 1%. Симуляция идёт по тем же шансам, что и в игре.","odds.p0":"Обычные","odds.p1":"1 редкий родитель","odds.p2":"2 редких родителя","odds.go":"Высидеть","odds.found":"Сверхредких в этой кладке","odds.total":"Всего высижено","creators.eyebrow":"Для создателей","creators.title":"Делай игру вместе с нами","creators.lead":"Hop to Olympus растёт не только руками студии. Карты, ролики и выращенные Кумо — это вклад игроков, и мы хотим за него благодарить.","cr.1t":"Награды за карты","cr.1d":"Собери карту в редакторе Мастерской и опубликуй её. Чем больше людей в неё играют, тем больше дев-наград получает автор.","cr.1s":"Мастерская открыта — стань первым автором","cr.1n":"Карт в Мастерской","cr.2t":"Контент-мейкерам","cr.2d":"Стримишь или снимаешь ролики? Ранний доступ к обновлениям, свой промокод, значок создателя в игре и бонус за приглашённых игроков.","cr.3t":"Роялти заводчика Кумо","cr.3d":"Вырастил Кумо — твоё имя навсегда записано в его истории как заводчика. Когда этого Кумо перепродают на маркетплейсе, часть каждой сделки уходит тебе — как роялти автору в NFT.","cr.f0":"Ты вырастил","cr.f1":"Продажа","cr.f2":"Перепродажа","cr.f3":"И дальше","cr.fr":"заводчику","cr.4t":"Тестерам альфы","cr.4d":"Нашёл баг или придумал механику — расскажи нам. Самые активные тестеры получат значок первопроходца и место в титрах.","cr.note":"Проценты, награды и условия программ уточняются и будут объявлены до запуска маркетплейса. [TOKEN] · [УТОЧНИТЬ]","road.phase":"Где мы сейчас","road.alpha":"Альфа","road.beta":"Бета","road.release":"Релиз","road.now":"мы здесь","about.eyebrow":"Кто мы","about.title":"Маленькая студия, большой остров","about.p1":"Мы — локальная инди-студия. Без издателя и без конвейера: делаем игру, в которую сами хотим играть, и вкладываем в неё душу — от каждого кубика острова до характера каждого Кумо.","about.p2":"Hop to Olympus сейчас в альфе. Это живая сборка: что-то ломается, что-то меняется, а контента становится больше с каждым обновлением. Играя сейчас, ты влияешь на то, какой игра станет.","about.v1t":"Душа в деталях","about.v1d":"Каждый остров, моб и Кумо сделан вручную.","about.v2t":"Честно с игроками","about.v2d":"Шансы открыты. Никаких обещаний доходности.","about.v3t":"Слушаем комьюнити","about.v3d":"Идеи игроков попадают в обновления.","about.team":"[УТОЧНИТЬ: состав команды, роли и фото]","alpha.title":"Это альфа-версия","alpha.long":"Игра в стадии тестирования: возможны баги и изменения баланса. Дальше игра будет только развиваться и наполняться контентом.","faq.eyebrow":"FAQ","faq.title":"Частые вопросы","faq.q1":"Это бесплатно?","faq.a1":"Да. Играть можно бесплатно прямо в браузере.","faq.q2":"Нужно что-то устанавливать?","faq.a2":"Нет. Открыл ссылку — играешь. Обновления приходят сами.","faq.q3":"Работает на телефоне?","faq.a3":"Да: на телефоне и планшете включается сенсорное управление. На компьютере — клавиатура и мышь или геймпад.","faq.q4":"Это готовая игра?","faq.a4":"Нет, это альфа-версия в стадии тестирования. Возможны баги и изменения баланса, а контент добавляется с каждым обновлением.","faq.q5":"Что такое Кумо?","faq.a5":"Облачные существа, которых ты выращиваешь в своём саду. Они растут от яйца до взрослого, меняют форму от ухода и ходят с тобой в походы. Иногда вылупляются сверхредкие.","faq.q6":"Как играть с другом?","faq.a6":"Кооп работает по сети: проходите миры вдвоём, а если захотите — включите PvP и выясните, кто сильнее.","faq.q7":"Будут ли маркетплейс и токен?","faq.a7":"Маркетплейс Кумо в планах. Детали токена и условия объявим отдельно, после юридической проверки. Мы не обещаем доходность: Кумо — игровые существа, а не инвестиция.","faq.q8":"Как получать награды за карты?","faq.a8":"Публикуй карты в Мастерской. Система наград авторам в разработке — условия объявим в наших каналах.","foot.alpha":"Альфа-версия. Игра в стадии тестирования и будет развиваться и наполняться контентом."}); Object.assign(I18N.en, {"dress.hint":"Tap to change the outfit","alpha.badge":"ALPHA 5.4","alpha.text":"Early testing — more content is on the way","tk.1":"6 story acts","tk.2":"12 weapon types","tk.3":"9 modes","tk.4":"Co-op and PvP","tk.5":"PC · tablet · phone · gamepad","tk.6":"Ultra-rare Kumo — 1%","tk.7":"No install","tk.8":"Your own map Workshop","nav.creators":"Creators","nav.about":"About","odds.eyebrow":"Fair odds","odds.title":"Rarity, no smoke","odds.lead":"Every Kumo hatches from an egg in the Cloud Garden. The odds of an ultra-rare are public and the same for everyone, and every ultra-rare number is unique.","odds.uniq":"Every ultra-rare has its own number — there will never be a second one","cr.p1":"Early access","cr.p2":"Promo code","cr.p3":"Creator badge","cr.p4":"Invite bonus","odds.r0":"Regular egg","odds.r1":"One ultra-rare parent","odds.r2":"Both parents ultra-rare","odds.simT":"Hatch 100 eggs","odds.simD":"See for yourself how rare 1% is. The simulation uses the same odds as the game.","odds.p0":"Regular","odds.p1":"1 rare parent","odds.p2":"2 rare parents","odds.go":"Hatch","odds.found":"Ultra-rares in this clutch","odds.total":"Hatched in total","creators.eyebrow":"For creators","creators.title":"Build the game with us","creators.lead":"Hop to Olympus grows beyond the studio. Maps, videos and raised Kumo are what players bring, and we want to reward that.","cr.1t":"Rewards for maps","cr.1d":"Build a map in the Workshop editor and publish it. The more people play it, the more dev rewards its author earns.","cr.1s":"The Workshop is open — be the first author","cr.1n":"Maps in the Workshop","cr.2t":"For content makers","cr.2d":"Stream or make videos? Early access to updates, your own promo code, a creator badge in the game and a bonus for players you bring.","cr.3t":"Kumo breeder royalty","cr.3d":"Raise a Kumo and your name stays in its history as the breeder. Whenever that Kumo is resold on the marketplace, a share of every trade goes to you — like creator royalties in NFTs.","cr.f0":"You raised it","cr.f1":"Sale","cr.f2":"Resale","cr.f3":"And on","cr.fr":"to the breeder","cr.4t":"Alpha testers","cr.4d":"Found a bug or have an idea — tell us. The most active testers get a pioneer badge and a place in the credits.","cr.note":"Rates, rewards and programme terms are being finalised and will be announced before the marketplace launches. [TOKEN] · [TO CONFIRM]","road.phase":"Where we are","road.alpha":"Alpha","road.beta":"Beta","road.release":"Release","road.now":"we are here","about.eyebrow":"Who we are","about.title":"A small studio, a big island","about.p1":"We are a local indie studio. No publisher, no assembly line: we make the game we want to play ourselves and put our soul into it — from every block of an island to the character of every Kumo.","about.p2":"Hop to Olympus is in alpha. It is a living build: things break, things change, and every update adds more content. Playing now, you shape what the game becomes.","about.v1t":"Soul in the details","about.v1d":"Every isle, mob and Kumo is handmade.","about.v2t":"Honest with players","about.v2d":"Public odds. No promises of profit.","about.v3t":"We listen","about.v3d":"Player ideas make it into updates.","about.team":"[TO CONFIRM: team, roles and photos]","alpha.title":"This is an alpha","alpha.long":"The game is in testing: expect bugs and balance changes. From here it only grows and fills with content.","faq.eyebrow":"FAQ","faq.title":"Questions","faq.q1":"Is it free?","faq.a1":"Yes. You can play for free right in your browser.","faq.q2":"Do I need to install anything?","faq.a2":"No. Open the link and play. Updates arrive by themselves.","faq.q3":"Does it work on a phone?","faq.a3":"Yes: phones and tablets get touch controls. On a computer use keyboard and mouse or a gamepad.","faq.q4":"Is the game finished?","faq.a4":"No, it is an alpha in testing. Expect bugs and balance changes; every update adds content.","faq.q5":"What are Kumo?","faq.a5":"Cloud creatures you raise in your garden. They grow from an egg to an adult, change form with care and join you on adventures. Sometimes an ultra-rare hatches.","faq.q6":"How do I play with a friend?","faq.a6":"Co-op works online: clear worlds together, or turn on PvP to see who is stronger.","faq.q7":"Will there be a marketplace and a token?","faq.a7":"A Kumo marketplace is planned. Token details and terms will be announced separately after a legal review. We promise no profit: Kumo are game creatures, not an investment.","faq.q8":"How do map rewards work?","faq.a8":"Publish maps in the Workshop. The author reward system is in development; terms will be announced in our channels.","foot.alpha":"Alpha version. The game is in testing and will keep growing with content."});
  /* v3 texts */ Object.assign(I18N.ru, {"boss.btn":"Все боссы · 33","boss.eyebrow":"Бестиарий","boss.title":"33 босса уже в игре","boss.all":"Все","boss.soon":"кадр скоро","roy.eyebrow":"Только для Кумо","lb.eyebrow":"Лидерборды","lb.title":"Здесь считают всех","lb.lead":"Таблицы уже работают в игре. Дальше — награды: будем поощрять спидранеров, охотников, дуэлянтов, авторов карт и тех, кто вырастит больше всех Кумо.","lb.race":"Спидран","lb.kills":"Охотники","lb.pvp":"PvP","lb.ach":"Достижения","lb.creators":"Авторы карт","lb.kumo":"Заводчики Кумо","lb.track":"Трасса","lb.empty":"Пока пусто — стань первым","lb.soon":"Таблица заводчиков откроется вместе с маркетплейсом","lb.live":"живые данные с сервера","lb.r1":"Значки и титулы","lb.r2":"Имя в зале славы","lb.r3":"Сезонные призы [УТОЧНИТЬ]","lb.note":"Награды игрокам в планах — условия объявим в каналах сообщества.","news.eyebrow":"Что нового","news.title":"Мир растёт каждое обновление","news.ev":"Явления мира","join.eyebrow":"Сообщество","join.title":"Залетай к нам","join.lead":"Новости обновлений первыми, голосования за новые механики, тесты альфы и общение с командой.","join.tg":"Telegram","join.x":"X (Twitter)","join.p1":"Новости первыми","join.p2":"Голосования","join.p3":"Тесты альфы","join.todo":"[УТОЧНИТЬ: ссылки]","nav.join":"Сообщество"}); Object.assign(I18N.en, {"boss.btn":"All bosses · 33","boss.eyebrow":"Bestiary","boss.title":"33 bosses already in the game","boss.all":"All","boss.soon":"shot coming soon","roy.eyebrow":"Kumo only","lb.eyebrow":"Leaderboards","lb.title":"Everyone counts here","lb.lead":"The boards already run in the game. Next come rewards for speedrunners, hunters, duellists, map authors and whoever raises the most Kumo.","lb.race":"Speedrun","lb.kills":"Hunters","lb.pvp":"PvP","lb.ach":"Achievements","lb.creators":"Map authors","lb.kumo":"Kumo breeders","lb.track":"Track","lb.empty":"Empty for now — be the first","lb.soon":"The breeders board opens with the marketplace","lb.live":"live data from the server","lb.r1":"Badges and titles","lb.r2":"Name in the hall of fame","lb.r3":"Season prizes [TO CONFIRM]","lb.note":"Player rewards are planned — terms will be announced in our channels.","news.eyebrow":"What's new","news.title":"The world grows every update","news.ev":"World events","join.eyebrow":"Community","join.title":"Hop in with us","join.lead":"Update news first, votes on new mechanics, alpha tests and talking to the team.","join.tg":"Telegram","join.x":"X (Twitter)","join.p1":"News first","join.p2":"Votes","join.p3":"Alpha tests","join.todo":"[TO CONFIRM: links]","nav.join":"Community"}); I18N.ru.status.later = 'В планах'; I18N.en.status.later = 'Later';
  /* v4a texts */ Object.assign(I18N.ru, {"ar.btnW":"Арсенал · 12 видов оружия","ar.btnA":"Броня, крылья и реликвии","ar.eyebrow":"Арсенал","ar.title":"Всё снаряжение из игры","ar.how":"Где взять","ar.live":"живой показ"}); Object.assign(I18N.en, {"ar.btnW":"Arsenal · 12 weapons","ar.btnA":"Armour, wings and relics","ar.eyebrow":"Arsenal","ar.title":"Every piece of gear in the game","ar.how":"Where to get it","ar.live":"live preview"});
  /* v4b texts */ Object.assign(I18N.ru, {"hood.v1":"1,47 МБ","hood.v3":"140 000+","duo.btn":"Режимы для двоих · 8","map.eyebrow":"Карта мира","map.title":"Шесть миров, одна вертикаль","map.lead":"Это настоящий мир из игры, блок в блок: острова, постройки, неон и лава. Жёлтые флажки — телепорты, красные — боссы, фиолетовые — жители с заданиями. Крути мышкой, приближай кнопками и нажимай на маркеры.","map.l1":"флажок · телепорт","map.l2":"босс","map.l3":"житель с заданием","map.hint":"Нажми на маркер","duo.eyebrow":"Для двоих","duo.title":"Всё лучше вдвоём","duo.lead":"Кооп работает по сети прямо в браузере: заходите на один сервер — и вы в одном мире. Боссы, лут и опыт общие, а сеть честная: удары не теряются, бой не откатывается.","duo.1t":"Кооп-прохождение","duo.1d":"Шесть актов вдвоём. Общие мобы и боссы: все видят одно и то же, лут и опыт получают оба.","duo.2t":"Приди на помощь","duo.2d":"Напарник дерётся рядом? Вступаешь в его бой с тем же здоровьем босса. Если ведущий упал, бой продолжает второй.","duo.3t":"Боссы на двоих","duo.3d":"Кастор и Поллукс делят одну жизнь — добивать нужно почти одновременно. Каркин и Эреб — с общим здоровьем на всех.","duo.4t":"PvP-дуэли","duo.4d":"Включи PvP в любом мире: удары отбрасывают, сильные приёмы — дальше. Победы идут в таблицу.","duo.5t":"Пух-бокс","duo.5d":"Ринг на Ярмарке, надувные перчатки, лучший из трёх раундов и гонг.","duo.6t":"Мини-игры Ярмарки","duo.6d":"«Пол — это лава» и куриные догонялки — вдвоём за билеты.","duo.7t":"Действия пары","duo.7d":"Возьмитесь за руки, обнимитесь, дайте пять — анимации для двоих.","duo.8t":"Общий дом","duo.8d":"Друг видит твой остров, ферму, питомцев и Кумо. В работе.","duo.s1":"Открой игру","duo.s2":"Друг заходит на тот же сервер","duo.s3":"До 32 игроков в одном мире, чат и PvP","hood.eyebrow":"Под капотом","hood.title":"Как это устроено","hood.lead":"Hop to Olympus — не прототип на конструкторе. Свой движок поверх Three.js, свой сервер и весь контент — сделаны командой. Игра открывается по ссылке и работает на любом устройстве.","hood.n1":"вся игра в одном файле","hood.n2":"строк игрового кода","hood.n3":"блоков в мирах","hood.n4":"регионов в 6 мирах","hood.n5":"боссов","hood.n6":"видов оружия","hood.n7":"игроков в одной комнате","hood.n8":"установок","hood.c1t":"Клиент","hood.c1d":"Three.js и свой воксельный движок. Мир разбит на чанки 64×64: видеокарта рисует только то, что рядом. Если устройство слабое, графика снижается сама, чтобы игра шла плавно.","hood.c2t":"Сеть","hood.c2d":"Свой сервер на Node.js без сторонних зависимостей. Комната по WebSocket до 32 игроков: позиции, чат, удары и PvP. Честный кооп: ведущий боя не меняется на лету, здоровье боссов общее, эффекты зеркалятся у всех.","hood.c3t":"Данные","hood.c3d":"REST API для лидербордов (забеги, охотники, PvP, достижения, авторы) и карт Мастерской с лайками и звёздами. Сервер хранит всё в своём файле и пишет его атомарно.","hood.c4t":"Контент","hood.c4d":"Музыка собирается из аккордов прямо в игре, фото-режим с фильтрами, русский и английский. 33 босса с фазами, 12 видов оружия с комбо, Кумо с генетикой редкости.","hood.a1":"Браузер","hood.a1s":"игра · Three.js","hood.a2":"Комната","hood.a2s":"WebSocket · до 32","hood.a3":"Сервер","hood.a3s":"Node.js · REST API","hood.a4":"Данные","hood.a4s":"лидерборды · карты","nav.map":"Карта"}); Object.assign(I18N.en, {"hood.v1":"1.47 MB","hood.v3":"140,000+","duo.btn":"Modes for two · 8","map.eyebrow":"World map","map.title":"Six worlds, one way up","map.lead":"This is the real game world, block for block: isles, buildings, neon and lava. Yellow flags are teleports, red are bosses, purple are quest NPCs. Drag to rotate, zoom with the buttons and click the markers.","map.l1":"flag · teleport","map.l2":"boss","map.l3":"quest NPC","map.hint":"Click a marker","duo.eyebrow":"For two","duo.title":"Better together","duo.lead":"Co-op runs online right in the browser: join the same server and you share one world. Bosses, loot and XP are shared, and the netcode is honest: no lost hits, no rolled-back fights.","duo.1t":"Co-op campaign","duo.1d":"Six acts together. Shared mobs and bosses: everyone sees the same thing, both get loot and XP.","duo.2t":"Jump in to help","duo.2d":"Your partner is fighting nearby? Join their fight with the same boss health. If the leader falls, the other carries on.","duo.3t":"Bosses for two","duo.3d":"Castor and Pollux share one life — finish them almost together. Karkinos and Erebus share health across everyone.","duo.4t":"PvP duels","duo.4d":"Turn on PvP in any world: hits knock back, strong moves knock further. Wins go on the board.","duo.5t":"Puffy Boxing","duo.5d":"A ring at the Fair, inflatable gloves, best of three rounds and a gong.","duo.6t":"Fair mini-games","duo.6d":"The Floor Is Lava and Hen Chase — together for tickets.","duo.7t":"Couple actions","duo.7d":"Hold hands, hug, high-five — animations for two.","duo.8t":"A shared home","duo.8d":"Your friend sees your island, farm, pets and Kumo. In progress.","duo.s1":"Open the game","duo.s2":"Your friend joins the same server","duo.s3":"Up to 32 players in one world, chat and PvP","hood.eyebrow":"Under the hood","hood.title":"How it works","hood.lead":"Hop to Olympus is not a template prototype. Its own engine on top of Three.js, its own server and all the content are made by the team. The game opens from a link and runs on any device.","hood.n1":"the whole game in one file","hood.n2":"lines of game code","hood.n3":"blocks across the worlds","hood.n4":"regions in 6 worlds","hood.n5":"bosses","hood.n6":"weapon types","hood.n7":"players in one room","hood.n8":"installs","hood.c1t":"Client","hood.c1d":"Three.js and a custom voxel engine. The world is split into 64×64 chunks so the GPU only draws what is near. On weak devices the graphics drop automatically to keep it smooth.","hood.c2t":"Netcode","hood.c2d":"Its own Node.js server with no third-party dependencies. A WebSocket room for up to 32 players: positions, chat, hits and PvP. Honest co-op: the fight leader stays put, boss health is shared, effects are mirrored for everyone.","hood.c3t":"Data","hood.c3d":"A REST API for leaderboards (races, hunters, PvP, achievements, authors) and Workshop maps with likes and stars. The server keeps everything in its own file and writes it atomically.","hood.c4t":"Content","hood.c4d":"Music is generated from chords in the game, a photo mode with filters, Russian and English. 33 bosses with phases, 12 weapons with combos, Kumo with rarity genetics.","hood.a1":"Browser","hood.a1s":"game · Three.js","hood.a2":"Room","hood.a2s":"WebSocket · up to 32","hood.a3":"Server","hood.a3s":"Node.js · REST API","hood.a4":"Data","hood.a4s":"boards · maps","nav.map":"Map"});
  /* v5 texts */ Object.assign(I18N.ru, {"ms.pick":"Выбери режим","ln.sub":"лаунчер обновлений","ln.news":"Новости","ln.patch":"Патч-ноты","ln.ev":"Явления мира","ln.ver":"текущая версия","ln.play":"Играть","ln.pn":"обновлений альфы","ln.ru":"Патч-ноты ведутся на русском","vs.p1":"Игрок 1","vs.p2":"Игрок 2","vs.you":"Ты","vs.friend":"Друг","vs.link":"WebSocket · одна комната","duo.s1":"Открой игру","duo.s2":"Друг заходит на тот же сервер","duo.s3":"До 32 игроков в одном мире, чат и PvP"}); Object.assign(I18N.en, {"ms.pick":"Pick a mode","ln.sub":"update launcher","ln.news":"News","ln.patch":"Patch notes","ln.ev":"World events","ln.ver":"current version","ln.play":"Play","ln.pn":"alpha updates","ln.ru":"Patch notes are kept in Russian","vs.p1":"Player 1","vs.p2":"Player 2","vs.you":"You","vs.friend":"Friend","vs.link":"WebSocket · one room","duo.s1":"Open the game","duo.s2":"Your friend joins the same server","duo.s3":"Up to 32 players in one world, chat and PvP"});
  if (CFG.i18n) for (const l in CFG.i18n) Object.assign(I18N[l], CFG.i18n[l]);
  const L = () => I18N[LANG];
  function applyLang() {
    document.documentElement.lang = LANG; $('lang').textContent = LANG === 'ru' ? 'EN' : 'RU';
    qa('[data-i18n]').forEach(e => { const v = L()[e.dataset.i18n]; if (typeof v === 'string') e.textContent = v });
    qa('[data-i18n-aria]').forEach(e => { const v = L()[e.dataset.i18nAria]; if (v) e.setAttribute('aria-label', v) }); const sp2 = document.querySelector('#sound2 span'); if (sp2) sp2.textContent = AU.on ? L()['cta.soundOn'] : L()['cta.sound'];
    renderData(); kumoUI(); worldUI(); if (typeof dressLabel === 'function') dressLabel();
  }

  /* ---------- renderer, sky, light ---------- */
  const cv = $('scene'), R = new THREE.WebGLRenderer({ canvas: cv, antialias: !MOBILE, powerPreference: 'high-performance' });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, MOBILE ? 1.4 : 1.75)); R.setSize(innerWidth, innerHeight, false); if (!MOBILE) { R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap }
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 900);
  scene.fog = new THREE.Fog(0xffd9a0, 60, 320);
  const skyU = { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, sun: { value: new THREE.Vector3(0.2, 0.12, -1).normalize() }, sunC: { value: new THREE.Color(0xfff0c8) } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 top,mid,bot,sun,sunC;varying vec3 vD;void main(){float h=vD.y;vec3 c=h>0.08?mix(mid,top,smoothstep(0.08,0.75,h)):mix(bot,mid,smoothstep(-0.25,0.08,h));float s=max(dot(vD,sun),0.);c+=sunC*(pow(s,48.)*0.9+pow(s,6.)*0.18);gl_FragColor=vec4(c,1.);}'
  }));
  scene.add(sky);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xbcc8e6, 0.85), sunL = new THREE.DirectionalLight(0xffffff, 0.8); sunL.position.set(30, 60, 20); scene.add(hemi, sunL, sunL.target); if (!MOBILE) { sunL.castShadow = true; sunL.shadow.mapSize.set(2048, 2048); Object.assign(sunL.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 120 }); sunL.shadow.bias = -0.0008; sunL.shadow.normalBias = 0.02 }
  let comp = null; if (!MOBILE && THREE.EffectComposer && THREE.UnrealBloomPass && THREE.RenderPass) { try { comp = new THREE.EffectComposer(R); comp.addPass(new THREE.RenderPass(scene, cam)); comp.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.35, 0.96)) } catch (e) { comp = null } }
  /* stars for the night-blue top of the sky */
  const starG = new THREE.BufferGeometry(), sp = []; for (let i = 0; i < (MOBILE ? 350 : 700); i++) { const a = Math.random() * Math.PI * 2, y = 0.25 + Math.random() * 0.75, r = Math.sqrt(1 - y * y); sp.push(Math.cos(a) * r * 550, y * 550, Math.sin(a) * r * 550) }
  starG.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(starG, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.8, fog: false, depthWrite: false })); scene.add(stars);

  /* ---------- the world, top to bottom ---------- */
  const W = {};
  scene.add(VX.clouds(MOBILE ? 70 : 150, 300, 70, 78, 7));                       // the sea of clouds we fall through
  scene.add(VX.clouds(MOBILE ? 16 : 30, 420, 112, 130, 3));                      // high wisps above the hero
  const low = VX.clouds(MOBILE ? 40 : 80, 360, -18, -12, 11); low.position.z = -230; scene.add(low); // sunset clouds under the home island
  W.finalL = VX.clouds(7, 14, 0, 5, 21); W.finalR = VX.clouds(7, 14, 0, 5, 22); W.finalL.position.set(-11, 0, -176); W.finalR.position.set(11, 0, -176); scene.add(W.finalL, W.finalR);
  const blob = r => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshBasicMaterial({ color: 0x17324d, transparent: true, opacity: 0.22, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = 0.52; return m };

  /* hero spot: Ryzhik and a baby Kumo on a little isle above the clouds */
  W.heroIsle = new THREE.Group(); W.heroIsle.position.set(7, 94, -4); scene.add(W.heroIsle);
  W.heroIsle.add(VX.island('islands', 4, { deco: false }));
  W.hero = VX.hero('ryzhik'); W.hero.G.position.set(-0.4, 0.5, 0.6); W.hero.G.scale.setScalar(1.7); W.hero.G.rotation.y = -0.5; W.hero.wings.visible = true; W.heroIsle.add(W.hero.G);
  /* ---------- dress-up: armour pieces fly off, new ones drop on one by one ---------- */
  const DRESS_ORDER = ['islands', 'olympus', 'chaos', 'dome', 'abyss', 'horai'], _dv = new THREE.Vector3();
  function dress(h, st, id, instant) {
    st.off = st.off || []; st.on = [];
    if (st.arm) st.arm.pieces.forEach(p => st.off.push({ g: p, t: 0, v: V((Math.random() - 0.5) * 3, 2 + Math.random() * 2, (Math.random() - 0.5) * 3) }));
    if (st.wpn) st.off.push({ g: st.wpn, t: 0, v: V(0, 3, 0) });
    st.id = id; st.arm = VX.armor(h, id); st.wpn = st.arm.def.w ? VX.weapon(st.arm.def.w) : null; if (st.wpn) h.armR.add(st.wpn);
    if (instant) return; st.spin = 0;
    const list = [...st.arm.pieces].reverse(); if (st.wpn) list.push(st.wpn);
    list.forEach((g, k) => { g.userData.home = g.userData.home || g.position.clone(); g.scale.setScalar(0.001); st.on.push({ g, t: -0.18 - k * 0.07 }) });
  }
  function dressTick(st, dt0, root) {
    const now = performance.now() / 1000, dt = st.dt = Math.min(0.25, now - (st.lt || now)); st.lt = now; if (!st.off) return;
    st.off = st.off.filter(o => { o.t += dt; o.g.position.addScaledVector(o.v, dt); o.v.y -= 9 * dt; o.g.rotation.x += dt * 6; o.g.scale.setScalar(Math.max(0.001, 1 - o.t * 1.8)); if (o.t > 0.55) { o.g.parent && o.g.parent.remove(o.g); return false } return true });
    st.on = st.on.filter(o => { o.t += dt; if (o.t < 0) return true; const k = Math.min(1, o.t / 0.32), e = 1 - (1 - k) ** 3; const home = o.g.userData.home || V(0, 0, 0); o.g.position.set(home.x, home.y + (1 - e) * 2.4, home.z); const sc = k < 1 ? e * (1 + Math.sin(k * Math.PI) * 0.35) : 1; o.g.scale.setScalar(Math.max(0.001, sc)); if (k >= 1) { if (root && o.g.parent) { o.g.getWorldPosition(_dv); burst(_dv.clone(), 5, [0xffffff, st.arm ? st.arm.def.c3 : 0xffe14d, 0xffe14d], 2.5, 2, 0.08) } if (o.g === st.wpn) o.g.position.copy(home); return false } return true });
  }
  W.dress = { id: null }; dress(W.hero, W.dress, DRESS_ORDER[Math.floor(Math.random() * DRESS_ORDER.length)], true);
  W.pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 9, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); W.pillar.position.set(-0.4, 4.6, 0.6); W.heroIsle.add(W.pillar);
  W.kHero = VX.kumo(1, null, false, ['bunny']); W.kHero.G.position.set(1.9, 0.5, 1.6); W.kHero.G.scale.setScalar(1.15); W.kHero.G.rotation.y = -0.9; W.heroIsle.add(W.kHero.G);
  const olymp = VX.island('olympus', 7); olymp.position.set(-70, 104, -150); olymp.scale.setScalar(1.6); scene.add(olymp);
  if (CFG.action) { W.titan = VX.golem(); W.titan.scale.setScalar(13); W.titan.position.set(95, 40, -170); W.titan.rotation.y = -0.6; scene.add(W.titan); W.hero.armR.add(VX.sword(1.4)); W.hero.armR.children[W.hero.armR.children.length - 1].position.set(0, -0.5, 0.1) }

  /* worlds: four isles on a spiral */
  W.ring = new THREE.Group(); W.ring.position.set(0, 47, -12); scene.add(W.ring); W.isles = [];

  /* blade trail: a ribbon between the hilt and the tip, fading behind the swing */
  function makeTrail(g, col, n) {
    n = n || 16; const pos = new Float32Array(n * 6), cl = new Float32Array(n * 6), idx = [];
    for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cl, 3)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); m.frustumCulled = false; g.add(m);
    return { m, n, pos, cl, col: new THREE.Color(col), pts: [] };
  }
  const _ta = new THREE.Vector3(), _tb = new THREE.Vector3();
  function trailPush(tr, blade, g, on, len) {
    blade.localToWorld(_ta.set(0, 0.02, 0.35)); blade.localToWorld(_tb.set(0, 0.02, len || 1.8)); _ta.sub(g.position); _tb.sub(g.position);
    tr.pts.unshift([_ta.clone(), _tb.clone(), on ? 1 : 0]); if (tr.pts.length > tr.n) tr.pts.pop();
    for (let i = 0; i < tr.n; i++) {
      const p = tr.pts[Math.min(i, tr.pts.length - 1)], k = (1 - i / (tr.n - 1)) ** 1.6 * p[2] * (tr.pts[0][2] || i > 0 ? 1 : 0), o = i * 6;
      tr.pos[o] = p[0].x; tr.pos[o + 1] = p[0].y; tr.pos[o + 2] = p[0].z; tr.pos[o + 3] = p[1].x; tr.pos[o + 4] = p[1].y; tr.pos[o + 5] = p[1].z;
      tr.cl[o] = tr.col.r * k * 0.25; tr.cl[o + 1] = tr.col.g * k * 0.25; tr.cl[o + 2] = tr.col.b * k * 0.25; tr.cl[o + 3] = Math.min(1, tr.col.r * k * 1.3); tr.cl[o + 4] = Math.min(1, tr.col.g * k * 1.3); tr.cl[o + 5] = Math.min(1, tr.col.b * k * 1.3);
    }
    tr.m.geometry.attributes.position.needsUpdate = true; tr.m.geometry.attributes.color.needsUpdate = true;
  }
  /* jagged lightning made of thin glowing boxes */
  function makeBolt(g, col, n) { const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }); const segs = []; for (let k = 0; k < (n || 8); k++) { const m = new THREE.Mesh(VX.BOX, mat); m.frustumCulled = false; g.add(m); segs.push(m) } return { segs, mat, g } }
  const _bw = new THREE.Vector3();
  function boltSet(b, from, to, jit, w) {
    const n = b.segs.length; let prev = from.clone();
    for (let k = 0; k < n; k++) { const nx = k === n - 1 ? to.clone() : from.clone().lerp(to, (k + 1) / n).add(V((Math.random() - 0.5) * jit, (Math.random() - 0.5) * jit, (Math.random() - 0.5) * jit)); const m = b.segs[k]; m.position.copy(prev).add(nx).multiplyScalar(0.5); m.scale.set(w, w, prev.distanceTo(nx) + w); m.lookAt(_bw.copy(nx).add(b.g.position)); prev = nx }
  }
  /* four-ray star for the glint on the blade */
  function makeStar(g, col) { const st = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }); [[0.05, 0.9, 0.05], [0.9, 0.05, 0.05], [0.05, 0.05, 0.9]].forEach(d => { const m = new THREE.Mesh(VX.BOX, mat); m.scale.set(...d); st.add(m) }); st.visible = false; g.add(st); return st }
  const ease = { o: x => 1 - (1 - x) ** 3, io: x => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2, k: (u, a, b) => Math.min(1, Math.max(0, (u - a) / (b - a))) };

  /* mechanics stations along the way down */
  let SLOT0 = 0; const slot = n => new THREE.Vector3(n % 2 ? 9 : -9, 30 - n * 4, -44 - n * 30); const ST = [], stPos = i => slot(i + SLOT0);
  function station(i, kind, pos) {
    const g = new THREE.Group(), p = pos || stPos(i); g.position.copy(p); scene.add(g); const s = { g, kind, p, parts: {} };
    const wt = kind.startsWith('w-') ? kind.slice(2) : null;
    const base = wt ? VX.island(wt, 7) : VX.island(kind === 'fight' ? 'horai' : kind === 'boss' ? 'olympus' : kind === 'craft' ? 'abyss' : 'islands', kind === 'boss' ? 6 : 5, { deco: false }); g.add(base);
    if (wt) worldActors(s, wt, g);
    if (kind === 'jump') { s.h = VX.hero('ryzhik'); s.h.wings.visible = true; g.add(s.h.G); s.blocks = []; for (let k = 0; k < 5; k++) { const b = VX.island('islands', 1, { deco: false }); b.scale.setScalar(0.9); b.position.set(-4 + k * 2.2, 1 + k * 1.4, -1 + Math.sin(k) * 0.8); g.add(b); s.blocks.push(b) } }
    if (kind === 'fight') { s.h = VX.hero('ryzhik'); s.sw = VX.katana(); s.h.armR.add(s.sw); s.sw.position.set(0, -0.5, 0.1); s.sw.rotation.x = 1.4; s.h.G.position.set(-1.8, 0.5, 0); s.h.G.rotation.y = Math.PI / 2; g.add(s.h.G); s.m = VX.oni(); s.m.position.set(1.4, 0.5, 0); s.m.rotation.y = -Math.PI / 2; s.m.scale.setScalar(0.7); g.add(s.m);
      s.tr = makeTrail(g, 0x5fd8ff, 18); s.bolt = makeBolt(g, 0xbff4ff, 10); s.bolt2 = makeBolt(g, 0x7fe8ff, 6); s.bolt3 = makeBolt(g, 0x7fe8ff, 6); s.star = makeStar(g, 0xffffff);
      s.ring = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 56), new THREE.MeshBasicMaterial({ color: 0x7fe8ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); s.ring.rotation.x = -Math.PI / 2; g.add(s.ring); s.ring2 = s.ring.clone(); s.ring2.material = s.ring.material.clone(); g.add(s.ring2); s.hits = {} }
    if (kind === 'boss') { s.b = VX.golem(); s.b.position.set(1.5, 0.5, -1); s.b.rotation.y = -0.5; g.add(s.b); s.h = VX.hero('ryzhik'); s.sw = VX.sword(1.1); s.h.armR.add(s.sw); s.sw.position.set(0, -0.5, 0.1); s.sw.rotation.x = 1.4; s.h.G.position.set(-3, 0.5, 2); s.h.G.rotation.y = 2.4; g.add(s.h.G); s.btr = makeTrail(g, 0xffe9a0, 14);
      s.ringW = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.0, 32), new THREE.MeshBasicMaterial({ color: 0xffe14d, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); s.ringW.rotation.x = -Math.PI / 2; s.ringW.position.set(1.5, 0.6, -1); g.add(s.ringW) }
    if (kind === 'craft') { s.a = VX.anvil(); s.a.position.set(0.6, 0.5, 0); g.add(s.a); s.h = VX.hero('ryzhik'); s.h.G.position.set(-0.8, 0.5, 0.2); s.h.G.rotation.y = Math.PI / 2; g.add(s.h.G); const hm = new THREE.Group(); VX.B(hm, 0.08, 0.08, 0.5, 0x6b4226, 0, 0, 0.25); VX.B(hm, 0.3, 0.2, 0.2, 0x8a8a96, 0, 0, 0.55); s.h.armR.add(hm); hm.position.set(0, -0.5, 0); hm.rotation.x = 1.2; s.hm = hm; s.dr = {}; dress(s.h, s.dr, 'base', true); s.k = 0 }
    if (kind === 'home') { s.h = VX.hero('ryzhik'); s.h.G.position.set(-1.2, 0.5, 1.2); s.h.G.rotation.y = 0.6; g.add(s.h.G); s.crops = []; for (let k = 0; k < 6; k++) { const c = new THREE.Group(); VX.B(c, 0.9, 0.12, 0.9, 0x8b5a2b, 0, 0.06, 0); const pl = new THREE.Group(); VX.B(pl, 0.24, 0.24, 0.24, [0xff8a2a, 0xffd860, 0xff9a3a][k % 3], 0, 0.25, 0); VX.B(pl, 0.08, 0.3, 0.08, 0x5cc23a, 0, 0.5, 0); c.add(pl); c.userData.pl = pl; c.position.set(0.6 + (k % 3) * 1.05, 0.52, -1 + Math.floor(k / 3) * 1.05); g.add(c); s.crops.push(c) }
      s.k = VX.kumo(2, null, false, ['shell']); s.k.G.scale.setScalar(0.55); s.k.G.position.set(-2.2, 0.5, -0.4); g.add(s.k.G) }
    if (kind === 'coop') { s.h = VX.hero('ryzhik'); s.h2 = VX.hero('rina'); g.add(s.h.G, s.h2.G); s.k = VX.kumo(1, null, false, ['bunny']); s.k.G.scale.setScalar(0.62); g.add(s.k.G) }
    [s.h, s.h2].forEach(h => h && h.G.scale.setScalar(1.35)); ST.push(s); return s;
  }

  /* home island with the big Kumo */
  W.home = new THREE.Group(); W.home.position.set(0, 4, -190); scene.add(W.home); W.home.add(VX.island('home', 9));
  W.pod = new THREE.Group(); W.pod.position.set(3.2, 0.5, 2.5); W.home.add(W.pod);
  const podM = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.35, 28), new THREE.MeshLambertMaterial({ color: 0xffffff })); podM.position.y = 0.17; W.pod.add(podM);
  W.kumoSlot = new THREE.Group(); W.kumoSlot.position.y = 0.35; W.pod.add(W.kumoSlot);
  W.babies = [VX.kumo(1, null, false, ['wings']), VX.kumo(2, 'lug', false, ['shell', 'bunny'])]; W.babies.forEach((k, i) => { k.G.scale.setScalar(0.5); k.G.position.set(-1 + i * 2.6, 0.5, 5.5); W.home.add(k.G) });

  function placeHome() {
    const n = SLOT0 + MECH.length, z = -44 - (n - 1) * 30 - 52, dz = z - W.home.position.z; if (Math.abs(dz) < 1) return;
    [W.home, low, W.finalL, W.finalR].forEach(o => o.position.z += dz); ['kumo', 'market', 'road', 'final', 'odds', 'creators', 'about', 'faq'].forEach(k => { POSE[k].p.z += dz; POSE[k].l.z += dz });
  }
  /* world stops: each world gets its own enemies and action */
  function worldActors(s, wt, g) {
    s.wt = wt; s.h = VX.hero('ryzhik'); s.sw = VX.sword(1.3); s.h.armR.add(s.sw); s.sw.position.set(0, -0.5, 0.1); s.sw.rotation.x = 1.4; s.h.G.position.set(-1.9, 0.5, 3.6); s.h.G.rotation.y = 1.1; s.h.G.scale.setScalar(1.3); g.add(s.h.G);
    if (wt === 'islands') { s.h.wings.visible = true; s.foes = [0, 1, 2].map(k => { const j = VX.jelly(); j.position.set(0.8 + k * 1.3, 0.5, 2.4 + k * 0.5); g.add(j); return j }) }
    if (wt === 'olympus') { s.b = VX.golem(); s.b.position.set(2, 0.5, 2.6); s.b.rotation.y = -0.6; s.b.scale.setScalar(0.8); g.add(s.b) }
    if (wt === 'chaos') { s.b = VX.oni(); s.b.position.set(1.8, 0.5, 2.6); s.b.rotation.y = -0.7; s.b.scale.setScalar(1.15); g.add(s.b) }
    if (wt === 'dome') { s.ring = new THREE.Group(); s.ring.position.set(0.4, 3, 2.6); g.add(s.ring); for (let k = 0; k < 8; k++) { const st = new THREE.Mesh(VX.BOX, VX.bas(k % 2 ? 0xffffff : 0x9fd8ff)); st.scale.setScalar(0.32); const a = k / 8 * Math.PI * 2; st.position.set(Math.cos(a) * 2.6, 0, Math.sin(a) * 2.6); st.rotation.set(0.6, 0.6, 0); s.ring.add(st) } }
    if (wt === 'abyss') { s.foes = [0, 1, 2].map(k => { const j = VX.jelly(); j.children[0].material = new THREE.MeshLambertMaterial({ color: 0x5a2a8a, transparent: true, opacity: 0.8, emissive: 0x2a0a4a }); j.children[1].material = j.children[2].material = VX.bas(0x5ff0ff); j.scale.setScalar(1.2); g.add(j); return j }) }
    if (wt === 'horai') { s.b = VX.oni(); s.b.position.set(1.6, 0.5, 3); s.b.rotation.y = -Math.PI / 2; s.b.scale.setScalar(0.85); g.add(s.b); s.h.G.position.set(-1.3, 0.5, 3); s.h.G.rotation.y = Math.PI / 2;
      s.arc = new THREE.Mesh(new THREE.RingGeometry(0.9, 2.1, 32, 1, -1.3, 2.6), new THREE.MeshBasicMaterial({ color: 0xff4a8a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); s.arc.rotation.x = -Math.PI / 2; s.arc.position.set(-0.4, 1.6, 3); g.add(s.arc) }
  }
  /* lightning: a zigzag bolt, a white flash and thunder */
  const flashEl = document.createElement('div'); flashEl.id = 'flash'; document.body.appendChild(flashEl); let shakeK = 0;
  function strike(at) {
    const pts = [], top = at.clone().add(V((Math.random() - 0.5) * 8, 22, (Math.random() - 0.5) * 8)); for (let k = 0; k <= 9; k++) { const p = top.clone().lerp(at, k / 9); if (k && k < 9) { p.x += (Math.random() - 0.5) * 2; p.z += (Math.random() - 0.5) * 2 } pts.push(p) }
    const geo = new THREE.BufferGeometry().setFromPoints(pts), lines = [0xffffff, 0xfff2a0, 0x9fd8ff].map((c, i) => { const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 1 })); l.position.x = i * 0.06; scene.add(l); return l });
    let tt = 0; const iv = setInterval(() => { tt += 0.04; lines.forEach(l => l.material.opacity = Math.max(0, 1 - tt / 0.35)); if (tt > 0.35) { clearInterval(iv); lines.forEach(l => { scene.remove(l); l.material.dispose() }); geo.dispose() } }, 40);
    burst(at.clone().add(V(0, 0.6, 0)), 22, [0xfff2a0, 0xffffff, 0x9fd8ff], 7, 5, 0.14); flashEl.style.transition = 'none'; flashEl.style.opacity = 0.55; requestAnimationFrame(() => { flashEl.style.transition = 'opacity .5s'; flashEl.style.opacity = 0 }); shakeK = 0.6;
    if (typeof AU !== 'undefined' && AU.on) { const C = AU.C, t = C.currentTime, src = C.createBufferSource(), nb = C.createBuffer(1, C.sampleRate * 2, C.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2); src.buffer = nb; const f = C.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; const g2 = C.createGain(); g2.gain.value = 0.35; src.connect(f); f.connect(g2); g2.connect(AU.sfx); g2.connect(AU.rev); src.start(t) }
  }
  let strikeT = 2;
  /* particles: one pool for sparks, hearts and confetti */
  const PN = 260, PM = new THREE.InstancedMesh(VX.BOX, new THREE.MeshBasicMaterial({ color: 0xffffff }), PN), PD = []; PM.frustumCulled = false; scene.add(PM);
  const _o = new THREE.Object3D(), _col = new THREE.Color();
  for (let i = 0; i < PN; i++) { PD.push({ life: 0 }); _o.scale.setScalar(0); _o.updateMatrix(); PM.setMatrixAt(i, _o.matrix); PM.setColorAt(i, _col.setHex(0xffffff)) }
  let pi = 0; function burst(p, n, cols, sp, up, size) { for (let k = 0; k < n; k++) { const d = PD[pi = (pi + 1) % PN]; d.p = p.clone(); d.v = new THREE.Vector3((Math.random() - 0.5) * sp, Math.random() * up, (Math.random() - 0.5) * sp); d.life = d.max = 0.6 + Math.random() * 0.5; d.s = size || 0.12; PM.setColorAt(pi, _col.setHex(cols[k % cols.length])) } if (PM.instanceColor) PM.instanceColor.needsUpdate = true }
  function updParts(dt) { for (let i = 0; i < PN; i++) { const d = PD[i]; if (d.life <= 0) continue; d.life -= dt; d.v.y -= 6 * dt; d.p.addScaledVector(d.v, dt); _o.position.copy(d.p); _o.scale.setScalar(d.life > 0 ? d.s * Math.min(1, d.life / d.max * 2) : 0); _o.rotation.set(d.life * 6, d.life * 4, 0); _o.updateMatrix(); PM.setMatrixAt(i, _o.matrix) } PM.instanceMatrix.needsUpdate = true }

  /* wind streaks that show up when you scroll fast */
  const WN = MOBILE ? 50 : 110, WM = new THREE.InstancedMesh(VX.BOX, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }), WN), WD = []; WM.frustumCulled = false; scene.add(WM);
  for (let i = 0; i < WN; i++)WD.push(new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, -Math.random() * 30 - 2));

  /* ---------- camera poses and the sky palette for each section ---------- */
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const POSE = {
    hero: { p: MOBILE ? V(4, 101.5, 19) : V(-1, 99, 14), l: MOBILE ? V(6.5, 99.6, -4) : V(4, 95.5, -6), fov: MOBILE ? 58 : 52, sky: ['#1e2260', '#ff9ac0', '#ffd9a0'], fog: ['#ffc8b0', 70, 360], st: 0.9 },
    dive: { p: V(2, 80, 6), l: V(0, 55, -12), fov: 72, sky: ['#cfe0ff', '#f2f6ff', '#ffffff'], fog: ['#f4f7ff', 2, 40], st: 0.2 },
    worlds: { p: V(0, 51, 15), l: V(MOBILE ? 0 : -6, 47.5, -12), fov: 50, sky: ['#3d8fe8', '#8fd3ff', '#e6f6ff'], fog: ['#cfeaff', 50, 260], st: 0 },
    kumo: { p: V(MOBILE ? 4 : 6.5, 8.8, -173.5), l: V(MOBILE ? 3.2 : -0.6, 5.6, -187.5), fov: 44, sky: ['#5aa8ff', '#ffd6a8', '#fff0d8'], fog: ['#ffe6cc', 40, 240], st: 0 },
    market: { p: V(10, 14, -168), l: V(0, 6, -190), fov: 50, sky: ['#5a8ef0', '#ffc8a8', '#ffe8cc'], fog: ['#ffdcc0', 40, 240], st: 0 },
    road: { p: V(-6, 16, -140), l: V(4, -6, -250), fov: 56, sky: ['#241a5e', '#6a3a9a', '#e8708a'], fog: ['#8a4a8a', 30, 240], st: 0.5 },
    odds: { p: V(MOBILE ? 2 : 10, 11, -170), l: V(MOBILE ? 0 : -5, 4, -190), fov: 46, sky: ['#5a9af8', '#ffcaa8', '#fff0d8'], fog: ['#ffe2c8', 40, 240], st: 0 },
    creators: { p: V(-26, 30, -148), l: V(6, 2, -196), fov: 48, sky: ['#4a6ae0', '#ffa8a0', '#ffd8b0'], fog: ['#ffc0a8', 40, 240], st: 0.1 },
    about: { p: V(10, 22, -146), l: V(-30, 2, -250), fov: 54, sky: ['#1e1a5a', '#5a2a8a', '#d8607a'], fog: ['#6a3a7a', 30, 240], st: 0.7 },
    faq: { p: V(-4, 18, -146), l: V(20, 0, -250), fov: 54, sky: ['#18164e', '#4a2a80', '#c8587a'], fog: ['#5a3070', 30, 240], st: 0.8 },
    final: { p: V(0, 7, -150), l: V(0, 10.5, -190), fov: 50, sky: ['#2a2a78', '#ff7a9a', '#ffcf8a'], fog: ['#ff9a8a', 40, 260], st: 0.6 }
  };
  if (CFG.night) Object.assign(POSE.hero, { sky: ['#07061a', '#3a1a5a', '#8a3a5a'], fog: ['#4a2a5a', 60, 340], st: 1 }), Object.assign(POSE.dive, { sky: ['#2a2a4a', '#8a8aa8', '#c8c8d8'], fog: ['#9a9ab8', 2, 40] }), Object.assign(POSE.kumo, { sky: ['#1a1640', '#ff7a6a', '#ffcf8a'], fog: ['#c87a7a', 40, 240], st: 0.4 }), Object.assign(POSE.market, { sky: ['#1a1640', '#c85a8a', '#ffb07a'], fog: ['#a85a7a', 40, 240], st: 0.5 });
  const SKY_T = { islands: [['#3a6ad8', '#ffb38a', '#ffe2b0'], '#ffd0a8', 0.1], olympus: [['#1a1640', '#6a4a9a', '#ffcf8a'], '#8a6a9a', 0.3], chaos: [['#1a0608', '#7a1a1a', '#ff6a2a'], '#7a2a1a', 0.2], dome: [['#05051a', '#1a1a5a', '#5a4ab8'], '#2a2a6a', 1], abyss: [['#0a0414', '#2a0a40', '#6a2a8a'], '#2a1040', 0.7], horai: [['#0a0a24', '#4a1a6a', '#ff4a8a'], '#4a1a5a', 0.6] };
  const wPose = (i, right, theme) => { const P = stPose(0, right, slot(i)), T = SKY_T[theme] || SKY_T.islands; P.sky = T[0]; P.fog = [T[1], 30, 200]; P.st = T[2]; return P };
  Object.assign(POSE, {
    tech: { p: V(-30, 36, -146), l: V(-80, 2, -262), fov: 54, sky: ['#3d8fe8', '#9fd8ff', '#eaf8ff'], fog: ['#d6eeff', 50, 260], st: 0 },
    modes: { p: V(-22, 34, -150), l: V(44, -2, -266), fov: 54, sky: ['#4a8ae0', '#b8d8ff', '#fff0e0'], fog: ['#e6eeff', 50, 260], st: 0 },
    ui: { p: V(-12, 32, -154), l: V(-56, -4, -276), fov: 54, sky: ['#5a8ae8', '#ffd6b8', '#fff2e0'], fog: ['#ffe6d6', 50, 260], st: 0 },
    plat: { p: V(-2, 28, -158), l: V(30, -4, -266), fov: 54, sky: ['#5aa8ff', '#ffd6a8', '#fff0d8'], fog: ['#ffe6cc', 50, 260], st: 0 }
  });
  const stPose = (i, right, P0) => { const p = P0 || stPos(i), sx = MOBILE ? 0 : right ? -4.2 : 4.2; return { p: V(p.x - sx * 0.4, p.y + 7.5, p.z + 19), l: V(p.x - sx * 0.95, p.y + (MOBILE ? -1.2 : 1.4), p.z), fov: 46, sky: ['#4aa0ff', '#9fd8ff', '#eaf8ff'], fog: ['#d6eeff', 40, 220], st: 0 } };

  /* ---------- data: worlds, mechanics, roadmap ---------- */
  let WORLDS = [], MECH = [], ROAD = [], TECH = [], MODES = [], UI = [], BOSSES = { acts: [], bosses: [] }, NEWS = { news: [], events: [] }, ARS = { cats: [], items: [] }, MAPD = { worlds: [] }, PATCH = [];
  async function load() {
    const get = async u => { try { const r = await fetch(u); return r.ok ? await r.json() : [] } catch (e) { return [] } };
    [WORLDS, MECH, ROAD] = await Promise.all([get(CFG.worlds || 'landing/data/worlds.json'), get(CFG.mechanics || 'landing/data/mechanics.json'), get('landing/data/roadmap.json')]); pre.set(55); if (CFG.stack) SLOT0 = WORLDS.length; [BOSSES, NEWS, ARS] = await Promise.all([get('landing/data/bosses.json'), get('landing/data/news.json'), get('landing/data/arsenal.json')]); MAPD = await get('landing/data/map.json'); PATCH = await get('landing/data/patches.json').catch(() => []); [TECH, MODES, UI] = await Promise.all([get('landing/data/techniques.json'), get('landing/data/modes.json'), get('landing/data/ui.json')]);
    if (!CFG.stack) WORLDS.forEach((w, i) => { const g = VX.island(w.theme, 5); const holder = new THREE.Group(); holder.add(g); W.ring.add(holder); W.isles.push(holder); const fol = []; const add = (o, x, z, sc) => { o.position.set(x, 0.5, z); o.scale.setScalar(sc); g.add(o); fol.push(o) };
      if (w.theme === 'islands') { add(VX.jelly(), 2.2, 2.4, 0.9); add(VX.kumo(1, null, false, ['bunny']).G, -1.8, 2.6, 0.55); const h = VX.hero('ryzhik'); h.wings.visible = true; add(h.G, 0.4, 3, 0.9) }
      if (w.theme === 'olympus') { add(VX.golem(), 2.6, 2.2, 0.38); const h = VX.hero('rina'); add(h.G, -1.6, 3, 0.9) }
      if (w.theme === 'horai') { add(VX.oni(), 2.2, 2.4, 0.45); const h = VX.hero('ryzhik'); h.armR.add(VX.sword(1.1)); add(h.G, -1.2, 3, 0.9) }
      if (w.theme === 'abyss') { [0, 1].forEach(k => { const j = VX.jelly(); j.children[0].material = new THREE.MeshLambertMaterial({ color: 0x5a2a8a, transparent: true, opacity: 0.8, emissive: 0x2a0a4a }); j.children[1].material = j.children[2].material = VX.bas(0x5ff0ff); add(j, -2 + k * 3.6, 2.2, 0.9) }) }
      holder.userData.fol = fol });
    if (CFG.stack) { const wl = $('worldStack'); WORLDS.forEach((w, i) => { const a = document.createElement('article'); a.className = 'mech world' + (i % 2 ? '' : ' right'); a.dataset.cam = 'w' + i; a.style.setProperty('--wc', w.color); a.innerHTML = '<div class="wrap"><div class="m-card w-card reveal"><span class="m-n"></span><p class="w-biome"></p><h3></h3><p class="w-desc"></p><ul class="w-feat"></ul></div></div>'; wl.appendChild(a); station(i, 'w-' + w.theme, slot(i)); POSE['w' + i] = wPose(i, i % 2 === 0, w.theme) }); placeHome() }
    const ml = $('mechList'); MECH.forEach((m, i) => { const a = document.createElement('article'); a.className = 'mech' + (i % 2 ? '' : ' right'); a.dataset.cam = 'm' + i; a.innerHTML = '<div class="wrap"><div class="m-card reveal"><span class="m-n">0' + (i + 1) + '</span><span class="m-k"></span><h3></h3><p></p><div class="m-stats"></div><ul class="m-list"></ul></div></div>'; if (m.id === 'coop') { const db = document.createElement('button'); db.className = 'boss-btn ar-btn'; db.innerHTML = '<span class="ar-ics">' + ['duo', 'glove', 'house'].map(p => '<span>' + pix(p) + '</span>').join('') + '</span><b data-i18n="duo.btn"></b><i>▶</i>'; db.querySelector('b').textContent = L()['duo.btn']; db.onclick = () => { const t = $('duo'); if (t) (lenis ? lenis.scrollTo(t) : t.scrollIntoView({ behavior: "smooth" })) }; a.querySelector('.m-card').appendChild(db) } if (m.id === 'fight' || m.id === 'craft') { const ab = document.createElement('button'); ab.className = 'boss-btn ar-btn'; const k = m.id === 'fight' ? 'ar.btnW' : 'ar.btnA'; ab.innerHTML = '<span class="ar-ics"></span><b data-i18n="' + k + '"></b><i>▶</i>'; ab.querySelector('b').textContent = L()[k]; ab.querySelector('.ar-ics').innerHTML = (m.id === 'fight' ? ['sword', 'pvp', 'star'] : ['shield', 'wings', 'heart']).map(p => '<span>' + pix(p) + '</span>').join(''); ab.onclick = () => arOpen(m.id === 'fight' ? 'weapon' : 'armor'); a.querySelector('.m-card').appendChild(ab) } if (m.id === 'boss') { const bb = document.createElement('button'); bb.className = 'boss-btn'; bb.innerHTML = '<span class="bb-faces"></span><b data-i18n="boss.btn"></b><i>▶</i>'; bb.querySelector('b').textContent = L()['boss.btn']; bb.onclick = () => bossOpen(); a.querySelector('.m-card').appendChild(bb) } ml.appendChild(a); station(i, m.scene); POSE['m' + i] = stPose(i, i % 2 === 0) });
    renderData(); pre.set(75);
  }
  function renderData() {
    qa('.mech.world').forEach((a, i) => { const w = WORLDS[i]; if (!w) return; a.querySelector('.m-n').textContent = (LANG === 'en' ? 'WORLD ' : 'МИР ') + '0' + (i + 1); a.querySelector('h3').textContent = w.name[LANG]; a.querySelector('.w-biome').textContent = w.biome[LANG]; a.querySelector('.w-desc').textContent = w.desc[LANG]; const ul = a.querySelector('.w-feat'); ul.innerHTML = ''; w.features[LANG].forEach(f => { const li = document.createElement('li'); li.textContent = f; ul.appendChild(li) }) });
    qa('.mech:not(.world)').forEach((a, i) => { const m = MECH[i]; if (!m) return; a.querySelector('h3').textContent = m.title[LANG]; a.querySelector('p').textContent = m.text[LANG]; const k = a.querySelector('.m-k'); if (k) k.textContent = m.kicker ? m.kicker[LANG] : '';
      const st = a.querySelector('.m-stats'); if (st) { st.innerHTML = ''; (m.stats || []).forEach(x => { const d = document.createElement('div'); d.innerHTML = '<b></b><span></span>'; d.querySelector('b').textContent = x.n; d.querySelector('span').textContent = x[LANG]; st.appendChild(d) }) }
      const ul = a.querySelector('.m-list'); if (ul) { ul.innerHTML = ''; (m.list || []).forEach(x => { const li = document.createElement('li'); li.innerHTML = '<span class="ml-ic">' + pix(x.px) + '</span><span></span>'; li.lastChild.textContent = x[LANG]; ul.appendChild(li) }) } });
    const rl = $('roadList'); rl.innerHTML = ''; if (rl.classList.contains('road-cols')) { ['done', 'progress', 'next', 'later'].forEach(st => { const col = document.createElement('div'); col.className = 'rc rc-' + st; const items = ROAD.filter(r => r.status === st); col.innerHTML = '<h3><i></i><span></span><em></em></h3>'; col.querySelector('span').textContent = L().status[st]; col.querySelector('em').textContent = items.length; items.forEach(r => { const d = document.createElement('div'); d.className = 'rc-i'; d.innerHTML = '<b></b><p></p>'; d.querySelector('b').textContent = r.title[LANG]; d.querySelector('p').textContent = r.text[LANG]; col.appendChild(d) }); rl.appendChild(col) }) } else ROAD.forEach(r => { const li = document.createElement('li'); li.className = r.status; li.innerHTML = '<span class="st"></span><b></b><p></p>'; li.querySelector('.st').textContent = L().status[r.status]; li.querySelector('b').textContent = r.title[LANG]; li.querySelector('p').textContent = r.text[LANG]; rl.appendChild(li) });
    const tg = $('techGrid'); if (tg) { tg.innerHTML = ''; TECH.forEach((x, ti) => { const d = document.createElement('div'); d.className = 'tech reveal-c'; d.tabIndex = 0; d.setAttribute('role', 'tab'); d.setAttribute('aria-selected', ti === (TVS ? TVS.i : 0)); d.onclick = () => { if (TVS) TVS.select(ti, true) }; d.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); d.onclick() } }; d.innerHTML = '<span class="t-ic"></span><span class="t-k"></span><h3></h3><p></p>'; d.querySelector('.t-ic').innerHTML = pix(TECH_PX[TECH.indexOf(x)] || 'star'); d.querySelector('.t-k').textContent = x.keys || ''; d.querySelector('h3').textContent = x.title[LANG]; d.querySelector('p').textContent = x.text[LANG]; tg.appendChild(d) }) }
    const mg = $('modesGrid'); if (mg) { mg.innerHTML = ''; MODES.forEach(x => { const d = document.createElement('div'); d.className = 'mode reveal-c'; d.style.setProperty('--mc', x.color); d.innerHTML = '<div class="m-img"><img loading="lazy" alt=""></div><span class="m-ic"></span><span class="m-tag"></span><h3></h3><p></p>'; d.querySelector('.m-img img').src = 'landing/img/' + MODE_IMG[MODES.indexOf(x)] + '.jpg'; d.querySelector('.m-ic').innerHTML = pix(MODE_PX[MODES.indexOf(x)] || 'star'); d.querySelector('.m-tag').textContent = typeof x.tag === 'string' ? x.tag : x.tag[LANG]; d.querySelector('h3').textContent = x.title[LANG]; d.querySelector('p').textContent = x.text[LANG]; mg.appendChild(d) }) }
    uiShow(UIS.i);
    marketUI(); newsRender(); lbRender(); bossRender(); mapRender(); modeSel(); vsRender(); patchRender(); if ($('arDlg') && $('arDlg').open) arRender();
  }

  /* ---------- technique preview ---------- */
  let TVS = null;
  function techView() { if (TVS || !window.TECHVIEW || !$('techStage') || !TECH.length) return; TVS = TECHVIEW.init($('techStage'), $('techHud'), { lang: () => LANG, onSelect: i => { qa('#techGrid .tech').forEach((d, k) => d.setAttribute('aria-selected', k === i)); tone(600 + i * 50, 0.06) } }) }

  /* ---------- hero dress-up button ---------- */
  const dressBtn = document.createElement('button'); dressBtn.id = 'dressBtn'; dressBtn.className = 'dress-btn'; dressBtn.innerHTML = '<span class="db-hint"><i>✦</i><b></b></span><span class="db-name"></span>'; document.body.appendChild(dressBtn);
  function dressName() { const d = VX.ARMOR[W.dress.id]; return d ? (LANG === 'en' ? d.en + ' · ' + d.we : d.ru + ' · ' + d.wr) : '' }
  function dressLabel() { dressBtn.querySelector('b').textContent = L()['dress.hint'] || ''; dressBtn.querySelector('.db-name').textContent = dressName(); dressBtn.setAttribute('aria-label', (L()['dress.hint'] || '') + ': ' + dressName()) }
  dressBtn.onclick = () => { const i = DRESS_ORDER.indexOf(W.dress.id); dress(W.hero, W.dress, DRESS_ORDER[(i + 1) % DRESS_ORDER.length]); dressBtn.classList.remove('pop'); void dressBtn.offsetWidth; dressBtn.classList.add('pop', 'used'); dressLabel(); W.hero.G.getWorldPosition(_dv); burst(_dv.clone().add(V(0, 1.5, 0)), 30, [0xffffff, W.dress.arm.def.c3, W.dress.arm.def.c, 0xffe14d], 6, 5, 0.12); if (AU.on) { chime(0); chime(2); tone(880, 0.12, 0.1) } };
  const _hp = new THREE.Vector3();
  function dressBtnTick() { if (!W.hero || !W.heroIsle.visible) { dressBtn.style.display = 'none'; return } W.hero.G.getWorldPosition(_hp); _hp.y += 1.5; const d = _hp.distanceTo(cam.position); _hp.project(cam); const on = _hp.z < 1 && scrollY < innerHeight * 0.6; dressBtn.style.display = on ? '' : 'none'; if (!on) return; const px = 2.2 * 1.7 / (d * Math.tan(cam.fov * Math.PI / 360)) * innerHeight / 2; dressBtn.style.transform = 'translate(' + ((_hp.x + 1) / 2 * innerWidth - px * 0.45) + 'px,' + ((1 - _hp.y) / 2 * innerHeight - px * 0.62) + 'px)'; dressBtn.style.width = px * 0.9 + 'px'; dressBtn.style.height = px * 1.25 + 'px' }

  /* ---------- pixel icons: 8x8 grids, 1 = ink, 2 = accent ---------- */
  const PX = {
    jump: ['...11...', '..1221..', '.122221.', '...22...', '...22...', '........', '.111111.', '.122221.'],
    dash: ['........', '1..1....', '21.21...', '.21.21..', '.21.21..', '21.21...', '1..1....', '........'],
    wall: ['11111111', '12212221', '11111111', '22122212', '11111111', '12212221', '11111111', '........'],
    hook: ['..111...', '.1...1..', '.....1..', '....1...', '...1....', '1..1..1.', '12.1.21.', '.11111..'],
    wings: ['........', '1......1', '11....11', '121..121', '12211221', '.122221.', '..1111..', '........'],
    star: ['...1....', '...1....', '.1.2.1..', '..222...', '1122211.', '..222...', '.1.2.1..', '...1....'],
    pvp: ['1......1', '21....12', '.21..12.', '..2112..', '..1221..', '.12..21.', '11....11', '1......1'],
    sword: ['......11', '.....121', '....121.', '...121..', '1.121...', '.121....', '.21.....', '1.1.....'],
    map: ['11111111', '12221221', '12112121', '12221221', '12112221', '12221211', '12122221', '11111111'],
    cam: ['........', '.11111..', '1222221.', '1211121.', '1212121.', '1211121.', '1222221.', '.11111..'],
    egg: ['...11...', '..1221..', '.122221.', '.121221.', '12222121', '12122221', '.122221.', '..1111..'],
    bug: ['1.1..1.1', '.1.11.1.', '..1221..', '11222211', '.122221.', '11222211', '.122221.', '..1111..'],
    heart: ['........', '.11.11..', '1221221.', '1222221.', '.12221..', '..121...', '...1....', '........'],
    eye: ['........', '..1111..', '.122221.', '12211221', '12211221', '.122221.', '..1111..', '........'],
    book: ['11111111', '12222121', '12112121', '12222121', '12112121', '12222121', '11111111', '.1....1.'],
    duo: ['.11..11.', '1221.221', '1221.221', '.11..11.', '.1....1.', '1211.121', '.11..11.', '.1.11.1.'],
    portal: ['..1111..', '.122221.', '12211221', '121..121', '121..121', '12211221', '.122221.', '..1111..'],
    clock: ['..1111..', '.122221.', '12212221', '12212221', '12211121', '12222221', '.122221.', '..1111..'],
    crown: ['........', '1..1..1.', '11.11.11', '12111121', '12222221', '12222221', '11111111', '........'],
    glove: ['.1111...', '122221..', '1222211.', '12222221', '12222221', '.122221.', '..1111..', '..1221..'],
    house: ['...11...', '..1221..', '.122221.', '12222221', '.111111.', '.122121.', '.122121.', '.111111.'],
    tg: ['......11', '....1121', '..112221', '11222221', '.1122221', '..12.221', '..1..121', '.......1'],
    xlogo: ['11....11', '121..121', '.121121.', '..1221..', '..1221..', '.121121.', '121..121', '11....11'],
    trophy: ['11111111', '12222221', '.122221.', '.122221.', '..1221..', '...11...', '..1221..', '.111111.'],
    whale: ['.....1.1', '......1.', '.111111.', '12222221', '12122221', '12222211', '.111111.', '........'],
    moon: ['..1111..', '.1221...', '1221....', '122.....', '122.....', '1221...1', '.122111.', '..1111..'],
    shield: ['11111111', '12222221', '12211221', '12222221', '12211221', '.122221.', '..1221..', '...11...'],
    chat: ['1111111.', '1222221.', '1211121.', '1222221.', '1111111.', '.11.....', '.1......', '........']
  };
  const TECH_PX = ['jump', 'dash', 'wall', 'hook', 'wings', 'star', 'pvp', 'sword'];
  function pix(name, ink, acc) { const g = PX[name] || PX.star; let r = ''; g.forEach((row, y) => [...row].forEach((c, x) => { if (c === '1' || c === '2') r += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + (c === '1' ? (ink || 'var(--ink2)') : (acc || 'var(--acc,#ffc23c)')) + '"/>' })); return '<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>' }
  qa('[data-px]').forEach(e => e.innerHTML = pix(e.dataset.px));
  /* chapter numbers on section labels */
  qa('main .sec-head .eyebrow, main .kumo-copy .eyebrow, main .plat-copy .eyebrow, main .about-card .eyebrow').forEach((e, i) => e.dataset.ch = String(i + 1).padStart(2, '0'));

  /* ---------- fair odds: hatch 100 eggs ---------- */
  const SIM = { p: 0, total: 0, rare: 0, busy: false };
  if ($('simGrid')) {
    const sg = $('simGrid'); for (let k = 0; k < 100; k++) sg.appendChild(document.createElement('i'));
    qa('.sim-par button').forEach(b => b.onclick = () => { SIM.p = +b.dataset.p; qa('.sim-par button').forEach(x => x.setAttribute('aria-checked', x === b)); tone(520 + SIM.p * 120, 0.06) });
    $('simGo').onclick = () => {
      if (SIM.busy) return; SIM.busy = true; const pr = [0.01, 0.03, 0.05][SIM.p], cells = [...sg.children]; let n = 0;
      cells.forEach(c => c.className = ''); $('simN').textContent = '0';
      cells.forEach((c, k) => setTimeout(() => { const r = Math.random() < pr; c.className = r ? 'rare' : 'on'; if (r) { n++; $('simN').textContent = n; chime(n) } else if (k % 10 === 0) tone(380 + k * 3, 0.03); if (k === 99) { SIM.total += 100; SIM.rare += n; $('simT').textContent = SIM.total + ' · ' + SIM.rare + ' ★ (' + (SIM.rare / SIM.total * 100).toFixed(1) + '%)'; SIM.busy = false } }, REDUCED ? 0 : k * 14));
    };
  }
  /* live number of Workshop maps from the game server */
  if ($('crMaps')) fetch('/api/health').then(r => r.ok ? r.json() : null).then(j => { if (j && j.maps > 0) { const el = $('crMaps'); el.innerHTML = '<b></b><span></span>'; el.querySelector('b').textContent = j.maps; el.querySelector('span').dataset.i18n = 'cr.1n'; el.querySelector('span').textContent = L()['cr.1n'] } }).catch(() => { });

  /* ---------- modes art ---------- */
  const MODE_IMG = ['news/m_story', 'news/m_coop', 'news/m_pvp', 'news/ascension', 'news/workshop', 'news/m_race', 'bosses/heracles', 'news/m_fair', 'news/m_home'];
  const MODE_PX = ['book', 'duo', 'pvp', 'portal', 'map', 'clock', 'crown', 'glove', 'house'];

  /* ---------- bestiary: every boss in the game ---------- */
  const BD = { act: 0, sel: 0, snaps: {} };
  function bossImg(b) { return b.img ? 'landing/img/bosses/' + b.img + '.jpg' : BD.snaps[b.id] || '' }
  function bossPic(el, b) { const u = bossImg(b), act = BOSSES.acts.find(a => a.id === b.act); el.style.setProperty('--ac', act ? act.c : '#fff'); if (u) { el.innerHTML = '<img alt="" loading="lazy">'; el.querySelector('img').src = u; el.classList.remove('bph') } else { el.innerHTML = pix('crown') + '<small></small>'; el.querySelector('small').textContent = L()['boss.soon']; el.classList.add('bph') } }
  function bossRender() {
    if (!$('bdGrid') || !BOSSES.bosses.length) return; const acts = $('bdActs'); acts.innerHTML = '';
    [{ id: 0, ru: L()['boss.all'], en: L()['boss.all'], c: '#ffc23c' }].concat(BOSSES.acts).forEach(a => { const b = document.createElement('button'); b.textContent = a[LANG]; b.style.setProperty('--ac', a.c); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', a.id === BD.act); b.onclick = () => { BD.act = a.id; if (a.id) BD.sel = BOSSES.bosses.findIndex(x => x.act === a.id); bossRender(); tone(500 + a.id * 60, 0.05) }; acts.appendChild(b) });
    const g = $('bdGrid'); g.innerHTML = ''; BOSSES.bosses.forEach((b, i) => { if (BD.act && b.act !== BD.act) return; const c = document.createElement('button'); c.className = 'bd-c'; c.setAttribute('aria-pressed', i === BD.sel); c.innerHTML = '<span class="bd-th"></span><b></b><small class="bd-arn"></small>'; bossPic(c.querySelector('.bd-th'), b); c.querySelector('b').textContent = b[LANG]; c.querySelector('.bd-arn').textContent = b.ar[LANG]; c.onclick = () => { BD.sel = i; bossDet(); [...g.children].forEach(x => x.setAttribute('aria-pressed', x === c)); tone(700, 0.05) }; g.appendChild(c) });
    bossDet();
    const fc = qa('.bb-faces')[0]; if (fc && !fc.children.length) ['medusa', 'heracles', 'ryujin', 'atalanta'].forEach(k => { const im = document.createElement('img'); im.src = 'landing/img/bosses/' + k + '.jpg'; im.alt = ''; fc.appendChild(im) });
  }
  function bossDet() { const b = BOSSES.bosses[BD.sel]; if (!b) return; const act = BOSSES.acts.find(a => a.id === b.act); bossPic($('bdPic'), b); $('bdAct').textContent = act ? act[LANG] : ''; $('bdAct').style.background = act ? act.c : ''; $('bdName').textContent = b[LANG]; $('bdAr').textContent = b.ar[LANG]; $('bdD').textContent = b.d[LANG] }
  function bossOpen() { const d = $('bossDlg'); if (!d) return; bossRender(); d.showModal(); if (AU.on) { chime(1); tone(220, 0.3) } }
  if ($('bossDlg')) { $('bdClose').onclick = () => $('bossDlg').close(); $('bossDlg').addEventListener('click', e => { if (e.target === $('bossDlg')) $('bossDlg').close() }) }

  /* ---------- launcher tabs and patch notes ---------- */
  qa('.ln-tabs button').forEach(b => b.onclick = () => { qa('.ln-tabs button').forEach(x => x.setAttribute('aria-selected', x === b)); qa('.ln-pane').forEach(p => p.classList.toggle('on', p.dataset.p === b.dataset.t)); tone(640, 0.05) });
  function patchRender() { const el = $('pnList'); if (!el || !PATCH.length) return; $('pnN').textContent = PATCH.length + '+'; el.innerHTML = ''; PATCH.forEach((p, i) => { const d = document.createElement('details'); d.className = 'pn-i'; if (i === 0) d.open = true; d.innerHTML = '<summary><b class="pn-v"></b><span class="pn-t"></span>' + (i === 0 ? '<em class="pn-new">NEW</em>' : '') + '</summary><ul></ul>'; d.querySelector('.pn-v').textContent = 'v' + p.v; d.querySelector('.pn-t').textContent = p.t; p.b.forEach(x => { const li = document.createElement('li'); li.textContent = x; d.querySelector('ul').appendChild(li) }); el.appendChild(d) }) }

  /* ---------- mode select, like a console menu ---------- */
  const MS = { i: 0, t: null, user: false, flip: false };
  const MODE_META = [
    [['1–32 игрока', 'десятки часов', '6 актов + Последствия'], ['1–32 players', 'dozens of hours', '6 acts + Aftermath']],
    [['2–32 игрока', 'общие боссы', 'лут и опыт обоим'], ['2–32 players', 'shared bosses', 'loot and XP for both']],
    [['2+ игрока', 'в любом мире', 'таблица побед'], ['2+ players', 'in any world', 'win board']],
    [['1 игрок', '~15 минут', 'портал на острове'], ['1 player', '~15 minutes', 'portal on your isle']],
    [['свои карты', 'лайки и звёзды', 'таблица рекордов'], ['your own maps', 'likes and stars', 'record board']],
    [['5 трасс', 'призрак рекорда', 'общие таблицы'], ['5 tracks', 'record ghost', 'shared boards']],
    [['1–2 игрока', 'после падения Зевса', 'волны врагов'], ['1–2 players', 'after Zeus falls', 'waves of foes']],
    [['1–2 игрока', '3 мини-игры', 'билеты Ярмарки'], ['1–2 players', '3 mini-games', 'Fair tickets']],
    [['10 уровней уюта', 'питомцы и Кумо', 'ферма и рыбалка'], ['10 cosiness levels', 'pets and Kumo', 'farming and fishing']]
  ];
  function modeShow(i, user) {
    if (!MODES.length || !$('msList')) return; MS.i = (i + MODES.length) % MODES.length; if (user) MS.user = true; const m = MODES[MS.i], tag = typeof m.tag === 'string' ? m.tag : m.tag[LANG];
    const A = $('msImgA'), B = $('msImgB'), on = MS.flip ? A : B, off = MS.flip ? B : A; MS.flip = !MS.flip; on.src = 'landing/img/' + MODE_IMG[MS.i] + '.jpg'; on.classList.add('on'); off.classList.remove('on');
    $('modeSel').style.setProperty('--mc', m.color); $('msTag').textContent = tag; $('msT').textContent = m.title[LANG]; $('msD').textContent = m.text[LANG]; $('msIdx').textContent = String(MS.i + 1).padStart(2, '0') + ' / ' + String(MODES.length).padStart(2, '0');
    const ch = $('msChips'); ch.innerHTML = ''; (MODE_META[MS.i] || [[], []])[LANG === 'en' ? 1 : 0].forEach(x => { const s = document.createElement('span'); s.textContent = x; ch.appendChild(s) });
    [...$('msList').children].forEach((b, k) => b.setAttribute('aria-selected', k === MS.i)); const info = document.querySelector('.ms-info'); info.classList.remove('in'); void info.offsetWidth; info.classList.add('in');
    const pr = $('msProg'); pr.style.transition = 'none'; pr.style.width = '0'; void pr.offsetWidth; if (!MS.user) { pr.style.transition = 'width 5s linear'; pr.style.width = '100%' }
    clearTimeout(MS.t); if (!MS.user) MS.t = setTimeout(() => modeShow(MS.i + 1), 5000);
  }
  function modeSel() {
    const L2 = $('msList'); if (!L2 || !MODES.length) return; L2.innerHTML = '';
    MODES.forEach((m, k) => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.style.setProperty('--mc', m.color); b.innerHTML = '<span class="ms-n"></span><span class="ms-ic"></span><b></b><i>▶</i>'; b.querySelector('.ms-n').textContent = String(k + 1).padStart(2, '0'); b.querySelector('.ms-ic').innerHTML = pix(MODE_PX[k] || 'star'); b.querySelector('b').textContent = m.title[LANG]; b.onclick = () => { modeShow(k, true); tone(560 + k * 40, 0.05) }; b.onmouseenter = () => { if (matchMedia('(hover:hover)').matches) modeShow(k, true) }; L2.appendChild(b) });
    L2.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); modeShow(MS.i + 1, true); L2.children[MS.i].focus() } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); modeShow(MS.i - 1, true); L2.children[MS.i].focus() } };
    modeShow(MS.i, MS.user);
  }

  /* ---------- together: player 1, the shared stage, player 2 ---------- */
  const SPR = {}, VS = { i: 0, t: null, user: false };
  const VS_IMG = ['news/m_coop', 'news/trio', 'bosses/castor', 'news/m_pvp', '@box', 'news/m_fair', '@hands', 'news/m_home'], VS_PX = ['duo', 'heart', 'crown', 'pvp', 'glove', 'house', 'duo', 'house'];
  function vsShow(i, user) {
    if (!$('vsModes')) return; VS.i = (i + 8) % 8; if (user) VS.user = true; const n = VS.i + 1, src = VS_IMG[VS.i];
    const img = $('vsImg'); img.classList.remove('on'); setTimeout(() => { img.src = src[0] === '@' ? (SPR[src.slice(1)] || '') : 'landing/img/' + src + '.jpg'; img.classList.toggle('spr', src[0] === '@'); img.classList.add('on') }, 120);
    $('vsK').textContent = String(n).padStart(2, '0') + ' / 08'; $('vsT').textContent = L()['duo.' + n + 't']; $('vsD').textContent = L()['duo.' + n + 'd'];
    [...$('vsModes').children].forEach((b, k) => b.setAttribute('aria-selected', k === VS.i)); $('vsBox').dataset.m = VS.i;
    clearTimeout(VS.t); if (!VS.user) VS.t = setTimeout(() => vsShow(VS.i + 1), 4500);
  }
  function vsRender() { const el = $('vsModes'); if (!el) return; el.innerHTML = ''; for (let k = 0; k < 8; k++) { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.title = L()['duo.' + (k + 1) + 't']; b.innerHTML = '<span>' + pix(VS_PX[k]) + '</span><b></b>'; b.querySelector('b').textContent = L()['duo.' + (k + 1) + 't']; b.onclick = () => { vsShow(k, true); tone(600 + k * 40, 0.05) }; el.appendChild(b) } vsShow(VS.i, VS.user) }

  /* ---------- world map ---------- */
  const MV = { w: 0, view: null };
  function mapRender() {
    if (!$('mvStage') || !MAPD.worlds.length || !window.MAPVIEW) return; if (!MV.view) MV.view = MAPVIEW.init($('mvStage'), $('mvLabels'), { onPick: (d, kind) => { const c = $('mvCard'); c.hidden = false; c.className = 'mv-card ' + kind; $('mvSub').textContent = d.sub; $('mvT').textContent = d.title; $('mvD').textContent = d.d; $('mvImg').innerHTML = d.img ? '<img alt="" src="' + d.img + '">' : ''; c.style.setProperty('--rc', d.c || ''); tone(kind === 'boss' ? 300 : 720, 0.08) } });
    const tabs = $('mvTabs'); tabs.innerHTML = ''; MAPD.worlds.forEach((w, i) => { const b = document.createElement('button'); b.textContent = w[LANG]; b.style.setProperty('--wc', w.c); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', i === MV.w); b.onclick = () => { MV.w = i; mapRender(); tone(500 + i * 70, 0.06) }; tabs.appendChild(b) });
    if (!MV.loaded) { if (!MV.obs) { MV.obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !MV.loading) { MV.loading = true; MV.view.load().then(() => { MV.loaded = true; mapRender() }).catch(e => console.warn(e)) } }, { rootMargin: '600px' }); MV.obs.observe($('mvStage')) } return }
    const w = MAPD.worlds[MV.w]; MV.view.build(MV.w, LANG, { regions: w.regions, bosses: BOSSES.bosses }); $('mvCard').hidden = true; const Z = MV.view.count(MV.w);
    $('mvStat').textContent = Z.n.toLocaleString(LANG === 'en' ? 'en-US' : 'ru-RU') + (LANG === 'en' ? ' blocks · ' : ' блоков · ') + Z.flags.length + (LANG === 'en' ? ' flags · ' : ' флажков · ') + Z.bosses.length + (LANG === 'en' ? ' bosses · ' : ' боссов · ') + Z.npcs.length + (LANG === 'en' ? ' NPCs' : ' жителей');
  }
  if ($('mvIn')) { $('mvIn').onclick = () => MV.view && MV.view.zoom(0.85); $('mvOut').onclick = () => MV.view && MV.view.zoom(1.18); $('mvX').onclick = () => { $('mvCard').hidden = true } }

  /* ---------- arsenal ---------- */
  const AR = { cat: 'weapon', sel: 0, view: null };
  function arRender() {
    if (!$('arGrid') || !ARS.items.length) return; const cats = $('arCats'); cats.innerHTML = '';
    ARS.cats.forEach(c => { const b = document.createElement('button'); b.innerHTML = '<span class="ar-ci">' + pix(c.px) + '</span>'; b.appendChild(document.createTextNode(c[LANG] + ' · ' + ARS.items.filter(x => x.cat === c.id).length)); b.style.setProperty('--ac', '#ffc23c'); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', c.id === AR.cat); b.onclick = () => { AR.cat = c.id; AR.sel = ARS.items.findIndex(x => x.cat === c.id); arRender(); tone(520, 0.05) }; cats.appendChild(b) });
    const g = $('arGrid'); g.innerHTML = ''; ARS.items.forEach((it, i) => { if (it.cat !== AR.cat) return; const c = document.createElement('button'); c.className = 'ar-c'; c.style.setProperty('--ic', it.c); c.setAttribute('aria-pressed', i === AR.sel); c.innerHTML = '<span class="ar-dot"></span><b></b><small></small>'; c.querySelector('b').textContent = it[LANG]; c.querySelector('small').textContent = it.tags[LANG][0]; c.onclick = () => { AR.sel = i; arDet(); [...g.children].forEach(x => x.setAttribute('aria-pressed', x === c)); tone(760, 0.05) }; g.appendChild(c) });
    arDet();
  }
  function arDet() { const it = ARS.items[AR.sel]; if (!it) return; const cat = ARS.cats.find(c => c.id === it.cat); $('arCat').textContent = cat ? cat[LANG] : ''; $('arCat').style.background = it.c; $('arName').textContent = it[LANG]; $('arD').textContent = it.d[LANG]; $('arHow').textContent = it.how[LANG]; $('arTags').innerHTML = ''; it.tags[LANG].forEach(x => { const s = document.createElement('span'); s.textContent = x; $('arTags').appendChild(s) }); if (AR.view) AR.view.wear(it) }
  function arOpen(cat) { const d = $('arDlg'); if (!d || !window.ARSENAL) return; AR.cat = cat || 'weapon'; AR.sel = ARS.items.findIndex(x => x.cat === AR.cat); d.showModal(); if (!AR.view) AR.view = ARSENAL.init($('arStage')); AR.view.setOn(true); arRender(); if (AU.on) { chime(3); tone(330, 0.2) } }
  if ($('arDlg')) { const close = () => { $('arDlg').close() }; $('arClose').onclick = close; $('arDlg').addEventListener('click', e => { if (e.target === $('arDlg')) close() }); $('arDlg').addEventListener('close', () => AR.view && AR.view.setOn(false)) }

  /* ---------- what's new + world events ---------- */
  const NW = { i: 0, t: null };
  function newsShow(i) { if (!NEWS.news.length || !$('nwCard')) return; NW.i = (i + NEWS.news.length) % NEWS.news.length; const n = NEWS.news[NW.i], c = $('nwCard'); c.classList.add('fade'); setTimeout(() => { $('nwImg').src = n.img; $('nwTag').textContent = n.tag[LANG]; $('nwT').textContent = n.t[LANG]; $('nwD').textContent = n.d[LANG]; c.classList.remove('fade') }, 180); [...$('nwDots').children].forEach((d, k) => d.classList.toggle('on', k === NW.i)); const pr = $('nwProg'); if (pr) { pr.style.transition = 'none'; pr.style.width = '0'; void pr.offsetWidth; pr.style.transition = 'width 6s linear'; pr.style.width = '100%' } clearTimeout(NW.t); NW.t = setTimeout(() => newsShow(NW.i + 1), 6000) }
  function newsRender() {
    if (!$('nwCard') || !NEWS.news.length) return; const dots = $('nwDots'); dots.innerHTML = ''; NEWS.news.forEach((n, k) => { const d = document.createElement('button'); d.setAttribute('aria-label', n.t[LANG]); d.innerHTML = '<img loading="lazy" alt=""><span></span>'; d.querySelector('img').src = n.img; d.querySelector('span').textContent = n.t[LANG]; d.onclick = () => newsShow(k); dots.appendChild(d) }); $('nwPrev').onclick = () => newsShow(NW.i - 1); $('nwNext').onclick = () => newsShow(NW.i + 1); newsShow(NW.i);
    const el = $('evList'); el.innerHTML = ''; NEWS.events.forEach(e => { const d = document.createElement('div'); d.className = 'ev-i'; d.style.setProperty('--ec', e.c); d.innerHTML = '<span class="ev-ic"><i class="ev-ring"></i></span><div><b></b><em></em><p></p></div>'; d.querySelector('.ev-ic').innerHTML = pix(e.px); d.querySelector('b').textContent = e.t[LANG]; d.querySelector('em').textContent = e.when[LANG]; d.querySelector('p').textContent = e.d[LANG]; el.appendChild(d) });
  }

  /* ---------- leaderboards: live from the game server ---------- */
  const LB = { tab: 'race', track: 0, cache: {} }, LBT = [['race', 'race-'], ['kills', 'kills'], ['pvp', 'pvp'], ['ach', 'ach'], ['creators', 'creators'], ['kumo', null]];
  function lbFmt(tab, v) { if (tab === 'race') { const m = Math.floor(v / 60), s = (v % 60).toFixed(2); return (m ? m + ':' + s.padStart(5, '0') : s) + (LANG === 'en' ? ' s' : ' с') } if (tab === 'creators') return v + ' ★'; return String(v) }
  function lbRender() {
    if (!$('lbTabs')) return; const tb = $('lbTabs'); tb.innerHTML = ''; LBT.forEach(([k]) => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', k === LB.tab); b.textContent = L()['lb.' + k]; b.onclick = () => { LB.tab = k; lbRender(); tone(560, 0.05) }; tb.appendChild(b) });
    const tr = $('lbTracks'); tr.innerHTML = ''; tr.hidden = LB.tab !== 'race'; if (LB.tab === 'race') for (let k = 0; k < 5; k++) { const b = document.createElement('button'); b.textContent = L()['lb.track'] + ' ' + (k + 1); b.setAttribute('aria-pressed', k === LB.track); b.onclick = () => { LB.track = k; lbRender() }; tr.appendChild(b) }
    const list = $('lbList'), board = LBT.find(x => x[0] === LB.tab)[1]; list.innerHTML = '';
    const msg = txt => { const li = document.createElement('li'); li.className = 'lb-empty'; li.textContent = txt; list.appendChild(li) };
    if (!board) return msg(L()['lb.soon']); const key = board === 'race-' ? 'race-' + LB.track : board;
    const draw = rows => { list.innerHTML = ''; if (!rows || !rows.length) return msg(L()['lb.empty']); rows.slice(0, 10).forEach((r, i) => { const li = document.createElement('li'); li.className = i < 3 ? 'top t' + i : ''; li.innerHTML = '<span class="lb-n"></span><b></b><em></em>'; li.querySelector('.lb-n').textContent = i + 1; li.querySelector('b').textContent = r.n || '—'; li.querySelector('em').textContent = lbFmt(LB.tab, r.v); list.appendChild(li) }) };
    if (LB.cache[key]) return draw(LB.cache[key]); msg('…'); fetch('/api/scores?board=' + key).then(r => r.ok ? r.json() : []).then(j => { LB.cache[key] = Array.isArray(j) ? j : []; if (LB.tab === LBT.find(x => x[1] === board)[0]) draw(LB.cache[key]) }).catch(() => draw([]));
  }

  /* ---------- voxel sprites for the device mockups, the community banner and boss snapshots ---------- */
  function sprites() {
    const r2 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r2.setSize(256, 256);
    const s2 = new THREE.Scene(); s2.add(new THREE.HemisphereLight(0xffffff, 0xc8d0e8, 0.95)); const dl = new THREE.DirectionalLight(0xffffff, 0.7); dl.position.set(3, 5, 6); s2.add(dl);
    const c2 = new THREE.PerspectiveCamera(30, 1, 0.1, 50); const snap = (o, y, d) => { c2.position.set(1.4, y + 0.9, d); c2.lookAt(0, y, 0); s2.add(o); r2.render(s2, c2); const u = r2.domElement.toDataURL('image/png'); s2.remove(o); return u };
    const set = (id, u) => { const e = $(id); if (e) e.src = u };
    const h1 = VX.hero('ryzhik'), st1 = {}; dress(h1, st1, 'horai', true); h1.armR.rotation.x = -2.6; h1.armL.rotation.z = 0.4; h1.G.rotation.y = -0.35; const u1 = snap(h1.G, 1.1, 5.2); set('sprHero', u1);
    const h2 = VX.hero('rina'); h2.armR.rotation.x = -2.8; h2.G.rotation.y = 0.4; set('sprRina', snap(h2.G, 1.1, 5.2));
    const k1 = VX.kumo(2, null, false, ['bunny']); k1.G.rotation.y = -0.4; const uk = snap(k1.G, 0.9, 5); set('sprKumo', uk); set('joinKumo', uk);
    const h3 = VX.hero('ryzhik'), st3 = {}; dress(h3, st3, 'olympus', true); h3.armL.rotation.x = -2.8; h3.wings.visible = true; h3.G.rotation.y = 0.5; set('joinHero', snap(h3.G, 1.1, 5.4));
    const j = VX.jelly(); j.scale.setScalar(1.6); BD.snaps.jelly = snap(j, 0.8, 5); const gl = VX.golem(); gl.scale.setScalar(0.42); gl.rotation.y = -0.5; BD.snaps.guard = snap(gl, 1.4, 7.5);
    const p1 = VX.hero('ryzhik'), s1 = {}; dress(p1, s1, 'horai', true); p1.G.rotation.y = 0.45; p1.armR.rotation.x = -0.7; set('vsP1', snap(p1.G, 1.1, 5.0)); const p2 = VX.hero('rina'); p2.G.rotation.y = -0.45; p2.armL.rotation.x = -0.7; set('vsP2', snap(p2.G, 1.1, 5.0));
    const duo = (a, b, pose) => { const g = new THREE.Group(); g.add(a.G, b.G); a.G.position.x = -0.75; b.G.position.x = 0.75; pose(a, b); return g };
    const fist = () => { const f = new THREE.Group(); VX.B(f, 0.42, 0.34, 0.42, 0xff5d8a, 0, 0, 0); VX.B(f, 0.44, 0.1, 0.44, 0xffffff, 0, 0.18, 0); return f };
    c2.fov = 34; c2.updateProjectionMatrix();
    const bx = duo(VX.hero('ryzhik'), VX.hero('rina'), (a, b) => { a.G.rotation.y = 1.25; b.G.rotation.y = -1.25; [a.armR, a.armL, b.armR, b.armL].forEach((arm, k) => { const f = fist(); f.position.set(0, -0.5, 0); arm.add(f); arm.rotation.x = k % 2 ? -1.2 : -1.6 }) }); SPR.box = snap(bx, 1.1, 6.4);
    const hd = duo(VX.hero('ryzhik'), VX.hero('rina'), (a, b) => { a.G.rotation.y = 0.25; b.G.rotation.y = -0.25; a.armR.rotation.z = 0.7; b.armL.rotation.z = -0.7; a.armL.rotation.x = -2.6; b.armR.rotation.x = -2.6; a.G.position.x = -0.62; b.G.position.x = 0.62 }); SPR.hands = snap(hd, 1.1, 6.2);
    r2.dispose(); bossRender(); vsShow(VS.i, VS.user);
  }
  /* devices come alive on scroll: gamepad buttons light up, the data dot travels between screens */
  function devicesAlive() {
    const pad = document.querySelector('.pad-svg'); if (!pad) return; const btns = [...pad.querySelectorAll('circle')].filter(c => +c.getAttribute('r') < 12); let k = 0;
    setInterval(() => { if (document.hidden) return; btns.forEach(b => b.classList.remove('hit')); if (btns.length) btns[k++ % btns.length].classList.add('hit') }, 520);
    if (window.gsap && window.ScrollTrigger && !REDUCED) { const tl = gsap.timeline({ scrollTrigger: { trigger: '.devices', start: 'top 80%' } }); tl.from('.dev-laptop', { x: -120, rotateY: 25, opacity: 0, duration: 0.9, ease: 'power3.out' }).from('.dev-tablet', { x: 120, rotate: 8, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6').from('.dev-phone', { y: 120, rotate: -10, opacity: 0, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.5').from('.dev-pad', { y: -80, opacity: 0, duration: 0.7, ease: 'bounce.out' }, '-=0.4').from('.spr', { scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(2.4)' }, '-=0.2') }
  }

  /* ---------- game interface gallery ---------- */
  const UIS = { i: 0 };
  function uiShow(i) {
    if (!UI.length || !$('uiThumbs')) return; UIS.i = (i + UI.length) % UI.length; const u = UI[UIS.i], img = $('uiImg');
    img.style.opacity = 0; setTimeout(() => { img.src = u.img; img.alt = u.title[LANG]; img.onload = () => img.style.opacity = 1 }, 120);
    $('uiTitle').textContent = u.title[LANG]; $('uiText').textContent = u.text[LANG];
    const th = $('uiThumbs'); if (th.children.length !== UI.length) { th.innerHTML = ''; UI.forEach((x, k) => { const b = document.createElement('button'); b.innerHTML = '<img loading="lazy" alt="">'; b.querySelector('img').src = x.img; b.onclick = () => { uiShow(k); tone(700 + k * 60, 0.08) }; th.appendChild(b) }) }
    [...th.children].forEach((b, k) => { b.setAttribute('aria-selected', k === UIS.i); b.setAttribute('aria-label', UI[k].title[LANG]) });
  }
  const lb = $('lightbox'); if (lb) { $('uiMain').onclick = () => { const u = UI[UIS.i]; if (!u) return; $('lbImg').src = u.img; $('lbCap').textContent = u.title[LANG] + ' — ' + u.text[LANG]; lb.showModal() }; $('lbClose').onclick = () => lb.close(); lb.addEventListener('click', e => { if (e.target === lb) lb.close() }); addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowRight') { uiShow(UIS.i + 1); $('lbImg').src = UI[UIS.i].img } if (e.key === 'ArrowLeft') { uiShow(UIS.i - 1); $('lbImg').src = UI[UIS.i].img } }) }

  /* ---------- worlds carousel ---------- */
  const WC = { idx: 0, f: 0, drag: null };
  function worldUI() {
    const w = WORLDS[WC.idx]; if (!w || !$('wName')) return; $('wName').textContent = w.name[LANG]; $('wBiome').textContent = w.biome[LANG]; $('wDesc').textContent = w.desc[LANG];
    $('wFeat').innerHTML = ''; w.features[LANG].forEach(f => { const li = document.createElement('li'); li.textContent = f; $('wFeat').appendChild(li) }); $('worldCard').style.setProperty('--wc', w.color);
    const d = $('wDots'); if (d.children.length !== WORLDS.length) { d.innerHTML = ''; WORLDS.forEach((x, i) => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.onclick = () => goWorld(i); d.appendChild(b) }) }
    [...d.children].forEach((b, i) => { b.setAttribute('aria-selected', i === WC.idx); b.setAttribute('aria-label', WORLDS[i].name[LANG]) });
  }
  function goWorld(i) { const n = WORLDS.length; if (!n) return; WC.idx = ((i % n) + n) % n; worldUI(); tone(520 + WC.idx * 90, 0.08) }
  if ($('wPrev')) { $('wPrev').onclick = () => goWorld(WC.idx - 1); $('wNext').onclick = () => goWorld(WC.idx + 1) }
  const dz = $('dragZone') || document.createElement('div');
  dz.addEventListener('pointerdown', e => { WC.drag = { x: e.clientX, f: WC.f }; dz.setPointerCapture(e.pointerId) });
  dz.addEventListener('pointermove', e => { if (WC.drag) WC.f = WC.drag.f - (e.clientX - WC.drag.x) / 240 });
  const endDrag = () => { if (!WC.drag) return; WC.drag = null; goWorld(Math.round(WC.f)) }; dz.addEventListener('pointerup', endDrag); dz.addEventListener('pointercancel', endDrag);
  dz.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { goWorld(WC.idx + 1); e.preventDefault() } if (e.key === 'ArrowLeft') { goWorld(WC.idx - 1); e.preventDefault() } });
  function updWorlds(dt, t) {
    const n = W.isles.length; if (!n) return; if (!WC.drag) { let target = WC.idx; const d = target - WC.f; WC.f += (Math.abs(d) > n / 2 ? d - Math.sign(d) * n : d) * Math.min(1, dt * 5); WC.f = ((WC.f % n) + n) % n }
    const step = Math.PI * 2 / n;
    W.isles.forEach((g, i) => { let a = (i - WC.f) * step; a = Math.atan2(Math.sin(a), Math.cos(a)); const R = MOBILE ? 9 : 13; g.position.set(Math.sin(a) * R, -a * 2.2 + Math.sin(t * 0.8 + i) * 0.3, Math.cos(a) * R - R); const k = Math.max(0, 1 - Math.abs(a) / step); g.scale.setScalar(0.6 + 0.55 * k); g.children[0].rotation.y = t * 0.15 + i; (g.userData.fol || []).forEach((o, k) => { o.position.y = 0.5 + Math.abs(Math.sin(t * 2.4 + k * 1.7)) * 0.35 }) });
  }

  /* ---------- Kumo section ---------- */
  const KS = Object.assign({ stage: 1, form: 'lug', rare: false, o: null }, CFG.kumo || {});
  const FORM_CSS = { lug: '#d8f5c0', grom: '#fff0b0', sum: '#e4d4ff', fon: '#ffd6d0', zv: '#d0dcff', rain: '#ffe0f0' };
  function kumoUI() {
    const st = $('kStages'); if (!st.children.length) L().stages.forEach((s, i) => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.onclick = () => { KS.stage = i; kumoBuild(); kumoUI() }; st.appendChild(b) });
    [...st.children].forEach((b, i) => { b.textContent = L().stages[i]; b.setAttribute('aria-selected', i === KS.stage) });
    const fm = $('kForms'); if (!fm.children.length) Object.keys(FORM_CSS).forEach(k => { const b = document.createElement('button'); b.style.setProperty('--fc', FORM_CSS[k]); b.dataset.k = k; b.onclick = () => { KS.form = k; kumoBuild(); kumoUI() }; fm.appendChild(b) });
    [...fm.children].forEach(b => { b.textContent = L().forms[b.dataset.k]; b.setAttribute('aria-pressed', b.dataset.k === KS.form) }); fm.hidden = KS.stage !== 3;
    $('kRare').checked = KS.rare; const rn = KS.rare && KS.stage > 0 ? '★ ' + (KS.stage === 3 ? L().rareN[KS.form] : L().rareN.kid) + ' · ' : '';
    $('kCap').textContent = rn + L().caps[KS.stage];
  }
  $('kRare').onchange = e => { KS.rare = e.target.checked; kumoBuild(); kumoUI(); if (KS.rare) { burst(W.kumoSlot.getWorldPosition(new THREE.Vector3()).add(V(0, 1.2, 0)), 40, [0x39ff14, 0xffee00, 0xff1493, 0x9d00ff], 6, 7, 0.16); tone(1047, 0.25); tone(1568, 0.3, 0.08) } };
  function kumoBuild() {
    if (KS.o) W.kumoSlot.remove(KS.o.G); const parts = KS.stage === 1 ? ['bunny'] : KS.stage === 2 ? ['shell', 'bunny'] : null;
    KS.o = VX.kumo(KS.stage, KS.form, KS.rare, parts); KS.o.G.scale.setScalar(1.25); W.kumoSlot.add(KS.o.G); KS.pop = 0;
    burst(W.kumoSlot.getWorldPosition(new THREE.Vector3()).add(V(0, 1, 0)), 16, [0xffffff, 0xeaf6ff, 0xfff2a0], 4, 4, 0.14);
  }

  /* ---------- marketplace cards: Kumo rendered once into images ---------- */
  const MARKET = [{ s: 3, f: 'lug', r: true, n: 'Ядовитый Луговой', ne: 'Toxic Meadow' }, { s: 1, f: null, r: false, n: 'Пуфик', ne: 'Puffy', p: ['bunny'] }, { s: 3, f: 'grom', r: false, n: 'Громовой', ne: 'Thunder' }, { s: 3, f: 'sum', r: true, n: 'Кислотный Сумрачный', ne: 'Acid Dusk' }, { s: 3, f: 'fon', r: false, n: 'Фонарный', ne: 'Lantern' }, { s: 3, f: 'rain', r: true, n: 'Призматический', ne: 'Prismatic' }];
  let shots = null;
  function snapKumos() {
    const r2 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r2.setSize(256, 256);
    const s2 = new THREE.Scene(); s2.add(new THREE.HemisphereLight(0xffffff, 0xc8d0e8, 0.9)); const dl = new THREE.DirectionalLight(0xffffff, 0.7); dl.position.set(3, 5, 6); s2.add(dl);
    const c2 = new THREE.PerspectiveCamera(30, 1, 0.1, 50); c2.position.set(1.6, 1.9, 5.4); c2.lookAt(0, 0.95, 0);
    shots = MARKET.map(m => { const o = VX.kumo(m.s, m.f, m.r, m.p); o.G.rotation.y = -0.45; if (o.glow) VX.animKumo(o, 0.4, 0); s2.add(o.G); r2.render(s2, c2); const u = r2.domElement.toDataURL('image/png'); s2.remove(o.G); return u });
    r2.dispose(); marketUI();
  }
  function marketUI() {
    if (!shots) return; const g = $('mGrid'); g.innerHTML = '';
    MARKET.forEach((m, i) => { const c = document.createElement('div'); c.className = 'm-cardk reveal' + (m.r ? ' rare' : ''); c.innerHTML = '<span class="tag"></span><img alt=""><b></b><small></small><div class="price"><span>[TOKEN]</span><em></em></div>'; const nm = LANG === 'en' ? m.ne : m.n;
      c.querySelector('img').src = shots[i]; c.querySelector('img').alt = nm; c.querySelector('b').textContent = nm; c.querySelector('.tag').textContent = m.r ? '★ 1%' : (m.s === 3 ? L().adult : L().baby); c.querySelector('small').textContent = '№ ' + ['K7QX-2MLA', 'P0FY-8ZTE', 'GR4M-1NDO', 'AC1D-9DSK', 'L4NT-3ERN', 'PR1Z-M4TC'][i]; c.querySelector('em').textContent = L().soon; g.appendChild(c) });
    if (window.gsap && !REDUCED) gsap.fromTo('#mGrid .m-cardk', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#mGrid', start: 'top 85%' } }); else qa('#mGrid .m-cardk').forEach(e => { e.style.opacity = 1; e.style.transform = 'none' });
  }

  /* ---------- scroll → camera ---------- */
  let anchors = [];
  function measure() { anchors = qa('[data-cam]').map(e => { const r = e.getBoundingClientRect(), top = r.top + scrollY; return { k: e.dataset.cam, c: top + Math.min(r.height, innerHeight * 1.2) / 2 - innerHeight / 2, h: r.height } }).filter(a => POSE[a.k]).sort((a, b) => a.c - b.c) }
  const cur = { p: POSE.hero.p.clone(), l: POSE.hero.l.clone(), fov: 52 }, tgt = { p: new THREE.Vector3(), l: new THREE.Vector3() }, cA = new THREE.Color(), cB = new THREE.Color();
  function poseAt(y) {
    if (!anchors.length) return { a: POSE.hero, b: POSE.hero, t: 0 };
    if (y <= anchors[0].c) return { a: POSE[anchors[0].k], b: POSE[anchors[0].k], t: 0 };
    for (let i = 0; i < anchors.length - 1; i++) { const A = anchors[i], B = anchors[i + 1]; if (y < B.c) { let t = (y - A.c) / (B.c - A.c); const hold = A.h > innerHeight * 1.3 ? 0.45 : 0.12; t = Math.min(1, Math.max(0, (t - hold) / (1 - hold - 0.08))); t = t * t * (3 - 2 * t); return { a: POSE[A.k], b: POSE[B.k], t } } }
    const Z = POSE[anchors[anchors.length - 1].k]; return { a: Z, b: Z, t: 0 };
  }
  function lerpHex(a, b, t, out) { cA.set(a); cB.set(b); return out.copy(cA).lerp(cB, t) }

  /* ---------- sound (off by default): a soft generative tune, wind while scrolling, an airy swell inside the clouds, a chime per section ---------- */
  const AU = { C: null, on: false, next: 0, step: 0, chord: 0, last: -1, timer: 0 };
  const CHORDS = [[130.81, 196, 246.94, 329.63, 293.66], [110, 164.81, 196, 261.63, 246.94], [87.31, 130.81, 174.61, 220, 329.63], [98, 146.83, 196, 246.94, 293.66]];
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
  function auInit() {
    const C = AU.C = new (window.AudioContext || window.webkitAudioContext)(); AU.master = C.createGain(); AU.master.gain.value = 0; AU.master.connect(C.destination);
    AU.music = C.createGain(); AU.music.gain.value = 0.9; AU.music.connect(AU.master); AU.sfx = C.createGain(); AU.sfx.gain.value = 1; AU.sfx.connect(AU.master);
    const len = C.sampleRate * 2.8, ir = C.createBuffer(2, len, C.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++)d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6) }
    AU.rev = C.createConvolver(); AU.rev.buffer = ir; const rg = C.createGain(); rg.gain.value = 0.55; AU.rev.connect(rg); rg.connect(AU.master);
    AU.dly = C.createDelay(1); AU.dly.delayTime.value = 0.395; const fb = C.createGain(); fb.gain.value = 0.33; AU.dly.connect(fb); fb.connect(AU.dly); AU.dly.connect(AU.rev); const dg = C.createGain(); dg.gain.value = 0.35; AU.dly.connect(dg); dg.connect(AU.music);
    const nb = C.createBuffer(1, C.sampleRate * 2, C.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++)nd[i] = Math.random() * 2 - 1;
    const loop = () => { const src = C.createBufferSource(); src.buffer = nb; src.loop = true; src.start(); return src };
    AU.windF = C.createBiquadFilter(); AU.windF.type = 'bandpass'; AU.windF.Q.value = 0.7; AU.windF.frequency.value = 500; AU.windG = C.createGain(); AU.windG.gain.value = 0; loop().connect(AU.windF); AU.windF.connect(AU.windG); AU.windG.connect(AU.sfx);
    AU.cloudF = C.createBiquadFilter(); AU.cloudF.type = 'lowpass'; AU.cloudF.frequency.value = 900; AU.cloudG = C.createGain(); AU.cloudG.gain.value = 0; loop().connect(AU.cloudF); AU.cloudF.connect(AU.cloudG); AU.cloudG.connect(AU.sfx); AU.cloudG.connect(AU.rev);
    AU.next = C.currentTime + 0.1; AU.timer = setInterval(auSched, 120);
  }
  function env(o, g, t, a, hold, r, v) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + r); o.start(t); o.stop(t + a + hold + r + 0.05) }
  function voice(f, t, type, a, hold, r, v, dest) { const C = AU.C, o = C.createOscillator(), g = C.createGain(); o.type = type; o.frequency.value = f; o.connect(g); (dest || []).forEach(d => g.connect(d)); env(o, g, t, a, hold, r, v) }
  function auSched() {
    const C = AU.C, eighth = 60 / 76 / 2; if (!AU.on) { AU.next = C.currentTime + 0.1; return }
    while (AU.next < C.currentTime + 0.35) {
      const t = AU.next, st = AU.step, ch = CHORDS[Math.floor(st / 32) % 4];
      if (st % 32 === 0) { const lp = C.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.connect(AU.music); lp.connect(AU.rev); ch.slice(1).forEach((f, i) => { voice(f, t, 'triangle', 1.6, 32 * eighth - 2.6, 2.2, 0.018, [lp]); voice(f * 1.003, t, 'sine', 1.8, 32 * eighth - 2.8, 2.4, 0.014, [lp]) }) }
      if (st % 8 === 0) voice(ch[0], t, 'sine', 0.04, 0.6, 1.6, 0.07, [AU.music]);
      if (st % 2 === 0 || Math.random() < 0.35) { if (Math.random() < 0.62) { const f = PENTA[Math.floor(Math.random() * (st % 16 < 8 ? 6 : 8))]; voice(f, t, 'triangle', 0.008, 0.02, 0.9, 0.03, [AU.music, AU.dly, AU.rev]) } }
      if (Math.random() < 0.05) { voice(2093, t, 'sine', 0.01, 0.02, 1.4, 0.012, [AU.rev]); voice(3136, t + 0.05, 'sine', 0.01, 0.02, 1.2, 0.008, [AU.rev]) }
      AU.next += eighth; AU.step++;
    }
  }
  function chime(k) { if (!AU.on) return; const t = AU.C.currentTime, base = [659.25, 783.99, 880, 987.77, 1046.5][k % 5]; voice(base * 2, t, 'sine', 0.005, 0.03, 1.6, 0.03, [AU.sfx, AU.rev]); voice(base * 3, t + 0.06, 'sine', 0.005, 0.02, 1.2, 0.015, [AU.rev]) }
  function tone(f, d, at) { if (!AU.on) return; voice(f, AU.C.currentTime + (at || 0), 'sine', 0.01, 0.02, d, 0.05, [AU.sfx, AU.rev]) }
  function audioTick(dt, y) {
    if (!AU.on || !AU.C) return; const C = AU.C, t = C.currentTime, v = Math.min(1, Math.abs(vel) / 2200), cy = cam.position.y, inCloud = Math.max(0, 1 - Math.abs(cy - 75) / 9);
    AU.windG.gain.setTargetAtTime(v * 0.2 + inCloud * v * 0.15, t, 0.08); AU.windF.frequency.setTargetAtTime(300 + v * 1700 + inCloud * 400, t, 0.1); AU.cloudG.gain.setTargetAtTime(inCloud * 0.12 * (0.4 + v), t, 0.15); AU.cloudF.frequency.setTargetAtTime(600 + v * 900, t, 0.15);
    let near = 0, bd = 1e9; anchors.forEach((a, i) => { const d = Math.abs(a.c - y); if (d < bd) { bd = d; near = i } }); if (near !== AU.last) { if (AU.last >= 0 && bd < innerHeight * 0.45) chime(near); if (bd < innerHeight * 0.45) AU.last = near }
  }
  function setSound(on) {
    AU.on = on; ['sound', 'sound2'].forEach(id => { const b = $(id); if (b) b.setAttribute('aria-pressed', on) }); const sp = document.querySelector('#sound2 span'); if (sp) sp.textContent = on ? L()['cta.soundOn'] : L()['cta.sound'];
    if (on) { if (!AU.C) auInit(); AU.C.resume(); AU.master.gain.setTargetAtTime(1, AU.C.currentTime, 0.6); chime(2) } else if (AU.C) AU.master.gain.setTargetAtTime(0, AU.C.currentTime, 0.3);
  }
  $('sound').onclick = () => setSound(!AU.on); if ($('sound2')) $('sound2').onclick = () => setSound(!AU.on);

  /* ---------- per-frame animation of the scenes ---------- */
  const walk = (h, t, sp) => { const s = Math.sin(t * sp); h.legL.rotation.x = s * 0.7; h.legR.rotation.x = -s * 0.7; h.armL.rotation.x = -s * 0.5; h.armR.rotation.x = s * 0.5 };
  function updWorldActors(s, t, dt, wp) {
    const H = s.h, c = (t % 1.1) / 1.1; H.armR.rotation.x = -1.6 + 2.6 * (c < 0.25 ? c / 0.25 : 1) * (c < 0.5 ? 1 : 1 - (c - 0.5) * 2);
    if (s.wt === 'islands') { H.G.position.y = 0.5 + Math.abs(Math.sin(t * 2.4)) * 1.2; H.wingL.rotation.y = Math.sin(t * 18) * 0.6; H.wingR.rotation.y = -Math.sin(t * 18) * 0.6; s.foes.forEach((j, k) => { const ph = t * 3 + k * 2; j.position.y = 0.5 + Math.abs(Math.sin(ph)) * 0.8; j.scale.set(1, 1 - Math.abs(Math.cos(ph)) * 0.25, 1) }) }
    if (s.wt === 'olympus' || s.wt === 'chaos') { const cc = (t % 2.6) / 2.6, up = cc < 0.4 ? cc / 0.4 : cc < 0.5 ? 1 - (cc - 0.4) * 10 : 0; if (s.wt === 'olympus') s.b.children.forEach((m, i) => { if (i === 5 || i === 8) m.position.y = 2.6 + up * 1.4 }); else s.b.position.y = 0.5 + up * 0.6;
      if (cc > 0.49 && cc < 0.49 + dt / 2.6) { burst(wp.clone().add(V(1.8, 0.8, 2.6)), 26, s.wt === 'chaos' ? [0xff5a1a, 0xffb020, 0xffffff] : [0xffe14d, 0xffffff, 0x9a9ca8], 8, 5, 0.16); if (s.wt === 'olympus') strike(wp.clone().add(V(-0.5 + Math.random() * 3, 0.6, 2 + Math.random() * 2))) }
      if (s.wt === 'chaos' && Math.random() < dt * 14) burst(wp.clone().add(V((Math.random() - 0.5) * 9, 0.6, (Math.random() - 0.5) * 9)), 1, [0xff5a1a, 0xffb020], 0.4, 4, 0.1) }
    if (s.wt === 'dome') { s.ring.rotation.y = t * 0.8; s.ring.rotation.x = Math.sin(t * 0.5) * 0.3; if (Math.random() < dt * 3) burst(wp.clone().add(V((Math.random() - 0.5) * 6, 3 + Math.random() * 2, (Math.random() - 0.5) * 6)), 2, [0xffffff, 0x9fd8ff], 0.5, 0.5, 0.08) }
    if (s.wt === 'abyss') s.foes.forEach((j, k) => { const a = t * 0.9 + k * 2.1; j.position.set(Math.cos(a) * 2.4 + 0.6, 1.4 + Math.sin(t * 2 + k) * 0.5, Math.sin(a) * 1.6 + 2.6); j.rotation.y = -a });
    if (s.wt === 'horai') { s.arc.material.opacity = c < 0.35 ? 0.9 * (1 - c / 0.35) : 0; s.arc.rotation.z = c * 3; if (c > 0.18 && c < 0.24) burst(wp.clone().add(V(1.2, 1.8, 3)), 10, [0xff4a8a, 0x22e6ff, 0xffffff], 4, 3); for (let k = 0; k < 2; k++) { const d = PD[pi = (pi + 1) % PN]; d.p = wp.clone().add(V((Math.random() - 0.5) * 12, 9, (Math.random() - 0.5) * 12)); d.v = V(0, -18, 0); d.life = d.max = 0.5; d.s = 0.06; PM.setColorAt(pi, _col.setHex(0x9fe8ff)) } if (PM.instanceColor) PM.instanceColor.needsUpdate = true }
  }
  /* the katana combo, one loop of 6.6 s:
     0.0–1.0  two slashes (overhead chop, then a flat sweep)
     1.0–1.7  pause: the blade glints, the next hit becomes a technique
     1.7–2.5  Raiko: a lightning dash straight through the oni
     2.5–3.8  Kaminari-guruma: three spins with a ring of lightning, the oni flies away
     3.8–6.6  hop back, the oni drops in again, breathe */
  const FT = 6.6;
  function fightTick(s, t, dt, wp) {
    const u = (t + (window.HTO_FO || 0)) % FT, h = s.h, k = ease.k, eo = ease.o, io = ease.io, P2 = Math.PI / 2;
    const once = (key, a) => { if (u >= a && u < a + Math.max(dt, 0.02) * 1.5 && s.hits[key] !== Math.floor(t / FT)) { s.hits[key] = Math.floor(t / FT); return true } return false };
    let x = -1.8, y = 0.5, yaw = P2, ax = -0.7, az = 0, on = false, crouch = 0, gl = 0.45;
    let mx = 1.4, my = 0.5, myaw = -P2, mrz = 0, msc = 0.7, msq = 1, mvis = true;
    const at = (hx, hy) => wp.clone().add(V(hx, hy, 0));
    if (u < 1.0) {
      /* slash 1: raise, chop down and across */
      const w = k(u, 0, 0.18), c = k(u, 0.18, 0.32), f = k(u, 0.32, 0.5);
      ax = -0.7 - 2.3 * eo(w) + 2.6 * eo(c) - 0.3 * f; az = 0.55 * eo(c); yaw = P2 + 0.35 * eo(w) - 0.6 * eo(c); x = -1.8 + 0.4 * eo(c); on = u > 0.17 && u < 0.36;
      /* slash 2: wind back, flat sweep the other way */
      if (u >= 0.5) { const w2 = k(u, 0.5, 0.62), c2 = k(u, 0.62, 0.78), f2 = k(u, 0.78, 1); ax = -1.0 - 0.55 * eo(w2) + 0.15 * f2; az = 0.55 - 0.55 * eo(w2); yaw = P2 - 0.25 + 1.45 * eo(w2) - 2.6 * eo(c2) + 1.4 * io(f2); x = -1.4 + 0.25 * eo(c2) - 0.15 * f2; on = u > 0.61 && u < 0.8 }
      if (once('a', 0.27)) { burst(at(0.9, 1.6), 14, [0xbff4ff, 0xffffff, 0x5fd8ff], 5, 3, 0.09) }
      if (once('b', 0.69)) { burst(at(0.9, 1.3), 14, [0xbff4ff, 0xffffff, 0x5fd8ff], 5, 3, 0.09) }
      const hk = Math.max(1 - Math.abs(u - 0.3) * 9, 1 - Math.abs(u - 0.72) * 9, 0); mx = 1.4 + hk * 0.35; msq = 1 - hk * 0.18; mrz = -hk * 0.25;
    } else if (u < 1.7) {
      /* pause with a glint running up the blade */
      const p = k(u, 1.0, 1.7); x = -1.55; ax = -0.85 + Math.sin(p * Math.PI) * 0.2; yaw = P2 + 0.15; crouch = Math.sin(p * Math.PI) * 0.12; gl = 0.45 + Math.sin(p * Math.PI) * 0.55;
      s.star.visible = true; h.G.updateMatrixWorld(true); s.sw.localToWorld(_ta.set(0, 0.03, 0.4 + 1.4 * io(p))); s.star.position.copy(_ta).sub(wp); s.star.scale.setScalar(0.15 + Math.sin(p * Math.PI) * 0.75); s.star.rotation.set(t * 3, t * 4, 0);
    } else if (u < 2.5) {
      /* Raiko: crouch, then a lightning dash through the enemy */
      const c = k(u, 1.7, 1.86), d = k(u, 1.86, 2.02), r = k(u, 2.02, 2.5); crouch = 0.22 * eo(c) * (1 - d); ax = -0.85 - 0.75 * eo(c); az = -0.4 * eo(c); gl = 0.9;
      x = -1.55 + 5.2 * eo(d); y = 0.5 + Math.sin(d * Math.PI) * 0.25; on = u > 1.85 && u < 2.08; yaw = P2 - 0.4 * eo(r); ax += 0.9 * eo(r);
      if (u > 1.86 && u < 2.3) { const fade = 1 - k(u, 2.05, 2.3); s.bolt.mat.opacity = fade; boltSet(s.bolt, V(-1.4, 1.35, 0), V(-1.4 + 5.0 * Math.min(1, eo(d) * 1.05), 1.35, 0), 0.45, 0.09) } else s.bolt.mat.opacity = 0;
      if (once('r', 2.04)) { burst(at(1.4, 1.5), 26, [0x7fe8ff, 0xffffff, 0xffe14d], 7, 4, 0.11); shakeK = Math.max(shakeK, 0.25) }
      const zap = u > 2.04 && u < 2.4; mrz = zap ? Math.sin(u * 90) * 0.12 : 0; msq = zap ? 0.86 : 1; myaw = -P2 + Math.PI * eo(k(u, 2.25, 2.5));
    } else if (u < 3.8) {
      /* Kaminari-guruma: turn back, hop and spin three times, a ring of lightning knocks the oni away */
      x = 3.65; const tn = k(u, 2.5, 2.7), sp = k(u, 2.7, 3.55), l = k(u, 3.55, 3.8); yaw = P2 + Math.PI * eo(tn) + Math.PI * 6 * io(sp); y = 0.5 + Math.sin(sp * Math.PI) * 0.7; ax = -1.6 + 0.9 * l; az = 0; on = sp > 0 && sp < 1; gl = 1;
      s.ring.material.opacity = sp > 0.15 ? 0.9 * (1 - k(u, 2.95, 3.75)) : 0; s.ring.scale.setScalar(0.5 + eo(k(u, 2.85, 3.7)) * 4.2); s.ring.position.set(x, 1.1 + y * 0.4, 0);
      s.ring2.material.opacity = sp > 0.45 ? 0.7 * (1 - k(u, 3.2, 3.8)) : 0; s.ring2.scale.setScalar(0.5 + eo(k(u, 3.15, 3.8)) * 3.4); s.ring2.position.set(x, 0.62, 0);
      if (sp > 0.1 && sp < 0.95) { [s.bolt2, s.bolt3].forEach((b, i) => { const a = t * 7 + i * Math.PI, rr = 2.6 + Math.random() * 0.8; b.mat.opacity = 0.9; boltSet(b, V(x, 1.4 + y * 0.3, 0), V(x + Math.cos(a) * rr, 0.6 + Math.random() * 1.4, Math.sin(a) * rr), 0.5, 0.07) }) } else { s.bolt2.mat.opacity = s.bolt3.mat.opacity = 0 }
      if (once('g', 2.95)) { burst(at(1.4, 1.4), 30, [0x7fe8ff, 0xffffff, 0x5fb8ff], 9, 6, 0.12); shakeK = Math.max(shakeK, 0.35) }
      const kb = k(u, 2.95, 3.75); myaw = P2; if (u >= 2.95) { mx = 1.4 - 5.4 * eo(kb); my = 0.5 + Math.sin(kb * Math.PI) * 3.2; mrz = kb * 7; msc = 0.7 * (1 - k(u, 3.55, 3.75)) } else { myaw = -P2 + Math.PI }
      if (once('p', 3.72)) burst(at(-4, 1.2), 22, [0xffffff, 0xd8d0ff, 0xff5d8a], 4, 3, 0.14); if (u > 3.74) mvis = false;
    } else {
      /* hop back to the start, the oni drops in again */
      const hb = k(u, 3.85, 4.45); x = 3.65 - 5.45 * io(hb); y = 0.5 + Math.sin(hb * Math.PI) * 1.4; yaw = -P2 + Math.PI * eo(k(u, 4.25, 4.6)); ax = -0.7 - Math.sin(hb * Math.PI) * 0.6; crouch = u > 4.45 && u < 4.65 ? 0.14 * Math.sin(k(u, 4.45, 4.65) * Math.PI) : 0;
      const dr = k(u, 4.5, 4.95); mvis = u > 4.5; my = 0.5 + (1 - dr * dr) * 6; const land = k(u, 4.95, 5.25); msq = 1 - Math.sin(land * Math.PI) * 0.25;
      if (once('d', 4.95)) burst(at(1.4, 0.7), 18, [0xffffff, 0xe8e0ff, 0xff8a5a], 4, 2.5, 0.12);
      const br = Math.sin(t * 2.2); ax += br * 0.06; crouch += (br + 1) * 0.02;
    }
    h.G.position.set(x, y, 0); h.G.rotation.y = yaw; h.G.scale.set(1.35, 1.35 * (1 - crouch), 1.35); h.armR.rotation.x = ax; h.armR.rotation.z = az; h.armL.rotation.x = on ? -0.9 : -0.3;
    const run = Math.abs(x - (s.px ?? x)) / Math.max(dt, 0.001); s.px = x; if (run > 2) { h.legL.rotation.x = Math.sin(t * 30) * 0.9; h.legR.rotation.x = -Math.sin(t * 30) * 0.9 } else { h.legL.rotation.x = crouch * 3; h.legR.rotation.x = -crouch * 2.4 }
    if (!(u >= 1.0 && u < 1.7)) s.star.visible = false; if (!(u >= 2.5 && u < 3.8)) { s.ring.material.opacity = s.ring2.material.opacity = 0; s.bolt2.mat.opacity = s.bolt3.mat.opacity = 0 } if (!(u >= 1.7 && u < 2.5)) s.bolt.mat.opacity = 0;
    s.sw.userData.glow.material.opacity = gl * (0.85 + Math.sin(t * 13) * 0.15);
    s.m.visible = mvis; s.m.position.set(mx, my, 0); s.m.rotation.set(0, myaw, mrz); s.m.scale.set(msc, msc * msq, msc);
    h.G.updateMatrixWorld(true); trailPush(s.tr, s.sw, s.g, on, 1.8);
  }
  function updStations(t, dt) {
    for (const s of ST) {
      const near = cam.position.distanceTo(s.p) < 70; s.g.visible = near; if (!near) continue; const wp = s.g.position;
      if (s.wt) { updWorldActors(s, t, dt, wp); continue }
      if (s.kind === 'jump') { const cyc = (t * 0.55) % 1, k = Math.floor(cyc * 5), f = cyc * 5 - k, a = s.blocks[k], b = s.blocks[(k + 1) % 5]; const pa = a.position, pb = k === 4 ? s.blocks[0].position : b.position;
        s.h.G.position.set(pa.x + (pb.x - pa.x) * f, pa.y + 0.5 + (pb.y - pa.y) * f + Math.sin(f * Math.PI) * 1.6, pa.z + (pb.z - pa.z) * f); s.h.G.rotation.y = Math.atan2(pb.x - pa.x, pb.z - pa.z); s.h.legL.rotation.x = -0.6; s.h.legR.rotation.x = 0.4; { const sq = f < 0.12 ? Math.sin(f / 0.12 * Math.PI) * 0.22 : 0, st = f > 0.15 && f < 0.5 ? Math.sin((f - 0.15) / 0.35 * Math.PI) * 0.12 : 0; s.h.G.scale.set(1.35 * (1 + sq * 0.5), 1.35 * (1 - sq + st), 1.35 * (1 + sq * 0.5)) } s.h.wingL.rotation.y = Math.sin(t * 20) * 0.6; s.h.wingR.rotation.y = -Math.sin(t * 20) * 0.6;
        if (f < dt * 3) burst(wp.clone().add(s.h.G.position), 6, [0xffffff, 0xffe14d], 2, 2, 0.1) }
      if (s.kind === 'fight') fightTick(s, t, dt, wp);
      if (s.kind === 'boss') { const c = (t % 3) / 3; const up = c < 0.4 ? c / 0.4 : c < 0.5 ? 1 - (c - 0.4) * 10 : 0; s.b.children.forEach((m, i) => { if (i === 5 || i === 8) m.position.y = 2.6 + up * 1.4 }); s.b.position.y = 0.5 + (c > 0.48 && c < 0.55 ? -0.15 : 0);
        s.ringW.material.opacity = c > 0.5 && c < 0.8 ? 0.8 * (1 - (c - 0.5) / 0.3) : 0; s.ringW.scale.setScalar(1 + (c - 0.5) * 12); if (c > 0.49 && c < 0.49 + dt / 3) burst(wp.clone().add(V(1.5, 0.8, -1)), 24, [0xffe14d, 0xffffff, 0x9a9ca8], 8, 4, 0.16);
        { const u = c * 3, k = ease.k, eo = ease.o, io = ease.io, h = s.h; let x = -3, y = 0.5, z = 2, ax = -1.0 + Math.sin(t * 5) * 0.15, on = false, sq = 0;
          /* dodge: a side dash just before the slam lands */
          const dg = k(u, 1.2, 1.42), bk = k(u, 1.55, 1.8); z = 2 + 2.2 * eo(dg) - 2.2 * io(bk); x = -3 - 0.6 * eo(dg) + 0.6 * io(bk); if (dg > 0 && dg < 1) burst(wp.clone().add(V(x, 0.7, z)), 1, [0xffffff, 0xffe9a0], 1, 1, 0.12);
          /* leap slash at the golem */
          const lp = k(u, 1.85, 2.35), rt = k(u, 2.45, 2.95); if (u >= 1.85 && u < 2.45) { x = -3 + 3.1 * eo(lp); z = 2 - 1.6 * eo(lp); y = 0.5 + Math.sin(lp * Math.PI) * 2.4; ax = -2.9 + 2.9 * io(k(u, 2.1, 2.35)); on = u > 2.08 && u < 2.4 } if (u >= 2.45) { x = 0.1 - 3.1 * io(rt); z = 0.4 + 1.6 * io(rt); y = 0.5 + Math.sin(rt * Math.PI) * 0.9; ax = -0.8 }
          if (u > 2.33 && u < 2.33 + dt * 1.5) { burst(wp.clone().add(V(1.1, 1.8, -0.6)), 22, [0xffe9a0, 0xffffff, 0xffa040], 6, 4, 0.11); shakeK = Math.max(shakeK, 0.2) }
          if (u > 2.36 && u < 2.6) s.b.position.x = 1.5 + Math.sin(u * 80) * 0.06; else s.b.position.x = 1.5;
          sq = u > 2.35 && u < 2.5 ? Math.sin(k(u, 2.35, 2.5) * Math.PI) * 0.18 : 0;
          h.G.position.set(x, y, z); h.G.rotation.y = Math.atan2(1.5 - x, -1 - z); h.G.scale.set(1.35, 1.35 * (1 - sq), 1.35); h.armR.rotation.x = ax;
          h.G.updateMatrixWorld(true); trailPush(s.btr, s.sw, s.g, on, 1.3) } }
      if (s.kind === 'craft') { const u = t % 9, cyc = Math.floor(t / 9);
        if (u < 3.6) { if (s.dr.id !== 'base') { dress(s.h, s.dr, 'base'); s.hm.visible = true } const c = (u % 0.8) / 0.8; s.h.armR.rotation.x = c < 0.5 ? -2.4 + c * 4.8 : 0 - (c - 0.5) * 4.8; s.h.G.rotation.y = Math.PI / 2; s.h.G.position.y = 0.5; if (c > 0.48 && c < 0.48 + dt / 0.8) burst(wp.clone().add(V(0.4, 1.4, 0)), 14, [0xffa040, 0xffe14d, 0xff5a2a], 4, 4, 0.08) }
        else { if (s.k !== cyc) { s.k = cyc; s.hm.visible = false; dress(s.h, s.dr, DRESS_ORDER[cyc % DRESS_ORDER.length]); burst(wp.clone().add(V(0.6, 1.2, 0)), 34, [0xffe14d, 0xffffff, 0xffa040], 7, 6, 0.12); shakeK = Math.max(shakeK, 0.15) }
          const sp = Math.min(1, (u - 3.6) / 0.9), e = 1 - (1 - sp) ** 3; s.h.G.rotation.y = Math.PI / 2 + e * Math.PI * 2 - Math.min(1, Math.max(0, (u - 4.6) / 0.5)) * (Math.PI / 2 + 0.6); s.h.G.position.y = 0.5 + Math.sin(sp * Math.PI) * 0.7; s.h.armR.rotation.x = u > 4.8 && u < 6.4 ? -2.7 + Math.sin(u * 9) * 0.15 : -0.6; s.h.armL.rotation.z = u > 4.8 && u < 6.4 ? 0.5 : 0;
          if (u > 4.85 && u < 4.85 + dt) burst(wp.clone().add(s.h.G.position).add(V(0, 3.2, 0)), 16, [0xffffff, 0xffe14d], 3, 3, 0.1) }
        dressTick(s.dr, dt, true) }
      if (s.kind === 'home') { walk(s.h, t * 0.4, 6); s.h.armR.rotation.x = -1.2; s.crops.forEach((c, i) => { const ph = (t * 0.5 + i * 0.37) % 2; c.userData.pl.scale.setScalar(ph < 1.6 ? 0.3 + ph / 1.6 * 0.9 : 1.2 - (ph - 1.6) * 3); if (ph > 1.6 && ph < 1.6 + dt * 0.5) burst(wp.clone().add(c.position).add(V(0, 0.6, 0)), 8, [0xff8a2a, 0xffffff, 0x8ee04a], 3, 4) });
        s.k.G.position.y = 0.5 + Math.abs(Math.sin(t * 3)) * 0.4; VX.animKumo(s.k, t, dt) }
      if (s.kind === 'coop') { const hop = (t % 2.4) / 2.4, hy = hop < 0.32 ? Math.sin(hop / 0.32 * Math.PI) * 0.95 : 0, sw = Math.sin(t * 3) * 0.22, air = hy > 0.05;
        s.h.G.position.set(-1.32, 0.5 + hy, 0.6); s.h2.G.position.set(1.32, 0.5 + hy, 0.6); s.h.G.rotation.y = 0.16; s.h2.G.rotation.y = -0.16;
        s.h.armR.rotation.set(sw, 0, 0.8); s.h2.armL.rotation.set(sw, 0, -0.8); s.h.armL.rotation.set(-sw * 1.5, 0, air ? -0.5 : 0); s.h2.armR.rotation.set(-sw * 1.5, 0, air ? 0.5 : 0);
        for (const h of [s.h, s.h2]) { h.legL.rotation.x = air ? -0.6 : Math.sin(t * 3) * 0.15; h.legR.rotation.x = air ? 0.3 : -Math.sin(t * 3) * 0.15; h.head.rotation.z = Math.sin(t * 2) * 0.06; h.body.position.y = 0.95 + (air ? 0 : Math.abs(Math.sin(t * 3)) * 0.03) }
        s.h.head.rotation.y = 0.25; s.h2.head.rotation.y = -0.25;
        s.k.G.position.set(0, 0.5 + Math.abs(Math.sin(t * 4)) * 0.45, 2.1); s.k.G.rotation.y = Math.sin(t) * 0.5; VX.animKumo(s.k, t, dt);
        if (hop > 0.32 && hop < 0.32 + dt / 2.4) burst(wp.clone().add(V(0, 3.4, 0.6)), 16, [0xff5d8a, 0xff8fb8, 0xffffff], 2.4, 3, 0.16);
        if (Math.random() < dt * 2) burst(wp.clone().add(V((Math.random() - 0.5) * 1.2, 3 + Math.random(), 0.6)), 1, [0xff5d8a, 0xff8fb8], 0.4, 1.4, 0.13) }
    }
  }

  /* ---------- main loop ---------- */
  let last = performance.now(), lastY = scrollY, vel = 0, T0 = 0, running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(frame) } });
  function frame(now) {
    if (!running) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; T0 += dt; const t = T0;
    const y = scrollY; vel += ((y - lastY) / Math.max(dt, 1e-3) - vel) * Math.min(1, dt * 8); lastY = y;
    const P = poseAt(y), a = P.a, b = P.b, k = P.t;
    tgt.p.copy(a.p).lerp(b.p, k); tgt.l.copy(a.l).lerp(b.l, k);
    const mx = REDUCED ? 0 : (mouse.x * 0.8), my = REDUCED ? 0 : (mouse.y * 0.5); tgt.p.x += mx; tgt.p.y += my;
    const s = REDUCED ? 1 : 1 - Math.exp(-dt * 5); cur.p.lerp(tgt.p, s); cur.l.lerp(tgt.l, s); cur.fov += (a.fov + (b.fov - a.fov) * k - cur.fov) * s;
    cam.position.copy(cur.p); if (shakeK > 0) { shakeK = Math.max(0, shakeK - dt * 2.5); cam.position.x += (Math.random() - 0.5) * shakeK * 0.6; cam.position.y += (Math.random() - 0.5) * shakeK * 0.6 } cam.lookAt(cur.l); if (Math.abs(cam.fov - cur.fov) > 0.01) { cam.fov = cur.fov; cam.updateProjectionMatrix() }
    lerpHex(a.sky[0], b.sky[0], k, skyU.top.value); lerpHex(a.sky[1], b.sky[1], k, skyU.mid.value); lerpHex(a.sky[2], b.sky[2], k, skyU.bot.value);
    lerpHex(a.fog[0], b.fog[0], k, scene.fog.color); scene.fog.near = a.fog[1] + (b.fog[1] - a.fog[1]) * k; scene.fog.far = a.fog[2] + (b.fog[2] - a.fog[2]) * k;
    stars.material.opacity = a.st + (b.st - a.st) * k; sky.position.copy(cam.position); stars.position.copy(cam.position);
    /* hero isle life */
    dressBtnTick(); const H = W.hero; H.body.position.y = 0.95 + Math.sin(t * 2.2) * 0.03; H.wingL.rotation.y = 0.3 + Math.sin(t * 2) * 0.25; H.wingR.rotation.y = -0.3 - Math.sin(t * 2) * 0.25; H.cape.rotation.x = 0.12 + Math.sin(t * 2.6) * 0.08; H.armR.rotation.x = (t % 6) < 1.1 ? -2.4 + Math.sin(t * 10) * 0.35 : -0.55 + Math.sin(t * 1.6) * 0.06; dressTick(W.dress, dt, true); if (W.dress.spin != null) { W.dress.spin += (W.dress.dt || dt) / 0.8; const e = 1 - (1 - Math.min(1, W.dress.spin)) ** 3; H.G.rotation.y = -0.5 + e * Math.PI * 2; H.G.position.y = 0.5 + Math.sin(Math.min(1, W.dress.spin) * Math.PI) * 0.9; W.pillar.material.opacity = Math.max(0, 0.55 * (1 - W.dress.spin)); W.pillar.scale.set(1 + W.dress.spin * 0.6, 1, 1 + W.dress.spin * 0.6); if (W.dress.spin >= 1.4) { W.dress.spin = null; H.G.rotation.y = -0.5; H.G.position.y = 0.5 } }
    W.heroIsle.position.y = 94 + Math.sin(t * 0.7) * 0.4; if (W.titan) { W.titan.position.y = 40 + Math.sin(t * 0.6) * 1.2; W.titan.rotation.y = -0.6 + Math.sin(t * 0.3) * 0.1; if ((strikeT -= dt) <= 0 && cam.position.y > 84) { strikeT = 2.5 + Math.random() * 3; strike(W.heroIsle.position.clone().add(V(8 + Math.random() * 22, -2 + Math.random() * 6, -20 - Math.random() * 30))) } } VX.animKumo(W.kHero, t, dt); olymp.rotation.y = t * 0.02;
    updWorlds(dt, t); updStations(t, dt);
    if (KS.o) { KS.pop = Math.min(1, (KS.pop || 0) + dt * 3); const p = KS.pop, e = 1 + Math.sin(p * Math.PI) * 0.25; KS.o.G.scale.setScalar(1.25 * (p < 1 ? e : 1)); KS.o.G.rotation.y = t * 0.5; VX.animKumo(KS.o, t, dt); if (KS.rare && Math.random() < dt * 12) { const wp = W.kumoSlot.getWorldPosition(new THREE.Vector3()); _col.setHSL(Math.random(), 1, 0.6); burst(wp.add(V((Math.random() - 0.5) * 1.6, 0.3 + Math.random(), (Math.random() - 0.5) * 1.6)), 1, [_col.getHex()], 0.6, 1.5, 0.1) } }
    W.babies.forEach((o, i) => { o.G.position.y = 0.5 + Math.abs(Math.sin(t * 2.5 + i)) * 0.3; o.G.rotation.y = Math.sin(t * 0.6 + i) * 1.2; VX.animKumo(o, t + i, dt) });
    const fo = Math.min(1, Math.max(0, (k > 0 && b === POSE.final ? k : a === POSE.final ? 1 : 0))); W.finalL.position.x = -11 - fo * 16; W.finalR.position.x = 11 + fo * 16;
    /* wind */
    const wv = REDUCED ? 0 : Math.min(1, Math.abs(vel) / 2600); WM.material.opacity = wv * 0.55;
    if (wv > 0.02) { for (let i = 0; i < WN; i++) { const d = WD[i]; d.y += (vel > 0 ? 1 : -1) * dt * 90 * wv; if (d.y > 15) d.y -= 30; if (d.y < -15) d.y += 30; _o.position.copy(cam.position).add(d.clone().applyQuaternion(cam.quaternion)); _o.quaternion.copy(cam.quaternion); _o.scale.set(0.03, 1.2 + wv * 3, 0.03); _o.updateMatrix(); WM.setMatrixAt(i, _o.matrix) } WM.instanceMatrix.needsUpdate = true }
    updParts(dt); sunL.position.copy(cur.l).add(V(18, 34, 16)); sunL.target.position.copy(cur.l); audioTick(dt, y); if (comp) comp.render(); else R.render(scene, cam); requestAnimationFrame(frame);
  }
  const mouse = { x: 0, y: 0 }; addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = -(e.clientY / innerHeight - 0.5) } });
  addEventListener('resize', () => { R.setSize(innerWidth, innerHeight, false); if (comp) comp.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); measure(); if (window.ScrollTrigger) ScrollTrigger.refresh() });

  /* ---------- UI wiring ---------- */
  $('lang').onclick = () => { LANG = LANG === 'ru' ? 'en' : 'ru'; try { localStorage.setItem('hto-lang', LANG) } catch (e) { } applyLang() };
  let lenis = null;
  const goTo = id => { const el = $(id); if (!el) return; if (lenis) lenis.scrollTo(el, { duration: 1.6 }); else el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) };
  qa('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); goTo(a.dataset.go) }));
  qa('[data-todo]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  const dlg = $('trailer'); $('trailerBtn').onclick = () => { if (dlg.showModal) dlg.showModal(); $('trailerVid').play().catch(() => { }) };
  $('trailerClose').onclick = () => { $('trailerVid').pause(); dlg.close() }; dlg.addEventListener('close', () => $('trailerVid').pause());
  addEventListener('scroll', () => document.querySelector('.nav').classList.toggle('solid', scrollY > 60), { passive: true });

  /* ---------- boot ---------- */
  (async () => {
    pre.set(10); await load(); techView(); kumoBuild(); setTimeout(() => { try { sprites() } catch (e) { console.warn(e) } devicesAlive() }, 300); kumoUI(); worldUI(); applyLang();
    try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) } catch (e) { } pre.set(90);
    setTimeout(snapKumos, 50); measure(); requestAnimationFrame(frame);
    if (!REDUCED && window.Lenis) { lenis = new Lenis({ lerp: 0.085, smoothWheel: true }); const raf = tm => { lenis.raf(tm); requestAnimationFrame(raf) }; requestAnimationFrame(raf); if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update) }
    if (window.gsap && window.ScrollTrigger && !REDUCED) { gsap.registerPlugin(ScrollTrigger); if ($('roadList') && $('roadList').classList.contains('road-cols')) gsap.fromTo('#roadList .rc', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '#roadList', start: 'top 85%' } }); qa('.mech:not(.world) .m-card').forEach(card => gsap.fromTo(card.querySelectorAll('.m-stats > div, .m-list li'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 80%' } })); ['#duoGrid'].forEach(sel => { if ($(sel.slice(1))) gsap.fromTo(sel + ' .reveal-c', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: sel, start: 'top 85%' } }) }); ['#techGrid', '#modesGrid'].forEach(sel => { if ($(sel.slice(1))) gsap.fromTo(sel + ' .reveal-c', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: sel, start: 'top 85%' } }) }); qa('.reveal').forEach(el => { if (el.closest('#mGrid')) return; gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }) }) }
    else document.documentElement.classList.add('ready-static');
    setTimeout(() => { pre.set(100); $('pre').classList.add('done'); measure(); if (window.ScrollTrigger) ScrollTrigger.refresh() }, 600);
  })();
  window.HTO = { cam, scene, POSE, anchors: () => anchors, measure, goWorld, KS, kumoBuild, W };
})();
