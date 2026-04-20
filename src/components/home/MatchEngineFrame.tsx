import type { ReactNode } from "react";
import EngineStatusBar from "./EngineStatusBar";

type MatchEngineFrameProps = {
  toolCount: number;
  children: ReactNode;
};

export default function MatchEngineFrame({
  toolCount,
  children,
}: MatchEngineFrameProps) {
  return (
    <div className="match-engine-frame">
      <EngineStatusBar toolCount={toolCount} />
      <div className="engine-flow-preview" aria-hidden>
        <svg viewBox="0 0 900 170" preserveAspectRatio="none">
          <path d="M210 0 C210 42 315 54 315 96 C315 128 370 140 430 170" />
          <path d="M690 0 C690 42 585 54 585 96 C585 128 530 140 470 170" />
          <path d="M450 10 C450 52 450 96 450 170" />
        </svg>
      </div>
      <div className="match-engine-table">{children}</div>
    </div>
  );
}
