import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const OBJ_URL = "/OBJ_PCB_IOT-V2.obj";
const MTL_URL = "/OBJ_PCB_IOT-V2.mtl";

export default function ModelViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const div = ref.current;
    const isMobile = window.innerWidth <= 1024;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fov = 50;
    const aspect = div.clientWidth / div.clientHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    camera.position.set(0, 0, Math.max(6, 2.3 / (Math.tan((fov / 2) * (Math.PI / 180)) * aspect)));

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const rim = new THREE.PointLight(0x00e5ff, 1.0, 20);
    rim.position.set(-4, 2, -2);
    scene.add(rim);

    const turntable = new THREE.Group();
    turntable.rotation.x = -0.45;
    scene.add(turntable);

    const userRot = { x: 0, y: 0 };
    let model: THREE.Object3D | null = null;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      div.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      userRot.y += dx * 0.01;
      userRot.x = Math.max(-1.2, Math.min(1.2, userRot.x + dy * 0.01));
    };
    const onPointerUp = () => {
      dragging = false;
    };
    div.addEventListener("pointerdown", onPointerDown);
    div.addEventListener("pointermove", onPointerMove);
    div.addEventListener("pointerup", onPointerUp);
    div.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      camera.aspect = div.clientWidth / div.clientHeight;
      camera.position.z = Math.max(6, 2.3 / (Math.tan((fov / 2) * (Math.PI / 180)) * camera.aspect));
      camera.updateProjectionMatrix();
      renderer.setSize(div.clientWidth, div.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load(
      MTL_URL,
      (materials) => {
        objLoader.setMaterials(materials);
        objLoader.load(
          OBJ_URL,
          (obj) => {
            if (cancelled) return;
            const box = new THREE.Box3().setFromObject(obj);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim;
            obj.scale.setScalar(scale);
            obj.position.sub(center.clone().multiplyScalar(scale));
            obj.traverse((o) => {
              if (o instanceof THREE.Mesh) {
                const m = o.material as THREE.Material | THREE.Material[];
                (Array.isArray(m) ? m : [m]).forEach((mm) => {
                  mm.side = THREE.DoubleSide;
                });
              }
            });
            turntable.add(obj);
            model = obj;
            setStatus("ready");
          },
          undefined,
          () => {
            if (!cancelled) setStatus("error");
          }
        );
      },
      undefined,
      () => {
        if (!cancelled) setStatus("error");
      }
    );

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(0.05, clock.getDelta());
      if (model) {
        if (!dragging && !prefersReduced) userRot.y += (isMobile ? 0.15 : 0.2) * dt;
        turntable.rotation.y += (userRot.y - turntable.rotation.y) * 0.1;
        turntable.rotation.x = -0.45 + (userRot.x - (turntable.rotation.x + 0.45)) * 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      div.removeEventListener("pointerdown", onPointerDown);
      div.removeEventListener("pointermove", onPointerMove);
      div.removeEventListener("pointerup", onPointerUp);
      div.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry?.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose();
        }
      });
      renderer.dispose();
      div.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative">
      {status !== "ready" && (
        <img
          src="/PCB_IOT-V2-copy_2026-08-05.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <div ref={ref} className="h-[480px] w-full" style={{ touchAction: "none" }} aria-hidden="true" />
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel/60 font-mono text-sm text-text-secondary pointer-events-none">
          {status === "loading" ? "LOADING 3D MODEL…" : "MODEL LOAD FAILED"}
        </div>
      )}
    </div>
  );
}
