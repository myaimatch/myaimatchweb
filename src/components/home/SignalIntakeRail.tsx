const signals = ["Workflow", "Team", "Budget", "Goals", "Industry", "Use Case"];

export default function SignalIntakeRail() {
  return (
    <div className="signal-intake-rail" aria-label="Signals used by the AI Match Engine">
      <div className="signal-intake-line" aria-hidden />
      <div className="signal-intake-chips">
        {signals.map((signal, index) => (
          <span key={signal} style={{ ["--delay" as string]: `${index * 120}ms` }}>
            {signal}
          </span>
        ))}
      </div>
      <p>Six signals in. One useful shortlist out.</p>
    </div>
  );
}
