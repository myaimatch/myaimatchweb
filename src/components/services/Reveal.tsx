"use client";

import { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "./useInView";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const combined: CSSProperties = {
    transitionDelay: `${delay}ms`,
    ...style,
  };

  return (
    <Tag
      ref={ref}
      className={`reveal-root ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={combined}
    >
      {children}
    </Tag>
  );
}
