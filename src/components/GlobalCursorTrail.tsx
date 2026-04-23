"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let raf = 0;
    const points: Array<{ x: number; y: number; life: number }> = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMove = (event: PointerEvent) => {
      points.push({ x: event.clientX, y: event.clientY, life: 1 });
      if (points.length > 32) points.shift();
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        point.life -= 0.025;
        if (point.life <= 0) {
          points.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8 * point.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223,122,254,${0.12 * point.life})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handleMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="global-cursor-trail" aria-hidden />;
}
