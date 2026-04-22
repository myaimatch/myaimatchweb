"use client";

import { useId } from "react";
import { useInView } from "./useInView";

type BlueprintDiagramProps = {
  type: "audit" | "stack" | "rollout" | "report";
};

export default function BlueprintDiagram({ type }: BlueprintDiagramProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const id = useId().replace(/:/g, "");

  return (
    <div ref={ref} className={`blueprint-diagram ${inView ? "is-visible" : ""}`} aria-hidden>
      <svg viewBox="0 0 220 120" role="img">
        <defs>
          <pattern id={`grid-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          </pattern>
          <linearGradient id={`line-${id}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#8468EB" />
          </linearGradient>
        </defs>
        <rect width="220" height="120" rx="14" fill={`url(#grid-${id})`} />
        {type === "audit" ? <AuditLines gradientId={`line-${id}`} /> : null}
        {type === "stack" ? <StackLines gradientId={`line-${id}`} /> : null}
        {type === "rollout" ? <RolloutLines gradientId={`line-${id}`} /> : null}
        {type === "report" ? <ReportLines gradientId={`line-${id}`} /> : null}
      </svg>
    </div>
  );
}

function AuditLines({ gradientId }: { gradientId: string }) {
  return (
    <g className="blueprint-strokes" stroke={`url(#${gradientId})`}>
      <path d="M28 34 C58 18 78 50 104 36 S152 24 190 42" />
      <path d="M30 78 C58 96 86 70 112 82 S156 100 190 74" />
      {[38, 76, 118, 164].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy={index % 2 ? 78 : 38} r="9" />
          {index === 1 ? <path d="M67 69 L85 87 M85 69 L67 87" /> : null}
        </g>
      ))}
      <path d="M139 34 l8 8 16 -18" />
    </g>
  );
}

function StackLines({ gradientId }: { gradientId: string }) {
  const nodes = [
    [110, 58],
    [72, 32],
    [148, 32],
    [68, 88],
    [152, 88],
    [110, 96],
  ];
  return (
    <g className="blueprint-strokes" stroke={`url(#${gradientId})`}>
      <path d="M110 58 L72 32 L68 88 L110 96 L152 88 L148 32 Z" />
      <path d="M72 32 L152 88 M148 32 L68 88 M110 58 L110 96" />
      {nodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 110 && y === 58 ? 12 : 8} />
      ))}
    </g>
  );
}

function RolloutLines({ gradientId }: { gradientId: string }) {
  return (
    <g className="blueprint-strokes" stroke={`url(#${gradientId})`}>
      <path d="M28 72 H192" />
      {[48, 110, 172].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy="72" r="10" />
          <path d={`M${x} 48 V62`} />
          <path d={`M${x - 18} 48 H${x + 18}`} />
          <path d={`M${x - 14} ${index === 0 ? 92 : 96} H${x + 14}`} />
        </g>
      ))}
      <path d="M38 26 H86 M98 26 H144 M156 26 H188" />
    </g>
  );
}

function ReportLines({ gradientId }: { gradientId: string }) {
  return (
    <g className="blueprint-strokes" stroke={`url(#${gradientId})`}>
      <path d="M62 22 H146 L170 46 V98 H62 Z" />
      <path d="M146 22 V46 H170" />
      <path d="M82 48 H132 M82 62 H150 M82 76 H142" />
      <path d="M74 96 C92 84 112 110 130 94 S162 86 176 100" />
      <circle cx="56" cy="94" r="8" />
      <circle cx="184" cy="96" r="8" />
    </g>
  );
}
