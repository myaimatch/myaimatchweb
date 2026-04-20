type EngineStatusBarProps = {
  toolCount: number;
  categoryCount: number;
};

export default function EngineStatusBar({ toolCount, categoryCount }: EngineStatusBarProps) {
  const stats = [
    { label: "tools indexed", value: toolCount.toLocaleString("en-US") },
    { label: "categories mapped", value: categoryCount.toLocaleString("en-US") },
    { label: "matching signals", value: "6" },
    { label: "data source", value: "Airtable" },
  ];

  return (
    <div className="engine-status-bar" aria-label="AI Match Engine status">
      <div className="engine-status-live">
        <span aria-hidden />
        Live engine
      </div>
      <div className="engine-status-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
