import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import RepoObject from "./RepoObject";
import RepoPanel from "./RepoPanel";
import type { Repo } from "../../../data/repos";

interface RepoUniverseProps {
  repos: Repo[];
}

const generatePositions = (count: number) => {
  const X_RANGE = [-2.8, 2.8];
  const Y_RANGE = [-0.8, 2.2];
  const MIN_DIST = 1.3;
  const positions: [number, number, number][] = [];
  let attempts = 0;
  
  while (positions.length < count && attempts < 500) {
    attempts++;
    const x = Math.random() * (X_RANGE[1] - X_RANGE[0]) + X_RANGE[0];
    const y = Math.random() * (Y_RANGE[1] - Y_RANGE[0]) + Y_RANGE[0];
    const tooClose = positions.some(p => Math.hypot(p[0]-x, p[1]-y) < MIN_DIST);
    if (!tooClose) positions.push([x, y, 0]);
  }
  return positions;
};

function RoomEnv() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

const SPRITE_HALF_W = (0.55 * 512) / 192 / 2;
const SPRITE_HALF_H = 0.55 / 2;
const BOUND_MARGIN = 0.25;
const MIN_Z = 8.5;

function CameraRig({ reduced, fitHalfX }: { reduced: boolean; fitHalfX: number }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const target = useRef(new THREE.Vector3(0, 0, 8.5));
  const fitZ = useRef(MIN_Z);
  fitZ.current = Math.max(fitHalfX / (Math.tan((45 * Math.PI) / 360) * Math.max(size.width / size.height, 0.3)), MIN_Z);
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * -0.5;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);
  useFrame((_, delta) => {
    const k = Math.min(delta * 2.5, 1);
    if (!reduced) {
      camera.position.x += (target.current.x - camera.position.x) * k;
      camera.position.y += (target.current.y - camera.position.y) * k;
    }
    camera.position.z += (fitZ.current - camera.position.z) * k;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RepoUniverse({ repos }: RepoUniverseProps) {
  const [selected, setSelected] = useState<Repo | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = reduced ? 1 : isMobile ? [1, 1.5] : [1, 2];
  const positions = useMemo(() => generatePositions(Math.min(repos.length, 7)), [repos.length]);
  const draggedPosRef = useRef<THREE.Vector3 | null>(null);

  const fitHalfX = useMemo(
    () =>
      positions.reduce((m, p) => Math.max(m, Math.abs(p[0])), 0) + SPRITE_HALF_W + BOUND_MARGIN,
    [positions]
  );
  const bounds = useMemo(
    () => ({
      x: fitHalfX,
      y: positions.reduce((m, p) => Math.max(m, Math.abs(p[1])), 0) + SPRITE_HALF_H + BOUND_MARGIN,
    }),
    [positions, fitHalfX]
  );

  return (
    <div className="relative h-[420px] w-full md:h-[520px]">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 0, 8.5], fov: 45, near: 0.1, far: 100 }}
        style={{ touchAction: "none" }}
        aria-hidden="true"
      >
        <RoomEnv />
        <CameraRig reduced={reduced} fitHalfX={fitHalfX} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} castShadow />
        <pointLight position={[-5, 2, -3]} intensity={1.2} color="#00e5ff" />
        {!reduced && (
          <Sparkles
            count={isMobile ? 40 : 90}
            scale={[12, 7, 6]}
            size={1.4}
            speed={0.25}
            opacity={0.35}
            color="#00e5ff"
          />
        )}
        <Physics gravity={[0, 0, 0]}>
          {repos.slice(0, 7).map((repo, i) => (
            <RepoObject
              key={repo.slug}
              repo={repo}
              position={positions[i]}
              draggedPos={draggedPosRef}
              bounds={bounds}
              onSelect={setSelected}
              reduced={reduced}
            />
          ))}
        </Physics>
      </Canvas>
      <RepoPanel repo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
