"use strict";

/* ─── CONFIG ─────────────────────────────────────────────── */
const WPP = "https://wa.me/5514996812163?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20ver%20o%20cat%C3%A1logo%20de%20perfumes.%20%F0%9F%8C%B9";

/* ─── BOOT ────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    patchWpp();
    navbar();
    mobileMenu();
    scrollReveal();
    faq();
    cursorGlow();
    scrollProgress();
    counters();
    loadThree(); // hero 3-D bottle
    parallaxBand();
});

/* ─── WPP ─────────────────────────────────────────────────── */
function patchWpp() {
    document.querySelectorAll("[data-wpp]").forEach(el => {
        if (el.tagName === "A") el.href = WPP;
    });
}

/* ─── NAVBAR ──────────────────────────────────────────────── */
function navbar() {
    const n = document.getElementById("navbar");
    window.addEventListener("scroll", () => n.classList.toggle("scrolled", scrollY > 50), { passive: true });
}

/* ─── MOBILE MENU ─────────────────────────────────────────── */
function mobileMenu() {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("mobile-menu");
    const close = document.getElementById("menu-close");
    if (!burger || !menu) return;
    const open = () => { menu.classList.add("open");
        document.body.style.overflow = "hidden";
        burger.classList.add("open"); };
    const shut = () => { menu.classList.remove("open");
        document.body.style.overflow = "";
        burger.classList.remove("open"); };
    burger.addEventListener("click", () => menu.classList.contains("open") ? shut() : open());
    close ?.addEventListener("click", shut);
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", shut));
}

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
function scrollReveal() {
    const els = document.querySelectorAll(".sr,.sr-left,.sr-right,.sr-scale");
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("visible");
                io.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach(el => io.observe(el));
}

/* ─── SCROLL PROGRESS ─────────────────────────────────────── */
function scrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
        bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + "%";
    }, { passive: true });
}

/* ─── FAQ ─────────────────────────────────────────────────── */
function faq() {
    document.querySelectorAll(".faq-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.parentElement;
            const open = item.classList.contains("open");
            document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
            if (!open) item.classList.add("open");
        });
    });
}

/* ─── CURSOR GLOW ─────────────────────────────────────────── */
function cursorGlow() {
    const g = document.getElementById("cursor-glow");
    if (!g || innerWidth < 768) return;
    window.addEventListener("mousemove", e => { g.style.left = e.clientX + "px";
        g.style.top = e.clientY + "px"; }, { passive: true });
}

/* ─── COUNTERS ────────────────────────────────────────────── */
function counters() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.count;
            const suf = el.dataset.suffix || "";
            const pre = el.dataset.prefix || "";
            let v = 0;
            const step = target / 55;
            const tick = () => { v = Math.min(v + step, target);
                el.textContent = pre + Math.round(v).toLocaleString("pt-BR") + suf; if (v < target) requestAnimationFrame(tick); };
            tick();
            io.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-count]").forEach(el => io.observe(el));
}

/* ─── PARALLAX BAND ───────────────────────────────────────── */
function parallaxBand() {
    const bg = document.querySelector(".parallax-bg");
    if (!bg) return;
    const update = () => {
        const band = document.querySelector(".parallax-band");
        if (!band) return;
        const rect = band.getBoundingClientRect();
        const progress = (innerHeight / 2 - rect.top - rect.height / 2);
        bg.style.transform = `translateY(${progress*0.22}px)`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
}

/* ═══════════════════════════════════════════════════════════
   THREE.JS — HERO 3D SCENE
   ═══════════════════════════════════════════════════════════ */
function loadThree() {
    const stage = document.getElementById("hero-stage");
    if (!stage) return;
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.onload = () => buildBottleScene(stage);
    document.head.appendChild(s);
}

function buildBottleScene(stage) {
    if (typeof THREE === "undefined") return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%!important;height:100%!important;border-radius:24px;";

    /* ── scene / camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0.6, 7.2);

    const resize = () => {
        const w = stage.clientWidth,
            h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    resize();
    new ResizeObserver(resize).observe(stage);

    /* ── env / fog ── */
    scene.fog = new THREE.FogExp2(0x000000, 0.055);

    /* ── lights ── */
    scene.add(new THREE.AmbientLight(0xfff8e8, 0.12));

    // Key light — warm from top-left
    const keyLight = new THREE.DirectionalLight(0xffe5a0, 3.5);
    keyLight.position.set(-3, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    // Rim — cold blue from behind
    const rimLight = new THREE.DirectionalLight(0xa0c8ff, 1.1);
    rimLight.position.set(4, 2, -6);
    scene.add(rimLight);

    // Gold fill — orbiting point light
    const goldPoint = new THREE.PointLight(0xc9a84c, 6, 14);
    goldPoint.position.set(-2, 0, 4);
    scene.add(goldPoint);

    // Ground bounce
    const bounce = new THREE.PointLight(0x8866ff, 0.6, 8);
    bounce.position.set(0, -3, 2);
    scene.add(bounce);

    /* ── MATERIALS ── */
    const GOLD = 0xc9a84c,
        GOLD_DARK = 0x8a6820;

    // Crystal glass — physics material simulation
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xc8b870,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.82,
        thickness: 1.2,
        ior: 1.52,
        transparent: true,
        opacity: 0.75,
        envMapIntensity: 2.5,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
    });

    const goldMat = new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 0.96,
        roughness: 0.14,
        envMapIntensity: 2,
    });
    const goldDarkMat = new THREE.MeshStandardMaterial({
        color: GOLD_DARK,
        metalness: 0.9,
        roughness: 0.22,
    });
    const capMat = new THREE.MeshPhysicalMaterial({
        color: 0x0e0c06,
        metalness: 0.55,
        roughness: 0.28,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
    });
    const liquidMat = new THREE.MeshPhysicalMaterial({
        color: 0xb87028,
        metalness: 0,
        roughness: 0.02,
        transmission: 0.55,
        transparent: true,
        opacity: 0.88,
    });
    const labelMat = new THREE.MeshStandardMaterial({
        color: 0x080600,
        roughness: 0.95,
        metalness: 0,
    });
    const labelGoldMat = new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 0.6,
        roughness: 0.5,
    });

    /* ── BOTTLE PROFILE ── */
    // Elegant tall flacon with shoulder curve
    const profile = [
        [0.000, 0.000],
        [0.520, 0.000],
        [0.575, 0.035],
        [0.590, 0.120],
        [0.600, 0.500],
        [0.610, 0.900],
        [0.608, 1.300],
        [0.595, 1.650],
        [0.560, 1.900],
        [0.490, 2.050],
        [0.380, 2.120],
        [0.300, 2.190],
        [0.260, 2.280],
        [0.230, 2.700],
        [0.218, 3.100],
        [0.215, 3.400],
        [0.220, 3.520],
        [0.235, 3.580],
        [0.240, 3.620],
        [0.230, 3.660],
        [0.172, 3.700],
        [0.158, 4.050],
        [0.160, 4.100],
        [0.000, 4.100],
    ];
    const pts = profile.map(([x, y]) => new THREE.Vector2(x, y));
    const bodyGeo = new THREE.LatheGeometry(pts, 80);
    const body = new THREE.Mesh(bodyGeo, glassMat);
    body.castShadow = true;

    /* liquid fill */
    const liqPts = [
        [0, 0],
        [0.505, 0],
        [0.55, 0.035],
        [0.56, 0.12],
        [0.57, 0.5],
        [0.57, 0.9],
        [0.56, 1.3],
        [0.54, 1.65],
        [0.49, 1.9],
        [0.38, 2.05],
        [0.27, 2.12],
        [0.23, 2.16],
        [0, 2.16],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const liq = new THREE.Mesh(new THREE.LatheGeometry(liqPts, 72), liquidMat);

    /* label band */
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.605, 0.605, 1.1, 72, 1, true), labelMat);
    label.position.y = 0.72;

    /* gold rings */
    function ring(r, thick, y) {
        const m = new THREE.Mesh(new THREE.TorusGeometry(r, thick, 16, 72), goldMat);
        m.rotation.x = Math.PI / 2;
        m.position.y = y;
        return m;
    }
    const rings = [ring(0.612, 0.026, 1.35), ring(0.612, 0.026, 0.08),
        ring(0.612, 0.014, -0.52), ring(0.595, 0.018, -1.88)
    ];

    /* neck collar */
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.215, 0.12, 48), goldMat);
    collar.position.y = 3.56;

    /* cap — elegant hexagonal prism */
    const capShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2 - Math.PI / 6;
        const x = Math.cos(a) * 0.29,
            y = Math.sin(a) * 0.29;
        i === 0 ? capShape.moveTo(x, y) : capShape.lineTo(x, y);
    }
    capShape.closePath();
    const capGeo = new THREE.ExtrudeGeometry(capShape, {
        depth: 0.88,
        bevelEnabled: true,
        bevelSize: 0.028,
        bevelThickness: 0.022,
        bevelSegments: 5
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.rotation.x = -Math.PI / 2;
    cap.position.set(-0.29, 3.70, 0.29);

    const capBand = new THREE.Mesh(new THREE.CylinderGeometry(0.295, 0.295, 0.048, 48), goldMat);
    capBand.position.y = 4.58;

    // Label decorative line
    const labelLine = new THREE.Mesh(new THREE.CylinderGeometry(0.608, 0.608, 0.008, 72, 1, true), labelGoldMat);
    labelLine.position.y = 1.32;
    const labelLine2 = new THREE.Mesh(new THREE.CylinderGeometry(0.608, 0.608, 0.008, 72, 1, true), labelGoldMat);
    labelLine2.position.y = 0.12;

    /* group */
    const bottleGroup = new THREE.Group();
    [body, liq, label, labelLine, labelLine2, ...rings, collar, cap, capBand].forEach(m => bottleGroup.add(m));
    bottleGroup.position.set(0.18, -2.05, 0);
    scene.add(bottleGroup);

    /* ── SECOND BOTTLE (background, small) ── */
    const sm = [
        [0, 0],
        [0.32, 0],
        [0.355, 0.04],
        [0.36, 0.5],
        [0.36, 1.4],
        [0.34, 1.65],
        [0.28, 1.82],
        [0.20, 1.90],
        [0.155, 2.20],
        [0.15, 2.50],
        [0.16, 2.55],
        [0, 2.55],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const smMat = new THREE.MeshPhysicalMaterial({
        color: 0x181410,
        metalness: 0.3,
        roughness: 0.12,
        transmission: 0.3,
        transparent: true,
        opacity: 0.9,
    });
    const smBottle = new THREE.Mesh(new THREE.LatheGeometry(sm, 56), smMat);
    const smRing = new THREE.Mesh(new THREE.TorusGeometry(0.362, 0.018, 12, 56), goldMat);
    smRing.rotation.x = Math.PI / 2;
    smRing.position.y = -0.05;
    const smGroup = new THREE.Group();
    smGroup.add(smBottle, smRing);
    smGroup.position.set(-1.5, -0.58, -1.1);
    smGroup.rotation.y = 0.45;
    smGroup.scale.setScalar(0.78);
    scene.add(smGroup);

    /* ── THIRD BOTTLE (right, angular) ── */
    const sm3 = [
        [0, 0],
        [0.22, 0],
        [0.24, 0.04],
        [0.25, 1.2],
        [0.23, 1.55],
        [0.17, 1.70],
        [0.12, 1.76],
        [0.11, 2.0],
        [0.12, 2.06],
        [0, 2.06],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const sm3Mat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1200,
        metalness: 0.4,
        roughness: 0.1,
        transmission: 0.5,
        transparent: true,
        opacity: 0.85,
    });
    const sm3Bottle = new THREE.Mesh(new THREE.LatheGeometry(sm3, 56), sm3Mat);
    const sm3Group = new THREE.Group();
    sm3Group.add(sm3Bottle);
    sm3Group.position.set(1.45, -0.8, -0.9);
    sm3Group.rotation.y = -0.5;
    sm3Group.scale.setScalar(0.65);
    scene.add(sm3Group);

    /* ── REFLECTIVE SURFACE / GROUND ── */
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x050402,
        roughness: 0.06,
        metalness: 0.85,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.07;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ── GOLD DUST PARTICLES ── */
    const N = 160;
    const pos = new Float32Array(N * 3),
        sizes = new Float32Array(N);
    const alphas = new Float32Array(N),
        speeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 6;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        sizes[i] = Math.random() * 0.04 + 0.008;
        alphas[i] = Math.random();
        speeds[i] = Math.random() * 0.4 + 0.1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const dustMat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.032,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ── LIGHT TRAILS / WISPS ── */
    function makeWisp(color, len, y0) {
        const c = new THREE.CatmullRomCurve3(
            Array.from({ length: 8 }, (_, i) => new THREE.Vector3(
                (Math.random() - 0.5) * 4, y0 + i * 0.6 + (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 2
            ))
        );
        const geo = new THREE.TubeGeometry(c, 40, 0.008, 6, false);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35 });
        return new THREE.Mesh(geo, mat);
    }
    const wisp1 = makeWisp(0xc9a84c, 8, -3);
    const wisp2 = makeWisp(0xfff0c0, 8, -2);
    scene.add(wisp1, wisp2);

    /* ── MOUSE / TOUCH ── */
    let mx = 0,
        my = 0,
        tx = 0,
        ty = 0;
    stage.addEventListener("mousemove", e => {
        const r = stage.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });
    stage.addEventListener("mouseleave", () => { mx = 0;
        my = 0; });
    stage.addEventListener("touchmove", e => {
        const r = stage.getBoundingClientRect(),
            t = e.touches[0];
        mx = ((t.clientX - r.left) / r.width - 0.5) * 2;
        my = ((t.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });

    /* ── SCROLL PARALLAX ──────────────────────────────────────
       Bottle tilts and lifts as hero scrolls out of view       */
    let scrollRatio = 0;
    const heroEl = document.querySelector(".hero");
    window.addEventListener("scroll", () => {
        if (!heroEl) return;
        const { top, height } = heroEl.getBoundingClientRect();
        scrollRatio = Math.max(0, Math.min(1, -top / height));
    }, { passive: true });

    /* ── RENDER LOOP ── */
    let t = 0,
        prev = 0;
    (function loop(now = 0) {
        requestAnimationFrame(loop);
        const dt = Math.min((now - prev) / 1000, 0.05);
        prev = now;
        t += dt;

        // smooth mouse
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;

        // bottle: idle float + mouse
        bottleGroup.rotation.y = t * 0.38 + tx * 0.40;
        bottleGroup.rotation.x = ty * 0.20 + Math.sin(t * 0.7) * 0.012;
        bottleGroup.rotation.z = Math.sin(t * 0.5) * 0.014;
        bottleGroup.position.y = -2.05 + Math.sin(t * 0.9) * 0.10;

        // scroll: bottle lifts + tilts back
        bottleGroup.rotation.x += scrollRatio * 0.6;
        bottleGroup.position.y -= scrollRatio * 0.5;
        bottleGroup.position.z = -scrollRatio * 1.0;

        // small bottles gentle sway
        smGroup.rotation.y = 0.45 + Math.sin(t * 0.55) * 0.07;
        smGroup.position.y = -0.58 + Math.sin(t * 0.72 + 1) * 0.05;
        sm3Group.rotation.y = -0.5 + Math.sin(t * 0.62 + 2) * 0.07;
        sm3Group.position.y = -0.8 + Math.sin(t * 0.8 + 0.5) * 0.05;

        // gold light orbit
        goldPoint.position.x = Math.cos(t * 0.5) * 2.8;
        goldPoint.position.z = Math.sin(t * 0.5) * 2.8 + 1.5;

        // dust drift
        const dpos = dustGeo.attributes.position;
        for (let i = 0; i < N; i++) {
            dpos.array[i * 3 + 1] += dt * speeds[i] * 0.12;
            if (dpos.array[i * 3 + 1] > 4) dpos.array[i * 3 + 1] = -4;
        }
        dpos.needsUpdate = true;
        dust.rotation.y += dt * 0.04;

        // wisp drift
        wisp1.rotation.y += dt * 0.08;
        wisp2.rotation.y -= dt * 0.06;

        renderer.render(scene, camera);
    })();
}
