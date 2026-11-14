/* Voxel models for the landing, built the same way as in the game: everything is boxes.
   Heroes follow the game's skins, Kumo follow the game's forms and ultra-rare palettes. Exposes window.VX. */
(function () {
  const BOX = new THREE.BoxGeometry(1, 1, 1), MC = {};
  function enhance(m, o) {
    o = o || {}; const edge = o.edge == null ? 0.24 : o.edge, rim = new THREE.Color(o.rim == null ? 0xfff2e0 : o.rim), rimK = o.rimK == null ? 0.16 : o.rimK;
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rim }; sh.uniforms.uEdge = { value: edge }; sh.uniforms.uRimK = { value: rimK };
      sh.vertexShader = 'varying vec2 vEU;varying float vRim;varying float vTop;\n' + sh.vertexShader.replace('#include <fog_vertex>', '#include <fog_vertex>\nvEU=uv;vec3 nV=normalize(normalMatrix*objectNormal);vRim=1.0-abs(dot(nV,normalize(-mvPosition.xyz)));vTop=step(0.5,objectNormal.y);');
      sh.fragmentShader = 'uniform vec3 uRim;uniform float uEdge;uniform float uRimK;varying vec2 vEU;varying float vRim;varying float vTop;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', 'float eg=min(min(vEU.x,1.0-vEU.x),min(vEU.y,1.0-vEU.y));gl_FragColor.rgb*=mix(1.0-uEdge,1.0,smoothstep(0.0,0.14,eg));gl_FragColor.rgb*=1.0+vTop*0.07;gl_FragColor.rgb+=uRim*pow(vRim,2.6)*uRimK;\n#include <dithering_fragment>');
    };
    m.customProgramCacheKey = () => 'vxe' + edge + '_' + rimK; return m;
  }
  const lam = c => MC[c] || (MC[c] = enhance(new THREE.MeshLambertMaterial({ color: c })));
  const bas = c => new THREE.MeshBasicMaterial({ color: c });
  function B(p, w, h, d, c, x, y, z, mat) { const m = new THREE.Mesh(BOX, mat || lam(c)); m.scale.set(w, h, d); m.position.set(x, y, z); if (!mat || !mat.isMeshBasicMaterial) { m.castShadow = true; m.receiveShadow = true } p.add(m); return m }

  /* ---------- heroes ---------- */
  const SKINS = {
    ryzhik: { skin: 0xf2c29b, hair: 0xff8c2a, shirt: 0x3a6fd8, belt: 0x6b4226, buckle: 0xffc23c, legs: 0xeeeeee, boots: 0x7a3e1d, cape: 0xff5d8a },
    rina: { skin: 0xf6cfae, hair: 0xd8323a, shirt: 0x8a63ff, belt: 0xffc23c, buckle: 0xffffff, legs: 0xffffff, boots: 0x6b2440, cape: 0x5fd3ff, girl: true }
  };
  function hero(id) {
    const s = SKINS[id] || SKINS.ryzhik, G = new THREE.Group(), body = new THREE.Group(); body.position.y = 0.95; G.add(body);
    const head = new THREE.Group(); head.position.y = 0.6; body.add(head);
    B(head, 0.95, 0.9, 0.9, s.skin, 0, 0, 0);
    B(head, 1.01, 0.26, 0.96, s.hair, 0, 0.42, -0.02); B(head, 1.0, 0.62, 0.22, s.hair, 0, 0.08, -0.38); B(head, 1.0, 0.14, 0.12, s.hair, 0, 0.3, 0.44);
    if (s.girl) { for (const k of [-1, 1]) { B(head, 0.26, 0.5, 0.26, s.hair, k * 0.6, 0.05, -0.15); B(head, 0.14, 0.14, 0.14, 0xffffff, k * 0.6, 0.32, -0.15) } B(head, 0.42, 0.16, 0.1, 0xff5d8a, 0, 0.58, 0.1) }
    else B(head, 0.22, 0.2, 0.22, s.hair, 0.12, 0.62, 0.05);
    for (const k of [-1, 1]) { B(head, 0.15, 0.2, 0.04, 0x1d2433, k * 0.22, 0, 0.46, bas(0x1d2433)); B(head, 0.06, 0.07, 0.02, 0xffffff, k * 0.22 + 0.04, 0.05, 0.48, bas(0xffffff)); B(head, 0.14, 0.06, 0.03, 0xffa0b8, k * 0.34, -0.17, 0.46, bas(0xffa0b8)) }
    B(head, 0.12, 0.04, 0.03, 0x8a4a3a, 0, -0.2, 0.46);
    for (const k of [-1, 1]) B(head, 0.17, 0.05, 0.03, 0x5a2a1a, k * 0.22, 0.16, 0.46, bas(s.girl ? 0x7a1a20 : 0x7a3a10));
    [[-0.32, 0.36, 0.42, 0.2], [0.05, 0.38, 0.45, 0.24], [0.36, 0.34, 0.42, 0.18]].forEach(([x, y, z, w]) => B(head, w, 0.2, 0.12, s.hair, x, y - 0.05, z));
    B(body, 0.82, 0.64, 0.58, s.shirt, 0, -0.1, 0); B(body, 0.5, 0.1, 0.6, 0xffffff, 0, 0.2, 0.01); B(body, 0.16, 0.16, 0.1, 0x8a5a2a, 0.3, -0.42, 0.3); B(body, 0.84, 0.1, 0.6, s.belt, 0, -0.38, 0); B(body, 0.14, 0.12, 0.04, s.buckle, 0, -0.38, 0.31);
    if (s.girl) B(body, 0.9, 0.24, 0.66, 0x9e7cff, 0, -0.5, 0);
    const cape = B(body, 0.72, 0.85, 0.06, s.cape, 0, -0.2, -0.33); B(cape, 1.02, 0.1, 1.4, s.buckle, 0, -0.45, 0); B(cape, 0.4, 0.3, 1.2, s.buckle, 0, 0.32, 0);
    const limb = (x, y) => { const g = new THREE.Group(); g.position.set(x, y, 0); body.add(g); return g };
    const armL = limb(-0.56, -0.02), armR = limb(0.56, -0.02);
    for (const a of [armL, armR]) { B(a, 0.24, 0.5, 0.26, s.shirt, 0, -0.18, 0); B(a, 0.22, 0.16, 0.24, s.skin, 0, -0.48, 0) }
    const legL = limb(-0.2, -0.45), legR = limb(0.2, -0.45);
    for (const l of [legL, legR]) { B(l, 0.3, 0.38, 0.32, s.legs, 0, -0.18, 0); B(l, 0.33, 0.16, 0.38, s.boots, 0, -0.4, 0.02); B(l, 0.35, 0.05, 0.4, 0x2a1a12, 0, -0.49, 0.02); B(l, 0.34, 0.05, 0.39, s.buckle, 0, -0.32, 0.02) }
    const wings = new THREE.Group(); wings.position.set(0, 0.05, -0.38); body.add(wings);
    const wingL = new THREE.Group(), wingR = new THREE.Group(); wings.add(wingL, wingR);
    for (const [w, k] of [[wingL, -1], [wingR, 1]]) { B(w, 0.7, 0.36, 0.05, 0xffffff, k * 0.42, 0.12, 0); B(w, 0.5, 0.2, 0.05, 0xfff2c8, k * 0.55, -0.1, 0); B(w, 0.3, 0.16, 0.05, 0xffffff, k * 0.75, 0.3, 0); for (let f = 0; f < 4; f++)B(w, 0.14, 0.34 - f * 0.05, 0.04, f % 2 ? 0xfff6dc : 0xffffff, k * (0.3 + f * 0.17), -0.18 - f * 0.02, 0.01) }
    wings.visible = false;
    return { G, body, head, armL, armR, legL, legR, cape, wings, wingL, wingR };
  }
  function katana() { const g = new THREE.Group(); B(g, 0.08, 0.08, 0.36, 0x1d1d2b, 0, 0, 0.02); for (let k = 0; k < 3; k++)B(g, 0.09, 0.09, 0.04, 0x5fb8ff, 0, 0, -0.1 + k * 0.1); B(g, 0.26, 0.05, 0.26, 0xffc23c, 0, 0, 0.21); B(g, 0.05, 0.11, 1.55, 0xdff6ff, 0, 0.02, 1.02, bas(0xcff4ff)); const glow = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x5fd8ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.set(0.12, 0.22, 1.62); glow.position.set(0, 0.02, 1.02); g.add(glow); g.userData.glow = glow; return g }
  function sword(len) { const g = new THREE.Group(); B(g, 0.08, 0.08, 0.3, 0x6b4226, 0, 0, 0.0); B(g, 0.34, 0.07, 0.07, 0xffc23c, 0, 0, 0.16); B(g, 0.1, 0.06, len || 1.2, 0xdfe8f8, 0, 0, 0.2 + (len || 1.2) / 2); return g }


  /* ---------- weapons for the dress-up ---------- */
  function spear() { const g = new THREE.Group(); B(g, 0.07, 0.07, 2.3, 0x8a5a2a, 0, 0, 0.75); B(g, 0.14, 0.14, 0.1, 0xffc23c, 0, 0, 1.85); B(g, 0.06, 0.16, 0.42, 0xfff2c8, 0, 0, 2.1, bas(0xfff6d8)); B(g, 0.04, 0.3, 0.12, 0xd8323a, 0, 0, 1.78); return g }
  function gsword() { const g = new THREE.Group(); B(g, 0.09, 0.09, 0.42, 0x2a2018, 0, 0, 0); B(g, 0.56, 0.1, 0.14, 0x3a3440, 0, 0, 0.24); B(g, 0.12, 0.34, 1.75, 0x9aa0b0, 0, 0, 1.2); B(g, 0.13, 0.06, 1.65, 0xff7a3a, 0, 0.17, 1.2, bas(0xff8a3a)); B(g, 0.13, 0.06, 1.65, 0xff7a3a, 0, -0.17, 1.2, bas(0xff8a3a)); return g }
  function bow() { const g = new THREE.Group(); B(g, 0.1, 0.1, 0.24, 0x3a2a5a, 0, 0, 0.2); for (let k = -5; k <= 5; k++) { if (!k) continue; const a = k / 5 * 1.1; B(g, 0.08, 0.08, 0.2, 0xdfe8ff, 0, Math.cos(a) * 0.32 - 0.32, 0.2 + Math.sin(a) * 0.82, k % 2 ? bas(0xcfe0ff) : null) } B(g, 0.02, 0.02, 1.62, 0xffffff, 0, -0.18, 0.2, bas(0x9fd8ff)); return g }
  function scythe() { const g = new THREE.Group(); B(g, 0.07, 0.07, 2.1, 0x2a1a3a, 0, 0, 0.7); B(g, 0.12, 0.12, 0.12, 0x5ff0ff, 0, 0, 1.78, bas(0x5ff0ff)); for (let k = 0; k < 6; k++) B(g, 0.05, 0.16, 0.2, 0xd8d0ff, 0, 0.12 + k * 0.15, 1.78 - k * k * 0.025, bas(k > 3 ? 0x9fe8ff : 0xe8e0ff)); return g }
  const WEAPONS = { sword: () => sword(1.2), katana, spear, gsword, bow, scythe };

  /* ---------- armour sets: colours + a few signature pieces per world ---------- */
  const ARMOR = {
    base: { c: 0x8a6a4a, c2: 0x5e4630, c3: 0xc8a070, w: null, ru: 'Кожаная куртка', en: 'Leather jacket' },
    islands: { c: 0x7a5232, c2: 0x5cc23a, c3: 0xffe08a, w: 'sword', ru: 'Странник облаков', en: 'Cloud wanderer', wr: 'меч', we: 'sword' },
    olympus: { c: 0xffc23c, c2: 0xfff2c8, c3: 0xd8323a, w: 'spear', ru: 'Гоплит Олимпа', en: 'Olympian hoplite', wr: 'копьё', we: 'spear' },
    chaos: { c: 0x3a3440, c2: 0x26222c, c3: 0xff7a3a, glow: 1, w: 'gsword', ru: 'Броня титана', en: 'Titan plate', wr: 'двуручник', we: 'greatsword' },
    dome: { c: 0xdfe8ff, c2: 0x5a7aff, c3: 0xffffff, glow: 1, w: 'bow', ru: 'Звёздный доспех', en: 'Star armour', wr: 'лук', we: 'bow' },
    abyss: { c: 0x2a1a40, c2: 0x9a50e0, c3: 0x5ff0ff, glow: 1, w: 'scythe', ru: 'Доспех Бездны', en: 'Abyss armour', wr: 'коса', we: 'scythe' },
    horai: { c: 0xb3122e, c2: 0x1a1420, c3: 0xffc23c, w: 'katana', ru: 'Ронин Хорая', en: 'Horai ronin', wr: 'катана', we: 'katana' }
  };
  function armor(h, id) {
    const A = ARMOR[id] || ARMOR.base, P = [], acc = A.glow ? bas(A.c3) : null;
    const piece = (part, build) => { const g = new THREE.Group(); build(g); part.add(g); g.userData.home = g.position.clone(); P.push(g); return g };
    /* helmet */
    piece(h.head, g => {
      if (id === 'horai') { B(g, 1.04, 0.32, 1.0, A.c2, 0, 0.36, -0.02); B(g, 1.36, 0.08, 1.24, A.c, 0, 0.22, -0.02); B(g, 0.1, 0.4, 0.06, A.c3, -0.22, 0.66, 0.5); B(g, 0.1, 0.4, 0.06, A.c3, 0.22, 0.66, 0.5); B(g, 0.16, 0.16, 0.06, A.c3, 0, 0.42, 0.52) }
      else if (id === 'olympus') { B(g, 1.04, 0.36, 1.0, A.c, 0, 0.36, -0.02); B(g, 0.16, 0.4, 1.0, A.c3, 0, 0.7, -0.08); for (const k of [-1, 1]) B(g, 0.08, 0.5, 0.3, A.c, k * 0.52, 0.0, 0.3) }
      else if (id === 'abyss') { B(g, 1.1, 0.56, 1.06, A.c, 0, 0.28, -0.05); B(g, 1.12, 0.08, 1.08, A.c2, 0, 0.02, -0.05); B(g, 0.9, 0.1, 0.1, A.c3, 0, 0.5, 0.5, acc) }
      else if (id === 'chaos') { B(g, 1.04, 0.36, 1.0, A.c, 0, 0.36, -0.02); for (const k of [-1, 1]) { B(g, 0.14, 0.3, 0.14, A.c2, k * 0.5, 0.6, 0); B(g, 0.12, 0.22, 0.12, A.c3, k * 0.56, 0.84, 0.04, acc) } B(g, 0.6, 0.08, 0.06, A.c3, 0, 0.26, 0.5, acc) }
      else if (id === 'dome') { B(g, 1.04, 0.34, 1.0, A.c, 0, 0.36, -0.02); B(g, 1.06, 0.08, 1.02, A.c2, 0, 0.2, -0.02); B(g, 0.22, 0.22, 0.22, A.c3, 0, 0.74, 0, acc); B(g, 0.5, 0.06, 0.06, A.c3, 0, 0.74, 0, acc); B(g, 0.06, 0.5, 0.06, A.c3, 0, 0.74, 0, acc) }
      else if (id === 'islands') { B(g, 1.08, 0.4, 1.04, A.c2, 0, 0.34, -0.04); B(g, 0.9, 0.5, 0.2, A.c2, 0, 0.0, -0.5) }
      else { B(g, 1.04, 0.24, 1.0, A.c, 0, 0.42, -0.02) }
      B(g, 0.56, 0.26, 0.56, id === 'horai' ? A.c2 : id === 'islands' ? A.c2 : A.c, 0, 0.6, 0.02);
    });
    /* chest, belt and skirt */
    piece(h.body, g => { B(g, 0.9, 0.56, 0.68, A.c, 0, -0.06, 0); B(g, 0.92, 0.08, 0.7, A.c2, 0, 0.2, 0); B(g, 0.22, 0.22, 0.04, A.c3, 0, -0.04, 0.35, acc); B(g, 0.94, 0.24, 0.72, A.c2, 0, -0.44, 0); if (id === 'horai') for (let k = -1; k <= 1; k++) B(g, 0.28, 0.32, 0.06, A.c, k * 0.31, -0.6, 0.34) });
    /* shoulders and gauntlets */
    for (const a of [h.armL, h.armR]) {
      piece(a, g => { if (id === 'horai') B(g, 0.44, 0.36, 0.42, A.c, 0, -0.08, 0); else { B(g, 0.38, 0.2, 0.38, A.c2, 0, 0.04, 0); B(g, 0.4, 0.06, 0.4, A.c3, 0, 0.15, 0, acc) } });
      piece(a, g => { B(g, 0.27, 0.18, 0.29, A.c, 0, -0.42, 0); B(g, 0.28, 0.04, 0.3, A.c3, 0, -0.34, 0, acc) });
    }
    /* greaves */
    for (const l of [h.legL, h.legR]) piece(l, g => { B(g, 0.35, 0.24, 0.37, A.c, 0, -0.3, 0.02); B(g, 0.12, 0.12, 0.04, A.c3, 0, -0.26, 0.21, acc) });
    return { id, pieces: P, def: A };
  }
  function weapon(id) { const f = WEAPONS[id]; if (!f) return null; const g = f(); g.position.set(0, -0.5, 0.1); g.rotation.x = 1.4; return g }

  /* ---------- Kumo (same shapes as the game) ---------- */
  function kBody(g, col, o) {
    const c = col || 0xf4f8ff, sh = (o && o.shade) || 0xdde8f7;
    B(g, 1.1, 0.9, 0.95, c, 0, 0.75, 0); B(g, 0.55, 0.55, 0.55, c, -0.52, 0.7, 0.05); B(g, 0.55, 0.55, 0.55, c, 0.52, 0.7, 0.05); B(g, 0.6, 0.42, 0.6, c, 0.18, 1.27, 0); B(g, 0.5, 0.36, 0.5, c, -0.25, 1.22, 0.08); B(g, 0.7, 0.5, 0.4, sh, 0, 0.62, -0.4);
    const feet = []; if (!(o && o.ghost)) feet.push(B(g, 0.32, 0.22, 0.36, sh, -0.25, 0.2, 0.08), B(g, 0.32, 0.22, 0.36, sh, 0.25, 0.2, 0.08));
    const arms = [B(g, 0.22, 0.24, 0.24, c, -0.68, 0.62, 0.22), B(g, 0.22, 0.24, 0.24, c, 0.68, 0.62, 0.22)];
    const ey = (o && o.eye) || 0x1d2433, eyes = [];
    for (const s of [-1, 1]) { eyes.push(B(g, 0.17, 0.25, 0.04, ey, s * 0.21, 0.84, 0.48, o && o.eye ? bas(ey) : null)); B(g, 0.07, 0.08, 0.02, 0xffffff, s * 0.21 + 0.04, 0.9, 0.5, bas(0xffffff)); B(g, 0.14, 0.06, 0.02, 0xffa0b8, s * 0.36, 0.66, 0.49) }
    B(g, 0.1, 0.04, 0.02, 0x5a3a4a, 0, 0.66, 0.49);
    [[-0.42, 1.05, 0.22, 0.3], [0.44, 1.02, 0.18, 0.28], [0.02, 1.48, 0.0, 0.3], [-0.6, 0.9, -0.15, 0.26], [0.62, 0.92, -0.12, 0.26], [0, 0.42, 0.36, 0.34]].forEach(([x, y, z, w]) => B(g, w, w * 0.85, w, c, x, y, z));
    for (const s2 of [-1, 1]) B(g, 0.05, 0.03, 0.02, 0xffffff, s2 * 0.4, 0.69, 0.5, bas(0xffffff));
    return { feet, eyes, arms };
  }
  const KP = {
    shell(g) { B(g, 0.95, 0.7, 0.3, 0x5a9a3a, 0, 0.82, -0.55); [[-0.22, 0.98], [0.22, 0.98], [0, 0.72], [-0.26, 0.62], [0.26, 0.62]].forEach(([x, y]) => B(g, 0.2, 0.18, 0.06, 0x8ec85a, x, y, -0.72)); B(g, 1.0, 0.08, 0.34, 0x3a7a2a, 0, 0.5, -0.55) },
    bunny(g, c) { for (const s of [-1, 1]) { const e = new THREE.Group(); e.position.set(s * 0.2, 1.4, 0.02); e.rotation.z = s * -0.18; g.add(e); B(e, 0.17, 0.62, 0.14, c || 0xf4f8ff, 0, 0.3, 0); B(e, 0.08, 0.44, 0.03, 0xffb0c0, 0, 0.3, 0.075) } },
    wings(g, c) { for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(s * 0.5, 0.95, -0.35); w.rotation.set(0, s * 0.5, s * -0.35); g.add(w); B(w, 0.62, 0.34, 0.06, c || 0xffffff, s * 0.3, 0.05, 0); B(w, 0.44, 0.18, 0.06, 0xffe8a0, s * 0.42, -0.18, 0); B(w, 0.3, 0.14, 0.06, c || 0xffffff, s * 0.55, 0.24, 0); w.userData.flap = s } },
    ghost(g, c) { [[0, 0.28, 0.85], [0, 0.05, 0.6], [0.12, -0.13, 0.36], [0.2, -0.28, 0.18]].forEach(([x, y, w], i) => B(g, w, 0.26, w * 0.9, c || 0xe2d8ff, x, y, -0.05 * i)) },
    horns(g, c) { for (const s of [-1, 1]) { B(g, 0.13, 0.2, 0.13, c || 0x4a2a70, s * 0.3, 1.5, 0.1); B(g, 0.08, 0.12, 0.08, c || 0x4a2a70, s * 0.34, 1.64, 0.12) } },
    oni(g) { B(g, 0.13, 0.26, 0.13, 0xffe0a0, 0.12, 1.55, 0.15); B(g, 0.08, 0.12, 0.08, 0xffe0a0, 0.12, 1.72, 0.15) },
    foxEars(g) { for (const s of [-1, 1]) { B(g, 0.24, 0.3, 0.12, 0xffffff, s * 0.3, 1.5, 0.05); B(g, 0.12, 0.18, 0.04, 0xff4a3a, s * 0.3, 1.5, 0.12) } },
    foxtail(g, n) { n = n || 1; for (let i = 0; i < n; i++) { const t = new THREE.Group(); t.position.set(0, 0.55, -0.45); t.rotation.set(-0.9, (i - (n - 1) / 2) * 0.55, 0); g.add(t); B(t, 0.32, 0.32, 0.75, 0xffffff, 0, 0, -0.35); B(t, 0.34, 0.34, 0.22, 0xff6a3a, 0, 0, -0.76) } },
    gear(g) { B(g, 0.05, 0.42, 0.05, 0x9aa0b8, 0, 1.65, 0); const gr = new THREE.Group(); gr.position.set(0, 1.92, 0); g.add(gr); B(gr, 0.26, 0.26, 0.08, 0xd0a040, 0, 0, 0); for (let i = 0; i < 4; i++)B(gr, 0.42, 0.08, 0.08, 0xd0a040, 0, 0, 0).rotation.z = i * Math.PI / 4; gr.userData.spin = 1 },
    stars(g) { [[0.4, 1.05, 0.4], [-0.45, 0.85, 0.35], [0.2, 0.45, 0.48], [-0.15, 1.25, 0.4], [0.55, 0.6, 0.2]].forEach(([x, y, z]) => { B(g, 0.1, 0.1, 0.02, 0xfff2a0, x, y, z, bas(0xfff2a0)).rotation.z = 0.78 }) },
    flower(g) { B(g, 0.06, 0.2, 0.06, 0x5cc23a, 0.25, 1.55, 0.05); [[0, 0.12], [0.1, 0], [-0.1, 0], [0, -0.1]].forEach(([x, y]) => B(g, 0.11, 0.11, 0.06, 0xff8fb8, 0.25 + x, 1.7 + y, 0.05, bas(0xff9ac0))); B(g, 0.08, 0.08, 0.07, 0xffe14d, 0.25, 1.7, 0.07, bas(0xffe14d)) },
    wreath(g) { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; B(g, 0.14, 0.08, 0.08, i % 2 ? 0x8ec85a : 0x5a9a3a, Math.cos(a) * 0.42, 1.42, Math.sin(a) * 0.38).rotation.y = -a } },
    halo(g) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 24), bas(0xfff2a0)); h.rotation.x = Math.PI / 2; h.position.y = 1.85; g.add(h) },
    mask(g) { B(g, 0.5, 0.08, 0.03, 0xff3a5a, 0, 1.0, 0.49, bas(0xff3a5a)); B(g, 0.06, 0.2, 0.03, 0xff3a5a, 0, 1.1, 0.49, bas(0xff3a5a)) }
  };
  const FORMS = {
    lug: { c: 0xfffbea, sh: 0xf0e6c8, f(B2) { KP.shell(B2); KP.flower(B2); KP.bunny(B2, 0xfffbea) } },
    grom: { c: 0xfff6d8, sh: 0xf0e0a8, f(B2) { KP.wings(B2); KP.wreath(B2) } },
    sum: { c: 0xb8a0f0, sh: 0x9a80d8, ghost: true, eye: 0x5ff0ff, f(B2) { KP.ghost(B2, 0xa890e8); KP.horns(B2) } },
    fon: { c: 0xfffaf6, sh: 0xf0e0d8, f(B2) { KP.foxEars(B2); KP.foxtail(B2, 3); KP.oni(B2); KP.mask(B2) } },
    zv: { c: 0x4a5aa8, sh: 0x3a4890, eye: 0xfff2a0, f(B2) { KP.stars(B2); KP.gear(B2) } },
    rain: { c: 0xfff0f8, sh: 0xf0d8ea, f(B2) { KP.halo(B2); KP.wings(B2, 0xd8f0ff);[0xff8aa0, 0xffd070, 0x9ae070, 0x80c8ff, 0xc090ff].forEach((c, i) => B(B2, 0.2, 0.2, 0.2, c, -0.5 + i * 0.25, 1.3, -0.1)) } }
  };
  const RARE = { lug: [0x39ff14, 0xc6ff00, 0xffee00], grom: [0xfff200, 0xff9f00, 0xff2bd6], sum: [0x9d00ff, 0xd400ff, 0x39ff14], fon: [0xff1493, 0xff5ec4, 0xc6ff00], zv: [0x6a00ff, 0xff00c8, 0x00ffd0], rain: [0x39ff14, 0xffee00, 0xff1493, 0x9d00ff], kid: [0x39ff14, 0xffee00, 0xff1493, 0x9d00ff] };
  const SKIP = new Set([0x1d2433, 0xffffff, 0x5a3a4a, 0xffa0b8, 0x5ff0ff, 0xfff2a0]);
  /* stage: 0 egg, 1 baby, 2 teen, 3 adult; form: lug grom sum fon zv rain; parts for baby/teen */
  function kumo(stage, form, rare, parts) {
    const G = new THREE.Group(), Bd = new THREE.Group(); G.add(Bd); let info = {};
    if (stage === 0) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), new THREE.MeshPhongMaterial({ color: rare ? 0xffd6f4 : 0xeaf6ff, shininess: 70 })); e.scale.set(1, 1.25, 1); e.position.y = 0.7; Bd.add(e);
      [[0.2, 0.95, 0.42], [-0.3, 0.6, 0.4], [0.35, 0.45, 0.35], [-0.1, 1.15, 0.35]].forEach(([x, y, z], i) => B(Bd, 0.12, 0.12, 0.12, 0, x, y, z, bas(rare ? [0x39ff14, 0xffee00, 0xff1493, 0x9d00ff][i] : 0x9fd8ff)));
    } else if (stage === 3) { const F = FORMS[form] || FORMS.lug; info = kBody(Bd, F.c, { shade: F.sh, ghost: F.ghost, eye: F.eye }); F.f(Bd) }
    else { info = kBody(Bd, 0xf4f8ff, {}); (parts || []).forEach(p => KP[p] && KP[p](Bd)) }
    const s = stage === 1 ? 0.75 : stage === 2 ? 0.88 : 1; Bd.scale.setScalar(s);
    const out = { G, B: Bd, info, glow: null, halo: null, mats: [] };
    if (rare && stage > 0) paintRare(out, stage === 3 ? form : 'kid');
    return out;
  }
  const _a = new THREE.Color(), _b = new THREE.Color(), _c = new THREE.Color(), _p = new THREE.Vector3();
  function paintRare(o, key) {
    const pal = RARE[key] || RARE.kid; o.G.updateMatrixWorld(true);
    o.G.traverse(m => {
      if (!m.isMesh) return; const c0 = m.material.color ? m.material.color.getHex() : 0; if (SKIP.has(c0) && m.scale.x < 0.3) return;
      m.getWorldPosition(_p); const t = Math.min(0.999, Math.max(0, (_p.y - 0.1) / 1.9 + _p.x * 0.08)), f = t * (pal.length - 1), i = Math.floor(f);
      _a.setHex(pal[i]); _b.setHex(pal[Math.min(pal.length - 1, i + 1)]); _c.copy(_a).lerp(_b, f - i);
      const mt = enhance(new THREE.MeshLambertMaterial({ color: _c.getHex(), emissive: _c.clone().multiplyScalar(0.38) }), { rim: 0xffffff, rimK: 0.4 }); m.material = mt; o.mats.push({ m: mt, t });
    });
    o.glow = new THREE.Mesh(new THREE.CircleGeometry(0.95, 28), new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })); o.glow.rotation.x = -Math.PI / 2; o.glow.position.y = 0.04; o.G.add(o.glow);
    o.halo = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 36), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); o.halo.rotation.x = Math.PI / 2; o.halo.position.y = 1; o.G.add(o.halo);
    o.rainbow = key === 'rain';
  }
  function animKumo(o, t, dt) {
    const I = o.info || {}; if (I.eyes) { const bl = (t % 3.3) < 0.12; I.eyes.forEach(e => e.scale.y = bl ? 0.03 : 0.25) }
    if (I.arms) I.arms[1].position.y = 0.62 + ((t % 4.6) < 1.1 ? 0.3 + Math.sin(t * 14) * 0.08 : 0);
    o.B.position.y = Math.abs(Math.sin(t * 2.2)) * 0.06; o.B.traverse(m => { if (m.userData.flap) m.rotation.z = m.userData.flap * (-0.35 + Math.sin(t * 5) * 0.25); if (m.userData.spin) m.rotation.z += dt * 2 });
    if (o.glow) { const h = (t * 0.35) % 1; o.glow.material.color.setHSL(h, 1, 0.55); o.halo.material.color.setHSL((h + 0.5) % 1, 1, 0.65); o.halo.rotation.z = t * 1.5; o.halo.position.y = 0.95 + Math.sin(t * 2) * 0.12; if (o.rainbow) o.mats.forEach(r => { r.m.color.setHSL((h + r.t * 0.8) % 1, 1, 0.55); r.m.emissive.copy(r.m.color).multiplyScalar(0.38) }) }
  }

  /* ---------- islands: one instanced mesh per island, coloured per voxel ---------- */
  function hash(x, y, z) { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s) }
  function voxels(list) {
    const m = new THREE.InstancedMesh(BOX, enhance(new THREE.MeshLambertMaterial({ color: 0xffffff }), { edge: 0.2, rimK: 0.08 }), list.length), d = new THREE.Object3D(), c = new THREE.Color(); m.castShadow = true; m.receiveShadow = true;
    list.forEach((v, i) => { d.position.set(v[0], v[1], v[2]); d.scale.setScalar(v[4] || 1); d.updateMatrix(); m.setMatrixAt(i, d.matrix); c.setHex(v[3]); const k = 0.92 + hash(v[0], v[1], v[2]) * 0.14; c.multiplyScalar(k); m.setColorAt(i, c) });
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; return m;
  }
  const THEMES = {
    islands: { top: 0x5cc23a, mid: 0x8b5a2b, low: 0x7f8089, deco: 'trees' },
    olympus: { top: 0xf1ece2, mid: 0xd8cfb8, low: 0xb8b0a0, deco: 'temple' },
    horai: { top: 0x2a2840, mid: 0x3a3050, low: 0x22202e, deco: 'neon' },
    abyss: { top: 0x3a2050, mid: 0x2a1640, low: 0x1a0e2a, deco: 'crystals' },
    home: { top: 0x6ad24a, mid: 0x8b5a2b, low: 0x7f8089, deco: 'home' },
    chaos: { top: 0x4a1a1a, mid: 0x2a1416, low: 0x1a0c0e, deco: 'lava' },
    dome: { top: 0x2a2850, mid: 0x1f1d40, low: 0x141230, deco: 'stars' }
  };
  function island(theme, r, opts) {
    const T0 = THEMES[theme] || THEMES.islands, T = opts && opts.deco === false ? Object.assign({}, T0, { deco: T0.deco === 'trees' ? 'flowers' : 'none' }) : T0, L = [], R = r || 6, G = new THREE.Group();
    for (let x = -R - 1; x <= R + 1; x++) for (let z = -R - 1; z <= R + 1; z++) {
      const d = Math.hypot(x, z) + hash(x, 1, z) * 0.8; if (d > R) continue;
      L.push([x, 0, z, T.top]); const dep = Math.min(Math.floor((R - d) * 0.9) + 1, 7);
      for (let i = 1; i <= dep; i++) L.push([x, -i, z, i > dep - 2 ? T.low : T.mid]);
      if ((T.deco === 'trees' || T.deco === 'flowers') && d < R - 1 && hash(x, 3, z) > 0.9) L.push([x, 1, z, [0xffe14d, 0xff8fb8, 0xffffff][Math.floor(hash(z, 2, x) * 3)], 0.45]);
    }
    const glows = [];
    /* richer decor */
    const P = (x, y, z, c, sc) => L.push([x, y, z, c, sc]), Gw = (x, y, z, c, sc) => glows.push([x, y, z, c, sc]), S = R / 6;
    if (T.deco === 'trees') {
      for (const [tx, tz, c, h] of [[-2.5, -1.5, 0xff6f91, 3], [2.6, -2.4, 0x3fa34d, 4], [-0.6, -3.2, 0xffd24a, 3]]) { const X = Math.round(tx * S), Z = Math.round(tz * S); for (let y = 1; y <= h; y++)P(X, y, Z, 0x6b4226); for (let a2 = -1; a2 <= 1; a2++)for (let b2 = -1; b2 <= 1; b2++)for (let y = h + 1; y <= h + 2; y++)if (Math.abs(a2) + Math.abs(b2) + (y - h - 1) < 3) P(X + a2, y, Z + b2, c); P(X, h + 3, Z, c) }
      const hx = Math.round(2 * S), hz = Math.round(1.2 * S); for (let x = 0; x <= 2; x++)for (let z = 0; z <= 1; z++) { P(hx + x, 1, hz + z, x === 1 && z === 1 ? 0x3a2410 : 0xc8955a); P(hx + x, 2, hz + z, z === 1 && x !== 1 ? 0x9fe8ff : 0xc8955a) } for (let x = -1; x <= 3; x++)for (let z = -1; z <= 2; z++)P(hx + x, 3, hz + z, 0xd8323a); for (let x = 0; x <= 2; x++)P(hx + x, 4, hz + 0.5 | 0, 0xd8323a);
      for (const [mx, mz] of [[-3.2, 1.6], [-2.6, 2.4], [0.8, -1.2]]) { const X = Math.round(mx * S), Z = Math.round(mz * S); P(X, 1, Z, 0xf3e6c8, 0.4); P(X, 1.35, Z, 0xe03a3a, 0.6) }
      for (let k = -2; k <= 2; k++)P(Math.round(-3.6 * S), 1, k, 0x8a5a2a, 0.5); for (let k = 0; k < 4; k++)P(-k, 0.52, Math.round(3 * S), 0xd8cfb8, 0.98);
      Gw(Math.round(-1.4 * S), 0.02, Math.round(-0.4 * S), 0x5fb8ff, 1.02); Gw(Math.round(-1.4 * S) + 1, 0.02, Math.round(-0.4 * S), 0x5fb8ff, 1.02);
    }
    if (T.deco === 'temple') {
      for (let a2 = -3; a2 <= 3; a2++)for (let b2 = -3; b2 <= 3; b2++)P(a2, 1, b2, 0xf1ece2); for (let a2 = -1; a2 <= 1; a2++)P(a2, 0.5, 4, 0xe8dcc0, 1);
      for (const [px, pz] of [[-3, -3], [3, -3], [-3, 3], [3, 3], [-1, -3], [1, -3], [-3, 0], [3, 0]]) for (let y = 2; y <= 5; y++)P(px, y, pz, y === 2 || y === 5 ? 0xe8dcc0 : 0xfaf6ec);
      for (let a2 = -4; a2 <= 4; a2++)for (let b2 = -4; b2 <= 4; b2++)P(a2, 6, b2, 0xe8dcc0); for (let k = 0; k <= 3; k++)for (let a2 = -3 + k; a2 <= 3 - k; a2++)P(a2, 7 + k, 0, 0xffc23c); P(0, 7, -4, 0xffc23c); P(0, 7, 4, 0xffc23c);
      for (const [sx2, sz2] of [[-5, 2], [5, 2]]) { const X = Math.round(sx2 * S); P(X, 1, sz2, 0xd8cfb8); P(X, 2, sz2, 0xf6f2e8, 0.8); P(X, 2.75, sz2, 0xf6f2e8, 0.5); P(X, 3.2, sz2, 0xf6f2e8, 0.4) }
      for (const [ux, uz] of [[-2, 4], [2, 4]]) { P(ux, 1, uz, 0xffc23c, 0.6); Gw(ux, 1.45, uz, 0xffe08a, 0.3) }
      for (const [ox, oz] of [[-4.5, -1.5], [4.4, -2], [-1.5, -4.6]]) { const X = Math.round(ox * S), Z = Math.round(oz * S); P(X, 1, Z, 0x8ec85a, 0.9); P(X, 1.7, Z, 0x6aa84a, 0.6) }
    }
    if (T.deco === 'neon') {
      for (let k = 0; k < 3; k++) { const w = 3 - k, y0 = 1 + k * 2.2; for (let a2 = -w + 1; a2 <= w - 1; a2++)for (let b2 = -w + 1; b2 <= w - 1; b2++)if (Math.abs(a2) === w - 1 || Math.abs(b2) === w - 1) { P(a2, y0, b2 - 1, 0x2a1a12); P(a2, y0 + 1, b2 - 1, 0xb3122e) } for (let a2 = -w; a2 <= w; a2++)for (let b2 = -w; b2 <= w; b2++)if (Math.abs(a2) === w || Math.abs(b2) === w) P(a2, y0 + 2, b2 - 1, 0x1a1420); Gw(-w, y0 + 2.6, -1 - w, 0xffa040, 0.35); Gw(w, y0 + 2.6, -1 + w, 0xffa040, 0.35) }
      P(0, 8, -1, 0xffc23c, 0.6);
      for (const s2 of [-2, 2]) for (let y = 1; y <= 4; y++)P(s2, y, 4, 0xd8323a); for (let a2 = -3; a2 <= 3; a2++)P(a2, 5, 4, 0x2a1a12); for (let a2 = -2; a2 <= 2; a2++)P(a2, 4, 4, 0xd8323a);
      for (const [lx, lz] of [[-4, 2], [4, 2], [-4, -3], [4, -3]]) { P(lx, 1, lz, 0x2a1a12, 0.4); P(lx, 1.5, lz, 0x2a1a12, 0.25); Gw(lx, 2, lz, 0xff8a3a, 0.45) }
      for (const [px, pz, c] of [[-5, -1, 0x22e6ff], [5, 0, 0xff4a8a]]) { const h = 5 + Math.floor(hash(px, 0, pz) * 3); for (let y = 1; y <= h; y++)P(px, y, pz, 0x2a2840); Gw(px, h + 1, pz, c); Gw(px + (px < 0 ? 0.55 : -0.55), h - 1, pz, c, 0.4) }
      for (const [bx2, bz2] of [[-3.6, 3.6], [3.4, 3.8]]) for (let y = 1; y <= 3; y++)P(Math.round(bx2 * S), y, Math.round(bz2 * S), 0x5a9a3a, 0.3);
    }
    if (T.deco === 'crystals') {
      for (const [px, pz, h] of [[-2, 1, 4], [2, -1, 5], [0, 3, 3], [-3, -2, 3], [3, 2, 4], [1, -3, 2]]) { const X = Math.round(px * S), Z = Math.round(pz * S); for (let y = 1; y <= h; y++)Gw(X, y, Z, y === h ? 0xe0a0ff : 0xb070ff, 0.75 - y * 0.08); Gw(X + 0.6, 1, Z, 0x9a50e0, 0.45); Gw(X - 0.5, 1, Z + 0.4, 0x9a50e0, 0.4) }
      for (const [tx, tz] of [[-2.4, -1], [2.2, 1.8], [0, -2.6]]) { const X = Math.round(tx * S), Z = Math.round(tz * S); for (let y = -7; y <= -5; y++)P(X, y, Z, 0x3a2050); for (let a2 = -1; a2 <= 1; a2++)for (let b2 = -1; b2 <= 1; b2++)P(X + a2, -8, Z + b2, 0x5a1a8a); P(X, -9, Z, 0x7a3aaa) }
      for (let k = 0; k < 6; k++) { const ang = k / 6 * Math.PI * 2; Gw(Math.round(Math.cos(ang) * (R - 0.6)), 0.02, Math.round(Math.sin(ang) * (R - 0.6)), 0x5ff0ff, 1.02) }
      for (const [sx2, sz2] of [[-4, 3], [4, -3], [3.5, 3.5]]) { const X = Math.round(sx2 * S), Z = Math.round(sz2 * S); P(X, 1, Z, 0x1a0e2a, 0.6); P(X, 1.6, Z, 0x1a0e2a, 0.35) }
    }
    if (T.deco === 'home') {
 for (let x = -4; x <= -1; x++)for (let z = -4; z <= -1; z++) { const e = x === -4 || x === -1 || z === -4 || z === -1; if (e) for (let y = 1; y <= 2; y++)L.push([x, y, z, (x === -1 && z === -2 && y <= 2) ? 0x3a2410 : 0xc8955a]) } for (let k = 0; k <= 2; k++)for (let x = -5 + k; x <= k; x++)for (let z = -5 + k; z <= k; z++)if (k === 2 || x === -5 + k || x === k || z === -5 + k || z === k) L.push([x, 3 + k, z, 0xd8323a]); for (const [a, b] of [[2, 2], [3, 2], [2, 3], [3, 3]]) { L.push([a, 0, b, 0x8b5a2b]); L.push([a, 1, b, [0xff8a2a, 0xffd860, 0x9fe8ff, 0xff9a3a][(a + b) % 4], 0.5]) } }
    if (T.deco === 'lava') { for (let x = -R; x <= R; x++)for (let z = -R; z <= R; z++)if (Math.hypot(x, z) < R - 0.8 && hash(x, 9, z) > 0.84) glows.push([x, 0.02, z, hash(z, 9, x) > 0.5 ? 0xff5a1a : 0xffb020, 1.02]); for (const [px, pz] of [[-2, -1], [2, 2], [1, -3], [-3, 2]]) { const h = 2 + Math.floor(hash(px, 7, pz) * 3); for (let y = 1; y <= h; y++)L.push([px, y, pz, 0x2a1214, 1 - y * 0.12]) } }
    if (T.deco === 'stars') { for (const [px, pz] of [[-2, 1], [2, -2], [0, 3], [-3, -2], [3, 2]]) { const h = 1 + Math.floor(hash(px, 4, pz) * 3); for (let y = 1; y <= h; y++)glows.push([px, y, pz, y === h ? 0xffffff : 0x9fb8ff, 0.55]) } for (let a = 0; a < 14; a++) { const t = a / 13 * Math.PI; L.push([Math.round(Math.cos(t) * 4), Math.round(Math.sin(t) * 4) + 1, -2, 0x3a3870]) } }
    G.add(voxels(L)); if (glows.length) { const gm = voxels(glows); gm.material = new THREE.MeshBasicMaterial({ color: 0xffffff }); G.add(gm) }
    return G;
  }
  /* ---------- clouds: one instanced mesh for the whole sky ---------- */
  function clouds(n, area, yMin, yMax, seed) {
    const L = []; let s = seed || 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < n; i++) {
      const cx = (rnd() - 0.5) * area, cz = (rnd() - 0.5) * area, cy = yMin + rnd() * (yMax - yMin), w = 3 + rnd() * 6;
      for (let k = 0; k < 9 + Math.floor(rnd() * 8); k++) { const sc = 1.6 + rnd() * 2.6; L.push([cx + (rnd() - 0.5) * w * 2, cy + rnd() * 1.6, cz + (rnd() - 0.5) * w, rnd() > 0.75 ? 0xeef4ff : 0xffffff, sc]) }
    }
    const m = voxels(L); m.material = enhance(new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x9aa8c8, emissiveIntensity: 0.38 }), { edge: 0.08, rim: 0xffffff, rimK: 0.2 }); m.castShadow = false; m.receiveShadow = false; return m;
  }
  /* ---------- a few mobs and a boss for the mechanics scenes ---------- */
  function jelly() { const G = new THREE.Group(); B(G, 0.9, 0.7, 0.9, 0x8ee04a, 0, 0.35, 0, new THREE.MeshLambertMaterial({ color: 0x8ee04a, transparent: true, opacity: 0.85 })); B(G, 0.12, 0.16, 0.04, 0x1d2433, -0.18, 0.45, 0.46, bas(0x1d2433)); B(G, 0.12, 0.16, 0.04, 0x1d2433, 0.18, 0.45, 0.46, bas(0x1d2433)); return G }
  function oni() { const G = new THREE.Group(); B(G, 1.2, 1.3, 0.8, 0xb3122e, 0, 1.6, 0); B(G, 0.9, 0.8, 0.8, 0xd83a3a, 0, 2.6, 0); for (const k of [-1, 1]) { B(G, 0.14, 0.34, 0.14, 0xffe0a0, k * 0.3, 3.1, 0.1); B(G, 0.2, 0.08, 0.04, 0xffe14d, k * 0.2, 2.7, 0.41, bas(0xffe14d)); B(G, 0.36, 0.9, 0.36, 0x2a1a12, k * 0.28, 0.45, 0); B(G, 0.32, 0.9, 0.32, 0xb3122e, k * 0.8, 1.6, 0) } B(G, 0.5, 0.12, 0.04, 0xffffff, 0, 2.38, 0.41, bas(0xffffff)); return G }
  function golem() { const G = new THREE.Group(); B(G, 2.4, 2.2, 1.6, 0x7f8089, 0, 2.6, 0); B(G, 1.6, 1.3, 1.4, 0x9a9ca8, 0, 4.4, 0); B(G, 1.8, 0.3, 1.6, 0xffc23c, 0, 5.2, 0); for (const k of [-1, 1]) { B(G, 0.34, 0.24, 0.05, 0x22e6ff, k * 0.38, 4.5, 0.71, bas(0x9ff4ff)); B(G, 0.8, 1.6, 0.8, 0x6a6b74, k * 0.7, 0.8, 0); B(G, 0.8, 2.2, 0.8, 0x7f8089, k * 1.65, 2.6, 0) } return G }
  function anvil() { const G = new THREE.Group(); B(G, 0.6, 0.5, 0.5, 0x4a4a55, 0, 0.25, 0); B(G, 1.2, 0.3, 0.6, 0x5a5a66, 0, 0.65, 0); B(G, 0.4, 0.2, 0.4, 0x5a5a66, 0.7, 0.68, 0); B(G, 0.3, 0.3, 0.3, 0xff7a2a, -0.2, 0.95, 0, bas(0xffa040)); return G }

  window.VX = { BOX, lam, bas, B, enhance, katana, armor, weapon, ARMOR, WEAPONS, hero, sword, kumo, animKumo, island, clouds, jelly, oni, golem, anvil, voxels, hash, FORMS, RARE };
})();
