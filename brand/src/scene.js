/* Renders real in-game Kumo (landing/voxel.js) onto a transparent WebGL canvas, so CSS backgrounds composite behind them.
   cfg: { w, h, cam:{fov,pos:[x,y,z],look:[x,y,z]}, light:{...}, kumos:[{stage,form,rare,parts,pos:[x,y,z],scale,ry,t}] } */
/* cute face pass: body proportions are untouched, only the face details are enlarged */
function cutify(o, T) {
  const near = (v, t) => Math.abs(v - t) < 0.004, adds = [];
  o.B.traverse(m => {
    if (!m.isMesh) return; const w = m.scale.x, h = m.scale.y, d = m.scale.z;
    if (near(w, 0.17) && near(h, 0.25) && near(d, 0.04)) { m.scale.set(0.215, 0.285, 0.04); m.position.y += 0.035 }                               /* eyes: rounder and bigger */
    else if (near(w, 0.07) && near(h, 0.08) && near(d, 0.02)) {                                                         /* eye highlight + a second small one */
      m.scale.set(0.088, 0.092, 0.02); m.position.y += 0.03; m.position.x += Math.sign(m.position.x) * 0.0; m.position.z += 0.012;
      const b = m.clone(); b.scale.set(0.045, 0.045, 0.02); b.position.set(m.position.x - 0.07, m.position.y - 0.12, m.position.z); adds.push([m.parent, b]);
    }
    else if (near(w, 0.14) && near(h, 0.06) && near(d, 0.02)) { m.scale.set(0.17, 0.1, 0.02); m.position.y -= 0.03; m.position.x *= 1.1 }                          /* blush */
    else if (near(w, 0.1) && near(h, 0.04) && near(d, 0.02)) {                                                          /* mouth with a small smile */
      m.scale.set(0.08, 0.04, 0.02); m.position.y -= 0.03;
      [-0.065, 0.065].forEach(x => { const c = m.clone(); c.scale.set(0.04, 0.045, 0.02); c.position.set(x, m.position.y + 0.036, m.position.z); adds.push([m.parent, c]) });
    }
  });
  adds.forEach(([p, c]) => p.add(c));
}
window.KSCENE = {
  render(canvas, cfg) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    r.setPixelRatio(cfg.dpr || 1); r.setSize(cfg.w, cfg.h, false); r.setClearColor(0x000000, 0);
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xffffff, cfg.ground || 0xb9b6e8, cfg.hemi || 0.95));
    const dl = new THREE.DirectionalLight(0xffffff, cfg.sun || 0.85); dl.position.set(3, 6, 7); s.add(dl);
    const rim = new THREE.DirectionalLight(cfg.rimColor || 0xffd6f4, cfg.rim || 0.35); rim.position.set(-5, 3, -4); s.add(rim);
    const c = cfg.cam, cam = new THREE.PerspectiveCamera(c.fov || 30, cfg.w / cfg.h, 0.1, 100);
    cam.position.set(...c.pos); cam.lookAt(...c.look);
    const out = [];
    cfg.kumos.forEach(k => {
      const T0 = THREE; const o = VX.kumo(k.stage, k.form || null, !!k.rare, k.parts || []);
      if (cfg.cute) cutify(o, T0);
      o.G.position.set(...(k.pos || [0, 0, 0])); o.G.scale.setScalar(k.scale || 1); o.G.rotation.y = k.ry == null ? -0.4 : k.ry;
      if (o.glow) { VX.animKumo(o, k.t == null ? 0.4 : k.t, 0); if (k.noGlow) { o.glow.visible = false } if (k.noHalo) o.halo.visible = false; o.G.add(o.glow); o.G.add(o.halo) }
      s.add(o.G); out.push(o);
    });
    (cfg.extra || []).forEach(f => f(s, THREE));
    r.render(s, cam);
    const url = canvas.toDataURL('image/png'); const img = new Image(); img.src = url; img.className = canvas.className; img.style.cssText = canvas.style.cssText; img.alt = ''; canvas.replaceWith(img);
    return { r, s, cam, out, img, url };
  },
};
