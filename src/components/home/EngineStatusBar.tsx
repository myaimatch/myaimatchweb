type EngineStatusBarProps = {
  toolCount: number;
};

export default function EngineStatusBar({ toolCount }: EngineStatusBarProps) {
  return (
    <div className="engine-status-bar" aria-label="Directory status">
      <div className="engine-status-live">
        <span aria-hidden />
        Live engine
      </div>
      <div className="engine-status-count">
        <strong>{toolCount.toLocaleString("en-US")}</strong>
        <span>tools curated</span>
      </div>
    </div>
  );
}
