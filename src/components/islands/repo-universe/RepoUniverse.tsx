import { useEffect, useRef, useState } from "react";
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

const SPAWN = [
  [-2.4, 0.9, 0.4],
  [2.4, 0.7, -0.6],
  [0, 1.6, -1.2],
  [-1.6, -0.2, -0.8],
  [1.6, -0.4, 0.2],
  [0.4, 1.0, -1.8],
  [-0.2, 2.1, 0.8],
];

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

function CameraRig({ reduced }: { reduced: boolean }) {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3(0, 0, 8.5));
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
    if (reduced) return;
    camera.position.x += (target.current.x - camera.position.x) * Math.min(delta * 2.5, 1);
    camera.position.y += (target.current.y - camera.position.y) * Math.min(delta * 2.5, 1);
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
        <CameraRig reduced={reduced} />
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
              position={SPAWN[i]}
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
