/* Renders real in-game Kumo (landing/voxel.js) onto a transparent WebGL canvas, so CSS backgrounds composite behind them.
   cfg: { w, h, cam:{fov,pos:[x,y,z],look:[x,y,z]}, light:{...}, kumos:[{stage,form,rare,parts,pos:[x,y,z],scale,ry,t}] } */
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
      const o = VX.kumo(k.stage, k.form || null, !!k.rare, k.parts || []);
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
