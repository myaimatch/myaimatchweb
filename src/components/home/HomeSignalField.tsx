"use client";

import { useEffect, useRef } from "react";

type Signal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function HomeSignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;

    const signals: Signal[] = Array.from({ length: 54 }, (_, index) => ({
      x: ((index * 97) % 997) / 997,
      y: ((index * 173) % 991) / 991,
      vx: 0.00003 + (index % 5) * 0.000008,
      vy: 0.000018 + (index % 7) * 0.000005,
      r: 1.1 + (index % 4) * 0.45,
      alpha: 0.1 + (index % 5) * 0.035,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = Math.max(window.innerWidth, 1);
      height = Math.max(window.innerHeight * 2.2, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const scrollOffset = window.scrollY * 0.08;

      for (const signal of signals) {
        if (!reduce) {
          signal.x = (signal.x + signal.vx) % 1;
          signal.y = (signal.y + signal.vy) % 1;
        }

        const x = signal.x * width;
        const y = (signal.y * height + scrollOffset) % height;
        const pulse = reduce ? 1 : 0.65 + Math.sin(now * 0.0015 + x * 0.01) * 0.35;

        ctx.beginPath();
        ctx.arc(x, y, signal.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223,122,254,${signal.alpha * pulse})`;
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="home-signal-field" aria-hidden />;
}
