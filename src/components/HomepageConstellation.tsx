"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const matchSignals = ["Workflow", "Role", "Budget", "Team", "Fit"];

function StaticConstellation() {
  return (
    <div className="homepage-constellation-fallback" aria-hidden="true">
      <div className="constellation-ring ring-one" />
      <div className="constellation-ring ring-two" />
      <div className="constellation-ring ring-three" />
      <div className="constellation-core">
        <Image src="/logo.png" alt="" width={46} height={46} />
      </div>
      {matchSignals.map((signal, index) => (
        <div className={`constellation-chip chip-${index + 1}`} key={signal}>
          {signal}
        </div>
      ))}
    </div>
  );
}

export default function HomepageConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

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

        const coreGeometry = new THREE.IcosahedronGeometry(0.58, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: 0xdf7afe,
          transparent: true,
          opacity: 0.92,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);

        const haloGeometry = new THREE.TorusGeometry(1.04, 0.008, 16, 160);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0x814ac8,
          transparent: true,
          opacity: 0.42,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.rotation.x = Math.PI / 2.6;
        group.add(halo);

        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.88,
        });
        const accentMaterial = new THREE.MeshBasicMaterial({
          color: 0xdf7afe,
          transparent: true,
          opacity: 0.92,
        });
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x814ac8,
          transparent: true,
          opacity: 0.25,
        });

        const nodes: Array<{
          mesh: import("three").Mesh;
          radius: number;
          speed: number;
          angle: number;
          y: number;
        }> = [];

        for (let i = 0; i < matchSignals.length; i++) {
          const radius = 1.85 + i * 0.34;
          const angle = (i / matchSignals.length) * Math.PI * 2;
          const y = (i - 2) * 0.22;
          const geometry = new THREE.SphereGeometry(i === 0 ? 0.09 : 0.07, 20, 20);
          const mesh = new THREE.Mesh(geometry, i % 2 === 0 ? accentMaterial : nodeMaterial);
          nodes.push({
            mesh,
            radius,
            speed: 0.22 + i * 0.035,
            angle,
            y,
          });
          group.add(mesh);

          const orbitPoints = [];
          for (let j = 0; j <= 160; j++) {
            const theta = (j / 160) * Math.PI * 2;
            orbitPoints.push(
              new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius * 0.38)
            );
          }
          const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
          const orbit = new THREE.Line(orbitGeometry, lineMaterial);
          orbit.rotation.x = 0.18 + i * 0.08;
          group.add(orbit);
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
          halo.rotation.z = t * 0.18;
          stars.rotation.y = t * 0.03;

          nodes.forEach((node, index) => {
            const theta = node.angle + t * node.speed;
            node.mesh.position.set(
              Math.cos(theta) * node.radius,
              node.y + Math.sin(t * 0.9 + index) * 0.08,
              Math.sin(theta) * node.radius * 0.38
            );
          });

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
          nodeMaterial.dispose();
          accentMaterial.dispose();
          lineMaterial.dispose();
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
      <div className="constellation-core constellation-core-live">
        <Image src="/logo.png" alt="" width={46} height={46} />
      </div>
      <div className="constellation-label label-workflow">Workflow</div>
      <div className="constellation-label label-role">Role</div>
      <div className="constellation-label label-budget">Budget</div>
      <div className="constellation-label label-team">Team</div>
      <div className="constellation-label label-fit">Fit</div>
      {useFallback && <StaticConstellation />}
    </div>
  );
}
