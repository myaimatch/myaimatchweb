"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  r: number;
  baseR: number;
  opacity: number;
  survivor: boolean;
  jitterSeed: number;
  driftX: number;
  driftY: number;
};

const SURVIVOR_POSITIONS: Array<[number, number]> = [
  [0.5, 0.5],
  [0.32, 0.34],
  [0.68, 0.34],
  [0.34, 0.68],
  [0.66, 0.7],
  [0.5, 0.2],
];

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 5],
  [2, 5],
  [1, 3],
  [2, 4],
  [3, 4],
];

const TOTAL_NODES = 44;
const CYCLE_MS = 9000;
const PRIMARY = "#814ac8";
const ACCENT = "#df7afe";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StackConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const nodesRef = useRef<Node[]>([]);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();

    const rand = seededRandom(7);
    const survivorCount = SURVIVOR_POSITIONS.length;
    const nodes: Node[] = [];

    for (let i = 0; i < TOTAL_NODES; i++) {
      const survivor = i < survivorCount;
      const tx = survivor ? SURVIVOR_POSITIONS[i][0] : rand();
      const ty = survivor ? SURVIVOR_POSITIONS[i][1] : rand();
      const baseR = survivor ? 4.6 + rand() * 1.6 : 1.6 + rand() * 1.4;
      nodes.push({
        x: rand(),
        y: rand(),
        targetX: tx,
        targetY: ty,
        r: baseR,
        baseR,
        opacity: 0,
        survivor,
        jitterSeed: rand() * Math.PI * 2,
        driftX: 0,
        driftY: 0,
      });
    }
    nodesRef.current = nodes;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - rect.left) / rect.width;
      mouseRef.current.ty = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let raf = 0;
    const start = performance.now();

    const drawFrame = (now: number) => {
      const elapsed = (now - start) % CYCLE_MS;
      const t = elapsed / CYCLE_MS;
      const width = canvas.width / dprRef.current;
      const height = canvas.height / dprRef.current;

      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;
      const parallaxX = (mouseRef.current.x - 0.5) * 18;
      const parallaxY = (mouseRef.current.y - 0.5) * 12;

      let scanY = -1;
      let scanIntensity = 0;
      if (!reduce) {
        if (t >= 0.18 && t <= 0.48) {
          const localT = (t - 0.18) / 0.3;
          scanY = easeInOutCubic(localT) * height;
          scanIntensity = Math.sin(localT * Math.PI);
        }
      }

      const materialize = reduce ? 1 : Math.min(t / 0.15, 1);
      const assignmentStart = 0.24;
      const assignmentEnd = 0.5;
      const assignProgress = reduce
        ? 1
        : Math.min(Math.max((t - assignmentStart) / (assignmentEnd - assignmentStart), 0), 1);
      const connectionProgress = reduce
        ? 1
        : Math.min(Math.max((t - 0.48) / 0.18, 0), 1);
      const holdFade = reduce ? 1 : t > 0.88 ? 1 - (t - 0.88) / 0.12 : 1;

      const nodesArr = nodesRef.current;

      if (connectionProgress > 0) {
        for (const [a, b] of CONNECTIONS) {
          const na = nodesArr[a];
          const nb = nodesArr[b];
          const ax = (na.x * width) + parallaxX;
          const ay = (na.y * height) + parallaxY;
          const bx = (nb.x * width) + parallaxX;
          const by = (nb.y * height) + parallaxY;

          const drawLen = connectionProgress;
          const midX = ax + (bx - ax) * drawLen;
          const midY = ay + (by - ay) * drawLen;

          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, `rgba(223, 122, 254, ${0.55 * holdFade})`);
          grad.addColorStop(1, `rgba(129, 74, 200, ${0.18 * holdFade})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(midX, midY);
          ctx.stroke();
        }
      }

      for (let i = 0; i < nodesArr.length; i++) {
        const node = nodesArr[i];

        const jx = Math.sin(now / 2200 + node.jitterSeed) * 0.004;
        const jy = Math.cos(now / 2600 + node.jitterSeed) * 0.004;

        const sx = node.x + jx;
        const sy = node.y + jy;

        const dx = node.targetX - sx;
        const dy = node.targetY - sy;

        const lerpAmount = node.survivor
          ? easeOutCubic(assignProgress) * 0.98
          : 0;

        const rx = (sx + dx * lerpAmount) * width + parallaxX;
        const ry = (sy + dy * lerpAmount) * height + parallaxY;

        let opacity = materialize;
        if (node.survivor) {
          opacity *= 0.45 + 0.55 * assignProgress;
        } else {
          opacity *= 1 - 0.92 * assignProgress;
        }

        opacity *= holdFade;

        const r = node.survivor
          ? node.baseR * (0.7 + 0.3 * easeOutCubic(assignProgress))
          : node.baseR;

        if (node.survivor) {
          ctx.beginPath();
          ctx.arc(rx, ry, r * 3.2, 0, Math.PI * 2);
          const halo = ctx.createRadialGradient(rx, ry, 0, rx, ry, r * 3.2);
          halo.addColorStop(0, `rgba(223, 122, 254, ${0.42 * opacity})`);
          halo.addColorStop(1, "rgba(223, 122, 254, 0)");
          ctx.fillStyle = halo;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.fillStyle = node.survivor
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(255, 255, 255, ${Math.min(opacity, 0.35)})`;
        ctx.fill();
      }

      if (scanY >= 0) {
        const scanGrad = ctx.createLinearGradient(0, scanY - 140, 0, scanY + 140);
        scanGrad.addColorStop(0, "rgba(223, 122, 254, 0)");
        scanGrad.addColorStop(0.5, `rgba(223, 122, 254, ${0.35 * scanIntensity})`);
        scanGrad.addColorStop(1, "rgba(223, 122, 254, 0)");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 140, width, 280);

        ctx.strokeStyle = `rgba(223, 122, 254, ${0.85 * scanIntensity})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      raf = requestAnimationFrame(drawFrame);
    };

    if (reduce) {
      drawFrame(start);
    } else {
      raf = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
