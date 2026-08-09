import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import type { Repo } from "../../data/repos";

export const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  C: "#555555",
  "C++": "#f34b7d",
  Python: "#3572a5",
  Astro: "#ff5a03",
  HTML: "#e34c26",
  Rust: "#dea584",
  Unknown: "#7d8ca3",
};

const SPRING_DAMPING = 0.4;

function makeSoccerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  ctx.fillStyle = "#131c2b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: Array<[number, number, number]> = [
    [-1, 0, phi], [1, 0, phi], [-1, 0, -phi], [1, 0, -phi],
    [0, phi, 1], [0, phi, -1], [0, -phi, 1], [0, -phi, -1],
    [phi, 1, 0], [phi, -1, 0], [-phi, 1, 0], [-phi, -1, 0],
  ];
  type V3 = { x: number; y: number; z: number };
  const verts: V3[] = raw.map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return { x: x / len, y: y / len, z: z / len };
  });
  const proj = (p: V3) => ({
    u: Math.atan2(p.z, p.x) / (2 * Math.PI) + 0.5,
    v: Math.asin(Math.max(-1, Math.min(1, p.y))) / Math.PI + 0.5,
  });
  const pts = verts.map((v) => {
    const p = proj(v);
    return { x: p.u * canvas.width, y: p.v * canvas.height, u: p.u, v: p.v };
  });
  const dist3 = (a: V3, b: V3) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  const neighbors: number[][] = verts.map(() => []);
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      if (dist3(verts[i], verts[j]) < 1.05) {
        neighbors[i].push(j);
        neighbors[j].push(i);
      }
    }
  }

  ctx.strokeStyle = "#0a0f16";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  for (let i = 0; i < verts.length; i++) {
    for (const j of neighbors[i]) {
      if (i >= j) continue;
      let u = pts[j].u;
      if (u - pts[i].u > 0.5) u -= 1;
      else if (u - pts[i].u < -0.5) u += 1;
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(u * canvas.width, pts[j].y);
      ctx.stroke();
    }
  }

  for (let i = 0; i < verts.length; i++) {
    const c = pts[i];
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    for (const j of neighbors[i]) {
      let u = pts[j].u;
      if (u - c.u > 0.5) u -= 1;
      else if (u - c.u < -0.5) u += 1;
      ctx.lineTo(u * canvas.width, pts[j].y);
    }
    ctx.closePath();
    ctx.fillStyle = "#00e5ff";
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

interface RepoObjectProps {
  repo: Repo;
  position: [number, number, number];
  draggedPos: React.RefObject<THREE.Vector3 | null>;
  onSelect: (repo: Repo) => void;
  reduced: boolean;
}

export default function RepoObject({ repo, position, draggedPos: draggedPosRef, onSelect, reduced }: RepoObjectProps) {
  const body = useRef<RapierRigidBody>(null);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(false);

  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const home = useMemo(() => new THREE.Vector3(...position), [position]);
  const soccerTex = useMemo(() => makeSoccerTexture(), []);

  const drag = useRef({
    active: false,
    moved: 0,
    lastX: 0,
    lastY: 0,
    y: 0,
    target: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    prevX: 0,
    prevY: 0,
    prevZ: 0,
    downTimestamp: 0, // Add this new property
  });

  const lang = repo.language || "Unknown";
  const langColor = LANG_COLORS[lang] || "#7d8ca3";

  const labelTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pad = 18;
      const boxH = 84;
      ctx.fillStyle = "rgba(10, 15, 22, 0.92)";
      ctx.strokeStyle = "rgba(0, 229, 255, 0.55)";
      ctx.lineWidth = 3;
      const w = canvas.width - pad * 2;
      ctx.beginPath();
      ctx.roundRect(pad, (canvas.height - boxH) / 2, w, boxH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = langColor;
      ctx.fillRect(pad + 14, (canvas.height - boxH) / 2 + 14, 10, 10);

      ctx.fillStyle = "#e6edf3";
      ctx.font = "600 40px 'Space Mono', monospace";
      ctx.textBaseline = "middle";
      const name = repo.name.length > 26 ? repo.name.slice(0, 24) + ".." : repo.name;
      ctx.fillText(name.toUpperCase(), pad + 36, (canvas.height - boxH) / 2 + 28);

      ctx.fillStyle = "#7d8ca3";
      ctx.font = "26px 'Space Mono', monospace";
      ctx.fillText(lang.toUpperCase(), pad + 36, (canvas.height - boxH) / 2 + 66);
    };

    draw();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(draw);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [repo.name, langColor, lang]);

  useEffect(() => {
    return () => {
      labelTex?.dispose();
    };
  }, [labelTex]);

  useEffect(() => {
    return () => soccerTex.dispose();
  }, [soccerTex]);

  const spriteScale = useMemo(() => {
    const h = 0.55;
    return new THREE.Vector3(h * (512 / 192), h, 1);
  }, []);

  const castPoint = (clientX: number, clientY: number): THREE.Vector3 | null => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(ndc, camera);
    plane.set(new THREE.Vector3(0, 0, 1), -home.z);
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hit)) return hit;
    return null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    const p = castPoint(e.clientX, e.clientY);
    if (p) {
      drag.current.target.x = p.x;
      drag.current.target.y = p.y;
      drag.current.target.z = home.z;
    }
  };

const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    draggedPosRef.current = null;
    const b = body.current;
    if (!b) return;
    if (drag.current.moved < 6 && (performance.now() - drag.current.downTimestamp < 250)) {
      onSelect(repo);
    } else {
      const throwVel = drag.current.vel.clone();
      const throwSpeed = throwVel.length();
      // Cap throw velocity to prevent instability
      const maxThrowSpeed = 25;
      if (throwSpeed > maxThrowSpeed) {
        throwVel.multiplyScalar(maxThrowSpeed / throwSpeed);
      }
      b.applyImpulse({ x: throwVel.x, y: throwVel.y, z: 0 }, true);
      b.setAngvel(new THREE.Vector3(0, 0, 0), true);
      setBurst(true);
      setTimeout(() => setBurst(false), 200);
    }
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const b = body.current;
    if (!b) return;
    drag.current.active = true;
    drag.current.moved = 0;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.y = b.translation().y;
    drag.current.vel.set(0, 0, 0);
    drag.current.downTimestamp = performance.now();
    const t0 = b.translation();
    drag.current.prevX = t0.x;
    drag.current.prevY = t0.y;
    drag.current.prevZ = t0.z;
    const p = castPoint(e.clientX, e.clientY);
    if (p) drag.current.target.copy(p);
    // Register this ball as being dragged
    draggedPosRef.current = new THREE.Vector3();
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  useFrame((state, delta) => {
    const b = body.current;
    if (!b) return;

    if (drag.current.active) {
      const cur = b.translation();
      const step = drag.current.target.clone().sub(new THREE.Vector3(cur.x, cur.y, cur.z)).multiplyScalar(Math.min(delta * 10, 1));
      const next = { x: cur.x + step.x, y: cur.y + step.y, z: home.z };
      b.setTranslation(next, true);
      if (draggedPosRef.current) draggedPosRef.current.set(next.x, next.y, next.z);
      drag.current.vel.set(
        (next.x - drag.current.prevX) / Math.max(delta, 1e-4),
        (next.y - drag.current.prevY) / Math.max(delta, 1e-4),
        0
      );
      b.setLinvel({ x: drag.current.vel.x, y: drag.current.vel.y, z: 0 }, true);
      b.setAngvel({ x: 0, y: 0, z: 0 }, true);
      drag.current.prevX = next.x;
      drag.current.prevY = next.y;
      drag.current.prevZ = home.z;
      return;
    }

    if (!reduced) {
      const p = b.translation();

      const threat = draggedPosRef.current;
      if (threat) {
        const dx = p.x - threat.x;
        const dy = p.y - threat.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 2.5 && dist > 0.01) {
          const forceStrength = (1 - dist / 2.5) * 8;
          b.applyImpulse({ x: (dx / dist) * forceStrength * delta, y: (dy / dist) * forceStrength * delta, z: 0 }, true);
        }
      }

      const v = b.linvel();
      const maxV = 10;
      const gain = Math.min(delta * 5, 1);
      const desiredVx = THREE.MathUtils.clamp((home.x - p.x) * 4, -maxV, maxV);
      const desiredVy = THREE.MathUtils.clamp((home.y - p.y) * 4, -maxV, maxV);
      b.setLinvel(
        { x: v.x + (desiredVx - v.x) * gain, y: v.y + (desiredVy - v.y) * gain, z: 0 },
        true
      );

      if (Math.abs(p.x) > 10 || Math.abs(p.y) > 10) {
        b.setTranslation({ x: home.x, y: home.y, z: home.z }, true);
        b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (group.current) {
      const breath = reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.4 + repo.name.length) * 0.02;
      const target = hovered ? 1.12 + breath : 1 + breath;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), Math.min(delta * 6, 1));

      if (!reduced && !drag.current.active) {
        const phase = home.x * 2.1 + home.y * 1.7;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.05;
        group.current.position.x = Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.02;
      } else {
        group.current.position.y = 0;
        group.current.position.x = 0;
      }
    }
  });

  return (
    <RigidBody
      ref={body}
      position={position}
      colliders={false}
      friction={0.1}
      restitution={0.05}
      linearDamping={SPRING_DAMPING}
      angularDamping={0.45}
    >
      <BallCollider args={[0.55]} />
      <group ref={group} onPointerDown={onPointerDown} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial map={soccerTex} color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.62, 0.012, 8, 40]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={hovered ? 2.2 : 0.7}
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={hovered ? "#00e5ff" : "#ffb000"} />
        </mesh>
        {labelTex && (
          <sprite position={[0, 0.15, 0.78]} scale={spriteScale}>
            <spriteMaterial map={labelTex} transparent depthWrite={false} />
          </sprite>
        )}
        {burst && (
          <Sparkles
            count={30}
            scale={1.2}
            size={2}
            speed={2}
            opacity={0.8}
            color="#00e5ff"
          />
        )}
      </group>
    </RigidBody>
  );
}
