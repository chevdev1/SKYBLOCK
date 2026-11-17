# Rewrites queue.json texts as Telegram HTML (bold titles, italics, quotes, links).
# Run: python style_texts.py   (then the poster sends with parse_mode=HTML)
import json, re, io
DC = '<a href="https://discord.gg/MVgbHH7gd">Discord</a>'
TAG = '\n\n#HopToOlympus'
T = {}
T['post-01-v4-sergio'] = f"""<b>Meet Hop to Olympus ☁️</b>
<i>A voxel action RPG that runs right in your browser.</i>

No download. No sign-up. Desktop, tablet or phone: keyboard, touch or gamepad.

⚔️ <b>Climb six worlds</b>: from the Cloud Isles to the Gates of Olympus, space and neon Horai. 19 regions, 33 bosses with their own phases, arenas and legendary loot.
🦘 <b>Movement is the weapon</b>: hop on the beat (the 5th jump is a mega jump), dash, wall-run, grapple and fly.
🔨 <b>12 weapon types</b>, 32 craftable items and 8 relics. Skill beats stats.
☁️ <b>Hatch a Kumo</b>: a cloud buddy that grows into one of six adult forms. Ultra-rare: 1%, odds are public.
👥 <b>Up to 32 players</b> in one room, your own island, time trials against your ghost and a map editor.

<blockquote>Built from scratch by a small studio. The whole game is just 1.47 MB.</blockquote>

🧪 <b>Alpha test: opening soon.</b>
💬 Join our {DC} to share ideas and bugs, we read everything.
👇 <i>Follow the channel to hear first.</i>{TAG}"""
T['post-02-worlds'] = f"""<b>Six worlds. One climb. 🌍</b>

From the <b>Cloud Isles</b> to <b>neon Horai</b>, every world changes the rules, the enemies and the music.

<blockquote>19 regions · 33 bosses · legendary loot</blockquote>

☁️ Blooming Isles · ⚡ Gates of Olympus · 🌌 Space · 🔥 Forge of Hephaestus · ⭐ Star Dome · 🏮 Neon Quarter

<i>Which world do you want to see first?</i> 👇{TAG}"""
T['cute-kumo-16x9'] = f"""<b>Meet Kumo ☁️💗</b>
<i>A cloud buddy that hatches from an egg, grows, evolves and joins your adventures.</i>

🥚 Egg → 🐣 baby → 🌱 teen → ✨ one of six adult forms

<blockquote>Ultra-rare form: 1% chance, and the odds are public.</blockquote>

<i>What would you name yours?</i> 👇{TAG} #Kumo"""
T['post-08-mobs'] = f"""<b>Not a single clone. 👹</b>

Gryphons, titans, gorgons, nightmares and neon dragons: <b>33 bosses</b> with their own phases, arenas and legendary loot.

<blockquote>No copy-paste fights. Every boss asks for a different plan.</blockquote>

<i>Which one would you fight first?</i> 👇{TAG} #BossFight"""
T['post-04-movement'] = f"""<b>Movement is the weapon. 🦘</b>

Hop on the beat: every jump in a streak is faster, and the <b>fifth one is a mega jump</b>.

➕ dash · wall-runs · grappling hook · wings

<blockquote>Skill beats stats here.</blockquote>{TAG} #indiegame"""
T['post-34-bestfriends'] = f"""<b>Best friends ☁️💗</b>
<i>Pick a hero, hatch a Kumo and bring a friend along.</i>

👥 Up to <b>32 players</b> in one room
🌐 No download. No sign-up.

🧪 Alpha test: opening soon.
<i>Who are you bringing?</i> 👇{TAG}"""
T['post-12-craft'] = f"""<b>Loot it. Craft it. Equip it. 🔨</b>

Mobs drop materials, and you forge armour, wings and legendary weapons.

<blockquote>32 items · 8 relics · 12 weapon types</blockquote>

⭐ The <b>Starbreaker</b> can only be forged in the Star Dome.

<i>What would you craft first?</i> 👇{TAG} #crafting"""
T['post-36-gearladder'] = f"""<b>Upgrade your gear ⬆️</b>

🐢 <b>Turtle Armor</b>: 3 armor hearts
🥷 <b>Shadow Garb</b>: 5 armor hearts, +10% run speed
🟣 <b>Erebus Armor</b>: 7 armor hearts, +15% run speed

<i>Loot it. Craft it. Wear it.</i>

Which look is yours? 👇{TAG}"""
T['post-06-coop32'] = f"""<b>Up to 32 players in one room. 👥</b>

<blockquote>Shared bosses, shared loot and XP.</blockquote>

Honest co-op: the fight leader stays put, boss health is shared and hits are never dropped.

<i>Who are you bringing?</i> 👇{TAG} #coop"""
T['post-21-wanted'] = f"""<b>33 bosses. All wanted. 🤠</b>

Zeus, Medusa, Kronos and 30 more are waiting on the way up, each with its own arena and <b>legendary loot</b>.

🗡 Hunt them solo or with up to 32 players.

<i>Which boss is your first target?</i> 👇{TAG}"""
T['post-09-evolution'] = f"""<b>From egg to legend. 🥚➡️✨</b>

Feed it, care for it and watch your Kumo change: <b>baby</b>, <b>teen</b>, then one of <b>six adult forms</b>.

<blockquote>And once in a hundred hatches, an ultra-rare.</blockquote>

<i>Which form do you want?</i> 👇{TAG} #Kumo"""
T['post-22-boarding'] = f"""<b>Your boarding pass to Olympus ✈️☁️</b>

🎫 Class: co-op, up to 32
🌐 No download. No sign-up. Any screen.

<blockquote>Gate: alpha test, opening soon.</blockquote>

<i>Follow to hear first.</i>{TAG}"""
T['post-19-action'] = f"""<b>Swing. Dash. Repeat. ⚔️</b>

<b>12 weapon types</b>, plus hops, dashes and a mega jump on every fifth hop. Pick your style.

<i>Which weapon are you?</i> 👇{TAG} #actionRPG"""
T['post-29-versus'] = f"""<b>Would you rather... 🤔</b>

🔱 <b>Spear</b> or ⚔️ <b>twin blades</b>?

12 weapon types are waiting in the alpha, each with its own fighting style.

<i>Comment your side</i> 👇{TAG}"""
T['post-10-odds'] = f"""<b>99% vs 1%. 🎲</b>

Every Kumo hatch has a <b>1% chance</b> to be ultra-rare. The odds are public, and every ultra-rare gets its own <b>unique number</b>.

<blockquote>No fog, no tricks.</blockquote>{TAG} #indiegame"""
T['post-17-horai'] = f"""<b>Neon Horai 🏮</b>
<i>The last world glows.</i>

☁️ Cloud Harbor
🌃 Neon Quarter
🏯 Jade Palace

<i>Which world do you want to see first?</i> 👇{TAG}"""
T['post-23-herocards'] = f"""<b>Pick your hero. 🃏</b>

<b>Ginger</b>, <b>Rina</b> or <b>Sergio</b>: three heroes, 12 weapon types and the same mega jump on every fifth hop.

<i>Who are you playing?</i> 👇{TAG}"""
T['post-14-ghost'] = f"""<b>Race your ghost. 👻</b>

Five time trial tracks, a ghost of your best run and shared leaderboards. Hops and dashes decide everything.

<i>Can you beat yourself?</i> 👇{TAG} #timetrial"""
T['post-31-roadmap'] = f"""<b>Where we are 🗺️</b>

✅ <b>Shipped:</b> Cloud Isles, Chaos Rift, Star Dome, Horai, your island, Kumo
🛠 <b>In progress:</b> a shared home for two, the alpha test, deeper RPG lore
⏭ <b>Next:</b> Kumo cloud races, leaderboards, kingdoms, a vast open world

<blockquote>Plans can change, and your feedback shapes them.</blockquote>
💬 Tell us in our {DC}.{TAG}"""
T['post-24-kumomenu'] = f"""<b>Today on the cloud: Kumo ☁️</b>

Hatch an egg, feed and care for your Kumo, and watch it grow into one of <b>six adult forms</b>.

<blockquote>One in a hundred hatches is ultra-rare, and the odds are public.</blockquote>

<i>Which one are you hatching?</i> 👇{TAG} #Kumo"""
T['post-37-gear1'] = f"""<b>Three armor upgrades, swipe through ➡️</b>

1️⃣ Turtle Armor
2️⃣ Shadow Garb
3️⃣ Erebus Armor

<i>More armor is on the way.</i>
🧪 Alpha test: opening soon.{TAG}"""
T['post-13-workshop'] = f"""<b>Build your own map. 🧱</b>

Place the start, finish and checkpoints, publish it and earn <b>creator stars</b>:

⭐ +1 for a new player
⭐ +2 for every finish
⭐ +5 for a like

Every map has its own leaderboard.

<i>What would you build?</i> 👇{TAG} #mapeditor"""
T['post-30-loading'] = f"""<b>Loading tip ☁️</b>

<blockquote>Hop on the beat: every jump in a streak is faster, and the fifth one is a mega jump.</blockquote>

<i>Which tip should we show next?</i> 👇{TAG}"""
T['post-03-tech'] = f"""<b>1.47 MB. 📦</b>

That's the whole game: one file, zero installs. A custom voxel engine on Three.js and <b>140,000+ blocks</b>, running in your browser.

🧪 Alpha test: opening soon.{TAG} #buildinpublic"""
T['post-20-together'] = f"""<b>Play together. 🤝</b>

Up to <b>32 players</b> in one room: shared bosses, shared loot and XP, and one shared boss health bar. Pick your hero and jump in.

<i>Who is your co-op partner?</i> 👇{TAG}"""
T['post-27-receipt'] = f"""<b>Your craft receipt 🧾</b>

3 mole claws + 5 slime = <b>1 grappling hook</b>.

Mobs drop materials, recipes turn them into gear: 32 items and 8 relics.

<i>What would you craft first?</i> 👇{TAG}"""
T['post-32-bossquiz'] = f"""<b>Who's that boss? 👀</b>

<i>He sits on a cloud and throws lightning. One of 33 bosses.</i>

<b>A)</b> Kronos
<b>B)</b> Zeus
<b>C)</b> Medusa
<b>D)</b> Oceanus

<i>Answer in the comments</i> 👇{TAG}"""
T['post-05-cross'] = f"""<b>One game. Any screen. 📱💻🎮</b>

Play on desktop, tablet or phone: keyboard and mouse, touch controls, or a gamepad (<b>Xbox, PlayStation, Switch Pro</b>).

<blockquote>No download. No sign-up.</blockquote>{TAG}"""
T['post-26-patchnotes'] = f"""<b>Patch notes: what is already in the build ☁️</b>

➕ Horai, a neon megacity
➕ New boss: <b>Kiyohime, the Serpent Bride</b>
➕ Ultra-rare Kumo with unique numbers
➕ Xbox, PlayStation and Switch Pro gamepads
➕ Time trials with a ghost
➕ Workshop for your own maps

🧪 Alpha test: opening soon.
💬 Bugs and ideas: our {DC}.{TAG}"""
T['post-33-polaroids'] = f"""<b>Screenshot Saturday 📸</b>

The Gates of Olympus, above the clouds, neon Horai and inside the Star Dome.

<i>Which one is your favourite?</i> 👇{TAG}"""
T['post-07-scratch'] = f"""<b>Built from scratch. 🛠</b>

Our own voxel engine on Three.js, our own Node.js server with <b>zero dependencies</b>, and a 64×64 chunk world that keeps your device smooth.

<blockquote>Small studio, big island.</blockquote>{TAG} #buildinpublic"""
T['post-11-numbers'] = f"""<b>Hop to Olympus by the numbers 🔢</b>

⚔️ 33 bosses
🌍 6 worlds
📍 19 regions
🔨 12 weapon types
👥 32 players per room
📦 1.47 MB: the whole game
🚫 0 installs

🧪 Alpha test: opening soon.{TAG}"""

q = json.load(open('queue.json', encoding='utf8'))
bad = 0
for x in q:
    k = next((k for k in T if x['file'].startswith(k)), None)
    if not k: print('NO TEXT', x['file']); continue
    x['text'] = T[k]
    plain = re.sub(r'<[^>]+>', '', T[k])
    if len(plain) > 1024: print('TOO LONG', x['file'], len(plain)); bad += 1
json.dump(q, open('queue.json', 'w', encoding='utf8'), ensure_ascii=False, indent=2); open('queue.json', 'a').write('\n')
print('done', len(q), 'bad', bad)
