/* Technique preview: a small training ground where the hero loops each technique,
   with the pressed keys lighting up underneath — like a skill preview in a game menu.
   Renders only while visible. Uses window.VX models. */
(function () {
  const V = (x, y, z) => new THREE.Vector3(x, y, z), PI = Math.PI;
  const k01 = (u, a, b) => Math.min(1, Math.max(0, (u - a) / (b - a))), eo = x => 1 - (1 - x) ** 3, io = x => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
  const TV = { i: 0, t: 0, loops: 0, user: false, on: false };

  function init(host, hud, opts) {
    const R = new THREE.WebGLRenderer({ antialias: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); R.outputEncoding = THREE.sRGBEncoding; R.shadowMap.enabled = true; host.appendChild(R.domElement);
    const S = new THREE.Scene(); S.background = new THREE.Color('#bfe4ff'); S.fog = new THREE.Fog('#bfe4ff', 16, 34);
    S.add(new THREE.HemisphereLight(0xffffff, 0x9ab8d8, 0.85)); const sun = new THREE.DirectionalLight(0xfff2dc, 0.75); sun.position.set(4, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 8, bottom: -4 }); S.add(sun);
    const C = new THREE.PerspectiveCamera(34, 1.6, 0.1, 60);
    const B = VX.B, BOX = VX.BOX;
    /* ground: two grass strips with a pit in the middle that some techniques use */
    const ground = new THREE.Group(); S.add(ground); const mid = new THREE.Group(); S.add(mid);
    for (let x = -9; x <= 9; x++) for (let z = -2; z <= 1; z++) { const g = Math.abs(x) <= 2 ? mid : ground; B(g, 1, 0.5, 1, (x + z) % 2 ? 0x6ed04a : 0x62c240, x, -0.25, z); B(g, 1, 1.2, 1, 0x8a6a4a, x, -1.1, z) }
    const sky = new THREE.Group(); S.add(sky); [[-9, 7, -12, 3], [-2, 9, -14, 4], [7, 6.5, -11, 3], [12, 9, -15, 4]].forEach(([x, y, z, n]) => { for (let k = 0; k < n; k++) B(sky, 2.2 - k * 0.3, 0.9, 1.4, 0xffffff, x + k * 1.3 - n * 0.6, y + (k % 2) * 0.35, z, VX.lam(0xffffff)) }); for (const [x, z, h] of [[-12, -9, 3], [10, -10, 2]]) { B(sky, 4, 1.2, 3, 0x6ed04a, x, h, z); B(sky, 3, 1.4, 2.2, 0x8a6a4a, x, h - 1.3, z); B(sky, 1.6, 1.4, 1.2, 0x8a6a4a, x, h - 2.6, z) }
    const props = {};
    props.pads = new THREE.Group(); S.add(props.pads); [-3.6, -1.2, 1.2, 3.6].forEach((x, k) => { B(props.pads, 1.2, 0.3, 1.2, 0xffffff, x, 0.15, 0, VX.lam(k % 2 ? 0xfff2c8 : 0xffffff)) });
    props.wall = new THREE.Group(); S.add(props.wall); for (let x = -3; x <= 3; x++) for (let y = 0; y < 4; y++) B(props.wall, 1, 1, 0.6, (x + y) % 2 ? 0x2a2840 : 0x343252, x, y + 0.5, -1.6); for (let x = -3; x <= 3; x += 2) B(props.wall, 0.12, 0.12, 0.62, 0x22e6ff, x, 3.2, -1.6, VX.bas(0x22e6ff));
    props.anchor = new THREE.Group(); S.add(props.anchor); B(props.anchor, 0.9, 0.9, 0.9, 0xffc23c, 0, 5.3, 0); B(props.anchor, 0.5, 0.5, 0.95, 0x8a5a10, 0, 5.3, 0);
    props.ledge = new THREE.Group(); S.add(props.ledge); for (let y = 0; y < 2; y++) B(props.ledge, 2, 1, 2, y === 1 ? 0x6ed04a : 0x8a6a4a, -5.5, y + 0.5, -0.5);
    const hero = VX.hero('ryzhik'), piv = new THREE.Group(), inner = new THREE.Group(); inner.position.y = -1; inner.add(hero.G); piv.add(inner); S.add(piv);
    hero.G.traverse(o => { if (o.isMesh) o.castShadow = true });
    const foe = VX.oni(); foe.scale.setScalar(0.62); S.add(foe);
    const rival = VX.hero('rina'); S.add(rival.G);
    /* ghosts for the dash */
    const gmat = new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.35, depthWrite: false });
    const ghosts = [0, 1, 2, 3].map(() => { const g = hero.G.clone(true); g.traverse(o => { if (o.isMesh) o.material = gmat }); g.visible = false; S.add(g); return g });
    /* rope, slash arc, bolt, star, particles */
    const add = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }, o || {}));
    const rope = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x5a3a1a })); S.add(rope);
    const arc = new THREE.Mesh(new THREE.RingGeometry(1.1, 2.2, 32, 1, -1.2, 2.4), add(0xbff4ff, { side: THREE.DoubleSide })); S.add(arc);
    const bolt = [0, 1, 2, 3, 4, 5, 6, 7].map(() => { const m = new THREE.Mesh(BOX, add(0xbff4ff)); S.add(m); return m });
    const star = new THREE.Group(); [[0.05, 0.8, 0.05], [0.8, 0.05, 0.05]].forEach(d => { const m = new THREE.Mesh(BOX, add(0xffffff, { opacity: 1 })); m.scale.set(...d); star.add(m) }); S.add(star);
    const PN = 140, pm = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0xffffff }), PN), pd = []; pm.instanceMatrix.setUsage(THREE.DynamicDrawUsage); S.add(pm); pm.frustumCulled = false;
    for (let k = 0; k < PN; k++) pd.push({ p: V(0, -99, 0), v: V(0, 0, 0), life: 0, s: 0.1 }); let pi = 0; const _m = new THREE.Matrix4(), _c = new THREE.Color(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
    function burst(p, n, cols, sp, up, sz) { for (let k = 0; k < n; k++) { const d = pd[pi = (pi + 1) % PN]; d.p.copy(p); d.v.set((Math.random() - 0.5) * sp, Math.random() * up, (Math.random() - 0.5) * sp * 0.6); d.life = 0.5 + Math.random() * 0.4; d.s = (sz || 0.1) * (0.6 + Math.random() * 0.8); pm.setColorAt(pi, _c.setHex(cols[k % cols.length])) } if (pm.instanceColor) pm.instanceColor.needsUpdate = true }
    function partTick(dt) { for (let k = 0; k < PN; k++) { const d = pd[k]; if (d.life > 0) { d.life -= dt; d.v.y -= 9 * dt; d.p.addScaledVector(d.v, dt) } const s = d.life > 0 ? d.s * Math.min(1, d.life * 3) : 0; _m.compose(d.p, _q, _s.set(s, s, s)); pm.setMatrixAt(k, _m) } pm.instanceMatrix.needsUpdate = true }
    function boltSet(a, b, jit) { let prev = a.clone(); bolt.forEach((m, k) => { const nx = k === bolt.length - 1 ? b.clone() : a.clone().lerp(b, (k + 1) / bolt.length).add(V(0, (Math.random() - 0.5) * jit, (Math.random() - 0.5) * jit)); m.position.copy(prev).add(nx).multiplyScalar(0.5); m.scale.set(0.08, 0.08, prev.distanceTo(nx) + 0.08); m.lookAt(nx); prev = nx }) }
    /* weapons for the weapon carousel */
    const WL = [['sword', 'Меч', 'Sword'], ['katana', 'Райкири', 'Raikiri'], ['spear', 'Копьё', 'Spear'], ['scythe', 'Коса Кроноса', 'Scythe of Kronos'], ['bow', 'Лук Артемиды', 'Bow of Artemis']];
    const wpn = {}; WL.forEach(([id]) => { const w = VX.weapon(id); w.visible = false; hero.armR.add(w); wpn[id] = w }); const rw = VX.weapon('sword'); rival.armR.add(rw);
    const showW = id => WL.forEach(([k]) => wpn[k].visible = k === id);

    const T = opts.lang;
    /* each technique: duration, key list and the pose for time u */
    const SC = [
      { d: 4.4, keys: ['Space'], f(u, P) { /* rhythm jumps over pads, the fifth is a mega jump */
        const hops = [[0.2, 0.6, -6, -3.6, 1.0], [0.8, 0.58, -3.6, -1.2, 1.2], [1.38, 0.56, -1.2, 1.2, 1.4], [1.94, 0.54, 1.2, 3.6, 1.6], [2.48, 1.0, 3.6, 6.4, 2.5]];
        let x = -6, y = 0.3, air = false, n = 0; for (const [t0, d, a, b, h] of hops) { if (u >= t0) n++; if (u >= t0 && u < t0 + d) { const p = (u - t0) / d; x = a + (b - a) * p; y = (b > 5 ? 0 : 0.3) + Math.sin(p * PI) * h + (b > 5 ? 0.3 * (1 - p) : 0); air = true } else if (u >= t0 + d) { x = b; y = b > 5 ? 0 : 0.3 } }
        P.x = x; P.y = y; P.air = air; P.press = hops.some(([t0]) => Math.abs(u - t0) < 0.1) ? ['Space'] : []; hops.forEach(([t0, d, a, b], k) => { if (P.once('h' + k, t0 + d)) burst(V(b, 0.4, 0), k === 4 ? 26 : 8, k === 4 ? [0xffe14d, 0xffffff, 0xff8a3a] : [0xffffff, 0xfff2c8], k === 4 ? 6 : 3, 3) });
        P.hud = n ? (T() === 'en' ? 'Streak x' + n + (n === 5 ? ' · MEGA JUMP' : ' · speed +' + n * 5 + '%') : 'Серия x' + n + (n === 5 ? ' · МЕГА-ПРЫЖОК' : ' · скорость +' + n * 5 + '%')) : ''; P.show = ['pads'] } },
      { d: 3.8, keys: ['Shift', 'Space'], f(u, P) { /* run, dash through, double jump with a flip */
        let x = -6 + 4 * k01(u, 0, 0.6), y = 0; const dd = k01(u, 0.6, 0.85); if (u >= 0.6) x = -2 + 4 * eo(dd); if (u >= 0.85) x = 2 + 1.2 * k01(u, 0.85, 1.25);
        const j = k01(u, 1.25, 2.7); if (u >= 1.25) { x = 3.2 + 3 * j; y = j < 0.3 ? Math.sin(j / 0.3 * PI / 2) * 1.4 : 1.4 + Math.sin(k01(j, 0.3, 1) * PI) * 1.6 - k01(j, 0.65, 1) * 1.4; P.air = true } if (u >= 2.7) { x = 6.2; y = 0 }
        P.flip = u > 1.6 && u < 2.1 ? io(k01(u, 1.6, 2.1)) * PI * 2 : 0; P.x = x; P.y = y; P.ghost = u > 0.6 && u < 1.1; P.run = u < 1.25;
        P.press = Math.abs(u - 0.62) < 0.12 ? ['Shift'] : (Math.abs(u - 1.27) < 0.1 || Math.abs(u - 1.62) < 0.1) ? ['Space'] : [];
        if (P.once('d', 0.62)) burst(V(-2, 1, 0), 12, [0x9fe8ff, 0xffffff], 4, 2); if (P.once('f', 1.6)) burst(V(4.2, 2.2, 0), 14, [0xffffff, 0xffe14d], 4, 3);
        P.hud = u < 1.25 ? (u > 0.6 ? (T() === 'en' ? 'Dash · invulnerable' : 'Рывок · неуязвим') : '') : (u < 2.7 ? (T() === 'en' ? 'Double jump · flip' : 'Двойной прыжок · сальто') : '') } },
      { d: 3.6, keys: ['W', 'Space'], f(u, P) { /* jump onto the wall, run across the pit, jump off */
        let x = -6 + 3.4 * k01(u, 0, 0.7), y = 0, tilt = 0; const on = k01(u, 0.85, 2.4);
        if (u >= 0.7 && u < 0.85) { const p = k01(u, 0.7, 0.85); x = -2.6 + 0.4 * p; y = Math.sin(p * PI / 2) * 1.8 }
        if (u >= 0.85) { x = -2.2 + 4.6 * on; y = 1.8 + Math.sin(on * PI) * 0.4; tilt = 0.55; P.z = -0.95 } if (u >= 2.4) { const p = k01(u, 2.4, 2.9); x = 2.4 + 3 * p; y = 2.2 * (1 - p) + Math.sin(p * PI) * 1.2; tilt = 0.55 * (1 - p); P.z = -0.95 * (1 - p); P.air = true } if (u >= 2.9) { x = 5.4; y = 0; P.z = 0 }
        P.x = x; P.y = y; P.tilt = tilt; P.run = u < 2.4; P.press = ['W'].concat(Math.abs(u - 0.72) < 0.1 || Math.abs(u - 2.42) < 0.1 ? ['Space'] : []); P.pit = true; P.show = ['wall'];
        if (u > 0.9 && u < 2.4 && Math.random() < 0.3) burst(V(x, y + 0.1, -1.2), 1, [0x22e6ff, 0xffffff], 1, 1, 0.07);
        P.hud = u > 0.85 && u < 2.4 ? (T() === 'en' ? 'Wall run' : 'Бег по стене') : '' } },
      { d: 3.6, keys: ['E'], f(u, P) { /* shoot the hook, swing over the pit, fling up */
        let x = -6 + 3.2 * k01(u, 0, 0.6), y = 0; const A = V(0, 5.3, 0), r = 4.7; let rope = 0;
        if (u >= 0.6) { const sh = k01(u, 0.6, 0.78); rope = sh; x = -2.8; y = 0 }
        if (u >= 0.78 && u < 1.95) { const p = k01(u, 0.78, 1.95), a = -0.55 + 1.1 * io(p); x = A.x + Math.sin(a) * r; y = A.y - Math.cos(a) * r - 0.6; rope = 1; P.air = true }
        if (u >= 1.95) { const p = k01(u, 1.95, 2.7); x = 2.9 + 3 * p; y = (A.y - Math.cos(0.55) * r - 0.6) + Math.sin(p * PI) * 2.4 - p * 0.15; P.air = p < 1; P.flip = io(p) * PI * 2; if (u >= 2.7) { x = 5.9; y = 0; P.flip = 0 } }
        P.x = x; P.y = Math.max(0, y); P.rope = rope; P.anchor = A; P.run = u < 0.6; P.pit = true; P.show = ['anchor']; P.press = u > 0.58 && u < 1.95 ? ['E'] : []; if (P.once('r', 1.95)) burst(V(x, y + 1, 0), 12, [0xffe14d, 0xffffff], 4, 3);
        P.hud = u > 0.6 && u < 2.7 ? (T() === 'en' ? 'Hook · swing · fling' : 'Крюк · раскачка · бросок') : '' } },
      { d: 4.2, keys: ['Space'], f(u, P) { /* jump off the ledge and glide on wings */
        let x = -5.5, y = 2; const j = k01(u, 0.3, 0.7), g = k01(u, 0.7, 3.3);
        if (u >= 0.3) { x = -5.5 + 1.5 * j; y = 2 + Math.sin(j * PI / 2) * 1.0 } if (u >= 0.7) { x = -4 + 9.5 * g; y = 3 - 3 * (g ** 1.3) + Math.sin(g * PI * 3) * 0.12 } if (u >= 3.3) { x = 5.5; y = 0 }
        P.x = x; P.y = y; P.wings = u > 0.6 && u < 3.3; P.air = u > 0.3 && u < 3.3; P.press = u > 0.28 && u < 3.3 ? ['Space'] : []; P.show = ['ledge'];
        if (P.wings && Math.random() < 0.25) burst(V(x - 0.5, y + 1.2, -0.2), 1, [0xffffff, 0xfff2c8], 1, 0.5, 0.09);
        P.hud = P.wings ? (T() === 'en' ? 'Hold jump · glide' : 'Держи прыжок · полёт') : '' } },
      { d: 4.2, keys: ['LMB'], f(u, P) { /* hit, hit, pause with a glint, special: Raiko dash */
        let x = -1.6, ax = -0.6, slash = -1; P.weapon = 'katana'; P.foe = true;
        const sw = (a, b) => { const p = k01(u, a, b); return p > 0 && p < 1 ? p : -1 };
        let s1 = sw(0.2, 0.42), s2 = sw(0.62, 0.84); if (s1 >= 0) { ax = -2.8 + 3 * eo(s1); slash = s1 } if (s2 >= 0) { ax = 0.2 - 3 * eo(s2); slash = s2 }
        P.glint = u > 1.0 && u < 1.6 ? k01(u, 1.0, 1.6) : -1; const d = k01(u, 1.7, 1.86); if (u >= 1.7) { x = -1.6 + 4.6 * eo(d); ax = -1.5 } if (u >= 2.6) { const b = k01(u, 2.6, 3.1); x = 3 - 4.6 * io(b); P.air = b < 1; P.yb = Math.sin(b * PI) * 1.2; ax = -0.6 }
        P.x = x; P.ax = ax; P.slash = slash; P.bolt = u > 1.72 && u < 2.1 ? 1 - k01(u, 1.95, 2.1) : 0; P.boltX = x;
        P.press = [0.2, 0.62, 1.68].some(t => Math.abs(u - t) < 0.1) ? ['LMB'] : []; P.foeHit = Math.max(1 - Math.abs(u - 0.32) * 8, 1 - Math.abs(u - 0.74) * 8, u > 1.9 && u < 2.3 ? 1.4 : 0, 0);
        if (P.once('a', 0.32) || P.once('b', 0.74)) burst(V(0.9, 1.4, 0), 10, [0xbff4ff, 0xffffff], 4, 3); if (P.once('c', 1.9)) burst(V(1, 1.4, 0), 24, [0x7fe8ff, 0xffffff, 0xffe14d], 7, 4);
        P.hud = u < 0.95 ? (T() === 'en' ? 'Strike · strike' : 'Удар · удар') : u < 1.68 ? (T() === 'en' ? '…pause' : '…пауза') : u < 2.6 ? (T() === 'en' ? 'RAIKO!' : 'РАЙКО!') : '' } },
      { d: 3.8, keys: ['LMB'], f(u, P) { /* PvP: a hit knocks the rival back, the strong one further */
        let x = -1.2, ax = -0.6, rx = 1.0, ry = 0, rs = 0; P.weapon = 'sword'; P.rival = true;
        const s1 = k01(u, 0.3, 0.5), s2 = k01(u, 1.7, 2.0); if (s1 > 0 && s1 < 1) ax = -2.6 + 2.8 * eo(s1); if (s2 > 0 && s2 < 1) { ax = -3 + 3.4 * eo(s2); x = -1.2 + 1.2 * eo(s2) }
        const k1 = k01(u, 0.45, 0.95); rx = 1.0 + 1.6 * eo(k1); ry = Math.sin(k1 * PI) * 0.4; const back = k01(u, 1.1, 1.6); rx -= 1.4 * io(back);
        if (u >= 1.9) { const k2 = k01(u, 1.9, 2.7); rx = 1.2 + 4.2 * eo(k2); ry = Math.sin(k2 * PI) * 1.6; rs = k2 * PI * 3 } if (u >= 2.9) { const w = k01(u, 2.9, 3.7); rx = 5.4 - 4.4 * io(w); ry = 0; rs = 0; x = 0 - 1.2 * io(w) }
        P.x = x; P.ax = ax; P.rx = rx; P.ry = ry; P.rs = rs; P.press = [0.3, 1.7].some(t => Math.abs(u - t) < 0.1) ? ['LMB'] : [];
        if (P.once('a', 0.46)) burst(V(1.2, 1.4, 0), 12, [0xffffff, 0xff5d8a], 4, 3); if (P.once('b', 1.92)) burst(V(1.4, 1.4, 0), 26, [0xffffff, 0xff5d8a, 0xffe14d], 7, 5);
        P.hud = u > 0.4 && u < 1.2 ? (T() === 'en' ? 'Knockback' : 'Отброс') : u > 1.8 && u < 2.9 ? (T() === 'en' ? 'Strong hit · further' : 'Сильный удар · дальше') : '' } },
      { d: 5.5, keys: ['Z', 'LMB'], f(u, P) { /* weapon carousel: switch with Z, try each one */
        const i = Math.min(WL.length - 1, Math.floor(u / 1.1)), p = (u % 1.1) / 1.1; P.weapon = WL[i][0]; P.x = 0; P.pop = p < 0.2 ? p / 0.2 : 1;
        P.ax = p > 0.35 && p < 0.7 ? -2.8 + 3 * eo(k01(p, 0.35, 0.6)) : -0.7; P.slash = p > 0.42 && p < 0.65 ? k01(p, 0.42, 0.65) : -1; P.press = p < 0.12 ? ['Z'] : p > 0.33 && p < 0.45 ? ['LMB'] : [];
        if (P.once('w' + i, i * 1.1 + 0.02)) burst(V(0.6, 1.4, 0), 10, [0xffe14d, 0xffffff], 3, 3);
        P.hud = WL[i][T() === 'en' ? 2 : 1]; P.face = PI / 2 - 0.9; P.zoom = 1 } }
    ];
    const KEYN = { Space: { ru: 'Пробел', en: 'Space' }, LMB: { ru: 'ЛКМ', en: 'LMB' } };
    const hits = {};
    function frame(dt) {
      const sc = SC[TV.i]; TV.t += dt; if (TV.t >= sc.d + 0.5) { TV.t = 0; TV.loops++; for (const k in hits) delete hits[k]; if (!TV.user && TV.loops >= 2) { TV.loops = 0; select((TV.i + 1) % SC.length, false) } }
      const u = Math.min(TV.t, sc.d), P = { x: 0, y: 0, z: 0, air: false, run: false, press: [], hud: '', show: [], flip: 0, tilt: 0, ax: null, slash: -1, glint: -1, foeHit: 0, once: (key, at) => { if (u >= at && !hits[key]) { hits[key] = 1; return true } return false } };
      sc.f(u, P);
      /* props */
      props.pads.visible = P.show.includes('pads'); props.wall.visible = P.show.includes('wall'); props.anchor.visible = P.show.includes('anchor'); props.ledge.visible = P.show.includes('ledge'); mid.visible = !P.pit;
      /* hero */
      piv.position.set(P.x, P.y + (P.yb || 0) + 1, P.z); piv.rotation.set(P.tilt, 0, -P.flip); hero.G.rotation.y = P.face != null ? P.face : PI / 2; const tt = performance.now() / 1000;
      const run = P.run && !P.air, sw = run ? Math.sin(tt * 18) * 0.9 : 0; hero.legL.rotation.x = P.air ? -0.7 : sw; hero.legR.rotation.x = P.air ? 0.5 : -sw; hero.armL.rotation.x = run ? -sw * 0.8 : P.air ? -1.2 : -0.2; hero.armR.rotation.x = P.ax != null ? P.ax : (run ? sw * 0.8 : -0.4);
      hero.wings.visible = !!P.wings; if (P.wings) { hero.wingL.rotation.y = Math.sin(tt * 16) * 0.6; hero.wingR.rotation.y = -Math.sin(tt * 16) * 0.6 }
      showW(P.weapon || null); if (P.weapon && wpn[P.weapon]) { const w = wpn[P.weapon], s = P.pop != null ? (P.pop < 1 ? eo(P.pop) * (1 + Math.sin(P.pop * PI) * 0.4) : 1) : 1; w.scale.setScalar(Math.max(0.01, s)) }
      ghosts.forEach((g, k) => { g.visible = !!P.ghost; if (P.ghost) { g.position.set(P.x - (k + 1) * 0.7, P.y, 0); g.rotation.y = PI / 2; gmat.opacity = 0.35 } });
      /* rope */
      rope.visible = !!P.rope; if (P.rope) { const hand = V(P.x + 0.3, P.y + 1.5, 0), a = P.anchor, end = hand.clone().lerp(a, P.rope); rope.position.copy(hand).add(end).multiplyScalar(0.5); rope.scale.set(0.06, 0.06, hand.distanceTo(end) + 0.01); rope.lookAt(end) }
      /* slash arc, glint, bolt */
      arc.material.opacity = P.slash >= 0 ? 0.85 * (1 - P.slash) : 0; arc.position.set(P.x + 0.6, 1.5, 0.3); arc.rotation.set(0, PI / 2, P.slash * 2.2 - 1);
      star.visible = P.glint >= 0; if (P.glint >= 0) { star.position.set(P.x + 0.4 + P.glint * 1.1, 1.0 + P.glint * 0.5, 0.4); star.scale.setScalar(0.2 + Math.sin(P.glint * PI) * 0.9); star.rotation.z = tt * 3 }
      bolt.forEach(m => m.material.opacity = P.bolt || 0); if (P.bolt) boltSet(V(-1.4, 1.5, 0.2), V(P.boltX + 0.2, 1.5, 0.2), 0.5);
      /* foe and rival */
      foe.visible = !!P.foe; if (P.foe) { foe.position.set(1.0 + P.foeHit * 0.25, 0, 0); foe.rotation.set(0, -PI / 2, -P.foeHit * 0.15); foe.scale.set(0.62, 0.62 * (1 - P.foeHit * 0.12), 0.62) }
      rival.G.visible = !!P.rival; if (P.rival) { rival.G.position.set(P.rx, P.ry, 0); rival.G.rotation.set(0, -PI / 2, P.rs); rival.armR.rotation.x = -0.5 }
      partTick(dt);
      /* keys and caption */
      const kh = hud.querySelector('.tv-keys'), lang = T(); if (kh.dataset.i != TV.i + lang) { kh.dataset.i = TV.i + lang; kh.innerHTML = ''; sc.keys.forEach(k => { const b = document.createElement('kbd'); b.dataset.k = k; b.textContent = KEYN[k] ? KEYN[k][lang] : k; kh.appendChild(b) }) }
      [...kh.children].forEach(b => b.classList.toggle('on', P.press.includes(b.dataset.k)));
      const cap = hud.querySelector('.tv-cap'); if (cap.textContent !== P.hud) { cap.textContent = P.hud; cap.classList.toggle('on', !!P.hud) }
      const pr = hud.querySelector('.tv-prog i'); if (pr) pr.style.width = (Math.min(1, TV.t / sc.d) * 100).toFixed(1) + '%';
      /* camera follows a little */
      C.position.set(P.x * 0.3, P.zoom ? 2.6 : 3.3, P.zoom ? 7 : 11); C.lookAt(P.x * 0.34, P.zoom ? 1.7 : 2.2, 0);
      R.render(S, C);
    }
    function size() { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; R.setSize(w, h, false); R.domElement.style.width = '100%'; R.domElement.style.height = '100%'; C.aspect = w / h; C.updateProjectionMatrix() }
    size(); new ResizeObserver(size).observe(host);
    let last = performance.now(); function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (TV.on && !document.hidden) frame(dt); requestAnimationFrame(loop) } requestAnimationFrame(loop);
    new IntersectionObserver(es => es.forEach(e => TV.on = e.isIntersecting), { rootMargin: '100px' }).observe(host);
    function select(i, user) { TV.i = i; TV.t = 0; TV.loops = 0; if (user) TV.user = true; for (const k in hits) delete hits[k]; opts.onSelect && opts.onSelect(i) }
    TV.select = select; TV.frame = frame; return TV;
  }
  window.TECHVIEW = { init, state: TV };
})();
