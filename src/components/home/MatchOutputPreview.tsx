export default function MatchOutputPreview() {
  return (
    <div className="match-output-preview" aria-hidden>
      <div className="match-output-card">
        <div className="match-output-header">
          <span />
          <span />
          <span />
        </div>
        <p>Recommended stack</p>
        <div className="match-output-blueprint">
          <svg viewBox="0 0 260 150">
            <path d="M130 70 L78 42 L70 106 L130 122 L190 104 L182 42 Z" />
            <path d="M78 42 L190 104 M182 42 L70 106 M130 70 L130 122" />
            <circle cx="130" cy="70" r="13" />
            <circle cx="78" cy="42" r="8" />
            <circle cx="182" cy="42" r="8" />
            <circle cx="70" cy="106" r="8" />
            <circle cx="190" cy="104" r="8" />
            <circle cx="130" cy="122" r="8" />
          </svg>
        </div>
        <div className="match-output-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="match-output-chips">
        <span>Shortlist</span>
        <span>Fit notes</span>
        <span>Next step</span>
      </div>
    </div>
  );
}
