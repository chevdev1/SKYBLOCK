/* World map built from the real game world: every visible block of each world is exported from the game
   (landing/data/worldmap.bin, Int16 x,y,z,type) and drawn here as instanced voxels, with the game's
   teleport flags, bosses and quest NPCs as gem markers on light beams, drifting clouds and stars. */
(function () {
  const V = (x, y, z) => new THREE.Vector3(x, y, z), PI = Math.PI;
  let DATA = null, BLK = null;
  async function load() { if (DATA) return; const [j, b] = await Promise.all([fetch('landing/data/worldmap.json').then(r => r.json()), fetch('landing/data/worldmap.bin').then(r => r.arrayBuffer())]); DATA = j; BLK = new Int16Array(b) }
  function hash(n) { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }
  function init(host, labels, opts) {
    const R = new THREE.WebGLRenderer({ antialias: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); host.appendChild(R.domElement);
    const S = new THREE.Scene(); S.background = new THREE.Color('#141f4e'); S.fog = new THREE.Fog('#141f4e', 300, 620);
    S.add(new THREE.HemisphereLight(0xdfe6ff, 0x3a3a6a, 0.95)); const sun = new THREE.DirectionalLight(0xfff2dc, 0.55); sun.position.set(60, 120, 80); S.add(sun);
    const C = new THREE.PerspectiveCamera(36, 1.6, 1, 1500);
    const sg = new THREE.BufferGeometry(), sp = []; for (let k = 0; k < 1400; k++) { const a = Math.random() * PI * 2, b = Math.random() * PI - PI / 2, r = 600 + Math.random() * 200; sp.push(Math.cos(a) * Math.cos(b) * r, Math.sin(b) * r * 0.7 + 60, Math.sin(a) * Math.cos(b) * r) } sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); S.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false })));
    const world = new THREE.Group(); S.add(world); const clouds = new THREE.Group(); S.add(clouds);
    const box = new THREE.BoxGeometry(1, 1, 1), _m = new THREE.Matrix4(), _c = new THREE.Color();
    let markers = [], pickables = [];
    const W = { yaw: -0.7, pitch: 0.62, dist: 260, base: 260, cy: 60, auto: true, drag: null, sel: null, hover: null, z: 0 };
    function marker(p, col, kind, data, big) {
      const g = new THREE.Group(); g.position.set(p[0], p[1], p[2]); world.add(g); const H = big ? 9 : 7;
      const beam = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.38, depthWrite: false })); beam.scale.set(0.5, H, 0.5); beam.position.y = H / 2; g.add(beam);
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(big ? 2.6 : 2.1), new THREE.MeshBasicMaterial({ color: col })); gem.scale.y = 1.3; gem.position.y = H + 2; g.add(gem);
      const halo = new THREE.Mesh(new THREE.OctahedronGeometry(big ? 3.6 : 3), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.y = 1.3; halo.position.y = H + 2; g.add(halo);
      const hit = new THREE.Mesh(new THREE.SphereGeometry(4.5, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = H + 1; g.add(hit); hit.userData.m = g;
      const el = document.createElement('span'); el.className = 'mv-lb ' + kind; el.textContent = data.title; labels.appendChild(el);
      g.userData = { gem, halo, H, kind, data, el, ph: Math.random() * 6 }; markers.push(g); pickables.push(hit); return g;
    }
    function build(zi, lang, M) {
      W.z = zi; while (world.children.length) { const o = world.children[0]; world.remove(o); if (o.isInstancedMesh) o.dispose() } markers = []; pickables = []; labels.innerHTML = '';
      if (!DATA) return; const Z = DATA.zones[zi], n = Z.n, base = Z.off / 2, lit = new Set(DATA.lit);
      let nl = 0; for (let i = 0; i < n; i++) if (lit.has(BLK[base + i * 4 + 3])) nl++;
      const mA = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial({ color: 0xffffff }), n - nl), mB = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ color: 0xffffff }), Math.max(1, nl));
      const y0 = Z.b[2], y1 = Z.b[3]; let ia = 0, ib = 0;
      for (let i = 0; i < n; i++) { const o = base + i * 4, x = BLK[o], y = BLK[o + 1], z = BLK[o + 2], t = BLK[o + 3]; _m.makeTranslation(x, y, z); _c.setHex(DATA.pal[t] != null ? DATA.pal[t] : 0x888888);
        if (lit.has(t)) { mB.setMatrixAt(ib, _m); mB.setColorAt(ib++, _c) } else { const f = 0.72 + 0.34 * Math.max(0, Math.min(1, (y - y0) / Math.max(1, y1 - y0))) + ((x + z) & 1 ? 0.025 : 0); _c.multiplyScalar(f); mA.setMatrixAt(ia, _m); mA.setColorAt(ia++, _c) } }
      mA.instanceMatrix.needsUpdate = true; if (mA.instanceColor) mA.instanceColor.needsUpdate = true; mB.count = ib; mB.instanceMatrix.needsUpdate = true; if (mB.instanceColor) mB.instanceColor.needsUpdate = true; world.add(mA, mB);
      /* markers: gold flags, red bosses, purple quest NPCs */
      const reg = (M.regions || []), regD = ru => { const r = reg.find(x => x.ru === ru); return r ? r.d[lang] : '' };
      Z.flags.forEach((f, i) => marker(f.p, 0xffc23c, 'region', { title: lang === 'en' ? f.en : f.ru, sub: lang === 'en' ? 'Flag · teleport' : 'Флажок · телепорт', d: regD(f.region) || regD(f.ru), c: '#ffc23c' }, i === 0));
      Z.bosses.forEach(b => { const bs = b.ids.map(id => (M.bosses || []).find(x => x.id === id)).filter(Boolean); if (!bs.length) return; marker(b.p, 0xff5a6a, 'boss', { title: bs.map(x => x[lang]).join(' · '), sub: (lang === 'en' ? 'Boss · ' : 'Босс · ') + bs[0].ar[lang], d: bs[0].d[lang], img: bs[0].img ? 'landing/img/bosses/' + bs[0].img + '.jpg' : '' }, true) });
      Z.npcs.forEach(q => marker(q.p, 0xc48aff, 'place', { title: q.ru, sub: lang === 'en' ? 'Quest · NPC' : 'Задание · житель', d: lang === 'en' ? 'A resident of this world: talks, gives quests and rewards.' : 'Житель этого мира: расскажет историю места, даст задание и награду.' }));
      const you = document.createElement('span'); you.className = 'mv-you'; you.textContent = lang === 'en' ? 'You' : 'Ты'; labels.appendChild(you); W.you = Z.flags[0] ? { el: you, p: V(Z.flags[0].p[0] + 3, Z.flags[0].p[1] + 4, Z.flags[0].p[2]) } : null;
      /* frame the world */
      const w = Z.b[1] - Z.b[0], d = Z.b[5] - Z.b[4], h = y1 - y0; W.cy = y0 + h * 0.5; W.base = W.dist = Math.max(Math.max(w, d) * 1.1, h * 1.75) + 30; W.ms = Math.max(1, Math.max(w, d, h) / 120); markers.forEach(m => m.scale.setScalar(W.ms)); W.sel = null;
      /* clouds around this world */
      while (clouds.children.length) clouds.remove(clouds.children[0]);
      const cm = [new THREE.MeshLambertMaterial({ color: 0xa4aad0 }), new THREE.MeshLambertMaterial({ color: 0x8a90ba })];
      for (let k = 0; k < 18; k++) { const g = new THREE.Group(), parts = 2 + Math.floor(hash(k + zi * 40) * 3); for (let j = 0; j < parts; j++) { const m = new THREE.Mesh(box, cm[j % 2]); m.scale.set(8 + hash(k * 7 + j) * 12, 2, 5 + hash(k * 3 + j) * 6); m.position.set(j * 7 - parts * 3, (j % 2) * 1.2, (hash(k + j * 9) - 0.5) * 6); g.add(m) } const a = hash(k * 11 + zi) * PI * 2, r = Math.max(w, d) * 0.6 + 25 + hash(k * 5) * Math.max(w, d) * 0.5; g.position.set(Math.cos(a) * r, y0 - 18 + hash(k * 13) * (h * 0.7), Math.sin(a) * r); g.userData.v = 1.5 + hash(k) * 2.5; clouds.add(g) }
    }
    /* interaction */
    const ray = new THREE.Raycaster(), mp = new THREE.Vector2(-9, -9), el = R.domElement; el.style.touchAction = 'pan-y';
    const setMp = e => { const r = el.getBoundingClientRect(); mp.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1) };
    el.addEventListener('pointerdown', e => { setMp(e); W.drag = { x: e.clientX, y: e.clientY, yaw: W.yaw, pitch: W.pitch, moved: false }; W.auto = false });
    addEventListener('pointermove', e => { setMp(e); if (!W.drag) return; const dx = e.clientX - W.drag.x, dy = e.clientY - W.drag.y; if (Math.abs(dx) + Math.abs(dy) > 5) W.drag.moved = true; W.yaw = W.drag.yaw - dx * 0.006; W.pitch = Math.min(1.35, Math.max(0.15, W.drag.pitch + dy * 0.004)) });
    addEventListener('pointerup', () => { if (W.drag && !W.drag.moved) { ray.setFromCamera(mp, C); const h = ray.intersectObjects(pickables)[0]; if (h) { W.sel = h.object.userData.m; opts.onPick && opts.onPick(W.sel.userData.data, W.sel.userData.kind) } } W.drag = null });
    el.addEventListener('wheel', e => { if (!e.ctrlKey && !e.shiftKey) return; e.preventDefault(); W.dist = Math.min(W.base * 1.6, Math.max(W.base * 0.35, W.dist * (e.deltaY > 0 ? 1.1 : 0.9))) }, { passive: false });
    const _v = new THREE.Vector3();
    function frame(dt) {
      const t = performance.now() / 1000; if (W.auto) W.yaw += dt * 0.05;
      C.position.set(Math.cos(W.yaw) * Math.cos(W.pitch) * W.dist, W.cy + Math.sin(W.pitch) * W.dist, Math.sin(W.yaw) * Math.cos(W.pitch) * W.dist); C.lookAt(0, W.cy, 0);
      clouds.children.forEach(g => { g.position.x += g.userData.v * dt; if (g.position.x > W.base * 0.9) g.position.x = -W.base * 0.9 });
      ray.setFromCamera(mp, C); const hv = W.drag ? null : ray.intersectObjects(pickables)[0]; W.hover = hv ? hv.object.userData.m : null; el.style.cursor = W.hover ? 'pointer' : (W.drag ? 'grabbing' : 'grab');
      const w = host.clientWidth, h = host.clientHeight, near = W.dist < W.base * 0.75;
      markers.forEach(m => { const u = m.userData, on = m === W.hover || m === W.sel; u.gem.position.y = u.H + 2 + Math.sin(t * 2 + u.ph) * 0.7; u.gem.rotation.y = t * 1.3 + u.ph; u.halo.position.y = u.gem.position.y; u.halo.scale.set(on ? 1.5 : 1, (on ? 1.5 : 1) * 1.3, on ? 1.5 : 1); u.halo.material.opacity = on ? 0.45 : 0.2;
        m.getWorldPosition(_v); _v.y += (u.H + 6) * (W.ms || 1); _v.project(C); const vis = _v.z < 1 && Math.abs(_v.x) < 1.05 && Math.abs(_v.y) < 1.05; u.el.style.display = vis && (on || u.kind !== 'place' || near) ? '' : 'none'; u.el.style.transform = 'translate(-50%,-100%) translate(' + ((_v.x + 1) / 2 * w).toFixed(0) + 'px,' + ((1 - _v.y) / 2 * h).toFixed(0) + 'px)'; u.el.classList.toggle('on', on) });
      if (W.you) { _v.copy(W.you.p); _v.y += 6 * (W.ms || 1); _v.project(C); W.you.el.style.transform = 'translate(-50%,-100%) translate(' + ((_v.x + 1) / 2 * w).toFixed(0) + 'px,' + ((1 - _v.y) / 2 * h).toFixed(0) + 'px)'; W.you.el.style.display = _v.z < 1 ? '' : 'none' }
      R.render(S, C);
    }
    function size() { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; R.setSize(w, h, false); R.domElement.style.width = '100%'; R.domElement.style.height = '100%'; C.aspect = w / h; C.updateProjectionMatrix() }
    new ResizeObserver(size).observe(host); size();
    let on = false, last = performance.now(); function loop(now) { const dt = Math.min(0.1, (now - last) / 1000); last = now; if (on && !document.hidden && DATA) frame(dt); requestAnimationFrame(loop) } requestAnimationFrame(loop);
    new IntersectionObserver(es => es.forEach(e => on = e.isIntersecting), { rootMargin: '200px' }).observe(host);
    return { load, build, zoom: k => { W.dist = Math.min(W.base * 1.6, Math.max(W.base * 0.35, W.dist * k)) }, frame, state: W, count: zi => DATA ? DATA.zones[zi] : null };
  }
  window.MAPVIEW = { init };
})();
