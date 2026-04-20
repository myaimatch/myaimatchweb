import type { ReactNode } from "react";
import EngineStatusBar from "./EngineStatusBar";

type MatchEngineFrameProps = {
  toolCount: number;
  categoryCount: number;
  children: ReactNode;
};

const signals = ["Role", "Workflow", "Budget", "Team", "Goal", "Use case"];

export default function MatchEngineFrame({
  toolCount,
  categoryCount,
  children,
}: MatchEngineFrameProps) {
  return (
    <div className="match-engine-frame">
      <EngineStatusBar toolCount={toolCount} categoryCount={categoryCount} />
      <div className="engine-flow-preview" aria-hidden>
        <div className="engine-flow-inputs">
          {signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
        <svg viewBox="0 0 900 120" preserveAspectRatio="none">
          <path d="M40 28 C210 28 260 92 430 66 S650 20 860 58" />
          <path d="M40 88 C220 84 270 34 442 56 S672 102 860 38" />
          <path d="M88 58 C250 58 340 58 450 58 S680 58 812 58" />
        </svg>
        <div className="engine-flow-output">
          <span>Shortlist</span>
          <span>Fit notes</span>
          <span>Next step</span>
        </div>
      </div>
      <div className="match-engine-table">{children}</div>
    </div>
  );
}
