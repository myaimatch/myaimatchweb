"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import myAiMatchMark from "../../brand_assets/Vector-1.png";

const matchSignals = [
  { label: "Workflow", angle: -0.92 },
  { label: "Industry", angle: -2.02 },
  { label: "Team", angle: -3.08 },
  { label: "Budget", angle: -4.08 },
  { label: "Goals", angle: -5.12 },
  { label: "Use Case", angle: -6.14 },
];

type SignalPosition = {
  left: number;
  top: number;
  scale: number;
  opacity: number;
  zIndex: number;
  path: string;
};

const initialSignalPositions = matchSignals.map((signal) => getSignalPosition(signal.angle));

function getSignalPosition(theta: number): SignalPosition {
  const x = Math.cos(theta);
  const y = Math.sin(theta);
  const depth = (y + 1) / 2;
  const left = 50 + x * 38;
  const top = 48 - y * 24;
  const innerLeft = 50 + x * 12;
  const innerTop = 48 - y * 7;
  const controlLeft = 50 + x * 26;
  const controlTop = 48 - y * 17 + Math.cos(theta) * 2.5;

  return {
    left,
    top,
    scale: 0.88 + depth * 0.18,
    opacity: 0.58 + depth * 0.36,
    zIndex: y > 0 ? 6 : 2,
    path: `M ${left.toFixed(2)} ${top.toFixed(2)} Q ${controlLeft.toFixed(2)} ${controlTop.toFixed(
      2
    )} ${innerLeft.toFixed(2)} ${innerTop.toFixed(2)}`,
  };
}

function StaticConstellation() {
  return (
    <div className="homepage-constellation-fallback" aria-hidden="true">
      <svg className="constellation-connectors" viewBox="0 0 100 100" preserveAspectRatio="none">
        {initialSignalPositions.map((position, index) => (
          <path d={position.path} key={matchSignals[index].label} />
        ))}
      </svg>
      <div className="constellation-ring ring-one" />
      <div className="constellation-ring ring-two" />
      <div className="constellation-ring ring-three" />
      <div className="constellation-core">
        <Image src={myAiMatchMark} alt="" width={64} height={24} />
      </div>
      <div className="constellation-match-label">myAIMatch</div>
      {matchSignals.map((signal, index) => (
        <div
          className="constellation-chip"
          key={signal.label}
          style={{
            left: `${initialSignalPositions[index].left}%`,
            top: `${initialSignalPositions[index].top}%`,
            opacity: initialSignalPositions[index].opacity,
            transform: `translate(-50%, -50%) scale(${initialSignalPositions[index].scale})`,
            zIndex: initialSignalPositions[index].zIndex,
          }}
        >
          {signal.label}
        </div>
      ))}
    </div>
  );
}

export default function HomepageConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [signalPositions, setSignalPositions] = useState<SignalPosition[]>(initialSignalPositions);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setUseFallback(true);
      return;
    }

    let mounted = true;
    let cleanup: (() => void) | undefined;

    async function setupScene() {
      try {
        const THREE = await import("three");
        if (!mounted || !canvas || !wrap) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 8);

        const group = new THREE.Group();
        scene.add(group);

        const coreGeometry = new THREE.IcosahedronGeometry(0.54, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: 0xdf7afe,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);

        const haloGeometry = new THREE.TorusGeometry(0.96, 0.012, 16, 180);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xdf7afe,
          transparent: true,
          opacity: 0.62,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.rotation.x = Math.PI / 2.6;
        group.add(halo);

        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        for (let j = 0; j <= 220; j++) {
          const theta = (j / 220) * Math.PI * 2;
          orbitPoints.push(new THREE.Vector3(Math.cos(theta) * 3.08, 0, Math.sin(theta) * 1.18));
        }
        orbitGeometry.setFromPoints(orbitPoints);
        const sharedOrbit = new THREE.Line(orbitGeometry, haloMaterial);
        sharedOrbit.rotation.x = 0.26;
        group.add(sharedOrbit);

        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });
        const accentMaterial = new THREE.MeshBasicMaterial({
          color: 0xdf7afe,
          transparent: true,
          opacity: 0.92,
        });
        const nodes: Array<{
          mesh: import("three").Mesh;
          angle: number;
        }> = [];
        const nodeGeometries: Array<import("three").BufferGeometry> = [];

        for (let i = 0; i < matchSignals.length; i++) {
          const geometry = new THREE.SphereGeometry(i === 0 ? 0.09 : 0.07, 20, 20);
          nodeGeometries.push(geometry);
          const mesh = new THREE.Mesh(geometry, i % 2 === 0 ? accentMaterial : nodeMaterial);
          nodes.push({
            mesh,
            angle: matchSignals[i].angle,
          });
          group.add(mesh);
        }

        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(180 * 3);
        for (let i = 0; i < starPositions.length; i += 3) {
          const radius = 2.4 + Math.random() * 2.8;
          const angle = Math.random() * Math.PI * 2;
          starPositions[i] = Math.cos(angle) * radius;
          starPositions[i + 1] = (Math.random() - 0.5) * 3.8;
          starPositions[i + 2] = Math.sin(angle) * radius * 0.5;
        }
        starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.018,
          transparent: true,
          opacity: 0.46,
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        group.add(stars);

        const pointer = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        let raf = 0;

        const resize = () => {
          const rect = wrap.getBoundingClientRect();
          const width = Math.max(rect.width, 1);
          const height = Math.max(rect.height, 1);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };

        const handlePointerMove = (event: PointerEvent) => {
          const rect = wrap.getBoundingClientRect();
          target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        const animate = (time: number) => {
          pointer.x += (target.x - pointer.x) * 0.045;
          pointer.y += (target.y - pointer.y) * 0.045;
          const t = time * 0.001;

          group.rotation.y = t * 0.12 + pointer.x * 0.18;
          group.rotation.x = pointer.y * 0.11;
          core.rotation.x = t * 0.24;
          core.rotation.y = t * 0.32;
          halo.rotation.z = -t * 0.22;
          sharedOrbit.rotation.z = -t * 0.05;
          stars.rotation.y = t * 0.03;

          const nextPositions: SignalPosition[] = [];
          nodes.forEach((node, index) => {
            const theta = node.angle - t * 0.34;
            node.mesh.position.set(
              Math.cos(theta) * 3.08,
              Math.sin(theta) * 0.18,
              Math.sin(theta) * 1.18
            );
            nextPositions.push(getSignalPosition(theta));
          });
          setSignalPositions(nextPositions);

          renderer.render(scene, camera);
          raf = window.requestAnimationFrame(animate);
        };

        resize();
        wrap.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("resize", resize);
        raf = window.requestAnimationFrame(animate);

        cleanup = () => {
          window.cancelAnimationFrame(raf);
          wrap.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("resize", resize);
          renderer.dispose();
          coreGeometry.dispose();
          coreMaterial.dispose();
          haloGeometry.dispose();
          haloMaterial.dispose();
          orbitGeometry.dispose();
          nodeMaterial.dispose();
          accentMaterial.dispose();
          nodeGeometries.forEach((geometry) => geometry.dispose());
          starGeometry.dispose();
          starMaterial.dispose();
        };
      } catch {
        if (mounted) setUseFallback(true);
      }
    }

    setupScene();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className="homepage-constellation" aria-hidden="true">
      <canvas ref={canvasRef} className="homepage-constellation-canvas" />
      <svg className="constellation-connectors" viewBox="0 0 100 100" preserveAspectRatio="none">
        {signalPositions.map((position, index) => (
          <path
            d={position.path}
            key={matchSignals[index].label}
            style={{ opacity: position.opacity * 0.56 }}
          />
        ))}
      </svg>
      <div className="constellation-core constellation-core-live">
        <Image src={myAiMatchMark} alt="" width={64} height={24} />
      </div>
      <div className="constellation-match-label">myAIMatch</div>
      {matchSignals.map((signal, index) => (
        <div
          className="constellation-label"
          key={signal.label}
          style={{
            left: `${signalPositions[index].left}%`,
            top: `${signalPositions[index].top}%`,
            opacity: signalPositions[index].opacity,
            transform: `translate(-50%, -50%) scale(${signalPositions[index].scale})`,
            zIndex: signalPositions[index].zIndex,
          }}
        >
          {signal.label}
        </div>
      ))}
      {useFallback && <StaticConstellation />}
    </div>
  );
}
