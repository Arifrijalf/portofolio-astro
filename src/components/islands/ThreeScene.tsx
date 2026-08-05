import { useEffect, useRef } from "react";
import * as THREE from "three";

function buildChip(): { group: THREE.Group; edges: THREE.LineSegments } {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.35, 2),
    new THREE.MeshStandardMaterial({ color: 0x131c2b, metalness: 0.6, roughness: 0.35 })
  );
  body.position.y = 0;
  group.add(body);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry),
    new THREE.LineBasicMaterial({ color: 0x00e5ff })
  );
  group.add(edges);

  const leg = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0xffb000, emissiveIntensity: 0.4 });
  const edgeOffsets = [-0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7];
  edgeOffsets.forEach((o) => {
    [-1.03, 1.03].forEach((z) => {
      const p = new THREE.Mesh(leg, legMat);
      p.position.set(o, -0.2, z);
      group.add(p);
    });
    [-1.03, 1.03].forEach((x) => {
      const p = new THREE.Mesh(leg, legMat);
      p.position.set(x, -0.2, o);
      group.add(p);
    });
  });
  return { group, edges };
}

function buildBoard(): THREE.Group {
  const g = new THREE.Group();
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.15, 5.2),
    new THREE.MeshStandardMaterial({ color: 0x0a1218, metalness: 0.4, roughness: 0.6 })
  );
  slab.position.y = -1.05;
  g.add(slab);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(slab.geometry),
    new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
  );
  g.add(edge);

  const viaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8);
  const viaMat = new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0xffb000, emissiveIntensity: 0.3 });
  for (let i = 0; i < 24; i++) {
    const v = new THREE.Mesh(viaGeo, viaMat);
    v.rotation.x = Math.PI / 2;
    v.position.set((Math.random() - 0.5) * 4.4, -0.975, (Math.random() - 0.5) * 4.4);
    g.add(v);
  }
  return g;
}

function buildTraceChords(radius: number, count: number): THREE.Vector3[] {
  const chords: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r0 = radius * (0.35 + Math.random() * 0.4);
    const r1 = radius * (0.9 + Math.random() * 0.25);
    const jitter = Math.random() * 0.5;
    chords.push(
      new THREE.Vector3(Math.cos(a) * r0, 0, Math.sin(a) * r0),
      new THREE.Vector3(Math.cos(a + jitter * 0.3) * r1, 0, Math.sin(a + jitter * 0.3) * r1)
    );
  }
  return chords;
}

function buildTraces(chords: THREE.Vector3[]): THREE.LineSegments {
  const positions: number[] = [];
  chords.forEach((v) => positions.push(v.x, v.y, v.z));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35 }));
}

function buildOrbit(radius: number, count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = radius * (0.75 + Math.random() * 0.5);
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
    positions[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xffb000, size: 0.05, transparent: true, opacity: 0.8 })
  );
}

function makeLabel(text: string, color = "#e6edf3"): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const fontSize = 48;
  const pad = 24;
  ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = fontSize + pad * 2;
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  c.font = `bold ${fontSize}px "Space Mono", monospace`;
  c.fillStyle = color;
  c.textBaseline = "middle";
  c.textAlign = "left";
  c.fillText(text, pad, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  const s = 0.32 / h;
  sprite.scale.set(w * s, h * s, 1);
  return sprite;
}

function buildSignalDot(radius = 0.06): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 12), mat);
}

function buildLed(): { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial } {
  const material = new THREE.MeshBasicMaterial({ color: 0x3a2c00 });
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), material), material };
}

function buildSparkles(): THREE.Points {
  const count = 60;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4.6;
    positions[i * 3 + 1] = -0.96;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffb000, size: 0.04, transparent: true, opacity: 0.6 });
  return new THREE.Points(geo, mat);
}

export default function ThreeScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const div = ref.current;
    const isMobile = window.innerWidth <= 1024;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fov = 50;
    const aspect = div.clientWidth / div.clientHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
    camera.position.set(0, 1.2, Math.max(7, 3.6 / (Math.tan((fov / 2) * (Math.PI / 180)) * aspect)));
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const rim = new THREE.PointLight(0x00e5ff, 1.5, 20);
    rim.position.set(-4, 2, -2);
    scene.add(rim);

    const root = new THREE.Group();
    const spin = new THREE.Group();
    const { group: chip, edges: edgeMatHolder } = buildChip();
    const edgeMat = edgeMatHolder.material as THREE.LineBasicMaterial;
    const edgeBase = new THREE.Color(0x00e5ff);
    chip.position.y = -0.575;
    spin.add(chip);

    const led = buildLed();
    led.mesh.position.set(0.55, 0.18, 0.55);
    chip.add(led.mesh);

    spin.add(buildBoard());
    const traceChords = buildTraceChords(3.4, 28);
    spin.add(buildTraces(traceChords));
    const orbit = buildOrbit(3.4, 240);
    spin.add(orbit);
    spin.add(buildSparkles());

    const labelDefs = [
      { text: "GND", pos: [-2.1, 0.8, 2.1], color: "#ffb000" },
      { text: "VCC 3.3V", pos: [2.1, 0.8, 2.1], color: "#e6edf3" },
      { text: "ARF-2026", pos: [2.1, 0.8, -2.1], color: "#00e5ff" },
      { text: "TX/RX", pos: [-2.1, 0.8, -2.1], color: "#e6edf3" },
    ] as const;
    const labels = labelDefs.map((l) => {
      const s = makeLabel(l.text, l.color);
      s.position.set(l.pos[0], l.pos[1], l.pos[2]);
      spin.add(s);
      return s;
    });
    const labelBases = labels.map((l) => l.position.y);

    const dot1 = buildSignalDot();
    const dot2 = buildSignalDot();
    dot1.position.set(2.6, 0, 0);
    dot2.position.set(3.2, 0, 0);
    spin.add(dot1, dot2);

    const packetDefs = [
      { mesh: buildSignalDot(0.045), seg: 0, speed: 0.5, pair: 0 },
      { mesh: buildSignalDot(0.045), seg: 0.35, speed: 0.4, pair: 6 },
      { mesh: buildSignalDot(0.045), seg: 0.7, speed: 0.62, pair: 12 },
    ];
    packetDefs.forEach((p) => spin.add(p.mesh));

    root.add(spin);
    scene.add(root);

    const mouse = { x: 0, y: 0 };
    const glow = new THREE.PointLight(0x00e5ff, 0, 6);
    glow.position.set(0, 0, 1.5);
    scene.add(glow);
    const glowTarget = { x: 0, y: 0, intensity: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      glowTarget.x = mouse.x * 3;
      glowTarget.y = mouse.y * 1.8;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = div.clientWidth / div.clientHeight;
      camera.position.z = Math.max(7, 3.6 / (Math.tan((fov / 2) * (Math.PI / 180)) * camera.aspect));
      camera.updateProjectionMatrix();
      renderer.setSize(div.clientWidth, div.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let scrollFactor = 0;
    const onScroll = () => {
      scrollFactor = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const userRot = { y: 0, x: 0 };
    const rootVel = { x: 0, y: 0 };
    const spinVel = { x: 0, y: 0 };
    let popT = 0;
    const raycaster = new THREE.Raycaster();
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    const ndc = { x: 0, y: 0 };

    const setNdc = (e: PointerEvent) => {
      const r = div.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      setNdc(e);
      div.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      userRot.y += dx * 0.005;
      userRot.x = Math.max(-0.9, Math.min(0.9, userRot.x + dy * 0.005));
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      setNdc(e);
      if (moved < 6) {
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects([chip], true);
        if (hits.length) {
          popT = 1;
          edgeMat.color.set(0xffffff);
        }
      }
    };

    const onPointerEnter = () => {
      glowTarget.intensity = 1;
    };
    const onPointerLeave = () => {
      glowTarget.intensity = 0;
    };

    if (!prefersReduced) {
      div.addEventListener("pointerdown", onPointerDown);
      div.addEventListener("pointermove", onPointerMove);
      div.addEventListener("pointerup", onPointerUp);
      div.addEventListener("pointercancel", onPointerUp);
      div.addEventListener("pointerenter", onPointerEnter);
      div.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    const clock = new THREE.Clock();
    const dtClock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(0.05, dtClock.getDelta());
      const t = clock.getElapsedTime();

      chip.rotation.y = t * 0.35;
      chip.position.y = -0.575 + Math.sin(t * 0.8) * 0.05;
      orbit.rotation.y = t * 0.08;

      const a1 = t * 0.9;
      dot1.position.set(Math.cos(a1) * 2.6, 0, Math.sin(a1) * 2.6);
      const a2 = -t * 1.1;
      dot2.position.set(Math.cos(a2) * 3.2, 0, Math.sin(a2) * 3.2);

      led.material.color.setHex(Math.sin(t * 5) > 0.6 ? 0xffb000 : 0x3a2c00);
      (spin.children.find((c) => c instanceof THREE.Points && (c.material as THREE.PointsMaterial).size === 0.04)
        ?.material as THREE.PointsMaterial).opacity = 0.45 + 0.25 * Math.sin(t * 1.8);

      packetDefs.forEach((p) => {
        p.seg += p.speed * dt;
        if (p.seg >= 1) {
          p.seg -= 1;
          p.pair = (p.pair + 2) % traceChords.length;
        }
        const a = traceChords[p.pair];
        const b = traceChords[p.pair + 1];
        p.mesh.position.lerpVectors(a, b, p.pair % 2 === 0 ? p.seg : 1 - p.seg);
      });

      labels.forEach((l, i) => {
        l.position.y = labelBases[i] + Math.sin(t * 0.7 + i * 1.7) * 0.05;
      });

      spin.position.y = -scrollFactor * 0.6;

      const targetRy = mouse.x * 0.4;
      const targetRx = mouse.y * 0.2 + scrollFactor * 0.3;
      rootVel.y += ((targetRy - root.rotation.y) * 60 - rootVel.y * 8) * dt;
      rootVel.x += ((targetRx - root.rotation.x) * 60 - rootVel.x * 8) * dt;
      root.rotation.y += rootVel.y * dt;
      root.rotation.x += rootVel.x * dt;

      spinVel.y += ((userRot.y - spin.rotation.y) * 60 - spinVel.y * 8) * dt;
      spinVel.x += ((userRot.x - spin.rotation.x) * 60 - spinVel.x * 8) * dt;
      spin.rotation.y += spinVel.y * dt;
      spin.rotation.x += spinVel.x * dt;

      glow.position.x += (glowTarget.x - glow.position.x) * 0.08;
      glow.position.y += (glowTarget.y - glow.position.y) * 0.08;
      glow.intensity += (glowTarget.intensity - glow.intensity) * 0.08;

      if (popT > 0.01) {
        popT *= 0.9;
        chip.scale.setScalar(1 + 0.12 * popT);
        edgeMat.color.lerp(edgeBase, 0.12);
      } else {
        chip.scale.setScalar(1);
        edgeMat.color.copy(edgeBase);
      }

      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      div.removeEventListener("pointerdown", onPointerDown);
      div.removeEventListener("pointermove", onPointerMove);
      div.removeEventListener("pointerup", onPointerUp);
      div.removeEventListener("pointercancel", onPointerUp);
      div.removeEventListener("pointerenter", onPointerEnter);
      div.removeEventListener("pointerleave", onPointerLeave);
      labels.forEach((l) => {
        (l.material as THREE.SpriteMaterial).map?.dispose();
        l.material.dispose();
        l.geometry.dispose();
      });
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments || o instanceof THREE.Points) {
          o.geometry?.dispose();
          const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose();
        }
      });
      renderer.dispose();
      div.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="h-[520px] w-full max-w-[760px] mx-auto"
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
