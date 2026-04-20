"use client";

import { CSSProperties, ElementType, ReactNode, useRef } from "react";

type TiltCardProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
  scale?: number;
};

export default function TiltCard({
  children,
  as: Tag = "article",
  className = "",
  style,
  maxTilt = 6,
  scale = 1.01,
}: TiltCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const mx = (px / rect.width) * 100;
    const my = (py / rect.height) * 100;
    const rotY = ((px / rect.width) - 0.5) * 2 * maxTilt;
    const rotX = -((py / rect.height) - 0.5) * 2 * maxTilt;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-mx", `${mx}%`);
      el.style.setProperty("--tilt-my", `${my}%`);
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    });
  };

  const handleEnter = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-hovering");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.classList.remove("is-hovering");
    el.style.transform = "";
    el.style.setProperty("--tilt-mx", "50%");
    el.style.setProperty("--tilt-my", "50%");
  };

  return (
    <Tag
      ref={ref as never}
      className={`tilt-root ${className}`.trim()}
      style={style}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </Tag>
  );
}
