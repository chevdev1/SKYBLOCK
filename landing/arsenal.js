/* Arsenal: every weapon, armour, wings, boots and relic from the game in one dialog.
   A small live stage shows the hero using the selected item: attack strings with effects for weapons,
   pieces dropping on for armour, flight for wings, double jumps for boots, a floating relic. */
(function () {
  const V = (x, y, z) => new THREE.Vector3(x, y, z), PI = Math.PI;
  const k01 = (u, a, b) => Math.min(1, Math.max(0, (u - a) / (b - a))), eo = x => 1 - (1 - x) ** 3, io = x => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;

  /* ---------- extra voxel models ---------- */
  function models() {
    const B = VX.B, bas = VX.bas, G = () => new THREE.Group(), glow = (g, c, w, h, d, x, y, z, o) => { const m = new THREE.Mesh(VX.BOX, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o || 0.4, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.set(w, h, d); m.position.set(x, y, z); g.add(m); return m };
    const W = {
      starsword() { const g = G(); B(g, 0.08, 0.08, 0.3, 0x2a3a6a, 0, 0, 0); B(g, 0.4, 0.08, 0.1, 0x5fb8ff, 0, 0, 0.16); B(g, 0.1, 0.06, 1.25, 0xe8f0ff, 0, 0, 0.85); B(g, 0.12, 0.12, 0.12, 0xffffff, 0, 0, 0.16, bas(0x9fe8ff)); glow(g, 0x9fd8ff, 0.16, 0.12, 1.3, 0, 0, 0.85, 0.3); return g },
      firescythe() { const g = G(); B(g, 0.07, 0.07, 2.0, 0x6b4226, 0, 0, 0.7); for (let k = 0; k < 6; k++) B(g, 0.05, 0.16, 0.2, 0xff7a3a, 0, 0.12 + k * 0.15, 1.7 - k * k * 0.025, bas(k > 3 ? 0xffd060 : 0xff7a3a)); glow(g, 0xff8a3a, 0.1, 0.9, 0.5, 0, 0.45, 1.55, 0.35); return g },
      voidscythe() { const g = G(); B(g, 0.08, 0.08, 2.1, 0x1a1428, 0, 0, 0.7); B(g, 0.14, 0.14, 0.14, 0xb070ff, 0, 0, 1.78, bas(0xb070ff)); for (let k = 0; k < 7; k++) B(g, 0.05, 0.16, 0.2, 0xb070ff, 0, 0.12 + k * 0.15, 1.78 - k * k * 0.022, bas(k > 4 ? 0xe0c8ff : 0x9a50e0)); return g },
      spear: () => VX.WEAPONS.spear(),
      wand() { const g = G(); B(g, 0.07, 0.07, 1.5, 0x2a1a3a, 0, 0, 0.5); B(g, 0.2, 0.2, 0.2, 0x9a50e0, 0, 0, 1.3, bas(0xc48aff)); glow(g, 0xb070ff, 0.4, 0.4, 0.4, 0, 0, 1.3, 0.35); return g },
      bow: () => VX.WEAPONS.bow(),
      shears() { const g = G(); for (const k of [-1, 1]) { const b = G(); B(b, 0.06, 0.06, 1.1, 0xffd060, 0, 0, 0.55); B(b, 0.22, 0.06, 0.22, 0xffc23c, 0, 0, -0.05); b.rotation.y = k * 0.22; g.add(b) } return g },
      gsword() { const g = G(); B(g, 0.09, 0.09, 0.42, 0x2a2840, 0, 0, 0); B(g, 0.6, 0.1, 0.14, 0x5a6aa8, 0, 0, 0.24); B(g, 0.14, 0.42, 1.85, 0x9fb0d8, 0, 0, 1.25); for (let k = 0; k < 5; k++) B(g, 0.15, 0.06, 0.06, 0xffffff, 0, (k % 2 ? 0.1 : -0.08), 0.6 + k * 0.32, bas(0xffffff)); return g },
      muramasa() { const g = G(); B(g, 0.08, 0.08, 0.36, 0x1a1420, 0, 0, 0.02); B(g, 0.26, 0.05, 0.26, 0x3a1a20, 0, 0, 0.21); B(g, 0.05, 0.11, 1.45, 0x2a1a24, 0, 0.02, 0.98); B(g, 0.055, 0.03, 1.4, 0xff3a5a, 0, 0.08, 0.98, bas(0xff3a5a)); glow(g, 0xff2a4a, 0.12, 0.2, 1.5, 0, 0.02, 0.98, 0.3); return g },
      katana: () => VX.katana(),
      twinR() { const g = G(); B(g, 0.08, 0.08, 0.26, 0x6b4226, 0, 0, 0); B(g, 0.08, 0.05, 0.9, 0xffc23c, 0, 0, 0.6, bas(0xffd060)); glow(g, 0xffb21c, 0.14, 0.12, 0.95, 0, 0, 0.6, 0.35); return g },
      twinL() { const g = G(); B(g, 0.08, 0.08, 0.26, 0x2a3a6a, 0, 0, 0); B(g, 0.08, 0.05, 0.9, 0x5fd3ff, 0, 0, 0.6, bas(0x9fe8ff)); glow(g, 0x5fd3ff, 0.14, 0.12, 0.95, 0, 0, 0.6, 0.35); return g },
      fist() { const g = G(); B(g, 0.32, 0.26, 0.34, 0xffc23c, 0, -0.02, 0); B(g, 0.34, 0.08, 0.36, 0xff7a3a, 0, 0.1, 0, bas(0xff8a3a)); glow(g, 0xff8a2a, 0.46, 0.4, 0.46, 0, 0, 0, 0.3); return g }
    };
    const R = {
      hourglass() { const g = G(); B(g, 0.8, 0.12, 0.8, 0xc8955a, 0, 0.7, 0); B(g, 0.8, 0.12, 0.8, 0xc8955a, 0, -0.7, 0); for (const [x, z] of [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]]) B(g, 0.08, 1.3, 0.08, 0x8a5a2a, x, 0, z); for (let k = 0; k < 5; k++) { const w = 0.5 - Math.abs(k - 2) * 0.18; B(g, w, 0.24, w, 0xbfe8ff, 0, -0.5 + k * 0.25, 0, VX.lam(0xdff4ff)) } B(g, 0.2, 0.2, 0.2, 0xffd060, 0, -0.45, 0, bas(0xffd060)); return g },
      shield() { const g = G(); B(g, 1.1, 1.3, 0.12, 0xffc23c, 0, 0, 0); B(g, 0.9, 1.1, 0.14, 0xfff2c8, 0, 0, 0); B(g, 0.4, 0.4, 0.16, 0x6ad06a, 0, 0.05, 0.02); B(g, 0.12, 0.12, 0.18, 0xffe14d, -0.08, 0.1, 0.04, bas(0xffe14d)); B(g, 0.12, 0.12, 0.18, 0xffe14d, 0.08, 0.1, 0.04, bas(0xffe14d)); return g },
      lamp() { const g = G(); B(g, 0.5, 0.1, 0.5, 0x2a2840, 0, 0.5, 0); B(g, 0.5, 0.1, 0.5, 0x2a2840, 0, -0.4, 0); B(g, 0.42, 0.8, 0.42, 0x9fe8ff, 0, 0.05, 0, bas(0x9fe8ff)); B(g, 0.1, 0.3, 0.1, 0x2a2840, 0, 0.7, 0); return g },
      claw() { const g = G(); B(g, 0.5, 0.4, 0.4, 0xff6a3a, 0, -0.3, 0); B(g, 0.22, 0.8, 0.3, 0xff6a3a, -0.14, 0.25, 0); B(g, 0.2, 0.6, 0.3, 0xd84a2a, 0.18, 0.15, 0); B(g, 0.22, 0.2, 0.3, 0xffd0a0, -0.14, 0.7, 0); return g },
      scarf() { const g = G(); for (let k = 0; k < 8; k++) B(g, 0.3, 0.16, 0.3, k % 2 ? 0xff5a2a : 0xffd060, Math.sin(k * 0.8) * 0.4, 0.6 - k * 0.17, Math.cos(k * 0.8) * 0.2, k > 5 ? bas(0xff8a3a) : null); return g },
      pearl() { const g = G(); B(g, 0.7, 0.7, 0.7, 0xdff4ff, 0, 0, 0, VX.lam(0xeefaff)); B(g, 0.5, 0.86, 0.5, 0xdff4ff, 0, 0, 0, VX.lam(0xeefaff)); B(g, 0.86, 0.5, 0.5, 0xdff4ff, 0, 0, 0, VX.lam(0xeefaff)); B(g, 0.2, 0.2, 0.2, 0x5fd3ff, 0.25, 0.2, 0.3, bas(0x9fe8ff)); return g },
      mask() { const g = G(); B(g, 0.9, 0.9, 0.16, 0x1a1420, 0, 0, 0); B(g, 0.24, 0.1, 0.18, 0xff2a3a, -0.2, 0.1, 0.02, bas(0xff2a3a)); B(g, 0.24, 0.1, 0.18, 0xff2a3a, 0.2, 0.1, 0.02, bas(0xff2a3a)); B(g, 0.5, 0.06, 0.18, 0xff2a3a, 0, -0.22, 0.02); return g },
      heart() { const g = G(); for (const [x, y, w] of [[-0.25, 0.25, 0.4], [0.25, 0.25, 0.4], [0, 0, 0.8], [0, -0.3, 0.5], [0, -0.5, 0.2]]) B(g, w, 0.32, 0.36, 0xff4a6a, x, y, 0, bas(0xff4a6a)); B(g, 0.14, 0.14, 0.38, 0xffffff, -0.25, 0.3, 0.01, bas(0xffffff)); return g },
      hook() { const g = G(); B(g, 0.08, 0.9, 0.08, 0x8a8a96, 0, 0.3, 0); for (const k of [-1, 1]) { B(g, 0.08, 0.08, 0.4, 0x8a8a96, k * 0.15, -0.15, 0.1); B(g, 0.08, 0.3, 0.08, 0xc8c8d0, k * 0.3, -0.05, 0.25) } B(g, 0.5, 0.06, 0.06, 0xc8955a, 0, 0.75, 0); return g }
    };
    return { W, R };
  }

  /* armour sets used by the arsenal on top of the world sets in VX */
  function armourDefs() {
    Object.assign(VX.ARMOR, {
      turtle: { c: 0x3f8a34, c2: 0x8ad05a, c3: 0xffe08a, ru: 'Черепашья броня', en: 'Turtle armour' },
      shadow: { c: 0xf2f2f2, c2: 0xb3122e, c3: 0xd8d8e0, ru: 'Облачение тени', en: 'Shadow garb' },
      erebusA: { c: 0x1a1428, c2: 0x3a2a5a, c3: 0xb070ff, glow: 1, ru: 'Доспех Эреба', en: 'Armour of Erebus' },
      nightmare: { c: 0x14101c, c2: 0x2a1a3a, c3: 0xff3a5a, glow: 1, ru: 'Покров кошмара', en: 'Nightmare shroud' }
    });
  }

  function init(stageEl, onReady) {
    armourDefs(); const M = models();
    const R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); R.outputEncoding = THREE.sRGBEncoding; stageEl.appendChild(R.domElement);
    const S = new THREE.Scene(); S.add(new THREE.HemisphereLight(0xffffff, 0x8a9ac8, 0.95)); const sun = new THREE.DirectionalLight(0xfff2dc, 0.7); sun.position.set(3, 7, 6); S.add(sun);
    const C = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    /* pedestal island */
    const isle = VX.island('islands', 3, { deco: false }); isle.position.y = -0.5; S.add(isle);
    const ped = new THREE.Group(); VX.B(ped, 1.4, 0.5, 1.4, 0xe8dcc0, 0, 0.25, 0); VX.B(ped, 1.6, 0.12, 1.6, 0xffc23c, 0, 0.56, 0); S.add(ped);
    /* hero, dummy */
    const hero = VX.hero('ryzhik'); S.add(hero.G); hero.G.scale.setScalar(1.15);
    const dummy = new THREE.Group(); VX.B(dummy, 0.12, 1.6, 0.12, 0x8a5a2a, 0, 0.8, 0); VX.B(dummy, 0.8, 0.9, 0.5, 0xe8d0a0, 0, 1.3, 0); VX.B(dummy, 0.5, 0.5, 0.5, 0xe8d0a0, 0, 2.0, 0); VX.B(dummy, 0.9, 0.12, 0.12, 0x8a5a2a, 0, 1.5, 0); for (const k of [-0.12, 0.12]) VX.B(dummy, 0.08, 0.08, 0.04, 0x1d2433, k, 2.05, 0.26); S.add(dummy);
    /* fx pool */
    const add = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 48), add(0xffffff)); ring.rotation.x = -PI / 2; S.add(ring);
    const cres = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.0, 24, 1, -1, 2), add(0xffffff)); m.rotation.y = PI / 2; S.add(m); return m });
    const orbs = [0, 1, 2, 3, 4, 5].map(() => { const m = new THREE.Mesh(VX.BOX, add(0xffffff)); m.scale.setScalar(0.28); S.add(m); return m });
    const bolt = [0, 1, 2, 3, 4, 5, 6, 7].map(() => { const m = new THREE.Mesh(VX.BOX, add(0xbff4ff)); S.add(m); return m });
    const hole = new THREE.Mesh(VX.BOX, new THREE.MeshBasicMaterial({ color: 0x05030a, transparent: true, opacity: 0 })); S.add(hole);
    const slashes = [0, 1, 2].map(() => { const m = new THREE.Mesh(VX.BOX, add(0xffffff)); S.add(m); return m });
    const PN = 120, pm = new THREE.InstancedMesh(VX.BOX, new THREE.MeshBasicMaterial({ color: 0xffffff }), PN), pd = []; pm.frustumCulled = false; S.add(pm); for (let k = 0; k < PN; k++) pd.push({ p: V(0, -99, 0), v: V(0, 0, 0), life: 0, s: 0.1 }); let pi = 0; const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _c = new THREE.Color();
    function burst(p, n, cols, sp, up, sz) { for (let k = 0; k < n; k++) { const d = pd[pi = (pi + 1) % PN]; d.p.copy(p); d.v.set((Math.random() - 0.5) * sp, Math.random() * up, (Math.random() - 0.5) * sp); d.life = 0.5 + Math.random() * 0.4; d.s = (sz || 0.1) * (0.6 + Math.random() * 0.8); pm.setColorAt(pi, _c.setHex(cols[k % cols.length])) } if (pm.instanceColor) pm.instanceColor.needsUpdate = true }
    function partTick(dt) { for (let k = 0; k < PN; k++) { const d = pd[k]; if (d.life > 0) { d.life -= dt; d.v.y -= 8 * dt; d.p.addScaledVector(d.v, dt) } const s = d.life > 0 ? d.s * Math.min(1, d.life * 3) : 0; _m.compose(d.p, _q, _s.set(s, s, s)); pm.setMatrixAt(k, _m) } pm.instanceMatrix.needsUpdate = true }
    function boltSet(a, b, jit, op) { let prev = a.clone(); bolt.forEach((m, k) => { m.material.opacity = op; const nx = k === bolt.length - 1 ? b.clone() : a.clone().lerp(b, (k + 1) / bolt.length).add(V((Math.random() - 0.5) * jit, (Math.random() - 0.5) * jit, (Math.random() - 0.5) * jit)); m.position.copy(prev).add(nx).multiplyScalar(0.5); m.scale.set(0.07, 0.07, prev.distanceTo(nx) + 0.07); m.lookAt(nx); prev = nx }) }
    /* state of what the hero wears */
    const ST = { item: null, t: 0, hits: {}, worn: [], wpn: [], relic: null };
    const clearWorn = () => { ST.worn.forEach(g => g.parent && g.parent.remove(g)); ST.worn = []; ST.wpn.forEach(g => g.parent && g.parent.remove(g)); ST.wpn = []; if (ST.relic) { S.remove(ST.relic); ST.relic = null } };
    const wingMats = []; [hero.wingL, hero.wingR].forEach(w => w.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); wingMats.push([o.material, o.material.color.getHex()]) } }));
    function wingColor(kind) { wingMats.forEach(([m, c]) => { if (kind === 'gold') m.color.setHex(c === 0xffffff ? 0xffd060 : 0xffb21c); else if (kind === 'night') m.color.setHex(c === 0xffffff ? 0x3a2a6a : 0x5a3aa8); else m.color.setHex(c) }) }
    function wear(it) {
      clearWorn(); hero.wings.visible = false; wingColor(); ST.t = 0; ST.hits = {}; ST.item = it;
      if (it.cat === 'weapon') { const add = (arm, g) => { g.position.set(0, -0.5, 0.1); g.rotation.x = 1.4; arm.add(g); ST.wpn.push(g) }; if (it.m === 'twins') { add(hero.armR, M.W.twinR()); add(hero.armL, M.W.twinL()) } else if (it.m === 'fists') { for (const a of [hero.armR, hero.armL]) { const f = M.W.fist(); f.position.set(0, -0.48, 0); a.add(f); ST.wpn.push(f) } } else add(hero.armR, (M.W[it.m] || M.W.starsword)()) }
      if (it.set) { if (it.set === 'cloak') { const c = new THREE.Group(); VX.B(c, 0.92, 1.2, 0.08, 0x2a2238, 0, -0.38, -0.36, new THREE.MeshLambertMaterial({ color: 0x2a2238, transparent: true, opacity: 0.75 })); VX.B(c, 1.0, 0.12, 0.6, 0x3a3050, 0, 0.22, 0); hero.body.add(c); ST.worn.push(c) } else if (it.set === 'dioscuri') { const h = new THREE.Group(); VX.B(h, 1.04, 0.36, 1.0, 0xffe08a, 0, 0.36, -0.02); VX.B(h, 0.56, 0.26, 0.56, 0xffe08a, 0, 0.6, 0.02); VX.B(h, 0.16, 0.16, 0.16, 0xffffff, -0.3, 0.74, 0, VX.bas(0xffffff)); VX.B(h, 0.16, 0.16, 0.16, 0xffffff, 0.3, 0.74, 0, VX.bas(0xffffff)); hero.head.add(h); ST.worn.push(h) } else { const a = VX.armor(hero, it.set); ST.worn.push(...a.pieces); if (it.set === 'turtle') { const sh = new THREE.Group(); VX.B(sh, 0.96, 0.9, 0.36, 0x3f8a34, 0, -0.1, -0.5); VX.B(sh, 0.7, 0.66, 0.1, 0x8ad05a, 0, -0.1, -0.7); hero.body.add(sh); ST.worn.push(sh) } if (it.set === 'shadow') { const bk = new THREE.Group(); VX.B(bk, 0.3, 0.12, 0.2, 0xf2f2f2, 0, 0.42, 0.56); VX.B(bk, 0.16, 0.12, 0.16, 0xf2f2f2, 0, 0.34, 0.66); hero.head.add(bk); ST.worn.push(bk) } }
        ST.worn.forEach((g, k) => { g.userData.home = g.position.clone(); g.userData.d = k * 0.08; g.scale.setScalar(0.001) }) }
      if (it.wing) { hero.wings.visible = true; wingColor(it.wing) }
      if (it.boot) { for (const l of [hero.legL, hero.legR]) { const b = new THREE.Group(); if (it.boot === 'hermes') { VX.B(b, 0.36, 0.2, 0.42, 0xfff2c8, 0, -0.4, 0.02); for (const k of [-1, 1]) VX.B(b, 0.04, 0.18, 0.3, 0xffffff, k * 0.22, -0.3, -0.1, VX.bas(0xffffff)) } else { VX.B(b, 0.36, 0.3, 0.42, 0x14101c, 0, -0.36, 0.02); VX.B(b, 0.38, 0.05, 0.44, 0x22e6ff, 0, -0.5, 0.02, VX.bas(0x22e6ff)) } l.add(b); ST.worn.push(b) } }
      if (it.relic) { ST.relic = (M.R[it.relic] || M.R.heart)(); ST.relic.position.set(0, 2.2, 0); S.add(ST.relic) }
      const showHero = !it.relic || it.cat === 'move'; hero.G.visible = showHero && it.relic !== 'hook' ? true : it.cat !== 'relic'; dummy.visible = it.cat === 'weapon';
      if (it.relic === 'hook') { hero.G.visible = true; const h = M.R.hook(); h.scale.setScalar(0.5); h.position.set(0, -0.6, 0.2); hero.armR.add(h); ST.wpn.push(h); S.remove(ST.relic); ST.relic = null }
      [ring, hole, ...cres, ...orbs, ...slashes, ...bolt].forEach(m => m.material.opacity = 0);
    }
    const once = (k, u, at) => { if (u >= at && !ST.hits[k]) { ST.hits[k] = 1; return true } return false };
    function frame(dt) {
      const it = ST.item; if (!it) return; ST.t += dt; const col = parseInt((it.c || '#ffffff').slice(1), 16), tt = performance.now() / 1000;
      let hx = 0, hy = 0.62, yaw = 0.35, ax = -0.4, al = -0.2, flip = 0;
      [ring, hole, ...cres, ...orbs, ...slashes, ...bolt].forEach(m => { m.material.opacity *= 0.86 });
      if (it.cat === 'weapon') {
        const D = 3.2, u = ST.t % D; if (u < dt * 1.5) ST.hits = {}; hx = -1.3; yaw = PI / 2; dummy.position.set(1.7, 0.62, 0); dummy.rotation.set(0, -PI / 2, 0);
        const sw = (a, b) => { const p = k01(u, a, b); return p > 0 && p < 1 ? p : -1 }; const tgt = V(1.7, 1.5, 0), hand = () => V(hx + 0.6, 1.5, 0);
        const hits = it.fx === 'arrows' ? [0.2, 0.45, 0.7, 0.95, 1.2, 1.45] : it.fx === 'twins' || it.fx === 'cross' && it.m === 'twins' ? [0.2, 0.45, 0.7, 1.0] : [0.25, 0.75, 1.35];
        hits.forEach((h0, k) => { const p = sw(h0 - 0.15, h0 + 0.05); if (p >= 0) { if (it.m === 'twins' || it.m === 'fists') { if (k % 2) al = -2.4 + 3 * eo(p); else ax = -2.4 + 3 * eo(p) } else if (it.m === 'bow') { ax = -1.55; al = -1.4 } else if (it.m === 'spear') { ax = -1.5; hx = -1.3 + Math.sin(p * PI) * 0.5 } else ax = -2.8 + 3 * eo(p) } });
        if (it.m === 'bow') { ax = -1.55; al = -1.45 }
        const last = hits.length - 1, special = hits[last];
        hits.forEach((h0, k) => { if (once('h' + k, u, h0)) { const sp = k === last;
          if (it.fx === 'arrows') { orbs[k % 6].userData.fly = { a: hand(), b: tgt.clone().add(V(0, (Math.random() - 0.5) * 0.4, 0)), t: 0, d: 0.2, c: k === 3 ? 0xffffff : col }; if (k === 3) burst(tgt, 14, [0xffffff, 0xcfe0ff], 4, 3) }
          else if (it.fx === 'fireball') { orbs[k % 6].userData.fly = { a: hand(), b: tgt.clone(), t: 0, d: 0.35, c: 0xff8a2a, big: sp } }
          else if (it.fx === 'orbs') { for (let j = 0; j < 2; j++) orbs[(k * 2 + j) % 6].userData.fly = { a: hand(), b: tgt.clone(), t: -j * 0.08, d: 0.5, c: 0xb070ff, curve: j ? 1 : -1 } }
          else if (it.fx === 'wave' || it.fx === 'wave3') { (it.fx === 'wave3' ? [0, 1, 2] : [0]).forEach(j => { const m = cres[j]; m.userData.fly = { a: V(hx + 0.6, 1.3, (j - 1) * (it.fx === 'wave3' ? 0.5 : 0)), b: V(2.6, 1.3, (j - 1) * (it.fx === 'wave3' ? 0.9 : 0)), t: 0, d: 0.45, c: col } }) }
          else if (it.fx === 'throw' && sp) { const sg = ST.wpn[0]; if (sg) sg.visible = false; orbs[0].userData.fly = { a: hand(), b: tgt.clone(), t: 0, d: 0.3, c: 0xffd060, back: 1, spear: 1 } }
          else if (it.fx === 'cross') { slashes.forEach((s, j) => { if (j > 1) return; s.material.color.setHex(col); s.material.opacity = 1; s.position.copy(tgt); s.scale.set(0.08, 1.6, 0.08); s.rotation.set(0, 0, (j ? 1 : -1) * 0.78) }) }
          if (sp && (it.fx === 'vortex')) { ring.material.color.setHex(col); ring.material.opacity = 1; ring.position.set(hx, 1.2, 0); ring.userData.grow = 0 }
          if (sp && it.fx === 'slam') { ring.material.color.setHex(col); ring.material.opacity = 1; ring.position.set(0.4, 0.66, 0); ring.userData.grow = 0; burst(V(0.4, 0.8, 0), 30, [0x9fb8ff, 0xffffff, 0xe8dcc0], 7, 4, 0.14) }
          if (sp && it.fx === 'chain') { ST.chain = 0.4 }
          if (sp && it.fx === 'issen') { ST.issen = 0.5 }
          burst(tgt, sp ? 18 : 8, [col, 0xffffff], sp ? 6 : 4, 3) } });
        if (it.fx === 'slam') { const j = sw(special - 0.4, special); if (j >= 0) { hy = 0.62 + Math.sin(j * PI) * 1.4; hx = -1.3 + 1.2 * j; ax = -3 + 3 * j } if (u > special && u < special + 0.8) hx = -0.1 - 1.2 * k01(u, special + 0.3, special + 0.8) }
        if (ST.issen > 0) { ST.issen -= dt; const p = 1 - ST.issen / 0.5; hero.G.visible = p > 0.5; hx = p < 0.5 ? -1.3 : 3.0; yaw = p < 0.5 ? PI / 2 : -PI / 2; if (p > 0.55) slashes.forEach((s, j) => { s.material.color.setHex(0xff3a5a); s.material.opacity = 1; s.position.set(1.7, 1.2 + j * 0.35, 0); s.scale.set(2.2, 0.06, 0.06); s.rotation.set(0, 0, (j - 1) * 0.3) }) } else hero.G.visible = true;
        if (u > special + 0.6 && u < special + 1.2 && it.fx === 'issen') { hx = 3 - 4.3 * io(k01(u, special + 0.6, special + 1.2)); yaw = k01(u, special + 0.6, special + 1.2) > 0.5 ? PI / 2 : -PI / 2 }
        if (ST.chain > 0) { ST.chain -= dt; boltSet(V(-1.2, 1.5, 0), V(1.7, 1.6, 0), 0.6, 1); hx = -1.3 + 2.4 * Math.sin((1 - ST.chain / 0.4) * PI) }
        orbs.forEach(o => { const f = o.userData.fly; if (!f) return; f.t += dt; const p = Math.max(0, f.t / f.d); if (p >= 1) { if (f.back && !f.ret) { f.ret = 1; f.t = 0; [f.a, f.b] = [f.b, f.a]; burst(tgt, 14, [0xffd060, 0xffffff], 5, 3); return } if (f.spear && ST.wpn[0]) ST.wpn[0].visible = true; if (f.big) { ring.material.color.setHex(0xff8a2a); ring.material.opacity = 1; ring.position.set(1.7, 1.0, 0); ring.userData.grow = 0; burst(tgt, 34, [0xff8a2a, 0xffe14d, 0xffffff], 8, 5, 0.15) } if (it.fx === 'orbs' && ST.hits.h2 && !f.hole) { hole.material.opacity = 0.95; hole.position.copy(tgt); hole.userData.t = 0.6 } o.userData.fly = null; o.material.opacity = 0; return }
          o.material.color.setHex(f.c); o.material.opacity = 1; o.scale.setScalar(f.spear ? 0.12 : f.big ? 0.5 : 0.26); if (f.spear) o.scale.set(0.1, 0.1, 1.4); o.position.copy(f.a).lerp(f.b, p); if (f.curve) o.position.z += Math.sin(p * PI) * f.curve * 0.9; o.lookAt(f.b); if (it.fx === 'arrows') o.scale.set(0.06, 0.06, 0.6) });
        cres.forEach(m => { const f = m.userData.fly; if (!f) return; f.t += dt; const p = f.t / f.d; if (p >= 1) { m.userData.fly = null; return } m.material.color.setHex(f.c); m.material.opacity = 0.9 * (1 - p * 0.4); m.position.copy(f.a).lerp(f.b, p) });
        if (hole.userData.t > 0) { hole.userData.t -= dt; hole.scale.setScalar(0.6 + Math.sin(tt * 20) * 0.05); ring.material.color.setHex(0xb070ff); ring.material.opacity = 0.8; ring.position.copy(tgt); ring.rotation.x = -PI / 2 + 0.5; ring.scale.setScalar(0.8 + (1 - hole.userData.t / 0.6) * 0.6) } else hole.material.opacity = 0;
        if (ring.userData.grow != null) { ring.userData.grow += dt; ring.scale.setScalar(0.4 + ring.userData.grow * 6); if (ring.userData.grow > 0.5) ring.userData.grow = null }
        const hk = Math.max(0, ...hits.map(h0 => 1 - Math.abs(u - h0 - 0.08) * 8)); dummy.rotation.z = -hk * 0.18; dummy.position.x = 1.7 + hk * 0.15;
      } else if (it.cat === 'armor') {
        yaw = 0.35 + Math.sin(tt * 0.6) * 0.5; ax = ST.t > 1.4 && ST.t < 2.4 ? -2.6 : -0.3; al = ST.t > 1.4 && ST.t < 2.4 ? -0.2 : -0.2; hy = 0.62 + (ST.t > 1.2 && ST.t < 1.6 ? Math.sin(k01(ST.t, 1.2, 1.6) * PI) * 0.5 : 0);
        ST.worn.forEach(g => { const k = k01(ST.t - g.userData.d, 0.1, 0.45); g.scale.setScalar(Math.max(0.001, k < 1 ? eo(k) * (1 + Math.sin(k * PI) * 0.3) : 1)); if (g.userData.home) g.position.set(g.userData.home.x, g.userData.home.y + (1 - eo(k)) * 2, g.userData.home.z); if (k >= 1 && !g.userData.done) { g.userData.done = 1; const p = new THREE.Vector3(); g.getWorldPosition(p); burst(p, 5, [col, 0xffffff, 0xffe14d], 2, 2, 0.08) } });
        if (once('shine', ST.t, 1.2)) burst(V(0, 2, 0), 24, [col, 0xffffff, 0xffe14d], 5, 4, 0.12);
      } else if (it.wing) {
        hy = 1.6 + Math.sin(tt * 2) * 0.35; yaw = 0.6; hero.wingL.rotation.y = Math.sin(tt * 14) * 0.6; hero.wingR.rotation.y = -Math.sin(tt * 14) * 0.6; ax = -1.2; al = -1.2; if (Math.random() < 0.2) burst(V(-0.3, hy + 1, -0.4), 1, [col, 0xffffff], 1, 0.4, 0.09);
      } else if (it.boot || it.relic === 'hook') {
        const D = 1.8, u = ST.t % D; const j1 = k01(u, 0.1, 0.6), j2 = k01(u, 0.55, 1.3); hy = 0.62 + Math.sin(j1 * PI) * 1.0 + (u > 0.55 ? Math.sin(j2 * PI) * 1.4 : 0) * (u < 1.3 ? 1 : 0); if (u > 0.55 && u < 1.3) flip = io(j2) * PI * 2 * (it.boot === 'hermes' ? 2 : 1); yaw = 0.9; if (once('j' + Math.floor(ST.t / D), ST.t, Math.floor(ST.t / D) * D + 0.56)) burst(V(0, hy + 0.2, 0), 12, [col, 0xffffff], 3, 2, 0.1);
        if (u < dt * 1.5) ST.hits = {};
      } else if (it.relic) {
        if (ST.relic) { ST.relic.position.y = 2.0 + Math.sin(tt * 2) * 0.2; ST.relic.rotation.y = tt * 0.9; ST.relic.scale.setScalar(1.3); if (Math.random() < 0.25) burst(V((Math.random() - 0.5) * 1.2, 1.6, (Math.random() - 0.5) * 1.2), 1, [col, 0xffffff], 0.5, 2, 0.08) }
      }
      hero.G.position.set(hx, hy, 0); hero.G.rotation.set(0, yaw, 0); hero.body.rotation.x = flip; hero.armR.rotation.x = ax; hero.armL.rotation.x = al; hero.legL.rotation.x = hy > 0.7 ? -0.6 : 0; hero.legR.rotation.x = hy > 0.7 ? 0.4 : 0;
      ped.visible = it.cat === 'relic'; isle.visible = true;
      partTick(dt);
      const zoom = it.cat === 'weapon' ? 1 : 0, air = !!(it.wing || it.boot || it.relic === 'hook'); C.position.set(zoom ? 0.2 : 0.4, zoom ? 2.6 : air ? 3.4 : 2.4, zoom ? 8.5 : air ? 8.6 : 6.6); C.lookAt(zoom ? 0.2 : 0, air ? 2.4 : 1.5, 0);
      R.render(S, C);
    }
    function size() { const w = stageEl.clientWidth, h = stageEl.clientHeight; if (!w || !h) return; R.setSize(w, h, false); R.domElement.style.width = '100%'; R.domElement.style.height = '100%'; C.aspect = w / h; C.updateProjectionMatrix() }
    new ResizeObserver(size).observe(stageEl); size();
    let on = false, last = performance.now(); function loop(now) { const dt = Math.min(0.1, (now - last) / 1000); last = now; if (on) frame(dt); requestAnimationFrame(loop) } requestAnimationFrame(loop);
    return { wear, setOn: v => { on = v; if (v) size() }, frame };
  }
  window.ARSENAL = { init };
})();
