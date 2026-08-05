import { useEffect, useRef } from "react";
import * as THREE from "three";

function buildChip(): THREE.Group {
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

  const pin = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0xffb000, emissiveIntensity: 0.4 });
  const offsets = [-0.8, -0.27, 0.27, 0.8];
  offsets.forEach((x, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const p = new THREE.Mesh(pin, pinMat);
    p.rotation.x = Math.PI / 2;
    p.position.set(x, -0.1, side * 1.05);
    group.add(p);
  });
  return group;
}

function buildGear(radius: number, teeth: number): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.25, 24),
    new THREE.MeshStandardMaterial({ color: 0x0e1520, metalness: 0.8, roughness: 0.3 })
  );
  group.add(body);
  const tooth = new THREE.BoxGeometry(0.45, 0.25, 0.28);
  const toothMat = new THREE.MeshStandardMaterial({ color: 0x1a2433, metalness: 0.8, roughness: 0.4 });
  for (let i = 0; i < teeth; i++) {
    const t = new THREE.Mesh(tooth, toothMat);
    const a = (i / teeth) * Math.PI * 2;
    t.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    t.rotation.y = a;
    group.add(t);
  }
  return group;
}

function buildTraces(radius: number, count: number): THREE.LineSegments {
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r0 = radius * (0.35 + Math.random() * 0.4);
    const r1 = radius * (0.9 + Math.random() * 0.25);
    const jitter = Math.random() * 0.5;
    positions.push(
      Math.cos(a) * r0, 0, Math.sin(a) * r0,
      Math.cos(a + jitter * 0.3) * r1, 0, Math.sin(a + jitter * 0.3) * r1
    );
  }
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

export default function ThreeScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    if (window.innerWidth <= 1024) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const div = ref.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, div.clientWidth / div.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 7);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const rim = new THREE.PointLight(0x00e5ff, 1.5, 20);
    rim.position.set(-4, 2, -2);
    scene.add(rim);

    const root = new THREE.Group();
    const chip = buildChip();
    chip.position.y = 0.35;
    root.add(chip);
    const gear = buildGear(1.25, 10);
    gear.position.set(2.4, -0.9, -1.2);
    gear.rotation.x = Math.PI / 2;
    root.add(gear);
    root.add(buildTraces(3.4, 28));
    const orbit = buildOrbit(3.4, 240);
    root.add(orbit);
    scene.add(root);

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = div.clientWidth / div.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(div.clientWidth, div.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      chip.rotation.y = t * 0.35;
      chip.position.y = 0.35 + Math.sin(t * 0.8) * 0.08;
      gear.rotation.z = -t * 0.5;
      orbit.rotation.y = t * 0.08;
      root.rotation.y += (mouse.x * 0.4 - root.rotation.y) * 0.05;
      root.rotation.x += (mouse.y * 0.2 - root.rotation.x) * 0.05;
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
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments || o instanceof THREE.Points) {
          o.geometry?.dispose();
        }
      });
      renderer.dispose();
      div.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="h-[520px] w-full max-w-[760px] mx-auto" aria-hidden="true" />;
}
