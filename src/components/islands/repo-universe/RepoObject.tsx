import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
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

interface RepoObjectProps {
  repo: Repo;
  position: [number, number, number];
  onSelect: (repo: Repo) => void;
  reduced: boolean;
}

export default function RepoObject({ repo, position, onSelect, reduced }: RepoObjectProps) {
  const body = useRef<RapierRigidBody>(null);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);

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
    plane.set(new THREE.Vector3(0, 1, 0), -drag.current.y);
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hit)) return hit;
    return null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    const p = castPoint(e.clientX, e.clientY);
    if (p) drag.current.target.copy(p);
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const b = body.current;
    if (!b) return;
    if (drag.current.moved < 6) {
      onSelect(repo);
    } else {
      b.setLinvel(drag.current.vel.clone().multiplyScalar(1.1), true);
      b.setAngvel(
        new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4),
        true
      );
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
    const t0 = b.translation();
    drag.current.prevX = t0.x;
    drag.current.prevY = t0.y;
    drag.current.prevZ = t0.z;
    const p = castPoint(e.clientX, e.clientY);
    if (p) drag.current.target.copy(p);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  useFrame((state, delta) => {
    const b = body.current;
    if (!b) return;

    if (drag.current.active) {
      const cur = b.translation();
      const step = drag.current.target.clone().sub(new THREE.Vector3(cur.x, cur.y, cur.z)).multiplyScalar(Math.min(delta * 10, 1));
      const next = { x: cur.x + step.x, y: cur.y + step.y, z: cur.z + step.z };
      b.setTranslation(next, true);
      b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      b.setAngvel({ x: 0, y: 0, z: 0 }, true);
      drag.current.vel.set(
        (next.x - drag.current.prevX) / Math.max(delta, 1e-4),
        (next.y - drag.current.prevY) / Math.max(delta, 1e-4),
        (next.z - drag.current.prevZ) / Math.max(delta, 1e-4)
      );
      drag.current.prevX = next.x;
      drag.current.prevY = next.y;
      drag.current.prevZ = next.z;
      return;
    }

    if (!reduced) {
      const lv = b.linvel();
      if (Math.sqrt(lv.x * lv.x + lv.y * lv.y + lv.z * lv.z) < 0.05 && Math.random() < delta * 0.5) {
        b.applyImpulse(
          {
            x: (Math.random() - 0.5) * 0.4,
            y: Math.random() * 0.25 + 0.05,
            z: (Math.random() - 0.5) * 0.4,
          },
          true
        );
      }
    }

    if (group.current) {
      const breath = reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.4 + repo.name.length) * 0.02;
      const target = hovered ? 1.12 + breath : 1 + breath;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), Math.min(delta * 6, 1));
    }
  });

  return (
    <RigidBody
      ref={body}
      position={position}
      colliders={false}
      friction={0.1}
      restitution={0.3}
      linearDamping={0.9}
      angularDamping={0.45}
    >
      <CapsuleCollider args={[0.45, 0.55]} />
      <group ref={group} onPointerDown={onPointerDown} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <mesh>
          <capsuleGeometry args={[0.55, 0.9, 12, 24]} />
          <meshStandardMaterial
            color="#0e1520"
            emissive="#0a1218"
            emissiveIntensity={0.4}
            metalness={0.45}
            roughness={0.5}
          />
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
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={hovered ? "#00e5ff" : "#ffb000"} />
        </mesh>
        {labelTex && (
          <sprite position={[0, 0.15, 0.78]} scale={spriteScale}>
            <spriteMaterial map={labelTex} transparent depthWrite={false} />
          </sprite>
        )}
      </group>
    </RigidBody>
  );
}
