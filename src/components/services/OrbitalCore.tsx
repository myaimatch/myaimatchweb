"use client";

import { useEffect, useRef } from "react";

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function OrbitalCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.22;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.16;
    };

    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const t = reduce ? 0.65 : now * 0.001;
      const cx = width * 0.5;
      const cy = height * 0.48;
      const min = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(pointer.x);
      ctx.scale(1, 0.48 + pointer.y);

      [0.28, 0.39, 0.5].forEach((radiusFactor, i) => {
        const r = min * radiusFactor;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * (0.58 + i * 0.05), i * 0.34, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(223,122,254,${0.3 - i * 0.05})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const count = 5 + i * 2;
        for (let n = 0; n < count; n++) {
          const angle = t * (0.34 - i * 0.07) + (n / count) * Math.PI * 2 + i;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r * (0.58 + i * 0.05);
          const depth = (Math.sin(angle) + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, 2.2 + depth * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = n % 2 ? `rgba(255,255,255,${0.35 + depth * 0.34})` : `rgba(223,122,254,${0.44 + depth * 0.42})`;
          ctx.fill();
        }
      });

      ctx.restore();

      const corePulse = reduce ? 1 : 0.88 + Math.sin(t * 2) * 0.07;
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, min * 0.18 * corePulse);
      halo.addColorStop(0, "rgba(223,122,254,0.56)");
      halo.addColorStop(1, "rgba(223,122,254,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, min * 0.18 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.72)";
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, min * 0.065 * corePulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI Lead", cx, cy);

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
    <div ref={wrapRef} className="service-canvas-visual orbital-core" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
