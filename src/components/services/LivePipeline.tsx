"use client";

import { useEffect, useRef } from "react";

type Particle = {
  path: number;
  offset: number;
  speed: number;
  size: number;
};

const paths = [
  { from: [0.18, 0.24], cp1: [0.34, 0.16], cp2: [0.5, 0.38], to: [0.7, 0.34] },
  { from: [0.15, 0.5], cp1: [0.35, 0.48], cp2: [0.45, 0.2], to: [0.7, 0.5] },
  { from: [0.2, 0.76], cp1: [0.38, 0.86], cp2: [0.52, 0.6], to: [0.7, 0.66] },
  { from: [0.42, 0.5], cp1: [0.52, 0.5], cp2: [0.62, 0.5], to: [0.79, 0.5] },
];

function bezier(a: number, b: number, c: number, d: number, t: number) {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function LivePipeline() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: 58 }, (_, i) => ({
      path: i % paths.length,
      offset: (i * 0.071) % 1,
      speed: 0.000045 + (i % 5) * 0.00001,
      size: 1.6 + (i % 4) * 0.35,
    }));

    let dpr = 1;
    let width = 1;
    let height = 1;
    let raf = 0;
    const reduce = reducedMotion();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    };

    const drawNode = (x: number, y: number, label: string, active = false) => {
      ctx.save();
      ctx.translate(x, y);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, active ? 58 : 42);
      glow.addColorStop(0, `rgba(223,122,254,${active ? 0.34 : 0.22})`);
      glow.addColorStop(1, "rgba(223,122,254,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, active ? 58 : 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.strokeStyle = active ? "rgba(223,122,254,0.62)" : "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-42, -18, 84, 36, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = active ? "#ffffff" : "rgba(255,255,255,0.72)";
      ctx.font = "700 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    };

    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(pointer.x, pointer.y);

      const bg = ctx.createRadialGradient(width * 0.58, height * 0.42, 0, width * 0.58, height * 0.42, width * 0.42);
      bg.addColorStop(0, "rgba(129,74,200,0.18)");
      bg.addColorStop(1, "rgba(129,74,200,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      paths.forEach((path, index) => {
        ctx.beginPath();
        ctx.moveTo(path.from[0] * width, path.from[1] * height);
        ctx.bezierCurveTo(
          path.cp1[0] * width,
          path.cp1[1] * height,
          path.cp2[0] * width,
          path.cp2[1] * height,
          path.to[0] * width,
          path.to[1] * height
        );
        ctx.strokeStyle = index === 3 ? "rgba(223,122,254,0.34)" : "rgba(255,255,255,0.12)";
        ctx.lineWidth = index === 3 ? 1.4 : 1;
        ctx.stroke();
      });

      particles.forEach((particle) => {
        const path = paths[particle.path];
        const t = reduce ? particle.offset : (particle.offset + now * particle.speed) % 1;
        const x = bezier(path.from[0], path.cp1[0], path.cp2[0], path.to[0], t) * width;
        const y = bezier(path.from[1], path.cp1[1], path.cp2[1], path.to[1], t) * height;
        const alpha = Math.sin(t * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223,122,254,${0.18 + alpha * 0.7})`;
        ctx.fill();
      });

      drawNode(width * 0.18, height * 0.24, "Tools");
      drawNode(width * 0.15, height * 0.5, "Data");
      drawNode(width * 0.2, height * 0.76, "Team");
      drawNode(width * 0.42, height * 0.5, "Agent", true);

      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.strokeStyle = "rgba(223,122,254,0.34)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width * 0.72, height * 0.28, width * 0.2, height * 0.44, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "800 12px Inter, sans-serif";
      ctx.fillText("Working stack", width * 0.82, height * 0.36);
      for (let i = 0; i < 4; i++) {
        const progress = reduce ? 0.78 : 0.34 + 0.5 * Math.abs(Math.sin(now * 0.001 + i));
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(width * 0.755, height * (0.44 + i * 0.07), width * 0.13, 4);
        ctx.fillStyle = "rgba(223,122,254,0.74)";
        ctx.fillRect(width * 0.755, height * (0.44 + i * 0.07), width * 0.13 * progress, 4);
      }
      ctx.restore();

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", handlePointer, { passive: true });
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  return (
    <div ref={wrapRef} className="service-canvas-visual live-pipeline" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
